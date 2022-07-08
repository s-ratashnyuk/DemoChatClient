const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: ['./src/pages/main/mainDev.ts', './src/pages/main/main.hbs'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: {
      index: 'main.html',
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
});
