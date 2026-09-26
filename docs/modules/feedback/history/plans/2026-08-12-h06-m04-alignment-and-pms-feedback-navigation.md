# H-06 M-04 Alignment and PMS Feedback Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make H-06 visually and structurally identical to the M-04 request-detail pattern, then make Feedback reachable from the PMS V3 shell for Employee, Manager and HR review roles.

**Architecture:** `M-04/request-detail.html` is the visual source of truth for the three-panel detail screen. H-06 keeps its existing pure program data/model but renders it inside the same shell, rail, content pane and ticket summary contract. Each role has one Feedback entry route; H-06 is only a child route of H-05.

**Tech Stack:** Static HTML/CSS, vanilla JavaScript, shared UMD data/model modules and Node.js built-in `node:test`.

## Implementation status

Implemented locally on 12/08/2026. The TDD contracts for M-04 parity, role-based Feedback navigation and the Design System rule are green. H-06 now uses the M-04 three-panel family, and the three review roles route to E-04, M-04 and H-05 respectively. No commit or push has been made.

## Global Constraints

- Use TDD: every new behavior begins with an observed failing test.
- Do not commit or push unless the user explicitly asks.
- Preserve H-05 program lifecycle, shared fixture data, AI eligibility and reminder cooldown behavior.
- `M-04/request-detail.html` owns detail layout values, component names, type hierarchy and responsive behavior.
- Use Public Sans, the Feedback Design System token scale and the shared custom tooltip.
- Compose metadata with ` - ` only; do not use `.` or `·` as separators.
- Program status and total answer ratio have one primary location: H-06 page header.
- Feedback remains a coaching and development tool, not an evaluation or ranking tool.

---

## File structure and boundaries

| File | Responsibility |
|---|---|
| `H-05/h05.test.js` | Regression contracts for H-05 route, H-06/M-04 visual parity and HR navigation. |
| `H-06/index.html` | HR program detail UI that consumes H-05 data/model only. |
| `H-05/index.html` | HR program list and the parent Feedback entry for HR. |
| `E-04/index.html` | Employee Feedback entry and role navigation to Manager/HR entries. |
| `M-04/index.html` | Manager Feedback entry and role navigation to Employee/HR entries. |
| `E-01/index.html` | Existing PMS employee shell role navigation includes HR review entry. |
| `M-01/index.html` | Existing PMS manager shell role navigation includes HR review entry. |
| `design-system/index.html` | Documents the M-04 detail split-view source-of-truth rule. |

## Task 1: Lock H-06 to the M-04 detail contract

**Files:**
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: static HTML source from `H-06/index.html` and `M-04/request-detail.html`.
- Produces: regression constraints for PMS shell, three-panel geometry, M-04 component names and one program-status location.

- [ ] **Step 1: Write the failing visual-contract test**

```js
test('H-06 uses the M-04 detail shell and components instead of a standalone screen',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.match(detail,/class="app"/);
  assert.match(detail,/class="sidebar"/);
  assert.match(detail,/class="workspace"/);
  assert.match(detail,/class="shell request-detail-layout"/);
  assert.match(detail,/class="rail"/);
  assert.match(detail,/class="content-pane"/);
  assert.match(detail,/class="ticket-summary"/);
  assert.match(detail,/class="pane-head"/);
  assert.match(detail,/class="pane-body"/);
  assert.doesNotMatch(detail,/class="topbar"><div class="tb-logo"/);
});
```

- [ ] **Step 2: Run the focused suite and verify RED**

Run: `node H-05/h05.test.js`

Expected: the new test fails because H-06 still has a standalone topbar and bespoke `.detail-*` layout.

- [ ] **Step 3: Add status-placement and component-parity assertions**

```js
test('H-06 retains M-04 feedback components while keeping program progress in one header location',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.match(detail,/class="employee-badge-summary"/);
  assert.match(detail,/class="shared-question"/);
  assert.match(detail,/class="qa"/);
  assert.match(detail,/class="dialog-ai-summary"/);
  assert.equal((detail.match(/class="program-progress"/g)||[]).length,1);
});
```

