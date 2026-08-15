# Feedback Programs (UC5) — Structured Feedback do HR khởi tạo

## Mục tiêu

Cho phép HRBP và L&OD khởi tạo các chương trình thu thập phản hồi có cấu trúc, template hóa, phục vụ nhiều mục tiêu nhân sự (Performance Review, Talent/Leadership Program, Succession/High Potential, 360 Feedback).

Về bản chất nghiệp vụ giống feedback request của line manager ở `M-04`, nhưng do HR khởi tạo, có ngân hàng câu hỏi/template dùng chung, phạm vi rộng hơn team, và có tầng báo cáo per-participant do AI tổng hợp.

**UC5 là một module HR độc lập.** Không dựng chung màn với M-04. Reviewer trả lời phản hồi vẫn ở `E-04` (chung inbox với request của quản lý).

## Phạm vi

### Phase 1 (spec này)
- Câu hỏi **chỉ dạng open-text**.
- Báo cáo dựa trên **AI themes** (điểm mạnh + cơ hội cải thiện), mang tính tham khảo.
- **Không build UI riêng cho 360 Feedback** (self vs peers vs subordinates, ma trận quan hệ) — để Phase 2.
- Form tạo campaign **không có field phân loại "tình huống sử dụng"**. Campaign được định danh bằng **Mục tiêu** (giống `goal` của M-04), không phân loại theo scenario.
- Template trong thư viện gọi là **"bộ câu hỏi"** trên UI.

### Chuẩn bị cho Phase 2 (không build ngay)
- Toàn bộ **360 Feedback**: ma trận quan hệ reviewer (self/manager/peer/subordinate), báo cáo gap self-vs-others.
- Thêm loại câu hỏi **rating (Likert)**, cấu hình thang điểm ở **cấp câu hỏi**.
- Data model câu hỏi phải có sẵn field `type` (`open_text` | `rating`); trình tạo câu hỏi để sẵn ô chọn loại nhưng tạm khóa ở `open_text`. Mục tiêu: Phase 2 lắp thêm không phải đập đi làm lại.
- Báo cáo dạng rating (tổng hợp điểm, phân phối, so sánh nhóm reviewer, gap self-vs-others cho 360) là việc của Phase 2.

## Actor & phân quyền

| Actor | Được chỉ định **Participant** (người nhận feedback) | Được chỉ định **Reviewer** (người cho feedback) |
|---|---|---|
| HRBP | Chỉ người thuộc division họ phụ trách | Bất kỳ ai trong công ty |
| L&OD | Mọi division **trừ HR division** | Bất kỳ ai trong công ty |

- HR chỉ định thẳng cả participant lẫn reviewer, **không cần bước duyệt**.
- Không ràng buộc số reviewer tối thiểu (kể cả 360).

## Khái niệm & data model

### Template (thư viện tham khảo)
- HRBP hoặc L&OD chủ động tạo template, **không cần duyệt**.
- L&OD có thể tạo sẵn template dùng chung theo policy công ty để HRBP lấy dùng và adjust.
- **Template chỉ để tham khảo.** Khi HR đưa template vào một campaign, campaign **chụp một bản sao đóng băng (snapshot)**:
  - HRBP sửa template lúc tạo campaign → chỉ ảnh hưởng campaign đó, không đụng template gốc.
  - L&OD cập nhật template gốc về sau → **không** hồi tố vào campaign đã launch.
- Không cần quản lý lịch sử version (v1/v2/v3). Chỉ cần cơ chế snapshot ở trên.

### Question
```js
{
  id: string,
  type: 'open_text',   // Phase 2: | 'rating'
  text: string
  // Phase 2 (rating): scale, labels...
}
```
- Một campaign có thể chỉ 1 câu hỏi, vài câu hỏi rời, hoặc dùng nguyên một template.

### Campaign (request)
- Đơn vị chương trình. Quy mô định nghĩa theo từng campaign, không lên tới vài trăm/nghìn người mỗi campaign.
- Trạng thái: **Nháp → Đang thu thập → Đóng**. Không có bước approval trước khi launch.
- Config gồm: participants, reviewers, due date, reminders, anonymity, visibility, questionnaire (Phase 2: rating scale).

### Participant / Reviewer
- Chọn participant **theo domain**.
- Hỗ trợ **import hàng loạt qua Excel/CSV**.
- Tùy chọn **"Bao gồm participant tự đánh giá"** ở bước chọn reviewer (mặc định tắt). Khi bật, participant là reviewer về chính mình; response tự đánh giá được tách riêng, gắn nhãn **"Tự đánh giá"** trong report.

### Assignment
- Tái dùng nguyên tắc M-04: **1 assignment = 1 cặp (participant × reviewer)**, không nhân bản nội dung response.

## Luồng nghiệp vụ

