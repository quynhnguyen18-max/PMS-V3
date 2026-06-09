# PMS Prototype — Design System

> **Canonical source:** `E-01/index.html` — màn hình Mục tiêu & Đánh giá cá nhân.
> Mọi màn hình tiếp theo **BẮT BUỘC** follow file này. Không tự sáng tác token, component, hay pattern mới nếu chưa có trong Design.md.

---

## 1. Typography

### Font Family
```css
font-family: 'Public Sans', sans-serif;
```
- Import từ Google Fonts: `Public Sans` weights `300 400 500 600 700`
- Áp cho toàn bộ `body`, `button`, `input`, `select`, `textarea`
- `-webkit-font-smoothing: antialiased` trên `body`

### Base
```css
html { font-size: 14px }
body { font-size: 14px; line-height: 1.5; color: var(--z700) }
```

### Font Size Scale

| Token | Size | Dùng ở đâu |
|---|---|---|
| — | `11px` | Badge, tab count, `sec-lbl`, `proc-lbl`, `sb-grp`, group header table, `ev-cmt-lbl`, breadcrumb `bc-sep` |
| — | `11.5px` | `gi-date`, `ci-time`, `ferr`, `fhint`, `ev-meta` |
| — | `12px` | `cycle-period`, `ci-name`, `breadcrumb`, `conf-body`, `tl-note`, `rte-fmt`, `col-add-btn` |
| — | `12.5px` | `proc-txt`, `filter-box select`, `btn-sm`, `.flbl`, `.gt-menu-list button`, `ev-locked-msg`, `ev-revise-box`, `bulk-warn` |
| — | `13px` | Body text default, `sb-item`, `tab-btn`, `.btn`, `.dlg-tab`, `guide-info p`, `.cin`, `.ev-cmt`, `cycle-sel`, `.cycle-lbl`, `.summary-text`, `.toolbar`, `.sb-uname`, `.conf-body` |
| — | `13.5px` | `gi-title`, `how-name`, `.dv`, `.detail-val`, `.result-blk`, `.rte-body`, `.fc`, `sb-name`, `topbar-title` |
| — | `14px` | `html` base, `rte-body h3` |
| — | `14.5px` | `conf-title` |
| — | `15px` | `dlg-title` |
| — | `18px` | `page-title` |
| — | `22px` | `ev-score-num` (điểm đánh giá lớn) |

### Font Weight
| Weight | Dùng ở đâu |
|---|---|
| `400` | Body, `.dv`, `.detail-val`, `.ec-dom` |
| `500` | `.btn`, `.tab-btn`, `.gi-title`, `.how-name`, `.gt-name`, `.flbl`, `.ci-name`, `.tl-ev` |
| `600` | `.dlg-title`, `.conf-title`, `.btn-cta-outline`, `.sec-lbl`, `.ev-card-hd`, `.sb-logo span` |
| `700` | `.page-title`, `.tab-btn.on`, `.col-type-lbl`, `.dlg-tab.on`, `.ev-score-num` |
| `800` | `.sb-logo span` |

---

## 2. Color Tokens

Tất cả đều là CSS custom properties trong `:root`. **Không hardcode hex** trong component.

### Zinc (Neutral) Scale
```css
--z0:   #ffffff   /* trắng tuyệt đối — bg component, card, dialog */
--z50:  #fafafa   /* bg trang, bg hover nhẹ, bg read-only field */
--z100: #f4f4f5   /* bg hover, bg badge muted, bg tab count */
--z200: #e4e4e7   /* border mặc định, divider */
--z300: #d4d4d8   /* border nhấn mạnh, tl::before, scrollbar thumb */
--z400: #a1a1aa   /* icon mờ, placeholder-like text, tl-dot mặc định */
--z500: #71717a   /* label phụ, icon bình thường, tab inactive */
--z600: #52525b   /* text phụ, sb-item text, toolbar text */
--z700: #3f3f46   /* body text mặc định, form label, detail value */
--z800: #27272a   /* text đọc, ec-line, tl-ev hover */
--z900: #18181b   /* text heading, page title, gi-title, gt-name */
--z950: #09090b   /* dự phòng, hiếm dùng */
```

### Brand (MoMo Pink)
```css
--brand:       #A50064   /* brand chính — button fill, active tab underline, badge border, icon accent */
--brand-h:     #8B0055   /* hover của brand button */
--brand-fg:    #ffffff   /* text trên brand background */
--brand-muted: rgba(165,0,100,.07)  /* bg nhẹ khi hover accent, bg selected sidebar item, table header */
--brand-ring:  rgba(165,0,100,.2)   /* focus outline, sticky bar border */
```

### Goal Type Colors
```css
--what:    #2563eb   --what-bg: #eff6ff   --what-bd: #bfdbfe   /* Kết quả công việc — xanh dương */
--dev:     #7c3aed   --dev-bg:  #f5f3ff   --dev-bd:  #ddd6fe   /* Phát triển năng lực — tím */
--how:     #0f766e   --how-bg:  #f0fdfa   --how-bd:  #99f6e4   /* Hành vi / How — xanh ngọc */
```

