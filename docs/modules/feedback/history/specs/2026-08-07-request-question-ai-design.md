# AI Improvement for Feedback Request Questions

## Mục tiêu

Thêm “Cải thiện với AI” vào popup `Yêu cầu phản hồi`, giúp user viết câu hỏi cụ thể, trung lập và dễ trả lời hơn. AI hỗ trợ độc lập theo từng câu hỏi, không cải thiện hàng loạt.

## Phạm vi

- Popup `Yêu cầu phản hồi` trên màn hình `Phản hồi cá nhân`.
- Hỗ trợ câu hỏi chung và câu hỏi cá nhân hóa.
- Tái sử dụng visual pattern của AI trong popup `Cho phản hồi`.
- Không thay đổi dữ liệu request sau khi gửi ngoài nội dung câu hỏi user đã chấp nhận.

## Câu hỏi chung

- Thanh AI nằm ngay dưới textarea câu hỏi chung.
- Nút `Cải thiện với AI` disabled khi textarea trống.
- Khi chạy, panel inline hiển thị `Gợi ý từ AI`, câu hỏi đề xuất và hai secondary button: `Dùng gợi ý này`, `Cải thiện lại`.
- Sau khi chấp nhận, textarea được cập nhật; dòng xám `Đã dùng gợi ý của AI, bạn vẫn có thể sửa thêm` và nút `Cải thiện lại` vẫn hiển thị.

## Câu hỏi cá nhân hóa

- Focus vào textarea của reviewer nào thì reviewer đó trở thành câu hỏi active.
- Chỉ dòng active hiển thị thanh `Đang chỉnh câu hỏi cho [Tên]` và nút AI.
- Gợi ý và trạng thái AI được lưu độc lập theo domain reviewer.
- Đổi focus không làm mất gợi ý đã tạo.
- AI chỉ cập nhật câu hỏi active khi user chọn `Dùng gợi ý này`.
- Xóa reviewer đồng thời xóa AI state của reviewer đó.
- Tắt cá nhân hóa quay về AI state của câu hỏi chung.

## Behavior của AI prototype

- Không bịa thêm dự án, sự kiện, vai trò hoặc bối cảnh.
- Giữ chủ thể và ý định gốc.
- Chuyển câu hỏi chung chung thành câu hỏi yêu cầu quan sát cụ thể, điều đang làm tốt, cơ hội phát triển và ví dụ khi phù hợp.
- Nếu câu hỏi đã cụ thể, chỉ tinh gọn và làm rõ cấu trúc.
- Nút `Cải thiện lại` tạo một biến thể khác nhưng vẫn giữ ý định gốc.

## State

- `R.ai.common`: state của câu hỏi chung.
- `R.ai.byReviewer[domain]`: state độc lập của từng reviewer.
- `R.activeQuestionKey`: `common` hoặc domain reviewer đang focus.
- Mỗi state gồm `source`, `suggestion`, `used`, `runCount`.
- State chỉ tồn tại trong phiên mở popup; mở popup mới sẽ reset.

## Accessibility và UI

- Nút AI có label đầy đủ, không dùng icon-only.
- Loading state disable đúng nút đang chạy.
- Focus reviewer làm nổi textarea bằng focus style sẵn có; không thêm border hoặc màu trang trí mới.
- Panel AI và secondary button dùng đúng component hiện có của popup `Cho phản hồi`.

## Kiểm thử

- Câu hỏi chung trống làm nút AI disabled.
- AI chỉ cập nhật textarea khi user chấp nhận.
- Mỗi reviewer có state độc lập.
- Focus chỉ hiển thị AI bar trên một reviewer.
- Xóa reviewer xóa AI state tương ứng.
- Tắt/bật cá nhân hóa không ghi đè câu hỏi ngoài logic hiện tại.
- Submit request sử dụng câu hỏi cuối cùng trong textarea/state reviewer.
