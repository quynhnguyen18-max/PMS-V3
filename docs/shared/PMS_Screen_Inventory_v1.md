# PMS – Screen Inventory
**Version:** 1.2  
**Ngày:** 07/06/2026  
**Mục đích:** Liệt kê toàn bộ màn hình cần thiết theo role, phục vụ thiết kế wireframe/mockup

---

## Quy ước đọc

| Ký hiệu | Ý nghĩa |
|---|---|
| `[P]` | Page – màn hình riêng, có URL |
| `[M]` | Modal / Overlay – xuất hiện trên màn hình hiện tại |
| `[C]` | Component / Panel – vùng nội dung thay đổi trong cùng một page |
| `★` | Màn hình phức tạp – cần Screen Spec chi tiết trước khi vẽ |
| `↔` | Shared – dùng chung giữa nhiều role |

---

## Design Decisions đã chốt

| # | Quyết định | Lý do |
|---|---|---|
| **DD-01** | MYR/YER Self Review: **panel trong page danh sách** (in-page panel, không navigate ra page riêng) | Giữ NV trong context, không mất orientation; dễ đối chiếu goals và scoring |
| **DD-02** | Manager Scoring: **slide-over panel** từ bảng (không phải page riêng) | Manager cần giữ tổng quan team trong khi chấm; slide-over giúp không mất context bảng |
| **DD-03** | Tạo Goal: **modal** (desktop-first, không cần hỗ trợ mobile) | Desktop-first → modal đủ không gian, nhanh, không cần navigate; form ngắn và cố định |
| **DD-04** | **Desktop-first** | PMS là HR tool nội bộ, dùng chủ yếu trên máy tính |
| **DD-05** | NV có trang **Home/Overview** riêng | Entry point rõ ràng: tóm tắt chu kỳ hiện tại, việc cần làm, deadline gần nhất |
| **DD-06** | Score visibility theo cấp: L1 thấy điểm NV; L2 thấy điểm NV + L1 (và có thể xem chi tiết NV); HOD thấy tất cả | Mỗi cấp review có đủ context từ cấp dưới; không blind hoàn toàn giữa các cấp manager |

---

## Quy tắc hiển thị điểm theo role (Score Visibility Rules)

> Quy tắc nền tảng ảnh hưởng đến **tất cả màn hình liên quan đến đánh giá**. Áp dụng nhất quán ở mọi screen.

### Nhân viên (Employee) – thấy gì và khi nào?

| Thông tin | Có thể thấy? | Thời điểm |
|---|---|---|
| Điểm tự đánh giá của bản thân (self rating từng goal) | ✓ | Luôn luôn |
| Rating của L1 cho **từng goal riêng lẻ** | ✓ | Sau khi L1 submit |
| Comment của L1 cho **từng goal riêng lẻ** | ✓ | Sau khi L1 submit |
| **Overall Performance Rating** của L1 | ✗ | Không hiển thị (trừ sau publish) |
| **Overall Comment** của L1 | ✗ | Không hiển thị (trừ sau publish) |
| Điểm / comment của L2, HOD, CEO | ✗ | Không hiển thị (trừ sau publish) |
| **Final Overall Performance Rating** | ✓ | **Chỉ sau khi L&OD publish** |

### Định nghĩa Final Rating theo kỳ

| Kỳ | Final Rating = |
|---|---|
| **MYR** | Overall rating của **cấp quản lý cao nhất** tham gia đánh giá trong kỳ đó |
| **YER** | Điểm **CEO Approved** |

### Nguyên tắc thiết kế từ quy tắc visibility
- Sau khi L1 submit: màn hình NV hiển thị per-goal rating + comment của L1, nhưng **ẩn hoàn toàn Overall Rating** bằng placeholder rõ ràng: *"Kết quả tổng thể sẽ được công bố sau khi hoàn tất quy trình đánh giá"*
- Sau khi publish: chỉ hiển thị **Final Rating duy nhất** + Overall Comment của L1. Không hiển thị bảng điểm các cấp trung gian với NV
- Manager (L1/L2/HOD): thấy toàn bộ điểm của các cấp dưới mình, không bị giới hạn

