import * as SpigConfig from './spig-config';

type FileRef = import('./file-reference').FileRef;

/**
 * SPIG folders.
 */
export class SpigDef {
  private _filesFilter: (fileRef: FileRef) => boolean;

  private _destDir: string;

  private _files: string[];

  private _srcDir: string;

  get files(): string[] {
    return this._files;
  }

  get srcDir(): string {
    return this._srcDir;
  }

  get filesFilter(): (fileRef: FileRef) => boolean {
    return this._filesFilter;
  }

  get destDir(): string {
    return this._destDir;
  }

  constructor() {
    this._files = ['/**/*'];
    this._srcDir = SpigConfig.dev.dir.site;
    this._destDir = '/';
    this._filesFilter = () => true;
  }

  on(pattern: string[]): SpigDef {
    this._files = pattern;
    return this;
  }

  from(srcDir: string): SpigDef {
    this._srcDir = srcDir;
    return this;
  }

  to(destDir: string): SpigDef {
    this._destDir = destDir;
    return this;
  }

  filter(value: (fileRef: FileRef) => boolean): SpigDef {
    this._filesFilter = value;
    return this;
  }
}
