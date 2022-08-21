import * as log from '../log';
import { FileRef } from '../file-reference';
import { ctx } from '../ctx';

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
