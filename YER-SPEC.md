# YER SPEC — Đánh giá cuối năm (Year-End Review) 2026

> Chốt ngày 02/09/2026 sau 4 vòng làm rõ với HR. Mọi màn hình YER phải bám file này.
> Design system: `DESIGN-SYSTEM.md`. Dữ liệu dùng chung: `assets/employees-data.js` (KHÔNG sửa) + `assets/yer-data.js` (thêm mới).

---

## 1. Vai trò

| Mã | Vai trò | Phạm vi |
|---|---|---|
| NV | Nhân viên | Hồ sơ của chính mình |
| LM | Quản lý trực tiếp | Nhân viên báo cáo trực tiếp |
| LM2 | Quản lý cấp 2 | Nhân viên của các LM dưới quyền |
| HOD | Trưởng đơn vị | Toàn bộ đơn vị |
| HRBP | HR Business Partner | Đơn vị được phân công - read-only + upload hộ HOD |
| L&OD | Learning & OD | Toàn công ty - read-only + publish |
| TR | Total Reward | Danh sách NV + overall rating các cấp - upload điểm CEO |
| HRD | HR Director | Duyệt điểm final (dùng chung màn TR, khác quyền) |

Một người có thể kiêm nhiều vai trò (LM + LM2 + HOD). UI gộp một màn danh sách, phân tab theo vai trò thực có.

## 2. Luồng và timeline

| Bước | Ai | Thời gian (demo) |
|---|---|---|
| Cut-off đổi Quản lý | HR masterlist | 31/12/2026 |
| Tự đánh giá | NV | 05/01 - 18/01/2027 |
| LM đánh giá chi tiết | LM | 19/01 - 01/02/2027 |
| LM2 đánh giá | LM2 | 02/02 - 15/02/2027 |
| HOD đánh giá | HOD | 16/02 - 01/03/2027 |
| Upload điểm CEO | TR | 02/03 - 15/03/2027 |
| Duyệt điểm final | HRD | 16/03 - 29/03/2027 |
| Publish | L&OD | 30/03/2027 (không dựng UI đợt này) |

Employee Response mở khi LM submit, đóng khi publish. Chạy song song bước LM2/HOD.
Calibration diễn ra offline, không dựng UI.

## 3. Nội dung đánh giá

3 nhóm mục tiêu, giống MYR:
- **Mục tiêu công việc** (what) - `bx-target-lock`
- **Mục tiêu phát triển** (dev) - `bx-line-chart`
- **Mục tiêu hành vi** (how) - 5 giá trị cốt lõi - `bx-heart`

Mỗi bên (NV, LM) nhập: điểm từng mục tiêu + 3 ô nhận xét theo nhóm + điểm toàn diện + nhận xét toàn diện.
KHÔNG có ô nhận xét cho từng mục tiêu riêng lẻ.

LM2/HOD chỉ chấm **điểm toàn diện** + comment tùy chọn. Xem được chi tiết đánh giá của NV và LM để tham khảo.

## 4. Thang điểm

Điểm từng mục tiêu: **số nguyên 1-5**.
Điểm toàn diện (mọi cấp) và final rating: **1-5, bước 0.5**.

| Điểm | Tiếng Việt | English |
|---|---|---|
| 1 | Không đạt yêu cầu | Does Not Meet Expectations |
| 2 | Hoàn thành một phần | Partially Meet Expectations |
| 3 | Hoàn thành kỳ vọng | Meet Expectations |
| 4 | Hoàn thành trên mức kỳ vọng | Exceed Expectations |
| 5 | Hoàn thành vượt xa kỳ vọng | Exceptionally Exceed Expectations |

Mức .5 = vượt trên mức liền trước nhưng chưa đạt trọn vẹn mức kế tiếp. Không tạo định nghĩa riêng.

**UI chọn điểm** - nút chọn giữ kích thước ô trong lưới (khoảng 60px), bảng chọn mở ra hiển thị **toàn bộ thang điểm kèm tên mức, không phải cuộn**.

| | Điểm từng mục tiêu | Điểm toàn diện |
|---|---|---|
| Thang | 1-5 số nguyên, 5 dòng | 1-5 bước 0.5, 9 dòng |
| Chú thích thang điểm trên đầu bảng chọn | Không | Có |
| Định nghĩa mức | Không hiển thị | Hiện **sau khi chọn điểm**, dạng ô ngay dưới ô chọn |
| Sau khi gửi | Chỉ số và tên mức, không ⓘ | Ô định nghĩa biến mất, còn số, tên mức và ⓘ |

## 5. Điều kiện tham gia

- Onboard **trước 01/10/2026**. NV onboard sau ngày này ẩn hẳn khỏi danh sách YER.
- Có tối thiểu **1 mục tiêu công việc** và **1 mục tiêu phát triển** đã được duyệt.
- Thiếu goal: chặn ngay ở màn tự đánh giá, gắn trạng thái **Không đánh giá**, dừng quy trình, KHÔNG upload được điểm CEO. Vẫn tính vào mẫu số tỷ lệ hoàn thành.
- NV đã nghỉ việc: mặc định ẩn. Bật bộ lọc "Hiển thị nhân viên đã nghỉ việc" mới thấy, chỉ để tra cứu.
- NV sắp nghỉ: hiện badge `Nghỉ việc từ dd/mm/yyyy`, deadline chung, phải chấm trước ngày hiệu lực. Qua ngày hiệu lực chưa chấm thì ẩn luôn.
- Không tính NV đã nghỉ việc vào tỷ lệ hoàn thành.

## 6. Auto-sync quá deadline

