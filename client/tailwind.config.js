/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#050816",
          secondary: "#aaa6c3",
          tertiary: "#151030",
          "black-100": "#100d25",
          "black-200": "#090325",
        },
      },
    },
    plugins: [],
}