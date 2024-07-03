const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'js/[name].js',
    publicPath: '',
  },
  mode: 'development',
  devtool: 'source-map',
  watch: true,
  devServer: {
    compress: true,
    historyApiFallback: true,
    noInfo: true,
    stats: {
      colors: true,
    },
    overlay: {
      warnings: true,
      errors: true,
    },
    hot: true,
    contentBase: [path.join(__dirname, '../app')],
    watchContentBase: false,
    port: 8080,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
