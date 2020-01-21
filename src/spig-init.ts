import fs from 'fs';
import glob from 'glob';
import * as log from './log';
import * as SpigConfig from './spig-config';
import { loadJsonOrJs } from './load';

/**
 * Reads and update development configuration.
 */
export function initDevConfig(): void {
  const devFile = SpigConfig.dev.srcDir + '/dev';
  const dev = loadJsonOrJs(devFile);

  Object.assign(SpigConfig.dev, dev);
}

/**
 * Reads and update site configuration.
 */
export function initSiteConfig(): void {
  const siteFile = SpigConfig.dev.srcDir + '/site';
  const site = loadJsonOrJs(siteFile);

  Object.assign(SpigConfig.site, site);
}

/**
 * Reads and update ops configuration.
 */
export function initOpsConfig(): void {
  const opsFile = SpigConfig.dev.srcDir + '/ops';
  const ops = loadJsonOrJs(opsFile);

  Object.assign(SpigConfig.ops, ops);
}

export function initData(): void {
  const dev = SpigConfig.dev;
  log.pair('Reading', dev.dir.data);

  const dataRoot = dev.srcDir + dev.dir.data + '/';
  const dataFiles = glob.sync(dataRoot + '**!/!*.json');

  for (const f of dataFiles) {
    let target = SpigConfig.site.data as any;
    const file = f.substr(dataRoot.length);
    const chunks = file.split('/');
    for (const chunk of chunks) {
      if (chunk.endsWith('.json')) {
        // file located
        const dataJson = fs.readFileSync(dataRoot + file).toJSON();
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
}

export function initProductionMode(): void {
  const site = SpigConfig.site;
  const dev = SpigConfig.dev;

  if (site.build.env.SPIG_PRODUCTION) {
    site.build.production = true;
  }
  if (!site.build.production) {
    log.env('DEVELOPMENT');
    site.baseURL = `http://${dev.server.hostname}:${dev.server.port}`;
  } else {
    log.env('PRODUCTION');
  }
}

/**
 * Configure all engines from source folder.
 * todo implement this
 */
export function initEngines(): void {
  /*
  const dev = SpigConfig.dev;

  if (fs.existsSync(dev.srcDir + '/markdown.js')) {
    log.pair('Reading', 'markdown.json');
    const jsonFile = '../' + dev.srcDir + '/markdown';
    markdown(require(jsonFile));
  }

  if (fs.existsSync(dev.srcDir + '/nunjucks.js')) {
    log.pair('Reading', 'nunjucks.json');
    nunjucks(require('../' + dev.srcDir + '/nunjucks'));
  }
  */
}

/*
function markdown(fn: (engine: MarkdownIt) => void = () => {}): void {
  log.pair('Configuring', 'markdown');
  MarkdownEngine.configure(fn);
}
function nunjucks(fn: (engine: nunjucks.Environment) => void = () => {}): void {
  log.pair('Configuring', 'nunjucks');
  NunjucksEngine.configure(fn);
}
*/
