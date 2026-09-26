# PMS – Screen Spec: Goal Setting
**Phạm vi:** E-01 · E-02 · E-04/05/06 · M-01 · M-02  
**Version:** 2.0 | **Ngày:** 07/06/2026 (cập nhật session 2)  
**Dành cho:** Dev team – hiểu layout, logic, states để build/sửa UI

---

## Conventions chung

- **Design system:** shadcn/zinc — zinc neutral scale làm base, MoMo pink `#A50064` là accent duy nhất
- **Font:** Public Sans, base 14px, line-height 1.5
- **Layout:** Desktop-first, sidebar cố định 232px, content area fluid
- **Spacing unit:** 4px base (8/12/16/20/24px)
- **Border radius:** Container/Dialog = 8px, Input/Button = 6px, Badge = 4px
- **Shadow:** Dialog/Dropdown only = `0 1px 3px rgba(0,0,0,.06)`. List items = không shadow.
- **Focus:** `outline: 2px solid rgba(165,0,100,.2); outline-offset: 1px`

### Badge (shadcn bordered style — dùng xuyên suốt)

Badge không dùng solid fill. Luôn dùng: light background + 1px colored border + colored text.

| Status | Label | Text / Bg / Border |
|---|---|---|
| `draft` | Nháp | `#71717A` / `#F4F4F5` / `#E4E4E7` |
| `pending` | Chờ duyệt | `#D97706` / `#FFFBEB` / `#FDE68A` |
| `approved` | Đã duyệt | `#16A34A` / `#F0FDF4` / `#BBF7D0` |
| `rejected` | Từ chối | `#DC2626` / `#FEF2F2` / `#FECACA` |
| `update` | Cần cập nhật | `#7C3AED` / `#F5F3FF` / `#DDD6FE` |

Badge style: height 20px, padding 1px 7px, border-radius 4px, 1px solid border, font 11px weight 500.

### Priority badge

| Priority | Label | Text / Bg / Border |
|---|---|---|
| `high` | Cao | `#DC2626` / `#FEF2F2` / `#FECACA` |
| `mid` | Trung bình | `#D97706` / `#FFFBEB` / `#FDE68A` |
| `low` | Thấp | `#A1A1AA` / `#FAFAFA` / `#E4E4E7` |

### Loại mục tiêu

| Type | Label | Text / Bg / Border | Dot |
|---|---|---|---|
| `what` | Mục tiêu công việc | `#2563EB` / `#EFF6FF` / `#BFDBFE` | `#2563EB` |
| `develop` | Mục tiêu phát triển | `#7C3AED` / `#F5F3FF` / `#DDD6FE` | `#7C3AED` |
| `how` | Giá trị hành vi | `#0F766E` / `#F0FDFA` / `#99F6E4` | `#0F766E` |

### Button variants

| Variant | Dùng khi | Style |
|---|---|---|
| `default` | Primary CTA (Gửi, Duyệt) | bg `#A50064`, text white, hover `#8B0055` |
| `outline` | Secondary action | bg white, border `#E4E4E7`, text zinc-700 |
| `ghost` | Tertiary / inline | bg transparent, hover bg zinc-100 |
| `destructive` | Xoá, Từ chối | border red, text `#DC2626`, hover bg `#FEF2F2` |
| `secondary` | Neutral | bg `#F4F4F5`, border `#E4E4E7`, text zinc-700 |

---

## E-01 – Danh sách Mục tiêu Cá nhân

**Role:** Employee  
**Trigger:** Click "Mục tiêu và đánh giá cá nhân" trên sidebar  
**Mục đích:** NV xem toàn bộ goals của mình trong một chu kỳ, biết ngay trạng thái từng goal và hành động cần làm tiếp theo.

---

