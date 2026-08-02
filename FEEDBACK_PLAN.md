# PMS · Continuous Feedback — Plan UI/UX (Đợt 1)

> **Phạm vi đợt này:** UC1 (Employee yêu cầu phản hồi) · UC2 (Cho phản hồi) · UC3 (Manager yêu cầu phản hồi cho cấp dưới) · **UC-R (Reviewer — trả lời yêu cầu phản hồi)**.
> UC4 (Team) & UC5 (HR Programs) — để đợt sau.
> **Trạng thái:** Bản nháp v2 để chị Quỳnh review & chốt. Chưa code.

---

## 1. Nguyên tắc thiết kế bám theo doc

| # | Nguyên tắc | Hệ quả lên UI |
|---|-----------|----------------|
| 1 | Keep it simple — xong <1 phút | Không bắt chọn category. 1 textarea + AI. Ít bước. |
| 2 | One experience — một hành động "Cho phản hồi" | Một nút chính, không tách Recognition/Appreciation/Constructive |
| 3 | Trust by design | Badge visibility luôn hiển thị rõ "ai xem được" ở mọi bước |
| 4 | Guide, not enforce | AI gợi ý STAR/Core Value dạng chip, không phải form bắt buộc |
| 5 | AI as coach | AI là mock, luôn có bước người dùng duyệt; không bao giờ tự gửi |

**Từ ngữ đã chốt:** dùng **"Cho phản hồi"** (không dùng "Chia sẻ phản hồi") và **"Yêu cầu phản hồi"** (không dùng "Xin phản hồi").

---

## 2. Mô hình vai trò (bám theo prototype hiện tại)

Prototype đã tách 2 view qua nút chuyển role ở sidebar: **Nhân viên (màn E-xx)** ↔ **Quản lý (màn M-xx)**. Feedback bám đúng mô hình này — không thêm role mới đợt này.

| Vai trò | Làm được gì với Feedback |
|---------|--------------------------|
| **Nhân viên** | **Cho phản hồi** (UC2) · **Yêu cầu phản hồi** (UC1) · **Trả lời** các yêu cầu phản hồi gửi đến mình (UC-R). Xem phản hồi mình nhận/đã cho. |
| **Quản lý** | Tất cả những gì Nhân viên làm được (với tư cách cá nhân, ở view Nhân viên) **+** hai quyền riêng ở view Quản lý: <br>① **Xem phản hồi mà cấp dưới nhận được** — cả **direct reports** lẫn **indirect reports** (đã có sẵn cơ chế tách LM1/LM2/HOD trong M-01). <br>② **Yêu cầu phản hồi cho direct reports** (UC3) + theo dõi + AI summary. |

> Nghĩa là: một quản lý muốn tự cho/nhận phản hồi cá nhân thì dùng **view Nhân viên**; muốn quản trị phản hồi của team thì dùng **view Quản lý**. Giống hệt cách E-01 (mục tiêu của tôi) vs M-01 (mục tiêu của nhân viên) đang chạy.

---

## 3. Kiến trúc điều hướng (IA) — GOM 1 MENU, MỘT VIEW

Chốt: **chỉ 1 menu "Phản hồi"** ở sidebar (đã có sẵn placeholder). Bấm vào → bên phải hiện **một view duy nhất** thao tác được mọi thứ, **không** đẻ ra nhiều menu con / tab sâu.

### 3a. View Nhân viên — "Phản hồi" (one view)

```
┌───────────────────────────────────────────────────────────────┐
│  Phản hồi                       [ Cho phản hồi ] [ Yêu cầu ▸ ] │ ← 2 nút hành động chính, luôn thấy
├───────────────────────────────────────────────────────────────┤
│  ⚡ Cần bạn phản hồi (3)                                        │ ← panel việc-cần-làm, chỉ hiện khi có (UC-R)
│     • An xin feedback về "Dự án X" · còn 2 ngày   [Trả lời]    │
│     • Sếp Bình xin feedback về Minh · quá hạn      [Trả lời]   │
├───────────────────────────────────────────────────────────────┤
│  [ Tất cả ] [ Đã nhận ] [ Đã cho ] [ Yêu cầu của tôi ]   🔍    │ ← filter nhẹ (segment), KHÔNG phải menu
│                                                                │
│  Dòng thời gian phản hồi (feed hợp nhất)                       │
│   ┌─ card: Nam đã cho bạn phản hồi · 14/03 · [badges CV]      │
│   ├─ card: Bạn đã cho Tú phản hồi · 12/03                     │
│   ├─ card: Yêu cầu của bạn "Sau presentation" · 3/5 đã trả lời│ ← click mở chi tiết tiến độ (R-2)
│   └─ ...                                                        │
└───────────────────────────────────────────────────────────────┘
```

