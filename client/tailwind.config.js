/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors — navy, rust, cream, gold
        navy: {
          DEFAULT: '#113f46',
          dark: '#082b30',
          light: '#25616a',
        },
        rust: {
          DEFAULT: '#c45c26',
          dark: '#a34a1e',
          light: '#e07a45',
        },
        gold: {
          DEFAULT: '#c9a227',
          light: '#d4b84a',
        },
        cream: {
          DEFAULT: '#faf8f4',
          dark: '#f5f0e8',
        },
        ivory: '#fffdfb',
        // Legacy aliases — existing components use these class names
        burgundy: '#113f46',
        maroon: '#082b30',
        blush: '#fdf6ee',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 20px 50px rgba(8, 43, 48, 0.12)',
      },
    },
  },
  plugins: [],
};
