import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'coinbase': {
          50: '#f0f9ff',
          500: '#0052ff',
          600: '#0041cc',
          700: '#003399',
        }
      }
    },
  },
  plugins: [],
} satisfies Config 