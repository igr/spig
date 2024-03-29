import sharp from 'sharp';
import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';

type Spig = import('../spig.js').Spig;

interface Modification {
  resizeFn: (buffer: Buffer) => sharp.Sharp;
  name: string;
}

function createModsFromFileNameSplit(split: string[]): Modification[] {
  if (split.length === 1) {
    return [];
  }

  const tasks = split.splice(1);
  const mods: Modification[] = [];

  for (const t of tasks) {
    let resizeFn: (buffer: Buffer) => sharp.Sharp;

    if (t.startsWith('w')) {
      resizeFn = (buffer) => sharp(buffer).resize({ width: parseInt(t.substr(1), 10) });
    } else if (t.startsWith('h')) {
      resizeFn = (buffer) => sharp(buffer).resize({ height: parseInt(t.substr(1), 10) });
    } else {
      throw new Error(`Unknown image mod name '${t}'`);
    }
    const name = t;

    mods.push({
      name,
      resizeFn,
    });
  }

  return mods;
}

function processFile(spig: Spig, fileRef: FileRef): Promise<FileRef> {
  const buffer = fileRef.buffer;

  const split = fileRef.basename.split('__');
  const basename = split[0];

  const mods = createModsFromFileNameSplit(split);

  const promises = mods.map((mod) =>
    mod
      .resizeFn(buffer)
      .toBuffer()
      .then((buf) => {
        return spig.addFile(`${fileRef.dir}${basename}-${mod.name}${fileRef.ext}`, buf);
      })
  );

  return Promise.all(promises).then(() => fileRef);
}

export const operation: (spig: Spig) => SpigOperation = (spig: Spig) => {
  return new SpigOperation('resize images', (fileRef) => processFile(spig, fileRef));
};
