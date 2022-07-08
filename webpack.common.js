const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const preprocessHBS = require('./src/build/webpackPreprocessHBS');

const baseHandlebarTemplatePath = path.join(__dirname, 'src', 'layout', 'base.hbs');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.hbs'],
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[name].html',
            },
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: "html-loader",
            options: {
              preprocessor: preprocessHBS,
              sources: false,
            },
          },
        ],
        exclude: baseHandlebarTemplatePath,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
            },
          }
        ],
        exclude: /(node_modules)/
      },
      {
        test: /\.less$/,
        use: [
            MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                    'autoprefixer',
                    'cssnano',
                ],
              },
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
}
