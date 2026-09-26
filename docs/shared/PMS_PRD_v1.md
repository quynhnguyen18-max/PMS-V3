# PRD – Performance Management System (PMS)
**Product:** MoMo HRM – Performance Management Module  
**Version:** 1.1 (Draft for review)  
**Author:** (chờ review)  
**Ngày:** 07/06/2026  
**Trạng thái:** Draft – chờ review lần 2

---

## 1. Tổng quan sản phẩm

### 1.1 Mục tiêu
Xây dựng hệ thống quản lý hiệu suất nội bộ (PMS) cho MoMo, cho phép:
- Thiết lập và theo dõi mục tiêu cá nhân theo chu kỳ năm
- Tổ chức đánh giá định kỳ (giữa năm, cuối năm) theo quy trình nhiều cấp
- Hỗ trợ phản hồi liên tục giữa nhân viên và quản lý
- Cung cấp dữ liệu điểm đánh giá tổng hợp cho HRBP, HOD, L&OD

### 1.2 Người dùng (Roles)
| Role | Mô tả |
|---|---|
| **Nhân viên (Employee)** | Tạo mục tiêu, tự đánh giá, nhận phản hồi |
| **Quản lý Cấp 1 (L1)** | Quản lý trực tiếp – duyệt mục tiêu, đánh giá nhân viên trong các kỳ MYR và YER |
| **Quản lý Cấp 2 (L2)** | Quản lý gián tiếp – review và cho điểm sau L1 |
| **HOD** | Trưởng bộ phận – phê duyệt cuối cùng trong quy trình đánh giá |
| **HRBP** | HR Business Partner – theo dõi tiến độ đánh giá (MYR & YER), upload điểm HOD rating, thay đổi PIC tại các bước đánh giá |
| **L&OD** | Learning & Org Development – cấu hình chu kỳ và kỳ đánh giá, setup thông báo, định nghĩa điều kiện nhân viên tham gia, xem và phân tích dữ liệu đánh giá |

### 1.3 Phạm vi (In Scope)
- **Cấu hình chu kỳ đánh giá (Evaluation Cycle):** L&OD thiết lập chu kỳ năm, kỳ đánh giá (MYR/YER), điều kiện tham gia và thông báo
- **Thiết lập mục tiêu (Goal Setting):** Bao gồm cả việc nhân viên thiết lập mục tiêu cá nhân lẫn quản lý trực tiếp (L1) xem xét và phê duyệt
- **Đánh giá giữa năm (Mid-Year Review – MYR)**
- **Đánh giá cuối năm (End-Year Review – YER)**
- **Theo dõi và xử lý điểm (Score Tracking & Management)**
- **Phản hồi cá nhân (Feedback)**

---

## 2. Kiến trúc tổng thể – Data Model

### 2.1 Hierarchy
```
Cycle (Chu kỳ năm, VD: 2026)
  └─ Period (Kỳ đánh giá: tối đa 2 kỳ/chu kỳ)
       ├─ MYR – Mid-Year Review
       └─ YER – End-Year Review
            └─ Employee Goals (per employee)
                 ├─ WHAT Goals (Mục tiêu công việc)
                 ├─ DEVELOP Goals (Mục tiêu phát triển)
                 └─ HOW Goals / Behavioral Goals (5 giá trị cốt lõi, cố định)
            └─ Evaluation Record (per employee per period)
                 ├─ Self Rating (NV)
                 ├─ L1 Rating
                 ├─ L2 Rating
                 ├─ HOD Rating
                 └─ Final Rating (CEO Approved – chỉ áp dụng cho YER)
```

### 2.2 Trạng thái Goal (State Machine)

```
NV tạo mục tiêu
     ↓
  [Draft] ←──────────────────────────────────────────────┐
     ↓ NV "Gửi quản lý"                                  │
  [Pending]                                               │
     ↓                                                    │
  Manager xem xét                                         │
  ┌──────────────────────┬──────────────────┐             │
  ↓                      ↓                  ↓             │
[Approved]           [Rejected]     [Request Update]      │
  │                                         ↓             │
  │                                   NV chỉnh sửa ──────→┘
  │    NV tự thu hồi                        ↑
  └──→ [Update / Recalled] ────────────────→┘
```

