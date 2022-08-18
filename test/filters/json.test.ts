import * as jsonFilter from '../../src/filters/json';

describe('json', () => {
  const json = jsonFilter.json;

  test('regular chars', () => {
    expect(json('ABC abc')).toStrictEqual('ABC abc');
  });

  test('whitespace', () => {
    expect(json('ABC\ta  bc')).toStrictEqual('ABC\\ta  bc');
  });

  test('newline', () => {
    expect(json('ABC\nabc')).toStrictEqual('ABC\\nabc');
  });

  test('cariage', () => {
    expect(json('ABC\rabc')).toStrictEqual('ABC\\rabc');
  });

  test('backspace', () => {
    expect(json('ABC\babc')).toStrictEqual('ABC\\babc');
  });

  test('formfeed', () => {
    expect(json('ABC\fabc')).toStrictEqual('ABC\\fabc');
  });

  test('doublequote', () => {
    expect(json('ABC"abc')).toStrictEqual('ABC\\"abc');
  });

  test('backslash', () => {
    expect(json('ABC\\abc')).toStrictEqual('ABC\\\\abc');
  });
});
