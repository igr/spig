"use strict";

// Global context

/**
 * Spig phases is simply a list of phases.
 * Phase is a synchronization point as it guarantees that all
 * function have been executed.
 */
module.exports.PHASES = [];

/**
 * Operations per phases. Each phase defines an array of operations.
 */
module.exports.OPS = {};

/**
 * All SPIG instances.
 */
module.exports.SPIGS = [];

/**
 * The map of all files used by Spig (id -> FileRef).
 */
module.exports.FILES = {};


/**
 * CLI arguments.
 */
module.exports.ARGS = (() => {
  const args = process.argv.slice(2);
  let taskName = "build";
  if (args.length !== 0) {
    taskName = args[0];
  }
  return {
    taskName: taskName
  };
})();
