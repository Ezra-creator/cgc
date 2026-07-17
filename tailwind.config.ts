import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cgc: {
          white: '#FFFFFF',
          bone: '#FAF9F6',
          ink: '#141414',
          red: '#E0102A',
          slate: '#6B6B6B',
          hairline: '#E6E3DD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Archivo Black', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        btn: '8px',
        card: '12px',
        modal: '16px',
        pill: '20px',
      },
      animation: {
        'ken-burns': 'kenBurns 18s ease-in-out infinite alternate',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'slide-right': 'slideRight 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        'toast-in': 'toastIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        'draw': 'draw 0.8s ease forwards',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        toastIn: {
          '0%': { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        draw: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
