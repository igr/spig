import { loadJs } from './load.js';
import { MarkdownRenderEngine } from './engines/markdown-engine.js';
import { NunjucksTemplateEngine } from './engines/nunjucks-engine.js';
import { PugTemplateEngine } from './engines/pug-engine.js';
import * as log from './log.js';
import { SpigConfig } from './spig-config.js';

export class SpigEngines {
  readonly #config: SpigConfig;

  constructor(config: SpigConfig) {
    this.#config = config;
  }

  #markdownEngine: MarkdownRenderEngine | undefined;

  public get markdownEngine(): MarkdownRenderEngine {
    return (this.#markdownEngine ??= this.#initMarkdownEngine());
  }

  #initMarkdownEngine(): MarkdownRenderEngine {
    const engine = new MarkdownRenderEngine();
    const md = loadJs(this.#config.dev.srcDir + this.#config.dev.dir.config + '/markdown');
    if (md) {
      log.pair('Reading', 'markdown.js');
      engine.configure(md);
    }
    return engine;
  }

  // ----------------------------------------------------------------

  #nunjucksEngine: NunjucksTemplateEngine | undefined;

  public get nunjucksEngine(): NunjucksTemplateEngine {
    return (this.#nunjucksEngine ??= this.#initNunjucksEngine());
  }

  #initNunjucksEngine(): NunjucksTemplateEngine {
    const engine = new NunjucksTemplateEngine(this.#config);
    const nunjucks = loadJs(this.#config.dev.srcDir + this.#config.dev.dir.config + '/nunjucks');
    if (nunjucks) {
      log.pair('Reading', 'nunjucks.js');
      engine.configure(nunjucks);
    }
    return engine;
  }

  // ----------------------------------------------------------------

  #pugEngine: PugTemplateEngine | undefined;

  public get pugEngine(): PugTemplateEngine {
    return (this.#pugEngine ??= this.#initPugEngine());
  }

  #initPugEngine(): PugTemplateEngine {
    const engine = new PugTemplateEngine();
    const pug = loadJs(this.#config.dev.srcDir + this.#config.dev.dir.config + '/pug');
    if (pug) {
      log.pair('Reading', 'pug.js');
      engine.configure(pug);
    }
    return engine;
  }
}
