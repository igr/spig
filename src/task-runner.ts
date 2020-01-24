import { Task } from './task';
import { CleanTask } from './tasks/clean';
import { ServeTask } from './tasks/serve';
import { BuildTask } from './tasks/build';
import { WatchTask } from './tasks/watch';
import { ParallelTasks, SerialTasks } from './tasks/tasks';

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

const tasks: { [taskName: string]: Task } = createTasks();

export class TaskRunner {
  /**
   * Short tasks don't require the SPIG definition loaded.
   * todo Rename!
   */
  static isRapidTask(taskName: string): boolean {
    const task: Task = tasks[taskName];
    if (!task) {
      throw new Error('Task not defined: ' + taskName);
    }
    return task.noBuildRequired;
  }

  runTask(taskName: string): Promise<Task> {
    const task: Task = tasks[taskName];

    if (!task) {
      throw new Error('Task not defined: ' + taskName);
    }

    return task.invoke();
  }
}
