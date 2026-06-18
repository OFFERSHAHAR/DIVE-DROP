const modules = [
  'Intake רגיש',
  'סיווג צורך',
  'Risk Guard',
  'זכויות ומסלולים',
  'טפסים ומסמכים',
  'שפה פשוטה',
  'מתנדבים',
  'ליווי אנושי',
  'מאגר ידע',
  'פרטיות והסכמה',
  'UI/UX פרימיום',
  'n8n ואוטומציה',
  'AI Prompting',
  'בדיקות איכות',
  'משפטי ואחריות',
  'קהילה ומשפחות',
  'מדדי הצלחה',
  'הצגה וסיפור מוצר'
];

const students = Array.from({ length: 18 }, (_, i) => ({
  name: `חניך ${i + 1}`,
  module: modules[i],
  checks: {
    prd: i < 5,
    source: i < 3,
    ui: i < 2,
    test: i < 1,
    connected: false
  }
}));

const navButtons = document.querySelectorAll('.nav button');
const views = document.querySelectorAll('.view');
const progressStateKey = 'ogen-progress-v1';
const sharesKey = 'ogen-shares-v1';

function showView(viewId) {
  views.forEach(view => view.classList.toggle('active', view.id === viewId));
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.view === viewId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.view));
});

function fillSelect(select, values) {
  select.innerHTML = values.map(value => `<option>${value}</option>`).join('');
}

fillSelect(document.getElementById('studentSelect'), students.map(student => student.name));
fillSelect(document.getElementById('moduleSelect'), modules);
fillSelect(document.getElementById('shareModule'), modules);

function riskFromText(text) {
  const critical = ['להתאבד', 'לפגוע בעצמי', 'סכנה מיידית', 'לא רוצה לחיות'];
  const red = ['לא מסוגל', 'קריסה', 'פחד קיצוני', 'אבוד לגמרי'];
  const yellow = ['קשה', 'נשאר לבד', 'עומס', 'לא יודע', 'חרדה', 'בלבול'];
  if (critical.some(word => text.includes(word))) return 'critical';
  if (red.some(word => text.includes(word))) return 'red';
  if (yellow.some(word => text.includes(word))) return 'yellow';
  return 'green';
}

function riskLabel(risk) {
  return {
    green: 'ירוק',
    yellow: 'צהוב',
    red: 'אדום',
    critical: 'קריטי'
  }[risk];
}

function analyzeDemo(sample) {
  const message = sample || document.getElementById('message').value.trim();
  const consent = document.getElementById('consent').checked;
  const profile = document.getElementById('profile').value;
  const result = document.getElementById('result');

  if (!consent) {
    result.className = '';
    result.innerHTML = `
      <span class="risk-pill yellow">נדרשת הסכמה</span>
      <h3>עוצרים לפני עיבוד</h3>
      <p>גם בדמו, המערכת לא מעבדת פנייה בלי הסכמה מינימלית וברורה.</p>
    `;
    return;
  }

  if (!message) {
    result.className = 'empty-state';
    result.textContent = 'צריך לכתוב פנייה כדי להריץ את הדמו.';
    return;
  }

  const risk = riskFromText(message);
  const needsHuman = risk === 'red' || risk === 'critical';
  const topic = message.includes('טפס') ? 'טפסים ומסמכים' : message.includes('זכ') ? 'זכויות ומסלולים' : 'Intake רגיש';
  const nextStep = risk === 'critical'
    ? 'לא ממשיכים עם AI בלבד. מציגים הנחיית חירום ומעבירים לאדם מוסמך.'
    : 'מנסחים יחד צעד ראשון: מי הגוף האחראי, איזה מידע חסר, ומה אפשר לעשות בלי להעמיס.';

  result.className = '';
  result.innerHTML = `
    <span class="risk-pill ${risk}">רמת סיכון: ${riskLabel(risk)}</span>
    <h3>סיווג ראשוני: ${topic}</h3>
    <p><strong>פרופיל:</strong> ${profile}</p>
    <p><strong>תגובה למשתמש:</strong><br>תודה שכתבת. אתה לא צריך לפתור עכשיו את כל המערכת לבד. נתחיל מצעד אחד ברור, בשפה פשוטה, ונחליט יחד אם צריך מקור מידע, מתנדב או אדם מקצועי.</p>
    <p><strong>הצעד הבא:</strong><br>${nextStep}</p>
    <p><strong>Guard rail:</strong> ${needsHuman ? 'דורש מעבר לאדם ולא נשאר רק ב-AI.' : 'אפשר להציג כטיוטת מידע בטוחה עם מקור.'}</p>
  `;
}

document.getElementById('analyzeBtn').addEventListener('click', () => analyzeDemo());
document.getElementById('sampleBtn').addEventListener('click', () => {
  const sample = 'אני לא מסוגל להתמודד עם זה יותר, הכל מרגיש אבוד לגמרי ואני מפחד להישאר לבד.';
  document.getElementById('message').value = sample;
  analyzeDemo(sample);
});

