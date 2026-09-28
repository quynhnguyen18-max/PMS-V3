# YER SPEC — Đánh giá cuối năm (Year-End Review) 2026

> Chốt ngày 02/09/2026 sau 4 vòng làm rõ với HR. Mọi màn hình YER phải bám file này.
> Design system: `DESIGN-SYSTEM.md`. Dữ liệu dùng chung: `assets/employees-data.js` (KHÔNG sửa) + `assets/yer-data.js` (thêm mới).

---

## 1. Vai trò

| Mã | Vai trò | Phạm vi |
|---|---|---|
| NV | Nhân viên | Hồ sơ của chính mình |
| LM | Quản lý trực tiếp | Nhân viên báo cáo trực tiếp |
| LM2 | Quản lý cấp 2 | Nhân viên của các LM dưới quyền |
| HOD | Trưởng đơn vị | Toàn bộ đơn vị |
| HRBP | HR Business Partner | Đơn vị được phân công - read-only + upload hộ HOD |
| L&OD | Learning & OD | Toàn công ty - read-only + publish |
| TR | Total Reward | Danh sách NV + overall rating các cấp - upload điểm CEO |
| HRD | HR Director | Duyệt điểm final (dùng chung màn TR, khác quyền) |

Một người có thể kiêm nhiều vai trò (LM + LM2 + HOD). UI gộp một màn danh sách, phân tab theo vai trò thực có.

## 2. Luồng và timeline

| Bước | Ai | Thời gian (demo) |
|---|---|---|
| Cut-off đổi Quản lý | HR masterlist | 31/12/2026 |
| Tự đánh giá | NV | 05/01 - 18/01/2027 |
| LM đánh giá chi tiết | LM | 19/01 - 01/02/2027 |
| LM2 đánh giá | LM2 | 02/02 - 15/02/2027 |
| HOD đánh giá | HOD | 16/02 - 01/03/2027 |
| Upload điểm CEO | TR | 02/03 - 15/03/2027 |
| Duyệt điểm final | HRD | 16/03 - 29/03/2027 |
| Publish | L&OD | 30/03/2027 (không dựng UI đợt này) |

Employee Response mở khi LM submit, đóng khi publish. Chạy song song bước LM2/HOD.
Calibration diễn ra offline, không dựng UI.

## 3. Nội dung đánh giá

3 nhóm mục tiêu, giống MYR:
- **Mục tiêu công việc** (what) - `bx-target-lock`
- **Mục tiêu phát triển** (dev) - `bx-line-chart`
- **Mục tiêu hành vi** (how) - 5 giá trị cốt lõi - `bx-heart`

Mỗi bên (NV, LM) nhập: điểm từng mục tiêu + 3 ô nhận xét theo nhóm + điểm toàn diện + nhận xét toàn diện.
KHÔNG có ô nhận xét cho từng mục tiêu riêng lẻ.

LM2/HOD chỉ chấm **điểm toàn diện** + comment tùy chọn. Xem được chi tiết đánh giá của NV và LM để tham khảo.

## 4. Thang điểm

Điểm từng mục tiêu: **số nguyên 1-5**.
Điểm toàn diện (mọi cấp) và final rating: **1-5, bước 0.5**.

| Điểm | Tiếng Việt | English |
|---|---|---|
| 1 | Không đạt yêu cầu | Does Not Meet Expectations |
| 2 | Hoàn thành một phần | Partially Meet Expectations |
| 3 | Hoàn thành kỳ vọng | Meet Expectations |
| 4 | Hoàn thành trên mức kỳ vọng | Exceed Expectations |
| 5 | Hoàn thành vượt xa kỳ vọng | Exceptionally Exceed Expectations |

Mức .5 = vượt trên mức liền trước nhưng chưa đạt trọn vẹn mức kế tiếp. Không tạo định nghĩa riêng.

**UI chọn điểm** - nút chọn giữ kích thước ô trong lưới (khoảng 60px), bảng chọn mở ra hiển thị **toàn bộ thang điểm kèm tên mức, không phải cuộn**.

| | Điểm từng mục tiêu | Điểm toàn diện |
|---|---|---|
| Thang | 1-5 số nguyên, 5 dòng | 1-5 bước 0.5, 9 dòng |
| Chú thích thang điểm trên đầu bảng chọn | Không | Có |
| Định nghĩa mức | Không hiển thị | Hiện **sau khi chọn điểm**, dạng ô ngay dưới ô chọn |
| Sau khi gửi | Chỉ số và tên mức, không ⓘ | Ô định nghĩa biến mất, còn số, tên mức và ⓘ |

## 5. Điều kiện tham gia

- Onboard **trước 01/10/2026**. NV onboard sau ngày này ẩn hẳn khỏi danh sách YER của Quản lý,
  và **tab Đánh giá cuối năm trên màn của chính họ bị khóa** — nhãn tab là `Ngoài kỳ đánh giá`,
  bấm vào không mở được, đang đứng ở tab đó thì bị đưa về tab Mục tiêu.
  Màn hình suy điều này từ `status(p).key === 'out'`, không tự kiểm tra lại ngày onboard.
- Có tối thiểu **1 mục tiêu công việc** và **1 mục tiêu phát triển** đã được duyệt.
- Thiếu goal (chốt lại 27/09/2026): còn hạn tự đánh giá thì nhân viên **vẫn nhập và lưu nháp** Tự đánh giá,
  chỉ **không gửi được** cho tới khi đủ mục tiêu đã duyệt. Lưu nháp thì hiện dialog tiêu đề `Lưu nháp thành công`,
  một dòng hướng dẫn `Bạn còn thiếu [loại mục tiêu], hãy thiết lập và gửi cho Quản lý trực tiếp phê duyệt để tiếp
  tục hoàn thành Tự đánh giá.`, không nhắc hạn. Luật nằm ở `PMSYer.selfAssessmentState(p)` (`canSubmit`, `submitBlock: 'missing-goal'`).
  KHÔNG upload được điểm CEO. Vẫn tính vào mẫu số tỷ lệ hoàn thành.
  Nhân viên vẫn nộp bổ sung được bằng file; chỉ gắn **Không đánh giá** khi hết cửa sổ nộp bổ sung (§27.1).
- NV đã nghỉ việc: ẩn khỏi danh sách của Quản lý. Không có bộ lọc để hiện lại (§47).
- NV sắp nghỉ: hiện badge ngày làm việc cuối cùng ở hai chỗ, với câu chữ khác nhau vì
  chỗ rộng hẹp khác nhau:

  | Chỗ | Câu chữ |
  |---|---|
  | Màn Nhân viên, **ngay dưới box thông tin nhân viên** ở header (`.emp-col`) | `Ngày làm việc cuối cùng: dd/mm/yyyy` |
  | Dòng danh sách của Quản lý | `LWD: dd/mm/yyyy`, tooltip `Ngày làm việc cuối cùng` |

  Trên màn Nhân viên **không mở ngoặc `(LWD)`**: tiếng Việt đã nói đủ nghĩa, thêm viết tắt
  là lặp. Badge nằm ở header chứ không nằm trong tab, vì đây là thông tin nhân thân chứ
  không thuộc kỳ đánh giá. Badge và box thông tin **rộng bằng nhau** (`.emp-col` dùng
  `align-items:stretch`) để hai khối thẳng lề cả hai bên.

  Ô này dùng chung cho mọi badge nhân thân (`.emp-badge`), xếp dọc theo thứ tự khai báo.
  Sắp nghỉ việc dùng tông đỏ `--err`; nghỉ thai sản (§12) dùng tông hồng `--brand`.
  Hai việc khác hẳn nhau nên không dùng chung một màu. Badge chỉ để nhận diện: **nhân viên vẫn tự đánh giá theo hạn
  chung, không phải làm sớm**, và màn hình không dựng khối giục nào. Qua ngày hiệu lực
  mà chưa chấm thì hồ sơ ẩn luôn.
- Không tính NV đã nghỉ việc vào tỷ lệ hoàn thành.

## 6. Auto-sync quá deadline

- Quá deadline bước LM mà LM chưa submit: hệ thống copy **điểm toàn diện của NV** sang cột LM.
- Quá deadline bước LM2 mà LM2 chưa chấm: copy **điểm toàn diện của LM** sang cột LM2.
- **KHÔNG** sync từ LM2 sang HOD. HOD quá hạn mà không thao tác: ghi nhận không có điểm HOD, hồ sơ giữ trạng thái `Chờ HOD đánh giá`, quy trình vẫn đi tiếp.
- Chỉ sync **điểm số**, không sync nhận xét.
- Badge `(HR system)` cạnh điểm ở cấp bị sync. Dùng một nhãn chung, không thể hiện chuỗi nguồn.
- Không gửi thông báo. Quá deadline không ai sửa được.
- NV không tự đánh giá nhưng đủ goal: LM vẫn đánh giá bình thường **tới hết hạn QLTT**, cột điểm NV để trống.
  Hết hạn QLTT mà vẫn không có điểm nào (không tự đánh giá, QLTT không chấm, nên không có gì để
  sync) thì hồ sơ mới thành `Không đánh giá`. Chốt ngày 27/09/2026: hạn nộp bổ sung của nhân viên
  (§27.1) **không** cắt quyền chấm của QLTT.
- Hồ sơ nộp bổ sung có hạn chấm QLTT riêng (`lmDeadline`, §27.3); đồng bộ điểm từ NV sang cột LM chỉ chạy
  sau hạn riêng đó.

## 7. Quyền xem

| Dữ liệu | NV trước publish | NV sau publish | LM | LM2/HOD | HRBP/L&OD | TR/HRD |
|---|---|---|---|---|---|---|
| Tự đánh giá | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Điểm từng mục tiêu của LM | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| 3 nhận xét nhóm + nhận xét toàn diện của LM | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| **Điểm toàn diện của LM** | ✗ | ✗ (vĩnh viễn) | ✓ | ✓ | ✓ | ✓ |
| Điểm LM2/HOD | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Comment LM2/HOD | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Final rating | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |

Với NV, **không render dòng điểm toàn diện của Quản lý** ở bất kỳ thời điểm nào; chỉ
hiển thị nhận xét toàn diện của Quản lý khi đã có dữ liệu. Hai cột nhận xét Nhân viên và
Quản lý phải thẳng hàng dù cột Quản lý không có dòng điểm.
HRBP chỉ thấy đơn vị mình phụ trách; L&OD thấy toàn công ty.

**Final rating của kỳ cuối năm** là điểm CEO do Total Reward tải lên và HR Director duyệt,
không phải điểm của cấp quản lý cao nhất như kỳ giữa năm (xem `MYR-SPEC.md` MYR-07).

Bảng trên thay quy tắc xem điểm của `PMS_Screen_Inventory_v1.md` (06/2026, đã xóa 27/09/2026).
Ba chỗ bản cũ nói khác và bảng này thắng: nhân viên thấy nhận xét toàn diện của Quản lý
ngay khi Quản lý gửi (bản cũ: chỉ sau công bố); nhân viên không bao giờ thấy điểm toàn diện
của Quản lý, kể cả sau công bố (bản cũ: thấy sau công bố); Quản lý trực tiếp thấy điểm của
Quản lý cấp 2 và Trưởng đơn vị (bản cũ: chỉ thấy cấp dưới mình).

Chốt lại ngày 27/09/2026: nhân viên **đọc được nhận xét** của Quản lý cấp 2 và Trưởng đơn vị ngay khi
hai cấp này lưu nhận xét, nhưng **không bao giờ thấy điểm** của hai cấp này. Màn Nhân viên thêm khối
`Nhận xét của các cấp quản lý` ở cuối trang, dưới khối Đánh giá toàn diện; mỗi cấp một ô chỉ xem, cấp nào
không có nhận xét thì không có ô, không cấp nào có thì không dựng khối (`upperCommentsCard`). Điểm đồng bộ
của hệ thống (`synced`) không có nhận xét nên không tạo ô. Tình huống demo: `nv11`.

## 8. Chỉnh sửa sau khi gửi

Chốt ngày 27/09/2026, thay rule cũ "Nhân viên không thu hồi Self Assessment".

### 8.1 Nhân viên

- Nhân viên **chỉnh sửa được bản Tự đánh giá đã gửi tới hết hạn tự đánh giá** (`step('self').to`).
  Hết hạn thì chỉ xem.
- Không áp cho hồ sơ gửi bằng **file nộp trễ** (§27.1): file chỉ gửi một lần.
- Trạng thái lấy từ `PMSYer.selfAssessmentState(p).mode`, màn chỉ render:

  | mode | Khi nào | Màn Nhân viên |
  |---|---|---|
  | `draft` | chưa gửi, còn hạn | form nhập, `Lưu nháp` + `Gửi tự đánh giá` |
  | `submitted` | đã gửi, còn hạn | banner `Đã hoàn thành`, dòng `Bạn có thể chỉnh sửa tới hết ngày dd/mm/yyyy`, nút `Chỉnh sửa`, `Lịch sử chỉnh sửa`, PDF |
  | `editing` | đã gửi rồi bấm `Chỉnh sửa`, còn hạn | khối `Bạn đang chỉnh sửa Tự đánh giá đã gửi` + nút `Hủy chỉnh sửa`, form nhập, `Lưu nháp` + `Gửi lại tự đánh giá` |
  | `locked` | đã gửi, hết hạn (hoặc gửi bằng file) | banner `Đã hoàn thành`, `Lịch sử chỉnh sửa`, PDF |
  | `closed` | chưa gửi, hết hạn | như trước (nộp trễ §27.1 hoặc Không đánh giá) |

- **Trạng thái khi mở lại là `Đang chỉnh sửa`, và bản đã gửi vẫn được giữ.** Bấm `Chỉnh sửa` không
  xóa bản đã gửi: bản đó vẫn là bản chính thức (Quản lý vẫn thấy, hồ sơ vẫn `Chờ Quản lý trực tiếp`)
  cho tới khi nhân viên bấm `Gửi lại`. Quá hạn mà chưa gửi lại thì hệ thống dùng bản đã gửi, bản sửa dở
  bị bỏ. Chọn cách này để nhân viên không bao giờ rơi vào `Không tự đánh giá` chỉ vì mở ra sửa mà quên gửi.
  Vì vậy nút đặt tên `Chỉnh sửa`, không dùng chữ `Thu hồi`.
- Trong lúc chỉnh sửa, nhân viên sửa được điểm và nhận xét của mọi nhóm và phần toàn diện, và **thêm
  mục tiêu mới** ở tab Mục tiêu (gửi Quản lý trực tiếp duyệt, §29). Mục tiêu được duyệt thì vào bảng
  đánh giá. Bản gửi lại chỉ gồm mục tiêu đã duyệt tại lúc gửi; mục tiêu được duyệt sau đó thì phải mở
  chỉnh sửa lần nữa (còn hạn) để chấm.
- `Hủy chỉnh sửa` bỏ mọi thay đổi chưa gửi, quay về `submitted`.
- Khối `Đang chỉnh sửa` (chốt câu chữ 27/09/2026): tiêu đề `Bạn đang chỉnh sửa bản Tự đánh giá đã gửi ngày
  dd/mm/yyyy`, ba gạch đầu dòng có nhãn in đậm: `Phạm vi chỉnh sửa`, `Thêm mục tiêu mới` (dẫn sang tab
  `Danh sách mục tiêu`; mục tiêu sau khi duyệt tự hiển thị trong tab Đánh giá cuối năm), `Thời hạn và lưu ý`
  (gửi lại trước 18:00 ngày hạn; sau hạn hệ thống tự ghi nhận bản đã gửi gần nhất).
- Dialog xác nhận:
  - `Xác nhận chỉnh sửa Tự đánh giá đã gửi?`: `Bạn có thể sửa điểm, nhận xét, và bổ sung mục tiêu mới đến
    18:00 ngày dd/mm/yyyy.` và `Nếu không gửi lại bản mới trước thời hạn trên, hệ thống sẽ tự động ghi nhận
    bản Tự đánh giá đã gửi gần nhất vào ngày dd/mm/yyyy.`
  - `Gửi lại tự đánh giá cuối năm?`: bản này thay bản đã gửi ngày dd/mm; vẫn chỉnh sửa được tới hết ngày.
  - Dialog gửi lần đầu đổi câu cũ `không thể thu hồi hoặc chỉnh sửa` thành `Bạn vẫn chỉnh sửa được tới hết ngày dd/mm/yyyy`.

### 8.2 Lịch sử chỉnh sửa

- Mỗi thao tác ghi một dòng vào `acts.selfLog.items` (seed dùng `selfLog`): `submit`, `reopen`, `cancel`,
  `resubmit`. Model thêm hai dòng suy ra: `late-file` khi hồ sơ gửi bằng file mà chưa có lịch sử, và
  `expired` khi hết hạn lúc đang chỉnh sửa (`Hệ thống giữ bản gửi ngày dd/mm/yyyy`).
