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
  devServer: {
    contentBase: "./public",
  },
	devtool: 'source-map',
	watch: true,
	module: {
		loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
			{
				test: /\.js$/,
				loader: "babel",
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'react'],
          "plugins": [["react-transform", {
          "transforms": [{
              "transform": "react-transform-hmr",
              // if you use React Native, pass "react-native" instead:
              "imports": ["react"],
              // this is important for Webpack HMR:
              "locals": ["module"]
            }]
            // note: you can put more transforms into array
            // this is just one of them!
          }]]
				}
			}
		]
	},

}
