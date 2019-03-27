"use strict";

const SpigConfig = require('./spig-config');
const SpigFiles = require('./spig-files');

class Meta {

  /**
   * Resolves file attribute or meta value.
   */
  attr(file, name) {
    if (file.attr) {
      const value = file.attr[name];
      if (value) {
        return value;
      }
    }
    return file[name];
  }

  /**
   * Updates file meta data.
   * Use with care as important system values may be removed.
   */
  update(file, data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        file[key] = data[key];
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
      page: file.attr,
      url: file.out,
      pages: SpigFiles.pages
    };
  }


}

module.exports = new Meta();
