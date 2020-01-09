"use strict";

const SpigOperation = require('../spig-operation');
const sharp = require('sharp');

function processFile(spig, fileRef) {
  const buffer = fileRef.buffer();

  const split = fileRef.basename.split("__");
  const basename = split[0];

  const mods = createModsFromFileNameSplit(split);

  return mods.map(m =>
    m.resize(buffer).toBuffer()
      .then(buf => {
        spig.addFile(`${fileRef.dir}${basename}-${m.name}${fileRef.ext}`, buf);
      })
  );
}

function createModsFromFileNameSplit(split) {
  if (split.length === 1) {
    return [];
  }

  const tasks = split.splice(1);
  const mods = [];

  for (const t of tasks) {
    let element = {};
    if (t.startsWith('w')) {
      element.resize = (buffer) => sharp(buffer).resize({'width': parseInt(t.substr(1))});
    } else if (t.startsWith('h')) {
      element.resize = (buffer) => sharp(buffer).resize({'height': parseInt(t.substr(1))});
    } else {
      throw new Error(`Unknown image mod name '${t}'`);
    }
    element.name = t;
    mods.push(element);
  }

  return mods;
}

module.exports.operation = (spig, options) => {
  return SpigOperation
    .named("resize images")
    .onFile((fileRef) => {
      return Promise.all(processFile(spig, fileRef));
    });
};
