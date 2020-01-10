"use strict";

const SpigConfig = require('../spig-config');
const bs = require('browser-sync').create();
const log = require('../log');
const ctx = require('../ctx');
const SpigRunner = require('../spig-runner');

module.exports = () => {
  log.task("watch");

  const dev = SpigConfig.dev;

  bs.init({
    server: dev.outDir,
    open: false,
    watchOptions: {
      ignoreInitial: true,
      ignored: '.DS_Store'
    }
  });

  ctx.forEachSpig(spig => {
    const filesToWatch = [];

    // collect all real, non-synthetic files
    spig.forEachFile(fr => {
      if (!fr.syntethic) {
        filesToWatch.push(fr.src);
      }
    });

    bs.watch(filesToWatch)
      .on("change", () => {
        log.notification("Change detected, rebuilding...");
        spig.reset();
        new SpigRunner([spig], ctx.PHASES, ctx.OPS).run().catch(e => log.error(e));
        bs.reload();
      });

  });

  log.info("Watching for changes...");

};

