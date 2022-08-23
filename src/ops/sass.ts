import Path from 'path';
import sass from 'sass';
import cssnano from 'cssnano';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { FileRef } from '../file-reference.js';
import { SpigOperation } from '../spig-operation.js';

type Spig = import('../spig.js').Spig;

function processFile(spig: Spig, fileRef: FileRef): Promise<FileRef> {
  // SASS -> CSS

  const cssResult = sass.renderSync({
    data: fileRef.string,
    includePaths: [Path.dirname(fileRef.src ?? '.')],
    sourceMap: true,
  });

  const content: Buffer = cssResult.css;

  // POSTCSS
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore DEFAULT ISSUE
  const p: postcss.Processor = postcss().use(autoprefixer);

  if (fileRef.cfg.site.build.production) {
    const cssProcessor = cssnano({
      preset: ['default', fileRef.cfg.libs.cssnano],
    });

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
