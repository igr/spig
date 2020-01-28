import fs from 'fs';
import glob from 'glob';
import * as log from './log';
import * as SpigConfig from './spig-config';
import { loadJs, loadJsonOrJs } from './load';
import { MarkdownEngine } from './engines/markdown-engine';
import { NunjucksEngine } from './engines/nunjucks-engine';
import { PugEngine } from './engines/pug-engine';

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
  const dataRoot = dev.srcDir + dev.dir.data + '/';

  log.pair('Reading', dev.dir.data);
  const dataFiles = glob.sync(`${dataRoot}**/*.json`);

  for (const f of dataFiles) {
    let target = SpigConfig.site.data as any;
    const file = f.substr(dataRoot.length);
    const chunks = file.split('/');
    for (const chunk of chunks) {
      if (chunk.endsWith('.json')) {
        // file located
        const dataJson = JSON.parse(fs.readFileSync(dataRoot + file, 'utf8'));
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
 */
export function initEngines(): void {
  const dev = SpigConfig.dev;

  const md = loadJs(dev.srcDir + '/markdown');
  if (md) {
    log.pair('Reading', 'markdown.js');
    MarkdownEngine.configure(md);
  }

  const nunjucks = loadJs(dev.srcDir + '/nunjucks');
  if (nunjucks) {
    log.pair('Reading', 'nunjucks.js');
    NunjucksEngine.configure(nunjucks);
  }

  const pug = loadJs(dev.srcDir + '/pug');
  if (pug) {
    log.pair('Reading', 'pug.js');
    PugEngine.configure(pug);
  }
}
