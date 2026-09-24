-- CreateTable
CREATE TABLE "ReaderAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReaderAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReaderSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderLike" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,

    CONSTRAINT "ReaderLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderComment" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "readerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReaderComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderReport" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReaderReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileContent" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "captionUrl" TEXT,
    "seriesName" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobileContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileRateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileRateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReaderAccount_username_key" ON "ReaderAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderAccount_email_key" ON "ReaderAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderSession_tokenHash_key" ON "ReaderSession"("tokenHash");

-- CreateIndex
CREATE INDEX "ReaderSession_readerId_idx" ON "ReaderSession"("readerId");

-- CreateIndex
CREATE INDEX "ReaderLike_target_idx" ON "ReaderLike"("target");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderLike_readerId_target_key" ON "ReaderLike"("readerId", "target");

-- CreateIndex
CREATE INDEX "ReaderComment_target_approved_createdAt_idx" ON "ReaderComment"("target", "approved", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderReport_readerId_target_key" ON "ReaderReport"("readerId", "target");

-- CreateIndex
CREATE INDEX "MobileContent_kind_published_createdAt_idx" ON "MobileContent"("kind", "published", "createdAt");

-- CreateIndex
CREATE INDEX "MobileRateLimit_expiresAt_idx" ON "MobileRateLimit"("expiresAt");

-- AddForeignKey
ALTER TABLE "ReaderSession" ADD CONSTRAINT "ReaderSession_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "ReaderAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderLike" ADD CONSTRAINT "ReaderLike_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "ReaderAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderComment" ADD CONSTRAINT "ReaderComment_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "ReaderAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderReport" ADD CONSTRAINT "ReaderReport_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "ReaderAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

