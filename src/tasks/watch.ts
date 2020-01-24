import { create } from 'browser-sync';
import * as log from '../log';
import * as ctx from '../ctx';
import * as SpigConfig from '../spig-config';
import { SpigRunner } from '../spig-runner';
import { Task } from '../task';

type Spig = import('../spig').Spig;

const bs = create();

function onChange(spig: Spig) {
  return () => {
    log.notification('Change detected, rebuilding...');
    spig.reset();
    new SpigRunner([spig], ctx.PHASES, ctx.OPS).run().catch(e => log.error(e));
    bs.reload();
  };
}

export class WatchTask extends Task {
  constructor() {
    super('watch', false);
  }

  run(): Promise<Task> {
    ctx.SPIGS.forEach(spig => {
      // collect all real, non-synthetic files
      spig.forEachFile(fr => {
        if (!fr.synthetic && fr.src) {
          bs.watch(fr.src).on('change', onChange(spig));
        }
      });
    });

    bs.init({
      server: SpigConfig.dev.outDir,
      open: false,
      watchOptions: {
        ignoreInitial: true,
        ignored: '.DS_Store',
      },
    });

    log.info('👀 Watching for changes...');

    return Promise.resolve(this);
  }
}
