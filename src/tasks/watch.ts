import * as log from '../log';
import * as ctx from '../ctx';
import * as SpigConfig from '../spig-config';
import { SpigRunner } from '../spig-runner';

const bs = require('browser-sync').create();

export function taskWatch(): void {
  log.task('watch');

  bs.init({
    server: SpigConfig.dev.outDir,
    open: false,
    watchOptions: {
      ignoreInitial: true,
      ignored: '.DS_Store',
    },
  });

  ctx.forEachSpig(spig => {
    const filesToWatch: string[] = [];

    // collect all real, non-synthetic files
    spig.forEachFile(fr => {
      if (!fr.synthetic && fr.src) {
        filesToWatch.push(fr.src);
      }
    });

    bs.watch(filesToWatch).on('change', () => {
      log.notification('Change detected, rebuilding...');
      spig.reset();
      new SpigRunner([spig], ctx.PHASES, ctx.OPS).run().catch(e => log.error(e));
      bs.reload();
    });
  });

  log.info('Watching for changes...');
}