| Trạng thái | Mô tả | Actor khởi tạo |
|---|---|---|
| **Draft** | Nháp – chưa gửi | Employee |
| **Pending** | Chờ quản lý duyệt | Employee (khi submit) |
| **Approved** | Đã duyệt | Manager (L1) |
| **Rejected** | Từ chối | Manager (L1) |
| **Update / Yêu cầu cập nhật** | Trả về cho NV chỉnh sửa – có thể do: (1) NV chủ động thu hồi mục tiêu đã gửi để chỉnh sửa, hoặc (2) Manager chọn "Yêu cầu cập nhật" để trả lại cho NV edit | Employee (tự thu hồi) hoặc Manager |
| **Waiting_mgr1** | Chờ QL Cấp 1 đánh giá (trong kỳ review) | System |
| **Completed** | Hoàn thành | System |
| **Deleted** | Đã xoá | Employee |

> **Lưu ý:** Manager L1 **không thể Reject** mục tiêu sau khi đã Approved, nhưng có thể chọn "Yêu cầu cập nhật" để trả lại cho NV chỉnh sửa trong cửa sổ goal-setting.

### 2.3 Trạng thái Evaluation Record

**Kỳ MYR (Mid-Year Review):**
```
[Waiting NV] → [Waiting L1] → [Waiting L2] → [Waiting HOD] → [HOD Done / Completed]
```
Bước đánh giá cuối cùng của MYR là **HOD phê duyệt**.

**Kỳ YER (End-Year Review):**
```
[Waiting NV] → [Waiting L1] → [Waiting L2] → [Waiting HOD] → [HOD Done] → [Waiting CEO Approval] → [Final / Completed]
```
Sau khi HOD hoàn thành, kết quả chờ **CEO Approved** mới là điểm final chính thức và kết thúc quy trình YER.

---

## 3. Module 1 – Cấu hình Chu kỳ (L&OD)

### 3.1 Mô tả
**L&OD** tạo và quản lý các chu kỳ đánh giá. Một chu kỳ tương ứng với 1 năm dương lịch (VD: 2026, 2027) và bao gồm tối đa 2 kỳ đánh giá: MYR và YER. Mỗi nhân viên chỉ tham gia **một chu kỳ mỗi năm**.

### 3.2 Vòng đời Chu kỳ
```
[Khởi tạo / Draft] → [Hoạt động / Active] → [Hoàn thành / Completed]
```

### 3.3 Thông tin Chu kỳ

**Thông tin cơ bản:**
- Tên chu kỳ (ví dụ: "IT 2026")
- Năm đánh giá
- Ngày bắt đầu / kết thúc chu kỳ
- Mô tả ngắn

**Thời hạn thiết lập mục tiêu:**
- Ngày bắt đầu tạo mục tiêu
- Hạn chốt tạo mục tiêu
- *Lưu ý:* Nhân viên có thể thiết lập và cập nhật mục tiêu trong suốt năm, nhưng cần đảm bảo mục tiêu được phê duyệt **trước khi kỳ đánh giá bắt đầu** (MYR hoặc YER).

**Yêu cầu mục tiêu tối thiểu để tham gia kỳ đánh giá:**
- Số lượng WHAT Goals tối thiểu (do L&OD cấu hình)
- Số lượng DEVELOP Goals tối thiểu (do L&OD cấu hình)

**Onboarding Rule:**
- Nhân viên onboard **sau** ngày `onboarding_deadline` của chu kỳ sẽ **không tham gia** chu kỳ đó
- Không có chu kỳ rút gọn

### 3.4 Điều kiện tham gia (Participant Conditions)
Cả MYR và YER đều có điều kiện tham gia riêng, được cấu hình bởi L&OD. Áp dụng theo điều kiện cụ thể hoặc tất cả nhân viên:
- **Vị trí công việc** (Job Position) – chọn nhiều
- **Level nhân viên** – chọn nhiều
- **Loại hợp đồng** – chọn nhiều (CT, ON, TV, DV, TT, NT)
- **Khối / Phòng ban / Bộ phận** – cây tổ chức (org tree)
- **Nhân viên ngoại lệ** – loại trừ theo tên cụ thể

Danh sách nhân viên đủ điều kiện được lấy từ **HR masterlist tích hợp realtime**.

### 3.5 Kỳ Đánh giá (Periods) trong Chu kỳ
Mỗi chu kỳ có **tối đa 2 kỳ đánh giá**: MYR và YER. Mỗi kỳ được cấu hình:

| Trường | Mô tả |
|---|---|
| Tên kỳ | VD: "MID YEAR REVIEW 2026", "END YEAR REVIEW 2026" |
| Loại kỳ | MYR hoặc YER (chỉ 1 kỳ YER / chu kỳ) |
| Ngày bắt đầu / kết thúc kỳ | Phạm vi thời gian của kỳ |
| Ngày cho phép đánh giá | Ngày mở cửa sổ đánh giá |
| Hạn chốt đánh giá | Ngày đóng cửa sổ đánh giá |
| Deadline NV tự đánh giá | |
| Deadline QL Cấp 1 | |
| Deadline QL Cấp 2 | |
| Deadline HOD | |
| NV onboard trước ngày | Điều kiện tham gia kỳ |
| Min WHAT Goals | Điều kiện để kỳ hợp lệ |
| Min DEVELOP Goals | Điều kiện để kỳ hợp lệ |
| Công bố kết quả | Có / Không |

