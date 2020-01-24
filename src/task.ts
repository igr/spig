import { performance } from 'perf_hooks';
import * as log from './log';

export abstract class Task {
  private startTime = 0;

  protected constructor(
    readonly name: string,
    readonly logTask: boolean = true,
    readonly noBuildRequired: boolean = false
  ) {}

  start(): void {
    if (this.logTask) {
      log.task(this.name);
    }
    this.startTime = performance.now();
  }

  abstract run(): Promise<Task>;

  end(): void {
    if (this.logTask) {
      log.totalTime(this.name, performance.now() - this.startTime);
    }
  }

  invoke(): Promise<Task> {
    this.start();
    return this.run()
      .then(() => this.end())
      .then(() => this);
  }
}
