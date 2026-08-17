-- AlterTable: Product
ALTER TABLE "Product" ADD COLUMN "shortDescription" TEXT,
ADD COLUMN "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN "compareAtPriceCents" INTEGER,
ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "metadata" JSONB;

-- AlterTable: Order
ALTER TABLE "Order" ADD COLUMN "eazebusOrderId" TEXT,
ADD COLUMN "eazebusPaymentId" TEXT,
ADD COLUMN "customerEmail" TEXT,
ADD COLUMN "customerName" TEXT,
ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Order_eazebusOrderId_key" ON "Order"("eazebusOrderId");
