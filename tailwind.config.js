/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        capma: {
          blue: '#1E68B3',
          orange: '#E87722',
          navy: '#163A5F',
          'navy-soft': '#1E68B3',
          'light-grey': '#F4F8FC',
          'sky': '#EAF4FF',
          'mist': '#F8FBFF',
          'success-green': '#10B981',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'pop': {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' }
        },
        'grid-pan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '48px 48px' }
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(220%)' }
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(28px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(28px) rotate(-360deg)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'dash': {
          '0%': { strokeDashoffset: '120' },
          '100%': { strokeDashoffset: '0' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 700ms ease-out both',
        'fade-in-left': 'fade-in-left 700ms ease-out both',
        'pop': 'pop 480ms cubic-bezier(.2,.8,.2,1) both',
        'float': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'grid-pan': 'grid-pan 18s linear infinite',
        'scan': 'scan 4.5s linear infinite',
        'orbit': 'orbit 8s linear infinite',
        'shimmer': 'shimmer 2.8s linear infinite'
      }
    },
  },
  plugins: [],
}
