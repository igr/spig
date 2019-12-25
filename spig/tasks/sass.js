"use strict";

const glob = require("glob");
const Path = require("path");
const sass = require('node-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const precss = require('precss');
const cssnano = require('cssnano');
const SpigConfig = require('../spig-config');
const SpigUtil = require('../spig-util');

const dev = SpigConfig.dev;
const sourceRoot = dev.srcDir + dev.dirCss;
const files = sourceRoot + '/**/*.s?ss';

module.exports = task;
module.exports.watch = {files: files, task: task};

function task() {
  SpigUtil.logTask("sass");

  SpigConfig.site.assets['css'] = {};
  SpigConfig.site.assets.css['dir'] = dev.dirCssOut;

  glob.sync(files)
    .filter(file => !Path.basename(file).startsWith('_'))
    .forEach(file => processFile(file));
}

function processFile(file) {
  const fileName = Path.basename(file, Path.extname(file)) + '.css';

  // SASS -> CSS

  const cssResult = sass.renderSync({
    file: file
  });

  let content = cssResult.css;

  // POSTCSS

  const p = postcss()
    .use(precss)
    .use(autoprefixer);

  if (SpigConfig.site.production) {
    p.use(cssnano);
  }

  const postcssResult =
    p.process(content, {
      from: Path.basename(file),
      to: (dev.dirCssOut + '/' + fileName).substr(1)
    })
    .then(result => {
      if (result.map) {
        SpigUtil.writeToOut(dev.dirCssOut, fileName + ".map", result.map);
      }

      SpigUtil.writeToOut(dev.dirCssOut, fileName, result.css);
    });
}
