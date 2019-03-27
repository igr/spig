"use strict";

const matter = require('gray-matter');
const Meta = require('../meta');

/**
 * Exports front matter to attributes.
 */
module.exports = (file, attributes = {}) => {
  const fm = matter(file.contents.toString());

  file.contents = Buffer.from(fm.content);

  Meta.updateAttr(file, {...fm.data, ...attributes})
};
