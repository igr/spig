"use strict";

const Meta = require('../meta');
const Mustache = require("mustache");
const Path = require('path');

module.exports = (file) => {
  let slug = Meta.attr(file, 'slug');

  if (!slug) {
    return;
  }

  slug = Mustache.render(slug, Meta.context(file), {}, ['{', '}']);

  file.out = '/' + slug + '/' + Path.basename(file.out);
};
