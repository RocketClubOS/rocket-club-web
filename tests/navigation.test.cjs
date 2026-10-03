// Run with jsdom available on NODE_PATH. No network requests are made.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8').replace(/@import[^;]+;/g, '');
for (const page of ['agents.html', 'solutions.html', 'how-it-works.html', 'industries.html', 'trust-center.html']) {
  for (const location of ['head', 'nested', 'none']) {
    test(`${page}: footer and content survive ${location} script placement`, () => {
      const dom = new JSDOM(fs.readFileSync(path.join(root, page), 'utf8'), { runScripts: 'outside-only', url: `https://example.test/${page}` });
      const { window: w } = dom;
      try {
        w.document.querySelectorAll('script').forEach(el => el.remove());
        const injected = w.document.createElement('script');
        if (location === 'head') w.document.head.prepend(injected);
        if (location === 'nested') {
          const wrapper = w.document.createElement('div');
          wrapper.appendChild(injected);
          w.document.body.prepend(wrapper);
        }
        const style = w.document.createElement('style');
        style.textContent = css;
        w.document.head.appendChild(style);
        // No JS yet: animation must not hide the actual page.
        assert.equal(w.getComputedStyle(w.document.querySelector('.reveal')).opacity, '1');
        assert.doesNotThrow(() => w.eval(script));
        assert.equal(w.document.querySelectorAll('.site-footer').length, 1);
        assert.equal(w.document.querySelectorAll('.footer-legal-links a').length, 5);
        assert.ok(w.document.querySelector('[data-nav] a[href="./agents.html"]'));
        assert.ok(w.document.querySelector('.reveal.is-visible'));
      } finally { w.close(); }
    });
  }
}
