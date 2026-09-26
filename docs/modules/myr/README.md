# Module Đánh giá giữa năm (MYR)

## Màn hình

Tab Giữa năm nằm chung file với tab Mục tiêu (và Cuối năm), nên khi sửa chỉ đọc đúng panel `#mpanel-myr`.

| Vai | Màn | Vị trí |
|---|---|---|
| Nhân viên | E-05 (màn vào chính) | `E-05/index.html` `#mpanel-myr` |
| Quản lý | M-05 danh sách, chu kỳ Giữa năm `switchCycleTab(1)`, các hàm `renderMyr*`, `myrDetailUrl`. Deep link `M-05/index.html?tab=myr&myrRole=lm1` | `M-05/index.html` `#cy-panel-1` |
| Quản lý | M-06 Chi tiết đánh giá, tab Giữa năm. Mở từ danh sách MYR của M-05 bằng `tab=myr` (cả trang và khung nhúng `embed=1`) | `M-06/index.html` `#mpanel-myr` |

Kết quả MYR mẫu dạng PDF: `assets/myr-results/` (sinh bằng `tools/generate_myr_pdfs.py`, đã chặn đọc).

## Lưu ý

- Bộ cũ E-01, M-01 đã được gộp vào E-05, M-05 (27/09/2026).
- **Vai MYR truyền bằng tham số `myrRole`, không dùng `role`.** Thanh demo YER (`assets/yer-demo.js`) đọc `role` và `emp` trên URL rồi ghi vào phiên YER, nên `role=lm1` sẽ làm hỏng luồng Cuối năm.
- **M-02 đã gộp vào M-06 (27/09/2026).** M-02 là bản cũ của tab Giữa năm trong M-06, đã xóa. Tham số URL xem `MYR-SPEC.md` §10.

## Tài liệu

- `MYR-SPEC.md`: rule MYR. Chị đã duyệt ngày 27/09/2026. §2a là luật tách màn MYR khỏi thanh demo YER.

Nguồn gốc đã trích vào MYR-SPEC:
- `docs/shared/PMS_PRD_v1.md` §5 (Module 3 – Mid-Year Review).
- `docs/shared/PM Process.md`.
- `docs/shared/Diagram svg/pm_diagram3_flow3_myr.svg`.
- Rule MYR đang nằm rải trong YER-SPEC: §11 Mid-Year Snapshot, §18.2 (tab Giữa năm: hai lý do "không có kết quả"), §18.3 (kết quả giữa năm khi đổi quản lý).

## Trạng thái rà soát

- [x] **Giai đoạn 2:** trích rule thành `MYR-SPEC.md`, gộp M-02 vào M-06, chị duyệt 27/09/2026.
- [ ] **Giai đoạn 3:** kiểm tra tuân thủ DS.
