export class SpigConfig {
  /**
   * Development-related configuration. For internal use only.
   * Folder names do not end with a slash. All paths are relative, but starts with `/`.
   * This makes building paths easier.
   */
  public dev = {
    root: process.cwd() + '/',

    // source root folder
    // must be given without the slash prefix, as it is relative from project root
    srcDir: 'src',

    // output root folder
    // must be given without the slash prefix, as it is relative from project root
    outDir: 'out',

    // Spig structure: relative source and out folders
    dir: {
      site: '/site',
      images: '/images',
      imagesOut: '/images',
      js: '/js',
      jsOut: '/js',
      data: '/data',
      css: '/css',
      cssOut: '/css',
      static: '/static',
      layouts: '/layouts',
      config: '/config',
    },

    // configuration for local development
    server: {
      port: 3000,
      hostname: 'localhost',
    },

    state: {
      isUp: false,
    },

    dryRun: false,
  };

  /**
   * Site configuration defaults.
   * Accessible in templates.
   */
  public site = {
    name: 'My Awesome Spig Site',
    baseURL: 'http://localhost:3000/',
    version: '0.0.1',

    // data folder
    data: {},

    // languages
    lang: [] as LangDef[],

    // build related data
    build: {
      // environment
      env: process.env,
      // build date
      date: new Date(),
      // production or development mode
      production: false,
    },

    // all ops (meta) data should be stored in this object
    _: {},

    // reference to above dev
    dev: this.dev,
  };

  /**
   * Configuration of each operation.
   */
  public ops = {
    excerpt: {
      regexp: /<!--+\s*more\s*--+>/i,
    },

    js: {},

    htmlMinify: {
      collapseWhitespace: true,
      conservativeCollapse: false,
    },

    imageMinify: {
      maxFileSize: 1048576,
      jpeg: {
        quality: 85,
      },
      png: {
        quality: [0.5, 0.8],
        speed: 4,
      },
      optipng: {
        optimizationLevel: 3,
      },
      gif: {
        optimizationLevel: 3,
      },
    },

    template: {
      // template extensions
      extensions: ['.njk'],

      // default template name
      default: 'base',
    },

    render: {
      // extensions to be rendered
      extensions: ['.md', '.njk', '.pug'],
    },
  };

  /**
   * Configuration for 3rd party libraries.
   */
  public libs = {
    cssnano: {
      zindex: false,
    },
  };
}

export interface LangDef {
  key: string;
  name: string;
  prefix: string;
  default: boolean;
}
