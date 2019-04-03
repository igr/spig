"use strict";

const Path = require("path");
const SpigConfig = require('./spig-config');

class SpigFiles {

  constructor() {
    this.files = [];
    this.defaultFileKeys = ['src', 'name', 'basename', 'path', 'out', 'dir', 'contents', 'attr', 'spig'];
  }

  /**
   * Creates a file object and registers it.
   */
  createFileObject(fileName, virtual = false) {
    const site = SpigConfig.siteConfig;

    let absolutePath = Path.resolve(fileName);

    let path;

    if (virtual) {
      // virtual files do not have the absolute path
      absolutePath = undefined;
      path = fileName;
    } else {
      // real files
      path = '/' + Path.relative(site.root + site.srcDir + site.dirSite, absolutePath);
    }

    let dirName = Path.dirname(path);
    dirName = (dirName === '/' ? dirName : dirName + '/');

    const fileObject = this.createMeta(absolutePath, dirName, path);

    this.files.push(fileObject);

    return fileObject;
  }

  // ATTRIBUTES

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
   * Updates file attributes.
   */
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

  // META

  /**
   * Creates basic set of meta data for the file.
   */
  createMeta(absolutePath, dirName, path) {
    return {
      src: absolutePath,
      basename: Path.basename(path, Path.extname(path)),
      name: dirName + Path.basename(path, Path.extname(path)),
      path: path,
      out: path,
      dir: dirName,
      contents: undefined,
      attr: {}
    };
  }

  /**
   * Resets all metadata for the file.
   */
  resetMeta(file) {
    if (file.src) {
      file.contents = undefined;
    }

    file.attr = {};

    for (const key in file) {
      if (!file.hasOwnProperty(key)) {
        continue;
      }
      if (!this.defaultFileKeys.includes(key)) {
        delete file[key];
      }
    }

  }

  /**
   * Updates file meta data.
   * Use with care as important system values may be overwritten.
   */
  updateMeta(file, data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        file[key] = data[key];
      }
    }
  }

  // CONTEXT

  /**
   * Builds a context for templates.
   */
  contextOf(file) {
    const site = SpigConfig.siteConfig;
    return {
      content: file.contents,
      site: site,
      collections: site.collections,
      page: file.attr,
      url: file.out
    };
  }


}

module.exports = new SpigFiles();
