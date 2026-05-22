-- CreateTable
CREATE TABLE "GearImage" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "gearItemId" TEXT NOT NULL,
    "originalKey" TEXT NOT NULL,
    "fullKey" TEXT NOT NULL,
    "thumbKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GearImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GearImage_gearItemId_idx" ON "GearImage"("gearItemId");

-- CreateIndex
CREATE INDEX "GearImage_ownerId_idx" ON "GearImage"("ownerId");

-- AddForeignKey
ALTER TABLE "GearImage" ADD CONSTRAINT "GearImage_gearItemId_fkey" FOREIGN KEY ("gearItemId") REFERENCES "GearItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearImage" ADD CONSTRAINT "GearImage_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
