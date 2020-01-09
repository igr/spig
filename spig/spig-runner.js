"use strict";

const log = require('./log');
const Path = require('path');
const {performance} = require('perf_hooks');
const SpigConfig = require('./spig-config');
const fs = require('fs');

const BATCH_SIZE = 100;

/**
 * Runs all phases and builds the site.
 */
class SpigRunner {
  constructor(spigs, phases, ops) {
    this.spigs = spigs;
    this.phases = phases;
    this.ops = ops;
  }

  /**
   * Runs it all.
   */
  async run() {
    const t0 = performance.now();

    for (const phase of this.phases) {
      // sequentially run phases
      await this.runPhase(phase);
    }

    const t1 = performance.now();

    log.build(t1 - t0);

    await this.writeAllFiles();
  }

  /**
   * Runs all operations of a single phase.
   * Returns a promise of the phase execution.
   */
  async runPhase(phaseName) {
    log.phase(phaseName);

    const ops = this.ops[phaseName];
    if (!ops) {
      return;
    }

    for (const op of ops) {
      if (this.spigs.indexOf(op.spig) === -1) {
        // execute only ops for given SPIGs
        continue;
      }
      // each operation of a phase is executed sequentially
      await this.runOperation(op.spig, op.operation);
    }
  }

  /**
   * Runs single operation on a Spig that defines it.
   */
  async runOperation(spig, op) {
    log.operation(op.name);

    op.runOnStart();

    const files = [];
    spig.forEachFile(f => files.push(f));
    const filesLength = files.length;

    for (let i = 0; i < filesLength; i += BATCH_SIZE) {
      const ops = files.slice(i, i + BATCH_SIZE)
        .filter(fileRef => fileRef.active)
        .map(fileRef => {
          let promise = op.runOnFile(fileRef);
          if (!promise) {
            promise = Promise.resolve();
          }
          return promise;
        });

      await Promise.all(ops);
    }

    op.runOnEnd();
  }

  /**
   * Writes all files.
   */
  async writeAllFiles() {
    const files = [];
    this.spigs.forEach(spig => {
      spig.forEachFile(fileRef => files.push(fileRef))
    });
    files.sort((a, b) => a.out < b.out ? -1 : (a.out > b.out ? 1 : 0));
    const filesLength = files.length;

    if (filesLength === 0) {
      return Promise.resolve();
    }

    log.line();

    for (let i = 0; i < filesLength; i += BATCH_SIZE) {
      const ops = files.slice(i, i + BATCH_SIZE)
        .filter(fileRef => fileRef.active)
        .map(fileRef => write(fileRef.spig.def.destDir, fileRef));
      await Promise.all(ops);
    }

    log.line();
  }


  //END
  // for (const file of SpigFiles.files) {
  // }

  // const pageCount = SpigConfig.site.pages.length;
  //
  // if (pageCount !== 0) {
  //   logline();
  // }
  //
  // log('Pages: ' + chalk.green(pageCount));
  // log('Total files: ' + chalk.green(SpigFiles.files.length));
  // log.line();

}

module.exports = SpigRunner;

/**
 * Writes single file reference.
 */
function write(outDir, fileRef) {
  const outName = outDir + fileRef.out;
  const dest = Path.normalize(SpigConfig.dev.root + SpigConfig.dev.outDir + outName);

  ensureFilesDirectoryExists(dest);

  return new Promise((resolve, reject) => {
    log.fileOut(fileRef);
    fs.writeFile(dest, fileRef.buffer(), err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function ensureFilesDirectoryExists(filePath) {
  const dirname = Path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, {recursive: true});
}



