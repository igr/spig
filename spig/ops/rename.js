"use strict";

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
module.exports = (file, renameFn) => {
  const parsedPath = parsePath(file.out);

  renameFn(parsedPath);

  file.out = Path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);
};
