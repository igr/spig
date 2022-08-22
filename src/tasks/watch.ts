import { create } from 'browser-sync';
import * as log from '../log.js';
import { SpigCtx } from '../ctx.js';
import { SpigRunner } from '../spig-runner.js';
import { Task } from '../task.js';

type Spig = import('../spig.js').Spig;

const bs = create();

function onChange(spig: Spig, ctx: SpigCtx, changedPath: string) {
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
  constructor(ctx: SpigCtx) {
    super('watch', ctx, false);
  }

  run(): Promise<Task> {
    const root = this.ctx.config.dev.root + this.ctx.config.dev.srcDir;
    this.ctx.SPIGS.forEach((spig) => {
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
                if (this.ctx.config.dev.state.isUp) {
                  onChange(spig, this.ctx, watchThis)();
                }
                break;
              default:
                break;
            }
          };
          // watch patterns
          bs.watch(watchThis, {}, watchFn);

          // special cases - watch LAYOUTS and DATA if site files are watched
          if (spig.def.inDir === this.ctx.config.dev.dir.site) {
            bs.watch(root + this.ctx.config.dev.dir.layouts + '/**/*', {}, watchFn);
            bs.watch(root + this.ctx.config.dev.dir.data + '/**/*', {}, watchFn);
          }
        });
      } else {
        // watch all real, non-synthetic files
        // todo do we still need this?
        spig.forEachFile((fr) => {
          if (!fr.synthetic && fr.src) {
            bs.watch(fr.src).on('change', onChange(spig, this.ctx, fr.src));
          }
        });
      }
    });

    bs.init({
      server: this.ctx.config.dev.outDir,
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
