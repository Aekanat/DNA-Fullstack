/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      {
        medicalDeepBlue: {
          primary: "#518DC9",
          "primary-content": "#F1F5F9",
          secondary: "#529DC1",
          "secondary-content": "#F1F5F9",
          accent: "#4B8FB1",
          "accent-content": "#272C31",
          neutral: "#F3F4F6",
          "neutral-content": "#1F2937",
          "base-100": "#F6F8FA",
          "base-200": "#c5d3ed",
          "base-300": "#7088A0",
          "base-content": "#272C31",
          info: "#3B82F6",
          "info-content": "#F1F5F9",
          success: "#10B981",
          "success-content": "#F1F5F9",
          warning: "#F59E0B",
          "warning-content": "#F1F5F9",
          error: "#EF4444",
          "error-content": "#F1F5F9",
        },
        medicalDeepBlueDark: {
          primary: "#8CA3B0", // Lighter blue to stand out on dark backgrounds
          "primary-content": "#121212", // Dark text for contrast
          secondary: "#97B9CC", // Soft, lighter secondary tone
          "secondary-content": "#121212",
          accent: "#839EB9", // Retaining the accent for brand consistency
          "accent-content": "#F1F5F9",
          neutral: "#121212", // Deep, almost-black neutral
          "neutral-content": "#F1F5F9",
          "base-100": "#2A2B2C", // Deep dark base for high contrast
          "base-200": "#1A1A1A",
          "base-300": "#ECEDEE",
          "base-content": "#F1F5F9",
          info: "#67C0F0", // Brighter info color to pop against dark base
          "info-content": "#121212",
          success: "#22C55E",
          "success-content": "#121212",
          warning: "#FBBF24",
          "warning-content": "#121212",
          error: "#EF4444",
          "error-content": "#121212",
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        "offwhite-200": "#ECECEC",
      },
      transitionDuration: {
        '1000': '1000ms',
        '2000': '2000ms',
      },
      fontFamily: {
        cormorant: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
