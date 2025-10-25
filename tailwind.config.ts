// tailwind.config.ts
import { heroui } from "@heroui/react";

const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "xs": "500px",
        sm: "768px",
        md: "992px",
        lg: "1200px",
        "lg-xl": "1290px",
        xl: "1440px",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "xs": "576px",
          sm: "768px",
          md: "992px",
          lg: "1280px",
          xl: "1440px",
        }
      },
      borderImage: {
        "border-blue-gradient": "linear-gradient(180deg, #092CA2 0%, #003BFF 100%)"
      },
      backgroundImage: {
        "blue-gradient": "linear-gradient(180deg, #092CA2 0%, #003BFF 100%)"
      },
      colors: {
        blue: {
          800: "#0047FF",
          700: "#3460E3",
          850: "#003BFF",
          150: "#003BFF26",
          100: "#003BFF0D",
        },
        dark: {
          800: "#1C274C",
          700: "#808080",
          600: "#555555",
          500: "#667085",
          300: "#48505E"
        },
        gray: {
          650: "#808080",
          600: "#5D6679",
          400: "#48505E",
          500: "#858D9D",
          200: "#F0F1F3",
          190: "#787486",
          180: "#ACACAC",
          170: "#D9D9D9",
          80: "#3333330D",
          70: "#D0D5DD",
          30: "#f8f8f8",
          25: "#CCCCCC",
          20: "#EEEEEE",
          10: "#F0F1F3"

        },
        orange: {
          800: "#E19133",
          700: "#DBA362",
          600: "#DAA621"
        },
        pink: {
          500: "#845EBC"
        },
        red: {
          700: "#F36960",
          600: "#E22C69",
          500: "#DA3E33"
        },
        green: {
          600: "#39AD79",
          500: "#10A760"
        }
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        archivo: "var(--font-archivo)",
        inter: "var(--font-inter)",
        poppins: "var(--font-poppins)",
      },
      boxShadow: {
        md: "0px 1px 2px 0px #1018280D",
        lg: "0px 4px 25px 0px #0000000D"
      }
    },
  },
  // darkMode: "class",
  plugins: [heroui()],
};

export default config;
