# Manager Feedback Request List Redesign

## Mục tiêu

Thiết kế lại chế độ quản lý yêu cầu phản hồi trên `M-04` để quản lý có thể theo dõi 20–30 request trong một chu kỳ mà không bị ngợp bởi chữ, nhận biết nhanh mục tiêu, phạm vi, tiến độ và rủi ro thời hạn, đồng thời mở nội dung dài ở một trang chi tiết riêng.

Thiết kế bám mockup được duyệt `request-list-only-v5.html` và tái sử dụng ngôn ngữ hiển thị người/feedback đã chốt trên màn nhân viên `E-04`.

## Điều hướng cấp màn hình

- Page title giữ **Phản hồi của nhân viên**.
- Page header chỉ có một primary CTA: **Tạo yêu cầu phản hồi**.
- Hai content tab rút gọn thành:
  - **Phản hồi**.
  - **Yêu cầu** kèm badge số request của chu kỳ.
- Tab dùng segmented control có border ngoài, active state nền hồng nhạt để user nhận biết rõ có thể click.
- Không đặt AI hoặc monitoring action ở page header.

## Trường bắt buộc khi tạo request

- Bổ sung trường **Mục tiêu** và bắt buộc nhập.
- Mục tiêu là khóa định danh hiển thị ở danh sách, Kanban và trang chi tiết.
- Câu hỏi không được dùng làm tên request.
- Shared question và personalized question vẫn giữ model hiện tại và chỉ hiển thị trong trang chi tiết.

## Chế độ Danh sách

Danh sách là view mặc định. Mỗi row đại diện đúng một request và có ba nhóm thông tin.

### Mục tiêu

- Hiển thị mục tiêu request.
- Ngày tạo nằm ở dòng metadata bên dưới.
- Không hiển thị nội dung câu hỏi.

### Nhân viên nhận feedback

- Hiển thị tối đa hai tên, sau đó là **và n người khác**.
- Không hiển thị thêm dòng số nhân viên hoặc số lượt phản hồi kỳ vọng.
- Hover tên hoặc **và n người khác** hiển thị danh sách đầy đủ theo identity rule.

### Tiến độ và thời hạn

- Gộp progress và status vào cùng một cột.
- Các state điển hình:
  - `4/9 đã trả lời` và `Còn 11 ngày`.
  - `2/6 đã trả lời` và `Quá hạn 3 ngày`.
  - `4/4 đã trả lời` và `Hoàn tất`.
- Dòng phụ chỉ hiển thị số chưa trả lời khi còn pending.
- Progress bar là tín hiệu phụ; text là nguồn thông tin chính.
- Không có cột trạng thái riêng.

### Toolbar và tải thêm

- Không có ô tìm kiếm.
- Toolbar căn phải và chỉ có:
  - **Bộ lọc**: gom trạng thái và thời hạn.
  - **Danh sách**.
  - **Kanban**.
- Danh sách render 10 request đầu tiên theo ngày tạo mới nhất.
- Cuối danh sách có **Xem thêm 10 yêu cầu** và dòng `Đang hiển thị x trong y yêu cầu`.
- Không dùng phân trang số.
- Xem thêm giữ nguyên vị trí cuộn, filter, cycle và view mode.

## Chế độ Kanban

- Kanban là view mode phụ, không phải tab cấp màn hình.
- Ba lane: **Đang thu thập**, **Quá hạn**, **Hoàn tất**.
- Mỗi card vẫn đại diện một request và dùng cùng dữ liệu với list row.
- Card chỉ hiển thị mục tiêu, nhân viên rút gọn, tiến độ và hạn.
- Đổi view không reset filter hoặc số item đã tải.

## Mở chi tiết request

- Click toàn bộ list row hoặc Kanban card mở route riêng, không popup và không expand inline.
- Route đề xuất: `M-04/request-detail.html?request=<id>&cycle=<cycle>`.
- Back về danh sách khôi phục content tab, filter, view mode, số item đã tải và vị trí cuộn.
- Có thể mở route trong tab trình duyệt mới bằng hành vi chuẩn của link.

