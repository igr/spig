import slugify from 'slugify';

// dont remove: backslash, dash!
const slugifyOptions = {
  lower: true,
  remove: /[!"#$%&'()*+,.:;<=>?@[\\\]^_`{|}~]/g,
};

slugify.extend({ '☢': 'radioactive' });

export function slugit(value: string): string {
  return slugify(value, slugifyOptions);
}
