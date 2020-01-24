import slugify from 'slugify';
import * as SpigConfig from './spig-config';
import { SpigOperation } from './spig-operation';

type Spig = import('./spig').Spig;
type FileRef = import('./file-reference').FileRef;

// OPERATIONS are loaded lazy

let opExcerpt: () => SpigOperation;
function excerpt(): SpigOperation {
  if (!opExcerpt) {
    opExcerpt = require('./ops/excerpt').operation;
  }
  return opExcerpt();
}

let opFrontmatter: () => SpigOperation;
function frontmatter(): SpigOperation {
  if (!opFrontmatter) {
    opFrontmatter = require('./ops/frontmatter').operation;
  }
  return opFrontmatter();
}

let opHtmlMinify: () => SpigOperation;
function htmlMinify(): SpigOperation {
  if (!opHtmlMinify) {
    opHtmlMinify = require('./ops/htmlMinify').operation;
  }
  return opHtmlMinify();
}

let opImageMinify: (options: object) => SpigOperation;
function imageMinify(options: object): SpigOperation {
  if (!opImageMinify) {
    opImageMinify = require('./ops/imageMinify').operation;
  }
  return opImageMinify(options);
}

let opCollect: (singular: string, plural: string) => SpigOperation;
function collect(singular: string, plural: string): SpigOperation {
  if (!opCollect) {
    opCollect = require('./ops/collect').operation;
  }
  return opCollect(singular, plural);
}

let opGroup: (attrName: string, attrsOf: (attrValue: string, files: FileRef[]) => object) => SpigOperation;
function group(attrName: string, attrsOf: (attrValue: string, files: FileRef[]) => object): SpigOperation {
  if (!opGroup) {
    opGroup = require('./ops/group').operation;
  }
  return opGroup(attrName, attrsOf);
}

let opJs: () => SpigOperation;
function js(): SpigOperation {
  if (!opJs) {
    opJs = require('./ops/js').operation;
  }
  return opJs();
}

let opMerge: (spig: Spig, bundleAggregatorFn: (fileRef: FileRef) => string | undefined) => SpigOperation;
function merge(spig: Spig, bundleAggregatorFn: (fileRef: FileRef) => string | undefined): SpigOperation {
  if (!opMerge) {
    opMerge = require('./ops/merge').operation;
  }
  return opMerge(spig, bundleAggregatorFn);
}

let opPermalinks: () => SpigOperation;
function permalinks(): SpigOperation {
  if (!opPermalinks) {
    opPermalinks = require('./ops/permalinks').operation;
  }
  return opPermalinks();
}

let opReadingtime: () => SpigOperation;
function readingtime(): SpigOperation {
  if (!opReadingtime) {
    opReadingtime = require('./ops/readingtime').operation;
  }
  return opReadingtime();
}

let opRename: (renameFn: (parsedPath: PathElements) => void) => SpigOperation;
type PathElements = import('./ops/rename').PathElements;
function rename(renameFn: (parsedPath: PathElements) => void): SpigOperation {
  if (!opRename) {
    opRename = require('./ops/rename').operation;
  }
  return opRename(renameFn);
}

let opRender: () => SpigOperation;
function render(): SpigOperation {
  if (!opRender) {
    opRender = require('./ops/render').operation;
  }
  return opRender();
}

let opResizeImage: (spig: Spig) => SpigOperation;
function resizeImage(spig: Spig): SpigOperation {
  if (!opResizeImage) {
    opResizeImage = require('./ops/resizeImage').operation;
  }
  return opResizeImage(spig);
}

let opSass: (spig: Spig) => SpigOperation;
function sass(spig: Spig): SpigOperation {
  if (!opSass) {
    opSass = require('./ops/sass').operation;
  }
  return opSass(spig);
}

let opSlugish: () => SpigOperation;
function slugish(): SpigOperation {
  if (!opSlugish) {
    opSlugish = require('./ops/slugish').operation;
  }
  return opSlugish();
}

