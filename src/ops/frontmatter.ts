import matter from 'gray-matter';
import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';

/**
 * Exports front matter to attributes.
 */
function processFile(fileRef: FileRef, attributes = {}): void {
  const fm = matter(fileRef.string);

  fileRef.string = fm.content.trim();

  fileRef.addAttrsFrom(fm.data);
  fileRef.setAttrsFrom(attributes);
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('frontmatter', processFile);
};

export const testables = {
  processFile,
};
