"use strict";

//
// EXAMPLE
//

const { DateTime } = require("luxon");
const Spig = require('./spig/spig');
require('require-dir')('./spig/tasks');

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
  .initpage()
  .frontmatter()
  .markdown()
  .nunjucks()
  .folderize()
//  .debug()
;

Spig
  .on('/**/*.njk')
  .initpage()
  .frontmatter()
  .nunjucks()
  .folderize()
//  .debug()
;

// COPY THROUGH

Spig
  .on(['/**/*.gif'])
  .initasset()
//.debug()
;

Spig
  .on('/**/*.{png,jpg}')
  .initasset()
//  .debug()
;

