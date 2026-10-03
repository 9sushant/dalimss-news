import { canonicalAuthorName } from "@/lib/seo";

export interface AuthorBoxProfile {
  name: string;
  photoUrl: string;
  photoAlt: string;
  jobTitle: string;
  organizationName: string;
  bio: string;
  /** University named in the bio. Author pages use this for Person JSON-LD. */
  alumniOf?: string;
}

/**
 * Curated author boxes, keyed by canonical author name.
 * Add a writer by inserting one entry under that name.
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
  "Jhinuk Barman": {
    name: "Jhinuk Barman",
    photoUrl: "/newsroom-portraits/jhinuk-barman.png",
    photoAlt:
      "Jhinuk Barman, Content Head for Education at Dalimss News",
    jobTitle: "Content Head, Education",
    organizationName: "Dalimss News",
    bio: "Jhinuk Barman is Content Head for Education at Dalimss News. Originally from Assam, she is based in Varanasi and holds a postgraduate degree in Philosophy from Banaras Hindu University (BHU). She leads the education desk's content and also works on social issues, interviews, ground reports and digital journalism. Her philosophy background and her interest in gender and society shape how she reports. She looks past the headline to why a story matters and explains complicated subjects in plain language.",
    alumniOf: "Banaras Hindu University",
  },
};

export function getAuthorBox(
  name: string | null | undefined
): AuthorBoxProfile | null {
  if (!name) return null;
  return authorBoxes[canonicalAuthorName(name)] ?? null;
}
