const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

const folderName = 'prod';

module.exports = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, `../dist/${folderName}/`),
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[id].[chunkhash:8].js',
    publicPath: '',
  },
  mode: 'production',
  stats: {
    children: false,
  },
  plugins: [new CleanWebpackPlugin(), new webpack.optimize.ModuleConcatenationPlugin()],
});
