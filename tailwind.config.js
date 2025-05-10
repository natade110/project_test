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
        primary: '#0BDAA5', // Green
        secondary: '#DA0B62', // Red
        dark: '#212433', // Black
        gray: {
          border: '#EBEBEB', // Border & Placeholder
          text: '#B3B3B3', // Gray
        },
      },
      fontFamily: {
        'noto-sans-thai': ['var(--font-noto-sans-thai)', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 0 24px rgba(0, 0, 0, 0.05)', // Box Shadow: X: 0, Y: 0, Color: 000000, Opacity: 5, Blur: 24
      },
    },
  },
  plugins: [],
}