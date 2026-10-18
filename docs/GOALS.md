# DSA Buddy — Goals

_Last updated: 2026-10-19_

Related: [Backend proposal](BACKEND_PROPOSAL.md) · [Audit](AUDIT.md) · [Proposed issues](ISSUES.md)

## Where it stands

DSA Buddy is a front-end-only prototype: one commit, six files, no backend, no tests.

| File | Lines | What it does |
| --- | --- | --- |
| `index.html` | 83 | Three views: bot chat, problem library, progress |
| `app.js` | 185 | Command parser, rendering, filters, hints, `localStorage` progress |
| `styles.css` | 2 | Whole theme, minified onto two lines |
| `data/problems.js` | 11 | 8 LeetCode problems across 7 topics, all `videoUrl` blank |
| `README.md` | 147 | Product ideas, Phase 2 architecture sketch, privacy checklist |
| `.gitignore` | 5 | Ignores `.env`, `node_modules/` |

What works today: a date-based daily problem, search and filters, seven chat commands (`daily`, `random`, `topics`, `search`, `solve`, `progress`, `help`), one hint per problem, and a streak counter. Everything lives in one browser; nothing is sent to WhatsApp.

## Goals

The end goal is a WhatsApp bot that sends each learner one DSA problem a day, gives graded hints, and tracks progress across devices. Five goals get there, in order; targets marked *proposed* are starting points for the team to adjust.

| Goal | Done when |
| --- | --- |
| **G1 · Solid prototype** | High-severity audit items fixed; mobile can reach every view; lint and tests run in CI on every PR |
| **G2 · One backend, one source of truth** | Problems, hints, progress and the command parser live on the server; the web app only calls the API |
| **G3 · WhatsApp daily loop** | Opted-in test users get the daily problem at their chosen time; `hint`, `solve`, `progress` and `STOP` work over WhatsApp |
| **G4 · Content worth returning for** | *Proposed:* 50+ problems across the 11 README topics, 3 hint levels each, team videos on the first 20 |
| **G5 · Pilot and learn** | *Proposed:* 20–30 learners for 4 weeks, tracking the README pilot metrics (reply rate, day-7 retention, opt-out rate) |

G1 and G4 can run in parallel; G3 needs G2 first, because the bot and the website must share one command parser.
