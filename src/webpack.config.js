const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
      vendor: './assets/js/vendor.js',
      main: './assets/js/main.js',
      styles: './assets/css/main.scss',
      //customStyles: './assets/css/custom.scss',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'static/js'),
    },
    module: {
      rules: [
        {
          test: /\.scss$/, 
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '../css/[name].css',
      }),
    ],
  };