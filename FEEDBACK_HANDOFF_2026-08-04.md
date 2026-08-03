# Handoff — PMS Feedback Prototype

**Ngày bàn giao:** 04/08/2026  
**Workspace hiện tại:** `D:\PMS V3_UI UX Design`  
**Repository:** `https://github.com/quynhnguyen18-max/PMS-V3`  
**Nhánh:** `main`  
**Commit đã push mới nhất:** `067424550043a5eade4969da4cb57cf2ff67ddd3` — `feat: refine employee and manager feedback experiences`  
**Remote:** `origin/main` đang trùng commit trên.

> File handoff này được tạo sau commit `0674245`, đang nằm local để copy sang máy khác. Nếu chỉ clone GitHub thì cần copy thêm file này hoặc dùng nguyên nội dung file làm prompt mở task mới.

## 1. Mục tiêu sản phẩm đã chốt

Module Feedback là một trải nghiệm Continuous Feedback trong PMS, tách theo hai vai trò hiện có:

- **Nhân viên:** dùng màn `E-04` — tên hiển thị là **Phản hồi cá nhân**.
- **Quản lý:** dùng màn `M-04` — tên hiển thị là **Phản hồi của nhân viên**.
- Sidebar vẫn chỉ có một menu **Phản hồi** cho mỗi vai trò; không tạo thêm menu con.
- Quản lý muốn cho/nhận feedback cá nhân thì chuyển sang view Nhân viên; view Quản lý chỉ dùng để quản trị feedback của nhân viên.

Các use case đợt 1:

- UC2: Cho phản hồi.
- UC1: Nhân viên yêu cầu phản hồi.
- UC-R: Reviewer trả lời yêu cầu phản hồi.
- UC3: Quản lý yêu cầu phản hồi cho cấp dưới — đang làm tiếp ở Phase D.

## 2. Trạng thái triển khai

### Đã hoàn thành

- **Phase A — Nền:** Feedback Hub nhân viên, feed hợp nhất, sidebar phải, bộ lọc và feedback card.
- **Phase B — UC2:** Cho phản hồi, AI Coach mock, visibility, gửi và lưu nháp.
- **Phase C — UC1 + UC-R:** tạo/theo dõi request, câu hỏi chung/riêng, reviewer trả lời, lưu nháp và phân loại response giữa các tab.
- **Phase D1:** màn quản lý `M-04`, Direct reports / Indirect reports, LM2/HOD và danh sách nhân viên.
- **Phase D2:** quản lý xem feedback nhân viên theo visibility bằng popup, Split View và trang chi tiết mở tab mới.

### Bước tiếp theo — làm trước

**Phase D3 / MR-1 — Quản lý tạo yêu cầu phản hồi cho team trên màn `M-04`.**

Đây là màn/luồng cần dựng tiếp ngay, trước D4–D6.

Yêu cầu MR-1 đã chốt:

1. CTA **Yêu cầu phản hồi** trong view quản lý.
2. Quản lý chỉ chọn **direct report**, không chọn skip-level employee làm người được nhận feedback.
3. Hỗ trợ hai tình huống:
   - Một nhân viên → nhiều reviewer.
   - Nhiều nhân viên → nhiều reviewer.
4. Reviewer picker tìm theo **Họ tên / domain**, chống trùng, không tự chọn chính mình.
5. Có context/câu hỏi và hạn phản hồi.
6. Nếu chỉ có một reviewer: không hiển thị hoặc disable “Cá nhân hóa cho từng người”.
7. Nếu có từ hai reviewer: cho chọn nội dung chung hoặc cá nhân hóa câu hỏi theo từng reviewer.
8. Preview số request sẽ được tạo theo tích Designee × Reviewer, ví dụ `3 × 5 = 15 yêu cầu`.
9. Request do quản lý tạo có visibility mặc định shared; reviewer không được đổi phạm vi này trong UC-R.
10. Sau khi tạo, dữ liệu phải sẵn sàng cho D4 monitoring theo từng nhân viên, pending và overdue.

### Sau D3

- **D4 / MR-2:** monitoring response rate, pending, overdue và bảng tiến độ theo từng nhân viên.
- **D5 / MR-3:** AI Coaching Summary gồm Strengths, Development opportunities, Recurring themes; chỉ đọc; ghi rõ đây là coaching evidence, không phải điểm đánh giá.
- **D6:** kiểm thử quyền và luồng xuyên vai trò Nhân viên ↔ Quản lý, direct ↔ indirect, receiver-only ↔ manager-visible.

Ngoài phạm vi đợt này: UC4 Team Feedback 2027, UC5 HR Programs, HR role, dashboard analytics đầy đủ, Likert scale, anonymous feedback.

## 3. Màn hình và file quan trọng

### E-04 — Phản hồi cá nhân

- Entry: `E-04/index.html`
- Data model dùng chung: `E-04/feedback-model.js`
- Test: `E-04/feedback-model.test.js`
- Dữ liệu prototype:
  - `FEED` nằm inline trong `E-04/index.html`.
  - `QUEUE` nằm inline trong `E-04/index.html`.
  - `DRAFTS` là biến JavaScript trong memory, **không lưu localStorage**. Refresh trang sẽ mất draft/runtime mutation.

