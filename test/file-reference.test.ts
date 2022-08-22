import { FileRef } from '../src/file-reference.js';
import { Spig } from '../src/spig.js';

describe('paths', () => {
  test('basename', () => {
    const fileRef: FileRef = Spig.on().addFile('/src/foo.txt', 'Text');
    expect(fileRef.basename).toBe('foo');
  });
  test('extension', () => {
    const fileRef: FileRef = Spig.on().addFile('/src/foo.txt', 'Text');
    expect(fileRef.ext).toBe('.txt');
  });
  test('name', () => {
    const fileRef: FileRef = Spig.on().addFile('/src/foo.txt', 'Text');
    expect(fileRef.name).toBe('foo.txt');
  });
  test('id', () => {
    const fileRef: FileRef = Spig.on().addFile('/src/foo.txt', 'Text');
    expect(fileRef.id).toBe('/site/src/foo.txt');
  });
  test('dir', () => {
    const fileRef: FileRef = Spig.on().addFile('/src/foo.txt', 'Text');
    expect(fileRef.dir).toBe('/src/');
  });
});

describe('attributes', () => {
  test('set', () => {
    const spig = Spig.on();
    const fileRef: FileRef = spig.addFile('/src/foo.txt', 'Text');

    fileRef.setAttr('one', 'value 1');
    fileRef.setAttr('two', 'value 2');
    fileRef.setAttr('two', 'value 3');

    expect(fileRef.attr('one')).toBe('value 1');
    expect(fileRef.attr('two')).toBe('value 3');
    expect(fileRef.hasAttr('one')).toBeTruthy();
  });
  test('set all', () => {
    const fileRef: FileRef = Spig.on().addFile('/src/foo.txt', 'Text');

    fileRef.setAttr('one', 987);
    fileRef.setAttrsFrom({ one: 123, two: 'hello' });

    expect(fileRef.attr('one')).toBe(123);
    expect(fileRef.attr('two')).toBe('hello');
  });
  test('add all', () => {
    const fileRef: FileRef = Spig.on().addFile('/src/foo.txt', 'Text');

    fileRef.setAttr('one', 987);
    fileRef.addAttrsFrom({ one: 123, two: 'hello' });

    expect(fileRef.attr('one')).toBe(987);
    expect(fileRef.attr('two')).toBe('hello');
  });
});
