/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#0152D9',
        brandContainer: '#356DF3',
        brandSurface: '#EFF4FF',
        canvas: '#F8F9FF',
        ink: '#0B1C30',
        slateMuted: '#434654',
        emeraldDark: '#006B49',
        mintLight: '#6FFBBE',
        terminalBg: '#213145',
        terminalDark: '#0B1C30'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
