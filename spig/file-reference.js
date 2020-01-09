"use strict";

const Path = require('path');
const fs = require('fs');
const initAttributes = require('./init-attributes');

/**
 * File reference.
 */
class FileRef {

  /**
   * Calculates the ID.
   */
  static idOf(srcDir, path) {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return srcDir + path;
  }

  /**
   * @param srcDir source directory.
   * @param path: relative dir + file name from the source root.
   * @param absolutePath absolute path to the file, optional. If not set, file will be synthetic.
   */
  constructor(srcDir, path, absolutePath) {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    let dirName = Path.dirname(path);
    dirName = (dirName === '/' ? dirName : dirName + '/');

    // indicates if file reference is active and therefore
    // consumed by spig. by setting it to false, it becomes
    // inactive, like it does not exist.
    this.active = true;

    // indicates if file is created from a real file or given context
    this.syntethic = false;

    // Example
    // -------
    // srcDir = ./site/
    // outDir = ./
    // path = foo/bar.ext

    // /site
    this.root = srcDir;

    // /foo/bar.ext
    this.id = srcDir + path;

    // /User/.../foo/bar.ext
    this.src = absolutePath;

    // /foo
    this.dir = dirName;

    // bar.ext
    this.name = Path.basename(path);

    // ext
    this.ext = Path.extname(path);

    // bar
    this.basename = Path.basename(path, this.ext);

    // /foo/bar.ext
    this.path = path;

    // /foo/bar.ext
    this.out = path;

    // attributes
    this.attr = {};

    // buffers
    this._buffer = undefined;
    this._string = undefined;

    // Spig, will be set later
    this.spig = undefined;

    initAttributes(this);
  }

  /**
   * Sets the OUT extension.
   */
  outExt(ext) {
    this.out = Path.join(Path.dirname(this.out), Path.basename(this.out, Path.extname(this.out)) + '.' + ext);
  }

  /**
   * Sets or loads file's buffer.
   */
  buffer(content) {
    if (content) {
      this._buffer = content;
      this._string = undefined;
      return;
    }

    if (!this._buffer) {
      this._buffer = fs.readFileSync(this.src);
    }
    return this._buffer;
  }

  /**
   * Sets or loads files buffer as a string.
   */
  string(content) {
    if (content) {
      this._string = content;
      this._buffer = Buffer.from(content);
      return;
    }
    if (!this._string) {
      const b = this.buffer();
      this._string = typeof b === 'string' ? b : b.toString();
    }
    return this._string;
  }

}

module.exports = FileRef;