- Dòng `resubmit` kèm phần thay đổi do `PMSYer.selfChanges(before, after)` tính: điểm toàn diện từ X thành Y,
  số điểm mục tiêu đã sửa, số điểm giá trị cốt lõi đã sửa, nhóm nhận xét đã sửa, đánh giá toàn diện đã sửa.
- Nút `Lịch sử chỉnh sửa` trên banner mở dialog, dựng lại ngày 27/09/2026 cho dễ đọc:
  - Trên cùng là ô xanh `Bản đang được ghi nhận: Lần gửi N ngày dd/mm/yyyy - điểm toàn diện X`; đang chỉnh
    sửa thì thêm dòng bản này vẫn được giữ tới khi gửi lại.
  - Mỗi lần gửi được đánh số `Lần gửi 1, 2…`; lần gửi lại ghi `Lần gửi N - thay lần gửi N-1` và liệt kê
    từng thay đổi trên một dòng: `Điểm toàn diện: 4 → 4.5`, `Điểm mục tiêu: sửa 1 mục tiêu`,
    `Điểm giá trị cốt lõi: sửa n giá trị`, `Nhận xét đã sửa: …`.
  - Lần gửi đang có hiệu lực mang nhãn xanh `Đang được ghi nhận`.
  - `Mở chỉnh sửa lần gửi N` và `Hủy chỉnh sửa, giữ nguyên lần gửi N` là mốc phụ, chữ nhỏ, không đánh số.
  - `Hết hạn chỉnh sửa khi chưa gửi lại` ghi `Hệ thống ghi nhận lần gửi N (ngày dd/mm/yyyy)`, người thực hiện là `Hệ thống`.
  - Mỗi dòng có ngày giờ `dd/mm/yyyy hh:mm - domain`; mới nhất ở trên.
- Hồ sơ nộp bổ sung bằng file chỉ gửi một lần nên **không có** nút `Lịch sử chỉnh sửa` (chốt 28/09/2026).
- Chưa dựng phần Quản lý xem lịch sử này ở M-06.

### 8.3 Quản lý

- QLTT, Quản lý cấp 2 và HOD không cần thu hồi bản đánh giá đã gửi: cả ba vai đều mở lại,
  chỉnh sửa và lưu cập nhật được tới hết deadline của chính mình.
- Sau deadline, đánh giá của vai đó chuyển sang chỉ xem.

## 9. HRBP upload hộ HOD

- Chỉ hỗ trợ bước HOD (không áp dụng cho LM2).
- File: mã NV, tên, domain NV, division, department, grade, domain LM1, điểm toàn diện, nhận xét.
- Có bước preview và đối soát trước khi ghi. Trùng với điểm đã chấm tay thì báo conflict để chọn.
- Điểm HRBP upload chưa duyệt **không hiện** ở màn chính của HOD; nằm ở màn "Phê duyệt điểm hiệu chuẩn".
- HOD duyệt hàng loạt được, **không sửa** điểm trước khi duyệt.
- Trong timeline HOD: upload lại, duyệt lại, sửa bao nhiêu lần cũng được. Hết deadline thì cut off.

## 10. Employee Response (Enh 5)

Chốt ngày 22/09/2026: **bỏ toàn bộ chức năng Employee Response khỏi luồng YER**.

- Nhân viên không có khối `Phản hồi của Nhân viên` ở bất kỳ trạng thái nào.
- Quản lý không có bộ lọc, icon nhận diện, nội dung phản hồi hoặc hành động trả lời.
- Model không còn sinh `responseOpen`, `replyOpen` hay thread phản hồi.
- Các tình huống Demo chuyên cho luồng phản hồi (`nv19`, `nv20`) được loại bỏ.

## 11. Mid-Year Snapshot (Enh 2)

> **Đã thay bằng §28.** Giữ lại để tra nguồn, không dựng theo mục này.

- Chốt tại thời điểm **publish điểm MYR**. Không sửa, không đổi khi goal thay đổi sau đó.
- **Chỉ hiển thị cho Quản lý** (LM, LM2, HOD) và HRBP/L&OD. Màn Nhân viên **không có** khối này - nhân viên xem kỳ giữa năm ở tab Mid-Year Review.
- Hiển thị: 1 block collapse ở đầu màn đánh giá của Quản lý.
- Nội dung: điểm từng mục tiêu, 3 nhận xét nhóm, nhận xét toàn diện, điểm LM/LM2/HOD và final rating MYR đã publish.
- Không có MYR: empty state "Không có dữ liệu Mid-Year".
- Goal thay đổi sau MYR: badge `Đã thay đổi sau Mid-Year` trên goal card + link mở đúng goal trong snapshot. Không diff cạnh nhau.

## 12. Nghỉ thai sản (Enh 8)

- Xác định theo trạng thái tại **ngày mở kỳ YER** (05/01/2027). Chỉ áp dụng cho thai sản, không mở rộng cho nghỉ ốm/nghỉ không lương.
- NV thai sản **không bắt buộc** tự đánh giá, nhưng vẫn làm được nếu muốn.
- Badge `Nghỉ thai sản tới ngày: dd/mm/yyyy` đặt ngay dưới box thông tin nhân viên,
  cùng chỗ và cùng bề rộng với badge ngày làm việc cuối cùng ở §5. Dữ liệu không ghi hạn
  thì badge chỉ ghi `Đang nghỉ thai sản`.
- **Không đưa NV thai sản vào luồng nộp trễ của §27.1**: không hiện màn `Quá hạn tự đánh giá`,
  không báo cửa sổ nộp trễ đã đóng, nhãn tab giữ `Không yêu cầu tự đánh giá`.
- Có goal thì LM đánh giá bình thường. Không có goal thì LM **import goal** rồi **approve**, sau đó đánh giá.
- Import goal: Excel 2 sheet `WHAT Goals` + `DEVELOPMENT Goals`, giống `M-02`.
- Bước tự đánh giá chuyển `Không yêu cầu (Nghỉ thai sản)`, không tính là chưa hoàn thành, không gửi nhắc.
- NV thai sản vẫn nhận final rating.
- NV đi làm lại sửa goal theo quy tắc chung của màn Mục tiêu.

## 13. Đổi Quản lý giữa kỳ (Enh 9)

Chốt lại ngày 18/09/2026. **Không có bản bàn giao (wrap-up) nào cả.**
Quy định cũ về task `Hoàn tất bàn giao đánh giá`, cửa sổ 48 giờ và bốn ô Key Achievements /
Strengths / Areas for Improvement / Additional Notes **đã bỏ**, kèm toàn bộ UI của nó.

- Nguồn: HR masterlist. **Cut-off 31/12/2026** - sau ngày này LM đang là ai thì người đó
  chịu trách nhiệm đánh giá phần còn lại.
- Thứ Quản lý cũ để lại là **điểm của những mục tiêu họ đã đánh giá hoàn thành**,
  dùng chính tính năng đánh giá hoàn thành mục tiêu có sẵn ở màn Mục tiêu.
- **Quản lý mới không chấm lại** những mục tiêu đó. Ô điểm của chúng khóa lại ở màn
  chấm điểm, Quản lý mới chỉ chấm những mục tiêu còn trống.
- Quản lý cũ nghỉ việc thì điểm họ đã chốt **vẫn giữ nguyên và vẫn ghi tên họ**.
- Đổi qua công ty thành viên khác: không ràng buộc thêm về quyền xem.

### 13.1 Mục tiêu đã đánh giá hoàn thành

Chốt ngày 18/09/2026.

**Việc chấm diễn ra ở tab Mục tiêu, không phải ở kỳ đánh giá.** Trình tự hai bước:

1. **Nhân viên tự đánh giá trước** cho mục tiêu đó.
2. **Quản lý đánh giá sau** và chốt hoàn thành.

Sau khi chốt, sang tab **Đánh giá giữa năm** và **Đánh giá cuối năm** thì mục tiêu đó
**chỉ hiển thị lại điểm đã chốt**:

- **Khóa cả hai cột điểm.** Cả **Điểm NV** lẫn **Điểm QLTT** đều là ô chỉ xem — nhân viên
  không chọn lại, Quản lý cũng không chấm lại.
- Mục tiêu đã khóa **không tính vào ô bắt buộc điền** khi kiểm tra trước lúc gửi tự đánh giá:
  không có ô để nhập thì không được đòi.
- Khi nhân viên đổi Quản lý giữa kỳ, người chốt thường là **Quản lý cũ**, nên phải ghi
  rõ ai chấm (xem bảng dưới).

Dữ liệu: `completedGoals` trên hồ sơ, dạng

```
goalId -> {
  self: { score, comment, at },            // nhân viên chấm trước
  mgr:  { by, score, comment, at }         // quản lý chấm sau, `by` có thể là Quản lý cũ
}
```

Áp đồng nhất ở **ba chỗ**: bảng mục tiêu của tab Đánh giá cuối năm, bảng mục tiêu của
tab Đánh giá giữa năm, và màn chấm điểm của Quản lý `M-06`:

| Chỗ | Hiển thị |
|---|---|
| Dòng mục tiêu | viền trái xanh lá 3px (`.g-row-done`) |
| Cột **Điểm NV** | điểm chỉ xem, không có dropdown |
| Dưới tên mục tiêu | chip xanh lá `Đã đánh giá hoàn thành` (`.g-done-chip`) |
| Cột **Điểm QLTT** | điểm chỉ xem, dưới là **domain người chấm** 10.5px màu `--z500` (`.ql-by`) |
| Popup chi tiết mục tiêu | dòng `Đã đánh giá hoàn thành bởi` với tên đầy đủ kèm domain |

### 13.2 Hover và popup chi tiết mục tiêu

Bảng mục tiêu của tab Đánh giá cuối năm dùng **đúng cơ chế của tab Đánh giá giữa năm**,
không dựng kiểu UI riêng:

- **Rê chuột** → tooltip `#goal-tip` hiện tên và kết quả cần đạt. Chỉ bật ở **hai cột đầu**:
  `Tên mục tiêu` và `Kết quả cần đạt` (nhóm hành vi là `Giá trị cốt lõi` và `Mô tả`).
  Treo vào cả dòng thì rê lên ô chọn điểm hay cột thời gian cũng bật tooltip, che mất
  thứ người dùng đang định bấm.
- **Bấm** vào dòng → popup `#goal-detail-overlay` `Chi tiết mục tiêu`.
  Bấm vào ô chọn điểm, nút hay liên kết thì không mở popup.
- Áp cho **cả ba nhóm**: Mục tiêu công việc, Mục tiêu phát triển và **Mục tiêu hành vi**.
  Giá trị cốt lõi cũng là một nhóm mục tiêu, không được bỏ sót.
- Dòng mục tiêu phải mang `data-name` và `data-result`; tooltip và popup chỉ đọc `data-*`
  của dòng nên hai file không phải truyền gì cho nhau.
- Mô tả nhiều ý (Giá trị cốt lõi có ba câu) nối bằng ký tự xuống dòng; tooltip và ô
  `Kết quả cần đạt` của popup dùng `white-space:pre-line` để giữ đúng ngắt dòng.
- Bảng dựng lại mỗi lần render nên phải gọi lại `window.bindReviewGoalRows(root)` sau
  mỗi lần render, **không** gắn một lần lúc tải trang. Cờ `data-tipBound` chặn gắn trùng.

Popup là **chính hộp thoại `#dlg-detail` của màn Mục tiêu**, mở bằng `openDetailFromRow(tr)`.
Không dựng popup rút gọn riêng cho kỳ đánh giá — từng làm vậy và phải bỏ đi.

| Phần | Lấy từ |
|---|---|
| Badge trạng thái | `Hoàn thành` nếu mục tiêu đã chốt, ngược lại `Đã duyệt` |
| Badge loại | tiêu đề nhóm của chính bảng (`.rv-type`) |
| Ưu tiên / Từ ngày / Đến ngày | ô `.prio` và `.g-meta` của dòng; **ẩn cả hàng** với Mục tiêu hành vi |
| Khối hai lượt chấm | `renderEvalTab()` sẵn có, truyền một phần tử mang đúng `dataset` |
| Tab **Bình luận** | **giữ**, nhưng hiện ô trống `Chưa có bình luận nào cho mục tiêu này.` — dòng của kỳ đánh giá chưa mang dữ liệu bình luận riêng |

**Hộp thoại mở từ bảng đánh giá chỉ để XEM LẠI**, không thao tác. `openDetailFromRow()`
gắn cờ `.from-review` lên `#dlg-detail`, mọi khác biệt đều bọc trong cờ này để màn
Mục tiêu — nơi còn chấm điểm thật — giữ nguyên:

| Phần | Khi mở từ bảng đánh giá |
|---|---|
| Dải `① Nhân viên tự đánh giá → ② Quản lý đánh giá` | **ẩn** — ở đây không ai thực hiện bước nào nữa |
| Tiêu đề `NHÂN VIÊN TỰ ĐÁNH GIÁ` / `QUẢN LÝ ĐÁNH GIÁ` | màu `--brand` |
| Nhãn `ĐÁNH GIÁ CỦA NHÂN VIÊN` / `CỦA QUẢN LÝ` | **ẩn** — lặp ý với tiêu đề ô ngay trên |
| Dòng người chấm | `Đánh giá bởi **domain** - dd/mm/yyyy`, domain in đậm |
| Chân hộp thoại (nút `Đóng`) | **ẩn** — đóng bằng dấu × hoặc bấm ra ngoài |
| Số đếm trên tab Bình luận | **ẩn** — chưa có số thật để đếm |
| Khoảng trống đáy hộp thoại | 24px thay vì 16px — không có chân hộp thì nội dung sát mép, nhìn như bị cụt |

**Mục tiêu hành vi dùng hộp thoại riêng `#dlg-how`**, không dùng `#dlg-detail`.
Dòng mục tiêu hành vi mang `data-kind="how"`; `openDetailFromRow()` thấy cờ này thì
gọi thẳng `showHow(name, desc)` rồi thoát.

`#dlg-how` dùng chung cho **cả tab Mục tiêu và tab Đánh giá cuối năm**. Giá trị cốt lõi
là bộ cố định của Công ty, không qua bước nhân viên tạo rồi quản lý duyệt và không có
bình luận, nên hộp thoại này:

- dùng kích thước `dialog md`, đồng nhất với popup chi tiết các mục tiêu khác;
- chỉ có badge `Mục tiêu hành vi`, **không có nhãn trạng thái** (`Đã duyệt` / `Hoàn thành`);
- **không chia tab**, phần đầu tự mang đường kẻ ngăn;
- thân gồm hai ô `Tên mục tiêu` và `Mô tả`, tên nằm trong ô chứ không làm tiêu đề;
- **không có chân hộp thoại**, đáy nới 24px; đóng bằng dấu × hoặc bấm ra ngoài;
- khi mở từ màn **Mục tiêu**, giữ dòng ghi chú `Giá trị cốt lõi cố định cho toàn bộ
  MoMoers, được đánh giá trong Kỳ giữa năm (MYR) và cuối năm (YER)` ở cuối;
- khi mở từ màn **Đánh giá cuối năm**, `showHow(..., true)` gắn `.from-review` và ẩn
  dòng ghi chú; `openHow()` của màn Mục tiêu gọi `showHow(..., false)` để hiện lại.

Với mục tiêu đã đánh giá hoàn thành, domain người chấm ở cột QLTT là metadata nằm dưới
điểm. `.ql-by` được đặt tuyệt đối trong `.g-row-done .ql-cell` để không tham gia vào
luồng căn giữa; nhờ đó điểm NV và điểm QLTT luôn nằm cùng một hàng.

Mở từ màn Mục tiêu thì `openDetail()` **gỡ cờ** và trả lại đầy đủ: dải bước, nhãn ô,
chân hộp thoại, số đếm bình luận và hàng ưu tiên/thời gian — vì hai màn dùng chung
một hộp thoại.

Domain hai lượt chấm (`.ev-meta`) lấy từ `data-done-self-by` và `data-done-mgr-by`,
không hardcode `tu.nguyen` / `thanh.le` nữa.

Ở cột điểm chỉ ghi **domain**, không ghi tên đầy đủ: cột chỉ rộng khoảng 10% bảng, tên
đầy đủ sẽ xuống dòng và làm rối bảng. Tên đầy đủ đặt ở `title` để rê chuột là thấy,
và ở popup chi tiết nơi có đủ chỗ.

## 14. AI Performance Copilot (Enh 6)

- Chỉ cho LM/LM2/HOD. NV không dùng AI cho tự đánh giá.
- Mock nội dung, nhưng phải hợp cảnh từng màn và từng nhân viên.
- **AI Summary**: tự chạy khi mở màn đánh giá chi tiết. Với LM2/HOD chỉ chạy khi bấm icon AI ở lưới. Không có bản summary cả team.
- **AI Draft / Refine**: panel chat trượt từ phải. AI không tự chèn - LM bấm "Chèn vào ô nhận xét" mới áp dụng. Dùng được cho cả 4 ô nhận xét.
- NV không biết nhận xét có AI tham gia. Không badge, không log hiển thị.
- Chế độ EN thì AI trả lời tiếng Anh.

