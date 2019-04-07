"use strict";

const SpigFiles = require('../spig-files');
const Mustache = require("mustache");
const Path = require('path');

module.exports = (file) => {
  let slug = file.attr.slug;

  if (!slug) {
    const bundle = file.attr.bundle;
    if (bundle) {
      // special case, bundles!
      if (file.basename !== 'index') {
        const indexFile = SpigFiles.lookup(file.dir + 'index');
        if (indexFile) {
          slug = indexFile.attr.slug;
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
