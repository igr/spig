"use strict";

const SpigConfig = require('./spig-config');
const Meta = require('./meta');
const Path = require('path');


// system debug errors
process.on('warning', e => console.warn(e.stack));
require('events').EventEmitter.prototype._maxListeners = 100;

// functions

const fn_nunjucks = require('./fns/nunjucks');
const fn_frontmatter = require('./fns/frontmatter');
const fn_markdown = require('./fns/markdown');
const fn_debug = require('./fns/debug');
const fn_initPage = require('./fns/initpage');
const fn_initAsset = require('./fns/initasset');
const fn_folderize = require('./fns/folderize');
const fn_slugish = require('./fns/slugish');
const fn_renameExt = require('./fns/renameExtension');

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
   * Process files with given function.
   */
  withFiles(fn) {
    fn(this.files);
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

  /**
   * @see fn_frontmatter
   */
  frontmatter(attributes = {}) {
    return this.use((file) => fn_frontmatter(file, attributes));
  }

  /**
   * @see fn_debug
   */
  debug() {
    return this.use(fn_debug);
  }

  initPage() {
    return this.use(fn_initPage);
  }

  initAsset() {
    return this.use(fn_initAsset);
  }

  /**
   * @see fn_folderize
   */
  folderize() {
    return this.use(fn_folderize);
  }

  slugish() {
    return this.use(fn_slugish);
  }

  // --- renames ---

  /**
   * @see fn_renameExt
   */
  as(extension) {
    return this.use((file) => {
      fn_renameExt(file, extension);
    })
  }

  /**
   * @see as
   */
  asHtml() {
    return this.as('.html');
  }

  // --- render & template ---

  /**
   * Shortcut for common initialization.
   */
  init() {
    return this.initPage()
      .folderize()
      .frontmatter()
      .slugish()
      .asHtml()
  }

  /**
   * Renders a file using render engine determined by its extension.
   */
  render() {
    return this.use((file) => {
      const ext = Path.extname(file.path);
      switch (ext) {
        case '.njk':
          fn_nunjucks.render(file);
          break;
        case '.md':
          fn_markdown(file);
          break;
      }
    });
  }

  /**
   * Applies a template using template engine determined by layout extension.
   */
  template() {
    return this.use((file) => {
      const layout = Meta.attr(file, 'layout');
      const ext = Path.extname(layout);
      switch (ext) {
        case '.njk':
          fn_nunjucks.apply(file, layout);
          break;
        default:
          throw new Error("Unknown template engine.");
      }
    });
  }
}

module.exports = Spig;
