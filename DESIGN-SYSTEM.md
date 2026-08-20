# DESIGN SYSTEM SPEC — MoMo HRM / PMS (v2 — tối giản)

> Nguồn chân lý TRỰC QUAN: `design-system/index.html` (Design System Showcase). Mở file này để xem mọi token + component render thật.
> Khi tạo màn hình mới: paste toàn bộ spec dưới đây vào đầu hội thoại. Mọi màn phải đồng nhất 100% với showcase.

---

Bạn sẽ tạo một màn hình HTML prototype mới cho hệ thống PMS (MoMo HRM). BẮT BUỘC tuân thủ chính xác design system dưới đây. Không tự chế token/màu/class mới; chỉ dùng đúng các giá trị bên dưới.

## 0. TRIẾT LÝ TỐI GIẢN (đọc trước, áp dụng xuyên suốt)
1. **Một accent duy nhất:** hồng MoMo `--brand` #A50064. Nền/chữ dùng zinc scale (xám). KHÔNG thêm màu trang trí thứ 2.
2. **Màu = ý nghĩa, không trang trí.** Chỉ 3 nhóm màu trạng thái:
   - **Xanh lá** (`--ok`) → chỉ cho "Hoàn thành / Đã duyệt".
   - **Hồng** (`--brand`) → việc cần hành động / cần chú ý.
   - **Xám** (zinc) → thông báo, trung tính, không gây rối.
3. **Ít màu để user focus vào việc cần làm.** Nội dung chỉ mang tính thông báo → xám, không highlight.
4. **Tương phản chữ rõ:** chữ chính `--z900`; chữ phụ đọc được dùng `--z600`/`--z700` (KHÔNG dùng `--z500`/`--z400` cho đoạn cần đọc). `--z500` trở xuống chỉ cho eyebrow label nhỏ.
5. Bề mặt phẳng, viền 1px, shadow nhẹ. Phân cấp bằng khoảng trắng + weight, không bằng màu.
6. Mọi element interactive đủ state: hover / focus / disabled / error.

