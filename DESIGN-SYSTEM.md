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
- Single-file HTML: CSS trong `<style>`, JS vanilla trong `<script>`. Không framework. Ngoại lệ duy nhất cho CSS: tokens nạp từ `assets/tokens.css` (§2).
- Font: **Public Sans** (300;400;500;600;700) qua Google Fonts.
- Icon: **Boxicons 2.1.4** (`<i class="bx bx-...">`).
- `<html lang="vi">`, `html{font-size:14px}`, `body{font-family:'Public Sans',sans-serif;font-size:14px;line-height:1.5;color:var(--z700);background:var(--z50);-webkit-font-smoothing:antialiased}`.
- Reset: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}`. Scrollbar mảnh 4px, thumb `--z300`.
- Tiếng Việt có dấu: body 400, chỉ nhấn mới 600/700 (dấu nặng hơn Latin).

## 2. TOKENS — một file duy nhất `assets/tokens.css`, KHÔNG sửa giá trị
Mọi màn nạp tokens bằng `<link rel="stylesheet" href="../assets/tokens.css"/>` đặt TRƯỚC khối `<style>` của màn. `:root` trong màn chỉ được giữ biến bố cục riêng của màn đó (vd `--info-w` của E-04, `--program-columns` của H-05) hoặc ghi đè theo `@media` (vd M-04 `--sw:0px` khi hẹp). KHÔNG khai lại token, KHÔNG đặt tên riêng trùng nghĩa (`--warning`, `--error`, `--success`, `--muted`, `--ring`, `--shadow`…). `assets/tokens.test.js` chặn cả hai lỗi này.

Nội dung `assets/tokens.css` (nguồn chính là file, bản dưới để tra nhanh):
```css
:root{
  /* Zinc scale (shadcn) */
  --z0:#ffffff;--z50:#fafafa;--z100:#f4f4f5;--z200:#e4e4e7;--z300:#d4d4d8;
  --z400:#a1a1aa;--z500:#71717a;--z600:#52525b;--z700:#3f3f46;--z800:#27272a;--z900:#18181b;--z950:#09090b;
  /* MoMo pink — accent only */
  --brand:#A50064;--brand-h:#8B0055;--brand-fg:#ffffff;
  --brand-muted:rgba(165,0,100,.07);--brand-ring:rgba(165,0,100,.2);
  /* Xanh lá = hoàn thành */
  --ok:#16a34a;--ok-bg:#f0fdf4;--ok-bd:#bbf7d0;
  /* Trạng thái Feedback (COMPONENTS §8.2): vàng = đang thu thập, đỏ = quá hạn; --err còn cho nút xoá (§9) và lỗi form (§14) */
  --warn:#d97706;--warn-bg:#fffbeb;--warn-bd:#fde68a;
  --err:#dc2626;--err-bg:#fef2f2;--err-bd:#fecaca;
  /* Màu phân loại (giữ, chốt 27/09/2026): loại mục tiêu, thông tin, cập nhật */
  --what:#2563eb;--what-bg:#eff6ff;--what-bd:#bfdbfe;
  --dev:#7c3aed;--dev-bg:#f5f3ff;--dev-bd:#ddd6fe;
  --how:#0f766e;--how-bg:#f0fdfa;--how-bd:#99f6e4;
  --info:#2563eb;--info-bg:#eff6ff;--info-bd:#bfdbfe;
  --upd:#7c3aed;--upd-bg:#f5f3ff;--upd-bd:#ddd6fe;
  /* Spacing/shape */
  --sw:232px;--nh:52px;--r:8px;--rsm:6px;--rxs:4px;
  --sh-sm:0 1px 2px rgba(0,0,0,.04);
  --sh:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --sh-md:0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.03);
  --sh-lg:0 8px 30px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.04);
  --t:all .12s ease;
}
```
Header hồng nhạt `#fbe4f0` nền, `#f3cfe1` viền là màu hardcode được phép (§19 rule 1), không nằm trong file tokens.
**Màu phân loại** (`--what`, `--dev`, `--how`, `--info`, `--upd`) được giữ ở những chỗ đang dùng (quyết định 27/09/2026). Không thêm nhóm màu mới ngoài các nhóm trên; màu thứ hai của một màn (vd chàm `--template` cũ ở create-campaign) quy về nhóm có sẵn.
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