## 15. Proxy View (Enh 7)

- Cho HRBP, L&OD, Admin. Chỉ read-only, mọi nút thao tác vô hiệu, nhãn `Proxy View (Read Only)`.
- **Chỉ dùng được khi người dùng đang online.** HRBP gửi yêu cầu, người dùng nhận thông báo in-app + email + popup nếu đang online.
- Không phản hồi trong **2 phút**: yêu cầu tự hủy. Từ chối được, và HRBP xin lại được.
- Xem theo góc nhìn LM: xin đồng ý của **LM**, không xin từng NV trong team.
- Trong lúc bị xem: người dùng thấy chỉ báo "đang được xem" + nút ngắt.
- Tự thoát sau 15 phút. Ghi audit log ngầm, không dựng màn log.
- Điểm vào: icon mắt trên từng dòng danh sách + nút trong màn chi tiết hồ sơ.

## 16. Export (Enh 4)

- Cho LM, HRBP, L&OD. Export được cả khi kỳ đang chạy.
- **File tổng hợp (Excel)**: 1 dòng/NV, dùng cho bulk.
- **File chi tiết (PDF)**: 1 file/NV - goal, nhận xét.
- **Không** kèm điểm LM2/HOD. File của LM và của HRBP giống nhau. LM thấy cột final rating trước publish.

## 17. Xóa mục tiêu (Enh 3)

- Chỉ NV xóa được, chỉ với goal `Lưu nháp` hoặc `Từ chối`.
- **Soft-delete**: ẩn khỏi danh sách NV, vẫn lưu để tra cứu và audit.
- Có dialog xác nhận, không bắt nhập lý do.

## 18. Tab và dữ liệu chưa lưu (Enh 11, 12)

Tab set: `Mục tiêu` - `Đánh giá giữa năm` - `Đánh giá cuối năm`. Không thêm tab.

Màn Nhân viên (chốt lại 27/09/2026, §18.4): nhãn trên tab **Đánh giá giữa năm** và **Đánh giá cuối năm**
nói **giai đoạn của kỳ**, giống nhau cho mọi nhân viên; tab **Mục tiêu** có nhãn theo việc cần làm khi
còn thiếu mục tiêu. Màn Quản lý giữ nhãn theo việc của vai đang xem (§47).
Tab chưa mở: viền đứt nét, tooltip `Bắt đầu từ dd/mm/yyyy`.

### 18.1 Cách hiển thị ba trạng thái của tab

Tab nghỉ **không để nền trắng**. Nền trang là `--z50` nên tab trắng chìm hẳn, đọc ra
thành chữ trôi nổi chứ không ra hình cái tab.

| Trạng thái | Nền | Viền | Chữ |
|---|---|---|---|
| Nghỉ | `--z100` | `--z300` liền | `--z700`, weight 600 |
| Trỏ tới | `--z0` | `--z400` liền | `--z900` |
| Đang chọn | `--brand-muted` | `--brand-ring` liền, kèm vạch `--brand` 3px ở đỉnh | `--brand`, weight 700 |
| Khóa | `--z50` | `--z300` đứt nét | `--z400` |

Đường kẻ chân dải tab dùng `--z300` (không phải `--z200`) để ra hình dải tab.
Tab khóa nhạt hơn tab nghỉ là cố ý: nhìn là biết bấm không được.

Nhãn trạng thái trên tab: 9.5px, cao 16px, đặt ở `top:-8px` để đứng trên mép trên
của tab như một dải ruăng. Cỡ 8px cũ quá nhỏ và vắt nửa ra ngoài, trông như bị lọt khỏi tab.

Cách hiển thị này áp cho cả `E-05` và `M-06`.

Không auto-save. Có dữ liệu chưa lưu mà rời màn (đổi tab, đổi NV, breadcrumb, đóng tab trình duyệt, đổi kỳ) thì hiện dialog tiêu đề **Nội dung chưa được lưu**, có nút X đóng, 3 nút **cùng một hàng** căn phải:
`Rời đi, không lưu` (viền xám) - `Tiếp tục chỉnh sửa` (viền xám) - `Lưu nháp` (nền hồng, nút chính).
Không lặp lại cụm "chuyển tab" trong tên nút vì dialog dùng chung cho mọi cách rời màn.

## 18.2 Tab Đánh giá giữa năm: hai lý do "không có kết quả"

Chốt ngày 18/09/2026. Hai lý do khác hẳn nhau, cho ra **hai hành vi UI khác nhau**:

| Lý do | Tab |
|---|---|
| Onboard **sau 01/04/2026** → không thuộc kỳ giữa năm | **Khóa**, bấm không vào được, tooltip nêu lý do |
| Thuộc kỳ nhưng không hoàn tất bước bắt buộc (NV không làm, hoặc không có kết quả của Quản lý) | **Vẫn mở**, chỉ xem |

Nhãn tab của màn Nhân viên thì **không** phân biệt hai lý do: kỳ cuối năm đã mở nên kỳ giữa năm luôn
`Đã hoàn tất` với mọi người, kể cả người không có kết quả (§18.4, chốt 27/09/2026).

- Hạn onboard của kỳ giữa năm là `myrOnboardCutoff = 2026-04-01`, **khác** hạn của kỳ cuối năm
  (`onboardCutoff = 2026-10-01` ở §5). Một người có thể thuộc kỳ cuối năm mà không thuộc
  kỳ giữa năm — ví dụ onboard tháng 6.
- Luật suy từ model qua `p.myrEligible`, màn hình không tự kiểm tra lại ngày onboard.
- Đang đứng ở tab vừa bị khóa thì đưa về tab Mục tiêu, giống cách xử lý tab Đánh giá
  cuối năm ở §5.
- Hồ sơ để đối chiếu: `y15` (khóa) và `e6` (mở, không có kết quả), mở bằng deep link `E-05/index.html?demo=1&emp=y15`.
- Tab Đánh giá cuối năm không nhắc gì tới việc không có kết quả giữa năm (§40.5c).

## 18.3 Kết quả giữa năm đã hoàn thành khi Quản lý thay đổi

Chốt ngày 22/09/2026 cho trường hợp `nv04`: Quản lý trực tiếp tại kỳ giữa năm và
Quản lý trực tiếp hiện tại là hai người khác nhau.

Khi Nhân viên mở lại tab **Đánh giá giữa năm** từ `E-05`, hoặc Quản lý mở lại tab này
từ màn chi tiết `M-06`, box xanh trên cùng hiển thị thông tin ở cấp hồ sơ, trước các
nhóm mục tiêu:

- trạng thái `Đã hoàn thành Đánh giá giữa năm 2026`;
- `Quản lý trực tiếp tại kỳ giữa năm: Tên (domain)`;
- `Điểm tự đánh giá`;
- `Điểm cuối cùng` — không dùng `Điểm của QLTT` tại vị trí này.

Header nhân viên vẫn hiển thị Quản lý trực tiếp **hiện tại**. Người đã đánh giá giữa
năm là snapshot lịch sử bất biến trong kết quả MYR (`PMS_MYR[empId].lm1By`), không
suy từ `employee.mgr`. Không lặp tên người đánh giá tại từng mục tiêu.

Ở thời điểm mở kỳ cuối năm, MYR là dữ liệu lịch sử: nếu đã có `final`, tab luôn ở trạng
thái **Đã hoàn tất**, toàn bộ nội dung chỉ xem và không còn hành động Lưu nháp/Gửi lại.
Hồ sơ `y3` (Quản lý kỳ giữa năm khác kỳ cuối năm) dùng để kiểm tra box xanh này, qua tình huống `nv10`
(§46); tab Giữa năm chỉ là dữ liệu lịch sử khi đang ở một tình huống (MYR-SPEC §2a).

Box tham chiếu trên tab **Đánh giá cuối năm** chỉ hướng người dùng sang tab giữa năm;
không hiển thị người chấm tại đó. Như vậy thông tin lịch sử chỉ có một nguồn hiển thị
trong box xanh của tab **Đánh giá giữa năm**, tránh mâu thuẫn với Quản lý hiện tại.

### 18.4 Nhãn trên ba tab của màn Nhân viên

Chốt lại ngày 27/09/2026, thay bảng nhãn theo trạng thái hồ sơ. **Nhãn tab đánh giá không đổi theo
trạng thái của từng người**: mọi nhân viên cùng thấy một nhãn tại cùng một ngày. Việc cụ thể của từng
người (cần tự đánh giá, chờ Quản lý, thiếu mục tiêu…) nằm trong nội dung tab.

| Tab | Luật | Nhãn | Màu |
|---|---|---|---|
| Đánh giá cuối năm | `PMSYer.yerPhase(now)`: trước ngày mở Tự đánh giá | `Chưa mở` (tab khóa) | xám |
| | từ ngày mở tới trước ngày Công bố | `Đang hoạt động` | xanh |
| | từ ngày Công bố | `Đã hoàn tất` | xám |
| Đánh giá giữa năm | không ở tình huống demo (MYR-09a) | `Đang hoạt động` | xanh |
| | ở tình huống demo, kỳ cuối năm đã mở | `Đã hoàn tất`, **mọi người**, kể cả không có kết quả | xám |
| Danh sách mục tiêu | `PMSYer.goalAction(p)`: thiếu mục tiêu và hạn Tự đánh giá chưa qua | `Cần thiết lập mục tiêu công việc` / `Cần thiết lập mục tiêu phát triển` / `Cần thiết lập mục tiêu` (thiếu cả hai) | xanh, cùng kiểu nhãn `Đang hoạt động` |
| | còn lại | không có nhãn | |

- Hết hạn Tự đánh giá thì tab Mục tiêu không còn nhãn: mục tiêu còn thiếu đi theo file nộp trễ (§27.1).
- Tab đầu đổi tên thành **`Danh sách mục tiêu`** (27/09/2026) ở E-05 và M-06. Tab rộng hơn nên nhãn dài nhất
  vẫn nằm gọn trong tab; nhãn neo mép trái (`left:5px`) và có `z-index:2` để không bị tab kế bên che chữ.
- Tab khóa vẫn giữ nhãn giai đoạn; lý do khóa nằm ở tooltip (`Không thuộc kỳ Đánh giá cuối năm 2026`,
  `Onboard sau 01/04/2026 nên không thuộc kỳ Đánh giá giữa năm 2026`, `Bắt đầu từ dd/mm/yyyy`).
- Câu chữ nằm ở `PHASE_LABEL` trong `assets/yer-employee.js`.

## 19. Song ngữ

- Toggle VI/EN ở topbar góc phải. Mặc định tiếng Việt. Nhớ lựa chọn giữa các màn.
- Chỉ dịch label hệ thống. Nội dung người dùng nhập (goal, nhận xét, response) giữ nguyên.

## 20. Dữ liệu prototype

- Nguồn chung: `assets/employees-data.js` (16 NV, MYR scores, self/LM eval) - **không sửa** để snapshot MYR khớp màn Goal và MYR đã duyệt.
- YER thêm ở `assets/yer-data.js`: 8 NV mới + `window.PMS_YER` + 20 tình huống.
- Lưu trạng thái thao tác: `localStorage` qua `assets/yer-store.js` (lớp lưu trữ tách riêng, đổi sang backend chỉ sửa file này).
- Thanh Demo Control: đổi vai trò, time machine theo ngày hệ thống, chọn nhân sự, reset. Phím tắt `D` để ẩn/hiện.
- Deep link: `?role=lm&date=2027-02-10&emp=e7`.

## 21. Thứ tự dựng màn hình

| Cụm | Nội dung | Enhancement | Trạng thái |
|---|---|---|---|
| 0 | Seed data, Demo Control, time machine, store, song ngữ, spec | nền | Xong |
| 1 | Rating selector, tab, popup dữ liệu chưa lưu | 10, 11, 12 | Xong |
| 2 | Màn Nhân viên `E-05`: tự đánh giá, xem kết quả, thai sản, xóa mục tiêu (Employee Response đã bỏ, §10; snapshot MYR đã thay bằng §28) | 2, 3, 8 | Xong |
| 3 | Màn Quản lý gộp LM/LM2/HOD: danh sách và chấm điểm. Còn lại (upload, duyệt điểm hiệu chuẩn, AI Copilot) chuyển sang đợt 3b ở §38 | 1, 6, 8, 9 | Xong |
| 4 | HRBP / L&OD / TR / HR Director: danh sách, chi tiết, export, proxy view, upload điểm cuối | 4, 7 | Chưa làm |

Kèm theo: `YER-demo/index.html` (bảng điều hướng 38 tình huống, §46) và `YER-DEMO-SCRIPT.md` (kịch bản trình bày) - làm ở cụm 4.

## 22. File đã tạo ở cụm 0

| File | Vai trò |
|---|---|
| `assets/yer-data.js` | 8 nhân sự mới, mục tiêu phát triển bổ sung, dữ liệu MYR cho nhân sự mới, sự kiện YER, 38 tình huống (§46), timeline, thang điểm |
| `assets/yer-store.js` | Lớp lưu trữ (localStorage). Đổi sang backend chỉ sửa phần DRIVER |
| `assets/yer-model.js` | Suy ra trạng thái theo ngày hệ thống: auto-sync, điều kiện tham gia, quyền xem, trạng thái danh sách |
| `assets/yer-i18n.js` | Từ điển VI/EN theo nhóm màn hình + nút chuyển ngôn ngữ |
| `assets/yer-demo.js` | Thanh Demo Control: vai trò, nhân sự, ngày hệ thống, reset. Phím `D` ẩn/hiện |
| `YER-demo/index.html` | Bảng điều hướng tình huống + bảng kiểm trạng thái suy ra |

## 23. File đã tạo ở cụm 1

| File | Vai trò |
|---|---|
| `assets/yer-ui.js` | `PMSUi.rating` (hàng nút điểm + định nghĩa), `PMSUi.tabs` (tab chu kỳ có trạng thái), `PMSUi.dirty` (cảnh báo chưa lưu), `PMSUi.dialog`, `PMSUi.toast` |
| `YER-demo/components.html` | Trang review 3 component nền tảng |

Ghi chú kỹ thuật:
- `PMSUi.rating(el, {step:'int'|'half', value, readonly, label, required, onChange})` - `int` cho điểm mục tiêu, `half` cho điểm toàn diện.
- `PMSUi.tabs(el, {active, items:[{key,label,state,disabled,openFrom,dot}], onSelect})` - tự gọi `PMSUi.dirty.guard` trước khi đổi tab.
- `PMSUi.dirty.watch(scope)` bắt mọi input/textarea/select/contenteditable; `PMSUi.dirty.onSaveDraft(fn)` gắn hành vi lưu nháp của từng màn.

## 24. File đã tạo ở cụm 2

Màn Nhân viên của YER **không phải màn mới**. Nó là **tab End-Year Review nằm trong chính màn `E-01`**
(Mục tiêu và Đánh giá cá nhân), dùng lại nguyên ngôn ngữ thiết kế của tab Mid-Year Review:
breadcrumb, emp-chip, chọn chu kỳ, tab bar, toolbar Lưu nháp / Gửi tự đánh giá, `stepper-card`,
`info-note`, `rv-section` + `rv-grid`, cặp `scmt-panel` cho nhận xét NV và QLTT, `overall-card`,
`submit-banner`.

| File | Vai trò |
|---|---|
| `E-05/index.html` | Bản sao `E-01` với tab End-Year Review được bật và mở sẵn. Tab Mục tiêu và Mid-Year giữ nguyên nội dung đã duyệt của `E-01` |
| `assets/yer-employee.js` | Render toàn bộ nội dung tab End-Year Review theo dữ liệu và ngày hệ thống |

Nội dung tab End-Year Review theo thứ tự: toolbar → banner trạng thái → dải quy trình →
banner đặc thù (thiếu mục tiêu, thai sản) → 3 nhóm mục tiêu → Đánh giá toàn diện.

Quy ước riêng của màn Nhân viên:
- Dải quy trình tên là **Quy trình và Thời gian đánh giá cuối năm 2026**, dạng gọn, **không đánh số**,
  chỉ 5 bước nhân viên cần biết: Tự đánh giá, Quản lý trực tiếp, Quản lý cấp 2, Trưởng đơn vị, Công bố kết quả.
  Hai bước nội bộ của HR (Total Reward tải điểm, HR Director duyệt) không hiển thị cho nhân viên.
- **Có khối Lưu ý** ngay dưới dải quy trình (sửa ngày 16/09/2026, xem §40).
  **Không có khối Kết quả kỳ giữa năm** — kết quả đó để ở tab Đánh giá giữa năm.
- **Không có card Điểm cuối cùng riêng**. Sau khi nộp, banner trạng thái hiện **Điểm tự đánh giá**;
  sau khi công bố, banner hiện thêm **Kết quả cuối cùng** dưới dạng điểm số, không kèm tên
  mức. Banner luôn có nút tải PDF như màn MYR.
- Ô nhận xét ở trạng thái chỉ xem giữ nguyên khung `ev-editor-wrap`, bỏ thanh công cụ, nền xám nhạt.