Nguyên tắc IA:
- **1 trang, 1 luồng đọc từ trên xuống.** Việc cần làm (Cần bạn phản hồi) nổi lên đầu; phần còn lại là 1 feed hợp nhất.
- Chuyển giữa Đã nhận / Đã cho / Yêu cầu của tôi bằng **filter segment ngay trên feed**, không rẽ nhánh sang trang khác.
- Hai hành động tạo mới (**Cho phản hồi**, **Yêu cầu phản hồi**) mở **dialog/overlay** (như pattern overlay đang dùng), không rời trang.
- Chi tiết một request (tiến độ, nhắc) mở overlay từ card, không thành menu riêng.

### 3b. View Quản lý — "Phản hồi" (one view)

```
┌───────────────────────────────────────────────────────────────┐
│  Phản hồi (Quản lý)                    [ Yêu cầu phản hồi ▸ ]  │ ← UC3
├───────────────────────────────────────────────────────────────┤
│  [ Direct reports ] [ Indirect reports ]        (LM1/LM2/HOD) │ ← tái dùng cơ chế M-01
├───────────────────────────────────────────────────────────────┤
│  Danh sách nhân viên · phản hồi mỗi người nhận được           │
│   ┌─ Minh Trần   · 8 phản hồi nhận · [xem]                    │ ← mở popup giống popup_fb_preview
│   ├─ Lan Phạm    · 3 phản hồi nhận · [xem]                    │
│   └─ ...                                                        │
│                                                                │
│  Yêu cầu tôi đã tạo cho team (UC3) · tiến độ                   │ ← khu vực monitoring (MR-2)
└───────────────────────────────────────────────────────────────┘
```

- Xem phản hồi cấp dưới nhận được → **tái dùng popup `popup_fb_preview.html`** (xem mục 6).
- Direct/Indirect dùng lại đúng tab-switch LM1/LM2/HOD có sẵn ở M-01.

---

## 4. Danh sách màn hình & thành phần (theo UC)

### UC2 — Cho phản hồi (flagship, có AI) 🎯
Luồng: chọn người → viết tự nhiên → AI gợi ý → review → **tự chọn** visibility → gửi.

| Mã | Màn / State | Nội dung chính |
|----|-------------|----------------|
| S-1 | Compose | Reviewer picker (1 người nhận), textarea "viết tự nhiên" |
| S-2 | AI Coach | Detect intent · chip STAR/STARAR · chip Core Value · nút "Cải thiện wording" |
| S-3 | So sánh Before/After | Bản gốc ↔ bản AI đề xuất → **Chấp nhận / Sửa / Bỏ qua** (người dùng là tác giả cuối) |
| S-4 | Visibility + Xác nhận | **KHÔNG mặc định** — người cho tự chọn: *Chỉ người nhận* hoặc *Người nhận + Quản lý của họ*. Badge "ai xem được" hiển thị rõ theo lựa chọn |
| S-5 | Sent | Xác nhận đã gửi + ai nhận thông báo |

### UC1 — Nhân viên yêu cầu phản hồi (có AI)
Luồng: tạo request → chọn 1–20 reviewers → context + due date → gửi → theo dõi → nhắc → nhận về feed.

| Mã | Màn / State | Nội dung chính |
|----|-------------|----------------|
| R-1 | Tạo yêu cầu | Multi-select reviewer (1–20, chống trùng, không tự chọn mình) · Context/Dự án · Lời nhắn (optional) · Due date. **Xử lý câu hỏi chung vs riêng — xem 4a** |
| R-2 | Chi tiết request | Reviewer + status (Pending/Completed/Expired) · nút **Nhắc** · auto-remind 3 ngày trước hạn |

→ Người được xin trả lời qua **UC-R** bên dưới.

#### 4a. UC1 — nhiều reviewer: câu hỏi/nội dung CHUNG hay RIÊNG?
Khi chọn ≥2 reviewer, cho người dùng chọn chế độ ngay trong R-1:

