# H-06 Feedback Program Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build H-06 as a three-panel HR program-detail screen that opens directly on the participant needing action most, lets HR read feedback without navigation hops, and supports compact bulk reminders with existing cooldown rules.

**Implementation status (12/08/2026):** Implemented locally and pending user review. The pure model, shared demo data, H-05 route, H-06 rendering and regression tests are in place. No commit or push has been made.

**Architecture:** Keep program lifecycle and participant-priority decisions in `H-05/feedback-program-model.js`. Extract the H-05 seed and H-06 participant-detail fixtures into a shared UMD data module so H-05 list and H-06 detail describe the same program. `H-06/index.html` owns only query-param state, selection, rendering and scoped interactions; its center pane is the sole scroll container on desktop.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript, UMD modules, Node.js built-in `node:test` and `node:assert`.

## Global Constraints

- Implement test-first: each behavior must have a newly written test that is observed failing before production code is added.
- Do not commit or push unless the user explicitly asks.
- Use `Public Sans` and the Feedback Design System type scale.
- Use ` - ` for metadata composition. Do not use `·` or `.` as an inline metadata separator.
- One fact has one primary location. Program status and total answer ratio appear only in the H-06 header.
- Panel right uses neutral surfaces. Semantic color is limited to status chip, icon, marker, number or text that represents a decision.
- The compact secondary reminder button must be icon + `Nhắc`, never a large warning CTA.
- Feedback remains a coaching/development tool, not an evaluation or ranking tool.
- Run direct test scripts (`node H-05/h05.test.js`) rather than `node --test` because this workspace blocks Node test-worker spawning.

---

## File structure and boundaries

| File | Responsibility |
|---|---|
| `H-05/feedback-program-model.js` | Pure lifecycle, participant progress, priority sorting, badge tally and reminder eligibility helpers. No DOM. |
| `H-05/feedback-program-data.js` | Shared deterministic program seed plus H-06 participant-detail demo data. Returns copies so reminder interaction cannot mutate the seed. |
| `H-05/index.html` | Program list. Loads shared data and routes a non-draft program to H-06. |
| `H-06/index.html` | New H-06 shell, 3-panel rendering, selection state, internal center scroll and reminder UI. |
| `H-05/h05.test.js` | Model tests plus static UI contract tests for H-05/H-06 and Design System rules. |

The H-06 detail data contract is:

```js
{
  campaignId: 's2',
  question: 'Đâu là điểm mạnh và một cơ hội phát triển khi phối hợp cùng team?',
  participants: [{
    employee: { id:'lan.hoang', name:'Hoàng Thị Lan', domain:'lan.hoang', department:'Kinh doanh', team:'Sales', position:'Senior Sales Executive', initials:'HL' },
    assignments: [{
      id: 's2:lan.hoang:anh.nguyen',
      reviewer: { id:'anh.nguyen', name:'Nguyễn Minh Anh', domain:'anh.nguyen', department:'Kinh doanh', team:'Sales', position:'Sales Manager' },
      status: 'submitted', submittedAt: '12/08/2026', body: 'Lan chủ động tổng hợp ý kiến và làm rõ các bước tiếp theo.', badges: ['teamwork', 'customer'], manualReminderHistory: []
    }],
    aiSummary: { strengths: ['Giao tiếp rõ ràng với stakeholder'], opportunities: ['Làm rõ ưu tiên khi phạm vi thay đổi'] }
  }]
}
```

## Task 1: Add participant-detail model contracts

**Files:**
- Modify: `H-05/feedback-program-model.js`
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: a campaign with `status`, `due`, plus a participant with `assignments`.
- Produces: `participantProgress`, `participantViewState`, `compareParticipantsForAction`, `sortParticipantsForAction`, `coreValueTally`, `isAiSummaryEligible` and `programDetailOverview`.

- [ ] **Step 1: Write the failing participant-priority test**

Append a fixture with four participants: overdue at `1/4`, due soon at `2/4`, collecting at `1/4`, and complete at `4/4`.

