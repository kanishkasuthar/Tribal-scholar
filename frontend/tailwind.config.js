/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F7F1E6', // Warm Cream Page Background
        surface: '#FFFFFF',    // White Card Surface
        cream: '#F7F1E6',      // Warm Cream
        ivory: '#FFFDF8',      // Soft Ivory
        border: '#DDD3C5',     // Centralized Warm Border

        // Exact Brand Design Tokens
        'brand-maroon': '#7A1F2B',
        'brand-dark': '#5A1720',
        terracotta: '#B65338',
        gold: '#C49A44',
        'dark-brown': '#30251F',
        charcoal: '#292522',
        'muted-text': '#6B6259',
        forest: '#174F43',

        primary: {
          DEFAULT: '#7A1F2B',
          dark: '#5A1720',
        },
        maroon: {
          50: '#FAF0F2',
          100: '#F3DBE0',
          500: '#7A1F2B',
          600: '#5A1720',
          700: '#471118',
          800: '#330B11',
          900: '#27080D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Source Sans 3', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
