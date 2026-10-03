import { canonicalAuthorName } from "@/lib/seo";

export interface AuthorBoxProfile {
  name: string;
  photoUrl: string;
  photoAlt: string;
  jobTitle: string;
  organizationName: string;
  bio: string;
  /** Schools named in the bio. Author pages use these for Person JSON-LD. */
  alumniOf?: string[];
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
    alumniOf: ["Banaras Hindu University"],
  },
  "Appurva Singh": {
    name: "Appurva Singh",
    photoUrl: "/newsroom-portraits/appurva-singh.png",
    photoAlt: "Appurva Singh, Journalist and News Anchor at Dalimss News",
    jobTitle: "Journalist and News Anchor",
    organizationName: "Dalimss News",
    bio: "Appurva Singh is a Journalist and News Anchor at Dalimss News. She completed her graduation in Mass Communication from the School of Management Sciences (SMS), Varanasi, and is now pursuing her postgraduate studies in Mass Communication at Mahatma Gandhi Kashi Vidyapith (MGKVP), Varanasi. She reports and presents the news with a focus on clear facts and on stories that connect with people, aiming to make news easier to follow and more meaningful for viewers.",
    alumniOf: [
      "School of Management Sciences, Varanasi",
      "Mahatma Gandhi Kashi Vidyapith",
    ],
  },
};

export function getAuthorBox(
  name: string | null | undefined
): AuthorBoxProfile | null {
  if (!name) return null;
  return authorBoxes[canonicalAuthorName(name)] ?? null;
}
