import slugify from 'slugify';

// dont remove: backslash, dash!
const slugifyOptions = {
  lower: true,
  remove: /[!"#$%&'()*+,.:;<=>?@[\\\]^_`{|}~]/g,
};

slugify.default.extend({ '☢': 'radioactive' });

export function slugit(value: string): string {
  return slugify.default(value, slugifyOptions);
}
