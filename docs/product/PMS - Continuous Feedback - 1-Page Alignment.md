# Continuous Feedback — 1-Page Alignment

*Những điểm phải thống nhất trước khi dựng module structure và foundation của hệ thống.*

---

## 1. Actor model — nền của lớp phân quyền

| Actor | Request feedback cho ai | Xem được feedback **Shared** của ai |
|---|---|---|
| **Employee** | Chính mình | Không |
| **Line Manager** | Direct reports | Direct reports |
| **Indirect Manager** *(Upper LM, HOD)* | **Không được tạo request** | Toàn bộ nhân sự under mình |
| **HRBP** | Nhân sự thuộc BU được phân công | Không |
| **L&OD** | Toàn tổ chức, trừ khối HR | Không |
| **HR Admin** | Không | Không |

**Org Matrix là nguồn duy nhất** xác định direct report, chuỗi quản lý và phạm vi BU. Quyền không khai báo thủ công theo user.

---

## 2. Core objects — nền của data model

| Object | Định nghĩa |
|---|---|
| **Feedback** | Một bản ghi phản hồi: Feedback Giver → Feedback Receiver |
| **Feedback Request** | Gói yêu cầu do Requester tạo |
| **Request Item** | Đơn vị công việc = 1 Feedback Receiver × 1 Invited Giver |
| **Program** | Chiến dịch có cấu trúc của HR Team (HRBP + L&OD) — object riêng, không dùng chung với Feedback |

---

## 3. Visibility model — nền của lớp access control

Hai lựa chọn duy nhất, do **Feedback Giver** quyết định:

- **Private** — Feedback Giver + Feedback Receiver
- **Shared** — thêm Line Manager + toàn bộ Indirect Managers của Feedback Receiver

| # | Nguyên tắc |
|---|---|
| **VP1** | Private là mặc định |
| **VP2** | Chỉ Feedback Giver chọn phạm vi. Không ai đổi được sau khi gửi |
| **VP3** | Hệ thống hiển thị **đúng tên** người sẽ xem được, trước khi gửi |
| **VP4** | Danh sách người xem được chốt tại thời điểm gửi. Thay đổi cơ cấu tổ chức sau đó không mở thêm quyền |
| **VP5** | Feedback Receiver luôn xem được feedback về mình, trừ cấu hình riêng trong Program |

---

## 4. Module structure & thứ tự xây

| Module | Use cases | Initiator | Phase |
|---|---|---|:--:|
| **M1 — Feedback Exchange** | UC2 Give Feedback · UC1 Request Feedback (Employee) · UC6 Respond to Feedback Request · Feedback Activity | Employee | **1** |
| **M2 — Manager Feedback Request** | UC3 Request Feedback (Manager) | Line Manager | **2** |
| **M3 — HR Feedback Programs** | UC5 Tier 1 Quick Request · UC5 Tier 2 Structured Program | HR Team (HRBP + L&OD) | **3** |
| **M4 — Team Feedback** | UC4 Team Feedback | Project Manager / Team Lead | **4** |

Ranh giới module xác định theo **initiator + permission scope + output type**.

---

## 5. Thành phần dùng chung — quyết định cấu trúc code

| Thành phần | Dùng ở |
|---|---|
| **Feedback Composer** *(intention → draft → AI suggest → visibility)* | M1, M2, M3 Tier 1 |
| **Request Item engine** *(fan-out, deadline, reminder, decline)* | M1, M2, M3 Tier 1 |
| **Scope filter service** *(lọc người theo Org Matrix)* | M1, M2, M3 |
| **Audience resolver** *(dựng danh sách người xem, chốt tại thời điểm gửi)* | Toàn hệ thống |

**M3 Tier 2 và M4 không dùng chung** — có object riêng, vòng đời riêng, response form riêng.

---

## 6. Ràng buộc nền tảng

| Ràng buộc | Nội dung |
|---|---|
| **AI** | Xử lý trong nội bộ tổ chức. AI **không bao giờ là điều kiện để gửi** — lỗi AI thì composer vẫn hoạt động |
| **Language** | EN + VN cho cả UI và AI |
| **Notification** | Email |
| **Prototype** | AI dạng scripted simulation |

---

## 7. Năm điều phải chốt trước khi dựng foundation

| # | Vấn đề | Ảnh hưởng tới foundation | Đề xuất |
|:--:|---|---|---|
| 1 | **Shared** đi hết chuỗi quản lý hay giới hạn số cấp? | Cách hoạt động của audience resolver | Đi hết chuỗi theo Org Matrix, hiển thị đủ tên trước khi gửi |
| 2 | Feedback Receiver xem kết quả UC3 / UC5 **khi nào**? | Có cần trạng thái *released* trong data model không | Requester xem trước, chủ động release. Receiver luôn được thông báo là có request đang diễn ra |
| 3 | Org Matrix đã có đủ **direct report + chuỗi quản lý + cờ khối HR** chưa? | Toàn bộ lớp phân quyền phụ thuộc dữ liệu này | Kiểm tra dữ liệu trước Phase 1, không kiểm tra trong lúc build |
| 4 | Bảng phân công **HRBP ↔ BU** đã có chưa? | Không có bảng này thì M3 không bật được | Xác nhận trước Phase 3 |
| 5 | AI in-tenant xử lý **tiếng Việt** đạt chưa? | Quyết định AI có nằm trong Phase 1 hay không | Nếu chưa đạt, Phase 1 tắt gợi ý AI cho tiếng Việt thay vì hiển thị gợi ý sai |
