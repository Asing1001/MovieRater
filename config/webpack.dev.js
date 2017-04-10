var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    'hotserver' :'webpack/hot/only-dev-server',
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
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },

  devServer: {
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
      }
    }
  }
});