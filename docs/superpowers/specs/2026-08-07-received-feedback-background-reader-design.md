# Received Feedback Background Reader

## Mục tiêu

Cho người nhận mở một phản hồi chưa đọc trong popup và trải nghiệm đúng background người gửi đã chọn. Sau khi đóng popup, phản hồi trở thành card đã đọc với nền trắng trung tính để feed nhất quán và dễ quét.

## Phạm vi

- Màn hình `Phản hồi cá nhân`, feed `Đã nhận` và `Tất cả`.
- Chỉ áp dụng cho phản hồi nhận được chưa mở.
- Không thay đổi popup `Cho phản hồi` ngoài việc lưu background đã chọn vào record mới.
- Không lưu trạng thái đã đọc qua reload; đây là prototype demo cho Dev Team.

## Data model

- Feedback record có thêm `backgroundId`, nullable.
- `backgroundId` tham chiếu danh mục background dùng chung với popup `Cho phản hồi`.
- Record mới lấy `backgroundId` từ `G.bg` khi gửi.
- Dữ liệu mẫu chưa đọc được gán nhiều background khác nhau để minh họa.
- `FB_STATE` tiếp tục giữ `opened` trong memory của phiên hiện tại.

## Luồng tương tác

1. Phản hồi chưa mở hiển thị dạng phong bì, không lộ nội dung hoặc background.
2. Click hoặc Enter/Space trên phong bì mở popup đọc phản hồi.
3. Việc mở popup chưa đổi trạng thái card trong feed.
4. Click dấu đóng hoặc click ra ngoài popup đều gọi cùng một close handler.
5. Close handler đặt `FB_STATE[id].opened = true`, đóng popup và render lại feed.
6. Card sau khi đọc dùng layout phản hồi thông thường với nền trắng, không render background.
7. F5 reset về seed state ban đầu.

## Popup đọc phản hồi

- Header nền trắng: tiêu đề, dấu đóng.
- Identity block: avatar, người gửi, domain, ngày, visibility và core-value badges.
- Câu hỏi, nếu có, dùng khối nền hồng hiện hành của Feedback design system.
- Nội dung phản hồi nằm trong một canvas riêng sử dụng background người gửi chọn.
- Background chỉ áp dụng cho canvas nội dung, không phủ header hoặc metadata.
- Nếu không có `backgroundId`, canvas nền trắng với border xám nhẹ.
- Không thêm CTA mới; hành vi chính là đọc và đóng.
- Motion nhẹ, hỗ trợ `prefers-reduced-motion`.

## Accessibility

- Phong bì hỗ trợ click và Enter/Space.
- Popup có dialog semantics, accessible label và focus vào nút đóng khi mở.
- Escape không được yêu cầu trong prototype; click overlay và dấu đóng là hai đường đóng chính.
- Mỗi background giữ đúng foreground, alignment, padding và contrast token hiện có.

## Kiểm thử

- Background được lưu vào record mới khi gửi.
- Popup chưa làm feedback thành đã đọc cho tới khi đóng.
- Dấu đóng và overlay đều đánh dấu đã đọc.
- Card sau khi đóng không chứa background.
- Feedback không có background dùng canvas trung tính.
- F5/session persistence không được thêm vào localStorage.
