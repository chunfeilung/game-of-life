module.exports = {
  entry: "./src/Life.ts",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  mode: "development",
  watch: true,

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  }
};
