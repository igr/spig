import RemoveMarkdown from 'remove-markdown';

import { SpigOperation } from '../spig-operation.js';
import { FileRef } from '../file-reference.js';

function excerptBlock(rExcerpt2: any, content: string): string | undefined {
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
  const data = excerptBlock(fileRef.cfg.ops.excerpt.regexp, s);

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
