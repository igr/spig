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

  // images to be resized
  resizeImageSizes:  [400, 1000],

  buildTime: new Date()
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
    this.siteConfig.pages = [];
    this.pages = {};
  }

  site() {
    return this.siteConfig;
  }

  /**
   * Registers file as a page.
   */
  registerSitePage(file) {
    this.pages[file.meta.name] = file;
    this.siteConfig.pages.push(file);
    return this;
  }

  /**
   * Configures nunjucks.
   */
  nunjucks(options) {
    const nunjucks = require('./fns/nunjucks');
    nunjucks.configure(options);
  }
}

module.exports = new SpigConfig();
