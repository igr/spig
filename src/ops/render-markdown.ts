import { FileRef } from '../file-reference';
import { MarkdownEngine } from '../engines/markdown-engine';

const markdown: (text?: string) => string = (text?: string) => {
  return text ? MarkdownEngine.render(text) : '';
};
const markdownInline: (text?: string) => string = (text?: string) => {
  return text ? MarkdownEngine.renderInline(text) : '';
};

export function renderMarkdown(fileRef: FileRef): void {
  fileRef.string = MarkdownEngine.render(fileRef.string);

  fileRef.setAttrs({
    markdown,
    markdownInline,
  });
}