### Manager – thấy gì khi chấm điểm?

| Cấp chấm | Thấy điểm của |
|---|---|
| L1 | Self-assessment của NV |
| L2 | Self-assessment của NV + điểm L1 (có thể xem chi tiết từng goal của NV) |
| HOD | Tất cả: NV + L1 + L2 |

---

## Các yếu tố UX bắt buộc trong thiết kế

### 1. Progress Stepper (Quy trình các bước)
Hiển thị ở **tất cả các màn hình liên quan đến MYR và YER**, cho cả NV lẫn manager.
- Dạng horizontal step bar hoặc timeline
- Thể hiện: đã qua bước nào, đang ở bước nào, bước tiếp theo là gì
- Kèm deadline/timeline cho từng bước
- Ví dụ: `[NV tự đánh giá ✓] → [L1 đánh giá ←đang ở đây] → [L2] → [HOD] → [CEO Approved] → [Công bố]`

### 2. Grid View / One-Page View cho Scoring
Áp dụng cho màn hình đánh giá MYR và YER của cả NV và manager:
- Tất cả goals trải ra trên cùng một trang (không ẩn/hiện theo accordion)
- Hiển thị song song: cột Self Assessment | cột L1 Rating (khi có) để dễ đối chiếu
- Manager view: ưu tiên dạng lưới để nhìn thấy đủ thông tin các cấp

### 3. Stats Cards cho Manager
Hiển thị ở đầu trang danh sách team (M-04, M-07) dành cho L1, L2, HOD:
- Tỉ lệ NV hoàn thành self assessment
- Số NV đang chờ đánh giá (của cấp mình)
- Số NV đã hoàn thành / tổng
- Số NV bị missed deadline (nếu có)

### 4. Nhãn trạng thái đặc biệt của NV
Áp dụng ở tất cả màn hình manager khi hiển thị danh sách nhân viên:
- 🤱 **Thai sản** – NV đang nghỉ thai sản (không tham gia đánh giá kỳ này)
- ⚠️ **Missed deadline** – NV bỏ lỡ deadline self assessment

### 5. Role Switcher cho Manager (L1 / L2 / HOD)
Một người có thể đảm nhận 1, 2, hoặc cả 3 vai trò cùng lúc. Yêu cầu:
- Cần có cơ chế **chuyển vai trò rõ ràng** (tab hoặc dropdown role switcher ở đầu trang)
- Mỗi vai trò hiển thị danh sách NV và tác vụ khác nhau
- Khi đang ở vai trò nào, phải hiển thị rõ đang thao tác với tư cách nào
- Không được để user bị confused khi chuyển qua lại

### 6. Reuse MYR Assessment trong YER
Ở màn hình YER (E-13 và M-08): nếu goal đã được đánh giá ở MYR, hiển thị:
- Option chọn: **"Dùng lại đánh giá MYR"** hoặc **"Viết đánh giá mới"**
- Nếu chọn dùng lại: pre-fill điểm và comment từ MYR, vẫn có thể chỉnh sửa
- Visual indicator rõ ràng để phân biệt đánh giá được carry-over vs đánh giá mới

### 7. Thông tin liền mạch Goal → MYR → YER
- Tab All / MYR / YER trên cùng một page (E-01), không navigate ra ngoài
- Trạng thái goal, số lượng, deadline hiển thị nhất quán ở tất cả tab
- Action buttons luôn rõ ràng: NV nhìn vào biết ngay cần làm gì tiếp theo

---

## NHÓM 1 – EMPLOYEE (Nhân viên)

### 1.0 Home / Overview

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| E-00 | Home – Tổng quan cá nhân | `[P]` | Entry point của NV: tóm tắt chu kỳ hiện tại, số goals theo trạng thái, kỳ đánh giá đang mở, việc cần làm tiếp theo, deadline gần nhất. Progress stepper của MYR/YER nếu đang active | ★ |

