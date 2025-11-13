import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        serif: ["Lora", ...fontFamily.serif],
      },

      typography: ({ theme }: { theme: any }) => ({

        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.slate.700"),
            "--tw-prose-headings": theme("colors.slate.900"),
            "--tw-prose-links": theme("colors.blue.600"),

            "--tw-prose-invert-body": theme("colors.slate.300"),
            "--tw-prose-invert-headings": theme("colors.slate.100"),
            "--tw-prose-invert-links": theme("colors.blue.400"),

            "p, ul, ol, blockquote": {
              fontFamily: theme("fontFamily.serif"),
            },
          },
        },
      }),
    },
  },

  plugins: [typography, forms],
};

export default config;