### Layout tổng thể

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: "Mục tiêu cá nhân"                          [icons]     │
├─────────────────────────────────────────────────────────────────┤
│ Breadcrumb: Trang chủ / Mục tiêu cá nhân                       │
│ Title: "Mục tiêu cá nhân"       [Employee chip: NT · EMP001]   │
├─────────────────────────────────────────────────────────────────┤
│ ROW – CYCLE PICKER                                              │
│  [cal] Chu kỳ [2026 Annual Review ▾]  01/01–31/12/2026         │
├─────────────────────────────────────────────────────────────────┤
│ TABS (underline style)                                          │
│  [Mục tiêu · 6]  [Mid-Year Review — disabled]  [End-Year — disabled] │
├─────────────────────────────────────────────────────────────────┤
│ TOOLBAR                                                         │
│  2 đã duyệt · 2 chờ duyệt · 1 nháp · 1 cần cập nhật  [Status ▾] [Import CSV] │
├─────────────────────────────────────────────────────────────────┤
│ 3-COLUMN GRID                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ ● WHAT    [4]│  │ ● DEVELOP [2]│  │ ● HOW     [5]│         │
│  │ Mục tiêu CV  │  │ Mục tiêu PT  │  │ Giá trị hành vi│       │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ [goal row]   │  │ [goal row]   │  │ [value row]  │         │
│  │ [goal row]   │  │ [goal row]   │  │ [value row]  │         │
│  │ [goal row]   │  ├──────────────┤  │ [value row]  │         │
│  │ [goal row]   │  │ + Thêm       │  │ [value row]  │         │
│  ├──────────────┤  └──────────────┘  │ [value row]  │         │
│  │ + Thêm       │                    ├──────────────┤         │
│  └──────────────┘                    │ 5 giá trị cố định│     │
│                                      └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Chi tiết từng vùng

#### Topbar
- Height 52px, bg white, border-bottom zinc-200
- Title: font 13.5px, weight 500, color zinc-600

#### Page Header
- Breadcrumb: 12px, zinc-400
- Title: 18px, weight 700, letter-spacing -0.4px, zinc-950
- Employee chip: pill shape, border zinc-200, avatar + name + meta

#### Cycle Picker
- Inline row (không phải full-width bar): icon + label + select dropdown + period text
- Dropdown default = chu kỳ Active hiện tại
- Nếu chưa có chu kỳ Active: hiển thị empty state "Chưa có chu kỳ đánh giá nào đang hoạt động"

#### Tab Bar (underline style)
- Border-bottom 2px dưới entire tab bar
- Active tab: color `#A50064`, border-bottom-color `#A50064`, weight 600
- Inactive tab: zinc-400, weight 400
- Disabled (MYR/YER chưa mở): zinc-300, cursor not-allowed
- Tab count badge: 11px, border-radius 4px; active = bg `rgba(165,0,100,.07)` + text `#A50064`

#### Toolbar / Summary
- Format: `[N] đã duyệt · [N] chờ duyệt · [N] nháp · [N] cần cập nhật`
- Mỗi số là link → click filter list theo status đó
- Status filter dropdown + Import CSV button (outline variant) ở phải

#### 3-Column Goal Grid

**Mỗi cột là một container:**
- bg white, border `1px solid #E4E4E7`, border-radius 8px, shadow-sm (`0 1px 2px rgba(0,0,0,.04)`)
- Column header: padding 10px 14px, border-bottom `1px solid #F4F4F5`
  - Type dot (7px, màu theo type) + type label (11px uppercase bold, màu theo type) + name (12.5px zinc-500) + count badge + [+] button
- Column footer: `+ Thêm mục tiêu [type]` button (ghost variant)
- HOW column: không có [+] button, có note ở footer ("5 giá trị cố định...")

**WHAT column:** blue accent `#2563EB`  
**DEVELOP column:** violet accent `#7C3AED`  
**HOW column:** teal accent `#0F766E`, read-only (không tạo/sửa/xoá)

---

### Goal Item (flat row — không phải card)

```
┌───────────────────────────────────────────────────────────────┐
│  [Status badge]  [Priority badge]                             │
│  Title text, có thể dài tới 2 dòng rồi truncate              │
│  01/01 → 31/12/2026                                           │
│  — hover —————————————————————————————————————————————————    │
│  [Action 1]  |  [Action 2]  |  [Action 3]                    │
└───────────────────────────────────────────────────────────────┘
```

| Phần | Mô tả |
|---|---|
| Background | Luôn white; hover = zinc-50. Không shadow. |
| Separator | `1px solid #F4F4F5` giữa các items |
| Status badge | Bordered badge (xem bảng trên) |
| Priority badge | Bordered badge nhỏ hơn (height 16px) |
| Title | 13.5px, weight 500, zinc-900, truncate 2 dòng |
| Date | 11.5px, zinc-400 |
| Actions | **Ẩn mặc định**, chỉ hiện khi hover row. Ghost buttons nhỏ. |
| Checkbox | Xuất hiện khi hover (bulk mode). Ẩn khi không hover (trừ bulk-mode active). |

