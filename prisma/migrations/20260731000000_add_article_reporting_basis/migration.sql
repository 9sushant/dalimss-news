ALTER TABLE "Article"
ADD COLUMN "reportingBasis" TEXT,
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';
