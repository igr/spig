import * as log from '../log';
import * as ctx from '../ctx';
import { SpigRunner } from '../spig-runner';
import { Task } from '../task';

export class BuildTask extends Task {
  constructor() {
    super('build');
  }

  run(): Promise<Task> {
    return new SpigRunner(ctx.SPIGS, ctx.PHASES, ctx.OPS)
      .run()
      .catch(e => log.error(e))
      .then(() => this);
  }
}
