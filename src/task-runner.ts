import { Task } from './task.js';
import { CleanTask } from './tasks/clean.js';
import { ServeTask } from './tasks/serve.js';
import { BuildTask } from './tasks/build.js';
import { WatchTask } from './tasks/watch.js';
import { ParallelTasks, SerialTasks } from './tasks/tasks.js';
import { SpigCtx } from './ctx.js';

function createTasks(ctx: SpigCtx): { [p: string]: Task } {
  const clean = new CleanTask(ctx);
  const build = new BuildTask(ctx);
  const serve = new ServeTask(ctx);
  const watch = new WatchTask(ctx);
  const serveWatch = new ParallelTasks('serve+watch', ctx, [serve, watch], false);
  const dev = new SerialTasks('dev', ctx, [build, serveWatch]);

  return {
    clean,
    build,
    serve,
    watch,
    serveWatch,
    dev,
  };
}

export class TaskRunner {
  private readonly tasks: { [taskName: string]: Task };

  constructor(context: SpigCtx) {
    this.tasks = createTasks(context);
  }

  runTask(taskName: string): Promise<Task> {
    const task: Task = this.tasks[taskName];

    if (!task) {
      throw new Error('Task not defined: ' + taskName);
    }

    return task.invoke();
  }
}
