import {
  Inter,
  Lora,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
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

export const fontVariableClassName = [
  inter.variable,
  lora.variable,
  notoSansDevanagari.variable,
  notoSerifDevanagari.variable,
].join(" ");

export const fontRootStyle = `:root{--font-inter:${inter.style.fontFamily};--font-lora:${lora.style.fontFamily};--font-noto-sans-devanagari:${notoSansDevanagari.style.fontFamily};--font-noto-serif-devanagari:${notoSerifDevanagari.style.fontFamily}}`;
