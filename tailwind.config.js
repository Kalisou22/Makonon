/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0055AA',
          dark: '#004182',
          light: '#0078C8',
        },
        success: {
          DEFAULT: '#28A745',
          dark: '#1E8232',
        },
        danger: {
          DEFAULT: '#D33333',
          dark: '#B42828',
        },
        warning: {
          DEFAULT: '#F57C00',
          dark: '#E06B00',
        },
        secondary: {
          DEFAULT: '#6C757D',
          dark: '#5A646C',
        },
        border: '#DCDCDC',
        'filter-bg': '#F0F2F5',
        'text-secondary': '#787878',
        'header-bg': '#F0F0F5',
        'bg': '#F5F7FA',
        'stripe': '#FAFAFC',
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