- Quá deadline bước LM mà LM chưa submit: hệ thống copy **điểm toàn diện của NV** sang cột LM.
- Quá deadline bước LM2 mà LM2 chưa chấm: copy **điểm toàn diện của LM** sang cột LM2.
- **KHÔNG** sync từ LM2 sang HOD. HOD quá hạn mà không thao tác: ghi nhận không có điểm HOD, hồ sơ giữ trạng thái `Chờ HOD đánh giá`, quy trình vẫn đi tiếp.
- Chỉ sync **điểm số**, không sync nhận xét.
- Badge `(HR system)` cạnh điểm ở cấp bị sync. Dùng một nhãn chung, không thể hiện chuỗi nguồn.
- Không gửi thông báo. Quá deadline không ai sửa được.
- NV không tự đánh giá nhưng đủ goal: LM vẫn đánh giá bình thường, cột điểm NV để trống.

## 7. Quyền xem

| Dữ liệu | NV trước publish | NV sau publish | LM | LM2/HOD | HRBP/L&OD | TR/HRD |
|---|---|---|---|---|---|---|
| Tự đánh giá | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Điểm từng mục tiêu của LM | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| 3 nhận xét nhóm + nhận xét toàn diện của LM | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| **Điểm toàn diện của LM** | ✗ | ✗ (vĩnh viễn) | ✓ | ✓ | ✓ | ✓ |
| Điểm LM2/HOD | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Comment LM2/HOD | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ |
| Final rating | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Employee Response | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |

Với NV, ô điểm toàn diện hiện label + trạng thái **Chưa công bố**, không ẩn cả dòng.
HRBP chỉ thấy đơn vị mình phụ trách; L&OD thấy toàn công ty.

## 8. Không thu hồi

NV và LM **không** thu hồi được sau khi submit. Mọi nút submit phải có dialog xác nhận nêu rõ hậu quả.
LM2/HOD sửa điểm thoải mái tới hết deadline của mình.

## 9. HRBP upload hộ HOD

- Chỉ hỗ trợ bước HOD (không áp dụng cho LM2).
- File: mã NV, tên, domain NV, division, department, grade, domain LM1, điểm toàn diện, nhận xét.
- Có bước preview và đối soát trước khi ghi. Trùng với điểm đã chấm tay thì báo conflict để chọn.
- Điểm HRBP upload chưa duyệt **không hiện** ở màn chính của HOD; nằm ở màn "Phê duyệt điểm hiệu chuẩn".
- HOD duyệt hàng loạt được, **không sửa** điểm trước khi duyệt.
- Trong timeline HOD: upload lại, duyệt lại, sửa bao nhiêu lần cũng được. Hết deadline thì cut off.

## 10. Employee Response (Enh 5)

- Tùy chọn, free text, mở khi LM submit đánh giá, đóng khi publish.
- Điểm LM là auto-sync `(HR system)` thì **không** hiện ô response.
- Gửi rồi không sửa, không xóa. Hiện thời gian gửi + tên và domain người gửi.
- LM trả lời **một lần duy nhất**, tùy chọn. Trả lời xong thread khóa, NV không phản hồi tiếp.
- LM2/HOD thấy response qua icon ở lưới danh sách + popover, có bộ lọc "Chỉ NV có phản hồi". Không phải vào chi tiết.
- Không có escalation lên HRBP.
- Không response được với final rating.

## 11. Mid-Year Snapshot (Enh 2)

- Chốt tại thời điểm **publish điểm MYR**. Không sửa, không đổi khi goal thay đổi sau đó.
- **Chỉ hiển thị cho Quản lý** (LM, LM2, HOD) và HRBP/L&OD. Màn Nhân viên **không có** khối này - nhân viên xem kỳ giữa năm ở tab Mid-Year Review.
- Hiển thị: 1 block collapse ở đầu màn đánh giá của Quản lý.
- Nội dung: điểm từng mục tiêu, 3 nhận xét nhóm, nhận xét toàn diện, điểm LM/LM2/HOD và final rating MYR đã publish.
- Không có MYR: empty state "Không có dữ liệu Mid-Year".
- Goal thay đổi sau MYR: badge `Đã thay đổi sau Mid-Year` trên goal card + link mở đúng goal trong snapshot. Không diff cạnh nhau.

## 12. Nghỉ thai sản (Enh 8)

- Xác định theo trạng thái tại **ngày mở kỳ YER** (05/01/2027). Chỉ áp dụng cho thai sản, không mở rộng cho nghỉ ốm/nghỉ không lương.
- NV thai sản **không bắt buộc** tự đánh giá, nhưng vẫn làm được nếu muốn.
- Có goal thì LM đánh giá bình thường. Không có goal thì LM **import goal** rồi **approve**, sau đó đánh giá.
- Import goal: Excel 2 sheet `WHAT Goals` + `DEVELOPMENT Goals`, giống `M-02`.
- Bước tự đánh giá chuyển `Không yêu cầu (Nghỉ thai sản)`, không tính là chưa hoàn thành, không gửi nhắc.
- NV thai sản vẫn nhận final rating và response được.
- NV đi làm lại sửa goal theo quy tắc chung của màn Mục tiêu.

## 13. Đổi Quản lý và Wrap-up (Enh 9)