### 1.1 Goal Setting – Thiết lập Mục tiêu

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| E-01 | Danh sách mục tiêu cá nhân | `[P]` | Trang chính của NV. Tab All / MYR / YER. Danh sách goals với trạng thái, priority, deadline. CTA rõ ràng theo từng trạng thái goal | ★ Entry point chính |
| E-02 | Tạo mục tiêu mới | `[M]` | Modal (desktop): chọn loại WHAT/DEVELOP, priority, tiêu đề, kết quả cần đạt, thời gian. Nút: Lưu nháp / Gửi quản lý | ★ |
| E-03 | Chỉnh sửa mục tiêu | `[M]` | Reuse form E-02, load sẵn data. Chỉ khả dụng khi goal ở Draft / Update (tự thu hồi hoặc manager trả về) | Reuse E-02 |
| E-04 | Chi tiết mục tiêu – Tab Thông tin | `[M][C]` | Xem đầy đủ nội dung goal: loại, priority, tiêu đề, kết quả, trạng thái, rating của L1 per goal (nếu đã có và trong thời điểm cho phép) | |
| E-05 | Chi tiết mục tiêu – Tab Bình luận | `[M][C]` | Thread comment giữa NV và manager | |
| E-06 | Chi tiết mục tiêu – Tab Lịch sử | `[M][C]` | Timeline thay đổi trạng thái: ai, lúc nào, ghi chú | |
| E-07 | Bulk upload mục tiêu | `[M]` | Upload CSV: drag-drop, preview table, highlight lỗi theo dòng, confirm import | |

### 1.2 Mid-Year Review (MYR) – Tự đánh giá

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| E-08 | MYR – Chưa đủ điều kiện | `[C]` | State trong tab MYR khi NV chưa đủ approved goals. Banner thông báo cụ thể còn thiếu gì, gợi ý hành động | |
| E-09 | MYR – Self Review *(đang trong cửa sổ đánh giá)* | `[C]` | **Grid/one-page view**: tất cả WHAT / DEVELOP / HOW goals trải ra. NV nhập rating + comment (optional) từng goal. Progress stepper hiện ở top. Overall section mở khoá sau khi đủ điểm. Dạng panel trong E-01 (DD-01) | ★★ Màn hình phức tạp nhất |
| E-10 | MYR – Đã submit, chờ manager | `[C]` | Read-only. Grid view điểm tự đánh giá. Progress stepper cập nhật bước hiện tại. Placeholder rõ: "Đang chờ quản lý đánh giá" | |
| E-10b | MYR – Sau khi L1 đánh giá xong | `[C]` | Grid view song song 2 cột: **Self** \| **L1**. NV thấy per-goal rating + comment của L1. **Overall Rating bị ẩn** bằng placeholder: *"Kết quả tổng thể sẽ được công bố sau khi hoàn tất quy trình"*. Progress stepper cập nhật | ★ Score visibility |
| E-10c | MYR – Kết quả Final *(đã publish)* | `[C]` | Sau L&OD publish: hiển thị **Final Overall Rating** nổi bật + Overall Comment của L1. Grid goals vẫn giữ, ẩn cột điểm các cấp khác | ★ Sensitive screen |
| E-11 | MYR – Ngoài cửa sổ đánh giá | `[C]` | View-only. Banner rõ: cửa sổ chưa mở / đã đóng, ngày mở/đóng. Không có input field nào | |
| E-12 | HOW Goal – Chi tiết tiêu chí | `[M]` | Popup xem tiêu chí đánh giá 1 HOW goal (VN + EN) khi NV muốn tham chiếu trước khi chấm | |

