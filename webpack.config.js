const webpack = require('webpack')
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'pagination.js',
    //path: resolve(__dirname, 'public'),
    path: '/mnt/bkk/share/api/shop/lib',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
	    plugins: ["react-hot-loader/babel"],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
	         // { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|jpg|gif|bmp|svg)$/,
        exclude: /(node_modules)/,
        use: [
          { loader: 'file-loader' },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['public']),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  devServer: {
    hot: true,
  },
}
