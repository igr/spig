"use strict";

const hljs = require('highlight.js');

// add RAW section for code, for later nunjucks

module.exports = md => {
  md.set({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return `<pre><code class="hljs lang-${lang}">{% raw %}${hljs.highlight(lang, code).value}{% raw %}</code></pre>`;
      }
      return '';
    }
  });
};