# H-06 — Chi tiết chương trình phản hồi

## Mục tiêu

Cho HR theo dõi một chương trình phản hồi đang thu thập và đọc chi tiết phản hồi của từng nhân viên ngay trên một màn hình. Màn hình phải giảm số lần chuyển ngữ cảnh: HR thấy người cần xử lý nhất ngay khi mở, có thể đổi sang người khác ở panel trái, đọc evidence ở giữa và theo dõi tiến độ chương trình ở panel phải.

H-06 là màn chi tiết mở từ một chương trình tại `H-05`. Đây không phải màn tạo chương trình, không phải màn báo cáo và không thay thế cho màn quản lý request của quản lý.

## Phạm vi

- Tạo route/màn `H-06` cho chi tiết một chương trình phản hồi.
- Mặc định mô phỏng trạng thái chương trình `Đang thu thập` với đủ tình huống: quá hạn, sắp hạn, đang chờ và đã đủ phản hồi.
- Reuse các component Feedback hiện có: avatar, tooltip nhân sự, badge giá trị cốt lõi, câu hỏi và câu trả lời dạng conversational pair, AI Summary, trạng thái semantic, reminder.
- Dùng data model H-05 làm nguồn sự thật cho chương trình, participant, assignment, progress và lifecycle.
- Không dựng report kết thúc chương trình, export hay dashboard tổng hợp mới trong màn này.

## Cấu trúc màn hình

### Header chương trình

Header chỉ có một nguồn thể hiện trạng thái cấp chương trình:

- Breadcrumb: `Phản hồi / Chương trình / Chi tiết`.
- Tên chương trình.
- Metadata: ngày tạo và hạn phản hồi, ngăn bởi ` - ` khi cần ghép trên một dòng.
- Một semantic progress chip ở bên phải, ví dụ `Đang thu thập: 12/40 đã trả lời`.

Không lặp text `Đang thu thập` tại panel trái, panel giữa hoặc panel phải. Các phần bên dưới dùng số liệu hoặc trạng thái cấp nhân viên khi cần ra quyết định.

### Panel trái — Nhân viên nhận phản hồi

Panel trái là bộ điều hướng, không phải bảng thông tin đầy đủ.

- Header: `Nhân viên nhận phản hồi` và tổng số nhân viên.
- Mỗi dòng gồm avatar, `Họ tên (domain)` và một metadata ngắn về mức độ hoàn thành / rủi ro.
- Nhân viên đang chọn có nền brand-muted và left indicator hồng.
- Trạng thái theo nhân viên dùng copy ngắn, ví dụ `1/4 đã trả lời - Quá hạn 2 ngày`, `2/4 đã trả lời - Còn 2 ngày`, hoặc `4/4 đã trả lời`.
- Tooltip tại tên hiển thị `Phòng ban - Team - Vị trí`, theo shared tooltip hiện có.
- Danh sách mặc định sắp xếp theo ưu tiên xử lý. Hạn thuộc cấp chương trình, nên các nhân viên chưa đủ phản hồi trong cùng một chương trình cùng chia sẻ một bối cảnh hạn. Vì vậy không tạo trạng thái thời hạn cá nhân giả:
  1. nhân viên chưa đủ phản hồi, tỷ lệ trả lời thấp hơn trước;
  2. nếu cùng tỷ lệ, theo tên;
  3. nhân viên đã đủ phản hồi luôn ở cuối.

Màn hình tự chọn dòng đầu tiên theo thứ tự này khi mở.

### Panel giữa — Chi tiết phản hồi của nhân viên

Đây là vùng đọc chính và là vùng duy nhất cuộn nội dung khi feedback dài.

- Header: `Phản hồi đã nhận của [Họ tên]`.
- Metadata một dòng: `[n] phản hồi đã nhận - [n] phản hồi đang chờ`.
- Ngay dưới header là tally các badge giá trị cốt lõi đã được ghi nhận. Icon-only, hover dùng tooltip đen chữ trắng theo Design System.
- Câu hỏi dùng nền hồng nhạt, border-left hồng và label `Câu hỏi` màu xám; chiều rộng nền luôn đủ vùng nội dung, không co theo độ dài text.
- AI Summary chỉ hiển thị khi nhân viên có từ 2 phản hồi trở lên. Summary chỉ đọc, có thể collapse, tự cập nhật khi có phản hồi mới và chỉ gồm `Điểm mạnh` cùng `Cơ hội phát triển`.
- Mỗi phản hồi đã nhận chỉ hiển thị người cho, ngày nhận, badges và nội dung. Tên có tooltip tổ chức/vị trí; không lặp người nhận hoặc icon sharing vì ngữ cảnh nhân viên đã rõ.
- Người chưa trả lời thể hiện như một dòng pending rõ ràng, không render card feedback rỗng. Khi quá hạn, dùng text/icon đỏ semantic.

