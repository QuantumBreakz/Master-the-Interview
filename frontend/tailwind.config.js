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
        // True Black / Apple Dark Mode Palette
        background: '#000000', // True Black
        surface: '#09090b',    // Zinc-950 (Subtle deep layer)
        'surface-highlight': '#18181b', // Zinc-900 (Card backgrounds)

        primary: {
          DEFAULT: '#FFFFFF', // White text is primary
          muted: '#A1A1AA',   // Gray-400
        },

        accent: {
          blue: '#2997FF',   // Apple Blue
          purple: '#BF5AF2', // Apple Purple
          indigo: '#5E5CE6', // Apple Indigo
          green: '#30D158',  // Apple Green
          red: '#FF453A',    // Apple Red
          orange: '#FF9F0A', // Apple Orange
          teal: '#64D2FF',   // Apple Teal
        },

        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.2)',
        }
      },
      fontFamily: {
        // System stack for that clean Apple feel, backing up with Inter
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        mono: ['SF Mono', 'Menlo', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
