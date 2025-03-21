/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      keyframes: {
        'fade-slide-down': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-10px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        },
        'progress-pulse': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 5px rgba(244,63,94,0.2)'
          },
          '50%': {
            opacity: '0.85',
            boxShadow: '0 0 8px rgba(244,63,94,0.4)'
          }
        }
      },
      animation: {
        'fade-slide-down': 'fade-slide-down 0.5s ease-out forwards'
,
        'progress-pulse': 'progress-pulse 2s ease-in-out infinite'
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};