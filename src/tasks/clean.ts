import del from 'del';
import * as SpigConfig from '../spig-config';
import { Task } from '../task';

export class CleanTask extends Task {
  constructor() {
    super('clean', true, true);
  }

  run(): void {
    del([SpigConfig.dev.outDir + '/**/*']);
  }
}
