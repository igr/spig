import { FileRef } from '../file-reference';
import { ctx } from '../ctx';

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
