import { LangDef, site } from './spig-config';
// eslint-disable-next-line import/no-cycle
import { FileRef } from './file-reference';

/**
 * Returns language definition from the basename.
 */
export function lookupLangBySuffix(baseName: string): LangDef | undefined {
  for (const [, l] of Object.entries(site.lang)) {
    if (baseName.endsWith('.' + l.key)) {
      return l;
    }
  }
  return undefined;
}

export function buildRootLangSrcName(fileRef: FileRef): string | undefined {
  if (fileRef.hasAttr('lang')) {
    const lang: LangDef = fileRef.attr('lang');
    return fileRef.src?.replace(`.${lang.key}.`, '.');
  }
  return undefined;
}
