const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'node',
  node: {
    __dirname: false
  },
  entry: './src/server/server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist/server')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [ new TsconfigPathsPlugin({configFile: path.resolve(__dirname, '../tsconfig.json')})]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, '../src'),
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      PHYSICS_DEBUG: JSON.stringify(false)
    })
  ],
  externals: [nodeExternals()]
}