## 1. Stack & nền tảng
- Single-file HTML: CSS trong `<style>`, JS vanilla trong `<script>`. Không framework.
- Font: **Public Sans** (300;400;500;600;700) qua Google Fonts.
- Icon: **Boxicons 2.1.4** (`<i class="bx bx-...">`).
- `<html lang="vi">`, `html{font-size:14px}`, `body{font-family:'Public Sans',sans-serif;font-size:14px;line-height:1.5;color:var(--z700);background:var(--z50);-webkit-font-smoothing:antialiased}`.
- Reset: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}`. Scrollbar mảnh 4px, thumb `--z300`.
- Tiếng Việt có dấu: body 400, chỉ nhấn mới 600/700 (dấu nặng hơn Latin).

## 2. TOKENS — dán nguyên khối `:root`, KHÔNG sửa giá trị
```css
:root{
  /* Zinc scale (shadcn) */
  --z0:#ffffff;--z50:#fafafa;--z100:#f4f4f5;--z200:#e4e4e7;--z300:#d4d4d8;
  --z400:#a1a1aa;--z500:#71717a;--z600:#52525b;--z700:#3f3f46;--z800:#27272a;--z900:#18181b;--z950:#09090b;
  /* MoMo pink — accent only */
  --brand:#A50064;--brand-h:#8B0055;--brand-fg:#ffffff;
  --brand-muted:rgba(165,0,100,.07);--brand-ring:rgba(165,0,100,.2);
  /* Semantic — chỉ xanh lá "done" còn dùng màu riêng; các loại khác quy về hồng/xám */
  --ok:#16a34a;--ok-bg:#f0fdf4;--ok-bd:#bbf7d0;
  /* Spacing/shape */
  --sw:232px;--nh:52px;--r:8px;--rsm:6px;--rxs:4px;
  --sh-sm:0 1px 2px rgba(0,0,0,.04);
  --sh:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --sh-md:0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.03);
  --sh-lg:0 8px 30px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.04);
  --t:all .12s ease;
  /* Header hồng nhạt (ngoại lệ hardcode duy nhất) */
  /* #fbe4f0 nền · #f3cfe1 viền */
}
```
**Quy tắc màu:** Pink `--brand` chỉ dùng làm accent (active, nút chính, icon nhấn, action cần chú ý). Nền/chữ dùng zinc. Chữ nội dung chính `--z900`, chữ phụ `--z600`, eyebrow label `--z500`.

## 3. LAYOUT SHELL (mọi màn giữ nguyên)
- `.app{display:flex;min-height:100vh}`
- Sidebar trái cố định `--sw`(232px): brand (logo hồng 26px bo 6px + "MoMo HRM"), role switch, nav nhóm (`.sb-grp` uppercase 11px), footer user.
- `.workspace{margin-left:var(--sw);flex:1}`. Topbar sticky `--nh`(52px). `.page{padding:20px 24px}`.
- Avatar `.av`: tròn 28px; `.av-brand{background:var(--brand-muted);color:var(--brand)}`; biến thể `.av-sm`24px `.av-xs`20px; chữ 700.

## 4. TYPOGRAPHY
- Page title: 18px/700 z900, letter-spacing -.4px.
- Dialog title: 15px/600 z900. Card/section title: 13px/700 z900.
- Section label/eyebrow: 11px/600 uppercase .5px z500.
- Body: 13–13.5px z700/z900. Meta phụ (đọc được): 12px **z600** (không dùng z500).

## 5. EMPLOYEE CHIP (header phải)
```html
<div class="emp-chip"><!-- viền z200, bo --r, padding 9px 13px, bg z0 -->
  <div class="av av-brand av-xs">NT</div>
  <div class="ec-info"><!-- gap 2px -->
    <div class="ec-line"><span class="ec-lbl">Nhân viên:</span> Nguyễn Văn Tú <span class="ec-dom">(tu.nguyen)</span></div>
    <div class="ec-line"><span class="ec-lbl">Team:</span> ITC - Backend</div>
    <div class="ec-line"><span class="ec-lbl">Quản lý trực tiếp:</span> Lê Thị Thanh <span class="ec-dom">(thanh.le)</span></div>
  </div>
