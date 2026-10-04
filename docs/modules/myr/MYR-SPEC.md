# MYR SPEC — Đánh giá giữa năm (Mid-Year Review) 2026

> **Trạng thái: chị đã duyệt ngày 27/09/2026.**
> Trích từ code hiện tại (`E-05` `#mpanel-myr`, `M-05` chu kỳ Giữa năm, `M-06` `#mpanel-myr`,
> `assets/yer-model.js`, `assets/yer-employee.js`), lịch sử commit (E-01, E-02, M-01, M-02 từ 06/2026),
> các mục MYR trong `YER-SPEC.md` (§11, §18.2, §18.3, §28, §40.5c) và bản v1
> (`PMS_PRD_v1.md` §2.3, §5, §8.3, §8.5, §11, `PMS_Screen_Inventory_v1.md`, `PM Process.md` bước 6 đến 16).
> Chỗ code và v1 lệch nhau, spec ghi theo **code** và đưa điểm lệch vào §11.

Mã rule: `MYR-xx`. Dữ liệu dùng chung: `assets/employees-data.js` (`PMS_MYR`, `PMS_SELFEVAL`, `PMS_LM1EVAL`, không sửa).

---

## 1. Mục đích và vai trò

- **MYR-01** MYR là kỳ check-in tiến độ giữa năm. Kết quả MYR **không ảnh hưởng** Final Rating cuối năm. (PRD §5.1)
- **MYR-02** Vai tham gia: Nhân viên, QLTT (`lm1`), Quản lý cấp 2 (`lm2`), HOD. HRBP tải điểm hiệu chuẩn hộ HOD (§6.4). (code M-05)
- **MYR-03** Trên URL, vai MYR truyền bằng tham số **`myrRole`**, không dùng `role` (`role` là vai của luồng YER, do `assets/yer-demo.js` đọc). (README module)

## 2. Quy trình và timeline

| Mã | Bước | Ai | Thời gian (demo) | Mức độ |
|---|---|---|---|---|
| MYR-04 | 1. Nhân viên tự đánh giá | NV | 22/06 – 06/07/2026 | `Bắt buộc` |
| | 2. QLTT đánh giá | LM1 | 07/07 – 16/07/2026 | `Bắt buộc` |
| | 3. Quản lý cấp 2 đánh giá | LM2 | 17/07 – 21/07/2026 | `Khuyến khích` |
| | 4. HOD đánh giá | HOD | 22/07 – 25/07/2026 (thống nhất E-05 và M-05) | `Khuyến khích` |
| | 5. Công bố kết quả | L&OD | 26/07/2026 | |

- **MYR-05** Dải quy trình hiện ở tab Giữa năm của Nhân viên và danh sách Giữa năm của Quản lý, dạng ô thông tin phẳng: vòng số, tên bước, thời gian, badge mức độ. **Không** tô bước đang chạy, không nhãn `Đang thực hiện`. (commit 07f5f94, 51ba169)
- **MYR-06** Cấp sau chỉ chấm khi cấp trước đã có điểm; mỗi cấp chỉ chấm trong timeline của mình. Ngoài timeline thì ô điểm khóa, tooltip nêu lý do (`Chức năng mở trong timeline ... đánh giá` / `Chỉ mở sau khi bước ... đánh giá hoàn thành`). **Bản demo cố ý tắt khóa này** (`// DEMO: bypass phase lock`) để thử được mọi vai; sản phẩm thật phải khóa. (chị chốt 27/09/2026)
- **MYR-07** **Kết quả cuối cùng** của nhân viên là **điểm của cấp quản lý cao nhất có tham gia đánh giá giữa năm**. Câu này hiện trong khối Lưu ý của cả hai phía. (code E-05, M-05, Screen Inventory "Final Rating theo kỳ")
- **MYR-08** Không có LM2 thì bỏ qua bước LM2. (PRD BR-06)
- **MYR-09** Không có bước CEO. MYR kết thúc ở HOD rồi công bố. (PRD §2.3, BR-07)

## 2a. Màn MYR độc lập với thanh demo YER

