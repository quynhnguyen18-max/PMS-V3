# Manager AI Coaching Summary Design

## Mục tiêu

Giúp quản lý đọc nhanh các mẫu phản hồi nổi bật của từng nhân viên trong một ticket để chuẩn bị coaching. Feedback không phải công cụ đánh giá; AI Summary là coaching evidence, không phải điểm số hay kết luận đánh giá nhân viên.

## Phạm vi tổng hợp

- Tổng hợp theo từng nhân viên nhận phản hồi đang được chọn trong ticket.
- Chỉ hiển thị kết quả khi nhân viên đã nhận từ 2 phản hồi trở lên.
- Khi có phản hồi mới, summary tự cập nhật từ tập phản hồi mới nhất.
- Quản lý không thể sửa, regenerate, accept hoặc reject nội dung AI.

## Vị trí và cấu trúc

- Card AI Summary nằm trong panel giữa, ngay dưới header nhân viên và trước câu hỏi/danh sách phản hồi gốc.
- Card gồm hai section đọc liên tục, không chia thành các card màu:
  1. Điểm mạnh.
  2. Cơ hội phát triển.
- Header card có icon sparkle, nhãn `AI Summary`; bên phải là trạng thái `Chỉ đọc` và `Cập nhật: dd/mm/yyyy`.
- Không hiển thị footer hoặc phần chủ đề lặp lại.

## State

- Từ 2 phản hồi: hiển thị summary mẫu theo nhân viên.
- Dưới 2 phản hồi: hiển thị empty state nhỏ `Cần ít nhất 2 phản hồi để tạo AI Summary.`
- Không hiển thị control chỉnh sửa.

## Visual

- Nền trắng, border xám và radius theo design system.
- Chỉ icon sparkle và nhãn AI dùng brand color nhẹ; nội dung dùng zinc scale.
- Bullet ngắn, font body 12.5–13px, không dùng màu semantic riêng cho từng section.
