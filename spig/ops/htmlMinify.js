"use strict";

const SpigOperation = require('../spig-operation');
const minify = require('html-minifier').minify;

const defaults = {
  collapseWhitespace: true,
  conservativeCollapse: false
};

/**
 * Minifies HTML.
 */
function processFile(fileRef, options = {}) {
  fileRef.string(minify(fileRef.string()), {...defaults, ...options});
}

module.exports.operation = () => {
  return SpigOperation
    .named('minify html')
    .onFile(fileRef => processFile(fileRef));
};
