// tailwind.config.ts
import { type Config } from "tailwindcss";
import theme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        light: '#ffffff',
        dark: '#242424',
        primary: '#646cff',
        primaryHover: '#535bf2',
      },
      fontFamily: {
        sans: ["Inter", ...theme.fontFamily.sans],
      },
      keyframes: {
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'logo-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'spin-logo': 'logo-spin infinite 20s linear',
      },
    },
  },
  plugins: [],
} satisfies Config;
