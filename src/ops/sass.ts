import * as Path from 'path';
import * as sass from 'node-sass';
import * as cssnano from 'cssnano';
import postcss from 'postcss';
import precss from 'precss';
import * as autoprefixer from 'autoprefixer';
import * as SpigConfig from '../spig-config';
import { FileRef } from '../file-reference';
import { SpigOperation } from '../spig-operation';

type Spig = import('../spig').Spig;

function processFile(spig: Spig, fileRef: FileRef): Promise<FileRef> {
  // SASS -> CSS

  // todo '??' oeprator svuda
  const cssResult = sass.renderSync({
    data: fileRef.string,
    includePaths: [Path.dirname(fileRef.src ?? '.')],
    sourceMap: true,
  });

  const content = cssResult.css;

  // POSTCSS

  const p = postcss()
    .use(precss)
    .use(autoprefixer);

  if (SpigConfig.site.build.production) {
    p.use(cssnano);
  }

  return p
    .process(content, {
      from: fileRef.name,
      map: {
        inline: false,
        annotation: true,
      },
    })
    .then(result => {
      fileRef.outExt('css');
      fileRef.string = result.css;

      if (result.map) {
        spig.addFile(fileRef.out + '.map', result.map.toString());
      }
      return fileRef;
    });
}

export function operation(spig: Spig): SpigOperation {
  return new (class extends SpigOperation {
    constructor() {
      super('sass');
      super.onFile = (fileRef: FileRef) => processFile(spig, fileRef);
    }
  })();
}
