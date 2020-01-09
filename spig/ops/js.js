"use strict";

const SpigOperation = require('../spig-operation');
const SpigConfig = require('../spig-config');
const uglify = require('uglify-js');
const babel = require("@babel/core");

const dev = SpigConfig.dev;
const sourceRoot = dev.srcDir + dev.dirJs;
const files = sourceRoot + "/**/*";

SpigConfig.site.assets['js'] = {};
SpigConfig.site.assets.js['dir'] = dev.dirJsOut;
SpigConfig.site.assets.js['bundle'] = dev.dirJsOut + '/' + dev.names.bundle_js;

module.exports.operation = (options) => {
  return SpigOperation
    .named("javascript")
    .onFile((fileRef) => processFile(fileRef))
    ;
};


function processFile(fileReference) {
  let bundleCode = fileReference.string();

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

  fileReference.string(bundleCode)
}