Quy ước dữ liệu ghi vào store:
- `acts[emp].selfDraft` - bản nháp tự đánh giá, không tính là đã gửi.
- `acts[emp].self` - bản đã gửi, có `at` nên model coi là đã submit.
- `acts[emp].deletedGoals.ids` - danh sách mục tiêu đã xóa mềm.

Khi gộp vào sản phẩm thật, toàn bộ tab này chuyển thẳng vào `E-01`, `E-05` chỉ là bản dựng để review.

Bổ sung ngày 27/09/2026 theo code:
- Khối cảnh báo thiếu mục tiêu có hai biến thể. Còn trong hạn tự đánh giá: tiêu đề
  `Bạn chưa đủ điều kiện thực hiện đánh giá cuối năm`, câu cuối dẫn sang tab Mục tiêu, nút `Tới tab Mục tiêu`.
  Đã hết hạn: tiêu đề `Bạn không thể thực hiện Tự đánh giá cuối năm`, câu cuối ghi hồ sơ được ghi nhận là
  Không đánh giá, nút `Xem danh sách mục tiêu`.
- Hết hạn tự đánh giá mà chưa gửi (không thai sản, không thiếu mục tiêu): một khối `Thời gian nộp trễ đã
  kết thúc lúc 18:00 ngày dd/mm/yyyy`, ngày là hạn nộp bổ sung ở §27.1. Không hiện khi đã có khối cảnh
  báo thiếu mục tiêu, để không thành hai box (§40.5a).
- Điểm QLTT là điểm hệ thống tự chép (§6): nhân viên không thấy điểm từng mục tiêu và nhận xét của QLTT.
  Ô nhận xét nhóm ghi `Quản lý không gửi nhận xét trong kỳ này`; ô toàn diện ghi `Quản lý không gửi
  đánh giá chi tiết`, `Hệ thống ghi nhận điểm theo quy định khi quá hạn`.
- Ô của QLTT khi chưa có dữ liệu ghi theo tình huống: chờ nhân viên gửi, QLTT sẽ nhận xét trong bước của
  mình, hoặc `Không có Tự đánh giá. Quản lý tiếp tục đánh giá theo quy trình`, kèm `Mở từ dd/mm/yyyy`.
- Banner sau công bố: tiêu đề `Đã công bố kết quả đánh giá cuối năm 2026`. Nút tải PDF chỉ có icon, có tooltip.
- Ô bắt buộc khi gửi tự đánh giá: điểm từng mục tiêu chưa khóa (§13.1), nhận xét nhóm công việc và phát
  triển khi nhóm đó có mục tiêu, điểm cả năm giá trị cốt lõi, nhận xét nhóm hành vi, điểm và nhận xét toàn
  diện. Hộp thoại báo thiếu liệt kê tối đa 6 mục rồi ghi `và N mục khác`.

---

# PHẦN II — ENHANCEMENT 2H2026

> Nguồn: `YER Enhancement 2H2026.docx` (PMS Enhancement Proposal – 2H 2026).
> Chốt ngày 16/09/2026. Phần này **đè lên** Phần I ở những chỗ ghi rõ "thay §x".

## 25. Quy ước mã số

File đề xuất đánh mã `E01`–`E15`. Repo đã dùng `E-01`, `E-05` làm **mã màn hình**, và
Phần I dùng `Enh 1`–`Enh 12` làm mã yêu cầu. Ba bộ mã này khác nhau hoàn toàn.

Để khỏi nhầm, từ đây mã của file đề xuất luôn viết đủ tiền tố **`ENH-E02`**, `ENH-E13`…
Không viết tắt thành `E02`. Mã màn hình giữ nguyên dạng có gạch: `E-01`, `E-05`, `M-01`, `M-02`.

## 26. Danh mục enhancement và màn hình bị chạm

| Mã | Tên gọn | Nhóm | Màn hình |
|---|---|---|---|
| ENH-E13 | Thang điểm và cách chọn mức | Must | nền dùng chung |
| ENH-E14 | User journey khi vào màn YER | Must | nền dùng chung |
| ENH-E15 | Cảnh báo dữ liệu chưa lưu | Must | nền dùng chung |
| ENH-E05 | Đóng băng mục tiêu trong kỳ YER | Must | `E-05`, màn Quản lý |
| ENH-E03 | Điều hướng sang kết quả Mid-Year | Must | màn Quản lý |
| ENH-E10 | Nghỉ thai sản | Must | `E-05`, màn Quản lý |
| ENH-E02 | Nộp trễ và trả về gối đầu | Must | `E-05`, màn Quản lý |
| ENH-E01 | Tự lọc danh sách nhân viên cần đánh giá | Must | màn Quản lý |
| ENH-E06 | Báo cáo tổng hợp theo từng nhân viên | Must | màn HR |
| ENH-E09 | Proxy View | Must | màn HR |
| ENH-E08 | AI Performance Copilot | Should | màn Quản lý |

## 27. ENH-E02 — Nộp trễ và trả về gối đầu

Hai luồng riêng, không trộn vào nhau.

### 27.1 Nhân viên nộp trễ bằng file import

**Thay §5.** Trước đây thiếu mục tiêu là chặn hẳn, gắn `Không đánh giá` và dừng quy trình.
Nay nhân viên trễ hạn **tự nộp một file gồm cả mục tiêu và nội dung tự đánh giá**.

**Cửa sổ nộp trễ** (chốt lại 27/09/2026, thay rule cũ "hạn QLTT trừ 3 ngày"): gồm **bốn lần nhắc**,
xem §27.3. Mở từ ngày làm việc đầu tiên sau hạn Tự đánh giá và đóng lúc 18:00 hạn của lần nhắc thứ tư,
với timeline hiện tại là **03/02/2027**. Mô hình: `lateWindowOpen = now > step('self').to && now <=
lateSubmissionDeadline()`.

**Ai thấy màn nộp trễ.** Mọi nhân viên chưa tự đánh giá trong cửa sổ này, **bất kể tình
trạng mục tiêu**. Ba trường hợp đều vào cùng một luồng:

| | Tình trạng mục tiêu | Nhân sự mẫu |
|---|---|---|
| 1 | Đủ mục tiêu đã duyệt | `y9` Nguyễn Mai Anh |
| 2 | Thiếu một loại, ví dụ mục tiêu phát triển | `y10` Trần Quốc Huy |
| 3 | Chưa có mục tiêu nào | `y11` Lê Minh Châu |

**Hai trường hợp KHÔNG vào luồng này:**

- **Đã nghỉ việc**: hồ sơ chỉ để tra cứu.
- **Đang nghỉ thai sản**: §12 đã miễn bước tự đánh giá cho nhóm này, nên không được hiện
  màn `Quá hạn tự đánh giá`, không báo cửa sổ nộp trễ đã đóng, nhãn tab giữ nguyên
  `Không yêu cầu tự đánh giá`. Chốt ngày 17/09/2026. Nhân sự mẫu: `e4` Vũ Thị Lan.

**Giao diện khi quá hạn** (chốt lại 28/09/2026, thay màn nộp trễ chiếm cả tab):

1. Tab Đánh giá cuối năm vẫn hiển thị **như nhân viên bình thường**: dải quy trình, ba nhóm mục tiêu, khối
   Đánh giá toàn diện. Vì đã quá hạn nên mọi ô chọn điểm và ô nhận xét đều **khóa** (chỉ xem). Không có
   toolbar Lưu nháp và Gửi. Mục tiêu còn thiếu đi theo file nộp bổ sung, nên không dựng thêm khối cảnh báo
   thiếu mục tiêu.
   Trên cùng là **một khối thông báo** (`.yer-note.yer-late-note`) chỉ nói về lần nhắc đang mở (§27.3). Chốt lại
   28/09/2026:
   - màu **vàng cảnh báo**: nền `--warn-bg`, viền `--warn-bd`, icon `--warn`; tách khỏi khối hồng của việc cần làm thường;
   - tiêu đề 14.5px/700 `Bạn đã quá hạn Tự đánh giá cuối năm - Lần nhắc thứ k`; chỉ nói lần thứ mấy, không ghi tổng số lần;
   - `Hạn Tự đánh giá đã kết thúc ngày dd/mm/yyyy **(trễ n ngày làm việc)**. Bạn cần hoàn thành nộp bổ sung trước
     **18:00 ngày dd/mm/yyyy**.`;
   - `Hình thức xử lý: …` **chỉ hiện khi lần này đã có hình thức áp dụng** (lần 3 và 4);
   - `Lưu ý: nếu quá hạn trên mà vẫn chưa nộp, …` là **câu đầy đủ theo nội dung quy định**, chỉ gọn lại, không rút
     thành cụm từ (chốt 28/09/2026). Không lặp lại hạn nộp đã nói ở câu trên:

     | Lần | Hình thức xử lý | Lưu ý: nếu quá hạn trên mà vẫn chưa nộp, … |
     |---|---|---|
     | 1 | (không hiện) | hệ thống sẽ gửi nhắc nhở lần thứ 2 vào ngày dd/mm/yyyy. Sau 2 lần nhắc nhở và cho cơ hội mà nhân viên vẫn chưa hoàn thành Tự đánh giá, các biện pháp xử lý tiếp theo sẽ được áp dụng theo quy định Công ty. |
     | 2 | (không hiện) | các biện pháp xử lý tiếp theo sẽ được áp dụng theo quy định Công ty, bắt đầu từ việc giới hạn điểm đánh giá toàn diện tối đa là 3. |
     | 3 | Điểm đánh giá toàn diện được giới hạn tối đa là 3. | bạn có thể bị cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo, tính từ ngày nhắc nhở lần thứ tư (dd/mm/yyyy). |
     | 4 | giới hạn điểm tối đa 3, và câu đầy đủ về cắt giảm thưởng, tạm hoãn 6 tháng, người đề xuất và phê duyệt, thời gian tạm hoãn | Công ty có thể sẽ đánh giá và áp dụng các hình thức kỷ luật phù hợp theo Nội quy lao động đã quy định. |

     Câu gốc nằm ở `LATE_TEXT` trong model, dùng chung cho khối này, banner sau khi nộp và popup xác nhận gửi file;
   - chưa xác nhận: ô đánh dấu `Tôi đã đọc, hiểu và xác nhận tiếp tục.` và nút `Xác nhận và tiếp tục` (khóa tới
     khi đánh dấu). Bấm thì lưu xác nhận và mở ngay **popup** `Nộp bổ sung hồ sơ Đánh giá cuối năm`;
   - đã xác nhận: dòng `Bạn đã xác nhận ngày dd/mm/yyyy` và nút `Nộp bổ sung` để mở lại popup.
   Không còn dải bốn lần nhắc, ô đếm ngày còn lại, badge riêng hay bảng thông báo lặp lại (bỏ ngày 28/09/2026).
   Popup rộng 720px, không có chân popup; nội dung là dòng `Hoàn thành 3 bước dưới đây trước 18:00 ngày …`
   rồi ba bước bên dưới.
2. Luồng thao tác gồm **ba hàng bước MECE theo chiều dọc**. Mỗi hàng gồm `nhãn bước →
   nội dung và action liền kề`; nút không bị đẩy sang mép phải tạo khoảng trống lớn:
   - **Bước 1 — Tải xuống Template và điền thông tin theo đúng định dạng**: không có
     mô tả phụ; CTA `Tải Template` nằm trong thẻ;
   - **Bước 2 — Điền đủ Mục tiêu đã thống nhất với Quản lý trực tiếp và hoàn thiện phần
     Tự đánh giá**: không có mô tả lặp lại; ghi rõ business rule `Quản lý không duyệt lại
     mục tiêu trên hệ thống với trường hợp nhân viên trễ hạn Tự đánh giá.`;
   - **Bước 3 — Tải lên tập tin đã điền thông tin**: không hiện mô tả định dạng hoặc
     khối `Chưa chọn file`; nút luôn giữ nhãn `Chọn file`, dùng icon upload và đặt ngay
     cạnh tiêu đề. Sau khi chọn, tên file hiện thành một dòng trạng thái gọn kèm icon
     thùng rác để xóa file; icon có tooltip và nhãn hỗ trợ truy cập nhưng không hiện text
     `Xóa file`. Không dựng card riêng. Input vẫn chỉ nhận `.xlsx` hoặc `.xls`, một file duy nhất.
3. CTA `Gửi Quản lý trực tiếp` nằm ở góc phải cuối khối, luôn dùng đúng màu primary
   `--brand` để nhận ra hành động chính; không chuyển thành nút xám khi chưa có file.
   Bấm khi chưa chọn file thì hiện validation yêu cầu chọn file. Khi đã có file, CTA mở
   popup xác nhận gồm ba ý liền mạch: mục tiêu đã thống nhất với Quản lý trực tiếp; người
   dùng chỉ có một lần gửi duy nhất; sau khi gửi Tự đánh giá không thể thu hồi hoặc chỉnh
   sửa bất cứ nội dung nào. Popup có tiêu đề
   `Gửi nội dung Tự Đánh giá cuối năm`, nút `Kiểm tra lại` và CTA `Xác nhận và Gửi`.
   Đây là bước xác nhận quan trọng dùng chung cho mọi hồ sơ nộp trễ: in đậm các cụm
   `các mục tiêu`, `đã được thống nhất`, `Bạn chỉ có 1 lần gửi duy nhất` và `không thể
   thu hồi hoặc chỉnh sửa`. Ba ý dùng cùng một bố cục nội dung trong thân popup, không
   tách cảnh báo thành highlight box và không dùng icon khóa.
   Header của riêng popup này là một vùng tách biệt: nền `#FFF7FB`, viền dưới
   `#F0D7E5`, không có vạch màu bên trái, tiêu đề 16px/700. Không đổi header của các
   popup dùng chung khác.
   Gửi thành công thì cập nhật dữ liệu, báo thành công và chuyển sang giao diện hồ sơ đã gửi.
4. Icon của từng bước là phần tử trình bày màu xám, đặt **trước** nhãn `Bước 1`…`Bước 3`
   và **không phải button**. Mọi action đều dùng button có nhãn rõ ràng; không dùng icon
   đơn lẻ làm CTA.
5. Badge quá hạn dùng cùng hệ màu thương hiệu với header rose-neutral: nền `#FCEBF5`,
   viền `#F0D7E5`, chữ/icon `--brand`; không dùng màu đỏ/cam khác hệ.

**File mẫu.** Bấm `Tải Template`:

- Chưa có mục tiêu đã duyệt → tải ngay mẫu trống.
- Có mục tiêu đã duyệt → tải ngay file đã điền sẵn **toàn bộ mục tiêu được duyệt**.
- Không mở popup chọn loại file; hệ thống tự xác định nội dung theo dữ liệu mục tiêu hiện có.

File nằm ở `assets/templates/`, bản dựng có bốn file: mẫu trống và các bản đã điền sẵn
của `y9`, `y10`, `y14` — đủ cho toàn bộ tình huống nộp trễ hiện có. Hồ sơ có mục tiêu đã duyệt mà
không có file dựng sẵn thì báo `Chưa có file mẫu cho hồ sơ này. Vui lòng liên hệ HR.`
Chọn file không phải `.xlsx` hoặc `.xls` thì báo lỗi và bỏ file đó.

**Sau khi nộp**, hồ sơ chuyển thẳng sang bước Quản lý trực tiếp:

- Mục tiêu trong file vào thẳng, trạng thái `imported`, **không qua bước duyệt mục tiêu**.
- Bản tự đánh giá ghi `source: 'file-import'` kèm tên file.
- Trạng thái danh sách và nhãn tab: `Nộp trễ hạn - Chờ Quản lý`.
- Banner Nhân viên ghi `Đã hoàn thành bổ sung Tự đánh giá cuối năm`; dòng dưới hiển thị
  `Ngày gửi: dd/mm/yyyy - Trễ hạn x ngày làm việc`. Số ngày trễ đếm theo **ngày làm việc** (§27.3);
  `Trễ hạn x ngày làm việc` là **một nhãn** rose-neutral màu thương hiệu (chốt 28/09/2026). Dòng tiếp theo trong
  chính banner: `Hình thức xử lý theo quy định (nộp ở lần nhắc nhở k/4): …`. Không dựng khối riêng bên dưới
  nữa vì trùng thông tin với banner. Hai dòng này luôn có, kể cả sau khi công bố kết quả.
- Màn Quản lý đọc được mục tiêu import và chấm bình thường. Mọi hồ sơ từ luồng nộp bổ
  sung bằng file đều có badge `Trễ hạn x ngày làm việc - nhắc nhở lần k/4` nổi bật tại khối cảnh báo để
  Quản lý nhận diện ngay, dùng cùng phép tính và hệ màu với banner Nhân viên.