### Semantic Status Colors
```css
--ok:      #16a34a   --ok-bg:   #f0fdf4   --ok-bd:   #bbf7d0   /* Thành công / Đã duyệt */
--warn:    #d97706   --warn-bg: #fffbeb   --warn-bd: #fde68a   /* Cảnh báo / Cần cập nhật */
--err:     #dc2626   --err-bg:  #fef2f2   --err-bd:  #fecaca   /* Lỗi / Huỷ / Xoá */
--info:    #2563eb   --info-bg: #eff6ff   --info-bd: #bfdbfe   /* Thông tin / Chờ duyệt */
--upd:     #7c3aed   --upd-bg:  #f5f3ff   --upd-bd:  #ddd6fe   /* Cần cập nhật — tím */
```

---

## 3. Spacing, Shape & Motion

### Layout Dimensions
```css
--sw:  232px   /* sidebar width */
--nh:  52px    /* topbar/nav height */
```

### Border Radius
```css
--r:    8px   /* card, dialog, table wrapper, guide-box — lớn nhất */
--rsm:  6px   /* button, badge, input, overlay body, modal — vừa */
--rxs:  4px   /* badge, icon-button, toolbar chip — nhỏ nhất */
```

### Box Shadow
```css
--sh-sm: 0 1px 2px rgba(0,0,0,.04)
--sh:    0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)
--sh-md: 0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.03)
--sh-lg: 0 8px 30px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.04)
```
Dùng: `--sh` cho card/table, `--sh-md` cho bulk bar/dropdown, `--sh-lg` cho dialog/tooltip.

### Transition
```css
--t: all .12s ease   /* áp cho mọi interactive element */
```

### Scrollbar
```css
::-webkit-scrollbar       { width: 4px; height: 4px }
::-webkit-scrollbar-track { background: transparent }
::-webkit-scrollbar-thumb { background: var(--z300); border-radius: 4px }
```

---

## 4. Icon System

