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
| 3 | Màn Quản lý gộp LM/LM2/HOD: chấm điểm, bulk, upload, duyệt, AI Copilot, wrap-up, lọc | 1, 6, 8, 9 | Chưa làm |
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
- **Không có khối Lưu ý** và **không có khối Kết quả kỳ giữa năm**.
- **Không có card Điểm cuối cùng riêng**. Sau khi nộp, banner trạng thái hiện **Điểm tự đánh giá**;
  sau khi công bố, banner hiện thêm **Kết quả cuối cùng** kèm tên mức. Banner luôn có nút tải PDF như màn MYR.
- Ô nhận xét ở trạng thái chỉ xem giữ nguyên khung `ev-editor-wrap`, bỏ thanh công cụ, nền xám nhạt.

Quy ước dữ liệu ghi vào store:
- `acts[emp].selfDraft` - bản nháp tự đánh giá, không tính là đã gửi.
- `acts[emp].self` - bản đã gửi, có `at` nên model coi là đã submit.
- `acts[emp].response` - phản hồi của nhân viên.
- `acts[emp].deletedGoals.ids` - danh sách mục tiêu đã xóa mềm.

Khi gộp vào sản phẩm thật, toàn bộ tab này chuyển thẳng vào `E-01`, `E-05` chỉ là bản dựng để review.
