CREATE TABLE "AuthorProfile" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "bio" TEXT,
  "beat" TEXT,
  "experience" TEXT,
  "imageUrl" TEXT,
  "professionalUrl" TEXT,
  "email" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AuthorProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuthorProfile_slug_key" ON "AuthorProfile"("slug");
