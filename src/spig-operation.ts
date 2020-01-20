type FileRef = import('./file-reference').FileRef;

export abstract class SpigOperation {
  protected readonly _name: string;

  private _onStart: () => void;

  // todo remove void and replace with Promise.resolve
  private _onFile: (fileRef: FileRef) => Promise<FileRef> | void;

  private _onEnd: () => void;

  get name(): string {
    return this._name;
  }

  get onStart(): () => void {
    return this._onStart;
  }

  set onStart(value: () => void) {
    this._onStart = value;
  }

  get onFile(): (fileRef: FileRef) => Promise<FileRef> | void {
    return this._onFile;
  }

  set onFile(value: (fileRef: FileRef) => Promise<FileRef> | void) {
    this._onFile = value;
  }

  get onEnd(): () => void {
    return this._onEnd;
  }

  set onEnd(value: () => void) {
    this._onEnd = value;
  }

  protected constructor(name: string) {
    this._name = name;
    this._onStart = () => {};
    this._onFile = () => undefined;
    this._onEnd = () => {};
  }
}
