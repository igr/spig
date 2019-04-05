"use strict";

const datetimefmt = require('./filters/datetimefmt');
const pages = require('./filters/pages');

module.exports = nunjucksEnv => {
  nunjucksEnv
    .addFilter('dateDisplay', datetimefmt.dateDisplay)
    .addFilter('dateISO', datetimefmt.dateISO)

    .addFilter('within', pages.within)
    .addFilter('reverse', pages.reverse)
    .addFilter('sortByAttr', pages.sortByAttr)
    .addFilter('groupByAttr', pages.groupByAttr)
    .addFilter('groupByAttrDateYear', pages.groupByAttrDateYear)
  ;
};
