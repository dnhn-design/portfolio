/* Light / dark for the live maps.
   - Follows the main page's choice: it reads the same localStorage key ("theme") and reacts when the page changes it
     (the "storage" event reaches an embedded map; no message passing needed). With no choice stored it follows the system.
   - Sets <html data-theme="light|dark">; shared/light.css restyles the interface when it is "light".
   - Canvas maps that hard-code their dark colours opt in with  <script src="../shared/theme.js" data-canvas="1">:
     every colour they assign is remapped for a light background (neutrals are mirrored, saturated colours are darkened
     until they have enough contrast). Maps whose engines already read their colours from CSS variables don't opt in. */
(function () {
  const KEY = 'theme', root = document.documentElement, cur = document.currentScript, useCanvas = !!(cur && cur.dataset.canvas === '1');
  const stored = () => { try { const t = localStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; } catch (e) { return null; } };
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const resolve = () => stored() || (mq.matches ? 'dark' : 'light');
  const Theme = window.Theme = { light: false, map: (c) => c };

  /* ---------- colour remap (canvas) ---------- */
  const cache = new Map();
  let scratch = null, desc = null;
  function rgbOf(str) {            // let the browser normalise any CSS colour string
    if (!scratch) { scratch = document.createElement('canvas').getContext('2d'); }
    scratch.fillStyle = '#000'; desc.set.call(scratch, str); const n = desc.get.call(scratch);
    if (n[0] === '#') return { r: parseInt(n.slice(1, 3), 16), g: parseInt(n.slice(3, 5), 16), b: parseInt(n.slice(5, 7), 16), a: 1 };
    const m = n.match(/[\d.]+/g); if (!m || m.length < 3) return null;
    return { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] };
  }
  function toHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
    if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
    return { h, s, l };
  }
  function toRgb(h, s, l) {
    if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => Math.round(v * 255));
  }
  const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  function lightOf(str) {
    if (cache.has(str)) return cache.get(str);
    let out = str;
    try {
      const c = rgbOf(str);
      if (c && c.a > 0) {
        const o = toHsl(c.r, c.g, c.b); let rgb;
        if (o.s < 0.3 || o.l < 0.28) { rgb = toRgb(o.h, o.s, 1 - o.l); }        // neutrals and dark "background" tones mirror
        else { let l = o.l; rgb = toRgb(o.h, o.s, l); let k = 0;                 // colours: keep the hue, darken until readable on white
          while (lum(rgb[0], rgb[1], rgb[2]) > 0.27 && l > 0.1 && k++ < 40) { l -= 0.015; rgb = toRgb(o.h, o.s, l); } }
        out = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + c.a + ')';
      }
    } catch (e) { /* leave the colour as it was */ }
    cache.set(str, out); return out;
  }
  if (useCanvas && window.CanvasRenderingContext2D) {
    const P = CanvasRenderingContext2D.prototype;
    desc = Object.getOwnPropertyDescriptor(P, 'fillStyle');
    ['fillStyle', 'strokeStyle', 'shadowColor'].forEach((k) => {
      const d = Object.getOwnPropertyDescriptor(P, k); if (!d) return;
      Object.defineProperty(P, k, { configurable: true, enumerable: d.enumerable, get: d.get, set(v) { d.set.call(this, Theme.light && typeof v === 'string' ? lightOf(v) : v); } });
    });
    const G = window.CanvasGradient && CanvasGradient.prototype, add = G && G.addColorStop;
    if (add) G.addColorStop = function (o, c) { return add.call(this, o, Theme.light && typeof c === 'string' ? lightOf(c) : c); };
    Theme.map = (c) => (Theme.light ? lightOf(c) : c);
  }

  /* ---------- apply + redraw ---------- */
  function nudge() {                 // engines that only redraw their cached base layer on resize get a 1px layout nudge
    root.classList.add('theme-nudge');
    requestAnimationFrame(() => requestAnimationFrame(() => { root.classList.remove('theme-nudge'); dispatchEvent(new Event('resize')); }));
  }
  function apply(first) {
    const t = resolve(), was = Theme.light; Theme.light = t === 'light'; root.dataset.theme = t;
    if (!first && was !== Theme.light) { dispatchEvent(new Event('themechange')); nudge(); }
  }
  const st = document.createElement('style'); st.textContent = 'html.theme-nudge body{padding-bottom:1px!important}';
  (document.head || root).appendChild(st);
  apply(true);
  addEventListener('storage', (e) => { if (e.key === KEY || e.key === null) apply(false); });
  mq.addEventListener && mq.addEventListener('change', () => { if (!stored()) apply(false); });
})();
