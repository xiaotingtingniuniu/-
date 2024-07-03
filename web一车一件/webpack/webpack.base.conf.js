const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const chalk = require('chalk');

const isLocal = !process.env.NODE_ENV;

const configFileName = () => (process.env.NODE_ENV ? process.env.NODE_ENV : 'development');

const entry = {
  index: path.resolve(__dirname, '../app/index.js'),
  login: path.resolve(__dirname, '../app/login.js'),
  share: path.resolve(__dirname, '../app/share.js'),
  h5: path.resolve(__dirname, '../app/h5.js'),
  agreement: path.resolve(__dirname, '../app/agreement.js'),
};

const cssLoaders = [isLocal ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'resolve-url-loader'];

const sassLoaderConfig = {
  loader: 'sass-loader',
  options: {
    sourceMap: true,
    sassOptions: {
      includePaths: [path.resolve(__dirname, '../app/sass')],
    },
    prependData: '@import "index.scss";',
  },
};

const htmlWebpackPlugin = Object.keys(entry).map(
  name =>
    new HtmlWebpackPlugin({
      title: '一车一件',
      description: '车架号查配件，就用一车一件。查询速度快、唯一性高。一车一件专注于为汽车后市场从业者提供精准的汽车零配件查询服务，目前覆盖103个汽车品牌，145个汽车厂牌。可通过17位车架号(VIN)实现车辆信息的精准解析和配件号码(OE号)的精准匹配，真正做到一车一件。同时您还可以查看对应配件的价格、装配图、适配的车型和品牌件等信息，配件信息精准、价格更新及时。一车一件以其快速精准易用的特点赢得了保险公司5万定损查勘、核损核价老师的信任，既是配件经销商、修理厂日常查询、对接保险的必备工具。',
      keywords: '一车一件',
      favicon: path.resolve(__dirname, '../app/images/favicon.png'),
      template: 'app/index.html',
      filename: `${name}.html`,
      chunksSortMode: 'none',
      chunks: [name],
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
);

module.exports = {
  entry,
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(scss|sass)$/,
        loaders: [...cssLoaders, sassLoaderConfig],
      },
      {
        test: /\.css$/,
        loaders: cssLoaders,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        exclude: /(node_modules)/,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[sha512:hash:base64:7].[ext]',
              publicPath: '../fonts/',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[sha512:hash:base64:7].[ext]',
              publicPath: '../images/',
              outputPath: 'images/',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../app')],
    alias: {
      config$: path.join(__dirname, '../app/config', configFileName()),
      '@': path.resolve(__dirname, '../app'),
    },
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          compress: {
            pure_funcs: isLocal ? [] : ['console.info', 'console.log'],
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  performance: {
    hints: false,
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   openAnalyzer: false,
    // }),
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
    }),
    new VueLoaderPlugin(),
    new webpack.optimize.SplitChunksPlugin(),
    ...htmlWebpackPlugin,
    new MiniCssExtractPlugin({
      filename: isLocal ? 'css/[name].css' : 'css/[name].[chunkhash:8].css',
      chunkFilename: isLocal ? 'css/[id].css' : 'css/[id].[chunkhash:8].css',
    }),
  ],
  externals: {
    OpenInstall: 'OpenInstall',
  },
};
