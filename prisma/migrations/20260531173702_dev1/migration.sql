-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dealers" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dealers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_label_key" ON "public"."products"("label");

-- CreateIndex
CREATE UNIQUE INDEX "products_value_key" ON "public"."products"("value");

-- CreateIndex
CREATE UNIQUE INDEX "dealers_label_key" ON "public"."dealers"("label");

-- CreateIndex
CREATE UNIQUE INDEX "dealers_value_key" ON "public"."dealers"("value");
