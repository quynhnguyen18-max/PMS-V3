# Employee Feedback Media Summary — Design Spec

## 1. Mục tiêu

`Dấu ấn của bạn` là trải nghiệm Media Summary theo chiến dịch trên màn hình `Phản hồi cá nhân`. Trải nghiệm giúp nhân viên cảm thấy tự hào, được ghi nhận và trân trọng những phản hồi đã nhận.

Đây không phải công cụ đánh giá, chấm điểm, xếp hạng hay so sánh nhân viên.

## 2. Phạm vi dữ liệu

- Mỗi chiến dịch do System Admin cấu hình thời gian bắt đầu và kết thúc.
- Có thể có nhiều chiến dịch trong cùng một năm.
- Khi chiến dịch được kích hoạt, hệ thống tạo snapshot từ toàn bộ feedback nhân viên đã nhận trong chu kỳ năm đang hoạt động, tính đến thời điểm kích hoạt.
- Feedback phát sinh sau thời điểm kích hoạt không làm thay đổi bộ nội dung đã tạo của chiến dịch đó.
- Mỗi chiến dịch có snapshot và trạng thái đã xem độc lập.
- AI chỉ diễn giải feedback thành insight, không hiển thị danh tính người gửi trong nội dung insight và không tạo thiết kế poster. Poster thống kê `Bạn nhận được phản hồi nhiều nhất từ [Tên đồng nghiệp]` được phép hiển thị tên dựa trên dữ liệu đếm thực tế, không phải nội dung AI suy diễn.
- Template, màu sắc, bố cục và số lượng poster do System Admin cung cấp.

## 3. Entry point trên màn hình Phản hồi cá nhân

Entry point là floating pill ở cạnh phải vùng nội dung, không nằm trong panel phải.

### Không có chiến dịch

- Không render floating pill, placeholder hoặc card khóa.
- Màn hình giữ nguyên layout hiện tại, không có khoảng trống dành trước.

### Chiến dịch đang mở, user chưa xem

- User nhận notification khi chiến dịch bắt đầu.
- Floating pill hiển thị đầy đủ: `✦ Dấu ấn của bạn`.
- Pill đủ nổi bật để được khám phá nhưng không che feed, CTA hoặc panel phải.

### User đã xem

- Khi đóng Media Summary sau lần mở đầu tiên, pill thu gọn thành nút tròn có icon `✦`.
- Hover/focus hiển thị tooltip: `Xem lại Dấu ấn của bạn`.
- Click mở lại đúng Media Summary của chiến dịch đang hoạt động.

### Chiến dịch kết thúc

- Floating pill biến mất.
- User không thể mở hoặc tải lại poster của chiến dịch đã kết thúc.
- Chiến dịch mới reset entry point về trạng thái pill đầy đủ.

### Responsive

- Desktop: pill neo ở cạnh phải vùng nội dung.
- Mobile: pill neo phía dưới vùng nhìn, chừa safe area và không che bottom navigation hoặc CTA.

## 4. Media Summary viewer

- Mở dưới dạng overlay tập trung, không chuyển sang màn hình quản lý hay tab feedback khác.
- Hiển thị chuỗi poster dạng story; mỗi poster truyền tải một insight duy nhất.
- Có chỉ báo vị trí trong chuỗi, điều hướng trước/sau và đóng viewer.
- User có thể tải poster đang xem hoặc tải toàn bộ poster trong chiến dịch.
- Viewer có thể mở lại nhiều lần trong thời gian chiến dịch.
- Đóng bằng dấu `×` hoặc click ngoài overlay đều được tính là đã xem và làm pill thu gọn.

## 5. Cấu trúc nội dung gợi ý

Nội dung cụ thể phụ thuộc template do Admin cung cấp. Một bộ điển hình có thể gồm:

1. Người gửi feedback nhiều nhất — `Bạn nhận được phản hồi nhiều nhất từ [Tên đồng nghiệp]`.
2. Cover — `Dấu ấn của bạn`.
3. Điểm mạnh nổi bật được đồng nghiệp ghi nhận.
4. Lời ghi nhận đáng nhớ, do AI diễn giải và ẩn danh.
5. Góp ý hữu ích cho hành trình phát triển.
6. Giá trị cốt lõi được ghi nhận nổi bật.
7. Closing — lời cảm ơn và khuyến khích tiếp tục trao/nhận feedback.

Mỗi poster hiển thị metadata: `Tổng hợp phản hồi đã nhận từ 1/1/[năm chu kỳ] đến [ngày hiện tại]`.

AI không được:

- Bịa insight khi dữ liệu không đủ.
- Hiển thị tên hoặc dấu hiệu nhận diện người gửi.
- Chấm điểm, xếp hạng hoặc so sánh với đồng nghiệp.
- Thay đổi bố cục, màu sắc hoặc thành phần đồ họa của template.

## 6. Trạng thái dữ liệu và lỗi

- Nếu chiến dịch đang mở nhưng snapshot chưa tạo xong, pill hiển thị trạng thái đang chuẩn bị và chưa cho mở viewer.
- Nếu dữ liệu không đủ để tạo insight có ý nghĩa, không tạo nội dung suy đoán; viewer dùng template fallback ghi nhận việc user đã tham gia văn hóa feedback.
- Nếu tải poster lỗi, giữ viewer mở và cho phép thử lại.
- Khi chiến dịch hết hạn trong lúc viewer đang mở, user được hoàn tất phiên xem hiện tại nhưng không thể tải hoặc mở lại sau khi đóng.

## 7. Model tối thiểu cho prototype

Mỗi campaign cần có:

- `id`
- `name`: `Dấu ấn của bạn`
- `startAt`, `endAt`
- `cycleYear`
- `snapshotAt`
- `status`: scheduled, preparing, active, ended
- `templates[]`: poster template metadata do Admin cung cấp
- `insights[]`: nội dung AI đã sinh theo từng template
- `viewed`: trạng thái theo user và campaign

Prototype chỉ cần mô phỏng một campaign active và state trong phiên demo; không cần xây màn hình cấu hình của System Admin trong phạm vi này.

## 8. Tiêu chí nghiệm thu

- Không có campaign active thì UI không chiếm thêm không gian.
- Campaign active và chưa xem hiển thị pill đầy đủ.
- Đóng viewer bằng `×` hoặc backdrop làm pill thu gọn.
- Pill thu gọn có tooltip và mở lại được viewer.
- Chuỗi poster có điều hướng và hai lựa chọn tải xuống.
- Content không hiển thị danh tính người gửi.
- Tên trải nghiệm không gắn năm và hỗ trợ nhiều campaign trong cùng chu kỳ.
- Hết campaign thì entry point và quyền tải biến mất.
