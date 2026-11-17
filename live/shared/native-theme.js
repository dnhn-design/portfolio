/* For live maps that ship their own light/dark theme (and toggle button): keep them in step with the main page.
   Reads the same localStorage key ("theme") as shared/theme.js, seeds the map's own storage key before it starts (no flash),
   and presses the map's own theme button when the page's choice changes (storage event) or the system theme flips. */
(function () {
  const KEY = 'theme', root = document.documentElement, own = document.currentScript && document.currentScript.dataset.key, attr = (document.currentScript && document.currentScript.dataset.attr) || 'data-theme', dflt = document.currentScript && document.currentScript.dataset.default;
  const want = () => { try { const t = localStorage.getItem(KEY); if (t === 'light' || t === 'dark') return t; } catch (e) {} return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; };
  const cur = () => root.getAttribute(attr) || dflt || (own && (() => { try { return localStorage.getItem(own); } catch (e) { return null; } })());
  const btn = () => document.querySelector('#themebtn,#themetog,#themeb,#theme');
  if (own) { try { localStorage.setItem(own, want()); } catch (e) {} }
  function sync() { const b = btn(), w = want(); if (b && cur() && cur() !== w) b.click(); }
  addEventListener('load', () => setTimeout(sync, 0));
  addEventListener('storage', (e) => { if (e.key === KEY) sync(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
})();
