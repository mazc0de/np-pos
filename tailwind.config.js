/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          900: '#4c0519',
          800: '#881337',
          700: '#9f1239',
          600: '#e11d48',
          500: '#f43f5e',
          400: '#fb7185',
          300: '#fda4af',
          200: '#fecdd3',
          100: '#ffe4e6',
          50: '#fff1f2',
        }
      }
    },
  },
  plugins: [],
}
