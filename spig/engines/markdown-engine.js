"use strict";

const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const attrs = require('markdown-it-attrs');
const mila = require('markdown-it-link-attributes')
const container = require('markdown-it-container');
const slugify = require('slugify');
const {html5Media} = require('markdown-it-html5-media');

const defaults = {
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre><code class="hljs lang-${lang}">${hljs.highlight(lang, code).value}</code></pre>`;
    }
    return '';
  }
};

const md = new MarkdownIt(defaults);

const uslugify = s => slugify(s);

['section', 'figure', 'figcaption', 'header', 'footer'].forEach(name => {
  md.use(container, name, {
    validate: params =>
      params.trim() === name || params.trim().startsWith(`${name} `),
    render: (tokens, idx, _options, env, self) => {
      tokens[idx].tag = name;
      return self.renderToken(tokens, idx, _options, env, self);
    }
  });
});

md.use(require('markdown-it-anchor'), {
  level: 1,
  slugify: uslugify,
  permalink: false,
});

md.use(container, 'div');

md.use(attrs);

md.use(mila, {
  pattern: /^https?:\/\//,
  attrs: {
    target: '_blank'
  }
});

md.use(html5Media, {
  videoAttrs: 'controls',
  audioAttrs: 'controls'
});

module.exports = md;
