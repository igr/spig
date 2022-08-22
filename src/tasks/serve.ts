import express from 'express';
import serveStatic from 'serve-static';
import * as log from '../log.js';
import { ctx } from '../ctx.js';
import { Task } from '../task.js';

function serverInitFunction(): void {
  const dev = ctx.config.dev;

  log.info(`Server started at http://${dev.server.hostname}:${dev.server.port}`);
}

export class ServeTask extends Task {
  constructor() {
    super('serve', false);
  }

  run(): Promise<Task> {
    const dev = ctx.config.dev;

    const app = express();

    app.use(serveStatic(dev.outDir));

    app.listen(dev.server.port, dev.server.hostname, serverInitFunction);

    return Promise.resolve(this);
  }
}