- [ ] **Step 4: Run the focused suite and verify RED**

Run: `node H-05/h05.test.js`

Expected: the H-06 component-parity assertions fail before the refactor.

## Task 2: Refactor H-06 to the M-04 request-detail visual system

**Files:**
- Modify: `H-06/index.html`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: `FeedbackProgramData.programById`, `FeedbackProgramData.detailForProgram` and existing `FeedbackProgramModel` helpers.
- Produces: `renderParticipantList`, `renderDetail`, `renderProgramOverview`, `selectParticipant`, `collapseAiSummary` and `sendEligibleReminders` inside the M-04 detail DOM.

- [ ] **Step 1: Replace the standalone H-06 shell with the shared PMS shell**

Render this outer structure and preserve the selected program id:

```html
<div class="app">
  <aside class="sidebar">…role switch and active Phản hồi nav…</aside>
  <main class="workspace">
    <header class="topbar">Không gian Nhân sự</header>
    <section class="page">
      <div class="breadcrumb">Mục tiêu &amp; Đánh giá / Phản hồi / Chương trình</div>
      <header class="head">…program title, metadata, one program-progress chip, return button…</header>
      <div class="shell request-detail-layout">…</div>
    </section>
  </main>
</div>
```

- [ ] **Step 2: Reuse the M-04 three-panel component hierarchy**

Use this DOM boundary exactly:

```html
<aside class="rail"><div class="rail-title" id="participantCount"></div><div id="participantList"></div></aside>
<section class="content-pane">
  <header class="pane-head"><div><div class="pane-title" id="employeeTitle"></div><div class="employee-badge-summary" id="employeeBadgeSummary"></div></div></header>
  <div class="pane-body" id="detailBody"></div>
</section>
<aside class="ticket-summary" id="overview" aria-label="Tổng quan chương trình"></aside>
```

Use M-04 grid values `240px minmax(440px,1fr) 280px`, desktop internal scroll and its responsive fallback.

- [ ] **Step 3: Render M-04 feedback components from HR program data**

Render submitted responses as M-04 conversational pairs:

```js
function feedbackPair(assignment){
  const reviewer=assignment.reviewer;
  return `<article class="feedback-card"><div class="fb-head">…${reviewer.name} (${reviewer.domain})…</div><div class="qa"><div class="qa-q"><span class="qa-label">Câu hỏi</span><span class="qa-text">${DETAIL.question}</span></div><div class="qa-a"><div class="fb-body">${assignment.body}</div></div></div></article>`;
}
```

Render pending reviewers as M-04 `.pending` items, with named reviewer tooltip and compact status. Keep the shared question only once when it is not repeated inside response pairs.

- [ ] **Step 4: Reuse M-04 AI and summary patterns**

Use `dialog-ai-summary`, `dialog-ai-summary-head`, `dialog-ai-summary-content` and its collapse control. Render only when `FeedbackProgramModel.isAiSummaryEligible(participant)` is true. The right summary uses M-04 `.summary-progress`, `.summary-progress-track`, `.summary-list` and neutral `.summary-ai` action container; the reminder remains icon + `Nhắc` and uses the shared custom tooltip.

- [ ] **Step 5: Run the H-05 suite and verify GREEN**

Run: `node H-05/h05.test.js`

Expected: all existing model/route tests and both new M-04 parity contracts pass.

## Task 3: Add one Feedback entry per review role

**Files:**
- Modify: `H-05/h05.test.js`
- Modify: `E-04/index.html`
- Modify: `M-04/index.html`
- Modify: `H-05/index.html`
- Modify: `H-06/index.html`
- Modify: `E-01/index.html`
- Modify: `M-01/index.html`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: the existing role switch and sidebar components in each PMS shell.
- Produces: Employee `E-04`, Manager `M-04` and HR `H-05` Feedback entry links; H-06 stays reachable only through H-05.

- [ ] **Step 1: Write the failing role-navigation contract**

