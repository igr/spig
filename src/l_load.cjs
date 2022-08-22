import { ctx } from './ctx';

/**
 * Loads _existing_ Javascript module. Throws error if missing.
 */
export function l_load(moduleName) {
  return require(ctx.config.dev.root + moduleName);
}

/**
 * Loads Javascript module or returns undefined if not found.
 */
export function l_loadJs(moduleName) {
  try {
    return require(ctx.config.dev.root + moduleName);
  } catch (err) {
    return undefined;
  }
}
