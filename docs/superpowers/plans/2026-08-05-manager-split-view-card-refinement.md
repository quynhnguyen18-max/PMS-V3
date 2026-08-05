# Manager Split View Card Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make manager Split View badge tooltips consistent with employee Feedback and reduce repeated recipient identity in feedback cards.

**Architecture:** Keep the shared full feedback card unchanged for dialogs and detail pages. Add a Split View rendering option and a reusable CSS tooltip driven by `data-tooltip`, so the compact behavior remains scoped to the manager side panel.

**Tech Stack:** Static HTML, CSS, JavaScript, Node.js test runner.

## Global Constraints

- Tooltip uses a rounded black background and white 12px text.
- Split View displays only the feedback sender; full cards elsewhere retain sender-to-recipient identity.
- No new dependency.

---

### Task 1: Split View tooltip and compact sender card

**Files:**
- Modify: `M-04/m04.test.js`
- Modify: `M-04/manager-feedback-data.js`
- Modify: `M-04/index.html`

**Interfaces:**
- Consumes: `ManagerFeedbackData.feedbackCard(item, employee, options)`
- Produces: `compactRecipient: true` option and `.ui-tooltip[data-tooltip]`

- [x] **Step 1: Write the failing test**

Assert that badge summaries use `data-tooltip`, CSS defines a dark rounded tooltip, and Split View calls `feedbackCard` with `{compactRecipient:true}`.

- [x] **Step 2: Run test to verify it fails**

Run: `node M-04/m04.test.js`
Expected: FAIL because the compact option and custom tooltip are absent.

- [x] **Step 3: Write minimal implementation**

Extend `feedbackCard` with an optional compact recipient mode, add the custom tooltip CSS, and use both only in `renderSplitView`.

- [x] **Step 4: Run test to verify it passes**

Run: `node M-04/m04.test.js`
Expected: all tests PASS.

- [x] **Step 5: Verify JavaScript syntax and diff**

Run inline script parsing for `M-04/index.html`, followed by `git diff --check`.
