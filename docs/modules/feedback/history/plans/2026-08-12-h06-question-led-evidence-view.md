# H-06 Question-led Evidence View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or inline TDD to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let HR read feedback for one selected employee question-by-question, with all related reviewer answers visible together and the question wording available on demand.

**Architecture:** Keep `questions[]` as the questionnaire definition and `assignment.answers[]` as reviewer evidence keyed by `questionId`. H-06 derives one question group per question for the selected employee; a compact question disclosure holds the wording while reviewer answers remain visible below it. The left rail continues to report reviewer completion, while each question group reports only answers to that question.

**Tech Stack:** Static HTML, vanilla JavaScript, Node built-in test runner, shared H-05 feedback-program fixtures and model.

## Global Constraints

- Use M-04 as source of truth for split-view spacing, response identity, answer typography, tooltip behavior, and internal scrolling.
- Do not render a standalone questionnaire block in H-06.
- Question wording is collapsed by default; reviewer answers are visible without an extra click.
- No dot (`.`) separators between metadata values.
- Do not commit unless explicitly requested.

---

### Task 1: Lock the question-led data and rendering contract

**Files:**
- Modify: `H-05/h05.test.js`
- Modify: `H-06/index.html`

**Interfaces:**
- Consumes `questions: Array<{id:string,text:string}>` and submitted `assignment.answers: Array<{questionId:string,body:string}>`.
- Produces `groupAnswersByQuestion(participant, questions): Array<{question,answers}>`.
- Produces `questionEvidenceGroup(group, index)`; it includes a compact disclosure, a response count, and all matching answers.

- [ ] **Step 1: Write the failing test**

```js
test('H-06 groups submitted evidence by question while keeping question wording collapsible',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(detail,/function groupAnswersByQuestion\(participant,questions\)/);
  assert.match(detail,/function questionEvidenceGroup\(group,index\)/);
  assert.match(detail,/Câu \$\{index\+1\}.*phản hồi/);
  assert.match(detail,/<details class="question-disclosure">/);
  assert.doesNotMatch(detail,/function questionSet\(/);
  assert.doesNotMatch(detail,/function renderQuestionPairs\(/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node H-05/h05.test.js`

Expected: FAIL because H-06 currently renders a reviewer-centric `renderQuestionPairs` function and a standalone `questionSet`.

- [ ] **Step 3: Write minimal implementation**

```js
function groupAnswersByQuestion(participant,questions){
  return questions.map(question=>({
    question,
    answers:participant.assignments
      .filter(item=>item.status==='submitted')
      .map(item=>({assignment:item,answer:(item.answers||[]).find(answer=>answer.questionId===question.id)}))
      .filter(item=>item.answer?.body)
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node H-05/h05.test.js`

Expected: PASS.

### Task 2: Seed visible question-specific feedback examples

**Files:**
- Modify: `H-05/feedback-program-data.js`
- Modify: `H-05/h05.test.js`

**Interfaces:**
- Produces question-specific answer text for the three-question `s3` and five-question `s4` programs.
- Ensures the initial priority recipient has at least one submitted reviewer response, while remaining incomplete and therefore actionable.

- [ ] **Step 1: Write the failing test**

```js
test('H-06 multi-question demo starts with partial, question-specific reviewer evidence',()=>{
  const data=require('./feedback-program-data.js');
  const detail=data.detailForProgram(data.programById('s3'));
  const first=detail.participants[0];
  const submitted=first.assignments.filter(item=>item.status==='submitted');
  assert.ok(submitted.length>0);
  assert.notEqual(submitted[0].answers[0].body,submitted[0].answers[1].body);
  assert.equal(submitted[0].answers.length,detail.questions.length);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node H-05/h05.test.js`

Expected: FAIL because the current initial `s3` participant has no completed assignments and generic body cycling can repeat by question.

- [ ] **Step 3: Write minimal implementation**

```js
const QUESTION_ANSWER_COPY={
  s3:{q1:['…'],q2:['…'],q3:['…']},
  s4:{q1:['…'],q2:['…'],q3:['…'],q4:['…'],q5:['…']}
};
```

Use this copy when mapping submitted assignments. Adjust only demo fixture completion counts required to make the first action-priority recipient partially answered.

- [ ] **Step 4: Run test to verify it passes**

Run: `node H-05/h05.test.js`

Expected: PASS.

### Task 3: Render the compact HR evidence feed

**Files:**
- Modify: `H-06/index.html`
- Modify: `H-05/h05.test.js`
- Modify: `design-system/index.html`

**Interfaces:**
- A question group has neutral header text, a count, and a native disclosure for its wording.
- A response record uses reviewer identity, timestamp, core-value icons, tooltip treatment, and answer text without a nested card border.
- A question with no answers uses a small contextual empty state inside its own group.

- [ ] **Step 1: Write the failing test**

```js
test('H-06 distinguishes reviewer completion from question answer counts without standalone question blocks',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(detail,/Đã nhận: \$\{progress\.done\}\/\$\{progress\.total\} người phản hồi/);
  assert.match(detail,/class="question-evidence-group"/);
  assert.match(detail,/Chưa nhận phản hồi cho câu này/);
  assert.match(design,/Question-led evidence view/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node H-05/h05.test.js`

Expected: FAIL because H-06 currently says `phản hồi` in both meanings and uses reviewer cards.

- [ ] **Step 3: Write minimal implementation**

```html
<section class="question-evidence-group">
  <details class="question-disclosure">
    <summary><span>Câu 1</span><span>3 phản hồi</span></summary>
    <p>Question wording…</p>
  </details>
  <div class="question-answers">…reviewer response records…</div>
</section>
```

Document the split between reviewer-completion and per-question-answer counts in the Design System.

- [ ] **Step 4: Run test to verify it passes**

Run: `node H-05/h05.test.js && node M-04/m04.test.js`

Expected: Both suites PASS.

### Task 4: Verify three- and five-question programs visually

**Files:**
- Verify: `H-06/index.html?id=s3`
- Verify: `H-06/index.html?id=s4`

- [ ] **Step 1: Verify a partially answered three-question recipient**

Confirm three compact question groups appear, each showing answer records before the question wording is expanded.

- [ ] **Step 2: Verify five questions under internal scroll**

Confirm five groups remain legible with only the center panel scrolling.

- [ ] **Step 3: Verify tooltip boundaries and no horizontal scrollbar**

Hover employee names and core-value icons near all pane edges. Each tooltip stays visible in the viewport and no horizontal scrollbar is visible.
