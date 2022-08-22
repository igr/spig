import Path from 'path';
import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';
import { templateNunjucks } from './template-nunjucks.js';
import { resolveLayout } from '../layout-resolver.js';

function processFile(fileRef: FileRef): void {
  const layout = resolveLayout(fileRef);

  const ext = Path.extname(layout);
  switch (ext) {
    case '.njk':
      templateNunjucks(fileRef, layout);
      break;
    default:
      throw new Error(`Unknown template engine! File: '${fileRef.name}' Layout: '${layout}' Extension: '${ext}'`);
  }
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('template', processFile);
};
