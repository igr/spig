import * as log from '../log.js';
import { FileRef } from '../file-reference.js';
import { ctx } from '../ctx.js';

export function renderPug(fileRef: FileRef): void {
  let content = fileRef.string;

  try {
    content = ctx.engines.pugEngine.render(content, fileRef.context());

    fileRef.string = content;
  } catch (err) {
    log.error(`Pug render failed for ${fileRef.path}`);
    throw err;
  }
}
