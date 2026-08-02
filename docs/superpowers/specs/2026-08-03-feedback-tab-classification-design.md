# Feedback tab classification

## Mục tiêu

Chuẩn hóa cách phân loại phản hồi trong ba tab **Đã nhận**, **Đã cho** và **Yêu cầu của tôi**, để người dùng không bị mất phản hồi, không hiểu nhầm dữ liệu bị nhân đôi và các số thống kê luôn nhất quán.

## Mô hình thông tin

Hệ thống phân biệt hai loại đối tượng:

- `request`: lời mời một hoặc nhiều người cung cấp phản hồi, dùng để theo dõi tiến độ.
- `response`: một phản hồi thực tế do một người gửi cho một người nhận.

Một request có thể tạo ra nhiều response độc lập. Mỗi response có `requestId` khi phát sinh từ request; phản hồi chủ động không cần `requestId`. Response chỉ tồn tại một lần trong dữ liệu dù có thể được truy cập từ nhiều ngữ cảnh giao diện.

## Rule phân loại

### Đã nhận

Hiển thị mọi response đã gửi thành công mà người dùng hiện tại là người nhận, gồm:

- Phản hồi được người khác chủ động gửi.
- Phản hồi trả lời một request do người dùng hiện tại tạo.

Mỗi người hoàn tất trả lời một request nhiều người sẽ tạo một card riêng trong tab này. Response chưa gửi hoặc đang lưu nháp không xuất hiện.

### Đã cho

Hiển thị mọi response do người dùng hiện tại viết, gồm:

- Phản hồi chủ động.
- Phản hồi trả lời request của người khác.
- Bản nháp phản hồi, có trạng thái **Lưu nháp** và tiếp tục chỉnh sửa được.

### Yêu cầu của tôi

Chỉ hiển thị request do người dùng hiện tại tạo. Đây là khu vực theo dõi công việc, không phải kho lưu phản hồi.

Mỗi request hiển thị người được yêu cầu, hạn và tiến độ theo mẫu `Đang thu thập: n/tổng số mẫu đã trả lời`. Card trong feed không lặp toàn bộ nội dung response. Người dùng mở chi tiết request để xem trạng thái và response theo từng người.

## Hành vi request nhiều người

Nếu một request gửi cho năm người và ba người đã trả lời:

- **Yêu cầu của tôi** có một request với tiến độ `Đang thu thập: 3/5`.
- **Đã nhận** có ba response riêng biệt.
- Popup chi tiết request có thể mở ba response đó qua liên kết dữ liệu, không tạo bản sao.

Người chưa trả lời chỉ xuất hiện trong chi tiết request. Khi một response được submit, tab Đã nhận và tiến độ request phải cập nhật từ cùng một nguồn dữ liệu.

## Tab Tất cả

Nếu prototype tiếp tục giữ tab **Tất cả**, tab này có thể chứa cả request và response theo thứ tự hoạt động, nhưng card request chỉ hiển thị tiến độ và CTA xem chi tiết. Không render lại nội dung đầy đủ của các response bên trong card request để tránh cảm giác trùng lặp với card Đã nhận.

## Trạng thái và vòng đời

- Response chỉ được tính là Đã nhận/Đã cho sau khi submit thành công.
- Draft do người dùng hiện tại viết chỉ thuộc Đã cho.
- Hủy hoặc xóa request chỉ ảnh hưởng lời mời chưa trả lời.
- Response đã submit vẫn được giữ lại khi request bị đóng hoặc hủy.
- Request chuyển sang hoàn tất khi tất cả người được yêu cầu đã submit response; quá hạn là trạng thái riêng và không làm mất response đã nhận.

## Thống kê

- Số Đã nhận đếm response đã submit mà người dùng hiện tại là người nhận.
- Số Đã cho đếm response đã submit mà người dùng hiện tại là người gửi; không đếm draft.
- Giá trị cốt lõi được tổng hợp từ response đã nhận, mỗi response đúng một lần.
- Tiến độ request được tính từ số reviewer có response đã submit trên tổng reviewer hợp lệ.
- Không cộng riêng response lồng trong request nếu response đó đã được tính từ collection response.

## Yêu cầu dữ liệu tối thiểu

`request` cần có `id`, `requesterId`, danh sách reviewer, ngày gửi, hạn, trạng thái và câu hỏi/context.

`response` cần có `id`, `senderId`, `receiverId`, `requestId` tùy chọn, nội dung, chế độ chia sẻ, giá trị cốt lõi, thời gian gửi và trạng thái `draft | submitted`.

Trong prototype, các response đang nằm trong `request.reviewers[].fb` cần được chuẩn hóa thành response độc lập hoặc được ánh xạ qua một hàm duy nhất. Mọi tab, popup và thống kê phải đọc từ cùng nguồn chuẩn hóa này.

## Tiêu chí nghiệm thu

- Một response từ request nhiều người xuất hiện đúng một card trong Đã nhận.
- Request tương ứng vẫn hiển thị đúng tiến độ và mở được response trong popup chi tiết.
- Response chủ động và response từ request dùng cùng layout trong Đã nhận/Đã cho.
- Không có response chưa submit trong Đã nhận.
- Draft trả lời request xuất hiện trong Đã cho với trạng thái Lưu nháp.
- Thống kê và giá trị cốt lõi không bị đếm hai lần.
