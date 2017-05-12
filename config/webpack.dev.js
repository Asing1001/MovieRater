var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    'main': './src/app/main.tsx',
    'vendor': './src/app/vendor.ts',
  },

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:3004/',
    filename: 'public/[name].js',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    open:true,
    historyApiFallback: true,
    stats: 'minimal',
    proxy: {
      '/public': {
        target: 'http://localhost:3003',
        secure: false
      },
      '/api': {
        target: 'http://localhost:3003',
        secure: false
      },
      '/graphql': {
        target: 'http://localhost:3003',
        secure: false
      },
      '/service-worker.js': {
        target: 'http://localhost:3003',
        secure: false
      }
    }
  }
});