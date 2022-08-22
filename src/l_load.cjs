/**
 * Loads _existing_ Javascript module. Throws error if missing.
 */
function l_load(moduleName) {
  return require(moduleName);
}

/**
 * Loads Javascript module or returns undefined if not found.
 */
function l_loadJs(moduleName) {
  try {
    return require(moduleName);
  } catch (err) {
    return undefined;
  }
}

module.exports = {
  l_load,
  l_loadJs
}