- Nguồn: HR masterlist. **Cut-off 31/12/2026** - sau ngày này LM đang là ai thì người đó chịu trách nhiệm đánh giá.
- HRBP đổi reporting line, hệ thống tạo task `Hoàn tất bàn giao đánh giá` cho LM cũ, cấp quyền tạm đọc hồ sơ NV trong **48 giờ**.
- 4 ô bắt buộc, chỉ text, không chấm điểm: Key Achievements, Strengths, Areas for Improvement, Additional Notes.
- LM cũ xem được: goal hiện tại, tự đánh giá, feedback.
- Quá 48h: task hết hạn, mất quyền, bỏ hẳn wrap-up, không chặn quy trình.
- LM cũ đã nghỉ việc: bỏ qua.
- Submit xong chuyển read-only. **NV thấy wrap-up ngay khi LM cũ submit.** LM hiện tại, HRBP, L&OD đều thấy.
- Đổi qua công ty thành viên khác: không ràng buộc thêm về quyền xem.

## 14. AI Performance Copilot (Enh 6)

- Chỉ cho LM/LM2/HOD. NV không dùng AI cho tự đánh giá.
- Mock nội dung, nhưng phải hợp cảnh từng màn và từng nhân viên.
- **AI Summary**: tự chạy khi mở màn đánh giá chi tiết. Với LM2/HOD chỉ chạy khi bấm icon AI ở lưới. Không có bản summary cả team.
- **AI Draft / Refine**: panel chat trượt từ phải. AI không tự chèn - LM bấm "Chèn vào ô nhận xét" mới áp dụng. Dùng được cho cả 4 ô nhận xét.
- NV không biết nhận xét có AI tham gia. Không badge, không log hiển thị.
- Chế độ EN thì AI trả lời tiếng Anh.

## 15. Proxy View (Enh 7)

- Cho HRBP, L&OD, Admin. Chỉ read-only, mọi nút thao tác vô hiệu, nhãn `Proxy View (Read Only)`.
- **Chỉ dùng được khi người dùng đang online.** HRBP gửi yêu cầu, người dùng nhận thông báo in-app + email + popup nếu đang online.
- Không phản hồi trong **2 phút**: yêu cầu tự hủy. Từ chối được, và HRBP xin lại được.
- Xem theo góc nhìn LM: xin đồng ý của **LM**, không xin từng NV trong team.
- Trong lúc bị xem: người dùng thấy chỉ báo "đang được xem" + nút ngắt.
- Tự thoát sau 15 phút. Ghi audit log ngầm, không dựng màn log.
- Điểm vào: icon mắt trên từng dòng danh sách + nút trong màn chi tiết hồ sơ.

## 16. Export (Enh 4)

- Cho LM, HRBP, L&OD. Export được cả khi kỳ đang chạy.
- **File tổng hợp (Excel)**: 1 dòng/NV, dùng cho bulk.
- **File chi tiết (PDF)**: 1 file/NV - goal, nhận xét, response, wrap-up, snapshot MYR.
- **Không** kèm điểm LM2/HOD. File của LM và của HRBP giống nhau. LM thấy cột final rating trước publish.

## 17. Xóa mục tiêu (Enh 3)

- Chỉ NV xóa được, chỉ với goal `Lưu nháp` hoặc `Bị từ chối`.
- **Soft-delete**: ẩn khỏi danh sách NV, vẫn lưu để tra cứu và audit.
- Có dialog xác nhận, không bắt nhập lý do.

## 18. Tab và dữ liệu chưa lưu (Enh 11, 12)

Tab set: `Mục tiêu` - `Đánh giá giữa năm` - `Đánh giá cuối năm`. Không thêm tab.

Nhãn trạng thái chỉ hiện ở tab **Đánh giá giữa năm** và **Đánh giá cuối năm**, không hiện ở tab Mục tiêu.
Nhãn theo việc người dùng cần làm: `Cần tự đánh giá` / `Đang chờ Quản lý` / `Đã có kết quả của Quản lý` / `Đã hoàn tất` / `Không đánh giá` / `Chưa mở`.
Tab chưa mở: viền đứt nét, tooltip `Bắt đầu từ dd/mm/yyyy`.

Không auto-save. Có dữ liệu chưa lưu mà rời màn (đổi tab, đổi NV, breadcrumb, đóng tab trình duyệt, đổi kỳ) thì hiện dialog tiêu đề **Nội dung chưa được lưu**, có nút X đóng, 3 nút **cùng một hàng** căn phải:
`Rời đi, không lưu` (viền xám) - `Tiếp tục chỉnh sửa` (viền xám) - `Lưu nháp` (nền hồng, nút chính).
Không lặp lại cụm "chuyển tab" trong tên nút vì dialog dùng chung cho mọi cách rời màn.

## 19. Song ngữ

- Toggle VI/EN ở topbar góc phải. Mặc định tiếng Việt. Nhớ lựa chọn giữa các màn.
- Chỉ dịch label hệ thống. Nội dung người dùng nhập (goal, nhận xét, response) giữ nguyên.

## 20. Dữ liệu prototype

- Nguồn chung: `assets/employees-data.js` (16 NV, MYR scores, self/LM eval) - **không sửa** để snapshot MYR khớp màn Goal và MYR đã duyệt.
- YER thêm ở `assets/yer-data.js`: 8 NV mới + `window.PMS_YER` + 20 tình huống.
- Lưu trạng thái thao tác: `localStorage` qua `assets/yer-store.js` (lớp lưu trữ tách riêng, đổi sang backend chỉ sửa file này).
- Thanh Demo Control: đổi vai trò, time machine theo ngày hệ thống, chọn nhân sự, reset. Phím tắt `D` để ẩn/hiện.
- Deep link: `?role=lm&date=2027-02-10&emp=e7`.

## 21. Thứ tự dựng màn hình

