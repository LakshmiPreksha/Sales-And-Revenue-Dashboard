// tailwind.config.js
module.exports = {
  darkMode: 'class', // ✅ THIS IS CRITICAL
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ adjust if needed
    "./public/index.html"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
