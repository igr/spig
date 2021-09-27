import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import hljs from 'highlight.js';
import attrs from 'markdown-it';
import mila from 'markdown-it';
import container from 'markdown-it';
import anchor from 'markdown-it';
import html5Media from 'markdown-it';
import { slugit } from '../util/slugit';
import { RenderEngine } from './render-engine';

const defaults = {
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs lang-${lang}">${hljs.highlight(lang, code).value}</code></pre>`;
    }
    return '';
  },
};

function initMd(): MarkdownIt {
  const md = new MarkdownIt(defaults);

  const uslugify: (input: string) => string = (s) => slugit(s);

  ['section', 'figure', 'figcaption', 'header', 'footer'].forEach((name) => {
    md.use(container, name, {
      validate: (params: string) => {
        return params.trim() === name || params.trim().startsWith(`${name} `);
      },
      render: (tokens: Token[], idx: number, _options: object, _env: object, self: any) => {
        tokens[idx].tag = name;
        return self.renderToken(tokens, idx, _options);
      },
    });
  });

  md.use(anchor, {
    level: 1,
    slugify: uslugify,
    permalink: false,
  });

  md.use(container, 'div');

  md.use(attrs);

  md.use(mila, {
    pattern: /^https?:\/\//,
    attrs: {
      target: '_blank',
    },
  });

  md.use(html5Media, {
    videoAttrs: 'controls',
    audioAttrs: 'controls',
  });

  return md;
}

class MarkdownRenderEngine implements RenderEngine<MarkdownIt> {
  private readonly md: MarkdownIt;

  constructor() {
    this.md = initMd();
  }

  configure(engineConsumer: (engine: MarkdownIt) => void): void {
    engineConsumer(this.md);
  }

  render(input: string): string {
    return this.md.render(input);
  }

  renderInline(input: string): string {
    return this.md.renderInline(input);
  }
}

export const MarkdownEngine: RenderEngine<MarkdownIt> = new MarkdownRenderEngine();