| Cụm | Nội dung | Enhancement | Trạng thái |
|---|---|---|---|
| 0 | Seed data, Demo Control, time machine, store, song ngữ, spec | nền | Xong |
| 1 | Rating selector, tab, popup dữ liệu chưa lưu | 10, 11, 12 | Xong |
| 2 | Màn Nhân viên `E-05`: tự đánh giá, xem kết quả, Employee Response, snapshot MYR, thai sản, xóa mục tiêu | 2, 3, 5, 8 | Xong |
| 3 | Màn Quản lý gộp LM/LM2/HOD: chấm điểm, bulk, upload, duyệt, AI Copilot, wrap-up, lọc | 1, 6, 8, 9 | Đang làm |
| 4 | HRBP / L&OD / TR / HR Director: danh sách, chi tiết, export, proxy view, upload điểm cuối | 4, 7 | Chưa làm |

Kèm theo: `YER-demo/index.html` (bảng điều hướng 22 tình huống) và `YER-DEMO-SCRIPT.md` (kịch bản trình bày) - làm ở cụm 4.

## 22. File đã tạo ở cụm 0

| File | Vai trò |
|---|---|
| `assets/yer-data.js` | 8 nhân sự mới, mục tiêu phát triển bổ sung, dữ liệu MYR cho nhân sự mới, sự kiện YER, 22 tình huống, timeline, thang điểm |
| `assets/yer-store.js` | Lớp lưu trữ (localStorage). Đổi sang backend chỉ sửa phần DRIVER |
| `assets/yer-model.js` | Suy ra trạng thái theo ngày hệ thống: auto-sync, điều kiện tham gia, quyền xem, trạng thái danh sách |
| `assets/yer-i18n.js` | Từ điển VI/EN theo nhóm màn hình + nút chuyển ngôn ngữ |
| `assets/yer-demo.js` | Thanh Demo Control: vai trò, nhân sự, ngày hệ thống, reset. Phím `D` ẩn/hiện |
| `YER-demo/index.html` | Bảng điều hướng tình huống + bảng kiểm trạng thái suy ra |

## 23. File đã tạo ở cụm 1

| File | Vai trò |
|---|---|
| `assets/yer-ui.js` | `PMSUi.rating` (hàng nút điểm + định nghĩa), `PMSUi.tabs` (tab chu kỳ có trạng thái), `PMSUi.dirty` (cảnh báo chưa lưu), `PMSUi.dialog`, `PMSUi.toast` |
| `YER-demo/components.html` | Trang review 3 component nền tảng |

Ghi chú kỹ thuật:
- `PMSUi.rating(el, {step:'int'|'half', value, readonly, label, required, onChange})` - `int` cho điểm mục tiêu, `half` cho điểm toàn diện.
- `PMSUi.tabs(el, {active, items:[{key,label,state,disabled,openFrom,dot}], onSelect})` - tự gọi `PMSUi.dirty.guard` trước khi đổi tab.
- `PMSUi.dirty.watch(scope)` bắt mọi input/textarea/select/contenteditable; `PMSUi.dirty.onSaveDraft(fn)` gắn hành vi lưu nháp của từng màn.

## 24. File đã tạo ở cụm 2

Màn Nhân viên của YER **không phải màn mới**. Nó là **tab End-Year Review nằm trong chính màn `E-01`**
(Mục tiêu và Đánh giá cá nhân), dùng lại nguyên ngôn ngữ thiết kế của tab Mid-Year Review:
breadcrumb, emp-chip, chọn chu kỳ, tab bar, toolbar Lưu nháp / Gửi tự đánh giá, `stepper-card`,
`info-note`, `rv-section` + `rv-grid`, cặp `scmt-panel` cho nhận xét NV và QLTT, `overall-card`,
`submit-banner`.

| File | Vai trò |
|---|---|
| `E-05/index.html` | Bản sao `E-01` với tab End-Year Review được bật và mở sẵn. Tab Mục tiêu và Mid-Year giữ nguyên nội dung đã duyệt của `E-01` |
| `assets/yer-employee.js` | Render toàn bộ nội dung tab End-Year Review theo dữ liệu và ngày hệ thống |

Nội dung tab End-Year Review theo thứ tự: toolbar → banner trạng thái → dải quy trình →
banner đặc thù (thiếu mục tiêu, thai sản, sắp nghỉ việc) → bàn giao từ Quản lý cũ →
3 nhóm mục tiêu → Đánh giá toàn diện → Phản hồi của Nhân viên.

Quy ước riêng của màn Nhân viên:
- Dải quy trình tên là **Quy trình và Thời gian đánh giá cuối năm 2026**, dạng gọn, **không đánh số**,
  chỉ 5 bước nhân viên cần biết: Tự đánh giá, Quản lý trực tiếp, Quản lý cấp 2, Trưởng đơn vị, Công bố kết quả.
  Hai bước nội bộ của HR (Total Reward tải điểm, HR Director duyệt) không hiển thị cho nhân viên.
- **Có khối Lưu ý** ngay dưới dải quy trình (sửa ngày 16/09/2026, xem §40).
  **Không có khối Kết quả kỳ giữa năm** — kết quả đó để ở tab Đánh giá giữa năm.
- **Không có card Điểm cuối cùng riêng**. Sau khi nộp, banner trạng thái hiện **Điểm tự đánh giá**;
  sau khi công bố, banner hiện thêm **Kết quả cuối cùng** kèm tên mức. Banner luôn có nút tải PDF như màn MYR.
- Ô nhận xét ở trạng thái chỉ xem giữ nguyên khung `ev-editor-wrap`, bỏ thanh công cụ, nền xám nhạt.

Quy ước dữ liệu ghi vào store:
- `acts[emp].selfDraft` - bản nháp tự đánh giá, không tính là đã gửi.
- `acts[emp].self` - bản đã gửi, có `at` nên model coi là đã submit.
- `acts[emp].response` - phản hồi của nhân viên.
- `acts[emp].deletedGoals.ids` - danh sách mục tiêu đã xóa mềm.

