import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/api-auth";
import { r2Client, r2Config } from "@/lib/r2";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_GEAR_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
  buildOriginalImageKey,
} from "@/lib/gear-images";

export async function POST(request: Request) {
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json()) as {
    gearItemId?: string;
    filename?: string;
    contentType?: string;
    size?: number;
  };

  if (!body.gearItemId || !body.filename || !body.contentType || !body.size) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (!ALLOWED_IMAGE_TYPES.includes(body.contentType as never)) {
    return NextResponse.json(
      { error: "Unsupported image type." },
      { status: 400 }
    );
  }

  if (body.size <= 0 || body.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image is too large." },
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

  const existingCount = await prisma.gearImage.count({
    where: { gearItemId: gearItem.id, ownerId: user.id },
  });

  if (existingCount >= MAX_GEAR_IMAGES) {
    return NextResponse.json(
      { error: "Maximum of 8 images per item." },
      { status: 400 }
    );
  }

  const key = buildOriginalImageKey(user.id, gearItem.id, body.filename);
  const uploadUrl = await getSignedUrl(
    r2Client,
    new PutObjectCommand({
      Bucket: r2Config.bucket,
      Key: key,
      ContentType: body.contentType,
      ContentLength: body.size,
    }),
    { expiresIn: 900 }
  );

  return NextResponse.json({
    uploadUrl,
    key,
    expiresIn: 900,
  });
}