</div>
```
`.ec-line{font-size:12px;color:var(--z800)}` · `.ec-lbl{color:var(--z600);font-weight:500}` · `.ec-dom{color:var(--z600)}`. Dòng Team chỉ "DIV - TEAM" (gạch nối `-`, không kèm chức danh).

## 6. LOẠI MỤC TIÊU (goal type) — 3 loại, CÙNG MÀU HỒNG
Tên + icon CHUẨN (dùng nhất quán mọi nơi: badge, bảng, card, dialog):
| Loại | Nhãn | Icon |
|------|------|------|
| What | **Công việc** | `bx-target-lock` |
| Dev  | **Phát triển** | `bx-line-chart` |
| How  | **Hành vi**    | `bx-heart` |

Badge cả 3 loại cùng style hồng (KHÔNG mỗi loại một màu):
```css
.b-what,.b-dev,.b-how{color:var(--brand);background:var(--brand-muted);border-color:var(--brand)}
```

## 7. BADGES, PRIO, EVAL CHIP — theo 3 ý định tối giản
```css
.badge{display:inline-flex;align-items:center;padding:1px 7px;height:20px;border-radius:var(--rxs);font-size:11px;font-weight:500;border:1px solid;white-space:nowrap;letter-spacing:.1px}
/* DONE = xanh lá */
.b-ok{color:var(--ok);background:transparent;border-color:var(--ok)}                 /* Đã duyệt */
.b-done{color:var(--ok);background:var(--ok-bg);border-color:var(--ok-bd);gap:3px}   /* Hoàn thành (icon check) */
/* ACTION-NEEDED = hồng */
.b-action{color:var(--brand);background:var(--brand-muted);border-color:var(--brand)} /* Cần hành động */
.b-warn{color:var(--brand);background:var(--brand-muted);border-color:var(--brand-ring)} /* Cần cập nhật (hồng nhạt) */
.b-err{color:var(--brand);background:transparent;border-color:var(--brand)}            /* Từ chối (hồng viền) */
/* NEUTRAL/INFO = xám */
.b-info,.b-upd,.b-muted{color:var(--z600);background:var(--z100);border-color:var(--z200)} /* Nháp / thông báo */
```
**Prio pills — KHÔNG có icon tam giác:**
```css
.prio{display:inline-flex;align-items:center;height:20px;padding:1px 7px;border-radius:var(--rxs);font-size:11px;font-weight:500}
.prio-h{background:var(--z200);color:var(--z900);font-weight:600}  /* Cao — chỉ chữ, không icon */
.prio-m{background:var(--z100);color:var(--z600)}                 /* Trung bình */
.prio-l{background:transparent;color:var(--z400)}                /* Thấp */
```
Eval chip: `.eval-done` (xanh outline) · `.eval-wait` (xám) · `.eval-revise` (hồng outline).
Eval pair NV·QL (điểm nhân viên · quản lý): pill xám `.eval-pair` (bg z100, viền z200), KHÔNG dùng sao/màu.

## 8. CORE VALUE BADGES — 5 giá trị cốt lõi MoMo
- Dùng ảnh linh vật trong `Core value with BG/` — **icon-only** (tròn 54px), tên hiện khi hover (tooltip xám đậm z800).
- Mapping ảnh → tên: `Innovation.png`→Đổi mới · `Teamwork.png`→Tinh thần đồng đội · `Constant_.png`→Không ngừng học hỏi · `Customer_.png`→Khách hàng là trung tâm · `Excellence.png`→Thực thi xuất sắc.
```html
<span class="cv-item"><img class="cv-img" src=".../Innovation.png" alt="Đổi mới"/><span class="cv-tip">Đổi mới</span></span>
```
Khi đính kèm vào phản hồi (fb-badges): huy hiệu tròn 34px + hover tên.

## 8.1 TOOLTIP — component dùng chung toàn PMS
- Tooltip chứa thông tin nghiệp vụ phải do prototype tự render; **không dùng tooltip mặc định của trình duyệt** (`title`) cho tên nhân viên, cơ cấu tổ chức, huy hiệu, quyền xem hoặc trạng thái nghiệp vụ.
- Visual: nền `--z900`, chữ trắng, font `12px/1.4`, weight `500`, padding `5px 9px`, bo góc `6px`.
- Hiển thị khi hover và khi focus bằng bàn phím. Trigger dùng `tabindex="0"`; nội dung dùng `role="tooltip"`.
- Nội dung ngắn, không lặp thông tin đang nhìn thấy. Với tên nhân viên trong header Split View: `Phòng ban - Vị trí`.
- Tooltip mặc định/`title` chỉ được giữ cho icon tiện ích đơn giản khi đã có `aria-label` tương ứng; không dùng để chứa dữ liệu nhân sự.
```html
<span class="pms-tooltip" tabindex="0">
  Nguyễn Văn Tú
  <span class="pms-tooltip-content" role="tooltip">ITC - Senior Engineer</span>
</span>
```

## 8.2 FEEDBACK STATUS — semantic mapping bắt buộc
- Áp dụng cùng một mapping trên toàn bộ module Feedback: màn hình nhân viên, màn hình quản lý, feed, popup, bảng, Kanban và panel chi tiết. Không tự đổi màu hoặc kiểu hiển thị theo từng màn hình.
- **Đang thu thập / Chưa trả lời:** vàng cảnh báo (`#d97706`, nền `#fffbeb`, viền `#fde68a`). Trong danh sách người cần trả lời, card dùng nền + viền vàng; trạng thái cạnh tên chỉ là icon + text vàng, không thêm nền/viền lần hai.
- **Quá hạn:** đỏ (`#dc2626`, nền `#fef2f2`, viền `#fecaca`). Không dùng vàng hoặc xám cho trạng thái quá hạn.
- **Hoàn thành / Đã trả lời:** xanh lá (`--ok`, `--ok-bg`, `--ok-bd`).
- **Không phản hồi:** xám trung tính (`--z600`, `--z100`, `--z300`) vì ticket đã khóa và không còn hành động.
- **Câu hỏi của người chưa trả lời:** nền trắng, viền vàng cảnh báo, label “Câu hỏi” màu `--z500`. Câu hỏi đã có phản hồi tiếp tục dùng nền hồng theo pattern feedback hiện hành.
- Status trong popup chi tiết người trả lời dùng icon + text, không dùng chip có nền/viền. Status tổng quan ticket, bảng và Kanban có thể dùng chip nhưng phải giữ đúng semantic mapping trên.

