import * as fs from 'fs';
import * as Path from 'path';
import { performance } from 'perf_hooks';
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
  async run(): Promise<void> {
    const t0 = performance.now();

    const phasePromises = [];

    for (const phase of this.phases) {
      phasePromises.push(this.runPhase(phase));
    }

    console.log(`-----> ${this.phases.length} ${phasePromises.length}`);
    await Promise.all(phasePromises);

    log.buildTime(performance.now() - t0);

    await this.writeAllFiles();

    log.totalTime(performance.now() - t0);
  }

  /**
   * Runs all operations of a single phase.
   * Returns a promise of the phase execution.
   */
  async runPhase(phaseName: string): Promise<FileRef[][]> {
    log.phase(phaseName);

    const ops = this.ops[phaseName];
    if (!ops) {
      return Promise.resolve([]);
    }

    const p = ops
      .filter(op => {
        // execute only ops for given SPIGs
        return this.spigs.indexOf(op[0]) !== -1;
      })
      .map(op => {
        // each operation of a phase is executed sequentially
        return SpigRunner.runOperation(op[0], op[1]);
      });

    return Promise.all(p);
  }

  /**
   * Runs single operation on a Spig that defines it.
   */
  static runOperation(spig: Spig, op: SpigOperation): Promise<FileRef[]> {
    const promises: Promise<FileRef>[] = [];

    log.operation(op.name);

    op.onStart();

    const files: FileRef[] = [];
    spig.forEachFile(f => files.push(f));

    files
      .filter(fileRef => fileRef.active)
      .forEach(fileRef => {
        let promise = op.onFile(fileRef);
        if (!promise) {
          promise = Promise.resolve(fileRef);
        }
        promises.push(promise);
      });

    op.onEnd();

    return Promise.all(promises);
  }

  /**
   * Writes all files.
   */
  writeAllFiles(): Promise<void[]> {
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
    const promises: Promise<void>[] = [];

    function incTotalCount(): void {
      totalCount += 1;
    }
    function incPageCount(): void {
      pageCount += 1;
    }

    files
      .filter(fileRef => fileRef.active)
      .forEach(fileRef => {
        incTotalCount();
        if (fileRef.hasAttr('page')) {
          incPageCount();
        }
        promises.push(write(fileRef.spig.def.destDir, fileRef));
      });

    log.line(`${pageCount}/${totalCount}`);
    return Promise.all(promises);
  }
}
