import slugify from 'slugify';

// dont remove: backslash, dash!
const slugifyOptions = {
  lower: true,
  remove: /[!"#$%&'()*+,.:;<=>?@[\\\]^_`{|}~]/g,
};

// extend default symbols

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore DEFAULT ISSUE
slugify.extend({ '☢': 'radioactive' });

export function slugit(value: string): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore DEFAULT ISSUE
  return slugify(value, slugifyOptions);
}
