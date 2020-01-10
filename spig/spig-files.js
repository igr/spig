"use strict";

const ctx = require('./ctx');
const SpigConfig = require('./spig-config');
const FileRef = require('./file-reference');
const Path = require('path');
const glob = require('glob');
const {UUID} = require('./uuid');

/**
 * Set of files, associated to one Spig instance.
 */
class SpigFiles {

  /**
   * Creates set of files.
   */
  constructor(spig) {
    this.spig = spig;
    const spigDef = spig.def;
    this.root = spigDef.srcDir;

    // fix input args
    let files = spigDef.files;
    if (!Array.isArray(files)) {
      files = [files];
    }

    this.files = [];

    files.forEach(p => {
      const dir = SpigConfig.dev.srcDir + this.root;
      const pattern = SpigConfig.dev.srcDir + this.root + p;
      const matchedFiles = glob.sync(pattern, {nodir: true});

      matchedFiles.forEach(f => {
        const file = f.substr(dir.length);
        const fileRef = fileRefOf(this.spig, this.root, file, Path.resolve(f));
        if (spigDef.filesFilter) {
          if (!spigDef.filesFilter(fileRef)) return;
        }
        this.files.push(fileRef);
      });

    });
  }

  /**
   * Adds a file to the Spig.
   */
  addFile(file, content) {
    let absolutePath;

    if (!content) {
      absolutePath = Path.resolve(SpigConfig.dev.srcDir + this.root + file);
    }

    const fileRef = fileRefOf(this.spig, this.root, file, absolutePath);

    if (content) {
      fileRef.buffer(content);
      fileRef.syntethic = true;
    }

    this.files.push(fileRef);

    return fileRef;
  }

  /**
   * Removes existing file reference.
   */
  removeFile(fileRef) {
    const ndx = this.files.indexOf(fileRef);
    if (ndx === -1) {
      return;
    }

    this.files.splice(ndx, 1);
    fileRef.active = false;
    delete ctx.FILES[fileRef.id];
  }

  removeAllFiles() {
    const ids = [];
    this.files.forEach(f => ids.push(f.id));
    ids.forEach(id => delete ctx.FILES[id]);
    this.files = [];
  }

  /**
   * Lookups the file reference by its ID.
   * todo ID is changed, need to check extensions
   */
  static lookup(id) {
    return ctx.FILES[id];
  }

}

module.exports = SpigFiles;

/**
 * Fetches file reference or create new one if one does not exists.
 */
function fileRefOf(spig, dir, path, absolutePath) {
  const fileRefId = FileRef.idOf(dir, path);

  let existingFileRef = ctx.FILES[fileRefId];

  if (existingFileRef) {
    return existingFileRef;
  }

  const fileRef = new FileRef(dir, path, absolutePath);

  fileRef.spig = spig;
  fileRef.uuid = UUID.generate();

  ctx.FILES[fileRef.id] = fileRef;

  return fileRef;
}
