"use strict";

const log        = require("fancy-log");
const fs         = require("fs");
const chalk      = require("chalk");

const siteDefaults = {
  name:    'spig site',
  version: '1.0.0',

  // main folders
  srcDir:       './src',
  outDir:       './out',

  // relative folders
  dirSite:      '/site',
  dirImages:    '/images',
  dirJs:        '/js',
  dirData:      '/data',
  dirCss:       '/css',
  dirStatic:    '/static',
  dirLayouts:   '/layouts',

  buildTime: new Date(),

  collections: {}
};

const developmentDefaults = {

  // images to be resized
  resizeImageSizes: [400, 1000],

};


class SpigConfig {
  constructor() {
    // update site configuration
    let site = siteDefaults;

    if (fs.existsSync('./src/site.json')) {
      log("Reading " + chalk.magenta("site.json"));
      const siteJson = JSON.parse(fs.readFileSync('./src/site.json'));
      site = {...site, ...siteJson};
    }

    site.root = process.cwd() + '/';

    this.siteConfig = site;

    // update development configuration

    let dev = developmentDefaults;

    if (fs.existsSync('./src/dev.json')) {
      log("Reading " + chalk.magenta("dev.json"));
      const devJson = JSON.parse(fs.readFileSync('./src/dev.json'));
      dev = {...dev, ...devJson};
    }

    this.devConfig = dev;
  }
  /**
   * Configures nunjucks.
   */
  nunjucks(options) {
    const nunjucks = require('./phase2/nunjucks');
    nunjucks.configure(options);
  }
}

module.exports = new SpigConfig();
