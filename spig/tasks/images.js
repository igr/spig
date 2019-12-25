"use strict";

const glob = require("glob");
const fs = require("fs");
const log = require("fancy-log");
const Path = require("path");
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const sharp = require('sharp');

const dev = require('../spig-config').dev;
const SpigUtil = require('../spig-util');

const sourceRoot = dev.srcDir + dev.dirImages;
const files = sourceRoot + "/**/*";

module.exports = task;
module.exports.watch = {files: files, task: task};

function task() {
  SpigUtil.logTask("images");
  (async () => {
    const allPromises =
      glob.sync(files)
        .map(file => processFile(file));

    await Promise.all(allPromises);
  })();
}

function processFile(file) {
  const fileName = Path.basename(file);
  const extension = Path.extname(fileName);
  const split = Path.basename(file, extension).split("__");
  const basename = split[0];

  const mods = createModsFromFileNameSplit(split);
  const buffer = fs.readFileSync(file);

  mods.forEach(m => {
    m.mod(buffer).toBuffer()
      .then(buf => {
        minimize(buf).then(buf => {
          SpigUtil.writeToOut(dev.dirImages, `${basename}-${m.name}${extension}` , buf);
        })
      })
      .catch(err => {
        log.error(err);
      });
  });

  if (mods.length > 0) return;

  return minimize(buffer)
    .then(outBuffer => {
      SpigUtil.writeToOut(dev.dirImages, fileName, outBuffer);
    }).catch(err => {
      log.error(err);
    });
}

function minimize(buffer) {
  return imagemin.buffer(buffer, {
    plugins: [
      imageminMozjpeg(),
      imageminPngquant({
        quality: [0.6, 0.8]
      }),
      imageminGifsicle()
    ]
  })
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
      element.mod = (buffer) => sharp(buffer).resize({'width': parseInt(t.substr(1))});
    }
    else if (t.startsWith('h')) {
      element.mod = (buffer) => sharp(buffer).resize({'height': parseInt(t.substr(1))});
    }
    else {
      throw new Error(`Unknown image mod name '${t}' in ${fileName}`);
    }
    element.name = t;
    mods.push(element);
  }

  return mods;
}
