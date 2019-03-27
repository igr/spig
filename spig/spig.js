"use strict";

const SpigConfig = require('./spig-config');
const Meta = require('./meta');
const Path = require('path');


// system debug errors
process.on('warning', e => console.warn(e.stack));
require('events').EventEmitter.prototype._maxListeners = 100;

// functions

const nunjucks = require('./fns/nunjucks');
const frontmatter = require('./fns/frontmatter');
const markdown = require('./fns/markdown');
const debug = require('./fns/debug');
const initPage = require('./fns/initpage');
const initAsset = require('./fns/initasset');
const folderize = require('./fns/folderize');
const slugish = require('./fns/slugish');

const spigs = [];

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
    this.out = SpigConfig.site().outDir + folder;
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
    return this.use((file) => frontmatter(file, attributes));
  }

  renderMarkdown() {
    return this.use(markdown);
  }

  renderNunjucks() {
    return this.use((file) => nunjucks.render(file));
  }

  debug() {
    return this.use(debug);
  }

  initPage() {
    return this.use(initPage);
  }

  initAsset() {
    return this.use(initAsset);
  }

  folderize() {
    return this.use(folderize);
  }

  slugish() {
    return this.use(slugish);
  }

  render() {
    return this.use((file) => {
      const ext = Path.extname(file.path);
      switch (ext) {
        case '.njk':
          nunjucks.render(file);
          break;
        case '.md':
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
          nunjucks.apply(file, layout);
          break;
        default:
          throw new Error("Unknown template engine.");
      }
    });
  }
}

module.exports = Spig;
