# DESIGN SYSTEM — COMPONENTS (tầng 2, đọc theo mục khi cần)

> Tách từ `DESIGN-SYSTEM.md`, giữ nguyên nội dung và số mục §5 đến §18b.
> Tầng lõi (triết lý, tokens, layout, typography, §19 quy tắc chung, §20 đồng bộ) ở `../DESIGN-SYSTEM.md`, phiên nào cũng đọc.
> Chỉ đọc mục cần dùng: tìm tiêu đề `## <số mục>.` rồi đọc đúng đoạn đó, không đọc cả file.

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
- **Toast** `#toast`/`.toast-static`: nền z900, chữ trắng, icon xanh `var(--ok)` khi thành công (trên nền z900 đạt tương phản khoảng 5.4:1, đủ cho icon; không dùng mã xanh sáng riêng như `#4ade80`).

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

