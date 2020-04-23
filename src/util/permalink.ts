export function permalink(link: string): string {
  if (link.endsWith('index.html')) {
    return link.substr(0, link.length - 10);
  }
  return link;
}
