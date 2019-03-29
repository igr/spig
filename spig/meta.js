"use strict";

const SpigConfig = require('./spig-config');

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
    const site = SpigConfig.site();
    return {
      content: file.contents,
      site: site,
      collections: site.collections,
      page: file.attr,
      url: file.out
    };
  }

}

module.exports = new Meta();
