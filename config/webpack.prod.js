var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  entry: {
    'main': './src/app/main.tsx',
    'vendor': './src/app/vendor.ts'
  },

  output: {
    path: helpers.root('dist/public/bundles/'),
    publicPath: '/public/bundles/', //For HtmlWebpackPlugin file prefix
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }
    ]
  },

  htmlLoader: {
    minimize: true
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(ENV)
      }
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'movie-rater',
        filename: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 4194304,
        minify: true,
        runtimeCaching: [{
          urlPattern: /.*/,
          handler: 'fastest',
          // Currently all browser is not supporting service-worker post
          // method : 'post'          
        }],
        stripPrefix: helpers.root('dist').replace(/\\/g,'/'),
        mergeStaticsConfig: true,
        staticFileGlobsIgnorePatterns: [/\.map$/, /favicons/],
      }
    ),
  ]
});
