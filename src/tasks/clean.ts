import { deleteAsync } from 'del';
import { ctx } from '../ctx';
import { Task } from '../task';

export class CleanTask extends Task {
  constructor() {
    super('clean');
  }

  run(): Promise<Task> {
    return deleteAsync([ctx.config.dev.outDir + '/**/*']).then(() => this);
  }
}
