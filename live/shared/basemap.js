/* Basemap helper: draws the layers in base-ne.js under a map. Works for canvas (Basemap.draw) and SVG (Basemap.svg).
   The caller supplies how to project lon/lat into its own coordinates:  fx(lon,lat) -> x,  fy(lon,lat) -> y. */
(function () {
  const B = window.BASE_NE; if (!B) { window.Basemap = null; return; }
  const dec = (a) => { const n = a.length / 2, lon = new Float64Array(n), lat = new Float64Array(n); let x = 0, y = 0;
    for (let i = 0; i < n; i++) { x += a[2 * i]; y += a[2 * i + 1]; lon[i] = x / B.q; lat[i] = y / B.q; } return { lon, lat, n }; };
  const L = { land: B.land.map(dec), county: B.county.map(dec), coast: B.coast.map(dec), state: B.state.map(dec), urban: B.urban.map(dec),
    rivers: B.rivers.map(dec), road: B.roads.filter((r) => r[0] === 0).map((r) => dec(r[1])), road2: B.roads.filter((r) => r[0] === 1).map((r) => dec(r[1])) };
  const lw = (base, z) => base * Math.min(2.2, Math.max(0.75, 1 + 0.3 * Math.log2(Math.max(0.01, z || 1))));
  function trace(g, list, fx, fy, close) {
    g.beginPath();
    for (const s of list) { for (let i = 0; i < s.n; i++) { const x = fx(s.lon[i], s.lat[i]), y = fy(s.lon[i], s.lat[i]); i ? g.lineTo(x, y) : g.moveTo(x, y); } if (close) g.closePath(); }
  }
  function draw(g, fx, fy, o) {
    o = o || {}; const z = o.z || 1; g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
    const lt = !!(window.Theme && Theme.light);
    const C = lt ? { land: 'rgba(60,80,110,0.05)', urban: 'rgba(60,80,110,0.07)', county: 'rgba(70,90,120,0.20)', state: 'rgba(60,80,110,0.32)',
        road2: 'rgba(70,90,120,0.14)', road: 'rgba(70,90,120,0.22)', rivers: 'rgba(50,110,175,0.38)', coast: 'rgba(40,105,180,0.50)' }
      : { land: 'rgba(150,170,200,0.04)', urban: 'rgba(150,170,200,0.05)', county: 'rgba(120,140,170,0.17)', state: 'rgba(140,160,190,0.28)',
        road2: 'rgba(130,150,180,0.11)', road: 'rgba(130,150,180,0.18)', rivers: 'rgba(70,115,170,0.22)', coast: 'rgba(80,130,190,0.30)' };
    trace(g, L.land, fx, fy, true); g.fillStyle = C.land; g.fill();
    trace(g, L.urban, fx, fy, true); g.fillStyle = C.urban; g.fill();
    trace(g, L.county, fx, fy); g.strokeStyle = C.county; g.lineWidth = 1; g.stroke();
    trace(g, L.state, fx, fy); g.strokeStyle = C.state; g.lineWidth = 1; g.stroke();
    trace(g, L.road2, fx, fy); g.strokeStyle = C.road2; g.lineWidth = lw(0.6, z); g.stroke();
    trace(g, L.road, fx, fy); g.strokeStyle = C.road; g.lineWidth = lw(0.9, z); g.stroke();
    trace(g, L.rivers, fx, fy); g.strokeStyle = C.rivers; g.lineWidth = lw(1.6, z); g.stroke();
    trace(g, L.coast, fx, fy); g.strokeStyle = C.coast; g.lineWidth = lw(1.2, z); g.stroke();
    g.restore();
  }
  /* SVG: appends one <path> per layer to group `g` (styled by the page via the .bm classes); `el(name, attrs, parent)` creates SVG nodes. */
  function svg(g, fx, fy, el) {
    const d = (list, close) => { let s = ''; for (const q of list) { for (let i = 0; i < q.n; i++) s += (i ? 'L' : 'M') + fx(q.lon[i], q.lat[i]).toFixed(1) + ' ' + fy(q.lon[i], q.lat[i]).toFixed(1); if (close) s += 'Z'; } return s; };
    [['land', L.land, 1], ['urban', L.urban, 1], ['county', L.county], ['state', L.state], ['road2', L.road2], ['road', L.road], ['rivers', L.rivers], ['coast', L.coast]]
      .forEach(([c, l, cl]) => el('path', { class: 'bm ' + c, d: d(l, cl) }, g));
  }
  window.Basemap = { draw, svg };
})();
