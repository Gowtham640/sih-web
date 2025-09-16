import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gradblue:"#190A68",
        gradpurple:"#7A36A0"
      },
      fontFamily: {
        'sans': ['var(--font-sora)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'sora': ['var(--font-sora)', 'sans-serif'],
        'anton': ['var(--font-anton)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
