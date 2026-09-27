# Module Thiết lập mục tiêu (Goal setting)

## Màn hình

Tab Mục tiêu nằm chung file với tab Giữa năm (và Cuối năm), nên khi sửa chỉ đọc đúng panel `#mpanel-goals`.

| Vai | Màn | Vị trí |
|---|---|---|
| Nhân viên | E-05 (màn vào chính) | `E-05/index.html` `#mpanel-goals` |
| Quản lý | M-05 danh sách nhân viên, chu kỳ Mục tiêu `switchCycleTab(0)` (tab `tab-lm1`, `tab-indirect`, `tab-lm2`, `tab-hod`), hàm `renderGoals`. Deep link `M-05/index.html?tab=goals` | `M-05/index.html` `#cy-panel-0` |
| Quản lý | M-01b Chi tiết mục tiêu (mở từ M-05) | `M-01b/index.html` |
| Quản lý | M-06 Chi tiết đánh giá của nhân viên | `M-06/index.html` `#mpanel-goals` |

## Lịch sử gộp màn (27/09/2026)

Bộ cũ E-01, M-01 (bản sao trước khi có tab Cuối năm) đã được gộp vào E-05, M-05. Mọi link đã trỏ sang bộ mới.

## Tài liệu

- `GOAL-SPEC.md`: rule Goal setting. Chị đã duyệt ngày 27/09/2026, §12 là 8 điểm đã chốt.

Nguồn gốc đã trích vào GOAL-SPEC:
- `PMS_Screen_Spec_GoalSetting_v1.md` (spec màn Goal v1): **đã xóa** 27/09/2026 sau khi trích vào GOAL-SPEC.
- `docs/shared/PMS_PRD_v1.md` §4 (Module 2 – Thiết lập mục tiêu), §11 (Business rules).
- `docs/shared/Diagram svg/pm_diagram2_flow1_flow2.svg`.

## Trạng thái rà soát

- [x] **Giai đoạn 2:** trích rule thành `GOAL-SPEC.md`, chị duyệt 27/09/2026, đã xóa spec v1.
- [x] **Giai đoạn 3 (xong 27/09/2026):** tokens gộp vào `assets/tokens.css`, mọi màn nạp file này và chỉ giữ biến bố cục riêng; `assets/tokens.test.js` chặn khai lại token, tên biến riêng, icon không có trong Boxicons 2.1.4 và middot. Quyết định chung ghi ở `DESIGN-SYSTEM.md` §2, §19 rule 1, 6, 20, 24, 25. E-05, M-05, M-06, M-01b dùng chung tokens; bảng M-05 bỏ `overflow:hidden` (rule 25); màu phân loại `--what`, `--dev` được giữ.
