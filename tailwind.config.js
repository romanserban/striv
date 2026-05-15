/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F1115",
        surface: "#171A21",
        card: "#1E222B",
        primary: "#7C5CFF",
        text: "#FFFFFF",
        muted: "#A0A7B5",
        success: "#22C55E",
        error: "#EF4444",
        warning: "#F59E0B"
      },
      borderRadius: {
        card: "16px",
        modal: "24px"
      }
    }
  },
  plugins: []
};
