import * as log from '../log';
import { Task } from '../task';

export class SerialTasks extends Task {
  private tasks: Task[];

  constructor(name: string, tasks: Task[]) {
    super(name);
    this.tasks = tasks;
  }

  run(): Promise<Task> {
    let p: Promise<Task> = Promise.resolve(this);
    this.tasks.forEach(t => {
      p = p.then(() => t.invoke());
    });
    return p;
  }
}

export class ParallelTasks extends Task {
  private tasks: Task[];

  constructor(name: string, tasks: Task[], logTasks = true) {
    super(name, logTasks);
    this.tasks = tasks;
  }

  run(): Promise<Task> {
    const allPromises = this.tasks.map(t => t.invoke());
    return Promise.all(allPromises)
      .catch(e => log.error(e))
      .then(() => this);
  }
}
