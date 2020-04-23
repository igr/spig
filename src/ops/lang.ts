import Path from 'path';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { lookupLangBySuffix } from '../spig-lang';

function processFile(fileRef: FileRef): void {
  const path = fileRef.out;

  const extname = Path.extname(path);
  let basename = Path.basename(path, extname);

  const lang = lookupLangBySuffix(basename);
  if (lang) {
    basename = basename.slice(0, basename.length - (lang.key.length + 1));
    let dirname = Path.dirname(path);
    dirname = lang.prefix + dirname;
    fileRef.setAttr('lang', lang);
    fileRef.out = Path.join(dirname, basename + extname);
  }
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('lang', processFile);
};
