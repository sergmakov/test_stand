'use strict'
var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './public/js/components/index',
	output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/public/"
	},
	devtool: 'source-map',
	watch: true,
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel",
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	},
}
