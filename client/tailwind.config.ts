import type { Config } from "tailwindcss";
import flowbitePlugin from 'flowbite/plugin';
import typography from '@tailwindcss/typography';
import flowbite from "flowbite-react/tailwind";


const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/flowbite/**/*.{js,ts}',
      flowbite.content()
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          "50": "#E0F5F9",
          "100": "#B3E3EB",
          "200": "#80CEDC",
          "300": "#4DBACD",
          "400": "#26A8BF",
          "500": "#0E7490",
          "600": "#0C657F",
          "700": "#0A566E",
          "800": "#08475D",
          "900": "#06364B",
          "950": "#042839"
        }

      },
    },
  },
  plugins: [flowbite.plugin(), typography, flowbitePlugin],
};
export default config;
