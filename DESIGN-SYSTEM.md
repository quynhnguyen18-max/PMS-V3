# DESIGN SYSTEM SPEC — MoMo HRM (chuẩn theo màn hình E-01 "Mục tiêu và Đánh giá cá nhân")

> Paste toàn bộ nội dung dưới đây (phần trong khung) vào đầu một đoạn hội thoại mới khi muốn tạo màn hình mới, để mọi màn hình đồng nhất 100% với E-01.

---

Bạn sẽ tạo một màn hình HTML prototype mới. BẮT BUỘC tuân thủ chính xác design system dưới đây — lấy tab "Mục tiêu" của màn hình E-01 làm chuẩn tuyệt đối về font, font-size, màu sắc, token, bố cục bảng, header, title, label, info box, border, button, badge, dialog. Không tự chế giá trị mới; chỉ dùng đúng các token/class bên dưới. Mọi màn hình phải đồng nhất 100%.

## 0. Stack & nền tảng
- Single-file HTML: toàn bộ CSS trong `<style>`, JS vanilla trong `<script>`. Không framework.
- Font: **Public Sans** (weights 300;400;500;600;700) qua Google Fonts.
- Icon: **Boxicons 2.1.4** (`<i class="bx bx-...">`).
- `<html lang="vi">`, `html{font-size:14px}`, `body{font-family:'Public Sans',sans-serif;font-size:14px;line-height:1.5;color:var(--z700);background:var(--z50);-webkit-font-smoothing:antialiased}`.
- Reset: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}`.
- Scrollbar mảnh 4px, thumb `var(--z300)`.

## 1. TOKENS — dán nguyên khối `:root` này, KHÔNG sửa
```css
:root{
  /* Zinc scale (shadcn) */
  --z0:#ffffff;--z50:#fafafa;--z100:#f4f4f5;--z200:#e4e4e7;--z300:#d4d4d8;
  --z400:#a1a1aa;--z500:#71717a;--z600:#52525b;--z700:#3f3f46;--z800:#27272a;--z900:#18181b;--z950:#09090b;
  /* MoMo pink — accent only */
  --brand:#A50064;--brand-h:#8B0055;--brand-fg:#ffffff;
  --brand-muted:rgba(165,0,100,.07);--brand-ring:rgba(165,0,100,.2);
  /* Goal type */
  --what:#2563eb;--what-bg:#eff6ff;--what-bd:#bfdbfe;
  --dev:#7c3aed; --dev-bg:#f5f3ff; --dev-bd:#ddd6fe;
  --how:#0f766e; --how-bg:#f0fdfa; --how-bd:#99f6e4;
  /* Semantic */
  --ok:#16a34a;--ok-bg:#f0fdf4;--ok-bd:#bbf7d0;
  --warn:#d97706;--warn-bg:#fffbeb;--warn-bd:#fde68a;
  --err:#dc2626;--err-bg:#fef2f2;--err-bd:#fecaca;
  --info:#2563eb;--info-bg:#eff6ff;--info-bd:#bfdbfe;
  --upd:#7c3aed;--upd-bg:#f5f3ff;--upd-bd:#ddd6fe;
  /* Spacing/shape */
  --sw:232px;--nh:52px;
  --r:8px;--rsm:6px;--rxs:4px;
  --sh-sm:0 1px 2px rgba(0,0,0,.04);
  --sh:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --sh-md:0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.03);
  --sh-lg:0 8px 30px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.04);
  --t:all .12s ease;
}
```
**Quy tắc màu:** Pink `--brand` chỉ dùng làm accent (active, nút chính, icon nhấn, link hover). Nền/chữ chính dùng zinc scale. Không dùng màu xám tùy tiện — chữ nội dung chính là `--z900`, chữ phụ/meta `--z500`, label `--z500`.

## 2. LAYOUT SHELL (mọi màn hình giữ y nguyên)
- `.app{display:flex;min-height:100vh}`
- Sidebar trái cố định: `.sidebar{width:var(--sw);position:fixed;top:0;bottom:0;left:0;background:var(--z0);border-right:1px solid var(--z200);z-index:200}`. Gồm: brand (logo pink 26px bo 6px + "MoMo HRM"), role switch (Nhân viên/Quản lý), nav nhóm (`.sb-grp` uppercase 11px), footer user.
- `.workspace{margin-left:var(--sw);flex:1}`.
- Topbar sticky: `.topbar{height:var(--nh);background:var(--z0);border-bottom:1px solid var(--z200);padding:0 20px;position:sticky;top:0;z-index:100}`. Title trái 13.5px/500 z600, phải có ico-btn (30px, bo rsm) + avatar.
- `.page{padding:20px 24px}`.
- Avatar `.av`: tròn 28px, `.av-brand{background:var(--brand-muted);color:var(--brand)}`, biến thể `.av-sm`24px `.av-xs`20px, chữ 700.

## 3. TYPOGRAPHY (thang chữ chuẩn)
- Page title: `font-size:18px;font-weight:700;color:var(--z900);letter-spacing:-.4px;line-height:1`.
- Dialog title: `15px/600 z900`.
- Card/section title: `13px/700 z900;letter-spacing:-.1px`.
- **Section label / eyebrow** (label nhỏ trên field, header bảng): `font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--z500)`.
- Body thường: 13–13.5px, z700/z900.
- Meta/phụ: 11–12px, z500.
- Breadcrumb: 12px z500, separator z400.

## 4. EMPLOYEE CHIP (header phải) — format chuẩn
```html
<div class="page-hd"><!-- flex space-between, margin-bottom:18px -->
  <h1 class="page-title">Tiêu đề màn hình</h1>
  <div class="emp-chip"><!-- border z200, bo --r, padding 9px 13px, bg z0 -->
    <div class="av av-brand av-xs">NT</div>
    <div class="ec-info"><!-- gap 2px -->
      <div class="ec-line"><span class="ec-lbl">Nhân viên:</span> Nguyễn Văn Tú <span class="ec-dom">(tu.nguyen)</span></div>
      <div class="ec-line"><span class="ec-lbl">Team:</span> ITC - Backend</div>
      <div class="ec-line"><span class="ec-lbl">Quản lý trực tiếp:</span> Lê Thị Thanh <span class="ec-dom">(thanh.le)</span></div>
    </div>
  </div>
