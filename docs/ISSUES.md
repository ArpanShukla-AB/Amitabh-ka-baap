# Proposed issues

_Last updated: 2026-10-19_

15 issues, in the order they should be done. Issues 1–5 finish G1 and can start today; 6–11 build the backend (G2); 12–13 connect WhatsApp (G3); 14–15 cover content and the pilot. Goal IDs refer to [GOALS.md](GOALS.md); audit IDs (A1…) refer to [AUDIT.md](AUDIT.md).

| # | Issue | Goal | Fixes | Needs |
| --- | --- | --- | --- | --- |
| 1 | Add mobile bottom navigation | G1 | A1, A21 | — |
| 2 | Make "Mark solved" safe: no silent un-solve, keep history | G1 | A2 | — |
| 3 | Harden storage and rendering | G1 | A3, A4, A8 | — |
| 4 | Add tooling: package.json, ESLint, Prettier, readable CSS, CI | G1 | A12–A14 | — |
| 5 | Add LICENSE, CONTRIBUTING and issue/PR templates | G1 | A15 | — |
| 6 | Decide backend stack and write the API contract | G2 | A16 | — |
| 7 | Scaffold the backend with Postgres and Docker Compose | G2 | A6 | 6 |
| 8 | Move problems and 3-level hints into the database | G2, G4 | A7 | 7 |
| 9 | Fixed daily schedule and timezone-aware `/api/daily` | G2 | A5, A9, A24 | 8 |
| 10 | Shared command engine behind `POST /api/chat` | G2 | A11 | 8 |
| 11 | Progress API with anonymous users and localStorage import | G2 | A6 | 7 |
| 12 | WhatsApp webhook: verify, check signatures, route to engine | G3 | A6 | 10 |
| 13 | Daily delivery worker with opt-in, STOP and PAUSE | G3 | — | 9, 12 |
| 14 | Grow the catalogue to 50 problems with reviewed hints | G4 | — | 8 |
| 15 | Pilot metrics: event tracking and a stats page | G5 | — | 11, 13 |

## 1. Add mobile bottom navigation

On phones there is no way to switch views directly.

- [ ] Fixed bottom bar under 680 px with Chat, Library, Progress
- [ ] Active item shows `aria-current="page"` (desktop sidebar too)
- [ ] Checked at 375 px and 414 px widths

## 2. Make "Mark solved" safe

A "Mark solved" button on a solved problem un-solves it and wipes its history.

- [ ] Chat buttons only mark solved; un-solving needs an explicit "Undo" in the toast
- [ ] Un-solving keeps past activity rows (status change, not delete)
- [ ] Streak no longer drops when a different problem is unmarked

## 3. Harden storage and rendering

- [ ] `save()` wrapped in try/catch with a toast when storage is unavailable
- [ ] Every field escaped, including `difficulty`; links allowed only if `http:` or `https:`
- [ ] Problems with missing `tags` render without crashing

## 4. Add tooling and CI

- [ ] `package.json` with `lint`, `format` and `test` scripts
- [ ] `styles.css` un-minified; JS-injected and inline styles moved into it
- [ ] GitHub Actions runs lint and tests on every PR
- [ ] First unit tests for `getStreak`, `dailyProblem` and the command parser

## 5. Add LICENSE, CONTRIBUTING and templates

- [ ] License chosen by the team and added
- [ ] CONTRIBUTING covers branch names, commit style and how to run locally
- [ ] Bug and feature issue templates, plus a PR template with a checklist

## 6. Decide backend stack and write the API contract

- [ ] Short decision record: FastAPI or Express, with the reason
- [ ] OpenAPI file covering the endpoints in [BACKEND_PROPOSAL.md](BACKEND_PROPOSAL.md)
- [ ] Team review before any backend code is merged

## 7. Scaffold the backend

- [ ] `backend/` folder with the chosen framework, `GET /health`, config from env vars
- [ ] PostgreSQL plus migrations; `docker compose up` starts both
- [ ] `.env.example` committed, real `.env` ignored

## 8. Move problems and hints into the database

- [ ] `problems` and `hints` tables; seed script imports today's 8 problems and hints
- [ ] `GET /api/problems` with topic, difficulty and text filters; `GET /api/problems/{id}/hints/{level}`
- [ ] Library page reads from the API; `data/problems.js` removed

## 9. Fixed daily schedule

- [ ] `daily_schedule` table filled ahead of time; adding a problem never changes past days
- [ ] `GET /api/daily` uses the user's timezone
- [ ] Web page refreshes the daily card after midnight without a reload

## 10. Shared command engine

- [ ] One module parses `daily`, `random`, `topics`, `search`, `solve`, `hint`, `progress`, `help` and returns a structured reply
- [ ] `POST /api/chat` exposes it; the web chat renders its replies
- [ ] New `hint 3` command steps through hint levels; bare `search` asks for a term

## 11. Progress API

- [ ] Anonymous user created on first visit (device id), linkable to WhatsApp later
- [ ] `GET /api/me/progress`, `POST`/`DELETE /api/problems/{id}/solve`
- [ ] Existing `localStorage` progress imported once, then cleared

## 12. WhatsApp webhook

- [ ] `GET /webhooks/whatsapp` passes Meta's verification
- [ ] `POST` rejects requests whose `X-Hub-Signature-256` does not match
- [ ] Text messages go through the command engine; replies sent back; message bodies not logged

## 13. Daily delivery worker

- [ ] Users choose send time and timezone; nothing sent without recorded opt-in
- [ ] Daily problem sent as an approved template; `deliveries` row prevents double sends on retry
- [ ] `STOP`, `PAUSE 7` and `START` handled and confirmed to the user

## 14. Grow the catalogue

- [ ] 50 problems across the 11 README topics, Easy-to-Medium heavy
- [ ] 3 original hints per problem, each reviewed by a second teammate
- [ ] Team video links on the first 20 problems

## 15. Pilot metrics

- [ ] `events` table records delivered, opened, hint used, solved, opted out
- [ ] Admin page shows daily reply rate, day-7 retention and opt-out rate
- [ ] No message bodies or phone numbers in the events table
