import nunjucks, { Environment } from 'nunjucks';
import * as filtersOut from '../filters/out.js';
import * as filtersDatetimefmt from '../filters/datetimefmt.js';
import * as filtersPages from '../filters/pages.js';
import * as filtersCollection from '../filters/collections.js';
import * as filtersJson from '../filters/json.js';
import { RenderEngine } from './render-engine.js';
import { slugit } from '../util/slugit.js';
import { SpigConfig } from '../spig-config.js';

function initFilters(nunjucksEnv: nunjucks.Environment): void {
  nunjucksEnv
    .addFilter('out', filtersOut.out)
    .addFilter('slugify', slugit)

    .addFilter('json', filtersJson.json)

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

function initNunjucks(spigConfig: SpigConfig): Environment {
  const dev = spigConfig.dev;

  const nunjucksEnv = nunjucks.configure(
    [dev.root + dev.srcDir + dev.dir.layouts, dev.root + 'node_modules/spignite/lib/layouts'],
    {
      autoescape: true,
      noCache: !spigConfig.site.build.production,
    }
  );

  initFilters(nunjucksEnv);

  return nunjucksEnv;
}

export class NunjucksTemplateEngine implements RenderEngine<nunjucks.Environment> {
  private readonly nenv: nunjucks.Environment;

  constructor(spigConfig: SpigConfig) {
    this.nenv = initNunjucks(spigConfig);
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
