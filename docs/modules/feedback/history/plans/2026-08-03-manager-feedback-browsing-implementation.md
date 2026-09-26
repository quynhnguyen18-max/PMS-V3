# Manager Feedback Browsing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a compact manager feedback grid, filter popover, quick popup, Split View and shared full-page feedback detail.

**Architecture:** Extract manager feedback fixtures and rendering helpers into a browser/CommonJS shared module. `M-04/index.html`, Split View and `feedback-detail.html` consume the same employee and feedback records so counts and cards remain consistent.

**Tech Stack:** Vanilla HTML/CSS/JavaScript and Node.js built-in tests.

## Global Constraints

- Do not use `·` as a UI metadata separator; use ` - `.
- Do not reveal counts or content of receiver-only feedback.
- Keep List View filter/search state when toggling Split View.
- Each employee must have at least three manager-visible sample responses.

---

### Task 1: Shared feedback data

**Files:**
- Create: `M-04/manager-feedback-data.js`
- Modify: `M-04/m04.test.js`
- Modify: `M-04/index.html`

**Interfaces:**
- Produces: `ManagerFeedbackData.feedbackFor(employeeId, cycle)`, `ManagerFeedbackData.feedbackCard(item, employee)` and `ManagerFeedbackData.employeeMeta(employee)`.

- [ ] Add a test asserting every employee has at least three manager-visible responses and metadata contains no `·`.
- [ ] Run `node M-04/m04.test.js` and confirm the new test fails because the module does not exist.
- [ ] Implement the shared UMD module and load it in M-04.
- [ ] Run the test and confirm it passes.

### Task 2: Grid and filter popover

**Files:**
- Modify: `M-04/index.html`
- Modify: `M-04/m04.test.js`
- Modify: `DESIGN-SYSTEM.md`

**Interfaces:**
- Consumes: shared manager feedback counts.
- Produces: compact role-dependent headers and `toggleFilterPanel()`, `activeFilterCount()` and `clearFilters()`.

- [ ] Add assertions for the three approved column layouts, numeric-only response cells, absence of scope guidance and a single Bộ lọc trigger.
- [ ] Run tests and verify the assertions fail.
- [ ] Replace exposed selects with the M-01 popover pattern, remove scope guidance, simplify grid columns and add employee status tags.
- [ ] Add the global metadata separator rule to `DESIGN-SYSTEM.md`.
- [ ] Run tests and JavaScript syntax validation.

### Task 3: Popup and full-page detail

**Files:**
- Create: `M-04/feedback-detail.html`
- Modify: `M-04/index.html`
- Modify: `M-04/m04.test.js`

**Interfaces:**
- Produces: `openFeedbackTab(employeeId)` and query parameters `employee`, `cycle`.

- [ ] Add tests for the concise popup header, count badge, employee metadata, removed privacy banner and external-tab action.
- [ ] Run tests and verify failure.
- [ ] Implement the popup changes and full-page detail using shared data.
- [ ] Run tests and syntax validation for both pages.

### Task 4: Split View

**Files:**
- Modify: `M-04/index.html`
- Modify: `M-04/m04.test.js`

**Interfaces:**
- Produces: `toggleSplitView()`, `selectSplitEmployee(employeeId)` and state fields `splitView`, `selectedId`, `filterOpen`.

- [ ] Add tests for the Split View toggle, compact employee rail, detail pane and external-tab action.
- [ ] Run tests and verify failure.
- [ ] Implement Split View while preserving current search/filter state.
- [ ] Run all E-04 and M-04 tests, parse inline JavaScript and run `git diff --check`.