```js
test('PMS Feedback has one role-specific entry and no sidebar item for H-06',()=>{
  const employee=fs.readFileSync(path.join(__dirname,'..','E-04','index.html'),'utf8');
  const manager=fs.readFileSync(path.join(__dirname,'..','M-04','index.html'),'utf8');
  const program=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  for(const source of [employee,manager,program,detail])assert.match(source,/H-05\/index\.html/);
  assert.doesNotMatch(detail,/href="[^\"]*H-06\/index\.html"[^>]*>Phản hồi/);
});
```

- [ ] **Step 2: Run the H-05 suite and verify RED**

Run: `node H-05/h05.test.js`

Expected: the role-navigation contract fails because the HR entry is absent from current role switches.

- [ ] **Step 3: Add the HR review role without nested feedback menus**

Use the same three role buttons in each Feedback screen:

```html
<button class="role-btn" onclick="location.href='../E-04/index.html'">Nhân viên</button>
<button class="role-btn" onclick="location.href='../M-04/index.html'">Quản lý</button>
<button class="role-btn on" onclick="location.href='../H-05/index.html'">HR</button>
```

On E-01 and M-01, add a third HR button that routes to H-05. Keep one active `Phản hồi` sidebar link in each Feedback entry. Do not add a child sidebar link for H-06.

- [ ] **Step 4: Run the H-05 suite and verify GREEN**

Run: `node H-05/h05.test.js`

Expected: role-navigation contract and all previous H-05/H-06 contracts pass.

## Task 4: Record the M-04 detail rule in the Design System

**Files:**
- Modify: `design-system/index.html`
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: M-04 detail screen semantics and existing Feedback Design System rules.
- Produces: a documented source-of-truth rule for future Feedback detail split views.

- [ ] **Step 1: Write the failing Design System assertion**

```js
test('design system names M-04 as the shared feedback detail split-view source',()=>{
  const design=fs.readFileSync(path.join(__dirname,'..','design-system','index.html'),'utf8');
  assert.match(design,/M-04 request detail/i);
  assert.match(design,/left rail.*content pane.*right summary/i);
});
```

- [ ] **Step 2: Run the H-05 suite and verify RED**

Run: `node H-05/h05.test.js`

Expected: the Design System assertion fails because this source-of-truth rule is not yet documented.

- [ ] **Step 3: Add the documented rule**

Add one Design System rule stating that feedback detail views with a selectable employee list reuse the M-04 request-detail three-region component family: `rail`, `content-pane`, `ticket-summary`, shared question/answer pair, badge summary and internal content scroll. The semantic meaning can vary by role; geometry and tokens cannot vary without a documented exception.

- [ ] **Step 4: Run the H-05 suite and verify GREEN**

Run: `node H-05/h05.test.js`

Expected: all H-05/H-06 contracts pass.

## Task 5: Regression and handoff

**Files:**
- Verify: `H-05/h05.test.js`
- Verify: `E-04/feedback-model.test.js`
- Verify: `M-04/m04.test.js`
- Verify: `H-05/index.html`
- Verify: `H-06/index.html`

- [ ] **Step 1: Run all feedback regression suites**

```powershell
node H-05/h05.test.js
node E-04/feedback-model.test.js
node M-04/m04.test.js
```

Expected: zero failures.

- [ ] **Step 2: Parse all inline scripts and check whitespace**

```powershell
node -e "const fs=require('fs');for(const f of ['H-05/index.html','H-06/index.html','E-04/index.html','M-04/index.html']){const s=fs.readFileSync(f,'utf8');for(const m of s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(m[1].trim())new Function(m[1]);}console.log(f+' syntax OK')}"
git diff --check
```

Expected: all script files print `syntax OK`; no whitespace errors.

- [ ] **Step 3: Review the role and detail checklist**

- Employee role opens E-04 from `Phản hồi`.
- Manager role opens M-04 from `Phản hồi`.
- HR role opens H-05 from `Phản hồi`.
- H-05 opens non-draft programs in H-06.
- H-06 has no sidebar item and returns to H-05.
- H-06 uses the M-04 rail, content pane, ticket summary, internal scroll and type hierarchy.
- No H-06 standalone topbar remains.
- No commit or push is made.
