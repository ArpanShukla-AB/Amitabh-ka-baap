(() => {
  const problems = window.DSA_PROBLEMS || [];
  const STORAGE_KEY = 'dsa-buddy-mvp-state-v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const todayKey = () => new Date().toLocaleDateString('en-CA');
  const formatDate = (dateString) => {
    if (!dateString) return 'Today';
    const date = new Date(`${dateString}T12:00:00`);
    return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const loadState = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { solved: parsed.solved && typeof parsed.solved === 'object' ? parsed.solved : {}, activity: Array.isArray(parsed.activity) ? parsed.activity : [] };
    } catch { return { solved: {}, activity: [] }; }
  };
  let state = loadState();
  let lastListedProblems = problems.slice();
  let toastTimer;
  const solvedIds = () => new Set(Object.keys(state.solved).map(Number));
  const solvedCount = () => solvedIds().size;
  const solvedDates = () => [...new Set(Object.values(state.solved).map((item) => item.date).filter(Boolean))].sort();
  const getStreak = () => {
    const dates = new Set(solvedDates());
    if (!dates.size) return 0;
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    const today = todayKey();
    if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (dates.has(cursor.toLocaleDateString('en-CA'))) { streak++; cursor.setDate(cursor.getDate() - 1); }
    return streak;
  };
  const topicCount = () => new Set(problems.filter((problem) => state.solved[problem.id]).map((problem) => problem.topic)).size;
  const dailyProblem = () => {
    const today = new Date();
    const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
    return problems[((dayNumber % problems.length) + problems.length) % problems.length];
  };
  const difficultyClass = (difficulty) => difficulty.toLowerCase();
  const isSolved = (id) => Boolean(state.solved[id]);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const showToast = (message) => {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  function problemCard(problem, compact = false) {
    const solved = isSolved(problem.id);
    const video = problem.videoUrl ? `<a class="soft-button" href="${escapeHTML(problem.videoUrl)}" target="_blank" rel="noopener noreferrer">▶ Watch solution</a>` : `<button class="video-button" type="button" disabled title="Add your team-owned YouTube link in data/problems.js">▶ Video coming soon</button>`;
    if (compact) return `<article class="daily-card"><div class="daily-card-header"><div class="daily-label"><span>✦</span> DAILY DSA CHALLENGE <span>· ${formatDate(todayKey())}</span></div><span class="difficulty ${difficultyClass(problem.difficulty)}">${problem.difficulty}</span></div><div class="daily-content"><h2>${escapeHTML(problem.title)}</h2><p>${escapeHTML(problem.summary)}</p><div class="challenge-meta"><span class="meta-pill">⌁ ${escapeHTML(problem.topic)}</span><span class="meta-pill">◷ 15–30 min</span><span class="meta-pill">#${String(problem.id).padStart(2, '0')}</span></div><div class="challenge-actions"><button class="primary-button ${solved ? 'solved' : ''}" data-solve="${problem.id}">${solved ? '✓ Solved' : '✓ Mark as solved'}</button><button class="soft-button" data-hint="${problem.id}">☼ Get a hint</button><a class="soft-button" href="${escapeHTML(problem.source)}" target="_blank" rel="noopener noreferrer">Open problem ↗</a>${video}</div><div class="card-bottom"><span>START WITH THE APPROACH, NOT THE CODE</span><a href="${escapeHTML(problem.source)}" target="_blank" rel="noopener noreferrer">Problem source ↗</a></div></div></article>`;
    return `<article class="problem-card"><div class="problem-card-top"><span class="problem-id">DSA / ${String(problem.id).padStart(2, '0')}</span><span class="difficulty ${difficultyClass(problem.difficulty)}">${problem.difficulty}</span></div><h3>${escapeHTML(problem.title)} ${solved ? '<span class="solved-check">✓</span>' : ''}</h3><p>${escapeHTML(problem.summary)}</p><div class="challenge-meta"><span class="meta-pill">${escapeHTML(problem.tags[0])}</span><span class="meta-pill">${problem.difficulty === 'Easy' ? '15–20 min' : '25–40 min'}</span></div><div class="problem-card-foot"><span class="topic-tag">${escapeHTML(problem.topic)}</span><button data-open="${problem.id}">${solved ? 'Review problem ↗' : 'Practice now ↗'}</button></div></article>`;
  }

  function renderDaily() { $('#daily-message').innerHTML = problemCard(dailyProblem(), true); }
  function renderWeekDots() {
    const container = $('#week-dots'); const dates = new Set(solvedDates()); const today = new Date();
    container.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today); date.setDate(today.getDate() - 6 + i);
      const key = date.toLocaleDateString('en-CA');
      return `<span class="week-dot ${dates.has(key) ? 'done' : ''}" title="${key}">${['M', 'T', 'W', 'T', 'F', 'S', 'S'][date.getDay() === 0 ? 6 : date.getDay() - 1]}</span>`;
    }).join('');
  }
  function renderLibrary() {
    const query = ($('#problem-search')?.value || '').trim().toLowerCase();
    const topic = $('#topic-filter')?.value || 'all';
    const difficulty = $('#difficulty-filter')?.value || 'all';
    lastListedProblems = problems.filter((problem) => {
      const searchText = `${problem.title} ${problem.topic} ${problem.summary} ${problem.tags.join(' ')}`.toLowerCase();
      return (!query || searchText.includes(query)) && (topic === 'all' || problem.topic === topic) && (difficulty === 'all' || problem.difficulty === difficulty);
    });
    $('#problem-grid').innerHTML = lastListedProblems.map((problem) => problemCard(problem)).join('');
    $('#problem-grid').classList.toggle('hidden', !lastListedProblems.length);
    $('#empty-state').classList.toggle('hidden', Boolean(lastListedProblems.length));
    $('#library-count').textContent = String(lastListedProblems.length).padStart(2, '0');
  }
  function renderProgress() {
    $('#progress-solved').textContent = solvedCount(); $('#progress-total').textContent = problems.length;
    $('#progress-streak').textContent = getStreak(); $('#progress-topics').innerHTML = `${topicCount()}<span class="inline-small"> / ${new Set(problems.map(p => p.topic)).size}</span>`;
    const activity = state.activity.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
    $('#activity-list').innerHTML = activity.length ? activity.map((item) => {
      const problem = problems.find((p) => p.id === item.id);
      if (!problem) return '';
      return `<div class="activity-row"><span class="activity-check">✓</span><div class="activity-copy"><strong>${escapeHTML(problem.title)}</strong><span>${escapeHTML(problem.topic)} · ${escapeHTML(problem.difficulty)}</span></div><span class="activity-date">${formatDate(item.date)}</span></div>`;
    }).join('') : '<div class="activity-empty">No problems marked solved yet. Complete today’s challenge to start your log.</div>';
    $('#sidebar-streak').textContent = getStreak(); renderWeekDots();
  }
  function renderAll() { renderDaily(); renderLibrary(); renderProgress(); }

  function addBotReply(content) {
    const row = document.createElement('div'); row.className = 'bot-reply-row';
    row.innerHTML = `<div class="bot-avatar small">⌘</div><div class="bot-reply">${content}<span class="message-time">Just now</span></div>`;
    $('#chat-canvas').insertBefore(row, $('#quick-replies')); row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function addUserMessage(content) {
    const row = document.createElement('div'); row.className = 'chat-reply-row'; row.innerHTML = `<div class="user-message">${escapeHTML(content)}</div>`;
    $('#chat-canvas').insertBefore(row, $('#quick-replies'));
  }
  function showView(view) {
    const valid = ['chat', 'problems', 'progress'].includes(view) ? view : 'chat';
    ['chat', 'problems', 'progress'].forEach((name) => $(`#${name}-view`).classList.toggle('hidden', name !== valid));
    $$('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === valid));
    $('#page-heading').textContent = ({ chat: 'Bot chat', problems: 'Problem library', progress: 'My progress' })[valid];
    if (valid === 'problems') renderLibrary(); if (valid === 'progress') renderProgress();
    if (window.innerWidth < 681) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function markSolved(id) {
    const problem = problems.find((item) => item.id === Number(id)); if (!problem) return;
    if (isSolved(problem.id)) { delete state.solved[problem.id]; state.activity = state.activity.filter((item) => item.id !== problem.id); showToast('Marked as not solved. You can add it back anytime.'); }
    else {
      const date = todayKey(); state.solved[problem.id] = { date, timestamp: Date.now() };
      state.activity.push({ id: problem.id, date, timestamp: Date.now() });
      showToast(`Nice work — ${problem.title} marked solved!`);
    }
    save(); renderAll();
  }
  function hintFor(problem) {
    const hints = {
      1: 'Think about what value you need to complete the target. A hash map can remember values you have already visited and their indices.',
      2: 'If the strings have different lengths, they cannot be anagrams. Otherwise, compare how often each character appears.',
      3: 'At every step, compare the middle element with the target. Decide which half can safely be discarded.',
      4: 'You cannot sell before you buy. As you scan prices, keep the smallest price seen so far and the best profit.',
      5: 'Maintain a window with unique characters. When a repeat appears, move the left edge until the window is valid again.',
      6: 'Use three pointers: previous, current, and next. Save next before reversing the current link.',
      7: 'The most recently opened bracket must be the first one closed. Which data structure naturally gives you that order?',
      8: 'Whenever you find unvisited land, start DFS or BFS and mark every connected land cell. Each search discovers one island.'
    };
    return hints[problem.id] || problem.goal;
  }
  function listTopics() {
    const counts = {};
    problems.forEach((p) => counts[p.topic] = (counts[p.topic] || 0) + 1);
    return `<strong>Topics in this starter pack</strong><ul>${Object.entries(counts).map(([topic, count]) => `<li>${escapeHTML(topic)} <span style="color:#8a978b">— ${count} problem${count > 1 ? 's' : ''}</span></li>`).join('')}</ul><p style="margin-top:9px">Try <strong>search binary search</strong> or open the problem library to filter.</p>`;
  }
  function commandReply(raw) {
    const command = raw.trim(); const normalized = command.toLowerCase();
    if (!command) return;
    addUserMessage(command);
    if (normalized === 'daily' || normalized === 'today') {
      const p = dailyProblem(); addBotReply(`Here’s your challenge for today: <strong>${escapeHTML(p.title)}</strong> (${p.difficulty}) in ${escapeHTML(p.topic)}. Scroll to the daily card above to open the problem, get a hint, or mark it solved.`);
    } else if (normalized === 'random') {
      const pool = problems.filter((p) => !isSolved(p.id)); const p = (pool.length ? pool : problems)[Math.floor(Math.random() * (pool.length || problems.length))];
      addBotReply(`<strong>Random pick: ${escapeHTML(p.title)}</strong><p>${escapeHTML(p.summary)}</p><p><a href="${escapeHTML(p.source)}" target="_blank" rel="noopener noreferrer">Open problem ↗</a> · <button class="inline-command" data-hint="${p.id}">Get a hint</button> · <button class="inline-command" data-solve="${p.id}">Mark solved</button></p>`);
    } else if (normalized === 'topics') addBotReply(listTopics());
    else if (normalized === 'progress') addBotReply(`<strong>Your current snapshot</strong><ul><li>${solvedCount()} of ${problems.length} starter problems marked solved</li><li>${getStreak()}-day current streak</li><li>${topicCount()} topic areas covered</li></ul><p>Open <button class="inline-command" data-view="progress">My progress</button> for your recent activity.</p>`);
    else if (normalized === 'help') addBotReply(`<strong>Here’s what I understand</strong><ul><li><code>daily</code> — today’s challenge</li><li><code>random</code> — pick a practice problem</li><li><code>topics</code> — list topic areas</li><li><code>search arrays</code> — filter the problem library</li><li><code>solve 1</code> — mark problem number 1 solved</li><li><code>progress</code> — see your current snapshot</li></ul>`);
    else if (normalized.startsWith('search ')) {
      const term = command.slice(7).trim(); showView('problems'); $('#problem-search').value = term; renderLibrary(); showToast(lastListedProblems.length ? `Found ${lastListedProblems.length} match${lastListedProblems.length === 1 ? '' : 'es'} for “${term}”.` : `No matches for “${term}”. Try another search.`);
    } else if (normalized.startsWith('solve ')) {
      const id = Number(normalized.slice(6).trim()); const p = problems.find((item) => item.id === id);
      if (p) { if (!isSolved(id)) markSolved(id); addBotReply(`<strong>${escapeHTML(p.title)}</strong> ${isSolved(id) ? 'is in your solved list. Great job building consistency. 🎉' : 'was not marked solved.'}<p>You can review your history in <button class="inline-command" data-view="progress">My progress</button>.</p>`); }
      else addBotReply('I could not find that problem number. Use <strong>problem library</strong> to see the numbers, then try <code>solve 1</code>.');
    } else addBotReply(`I’m still learning that command. Try <strong>daily</strong>, <strong>random</strong>, <strong>topics</strong>, <strong>search arrays</strong>, <strong>solve 1</strong>, <strong>progress</strong>, or <strong>help</strong>.`);
    $('#chat-input').value = '';
  }

  const topicFilter = $('#topic-filter');
  [...new Set(problems.map((p) => p.topic))].sort().forEach((topic) => { const option = document.createElement('option'); option.value = topic; option.textContent = topic; topicFilter.append(option); });
  $$('.nav-item').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  $('#show-library').addEventListener('click', () => showView('problems'));
  $('#progress-to-library').addEventListener('click', () => showView('problems'));
  $('#problem-search').addEventListener('input', renderLibrary); $('#topic-filter').addEventListener('change', renderLibrary); $('#difficulty-filter').addEventListener('change', renderLibrary);
  $('#chat-form').addEventListener('submit', (event) => { event.preventDefault(); commandReply($('#chat-input').value); });
  $$('.composer-hints button').forEach((button) => button.addEventListener('click', () => { $('#chat-input').value = button.dataset.fill; $('#chat-form').requestSubmit(); }));
  $('#composer-help').addEventListener('click', () => commandReply('help'));
  $('#reset-demo').addEventListener('click', () => { if (confirm('Reset all DSA Buddy progress saved in this browser?')) { state = { solved: {}, activity: [] }; save(); renderAll(); showToast('Demo progress reset.'); } });
  document.addEventListener('click', (event) => {
    const solveButton = event.target.closest('[data-solve]');
    const hintButton = event.target.closest('[data-hint]');
    const openButton = event.target.closest('[data-open]');
    const viewButton = event.target.closest('[data-view]');
    if (solveButton) { const id = Number(solveButton.dataset.solve); markSolved(id); return; }
    if (hintButton) { const p = problems.find((item) => item.id === Number(hintButton.dataset.hint)); if (p) { const row = document.createElement('div'); row.className = 'bot-reply-row'; row.innerHTML = `<div class="bot-avatar small">⌘</div><div class="bot-reply"><strong>💡 Hint for ${escapeHTML(p.title)}</strong><p>${escapeHTML(hintFor(p))}</p><span class="message-time">Just now</span></div>`; $('#chat-canvas').insertBefore(row, $('#quick-replies')); if ($('#chat-view').classList.contains('hidden')) { showView('chat'); $('#chat-canvas').insertBefore(row, $('#quick-replies')); } row.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
    if (openButton) { const p = problems.find((item) => item.id === Number(openButton.dataset.open)); if (p) { showView('chat'); addBotReply(`<strong>${escapeHTML(p.title)}</strong><p>${escapeHTML(p.summary)}</p><p><strong>Practice goal:</strong> ${escapeHTML(p.goal)}</p><p><a href="${escapeHTML(p.source)}" target="_blank" rel="noopener noreferrer">Open official problem page ↗</a></p><p>${p.videoUrl ? `<a href="${escapeHTML(p.videoUrl)}" target="_blank" rel="noopener noreferrer">Watch the team solution ↗</a>` : 'Team YouTube solution link: coming soon. Add your video URL in <code>data/problems.js</code> when ready.'}</p><p><button class="inline-command" data-hint="${p.id}">Get a hint</button> · <button class="inline-command" data-solve="${p.id}">Mark solved</button></p>`); } return; }
    if (viewButton && viewButton.closest('.bot-reply')) { showView(viewButton.dataset.view); return; }
  });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-command]'); if (button) commandReply(button.dataset.command);
  });
  // Lightweight styles for buttons rendered inside bot messages.
  const inlineStyle = document.createElement('style'); inlineStyle.textContent = '.inline-command{border:0;background:#eef6e8;color:#466c40;border-radius:4px;padding:3px 6px;font:600 11px var(--sans);cursor:pointer}.inline-command:hover{background:#dfedcf}.solved-check{font:12px var(--sans);color:#5c9650}'; document.head.append(inlineStyle);
  renderAll();
})();