Chốt ngày 27/09/2026. Màn MYR (06/2026) và màn YER (09/2026) được dựng ở hai thời điểm khác nhau.
Thanh Chế độ demo sinh ra ở giai đoạn YER.

- **MYR-09a** Mặc định, tab Giữa năm (E-05, M-06) và chu kỳ Giữa năm (M-05) hiển thị **bình thường và độc lập** như lúc đang ở kỳ giữa năm: nhân viên tự đánh giá, lưu nháp, gửi; Quản lý chấm được. Nhãn tab không theo mục này mà theo ngày (chốt 04/10/2026): trước ngày mở kỳ cuối năm `Đang hoạt động`, từ ngày mở kỳ cuối năm `Đã hoàn tất` màu xám, có hay không có use case (YER-SPEC §18.4, `PMSYer.cycleTabLabel`).
- **MYR-09b** Chỉ khi người xem **chọn một use case trên thanh demo** (hoặc mở bằng `?scenario=`) và use case đó là của **chính nhân viên đang mở**, tab Giữa năm mới chuyển thành dữ liệu lịch sử của kỳ cuối năm: MYR-13, MYR-31, MYR-32, MYR-52, và mọi vai chỉ xem. Trên E-05, M-05 và M-06 nhãn tab luôn là `Đã hoàn tất` với mọi nhân viên, kể cả không có kết quả (YER-SPEC §18.4, `PMSYer.cycleTabLabel`, chốt 30/09/2026).
- **MYR-09c** Rời use case (đổi vai, chọn `Hồ sơ khác`, Đặt lại) là quay về MYR-09a. Luật nằm ở `PMSYer.myrAsHistory(empId)` trong `assets/yer-model.js`; thanh demo ghi `scenario` vào phiên, `?scenario=` đọc xong thì gỡ khỏi URL.

## 3. Điều kiện tham gia

- **MYR-10** Onboard **trước 01/04/2026** (`myrOnboardCutoff`), khác hạn của kỳ cuối năm. Luật tính trong model (`p.myrEligible`), màn hình không tự kiểm tra ngày onboard. (YER-SPEC §18.2)
- **MYR-11** Có tối thiểu **1 mục tiêu công việc** và **1 mục tiêu phát triển** đã duyệt. Thiếu thì ghi rõ thiếu loại nào: `Thiếu mục tiêu công việc`, `Thiếu mục tiêu phát triển`, `Thiếu mục tiêu công việc và phát triển`. (code M-05 `myrEligibility`)
- **MYR-12** Chỉ mục tiêu **đã duyệt** được đưa vào bảng đánh giá. Khối Lưu ý phía Nhân viên nhắc: `Chỉ những mục tiêu đã được Quản lý trực tiếp phê duyệt mới đủ điều kiện đánh giá giữa năm. Vui lòng kiểm tra Danh sách mục tiêu trước khi Tự đánh giá.` (code E-05)
- **MYR-13** Ở use case của thanh demo (MYR-09b), tab Giữa năm có hai lý do "không có kết quả", cho hai hành vi khác nhau (YER-SPEC §18.2):

  | Lý do | Tab |
  |---|---|
  | Onboard sau 01/04/2026 | **Khóa**, tooltip `Onboard sau 01/04/2026 nên không thuộc kỳ Đánh giá giữa năm 2026` |
  | Thuộc kỳ nhưng không hoàn tất bước bắt buộc | Mở, chỉ xem |

  Nhãn tab không phân biệt hai lý do: luôn `Đã hoàn tất` (chốt 27/09/2026). Tab Đánh giá cuối năm không nhắc gì tới việc không có kết quả giữa năm (YER-SPEC §40.5c).

  Đang đứng ở tab vừa bị khóa thì đưa về tab Mục tiêu.

## 4. Nội dung đánh giá và thang điểm

