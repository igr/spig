import nunjucks from 'nunjucks';

import * as filtersOut from '../filters/out';
import * as filtersDatetimefmt from '../filters/datetimefmt';
import * as filtersPages from '../filters/pages';
import * as filtersCollection from '../filters/collections';
import * as SpigConfig from '../spig-config';
import { RenderEngine } from './render-engine';
import { slugit } from '../util/slugit';

function initFilters(nunjucksEnv: nunjucks.Environment): void {
  nunjucksEnv
    .addFilter('out', filtersOut.out)
    .addFilter('slugify', slugit)

    .addFilter('dateDisplay', filtersDatetimefmt.dateDisplay)
    .addFilter('dateISO', filtersDatetimefmt.dateISO)
    .addFilter('dateUTC', filtersDatetimefmt.dateUTC)

    .addFilter('pagesWithin', filtersPages.pagesWithin)
    .addFilter('pagesWithinSet', filtersPages.pagesWithinSet)
    .addFilter('pagesWithinSubdirs', filtersPages.pagesWithinSubdirs)

    .addFilter('keys', filtersCollection.keys)
    .addFilter('reverse', filtersCollection.reverse)
    .addFilter('sortBy', filtersCollection.sortBy)
    .addFilter('groupBy', filtersCollection.groupBy)
    .addFilter('groupByYear', filtersCollection.groupByDateYear)
    .addFilter('lastN', filtersCollection.lastN)
    .addFilter('firstN', filtersCollection.firstN)
    .addFilter('hasAttr', filtersCollection.hasAttr)
    .addFilter('hasNoAttr', filtersCollection.hasNoAttr)
    .addFilter('hasAttrVal', filtersCollection.hasAttrVal)
    .addFilter('startsWith', filtersCollection.startsWith);
}

function initNunjucks(): nunjucks.Environment {
  const dev = SpigConfig.dev;

  const nunjucksEnv = nunjucks.configure(
    [dev.root + dev.srcDir + dev.dir.layouts, dev.root + 'node_modules/spignite/lib/layouts'],
    {
      autoescape: true,
      noCache: !SpigConfig.site.build.production,
    }
  );

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
