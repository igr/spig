"use strict";

const fs = require("fs");
const Path = require("path");
const SpigConfig = require('./spig-config');

class SpigFiles {

  constructor() {
    this.files = {};
    this.pages = [];
  }

  /**
   * Returns file for given file name, the same one used for registration.
   */
  findFile(fileName) {
    return this.files[fileName];
  }

  createFileObject(fileName) {
    const site = SpigConfig.site();

    const absolutePath = Path.resolve(fileName);
    const path = '/' + Path.relative(site.root + site.srcDir + site.dirSite, absolutePath);

    let dirName = Path.dirname(path);
    dirName = (dirName === '/' ? dirName : dirName + '/');

    const content = fs.readFileSync(absolutePath);

    const fileObject = {
      src: absolutePath,
      name: dirName + Path.basename(path, Path.extname(path)),
      path: path,
      out: path,
      dir: dirName,
      contents: content
    };

    this.files[fileName] = fileObject;

    return fileObject;
  }

  /**
   * Iterate all files.
   */
  forEach(fn) {
    for (const fileName in this.files) {
      if (this.files.hasOwnProperty(fileName)) {
        fn(this.files[fileName]);
      }
    }
  }


  /**
   * Registers file as a page.
   */
  registerSitePage(file) {
    this.pages.push(file);
    return this;
  }

}

module.exports = new SpigFiles();
