# Feedback Tab Classification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make request responses appear consistently in Received, keep authored responses in Given, and drive cards and statistics from one normalized response model.

**Architecture:** Keep the prototype's existing `FEED` mock collection, but add pure normalization helpers that project completed nested reviewer responses into canonical response records. Rendering and statistics consume the same normalized collection; submission flows append canonical authored responses to `FEED`.

**Tech Stack:** Vanilla HTML, CSS and JavaScript; Node.js built-in test runner.

## Global Constraints

- A submitted response exists once in the normalized model even when accessible from a request popup and a feed tab.
- Pending request reviewers never appear in Received.
- Draft responses remain in Given and are excluded from submitted statistics.
- Existing card layouts and popup interactions remain unchanged.

---

### Task 1: Normalized response projection

**Files:**
- Create: `E-04/feedback-model.js`
- Create: `E-04/feedback-model.test.js`
- Modify: `E-04/index.html`

**Interfaces:**
- Produces: `FeedbackModel.normalizeFeed(feed)` and `FeedbackModel.itemsForFilter(feed, filter, cycle)`.
- A normalized request response has `kind: 'received'`, stable `id`, `requestId`, sender in `who`, submitted date, question, body, visibility and core values.

- [ ] Write tests proving eight completed nested responses are projected and pending reviewers are excluded.
- [ ] Run `node --test E-04/feedback-model.test.js` and verify failure because the model does not exist.
- [ ] Implement the pure normalization functions and load the browser script before the prototype script.
- [ ] Run the test and verify it passes.

### Task 2: Unified rendering and statistics

**Files:**
- Modify: `E-04/index.html`
- Modify: `E-04/feedback-model.test.js`

**Interfaces:**
- Consumes: `FeedbackModel.normalizeFeed(feed)` and `FeedbackModel.itemsForFilter(feed, filter, cycle)`.
- Produces: Received cards, All cards, response count and core-value tally from the same normalized records.

- [ ] Add tests proving the Received filter includes direct and request responses exactly once.
- [ ] Run the test and verify the new assertions fail against the incomplete behavior.
- [ ] Update `renderFeed()` and `renderRail()` to consume normalized records.
- [ ] Run tests and JavaScript syntax validation.

### Task 3: Submission flows

**Files:**
- Modify: `E-04/index.html`
- Modify: `E-04/feedback-model.test.js`

**Interfaces:**
- Produces: canonical `kind: 'given'` records from `sendGive()` and `submitReply()`.

- [ ] Add tests for canonical authored-response creation.
- [ ] Run the test and verify failure before implementation.
- [ ] Add `FeedbackModel.createGivenResponse(input)` and use it in both submit flows.
- [ ] Render the updated feed and statistics after submission.
- [ ] Run the full Node test suite and syntax checks.

### Task 4: Integration and delivery

**Files:**
- Modify: `FEEDBACK_PLAN.md` if its data rules differ from the approved spec.
- Verify: all modified repository files.

- [ ] Run `node --test E-04/feedback-model.test.js`.
- [ ] Parse every inline script in `E-04/index.html` with `new Function`.
- [ ] Run `git diff --check` and inspect the final diff/status.
- [ ] Commit all requested repository changes with the repository author identity.
- [ ] Push the current branch to its configured GitHub remote.
