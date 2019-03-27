"use strict";

const Path = require('path');
const SpigConfig = require('./spig-config');

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

  /**
   * Resolves file attribute or meta value.
   */
  attrOrMeta(file, name) {
    if (file.attr) {
      const value = file.attr[name];
      if (value) {
        return value;
      }
    }
    return file.meta[name];
  }


  updateMeta(file, data) {
    if (!file.meta) {
      file.meta = data;
      return;
    }
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        file.meta[key] = data[key];
      }
    }
  }

  updateAttr(file, data) {
    if (!file.attr) {
      file.attr = data;
      return;
    }
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        file.attr[key] = data[key];
      }
    }
  }

  /**
   * Builds a context for templates.
   */
  context(file) {
    return {
      content: file.contents,
      site: SpigConfig.site(),
      meta: file.meta,
      page: file.attr
    };
  }
}

module.exports = new Meta();
