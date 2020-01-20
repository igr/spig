import * as nunjucks from 'nunjucks';
import * as datetimefmt from '../filters/datetimefmt';
import * as pages from '../filters/pages';
import * as collections from '../filters/collections';
import * as SpigConfig from '../spig-config';
import { RenderEngine } from './render-engine';

function initFilters(nunjucksEnv: nunjucks.Environment): void {
  nunjucksEnv
    // todo
    // .addFilter('out', require('../filters/out'))

    .addFilter('dateDisplay', datetimefmt.dateDisplay)
    .addFilter('dateISO', datetimefmt.dateISO)
    .addFilter('dateUTC', datetimefmt.dateUTC)

    .addFilter('pagesWithin', pages.pagesWithin)

    .addFilter('keys', collections.keys)
    .addFilter('reverse', collections.reverse)
    .addFilter('sortBy', collections.sortBy)
    .addFilter('groupBy', collections.groupBy)
    .addFilter('groupByYear', collections.groupByDateYear)
    .addFilter('lastN', collections.lastN)
    .addFilter('firstN', collections.firstN);
}

function initNunjucks(): nunjucks.Environment {
  const dev = SpigConfig.dev;

  const nunjucksEnv = nunjucks.configure([dev.root + dev.srcDir + dev.dir.layouts, dev.root + 'spig/layouts'], {
    autoescape: true,
    noCache: !SpigConfig.site.build.production,
  });

  initFilters(nunjucksEnv);

  return nunjucksEnv;
}

class NunjucksTemplateEngine implements RenderEngine<nunjucks.Environment> {
  private readonly nenv: nunjucks.Environment;

  constructor() {
    this.nenv = initNunjucks();
  }

  configure(engineConsumer: (engine: nunjucks.Environment) => void): void {
    engineConsumer(this.nenv);
  }

  render(input: string, context: object): string {
    return this.nenv.renderString(input, context);
  }

  renderInline(input: string, context: object): string {
    return this.render(input, context);
  }
}

export const NunjucksEngine: RenderEngine<nunjucks.Environment> = new NunjucksTemplateEngine();
