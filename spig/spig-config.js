"use strict";

const log         = require("fancy-log");
const fs          = require("fs");
const chalk       = require("chalk");
const glob        = require("glob");
const SpigVersion = require('./spig-version');

/**
 * Site configuration defaults. Accessible in templates.
 */
const siteDefaults = {
  name: 'My Awesome Spig Site',
  baseURL: 'http://localhost:3000',
  version: '0.0.1',

  // environment
  env: process.env,

  // production or development mode
  production: false,

  assets: {},

  // data folder
  data: {},

  // list of all pages
  pages: [],

  // collections
  collections: {},

  // build related data
  build: {
    date: new Date()
  },

  // some spig data
  spig: {
    version: SpigVersion,
  },

};

/**
 * Development-related configuration. For internal use only.
 * Folder names do not end with a slash. All paths are relative, but starts with `/`.
 * This makes building paths easier.
 */
const devDefaults = {

  // source root folder
  srcDir: './src',

  // relative source folders
  dirSite: '/site',
  dirImages: '/images',
  dirJs: '/js',
  dirData: '/data',
  dirCss: '/css',
  dirStatic: '/static',
  dirLayouts: '/layouts',
  dirLambda: '/lambda',

  // output root folder
  outDir: './out',

  // relative output folders
  dirJsOut: '/js',
  dirCssOut: '/css',
  dirImagesOut: `/images`,

  // names
  // todo move to configuration of each operation!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  names: {
    bundle_js: 'main.js'
  },

  templates: {
    // template extensions
    extensions: ['.njk'],

    // default template name
    default: 'base'
  },

  // extensions to be rendered
  render: [
    "**/*.md"
  ],

  jsUseBabel: false,

  // configuration for local development
  // todo move to configuration of each operation
  local: {
    port: 3000,
    hostname: 'localhost'
  },

};


class SpigConfig {
  constructor() {
    // read and update development configuration

    let dev = devDefaults;

    const devJsonFile = dev.srcDir + 'dev.json';

    if (fs.existsSync(devJsonFile)) {
      log("Reading " + chalk.magenta("dev.json"));
      const devJson = JSON.parse(fs.readFileSync(devJsonFile));
      dev = {...dev, ...devJson};
    }

    dev.root = process.cwd() + '/';

    this.dev = dev;


    // read and update site configuration

    let site = siteDefaults;

    const siteJsonFile = dev.srcDir + '/site.json';

    if (fs.existsSync(siteJsonFile)) {
      log("Reading " + chalk.magenta("site.json"));
      const siteJson = JSON.parse(fs.readFileSync(siteJsonFile));
      site = {...site, ...siteJson};
    }

    this.site = site;

    site.dev = this.dev;

    // data

    log("Reading " + chalk.magenta(dev.dirData));

    const dataRoot = dev.srcDir + dev.dirData + "/";
    const dataFiles = glob.sync(dataRoot + "**/*.json");
    for (const f of dataFiles) {
      let target = site.data;
      const file = f.substr(dataRoot.length);
      const chunks = file.split("/");
      for (const chunk of chunks) {
        if (chunk.endsWith(".json")) {
          // file located
          const dataJson = JSON.parse(fs.readFileSync(dataRoot + file));
          target[chunk.substr(0, chunk.length - 5)] = dataJson;
        }
        else {
          // go one folder deeper
          if (!target[chunk]) {
            target[chunk] = {};
          }
          target = target[chunk];
        }
      }
    }

    // production mode

    if (site.env.SPIG_PRODUCTION) {
      site.production = site.env.SPIG_PRODUCTION;
    }
    if (site.production === 'false' || site.production === false) {
      log('Environment: ' + chalk.green('DEVELOPMENT'));
      site.baseURL = 'http://localhost:3000';   // tdo read dev
    } else {
      log('Environment: ' + chalk.green('PRODUCTION'));
    }
  }

  /**
   * Configure all engines from source folder.
   */
  configureEngines() {
    if (fs.existsSync(this.dev.srcDir + '/markdown.js')) {
      log("Reading " + chalk.magenta("markdown.js"));
      this.markdown(require('../' + this.dev.srcDir + '/markdown'));
    }

    if (fs.existsSync(this.dev.srcDir + '/nunjucks.js')) {
      log("Reading " + chalk.magenta("nunjucks.js"));
      this.nunjucks(require('../' + this.dev.srcDir + '/nunjucks'));
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
