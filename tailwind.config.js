module.exports = {
  purge: false, // Taking care of this in postcss
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      opacity: {
        95: '0.95',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
