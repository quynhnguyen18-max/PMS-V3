# GOAL SPEC — Thiết lập mục tiêu (Goal setting) 2026

> **Trạng thái: chị đã duyệt ngày 27/09/2026.** Bản v1 `PMS_Screen_Spec_GoalSetting_v1.md` đã xóa sau khi trích xong.
> Trích từ code hiện tại (`E-05` tab Mục tiêu, `M-05` chu kỳ Mục tiêu, `M-01b`), lịch sử commit
> (E-01, M-01, M-01b, M-01d từ 06/2026) và bản v1 (`PMS_Screen_Spec_GoalSetting_v1.md`, đã xóa;
> `PMS_PRD_v1.md` §2.2, §4, §8.2, §11, `PM Process.md` bước 3 đến 5).
> Chỗ code và v1 lệch nhau, spec ghi theo **code** (bản chị đã duyệt trên UI) và đưa điểm lệch vào §12.
> Rule mục tiêu trong kỳ YER (xóa, đóng băng, đánh giá hoàn thành khi đổi Quản lý) nằm ở `YER-SPEC.md` §13, §17, §29, không chép lại.

Mã rule: `GS-xx`. Mã màn theo hệ hiện tại (E-05, M-05, M-01b, M-06), không dùng mã trong bản v1.

---

## 1. Phân loại mục tiêu

| Mã | Rule | Nguồn |
|---|---|---|
| GS-01 | Ba nhóm: **Mục tiêu công việc** (`what`, icon `bx-target-lock`), **Mục tiêu phát triển** (`dev`), **Mục tiêu hành vi** (`how`, icon `bx-heart`). | code E-05, PRD §4.2 |
| GS-02 | Nhân viên chỉ tạo được mục tiêu công việc và phát triển. | code E-05, PRD §4.2 |
| GS-03 | Mục tiêu hành vi là **5 giá trị cốt lõi cố định** cho toàn bộ MoMoers, không tạo, sửa, xóa. Tên chính thức: `Tập trung vào khách hàng` - `Đổi mới sáng tạo` - `Tinh thần đồng đội` - `Thực thi xuất sắc` - `Tinh thần học hỏi không ngừng`. | commit e942b98 (thay tên v1 "Thấu hiểu khách hàng") |
| GS-04 | Bấm vào giá trị cốt lõi mở hộp thoại chỉ xem `#dlg-how` (tên + mô tả). Mở từ tab Mục tiêu thì có dòng ghi chú `Giá trị cốt lõi cố định cho toàn bộ MoMoers, được đánh giá trong Kỳ giữa năm (MYR) và cuối năm (YER)`. | code E-05, YER-SPEC §13.2 |
| GS-05 | Chỉ mục tiêu công việc có **Mức độ ưu tiên** (`Cao` / `Trung bình` / `Thấp`). Mục tiêu phát triển không có ưu tiên: ẩn ô ở form, ở popup chi tiết và cột ưu tiên hiện `—`. | code E-05, M-01b (commit abdd7ec) |
| GS-06 | Mục tiêu không có trọng số, không có công thức tính điểm. | PRD BR-13, BR-14 |

## 2. Trường của mục tiêu

| Mã | Trường | Bắt buộc khi Gửi quản lý | Ràng buộc |
|---|---|---|---|
| GS-07 | Loại mục tiêu | ✓ (cả khi Lưu nháp) | `Mục tiêu công việc` / `Mục tiêu phát triển` |
| GS-08 | Mức độ ưu tiên | ✓ với mục tiêu công việc | Ẩn với mục tiêu phát triển |
| GS-09 | Từ ngày, Đến ngày | ✓ | Hiển thị `dd/mm – dd/mm` trong bảng, `dd/mm/yyyy` trong popup |
| GS-10 | Tên mục tiêu | ✓ | Rich text, tối đa **1.000** ký tự, có bộ đếm |
| GS-11 | Kết quả cần đạt | ✓ | Rich text, tối đa **4.000** ký tự, gợi ý `Định lượng, đo lường được` |

- **GS-12** Chọn loại xong thì hiện ⓘ gợi ý cạnh Tên mục tiêu: công việc theo nguyên tắc **SMART**, phát triển theo nguyên tắc **70-20-10**. (code E-05)
- **GS-13** `Lưu nháp` chỉ kiểm tra Loại mục tiêu. `Gửi quản lý` kiểm tra đủ các trường bắt buộc, lỗi hiện ngay dưới ô. (code E-05)
- **GS-14** Đóng form khi đã nhập dữ liệu thì hỏi lại: `Bỏ thay đổi?` với hai nút `Huỷ` và `Đóng và mất dữ liệu`. (code E-05, v1 E-02)

