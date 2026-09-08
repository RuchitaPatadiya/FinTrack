/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      colors: {
        brand: {
          black: '#090A0F',
          dark: '#0E1017',
          surface: '#141721',
          card: '#1A1E2C',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-subtle': 'rgba(255, 255, 255, 0.04)',
        },
        pastel: {
          pink: {
            DEFAULT: '#F9A8D4',
            light: '#FCE7F3',
            dark: '#EC4899',
            glow: 'rgba(249, 168, 212, 0.35)',
          },
          mint: {
            DEFAULT: '#86EFAC',
            light: '#DCFCE7',
            dark: '#22C55E',
            glow: 'rgba(134, 239, 172, 0.35)',
          },
          yellow: {
            DEFAULT: '#FDE047',
            light: '#FEF9C3',
            dark: '#EAB308',
            glow: 'rgba(253, 224, 71, 0.35)',
          },
          sky: {
            DEFAULT: '#7DD3FC',
            light: '#E0F2FE',
            dark: '#0EA5E9',
            glow: 'rgba(125, 211, 252, 0.35)',
          },
          purple: {
            DEFAULT: '#D8B4FE',
            light: '#F3E8FF',
            dark: '#A855F7',
            glow: 'rgba(216, 180, 254, 0.35)',
          },
          peach: {
            DEFAULT: '#FDBA74',
            light: '#FFEDD5',
            dark: '#F97316',
            glow: 'rgba(253, 186, 116, 0.35)',
          }
        }
      },
      boxShadow: {
        'glow-pink': '0 0 35px -5px rgba(249, 168, 212, 0.3)',
        'glow-mint': '0 0 35px -5px rgba(134, 239, 172, 0.3)',
        'glow-yellow': '0 0 35px -5px rgba(253, 224, 71, 0.3)',
        'glow-sky': '0 0 35px -5px rgba(125, 211, 252, 0.3)',
        'glow-purple': '0 0 35px -5px rgba(216, 180, 254, 0.3)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
