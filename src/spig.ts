import events from 'events';
import { ARGS } from './args.js';
import { ctx, SpigCtx, spigCtxHardReset, spigCtxSoftReset, SpigOpPair } from './ctx.js';
import * as log from './log.js';
import { SpigDef } from './spig-def.js';
import { SpigFiles } from './spig-files.js';
import { SpigOps } from './spig-ops.js';
import { TaskRunner } from './task-runner.js';
import * as hello from './hello.js';

type SpigOperation = import('./spig-operation.js').SpigOperation;
type FileRef = import('./file-reference.js').FileRef;

// system debug errors

process.on('warning', (e) => console.warn(e.stack));
events.EventEmitter.prototype.setMaxListeners(100);

let spigCount = 0;
function generateSpigId(): string {
  spigCount += 1;
  return `Spig-${spigCount}`;
}

/**
 * Spig defines operations on one set of files. Simple as that.
 * Operations are grouped and executed in phases, allowing
 * synchronization between different parts of the process.
 */
export class Spig {
  private readonly _id: string;

  private readonly _def: SpigDef;

  private _files: SpigFiles;

  /**
   * Returns unique SPIG id.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Creates new Spig with given SPIG definition.
   */
  static of(spigDefConsumer: (spigDef: SpigDef) => void): Spig {
    const spigDef = new SpigDef(ctx.config);
    spigDefConsumer(spigDef);
    return new Spig(spigDef);
  }

  /**
   * Creates new Spig on given file set and default folders.
   */
  static on(files?: string[] | string): Spig {
    if (!files) {
      files = [];
    }
    if (!Array.isArray(files)) {
      files = [files];
    }
    return new Spig(new SpigDef(ctx.config).on(files));
  }

  /**
   * Pre-defines phases order. By default, phases are
   * ordered as they appear in the file. With this method
   * you can set the custom order. Any missing phase defined later
   * will be appended and executed after these ones.
   */
  static phases(phasesArray: string[]): void {
    phasesArray.forEach((phase) => ctx.PHASES.push(phase));
  }

  private constructor(spigDef: SpigDef) {
    this._id = generateSpigId();
    this._def = spigDef;
    this._files = new SpigFiles(this);
    ctx.SPIGS.push(this);
  }

  /**
   * Returns Spig definition.
   */
  get def(): SpigDef {
    return this._def;
  }

  /**
   * Resets all the files in this SPIG.
   * todo check if reset really clears it all.
   */
  reset(all: boolean): void {
    if (all) {
      spigCtxSoftReset();
    }
    this._files.removeAllFiles();
    this._files = new SpigFiles(this);
  }

  _BEFORE(phaseName: string): SpigOps {
    return this._(`${phaseName}^BEFORE`);
  }

  _AFTER(phaseName: string): SpigOps {
    return this._(`${phaseName}^AFTER`);
  }

  /**
   * Starts the phase definition.
   * If phase is not register it will be added to the end of phases!
   */
  _(phaseName: string): SpigOps {
    if (!ctx.OPS[phaseName]) {
      let phaseNameBase = phaseName;

      const ndx = phaseNameBase.indexOf('^');
      if (ndx !== -1) {
        phaseNameBase = phaseName.slice(0, ndx);
        const phaseNameVariant = phaseName.slice(ndx + 1);
        if (phaseNameVariant !== 'BEFORE' && phaseNameVariant !== 'AFTER') {
          throw Error(`Invalid phase name variant: ${phaseName}`);
        }
      }
      // register new phase, and add pre/post phases!
      [`${phaseNameBase}^BEFORE`, phaseNameBase, `${phaseNameBase}^AFTER`].forEach((p) => {
        ctx.OPS[p] = {};
        ctx.PHASES.push(p);
      });
    }

    const opsPerPhase: { [spigId: string]: SpigOpPair[] } = ctx.OPS[phaseName];

    if (!opsPerPhase[this.id]) {
      // register new Spig per phase
      opsPerPhase[this.id] = [];
    }

    return new SpigOps(this, (op: SpigOperation) => {
      // register operation withing this phase and spig.
      opsPerPhase[this.id].push({ spig: this, op });
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
    this.runTask(ARGS.taskName).then(() => {});
  }

  static runTask(taskName: string): Promise<void> {
    return new TaskRunner()
      .runTask(taskName)
      .catch((e) => {
        log.error(e);
        throw e;
      })
      .then(() => {
        ctx.config.dev.state.isUp = true;
      });
  }

  /**
   * Default SPIG "HELLO" phase.
   */
  static hello(): void {
    log.hello();

    hello.statics(ctx.config, Spig.of);
    hello.sass(ctx.config, Spig.of);
    hello.precss(ctx.config, Spig.of);
    hello.images(ctx.config, Spig.of);
    hello.js(ctx.config, Spig.of);
    hello.jsBundles(ctx.config, Spig.of);
  }

  static init(spigCtxConsumer: (ctx: SpigCtx) => void = () => {}): SpigCtx {
    return spigCtxHardReset(spigCtxConsumer);
  }
}

// start

Spig.init();
