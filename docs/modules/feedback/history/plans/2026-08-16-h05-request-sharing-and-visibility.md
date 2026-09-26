# H-05 Request Sharing and Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make H-05 request authoring, identity visibility, manual closure and selective result sharing consistent with M-04.

**Architecture:** `FeedbackProgramModel` owns normalized lifecycle and sharing states. H-05 persists these values from the builder; H-06 presents the state and actions in its existing M-04-derived three-panel detail layout. Static contract tests prevent token and wording regression.

**Tech Stack:** HTML, inline CSS and JavaScript, Node `node:test`, Public Sans, FeedbackProgramModel.

**Spec:** `docs/superpowers/specs/2026-08-16-h05-request-sharing-and-visibility-design.md`

## Global Constraints

- Use M-04 dialog tokens: field label 12.5px/600, form values 13px/400, field hints 11.5px/400.
- Do not use dot separators in metadata.
- Keep lifecycle status separate from result-sharing status.
- Do not commit or push without explicit user request.

---

### Task 1: Extend normalized model for visibility, sharing and closure

**Files:**
- Modify: `H-05/feedback-program-model.js`
- Modify: `H-05/h05.test.js`

- [ ] **Step 1: Write failing model tests** for `identityVisibility`, `resultSharing`, a participant-level `isResultShared`, and `closeCampaign`.

```js
assert.equal(model.normalizeCampaign({}).identityVisibility,'named');
assert.equal(model.normalizeCampaign({}).resultSharing.mode,'not_shared');
assert.equal(model.isResultShared({resultSharing:{mode:'shared_selected',participantIds:['p1']}},'p1'),true);
assert.equal(model.closeCampaign({status:'collecting'},'16/08/2026').status,'closed');
```

- [ ] **Step 2: Run `node H-05/h05.test.js`** and confirm the new assertions fail because the helpers and fields do not exist.
- [ ] **Step 3: Implement the minimal normalization and helpers.** Use `identityVisibility: 'named' | 'anonymous'`; normalize a `resultSharing` object, add `isResultShared(campaign, participantId)`, `shareResults(campaign, participantIds, sharedAt)`, and `closeCampaign(campaign, closedAt)`. Set pending assignment status to `locked` on close.
- [ ] **Step 4: Re-run `node H-05/h05.test.js`** and confirm green.

### Task 2: Lock H-05 authoring vocabulary, M-04 typography and layout contracts

**Files:**
- Modify: `H-05/h05.test.js`
- Modify: `H-05/create-campaign.html`

- [ ] **Step 1: Write failing static tests** for `12.5px` labels, `13px` controls, `11.5px` hints, new recipient/reviewer labels, the triangle, whole-set copy wording, reordered deadline/visibility fields, supplied-template state and no footer back button.
- [ ] **Step 2: Run `node H-05/h05.test.js`** and confirm each new assertion fails on the existing HTML.
- [ ] **Step 3: Implement the compact authoring canvas.** Use the M-04 type values, move deadline after mappings, place it beside identity visibility, use two mapping column headers and the existing triangle token, rename the copy action, add its notification hint, and remove the footer back action.
- [ ] **Step 4: Re-run `node H-05/h05.test.js`** and confirm green.

### Task 3: Make questionnaires and Likert configuration concise and flexible

**Files:**
- Modify: `H-05/feedback-program-model.js`
- Modify: `H-05/h05.test.js`
- Modify: `H-05/create-campaign.html`

- [ ] **Step 1: Write failing tests** for question type labels, a rating maximum from 2 through 10, endpoint validation, optional per-score labels and supplied-template styling.
- [ ] **Step 2: Run `node H-05/h05.test.js`** and confirm RED.
- [ ] **Step 3: Implement minimal model and renderer changes.** Store `ratingScale` in 2–10, require score 1 and max labels only unless `detailedRatingLabels` is true, render the per-score editor only when expanded, and apply the template accent class only for selected supplied sets.
- [ ] **Step 4: Re-run `node H-05/h05.test.js`** and confirm green.

### Task 4: Persist creation visibility and render H-06 sharing controls

**Files:**
- Modify: `H-05/create-campaign.html`
- Modify: `H-06/index.html`
- Modify: `H-05/h05.test.js`

- [ ] **Step 1: Write failing static and model-use tests** for form payload `identityVisibility`, `resultSharing`, header-level close action, right-summary sharing state, ticket-wide share button, participant-level share button, and confirmation action.
- [ ] **Step 2: Run `node H-05/h05.test.js`** and confirm RED.
- [ ] **Step 3: Persist model-backed creation data and add detail actions.** New requests start `collecting` plus `not_shared`. H-06 uses the model helpers, shows sharing state only in its right summary, opens a confirmation dialog before sharing, supports `Chia sẻ toàn bộ kết quả`, recipient-level `Chia sẻ kết quả`, and `Đóng ticket`. Block reminders and feedback submission displays once ticket is closed.
- [ ] **Step 4: Re-run `node H-05/h05.test.js`** and confirm green.

### Task 5: Publish shared rules and complete regression verification

**Files:**
- Modify: `design-system/index.html`
- Modify: `H-05/h05.test.js`

- [ ] **Step 1: Write failing Design System contract tests** for M-04 authoring tokens, supplied-template distinction, identity visibility, no duplicate status display, whole-set mapping copy and lifecycle/sharing separation.
- [ ] **Step 2: Run `node H-05/h05.test.js`** and confirm RED.
- [ ] **Step 3: Add concise Design System rules** and keep them concrete enough to be asserted by future screen contracts.
- [ ] **Step 4: Run `node H-05/h05.test.js`, `node M-04/m04.test.js`, `node E-04/feedback-model.test.js`, and `git diff --check`**; all must pass with no whitespace errors.