- **MYR-14** Ba bảng theo nhóm: Mục tiêu công việc (Tên mục tiêu - Kết quả cần đạt - Ưu tiên - Thời gian - Điểm NV - Điểm QLTT), Mục tiêu phát triển (bỏ cột Ưu tiên), Mục tiêu hành vi (Giá trị cốt lõi - Mô tả - Điểm NV - Điểm QLTT). Luôn giữ đủ ba khối. (code E-05, YER-SPEC §40.5d)
- **MYR-15** Mỗi nhóm có cặp ô nhận xét: `Đánh giá của Nhân viên` và `Đánh giá của Quản lý trực tiếp`, tối đa **500** ký tự. **Không** có ô nhận xét cho từng mục tiêu riêng lẻ. (code E-05, YER-SPEC §3)
- **MYR-16** Khối `Đánh giá toàn diện`: điểm toàn diện + nhận xét toàn diện tối đa **1.000** ký tự, cho Nhân viên và cho QLTT. (code E-05)
- **MYR-17** Điểm từng mục tiêu: **số nguyên 1-5**. Điểm toàn diện (mọi cấp) và điểm cuối cùng: **1-5, bước 0.5**. (commit 02d1ad8, 692fc29, YER-SPEC §4)
- **MYR-18** Tên mức chỉ có ở điểm nguyên: 1 `Không đạt yêu cầu`, 2 `Hoàn thành một phần`, 3 `Hoàn thành kỳ vọng`, 4 `Hoàn thành trên mức kỳ vọng`, 5 `Hoàn thành vượt xa kỳ vọng`. Điểm .5 không có tên riêng. (code E-05, YER-SPEC §4)
- **MYR-19** Rê chuột vào dòng mục tiêu hiện tooltip Tên + Kết quả cần đạt; bấm vào dòng mở popup `Chi tiết mục tiêu` (Mức độ ưu tiên - Từ ngày - Đến ngày, Tên mục tiêu, Kết quả cần đạt), áp cho cả ba nhóm. (commit 0f6a05b, eabba8b, YER-SPEC §13.2)
- **MYR-20** Mục tiêu đã `Hoàn thành` (đánh giá hoàn thành ở tab Mục tiêu) hiện điểm đã chốt, khóa ô điểm và không tính vào ô bắt buộc. (YER-SPEC §13.1)

## 5. Màn Nhân viên (`E-05` `#mpanel-myr`)

- **MYR-21** MYR là **tab trong màn Mục tiêu**, không tách trang riêng. (commit 7be97c4, Screen Inventory DD-01)
- **MYR-22** Thứ tự: toolbar (`Phản hồi đã nhận`, `Lưu nháp`, `Gửi tự đánh giá`) → dải quy trình → Lưu ý → ba nhóm mục tiêu → Đánh giá toàn diện. (code E-05, commit 8d2e639)
- **MYR-23** Bắt buộc trước khi gửi: điểm NV mọi mục tiêu còn mở, ba nhận xét nhóm, điểm toàn diện, nhận xét toàn diện. Thiếu thì popup `Vui lòng bổ sung thông tin` liệt kê từng mục còn thiếu theo tên. (commit 0f6a05b, code E-05)
- **MYR-24** Gửi có hộp xác nhận: `Quản lý trực tiếp sẽ nhận thông báo và bắt đầu đánh giá từ 07/07/2026. Bạn vẫn chỉnh sửa và gửi lại được đến hết 06/07/2026.` (code E-05)
- **MYR-25** Nhân viên **được chỉnh sửa bản tự đánh giá đã gửi, trong timeline tự đánh giá** (đến hết 06/07/2026): banner sau khi gửi có nút `Chỉnh sửa`, bấm là mở lại form để sửa và gửi lại. Hết timeline thì không còn nút. Khác YER (YER-SPEC §8, nhân viên không sửa được). (chị chốt 27/09/2026)
- **MYR-26** Không tự lưu. Rời màn khi còn dữ liệu chưa lưu thì hiện dialog `Nội dung chưa được lưu` theo YER-SPEC §18.
- **MYR-27** Sau khi gửi: banner `Đã nộp tự đánh giá MYR 2026`, giờ nộp, `Đang chờ Quản lý trực tiếp đánh giá từ 07/07/2026`, điểm tự đánh giá; nhóm nút nháp ẩn, nút `Phản hồi đã nhận` vẫn hiện. (code E-05, commit a04940d)
- **MYR-28** Trước khi Quản lý gửi, cột và ô nhận xét của Quản lý hiện `Quản lý sẽ nhận xét sau khi bạn gửi` / `Mở từ 07/07/2026`. (code E-05)
- **MYR-29** Nhân viên thấy điểm từng mục tiêu, nhận xét nhóm và nhận xét toàn diện của QLTT sau khi QLTT gửi. Nhân viên **không bao giờ thấy điểm toàn diện của QLTT**, LM2, HOD; chỉ thấy **Điểm cuối cùng** sau khi công bố. (chị chốt 27/09/2026, giống YER-SPEC §7)
- **MYR-30** Có nút tải **PDF kết quả MYR** khi đã có kết quả. (commit e942b98)

