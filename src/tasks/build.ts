import { SpigRunner } from '../spig-runner.js';
import { Task } from '../task.js';
import { SpigCtx } from '../ctx.js';

export class BuildTask extends Task {
  constructor(ctx: SpigCtx) {
    super('build', ctx);
  }

  run(): Promise<Task> {
    return new SpigRunner(this.ctx.SPIGS, this.ctx.PHASES, this.ctx.OPS).run().then(() => this);
  }
}
