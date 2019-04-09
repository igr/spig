"use strict";

const Spig = require('./spig/spig');
require('require-dir')('./spig/tasks');

// PAGES

Spig
  .on('/**/*.{md,njk}')

  ._("PREPARE")
  .pageCommon()
  .collect('tags')
  .readingTime()

  ._("RENDER")
  .summary()
  .render()
  .applyTemplate()
  .htmlMinify()
;


// IMAGES

Spig
  .on('/**/*.{png,jpg,gif}')

  ._("PREPARE")
  .assetCommon()

  ._("ASSETS")
  .imageMinify()
;
