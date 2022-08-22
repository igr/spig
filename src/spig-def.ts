import { SpigConfig } from "./spig-config.js";

type FileRef = import('./file-reference.js').FileRef;

/**
 * SPIG folders.
 */
export class SpigDef {
  private _filesFilter: (fileRef: FileRef) => boolean;

  private _outDir: string;

  private _files: string[];

  private _inDir: string;

  get files(): string[] {
    return this._files;
  }

  get inDir(): string {
    return this._inDir;
  }

  get filesFilter(): (fileRef: FileRef) => boolean {
    return this._filesFilter;
  }

  get outDir(): string {
    return this._outDir;
  }

  constructor(config: SpigConfig) {
    this._files = ['/**/*'];
    this._inDir = config.dev.dir.site;
    this._outDir = '/';
    this._filesFilter = () => true;
  }

  on(pattern: string[]): SpigDef {
    this._files = pattern;
    return this;
  }

  from(srcDir: string): SpigDef {
    this._inDir = srcDir;
    return this;
  }

  to(destDir: string): SpigDef {
    this._outDir = destDir;
    return this;
  }

  filter(value: (fileRef: FileRef) => boolean): SpigDef {
    this._filesFilter = value;
    return this;
  }
}
