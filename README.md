# DSA Buddy — WhatsApp DSA Practice Bot

A responsive browser prototype for a WhatsApp-style DSA practice companion. The product idea is simple: users receive a daily problem, look up practice tasks by topic, ask for a hint, watch a team-curated YouTube solution, and track problems they have solved.

> **MVP status:** interactive front-end prototype only. It is not yet connected to WhatsApp, an API backend, user accounts, or a database. YouTube links are intentionally left empty until the team adds its own videos.

## Preview the MVP

No install or build step is required. Open `index.html` directly in a modern browser, or use VS Code Live Server.

```bash
git clone https://github.com/ArpanShukla-AB/Amitabh-ka-baap.git
cd Amitabh-ka-baap
# Open index.html in a browser, or run VS Code Live Server
```

## What works in this prototype

- **Daily DSA challenge:** a date-based challenge card with topic, difficulty, concise prompt, and an external problem link.
- **Problem library:** filter by topic/difficulty and search titles, tags, or descriptions.
- **Chat command simulation:** try `daily`, `random`, `topics`, `search arrays`, `solve 1`, `progress`, and `help`.
- **Hint ladder starter:** request one conceptual hint for each included problem.
- **Progress tracking:** mark/unmark problems as solved; view saved solve dates, a current streak snapshot, and topic coverage.
- **Browser persistence:** progress is saved using `localStorage` on the current device.
- **Responsive UI:** desktop sidebar and chat-like layout adapt to mobile screens.
- **Our own video links:** each problem has a `videoUrl` field in `data/problems.js`. The interface clearly displays “coming soon” when it is blank rather than inventing a solution link.

## Suggested chat commands

| Command | Behavior |
| --- | --- |
| `daily` | Show which challenge is featured today |
| `random` | Pick an unsolved problem (or any problem if all are solved) |
| `topics` | List problem topics in the starter catalogue |
| `search binary search` | Open and filter the library by the provided terms |
| `solve 1` | Mark problem number 1 as solved |
| `progress` | Get a brief progress snapshot |
| `help` | Show supported commands |

The commands are simulated in the web UI. They do not send or receive real WhatsApp messages.

## Extra product ideas

### Prioritize these first

1. **Daily challenge + opt-in reminder:** let a learner pick a delivery time and timezone, and easily pause/stop reminders.
2. **Progressive hints:** reveal a nudge first, then an approach, then complexity analysis, and show a full explanation only when asked.
3. **Team-owned YouTube editorial:** attach the team’s own solution video to each problem. Maintain a reviewed link and an optional short written editorial.
4. **Topic-wise learning paths:** guide learners through arrays, strings, hashing, binary search, recursion, linked lists, stacks/queues, trees, graphs, greedy, and dynamic programming.
5. **Revision queue:** resurface previously solved or missed problems after 1, 3, 7, and 14 days (spaced repetition).
6. **Interview mode:** add a timer, complexity follow-ups, test cases, and a post-attempt confidence rating.
7. **Language snippets:** provide starter templates and examples for C++, Java, Python, and JavaScript.

### Differentiators to validate with users

- **Beginner mode:** explain the core concept in plain language before giving formal terminology.
- **Weekly mini-contest:** offer three to five curated problems and an opt-in friend leaderboard.
- **Goal-based tracks:** interview prep, competitive programming, and DSA fundamentals for university/GATE preparation.
- **Weak-topic recommendations:** recommend the next practice task based on solved history and topics with low confidence.
- **Group challenges:** let friends share a challenge and compare completion without exposing source code by default.
- **Voice-note walkthroughs:** consider short audio explanations only after the text-based experience is useful and stable.
- **Admin/editorial panel:** allow teammates to add or review problem statements, difficulty, hints, and video URLs without editing source files.
- **Weekly recap:** deliver a short report of problems attempted, topics practiced, and a suggested next step.

### Avoid in the first release

