/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22C55E', // Green color from the image
        'primary-dark': '#1B9D4B', // Darker green for hover states
        secondary: '#6B7280', // Gray for text
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      fontSize: {
        '2xs': '0.625rem', // Even smaller than xs
      },
      transitionDuration: {
        '300': '300ms',
      },
      width: {
        '18': '4.5rem', // For the outermost ping animation
      },
      height: {
        '18': '4.5rem', // For the outermost ping animation
      },
    },
  },
  plugins: [],
}
