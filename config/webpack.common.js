var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {

    resolve: {
        extensions: ['', '.js', '.ts', '.tsx']
    },

    module: {
        loaders: [
            { test: /\.tsx?$/, loaders: ['babel-loader?presets[]=es2015', "ts-loader"] },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=public/[name].[hash].[ext]'
            }
        ],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['main', 'vendor']
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),

        new CopyWebpackPlugin(
            [{
                from: './src/public',
                to: 'public'
            }]
        ),

        new webpack.ProvidePlugin({}),

    ]
};