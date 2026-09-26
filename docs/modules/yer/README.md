# Module Đánh giá cuối năm (YER)

## Màn hình

| Vai | Màn | File chính |
|---|---|---|
| Nhân viên | E-05 Đánh giá cuối năm (tab `#mpanel-yer`) | `E-05/index.html`, `assets/yer-employee.js` |
| Quản lý | M-05 Đánh giá cuối năm nhân viên (danh sách) | `M-05/index.html`, `assets/yer-manager.js` |
| Quản lý | M-06 Chi tiết đánh giá của nhân viên (tab `#mpanel-yer`) | `M-06/index.html`, `assets/yer-manager-detail.js` |
| Demo | Bảng điều hướng tình huống, mascot tour, quá hạn tự đánh giá | `YER-demo/` |

E-05 và M-06 còn chứa tab Mục tiêu và Giữa năm. Xem README của `goal-setting` và `myr`.

## File dùng chung trong module

`assets/yer-model.js` (mọi rule trong YER-SPEC tính ở đây, màn chỉ render), `yer-data.js`, `yer-store.js`, `yer-ui.js`, `yer-i18n.js`, `yer-demo.js`. Được E-05, M-05, M-06 dùng chung.

## Tài liệu

| File | Nội dung |
|---|---|
| `YER-SPEC.md` | Spec YER 2026. Phần I: rule gốc (§1 đến §24). Phần II: Enhancement 2H2026 (§25 trở đi). 80KB, Grep `^## ` để lấy mục lục rồi đọc đúng mục |
| `YER Enhancement 2H2026.docx` | Nguồn của Phần II trong YER-SPEC |

Tài liệu gốc liên quan: `docs/shared/PMS_PRD_v1.md` §6, `docs/shared/PM Process.md`, `docs/shared/Diagram svg/pm_diagram4_flow4_yer.svg`.

## Test

`YER-demo/yer-enhancements.test.js` (chạy bằng `npm run test:yer`).

## Trạng thái rà soát

- [ ] **Giai đoạn 2:** đối chiếu commit với YER-SPEC (đang được cập nhật thường xuyên, dự kiến ít thiếu).
- [ ] **Giai đoạn 3:** kiểm tra tuân thủ DS.