**`Không đánh giá`** chỉ xuất hiện khi **hết cả bốn lần nhắc** mà vẫn thiếu mục tiêu và
không có file nào được nộp. Khi đó màn Nhân viên chỉ còn một khối nổi (`.yer-note.action.yer-late-closed`):
`Thời gian nộp bổ sung Tự đánh giá đã kết thúc lúc 18:00 ngày dd/mm/yyyy.` kèm câu hình thức kỷ luật;
không dựng khối `Lưu ý` nữa. Mô hình: `stopped` cần đủ ba điều kiện — thiếu mục tiêu,
đã qua `lateSubmissionDeadline`, và không có `lateSubmission`.

**Nhắc**: nhân viên trễ hạn và Quản lý đang phụ trách sau cut-off 31/12/2026 đều nhận nhắc.
Prototype không dựng inbox thông báo, chỉ hiện badge và banner trên màn.

**Giới hạn của bản dựng**, phải thay khi làm thật:

- Bản dựng **không đọc nội dung file Excel**. Nộp xong, hệ thống sinh sẵn một bộ điểm và
  nhận xét mẫu để luồng đi tiếp được. Bản thật phải parse file và có bước đối soát.
- Prototype dùng file Excel dựng sẵn theo từng hồ sơ demo. Bản thật cần sinh file động từ
  toàn bộ mục tiêu đã duyệt của nhân viên tại thời điểm tải.

### 27.2 Trả về để chỉnh sửa

- **Bỏ tính năng Quản lý trực tiếp trả Self Assessment về cho Nhân viên.** Không hiển thị
  nút, popup hay trạng thái trả về ở bước QLTT.
- **Quản lý cấp 2 vẫn có thể trả về cho Quản lý trực tiếp**, với hạn nộp lại 24 giờ.
- Deadline của từng vai **giữ nguyên**, không giãn ra vì có lần trả về.
- Quá 24 giờ mà chưa nộp lại: hồ sơ quay về trạng thái trước khi trả về, quy trình đi tiếp.
- Trạng thái mới: `Bị trả về để chỉnh sửa`, kèm tên người trả về và lý do.

Chốt ngày 27/09/2026 theo cách dựng:
- Lý do trả về **bắt buộc** nhập trong hộp thoại. Người trả về lấy từ `PMSYer.actors(p).lm2`.
- Trong 24 giờ bị trả về, QLTT **sửa lại được dù timeline QLTT đã đóng**. Prototype tính theo ngày:
  còn hiệu lực tới hết ngày hôm sau ngày trả về.
- QLTT gửi lại thì lần trả về hết hiệu lực. Hết hạn mà chưa gửi lại thì hồ sơ tự quay về trạng thái
  trước đó, không cần ai thao tác.
- M-06 hiện khối `Bị trả về để chỉnh sửa`: người trả về (domain), hạn nộp lại, lý do.
- Nhãn: QLTT thấy `Bị trả về để chỉnh sửa`, LM2 thấy `Chờ QLTT đánh giá`, nhân viên vẫn thấy `Chờ Quản lý cấp 2`.

Không dựng Opt 1 (nhân viên tự sửa trong deadline của mình).

### 27.3 Bốn lần nhắc nộp bổ sung và hình thức xử lý

Chốt ngày 27/09/2026. Luật nằm ở `assets/yer-model.js` (`lateRounds`, `lateRound`, `lateText`), màn chỉ render.

**Đếm ngày.** Hệ thống đếm **ngày làm việc** thứ 2 đến thứ 6, không tính thứ 7, chủ nhật và ngày lễ
(`PMS_YER_HOLIDAYS` trong `yer-data.js`, dữ liệu mẫu, bản thật lấy lịch nghỉ lễ HR công bố). Số ngày trễ
= số ngày làm việc từ sau hạn Tự đánh giá tới hết ngày nộp (`lateDays`).

**Lịch nhắc.** Lần 1 ngay ngày làm việc đầu tiên sau hạn chót; các lần sau cách nhau 3 ngày làm việc. Mỗi
lần là một cơ hội nộp bổ sung, hạn 18:00 ngày làm việc thứ ba của lần đó. Với hạn Tự đánh giá 18/01/2027:

| Lần | Nhắc ngày | Hạn nộp | Nộp trong lần này thì | Quá hạn lần này thì |
|---|---|---|---|---|
| 1 | 19/01/2027 | 18:00 21/01/2027 | chưa áp dụng xử lý | nhắc lần 2 |
| 2 | 22/01/2027 | 18:00 26/01/2027 | chưa áp dụng xử lý | sau 2 lần nhắc, biện pháp xử lý tiếp theo áp dụng theo quy định Công ty, bắt đầu từ điểm toàn diện tối đa là 3 |
| 3 | 27/01/2027 | 18:00 29/01/2027 | điểm đánh giá toàn diện tối đa là 3 | có thể cắt giảm một phần thưởng, tạm hoãn thăng chức và tăng lương 6 tháng |
| 4 | 01/02/2027 | 18:00 03/02/2027 | điểm tối đa 3, và có thể cắt giảm một phần thưởng, tạm hoãn thăng chức và tăng lương 6 tháng tính từ ngày nhắc lần 4 (01/02 đến 01/08/2027); việc áp dụng cụ thể do HOD phối hợp HOHR đề xuất, CEO hoặc người được ủy quyền phê duyệt | Công ty có thể áp dụng hình thức kỷ luật theo Nội quy lao động |

- Hình thức xử lý **cộng dồn** theo lần nộp. Giới hạn điểm tối đa 3 **chỉ là thông báo**, hệ thống không chặn điểm.
- **Xác nhận đã đọc.** Trước khi mở popup tải lên, nhân viên phải đọc thông báo của **đúng lần nhắc đang mở**
  và đánh dấu `Tôi đã đọc, hiểu và xác nhận tiếp tục.` (§27.1). Lưu ở `acts.lateAck = { round, at }`; sang lần
  nhắc mới phải xác nhận lại vì hình thức xử lý đổi.
- Màn chỉ hiện nội dung của lần nhắc đang mở, không liệt kê cả bốn lần.
- Popup xác nhận gửi file thêm câu: hồ sơ được ghi nhận trễ n ngày làm việc, ở lần nhắc k/4, kèm hình thức xử lý.
- **Sau khi nộp**, banner xanh ghi nhãn `Trễ hạn x ngày làm việc` và dòng `Hình thức xử lý theo quy định (nộp ở
  lần nhắc nhở k/4): …` (§27.1).

**Hạn chấm của QLTT với hồ sơ nộp bổ sung** (chốt 28/09/2026). Lần nhắc thứ tư chạy qua hạn chung của QLTT
(01/02/2027), nên hồ sơ nộp bổ sung có hạn riêng: **3 ngày làm việc kể từ ngày nhân viên nộp**, nếu mốc đó muộn
hơn hạn chung (`PMSYer.lmDeadline(lateSubmission)`, `p.lmDeadline`). Hồ sơ khác vẫn dùng hạn chung.

| Nộp ngày | Hạn chấm của QLTT |
|---|---|
| trước hoặc bằng 27/01/2027 | 01/02/2027 (hạn chung) |
| 28/01/2027 (`y12`) | 02/02/2027 |
| 02/02/2027 (`y16`) | 12/02/2027 (bỏ qua ngày lễ mẫu 05/02, 08/02 đến 11/02) |

Trong hạn riêng, QLTT vẫn chấm được (`managerReviewState('lm').canEdit`), hệ thống chưa đồng bộ điểm; hết hạn
riêng mới đồng bộ theo §6. Hạn riêng không vượt quá hạn Quản lý cấp 2 (15/02/2027) với lịch hiện tại.

- Tình huống demo: `nv06` (lần 2, chưa nộp), `nv12` đến `nv15` (đã nộp ở lần 1 đến 4), `nv16` (không nộp sau 4 lần).

## 28. ENH-E03 — Điều hướng sang kết quả Mid-Year

**Thay §11.** Không dựng block snapshot đầy đủ. Thay bằng bản nhẹ:

- Trong màn YER của Quản lý, thêm **một dòng hướng dẫn** điều hướng sang tab Mid-Year Review.
- Dòng đó **không** nêu người đã chấm giữa năm. Người chấm chỉ hiện ở box xanh của tab Đánh giá
  giữa năm (§18.3), để thông tin lịch sử chỉ có một nguồn. Sửa ngày 27/09/2026.
- Nhân viên không tham gia kỳ giữa năm: dòng ghi `Không có kết quả Đánh giá giữa năm`. Dùng tên kỳ
  tiếng Việt, không dùng `Mid-Year` (§41.5).
- Bỏ: block collapse, điểm từng mục tiêu, 3 nhận xét nhóm, badge `Đã thay đổi sau Mid-Year`.
- Màn Nhân viên vẫn không có khối này, giữ nguyên §24.

## 29. ENH-E05 — Đóng băng mục tiêu trong kỳ YER

- Nhân viên **gửi** tự đánh giá là khóa ngay nhóm nút mục tiêu kỳ 2026: `Thu hồi`, `Tạo mới`,
  `Sửa`, `Xóa`. Không chờ hết deadline tự đánh giá.
- Chỉ **lưu nháp** tự đánh giá thì mục tiêu chưa khóa: vẫn thu hồi được, Quản lý vẫn yêu cầu
  cập nhật mục tiêu được.
- Nhân viên bấm `Chỉnh sửa` bản đã gửi (§8, mode `editing`) thì nhóm nút mục tiêu **mở lại** để thêm
  mục tiêu mới và gửi Quản lý duyệt; `Gửi lại` hoặc hết hạn thì khóa lại. Tab Mục tiêu của E-05 là
  bản tĩnh của module Goal setting, chưa nối luật khóa này.
- Thu hồi mục tiêu khi đã chấm điểm cho mục tiêu đó: hiện dialog cảnh báo **mất điểm đã chấm**.
- Thu hồi mục tiêu **không xóa** nhận xét đã ghi. Nhận xét 3 nhóm what, how, dev và nhận xét
  toàn diện vẫn giữ nguyên trong bản nháp.
- Kỳ 2027 không bị ảnh hưởng, đặt và thu hồi mục tiêu bình thường.

## 30. ENH-E01 — Tự lọc danh sách nhân viên cần đánh giá

- Mặc định chỉ hiện nhân viên `Đang làm việc` và đủ điều kiện YER, tự cập nhật theo HRM.
- Đã có ngày nghỉ việc nhưng chưa nghỉ hẳn: vẫn trong danh sách, gắn badge
  `Nghỉ việc từ dd/mm/yyyy`. **Không nhắc Quản lý** hoàn thành đánh giá với nhóm này.
- Nghỉ hẳn: tự rời khỏi danh sách của Quản lý.
- Tỷ lệ hoàn thành **không tính** nhân viên đã có ngày nghỉ việc. Điểm này **thay §5**,
  vốn ghi là vẫn tính vào mẫu số.
- Nhân viên đã có ngày nghỉ việc vẫn nhận nhắc cho tới khi nghỉ hẳn.

## 31. ENH-E06 — Báo cáo tổng hợp theo từng nhân viên

- HRBP tải được **báo cáo chi tiết từng nhân viên** cho cả kỳ Mid-Year và Year-End,
  nội dung giống hệt bản của Quản lý ở §16.
- Không thêm loại file mới, chỉ mở quyền và thêm điểm vào ở màn HR.

## 32. ENH-E09 — Proxy View

**Giữ nguyên §15**, kể cả cơ chế xin đồng ý 2 phút, chỉ báo `đang được xem`, tự thoát
sau 15 phút. File đề xuất không phủ định các điều kiện này, chỉ không nhắc lại.
Bổ sung từ file đề xuất: ghi rõ mục đích **chỉ để hỗ trợ vận hành**, không dùng để giám sát.

## 33. ENH-E10 — Nghỉ thai sản

Giữ §12, bổ sung:

- Bước tự đánh giá chuyển trạng thái `Không yêu cầu (Nghỉ thai sản)`, **không tính là chưa
  hoàn thành** trong tỷ lệ, không gửi nhắc.
- Quản lý **import mục tiêu thay** nhân viên nghỉ thai sản, chỉ trong timeline bước Quản lý
  đánh giá, và **không sửa được** mục tiêu nhân viên đã tạo và đã được duyệt.
- Hai mốc nhắc: lúc nhân viên nộp đơn thai sản, và lúc mở kỳ đánh giá.
- Màn hình hiện **hai khối hướng dẫn riêng**: một cho nhân viên thai sản, một cho Quản lý.

## 34. ENH-E13 — Thang điểm

Đã dựng ở cụm 1. Phần còn thiếu so với file đề xuất:

- ⓘ định nghĩa phải tra lại được **ngay khi đang chọn điểm**, không đợi tới lúc gửi xong.
- Định nghĩa hiện **bên cạnh** ô chọn, không đẩy xuống dòng dưới khi còn chỗ.
- Helper text thang điểm hiện ngay tại màn đánh giá, không chỉ trong bảng chọn.

## 35. ENH-E14 — User journey

- Tab: 3 trạng thái `Đang xem` / `Bấm để mở` / `Chưa khả dụng`, phân biệt bằng **nhiều tín
  hiệu cùng lúc**: nền, viền, độ đậm chữ, màu, con trỏ. Không chỉ bằng màu.
- Wording: tab Đánh giá cuối năm không dùng `Đang diễn ra`, `Đang hoạt động`. Dùng nhãn theo việc
  người dùng cần làm, theo §18. Ngoại lệ: tab Đánh giá giữa năm ngoài use case của thanh demo dùng
  `Đang hoạt động` theo `MYR-SPEC.md` MYR-09a (chốt 27/09/2026, mới hơn mục này).
- Dải quy trình: mỗi bước **bấm được** để đọc giải thích, và phải có tín hiệu cho biết bấm được.
- **Tourguide**: chỉ chạy khi người dùng bấm mascot (§43), **không tự chạy** lần đầu vào tab.
  Sửa ngày 27/09/2026 theo code.

## 36. ENH-E15 — Cảnh báo dữ liệu chưa lưu

Giữ nguyên bộ nút của §18: `Rời đi, không lưu` - `Tiếp tục chỉnh sửa` - `Lưu nháp`.
File đề xuất ghi `Lưu nháp & Chuyển Tab` / `Ở lại` / `Không lưu & Chuyển Tab`, nhưng dialog
này dùng chung cho cả đóng tab trình duyệt, đổi nhân viên và breadcrumb, nên không được
gắn chữ "chuyển tab" vào tên nút. Thứ tự và phân cấp nút thì theo đúng file đề xuất:
`Lưu nháp` là nút chính, `Tiếp tục chỉnh sửa` là phụ, `Rời đi, không lưu` là nhẹ nhất.

Bổ sung: rating đổi giá trị cũng tính là dữ liệu chưa lưu. Không có thay đổi nào kể từ lần
lưu gần nhất thì rời màn thẳng, không hiện dialog.

## 37. ENH-E08 — AI Performance Copilot

Giữ nguyên §14. Làm sau cùng của cụm màn Quản lý vì thuộc nhóm Should have.

## 38. Thứ tự triển khai enhancement

| Đợt | Nội dung | Enhancement | Trạng thái |
|---|---|---|---|
| 1 | Nền dùng chung: thang điểm, tab và journey, tourguide, popup chưa lưu | ENH-E13, E14, E15 | Xong |
| 2 | Hoàn thiện màn Nhân viên `E-05` | ENH-E05, E03, E10, E02 | Xong |
| 3 | Màn Quản lý LM/LM2/HOD: danh sách và màn chấm điểm | ENH-E01, E02, E03, E10 | Xong |
| 3b | Còn lại của cụm Quản lý: duyệt điểm hiệu chuẩn, AI Copilot | ENH-E08 | Chưa làm |
| 4 | Màn HR: HRBP, L&OD, TR, HRD | ENH-E06, E09 | Chưa làm |

Trong mỗi đợt, dựng tình huống theo thứ tự: đúng hạn trước, rồi trễ hạn, thiếu mục tiêu,
thai sản, đổi Quản lý, sắp nghỉ việc, auto-sync quá deadline.

## 39. File đã tạo ở cụm 3

Màn Quản lý của YER **không phải màn mới**. Nó là **tab Đánh giá cuối năm nằm trong chính
`M-01` và `M-02`**, dùng lại nguyên ngôn ngữ thiết kế của tab Đánh giá giữa năm. Giống cách
`E-05` là bản dựng của `E-01`, hai file dưới đây chỉ là bản dựng để review.
Từ ngày 27/09/2026, `M-02` đã gộp hẳn vào `M-06` (xem `docs/modules/myr/MYR-SPEC.md`).

| File | Vai trò |
|---|---|
| `M-05/index.html` | Bản sao `M-01` với tab Đánh giá cuối năm được bật và mở sẵn. Danh sách nhân viên cần đánh giá |
| `M-06/index.html` | Bản sao `M-02` với tab Đánh giá cuối năm được bật và mở sẵn. Màn chấm điểm chi tiết |
| `assets/yer-manager.js` | Render danh sách: dải quy trình, đổi phạm vi vai, tỷ lệ hoàn thành, bộ lọc, bảng điểm |
| `assets/yer-manager-detail.js` | Render màn chấm điểm: 3 nhóm mục tiêu, cặp nhận xét và điểm toàn diện |

