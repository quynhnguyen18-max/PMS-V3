# H-05 Program Progress and Layout Design

## Mục tiêu

Tối ưu danh sách chương trình để HR có thể nhận biết ngay trạng thái, tiến độ và thời hạn; đồng thời loại bỏ lỗi nội dung lấn sang panel Tổng quan và đồng bộ khung trang với màn hình quản lý M-04.

## Quyết định thiết kế

### 1. Cấu trúc danh sách

Gộp hai cột `Tiến độ` và `Trạng thái` thành một cột `Tiến độ & thời hạn`.

Danh sách còn bốn cột:

1. `Chương trình`
2. `Phạm vi`
3. `Tiến độ & thời hạn`
4. Điều hướng mở chi tiết

Không dùng biểu đồ tròn hoặc thanh tiến độ lặp lại trên mỗi hàng. Tỷ lệ trả lời là dữ liệu phục vụ quyết định nên luôn hiển thị trực tiếp, không ẩn sau hover.

### 2. Semantic status chip

Áp dụng cách thể hiện nhất quán với màn hình quản lý request:

- `Nháp`: chip trung tính; không hiển thị tỷ lệ.
- `Đang thu thập: 12/40 đã trả lời`: chip vàng.
- `Quá hạn: 18/24 đã trả lời`: chip đỏ.
- `Hoàn thành: 30/30 đã trả lời`: chip xanh, chỉ dùng khi đạt đủ phản hồi.
- `Đã đóng: 34/36 đã trả lời`: chip xám khi ticket đã đóng nhưng chưa đủ phản hồi.

Dòng metadata bên dưới chỉ giữ một thông tin thời gian phù hợp với trạng thái:

- `Hạn 13/08/2026`
- `Quá hạn 2 ngày`
- `Đã kết thúc`
- Trạng thái báo cáo như `Chưa tạo báo cáo` hoặc `Đã chia sẻ quản lý` khi có liên quan.

Toàn bộ wording dùng `đã trả lời`, không dùng `đã phản hồi`.

### 3. Phạm vi và tooltip

Tooltip của chỉ số người nhận đổi từ `người nhận feedback` thành `người nhận phản hồi`.

Các tooltip tiếp tục dùng component `.pms-tooltip` của design system.

### 4. Page shell và panel Tổng quan

H-05 hiện dùng container `max-width: 1080px`, trong khi M-04 dùng page-shell toàn chiều rộng viewport với padding 24px. H-05 sẽ chuyển sang cùng quy tắc với M-04:

- Nội dung chiếm toàn chiều rộng khả dụng.
- Khoảng cách mép trái/phải là 24px trên desktop.
- Panel Tổng quan nằm ở cột phải và cách mép viewport 24px.
- Không đặt panel sát tuyệt đối vào cạnh màn hình vì vẫn phải giữ safe margin của design system.

### 5. Sửa lỗi overflow

Nguyên nhân gốc: tổng chiều rộng tối thiểu hiện tại của năm cột và bốn khoảng cách là khoảng 787px, lớn hơn chiều rộng khoảng 718px của cột danh sách khi đặt cạnh panel 290px.

Biện pháp cấu trúc:

- Giảm còn bốn cột.
- Dùng grid track có `minmax(0, ...)` để cho phép co đúng cách.
- Giảm column gap từ 22px xuống 16px.
- Đặt `min-width: 0` cho list, row cell và nội dung có thể wrap.
- Status chip không vượt quá chiều rộng cột.
- Khi viewport không đủ, panel Tổng quan chuyển xuống dưới theo breakpoint thay vì ép bảng tràn ngang.

## Data model và rendering

Không thay đổi nghiệp vụ hoặc dữ liệu nguồn. Renderer sẽ suy ra presentation state từ trạng thái chương trình và `done/total`:

- `draft`
- `collecting`
- `overdue`
- `completed`
- `closed_incomplete`

`completed` chỉ được dùng khi `done === total`; trạng thái đóng với tỷ lệ chưa đủ phải giữ màu trung tính.

## Kiểm thử TDD

Trước khi sửa implementation, bổ sung test thất bại cho các hợp đồng sau:

1. Header chỉ còn `Chương trình`, `Phạm vi`, `Tiến độ & thời hạn` và điều hướng.
2. Không còn hai cột `Tiến độ` và `Trạng thái` riêng biệt.
3. Wording renderer dùng `đã trả lời`.
4. Tooltip dùng `người nhận phản hồi`.
5. Mỗi trạng thái sinh đúng chip và metadata thời gian.
6. Chương trình đóng nhưng chưa đủ không được hiển thị là `Hoàn thành`.
7. Page-shell không còn `max-width: 1080px`.
8. Grid dùng bốn cột, `minmax(0, ...)`, gap phù hợp và breakpoint chống overflow.
9. Toàn bộ H-05, E-04 và M-04 regression tests vẫn pass.

## Ngoài phạm vi

- Không thêm chart hoặc visualization cho từng hàng.
- Không thay đổi panel Tổng quan ngoài việc căn lề và chống overflow.
- Không thay đổi data nghiệp vụ của chương trình.
- Không commit hoặc push cho tới khi người dùng yêu cầu.
