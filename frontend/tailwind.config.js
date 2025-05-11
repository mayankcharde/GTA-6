/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-slow-reverse': 'float 7s ease-in-out infinite reverse',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
    },
  },
  plugins: [],
}
