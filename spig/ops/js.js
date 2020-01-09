"use strict";

const SpigOperation = require('../spig-operation');
const SpigConfig = require('../spig-config');
const uglify = require('uglify-js');
const babel = require("@babel/core");

const dev = SpigConfig.dev;

SpigConfig.site.assets['js'] = {};
SpigConfig.site.assets.js['dir'] = dev.dirJsOut;
SpigConfig.site.assets.js['bundle'] = dev.dirJsOut + '/' + dev.names.bundle_js;

function processFile(fileRef) {
  let bundleCode = fileRef.string();

  const result = babel.transformSync(bundleCode, {
    presets: ['@babel/preset-env', {}]
  });
  bundleCode = result.code;

  // uglify

  if (SpigConfig.site.production) {
    const result = uglify.minify(bundleCode);
    if (result.error) {
      throw new Error(result.error);
    }
    bundleCode = result.code;
  }

  // update file reference

  fileRef.string(bundleCode)
}

module.exports.operation = (options = {}) => {
  return SpigOperation
    .named('javascript')
    .onFile((fileRef) => processFile(fileRef));
};


