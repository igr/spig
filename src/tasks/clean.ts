import del from 'del';
import * as SpigConfig from '../spig-config';
import { Task } from '../task';

export class CleanTask extends Task {
  constructor() {
    super('clean');
  }

  run(): Promise<Task> {
    return del([SpigConfig.dev.outDir + '/**/*']).then(() => this);
  }
}
