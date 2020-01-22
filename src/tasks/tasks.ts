import * as log from '../log';
import { Task } from '../task';

export class SerialTasks extends Task {
  private tasks: Task[];

  constructor(name: string, tasks: Task[]) {
    super(name);
    this.tasks = tasks;
  }

  run(): void {
    this.tasks.forEach(t => {
      t.invoke();
    });
  }
}

export class ParallelTasks extends Task {
  private tasks: Task[];

  constructor(name: string, tasks: Task[]) {
    super(name);
    this.tasks = tasks;
  }

  run(): void {
    (async () => {
      const allPromises = this.tasks.map(t => {
        return new Promise((resolve, reject) => {
          try {
            t.invoke();
            resolve(t);
          } catch (e) {
            reject(e);
          }
        });
      });
      await Promise.all(allPromises).catch(e => log.error(e));
    })();
  }
}
