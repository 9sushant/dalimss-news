-- CreateTable
CREATE TABLE "PodcastEpisode" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "showName" TEXT NOT NULL DEFAULT 'Dalimss News Podcasts',
    "hostName" TEXT NOT NULL,
    "guestNames" TEXT,
    "category" TEXT,
    "language" TEXT NOT NULL DEFAULT 'Hindi',
    "seasonNumber" INTEGER,
    "episodeNumber" INTEGER,
    "duration" INTEGER,
    "coverImage" TEXT NOT NULL,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "mediaBytes" TEXT,
    "mediaMimeType" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'audio',
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "PodcastEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PodcastEpisode_slug_key" ON "PodcastEpisode"("slug");

-- CreateIndex
CREATE INDEX "PodcastEpisode_published_publishedAt_idx" ON "PodcastEpisode"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "PodcastEpisode_category_idx" ON "PodcastEpisode"("category");

-- AddForeignKey
ALTER TABLE "PodcastEpisode" ADD CONSTRAINT "PodcastEpisode_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