#### Actions theo trạng thái (hiện khi hover)

| Trạng thái | Actions |
|---|---|
| `draft` | [Gửi quản lý] (accent) · [Sửa] · [Xoá] (destructive) |
| `pending` | [Xem] · [Thu hồi] |
| `approved` | [Xem chi tiết] |
| `rejected` | [Xem lý do] · [Sửa & gửi lại] (accent) |
| `update` | [Sửa & gửi lại] (accent) · [Xem yêu cầu] |

#### HOW Value Items

- Mỗi row: dot (teal) + tên giá trị + chevron phải
- Hover: bg `#F0FDFA` + chevron đổi sang teal
- Click: mở dialog xem tiêu chí đánh giá (read-only)
- Không có actions tạo/sửa/xoá

---

### Bulk Select

- Checkbox 13px xuất hiện khi hover item (CSS hover) hoặc khi bulk mode active
- Khi chọn ≥ 1: **Bulk action bar** xuất hiện sticky bên dưới toolbar
  - Style: bg white, border `1px solid #A50064`, border-radius 6px, shadow-md
  - Nội dung: `[N] đã chọn  [Bỏ chọn]  [Chọn tất cả Nháp]  ||  [Xoá]  [Gửi quản lý]`
  - "Gửi quản lý" chỉ active khi tất cả đã chọn là `draft`

---

### States đặc biệt

| State | Hiển thị |
|---|---|
| Chưa chọn chu kỳ | Cả 3 cột empty state |
| Cột không có goal | Empty state trong cột đó: icon + text + [+ Thêm] |
| Filter không có kết quả | Items trong cột bị ẩn, hiện empty state inline |

---

## E-02 – Tạo Mục tiêu Mới

**Role:** Employee  
**Trigger:** Click "Tạo mục tiêu" trên E-01  
**Loại:** Modal (desktop, max-width 560px)  
**Mục đích:** NV nhập đủ thông tin để tạo goal mới và chọn lưu nháp hoặc gửi ngay cho quản lý.

---

### Layout Modal

```
┌─────────────────────────────────────────┐
│ [icon] Tạo mục tiêu mới          [✕]   │
├─────────────────────────────────────────┤
│                                         │
│  Loại mục tiêu *                        │
│  ┌─────────────────────────────────────┐│
│  │ Mục tiêu CV  │  Mục tiêu PT        ││
│  └─────────────────────────────────────┘│
│  (segmented control: 2 options, bg      │
│   zinc-100, selected = bg white +       │
│   border + type color text)             │
│                                         │
│  Mức độ ưu tiên *      Thời gian *      │
│  [Dropdown ▾]          [Từ ngày] [Đến]  │
│                                         │
│  Tiêu đề mục tiêu *                     │
│  [Textarea – 2 dòng]        0/1000      │
│                                         │
│  Kết quả cần đạt *                      │
│  [Textarea – 4 dòng]        0/4000      │
│  Hint: Mô tả KPI, KR, định lượng cụ thể│
│                                         │
├─────────────────────────────────────────┤
│ [Lưu nháp]              [Gửi quản lý →]│
└─────────────────────────────────────────┘
```

---

### Chi tiết từng trường

| Trường | Bắt buộc | Input type | Validation |
|---|---|---|---|
| Loại mục tiêu | ✓ | Segmented control 2 options | Phải chọn 1 |
| Mức độ ưu tiên | ✓ | Dropdown (Thấp/Trung bình/Cao) | Phải chọn |
| Từ ngày | ✓ | Date picker | Phải nhỏ hơn Đến ngày |
| Đến ngày | ✓ | Date picker | Phải lớn hơn Từ ngày |
| Tiêu đề | ✓ | Textarea, min 1 dòng | Không trống, max 1000 ký tự, counter hiển thị |
| Kết quả cần đạt | ✓ | Textarea, min 4 dòng, resize được | Không trống, max 4000 ký tự, counter hiển thị |

#### Validation
- Validate khi click "Gửi quản lý" hoặc "Lưu nháp"
- Field lỗi: viền đỏ + message nhỏ bên dưới
- Ngày không hợp lệ: inline error giữa 2 date fields
- Không scroll modal khi validate — highlight lỗi đầu tiên

