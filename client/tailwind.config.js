/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors — navy, rust, cream, gold
        navy: {
          DEFAULT: '#1a365d',
          dark: '#152a45',
          light: '#2a4a73',
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
        burgundy: '#1a365d',
        maroon: '#152a45',
        blush: '#fdf6ee',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 20px 45px rgba(26, 54, 93, 0.12)',
      },
    },
  },
  plugins: [],
};