## 9. BUTTONS (shadcn variants)
```css
.btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:var(--rsm);font-size:13px;font-weight:500;border:1px solid transparent;line-height:1.4;white-space:nowrap;transition:var(--t)}
.btn-default{background:var(--brand);border-color:var(--brand);color:#fff}      /* hover --brand-h — NÚT CHÍNH, 1/khu vực */
.btn-cta-outline{background:var(--z0);border-color:var(--brand);color:var(--brand);font-weight:600} /* action quan trọng cần nhấn */
.btn-secondary{background:var(--z100);border-color:var(--z200);color:var(--z700)}
.btn-outline{background:var(--z0);border-color:var(--z200);color:var(--z700)}
.btn-ghost{background:transparent;border-color:transparent;color:var(--z600)}
.btn-destructive{background:transparent;border-color:var(--err-bd);color:var(--err)}
.btn-sm{padding:4px 10px;font-size:12.5px}  .btn-xs{padding:2px 8px;font-size:11.5px}
/* DISABLED = xám, KHÔNG nền hồng */
.btn:disabled,.btn-default:disabled{background:var(--z100);border-color:var(--z200);color:var(--z400);cursor:not-allowed}
```
Chỉ nút chính/action quan trọng dùng hồng. Secondary/outline/ghost/disabled = xám, không gây rối. Luôn kèm icon boxicons.

## 10. TABS (in-page) — enclosed chip, rõ ràng
Mỗi tab là 1 chip THẤY RÕ (không phải text trơn). Tab active tô nền hồng nhạt + viền hồng + gạch hồng dày phía trên + icon; inactive chip trắng viền z300; disabled viền đứt nét.
```css
.tabs{display:flex;gap:6px;border-bottom:2px solid var(--z200);margin-bottom:16px}
.tab-btn{padding:9px 16px;font-size:13px;font-weight:500;color:var(--z600);border:1px solid var(--z300);background:var(--z0);margin-bottom:-2px;display:flex;align-items:center;gap:6px;border-radius:var(--rsm) var(--rsm) 0 0;transition:var(--t)}
.tab-btn i{font-size:15px}
.tab-btn:not(.disabled):not(.on):hover{color:var(--z900);background:var(--z100);border-color:var(--z400)}
.tab-btn.on{color:var(--brand);background:var(--brand-muted);border-color:var(--brand-ring);border-bottom-color:var(--brand-muted);font-weight:700;box-shadow:inset 0 3px 0 var(--brand)}
.tab-btn.disabled{color:var(--z400);background:var(--z50);border-style:dashed;cursor:not-allowed}
.tab-cnt{padding:0 5px;height:16px;line-height:16px;border-radius:var(--rxs);font-size:10px;font-weight:700;background:var(--z200);color:var(--z600)}
.tab-btn.on .tab-cnt{background:var(--z0);color:var(--brand)}
```
**Tên tab chu kỳ chuẩn:** Mục tiêu · **Đánh giá giữa năm** (MYR) · **Đánh giá cuối năm** (YER) · **Hiệu chuẩn** (Calibration). (Không dùng "giữa kỳ/cuối kỳ/hiệu chỉnh".)
View switcher (Bảng/Lưới) = `.view-sw` segmented control.

