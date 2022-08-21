import fs from 'fs';
import glob from 'glob';
import * as log from './log';
import { setLog, loadJsonOrJs } from './load';
import { isEnvProduction } from './envs';
import { initSiteLang } from './spig-lang';
import { ctx } from './ctx';

/**
 * Reads and update development configuration.
 */
export function initDevConfig(): void {
  const devFile = ctx.config.dev.srcDir + '/dev';
  const dev = loadJsonOrJs(devFile);

  Object.assign(ctx.config.dev, dev);
}

/**
 * Reads and update site configuration.
 */
export function initSiteConfig(): void {
  const siteFile = ctx.config.dev.srcDir + '/site';
  const site = loadJsonOrJs(siteFile);

  Object.assign(ctx.config.site, site);
}

export function initSiteLanguages(): void {
  initSiteLang();
  if (ctx.config.site.lang.length !== 0) {
    const list = ctx.config.site.lang.map((it) => it.key);
    log.pair('Lang:', JSON.stringify(list));
  }
}

/**
 * Reads and update ops configuration.
 */
export function initOpsConfig(): void {
  const opsFile = ctx.config.dev.srcDir + '/ops';
  const ops = loadJsonOrJs(opsFile);

  Object.assign(ctx.config.ops, ops);
}

/**
 * Reads JSON files from Data folder.
 */
export function initData(): void {
  const dev = ctx.config.dev;
  const dataRoot = dev.srcDir + dev.dir.data + '/';

  log.pair('Reading', dev.dir.data);
  const dataFiles = glob.sync(`${dataRoot}**/*.json`);

  for (const f of dataFiles) {
    let target = ctx.config.site.data as any;
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
  const site = ctx.config.site;
  const dev = ctx.config.dev;

  if (isEnvProduction()) {
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
 * Init various tools.
 */
export function initOps(): void {
  const dev = ctx.config.dev;

  const cssnano = loadJsonOrJs(dev.srcDir + dev.dir.config + '/cssnano');
  ctx.config.libs.cssnano = { ...ctx.config.libs.cssnano, ...cssnano };
}

/**
 * Ends the initialization.
 */
export function done(): void {
  setLog(false);
}