### Panel phải — Tổng quan chương trình và hành động

Panel phải sticky, compact và không lặp trạng thái `Đang thu thập`.

- Header: `Tổng quan chương trình`.
- Các dòng số liệu căn chung grid `label | value`: nhân viên nhận phản hồi, người cho phản hồi, phản hồi đang chờ và số người đang bị ảnh hưởng bởi quá hạn. Đây là số liệu theo dõi, không lặp lại trạng thái chương trình ở header.
- Không dùng background vàng cho toàn panel hoặc action card. Panel nền trắng/trung tính; chỉ marker/số/copy rủi ro dùng màu semantic khi cần.
- Khối `Cần xử lý` chỉ xuất hiện khi có pending hoặc overdue. Nền trung tính, border zinc; số quá hạn dùng đỏ semantic.
- Nút reminder là button secondary compact có icon chuông và text `Nhắc`. Nút có tooltip `Nhắc các người chưa trả lời đang đủ điều kiện nhận nhắc`; chỉ enable khi ít nhất một assignment qua cooldown 24 giờ và còn trước hạn.

## Quy tắc không lặp thông tin

Mỗi thông tin có một vị trí đọc chính trong cùng một màn hình:

| Thông tin | Vị trí chính |
|---|---|
| Trạng thái chương trình và tổng tỷ lệ trả lời | Header chương trình |
| Rủi ro / mức độ hoàn thành từng nhân viên | Panel trái |
| Câu hỏi, evidence, badges và AI Summary của nhân viên đang chọn | Panel giữa |
| Quy mô chương trình, pending/overdue tổng và action hàng loạt | Panel phải |

Không sao chép lại cùng một label/trạng thái sang panel khác chỉ để lấp chỗ trống. Khi cần tham chiếu, hiển thị chỉ số bổ sung có ý nghĩa khác hoặc dẫn người dùng về vùng thông tin chính.

## Quy tắc phân tách metadata

Không dùng dấu chấm giữa các mảnh metadata hoặc nội dung ngắn, bao gồm `·` và `.` dạng separator. Khi cần ghép các metadata trên một dòng, dùng dấu gạch ngang ngắn với khoảng trắng hai bên: `Họ tên (domain) - Phòng ban - Team - Vị trí`.

## Data và interaction contract

Mỗi participant detail cần có:

- `employee`: id, name, domain, organization metadata, avatar.
- `assignments`: reviewer, status, submitted feedback, reminder history, due date.
- `receivedCount`, `expectedCount`, `pendingCount`, `overdueCount`.
- `coreValueTally` chỉ lấy từ feedback đã nhận.
- `aiSummary` được derive từ feedback đã nhận; không có khi ít hơn 2 feedback.

Chọn nhân viên ở panel trái chỉ đổi state detail tại panel giữa, không đổi route hay reset vị trí scroll của toàn trang. Reminder hàng loạt ở panel phải dùng rule reminder H-05/M-04 đã có: mỗi người thủ công tối đa một lần trong 24 giờ, vẫn cho phép trước/sau reminder tự động và không nhắc sau hạn.

## Responsive và accessibility

- Desktop dùng 3 panel: trái 26–30%, giữa flexible, phải 25–28%; middle panel có `minmax(0, 1fr)` để không overflow.
- Khi không đủ chiều rộng, panel phải chuyển xuống sau panel giữa; ở mobile, panel trái thành danh sách chọn phía trên rồi mới đến detail.
- Focus/keyboard selection phải hoạt động cho nhân viên trong panel trái.
- Tooltip phải có `focus-visible`, không chỉ dựa vào hover.
- Không để toàn trang di chuyển khi người dùng đọc một danh sách feedback dài ở panel giữa; dùng internal scroll trong vùng detail desktop.

## Tiêu chí hoàn thành

- Mở H-06 chọn sẵn nhân viên cần xử lý nhất theo priority rule.
- HR đổi nhân viên và thấy detail ngay, không cần popup hoặc tab trung gian.
- Panel phải không lặp status cấp chương trình và không dùng mảng nền vàng.
- Nút `Nhắc` compact, có icon, tooltip và obey reminder cooldown.
- All metadata mới không dùng dấu chấm làm separator.
- UI contract tests bảo vệ layout 3 panel, placement của status, priority rule, non-duplication copy và semantic color budget.
- H-05, H-06, E-04 và M-04 regression tests pass trước khi chốt.
