"use strict";

const nunjucks = require('nunjucks');

const datetimefmt = require('../filters/datetimefmt');
const pages = require('../filters/pages');
const collections = require('../filters/collections');

const SpigConfig = require('../spig-config');

function initFilters(nunjucksEnv) {
  nunjucksEnv
    .addFilter('out', require('../filters/out'))

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
    .addFilter('firstN', collections.firstN)
  ;

}

function configure() {
  const dev = SpigConfig.dev;

  const nunjucksEnv = nunjucks.configure(
    [
      dev.root + dev.srcDir + dev.dir.layouts,
      dev.root + 'spig/layouts',
    ], {
      autoescape: true,
      noCache: !SpigConfig.site.build.production
    }
  );

  initFilters(nunjucksEnv);

  return nunjucksEnv;
}


module.exports = configure();
