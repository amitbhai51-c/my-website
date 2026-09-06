/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00f0ff',
          blue: '#0ea5e9',
          sky: '#38bdf8',
          teal: '#14b8a6',
          indigo: '#6366f1',
          rose: '#f43f5e',
          amber: '#fbbf24',
          emerald: '#10b981',
        },
        dark: {
          bg: '#060b16',
          surface: '#0a1122',
          card: '#0f1a34',
          cardHover: '#132142',
          border: '#1e2d4d',
          borderGlow: '#00f0ff33',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'neon-blue': '0 0 20px -3px rgba(14, 165, 233, 0.35)',
        'neon-glow': '0 0 30px -5px rgba(0, 240, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
