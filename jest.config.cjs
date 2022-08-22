const esModules = [
  'chalk',
  'ansi-styles',
  'imagemin.*',
  'mozjpeg',
  'mozjpeg/lib',
  'globby',
  'array-union',
  'slash',
  'p-pipe',
  'execa',
  'strip-final-newline',
  'npm-run-path',
  'path-key',
  'onetime',
  'imagemin-mozjpeg/node_modules/mimic-fn',
  'mimic-fn',
  'human-signals/build/src',
  'is-stream',
  'is-jpg',
  'del',
  'is-path-cwd',
  'is-path-inside',
  'p-map',
  'aggregate-error',
  'indent-string',
  'clean-stack',
  'escape-string-regexp',
  'remark',
  'unified',
  'bail',
  'is-plain-obj',
  'trough',
  'vfile',
  'unist-util-stringify-position',
  'mdast-util-from-markdown',
  'mdast-util-to-string',
  'micromark/lib',
  'micromark-util-.*',
  'micromark-factory-.*',
  'micromark-util-.*',
  'micromark-core-.*',
  'mdast-util-to-markdown',
  'decode-named-character-reference',
  'character-entities',
  'zwitch',
  'longest-streak',
  'unist-util-.*',
  'strip-markdown',
].join('|');

module.exports = {
  verbose: true,
  preset: 'ts-jest',///presets/js-with-ts',
  resolver: "ts-jest-resolver",
  "transform": {
    ".ts": "ts-jest",
   '.js': ['babel-jest', { configFile: './babel-jest.config.cjs' }],
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [
    `node_modules/(?!${esModules})`
  ],
  moduleNameMapper: {
    "#(.*)": "<rootDir>/node_modules/$1"
  },
  globals: {
    "ts-jest": {
      "useESM": true,
      "tsconfig": "<rootDir>/tsconfig.test.json"
    }
  },
};
