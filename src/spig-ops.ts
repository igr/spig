// eslint-disable-next-line max-classes-per-file
import { SpigOperation } from './spig-operation';
import * as SpigConfig from './spig-config';

import { collect } from './ops/collect';
import { operation as excerpt } from './ops/excerpt';
import { operation as frontmatter } from './ops/frontmatter';
import { operation as htmlMinify } from './ops/htmlMinify';
import { operation as imageMinify } from './ops/imageMinify';
import { operation as initPage } from './ops/initPage';
import { operation as js } from './ops/js';
import { operation as merge } from './ops/merge';
import { operation as permalinks } from './ops/permalinks';
import { operation as readingtime } from './ops/readingtime';
import { operation as rename, PathElements } from './ops/rename';
import { operation as render } from './ops/render';
import { operation as resizeImage } from './ops/resizeImage';
import { operation as sass } from './ops/sass';
import { operation as slugish } from './ops/slugish';

type Spig = import('./spig').Spig;
type FileRef = import('./file-reference').FileRef;

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
    const op = new (class extends SpigOperation {
      constructor() {
        super(name);
        super.onFile = operation;
      }
    })();
    return this.op(op);
  }

  // functions
  // todo svima napravi options

  frontmatter(): SpigOps {
    return this.op(frontmatter());
  }

  initPage(): SpigOps {
    return this.op(initPage());
  }

  permalinks(): SpigOps {
    return this.op(permalinks());
  }

  slugish(): SpigOps {
    return this.op(slugish());
  }

  /**
   * Collects pages by given attribute name and create page per attribute.
   */
  collect(attribute: string): SpigOps {
    return this.do('collect pages', fileRef => collect(this.spig, fileRef, attribute, true));
  }

  /**
   *
   * Collects pages by given attribute name, but don't generate pages per attributes.
   */
  collectAttr(attribute: string): SpigOps {
    return this.do('collect pages', fileRef => collect(this.spig, fileRef, attribute, false));
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
    return this.initPage()
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
