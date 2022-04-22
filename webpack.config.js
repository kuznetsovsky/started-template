const getConfig = (mode) => ({
  mode,
  devtool: mode === 'production' ? false : 'inline-source-map',
  entry: {
    index: './source/scripts/index.js',
    vendor: './source/scripts/vendor.js',
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
    ],
  },
});

export default getConfig;
