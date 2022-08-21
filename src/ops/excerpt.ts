import RemoveMarkdown from 'remove-markdown';
import { ctx } from '../ctx';

import { SpigOperation } from '../spig-operation';
import { FileRef } from '../file-reference';

function excerptBlock(content: string): string | undefined {
  const rExcerpt2 = ctx.config.ops.excerpt.regexp;

  const match = rExcerpt2.exec(content);
  if (!match) {
    return undefined;
  }
  return content.substring(0, match.index).trim();
}

function processFile(fileRef: FileRef): void {
  if (fileRef.hasAttr('summary')) {
    return;
  }

  let s = fileRef.string;
  const data = excerptBlock(s);

  if (data) {
    s = RemoveMarkdown(data);
  } else {
    s = RemoveMarkdown(s);
    if (s.length > 140) {
      s = s.substr(0, 140) + '…';
    }
  }

  s = s.replace('\\#', '#');
  s = s.replace('\\-', '-');
  s = s.replace('\\+', '+');

  fileRef.setAttr('summary', s);
}

export const operation: () => SpigOperation = () => {
  return SpigOperation.of('summary', processFile);
};
