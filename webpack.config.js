var path = require('path');

module.exports = {
  entry: './dist/main.js',
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  target: 'node',
  mode: 'production',
}
