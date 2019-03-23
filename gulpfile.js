"use strict";

const { DateTime } = require("luxon");
const Spig = require('./spig/spig');
require('require-dir')('./spig');


Spig
  .on('/**/*.md')
  .initdata()
  .frontmatter()
  .markdown()
  .folderize()
  .debug();

Spig
  .config()
  .nunjucks({
    filters: {
      dateDisplay: (dateObj, format = "LLL d, y") => {
        return DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat(format);
      }
    }
  });

Spig
  .on('/**/*.njk')
  .initdata()
  .frontmatter()
  .nunjucks()
  .folderize()
  .debug();
