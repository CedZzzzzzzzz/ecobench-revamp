export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-green': '#6fa83a',
        'eco-green-dark': '#5a8a2f',
        'eco-green-light': '#8bc34a',
        'bench-yellow': '#f4c430',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'space': ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}