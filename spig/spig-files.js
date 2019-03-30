"use strict";

const Path = require("path");
const SpigConfig = require('./spig-config');

class SpigFiles {

  constructor() {
    this.files = [];
  }

  /**
   * Creates file object.
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

    const fileObject = {
      src: absolutePath,
      name: dirName + Path.basename(path, Path.extname(path)),
      path: path,
      out: path,
      dir: dirName,
      contents: undefined,
      attr: {}
    };

    this.files.push(fileObject);

    return fileObject;
  }
  
}

module.exports = new SpigFiles();
