# Shared map UI

`family.css` is the common look of the live maps (dark, full-bleed map, right-hand roster, bottom transport bar,
Focus legend, zoom buttons). It was extracted from the native maps.

**Native maps** (own copy of the CSS inline, own engine and data): bay-rail, chicago, ct-rail, dfw-rail, gcrta,
la-rail, mbta, md-va-rail, portland-rail, septa, sound-transit.

**Restyled maps** (keep their own engine and data, but use `family.css` plus a small adapter inside the page):
amtrak, lirr, metro-north, nice-bus, nyc-subway. Midtown Bus is a one-off design and is left as it is.

## Rebuilding a restyled map on the native engine later
Each restyled page is a self-contained `index.html` with its data inline, so a rebuild is a drop-in replacement of that
one file. The native engine reads a JSON blob (`<script id="data" type="application/json">`) with: `routes`, `groups`,
`shapes` (delta-encoded lon/lat), `stops`, `seqs` (stop sequences with distance along the shape), `heads`, `pats`
(stop-time patterns), `trips` (per day type: pattern, start time, train number), `hist`, plus optional base-map layers
(`land`, `counties`, `rivers`, `coast`, `ghost`). Convert a GTFS feed to that shape, then use e.g. `live/chicago`
as the template.

## Base layer
`base-ne.js` + `basemap.js` give the maps that had no background a basic one: land tint, county and state lines, coastline,
the Hudson / Connecticut / Delaware rivers, urban areas and major highways for NYC, Long Island, the Hudson Valley and
Connecticut (sources: US Census counties via `us-atlas`, Natural Earth 1:10m). LIRR, Metro-North, NICE Bus and NYC Subway use it.
Amtrak already draws state and coast lines, the native maps ship their own, and Midtown Bus is a diagram, so none of those use it.
Each page tells `Basemap` how to turn lon/lat into its own coordinates. A finer street grid would need an OpenStreetMap extract.