UI đã chốt gần nhất:

- Tên trang, breadcrumb, topbar và browser title: **Phản hồi cá nhân**.
- Sidebar vẫn là **Phản hồi**.
- Cụm chu kỳ nằm ở vị trí cũ dưới page header, cùng hàng CTA; không có khung bao ngoài.
- Icon lịch và nhãn Chu kỳ màu xám; dropdown chỉ hiển thị `2026`, `2025`.
- Không còn nhãn **Đang mở**.
- Hai CTA: Cho phản hồi, Yêu cầu phản hồi.
- Sidebar phải cố định, không có scroll riêng; feed giữa là vùng cuộn.
- “Cần bạn phản hồi” mặc định 3 người, click dòng mở popup trả lời; “Xem tất cả” mở popup danh sách.
- Draft trả lời/cho/request hiển thị ở tab Đã cho với trạng thái Lưu nháp.
- Tab classification đọc từ `FeedbackModel`, không nhân đôi response.

### M-04 — Phản hồi của nhân viên

- Entry: `M-04/index.html`
- Shared fixtures/render helper: `M-04/manager-feedback-data.js`
- Full-page detail: `M-04/feedback-detail.html?employee=<id>&cycle=<cycle>`
- Test: `M-04/m04.test.js`

UI đã chốt gần nhất:

- Chu kỳ ở góc trên bên phải page header.
- Khung chu kỳ compact; icon lịch màu xám; dropdown cao 28px.
- Direct/Indirect reports không chứa control chu kỳ.
- Grid:
  - Direct: Nhân viên | Phản hồi đã nhận | Chức năng.
  - LM2: Nhân viên | Quản lý trực tiếp | Phản hồi đã nhận | Chức năng.
  - HOD: Nhân viên | Quản lý trực tiếp | Quản lý cấp 2 | Phản hồi đã nhận | Chức năng.
- Cột Phản hồi đã nhận chỉ hiển thị số.
- Cột Chức năng rộng 92px và không xuống dòng.
- Không có cột Phản hồi có thể xem / Phản hồi gần nhất.
- Indirect filters nằm trong một popover **Bộ lọc**, không dàn ngang.
- List View mở popup xem nhanh.
- Split View: employee rail trái, feedback pane phải, giữ search/filter khi toggle.
- Popup và Split View có mở tab mới.
- Popup title **Phản hồi đã nhận** + count; metadata nhân viên ở dưới; không có privacy banner.
- Mỗi nhân viên có ít nhất ba manager-visible sample responses.

### Shared data và assets

- Nhân viên: `assets/employees-data.js` → `window.PMS_EMPLOYEES`.
- Core Value images: `Core value with BG/`.
- Design rules: `DESIGN-SYSTEM.md`.
- Rule metadata: không dùng `·` để phân cách metadata UI; dùng ` - `.

### Tài liệu nguồn

- Tổng plan: `FEEDBACK_PLAN.md`.
- Tab classification design: `docs/superpowers/specs/2026-08-03-feedback-tab-classification-design.md`.
- Manager browsing design: `docs/superpowers/specs/2026-08-03-manager-feedback-browsing-design.md`.
- Implementation plan tab classification: `docs/superpowers/plans/2026-08-03-feedback-tab-classification-implementation.md`.
- Implementation plan manager browsing: `docs/superpowers/plans/2026-08-03-manager-feedback-browsing-implementation.md`.

Lưu ý: checkbox trong hai implementation plan chưa được tick lại, nhưng code tương ứng đã hoàn thành và có test. Dùng trạng thái trong file handoff này và `FEEDBACK_PLAN.md` làm nguồn cập nhật mới hơn.

## 4. Logic dữ liệu đã chốt

### Request và response

- `request` dùng theo dõi lời mời, reviewer, ngày gửi, hạn và tiến độ.
- `response` là feedback thực tế, tồn tại độc lập; response từ request có `requestId`.
- Một request nhiều reviewer tạo nhiều response độc lập, không copy nội dung response vào nhiều collection.

### Phân loại tab E-04

- **Đã nhận:** mọi submitted response mà user hiện tại là receiver, gồm proactive và response từ request của user.
- **Đã cho:** mọi response user viết, gồm proactive, trả lời request và draft.
- **Yêu cầu của tôi:** chỉ request user tạo; dùng theo dõi tiến độ, không phải kho response.
- Request 5 người, 3 người trả lời: Yêu cầu của tôi có `Đang thu thập: 3/5`; Đã nhận có 3 response card riêng.
- Draft không tính vào thống kê submitted.

### Visibility

- UC2: người cho chọn Chỉ người nhận hoặc Người nhận + Quản lý của họ.
- Card Đã cho dùng nhãn Chỉ người nhận; card Đã nhận giữ Chỉ mình tôi theo context đã chốt.
- UC1: manager không xem trừ khi response được chia sẻ với manager.
- UC3: manager thấy tất cả response của request mình tạo; reviewer flow là shared và không đổi visibility.
- M-04 chỉ render manager-visible feedback; không tiết lộ số lượng receiver-only.

