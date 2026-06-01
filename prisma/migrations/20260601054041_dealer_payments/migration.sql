-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'ONLINE');

-- CreateTable
CREATE TABLE "public"."DealerBill" (
    "id" SERIAL NOT NULL,
    "dealerId" TEXT NOT NULL,
    "billNumber" TEXT,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealerBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DealerPayment" (
    "id" SERIAL NOT NULL,
    "dealerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealerPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DealerBill_dealerId_idx" ON "public"."DealerBill"("dealerId");

-- CreateIndex
CREATE INDEX "DealerPayment_dealerId_idx" ON "public"."DealerPayment"("dealerId");

-- AddForeignKey
ALTER TABLE "public"."DealerBill" ADD CONSTRAINT "DealerBill_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."dealers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DealerPayment" ADD CONSTRAINT "DealerPayment_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."dealers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