#### Footer buttons
| Nút | Hành động | Style |
|---|---|---|
| Lưu nháp | Tạo goal status `draft`, đóng modal, toast "Đã lưu nháp" | outline variant |
| Gửi quản lý | Tạo goal status `pending`, đóng modal, toast "Đã gửi cho quản lý" | default variant |
| ✕ (close) | Đóng modal, confirm nếu đã có dữ liệu nhập | Icon button |

#### Confirm khi đóng giữa chừng
Nếu user đã nhập dữ liệu vào bất kỳ field nào và bấm ✕ hoặc click ngoài modal:
> *"Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng không?"*  
> [Huỷ] [Đóng và mất dữ liệu]

---

## E-03 – Chỉnh sửa Mục tiêu

**Reuse hoàn toàn form E-02**, chỉ khác:
- Modal title: **"Chỉnh sửa mục tiêu"**
- Load sẵn data của goal được chọn
- Chỉ mở được khi goal ở trạng thái `draft` hoặc `update`
- Nếu goal đang `update`: hiển thị banner ở trên form với style `bg #FFFBEB, border-left 2px solid #FDE68A, text zinc-700`:
  > ⚠️ *Quản lý yêu cầu cập nhật: "[Ghi chú từ manager]"*

---

## E-04 / E-05 / E-06 – Chi tiết Mục tiêu

**Role:** Employee  
**Trigger:** Click tên goal hoặc nút "Xem" trên Goal Item  
**Loại:** Modal, max-width 640px  
**Mục đích:** NV xem đầy đủ thông tin goal, lịch sử, và trao đổi với manager.

---

### Layout Modal

```
┌──────────────────────────────────────────────────┐
│ [badge status]  [badge type]  [badge priority] [✕]│
│ Tối ưu API response time xuống dưới 200ms        │
│                                                  │
│ [Thông tin]  [Bình luận (2)]  [Lịch sử]          │
├──────────────────────────────────────────────────┤
│ TAB CONTENT (cuộn được)                          │
│ ...                                              │
├──────────────────────────────────────────────────┤
│ FOOTER – actions tùy trạng thái                  │
└──────────────────────────────────────────────────┘
```

---

### Tab 0 – Thông tin

```
┌─────────────────────────────────┐
│ LOẠI MỤC TIÊU   │ ƯU TIÊN       │
│ Mục tiêu CV      │ Trung bình    │
├─────────────────────────────────┤
│ THỜI GIAN                       │
│ 01/01/2026 → 31/12/2026         │
├─────────────────────────────────┤
│ TRẠNG THÁI      │ GỬI LÚC       │
│ [Chờ duyệt]     │ 15/01/2026    │
├─────────────────────────────────┤
│ TIÊU ĐỀ                         │
│ Tối ưu API response time...     │
├─────────────────────────────────┤
│ KẾT QUẢ CẦN ĐẠT                │
│ [border-left: 2px solid #A50064,│
│  bg #FAFAFA]                    │
│ Response time < 200ms với 95%   │
│ percentile trong 3 tháng liên   │
│ tục. Đo bằng Grafana dashboard. │
├─────────────────────────────────┤
│ GHI CHÚ TỪ QUẢN LÝ (nếu có)    │
│ [bg #FFFBEB, border-left 2px    │
│  solid #FDE68A]                 │
│ "Cần thêm metric cụ thể..."     │
└─────────────────────────────────┘
```

**Ghi chú từ quản lý:**
- Chỉ hiển thị khi goal ở trạng thái `rejected` hoặc `update`
- Style: `bg #FFFBEB, border-left 2px solid #FDE68A, text zinc-700`
- Label: "Ghi chú từ quản lý"

**Rating của L1 per goal (nếu đang trong/sau kỳ MYR/YER):**
- Chỉ hiển thị khi L1 đã submit đánh giá
- Hiển thị: điểm rating (★★★★☆) + comment của L1 cho goal này
- **Không hiển thị Overall Rating của L1**

---

### Tab 1 – Bình luận

```
┌──────────────────────────────────────────┐
│ [Avatar NL] Le Thi Thanh                 │
│ ┌──────────────────────────────────────┐ │
│ │ Bạn cần làm rõ hơn cách đo lường... │ │
│ └──────────────────────────────────────┘ │
│ 14/01/2026 16:30                         │
│                                          │
│ [Avatar NV]                              │
│             ┌────────────────────────┐   │
│             │ Dạ em đã cập nhật ...  │   │
│             └────────────────────────┘   │
│             15/01/2026 09:00             │
│                                          │
├──────────────────────────────────────────┤
│ [Avatar] [Textarea: Nhập bình luận...]   │
│                              [Gửi →]    │
└──────────────────────────────────────────┘
```

