"use strict";

const nunjucks = require('nunjucks');
const SpigConfig = require('../spig-config');
const site = SpigConfig.siteConfig;

function configure() {
  return nunjucks.configure(
    [
      site.root + site.srcDir.substr(2) + site.dirLayouts,
      site.root + "spig/layouts",
    ], {
      autoescape: true,
      noCache: !SpigConfig.devConfig.production
    }
  );
}


module.exports = configure();