1. HR tạo campaign (hoặc lấy template rồi adjust — tạo snapshot).
2. Config participants (theo domain / import CSV).
3. Config reviewers (+ tùy chọn self-assessment).
4. Config due date, reminders, anonymity, visibility, questionnaire.
5. Launch → chuyển **Đang thu thập**. Reviewer nhận task ở `E-04`.
6. Monitor completion / response rate / participation.
7. HR chủ động **Đóng** campaign.
8. HR bấm **Tạo report** → AI sinh report **per-participant**.
9. HR bấm **Publish** để chia sẻ report (phạm vi giới hạn — xem Visibility).

## Business rules

### Sửa sau khi launch (Đang thu thập)
Nguyên tắc: chỉ cho thao tác **cộng thêm hoặc nới lỏng**; cấm thao tác phá dữ liệu đã thu.
- **Khóa cứng:** câu hỏi/template, chế độ ẩn danh, rút ngắn due.
- **Cho phép:** gia hạn due (chỉ lùi xa hơn), gửi reminder, **bổ sung thêm** participant/reviewer, đóng sớm.
- **Không cho:** xoá reviewer/participant đã có phản hồi.

### Ẩn danh (Anonymous vs Named)
- Cấu hình theo từng campaign, HR chọn trước khi gửi.
- **Anonymous:** participant **không** biết ai đã cho feedback, trừ khi HR chủ động chọn hiển thị danh tính trước khi gửi request.
- **Reviewer luôn** thấy rõ từng câu hỏi/từng request mình cần trả lời là **cho ai/về ai** và **ai là người gửi** (HR / tên chương trình).
- Reviewer **không** được chọn chế độ chia sẻ — chế độ này do HR (người tạo request) config.

### Reminder
- **Dùng lại cơ chế của M-04:** tự động nhắc trước hạn (mặc định 3 ngày) + nhắc thủ công, với cùng ràng buộc cooldown/không nhắc khi đã done/quá hạn.

## Trải nghiệm Reviewer ở E-04

Reviewer nhận và trả lời task ngay trong inbox chung ở `E-04`. Cần giúp họ phân biệt với request của line manager nhưng **wording mềm, không gắn mác "HR"**:
- **Badge/nhóm theo tên chương trình** HR đặt (vd "Đánh giá năng lực Q3").
- Nhãn nhóm trung tính: **"Phản hồi theo chương trình"** (không dùng "Từ chương trình HR").
- Dòng người gửi hiện **tên chương trình + người khởi tạo là HR** (thay vì line manager).
- Điểm khác thực chất: participant có thể là **bất kỳ ai trong công ty**, không chỉ trong team.
- Tái dùng feedback card + identity rule của E-04/M-04, không tạo biến thể mới.

## Report

- **Thời điểm sinh:** sau khi HR chọn **Đóng** campaign **và** bấm nút **Tạo report** (không tự sinh, không cần đủ 100% phản hồi).
- **Cấp độ:** báo cáo **per-participant**.
- **AI themes** tổng hợp từ open-text, mang tính tham khảo, chia 2 khía cạnh: **điểm mạnh** và **cơ hội cải thiện**.
- Response tự đánh giá (nếu bật) tách riêng, gắn nhãn "Tự đánh giá".
- Xem trên web; hỗ trợ **export PDF**.

### Visibility / chia sẻ report
- Report **không** tự công khai. HR phải bấm **Publish** mới chia sẻ.
- Phạm vi xem giới hạn: **HR + quản lý** (khi được share). **Không** phải tất cả; **không** mặc định cho nhân viên tự xem.

### Feed vào hồ sơ nhân viên
- Output feed vào hồ sơ nhân viên **chỉ sau khi HR publish** (không tự đẩy khi Đóng).
- Trong hồ sơ, quản lý (nếu được share) xem được report theo từng nhân viên.

## Khác biệt so với M-04 (line manager request)

| | M-04 (UC3/UC4) | UC5 (spec này) |
|---|---|---|
| Người khởi tạo | Line manager | HRBP / L&OD |
| Participant | Direct report (lm1, no skip-level) | Theo phân quyền division của HR |
| Reviewer | Do manager chọn | Cả công ty |
| Template/ngân hàng câu hỏi | Không | Có (snapshot khi dùng) |
| Ẩn danh | Luôn `shared` | Config Anonymous/Named per campaign |
| Report | AI coaching summary theo ngữ cảnh | AI report per-participant, HR publish |
| Feed hồ sơ nhân viên | Không | Có, sau publish |

## Open items / cần chốt sau (không chặn Phase 1)

- Chi tiết trình bày report per-participant (layout, cách hiển thị nhiều reviewer).
- Cơ chế "quản lý được share" ánh xạ vào module hồ sơ nhân viên cụ thể nào.
- Toàn bộ hạng mục Phase 2 (rating/Likert và báo cáo tương ứng).
