-- CreateEnum
CREATE TYPE "GearCategory" AS ENUM ('GUITAR', 'SYNTH', 'AMP', 'PEDAL', 'MIC', 'INTERFACE', 'OTHER');

-- CreateTable
CREATE TABLE "GearItem" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "category" "GearCategory" NOT NULL DEFAULT 'OTHER',
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT,
    "year" INTEGER,
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DOUBLE PRECISION,
    "currency" TEXT,
    "estimatedValue" DOUBLE PRECISION,
    "condition" TEXT,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GearItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GearItem_ownerId_deletedAt_idx" ON "GearItem"("ownerId", "deletedAt");

-- CreateIndex
CREATE INDEX "GearItem_serialNumber_idx" ON "GearItem"("serialNumber");

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
