const path = require('path');

module.exports = {
  includePaths: [path.resolve(__dirname, 'src')],
  outputStyle: 'expanded',
  sourceMap: true,
  importer: function(url, prev) {
    if (url.startsWith('@styles/')) {
      return {
        file: path.resolve(__dirname, 'src/styles', url.replace('@styles/', ''))
      };
    }
    return null;
  }
}; 