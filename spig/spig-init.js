"use strict";

const fs = require("fs");
const SpigConfig = require('./spig-config');
const log = require('./log');
const glob = require('glob');
const Path = require('path');

/**
 * Loads a JSON file or JS file that returns an object.
 */
function loadJsonOrJs(nameNoExt) {
  let obj = {};

  const jsFile = nameNoExt + '.js';

  if (fs.existsSync(jsFile)) {
    log.pair('Reading', Path.basename(jsFile));
    const jsRequireModule = '../' + jsFile.substr(0, jsFile.length - 3);
    const config = require(jsRequireModule)();

    obj = {...obj, ...config};
  }

  const jsonFile = nameNoExt + '.json';

  if (fs.existsSync(jsonFile)) {
    log.pair('Reading', Path.basename(jsonFile));
    const json = JSON.parse(fs.readFileSync(jsonFile));

    obj = {...obj, ...json};
  }
  return obj;
}


/**
 * Reads and update development configuration.
 */
module.exports.initDevConfig = () => {
  let dev = SpigConfig.dev;

  const devFile = dev.srcDir + '/dev';
  dev = {...dev, ...loadJsonOrJs(devFile)};

  dev.root = process.cwd() + '/';

  SpigConfig.dev = dev;
};

/**
 * Reads and update site configuration.
 */
module.exports.initSiteConfig = () => {
  const dev = SpigConfig.dev;

  let site = SpigConfig.site;

  const siteFile = dev.srcDir + '/site';
  site = {...site, ...loadJsonOrJs(siteFile)};

  site.dev = dev;

  SpigConfig.site = site;
};

/**
 * Reads and update ops configuration.
 */
module.exports.initOpsConfig = () => {
  const dev = SpigConfig.dev;

  let ops = SpigConfig.ops;

  const opsFile = dev.srcDir + '/ops';
  ops = {...ops, ...loadJsonOrJs(opsFile)};

  SpigConfig.ops = ops;
};


module.exports.initData = () => {
  const dev = SpigConfig.dev;
  log.pair('Reading', dev.dir.data);

  const dataRoot = dev.srcDir + dev.dir.data + "/";
  const dataFiles = glob.sync(dataRoot + "**!/!*.json");
  for (const f of dataFiles) {
    let target = site.data;
    const file = f.substr(dataRoot.length);
    const chunks = file.split("/");
    for (const chunk of chunks) {
      if (chunk.endsWith(".json")) {
        // file located
        const dataJson = JSON.parse(fs.readFileSync(dataRoot + file));
        target[chunk.substr(0, chunk.length - 5)] = dataJson;
      } else {
        // go one folder deeper
        if (!target[chunk]) {
          target[chunk] = {};
        }
        target = target[chunk];
      }
    }
  }
};

module.exports.initProductionMode = () => {
  const site = SpigConfig.site;
  const dev = SpigConfig.dev;

  if (site.env.SPIG_PRODUCTION) {
    site.production = site.env.SPIG_PRODUCTION;
  }
  if (site.production === false) {
    log.env('DEVELOPMENT');
    site.baseURL = `http://${dev.server.hostname}:${dev.server.port}`;
  } else {
    log.env('PRODUCTION');
  }
};

/**
 * Configure all engines from source folder.
 */
module.exports.initEngines = () => {
  const dev = SpigConfig.dev;

  if (fs.existsSync(dev.srcDir + '/markdown.js')) {
    log.pair('Reading', 'markdown.json');
    markdown(require('../' + dev.srcDir + '/markdown'));
  }

  if (fs.existsSync(dev.srcDir + '/nunjucks.js')) {
    log.pair('Reading', 'nunjucks.json');
    nunjucks(require('../' + dev.srcDir + '/nunjucks'));
  }
};


/**
 * Configure Markdown engine.
 */
function markdown(fn) {
  if (typeof fn == 'function') {
    log.pair('Configuring', 'markdown');
    const md = require('./engines/markdown-engine');
    fn(md);
  }
}

/**
 * Configures nunjucks.
 */
function nunjucks(fn) {
  if (typeof fn == 'function') {
    log.pair('Configuring', 'nunjucks');
    const nunjucksEnv = require('./engines/nunjucks-engine');
    fn(nunjucksEnv);
  }
}

