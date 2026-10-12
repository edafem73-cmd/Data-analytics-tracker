'use strict';
/* DataPath 90 — vanilla JS, all data in localStorage. */
const KEY = 'datapath90.v1';
const $ = (s, e = document) => e.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const today = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
const diff = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5);
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
const slug = s => String(s).toLowerCase().replace(/[^a-z]+/g, '-');

/* ---------- Static content ---------- */
const PHASES = ['Excel', 'SQL', 'Power BI', 'Statistics', 'Python', 'Portfolio', 'Career'];
const ROADMAP = [
  ['Month 1: Excel and SQL', 'Spreadsheet fundamentals', 'Excel', ['Navigate spreadsheets', 'Understand rows, columns, cells and data types', 'Sort and filter data', 'Format tables correctly', 'Use SUM, AVERAGE, COUNT, MIN and MAX', 'Practice on a small sales dataset']],
  ['Month 1: Excel and SQL', 'Excel analysis', 'Excel', ['Learn IF, SUMIF, SUMIFS, COUNTIF and lookup formulas', 'Remove duplicates and handle missing values', 'Create PivotTables and charts', 'Build a simple sales report', 'Use AI to generate formulas and check the results']],
  ['Month 1: Excel and SQL', 'SQL fundamentals', 'SQL', ['Learn SELECT, FROM, WHERE, ORDER BY and LIMIT', 'Practice comparison and logical operators', 'Use SQLBolt for interactive exercises', 'Answer simple business questions with SQL']],
  ['Month 1: Excel and SQL', 'SQL analysis', 'SQL', ['Learn GROUP BY, aggregate functions, HAVING and JOIN', 'Analyze revenue, customers and product performance', 'Complete a sales analysis project using SQL and Excel']],
  ['Month 2: Power BI and business analysis', 'Power BI fundamentals', 'Power BI', ['Import datasets', 'Understand Power Query', 'Clean and transform data', 'Create basic visualizations']],
  ['Month 2: Power BI and business analysis', 'Dashboards and DAX', 'Power BI', ['Understand data relationships', 'Learn basic measures and DAX', 'Design an interactive sales dashboard', 'Add filters and appropriate KPIs']],
  ['Month 2: Power BI and business analysis', 'Statistics for analysts', 'Statistics', ['Mean, median, mode, percentages and ratios', 'Understand variation and outliers', 'Compare periods and identify trends', 'Distinguish correlation from causation']],
  ['Month 2: Power BI and business analysis', 'Business storytelling', 'Portfolio', ['Turn charts into useful insights', 'Write concise business recommendations', 'Complete and document a dashboard project']],
  ['Month 3: Python, portfolio and career', 'Python essentials', 'Python', ['Variables and data types', 'Lists and dictionaries', 'Conditions and loops', 'Functions', 'Basic error handling']],
  ['Month 3: Python, portfolio and career', 'AI-assisted data analysis', 'Python', ['Use Google Colab', 'Learn Pandas DataFrames and read CSV files', 'Inspect, clean, filter, group and summarize data', 'Create basic charts', 'Ask AI to explain and debug code', 'Verify outputs using totals, row counts and cross-checks']],
  ['Month 3: Python, portfolio and career', 'Portfolio development', 'Portfolio', ['Complete and document project 1: Excel sales analysis report', 'Complete and document project 2: SQL business analysis', 'Complete and document project 3: Power BI sales dashboard (or lightweight alternative)']],
  ['Month 3: Python, portfolio and career', 'Review and consolidation', 'Portfolio', ['Review all three projects against the readiness checklist', 'Write a short description of each project', 'Create a GitHub account and upload your projects', 'Revisit your mistake log and redo weak topics', 'Plan what to learn next']]
];
const FINAL = [
  [85, 'Revisit the mistake log and redo three weak exercises'], [86, 'Review SQL queries and Excel formulas with practice questions'],
  [87, 'Review Python and Pandas basics'], [88, 'Redo one earlier exercise without AI help, then check it with AI'],
  [89, 'Complete the readiness checklist for each project'], [90, 'Complete the final review and plan what to learn next']
];
const trackOf = t => /project|portfolio|Complete/i.test(t) ? 'project' : 'learn';
const TRACKS = { learn: 'Learning and practice', project: 'Portfolio projects' };
const EST = { learn: 60, project: 90, freelance: 30, job: 45 };

