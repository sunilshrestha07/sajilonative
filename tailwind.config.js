/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    // Add more directories as needed
  ],
  theme: {
    extend: {
      colors: {
        primary: '#55428F',
        secondary: '#F7AE4E',
        backgroundColorNormal: '#F8F8F8',

        darkMode: {
          backgroundColor: '#1C1C1C',
          textColor: 'white',
        },
        lightMode: {
          backgroundColor: '#F8F8F8',
          textColor: 'black',
        },
      },
    },
    fontFamily:{
      'quicksand':["Quicksand-VariableFont_wght"],
      'jim':["JimNightshade-Regular"]
    }
  },
  plugins: [],
};