### 39.1 Một màn, ba vai

`M-06` dùng chung cho cả ba vai, khác nhau ở nội dung chứ không phải ở bố cục:

| | Quản lý trực tiếp | Quản lý cấp 2 | Trưởng đơn vị |
|---|---|---|---|
| Điểm từng mục tiêu | nhập | chỉ xem | chỉ xem |
| 3 nhận xét nhóm | nhập, bắt buộc | chỉ xem | chỉ xem |
| Điểm toàn diện | nhập, bắt buộc | nhập, bắt buộc | nhập, bắt buộc |
| Nhận xét toàn diện | bắt buộc | tùy chọn | tùy chọn |
| Sửa sau khi gửi | được, tới hết deadline | được, tới hết deadline | được, tới hết deadline |
| Cột điểm đọc thêm | — | của QLTT | của QLTT và QL cấp 2 |
| Nút trả về | — | về QLTT | — |

### 39.2 Quy ước dữ liệu ghi vào store

- `acts[emp].lmDraft` / `lm2Draft` / `hodDraft` — bản nháp theo từng vai, không tính là đã gửi.
- `acts[emp].lm` / `lm2` / `hod` — bản đã gửi, có `at` nên model coi là đã submit.
- `acts[emp].returned` — lần trả về gần nhất: `{ by: { name, login }, at, dueHours: 24, reason }`.

### 39.3 Ghi chú

- Khi mở lại trong timeline của chính vai, điểm và nhận xét đã gửi được nạp thành dữ liệu
  chỉnh sửa ban đầu; bấm `Lưu thay đổi` ghi đè bản đánh giá của vai đó.
- Tỷ lệ hoàn thành dùng `PMSYer.completion`, không tự đếm lại trong màn (DESIGN-SYSTEM.md §20.1).
  Tử số là hồ sơ đã có điểm QLTT, **kể cả điểm hệ thống tự chép**. Mẫu số bỏ người đã nghỉ và người
  đã có ngày nghỉ việc (§30), vẫn giữ nhân viên thai sản và hồ sơ `Không đánh giá`.
- Khi gộp vào sản phẩm thật, hai tab này chuyển thẳng vào `M-01` và `M-02`.

## 40. Dải quy trình và khối Lưu ý

Chốt ngày 16/09/2026, thay phần dải quy trình ở §24 và §35.

### 40.1 Dạng hiển thị

Dải quy trình dùng **đúng dạng stepper của Mid-Year Review** trong `E-01`: vòng tròn có số
thứ tự, đường nối ngang, nội dung căn giữa. Khác ở chỗ **gọn hơn**: vòng tròn 24px thay
vì 28px, chữ nhỏ hơn một nấc, bỏ khoảng trống thừa.

Mỗi bước gồm, theo thứ tự từ trên xuống:

1. Số thứ tự trong vòng tròn. Bước đã qua tô xám đậm, bước đang mở tô hồng.
2. Tên bước.
3. Ngày, chỉ hạn chót.

**Domain của người thực hiện nằm cùng dòng với tên vai**, trong **ngoặc đơn**, chữ nhạt hơn,
để dải không cao thêm: `Quản lý trực tiếp (thanh.le)`.
**Không đặt nhãn `Bắt buộc`** ở bất kỳ bước nào.

**Thu gọn được.** Bấm vào tiêu đề dải là gập lại. Thu gọn rồi vẫn phải nói được kỳ đang
ở đâu, bằng một dòng `Đang ở bước: <tên> (<domain>) - Hạn chót dd/mm/yyyy`.
Trạng thái thu gọn nhớ theo từng màn trong store, đổi ngôn ngữ hay đổi ngày không mở lại.

### 40.2 Domain của từng bước

- Lấy qua `PMSYer.actors(p)`, màn hình **không tự ghép tên người** (DESIGN-SYSTEM.md §20.1).
- Quản lý trực tiếp và cấp 2 lấy từ chính hồ sơ nhân viên; Trưởng đơn vị, Total Reward
  và HR Director lấy từ `window.PMS_YER_ACTORS` trong `assets/yer-data.js`.
- Bước **Công bố kết quả không có domain**, vì nó không gắn với một người cụ thể.
- Ở **màn danh sách của Quản lý**, bước Tự đánh giá cũng không có domain: bước đó là việc
  của cả danh sách chứ không của một người. Màn chi tiết thì có.

### 40.3 Ngày hiển thị

- **Mọi bước chỉ hiện hạn chót**, dạng `Hạn chót dd/mm/yyyy`. Không bước nào hiện ngày bắt đầu,
  kể cả bước của chính người đang xem.
- **Ngày bắt đầu của cả kỳ** đưa lên tiêu đề dải: `Quy trình và Thời gian đánh giá cuối
  năm 2026 - bắt đầu 05/01/2027`.
- Dùng chữ **`Hạn chót`**, không dùng `Hạn`.
- Hộp giải thích khi bấm vào bước vẫn hiện đủ khoảng ngày.

### 40.4 Những thứ KHÔNG đặt trong dải quy trình

- **Dải quy trình chỉ để đọc.** Từng bước **không bấm được** và không mở popup giải thích.
  Mọi thông tin cần biết đã nằm sẵn trên dải: tên bước, người phụ trách, hạn chót.
  Chỉ còn tiêu đề dải là bấm được, để thu gọn.
- **Không có dòng gợi ý** `Bấm vào từng bước để đọc thêm`.
- **Nút `Xem hướng dẫn` đặt ngoài dải**: màn Nhân viên đặt cạnh `Lưu nháp` và
  `Gửi tự đánh giá`; màn Quản lý đặt ở thanh công cụ của danh sách.
- Khoảng cách tiêu đề tới hàng bước: **26px** (sửa 17/09/2026, 18px dính quá sát).

### 40.5 Khối Lưu ý của màn Nhân viên

Nằm ngay dưới dải quy trình, dùng `info-note` giống tab Đánh giá giữa năm, hai gạch đầu dòng:

1. Điều kiện tham gia. Cụm **Danh sách mục tiêu** là **liên kết thật**, bấm vào là chuyển
   sang tab Mục tiêu ngay trong màn, không rời trang.
2. Kết quả kỳ giữa năm, **chỉ khi có kết quả**, xem §40.5c. Cụm **Đánh giá giữa năm 2026**
   là liên kết sang tab đó.

##### 40.5a Logic hiển thị box thông tin

Chốt ngày 18/09/2026. Hai nguyên tắc:

1. **Không bao giờ hiện hai box thông tin cùng lúc.** Mọi nội dung mang tính thông tin
   và hướng dẫn đều nằm trong một box duy nhất.
2. **Vị trí box nói lên mức độ ưu tiên**, không phải loại nội dung. Trên dải quy trình
   = việc đang chặn, phải xử trước. Dưới dải quy trình = đọc tham khảo.

**Bảng trạng thái đầy đủ** (theo thứ tự ưu tiên, trạng thái nào đúng trước thì dùng cái đó):

| # | Trạng thái hồ sơ | Box hiển thị | Vị trí | Nội dung |
|---|---|---|---|---|
| 1 | Đã gửi tự đánh giá (`p.self`) | **không box nào** | — | banner `Đã hoàn thành` thay thế |
| 1b | Đang chỉnh sửa bản đã gửi (`mode === 'editing'`, §8) | khối `.yer-note.action.yer-edit-note` | **trên** toolbar và dải quy trình | câu chữ ở §8.1 + nút `Hủy chỉnh sửa` |
| 2 | Thiếu mục tiêu (`eligibility.reason === 'missing-goal'`) | khối cảnh báo `.yer-note.action`, nền rose-neutral rất nhạt `#FFF7FB`, viền `#F0D7E5`, icon màu thương hiệu | **trên** dải quy trình | còn hạn: `Bạn chưa đủ điều kiện gửi Tự đánh giá cuối năm do thiếu [loại mục tiêu] được duyệt.` / `Vui lòng sang tab Danh sách mục tiêu để tạo và gửi Quản lý trực tiếp phê duyệt.` / `Trong lúc này, bạn vẫn có thể nhập thông tin và lưu nháp bản tự đánh giá.` (thiếu cả hai: `Mục tiêu công việc và Mục tiêu phát triển`); hết hạn: `Bạn không thể thực hiện Tự đánh giá cuối năm`. CTA outline theo màu thương hiệu, không dùng nút hồng đặc |
| 3 | Nghỉ thai sản | khối `Lưu ý` (`.info-note`) | **dưới** dải quy trình | một dòng thai sản, xem §40.5b |
| 4 | Các trường hợp còn lại | khối `Lưu ý` (`.info-note`) | **dưới** dải quy trình | điều kiện mục tiêu + kết quả kỳ giữa năm |
| 5 | Không còn gạch đầu dòng nào | **không box nào** | — | không dựng thẻ rỗng |
| 5b | Quá hạn, còn trong bốn lần nhắc, chưa nộp (§27.1) | **chỉ** khối vàng `.yer-note.yer-late-note` | **trên** dải quy trình | lần nhắc, hạn, hình thức xử lý (nếu có), lưu ý, xác nhận; các ô bên dưới khóa |
| 6 | Hết cả bốn lần nộp bổ sung mà chưa nộp (§27.3) | **chỉ** khối `.yer-note.action.yer-late-closed` | dưới dải quy trình | không dựng khối Lưu ý |

Phần còn thiếu được nói trên nhãn tab **Mục tiêu** (§18.4), không nằm trên nhãn tab
Đánh giá cuối năm nữa.

Trong khối cảnh báo, chính tên loại mục tiêu sau `Hiện còn thiếu:` dùng màu thương hiệu
và weight 700; phần câu còn lại giữ màu chữ mặc định. Trạng thái model vẫn là
`missing-goal`; `Không đánh giá` chỉ dùng khi hồ sơ đã thực sự qua cửa sổ bổ sung.

Thứ tự khối trên màn ứng với từng trạng thái:

```
Thiếu mục tiêu:  cảnh báo → toolbar (nút Gửi khóa) → dải quy trình → các nhóm mục tiêu
Đang chỉnh sửa:  khối Đang chỉnh sửa → toolbar → dải quy trình → các nhóm mục tiêu
Đủ mục tiêu:    toolbar → dải quy trình → Lưu ý → các nhóm mục tiêu
Đã gửi:         banner  → dải quy trình → các nhóm mục tiêu
```

**Chuyển trạng thái:** duyệt đủ mục tiêu thì khối cảnh báo biến mất và khối `Lưu ý`
thế chỗ ở **dưới** dải quy trình. Lúc này `Lưu ý` hiện **đầy đủ** hai gạch đầu dòng:
dòng về điều kiện mục tiêu chỉ bị lược khi nó nằm trong khối cảnh báo (vì trùng ý),
còn khi đứng riêng thì vẫn cần — `noteList(p, { skipGoalRule: true })` chỉ dùng cho khối cảnh báo.

**Vị trí này là chốt, không đổi.** Lý do giữ `Lưu ý` ở dưới dải quy trình:

- Tab Đánh giá giữa năm trong cùng màn đã xếp `stepper-card` → `info-note`. Đưa lên trên
  là hai tab lệch nhau ngay trong một màn hình.
- Dải quy trình trả lời "tôi đang ở bước nào, hạn ngày nào" — thứ cần mỗi lần vào màn.
  `Lưu ý` là hướng dẫn đọc một lần. Đẩy hướng dẫn lên trước là hạ cấp thông tin chính.
- Giữ hai vị trí khác nhau thì nhân viên bị chặn và nhân viên bình thường nhìn ra khác nhau ngay.

Câu chữ về kỳ giữa năm xem §40.5c.

##### 40.5d Luôn giữ đủ ba khối mục tiêu

Chốt ngày 18/09/2026. **Không được giấu khối Mục tiêu công việc hay Mục tiêu phát triển
khi nhóm đó chưa có mục tiêu nào.** Tab luôn hiện đủ ba khối:
Mục tiêu công việc → Mục tiêu phát triển → Mục tiêu hành vi.

Nhóm chưa có mục tiêu thì giữ nguyên tiêu đề và hàng tiêu đề cột, thân bảng là **một dòng
xám mờ** (`.g-none`): chữ `--z400`, in nghiêng, căn giữa, không viền không nền.

Câu chữ: `Chưa có <tên nhóm viết thường> nào được Quản lý trực tiếp phê duyệt.`

Áp cho mọi trường hợp thiếu mục tiêu, kể cả khi **chưa có mục tiêu nào** (cả hai nhóm
đều trống). Lý do:

- Giấu khối thì nhân viên không nhìn ra mình đang thiếu loại mục tiêu nào.
- Hai hồ sơ cùng trạng thái lại có số khối khác nhau → bố cục nhảy giữa các nhân sự.
- Khối trống còn là chỗ để nhân viên đối chiếu với khối cảnh báo ở trên.

Ô nhận xét của nhóm trống vẫn hiện nhưng luôn **chỉ xem**: không có mục tiêu thì không có gì để
nhận xét. Các nhóm còn lại, Mục tiêu hành vi và phần toàn diện vẫn nhập được để lưu nháp (§5).

#### 40.5c Câu về kết quả kỳ giữa năm

Chốt lại ngày 27/09/2026. **Chỉ có một câu, và chỉ khi có kết quả:**
`Bạn có thể xem lại kết quả [Đánh giá giữa năm 2026] của mình trước khi tự đánh giá cuối năm.`
Cụm trong ngoặc là liên kết sang tab Đánh giá giữa năm.

- Không có kết quả, **vì bất cứ lý do gì** (không hoàn tất quy trình, không thuộc kỳ), thì tab Đánh giá
  cuối năm **không nhắc gì**. Câu cũ `Bạn không có kết quả Đánh giá giữa năm 2026 vì chưa hoàn thành
  quy trình.` đã bỏ.
- Hệ quả: khối Lưu ý có thể không còn dòng nào — khi đó **không dựng thẻ rỗng**, bỏ luôn cả box.
- Tab Đánh giá giữa năm giữ nguyên nội dung và info box của nó.

### 40.5b Nhân viên nghỉ thai sản

Khối Lưu ý **thay hẳn nội dung**, không phải thêm vào:

- **Bỏ cả hai gạch đầu dòng ở trên.** Họ không phải tự đánh giá nên hai dòng đó
  không dẫn tới việc gì.
- Thông báo thai sản **nằm trong chính khối Lưu ý**, không dựng thành khối riêng ngay
  bên dưới: hai khối liền nhau nói hai chuyện khác nhau nhìn rất rối.
- Dùng đúng kết cấu `ul.yer-note-list > li` như các dòng Lưu ý khác. **Không bọc thêm
  một ô nền hồng bên trong ô Lưu ý** và **không đặt icon riêng cho dòng này**: box lồng box
  nhìn rất vô duyên, và ô Lưu ý đã có icon ⓘ của riêng nó.
- Câu chữ (chốt lại 27/09/2026): `Do đang trong thời gian nghỉ thai sản, bạn không bắt buộc phải thực hiện
  Tự đánh giá cuối năm. Tuy nhiên, bạn vẫn có thể chủ động tự đánh giá nếu muốn. Sau thời hạn Tự đánh giá,
  Quản lý trực tiếp sẽ tiến hành đánh giá theo đúng quy trình của Công ty.`
- Nhấn chữ: **nghỉ thai sản** đậm màu `--brand`; **không bắt buộc** và **Tự đánh giá**
  chỉ đậm, giữ màu chữ thường.

## 41. Ô bắt buộc điền và ⓘ định nghĩa mức điểm

Chốt ngày 17/09/2026.

### 41.1 Ô bắt buộc điền

- **Bỏ nhãn `Bắt buộc`** ở góc panel.
- Thay bằng **dấu sao đỏ** `*` đặt ngay sau nhãn của chính ô phải điền, kèm chữ
  `bắt buộc` ở dạng chỉ trình đọc màn hình đọc được.
- Áp cho: ba ô nhận xét nhóm, ô Điểm toàn diện, ô Nhận xét toàn diện.
- Chỉ hiện khi ô đang sửa được. Đọc thôi thì không có dấu sao.
- Ô chọn điểm chưa có giá trị hiện chữ gợi ý `Chọn điểm 1-5` (EN `Select 1-5`) thay cho `—`, cả ô
  điểm từng mục tiêu và ô Điểm toàn diện. Ô tự nới rộng (`.rt-unset`, tối thiểu 112px), chữ 12px/500
  `--z600`; chọn điểm rồi thì trở về ô gọn như cũ. Dùng chung ở `PMSUi.rating` nên áp cho cả E-05 và M-06.

### 41.2 ⓘ định nghĩa mức điểm

**ⓘ chỉ xuất hiện sau khi đã gửi.** Trong lúc đang nhập, định nghĩa đã nằm sẵn ở ô ngay
dưới ô chọn điểm nên thêm ⓘ là thừa. Điều này đúng với §4 và **thay** §34.

### 41.2b Ô Ý nghĩa thang điểm

Ô định nghĩa nằm dưới ô nhận xét toàn diện, là một **panel có tiêu đề riêng**:

