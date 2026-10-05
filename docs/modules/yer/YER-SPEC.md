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
| LM đánh giá chi tiết | LM | 19/01 - 08/02/2027 |
| LM2 đánh giá | LM2 | 09/02 - 22/02/2027 |
| HOD đánh giá | HOD | 23/02 - 08/03/2027 |
| Upload điểm CEO | TR | 09/03 - 22/03/2027 |
| Duyệt điểm final | HRD | 23/03 - 05/04/2027 |
| Publish | L&OD | 06/04/2027 (không dựng UI đợt này) |

**Cửa sổ nộp bổ sung nằm trọn trong timeline QLTT** (chốt 02/10/2026, theo ENH-E02 "Thời gian submit cho NV trễ là trong
timeline của LM"): hạn lần nhắc thứ tư (§27.3) không được muộn hơn hạn QLTT. Giữ bốn lần nhắc, mỗi lần 3 ngày làm việc
(hết 03/02/2027), nên lịch demo kéo timeline QLTT tới 08/02/2027 và dời các bước sau 7 ngày. Model kiểm bằng
`PMSYer.lateWindowFitsLm()`, test chặn lịch sai. Lịch thật do HR cấu hình cũng phải giữ điều kiện này.

Employee Response mở khi LM submit, đóng khi publish. Chạy song song bước LM2/HOD.
Calibration diễn ra offline, không dựng UI.

**Quản lý trực tiếp chờ đúng timeline của mình** (chốt 28/09/2026). Trong timeline Tự đánh giá, Quản lý trực
tiếp **không đánh giá được** cho nhân viên, kể cả khi nhân viên đã gửi sớm. QLTT phải chờ tới ngày bắt đầu bước
của mình (19/01/2027 theo lịch demo). Model đã chặn đúng như vậy: `managerReviewState('lm')` chỉ mở khi
`stepState('lm')` đã tới. M-06 có info box nói rõ bước của QLTT mở từ ngày nào và tới hết ngày nào (§8.3,
dựng ngày 30/09/2026).

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
- Nhãn `(HR system)` cạnh điểm ở cấp bị sync. Dùng một nhãn chung, không thể hiện chuỗi nguồn. Chốt 30/09/2026: nhãn là
  **chữ thường trong ngoặc** (11px/500, `--z600`), không viền, không nền, ở mọi màn (`.yer-sync-tag` của M-05, M-06, E-05).
  Ý nghĩa: **quá hạn của một cấp mà cấp đó không đánh giá thì hệ thống tự lấy điểm của cấp trước**. M-05 giải thích bằng tooltip
  khi rê chuột vào nhãn, M-06 và AI Summary ghi cùng câu: `Quá hạn mà cấp này không đánh giá nên hệ thống tự lấy điểm của cấp
  trước, không kèm nhận xét.`
- Không gửi thông báo. Quá deadline không ai sửa được.
- NV không tự đánh giá nhưng đủ goal: LM vẫn đánh giá bình thường **tới hết hạn QLTT**, cột điểm NV để trống.
  Hết hạn QLTT mà vẫn không có điểm nào (không tự đánh giá, QLTT không chấm, nên không có gì để
  sync) thì hồ sơ mới thành `Không đánh giá`. Chốt lại 02/10/2026: **trong thời gian nộp bổ sung** (§27.1) QLTT phải chờ
  nhân viên nộp, chưa chấm được; nhân viên nộp là QLTT chấm được ngay; hết mọi lần nhắc mà không nộp thì QLTT mới chấm hồ
  sơ không tự đánh giá này, tới hết hạn QLTT (rule nộp trễ ở §27.4).
- Hồ sơ nộp bổ sung dùng chung hạn QLTT (`lmDeadline()`, §27.3, chốt lại 02/10/2026); đồng bộ điểm từ NV sang cột LM chạy
  sau hạn QLTT như mọi hồ sơ.

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
không có nhận xét thì không có ô, không cấp nào có thì không dựng khối (`upperCommentsCard`). Tiêu đề ô ghi kèm
domain của cấp đó (§42). Điểm đồng bộ của hệ thống (`synced`) không có nhận xét nên không tạo ô. Tình huống demo: `nv11`.

Chị chốt lại ngày 04/10/2026: **E-05 giữ nguyên như trên**, không dựng sẵn ô trống cho Quản lý cấp 2 và Trưởng đơn vị như thẻ
bốn ô của màn Quản lý (§48), vì nhân viên không được xem điểm của hai cấp này: chỉ khi cấp đó để lại nhận xét thì mới có ô, khối
chỉ có một ô thì ô chiếm cả hàng. Màn Quản lý gộp các cấp vào thẻ Đánh giá toàn diện bốn ô kèm cả điểm (§48).

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
  | `submitted` | đã gửi, còn hạn | banner `Đã hoàn thành`, dòng `Bạn có thể chỉnh sửa tới hết ngày dd/mm/yyyy`, nút `Chỉnh sửa`, `Lịch sử chỉnh sửa`, nút tải xuống (§42) |
  | `editing` | đã gửi rồi bấm `Chỉnh sửa`, còn hạn | khối `Bạn đang chỉnh sửa Tự đánh giá đã gửi` + nút `Hủy chỉnh sửa`, form nhập, `Lưu nháp` + `Gửi lại tự đánh giá` |
  | `locked` | đã gửi, hết hạn (hoặc gửi bằng file) | banner `Đã hoàn thành`, `Lịch sử chỉnh sửa`, nút tải xuống (§42) |
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
  - Gửi lần đầu (chốt 28/09/2026): tiêu đề `Xác nhận gửi Tự đánh giá cuối năm`, hai gạch đầu dòng
    `Bản Tự đánh giá sẽ được chuyển tới Quản lý trực tiếp.` và `Bạn vẫn chỉnh sửa được tới hết ngày **dd/mm/yyyy**.`
    (ngày in đậm). Nút `Kiểm tra lại` và `Gửi tự đánh giá`.
  - Gửi lại: tiêu đề `Xác nhận gửi lại Tự đánh giá cuối năm`, hai gạch đầu dòng `Bản Tự đánh giá này sẽ thay bản đã
    gửi ngày dd/mm/yyyy.` và câu hạn chỉnh sửa như trên.
  - Gửi xong (lần đầu hay gửi lại) thì màn **tự cuộn tới banner xanh** `Đã hoàn thành` ở đầu tab.

### 8.2 Lịch sử chỉnh sửa

- Mỗi thao tác ghi một dòng vào `acts.selfLog.items` (seed dùng `selfLog`): `submit`, `reopen`, `cancel`,
  `resubmit`. Model thêm hai dòng suy ra: `late-file` khi hồ sơ gửi bằng file mà chưa có lịch sử, và
  `expired` khi hết hạn lúc đang chỉnh sửa (`Hệ thống giữ bản gửi ngày dd/mm/yyyy`).
- Dòng `resubmit` kèm phần thay đổi do `PMSYer.selfChanges(before, after, goalTypes)` tính: điểm toàn diện từ X thành Y,
  số điểm mục tiêu đã sửa (tổng và theo nhóm `goalScoresByType` khi màn truyền loại của từng mục tiêu), số điểm
  giá trị cốt lõi đã sửa, nhóm nhận xét đã sửa, đánh giá toàn diện đã sửa.
- Nút `Lịch sử chỉnh sửa` trên banner mở dialog. Dựng lại ngày 28/09/2026 thành **mỗi lần gửi một thẻ**, thay dạng
  timeline trộn lần gửi với mốc phụ:
  - Trên cùng là ô xanh `Bản đang được ghi nhận: Lần gửi N, gửi lúc hh:mm ngày dd/mm/yyyy`. **Không ghi điểm toàn
    diện** ở ô này. Đang chỉnh sửa thì thêm dòng bản này vẫn được giữ tới khi gửi lại.
  - Mỗi thẻ `Lần gửi N`, mới nhất ở trên. Thẻ đang có hiệu lực viền xanh, nhãn xanh `Đang được ghi nhận`; thẻ cũ
    không có nhãn (bỏ chữ `Đã thay bằng lần gửi N+1` vì khó hiểu, chốt 28/09/2026). Dưới tiêu đề là dòng
    `Gửi lúc hh:mm ngày dd/mm/yyyy`.
  - Lần gửi đầu **không có phần nội dung** (chốt 28/09/2026). Lần gửi lại ghi `Thay đổi so với lần gửi N-1`
    và liệt kê từng thay đổi trên một dòng: `Điểm toàn diện: 4 → 4.5`, điểm mục tiêu **ghi rõ nhóm**
    `Điểm Mục tiêu công việc: sửa 1 mục tiêu` / `Điểm Mục tiêu phát triển: sửa n mục tiêu` (bản ghi cũ không có nhóm thì
    giữ `Điểm mục tiêu: sửa n mục tiêu`),
    `Điểm giá trị cốt lõi: sửa n giá trị`, `Nhận xét đã sửa: …`, hoặc `Không thay đổi nội dung`.
  - Cuối thẻ là các thao tác trên chính bản đó, **viết thành câu đầy đủ**, không có nhãn `Sau khi gửi` và cột ngày giờ
    (chốt 28/09/2026): `Bạn mở bản này để chỉnh sửa lúc hh:mm ngày dd/mm/yyyy.`, `Bạn hủy chỉnh sửa lúc … , bản này được
    giữ nguyên.`, `Hết hạn chỉnh sửa lúc … mà bạn chưa gửi lại, hệ thống giữ bản này.` Mỗi câu có icon nhỏ xám.
  - **Không ghi domain của nhân viên**: người xem lịch sử là chính họ. Chỉ ghi `Hệ thống` khi hệ thống tự làm.
  - **Mọi thẻ và ô tóm tắt cùng một định dạng giờ** `lúc hh:mm ngày dd/mm/yyyy`, kể cả hồ sơ chỉ có một lần gửi
    (chốt 28/09/2026). Hồ sơ chưa có dòng lịch sử thì model suy ra dòng `submit` và lấy giờ từ bản đã gửi
    (`self.time`); dữ liệu mẫu dựng bằng `ev()` trong `yer-data.js` luôn có giờ (mặc định 16:30).
- Hồ sơ nộp bổ sung bằng file chỉ gửi một lần nên **không có** nút `Lịch sử chỉnh sửa` (chốt 28/09/2026).
- **Phía Quản lý (M-06, chốt 04/10/2026):** chỉ QLTT có `Lịch sử chỉnh sửa` trên M-06 (liên kết sau dòng ngày gửi của banner),
  cùng thẻ `.yer-ver` (CSS chuyển sang `assets/yer-ui.js` để E-05 và M-06 dùng chung). Quản lý cấp 2 và Trưởng đơn vị chỉ xem ở M-06
  nên **không có** lịch sử chỉnh sửa ở màn này; lịch sử lần lưu của họ nằm trong popup chấm điểm của M-05 (§47).
  - **Ai xem được lịch sử của ai** (chị chốt 05/10/2026): mỗi người chỉ xem lịch sử chỉnh sửa của chính mình, kể cả sau khi đã
    hết hạn. Nhân viên xem ở E-05; QLTT xem lịch sử của QLTT ở M-06 và **không** xem được lịch sử của Nhân viên; Quản lý cấp 2,
    Trưởng đơn vị **không** xem được lịch sử của Nhân viên lẫn QLTT. Màn Quản lý chỉ hiện bản đã gửi cuối cùng của cấp dưới.
  - Dữ liệu: `p.lmLog`, `p.lm2Log`, `p.hodLog` (`managerLog` trong model, mỗi dòng `{ at, time, score, comment, source,
    changes }`). QLTT ghi `acts.lmLog` mỗi lần gửi; LM2, HOD ghi `lm2Log` / `hodLog` như trước (§47). Hồ sơ mẫu chưa có
    lịch sử thì model suy ra một dòng từ bản đã gửi.
  - Tiêu đề: `Lịch sử chỉnh sửa đánh giá của Quản lý trực tiếp` / `Lịch sử chỉnh sửa điểm của [Vai]`. Thẻ `Lần gửi N` (QLTT) hoặc
    `Lần lưu N` (LM2, HOD); lưu ngoài màn chi tiết thì ghi cách lưu: `(lưu trên danh sách)`, `(tải lên từ file)`,
    `(duyệt điểm cấp trước)`, `(duyệt điểm HRBP upload)`.
  - Thẻ đầu ghi `Điểm toàn diện: x`. Thẻ sau ghi `Thay đổi so với lần gửi / lần lưu N-1`: điểm toàn diện, điểm mục tiêu theo
    nhóm và giá trị cốt lõi (QLTT, `changes` tính lúc gửi), nhóm nhận xét đã sửa, hoặc `Không thay đổi nội dung`.
  - Giờ lấy từ đồng hồ máy; cùng ngày thì không sớm hơn lần trước để thứ tự thẻ đúng.

### 8.3 Quản lý

- **Rule duy nhất về chỉnh sửa của cấp quản lý** (chốt 30/09/2026): mỗi vai tự sửa điểm và nội dung đánh giá của chính
  mình trong timeline của mình. Không vai nào trả hồ sơ về cho vai khác (bỏ luồng trả về của §27.2).
- QLTT, Quản lý cấp 2 và HOD không cần thu hồi bản đánh giá đã gửi: cả ba vai đều mở lại,
  chỉnh sửa và lưu cập nhật được tới hết deadline của chính mình.
- Sau deadline, đánh giá của vai đó chuyển sang chỉ xem.
- **Quản lý cấp 2 và Trưởng đơn vị chỉ xem ở màn chi tiết M-06** (chị chốt 04/10/2026, nguyên tắc quan trọng): hai vai này chấm
  và sửa điểm toàn diện ở danh sách M-05 (ô điểm trên lưới, Upload điểm, Duyệt điểm cấp trước, Duyệt điểm HRBP upload). M-06 của
  hai vai này không có `Lưu nháp`, `Lưu điểm`, `Chỉnh sửa`, liên kết `Lịch sử chỉnh sửa`, ô chọn điểm hay ô nhập nhận xét. Luật ở
  model: `PMSYer.managerReviewState(role, p).canEditDetail` (chỉ đúng với QLTT); `canEdit` vẫn là quyền chấm trên danh sách M-05.
- **Hạn của từng vai** (chốt 30/09/2026) lấy từ một helper `PMSYer.managerEditWindow(role, p)`, trả về `from`, `to`,
  `state` (`future`, `open`, `closed`). `to` là hạn chung của bước cho mọi hồ sơ, kể cả hồ sơ nộp bổ sung (bỏ hạn riêng
  ngày 02/10/2026, §27.3). `managerReviewState` cũng đọc helper này, nên quyền sửa và câu chữ báo hạn không lệch nhau.
- **Màn hình cho biết được sửa tới khi nào** (M-06, **gạch đầu dòng cuối của khối `Lưu ý`** dưới dải quy trình, §48).
  Chốt lại 02/10/2026: câu chữ **gọi tên vai** (`QLTT`, `Quản lý cấp 2`, `Trưởng đơn vị`, viết `[Vai]` dưới đây) thay cho `Bạn`,
  vì một người có thể giữ nhiều vai; mốc giờ là 18:00 ngày hạn.
  **Quy ước câu chữ màn Quản lý YER** (04/10/2026, chỉ áp cho YER, không phải rule DS chung): câu hướng dẫn, khối Lưu ý,
  tooltip nói hạn và popup xác nhận gửi gọi tên vai; nhãn của chính người xem (`Điểm của bạn`) giữ `bạn`. Một khối từ ba ý trở lên
  thì tách gạch đầu dòng. Không thêm câu nói về cơ chế hệ thống (`Hệ thống không chặn…`, `Hệ thống kiểm tra…`).
  Chốt thêm 04/10/2026: mốc giờ **in đậm đủ cụm** `**18:00 ngày dd/mm/yyyy**` (helper `at18` ở M-05 và M-06), dùng cho mọi câu
  hạn trên hai màn: khối Lưu ý, khối hướng dẫn thai sản (dùng **cùng câu** với khối Lưu ý, bỏ câu riêng `QLTT có thể chỉnh sửa kết
  quả đánh giá trước…`), khối vàng chờ nộp bổ sung, khối `Hồ sơ không đánh giá`, popup chấm điểm và popup Upload của M-05,
  ghi chú màn Duyệt điểm HRBP upload. Tooltip là chữ thường nên chỉ ghi `tới hết 18:00 ngày dd/mm/yyyy`, không đậm.

  | Tình huống | Câu chữ |
  |---|---|
  | Trước timeline | `Bước đánh giá của [Vai] mở từ dd/mm/yyyy tới hết 18:00 ngày dd/mm/yyyy.` (bỏ câu `Trước ngày mở, … chỉ xem được hồ sơ…` ngày 04/10/2026) |
  | Đang mở, chưa gửi | QLTT: `Sau khi gửi đánh giá, QLTT có thể chỉnh sửa tới hết 18:00 ngày dd/mm/yyyy.`; LM2, HOD: `Màn này chỉ để xem. [Vai] chấm và chỉnh sửa điểm toàn diện tại danh sách nhân viên của tab Đánh giá cuối năm, tới hết **18:00 ngày dd/mm/yyyy**.` (04/10/2026) |
  | Đang mở, cấp dưới chưa xong | LM2: `Quản lý cấp 2 đánh giá được sau khi Quản lý trực tiếp gửi đánh giá, tới hết 18:00 ngày dd/mm/yyyy.`; HOD: `… sau khi Quản lý cấp 2 lưu điểm, …` |
  | Đã gửi, còn hạn | banner có nút `Chỉnh sửa`, tooltip `[Vai] chỉnh sửa được tới hết 18:00 ngày dd/mm/yyyy`; bấm thì hỏi xác nhận rồi khối `đang chỉnh sửa` thay banner (§48) |
  | Đã gửi, hết hạn | banner không có nút `Chỉnh sửa` |
  | Chưa gửi, hết hạn | `Bước đánh giá của [Vai] đã kết thúc lúc 18:00 ngày dd/mm/yyyy, màn này chỉ để xem.` |

  Hồ sơ `Không đánh giá` hoặc đã nghỉ việc không có khối này. Popup xác nhận gửi cũng lấy hạn từ helper này.
  Hồ sơ không Tự đánh giá (hết các lần nhắc, đủ mục tiêu): tình trạng nằm ở banner xám (§48), khối `Lưu ý` không nhắc lại.
  Danh sách M-05 ghi hạn vào tooltip của nút bút, popup đánh giá toàn diện và popup Upload điểm (§47).

## 9. HRBP upload hộ HOD

- Chỉ hỗ trợ bước HOD (không áp dụng cho LM2).
- File: mã NV, tên, domain NV, division, department, grade, domain LM1, điểm toàn diện, nhận xét.
- Có bước preview và đối soát trước khi ghi. Trùng với điểm đã chấm tay thì báo conflict để chọn.
- Điểm HRBP upload chưa duyệt **không hiện** ở màn chính của HOD; nằm ở màn `Duyệt điểm HRBP upload` (tên cũ `Phê duyệt điểm hiệu chuẩn`, đổi 05/10/2026).
- HOD duyệt hàng loạt được, **không sửa** điểm trước khi duyệt.
- Trong timeline HOD: upload lại, duyệt lại, sửa bao nhiêu lần cũng được. Hết deadline thì cut off.

Dựng ngày 30/09/2026 (phía HOD; màn HRBP tải file và bước đối soát conflict chưa dựng):
- Luật ở `PMSYer.calibrationState(p)`: `has`, `score`, `comment`, `by`, `at`, `approved`, `canApprove` (chưa duyệt và HOD
  chấm được hồ sơ, tức trong timeline HOD và đã có điểm LM2, §47), `manual` (điểm HOD chấm tay), `conflict` (điểm chấm tay khác
  điểm tải lên). Dữ liệu: `hrbpUpload: { at, score, comment, approved, by }`; duyệt thì ghi `hrbpUpload.approved`,
  `approvedAt` và `hod: { score, comment, at, source: 'hrbp-upload' }` (nhận xét lấy của file tải lên, file không có thì giữ
  nhận xét HOD đã viết).
- M-05, vai HOD: nút `Duyệt điểm HRBP upload` (`bx-check-shield`, chị đổi tên 05/10/2026 cho đúng bản chất, thay `Duyệt điểm
  hiệu chuẩn`) cạnh `Upload điểm`. Chỉ HOD có nút này (như MYR-55). Tab Giữa năm giữ tên cũ (chị dặn chưa sửa tab Giữa năm).
  **Nút chỉ bấm được khi có điểm HRBP tải lên còn duyệt được** (chưa duyệt và còn trong timeline HOD), kèm số hồ sơ đó
  (chốt 30/09/2026). Không có thì nút khóa, tooltip nói lý do: `Chưa có điểm HRBP tải lên cần duyệt`, `Mở từ dd/mm/yyyy`
  hoặc `Đã hết hạn duyệt ngày dd/mm/yyyy`.
- Màn `Duyệt điểm HRBP upload` cùng bố cục với tab Giữa năm (MYR-56): phủ vùng nội dung, `Quay lại`, dòng phụ
  `Đánh giá cuối năm 2026 - HOD - Indirect reports`, nút `Duyệt điểm` kèm số dòng đã tick. Khối ghi chú là **bốn gạch đầu dòng**
  gọi tên vai (chốt 04/10/2026): điểm tải lên là điểm HRBP tải lên thay Trưởng đơn vị; tick và `Duyệt điểm` thì thành điểm Trưởng
  đơn vị; Trưởng đơn vị không sửa điểm tải lên trước khi duyệt; hạn duyệt `tới hết **18:00 ngày dd/mm/yyyy**` (trước hoặc sau
  timeline thì nói lý do khóa). Bộ lọc: Nhân viên, Quản lý trực tiếp, Quản lý cấp 2. `Tải xuống`: Excel (.xls) hoặc CSV.
- Cột: chọn, Nhân viên, Quản lý trực tiếp, Quản lý cấp 2, Điểm của NV, QLTT, QL cấp 2, **Điểm Upload** (màu `--upd`, dòng dưới
  ghi domain người tải lên và ngày, tooltip thêm nhận xét; đã duyệt thì dòng dưới là `Đã duyệt` màu xanh), Điểm của Trưởng đơn
  vị (điểm chấm tay khác điểm tải lên thì có dòng vàng `Khác điểm tải lên`), Chức năng (xem). Dòng chờ duyệt lên đầu, rồi đã
  duyệt, rồi dòng không có điểm tải lên. Ô chọn khóa kèm lý do: `Chưa có điểm HRBP tải lên`, `Đã duyệt` hoặc lý do timeline.
- **Đồng bộ với danh sách chính** (chị chốt 05/10/2026): dưới tên nhân viên có cùng các tag `LWD`, `Đang nghỉ thai sản`,
  `Nộp trễ hạn`, `Không tự đánh giá`; dòng bộ phận, vị trí một dòng có `...`; điểm của cấp quản lý và Điểm Upload cao hơn mức
  tối đa có cùng dấu cảnh báo ⚠ đặt cạnh số.
- **Mọi cách ghi điểm hàng loạt đều qua popup xác nhận vượt mức** (chị chốt 05/10/2026, §27.3): `Duyệt điểm QLTT` / `Duyệt điểm
  QL cấp 2` (điểm cấp trước), `Upload điểm` và `Duyệt điểm` ở màn này. Có hồ sơ nộp bổ sung bị giới hạn điểm mà điểm sắp ghi
  cao hơn mức tối đa thì hiện popup `Có điểm cao hơn mức tối đa theo quy định`, liệt kê `Tên (domain): điểm x, tối đa 3 (lần
  nhắc thứ n)`, ô tick `Tôi xác nhận giữ các điểm trên dù cao hơn mức tối đa theo quy định.`; chưa tick thì nút `Xác nhận`
  khóa. Chấm từng người trong popup chấm điểm dùng ô tick riêng của popup đó. Luật ở `PMSYer.overRatingCap`, màn gọi
  `confirmOverCap` trong `assets/yer-manager.js`.
- Duyệt mà có dòng khác điểm chấm tay thì hiện popup `Thay điểm bạn đã chấm?` liệt kê `Tên (domain): điểm cũ → điểm tải lên`,
  nút `Quay lại` / `Duyệt điểm`.
- Tình huống demo: `hod06` (bốn hồ sơ chờ duyệt: `e8` nộp bổ sung lần nhắc 3 với điểm tải lên 3.5 cao hơn mức tối đa 3, `e9`,
  `e11`, và `e12` có điểm chấm tay khác). Người tải lên mẫu là HRBP
  `Lý Minh Châu (chau.ly)`, không trùng nhân viên nào trong danh sách.

## 10. Employee Response (Enh 5)

Chốt ngày 22/09/2026: **bỏ toàn bộ chức năng Employee Response khỏi luồng YER**.

- Nhân viên không có khối `Phản hồi của Nhân viên` ở bất kỳ trạng thái nào.
- Quản lý không có bộ lọc, icon nhận diện, nội dung phản hồi hoặc hành động trả lời.
- Model không còn sinh `responseOpen`, `replyOpen` hay thread phản hồi.
- Các tình huống Demo chuyên cho luồng phản hồi (mã `nv19`, `nv20` của bộ tình huống cũ) được loại bỏ. Mã hiện tại xem §46.

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
- QLTT **thêm mục tiêu** cho nhân viên thai sản trong mọi trường hợp: đã có, còn thiếu hay chưa có mục tiêu (chốt 30/09/2026).
  Mục tiêu QLTT thêm **tự động `Đã duyệt`**, không qua bước phê duyệt, rồi QLTT đánh giá luôn. Cách làm ở §33.
- Mục tiêu QLTT thêm ở tab Đánh giá cuối năm **không thêm vào và không liên kết với tab `Danh sách mục tiêu`** của nhân viên;
  tạm thời **không sửa, không xóa** được sau khi thêm (chốt 02/10/2026, §33).
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
| Cột **Điểm QLTT** | điểm chỉ xem, dưới là **domain người chấm** 10.5px màu `--z500` (`.ql-by`), đặt tuyệt đối nên điểm NV và điểm QLTT cùng hàng (M-06 sửa 04/10/2026) |
| Popup chi tiết mục tiêu | `#dlg-detail` mở bằng `openDetailFromRow` (§13.2), khối hai lượt chấm ghi `Đánh giá bởi **domain** - dd/mm/yyyy`; thẻ thứ hai tên `Quản lý trực tiếp đánh giá`, không có đường kẻ thừa trên khối (chị chốt 04/10/2026, E-05 và M-06). E-05 và **M-06** cùng cách (M-06 sửa 04/10/2026, trước đó dùng popup rút gọn `Đã đánh giá hoàn thành bởi`) |

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
- **AI Summary** (chốt lại 30/09/2026): **bấm mới chạy** ở cả ba vai, không tự chạy. LM2 và HOD chỉ chấm điểm toàn diện
  nên xem AI Summary **ngay trên lưới danh sách**: nút `bxs-magic-wand` nằm ở **cột Chức năng** của từng dòng (đứng đầu, trước
  nút xem; chuyển từ cạnh ô chấm điểm sang ngày 30/09/2026; đây là nút duy nhất trong cột mang màu nhấn), bấm mở popup
  `AI Summary` (rộng 640px, dòng `Đang tổng hợp đánh giá…` rồi nội dung). Bố cục popup (chốt lại 02/10/2026):
  0. Popup **cao tối đa bằng màn hình** (cách mép 16px): tiêu đề và nút `Đóng` đứng yên, phần nội dung cuộn, để hồ sơ đã qua đủ
     các bước không tràn khỏi màn hình.
  1. Header `Nhân viên: Tên (domain)`, có đường kẻ tách khỏi nội dung.
  2. `Điểm toàn diện các cấp`: dữ liệu, không phải AI. Bốn thẻ **nhỏ** theo thứ tự `Nhân viên`, `QLTT`, `Quản lý cấp 2`,
     `Trưởng đơn vị`: bên trái tên vai và **domain** người chấm, bên phải điểm cỡ 15px (chưa có thì `—`) và `(HR system)` nếu điểm
     do hệ thống chép; điểm không nổi hơn nội dung. Ngay dưới là các dòng lưu ý về hồ sơ, độc lập với AI: câu hình thức xử lý của
     hồ sơ nộp bổ sung (tông vàng, §27.3), thai sản, LWD, điểm `(HR system)`.
  3. Khối `AI tổng hợp` (viền màu thương hiệu, mascot `think.png` 20px) chia hai phần `Nhân viên tự đánh giá` và `Các cấp quản lý
     đánh giá`. **Mỗi ý là một gạch đầu dòng**, không chia mục con (`Kết quả nổi bật`, `Phát triển`…) và **không nhắc tới điểm**:
     chỉ tổng hợp nhận xét về mục tiêu công việc, mục tiêu phát triển, hành vi (giá trị cốt lõi) và nhận xét toàn diện. Phần quản lý
     gồm bốn nhận xét của QLTT rồi nhận xét toàn diện của Quản lý cấp 2, Trưởng đơn vị; điểm hệ thống chép không có nhận xét nên
     không có ý. Phần nào chưa có thì một dòng xám nghiêng. Cuối khối ghi nội dung do AI tổng hợp, chỉ để tham khảo.
  Từ 04/10/2026 **QLTT cũng có nút AI Summary** ở cột Chức năng của danh sách (đứng trước nút bút / mắt), như LM2, HOD.
  Lưu ý về hồ sơ nộp bổ sung ở lần chưa có hình thức xử lý ghi `Nhân viên nộp Tự đánh giá trễ hạn n ngày làm việc - Lần nhắc thứ k.`;
  lần có hình thức thì dùng câu hình thức xử lý (§27.3).
  Dòng chưa có tự đánh giá và chưa có điểm QLTT thì không có nút. M-06 có nút `AI Summary` (`bxs-magic-wand`, chữ và viền màu
  thương hiệu) ở hàng nút của màn chi tiết, cho cả ba vai, cũng bấm mới chạy và mở cùng popup. Nội dung và popup viết một lần
  ở `assets/yer-ai.js` (`PMSYerAi.openSummary`), M-05 và M-06 cùng gọi. Không có bản summary cả team.
- **Trợ lý viết nhận xét** (chỉ QLTT, dựng 30/09/2026): nút nhỏ `Cải thiện với AI` (`bxs-magic-wand`, DS §19 rule 20) ở góc bốn ô
  nhận xét đang sửa của QLTT trên M-06 (ba nhận xét nhóm, nhận xét toàn diện). Bấm mở panel trượt từ phải `Trợ lý viết nhận xét`
  (mascot `think.png`): nội dung hiện tại của ô (hoặc câu báo ô đang trống), bốn cách viết `Viết bản nháp từ điểm đã chấm`,
  `Viết rõ ràng, đầy đủ hơn`, `Ngắn gọn hơn`, `Thêm gợi ý phát triển`, ô `Gợi ý của AI` sửa được và có bộ đếm ký tự (500 với
  nhận xét nhóm, 1000 với nhận xét toàn diện), ghi chú AI chỉ gợi ý, nút `Hủy` / `Chèn vào ô nhận xét`. **AI không tự chèn**: chỉ
  khi bấm `Chèn` nội dung mới vào ô, thay nội dung cũ, QLTT vẫn sửa tiếp được. Gợi ý dựng từ điểm QLTT đang chấm, tên mục tiêu,
  năm giá trị cốt lõi và điểm toàn diện; viết lại thì bỏ các nhãn cũ (`Kết quả:`, `Gợi ý phát triển:`…) trước khi viết.
  Esc, dấu x hay bấm ra ngoài thì đóng panel, không chèn gì.
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

### 18.4 Nhãn trên các tab đánh giá (E-05, M-05, M-06)

Chốt lại ngày 27/09/2026, thay bảng nhãn theo trạng thái hồ sơ. **Nhãn tab đánh giá không đổi theo
trạng thái của từng người**: mọi nhân viên cùng thấy một nhãn tại cùng một ngày. Việc cụ thể của từng
người (cần tự đánh giá, chờ Quản lý, thiếu mục tiêu…) nằm trong nội dung tab.

| Tab | Luật | Nhãn | Màu |
|---|---|---|---|
| Đánh giá cuối năm | `PMSYer.yerPhase(now)`: trước ngày mở Tự đánh giá | `Chưa mở` (tab khóa) | xám |
| | từ ngày mở tới trước ngày Công bố | `Cần hoàn tất` (đổi từ `Đang hoạt động` ngày 28/09/2026) | xanh |
| | từ ngày Công bố | `Đã hoàn tất` | xám |
| Đánh giá giữa năm | trước ngày mở kỳ cuối năm | `Đang hoạt động` | xanh |
| | kỳ cuối năm đã mở (chốt lại 04/10/2026: **chỉ theo ngày**, có hay không có tình huống demo) | `Đã hoàn tất`, **mọi người**, kể cả không có kết quả | xám |
| Danh sách mục tiêu | `PMSYer.goalAction(p)`: thiếu mục tiêu và hạn Tự đánh giá chưa qua | `Cần thiết lập mục tiêu công việc` / `Cần thiết lập mục tiêu phát triển` / `Cần thiết lập mục tiêu` (thiếu cả hai) | xanh, cùng kiểu nhãn `Cần hoàn tất` |
| | còn lại | không có nhãn | |

- Hết hạn Tự đánh giá thì tab Mục tiêu không còn nhãn: mục tiêu còn thiếu đi theo file nộp trễ (§27.1).
- Tab đầu đổi tên thành **`Danh sách mục tiêu`** (27/09/2026) ở E-05 và M-06. Tab rộng hơn nên nhãn dài nhất
  vẫn nằm gọn trong tab; nhãn neo mép trái (`left:5px`) và có `z-index:2` để không bị tab kế bên che chữ.
- Tab khóa vẫn giữ nhãn giai đoạn; lý do khóa nằm ở tooltip (`Không thuộc kỳ Đánh giá cuối năm 2026`,
  `Onboard sau 01/04/2026 nên không thuộc kỳ Đánh giá giữa năm 2026`, `Bắt đầu từ dd/mm/yyyy`).
- Luật và câu chữ nằm ở **`PMSYer.cycleTabLabel(cycle, now, lang, empId)`** trong `assets/yer-model.js` (chốt 30/09/2026),
  trả về `{ text, past }`; `past` thì nhãn xám (`.yer-past-cycle-label`), không thì xanh.
- **Màn Quản lý dùng đúng nhãn này** (chốt 30/09/2026): tab Đánh giá giữa năm và Đánh giá cuối năm ở M-05 (`#cy-1-lbl`,
  `#cy-2-lbl`) và M-06 (`#tablbl-myr`, `#tablbl-yer`) cùng câu chữ, cùng màu với E-05. Không đặt nhãn riêng theo vai hay
  theo hồ sơ (đã bỏ `managerTabLabel` với các nhãn `Cần đánh giá`, `Đã hoàn thành`, `Cần phê duyệt`, `Đã có kết quả`).
  Việc của từng vai nằm trong nội dung tab. Danh sách M-05 không gắn với một nhân viên nên không truyền `empId`.

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
- **Không có card Điểm cuối cùng riêng**. Sau khi nộp, banner trạng thái luôn hiện **`Điểm tự đánh giá`** và
  **`Điểm cuối cùng`** (chị chốt 05/10/2026, như M-06): `—` kèm tooltip cho tới khi công bố, công bố rồi thì là số điểm,
  không kèm tên mức. Banner luôn có nút tải xuống (chọn PDF hoặc Excel, §42).
- Ô nhận xét ở trạng thái chỉ xem giữ nguyên khung `ev-editor-wrap`, bỏ thanh công cụ, nền xám nhạt.

Quy ước dữ liệu ghi vào store:
- `acts[emp].selfDraft` - bản nháp tự đánh giá, không tính là đã gửi.
- `acts[emp].self` - bản đã gửi, có `at` nên model coi là đã submit.
- `acts[emp].deletedGoals.ids` - danh sách mục tiêu đã xóa mềm.

Khi gộp vào sản phẩm thật, toàn bộ tab này chuyển thẳng vào `E-01`, `E-05` chỉ là bản dựng để review.

Bổ sung ngày 27/09/2026 theo code:
- Khối cảnh báo thiếu mục tiêu có hai biến thể. Còn trong hạn tự đánh giá: tiêu đề
  `Bạn chưa đủ điều kiện thực hiện đánh giá cuối năm`, câu cuối dẫn sang tab Mục tiêu.
  Đã hết hạn: tiêu đề `Bạn không thể thực hiện Tự đánh giá cuối năm`, câu cuối ghi hồ sơ được ghi nhận là
  Không đánh giá. Cả hai biến thể **không có nút riêng** (bỏ 28/09/2026); câu chữ hiện tại ở §40.5a.
  Từ 28/09/2026, hết cả hạn nộp bổ sung thì không dùng biến thể này mà dùng khối vàng `.yer-late-closed` (§27.1);
  biến thể hồng hết hạn chỉ còn cho hồ sơ ngoài luồng nộp bổ sung (vd thai sản).
- Hết hạn tự đánh giá mà chưa gửi (không thai sản, không thiếu mục tiêu): một khối `Thời gian nộp trễ đã
  kết thúc lúc 18:00 ngày dd/mm/yyyy`, ngày là hạn nộp bổ sung ở §27.1. Không hiện khi đã có khối cảnh
  báo thiếu mục tiêu, để không thành hai box (§40.5a).
- Điểm QLTT là điểm hệ thống tự chép (§6): nhân viên không thấy điểm từng mục tiêu và nhận xét của QLTT.
  Ô nhận xét nhóm ghi `Quản lý không gửi nhận xét trong kỳ này`; ô toàn diện ghi `Quản lý không gửi
  đánh giá chi tiết`, `Hệ thống ghi nhận điểm theo quy định khi quá hạn`.
- Ô của QLTT khi chưa có dữ liệu ghi theo tình huống: chờ nhân viên gửi, QLTT sẽ nhận xét trong bước của
  mình, hoặc `Không có Tự đánh giá. Quản lý tiếp tục đánh giá theo quy trình`, kèm `Mở từ dd/mm/yyyy`.
- Banner sau công bố: tiêu đề `Đã công bố kết quả đánh giá cuối năm 2026`. Nút tải xuống chỉ có icon, có tooltip (§42).
- Ô bắt buộc khi gửi tự đánh giá: điểm từng mục tiêu chưa khóa (§13.1), nhận xét nhóm công việc và phát
  triển khi nhóm đó có mục tiêu, điểm cả năm giá trị cốt lõi, nhận xét nhóm hành vi, điểm và nhận xét toàn
  diện. Hộp thoại báo thiếu và viền đỏ các ô còn thiếu: xem §41.1.

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
   - `Hạn Tự đánh giá đã kết thúc ngày dd/mm/yyyy, **trễ n ngày làm việc**. Bạn cần hoàn thành nộp bổ sung trước
     **18:00 ngày dd/mm/yyyy**.` (không đặt số ngày trễ trong ngoặc đơn, chốt 28/09/2026);
   - `Hình thức xử lý: …` **chỉ hiện khi lần này đã có hình thức áp dụng** (lần 3 và 4);
   - `Lưu ý: nếu quá hạn trên mà bạn vẫn chưa nộp, …` là **câu đầy đủ theo nội dung quy định**, chỉ gọn lại, không rút
     thành cụm từ (chốt 28/09/2026). Không lặp lại hạn nộp đã nói ở câu trên:

     | Lần | Hình thức xử lý | Lưu ý: nếu quá hạn trên mà bạn vẫn chưa nộp, … |
     |---|---|---|
     | 1 | (không hiện) | hệ thống sẽ gửi nhắc nhở lần thứ 2 vào ngày dd/mm/yyyy. Sau 2 lần nhắc nhở mà nhân viên vẫn chưa hoàn thành Tự đánh giá, các biện pháp xử lý tiếp theo sẽ được áp dụng theo quy định Công ty. |
     | 2 | (không hiện) | các biện pháp xử lý tiếp theo sẽ được áp dụng theo quy định Công ty, bắt đầu từ việc giới hạn điểm đánh giá toàn diện tối đa là 3. |
     | 3 | Điểm đánh giá toàn diện được giới hạn tối đa là 3. | bạn có thể bị cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo. Thời gian tạm hoãn tính từ thời điểm nhắc nhở thứ tư. Việc áp dụng cụ thể do Trưởng đơn vị (HOD) phối hợp với HOHR đề xuất và được Giám đốc điều hành (CEO) hoặc người được ủy quyền phê duyệt. |
     | 4 | Cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo. Thời gian tạm hoãn tính từ thời điểm nhắc nhở thứ tư. Việc áp dụng cụ thể do Trưởng đơn vị (HOD) phối hợp với HOHR đề xuất và được Giám đốc điều hành (CEO) hoặc người được ủy quyền phê duyệt. (không còn giới hạn điểm 3, chốt 28/09/2026) | Công ty có thể sẽ đánh giá và áp dụng các hình thức kỷ luật phù hợp theo Nội quy lao động đã quy định. |

     Câu gốc nằm ở `LATE_TEXT` trong model, dùng chung cho khối này, banner sau khi nộp và popup xác nhận gửi file;
   - phần thao tác cuối khối (chốt 28/09/2026) nói rõ tick xác nhận là **bước đầu tiên** của việc nộp bổ sung:
     dòng `**Để nộp bổ sung Tự đánh giá**, bạn thực hiện 2 bước:` rồi hai bước đánh số trên một hàng, nối bằng mũi tên:
     - chưa xác nhận: `1` ô đánh dấu `Tôi đã đọc, hiểu và xác nhận tiếp tục.` → `2` nút `Nộp bổ sung` (khóa tới khi
       đánh dấu, tooltip `Đánh dấu xác nhận ở bước 1 để tiếp tục`). Bấm thì lưu xác nhận và mở ngay **popup**
       `Nộp bổ sung hồ sơ Đánh giá cuối năm`. Tên nút nói đúng việc sẽ làm, không dùng `Xác nhận và tiếp tục`;
     - đã xác nhận: bước 1 thành dấu tích xanh và dòng `Bạn đã xác nhận ngày dd/mm/yyyy`, bước 2 là nút `Nộp bổ sung`
       để mở lại popup.
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
- **Mục tiêu trong file chỉ dùng cho tab Đánh giá cuối năm** (chốt 02/10/2026): không nạp vào và không liên kết với tab
  `Danh sách mục tiêu` của nhân viên (E-05) hay của Quản lý. Hai tab hiển thị độc lập: tab Danh sách mục tiêu chỉ đọc mục tiêu
  nhân viên tạo theo quy trình mục tiêu, tab Đánh giá cuối năm đọc `PMSYer.reviewGoals(p, type)` (§33).
- Bản tự đánh giá ghi `source: 'file-import'` kèm tên file.
- Trạng thái danh sách và nhãn tab: `Nộp trễ hạn - Chờ Quản lý`.
- Banner Nhân viên ghi `Đã hoàn thành bổ sung Tự đánh giá cuối năm`; dòng dưới hiển thị
  `Ngày gửi: dd/mm/yyyy - Trễ hạn x ngày làm việc`. Số ngày trễ đếm theo **ngày làm việc** (§27.3);
  `Trễ hạn x ngày làm việc` là **một nhãn màu đỏ** `--err-bg`/`--err-bd`/`--err` (chốt 28/09/2026 theo DS §19 rule 24: nhãn trạng thái quá hạn dùng đỏ; hồng thương hiệu chỉ dành cho việc cần làm). Dòng tiếp theo trong
  chính banner: **`Hình thức xử lý theo quy định`** `(nộp ở lần nhắc thứ k): …`. Chốt lại 28/09/2026:
  - dòng này **chỉ hiện khi đã có hình thức áp dụng** (lần 3, 4); nộp ở lần 1, 2 thì không có dòng này;
  - chỉ ghi lần nhắc thứ mấy, **không ghi tổng số lần** (không dùng `k/4` ở bất kỳ chỗ nào, kể cả popup xác nhận
    và badge ở M-06);
  - nhãn `Hình thức xử lý theo quy định` in đậm; nội dung chữ thường, **chỉ in đậm từ khóa**: `tối đa là 3`,
    `cắt giảm một phần tiền thưởng`, `tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo` (`LATE_KEYWORDS`);
  - không ghi thêm câu `Thời gian tạm hoãn: từ … đến …`.
  Không dựng khối riêng bên dưới vì trùng thông tin với banner. Nhãn trễ hạn và dòng này luôn có, kể cả sau khi
  công bố kết quả.
- Màn Quản lý đọc được mục tiêu import và chấm bình thường. Mọi hồ sơ từ luồng nộp bổ
  sung bằng file đều có badge đỏ `Trễ hạn x ngày làm việc - lần nhắc thứ k` nổi bật tại khối cảnh báo để
  Quản lý nhận diện ngay, dùng cùng phép tính và hệ màu với banner Nhân viên.

**`Không đánh giá`** chỉ xuất hiện khi **hết cả bốn lần nhắc** mà vẫn thiếu mục tiêu và
không có file nào được nộp. Khi đó màn Nhân viên chỉ còn một khối nổi màu **vàng cảnh báo** (`.yer-note.yer-late-closed`, cùng tông với `.yer-late-note`):
`Thời gian nộp bổ sung Tự đánh giá đã kết thúc lúc 18:00 ngày dd/mm/yyyy.` tiếp theo là `Bạn đã không nộp sau 4 lần nhắc nhở.` Chốt
28/09/2026 (tình huống `nv21`; trước đó code dựng nhầm khối hồng thiếu mục tiêu), câu sau đó là:
`Vì còn thiếu [loại mục tiêu] được duyệt, các bước đánh giá tiếp theo của cấp quản lý sẽ không thể tiếp tục. Quy trình
Đánh giá cuối năm của bạn chính thức dừng tại đây và không có điểm trên hệ thống. Việc không tuân thủ tiến độ này sẽ được
xem xét và áp dụng các hình thức kỷ luật phù hợp theo Nội quy lao động.` (loại mục tiêu in đậm). Hồ sơ đủ mục tiêu
mà không nộp (`nv20`) giữ câu kỷ luật chung `LATE_TEXT.discipline`. Không dựng khối `Lưu ý` nữa. Mô hình: `stopped` cần đủ ba điều kiện — thiếu mục tiêu,
đã qua `lateSubmissionDeadline`, và không có `lateSubmission`.

**Nhắc**: nhân viên trễ hạn và Quản lý đang phụ trách sau cut-off 31/12/2026 đều nhận nhắc.
Prototype không dựng inbox thông báo, chỉ hiện badge và banner trên màn.

**Giới hạn của bản dựng**, phải thay khi làm thật:

- Bản dựng **không đọc nội dung file Excel**. Nộp xong, hệ thống sinh sẵn một bộ điểm và
  nhận xét mẫu để luồng đi tiếp được. Bản thật phải parse file và có bước đối soát.
- Prototype dùng file Excel dựng sẵn theo từng hồ sơ demo. Bản thật cần sinh file động từ
  toàn bộ mục tiêu đã duyệt của nhân viên tại thời điểm tải.

### 27.2 Trả về để chỉnh sửa

**Bỏ toàn bộ** (chốt 30/09/2026). Không vai nào trả hồ sơ về cho vai khác: QLTT không trả Self Assessment về cho Nhân
viên, Quản lý cấp 2 không trả về cho QLTT. Rule duy nhất là mỗi cấp quản lý tự sửa điểm và nội dung đánh giá của mình
trong timeline của mình (§8.3). Không còn nút `Trả về cho Quản lý trực tiếp`, hộp thoại lý do, trạng thái
`Bị trả về để chỉnh sửa`, hạn nộp lại 24 giờ hay bản ghi `acts[emp].returned`; bản ghi cũ còn trong dữ liệu cũng bị bỏ qua.

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
| 4 | 01/02/2027 | 18:00 03/02/2027 | cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương 6 tháng tính từ thời điểm nhắc lần 4 (01/02 đến 01/08/2027); việc áp dụng cụ thể do HOD phối hợp HOHR đề xuất, CEO hoặc người được ủy quyền phê duyệt. Không còn giới hạn điểm 3 | Công ty có thể áp dụng hình thức kỷ luật theo Nội quy lao động |

- Hình thức xử lý theo lần nộp (`LATE_ROUND_RULE`): lần 3 là giới hạn điểm 3, lần 4 là cắt giảm thưởng và tạm hoãn.
  Chốt 28/09/2026: lần 4 **không cộng thêm** giới hạn điểm 3 (thay rule cộng dồn cũ). Giới hạn điểm tối đa 3 **chỉ là
  thông báo**, hệ thống không chặn điểm.
- **Xác nhận đã đọc.** Trước khi mở popup tải lên, nhân viên phải đọc thông báo của **đúng lần nhắc đang mở**
  và đánh dấu `Tôi đã đọc, hiểu và xác nhận tiếp tục.` (§27.1). Xác nhận **chỉ giữ trong trang đang mở**
  (biến `lateAckMem` của `yer-employee.js`, không ghi vào dữ liệu): tải lại trang (F5) là trở về chưa xác nhận
  (chốt 28/09/2026). Sang lần nhắc mới cũng phải xác nhận lại vì hình thức xử lý đổi.
- Màn chỉ hiện nội dung của lần nhắc đang mở, không liệt kê cả bốn lần.
- Popup xác nhận gửi file thêm câu: hồ sơ được ghi nhận trễ n ngày làm việc, ở lần nhắc thứ k, kèm hình thức xử lý nếu lần đó đã có.
- **Sau khi nộp**, banner xanh ghi nhãn `Trễ hạn x ngày làm việc` và dòng `Hình thức xử lý theo quy định (nộp ở
  lần nhắc thứ k): …` khi đã có hình thức áp dụng (§27.1).

**Cấp quản lý với hình thức xử lý** (chốt 30/09/2026). Luật và câu chữ ở `assets/yer-model.js`: `lateMeasure(p)` (lần nhắc,
hình thức, `cap` = 3 khi nộp ở lần 3), `overRatingCap(p, score)`, `lateMeasureText(p, lang)`, `ratingCapText(p, score, lang)`.
M-05 và M-06 chỉ render.
- Mọi cấp (QLTT, LM2, HOD) thấy hình thức xử lý trong gạch đầu dòng nộp bổ sung của khối `Lưu ý` và banner của M-06 (§48).
- **Khối vàng trong ô Đánh giá toàn diện** của vai đang xem (M-06) và trong popup chấm điểm trên lưới (M-05) **chỉ có khi nhân
  viên nộp ở lần nhắc thứ 3**, tức hồ sơ bị giới hạn điểm toàn diện tối đa 3 (chốt 02/10/2026, `PMSYer.lateCapNotice(p, lang)`).
  Nộp ở lần 1, 2 (chưa có hình thức) hay lần 4 (cắt giảm thưởng, không giới hạn điểm) thì ô điểm không có khối vàng; hình thức
  của lần 4 chỉ còn ở khối `Lưu ý` và banner. Câu (chị chốt lại 04/10/2026, `lateMeasureText`, bản in đậm `lateMeasureHtml`):
  `Nhân viên hoàn thành Tự đánh giá **trễ hạn n ngày làm việc** (nộp bổ sung ở lần nhắc thứ k), theo quy định, nhân viên sẽ bị giới
  hạn điểm đánh giá toàn diện **tối đa là 3**.` (lần 3, bỏ chữ `vậy`); lần 4 là `… nhân viên sẽ bị
  cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo, tính từ thời điểm nhắc nhở thứ tư.`
  Không nhắc chuyện hệ thống có chặn điểm hay không. Khối vàng **chỉ hiện khi đang chấm**; QLTT gửi xong thì ô chỉ xem không còn
  khối này (thừa, chị chốt 04/10/2026), chỉ còn chip `Cao hơn mức tối đa 3` cạnh điểm. Từ khóa của mọi hình thức xử lý in đậm ở mọi
  màn (`PMSYer.lateTextHtml`, danh sách từ khóa ở model, E-05 dùng chung). Gạch đầu dòng nộp bổ sung trong khối `Lưu ý` và banner của M-06 vẫn ghi
  `Hình thức xử lý theo quy định: …` như §48.
- **Giới hạn điểm 3 không chặn điểm, nhưng người chấm phải xác nhận.** Đang chấm mà chọn cao hơn 3 thì khối vàng thêm dòng đậm
  `Điểm đang chọn là x, cao hơn mức tối đa 3.` Khi lưu, người chấm phải tick `Tôi xác nhận giữ điểm x.` (chị chốt 04/10/2026, bỏ
  `dù cao hơn mức tối đa 3 theo quy định`); popup gửi của M-06 chỉ có câu của khối vàng và ô tick, không lặp dòng `Điểm đang chọn…`,
  nút lưu khóa cho tới khi tick: trong popup gửi của M-06 (`Gửi đánh giá`, `Lưu thay đổi`, chỉ QLTT), trong popup chấm điểm
  trên lưới M-05 (chưa tick mà bấm `Xác nhận` thì nhắc và mở lại popup, giữ nguyên điểm và nhận xét), và trong popup chung
  `Có điểm cao hơn mức tối đa theo quy định` của `Duyệt điểm QLTT/QL cấp 2`, `Upload điểm`, `Duyệt điểm HRBP upload` (liệt kê từng
  người: `điểm x, tối đa 3 (lần nhắc thứ k)`). Bản lưu ghi `capConfirmed: { max, score, at }` để truy vết.
- Điểm của cấp khác đã cao hơn mức tối đa: M-06 có chip vàng `Cao hơn mức tối đa 3` cạnh điểm ở các ô chỉ xem; M-05 có icon
  `bx-error` vàng cạnh điểm ở các cột điểm quản lý, tooltip là câu hình thức xử lý.
- Lần 4 không giới hạn điểm (§27.3 ở trên) nên chỉ hiện câu hình thức xử lý, không có bước xác nhận.

### 27.4 QLTT với hồ sơ quá hạn Tự đánh giá (chốt 02/10/2026)

Chỉ áp cho nhân viên quá hạn Tự đánh giá (luồng nộp trễ), không áp cho tình huống khác:

| Tình huống | Nhân viên | QLTT |
|---|---|---|
| Quá hạn, chưa nộp, còn trong thời gian nộp bổ sung | còn nhiều lần nhắc; mỗi lần nhắc có hạn riêng (§27.3) | **chờ, chưa chấm được**. M-06 có một khối vàng `Đang chờ nhân viên nộp bổ sung Tự đánh giá` (§48) |
| Đã nộp bổ sung | **chỉ nộp một lần duy nhất**, không thu hồi, không sửa (§27.1) | **chấm được ngay**, không chờ hết thời gian nộp bổ sung, tới hết hạn QLTT |
| Hết mọi lần nhắc, không nộp, **đủ mục tiêu** | không còn nộp được | vẫn chấm dựa trên mục tiêu tới hết hạn QLTT, cột điểm NV trống (§6, chốt 27/09/2026); hết hạn QLTT mà không chấm thì `Không đánh giá` |
| Hết mọi lần nhắc, không nộp, **thiếu mục tiêu** | không còn nộp được | hồ sơ khóa thành `Không đánh giá`, quy trình dừng, không có điểm |

Luật ở model: `PMSYer.lateWaiting(p)` trả về lần nhắc đang mở khi nhân viên chưa nộp và còn trong thời gian nộp bổ sung
(không áp cho thai sản, đã nghỉ việc); `managerReviewState('lm')` khóa quyền chấm trong trường hợp này. Hồ sơ hết mọi lần
nhắc, đủ mục tiêu (`no-self`) là việc của QLTT (`pending`), danh sách ghi `Chờ QLTT đánh giá` kèm tag `Không tự đánh giá` (§47).

**Hạn chấm của QLTT với hồ sơ nộp bổ sung** (chốt lại 02/10/2026, thay rule hạn riêng 3 ngày làm việc của 28/09/2026).
Thời điểm nộp bổ sung cuối cùng của nhân viên **không được vượt quá timeline QLTT**: hạn lần nhắc thứ tư (03/02/2027) nằm
trong timeline QLTT (19/01 đến 08/02/2027, §2). Vì vậy hồ sơ nộp bổ sung **dùng chung hạn QLTT** (`lmDeadline()` trả về
hạn của bước QLTT), không còn hạn riêng, không có câu `Hồ sơ nộp bổ sung có hạn chấm riêng`. Hết hạn QLTT mới đồng bộ
theo §6. Hồ sơ nộp ở lần nhắc thứ tư còn ít nhất 3 ngày làm việc để QLTT chấm (04/02, 05/02 là ngày lễ mẫu, 08/02).

- Tình huống demo: `nv06` (lần 2, chưa nộp), `nv12` đến `nv15` (chưa nộp, đang bị nhắc ở lần 1 đến 4), `nv16` đến `nv19` (đã nộp ở lần 1 đến 4), `nv20` (không nộp sau 4 lần), `nv21` (thiếu mục tiêu và không nộp sau 4 lần).

## 28. ENH-E03 — Điều hướng sang kết quả Mid-Year

**Thay §11.** Không dựng block snapshot đầy đủ. Thay bằng bản nhẹ:

- Trong màn YER của Quản lý, **một gạch đầu dòng trong khối `Lưu ý`** (§48) điều hướng sang tab Đánh giá giữa năm:
  `Bạn có thể xem lại kết quả [Đánh giá giữa năm 2026] của nhân viên trước khi đánh giá cuối năm.`, cụm trong ngoặc
  là liên kết sang tab đó.
- Dòng đó **không** nêu người đã chấm giữa năm. Người chấm chỉ hiện ở box xanh của tab Đánh giá
  giữa năm (§18.3), để thông tin lịch sử chỉ có một nguồn. Sửa ngày 27/09/2026.
- Nhân viên không có kết quả giữa năm thì **không nhắc gì** (chốt 30/09/2026, cùng luật §40.5c của màn Nhân viên; bỏ
  box riêng `Không có kết quả Đánh giá giữa năm`). Dùng tên kỳ tiếng Việt, không dùng `Mid-Year` (§41.5).
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
- QLTT **thêm mục tiêu** cho nhân viên nghỉ thai sản, chỉ trong timeline bước QLTT đánh giá, và **không sửa được** mục tiêu
  nhân viên đã tạo. Chốt 30/09/2026 (thay rule import rồi duyệt):
  - Luật ở model: `PMSYer.canAddGoals(role, p)` (QLTT, thai sản, chưa nghỉ việc, trong timeline QLTT), `PMSYer.reviewGoals(p, type)`
    (danh sách mục tiêu dùng để đánh giá: mục tiêu đã duyệt của nhân viên, mục tiêu trong file nộp bổ sung, mục tiêu QLTT thêm;
    E-05 và M-06 cùng đọc). Mục tiêu QLTT thêm lưu ở `acts[emp].lmGoals.items`
    (`{ id, type, title, result, prio, s, e, at, time, via: 'manual'|'upload', by }`), tính như đã duyệt nên đủ điều kiện ngay.
    Nhân viên thai sản không bị gắn `Không đánh giá` vì thiếu mục tiêu sau cửa sổ nộp bổ sung (§12, `stopped`).
  - **Độc lập với tab Danh sách mục tiêu** (chốt 02/10/2026): mục tiêu QLTT thêm chỉ nằm ở tab Đánh giá cuối năm (E-05, M-06),
    không thêm vào và không liên kết với tab `Danh sách mục tiêu` của nhân viên. Tab Danh sách mục tiêu chỉ đọc mục tiêu nhân viên
    tạo theo quy trình mục tiêu.
  - Lối vào trên M-06 (tab Đánh giá cuối năm; M-06 không có tab mục tiêu riêng, tab đầu quay về danh sách M-05): nút `Thêm mục
    tiêu` ở tiêu đề nhóm Mục tiêu công việc và Mục tiêu phát triển; liên kết `Thêm mới mục tiêu` ở bước 2 của khối hướng dẫn thai
    sản (§48, thiếu mục tiêu thì nói loại còn thiếu); dòng xám của nhóm trống thêm câu `Bấm Thêm mục tiêu để thêm cho nhân viên.`
  - Popup `Thêm mục tiêu cho nhân viên thai sản` (chốt lại 04/10/2026), rộng 640px, hai thẻ `Nhập tay` / `Import mục tiêu` ở
    **góc phải tiêu đề popup**:
    - `Nhập tay`: cùng trường và cùng kiểu với popup **Tạo mục tiêu mới** của E-05 (`.fg`, `.flbl`, `.fc`, `.frow3`, `.rte-wrap`):
      `Loại mục tiêu`; hàng `Mức độ ưu tiên` (chỉ mục tiêu công việc, mục tiêu phát triển thì hàng còn hai cột), `Từ ngày`,
      `Đến ngày` (ô ngày, mặc định 01/01 và 31/12 của chu kỳ); `Tên Mục tiêu` và `Kết quả cần đạt` là ô soạn thảo (B, I, U, danh
      sách) có bộ đếm `n / 1000`, `n / 4000`. Thiếu ô nào thì nhắc và giữ nội dung. Nút `Hủy` / `Thêm mục tiêu`.
    - `Import mục tiêu`: cùng các bước của popup **Import mục tiêu** của E-05 (`.imp-steps`): 1 tải Template (CSV, mỗi dòng một mục
      tiêu, loại WHAT hoặc DEVELOPMENT), 2 kéo thả hoặc bấm để chọn tập tin, 3 bấm `Đọc file` để kiểm tra (hiện `n mục tiêu hợp lệ,
      bỏ qua m dòng thiếu thông tin`), 4 bấm `Import`. Nút `Hủy` / `Đọc file` / `Import n mục tiêu`.
    - Ghi chú chung (chị chốt 04/10/2026): `Lưu ý:` một hàng riêng, bên dưới ba gạch đầu dòng, từ khóa in đậm: `Mục tiêu do QLTT
      thêm được hệ thống ghi nhận ở trạng thái **Đã duyệt**.` / `Mục tiêu này **chỉ nằm ở tab Đánh giá cuối năm**, không thêm vào
      tab Danh sách mục tiêu của nhân viên.` / `Sau khi thêm mục tiêu, QLTT **không thể sửa hoặc xóa** được mục tiêu này.` Ô chọn
      tập tin ở tab Import gọn một hàng.
  - Phân biệt với mục tiêu nhân viên tự tạo: M-06 có chip xanh `QLTT thêm - Đã duyệt` dưới tên mục tiêu, tooltip ghi domain QLTT,
    ngày thêm, bằng file hay nhập tay; E-05 có chip `Quản lý trực tiếp thêm`.
  - **Không sửa, không xóa** (chốt 02/10/2026, thay rule xóa bằng nút thùng rác của 30/09/2026): mục tiêu QLTT thêm mặc định
    `Đã duyệt` và tạm thời không có nút sửa hay xóa, kể cả trong timeline QLTT. QLTT vẫn chấm điểm cho mục tiêu đó như mục tiêu khác.
  - Tình huống demo `lm03`, `lm07` (`e4`): còn thiếu mục tiêu phát triển.
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
  người dùng cần làm, theo §18 (nhãn hiện tại `Cần hoàn tất`, §18.4). Tab Đánh giá giữa năm chỉ ghi `Đang hoạt động` trước ngày mở kỳ cuối năm;
  từ ngày mở kỳ cuối năm luôn là `Đã hoàn tất` màu xám (chốt 04/10/2026, §18.4, MYR-SPEC MYR-09a).
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
| 3b | Còn lại của cụm Quản lý: duyệt điểm hiệu chuẩn (phía HOD xong 30/09/2026, §9; màn HRBP tải file chưa làm), AI Copilot (AI Summary ở M-05, M-06 và trợ lý viết nhận xét của QLTT xong 30/09/2026, §14) | ENH-E08 | Đang làm |
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
| Điểm toàn diện | nhập, bắt buộc | chỉ xem (chấm ở M-05) | chỉ xem (chấm ở M-05) |
| Nhận xét toàn diện | bắt buộc | chỉ xem (nhập ở M-05, tùy chọn) | chỉ xem (nhập ở M-05, tùy chọn) |
| Sửa sau khi gửi | được, tới hết deadline | ở M-05, tới hết deadline | ở M-05, tới hết deadline |

Từ 04/10/2026 Quản lý cấp 2 và Trưởng đơn vị chỉ xem ở M-06 (§8.3).
| Cột điểm đọc thêm | — | của QLTT | của QLTT và QL cấp 2 |

### 39.2 Quy ước dữ liệu ghi vào store

- `acts[emp].lmDraft` / `lm2Draft` / `hodDraft` — bản nháp theo từng vai, không tính là đã gửi.
- `acts[emp].lm` / `lm2` / `hod` — bản đã gửi, có `at` nên model coi là đã submit. Có thể kèm `capConfirmed: { max, score, at }`
  khi người chấm xác nhận giữ điểm cao hơn mức tối đa (§27.3).
- `acts[emp].lm2Log` / `hodLog` — lịch sử chấm điểm của LM2, HOD (§47).
- `acts[emp].lmGoals` — mục tiêu QLTT thêm cho nhân viên thai sản (§33).
- `acts[emp].hrbpUpload` — trạng thái duyệt điểm HRBP tải lên (`approved`, `approvedAt`, §9).

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
- Tiêu đề dải chỉ ghi `Quy trình và Thời gian đánh giá cuối năm 2026`, **không ghi ngày bắt đầu kỳ** (bỏ
  `- bắt đầu 05/01/2027` ngày 02/10/2026) ở E-05, M-05 và M-06.
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
3. Hồ sơ có LWD (chị chốt 04/10/2026, cùng câu với khối Lưu ý của M-06 §48): `Nhân viên có Ngày làm việc cuối cùng là
   **dd/mm/yyyy**. Nhân viên và QLTT vẫn cần hoàn thành đánh giá trong thời gian nhân viên còn đang làm việc.` Hồ sơ thai sản
   có LWD thì câu này nối sau dòng thai sản.

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
| 2 | Thiếu mục tiêu (`eligibility.reason === 'missing-goal'`) | khối cảnh báo `.yer-note.action`, nền rose-neutral rất nhạt `#FFF7FB`, viền `#F0D7E5`, icon màu thương hiệu | **trên** dải quy trình | còn hạn: `Bạn chưa đủ điều kiện gửi Tự đánh giá cuối năm do thiếu [loại mục tiêu] được duyệt.` / `Vui lòng tạo và gửi Quản lý trực tiếp phê duyệt tại tab Danh sách mục tiêu.` (chốt 28/09/2026, cụm `Danh sách mục tiêu` là liên kết sang tab) / `Trong lúc này, bạn vẫn có thể nhập thông tin và lưu nháp bản tự đánh giá.` (thiếu cả hai: `Mục tiêu công việc và Mục tiêu phát triển`); hết hạn tự đánh giá mà ngoài luồng nộp bổ sung: `Bạn không thể thực hiện Tự đánh giá cuối năm`; hết cả hạn nộp bổ sung thì theo dòng 6. **Không có nút** `Tới Danh sách mục tiêu` (bỏ 28/09/2026 ở mọi tình huống thiếu mục tiêu), liên kết trong câu đã đủ |
| 3 | Nghỉ thai sản | khối `Lưu ý` (`.info-note`) | **dưới** dải quy trình | một dòng thai sản, xem §40.5b (+ dòng LWD nếu có) |
| 4 | Các trường hợp còn lại | khối `Lưu ý` (`.info-note`) | **dưới** dải quy trình | điều kiện mục tiêu + kết quả kỳ giữa năm + LWD (nếu có) |
| 5 | Không còn gạch đầu dòng nào | **không box nào** | — | không dựng thẻ rỗng |
| 5b | Quá hạn, còn trong bốn lần nhắc, chưa nộp (§27.1) | **chỉ** khối vàng `.yer-note.yer-late-note` | **trên** dải quy trình | lần nhắc, hạn, hình thức xử lý (nếu có), lưu ý, xác nhận; các ô bên dưới khóa |
| 6 | Hết cả bốn lần nộp bổ sung mà chưa nộp (§27.3), **kể cả khi thiếu mục tiêu** | **chỉ** khối vàng `.yer-note.yer-late-closed` | dưới dải quy trình | không dựng khối Lưu ý; thiếu mục tiêu thì câu sau nói loại mục tiêu còn thiếu, quy trình dừng và không có điểm (§27.1, chốt 28/09/2026). Dòng này thắng dòng 2 |

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
- Câu chữ (chốt lại 28/09/2026): `Bạn đang trong thời gian nghỉ thai sản nên không bắt buộc phải thực hiện
  Tự đánh giá cuối năm. Hệ thống vẫn mở để bạn có thể chủ động hoàn thành. Sau thời hạn Tự đánh giá,
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
- **Bấm Gửi khi còn thiếu** (chốt 28/09/2026, màn Nhân viên):
  - Popup tiêu đề `Bạn chưa thể gửi Tự đánh giá vì thiếu thông tin`, dòng `Bạn vui lòng bổ sung:` rồi **mỗi khối còn
    thiếu một gạch đầu dòng**: `Mục tiêu công việc: điểm mục tiêu “…”; ô Đánh giá của Nhân viên`, `Mục tiêu hành vi:
    điểm Tinh thần đồng đội, …`, `Đánh giá toàn diện: điểm toàn diện; ô Đánh giá toàn diện của nhân viên`. Liệt kê đủ,
    không cắt ở 6 mục. Dòng cuối `Các ô còn thiếu sẽ được đánh dấu viền đỏ trên màn hình.`, nút `Đã hiểu`.
  - Đóng popup (`Đã hiểu`, dấu x, Esc) thì mọi ô còn thiếu có **viền đỏ** `--err` kèm quầng `--err-bg` (COMPONENTS §14)
    và màn cuộn tới ô thiếu đầu tiên. Ô nào điền rồi thì hết đỏ ngay; đổi nhân viên thì xóa hết.
  - Ô bắt buộc: điểm từng mục tiêu chưa khóa (§13.1), nhận xét nhóm công việc và phát triển khi nhóm có mục tiêu, điểm
    năm giá trị cốt lõi, nhận xét nhóm hành vi, điểm và nhận xét toàn diện (`missingGroups` trong `yer-employee.js`).

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
- **M-06 dùng đúng vị trí này** (chốt 30/09/2026): ô `Ý nghĩa thang điểm` của ô Đánh giá toàn diện đang sửa nằm dưới ô
  nhận xét (`#yer-md-op-def`, qua `defInto` của `PMSUi.rating`), không chen giữa ô chọn điểm và ô nhận xét. Popup chấm điểm
  trên lưới M-05 thì đặt ô này ngay dưới ô chọn điểm vì popup không có ô nhận xét dài phía trên.

### 41.3 Tên và định nghĩa mức điểm lẻ

Lấy **nguyên văn** từ file đề xuất, không rút gọn:

- Tên mức: `Giữa mức 1 - Không đạt yêu cầu và 2 - Hoàn thành một phần`,
  chứ không phải `Giữa mức 1 và 2`.
- Trong chip tên mức (chị chốt 04/10/2026, mọi màn dùng `PMSUi.rating`): tên mức in đậm, chữ nối thường: mức nguyên đậm cả tên,
  mức nửa bậc `Giữa mức **1 - Không đạt yêu cầu** và **2 - Hoàn thành một phần**`. Chip **chỉ một dòng**, không bao giờ vỡ chữ;
  không đủ chỗ thì cả chip (cùng ⓘ) xuống dòng và bắt đầu từ mép trái ô (trong dòng `Điểm toàn diện:` điểm, ô chọn, chip là phần tử
  ngang hàng của dòng, `.op-score-row [data-rt]{display:contents}`). Chữ trong ô chọn điểm căn trái ở mọi trạng thái (chưa chọn, đã chọn, mở lại danh sách).
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
- **Banner hai tầng, cùng khung với M-06** (chị chốt 05/10/2026; khung dùng chung `PMSUi.banner` trong `assets/yer-ui.js`,
  sửa khung ở đó để hai màn luôn giống nhau):
  - tầng trên: icon, tiêu đề, **một** dòng ngày (`Ngày gửi: dd/mm/yyyy`, nhãn `Trễ hạn n ngày làm việc` nếu nộp bổ sung,
    rồi liên kết xám ` - Lịch sử chỉnh sửa` khi có lịch sử); bên phải `Điểm tự đánh giá`, `Điểm cuối cùng`, nút `Chỉnh sửa`
    (outline hồng, chỉ khi còn hạn) và nút tải xuống;
  - tầng dưới (viền nét đứt, thẳng lề với tiêu đề): `Hình thức xử lý theo quy định (nộp ở lần nhắc thứ n): …`, dòng
    `Bạn có thể chỉnh sửa tới hết ngày dd/mm/yyyy` khi còn hạn (§8), dòng `Tiếp theo: Chờ Quản lý trực tiếp đánh giá - domain`.
    Không có dòng nào thì không có tầng dưới.
  `Lịch sử chỉnh sửa` là liên kết sau dòng ngày như M-06 (thay nút bên phải); hồ sơ nộp bằng file không có liên kết này.
- **Nút tải xuống** (chốt 28/09/2026): icon `bx-download` như nút tải ở tab Danh sách mục tiêu, bấm vào mở menu chọn
  `PDF (.pdf)` hoặc `Excel (.xlsx)` (dùng lại `.download-menu` của E-05). Thay nút icon PDF cũ.
- Khối Đánh giá toàn diện, ô của QLTT: **không có dòng điểm nào**, kể cả dòng `Điểm toàn diện: - Chưa công bố` (bỏ
  28/09/2026). Ô chỉ giữ khoảng trống để hai ô nhận xét thẳng hàng. Nhân viên không bao giờ thấy điểm toàn diện của QLTT (§7).
- Tiêu đề ô ghi kèm **domain** của người đánh giá, chữ thường 12px `--z600`, không viết hoa theo tiêu đề:
  `Quản lý trực tiếp đánh giá - domain`, `Nhận xét của Quản lý cấp 2 - domain`, `Nhận xét của Trưởng đơn vị - domain`.
  Domain lấy từ `PMSYer.actors(p)`, cùng nguồn với dải quy trình.
- Bớt viền trong khối Đánh giá toàn diện và khối Nhận xét của các cấp quản lý: bỏ khung của từng ô, chỉ giữ
  một vạch chia giữa hai cột; ô chỉ xem dùng nền `--z50`, không viền.
- **Bỏ nhãn `Đã thay đổi sau Mid-Year`** trên thẻ mục tiêu. Kỳ cuối năm chấm trên mục tiêu
  hiện tại, lịch sử thay đổi không đổi cách chấm. Điều này **thay** phần badge ở §11.

## 43. Mascot hướng dẫn của màn Nhân viên

Chốt ngày 17/09/2026. Thay nút `Xem hướng dẫn` ở §40.4.

- Mascot là component dùng chung `PMSUi.mascotGuide(opts)` trong `assets/yer-ui.js` (chốt 04/10/2026), E-05 và **M-06** cùng gọi,
  mỗi màn chỉ đưa câu chữ và các bước. M-06: bóng thoại `Hồ sơ đang ở bước [X]`, [X] là `Đánh giá cuối năm`, `Đánh giá nhân viên
  thai sản`, `Chờ nhân viên nộp bổ sung`, `Đã hoàn thành đánh giá`, `Chỉnh sửa đánh giá`, `Hồ sơ không đánh giá`, `Chờ mở bước
  đánh giá của [Vai]` (thay `Chưa tới bước của bạn`, 04/10/2026), `Đã hết hạn đánh giá` hoặc `Chờ cấp trước đánh giá`. Tour M-06 đi qua tab, dải quy trình, khối của tình trạng hồ sơ
  (khối vàng, banner nộp trễ, banner đã hoàn thành, khối đang chỉnh sửa, hướng dẫn thai sản hoặc Lưu ý), AI Summary và Phản hồi
  đã nhận, rồi khi đang sửa được: ba nhóm mục tiêu (QLTT), ô Đánh giá toàn diện, `Lưu nháp`, nút gửi. Chỉ giữ bước có khối đang
  hiện trên màn. Nút tab Cuối năm của M-06 có `id="tab-yer"` như E-05.
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

Tên tình huống trong mọi dropdown của thanh demo (E-05 và M-06) viết `mã - Tình trạng (Tên nhân viên)` (chốt 02/10/2026,
bỏ gạch dài). Dropdown thứ hai của thanh demo định danh theo **mã tình huống** (`sc:<id>`) chứ
không theo mã nhân sự: một người có thể xuất hiện ở nhiều tình huống của nhiều vai
(ví dụ `e1` ở `lm04`, `lm22` đến `lm24` và `hod05`; `e10` ở `nv07`, `nv08`, `lm01`, `lm18`, `lm20`).

Màn `E-05` có dropdown `Tình huống` chỉ gồm tình huống có số của vai Nhân viên (§46). **Không còn nhóm
`Hồ sơ khác`** (bỏ ngày 28/09/2026): chọn hồ sơ lẻ thì ngày hệ thống vẫn là ngày của tình huống trước, nên màn
hiện ra không khớp với câu chuyện của hồ sơ. Hồ sơ nào cần demo thì thành một tình huống có số.
Dropdown này từng bị mất khi rút gọn thanh demo của Quản lý (commit c2df233), dựng lại ngày 27/09/2026.

Riêng hai màn Quản lý tách rõ hai mục đích demo:

- `M-05` là **tổng quan roster theo thời điểm**: thanh demo chỉ có Vai trò, Ngày hệ thống
  và 5 giai đoạn `Tự đánh giá → QLTT → QL cấp 2 → HOD → Công bố`. Không có dropdown
  nhân viên/tình huống; đổi giai đoạn chỉ đổi ngày của toàn roster, không chuyển màn.
- `M-06` là **chi tiết use case** (chốt lại 04/10/2026): thanh demo để xem UI ở từng use case, nên **mỗi tình huống là một
  giao diện khác nhau ở đúng một ngày** (không còn mốc thời gian con `moments`). Một hàng điều khiển và một dòng gợi ý:
  - `Tình huống`: một dropdown cho cả ba vai (sắp lại 04/10/2026). Nhóm theo **vai đang xem, rồi Trước / Trong / Sau bước của chính
    vai đó**, gọi đúng tên bước trên dải quy trình (`PMS_YER_SUBGROUPS`, trường `sub`), nên tên nhóm luôn khớp với bước đang mở trên
    màn (test khóa: nhóm `-pre` thì bước của vai còn `future`, `-in` là `open`, `-post` là `closed`). Nhóm Trong bước của QLTT có ba
    nhóm con: `Hồ sơ cần đánh giá`, `Nộp bổ sung Tự đánh giá`, `QLTT đã gửi`. Tên tình huống một khuôn `[Ai] + [tình trạng]` (NV, QLTT,
    Quản lý cấp 2, Trưởng đơn vị), mã đứng đầu, không còn số thứ tự trong ô chọn: `lm15 - NV đã nộp bổ sung ở lần nhắc 3, giới hạn
    điểm 3 (Phạm Thu Trang)`. Chọn tình huống thì vai và ngày đổi theo, vẫn ở M-06. Không có ô Vai trò. Hiện có 34 tình huống:
    QLTT 24, Quản lý cấp 2 6, Trưởng đơn vị 4.
  - Nút `◀` `▶` hai bên dropdown, bộ đếm `19/34`, số `Đã xem n` và nút `Xóa dấu đã xem`. Tình huống đã mở có dấu `✓` đứng đầu
    trong ô chọn. Dấu đã xem chỉ lưu trên máy người review (`localStorage` khóa `pms-yer-demo-seen`, bọc try/catch); không ảnh hưởng
    dữ liệu demo, `Đặt lại tất cả` không xóa nó. Bên cạnh là ngày hệ thống của tình huống.
  - `Cần xem:` dòng gợi ý dưới hàng điều khiển (trường `wvi` / `wen`), gồm cả thao tác cần thử trên màn (bấm Chỉnh sửa, bấm Gửi
    khi còn thiếu…), vì các trạng thái do thao tác tạo ra không tách thành tình huống riêng.
  - `Xem phía Nhân viên`: mở E-05 cùng hồ sơ, cùng ngày; nếu có tình huống Nhân viên tương ứng (trường `pair`) thì chọn sẵn.
    E-05 có nút `Xem phía Quản lý` để quay lại đúng tình huống (phiên ghi `from`), hoặc sang tình huống Quản lý có `pair` trỏ về.
  - `Làm lại tình huống`: xóa thao tác trên hồ sơ đang xem, dữ liệu dựng sẵn giữ nguyên. `Đặt lại tất cả` (chữ nhạt) xóa mọi
    thao tác, có popup xác nhận. M-05 chỉ có `Đặt lại tất cả`.
  - Danh sách `M-05` **không thêm gì** để phục vụ demo (chị chốt 04/10/2026).
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
khóa và popup nộp bổ sung, dòng `Điểm toàn diện: - Chưa công bố` ở ô QLTT (đã bỏ ở đợt 4).
Thêm ngày 28/09/2026 (đợt 4): nhãn tab `Cần hoàn tất`, lần nhắc 4 không còn giới hạn điểm 3, câu chữ khối quá hạn
và hai bước xác nhận, popup thiếu thông tin và viền đỏ, popup xác nhận gửi, lịch sử chỉnh sửa theo thẻ, nút tải
PDF hoặc Excel, domain ở các ô của cấp quản lý.
Thêm ngày 27/09/2026 (đợt 3): mười một tình huống Nhân viên, bốn lần nhắc
nộp bổ sung đếm theo ngày làm việc và hình thức xử lý cộng dồn, bước xác nhận đã đọc, khối nộp trễ sau khi gửi,
khối nhận xét của Quản lý cấp 2 và Trưởng đơn vị, lịch sử chỉnh sửa theo lần gửi.
Thêm ngày 27/09/2026: hồ sơ đủ mục tiêu mà không tự đánh giá vẫn được QLTT chấm tới hết hạn QLTT,
và M-06 có dải quy trình, giữ nhóm mục tiêu trống,
có popup chi tiết mục tiêu, dùng chung luật nhãn tab với M-05.
Thêm ngày 02/10/2026: thứ tự danh sách theo từng giai đoạn và màu hồng theo vai đang xem (§47), sắp xếp theo cột, khối vàng
chỉ cho lần nhắc thứ 3, mục tiêu QLTT thêm không xóa được, khối hướng dẫn thai sản của QLTT.
Thêm ngày 02/10/2026 (đợt 5): cửa sổ nộp bổ sung nằm trong timeline QLTT và hồ sơ nộp trễ dùng chung hạn QLTT, lịch demo
mới (QLTT tới 08/02/2027), chế độ xem và nút Chỉnh sửa sau khi gửi, banner nộp trễ, câu chữ gọi tên vai ở khối Lưu ý.

## 46. Bảng điều hướng tình huống

`YER-demo/index.html` gom **61 tình huống** theo **vai trò**, không theo giai đoạn quy trình:
người review thường duyệt hết phần của một vai rồi mới sang vai khác. Hàng chip đầu bảng
lọc theo vai; mỗi dòng đặt sẵn vai trò, nhân sự, ngày hệ thống và **màn hình sẽ mở**.

| Nhóm | Mã | Số tình huống |
|---|---|---|
| Nhân viên | `nv01`–`nv21` | 21 |
| Quản lý trực tiếp | `lm01`–`lm24` (M-06), `lm25`, `lm26` (M-05) | 26 |
| Quản lý cấp 2 | `lm2-01`–`lm2-06` (M-06), `lm2-07` (M-05) | 7 |
| Trưởng đơn vị | `hod01`–`hod04` (M-06), `hod05`–`hod07` (M-05) | 7 |

Hai mươi mốt tình huống của Nhân viên, chốt 28/09/2026:

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
| `nv11` | Có nhận xét của Quản lý cấp 2 và Trưởng đơn vị (§7) | `e12`, 04/03/2027 |
| `nv12` | Chưa nộp - đang bị nhắc nhở lần 1 | `y9`, 19/01/2027 |
| `nv13` | Chưa nộp - đang bị nhắc nhở lần 2 (file bù mục tiêu công việc) | `y14`, 22/01/2027 |
| `nv14` | Chưa nộp - đang bị nhắc nhở lần 3 | `e8`, 27/01/2027 |
| `nv15` | Chưa nộp - đang bị nhắc nhở lần 4 | `y16`, 01/02/2027 |
| `nv16` | Đã nộp bổ sung ở lần nhắc thứ 1 | `y9`, nộp 20/01, xem 21/01/2027 |
| `nv17` | Đã nộp bổ sung ở lần nhắc thứ 2 | `y14`, nộp 25/01, xem 26/01/2027 |
| `nv18` | Đã nộp bổ sung ở lần nhắc thứ 3 | `e8`, nộp 28/01, xem 29/01/2027 |
| `nv19` | Đã nộp bổ sung ở lần nhắc thứ 4 | `y16`, nộp 02/02, xem 03/02/2027 |
| `nv20` | Không nộp sau 4 lần nhắc, đã qua hạn QLTT nên hồ sơ `Không đánh giá` | `e2`, 12/02/2027 |
| `nv21` | Thiếu mục tiêu và không nộp sau 4 lần nhắc: khối vàng như `nv20`, câu chữ nói loại mục tiêu còn thiếu và quy trình dừng, không có điểm (§27.1) | `y10` (cùng hồ sơ `nv06`), 05/02/2027 |

Tình huống của màn chi tiết Quản lý (`M-06`), sắp lại 04/10/2026 theo danh sách chị đưa. Mỗi dòng một giao diện ở một ngày;
thứ tự trên thanh demo là thứ tự bảng (§44.1).

| Nhóm | Mã | Tình huống | Hồ sơ, ngày | Nhân viên tương ứng |
|---|---|---|---|---|
| QLTT - Trước bước Quản lý trực tiếp | `lm01` | NV đã hoàn thành Tự đánh giá | `e10`, 14/01 | `nv07` |
| | `lm02` | NV chưa hoàn thành Tự đánh giá, có LWD | `y6`, 08/01 | `nv09` |
| | `lm03` | NV nghỉ thai sản | `e4`, 12/01 | |
| QLTT - Trong bước Quản lý trực tiếp: Hồ sơ cần đánh giá | `lm04` | NV đã hoàn thành Tự đánh giá, QLTT chưa đánh giá | `e1`, 22/01 | |
| | `lm05` | NV có mục tiêu QLTT cũ đã đánh giá hoàn thành | `y4`, 20/01 | |
| | `lm06` | NV có LWD | `y6`, 25/01 | `nv09` |
| | `lm07` | NV nghỉ thai sản, QLTT thêm mục tiêu và đánh giá | `e4`, 22/01 | |
| | `lm08` | NV quá hạn sau 4 lần nhắc, đủ mục tiêu: QLTT vẫn đánh giá | `e13`, 04/02 | |
| QLTT - Trong bước Quản lý trực tiếp: Nộp bổ sung Tự đánh giá | `lm09`–`lm12` | NV chưa nộp, đang ở lần nhắc 1, 2, 3, 4 | `y15`, 20/01, 23/01, 27/01, 01/02 | |
| | `lm13` | NV chưa nộp, đang ở lần nhắc 2, còn thiếu mục tiêu | `y10`, 22/01 | `nv06` |
| | `lm14` | NV đã nộp bổ sung ở lần nhắc 1 | `y9`, 22/01 | `nv16` |
| | `lm15` | NV đã nộp bổ sung ở lần nhắc 3, giới hạn điểm 3 | `y12`, 29/01 | |
| | `lm16` | NV đã nộp bổ sung ở lần nhắc 4, cắt giảm thưởng | `y16`, 04/02 | `nv19` |
| | `lm17` | NV quá hạn sau 4 lần nhắc, thiếu mục tiêu: Không đánh giá | `y10`, 04/02 | `nv21` |
| QLTT - Trong bước Quản lý trực tiếp: QLTT đã gửi | `lm18` | QLTT đã gửi, còn thời gian chỉnh sửa | `e10`, 27/01 | `nv08` |
| | `lm19` | QLTT đã gửi trên hồ sơ nộp bổ sung (banner hai tầng) | `y16`, 06/02 | |
| QLTT - Sau bước Quản lý trực tiếp | `lm20` | QLTT đã gửi, hết thời gian chỉnh sửa | `e10`, 09/02 | |
| | `lm21` | QLTT không đánh giá trước hạn | `y12`, 09/02 | |
| | `lm22` | Quản lý cấp 2 đã đánh giá | `e1`, 20/02 | |
| | `lm23` | Trưởng đơn vị đã đánh giá | `e1`, 03/03 | |
| | `lm24` | Đã công bố kết quả | `e1`, 06/04 | |
| Quản lý cấp 2 - Trước bước Quản lý cấp 2 | `lm2-01` | Quản lý cấp 2 chưa tới bước, QLTT đã gửi (hồ sơ có LWD) | `e5`, 05/02 | |
| Quản lý cấp 2 - Trong bước Quản lý cấp 2 | `lm2-02` | Quản lý cấp 2 chưa đánh giá, có điểm NV và QLTT (hồ sơ có LWD) | `e5`, 17/02 | |
| | `lm2-03` | NV nộp bổ sung ở lần nhắc 3, điểm QLTT cao hơn mức tối đa 3 | `e7`, 17/02 | |
| | `lm2-04` | NV nghỉ thai sản, điểm QLTT do hệ thống lấy | `e6`, 17/02 | |
| | `lm2-05` | Quản lý cấp 2 đã đánh giá (chỉ xem, không Chỉnh sửa, không Lịch sử chỉnh sửa) | `e5`, 20/02 | |
| Quản lý cấp 2 - Sau bước Quản lý cấp 2 | `lm2-06` | Quản lý cấp 2 không đánh giá trước hạn | `e6`, 23/02 | |
| Trưởng đơn vị - Trước bước Trưởng đơn vị | `hod01` | Trưởng đơn vị chưa tới bước, Quản lý cấp 2 đã đánh giá | `e12`, 20/02 | |
| Trưởng đơn vị - Trong bước Trưởng đơn vị | `hod02` | Trưởng đơn vị chưa đánh giá, có điểm NV, QLTT và Quản lý cấp 2 | `e12`, 24/02 | |
| | `hod03` | Trưởng đơn vị đã đánh giá (chỉ xem, không Chỉnh sửa, không Lịch sử chỉnh sửa) | `e12`, 27/02 | |
| Trưởng đơn vị - Sau bước Trưởng đơn vị | `hod04` | Trưởng đơn vị không đánh giá trước hạn | `e10`, 09/03 | |

Tình huống của danh sách `M-05`: `lm25` (danh sách đủ ba nhóm cần lưu ý), `lm26` (quá hạn, hệ thống đồng bộ điểm), `lm2-07`,
`hod05`, `hod06`, `hod07`.
`e13` có điểm QLTT ngày 08/02/2027: QLTT chỉ chấm được hồ sơ không tự đánh giá sau khi hết thời gian nộp bổ sung (§27.4).
Tình huống M-06 của Quản lý cấp 2, Trưởng đơn vị chỉ dùng người **nằm trong danh sách của vai đó** (chị chốt 05/10/2026), để
bấm từ danh sách M-05 vào đúng hồ sơ ở tình huống: Quản lý cấp 2 có `e5` (LWD 31/03/2027), `e6` (thai sản, tự nguyện Tự đánh
giá, điểm QLTT do hệ thống lấy), `e7` (nộp bổ sung lần nhắc 3, QLTT chấm 3.5); Trưởng đơn vị có `e8` (nộp bổ sung lần nhắc 3,
QLTT chấm 3.5), `e9` (LWD), `e10`, `e11` (thai sản), `e12`. Nhờ đó danh sách M-05 của hai vai cũng có đủ ca nộp trễ bị giới hạn
điểm 3 (dấu cảnh báo ở cột điểm), thai sản và LWD.
`y16` có bản đánh giá của QLTT ngày 05/02/2027 (thêm 04/10/2026 cho `lm19`), sau mọi tình huống khác đang dùng `y16`
(`nv15` 01/02, `nv19` 03/02, `lm16` 04/02).

`nv07` và `nv08` là cùng một người ở hai thời điểm; `e10` có sẵn lịch sử gửi, mở lại, gửi lại (§8.2).
Nộp bổ sung ở từng lần nhắc dùng **một nhân viên ở hai thời điểm** (chốt 28/09/2026): ngày nhắc đầu tiên của lần
đó thì chưa nộp (`nv12` đến `nv15`), người review đi trọn luồng khối cảnh báo, xác nhận, popup, gửi file tới banner
đã nộp; ngày cuối của lần đó thì đã nộp theo bản dựng sẵn `lateSeed()` trong `yer-data.js` (`nv16` đến `nv19`).
`y16` Mạc Thùy Dung là nhân sự mới cho lần nhắc 4. `e8` và `y16` chưa có file Template điền sẵn nên bấm
`Tải Template` sẽ báo liên hệ HR (§27.1); luồng nộp vẫn đi tiếp. Hồ sơ nộp trễ của màn Quản lý là `y12`.
`nv12` đến `nv19` và `nv21` có cờ `fresh` (chốt 28/09/2026; `nv21` có cờ để file đã nộp thử ở `nv06` không lọt sang): mỗi lần tải trang (F5) hoặc chọn lại tình huống, thanh demo xóa
thao tác cũ của nhân viên đó (`self`, `selfDraft`, `selfEditing`, `selfLog`, `lateSubmission`, `importedGoals`, hàm
`freshStart` trong `yer-demo.js`), nên tình huống luôn bắt đầu lại đúng như dữ liệu dựng sẵn.
`y12` nộp bổ sung ngày 28/01/2027 (lần nhắc 3) nên tình huống `lm15` của Quản lý là ngày 29/01/2027.
Ngày 02/10/2026 lịch demo kéo timeline QLTT tới 08/02/2027 (§2), nên mọi tình huống và dữ liệu mẫu của bước LM2 trở đi
dời 7 ngày (vd `lm2-02` 17/02, `hod03` 27/02, `lm26` 12/02); tình huống của luồng nộp bổ sung giữ nguyên ngày.

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
  gồm `Direct reports` / `Indirect reports`, lựa chọn phụ `LM2` / `HOD`, hàng công cụ và bảng
  nhân viên. Không dựng biến thể ba nút phạm vi riêng cho YER.
- **Hàng công cụ giống tab Giữa năm** (chốt 30/09/2026), class `.list-toolbar`, căn phải:
  - LM2, HOD: `Duyệt điểm QLTT` (LM2) / `Duyệt điểm QL cấp 2` (HOD) và `Upload điểm`. HOD có thêm `Duyệt điểm HRBP upload`
    mở màn duyệt điểm HRBP upload (§9). Tên cấp trước viết như tên cột điểm (chị chốt 05/10/2026, thay `LM1`/`LM2`).
  - **Ba nút cùng kiểu viền hồng** `.btn-cta-outline` (chị chốt 05/10/2026, không viền xám, không nút nền đặc). Rê chuột thấy
    một câu ngắn bằng từ nghiệp vụ: `Duyệt điểm QLTT cho các nhân viên đủ điều kiện` (HOD: `Duyệt điểm QL cấp 2 cho …`),
    `Cập nhật điểm nhiều nhân viên bằng file`, `Duyệt điểm do HRBP upload`. Nút bị khóa thì tooltip nói lý do khóa.
  - `Bộ lọc` (popover `.filter-popover` như Mid-Year): QLTT chỉ có ô Nhân viên; LM2 có Nhân viên, Division, Department,
    Team, Quản lý trực tiếp; HOD có Nhân viên, Division, Department, Quản lý trực tiếp, Quản lý cấp 2. Bấm ra ngoài thì
    đóng, `Xóa bộ lọc` xóa hết, đổi vai thì xóa bộ lọc. Không còn ô tìm kiếm riêng.
  - `Split View`: danh sách bên trái (ô tìm nhân viên; mỗi dòng có tên kèm domain `Tên (domain)`, phòng ban, trạng thái,
    `Điểm của bạn`), bên phải là M-06 nhúng
    (`M-06/index.html?emp=…&tab=yer&embed=1`). Khung nhúng giữ hàng nút đánh giá của QLTT (`Lưu nháp`, `Gửi đánh giá`,
    `Lưu thay đổi`; Quản lý cấp 2, Trưởng đơn vị chỉ xem, §8.3), chỉ ẩn nút quay lại. Khung lưu thì danh sách bên trái cập nhật theo, không nạp lại khung.
    `Mở toàn trang` mở M-06 ở trang riêng. Khung Split View cao gần bằng màn hình (`calc(100vh - 84px)`), danh sách bên trái tự
    cuộn, bật Split View thì trang cuộn để khung nằm ngay dưới thanh trên cùng (sửa 04/10/2026): trước đó khung nhúng bị kéo cao
    theo danh sách nên popup trong khung (căn giữa khung) rơi xuống dưới màn hình.
- **LM2 và HOD chấm điểm ngay trên lưới** (chốt 30/09/2026), như tab Giữa năm:
  - Cột chọn đầu bảng. Dòng tick được khi vai đang xem sửa được và cấp trước đã có điểm.
  - **`Duyệt điểm QLTT/QL cấp 2` mở popup có sẵn danh sách** (chị chốt 05/10/2026, phương án 2 của góp ý số 5): người dùng không
    cần biết phải tick trên bảng trước. Popup `Duyệt điểm QLTT` / `Duyệt điểm QL cấp 2` liệt kê mọi nhân viên đủ điều kiện (vai đang
    xem sửa được, cấp trước đã có điểm) trong bảng `.myr-table` cuộn trong khung: ô chọn, Nhân viên (kèm tag), điểm của cấp trước
    (kèm `(HR system)` và dấu cảnh báo vượt mức), `Điểm hiện tại của bạn`. Câu dẫn: `Điểm của [cấp trước] được ghi nhận làm điểm
    của [vai] cho các nhân viên được chọn.`
    - Chọn sẵn: các dòng đã tick trên bảng; chưa tick dòng nào thì chọn sẵn người chưa có điểm của vai đang xem. Người đã có
      điểm vẫn có trong danh sách nhưng không chọn sẵn, câu dẫn thêm `Nhân viên đã có điểm của bạn không được chọn sẵn; chọn thì
      điểm đó được thay.`
    - Số trên nút ở thanh công cụ là số người sẽ được chọn sẵn. Nút chỉ khóa khi không có ai đủ điều kiện (tooltip `Chưa có nhân
      viên đủ điều kiện duyệt điểm`).
    - Nút chính `Duyệt điểm n nhân viên` đổi số theo lựa chọn, không chọn ai thì khóa. Bấm thì chép điểm cấp trước thành điểm của
      vai, giữ nhận xét đã có; có hồ sơ vượt mức tối đa thì qua popup xác nhận (§9).
  - Cột điểm của chính vai (LM2: `Điểm của QL cấp 2`, HOD: `Điểm của Trưởng đơn vị`) là **ô điểm dạng nút** (`.yer-rt-btn`,
    cùng dáng ô chọn điểm của tab Giữa năm): chưa chấm ghi `Chọn điểm`, đã chấm ghi số. **Bấm vào ô là mở popup ngay**
    (chốt lại 30/09/2026, không phải chọn điểm xong mới mở). Muốn sửa thì bấm lại chính ô đó; **không có nút nhận xét riêng**.
  - Popup `Đánh giá toàn diện của Quản lý cấp 2` / `… của Trưởng đơn vị` (rộng 640px, chốt lại 30/09/2026):
    - Dòng `Nhân viên: Tên (domain)`, rồi điểm các cấp trước **chia cột thẻ** (LM2 hai cột, HOD ba cột). Đây chỉ là thông tin
      tham khảo nên thẻ **nhỏ, gọn** (chị chốt 05/10/2026): dòng trên là vai kèm domain (`Điểm của QLTT - huy.tran`, chữ 11px xám,
      dài thì `...`), dòng dưới là điểm chữ 13px kèm `(HR system)` nếu do hệ thống chép và dấu cảnh báo vượt mức tối đa như ở
      danh sách. Phần chính của popup là ô `Điểm toàn diện của bạn` và nhận xét.
    - Hồ sơ nộp bổ sung có hình thức xử lý: khối vàng với câu của §27.3 đứng **trên** ô `Điểm toàn diện của bạn` để người chấm đọc
      trước khi chọn; vượt mức tối đa thì thêm dòng cảnh báo và ô tick xác nhận.
    - `Điểm toàn diện của bạn` bắt buộc, dùng **đúng component chọn điểm của màn chi tiết** (`PMSUi.rating`, bước 0.5): ô chọn
      `Chọn điểm 1-5`, chọn rồi thì hiện tên mức có màu theo mức. Ô `Ý nghĩa thang điểm` (§41.2b) **chỉ hiện lúc đang chọn điểm**:
      mở lại popup của điểm đã xác nhận thì ẩn, đổi điểm thì hiện lại (chốt 30/09/2026). Chỉ xem thì hiện số, tên mức và ⓘ.
    - Ô `Nhận xét` (không ghi `toàn diện (tùy chọn)` trên nhãn), mặc định cao 2 dòng, placeholder `Ghi nhận xét của bạn về kết quả
      và đóng góp của nhân viên trong năm.`, tối đa 1000 ký tự.
    - Dưới ô nhận xét: bên trái là hạn, chữ và icon đồng hồ màu thương hiệu, không viền, không nền: `[Vai] được điều chỉnh điểm cho
      nhân viên tới hết **18:00 ngày dd/mm/yyyy**` (gọi tên vai, chốt 04/10/2026); bên phải là bộ đếm `n / 1000`.
    - Khối thu gọn `Lịch sử chỉnh sửa (n)`, rồi nút `Hủy` / `Xác nhận`. `Xác nhận` thì popup đóng, điểm ghi vào cột của vai, dòng
      đứng yên tại chỗ cho tới lần dựng lại kế tiếp. Chưa chọn điểm mà xác nhận thì nhắc và giữ lại nội dung. `Hủy`, dấu x hay
      Esc thì không ghi gì.
  - Hết quyền sửa: đã có điểm thì ô vẫn bấm được để mở popup chỉ xem (nút `Đóng`); chưa có điểm thì ô khóa. Tooltip của ô nói
    lý do: `Mở từ dd/mm/yyyy`, `Đã hết hạn lúc 18:00 ngày dd/mm/yyyy`, `Chỉ mở sau khi QLTT gửi đánh giá`, `Chỉ mở sau khi Quản lý cấp 2
    lưu điểm`. Điểm hệ thống tự chép và hồ sơ `Không đánh giá` chỉ hiện số.
  - Tiêu đề cột điểm của chính vai có ⓘ (`.yer-th-info`), rê chuột hoặc focus thì nói: đang mở `Bấm vào ô điểm để chấm điểm và
    ghi nhận xét toàn diện. Muốn sửa thì bấm lại ô đó: bạn chỉnh sửa được nhiều lần tới hết ngày dd/mm/yyyy (timeline đánh giá
    của bạn), mỗi lần lưu đều có trong lịch sử chỉnh sửa; sau đó chỉ xem.`; chưa mở `Bạn chấm và chỉnh sửa điểm được từ
    dd/mm/yyyy tới hết ngày dd/mm/yyyy (timeline đánh giá của bạn).`; đã hết `Timeline đánh giá của bạn đã kết thúc ngày
    dd/mm/yyyy, điểm chỉ còn để xem.`
  - **Lịch sử chỉnh sửa** (chốt 30/09/2026): mỗi lần LM2, HOD lưu điểm là một dòng `{ at, time, score, comment, source }` trong
    `acts[emp].lm2Log` / `hodLog`, model trả ra `p.lm2Log` / `p.hodLog` (dữ liệu mẫu chưa có lịch sử thì suy một dòng từ bản
    đang có; điểm hệ thống tự chép không vào lịch sử). Ghi từ mọi đường lưu: chấm trên danh sách, `Duyệt điểm QLTT` /
    `Duyệt điểm QL cấp 2`, `Upload điểm`, `Duyệt điểm HRBP upload`, lưu ở màn chi tiết; trường `source` chỉ để truy vết, không hiện.
    Popup hiện mới nhất ở trên: `dd/mm/yyyy hh:mm - Điểm toàn diện: x` (chốt 30/09/2026), dòng dưới là nhận xét nếu có.
  - Cột Chức năng (chốt 30/09/2026): **mọi nút màu xám, chỉ AI Summary mang màu nhấn**. LM2, HOD có AI Summary (§14) rồi nút
    mắt `Xem chi tiết đánh giá`; việc chấm và nhận xét nằm ở ô điểm nên hai chức năng không chồng nhau. QLTT giữ nút bút
    `Xem và đánh giá` / `Xem và chỉnh sửa` hoặc mắt `Xem`, vì QLTT chấm ở màn chi tiết.
  - `Upload điểm` mở popup `Upload điểm đánh giá cuối năm` **cùng bố cục với popup nộp bổ sung của E-05** (chị chốt
    05/10/2026, thay khuôn thẻ bước hồng của tab Giữa năm): khung các bước dùng chung `.yer-flow` ở `assets/yer-ui.js`, mỗi bước
    một hàng gồm nhãn `BƯỚC n` kèm icon, câu việc cần làm và nút ngay trên hàng; ghi chú phụ chữ nhỏ xám có icon ⓘ.
    **Không tô hồng thẻ bước hay tên cột** để khỏi nhầm với nút; nút `Chọn file` là nút viền như E-05.
    - Đầu popup: đang mở là câu dẫn `Hoàn thành 3 bước dưới đây trước **18:00 ngày dd/mm/yyyy**.`; bị khóa là khối vàng icon
      khóa nói lý do (`Chưa tới bước đánh giá của [Vai] (mở từ dd/mm/yyyy) nên chưa tải file lên được.` hoặc `Bước đánh giá của
      [Vai] đã kết thúc lúc 18:00 ngày … nên không tải file lên được nữa.`).
    - Bước 1 `Tải file mẫu có sẵn danh sách nhân viên`, **một nút** `Tải file mẫu` (CSV gồm Mã nhân viên, Họ tên, Domain, Điểm
      QLTT, với HOD thêm Điểm LM2, cột điểm của vai `Điểm LM2`/`Điểm HOD`, Nhận xét; chỉ gồm nhân viên vai đang xem sửa được).
    - Bước 2 `Điền điểm toàn diện từ 1 đến 5 vào cột Điểm HOD`, ghi chú `Được dùng mức lẻ 0.5, ví dụ 3.5. Cột Nhận xét không bắt
      buộc. Giữ nguyên mã nhân viên và các cột khác.`
    - Bước 3 `Tải lên file đã điền điểm (.csv)`, nút `Chọn file` khóa khi ngoài timeline. Chân popup chỉ có `Đóng`.
    - **Xem trước rồi mới ghi điểm** (chị chốt 05/10/2026, đề xuất 3 của góp ý số 5, học từ Lattice): chọn file xong mở popup
      `Xem trước điểm từ file`: câu dẫn `File [tên]: n dòng hợp lệ (k dòng không đổi), m dòng lỗi. Điểm chỉ được cập nhật sau khi
      bạn bấm Cập nhật.`; bảng dòng hợp lệ gồm Nhân viên (kèm tag), `Điểm hiện tại`, `Điểm mới` (dấu cảnh báo vượt mức; giống
      hệt điểm và nhận xét đang có thì ghi `Không đổi`); khối đỏ liệt kê dòng lỗi kèm lý do: mã không có trong danh sách của bạn,
      trùng mã với dòng trước, điểm không hợp lệ (1 đến 5, bước 0.5), hoặc lý do khóa của hồ sơ. Dòng để trống điểm bỏ qua, không
      tính là lỗi.
    - Nút `Cập nhật n nhân viên` chỉ tính dòng có thay đổi; không có dòng nào thay đổi thì popup chỉ còn `Đóng`. Bấm thì qua
      popup xác nhận vượt mức (§9) rồi mới ghi.
  - **Điểm thẳng hàng** (chốt 30/09/2026): số điểm ở mọi cột nằm đúng giữa hàng; nhãn `(HR system)` treo dưới số, icon cảnh báo
    vượt mức treo bên phải số, cả hai đặt tuyệt đối (`.yer-sc`) nên không đẩy số lệch lên hay lệch sang.
  - Danh sách không gắn cảnh báo dữ liệu chưa lưu (§36): mọi thao tác trên danh sách lưu ngay, bộ lọc không phải dữ liệu.
- Roster được lọc sẵn theo reporting scope giống Mid-Year: QLTT xem toàn bộ direct reports,
  Quản lý cấp 2 xem toàn bộ nhân viên thuộc các Quản lý dưới quyền, HOD xem toàn bộ nhân viên
  thuộc đơn vị. Không vai nào nhận danh sách toàn công ty rồi mới lọc ở giao diện.
- Nhãn tab **Đánh giá giữa năm** và **Đánh giá cuối năm** theo đúng luật chung của §18.4 (`PMSYer.cycleTabLabel`),
  cùng câu chữ và màu với màn Nhân viên, không theo vai (chốt 30/09/2026).
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
- **Trạng thái luôn một dòng** (chị chốt 05/10/2026): chip ở cột Trạng thái không xuống dòng, chữ 11px (nhỏ hơn bảng Mid-Year
  11.5px), cột Trạng thái đủ rộng cho trạng thái dài nhất `Không yêu cầu Tự đánh giá` ở cả ba vai.
- **Tên cột tối đa hai dòng** ở màn 1440 (chị chốt 05/10/2026): cột Nhân viên hẹp lại để nhường chỗ cho các cột điểm, cột
  `Điểm của Trưởng đơn vị` đủ rộng cho `Trưởng đơn vị` nằm một dòng; ⓘ đứng ngay sau tên cột, không rơi xuống dòng riêng.
  Bảng HOD không cuộn ngang ở màn 1440 (`min-width` 1150px).
- Thứ tự ưu tiên của danh sách (chốt lại 02/10/2026, luật ở `PMSYer.managerRosterRank(role, p)`): theo **giai đoạn của kỳ**
  (`PMSYer.managerStage(now)`, tính theo ngày nên giống nhau cho mọi người: `self` trước ngày mở bước QLTT, rồi `lm`, `lm2`,
  `hod`; qua hết bước HOD vẫn là `hod`).

  Giai đoạn Tự đánh giá, mọi vai (giữ như 30/09/2026):

  | Nhóm | Hồ sơ |
  |---|---|
  | 0 | Nhân viên chưa tự đánh giá |
  | 1 | Nhân viên đã tự đánh giá |
  | 2 | Nhân viên nghỉ thai sản (đứng sau nhân viên bình thường) |
  | 5 | Hồ sơ có `LWD` |
  | 6 | `Không đánh giá` |

  Giai đoạn QLTT:

  | Thứ tự | Hồ sơ |
  |---|---|
  | 1 | Nhân viên nghỉ thai sản (chờ QLTT) |
  | 2 | Chờ QLTT đánh giá, có nhãn `Nộp trễ hạn` |
  | 3 | Chờ QLTT đánh giá, hồ sơ bình thường |
  | 4 | Chờ QLTT đánh giá, có `LWD` |
  | 5 | Chưa tới lượt QLTT: `Chưa tự đánh giá` còn trong cửa sổ nộp bổ sung |
  | 6 | QLTT đã đánh giá xong (hoặc đã công bố kết quả) |
  | 7 | `Không đánh giá`: thiếu mục tiêu, không nộp bổ sung, hệ thống chặn mọi bước sau |

  Giai đoạn Quản lý cấp 2, và giai đoạn Trưởng đơn vị theo đúng thứ tự này với HOD:

  | Thứ tự | Hồ sơ |
  |---|---|
  | 1 | Chờ LM2 đánh giá, có nhãn `Nộp trễ hạn` |
  | 2 | Chờ LM2 đánh giá, hồ sơ bình thường |
  | 3 | Chờ LM2 đánh giá, nghỉ thai sản |
  | 4 | Chờ LM2 đánh giá, có `LWD` |
  | 5 | Chưa tới lượt LM2: còn chờ cấp trước |
  | 6 | LM2 đã đánh giá xong (hoặc đã công bố kết quả) |
  | 7 | `Không đánh giá` |

  Luật chung: việc mà **vai đang xem làm được ngay** (`PMSYer.managerActionable`: hồ sơ chờ đúng vai, vai còn trong timeline,
  chưa gửi) luôn lên đầu, theo thứ tự trong bảng của vai đó. Người xem ở vai khác với giai đoạn (vd LM2 xem lúc kỳ đang ở bước QLTT, QLTT xem lúc kỳ đã sang bước LM2) vẫn thấy danh
  sách xếp theo bảng của giai đoạn. Mã số trong model: nhóm × 10 + thứ tự trong nhóm (0x việc của vai đang xem, 1x chờ vai của
  giai đoạn, 20 chưa tới lượt, 30 đã xong, 40 `Không đánh giá`). Trong từng nhóm giữ thứ tự dữ liệu ban đầu.
- **Sắp xếp theo cột** (chốt 02/10/2026): mọi cột trừ ô chọn và `Chức năng` có nút sắp xếp ở tiêu đề (`.yer-th-sort`, icon
  `bx-sort-alt-2` / `bx-sort-up` / `bx-sort-down`). Bấm lần 1 xếp A → Z (cột điểm: tăng dần), lần 2 Z → A (giảm dần), lần 3 về
  thứ tự ưu tiên ở trên. Cột chữ (Nhân viên, Quản lý trực tiếp, Quản lý cấp 2, Trạng thái) so theo tiếng Việt; ô trống (chưa có
  điểm, chưa có quản lý) luôn nằm cuối dù xếp chiều nào; cùng giá trị thì giữ thứ tự ưu tiên. Cột đang xếp có chữ và icon màu
  thương hiệu, `aria-sort` đúng chiều, tooltip nói lần bấm kế tiếp làm gì. Split View dùng cùng thứ tự. Đổi vai thì bỏ sắp xếp.
- Badge trạng thái dùng cùng kiểu pill bo tròn và **cùng câu chữ với tab Đánh giá giữa năm**, giữ nguyên trạng thái khách quan
  của quy trình. **Màu** theo `PMSYer.managerStatusTone(role, p)` (chốt lại 02/10/2026):

  | Trạng thái trong model | Câu chữ trên danh sách | Màu |
  |---|---|---|
  | `need-self`, `late-upload` | `Chưa tự đánh giá` | hồng trong giai đoạn Tự đánh giá (trừ khi vai đang xem đã chấm); từ bước QLTT là xám (QLTT đang chờ nhân viên nộp bổ sung, §27.4) |
  | `no-self` | `Chờ QLTT đánh giá`, kèm tag xám `Không tự đánh giá` dưới tên (hết mọi lần nhắc, đủ mục tiêu, §27.4) | theo luật hồng dưới đây |
  | `maternity` | trước bước QLTT `Không yêu cầu Tự đánh giá`, từ bước QLTT `Chờ QLTT đánh giá` | theo luật hồng dưới đây |
  | `wait-lm` | `Chờ QLTT đánh giá` | theo luật hồng dưới đây |
  | `wait-lm2` | `Chờ QL Cấp 2 đánh giá` | theo luật hồng dưới đây |
  | `wait-hod` | `Chờ HOD đánh giá` | theo luật hồng dưới đây |
  | `published` | `Đã công bố kết quả` | xanh (`completed`) |
  | còn lại (`wait-tr`, `noeval`, `not-open`…) | nhãn của model | xám |

  **Luật hồng:** trạng thái `Chờ [vai] đánh giá` là hồng khi hồ sơ đang chờ **đúng vai đang xem** và vai đó **làm được ngay**
  (`managerActionable`, cùng điều kiện với nhóm đầu của thứ tự và nút bút). Giai đoạn QLTT thì `Chờ QLTT đánh giá` hồng ở màn
  QLTT; giai đoạn LM2 thì `Chờ QL Cấp 2 đánh giá` hồng ở màn LM2; giai đoạn HOD tương tự. Màu đi theo vai đang xem chứ không
  theo giai đoạn chung, để hồng luôn là việc của chính người đang xem (DS §0): **người vừa là QLTT vừa là LM2** xem từng vai ở
  `Direct reports` / `Indirect reports`, mỗi vai thấy hồng đúng việc của vai đó; LM2 xem lúc kỳ đang ở bước QLTT thì
  `Chờ QLTT đánh giá` là xám vì LM2 không làm được gì. Không dùng tông đỏ trên danh sách này.
- Thiếu mục tiêu trong lúc Tự đánh giá đang mở là `Chưa tự đánh giá`, không phải `Không đánh giá` (sửa 30/09/2026 theo §5,
  §27.1): `Không đánh giá` chỉ khi hết cửa sổ nộp bổ sung (`p.stopped`). Nhân viên thai sản chưa có mục tiêu cũng không
  bị gắn `Không đánh giá`.
- Cột Quản lý dùng `PMSYer.actors(profile)` làm nguồn duy nhất, không đọc thẳng `emp.mgr` /
  `emp.mgr2`; nhờ đó hồ sơ seed chưa lặp lại dữ liệu tổ chức vẫn hiện đúng chuỗi quản lý.
  Tên và domain dùng nguyên kết cấu `.myr-manager` + `.er-login` của bảng Mid-Year.
- Cột Nhân viên giữ thêm khoảng đệm trái 12px để nội dung không dính sát viền bảng.
- Dòng bộ phận và vị trí dưới tên nhân viên **chỉ một dòng** (chị chốt 05/10/2026, như bảng Mid-Year): dài quá cột thì `...`,
  không xuống dòng thứ hai; rê chuột vào dòng bị cắt thì tooltip hiện đủ. Áp dụng cho bảng chính và bảng `Duyệt điểm HRBP upload`.
  Tên nhân viên vẫn được xuống dòng.
- Với nhân viên thai sản, badge `Đang nghỉ thai sản` chỉ nằm dưới thông tin nhân viên; cột `Trạng thái` không lặp
  thông tin này. Hồ sơ đã nộp trễ chỉ hiển thị **`Chờ QLTT đánh giá`** trong cột Trạng thái; thông tin `Nộp trễ hạn`
  được giữ một lần dưới tên nhân viên.
- Không hiển thị ba thành phần phụ trên danh sách: khối mô tả việc của vai, khối giải thích
  điểm toàn diện và nút/tour `Xem hướng dẫn`.

Bổ sung ngày 27/09/2026 theo code:
- **Khi nào vai được chấm** (`PMSYer.managerReviewState`, danh sách và màn chi tiết cùng đọc):
  timeline của vai đang mở, hồ sơ không nghỉ việc, không `Không đánh giá`, và:
  QLTT: đã có Tự đánh giá (kể cả nộp bổ sung), hoặc thai sản, hoặc đủ mục tiêu mà **không còn trong thời gian nộp bổ sung**
  (đang chờ nhân viên nộp bổ sung thì chưa chấm, §27.4); LM2: đã có điểm QLTT, **kể cả điểm
  tự chép**; HOD: đã có điểm LM2, kể cả điểm tự chép. Điểm tự chép của QLTT không tính là QLTT đã gửi.
  Thai sản thành việc của QLTT ngay khi timeline QLTT bắt đầu.
- Hồ sơ thai sản trước timeline QLTT: cột Trạng thái ghi `Không yêu cầu Tự đánh giá`.
- Tag dưới tên nhân viên: `LWD: dd/mm/yyyy`, `Đã nghỉ việc`, `Đang nghỉ thai sản`, `Nộp trễ hạn`, `Không tự đánh giá`.
  Tag `Nộp trễ hạn` dùng tông vàng cảnh báo (`--warn`); `Không tự đánh giá` tông xám (`--z100`, `--z700`), chỉ cho hồ sơ
  hết mọi lần nhắc mà không nộp, đủ mục tiêu (§27.4).
- Điểm tự chép có nhãn `(HR system)` dưới điểm (chữ thường, không viền, không nền, §6), tooltip `Hệ thống tự chép điểm vì quá deadline`.
- Nút ở cột Chức năng có tooltip `Xem và đánh giá (tới dd/mm/yyyy)`, `Xem và chỉnh sửa (tới dd/mm/yyyy)` hoặc `Xem`.
  Hạn lấy từ `managerEditWindow` (§8.3). Bấm vào cả dòng cũng mở M-06 (hoặc chọn nhân viên đó trong Split View).
  `Indirect reports` mở vai LM2 trước.
- Cả ba vai đều thấy đủ các cột điểm: Nhân viên, QLTT, Quản lý cấp 2, Trưởng đơn vị, Điểm cuối cùng.
  LM2 có thêm cột Quản lý trực tiếp; HOD có thêm cột Quản lý trực tiếp và Quản lý cấp 2.

## 48. Chi tiết Đánh giá cuối năm của Quản lý

Chốt ngày 22/09/2026.

- Cả **QLTT, Quản lý cấp 2 và HOD** đều sửa được điểm và nhận xét của chính mình sau lần
  đánh giá đầu tiên, miễn là timeline của vai đó vẫn còn mở. Hết deadline mới chuyển chỉ xem.
- Quản lý cấp 2 và HOD chỉ nhập **điểm toàn diện (overall rating)** và nhận xét toàn diện cho
  nhân viên đã nằm trong roster được lọc sẵn của vai mình; điểm từng mục tiêu của các cấp trước
  chỉ để tham khảo.
- Ba tình huống `lm18`, `lm2-05`, `hod03` (Quản lý cấp 2, Trưởng đơn vị sửa ở M-05, M-06 chỉ xem) lần lượt kiểm tra trạng thái đã đánh giá nhưng vẫn
  chỉnh sửa được của từng cấp quản lý.
- Tab Cuối năm dùng đúng cấu trúc tab Giữa năm: một hàng điều hướng có `Quay lại danh sách
  nhân viên` bên trái và các action bên phải; không đặt thêm nút `Danh sách` trên topbar.
- Bảng mục tiêu dùng cùng phân bổ cột với Giữa năm, gồm cột `Thời gian`; hai panel nhận xét
  và thẻ Đánh giá toàn diện dùng cùng editor, toolbar, màu viền và nhãn vai trò.
- Bỏ toàn bộ nút và dialog `Trả về cho nhân viên` ở vai QLTT.
- **Khối thông tin theo đúng luật của màn Nhân viên (§40.5a, chốt 30/09/2026)**: không bao giờ hai box thông tin cùng lúc.
  Dưới dải quy trình chỉ có **một** khối `Lưu ý` (`.info-note.yer-note-block`, icon ⓘ, `Lưu ý:` rồi `ul.yer-note-list`),
  mỗi thông tin là một gạch đầu dòng. Thứ tự chốt lại 02/10/2026: thông tin riêng của hồ sơ trước, hạn của vai đang xem
  đứng **cuối**; mọi câu gọi tên vai (`QLTT`…) thay cho `Bạn`. Ví dụ hồ sơ bình thường của QLTT:
  `QLTT có thể xem lại kết quả Đánh giá giữa năm 2026 của nhân viên trước khi đánh giá cuối năm.` /
  `Sau khi gửi đánh giá, QLTT có thể chỉnh sửa tới hết 18:00 ngày dd/mm/yyyy.`
  1. (đứng cuối khối) Hạn đánh giá của vai đang xem (câu chữ ở §8.3).
  2. Thai sản: LM2, HOD thấy gạch đầu dòng `Nhân viên đang trong thời gian **nghỉ thai sản** nên **không bắt buộc** Tự đánh giá.
     Quản lý trực tiếp chịu trách nhiệm chính đánh giá cuối năm cho nhân viên này.` Cụm **nghỉ thai sản** đậm màu `--brand`
     như §40.5b. **QLTT** (chốt 02/10/2026) không đọc khối `Lưu ý` thường mà đọc **khối hướng dẫn** cùng kiểu, vẫn là một khối
     duy nhất (`.info-note.yer-note-block.yer-mat-guide`, hàm `maternityGuide`):
     - Tiêu đề `Hướng dẫn đánh giá cho Nhân viên đang nghỉ thai sản:`
     - `Nhân viên đang **nghỉ thai sản** **không bắt buộc** Tự đánh giá. QLTT **chịu trách nhiệm chính** thực hiện đánh giá nhân
       viên theo các bước sau:`
     - Ba bước đánh số: `1. Rà soát các mục tiêu hiện có tại tab Đánh giá cuối năm.` / `2. Thêm mới mục tiêu cho nhân viên (nếu
       cần). Các mục tiêu do QLTT tạo sẽ được ghi nhận ở trạng thái **Đã duyệt**.` (cụm `Thêm mới mục tiêu` là liên kết mở popup
       thêm mục tiêu khi còn trong timeline QLTT, §33; còn thiếu thì thêm `Nhân viên còn thiếu **[loại]** được duyệt.`) /
       `3. Hoàn thành Đánh giá chi tiết cho nhân viên và gửi.`
     - Dòng cuối `**Lưu ý:**` dùng **đúng câu hạn của mục 1** (`windowText`, chốt 04/10/2026), ví dụ `Sau khi gửi đánh giá, QLTT có
       thể chỉnh sửa tới hết **18:00 ngày dd/mm/yyyy**.` Bỏ câu riêng `QLTT có thể chỉnh sửa kết quả đánh giá trước…`. Hồ sơ có LWD hay kết quả giữa năm thì các câu đó đứng trước
       câu hạn trong dòng `Lưu ý`, thành gạch đầu dòng.
  3. Nộp bổ sung (chốt lại 02/10/2026): hồ sơ **đã nộp** bổ sung không còn là gạch đầu dòng mà được làm nổi bật bằng
     **banner nộp trễ** như banner của E-05 (`lateBanner`, `.submit-banner.yer-md-late-banner`), khi vai đang xem chưa gửi:
     tiêu đề `Nhân viên đã hoàn thành bổ sung Tự đánh giá cuối năm`; dòng `Ngày gửi: dd/mm/yyyy` + nhãn đỏ `Trễ hạn x ngày làm
     việc` + `- Nộp bổ sung ở lần nhắc thứ k`; dòng `**Hình thức xử lý theo quy định** (nộp ở lần nhắc thứ k): …` khi lần đó có
     hình thức; dòng `File: … . Mục tiêu trong file **không qua bước duyệt**; nhân viên xác nhận đã thống nhất với QLTT từ trước.`;
     bên phải `Điểm NV tự đánh giá`. Banner và khối `Lưu ý` (hạn của vai) đi cùng nhau như banner và nội dung của E-05.
     Nhân viên **chưa nộp, còn trong thời gian nộp bổ sung** (chốt 02/10/2026, §27.4): khối `Lưu ý` được thay bằng **một khối
     vàng** `.yer-note.yer-late-closed.yer-late-wait` (hàm `waitingBlock`, DS §19 rule 24), mọi vai đều thấy:
     tiêu đề `Đang chờ nhân viên nộp bổ sung Tự đánh giá`, câu `Nhân viên đã quá hạn Tự đánh giá và chưa nộp bổ sung.`, rồi
     **gạch đầu dòng** (chốt 04/10/2026): `Đang ở **lần nhắc thứ k**, hạn nộp **18:00 ngày dd/mm/yyyy**.` / `Nhân viên chỉ được nộp
     bổ sung **một lần**. QLTT đánh giá được ngay sau khi nhân viên nộp.` / `**Hình thức xử lý khi nộp ở lần nhắc này:** …` khi lần đó có
     hình thức / điều xảy ra nếu không nộp: thiếu mục tiêu `Nhân viên còn thiếu **[loại]** được duyệt. Nếu hết các lần nhắc
     (**18:00 ngày dd/mm/yyyy**) mà nhân viên không nộp, hồ sơ chuyển **Không đánh giá** và không có điểm.`, đủ mục tiêu `Nếu hết
     các lần nhắc (…) mà nhân viên không nộp, QLTT sẽ tiếp tục đánh giá tới hết **18:00 ngày dd/mm/yyyy**.` (chị chốt 04/10/2026) /
     LWD, kết quả giữa năm nếu có. Các ô điểm, nhận xét khóa, không có hàng nút gửi.
     Hết mọi lần nhắc mà không nộp, đủ mục tiêu: tình trạng nằm ở banner xám, khối `Lưu ý` không nhắc lại.
  4. LWD (chị chốt 04/10/2026): `Nhân viên có Ngày làm việc cuối cùng là **dd/mm/yyyy**. Nhân viên và QLTT vẫn cần hoàn thành
     đánh giá trong thời gian nhân viên còn đang làm việc.`
  5. Kết quả giữa năm, chỉ khi có (§28).
  Không còn dòng nào thì không dựng khối. **Vai đang xem đã gửi** thì không có khối `Lưu ý`, banner thay thế (như dòng 1 của
  §40.5a); hồ sơ nộp bổ sung thì banner có thêm dòng `Ngày gửi` với nhãn đỏ `Trễ hạn x ngày làm việc`, lần nhắc và dòng
  `Hình thức xử lý theo quy định …` (như banner của Nhân viên, §27.3).
  **Hồ sơ `Không đánh giá`** chỉ có một khối vàng `.yer-note.yer-late-closed` (`--warn-bg`, `--warn-bd`, icon `--warn`, DS §19
  rule 24) tiêu đề `Hồ sơ không đánh giá`: thiếu mục tiêu thì nói hết cửa sổ nộp bổ sung, loại mục tiêu còn thiếu, quy trình
  dừng và không có điểm (như `nv21`); không có điểm nào tới hết hạn QLTT thì nói nhân viên không tự đánh giá và QLTT không đánh
  giá tới hết hạn, không có điểm để đồng bộ.
  Đã bỏ các box rời: hạn đánh giá, thai sản, hồ sơ nộp bổ sung (kèm các chip tên file, trễ hạn), LWD, dòng Đánh giá giữa năm,
  `Không có kết quả Đánh giá giữa năm`.

Bổ sung ngày 27/09/2026 theo code và theo quyết định của chị:
- **Có dải quy trình** giống màn Nhân viên, ngay dưới hàng điều hướng và banner. Màn chi tiết là
  của một nhân viên nên mọi bước có domain, kể cả Tự đánh giá (§40.2). Trạng thái thu gọn nhớ riêng.
- Dưới dải quy trình chỉ có một khối: `Lưu ý` hoặc khối vàng `Hồ sơ không đánh giá` (xem mục khối thông tin ở trên).
  Hồ sơ `Không đánh giá` **vẫn hiện đủ** ba nhóm mục tiêu và thẻ đánh giá toàn diện như hồ sơ thường, chỉ để xem; nhóm thiếu mục
  tiêu là bảng trống (chị chốt 04/10/2026, trước đó ẩn hết).
- Ba nhóm mục tiêu **luôn giữ khối** như màn Nhân viên (§40.5d); nhóm trống có một dòng xám mờ.
- Dòng mục tiêu có tooltip ở hai cột đầu và bấm mở popup `#dlg-detail` bằng `openDetailFromRow` như E-05 (§13.2); mục tiêu đã
  đánh giá hoàn thành có khối hai lượt chấm. Giá trị cốt lõi mở `#dlg-how`.
- Hàng nút (chỉ QLTT, §8.3): `Lưu nháp` chỉ có trước lần gửi đầu, `Gửi đánh giá`; đang sửa bản đã gửi thì `Lưu thay đổi`.
  Quản lý cấp 2, Trưởng đơn vị không có nút lưu. Bên phải luôn có `AI Summary` và `Phản hồi đã nhận`.
- **Bố cục banner xanh** (sắp lại 04/10/2026, chị góp ý chữ tràn sang phần điểm): hai tầng. Tầng trên: icon, tiêu đề, **một**
  dòng ngày; bên phải `Điểm NV tự đánh giá`, `Điểm cuối cùng`, `Chỉnh sửa` (khi còn sửa được) và nút tải. Tầng dưới (`.yer-sb-more`,
  trải hết chiều ngang, thẳng lề tiêu đề, kẻ nét đứt): các dòng dài như `**Nộp bổ sung ở lần nhắc thứ k** - Hình thức xử lý theo
  quy định: …`, câu xác nhận mục tiêu. `Lịch sử chỉnh sửa` không còn là nút bên phải mà là **liên kết ngay sau dòng ngày gửi**
  (`Ngày gửi: dd/mm/yyyy - Lịch sử chỉnh sửa`), vì nó thuộc về lần gửi đó; liên kết màu xám `--z600` (chị chốt 04/10/2026). Tầng dưới
  rộng `calc(100% - 50px)` nên chữ dài không tràn khỏi viền banner.
- **Vai đang xem chưa gửi** (chốt 04/10/2026, như tab Giữa năm của M-06 và banner E-05): đầu tab có banner tình trạng Tự đánh giá
  của nhân viên. Đã gửi: banner xanh `Nhân viên đã hoàn thành Tự đánh giá cuối năm`, dòng `Ngày gửi: dd/mm/yyyy`, bên phải điểm và
  nút tải như banner sau khi gửi. Nộp bổ sung: banner nộp trễ (mục khối thông tin). Chưa gửi: banner xám `.submit-banner--pending`
  `Nhân viên chưa hoàn thành Tự đánh giá cuối năm`, **không có dòng phụ**; hết mọi lần nhắc mà không nộp: `Nhân viên không Tự đánh
  giá cuối năm`, QLTT có dòng `QLTT tiến hành đánh giá theo quy trình.`, LM2 và HOD không có dòng phụ (chị chốt 04/10/2026).
  **Quản lý cấp 2, Trưởng đơn vị chưa chấm** (chị chốt 04/10/2026): banner nói **bước gần nhất đã xong** trước vai mình (`priorBanner`):
  LM2 thấy `QLTT đã hoàn thành đánh giá cuối năm` + `Ngày gửi`; HOD thấy `Quản lý cấp 2 đã hoàn thành đánh giá cuối năm` + `Ngày lưu
  điểm` (cấp trước được hệ thống đồng bộ thì lùi về cấp trước nữa, không có thì về tình trạng Tự đánh giá). Hồ sơ nộp bổ sung thêm
  tầng dưới ngày nhân viên nộp, nhãn Trễ hạn, lần nhắc và hình thức xử lý. Chờ nộp bổ sung, `Không đánh giá`, thai sản đã có khối riêng nên không có banner.
- Sau khi gửi (chốt lại 02/10/2026): banner ghi rõ vai đã xong theo mẫu `[Vai trò] đã hoàn thành đánh giá cuối năm`
  (`QLTT …`, `Quản lý cấp 2 …`, `Trưởng đơn vị …`), **không còn** dòng `Cập nhật lần cuối … - Bạn có thể chỉnh sửa
  tới …`; dòng phụ `Ngày gửi: dd/mm/yyyy` (LM2, HOD `Ngày lưu điểm: …`), như E-05 (04/10/2026). Đã công bố thì tiêu đề `Đã công bố
  kết quả đánh giá cuối năm 2026`, dòng `Ngày công bố: dd/mm/yyyy` như E-05. Hồ sơ nộp bổ sung vẫn có nhãn trễ hạn và dòng hình thức xử lý (mục khối thông tin ở trên). Phần điểm như tab Giữa năm:
  `Điểm NV tự đánh giá:` và `Điểm cuối cùng:`. **Điểm cuối cùng để `—`** khi quy trình đi qua các bước và các vai đánh giá, chỉ có
  số khi quy trình xong và hệ thống công bố kết quả (`p.published`); rê chuột vào `—` thì đọc lý do. Bên phải có nút tải
  `bx-download` (tooltip `Tải kết quả đánh giá`), bấm chọn PDF hoặc Excel như banner của E-05 (§42). Chưa gửi thì hạn nằm ở khối
  hạn đánh giá (§8.3). Phần bên phải (`bannerRight`) dùng chung cho banner nộp trễ: `Điểm cuối cùng` và nút tải **luôn hiện**,
  kể cả khi chưa có kết quả cuối cùng (chốt 04/10/2026).
- Banner nộp trễ khi vai đang xem chưa gửi (chốt lại 04/10/2026): `Ngày gửi … ` + nhãn đỏ `Trễ hạn x ngày làm việc` + `- Nộp bổ sung
  ở **lần nhắc thứ k**` (lần nhắc in đậm); dòng hình thức xử lý nếu có, từ khóa in đậm (vd **tối đa là 3**); dòng `Nhân viên xác
  nhận các mục tiêu đã được thống nhất và đồng thuận với QLTT.` (bỏ `được đề xuất`, chị chốt 04/10/2026; không còn tên file).
- **Luồng Chỉnh sửa sau khi gửi** (chốt 04/10/2026, cùng luồng với E-05 §8): bấm `Chỉnh sửa` ở banner mở popup `Xác nhận chỉnh sửa
  đánh giá cuối năm đã gửi?` (`[Vai] có thể sửa điểm và nhận xét đến **18:00 ngày dd/mm/yyyy**.` / `Nếu không lưu thay đổi trước
  thời hạn trên, hệ thống giữ bản đánh giá đã gửi ngày **dd/mm/yyyy**.`, nút `Để sau` / `Chỉnh sửa`). Xác nhận thì khối màu nhẹ
  `.yer-note.action.yer-edit-note` thay cho banner: `[Vai] đang chỉnh sửa đánh giá đã gửi ngày dd/mm/yyyy`, hai gạch đầu dòng
  `Phạm vi chỉnh sửa` và `Thời hạn và lưu ý`, nút `Hủy chỉnh sửa` trong khối (hỏi xác nhận, bỏ thay đổi chưa lưu). Hàng nút chỉ
  còn `Lưu thay đổi`.
- **Popup thiếu thông tin** (chốt 04/10/2026, cùng kiểu E-05 §8.1): QLTT bấm `Gửi đánh giá` khi còn thiếu thì popup
  `.yer-miss-dialog` tiêu đề `Chưa thể gửi đánh giá vì thiếu thông tin`, dòng
  `Vui lòng bổ sung:` rồi **mỗi khối một gạch đầu dòng** `**[Khối]:** phần còn thiếu` (QLTT: điểm từng mục tiêu theo tên, `ô Đánh giá
  của Quản lý trực tiếp` của từng nhóm, điểm từng giá trị cốt lõi, `điểm toàn diện`, `ô Đánh giá toàn diện của Quản lý trực tiếp`), cuối popup `Các ô còn thiếu sẽ được đánh dấu viền đỏ trên màn hình.` Đóng popup thì các ô thiếu viền đỏ (`--err`) và màn
  cuộn tới ô đầu tiên; điền ô nào thì ô đó hết đỏ. Mục tiêu đã đánh giá hoàn thành không bị đòi (§13.1).
- Gửi / lưu xong thì màn cuộn lên banner xanh, như E-05.
- **Popup xác nhận gửi** (chốt 04/10/2026, chỉ QLTT): tiêu đề `Xác nhận gửi đánh giá cho nhân viên` (đang sửa `Lưu thay đổi
  đánh giá?`), hai gạch đầu dòng, ngày giờ in đậm, **gọi tên vai** (chị chốt 04/10/2026): `[Vai] có
  thể tiếp tục chỉnh sửa đánh giá tới hết **18:00 ngày dd/mm/yyyy**.` / QLTT: `Nhân viên có thể xem được điểm từng mục tiêu và ô
  nhận xét của QLTT, nhưng không thấy điểm toàn diện.`
- Tooltip của tab Cuối năm trên M-06 (nút tải, `Chỉnh sửa`, `—` của Điểm cuối cùng, chip `QLTT thêm`): M-06 chỉ có `showTip(el)`,
  nên `yer-manager-detail.js` khai `window.tip(el, text)` dựa trên `showTip` khi màn chưa có (sửa 04/10/2026).
- Nút `Phản hồi đã nhận` (chốt 02/10/2026) mở **đúng popup của M-04** (`M-04/manager-feedback-dialog.js`, dùng chung cho tab
  Giữa năm và Cuối năm của M-06): tiêu đề kèm số phản hồi, dòng `Tên (domain) - đơn vị - chức danh`, mascot AI summary, nút tải
  và mở tab mới, dòng `Kết quả phản hồi được chia sẻ từ HR (n)` + `Xem chi tiết`, thẻ phản hồi có tim cảm ơn và câu hỏi, nút
  `Đóng`. Dữ liệu và luật lấy từ file dùng chung của M-04, H-05; tab Cuối năm truyền đúng hồ sơ đang xem.
- Thẻ đánh giá toàn diện: chuẩn bốn ô cho mọi vai (xem mục ngay dưới). Bố cục theo thẻ của E-05 (chốt 04/10/2026): **hai ô một
  hàng**, tiêu đề ô
  `[Người chấm] đánh giá - domain` (`Nhân viên tự đánh giá`, `Quản lý trực tiếp đánh giá`, `Quản lý cấp 2 đánh giá`), dòng
  `Điểm toàn diện: 4 [tên mức] ⓘ`; **tên mức luôn một dòng**, không đủ chỗ cạnh điểm thì cả cụm tên mức và ⓘ xuống dòng (chị chốt
  04/10/2026, không để chữ trong chip vỡ hai dòng). Tag phụ `Cao hơn mức tối đa 3` nằm **dòng riêng bên dưới** điểm (`.yer-cap-row`),
  không chen cạnh điểm. **Các ô cạnh nhau thẳng hàng từng tầng** (chị góp ý 04/10/2026): mỗi ô có năm tầng cố định (tiêu đề, điểm,
  nhãn nhận xét, ô nhận xét, ô Ý nghĩa thang điểm), lưới dùng `grid-template-rows:subgrid`, nên nhãn `Đánh giá toàn diện của…` và ô
  nhận xét của các bên luôn bắt đầu cùng hàng dù bên nào có tên mức xuống dòng hay khối giới hạn điểm. Các ô **cách nhau 12px**, mỗi ô có viền bo riêng, không dính vào nhau. Nhãn
  ô nhận xét `Đánh giá toàn diện của [nhân viên / Quản lý trực tiếp / Quản lý cấp 2 / Trưởng đơn vị]` như tab Giữa năm và E-05, bỏ
  `… của bạn`, viết đủ tên vai, không viết tắt `QLTT` (chị chốt 04/10/2026). Ô của QLTT **không còn** dòng `Điểm này không hiển thị cho nhân viên…` (bỏ 02/10/2026). Ô của Quản lý cấp 2,
  Trưởng đơn vị chỉ xem (không còn dòng `Nhận xét là tùy chọn.`, 04/10/2026).
- **Lưu ý cuối phần Đánh giá toàn diện** (chốt 02/10/2026, mọi vai): sau thẻ Đánh giá toàn diện và khối `Đánh giá của các cấp quản
  lý` có một dòng `.info-note.yer-visibility-note`: `**Lưu ý:** Nhân viên chỉ xem được nhận xét toàn diện của các cấp quản lý,
  không xem được Điểm đánh giá. Kết quả cuối cùng của nhân viên sẽ hiển thị sau khi hoàn tất quy trình.`
- **Chế độ xem sau khi gửi** (chốt 02/10/2026): vai đang xem đã gửi thì màn về chế độ xem: ô điểm hiện số, tên mức và ⓘ, ô nhận
  xét chỉ đọc, không có ô `Ý nghĩa thang điểm`, không có nút `Cải thiện với AI`, không có hàng nút gửi. Còn trong timeline thì
  banner có nút `Chỉnh sửa` (`btn-cta-outline`, `bx-edit-alt`, tooltip hạn sửa §8.3). Bấm vào thì qua popup xác nhận rồi mở lại
  các ô (luồng Chỉnh sửa ở trên); ô `Ý nghĩa thang điểm` chỉ hiện khi đổi điểm (như popup chấm trên lưới M-05); nút AI chỉ có
  ở chế độ đang sửa. `Hủy chỉnh sửa` bỏ mọi thay đổi chưa lưu; lưu xong về chế độ xem. Trạng thái đang sửa chỉ giữ trong
  trang đang mở (`editingMem`), tải lại trang là về chế độ xem.
- **Nhóm mục tiêu như tab Giữa năm** (chốt 02/10/2026): tiêu đề nhóm `.rv-section-hd` gồm icon và tên trong `.rv-type`, bảng
  trong `.rv-table-wrap`. Nhóm Mục tiêu hành vi dùng đúng phân bổ cột (20%, 56%, 12%, 12%) và **đúng câu chữ năm giá trị cốt lõi**
  của tab Giữa năm, đọc từ một nguồn `window.PMS_CORE_VALUES` trong `assets/yer-data.js` (E-05 cùng đọc, DS §20.1). Bấm dòng giá
  trị cốt lõi mở `#dlg-how` cùng khuôn với popup Chi tiết mục tiêu và popup của E-05: `.dialog.md`, nhãn `Mục tiêu hành vi`,
  hai hàng `Tên mục tiêu`, `Mô tả` (`.detail-row`, `.detail-val`), ghi chú giá trị cốt lõi cố định.
- Tab Giữa năm đặt class `page-submitted` lên **panel `#mpanel-myr`**, không lên cả `.page` (sửa 02/10/2026): trước đó class này
  khóa luôn ô chọn điểm của tab Cuối năm (`pointer-events:none`), QLTT không bấm chọn điểm được (LM06).
  Tiêu đề ô của QLTT và LM2 (chỉ xem) ghi kèm domain: `QUẢN LÝ TRỰC TIẾP - domain`.
- **Chuẩn bốn ô của thẻ Đánh giá toàn diện** (chị chốt 04/10/2026, thay khối riêng `Đánh giá của các cấp quản lý` của 30/09/2026):
  mọi vai thấy **một** thẻ với đủ bốn ô, thứ tự cố định `Nhân viên tự đánh giá` | `Quản lý trực tiếp đánh giá` / `Quản lý cấp 2
  đánh giá` | `Trưởng đơn vị đánh giá`, hai ô một hàng. Ô của vai đang xem có icon bút, là ô nhập khi còn sửa được (chỉ QLTT, §8.3);
  ô của cấp khác chỉ xem, tiêu đề kèm domain người chấm. Cấp nào chưa đánh giá thì ô vẫn có, điểm và nhận xét là `—`. Điểm hệ
  thống tự chép có nhãn `(HR system)` và dòng `Quá hạn mà cấp này không đánh giá nên hệ thống tự lấy điểm của cấp trước, không kèm
  nhận xét.` Ô của **chính vai đang xem** cũng vậy: quá hạn mà hệ thống đã tự lấy điểm (vd `lm21`, `lm2-06`) thì ô hiện điểm đó kèm
  `(HR system)`, không để `—` (sửa 04/10/2026). Quản lý thấy cả điểm của các cấp (§7); E-05 vẫn là khối `Nhận xét của các cấp quản
  lý` không có điểm.
- Ô bắt buộc khi QLTT gửi: điểm toàn diện, nhận xét toàn diện, điểm từng mục tiêu **trừ mục tiêu đã
  đánh giá hoàn thành** (ô khóa, §13.1), điểm cả năm giá trị cốt lõi, ba nhận xét nhóm. LM2 và HOD chỉ
  bắt điểm toàn diện.
- Ô Đánh giá toàn diện (chốt 30/09/2026): thứ tự trong ô của vai đang xem là điểm → khối vàng hình thức xử lý (hồ sơ nộp bổ
  sung có hình thức, §27.3) → dòng gợi ý → ô nhận xét → ô `Ý nghĩa thang điểm` (§41.2b). Gửi điểm cao hơn mức tối đa thì popup
  gửi có ô tick xác nhận (§27.3).

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
- **Màn chi tiết của Quản lý (M-06) dùng cùng cách** (chốt 02/10/2026, chỉ QLTT từ 04/10/2026): nhóm `Lưu nháp` / `Gửi đánh giá`
  (đang sửa bản đã gửi thì `Lưu thay đổi`) trong hàng điều hướng nổi ở giữa mép dưới khi chỗ cũ khuất
  (`.yer-mgr-actions.floating`); `.yer-md-actbar` giữ đúng kích thước chỗ cũ. Nút AI Summary và Phản hồi đã nhận không nổi.
  Trong Split View (`embedded-detail`) nhóm nút căn giữa khung nhúng. Code: `toolbar()`, `bindFloatingToolbar()` trong
  `assets/yer-manager-detail.js`.
