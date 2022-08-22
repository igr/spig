import { performance } from 'perf_hooks';
import * as log from './log.js';
import { SpigCtx } from './ctx.js';

export abstract class Task {
  private startTime = 0;

  protected readonly ctx: SpigCtx;

  protected constructor(readonly name: string, readonly context: SpigCtx, readonly logTask: boolean = true) {
    this.ctx = context;
  }

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
