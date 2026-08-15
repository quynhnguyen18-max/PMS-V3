# H-05 Program Progress and Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gộp tiến độ và trạng thái chương trình thành một semantic status cell dễ quét, đồng bộ wording và tooltip, đồng thời chuyển H-05 sang page-shell toàn chiều rộng để loại bỏ overflow.

**Architecture:** Giữ data model hiện tại và thay đổi presentation contract trong `H-05/index.html`. Renderer tạo một `progressStatusBlock(c)` duy nhất cho từng chương trình; CSS dùng page-shell full width và grid bốn cột có khả năng co. Các hợp đồng UI được khóa bằng static contract tests trong `H-05/h05.test.js`.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Dùng `đã trả lời`, không dùng `đã phản hồi` trong semantic status chip.
- Tooltip phạm vi dùng `người nhận phản hồi`.
- Không thêm chart cho từng hàng.
- `Hoàn thành` chỉ áp dụng khi số đã trả lời bằng tổng số; ticket đóng chưa đủ dùng `Đã đóng` trung tính.
- Desktop page-shell dùng toàn chiều rộng và padding 24px, consistent với M-04.
- Không commit hoặc push.

---

### Task 1: Lock the four-column and semantic status contract

**Files:**
- Modify: `H-05/h05.test.js`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: rendered source of `H-05/index.html`.
- Produces: contract assertions for four-column layout, copy, status variants and tooltip.

- [x] **Step 1: Write failing contract tests**

Add assertions that require:

```js
assert.match(index,/--program-columns:minmax\(0,/);
assert.match(index,/Tiến độ &amp; thời hạn/);
assert.doesNotMatch(index,/<span>Tiến độ<\/span><span>Trạng thái<\/span>/);
assert.match(index,/đã trả lời/);
assert.match(index,/Người nhận phản hồi/);
assert.match(index,/progressStatusBlock/);
assert.match(index,/Đã đóng:/);
assert.match(index,/Hoàn thành:/);
```

- [x] **Step 2: Run test to verify RED**

Run: `node --test H-05/h05.test.js`

Expected: FAIL because the existing UI still has five columns, old labels and split renderers.

### Task 2: Implement semantic progress/status rendering

**Files:**
- Modify: `H-05/index.html`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: campaign object with `status`, `done`, `total`, `due` and `report`.
- Produces: `progressStatusBlock(c): string` containing one semantic chip plus optional metadata.

- [x] **Step 1: Replace the split renderers**

Implement `progressStatusBlock(c)` with these outputs:

```text
Nháp
Đang thu thập: n/total đã trả lời
Quá hạn: n/total đã trả lời
Hoàn thành: n/total đã trả lời
Đã đóng: n/total đã trả lời
```

Use yellow, red, green and neutral variants respectively. Render only one concise metadata line underneath.

- [x] **Step 2: Update header and row markup**

Render only:

```html
<span>Chương trình</span>
<span>Phạm vi</span>
<span>Tiến độ &amp; thời hạn</span>
<span></span>
```

Replace separate progress and status cells with one call to `progressStatusBlock(c)`.

- [x] **Step 3: Update scope tooltip copy**

Change the participant tooltip to `Người nhận phản hồi`.

- [x] **Step 4: Run H-05 tests to verify GREEN for rendering**

Run: `node --test H-05/h05.test.js`

Expected: semantic rendering assertions pass; layout assertions may remain RED until Task 3.

### Task 3: Implement full-width page-shell and overflow-safe grid

**Files:**
- Modify: `H-05/index.html`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: four-cell row markup from Task 2.
- Produces: responsive list + right overview panel without overlap.

- [x] **Step 1: Replace fixed container geometry**

Change `.wrap` from `max-width:1080px;margin:0 auto` to a full-width page-shell with desktop `padding:24px` and no max-width.

- [x] **Step 2: Define four-column grid**

Use an overflow-safe grid equivalent to:

```css
--program-columns:minmax(0,2fr) minmax(0,.9fr) minmax(210px,1.15fr) 24px;
.board-head,.row{gap:16px}
.board-head>* ,.row>*{min-width:0}
```

Allow program/scope text to wrap and cap status chip width at 100%.

- [x] **Step 3: Add responsive panel breakpoint**

At the point where the list can no longer preserve readable columns, stack the overview panel below or above the list rather than allowing horizontal overlap.

- [x] **Step 4: Run H-05 tests**

Run: `node --test H-05/h05.test.js`

Expected: all H-05 tests PASS.

### Task 4: Regression and static verification

**Files:**
- Verify: `H-05/index.html`
- Verify: `H-05/h05.test.js`
- Verify: `E-04/e04.test.js`
- Verify: `M-04/m04.test.js`

**Interfaces:**
- Consumes: completed H-05 implementation.
- Produces: evidence that H-05 and adjacent Feedback module screens remain valid.

- [x] **Step 1: Run all relevant suites**

Run:

```powershell
node H-05/h05.test.js
node E-04/feedback-model.test.js
node M-04/m04.test.js
```

Expected: all suites PASS.

- [x] **Step 2: Validate inline JavaScript and whitespace**

Run: `git diff --check`

Expected: no output and exit code 0.

- [x] **Step 3: Inspect final diff**

Run: `git diff -- H-05/index.html H-05/h05.test.js docs/superpowers/specs/2026-08-12-h05-program-progress-layout-design.md docs/superpowers/plans/2026-08-12-h05-program-progress-layout.md`

Expected: only approved progress/status, tooltip, page-shell, tests and documentation changes are present.
