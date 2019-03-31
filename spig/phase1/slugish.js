"use strict";

const SpigFiles = require('../spig-files');
const Mustache = require("mustache");
const Path = require('path');

module.exports = (file) => {
  let slug = SpigFiles.attr(file, 'slug');

  if (!slug) {
    return;
  }

  slug = Mustache.render(slug, SpigFiles.contextOf(file), {}, ['{', '}']);

  file.out = '/' + slug + '/' + Path.basename(file.out);
};
