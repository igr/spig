import cssnano from 'cssnano';
import postcss from 'postcss';
import postcssAdvancedVariables from 'postcss-advanced-variables';
import postcssExtendRule from 'postcss-extend-rule';
import postCSSPresetEnv from 'postcss-preset-env';
import postcssPropertyLookup from 'postcss-property-lookup';
import postcssNested from 'postcss-nested';
import { FileRef } from '../file-reference.js';
import { SpigOperation } from '../spig-operation.js';

type Spig = import('../spig.js').Spig;

function processFile(spig: Spig, fileRef: FileRef): Promise<FileRef> {
  const content: string = fileRef.string;

  // POSTCSS
  const p = postcss
    .default()
    .use(postcssExtendRule)
    .use(postcssAdvancedVariables)
    .use(postCSSPresetEnv)
    .use(postcssPropertyLookup())
    .use(postcssNested);

  if (fileRef.cfg.site.build.production) {
    const cssProcessor = cssnano({
      preset: ['default', fileRef.cfg.libs.cssnano],
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
