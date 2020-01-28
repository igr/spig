import * as SpigConfig from '../spig-config';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { renderNunjucks } from './render-nunjucks';
import { renderMarkdown } from './render-markdown';
import { renderPug } from './render-pug';

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
    case '.pug':
      renderPug(fileRef);
      break;
    default:
      throw new Error(`No render engine for ${ext}.`);
  }
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('render', processFile);
};
