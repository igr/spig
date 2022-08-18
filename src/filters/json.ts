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
const escapable =
  /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

export function escape(string: string): string {
  escapable.lastIndex = 0;
  let escaped;
  if (escapable.test(string)) {
    escaped = string.replace(escapable, (a) => {
      const replacement = replacements[a];
      if (replacement) return replacement;
      // Pad the unicode representation with leading zeros, up to 4 characters.
      return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    });
  } else escaped = string;
  return escaped;
}

export function json(str: string): string {
  return escape(str);
}
