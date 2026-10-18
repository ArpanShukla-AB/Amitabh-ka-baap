# Audit: everything that needs fixing

_Last updated: 2026-10-19 · line numbers refer to commit `4ee64e3`_

25 problems found: 6 high, 10 medium, 9 low. The high ones either break the app for real users or will become security holes once a backend feeds it data.

| # | Severity | Area | Problem | Where |
| --- | --- | --- | --- | --- |
| A1 | High | UX | Mobile has no navigation bar: under 680 px the sidebar is hidden and nothing replaces it, so views are reachable only through scattered buttons and chat commands | `styles.css` L2 |
| A2 | High | Logic | "Mark solved" buttons toggle: on an already-solved problem they silently un-solve it and delete its history, which also breaks the streak | `app.js` L111, L145, L176 |
| A3 | High | Reliability | `save()` has no try/catch; a full or blocked `localStorage` throws and every later click fails | `app.js` L44 |
| A4 | High | Security | HTML is built from strings; `difficulty` is inserted unescaped and links are not checked for `javascript:`. Safe with today's static file, unsafe once an API or admin panel supplies data | `app.js` L52–54, L142 |
| A5 | High | Logic | Daily problem = day number mod list length, so adding or reordering one problem reshuffles every day's challenge | `app.js` L37–41 |
| A6 | High | Product | No backend, accounts or cross-device progress; the core product, WhatsApp delivery, does not exist yet | `README.md` L5 |
| A7 | Medium | Content | Hints are hard-coded in `app.js` by id, one level each, although the README promises a hint ladder | `app.js` L119–131 |
| A8 | Medium | Reliability | A problem without a `tags` array crashes the library (`tags.join`, `tags[0]`) | `app.js` L54, L71 |
| A9 | Medium | Logic | Daily card and streak stay on yesterday's values past midnight until a reload or a solve | `app.js` L57, L184 |
| A10 | Medium | Accessibility | Bot replies are not announced to screen readers: chat area has no `role="log"` or `aria-live` | `index.html` L49 |
| A11 | Medium | Commands | No `hint 3` command despite the README; `search` with no term returns "unknown command" | `app.js` L137–156 |
| A12 | Medium | Code quality | All CSS is minified onto 2 lines, so PR diffs are unreadable | `styles.css` L1–2 |
| A13 | Medium | Code quality | Styles injected from JavaScript and inline `style` attributes | `app.js` L135, L183 |
| A14 | Medium | Tooling | No `package.json`, linter, formatter, tests or CI | repo root |
| A15 | Medium | Repo | No LICENSE or CONTRIBUTING guide; a single commit named "ADDED" | repo root |
| A16 | Medium | Architecture | Backend stack (README says Node + Express) is not decided and there is no API contract | `README.md` L80–88 |
| A17 | Low | UI | Static placeholders: library count "8", topic total "/ 8" (there are 7 topics), avatar "AS" | `index.html` L41, L63, L71 |
| A18 | Low | UI | Time estimates disagree: daily card says 15–30 min, library cards 15–20 or 25–40 | `app.js` L53–54 |
| A19 | Low | UI | Search box shows a `/` shortcut that does nothing | `index.html` L64 |
| A20 | Low | UI | Week dots are labelled "This week's activity" but show a rolling last 7 days | `index.html` L32, `app.js` L58–65 |
| A21 | Low | Accessibility | Active nav button has no `aria-current` | `index.html` L23–25, `app.js` L104 |
| A22 | Low | Code quality | Hint row is inserted twice when the chat view is hidden | `app.js` L175 |
| A23 | Low | Code quality | Two separate document-wide click listeners; click handling is spread out | `app.js` L169–181 |
| A24 | Low | Logic | `todayKey()` depends on the `en-CA` locale to produce YYYY-MM-DD | `app.js` L6 |
| A25 | Low | Privacy | Google Fonts load from an external CDN: no offline use, visitor IPs go to Google | `index.html` L9–11 |
