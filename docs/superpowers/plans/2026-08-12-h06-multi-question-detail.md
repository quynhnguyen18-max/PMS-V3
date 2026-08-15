# H-06 Multi-question Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make HR program detail demonstrate and correctly render three- and five-question feedback assignments without making the central reading panel dense.

**Architecture:** Extend the H-05 program detail fixture so a program exposes a normalized `questions[]` collection and each submitted assignment exposes answers keyed by question id. H-06 renders each reviewer as one feedback card containing compact Q&A pairs, showing two pairs initially and expanding the remaining pairs locally. Tooltip placement becomes a component variant that opens upward where the panel boundary would clip it. H-06 removes its custom global scrollbar styling and inherits the M-04 native-scrollbar behavior.

**Tech Stack:** Static HTML, vanilla JavaScript, Node built-in test runner, existing H-05 shared feedback-program model and fixtures.

## Global Constraints

- Use M-04 request detail as the source of truth for split layout, Q&A pair styling, tooltip tokens, and scroll behavior.
- Keep identity metadata in tooltips; names retain domain spacing through separate DOM spans.
- No global custom scrollbar override in H-06.
- Do not commit unless explicitly requested.

---

### Task 1: Add normalized multi-question program fixtures

**Files:**
- Modify: `H-05/feedback-program-data.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Produces `detail.questions: Array<{id:string,text:string}>`.
- Produces `assignment.answers: Array<{questionId:string,body:string}>` for submitted assignments.

- [ ] **Step 1: Write the failing test**

```js
test('H-05 seeds three- and five-question program details with one answer per submitted question',()=>{
  const data=require('./feedback-program-data.js');
  const three=data.detailForProgram(data.programById('s3'));
  const five=data.detailForProgram(data.programById('s4'));
  assert.equal(three.questions.length,3);
  assert.equal(five.questions.length,5);
  assert.equal(five.participants.find(p=>p.employee.id==='duc.pham').assignments[0].answers.length,5);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node H-05/h05.test.js`

Expected: FAIL because `detail.questions` and submitted `answers` do not exist.

- [ ] **Step 3: Write minimal implementation**

```js
const PROGRAM_QUESTIONS={
  s3:[{id:'q1',text:'…'},{id:'q2',text:'…'},{id:'q3',text:'…'}],
  s4:[{id:'q1',text:'…'},{id:'q2',text:'…'},{id:'q3',text:'…'},{id:'q4',text:'…'},{id:'q5',text:'…'}]
};
// submitted assignment: answers = questions.map(question => ({questionId:question.id,body:'…'}))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node H-05/h05.test.js`

Expected: PASS.

### Task 2: Render reviewer-centric multi-question feedback cards

**Files:**
- Modify: `H-06/index.html`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes `DETAIL.questions` and `assignment.answers`.
- Produces `renderQuestionPairs(assignment, questions)` and local expand state keyed by assignment id.

- [ ] **Step 1: Write the failing test**

```js
test('H-06 renders reviewer-centric question pairs and collapses answers after the first two',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(detail,/function renderQuestionPairs\(assignment,questions\)/);
  assert.match(detail,/assignment\.answers/);
  assert.match(detail,/Hiển thị thêm \$\{hidden\.length\} câu hỏi/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node H-05/h05.test.js`

Expected: FAIL because H-06 only renders `DETAIL.question` once and `assignment.body` once.

- [ ] **Step 3: Write minimal implementation**

```js
const EXPANDED_ASSIGNMENTS=new Set();
function renderQuestionPairs(assignment,questions){
  const pairs=questions.map(question=>({question,answer:(assignment.answers||[]).find(a=>a.questionId===question.id)}));
  const visible=EXPANDED_ASSIGNMENTS.has(assignment.id)?pairs:pairs.slice(0,2);
  return visible.map(pair=>responsePair(pair.question.text,pair.answer?.body||'')).join('');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node H-05/h05.test.js`

Expected: PASS with existing H-06 tests still green.

### Task 3: Lock tooltip direction and scroll parity with M-04

**Files:**
- Modify: `H-06/index.html`
- Modify: `design-system/index.html`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Uses `.pms-tooltip-top` for core value icons and identity tooltips in clipped panel contexts.
- Uses M-04’s native scrollbar behavior: no H-06 global `::-webkit-scrollbar` declaration.

- [ ] **Step 1: Write the failing test**

```js
test('H-06 uses M-04 upward tooltip placement for clipped content and no global scrollbar override',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(detail,/\.pms-tooltip-top\{top:auto;bottom:calc\(100% \+ 7px\)/);
  assert.match(detail,/pms-tooltip-content pms-tooltip-top/);
  assert.doesNotMatch(detail,/::\-webkit-scrollbar/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node H-05/h05.test.js`

Expected: FAIL because H-06 currently forces a global custom scrollbar and has no top-placement variant.

- [ ] **Step 3: Write minimal implementation**

```css
.pms-tooltip-top{top:auto;bottom:calc(100% + 7px)}
.pms-tooltip-top::after{top:100%;bottom:auto;border-bottom-color:transparent;border-top-color:var(--z900)}
```

Remove the H-06 generic scrollbar selector, apply `pms-tooltip-top` to core-value icons and the panel header identity, and document the placement rule in Design System.

- [ ] **Step 4: Run test to verify it passes**

Run: `node H-05/h05.test.js && node M-04/m04.test.js`

Expected: both suites PASS.

### Task 4: Visual regression audit

**Files:**
- Verify: `H-06/index.html?id=s3`
- Verify: `H-06/index.html?id=s4`

- [ ] **Step 1: Verify three-question rendering**

Confirm each submitted reviewer card shows two Q&A pairs and a compact expand control for the third pair.

- [ ] **Step 2: Verify five-question rendering**

Confirm each submitted reviewer card shows two Q&A pairs and a compact expand control for three remaining pairs.

- [ ] **Step 3: Verify tooltip and scrollbar boundaries**

Hover the panel identity and core-value icons. Tooltip opens upward, remains fully legible, and H-06’s horizontal/vertical scrollbar matches M-04.