- **Mặc định — "Cùng một nội dung"**: 1 ô context/câu hỏi áp cho tất cả reviewer. Nhanh, đúng tinh thần <1 phút.
- **Tùy chọn — "Cá nhân hóa"**: bật toggle → mỗi reviewer có ô context/lời nhắn riêng, hiển thị dạng danh sách accordion (mỗi người 1 dòng mở rộng được). Người chưa chỉnh thì kế thừa nội dung chung.

> UI: một toggle "Cá nhân hóa nội dung cho từng người" đặt ngay dưới danh sách reviewer. Off = 1 ô chung; On = danh sách ô riêng. Tránh bắt điền lại từ đầu — luôn seed từ nội dung chung.

### UC-R — Reviewer: trả lời yêu cầu phản hồi (có AI) ★ luồng dùng chung
Điểm hội tụ của UC1 (đồng nghiệp xin) và UC3 (quản lý xin). Entry point: panel "Cần bạn phản hồi" + thông báo in-app.

| Mã | Màn / State | Nội dung chính |
|----|-------------|----------------|
| RV-1 | Panel "Cần bạn phản hồi" | Ai xin · về ai · context · hạn · nguồn (đồng nghiệp/quản lý). Badge overdue. (Đây chính là panel đầu view Nhân viên, không phải trang riêng) |
| RV-2 | Trả lời | Thấy context + lời nhắn người xin · textarea + **AI Coach** (dùng lại S-2/S-3) · **chỉ thấy request của mình** |
| RV-3 | Visibility theo ngữ cảnh | UC1 → reviewer chọn được phạm vi; UC3 → hiện rõ **mặc định shared**, không đổi được. Badge "ai sẽ xem" |
| RV-4 | Submitted | Đã gửi — submit **1 lần**, không sửa |

### UC3 — Quản lý yêu cầu phản hồi (có AI, view Quản lý)
Luồng: chọn direct report(s) → chọn reviewers → context → hệ thống sinh request/(NV×reviewer) → monitor → AI summary.

| Mã | Màn / State | Nội dung chính |
|----|-------------|----------------|
| MR-1 | Tạo yêu cầu | Chọn **direct report** (no skip-level). Scenario A (1 NV → n reviewer) & B (n NV → n reviewer). Reviewer picker. Context + due date. Áp dụng lại lựa chọn **chung/riêng ở 4a**. **Preview số request** (vd 3×5 = 15) |
| MR-2 | Monitoring | Response rate · pending · overdue · bảng theo từng NV |
| MR-3 | AI Coaching Summary | Strengths · Development opportunities · Recurring themes. **Không sửa được.** "Coaching evidence, không phải điểm" |
| — | Reviewer submit | Dùng lại **UC-R**. Visibility mặc định **shared**. |

---

## 5. Component library

- **Feedback card / popup "Phản hồi đã nhận"** — `popup_fb_preview.html` là **popup danh sách phản hồi 1 người nhận**, gắn với nút "Phản hồi đã nhận" ở màn Đánh giá giữa năm. **Tái dùng đúng bối cảnh:** (a) làm card trong feed view Nhân viên; (b) làm popup khi Quản lý bấm "xem" phản hồi của 1 cấp dưới. Chuẩn hóa 1 lần, dùng lại.
- **Core Value badges (5)** — icon-only 34–54px, hover hiện tên. Lấy từ `Core value with BG/`:
  Đổi mới (`Innovation.png`) · Tinh thần đồng đội (`Teamwork.png`) · Không ngừng học hỏi (`Constant_.png`) · Khách hàng là trung tâm (`Customer_.png`) · Thực thi xuất sắc (`Excellence.png`). Style `.cv-item` / `.fb-badge` đã có trong design system.
- **AI Coach panel** — chip STAR/STARAR/Core Value, before/after.
- **Reviewer picker** — search theo **Tên / Domain** (vd: `tu.nguyen`, `nam.tran3`, `hanh.vo1`). Dùng `assets/employees-data.js`.
- **Visibility selector + badge** — nhất quán mọi nơi, không mặc định ở UC2.
- **Status chip** — Pending · Completed · Expired · Overdue · Draft.
- **Empty states** + mẫu thông báo in-app.

---

