const path = require("path");
const webpack = require("webpack"); 

require("dotenv").config({ path: "./.env" });

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "kickoffbot-web-starter.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: "css/[name][ext][query]",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
};
