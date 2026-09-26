/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quran: {
          dark: '#070b13',
          navy: '#0b1325',
          card: '#111b33',
          'card-hover': '#162344',
          border: '#1f2e54',
          accent: '#38bdf8',
          gold: '#f59e0b',
          emerald: '#10b981',
          teal: '#14b8a6',
          indigo: '#6366f1',
          surface: '#17223b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'Scheherazade New', 'Traditional Arabic', 'serif'],
        quran: ['Noto Naskh Arabic', 'Amiri', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-lg': '0 0 35px -5px rgba(99, 102, 241, 0.4)',
        'player': '0 -10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        wave: {
          '0%, 100%': { height: '10px' },
          '50%': { height: '28px' },
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 6s ease-in-out infinite',
        'wave-bar': 'wave 1.2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
