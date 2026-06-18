const state = {
  apiBase: localStorage.getItem('agentFactoryApiBase') || window.location.origin,
  chatId: localStorage.getItem('agentFactoryChatId') || '',
  timer: null,
  events: []
};

const el = (id) => document.getElementById(id);
const connectionState = el('connectionState');
const chatIdInput = el('chatIdInput');
const apiBaseInput = el('apiBaseInput');
const connectBtn = el('connectBtn');
const clearBtn = el('clearBtn');
const timeline = el('timeline');
const candidateList = el('candidateList');

chatIdInput.value = state.chatId;
apiBaseInput.value = state.apiBase;

function setConnection(text, mode) {
  connectionState.textContent = text;
  connectionState.className = 'status-pill ' + (mode || '');
}

function formatTime(value) {
  if (!value) return '';
  const date = new Date(value + 'Z');
  if (Number.isNaN(date.getTime())) return value.slice(11, 19);
  return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function latestUsefulEvent(events) {
  return [...events].reverse().find(e => e.agent || e.reason || e.thought || e.stage === 'decision') || events[events.length - 1];
}

function render(events, status = {}) {
  state.events = events;
  const latest = latestUsefulEvent(events);
  el('eventCount').textContent = String(events.length);
  el('agentCount').textContent = String(status.agents ?? '-');
  el('memoryCount').textContent = String(status.users ?? '-');

  if (latest) {
    const agent = latest.agent || (latest.action === 'chitchat' ? 'שיחה רגילה' : 'Agent Factory');
    el('currentStage').textContent = latest.title || latest.stage || 'פעיל';
    el('currentAgent').textContent = agent;
    el('agentInitial').textContent = String(agent).trim().charAt(0).toUpperCase() || 'A';
    el('currentReason').textContent = latest.reason || latest.message || 'המערכת עובדת על האירוע האחרון.';
    el('thoughtBox').textContent = latest.thought || 'אין דיבור פנימי באירוע האחרון.';
  }

  const candidates = latest?.candidates || [];
  el('candidateLabel').textContent = candidates.length ? candidates.length + ' מועמדים' : 'אין מועמדים';
  candidateList.innerHTML = candidates.length
    ? candidates.map(c => `
      <div class="candidate">
        <b>${escapeHtml(c.name || 'unknown')}</b>
        <meter min="0" max="6" value="${Number(c.score || 0)}"></meter>
        <small>התאמה: ${Number(c.score || 0).toFixed(2)}</small>
        <small>ממוצע: ${c.avg ?? 'חדש'} | שימושים: ${c.uses ?? 0}</small>
        <small>${escapeHtml(c.description || '')}</small>
      </div>`).join('')
    : '<div class="candidate"><b>ממתין</b><small>ברגע שה-router יבחר מסלול, תראה כאן מועמדים וסיבות.</small></div>';

  timeline.innerHTML = events.length
    ? [...events].reverse().map(event => `
      <div class="event">
        <time>${formatTime(event.timestamp)}</time>
        <div>
          <h3>${escapeHtml(event.title || event.stage || 'אירוע')}</h3>
          <p>${escapeHtml(event.message || event.reason || '')}</p>
          ${event.agent ? '<span class="tag">' + escapeHtml(event.agent) + '</span>' : ''}
        </div>
      </div>`).join('')
    : '<div class="event"><time>עכשיו</time><div><h3>ממתין לזרימה</h3><p>שלח הודעה לבוט או התחבר עם Chat ID קיים.</p></div></div>';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function refresh() {
  if (!state.chatId) {
    setConnection('ממתין', '');
    render([]);
    return;
  }

  try {
    const [events, status] = await Promise.all([
      fetchJson(`${state.apiBase}/flow/${encodeURIComponent(state.chatId)}?limit=80`),
      fetchJson(`${state.apiBase}/`)
    ]);
    setConnection('מחובר', 'ok');
    render(Array.isArray(events) ? events : [], status || {});
  } catch (err) {
    setConnection('מנותק', 'bad');
  }
}

function connect() {
  state.chatId = chatIdInput.value.trim();
  state.apiBase = apiBaseInput.value.trim().replace(/\/$/, '') || window.location.origin;
  localStorage.setItem('agentFactoryChatId', state.chatId);
  localStorage.setItem('agentFactoryApiBase', state.apiBase);
  clearInterval(state.timer);
  refresh();
  state.timer = setInterval(refresh, 1600);
}

connectBtn.addEventListener('click', connect);
clearBtn.addEventListener('click', () => render([]));
chatIdInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') connect();
});

connect();
