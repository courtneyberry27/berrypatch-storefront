/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        berry: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#C1292E', // Barn red / deep ripe strawberry
          600: '#A51C20',
          700: '#8E1619',
          800: '#670F12',
          900: '#430609',
        },
        barn: {
          50: '#FDF2F2',
          100: '#FCE8E8',
          500: '#C1292E',
          600: '#A51C20',
          700: '#8E1619',
        },
        wood: {
          50: '#FAF6F0',
          100: '#F4ECE0',
          200: '#E6D7C3',
          300: '#D2BBA2',
          500: '#8B5E3C',
          700: '#5C3D2E',
          800: '#4A2F22',
          900: '#341E14',
        },
        sage: {
          50: '#F2F7F4',
          100: '#E1EDE4',
          200: '#C3DBC9',
          500: '#4A7C59',
          600: '#386641',
          700: '#2A4E31',
        },
        parchment: {
          50: '#FEFCF9',
          100: '#FDFBF7',
          200: '#F7F2E7',
          300: '#EDE4D1',
          400: '#DFD2B7',
        },
      },
      fontFamily: {
        farm: ['Fraunces', 'Georgia', 'serif'],
        hand: ['Patrick Hand', 'cursive', 'sans-serif'],
        sans: [
          'Quicksand',
          'Nunito',
          'ui-rounded',
          'system-ui',
          'sans-serif',
        ],
      },
      animation: {
        'bounce-soft': 'bounceSoft 2.5s infinite ease-in-out',
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.88)', opacity: '0.7' },
          '70%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'farm': '0 4px 20px -2px rgba(92, 61, 46, 0.12)',
        'farm-lg': '0 10px 30px -4px rgba(92, 61, 46, 0.18)',
        'crate': '0 8px 16px -2px rgba(120, 80, 50, 0.1), 0 2px 4px -1px rgba(120, 80, 50, 0.06)',
      },
    },
  },
  plugins: [],
}