Khi gộp vào sản phẩm thật, toàn bộ tab này chuyển thẳng vào `E-01`, `E-05` chỉ là bản dựng để review.

---

# PHẦN II — ENHANCEMENT 2H2026

> Nguồn: `YER Enhancement 2H2026.docx` (PMS Enhancement Proposal – 2H 2026).
> Chốt ngày 16/09/2026. Phần này **đè lên** Phần I ở những chỗ ghi rõ "thay §x".

## 25. Quy ước mã số

File đề xuất đánh mã `E01`–`E15`. Repo đã dùng `E-01`, `E-05` làm **mã màn hình**, và
Phần I dùng `Enh 1`–`Enh 12` làm mã yêu cầu. Ba bộ mã này khác nhau hoàn toàn.

Để khỏi nhầm, từ đây mã của file đề xuất luôn viết đủ tiền tố **`ENH-E02`**, `ENH-E13`…
Không viết tắt thành `E02`. Mã màn hình giữ nguyên dạng có gạch: `E-01`, `E-05`, `M-01`, `M-02`.

## 26. Danh mục enhancement và màn hình bị chạm

| Mã | Tên gọn | Nhóm | Màn hình |
|---|---|---|---|
| ENH-E13 | Thang điểm và cách chọn mức | Must | nền dùng chung |
| ENH-E14 | User journey khi vào màn YER | Must | nền dùng chung |
| ENH-E15 | Cảnh báo dữ liệu chưa lưu | Must | nền dùng chung |
| ENH-E05 | Đóng băng mục tiêu trong kỳ YER | Must | `E-05`, màn Quản lý |
| ENH-E03 | Điều hướng sang kết quả Mid-Year | Must | màn Quản lý |
| ENH-E10 | Nghỉ thai sản | Must | `E-05`, màn Quản lý |
| ENH-E02 | Nộp trễ và trả về gối đầu | Must | `E-05`, màn Quản lý |
| ENH-E01 | Tự lọc danh sách nhân viên cần đánh giá | Must | màn Quản lý |
| ENH-E06 | Báo cáo tổng hợp theo từng nhân viên | Must | màn HR |
| ENH-E09 | Proxy View | Must | màn HR |
| ENH-E08 | AI Performance Copilot | Should | màn Quản lý |

## 27. ENH-E02 — Nộp trễ và trả về gối đầu

Hai luồng riêng, không trộn vào nhau.

### 27.1 Nhân viên nộp trễ bằng file import

**Thay §5.** Trước đây thiếu mục tiêu là chặn hẳn, gắn `Không đánh giá` và dừng quy trình.
Nay nhân viên trễ hạn **tự import một file gồm cả mục tiêu và nội dung tự đánh giá**.

- Áp dụng cho cả nhân viên **chưa có mục tiêu nào trên hệ thống**.
- Mục tiêu import vào thẳng, **không qua bước duyệt mục tiêu**. Nhân viên tự chịu trách nhiệm
  bảo đảm mục tiêu đã thống nhất với Quản lý trước đó.
- Cửa sổ nộp trễ nằm **trong timeline của bước Quản lý trực tiếp** (19/01 - 01/02/2027).
- Hồ sơ gắn badge `Nộp trễ hạn`. Quản lý vào đánh giá bình thường.
- `Không đánh giá` chỉ còn dành cho nhân viên **không nộp trễ và cũng không đủ mục tiêu**
  khi hết cửa sổ nộp trễ.
- Nhắc: nhân viên trễ hạn và Quản lý đang phụ trách sau cut-off 31/12/2026 đều nhận nhắc.
  Prototype không dựng inbox thông báo, chỉ hiện badge và banner trên màn.

### 27.2 Trả về để chỉnh sửa — chọn Opt 2

- **Quản lý trực tiếp trả về cho Nhân viên.** Nhân viên sửa được **cả mục tiêu lẫn nội dung
  tự đánh giá**, ràng buộc hoàn thành trong **24 giờ** kể từ lúc bị trả về.
- **Quản lý cấp 2 trả về cho Quản lý trực tiếp**, cùng cách.
- Deadline của từng vai **giữ nguyên**, không giãn ra vì có lần trả về.
- Quá 24 giờ mà chưa nộp lại: hồ sơ quay về trạng thái trước khi trả về, quy trình đi tiếp.
- Trạng thái mới: `Bị trả về để chỉnh sửa`, kèm tên người trả về và lý do.

Không dựng Opt 1 (nhân viên tự sửa trong deadline của mình).

## 28. ENH-E03 — Điều hướng sang kết quả Mid-Year

**Thay §11.** Không dựng block snapshot đầy đủ. Thay bằng bản nhẹ:

- Trong màn YER của Quản lý, thêm **một dòng hướng dẫn** điều hướng sang tab Mid-Year Review.
- Dòng đó nêu **tên và domain của Quản lý đã chấm Mid-Year**, vì có thể khác Quản lý hiện tại.
- Nhân viên không tham gia Mid-Year: dòng ghi `Không có kết quả Mid-Year`.
- Bỏ: block collapse, điểm từng mục tiêu, 3 nhận xét nhóm, badge `Đã thay đổi sau Mid-Year`.
- Màn Nhân viên vẫn không có khối này, giữ nguyên §24.

## 29. ENH-E05 — Đóng băng mục tiêu trong kỳ YER

- Nhân viên **gửi** tự đánh giá là khóa ngay nhóm nút mục tiêu kỳ 2026: `Thu hồi`, `Tạo mới`,
  `Sửa`, `Xóa`. Không chờ hết deadline tự đánh giá.
