import Path from 'path';
import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';

export interface PathElements {
  dirname: string;
  basename: string;
  extname: string;
}

function parsePath(path: string): PathElements {
  const extname = Path.extname(path);

  return {
    dirname: Path.dirname(path),
    basename: Path.basename(path, extname),
    extname,
  };
}

/**
 * Renames file.
 */
function processFile(fileRef: FileRef, renameFn: (parsedPath: PathElements) => void): void {
  const parsedPath = parsePath(fileRef.out);

  renameFn(parsedPath);

  fileRef.out = Path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);
}

export const operation: (renameFn: (parsedPath: PathElements) => void) => SpigOperation = (
  renameFn: (parsedPath: PathElements) => void
) => {
  return SpigOperation.of('rename', (fileRef) => processFile(fileRef, renameFn));
};