## 3. Trạng thái mục tiêu

| Mã | Trạng thái | Nhãn | Badge | Ai tạo ra |
|---|---|---|---|---|
| GS-15 | `draft` | `Nháp` | `b-muted` | NV lưu nháp, import, thu hồi |
| | `pending` | `Chờ duyệt` | `b-action` (hồng) | NV gửi quản lý |
| | `approved` | `Đã duyệt` | `b-ok` | QLTT duyệt |
| | `update` | `Cần cập nhật` | `b-action` (hồng) | QLTT yêu cầu cập nhật |
| | `rejected` | `Từ chối` (thống nhất mọi chỗ) | `b-err` | QLTT từ chối |
| | `done` | `Hoàn thành` | `b-done` | Đã duyệt và đủ hai bước Đánh giá hoàn thành (§7) |

- **GS-16** Badge `Chờ duyệt` và `Cần cập nhật` dùng tông thương hiệu vì đó là việc cần làm (commit bb25142).
- **GS-17** Sau khi đã duyệt, QLTT **không từ chối** được nữa. (PRD §2.2, §4.5)
- **GS-18** Mục tiêu `Từ chối` và mục tiêu đã xóa không vào kỳ đánh giá. Chỉ mục tiêu `Đã duyệt` mới được đánh giá ở MYR, YER. (PRD §4.7)

## 4. Màn Nhân viên: tab Mục tiêu (`E-05` `#mpanel-goals`)

### 4.1 Bố cục

- **GS-19** Toolbar: dòng đếm trạng thái, chuyển `Cột` / `Bảng`, lọc trạng thái (icon), `Tạo mục tiêu`, `Import` (icon), `Tải xuống` Excel/CSV (icon). (commit eabba8b)
- **GS-20** Dòng đếm chỉ gồm `chờ duyệt`, `cần cập nhật`, `từ chối`, `đã duyệt`, **ẩn trạng thái có 0 mục**. Bấm số để lọc, hiện `Bỏ lọc` khi đang lọc. Đang lọc thì ẩn nhóm Mục tiêu hành vi. (code E-05)
- **GS-21** Khối hướng dẫn gồm `Lưu ý` (hệ thống mở xuyên suốt cả năm để **Thêm mới** hoặc **Điều chỉnh** mục tiêu) và `Quy trình` hai bước: Nhân viên thiết lập Mục tiêu → Quản lý trực tiếp phê duyệt. (code E-05, PM Process bước 5)
- **GS-22** Chế độ Cột: ba cột công việc, phát triển, hành vi. Chân cột công việc và phát triển ghi điều kiện `Bạn cần có ít nhất 1 Mục tiêu ... được duyệt để tham gia kỳ đánh giá MYR và YER`. (code E-05)
- **GS-23** Cột chưa có mục tiêu: trạng thái trống `Bạn chưa có mục tiêu ... nào` và nút `Tạo mục tiêu đầu tiên`. Lọc không ra kết quả: `Không có mục tiêu khớp bộ lọc hiện tại.` (code E-05)
- **GS-24** Rê chuột vào Tên mục tiêu hoặc Kết quả cần đạt hiện tooltip đầy đủ (giữ định dạng rich text), cuộn được bằng con lăn khi nội dung dài. (commit eabba8b)

### 4.2 Hành động theo trạng thái

| Mã | Trạng thái | Hành động của Nhân viên |
|---|---|---|
| GS-25 | `Nháp` | `Gửi quản lý`, `Sửa`, `Xóa` (xóa theo YER-SPEC §17) |
| | `Chờ duyệt` | `Thu hồi` về nháp |
| | `Đã duyệt`, chưa hoàn thành | `Thu hồi để sửa`, `Đánh giá hoàn thành` (khi tổ chức bật tính năng) |
| | `Cần cập nhật` | `Sửa & gửi lại`. Form mở với tiêu đề `Sửa & gửi lại mục tiêu`, banner `Quản lý yêu cầu cập nhật` kèm ghi chú, nút `Gửi lại` |
| | `Từ chối` | `Sửa & gửi lại`, `Xóa` |
| | `Hoàn thành` | Chỉ xem |

