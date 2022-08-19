import * as log from '../log';
import { FileRef } from '../file-reference';
import { spigEngines } from '../ctx';

export function templateNunjucks(fileRef: FileRef, layout: string): void {
  let string = fileRef.string;

  string = `{% extends '${layout}' %}` + string;

  try {
    fileRef.string = spigEngines.nunjucksEngine.render(string, fileRef.context());
  } catch (err) {
    log.error(`Nunjucks template failed for ${fileRef.path}`);
    throw err;
  }
}
