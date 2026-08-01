/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dj': {
          bg: {
            primary: '#0a0a14',
            secondary: '#0f0f1e',
          },
          surface: {
            DEFAULT: '#14142a',
            hover: '#1a1a35',
          },
          accent: {
            cyan: '#4dc9f6',
            pink: '#f472b6',
            lavender: '#a78bfa',
            gold: '#fbbf24',
          },
          text: {
            primary: '#e8e8f0',
            secondary: '#9494b8',
            muted: '#6b6b8d',
          },
          border: '#2a2a4a',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(77, 201, 246, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(77, 201, 246, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
