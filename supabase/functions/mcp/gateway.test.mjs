import { handle } from './core.ts';
import { createHash } from 'node:crypto';

const sha = s => createHash('sha256').update(s).digest('hex');
const TOKENS = {rw: 'pd_' + 'a'.repeat(48), ro: 'pd_' + 'b'.repeat(48), gone: 'pd_' + 'c'.repeat(48), other: 'pd_' + 'd'.repeat(48)};
const T = {
  ai_tokens: [
    {id: 'k1', user_id: 'u1', name: 'codex', token_hash: sha(TOKENS.rw), can_write: true, revoked_at: null, last_used_at: null},
    {id: 'k2', user_id: 'u1', name: 'chatgpt', token_hash: sha(TOKENS.ro), can_write: false, revoked_at: null, last_used_at: null},
    {id: 'k3', user_id: 'u1', name: 'old', token_hash: sha(TOKENS.gone), can_write: true, revoked_at: '2026-10-01T00:00:00Z', last_used_at: null},
    {id: 'k4', user_id: 'u2', name: 'intruder', token_hash: sha(TOKENS.other), can_write: true, revoked_at: null, last_used_at: null}
  ],
  projects: [
    {id: 'p_dp', user_id: 'u1', name: 'Demand Plan', area: 'work', color: 'c2', archived: false},
    {id: 'p_sales', user_id: 'u1', name: 'Sales', area: 'work', color: 'c1', archived: false},
    {id: 'p_inv', user_id: 'u1', name: 'Investment', area: 'personal', color: 'c2', archived: false},
    {id: 'p_x', user_id: 'u2', name: 'SECRET OF USER 2', area: 'work', color: 'c1', archived: false}
  ],
  tasks: [
    {id: 't1', user_id: 'u1', title: 'Build the weekly report', area: 'work', project_id: 'p_sales', status: 'todo', priority: 0, due: '2026-11-13', pct: 10, notes: '', subtasks: [{t: 'Plan what is needed', done: false}, {t: 'Create a webapp', done: false}], log: [], focus_date: null, done_date: null, created_at: '2026-10-20T00:00:00Z'},
    {id: 't2', user_id: 'u1', title: 'Plan next quarter', area: 'work', project_id: 'p_dp', status: 'doing', priority: 2, due: '2026-11-03', pct: 0, notes: 'n', subtasks: [], log: [], focus_date: '2026-11-02', done_date: null, created_at: '2026-11-02T00:00:00Z'},
    {id: 't3', user_id: 'u1', title: 'Late thing', area: 'personal', project_id: null, status: 'blocked', priority: 1, due: '2026-10-30', pct: 0, notes: '', subtasks: [], log: [], focus_date: null, done_date: null, created_at: '2026-10-01T00:00:00Z'},
    {id: 'tx', user_id: 'u2', title: 'USER 2 PRIVATE TASK', area: 'work', project_id: 'p_x', status: 'todo', priority: 2, due: null, pct: 0, notes: '', subtasks: [], log: [], focus_date: null, done_date: null, created_at: '2026-10-01T00:00:00Z'}
  ],
  deleted_tasks: [],
  todos: [
    {id: 'd1', user_id: 'u1', text: 'Call my manager', day: '2026-11-02', done: false, done_at: null, created_at: '2026-11-01T01:00:00Z'},
    {id: 'd2', user_id: 'u1', text: 'Buy moisturizer', day: '2026-11-01', done: false, done_at: null, created_at: '2026-11-01T02:00:00Z'},
    {id: 'd3', user_id: 'u1', text: 'Book a haircut', day: '2026-11-05', done: false, done_at: null, created_at: '2026-11-01T03:00:00Z'},
    {id: 'd4', user_id: 'u1', text: 'Look into a standing desk', day: null, done: false, done_at: null, created_at: '2026-11-01T04:00:00Z'},
    {id: 'dx', user_id: 'u2', text: 'USER 2 PRIVATE TODO', day: '2026-11-02', done: false, done_at: null, created_at: '2026-11-01T05:00:00Z'}
  ],
  checkins: [{user_id: 'u1', date: '2026-11-02', body: 2, mind: 2, mode: 'relax', note: '', wrap: ''}, {user_id: 'u2', date: '2026-11-02', body: 5, mind: 5, mode: 'push', note: 'u2', wrap: ''}]
};
function from(t){
  let op = 'select', payload, fl = [], rng, ord;
  const api = {
    select(){ return api; }, delete(){ op = 'delete'; return api; }, insert(r){ op = 'insert'; payload = r; return api; }, update(r){ op = 'update'; payload = r; return api; },
    eq(k, v){ fl.push([k, v]); return api; }, order(k){ ord = k; return api; }, range(a, b){ rng = [a, b]; return api; },
    then(res, rej){ return Promise.resolve().then(run).then(res, rej); }
  };
  const match = r => fl.every(([k, v]) => r[k] === v);
  function run(){
    if(op === 'select'){ let o = T[t].filter(match); if(ord) o = o.slice().sort((a, b) => String(a[ord]).localeCompare(String(b[ord]))); if(rng) o = o.slice(rng[0], rng[1] + 1); return {data: JSON.parse(JSON.stringify(o)), error: null}; }
    if(op === 'insert'){ T[t].push(payload); return {error: null}; }
    if(op === 'delete'){ T[t] = T[t].filter(r => !match(r)); return {error: null}; }
    if(op === 'update'){ T[t].filter(match).forEach(r => Object.assign(r, payload)); return {error: null}; }
  }
  return api;
}
const db = {from};
const deps = {db, tz: 'Asia/Bangkok', now: () => new Date('2026-11-02T05:00:00Z')};

