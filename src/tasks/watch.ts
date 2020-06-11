import { create } from 'browser-sync';
import * as log from '../log';
import * as ctx from '../ctx';
import * as SpigConfig from '../spig-config';
import { SpigRunner } from '../spig-runner';
import { Task } from '../task';

type Spig = import('../spig').Spig;

const bs = create();

function onChange(spig: Spig, changedPath: string) {
  return () => {
    const root = SpigConfig.dev.root + SpigConfig.dev.srcDir;
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
    const root = SpigConfig.dev.root + SpigConfig.dev.srcDir;
    ctx.SPIGS.forEach((spig) => {
      if (spig.def.files.length > 0) {
        spig.def.files.forEach((pattern) => {
          const watchThis = root + spig.def.srcDir + pattern;
          // console.log(watchThis);
          const watchFn = (event: string): void => {
            switch (event) {
              // todo ADD is working too much in the beginning
              // case 'add':
              case 'change':
              case 'unlink':
                if (SpigConfig.dev.state.isUp) {
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
          if (spig.def.srcDir === SpigConfig.dev.dir.site) {
            bs.watch(root + SpigConfig.dev.dir.layouts + '/**/*', {}, watchFn);
            bs.watch(root + SpigConfig.dev.dir.data + '/**/*', {}, watchFn);
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
