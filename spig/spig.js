"use strict";

const SpigConfig = require('./spig-config');
const Meta = require('./meta');
const Path = require('path');

const spigs = [];
const nunjucks = require('./fns/nunjucks');

// debug errors
process.on('warning', e => console.warn(e.stack));
require('events').EventEmitter.prototype._maxListeners = 100;

class Spig {

  /* iterates all SPIGs definitions */
  static forEach(fn) {
    spigs.forEach(fn);
  }

  static on(files) {
    const s = new Spig(files);
    spigs.push(s);
    return s;
  }

  constructor(files) {
    if (Array.isArray(files)) {
      this.files = files;
      const len = files.length;
      for (let i = 0; i < len; ++i) {
        const f = files[i];
        files[i] =
          SpigConfig.site().srcDir +
          SpigConfig.site().dirSite +
          f;
      }
    } else {
      this.files = [
        SpigConfig.site().srcDir +
        SpigConfig.site().dirSite +
        files
      ];
    }
    this.out = SpigConfig.site().outDir;
    this.tasks = [];
    this.dev = process.env.NODE_ENV !== 'production';
  }

  /**
   * Uses generic function to manipulate files.
   */
  use(fn) {
    this.tasks.push(fn);
    return this;
  }

  /**
   * Defines custom out folder.
   */
  out(folder) {
    this.out = spigConfig.site().outDir + folder;
    return this;
  }

  /**
   * Process files with given function.
   */
  withFiles(fn) {
    fn(this.files);
    return this;
  }

  withOut(fn) {
    fn(this.out);
    return this;
  }

  /**
   * Iterate all tasks.
   */
  forEachTask(fn) {
    this.tasks.forEach(fn);
    return this;
  }

  // --- function commands ---

  frontmatter(attributes = {}) {
    const frontmatter = require('./fns/frontmatter');
    return this.use((file) => frontmatter(file, attributes));
  }

  renderMarkdown() {
    const markdown = require('./fns/markdown');
    return this.use(markdown);
  }

  renderNunjucks() {
    return this.use((file) => nunjucks.render(file));
  }

  debug() {
    const debug = require('./fns/debug');
    return this.use(debug);
  }

  initPage() {
    const initPage = require('./fns/initpage');
    return this.use(initPage);
  }

  initAsset() {
    const initAsset = require('./fns/initasset');
    return this.use(initAsset);
  }

  folderize() {
    const folderize = require('./fns/folderize');
    return this.use(folderize);
  }

  render() {
    return this.use((file) => {
      const ext = Path.extname(file.path);
      switch (ext) {
        case '.njk':
          nunjucks.render(file);
          break;
        case '.md':
          const markdown = require('./fns/markdown');
          markdown(file);
          break;
      }
    });
  }

  template() {
    return this.use((file) => {
      const layout = Meta.attrOrMeta(file, 'layout');
      const ext = Path.extname(layout);
      switch (ext) {
        case '.njk':
          const nunjucks = require('./fns/nunjucks');
          nunjucks.apply(file, layout);
          break;
        default:
          throw new Error("Unknown template engine.");
      }
    });
  }
}

module.exports = Spig;
