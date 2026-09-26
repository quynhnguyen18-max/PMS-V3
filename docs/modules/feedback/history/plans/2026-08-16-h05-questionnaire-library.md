# H-05 Questionnaire Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let HR manage reusable questionnaires, safely use them in feedback requests, and save custom request questionnaires without mutating source templates.

**Architecture:** Add a small `QuestionnaireLibraryModel` that owns questionnaire normalization, cloning and permission checks. The existing H-05 request builder consumes that model and browser-local storage. A dedicated library page reviews, creates, edits, shares, copies and applies templates; it passes a selected template id to the request builder. The H-05 landing page becomes the entry point for both request and library flows.

**Tech Stack:** Static HTML, inline CSS and browser JavaScript, Node `node:test`, Public Sans, Boxicons, existing M-04 form/person-picker/modal patterns.

**Spec:** `docs/superpowers/specs/2026-08-16-h05-questionnaire-library-design.md`

## Global Constraints

- M-04 is source of truth for form controls, person picker, tooltips and dialogs.
- Field label is 12.5px/600; input is 13px/400; hint and inline error are 11.5px.
- Do not use dot separators in UI metadata.
- A request always owns a cloned questionnaire; editing it never mutates a library template.
- Shared users may use or copy a template, but only its owner may edit or delete it.
- Feedback direction is reviewer → feedback recipient. In this HR mapping, the recipient is placed on the left and reviewer on the right, so the dark triangle points left.
- Do not commit or push without explicit user instruction.

---

### Task 1: Questionnaire data model and storage contract

**Files:**
- Create: `H-05/questionnaire-library-model.js`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- Produces `QuestionnaireLibraryModel.normalize(template, currentUser)`.
- Produces `QuestionnaireLibraryModel.cloneForRequest(template)`.
- Produces `QuestionnaireLibraryModel.canEdit(template, userId)`, `canDelete(template, userId)`, `canUse(template, userId)`.
- Produces `QuestionnaireLibraryModel.visibleTo(template, userId)` and `QuestionnaireLibraryModel.makeCopy(template, currentUser, id)`.

- [ ] **Step 1: Write failing model tests**

```js
const template = Model.normalize({
  id:'shared-1', ownerId:'hrbp-1', scope:'selected_hr', sharedWithIds:['lod-1'],
  questions:[{id:'q1',type:'open_text',text:'Điều gì đang làm tốt?'}]
}, {id:'lod-1', name:'L&OD'});
assert.equal(Model.visibleTo(template,'lod-1'),true);
assert.equal(Model.canEdit(template,'lod-1'),false);
assert.notEqual(Model.cloneForRequest(template).questions,template.questions);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node H-05/h05.test.js`

Expected: failure because `QuestionnaireLibraryModel` does not exist.

- [ ] **Step 3: Implement the minimal model**

```js
function cloneForRequest(template){
  return template.questions.map((question,index)=>({
    ...question,
    id:`rq${index+1}`,
    ratingLabels:{...(question.ratingLabels||{})}
  }));
}
function canEdit(template,userId){ return !template.isSystem && template.ownerId===userId; }
function visibleTo(template,userId){
  return template.isSystem || template.ownerId===userId ||
    template.scope==='all_hr' || template.sharedWithIds.includes(userId);
}
```

- [ ] **Step 4: Run the model test and full H-05 contract suite**

Run: `node H-05/h05.test.js`

Expected: all tests pass.

### Task 2: Questionnaire library page and permissions

**Files:**
- Create: `H-05/questionnaire-library.html`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- Consumes `QuestionnaireLibraryModel` and local-storage key `uc5_questionnaire_library`.
- Produces routes `questionnaire-library.html` and `create-campaign.html?template=<templateId>`.
- Produces actions `useTemplate(id)`, `copyTemplate(id)`, `editTemplate(id)`, `deleteTemplate(id)`.

- [ ] **Step 1: Write failing library-page contracts**

```js
assert.match(library,/Bộ câu hỏi/);
assert.match(library,/Của tôi/);
assert.match(library,/Được chia sẻ với tôi/);
assert.match(library,/Mẫu hệ thống/);
assert.match(library,/function useTemplate\(id\)/);
assert.match(library,/function copyTemplate\(id\)/);
assert.match(library,/Tạo bộ câu hỏi/);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node H-05/h05.test.js`

Expected: failure because the library page is absent.

- [ ] **Step 3: Build the library**

Use the existing M-04 list/card and dialog tokens. Render source groups, search by name, use a detail modal for question review, and show only actions allowed by `canEdit`/`canUse`. Make “Tạo bản sao” create a personal clone before navigating to the editor. Make “Dùng bộ này” navigate to the request builder with `?template=`. Render metadata with a short hyphen rather than a dot.

- [ ] **Step 4: Run the library contracts**

Run: `node H-05/h05.test.js`

Expected: all tests pass.

### Task 3: Create/edit questionnaire and sharing modal

**Files:**
- Modify: `H-05/questionnaire-library.html`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- Consumes the model’s `normalize` and current HR people list.
- Produces `saveQuestionnaire()` persisted to `uc5_questionnaire_library`.
- Produces scope values `personal`, `all_hr`, `selected_hr`.

- [ ] **Step 1: Write failing share-scope and owner-action tests**

