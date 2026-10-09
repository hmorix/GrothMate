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
        nature: {
          50: '#f2fbf4',
          100: '#e1f6e6',
          200: '#c5eccd',
          300: '#97dca5',
          400: '#62c375',
          500: '#3ba750',
          600: '#2c873f',
          700: '#246b33',
          800: '#20552b',
          900: '#1c4625',
          950: '#0a2612',
        },
        earth: {
          50: '#fbf8f4',
          100: '#f6efe6',
          200: '#ebdccb',
          300: '#dcbe9f',
          400: '#c99b70',
          500: '#ba7f4f',
          600: '#a76741',
          700: '#8b5137',
          800: '#724231',
          900: '#5f372a',
          950: '#341a15',
        },
        bloom: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'leaf-sway': 'sway 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
