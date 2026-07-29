import prisma from "@/lib/prisma";

export function slugifyArticleTitle(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .substring(0, 70)
    .replace(/(^-|-$)+/g, "");

  return slug || `article-${Date.now().toString(36)}`;
}

export async function createUniqueArticleSlug(
  value: string,
  options?: { ignoreSlug?: string }
) {
  const baseSlug = slugifyArticleTitle(value);

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`;
    const existingArticle = await prisma.article.findUnique({
      where: { slug: candidate },
      select: { slug: true },
    });

    if (!existingArticle || existingArticle.slug === options?.ignoreSlug) {
      return candidate;
    }
  }

  return `${baseSlug}-${Date.now().toString(36)}`;
}
