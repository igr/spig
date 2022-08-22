import * as collections from '../../src/filters/collections.js';

describe('val', () => {
  const val = collections.testables.val;
  const obj = {
    a: 'x',
    b: {
      c: 'z',
    },
    d: [1, 2, 3, 4],
  };

  test('simple property', () => {
    const result = val(obj, 'a');
    expect(result).toBe('x');
  });
  test('not-existing property', () => {
    const result = val(obj, 'not existing');
    expect(result).toBeUndefined();
  });
  test('inner property', () => {
    const result = val(obj, 'b.c');
    expect(result).toBe('z');
  });
  // test('array', () => {
  //   const result = val(obj, 'd[2]');
  //   expect(result).toBe(3);
  // });
});

describe('sortBy', () => {
  const sortBy = collections.sortBy;
  const a = {
    foo: 'a',
  };
  const b = {
    foo: 'b',
  };
  const c = {
    foo: 'c',
  };

  test('sorting', () => {
    expect([a, b, c]).toStrictEqual(sortBy([c, b, a], 'foo'));
  });
});

describe('groupBy', () => {
  const groupBy = collections.groupBy;
  const a = {
    foo: 'a',
  };
  const b = {
    foo: 'a',
  };
  const c = {
    foo: 'c',
  };

  test('grouping', () => {
    const result: any = groupBy([a, b, c], 'foo');
    expect(2).toBe(result.a.length);
    expect(1).toBe(result.c.length);
    expect(c).toBe(result.c[0]);
  });
});

describe('firstN', () => {
  const firstN = collections.firstN;

  test('first 2 elements are returned', () => {
    const input = ['a', 'b', 'c'];
    const result = firstN(input, 2);
    expect(result).toStrictEqual(['a', 'b']);
  });
  test('smaller input', () => {
    const input = ['a'];
    const result = firstN(input, 2);
    expect(result).toStrictEqual(['a']);
  });
  test('empty', () => {
    const result = firstN([], 2);
    expect(result).toStrictEqual([]);
  });
});

describe('lastN', () => {
  const lastN = collections.lastN;

  test('last 2 elements are returned', () => {
    const input = ['a', 'b', 'c'];
    const result = lastN(input, 2);
    expect(result).toStrictEqual(['b', 'c']);
  });
  test('smaller input', () => {
    const input = ['a'];
    const result = lastN(input, 2);
    expect(result).toStrictEqual(['a']);
  });
  test('empty', () => {
    const result = lastN([], 2);
    expect(result).toStrictEqual([]);
  });
});

describe('hasAttr', () => {
  const hasAttr = collections.hasAttr;
  const a = {
    foo: 'a',
  };
  const b = {
    foo: 'b',
  };
  const c = {
    bar: 'c',
  };
  const array = [a, b, c];

  test('filter attributes', () => {
    expect(hasAttr(array, 'bar')).toStrictEqual([c]);
  });
  test('empty result', () => {
    expect(hasAttr(array, 'bar.xxx')).toStrictEqual([]);
  });
});

describe('startsWith', () => {
  const startsWith = collections.startsWith;
  const a = {
    foo: 'abc',
  };
  const b = {
    foo: 'abd',
  };
  const c = {
    foo: 'cba',
  };
  const array = [a, b, c];

  test('filter starters', () => {
    expect(startsWith(array, 'foo', 'cb')).toStrictEqual([c]);
  });
  test('filter starters again', () => {
    expect(startsWith(array, 'foo', 'ab')).toStrictEqual([a, b]);
  });
  test('filter empty', () => {
    expect(startsWith(array, 'foo', 'zzz')).toStrictEqual([]);
  });
});
