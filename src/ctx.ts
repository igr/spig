import * as log from './log';
import { SpigConfig } from './spig-config';
import { SpigEngines } from './spig-engines';
import { SpigInit } from './spig-init';

type Spig = import('./spig').Spig;
type FileRef = import('./file-reference').FileRef;
type SpigOperation = import('./spig-operation').SpigOperation;

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
  public engines = new SpigEngines();
}

// ---------------------------------------------------------------- context

export let ctx: SpigCtx;

export function spigCtxHardReset(spigCtxConsumer: (ctx: SpigCtx) => void): SpigCtx {
  ctx = new SpigCtx();

  // give user a chance to change configuration before the initialization
  spigCtxConsumer(ctx);

  new SpigInit(ctx.config).init();

  log.banner();

  return ctx;
}

export function spigCtxSoftReset(): void {
  new SpigInit(ctx.config).softReset();
}