- **GS-26** Thu hồi: `Chờ duyệt` → `Nháp`; `Đã duyệt` (chưa hoàn thành) → **`Cần cập nhật`**, nhân viên sửa rồi gửi lại. Mục tiêu `Hoàn thành` không thu hồi được. Trong kỳ YER, khóa theo YER-SPEC §29. (chị chốt 27/09/2026, code E-05 `recallGoal`)

### 4.3 Gửi hàng loạt

- **GS-27** Chọn nhiều mục tiêu bằng checkbox, thanh `N đã chọn` hiện ra với `Bỏ chọn`, `Chọn Nháp & Cần cập nhật`, `Gửi quản lý`. (code E-05)
- **GS-28** `Nháp` và `Cần cập nhật` tính chung một nhóm "gửi được". `Gửi quản lý` chỉ bật khi **mọi** mục đã chọn thuộc nhóm này. Chọn lẫn trạng thái thì cảnh báo `Chọn các mục tiêu cùng trạng thái`. (code E-05)

### 4.4 Import và tải xuống

- **GS-29** Import theo 4 bước: tải template → tải lên file (.xlsx, .csv) gồm 2 sheet `WHAT Goals` và `DEVELOPMENT Goals` → `Đọc file` để kiểm tra → `Import`. (code E-05)
- **GS-30** Mục tiêu import vào ở trạng thái **Nháp**, nhân viên đọc lại rồi mới gửi duyệt. (code E-05)
- **GS-31** Tải xuống danh sách mục tiêu dạng Excel (.xls) hoặc CSV. (commit e942b98)

## 5. Popup Chi tiết mục tiêu

- **GS-32** Đầu popup: badge trạng thái + badge loại (xám, tên đầy đủ). Không có tiêu đề riêng. (commit abdd7ec, bb25142)
- **GS-33** Tab `Thông tin`: hàng `Mức độ ưu tiên | Từ ngày | Đến ngày` (mục tiêu phát triển còn 2 cột), rồi `Tên mục tiêu`, `Kết quả cần đạt`. Mục tiêu `Cần cập nhật` có khung `Ghi chú yêu cầu cập nhật`. Mục tiêu đã duyệt có khối Đánh giá hoàn thành (§7). (code E-05, M-01b)
- **GS-34** Tab `Bình luận` (thay tab `Lịch sử` của v1 ở phía Nhân viên). Mục tiêu `Nháp` và `Chờ duyệt` chưa có bình luận: `Chưa có bình luận. Mục tiêu cần được duyệt trước khi có thể trao đổi.` (commit bb25142, code E-05, M-01b)
- **GS-35** Không xóa được bình luận đã gửi. (v1 E-04)
- **GS-36** Chân popup có đúng một nút chính theo trạng thái như bảng GS-25. (code E-05)

## 6. Màn Quản lý

### 6.1 Danh sách nhân viên (`M-05` chu kỳ Mục tiêu)

- **GS-37** Tab chu kỳ `Mục tiêu nhân viên` có số đếm = số nhân viên báo cáo trực tiếp (không tính người nghỉ việc, nghỉ thai sản) đang có mục tiêu `Chờ duyệt`. Không có thì ẩn số. (code M-05)
- **GS-38** Hai phạm vi: `Direct reports` (QLTT) và `Indirect reports` với vai con `LM2` / `HOD`. Indirect **không gồm** nhân viên báo cáo trực tiếp. (code M-05, PRD §4.5)
- **GS-39** Indirect chỉ xem: tên có icon khóa `Nhân viên gián tiếp — chỉ xem`, không có Duyệt, Từ chối, Yêu cầu cập nhật. (commit bb25142)
- **GS-40** Cột theo vai:

  | Vai | Cột |
  |---|---|
  | QLTT | Nhân viên - Mục tiêu đã duyệt - Quản lý cần làm - Chức năng |
  | LM2 | Nhân viên - Quản lý trực tiếp - Mục tiêu đã duyệt - Trạng thái - Chức năng |
  | HOD | Nhân viên - Quản lý trực tiếp - Quản lý cấp 2 - Mục tiêu đã duyệt - Trạng thái - Chức năng |

