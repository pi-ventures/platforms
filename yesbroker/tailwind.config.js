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
        mustard: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f5a623',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        teal: {
          50:  '#e6f4f5',
          100: '#cceaeb',
          200: '#99d5d7',
          300: '#66c0c3',
          400: '#33aaaf',
          500: '#006D77',
          600: '#005a63',
          700: '#00474e',
          800: '#00343a',
          900: '#002126',
        },
        brand: {
          primary:   '#F5A623',
          dark:      '#1A1A2E',
          darker:    '#0F0F1A',
          accent:    '#E8960A',
          light:     '#FFF8E7',
          muted:     '#F9F5EC',
        },
        zillow: {
          blue:      '#006AFF',
          'blue-dark': '#0057d4',
          'blue-light':'#E8F0FE',
          gray:      '#767676',
          'gray-light':'#F5F5F5',
          'gray-border':'#E0E0E0',
          dark:      '#2A2A33',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'mustard': '0 4px 24px rgba(245, 166, 35, 0.25)',
        'mustard-lg': '0 8px 40px rgba(245, 166, 35, 0.35)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'mustard-gradient': 'linear-gradient(135deg, #F5A623 0%, #E8960A 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        'hero-pattern': "radial-gradient(ellipse at top, rgba(245,166,35,0.15) 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
}
