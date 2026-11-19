/* Station labels for the live maps: progressive disclosure.
   - zoomed out: no names; zoom in: terminals and key stations first (the engine sorts stations by importance), then more, until every station is named
   - the type size grows a little with zoom so a dense map never looks crowded
   - candidate positions go around the dot (sides of the track first, then east/west, diagonals, north/south) and skip any spot that would sit on another label or on another station's dot
   Each map's own label block calls into this (see the Labels.* calls in its drawLabels / label loop). */
(function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const L = window.Labels = {};
  /* zoom level used for disclosure: the map's own zoom (log2 of scale over fit scale), a little extra while a line is highlighted */
  L.lvl = (z, sel) => z + (sel ? 1.3 : 0);
  /* share of the stations, most important first, that are named at this level */
  L.frac = (zz) => zz < 0.3 ? 0 : 0.07 + 0.93 * Math.pow(clamp((zz - 0.3) / 3.7, 0, 1), 1.4);
  L.px = (zz) => clamp(10 + zz * 0.55, 10, 12.5);
  L.gap = (zz) => 8 + clamp(zz * 0.35, 0, 3);
  const rankOf = (s) => s.rank != null ? s.rank : (s.term ? 30 : 0) + (s.keep ? 15 : 0) + (s.routes ? s.routes.length : 1) * 3;
  let ordKey = null, ord = null;
  function order(list) {
    if (ordKey === list && ord && ord.n === list.length) return ord.m;
    const m = new Map(), a = list.slice().sort((p, q) => rankOf(q) - rankOf(p));
    a.forEach((s, i) => m.set(s, i)); ordKey = list; ord = { m, n: list.length }; return m;
  }
  L.keep = (s, list, zz) => { const f = L.frac(zz); if (f <= 0) return false; const i = order(list).get(s); return i == null ? true : i < Math.ceil(list.length * f); };
  /* directions to try, as unit-ish vectors away from the dot. nx,ny is the normal of the nearest track */
  L.cands = (nx, ny) => {
    const sgn = nx >= 0 ? 1 : -1;
    return [[nx * sgn, ny * sgn], [-nx * sgn, -ny * sgn], [1, 0], [-1, 0], [0.8, -0.8], [0.8, 0.8], [-0.8, -0.8], [-0.8, 0.8], [0, -1], [0, 1]];
  };
  /* dots on screen, in a coarse grid, so a label is never set on top of someone else's station */
  let grid = null, cell = 48;
  L.begin = (list) => {
    grid = new Map();
    list.forEach((s) => {
      if (!s.vis || s.sx == null) return;
      const k = Math.floor(s.sx / cell) + ',' + Math.floor(s.sy / cell); (grid.get(k) || grid.set(k, []).get(k)).push(s);
    });
  };
  L.dotHit = (b, self) => {
    if (!grid) return false;
    const x0 = Math.floor((b[0] - 6) / cell), x1 = Math.floor((b[2] + 6) / cell), y0 = Math.floor((b[1] - 6) / cell), y1 = Math.floor((b[3] + 6) / cell);
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
      const a = grid.get(x + ',' + y); if (!a) continue;
      for (const s of a) {
        if (s === self) continue;
        const cx = clamp(s.sx, b[0], b[2]), cy = clamp(s.sy, b[1], b[3]);
        if ((cx - s.sx) ** 2 + (cy - s.sy) ** 2 < 25) return true;
      }
    }
    return false;
  };
})();
