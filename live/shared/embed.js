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
    list.addEventListener('click', (e) => {
      const h = e.target.closest && e.target.closest('.lgh'); if (!h) return;
      const g = h.parentNode, k = g.dataset.lk, shut = h.getAttribute('aria-expanded') === 'true';
      h.setAttribute('aria-expanded', String(!shut)); g.querySelector('.lgb').hidden = shut; shut ? folded.add(k) : folded.delete(k);
    });
    obs = new MutationObserver(() => regroup(list)); obs.observe(list, { childList: true }); regroup(list);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
})();

/* Seconds since midnight on the viewer's own clock: the starting time of every map's simulated clock.
   (The argument is the agency's time zone; it is accepted so a map could use it, but the viewer's own time is what is shown.) */
window.__nowSec = function () { const d = new Date(); return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds(); };
