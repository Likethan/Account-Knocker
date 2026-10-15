/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0a0a",
          card: "rgba(255, 255, 255, 0.03)",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#00ff88", // neon green
          blue: "#00d4ff",   // cyber blue
          text: "#fafafa",
          muted: "#8a8a8a",
          danger: "#ff4444",
          warning: "#ffbb00",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
