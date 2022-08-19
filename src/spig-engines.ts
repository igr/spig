import { loadJs } from './load';
import { spigConfig } from './ctx';
import { MarkdownRenderEngine } from './engines/markdown-engine';
import { NunjucksTemplateEngine } from './engines/nunjucks-engine';
import { PugTemplateEngine } from './engines/pug-engine';
import * as log from './log';

export class SpigEngines {
  #markdownEngine: MarkdownRenderEngine | undefined;

  public get markdownEngine(): MarkdownRenderEngine {
    return (this.#markdownEngine ??= this.#initMarkdownEngine());
  }

  #initMarkdownEngine(): MarkdownRenderEngine {
    const engine = new MarkdownRenderEngine();
    const md = loadJs(spigConfig.dev.srcDir + spigConfig.dev.dir.config + '/markdown');
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
    const engine = new NunjucksTemplateEngine(spigConfig);
    const nunjucks = loadJs(spigConfig.dev.srcDir + spigConfig.dev.dir.config + '/nunjucks');
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
    const pug = loadJs(spigConfig.dev.srcDir + spigConfig.dev.dir.config + '/pug');
    if (pug) {
      log.pair('Reading', 'pug.js');
      engine.configure(pug);
    }
    return engine;
  }
}
