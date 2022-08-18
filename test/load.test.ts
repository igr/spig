import * as l from '../src/load';
import { fixtures } from './_fixture/fixtures';

l.setLog(false);

describe('load', () => {
  test('existing module', () => {
    const module = l.load(fixtures.of_1('/module'));
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
    const js = l.loadJs(fixtures.of_1('/module'));
    expect(js).toBe('Hello');
  });

  test('missing module', () => {
    const js = l.loadJs('whaaaat');
    expect(js).toBeUndefined();
  });
});

describe('loadJsonOrJs', () => {
  test('existing JS', () => {
    const data = l.loadJsonOrJs(fixtures.of_1('/data'));
    expect(data).toStrictEqual({ foo: '123' });
  });

  test('missing JS or JSON', () => {
    const data = l.loadJsonOrJs('whaaaat');
    expect(data).toStrictEqual({});
  });

  test('existing JSON', () => {
    const data = l.loadJsonOrJs(fixtures.of_1('/data2'));
    expect(data).toStrictEqual({ foo: '123' });
  });

  test('existing JSON with extension', () => {
    const data = l.loadJsonOrJs(fixtures.of_1('/data2.json'));
    expect(data).toStrictEqual({ foo: '123' });
  });
});
