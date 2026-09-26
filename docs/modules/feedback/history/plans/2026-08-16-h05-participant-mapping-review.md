# H-05 Participant Mapping and Review Implementation Plan

**Status:** Implemented locally and regression-verified on 16/08/2026. The checklist preserves the original execution sequence.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let HR map shared or per-recipient feedback givers using the M-04 picker pattern, require identity disclosure choice, and review a request before its final send.

**Architecture:** `feedback-program-model.js` owns normalized assignment-mode and validation behavior. `create-campaign.html` is a stateful authoring/review surface that consumes the shared employee fixture and expands both UI modes into the existing `reviewerMappings` contract. The Design System documents the reused M-04 contract and UI tests protect the layout and wording.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS custom properties, Node `assert` tests.

**Spec:** `docs/superpowers/specs/2026-08-16-h05-participant-mapping-review-design.md`

## Global Constraints

- Reuse M-04 picker, tooltip, role-flow and typography contracts; do not introduce new UI tokens or component families.
- Canonical employee display is `Họ tên (tên.họ)` from an explicit shared fixture domain.
- Required identity mode has no default selection for new requests; stored legacy requests remain compatible as named.
- No persistence occurs before the review screen's final `Gửi yêu cầu` action.
- Work remains local and uncommitted unless the user explicitly requests a commit.

---

### Task 1: Model assignment modes and explicit identity validation

**Files:**
- Modify: `H-05/feedback-program-model.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Produces `normalizeAssignmentMode(source)`, `expandReviewerMappings(participants, mode, sharedReviewerIds, reviewerMappings)` and `validateLaunch(campaign, createdAt)` identity validation.
- Consumes existing `normalizeReviewerMappings`, `buildAssignments`, and campaign objects used by H-06.

- [ ] **Step 1: Write the failing tests**

```js
test('expands shared reviewers to every recipient and excludes self review', () => {
  const mappings = model.expandReviewerMappings(
    [{ id: 'a' }, { id: 'b' }],
    'shared',
    ['a', 'r1'],
    []
  );
  assert.deepEqual(mappings, [
    { participantId: 'a', reviewerIds: ['r1'] },
    { participantId: 'b', reviewerIds: ['a', 'r1'] }
  ]);
});

test('requires explicit identity visibility for a newly authored request', () => {
  const result = model.validateLaunch(validCampaign({ identityVisibility: '' }), '16/08/2026');
  assert.ok(result.errors.some(error => error.field === 'identityVisibility'));
});
```

- [ ] **Step 2: Run the targeted tests to verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because `expandReviewerMappings` is not exported and empty identity is normalized to `named`.

- [ ] **Step 3: Implement the minimal model behavior**

```js
function expandReviewerMappings(participants, mode, sharedReviewerIds, mappings) {
  if (mode !== 'shared') return normalizeReviewerMappings(mappings);
  const reviewerIds = uniqueIds(sharedReviewerIds);
  return uniqueById(participants).map(participant => ({
    participantId: participant.id,
    reviewerIds: reviewerIds.filter(id => id !== participant.id)
  }));
}
```

Keep legacy normalization named only when the original object lacks the `identityVisibility` key. Preserve an explicitly empty new value so `validateLaunch` can reject it.

- [ ] **Step 4: Run the full H-05 suite to verify GREEN**

Run: `node H-05/h05.test.js`

Expected: PASS with all existing and new tests.

### Task 2: Replace the isolated people fixture and contract-test domains

**Files:**
- Modify: `H-05/create-campaign.html`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- Consumes `window.PMS_EMPLOYEES` from the shared fixture loaded by M-04.
- Produces `employeeDisplay(person)` and searchable person options using the explicit `person.domain` or `person.dom` contract.

- [ ] **Step 1: Write the failing UI/source contracts**

```js
test('uses the shared PMS employee fixture and canonical display domains', () => {
  assert.match(page, /window\.PMS_EMPLOYEES/);
  assert.match(page, /kiet\.bui/);
  assert.doesNotMatch(page, /tuankiet/);
});
```

- [ ] **Step 2: Run the targeted test to verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because H-05 currently declares its own `const EMP` fixture.

- [ ] **Step 3: Implement the minimal shared fixture adapter**

Load the existing shared employee data script before the H-05 script, adapt its M-04 fields to H-05's `ini`, `dom`, `division`, `department`, `team`, and `position` read model, and make every rendered name use one display helper. Update fixture records that H-05 owns to explicit `tên.họ` domain values.

- [ ] **Step 4: Run the H-05 suite to verify GREEN**

Run: `node H-05/h05.test.js`

Expected: PASS.

### Task 3: Render M-04-compatible shared and per-recipient participant mapping

**Files:**
- Modify: `H-05/create-campaign.html`
- Modify: `H-05/h05.test.js`
- Modify: `design-system/index.html`

**Interfaces:**
- `STATE.reviewerAssignmentMode` is `'shared' | 'per_recipient'`.
- `STATE.sharedReviewerIds` stores the common reviewer set.
- `STATE.reviewerMappings` stores individual reviewer sets only.
- `buildReviewPayload()` obtains normalized mappings using `FeedbackProgramModel.expandReviewerMappings`.

- [ ] **Step 1: Write failing contracts for field, direction and copy condition**

```js
test('renders the M-04 participant field with recipient to reviewer direction', () => {
  assert.match(page, /Chọn người tham gia/);
  assert.match(page, /Người nhận phản hồi[\s\S]*mapping-arrow[\s\S]*Người cho phản hồi/);
});