### 3.6 Thông báo Chu kỳ (do L&OD cấu hình)
- Cấu hình các loại thông báo tự động (email/in-app) theo sự kiện
- Ví dụ: "Mở kỳ đánh giá", "Nhắc nhở deadline", "Công bố kết quả"
- Theo dõi trạng thái gửi và số lượng đã gửi

### 3.7 Business Rules
- Mỗi chu kỳ chỉ có tối đa **1 kỳ YER** và **1 kỳ MYR**
- Chu kỳ **Draft**: chỉnh sửa tự do
- Chu kỳ **Active**: chỉ chỉnh sửa các trường không ảnh hưởng đến dữ liệu đang có
- Chu kỳ **Completed**: chỉ đọc
- Mỗi nhân viên chỉ tham gia **một chu kỳ mỗi năm**

---

## 4. Module 2 – Thiết lập Mục tiêu (Goal Setting)

### 4.1 Mô tả
**Goal Setting** là quá trình hai chiều: Nhân viên tạo và submit mục tiêu, Quản lý trực tiếp (L1) xem xét và phê duyệt. Mục tiêu có thể được tạo và cập nhật trong suốt cửa sổ goal-setting của chu kỳ, nhưng cần đạt trạng thái **Approved** trước khi kỳ đánh giá bắt đầu.

### 4.2 Phân loại Mục tiêu

#### A. WHAT Goals (Mục tiêu Công việc)
- Do nhân viên tự tạo
- Gắn với kết quả công việc định lượng (KPI, OKR, milestone...)
- Có mức độ ưu tiên: Thấp / Trung bình / Cao
- Bắt buộc có: tiêu đề, thời gian, mô tả kết quả cần đạt

#### B. DEVELOP Goals (Mục tiêu Phát triển)
- Do nhân viên tự tạo
- Gắn với kỹ năng, năng lực, học tập
- Có mức độ ưu tiên: Thấp / Trung bình / Cao

#### C. HOW Goals / Behavioral Goals (Mục tiêu Hành vi)
- **Cố định**, do công ty định nghĩa – nhân viên không tạo/xóa
- 5 giá trị cốt lõi của MoMo:
  1. **Thấu hiểu khách hàng** (Customer First)
  2. **Đổi mới sáng tạo** (Innovation)
  3. **Tinh thần đồng đội** (Teamwork)
  4. **Thực thi xuất sắc** (Excellence in Execution)
  5. **Tinh thần học hỏi không ngừng** (Constant Learning)
- Mỗi giá trị có tiêu chí đánh giá bằng tiếng Việt và tiếng Anh
- Tự động xuất hiện trong MYR và YER

### 4.3 Quy trình tạo và duyệt mục tiêu

```
NV tạo mục tiêu
     ↓
  [Draft] ←──────────────────────────────────────────────┐
     ↓ NV "Gửi quản lý"                                  │
  [Pending]                                               │
     ↓                                                    │
  L1 xem xét                                             │
  ┌──────────────────────┬──────────────────┐             │
  ↓                      ↓                  ↓             │
[Approved]           [Rejected]     [Request Update]      │
  │                                         ↓             │
  │ (trong cửa sổ                     NV chỉnh sửa ─────→┘
  │  goal-setting)                          ↑
  └──→ NV tự thu hồi ───────────────────────┘
```

**Chi tiết trường của Goal:**
| Trường | Bắt buộc | Mô tả |
|---|---|---|
| Loại mục tiêu | ✓ | WHAT / DEVELOP |
| Mức độ ưu tiên | ✓ | Low / Mid / High |
| Từ ngày | ✓ | Ngày bắt đầu mục tiêu |
| Đến ngày | ✓ | Ngày kết thúc mục tiêu |
| Tiêu đề | ✓ | Max 1000 ký tự |
| Kết quả cần đạt | ✓ | KPIs, KRs, định lượng. Max 4000 ký tự |

### 4.4 Tính năng bổ sung
- **Bulk upload:** Nhập nhiều mục tiêu cùng lúc qua file CSV
- **Bulk send:** Chọn nhiều mục tiêu Draft → Gửi quản lý cùng lúc
- **Comments:** Thread bình luận trên từng mục tiêu (employee + manager)
- **History:** Lịch sử thay đổi trạng thái, có timestamp và actor

