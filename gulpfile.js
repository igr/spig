"use strict";

//
// EXAMPLE
//


const Spig = require('./spig/spig');
require('require-dir')('./spig/tasks');

// PAGES

Spig
  .on('/**/*.{md,njk}')
  .pageCommon()
  .summary()
  .render()
  .applyTemplate()
  .htmlMinify()
;


// IMAGES

Spig
  .on('/**/*.{png,jpg,gif}')
  .imagesCommon()
  .imageMinify()
;

