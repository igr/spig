import * as ctx from './ctx';
import * as SpigInit from './spig-init';
import { SpigDef } from './spig-def';
import { SpigFiles } from './spig-files';
import { SpigOps } from './spig-ops';
import { TaskRunner } from './task-runner';

type SpigOperation = import('./spig-operation').SpigOperation;
type FileRef = import('./file-reference').FileRef;

// system debug errors

process.on('warning', e => console.warn(e.stack));
// eslint-disable-next-line no-underscore-dangle
require('events').EventEmitter.prototype._maxListeners = 100;

// start

SpigInit.initDevConfig();
SpigInit.initSiteConfig();
SpigInit.initOpsConfig();
SpigInit.initData();
SpigInit.initProductionMode();
// todo when not rapid task only?
SpigInit.initEngines();

/**
 * Spig defines operations on one set of files. Simple as that.
 * Operations are grouped and executed in phases, allowing
 * synchronization between different parts of the process.
 */
export class Spig {
  private readonly _def: SpigDef;

  private _files: SpigFiles;

  /**
   * Creates new Spig with given SPIG definition.
   */
  static of(spigDefConsumer: (spigDef: SpigDef) => void): Spig {
    const spigDef = new SpigDef();
    spigDefConsumer(spigDef);
    return new Spig(spigDef);
  }

  /**
   * Creates new Spig on given file set and default folders.
   */
  static on(files: string[]): Spig {
    return new Spig(new SpigDef().on(files));
  }

  /**
   * Pre-defines phases order. By default, phases are
   * ordered as they appear in the file. With this method
   * you can set the custom order. Any missing phase defined later
   * will be appended and executed after these ones.
   */
  static phases(phasesArray: string[]): void {
    phasesArray.forEach(phase => ctx.PHASES.push(phase));
  }

  constructor(spigDef: SpigDef) {
    this._def = spigDef;
    this._files = new SpigFiles(this);
    ctx.SPIGS.push(this);
  }

  get def(): SpigDef {
    return this._def;
  }

  /**
   * Resets all the files in this SPIG.
   */
  reset(): void {
    this._files.removeAllFiles();
    this._files = new SpigFiles(this);
  }

  /**
   * Starts the phase definition.
   * If phase is not register it will be added to the end of phases!
   */
  _(phaseName: string): SpigOps {
    if (!ctx.OPS[phaseName]) {
      ctx.OPS[phaseName] = [];
      ctx.PHASES.push(phaseName);
    }
    return new SpigOps(this, (op: SpigOperation) => {
      ctx.OPS[phaseName].push([this, op]);
    });
  }

  /**
   * Adds a real or virtual file to this Spig.
   * @param fileName relative file name from the root
   * @param content optional file content. If provided, file reference will be syntactics.
   */
  addFile(fileName: string, content: Buffer | string): FileRef {
    return this._files.addFile(fileName, content);
  }

  /**
   * Removed a file from the SPIG.
   */
  removeFile(fileRef: FileRef): void {
    this._files.removeFile(fileRef);
  }

  /**
   * Iterates all the files.
   */
  forEachFile(fileRefConsumer: (fileRef: FileRef) => void): void {
    this._files.files.forEach(fileRefConsumer);
  }

  /**
   * Performs additional computation on this Spig
   * using fluent interface.
   */
  with(fn: (spig: Spig) => void): Spig {
    fn(this);
    return this;
  }

  /**
   * Runs all SPIG tasks :)
   */
  static run(): void {
    new TaskRunner().runTask(ctx.ARGS.taskName);
  }

  /**
   * Default SPIG "HELLO" phase.
   */
  static hello(): void {
    if (TaskRunner.isRapidTask(ctx.ARGS.taskName)) {
      return;
    }

    // todo ASYNC!
    (async function runHello() {
      // eslint-disable-next-line import/no-cycle
      const hello = await import('./hello');
      hello.statics();
      hello.sass();
      hello.images();
      hello.js();
      hello.jsBundles();
    })();
  }
}
