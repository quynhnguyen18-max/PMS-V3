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
- [x] **Góp ý E-05 đợt 4 (28/09/2026):** nhãn tab `Cần hoàn tất` (§18.4); khối thiếu mục tiêu đổi câu, bỏ nút riêng (§40.5a); câu thai sản (§40.5b); lịch sử chỉnh sửa theo thẻ từng lần gửi, không ghi domain nhân viên (§8.2); popup thiếu thông tin liệt kê theo khối và viền đỏ ô thiếu (§41.1); popup xác nhận gửi hai gạch đầu dòng, gửi xong cuộn tới banner (§8.1); nút tải xuống chọn PDF hoặc Excel, bỏ dòng `Chưa công bố`, domain ở ô các cấp quản lý (§42); khối quá hạn bỏ ngoặc, hai bước đánh số để nộp bổ sung, câu chữ lần 1, 3, 4, lần 4 không còn giới hạn điểm 3 (§27.1, §27.3); QLTT không đánh giá trong timeline Tự đánh giá (§2). Thêm tình huống `nv21`: thiếu mục tiêu mà hết hạn nộp bổ sung dùng khối vàng như `nv20`, đúng §27.1 (trước đó code dựng nhầm khối hồng), câu chữ nói quy trình dừng và không có điểm (§40.5a, §46). Lịch sử chỉnh sửa: điểm mục tiêu ghi rõ nhóm công việc hay phát triển, bỏ `Đã thay bằng lần gửi`, lần gửi đầu không có phần nội dung, thao tác sau khi gửi viết thành câu, lần gửi nào cũng có giờ kể cả hồ sơ chỉ gửi một lần (§8.2).
- [x] **Góp ý màn Quản lý, cụm A (30/09/2026):** thứ tự danh sách theo việc cần làm, luật ở `managerRosterRank` (§47); màu trạng thái theo tab Giữa năm, bỏ tông đỏ (§47); QLTT và LM2 xem điểm và nhận xét của cấp trên kèm domain (§7, §48); hạn đánh giá và chỉnh sửa của từng vai từ `managerEditWindow`, gồm info box QLTT trước timeline (§2, §8.3, §47, §48).
- [x] **Góp ý màn Quản lý, đợt 2 (30/09/2026):** bỏ hẳn luồng trả về, mỗi vai chỉ tự sửa trong timeline của mình (§8.3, §27.2); nhãn tab Giữa năm và Cuối năm ở M-05, M-06 dùng chung luật `cycleTabLabel` với E-05 (§18.4, MYR-09b, MYR-41); câu chữ và màu trạng thái theo tab Giữa năm, thứ tự giai đoạn Tự đánh giá, `Không đánh giá` xuống cuối, thiếu mục tiêu lúc Tự đánh giá là `Chưa tự đánh giá` (§47); `(HR system)` là chữ thường (§6); M-05 có Bộ lọc, Split View, LM2 và HOD chấm điểm trên lưới, duyệt điểm cấp trước, upload điểm, popup đánh giá toàn diện, AI Summary cạnh ô chấm điểm (§14, §47).
- [x] **Duyệt điểm hiệu chuẩn cho HOD (30/09/2026):** nút `Duyệt điểm hiệu chuẩn` ở M-05, màn `Phê duyệt điểm hiệu chuẩn` như tab Giữa năm, luật ở `calibrationState`, báo khác biệt với điểm HOD chấm tay (§9, §47). Màn HRBP tải file chưa dựng.
- [x] **Góp ý màn Quản lý, đợt 3 (30/09/2026):** M-06 gom mọi thông tin vào một khối `Lưu ý` theo luật §40.5a của màn Nhân viên, hồ sơ `Không đánh giá` dùng một khối vàng, banner có nhãn trễ hạn, bỏ box `Không có kết quả Đánh giá giữa năm` (§8.3, §28, §48); AI Summary chuyển sang cột Chức năng (§14, §47); Split View có domain nhân viên (§47); nút `Duyệt điểm hiệu chuẩn` chỉ bấm được khi còn điểm HRBP tải lên duyệt được (§9).
- [x] **Chấm điểm trên lưới của LM2, HOD (30/09/2026):** bấm ô điểm là mở popup chấm điểm và nhận xét, bấm lại để sửa, bỏ nút nhận xét riêng; lịch sử chỉnh sửa `lm2Log` / `hodLog` ghi từ mọi đường lưu; nút chức năng màu xám trừ AI Summary; ⓘ ở tiêu đề cột điểm (§47). Popup rộng 640px, có điểm Nhân viên và QLTT kèm domain, ô điểm dùng `PMSUi.rating` như màn chi tiết, hạn sửa nhấn màu bên trái, lịch sử ghi `Điểm toàn diện: x` kèm giờ.
- [ ] **Góp ý màn Quản lý, còn lại:** cụm B (chọn điểm giống E-05; nộp trễ và cảnh báo điểm tối đa 3 cho mọi cấp, gồm cả ô chấm trên lưới); cụm C (QLTT tải mục tiêu hoặc thêm tay cho nhân viên thai sản trong mọi trường hợp, tự `Đã duyệt`, phân biệt với mục tiêu nhân viên tự tạo; AI viết nhận xét cho QLTT; AI Summary bấm mới chạy ở M-06).
- [x] **Góp ý E-05 đợt 3 (28/09/2026):** màn quá hạn giữ bố cục thường, các ô khóa, khối thông báo lần nhắc đang mở rồi xác nhận mới mở popup nộp bổ sung; hạn chấm QLTT riêng cho hồ sơ nộp bổ sung (3 ngày làm việc từ ngày nộp); banner nộp trễ một nhãn và dòng hình thức xử lý, không có lịch sử chỉnh sửa; ô QLTT có `Điểm toàn diện: - Chưa công bố`; bớt viền khối cuối trang; 16 tình huống Nhân viên, bỏ nhóm `Hồ sơ khác` (§6, §8.2, §27.1, §27.3, §40.5a, §42, §44.1, §46).
- [x] **Góp ý E-05 đợt 2 (27/09/2026):** bốn lần nhắc nộp bổ sung, đếm ngày làm việc, xác nhận đã đọc, khối nộp trễ sau khi gửi (§27.3); nhân viên đọc nhận xét Quản lý cấp 2 và Trưởng đơn vị (§7); tab `Danh sách mục tiêu` và nhãn xanh (§18.4); câu chữ cảnh báo thiếu mục tiêu, lưu nháp, thai sản, chỉnh sửa (§5, §8.1, §40.5); lịch sử chỉnh sửa theo lần gửi (§8.2); 11 tình huống Nhân viên và ghi chú `Hồ sơ khác` (§44.1, §46).
- [x] **Giai đoạn 3 (xong 27/09/2026):** tokens gộp vào `assets/tokens.css`, mọi màn nạp file này và chỉ giữ biến bố cục riêng; `assets/tokens.test.js` chặn khai lại token, tên biến riêng, icon không có trong Boxicons 2.1.4 và middot. Quyết định chung ghi ở `DESIGN-SYSTEM.md` §2, §19 rule 1, 6, 20, 24, 25. Các màu hồng, cam, xanh tự chế trong `yer-ui.js`, `yer-employee.js`, `yer-manager-detail.js` quy về token. Trang demo mascot và thanh demo `yer-demo.js` nằm ngoài phạm vi DS.
