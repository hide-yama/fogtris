/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'board': 'repeat(10, minmax(0, 1fr))',
        'preview': 'repeat(4, minmax(0, 1fr))'
      },
      gridTemplateRows: {
        'board': 'repeat(20, minmax(0, 1fr))',
        'preview': 'repeat(4, minmax(0, 1fr))'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'shake': 'shake 0.05s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-1px)' },
          '75%': { transform: 'translateX(1px)' },
        },
      },
    },
  },
  plugins: [],
};