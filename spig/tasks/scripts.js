"use strict";

const glob = require("glob");
const fs = require("fs");
const uglify = require("uglify-js");
const babel = require("@babel/core");
const SpigConfig = require('../spig-config');
const SpigUtil = require('../spig-util');

const dev = SpigConfig.dev;
const sourceRoot = dev.srcDir + dev.dirJs;
const files = sourceRoot + "/**/*";

module.exports = task;
module.exports.watch = {files: files, task: task};

function task() {
  SpigUtil.logTask("js");

  SpigConfig.site.assets['js'] = {};
  SpigConfig.site.assets.js['dir'] = dev.dirJsOut;
  SpigConfig.site.assets.js['bundle'] = dev.dirJsOut + '/' + dev.names.bundle_js;

  let bundleCode = "";

  // merge all JS files

  glob.sync(files)
    .forEach(file => {
      bundleCode = bundleCode + fs.readFileSync(file);
    });

  // babel

  const result = babel.transformSync(bundleCode, {
    presets: ['@babel/preset-env', {
    }]
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

  // save bundle

  SpigUtil.writeToOut(dev.dirJsOut, dev.names.bundle_js, bundleCode);
}
