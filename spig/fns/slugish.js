"use strict";

const Meta = require('../meta');
const Mustache = require("mustache");
const Path = require('path');

module.exports = (file) => {
  let slug = Meta.attrOrMeta(file, 'slug');

  if (!slug) {
    return;
  }

  slug = Mustache.render(slug, Meta.context(file), {}, ['{', '}']);

  Meta.out(file, '/' + slug + '/' + Path.basename(Meta.out(file)));
};
