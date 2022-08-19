import fs from 'fs';
import Path from 'path';
import * as log from './log';
import { spigConfig } from './ctx';

const jsonFilesCache: { [key: string]: object } = {};

let isLogOn = true;

export function setLog(logLoads: boolean): void {
  isLogOn = logLoads;
}

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
  return require(spigConfig.dev.root + moduleName);
}

/**
 * Loads Javascript module or returns undefined if not found.
 */
export function loadJs(moduleName: string): any | undefined {
  try {
    return require(spigConfig.dev.root + moduleName);
  } catch (err) {
    return undefined;
  }
}

/**
 * Loads a JSON file or JS file that returns an object when executed.
 */
export function loadJsonOrJs(nameNoExt: string, argument: any = undefined): object {
  let obj = {};

  const jsFile = nameNoExt.endsWith('.js') ? nameNoExt : nameNoExt + '.js';

  if (fs.existsSync(jsFile)) {
    if (isLogOn) {
      log.pair('Reading', Path.basename(jsFile));
    }
    const jsRequireModule = jsFile.substr(0, jsFile.length - 3);
    const jsFn = load(jsRequireModule);
    const config = argument ? jsFn(argument) : jsFn();

    obj = { ...obj, ...config };
  }

  const jsonFile = nameNoExt.endsWith('.json') ? nameNoExt : nameNoExt + '.json';

  if (fs.existsSync(jsonFile)) {
    if (isLogOn) {
      log.pair('Reading', Path.basename(jsonFile));
    }
    const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    obj = { ...obj, ...json };
  }
  return obj;
}

/**
 * Loads JSON file (cached).
 */
export function loadJson(jsonFile: string): object {
  if (!jsonFile.endsWith('.json')) {
    jsonFile += '.json';
  }

  if (isLogOn) {
    log.pair('Reading', Path.basename(jsonFile));
  }
  return readFile(jsonFile);
}
