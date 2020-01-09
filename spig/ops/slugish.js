"use strict";

const SpigOperation = require('../spig-operation');
const _s = require('underscore.string');
const SpigFiles = require('../spig-files');
const Mustache = require("mustache");
const Path = require('path');

function renderSlug(slug, fileRef) {
  return Mustache.render(slug, fileRef.context(), {}, ['{', '}']);
}

function resolvePathToFileIncludingSubSlugs(fileRef) {
  let dirName = Path.dirname(fileRef.out);

  let dirs = dirName.split('/').slice(1);
  let out = '/';
  let originalOutPath = '/';

  for (let dir of dirs) {
    let slug = dir;
    originalOutPath = originalOutPath + dir + '/';

    // if there is `index` file in current folder, it can change folder name
    // todo lookup for all input extensions, not only MD!
    const indexFileRef = SpigFiles.lookup(originalOutPath + 'index.md');
    if (indexFileRef) {
      if (indexFileRef.attr.slug) {
        slug = indexFileRef.attr.slug;
        slug = renderSlug(slug, indexFileRef);
      }
    }

    if (slug.startsWith('/')) {
      out = slug;
    } else {
      out = out + slug;
    }

    if (!_s.endsWith(out, '/')) {
      out = out + '/';
    }
  }

  return out;
}

function processFile(fileRef) {
  let out = resolvePathToFileIncludingSubSlugs(fileRef);

  let slug = fileRef.attr.slug;

  if (!slug) {
    // slug not defined on a file, return modified output path
    fileRef.out = out + Path.basename(fileRef.out);
    return;
  }

  slug = renderSlug(slug, fileRef);
  out = Path.dirname(out) + '/';

  if (slug.startsWith('/')) {
    fileRef.out = slug + '/' + Path.basename(fileRef.out);
    return;
  }

  fileRef.out = out + slug + '/' + Path.basename(fileRef.out);
}

module.exports.operation = () => {
  return SpigOperation
    .named('slugish')
    .onFile(fileRef => processFile(fileRef));
};