</div>
```
`.ec-line{font-size:12px;color:var(--z800);line-height:1.35}` · `.ec-lbl{color:var(--z500);font-weight:500}` · `.ec-dom{color:var(--z500)}`. Dòng Team chỉ "DIV - TEAM" (gạch nối `-`, không kèm chức danh).

## 5. TABS (in-page, chuyển panel inline)
```css
.tabs{display:flex;gap:2px;border-bottom:2px solid var(--z200);margin-bottom:16px}
.tab-btn{padding:8px 16px;font-size:13px;font-weight:500;color:var(--z500);border:none;background:transparent;border-bottom:2px solid transparent;margin-bottom:-2px;display:flex;align-items:center;gap:5px;border-radius:var(--rsm) var(--rsm) 0 0;transition:var(--t)}
.tab-btn:not(.disabled):not(.on):hover{color:var(--z900);background:var(--z100)}
.tab-btn.on{color:var(--brand);border-bottom-color:var(--brand);font-weight:700}
.tab-btn.disabled{color:var(--z400);cursor:not-allowed}
.tab-cnt{padding:0 5px;height:16px;line-height:16px;border-radius:var(--rxs);font-size:10px;font-weight:700;background:var(--z100);color:var(--z500)}
.tab-btn.on .tab-cnt{background:var(--brand-muted);color:var(--brand)}
```
Mỗi tab mở một `.main-panel` (chỉ `.on` mới `display:block`), chuyển bằng JS `switchMainTab(idx)`. Không điều hướng sang file khác.

## 6. BUTTONS (shadcn variants)
```css
.btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:var(--rsm);font-size:13px;font-weight:500;border:1px solid transparent;line-height:1.4;white-space:nowrap;transition:var(--t)}
.btn-default{background:var(--brand);border-color:var(--brand);color:#fff}      /* hover: --brand-h */
.btn-secondary{background:var(--z100);border-color:var(--z200);color:var(--z700)}
.btn-outline{background:var(--z0);border-color:var(--z200);color:var(--z700)}    /* hover: bg z50, border z400 */
.btn-cta-outline{background:var(--z0);border-color:var(--brand);color:var(--brand);font-weight:600} /* action chính cần nhấn */
.btn-ghost{background:transparent;border-color:transparent;color:var(--z600)}
.btn-destructive{background:transparent;border-color:var(--err-bd);color:var(--err)}
.btn-sm{padding:4px 10px;font-size:12.5px}  .btn-xs{padding:2px 8px;font-size:11.5px}
.btn-default:disabled{opacity:.45;cursor:not-allowed}
```
Nút chính = `btn btn-default` (1 nút/khu vực). Nút phụ = `btn-outline`. Luôn kèm icon boxicons bên trái.

## 7. BADGES & PRIO PILLS
```css
.badge{display:inline-flex;align-items:center;padding:1px 7px;height:20px;border-radius:var(--rxs);font-size:11px;font-weight:500;border:1px solid;white-space:nowrap;letter-spacing:.1px}
.b-ok{color:var(--ok);background:transparent;border-color:var(--ok)}                 /* Đã duyệt */
.b-done{color:var(--ok);background:var(--ok-bg);border-color:var(--ok);gap:3px}      /* Hoàn thành (có icon) */
.b-action{color:var(--brand);background:transparent;border-color:var(--brand)}
.b-warn{color:var(--warn);background:var(--warn-bg);border-color:var(--warn-bd)}     /* Cần cập nhật */
.b-err{color:var(--err);background:var(--err-bg);border-color:var(--err-bd)}          /* Từ chối */
.b-info{color:var(--info);background:var(--info-bg);border-color:var(--info-bd)}
.b-upd{color:var(--upd);background:var(--upd-bg);border-color:var(--upd-bd)}
.b-muted{color:var(--z500);background:var(--z100);border-color:var(--z200)}           /* Nháp/Chờ duyệt */
.b-what/.b-dev/.b-how{ dùng cặp --what/--dev/--how + -bg + -bd }
/* Prio */
.prio{display:inline-flex;align-items:center;gap:3px;padding:1px 7px;height:20px;border-radius:var(--rxs);font-size:11px;font-weight:500}
.prio-h{background:var(--z200);color:var(--z900);font-weight:600}  /* Cao */
.prio-m{background:var(--z100);color:var(--z600)}                 /* Trung bình */
.prio-l{background:transparent;color:var(--z400)}                /* Thấp */
```

## 8. SECTION/CARD HEADER MÀU HỒNG NHẠT (chuẩn nhận diện)
Header của cột mục tiêu / section bảng dùng nền hồng nhạt cố định:
```css
.col-hd, .rv-section-hd{display:flex;align-items:center;gap:8px;padding:11px 14px;border-bottom:1px solid #f3cfe1;background:#fbe4f0}
/* title trong header: 13px/700 z900; icon: 16px var(--brand) */
```
Card bao ngoài: `background:var(--z0);border:1px solid var(--z300);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden`.

## 9. INFO BOX / GUIDE BOX (hộp lưu ý)
- Guide box (lưu ý + quy trình): `background:var(--z50);border:1px solid var(--z200);border-radius:var(--r)`. Label `.proc-lbl` uppercase 11px/600 z500. Bước quy trình = pill `.proc-step` (border z200, bo 50px) + `.proc-num` (tròn 20px, bg z400 hoặc brand, chữ trắng 700).
- Info-note nhẹ: `display:flex;gap:7px;font-size:12px;color:var(--z500);line-height:1.5`, icon đầu dòng `15px var(--brand)`, `strong` màu z700/600. Nếu cần đóng khung: thêm `background:var(--z0);border:1px solid var(--z200);border-radius:var(--r);padding:10px 13px`.
- Banner nhấn (brand): `.edit-banner{background:var(--brand-muted);border:1px solid var(--brand-ring);border-radius:var(--rsm);padding:10px 13px}`.

## 10. BẢNG (table view)
```css
.gtable{width:100%;border-collapse:collapse;background:var(--z0);font-size:13px}
.gtable th{text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:var(--z500);background:var(--brand-muted);padding:10px 12px;border-bottom:1px solid var(--brand-ring);white-space:nowrap}
.gtable td{padding:11px 12px;border-bottom:1px solid var(--z200);vertical-align:top;color:var(--z900);font-size:13px;font-weight:500;line-height:1.45}
.gtable tbody tr:hover{background:var(--z50)}
.gtable tbody tr:last-child td{border-bottom:none}
```
Wrapper: `border:1px solid var(--z300);border-radius:var(--r);box-shadow:var(--sh)`. Cột mô tả dài clamp 2 dòng (`-webkit-line-clamp:2`). Nút hành động trong hàng = ô vuông 27px, bo rxs, nền trong suốt, hover bg z100.

## 11. DIALOG / MODAL
```css
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:none;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(2px)}
.overlay.open{display:flex;animation:ov-in .15s ease}
.dialog{background:var(--z0);border-radius:var(--r);border:1px solid var(--z200);width:100%;max-width:560px;max-height:90vh;display:flex;flex-direction:column;box-shadow:var(--sh-lg)}
.dialog.md{max-width:640px} .dialog.sm{max-width:400px}
.dlg-hd{padding:16px 20px 0} .dlg-title{font-size:15px;font-weight:600;color:var(--z900)}
.dlg-close{width:24px;height:24px;border-radius:var(--rxs)} /* hover bg z100 */
.dlg-body{padding:16px 20px;overflow-y:auto;flex:1}
.dlg-foot{padding:10px 20px 14px;border-top:1px solid var(--z100);display:flex;gap:7px;justify-content:flex-end}
```
Mở/đóng bằng toggle class `.open`. Field trong dialog: label uppercase 11px/600/.5 z500; giá trị `.dv` 13.5px z700 line-height 1.65; khối kết quả `.result-blk` nền z50 + border z200 bo rsm.

## 12. FORM CONTROLS
- Select: padding `4-5px` phải `24-26px` (chừa mũi tên SVG inline), border z200/z300, bo rsm, 13px z800/500, focus `border-color:var(--brand);outline:2px solid var(--brand-ring);outline-offset:1px`. Mũi tên dùng SVG data-uri màu `%23a1a1aa`.
- Input/textarea cùng quy ước border + focus ring brand.
- Checkbox: `accent-color:var(--brand)`, 13px.

## 13. RICH-TEXT EVALUATION EDITOR (ô ghi nội dung đánh giá)
Áp dụng bắt buộc cho mọi ô nhận xét/đánh giá của Nhân viên và Quản lý trong Mid-Year Review, End-Year Review và các màn hình chi tiết đánh giá.

### Cấu trúc màu và bo viền chuẩn
- Khung ngoài: border hồng nhạt `1px solid var(--brand-ring)`, bo góc `var(--rsm)` (6px), nền `var(--z0)`, `overflow:hidden`.
- Cạnh trái có nhấn `3px` bằng `inset box-shadow` màu `var(--brand)`.
- Phần toolbar/format text dùng nền `var(--z50)`. Khi chỉ xem, đã nộp hoặc bị khóa, toolbar dùng `opacity:.4`, vì vậy đoạn cạnh trái đi qua toolbar hiển thị **hồng nhạt**.
- Phần nội dung phải để nền trong suốt, không đặt background che khung. Vì vậy đoạn cạnh trái bên dưới toolbar hiển thị **hồng đậm `var(--brand)`**.
- Hai đoạn màu phải liền mạch theo cùng cạnh trái: hồng nhạt ở vùng toolbar, hồng đậm ở vùng nội dung.
- Nội dung dùng `padding-left:11px` để không đè lên thanh nhấn 3px.

```css
.ev-editor-wrap{
  border:1px solid var(--brand-ring);
  border-radius:var(--rsm);
  overflow:hidden;
  background:var(--z0);
  box-shadow:inset 3px 0 0 var(--brand),var(--sh-sm);
  transition:var(--t);
}
.ev-toolbar{
  display:flex;
  align-items:center;
  gap:1px;
  padding:3px 5px;
  background:var(--z50);
  border-bottom:1px solid var(--z200);
  flex-wrap:wrap;
}
.ev-content{
  min-height:58px;
  padding:6px 8px 6px 11px;
  background:transparent;
  color:var(--z900);
  font-size:13px;
  line-height:1.55;
  outline:none;
  word-break:break-word;
}
.evaluation-readonly .ev-toolbar,
.evaluation-locked .ev-toolbar,
.page-submitted .ev-toolbar{
  opacity:.4;
  pointer-events:none;
}
.evaluation-readonly .ev-content,
.evaluation-locked .ev-content,
.page-submitted .ev-content{
  pointer-events:none;
}
```

### Quy tắc triển khai bắt buộc
1. Nhân viên và Quản lý phải dùng cùng component, cùng border, radius, toolbar và cấu trúc hai sắc hồng.
2. Trạng thái khóa/chỉ xem chỉ vô hiệu hóa thao tác và làm mờ toolbar; không giảm opacity của toàn bộ editor, không làm mờ nội dung đã có.
3. Không dùng pseudo-element phủ một màu trên toàn chiều cao cạnh trái.
4. Không đặt `box-shadow` hồng riêng trên `.ev-content`; thanh nhấn phải thuộc `.ev-editor-wrap`.
5. Không đặt nền trắng trên `.ev-content`, vì nền này sẽ che `inset box-shadow` của wrapper.
6. Không thay `var(--brand)` hoặc `var(--brand-ring)` bằng màu hardcode.

## 14. QUY TẮC CHUNG (bắt buộc)
1. Chỉ dùng token đã định nghĩa; không hardcode hex ngoài bảng (ngoại lệ duy nhất: nền header hồng `#fbe4f0`/`#f3cfe1`).
2. Bo góc: card/dialog `--r`(8) · control/badge-nhỏ `--rsm`(6) · pill/badge `--rxs`(4) · chip tròn `50px`.
3. Border mặc định `1px solid var(--z200)`; card nổi dùng z300 + `--sh`.
4. Khoảng cách dọc giữa block: 14–18px (`margin-bottom`).
5. Icon luôn boxicons, kích thước 13–16px, màu z500 (thường) hoặc brand (nhấn).
6. Transition mọi tương tác: `var(--t)` (all .12s ease).
7. Chữ tiếng Việt có dấu: tránh weight 500 cho đoạn dài (dấu nặng hơn Latin) — body 400, nhấn mới 600/700.
8. Trạng thái active/selected: nền `--brand-muted`, chữ `--brand`.
9. Responsive: bảng cho `overflow-x:auto`, card cho `flex-wrap`.

## YÊU CẦU
Tạo màn hình **[MÔ TẢ MÀN HÌNH CỦA BẠN Ở ĐÂY]**, dùng nguyên shell (sidebar + topbar + page), áp dụng đúng toàn bộ spec trên. Trước khi code, liệt kê các component sẽ dùng và map vào class chuẩn ở trên. Không phát minh class/màu mới trừ khi tôi cho phép.