```js
test('sorts program participants by action priority before completeness',()=>{
  const model=require(modelPath);
  const campaign={status:'collecting',due:'14/08/2026'};
  const people=[overduePerson,dueSoonPerson,collectingPerson,completePerson];
  assert.deepEqual(model.sortParticipantsForAction(campaign,people,'11/08/2026').map(x=>x.employee.id),[
    'overdue','due-soon','collecting','complete'
  ]);
});
```

- [ ] **Step 2: Run the focused suite and verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because `sortParticipantsForAction` does not exist.

- [ ] **Step 3: Implement the minimal pure progress helpers**

```js
function participantProgress(participant){
  const assignments=Array.isArray(participant&&participant.assignments)?participant.assignments:[];
  const done=assignments.filter(item=>item.status==='submitted').length;
  return {done,total:assignments.length,pending:assignments.length-done};
}
function participantViewState(campaign,participant,today){
  const progress=participantProgress(participant);
  if(progress.total>0&&progress.done===progress.total)return 'complete';
  if(isOverdue(campaign,today))return 'overdue';
  if(isDueSoon(campaign,today))return 'due_soon';
  return 'collecting';
}
function compareParticipantsForAction(campaign,a,b,today){
  const priority={overdue:0,due_soon:1,collecting:2,complete:3};
  const stateDiff=priority[participantViewState(campaign,a,today)]-priority[participantViewState(campaign,b,today)];
  if(stateDiff)return stateDiff;
  const ap=participantProgress(a),bp=participantProgress(b);
  const ratioDiff=(ap.done/Math.max(ap.total,1))-(bp.done/Math.max(bp.total,1));
  if(ratioDiff)return ratioDiff;
  return String(a.employee&&a.employee.name||'').localeCompare(String(b.employee&&b.employee.name||''),'vi');
}
function sortParticipantsForAction(campaign,participants,today){return [...(participants||[])].sort((a,b)=>compareParticipantsForAction(campaign,a,b,today));}
```

Use the campaign due date as the common due date for H-06; do not add per-assignment due dates.

- [ ] **Step 4: Run the suite and verify GREEN**

Run: `node H-05/h05.test.js`

Expected: new priority test and existing H-05 tests pass.

- [ ] **Step 5: Write failing summary and badge tests**

```js
test('derives badge tally and AI eligibility only from submitted feedback',()=>{
  const model=require(modelPath);
  const participant={assignments:[
    {status:'submitted',badges:['teamwork','customer']},
    {status:'submitted',badges:['teamwork']},
    {status:'pending',badges:['excellence']}
  ]};
  assert.deepEqual(model.coreValueTally(participant),{teamwork:2,customer:1});
  assert.equal(model.isAiSummaryEligible(participant),true);
});
test('derives a neutral program overview without repeating program status',()=>{
  const model=require(modelPath);
  assert.deepEqual(model.programDetailOverview(detailFixture,'11/08/2026'),{participants:3,reviewers:4,pending:5,overdue:1});
});
```

- [ ] **Step 6: Run the suite and verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because tally, eligibility and overview helpers do not exist.

- [ ] **Step 7: Implement the smallest summary helpers**

```js
function coreValueTally(participant){
  return (participant&&participant.assignments||[])
    .filter(item=>item.status==='submitted')
    .flatMap(item=>item.badges||[])
    .reduce((result,badge)=>({...result,[badge]:(result[badge]||0)+1}),{});
}
function isAiSummaryEligible(participant){return participantProgress(participant).done>=2;}
function programDetailOverview(detail,today){
  const participants=detail&&detail.participants||[];
  const assignments=participants.flatMap(item=>item.assignments||[]);
  return {
    participants:participants.length,
    reviewers:new Set(assignments.map(item=>item.reviewer&&item.reviewer.id).filter(Boolean)).size,
    pending:assignments.filter(item=>item.status!=='submitted').length,
    overdue:participants.filter(item=>participantViewState(detail.campaign,item,today)==='overdue').length
  };
}
```

