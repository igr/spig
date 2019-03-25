"use strict";

const { DateTime } = require("luxon");
const Spig = require('./spig/spig');
require('require-dir')('./spig');

// CONFIG

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
  .initdata()
  .frontmatter()
  .markdown()
  .folderize()
  .debug();

Spig
  .on('/**/*.njk')
  .initdata()
  .frontmatter()
  .nunjucks()
  .folderize()
  .debug();

// COPY THROUGH

Spig
  .on(['/**/*.gif'])
  .initdata()
  .debug();

Spig
  .on('/**/*.{png,jpg}')
  .initdata()
  .debug();

