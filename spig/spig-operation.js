"use strict";

class SpigOperation {

  static named(name) {
    return new SpigOperation(name);
  }

  constructor(name) {
    this.name = name;
    this.startHandler = undefined;
    this.fileHandler = undefined;
    this.endHandler = undefined;
  }

  onStart(handler) {
    this.startHandler = handler;
    return this;
  }

  onFile(handler) {
    this.fileHandler = handler;
    return this;
  }

  onEnd(handler) {
    this.endHandler = handler;
    return this;
  }

  // RUN

  runOnStart() {
    if (this.startHandler) {
      this.startHandler();
    }
  }

  runOnFile(fileRef) {
    if (this.fileHandler) {
      return this.fileHandler(fileRef);
    }
  }

  runOnEnd() {
    if (this.endHandler) {
      this.endHandler();
    }
  }

}

module.exports = SpigOperation;

