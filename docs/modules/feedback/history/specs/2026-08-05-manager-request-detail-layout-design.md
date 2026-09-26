# Manager Request Detail Layout Design

## Mục tiêu

Tối ưu trang chi tiết từng yêu cầu phản hồi để quản lý quét nhanh tiến độ, đọc phản hồi trong chiều dài dòng hợp lý và thao tác với các phản hồi đang chờ mà không phải kéo toàn trang.

## Bố cục

- Header chỉ hiển thị tên yêu cầu, ngày tạo, hạn phản hồi và `x/y đã trả lời`.
- Nội dung chia ba vùng: danh sách nhân viên bên trái, feed phản hồi ở giữa và panel tổng quan ticket bên phải.
- Feed giữa cuộn trong độc lập. Panel phải giữ ổn định và chứa trạng thái, tiến độ, ngày tạo, hạn, số nhân viên và trạng thái AI Summary.
- Ở màn hình hẹp, panel phải chuyển xuống dưới và bố cục không tạo cuộn ngang.

## Component

- Core-value badge phải dùng đúng file ảnh và tooltip chuẩn PMS.
- Tên người cho, domain và người nhận dùng đúng khoảng cách, tam giác chỉ hướng và tooltip metadata.
- Câu hỏi dùng nền hồng nhạt cùng border trái hồng như card Feedback.
- Người chưa phản hồi dùng khối cảnh báo vàng nhạt có nhãn trạng thái và nút Nhắc rõ ràng.
- Typography dùng Public Sans và scale hiện hành: page title 18px, section title 13–14px, body 13.5px, metadata 12px.

## Kiểm thử

- Test cấu trúc ba vùng, internal scroll, panel summary, metadata không lặp pending, badge image, question background và pending highlight.
- Chạy toàn bộ test M-04, parse JavaScript và `git diff --check`.
