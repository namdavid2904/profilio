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
        primary: {
          DEFAULT: "#050816",
          light: "#ffffff"
        },
        secondary: {
          DEFAULT: "#aaa6c3", 
          light: "#334155"
        },
        tertiary: {
          DEFAULT: "#151030",
          light: "#f8fafc"
        },
        accent: {
          DEFAULT: "#8352FD", 
          light: "#6d28d9"
        },
        "black-100": "#100d25",
        "black-200": "#090325",
      },
      boxShadow: {
        'light': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
      },
      backgroundColor: {
        'card': {
          light: '#f1f5f9',
          dark: '#151030'
        }
      }
    },
  },
  plugins: [],
}