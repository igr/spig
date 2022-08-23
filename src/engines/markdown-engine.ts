import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
// eslint-disable-next-line import/extensions
import Token from 'markdown-it/lib/token.js';
import attrs from 'markdown-it-attrs';
import mila from 'markdown-it-link-attributes';
import container from 'markdown-it-container';
import anchor from 'markdown-it-anchor';
import { html5Media } from 'markdown-it-html5-media';
import { slugit } from '../util/slugit.js';
import { RenderEngine } from './render-engine.js';

const defaults = {
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs lang-${lang}">${hljs.highlight(code, { language: lang }).value}</code></pre>`;
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
    tabIndex: false,
  });

  md.use(container, 'div');

  md.use(attrs);

  md.use(mila, {
    matcher(href: string) {
      return href.match(/^https?:\/\//);
    },
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

export class MarkdownRenderEngine implements RenderEngine<MarkdownIt> {
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
