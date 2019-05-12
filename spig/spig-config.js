"use strict";

const log        = require("fancy-log");
const fs         = require("fs");
const chalk      = require("chalk");
const glob       = require("glob");

const siteDefaults = {
  name: 'spig example site',
  baseURL: 'http://localhost:3000',
  version: '1.0.0',

  // environment
  env: process.env,

  // main folders
  srcDir:       './src',
  outDir:       './out',

  // js config
  jsBundleName: 'main.js',

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
  data: {},
  collections: {}
};

const devDefaults = {
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

  // extensions to be rendered
  render: [
    "**/*.md"
  ],

  jsUseBabel: false,

  supportedBrowsers: [
    'last 3 versions', // http://browserl.ist/?q=last+3+versions
    'ie >= 10', // http://browserl.ist/?q=ie+%3E%3D+10
    'edge >= 12', // http://browserl.ist/?q=edge+%3E%3D+12
    'firefox >= 28', // http://browserl.ist/?q=firefox+%3E%3D+28
    'chrome >= 21', // http://browserl.ist/?q=chrome+%3E%3D+21
    'safari >= 6.1', // http://browserl.ist/?q=safari+%3E%3D+6.1
    'opera >= 12.1', // http://browserl.ist/?q=opera+%3E%3D+12.1
    'ios >= 7', // http://browserl.ist/?q=ios+%3E%3D+7
    'android >= 4.4', // http://browserl.ist/?q=android+%3E%3D+4.4
    'blackberry >= 10', // http://browserl.ist/?q=blackberry+%3E%3D+10
    'operamobile >= 12.1', // http://browserl.ist/?q=operamobile+%3E%3D+12.1
    'samsung >= 4', // http://browserl.ist/?q=samsung+%3E%3D+4
  ]

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

    this.site = site;

    // data

    log("Reading " + chalk.magenta(site.dirData));

    const dataRoot = site.srcDir + site.dirData + "/";
    const dataFiles = glob.sync(dataRoot + "/**/*.json");
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

    // update development configuration

    let dev = devDefaults;

    if (fs.existsSync('./src/dev.json')) {
      log("Reading " + chalk.magenta("dev.json"));
      const devJson = JSON.parse(fs.readFileSync('./src/dev.json'));
      dev = {...dev, ...devJson};
    }

    this.dev = dev;

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
    if (fs.existsSync(this.site.srcDir + '/markdown.js')) {
      log("Reading " + chalk.magenta("markdown.js"));
      this.markdown(require('../' + this.site.srcDir + '/markdown'));
    }

    if (fs.existsSync(this.site.srcDir + '/nunjucks.js')) {
      log("Reading " + chalk.magenta("nunjucks.js"));
      this.nunjucks(require('../' + this.site.srcDir + '/nunjucks'));
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
