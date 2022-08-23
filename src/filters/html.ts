import escapeHtml from 'escape-html';

export function html(str: string): string {
  return escapeHtml(str);
}
