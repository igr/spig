import Path from 'path';
import sass from 'node-sass';
import cssnano from 'cssnano';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import * as SpigConfig from '../spig-config';
import { FileRef } from '../file-reference';
import { SpigOperation } from '../spig-operation';

type Spig = import('../spig').Spig;

function processFile(spig: Spig, fileRef: FileRef): Promise<FileRef> {
  // SASS -> CSS

  const cssResult = sass.renderSync({
    data: fileRef.string,
    includePaths: [Path.dirname(fileRef.src ?? '.')],
    sourceMap: true,
  });

  const content: Buffer = cssResult.css;

  // POSTCSS
  const p = postcss().use(autoprefixer);

  if (SpigConfig.site.build.production) {
    const cssProcessor = cssnano({
      preset: ['default', SpigConfig.config.cssnano],
    });

    // @ts-ignore
    p.use(cssProcessor);
  }

  return p
    .process(content.toString(), {
      from: fileRef.name,
      map: {
        inline: false,
        annotation: `${fileRef.basename}.css.map`,
      },
    })
    .then((result) => {
      fileRef.outExt = 'css';
      fileRef.string = result.css;

      if (result.map) {
        const cssMap = JSON.parse(result.map.toString());
        cssMap.sources = [`${Path.basename(fileRef.out)}`];
        spig.addFile(fileRef.out + '.map', JSON.stringify(cssMap));
      }

      return fileRef;
    });
}

export const operation: (spig: Spig) => SpigOperation = (spig: Spig) => {
  return new SpigOperation('sass', (fileRef: FileRef) => processFile(spig, fileRef));
};
