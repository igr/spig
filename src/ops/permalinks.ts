import Path from 'path';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

/**
 * Changes the path of the file to be always in a folder and named as `index.xxx`.
 * For example, file "/foo/index.xxx" remain unchanged. But file "/foo/bar.xxx" will
 * be renamed to "/foo/bar/index.xxx".
 * Should be applied only to pages.
 */
function processFile(fileRef: FileRef): void {
  const filePath = fileRef.out;

  const extension = Path.extname(filePath);
  const baseName = Path.basename(filePath, extension);

  if (baseName !== 'index') {
    const ndx = filePath.lastIndexOf(baseName);

    fileRef.out = filePath.substr(0, ndx) + baseName + '/index' + extension;
  }
}

export function operation(): SpigOperation {
  return new (class extends SpigOperation {
    constructor() {
      super('permalinks');
      super.onFile = processFile;
    }
  })();
}
