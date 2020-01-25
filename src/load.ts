import fs from 'fs';
import Path from 'path';
import * as log from './log';
import * as SpigConfig from './spig-config';

// This is the only place where `require` is used.

/**
 * Loads external Javascript module.
 */
export function load(moduleName: string): any {
  return require(SpigConfig.dev.root + moduleName);
}

/**
 * Loads a JSON file or JS file that returns an object.
 */
export function loadJsonOrJs(nameNoExt: string): {} {
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
