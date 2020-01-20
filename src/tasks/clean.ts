import del from 'del';
import * as log from '../log';
import * as SpigConfig from '../spig-config';

export function taskClean(): Promise<string[]> {
  log.task('clean');
  return del([SpigConfig.dev.outDir + '/**/*']);
}
