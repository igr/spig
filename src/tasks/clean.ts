import { deleteAsync } from 'del';
import { ctx } from '../ctx.js';
import { Task } from '../task.js';

export class CleanTask extends Task {
  constructor() {
    super('clean');
  }

  run(): Promise<Task> {
    return deleteAsync([ctx.config.dev.outDir + '/**/*']).then(() => this);
  }
}
