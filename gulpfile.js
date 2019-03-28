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
  .on('/**/*.md')
  .init()
  .render()
  .template()
  .debug()
;

Spig
  .on('/**/*.njk')
  .initPage()
  .folderize()
  .frontmatter()
  .slugish()
  .asHtml()
  .render()
  .template()
  .debug()
;

// COPY THROUGH

Spig
  .on(['/**/*.gif'])
  .initAsset()
  .imageMinify()
//.debug()
;

Spig
  .on('/**/*.{png,jpg}')
  .initAsset()
  .imageMinify()
//  .debug()
;

