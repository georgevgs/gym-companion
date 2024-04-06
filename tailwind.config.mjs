/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#4103fc",
          secondary: "#ffffff",
          accent: "#c7f901",
          text: "#000000",
        },
      },
      {
        dark: {
          primary: "#4103fc",
          secondary: "#000000",
          accent: "#c7f901",
          text: "#ffffff",
        },
      },
    ],
  },
};