## 6. Visibility (khác nhau giữa các UC)

| Loại phản hồi | Ai xem được |
|---------------|-------------|
| UC2 | Người cho **tự chọn**: (a) Chỉ người nhận, hoặc (b) Người nhận + Quản lý của họ. Không có default ép sẵn. |
| UC1 (NV yêu cầu) | NV nhận thấy tất cả; reviewer chỉ thấy bản của mình; **Quản lý KHÔNG thấy trừ khi NV chủ động cho xem** |
| UC3 (LM yêu cầu) | LM thấy tất cả; NV (receiver) thấy người cho + nội dung; reviewer mặc định **shared** |
| Quản lý xem team | Quản lý xem được phản hồi cấp dưới **nhận được** (direct + indirect) theo quyền — nhưng vẫn tôn trọng visibility gốc của từng phản hồi |

→ UI phải **hiển thị badge visibility đúng ngữ cảnh** ở từng luồng.

---

## 6b. Chu kỳ & filter theo năm — CHỐT

Phản hồi gom theo **chu kỳ performance**, không theo năm dương lịch (vì feedback là bằng chứng cho MYR/YER của chu kỳ đó → filter "2026" phải khớp "review 2026").

**Mô hình cutover liền mạch (không chồng lấn):** mỗi phản hồi thuộc đúng 1 chu kỳ theo ngày tạo.
- Chu kỳ **2026** = 1/1/2026 → **ngày chốt YER 2026** (prototype: 30/4/2027)
- Chu kỳ **2027** = 1/5/2027 → ngày chốt YER 2027
- ⇒ Feedback tháng 1–4/2027 → tính vào **2026**.

**Tinh chỉnh (ưu tiên cao hơn ngày tạo):** phản hồi gắn thẳng vào 1 review cụ thể (UC1/UC3 cho MYR/YER 2026) → **kế thừa chu kỳ của review đó bất kể ngày tạo**. Xử lý sạch case quản lý thu feedback cho YER 2026 vào tháng 2/2027.

**UI/UX:**
- Có bộ lọc **năm/chu kỳ** trên feed (Nhân viên) và trên màn Quản lý; mặc định = **chu kỳ đang mở**.
- Ngày cutover **HR cấu hình được** ở bản thật; prototype hard-code như trên.

---

## 7. Thứ tự dựng đề xuất

1. **Phase A — Nền:** menu "Phản hồi" (view Nhân viên) — one view: panel "Cần bạn phản hồi" + feed hợp nhất + filter, dựng card từ `popup_fb_preview`.
2. **Phase B — UC2 Cho phản hồi + AI Coach** (flagship).
3. **Phase C — UC1 + UC-R** Tạo/theo dõi yêu cầu (gồm chung/riêng ở 4a) + trả lời của reviewer.
4. **Phase D — UC3 + view Quản lý** Yêu cầu cho team + monitoring + AI summary + màn Quản lý xem phản hồi cấp dưới (direct/indirect).

Mỗi phase xong em gửi chị xem trước khi qua phase kế.

---

## 8. Còn cần chị xác nhận / cung cấp

- [x] Core Values + badges — đã lấy được từ design system (5 giá trị).
- [x] STAR / STARAR — đã đúng ý.
- [x] Gom Feedback Hub 1 menu — chốt.
- [x] UC2 không default visibility — chốt.
- [x] Cách xử lý **chung/riêng ở 4a** (toggle cá nhân hóa) — chị đã OK.
- [x] Màn Quản lý — **hiển thị theo người** (đợt 1 không cần lọc theo loại/CV).
- [x] Chu kỳ & filter — chốt theo **6b** (cutover 30/4, feedback T1–4/2027 tính vào 2026).
- [ ] **Nội dung AI mock:** đã dựng **4 kịch bản** before/after — Ghi nhận · Cảm ơn · Góp ý · Ghi nhận + Góp ý (mixed). Xem trực tiếp: popup **Cho phản hồi** → chọn loại → nút **"Thử với ví dụ"** → **Cải thiện với AI**. ⏳ *Chờ chị duyệt tone tiếng Việt.*

---

## 9. Ngoài phạm vi đợt này
UC4 Team Feedback (2027) · UC5 HR Programs · role HR · Dashboard Analytics đầy đủ · Likert scale · anonymous · tích hợp sâu Performance Review.
