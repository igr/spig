/**
 * Filters pages by a prefix.
 */
export function pagesWithin(pages: any[], prefix: string): any[] {
  return pages.filter((page) => page.src.startsWith(prefix));
}

/**
 * Filters pages by a prefix but only if it looks like a subdir.
 */
export function pagesWithinSubdirs(pages: any[], prefix: string): any[] {
  return pages.filter((page) => page.src.startsWith(prefix) && page.src.indexOf('/', prefix.length) !== -1);
}
