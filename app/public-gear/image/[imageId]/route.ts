import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { r2Client, r2Config } from "@/lib/r2";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ imageId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { imageId } = await context.params;
  const size = request.nextUrl.searchParams.get("size") === "full" ? "full" : "thumb";

  const image = await prisma.gearImage.findFirst({
    where: {
      id: imageId,
      gearItem: {
        isPublic: true,
        deletedAt: null,
      },
    },
    select: {
      thumbKey: true,
      fullKey: true,
    },
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const key = size === "full" ? image.fullKey : image.thumbKey;
  const signedUrl = await getSignedUrl(
    r2Client,
    new GetObjectCommand({ Bucket: r2Config.bucket, Key: key }),
    { expiresIn: 300 }
  );

  const response = NextResponse.redirect(signedUrl, { status: 307 });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}
