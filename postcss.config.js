/* eslint-disable global-require */
module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production'
    && require('@fullhuman/postcss-purgecss')({
      content: [ // Templates
        './src/browser/components/**/*.vue',
        './src/browser/index.html',
      ],
      defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
    }),
  ],
};
