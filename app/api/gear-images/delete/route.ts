import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/api-auth";
import { r2Client, r2Config } from "@/lib/r2";

export async function POST(request: Request) {
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { gearImageId?: string };
  if (!body.gearImageId) {
    return NextResponse.json(
      { error: "Missing gear image id." },
      { status: 400 }
    );
  }

  const image = await prisma.gearImage.findFirst({
    where: { id: body.gearImageId, ownerId: user.id },
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  await Promise.all([
    r2Client.send(
      new DeleteObjectCommand({
        Bucket: r2Config.bucket,
        Key: image.originalKey,
      })
    ),
    r2Client.send(
      new DeleteObjectCommand({
        Bucket: r2Config.bucket,
        Key: image.fullKey,
      })
    ),
    r2Client.send(
      new DeleteObjectCommand({
        Bucket: r2Config.bucket,
        Key: image.thumbKey,
      })
    ),
  ]);

  await prisma.gearImage.delete({ where: { id: image.id } });

  return NextResponse.json({ success: true });
}
