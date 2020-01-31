import * as ctx from './ctx';
import * as SpigInit from './spig-init';
import * as log from './log';
import * as SpigConfig from './spig-config';
import { SpigDef } from './spig-def';
import { SpigFiles } from './spig-files';
import { SpigOps } from './spig-ops';
import { TaskRunner } from './task-runner';
import * as hello from './hello';

// noinspection JSUnusedGlobalSymbols
export { site as SpigSite } from './spig-config';

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
SpigInit.initEngines();
SpigInit.initOps();

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

  private _watchPatterns: string[] = [];

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
    const spigDef = new SpigDef();
    spigDefConsumer(spigDef);
    return new Spig(spigDef);
  }

  /**
   * Creates new Spig on given file set and default folders.
   */
  static on(files: string[] | string | undefined): Spig {
    if (!files) {
      files = [];
    }
    if (!Array.isArray(files)) {
      files = [files];
    }
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
   * todo check if reset clears it all.
   */
  reset(): void {
    this._files.removeAllFiles();
    this._files = new SpigFiles(this);
  }

  /**
   * Watches given set of files.
   */
  watch(patterns: string): Spig {
    this._watchPatterns.push(patterns);
    return this;
  }

  /**
   * Watches files in site, including the templates, just a shortcut for above.
   */
  watchSite(patterns?: string): Spig {
    const devDir = SpigConfig.dev.dir;

    if (!patterns) {
      // add default folders
      this.watch(devDir.layouts + '/**/*');
      this.watch(devDir.data + '/**/*');
      this.watch(devDir.site + '/**/*');
    } else {
      this.watch(devDir.site + patterns);
    }

    return this;
  }

  /**
   * Returns watch patterns if defined.
   */
  get watchPatterns(): string[] {
    return this._watchPatterns;
  }

  /**
   * Starts the phase definition.
   * If phase is not register it will be added to the end of phases!
   */
  _(phaseName: string): SpigOps {
    if (!ctx.OPS[phaseName]) {
      if (phaseName.indexOf('^') !== -1) {
        throw Error(`Invalid phase name (before/after): ${phaseName}`);
      }
      // register new phase, and add pre/post phases!
      [`${phaseName}^BEFORE`, phaseName, `${phaseName}^AFTER`].forEach(p => {
        ctx.OPS[p] = {};
        ctx.PHASES.push(p);
      });
    }

    const opsPerPhase: { [spigId: string]: ctx.SpigOpPair[] } = ctx.OPS[phaseName];

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
    new TaskRunner()
      .runTask(ctx.ARGS.taskName)
      .catch(e => log.error(e))
      .then(() => {
        SpigConfig.dev.state.isUp = true;
      });
  }

  /**
   * Default SPIG "HELLO" phase.
   */
  static hello(): void {
    log.hello();

    hello.statics(Spig.of);
    hello.sass(Spig.of);
    hello.precss(Spig.of);
    hello.images(Spig.of);
    hello.js(Spig.of);
    hello.jsBundles(Spig.of);
  }
}
