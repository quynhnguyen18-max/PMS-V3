# H-05 Foundation and UI Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuẩn hóa H-05 theo Feedback Design System, tách business rule thành model có test và sửa khả năng lưu/mở lại draft trước khi dựng màn chi tiết chương trình.

**Architecture:** Tạo UMD model thuần JavaScript cho scope, assignment, validation, lifecycle, filter và draft normalization. Hai HTML chỉ giữ state/rendering, gọi model cho mọi rule. UI dùng các layout invariant có test contract để ngăn font và căn cột tiếp tục lệch.

**Tech Stack:** HTML/CSS/vanilla JavaScript, UMD, Node `node:test`, Node `assert`.

## Global Constraints

- Chỉ làm trên local; không commit hoặc push.
- Không dựng màn chi tiết chương trình hoặc report.
- Question type chuẩn là `open_text`; dữ liệu `open` cũ phải migrate.
- Public Sans và type scale phải đồng bộ E-04/M-04.
- Header và row của list dùng cùng column template; panel tổng quan dùng grid cố định.
- Không làm thay đổi hành vi E-04/M-04.

---

### Task 1: Tạo H-05 model và business-rule tests

**Files:**
- Create: `H-05/feedback-program-model.js`
- Create: `H-05/h05.test.js`

**Interfaces:**
- Produces: `FeedbackProgramModel.normalizeQuestion`, `normalizeCampaign`, `participantPool`, `reviewerPool`, `buildAssignments`, `validateLaunch`, `campaignViewState`, `isDueSoon`, `needsReport`, `matchesFilter`, `sortCampaigns`.

- [ ] **Step 1: Viết failing tests cho normalization, scope và assignments**

Test `open -> open_text`, HRBP theo division, L&OD loại HR, reviewer toàn công ty và assignment không trùng/self-assessment riêng.

- [ ] **Step 2: Chạy `node H-05/h05.test.js` và xác nhận FAIL do chưa có model**

- [ ] **Step 3: Implement tối thiểu các hàm normalization, scope và assignment**

- [ ] **Step 4: Chạy test và xác nhận nhóm test đầu PASS**

- [ ] **Step 5: Viết failing tests cho launch validation và lifecycle/filter**

Validation phải trả mã lỗi cho `goal`, `due`, `participants`, `reviewers`, `questions`; lifecycle phải phân biệt draft/collecting/overdue/closed, due-soon 3 ngày và closed chờ report.

- [ ] **Step 6: Chạy test và xác nhận FAIL đúng nguyên nhân**

- [ ] **Step 7: Implement tối thiểu validation, lifecycle, filter và sorting**

- [ ] **Step 8: Chạy toàn bộ `node H-05/h05.test.js` và xác nhận PASS**

---

### Task 2: Tích hợp model và draft round-trip vào wizard

**Files:**
- Modify: `H-05/create-campaign.html`
- Modify: `H-05/index.html`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Consumes: toàn bộ API Task 1.
- Produces: draft payload đủ dữ liệu và route `create-campaign.html?id=<campaignId>`.

- [ ] **Step 1: Viết failing UI contract tests**

Kiểm tra hai HTML load model, wizard dùng `open_text`, launch gọi `validateLaunch`, draft lưu participants/reviewers/questions/settings và danh sách truyền đúng ID.

- [ ] **Step 2: Chạy test và xác nhận FAIL**

- [ ] **Step 3: Load model trong hai HTML và thay rule nội tuyến bằng model**

- [ ] **Step 4: Chuẩn hóa payload lưu draft/launch và hydrate draft theo query ID**

- [ ] **Step 5: Dọn inconsistency wizard**

Bỏ wording/CSS scenario, bắt buộc due và câu hỏi, gọi template là bộ câu hỏi, thay `open` bằng `open_text`.

- [ ] **Step 6: Chạy `node H-05/h05.test.js` và xác nhận PASS**

---

### Task 3: Sửa panel tổng quan và typography contract

**Files:**
- Modify: `H-05/index.html`
- Modify: `H-05/create-campaign.html`
- Modify: `design-system/index.html`
- Test: `H-05/h05.test.js`

**Interfaces:**
- Produces: `.summary-row` grid chung, `--program-columns` dùng chung cho header/row và H-05 type scale chuẩn.

- [ ] **Step 1: Viết failing UI contract tests**

Kiểm tra page title 18px, description 12.5px, summary grid `minmax(0,1fr) 28px`, số căn phải/tabular, header-row cùng `--program-columns`, `align-items:start`.

- [ ] **Step 2: Chạy test và xác nhận FAIL**

- [ ] **Step 3: Sửa CSS panel tổng quan và bảng danh sách**

- [ ] **Step 4: Audit và chuẩn hóa toàn bộ font-size/weight ở hai màn H-05**

- [ ] **Step 5: Bổ sung Design System guardrail ngắn gọn cho type scale và shared geometry**

- [ ] **Step 6: Chạy `node H-05/h05.test.js` và xác nhận PASS**

---

### Task 4: Regression verification

**Files:**
- Verify only.

- [ ] **Step 1: Chạy `node H-05/h05.test.js`**

- [ ] **Step 2: Chạy `node E-04/feedback-model.test.js`**

- [ ] **Step 3: Chạy `node M-04/m04.test.js`**

- [ ] **Step 4: Chạy `git diff --check`**

- [ ] **Step 5: Kiểm tra `git diff --stat` và xác nhận không có file ngoài phạm vi bị sửa**
