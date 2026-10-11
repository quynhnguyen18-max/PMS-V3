# Module Feedback

## Màn hình

| Vai | Màn | File chính |
|---|---|---|
| Nhân viên | E-04 Phản hồi của tôi | `E-04/index.html`, `E-04/feedback-model.js`, `E-04/request-question-ai.js` |
| Quản lý | M-04 Phản hồi của đội nhóm | `M-04/index.html`, `M-04/feedback-detail.html`, `M-04/request-detail.html` |
| HR | H-05 Quản lý yêu cầu phản hồi | `H-05/index.html`, `H-05/create-campaign.html`, `H-05/questionnaire-library.html` |
| HR | H-06 Chi tiết chương trình phản hồi | `H-06/index.html` |
| HR | H-07 Báo cáo phản hồi | `H-07/index.html` |

## File dùng chung trong module (sửa một chỗ, ảnh hưởng nhiều màn)

| File | Được dùng bởi |
|---|---|
| `H-05/feedback-program-model.js`, `H-05/feedback-program-data.js` | E-04, M-04 (index, feedback-detail), H-05 (index, create-campaign), H-06, H-07, M-06 |
| `H-05/feedback-report-view.js` | E-04, M-04 (index, feedback-detail), H-07, M-06 |
| `M-04/manager-request-model.js` | E-04, M-04 (index, request-detail) |
| `M-04/manager-thanks.js` | E-04, M-04 (index, feedback-detail), M-06 |
| `M-04/manager-feedback-data.js`, `M-04/manager-ai-summary.js` | M-04 (index, feedback-detail), M-06 |
| `M-04/manager-feedback-dialog.js` | M-06 (nút `Phản hồi đã nhận` của tab Giữa năm và Cuối năm). Dựng lại popup `#feedbackDialog` của M-04, CSS chỉ áp trong `#mgrFbDialog`. Sửa popup ở M-04 thì sửa cả file này |
| `H-05/questionnaire-library-*.js` | H-05 thư viện bộ câu hỏi, tạo yêu cầu |
| `assets/org-chain.js` | H-06 |

## Tài liệu

| File | Nội dung |
|---|---|
| `FEEDBACK_PLAN.md` | Kế hoạch và rule nghiệp vụ: vai trò, IA, danh sách màn, visibility, chu kỳ (§6b) |
| `UI-RULES.md` | Rule giao diện riêng Feedback, tách từ DS §19 (giữ số mục cũ) |
| `product/` | Tài liệu product: Building a Feedback Culture, 1-Page Alignment, Scope Cut & Rules Alignment |
| `reference/` | Mẫu xuất báo cáo (`Feedback-Export-Templates.xlsx`), popup mẫu `popup_fb_preview.html` |
| `files/` | UAT template, wording song ngữ, mẫu xuất thư viện bộ câu hỏi, template module đã review, mẫu kết quả HR chia sẻ |

Tài liệu gốc liên quan: `docs/shared/PMS_PRD_v1.md` §9 (Module 7 – Phản hồi cá nhân).

## Test

- `E-04/feedback-model.test.js`, `M-04/m04.test.js`, `H-05/h05.test.js`, `H-05/result-sharing.test.js` (chạy bằng `npm test`).
- Một số test đọc thẳng nội dung `DESIGN-SYSTEM.md`, `COMPONENTS.md`, `UI-RULES.md`, `FEEDBACK_PLAN.md`. Đổi câu chữ rule thì chạy lại test.
- `demo-feedback-response-lifecycle/demo.test.js` chưa nằm trong `npm test`.

## Demo và tài liệu truyền thông

