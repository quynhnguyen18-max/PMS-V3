# Employee Feedback Media Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the campaign-controlled `Dấu ấn của bạn` floating entry point and downloadable poster-story viewer to the employee feedback prototype.

**Architecture:** Keep campaign and snapshot rules in the existing UMD `FeedbackModel`; keep the prototype seed, session-only viewed state, rendering, viewer navigation, and SVG download behavior in `E-04/index.html`. The feature renders nothing when there is no active campaign and never changes the existing right rail layout.

**Tech Stack:** Static HTML/CSS/JavaScript, Node built-in test runner, existing `FeedbackModel` UMD module, Boxicons.

## Global Constraints

- The product name is exactly `Dấu ấn của bạn` and is not suffixed with a year.
- AI produces anonymous insight content only; System Admin owns poster templates, layout, and visual styling.
- A campaign snapshot includes all received feedback in the active cycle year up to `snapshotAt`.
- Multiple campaigns may run in the same cycle year, each with independent snapshot and viewed state.
- No active campaign means no pill, placeholder, locked card, or reserved space.
- The expanded pill collapses to an icon after the viewer closes by `×` or backdrop.
- Poster access and download end with the campaign.
- Prototype viewed state is session-only and must not be written to `localStorage`.
- Do not commit implementation changes until the user explicitly confirms the result.

---

### Task 1: Campaign and snapshot model

**Files:**
- Modify: `E-04/feedback-model.js`
- Test: `E-04/feedback-model.test.js`

**Interfaces:**
- Consumes: normalized feedback records from `normalizeFeed(feed)`.
- Produces: `campaignStatus(campaign, nowISO)`, `activeMediaCampaign(campaigns, nowISO)`, and `snapshotReceivedFeedback(feed, campaign)`.

- [ ] **Step 1: Write failing model tests**

```js
test('media campaign is active only inside its configured window', () => {
  const campaign={id:'imprint-aug',startAt:'2026-08-01T00:00:00+07:00',endAt:'2026-08-31T23:59:59+07:00'};
  assert.equal(model.campaignStatus(campaign,'2026-08-10T10:00:00+07:00'),'active');
  assert.equal(model.campaignStatus(campaign,'2026-07-31T23:59:59+07:00'),'scheduled');
  assert.equal(model.campaignStatus(campaign,'2026-09-01T00:00:00+07:00'),'ended');
});

test('media snapshot includes received feedback in the campaign cycle up to snapshot time', () => {
  const feed=[
    {id:'a',kind:'received',cycle:'2026',date:'01/08/2026',ts:20260801},
    {id:'b',kind:'received',cycle:'2026',date:'20/08/2026',ts:20260820},
    {id:'c',kind:'received',cycle:'2025',date:'01/08/2025',ts:20250801}
  ];
  assert.deepEqual(model.snapshotReceivedFeedback(feed,{cycleYear:'2026',snapshotAt:'10/08/2026'}).map(item=>item.id),['a']);
});

test('the latest active media campaign is selected independently within one year', () => {
  const campaigns=[
    {id:'first',startAt:'2026-03-01T00:00:00+07:00',endAt:'2026-03-31T23:59:59+07:00'},
    {id:'second',startAt:'2026-08-01T00:00:00+07:00',endAt:'2026-08-31T23:59:59+07:00'}
  ];
  assert.equal(model.activeMediaCampaign(campaigns,'2026-08-10T10:00:00+07:00').id,'second');
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node E-04/feedback-model.test.js`

Expected: FAIL because the three campaign functions are not exported.

- [ ] **Step 3: Implement the minimal pure functions**

```js
function campaignStatus(campaign,nowISO){
  const now=Date.parse(nowISO),start=Date.parse(campaign?.startAt),end=Date.parse(campaign?.endAt);
  if(!Number.isFinite(now)||!Number.isFinite(start)||!Number.isFinite(end))return 'invalid';
  if(now<start)return 'scheduled';
  return now>end?'ended':'active';
}

function activeMediaCampaign(campaigns,nowISO){
  return [...(campaigns||[])]
    .filter(item=>campaignStatus(item,nowISO)==='active')
    .sort((a,b)=>Date.parse(b.startAt)-Date.parse(a.startAt))[0]||null;
}

function snapshotReceivedFeedback(feed,campaign){
  const cutoff=tsFromDate(campaign?.snapshotAt);
  return normalizeFeed(feed).filter(item=>item.kind==='received'&&item.cycle===String(campaign?.cycleYear)&&item.ts<=cutoff);
}
```