- Arbitrary user-code execution without a proper sandbox.
- Building a social feed before the daily loop is validated.
- Auto-generating or attaching unreviewed solution videos.
- Collecting phone numbers, personal details, or message history that the product does not need.

## Recommended technical architecture

### Phase 1 — reviewable prototype (this repo)

- HTML, CSS, and vanilla JavaScript.
- Curated sample catalogue in `data/problems.js`.
- `localStorage` for demo progress, with no account sign-in.

### Phase 2 — WhatsApp integration

- **Messaging channel:** Meta WhatsApp Cloud API or a supported provider such as Twilio; verify current onboarding, pricing, user-consent, and template rules before choosing.
- **Backend:** Node.js + Express for webhook verification, message parsing, command routing, and delivery callbacks.
- **Database:** PostgreSQL (Supabase is one option) to persist users’ preferences, problem catalogue, video links, and solve history.
- **Scheduling:** a durable scheduler/queue for daily delivery, retry handling, timezone-aware timing, and opt-out enforcement.
- **Admin workflow:** protected editorial form for curating problems and attaching team-owned videos.
- **Observability:** delivery/error metrics and minimal, privacy-conscious logs.

### Suggested tables

- `users`: internal ID, provider-specific WhatsApp ID, timezone, preferred send time, reminder consent, created timestamp.
- `problems`: ID, slug, title, topic, difficulty, concise statement, constraints, source URL, solution video URL, hints, active flag.
- `user_problem_status`: user ID, problem ID, status, attempted-at, solved-at, confidence score, notes (optional).
- `daily_challenges`: challenge date, problem ID, optional editorial/video announcement.
- `message_events`: provider message ID, status, timestamps, minimal delivery metadata for troubleshooting.

## Privacy and security checklist

- Obtain explicit opt-in before initiating proactive WhatsApp messages; implement clear `STOP`/unsubscribe and reminder-pause flows.
- Store secrets only in server-side environment variables. Never put provider tokens in browser JavaScript or commit `.env` files.
- Verify webhook signatures, validate inbound payloads, rate-limit abuse, and avoid logging full message bodies or identifiers unless necessary.
- Keep user data minimal; define retention and deletion behavior before onboarding real users.
- Link to legitimate problem sources and only publish video/content the team owns or has permission to use.
- If a code runner is introduced, execute in a hardened, isolated sandbox with resource limits and no access to application secrets.

## Roadmap

- [x] Define MVP flow and product ideas.
- [x] Build a responsive chat-inspired frontend.
- [x] Add starter problems, filters, search, commands, and local solve tracking.
- [x] Make unconfigured YouTube links explicit rather than fake.
- [ ] Review/expand the problem catalogue and write original concise hints.
- [ ] Add team-owned YouTube solution URLs after videos are ready.
- [ ] Build the Node.js webhook and command router.
- [ ] Connect WhatsApp Cloud API with test users and explicit opt-in.
- [ ] Add PostgreSQL/Supabase persistence and user preferences.
- [ ] Add daily scheduler, retries, STOP handling, and monitoring.
- [ ] Run a small pilot and review feedback before adding advanced features.

## Pilot success metrics

- Daily challenge open/reply rate.
- Problem-source and solution-video click-through rate.
- Attempted/solved rate per delivered challenge.
- Day-7 retention and weekly active users.
- Reminder opt-out rate and delivery failures.
- Learner feedback on problem difficulty and hint usefulness.

## Repository layout

```text
.
├── index.html          # page structure
├── styles.css          # responsive UI and theme
├── app.js              # interactions, commands, filters, local progress
├── data/
│   └── problems.js     # starter problems and optional videoUrl fields
└── README.md           # setup, roadmap, and product ideas
```

## Current limitations

- Browser-only; no actual WhatsApp messages are sent.
- Progress is local to one browser and can be cleared by the user.
- Starter problems are a small curated sample, not a full DSA curriculum.
- YouTube `videoUrl` values are blank by design until your team adds its videos.
- No login, reminders, online judge, or code execution is included in this MVP.
