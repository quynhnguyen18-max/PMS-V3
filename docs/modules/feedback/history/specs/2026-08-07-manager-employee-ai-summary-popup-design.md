# Manager Employee Feedback AI Summary Popup Design

## Mục tiêu

Giúp quản lý đọc nhanh điểm mạnh và cơ hội phát triển của từng nhân viên ngay trong popup phản hồi đã nhận, đồng thời giữ toàn bộ phản hồi gốc bên dưới để kiểm chứng.

## Phạm vi

- Màn hình quản lý `M-04`.
- Danh sách Direct reports và Indirect reports.
- Popup `Phản hồi đã nhận` mở bằng icon mắt hoặc click vào hàng nhân viên.
- Không thêm icon AI riêng trong cột Chức năng.

## Hành vi mở popup

- Icon mắt và click hàng nhân viên tiếp tục gọi cùng một hành động mở popup.
- Popup giữ nguyên header, số lượng phản hồi và metadata nhân viên.
- AI Summary được render ở đầu `dialogBody`, trước danh sách phản hồi gốc.
- Danh sách phản hồi gốc giữ nguyên thứ tự mới nhất trước.

## Điều kiện hiển thị

- Chỉ tạo AI Summary khi có ít nhất 2 phản hồi mà quản lý được phép xem trong chu kỳ đang chọn.
- Nếu có dưới 2 phản hồi, không render AI Summary và không render placeholder; popup chỉ hiển thị phản hồi gốc.
- Khi chọn `Tất cả`, summary sử dụng toàn bộ phản hồi quản lý được phép xem ở mọi chu kỳ.
- Ngày cập nhật là ngày mới nhất trong tập phản hồi dùng để tổng hợp.

## Nội dung AI Summary

- Header: `AI Summary`.
- Metadata: `Cập nhật: dd/mm/yyyy`.
- Hai phần: `Điểm mạnh` và `Cơ hội phát triển`.
- Không hiển thị tag `Chỉ đọc`.
- Không có chức năng sửa, tạo lại hoặc regenerate.
- Có nút collapse/expand; trạng thái collapse chỉ tồn tại trong phiên demo hiện tại.

## UI và hierarchy

- Tái sử dụng visual pattern AI Summary trong trang chi tiết yêu cầu phản hồi quản lý đã tạo.
- Box summary nổi nhẹ bằng border brand ring và shadow mảnh, không dùng nền hồng toàn khối.
- Header nền trắng; màu hồng chỉ dùng cho icon và nhãn `AI Summary`.
- Nội dung hai cột trên desktop, một cột ở màn hình hẹp.
- Popup vẫn cuộn trong; summary và danh sách phản hồi nằm trong cùng vùng cuộn để không tăng chiều cao màn hình.

## Data flow

1. `openFeedback(employeeId)` lấy `visibleFeedbackForManager(employeeId)` theo chu kỳ hiện tại.
2. Danh sách được sắp xếp mới nhất trước.
3. `ManagerAiSummary.create(employee, items)` tạo summary từ đúng danh sách đang hiển thị.
4. Renderer trả chuỗi rỗng nếu `summary.available === false`.
5. Nếu khả dụng, summary HTML được nối trước HTML của các feedback card.

## Accessibility

- Nút collapse có `aria-expanded` và label động `Mở AI Summary`/`Thu gọn AI Summary`.
- AI Summary dùng heading/section labels có thể quét nhanh.
- Hành vi click hàng và icon mắt giữ nguyên keyboard label hiện tại.

## Kiểm thử

- Direct và Indirect reports dùng chung popup renderer.
- Hai phản hồi trở lên hiển thị AI Summary trước feedback card.
- Một phản hồi không hiển thị summary hoặc placeholder.
- Summary chỉ dùng phản hồi `visibility: manager` trong chu kỳ đang chọn.
- `Tất cả` sử dụng dữ liệu qua các năm.
- Collapse không xóa danh sách phản hồi gốc.
- Không xuất hiện icon AI riêng trong cột Chức năng.
- Không xuất hiện `Chỉ đọc`, edit hoặc regenerate.
