import * as SpigConfig from '../spig-config';

/**
 * Returns the JSON representation of an object.
 *
 * @param {value} object the object
 * @param {number} objectMaxDepth for objects, the maximum number of times to recurse into descendants
 * @param {number} arrayMaxLength for arrays, the maximum number of elements to enumerate
 * @param {string} indent the string to use for indentation
 * @return {string} the JSON representation
 */
function toJSON(object: object, objectMaxDepth: number, arrayMaxLength: number, indent: string): string {
  if (object === SpigConfig.site) {
    object = { ...object };
    delete (object as any)._;
    delete (object as any).build.env;
  } else if (object === SpigConfig.dev) {
    object = { ...object };
  }

  // The path of an object in the JSON object, with indexes corresponding to entries in the
  // "values" variable.
  const paths: string[] = [];
  // A list of all the objects that were seen (used to avoid recursion)
  const values: object[] = [];
  // The replacement characters
  const replacements: { [key: string]: string } = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\',
  };

  // Matches characters that must be escaped
  // eslint-disable-next-line no-misleading-character-class,no-control-regex
  const escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  /**
   * Escapes control characters, quote characters, backslash characters and quotes the string.
   *
   * @param {string} string the string to quote
   * @returns {String} the quoted string
   */
  function quote(string: string): string {
    escapable.lastIndex = 0;
    let escaped;
    if (escapable.test(string)) {
      escaped = string.replace(escapable, a => {
        const replacement = replacements[a];
        if (replacement) return replacement;
        // Pad the unicode representation with leading zeros, up to 4 characters.
        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      });
    } else escaped = string;
    return '"' + escaped + '"';
  }

  /**
   * Returns the String representation of an object.
   *
   * Based on <a href="https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js">https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js</a>
   *
   * @param {string} path the fully-qualified path of value in the JSON object
   * @param {type} value the value of the property
   * @param {string} cumulativeIndent the indentation to apply at this level
   * @param {number} depth the current recursion depth
   * @return {String} the JSON representation of the object, or "null" for values that aren't valid
   * in JSON (e.g. infinite numbers).
   */
  function toString(path: string, value: any, cumulativeIndent: string, depth: number): string {
    switch (typeof value) {
      case 'function':
        return '"fn()"';
      case 'string':
        return quote(value);
      case 'number': {
        // JSON numbers must be finite
        if (Number.isFinite(value)) return String(value);
        return 'null';
      }
      case 'boolean':
        return String(value);
      case 'object': {
        if (!value) return 'null';
        const valueIndex = values.indexOf(value);
        if (valueIndex !== -1) return 'Reference => ' + paths[valueIndex];
        values.push(value);
        paths.push(path);
        if (depth > objectMaxDepth) return '...';

        // Make an array to hold the partial results of stringifying this object value.
        const partial = [];

        // Is the value an array?
        let i;
        if (Object.prototype.toString.apply(value) === '[object Array]') {
          // The value is an array. Stringify every element
          const length = Math.min(value.length, arrayMaxLength);

          // Whether a property has one or multiple values, they should be treated as the same
          // object depth. As such, we do not increment the object depth when recursing into an
          // array.
          for (i = 0; i < length; ++i) {
            partial[i] = toString(path + '.' + i, value[i], cumulativeIndent + indent, depth);
          }
          if (i < value.length) {
            // arrayMaxLength reached
            partial[i] = '...';
          }
          return '\n' + cumulativeIndent + '[' + partial.join(', ') + '\n' + cumulativeIndent + ']';
        }

        // Otherwise, iterate through all of the keys in the object.
        for (let subKey of Object.keys(value)) {
          if (Object.prototype.hasOwnProperty.call(value, subKey)) {
            let subValue;
            try {
              subValue = toString(path + '.' + subKey, value[subKey], cumulativeIndent + indent, depth + 1);
              partial.push(quote(subKey) + ': ' + subValue);
            } catch (e) {
              // this try/catch due to forbidden accessors on some objects
              if (e.message) subKey = e.message;
              else subKey = 'access denied';
            }
          }
        }
        let result = '\n' + cumulativeIndent + '{\n';
        for (i = 0; i < partial.length; ++i) result += cumulativeIndent + indent + partial[i] + ',\n';
        if (partial.length > 0) {
          // Remove trailing comma
          result = result.slice(0, result.length - 2) + '\n';
        }
        result += cumulativeIndent + '}';
        return result;
      }
      default:
        return 'null';
    }
  }

  if (indent === undefined) indent = '  ';
  if (objectMaxDepth === undefined) objectMaxDepth = 0;
  if (arrayMaxLength === undefined) arrayMaxLength = 50;
  return toString('root', object, '', 0);
}

/**
 * Safe, single-level dump.
 */
export function out(obj: object, depth = 2): string {
  // return JSON.stringify(obj, (k, v) => (k ? '' + v : v));
  return toJSON(obj, depth, 10, '  ');
}