### 4.5 Manager – Phê duyệt Mục tiêu (L1)
Manager xem danh sách mục tiêu của tất cả nhân viên trong team:
- **Lọc theo:** vai trò (L1 direct / HOD indirect), domain nhân viên, tên mục tiêu, trạng thái, Khối/Phòng ban/Đội nhóm
- **Hành động trên từng mục tiêu:** Duyệt / Từ chối / Yêu cầu cập nhật + ghi chú lý do
- **Hành động hàng loạt:** Duyệt nhiều mục tiêu cùng lúc
- Sau khi đã Approved, L1 **không thể Reject**, nhưng có thể chọn "Yêu cầu cập nhật" để trả lại cho NV chỉnh sửa

### 4.6 HRBP – Phê duyệt thay/Thay đổi PIC
- **HRBP** có thể thực hiện hành động phê duyệt goal thay cho quản lý trong trường hợp cần thiết (VD: manager vắng mặt, chuyển team)
- **HRBP** có thể thay đổi PIC (người chịu trách nhiệm đánh giá) tại các bước trong quy trình đánh giá
- Hệ thống **tự động cập nhật L1** dựa trên HR masterlist khi nhân viên chuyển team giữa chu kỳ
- HRBP **không** thực hiện phê duyệt mục tiêu thay cho manager

### 4.7 Business Rules
- Cửa sổ tạo/chỉnh sửa mục tiêu diễn ra trong suốt năm, nhân viên cần đảm bảo goal được **Approved trước khi kỳ đánh giá bắt đầu**
- Nhân viên onboard sau `onboarding_deadline` không tham gia chu kỳ
- Mục tiêu trạng thái `Approved` là điều kiện cần để tham gia kỳ đánh giá
- Mục tiêu `Rejected` hoặc `Deleted` không xuất hiện trong kỳ đánh giá

---

## 5. Module 3 – Mid-Year Review (MYR)

### 5.1 Mô tả
Đánh giá định kỳ giữa năm, đóng vai trò như một **giai đoạn check-in về tiến độ**. Kết quả MYR **không ảnh hưởng đến Final Rating** cuối năm. MYR chỉ áp dụng cho nhân viên đáp ứng điều kiện đã cấu hình.

### 5.2 Điều kiện để bắt đầu đánh giá
Nhân viên phải có **tối thiểu** (theo cấu hình L&OD):
- ≥ N WHAT Goals đã được phê duyệt (Approved)
- ≥ N DEVELOP Goals đã được phê duyệt (Approved)

Nếu thiếu điều kiện, hệ thống hiển thị thông báo cụ thể và khoá nút đánh giá.

### 5.3 Thang điểm đánh giá
**5-point scale (hỗ trợ nửa điểm – half-star):**
| Điểm | Nhãn |
|---|---|
| 1.0 | Không đạt yêu cầu |
| 2.0 | Hoàn thành một phần |
| 3.0 | Hoàn thành kỳ vọng |
| 4.0 | Hoàn thành trên mức kỳ vọng |
| 5.0 | Hoàn thành vượt xa kỳ vọng |

Hỗ trợ điểm 0.5, 1.0, 1.5, ..., 4.5, 5.0. Điểm là lựa chọn theo nhận xét toàn diện, **không có công thức tính trung bình hay trọng số**.

### 5.4 Quy trình đánh giá MYR

#### Bước 1 – Nhân viên tự đánh giá (Self Review)
1. Vào tab **MID YEAR REVIEW** trong cửa sổ thời gian quy định
2. Hệ thống hiển thị danh sách goals đủ điều kiện (status: approved/waiting_mgr1)
3. Nhân viên cho điểm từng **WHAT Goal** (0.5–5.0 + ghi chú tùy chọn)
4. Nhân viên cho điểm từng **DEVELOP Goal** (0.5–5.0 + ghi chú tùy chọn)
5. Nhân viên cho điểm 5 **HOW Goals / Behavioral Goals** (cùng thang điểm + ghi chú tùy chọn)
6. Khi tất cả goals đã được chấm điểm, phần **Overall Rating** mở khoá

#### Bước 2 – Overall Rating (Self)
- Nhân viên chọn điểm Overall (thang 1–5, hỗ trợ 0.5)
- Nhân viên điền nhận xét tổng quan về performance của bản thân
- Submit → chuyển sang Bước 3

#### Bước 3 – Manager Review (L1) *(Bắt buộc)*
L1 xem điểm tự đánh giá của NV và thực hiện:

