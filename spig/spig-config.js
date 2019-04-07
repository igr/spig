"use strict";

const log        = require("fancy-log");
const fs         = require("fs");
const chalk      = require("chalk");

const siteDefaults = {
  name:    'spig site',
  baseURL: 'http://localhost:3000',
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

  pages: [],
  collections: {}
};

const developmentDefaults = {
  // production or development mode
  production: false,

  // environment variables
  env: process.env,

  // images to be resized
  resizeImageSizes: [400, 1000],

  templates: {
    // template extensions
    extensions: ['.njk'],

    // default template name
    default: 'base'
  },

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

    // production mode

    if (dev.env.SPIG_PRODUCTION) {
      dev.production = dev.env.SPIG_PRODUCTION;
    }
    if (dev.production === 'false' || dev.production === false) {
      log('Environment: ' + chalk.green('DEVELOPMENT'));
      site.baseURL = 'http://localhost:3000';
    } else {
      log('Environment: ' + chalk.green('PRODUCTION'));
    }
  }

  /**
   * Configure all engines from source folder.
   */
  configureEngines() {
    if (fs.existsSync(this.siteConfig.srcDir + '/markdown.js')) {
      log("Reading " + chalk.magenta("markdown.js"));
      this.markdown(require('../' + this.siteConfig.srcDir + '/markdown'));
    }

    if (fs.existsSync(this.siteConfig.srcDir + '/nunjucks.js')) {
      log("Reading " + chalk.magenta("nunjucks.js"));
      this.nunjucks(require('../' + this.siteConfig.srcDir + '/nunjucks'));
    }
  }

  /**
   * Configure Markdown engine.
   */
  markdown(fn) {
    if (typeof fn == 'function') {
      log("Configuring " + chalk.magenta("markdown"));
      const md = require('./engines/markdown-engine');
      fn(md);
    }
  }

  /**
   * Configures nunjucks.
   */
  nunjucks(fn) {
    if (typeof fn == 'function') {
      log("Configuring " + chalk.magenta("nunjucks"));
      const nunjucksEnv = require('./engines/nunjucks-engine');
      fn(nunjucksEnv);
    }
  }

}

module.exports = new SpigConfig();