**Thư viện duy nhất:** [Boxicons](https://boxicons.com/) v2.1.4
```html
<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet"/>
```
Dùng class `bx bx-[name]` hoặc `bx bxs-[name]` (solid). **Không dùng Font Awesome, Heroicons, hay SVG inline** trừ khi không có icon tương đương trong Boxicons.

### Semantic Icon Map
| Hành động | Icon class | Ghi chú |
|---|---|---|
| Xem chi tiết | `bx bx-show` | — |
| Sửa / Chỉnh sửa | `bx bx-edit` | — |
| Gửi quản lý | `bx bx-send` | — |
| Thu hồi | `bx bx-undo` | — |
| Xoá | `bx bx-trash` | luôn `danger` |
| Đánh giá hoàn thành | `bx bx-task` | accent, checklist icon |
| Thêm mới | `bx bx-plus` | — |
| Lọc / Filter | `bx bx-filter-alt` | — |
| Cảnh báo | `bx bx-error-circle` | bulk-warn |
| Thông tin (ⓘ) | `bx bx-info-circle` | tip-ico, guide-box |
| Thành công | `bx bx-check-circle` | b-done badge |
| Mũi tên phải | `bx bx-right-arrow-alt` | button CTA |
| Mũi tên caret phải | `bx bx-chevron-right` | breadcrumb, how-arrow |
| Đồng hồ | `bx bx-time-five` | cycle / period |
| Thống kê | `bx bx-bar-chart-alt-2` | sidebar nav |

### Icon Sizes
- Trong button (`gi-act`, `gt-pri`): `font-size: 15–16px`
- Trong badge / chip: `font-size: 12–13px`
- Sidebar nav: `font-size: 15px`, `width: 16px`
- Topbar / ico-btn: `font-size: 15px`
- Guide-box info icon: `font-size: 18px`
- Empty state: `font-size: 32px`

---

## 5. Button System

### Base
```css
.btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: var(--rsm);
  font-size: 13px; font-weight: 500; font-family: inherit;
  transition: var(--t); border: 1px solid transparent;
  line-height: 1.4; white-space: nowrap; cursor: pointer;
}
```

### Variants
| Class | Background | Border | Text | Hover | Dùng khi |
|---|---|---|---|---|---|
| `.btn-default` | `var(--brand)` | `var(--brand)` | `#fff` | bg → `var(--brand-h)` | CTA chính (Gửi, Lưu, Xác nhận) |
| `.btn-secondary` | `var(--z100)` | `var(--z200)` | `var(--z700)` | bg → `var(--z200)` | Hành động phụ |
| `.btn-outline` | `var(--z0)` | `var(--z200)` | `var(--z700)` | bg → `var(--z50)`, border → `var(--z400)` | Hành động thứ cấp (Lưu nháp) |
| `.btn-cta-outline` | `var(--z0)` | `var(--brand)` | `var(--brand)`, `fw:600` | bg → `var(--brand-muted)` | CTA thứ nhất ngang brand (Thu hồi) |
| `.btn-ghost` | transparent | transparent | `var(--z600)` | bg → `var(--z100)`, text → `var(--z900)` | Huỷ bỏ, Đóng, Bỏ chọn |
| `.btn-destructive` | transparent | `var(--err-bd)` | `var(--err)` | bg → `var(--err-bg)` | Hành động huỷ/xoá không reversible |

### Sizes
```css
.btn-sm  { padding: 4px 10px;  font-size: 12.5px }  /* modal footer, toolbar */
.btn-xs  { padding: 2px 8px;   font-size: 11.5px }  /* bulk bar, inline small actions */
/* default = md: padding 6px 12px, 13px */
```

### Disabled State
```css
.btn-default:disabled { opacity: .45; cursor: not-allowed }
```
Các variant khác khi disabled: thêm `opacity:.45;cursor:not-allowed` inline.

### Icon trong Button
```html
<button class="btn btn-default btn-sm">
  <i class="bx bx-send"></i> Gửi quản lý
</button>
```
Icon luôn đặt trước text, `gap: 5px` đã có trong base.

---

## 6. Icon-Only Button System

Có 2 loại icon-only button tùy context:

### `.gt-pri` — Table view action button
```css
.gt-pri {
  width: 27px; height: 27px; border-radius: var(--rxs);
  border: none; background: transparent; color: var(--z500);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: var(--t); font-size: 16px;
}
.gt-pri:hover               { background: var(--z100); color: var(--z800) }
.gt-pri.accent              { color: var(--brand) }
.gt-pri.accent:hover        { background: var(--brand-muted); color: var(--brand) }
.gt-pri.danger              { color: var(--err) }
.gt-pri.danger:hover        { background: var(--err-bg) }
```

### `.gi-act` — Card view action button
```css
.gi-act {
  width: 26px; height: 26px; border-radius: var(--rxs);
  border: none; background: transparent; font-size: 15px; color: var(--z500);
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: var(--t);
}
.gi-act:hover              { background: var(--z100); color: var(--z800) }
.gi-act.accent             { color: var(--brand) }
.gi-act.accent:hover       { background: var(--brand-muted) }
.gi-act.danger             { color: var(--err) }
.gi-act.danger:hover       { background: var(--err-bg) }
```

### Ground rules cho icon-only button
- **Luôn có tooltip** qua `data-tip="..."` + `onmouseenter="showTip(this)"` + `onmouseleave="hideTip()`
- Không bao giờ hiển thị text label — icon đại diện duy nhất
- Dùng `.accent` cho hành động tích cực chính (Sửa & Gửi, Đánh giá)
- Dùng `.danger` cho hành động huỷ/xoá

```html
<!-- Table view -->
<button class="gt-pri accent" data-tip="Sửa &amp; Gửi"
        onmouseenter="showTip(this)" onmouseleave="hideTip()"
        onclick="openEdit(...)">
  <i class="bx bx-edit"></i>
</button>

<!-- Card view -->
<button class="gi-act accent" data-tip="Đánh giá hoàn thành"
        onmouseenter="showTip(this)" onmouseleave="hideTip()"
        onclick="event.stopPropagation(); openEvalTab(this.closest('.goal-item'))">
  <i class="bx bx-task"></i>
</button>
```

---

## 7. Badge System

### Base
```css
.badge {
  display: inline-flex; align-items: center;
  padding: 1px 7px; height: 20px; border-radius: var(--rxs);
  font-size: 11px; font-weight: 500; border: 1px solid;
  white-space: nowrap; letter-spacing: .1px;
}
```

### Variants
| Class | Text color | Background | Border | Dùng cho |
|---|---|---|---|---|
| `.b-ok` | `var(--ok)` | transparent | `var(--ok)` | Đã duyệt (outlined) |
| `.b-done` | `var(--ok)` | `var(--ok-bg)` | `var(--ok)` | Hoàn thành (filled + icon) |
| `.b-action` | `var(--brand)` | transparent | `var(--brand)` | CTA / Nháp (outlined brand) |
| `.b-warn` | `var(--warn)` | `var(--warn-bg)` | `var(--warn-bd)` | Cảnh báo / Cần cập nhật |
| `.b-err` | `var(--err)` | `var(--err-bg)` | `var(--err-bd)` | Lỗi / Từ chối |
| `.b-info` | `var(--info)` | `var(--info-bg)` | `var(--info-bd)` | Chờ duyệt / Thông tin |
| `.b-upd` | `var(--upd)` | `var(--upd-bg)` | `var(--upd-bd)` | Cần cập nhật (tím) |
| `.b-muted` | `var(--z500)` | `var(--z100)` | `var(--z200)` | Trạng thái phụ / Không hoạt động |
| `.b-what` | `var(--what)` | `var(--what-bg)` | `var(--what-bd)` | Loại goal: Kết quả công việc |
| `.b-dev` | `var(--dev)` | `var(--dev-bg)` | `var(--dev-bd)` | Loại goal: Phát triển năng lực |
| `.b-how` | `var(--how)` | `var(--how-bg)` | `var(--how-bd)` | Loại goal: Hành vi (How) |

### `.b-done` có icon
```html
<span class="badge b-done"><i class="bx bx-check-circle"></i> Hoàn thành</span>
```

### Priority Pills (`.prio`)
```css
.prio    { display: inline-flex; align-items: center; gap: 3px;
           padding: 1px 7px; height: 20px; border-radius: var(--rxs);
           font-size: 11px; font-weight: 500; white-space: nowrap }
.prio-h  { background: var(--z200); color: var(--z900); font-weight: 600 }  /* Cao */
.prio-m  { background: var(--z100); color: var(--z600) }                    /* Trung bình */
.prio-l  { background: transparent; color: var(--z400) }                    /* Thấp */
```

---

## 8. Form System

### Form Group
```css
.fg   { margin-bottom: 13px }
.flbl { display: block; font-size: 12.5px; font-weight: 500;
        color: var(--z700); margin-bottom: 4px }
.flbl .req { color: var(--err); margin-left: 2px }  /* dấu * required */
```

### Form Control Base
```css
.fc {
  width: 100%; padding: 6px 10px; border: 1px solid var(--z200);
  border-radius: var(--rsm); font-size: 13.5px; font-family: inherit;
  color: var(--z900); background: var(--z0);
  transition: var(--t); outline: none; line-height: 1.5;
}
.fc:focus        { border-color: var(--brand); outline: 2px solid var(--brand-ring); outline-offset: 1px }
.fc::placeholder { color: var(--z400) }
.fc.err          { border-color: var(--err) }
.fc.err:focus    { outline-color: rgba(220,38,38,.2) }
textarea.fc      { resize: vertical }
```

### Select Control
```css
select.fc {
  appearance: none; -webkit-appearance: none;
  padding-right: 26px;
  background-image: url("data:image/svg+xml,...");  /* caret SVG zinc-400 */
  background-repeat: no-repeat; background-position: right 7px center;
  cursor: pointer;
}
```

### Grid Layouts trong Form
```css
.frow3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px }
.dg    { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px }
```

### Feedback
```css
.ferr       { font-size: 11.5px; color: var(--err); margin-top: 3px; display: none }
.ferr.on    { display: block }
.fhint      { font-size: 11.5px; color: var(--z500); margin-top: 3px }
.fcnt       { font-size: 11px; color: var(--z400); text-align: right; margin-top: 2px }
```

### Type Segmented Control (Goal type picker)
```css
.type-seg  { display: flex; background: var(--z100); border: 1px solid var(--z200);
             border-radius: var(--rsm); padding: 2px; gap: 2px }
.ts-btn    { flex: 1; padding: 5px 10px; border: 1px solid transparent;
             border-radius: var(--rxs); font-size: 13px; font-weight: 500; color: var(--z500) }
.ts-btn.on { background: var(--z0); border-color: var(--z200); color: var(--z900); box-shadow: var(--sh-sm) }
.ts-btn.on.what { color: var(--what) }
.ts-btn.on.dev  { color: var(--dev) }
```

### Rich Text Editor (RTE)
- Wrapper: `.rte-wrap` — border `var(--z200)`, focus-within → brand border + ring
- Toolbar: `.rte-toolbar` — bg `var(--z50)`, border-bottom `var(--z100)`
- Toolbar button: `.rte-btn` (26×26px), `.rte-btn.active` → bg `var(--z200)`
- Body: `.rte-body` — min-height `58px`, `font-size: 13.5px`, `.rte-lg` min-height `100px`

---

## 9. Modal / Dialog System

### Overlay
```css
.overlay     { position: fixed; inset: 0; background: rgba(0,0,0,.5);
               z-index: 1000; display: none; align-items: center; justify-content: center;
               padding: 16px; backdrop-filter: blur(2px) }
.overlay.open { display: flex; animation: ov-in .15s ease }
@keyframes ov-in { from { opacity: 0 } to { opacity: 1 } }
```

### Dialog
```css
.dialog    { background: var(--z0); border-radius: var(--r); border: 1px solid var(--z200);
             width: 100%; max-width: 560px; max-height: 90vh;
             display: flex; flex-direction: column; box-shadow: var(--sh-lg);
             animation: dlg-in .18s ease }
.dialog.md { max-width: 640px }
.dialog.sm { max-width: 400px }
@keyframes dlg-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
```

### Dialog Structure
```html
<div class="overlay" id="dlg-xxx">
  <div class="dialog [md|sm]">
    <!-- Header -->
    <div class="dlg-hd">
      <div class="dlg-hd-row">
        <div class="dlg-title">Tiêu đề</div>
        <button class="dlg-close" onclick="closeOverlay('dlg-xxx')">
          <i class="bx bx-x"></i>
        </button>
      </div>
      <div class="dlg-badges"><!-- badges trạng thái, loại goal --></div>
      <!-- Tabs (nếu có) -->
      <div class="dlg-tabs">
        <button class="dlg-tab on" onclick="switchTab(0, this)">Thông tin</button>
        <button class="dlg-tab" onclick="switchTab(1, this)">Bình luận</button>
      </div>
    </div>

    <!-- Body -->
    <div class="dlg-body">
      <div class="tpanel on" id="tp-0"><!-- nội dung tab 0 --></div>
      <div class="tpanel"    id="tp-1"><!-- nội dung tab 1 --></div>
    </div>

    <!-- Footer -->
    <div class="dlg-foot">
      <button class="btn btn-ghost btn-sm" onclick="closeOverlay('dlg-xxx')">Đóng</button>
      <!-- CTA chính nếu có -->
    </div>
  </div>
</div>
```

### Dialog Header — CSS
```css
.dlg-hd      { padding: 16px 20px 0; flex-shrink: 0 }
.dlg-hd-row  { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 4px }
.dlg-badges  { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 6px }
.dlg-title   { font-size: 15px; font-weight: 600; color: var(--z900); flex: 1; line-height: 1.4 }
.dlg-close   { width: 24px; height: 24px; border-radius: var(--rxs); border: none;
               background: transparent; color: var(--z500); font-size: 14px }
.dlg-close:hover { background: var(--z100); color: var(--z700) }
```

### Dialog Tabs — CSS
```css
.dlg-tabs  { display: flex; border-bottom: 1px solid var(--z200); padding: 0 20px; margin-top: 8px }
.dlg-tab   { padding: 7px 12px; font-size: 13px; font-weight: 400; color: var(--z500);
             border: none; background: transparent; border-bottom: 2px solid transparent;
             margin-bottom: -1px; transition: var(--t) }
.dlg-tab:hover    { color: var(--z700) }
.dlg-tab.on       { color: var(--brand); border-bottom-color: var(--brand); font-weight: 600 }
.dlg-tab-n        { padding: 0 5px; height: 15px; border-radius: var(--rxs);
                    font-size: 10px; font-weight: 700;
                    background: var(--brand-muted); color: var(--brand) }
```

### Dialog Body & Footer
```css
.dlg-body  { padding: 16px 20px; overflow-y: auto; flex: 1 }
.dlg-foot  { padding: 10px 20px 14px; border-top: 1px solid var(--z100);
             display: flex; gap: 7px; justify-content: flex-end; flex-shrink: 0 }
.tpanel    { display: none }
.tpanel.on { display: block }
```

### Confirm Dialog
```css
.conf-dlg        { position: fixed; inset: 0; background: rgba(0,0,0,.5);
                   z-index: 1100; display: none; align-items: center; justify-content: center }
.conf-dlg.open   { display: flex }
.conf-box        { background: var(--z0); border-radius: var(--r); max-width: 380px; padding: 20px }
.conf-title      { font-size: 14.5px; font-weight: 600; color: var(--z900); margin-bottom: 6px }
.conf-body       { font-size: 13px; color: var(--z500); margin-bottom: 16px; line-height: 1.55 }
.conf-actions    { display: flex; gap: 7px; justify-content: flex-end }
```
> `z-index: 1100` — trên mọi overlay (1000). Confirm dialog xuất hiện trên dialog.

---

## 10. Detail Popup — Field Rules

### Thứ tự field trong Tab "Thông tin" (bắt buộc)
```
1. [Grid 3 cột] Độ ưu tiên | Từ ngày | Đến ngày
2. Tên mục tiêu
3. Kết quả cần đạt
4. [Phần đánh giá — ẩn nếu chưa evaluate, hiện sau khi approved+eval]
```

### Detail Field CSS
```css
.detail-row             { padding: 13px 0; border-bottom: 1px solid var(--z200) }
.detail-row:first-child { padding-top: 2px }
.detail-row:last-child  { border-bottom: none; padding-bottom: 2px }
.detail-val             { font-size: 13.5px; color: var(--z700); line-height: 1.65;
                          background: var(--z50); border-radius: var(--rsm);
                          padding: 9px 12px; margin-top: 6px; word-break: break-word }
.sec-lbl                { font-size: 11px; font-weight: 600; text-transform: uppercase;
                          letter-spacing: .5px; color: var(--z500); display: block; margin-bottom: 6px }
```

### Grid 2 cột trong detail (`.dg`)
```css
.dg              { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px }
.df label        { font-size: 11px; font-weight: 600; text-transform: uppercase;
                   letter-spacing: .5px; color: var(--z500); display: block; margin-bottom: 3px }
.df .dv          { font-size: 13.5px; color: var(--z700); font-weight: 400; line-height: 1.65 }
```

### Footer của Detail Popup
```html
<div class="dlg-foot">
  <button class="btn btn-ghost btn-sm" onclick="closeOverlay('dlg-detail')">Đóng</button>
  <button class="btn btn-default btn-sm" id="d-foot-cta" style="display:none"></button>
</div>
```
- **Không có** dòng "Duyệt bởi..." trong footer
- CTA button thay đổi theo status (xem §14)

---

## 11. Create / Edit Popup — Rules

### Footer của Create Popup
```html
<div class="dlg-foot">
  <button class="btn btn-outline btn-sm" onclick="saveDraft()">Lưu nháp</button>
  <button class="btn btn-default btn-sm" id="btn-submit" onclick="submitGoal()">
    Gửi quản lý <i class="bx bx-right-arrow-alt"></i>
  </button>
</div>
```
- **Không có** nút "Huỷ" / "Đóng" trong footer của create/edit form
- 2 button: Lưu nháp (outline) + Gửi quản lý (default)

### Tip Icon (ⓘ)
```css
.tip-ico         { font-size: 13px; color: var(--brand); cursor: default; line-height: 1;
                   transition: color .12s; display: none }
.tip-ico.visible { display: inline-flex }
.tip-ico:hover   { color: var(--brand) }
```
- Màu **luôn là `var(--brand)` (hồng MoMo)** — không dùng màu khác
- Dùng `bx bx-info-circle`

---

## 12. Tooltip System

### Floating Tooltip
```css
.floating-tip {
  position: fixed; background: var(--z700); color: #fff;
  font-size: 12px; font-weight: 400; line-height: 1.6;
  padding: 9px 12px; border-radius: var(--rsm);
  max-width: 260px; width: max-content; z-index: 9999;
  display: none; box-shadow: var(--sh-lg); pointer-events: none;
}
.floating-tip::before {
  content: ''; position: absolute; right: 100%; top: 50%;
  transform: translateY(-50%); border: 5px solid transparent;
  border-right-color: var(--z700);  /* arrow trỏ từ trái */
}
```

### JS API
```javascript
function showTip(ico) {
  // đọc ico.dataset.tip
  // tạo lazy .floating-tip nếu chưa có
  // hiển thị bên phải element, flip sang trái nếu overflow viewport
}
function hideTip() { /* ẩn tooltip */ }
```

### Cách dùng (bắt buộc với mọi icon-only button)
```html
<button class="gt-pri" data-tip="Xem chi tiết"
        onmouseenter="showTip(this)" onmouseleave="hideTip()">
  <i class="bx bx-show"></i>
</button>
```

---

## 13. Board View (3-Column Grid)

```css
.goal-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: start }
.goal-col  { background: var(--z0); border: 1px solid var(--z300);
             border-radius: var(--r); box-shadow: var(--sh); overflow: hidden }
```

### Column Header
```css
.col-hd       { display: flex; align-items: center; gap: 8px; padding: 11px 14px;
                border-bottom: 1px solid #f3cfe1; background: #fbe4f0 }
.col-type-lbl { font-size: 13px; font-weight: 700; letter-spacing: -.1px; color: var(--z900) }
```
> Header màu hồng nhạt (`#fbe4f0` bg, `#f3cfe1` border) — đặc trưng brand.

### Goal Card Item
```css
.goal-item       { padding: 10px 14px; border-bottom: 1px solid var(--z200);
                   cursor: pointer; transition: background .08s; position: relative }
.goal-item:hover { background: var(--z50) }
.gi-title        { font-size: 13.5px; font-weight: 500; color: var(--z900); line-height: 1.4;
                   margin-bottom: 5px;
                   display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden }
.gi-meta         { display: flex; align-items: center; gap: 5px; flex-wrap: wrap }
.gi-date         { font-size: 11.5px; color: var(--z500) }
```

### Hover-Reveal Card Actions
```css
.gi-actions               { display: none; align-items: center; gap: 4px;
                            margin-top: 7px; padding-top: 7px; border-top: 1px solid var(--z100) }
.goal-item:hover .gi-actions { display: flex }
/* KHÔNG có rule .goal-item[data-status="..."] .gi-actions { display: flex } */
/* Mọi status đều chỉ show on hover — không exception */
```

---

## 14. CTA Actions per Status

### Card View — Icons hiển thị khi hover
| Status (data-status) | Icons (trái → phải) | Ghi chú |
|---|---|---|
| `draft` — Nháp | `bx-send` (accent, Gửi quản lý) · `bx-edit` (Sửa & Gửi) · `bx-trash` (danger, Xoá) | 3 icons |
| `pending` — Chờ duyệt | `bx-show` (Xem) · `bx-undo` (Thu hồi) | 2 icons |
| `update` — Cần cập nhật | `bx-edit` (accent, Sửa & Gửi) | 1 icon duy nhất |
| `approved` — Đã duyệt | `bx-task` (accent, Đánh giá hoàn thành) · `bx-show` (Xem chi tiết) | 2 icons |
| `done` — Hoàn thành | `bx-show` (Xem chi tiết) | 1 icon |

### Table View — Tương ứng với card view
Dùng `.gt-pri` thay vì `.gi-act`, logic hành động giống nhau.

### Detail Popup Footer CTA
| Status | CTA button |
|---|---|
| `draft` | `btn-default` "Gửi quản lý" |
| `pending` | `btn-cta-outline` "Thu hồi" |
| `update` | `btn-default` "Sửa & Gửi" |
| `approved` | `btn-default` "Đánh giá hoàn thành" (nếu chưa eval) |
| `done` | không có CTA (chỉ Đóng) |

---

## 15. Table View

```css
.gtable-wrap { border: 1px solid var(--z300); border-radius: var(--r);
               box-shadow: var(--sh); overflow: visible }
.gtable      { width: 100%; border-collapse: collapse; background: var(--z0); font-size: 13px }
.gtable th   { font-size: 11px; font-weight: 600; text-transform: uppercase;
               letter-spacing: .4px; color: var(--z500);
               background: var(--brand-muted); padding: 10px 12px;
               border-bottom: 1px solid var(--brand-ring) }
.gtable td   { padding: 11px 12px; border-bottom: 1px solid var(--z200);
               color: var(--z900); font-size: 13px; font-weight: 500; line-height: 1.45 }
.gtable tbody tr:hover { background: var(--z50) }
```

### Checkbox Column (hover-reveal)
```css
.gt-cb-td   { width: 36px; padding: 0 0 0 10px; text-align: center; vertical-align: middle }
.gt-cb-wrap { opacity: 0; transition: opacity .1s }
.gt-row:hover .gt-cb-wrap,
.gt-bulk-mode .gt-cb-wrap               { opacity: 1 }
.gt-row:has(.gt-cb:checked) .gt-cb-wrap { opacity: 1 }  /* checked = luôn hiển thị */
.gt-cb      { width: 13px; height: 13px; cursor: pointer; accent-color: var(--brand); display: block }
```

### Group Row
```css
.gt-grouprow td { background: var(--z100); font-size: 11px; font-weight: 700;
                  text-transform: uppercase; letter-spacing: .4px; color: var(--z500); padding: 7px 12px }
.gt-grouprow td i { color: var(--brand); margin-right: 5px }
```

---

## 16. Bulk Select Bar

```css
.bulk-bar    { display: none; align-items: center; gap: 7px; padding: 7px 12px;
               background: var(--z0); border: 1px solid var(--brand);
               border-radius: var(--rsm); margin-bottom: 10px;
               position: sticky; top: calc(var(--nh) + 8px); z-index: 50;
               box-shadow: var(--sh-md) }
.bulk-bar.on { display: flex }
.bulk-sep    { width: 1px; height: 16px; background: var(--z200); margin: 0 2px }
.bulk-cnt    { font-size: 13px; font-weight: 600; color: var(--brand) }
.bulk-warn   { font-size: 12.5px; font-weight: 500; color: var(--warn);
               display: flex; align-items: center; gap: 4px; margin-right: 2px }
```

### Bulk Bar Structure
```html
<div class="bulk-bar" id="bulk-bar">
  <span class="bulk-cnt" id="bulk-cnt">0 đã chọn</span>
  <button class="btn btn-ghost btn-xs" onclick="clearBulk()">Bỏ chọn</button>
  <button class="btn btn-ghost btn-xs" onclick="selAllDraft()">Chọn Nháp &amp; Cần cập nhật</button>
  <div class="bulk-sep"></div>
  <span class="bulk-warn" id="bulk-warn" style="display:none">
    <i class="bx bx-error-circle"></i> Chọn các mục tiêu cùng trạng thái
  </span>
  <button class="btn btn-default btn-xs" id="bulk-send" disabled>
    <i class="bx bx-send"></i> Gửi quản lý
  </button>
</div>
```

### Bulk Logic Rules
- `draft` + `update` → cùng nhóm `"sendable"` — được phép gửi chung
- Các nhóm khác nhau (e.g., pending + draft) → hiển thị `.bulk-warn`, disable nút Gửi
- **Không có nút Xoá** trong bulk bar

---

## 17. Completion Evaluation (Đánh giá hoàn thành)

### Vị trí
- **Inline trong Tab "Thông tin"** (tp-0), không phải tab riêng
- Được đặt trong `<div id="d-eval-section">` bên dưới "Kết quả cần đạt"
- Ẩn theo mặc định, hiện khi `showEval = true`

### Score Display — BẮT BUỘC
```javascript
function scoreHTML(v) {
  if (!v) return '';
  var display = parseFloat(v).toFixed(1);  // LUÔN 1 decimal: "3.0", "4.0", "5.0"
  var lbl = scoreLabel(v);
  return '<span class="ev-score-num">' + display + '</span>'
       + '<span class="ev-score-max">/ 5</span>'
       + (lbl ? '<span class="ev-score-lbl">' + lbl + '</span>' : '');
}
```
> **Không bao giờ** hiển thị "3/5" — phải là "3.0/5"

### Score Labels (chỉ số nguyên)
| Score | Label |
|---|---|
| 5 | Hoàn thành vượt xa kỳ vọng |
| 4 | Hoàn thành trên mức kỳ vọng |
| 3 | Hoàn thành kỳ vọng |
| 2 | Hoàn thành một phần |
| 1 | Không đạt yêu cầu |
| Số lẻ | Không hiển thị label |

### Score Dropdown — Chỉ số nguyên
```html
<select class="fc">
  <option value="">-- Chọn điểm --</option>
  <option value="1">1 — Không đạt yêu cầu</option>
  <option value="2">2 — Hoàn thành một phần</option>
  <option value="3">3 — Hoàn thành kỳ vọng</option>
  <option value="4">4 — Hoàn thành trên mức kỳ vọng</option>
  <option value="5">5 — Hoàn thành vượt xa kỳ vọng</option>
</select>
```
**Không có điểm lẻ** (1.5, 2.5, ...) trong dropdown nhập liệu.

### Eval Card CSS
```css
.ev-card         { border: 1px solid var(--z200); border-radius: var(--rsm);
                   padding: 12px 13px; margin-bottom: 12px }
.ev-card.locked  { background: var(--z50) }
.ev-card-hd      { font-size: 11px; font-weight: 600; text-transform: uppercase;
                   letter-spacing: .4px; color: var(--z500); margin-bottom: 9px }
.ev-score-num    { font-size: 22px; font-weight: 700; color: var(--z900); line-height: 1 }
.ev-score-max    { font-size: 12px; font-weight: 500; color: var(--z500) }
.ev-score-lbl    { font-size: 11px; font-weight: 600; color: var(--z600);
                   background: var(--z100); border: 1px solid var(--z200);
                   border-radius: var(--rxs); padding: 1px 6px; margin-left: 2px }
.ev-cmt          { font-size: 13px; color: var(--z700); line-height: 1.55;
                   background: var(--z50); border-radius: var(--rxs); padding: 8px 10px }
.ev-meta         { font-size: 11.5px; color: var(--z500); margin-top: 6px }
```

### Meta Format (người đánh giá)
```
domain login: firstname.lastname  (vd: tu.nguyen, thanh.le)
```
**Không dùng** họ tên đầy đủ hay "Duyệt bởi [Tên] lúc [Ngày]" trong eval meta.

---

## 18. Page Layout

### Shell
```css
.app       { display: flex; min-height: 100vh }
.sidebar   { width: var(--sw); position: fixed; top: 0; bottom: 0; left: 0;
             background: var(--z0); border-right: 1px solid var(--z200); z-index: 200 }
.workspace { margin-left: var(--sw); flex: 1; display: flex; flex-direction: column }
.topbar    { height: var(--nh); background: var(--z0); border-bottom: 1px solid var(--z200);
             position: sticky; top: 0; z-index: 100 }
.page      { padding: 20px 24px; flex: 1 }
```

### Page Header
```css
.page-hd    { display: flex; align-items: center; justify-content: space-between;
              gap: 12px; margin-bottom: 18px }
.page-title { font-size: 18px; font-weight: 700; color: var(--z900); letter-spacing: -.4px }
.breadcrumb { font-size: 12px; color: var(--z500); margin-bottom: 10px }
```

### Z-index Stack
| Layer | z-index | Component |
|---|---|---|
| Sidebar | `200` | `.sidebar` |
| Topbar | `100` | `.topbar` |
| Bulk bar | `50` | `.bulk-bar` |
| Dropdown menu | `30` | `.gt-menu-list` |
| Overlay / Modal | `1000` | `.overlay` |
| Confirm dialog | `1100` | `.conf-dlg` |
| Tooltip | `9999` | `.floating-tip` |

---

## 19. Naming Conventions

### Status Values (`data-status`)
| Value | Tên hiển thị | Badge class |
|---|---|---|
| `draft` | Nháp | `.b-action` |
| `pending` | Chờ duyệt | `.b-info` |
| `update` | Cần cập nhật | `.b-warn` hoặc `.b-upd` |
| `approved` | Đã duyệt | `.b-ok` |
| `done` | Hoàn thành | `.b-done` |

### Eval State Values (`data-eval`)
| Value | Ý nghĩa |
|---|---|
| `none` | Chưa đánh giá |
| `selfdone` | Nhân viên đã submit, chờ quản lý |
| `done` | Đánh giá hoàn thành (cả 2 bên) |

### Domain Login Format
```
firstname.lastname  (viết thường, không dấu, không khoảng trắng)
Ví dụ: tu.nguyen, thanh.le, quynh.nguyen
```

### Goal Type Values
| Value | Tên tiếng Việt | Color var |
|---|---|---|
| `what` | Kết quả công việc | `--what` |
| `dev` | Phát triển năng lực | `--dev` |
| `how` | Hành vi / Cách làm | `--how` |

---

## 20. Ground Rules (Bắt buộc toàn bộ hệ thống)

1. **Một file HTML duy nhất** — mỗi màn hình là 1 file `index.html` standalone, không framework, không bundler
2. **Tất cả CSS trong `<style>` tag** — không file ngoài trừ Google Fonts và Boxicons CDN
3. **Không hardcode hex màu** — dùng CSS custom property (`var(--brand)`, `var(--z700)`, ...)
4. **Không tự sáng tác design token** — chỉ dùng token đã định nghĩa trong §2–§3
5. **Không tự tạo component mới** — reuse class có sẵn trước khi tạo class mới
6. **Icon-only button BẮT BUỘC có tooltip** — không exception
7. **Score hiển thị BẮT BUỘC `toFixed(1)`** — "3.0" không phải "3"
8. **Eval meta dùng domain login** — không họ tên đầy đủ
9. **Hover-reveal actions** — mọi status đều ẩn icon, chỉ hiện khi hover; không exception
10. **Create form footer: Lưu nháp + Gửi quản lý** — không có nút Huỷ
11. **Detail popup footer: không có "Duyệt bởi..."** — thông tin duyệt đã loại bỏ
12. **Eval section inline trong Tab Thông tin** — không tạo tab riêng
13. **Bulk: draft + update = sendable group** — cho phép gửi chung
14. **Checked row giữ checkbox hiển thị** — dùng CSS `:has(.gt-cb:checked)`
15. **Màu cột header bảng = `var(--brand-muted)` bg + `var(--brand-ring)` border** — không dùng màu khác
16. **Cột header card board = `#fbe4f0` bg + `#f3cfe1` border** — màu hồng đặc trưng brand
17. **Dialog animation** — `dlg-in` 0.18s translateY(14px→0) + opacity; overlay `ov-in` 0.15s opacity
18. **Transition toàn cục** — luôn dùng `var(--t)` (`all .12s ease`), không hardcode duration
