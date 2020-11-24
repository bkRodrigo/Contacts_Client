require('dotenv').config();
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

module.exports = (env) => {
  const currEnv = env.NODE_ENV === 'production' ? 'production' : 'development',
    inProd = currEnv === 'production';

  process.env.NODE_ENV = currEnv;

  return {
    mode: inProd ? 'production' : 'development',

    entry: {
      main: [
        './src/browser/index.js',
        './src/browser/css/main.css',
      ],
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: (file) => (
            /node_modules/.test(file)
            && !/\.vue\.js/.test(file)
          ),
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]',
          },
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },

    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
      extensions: ['*', '.js', '.vue', '.json'],
    },

    plugins: [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: 'styles.css',
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: inProd,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: './src/browser/index.html',
        filename: 'index.html',
        appVars: {
          google: {
            apiKey: process.env.GOOGLE_API_KEY,
          },
        },
      }),
      new CopyPlugin({
        patterns: [
          { from: 'src/browser/images', to: 'images' },
        ],
      }),
    ],

  };
};
