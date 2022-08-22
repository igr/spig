import * as log from './log.js';
import { SpigConfig } from './spig-config.js';
import { SpigEngines } from './spig-engines.js';
import { SpigInit } from './spig-init.js';

type Spig = import('./spig.js').Spig;
type FileRef = import('./file-reference.js').FileRef;
type SpigOperation = import('./spig-operation.js').SpigOperation;

/**
 * Operations per phases. Each phase defines an array of operations per SPIG!.
 */
export type SpigOpPair = { spig: Spig; op: SpigOperation };

/**
 * GLOBAL context.
 */
export class SpigCtx {
  /**
   * Spig phases is simply a list of phases.
   * Phase is a synchronization point as it guarantees that all
   * function have been executed.
   */
  public PHASES: string[] = [];

  public OPS: { [phaseName: string]: { [spigId: string]: SpigOpPair[] } } = {};

  /**
   * All SPIG instances.
   */
  public SPIGS: Spig[] = [];

  /**
   * The map of all files used by Spig.
   */
  public FILES: { [id: string]: FileRef } = {};

  /**
   * Returns files that matches given predicate.
   */
  files(fileRefPredicate: (fileRef: FileRef) => boolean = () => true): FileRef[] {
    return Object.values(this.FILES).filter(fileRefPredicate);
  }

  /**
   * Spig configuration.
   */
  public config = new SpigConfig();

  /**
   * Spig Engines.
   */
  public engines = new SpigEngines(this.config);
}

// ---------------------------------------------------------------- context

export let ctx: SpigCtx;
export let cfg: SpigConfig;

export function spigCtxHardReset(spigCtxConsumer: (ctx: SpigCtx) => void): SpigCtx {
  log.banner();

  ctx = new SpigCtx();
  cfg = ctx.config;

  // give user a chance to change configuration before the initialization
  spigCtxConsumer(ctx);

  new SpigInit(cfg).init();

  return ctx;
}

export function spigCtxSoftReset(): void {
  new SpigInit(ctx.config).softReset();
}
