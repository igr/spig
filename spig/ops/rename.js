"use strict";

const SpigOperation = require('../spig-operation');
const Path = require('path');

function parsePath(path) {
  const extname = Path.extname(path);
  return {
    dirname: Path.dirname(path),
    basename: Path.basename(path, extname),
    extname: extname
  };
}

/**
 * Renames file.
 */
function processFile(fileRef, renameFn) {
  const parsedPath = parsePath(fileRef.out);

  renameFn(parsedPath);

  fileRef.out = Path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);
}

module.exports.operation = (renameFn) => {
  return SpigOperation
    .named('rename')
    .onFile((fileRef) => processFile(fileRef, renameFn));
};

