import express from 'express';
import serveStatic from 'serve-static';
import * as log from '../log';
import { spigConfig } from '../ctx';
import { Task } from '../task';

function serverInitFunction(): void {
  const dev = spigConfig.dev;

  log.info(`Server started at http://${dev.server.hostname}:${dev.server.port}`);
}

export class ServeTask extends Task {
  constructor() {
    super('serve', false);
  }

  run(): Promise<Task> {
    const dev = spigConfig.dev;

    const app = express();

    app.use(serveStatic(dev.outDir));

    app.listen(dev.server.port, dev.server.hostname, serverInitFunction);

    return Promise.resolve(this);
  }
}
