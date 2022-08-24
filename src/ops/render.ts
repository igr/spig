import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';
import { renderNunjucks } from './render-nunjucks.js';
import { renderMarkdown } from './render-markdown.js';
import { renderPug } from './render-pug.js';

function processFile(fileRef: FileRef): void {
  const renderCfg = fileRef.cfg.ops.render;

  // match extension

  let matchedExtension = false;

  if (renderCfg.extensions !== null) {
    for (const ex of renderCfg.extensions) {
      if (fileRef.ext === ex) {
        matchedExtension = true;
        break;
      }
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
      throw new Error(`No render engine for '${ext}'.`);
  }
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('render', processFile);
};
