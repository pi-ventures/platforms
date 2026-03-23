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
        vault: {
          black: '#0A0A0A',
          charcoal: '#1A1A1A',
          gold: '#C9A84C',
          'gold-light': '#E8C96A',
          cream: '#FEF9EE',
          muted: '#111111',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 100%)',
        'vault-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
      },
      boxShadow: {
        gold: '0 0 20px rgba(201, 168, 76, 0.3)',
        vault: '0 10px 30px rgba(0, 0, 0, 0.5)',
        'gold-inset': 'inset 0 0 20px rgba(201, 168, 76, 0.1)',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};
