-- AlterTable
ALTER TABLE "User"
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "screenName" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "city" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_screenName_key" ON "User"("screenName");
