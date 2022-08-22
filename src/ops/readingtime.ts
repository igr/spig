import readingTime from 'reading-time';
import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';

/**
 * Reading time.
 */
function processFile(fileRef: FileRef): void {
  const result = readingTime(fileRef.string);

  const time = result.minutes;
  if (time < 1) {
    result.minutes = 1;
  } else {
    result.minutes = Math.round(time * 10) / 10;
  }

  result.text = '';

  fileRef.setAttr('readingTime', result);
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('reading time', processFile);
};
