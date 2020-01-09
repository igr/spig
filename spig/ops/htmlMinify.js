"use strict";

const SpigOperation = require('../spig-operation');
const SpigConfig = require('../spig-config');
const minify = require('html-minifier').minify;

/**
 * Minifies HTML.
 */
function processFile(fileRef, options = {}) {
  const defaults = SpigConfig.ops.htmlMinify;

  fileRef.string(minify(fileRef.string()), {...defaults, ...options});
}

module.exports.operation = () => {
  return SpigOperation
    .named('minify html')
    .onFile(fileRef => processFile(fileRef));
};
