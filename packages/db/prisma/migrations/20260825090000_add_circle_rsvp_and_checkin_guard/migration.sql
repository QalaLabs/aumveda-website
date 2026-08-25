-- AlterTable
ALTER TABLE "ChallengeParticipation" ADD COLUMN     "lastCheckInAt" DATE;

-- CreateTable
CREATE TABLE "LiveCircleRSVP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveCircleRSVP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveCircleRSVP_userId_circleId_key" ON "LiveCircleRSVP"("userId", "circleId");

-- AddForeignKey
ALTER TABLE "LiveCircleRSVP" ADD CONSTRAINT "LiveCircleRSVP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveCircleRSVP" ADD CONSTRAINT "LiveCircleRSVP_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "LiveCircle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
