/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#000000',           // Czysta czerń
          card: '#1C1C1E',         // Karty i podniesione elementy
          blue: '#0A84FF',         // Główny akcent (System Blue)
          green: '#32D74B',        // Sukces (System Green)
          red: '#FF453A',          // Błąd/Zagrożenie (System Red)
          orange: '#FF9F0A',       // System Orange
          yellow: '#FFD60A',       // System Yellow
          primary: '#A8F000',      // Neonowy zielony
          gray: '#8E8E93',         // Szary systemowy (tekst poboczny)
          gray2: '#636366',        // Ciemniejszy szary
          gray3: '#48484A',        // Jeszcze ciemniejszy szary
          gray4: '#3A3A3C',        // Niemal czerń (ramki)
          glass: 'rgba(28, 28, 30, 0.75)', // Szklane tło paska nawigacji
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
      },
      borderRadius: {
        'ios': '16px',
        'ios-lg': '20px',
        'ios-xl': '24px',
      },
      boxShadow: {
        'ios': '0 4px 24px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}