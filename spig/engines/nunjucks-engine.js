"use strict";

const nunjucks = require('nunjucks');
const SpigConfig = require('../spig-config');
const dev = SpigConfig.dev;

function configure() {
  return nunjucks.configure(
    [
      dev.root + dev.srcDir.substr(2) + dev.dirLayouts,
      dev.root + "spig/layouts",
    ], {
      autoescape: true,
      noCache: !SpigConfig.site.production
    }
  );
}


module.exports = configure();
