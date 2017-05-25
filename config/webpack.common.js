var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },

    module: {
        rules: [
            { test: /\.tsx?$/, use: ['babel-loader?presets[]=es2015', "ts-loader"] },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=[name].[hash].[ext]'
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),

        new CopyWebpackPlugin(
            [{
                from: './src/public',
                to: '../'
            }]
        ),
        new webpack.ProvidePlugin({}),

        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
};