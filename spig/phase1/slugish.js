"use strict";

const _s = require('underscore.string');
const SpigFiles = require('../spig-files');
const Mustache = require("mustache");
const Path = require('path');

function renderSlug(slug, file) {
  return Mustache.render(slug, SpigFiles.contextOf(file), {}, ['{', '}']);
}

function resolvePathToFileIncludingSubSlugs(file) {
  let dirName = Path.dirname(file.out);

  let dirs = dirName.split('/').slice(1);
  let out = "/";
  let originalOutPath = "/";

  for (let dir of dirs) {
    let slug = dir;
    originalOutPath = originalOutPath + dir + '/';

    // if there is `index` file in current folder, it can change folder name
    const indexFile = SpigFiles.lookup(originalOutPath + 'index');
    if (indexFile) {
      if (indexFile.attr.slug) {
        slug = indexFile.attr.slug;
        slug = renderSlug(slug, indexFile);
      }
    }

    if (slug.startsWith('/')) {
      out = slug;
    }
    else {
      out = out + slug;
    }

    if (!_s.endsWith(out, '/')) {
      out = out + '/';
    }
  }

  return out;
}


module.exports = (file) => {
  let out = resolvePathToFileIncludingSubSlugs(file);

  let slug = file.attr.slug;

  if (!slug) {
    // slug not defined on a file, return modified output path
    file.out = out + Path.basename(file.out);
    return;
  }

  slug = renderSlug(slug, file);
  out = Path.dirname(out) + '/';

  if (slug.startsWith('/')) {
    file.out = slug + '/' + Path.basename(file.out);
    return;
  }

  file.out = out + slug + '/' + Path.basename(file.out);
};