| Hành động | Bắt buộc |
|---|---|
| Cho điểm rating từng WHAT Goal | ✓ Bắt buộc |
| Cho điểm rating từng DEVELOP Goal | ✓ Bắt buộc |
| Cho điểm rating từng HOW Goal | ✓ Bắt buộc |
| **Overall Rating** (điểm toàn diện) | ✓ Bắt buộc |
| **Overall Comment** (nhận xét toàn diện về performance) | ✓ Bắt buộc |
| Comment/feedback cho từng goal riêng lẻ | ○ Tùy chọn |
| Overall comment theo từng nhóm (WHAT / HOW / DEVELOP) | ○ Tùy chọn – hệ thống cung cấp ô nhập riêng cho từng nhóm |

> **Thiết kế hệ thống:** Cần có ô nhập Overall Comment riêng cho 3 nhóm mục tiêu: WHAT, HOW, DEVELOP – cho phép L1 ghi nhận xét tổng thể theo từng chiều đánh giá trước khi điền Overall Rating chung.

#### Bước 4 – Manager Review (L2)
- L2 xem điểm của NV và L1
- Cho điểm L2 rating (tương tự L1)
- Submit → chuyển HOD

#### Bước 5 – HOD Review (Bước cuối của MYR)
- HOD xem toàn bộ điểm các cấp
- Cho điểm HOD rating + Overall Comment
- Submit → **HOD Done** = kết thúc MYR

### 5.5 Cửa sổ thời gian (Evaluation Window)
- Hệ thống chỉ cho phép submit trong thời gian `evalFrom` – `evalTo` của kỳ
- Ngoài cửa sổ: chế độ xem (view only), không cho phép nhập/sửa điểm
- Hiển thị banner cảnh báo khi gần deadline

### 5.6 Hiển thị MYR (Employee View)
```
┌──────────────────────────────────────────────────┐
│ [Tab: Danh sách MG] [MID YEAR] [END YEAR]        │
│ [Banner: Thời hạn đánh giá MYR: XX/XX – XX/XX]  │
├──────────────────────────────────────────────────┤
│ SECTION: WHAT Goals (2 goals)                    │
│  • [Goal 1] ★★★☆☆  3.0  [Ghi chú – tùy chọn]   │
│  • [Goal 2] ★★★★☆  4.0  [Ghi chú – tùy chọn]   │
├──────────────────────────────────────────────────┤
│ SECTION: DEVELOP Goals (1 goal)                  │
│  • [Goal 3] ★★★★★  5.0  [Ghi chú – tùy chọn]   │
├──────────────────────────────────────────────────┤
│ SECTION: HOW Goals (5 behaviors)                 │
│  • Customer First    ★★★★☆ 4.0                  │
│  • Innovation        ★★★☆☆ 3.5                  │
│  • ...                                            │
├──────────────────────────────────────────────────┤
│ SECTION: Overall Rating (mở khoá khi đủ điểm)   │
│  Điểm Overall: [★★★★☆]                          │
│  Nhận xét tổng quan: [____________________]      │
│  [Nút: Gửi đánh giá]                             │
└──────────────────────────────────────────────────┘
```

---

## 6. Module 4 – End-Year Review (YER)

### 6.1 Mô tả
Đánh giá chính thức cuối năm. Quy trình tương tự MYR nhưng có thêm bước **CEO Approved** để xác nhận kết quả final. YER chỉ áp dụng cho nhân viên đáp ứng điều kiện đã cấu hình (có thể khác điều kiện MYR).

Điểm YER:
- Gắn với các quyết định về tăng lương, thưởng, thăng tiến
- Được công bố cho nhân viên sau khi CEO Approved (nếu cấu hình `publish = Yes`)
- **Điểm MYR không ảnh hưởng đến Final Rating của YER**

### 6.2 Quy trình đánh giá YER
```
NV tự đánh giá
      ↓
  L1 đánh giá (bắt buộc: điểm từng goal + overall rating + overall comment)
      ↓
  L2 đánh giá
      ↓
  HOD đánh giá
      ↓
  [HOD Done]
      ↓
  [CEO Approved] ← Điểm final chính thức
      ↓
  Công bố kết quả (nếu publish = Yes)
```

### 6.3 Cấu trúc điểm YER

| Cấp | Trường điểm | Actor | Bắt buộc |
|---|---|---|---|
| Nhân viên | `empRating`, `empNote` | Employee | ✓ |
| Quản lý Cấp 1 | `l1Rating`, `l1Note`, `l1OverallComment` | L1 Manager | ✓ |
| Quản lý Cấp 2 | `l2Rating`, `l2Note` | L2 Manager | ✓ (nếu có) |
| HOD | `hodRating`, `hodNote` | HOD | ✓ |
| **Final / CEO Approved** | `finalRating` | CEO / Authorized approver | ✓ |