test('shows the copy trigger only for a recipient row with selected reviewers', () => {
  assert.match(page, /reviewers\.length\?[^`]*mapping-copy/);
  assert.match(page, /Sao chép người cho phản hồi/);
});
```

- [ ] **Step 2: Run the H-05 suite to verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because the current row is reviewer-left and shows copy regardless of selected reviewers.

- [ ] **Step 3: Implement the mapping surface**

Use existing M-04 segmented-control styles for **Dùng chung người cho phản hồi** and **Thiết lập riêng theo người nhận**. In shared mode, show recipient chips in the left role card and one reviewer picker/chip group in the right role card. In per-recipient mode, render one recipient-left/reviewer-right row per recipient with divider-separated rows. Keep the copy icon in an end-action area so it cannot change the grid baseline. Keep tooltip markup as `pms-tooltip`.

- [ ] **Step 4: Update Design System documentation**

Document M-04 as source of truth, canonical employee domain source, mapping modes, role direction and conditional copy icon in the existing structured-feedback builder rule.

- [ ] **Step 5: Run the H-05 suite to verify GREEN**

Run: `node H-05/h05.test.js`

Expected: PASS.

### Task 4: Require identity mode and add deadline reminder metadata

**Files:**
- Modify: `H-05/create-campaign.html`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- Form field `identityVisibility` emits `'named'`, `'anonymous'`, or empty string before selection.
- `buildReviewPayload()` passes the selected value into `validateLaunch`.

- [ ] **Step 1: Write failing contracts**

```js
test('does not preselect an identity option and uses concise named and anonymous choices', () => {
  assert.doesNotMatch(page, /name="identityVisibility" value="named" checked/);
  assert.match(page, /Ghi danh/);
  assert.match(page, /Ẩn danh/);
});

test('shows the automatic reminder metadata below the deadline', () => {
  assert.match(page, /Hệ thống tự nhắc người chưa trả lời 3 ngày trước hạn phản hồi/);
});
```

- [ ] **Step 2: Run the H-05 suite to verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because named identity is checked by default and no reminder metadata exists.

- [ ] **Step 3: Implement the form contract**

Render the standard radio-option pattern with **Ghi danh** and **Ẩn danh**, each with its short gray description. Read a missing checked radio safely as `''`. Place the reminder sentence as a `field-hint` directly below the deadline control.

- [ ] **Step 4: Run the H-05 suite to verify GREEN**

Run: `node H-05/h05.test.js`

Expected: PASS.

### Task 5: Add a review state that is required before persistence

**Files:**
- Modify: `H-05/create-campaign.html`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- `buildReviewPayload()` returns `{ valid, errors, campaign }` using the model.
- `showReview()` swaps authoring for a full-page review state without writing storage.
- `confirmAndSend()` revalidates, calls `persistRequest(campaign)`, then navigates to H-06.

- [ ] **Step 1: Write failing source contracts**

```js
test('stages a review before sending and persists only from final confirmation', () => {
  assert.match(page, /function showReview\(/);
  assert.match(page, /Quay lại chỉnh sửa/);
  assert.match(page, /Gửi yêu cầu/);
  assert.match(page, /function confirmAndSend\([\s\S]*persistRequest/);
  assert.doesNotMatch(page, /function submitRequest\([\s\S]*persistRequest/);
});
```

- [ ] **Step 2: Run the H-05 suite to verify RED**

Run: `node H-05/h05.test.js`

Expected: FAIL because the form submit currently persists immediately.

- [ ] **Step 3: Implement authoring and review states**

Have submit validate then call `showReview`; hide the authoring form and display a concise summary using existing field-section/card primitives. `Quay lại chỉnh sửa` restores authoring state unchanged. `Gửi yêu cầu` revalidates and only then persists/navigates.

- [ ] **Step 4: Run the H-05 suite to verify GREEN**

Run: `node H-05/h05.test.js`

Expected: PASS.

### Task 6: Regression verification

**Files:**
- Verify: `H-05/h05.test.js`
- Verify: `M-04/m04.test.js`
- Verify: `E-04/feedback-model.test.js`
- Verify: `design-system/index.html`

- [ ] **Step 1: Run all module contracts**

Run: `node H-05/h05.test.js; node M-04/m04.test.js; node E-04/feedback-model.test.js`

Expected: All tests pass.

- [ ] **Step 2: Check whitespace and source consistency**

Run: `git diff --check`

Expected: exit code 0 with no whitespace errors.

- [ ] **Step 3: Inspect changed source against the spec**

Verify: no isolated employee fixture remains, recipient stays left of the triangle, no identity option has `checked`, copy is conditional, and no persistence appears before `confirmAndSend`.
