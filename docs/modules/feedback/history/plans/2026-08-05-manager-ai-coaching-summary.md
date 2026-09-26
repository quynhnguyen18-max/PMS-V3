# Manager AI Coaching Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a read-only, automatically refreshed AI Coaching Summary for each feedback recipient in a manager-created request.

**Architecture:** Add a small deterministic prototype summary model keyed by employee and response count, then render it in `request-detail.html` above the original evidence feed. The component derives availability from completed assignments so selecting another employee or receiving a new response immediately re-renders the correct state.

**Tech Stack:** Static HTML/CSS/JavaScript and Node.js tests.

## Global Constraints

- Summary scope is one selected feedback recipient within one request.
- Require at least 2 completed responses.
- Manager cannot edit or regenerate AI output.
- New responses trigger summary re-render automatically.
- Feedback is coaching evidence, not an evaluation score.
- Do not commit or push until the user confirms.

---

### Task 1: AI summary prototype model and UI

**Files:**
- Create: `M-04/manager-ai-summary.js`
- Modify: `M-04/request-detail.html`
- Modify: `M-04/m04.test.js`

**Interfaces:**
- Consumes: selected employee, completed request assignments and feedback records.
- Produces: `ManagerAiSummary.create(employee, feedback)` returning `{available, responseCount, updatedAt, strengths, opportunities, themes}`.

- [x] Add failing tests for the 2-response threshold, auto-update input, read-only UI and two summary sections.
- [x] Run `node M-04/m04.test.js` and verify RED because the model and component do not exist.
- [x] Implement `manager-ai-summary.js` with deterministic prototype content and response-derived metadata.
- [x] Render the available and unavailable states in `request-detail.html` above the evidence feed.
- [x] Run M-04 and E-04 regression tests, parse scripts and run `git diff --check`.
