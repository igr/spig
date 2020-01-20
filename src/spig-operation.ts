import { FileRef } from './file-reference';

export class SpigOperation {
  protected readonly _name: string;

  private readonly _onStart: () => void;

  private readonly _onFile: (fileRef: FileRef) => Promise<FileRef>;

  private readonly _onEnd: () => void;

  get name(): string {
    return this._name;
  }

  get onStart(): () => void {
    return this._onStart;
  }

  get onFile(): (fileRef: FileRef) => Promise<FileRef> {
    return this._onFile;
  }

  get onEnd(): () => void {
    return this._onEnd;
  }

  static of(name: string, onFile: (fileRef: FileRef) => void): SpigOperation {
    return new SpigOperation(name, fileRef => {
      onFile(fileRef);
      return Promise.resolve(fileRef);
    });
  }

  constructor(
    name: string,
    onFile: (fileRef: FileRef) => Promise<FileRef>,
    onStart: () => void = () => {},
    onEnd: () => void = () => {}
  ) {
    this._name = name;
    this._onFile = onFile;
    this._onStart = onStart;
    this._onEnd = onEnd;
  }
}
