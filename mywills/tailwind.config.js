/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        legal: {
          primary: '#1A2744',
          gold: '#C9A84C',
          cream: '#F8F6F0',
          green: '#2D5016',
          accent: '#4A6FA5',
          light: '#E8E6E0',
          border: '#D4CEBC',
        },
      },
      fontFamily: {
        header: ['Crimson Pro', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['32px', { lineHeight: '40px' }],
        '4xl': ['48px', { lineHeight: '56px' }],
      },
      boxShadow: {
        'legal': '0 4px 12px rgba(26, 39, 68, 0.12)',
        'legal-lg': '0 8px 24px rgba(26, 39, 68, 0.18)',
        'legal-accent': '0 4px 12px rgba(201, 168, 76, 0.2)',
      },
      borderRadius: {
        'legal': '8px',
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        '.btn-legal': {
          '@apply px-4 py-2.5 rounded-legal font-medium transition-all duration-200 text-sm': {},
          '&:hover': {
            '@apply shadow-legal-lg': {},
          },
        },
        '.btn-legal-primary': {
          '@apply btn-legal bg-legal-gold text-legal-primary hover:bg-opacity-90': {},
        },
        '.btn-legal-secondary': {
          '@apply btn-legal bg-legal-primary text-legal-cream hover:bg-opacity-90': {},
        },
        '.btn-legal-outline': {
          '@apply btn-legal border-2 border-legal-primary text-legal-primary bg-transparent hover:bg-legal-primary hover:text-legal-cream': {},
        },
        '.card-legal': {
          '@apply bg-legal-cream rounded-legal p-6 shadow-legal border border-legal-border': {},
        },
        '.badge-legal': {
          '@apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-legal-accent bg-opacity-10 text-legal-primary': {},
        },
        '.text-legal-primary': {
          '@apply text-legal-primary': {},
        },
      });
    },
  ],
};
