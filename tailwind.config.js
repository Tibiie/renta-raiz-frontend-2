/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      screens: {
        'custom-1024': { 'raw': '(max-width: 1024px) and (min-width: 768px) and (max-height: 600px)' },
      },
      translate: {
        'custom-1024': '158px',
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
