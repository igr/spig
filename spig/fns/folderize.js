"use strict";

const Path = require('path');

/**
 * Changes the path of the file to be always in a folder and named as `index.xxx`.
 */
module.exports = (file) => {
  const filePath = file.meta.out;
  const extension = Path.extname(filePath);
  const baseName = Path.basename(filePath, extension);

  if (baseName !== 'index') {
    const ndx = filePath.lastIndexOf(baseName);
    file.meta.out = filePath.substr(0, ndx) + baseName + '/index' + extension;
  }
};
