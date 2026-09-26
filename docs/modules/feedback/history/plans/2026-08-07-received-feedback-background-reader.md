# Received Feedback Background Reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mở phản hồi chưa đọc trong popup có background người gửi chọn, rồi chuyển card về trạng thái đã đọc trung tính khi popup đóng.

**Architecture:** Mở rộng feedback record bằng `backgroundId`, tái sử dụng `GIVE_BGS` làm registry style và giữ `opened` trong `FB_STATE`. Một reader dialog độc lập render metadata, câu hỏi và content canvas; mọi close path đi qua `closeReceivedReader()` để đánh dấu đã đọc và render lại feed.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Không commit hoặc push cho tới khi người dùng confirm UI.
- Background chỉ xuất hiện trong content canvas của popup đọc.
- Card đã đọc trong feed luôn dùng nền trắng trung tính.
- Read state chỉ tồn tại trong memory của phiên demo, không dùng localStorage.
- Click overlay và dấu đóng đều đánh dấu phản hồi là đã đọc.

---

### Task 1: Persist background identity in feedback records

**Files:**
- Modify: `E-04/feedback-model.js`
- Modify: `E-04/index.html`
- Test: `E-04/feedback-model.test.js`

**Interfaces:**
- Consumes: `G.bg: string|null`, `FeedbackModel.createGivenResponse(input)`.
- Produces: `feedback.backgroundId: string|null`.

- [ ] **Step 1: Write a failing model test**

Assert that `createGivenResponse({backgroundId:'hearts'})` returns the same `backgroundId`, and missing input returns `null`.

- [ ] **Step 2: Run the test and confirm RED**

Run: `node E-04/feedback-model.test.js`

- [ ] **Step 3: Implement the field and pass it from sendGive**

Add `backgroundId: input.backgroundId || null` to the canonical response and pass `backgroundId:G.bg` in `sendGive()`.

- [ ] **Step 4: Add representative seed backgrounds**

Set `rcv-2.backgroundId='hearts'` and `rcv-3.backgroundId='firework'`; leave read records and one no-background path neutral.

- [ ] **Step 5: Run tests and confirm GREEN**

Run: `node E-04/feedback-model.test.js`

### Task 2: Add a dedicated received-feedback reader dialog

**Files:**
- Modify: `E-04/index.html`
- Test: `E-04/feedback-model.test.js`

**Interfaces:**
- Consumes: `findFb(id)`, `fbState(f)`, `GIVE_BGS`, `cardMeta()`, `badgeImgs()`.
- Produces: `openReceivedReader(id)`, `closeReceivedReader()`, `renderReceivedReader(f)`.

- [ ] **Step 1: Write failing UI-contract tests**

Assert reader markup exists, background resolver uses `backgroundId`, sealed card calls `openReceivedReader`, and both overlay/close button call `closeReceivedReader`.

- [ ] **Step 2: Run the test and confirm RED**

Run: `node E-04/feedback-model.test.js`

- [ ] **Step 3: Add popup markup and restrained styling**

Create a neutral dialog header and identity block, existing pink question block, and `.reader-content-canvas` whose style comes from the selected registry entry. Add neutral fallback canvas and `prefers-reduced-motion` behavior.

- [ ] **Step 4: Implement open without changing read state**

`openReceivedReader(id)` stores the active id, renders the popup, opens the overlay and focuses the close control. It must not modify `FB_STATE[id].opened`.

- [ ] **Step 5: Implement one close path for overlay and X**

`closeReceivedReader()` sets `opened=true`, closes the overlay, clears active id, calls `renderFeed()`, `renderRail()` and `updateUnreadLabel()`.

- [ ] **Step 6: Replace inline envelope opening**

Update click and keyboard handlers in `cardSealed()` to call `openReceivedReader(id)`. Remove the obsolete inline envelope-to-card animation code while retaining subtle popup motion.

- [ ] **Step 7: Run tests and confirm GREEN**

Run: `node E-04/feedback-model.test.js`

### Task 3: Verify interaction and regression safety

**Files:**
- Modify: `E-04/feedback-model.test.js`
- Verify: `E-04/index.html`

**Interfaces:**
- Consumes: completed reader flow.
- Produces: verified local prototype ready for user review.

- [ ] **Step 1: Add session-only and feed-neutral assertions**

Assert read state remains in `FB_STATE`, no read receipt uses localStorage, and `cardReceived()` does not render `backgroundId` or background style.

- [ ] **Step 2: Run the complete E-04 tests**

Run: `node E-04/feedback-model.test.js`

- [ ] **Step 3: Parse inline JavaScript**

Run a Node `vm.Script` parse over inline scripts in `E-04/index.html`.

- [ ] **Step 4: Check whitespace and scope**

Run: `git diff --check` and `git status --short`. Preserve unrelated `demo-delight/feedback-ai-coach-demo.html`.

- [ ] **Step 5: Stop for user review**

Do not stage, commit or push. Report test evidence and ask the user to review the UI.
