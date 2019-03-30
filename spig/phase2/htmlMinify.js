"use strict";

const minify = require('html-minifier').minify;

const defaults = {
  collapseWhitespace: true,
  conservativeCollapse: false
};

/**
 * Minifies HTML.
 */

module.exports = (file, options = {}) => {
  const value = minify(file.contents.toString(), {...defaults, ...options});
  file.contents = Buffer.from(value);
};
