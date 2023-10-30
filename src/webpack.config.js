const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
      vendor: './assets/js/vendor.js',
      main: './assets/js/main.js',
      linkInBio: './assets/js/linkinbio/linkinbio.js',
      linkInBioView: './assets/js/linkinbio/linkinbio-view.js',
      styles: './assets/css/main.scss',
      customLinkinbio: './assets/css/linkinbio.scss',
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