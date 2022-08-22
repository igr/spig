import * as log from '../log.js';
import { FileRef } from '../file-reference.js';
import { ctx } from '../ctx.js';

export function renderNunjucks(fileRef: FileRef): void {
  let content = fileRef.string;

  try {
    content = ctx.engines.nunjucksEngine.render(content, fileRef.context());
    fileRef.string = content;
  } catch (err) {
    log.error(`Nunjucks render failed for ${fileRef.path}`);
    throw err;
  }
}