- **GS-41** Cột `Mục tiêu đã duyệt` chỉ đếm mục tiêu **đã duyệt**: `N công việc`, `N phát triển` (ẩn phát triển khi bằng 0). (code M-05)
- **GS-42** Cột việc cần làm:

  | Tình huống | QLTT | LM2, HOD |
  |---|---|---|
  | Có mục tiêu chờ duyệt | `Duyệt N mục tiêu` (tông hồng) | `N chờ duyệt` |
  | Chưa có mục tiêu nào được duyệt | `Nhắc nhở thiết lập` | `Chưa thiết lập` |
  | Còn lại | để trống | để trống |

- **GS-43** Sắp xếp: có mục tiêu chờ duyệt lên đầu, người nghỉ việc hoặc nghỉ thai sản xuống cuối. (code M-05)
- **GS-44** Nhãn nhân thân dưới tên: `Đã nộp đơn nghỉ việc`, `Đang nghỉ thai sản`. (code M-05)
- **GS-45** Bộ lọc (popover `Bộ lọc`): QLTT chỉ có ô Nhân viên. LM2 thêm Division, Department, Team, Quản lý trực tiếp. HOD thêm Division, Department, Quản lý trực tiếp, Quản lý cấp 2. Lọc theo chuỗi con. (code M-05, commit 07f5f94)
- **GS-46a** Quản lý **không thấy mục tiêu `Nháp`** ở mọi màn (M-01b, Split View của M-05): nhân viên chưa gửi thì chưa phải việc của quản lý. Số đếm `mục tiêu` cũng không tính Nháp. (chị chốt 27/09/2026)
- **GS-46** Nút chức năng: QLTT và nhân viên có mục tiêu chờ duyệt → `Xem & duyệt mục tiêu`, còn lại `Xem mục tiêu`. Mở `M-01b` (indirect thêm `ro=1`). (code M-05)
- **GS-47** `Split View`: danh sách nhân viên bên trái, bảng mục tiêu bên phải, có `Mở toàn trang` sang `M-01b`. (commit 0d5d4bd, 94b102e)
- **GS-47a** Trong Split View, `Duyệt`, `Yêu cầu cập nhật`, `Từ chối` thực hiện **ngay, không có hộp xác nhận** (thao tác nhanh). `Từ chối` đưa mục tiêu về `Từ chối`, không về `Nháp`. (chị chốt 27/09/2026)

### 6.2 Chi tiết mục tiêu của một nhân viên (`M-01b`)

- **GS-48** Header nhân viên: tên, domain, nhãn nhân thân, đơn vị, vị trí và ba ô đếm `mục tiêu`, `chờ duyệt`, `cần đánh giá` (số mục tiêu nhân viên đã tự đánh giá hoàn thành). (code M-01b)
- **GS-49** Bảng: Loại mục tiêu - Tên mục tiêu - Kết quả cần đạt - Mức độ ưu tiên - Thời gian - Trạng thái - Chức năng. Sắp theo loại (công việc trước) rồi theo ưu tiên (Cao → Thấp). (code M-01b)
- **GS-50** Hành động của QLTT:

  | Trạng thái | Hành động |
  |---|---|
  | `Chờ duyệt` | `Duyệt` (hộp xác nhận) - `Yêu cầu cập nhật` (ghi chú **tùy chọn**) - `Từ chối` (lý do **tùy chọn**, mục tiêu về `Từ chối`) |
  | `Đã duyệt`, NV đã tự đánh giá hoàn thành | `Đánh giá hoàn thành` |
  | Còn lại | Chỉ `Xem chi tiết` |

- **GS-51** Duyệt hàng loạt: chỉ duyệt mục `Chờ duyệt`. Chọn lẫn trạng thái thì cảnh báo `Chỉ x/y mục Chờ duyệt sẽ được duyệt`, không có mục chờ duyệt nào thì khóa nút. Có `Chọn tất cả Chờ duyệt`. (code M-01b)
- **GS-52** Nút Duyệt dùng kiểu nút chính màu thương hiệu, không dùng màu xanh riêng. (commit bb25142)
- **GS-53** Mỗi thao tác ghi vào lịch sử mục tiêu (ai, lúc nào, ghi chú). (code M-01b, PRD §4.4)
- **GS-54** Tải xuống danh sách mục tiêu của nhân viên dạng Excel hoặc CSV. (commit e942b98)
- **GS-55** Popup chi tiết giống phía Nhân viên (GS-32 đến GS-34), chân popup theo bảng GS-50. (code M-01b)

## 7. Đánh giá hoàn thành mục tiêu

