"use strict";

const Path = require("path");
const SpigConfig = require('./spig-config');

function permalink(link) {
  if (link.endsWith('index.html')) {
    return link.substr(0, link.length - 10);
  }
  return link;
}

class SpigFiles {

  constructor() {
    this.files = [];
    this.map = {};
    this.defaultFileKeys = ['src', 'name', 'basename', 'path', 'out', 'dir', 'contents', 'attr', 'spig', 'id'];
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

    const fileObject = this.createMeta(absolutePath, path);

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
  createMeta(absolutePath, path) {
    let dirName = Path.dirname(path);
    dirName = (dirName === '/' ? dirName : dirName + '/');

    const id = dirName + Path.basename(path, Path.extname(path));

    const meta = {
      src: absolutePath,
      basename: Path.basename(path, Path.extname(path)),
      dir: dirName,
      name: Path.basename(path),
      id: id,
      path: path,

      out: path,
      contents: undefined,
      attr: {}
    };

    this.map[id] = meta;

    return meta;
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

      if (file.id === '/index') {
        file.attr.home = true;
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
    const purl = permalink(file.out);
    const fo = {
      content: file.contents,
      plain: file.plain,
      site: site,
      url: purl,
      link: site.baseURL + purl,
      src: file.dir + file.name,
    };

    const attrName = SpigConfig.devConfig.templates.attrName;
    if (attrName) {
      fo[attrName] = file.attr;
      return fo;
    }

    return {...file.attr, ...fo};
  }

  /**
   * Lookups the file object by its ID.
   */
  lookup(id) {
    return this.map[id];
  }

  /**
   * Returns file content as String and replaces the buffer.
   */
  stringContents(file) {
    if (typeof file.contents === 'string') {
      return file.contents;
    }
    return file.contents.toString();
  }
}

module.exports = new SpigFiles();