- Comment của manager: bubble trái, `bg #F4F4F5, border 1px solid #E4E4E7`
- Comment của NV (self): bubble phải, `bg rgba(165,0,100,.07), border 1px solid rgba(165,0,100,.2)`
- Textarea min 2 dòng, Enter = xuống dòng, Ctrl+Enter = gửi
- Không cho phép xóa comment đã gửi

---

### Tab 2 – Lịch sử

```
│ ● Đã gửi cho quản lý                    │
│   Nguyen Van Tu · 15/01/2026 09:00      │
│   |                                     │
│ ● Quản lý yêu cầu cập nhật             │
│   Le Thi Thanh · 16/01/2026 14:30      │
│   "Cần thêm metric cụ thể hơn"         │
│   |                                     │
│ ● Đã chỉnh sửa và gửi lại             │
│   Nguyen Van Tu · 17/01/2026 10:00     │
│   |                                     │
│ ● Đã duyệt                             │
│   Le Thi Thanh · 18/01/2026 09:30      │
```

- Timeline dọc, dot màu theo event type: ok = `#16A34A`, warn = `#D97706`, info = `#2563EB`
- Event có note: hiện text block xám nhạt bên dưới event
- Sort: mới nhất ở dưới (chronological)

---

### Footer – Actions theo trạng thái

| Trạng thái | Buttons trong footer |
|---|---|
| `draft` | [Xoá] (destructive variant, trái) · · · [Sửa] (outline variant) [Gửi quản lý] (default variant) |
| `pending` | [Thu hồi về nháp] (outline variant) |
| `approved` | *(không có action)* |
| `rejected` | [Sửa & Gửi lại] (default variant) |
| `update` | [Sửa & Gửi lại] (default variant) |

---

## M-01 – Danh sách Mục tiêu Team

**Role:** L1 Manager (và L2/HOD nếu cùng người)  
**Trigger:** Click "Mục tiêu và đánh giá đội nhóm" trên sidebar  
**Mục đích:** Manager xem và xử lý goals của toàn team — biết ngay ai cần duyệt, ai chờ xử lý.

---

### Layout tổng thể

```
┌─────────────────────────────────────────────────────────────────┐
│ NAVBAR: "Mục tiêu và đánh giá đội nhóm"             [icons]    │
├─────────────────────────────────────────────────────────────────┤
│ PAGE HEADER                                                      │
│  Title: "Mục tiêu và đánh giá đội nhóm"                        │
├─────────────────────────────────────────────────────────────────┤
│ ROLE SWITCHER                                                    │
│  [Quản lý trực tiếp (L1) ●]  [Quản lý gián tiếp (L2)]  [HOD]  │
│  (tab dạng pill, chỉ hiển thị roles mà user đang đảm nhiệm)    │
├─────────────────────────────────────────────────────────────────┤
│ CYCLE PICKER                                                     │
│  [icon lịch] Chu kỳ: [Dropdown: 2026 Annual Review ▾]          │
├─────────────────────────────────────────────────────────────────┤
│ ALERT (nếu có)                                                  │
│  ⚠ Có 3 mục tiêu đang chờ phê duyệt                            │
├─────────────────────────────────────────────────────────────────┤
│ FILTER ROW                                                       │
│  [Domain/email NV]  [Tên mục tiêu]  [Trạng thái ▾]            │
│  [Khối ▾]  [Phòng ban ▾]  [Đội nhóm ▾]  [Áp dụng] [Đặt lại]  │
├─────────────────────────────────────────────────────────────────┤
│ BULK ACTION BAR (ẩn mặc định, hiện khi chọn ≥1 goal)           │
│  [checkbox] N goals đã chọn  [Bỏ chọn]  ||  [Duyệt tất cả]    │
├─────────────────────────────────────────────────────────────────┤
│ EMPLOYEE LANES                                                   │
│  [Lane: Nguyen Van Tu ▾]                                        │
│  [Lane: Tran Thi B ▾]                                           │
│  ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Role Switcher
- Chỉ render tab của roles mà user thực sự đảm nhiệm (lấy từ hệ thống HR)
- Nếu chỉ có 1 role: không hiển thị Role Switcher (không cần chọn)
- Khi chuyển role: reload danh sách NV theo role đó, giữ nguyên chu kỳ đang chọn
- Label rõ vai trò: **"Quản lý trực tiếp (L1)"**, **"Quản lý gián tiếp (L2)"**, **"HOD"**

---

### Alert bar
- Hiển thị khi có goals `pending` chờ duyệt trong role đang active
- Click vào alert → filter list về "Chờ duyệt"
- Style: `bg #FFFBEB, border 1px solid #FDE68A, text #D97706`, icon ⚠

