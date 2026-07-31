ALTER TABLE "Article"
ADD COLUMN "sourceUrls" JSONB,
ADD COLUMN "imageCaption" TEXT;

UPDATE "Article"
SET "customAuthor" = 'Maahir Madhok'
WHERE LOWER(TRIM("customAuthor")) = 'maahr madhok';
