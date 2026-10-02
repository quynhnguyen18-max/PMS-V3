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
| `H-05/feedback-program-model.js`, `H-05/feedback-program-data.js` | E-04, M-04 (index, feedback-detail), H-05 (index, create-campaign), H-06, H-07, M-06 |
| `H-05/feedback-report-view.js` | E-04, M-04 (index, feedback-detail), H-07, M-06 |
| `M-04/manager-request-model.js` | E-04, M-04 (index, request-detail) |
| `M-04/manager-thanks.js` | E-04, M-04 (index, feedback-detail), M-06 |
| `M-04/manager-feedback-data.js`, `M-04/manager-ai-summary.js` | M-04 (index, feedback-detail), M-06 |
| `M-04/manager-feedback-dialog.js` | M-06 (nút `Phản hồi đã nhận` của tab Giữa năm và Cuối năm). Dựng lại popup `#feedbackDialog` của M-04, CSS chỉ áp trong `#mgrFbDialog`. Sửa popup ở M-04 thì sửa cả file này |
| `H-05/questionnaire-library-*.js` | H-05 thư viện bộ câu hỏi, tạo yêu cầu |
| `assets/org-chain.js` | H-06 |

## Tài liệu

| File | Nội dung |
|---|---|
| `FEEDBACK_PLAN.md` | Kế hoạch và rule nghiệp vụ: vai trò, IA, danh sách màn, visibility, chu kỳ (§6b) |
| `UI-RULES.md` | Rule giao diện riêng Feedback, tách từ DS §19 (giữ số mục cũ) |
| `product/` | Tài liệu product: Building a Feedback Culture, 1-Page Alignment, Scope Cut & Rules Alignment |
| `reference/` | Mẫu xuất báo cáo (`Feedback-Export-Templates.xlsx`), popup mẫu `popup_fb_preview.html` |
| `files/` | UAT template, wording song ngữ, mẫu xuất thư viện bộ câu hỏi, template module đã review, mẫu kết quả HR chia sẻ |

Tài liệu gốc liên quan: `docs/shared/PMS_PRD_v1.md` §9 (Module 7 – Phản hồi cá nhân).

## Test

- `E-04/feedback-model.test.js`, `M-04/m04.test.js`, `H-05/h05.test.js`, `H-05/result-sharing.test.js` (chạy bằng `npm test`).
- Một số test đọc thẳng nội dung `DESIGN-SYSTEM.md`, `COMPONENTS.md`, `UI-RULES.md`, `FEEDBACK_PLAN.md`. Đổi câu chữ rule thì chạy lại test.
- `demo-feedback-response-lifecycle/demo.test.js` chưa nằm trong `npm test`.

## Demo và tài liệu truyền thông

- `demo-delight/`: các demo hiệu ứng (tarot, sphere, AI coach).
- `demo-feedback-response-lifecycle/`: demo vòng đời phản hồi, có `REQUIREMENTS.md`.
- Email truyền thông pilot đã chuyển ra folder cha (`../feedback-pilot-email/`) để lưu trữ, không nằm trong repo.
- Tool: `tools/build_feedback_uat_template.py`, `tools/build_questionnaire_library_export.mjs` (xuất ra `files/`).

## Trạng thái rà soát

- [x] **Giai đoạn 2 (xong 27/09/2026):** đã đối chiếu 40 commit Feedback từ 07/09 đến 26/09. Nguyên tắc: code là bản đúng, tài liệu sửa theo code. Rule nghiệp vụ ghi vào `FEEDBACK_PLAN.md` (§4b đến §4g, từ ngữ đã chốt, trạng thái, phạm vi). Rule giao diện ghi vào `UI-RULES.md` (sửa 10, 15b, 15c; thêm 15d đến 15h, 19a đến 19c). Rule chung ghi vào `DESIGN-SYSTEM.md` (§19 rule 20 đến 23, bảng mã §20.2 thêm `hr-closed` và bản ngắn). Còn treo: chữ phụ dải ngày chu kỳ dùng `--z500` (trái DS §19 rule 6); bốn test `todo` về H-06 trong `H-05/h05.test.js`: hai test cho tính năng đã gỡ (khối "Cần nhắc", badge core value) và hai chỗ H-06 đang trái rule (`overviewStatus()` tự tính lại trạng thái, trái DS §20.1; nút nhắc gọn dùng `title=` thay cho `.pms-tooltip`).
- [x] **Giai đoạn 3 (xong 27/09/2026):** tokens gộp vào `assets/tokens.css`, mọi màn nạp file này và chỉ giữ biến bố cục riêng; `assets/tokens.test.js` chặn khai lại token, tên biến riêng, icon không có trong Boxicons 2.1.4 và middot. Quyết định chung ghi ở `DESIGN-SYSTEM.md` §2, §19 rule 1, 6, 20, 24, 25. Riêng Feedback: màu trạng thái tự chế ở M-04, H-05, H-06, H-07, `request-detail` quy về `--warn`, `--err`, `--ok` (vàng nay là `#d97706` theo COMPONENTS §8.2); `create-campaign` bỏ hồng `#b0006d`, bo góc 9px và màu chàm `--template`; AI Summary dùng mascot thay `bx-sparkles`; E-04 dùng `bxs-magic-wand` thay `bx-magic`, bỏ middot trong giờ trả lời (model nhận cả ` - ` và `·` cũ). Hoạ tiết thư, thiệp của E-04 là ngoại lệ màu.