let n = 0, bad = 0;
const ok = (cond, msg, extra) => { n++; if(!cond){ bad++; console.log('FAIL:', msg, extra !== undefined ? JSON.stringify(extra).slice(0, 300) : ''); } };
async function post(body, token, via = 'header'){
  const url = 'https://x.test/functions/v1/mcp' + (via === 'query' ? '?key=' + token : '');
  const headers = {'content-type': 'application/json'}; if(token && via === 'header') headers.authorization = 'Bearer ' + token;
  const r = await handle(new Request(url, {method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body)}), deps);
  const txt = await r.text(); return {status: r.status, json: txt ? JSON.parse(txt) : null};
}
let id = 0;
const call = async (name, args, token = TOKENS.rw) => { const r = await post({jsonrpc: '2.0', id: ++id, method: 'tools/call', params: {name, arguments: args}}, token); return {status: r.status, err: r.json.result?.isError, data: (() => { try{ return JSON.parse(r.json.result.content[0].text); }catch{ return r.json.result?.content?.[0]?.text; } })(), raw: r.json}; };

// protocol + auth
let r = await post({jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2025-03-26', capabilities: {}, clientInfo: {name: 't', version: '1'}}}, TOKENS.rw);
ok(r.status === 200 && r.json.result.protocolVersion === '2025-03-26' && r.json.result.serverInfo.name === 'progress-dashboard' && r.json.result.instructions.includes('restore_task'), 'initialize', r);
r = await post({jsonrpc: '2.0', method: 'notifications/initialized'}, TOKENS.rw); ok(r.status === 202, 'notification returns 202', r);
r = await post({jsonrpc: '2.0', id: 2, method: 'tools/list'}, TOKENS.rw);
const names = r.json.result.tools.map(t => t.name);
ok(names.length === 22 && ['delete_task', 'save_checkin', 'restore_task', 'list_todos', 'add_todo', 'update_todo'].every(n => names.includes(n)), 'tool list has 22', names);
ok(r.json.result.tools.find(t => t.name === 'delete_task').annotations.destructiveHint === true && r.json.result.tools.find(t => t.name === 'update_task').annotations.destructiveHint === false, 'only delete_task is flagged destructive');
ok(r.json.result.tools.every(t => t.inputSchema.type === 'object' && t.annotations), 'schemas and annotations present');
ok(r.json.result.tools.find(t => t.name === 'list_tasks').annotations.readOnlyHint === true && r.json.result.tools.find(t => t.name === 'add_task').annotations.readOnlyHint === false, 'readOnlyHint set correctly');
r = await post({jsonrpc: '2.0', id: 3, method: 'tools/list'}, 'pd_wrong' + 'x'.repeat(40)); ok(r.status === 401, 'wrong token -> 401', r);
r = await post({jsonrpc: '2.0', id: 3, method: 'tools/list'}, TOKENS.gone); ok(r.status === 401, 'revoked token -> 401', r);
r = await post({jsonrpc: '2.0', id: 3, method: 'tools/list'}, undefined); ok(r.status === 401, 'no token -> 401', r);
r = await post({jsonrpc: '2.0', id: 3, method: 'tools/list'}, TOKENS.ro, 'query'); ok(r.status === 200, 'token via ?key= works (for ChatGPT)', r);
r = await post('{not json', TOKENS.rw); ok(r.status === 400 && r.json.error.code === -32700, 'bad json -> parse error', r);
r = await post({jsonrpc: '2.0', id: 9, method: 'nope'}, TOKENS.rw); ok(r.json.error.code === -32601, 'unknown method', r);
r = await post([{jsonrpc: '2.0', id: 1, method: 'ping'}, {jsonrpc: '2.0', id: 2, method: 'tools/list'}], TOKENS.rw); ok(Array.isArray(r.json) && r.json.length === 2, 'batch', r);
const get = await handle(new Request('https://x.test/', {method: 'GET'}), deps); ok(get.status === 405, 'GET -> 405');
ok(T.ai_tokens[0].last_used_at !== null, 'last_used_at recorded');

// reads + isolation
let c = await call('get_overview', {});
ok(c.data.today === '2026-11-02', 'today uses Asia/Bangkok date', c.data.today);
ok(c.data.counts.open === 3 && c.data.counts.overdue === 1 && c.data.counts.blocked === 1 && c.data.counts.in_todays_priority === 1, 'overview counts', c.data.counts);
ok(!JSON.stringify(c.data).includes('USER 2') && !JSON.stringify(c.data).includes('SECRET OF USER 2'), 'overview leaks nothing from user 2');
ok(c.data.latest_checkin.mode === 'relax', 'latest checkin is own', c.data.latest_checkin);
c = await call('list_tasks', {status: 'all', include_details: true});
ok(c.data.total_matching === 3 && !JSON.stringify(c.data).includes('USER 2'), 'list_tasks isolated to owner', c.data.total_matching);
ok(c.data.tasks[0].id === 't2' && c.data.tasks[0].priority === 'Urgent', 'sorted by priority first', c.data.tasks.map(t => t.id));
c = await call('list_tasks', {category: 'demand plan'}); ok(c.data.tasks.length === 1 && c.data.tasks[0].id === 't2', 'filter by category (case-insensitive)');
c = await call('list_tasks', {search: 'webapp'}); ok(c.data.tasks.length === 1 && c.data.tasks[0].id === 't1', 'search finds subtask text');
c = await call('list_tasks', {min_priority: 'High', area: 'Company'}); ok(c.data.tasks.length === 1 && c.data.tasks[0].id === 't2', 'min_priority + area');
c = await call('get_task', {id: 'tx'}); ok(c.err === true && /No task with id/.test(c.data), 'cannot read user 2 task by id', c.data);
c = await call('get_task', {id: 't1'}); ok(c.data.subtasks.length === 2 && c.data.category === 'Sales', 'get_task detail', c.data);
c = await call('list_categories', {}); ok(c.data.categories.length === 3 && !JSON.stringify(c.data).includes('SECRET'), 'categories isolated');
c = await call('get_readiness', {days: 7}); ok(c.data.checkins.length === 1 && c.data.checkins[0].mode === 'relax', 'readiness isolated', c.data);

// prioritisation (read-only)
c = await call('suggest_priorities', {count: 5}, TOKENS.ro);
ok(!c.err && c.data.full_ranking[0].id === 't2' && c.data.full_ranking[0].score === 93, 'suggest: Urgent+due tomorrow+doing+picked ranks first with score 93', c.data.full_ranking && c.data.full_ranking.map(x => [x.id, x.score]));
ok(c.data.full_ranking[0].reasons.includes('Urgent priority') && c.data.full_ranking[0].reasons.includes('Due tomorrow') && c.data.full_ranking[0].reasons.includes('Already in progress'), 'suggest: reasons are stated', c.data.full_ranking[0].reasons);
ok(c.data.suggested_todays_priority.map(x => x.id).join() === 't2,t1', 'suggest: blocked task excluded from the suggested list', c.data.suggested_todays_priority.map(x => x.id));
ok(c.data.blocked_needing_attention.length === 1 && c.data.blocked_needing_attention[0].id === 't3' && c.data.blocked_needing_attention[0].reasons.some(x => /Overdue by 3 days/.test(x)) && c.data.blocked_needing_attention[0].reasons.some(x => /Blocked/.test(x)), 'suggest: blocked + overdue surfaced with reasons', c.data.blocked_needing_attention);
ok(c.data.readiness_today && c.data.readiness_today.mode === 'relax' && /short list/.test(c.data.readiness_today.note), 'suggest: mentions the owner\'s mode as a note only');
ok(c.data.suggested_todays_priority.length === 2 && !JSON.stringify(c.data).includes('USER 2'), 'suggest: count is a hint (not padded) and nothing from user 2');
c = await call('suggest_priorities', {count: 1}); ok(c.data.suggested_todays_priority.length === 1, 'suggest: respects count');
c = await call('suggest_priorities', {category: 'Sales'}); ok(c.data.full_ranking.length === 1 && c.data.full_ranking[0].id === 't1', 'suggest: category filter');
const before = JSON.stringify(T.tasks); await call('suggest_priorities', {}); ok(JSON.stringify(T.tasks) === before, 'suggest changes nothing');

// set_task_priorities (validate first, then apply)
c = await call('set_task_priorities', {items: [{id: 't1', priority: 'High'}, {id: 'nope', priority: 'Urgent'}]});
ok(c.err && T.tasks.find(t => t.id === 't1').priority === 0, 'set_task_priorities: one bad id means nothing is changed', c.data);
c = await call('set_task_priorities', {items: [{id: 't1', priority: 'High'}, {id: 'tx', priority: 'Urgent'}]});
ok(c.err && T.tasks.find(t => t.id === 't1').priority === 0 && T.tasks.find(t => t.id === 'tx').priority === 2, 'set_task_priorities: cannot touch user 2 task, and nothing partial', c.data);
c = await call('set_task_priorities', {items: [{id: 't1', priority: 'bogus'}]}); ok(c.err && /priority must be/.test(c.data), 'set_task_priorities: bad level rejected');
c = await call('set_task_priorities', {items: [{id: 't1', priority: 'High'}, {id: 't2', priority: 'Urgent'}]});
ok(c.data.ok && c.data.changed === 1 && c.data.unchanged === 1 && c.data.details[0].from === 'Normal' && c.data.details[0].to === 'High' && T.tasks.find(t => t.id === 't1').priority === 1 && T.tasks.find(t => t.id === 't1').updated_by === 'codex', 'set_task_priorities: applies only real changes and records who', c.data);
c = await call('set_task_priorities', {items: []}); ok(c.err, 'set_task_priorities: empty list rejected');
c = await call('set_task_priorities', {items: Array.from({length: 51}, () => ({id: 't1', priority: 'High'}))}); ok(c.err, 'set_task_priorities: more than 50 rejected');
T.tasks.find(t => t.id === 't1').priority = 0; // restore for later checks

// set_todays_priority
c = await call('set_todays_priority', {ids: ['t1']});
ok(c.data.ok && T.tasks.find(t => t.id === 't1').focus_date === '2026-11-02' && T.tasks.find(t => t.id === 't2').focus_date === null && c.data.todays_priority.length === 1, 'set_todays_priority replace: new list set, old pick cleared', c.data);
c = await call('set_todays_priority', {ids: ['t2'], mode: 'add'}); ok(c.data.todays_priority.length === 2, 'set_todays_priority add keeps the others', c.data.todays_priority);
c = await call('set_todays_priority', {ids: ['t1'], mode: 'remove'}); ok(T.tasks.find(t => t.id === 't1').focus_date === null && c.data.todays_priority.length === 1, 'set_todays_priority remove');
c = await call('set_todays_priority', {ids: ['tx']}); ok(c.err && T.tasks.find(t => t.id === 'tx').focus_date === null, 'set_todays_priority: cannot pick user 2 task');
c = await call('set_todays_priority', {ids: ['t1', 'nope']}); ok(c.err && T.tasks.find(t => t.id === 't1').focus_date === null, 'set_todays_priority: unknown id means nothing changes');
c = await call('set_todays_priority', {ids: ['t1'], mode: 'wipe'}); ok(c.err, 'set_todays_priority: bad mode rejected');
c = await call('set_todays_priority', {ids: Array.from({length: 21}, (_, i) => 'x' + i)}); ok(c.err, 'set_todays_priority: more than 20 rejected');
T.tasks.push({id: 'tdone', user_id: 'u1', title: 'Finished', area: 'work', project_id: null, status: 'done', priority: 0, due: null, pct: 100, notes: '', subtasks: [], log: [], focus_date: null, done_date: '2026-11-01', created_at: '2026-10-01T00:00:00Z'});
c = await call('set_todays_priority', {ids: ['tdone']}); ok(c.err && /already done/.test(c.data), 'set_todays_priority: done task cannot be picked');
c = await call('set_todays_priority', {ids: ['t1']}, TOKENS.ro); ok(c.err && /read-only/.test(c.data), 'set_todays_priority blocked for read-only token');
c = await call('set_task_priorities', {items: [{id: 't1', priority: 'High'}]}, TOKENS.ro); ok(c.err && /read-only/.test(c.data), 'set_task_priorities blocked for read-only token');
T.tasks.splice(T.tasks.findIndex(t => t.id === 'tdone'), 1);
await call('set_todays_priority', {ids: ['t2'], mode: 'replace'}); // back to the starting state: only t2 picked

// hardening
for(const bad of ['pd_' + 'A'.repeat(48), 'pd_' + 'a'.repeat(47), 'pd_' + 'a'.repeat(49), 'x' + 'a'.repeat(50), 'pd_' + 'g'.repeat(48), "pd_' or 1=1 --" + 'a'.repeat(40)]){
  r = await post({jsonrpc: '2.0', id: 1, method: 'ping'}, bad); ok(r.status === 401, 'malformed token rejected before the database: ' + bad.slice(0, 18), r.status);
}
r = await post({jsonrpc: '2.0', id: 1, method: 'tools/call', params: {name: 'add_task', arguments: {title: 'x'.repeat(150000)}}}, TOKENS.rw); ok(r.status === 413, 'oversized request -> 413', r.status);
r = await post(Array.from({length: 21}, (_, i) => ({jsonrpc: '2.0', id: i + 1, method: 'ping'})), TOKENS.rw); ok(r.status === 400, 'batch over 20 rejected', r.status);
c = await call('add_task', {title: 'many', category: 'Demand Plan', due: 'today', subtasks: Array.from({length: 101}, (_, i) => 's' + i)}); ok(c.err && /At most 100/.test(c.data), 'subtask cap enforced');
c = await call('add_task', {title: 'x'.repeat(301), category: 'Demand Plan', due: 'today'}); ok(c.err && /too long/.test(c.data), 'title length cap');
c = await call('log_progress', {id: 't2', text: 'y'.repeat(2001)}); ok(c.err && /too long/.test(c.data), 'log length cap');
c = await call('nope_tool', {}); ok(c.raw.error && c.raw.error.code === -32602, 'unknown tool is a protocol error');
{ // database failures must not leak internal details to the AI
  const failing = {from: t => { const real = from(t); const o = Object.create(real); o.insert = () => ({then: (res) => res({error: {message: 'SECRET internal detail: relation "tasks" violates something'}})}); return o; }};
  const rr = await handle(new Request('https://x.test/', {method: 'POST', headers: {'content-type': 'application/json', authorization: 'Bearer ' + TOKENS.rw}, body: JSON.stringify({jsonrpc: '2.0', id: 5, method: 'tools/call', params: {name: 'add_task', arguments: {title: 'will fail', category: 'Demand Plan', due: 'today'}}})}), {db: failing, tz: 'Asia/Bangkok', now: deps.now});
  const txt = await rr.text(); ok(!txt.includes('SECRET') && /Something went wrong/.test(txt), 'database errors are not leaked to the AI', txt.slice(0, 200));
}

// writes
c = await call('add_task', {title: 'Send Q4 forecast', category: 'Demand Plan', priority: 'High', due: 'tomorrow', subtasks: ['Draft', 'Review'], add_to_todays_priority: true});
const added = T.tasks.find(t => t.title === 'Send Q4 forecast');
ok(c.data.ok && added && added.user_id === 'u1' && added.project_id === 'p_dp' && added.area === 'work' && added.priority === 1 && added.due === '2026-11-03' && added.focus_date === '2026-11-02' && added.updated_by === 'codex' && added.subtasks.length === 2 && added.status === 'todo', 'add_task row', added);
c = await call('add_task', {title: 'x', category: 'Nope', due: 'today'}); ok(c.err && /No category named/.test(c.data) && /Demand Plan/.test(c.data), 'unknown category explains options', c.data);
c = await call('add_task', {title: 'Buy gift', category: 'Investment', due: '2026-12-01'}); ok(c.data.ok && T.tasks.at(-1).area === 'personal' && T.tasks.at(-1).project_id === 'p_inv', 'personal task under its category');
c = await call('add_task', {title: 'No deadline', category: 'Demand Plan'}); ok(c.err && /deadline/.test(c.data), 'add_task without a deadline is refused', c.data);
c = await call('add_task', {title: 'No category', due: 'today'}); ok(c.err && /category/.test(c.data), 'add_task without a category is refused', c.data);
c = await call('update_task', {id: 't2', due: ''}); ok(c.err && /deadline/.test(c.data) && T.tasks.find(t => t.id === 't2').due === '2026-11-03', 'a deadline cannot be cleared', c.data);
c = await call('add_task', {title: 'bad date', category: 'Demand Plan', due: '12/01/2026'}); ok(c.err && /YYYY-MM-DD/.test(c.data), 'bad date rejected');
c = await call('add_task', {title: '   ', category: 'Demand Plan', due: 'today'}); ok(c.err, 'empty title rejected');
c = await call('update_task', {id: 't1', status: 'doing', priority: 'Urgent', due: '2026-11-20', category: 'Investment'});
const t1 = T.tasks.find(t => t.id === 't1');
ok(c.data.ok && t1.status === 'doing' && t1.priority === 2 && t1.due === '2026-11-20' && t1.project_id === 'p_inv' && t1.area === 'personal' && t1.updated_by === 'codex' && t1.touch_date === '2026-11-02', 'update_task fields, new deadline, moves category/area', t1);
c = await call('update_task', {id: 't1'}); ok(c.err && /Nothing to change/.test(c.data), 'empty update rejected');
c = await call('update_task', {id: 'tx', title: 'hacked'}); ok(c.err && T.tasks.find(t => t.id === 'tx').title === 'USER 2 PRIVATE TASK', 'cannot modify user 2 task', c.data);
c = await call('complete_task', {id: 't3'}); const t3 = T.tasks.find(t => t.id === 't3'); ok(c.data.task.status === 'done' && t3.pct === 100 && t3.done_date === '2026-11-02', 'complete_task', t3);
c = await call('update_task', {id: 't3', status: 'todo'}); ok(t3.done_date === null && t3.status === 'todo', 'reopen clears done_date', t3);
c = await call('add_subtask', {id: 't2', text: 'Check capacity'}); ok(T.tasks.find(t => t.id === 't2').subtasks.length === 1, 'add_subtask');
c = await call('set_subtask_done', {id: 't2', index: 0}); ok(c.data.task.progress_pct === 100 && c.data.task.subtasks[0].done, 'set_subtask_done drives progress', c.data);
c = await call('set_subtask_done', {id: 't2', index: 5}); ok(c.err && /out of range/.test(c.data), 'subtask index range check');
c = await call('log_progress', {id: 't2', text: 'Supplier confirmed.'}); const lg = T.tasks.find(t => t.id === 't2').log; ok(lg.length === 1 && lg[0].d === '2026-11-02' && lg[0].by === 'codex', 'log_progress', lg);
c = await call('add_category', {name: 'AI Project', area: 'Company'}); ok(c.data.ok && T.projects.find(p => p.name === 'AI Project').user_id === 'u1', 'add_category');
c = await call('add_category', {name: 'ai project', area: 'Company'}); ok(c.err && /already exists/.test(c.data), 'duplicate category rejected');

// read-only token
for(const [name, args] of [['add_task', {title: 'nope'}], ['update_task', {id: 't1', title: 'nope'}], ['complete_task', {id: 't1'}], ['add_subtask', {id: 't1', text: 'n'}], ['set_subtask_done', {id: 't1', index: 0}], ['log_progress', {id: 't1', text: 'n'}], ['add_category', {name: 'n', area: 'Company'}], ['save_checkin', {body: 3, mind: 3, mode: 'standard'}], ['delete_task', {id: 't1'}], ['restore_task', {id: 't1'}], ['add_todo', {text: 'n'}], ['update_todo', {id: 'd1', done: true}]]){
  c = await call(name, args, TOKENS.ro); ok(c.err && /read-only/.test(c.data), 'read-only token blocked on ' + name, c.data);
}
ok(!T.tasks.some(t => t.title === 'nope'), 'nothing written by read-only token');
c = await call('get_overview', {}, TOKENS.ro); ok(c.data.counts, 'read-only token can read');
c = await call('list_tasks', {}, TOKENS.other); ok(c.data.total_matching === 1 && c.data.tasks[0].title === 'USER 2 PRIVATE TASK', "other user's token sees only their own data", c.data);

// check-in by AI
c = await call('save_checkin', {body: 4, mind: 3, mode: 'Standard', note: 'Slept well'});
let ci = T.checkins.find(x => x.user_id === 'u1' && x.date === '2026-11-02');
ok(c.data.created === false && ci.body === 4 && ci.mind === 3 && ci.mode === 'standard' && ci.updated_by === 'codex', 'save_checkin updates today (existing row)', ci);
T.checkins = T.checkins.filter(x => !(x.user_id === 'u1' && x.date === '2026-11-02'));
c = await call('save_checkin', {body: 2, mind: 4, mode: 'maintain'});
ci = T.checkins.find(x => x.user_id === 'u1' && x.date === '2026-11-02');
ok(c.data.created === true && ci.body === 2 && ci.mode === 'maintain' && ci.note === '' && ci.updated_by === 'codex' && ci.checked_at, 'save_checkin creates today', ci);
c = await call('save_checkin', {closing_note: 'Done what mattered'}); ok(c.data.ok && T.checkins.find(x => x.user_id === 'u1' && x.date === '2026-11-02').wrap === 'Done what mattered' && T.checkins.find(x => x.user_id === 'u1' && x.date === '2026-11-02').body === 2, 'closing note keeps the rest');
c = await call('save_checkin', {date: '2026-11-01', body: 3}); ok(c.err && /needs body, mind and mode/.test(c.data), 'new check-in needs all three');
c = await call('save_checkin', {body: 6, mind: 3, mode: 'push', date: '2026-11-01'}); ok(c.err && /1 to 5/.test(c.data), 'score range');
c = await call('save_checkin', {body: 3, mind: 3, mode: 'turbo', date: '2026-11-01'}); ok(c.err && /mode must be/.test(c.data), 'mode validated');
c = await call('save_checkin', {body: 3, mind: 3, mode: 'push', date: '2026-11-09'}); ok(c.err && /within the last 30/.test(c.data), 'future date rejected');
c = await call('get_readiness', {}); ok(c.data.checkins.length === 1 && c.data.checkins[0].mode === 'maintain', 'get_readiness sees the AI-saved check-in');
ok(T.checkins.find(x => x.user_id === 'u2').note === 'u2', "other user's check-in untouched");

// delete + restore
c = await call('delete_task', {id: 't3'});
ok(c.data.ok && !T.tasks.some(t => t.id === 't3') && T.deleted_tasks.length === 1 && T.deleted_tasks[0].data.title === 'Late thing' && T.deleted_tasks[0].deleted_by === 'codex', 'delete_task removes and keeps a copy', T.deleted_tasks);
c = await call('delete_task', {id: 'tx'}); ok(c.err && T.tasks.some(t => t.id === 'tx'), 'cannot delete user 2 task');
c = await call('list_deleted_tasks', {}); ok(c.data.deleted.length === 1 && c.data.deleted[0].id === 't3', 'list_deleted_tasks');
c = await call('restore_task', {id: 't3'}); ok(c.data.ok && T.tasks.some(t => t.id === 't3' && t.title === 'Late thing' && t.user_id === 'u1') && T.deleted_tasks.length === 0, 'restore_task brings it back');
c = await call('restore_task', {id: 't3'}); ok(c.err, 'restore with nothing deleted is an error');
c = await call('list_deleted_tasks', {}, TOKENS.ro); ok(c.data.deleted.length === 0, 'read-only token can list trash');

{ // a database fault while checking the token is a 500, not a misleading 401
  const broken = {from: () => { const o = {select: () => o, eq: () => o, then: (res) => res({data: null, error: {message: 'SECRET db detail'}})}; return o; }};
  const rr = await handle(new Request('https://x.test/', {method: 'POST', headers: {'content-type': 'application/json', authorization: 'Bearer ' + TOKENS.rw}, body: '{}'}), {db: broken, tz: 'Asia/Bangkok', now: deps.now});
  const txt = await rr.text(); ok(rr.status === 500 && !txt.includes('SECRET'), 'db fault while checking token -> 500 without details', rr.status);
}

{ // other ways a client may present the token, and a flexible preflight
  const viaBare = await handle(new Request('https://x.test/', {method: 'POST', headers: {'content-type': 'application/json', authorization: TOKENS.rw}, body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'ping'})}), deps);
  ok(viaBare.status === 200, 'bare token in Authorization works');
  const viaKey = await handle(new Request('https://x.test/', {method: 'POST', headers: {'content-type': 'application/json', 'x-api-key': TOKENS.rw}, body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'ping'})}), deps);
  ok(viaKey.status === 200, 'x-api-key works');
  const pf = await handle(new Request('https://x.test/', {method: 'OPTIONS', headers: {'access-control-request-headers': 'authorization, accept, x-anything'}}), deps);
  ok(pf.status === 204 && pf.headers.get('access-control-allow-headers') === 'authorization, accept, x-anything', 'preflight echoes requested headers');
}