- `demo-delight/`: các demo hiệu ứng.
  - `feedback-dau-an-demo.html` (sidebar `Demo Dấu ấn` ở E-04, E-05): nơi demo nhiều phương án giao diện cho nút "Dấu ấn của bạn" ("Dấu ấn của tôi" là cùng một nút), mỗi phương án một tab (`#pa1` đến `#pa6`). Tab ghi gọn `Opt N - Tên` (vd `Opt 2 - Quả cầu tem`), 6 tab chia theo độ dài chữ trên một hàng, không cuộn ngang; thiếu chỗ thì chữ cắt `...`, rê chuột xem đủ. Thêm phương án thì thay ô trống của tab đó, sân khấu riêng tách ra file `<ten>-stage.*`.
    - Phương án 1, Trải bài: `tarot-stage.css`, `tarot-stage.js`.
    - Phương án 2, Quả cầu tem: `stamp-stage.css`, `stamp-stage.js`, dựng theo chế độ "Cầu" của bản mẫu wowUI (giữ nguyên hình tem và 10 màu). Hành trình: lời chào, quả cầu xoay một vòng rồi mở lần lượt 6 tem metric (tổng phản hồi đã nhận; kết nối đáng nhớ top 3 chỉ tên; giá trị được ghi nhận tối đa 5 kèm lượt; điểm mạnh dạng gạch đầu dòng; phản hồi đã trao và số người nhận; tim cảm ơn nhận được và đã trao), lời cảm ơn, poster. Lời chào và lời cảm ơn nằm ngoài quả cầu. Poster có trích lời phản hồi, không ghi tên người viết. Tải được từng tem và poster. Xem xong thì tự xoay quả cầu, mở lại tem bất kỳ.
      - Góp ý 11/10/2026: tên mặt trước tem là cụm có nghĩa (Lời ghi nhận, Người đồng hành, Giá trị tỏa sáng, Điều được trân trọng, Bạn đã trao đi, Những trái tim). Tem có hai con số (đã nhận và số đồng nghiệp; đã trao và số người nhận; tim nhận và tim trao) đặt hai số ngang hàng trên polaroid; trang phải không nhắc lại số, chỉ mang thông điệp (feedforward, góc nhìn người cho phản hồi, văn hóa cảm ơn). Tem giá trị có mascot core value từng dòng. Quả cầu lệch nửa bước để không tem nào nằm ở cực (đứng yên khi xoay). Màn chào hiện đủ 6 tem; màn cảm ơn dùng mascot cầm tim `assets/mascot/heart.png`, thông điệp về văn hóa phản hồi liên tục ở MoMo.
      - Poster kể chuyện 3 phần, đọc từ trên xuống: Bạn trong mắt đồng nghiệp (giá trị kèm mascot core value, điểm mạnh, 2 lời trích không ghi tên), Bạn đã lan tỏa (4 con số ngang hàng), Cảm ơn những người đồng hành (tên dạng "Tên Họ", bỏ tên đệm, vd Hùng Lê; luật `posterName()` trong `dau-an-model.js`).
    - Phương án 3, Moni kể chuyện: `moni-stage.css`, `moni-stage.js`. Moni (mascot `assets/mascot/`) là bạn đồng hành dẫn chuyện: lời chào (Moni đi vào), 6 màn metric kể liền một mạch (Moni nói từng câu trong bong bóng thoại, nói xong thì hình minh hoạ hiện ra, Moni đổi tư thế và nhảy mừng; người xem chỉ bấm Tiếp, Quay lại), lời cảm ơn, poster có Moni dùng khung 3 phần như phương án 2. Cùng 6 metric và số liệu với phương án 2. Tải được từng màn metric và poster. Moni có 9 biểu cảm trong `assets/mascot/` (thêm `walk-bubble.png` đi thổi bong bóng, `shy-love.png` cười e thẹn kèm tim, 11/10/2026). Mỗi màn metric dùng 3 biểu cảm: một cho mỗi câu Moni nói, một lúc hình minh hoạ hiện ra; cả hành trình dùng đủ 9 biểu cảm.
    - Phương án 4, Sổ lật: `flip-stage.css`, `flip-stage.js`. Sổ lò xo kiểu flipchart, lật từ dưới lên bằng nút Tiếp, Quay lại (chị chốt 11/10/2026): bìa là lời chào, mỗi trang một metric (6 trang), trang cuối là lời cảm ơn; Đóng sổ thì các trang rơi về, sổ thu lại và poster hiện ra. Hồng MoMo trên giấy kem kẻ ô, Moni mỗi trang một biểu cảm, hoạ tiết vẽ kiểu bút chì (bộ lọc SVG: nét run, vân hạt, nét đi hai lần) tự vẽ ra khi trang mở. Tiêu đề trang metric dùng MoMo Trust Display vì MoMo Signature thiếu một số chữ tiếng Việt (ữ, ồ, ậ…); Signature chỉ dùng cho "Chào Tú!", "Cảm ơn Tú!". Poster dùng khung 3 phần như phương án 2, trình bày như một trang sổ. Tải được từng trang và poster.
    - Phương án 5, Hộp quà bí mật: `gift-stage.css`, `gift-stage.js` (chị chốt 11/10/2026). Feedback là món quà: hộp quà lớn có thẻ "Gửi Tú"; bấm mở thì hộp rung, nắp bay, tia sáng vàng và bụi lấp lánh toả ra như rương kho báu. Mỗi lần Tiếp, một báu vật bay lên từ hộp và thẻ giấy da mở ra metric: cuộn thư (phản hồi đã nhận), la bàn (kết nối đáng nhớ), vương miện (giá trị), chìa khóa (điểm mạnh), chai thư (phản hồi trao đi), đồng xu tim (tim cảm ơn); báu vật đã nhận xếp vào túi đồ ở thanh dưới. Hết 6 báu vật là lời cảm ơn (kho báu đầy) rồi poster kiểu bản đồ kho báu, khung 3 phần đã chốt. Thuyền trưởng Moni dẫn đường (không đội mũ); cụm Moni và hộp quà neo giữa cột trái, thẳng hàng với thẻ giấy da. Tải được từng báu vật và poster.
    - Opt 6, Lễ vinh danh: `award-stage.css`, `award-stage.js` (chị chốt 11/10/2026). Sân khấu trao giải "Đại sứ văn hóa phản hồi": mở màn rèm nhung kéo ra, đèn spotlight quét, khán giả vỗ tay; MC Moni đứng sau micro. Phần nhận, mỗi metric một giải hạ xuống bục vinh danh trong ánh đèn: Cúp (phản hồi đã nhận), Hoa (kết nối đáng nhớ), Huy chương (giá trị), Bằng khen (điểm mạnh). Phần cho đi: phản hồi đã trao và tim cảm ơn, máy bay giấy và tim bay từ bục ra khán giả. Kết: pháo hoa, 4 giải xếp trên bục, lời động viên tiếp tục lan tỏa; poster dạng giấy chứng nhận theo khung 3 phần đã chốt. Tải được từng giải và giấy chứng nhận. Chữ vàng dùng một màu (html2canvas không xuất được chữ tô gradient).
  - `pencil.js`: bộ vẽ hoạ tiết bút chì dùng chung cho phương án 4 và 5 (nét run, vân hạt, nét đi hai lần; thư viện hoạ tiết, báu vật, hộp quà). Nạp trước `flip-stage.js`, `gift-stage.js`.
  - `dau-an-model.js`: dữ liệu (feed của Nguyễn Văn Tú) và luật tính dùng chung cho mọi phương án và `feedback-sphere-demo.html`. Nạp trước `tarot-stage.js`, `stamp-stage.js`. Sửa luật ở đây thì rà cả ba sân khấu.
  - `feedback-sphere-demo.html` (quả cầu bài tarot, dùng lại bộ bài của `tarot-stage.js`), `feedback-ai-coach-demo.html`: demo lẻ, chưa nằm trong trang phương án.
  - Màn `New Demo Feedback` (`feedback-delight-demo.html`) đã xóa ngày 11/10/2026.