- Tiêu đề `Ý NGHĨA THANG ĐIỂM` (EN: `WHAT THIS RATING MEANS`), chữ hoa, kèm icon
  `bx-info-circle`. Không có tiêu đề thì đoạn chữ nằm trơ dưới ô nhận xét và người đọc
  không biết đây là giải thích mức điểm hay gợi ý viết nhận xét.
- **MỘT màu pastel duy nhất cho mọi mức điểm**, viền đơn 1px đều bốn cạnh:

  | Phần | Mã màu |
  |---|---|
  | Nền | `#eaf5fb` |
  | Viền | `#d3e7f2` |
  | Tiêu đề và icon | `#186a8e` |
  | Nội dung | `--z700` |

- **KHÔNG đổi màu theo điểm cao thấp và không có vạch màu dày bên trái.** Đây là thông tin
  giải thích chứ không phải trạng thái; tô theo điểm thì điểm thấp ra một ô đỏ, đọc thành lỗi.
- Chọn xanh nhạt để tách hẳn khỏi nền hồng của các khối thao tác, và khỏi vàng/đỏ/xanh lá
  của các chip trạng thái.
- Tooltip của ⓘ (nhánh chỉ xem) dùng lại đúng đoạn định nghĩa nhưng **không lặp tiêu đề**,
  vì đã có `aria-label` nói rõ đây là định nghĩa mức điểm.

### 41.3 Tên và định nghĩa mức điểm lẻ

Lấy **nguyên văn** từ file đề xuất, không rút gọn:

- Tên mức: `Giữa mức 1 - Không đạt yêu cầu và 2 - Hoàn thành một phần`,
  chứ không phải `Giữa mức 1 và 2`.
- Định nghĩa: `Hiệu quả công việc của nhân viên đã vượt trên các tiêu chí của mức X - …
  và chưa đạt trọn vẹn các tiêu chí cần thiết của mức Y - …`

### 41.4 Thanh công cụ soạn thảo

**Bỏ ô chọn định dạng Normal / Tiêu đề** khỏi mọi ô nhận xét của kỳ cuối năm. Nhận xét
đánh giá là văn xuôi ngắn, không cần cấp độ tiêu đề. Thanh công cụ còn B, I, U và danh sách.

### 41.5 Khối Lưu ý

- Cách khối bên dưới **18px**, không để dính vào bảng mục tiêu.
  `.info-note` vốn chỉ được định nghĩa cho `#mpanel-myr` nên trong `#yer-root` phải khai lại.
- Có kết quả giữa năm thì câu chữ bắt đầu bằng **`Bạn có thể xem lại kết quả Đánh giá giữa năm 2026…`**,
  dùng tên kỳ tiếng Việt theo DESIGN-SYSTEM.md §10, không dùng `Mid-Year`.

## 42. Banner sau khi gửi và nhãn mục tiêu

Chốt ngày 17/09/2026.

- Banner sau khi nhân viên gửi: tiêu đề **`Đã hoàn thành Tự đánh giá cuối năm`**,
  dòng phụ **`Ngày gửi: dd/mm/yyyy`**. Sau khi công bố thì là `Ngày công bố: dd/mm/yyyy`.
  Với hồ sơ gửi trễ đang chờ QLTT, **không dùng badge `Nộp trễ hạn`**; thêm một dòng
  tiến độ gọn: `Tiếp theo: Chờ Quản lý trực tiếp đánh giá - domain`. Dòng này tự ẩn khi
  Quản lý trực tiếp đã hoàn tất hoặc kết quả đã công bố.
- Còn hạn tự đánh giá (§8) thì banner có thêm dòng `Bạn có thể chỉnh sửa tới hết ngày dd/mm/yyyy`
  dưới ngày gửi, và nhóm nút bên phải: `Chỉnh sửa` (outline hồng), `Lịch sử chỉnh sửa`, PDF.
  Hết hạn thì bỏ dòng đó và nút `Chỉnh sửa`, giữ `Lịch sử chỉnh sửa`.
- Khối Đánh giá toàn diện, ô của QLTT (chốt 28/09/2026): khi đã có nhận xét của QLTT mà **chưa công bố**, ô có
  dòng `Điểm toàn diện: - Chưa công bố` ngang hàng với dòng điểm của nhân viên. Sau khi công bố, kết quả cuối cùng
  nằm ở banner nên ô này chỉ giữ khoảng trống. Nhân viên không bao giờ thấy điểm toàn diện của QLTT (§7).
- Bớt viền trong khối Đánh giá toàn diện và khối Nhận xét của các cấp quản lý: bỏ khung của từng ô, chỉ giữ
  một vạch chia giữa hai cột; ô chỉ xem dùng nền `--z50`, không viền.
- **Bỏ nhãn `Đã thay đổi sau Mid-Year`** trên thẻ mục tiêu. Kỳ cuối năm chấm trên mục tiêu
  hiện tại, lịch sử thay đổi không đổi cách chấm. Điều này **thay** phần badge ở §11.

## 43. Mascot hướng dẫn của màn Nhân viên

Chốt ngày 17/09/2026. Thay nút `Xem hướng dẫn` ở §40.4.

- Mascot MoMo đứng ở **góc phải thanh tab**, thay hẳn nút `Xem hướng dẫn`.
- Rê chuột hoặc focus thì đổi sang pose vẫy tay và hiện bóng thoại. Bấm thì chạy tourguide.
- Bóng thoại có tiêu đề `Xin chào, mình là tour guide của bạn!` và **một câu cố định**:
  `Bạn đang ở bước [X]. Mình sẽ dẫn bạn qua các việc cần hoàn thành nhé!` Chỉ tên bước [X]
  đổi theo hồ sơ và được làm nổi thành chip hồng: `Nộp trễ hạn`, `Chưa đủ điều kiện`,
  `Đã công bố kết quả`, `Chỉnh sửa tự đánh giá`, `Chờ Quản lý đánh giá`, `Không yêu cầu tự đánh giá`,
  `Quá hạn tự đánh giá` hoặc `Tự đánh giá`. `Chưa đủ điều kiện` chỉ còn dùng khi thiếu mục tiêu mà đã
  hết hạn; còn hạn thì là `Tự đánh giá` (§5). Sửa ngày 27/09/2026.
- Cuộn xuống thì mascot rời thanh tab và bám sát mép phải màn hình.
- Các bước của tourguide theo tình trạng hồ sơ. Luôn có hai bước đầu: tô **đúng tab** Đánh giá
  cuối năm, rồi dải quy trình (hồ sơ đang ở bước nào và hạn chót). Sau đó:

  | Tình trạng | Bước tiếp theo |
  |---|---|
  | Trong cửa sổ nộp trễ | khối thông báo quá hạn (`.yer-late-note`) |
  | Thiếu mục tiêu, hết hạn | khối cảnh báo |
  | Đã gửi | banner đã hoàn thành (nói còn chỉnh sửa được tới ngày nào, hoặc đã hết hạn) |
  | Quá hạn, chưa gửi | khối báo đã quá hạn |
  | Đang tự đánh giá hoặc đang chỉnh sửa | khối cảnh báo thiếu mục tiêu hoặc khối Đang chỉnh sửa (nếu có), rồi `Đánh giá Mục tiêu công việc`, `Đánh giá Mục tiêu phát triển`, `Đánh giá Mục tiêu hành vi`, `Hoàn tất đánh giá toàn diện` (chỉ tô ô của Nhân viên), `Lưu nháp`, `Gửi tự đánh giá` |
- Mỗi thẻ của tourguide có hình mascot theo pose hợp nội dung bước đó.
- Sáu pose nằm ở `assets/mascot/`: `idle`, `wave`, `run`, `cheer`, `wink`, `think`.
- Khối `Lưu ý` vẫn giữ, nhưng **ẩn sau khi nhân viên đã nộp**: nội dung đó chỉ có nghĩa
  trước khi tự đánh giá.

## 44. Thanh Chế độ demo

**Thanh ẩn mặc định** để bản dựng nhìn như sản phẩm thật khi trình bày hoặc chụp ảnh.

Ba cách mở lại:

| Cách | Dùng khi nào |
|---|---|
| Bấm viên **Demo** ở góc dưới bên phải | cách thông thường, luôn có khi thanh đang ẩn |
| Nhấn phím **`D`** | bật tắt nhanh, không dùng được khi con trỏ đang ở trong ô nhập |
| Thêm **`?demo=1`** vào URL | mở sẵn ngay khi tải trang, tiện cho deep link |

Deep link đầy đủ: `E-05/index.html?demo=1&role=nv&date=2027-01-20&emp=y11`,
hoặc ngắn gọn `E-05/index.html?demo=1&scenario=nv06`.

Trang gốc `index.html` chuyển sang `E-05` và **giữ nguyên query và hash**, nên deep link đặt ở trang gốc
vẫn chạy. Nút đổi vai ở sidebar ghi vai vào phiên rồi mới chuyển trang, để sang `M-05` không bị màn rỗng.

### 44.1 Thanh demo tự điều hướng

Mỗi vai làm việc trên một màn khác nhau, nên đổi vai mà ở nguyên màn cũ thì người xem
chỉ thấy màn trống. Thanh demo tự chuyển sang đúng màn:

| Chọn | Đi tới |
|---|---|
| Vai **Nhân viên** | `E-05/index.html` |
| Vai **Quản lý trực tiếp**, **Quản lý cấp 2**, **Trưởng đơn vị** | `M-05/index.html` |
| Một **tình huống** | màn ghi ở trường `screen` của tình huống đó |

`?demo=1` và `?lang=` được giữ lại khi chuyển màn; vai trò, nhân sự và ngày hệ thống
đi theo phiên trong `localStorage` nên không cần đặt lại trên URL.

Dropdown thứ hai của thanh demo định danh theo **mã tình huống** (`sc:<id>`) chứ
không theo mã nhân sự: một người có thể xuất hiện ở nhiều tình huống của nhiều vai
(ví dụ `e1` ở `lm02` và `hod02`, `e10` ở `nv07`, `nv08` và `lm09`).

Màn `E-05` có dropdown `Tình huống` chỉ gồm tình huống có số của vai Nhân viên (§46). **Không còn nhóm
`Hồ sơ khác`** (bỏ ngày 28/09/2026): chọn hồ sơ lẻ thì ngày hệ thống vẫn là ngày của tình huống trước, nên màn
hiện ra không khớp với câu chuyện của hồ sơ. Hồ sơ nào cần demo thì thành một tình huống có số.
Dropdown này từng bị mất khi rút gọn thanh demo của Quản lý (commit c2df233), dựng lại ngày 27/09/2026.

Riêng hai màn Quản lý tách rõ hai mục đích demo:

- `M-05` là **tổng quan roster theo thời điểm**: thanh demo chỉ có Vai trò, Ngày hệ thống
  và 5 giai đoạn `Tự đánh giá → QLTT → QL cấp 2 → HOD → Công bố`. Không có dropdown
  nhân viên/tình huống; đổi giai đoạn chỉ đổi ngày của toàn roster, không chuyển màn.
- `M-06` là **chi tiết use case**: mới hiện dropdown `Tình huống chi tiết`, và dropdown chỉ
  chứa tình huống `M-06` của đúng vai đang xem. Chọn tình huống không âm thầm đổi sang vai khác.
- Hai bước nội bộ `Total Reward` và `HR Director` không hiện trên thanh demo của màn Quản lý,
  đồng nhất với dải quy trình 5 bước trên màn hình.

**Use case và tab Giữa năm** (chốt 27/09/2026): chọn use case trên thanh demo thì phiên ghi `scenario`;
chỉ khi đó tab Giữa năm mới chuyển thành dữ liệu lịch sử của kỳ cuối năm. Không có use case thì màn MYR
hiển thị bình thường, độc lập. Chi tiết ở `docs/modules/myr/MYR-SPEC.md` §2a.

## 45. Bộ kiểm thử

| Lệnh | Phạm vi |
|---|---|
| `npm test` | Feedback (`E-04`, `H-05`, `M-04`) và org-chain |
| `npm run test:yer` | luồng Đánh giá cuối năm: `YER-demo/yer-enhancements.test.js` |

`yer-enhancements.test.js` nạp trực tiếp `assets/yer-data.js` và `assets/yer-model.js` trong `vm`,
kèm `assets/employees-data.js` — thiếu file này thì `profile()` của `e1`..`e16` trả về null.
Những luật đã khóa bằng test: bộ tình huống xếp theo bốn vai trò và mỗi tình huống
nằm đúng nhóm vai của nó, mọi tình huống đều dựng được hồ sơ tại ngày hệ thống đã chọn,
các tình huống của Nhân viên ra đúng trạng thái mong đợi, thiếu WHAT khác thiếu DEV
ở dữ liệu chứ không chỉ khác câu chữ, nhân viên ngoài kỳ thì tab bị khóa, ba trạng thái mục tiêu
của luồng nộp trễ, thai sản không vào luồng nộp trễ, hồ sơ đã nộp trễ chuyển sang chờ Quản lý,
mascot thay nút hướng dẫn, ba file mẫu có thật, thanh demo ẩn nhưng viên Demo luôn mở được.
Thêm ngày 27/09/2026 (đợt 2): bảy tình huống Nhân viên đúng thứ tự và trạng thái, thiếu mục tiêu vẫn nhập
và lưu nháp nhưng không gửi được, mở lại, gửi lại và lịch sử chỉnh sửa (§8), nhãn tab theo giai đoạn và nhãn
tab Mục tiêu (§18.4), không còn câu không có kết quả giữa năm, nhóm nút nổi, ô `Chọn điểm 1-5`, dropdown
tình huống của E-05.
Thêm ngày 28/09/2026: mười sáu tình huống Nhân viên (có nộp bổ sung ở từng lần nhắc và không nộp sau 4 lần),
không còn nhóm `Hồ sơ khác`, hạn chấm QLTT riêng cho hồ sơ nộp bổ sung, màn quá hạn giữ bố cục thường với các ô
khóa và popup nộp bổ sung, dòng `Điểm toàn diện: - Chưa công bố` ở ô QLTT.
Thêm ngày 27/09/2026 (đợt 3): mười một tình huống Nhân viên, bốn lần nhắc
nộp bổ sung đếm theo ngày làm việc và hình thức xử lý cộng dồn, bước xác nhận đã đọc, khối nộp trễ sau khi gửi,
khối nhận xét của Quản lý cấp 2 và Trưởng đơn vị, lịch sử chỉnh sửa theo lần gửi.
Thêm ngày 27/09/2026: hồ sơ đủ mục tiêu mà không tự đánh giá vẫn được QLTT chấm tới hết hạn QLTT,
LM2 trả về mở lại quyền sửa của QLTT trong 24 giờ, và M-06 có dải quy trình, giữ nhóm mục tiêu trống,
có popup chi tiết mục tiêu, dùng chung luật nhãn tab với M-05.

## 46. Bảng điều hướng tình huống

`YER-demo/index.html` gom **35 tình huống** theo **vai trò**, không theo giai đoạn quy trình:
người review thường duyệt hết phần của một vai rồi mới sang vai khác. Hàng chip đầu bảng
lọc theo vai; mỗi dòng đặt sẵn vai trò, nhân sự, ngày hệ thống và **màn hình sẽ mở**.

| Nhóm | Mã | Số tình huống |
|---|---|---|
| Nhân viên | `nv01`–`nv16` | 16 |
| Quản lý trực tiếp | `lm01`–`lm09` | 9 |
| Quản lý cấp 2 | `lm2-01`–`lm2-05` | 5 |
| Trưởng đơn vị | `hod01`–`hod05` | 5 |

Mười sáu tình huống của Nhân viên, chốt 28/09/2026:

| Mã | Tình huống | Hồ sơ, ngày |
|---|---|---|
| `nv01` | Đủ mục tiêu, chưa tự đánh giá (luồng chuẩn) | `e7`, 12/01/2027 |
| `nv02` | Thiếu mục tiêu công việc | `y13`, 12/01/2027 |
| `nv03` | Thiếu mục tiêu phát triển | `y1`, 12/01/2027 |
| `nv04` | Thiếu cả hai loại mục tiêu | `y11`, 12/01/2027 |
| `nv05` | Đang nghỉ thai sản | `y2`, 12/01/2027 |
| `nv06` | Thiếu mục tiêu và đã quá hạn tự đánh giá, đang ở lần nhắc 2 | `y10`, 22/01/2027 |
| `nv07` | Đã gửi tự đánh giá, còn chỉnh sửa được trước hạn | `e10`, 14/01/2027 |
| `nv08` | Đã gửi tự đánh giá, đã quá hạn, không chỉnh sửa được | `e10`, 22/01/2027 |
| `nv09` | Đã có ngày làm việc cuối cùng | `y6`, 08/01/2027 |
| `nv10` | Có mục tiêu đã đánh giá hoàn thành với Quản lý cũ: cột Điểm QLTT ghi domain Quản lý cũ dưới điểm (§13.1) | `y3`, 12/01/2027 |
| `nv11` | Có nhận xét của Quản lý cấp 2 và Trưởng đơn vị (§7) | `e12`, 25/02/2027 |
| `nv12` | Đã nộp bổ sung ở lần nhắc 1 | `y9`, nộp 20/01, xem 21/01/2027 |
| `nv13` | Đã nộp bổ sung ở lần nhắc 2 (file bù mục tiêu công việc) | `y14`, nộp 25/01, xem 26/01/2027 |
| `nv14` | Đã nộp bổ sung ở lần nhắc 3 | `y12`, nộp 28/01, xem 29/01/2027 |
| `nv15` | Đã nộp bổ sung ở lần nhắc 4 | `y16`, nộp 02/02, xem 03/02/2027 |
| `nv16` | Không nộp sau 4 lần nhắc | `e2`, 05/02/2027 |

