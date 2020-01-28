import * as log from '../log';
import { FileRef } from '../file-reference';
import { PugEngine } from '../engines/pug-engine';

export function renderPug(fileRef: FileRef): void {
  try {
    fileRef.string = PugEngine.render(fileRef.string);
  } catch (err) {
    log.error(`Pug render failed for ${fileRef.path}`);
    throw err;
  }
}
