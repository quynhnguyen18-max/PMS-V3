# Feedback Request Priority Sorting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sắp xếp “Yêu cầu đã tạo” theo khả năng hỗ trợ theo dõi và ra quyết định, nhất quán giữa màn hình nhân viên, quản lý, danh sách và Kanban.

**Architecture:** Mỗi màn hình có một comparator thuần dựa trên lifecycle hiện có. UI chỉ nhận danh sách đã sắp xếp; Kanban giữ nguyên thứ tự đó khi chia lane để tránh hai rule khác nhau.

**Tech Stack:** Vanilla JavaScript, single-file HTML prototype, Node test runner.

## Global Constraints

- Thứ tự nhóm: Quá hạn → Đang thu thập → Hoàn thành → Không phản hồi.
- Quá hạn: hạn cũ nhất trước.
- Đang thu thập: hạn gần nhất, tỷ lệ trả lời thấp hơn, ngày tạo cũ hơn.
- Hoàn thành: phản hồi/cập nhật mới nhất trước.
- Không phản hồi: ngày đóng gần nhất trước.
- Không thêm UI hoặc bộ lọc mới; chưa commit khi chưa có yêu cầu.

---

### Task 1: Manager request comparator

**Files:**
- Modify: `M-04/manager-request-model.js`
- Modify: `M-04/index.html`
- Test: `M-04/m04.test.js`

- [x] Viết test đỏ cho `sortRequestsForAction(requests, today)` và các tie-breaker.
- [x] Export comparator từ manager model.
- [x] Cho list và Kanban dùng cùng danh sách đã sắp xếp.
- [x] Chạy `node M-04/m04.test.js`.

### Task 2: Employee request comparator

**Files:**
- Modify: `E-04/index.html`
- Test: `E-04/feedback-model.test.js`

- [x] Viết test đỏ cho thứ tự request trong tab “Yêu cầu của tôi”.
- [x] Thêm comparator tương đương dựa trên schema FEED.
- [x] Chỉ áp dụng comparator cho request; giữ nguyên thứ tự các tab khác.
- [x] Chạy `node E-04/feedback-model.test.js`.

### Task 3: Regression verification

**Files:**
- Verify only.

- [x] Chạy cả hai test suite.
- [x] Chạy `git diff --check` và rà phạm vi diff.
