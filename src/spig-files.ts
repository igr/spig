import Path from 'path';
import glob from 'glob';
import * as ctx from './ctx';
import * as SpigConfig from './spig-config';
import { FileRef } from './file-reference';

type Spig = import('./spig').Spig;

/**
 * Fetches file reference or create new one if one does not exists.
 */
function fileRefOf(spig: Spig, dir: string, path: string, absolutePath?: string): FileRef {
  const fileRefId = FileRef.idOf(dir, path);

  const existingFileRef = ctx.FILES[fileRefId];

  if (existingFileRef) {
    return existingFileRef;
  }

  const fileRef = new FileRef(spig, dir, path, absolutePath);

  ctx.FILES[fileRef.id] = fileRef;

  return fileRef;
}

/**
 * Set of files, associated to one Spig instance.
 */
export class SpigFiles {
  private readonly spig: Spig;

  private readonly root: string;

  private _files: FileRef[];

  get files(): FileRef[] {
    return this._files;
  }

  /**
   * Creates set of files.
   */
  constructor(spig: Spig) {
    this.spig = spig;
    const spigDef = spig.def;
    this.root = spigDef.inDir;

    // fix input args
    const files = spigDef.files;

    this._files = [];

    files.forEach((p) => {
      const dir = SpigConfig.dev.srcDir + this.root;
      const pattern = SpigConfig.dev.srcDir + this.root + p;
      const matchedFiles = glob.sync(pattern, { nodir: true });

      matchedFiles.forEach((f) => {
        const file = f.substr(dir.length);
        const fileRef = fileRefOf(this.spig, this.root, file, Path.resolve(f));

        if (spigDef.filesFilter) {
          if (!spigDef.filesFilter(fileRef)) return;
        }
        this._files.push(fileRef);
      });
    });
  }

  /**
   * Adds a file to the Spig.
   */
  addFile(file: string, content: Buffer | string): FileRef {
    let absolutePath;

    if (!content) {
      absolutePath = Path.resolve(SpigConfig.dev.srcDir + this.root + file);
    }

    const fileRef = fileRefOf(this.spig, this.root, file, absolutePath);

    if (content) {
      if (content instanceof Buffer) {
        fileRef.buffer = content;
      } else {
        fileRef.string = content;
      }
      fileRef.synthetic = true;
    }

    this._files.push(fileRef);

    return fileRef;
  }

  /**
   * Removes existing file reference.
   */
  removeFile(fileRef: FileRef): void {
    const ndx = this._files.indexOf(fileRef);
    if (ndx === -1) {
      return;
    }

    this._files.splice(ndx, 1);
    fileRef.active = false;
    delete ctx.FILES[fileRef.id];
  }

  removeAllFiles(): void {
    this._files.forEach((f) => delete ctx.FILES[f.id]);
    this._files = [];
  }

  /**
   * Lookups the file reference by its ID.
   */
  static lookup(id: string): FileRef | undefined {
    return ctx.FILES[id];
  }

  static lookupSite(path: string): FileRef | undefined {
    return ctx.FILES[SpigConfig.dev.dir.site + path];
  }
}
