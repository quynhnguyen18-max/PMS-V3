# Manager Feedback Request List Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dense inline D4 monitoring UI with the approved request list v5, optional Kanban view, required request goal and a dedicated request detail route.

**Architecture:** Extend `ManagerRequestModel` with goal normalization and legacy migration, then keep list/Kanban state inside `M-04/index.html`. Move request detail rendering into `M-04/request-detail.html`, loading the same versioned localStorage request store and shared employee/feedback data without copying response content into requests.

**Tech Stack:** Static HTML/CSS/JavaScript, Node test runner, localStorage, existing Boxicons and shared PMS prototype data.

## Global Constraints

- One primary CTA only: **Tạo yêu cầu phản hồi**.
- Required request field label is **Mục tiêu**.
- Content tabs are **Phản hồi** and **Yêu cầu**.
- List is default; Kanban is secondary view mode.
- No request search box and no numeric pagination.
- Load 10 requests per batch with **Xem thêm 10 yêu cầu**.
- Request detail uses a dedicated route, never popup or inline expansion.
- Identity uses `Họ tên (domain)` and hover metadata `Phòng ban - Team - Vị trí`; never use `·` as organization separator.
- Request feedback cards reuse E-04 layout rules.

---

### Task 1: Request goal model and legacy migration

**Files:**
- Modify: `M-04/manager-request-model.js`
- Modify: `M-04/manager-request-storage.js`
- Modify: `M-04/manager-request-seed.js`
- Test: `M-04/m04.test.js`

**Interfaces:**
- Produces: `normalizeGoal(input) -> string`, `migrateRequest(request) -> request`, `migrateRequests(requests) -> request[]`.
- `createRequest(input)` stores required `goal`.

- [ ] **Step 1: Write failing tests** asserting new requests persist trimmed `goal`, seed requests have goals and legacy requests load with fallback `Yêu cầu phản hồi ngày dd/mm/yyyy` or shared question.
- [ ] **Step 2: Run `node --test --test-isolation=none M-04/m04.test.js` and verify RED.**
- [ ] **Step 3: Implement goal normalization and storage migration.** Explicit IDs remain unchanged; migration must not duplicate assignments.
- [ ] **Step 4: Run M-04 tests and verify GREEN.**

### Task 2: Required Mục tiêu field in create request flow

**Files:**
- Modify: `M-04/index.html`
- Test: `M-04/m04.test.js`

**Interfaces:**
- Consumes: `ManagerRequestModel.createRequest({goal,...})`.
- Produces: `#requestGoal`, draft field `goal`, required validation in `syncRequestForm()`.

- [ ] **Step 1: Write failing static tests** for `#requestGoal`, red required star, draft save/restore and create payload goal.
- [ ] **Step 2: Run M-04 tests and verify RED.**
- [ ] **Step 3: Add the required field before the question field.** Disable submit until goal, question, recipients, reviewers and due date are valid.
- [ ] **Step 4: Run M-04 tests and verify GREEN.**

### Task 3: Clear tabs and approved v5 list

**Files:**
- Modify: `M-04/index.html`
- Test: `M-04/m04.test.js`

**Interfaces:**
- Produces: `STATE.requestView`, `STATE.requestLimit`, `visibleRequests()`, `renderRequestList()`, `loadMoreRequests()`.

- [ ] **Step 1: Write failing tests** for tab labels, bordered segmented control, absence of request search/numeric pagination, three list columns and load-more controls.
- [ ] **Step 2: Run tests and verify RED.**
- [ ] **Step 3: Replace the current seven-column request table.** Row data is goal/date, up to two employee names plus remainder, and merged progress/deadline.
- [ ] **Step 4: Implement 10-item batches and reset limit on cycle/filter changes only.**
- [ ] **Step 5: Run tests and verify GREEN.**

### Task 4: Filter and Kanban view mode

**Files:**
- Modify: `M-04/index.html`
- Test: `M-04/m04.test.js`

**Interfaces:**
- Produces: `STATE.requestStatusFilter`, `setRequestView(view)`, `setRequestStatusFilter(status)`, `renderRequestKanban(requests)`.

- [ ] **Step 1: Write failing tests** for one filter control, list/Kanban controls and three Kanban lanes.
- [ ] **Step 2: Run tests and verify RED.**
- [ ] **Step 3: Implement status filter popover and Kanban cards using the same request array as list rows.**
- [ ] **Step 4: Preserve filter and loaded count when switching views; run tests GREEN.**

### Task 5: Dedicated request detail route

**Files:**
- Create: `M-04/request-detail.html`
- Modify: `M-04/index.html`
- Modify: `M-04/manager-feedback-data.js`
- Test: `M-04/m04.test.js`

**Interfaces:**
- List rows/cards link to `request-detail.html?request=<id>&cycle=<cycle>`.
- Detail consumes `ManagerRequestStorage.load`, `ManagerRequestSeed.create`, `ManagerRequestModel.byEmployee` and `responseId` lookup from shared feedback store.

- [ ] **Step 1: Write failing tests** for dedicated links, absence of inline request detail shell, required detail DOM and shared scripts.
- [ ] **Step 2: Run tests and verify RED.**
- [ ] **Step 3: Build detail header with breadcrumb, goal, dates and one progress summary.**
- [ ] **Step 4: Build employee rail and response/pending groups.** Shared question renders once; personalized question renders per response/pending reviewer.
- [ ] **Step 5: Reuse feedback card output with triangle arrow, avatar-first rule, date-before-sharing, core-value top-right and hover org metadata.**
- [ ] **Step 6: Keep reminder mutations persisted and rerender detail. Run tests GREEN.**

### Task 6: State restoration, responsive polish and verification

**Files:**
- Modify: `M-04/index.html`
- Modify: `M-04/request-detail.html`
- Modify: `FEEDBACK_PLAN.md`
- Modify locally only: `FEEDBACK_HANDOFF_2026-08-04.md`
- Test: `M-04/m04.test.js`

**Interfaces:**
- Produces sessionStorage list state keyed by cycle: tab, request view, filter, loaded count and scroll position.

- [ ] **Step 1: Add failing tests** for detail back link state token, mobile stacking and design-system separators.
- [ ] **Step 2: Implement state persistence and responsive behavior.**
- [ ] **Step 3: Update status docs to mark the redesign complete and D5 next.**
- [ ] **Step 4: Run `node --test --test-isolation=none E-04/feedback-model.test.js M-04/m04.test.js`.**
- [ ] **Step 5: Parse inline scripts in E-04, M-04 and request detail with `new Function`; run `git diff --check`.**