---

### Employee Lane

```
┌─────────────────────────────────────────────────────────────────┐
│ ▶  [Avatar NV]  Nguyen Van Tu                                   │
│    Engineering · Backend Team                                   │
│    [3 Đã duyệt] [1 Chờ duyệt] [1 Nháp]         [Mở rộng ▾]   │
├─────────────────────────────────────────────────────────────────┤
│ (expanded)                                                       │
│                                                                  │
│  WHAT – MỤC TIÊU CÔNG VIỆC                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ● [Chờ duyệt] [Cao]  Hoàn thiện hệ thống thanh toán... │   │
│  │  01/01 → 31/12/2026      [Duyệt] [Từ chối] [Sửa yêu cầu]│  │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ● [Đã duyệt] [Trung bình]  Tối ưu API response time... │   │
│  │  01/01 → 31/12/2026                             [Xem]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  DEVELOP – MỤC TIÊU PHÁT TRIỂN                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ● [Nháp]  Hoàn thành khoá AWS Solutions Architect       │   │
│  │  01/01 → 31/12/2026                             [Xem]   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Lane header:**
- Avatar (initials) + Tên NV + Phòng ban/Team
- Summary badges: số goals theo status `approved` / `pending` / `draft`
- Chevron icon mở/đóng lane
- Click vào header = toggle expand/collapse

**Goal row trong lane:**
- Type dot (7px) trước title, màu theo type (`#2563EB` cho WHAT, `#7C3AED` cho DEVELOP)
- Badge status + badge priority
- Tên goal (truncate nếu quá dài)
- Ngày bắt đầu → kết thúc
- Action buttons theo trạng thái (xem bảng dưới)

**Action buttons trong lane:**

| Trạng thái goal | Actions |
|---|---|
| `pending` | [Duyệt] (default variant nhỏ) · [Từ chối] (destructive variant nhỏ) · [Yêu cầu cập nhật] (outline variant nhỏ) |
| `approved` | [Xem] |
| `draft` | [Xem] |
| `rejected` | [Xem] |
| `update` | [Xem] |

**Bulk select trong lane:**
- Checkbox trên từng goal row (xuất hiện khi hover hoặc khi bulk mode active)
- Checkbox "Chọn tất cả" trong header của lane khi expand

---

### Bulk Action Bar
- Sticky ở top content area, xuất hiện khi chọn ≥ 1 goal
- Style: bg white, border `1px solid #A50064`, box-shadow shadow-md
- Nội dung: `[N goals đã chọn]  [Bỏ chọn]  [Chọn tất cả Đang chờ duyệt]  ||  [Duyệt tất cả] [Từ chối tất cả]`
- Nút "Duyệt tất cả" chỉ active khi tất cả goals chọn đều là `pending`

---

### States đặc biệt

| State | Hiển thị |
|---|---|
| Chưa chọn chu kỳ | Empty state toàn trang |
| Không có NV nào trong team | Empty state: "Không có nhân viên nào trong team của bạn" |
| Tất cả goals đã duyệt | Alert xanh lá: "Tất cả mục tiêu của team đã được xử lý" |

---

## M-02 – Duyệt Mục tiêu (Manager)

**Role:** L1 Manager  
**Trigger:** Click tên goal hoặc nút "Xem" / "Duyệt" trên M-01  
**Loại:** Modal, max-width 640px  
**Mục đích:** Manager xem đầy đủ nội dung goal và thực hiện quyết định phê duyệt.

---

### Layout Modal

Tương tự E-04/05/06 nhưng:
- Header bổ sung: tên nhân viên + phòng ban nhỏ bên dưới tiêu đề goal
- Footer hoàn toàn khác (xem phần Actions)

