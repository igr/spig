import { minify } from 'html-minifier';
import { SpigOperation } from '../spig-operation.js';

import { FileRef } from '../file-reference.js';

/**
 * Minifies HTML.
 */
function processFile(fileRef: FileRef, options = {}): void {
  const defaults = fileRef.cfg.ops.htmlMinify;

  fileRef.string = minify(fileRef.string, { ...defaults, ...options });
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('minify html', processFile);
};
