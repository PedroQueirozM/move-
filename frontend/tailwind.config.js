/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F6F4',
        sidebar: '#111113',
        'sidebar-card': '#18181B',
        brand: {
          primary: '#FFD400',
          'primary-hover': '#E6BF00',
          'on-primary': '#0A0A0A',
          yellow: '#FFD400',
          'yellow-hover': '#E6BF00',
          dark: '#18181B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
