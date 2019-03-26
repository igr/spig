"use strict";

const matter   = require('front-matter');
const Meta     = require('../meta');

module.exports = (file, attributes = {}) => {
  const data = matter(file.contents.toString());

  file.contents = Buffer.from(data.body);

  file.meta.attr = {...data.attributes, ...attributes};
};