const PLANS = [
  { id: 'p90', name: '3-Month Accelerator', days: 90, pace: 'Intensive', best: 'Learners who want an intensive, focused learning experience.', focus: 'Excel, SQL, Power BI, basic statistics, AI-assisted Python and portfolio projects.', benefits: ['Fastest route through every core skill', 'Power BI and statistics in Month 2', 'Python and portfolio in Month 3'], blocks: [[1 / 3, [0, 1, 2, 3]], [1 / 3, [4, 5, 6, 7]], [1 / 3, [8, 9, 10, 11]]] },
  { id: 'p120', name: '4-Month Balanced Journey', days: 120, pace: 'Moderate', best: 'Beginners who want more practice time.', focus: 'The same core skills, with more time for projects and revision.', benefits: ['A full month each for Excel and SQL', 'Dashboard projects in Month 3', 'Portfolio polish in Month 4'], blocks: [[.25, [0, 1]], [.25, [2, 3]], [.25, [4, 5, 6, 7]], [.25, [8, 9, 10, 11]]] },
  { id: 'p180', name: '6-Month Career Builder', days: 180, pace: 'Steady', best: 'Beginners who want a less intensive schedule and deeper practical experience.', focus: 'Stronger Excel and SQL foundations, Power BI, statistics, Python and multiple projects.', benefits: ['Two months on Excel, one on SQL basics', 'More room for several projects', 'A lighter daily load'], blocks: [[1 / 6, [0]], [1 / 6, [1]], [1 / 6, [2]], [1 / 6, [3, 4, 6]], [1 / 6, [5, 7, 8, 9]], [1 / 6, [10, 11]]] },
  { id: 'custom', name: 'Custom Journey', days: 90, pace: 'Flexible', best: 'Learners who want to choose their own study period.', focus: 'The same core stages spread across the days you choose, with prerequisites kept in order.', benefits: ['Choose 30 to 365 days', 'Choose your daily study time', 'Schedule and milestones adjust automatically'], blocks: [[1 / 3, [0, 1, 2, 3]], [1 / 3, [4, 5, 6, 7]], [1 / 3, [8, 9, 10, 11]]] }
];
/* Spread each plan's blocks of roadmap stages across `days`, keeping stage order (Excel, then SQL, then Power BI, then Python). */
function buildTasks(start, plan, days) {
  const tasks = []; let at = 0;
  const mk = (text, desc, phase, week, due) => { const track = trackOf(text); return { id: uid(), title: text, desc, phase, week, priority: track === 'learn' ? 'Medium' : 'High', est: EST[track], actual: 0, due, notes: '', done: false, doneOn: '', track }; };
  plan.blocks.forEach(([frac, weeks], bi, arr) => {
    const end = bi === arr.length - 1 ? days : Math.round(at + frac * days), len = Math.max(1, end - at);
    weeks.forEach((w, k) => {
      const [, title, phase, items] = ROADMAP[w], s0 = at + Math.floor(k * len / weeks.length), span = Math.max(1, at + Math.floor((k + 1) * len / weeks.length) - s0);
      items.forEach((text, i) => tasks.push(mk(text, `Stage ${w + 1}: ${title}`, phase, w + 1, addDays(start, Math.min(days - 1, s0 + Math.floor(i * span / items.length))))));
    });
    at = end;
  });
  FINAL.forEach(([, text], j) => tasks.push(mk(text, 'Final stretch', 'Career', 12, addDays(start, days - FINAL.length + j))));
  return tasks;
}
const DAYS = () => (st.journey && st.journey.days) || 90;
const hoursTarget = () => Math.max(1, DAYS() * ((st.journey && st.journey.hours) || 2));
const paceOf = d => d <= 100 ? 'Intensive' : d <= 150 ? 'Moderate' : 'Steady';
const workload = d => Math.min(100, Math.round(9000 / d));
const CHECK = ['Business question', 'Dataset source', 'Cleaning process', 'Analysis', 'Findings', 'Limitations', 'Screenshots', 'Recommendations'];
const PROMPTS = [
  ['Excel formulas', 'Write a formula', 'I use Excel. My data is in columns A to F with headers in row 1: [list headers]. Write a formula that [goal]. Explain each part and give a way to check the result.'],
  ['Excel formulas', 'Fix a formula', 'This Excel formula returns [error/wrong result]: [formula]. Sample data: [paste 5 rows]. Explain the cause and give a corrected version.'],
  ['SQL query writing', 'Query from a question', 'Table sales(order_id, customer_id, product, amount, order_date). Write a SQL query to answer: [business question]. Explain each clause in plain English.'],
  ['SQL query writing', 'Review my query', 'Review this SQL query for correctness and clarity: [query]. List mistakes, then show an improved version.'],
  ['Python code generation', 'Pandas starter', 'I use Pandas in Google Colab. Write code to load sales.csv, show shape, dtypes and missing values, then total amount by product. Explain each line for a beginner.'],
  ['Debugging and error explanations', 'Explain an error', 'Explain this error in simple terms, the most likely cause, and how to fix it: [paste error and the code that caused it].'],
  ['Data cleaning', 'Cleaning plan', 'Here are 10 rows of my dataset: [paste]. List data quality problems (duplicates, blanks, inconsistent text, wrong types) and a step-by-step cleaning plan for Excel.'],
  ['Statistical interpretation', 'Explain a result', 'My data shows [result]. Explain in plain English what it means, what it does not prove, and what check I should do before telling a client.'],
  ['Dashboard planning', 'KPI plan', 'I am building a [sales] dashboard for [type of business]. Suggest 5 KPIs, the chart for each, and the filters a manager would need.'],
  ['Business insights', 'Findings to recommendations', 'From these findings: [paste]. Write 3 concise business recommendations, each with the evidence and one risk or limitation.'],
  ['Portfolio documentation', 'Project write-up', 'Help me write a portfolio README for my project. Include business question, dataset source, cleaning, analysis, findings, limitations and recommendations. My notes: [paste].'],
];
const RESOURCES = [
  ['Excel tutorials (GCFGlobal)', 'https://edu.gcfglobal.org/en/excel/', 'Excel', 'Excel', 'Weeks 1-2: learn formulas and PivotTables'],
  ['SQLBolt', 'https://sqlbolt.com/', 'SQL', 'SQL', 'Weeks 3-4: interactive SQL practice'],
  ['Microsoft Power BI learning', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi/', 'Power BI', 'Power BI', 'Weeks 5-6: guided modules'],
  ['Khan Academy Statistics', 'https://www.khanacademy.org/math/statistics-probability', 'Statistics', 'Statistics', 'Week 7: concepts and practice'],
  ['Kaggle Learn', 'https://www.kaggle.com/learn/', 'Python', 'Python', 'Weeks 9-10: Python, Pandas, SQL micro-courses'],
  ['Google Colab', 'https://colab.research.google.com/', 'Python', 'Python', 'Run Python in the browser, free'],
  ['GitHub', 'https://github.com/', 'Portfolio', 'Portfolio', 'Week 11-12: host your project portfolio']
];

/* ---------- Form schemas: [key, label, type, options, required] ---------- */
const STAT = {
  clients: ['Not contacted', 'Contacted', 'Replied', 'Negotiating', 'Won', 'Lost'],
  jobs: ['Saved', 'Preparing', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
  projects: ['Planned', 'In progress', 'Completed'],
  resources: ['Not started', 'In progress', 'Completed']
};
const S = {
  tasks: { name: 'task', cols: ['title', 'phase', 'week', 'priority', 'due', 'est', 'actual'], f: [['title', 'Title', 't', 0, 1], ['desc', 'Description', 'a'], ['phase', 'Learning phase', 's', PHASES], ['week', 'Week (1-12)', 'n'], ['priority', 'Priority', 's', ['High', 'Medium', 'Low']], ['est', 'Estimated minutes', 'n'], ['actual', 'Actual minutes', 'n'], ['due', 'Due date', 'd', 0, 1], ['notes', 'Personal notes', 'a']] },
  clients: { name: 'lead', cols: ['name', 'service', 'status', 'followup', 'price', 'received', 'bal', 'delivery'], f: [['name', 'Client or business name', 't', 0, 1], ['contact', 'Contact method', 't'], ['service', 'Service offered', 't'], ['contacted', 'Date contacted', 'd'], ['followup', 'Follow-up date', 'd'], ['status', 'Lead status', 's', STAT.clients], ['price', 'Agreed price', 'n'], ['received', 'Amount received', 'n'], ['deadline', 'Project deadline', 'd'], ['delivery', 'Delivery status', 's', ['Not started', 'In progress', 'Delivered']], ['next', 'Next action', 't'], ['notes', 'Notes', 'a']] },
  services: { name: 'service', cols: ['name', 'price', 'desc'], f: [['name', 'Service', 't', 0, 1], ['price', 'Starting price', 'n'], ['desc', 'What is included', 'a']] },
  jobs: { name: 'application', cols: ['company', 'title', 'status', 'applied', 'interview', 'followup'], f: [['company', 'Company', 't', 0, 1], ['title', 'Job title', 't', 0, 1], ['link', 'Job link', 'u'], ['applied', 'Application date', 'd'], ['skills', 'Required skills', 't'], ['status', 'Status', 's', STAT.jobs], ['cv', 'CV version used', 't'], ['interview', 'Interview date', 'd'], ['followup', 'Follow-up date', 'd'], ['notes', 'Notes and feedback', 'a']] },
  projects: { name: 'project', f: [['title', 'Title', 't', 0, 1], ['problem', 'Business problem', 'a'], ['tool', 'Tool used', 't'], ['dataset', 'Dataset link or local file', 't'], ['skills', 'Skills demonstrated', 't'], ['status', 'Status', 's', STAT.projects], ['start', 'Start date', 'd'], ['end', 'Completion date', 'd'], ['findings', 'Findings and recommendations', 'a'], ['repo', 'GitHub repository link', 'u'], ['shots', 'Screenshots or image references', 't']] },
  resources: { name: 'resource', cols: ['title', 'skill', 'phase', 'purpose', 'status'], f: [['title', 'Title', 't', 0, 1], ['url', 'Link', 'u', 0, 1], ['skill', 'Skill', 's', PHASES], ['phase', 'Learning phase', 's', PHASES], ['purpose', 'Purpose', 't'], ['status', 'Status', 's', STAT.resources]] },
  notes: { name: 'note', cols: ['title', 'date', 'body'], f: [['title', 'Title', 't', 0, 1], ['date', 'Date', 'd'], ['body', 'Learning summary', 'a']] },
  mistakes: { name: 'mistake', cols: ['date', 'error', 'cause', 'solution', 'lesson'], f: [['error', 'Error', 't', 0, 1], ['cause', 'Cause', 'a'], ['solution', 'Solution', 'a'], ['lesson', 'Lesson learned', 'a'], ['date', 'Date', 'd']] }
};
const LABEL = { name: 'Client', service: 'Service', status: 'Status', followup: 'Follow-up', price: 'Price', received: 'Received', bal: 'Balance', delivery: 'Delivery', title: 'Title', phase: 'Phase', week: 'Week', priority: 'Priority', due: 'Due', est: 'Est. min', actual: 'Actual min', company: 'Company', applied: 'Applied', interview: 'Interview', skill: 'Skill', purpose: 'Purpose', date: 'Date', body: 'Summary', error: 'Error', cause: 'Cause', solution: 'Solution', lesson: 'Lesson', desc: 'Details' };
const MONEY = ['price', 'received', 'bal'];
const DATES = ['due', 'followup', 'applied', 'interview', 'date'];

/* ---------- State ---------- */
let st, ui = { route: 'dashboard', q: {}, f: {}, reviewWeek: 1, openWeek: 0 };

function defaults() {
  const start = today();
  return {
    app: 'datapath90', v: 1,
    settings: { start, theme: window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', cur: '₦', target: 50000, plan: [25, 60, 25, 10] },
    journey: null, tasks: [], logs: [],
    clients: [],
    services: [],
    jobs: [],
    projects: [['Excel sales analysis report', 'Excel'], ['SQL business analysis project', 'SQL'], ['Power BI sales dashboard (or lightweight alternative)', 'Power BI / Excel']].map(([title, tool]) => ({ id: uid(), title, problem: '', tool, dataset: '', skills: '', status: 'Planned', start: '', end: '', findings: '', repo: '', shots: '', check: [] })),
    resources: RESOURCES.map(([title, url, skill, phase, purpose]) => ({ id: uid(), title, url, skill, phase, purpose, status: 'Not started' })),
    notes: [], mistakes: [], reviews: [], milestones: [], activity: []
  };
}
function valid(o) { return o && o.app === 'datapath90' && o.settings && typeof o.settings === 'object' && Object.keys(S).every(k => Array.isArray(o[k])) && Array.isArray(o.logs) && Array.isArray(o.reviews) && Array.isArray(o.milestones) && Array.isArray(o.activity); }
function load() {
  try { const o = JSON.parse(localStorage.getItem(KEY)); if (valid(o)) { st = Object.assign(defaults(), o); st.settings = Object.assign(defaults().settings, o.settings); return; } } catch (e) { /* fall through */ }
  st = defaults(); save();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { toast('Could not save: browser storage is full or blocked. Export a backup.'); } }
function log(text) { st.activity.unshift({ t: Date.now(), text }); st.activity = st.activity.slice(0, 60); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2800); }
const money = n => st.settings.cur + (+n || 0).toLocaleString('en-NG');

/* ---------- Calculations ---------- */
const dayNo = () => Math.min(DAYS(), Math.max(1, diff(st.settings.start, today()) + 1));
const weekOf = d => Math.min(12, Math.max(1, Math.floor(diff(st.settings.start, d) * 12 / DAYS()) + 1)); /* 1 of 12 equal periods */
const curWeek = () => { const o = st.tasks.filter(t => !t.done).sort((a, b) => a.due.localeCompare(b.due))[0]; return o ? o.week : 12; }; /* current stage */
const closedJob = j => ['Rejected', 'Withdrawn', 'Offer'].includes(j.status);
function hoursByWeek() { const v = Array(12).fill(0); st.logs.forEach(l => { const w = weekOf(l.date); if (w >= 1 && w <= 12) v[w - 1] += (+l.min || 0) / 60; }); return v; }
function doneByWeek() { const v = Array(12).fill(0); st.tasks.forEach(t => { if (t.done && t.doneOn) { const w = weekOf(t.doneOn); if (w >= 1 && w <= 12) v[w - 1]++; } }); return v; }
function activeDays() { return new Set([...st.logs.map(l => l.date), ...st.tasks.filter(t => t.done && t.doneOn).map(t => t.doneOn)]); }
function streak() { const s = activeDays(); let d = today(); if (!s.has(d)) d = addDays(d, -1); let n = 0; while (s.has(d)) { n++; d = addDays(d, -1); } return n; }
function stats() {
  const T = st.tasks, done = T.filter(t => t.done).length, hours = st.logs.reduce((a, l) => a + (+l.min || 0), 0) / 60;
  const projDone = st.projects.filter(p => p.status === 'Completed').length;
  const learning = Math.round(100 * (0.6 * (T.length ? done / T.length : 0) + 0.4 * Math.min(1, hours / hoursTarget())));
  const projects = st.projects.length ? Math.round(100 * projDone / st.projects.length) : 0;
  return { done, total: T.length, hours, projDone, learning, projects, overall: Math.round(0.7 * learning + 0.3 * projects) };
}
function checkMilestones(week) {
  const ts = st.tasks.filter(t => t.week === week);
  if (ts.length && ts.every(t => t.done) && !st.milestones.some(m => m.key === 'w' + week)) {
    st.milestones.unshift({ id: uid(), key: 'w' + week, date: today(), text: `Completed all Stage ${week} tasks` });
    log(`Milestone: Stage ${week} complete`); toast(`Stage ${week} complete. Well done.`);
  }
}

/* ---------- UI helpers ---------- */
const ICONS = ['M3 12l9-8 9 8M5 10v10h14V10', 'M4 6h16M4 12h16M4 18h10', 'M4 5h16v15H4zM4 10h16M9 3v4M15 3v4', 'M3 7h7l2 2h9v10H3z', 'M4 5h16v11H9l-5 4z', 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM8 8h7', 'M6 3h9l4 4v14H6zM9 12h6M9 16h6', 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3'];
const svg = p => `<svg viewBox="0 0 24 24" width="20" height="20"><path d="${p}"/></svg>`;
const stat = (label, val, sub = '') => `<div class="card stat"><span>${label}</span><b>${val}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
const prog = (label, pct) => `<div class="plabel"><span>${label}</span><b>${pct}%</b></div><div class="prog"><i style="width:${pct}%"></i></div>`;
function bars(vals, labels, unit) {
  const max = Math.max(1, ...vals), W = 480, H = 130, bw = W / vals.length;
  return `<svg class="chart" viewBox="0 0 ${W} ${H + 18}" role="img" aria-label="Bar chart">` + vals.map((v, i) => { const h = v / max * H; return `<rect class="bar" x="${i * bw + 4}" y="${H - h}" width="${bw - 8}" height="${Math.max(h, 1)}" rx="3"><title>${labels[i]}: ${+v.toFixed(1)}${unit}</title></rect><text x="${i * bw + bw / 2}" y="${H + 13}" text-anchor="middle">${labels[i]}</text>`; }).join('') + '</svg>';
}
const WK = Array.from({ length: 12 }, (_, i) => 'P' + (i + 1));
const emptyMsg = (t, c) => `<div class="empty">${t}${c ? `<br><br><button class="btn primary" data-act="add" data-c="${c}">Add ${S[c].name}</button>` : ''}</div>`;

/* ---------- Generic list view (search, filter, sort, edit, delete) ---------- */
function cell(c, k, r) {
  const v = r[k];
  if (k === 'bal') return money(Math.max(0, (+r.price || 0) - (+r.received || 0)));
  if (MONEY.includes(k)) return money(v);
  if (k === 'status') return `<select class="pill" data-st="${c}:${r.id}" aria-label="Status">${STAT[c].map(o => `<option${o === v ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
  if (c === 'resources' && k === 'title') return `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(v)}</a>`;
  if (k === 'priority') return `<span class="pill ${v === 'High' ? 'warn' : ''}">${esc(v)}</span>`;
  if (DATES.includes(k)) { const late = (k === 'due' || k === 'followup') && v && v < today() && !r.done; return v ? `<span class="${late ? 'pill bad' : ''}">${fmt(v)}</span>` : ''; }
  if (k === 'name' && r.demo || k === 'company' && r.demo) return `${esc(v)} <span class="pill sample">Sample</span>`;
  if (k === 'title' && c === 'tasks') return `${esc(v)}<br><span class="muted small">${esc(r.desc)}</span>`;
  return esc(v);
}
const FILTERS = {
  tasks: [['Status', ['Open', 'Done', 'Overdue', 'Due today'], (r, v) => v === 'Open' ? !r.done : v === 'Done' ? r.done : v === 'Overdue' ? !r.done && r.due < today() : !r.done && r.due === today()], ['Phase', PHASES, (r, v) => r.phase === v], ['Priority', ['High', 'Medium', 'Low'], (r, v) => r.priority === v]],
  clients: [['Status', STAT.clients, (r, v) => r.status === v]],
  jobs: [['Status', STAT.jobs, (r, v) => r.status === v], ['Attention', ['Needs attention'], r => !closedJob(r) && ((r.followup && r.followup <= today()) || (r.interview && r.interview >= today() && diff(today(), r.interview) <= 3))]],
  resources: [['Status', STAT.resources, (r, v) => r.status === v], ['Skill', PHASES, (r, v) => r.skill === v], ['Phase', PHASES, (r, v) => r.phase === v]],
  notes: [], mistakes: [], services: []
};
const SORTS = { tasks: 'due', clients: 'followup', jobs: 'followup', resources: 'title', notes: 'date', mistakes: 'date', services: 'name' };
function rows(c) {
  const q = (ui.q[c] || '').toLowerCase(), fs = ui.f[c] || {};
  let r = st[c].filter(x => !q || JSON.stringify(x).toLowerCase().includes(q));
  (FILTERS[c] || []).forEach((f, i) => { if (fs[i]) r = r.filter(x => f[2](x, fs[i])); });
  const k = SORTS[c], rev = ['notes', 'mistakes'].includes(c);
  return r.sort((a, b) => String(a[k] || '~').localeCompare(String(b[k] || '~')) * (rev ? -1 : 1));
}
function tableHTML(c) {
  const r = rows(c), cols = S[c].cols;
  if (!st[c].length) return emptyMsg(`No ${S[c].name}s yet.`, c);
  if (!r.length) return `<div class="empty">Nothing matches your search or filters.</div>`;
  return `<div class="tbl-wrap"><table><thead><tr>${c === 'tasks' ? '<th></th>' : ''}${cols.map(k => `<th>${LABEL[k] || k}</th>`).join('')}<th></th></tr></thead><tbody>` +
    r.map(x => `<tr class="${x.done ? 'done' : ''}">${c === 'tasks' ? `<td><input type="checkbox" data-act="tog" data-id="${x.id}" ${x.done ? 'checked' : ''} aria-label="Complete task"></td>` : ''}${cols.map(k => `<td class="${k === 'title' ? 't' : ''}">${cell(c, k, x)}</td>`).join('')}<td class="act"><button class="btn sm" data-act="edit" data-c="${c}" data-id="${x.id}">Edit</button> <button class="btn sm danger" data-act="del" data-c="${c}" data-id="${x.id}">Delete</button></td></tr>`).join('') + '</tbody></table></div>';
}
function listView(c, title) {
  const fs = FILTERS[c] || [];
  return `<div class="card"><div class="bar-row"><h2 class="grow">${title}</h2><button class="btn primary" data-act="add" data-c="${c}">Add ${S[c].name}</button></div>
  <div class="bar-row"><input type="search" class="grow" placeholder="Search" data-q="${c}" value="${esc(ui.q[c] || '')}" aria-label="Search">${fs.map((f, i) => `<select data-f="${c}:${i}" aria-label="${f[0]}"><option value="">${f[0]}: all</option>${f[1].map(o => `<option${(ui.f[c] || {})[i] === o ? ' selected' : ''}>${o}</option>`).join('')}</select>`).join('')}</div>
  <div id="tbl-${c}">${tableHTML(c)}</div></div>`;
}

/* ---------- Pages ---------- */
function firstOpen(tracks) { return st.tasks.filter(t => !t.done && tracks.includes(t.track)).sort((a, b) => a.due.localeCompare(b.due))[0]; }
function pDash() {
  const s = stats(), t = today(), d = dayNo(), w = curWeek();
  const dueNow = st.tasks.filter(x => !x.done && x.due <= t).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 6);
  const next = firstOpen(['learn', 'project']);
  const upcoming = Array.from({ length: 12 }, (_, i) => i + 1).filter(n => st.tasks.some(x => x.week === n && !x.done)).slice(0, 3);
  return `<div class="card hero"><h2>Welcome back, Christophr</h2><p class="muted">${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${esc(st.journey.name)} · Day ${d} of ${DAYS()} (${DAYS() - d} left) · Stage ${w} · Phase: ${esc(ROADMAP[w - 1][2])}</p>${prog('Overall progress', s.overall)}
  <p class="small muted" style="margin:0">Overall = 70% learning + 30% project completion. Daily target: ${st.journey.hours} h.</p></div>
  <div class="grid g4" style="margin-top:16px">${stat('Day', `${d}/${DAYS()}`, 'Streak: ' + streak() + ' day(s)')}${stat('Tasks completed', `${s.done}/${s.total}`)}${stat('Study hours', s.hours.toFixed(1), 'of ' + Math.round(hoursTarget()) + ' h target')}${stat('Projects', `${s.projDone}/${st.projects.length}`, 'completed')}</div>
  <div class="grid g2"><div class="card"><h3>What should I learn or build today?</h3><p>${next ? `<b>${esc(next.title)}</b><br><span class="muted small">${esc(next.desc)}</span>` : 'All tasks are complete.'}</p></div>
  <div class="card"><h3>Progress</h3>${prog('Learning: 60% tasks + 40% hours vs target', s.learning)}${prog('Projects completed', s.projects)}</div></div>
  <div class="grid g2"><div class="card"><h3>Study hours per period (12 equal parts of your journey)</h3>${bars(hoursByWeek(), WK, 'h')}</div>
  <div class="card"><h3>Today's tasks</h3>${dueNow.length ? `<ul class="list">${dueNow.map(x => `<li><input type="checkbox" data-act="tog" data-id="${x.id}" aria-label="Complete"><span>${esc(x.title)}<br><span class="muted small">Due ${fmt(x.due)} · ${x.est} min</span></span></li>`).join('')}</ul>` : '<div class="empty">Nothing due. Check the planner for upcoming tasks.</div>'}</div></div>
  <div class="grid g2"><div class="card"><h3>Recent activity</h3>${st.activity.length ? `<ul class="list">${st.activity.slice(0, 8).map(a => `<li><span>${esc(a.text)}<br><span class="muted small">${new Date(a.t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></span></li>`).join('')}</ul>` : '<div class="empty">Activity appears here as you work.</div>'}</div>
  <div class="card"><h3>Upcoming milestones</h3><ul class="list">${upcoming.map(n => `<li><span>Finish Stage ${n}: ${esc(ROADMAP[n - 1][1])}<br><span class="muted small">By ${fmt(st.tasks.filter(x => x.week === n).map(x => x.due).sort().pop())}</span></span></li>`).join('') || '<li>All stage milestones reached.</li>'}</ul></div></div>`;
}
function timeline() {
  return `<div class="card tl"><h3>${DAYS()}-day timeline</h3><div class="tl-in">${Object.entries(TRACKS).map(([k, l]) => `<div class="tl-row"><span>${l}</span><div class="tl-cells" style="grid-template-columns:repeat(${DAYS()},1fr)">${Array.from({ length: DAYS() }, (_, i) => { const date = addDays(st.settings.start, i), ts = st.tasks.filter(t => t.track === k && t.due === date); return `<i class="${ts.length ? (ts.every(t => t.done) ? 'done' : 'open') : ''} ${k}${date === today() ? ' now' : ''}" title="Day ${i + 1}: ${ts.map(t => esc(t.title)).join('; ') || 'no tasks'}"></i>`; }).join('')}</div></div>`).join('')}</div><p class="small muted">Filled = completed, outlined = planned, black outline = today.</p></div>`;
}
function pRoadmap() {
  return timeline() + `<div class="card" style="margin:16px 0"><b>Power BI fallback:</b> if Power BI Desktop runs slowly on 6 GB RAM, use Excel PivotTables and charts, SQL queries, and free browser tools (Google Looker Studio) for Weeks 5-6 and project 3.</div>` +
    ROADMAP.map(([m, t, , ], i) => {
      const ts = st.tasks.filter(x => x.week === i + 1), dn = ts.filter(x => x.done).length;
      return `<details class="week" ${ui.openWeek === i + 1 || (!ui.openWeek && i + 1 === curWeek()) ? 'open' : ''} data-w="${i + 1}"><summary><b>Stage ${i + 1} — ${esc(t)}</b><span class="muted small">${esc(m)} · ${fmt(ts.map(x => x.due).sort()[0])} to ${fmt(ts.map(x => x.due).sort().pop())}</span><span class="pill ${dn === ts.length && ts.length ? 'ok' : ''}">${dn}/${ts.length} done</span></summary><div class="body"><ul class="list">${ts.map(x => `<li><input type="checkbox" data-act="tog" data-id="${x.id}" ${x.done ? 'checked' : ''} aria-label="Complete"><span>${esc(x.title)} <span class="pill">${TRACKS[x.track] || ''}</span></span></li>`).join('')}</ul></div></details>`;
    }).join('');
}
function pPlanner() {
  const t = today(), tt = st.tasks.filter(x => x.due === t), td = tt.filter(x => x.done).length, pct = tt.length ? Math.round(100 * td / tt.length) : 0;
  const w = curWeek(), wt = st.tasks.filter(x => x.week === w), wd = wt.filter(x => x.done).length, wh = hoursByWeek()[weekOf(t) - 1] || 0, p = st.settings.plan;
  const od = st.tasks.filter(x => !x.done && x.due < t).length, names = ['Learn a concept', 'Practice with data', 'Work on a project', 'Review mistakes'];
  return `<div class="grid g2"><div class="card"><h3>Daily schedule (${p.reduce((a, b) => a + b, 0)} min)</h3><div class="plan">${p.map((m, i) => `<label class="field">${names[i]} (min)<input type="number" min="0" max="600" value="${m}" data-plan="${i}"></label>`).join('')}</div></div>
  <div class="card"><h3>Today</h3>${prog(tt.length ? `${td} of ${tt.length} tasks due today` : 'No tasks due today', pct)}<p class="small muted">Current stage (${w}): ${wd}/${wt.length} tasks done; ${wh.toFixed(1)} h logged this period.</p>
  <div class="bar-row"><button class="btn" data-act="logplan">Log ${p.reduce((a, b) => a + b, 0)} min today</button><button class="btn" data-act="logform">Log other time</button></div>
  <div class="bar-row"><button class="btn" data-act="resched" ${od ? '' : 'disabled'}>Move ${od} overdue task(s) to today</button></div><p class="small muted">Missed a day? Nothing is lost or reset. Reschedule and carry on.</p></div></div>` + listView('tasks', 'Tasks');
}
function pProjects() {
  return `<div class="bar-row"><span class="grow muted">Replace or edit the three planned projects any time.</span><button class="btn primary" data-act="add" data-c="projects">Add project</button></div>` + (st.projects.length ? `<div class="grid g2">${st.projects.map(p => { const n = CHECK.filter((_, i) => (p.check || [])[i]).length; return `<div class="card"><div class="bar-row"><h3 class="grow">${esc(p.title)}</h3><select class="pill" data-st="projects:${p.id}" aria-label="Status">${STAT.projects.map(o => `<option${o === p.status ? ' selected' : ''}>${o}</option>`).join('')}</select></div>
  <p class="small"><b>Problem:</b> ${esc(p.problem) || '<span class="muted">Not written yet</span>'}<br><b>Tool:</b> ${esc(p.tool)} · <b>Skills:</b> ${esc(p.skills)}<br><b>Dataset:</b> ${esc(p.dataset)}<br><b>Dates:</b> ${fmt(p.start)} to ${fmt(p.end)}<br><b>Findings:</b> ${esc(p.findings)}<br>${p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">GitHub repository</a>` : ''} ${esc(p.shots)}</p>
  ${prog(`Portfolio readiness (${n}/${CHECK.length})`, Math.round(100 * n / CHECK.length))}${CHECK.map((l, i) => `<label class="chk"><input type="checkbox" data-chk="${p.id}:${i}" ${(p.check || [])[i] ? 'checked' : ''}>${l}</label>`).join('')}
  <div class="row"><button class="btn sm" data-act="edit" data-c="projects" data-id="${p.id}">Edit</button><button class="btn sm danger" data-act="del" data-c="projects" data-id="${p.id}">Delete</button></div></div>`; }).join('')}</div>` : emptyMsg('No projects yet.', 'projects'));
}
function pPrompts() {
  const cats = [...new Set(PROMPTS.map(p => p[0]))];
  return `<div class="warn-box"><b>Verify before you deliver.</b> AI can produce wrong code, formulas and conclusions. Check totals, row counts and a few values by hand before sharing any work with a client. This site does not connect to an AI model: copy a prompt, paste it into the assistant you use, then check the answer.</div>` +
    cats.map(c => `<div class="card" style="margin-bottom:16px"><h3>${c}</h3>${PROMPTS.map((p, i) => p[0] === c ? `<div class="prompt"><b>${p[1]}</b><pre>${esc(p[2])}</pre><button class="btn sm" data-act="copy" data-i="${i}">Copy prompt</button></div>` : '').join('')}</div>`).join('');
}
function pNotes() {
  const wk = ui.reviewWeek, rv = st.reviews.find(r => r.week === wk) || { a: [] }, Q = ['What did I learn?', 'What did I build?', 'What mistakes did I correct?', 'What practice exercises did I complete?', 'Which topics do I still find hard?', 'What should I improve next week?'];
  return listView('notes', 'Learning notes') + '<div style="height:16px"></div>' + listView('mistakes', 'Mistake log') +
    `<div class="card" style="margin-top:16px"><div class="bar-row"><h3 class="grow">Weekly review</h3><select id="rv-week" aria-label="Week">${WK.map((_, i) => `<option value="${i + 1}"${i + 1 === wk ? ' selected' : ''}>Week ${i + 1}</option>`).join('')}</select></div>
    <form id="rv-form">${Q.map((q, i) => `<label class="field">${i + 1}. ${q}<textarea name="q${i}">${esc((rv.a || [])[i] || '')}</textarea></label>`).join('')}<button class="btn primary">Save review</button></form></div>
    <div class="card" style="margin-top:16px"><h3>Milestone history</h3>${st.milestones.length ? `<ul class="list">${st.milestones.map(m => `<li><span>${esc(m.text)} <span class="muted small">${fmt(m.date)}</span></span></li>`).join('')}</ul>` : '<div class="empty">Milestones appear when you finish a week or a project.</div>'}</div>`;
}
function pResources() { return listView('resources', 'Learning resources'); }
function pReports() {
  const s = stats(), set = st.settings;
  return `<div class="grid g2"><div class="card"><h3>Study hours per period</h3>${bars(hoursByWeek(), WK, 'h')}</div><div class="card"><h3>Tasks completed per period</h3>${bars(doneByWeek(), WK, '')}</div></div>
  <div class="card"><h3>Summary</h3><div class="tbl-wrap"><table><tbody>
  <tr><td>Tasks completed</td><td>${s.done} of ${s.total}</td></tr><tr><td>Study hours</td><td>${s.hours.toFixed(1)}</td></tr><tr><td>Projects completed</td><td>${s.projDone} of ${st.projects.length}</td></tr><tr><td>Overall progress</td><td>${s.overall}% (learning ${s.learning}%, projects ${s.projects}%)</td></tr></tbody></table></div></div>
  <div class="card" style="margin-top:16px"><h3>Learning plan</h3><p>${esc(st.journey.name)} · ${DAYS()} days · ${st.journey.hours} h/day</p><button class="btn" data-act="switch">Switch plan</button><p class="small muted">Switching keeps your notes and study-time records. You choose whether to keep completed tasks and projects.</p></div><div class="card" style="margin-top:16px"><h3>Settings</h3><div class="plan"><label class="field">Start date (Day 1)<input type="date" id="set-start" value="${set.start}"></label></div>
  <div class="bar-row"><button class="btn" data-act="theme">Switch to ${set.theme === 'dark' ? 'light' : 'dark'} theme</button><button class="btn" data-act="export">Export JSON backup</button><button class="btn" data-act="import">Import JSON backup</button><button class="btn danger" data-act="reset">Reset all data</button></div>
  <p class="small muted">Data is stored only in this browser. Export a backup regularly.</p></div>`;
}
const ROUTES = [['dashboard', 'Dashboard', pDash], ['roadmap', '90-Day Roadmap', pRoadmap], ['planner', 'Daily Planner', pPlanner], ['projects', 'Portfolio Projects', pProjects], ['prompts', 'AI Prompt Library', pPrompts], ['resources', 'Learning Resources', pResources], ['notes', 'Notes and Mistake Log', pNotes], ['reports', 'Reports and Settings', pReports]];

function render() {
  document.documentElement.dataset.theme = st.settings.theme;
  const home = ui.route === 'home' || !st.journey;
  document.body.classList.toggle('landing', home);
  if (home) { $('#landing').innerHTML = landing(); return; }
  const r = ROUTES.find(x => x[0] === ui.route) || ROUTES[0];
  $('#nav').innerHTML = ROUTES.map((x, i) => `<a class="nav-link${x[0] === r[0] ? ' on' : ''}" href="#${x[0]}">${svg(ICONS[i])}${x[1]}</a>`).join('') + `<a class="nav-link" href="#home">${svg(ICONS[0])}Plans home</a>`;
  $('#theme-btn').innerHTML = svg(ICONS[7]) + (st.settings.theme === 'dark' ? 'Light theme' : 'Dark theme');
  $('#page-title').textContent = r[1];
  $('#today-label').textContent = `Day ${dayNo()} of ${DAYS()}`;
  $('#main').innerHTML = r[2]();
  document.title = r[1] + ' | DataPath 90';
}
function go() { ui.route = location.hash.slice(1) || 'dashboard'; document.body.classList.remove('menu'); render(); window.scrollTo(0, 0); }

/* ---------- Forms ---------- */
function openForm(c, id) {
  const sc = S[c], r = id ? st[c].find(x => x.id === id) : { due: today(), week: curWeek(), priority: 'Medium', est: 45, actual: 0, status: STAT[c] ? STAT[c][0] : '', phase: PHASES[0], skill: PHASES[0], delivery: 'Not started', date: today() };
  $('#dlg-body').innerHTML = `<h2>${id ? 'Edit' : 'Add'} ${sc.name}</h2><form id="frm" data-c="${c}" data-id="${id || ''}">${sc.f.map(([k, l, t, o, req]) => {
    const v = r[k] ?? '', a = `name="${k}" ${req ? 'required' : ''}`;
    const inp = t === 'a' ? `<textarea ${a}>${esc(v)}</textarea>` : t === 's' ? `<select ${a}>${o.map(x => `<option${x === v ? ' selected' : ''}>${x}</option>`).join('')}</select>` : `<input ${a} type="${t === 'n' ? 'number" min="0' : t === 'd' ? 'date' : t === 'u' ? 'url' : 'text'}" value="${esc(v)}">`;
    return `<label class="field">${l}${inp}</label>`;
  }).join('')}<div class="row"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn primary">Save</button></div></form>`;
  $('#dlg').showModal();
}
function saveForm(f) {
  const c = f.dataset.c, id = f.dataset.id, sc = S[c], fd = new FormData(f), o = {};
  sc.f.forEach(([k, , t]) => { const v = fd.get(k); o[k] = t === 'n' ? (v === '' ? 0 : +v) : (v || '').trim(); });
  if (id) { const r = st[c].find(x => x.id === id); Object.assign(r, o); if (c === 'tasks') r.track = trackOf(r.title); log(`Updated ${sc.name}: ${o.title || o.name || o.company || o.error}`); }
  else { if (c === 'tasks') { o.done = false; o.doneOn = ''; o.track = trackOf(o.title); } if (c === 'projects') o.check = []; st[c].unshift(Object.assign({ id: uid() }, o)); log(`Added ${sc.name}: ${o.title || o.name || o.company || o.error}`); }
  save(); $('#dlg').close(); render(); toast('Saved');
}
function toggleTask(id, on) {
  const t = st.tasks.find(x => x.id === id); if (!t) return;
  t.done = on; t.doneOn = on ? today() : ''; if (on) { log(`Completed: ${t.title}`); checkMilestones(t.week); }
  save(); render();
}
function setStatus(c, id, v) {
  const r = st[c].find(x => x.id === id); r.status = v; log(`${S[c].name} status: ${r.title || r.name || r.company} → ${v}`);
  if (c === 'projects' && v === 'Completed') { r.end = r.end || today(); if (!st.milestones.some(m => m.key === 'p' + id)) { st.milestones.unshift({ id: uid(), key: 'p' + id, date: today(), text: `Completed project: ${r.title}` }); toast('Project completed. Well done.'); } }
  if (c === 'clients' && ['Contacted', 'Replied', 'Negotiating', 'Won'].includes(v) && !r.contacted) r.contacted = today();
  if (c === 'jobs' && v === 'Applied' && !r.applied) r.applied = today();
  save(); render();
}
function download(name, text) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 500); }
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return Promise.resolve();
}


/* ---------- Landing page, onboarding, plan switching ---------- */
function planCard(p) {
  const c = p.id === 'custom';
  return `<article class="card plan-card"><div><span class="pill info"${c ? ' id="cpace"' : ''}>${c ? paceOf(90) : p.pace}</span></div><h3>${p.name}</h3>
  <div class="plan-days"><b${c ? ' id="cdays"' : ''}>${p.days}</b> days</div>
  <div class="plabel"><span>Workload</span></div><div class="prog"><i${c ? ' id="cbar"' : ''} style="width:${workload(p.days)}%"></i></div>
  <p class="small"><b>Best for:</b> ${p.best}</p><p class="small"><b>Focus:</b> ${p.focus}</p>
  <ul class="small plan-ul">${p.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
  ${c ? '<label class="field">Duration: 30 to 365 days<input type="range" id="cdur" min="30" max="365" value="90"></label><label class="field">Daily study time (hours)<input type="number" id="chrs" min="0.5" max="8" step="0.5" value="2"></label>' : ''}
  <button class="btn primary" data-act="choose" data-p="${p.id}">Choose This Plan</button></article>`;
}
function landing() {
  const note = st.journey ? `<div class="warn-box small">You are on <b>${esc(st.journey.name)}</b>. Choosing another plan keeps your notes, projects choice and study time. <a href="#dashboard">Back to my dashboard</a></div>` : '';
  const prev = `<div class="lp-prev" aria-hidden="true"><div class="pv-row"><div><small>Progress</small><b>42%</b></div><div><small>Study hours</small><b>36 h</b></div><div><small>Day</small><b>38</b></div></div><div class="pv-bars">${[30, 45, 38, 60, 52, 70, 64].map(h => `<i style="height:${h}%"></i>`).join('')}</div><small>Illustrative preview, not real data</small></div>`;
  return `<section class="lp-hero"><div class="lp-in"><div><p class="lp-brand">DataPath Analytics</p><h1>Your Journey to Becoming a Data Analyst Starts Here.</h1><p class="lp-sub">Learn practical data analytics skills, use AI to work smarter, and build real-world projects.</p>
  <div class="bar-row"><button class="btn primary" data-act="scroll" data-t="plans">Explore Learning Plans</button><button class="btn lp-ghost" data-act="scroll" data-t="how">How It Works</button></div></div>${prev}</div></section>
  <section id="plans" class="lp-sec">${note}<h2>Choose your learning plan</h2><p class="muted">Every plan includes the same tools and skills. The difference is how much time each stage gets. Your progress depends on how consistently you study.</p><div class="plans">${PLANS.map(planCard).join('')}</div></section>
  <section id="how" class="lp-sec"><h2>How it works</h2><ol class="how"><li><b>Pick a plan.</b> Compare duration, pace and workload.</li><li><b>Set it up.</b> Choose a start date, daily study time and your priority.</li><li><b>Follow today's tasks.</b> Your schedule and milestones are built for your timeline.</li><li><b>Track results.</b> Log study time, finish projects, record mistakes, then review each week.</li></ol></section>`;
}
function openOnboard(id, days, hours) {
  const p = PLANS.find(x => x.id === id), c = id === 'custom';
  days = Math.min(365, Math.max(30, days || p.days)); hours = Math.min(8, Math.max(0.5, hours || 2));
  $('#dlg-body').innerHTML = `<h2>Set up: ${p.name}</h2><form id="onb" data-p="${id}">
  <label class="field">Duration in days${c ? ' (30 to 365)' : ''}<input type="number" name="days" min="30" max="365" value="${days}" ${c ? '' : 'readonly'} required></label>
  <label class="field">Start date<input type="date" name="start" value="${today()}" required></label>
  <label class="field">Daily study hours<input type="number" name="hours" min="0.5" max="8" step="0.5" value="${hours}" required></label>
  <div class="row"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn primary">Confirm plan</button></div></form>`;
  $('#dlg').showModal();
}
function confirmPlan(f) {
  const p = PLANS.find(x => x.id === f.dataset.p), d = new FormData(f), old = st.tasks;
  const days = Math.min(365, Math.max(30, Math.round(+d.get('days') || p.days))), hours = Math.min(8, Math.max(0.5, +d.get('hours') || 2)), start = d.get('start') || today();
  const keep = old.length ? confirm('Keep your completed tasks and projects in the new schedule?\nOK = keep them. Cancel = start tasks and projects fresh.\nNotes and study time are always kept.') : false;
  st.tasks = buildTasks(start, p, days);
  if (keep) {
    st.tasks.forEach(t => { const o = old.find(x => x.done && x.title === t.title); if (o) { t.done = true; t.doneOn = o.doneOn; t.actual = o.actual; t.notes = o.notes; } });
    old.filter(o => o.done && !st.tasks.some(t => t.title === o.title)).forEach(o => st.tasks.push(o));
  } else if (old.length) st.projects = defaults().projects;
  st.settings.start = start;
  st.settings.plan = [25, 60, 25, 10].map(m => Math.round(m * hours * 60 / 120));
  st.journey = { id: p.id, name: p.id === 'custom' ? `Custom Journey (${days} days)` : p.name, days, hours };
  log(`Started plan: ${st.journey.name}`); save(); $('#dlg').close();
  ui.route = 'dashboard'; location.hash = '#dashboard'; render(); toast('Plan confirmed');
}

/* ---------- Events ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, c = b.dataset.c, id = b.dataset.id;
  if (a === 'menu') document.body.classList.toggle('menu');
  else if (a === 'theme') { st.settings.theme = st.settings.theme === 'dark' ? 'light' : 'dark'; save(); render(); }
  else if (a === 'add') openForm(c);
  else if (a === 'edit') openForm(c, id);
  else if (a === 'close') $('#dlg').close();
  else if (a === 'del') { if (confirm('Delete this ' + S[c].name + '? This cannot be undone.')) { st[c] = st[c].filter(x => x.id !== id); log('Deleted a ' + S[c].name); save(); render(); toast('Deleted'); } }
  else if (a === 'tog') toggleTask(id, b.checked);
  else if (a === 'copy') copyText(PROMPTS[+b.dataset.i][2]).then(() => toast('Prompt copied'), () => toast('Copy failed. Select the text manually.'));
  else if (a === 'choose') { const p = PLANS.find(x => x.id === b.dataset.p), c = p.id === 'custom'; openOnboard(p.id, c ? +$('#cdur').value : p.days, c ? +$('#chrs').value : 2); }
  else if (a === 'scroll') { const el = document.getElementById(b.dataset.t); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
  else if (a === 'switch') location.hash = '#home';
  else if (a === 'logplan') { const m = st.settings.plan.reduce((x, y) => x + y, 0); st.logs.push({ id: uid(), date: today(), min: m, topic: 'Daily plan' }); log(`Logged ${m} minutes of study`); save(); render(); toast('Study time logged'); }
  else if (a === 'logform') {
    $('#dlg-body').innerHTML = `<h2>Log study time</h2><form id="logfrm"><label class="field">Date<input type="date" name="date" value="${today()}" required></label><label class="field">Minutes<input type="number" name="min" min="1" max="1440" value="60" required></label><label class="field">Topic<input name="topic"></label><div class="row"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn primary">Save</button></div></form>`; $('#dlg').showModal();
  }
  else if (a === 'resched') { const t = today(); let n = 0; st.tasks.forEach(x => { if (!x.done && x.due < t) { x.due = t; n++; } }); log(`Rescheduled ${n} overdue tasks to today`); save(); render(); toast(`${n} task(s) moved to today. No penalty.`); }
  else if (a === 'export') { download(`datapath90-backup-${today()}.json`, JSON.stringify(st, null, 2)); toast('Backup downloaded'); }
  else if (a === 'import') $('#import-file').click();
  else if (a === 'clearsample') { if (confirm('Remove all sample records?')) { st.clients = st.clients.filter(x => !x.demo); st.jobs = st.jobs.filter(x => !x.demo); save(); render(); toast('Sample records removed'); } }
  else if (a === 'reset') { if (confirm('Reset ALL data? This deletes every task, note and record in this browser.') && confirm('Last check: have you exported a backup? Reset now?')) { st = defaults(); save(); render(); toast('All data reset'); } }
});
document.addEventListener('submit', e => {
  e.preventDefault(); const f = e.target;
  if (f.id === 'onb') confirmPlan(f);
  else if (f.id === 'frm') saveForm(f);
  else if (f.id === 'logfrm') { const d = new FormData(f); st.logs.push({ id: uid(), date: d.get('date'), min: +d.get('min'), topic: d.get('topic') }); log(`Logged ${d.get('min')} minutes of study`); save(); $('#dlg').close(); render(); toast('Study time logged'); }
  else if (f.id === 'rv-form') { const d = new FormData(f), a = [0, 1, 2, 3, 4, 5].map(i => d.get('q' + i)), ex = st.reviews.find(r => r.week === ui.reviewWeek); if (ex) ex.a = a; else st.reviews.push({ id: uid(), week: ui.reviewWeek, a }); log(`Saved Week ${ui.reviewWeek} review`); save(); toast('Review saved'); }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'cdur') { $('#cdays').textContent = t.value; $('#cbar').style.width = workload(+t.value) + '%'; $('#cpace').textContent = paceOf(+t.value); return; }
  if (t.dataset.q) { ui.q[t.dataset.q] = t.value; $('#tbl-' + t.dataset.q).innerHTML = tableHTML(t.dataset.q); }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.f) { const [c, i] = t.dataset.f.split(':'); (ui.f[c] = ui.f[c] || {})[i] = t.value; $('#tbl-' + c).innerHTML = tableHTML(c); }
  else if (t.dataset.st) { const [c, id] = t.dataset.st.split(':'); setStatus(c, id, t.value); }
  else if (t.dataset.chk) { const [id, i] = t.dataset.chk.split(':'), p = st.projects.find(x => x.id === id); p.check = p.check || []; p.check[+i] = t.checked; save(); render(); }
  else if (t.dataset.plan) { st.settings.plan[+t.dataset.plan] = Math.max(0, +t.value || 0); save(); render(); }
  else if (t.id === 'rv-week') { ui.reviewWeek = +t.value; render(); }
  else if (t.id === 'set-cur') { st.settings.cur = t.value || '₦'; save(); render(); }
  else if (t.id === 'set-target') { st.settings.target = Math.max(1, +t.value || 1); save(); render(); }
  else if (t.id === 'set-start' && t.value) { const d = diff(st.settings.start, t.value); if (d && confirm(`Shift every task and the timeline by ${d} day(s)?`)) { st.tasks.forEach(x => { x.due = addDays(x.due, d); }); st.settings.start = t.value; save(); render(); toast('Start date updated'); } else render(); }
  else if (t.id === 'import-file') {
    const file = t.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = () => { try { const o = JSON.parse(rd.result); if (!valid(o)) throw new Error('bad'); if (confirm('Replace all current data with this backup?')) { st = Object.assign(defaults(), o); st.settings = Object.assign(defaults().settings, o.settings); save(); render(); toast('Backup imported'); } } catch (err) { toast('Import failed: this is not a valid DataPath 90 backup.'); } t.value = ''; };
    rd.readAsText(file);
  }
});
$('#dlg').addEventListener('click', e => { if (e.target === $('#dlg')) $('#dlg').close(); });
window.addEventListener('hashchange', go);
load(); go();