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
                // Accent - Verde como cor de destaque
                neuro: {
                    green: '#3ECF8E',
                    'green-dark': '#24B47E',
                    'green-light': '#6EE7B7',
                    blue: '#38BDF8',
                },
                // Light mode - Tons quentes e suaves
                light: {
                    bg: '#FAFAF9',
                    surface: '#FFFFFF',
                    text: '#1C1917',
                    'text-secondary': '#78716C',
                    border: '#E7E5E4',
                },
                // Dark mode - PRETO/CINZA puro
                dark: {
                    bg: '#0f0f0f',
                    surface: '#1a1a1a',
                    'surface-hover': '#252525',
                    text: '#FAFAF9',
                    'text-secondary': '#888888',
                    border: '#2a2a2a',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 16px rgba(0, 0, 0, 0.06)',
                'glow': '0 0 24px rgba(62, 207, 142, 0.12)',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(12px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
