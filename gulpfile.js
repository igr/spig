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
  .collect('tags')
  .render()
  .applyTemplate()
  .htmlMinify()
//  .debug()
;


// IMAGES

Spig
  .on('/**/*.{png,jpg,gif}')
  .imagesCommon()
  .imageMinify()
//  .debug()
;

