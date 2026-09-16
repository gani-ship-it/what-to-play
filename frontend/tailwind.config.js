/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wtp: {
          bg: "#0a0a0d",
          surface: "#121217",
          card: "#181820",
          "card-hover": "#22222d",
          border: "rgba(255, 255, 255, 0.08)",
          "border-focus": "rgba(229, 9, 20, 0.5)",
          red: {
            DEFAULT: "#E50914",
            hover: "#FF2E43",
            dark: "#B20710",
            muted: "rgba(229, 9, 20, 0.15)",
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#A1A1AA",
            muted: "#71717A",
          },
          badge: {
            green: "#10B981",
            blue: "#3B82F6",
            purple: "#8B5CF6",
            amber: "#F59E0B",
          }
        }
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(229, 9, 20, 0.35)',
        'red-glow-lg': '0 0 35px rgba(229, 9, 20, 0.45)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
