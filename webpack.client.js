const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const merge = require("webpack-merge");

const babelLoaderConfig = require("./webpack.babel-loader");
const typescriptLoaderConfig = require("./webpack.typescript-loader");

const PRODUCTION_ENV = process.env.NODE_ENV === "production";

const config = {
  entry: "./src/index.jsx",
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          //todo: check this is it obsolete
          !PRODUCTION_ENV ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: __dirname + "/public",
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./public",
    historyApiFallback: true
  },
  optimization: {
    minimizer: PRODUCTION_ENV
      ? [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})]
      : []
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};

// make separate webpack config just for webpack dev server
!PRODUCTION_ENV &&
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: __dirname + "/src/assets/index.html"
    })
  );

module.exports = merge(babelLoaderConfig, typescriptLoaderConfig, config);
