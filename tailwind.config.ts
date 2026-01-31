import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f1a',
        foreground: '#ffffff',
        card: '#111827',
        border: '#1e293b',
        muted: '#64748b',
      },
    },
  },
  plugins: [],
}
export default config
