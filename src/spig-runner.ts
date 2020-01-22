import fs from 'fs';
import Path from 'path';
import * as log from './log';
import * as SpigConfig from './spig-config';
import { FileRef } from './file-reference';
import { SpigOperation } from './spig-operation';
import { SpigOpPair } from './ctx';

type Spig = import('./spig').Spig;

function ensureFilesDirectoryExists(filePath: string): boolean {
  const dirname = Path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
  return false;
}

function logFileOut(fileRef: FileRef): void {
  let outname = fileRef.spig.def.destDir + fileRef.out;
  if (outname.startsWith('//')) {
    outname = outname.substr(1);
  }

  log.fromTo(outname, fileRef.hasAttr('page'), fileRef.synthetic ? undefined : fileRef.root + fileRef.path);
}

/**
 * Writes single file reference.
 */
function write(outDir: string, fileRef: FileRef): Promise<void> {
  const outName = outDir + fileRef.out;
  const dest = Path.normalize(SpigConfig.dev.root + SpigConfig.dev.outDir + outName);

  ensureFilesDirectoryExists(dest);

  return new Promise((resolve, reject) => {
    logFileOut(fileRef);
    fs.writeFile(dest, fileRef.buffer, err => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Runs all phases and builds the site.
 */
export class SpigRunner {
  private spigs: Spig[];

  private readonly phases: string[];

  private readonly ops: { [phaseName: string]: { [spigId: string]: SpigOpPair[] } };

  constructor(spigs: Spig[], phases: string[], ops: { [phaseName: string]: { [spigId: string]: SpigOpPair[] } }) {
    this.spigs = spigs;
    this.phases = phases;
    this.ops = ops;
  }

  /**
   * Runs it all.
   */
  run(): Promise<void> {
    let phasePromise: Promise<string> = Promise.resolve('');

    this.phases.forEach(phase => {
      // phases are executed sequentially!
      phasePromise = phasePromise.then(() => this.runPhase(phase));
    });

    return phasePromise.then(() => this.writeAllFiles()).then(() => {});
  }

  /**
   * Runs all operations of a single phase.
   * Returns a promise of the phase execution.
   */
  private runPhase(phaseName: string): Promise<string> {
    log.phase(phaseName);

    const ops: { [p: string]: SpigOpPair[] } = this.ops[phaseName];
    if (!ops) {
      return Promise.resolve(phaseName);
    }

    const spigPromises: Promise<string>[] = [];

    Object.keys(ops)
      .filter(spigId => {
        // execute only ops for given SPIGs
        return this.spigs.filter(s => spigId === s.id).length > 0;
      })
      .forEach(spigId => {
        // run Spigs of phase parallel
        const opsPerSpig = ops[spigId];
        spigPromises.push(this.runSpig(spigId, opsPerSpig));
      });

    return Promise.all(spigPromises).then(() => phaseName);
  }

  /**
   * Runs all operations of single Spig in given phase.
   * All operations are executed sequentially.
   */
  private runSpig(spigId: string, ops: SpigOpPair[]): Promise<string> {
    const empty: FileRef[] = [];
    let p = Promise.resolve(empty);

    ops.forEach(it => {
      if (it.spig.id !== spigId) {
        throw new Error('Internal error! Executing Spig on ');
      }
      p = p.then(() => this.runOperation(it.spig, it.op));
    });

    return p.then(() => spigId);
  }

  /**
   * Runs single operation on a Spig that defines it.
   */
  private runOperation(spig: Spig, op: SpigOperation): Promise<FileRef[]> {
    log.operation(op.name);

    op.onStart();

    const files: FileRef[] = [];
    spig.forEachFile(f => files.push(f));

    const promises: Promise<FileRef>[] = files
      .filter(fileRef => fileRef.active)
      .map(fileRef => {
        return op.onFile(fileRef).then(fr => {
          op.onEnd();
          return fr;
        });
      });

    return Promise.all(promises);
  }

  /**
   * Writes all files.
   */
  private writeAllFiles(): Promise<FileRef[]> {
    const files: FileRef[] = [];
    this.spigs.forEach(spig => {
      spig.forEachFile(fileRef => files.push(fileRef));
    });

    files.sort((a, b) => {
      if (a.out > b.out) {
        return a.out < b.out ? -1 : 1;
      }
      return a.out < b.out ? -1 : 0;
    });

    const filesLength = files.length;

    if (filesLength === 0) {
      return Promise.resolve([]);
    }

    log.line();

    let totalCount = 0;

    function incTotalCount(): void {
      totalCount += 1;
    }

    const promises: Promise<FileRef>[] = files
      .filter(fileRef => fileRef.active)
      .map(fileRef => {
        incTotalCount();
        return write(fileRef.spig.def.destDir, fileRef).then(() => fileRef);
      });

    log.line(`${totalCount}`);

    return Promise.all(promises);
  }
}
