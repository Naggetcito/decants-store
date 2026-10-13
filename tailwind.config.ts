import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // hover: solo en dispositivos con puntero real (evita hover pegado en touch)
  future: { hoverOnlyWhenSupported: true },
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1.25rem',
  			md: '2rem',
  			lg: '3rem'
  		},
  		screens: {
  			'2xl': '1280px'
  		}
  	},
  	extend: {
  		colors: {
  			background: 'hsl(var(--background) / <alpha-value>)',
  			foreground: 'hsl(var(--foreground) / <alpha-value>)',
  			card: {
  				DEFAULT: 'hsl(var(--card) / <alpha-value>)',
  				foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
  				foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
  				foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
  				foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
  				foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
  				foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
  				foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
  			},
  			border: 'hsl(var(--border) / <alpha-value>)',
  			input: 'hsl(var(--input) / <alpha-value>)',
  			ring: 'hsl(var(--ring) / <alpha-value>)',
  			ink: 'hsl(var(--ink) / <alpha-value>)',
  			cream: 'hsl(var(--cream) / <alpha-value>)',
  			gold: {
  				DEFAULT: 'hsl(var(--gold) / <alpha-value>)',
  				light: 'hsl(var(--gold-light) / <alpha-value>)',
  				deep: 'hsl(var(--gold-deep) / <alpha-value>)'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'system-ui',
  				'-apple-system',
  				'sans-serif'
  			],
  			display: [
  				'var(--font-playfair)',
  				'Georgia',
  				'Times New Roman',
  				'serif'
  			]
  		},
  		// Sistema de motion: botones 150ms, drawers 250ms, curva de salida fuerte
  		transitionTimingFunction: {
  			drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
  			'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)'
  		},
  		transitionDuration: {
  			press: '150ms',
  			drawer: '250ms'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