Export all three functions from the existing return object.

- [ ] **Step 4: Run the model tests and verify GREEN**

Run: `node E-04/feedback-model.test.js`

Expected: all tests pass.

---

### Task 2: Campaign seed and floating pill states

**Files:**
- Modify: `E-04/index.html`
- Test: `E-04/feedback-model.test.js`

**Interfaces:**
- Consumes: `FeedbackModel.activeMediaCampaign(MEDIA_CAMPAIGNS, MEDIA_NOW)` and session-only `MEDIA_STATE.viewedCampaignIds`.
- Produces: `renderMediaSummaryEntry()`, `openMediaSummary()`, `closeMediaSummary()` and DOM ids `mediaSummaryEntry`, `mediaSummaryOverlay`.

- [ ] **Step 1: Write failing UI contract tests**

```js
test('employee media summary renders only for an active campaign and keeps viewed state in session memory', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/const MEDIA_CAMPAIGNS = \[/);
  assert.match(html,/id="mediaSummaryEntry"/);
  assert.match(html,/function renderMediaSummaryEntry\(\)/);
  assert.match(html,/FeedbackModel\.activeMediaCampaign/);
  assert.match(html,/Dáº¥u áº¥n cá»§a báº¡n/);
  assert.match(html,/viewedCampaignIds:new Set\(\)/);
  assert.doesNotMatch(html,/localStorage[^\n]*viewedCampaignIds|viewedCampaignIds[^\n]*localStorage/);
});

test('media summary collapses after close by button or backdrop', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/onclick="if\(event\.target===this\)closeMediaSummary\(\)"/);
  assert.match(html,/onclick="closeMediaSummary\(\)"/);
  assert.match(html,/MEDIA_STATE\.viewedCampaignIds\.add\(MEDIA_STATE\.campaign\.id\)/);
  assert.match(html,/Xem láº¡i Dáº¥u áº¥n cá»§a báº¡n/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node E-04/feedback-model.test.js`

Expected: FAIL because the entry point and state do not exist.

- [ ] **Step 3: Add the campaign seed and session state**

Add one active demo campaign and one ended campaign in `E-04/index.html`. The active record contains `id`, `name`, `startAt`, `endAt`, `cycleYear`, `snapshotAt`, `status`, `templates`, and `insights`. Keep templates as Admin-owned metadata and insights as anonymous AI copy.

```js
const MEDIA_STATE={campaign:null,posterIndex:0,viewedCampaignIds:new Set()};
const MEDIA_NOW='2026-08-10T10:00:00+07:00';
```

- [ ] **Step 4: Add the floating pill shell and scoped styling**

Render the entry after the main `.fb-layout`, so it does not alter the right rail grid. Use a labeled pill before first view, an icon-only button after first view, and the shared black custom tooltip for the collapsed state. Add a mobile media query that docks the entry above the safe bottom edge.

- [ ] **Step 5: Implement entry rendering and close behavior**

```js
function renderMediaSummaryEntry(){
  MEDIA_STATE.campaign=FeedbackModel.activeMediaCampaign(MEDIA_CAMPAIGNS,MEDIA_NOW);
  const entry=document.getElementById('mediaSummaryEntry');
  if(!MEDIA_STATE.campaign){entry.hidden=true;return;}
  entry.hidden=false;
  entry.classList.toggle('compact',MEDIA_STATE.viewedCampaignIds.has(MEDIA_STATE.campaign.id));
}

function closeMediaSummary(){
  if(MEDIA_STATE.campaign)MEDIA_STATE.viewedCampaignIds.add(MEDIA_STATE.campaign.id);
  closeOverlay('mediaSummaryOverlay');
  renderMediaSummaryEntry();
}
```

