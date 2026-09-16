-- Adds indexes on foreign-key / filter / sort columns that are queried in hot
-- paths (dashboard, admin, cron) but were never indexed, since Postgres does
-- not auto-index scalar relation columns the way MySQL does.

-- Order: "my orders" (userId), admin order list filters (status), sort (createdAt)
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- OrderItem: joins back to Order and Product
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- Module: course detail page loads all modules for a course
CREATE INDEX "Module_courseId_idx" ON "Module"("courseId");

-- Enrolment: "who is enrolled in course X" (existing unique index leads with userId)
CREATE INDEX "Enrolment_courseId_idx" ON "Enrolment"("courseId");

-- CourseProgress: reverse lookup by module (existing unique index leads with userId)
CREATE INDEX "CourseProgress_moduleId_idx" ON "CourseProgress"("moduleId");

-- DailyDoseOverride: per-user override lookups
CREATE INDEX "DailyDoseOverride_userId_idx" ON "DailyDoseOverride"("userId");

-- DailyDoseDelivery: cron "who needs today's delivery" scans by date across all users
CREATE INDEX "DailyDoseDelivery_date_idx" ON "DailyDoseDelivery"("date");

-- Booking: dashboard/practitioner appointment lists, cron reminder windows
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");
CREATE INDEX "Booking_status_bookingDatetime_idx" ON "Booking"("status", "bookingDatetime");

-- TherapySession: per-user session history
CREATE INDEX "TherapySession_userId_idx" ON "TherapySession"("userId");

-- Package: per-user session-package lookups
CREATE INDEX "Package_userId_idx" ON "Package"("userId");

-- Subscription: billing cron scans by status + next billing date
CREATE INDEX "Subscription_status_nextBillingDate_idx" ON "Subscription"("status", "nextBillingDate");

-- LiveCircleRSVP: "who RSVP'd to circle X" (existing unique index leads with userId)
CREATE INDEX "LiveCircleRSVP_circleId_idx" ON "LiveCircleRSVP"("circleId");

-- ChallengeParticipation: "who is in challenge X" (existing unique index leads with userId)
CREATE INDEX "ChallengeParticipation_challengeId_idx" ON "ChallengeParticipation"("challengeId");

-- Reel: published-feed queries sorted by publish date
CREATE INDEX "Reel_isPublished_publishedAt_idx" ON "Reel"("isPublished", "publishedAt");

-- ContentView: per-user view history, per-content view/completion analytics
CREATE INDEX "ContentView_userId_idx" ON "ContentView"("userId");
CREATE INDEX "ContentView_contentType_contentId_idx" ON "ContentView"("contentType", "contentId");
