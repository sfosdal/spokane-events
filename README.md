# Spokane Events

Event feed and calendar for Spokane: the Arena, ONE Spokane Stadium, First
Interstate Center for the Arts, the Fox, the Bing, Riverfront Park, the
Knitting Factory, the casinos in Airway Heights (Northern Quest, Spokane Live),
Avista Stadium, Roos Field in Cheney and the fairgrounds — with the home teams'
seasons (Chiefs, Indians, Velocity, Zags, Eagles, and the Seattle clubs the
city follows: Seahawks, Mariners, Kraken) in a Teams view.

Live at **https://spokane.here.events/** once the domain is wired (GitHub
Pages, built by the Actions workflow once a day at noon Pacific).

One of the cities on the lqa-events codebase: everything that makes this
Spokane's is `site/city.js` (every team, venue, type, default, share-code
registry and string), `site/index.html`, `scripts/fetch-events.mjs` (the
sources), `scripts/sources.mjs` (the church filter and its exempt list),
`site/embed.js`, `outlook.json`, `scripts/data/postseason.json`,
`channels.json`, the manifest and icons (the Riverfront Park clock tower in
lilac, rendered from `favicon.svg`). Everything else is lqa-events' own, byte
for byte — copy from there, never edit here.

## Embed

```html
<div id="spokane-events"></div>
<script src="https://spokane.here.events/embed.js" data-max="8" defer></script>
```

## Sources

- **Ticketmaster Discovery API** — every room by its venue id (every page):
  14 rooms, from the Arena to the Bing. Northern Quest is two Ticketmaster
  venues (the pavilion and BECU Live), read id by id (`tm.ids`). There is no
  city sweep. Calls are paced 1.5 s apart with a back-off on 429 because a
  dozen sister sites share the one key. Church events are left out
  (`isChurch`; `CHURCH_EXEMPT` for a room that merely bears a church's name).
- **Seasons** — HockeyTech's WHL feed for the Chiefs; MLB's stats API for the
  Indians (Northwest League, sportId 13); ESPN for Velocity (USL League One),
  the Zags, the Eagles and the Seattle clubs (`scripts/schedules.mjs`, shared
  with lqa). The Indians', Zags' and Eagles' home games enter the listing from
  those schedules (`inject`) — Ticketmaster lists none of Gonzaga's and only
  some of the others'.

Known gap: ESPN's plain schedule call for Gonzaga answers with the (empty)
preseason, and the shared adapter asks for the regular season by name for the
NBA only, so the Zags have `strip: false` (a filter row, no Teams tab) until
lqa extends that to `mens-college-basketball`. The Zephyr (USL Super League)
have no ESPN league code and are not listed.

Next to add: the rooms whose shows Ticketmaster never lists (the Big Dipper,
Lucky You Lounge, the Podium, Chateau Rive, the Spokane Pavilion's own box
office), Hoopfest and the Lilac Bloomsday Run as festivals, the Spokane Public
Library's calendar.

## Local run

```sh
cp .env.example .env   # TICKETMASTER_API_KEY=…
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # ALLOW_NO_ARCHIVE only until the site has published once
node --test scripts/*.test.mjs
```
