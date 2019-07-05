const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const merge = require("webpack-merge");

const babelLoaderConfig = require("./webpack.babel-loader");
const typescriptLoaderConfig = require("./webpack.typescript-loader");

const PRODUCTION_ENV = process.env.NODE_ENV === "production";

const config = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js"]
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
  plugins: []
};

// make separate webpack config just for webpack dev server
!PRODUCTION_ENV &&
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: __dirname + "/src/assets/index.html"
    })
  );

module.exports = merge(babelLoaderConfig, typescriptLoaderConfig, config);
