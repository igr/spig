import slugify from 'slugify';

const slugifyOptions = {
  lower: true,
  remove: /[*+~.()'"!?#:@]/g,
};

slugify.extend({ '☢': 'radioactive' });

export function slugit(value: string): string {
  return slugify(value, slugifyOptions);
}
