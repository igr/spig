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
  `escape-string-regexp`
].join('|');

module.exports = {
  //preset: 'ts-jest',
  preset: 'ts-jest/presets/js-with-ts',
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel-jest.config.js' }],
  },
  transformIgnorePatterns: [
    `node_modules/(?!${esModules})`
  ],
  testEnvironment: 'node',
  testRegex: '/test/.*\\.(test|spec)?\\.(ts|tsx|js)$',
  globals: {
    "ts-jest": {
      "useESM": true,
      "tsconfig": "<rootDir>/tsconfig.test.json"
    }
  },
  moduleNameMapper: {
    "#(.*)": "<rootDir>/node_modules/$1"
  },
  moduleDirectories: ["node_modules", "src", "test"],
  automock: false,
};
