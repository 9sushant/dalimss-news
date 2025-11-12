
import type { Config } from "tailwindcss";
// Fix: Use import instead of require for TypeScript compatibility.
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Keep dark mode, but we will apply it by default
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        serif: ["Lora", ...fontFamily.serif],
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
             // Keep light prose styles if needed, but the app will be dark
            '--tw-prose-body': theme('colors.slate[700]'),
            '--tw-prose-headings': theme('colors.slate[900]'),
            '--tw-prose-links': theme('colors.blue[600]'),

            // Simplified dark mode prose
            '--tw-prose-invert-body': theme('colors.slate[300]'),
            '--tw-prose-invert-headings': theme('colors.slate[100]'),
            '--tw-prose-invert-links': theme('colors.blue[400]'),
            
            'p, ul, ol, blockquote': {
              fontFamily: theme('fontFamily.serif'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    // Fix: Replaced require with imported modules to resolve TypeScript errors.
    typography,
    forms,
  ],
};
export default config;
