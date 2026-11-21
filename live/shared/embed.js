/* Behaviour a live map gets when it is shown inside the Transit-pedia page (and a little of it when opened on its own):
   - the page's top bar owns the light/dark toggle, so a map's own toggle button is hidden (it still works: shared/native-theme.js presses it)
   - the page's sidebar button folds the map's right-hand panel (message from the page; html.side-off)
   - the list of running trains is grouped by line, each group collapsible */
(function () {
  const root = document.documentElement, embedded = window.parent !== window;
  const css = [
    embedded ? '#themebtn,#themetog,#themeb,#theme{display:none!important}' : '',
    'html.side-off #app,html.side-off .app{grid-template-columns:minmax(0,1fr) 0!important}',
    'html.side-off #side,html.side-off #panel,html.side-off #pn,html.side-off .side{display:none!important}',
    '@media (max-width:820px){html.side-off #app,html.side-off .app{grid-template-rows:minmax(0,1fr) 0 auto!important}}',
    '.lgh{display:flex;align-items:center;gap:8px;width:100%;padding:9px 18px 4px;background:none;border:0;color:var(--dim,#7d8794);font:600 10px var(--sans,Inter,system-ui,sans-serif);letter-spacing:.07em;text-transform:uppercase;cursor:pointer;text-align:left}',
    '.lgh:hover{color:var(--fg,inherit)}',
    '.lgh svg{width:9px;height:9px;flex:none;transition:transform .2s}',
    '.lgh[aria-expanded=false] svg{transform:rotate(-90deg)}',
    '.lgh .lgn{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.lgh .lgc{font-weight:500;opacity:.75;font-variant-numeric:tabular-nums}',
    '.lgb[hidden]{display:none}',
    '.lgdup .ln{display:none}'
  ].join('\n');
  const st = document.createElement('style'); st.textContent = css; (document.head || root).appendChild(st);

  /* ---- the page's sidebar button ---- */
  function nudge() { window.dispatchEvent(new Event('resize')); setTimeout(() => window.dispatchEvent(new Event('resize')), 60); }
  addEventListener('message', (e) => {
    const d = e.data; if (!d || d.type !== 'transitpedia:sidebar') return;
    root.classList.toggle('side-off', !d.open); nudge();
  });

  /* ---- running list grouped by line ---- */
  const CHEV = '<svg viewBox="0 0 10 10"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const folded = new Set(); let busy = false, obs = null;
  function lineOf(row) { const n = row.querySelector('.ln') || row.querySelector('.rt'); return n ? n.textContent.split(' · ')[0].trim() : ''; }
  function regroup(list) {
    if (busy) return; busy = true;
    try {
      const kids = [...list.children], rows = kids.filter((c) => c.classList.contains('row') && lineOf(c));
      if (!rows.length) return;
      const keys = new Set(rows.map(lineOf)); if (keys.size < 2) return;       // one line only: nothing to fold
      const out = []; let run = null;
      kids.forEach((c) => {
        if (c.classList.contains('row') && lineOf(c)) { if (!run) out.push(run = new Map()); const k = lineOf(c); if (!run.has(k)) run.set(k, []); run.get(k).push(c); }
        else { run = null; out.push(c); }
      });
      const frag = document.createDocumentFragment();
      out.forEach((o) => {
        if (!(o instanceof Map)) { frag.appendChild(o); return; }
        o.forEach((rs, k) => {
          const has = rs.some((r) => r.classList.contains('sel')), shut = folded.has(k) && !has;
          const g = document.createElement('div'); g.className = 'lg'; g.dataset.lk = k;
          const h = document.createElement('button'); h.type = 'button'; h.className = 'lgh'; h.setAttribute('aria-expanded', String(!shut));
          h.innerHTML = CHEV + '<span class="lgn"></span><span class="lgc">' + rs.length + '</span>'; h.querySelector('.lgn').textContent = k;
          const b = document.createElement('div'); b.className = 'lgb'; b.hidden = shut;
          rs.forEach((r) => { const ln = r.querySelector('.ln'); if (ln && ln.textContent.trim() === k) r.classList.add('lgdup'); b.appendChild(r); });   /* the header already says the line */
          g.append(h, b); frag.appendChild(g);
        });
      });
      list.replaceChildren(frag);
    } finally { busy = false; if (obs) obs.takeRecords(); }
  }
  function setup() {
    const list = document.getElementById('list'); if (!list) return;
    if (list.hasAttribute('data-nogroup')) return;
    list.addEventListener('click', (e) => {
      const h = e.target.closest && e.target.closest('.lgh'); if (!h) return;
      const g = h.parentNode, k = g.dataset.lk, shut = h.getAttribute('aria-expanded') === 'true';
      h.setAttribute('aria-expanded', String(!shut)); g.querySelector('.lgb').hidden = shut; shut ? folded.add(k) : folded.delete(k);
    });
    obs = new MutationObserver(() => regroup(list)); obs.observe(list, { childList: true }); regroup(list);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
})();

/* Clock model. Every map simulates in the AGENCY's local time (so its schedule is valid), starting from "now" there.
   The clock shows the VIEWER's own time + zone by default; clicking it flips to the agency's time + zone (and back). */
(function () {
  const dtf = {};
  function fmtr(tz, o) { const k = tz + '|' + Object.keys(o).join(); return dtf[k] || (dtf[k] = new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: tz, hourCycle: 'h23' }, o))); }
  function wall(tz, d) {
    if (!tz) return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    const p = fmtr(tz, { hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(d), g = n => +p.find(x => x.type === n).value;
    return (g('hour') % 24) * 3600 + g('minute') * 60 + g('second');
  }
  function abbr(tz, d) {
    try { return fmtr(tz || undefined, { timeZoneName: 'short' }).formatToParts(d).find(x => x.type === 'timeZoneName').value; } catch (e) { return ''; }
  }
  window.__nowSec = function (tz) { return wall(tz, new Date()); };
  let agency = false; try { agency = localStorage.getItem('clkAgency') === '1'; } catch (e) {}
  const C = window.__clk = {
    get agency() { return agency; },
    parts(tSec, tz) {
      const d = new Date(); let shift = 0, ab;
      if (agency) ab = abbr(tz, d);
      else { shift = wall(null, d) - wall(tz, d); if (shift > 43200) shift -= 86400; if (shift <= -43200) shift += 86400; ab = abbr(null, d); }
      const s = (((Math.floor(tSec + shift)) % 86400) + 86400) % 86400, h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
      return { t: (h % 12 || 12) + ':' + String(m).padStart(2, '0'), ap: h >= 12 ? 'PM' : 'AM', tz: ab };
    },
    /* h:mm as fixed-width cells, so the time never changes width as it runs or is scrubbed (a missing tens-of-hours digit keeps its space) */
    cells(s) {
      const i = s.indexOf(':'), hh = s.slice(0, i), mm = s.slice(i + 1), dg = (x) => x.split('').map((c) => '<i class="dg">' + c + '</i>').join('');
      return (hh.length < 2 ? '<i class="dg" style="visibility:hidden">0</i>' : '') + dg(hh) + '<i class="co">:</i>' + dg(mm);
    },
    html(tSec, tz) { const p = C.parts(tSec, tz); return C.cells(p.t) + '<small>' + p.ap + '</small><em>' + p.tz + '</em>'; },
    toggle() { agency = !agency; try { localStorage.setItem('clkAgency', agency ? '1' : '0'); } catch (e) {} window.dispatchEvent(new Event('clkmode')); }
  };
  /* Live dot: green when the sim is at the real current time at 1x, grey otherwise; clicking it jumps back to now. */
  C.live = function (cfg) {
    const mk = () => {
      const el = document.getElementById('clock') || document.getElementById('clkBtn'); if (!el) return;
      const b = document.createElement('button'); b.id = 'livedot'; b.type = 'button'; b.innerHTML = '<i></i>';
      el.parentNode.insertBefore(b, el);
      const upd = () => {
        let d = Math.abs(cfg.get() - wall(cfg.tz, new Date())) % 86400; d = Math.min(d, 86400 - d);
        const on = cfg.on() && cfg.spd() && d < 4; b.classList.toggle('on', on);
        b.title = on ? 'Live: running at the current time' : 'Go to current time'; b.setAttribute('aria-label', b.title);
      };
      b.onclick = () => { cfg.set(wall(cfg.tz, new Date())); if (!cfg.on()) { const pl = document.getElementById('play'); if (pl) pl.click(); } upd(); };
      setInterval(upd, 400); upd();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mk); else mk();
  };
  const st = document.createElement('style');
  st.textContent = '#spd,#speed{min-width:44px;text-align:center}@media (min-width:821px){#bar{gap:18px!important;padding:8px max(20px,env(safe-area-inset-right,0px)) 9px max(20px,env(safe-area-inset-left,0px))!important;box-sizing:border-box}}.dg,.co{display:inline-block;text-align:center;font-style:normal}.dg{width:.62em}.co{width:.3em}#clock small{display:inline-block;min-width:1.75em}#clock,#clkBtn{cursor:pointer}#clock em{display:inline!important}#livedot{flex:none;width:18px;height:22px;padding:0;margin-right:2px;background:none;border:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}#livedot i{width:8px;height:8px;border-radius:50%;background:#7b8696;opacity:.6;transition:background .2s,box-shadow .2s}#livedot.on i{background:#2fbf71;opacity:1;box-shadow:0 0 0 3px rgba(47,191,113,.2)}#clkBtn .dot{display:none}';
  document.head.appendChild(st);
  function bind() {
    const el = document.getElementById('clock') || document.getElementById('clkBtn'); if (!el) return;
    el.addEventListener('click', C.toggle); el.title = 'Click to switch between your time and the agency’s time';
    window.addEventListener('clkmode', () => { try { if (typeof drawClock === 'function') drawClock(); } catch (e) {} });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();


/* Day-load histogram. One look for every map: bars exactly 2 css px wide with a 1 css px gap, on whole device pixels, so the
   stroke weight is identical on every map and screen. Each bar is the vehicle count at the bar's own time (no max-pooling),
   the bar under the playhead is full height. ser = counts evenly spaced over the span; frac = playhead position 0..1. */
(function () {
  const H = window.__hist = {
    layout(w, dpr) { const bw = Math.max(1, Math.round(2 * dpr)), gap = Math.max(1, Math.round(dpr)), pitch = bw + gap; return { bw, gap, pitch, N: Math.max(1, Math.floor((w + gap) / pitch)) }; },
    draw(g, ser, frac, col, ov) {
      const cv = g.canvas, w = cv.width, h = cv.height, r = cv.getBoundingClientRect(), dpr = r.width ? w / r.width : (window.devicePixelRatio || 1);
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); if (!w || !h || !ser || !ser.length) return;
      const L = H.layout(w, dpr), N = L.N, n = ser.length; cv.__hl = { N, pitch: L.pitch }; cv.__ser = ser; cv.__fr = frac;
      let mx = 1; for (let i = 0; i < n; i++) if (ser[i] > mx) mx = ser[i];
      const cb = Math.min(N - 1, Math.max(0, Math.floor(frac * N))), pad = Math.round(2 * dpr), min = Math.max(1, Math.round(dpr));
      for (let i = 0; i < N; i++) {
        const v = ser[Math.min(n - 1, Math.floor((i + 0.5) * n / N))], bh = i === cb ? h : Math.max(min, Math.round(v / mx * (h - pad)));
        g.fillStyle = i === cb ? col.cur : i < cb ? col.past : col.fut; g.fillRect(i * L.pitch, h - bh, L.bw, bh);
        if (ov) { const o = ov.ser[Math.min(ov.ser.length - 1, Math.floor((i + 0.5) * ov.ser.length / N))]; if (o > 0) { g.fillStyle = ov.col; g.fillRect(i * L.pitch, h - Math.max(min, Math.round(o / mx * (h - pad))), L.bw, Math.max(min, Math.round(o / mx * (h - pad)))); } }
      }
    },
    frac(cv, clientX) { const r = cv.getBoundingClientRect(), hl = cv.__hl, x = (clientX - r.left) * (cv.width / (r.width || 1)); return Math.max(0, Math.min(0.9999, x / (hl ? hl.N * hl.pitch : cv.width))); }
  };
})();