### Chu kỳ

- Feedback thuộc performance cycle, không đơn thuần calendar year.
- Prototype: cycle 2026 từ 01/01/2026 đến ngày chốt YER 30/04/2027.
- Feedback gắn review cụ thể kế thừa cycle của review, ưu tiên hơn ngày tạo.

## 5. Design rules đã chốt

- Pink chỉ dùng cho primary CTA/active/action cần nhấn; thống kê dùng xám.
- Field bắt buộc dùng dấu `*` đỏ cạnh label; không dùng text “bắt buộc chọn”.
- Popup Feedback không có nút Hủy. Click X hoặc click ngoài popup, nếu có dữ liệu chưa gửi thì hỏi Lưu nháp hoặc Xóa.
- Metadata người dùng dùng `Họ tên (domain) - Phòng ban - Team - Vị trí` khi cần; không dùng dấu chấm giữa.
- Trong feed cá nhân, thông tin org/position hiển thị khi hover tên theo rule đã chốt.
- Feedback card dùng cấu trúc người cho → người nhận, avatar chỉ ở người đầu câu, triangle arrow xám đậm.
- Thời gian trước icon sharing; core-value icon ở góc trên phải box.
- Visibility options không bold, không border bao từng option.
- AI suggestion:
  - Không giữ các text thừa “So sánh bản gốc”, “Giữ bản gốc”, “Chỉnh sửa”.
  - Nút Cải thiện với AI / Cải thiện lại là outline hồng.
  - Sau dùng suggestion vẫn giữ Cải thiện lại.
  - Status nhỏ màu xám: “Đã dùng gợi ý của AI, bạn vẫn có thể sửa thêm”.

## 6. Cách tiếp tục trên máy khác

Ưu tiên clone/pull Git thay vì chép toàn bộ folder thủ công:

```powershell
git clone https://github.com/quynhnguyen18-max/PMS-V3.git
Set-Location 'PMS-V3'
git checkout main
git pull origin main
npm ci
npm run dev
```

Vite chạy tại port 5173 theo `package.json`.

Mở trực tiếp:

- Nhân viên: `http://localhost:5173/E-04/index.html`
- Quản lý: `http://localhost:5173/M-04/index.html`

Copy thêm file `FEEDBACK_HANDOFF_2026-08-04.md` sang root repo mới nếu file chưa được commit.

## 7. Kiểm thử trước khi sửa và trước khi commit

```powershell
node E-04/feedback-model.test.js
node M-04/m04.test.js
git diff --check
```

Trạng thái tại commit `0674245`: 17 test pass — 7 E-04 + 10 M-04.

Sau khi sửa inline JavaScript, kiểm tra cú pháp các HTML liên quan. Có thể dùng:

```powershell
node -e "const fs=require('fs');for(const f of ['E-04/index.html','M-04/index.html','M-04/feedback-detail.html']){const s=fs.readFileSync(f,'utf8');[...s.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/g)].map(x=>x[1]).filter(Boolean).forEach(x=>new Function(x));console.log(f+' syntax OK')}"
```

## 8. Prompt copy sang task/máy mới

```text
Tiếp tục prototype PMS Feedback trong repo PMS-V3, branch main, từ commit 067424550043a5eade4969da4cb57cf2ff67ddd3.

Đọc đầy đủ các file sau trước khi sửa:
- FEEDBACK_HANDOFF_2026-08-04.md
- FEEDBACK_PLAN.md
- DESIGN-SYSTEM.md
- docs/superpowers/specs/2026-08-03-feedback-tab-classification-design.md
- docs/superpowers/specs/2026-08-03-manager-feedback-browsing-design.md
- E-04/feedback-model.js và E-04/feedback-model.test.js
- M-04/manager-feedback-data.js và M-04/m04.test.js

Trạng thái: Phase A–C và D1–D2 đã hoàn thành. Việc tiếp theo là Phase D3 / MR-1 trên M-04: quản lý tạo yêu cầu phản hồi cho direct reports. Hỗ trợ 1 hoặc nhiều employee, nhiều reviewer, câu hỏi chung/cá nhân hóa, due date, preview số request = employee × reviewer, visibility shared cố định cho UC3; data model phải chuẩn bị cho D4 monitoring pending/overdue.

Giữ nguyên toàn bộ quyết định UI/UX và data rules trong handoff. Làm test-first, chạy cả test E-04 và M-04, kiểm tra inline JS và git diff --check trước khi báo hoàn thành. Không commit/push nếu chưa được yêu cầu.
```

## 9. Cảnh báo khi tiếp tục

- Không giả định draft hiện tại được persistence: `DRAFTS` chỉ ở memory.
- Không đưa receiver-only feedback vào count M-04.
- Không nhân bản response từ request; mọi tab/stat phải đọc cùng nguồn normalize.
- Không dùng dấu `·` cho metadata UI mới.
- Không thay đổi E-04 khi triển khai D3 nếu không cần; D3 thuộc view quản lý M-04.
- Không commit/push tự động nếu người dùng chưa yêu cầu.

