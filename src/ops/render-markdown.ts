import { FileRef } from '../file-reference';
import { spigEngines } from '../ctx';

const markdown: (text?: string) => string = (text?: string) => {
  return text ? spigEngines.markdownEngine.render(text) : '';
};
const markdownInline: (text?: string) => string = (text?: string) => {
  return text ? spigEngines.markdownEngine.renderInline(text) : '';
};

export function renderMarkdown(fileRef: FileRef): void {
  fileRef.string = spigEngines.markdownEngine.render(fileRef.string);

  fileRef.setAttrsFrom({
    markdown,
    markdownInline,
  });
}
