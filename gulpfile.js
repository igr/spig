"use strict";

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
  .on('/**/*.njk')
  .initdata()
  .frontmatter()
  .nunjucks()
  .folderize()
  .debug();
