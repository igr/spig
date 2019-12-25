"use strict";

const SpigConfig = require('./spig-config');
const SpigFiles = require('./spig-files');
const SpigVersion = require('./spig-version');
const LayoutResolver = require('./layout-resolver');
const TaskRunner = require('./task-runner');
const Path = require('path');
const glob = require('glob');
const log = require('fancy-log');
const chalk = require('chalk');
const micromatch = require('micromatch');

// system debug errors

process.on('warning', e => console.warn(e.stack));
require('events').EventEmitter.prototype._maxListeners = 100;

// functions

const fn_frontmatter = require('./phase1/frontmatter');
const fn_permalinks = require('./phase1/permalinks');
const fn_slugish = require('./phase1/slugish');
const fn_rename = require('./phase1/rename');
const fn_render_nunjucks = require('./phase2/render-nunjucks');
const fn_template_nunjucks = require('./phase2/template-nunjucks');
const fn_render_markdown = require('./phase2/render-markdown');
const fn_imageMinify = require('./phase2/imageMinify');
const fn_htmlMinify = require('./phase2/htmlMinify');
const fn_excerpt = require('./phase2/excerpt');
const fn_collect = require('./phase1/collect');
const fn_readingtime = require('./phase1/readingtime');


log(chalk.bgHex("0xF74B00").black(` -=[Spig v${SpigVersion}]=- `));

SpigConfig.configureEngines();

let PHASES = [];

class Spig {

  /**
   * Creates new instance of Spig on give file set.
   */
  static on(files) {
    return new Spig(files);
  }

  /**
   * Predefines phases order.
   */
  static phases(arr) {
    if (!arr) {
      return PHASES;
    }
    PHASES = arr;
  }

  constructor(files) {
    const dev = SpigConfig.dev;
    this.tasks = {};
    this.out = dev.outDir;
    //this.dev = process.env.NODE_ENV !== 'production';

    this.tasks = {};
    for (const p of PHASES) {
      this.tasks[p] = [];
    }

    let filePatterns;

    if (Array.isArray(files)) {
      for (let i = 0; i < files.length; ++i) {
        const f = files[i];
        files[i] = dev.srcDir + dev.dirSite + f;
      }
      filePatterns = files;
    } else {
      filePatterns = [dev.srcDir + dev.dirSite + files];
    }

    // file names
    this.allFiles = [];
    for (const pattern of filePatterns) {
      this.allFiles = this.allFiles.concat(glob.sync(pattern));
    }

    this.load();
  }

  load() {
    for (const fileName of this.allFiles) {
      this.addFile(fileName);
    }

  }

  /**
   * Starts the current phase definition.
   * If phase is not register it will be added to the end of phases!
   */
  _(val) {
    if (!this.tasks[val]) {
      this.tasks[val] = [];
      PHASES.push(val);
    }
    this.currentPhase = val;
    return this;
  }

  /**
   * Adds a real or virtual (i.e. synthetic) file.
   */
  addFile(fileName, value) {
    if (value) {
      const fo = SpigFiles.createFileObject(fileName, {virtual: true});
      fo.spig = this;
      fo.contents = value;
      return fo;
    }

    const fo = SpigFiles.createFileObject(fileName);
    fo.spig = this;
    return fo;
  }

  /**
   * Allows to do additional computation on site.
   */
  with(fn) {
    fn(this, SpigConfig.site);
    return this;
  }

  /**
   * Uses generic function to manipulate files.
   */
  use(fn) {
    this.tasks[this.currentPhase].push(fn);
    return this;
  }

  /**
   * Iterate all tasks of given phase.
   */
  forEachTask(phase, fn) {
    const tasks = this.tasks[phase];
    if (tasks) {
      tasks.forEach(fn);
    }
    return this;
  }

  // --- function commands ---

  /**
   * @see fn_frontmatter
   */
  frontmatter(attributes = {}) {
    return this.use((file) => fn_frontmatter(file, attributes));
  }

  initPage() {
    return this.use((file) => file.page = true);
  }

  initAsset() {
    return this.use((file) => file.page = false);
  }

  /**
   * @see fn_permalinks
   */
  permalinks() {
    return this.use((file) => fn_permalinks(file));
  }

  /**
   * @see fn_slugish
   */
  slugish() {
    return this.use((file) => fn_slugish(file));
  }

  /**
   * Collects pages by given attribute name and create page per attribute.
   */
  collect(attribute) {
    return this.use((file) => fn_collect(this, file, attribute, true));
  }

  /**
   *
   * Collects pages by given attribute name, but don't generate pages per attributes.
   */
  collectAttr(attribute) {
    return this.use((file) => fn_collect(this, file, attribute, false));
  }

  /**
   * @see fn_imageMinify
   */
  imageMinify(options) {
    if (!SpigConfig.site.production) {
      return this;
    }
    return this.use((file) => fn_imageMinify(file, options));
  }


  // --- renames ---

  /**
   * @see fn_renameExt
   */
  rename(fn) {
    return this.use((file) => fn_rename(file, fn));
  }

  /**
   * Renames extension to HTML.
   */
  asHtml() {
    return this.rename(path => path.extname = '.html');
  }

  // --- render & template ---

  /**
   * Shortcut for common page initialization.
   */
  pageCommon() {
    return this
      .initPage()
      .permalinks()
      .frontmatter()
      .slugish()
      .asHtml()
      ;
  }

  /**
   * Shortcut for common asset initialization.
   */
  assetCommon() {
    return this
      .initAsset()
      .slugish()
      ;
  }

  /**
   * Renders a file using render engine determined by its extension.
   */
  render() {
    return this.use((file) => {

      if (!micromatch.isMatch(file.path, SpigConfig.dev.render)) {
        return;
      }

      const ext = Path.extname(file.path);
      switch (ext) {
        case '.njk':
          fn_render_nunjucks(file);
          break;
        case '.md':
          fn_render_markdown(file);
          break;
      }
    });
  }

  /**
   * Applies a template using template engine determined by layout extension.
   */
  applyTemplate() {
    return this.use((file) => {
      const layout = LayoutResolver(file);

      const ext = Path.extname(layout);
      switch (ext) {
        case '.njk':
          fn_template_nunjucks(file, layout);
          break;
        default:
          throw new Error("Unknown template engine for " + ext);
      }
    });
  }

  /**
   * Minifies the HTML content.
   * @see fn_htmlMinify
   */
  htmlMinify(options) {
    if (!SpigConfig.site.production) {
      return this;
    }
    return this.use(file => fn_htmlMinify(file, options));
  }

  /**
   * Reads summary.
   */
  summary() {
    return this.use(file => fn_excerpt(file));
  }

  /**
   * Adds reading time information in the `readingTime` attribute.
   */
  readingTime() {
    return this.use(file => fn_readingtime(file));
  }


  static run() {
    const taskRunner = new TaskRunner(this.phases());
    let taskName = undefined;

    const args = process.argv.slice(2);
    if (args.length !== 0) {
      taskName = args[0];
    }
    taskRunner.runTask(taskName);
  }

}

module.exports = Spig;
