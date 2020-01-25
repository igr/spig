import { minify } from 'html-minifier';
import * as SpigConfig from '../spig-config';
import { SpigOperation } from '../spig-operation';

import { FileRef } from '../file-reference';

/**
 * Minifies HTML.
 */
function processFile(fileRef: FileRef, options = {}): void {
  const defaults = SpigConfig.ops.htmlMinify;

  fileRef.string = minify(fileRef.string, { ...defaults, ...options });
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('minify html', processFile);
};