```js
assert.match(library,/Chỉ mình tôi/);
assert.match(library,/Toàn bộ nhóm HR/);
assert.match(library,/Chọn người cụ thể/);
assert.match(library,/\[Bộ phận\]_\[Mục đích sử dụng\]/);
assert.match(library,/function saveQuestionnaire\(\)/);
assert.match(library,/feedback-choice-card/);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node H-05/h05.test.js`

Expected: failure because the creation flow and scope chooser are absent.

- [ ] **Step 3: Implement the creation/editor dialog**

Provide a compact editor that reuses open-text/Likert icon controls and M-04 tooltip styling. Validate name and at least one non-empty question inline. The scope options have no default. `selected_hr` uses the standard person picker and requires at least one selected HR user. Save assigns current user ownership and persists the normalized record.

- [ ] **Step 4: Run the library and model tests**

Run: `node H-05/h05.test.js`

Expected: all tests pass.

### Task 4: Request builder safely consumes templates

**Files:**
- Modify: `H-05/create-campaign.html`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- Consumes `QuestionnaireLibraryModel`, `uc5_questionnaire_library`, URL `template`.
- Produces `loadTemplateForRequest(id)`, `confirmQuestionReplacement(nextAction)` and `saveRequestQuestionsAsTemplate()`.

- [ ] **Step 1: Write failing request-template contracts**

```js
assert.match(builder,/Mẫu của tôi/);
assert.match(builder,/Mẫu được chia sẻ với tôi/);
assert.match(builder,/Mẫu hệ thống/);
assert.match(builder,/function confirmQuestionReplacement\(nextAction\)/);
assert.match(builder,/Lưu thành bộ câu hỏi/);
assert.match(builder,/cloneForRequest/);
assert.doesNotMatch(builder,/TEMPLATES\[templateId\]\.push/);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node H-05/h05.test.js`

Expected: failure because the builder does not yet group/persist library templates or protect replacement.

- [ ] **Step 3: Implement safe template selection and save-as-template**

Load library data into grouped `<optgroup>`s. Clone all selected template questions into `STATE.questions`. If existing questions contain text, show a discard-confirmation dialog before replacing them. Track whether the request questionnaire differs from the selected template. Show “Lưu thành bộ câu hỏi” only for custom or changed cloned questions; reuse the library naming/scope modal instead of duplicating logic.

- [ ] **Step 4: Run H-05 contracts**

Run: `node H-05/h05.test.js`

Expected: all tests pass.

### Task 5: Request-builder errors, type controls and participant mapping

**Files:**
- Modify: `H-05/create-campaign.html`
- Modify: `H-05/h05.test.js`
- Modify: `design-system/index.html`
- Modify: `DESIGN-SYSTEM.md`

**Interfaces:**
- Produces `setFieldError(id,message)`, `clearFieldError(id)`, `focusFirstInvalidField(errors)`.
- Produces recipient-left mapping renderers and `syncReviewerAssignmentModeUI()` disabled state.

- [ ] **Step 1: Write failing UX contracts**

```js
assert.match(builder,/function setFieldError\(id,message\)/);
assert.match(builder,/function focusFirstInvalidField\(errors\)/);
assert.match(builder,/data-tooltip="Câu hỏi mở"/);
assert.match(builder,/data-tooltip="Câu hỏi Likert"/);
assert.match(builder,/disabled=STATE\.participants\.length<2/);
assert.match(builder,/Người nhận phản hồi[\s\S]*Người cho phản hồi/);
assert.match(builder,/border-right:8px solid var\(--z600\)/);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node H-05/h05.test.js`

Expected: failure because errors are toast-only, text type buttons remain and the participant mapping is not yet aligned with the approved recipient-left layout.

- [ ] **Step 3: Implement validation and compact controls**

Render inline error text below invalid inputs, add `aria-invalid` and focus the first failed control. Replace visible type labels with icon buttons using the shared black tooltip. Disable personalisation below two recipients. Use recipient-left and reviewer-right in both the mapping and review modal, with a dark left-facing triangle that preserves feedback direction. Preserve selections during the visual/order refactor.

- [ ] **Step 4: Update reusable design contracts**

Document the questionnaire-library scope card, icon-only question type tooltips, inline form-error treatment and reviewer-to-recipient mapping in both Design System artifacts.

- [ ] **Step 5: Run H-05 contracts**

Run: `node H-05/h05.test.js`

Expected: all tests pass.

### Task 6: H-05 landing-page entry point and regression verification

**Files:**
- Modify: `H-05/index.html`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- Produces header text `Quản lý yêu cầu phản hồi của HR`.
- Produces visible routes to `create-campaign.html` and `questionnaire-library.html`.

- [ ] **Step 1: Write failing landing-page contracts**

```js
assert.match(landing,/Quản lý yêu cầu phản hồi của HR/);
assert.match(landing,/Thư viện bộ câu hỏi/);
assert.match(landing,/href="questionnaire-library\.html"/);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node H-05/h05.test.js`

Expected: failure because the H-05 landing page still uses the old title and has no library entry.

- [ ] **Step 3: Implement the entry point**

Rename the H-05 heading and replace the ambiguous library action with the secondary outlined “Thư viện bộ câu hỏi” button. Keep “Tạo yêu cầu phản hồi” as the single primary CTA.

- [ ] **Step 4: Run regression checks**

Run: `node H-05/h05.test.js; node M-04/m04.test.js; node E-04/feedback-model.test.js; git diff --check`

Expected: all tests pass and no whitespace errors.