## 5–18b. COMPONENTS → `design-system/COMPONENTS.md`

Employee chip, loại mục tiêu, badge, core value, tooltip, feedback status, button, tab, table, card, info box, form, rich-text, dialog, timeline, component bổ sung và nâng cao. Giữ nguyên số mục §5 đến §18b. Chỉ đọc mục cần dùng.

## 19. QUY TẮC CHUNG (bắt buộc)

**19.0 Metadata separator.** TUYỆT ĐỐI không dùng ký tự middot `·` (U+00B7) ở bất kỳ text UI nào — status, chip, meta, hint, tách metadata. Luôn thay bằng dấu gạch ngang ngắn ` - ` (space-hyphen-space). Ví dụ: "Chưa đóng - sẽ đóng khi chia sẻ", KHÔNG "Chưa đóng · sẽ đóng khi chia sẻ".
1. Chỉ dùng token đã định nghĩa; không hardcode hex. Ngoại lệ: header hồng `#fbe4f0`/`#f3cfe1`; hoạ tiết thư, phong bì, thiệp và bộ theme thiệp của E-04 (phần "delight", chốt 27/09/2026). Giá trị trùng token vẫn phải viết `var(--token)` (vd `#fff` là `var(--z0)`, chữ trắng trên nền hồng là `var(--brand-fg)`), bo góc 8/6/4px là `var(--r)`/`var(--rsm)`/`var(--rxs)`. **Ngoài phạm vi DS:** trang demo mascot (`YER-demo/mascot-tour.html`, `mascot-tour-v2.html`, `overdue-self-assessment.html`) và thanh công cụ demo (`assets/yer-demo.js`), vì không phải màn sản phẩm.
2. Bo góc: card/dialog `--r`(8) · control/badge `--rsm`(6)/`--rxs`(4) · pill/chip tròn 50px.
3. Viền mặc định 1px z200; card nổi z300 + `--sh`.
4. Khoảng cách block: 14–18px. Icon boxicons 13–16px, z500 (thường) / hồng (nhấn). Transition `--t`.
5. Màu chỉ theo 3 ý định (xanh done / hồng action / xám neutral). Active/selected: nền `--brand-muted`, chữ `--brand`.
6. Chữ phụ đọc được: z600/z700, KHÔNG z500/z400 (giai đoạn 3 không rà hàng loạt vì phần lớn chỗ dùng z500 là eyebrow hợp lệ; sửa màn nào thì áp rule này cho màn đó). Responsive: bảng `overflow-x:auto`, grid `1fr` khi hẹp. **Form authoring:** tại laptop, giữ page shell đầy đủ nhưng căn giữa bề mặt nhập liệu với `max-width 860px`; chỉ chuyển grid thành `1fr` trước khi content bị co ép.

> Mục 7 đến 12e, 14, 15 đến 15h, 18 đến 18b và 19 đến 19c là rule giao diện riêng của Feedback, đã chuyển sang `docs/modules/feedback/UI-RULES.md` (giữ nguyên số mục).

