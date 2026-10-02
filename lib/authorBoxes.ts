import { canonicalAuthorName } from "@/lib/seo";

export interface AuthorBoxProfile {
  name: string;
  photoUrl: string;
  photoAlt: string;
  jobTitle: string;
  organizationName: string;
  bio: string;
}

/**
 * Opinion author boxes, keyed by canonical author name.
 * Add another writer by inserting one entry under that name.
 */
export const authorBoxes: Record<string, AuthorBoxProfile> = {
  "Fizaa Madhok": {
    name: "Fizaa Madhok",
    photoUrl:
      "https://8mjpruwgqc0qkgho.public.blob.vercel-storage.com/dalimss-news/articles/image/1790920701678-fizaa-madhok-author-yOWjDXzHieFjnT0R7JshNaOVRrKaYH.jpg",
    photoAlt: "Fizaa Madhok",
    jobTitle: "Additional Director",
    organizationName: "Dalimss Sunbeam Group of Schools",
    bio: "Fizaa Madhok is Additional Director at the Dalimss Sunbeam Group of Schools. She gives her working hours to the betterment of the foundation school and works with toddlers who struggle with separation anxiety. Fizaa writes about parenting and working women.",
  },
};

export function getAuthorBox(
  name: string | null | undefined
): AuthorBoxProfile | null {
  if (!name) return null;
  return authorBoxes[canonicalAuthorName(name)] ?? null;
}
