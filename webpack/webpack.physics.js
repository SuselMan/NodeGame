const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['./src/Physics/index.ts'],
  output: {
    publicPath: 'static/physics',
    path: path.resolve(__dirname, '../dist/physics'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [ new TsconfigPathsPlugin({configFile: path.resolve(__dirname, '../tsconfig.json')})]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: '[name].bundle.js'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/physics/index.html'
    }),
    new webpack.DefinePlugin({
      PHYSICS_DEBUG: JSON.stringify(true)
    })
  ]
}
