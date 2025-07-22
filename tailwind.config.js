/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F8F8F8',
          100: '#F7FAFC',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
        secondary: {
          50: '#FFFBF5',
          100: '#FFF0B3',
          200: '#FFE066',
          300: '#FFD633',
          400: '#FFCC00',
          500: '#FFB300',
          600: '#FF9900',
          700: '#FF8000',
          800: '#FF6600',
          900: '#FF4D00',
        },
        accent: {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#FF6B6B',
          600: '#FF5252',
          700: '#E53E3E',
          800: '#C53030',
          900: '#9B2C2C',
        },
        warm: {
          50: '#FFFBF5',
          100: '#FFF0B3',
          200: '#FFE066',
          300: '#FFD633',
          400: '#FFCC00',
          500: '#FFB300',
          600: '#FF9900',
          700: '#FF8000',
          800: '#FF6600',
          900: '#FF4D00',
        },
        // New soft colors inspired by Easy Study
        soft: {
          pink: '#FFB3BA',
          blue: '#B3E5FC',
          yellow: '#FFF9C4',
          green: '#C8E6C9',
          purple: '#E1BEE7',
          orange: '#FFCC80',
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} 