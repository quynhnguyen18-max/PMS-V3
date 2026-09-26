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

Chưa có spec riêng trong repo. Nguồn hiện có:
- `docs/shared/PMS_Screen_Spec_GoalSetting_v1.md`: spec màn Goal v1. **Mã màn hình trong file này là mã cũ** (ví dụ E-04, E-05 ở đó là "Chi tiết mục tiêu"), không khớp mã hiện tại.
- `docs/shared/PMS_PRD_v1.md` §4 (Module 2 – Thiết lập mục tiêu), §11 (Business rules).
- `docs/shared/Diagram svg/pm_diagram2_flow1_flow2.svg`.

## Trạng thái rà soát

- [ ] **Giai đoạn 2:** trích rule từ commit (lịch sử E-01, M-01, cùng M-01b, M-05, E-05, M-06) và spec v1 thành `GOAL-SPEC.md` trong folder này. Xong thì xóa `PMS_Screen_Spec_GoalSetting_v1.md`.
- [ ] **Giai đoạn 3:** kiểm tra tuân thủ DS (M-05 đang dùng một bộ tokens khác E-05, M-06).