// to-do list
c = await call('list_todos', {});
ok(c.data.today.length === 2 && c.data.today[0].text === 'Buy moisturizer' && c.data.today[0].carried_over_from === '2026-11-01' && c.data.coming_up.length === 1 && c.data.someday.length === 1 && c.data.done_today.length === 0, 'list_todos groups today, coming up and someday', c.data);
ok(!JSON.stringify(c.data).includes('USER 2'), "list_todos never shows another user's items");
c = await call('add_todo', {text: 'Pick up the dry cleaning'}); const nt = T.todos.find(x => x.text === 'Pick up the dry cleaning');
ok(c.data.ok && nt && nt.user_id === 'u1' && nt.day === '2026-11-02' && nt.done === false && nt.updated_by === 'codex', 'add_todo defaults to today', nt);
c = await call('add_todo', {text: 'Tomorrow thing', day: 'tomorrow'}); ok(T.todos.find(x => x.text === 'Tomorrow thing').day === '2026-11-03', 'add_todo tomorrow');
c = await call('add_todo', {text: 'Whenever thing', day: 'someday'}); ok(T.todos.find(x => x.text === 'Whenever thing').day === null, 'add_todo someday has no day');
c = await call('add_todo', {text: '   '}); ok(c.err, 'empty to-do rejected');
c = await call('add_todo', {text: 'y'.repeat(301)}); ok(c.err && /too long/.test(c.data), 'to-do length cap');
c = await call('add_todo', {text: 'bad day', day: '12/01/2026'}); ok(c.err && /YYYY-MM-DD/.test(c.data), 'bad day rejected');
c = await call('update_todo', {id: 'd1', done: true}); const d1 = T.todos.find(x => x.id === 'd1');
ok(c.data.ok && d1.done === true && d1.done_at === '2026-11-02T05:00:00.000Z' && d1.updated_by === 'codex', 'update_todo ticks off', d1);
c = await call('list_todos', {}); ok(c.data.done_today.length === 1 && c.data.done_today[0].id === 'd1' && c.data.today.every(x => x.id !== 'd1'), 'done item moves to done_today');
c = await call('update_todo', {id: 'd1', done: false}); ok(T.todos.find(x => x.id === 'd1').done === false && T.todos.find(x => x.id === 'd1').done_at === null, 'update_todo reopens');
c = await call('update_todo', {id: 'd3', day: 'today', text: 'Book a haircut this week'}); ok(T.todos.find(x => x.id === 'd3').day === '2026-11-02' && T.todos.find(x => x.id === 'd3').text === 'Book a haircut this week', 'update_todo edits text and day');
c = await call('update_todo', {id: 'dx', done: true}); ok(c.err && T.todos.find(x => x.id === 'dx').done === false, 'cannot change user 2 to-do');
c = await call('update_todo', {id: 'd3'}); ok(c.err && /Nothing to change/.test(c.data), 'empty to-do update rejected');
c = await call('list_todos', {}, TOKENS.ro); ok(c.data.today && !c.err, 'read-only token can list to-dos');
{ // table not created yet
  const noTable = {from: t => { if(t !== 'todos') return from(t); const o = {select: () => o, eq: () => o, order: () => o, range: () => o, then: res => res({data: null, error: {message: 'relation "public.todos" does not exist'}})}; return o; }};
  const rr = await handle(new Request('https://x.test/', {method: 'POST', headers: {'content-type': 'application/json', authorization: 'Bearer ' + TOKENS.rw}, body: JSON.stringify({jsonrpc: '2.0', id: 7, method: 'tools/call', params: {name: 'list_todos', arguments: {}}})}), {db: noTable, tz: 'Asia/Bangkok', now: deps.now});
  const txt = await rr.text(); ok(/not set up in the database yet/.test(txt) && !/relation/.test(txt.replace('not set up', '')), 'missing to-do table gives a plain message', txt.slice(0, 200));
}

console.log(bad ? `\n${bad} of ${n} checks FAILED` : `\nALL ${n} CHECKS PASSED`);
process.exit(bad ? 1 : 0);