Đây không phải kỳ đánh giá. Là thao tác **chốt một mục tiêu đã làm xong** ngay trong năm: nhân viên tự chấm, quản lý chấm xác nhận, mục tiêu thành `Hoàn thành`.
Có từ M-01b (06/2026) và được dùng cho trường hợp đổi Quản lý giữa kỳ: Quản lý cũ chốt những mục tiêu đã xong trước khi bàn giao, Quản lý mới không chấm lại (YER-SPEC §13.1).

- **GS-56** Là **tính năng cấu hình theo tổ chức** (demo: công tắc trên topbar). Tắt thì ẩn toàn bộ nút và khối liên quan. (code E-05, M-06)
- **GS-57** Chỉ áp cho mục tiêu `Đã duyệt`. Hai bước tuần tự: ① Nhân viên tự đánh giá → ② Quản lý đánh giá. (code E-05)
- **GS-58** Nhân viên: điểm **số nguyên 1-5** kèm tên mức, và nhận xét **bắt buộc**. Gửi xong mục tiêu có chip `Chờ quản lý đánh giá`, ô của Nhân viên thành chỉ xem. (code E-05)
- **GS-59** Quản lý: điểm số nguyên 1-5 **bắt buộc**, nhận xét tùy chọn. Xong thì mục tiêu thành `Hoàn thành`, cạnh badge có cặp `NV x | QL y`. (code M-01b)
- **GS-60** **Không có bước đánh giá lại.** Quản lý đã chấm là mục tiêu `Hoàn thành`. (chị chốt 27/09/2026, đã bỏ trạng thái `Cần đánh giá lại` khỏi E-05)
- **GS-61** Mục tiêu đã `Hoàn thành` bị khóa trong kỳ MYR và YER theo YER-SPEC §13.1.

## 8. Điều kiện tham gia kỳ đánh giá

- **GS-62** Cần tối thiểu **1 mục tiêu công việc** và **1 mục tiêu phát triển** đã duyệt để tham gia MYR và YER. Mục tiêu phát triển **có chấm điểm** như mục tiêu công việc. Rule này thay PM Process ("mục tiêu phát triển không bắt buộc, không đánh giá"). (chị chốt 27/09/2026)
- **GS-63** Mục tiêu tạo và chỉnh được suốt năm, nhưng phải được duyệt trước khi kỳ đánh giá bắt đầu mới được tính. (PRD BR-01)

## 9. Thông báo và HRBP (chưa dựng UI)

- **GS-64** QLTT nhận thông báo khi nhân viên gửi mục tiêu. Nhân viên nhận thông báo khi bị yêu cầu cập nhật. (PRD Flow 1, v1 M-02)
- **GS-65** Khi nhân viên chuyển team giữa chu kỳ, QLTT mới lấy theo HR masterlist. (PRD BR-17)

## 10. Không làm

- Tab `Lịch sử` trong popup của Nhân viên (v1 có, prototype bỏ, chỉ giữ Bình luận).
- Ô `Ghi chú nội bộ` của Quản lý trong popup (v1 M-02).
- Alert bar vàng `Có N mục tiêu đang chờ phê duyệt` và dạng lane accordion của v1 M-01 (thay bằng bảng danh sách + số đếm trên tab).

## 11. Màu và typography

Theo `DESIGN-SYSTEM.md`. Bảng màu badge, priority, loại mục tiêu trong v1 (xanh dương, tím, xanh ngọc) **không còn dùng**: loại mục tiêu hiển thị icon + chữ thường, icon màu thương hiệu (commit bb25142).

## 12. Các điểm đã chốt ngày 27/09/2026

| # | Chủ đề | Quyết định | Rule |
|---|---|---|---|
| 1 | Từ chối ở Split View của M-05 | Về `Từ chối`, không về `Nháp` | GS-47a |
| 2 | Lý do từ chối, ghi chú yêu cầu cập nhật | Tùy chọn | GS-50 |
| 3 | Quản lý thấy mục tiêu `Nháp` | Không thấy | GS-46a |
| 4 | Mục tiêu phát triển | Bắt buộc ≥ 1 và có chấm điểm | GS-62 |
| 5 | Tên trạng thái | `Từ chối` ở mọi chỗ | GS-15 |
| 6 | Đánh giá lại | Không có | GS-60 |
| 7 | Thu hồi mục tiêu đã duyệt | Về `Cần cập nhật` | GS-26 |
| 8 | Split View | Duyệt thẳng, không hộp xác nhận | GS-47a |
