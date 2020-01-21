import Path from 'path';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { templateNunjucks } from './template-nunjucks';
import { resolveLayout } from '../layout-resolver';

function processFile(fileRef: FileRef): void {
  const layout = resolveLayout(fileRef);

  const ext = Path.extname(layout);
  switch (ext) {
    case '.njk':
      templateNunjucks(fileRef, layout);
      break;
    default:
      throw new Error(`Unknown template engine for ${ext}`);
  }
}

export function operation(): SpigOperation {
  return SpigOperation.of('template', processFile);
}
