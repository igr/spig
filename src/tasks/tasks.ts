import { Task } from '../task.js';
import { SpigCtx } from '../ctx.js';

export class SerialTasks extends Task {
  private tasks: Task[];

  constructor(name: string, ctx: SpigCtx, tasks: Task[]) {
    super(name, ctx);
    this.tasks = tasks;
  }

  run(): Promise<Task> {
    let p: Promise<Task> = Promise.resolve(this);
    this.tasks.forEach((t) => {
      p = p.then(() => t.invoke());
    });
    return p;
  }
}

export class ParallelTasks extends Task {
  private tasks: Task[];

  constructor(name: string, ctx: SpigCtx, tasks: Task[], logTasks = true) {
    super(name, ctx, logTasks);
    this.tasks = tasks;
  }

  run(): Promise<Task> {
    const allPromises = this.tasks.map((t) => t.invoke());
    return Promise.all(allPromises).then(() => this);
  }
}
