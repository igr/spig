import { minify } from 'html-minifier';
import { ctx } from '../ctx.js';
import { SpigOperation } from '../spig-operation.js';

import { FileRef } from '../file-reference.js';

/**
 * Minifies HTML.
 */
function processFile(fileRef: FileRef, options = {}): void {
  const defaults = ctx.config.ops.htmlMinify;

  fileRef.string = minify(fileRef.string, { ...defaults, ...options });
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('minify html', processFile);
};
