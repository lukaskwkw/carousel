const path = require("path");
const merge = require("webpack-merge");
const webpackNodeExternals = require("webpack-node-externals");
const babelLoaderConfig = require("./webpack.babel-loader.js");
const typescriptLoaderConfig = require("./webpack.typescript-loader");

const config = {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ["css-loader", "sass-loader"]
      }
    ]
  },
  // Inform webpack that we're building a bundle
  // for nodeJS, rather than for the browser
  target: "node",

  mode: "production",

  // Tell webpack the root file of our
  // server application
  entry: "./src/server.js",
  // We don't serve bundle.js for server, so we can use dynamic external imports
  externals: [webpackNodeExternals()],
  resolve: {
    extensions: ["*", ".js"]
  },
  // Tell webpack where to put the output file
  // that is generated
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname)
  }
};

module.exports = merge(babelLoaderConfig, typescriptLoaderConfig, config);
