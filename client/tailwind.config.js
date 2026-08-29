/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: '#5f1228',
        maroon: '#7b1f35',
        gold: '#d4af73',
        cream: '#f8f3ee',
        blush: '#f2e8df',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 20px 45px rgba(95, 18, 40, 0.12)',
      },
    },
  },
  plugins: [],
};
