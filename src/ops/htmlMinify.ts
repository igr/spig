import * as SpigConfig from '../spig-config';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

const minify = require('html-minifier').minify;

/**
 * Minifies HTML.
 */
function processFile(fileRef: FileRef, options = {}): void {
  const defaults = SpigConfig.ops.htmlMinify;

  fileRef.string = minify(fileRef.string, { ...defaults, ...options });
}

export function operation(): SpigOperation {
  return new (class extends SpigOperation {
    constructor() {
      super('minify html');
      super.onFile = processFile;
    }
  })();
}
