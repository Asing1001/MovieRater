var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

process.env.NODE_ENV = "production";

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
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader",
        })
      }
    ]
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: 'movie-rater',
        filename: 'service-worker.js',
        maximumFileSizeToCacheInBytes: 4194304,
        minify: true,
        runtimeCaching: [{
          urlPattern: /mvrater.com/,
          handler: 'cacheFirst',
          options: {
            cache: {
              name: '__movierater__',
              maxAgeSeconds: 60 * 60
            }
          }
        }, {
          urlPattern: /^https:\/\/s.yimg.com\//,
          handler: 'cacheFirst',
        }, {
          urlPattern: /^https:\/\/fonts./,
          handler: 'cacheFirst',
        }],
        stripPrefix: helpers.root('dist').replace(/\\/g, '/'),
        mergeStaticsConfig: true,
        staticFileGlobsIgnorePatterns: [/\.map$/, /favicons/],
      }
    ),
  ]
});
