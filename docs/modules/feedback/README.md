# Module Feedback

## Màn hình

| Vai | Màn | File chính |
|---|---|---|
| Nhân viên | E-04 Phản hồi của tôi | `E-04/index.html`, `E-04/feedback-model.js`, `E-04/request-question-ai.js` |
| Quản lý | M-04 Phản hồi của đội nhóm | `M-04/index.html`, `M-04/feedback-detail.html`, `M-04/request-detail.html` |
| HR | H-05 Quản lý yêu cầu phản hồi | `H-05/index.html`, `H-05/create-campaign.html`, `H-05/questionnaire-library.html` |
| HR | H-06 Chi tiết chương trình phản hồi | `H-06/index.html` |
| HR | H-07 Báo cáo phản hồi | `H-07/index.html` |

## File dùng chung trong module (sửa một chỗ, ảnh hưởng nhiều màn)

| File | Được dùng bởi |
|---|---|
| `H-05/feedback-program-model.js`, `H-05/feedback-program-data.js` | E-04, M-04 (index, feedback-detail), H-05 (index, create-campaign), H-06, H-07 |
| `H-05/feedback-report-view.js` | E-04, M-04 (index, feedback-detail), H-07 |
| `M-04/manager-request-model.js` | E-04, M-04 (index, request-detail) |
| `M-04/manager-thanks.js` | E-04, M-04 (index, feedback-detail) |
| `H-05/questionnaire-library-*.js` | H-05 thư viện bộ câu hỏi, tạo yêu cầu |
| `assets/org-chain.js` | H-06 |

## Tài liệu

| File | Nội dung |
|---|---|
| `FEEDBACK_PLAN.md` | Kế hoạch và rule nghiệp vụ: vai trò, IA, danh sách màn, visibility, chu kỳ (§6b) |
| `UI-RULES.md` | Rule giao diện riêng Feedback, tách từ DS §19 (giữ số mục cũ) |
| `product/` | Tài liệu product: Building a Feedback Culture, 1-Page Alignment, Scope Cut & Rules Alignment |
| `reference/` | Mẫu xuất báo cáo (`Feedback-Export-Templates.xlsx`), popup mẫu `popup_fb_preview.html` |
| `history/` | Spec và plan triển khai theo ngày (08/2026). Chỉ để tra lịch sử, không phải rule hiện hành |
| `files/` | UAT template, wording song ngữ, mẫu xuất thư viện bộ câu hỏi, template module đã review, mẫu kết quả HR chia sẻ |

Tài liệu gốc liên quan: `docs/shared/PMS_PRD_v1.md` §9 (Module 7 – Phản hồi cá nhân).

## Test

- `E-04/feedback-model.test.js`, `M-04/m04.test.js`, `H-05/h05.test.js`, `H-05/result-sharing.test.js` (chạy bằng `npm test`).
- Một số test đọc thẳng nội dung `DESIGN-SYSTEM.md`, `COMPONENTS.md`, `UI-RULES.md`, `FEEDBACK_PLAN.md`. Đổi câu chữ rule thì chạy lại test.
- `demo-feedback-response-lifecycle/demo.test.js` chưa nằm trong `npm test`.

## Demo và tài liệu truyền thông

- `demo-delight/`: các demo hiệu ứng (tarot, sphere, AI coach).
- `demo-feedback-response-lifecycle/`: demo vòng đời phản hồi, có `REQUIREMENTS.md`.
- `feedback-pilot-email/`: email truyền thông pilot (23MB, đã chặn đọc).
- Tool: `tools/build_feedback_uat_template.py`, `tools/build_questionnaire_library_export.mjs` (xuất ra `files/`).

## Trạng thái rà soát

- [x] **Giai đoạn 2 (xong 27/09/2026):** đã đối chiếu 40 commit Feedback từ 07/09 đến 26/09. Nguyên tắc: code là bản đúng, tài liệu sửa theo code. Rule nghiệp vụ ghi vào `FEEDBACK_PLAN.md` (§4b đến §4g, từ ngữ đã chốt, trạng thái, phạm vi). Rule giao diện ghi vào `UI-RULES.md` (sửa 10, 15b, 15c; thêm 15d đến 15h, 19a đến 19c). Rule chung ghi vào `DESIGN-SYSTEM.md` (§19 rule 20 đến 23, bảng mã §20.2 thêm `hr-closed` và bản ngắn). Còn treo: chữ phụ dải ngày chu kỳ dùng `--z500` (trái DS §19 rule 6); bốn test `todo` về H-06 trong `H-05/h05.test.js`: hai test cho tính năng đã gỡ (khối "Cần nhắc", badge core value) và hai chỗ H-06 đang trái rule (`overviewStatus()` tự tính lại trạng thái, trái DS §20.1; nút nhắc gọn dùng `title=` thay cho `.pms-tooltip`).
- [ ] **Giai đoạn 3:** tokens `:root` của 5 màn Feedback đang lệch nhau và lệch với nhóm YER (E-04: 40 biến, H-05: 35, M-04: 21, H-06: 20, H-07: 18; nhóm YER: 51).
