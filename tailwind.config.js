/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#3b3e4f",
          secondary: "#b3aa8d",
          accent: "#1FB2A6",
          neutral: "#5e5e5e",
          "base-100": "#f5f4f0",
          info: "#3ABFF8",
          success: "#578c7b",
          warning: "#a06e41",
          error: "#d76363",
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: "#3b3e4f",
        success: "#778780",
        "error:": "#8d5d5d",
        warning: "#a06e41",
        secondary: "#b3aa8d",
        words: "#5e5e5e",
        body: "#f5f4f0",
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
        header: ["Assistant", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
