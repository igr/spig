"use strict";

const Spig     = require('../spig');
const Path     = require('path');
const fs       = require("fs");

module.exports = (file) => {
  const filePath = file.relative;
  file.data = {
    source: filePath,
    dir: Path.dirname(filePath)
  };

  const site = Spig.config().site();

  // merge data
  var path = site.srcDir + site.dirSite + "/" + file.data.dir;
  while(path !== '.') {
    const jsonFile = path + '/_.json';
    if (fs.existsSync(jsonFile)) {
      const config = JSON.parse(fs.readFileSync(jsonFile));
      file.data = {...config, ...file.data};
    }
    path = Path.dirname(path);
  }

};