- Chỉ **lưu nháp** tự đánh giá thì mục tiêu chưa khóa: vẫn thu hồi được, Quản lý vẫn yêu cầu
  cập nhật mục tiêu được.
- Thu hồi mục tiêu khi đã chấm điểm cho mục tiêu đó: hiện dialog cảnh báo **mất điểm đã chấm**.
- Thu hồi mục tiêu **không xóa** nhận xét đã ghi. Nhận xét 3 nhóm what, how, dev và nhận xét
  toàn diện vẫn giữ nguyên trong bản nháp.
- Kỳ 2027 không bị ảnh hưởng, đặt và thu hồi mục tiêu bình thường.

## 30. ENH-E01 — Tự lọc danh sách nhân viên cần đánh giá

- Mặc định chỉ hiện nhân viên `Đang làm việc` và đủ điều kiện YER, tự cập nhật theo HRM.
- Đã có ngày nghỉ việc nhưng chưa nghỉ hẳn: vẫn trong danh sách, gắn badge
  `Nghỉ việc từ dd/mm/yyyy`. **Không nhắc Quản lý** hoàn thành đánh giá với nhóm này.
- Nghỉ hẳn: tự rời khỏi danh sách của Quản lý.
- Tỷ lệ hoàn thành **không tính** nhân viên đã có ngày nghỉ việc. Điểm này **thay §5**,
  vốn ghi là vẫn tính vào mẫu số.
- Nhân viên đã có ngày nghỉ việc vẫn nhận nhắc cho tới khi nghỉ hẳn.

## 31. ENH-E06 — Báo cáo tổng hợp theo từng nhân viên

- HRBP tải được **báo cáo chi tiết từng nhân viên** cho cả kỳ Mid-Year và Year-End,
  nội dung giống hệt bản của Quản lý ở §16.
- Không thêm loại file mới, chỉ mở quyền và thêm điểm vào ở màn HR.

## 32. ENH-E09 — Proxy View

**Giữ nguyên §15**, kể cả cơ chế xin đồng ý 2 phút, chỉ báo `đang được xem`, tự thoát
sau 15 phút. File đề xuất không phủ định các điều kiện này, chỉ không nhắc lại.
Bổ sung từ file đề xuất: ghi rõ mục đích **chỉ để hỗ trợ vận hành**, không dùng để giám sát.

## 33. ENH-E10 — Nghỉ thai sản

Giữ §12, bổ sung:

- Bước tự đánh giá chuyển trạng thái `Không yêu cầu (Nghỉ thai sản)`, **không tính là chưa
  hoàn thành** trong tỷ lệ, không gửi nhắc.
- Quản lý **import mục tiêu thay** nhân viên nghỉ thai sản, chỉ trong timeline bước Quản lý
  đánh giá, và **không sửa được** mục tiêu nhân viên đã tạo và đã được duyệt.
- Hai mốc nhắc: lúc nhân viên nộp đơn thai sản, và lúc mở kỳ đánh giá.
- Màn hình hiện **hai khối hướng dẫn riêng**: một cho nhân viên thai sản, một cho Quản lý.

## 34. ENH-E13 — Thang điểm

Đã dựng ở cụm 1. Phần còn thiếu so với file đề xuất:

- ⓘ định nghĩa phải tra lại được **ngay khi đang chọn điểm**, không đợi tới lúc gửi xong.
- Định nghĩa hiện **bên cạnh** ô chọn, không đẩy xuống dòng dưới khi còn chỗ.
- Helper text thang điểm hiện ngay tại màn đánh giá, không chỉ trong bảng chọn.

## 35. ENH-E14 — User journey

- Tab: 3 trạng thái `Đang xem` / `Bấm để mở` / `Chưa khả dụng`, phân biệt bằng **nhiều tín
  hiệu cùng lúc**: nền, viền, độ đậm chữ, màu, con trỏ. Không chỉ bằng màu.
- Wording: không dùng `Đang diễn ra`, `Đang hoạt động`. Dùng nhãn theo việc người dùng cần
  làm, theo §18. Hai chỗ còn sót: `M-01` dòng 660 và `M-02` dòng 991.
- Dải quy trình: mỗi bước **bấm được** để đọc giải thích, và phải có tín hiệu cho biết bấm được.
- **Tourguide**: chạy tự động lần đầu vào tab, sau đó chỉ chạy khi bấm nút `Xem hướng dẫn`.
  Ghi nhớ đã xem trong store theo từng vai.

## 36. ENH-E15 — Cảnh báo dữ liệu chưa lưu

Giữ nguyên bộ nút của §18: `Rời đi, không lưu` - `Tiếp tục chỉnh sửa` - `Lưu nháp`.
File đề xuất ghi `Lưu nháp & Chuyển Tab` / `Ở lại` / `Không lưu & Chuyển Tab`, nhưng dialog
này dùng chung cho cả đóng tab trình duyệt, đổi nhân viên và breadcrumb, nên không được
gắn chữ "chuyển tab" vào tên nút. Thứ tự và phân cấp nút thì theo đúng file đề xuất:
`Lưu nháp` là nút chính, `Tiếp tục chỉnh sửa` là phụ, `Rời đi, không lưu` là nhẹ nhất.

Bổ sung: rating đổi giá trị cũng tính là dữ liệu chưa lưu. Không có thay đổi nào kể từ lần
lưu gần nhất thì rời màn thẳng, không hiện dialog.

## 37. ENH-E08 — AI Performance Copilot

Giữ nguyên §14. Làm sau cùng của cụm màn Quản lý vì thuộc nhóm Should have.

## 38. Thứ tự triển khai enhancement

