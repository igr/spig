"use strict";

const Meta = require('../meta');

/**
 * Renames file by setting a new extension.
 */
module.exports = (file, newExtension) => {
  const filePath = Meta.out(file);

  Meta.out(file, filePath.substr(0, filePath.lastIndexOf('.')) + newExtension);
};
