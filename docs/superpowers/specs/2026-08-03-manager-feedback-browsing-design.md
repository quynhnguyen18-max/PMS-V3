# Manager Feedback Browsing Design

## Mục tiêu

Tối ưu màn `M-04` để quản lý có thể quét danh sách nhân viên, xem nhanh phản hồi, duyệt liên tục nhiều nhân viên và mở nội dung dài trong tab mới mà không mất trạng thái bộ lọc.

## Danh sách nhân viên

Không hiển thị hai dòng hướng dẫn phạm vi Direct/Indirect. Lưới dùng table-list thống nhất với `M-01`.

- Direct: Nhân viên, Phản hồi đã nhận, Chức năng.
- LM2: Nhân viên, Quản lý trực tiếp, Phản hồi đã nhận, Chức năng.
- HOD: Nhân viên, Quản lý trực tiếp, Quản lý cấp 2, Phản hồi đã nhận, Chức năng.

Cột Phản hồi đã nhận chỉ hiển thị số, không kèm chữ. Không có cột Phản hồi gần nhất và không tiết lộ số phản hồi riêng tư.

Thông tin Division, Department, Team và Position nằm dưới tên nhân viên. Trạng thái nghỉ việc hoặc nghỉ thai sản hiển thị bằng tag cạnh tên.

## Bộ lọc

Bộ lọc Indirect reports được gom vào một nút **Bộ lọc**, dùng cùng pattern popover với `M-01`:

- Badge số điều kiện đang áp dụng.
- Division, Department, Team, Quản lý trực tiếp và Quản lý cấp 2 theo scope.
- Nút Xóa bộ lọc.
- Direct reports chỉ cần tìm theo tên hoặc domain.

## Ba chế độ xem

### Popup

Dùng để xem nhanh từ List View. Header gồm `Phản hồi đã nhận` và badge số lượng. Dòng dưới là metadata nhân viên. Không hiển thị privacy banner.

Popup có icon **Mở trong tab mới** cạnh nút đóng.

### Split View

Nút Split View nằm cạnh Bộ lọc. Khi bật:

- Cột trái là danh sách nhân viên compact.
- Cột phải là toàn bộ phản hồi của nhân viên đang chọn.
- Click nhân viên khác cập nhật cột phải, không mở popup.
- Lần đầu bật chọn nhân viên đầu tiên có phản hồi; nếu không có thì chọn nhân viên đầu tiên.
- Tắt Split View quay lại List View và giữ search/filter.
- Cột phải có icon Mở trong tab mới.

### Tab mới

Mở trang `feedback-detail.html?employee=<id>&cycle=<cycle>`. Trang đọc cùng nguồn dữ liệu với popup và Split View, gồm header, badge số lượng, metadata nhân viên và toàn bộ feedback card.

## Data mẫu

Mỗi nhân viên có thêm ba phản hồi quản lý xem được:

1. Phản hồi chủ động có nhiều giá trị cốt lõi.
2. Phản hồi phát sinh từ request, có câu hỏi.
3. Phản hồi không có huy hiệu.

Dữ liệu được tạo từ một helper dùng chung để tránh phải nhân bản thủ công và đảm bảo mọi nhân viên có đủ tình huống kiểm thử.

## Rule metadata

Không dùng ký tự dấu chấm giữa `·` để phân cách metadata UI. Dùng dấu gạch ngang ngắn với khoảng trắng hai bên: ` - `.

Ví dụ: `Nguyễn Văn Tú (tu.nguyen) - ITC - Backend - Backend Core - Senior Engineer`.

Rule được bổ sung vào `DESIGN-SYSTEM.md` và áp dụng cho M-04, popup, Split View và trang chi tiết mới.

## Tiêu chí nghiệm thu

- Không còn hai dòng hướng dẫn Direct/Indirect.
- Lưới không có cột Phản hồi có thể xem hoặc Phản hồi gần nhất.
- Số phản hồi trong lưới chỉ là số.
- Bộ lọc Indirect nằm trong một popover.
- Popup không có privacy banner và có title, count, metadata đúng cấu trúc.
- Popup và Split View mở được trang chi tiết trong tab mới.
- Split View giữ nguyên filter khi bật/tắt.
- Mỗi nhân viên có ít nhất ba phản hồi quản lý xem được.
- Metadata trong các bề mặt mới không dùng `·`.
