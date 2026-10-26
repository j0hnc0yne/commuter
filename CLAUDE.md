# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build GitHub Pages site (https://j0hnc0yne.github.io/commuter/) that compares weekday Metra commutes between home (Wauconda) and work (77 W. Wacker) via three stations: NCS/Mundelein, MD-N/Prairie Crossing, UP-NW/Barrington. The original requirements are in `specs/requirements.md`. There are no tests, linters, or package.json; to view changes, open `index.html` in a browser. Pushing to `main` deploys.

## Commands

Regenerate the train data when Metra publishes a new schedule (run from the repo root):

```sh
python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt   # first time only
.venv/bin/python scripts/update_schedules.py --dry-run     # print parsed trains, write nothing
.venv/bin/python scripts/update_schedules.py               # download PDFs, rewrite data/schedules.js
.venv/bin/python scripts/update_schedules.py --pdf-dir DIR # parse already-downloaded NCS.pdf, MD-N.pdf, UP-NW.pdf
```

## Architecture

Three files are loaded in order by `index.html` as plain `<script>` tags that set globals:

- `data/config.js` → `window.COMMUTE_CONFIG`: hand-edited settings (per-line `driveMin`, `walkMin`, station/terminal names, `parkBufferMin`, and the time windows for each direction).
- `data/schedules.js` → `window.SCHEDULES` and `window.SCHEDULE_INFO`: **generated** by `scripts/update_schedules.py`. Don't hand-edit it. Times are 24-hour `"HH:MM"` strings, and values past 24:00 mean after midnight. `inbound` = home station → downtown, `outbound` = downtown → home station.
- The inline script in `index.html` (an IIFE; all HTML, CSS and JS live in this one file) builds trips from those globals:
  - To Work: leave home = depart − `driveMin` − `parkBufferMin`; arrive work = arrive + `walkMin`.
  - To Home: leave work = depart − `walkMin`; arrive home = arrive + `driveMin` (no park buffer).
  - A trip is kept only if it fits entirely within the configured window. The fastest visible row is highlighted.
  - Line toggle state is saved in `localStorage` (`commute-lines`). The To Work / To Home tab comes from a `#work`/`#home` hash, or else the time of day (12:00–17:59 → To Home, any other time → To Work). It also re-evaluates on `visibilitychange`.

Line keys (`NCS`, `MDN`, `UPNW`) are shared across files and must match: `COMMUTE_CONFIG.lines`, `SCHEDULES`, the `LINES` dict in `update_schedules.py`, and the CSS color variables `--NCS`/`--MDN`/`--UPNW` in `index.html`. Station names in the script's `LINES` must match the PDF's spelling (e.g. `"Ogilvie (OTC)"`), which can differ from the display names in `config.js`.

`update_schedules.py` uses pypdf layout-mode text extraction. It finds the "Weekday Inbound/Outbound" pages and matches times to train-number columns by horizontal position, because express trains leave blank cells. Within a train, times only move forward, which is how it resolves AM/PM and midnight. If a station isn't found, it exits without writing and lists the station names it did find.

## Gotchas

- `index.html` loads the data scripts with a cache-busting query (`data/config.js?t=2054`). Bump it when you change `config.js` or `schedules.js`, or phones may show stale data.
- The `AGENTS.md` in the parent directory (`~/git/AGENTS.md`) describes an unrelated Spring Boot project. Ignore it here.
