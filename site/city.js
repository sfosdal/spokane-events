// The city — every fact that makes this calendar Spokane's rather than
// another town's, in one place (2026-10-11: one of the cities built on
// lqa-events the same weekend as Chicago, Portland and Madison). The browser
// (filter.js, app.js) and the build (scripts/*.mjs) both read it; nothing
// else names a venue or a team. The shared files (app.js, filter.js,
// styles.css bar its --v-* hues, scripts/*.mjs bar fetch-events.mjs and
// sources.mjs) are lqa-events' own, byte for byte — see README "Sister sites".
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right. Per team:
  //   re        the title match
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   espn      ESPN's sport/league/team id, where the club is on ESPN (the
  //             Zags, the Eagles, Velocity, and the Seattle clubs): season,
  //             form block, news and transactions come from there
  //             (schedules.mjs). The Chiefs' season comes from HockeyTech's
  //             WHL feed and the Indians' from MLB's stats API (the
  //             Northwest League is sportId 13), as Everett's Silvertips and
  //             AquaSox
  //   inject    the club's home games enter the listing from the league's
  //             schedule (fetch-events.mjs) because no ticket feed here
  //             lists them in full: url = where the title links
  //   strip     false = a filter row but no tab in the Teams view (no season
  //             fetched this run — see the Zags)
  //   division  (baseball) the division rivals by the abbreviations the
  //             schedule carries, for the standings line
  //   club      the club's name on Ticketmaster; news the outlets' feeds;
  //             wiki the article (club: true — no season pages on Wikipedia);
  //             opens when the season usually starts
  var ST = function (s) { return ['https://www.seattletimes.com/sports/' + s + '/feed/', 'Seattle Times']; }; // the Seattle clubs' beat
  var WHL = { league: 'whl', key: '41b145a848f4bd67' }; // HockeyTech's WHL feed, the key chl.ca's own pages carry
  var TEAMS = [
    // Spokane Chiefs, WHL (since 1985), the Arena. Ticketmaster lists every home game at the Arena, so no inject.
    { slug: 'chiefs', label: 'Chiefs', name: 'Spokane Chiefs', abbr: 'SPO', re: /\bchiefs\b/i, sport: 'hockey', venue: 'Spokane Arena', colors: ['#c8102e', '#041e42'],
      season: { kind: 'hockeytech', league: WHL.league, key: WHL.key, id: 215, leagueName: 'WHL' }, form: { kind: 'hockeytech', league: WHL.league, key: WHL.key, id: 215 },
      logo: 'https://assets.leaguestat.com/whl/logos/215.png', schedule: 'https://spokanechiefs.com/schedule',
      club: 'Spokane Chiefs', opens: 'late September', wiki: { title: 'Spokane Chiefs', club: true } },
    // Spokane Indians, High-A Northwest League (Rockies affiliate), Avista Stadium
    { slug: 'indians', label: 'Indians', name: 'Spokane Indians', abbr: 'SPO', re: /spokane indians|\bindians\b/i, sport: 'baseball', venue: 'Avista Stadium', colors: ['#002d62', '#c41230'],
      season: { kind: 'mlb', id: 486, sportId: 13 }, form: { kind: 'milb', id: 486, league: 126, leagueName: 'Northwest League' },
      inject: { url: 'https://www.milb.com/spokane/tickets' }, // Ticketmaster lists the home stands without first-pitch times; the league's schedule supplies the rest
      logo: 'https://www.mlbstatic.com/team-logos/486.svg', schedule: 'https://www.milb.com/spokane/schedule',
      club: 'Spokane Indians', opens: 'early April', wiki: { title: 'Spokane Indians', club: true },
      news: [['https://www.milb.com/spokane/feeds/news/rss.xml', 'MiLB.com']] },
    // Spokane Velocity FC, USL League One (since 2024), ONE Spokane Stadium — Ticketmaster lists the matches
    { slug: 'velocity', label: 'Velocity', re: /velocity/i, sport: 'soccer', venue: 'ONE Spokane Stadium', colors: ['#0b2c4a', '#2bb3b1'],
      espn: { sport: 'soccer', league: 'usa.usl.l1', id: '22130' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/22130.png', schedule: 'https://spokanevelocityfc.com/schedule/',
      club: 'Spokane Velocity FC', opens: 'March', wiki: { title: 'Spokane Velocity FC' } },
    // Gonzaga men's basketball, WCC, McCarthey Athletic Center. Ticketmaster
    // lists nothing there, so the home games are injected from ESPN. strip:
    // false for now — ESPN's plain schedule call answers with the preseason
    // (empty) and the shared adapter asks for the regular season by name for
    // the NBA only (schedules.mjs espn()); once lqa extends that to
    // mens-college-basketball, drop the flag and the tab appears.
    { slug: 'gonzaga', label: 'Zags', name: 'Gonzaga', re: /gonzaga|\bzags\b/i, sport: 'basketball', venue: 'McCarthey Athletic Center', colors: ['#041e42', '#c8102e'],
      espn: { sport: 'basketball', league: 'mens-college-basketball', id: '2250' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      inject: { url: 'https://gozags.com/tickets', name: 'Gonzaga' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2250.png', schedule: 'https://gozags.com/sports/mens-basketball/schedule',
      club: 'Gonzaga Bulldogs', opens: 'November', wiki: { title: "Gonzaga Bulldogs men's basketball", club: true } },
    // Eastern Washington football, Big Sky, Roos Field in Cheney (the red turf). Ticketmaster
    // lists some home games; the rest enter from ESPN. The title match avoids a bare
    // "Eagles" — the band plays the Arena.
    { slug: 'eagles', label: 'Eagles', name: 'Eastern Washington', re: /eastern washington|\bewu\b/i, sport: 'football', venue: 'Roos Field', colors: ['#a10022', '#000000'],
      espn: { sport: 'football', league: 'college-football', id: '331' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      inject: { url: 'https://goeags.com/tickets', name: 'Eastern Washington' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/331.png', schedule: 'https://goeags.com/sports/football/schedule',
      club: 'Eastern Washington Eagles', opens: 'late August', wiki: { title: 'Eastern Washington Eagles football', club: true } },
    // The Seattle clubs Spokane follows: Teams view only — their home grounds
    // are not Spokane venues, so no games enter the listing (no `inject`).
    // The records are lqa-events' own, kept in step with its city.js.
    { slug: 'seahawks', label: 'Seahawks', re: /seahawks/i, sport: 'football', venue: 'Lumen Field', colors: ['#002244', '#69be28'],
      espn: { sport: 'football', league: 'nfl', id: '26' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', schedule: 'https://www.seahawks.com/schedule/',
      club: 'Seattle Seahawks', opens: 'September', wiki: { title: 'Seattle Seahawks', startYear: true },
      news: [ST('seahawks'), ['https://www.seahawks.com/rss/news', 'Seahawks.com'], ['https://www.fieldgulls.com/rss/current.xml', 'Field Gulls']],
      youtube: ['UCzkFCRiMcOBeef8xcaqipmw', 'UCDVYQ4Zhbm3S2dlz7P1GBDg'] }, // @Seahawks, @NFL
    { slug: 'mariners', label: 'Mariners', re: /mariners/i, sport: 'baseball', venue: 'T-Mobile Park', colors: ['#0c2c56', '#005c5c'],
      espn: { sport: 'baseball', league: 'mlb', id: '12' }, season: { kind: 'mlb', id: 136 }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sea.png', schedule: 'https://www.mlb.com/mariners/schedule',
      club: 'Seattle Mariners', opens: 'late March', wiki: { title: 'Seattle Mariners' },
      division: ['HOU', 'LAA', 'ATH', 'TEX'], // AL West, by the abbreviations the schedule carries (ATH since the Athletics left Oakland)
      news: [ST('mariners'), ['https://www.mlb.com/mariners/feeds/news/rss.xml', 'MLB.com'], ['https://www.lookoutlanding.com/rss/current.xml', 'Lookout Landing']],
      youtube: ['UCWWLs-O8JGYYcNea7AgumAA'] }, // @mariners (MLB's clips come from statsapi)
    { slug: 'kraken', label: 'Kraken', re: /kraken/i, sport: 'hockey', venue: 'Climate Pledge Arena', colors: ['#001628', '#99d9d9'],
      espn: { sport: 'hockey', league: 'nhl', id: '124292' }, season: { kind: 'nhl', abbrev: 'SEA' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/sea.png', schedule: 'https://www.nhl.com/kraken/schedule',
      club: 'Seattle Kraken', opens: 'early October', wiki: { title: 'Seattle Kraken' },
      news: [ST('kraken'), ['https://soundofhockey.com/feed/', 'Sound Of Hockey'], ['https://www.davyjoneslockerroom.com/rss/current.xml', "Davy Jones' Locker Room"]],
      youtube: ['UCxspiBq2xf5pLjz9_NMjoyw'] }, // @seattlekraken (the NHL's clips come from api-web)
  ];

  // The venues, one record each — downtown and the Arena first by size, then
  // the music rooms, the casinos and the grounds around town. Per venue:
  //   capacity how many people the place holds
  //   area     'town' for the music rooms, the casinos in Airway Heights, the
  //            ballpark in the Valley and Cheney (the panel's second group);
  //            absent = downtown and the Arena
  //   type     the event type when the title decides nothing
  //   cssVar   the hue styles.css sets for it (dark block --v-*); color
  //            the same hue as a value, for the series graph
  //   url      the venue's own events listing — not a ticket vendor
  //   icon     a mark for listings without a team crest
  //   tm       its Ticketmaster Discovery listing (fetch-events.mjs reads
  //            the venue by id — every page; `ids` when one building is
  //            several Ticketmaster venues). No city sweep: the rooms are
  //            read one by one, nothing else arrives.
  //   alias    the other spellings the feeds use for it, folded to this name
  // Looked at and left out (2026-10-11, nothing upcoming on Ticketmaster or
  // not on it at all): The Podium, the Big Dipper, Lucky You Lounge, Chateau
  // Rive, the Kroc Center, the Coeur d'Alene Casino. The Pullman rooms are
  // another city's build.
  // No festivals yet, so the panel's Festivals group folds away (app.js).
  var VENUES = {
    // --- Downtown and the Arena: the city's big rooms, the theatres, the stadium, the park ---
    'Spokane Arena': { // Numerica Veterans Arena on Ticketmaster since 2025 (Spokane Veterans Memorial Arena before); the city still says the Arena
      capacity: 12210,
      type: 'concert',
      cssVar: '--v-arena',
      color: '#ea8686',
      url: 'https://www.spokanearena.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.spokanearena.com&sz=128',
      tm: { id: 'KovZpZA1eklA', match: 'arena', fallbackUrl: 'https://www.spokanearena.com/events', exclude: /parking|suite/i },
      alias: /numerica|veterans (memorial )?arena|spokane arena/i,
    },
    'ONE Spokane Stadium': {
      capacity: 5000,
      type: 'sports',
      cssVar: '--v-onestadium',
      color: '#eab086',
      url: 'https://www.onespokanestadium.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.onespokanestadium.com&sz=128',
      tm: { id: 'KovZ917ARuj', match: 'one spokane', fallbackUrl: 'https://www.onespokanestadium.com/events', exclude: /parking/i },
      alias: /one spokane stadium/i,
    },
    'First Interstate Center for the Arts': { // the INB Performing Arts Center until 2019 — Broadway, the big comedians
      capacity: 2700,
      type: 'arts',
      cssVar: '--v-fica',
      color: '#eadb86',
      url: 'https://www.firstinterstatecenter.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.firstinterstatecenter.org&sz=128',
      tm: { id: 'KovZ917AxcJ', match: 'first interstate', fallbackUrl: 'https://www.firstinterstatecenter.org/events', exclude: /parking/i },
      alias: /first interstate cent|inb performing arts/i,
    },
    'Spokane Convention Center': {
      capacity: 2000,
      type: 'community',
      cssVar: '--v-convention',
      color: '#cdea86',
      url: 'https://www.spokanecenter.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.spokanecenter.com&sz=128',
      tm: { id: 'KovZ917AmMk', match: 'convention', fallbackUrl: 'https://www.spokanecenter.com/events' },
      alias: /spokane convention/i,
    },
    'The Fox Theater': { // Martin Woldson Theater at the Fox, the Spokane Symphony's hall
      capacity: 1600,
      type: 'arts',
      cssVar: '--v-fox',
      color: '#a2ea86',
      url: 'https://foxtheaterspokane.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=foxtheaterspokane.org&sz=128',
      tm: { id: 'KovZ917A53V', match: 'fox', fallbackUrl: 'https://foxtheaterspokane.org/events/' },
      alias: /woldson|fox theat/i,
    },
    'Bing Crosby Theater': {
      capacity: 750,
      type: 'arts',
      cssVar: '--v-bing',
      color: '#86ea94',
      url: 'https://bingcrosbytheater.com/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=bingcrosbytheater.com&sz=128',
      tm: { id: 'KovZ917A2d7', match: 'bing crosby', fallbackUrl: 'https://bingcrosbytheater.com/calendar' },
      alias: /bing crosby/i,
    },
    'Riverfront Park': { // the Expo '74 grounds — the Pavilion's summer concerts, the skate ribbon, the clock tower
      capacity: 5000,
      type: 'community',
      cssVar: '--v-riverfront',
      color: '#86eabf',
      url: 'https://my.spokanecity.org/riverfrontpark/events/',
      icon: 'https://www.google.com/s2/favicons?domain=my.spokanecity.org&sz=128',
      tm: { id: 'KovZpZA6v6tA', match: 'riverfront', fallbackUrl: 'https://my.spokanecity.org/riverfrontpark/events/' },
      alias: /riverfront park|spokane pavilion|pavilion at riverfront/i,
    },
    'McCarthey Athletic Center': { // the Kennel — Gonzaga basketball; Ticketmaster lists nothing here, the games come from ESPN
      capacity: 6000,
      type: 'sports',
      cssVar: '--v-mccarthey',
      color: '#86eaea',
      url: 'https://gozags.com/sports/mens-basketball/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=gozags.com&sz=128',
      tm: { id: 'KovZpZAEklvA', match: 'mccarthey', fallbackUrl: 'https://gozags.com/sports/mens-basketball/schedule' },
      alias: /mccarthey/i,
    },
    // --- Music rooms and around: downtown's club, the casinos in Airway Heights, the ballpark, Cheney, the fairgrounds ---
    'Knitting Factory': {
      area: 'town',
      capacity: 1500,
      type: 'concert',
      cssVar: '--v-knitting',
      color: '#86bfea',
      url: 'https://sp.knittingfactory.com/',
      icon: 'https://www.google.com/s2/favicons?domain=sp.knittingfactory.com&sz=128',
      tm: { id: 'KovZ917AJvZ', match: 'knitting', fallbackUrl: 'https://sp.knittingfactory.com/' },
      alias: /knitting factory/i,
    },
    'Northern Quest': { // the resort's Pend Oreille Pavilion indoors and BECU Live outdoors in summer — two Ticketmaster venues
      area: 'town',
      capacity: 5000,
      type: 'concert',
      cssVar: '--v-nquest',
      color: '#8694ea',
      url: 'https://www.northernquest.com/entertainment/',
      icon: 'https://www.google.com/s2/favicons?domain=www.northernquest.com&sz=128',
      tm: { ids: ['KovZpZAIv7JA', 'KovZ917AiIF'], match: 'northern quest', fallbackUrl: 'https://www.northernquest.com/entertainment/' },
      alias: /northern quest|becu live/i,
    },
    'Spokane Tribe Casino': { // Spokane Live, the casino's showroom
      area: 'town',
      capacity: 2500,
      type: 'concert',
      cssVar: '--v-tribe',
      color: '#a286ea',
      url: 'https://spokanetribecasino.com/spokane-live/',
      icon: 'https://www.google.com/s2/favicons?domain=spokanetribecasino.com&sz=128',
      tm: { id: 'Z7r9jZaAKZ', match: 'spokane tribe', fallbackUrl: 'https://spokanetribecasino.com/spokane-live/' },
      alias: /spokane tribe|spokane live/i,
    },
    'Avista Stadium': { // the Indians' ballpark, at the fairgrounds in the Valley
      area: 'town',
      capacity: 6803,
      type: 'sports',
      cssVar: '--v-avista',
      color: '#cd86ea',
      url: 'https://www.milb.com/spokane/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=www.milb.com&sz=128',
      tm: { id: 'ZFr9jZekdv', match: 'avista', fallbackUrl: 'https://www.milb.com/spokane/schedule', exclude: /parking/i },
      alias: /avista stadium/i,
    },
    'Roos Field': { // Eastern Washington's red turf, Cheney
      area: 'town',
      capacity: 8600,
      type: 'sports',
      cssVar: '--v-roos',
      color: '#ea86db',
      url: 'https://goeags.com/sports/football/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=goeags.com&sz=128',
      tm: { id: 'ZFr9jZaaad', match: 'roos', fallbackUrl: 'https://goeags.com/sports/football/schedule', exclude: /parking/i },
      alias: /roos field/i,
    },
    'Spokane County Fair & Expo Center': {
      area: 'town',
      capacity: 5000,
      type: 'community',
      cssVar: '--v-fair',
      color: '#ea86b0',
      url: 'https://www.spokanecounty.org/1176/Fair-Expo-Center',
      icon: 'https://www.google.com/s2/favicons?domain=www.spokanecounty.org&sz=128',
      tm: { id: 'ZFr9jZFd6a', match: 'fair', fallbackUrl: 'https://www.spokanecounty.org/1176/Fair-Expo-Center' },
      alias: /fair (and|&) expo|spokane county fair/i,
    },
  };

  // The usual view: every room on — nothing here lists nightly bar programs
  var DEFAULT_ON = ['Spokane Arena', 'ONE Spokane Stadium', 'First Interstate Center for the Arts', 'Spokane Convention Center', 'The Fox Theater', 'Bing Crosby Theater', 'Riverfront Park', 'McCarthey Athletic Center', 'Knitting Factory', 'Northern Quest', 'Spokane Tribe Casino', 'Avista Stadium', 'Roos Field', 'Spokane County Fair & Expo Center'];
  var DEFAULT_OFF = [];
  var PREFS_KNOWN_FROM = null; // no default-off venue yet, so nothing for saved prefs to be told about

  // Event types: every event lands in exactly one, from its flags, title,
  // then venue. The rows the panel shows, in order.
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — arena tours to club nights and the casino showrooms' },
    { key: 'sports', label: 'Sports', title: 'Chiefs, Indians, Velocity, Zags and Eagles home games' },
    { key: 'arts', label: 'Arts & Theater', title: 'Broadway at the First Interstate Center, the Spokane Symphony at the Fox, the Bing, comedy, dance' },
    { key: 'community', label: 'Community', title: 'Riverfront Park, the fair, the convention center, family days' },
  ];
  var MOVIE_VENUE = null; // no cinema here

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 30 slots from the first build: six base-36 digits.
  var CODE_LENGTH = 6;
  var REGISTRY = [
    ['venue', 'Spokane Arena'], ['venue', 'ONE Spokane Stadium'], ['venue', 'First Interstate Center for the Arts'], ['venue', 'Spokane Convention Center'], ['venue', 'The Fox Theater'], ['venue', 'Bing Crosby Theater'], ['venue', 'Riverfront Park'], ['venue', 'McCarthey Athletic Center'], ['venue', 'Knitting Factory'], ['venue', 'Northern Quest'], ['venue', 'Spokane Tribe Casino'], ['venue', 'Avista Stadium'], ['venue', 'Roos Field'], ['venue', 'Spokane County Fair & Expo Center'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'chiefs'], ['team', 'indians'], ['team', 'velocity'], ['team', 'gonzaga'], ['team', 'eagles'], ['team', 'seahawks'], ['team', 'mariners'], ['team', 'kraken'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Spokane', // the board drops it from the clubs' names ("Spokane Chiefs" → Chiefs)
    presetDefault: 'Every room — the Arena, the stadiums, the theatres, the casinos and the music rooms — every team and type',
    presetNeighborhood: 'Downtown and the Arena only',
    presetBig: 'Only the places that hold 2,000 or more — the Arena, the stadiums, the casinos and the big theatres',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing downtown and the Arena only.', big: 'Showing the big rooms only — the Arena, the stadiums, the casinos and the big theatres.' },
  };

  global.LQACity = {
    key: 'spokane',
    name: 'Spokane',
    site: 'https://spokane.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; spokane-events/1.0; +https://spokane.here.events/)',
    tz: 'America/Los_Angeles', tzName: 'Pacific', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    state: "Washington", stateOutline: 'M6.9 5.6L9.4 5.6L12.6 5.6L15.9 5.6L19.2 5.6L21.6 5.6L21.6 7.4L21.6 9.2L21.7 11.0L21.7 12.8L21.7 14.7L21.6 15.4L21.9 16.3L22.0 16.9L20.0 16.9L18.0 16.9L16.6 16.9L15.5 17.1L13.2 17.9L11.0 18.2L9.8 18.0L8.6 18.4L7.5 18.3L7.0 17.8L6.3 16.3L5.7 16.3L5.2 15.9L4.1 15.9L3.7 15.5L3.8 14.9L4.1 14.4L3.5 13.6L3.7 13.0L3.5 13.3L3.3 12.3L2.6 10.1L2.0 8.7L2.2 7.9L3.6 8.6L5.7 8.9L6.3 9.0L6.7 9.0L7.0 9.0L7.3 9.8L6.9 10.1L6.0 11.4L6.1 11.8L6.6 11.5L6.2 11.4L6.6 10.8L7.1 10.2L7.4 9.6L7.6 10.0L7.3 10.5L7.2 10.8L7.5 11.4L7.4 12.1L7.1 12.0L6.9 11.9L6.5 12.2L6.6 12.6L7.1 12.7L7.5 12.1L7.9 11.9L8.0 11.1L7.9 10.6L8.0 10.3L8.1 9.7L8.3 9.2L7.9 8.7L7.9 9.0L7.6 8.7L7.7 8.3L7.7 7.9L7.3 7.7L7.3 7.5L7.7 7.4L7.6 6.8L7.5 6.4L7.2 6.3Z', // the masthead's small state, linking to here.events (scripts/state-outline.mjs, Natural Earth 1:50m)
    // the calendar feed's header; the UID domain never changes (changing it
    // re-creates every event in subscribers' calendars)
    ics: { name: 'Spokane Events', short: 'Spokane Events', teams: 'Spokane home teams — every season', prodid: '-//here.events//spokane-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Spokane\\, WA — the Arena\\, First Interstate Center for the Arts\\, the Fox\\, Avista Stadium and the music rooms' },
    teams: TEAMS,
    venues: VENUES,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