| Đợt | Nội dung | Enhancement | Trạng thái |
|---|---|---|---|
| 1 | Nền dùng chung: thang điểm, tab và journey, tourguide, popup chưa lưu | ENH-E13, E14, E15 | Đang làm |
| 2 | Hoàn thiện màn Nhân viên `E-05` | ENH-E05, E03, E10, E02 | Chưa làm |
| 3 | Màn Quản lý LM/LM2/HOD | ENH-E01, E02, E03, E10, E08 | Chưa làm |
| 4 | Màn HR: HRBP, L&OD, TR, HRD | ENH-E06, E09 | Chưa làm |

Trong mỗi đợt, dựng tình huống theo thứ tự: đúng hạn trước, rồi trễ hạn, thiếu mục tiêu,
thai sản, đổi Quản lý, sắp nghỉ việc, auto-sync quá deadline.

## 39. File đã tạo ở cụm 3

Màn Quản lý của YER **không phải màn mới**. Nó là **tab Đánh giá cuối năm nằm trong chính
`M-01` và `M-02`**, dùng lại nguyên ngôn ngữ thiết kế của tab Đánh giá giữa năm. Giống cách
`E-05` là bản dựng của `E-01`, hai file dưới đây chỉ là bản dựng để review.

| File | Vai trò |
|---|---|
| `M-05/index.html` | Bản sao `M-01` với tab Đánh giá cuối năm được bật và mở sẵn. Danh sách nhân viên cần đánh giá |
| `M-06/index.html` | Bản sao `M-02` với tab Đánh giá cuối năm được bật và mở sẵn. Màn chấm điểm chi tiết |
| `assets/yer-manager.js` | Render danh sách: dải quy trình, đổi phạm vi vai, tỷ lệ hoàn thành, bộ lọc, bảng điểm |
| `assets/yer-manager-detail.js` | Render màn chấm điểm: 3 nhóm mục tiêu, cặp nhận xét, điểm toàn diện, phản hồi |

### 39.1 Một màn, ba vai

`M-06` dùng chung cho cả ba vai, khác nhau ở nội dung chứ không phải ở bố cục:

| | Quản lý trực tiếp | Quản lý cấp 2 | Trưởng đơn vị |
|---|---|---|---|
| Điểm từng mục tiêu | nhập | chỉ xem | chỉ xem |
| 3 nhận xét nhóm | nhập, bắt buộc | chỉ xem | chỉ xem |
| Điểm toàn diện | nhập, bắt buộc | nhập, bắt buộc | nhập, bắt buộc |
| Nhận xét toàn diện | bắt buộc | tùy chọn | tùy chọn |
| Sửa sau khi gửi | **không** (§8) | được, tới hết deadline | được, tới hết deadline |
| Cột điểm đọc thêm | — | của QLTT | của QLTT và QL cấp 2 |
| Nút trả về | về nhân viên | về QLTT | — |

### 39.2 Quy ước dữ liệu ghi vào store

- `acts[emp].lmDraft` / `lm2Draft` / `hodDraft` — bản nháp theo từng vai, không tính là đã gửi.
- `acts[emp].lm` / `lm2` / `hod` — bản đã gửi, có `at` nên model coi là đã submit.
- `acts[emp].response.reply` — trả lời một lần của Quản lý.
- `acts[emp].returned` — lần trả về gần nhất: ai trả về, lúc nào, hạn 24 giờ.

### 39.3 Ghi chú

- Điểm đã gửi đọc lại từ bản đã gửi chứ không từ bản nháp, vì gửi xong là nháp bị xóa.
- Tỷ lệ hoàn thành dùng `PMSYer.completion`, không tự đếm lại trong màn (DESIGN-SYSTEM.md §20.1).
- Khi gộp vào sản phẩm thật, hai tab này chuyển thẳng vào `M-01` và `M-02`.

## 40. Dải quy trình và khối Lưu ý

Chốt ngày 16/09/2026, thay phần dải quy trình ở §24 và §35.

### 40.1 Dạng hiển thị

Dải quy trình dùng **đúng dạng stepper của Mid-Year Review** trong `E-01`: vòng tròn có số
thứ tự, đường nối ngang, nội dung căn giữa. Khác ở chỗ **gọn hơn**: vòng tròn 24px thay
vì 28px, chữ nhỏ hơn một nấc, bỏ khoảng trống thừa.

Mỗi bước gồm, theo thứ tự từ trên xuống:

1. Số thứ tự trong vòng tròn. Bước đã qua tô xám đậm, bước đang mở tô hồng.
2. Tên bước.
3. Ngày, chỉ hạn chót.

**Domain của người thực hiện nằm cùng dòng với tên vai**, trong **ngoặc đơn**, chữ nhạt hơn,
để dải không cao thêm: `Quản lý trực tiếp (thanh.le)`.
**Không đặt nhãn `Bắt buộc`** ở bất kỳ bước nào.

**Thu gọn được.** Bấm vào tiêu đề dải là gập lại. Thu gọn rồi vẫn phải nói được kỳ đang
ở đâu, bằng một dòng `Đang ở bước: <tên> (<domain>) - Hạn chót dd/mm/yyyy`.
Trạng thái thu gọn nhớ theo từng màn trong store, đổi ngôn ngữ hay đổi ngày không mở lại.

### 40.2 Domain của từng bước

- Lấy qua `PMSYer.actors(p)`, màn hình **không tự ghép tên người** (DESIGN-SYSTEM.md §20.1).
- Quản lý trực tiếp và cấp 2 lấy từ chính hồ sơ nhân viên; Trưởng đơn vị, Total Reward
  và HR Director lấy từ `window.PMS_YER_ACTORS` trong `assets/yer-data.js`.
