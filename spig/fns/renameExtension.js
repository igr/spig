"use strict";

const Meta = require('../meta');

/**
 * Renames file by setting a new extension.
 */
module.exports = (file, newExtension) => {
  if (file.ok) {
    return;
  }

  const filePath = file.out;

  file.out = filePath.substr(0, filePath.lastIndexOf('.')) + newExtension;
};