export class SpigOps {
  private readonly registerPhaseOp: (op: SpigOperation) => void;

  private readonly spig: Spig;

  constructor(spig: Spig, registerPhaseOp: (op: SpigOperation) => void) {
    this.spig = spig;
    this.registerPhaseOp = registerPhaseOp;
  }

  /**
   * Delegates to SPIG, so we can continue with the fluent interface.
   */
  _(phaseName: string): SpigOps {
    return this.spig._(phaseName);
  }

  /**
   * Defines single operation on current set of files.
   */
  op(operation: SpigOperation): SpigOps {
    this.registerPhaseOp(operation);
    return this;
  }

  /**
   * Defines single operation as a fileref consumer function.
   */
  do(name: string, operation: (fileRef: FileRef) => void): SpigOps {
    return this.op(SpigOperation.of(name, operation));
  }

  // operations

  frontmatter(): SpigOps {
    return this.op(frontmatter());
  }

  initPage(): SpigOps {
    return this.mark('page');
  }

  mark(attrName: string): SpigOps {
    return this.do(`mark: ${attrName}`, fileRef => fileRef.setAttr(attrName, true));
  }

  collect(singular: string, plural?: string): SpigOps {
    return this.op(collect(singular, plural ?? `${singular}s`));
  }

  group(
    attrName: string,
    attrsOf: (attrValue: string, files: FileRef[]) => object = () => {
      return {};
    }
  ): SpigOps {
    return this.op(group(attrName, attrsOf));
  }

  permalinks(): SpigOps {
    return this.op(permalinks());
  }

  slugish(): SpigOps {
    return this.op(slugish());
  }

  /**
   * Collects and group tags.
   */
  tags(): SpigOps {
    return this.group('tag', (attrValue, files: FileRef[]) => {
      const attrName = 'tag';

      const fileName = `/${slugify(attrName)}/${slugify(String(attrValue))}/index.html`;
      const attrFile = this.spig.addFile(fileName, attrValue);

      const result = {
        page: true,
        title: `${attrName}: ${attrValue}`,
        layout: attrName,
        group: files.map(fileRef => fileRef.context()),
      };

      attrFile.setAttrsFrom(result);

      return result;
    });
  }

  imageMinify(options = {}): SpigOps {
    if (!SpigConfig.site.build.production) {
      return this;
    }
    return this.op(imageMinify(options));
  }

  // --- renames ---

  rename(fn: (path: PathElements) => void): SpigOps {
    return this.op(rename(fn));
  }

  asHtml(): SpigOps {
    return this.rename(path => {
      path.extname = '.html';
    });
  }

  // --- render & template ---

  /**
   * Shortcut for common page initialization.
   */
  pageCommon(): SpigOps {
    return this.mark('page')
      .collect('page')
      .permalinks()
      .frontmatter()
      .slugish()
      .asHtml();
  }

  /**
   * Shortcut for common asset initialization.
   */
  assetCommon(): SpigOps {
    return this.slugish();
  }

  /**
   * Renders a file using render engine determined by its extension.
   */
  render(): SpigOps {
    return this.op(render());
  }

  /**
   * Applies a template using template engine determined by layout extension.
   */
  applyTemplate(): SpigOps {
    return this.op(require('./ops/template').operation());
  }

  htmlMinify(): SpigOps {
    if (!SpigConfig.site.build.production) {
      return this;
    }
    return this.op(htmlMinify());
  }

  summary(): SpigOps {
    return this.op(excerpt());
  }

  readingTime(): SpigOps {
    return this.op(readingtime());
  }

  resizeImage(): SpigOps {
    return this.op(resizeImage(this.spig));
  }

  sass(): SpigOps {
    return this.op(sass(this.spig));
  }

  merge(bundleAggregatorFn: (fileRef: FileRef) => string | undefined): SpigOps {
    return this.op(merge(this.spig, bundleAggregatorFn));
  }

  js(): SpigOps {
    return this.op(js());
  }
}
