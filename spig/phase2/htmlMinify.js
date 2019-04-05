"use strict";

const minify = require('html-minifier').minify;
const SpigFiles = require('../spig-files');

const defaults = {
  collapseWhitespace: true,
  conservativeCollapse: false
};

/**
 * Minifies HTML.
 */

module.exports = (file, options = {}) => {
  const value = minify(SpigFiles.stringContents(file), {...defaults, ...options});
  file.contents = value;
};
