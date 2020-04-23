import fs from 'fs';
import Path from 'path';
import * as UUID from './uuid';
import * as SpigConfig from './spig-config';

type Spig = import('./spig').Spig;

function permalink(link: string): string {
  if (link.endsWith('index.html')) {
    return link.substr(0, link.length - 10);
  }
  return link;
}

/**
 * File reference.
 */
export class FileRef {
  private _change = false;

  private _active: boolean;

  private _synthetic: boolean;

  private readonly _root: string;

  private readonly _id: string;

  private readonly _src?: string;

  private readonly _dir: string;

  private readonly _name: string;

  private readonly _ext: string;

  private _out: string;

  private readonly _basename: string;

  private readonly _path: string;

  private readonly _attr: { [k: string]: any } = {
    site: SpigConfig.site,
    link: '',
    url: '',
    src: this.dir + this.name,
  };

  private _buffer?: Buffer;

  private _string?: string;

  private readonly _spig: Spig;

  private readonly _uuid: string;

  get path(): string {
    return this._path;
  }

  get basename(): string {
    return this._basename;
  }

  get id(): string {
    return this._id;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get synthetic(): boolean {
    return this._synthetic;
  }

  set synthetic(value: boolean) {
    this._synthetic = value;
  }

  get spig(): Spig {
    return this._spig;
  }

  get out(): string {
    return this._out;
  }

  set out(value: string) {
    this._out = value;
    this._change = true;
  }

  get src(): string | undefined {
    return this._src;
  }

  get dir(): string {
    return this._dir;
  }

  get ext(): string {
    return this._ext;
  }

  get name(): string {
    return this._name;
  }

  get uuid(): string {
    return this._uuid;
  }

  get root(): string {
    return this._root;
  }

  /**
   * Calculates the ID.
   */
  static idOf(srcDir: string, path: string): string {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return srcDir + path;
  }

  /**
   * @param spig Spig instance that created this object
   * @param srcDir source directory.
   * @param path: relative dir + file name from the source root.
   * @param absolutePath absolute path to the file, optional. If not set, file will be synthetic.
   */
  constructor(spig: Spig, srcDir: string, path: string, absolutePath?: string) {
    this._uuid = UUID.generate();

    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    let dirName = Path.dirname(path);
    dirName = dirName === '/' ? dirName : dirName + '/';

    // indicates if file reference is active and therefore
    // consumed by spig. by setting it to false, it becomes
    // inactive, like it does not exist.
    this._active = true;

    // indicates if file is created from a real file or given context
    this._synthetic = false;

    // Example
    // -------
    // srcDir = ./site/
    // outDir = ./
    // path = foo/bar.ext

    // /site
    this._root = srcDir;

    // /foo/bar.ext
    this._id = srcDir + path;

    // /User/.../foo/bar.ext
    this._src = absolutePath;

    // /foo
    this._dir = dirName;

    // bar.ext
    this._name = Path.basename(path);

    // .ext
    this._ext = Path.extname(path);

    // bar
    this._basename = Path.basename(path, this.ext);

    // /foo/bar.ext
    this._path = path;

    // /foo/bar.ext
    // this is THE only thing you can change!
    // READ-WRITE
    this._out = path;

    // attributes
    this._attr = {};

    // buffers
    this._buffer = undefined;
    this._string = undefined;

    this._spig = spig;
  }

  /**
   * Sets the OUT extension.
   */
  set outExt(ext: string) {
    this.out = Path.join(Path.dirname(this._out), Path.basename(this._out, Path.extname(this._out)) + '.' + ext);
  }

  attr(key: string): any {
    return this._attr[key];
  }

  setAttr(key: string, value: any): void {
    this._attr[key] = value;
    this._change = true;
  }

  /**
   * Copies the attributes by overwriting existing.
   */
  setAttrsFrom(attrs: object): void {
    Object.assign(this._attr, attrs);
    this._change = true;
  }

  /**
   * Adds missing attributes.
   */
  addAttrsFrom(attrs: object): void {
    Object.keys(attrs).forEach((key) => {
      if (!this._attr[key]) {
        this._attr[key] = (attrs as any)[key];
      }
    });
    this._change = true;
  }

  hasAttr(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this._attr, key);
  }

  /**
   * Returns buffers input size in bytes.
   */
  bufferInputSize(): number {
    if (!this.src) {
      return 0;
    }
    const stats = fs.statSync(this.src);
    return stats.size;
  }

  /**
   * Sets file's buffer.
   */
  set buffer(content: Buffer) {
    this._buffer = content;
    this._string = undefined;
    this._change = true;
  }

  /**
   * Returns file's buffer. Loads it on first access.
   */
  get buffer(): Buffer {
    if (!this._buffer) {
      if (!this.src) {
        throw new Error('Source N/A for synthetic files.');
      }
      this._buffer = fs.readFileSync(this.src);
    }
    return this._buffer;
  }

  /**
   * Sets or loads files buffer as a string.
   */
  set string(content: string) {
    this._string = content;
    this._buffer = Buffer.from(content, 'utf8');
    this._change = true;
  }

  get string(): string {
    if (!this._string) {
      this._string = this.buffer.toString();
    }
    return this._string || '';
  }

  // CONTEXT

  /**
   * Builds a context used in templates.
   */
  context(): {} {
    if (this._change) {
      Object.assign(this._attr, {
        site: SpigConfig.site,
        link: SpigConfig.site.baseURL + permalink(this._out),
        url: permalink(this._out),
        src: this.dir + this.name,
        content: this.string,
      });
      this._change = false;
    }

    return this._attr;
  }
}