## Trang chi tiết request

Trang chi tiết không lặp lại summary ở nhiều vùng.

- Header chỉ có:
  - Breadcrumb.
  - Mục tiêu.
  - Ngày tạo và hạn.
  - Một dòng tiến độ tổng hợp.
- Cột trái: danh sách nhân viên nhận feedback và tiến độ của từng người.
- Cột phải: feedback của nhân viên đang chọn.
- Pending reviewer nằm trong nhóm riêng, không trộn với feedback đã nhận.
- AI Coaching Summary chỉ xuất hiện một lần trong ngữ cảnh nhân viên đang chọn và chỉ khi đủ điều kiện D5.

### Quy tắc câu hỏi

- Request dùng shared question: hiển thị câu hỏi một lần ở đầu feed của nhân viên; không lặp trên từng response card.
- Request dùng personalized question: mỗi response card và pending reviewer hiển thị đúng câu hỏi đã giao cho reviewer đó.
- Không có response thuộc request mà thiếu ngữ cảnh câu hỏi.

### Feedback card

Tái sử dụng component/rule từ `E-04`, không tạo biến thể mới cho quản lý:

- Cấu trúc `Người cho ▸ Người nhận`; mũi tên là tam giác xám đậm.
- Avatar chỉ ở người đứng đầu câu.
- Dòng metadata: ngày trước icon chế độ chia sẻ.
- Core-value icon ở góc trên bên phải box.
- Không hiển thị org/position trực tiếp trên card; hover tên mới hiển thị.
- Nội dung phản hồi hiển thị đầy đủ hoặc theo cùng rule expand đã dùng ở employee view.

## Identity rule toàn module

- Khi đủ không gian: `Họ tên (domain)`.
- Metadata mở rộng: `Phòng ban - Team - Vị trí`.
- Ở compact list, chỉ hiển thị tên; hover hiển thị `Họ tên (domain) - Phòng ban - Team - Vị trí`.
- Không dùng dấu chấm giữa metadata.
- Không lặp org/position của cùng một người trong cùng một component.

## Data model

Request bổ sung field bắt buộc:

```js
goal: string
```

- Seed request phải có goal rõ nghĩa.
- Request cũ trong localStorage chưa có goal dùng migration fallback từ câu hỏi shared hoặc nhãn `Yêu cầu phản hồi ngày dd/mm/yyyy`.
- Dữ liệu list và Kanban đọc cùng request store; không tạo bản sao.
- Response content tiếp tục được tham chiếu bằng `responseId`, không copy vào request object.

## Responsive

- Desktop: list table ba nhóm thông tin.
- Màn hẹp: mỗi request trở thành stacked row theo thứ tự Mục tiêu → Nhân viên → Tiến độ.
- Toolbar wrap nhưng giữ Bộ lọc và view mode trong cùng vùng.
- Nút Xem thêm luôn nằm cuối danh sách.
- Trang detail trên màn hẹp xếp employee rail phía trên feed.

## Acceptance criteria

- Hai tab rõ ràng và nhận biết được là interactive.
- Một primary CTA duy nhất ở page header.
- Trường Mục tiêu bắt buộc trong form tạo request.
- List là default, Kanban là secondary view.
- Không có search box hoặc numeric pagination.
- List row không lặp số nhân viên/số lượt kỳ vọng dưới cột nhân viên.
- Progress và status nằm cùng một cột.
- Xem thêm tải theo batch 10.
- Click request mở trang detail riêng.
- Detail không render dưới list và không dùng popup.
- Shared/personalized question hiển thị nhất quán.
- Identity và feedback card tái sử dụng đúng rule E-04.
- localStorage request cũ được migrate an toàn.
- E-04 và M-04 tests pass; inline JavaScript parse; `git diff --check` sạch.
