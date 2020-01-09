"use strict";

const SpigVersion = require('./spig-version');

/**
 * Site configuration defaults.
 * Accessible in templates.
 */
module.exports.site = {
  name: 'My Awesome Spig Site',
  baseURL: 'http://localhost:3000',
  version: '0.0.1',

  // environment
  env: process.env,

  // production or development mode
  production: false,

  assets: {},

  // data folder
  data: {},

  // list of all pages
  pages: [],

  // collections
  collections: {},

  // build related data
  build: {
    date: new Date()
  },

  // some spig data
  spig: {
    version: SpigVersion,
  },

};

/**
 * Development-related configuration. For internal use only.
 * Folder names do not end with a slash. All paths are relative, but starts with `/`.
 * This makes building paths easier.
 */
module.exports.dev = {

  // source root folder
  // must be given without the slash prefix, as it is relative!
  srcDir: 'src',

  // relative source folders
  dirSite: '/site',
  dirImages: '/images',
  dirJs: '/js',
  dirData: '/data',
  dirCss: '/css',
  dirStatic: '/static',
  dirLayouts: '/layouts',
  dirLambda: '/lambda',

  // output root folder
  outDir: './out',

  // relative output folders
  dirJsOut: '/js',
  dirCssOut: '/css',
  dirImagesOut: `/images`,

  // names
  // todo move to configuration of each operation!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  names: {
    bundle_js: 'main.js'
  },

  // configuration for local development
  server: {
    port: 3000,
    hostname: 'localhost'
  },

};

/**
 * Configuration of each operation.
 */
module.exports.ops = {

  excerpt: {
    regexp: /<!--+\s*more\s*--+>/i
  },

  js: {
    useBabel: false
  },

  htmlMinify: {
    collapseWhitespace: true,
    conservativeCollapse: false
  },

  imageMinify: {
    jpeg: {
      quality: 85
    },
    png: {
      quality: [0.5, 0.8],
      speed: 4
    },
    optipng: {
      optimizationLevel: 3
    },
    gif: {
      optimizationLevel: 3
    }
  },

  template: {
    // template extensions
    extensions: ['.njk'],

    // default template name
    default: 'base'
  },

  render: {
    // extensions to be rendered
    extensions: ['.md']
  },


};