### 1.3 End-Year Review (YER) – Tự đánh giá

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| E-13 | YER – Self Review *(đang trong cửa sổ)* | `[C]` | Tương tự E-09. Thêm: nếu goal đã có MYR assessment → hiện option **"Dùng lại đánh giá MYR"** hoặc **"Viết mới"** trên từng goal. Pre-fill nếu chọn dùng lại, vẫn chỉnh sửa được | ★★ Reuse layout E-09 |
| E-14 | YER – Đã submit, chờ manager | `[C]` | Read-only. Grid view điểm tự đánh giá. Indicator phân biệt goal carry-over từ MYR vs viết mới. Progress stepper | Reuse layout E-10 |
| E-14b | YER – Sau khi L1 đánh giá xong | `[C]` | Grid view song song 2 cột: **Self** \| **L1**. Ẩn Overall Rating. Placeholder giống E-10b. Progress stepper | ★ Reuse layout E-10b |
| E-15 | YER – Kết quả Final *(đã publish sau CEO Approved)* | `[C]` | Sau CEO Approved + publish: **Final Overall Rating** nổi bật + Overall Comment của L1. Không hiển thị điểm các cấp trung gian với NV | ★ Sensitive screen |

---

## NHÓM 2 – MANAGER (L1 / L2 / HOD)

> **Lưu ý thiết kế quan trọng:** Một người có thể đồng thời là L1, L2, và/hoặc HOD. Cần có **Role Switcher** rõ ràng (tab hoặc dropdown) ở đầu tất cả màn hình manager. Mỗi role hiển thị danh sách NV và tập tác vụ khác nhau. Không được gây confused khi user đang thao tác ở vai trò nào.

### 2.1 Goal Approval – Duyệt Mục tiêu

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| M-01 | Danh sách mục tiêu team | `[P]` | **Role Switcher** ở top (L1 / L2 / HOD). Employee lanes dạng accordion. Filter: status/org. Stats cards: số goals chờ duyệt, đã duyệt, từ chối | ★ |
| M-02 | Chi tiết mục tiêu – góc nhìn Manager | `[M]` | Reuse E-04/05/06, thêm action: Duyệt / Từ chối / Yêu cầu cập nhật + ô ghi chú lý do | ↔ Reuse E-04 |
| M-03 | Bulk approve – Confirm dialog | `[M]` | Xác nhận duyệt nhiều goals: danh sách đã chọn, số lượng, nút xác nhận | |

### 2.2 MYR – Đánh giá Team

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| M-04 | MYR – Danh sách nhân viên | `[C]` | **Role Switcher** (L1/L2/HOD). **Stats cards**: % NV hoàn thành self assessment, số NV chờ đánh giá, số đã xong. Bảng danh sách NV: tên, trạng thái, deadline. **Nhãn đặc biệt**: 🤱 Thai sản \| ⚠️ Missed deadline | ★ |
| M-05 | MYR – Scoring chi tiết 1 NV | `[Slide-over panel]` | **Grid/one-page view** (DD-02): 2 cột song song **Self** \| **[Cấp mình]**. Tất cả WHAT/DEVELOP/HOW goals trải ra. Manager nhập rating từng goal (bắt buộc), comment từng goal (optional), comment nhóm WHAT/HOW/DEVELOP (optional). **Overall Rating + Overall Comment bắt buộc**. Progress stepper ở top. L1 thấy cột Self; L2 thấy Self + L1; HOD thấy tất cả | ★★ Phức tạp nhất |
| M-06 | MYR – Scoring *(đã submit)* | `[Slide-over panel]` | Read-only. Grid view đầy đủ tất cả cột điểm các cấp đã có. Manager thấy toàn bộ, không bị giới hạn | Reuse layout M-05 |

### 2.3 YER – Đánh giá Team

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| M-07 | YER – Danh sách nhân viên | `[C]` | Tương tự M-04. **Stats cards** cho YER. Thêm cột Final Rating khi đã có. Nhãn thai sản / missed deadline | ★ Reuse layout M-04 |
| M-08 | YER – Scoring chi tiết 1 NV | `[Slide-over panel]` | Tương tự M-05. Thêm: indicator goal carry-over từ MYR vs viết mới. Option cho manager chọn **"Dùng lại đánh giá MYR"** hoặc **"Viết mới"** per goal. L2/HOD thấy thêm điểm các cấp dưới | ★★ Reuse layout M-05 |
| M-09 | YER – Kết quả sau CEO Approved | `[C]` | Read-only. Grid view toàn bộ: Self / L1 / L2 / HOD / Final. Dành cho manager xem nội bộ, không phải NV | |

