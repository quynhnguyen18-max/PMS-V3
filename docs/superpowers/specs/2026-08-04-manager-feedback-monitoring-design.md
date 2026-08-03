# Manager Feedback Request Monitoring Design

## Mục tiêu

Hoàn thiện Phase D4 / MR-2 trên `M-04` để quản lý có thể quay lại theo dõi các yêu cầu phản hồi đã tạo, nhận biết nhanh tiến độ, pending và overdue, xem chi tiết theo từng nhân viên và nhắc người chưa trả lời mà không làm rối mục tiêu chính của màn hình là xem feedback nhân viên nhận được.

Thiết kế đồng thời chuẩn bị đúng vị trí cho D5 / MR-3 AI Coaching Summary nhưng D4 không tạo nội dung AI giả lập ngoài dữ liệu mẫu phục vụ bố cục.

## Kiến trúc thông tin cấp màn hình

Màn `M-04` có một page header và hai chế độ nội dung cùng cấp.

### Page header

- Tiêu đề: **Phản hồi của nhân viên**.
- Chu kỳ ở góc trên bên phải, giữ UI compact hiện tại.
- Chỉ có một CTA hồng: **Tạo yêu cầu phản hồi**.
- Không đặt nút monitoring hoặc AI cạnh CTA này.

### Content mode 1 — Phản hồi nhân viên

- Là chế độ mặc định khi mở `M-04` lần đầu.
- Giữ nguyên Direct reports / Indirect reports, filter, List View, Split View, popup và trang chi tiết hiện tại.
- Không đưa số liệu request vào bảng feedback nhân viên.

### Content mode 2 — Yêu cầu đã tạo

- Tab luôn hiển thị cạnh **Phản hồi nhân viên**.
- Có badge nhỏ thể hiện số request trong chu kỳ hiện tại; badge là thông tin trung tính, không phải CTA.
- Chứa toàn bộ monitoring D4.
- Sau khi tạo request thành công, CTA **Xem tiến độ yêu cầu** chuyển thẳng sang mode này và chọn request vừa tạo.
- Khi user quay lại M-04 ở phiên sau, mode vẫn là điểm truy cập cố định để xem request cũ.

Hai mode dùng tab chữ nhẹ, chỉ active state dùng màu brand. Không render thành hai nút CTA lớn.

## Monitoring overview

Phía trên danh sách request hiển thị ba thống kê compact, font bình thường và màu trung tính:

- **Đã nhận:** `done/total` assignment.
- **Chờ trả lời:** số assignment pending.
- **Quá hạn:** số assignment pending đã qua hạn.

Không dùng các KPI card lớn hoặc màu hồng cho số liệu. Quá hạn dùng tag neutral có icon để dễ quét và không tạo thêm màu semantic mới.

## Danh sách request

Danh sách được tổ chức theo request do quản lý tạo, không tổ chức theo nhân viên ở cấp đầu tiên. Mỗi dòng gồm:

- Tên/câu hỏi request; nếu câu hỏi cá nhân hóa thì hiển thị nhãn ngắn **Câu hỏi theo từng người**.
- Ngày tạo.
- Số nhân viên được nhận phản hồi.
- Hạn phản hồi.
- Tiến độ `done/total` kèm progress bar xám/hồng nhẹ.
- Trạng thái: Đang thu thập, Hoàn thành hoặc Quá hạn.
- Chức năng mở chi tiết.

Request mới nhất đứng trước. Danh sách đọc theo chu kỳ đang chọn ở page header.

## Request detail

Click một request mở vùng chi tiết trong cùng mode **Yêu cầu đã tạo**. Dùng split view để tránh popup lồng nhiều cấp:

- Cột trái: danh sách nhân viên thuộc request, mỗi dòng có `done/total`, pending và overdue.
- Cột phải: nhân viên đang chọn.

Cột phải gồm:

1. Header nhân viên: Họ tên (domain) - Phòng ban - Team - Vị trí.
2. Tiến độ feedback của nhân viên.
3. Danh sách assignment theo reviewer:
   - Reviewer name (domain).
   - Câu hỏi đã gửi.
   - Trạng thái Đã trả lời / Chưa trả lời / Quá hạn.
   - Thời gian trả lời nếu có.
   - Nút **Nhắc** nếu pending.
4. Vùng dành cho D5 AI Coaching Summary nằm sau khi có response; trong D4 chỉ render placeholder trạng thái phù hợp, không sinh summary giả từ production logic.

Mặc định chọn nhân viên đầu tiên trong request. Khi đổi request, chọn lại nhân viên đầu tiên của request mới.

## Nhắc người chưa trả lời

- Chỉ assignment pending mới có nút **Nhắc**.
- Sau khi nhắc, hiển thị **Đã nhắc dd/mm/yyyy** và disable nhắc lại trong cùng ngày.
- Sang ngày khác có thể nhắc lại.
- Có action **Nhắc tất cả người chưa trả lời** ở request detail nếu còn pending.
- Bulk remind chỉ tác động assignment pending; assignment done không thay đổi.
- Prototype chỉ cập nhật trạng thái UI/data local, không gửi thông báo thật.

