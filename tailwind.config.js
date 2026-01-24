/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/main/**/*.{js,ts}",
    "./src/preload/**/*.{js,ts}",
    "./cli/**/*.{js,ts}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Minecraft/Minectaft themed colors
        'mc-green': '#5AFF5A',
        'mc-dark-green': '#00AA00',
        'mc-stone': '#8A8A8A',
        'mc-copper': '#B87333',
        'mc-circuit': '#00D4AA',
        'ai-blue': '#00A8FF',
        'electric-purple': '#9D4EDD',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      keyframes: {
        'glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 168, 255, 0.3)',
        'glow-green': '0 0 20px rgba(90, 255, 90, 0.3)',
        'neon': '0 0 10px rgba(157, 78, 221, 0.5)',
      },
    },
  },
  plugins: [],
}