`nv07` và `nv08` là cùng một người ở hai thời điểm; `e10` có sẵn lịch sử gửi, mở lại, gửi lại (§8.2).
Hồ sơ nộp bổ sung dựng sẵn bằng `lateSeed()` trong `yer-data.js`; `y16` Mạc Thùy Dung là nhân sự mới cho lần nhắc 4.
`y12` nộp bổ sung ngày 28/01/2027 (lần nhắc 3) nên tình huống `lm05` của Quản lý là ngày 29/01/2027.

Tại thời điểm kỳ cuối năm đã mở, nhãn trên tab Đánh giá giữa năm dùng hệ màu xám trung tính để
không cạnh tranh thị giác với tab cuối năm (§18.4). Hồ sơ đã công bố (`e12`) có banner kết quả chỉ
hiển thị điểm số cuối cùng, không hiển thị tên mức.

Ghi chú cho người review: **mọi hồ sơ quá hạn chưa gửi dùng cùng một khối thông báo và popup nộp bổ sung**
(ví dụ `nv06`). Quá hạn thì file thay cho toàn bộ nội dung, nên số mục tiêu đã duyệt chỉ đổi **file tải về**
khi bấm `Tải Template` (có mục tiêu đã duyệt thì tải file điền sẵn, không có thì tải mẫu trống; không hỏi, §27.1).

Ba bản dựng phụ để review từng phần:

| File | Dùng để |
|---|---|
| `YER-demo/overdue-self-assessment.html` | bốn tình huống nộp trễ cạnh nhau |
| `YER-demo/mascot-tour.html` | thử từng bước của tourguide |
| `YER-demo/mascot-tour-v2.html` | mascot gắn trên chính màn `E-05` |

## 47. Danh sách Đánh giá cuối năm của Quản lý

Chốt ngày 22/09/2026.

- `M-05` giữ cùng ngôn ngữ giao diện với danh sách Đánh giá giữa năm: dải đổi phạm vi
  gồm `Direct reports` / `Indirect reports`, lựa chọn phụ `LM2` / `HOD`, tìm kiếm và bảng
  nhân viên. Không dựng biến thể ba nút phạm vi riêng cho YER.
- Roster được lọc sẵn theo reporting scope giống Mid-Year: QLTT xem toàn bộ direct reports,
  Quản lý cấp 2 xem toàn bộ nhân viên thuộc các Quản lý dưới quyền, HOD xem toàn bộ nhân viên
  thuộc đơn vị. Không vai nào nhận danh sách toàn công ty rồi mới lọc ở giao diện.
- Khi đang ở kỳ cuối năm, tab **Đánh giá giữa năm** dùng nhãn xanh **`Đã hoàn thành`**.
- Tab **Đánh giá cuối năm** có nhãn theo vai và hồ sơ của tình huống đang chọn, ví dụ
  `Cần đánh giá`, `Đã hoàn thành`, `Cần phê duyệt`, `Đã có kết quả` hoặc trạng thái chờ.
- Không có bộ lọc `Hiển thị nhân viên đã nghỉ việc`; danh sách mặc định tuân theo luật lọc
  của model. Người đã có ngày nghỉ việc trong tương lai vẫn có thể hiện badge LWD nhưng
  không tính vào mẫu số tiến độ.
- Không hiển thị thẻ `Tiến độ đánh giá cuối năm` trên danh sách này.
- Dải quy trình dùng đúng component của màn Nhân viên và chỉ gồm 5 bước:
  `Tự đánh giá → Quản lý trực tiếp → Quản lý cấp 2 → Trưởng đơn vị → Công bố kết quả`.
  Trên màn danh sách Quản lý, các bước **không hiển thị domain**.
- Bảng luôn có cột `Chức năng`; icon bút dùng khi vai đang xem có thể đánh giá hoặc sửa lại
  bản đã gửi trong timeline của chính vai, icon mắt dùng khi chỉ xem. Trước khi timeline mở
  và sau deadline, hồ sơ chỉ còn icon mắt. Cột `Trạng thái` là cột cố định, thu gọn vừa đủ
  đọc và không có tay kéo;
  phần chiều rộng thu hồi được phân bổ lại cho thông tin nhân viên, các cột điểm và Chức năng
  theo từng vai `LM`, `LM2`, `HOD`. Các cột điểm giữ căn giữa như bảng Mid-Year.
- Thứ tự ưu tiên của danh sách (sửa ngày 27/09/2026 theo code): **`Chưa Tự đánh giá`** →
  hồ sơ **đang chờ đúng vai đang xem, trong timeline của vai đó**: nộp trễ, rồi thai sản, rồi
  các hồ sơ còn lại → các trạng thái khác → `Đã công bố kết quả` → mọi hồ sơ có ngày `LWD`.
  Nộp trễ và thai sản chỉ được ưu tiên riêng ở vai QLTT. Trong từng nhóm giữ thứ tự dữ liệu ban đầu.
- Badge trạng thái dùng cùng kiểu pill bo tròn của Mid-Year và giữ nguyên câu chữ theo trạng
  thái khách quan của quy trình. Chỉ trạng thái đang chờ **đúng vai hiện tại** và timeline của
  vai đó còn mở mới dùng màu hồng; cùng trạng thái khi vai khác xem, trước timeline hoặc sau
  deadline dùng màu xám vì không thể action. Quá hạn nhưng chưa nộp dùng màu đỏ.
- Cột Quản lý dùng `PMSYer.actors(profile)` làm nguồn duy nhất, không đọc thẳng `emp.mgr` /
  `emp.mgr2`; nhờ đó hồ sơ seed chưa lặp lại dữ liệu tổ chức vẫn hiện đúng chuỗi quản lý.
  Tên và domain dùng nguyên kết cấu `.myr-manager` + `.er-login` của bảng Mid-Year.
- Cột Nhân viên giữ thêm khoảng đệm trái 12px để nội dung không dính sát viền bảng.
- `Chờ Quản lý trực tiếp` được rút gọn thành **`Chờ QLTT đánh giá`**. Với nhân viên thai sản,
  badge xanh `Đang nghỉ thai sản` chỉ nằm dưới thông tin nhân viên; cột `Trạng thái` không lặp
  thông tin này mà hiển thị action **`Chờ QLTT đánh giá`**.
- `Cần nộp file trễ hạn` trên danh sách Quản lý đổi thành **`Chưa Tự đánh giá`**. Hồ sơ đã
  nộp trễ chỉ hiển thị **`Chờ QLTT đánh giá`** trong cột Trạng thái; thông tin `Nộp trễ hạn`
  được giữ một lần dưới tên nhân viên.
- Không hiển thị ba thành phần phụ trên danh sách: khối mô tả việc của vai, khối giải thích
  điểm toàn diện và nút/tour `Xem hướng dẫn`.

Bổ sung ngày 27/09/2026 theo code:
- **Nhãn tab Đánh giá cuối năm theo vai** do `PMSYer.managerTabLabel(role, p)` sinh ra, M-05 và M-06
  cùng đọc (trước đây M-06 hiện nhãn thô của model):

  | Tình huống | QLTT | Quản lý cấp 2 | Trưởng đơn vị |
  |---|---|---|---|
  | Đã công bố | `Đã có kết quả` | `Đã có kết quả` | `Đã có kết quả` |
  | Ngoài kỳ, đã nghỉ, không đánh giá | nhãn trạng thái | nhãn trạng thái | nhãn trạng thái |
  | Bị trả về (§27.2) | `Bị trả về để chỉnh sửa` | `Chờ QLTT đánh giá` | theo các dòng dưới |
  | Có điểm HRBP tải lên chưa duyệt | | | `Cần phê duyệt` |
  | Vai đang xem đã gửi | `Đã hoàn thành` | `Đã hoàn thành` | `Đã hoàn thành` |
  | Tới lượt vai đang xem | `Cần đánh giá` (NV đã gửi, nộp trễ hoặc thai sản) | `Cần đánh giá` (đã có điểm QLTT) | `Cần đánh giá` (đã có điểm LM2) |
  | Chưa tới lượt | nhãn trạng thái; `Chưa Tự đánh giá` khi NV còn nộp trễ được | `Chờ QLTT đánh giá` | `Chờ Quản lý cấp 2` |

- **Khi nào vai được chấm** (`PMSYer.managerReviewState`, danh sách và màn chi tiết cùng đọc):
  timeline của vai đang mở, hồ sơ không nghỉ việc, không `Không đánh giá`, và:
  QLTT: hồ sơ đủ mục tiêu, hoặc đã nộp file trễ, hoặc thai sản; LM2: đã có điểm QLTT, **kể cả điểm
  tự chép**; HOD: đã có điểm LM2, kể cả điểm tự chép. Điểm tự chép của QLTT không tính là QLTT đã gửi.
  Thai sản thành việc của QLTT ngay khi timeline QLTT bắt đầu.
- Hồ sơ thai sản trước timeline QLTT: cột Trạng thái ghi `Không yêu cầu Tự đánh giá`.
- Tag dưới tên nhân viên: `LWD: dd/mm/yyyy`, `Đã nghỉ việc`, `Đang nghỉ thai sản`, `Nộp trễ hạn`.
  Tag `Nộp trễ hạn` dùng tông vàng cảnh báo (`--warn`).
- Điểm tự chép có nhãn `(HR system)` dưới điểm, tooltip `Hệ thống tự chép điểm vì quá deadline`.
- Nút ở cột Chức năng có tooltip `Xem và đánh giá`, `Xem và chỉnh sửa` hoặc `Xem`. Bấm vào cả dòng cũng mở M-06.
- Ô tìm kiếm tìm theo tên, domain và phòng ban. Đổi phạm vi thì xóa ô tìm kiếm; `Indirect reports` mở vai LM2 trước.
- Cả ba vai đều thấy đủ các cột điểm: Nhân viên, QLTT, Quản lý cấp 2, Trưởng đơn vị, Điểm cuối cùng.
  LM2 có thêm cột Quản lý trực tiếp; HOD có thêm cột Quản lý trực tiếp và Quản lý cấp 2.

## 48. Chi tiết Đánh giá cuối năm của Quản lý

Chốt ngày 22/09/2026.

- Cả **QLTT, Quản lý cấp 2 và HOD** đều sửa được điểm và nhận xét của chính mình sau lần
  đánh giá đầu tiên, miễn là timeline của vai đó vẫn còn mở. Hết deadline mới chuyển chỉ xem.
- Quản lý cấp 2 và HOD chỉ nhập **điểm toàn diện (overall rating)** và nhận xét toàn diện cho
  nhân viên đã nằm trong roster được lọc sẵn của vai mình; điểm từng mục tiêu của các cấp trước
  chỉ để tham khảo.
- Ba tình huống `lm09`, `lm2-05`, `hod05` lần lượt kiểm tra trạng thái đã đánh giá nhưng vẫn
  chỉnh sửa được của từng cấp quản lý.
- Tab Cuối năm dùng đúng cấu trúc tab Giữa năm: một hàng điều hướng có `Quay lại danh sách
  nhân viên` bên trái và các action bên phải; không đặt thêm nút `Danh sách` trên topbar.
- Bảng mục tiêu dùng cùng phân bổ cột với Giữa năm, gồm cột `Thời gian`; hai panel nhận xét
  và thẻ Đánh giá toàn diện dùng cùng editor, toolbar, màu viền và nhãn vai trò.
- Bỏ toàn bộ nút và dialog `Trả về cho nhân viên` ở vai QLTT.
- Với hồ sơ có LWD, không dựng thêm box Mid-Year riêng. Box `Lưu ý` gồm bullet 1 về LWD
  và bullet 2: `Bạn có thể xem lại kết quả [Đánh giá giữa năm] 2026 của nhân viên trước khi
  tự đánh giá cuối năm.` Cụm `Đánh giá giữa năm` dùng màu thương hiệu, gạch chân và là liên
  kết chuyển sang tab Giữa năm ngay trong cùng màn.

Bổ sung ngày 27/09/2026 theo code và theo quyết định của chị:
- **Có dải quy trình** giống màn Nhân viên, ngay dưới hàng điều hướng và banner. Màn chi tiết là
  của một nhân viên nên mọi bước có domain, kể cả Tự đánh giá (§40.2). Trạng thái thu gọn nhớ riêng.
- Thứ tự khối dưới dải quy trình: `Bị trả về để chỉnh sửa` → `Hồ sơ không đánh giá` → hồ sơ nộp
  bổ sung (badge `Trễ hạn x ngày`, tên file, ngày gửi) → nhân viên thai sản (nút `Import mục tiêu hộ`
  chỉ hiện khi chưa có mục tiêu và timeline QLTT đang mở) → `Lưu ý` của LWD → dòng Đánh giá giữa năm.
  Hồ sơ `Không đánh giá` ẩn toàn bộ bảng mục tiêu và thẻ đánh giá toàn diện.
- Ba nhóm mục tiêu **luôn giữ khối** như màn Nhân viên (§40.5d); nhóm trống có một dòng xám mờ.
- Dòng mục tiêu có tooltip ở hai cột đầu và bấm mở popup `Chi tiết mục tiêu` của chính M-06
  (cùng cơ chế tab Giữa năm trong màn này). Mục tiêu đã đánh giá hoàn thành có thêm ô
  `Đã đánh giá hoàn thành bởi` với tên đầy đủ kèm domain (§13.1). Giá trị cốt lõi mở `#dlg-how`.
- Hàng nút: LM2 có `Trả về cho Quản lý trực tiếp`. `Lưu nháp` chỉ có trước lần gửi đầu. Nút gửi:
  QLTT `Gửi đánh giá`, LM2 và HOD `Lưu điểm`; sau lần gửi đầu đổi thành `Lưu thay đổi`.
  Bên phải luôn có `Phản hồi đã nhận`.
- Sau khi gửi: banner `Bạn đã hoàn thành đánh giá cho nhân viên này`, dòng phụ `Cập nhật lần cuối:
  dd/mm/yyyy - Bạn có thể chỉnh sửa tới hết hạn dd/mm/yyyy`, kèm `Điểm toàn diện của bạn`.
- Ngoài timeline của vai mà chưa gửi: dòng cuối `Ngoài thời gian đánh giá của bạn nên màn này chỉ để xem.`
- Thẻ đánh giá toàn diện theo vai: QLTT thấy Nhân viên và ô của mình; LM2 thấy thêm QLTT; HOD thấy
  thêm QLTT và LM2. Dưới điểm của QLTT có dòng `Điểm này không hiển thị cho nhân viên, kể cả sau khi
  công bố.`; LM2 và HOD có dòng `Nhận xét là tùy chọn. Bạn sửa được tới hết deadline của mình.`
- Ô bắt buộc khi QLTT gửi: điểm toàn diện, nhận xét toàn diện, điểm từng mục tiêu **trừ mục tiêu đã
  đánh giá hoàn thành** (ô khóa, §13.1), điểm cả năm giá trị cốt lõi, ba nhận xét nhóm. LM2 và HOD chỉ
  bắt điểm toàn diện.

## 49. Nhóm nút Lưu nháp và Gửi khi cuộn

Chốt ngày 27/09/2026.

- Nhóm nút `Lưu nháp` và `Gửi tự đánh giá` (hoặc `Gửi lại tự đánh giá`) vẫn nằm ở chỗ cũ, trên dải quy trình.
- Cuộn tới khi chỗ cũ khuất dưới thanh trên cùng thì nhóm nút **nổi ở giữa mép dưới vùng nội dung**
  (`.yer-actions.floating`: `position:fixed`, căn giữa phần bên phải sidebar, nền `--z0`, viền `--z200`,
  bo `--r`, bóng `--sh-lg`). Cuộn ngược lên thì trở về chỗ cũ; chỗ cũ giữ chiều cao để trang không giật.
- Thanh demo đang mở thì nhóm nút nằm ngay trên thanh demo, không bị che.
- Thiếu mục tiêu thì nút Gửi ở trạng thái khóa (`.yer-btn-locked`, icon khóa, nền `--z200`), vẫn bấm được
  để mở dialog `Chưa gửi được Tự đánh giá` nói thiếu gì và hạn bổ sung, kèm nút `Tới tab Mục tiêu`.
- Code: `toolbar()` và `bindFloatingToolbar()` trong `assets/yer-employee.js`.
