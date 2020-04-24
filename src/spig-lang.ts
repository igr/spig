import * as Path from 'path';
import { LangDef, site } from './spig-config';
// eslint-disable-next-line import/no-cycle
import { FileRef } from './file-reference';

let defaultLangDef: LangDef | undefined;

export function initSiteLang(): void {
  if (site.lang.length === 0) {
    defaultLangDef = undefined;
    return;
  }
  defaultLangDef = site.lang[0];

  // set 'default' flag
  site.lang.forEach((ld) => {
    ld.default = false;
  });
  site.lang[0].default = true;
}

/**
 * Returns if lang is enabled.
 */
export function isLangEnabled(): boolean {
  return defaultLangDef !== undefined;
}

export function defaultLang(): LangDef {
  return defaultLangDef!!;
}

/**
 * Returns language definition from the basename suffix.
 * If suffix does not exist, returns undefined, indicating
 * default language (or no language set at all).
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

export function generateLangSrcNames(dir: string, name: string): { [k: string]: string } {
  if (!isLangEnabled()) {
    return {};
  }
  const value: { [k: string]: string } = {};
  site.lang.forEach((ld) => {
    const key = ld.key;

    const ext = Path.extname(name);
    const basename = Path.basename(name, ext);

    value['src_' + key] = dir + basename + '.' + ld.key + ext;
  });
  return value;
}
