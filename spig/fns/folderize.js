"use strict";

const Path = require('path');
const Meta = require('../meta');

/**
 * Changes the path of the file to be always in a folder and named as `index.xxx`.
 */
module.exports = (file) => {
  const filePath = Meta.out(file);
  
  const extension = Path.extname(filePath);
  const baseName = Path.basename(filePath, extension);

  if (baseName !== 'index') {
    const ndx = filePath.lastIndexOf(baseName);

    Meta.out(file, filePath.substr(0, ndx) + baseName + '/index' + extension);
  }
};
