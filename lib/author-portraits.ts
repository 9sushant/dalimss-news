import { authorSlug } from "@/lib/seo";

// Named newsroom portraits. Keep aliases explicit to avoid matching unrelated people.
const AUTHOR_PORTRAITS: Record<string, string> = {
  "a-rudraksh-sehgal": "rudraksh-sehgal",
  "aditya-rudraksh-sehgal": "rudraksh-sehgal",
  "rudraksh-sehgal": "rudraksh-sehgal",
  "ajay-kumar-verma": "ajay-kumar-verma",
  "anamika-pandey": "anamika-pandey",
  "ankit-kr-prajapati": "ankit-kr-prajapati",
  "anurag-pandey": "anurag-pandey",
  "appurva-singh": "appurva-singh",
  "arjun-shahani": "arjun-shahani",
  "bhajan-singh": "bhajan-singh",
  "ishant-srivastava": "ishant-srivastava",
  "jhinuk-barman": "jhinuk-barman",
  "pankaj-yadav": "pankaj-yadav",
  "rana-anshuman-singh": "rana-anshuman-singh",
  "saurav-yadav": "saurav-yadav",
  "shivam-iyer": "shivam-iyer",
  "sonu-kumar": "sonu-kumar",
  "tanishka-upadhyay": "tanishka-upadhyay",
  "vineet-kumar-pandey": "vineet-kumar-pandey",
};

export function getAuthorPortrait(name: string): string | null {
  const portrait = AUTHOR_PORTRAITS[authorSlug(name)];
  return portrait ? `/authors/${portrait}.png` : null;
}
