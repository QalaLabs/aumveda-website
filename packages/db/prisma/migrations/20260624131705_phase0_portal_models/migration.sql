-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthLat" DOUBLE PRECISION,
ADD COLUMN     "birthLng" DOUBLE PRECISION,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "moonSign" TEXT,
ADD COLUMN     "placeOfBirth" TEXT,
ADD COLUMN     "risingSign" TEXT,
ADD COLUMN     "sunSign" TEXT,
ADD COLUMN     "timeOfBirth" TEXT;

-- CreateTable
CREATE TABLE "DailyDoseOverride" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "practiceType" TEXT NOT NULL,
    "instructionText" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyDoseOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyDoseDelivery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "contentJson" TEXT NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "channel" TEXT NOT NULL DEFAULT 'whatsapp',
    "deliveryStatus" TEXT NOT NULL DEFAULT 'pending',
    "failureReason" TEXT,
    "overrideSource" TEXT,

    CONSTRAINT "DailyDoseDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPortalData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chakraSelected" TEXT,
    "archetypeSelected" TEXT,
    "tarotCard" TEXT,
    "tarotTheme" TEXT,
    "intentionText" TEXT,
    "q1Answer" TEXT,
    "q2Answer" TEXT,
    "q3Answer" TEXT,
    "q4Answer" TEXT,
    "q5Answer" TEXT,
    "q6Answer" TEXT,
    "q7Answer" TEXT,
    "nervousSystemScore" TEXT,
    "relationshipScore" TEXT,
    "childhoodScore" TEXT,
    "financialScore" TEXT,
    "profileResult" TEXT,
    "portalCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPortalData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "practitioner" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "bookingDatetime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amountPaid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "razorpayPaymentId" TEXT,
    "zoomLink" TEXT,
    "calendlyEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapySession" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT,
    "userId" TEXT NOT NULL,
    "practitioner" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "keyThemes" TEXT[],
    "practicesAssigned" TEXT[],
    "nextSessionRecommendation" TEXT,
    "distressFlag" BOOLEAN NOT NULL DEFAULT false,
    "recordingUrl" TEXT,
    "notesSubmittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "sessionsTotal" INTEGER NOT NULL,
    "sessionsUsed" INTEGER NOT NULL DEFAULT 0,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "circlesAttended" INTEGER NOT NULL DEFAULT 0,
    "challengesCompleted" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CommunityMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextBillingDate" TIMESTAMP(3) NOT NULL,
    "razorpaySubscriptionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveCircle" (
    "id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "zoomLink" TEXT NOT NULL,
    "attendeeCount" INTEGER NOT NULL DEFAULT 0,
    "recordingUrl" TEXT,
    "recordingAvailableAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveCircle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "profileTargets" TEXT[],
    "chakraTargets" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeParticipation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysCompleted" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ChallengeParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChakraReveal" (
    "id" TEXT NOT NULL,
    "chakraName" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "blockedText" TEXT NOT NULL,
    "showsUpAs" TEXT NOT NULL,

    CONSTRAINT "ChakraReveal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchetypeReveal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "gift" TEXT NOT NULL,
    "wound" TEXT NOT NULL,
    "showsUpAs" TEXT NOT NULL,

    CONSTRAINT "ArchetypeReveal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarotTheme" (
    "id" TEXT NOT NULL,
    "themeName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "cardNames" TEXT[],

    CONSTRAINT "TarotTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartPrediction" (
    "id" TEXT NOT NULL,
    "placementType" TEXT NOT NULL,
    "sign" TEXT NOT NULL,
    "predictionText" TEXT NOT NULL,

    CONSTRAINT "ChartPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternQuestion" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "options" JSONB NOT NULL,

    CONSTRAINT "PatternQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternScoring" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "dimensionValue" TEXT NOT NULL,

    CONSTRAINT "PatternScoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternProfile" (
    "id" TEXT NOT NULL,
    "profileName" TEXT NOT NULL,
    "nsMatch" TEXT NOT NULL,
    "relMatch" TEXT NOT NULL,
    "childhoodMatch" TEXT NOT NULL,
    "profileText" TEXT NOT NULL,

    CONSTRAINT "PatternProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "creatorHandle" TEXT,
    "muxAssetId" TEXT NOT NULL,
    "healingModality" TEXT NOT NULL,
    "profileTags" TEXT[],
    "chakraTag" TEXT,
    "durationSeconds" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentView" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionPercent" DOUBLE PRECISION,

    CONSTRAINT "ContentView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyDoseDelivery_userId_date_key" ON "DailyDoseDelivery"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UserPortalData_userId_key" ON "UserPortalData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TherapySession_bookingId_key" ON "TherapySession"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityMember_userId_key" ON "CommunityMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeParticipation_userId_challengeId_key" ON "ChallengeParticipation"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChakraReveal_chakraName_key" ON "ChakraReveal"("chakraName");

-- CreateIndex
CREATE UNIQUE INDEX "ArchetypeReveal_name_key" ON "ArchetypeReveal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TarotTheme_themeName_key" ON "TarotTheme"("themeName");

-- CreateIndex
CREATE UNIQUE INDEX "ChartPrediction_placementType_sign_key" ON "ChartPrediction"("placementType", "sign");

-- CreateIndex
CREATE UNIQUE INDEX "PatternQuestion_questionId_key" ON "PatternQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "PatternScoring_questionId_answer_key" ON "PatternScoring"("questionId", "answer");

-- CreateIndex
CREATE UNIQUE INDEX "PatternProfile_profileName_key" ON "PatternProfile"("profileName");

-- AddForeignKey
ALTER TABLE "DailyDoseOverride" ADD CONSTRAINT "DailyDoseOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDoseDelivery" ADD CONSTRAINT "DailyDoseDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPortalData" ADD CONSTRAINT "UserPortalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapySession" ADD CONSTRAINT "TherapySession_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapySession" ADD CONSTRAINT "TherapySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipation" ADD CONSTRAINT "ChallengeParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipation" ADD CONSTRAINT "ChallengeParticipation_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentView" ADD CONSTRAINT "ContentView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
