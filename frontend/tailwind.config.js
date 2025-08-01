/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        "primary-green": "#4CAF50", // A nice medium green
        "light-green": "#8BC34A", // A lighter, more vibrant green
        "dark-green": "#388E3C", // A darker green for contrast
        "accent-green": "#CDDC39", // A very light, yellowish green for subtle accents
        "text-dark": "#333333", // Dark text for readability
        "text-light": "#666666", // Lighter text for secondary info
        "bg-light": "#F9FAFB", // Light background
        "bg-card": "#FFFFFF", // Card background
        "border-light": "#E0E0E0", // Light border
      },
    },
  },
  plugins: [],
}