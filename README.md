# [Commute Planner](https://j0hnc0yne.github.io/commuter/)

A static page that compares weekday Metra commutes from home (Wauconda) to work (77 W. Wacker) through three nearby stations:

| Line  | Station           | Downtown terminal |
|-------|-------------------|-------------------|
| NCS   | Mundelein         | Union Station     |
| MD-N  | Prairie Crossing  | Union Station     |
| UP-NW | Barrington        | Ogilvie           |

It shows a **To Work** table (leave home after 6:00 AM, at work by 9:30 AM) and a **To Home** table (leave work after 3:30 PM, home by 7:00 PM). Chips at the top toggle each line on and off, and the fastest option in each table is highlighted.

## Files

- `index.html`: the page (HTML, CSS and JS in one file, no build step).
- `data/config.js`: your settings (drive/walk times, time windows). Edit by hand.
- `data/schedules.js`: every weekday train for the three stations. **Generated**, don't edit.
- `scripts/update_schedules.py`: regenerates `data/schedules.js` from Metra's PDFs.

## Changing assumptions

Edit `window.COMMUTE_CONFIG` in `data/config.js`:

- `driveMin`: drive from home to that station.
- `walkMin`: walk between the downtown terminal and 77 W. Wacker.
- `parkBufferMin`: time to park and reach the platform in the morning.
- `window`: the earliest departure and latest arrival times for each direction.

## Updating schedules

When Metra publishes a new schedule, run this from the repo root:

```sh
python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt   # first time only
.venv/bin/python scripts/update_schedules.py --dry-run   # preview what it parsed
.venv/bin/python scripts/update_schedules.py             # rewrite data/schedules.js
git diff data/schedules.js                               # review, then commit and push
```

The script downloads the [NCS](https://schedules.metrarail.com/pdf/NCS.pdf), [MD-N](https://schedules.metrarail.com/pdf/MD-N.pdf) and [UP-NW](https://schedules.metrarail.com/pdf/UP-NW.pdf) PDFs and reads the weekday tables. It keeps every train that stops at both your station and the downtown terminal. It never touches `data/config.js`.

If Metra changes the PDF layout or renames a station, the script stops without writing anything and lists the station names it found. To switch stations, edit the `LINES` table at the top of the script, plus the matching `station` in `data/config.js`.

`--pdf-dir DIR` parses PDFs you've already downloaded instead of fetching them.

## Viewing

- Locally: open `index.html` in a browser.
- GitHub Pages: push to GitHub, then go to **Settings → Pages**, choose **Deploy from a branch**, and pick `main` / `/ (root)`.