Call `renderMediaSummaryEntry()` from `renderAll()`.

- [ ] **Step 6: Run tests and verify GREEN**

Run: `node E-04/feedback-model.test.js`

Expected: all tests pass.

---

### Task 3: Poster story viewer and anonymous content

**Files:**
- Modify: `E-04/index.html`
- Test: `E-04/feedback-model.test.js`

**Interfaces:**
- Consumes: `MEDIA_STATE.campaign.templates`, `MEDIA_STATE.campaign.insights`, and `MEDIA_STATE.posterIndex`.
- Produces: `renderMediaPoster()`, `moveMediaPoster(direction)`, poster progress, previous/next controls, and the campaign expiry guard.

- [ ] **Step 1: Write failing viewer tests**

```js
test('media summary viewer renders an admin template story with anonymous AI insights', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/id="mediaSummaryOverlay"/);
  assert.match(html,/id="mediaPosterStage"/);
  assert.match(html,/function renderMediaPoster\(\)/);
  assert.match(html,/function moveMediaPoster\(direction\)/);
  assert.match(html,/AI chá»‰ táº¡o ná»™i dung/);
  assert.doesNotMatch(html,/insights:\s*\[[\s\S]*?who:/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node E-04/feedback-model.test.js`

Expected: FAIL because the viewer and poster renderer do not exist.

- [ ] **Step 3: Add the overlay and story layout**

Use the existing `.overlay` behavior with a dedicated dialog. The viewer contains a compact header, story progress, one poster stage, previous/next controls, and download actions. Do not show sender identity or raw feedback.

- [ ] **Step 4: Implement poster navigation and active-campaign guard**

```js
function openMediaSummary(){
  MEDIA_STATE.campaign=FeedbackModel.activeMediaCampaign(MEDIA_CAMPAIGNS,MEDIA_NOW);
  if(!MEDIA_STATE.campaign)return;
  MEDIA_STATE.posterIndex=0;
  renderMediaPoster();
  openOverlay('mediaSummaryOverlay');
}

function moveMediaPoster(direction){
  const max=MEDIA_STATE.campaign.insights.length-1;
  MEDIA_STATE.posterIndex=Math.max(0,Math.min(max,MEDIA_STATE.posterIndex+direction));
  renderMediaPoster();
}
```

`renderMediaPoster()` maps each insight to the template id assigned by Admin and updates the progress and disabled states of navigation controls.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `node E-04/feedback-model.test.js`

Expected: all tests pass.

---

### Task 4: Prototype poster downloads and final verification

**Files:**
- Modify: `E-04/index.html`
- Test: `E-04/feedback-model.test.js`

**Interfaces:**
- Consumes: the current Admin template metadata and anonymous insight.
- Produces: `downloadCurrentMediaPoster()` and `downloadAllMediaPosters()`.

- [ ] **Step 1: Write failing download contract tests**

```js
test('active media campaigns expose current and all-poster downloads only inside the viewer', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/function downloadCurrentMediaPoster\(\)/);
  assert.match(html,/function downloadAllMediaPosters\(\)/);
  assert.match(html,/Táº£i poster nÃ y/);
  assert.match(html,/Táº£i táº¥t cáº£/);
  assert.match(html,/FeedbackModel\.campaignStatus\(MEDIA_STATE\.campaign,MEDIA_NOW\)!=='active'/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node E-04/feedback-model.test.js`

Expected: FAIL because the download functions do not exist.

- [ ] **Step 3: Implement deterministic SVG downloads**

Build each poster as an SVG string from the selected Admin template plus escaped AI insight content. Download the current poster as one `.svg`; download all by triggering one file per poster in the prototype. Both functions return without action if the campaign is no longer active.

```js
function triggerMediaDownload(svg,name){
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  const link=Object.assign(document.createElement('a'),{href:url,download:name});
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}
```

- [ ] **Step 4: Run complete verification**

Run:

```powershell
node E-04/feedback-model.test.js
node M-04/m04.test.js
git diff --check
```

Expected: all E-04 and M-04 tests pass; `git diff --check` exits 0. Do not commit. Present the local prototype to the user for visual confirmation.
