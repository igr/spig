import * as l from '../src/load';

describe('load', () => {
  test('existing module', () => {
    const module = l.load('test/_fixture/module');
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
    const js = l.loadJs('test/_fixture/module');
    expect(js).toBe('Hello');
  });

  test('missing module', () => {
    const js = l.loadJs('whaaaat');
    expect(js).toBeUndefined();
  });
});

describe('loadJsonOrJs', () => {
  test('existing JS', () => {
    const data = l.loadJsonOrJs('test/_fixture/data');
    expect(data).toStrictEqual({ foo: '123' });
  });

  test('missing JS or JSON', () => {
    const data = l.loadJsonOrJs('whaaaat');
    expect(data).toStrictEqual({});
  });

  test('existing JSON', () => {
    const data = l.loadJsonOrJs('test/_fixture/data2');
    expect(data).toStrictEqual({ foo: '123' });
  });
});
