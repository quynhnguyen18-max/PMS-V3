# H-05 Foundation and UI Consistency Design

## Mục tiêu

Chuẩn hóa hai màn hình H-05 hiện có trước khi dựng màn chi tiết chương trình: sửa căn lề panel tổng quan, đồng bộ typography với toàn bộ module Feedback, dọn các điểm lệch spec UC5, đồng thời bổ sung data model và test contract để các lỗi tương tự không tái diễn.

## Phạm vi

- `H-05/index.html`: danh sách chương trình và panel tổng quan.
- `H-05/create-campaign.html`: wizard tạo chương trình.
- Data model dùng chung riêng cho H-05.
- Test model, business rule và UI contract.
- Design System: ghi nhận quy tắc phòng ngừa tái diễn nếu nội dung hiện có chưa đủ rõ.
- Không dựng màn chi tiết chương trình hoặc report trong đợt này.

## Kiến trúc

### Data model

Tạo `H-05/feedback-program-model.js` theo UMD pattern đang dùng ở E-04/M-04 để chạy được trực tiếp trong browser và Node test.

Model chịu trách nhiệm cho:

- Chuẩn hóa campaign và question.
- Question type chuẩn là `open_text`; dữ liệu `open` cũ được migrate thành `open_text`.
- Tính scope participant theo actor HRBP/L&OD.
- Tạo assignment duy nhất theo cặp participant × reviewer; self-assessment là assignment riêng và không tạo cặp trùng.
- Validate campaign trước launch.
- Tính trạng thái vòng đời, quá hạn, sắp hết hạn và chờ tạo report.
- Sắp xếp/filter dữ liệu danh sách.
- Serialize/deserialize draft đủ dữ liệu để mở lại theo ID.

HTML chỉ giữ seed demo, state giao diện và rendering; không tự định nghĩa lại business rule.

## UI danh sách chương trình

### Panel tổng quan

Mọi dòng trong cả “Tổng quan” và “Cần chú ý” dùng cùng một grid hai cột:

```css
grid-template-columns: minmax(0, 1fr) 28px;
align-items: center;
```

- Nhãn căn trái.
- Số căn phải và dùng `font-variant-numeric: tabular-nums`.
- Không dùng `justify-content: space-between` cho từng biến thể row.
- Dòng có thể click và dòng chỉ đọc giữ cùng padding, chiều cao và type scale.
- Chỉ màu semantic của trạng thái thay đổi; geometry không đổi.

### Bảng chương trình

- Header và row dùng chung một `grid-template-columns` duy nhất.
- Mọi cột căn đỉnh bằng `align-items:start`.
- Cột chevron có chiều rộng cố định.
- Metadata không dùng dấu chấm tròn để phân cách; dùng dấu gạch ngang ngắn khi thật sự cần ghép metadata.
- Các số ngắn không xuống dòng.

## Typography contract

H-05 dùng Public Sans và type scale đang được áp dụng ở E-04/M-04:

| Vai trò | Cỡ chữ | Weight |
|---|---:|---:|
| Page title | 18px | 700 |
| Page description | 12.5px | 400 |
| Section/card title | 14–15px | 700 |
| Primary row title | 13–13.5px | 600 |
| Body/form input | 13px | 400–500 |
| Button | 12.5px | 600 |
| Status/stat value | 12.5px | 600–700 |
| Metadata/helper | 11.5px | 400 |
| Table/section eyebrow | 11px | 600–700 |

Không dùng `22px` cho page title hoặc phóng lớn số thống kê chỉ để tạo nhấn mạnh.

## Wizard và consistency nghiệp vụ

- Bỏ wording “chọn tình huống sử dụng”; Phase 1 không có scenario field.
- Xóa CSS scenario không còn được render.
- UI gọi template là “bộ câu hỏi”.
- `Hạn phản hồi` bắt buộc và phải sau ngày tạo.
- Launch bắt buộc có mục tiêu, ít nhất một participant, ít nhất một reviewer và ít nhất một câu hỏi `open_text` không rỗng.
- Draft lưu đầy đủ participants, reviewers, questions, self-assessment, anonymity, due date, reminder và template snapshot.
- “Tiếp tục thiết lập” truyền campaign ID và mở đúng draft.
- Không thêm màn hình chi tiết trong phạm vi này.

## Test strategy

Tạo `H-05/h05.test.js` bằng `node:test` và `node:assert`.

### Model tests

- HRBP chỉ lấy participant trong division phụ trách.
- L&OD loại HR division khỏi participant pool.
- Reviewer pool không bị giới hạn division.
- Assignment không trùng và self-assessment được tách riêng.
- Question `open` cũ migrate thành `open_text`.
- Validation trả đúng lỗi cho từng trường bắt buộc.
- Lifecycle phân biệt draft, collecting, overdue và closed.
- Due-soon dùng ngưỡng 3 ngày.
- Closed + report none được xếp vào nhóm chờ tạo báo cáo.
- Draft round-trip giữ đủ dữ liệu và ID.

### UI contract tests

- Page title là 18px và page description là 12.5px ở cả hai màn.
- Panel tổng quan dùng grid cố định `1fr 28px`, số căn phải và tabular numerals.
- Header/row bảng dùng chung column template và `align-items:start`.
- Không còn wording hoặc CSS scenario cũ.
- Wizard sử dụng `open_text`, gọi model validation và truyền draft ID.

## Cơ chế phòng ngừa dài hạn

1. **Shared token contract:** màn mới chỉ dùng type scale, semantic color và spacing đã ghi trong Design System; không tự tạo page title/stat size mới.
2. **Shared component geometry:** list/table header và row lấy cùng CSS custom property cho column template; summary rows dùng một class duy nhất.
3. **Model-first:** business rule nằm trong file model có test, không nằm rải rác trong handler HTML.
4. **UI contract tests:** kiểm tra các token và layout invariant dễ tái phạm như font, fixed action column, top alignment và metadata separator.
5. **Visual QA gate:** trước khi chốt mỗi màn list/table, kiểm tra ở desktop chuẩn và breakpoint hẹp theo checklist Design System.
6. **No silent divergence:** nếu một màn cần ngoại lệ so với Feedback module, ngoại lệ phải được ghi vào Design System trước khi code.

## Tiêu chí hoàn thành

- Panel tổng quan thẳng hàng ở cả nhãn và số.
- H-05 có typography cùng hierarchy với E-04/M-04.
- Data model H-05 độc lập và được HTML sử dụng.
- Draft có thể mở lại đúng dữ liệu.
- Không còn inconsistency đã liệt kê trong review ngày 12/08/2026.
- Toàn bộ test H-05, E-04 và M-04 đạt; `git diff --check` sạch.
