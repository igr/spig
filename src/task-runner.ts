import { performance } from 'perf_hooks';
import * as log from './log';
import { taskClean } from './tasks/clean';
import { taskServe } from './tasks/serve';
import { taskBuild } from './tasks/build';
import { taskWatch } from './tasks/watch';

function createTasks(tr: TaskRunner): { [taskName: string]: () => void } {
  return {
    clean: taskClean,
    build: taskBuild,
    serve: taskServe,
    watch: taskWatch,
    'serve+watch': () => tr.parallel(['serve', 'watch']),
    dev: () => tr.serial(['build', 'serve+watch']),
  };
}

export class TaskRunner {
  private readonly tasks: { [taskName: string]: any } = {};

  /**
   * Short tasks don't require the SPIG definition loaded.
   * todo Make this better.
   */
  static isRapidTask(taskname: string): boolean {
    if (taskname === 'build' || taskname === 'watch' || taskname === 'dev') {
      return false;
    }
    return true;
  }

  constructor() {
    this.tasks = createTasks(this);
  }

  runTask(taskName: string): void {
    const t0 = performance.now();

    const taskFunction = this.tasks[taskName];

    if (!taskFunction) {
      throw new Error('Task not defined: ' + taskName);
    }

    taskFunction();

    log.totalTime(taskName, performance.now() - t0);
  }

  /**
   * Runs list of tasks in serial manner.
   */
  serial(taskNames: string[]): void {
    for (const t of taskNames) {
      this.runTask(t);
    }
  }

  /**
   * Runs list of tasks in parallel manner.
   */
  parallel(taskNames: string[]): void {
    (async () => {
      const allPromises = [];

      for (const t of taskNames) {
        allPromises.push(
          new Promise((resolve, reject) => {
            try {
              this.runTask(t);
              resolve();
            } catch (e) {
              reject(e);
            }
          })
        );
      }
      await Promise.all(allPromises).catch(e => log.error(e));
    })();
  }
}
