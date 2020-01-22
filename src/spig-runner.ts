import fs from 'fs';
import Path from 'path';
import * as log from './log';
import * as SpigConfig from './spig-config';
import { FileRef } from './file-reference';
import { SpigOperation } from './spig-operation';

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

  private readonly ops: { [phaseName: string]: [Spig, SpigOperation][] };

  constructor(spigs: Spig[], phases: string[], ops: { [phaseName: string]: [Spig, SpigOperation][] }) {
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
      // phases are executed sequentially
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

    const ops = this.ops[phaseName];
    if (!ops) {
      return Promise.resolve(phaseName);
    }

    const opsPromises: Promise<FileRef[]>[] = [];
    ops
      .filter(op => {
        // execute only ops for given SPIGs
        return this.spigs.indexOf(op[0]) !== -1;
      })
      .forEach(op => {
        opsPromises.push(this.runOperation(op[0], op[1]));
      });

    return Promise.all(opsPromises).then(() => phaseName);
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

    let pageCount = 0;
    let totalCount = 0;

    function incTotalCount(): void {
      totalCount += 1;
    }

    function incPageCount(): void {
      pageCount += 1;
    }

    const promises: Promise<FileRef>[] = files
      .filter(fileRef => fileRef.active)
      .map(fileRef => {
        incTotalCount();
        if (fileRef.hasAttr('page')) {
          incPageCount();
        }
        return write(fileRef.spig.def.destDir, fileRef).then(() => fileRef);
      });

    log.line(`${pageCount}/${totalCount}`);

    return Promise.all(promises);
  }
}
