import fs from 'fs';
import glob from 'glob';
import * as log from './log';
import { setLog, loadJsonOrJs } from './load';
import { isEnvProduction } from './envs';
import { initSiteLang } from './spig-lang';
import { SpigConfig } from './spig-config';

export class SpigInit {
  readonly #config: SpigConfig;

  constructor(config: SpigConfig) {
    this.#config = config;
  }

  init(): void {
    this.initDevConfig(this.#config);
    this.initSiteConfig(this.#config);
    this.initSiteLanguages(this.#config);
    this.initOpsConfig(this.#config);
    this.initData(this.#config);
    this.initProductionMode(this.#config);
    this.initOps(this.#config);
    this.done();
  }

  softReset(): void {
    this.initData(this.#config);
  }

  /**
   * Reads and update development configuration.
   */
  private initDevConfig(config: SpigConfig): void {
    const devFile = config.dev.srcDir + '/dev';
    const dev = loadJsonOrJs(devFile);

    Object.assign(config.dev, dev);
  }

  /**
   * Reads and update site configuration.
   */
  private initSiteConfig(config: SpigConfig): void {
    const siteFile = config.dev.srcDir + '/site';
    const site = loadJsonOrJs(siteFile);

    Object.assign(config.site, site);
  }

  private initSiteLanguages(config: SpigConfig): void {
    initSiteLang();
    if (config.site.lang.length !== 0) {
      const list = config.site.lang.map((it) => it.key);
      log.pair('Lang:', JSON.stringify(list));
    }
  }

  /**
   * Reads and update ops configuration.
   */
  private initOpsConfig(config: SpigConfig): void {
    const opsFile = config.dev.srcDir + '/ops';
    const ops = loadJsonOrJs(opsFile);

    Object.assign(config.ops, ops);
  }

  /**
   * Reads JSON files from Data folder.
   */
  private initData(config: SpigConfig): void {
    const dev = config.dev;
    const dataRoot = dev.srcDir + dev.dir.data + '/';

    log.pair('Reading', dev.dir.data);
    const dataFiles = glob.sync(`${dataRoot}**/*.json`);

    for (const f of dataFiles) {
      let target = config.site.data as any;
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

  private initProductionMode(config: SpigConfig): void {
    const site = config.site;
    const dev = config.dev;

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
  public initOps(config: SpigConfig): void {
    const dev = config.dev;

    const cssnano = loadJsonOrJs(dev.srcDir + dev.dir.config + '/cssnano');
    config.libs.cssnano = { ...config.libs.cssnano, ...cssnano };
  }

  /**
   * Ends the initialization.
   */
  public done(): void {
    setLog(false);
  }
}
