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
  .initPage()
  .folderize()
  .frontmatter()
  .renderMarkdown()
  .template()
  .debug()
;

Spig
  .on('/**/*.njk')
  .initPage()
  .folderize()
  .frontmatter()
  .render()       // .renderNunjucks()
  .template()
  .debug()
;

// COPY THROUGH

Spig
  .on(['/**/*.gif'])
  .initAsset()
//.debug()
;

Spig
  .on('/**/*.{png,jpg}')
  .initAsset()
//  .debug()
;

