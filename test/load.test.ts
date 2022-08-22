import * as l from '../src/load.js';
import { Spig } from '../src/spig.js';
import { SpigCtx } from '../src/ctx.js';

l.setLog(false);

describe('load', () => {
  beforeEach(() =>
    Spig.init((ctx: SpigCtx) => {
      const dev = ctx.config.dev;
      dev.srcDir = '/test/_fixture/1';
      dev.dryRun = true;
    })
  );

  test('existing module', () => {
    const module = l.load('/test/_fixture/1/module');
    expect(module).toBe('Hello');
  });

  test('missing module', () => {
    const t = (): void => {
      l.load('whaaaat');
    };
    expect(t).toThrowError();
  });
});

describe('loadJs', () => {
  test('existing module', () => {
    const js = l.loadJs('/test/_fixture/1/module');
    expect(js).toBe('Hello');
  });

  test('missing module', () => {
    const js = l.loadJs('whaaaat');
    expect(js).toBeUndefined();
  });
});

describe('loadJsonOrJs', () => {
  test('existing JS', () => {
    const data = l.loadJsonOrJs('/test/_fixture/1/data');
    expect(data).toStrictEqual({ foo: '123' });
  });

  test('missing JS or JSON', () => {
    const data = l.loadJsonOrJs('whaaaat');
    expect(data).toStrictEqual({});
  });

  test('existing JSON', () => {
    const data = l.loadJsonOrJs('/test/_fixture/1/data2');
    expect(data).toStrictEqual({ foo: '123' });
  });

  test('existing JSON with extension', () => {
    const data = l.loadJsonOrJs('/test/_fixture/1/data2.json');
    expect(data).toStrictEqual({ foo: '123' });
  });
});
