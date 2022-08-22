import { Task } from './task.js';
import { CleanTask } from './tasks/clean.js';
import { ServeTask } from './tasks/serve.js';
import { BuildTask } from './tasks/build.js';
import { WatchTask } from './tasks/watch.js';
import { ParallelTasks, SerialTasks } from './tasks/tasks.js';

function createTasks(): { [taskName: string]: Task } {
  const clean = new CleanTask();
  const build = new BuildTask();
  const serve = new ServeTask();
  const watch = new WatchTask();
  const serveWatch = new ParallelTasks('serve+watch', [serve, watch], false);
  const dev = new SerialTasks('dev', [build, serveWatch]);

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

  constructor() {
    this.tasks = createTasks();
  }

  runTask(taskName: string): Promise<Task> {
    const task: Task = this.tasks[taskName];

    if (!task) {
      throw new Error('Task not defined: ' + taskName);
    }

    return task.invoke();
  }
}
