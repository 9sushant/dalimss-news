import { Prisma } from "@prisma/client";

/**
 * English homepage, /articles, category pages, and English feeds stay
 * single-language. Hindi stories are listed on /hindi instead.
 * Any language other than "hi" remains on the English surfaces.
 */
export const englishArticleWhere: Prisma.ArticleWhereInput = {
  NOT: { language: "hi" },
};

export const hindiArticleWhere: Prisma.ArticleWhereInput = {
  language: "hi",
};

export function isHindiLanguage(language: string | null | undefined): boolean {
  return language === "hi";
}