13. **Icon + text cùng hàng (status chip, reminder meta, pending tag, chip nhỏ):** nhóm icon+chữ BẮT BUỘC `display:inline-flex;align-items:center;gap:4px`. TUYỆT ĐỐI không đặt `gap` trên phần tử inline/block thiếu `display:flex|inline-flex` — `gap` sẽ vô tác dụng, icon dính sát chữ. Khi copy component từ màn chuẩn (M-04/E-04) sang màn khác, copy đủ MỌI thuộc tính CSS (gồm `display`), không lược bớt.
16. **Tooltip trong bảng:** wrapper bảng KHÔNG được `overflow:hidden` (tooltip hàng đầu/nút cuối sẽ bị cắt mất chữ) — giữ bo góc bằng `border-radius` trên header và row cuối. Tooltip của nhóm nút ở cột Chức năng phải neo mép phải (`right:0;left:auto;transform:translate(0,…)`), không dùng `left:50%` vì tooltip sẽ tràn khỏi bảng.
17. **Review logic hiển thị kèm mọi yêu cầu chỉnh sửa:** khi đổi một rule hiển thị, phải rà lại toàn bộ thành phần phụ thuộc rule đó (cột, filter/tab, nút hành động, field trong form, màn hình khác đọc cùng dữ liệu) và sửa cho nhất quán trong cùng lần, thay vì chỉ sửa đúng chỗ được chỉ ra.
20. **Icon không tồn tại trong Boxicons 2.1.4:** KHÔNG dùng `bx-sparkles` và `bx-magic` — bản Boxicons đang dùng không có hai icon này nên trình duyệt vẽ ra ô rỗng. Lối vào AI dùng mascot (`assets/mascot/`): tiêu đề khối AI Summary dùng `<img class="dialog-ai-summary-mascot" src="../assets/mascot/think.png" alt=""/>` cỡ 20px ở mọi màn (M-04, H-06, H-07, `feedback-detail`, `request-detail`, `feedback-report-view.js`). Icon AI nhỏ nằm trong nút hoặc dòng chữ (`Cải thiện với AI`, `Gợi ý từ AI`) dùng `bx bxs-magic-wand`, có trong 2.1.4. Trước khi dùng một icon mới, kiểm tra tên có trong bản 2.1.4.
21. **Thuộc tính `hidden` trên phần tử có `display` riêng:** class đặt `display:flex|grid|inline-flex` sẽ đè lên `display:none` mà trình duyệt gán cho `[hidden]`, nên phần tử vẫn hiện. Mỗi class như vậy mà được bật/tắt bằng `hidden` BẮT BUỘC khai thêm `.ten-class[hidden]{display:none}` (vd `.ai-entry[hidden]`, `.dlg-tabs[hidden]`).
22. **Một đối tượng, một tên trên mọi màn:** cùng một thứ phải được gọi bằng MỘT tên ở mọi màn và mọi vai. Ví dụ: thứ HR chia sẻ luôn là `kết quả` (`Chia sẻ kết quả`, `kết quả từ HR`), KHÔNG gọi là `báo cáo` ở H-05, H-06 hay M-04. Đổi tên thì đổi ở mọi màn trong cùng lần sửa (rule 17).
23. **Ký hiệu trong câu chữ:** không đặt hai ký hiệu sát nhau (vd dấu ngã `~` cạnh ` - `); ước lượng thì viết chữ `khoảng`. Khi phần chính đã có sẵn ` - ` (tên chương trình như `… giữa kỳ 2026 - ITC`), phần phụ đi kèm đặt trong NGOẶC ĐƠN thay vì nối thêm một ` - ` nữa, vd `Đánh giá giữa kỳ 2026 - ITC (15 câu hỏi)`.
24. **Màu trạng thái chỉ lấy từ token, không viết tay sắc gần giống:** "Đang thu thập / Sắp đến hạn / Chưa trả lời" là `--warn*`, "Quá hạn" là `--err*`, "Hoàn thành / Đã chia sẻ" là `--ok*`, ở mọi màn và mọi vai. Các sắc cũ tự chế (`#b86600`, `#9a5b00`, `#b45309`, `#b42318`, `#16803a`, `#8d0056`…) đã quy về token ở giai đoạn 3; không thêm lại. Hover đậm hơn của nút xanh dùng `filter:brightness(.92)`, không chế thêm mã màu.
25. **Wrapper bảng bo góc mà không cắt tooltip (bổ sung rule 16):** ô bảng chỉ nhận `border-radius` khi bảng là `border-collapse:separate;border-spacing:0`. Bo góc ở `th` đầu/cuối của header và `td` đầu/cuối của hàng cuối bằng `calc(var(--r) - 1px)`, KHÔNG dùng `overflow:hidden` trên wrapper (mẫu: `.myr-table-wrap` ở M-05, `.gtable-wrap` ở showcase).

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
| `M-04/manager-thanks.js` | tim cảm ơn: danh sách domain đã thả, mỗi domain một tim, renderer và tooltip | M-04, `feedback-detail`, E-04 |

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