```
┌──────────────────────────────────────────────────┐
│ [badge status]  [badge type]  [badge priority] [✕]│
│ Tối ưu API response time xuống dưới 200ms        │
│ Nguyen Van Tu · Backend Team                     │
│                                                  │
│ [Thông tin]  [Bình luận (2)]  [Lịch sử]          │
├──────────────────────────────────────────────────┤
│ (Tab content – giống E-04/05/06)                 │
├──────────────────────────────────────────────────┤
│ FOOTER                                           │
│ [Từ chối] [Yêu cầu CN]      [Duyệt ✓]          │
└──────────────────────────────────────────────────┘
```

---

### Tab 0 – Thông tin *(giống E-04, thêm phần ghi chú manager)*

Thêm phần **"Ghi chú của bạn"** ở cuối tab Thông tin (chỉ hiển thị với Manager):
- Textarea nhỏ, placeholder: "Ghi chú nội bộ (chỉ quản lý thấy)..."
- Tự lưu khi blur (auto-save)

---

### Footer – Actions

#### Khi goal là `pending` (chờ duyệt):

```
[Từ chối]  [Yêu cầu cập nhật]                [Duyệt ✓]
```

**Nút "Duyệt":**
- default variant với bg `#16A34A`
- Click → confirm dialog nhỏ: *"Duyệt mục tiêu này?"* [Huỷ] [Xác nhận]
- Sau khi duyệt: toast "Đã duyệt", badge goal chuyển `approved`, đóng modal

**Nút "Từ chối":**
- destructive variant
- Click → mở inline form trong footer:
  ```
  Lý do từ chối *
  [Textarea]
  [Huỷ]  [Xác nhận từ chối]
  ```
- Lý do bắt buộc nhập trước khi xác nhận

**Nút "Yêu cầu cập nhật":**
- outline variant
- Click → mở inline form trong footer:
  ```
  Nội dung yêu cầu *
  [Textarea, placeholder: "Mô tả cần chỉnh sửa gì..."]
  [Huỷ]  [Gửi yêu cầu]
  ```
- Sau khi gửi: goal về `update`, NV nhận notification

#### Khi goal đã là `approved`:
- Footer chỉ có nút [Yêu cầu cập nhật] (outline variant, không có Duyệt/Từ chối)
- Tooltip: "Goal đã được duyệt. Bạn vẫn có thể yêu cầu nhân viên cập nhật."

#### Khi goal là `rejected` / `update` / `draft`:
- Footer chỉ hiển thị [Đóng]

---

## Data mẫu (dùng cho demo)

### Nhân viên: Nguyen Van Tu
- Mã NV: EMP001
- Phòng ban: Engineering · Backend Team
- L1 Manager: Le Thi Thanh
- Chu kỳ: 2026 Annual Review (01/01/2026 – 31/12/2026)
- Cửa sổ tạo goal: 01/01/2026 – 31/03/2026

### Goals mẫu

| # | Tiêu đề | Loại | Priority | Status |
|---|---|---|---|---|
| 1 | Hoàn thiện hệ thống thanh toán real-time với độ trễ < 100ms | WHAT | High | `approved` |
| 2 | Tối ưu API response time xuống dưới 200ms với 95th percentile | WHAT | Mid | `pending` |
| 3 | Triển khai monitoring và alerting cho toàn bộ microservices | WHAT | Mid | `approved` |
| 4 | Refactor authentication module sang stateless JWT | WHAT | Low | `update` |
| 5 | Hoàn thành khoá AWS Solutions Architect và đạt chứng chỉ | DEVELOP | Mid | `draft` |
| 6 | Cải thiện kỹ năng system design qua self-study và practice | DEVELOP | Low | `pending` |

**HOW (5 giá trị cố định):** Thấu hiểu khách hàng · Đổi mới sáng tạo · Tinh thần đồng đội · Thực thi xuất sắc · Tinh thần học hỏi không ngừng

### Team của Le Thi Thanh (L1)
| Nhân viên | Goals | Trạng thái nổi bật |
|---|---|---|
| Nguyen Van Tu | 6 goals | 1 pending chờ duyệt |
| Pham Thi Lan | 2 goals | 2 approved |
| Hoang Minh Duc | 4 goals | 1 pending, 1 rejected |

---

*File này là Screen Spec cho dev demo. Sau khi có HTML demo, sẽ tiếp tục với Screen Spec cho MYR/YER.*
