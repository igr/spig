"use strict";

const Path     = require('path');

class Meta {

  /**
   * Creates meta data from a file.
   */
  create(file) {
    const filePath = file.relative;
    let dirName = Path.dirname(filePath);
    dirName = (dirName === '.' ? '/' : '/' + dirName + '/' );

    return {
      name: dirName + Path.basename(filePath, Path.extname(filePath)),
      src: '/' + filePath,
      dir: dirName,
      out: '/' + filePath
    };
  };

  attrOrMeta(file, name) {
    if (file.meta.attr) {
      const value = file.meta.attr[name];
      if (value) {
        return value;
      }
    }
    return file.meta[name];
  }


  update(file, data) {
    if (!file.meta) {
      file.meta = data;
      return;
    }
    for (const key in data) {
      file.meta[key] = data[key];
    }
  }
}

module.exports = new Meta();
