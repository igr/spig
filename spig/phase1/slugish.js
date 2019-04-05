"use strict";

const SpigFiles = require('../spig-files');
const Mustache = require("mustache");
const Path = require('path');

module.exports = (file) => {
  let slug = SpigFiles.attr(file, 'slug');

  if (!slug) {
    const bundle = SpigFiles.attr(file, 'bundle');
    if (bundle) {
      // special case, bundles!
      if (file.basename !== 'index') {
        const indexFile = SpigFiles.lookup(file.dir + 'index');
        if (indexFile) {
          slug = SpigFiles.attr(indexFile, 'slug');
        }
      }
    }
    if (!slug) {
      return;
    }
  }

  slug = Mustache.render(slug, SpigFiles.contextOf(file), {}, ['{', '}']);

  if (slug.startsWith('/')) {
    file.out = slug + '/' + Path.basename(file.out);
  }
  else {
    let dir = Path.dirname(Path.dirname(file.out));
    file.out = dir + '/' + slug + '/' + Path.basename(file.out);
  }

};
