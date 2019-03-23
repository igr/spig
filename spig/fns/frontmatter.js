"use strict";

/*
 * Reads frontmatter into `file.data`
 * Strips frontmatter from the file
 */

const matter = require('front-matter');

module.exports = (file, attributes = {}) => {
  const data = matter(file.contents.toString());
  file.contents = Buffer.from(data.body);
  const existingData = file.data || {};
  file.data = {...existingData, ...data.attributes, ...attributes};
};
