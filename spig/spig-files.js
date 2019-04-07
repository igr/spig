"use strict";

const Path = require("path");
const SpigConfig = require('./spig-config');
const initAttributes = require('./init-attributes');

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
  }

  reset() {
    this.files = [];
    this.map = {};
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

    initAttributes(fileObject);

    this.files.push(fileObject);

    return fileObject;
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

    if (id === '/index') {
      meta.attr.home = true;
    }

    this.map[id] = meta;

    return meta;
  }

  /**
   * Lookups the file object by its ID.
   */
  lookup(id) {
    return this.map[id];
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

    return {...file.attr, ...fo};
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
