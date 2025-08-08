// tailwind.config.ts

/** @type {import('tailwindcss').Config} */
module.exports = {
    // ... (keep your future and content config)
    theme: {
      extend: {
        // Add the new fonts here
        fontFamily: {
          serif: ['var(--font-playfair)'],
          sans: ['var(--font-montserrat)'],
        },
        // Add new animations and colors
        colors: {
          'cream': '#F9F6F2',
          'blush': '#E8D2D0',
          'rose': '#B08882',
          'dark-rose': '#8C6C66',
        },
        animation: {
          'fade-in': 'fadeIn 1s ease-in-out',
          'fade-in-slow': 'fadeIn 1.5s ease-in-out',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
          fadeIn: {
            from: { opacity: '0' },
            to: { opacity: '1' },
          },
        }
      },
    },
    plugins: [],
  };