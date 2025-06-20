/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        lblue1: "#a9d6e5",
        lblue2: "#89c2d9",
        lblue3: "#61a5c2",
        turqse1: "#468faf",
        turqse2: "#2c7da0",
        turqse3: "#2a6f97",
        dblue1: "#014f86",
        dblue2: "#01497c",
        dblue3: "#013a63",
        dblue4: "#012a4a" 
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        prata: ["Prata", "Didot"]
      },
      backgroundImage: {
        'balloons': "url('/src/images/balloons.jpg')",
        'search': "url('/src/images/search.jpg')",
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px"
    }
  },

  plugins: [
    require('flowbite/plugin'),
    require('tw-elements/dist/plugin')
  ],
}
