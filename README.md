# Transit-pedia

Single-page site: an outlined US map with a dot per metro area. Click a city for my custom diagrams (PDF) and interactive live maps.

* `index.html` — the site (self-contained)
* `000/maps/` — diagram PDFs (kept for linking by URL; the page itself only links the North Jersey one)
* `0_thumb/` — diagram thumbnails (only the NJ one is used, in its hover card)
* `outlines/` — network outline images shown on the city cards
* `live/<name>/` — interactive live maps, each its own page (see `live/shared/README.md` for how they share one look)
* `archive/` — the previous portfolio homepage, kept for reference
* `artifacts/` — original live-map source files

Live maps are plain static pages, so GitHub Pages publishes this repo as-is from `main`.