---

## NHÓM 3 – HRBP

### 3.1 Tracking Dashboard (Goal Setting + MYR + YER)

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| H-01 | Tracking overview | `[P]` | **3 tab: Goal Setting \| MYR \| YER**. Mỗi tab: stats cards tổng công ty (% hoàn thành, số NV theo trạng thái, số bị trễ deadline). Bảng drill-down theo Khối/Phòng ban. **Nhãn đặc biệt**: thai sản, missed deadline | ★ Shared layout với L-00 |
| H-02 | Tracking – Chi tiết 1 phòng ban | `[C]` | Drill-down từ H-01: từng NV với trạng thái chi tiết, điểm đã có, nhãn đặc biệt | |
| H-03 | Tracking – Chi tiết 1 NV | `[M]` | Popup xem toàn bộ trạng thái của 1 NV: goals, MYR, YER, điểm các cấp (HRBP thấy full) | |

### 3.2 Upload & Quản lý

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| H-04 | Upload HOD Rating | `[M]` | Upload CSV: drag-drop, preview bảng điểm, highlight lỗi theo dòng, confirm import | ★ |
| H-05 | Thay đổi PIC | `[M]` | Chọn NV → chọn bước đánh giá → chọn người mới. Confirm + ghi lý do | |

---

## NHÓM 4 – L&OD

### 4.0 Tracking Dashboard (dùng chung với HRBP)

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| L-00 | Tracking overview | `[P]` | **Giống H-01** – 3 tab Goal Setting \| MYR \| YER. Stats cards + bảng drill-down. Thêm quyền: nút Publish kết quả cho từng kỳ | ★ ↔ Shared layout với H-01 |

### 4.1 Quản lý Chu kỳ

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| L-01 | Danh sách chu kỳ | `[P]` | List chu kỳ theo năm, trạng thái Draft/Active/Completed, CTA tạo mới | |
| L-02 | Tạo chu kỳ mới | `[P]` | Form: thông tin cơ bản, timeline, goal requirements, onboarding rule | ★ |
| L-03 | Chi tiết chu kỳ – Tab Thông tin | `[P][C]` | Xem/chỉnh sửa thông tin chu kỳ. Sidebar: vòng đời trạng thái + action buttons (Activate / Complete) | ★ |
| L-04 | Chi tiết chu kỳ – Tab Điều kiện tham gia | `[C]` | Cấu hình conditions: vị trí, level, hợp đồng, org tree, ngoại lệ | |
| L-05 | Chi tiết chu kỳ – Tab Kỳ đánh giá | `[C]` | Master-detail: list MYR/YER bên trái, form chi tiết bên phải | ★ |
| L-06 | Chi tiết chu kỳ – Tab Thông báo | `[C]` | Bảng cấu hình notifications: sự kiện, loại, lịch gửi, trạng thái đã gửi | |
| L-07 | Activate / Complete chu kỳ – Confirm | `[M]` | Dialog xác nhận thay đổi trạng thái. Tóm tắt impact (số NV ảnh hưởng) | |

### 4.2 Cấu hình Kỳ Đánh giá

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| L-08 | Form chi tiết kỳ MYR/YER | `[C]` | Trong L-05. Các trường: tên, ngày, eval window, deadlines theo cấp (NV/L1/L2/HOD), min goals, publish toggle | ★ |
| L-09 | Điều kiện tham gia kỳ | `[C]` | Tab con trong L-08: eligible employees riêng cho từng kỳ | |
| L-10 | Thông báo kỳ | `[C]` | Tab con trong L-08: notifications riêng cho từng kỳ | |
| L-11 | Publish kết quả – Confirm | `[M]` | Dialog xác nhận publish điểm cho NV. Hiển thị: số NV sẽ được nhìn thấy điểm, kỳ áp dụng, loại final rating | ★ |

---

