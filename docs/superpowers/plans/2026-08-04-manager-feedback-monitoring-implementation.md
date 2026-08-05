# Manager Feedback Request Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent request-monitoring mode to M-04 with cycle summaries, request list, employee/reviewer drill-down and same-day reminder locking.

**Architecture:** Extend `ManagerRequestModel` with seed-aware store, request lookup/upsert and reminder operations. Keep all request data in the shared model, persist it through a guarded localStorage adapter in `M-04/index.html`, and render D4 as a second content panel beside the existing employee-feedback panel. Request detail uses an inline split view so D5 can later attach a per-employee summary without another navigation layer.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, browser localStorage, Node.js built-in test runner.

## Global Constraints

- Keep exactly one primary CTA in the page header: **Tạo yêu cầu phản hồi**.
- Content modes are quiet tabs, not CTA buttons.
- Request monitoring reads the selected performance cycle.
- Do not copy response content into request assignments; use `responseId`.
- Use ` - ` for metadata, never `·`.
- D4 provides only the D5 summary position/empty state, not AI summary generation.
- Request persistence key is `pms.managerFeedbackRequests.v1`.
- Reminder actions affect pending assignments only and lock for the current day.

---

### Task 1: Monitoring model and reminders

**Files:**
- Modify: `M-04/manager-request-model.js`
- Modify: `M-04/m04.test.js`

**Interfaces:**
- Consumes: existing `createRequest`, `summarize`, `byEmployee`, `tsFromDMY`.
- Produces: `requestStatus(request,todayDMY)`, `daysOverdue(request,todayDMY)`, `remindAssignment(request,assignmentId,todayDMY)`, `remindPending(request,todayDMY)`, and `createStore(initialRequests)` with `replace`, `upsert`, `get`, `serialize`.

- [ ] **Step 1: Write failing model tests**

Add tests that assert:

```js
const store = model.createStore([request]);
assert.equal(store.get(request.id).id, request.id);
store.upsert({...request, due:'12/08/2026'});
assert.equal(store.requests.length, 1);
assert.equal(model.requestStatus(request, '12/08/2026'), 'overdue');
assert.equal(model.daysOverdue(request, '12/08/2026'), 2);
assert.equal(model.remindAssignment(request, request.assignments[1].id, '12/08/2026'), true);
assert.equal(model.remindAssignment(request, request.assignments[1].id, '12/08/2026'), false);
assert.equal(model.remindPending(request, '13/08/2026'), 3);
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node M-04/m04.test.js`  
Expected: FAIL because the D4 methods do not exist.

- [ ] **Step 3: Implement minimal model behavior**

Add `remindedAt:null` and `responseId:null` to new assignments. Implement status precedence `complete → overdue → collecting`, whole-day overdue calculation, pending-only reminders, same-day lock, and seed-aware store operations.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node M-04/m04.test.js`  
Expected: all model tests pass.

---

### Task 2: Seed data and guarded persistence

**Files:**
- Create: `M-04/manager-request-seed.js`
- Modify: `M-04/index.html`
- Modify: `M-04/m04.test.js`

**Interfaces:**
- Produces: `ManagerRequestSeed.create(employees)` returning at least three cycle-2026 requests.
- Produces: `loadRequestStore()`, `persistRequestStore()` and constant `REQUEST_STORAGE_KEY`.
- Consumes: `ManagerRequestModel.createStore(initialRequests)`.

- [ ] **Step 1: Write failing seed/persistence tests**

Assert the seed module exists, every request has assignments, and the set includes `collecting`, `overdue` and `complete` on `04/08/2026`. Assert M-04 contains the versioned storage key, guarded `JSON.parse`, seed fallback and persist calls after create/remind.

- [ ] **Step 2: Run the test and verify RED**

Run: `node M-04/m04.test.js`  
Expected: FAIL because seed and persistence are missing.

- [ ] **Step 3: Implement seed and persistence**

Build requests with `ManagerRequestModel.createRequest`, then mark deterministic assignments done/reminded. Load valid arrays from localStorage; otherwise create seed store and persist it. Catch read/parse/write failures without blocking M-04.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node M-04/m04.test.js`.

