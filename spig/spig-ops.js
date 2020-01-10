"use strict";

const SpigConfig = require('./spig-config');
const SpigOperation = require('./spig-operation');

const collect = require('./ops/collect');

class SpigOps {
  constructor(spig, registerPhaseOp) {
    this.spig = spig;
    this.registerPhaseOp = registerPhaseOp;
  }

  /**
   * Delegates to SPIG, so we can continue with the fluent interface.
   */
  _(val) {
    return this.spig._(val);
  }

  /**
   * Defines single operation on current set of files.
   * You can pass either a SpigOperation or a single function.
   */
  do(operation, name) {
    if (!(operation instanceof SpigOperation)) {
      operation = SpigOperation.named(name).onFile(operation);
    }
    this.registerPhaseOp(operation);
    return this;
  }

  // functions

  frontmatter(attributes = {}) {
    return this.do(require('./ops/frontmatter').operation(attributes));
  }

  initPage() {
    return this.do(require('./ops/initPage').operation(this.spig));
  }

  permalinks() {
    return this.do(require('./ops/permalinks').operation());
  }

  slugish() {
    return this.do(require('./ops/slugish').operation());
  }

  /**
   * Collects pages by given attribute name and create page per attribute.
   */
  collect(attribute) {
    return this.do(fileRef => collect(this.spig, fileRef, attribute, true), "collect pages");
  }

  /**
   *
   * Collects pages by given attribute name, but don't generate pages per attributes.
   */
  collectAttr(attribute) {
    return this.do(fileRef => collect(this.spig, fileRef, attribute, false), "collect pages");
  }

  imageMinify(options) {
    if (!SpigConfig.site.build.production) {
      return this;
    }
    return this.do(require('./ops/imageMinify').operation(options));
  }


  // --- renames ---

  rename(fn) {
    return this.do(require('./ops/rename').operation(fn));
  }

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
      .slugish()
      ;
  }

  /**
   * Renders a file using render engine determined by its extension.
   */
  render() {
    return this.do(require('./ops/render').operation());
  }

  /**
   * Applies a template using template engine determined by layout extension.
   */
  applyTemplate() {
    return this.do(require('./ops/template').operation());
  }

  htmlMinify(options) {
    if (!SpigConfig.site.build.production) {
      return this;
    }
    return this.do(require('./ops/htmlMinify').operation(options));
  }

  summary() {
    return this.do(require('./ops/excerpt').operation());
  }

  readingTime() {
    return this.do(require('./ops/readingtime').operation());
  }

  resizeImage(options) {
    return this.do(require('./ops/resizeImage').operation(this.spig, options));
  }

  sass() {
    return this.do(require('./ops/sass').operation(this.spig));
  }

  merge(bundleAggregatorFn) {
    return this.do(require('./ops/merge').operation(this.spig, bundleAggregatorFn));
  }

  js(options) {
    return this.do(require('./ops/js').operation(options));
  }

}

module.exports = SpigOps;
