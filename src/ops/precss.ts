import cssnano from 'cssnano';
import postcss from 'postcss';
import precss from 'precss';
import postCSSPresetEnv from 'postcss-preset-env';
import { ctx } from '../ctx';
import { FileRef } from '../file-reference';
import { SpigOperation } from '../spig-operation';

type Spig = import('../spig').Spig;

function processFile(spig: Spig, fileRef: FileRef): Promise<FileRef> {
  const content: string = fileRef.string;

  // POSTCSS
  const p = postcss().use(precss()).use(postCSSPresetEnv);

  if (ctx.config.site.build.production) {
    const cssProcessor = cssnano({
      preset: ['default', ctx.config.libs.cssnano],
    });

    p.use(cssProcessor);
  }

  return p
    .process(content, {
      from: fileRef.name,
      map: {
        inline: false,
        annotation: true,
      },
    })
    .then((result) => {
      fileRef.string = result.css;

      if (result.map) {
        const cssMap = JSON.parse(result.map.toString());
        cssMap.sources = [`${fileRef.name}`];
        spig.addFile(fileRef.out + '.map', JSON.stringify(cssMap));
      }

      return fileRef;
    });
}

export const operation: (spig: Spig) => SpigOperation = (spig: Spig) => {
  return new SpigOperation('precss', (fileRef: FileRef) => processFile(spig, fileRef));
};