**Điểm Final** = điểm do CEO/người được ủy quyền phê duyệt sau khi xem xét toàn bộ quy trình. Không tính theo công thức, là lựa chọn dựa trên đánh giá tổng thể.

### 6.4 L1 Scoring – Yêu cầu trong YER (giống MYR)

| Hành động | Bắt buộc |
|---|---|
| Cho điểm rating từng WHAT Goal | ✓ Bắt buộc |
| Cho điểm rating từng DEVELOP Goal | ✓ Bắt buộc |
| Cho điểm rating từng HOW Goal | ✓ Bắt buộc |
| **Overall Rating** | ✓ Bắt buộc |
| **Overall Comment** | ✓ Bắt buộc |
| Comment/feedback cho từng goal riêng lẻ | ○ Tùy chọn |
| Overall comment theo từng nhóm (WHAT / HOW / DEVELOP) | ○ Tùy chọn |

### 6.5 Điểm Goal chi tiết (Goal-level scores)
Mỗi goal lưu điểm riêng của từng cấp:
- `goalId_empRating`, `goalId_empNote`
- `goalId_l1Rating`, `goalId_l1Note`
- `goalId_l2Rating`, `goalId_l2Note`
- `goalId_hodRating`, `goalId_hodNote`

Tương tự cho 5 HOW / Behavioral Goals.

### 6.6 Business Rules
- Chuỗi đánh giá phải theo thứ tự: NV → L1 → L2 → HOD → CEO
- Nếu không có L2, hệ thống tự bỏ qua bước L2
- Điểm của từng cấp chỉ được nhập trong cửa sổ thời gian của cấp đó
- Kết quả chỉ công bố khi CEO Approved và L&OD bật `publish = Yes`

---

## 7. Module 5 – Theo dõi và Xử lý Điểm (HRBP)

### 7.1 Mô tả
HRBP có vai trò theo dõi tiến độ đánh giá và upload điểm HOD rating. HRBP **không** thực hiện cấu hình chu kỳ.

### 7.2 Nhiệm vụ của HRBP
| Nhiệm vụ | Mô tả |
|---|---|
| **Tracking progress** | Theo dõi tiến độ đánh giá MYR & YER của từng nhân viên/team |
| **Upload HOD rating** | Upload điểm HOD hàng loạt qua CSV cho MYR và YER |
| **Thay đổi PIC** | Thay đổi người chịu trách nhiệm đánh giá tại các bước (VD: khi L1 chuyển team, nghỉ phép dài hạn) |
| **Export** | Xuất dữ liệu điểm để phân tích |

### 7.3 Phân quyền trong Score Tracking
| Role | Xem tiến độ | Upload CSV | Export | Thay đổi PIC |
|---|---|---|---|---|
| HRBP | ✓ | ✓ (HOD rating) | ✓ | ✓ |
| HOD | ✓ (team mình) | ✓ (score của mình) | ✓ | – |
| L&OD | ✓ | – | ✓ | – |

### 7.4 Bảng theo dõi tiến độ
Mỗi dòng = 1 nhân viên, hiển thị:
- Tên NV, mã NV, Khối, Phòng ban, Đội nhóm
- Kỳ đánh giá (MYR / YER)
- Trạng thái (waiting_nv / waiting_l1 / waiting_l2 / waiting_hod / hod_done / final)
- Điểm NV | Điểm QL1 | Điểm QL2 | Điểm HOD | **Điểm Final**

### 7.5 Upload điểm HOD hàng loạt (Bulk Score Upload)
- Format CSV: `emp_id, ky (myr/yer), hod_rating, note`
- Nút Export để tải template có sẵn danh sách NV đủ điều kiện
- Preview trước khi import, hiển thị lỗi theo dòng

### 7.6 Tính năng "Lấy điểm cấp trước"
Bulk action: Chọn nhiều nhân viên → Copy điểm từ cấp liền trước (tiết kiệm thời gian khi HOD đồng ý với điểm L2).

---

## 8. Module 6 – Team Goals & Review View (Manager)

### 8.1 Mô tả
Manager xem và quản lý mục tiêu + đánh giá của tất cả nhân viên trong team.

### 8.2 Tab: Danh sách Mục tiêu Nhân viên
- Hiển thị employee lanes (accordion mở/đóng per NV)
- Mỗi lane: tên NV, stats (số mục tiêu theo trạng thái), danh sách goals
- Filter: Vai trò (L1 direct / HOD indirect), domain email, tên mục tiêu, trạng thái, Khối/Phòng/Team
- Bulk approve goals

