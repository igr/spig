import * as log from '../log';
import * as ctx from '../ctx';
import { SpigRunner } from '../spig-runner';

export function taskBuild(): void {
  log.task('build');

  new SpigRunner(ctx.SPIGS, ctx.PHASES, ctx.OPS).run().catch(e => log.error(e));
}
