/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1524',
          900: '#183153', // Primary Navy for headings, structural contrast
          800: '#1F3F6B',
          700: '#2A528A',
          600: '#3A6DB5',
          500: '#4F8FE8', // Primary Blue
        },
        royalBlue: {
          50: '#F0F6FE',
          100: '#E1EDFD',
          200: '#C3DCFC',
          300: '#95C2FA',
          400: '#6FAAF6',
          500: '#4F8FE8', // Primary Blue interactive elements
          600: '#3B74CC',
          700: '#2C59A3',
          800: '#204179',
          900: '#183153',
        },
        skyBlue: {
          50: '#F5FAFD',
          100: '#EAF6FC', // Pale Blue (page backgrounds)
          200: '#B9DDF5', // Sky Blue (background gradients, accents)
          300: '#8DC6ED',
          400: '#5EADE4',
          500: '#3B97DB',
        },
        paleBlue: {
          50: '#F4FAFD',
          100: '#EAF6FC', // Master pale blue surface
          200: '#D7EDF8',
          300: '#B9DDF5',
        },
        tealAccent: {
          50: '#F0FDFB',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#159E9A', // Approved Teal for positive actions & awareness
          600: '#0F8380',
          700: '#0C6663',
        },
        emeraldWellness: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          400: '#34D399',
          500: '#239B70', // Approved Emerald for success states & wellness
          600: '#1C825E',
          700: '#156549',
        },
        sageAccent: {
          50: '#F4FAF8',
          100: '#E8F5F1',
          200: '#C7E7DE',
          300: '#A8D8CB', // Approved Sage Green for decorative surfaces
          400: '#7EC4B3',
          500: '#58AC99',
        },
        softIvory: {
          50: '#FDFCF9',
          100: '#F8F7F1', // Approved Soft Ivory for warm neutral surfaces
          200: '#EFECE1',
          300: '#E2DEC8',
        },
        slateCustom: {
          400: '#94A3B8',
          500: '#64748B', // Approved Slate for secondary text
          600: '#475569',
          700: '#334155',
        },
        borderLight: '#D7E7F0', // Approved Border token
        ivory: {
          50: '#EAF6FC',  // Master background surface (Pale Blue)
          100: '#F8F7F1', // Soft ivory secondary surface
          200: '#D7E7F0', // Approved architectural border
          300: '#B9DDF5', // Sky Blue border accent
        },
        charcoal: {
          950: '#0F1E33',
          900: '#183153', // Approved Primary Navy for headlines
          800: '#1F3F6B',
          700: '#334C73',
          600: '#4F678A',
          500: '#64748B', // Approved Slate for captions & summaries
          400: '#94A3B8',
        },
        darkSurface: {
          base: '#0B1524',   // Master dark background (Deep Navy)
          card: '#112036',   // Elevated card in dark mode
          elevated: '#172B48', // Floating popovers/menus
          border: '#243A5E', // Subtle architectural border
          borderLight: '#325080', // Accent border
        },
        saffron: {
          50: '#FFF9F0',
          100: '#FEEFD8',
          200: '#FCD8A8',
          400: '#F7BC72',
          500: '#F3A54A', // Approved Restrained Saffron highlight
          600: '#D88427',
          700: '#B06517',
        },
        nssGreen: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#239B70', // Mapped to emerald
          600: '#1C825E',
          700: '#156549',
        },
        midnight: {
          900: '#183153',
          950: '#0B1524',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#D97706',
          600: '#B45309',
        },
      },
      fontFamily: {
        serif: [
          'Fraunces',
          'Playfair Display',
          'Georgia',
          'Cambria',
          'serif',
        ],
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Noto Sans',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft-card': '0 4px 20px -2px rgba(24, 49, 83, 0.06), 0 2px 6px -1px rgba(24, 49, 83, 0.04)',
        'elevated': '0 12px 32px -4px rgba(24, 49, 83, 0.10), 0 4px 12px -2px rgba(24, 49, 83, 0.05)',
        'teal-subtle': '0 4px 20px -2px rgba(21, 158, 154, 0.25)',
        'blue-subtle': '0 4px 20px -2px rgba(79, 143, 232, 0.25)',
        'saffron-subtle': '0 4px 20px -2px rgba(243, 165, 74, 0.25)',
        'dark-soft': '0 4px 24px -2px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