- `demo-feedback-response-lifecycle/`: demo vòng đời phản hồi, có `REQUIREMENTS.md`.
- Email truyền thông pilot đã chuyển ra folder cha (`../feedback-pilot-email/`) để lưu trữ, không nằm trong repo.
- Tool: `tools/build_feedback_uat_template.py`, `tools/build_questionnaire_library_export.mjs` (xuất ra `files/`).

## Trạng thái rà soát

- [x] **Giai đoạn 2 (xong 27/09/2026):** đã đối chiếu 40 commit Feedback từ 07/09 đến 26/09. Nguyên tắc: code là bản đúng, tài liệu sửa theo code. Rule nghiệp vụ ghi vào `FEEDBACK_PLAN.md` (§4b đến §4g, từ ngữ đã chốt, trạng thái, phạm vi). Rule giao diện ghi vào `UI-RULES.md` (sửa 10, 15b, 15c; thêm 15d đến 15h, 19a đến 19c). Rule chung ghi vào `DESIGN-SYSTEM.md` (§19 rule 20 đến 23, bảng mã §20.2 thêm `hr-closed` và bản ngắn). Còn treo: chữ phụ dải ngày chu kỳ dùng `--z500` (trái DS §19 rule 6); bốn test `todo` về H-06 trong `H-05/h05.test.js`: hai test cho tính năng đã gỡ (khối "Cần nhắc", badge core value) và hai chỗ H-06 đang trái rule (`overviewStatus()` tự tính lại trạng thái, trái DS §20.1; nút nhắc gọn dùng `title=` thay cho `.pms-tooltip`).
- [x] **Giai đoạn 3 (xong 27/09/2026):** tokens gộp vào `assets/tokens.css`, mọi màn nạp file này và chỉ giữ biến bố cục riêng; `assets/tokens.test.js` chặn khai lại token, tên biến riêng, icon không có trong Boxicons 2.1.4 và middot. Quyết định chung ghi ở `DESIGN-SYSTEM.md` §2, §19 rule 1, 6, 20, 24, 25. Riêng Feedback: màu trạng thái tự chế ở M-04, H-05, H-06, H-07, `request-detail` quy về `--warn`, `--err`, `--ok` (vàng nay là `#d97706` theo COMPONENTS §8.2); `create-campaign` bỏ hồng `#b0006d`, bo góc 9px và màu chàm `--template`; AI Summary dùng mascot thay `bx-sparkles`; E-04 dùng `bxs-magic-wand` thay `bx-magic`, bỏ middot trong giờ trả lời (model nhận cả ` - ` và `·` cũ). Hoạ tiết thư, thiệp của E-04 là ngoại lệ màu.
