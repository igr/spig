"use strict";

//
// EXAMPLE
//


const Spig = require('./spig/spig');
const SpigConfig = require('./spig/spig-config');
const datetimefmt = require('./src/filters/datetimefmt');

require('require-dir')('./spig/tasks');


// CONFIGURE

SpigConfig
  .nunjucks({
    globals: {
      gv: "global value"
    },
    filters: {
      dateDisplay: datetimefmt.dateDisplay
    }
  });

// WORK

Spig
  .on('/**/*.{md,njk}')
  .pageCommon()
  .collect('tags')
  .render()
  .applyTemplate()
  .htmlMinify()
//  .debug()
;


// COPY THROUGH

Spig
  .on('/**/*.{png,jpg,gif}')
  .imagesCommon()
  .imageMinify()
//  .debug()
;

