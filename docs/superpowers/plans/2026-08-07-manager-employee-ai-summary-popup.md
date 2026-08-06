# Manager Employee AI Summary Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a collapsible AI Summary above the original feedback list in the manager employee-feedback popup when at least two visible responses are available.

**Architecture:** Reuse `ManagerAiSummary.create(employee, feedback)` and add a focused popup renderer in `M-04/index.html`. The existing `openFeedback` flow remains the single entry point for row and eye-icon clicks; it prepends summary markup only when the model reports availability.

**Tech Stack:** Plain HTML/CSS/JavaScript and Node assertion tests.

## Global Constraints

- Do not add a separate AI icon to the employee table.
- Do not show a placeholder when fewer than two visible responses exist.
- Do not show edit, regenerate, or `Chỉ đọc` controls.
- Do not commit or push until the user explicitly requests it.

---

### Task 1: Popup AI Summary contract

**Files:**
- Modify: `M-04/m04.test.js`
- Modify: `M-04/index.html`

**Interfaces:**
- Consumes: `ManagerAiSummary.create(employee, feedback)`
- Produces: `employeeAiSummaryHTML(employee, feedback)` and `toggleDialogAiSummary()`

- [ ] Add failing tests for loading `manager-ai-summary.js`, no separate table AI icon, two-response rendering, one-response omission, update date, and collapse accessibility.
- [ ] Run `node M-04/m04.test.js` and verify the tests fail for the missing popup summary.
- [ ] Load `manager-ai-summary.js` and add popup summary styles matching the request-detail pattern.
- [ ] Implement a renderer that returns an empty string below the two-response threshold and a two-section summary above it.
- [ ] Prepend summary markup in `openFeedback` before the existing sorted feedback cards.
- [ ] Implement session-only collapse state without changing the feedback list.
- [ ] Run the M-04 tests and verify all pass.

### Task 2: Regression verification

**Files:**
- Verify: `M-04/index.html`
- Verify: `M-04/m04.test.js`

- [ ] Parse all inline scripts in `M-04/index.html` with Node.
- [ ] Run `git diff --check`.
- [ ] Verify the employee action column still contains only the existing eye action.
- [ ] Report results without staging, committing, or pushing.
