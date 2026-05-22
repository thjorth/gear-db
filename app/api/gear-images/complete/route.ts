import { NextResponse } from "next/server";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/api-auth";
import { r2Client, r2Config } from "@/lib/r2";
import {
  ALLOWED_IMAGE_TYPES,
  FULL_IMAGE_MAX_SIZE,
  THUMB_IMAGE_MAX_SIZE,
  MAX_GEAR_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
  gearImageKeyPrefix,
} from "@/lib/gear-images";

const streamToBuffer = async (
  stream: Readable | ReadableStream | null | undefined
) => {
  if (!stream) return Buffer.alloc(0);
  if (stream instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
};

export async function POST(request: Request) {
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json()) as {
    gearItemId?: string;
    key?: string;
  };

  if (!body.gearItemId || !body.key) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const gearItem = await prisma.gearItem.findFirst({
    where: {
      id: body.gearItemId,
      ownerId: user.id,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!gearItem) {
    return NextResponse.json({ error: "Gear item not found." }, { status: 404 });
  }

  const prefix = gearImageKeyPrefix(user.id, gearItem.id);
  if (!body.key.startsWith(prefix)) {
    return NextResponse.json({ error: "Invalid image key." }, { status: 400 });
  }

  const existingCount = await prisma.gearImage.count({
    where: { gearItemId: gearItem.id, ownerId: user.id },
  });

  if (existingCount >= MAX_GEAR_IMAGES) {
    await r2Client.send(
      new DeleteObjectCommand({ Bucket: r2Config.bucket, Key: body.key })
    );
    return NextResponse.json(
      { error: "Maximum of 8 images per item." },
      { status: 400 }
    );
  }

  const head = await r2Client.send(
    new HeadObjectCommand({ Bucket: r2Config.bucket, Key: body.key })
  );

  if (!head.ContentType || !ALLOWED_IMAGE_TYPES.includes(head.ContentType as never)) {
    return NextResponse.json(
      { error: "Unsupported image type." },
      { status: 400 }
    );
  }

  if (head.ContentLength && head.ContentLength > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image is too large." },
      { status: 400 }
    );
  }

  const original = await r2Client.send(
    new GetObjectCommand({ Bucket: r2Config.bucket, Key: body.key })
  );
  const originalBuffer = await streamToBuffer(original.Body ?? null);

  const fullBuffer = await sharp(originalBuffer)
    .rotate()
    .resize({
      width: FULL_IMAGE_MAX_SIZE,
      height: FULL_IMAGE_MAX_SIZE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82 })
    .toBuffer();

  const thumbBuffer = await sharp(originalBuffer)
    .rotate()
    .resize({
      width: THUMB_IMAGE_MAX_SIZE,
      height: THUMB_IMAGE_MAX_SIZE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 74 })
    .toBuffer();

  const baseKey = body.key.replace(/\.[^/.]+$/, "");
  const fullKey = `${baseKey}-full.jpg`;
  const thumbKey = `${baseKey}-thumb.jpg`;

  await Promise.all([
    r2Client.send(
      new PutObjectCommand({
        Bucket: r2Config.bucket,
        Key: fullKey,
        Body: fullBuffer,
        ContentType: "image/jpeg",
      })
    ),
    r2Client.send(
      new PutObjectCommand({
        Bucket: r2Config.bucket,
        Key: thumbKey,
        Body: thumbBuffer,
        ContentType: "image/jpeg",
      })
    ),
  ]);

  const gearImage = await prisma.gearImage.create({
    data: {
      ownerId: user.id,
      gearItemId: gearItem.id,
      originalKey: body.key,
      fullKey,
      thumbKey,
    },
  });

  return NextResponse.json({ gearImage });
}