| Mã | Khi nào | Quản lý đọc (M-04) | Người được hỏi đọc (E-04) | Bản ngắn (popup `Yêu cầu đã đóng` của E-04) |
|---|---|---|---|---|
| `creator-resigned` | quản lý tạo yêu cầu đã nghỉ việc | Quản lý tạo yêu cầu đã nghỉ việc | Người tạo yêu cầu đã nghỉ việc… | Người tạo yêu cầu đã nghỉ việc |
| `manual` | quản lý chủ động bấm đóng | Quản lý đã chủ động đóng | Quản lý đã đóng yêu cầu… | Quản lý đã đóng yêu cầu |
| `no-active-ticket` | không còn ai có thể trả lời | Không còn ai có thể phản hồi | Yêu cầu đã đóng vì không còn ai… | Không còn ai có thể phản hồi |
| `expired` | quá 90 ngày kể từ ngày tạo | Quá 90 ngày kể từ ngày tạo | Yêu cầu đã quá 90 ngày nên tự đóng… | Yêu cầu hết hiệu lực vì quá 90 ngày |
| `recipient-resigned` | (mức ticket) người nhận nghỉ việc | ghi sau chữ Đóng trên ticket | Người nhận phản hồi đã nghỉ việc… | Người nhận phản hồi đã nghỉ việc |
| `hr-closed` | HR đóng chương trình khi người được hỏi chưa trả lời | — (không thuộc M-04) | HR đã đóng yêu cầu, bạn không cần phản hồi | HR đã đóng yêu cầu |

Ba bảng câu chữ nằm cạnh nhau trong `ManagerRequestModel`: `CLOSE_REASON_TEXT`, `REVIEWER_NOTICE_TEXT`
và `CLOSE_REASON_SHORT` (đọc qua `closeReasonShort()`). Bản ngắn chỉ nêu lý do, vì tiêu đề popup đã nói
"Yêu cầu đã đóng"; nhắc lại "bạn không cần phản hồi" ở từng dòng là thừa. Mã lạ rơi về `Yêu cầu đã đóng`.

**Người nhận phản hồi nghỉ việc: HR và quản lý KHÁC nhau có chủ đích.** Yêu cầu của quản lý đóng
ticket chưa trả lời của người đó (`recipient-resigned`) và báo cho người cho phản hồi chưa trả lời;
chương trình của HR vẫn thu tiếp để lưu hồ sơ và cảnh báo trong dialog `Chia sẻ kết quả`
(`UI-RULES.md` mục 15b). Người CHO phản hồi nghỉ việc thì hai vai giống nhau: ticket ngừng thu và bị
loại khỏi mẫu số khi còn đang thu thập (§20.4).

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

- **HR (H-05/H-06):** mở lại được khi **HR tự đóng**, **chưa chia sẻ kết quả** và **chưa quá 90 ngày
  kể từ ngày tạo**. Chia sẻ rồi là chốt vĩnh viễn, vì người ngoài đã đọc số liệu đó; quá 90 ngày là
  mốc hệ thống tự đóng nên nút `Mở lại` phải biến mất, không để nút hứa một việc nó không làm được.
  Luật này viết MỘT lần trong `FeedbackProgramModel.canReopenCampaign(campaign,today)`, màn hình không tự tính lại.
- **Quản lý (M-04):** mở lại được khi **quản lý tự đóng** và **chưa quá 90 ngày**, qua
  `ManagerRequestModel.canReopenRequest(request,today)`. Khác HR đúng một chỗ: không có bước chia sẻ
  kết quả nên không có điều kiện đó. **Luật chung cho cả hai vai:** chỉ ca đóng TAY mới mở lại được;
  `no-active-ticket` và `expired` là hệ thống tự đóng, bấm mở lại cũng đóng lại ngay nên nút phải biến mất.

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
