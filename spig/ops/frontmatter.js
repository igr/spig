"use strict";

const SpigOperation = require('../spig-operation');
const matter = require('gray-matter');

/**
 * Exports front matter to attributes.
 */
function processFile(fileRef, attributes = {}) {
  const fm = matter(fileRef.string());

  fileRef.contents = fm.content.trim();
  fileRef.plain = fileRef.contents;

  fileRef.attr = {...fileRef.attr, ...fm.data, ...attributes};
}

module.exports.operation = () => {
  return SpigOperation
    .named('frontmatter')
    .onFile(fileRef => processFile(fileRef));
};
