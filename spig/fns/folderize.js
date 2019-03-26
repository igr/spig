"use strict";

const Path     = require('path');

module.exports = (file) => {
  const filePath = file.meta.out;
  const baseName = Path.basename(filePath, '.html');

  if (baseName !== 'index') {
    const ndx = filePath.lastIndexOf(baseName);
    file.meta.out = filePath.substr(0, ndx) + baseName + '/index.html';
  }
};
