import { FileRef } from '../file-reference.js';
import { ctx } from '../ctx.js';

const markdown: (text?: string) => string = (text?: string) => {
  return text ? ctx.engines.markdownEngine.render(text) : '';
};
const markdownInline: (text?: string) => string = (text?: string) => {
  return text ? ctx.engines.markdownEngine.renderInline(text) : '';
};

export function renderMarkdown(fileRef: FileRef): void {
  fileRef.string = ctx.engines.markdownEngine.render(fileRef.string);

  fileRef.setAttrsFrom({
    markdown,
    markdownInline,
  });
}
