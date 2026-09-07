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
`.dlg-hd` (badges + title 15px/600 + close). **Rule header dialog module Feedback (E-04, M-04, H-05, H-06, H-07):** header chỉ có **title 1 dòng** (không có `.dlg-sub` hay metadata) → nền hồng nhạt `#fbe4f0` với `border-bottom:1px solid #f3cfe1` (dùng modifier `.dlg-hd--brand`, áp cho `.dlg-hd`, `.dialog-head`, `.review-modal-head` và tương đương). Header có **nhiều dòng** (title + `.dlg-sub`, metadata, người gửi, deadline…) → nền trắng `var(--z0)` với `border-bottom:1px solid var(--z200)` để tránh nhiễu thị giác. Áp dụng cho E-04: pink cho `dlg-give`, `dlg-newreq`, `dlg-queue`, `dlg-received-reader`; white cho `dlg-req`, `dlg-reply`, `dlg-confirm`. Kèm `.dlg-tabs` (tab dialog), `.dlg-body` scroll, `.dlg-foot` (border-top, justify-end).
**Review-confirmation modal:** Trước hành động gửi một yêu cầu, mở overlay dialog theo pattern này; không thay form bằng màn hình riêng. Đóng modal hoặc chọn “Quay lại chỉnh sửa” phải giữ nguyên dữ liệu đã nhập. Footer của modal rà soát dùng action compact `32px / 12px`, padding `12px 18px 16px` để nút không sát mép dưới.
**Popup Tạo mục tiêu:** Loại mục tiêu (select: Mục tiêu Công việc / Mục tiêu Phát triển) · hàng 3 cột (Ưu tiên · Từ ngày · Đến ngày) · Tên mục tiêu (RTE neutral + đếm) · Kết quả cần đạt (RTE neutral) · footer: Lưu nháp (outline) + Gửi quản lý (default).
**Popup Phản hồi đã nhận:** title + badge đếm hồng; các `.fb-card` (avatar, tên + domain, org, ngày; `.fb-qbox` nếu có câu hỏi — **nền hồng #fbe4f0, chữ z900/500** để tương phản rõ; `.fb-body`; `.fb-badges` core value nếu được ghi nhận).
**Popup trả lời yêu cầu từ chương trình HR:** chỉ với request có nguồn HR, metadata header trên desktop dùng grid 2 cột / 2 hàng: hàng 1 `Người yêu cầu` và `Phản hồi về`; hàng 2 `Ngày gửi` và `Hạn phản hồi`. Trên màn hẹp, xếp một cột. Không áp dụng quy tắc này cho popup trả lời yêu cầu của đồng nghiệp hoặc Quản lý; các popup đó giữ metadata linh hoạt. Khối quyền xem phải nêu rõ kết quả hiện tại chỉ HR xem được khi HR chưa chia sẻ; đồng thời highlight `Danh tính người cho phản hồi: Ẩn danh` hoặc `Hiển thị danh tính` theo cấu hình chương trình.

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

**19.0 Metadata separator.** TUYỆT ĐỐI không dùng ký tự middot `·` (U+00B7) ở bất kỳ text UI nào — status, chip, meta, hint, tách metadata. Luôn thay bằng dấu gạch ngang ngắn ` - ` (space-hyphen-space). Ví dụ: "Chưa đóng - sẽ đóng khi chia sẻ", KHÔNG "Chưa đóng · sẽ đóng khi chia sẻ".
1. Chỉ dùng token đã định nghĩa; không hardcode hex (ngoại lệ: header hồng `#fbe4f0`/`#f3cfe1`).
2. Bo góc: card/dialog `--r`(8) · control/badge `--rsm`(6)/`--rxs`(4) · pill/chip tròn 50px.
3. Viền mặc định 1px z200; card nổi z300 + `--sh`.
4. Khoảng cách block: 14–18px. Icon boxicons 13–16px, z500 (thường) / hồng (nhấn). Transition `--t`.
5. Màu chỉ theo 3 ý định (xanh done / hồng action / xám neutral). Active/selected: nền `--brand-muted`, chữ `--brand`.
6. Chữ phụ đọc được: z600/z700, KHÔNG z500/z400. Responsive: bảng `overflow-x:auto`, grid `1fr` khi hẹp. **Form authoring:** tại laptop, giữ page shell đầy đủ nhưng căn giữa bề mặt nhập liệu với `max-width 860px`; chỉ chuyển grid thành `1fr` trước khi content bị co ép.
7. **Feedback direction:** nghĩa phản hồi luôn là `Người cho phản hồi → Người nhận phản hồi`. Khi form đặt người nhận ở bên trái và người cho ở bên phải, dùng tam giác xám đậm hướng sang trái để vẫn phản ánh đúng chiều phản hồi. Review modal phải dùng cùng thứ tự, nhãn rõ cả “Người nhận phản hồi” và “Người cho phản hồi”.
8. **Questionnaire library:** Bộ câu hỏi do HR tạo là tài sản dùng chung: mọi HR member được phân quyền (HRBP và L&OD) đều thấy, dùng và tạo bản sao được MỌI bộ; chỉ owner được sửa/xóa bộ gốc. KHÔNG có khái niệm phạm vi chia sẻ trong UI — không có field "Phạm vi chia sẻ" ở form tạo/sửa, không có cột "Phạm vi" ở bảng, và màn Tạo chương trình KHÔNG lọc bộ câu hỏi theo người tạo. Thư viện (H-05) và màn Tạo chương trình phải đọc CÙNG một nguồn dữ liệu `questionnaire-library-seed.js`; không màn nào được giữ danh sách mẫu riêng. Bảng thư viện có đúng 4 cột: **Tên bộ câu hỏi - Số câu - Người tạo - Chức năng**; cột Chức năng luôn có tiêu đề, rộng đúng bằng 4 ô icon (124px) và tiêu đề gióng thẳng cột với ICON ĐẦU TIÊN của mọi hàng, không canh phải lơ lửng giữa khoảng trống. KHÔNG có nút con mắt "Xem bộ câu hỏi": bấm bất kỳ chỗ nào trên hàng (hàng là `role="button"`, hỗ trợ Enter/Space) sẽ mở popup xem, nên mọi nút trong cột Chức năng phải `event.stopPropagation()`. Cột Chức năng là grid 4 ô cố định 28px theo thứ tự `Dùng bộ này - Tạo bản sao - Chỉnh sửa - Xóa`; hàng không có quyền sửa/xóa chừa hai ô trống (`.icon-slot`, phải `display:block` mới giữ được chỗ) để icon cùng chức năng gióng thẳng một cột giữa các hàng. Người tạo hiển thị `Tên (domain)`, ví dụ `Mai Thị Hằng (hang.mai)`. Popup xem bộ câu hỏi dùng 2 tab `Câu hỏi` và `Lịch sử thay đổi`. Danh sách câu hỏi ở tab `Câu hỏi` là dữ liệu đọc nên dùng card neutral (nền z50, viền z200, nhãn `CÂU HỎI N` z600 uppercase 10.5px, nội dung z900) — KHÔNG dùng nền hồng như `.fb-qbox`; nền hồng chỉ dành cho câu hỏi nằm xen trong nội dung phản hồi, nơi cần tách khỏi phần xung quanh. Trong một popup, hồng chỉ được xuất hiện ở tab đang mở và CTA chính; history log liệt kê từng phiên bản (mới nhất trên cùng, badge `Phiên bản mới nhất` dùng neutral xám `.b-muted`, KHÔNG dùng hồng — popup đã có hồng ở tab active, box câu hỏi và CTA), mỗi phiên bản gồm người thực hiện `Tên (domain)`, ngày và danh sách thay đổi so với phiên bản trước. Mỗi thay đổi phải hiện NỘI DUNG chứ không chỉ nhãn: nhãn hành động (`Sửa nội dung Câu hỏi 3`) + khối `TRƯỚC` (viền trái z300, nền trắng) và `SAU` (viền trái hồng, nền `--brand-muted`). Thêm câu chỉ có `SAU`, xóa câu chỉ có `TRƯỚC`, hành động không có nội dung (tạo mới, tạo bản sao) chỉ có nhãn. KHÔNG dùng đỏ/xanh cho diff — giữ đúng 3 ý định màu. Footer popup xem chỉ chứa hành động, KHÔNG có CTA `Đóng`/`Hủy` (đã có nút `×` và click ngoài overlay): `Chỉnh sửa` (chỉ hiện với bộ của chính mình, cùng điều kiện `canEdit` như nút ở bảng; bấm thì đóng popup xem và mở popup chỉnh sửa) - `Tạo bản sao` - `Dùng bộ này` (primary). Câu hỏi được chọn vào request phải là bản clone, nên mọi chỉnh sửa chỉ áp dụng cho request đó. Cờ bắt buộc là thiết lập của từng câu hỏi, đi theo câu hỏi khi clone vào request; đổi cờ này ghi một dòng history `Đổi thiết lập trả lời Câu hỏi N` với TRƯỚC/SAU là `Bắt buộc trả lời`/`Không bắt buộc`.
9. **Question type & inline validation:** Loại câu hỏi dùng icon có tooltip nền đen chữ trắng, không dùng text action thường trực. Khi submit form thiếu trường bắt buộc, hiển thị lỗi 11.5px ngay bên dưới trường, thêm `aria-invalid` và focus vào lỗi đầu tiên; toast không được là thông báo lỗi duy nhất.
10. **Participant mapping:** Người nhận phản hồi ở trái, người cho phản hồi ở phải, tam giác xám đậm chỉ sang trái để giữ đúng chiều người cho → người nhận. Toggle cá nhân hóa chỉ khả dụng khi đã chọn từ hai người nhận phản hồi.
11. **Context-width form fields:** Thời hạn phản hồi dùng chiều rộng ngữ cảnh `220px` khi đặt cạnh trường dài hơn. Nhóm option cùng hàng phải có chiều cao đều nhau; mô tả phụ tối đa 2 dòng, sau đó clamp. Ở breakpoint hẹp, nhóm trường xếp một cột với khoảng cách 18px.
12. **Chia sẻ kết quả:** CTA panel tổng quan dùng `Chia sẻ toàn bộ kết quả`; CTA của từng người nhận dùng `Chia sẻ kết quả cá nhân`. Cả hai luôn mở dialog xác nhận, không tự chia sẻ ngay. Trường `Chia sẻ đến ai?` cho chọn NHIỀU nhóm (multi-select checkbox, ít nhất một): `Người nhận phản hồi`, `Các cấp quản lý`, `Người khác`. Các option chỉ giữ nhãn chính, không lặp metadata mô tả. `Người khác` dùng combobox người dùng chuẩn M-04 và hiện danh sách khi gõ tên/domain. Cho phép chia sẻ NHIỀU LẦN: mỗi lần cộng dồn người xem và ghi một dòng vào lịch sử chia sẻ (thời gian + nhóm/người được chia sẻ); panel tổng quan KHÔNG hiển thị chữ "Đã chia sẻ kết quả"; chỉ hiển thị link `Lịch sử chia sẻ kết quả` và danh sách `Lần N: [thời gian]`. Bấm link mở popup chi tiết từng lần gồm Thời gian chia sẻ, Người được chia sẻ, Nội dung chia sẻ. Trường `Nội dung chia sẻ` dùng nhãn `Chỉ chia sẻ kết quả tổng hợp bởi AI` và `Chia sẻ kết quả tổng hợp bởi AI và Nội dung chi tiết từng phản hồi`. Yêu cầu đã đóng vẫn MỞ LẠI được miễn là chưa chia sẻ kết quả; sau khi chia sẻ thì chốt vĩnh viễn. Dialog đóng yêu cầu (toàn bộ hoặc theo người nhận) phải nêu rõ: đóng sẽ ngừng thu thập phản hồi, có thể mở lại khi chưa chia sẻ. Chip người đã chọn đứng trên ô tìm kiếm, dùng avatar hồng đậm, nền hồng nhạt và font 12px như picker M-04. Nhãn chuẩn ở form, panel tổng quan và dialog là `Danh tính người cho phản hồi`, kèm dòng dẫn “Cách hiển thị thông tin người cho khi họ cung cấp câu trả lời.”. Hai option theo đúng thứ tự: `Ẩn danh` (“Chỉ hiển thị nội dung phản hồi.”) rồi `Hiển thị danh tính` (“Hiển thị tên người cho kèm nội dung phản hồi.”) — không dùng “Ghi danh”/“Hiện danh tính”. Ghi chú về thông báo và thời điểm hiện báo cáo đặt dưới ô `Lời ngỏ`, không đặt trong nhóm option danh tính. Dialog không dùng CTA Hủy, đóng bằng click ngoài overlay. Status chia sẻ kết quả trong panel tổng quan hiển thị một hàng: chưa chia sẻ gồm status và CTA; đã chia sẻ gồm status và metadata. `Thông tin người cho phản hồi` luôn đứng sau `Phản hồi đang chờ`. Phạm vi chia sẻ và trạng thái thu thập là hai dữ liệu độc lập.
13. **Icon + text cùng hàng (status chip, reminder meta, pending tag, chip nhỏ):** nhóm icon+chữ BẮT BUỘC `display:inline-flex;align-items:center;gap:4px`. TUYỆT ĐỐI không đặt `gap` trên phần tử inline/block thiếu `display:flex|inline-flex` — `gap` sẽ vô tác dụng, icon dính sát chữ. Khi copy component từ màn chuẩn (M-04/E-04) sang màn khác, copy đủ MỌI thuộc tính CSS (gồm `display`), không lược bớt.
14. **Pending / nhắc (chuẩn M-04 `request-detail`), mọi màn chi tiết yêu cầu (M-04, H-06…) phải giống hệt:** label section `.label{font-size:10px;font-weight:600;uppercase;margin:13px 0 7px}` (KHÔNG để label sát box); mỗi người chưa trả lời là 1 card `.pending{display:block;padding:11px 12px;background:var(--warning-muted);border:1px solid var(--warning-border);border-radius:7px}`; trạng thái `.pending-tag` màu `var(--warning)`; nút nhắc từng dòng `.btn-pending-remind` (nền trắng, viền z300, 28px); dòng thông tin nhắc `.reminder-meta{margin-top:7px}` + `.reminder-summary{display:inline-flex;align-items:center;gap:4px}` — hiển thị "Hệ thống sẽ tự động nhắc ngày X" (chưa nhắc) hoặc "Đã nhắc: N lần" + tooltip lịch sử (đã nhắc). Không tự chế kích thước/spacing card khác với M-04.
15. **Trạng thái chương trình:** dùng đúng một vocabulary ở list và detail: `Nháp` / `Đang thu thập` / `Sắp đến hạn` / `Quá hạn` / `Hoàn thành` / `Đã đóng`. `Sắp đến hạn` áp dụng trong ba ngày trước hạn; `Hoàn thành` khi đủ toàn bộ phản hồi; `Đã đóng` khi HR đóng chương trình. List và detail phải đọc cùng helper trạng thái. Nút nhắc ở list phải dùng cùng eligibility/cooldown 24 giờ với H-06, không chỉ hiện toast.


15b. **Nhân sự nghỉ việc trong yêu cầu đang thu thập:** người nhận hoặc người cho phản hồi nghỉ việc giữa kỳ vẫn nằm trong yêu cầu đã tạo, nên mọi màn chi tiết yêu cầu (H-06 của HR và `request-detail` của quản lý) phải gắn tag `Đã nghỉ việc` ngay sau tên người đó: pill `.emp-tag.emp-tag-resigned` — component tag nhân sự DÙNG CHUNG cho mọi màn (danh sách nhân viên của quản lý, chi tiết yêu cầu của HR và của quản lý): `padding:1px 8px`, `border-radius:50px`, `font-size:10px`, viền err-border + nền err-muted + chữ err. Không tự chế chip vuông xám riêng cho từng màn; trạng thái `Nghỉ thai sản` dùng cùng component với biến thể `.emp-tag-maternity` (xanh info) (nền err-muted, viền err-border, chữ err, 10px, bo tròn 50px) ở rail người nhận, ở dòng người chưa trả lời và ở phản hồi đã nhận. Trạng thái đọc từ cờ `resigned` của nhân sự (dữ liệu nhân sự dùng chung hoặc chính bản ghi người trong yêu cầu). Người đã nghỉ việc KHÔNG nhắc được, cả thủ công lẫn tự động: nút `Nhắc` disabled với tooltip `Người cho phản hồi đã nghỉ việc, không gửi nhắc được` và phải NHÌN RA được là đã chặn (`opacity:.45`, nền `--z100`, viền `--z200`, `cursor:not-allowed`, bỏ hover) — không để nút disabled trông y hệt nút bấm được. **Cửa sổ nhắc:** yêu cầu QUÁ HẠN vẫn nhắc được bình thường; nhắc chỉ dừng khi quá 90 ngày kể từ ngày tạo yêu cầu (đúng phạm vi chọn hạn của form) hoặc khi yêu cầu đã đóng, và mỗi người vẫn phải cách lần nhắc gần nhất tối thiểu 24 giờ. Tooltip của nút nhắc bị chặn phải nêu ĐÚNG lý do của dòng đó theo thứ tự: nghỉ việc → yêu cầu đã đóng → quá 90 ngày kể từ ngày tạo → ẩn danh → cooldown 24 giờ; không mặc định đổ cho cooldown, họ bị loại khỏi danh sách của `Nhắc toàn bộ người chưa trả lời`, và dòng meta thay ngày nhắc tự động bằng `Hệ thống dừng nhắc tự động` (không hứa ngày nhắc sẽ không bao giờ chạy). Mọi màn tạo yêu cầu mới (H-05 `create-campaign`, dialog tạo yêu cầu của M-04) KHÔNG cho chọn người đã nghỉ việc ở cả vai trò người nhận lẫn người cho. Trong lúc còn thu thập, lượt phản hồi của người đã nghỉ việc bị LOẠI KHỎI MẪU SỐ tiến độ (cờ `excludedByResignation` do màn hình đặt, model đọc): `0/4` thành `0/2`, trạng thái `Hoàn thành` tính trên phần còn thu được, và dòng trạng thái của họ đổi thành `Ngừng thu thập` (icon `bx-user-x`). Yêu cầu đã đóng giữ nguyên số liệu lịch sử, không loại trừ. Ngưỡng AI Summary vẫn là 2 phản hồi trở lên, chỉ mẫu số thay đổi. Người NHẬN phản hồi nghỉ việc thì vẫn thu tiếp để lưu hồ sơ, nhưng dialog `Chia sẻ kết quả` phải cảnh báo bằng box warning theo cú pháp `[tên người nhận] đã nghỉ việc nên không thể xem kết quả.` Tag trong rail đứng thành dòng riêng dưới dòng tiến độ: `align-self:flex-start` + `margin-top:5px` để pill bo sát chữ và không dính dòng trên. Yêu cầu ẩn danh vẫn giữ ẩn danh — không hiện tên lẫn tag.

15c. **Yêu cầu phản hồi của HR ở màn nhân viên (E-04):** trong hàng đợi `Cần bạn phản hồi`, yêu cầu do HR tạo LUÔN đứng trên mọi yêu cầu khác; trong từng nhóm xếp theo hạn gần nhất trước. Rule này thay cho rule cũ "gấp nhất lên đầu" nên yêu cầu quá hạn của đồng nghiệp có thể nằm dưới yêu cầu HR — vì vậy chip `quá hạn` màu err phải giữ nguyên để vẫn nhận ra được. Viền trái nhấn CHỈ dành cho dòng HR; dòng quá hạn của yêu cầu thường giữ viền xám mặc định, cảnh báo trễ hạn nằm ở chip. Danh sách chỉ ghi `Yêu cầu phản hồi của HR cho [Người nhận]`, KHÔNG nêu tên người HR gửi (chỉ lộ khi mở màn trả lời); dòng HR nhấn bằng avatar chữ `HR` nền brand, nền `--brand-muted` và viền trái hồng 3px — KHÔNG thêm chip `HR` trước tiêu đề vì avatar đã mang chữ đó. Dòng chương trình (metadata dưới tiêu đề) chỉ hiển thị cho yêu cầu HR; yêu cầu của đồng nghiệp chỉ một dòng tiêu đề. Sau khi trả lời, cả bộ câu hỏi gộp thành MỘT card trong `Phản hồi đã cho`: đầu card là nhãn HR + `Yêu cầu phản hồi của HR cho [Người nhận]` + tên chương trình, thân card có dòng `Đã trả lời N/M câu hỏi`, câu hỏi đầu tiên và nút mở rộng tại chỗ để xem các câu còn lại; không tách mỗi câu thành một card. Khi HR đóng yêu cầu mà nhân viên chưa trả lời, hàng đợi hiện MỘT LẦN dòng `Yêu cầu đã đóng, bạn không cần phản hồi` (không có nút trả lời); mở danh sách xong thì đánh dấu đã đọc vào `uc5_e04_closed_notice_seen` và lần sau tự biến mất vì không còn hành động nào.

16. **Tooltip trong bảng:** wrapper bảng KHÔNG được `overflow:hidden` (tooltip hàng đầu/nút cuối sẽ bị cắt mất chữ) — giữ bo góc bằng `border-radius` trên header và row cuối. Tooltip của nhóm nút ở cột Chức năng phải neo mép phải (`right:0;left:auto;transform:translate(0,…)`), không dùng `left:50%` vì tooltip sẽ tràn khỏi bảng.
17. **Review logic hiển thị kèm mọi yêu cầu chỉnh sửa:** khi đổi một rule hiển thị, phải rà lại toàn bộ thành phần phụ thuộc rule đó (cột, filter/tab, nút hành động, field trong form, màn hình khác đọc cùng dữ liệu) và sửa cho nhất quán trong cùng lần, thay vì chỉ sửa đúng chỗ được chỉ ra.


18. **Màn Tạo yêu cầu phản hồi (H-05 `create-campaign`):** trường tên chương trình dùng nhãn `Tên chương trình phản hồi` (không dùng “Mục tiêu”); `Lời ngỏ` là trường BẮT BUỘC với placeholder `Nhập mục tiêu của yêu cầu phản hồi và lời nhắn gửi đến các bên liên quan` và inline error riêng. Chọn bộ câu hỏi dùng POPUP `Chọn bộ câu hỏi có sẵn` (không dùng select, không có dòng metadata dưới tiêu đề): cột trái là danh sách nhóm theo nhóm người tạo `HRBP` rồi `L&OD`, trong mỗi nhóm sắp theo tên A-Z (`localeCompare` locale `vi`); cột phải xem trước thẳng danh sách câu hỏi, KHÔNG lặp lại tên bộ câu hỏi vì cột trái đã hiển thị; CTA `Dùng bộ câu hỏi này` disabled tới khi chọn. Bộ đang áp dụng gắn nhãn `Đang dùng`. Popup có hành động **Tự tạo bộ câu hỏi mới** đặt ở FOOTER bên trái (nút outline, icon `bx-edit-alt`), KHÔNG đặt trong danh sách chọn bên trái: tự tạo là lối thoát khi HR xem xong mà không dùng bộ nào, không phải một bộ câu hỏi để "dùng" — nếu để trong danh sách thì CTA `Dùng bộ câu hỏi này` đọc sai nghĩa. Bấm nút này áp dụng ngay và đóng popup: yêu cầu bắt đầu với một câu hỏi trống, nhãn trigger đổi thành `Tự tạo bộ câu hỏi`. CTA chính `Dùng bộ câu hỏi này` chỉ dành cho bộ có sẵn và vẫn disabled tới khi chọn một bộ. Khi bộ câu hỏi hiện tại vẫn đúng bản clone của bộ đang dùng (HR chưa sửa tay), chọn bộ khác phải NẠP THẲNG, không hỏi xác nhận; chỉ hỏi khi HR đã tự nhập hoặc đã sửa nội dung. Tag `Đang dùng` bo sát text (`display:inline-flex`, padding 2px 7px, không đặt `height`/`line-height` cố định). Modal phải `display:flex;flex-direction:column` trong `max-height 88vh`, body `flex:1;min-height:0`, hai cột tự cuộn — nếu không, bộ câu hỏi dài sẽ đẩy CTA ra khỏi màn hình. Dialog `Lưu vào bộ câu hỏi` không hỏi phạm vi chia sẻ và ghi luôn phiên bản đầu vào history log. Sau khi gửi yêu cầu, KHÔNG nhảy thẳng sang màn chi tiết: mở alert dialog xác nhận (icon tròn `--brand-muted`, title `Đã tạo yêu cầu phản hồi`, nội dung nêu tên chương trình + đã gửi thông báo + báo cáo chỉ hiện sau khi HR chia sẻ) với hai hành động `Về danh sách chương trình` và `Xem chi tiết chương trình`; dialog này không có nút `×` và không đóng bằng click ngoài vì HR phải chọn điểm đến. Popup **Rà soát yêu cầu phản hồi** có ba hành động theo thứ tự `Quay lại chỉnh sửa` - `Lưu nháp` - `Gửi yêu cầu`: `Lưu nháp` ghi chương trình với `status: draft`, `done: 0`, KHÔNG gửi thông báo cho ai, rồi quay về danh sách kèm toast. Yêu cầu nháp mở lại bằng `create-campaign.html?id=<id>`: form nạp lại toàn bộ dữ liệu đã lưu, tiêu đề đổi thành `Tiếp tục thiết lập yêu cầu phản hồi`, lưu lại giữ nguyên id (không sinh chương trình trùng). Nút `Xóa yêu cầu` CHỈ nằm ở màn chi tiết yêu cầu (màn tiếp tục thiết lập), KHÔNG đưa vào danh sách chương trình và KHÔNG thêm cột `Chức năng` cho bảng danh sách. Xóa nháp mẫu ghi id vào `uc5_deleted_campaigns` để danh sách không hiện lại sau khi tải lại. Chỉ ở trạng thái nháp mới hiện nút `Xóa yêu cầu` (btn outline màu err) ở page head, bấm mở dialog xác nhận nêu rõ nháp chưa gửi cho ai và xóa không khôi phục được. **Người tham gia:** chip người đã chọn nằm DƯỚI ô tìm kiếm ở màn này (ngược với dialog chia sẻ kết quả ở mục 12, nơi chip đứng trên ô tìm kiếm) — ở form authoring, ô tìm kiếm là điểm thao tác chính nên phải đứng yên một chỗ, không bị đẩy xuống mỗi lần thêm người. Mỗi câu hỏi có toggle `Bắt buộc` ngay trên hàng tiêu đề câu hỏi, mặc định TẮT như Google Form; câu bắt buộc hiển thị dấu `*` đỏ ở mọi nơi đọc lại câu hỏi (preview chọn bộ câu hỏi, review trước khi gửi, popup xem bộ câu hỏi, màn trả lời E-04, màn kết quả H-06) và KHÔNG dùng hậu tố text “(bắt buộc)”. Người cho phản hồi chỉ bị chặn gửi khi còn câu bắt buộc chưa trả lời, đồng thời phải trả lời ít nhất một câu. Đổi thứ tự câu hỏi bằng KÉO THẢ như Google Form: tay cầm `.q-drag` (icon `bx-grid-vertical`) đứng đầu hàng tiêu đề câu hỏi, card chỉ bật `draggable` khi giữ chuột trên tay cầm (nếu để card luôn draggable thì bôi chọn chữ trong textarea sẽ biến thành kéo card); vị trí thả hiển thị bằng vạch hồng `inset box-shadow` ở mép trên/dưới card đích, card đang kéo `opacity:.5`. Tay cầm là button focus được và nhận phím mũi tên lên/xuống để người dùng bàn phím vẫn đổi được thứ tự. Không dùng nút mũi tên thường trực. Áp dụng cho cả form tạo yêu cầu lẫn editor thư viện bộ câu hỏi.

## 20. NGUYÊN TẮC ĐỒNG BỘ GIỮA CÁC MÀN HÌNH (bắt buộc — đọc trước khi sửa bất kỳ màn nào)

Module Feedback có 5 màn hình đọc chung một nghiệp vụ nhưng phục vụ 3 vai khác nhau
(nhân viên · quản lý · HR). Phần lớn lỗi trong module này không phải lỗi CSS, mà là
**hai màn hình cùng nói về một sự việc bằng hai luật khác nhau** — và không ai phát hiện
vì mỗi màn nhìn riêng thì đều hợp lý. Các rule dưới đây có để chặn đúng loại lỗi đó.

### 20.1 Luật nghiệp vụ chỉ được viết MỘT lần, trong file model

| File model | Sở hữu luật gì | Màn hình dùng |
|---|---|---|
| `E-04/feedback-model.js` | vòng đời yêu cầu nhân viên tự tạo, chuẩn hoá feed | E-04 |
| `M-04/manager-request-model.js` | yêu cầu của quản lý: tạo, tiến độ, nghỉ việc, đóng, nhắc | M-04, `request-detail`, E-04 |
| `H-05/feedback-program-model.js` | chương trình của HR: tạo, tiến độ, chia sẻ kết quả, đóng, nhắc | H-05, H-06, H-07, E-04, M-04 |

- Màn hình **KHÔNG được chép luật vào `<script>` của chính nó**, kể cả khi chỉ vài dòng.
  Bản chép sẽ lệch, và test đọc model nên sẽ xanh trong khi màn hình chạy sai — loại lỗi
  không có cách nào nhìn ra. Cần luật gì thì `<script src>` model đó vào, kể cả khác thư mục.
- Cùng lý do: `dateFromDMY`, `dateTimeFromDMY`, `tsFromDMY`, `maxDueDate`, `dueRange`,
  `automaticReminderDate` là hàm của model, không viết lại trong màn hình.
- Nếu hai vai cần **cùng một luật nhưng khác câu chữ**, tách làm hai: mã lý do dùng chung
  đặt trong model, bảng câu chữ đặt cạnh nhau trong cùng model (xem `CLOSE_REASON_TEXT`
  cho quản lý và `REVIEWER_NOTICE_TEXT` cho người được hỏi). KHÔNG để mỗi màn tự đặt mã.

### 20.2 Một sự việc — một bộ mã — nhiều câu chữ

Mã lý do đóng yêu cầu (`ManagerRequestModel.closeReasonCodes()`) là bộ mã DUY NHẤT.
Đặt tên riêng ở màn khác (`request-closed`, `closed-by-manager`…) là hai màn nói hai thứ tiếng.

| Mã | Khi nào | Quản lý đọc (M-04) | Người được hỏi đọc (E-04) |
|---|---|---|---|
| `creator-resigned` | quản lý tạo yêu cầu đã nghỉ việc | Quản lý tạo yêu cầu đã nghỉ việc | Người tạo yêu cầu đã nghỉ việc… |
| `manual` | quản lý chủ động bấm đóng | Quản lý đã chủ động đóng | Quản lý đã đóng yêu cầu… |
| `no-active-ticket` | không còn ai có thể trả lời | Không còn ai có thể phản hồi | Yêu cầu đã đóng vì không còn ai… |
| `expired` | quá 90 ngày kể từ ngày tạo | Quá 90 ngày kể từ ngày tạo | Yêu cầu đã quá 90 ngày nên tự đóng… |
| `recipient-resigned` | (mức ticket) người nhận nghỉ việc | ghi sau chữ Đóng trên ticket | Người nhận phản hồi đã nghỉ việc… |

### 20.3 Trạng thái: mỗi vai có tập trạng thái riêng, nhưng cùng luật

Ba màn không dùng chung một danh sách trạng thái, và điều đó là **có chủ đích** —
nhân viên không cần biết yêu cầu bị đóng vì lý do gì, HR thì cần. Nhưng luật sinh ra
trạng thái phải giống nhau. Bảng đối chiếu:

| Ý nghĩa | E-04 (nhân viên) | M-04 (quản lý) | H-05/H-06 (HR) |
|---|---|---|---|
| đang thu thập | `collecting` · Đang thu thập | `collecting` · Đang thu thập | `collecting` · Đang thu thập |
| sắp đến hạn | — | — | `due_soon` · Sắp đến hạn |
| quá hạn | `overdue` · Quá hạn | `overdue` · Quá hạn | `overdue` · Quá hạn |
| đủ phản hồi | `complete` · Hoàn thành | `complete` · Hoàn thành | `complete` · Hoàn thành |
| ngừng thu | `no_response` · Không phản hồi | `closed` · Đóng | `closed` · Đã đóng |
| chưa gửi | — | — | `draft` · Nháp |

Quy tắc bắt buộc khi thêm/sửa trạng thái:
- **Đóng có chủ đích thắng Hoàn thành, đóng do hệ quả thì không.** Quản lý bấm đóng hoặc
  người tạo nghỉ việc → luôn hiện Đóng. Hết ticket vì nghỉ việc, hoặc quá 90 ngày → phần
  đã thu đủ vẫn là Hoàn thành. HR đóng chương trình thì `closed` luôn thắng (HR đóng bao
  giờ cũng là chủ đích).
- **Yêu cầu không có người phản hồi nào KHÔNG phải là Hoàn thành.** `[].every()` trả về
  `true` nên phải chốt `reviewers.length > 0` — đây là lỗi từng lọt.
- List và detail của cùng một vai phải gọi CÙNG một helper trạng thái, không tự suy diễn lại.

### 20.4 Tiến độ và mẫu số — luật chung cho cả HR và quản lý

- **Còn đang thu thập:** lượt của người đã nghỉ việc bị LOẠI khỏi mẫu số
  (`excludedByResignation`) để tiến độ phản ánh đúng phần còn thu được.
- **Đã đóng:** số liệu ĐÓNG BĂNG — không loại trừ gì nữa, kể cả người đã nghỉ.
  Cờ chỉ được đặt khi còn thu thập (`collecting && resigned`).
- **Ticket bị khoá khi đóng vẫn nằm trong mẫu số.** Bỏ ra thì yêu cầu đóng lúc mới thu
  được 1/3 sẽ hiện 100% — che mất đúng thứ mà thao tác đóng cần ghi lại. HR khoá bằng
  `status:'locked'`, quản lý khoá bằng `closedManually`; cả hai đều vẫn được đếm.
- Ngưỡng AI Summary luôn là **2 phản hồi trở lên**, chỉ mẫu số thay đổi.

### 20.5 Nhắc — cùng một cửa sổ, cùng một cooldown

Cả HR và quản lý: nhắc được trong **90 ngày kể từ ngày tạo**, quá hạn vẫn nhắc được,
mỗi người cách lần nhắc gần nhất tối thiểu **24 giờ**. Ngừng nhắc khi: người đó đã nghỉ
việc · ticket/yêu cầu đã đóng · quá 90 ngày · chương trình ẩn danh (chỉ HR).
Thứ tự tooltip lý do chặn xem §19 rule 15b.

### 20.6 Mở lại sau khi đóng — luật KHÁC nhau, và phải ghi rõ vì sao

- **HR (H-05/H-06):** mở lại được **chừng nào chưa chia sẻ kết quả**; chia sẻ rồi là chốt
  vĩnh viễn, vì người ngoài đã đọc số liệu đó.
- **Quản lý (M-04):** mở lại được không điều kiện, vì yêu cầu của quản lý không có bước
  chia sẻ kết quả ra ngoài.

Khác nhau ở đây là đúng, không phải chưa đồng bộ. Nếu sau này M-04 có chia sẻ kết quả thì
phải áp luật của HR.

### 20.7 Quy trình bắt buộc khi vẽ hoặc sửa một màn hình

1. **Đọc model trước khi vẽ.** Mở file model sở hữu luật của màn đó, đọc hết, rồi mới thiết kế.
   Không suy luật từ ảnh chụp màn hình khác.
2. **Xử lý conflict, không chép hình.** Khi màn tham chiếu mâu thuẫn với luật (ví dụ model
   cho đúng 1 câu hỏi mà bản mẫu vẽ 3 câu), dừng lại và nêu mâu thuẫn — không vẽ theo hình.
3. **Rà toàn bộ thành phần phụ thuộc trong cùng lần sửa** (§19 rule 17): cột, filter/tab,
   nút hành động, field trong form, và **các màn hình khác đọc cùng dữ liệu**.
4. **Kiểm tra giá trị hợp lệ.** Mọi giá trị enum (`vis`, `status`, `closedReason`, `lvl`…)
   phải nằm trong tập model chấp nhận. Giá trị lạ thường rơi xuống nhánh mặc định và hiển
   thị sai một cách im lặng.
5. **Copy component thì copy đủ thuộc tính** (§19 rule 13), kể cả `display`.
6. **Bug nhìn thấy ở màn này, kiểm tra luôn màn kia.** H-06 và `request-detail` của M-04
   dùng chung cấu trúc; sửa một bên thì kiểm tra bên còn lại.

### 20.8 Test là nơi chốt tính đồng bộ

- Test so sánh CHÉO giữa các màn (M-04 ↔ H-06 ↔ M-01) là có chủ đích: chúng chặn drift.
- **Không assert vào chuỗi mã nguồn của một bản chép.** Nếu hai màn dùng chung model,
  hãy kiểm tra **hành vi** qua model; bắt hai màn viết giống hệt một dòng mã sẽ chặn đúng
  việc gom về một nguồn.
- Khi xoá một rule CSS/JS cũ, xoá luôn assertion của nó. Rule chỉ bị đè chứ không bị xoá
  sẽ khiến test xanh trong khi giao diện đã đổi.

## YÊU CẦU
Tạo màn hình **[MÔ TẢ MÀN HÌNH]**, dùng nguyên shell (sidebar + topbar + page), áp dụng đúng toàn bộ spec + triết lý tối giản. Trước khi code, liệt kê component sẽ dùng và map vào class chuẩn. Không phát minh class/màu mới trừ khi được cho phép. Đối chiếu `design-system/index.html` để chắc render đúng.
