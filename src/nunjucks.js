"use strict";

const datetimefmt = require('../spig/filters/datetimefmt');
const pages = require('../spig/filters/pages');

module.exports = nunjucksEnv => {
  nunjucksEnv
    .addFilter('out', require('../spig/filters/out'))

    .addFilter('dateDisplay', datetimefmt.dateDisplay)
    .addFilter('dateISO', datetimefmt.dateISO)
    .addFilter('dateUTC', datetimefmt.dateUTC)

    .addFilter('within', pages.within)
    .addFilter('reverse', pages.reverse)
    .addFilter('sortBy', pages.sortBy)
    .addFilter('groupBy', pages.groupBy)
    .addFilter('groupByYear', pages.groupByDateYear)
    .addFilter('lastN', pages.lastN)
    .addFilter('firstN', pages.firstN)
  ;
};
