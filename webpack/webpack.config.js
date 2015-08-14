var path = require("path");

module.exports = {
  target: 'web',

  context: path.resolve(__dirname, '..', 'src'),

  entry: {
    main: '../index'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      {
        test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/, loader: 'file-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: 'dat.gui.js',
    library: ['dat'],
    libraryTarget: 'umd'
  }
};