### 8.3 Tab: MYR – Đánh giá Nhân viên
- Bảng điểm MYR của team
- Filter: vai trò quản lý (L1/L2/HOD), trạng thái đánh giá, domain NV
- Click vào dòng → mở trang đánh giá chi tiết của NV đó

### 8.4 Tab: YER – Đánh giá Nhân viên
- Tương tự MYR nhưng cho YER
- Thêm filter "Hiển thị dữ liệu": YER only / Tất cả các kỳ
- Cột điểm: NV | QL1 | QL2 | HOD | Final

### 8.5 Trang Đánh giá Chi tiết Nhân viên (Manager Scoring)
Khi click vào 1 NV từ team view:
- Xem chi tiết tất cả goals của NV (WHAT / DEVELOP / HOW)
- Xem điểm tự đánh giá của NV
- **Nhập điểm rating từng goal** (bắt buộc)
- **Nhập Overall Rating** (bắt buộc)
- **Nhập Overall Comment** – nhận xét toàn diện về performance (bắt buộc)
- Ô nhập comment theo từng nhóm mục tiêu: WHAT / HOW / DEVELOP (tùy chọn)
- Comment cho từng goal riêng lẻ (tùy chọn)
- Nút Submit → chuyển sang cấp tiếp theo

---

## 9. Module 7 – Phản hồi Cá nhân (Feedback)

### 9.1 Mô tả
Tính năng phản hồi 360 độ liên tục, không gắn với chu kỳ. Nhân viên có thể gửi phản hồi cho bất kỳ đồng nghiệp nào.

### 9.2 Cấu trúc Feedback
| Trường | Mô tả |
|---|---|
| Người nhận | 1 hoặc nhiều NV |
| Nội dung | Text tự do |
| Badge | Tag giá trị cốt lõi (1 hoặc nhiều): Customer First, Innovation, Teamwork, Excellence, Learning |
| Chia sẻ | Tùy chọn hiển thị cho người khác |

### 9.3 Phân loại
- **Phản hồi đã cho (Given):** Feedback đã gửi đi
- **Phản hồi đã nhận (Received):** Feedback nhận từ đồng nghiệp

### 9.4 Manager – Quản lý Phản hồi
- Xem toàn bộ feedback trong team
- Filter: loại (given/received), badge, tên NV
- Stats tổng quan (số lượng theo loại)

---

## 10. User Flows Chính

### Flow 1: Thiết lập Mục tiêu (Employee + L1)
1. NV vào **Mục tiêu và đánh giá cá nhân** → Chọn Chu kỳ
2. NV click **Tạo mục tiêu** → Chọn loại (WHAT / DEVELOP)
3. Điền form: tiêu đề, kết quả cần đạt, priority, thời gian
4. **Lưu nháp** hoặc **Gửi quản lý**
5. L1 nhận notification → Duyệt / Từ chối / Yêu cầu cập nhật
6. NV nhận kết quả → chỉnh sửa nếu bị yêu cầu → gửi lại

### Flow 2: Mid-Year Self Review (Employee)
1. Chọn chu kỳ → Click tab **MID YEAR REVIEW**
2. Hệ thống kiểm tra điều kiện (banner thông báo nếu chưa đủ)
3. Chấm điểm từng WHAT Goal → DEVELOP Goal → HOW Goal
4. Phần Overall mở khoá → Chọn Overall Rating + ghi nhận xét
5. Submit → Status chuyển "Waiting L1"

### Flow 3: Manager Scoring – MYR/YER (L1)
1. Vào **Đánh giá đội nhóm** → Tab MYR hoặc YER
2. Xem bảng NV chờ đánh giá (status: waiting_l1)
3. Click vào NV → Trang đánh giá chi tiết
4. Cho điểm từng WHAT / DEVELOP / HOW Goal (bắt buộc)
5. Nhập comment theo nhóm WHAT / HOW / DEVELOP (tùy chọn)
6. Nhập **Overall Rating** + **Overall Comment** (bắt buộc)
7. Submit → chuyển L2 hoặc HOD

### Flow 4: HRBP Upload HOD Rating (YER)
1. Vào **Theo dõi đánh giá** → Chọn vai trò HRBP
2. Chọn chu kỳ YER → Xem bảng tổng hợp tiến độ
3. Export template CSV (có danh sách NV đủ điều kiện)
4. Điền `hod_rating` + `note` → Upload CSV
5. Preview, xác nhận import
6. HRBP hoặc L&OD kích hoạt `publish = Yes` sau khi CEO Approved

