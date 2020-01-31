import cssnano from 'cssnano';
import postcss from 'postcss';
import precss from 'precss';
import cssnext from 'postcss-cssnext';
import * as SpigConfig from '../spig-config';
import { FileRef } from '../file-reference';
import { SpigOperation } from '../spig-operation';

type Spig = import('../spig').Spig;

function processFile(spig: Spig, fileRef: FileRef): Promise<FileRef> {
  const content: string = fileRef.string;

  // POSTCSS
  const p = postcss()
    .use(precss())
    .use(cssnext);

  if (SpigConfig.site.build.production) {
    p.use(
      cssnano({
        preset: ['default', SpigConfig.config.cssnano],
      })
    );
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
      fileRef.string = result.css;

      if (result.map) {
        spig.addFile(fileRef.out + '.map', result.map.toString());
      }

      return fileRef;
    });
}

export const operation: (spig: Spig) => SpigOperation = (spig: Spig) => {
  return new SpigOperation('precss', (fileRef: FileRef) => processFile(spig, fileRef));
};
