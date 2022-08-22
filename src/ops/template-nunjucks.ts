import * as log from '../log.js';
import { FileRef } from '../file-reference.js';
import { ctx } from '../ctx.js';

export function templateNunjucks(fileRef: FileRef, layout: string): void {
  let string = fileRef.string;

  string = `{% extends '${layout}' %}` + string;

  try {
    fileRef.string = ctx.engines.nunjucksEngine.render(string, fileRef.context());
  } catch (err) {
    log.error(`Nunjucks template failed for ${fileRef.path}`);
    throw err;
  }
}