### 5.1 Tab Giữa năm tại thời điểm kỳ cuối năm

- **MYR-31** Chỉ ở use case của thanh demo (MYR-09b). Khi kỳ cuối năm đã mở, MYR là dữ liệu lịch sử: đã có điểm cuối cùng thì tab là `Đã hoàn tất` / `Đã hoàn thành`, toàn bộ nội dung chỉ xem, không còn `Lưu nháp`, `Gửi`. (YER-SPEC §18.3, code `yer-employee.js` `syncMyrResult`)
- **MYR-32** Box xanh đầu tab hiển thị: `Đã hoàn thành Đánh giá giữa năm 2026` - `Quản lý trực tiếp tại kỳ giữa năm: Tên (domain)` - `Điểm tự đánh giá` - `Điểm cuối cùng`. Người đánh giá lấy từ snapshot `PMS_MYR[empId].lm1By`, không suy từ Quản lý hiện tại. Không lặp tên người đánh giá ở từng mục tiêu. (YER-SPEC §18.3)
- **MYR-33** Tab Cuối năm chỉ dẫn sang tab Giữa năm bằng hai câu cố định (YER-SPEC §40.5c); người không thuộc kỳ giữa năm thì không hiện dòng nào.

## 6. Màn Quản lý

### 6.1 Danh sách (`M-05` chu kỳ Giữa năm)

- **MYR-34** Phạm vi: `Direct reports` (QLTT) và `Indirect reports` với vai con `LM2` / `HOD`, giống chu kỳ Mục tiêu. (code M-05)
- **MYR-35** Cột: [chọn, chỉ LM2/HOD] - Nhân viên - [Quản lý trực tiếp: LM2, HOD] - [Quản lý cấp 2: HOD] - Trạng thái - Điểm của NV - Điểm của QLTT - Điểm của QL cấp 2 - Điểm của HOD - Điểm cuối cùng - Chức năng. Cột điểm căn giữa. (code M-05, commit 2a9d726)
- **MYR-36** Trạng thái theo tiến trình: `Chưa tự đánh giá` → `Chờ QLTT đánh giá` → `Chờ QL Cấp 2 đánh giá` → `Chờ HOD đánh giá` → `Hoàn thành`. Trạng thái chờ tông xám, hoàn thành tông xanh. (commit 2a9d726)
- **MYR-37** Điểm của một cấp chỉ hiện khi timeline đã tới cấp đó; điểm cuối cùng chỉ hiện sau công bố. Chưa có thì `—`. (code M-05 `visibleMyrScore`)
- **MYR-38** Nhãn nhân thân: `Đã nộp đơn nghỉ việc`, `Đang nghỉ thai sản`. (code M-05)
- **MYR-39** Bộ lọc: như chu kỳ Mục tiêu (GOAL-SPEC GS-45). (commit 07f5f94)
- **MYR-40** Nút chức năng: QLTT `Xem & đánh giá`, LM2/HOD `Xem`. Bấm dòng hoặc nút mở chi tiết ở `M-06` tab Giữa năm. `Split View` nhúng chi tiết trong khung bên phải. (code M-05)
- **MYR-40a** Sắp xếp: người **đang chờ chính vai mình đánh giá** lên đầu (QLTT: `Chờ QLTT đánh giá`; LM2: `Chờ QL Cấp 2 đánh giá`; HOD: `Chờ HOD đánh giá`), tiếp theo các hồ sơ còn dở, `Hoàn thành` xuống cuối; cùng nhóm thì theo tên. (chị chốt 27/09/2026)
- **MYR-41** Tab chu kỳ ở thời điểm kỳ cuối năm dùng nhãn xám `Đã hoàn tất`, cùng luật và màu với màn Nhân viên (YER-SPEC §18.4, chốt 30/09/2026).