## NHÓM 5 – SHARED / CROSS-ROLE

### 5.1 Navigation & Shell

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| S-01 | App Shell – Sidebar + Navbar | `[C]` | Layout chung: sidebar navigation theo role đang active, top navbar, user info | ↔ Tất cả roles |
| S-02 | Role Switcher | `[C]` | Toggle vai trò: Employee / L1 / L2 / HOD / HRBP / L&OD. Hiển thị rõ đang ở vai trò nào. Đặc biệt quan trọng với manager đa vai trò | ↔ |
| S-03 | Empty State | `[C]` | Component dùng chung khi list trống: icon + message theo context + CTA phù hợp | ↔ |
| S-04 | Toast / Notification | `[C]` | Feedback sau action: success/warning/error. Góc dưới phải | ↔ |
| S-05 | Progress Stepper | `[C]` | Component dùng chung cho tất cả màn hình MYR/YER: hiện bước hiện tại, bước tiếp, deadline. Responsive theo role | ↔ |

### 5.2 Feedback (Phản hồi)

| # | Tên màn hình | Loại | Mô tả ngắn | Ghi chú |
|---|---|---|---|---|
| S-06 | Phản hồi cá nhân – Đã cho | `[C]` | Tab trong trang Feedback | ↔ NV + Manager |
| S-07 | Phản hồi cá nhân – Đã nhận | `[C]` | Tab trong trang Feedback | ↔ NV + Manager |
| S-08 | Gửi phản hồi mới | `[M]` | Form: chọn người nhận (multi), nội dung, badge giá trị cốt lõi | ↔ |
| S-09 | Quản lý phản hồi team | `[C]` | Manager xem feedback team, filter badge/loại/tên NV, stats | Manager only |

---

## Tổng hợp

| Nhóm | Số screens | Số màn hình ★ phức tạp |
|---|---|---|
| Employee | 16 | 7 |
| Manager | 9 | 5 |
| HRBP | 5 | 2 |
| L&OD | 11 | 5 |
| Shared | 9 | 0 |
| **Tổng** | **50** | **19** |

---

## Thứ tự thiết kế được khuyến nghị

### Vòng 1 – Core Employee Flow + Shell (nền tảng cho mọi thứ sau)
```
S-01  App Shell + Sidebar
S-02  Role Switcher
S-05  Progress Stepper component
E-00  Home / Overview NV ★
E-01  Danh sách mục tiêu (3 tab: All / MYR / YER)
E-02  Tạo mục tiêu [modal] ★
E-09  MYR Self Review – grid view ★★
```

### Vòng 2 – Manager Core Flow
```
M-01  Danh sách mục tiêu team (có Role Switcher + Stats cards) ★
M-02  Duyệt mục tiêu [modal]
M-04  MYR danh sách NV + Stats cards + nhãn đặc biệt ★
M-05  MYR Scoring slide-over panel – grid 2 cột ★★
```

### Vòng 3 – YER + Score visibility states
```
E-13  YER Self Review (có option reuse MYR) ★★
E-10b MYR sau L1 đánh giá – 2 cột + ẩn Overall ★
E-10c MYR kết quả final (sau publish) ★
M-08  YER Scoring slide-over panel ★★
```

### Vòng 4 – HRBP + L&OD
```
H-01 / L-00  Tracking Dashboard 3 tab ★
H-04  Upload HOD Rating ★
L-03  Chi tiết chu kỳ ★
L-05  Tab Kỳ đánh giá ★
L-08  Form chi tiết kỳ MYR/YER ★
L-11  Publish confirm ★
```

### Vòng 5 – Edge cases, states, feedback
```
E-08  MYR chưa đủ điều kiện
E-11  MYR ngoài cửa sổ
E-15  YER kết quả final (sau CEO + publish)
S-03  Empty states
S-06/07/08  Feedback
```

---

*File này là input trực tiếp cho Screen Spec. Vẽ theo đúng thứ tự Vòng 1 → 5 để tái sử dụng component tối đa và phát hiện sớm các design conflict.*
