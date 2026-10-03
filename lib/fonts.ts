import {
  Inter,
  Lora,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
});

export const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-lora",
});

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-devanagari",
});

export const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-devanagari",
});

/**
 * next/font quotes these names. A React style child would escape the
 * quotes, so they are removed. The names are CSS identifiers.
 * First paint uses only the size-adjusted fallback. The font files are
 * applied after hydration, which keeps them off the LCP path.
 */
function fontNames(family: string) {
  const parts = family.replace(/['"]/g, "").split(",").map((part) => part.trim());
  return { fallback: parts[1] ?? parts[0], stack: parts.join(", ") };
}

const interNames = fontNames(inter.style.fontFamily);
const loraNames = fontNames(lora.style.fontFamily);
const notoSansNames = fontNames(notoSansDevanagari.style.fontFamily);
const notoSerifNames = fontNames(notoSerifDevanagari.style.fontFamily);

export const fontRootStyle = `:root{--font-inter:${interNames.fallback};--font-lora:${loraNames.fallback};--font-noto-sans-devanagari:${notoSansNames.stack};--font-noto-serif-devanagari:${notoSerifNames.stack}}.fonts-ready{--font-inter:${interNames.stack};--font-lora:${loraNames.stack}}`;
