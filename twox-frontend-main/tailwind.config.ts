import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      textShadow: {
        DEFAULT: '0 0 10px rgba(255,255,255,0.5)',
        glow: '0 0 15px rgba(255,255,255,0.7)',
        purple: '0 0 10px rgba(83,86,213,0.7)',
        sharp: '0 0 5px rgba(255,255,255,0.8)',
        'token-text': '0px 4px 9px var(--token-gold)',
      },
      screens: {
        xxs: '390px',
        xm: '450px',
        '2xl': '1400px',
        '3xl': '1600px',
      },
      colors: {
        background: 'hsl(var(--background))',
        'background-secondary': 'hsl(var(--background-secondary))',
        'background-third': 'hsl(var(--background-third))',
        'background-fourth': 'hsl(var(--background-fourth))',
        'background-teritary': 'hsl(var(--background-teritary))',
        'background-fifth': 'hsl(var(--background-fifth))',
        'background-sixth': 'hsl(var(--background-sixth))',
        'background-seventh': 'hsl(var(--background-seventh))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          '400': 'hsl(var(--primary-400))',
          '500': 'hsl(var(--primary-500))',
          '600': 'hsl(var(--primary-600))',
          foreground: 'hsl(var(--primary-foreground))',
          DEFAULT: 'hsl(var(--primary-500))',
        },
        'dark-primary': {
          '400': 'hsl(var(--dark-primary-400))',
          '500': 'hsl(var(--dark-primary-500))',
          '600': 'hsl(var(--dark-primary-600))',
          DEFAULT: 'hsl(var(--dark-primary-500))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          '350': 'hsl(var(--secondary-350))',
          '400': 'hsl(var(--secondary-400))',
          '450': 'hsl(var(--secondary-450))',
          '500': 'hsl(var(--secondary-500))',
          '550': 'hsl(var(--secondary-550))',
          '600': 'hsl(var(--secondary-600))',
          '700': 'hsl(var(--secondary-700))',
          '800': 'hsl(var(--secondary-800))',
          DEFAULT: 'hsl(var(--secondary-500))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'secondary-text': {
          DEFAULT: 'hsl(var(--secondary-text))',
        },
        success: {
          '25': 'hsl(var(--success-25))',
          '50': 'hsl(var(--success-50))',
          '100': 'var(--success-100)',
          '200': 'var(--success-200)',
          '300': 'var(--success-300)',
          '400': 'var(--success-400)',
          '500': 'hsl(var(--success-500))',
          '600': 'var(--success-600)',
          '700': 'var(--success-700)',
          '800': 'var(--success-800)',
          '900': 'hsl(var(--success-900))',
          '950': 'hsl(var(--success-950))',
          DEFAULT: 'hsl(var(--success-500))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        error: {
          '25': 'hsl(var(--error-25))',
          '50': 'hsl(var(--error-50))',
          '100': 'hsl(var(--error-100))',
          '200': 'hsl(var(--error-200))',
          '300': 'hsl(var(--error-300))',
          '400': 'hsl(var(--error-400))',
          '500': 'hsl(var(--error-500))',
          '600': 'hsl(var(--error-600))',
          '700': 'hsl(var(--error-700))',
          '800': 'hsl(var(--error-800))',
          '900': 'hsl(var(--error-900))',
          '950': 'hsl(var(--error-950))',
          DEFAULT: 'hsl(var(--error-500))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          '25': 'hsl(var(--error-25))',
          '50': 'hsl(var(--error-50))',
          '100': 'hsl(var(--error-100))',
          '200': 'hsl(var(--error-200))',
          '300': 'hsl(var(--error-300))',
          '400': 'hsl(var(--error-400))',
          '500': 'hsl(var(--error-500))',
          '600': 'hsl(var(--error-600))',
          '700': 'hsl(var(--error-700))',
          '800': 'hsl(var(--error-800))',
          '900': 'hsl(var(--error-900))',
          '950': 'hsl(var(--error-950))',
          DEFAULT: 'hsl(var(--error-500))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        gold: {
          light: 'var(--light-gold)',
          token: 'var(--token-gold)',
          '500': 'hsl(var(--gold-500))',
          DEFAULT: 'hsl(var(--gold-500))',
        },
        border: 'hsl(var(--border))',
        'border-warning': 'hsl(var(--border-warning))',
        'border-warning-hover': 'hsl(var(--border-warning-hover))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        external: {
          sumsubBackground: 'var(--sumsub-background)',
        },
        mirage: '#222328',
        'arty-red': '#F8043F',
        mulberry: '#9F203F',
        'charcoal-grey': '#404044',
        'dark-grey': '#0A0A0AD9',
        cinder: '#17161B',
        'dawn-pink': '#ECECEC',
        'oslo-grey': '#848894',
        zeus: '#1D1A24',
      },
      fontFamily: {
        rubik: 'var(--font-rubik)',
        inter: 'var(--font-inter)',
        satoshi: 'var(--font-satoshi)',
        kepler: 'var(--font-kepler)',
        stolzl: 'var(--font-stolzl)',
      },
      backgroundImage: {
        'button-gradient': 'linear-gradient(180deg, #F8043F 0%, #620018 100%)',
        'button-gradient-hover':
          'linear-gradient(180deg, #620018 0%, #F8043F 100%)',
        'vip-gradient': 'linear-gradient(180deg, #121B20 0%, #152025 100%)',
        'button-gradient-disabled':
          'linear-gradient(180deg, #F8043F 0%, #620018 100%)',
        'card-gradient': 'linear-gradient(180deg, #121B20 0%, #152025 100%)',
        'token-price-card-up':
          'linear-gradient(90deg, #111024 0%, #F8043F 100%)',
        'token-price-card-down':
          'linear-gradient(90deg, #111024 0%, rgba(199, 0, 0, 0.73) 100%)',
        'wager-race-card': 'linear-gradient(90deg, #111024 0%, #000AFF 100%)',
        'lottery-card': 'linear-gradient(90deg, #111124 0%, #FE467A 100%)',
        'gradient-deposit-button':
          'linear-gradient(90deg, #2A2D3A 0%, #1A1E2D 100%)',
        'gradient-gift-card-dark':
          'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #2A2D39 100%)',
        'gradient-gift-card-100':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #6B4318 100%)',
        'gradient-gift-card-200':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #774306 100%)',
        'gradient-gift-card-300':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #9C5A08 100%)',
        'gradient-gift-card-500':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #BD6E09 100%)',
        'gradient-gift-card-1k':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(216, 130, 10, 0.533333) 100%)',
        'gradient-gift-card-3k':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #F0B123 100%)',
        'gradient-gift-card-5k':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #F6C45D 100%)',
        'gradient-gift-card-10k':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #F9D58F 100%)',
        'gradient-gift-card-100k':
          'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #FBE7B6 100%)',
        'gradient-wheel-fortune':
          'linear-gradient(90deg, #111124 0%, #FE467A 100%)',
        'gradient-tab-border':
          'linear-gradient(88.43deg, #5057FF 0%, #8B78FF 49.52%, #3D42FD 100%)',
        'gradient-wallet-item':
          'linear-gradient(88.43deg, #5057FF 0%, #8B78FF 49.52%, #3D42FD 100%)',
        'blur-wallet-item':
          'linear-gradient(28.72deg, #5057FF 17.7%, #6046FF 40.63%, #4000FF 82.3%)',
        'hero-banner':
          'linear-gradient(95.22deg, rgba(17, 17, 58, 0.8) 4.18%, rgba(17, 17, 58, 0.38) 41.11%, rgba(17, 17, 58, 0) 62.75%, rgba(17, 17, 58, 0) 109.71%)',
        'hero-banner-gradient-2':
          'linear-gradient(79deg, #171745 0%, #544FC9 35.5%, #5B45DA 100%)',
        'telegram-gradient':
          'linear-gradient(23deg, rgba(42, 113, 118, 0.22) 18.26%, rgba(92, 170, 227, 0.22) 131.9%)',
        'promotion-gradient':
          'linear-gradient(29.36deg, rgba(89, 65, 136, 0.22) 32.96%, rgba(200, 95, 77, 0.22) 109.64%)',
        'dark-gradient': 'linear-gradient(180deg, #111015 0%, #0C0C0C 100%)',
        'custom-button-gradient':
          'linear-gradient(180deg, #F8043F 0%, #620018 100%)',
        'dark-grey-gradient':
          'linear-gradient(180deg, #242327 0%, #151419 100%)',
        'custom-dual-gradient':
          'linear-gradient(180deg, #111015 0%, #0C0C0C 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl-0.5': `calc(1rem + 0.5px)`,
      },
      animation: {
        shine: 'shine 3s ease-out infinite',
        spin: 'spin 1s linear infinite',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'enter-1': 'enter-1 500ms ease-out forwards',
        'slide-in': 'slide-in 0.5s ease-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        highlight: 'highlight 1s ease-out',
      },
      boxShadow: {
        'active-game': '0px 22px 13px 0px #0000004A',
        'deposit-button': '0px 4px 4px 0px #00000040',
        '0-0-12-0': '0px 0px 12px 0px',
        '0-0-4-0': '0px 0px 4px 0px',
        '0-m4-10-0': '0px -4px 10px 0px',
        'card-shadow-red': '0px 2.04px 4.07px 0px #A71D3F80',
      },
      keyframes: {
        spin: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        shine: {
          '0%': {
            backgroundPosition: '200% 0',
          },
          '25%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '-200% 0',
          },
        },
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
        'enter-1': {
          '0%': {
            opacity: '0',
            maxHeight: '0',
          },
          '100%': {
            opacity: '1',
            maxHeight: '100px',
          },
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        highlight: {
          '0%': {
            backgroundColor: 'hsl(var(--primary-400) / 0.2)',
            transform: 'scale(1)',
          },
          '50%': {
            backgroundColor: 'hsl(var(--primary-400) / 0.4)',
            transform: 'scale(1.05)',
          },
          '100%': {
            backgroundColor: 'transparent',
            transform: 'scale(1)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      height: {
        header: 'var(--header-height)',
        sidebar: 'calc(100dvh - var(--header-height))',
        'sidebar-sm':
          'calc(100dvh - var(--header-height-sm) - var(--mobile-menu-bar-height) + 50px) ',
        'header-sm': 'var(--header-height-sm)',
        'game-fullscreen': 'calc(100dvh - 3rem - var(--vh))',
        'mobile-screen': 'calc(100dvh - var(--mobile-menu-bar-height))',
        'panel-mobile-screen':
          'calc(100dvh - var(--mobile-menu-bar-height) + 20px)',
      },
      spacing: {
        '4.5': '18px',
        '7.5': '30px',
        'main-spacing': 'var(--main-spacing)',
        sidebar: 'var(--sidebar-width)',
        'sidebar-sm': 'var(--sidebar-width-sm)',
        header: 'var(--header-height)',
        'header-sm': 'var(--header-height-sm)',
        'right-panel': 'var(--right-panel-width)',
        'right-panel-sm': 'var(--right-panel-width-sm)',
      },
      dropShadow: {
        '0-12-0-primary': '0px 0px 12px hsl(var(--primary-500)/0.32)',
        '0-12-0-success': '0px 0px 12px hsl(var(--success-500)/0.32)',
        '0-12-0-gold': '0px 0px 12px hsl(var(--gold-500)/0.32)',
      },
      maxWidth: {
        '8xl': '1400px',
      },
    },
  },
  // plugins: [animatePlugin, require('tailwindcss-textshadow')],
  plugins: [
    animatePlugin,
    require('tailwindcss-textshadow'),
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.border-gradient-vertical': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            'border-radius': '8px',
            padding: '1px',
            background: 'linear-gradient(180deg, #404044 0%, #AF1B3F 100%)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            'mask-composite': 'subtract',
            '-webkit-mask-composite': 'xor',
            'pointer-events': 'none',
          },
        },
      })
    },
  ],
}
export default config
