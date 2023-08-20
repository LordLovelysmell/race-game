const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.cjs");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.min.js",
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devtool: false,
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
});
