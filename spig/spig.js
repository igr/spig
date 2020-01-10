"use strict";

const ctx = require('./ctx');
const SpigConfig = require('./spig-config');
const SpigInit = require('./spig-init');
const SpigFiles = require('./spig-files');
const SpigOps = require('./spig-ops');
const TaskRunner = require('./task-runner');

// system debug errors

process.on('warning', e => console.warn(e.stack));
require('events').EventEmitter.prototype._maxListeners = 100;

// start

SpigInit.initDevConfig();
SpigInit.initSiteConfig();
SpigInit.initOpsConfig();
SpigInit.initData();
SpigInit.initProductionMode();
SpigInit.initEngines();   // todo when not rapid task only?

/**
 * SPIG folders.
 */
class SpigDef {

  constructor() {
    this.files = '/**/*';
    this.srcDir = SpigConfig.dev.dir.site;
    this.destDir = '/';
  }

  on(pattern) {
    this.files = pattern;
    return this;
  }

  from(srcDir) {
    this.srcDir = srcDir;
    return this;
  }

  to(destDir) {
    this.destDir = destDir;
    return this;
  }

  filter(filter) {
    this.filesFilter = filter;
    return this;
  }
}

/**
 * Spig defines operations on one set of files. Simple as that.
 * Operations are grouped and executed in phases, allowing
 * synchronization between different parts of the process.
 */
class Spig {

  /**
   * Creates new Spig with given SPIG definition.
   */
  static of(spigDefConsumer) {
    const spigDef = new SpigDef();
    spigDefConsumer(spigDef);
    return new Spig(spigDef);
  }

  /**
   * Creates new Spig on given file set and default folders.
   */
  static on(files) {
    return new Spig(new SpigDef().on(files));
  }

  /**
   * Pre-defines phases order. By default, phases are
   * ordered as they appear in the file. With this method
   * you can set the custom order. Any missing phase defined later
   * will be appended and executed after these ones.
   */
  static phases(phasesArray) {
    phasesArray.forEach(phase => PHASES.push(phase));
  }

  constructor(spigDef) {
    this.def = spigDef;
    this.files = new SpigFiles(this);
    ctx.SPIGS.push(this);
  }

  /**
   * Resets all the files in this SPIG.
   */
  reset() {
    this.files.removeAllFiles();
    this.files = new SpigFiles(this);
  }


  /**
   * Starts the phase definition.
   * If phase is not register it will be added to the end of phases!
   */
  _(phaseName) {
    if (!ctx.OPS[phaseName]) {
      ctx.OPS[phaseName] = [];
      ctx.PHASES.push(phaseName);
    }
    return new SpigOps(this, (op) => {
      ctx.OPS[phaseName].push({
        spig: this,
        operation: op
      })
    });
  }

  /**
   * Adds a real or virtual file to this Spig.
   * @param fileName relative file name from the root
   * @param content optional file content. If provided, file reference will be syntactics.
   */
  addFile(fileName, content) {
    return this.files.addFile(fileName, content);
  }

  /**
   * Removed a file from the SPIG.
   */
  removeFile(fileRef) {
    this.files.removeFile(fileRef);
  }

  /**
   * Iterates all the files.
   */
  forEachFile(fileRefConsumer) {
    this.files.files.forEach(fileRefConsumer);
  }

  /**
   * Allows to do additional computation on this spig.
   */
  with(fn) {
    fn(this);
    return this;
  }

  /**
   * Runs all SPIG tasks :)
   */
  static run() {
    new TaskRunner().runTask(ctx.ARGS.taskName);
  }

  /**
   * Default SPIG "HELLO" phase.
   */
  static hello() {
    if (TaskRunner.isRapidTask(ctx.ARGS.taskName)) {
      return;
    }
    const hello = require('./hello');
    hello.static();
    hello.sass();
    hello.images();
    hello.js();
    hello.jsBundles();
  };

  /**
   * Just a simple convenient method to return the global config.
   */
  config() {
    return SpigConfig;
  }

}

module.exports = Spig;