---

### Task 3: Content modes and monitoring overview

**Files:**
- Modify: `M-04/index.html`
- Modify: `M-04/m04.test.js`

**Interfaces:**
- Produces: `setContentMode(mode)`, `renderRequestMonitoring()`, `requestRowHTML(request)`.
- Extends: `STATE.contentMode`, `STATE.selectedRequestId`, `STATE.selectedRequestEmployeeId`.

- [ ] **Step 1: Write failing UI structure tests**

Assert accessible tablist/tab/panels exist, only `requestCta` is primary in the header, request badge exists, feedback panel wraps existing scope/list/split content, and request panel contains compact summary values and request list.

- [ ] **Step 2: Run the test and verify RED**

Run: `node M-04/m04.test.js`.

- [ ] **Step 3: Implement content modes**

Move the current feedback controls into `feedbackModePanel`. Add quiet tabs below the page header. Add `requestModePanel` with compact inline statistics and a request table. Preserve feedback search/filter state when switching modes. Cycle changes call both renderers.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node M-04/m04.test.js`.

---

### Task 4: Request and employee drill-down

**Files:**
- Modify: `M-04/index.html`
- Modify: `M-04/m04.test.js`

**Interfaces:**
- Produces: `selectRequest(requestId)`, `selectRequestEmployee(employeeId)`, `renderRequestDetail()`, `assignmentRowHTML(request,assignment)`.

- [ ] **Step 1: Write failing detail tests**

Assert the request detail split shell, employee rail, assignment pane, per-reviewer question/status, bulk reminder action and D5 placeholder exist.

- [ ] **Step 2: Run the test and verify RED**

Run: `node M-04/m04.test.js`.

- [ ] **Step 3: Implement request detail**

Select the newest request by default, then its first employee. Render employee progress on the left and reviewer assignments on the right. Show submitted timestamp for done assignments, reminder action for pending, neutral overdue status and the D5 empty state.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node M-04/m04.test.js`.

---

### Task 5: Reminder actions and create-to-monitor flow

**Files:**
- Modify: `M-04/index.html`
- Modify: `M-04/m04.test.js`

**Interfaces:**
- Produces: `remindRequestAssignment(assignmentId)`, `remindAllPending()`, `openCreatedRequest(requestId)`.

- [ ] **Step 1: Write failing interaction tests**

Assert reminder actions invoke model methods, persist and rerender. Assert MR-1 success offers **Xem tiến độ yêu cầu**, switches to request mode and selects the created request.

- [ ] **Step 2: Run the test and verify RED**

Run: `node M-04/m04.test.js`.

- [ ] **Step 3: Implement interactions**

Persist after every create/reminder operation. Replace the MR-1 success secondary action with **Xem tiến độ yêu cầu**, while keeping **Tạo yêu cầu khác** as the remaining create action. Show toast feedback for single/bulk reminder and same-day lock.

- [ ] **Step 4: Run the test and verify GREEN**

Run: `node M-04/m04.test.js`.

---

### Task 6: Responsive polish and full verification

**Files:**
- Modify: `M-04/index.html`
- Modify: `FEEDBACK_PLAN.md`
- Modify: `FEEDBACK_HANDOFF_2026-08-04.md` locally only; it is gitignored.

**Interfaces:**
- No new runtime interfaces.

- [ ] **Step 1: Add static assertions for responsive/detail semantics**

Assert monitoring table wrapper, tab ARIA attributes, progress text, responsive request-detail breakpoint and absence of `·` in new UI metadata.

- [ ] **Step 2: Run all tests**

Run:

```powershell
node E-04/feedback-model.test.js
node M-04/m04.test.js
```

- [ ] **Step 3: Validate inline scripts**

Parse inline scripts from `E-04/index.html`, `M-04/index.html` and `M-04/feedback-detail.html` with `new Function`.

- [ ] **Step 4: Validate diff and update status docs**

Run `git diff --check`. Mark D4 complete and D5 next in `FEEDBACK_PLAN.md` and local handoff.

