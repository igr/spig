import Path from 'path';
import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';
import { isLangEnabled, lookupLangBySuffix } from '../spig-lang';

function processFile(fileRef: FileRef): void {
  if (!isLangEnabled()) {
    return;
  }

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
  } else {
    // there is no default language setup.
    // user must explicitly specify that.
    // fileRef.setAttr('lang', defaultLang());
  }
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('lang', processFile);
};
