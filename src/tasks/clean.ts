import { deleteAsync } from 'del';
import { spigConfig } from '../ctx';
import { Task } from '../task';

export class CleanTask extends Task {
  constructor() {
    super('clean');
  }

  run(): Promise<Task> {
    return deleteAsync([spigConfig.dev.outDir + '/**/*']).then(() => this);
  }
}