document.getElementById('prdForm').addEventListener('submit', event => {
  event.preventDefault();
  const student = document.getElementById('studentSelect').value;
  const moduleName = document.getElementById('moduleSelect').value;
  const problem = document.getElementById('prdProblem').value.trim() || 'להגדיר במדויק את הבעיה שהמודול פותר.';
  const does = document.getElementById('prdDoes').value.trim() || 'להגדיר קלטים, פעולות, פלטים וחיבור למודול הבא.';
  const not = document.getElementById('prdNot').value.trim() || 'לא מאבחן, לא מטפל, לא מבטיח זכאות ולא שומר מידע רגיש בלי הסכמה.';
  const sources = document.getElementById('prdSources').value.trim() || 'מקורות רשמיים, תאריך בדיקה, ומה דורש אישור מורה.';

  document.getElementById('prdOutput').textContent = `# PRD מודול: ${moduleName}

בעלים: ${student}

## מטרת המודול
${problem}

## מה המודול עושה
${does}

## מה המודול לא עושה
${not}

## קלטים
- טקסט/נתונים מהמודול הקודם
- הסכמה לעיבוד מינימלי
- רמת סיכון אם קיימת

## פלטים
- תקציר ברור
- צעד הבא
- מקור מידע או בקשה לאימות
- דגל הסלמה לאדם אם נדרש

## מקורות וקבצים
${sources}

## Guard rails
- אין אבחון או טיפול.
- אין הבטחת זכאות או תוצאה.
- אין שמירת מידע רגיש בלי צורך והסכמה.
- מצב אדום/קריטי עובר לאדם.

## Definition of Done
- PRD כתוב ומאושר.
- יש מקור או החלטה שאין מקור.
- יש UI או פלט שאפשר להדגים.
- יש 3 בדיקות לפחות.
- המודול מתחבר למיזם הכיתתי.`;
});

document.getElementById('copyPrd').addEventListener('click', async () => {
  await navigator.clipboard.writeText(document.getElementById('prdOutput').textContent);
  document.getElementById('copyPrd').textContent = 'הועתק';
  setTimeout(() => { document.getElementById('copyPrd').textContent = 'העתק'; }, 1200);
});

function getShares() {
  return JSON.parse(localStorage.getItem(sharesKey) || '[]');
}

function setShares(shares) {
  localStorage.setItem(sharesKey, JSON.stringify(shares));
}

function renderShares() {
  const list = document.getElementById('shareList');
  const shares = getShares();
  if (!shares.length) {
    list.innerHTML = '<div class="empty-state">עוד אין תכנים משותפים בדמו.</div>';
    return;
  }
  list.innerHTML = shares.map(share => `
    <article class="share-item">
      <strong>${share.module}</strong><br>
      <small>${share.date}</small>
      ${share.link ? `<p><a href="${share.link}" target="_blank" rel="noreferrer">${share.link}</a></p>` : ''}
      ${share.files.length ? `<p>קבצים: ${share.files.join(', ')}</p>` : ''}
      ${share.note ? `<p>${share.note}</p>` : ''}
    </article>
  `).join('');
}

document.getElementById('addShare').addEventListener('click', () => {
  const files = Array.from(document.getElementById('shareFiles').files).map(file => file.name);
  const share = {
    module: document.getElementById('shareModule').value,
    link: document.getElementById('shareLink').value.trim(),
    note: document.getElementById('shareNote').value.trim(),
    files,
    date: new Date().toLocaleString('he-IL')
  };
  const shares = [share, ...getShares()];
  setShares(shares);
  document.getElementById('shareLink').value = '';
  document.getElementById('shareFiles').value = '';
  document.getElementById('shareNote').value = '';
  renderShares();
});

document.getElementById('clearShares').addEventListener('click', () => {
  setShares([]);
  renderShares();
});

function getProgress() {
  return JSON.parse(localStorage.getItem(progressStateKey) || 'null') || students;
}

function setProgress(data) {
  localStorage.setItem(progressStateKey, JSON.stringify(data));
}

function completion(student) {
  const checks = Object.values(student.checks);
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function renderProgress() {
  const data = getProgress();
  const avg = Math.round(data.reduce((sum, student) => sum + completion(student), 0) / data.length);
  const donePrd = data.filter(student => student.checks.prd).length;
  const connected = data.filter(student => student.checks.connected).length;
  const tests = data.filter(student => student.checks.test).length;

  document.getElementById('progressSummary').innerHTML = `
    <div class="summary-card"><strong>${avg}%</strong><span>התקדמות ממוצעת</span></div>
    <div class="summary-card"><strong>${donePrd}/18</strong><span>PRD כתוב</span></div>
    <div class="summary-card"><strong>${tests}/18</strong><span>בדיקות מוכנות</span></div>
    <div class="summary-card"><strong>${connected}/18</strong><span>חובר למערכת</span></div>
  `;

  document.getElementById('studentsGrid').innerHTML = data.map((student, index) => `
    <article class="student">
      <h3>${student.name}</h3>
      <p>${student.module}</p>
      <div class="bar"><span style="width:${completion(student)}%"></span></div>
      <div class="checks">
        ${Object.entries({
          prd: 'PRD',
          source: 'מקורות',
          ui: 'תוצר UI/פלט',
          test: 'בדיקות',
          connected: 'חיבור למערכת'
        }).map(([key, label]) => `
          <label><input type="checkbox" data-student="${index}" data-check="${key}" ${student.checks[key] ? 'checked' : ''}> ${label}</label>
        `).join('')}
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.student input').forEach(input => {
    input.addEventListener('change', () => {
      const next = getProgress();
      next[Number(input.dataset.student)].checks[input.dataset.check] = input.checked;
      setProgress(next);
      renderProgress();
    });
  });
}

renderShares();
renderProgress();