## 11. TABLE — thứ tự cột chuẩn
Cột theo đúng thứ tự: **Loại mục tiêu · Tên mục tiêu · Kết quả cần đạt · Mức độ ưu tiên · Thời gian · Trạng thái · Chức năng**.
```css
.gtable th{text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:var(--z500);background:var(--brand-muted);padding:10px 12px;border-bottom:1px solid var(--brand-ring)}
.gtable td{padding:11px 12px;border-bottom:1px solid var(--z200);vertical-align:top;color:var(--z900);font-size:13px;font-weight:500;line-height:1.45}
.gtable tbody tr:hover{background:var(--z50)}
```
- Loại: `.gt-type` = icon hồng + nhãn (Công việc/Phát triển/Hành vi). Kết quả: `.gt-result` clamp 2 dòng. Thời gian: dạng "01/01 – 31/12".
- Chức năng: nút ô vuông 27px `.gt-actbtn` (bx-show / bx-check-square / bx-edit-alt), hover bg z100.
- Wrapper `.gtable-wrap`: viền z300 + `--sh` + bo `--r`.

## 12. CARDS & GRID 3 CỘT (Mục tiêu)
`.goal-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;align-items:start}` → 3 cột: **Mục tiêu công việc** (target-lock, đếm) · **Mục tiêu phát triển** (line-chart) · **Mục tiêu hành vi** (heart).
- Card `.goal-col`: viền z300 + `--sh` + bo `--r`.
- Header cột `.col-hd`: nền hồng nhạt `#fbe4f0`, viền dưới `#f3cfe1`, icon hồng 16px, title 13px/700 z900, count badge phải.
- Cột Công việc/Phát triển: item `.goal-item` (title + badge trạng thái + prio + thời gian). Footer `.col-add-btn` "+ Thêm..." + `.col-note` (11px z600) nhắc điều kiện.
- Cột Hành vi: list `.how-item` = 5 giá trị cốt lõi (tên + chevron phải), KHÔNG badge; `.col-note` giải thích.

## 13. INFO / GUIDE BOX
- Guide box `.guide-box`: nền z50, viền z200. Info + quy trình (`.proc-step` pill + `.proc-num` tròn 20px). `strong` = hồng.
- Banner nhấn `.edit-banner`: nền `--brand-muted`, viền `--brand-ring`.
- Info-note nhẹ `.info-note`: chữ z600, icon đầu dòng hồng 15px, `strong` z700.

## 14. FORM CONTROLS
- Input/select/textarea `.fc`: viền z200, bo rsm, 13.5px z900, focus `border-color:var(--brand);outline:2px solid var(--brand-ring)`. Select mũi tên SVG `%23a1a1aa`.
- Label `.flbl` 12.5px/500 z700. **Mọi trường người dùng bắt buộc nhập/chọn phải có dấu `*` đỏ (`.req`) ngay sau tên field; không dùng hậu tố “(bắt buộc)” hoặc “(bắt buộc chọn)”.** Trường tùy chọn không có dấu sao. Hint `.fhint` z600. Error `.fc.err` viền err + `.ferr`.
- **Type segment** `.type-seg`: 2 lựa chọn **Công việc / Phát triển**, chấm `.ts-dot` HỒNG cả 2 (tối giản, không màu khác nhau), active chữ hồng.
- Toggle `.demo-toggle` (accent hồng). Checkbox `accent-color:var(--brand)`.
- Date: input `mm/dd/yyyy` + icon `bx-calendar` bên phải (`.date-input`).

## 15. RICH-TEXT EDITOR — 2 dạng
**(A) Neutral `.rte-wrap`** (dùng cho tạo/nhập mục tiêu): viền XÁM z200, focus ring hồng. Toolbar: B / I / U / màu chữ (A + gạch hồng) / list / link. **KHÔNG có dropdown Normal/Heading.** `.rte-body` placeholder z400 + đếm ký tự "0 / 1000".

**(B) Evaluation `.ev-editor-wrap`** (ô nhận xét NV & Quản lý): viền hồng `--brand-ring` + cạnh trái nhấn 3px `inset box-shadow` hồng (2 sắc: nhạt ở toolbar, đậm ở nội dung). Nền nội dung trong suốt, `padding-left:11px`.
- **Editable & Locked dùng CÙNG viền hồng.** Trạng thái **locked/chỉ xem: BỎ toolbar format** (chỉ hiện nội dung), không làm mờ nội dung.
- Không hardcode màu; không phủ pseudo-element toàn cạnh trái; không đặt nền trắng trên `.ev-content`.

