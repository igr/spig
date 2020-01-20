type Spig = import('./spig').Spig;
type FileRef = import('./file-reference').FileRef;
type SpigOperation = import('./spig-operation').SpigOperation;

// Global context

/**
 * Spig phases is simply a list of phases.
 * Phase is a synchronization point as it guarantees that all
 * function have been executed.
 */
export const PHASES: string[] = [];

/**
 * Operations per phases. Each phase defines an array of operations.
 */
export const OPS: { [phaseName: string]: [Spig, SpigOperation][] } = {};

/**
 * All SPIG instances.
 */
export const SPIGS: Spig[] = [];

export function forEachSpig(spigConsumer: (spig: Spig) => void): void {
  SPIGS.forEach(spigConsumer);
}

/**
 * The map of all files used by Spig.
 */
export const FILES: { [id: string]: FileRef } = {};

export function forEachFile(fileRefConsumer: (fileRef: FileRef) => void): void {
  Object.keys(FILES).forEach(id => {
    fileRefConsumer(FILES[id]);
  });
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
