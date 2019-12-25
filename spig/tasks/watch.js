"use strict";

const dev = require('../spig-config').dev;
const bs = require('browser-sync').create();

module.exports = (watches) => {
  bs.init({
    server: dev.outDir,
    open: false,
    watchOptions: {
      ignoreInitial: true,
      ignored: '.DS_Store'
    }
  });

  watches.forEach(w => {
    bs.watch(w.files)
      .on("change", () => {
        w.task();
        bs.reload();
      });
  });
};

