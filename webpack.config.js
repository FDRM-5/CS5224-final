const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@common": path.resolve(__dirname, "./src/common"),
    },
  },
  devServer: {
    host: "localhost",
    port: process.env.PORT || 5000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@emotion/babel-preset-css-prop",
            ],
            plugins: [
              "@babel/transform-runtime",
              "@babel/syntax-dynamic-import",
              "@babel/proposal-class-properties",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
};