- Bước **Công bố kết quả không có domain**, vì nó không gắn với một người cụ thể.
- Ở **màn danh sách của Quản lý**, bước Tự đánh giá cũng không có domain: bước đó là việc
  của cả danh sách chứ không của một người. Màn chi tiết thì có.

### 40.3 Ngày hiển thị

- **Mọi bước chỉ hiện hạn chót**, dạng `Hạn chót dd/mm/yyyy`. Không bước nào hiện ngày bắt đầu,
  kể cả bước của chính người đang xem.
- **Ngày bắt đầu của cả kỳ** đưa lên tiêu đề dải: `Quy trình và Thời gian đánh giá cuối
  năm 2026 - bắt đầu 05/01/2027`.
- Dùng chữ **`Hạn chót`**, không dùng `Hạn`.
- Hộp giải thích khi bấm vào bước vẫn hiện đủ khoảng ngày.

### 40.4 Những thứ KHÔNG đặt trong dải quy trình

- **Dải quy trình chỉ để đọc.** Từng bước **không bấm được** và không mở popup giải thích.
  Mọi thông tin cần biết đã nằm sẵn trên dải: tên bước, người phụ trách, hạn chót.
  Chỉ còn tiêu đề dải là bấm được, để thu gọn.
- **Không có dòng gợi ý** `Bấm vào từng bước để đọc thêm`.
- **Nút `Xem hướng dẫn` đặt ngoài dải**: màn Nhân viên đặt cạnh `Lưu nháp` và
  `Gửi tự đánh giá`; màn Quản lý đặt ở thanh công cụ của danh sách.
- Khoảng cách tiêu đề tới hàng bước: **18px**.

### 40.5 Khối Lưu ý của màn Nhân viên

Nằm ngay dưới dải quy trình, dùng `info-note` giống tab Đánh giá giữa năm, hai gạch đầu dòng:

1. Điều kiện tham gia. Cụm **Danh sách mục tiêu** là **liên kết thật**, bấm vào là chuyển
   sang tab Mục tiêu ngay trong màn, không rời trang.
2. Kết quả kỳ giữa năm. Có kết quả thì cụm **Đánh giá giữa năm** là liên kết sang tab đó.
   Không tham gia kỳ giữa năm thì ghi thẳng `Không có kết quả Mid-Year 2026` và nói rõ
   điều đó không ảnh hưởng tới kỳ cuối năm, **không để liên kết chết**.

## 41. Ô bắt buộc điền và ⓘ định nghĩa mức điểm

Chốt ngày 17/09/2026.

### 41.1 Ô bắt buộc điền

- **Bỏ nhãn `Bắt buộc`** ở góc panel.
- Thay bằng **dấu sao đỏ** `*` đặt ngay sau nhãn của chính ô phải điền, kèm chữ
  `bắt buộc` ở dạng chỉ trình đọc màn hình đọc được.
- Áp cho: ba ô nhận xét nhóm, ô Điểm toàn diện, ô Nhận xét toàn diện.
- Chỉ hiện khi ô đang sửa được. Đọc thôi thì không có dấu sao.

### 41.2 ⓘ định nghĩa mức điểm

**ⓘ chỉ xuất hiện sau khi đã gửi.** Trong lúc đang nhập, định nghĩa đã nằm sẵn ở ô ngay
dưới ô chọn điểm nên thêm ⓘ là thừa. Điều này đúng với §4 và **thay** §34.

### 41.3 Tên và định nghĩa mức điểm lẻ

Lấy **nguyên văn** từ file đề xuất, không rút gọn:

- Tên mức: `Giữa mức 1 - Không đạt yêu cầu và 2 - Hoàn thành một phần`,
  chứ không phải `Giữa mức 1 và 2`.
- Định nghĩa: `Hiệu quả công việc của nhân viên đã vượt trên các tiêu chí của mức X - …
  và chưa đạt trọn vẹn các tiêu chí cần thiết của mức Y - …`

### 41.4 Thanh công cụ soạn thảo

**Bỏ ô chọn định dạng Normal / Tiêu đề** khỏi mọi ô nhận xét của kỳ cuối năm. Nhận xét
đánh giá là văn xuôi ngắn, không cần cấp độ tiêu đề. Thanh công cụ còn B, I, U và danh sách.

### 41.5 Khối Lưu ý

- Cách khối bên dưới **18px**, không để dính vào bảng mục tiêu.
  `.info-note` vốn chỉ được định nghĩa cho `#mpanel-myr` nên trong `#yer-root` phải khai lại.
- Có kết quả giữa năm thì câu chữ bắt đầu bằng **`Bạn có thể xem lại kết quả Đánh giá giữa năm 2026…`**,
  dùng tên kỳ tiếng Việt theo DESIGN-SYSTEM.md §10, không dùng `Mid-Year`.

## 42. Banner sau khi gửi và nhãn mục tiêu

Chốt ngày 17/09/2026.

- Banner sau khi nhân viên gửi: tiêu đề **`Đã hoàn thành Tự đánh giá cuối năm`**,
  dòng phụ chỉ còn **`Ngày gửi: dd/mm/yyyy`**. Sau khi công bố thì là `Ngày công bố: dd/mm/yyyy`.
  Không nhắc lại đang chờ ai ở đây — nhãn tab và dải quy trình đã nói rồi.
- **Bỏ nhãn `Đã thay đổi sau Mid-Year`** trên thẻ mục tiêu. Kỳ cuối năm chấm trên mục tiêu
  hiện tại, lịch sử thay đổi không đổi cách chấm. Điều này **thay** phần badge ở §11.
