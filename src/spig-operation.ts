import { FileRef } from './file-reference.js';

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

  /**
   * Shortcut for SpigOperation for sync operations.
   */
  static of(name: string, onFile: (fileRef: FileRef) => void): SpigOperation {
    return new SpigOperation(name, (fileRef) => {
      const mustBeVoid: any = onFile(fileRef);
      if (mustBeVoid) {
        throw new Error(
          `Internal error! Operation '${name}' is defined with "SpigOperation.of()" method. It probably should be defined with constructor instead.`
        );
      }
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