### 6.2 LM2 và HOD chấm điểm toàn diện ngay trên danh sách

- **MYR-42** LM2, HOD chỉ chấm **điểm toàn diện** (1-5 bước 0.5), chọn ngay trong ô điểm của cấp mình trên danh sách. Không chấm từng mục tiêu. (code M-05, YER-SPEC §3)
- **MYR-43** `Duyệt điểm LM1` (LM2) / `Duyệt điểm LM2` (HOD): tick nhiều nhân viên để lấy điểm của cấp liền trước làm điểm của mình. Chỉ tick được nhân viên đã tự đánh giá và cấp trước đã có điểm. (code M-05)
- **MYR-44** `Upload điểm`: tải template Excel/CSV (Mã nhân viên - Nhân viên - Tài khoản - Điểm cấp trước - Điểm cấp mình), điền rồi tải lên. Chỉ mở trong timeline của cấp mình. Dòng bị bỏ qua khi: không tìm thấy nhân viên, nhân viên chưa tự đánh giá, cấp trước chưa có điểm, điểm trống, ngoài 1-5 hoặc không phải bước 0.5. Kết quả báo `Đã cập nhật N điểm - Bỏ qua M dòng chưa hợp lệ`. (code M-05)

### 6.3 Chi tiết đánh giá một nhân viên (`M-06` tab Giữa năm)

- **MYR-45** Tiêu đề: QLTT `Chi tiết đánh giá của Nhân viên`; LM2, HOD `Chi tiết đánh giá của Nhân viên và LM1` (chỉ xem). (code M-06)
- **MYR-46** Hàng điều hướng: `Quay lại danh sách nhân viên` bên trái; bên phải là nút `Lưu nháp` / `Gửi đánh giá` và `Phản hồi đã nhận`. (commit 2b8eb93, 8d2e639)
- **MYR-47** Nhân viên chưa tự đánh giá: banner xám `Nhân viên chưa hoàn thành tự đánh giá MYR 2026`, vẫn hiện các mục tiêu đã duyệt với điểm trống, ô của QLTT khóa với nhãn `Bị khóa`, ẩn PDF. (commit 0516b05, code M-06)
- **MYR-48** Nhân viên đã tự đánh giá: banner `Nhân viên đã hoàn thành Tự đánh giá MYR 2026`; phần của Nhân viên chỉ xem (nhãn `Chỉ xem`, chữ đậm dễ đọc). (commit 07f5f94, code M-06)
- **MYR-49** QLTT bắt buộc: điểm từng mục tiêu (nguyên 1-5), **ba nhận xét nhóm**, điểm toàn diện (bước 0.5), nhận xét toàn diện. (chị chốt 27/09/2026; PRD để nhận xét nhóm tùy chọn)
- **MYR-50** Sau khi Quản lý gửi chỉ còn nhãn `Đã gửi đánh giá`, không có nút Thu hồi. Quản lý được mở lại và cập nhật tới hết deadline của mình. (commit 2b8eb93, YER-SPEC §8)
- **MYR-51** LM2, HOD xem phần của QLTT ở dạng chỉ xem, và chỉ khi timeline đã qua bước QLTT. (code M-06 `renderLm1ReadOnly`, Screen Inventory DD-06)
- **MYR-52** Ở use case của thanh demo (MYR-09b), tab Giữa năm của M-06 chỉ xem với mọi vai. MYR đã hoàn tất thì dùng box xanh như MYR-32 (`Đã hoàn thành Đánh giá giữa năm 2026`, Quản lý tại kỳ giữa năm, `Điểm tự đánh giá`, `Điểm cuối cùng`). (YER-SPEC §18.3)
- **MYR-53** Có nút tải PDF kết quả MYR của nhân viên. (commit e942b98)
- **MYR-54** Mở nhúng trong `Split View` (`embed=1`): ẩn sidebar, topbar, breadcrumb, dải tab, hàng điều hướng. (commit 3a87f15, code M-06)