- [ ] **Step 8: Run model tests and refactor only duplication**

Run: `node H-05/h05.test.js`

Expected: all H-05 tests pass.

## Task 2: Add reminder eligibility to the H-05 model

**Files:**
- Modify: `H-05/feedback-program-model.js`
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: collecting campaign, pending assignment and `DD/MM/YYYY HH:mm` now value.
- Produces: `canRemindProgramAssignment(campaign, assignment, now)` and `remindEligibleProgramAssignments(campaign, participants, now)`.

- [ ] **Step 1: Write failing cooldown and deadline tests**

```js
test('reminds only eligible pending program assignments once per rolling 24 hours',()=>{
  const model=require(modelPath),campaign={status:'collecting',due:'15/08/2026'};
  const assignment={id:'a1',status:'pending',manualReminderHistory:['12/08/2026 10:00']};
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'13/08/2026 09:59'),false);
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'13/08/2026 10:00'),true);
  assert.equal(model.canRemindProgramAssignment(campaign,{status:'submitted'},'13/08/2026 10:00'),false);
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'16/08/2026 10:00'),false);
});
```

- [ ] **Step 2: Run the suite and verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because the program reminder APIs do not exist.

- [ ] **Step 3: Implement isolated reminder helpers**

Reuse the approved M-04 rule without importing M-04:

```js
function canRemindProgramAssignment(campaign,assignment,now){
  if(!campaign||campaign.status!=='collecting'||!assignment||assignment.status==='submitted')return false;
  if(daysBetween(String(now).slice(0,10),campaign.due)>0)return false;
  const history=assignment.manualReminderHistory||[];
  const last=history.at(-1);
  return !last||dateTimeFromDMY(now)-dateTimeFromDMY(last)>=24*60*60*1000;
}
function remindEligibleProgramAssignments(campaign,participants,now){
  let sent=0;
  (participants||[]).flatMap(item=>item.assignments||[]).forEach(assignment=>{
    if(!canRemindProgramAssignment(campaign,assignment,now))return;
    assignment.manualReminderHistory=[...(assignment.manualReminderHistory||[]),now];sent++;
  });
  return sent;
}
```

Add a local `dateTimeFromDMY` parser compatible with `DD/MM/YYYY` and `DD/MM/YYYY HH:mm`.

- [ ] **Step 4: Run model tests and verify GREEN**

Run: `node H-05/h05.test.js`

Expected: cooldown/deadline tests and all existing H-05 tests pass.

## Task 3: Extract shared H-05/H-06 data

**Files:**
- Create: `H-05/feedback-program-data.js`
- Modify: `H-05/index.html`
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Produces: `FeedbackProgramData.seedPrograms()`, `FeedbackProgramData.programById(id)` and `FeedbackProgramData.detailForProgram(program)`.

- [ ] **Step 1: Write failing data-source test**

```js
test('H-05 and H-06 read one shared program seed with deterministic detail fixtures',()=>{
  const data=require('./feedback-program-data.js');
  const program=data.programById('s2'),detail=data.detailForProgram(program);
  assert.equal(program.goal,'Khảo sát phát triển đội ngũ Sales');
  assert.equal(detail.campaign.id,'s2');
  assert.equal(detail.participants.length,10);
  assert.equal(detail.participants[0].assignments.length,4);
});
```

- [ ] **Step 2: Run test and verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because the shared data module does not exist.

- [ ] **Step 3: Create the shared UMD data module**

Move the six current `SEED` programs into `seedPrograms()`. Add a rich fixture for `s2` with ten participants and four reviewer assignments per participant. It includes one overdue participant with one answer, one due-soon participant with two answers, one complete participant with four answers, badges from the five core-value ids, pending assignments with and without reminder history, and AI Summary content only where two answers exist.

All factories must deep-clone their return value. `detailForProgram` must produce a safe fallback for every non-draft seeded campaign.

- [ ] **Step 4: Change H-05 list to consume shared data**

