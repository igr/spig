"use strict";

const matter = require('gray-matter');
const SpigFiles = require('../spig-files');

/**
 * Exports front matter to attributes.
 */
module.exports = (file, attributes = {}) => {
  const fm = matter(SpigFiles.stringContents(file));

  file.contents = fm.content.trim();
  file.plain = file.contents;

  file.attr = {...file.attr, ...fm.data, ...attributes};
};