## Data model và persistence

### Request store

Mở rộng `ManagerRequestModel.createStore()` để:

- Khởi tạo từ danh sách request seed hoặc dữ liệu persisted.
- Upsert request theo `id`.
- Lấy request theo `id`.
- Lọc theo cycle.
- Tổng hợp toàn bộ assignment theo cycle.
- Cập nhật reminder metadata trên assignment.

### Assignment bổ sung

Assignment giữ các field D3 và bổ sung:

- `remindedAt: null | 'dd/mm/yyyy'`.
- `responseId: null | string` để D5/D6 nối tới response chuẩn hóa mà không copy response.

Không nhân bản nội dung response vào request store.

### Persistence prototype

- Dùng `localStorage` với key versioned: `pms.managerFeedbackRequests.v1`.
- Khi load M-04: đọc localStorage; nếu chưa có dữ liệu thì seed request mẫu.
- Sau create request, remind hoặc cập nhật trạng thái: persist lại store.
- Nếu JSON lỗi: bỏ dữ liệu lỗi và fallback seed, không làm hỏng màn hình.
- Dữ liệu chỉ là prototype. Bản thật thay localStorage bằng backend nhưng giữ cùng shape model.

### Seed data

Seed ít nhất ba request chu kỳ 2026 để thể hiện đủ:

1. Request đang thu thập, chưa quá hạn, có cả done và pending.
2. Request quá hạn, có pending và reminder history.
3. Request hoàn thành 100%.

Mỗi request có từ hai nhân viên và nhiều reviewer để kiểm tra split view, self-review skip, shared/personalized questions và aggregation.

## Trạng thái và tính toán

- `done`: assignment có `status === 'done'`.
- `pending`: assignment chưa done.
- `overdue`: pending và `today > request.due`.
- `rate`: `Math.round(done / total * 100)`; total 0 thì rate 0.
- Request **Hoàn thành** khi pending = 0.
- Request **Quá hạn** khi overdue > 0.
- Còn lại là **Đang thu thập**.

Thứ tự ưu tiên trạng thái: Hoàn thành → Quá hạn → Đang thu thập.

## AI Coaching Summary — vị trí cho D5

AI summary không là tab hay CTA cấp màn hình. Nó thuộc request detail và gắn với nhân viên đang chọn.

D5 sẽ hiển thị:

- Điểm mạnh.
- Cơ hội phát triển.
- Chủ đề lặp lại.
- Dòng bắt buộc: **Coaching evidence, không phải điểm đánh giá.**

Trong D4, vùng này chỉ hiển thị empty/pending state, ví dụ **Cần thêm phản hồi để tạo tóm tắt**, dựa trên số response đã nhận.

## Navigation và state

- `STATE.contentMode`: `'feedback' | 'requests'`.
- `STATE.selectedRequestId`.
- `STATE.selectedRequestEmployeeId`.
- Đổi cycle render lại cả feedback mode và request mode.
- Tạo request xong không đóng mất ngữ cảnh: CTA **Xem tiến độ yêu cầu** đóng popup, chuyển sang request mode và chọn request vừa tạo.
- Search/filter feedback không bị reset khi chuyển sang request mode rồi quay lại.

## Responsive

- Desktop: request detail dùng split view hai cột.
- Màn hẹp: employee rail nằm trên detail pane, không tạo horizontal scroll cho toàn trang.
- Table request được phép horizontal scroll trong wrapper nếu cột không thể co thêm.
- CTA, cycle và content tabs wrap nhưng không chồng lấn.

## Accessibility

- Content tabs dùng `role="tablist"`, `role="tab"`, `aria-selected` và liên kết panel.
- Row/action có label rõ ràng.
- Progress có text `done/total`, không phụ thuộc màu.
- Nút nhắc có disabled state và text trạng thái.
- Empty state có nội dung và CTA tạo request khi chưa có dữ liệu.

## Tiêu chí nghiệm thu D4

- M-04 chỉ có một CTA primary ở page header.
- Hai content mode luôn dễ nhận biết nhưng không giống hai CTA.
- Feedback mode hiện tại không bị regress.
- Request mode lọc đúng theo cycle và có số liệu tổng chính xác.
- Danh sách request hiển thị đủ ba trạng thái.
- Click request và employee cập nhật đúng assignment detail.
- Reminder chỉ áp dụng pending và khóa trong cùng ngày.
- Request tạo mới tồn tại sau refresh bằng localStorage.
- localStorage lỗi fallback seed an toàn.
- Response không bị copy vào request store.
- AI summary chỉ có vị trí/empty state; không triển khai MR-3 trong D4.
- Test E-04 và M-04 đều pass; inline JavaScript parse được; `git diff --check` sạch.
