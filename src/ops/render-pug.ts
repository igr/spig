import * as log from '../log';
import { FileRef } from '../file-reference';
import { PugEngine } from '../engines/pug-engine';

export function renderPug(fileRef: FileRef): void {
  let content = fileRef.string;

  try {
    content = PugEngine.render(content, fileRef.context());

    fileRef.string = content;
  } catch (err) {
    log.error(`Pug render failed for ${fileRef.path}`);
    throw err;
  }
}
