import { create } from 'browser-sync';
import * as log from '../log.js';
import { ctx } from '../ctx.js';
import { SpigRunner } from '../spig-runner.js';
import { Task } from '../task.js';

type Spig = import('../spig.js').Spig;

const bs = create();

function onChange(spig: Spig, changedPath: string) {
  return () => {
    const root = ctx.config.dev.root + ctx.config.dev.srcDir;
    if (changedPath.startsWith(root)) {
      changedPath = changedPath.substr(root.length + 1);
    }
    log.notification(`Change detected in ${changedPath}, rebuilding...`);

    spig.reset(true);
    return new SpigRunner([spig], ctx.PHASES, ctx.OPS)
      .run()
      .then(() => bs.reload())
      .catch((e) => log.error(e));
  };
}

export class WatchTask extends Task {
  constructor() {
    super('watch', false);
  }

  run(): Promise<Task> {
    const root = ctx.config.dev.root + ctx.config.dev.srcDir;
    ctx.SPIGS.forEach((spig) => {
      if (spig.def.files.length > 0) {
        spig.def.files.forEach((pattern) => {
          const watchThis = root + spig.def.inDir + pattern;
          // console.log(watchThis);
          const watchFn = (event: string): void => {
            switch (event) {
              // todo ADD is working too much in the beginning
              // case 'add':
              case 'change':
              case 'unlink':
                if (ctx.config.dev.state.isUp) {
                  onChange(spig, watchThis)();
                }
                break;
              default:
                break;
            }
          };
          // watch patterns
          bs.watch(watchThis, {}, watchFn);

          // special cases - watch LAYOUTS and DATA if site files are watched
          if (spig.def.inDir === ctx.config.dev.dir.site) {
            bs.watch(root + ctx.config.dev.dir.layouts + '/**/*', {}, watchFn);
            bs.watch(root + ctx.config.dev.dir.data + '/**/*', {}, watchFn);
          }
        });
      } else {
        // watch all real, non-synthetic files
        // todo do we still need this?
        spig.forEachFile((fr) => {
          if (!fr.synthetic && fr.src) {
            bs.watch(fr.src).on('change', onChange(spig, fr.src));
          }
        });
      }
    });

    bs.init({
      server: ctx.config.dev.outDir,
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
