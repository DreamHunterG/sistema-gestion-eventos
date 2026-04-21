/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'sge-primary': '#0583F2',
        'sge-navy': '#005CAD',
        'sge-sky': '#1DB6F2',
        'sge-achievement': '#F3E742',
        'sge-bg': '#F2F2F2',
      }
    },
  },
  plugins: [],
}