## 16. DIALOG / MODAL / POPUP
```css
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);display:none;align-items:center;justify-content:center;padding:16px;z-index:1000}
.overlay.open{display:flex}
.dialog{background:var(--z0);border-radius:var(--r);border:1px solid var(--z200);max-width:560px;max-height:90vh;display:flex;flex-direction:column;box-shadow:var(--sh-lg)}
```
`.dlg-hd` (badges + title 15px/600 + close), `.dlg-tabs` (tab dialog), `.dlg-body` scroll, `.dlg-foot` (border-top, justify-end).
**Review-confirmation modal:** Trước hành động gửi một yêu cầu, mở overlay dialog theo pattern này; không thay form bằng màn hình riêng. Đóng modal hoặc chọn “Quay lại chỉnh sửa” phải giữ nguyên dữ liệu đã nhập. Footer của modal rà soát dùng action compact `32px / 12px`, padding `12px 18px 16px` để nút không sát mép dưới.
**Popup Tạo mục tiêu:** Loại mục tiêu (select: Mục tiêu Công việc / Mục tiêu Phát triển) · hàng 3 cột (Ưu tiên · Từ ngày · Đến ngày) · Tên mục tiêu (RTE neutral + đếm) · Kết quả cần đạt (RTE neutral) · footer: Lưu nháp (outline) + Gửi quản lý (default).
**Popup Phản hồi đã nhận:** title + badge đếm hồng; các `.fb-card` (avatar, tên + domain, org, ngày; `.fb-qbox` nếu có câu hỏi — **nền hồng #fbe4f0, chữ z900/500** để tương phản rõ; `.fb-body`; `.fb-badges` core value nếu được ghi nhận).

## 17. TIMELINE · STEPPER · TOAST
- **Timeline** `.tl`: dấu chấm CHỈ XÁM `--z400` (không tô nhiều màu). `.tl-ev` z800, `.tl-who` z600, `.tl-note` nền z50.
- **Stepper** `.stepper-card`: các bước dạng mô tả theo deadline. Vòng tròn: **active (đang mở) = hồng**; **hết deadline = xám z300** (KHÔNG xanh lá); tương lai = z200. Dùng SỐ, không dùng checkmark.
- **Toast** `#toast`/`.toast-static`: nền z900, chữ trắng, icon xanh khi thành công.

## 18. COMPONENT BỔ SUNG (chuẩn shadcn/Linear tối giản)
- **Breadcrumb** `.breadcrumb`: link z600 → hover hồng, separator z400, trang hiện tại z900/600.
- **Search / input icon** `.search-box`: icon trái z400, focus ring hồng.
- **Dropdown menu** `.menu-static`: viền z200 + shadow, item hover z100, mục nguy hiểm màu hồng.
- **Tooltip** `.tip-static`: nền **xám đậm z800** (không đen tuyền), chữ trắng, mũi tên.
- **Empty state** `.empty-state`: viền đứt z300 nền z50, icon 34px z400, title z700, sub z600, CTA.
- **Skeleton** `.skeleton`: gradient z100→z200 chạy.
- **Pagination** `.pagination`: nút `.pg-btn` viền z200, active nền hồng, disabled z300.

## 18b. COMPONENT NÂNG CAO
- **Sheet / Drawer** `.sheet`: panel trượt từ phải (width 340px), viền trái + `--sh-lg`, có scrim mờ. Header (title + close) · body scroll · footer justify-end. Dùng xem chi tiết mà không rời bảng.
- **Alert dialog** `.alert-dlg` (max 400px): icon tròn (brand-muted) + title 15px + body z600 + 2 nút (Hủy outline + hành động). Xóa/nguy hiểm mới dùng `.btn-destructive`.
- **Date picker** `.cal`: lịch tháng, header (tháng + nav), 7 cột T2–CN. Ngày: `.today` viền brand-ring, `.sel` nền brand, `.in-range` nền brand-muted, `.muted` z300.
- **Combobox** `.combo`: select có search — input (icon search) + `.combo-list` dropdown; option hover/`.active` nền z100, `.sel` chữ hồng + check.
- **Chart** `.chart`: bar chart phân bố điểm — cột `.bar` hồng, cột phụ `.bar.muted` xám; trục dưới z200. Giữ đơn sắc hồng+xám, KHÔNG cầu vồng.
- **Accordion** `.accordion`: item gập/mở, header chevron xoay + chữ hồng khi mở (`.acc-item.open`); body max-height transition. JS toggle class `.open` (`[data-acc]`).

## 19. QUY TẮC CHUNG (bắt buộc)
**Metadata separator:** TUYỆT ĐỐI không dùng ký tự middot `·` (U+00B7) ở bất kỳ text UI nào — status, chip, meta, hint, tách metadata. Luôn thay bằng dấu gạch ngang ngắn ` - ` (space-hyphen-space). Ví dụ: "Chưa đóng - sẽ đóng khi chia sẻ", KHÔNG "Chưa đóng · sẽ đóng khi chia sẻ".
1. Chỉ dùng token đã định nghĩa; không hardcode hex (ngoại lệ: header hồng `#fbe4f0`/`#f3cfe1`).
2. Bo góc: card/dialog `--r`(8) · control/badge `--rsm`(6)/`--rxs`(4) · pill/chip tròn 50px.
3. Viền mặc định 1px z200; card nổi z300 + `--sh`.
4. Khoảng cách block: 14–18px. Icon boxicons 13–16px, z500 (thường) / hồng (nhấn). Transition `--t`.
5. Màu chỉ theo 3 ý định (xanh done / hồng action / xám neutral). Active/selected: nền `--brand-muted`, chữ `--brand`.
6. Chữ phụ đọc được: z600/z700, KHÔNG z500/z400. Responsive: bảng `overflow-x:auto`, grid `1fr` khi hẹp. **Form authoring:** tại laptop, giữ page shell đầy đủ nhưng căn giữa bề mặt nhập liệu với `max-width 860px`; chỉ chuyển grid thành `1fr` trước khi content bị co ép.
7. **Feedback direction:** nghĩa phản hồi luôn là `Người cho phản hồi → Người nhận phản hồi`. Khi form đặt người nhận ở bên trái và người cho ở bên phải, dùng tam giác xám đậm hướng sang trái để vẫn phản ánh đúng chiều phản hồi. Review modal phải dùng cùng thứ tự, nhãn rõ cả “Người nhận phản hồi” và “Người cho phản hồi”.
8. **Questionnaire library:** Template có owner và phạm vi `personal`, `all_hr` hoặc `selected_hr`. Người được chia sẻ chỉ được dùng hoặc tạo bản sao; chỉ owner được sửa/xóa mẫu gốc. Câu hỏi được chọn vào request phải là bản clone, nên mọi chỉnh sửa chỉ áp dụng cho request đó.
9. **Question type & inline validation:** Loại câu hỏi dùng icon có tooltip nền đen chữ trắng, không dùng text action thường trực. Khi submit form thiếu trường bắt buộc, hiển thị lỗi 11.5px ngay bên dưới trường, thêm `aria-invalid` và focus vào lỗi đầu tiên; toast không được là thông báo lỗi duy nhất.
10. **Participant mapping:** Người nhận phản hồi ở trái, người cho phản hồi ở phải, tam giác xám đậm chỉ sang trái để giữ đúng chiều người cho → người nhận. Toggle cá nhân hóa chỉ khả dụng khi đã chọn từ hai người nhận phản hồi.
11. **Context-width form fields:** Thời hạn phản hồi dùng chiều rộng ngữ cảnh `220px` khi đặt cạnh trường dài hơn. Nhóm option cùng hàng phải có chiều cao đều nhau; mô tả phụ tối đa 2 dòng, sau đó clamp. Ở breakpoint hẹp, nhóm trường xếp một cột với khoảng cách 18px.
12. **Chia sẻ kết quả:** CTA panel tổng quan dùng `Chia sẻ toàn bộ kết quả`; CTA của từng người nhận dùng `Chia sẻ kết quả cá nhân`. Cả hai luôn mở dialog xác nhận, không tự chia sẻ ngay. Bắt buộc chọn một phạm vi: `Người nhận phản hồi và các cấp quản lý của họ`, `Chỉ các cấp quản lý của người nhận`, hoặc `Người cụ thể`. Các option chỉ giữ nhãn chính, không lặp metadata mô tả. `Người cụ thể` dùng combobox người dùng chuẩn M-04 và hiện danh sách khi gõ tên/domain. Chip người đã chọn đứng trên ô tìm kiếm, dùng avatar hồng đậm, nền hồng nhạt và font 12px như picker M-04. Nhãn chuẩn ở form, panel tổng quan và dialog là `Thông tin người cho phản hồi`: ghi danh hiển thị “Hiển thị tên người cho phản hồi cùng nội dung.”, ẩn danh hiển thị “Chỉ hiển thị nội dung phản hồi.” Dialog không dùng CTA Hủy, đóng bằng click ngoài overlay. Status chia sẻ kết quả trong panel tổng quan hiển thị một hàng: chưa chia sẻ gồm status và CTA; đã chia sẻ gồm status và metadata. `Thông tin người cho phản hồi` luôn đứng sau `Phản hồi đang chờ`. Phạm vi chia sẻ và trạng thái thu thập là hai dữ liệu độc lập.
13. **Icon + text cùng hàng (status chip, reminder meta, pending tag, chip nhỏ):** nhóm icon+chữ BẮT BUỘC `display:inline-flex;align-items:center;gap:4px`. TUYỆT ĐỐI không đặt `gap` trên phần tử inline/block thiếu `display:flex|inline-flex` — `gap` sẽ vô tác dụng, icon dính sát chữ. Khi copy component từ màn chuẩn (M-04/E-04) sang màn khác, copy đủ MỌI thuộc tính CSS (gồm `display`), không lược bớt.
14. **Pending / nhắc (chuẩn M-04 `request-detail`), mọi màn chi tiết yêu cầu (M-04, H-06…) phải giống hệt:** label section `.label{font-size:10px;font-weight:600;uppercase;margin:13px 0 7px}` (KHÔNG để label sát box); mỗi người chưa trả lời là 1 card `.pending{display:block;padding:11px 12px;background:var(--warning-muted);border:1px solid var(--warning-border);border-radius:7px}`; trạng thái `.pending-tag` màu `var(--warning)`; nút nhắc từng dòng `.btn-pending-remind` (nền trắng, viền z300, 28px); dòng thông tin nhắc `.reminder-meta{margin-top:7px}` + `.reminder-summary{display:inline-flex;align-items:center;gap:4px}` — hiển thị "Hệ thống sẽ tự động nhắc ngày X" (chưa nhắc) hoặc "Đã nhắc: N lần" + tooltip lịch sử (đã nhắc). Không tự chế kích thước/spacing card khác với M-04.
15. **Trạng thái chương trình:** dùng đúng một vocabulary ở list và detail: `Nháp` / `Đang thu thập` / `Sắp đến hạn` / `Quá hạn` / `Hoàn thành` / `Đã đóng`. `Sắp đến hạn` áp dụng trong ba ngày trước hạn; `Hoàn thành` khi đủ toàn bộ phản hồi; `Đã đóng` khi HR đóng chương trình. List và detail phải đọc cùng helper trạng thái. Nút nhắc ở list phải dùng cùng eligibility/cooldown 24 giờ với H-06, không chỉ hiện toast.

## YÊU CẦU
Tạo màn hình **[MÔ TẢ MÀN HÌNH]**, dùng nguyên shell (sidebar + topbar + page), áp dụng đúng toàn bộ spec + triết lý tối giản. Trước khi code, liệt kê component sẽ dùng và map vào class chuẩn. Không phát minh class/màu mới trừ khi được cho phép. Đối chiếu `design-system/index.html` để chắc render đúng.
