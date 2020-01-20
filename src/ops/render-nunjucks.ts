import * as log from '../log';
import { FileRef } from '../file-reference';
import { NunjucksEngine } from '../engines/nunjucks-engine';

export function renderNunjucks(fileRef: FileRef): void {
  let content = fileRef.string;

  try {
    content = NunjucksEngine.render(content, fileRef.context());
    fileRef.string = content;
  } catch (err) {
    log.error(`Nunjucks render failed for ${fileRef.path}`);
    throw err;
  }
}
