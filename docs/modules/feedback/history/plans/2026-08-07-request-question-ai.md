# Request Question AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add focus-aware AI question improvement to the employee feedback-request popup without batch editing or inventing context.

**Architecture:** Keep deterministic prototype wording in a small CommonJS/browser-compatible helper, while the popup owns transient UI state in `R.ai`. Common and personalized questions share one rendering pattern; personalized state is keyed by reviewer domain and only the focused row exposes controls.

**Tech Stack:** Plain HTML/CSS/JavaScript, Node assertion tests.

## Global Constraints

- Do not commit or push until the user explicitly confirms.
- AI only changes a question after `Dùng gợi ý này` is selected.
- Personalized AI state is isolated by reviewer domain; there is no batch action.
- Reuse the existing AI panel and secondary-button visual language.

---

### Task 1: Deterministic question improvement helper

**Files:**
- Create: `E-04/request-question-ai.js`
- Modify: `E-04/feedback-model.test.js`

**Interfaces:**
- Produces: `RequestQuestionAI.improve(question: string, runCount?: number): string`

- [ ] Add tests proving an empty input returns an empty string, vague input becomes a concrete neutral question, and a second run returns a different variant without adding project names.
- [ ] Run `node E-04/feedback-model.test.js` and verify the new tests fail because the module does not exist.
- [ ] Implement a browser/CommonJS helper that preserves the source topic and adds prompts for observable examples, strengths, and development opportunities.
- [ ] Run the test suite and verify all helper tests pass.

### Task 2: Common-question AI controls

**Files:**
- Modify: `E-04/index.html`
- Modify: `E-04/feedback-model.test.js`

**Interfaces:**
- Consumes: `RequestQuestionAI.improve(question, runCount)`
- Produces: `runReqQuestionAI('common')`, `acceptReqQuestionAI('common')`, and `R.ai.common`

- [ ] Add markup-contract tests for the helper script, common AI panel, status line, and AI button.
- [ ] Run tests and verify failure because the controls are absent.
- [ ] Load the helper script and add an inline AI panel beneath `#reqQ` using the existing `ai-panel`, `btn-ai`, and secondary-button styles.
- [ ] Reset common AI state in `openRequest`; enable the button only when the common question has content.
- [ ] Implement loading, suggestion, accept, improve-again, and post-accept gray status states.
- [ ] Run tests and verify the common-question contract passes.

### Task 3: Focus-aware personalized AI

**Files:**
- Modify: `E-04/index.html`
- Modify: `E-04/feedback-model.test.js`

**Interfaces:**
- Produces: `R.ai.byReviewer[domain]`, `R.activeQuestionKey`, `activateReqQuestion(domain)`, and `onReqQuestionInput(domain, value)`

- [ ] Add contract tests for reviewer-keyed state, focus activation, active-row copy, and state deletion in `reqRemove`.
- [ ] Run tests and verify failure for the missing personalized behavior.
- [ ] Extend `R` with popup-scoped AI state and initialize reviewer state lazily.
- [ ] Make textarea focus activate one reviewer and render AI controls only in that row with `Đang chỉnh câu hỏi cho [Tên người phản hồi]`.
- [ ] Preserve suggestions across focus changes, update only the accepted reviewer question, and keep improve-again available after acceptance.
- [ ] Delete reviewer AI state when that reviewer is removed; preserve common state when personalization is toggled.
- [ ] Run tests and verify all behavior contracts pass.

### Task 4: Regression and syntax verification

**Files:**
- Verify: `E-04/index.html`
- Verify: `E-04/request-question-ai.js`
- Verify: `E-04/feedback-model.test.js`

- [ ] Run `node E-04/feedback-model.test.js` and confirm the full suite passes.
- [ ] Parse the inline scripts from `E-04/index.html` with Node to catch syntax errors.
- [ ] Run `git diff --check` and inspect `git status --short` to ensure the unrelated untracked demo file remains untouched.
- [ ] Report implementation and verification results without staging, committing, or pushing.
