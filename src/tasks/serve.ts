import express from 'express';
import serveStatic from 'serve-static';
import * as log from '../log.js';
import { SpigCtx } from '../ctx.js';
import { Task } from '../task.js';

export class ServeTask extends Task {
  constructor(ctx: SpigCtx) {
    super('serve', ctx, false);
  }

  run(): Promise<Task> {
    const dev = this.ctx.config.dev;

    const app = express();

    app.use(serveStatic(dev.outDir));

    app.listen(dev.server.port, dev.server.hostname, (): void => {
      log.info(`Server started at http://${dev.server.hostname}:${dev.server.port}`);
    });

    return Promise.resolve(this);
  }
}