### 6.4 Hiệu chuẩn điểm HOD

- **MYR-55** Chỉ HOD ở `Indirect reports` thấy nút `Duyệt điểm hiệu chuẩn`. (commit 333a35d)
- **MYR-56** Màn `Phê duyệt điểm hiệu chuẩn`: cột `Điểm Upload` là điểm HRBP tải lên; HOD tick nhân viên và bấm `Duyệt điểm` thì điểm upload thành điểm HOD. Có Bộ lọc (Nhân viên, Quản lý TT, Quản lý cấp 2) và tải xuống Excel/CSV. Không có cột Điểm cuối. (commit 333a35d, bb9a302, 2a9d726)

## 7. Phản hồi đã nhận

- **MYR-57** Nút `Phản hồi đã nhận` có ở cả màn Nhân viên và màn chi tiết của Quản lý, mở popup danh sách phản hồi của đúng nhân viên, có badge giá trị cốt lõi. Nguồn dữ liệu và hiển thị theo module Feedback. (commit 08a1464, 4c4835c, 8d2e639)

## 8. Mid-Year trong kỳ YER

- **MYR-58** Snapshot MYR đầy đủ trong màn YER **đã bỏ** (YER-SPEC §11 thay bằng §28). Màn YER của Quản lý chỉ có một dòng dẫn sang tab Giữa năm, nêu tên và domain Quản lý đã chấm Mid-Year; không có Mid-Year thì `Không có kết quả Mid-Year`.
- **MYR-59** Bỏ nhãn `Đã thay đổi sau Mid-Year` trên mục tiêu. (YER-SPEC §42)

## 9. Không làm

- Luật quá hạn, auto-sync và nộp trễ của YER (YER-SPEC §6, §27) **không áp dụng** cho MYR. (chị chốt 27/09/2026)
- Tùy chọn `Dùng lại đánh giá MYR` khi chấm YER (Screen Inventory mục 6).
- Ô nhận xét riêng cho từng mục tiêu (PRD §5.4 có, prototype bỏ).
- Nhãn đặc biệt `Missed deadline` và stats cards trên danh sách của Quản lý (Screen Inventory M-04).
- Banner cảnh báo gần deadline (PRD §5.5).

## 10. Tham số URL của màn chi tiết

`M-06/index.html?emp=<id>&myrRole=lm1|lm2|hod&phase=<bước>&tab=myr[&embed=1]`.
`phase` là bước hiện tại của timeline MYR (`employee`, `lm1`, `lm2`, `hod`, `publish`).
Có `tab=myr` hoặc `embed=1` thì mở sẵn tab Giữa năm, không có thì mở tab Cuối năm như luồng YER.

## 11. Các điểm đã chốt

Đã chốt ngày 27/09/2026:

| Chủ đề | Quyết định | Rule |
|---|---|---|
| Nhận xét nhóm của QLTT | Bắt buộc | MYR-49 |
| Nhân viên thấy điểm toàn diện của QLTT | Không bao giờ | MYR-29 |
| Nhân viên sửa bản đã gửi | Được, trong timeline tự đánh giá | MYR-25 |
| Luật quá hạn, nộp trễ của YER | Không áp dụng | §9 |
| QLTT sửa MYR đã hoàn tất ở M-06 | Mặc định là màn MYR bình thường; chỉ xem khi ở use case của thanh demo | MYR-09a, MYR-52 |
| Khóa theo timeline | Giữ tắt cho demo, spec vẫn ghi luật khóa | MYR-06 |
| Timeline HOD | 22/07 – 25/07/2026 ở mọi màn | MYR-04 |
| Sắp xếp danh sách MYR | Người đang chờ mình đánh giá lên đầu | MYR-40a |
