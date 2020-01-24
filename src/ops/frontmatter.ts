import matter from 'gray-matter';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

/**
 * Exports front matter to attributes.
 */
function processFile(fileRef: FileRef, attributes = {}): void {
  const fm = matter(fileRef.string);

  fileRef.string = fm.content.trim();

  attributes = { ...fm.data, ...attributes };

  fileRef.setAttrsFrom(attributes);
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('frontmatter', processFile);
};
