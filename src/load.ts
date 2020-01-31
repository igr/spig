import fs from 'fs';
import Path from 'path';
import * as log from './log';
import * as SpigConfig from './spig-config';

const jsonFilesCache: { [key: string]: object } = {};

function readFile(file: string): object {
  if (jsonFilesCache[file]) {
    return jsonFilesCache[file];
  }

  jsonFilesCache[file] = {};

  if (fs.existsSync(file)) {
    jsonFilesCache[file] = JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  return jsonFilesCache[file];
}

/**
 * Loads _existing_ Javascript module. Throws error if missing.
 */
export function load(moduleName: string): any {
  return require(SpigConfig.dev.root + moduleName);
}

/**
 * Loads Javascript module or returns undefined if not found.
 */
export function loadJs(moduleName: string): any | undefined {
  try {
    return require(SpigConfig.dev.root + moduleName);
  } catch (err) {
    return undefined;
  }
}

/**
 * Loads a JSON file or JS file that returns an object when executed.
 */
export function loadJsonOrJs(nameNoExt: string): object {
  let obj = {};

  const jsFile = nameNoExt + '.js';

  if (fs.existsSync(jsFile)) {
    log.pair('Reading', Path.basename(jsFile));
    const jsRequireModule = jsFile.substr(0, jsFile.length - 3);
    const config = load(jsRequireModule)();

    obj = { ...obj, ...config };
  }

  const jsonFile = nameNoExt + '.json';

  if (fs.existsSync(jsonFile)) {
    log.pair('Reading', Path.basename(jsonFile));
    const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    obj = { ...obj, ...json };
  }
  return obj;
}

/**
 * Loads JSON file (cached).
 */
export function loadJson(nameNoExt: string): object {
  const jsonFile = nameNoExt + '.json';

  return readFile(jsonFile);
}