### Flow 5: L&OD Cấu hình Chu kỳ
1. Vào **Cấu hình chu kỳ** → Tạo mới
2. Điền thông tin cơ bản: tên, năm, ngày bắt đầu/kết thúc
3. Cấu hình điều kiện tham gia (vị trí, level, hợp đồng, org unit)
4. Tạo 2 kỳ: MYR và YER với đầy đủ deadlines
5. Cấu hình thông báo tự động
6. Kích hoạt chu kỳ → trạng thái Active

---

## 11. Các Điều kiện và Ràng buộc (Business Rules)

| # | Rule |
|---|---|
| BR-01 | Nhân viên cần đảm bảo mục tiêu được **Approved trước khi kỳ đánh giá bắt đầu**; goal có thể tạo và cập nhật trong suốt cửa sổ goal-setting |
| BR-02 | Mỗi chu kỳ chỉ có tối đa **1 kỳ MYR** và **1 kỳ YER** |
| BR-03 | Để tham gia MYR/YER: phải có ≥ N WHAT Goals + ≥ N DEVELOP Goals đã Approved (N do L&OD cấu hình per kỳ) |
| BR-04 | Đánh giá chỉ khả dụng trong cửa sổ `evalFrom` – `evalTo` của kỳ |
| BR-05 | Chuỗi điểm theo thứ tự: NV → L1 → L2 → HOD → CEO. Cấp sau không thể nhập trước khi cấp trước hoàn thành |
| BR-06 | Nếu không có L2, hệ thống tự bỏ qua bước L2 |
| BR-07 | **MYR:** Final = HOD Done. **YER:** Final = CEO Approved (bước riêng sau HOD) |
| BR-08 | Kết quả YER chỉ được NV nhìn thấy khi L&OD bật `publish = Yes` sau CEO Approved |
| BR-09 | Nhân viên onboard **sau** `onboarding_deadline` không tham gia chu kỳ đó (không có chu kỳ rút gọn) |
| BR-10 | HOW Goals là cố định do công ty định nghĩa, NV không tạo/xóa |
| BR-11 | Overall Rating của NV chỉ mở khoá khi tất cả goals (WHAT + DEVELOP + HOW) đã được chấm điểm |
| BR-12 | **L1 bắt buộc** cho điểm từng goal, Overall Rating và Overall Comment. Comment riêng lẻ theo goal hoặc theo nhóm là tùy chọn |
| BR-13 | **Không có công thức tính điểm**. Final Rating là lựa chọn dựa trên xem xét toàn diện performance |
| BR-14 | Goals không có trọng số (weight) |
| BR-15 | MYR và YER đều có điều kiện tham gia độc lập, do L&OD cấu hình riêng |
| BR-16 | Mỗi nhân viên chỉ tham gia **một chu kỳ mỗi năm** |
| BR-17 | Khi nhân viên chuyển team, hệ thống tự cập nhật L1 mới từ HR masterlist (sync realtime) |
| BR-18 | HRBP có quyền đổi PIC ở bất kỳ bước đánh giá nào |

---

## 12. Tích hợp Hệ thống

| Hệ thống | Mục đích | Phương thức |
|---|---|---|
| **HR Masterlist** | Danh sách nhân viên, thông tin hợp đồng, org chart, L1 manager | Realtime sync |
| **Thông báo (Email / In-app)** | Gửi notification theo sự kiện | Event-driven |

---

## 13. Thông báo (Notifications)
*(Cấu hình bởi L&OD)*

| Sự kiện | Người nhận | Kênh |
|---|---|---|
| Mục tiêu được gửi chờ duyệt | L1 Manager | Email + In-app |
| Mục tiêu được duyệt / từ chối / yêu cầu cập nhật | Employee | Email + In-app |
| Kỳ đánh giá mở | Tất cả NV đủ điều kiện | Email |
| Nhắc nhở deadline (NV, L1, L2, HOD) | Theo cấp | Email |
| Cấp dưới submit xong | Cấp trên | In-app |
| CEO Approved – công bố kết quả | Tất cả NV | Email |

---

## 14. Non-Functional Requirements

- **Performance:** Danh sách mục tiêu và bảng điểm load < 2 giây với 500+ NV
- **Access Control:** NV chỉ xem mục tiêu và điểm của bản thân; Manager chỉ xem team mình; HRBP xem toàn công ty
- **Audit Log:** Tất cả thay đổi trạng thái goal và điểm đánh giá có history (timestamp + actor)
- **Export:** Tất cả bảng dữ liệu export được CSV/Excel
- **Integration:** Sync realtime với HR masterlist

---

*Tài liệu này là bản v1.1 – đã tích hợp input từ Product Owner lần 1. Vui lòng review và xác nhận trước khi chuyển sang thiết kế UI/UX.*
