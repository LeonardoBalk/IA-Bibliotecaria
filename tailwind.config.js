/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neuro: {
          blue: '#1E88E5',
          green: '#10B981', // Emerald 500 - More modern/vibrant
          'green-dark': '#059669', // Emerald 600
          'green-light': '#34D399', // Emerald 400
          black: '#0C0C0C',
        },
        light: {
          bg: '#F0FDF4', // Very light green tint
          surface: '#FFFFFF',
          text: '#1A1A1A',
          'text-secondary': '#595959',
          border: '#E5E7EB',
        },
        dark: {
          bg: '#022C22', // Deep green/black
          surface: 'rgba(22, 22, 22, 0.7)', // Glass effect base
          text: '#E5E5E5',
          'text-secondary': '#9CA3AF',
          border: '#2A2A2A',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'neuro': '10px',
      },
      boxShadow: {
        'neuro': '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
        'neuro-md': '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
