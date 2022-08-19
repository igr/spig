import { minify } from 'html-minifier';
import { spigConfig } from '../ctx';
import { SpigOperation } from '../spig-operation';

import { FileRef } from '../file-reference';

/**
 * Minifies HTML.
 */
function processFile(fileRef: FileRef, options = {}): void {
  const defaults = spigConfig.ops.htmlMinify;

  fileRef.string = minify(fileRef.string, { ...defaults, ...options });
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('minify html', processFile);
};
