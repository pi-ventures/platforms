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
        equinox: {
          primary:  '#C9A84C',
          dark:     '#1A0533',
          darker:   '#0A0A1A',
          purple:   '#2D1B69',
          light:    '#F5F0E8',
          accent:   '#E8C96A',
          gold:     '#C9A84C',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
        'dark-gradient':  'linear-gradient(135deg, #1A0533 0%, #0A0A1A 100%)',
        'card-gradient':  'linear-gradient(135deg, #1E1040 0%, #2D1B69 100%)',
      },
      boxShadow: {
        'gold':    '0 4px 24px rgba(201,168,76,0.35)',
        'gold-lg': '0 8px 48px rgba(201,168,76,0.45)',
        'card':    '0 2px 20px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
