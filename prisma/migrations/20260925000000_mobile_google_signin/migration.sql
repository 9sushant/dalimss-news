-- AlterTable
ALTER TABLE "ReaderAccount" ADD COLUMN     "googleSubject" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MobileAuthGrant" (
    "codeHash" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "googleSubject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileAuthGrant_pkey" PRIMARY KEY ("codeHash")
);

-- CreateIndex
CREATE INDEX "MobileAuthGrant_expiresAt_idx" ON "MobileAuthGrant"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderAccount_googleSubject_key" ON "ReaderAccount"("googleSubject");

