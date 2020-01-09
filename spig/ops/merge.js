"use strict";

const SpigOperation = require('../spig-operation');

module.exports.operation = (spig, options) => {
  return SpigOperation
    .named('merge')
    .onStart(() => {
      this.content = "";
    })
    .onFile((fileRef) => {
      const data = fileRef.string();
      this.content += data;
      spig.removeFile(fileRef);
    })
    .onEnd(() => {
      spig.addFile(options.bundle, this.content);
    });
};