Add `<script src="feedback-program-data.js"></script>` before the existing H-05 model script and replace inline seed initialization with:

```js
const SEED=FeedbackProgramData.seedPrograms();
```

Keep existing localStorage merge and persistence behavior unchanged.

- [ ] **Step 5: Run data and regression tests to verify GREEN**

Run: `node H-05/h05.test.js`

Expected: shared data test and existing H-05 list contracts pass.

## Task 4: Add the H-06 three-panel screen and static UI contracts

**Files:**
- Create: `H-06/index.html`
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: query `id`, `FeedbackProgramData.detailForProgram`, and H-05 model helpers.
- Produces: `renderDetail`, `selectParticipant`, `renderParticipantList`, `renderProgramOverview`, `sendEligibleReminders`.

- [ ] **Step 1: Write failing H-06 UI contract tests**

```js
const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
assert.match(detail,/--detail-columns:minmax\(220px,[^;]+minmax\(0,1fr\)[^;]+minmax\(240px,/);
assert.match(detail,/\.detail-center\{[^}]*overflow-y:auto/);
assert.equal((detail.match(/class="program-progress"/g)||[]).length,1);
assert.match(detail,/function selectParticipant\(participantId\)/);
assert.match(detail,/sortParticipantsForAction/);
assert.match(detail,/coreValueTally/);
assert.match(detail,/isAiSummaryEligible/);
assert.match(detail,/bx-bell[^>]*><\/i> Nhắc/);
assert.doesNotMatch(detail,/Nhắc người chưa trả lời|·/);
```

- [ ] **Step 2: Run test and verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because `H-06/index.html` does not exist.

- [ ] **Step 3: Create H-06 shell and rendering**

```js
const PROGRAM_ID=new URLSearchParams(location.search).get('id')||'s2';
const PROGRAM=FeedbackProgramData.programById(PROGRAM_ID);
const DETAIL=FeedbackProgramData.detailForProgram(PROGRAM);
const ORDERED=FeedbackProgramModel.sortParticipantsForAction(PROGRAM,DETAIL.participants,TODAY);
let SELECTED_ID=ORDERED[0]&&ORDERED[0].employee.id;
function selectParticipant(participantId){SELECTED_ID=participantId;renderDetail();}
```

Render three regions: left `participant-nav` with organization tooltip and compact per-person risk; center `detail-center` with selected employee, badge tally, full-width question, conditional collapsible AI Summary, submitted feedback and pending rows; right `program-overview` with neutral label/value rows and an optional neutral `Cần xử lý` block.

The header owns the single `.program-progress` chip. The center region owns `overflow-y:auto`; left/right are sticky only on desktop.

- [ ] **Step 4: Run H-06 static tests and verify GREEN**

Run: `node H-05/h05.test.js`

Expected: H-06 static contract and existing H-05 contracts pass.

## Task 5: Implement AI and reminder interaction

**Files:**
- Modify: `H-06/index.html`
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: model helpers and mutable in-memory `DETAIL` fixture.
- Produces: immediate selection updates, evidence-gated AI Summary and eligible-only reminder action.

- [ ] **Step 1: Write failing interaction contract tests**

