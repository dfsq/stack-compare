var path = require('path');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var CopyWebpackPlugin  = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var prod = process.env.NODE_ENV === 'production';

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(true),
  new webpack.optimize.CommonsChunkPlugin({ name: 'polyfills', filename: 'polyfills.bundle.js', minChunks: Infinity }),
  new CopyWebpackPlugin([
    { from: 'src/assets', to: 'assets' },
    { from: 'README.md', to: './'},
    { from: 'src/favicon.ico', to: './' }
  ]),
  new LiveReloadPlugin({ appendScriptTag: true }),
  new HtmlWebpackPlugin({ template: 'src/index.html' })
];

if (prod) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    sourceMap: false,
    mangle: false,
    comments: false
  }));
}

var config = {
  entry: {
    polyfills: path.resolve(__dirname, './src/polyfills.ts'),
    app: path.resolve(__dirname, './src/bootstrap.ts')
  },
  output: {
    path: path.resolve(__dirname, './build/'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.css', '.html']
  },
  module: {
    noParse: [
      /reflect-metadata/
    ],
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.html$/, loader: 'raw' },
      { // see for bootstrap loader: https://github.com/AngularClass/angular2-webpack-starter/issues/215
        test: /\.s?css$/,
        loader: 'style!css!sass'
      }
    ]
  },
  devtool: 'source-map',
  plugins: plugins,
  devServer: {
    historyApiFallback: true
  }
};

module.exports = config;
