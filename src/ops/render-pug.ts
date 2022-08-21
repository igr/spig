import * as log from '../log';
import { FileRef } from '../file-reference';
import { ctx } from '../ctx';

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