```js
test('H-06 selection updates detail without navigation and AI remains evidence-gated',()=>{
  const html=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(html,/SELECTED_ID=participantId;\s*renderDetail\(\)/);
  assert.doesNotMatch(html,/function selectParticipant[\s\S]*location\.href/);
  assert.match(html,/done>=2/);
  assert.match(html,/ai-summary/);
  assert.match(html,/collapseAiSummary/);
});
test('H-06 bulk reminder uses model eligibility and compact neutral action',()=>{
  const html=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(html,/remindEligibleProgramAssignments\(PROGRAM,DETAIL\.participants,NOW\)/);
  assert.match(html,/class="btn btn-outline btn-sm reminder-btn"/);
  assert.doesNotMatch(html,/reminder-card[^}]*var\(--warn-bg\)/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because selection, collapsible AI Summary and reminder interaction are absent.

- [ ] **Step 3: Implement minimum interaction logic**

```js
function sendEligibleReminders(){
  const count=FeedbackProgramModel.remindEligibleProgramAssignments(PROGRAM,DETAIL.participants,NOW);
  toast(count?`Đã nhắc ${count} người chưa trả lời đủ điều kiện`:'Hiện chưa có ai đủ điều kiện để nhắc');
  renderDetail();
}
function collapseAiSummary(){AI_SUMMARY_COLLAPSED=!AI_SUMMARY_COLLAPSED;renderDetail();}
```

The reminder button is disabled when no pending assignment is eligible. Use `btn btn-outline btn-sm reminder-btn`, bell icon and text `Nhắc`; use no yellow background.

- [ ] **Step 4: Run suite and verify GREEN**

Run: `node H-05/h05.test.js`

Expected: all H-05/H-06 tests pass.

## Task 6: Wire H-05 to H-06 and lock Design System regressions

**Files:**
- Modify: `H-05/index.html`
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: a non-draft campaign ID in H-05 list.
- Produces: navigation to `../H-06/index.html?id=<campaignId>`.

- [ ] **Step 1: Write failing route and Design System tests**

```js
test('H-05 opens non-draft program detail in H-06 with its id',()=>{
  const index=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(index,/location\.href=`\.\.\/H-06\/index\.html\?id=\$\{encodeURIComponent\(c\.id\)\}`/);
});
test('design system locks metadata, fact placement and neutral summary rules',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(design,/Metadata separator/i);
  assert.match(design,/One fact, one primary location/i);
  assert.match(design,/Semantic color budget/i);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node H-05/h05.test.js`

Expected: route test fails because H-05 still shows a placeholder toast.

- [ ] **Step 3: Implement route and return affordance**

Drafts keep `create-campaign.html?id=...`. Every other program opens `../H-06/index.html?id=...`. Add `Quay lại chương trình` in H-06 to return to `../H-05/index.html` without duplicating campaign status.

- [ ] **Step 4: Run H-05 test suite and verify GREEN**

Run: `node H-05/h05.test.js`

Expected: route and Design System tests pass.

## Task 7: Full regression, visual QA and handoff

**Files:**
- Verify: `H-05/feedback-program-model.js`
- Verify: `H-05/feedback-program-data.js`
- Verify: `H-05/index.html`
- Verify: `H-06/index.html`
- Verify: `H-05/h05.test.js`
- Verify: `E-04/feedback-model.test.js`
- Verify: `M-04/m04.test.js`

- [ ] **Step 1: Run all Feedback regression suites**

```powershell
node H-05/h05.test.js
node E-04/feedback-model.test.js
node M-04/m04.test.js
```

Expected: all pass with zero failures.

- [ ] **Step 2: Verify inline JavaScript syntax**

```powershell
node -e "const fs=require('fs');for(const f of ['H-05/index.html','H-06/index.html']){const s=fs.readFileSync(f,'utf8');[...s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean).forEach(x=>new Function(x));console.log(f+' syntax OK')}"
```

Expected: both files print `syntax OK`.

- [ ] **Step 3: Visual QA at desktop and narrow breakpoint**

Verify 1440px and 1024px widths:

- default selection is overdue → due soon → collecting → complete;
- program status appears only in header;
- center feedback stream scrolls while navigation and overview remain visible;
- panel right is neutral and compact `Nhắc` aligns to its context;
- metadata contains no `·` / period separators;
- no clipped count, overlap, duplicated receiver or duplicated program status;
- tooltips have black background, white text and work with keyboard focus.

- [ ] **Step 4: Check whitespace and inspect diff**

```powershell
git diff --check
git diff -- H-05 H-06 design-system/index.html docs/superpowers/specs/2026-08-12-h06-feedback-program-detail-design.md docs/superpowers/plans/2026-08-12-h06-feedback-program-detail.md
```

Expected: no whitespace errors; diff contains only shared seed/model extraction, H-05 route/data load, H-06, tests and approved documentation. Do not commit or push.
