import express from 'express';
import serveStatic from 'serve-static';
import * as log from '../log';
import * as SpigConfig from '../spig-config';

function serverInitFunction(): void {
  const dev = SpigConfig.dev;

  log.info(`Server started at http://${dev.server.hostname}:${dev.server.port}`);
}

export function taskServe(): void {
  log.task('serve');

  const dev = SpigConfig.dev;

  const app = express();

  app.use(serveStatic(dev.outDir));

  app.listen(dev.server.port, dev.server.hostname, serverInitFunction);
}
