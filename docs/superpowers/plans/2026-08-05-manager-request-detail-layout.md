# Manager Request Detail Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the manager request-detail screen with the PMS design system and make ticket progress and feedback easier to scan.

**Architecture:** Keep the existing static HTML and request model. Refactor only `request-detail.html` into a responsive three-region shell, reuse core-value icon mapping from manager feedback data, and render a compact ticket summary panel.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js test runner.

## Global Constraints

- Preserve current request storage and reminder behavior.
- Use Public Sans and existing PMS Zinc/brand tokens.
- No duplicated pending count under the page header.
- Main feedback feed must scroll internally on desktop.

---

### Task 1: Request detail visual structure

**Files:**
- Modify: `M-04/m04.test.js`
- Modify: `M-04/request-detail.html`

**Interfaces:**
- Consumes: `ManagerRequestModel.summarize`, `ManagerRequestModel.byEmployee`, `ManagerFeedbackData.coreValueIcon`.
- Produces: `renderTicketSummary(stat, rows)` and updated `responseCard(...)` markup.

- [x] Write failing assertions for three-region layout, internal scroll, summary panel, image badges, pink question treatment and highlighted pending rows.
- [x] Run `node M-04/m04.test.js` and verify the new test fails because the structure is absent.
- [x] Implement the responsive layout and component fixes in `M-04/request-detail.html`.
- [x] Run `node M-04/m04.test.js` and verify all tests pass.
- [x] Parse inline JavaScript and run `git diff --check`.
