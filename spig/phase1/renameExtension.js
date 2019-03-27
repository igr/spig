"use strict";

/**
 * Renames file by setting a new extension.
 */
module.exports = (file, newExtension) => {
  const filePath = file.out;

  file.out = filePath.substr(0, filePath.lastIndexOf('.')) + newExtension;
};
