import { SpigConfig } from './spig-config';
import { SpigEngines } from './spig-engines';

type Spig = import('./spig').Spig;
type FileRef = import('./file-reference').FileRef;
type SpigOperation = import('./spig-operation').SpigOperation;

// GLOBAL context.
// All kind of static (const) exports.
// Should be one single sole place for the export consts

/**
 * Spig phases is simply a list of phases.
 * Phase is a synchronization point as it guarantees that all
 * function have been executed.
 */
export const PHASES: string[] = [];

/**
 * Operations per phases. Each phase defines an array of operations per SPIG!.
 */
export type SpigOpPair = { spig: Spig; op: SpigOperation };
export const OPS: { [phaseName: string]: { [spigId: string]: SpigOpPair[] } } = {};

/**
 * All SPIG instances.
 */
export const SPIGS: Spig[] = [];

/**
 * The map of all files used by Spig.
 */
export const FILES: { [id: string]: FileRef } = {};

/**
 * Returns files that matches given predicate.
 */
export function files(fileRefPredicate: (fileRef: FileRef) => boolean = () => true): FileRef[] {
  return Object.values(FILES).filter(fileRefPredicate);
}

/**
 * CLI arguments.
 */
export const ARGS: { taskName: string } = (() => {
  const args = process.argv.slice(2);
  let taskName = 'build';
  if (args.length !== 0) {
    taskName = args[0];
  }
  return {
    taskName,
  };
})();

/**
 * Spig configuration.
 */
export const spigConfig = new SpigConfig();

/**
 * Spig Engines.
 */
export const spigEngines = new SpigEngines();
