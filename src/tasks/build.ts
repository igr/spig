import { ctx } from '../ctx.js';
import { SpigRunner } from '../spig-runner.js';
import { Task } from '../task.js';

export class BuildTask extends Task {
  constructor() {
    super('build');
  }

  run(): Promise<Task> {
    return new SpigRunner(ctx.SPIGS, ctx.PHASES, ctx.OPS).run().then(() => this);
  }
}
