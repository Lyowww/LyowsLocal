import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  // content: [
  //   ...,
  //   "./app/**/*.{js,ts,jsx,tsx,mdx}",
  // ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-button":
          "linear-gradient(to right, #C27CBC, #D3FF00, #3BE32D)",
        "gradient-airdrop-page-header":
          "linear-gradient(91.14deg, #44F756 3.72%, #D3EB2F 46.54%, #D684F5 84.36%, #ADA3D9 91.13%)",
        "gradient-navbar-myjok":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(153, 153, 153, 0.15) 100%)",
        "gradient-airdrop-start-popup1":
          "linear-gradient(180deg, #C14AB1 0%, #AE9FD6 100%)",
        "gradient-airdrop-start-popup2":
          "linear-gradient(180deg, #4FF852 0%, #DE82F8 37%, #B8E100 57%, #CBFF00 99.99%, #AE9FD6 100%)",
        "gradient-home-yield":
          "linear-gradient(217.82deg, rgba(255, 255, 255, 0.1222) 12.44%, rgba(35, 35, 35, 0.13) 76.98%)",
        "gradient-airdrop-text":
          "linear-gradient(90deg, #44F756 0%, #BEED34 46%, #FF61F1 100%)",
      },
      boxShadow: {
        "navbar-shadow": "0px 0px 4px 0px #0000002E",
      },
      keyframes: {
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        "slide-down": {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(100%)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-in",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        customGreen: {
          900: "#002601",
          800: "#016901",
          700: "#007b01",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
