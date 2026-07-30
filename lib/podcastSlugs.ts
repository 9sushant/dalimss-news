import prisma from "@/lib/prisma";

export function slugifyPodcastTitle(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .substring(0, 80)
    .replace(/(^-|-$)+/g, "");

  return slug || `episode-${Date.now().toString(36)}`;
}

export async function createUniquePodcastSlug(value: string) {
  const baseSlug = slugifyPodcastTitle(value);

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
    const existingEpisode = await prisma.podcastEpisode.findUnique({
      where: { slug: candidate },
      select: { slug: true },
    });

    if (!existingEpisode) {
      return candidate;
    }
  }

  return `${baseSlug}-${Date.now().toString(36)}`;
}
