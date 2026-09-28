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

- [x] **Giai đoạn 2 (xong 27/09/2026):** đã đối chiếu 12 commit YER với YER-SPEC. Chị chốt 13 chỗ code và spec lệch nhau: 5 chỗ sửa spec theo code (thứ tự danh sách M-05, khoảng cách 26px của dải quy trình, tourguide chỉ chạy khi bấm mascot, dòng giữa năm ở M-06 không nêu người chấm, nhãn `Đang hoạt động` của tab Giữa năm theo MYR-09a), 8 chỗ sửa code theo spec (QLTT chấm được hồ sơ không tự đánh giá tới hết hạn QLTT, nhãn `Không đánh giá` khi hết hạn bổ sung, luồng LM2 trả về có trạng thái và hạn 24 giờ, validation của QLTT, box hết hạn nộp trễ, M-06 có dải quy trình, nhóm mục tiêu trống, popup chi tiết và nhãn tab chung với M-05). Rule có trong code mà chưa ghi đã bổ sung vào §18.4, §24, §27, §39.3, §43, §44, §47, §48; phần lỗi thời ở §5, §11, §12, §16, §21, §22, §35, §45, §46 đã dọn. Đã xóa `docs/shared/PMS_Screen_Inventory_v1.md`, quy tắc xem điểm chuyển vào §7. Business rules còn thay đổi trong lúc dựng, sẽ cập nhật tiếp.
- [x] **Góp ý E-05 (27/09/2026):** nhãn tab theo giai đoạn của kỳ, nhãn tab Mục tiêu theo việc cần làm (§18.4); ô `Chọn điểm 1-5` (§41.1); nhóm nút Lưu nháp và Gửi nổi khi cuộn (§49); bỏ câu không có kết quả giữa năm (§40.5c); thiếu mục tiêu vẫn lưu nháp, không gửi được (§5); nhân viên chỉnh sửa bản đã gửi tới hết hạn, có lịch sử chỉnh sửa (§8); thanh demo của E-05 còn bảy tình huống (§46).
- [x] **Góp ý E-05 đợt 3 (28/09/2026):** màn quá hạn giữ bố cục thường, các ô khóa, khối thông báo lần nhắc đang mở rồi xác nhận mới mở popup nộp bổ sung; hạn chấm QLTT riêng cho hồ sơ nộp bổ sung (3 ngày làm việc từ ngày nộp); banner nộp trễ một nhãn và dòng hình thức xử lý, không có lịch sử chỉnh sửa; ô QLTT có `Điểm toàn diện: - Chưa công bố`; bớt viền khối cuối trang; 16 tình huống Nhân viên, bỏ nhóm `Hồ sơ khác` (§6, §8.2, §27.1, §27.3, §40.5a, §42, §44.1, §46).
- [x] **Góp ý E-05 đợt 2 (27/09/2026):** bốn lần nhắc nộp bổ sung, đếm ngày làm việc, xác nhận đã đọc, khối nộp trễ sau khi gửi (§27.3); nhân viên đọc nhận xét Quản lý cấp 2 và Trưởng đơn vị (§7); tab `Danh sách mục tiêu` và nhãn xanh (§18.4); câu chữ cảnh báo thiếu mục tiêu, lưu nháp, thai sản, chỉnh sửa (§5, §8.1, §40.5); lịch sử chỉnh sửa theo lần gửi (§8.2); 11 tình huống Nhân viên và ghi chú `Hồ sơ khác` (§44.1, §46).
- [x] **Giai đoạn 3 (xong 27/09/2026):** tokens gộp vào `assets/tokens.css`, mọi màn nạp file này và chỉ giữ biến bố cục riêng; `assets/tokens.test.js` chặn khai lại token, tên biến riêng, icon không có trong Boxicons 2.1.4 và middot. Quyết định chung ghi ở `DESIGN-SYSTEM.md` §2, §19 rule 1, 6, 20, 24, 25. Các màu hồng, cam, xanh tự chế trong `yer-ui.js`, `yer-employee.js`, `yer-manager-detail.js` quy về token. Trang demo mascot và thanh demo `yer-demo.js` nằm ngoài phạm vi DS.
