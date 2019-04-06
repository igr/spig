"use strict";

const datetimefmt = require('../spig/filters/datetimefmt');
const pages = require('../spig/filters/pages');

module.exports = nunjucksEnv => {
  nunjucksEnv
    .addFilter('out', require('../spig/filters/out'))

    .addFilter('dateDisplay', datetimefmt.dateDisplay)
    .addFilter('dateISO', datetimefmt.dateISO)

    .addFilter('within', pages.within)
    .addFilter('reverse', pages.reverse)
    .addFilter('sortBy', pages.sortBy)
    .addFilter('groupBy', pages.groupBy)
    .addFilter('groupByYear', pages.groupByDateYear)
  ;
};
