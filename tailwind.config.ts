import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        benedini: {
          dark: '#0F2218',
          green: '#1B3A2D',
          gold: '#D4A858',
          'gold-light': '#E8C97A',
          cream: '#FAF8F5',
          card: '#F5F3EE',
          text: '#2D2D2D',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
