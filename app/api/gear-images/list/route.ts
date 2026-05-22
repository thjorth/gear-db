import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";
import { getApiUser } from "@/lib/api-auth";
import { r2Client, r2Config } from "@/lib/r2";

export async function GET(request: Request) {
  const user = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const gearItemId = searchParams.get("gearItemId");
  if (!gearItemId) {
    return NextResponse.json(
      { error: "Missing gear item id." },
      { status: 400 }
    );
  }

  const gearItem = await prisma.gearItem.findFirst({
    where: { id: gearItemId, ownerId: user.id, deletedAt: null },
    select: { id: true },
  });

  if (!gearItem) {
    return NextResponse.json({ error: "Gear item not found." }, { status: 404 });
  }

  const images = await prisma.gearImage.findMany({
    where: { gearItemId: gearItem.id, ownerId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const signedImages = await Promise.all(
    images.map(async (image) => {
      const [thumbUrl, fullUrl] = await Promise.all([
        getSignedUrl(
          r2Client,
          new GetObjectCommand({
            Bucket: r2Config.bucket,
            Key: image.thumbKey,
          }),
          { expiresIn: 300 }
        ),
        getSignedUrl(
          r2Client,
          new GetObjectCommand({
            Bucket: r2Config.bucket,
            Key: image.fullKey,
          }),
          { expiresIn: 300 }
        ),
      ]);

      return {
        id: image.id,
        thumbUrl,
        fullUrl,
      };
    })
  );

  return NextResponse.json({ images: signedImages });
}
