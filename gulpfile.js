"use strict";

//
// EXAMPLE
//


const Spig = require('./spig/spig');
require('require-dir')('./spig/tasks');

const {DateTime} = require("luxon");


// CONFIGURE

Spig
  .config()
  .nunjucks({
    globals: {
      gv: "global value"
    },
    filters: {
      dateDisplay: (dateObj, format = "LLL d, y") => {
        return DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat(format);
      }
    }
  });

// WORK

Spig
  .on('/**/*.md')
  .initPage()
  .frontmatter()
  .renderMarkdown()
  .template()
  .folderize()
//  .debug()
;

Spig
  .on('/**/*.njk')
  .initPage()
  .frontmatter()
  .render()       // .renderNunjucks()
  .template()
  .folderize()
//  .debug()
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

