/**
 * Filters pages by a prefix.
 */
// todo add context!
export function pagesWithin(pages: any[], prefix: string): any[] {
  const result = [];

  for (const page of pages) {
    if (page.src.startsWith(prefix)) {
      result.push(page);
    }
  }

  return result;
}
