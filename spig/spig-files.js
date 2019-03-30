"use strict";

const fs = require("fs");
const Path = require("path");
const SpigConfig = require('./spig-config');

class SpigFiles {

  constructor() {
    this.files = [];
  }

  /**
   * Creates file object.
   */
  createFileObject(fileName, options = {virtual: false}) {
    const site = SpigConfig.siteConfig;

    const absolutePath = Path.resolve(fileName);

    let path = fileName;
    let content = Buffer.alloc(0);

    if (fs.existsSync(absolutePath)) {
      path = '/' + Path.relative(site.root + site.srcDir + site.dirSite, absolutePath);
      content = fs.readFileSync(absolutePath);
    } else {
      if (!options.virtual) {
        throw new Error("File not found: " + fileName);
      }
    }

    let dirName = Path.dirname(path);
    dirName = (dirName === '/' ? dirName : dirName + '/');

    const fileObject = {
      src: absolutePath,
      name: dirName + Path.basename(path, Path.extname(path)),
      path: path,
      out: path,
      dir: dirName,
      contents: content,
      attr: {}
    };

    this.files.push(fileObject);

    return fileObject;
  }
  
}

module.exports = new SpigFiles();
