"use strict";

const matter = require('gray-matter');
const SpigFiles = require('../spig-files');

/**
 * Exports front matter to attributes.
 */
module.exports = (file, attributes = {}) => {
  const fm = matter(file.contents.toString());

  file.contents = Buffer.from(fm.content);

  SpigFiles.updateAttr(file, {...fm.data, ...attributes})
};
