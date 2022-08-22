import { deleteAsync } from 'del';
import { Task } from '../task.js';
import { SpigCtx } from '../ctx.js';

export class CleanTask extends Task {
  constructor(ctx: SpigCtx) {
    super('clean', ctx);
  }

  run(): Promise<Task> {
    return deleteAsync([this.ctx.config.dev.outDir + '/**/*']).then(() => this);
  }
}
