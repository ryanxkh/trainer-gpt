import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark': {
          '950': '#0a0a0a',
          '900': '#141414',
          '850': '#1a1a1a',
          '800': '#1f1f1f',
          '750': '#252525',
          '700': '#2a2a2a',
          '600': '#3a3a3a',
          '500': '#4a4a4a',
        },
        // Primary accent (red/pink)
        'primary': {
          '50': '#fef2f2',
          '100': '#fee2e2',
          '200': '#fecaca',
          '300': '#fca5a5',
          '400': '#f87171',
          '500': '#ef4444',
          '600': '#dc2626',
          '700': '#b91c1c',
          '800': '#991b1b',
          '900': '#7f1d1d',
        },
        // Muscle group colors
        'muscle': {
          'chest': '#ec4899',
          'back': '#3b82f6',
          'shoulders': '#8b5cf6',
          'biceps': '#06b6d4',
          'triceps': '#f59e0b',
          'quads': '#10b981',
          'hamstrings': '#14b8a6',
          'glutes': '#84cc16',
          'calves': '#22c55e',
          'abs': '#f97316',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.2) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.15) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.2) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-lg': '0 0 30px rgba(239, 68, 68, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
