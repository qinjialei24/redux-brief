const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/api.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ }],
  },
  plugins: [new CleanWebpackPlugin()],
};
