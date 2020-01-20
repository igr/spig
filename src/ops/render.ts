import * as SpigConfig from '../spig-config';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { renderNunjucks } from './render-nunjucks';
import { renderMarkdown } from './render-markdown';

function processFile(fileRef: FileRef): void {
  const renderCfg = SpigConfig.ops.render;

  // match extension

  let matchedExtension = false;

  for (const ex of renderCfg.extensions) {
    if (fileRef.ext === ex) {
      matchedExtension = true;
      break;
    }
  }

  if (!matchedExtension) {
    return;
  }

  // render

  const ext = fileRef.ext;
  switch (ext) {
    case '.njk':
      renderNunjucks(fileRef);
      break;
    case '.md':
      renderMarkdown(fileRef);
      break;
    default:
      throw new Error(`No render engine for ${ext}.`);
  }
}

export function operation(): SpigOperation {
  return new (class extends SpigOperation {
    constructor() {
      super('render');
      super.onFile = processFile;
    }
  })();
}
