/* ═══════════════════════════════════════════════════════════
   YER 2026 — dữ liệu bổ sung cho Đánh giá cuối năm
   Nguyên tắc: KHÔNG sửa assets/employees-data.js.
   File này chỉ THÊM: nhân sự mới (y*), sự kiện YER, kịch bản demo.
   Spec: YER-SPEC.md
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. Timeline kỳ đánh giá ────────────────────────────── */
  /* ── Người thực hiện từng bước ──
     Dải quy trình hiện domain cụ thể của từng vai để người xem biết đang chờ ai.
     Quản lý trực tiếp và cấp 2 lấy từ chính hồ sơ nhân viên; ba vai còn lại dùng chung
     cho toàn công ty nên đặt ở đây. Bước Công bố kết quả KHÔNG hiện domain. */
  window.PMS_YER_ACTORS = {
    lm:  { name: 'Lê Thị Thanh',      login: 'thanh.le',    ini: 'LT' },
    lm2: { name: 'Nguyễn Hải Đăng',  login: 'dang.nguyen', ini: 'NĐ' },
    hod: { name: 'Phạm Quốc Anh',     login: 'anh.pham',    ini: 'PA' },
    tr:  { name: 'Vũ Minh Châu',      login: 'chau.vu',     ini: 'VC' },
    hrd: { name: 'Đặng Thu Hà',      login: 'ha.dang',     ini: 'ĐH' }
  };

  window.PMS_YER_TIMELINE = {
    cycle: 'YER 2026',
    cycleLabel: { vi: 'Đánh giá cuối năm 2026', en: 'Year-End Review 2026' },
    mgrCutoff: '2026-12-31',       // sau ngày này LM đang phụ trách là người đánh giá
    onboardCutoff: '2026-10-01',   // onboard sau ngày này không thuộc kỳ cuối năm
    myrOnboardCutoff: '2026-04-01', // onboard sau ngày này không thuộc kỳ giữa năm
    steps: [
      { key: 'self',    from: '2027-01-05', to: '2027-01-18', vi: 'Tự đánh giá',            en: 'Self Assessment' },
      { key: 'lm',      from: '2027-01-19', to: '2027-02-01', vi: 'Quản lý trực tiếp',      en: 'Line Manager' },
      { key: 'lm2',     from: '2027-02-02', to: '2027-02-15', vi: 'Quản lý cấp 2',          en: 'Second-level Manager' },
      { key: 'hod',     from: '2027-02-16', to: '2027-03-01', vi: 'Trưởng đơn vị',          en: 'Head of Department' },
      { key: 'tr',      from: '2027-03-02', to: '2027-03-15', vi: 'Total Reward tải điểm',  en: 'Total Reward Upload' },
      { key: 'hrd',     from: '2027-03-16', to: '2027-03-29', vi: 'HR Director duyệt',      en: 'HR Director Approval' },
      { key: 'publish', from: '2027-03-30', to: '2027-03-30', vi: 'Công bố kết quả',        en: 'Publish Results' }
    ]
  };

  /* ── 2. Thang điểm ──────────────────────────────────────── */
  window.PMS_RATING_SCALE = [
    { v: 1, vi: 'Không đạt yêu cầu', en: 'Does Not Meet Expectations',
      dvi: 'Không đáp ứng kỳ vọng hiệu quả công việc ở hầu hết các mục tiêu hoặc tiêu chuẩn yêu cầu. Cần có sự cải thiện ngay lập tức và duy trì liên tục.',
      den: 'Does not meet performance expectations on most goals or required standards. Immediate and sustained improvement is needed.' },
    { v: 2, vi: 'Hoàn thành một phần', en: 'Partially Meet Expectations',
      dvi: 'Chưa đáp ứng nhất quán các kỳ vọng về hiệu quả công việc. Đạt được một số mục tiêu nhưng chưa hoàn thành các mục tiêu khác. Cần cải thiện thêm ở những lĩnh vực cụ thể để đáp ứng đầy đủ kỳ vọng về hiệu quả công việc. Cần thay đổi một số hành vi để phù hợp với Giá trị cốt lõi.',
      den: 'Inconsistently meets performance expectations. Achieves some goals but falls short in others. Further improvement in specific areas is needed to fully meet performance expectations. Behaviors also need refining.' },
    { v: 3, vi: 'Hoàn thành kỳ vọng', en: 'Meet Expectations',
      dvi: 'Đáp ứng một cách ổn định và nhất quán tất cả các kỳ vọng về hiệu quả công việc trong chất lượng, hiệu suất và tiến độ, với các mục tiêu trọng yếu được hoàn thành. Thể hiện tốt các hành vi theo Giá trị cốt lõi.',
      den: 'Consistently meets all performance expectations in quality of work, efficiency, and timeliness, with critical goals achieved. Behaviors reflect core values.' },
    { v: 4, vi: 'Hoàn thành trên mức kỳ vọng', en: 'Exceed Expectations',
      dvi: 'Vượt trên kỳ vọng về hiệu quả công việc thông qua việc liên tục hoàn thành công việc chất lượng cao và đạt thành tích vượt chuẩn, đặc biệt ở các mục tiêu trọng yếu, góp phần đáng kể vào thành công của đội nhóm và tổ chức. Thể hiện rõ nét và nhất quán các hành vi theo Giá trị cốt lõi.',
      den: 'Exceeds job expectations through high-quality work and achievements that surpass standards, especially in critical goals, making significant contributions to team and organizational success. Demonstrates strong and consistent behaviors that reflect the Company’s core values.' },
    { v: 5, vi: 'Hoàn thành vượt xa kỳ vọng', en: 'Exceptionally Exceed Expectations',
      dvi: 'Đem lại kết quả xuất sắc vượt xa kỳ vọng trên mọi phương diện của vị trí, và góp phần thúc đẩy thành công của đội nhóm cũng như tổ chức thông qua các thành tựu quan trọng vượt ngoài phạm vi vai trò đảm nhiệm. Là hình mẫu thể hiện mẫu mực các Giá trị Cốt lõi của tổ chức, đồng thời truyền cảm hứng cho đồng nghiệp.',
      den: 'Delivers exceptional results that far exceed expectations across all dimensions of the position, and contributes to team and organizational success through major accomplishments beyond the scope of the role. Serve as a role model exemplifying the organization’s core values while inspiring colleagues.' }
  ];

  /* ── 3. Nhân sự thêm cho các tình huống YER ─────────────── */
  var LM = { name: 'Lê Thị Thanh', login: 'thanh.le', ini: 'LT' };
  var LM2 = { name: 'Mai Thị Hằng', login: 'hang.mai', ini: 'MH' };

  var NEW_EMPLOYEES = [
    { id: 'y1', name: 'Ngô Thanh Tùng', login: 'tung.ngo', ini: 'NT', div: 'ITC', dept: 'Backend', team: 'Payment', pos: 'Software Engineer', lvl: 'lm1', goals: [
      { id: 'yg1', type: 'what', title: 'Xây dựng service đối soát giao dịch liên ngân hàng', result: 'Đối soát tự động 100% giao dịch liên ngân hàng trong ngày T+1, sai lệch dưới 0.01%.', status: 'approved', s: '01/01', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg2', type: 'dev', title: 'Hoàn thành khóa Distributed Systems nội bộ', result: 'Hoàn thành 8/8 buổi và bài tập cuối khóa đạt trên 80%.', status: 'draft', s: '01/02', e: '30/11', prio: null, comments: [] }
    ] },
    { id: 'y2', name: 'Đỗ Thị Ngọc Hà', login: 'ha.do', ini: 'DH', div: 'ITC', dept: 'QA', team: 'Automation', pos: 'QA Engineer', lvl: 'lm1', maternity: true, goals: [
      { id: 'yg3', type: 'what', title: 'Chuẩn hóa bộ test case cho luồng nạp rút', result: 'Bộ test case bao phủ 90% luồng nạp rút, review và ký duyệt bởi trưởng nhóm QA.', status: 'approved', s: '01/01', e: '30/09', prio: 'h', comments: [] },
      { id: 'yg4', type: 'dev', title: 'Học và áp dụng Playwright cho automation', result: 'Chuyển đổi 30 test case trọng yếu sang Playwright, chạy ổn định trong CI.', status: 'approved', s: '01/01', e: '31/08', prio: null, comments: [] }
    ] },
    { id: 'y3', name: 'Trịnh Bảo Long', login: 'long.trinh', ini: 'TL', div: 'ITC', dept: 'Frontend', team: 'Growth', pos: 'Frontend Engineer', lvl: 'lm1', goals: [
      { id: 'yg5', type: 'what', title: 'Tối ưu trang landing chiến dịch: tăng conversion 20%', result: 'Conversion rate tăng từ 3.1% lên 3.8% đo qua A/B test 45 ngày.', status: 'approved', s: '01/01', e: '31/10', prio: 'h', comments: [] },
      { id: 'yg6', type: 'what', title: 'Chuẩn hóa component chiến dịch dùng lại được', result: '12 component tái sử dụng có tài liệu, được 3 team khác áp dụng.', status: 'approved', s: '01/03', e: '31/12', prio: 'm', comments: [] },
      { id: 'yg7', type: 'dev', title: 'Nâng năng lực performance profiling', result: 'Hoàn thành 4 case study tối ưu và chia sẻ nội bộ 1 buổi.', status: 'approved', s: '01/01', e: '31/12', prio: null, comments: [] }
    ] },
    { id: 'y4', name: 'Phùng Gia Bảo', login: 'bao.phung', ini: 'PB', div: 'ITC', dept: 'Data', team: 'Analytics', pos: 'Data Analyst', lvl: 'lm1', goals: [
      { id: 'yg8', type: 'what', title: 'Xây dashboard theo dõi hành vi người dùng mới', result: 'Dashboard phục vụ 5 team sản phẩm, cập nhật hằng ngày, độ trễ dưới 2 giờ.', status: 'approved', s: '01/01', e: '30/09', prio: 'h', comments: [] },
      { id: 'yg9', type: 'dev', title: 'Đạt chứng chỉ dbt Analytics Engineering', result: 'Thi đậu chứng chỉ trước 30/11/2026 và áp dụng vào ít nhất 2 pipeline.', status: 'approved', s: '01/01', e: '30/11', prio: null, comments: [] }
    ] },
    { id: 'y5', name: 'Lâm Tuyết Nhi', login: 'nhi.lam', ini: 'LN', div: 'PM', dept: 'Product', team: 'Merchant', pos: 'Product Owner', lvl: 'lm1', goals: [
      { id: 'yg10', type: 'what', title: 'Ra mắt gói dịch vụ cho tiểu thương', result: 'Go-live Q3/2026, đạt 8.000 merchant kích hoạt trong 60 ngày đầu.', status: 'approved', s: '01/01', e: '30/09', prio: 'h', comments: [] },
      { id: 'yg11', type: 'dev', title: 'Nâng cao kỹ năng nghiên cứu người dùng', result: 'Chủ trì 6 buổi phỏng vấn merchant và tổng hợp báo cáo insight hằng quý.', status: 'approved', s: '01/01', e: '31/12', prio: null, comments: [] }
    ] },
    { id: 'y6', name: 'Hồ Đăng Khoa', login: 'khoa.ho', ini: 'HK', div: 'ITC', dept: 'DevOps', team: 'Platform', pos: 'SRE', lvl: 'lm1', resignFrom: '2027-02-15', goals: [
      { id: 'yg12', type: 'what', title: 'Giảm thời gian khôi phục sự cố xuống dưới 20 phút', result: 'MTTR trung bình dưới 20 phút trong 6 tháng liên tiếp, có runbook cho 20 sự cố phổ biến.', status: 'approved', s: '01/01', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg13', type: 'dev', title: 'Hoàn thành chứng chỉ CKA', result: 'Thi đậu CKA trước 31/10/2026.', status: 'approved', s: '01/01', e: '31/10', prio: null, comments: [] }
    ] },
    { id: 'y7', name: 'Vương Khánh Chi', login: 'chi.vuong', ini: 'VC', div: 'ITC', dept: 'Frontend', team: 'Core', pos: 'Frontend Engineer', lvl: 'lm1', goals: [
      { id: 'yg14', type: 'what', title: 'Tham gia dự án chuyển đổi design system', result: 'Hoàn thành 15 màn hình theo design system mới trong quý đầu tiên.', status: 'approved', s: '01/11', e: '31/12', prio: 'm', comments: [] }
    ] },
    { id: 'y8', name: 'Chu Minh Khang', login: 'khang.chu', ini: 'CK', div: 'ITC', dept: 'Backend', team: 'Core', pos: 'Senior Software Engineer', lvl: 'lm1', goals: [
      { id: 'yg15', type: 'what', title: 'Tách module ví điện tử thành service độc lập', result: 'Service chạy độc lập, throughput 5.000 TPS, không phát sinh sự cố P1 trong 60 ngày.', status: 'approved', s: '01/01', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg16', type: 'what', title: 'Chuẩn hóa observability cho nhóm Core', result: '100% service có trace, log, metric theo chuẩn chung.', status: 'approved', s: '01/02', e: '31/10', prio: 'm', comments: [] },
      { id: 'yg17', type: 'dev', title: 'Kèm cặp 2 kỹ sư mới', result: '2 kỹ sư hoàn thành lộ trình 6 tháng và tự chủ nhận task mức trung bình.', status: 'approved', s: '01/01', e: '31/12', prio: null, comments: [] }
    ] },
    { id: 'y9', name: 'Nguyễn Mai Anh', login: 'anh.nguyen', ini: 'NA', div: 'OPS', dept: 'Operations', team: 'Service Quality', pos: 'Operations Specialist', lvl: 'lm1', goals: [
      { id: 'yg30', type: 'what', title: 'Giảm tỷ lệ yêu cầu xử lý lại của khách hàng', result: 'Tỷ lệ xử lý lại dưới 4% trong quý IV/2026.', status: 'approved', s: '01/01', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg31', type: 'dev', title: 'Nâng cao kỹ năng phân tích nguyên nhân gốc', result: 'Hoàn thành khóa RCA và chủ trì 3 buổi phân tích sự cố.', status: 'approved', s: '01/03', e: '30/11', prio: null, comments: [] }
    ] },
    { id: 'y10', name: 'Trần Quốc Huy', login: 'huy.tran', ini: 'TH', div: 'ITC', dept: 'QA', team: 'Platform', pos: 'QA Engineer', lvl: 'lm1', goals: [
      { id: 'yg32', type: 'what', title: 'Tự động hóa kiểm thử hồi quy nền tảng', result: 'Tự động hóa 80% bộ regression và tích hợp vào CI.', status: 'approved', s: '01/01', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg33', type: 'dev', title: 'Hoàn thành lộ trình kiểm thử hiệu năng', result: 'Hoàn thành khóa học và áp dụng cho 2 luồng trọng yếu.', status: 'draft', s: '01/04', e: '30/11', prio: null, comments: [] }
    ] },
    { id: 'y11', name: 'Lê Minh Châu', login: 'chau.le', ini: 'LC', div: 'PM', dept: 'Product', team: 'New Initiatives', pos: 'Business Analyst', lvl: 'lm1', goals: [
    ] },
    { id: 'y12', name: 'Phạm Thu Trang', login: 'trang.pham', ini: 'PT', div: 'OPS', dept: 'Operations', team: 'Service Quality', pos: 'Senior Operations Specialist', lvl: 'lm1', goals: [
    ] },
    // y13, y14 — thiếu Mục tiêu công việc đã duyệt (WHAT còn ở bản nháp), đã có Mục tiêu phát triển.
    // Tách thành hai người để demo được cả hai thời điểm: còn hạn và quá hạn tự đánh giá.
    { id: 'y13', name: 'Bùi Hải Yến', login: 'yen.bui', ini: 'BY', div: 'PM', dept: 'Product', team: 'Lending', pos: 'Business Analyst', lvl: 'lm1', goals: [
      { id: 'yg34', type: 'what', title: 'Chuẩn hóa quy trình thẩm định hồ sơ vay', result: 'Rút ngắn thời gian thẩm định trung bình còn 2 giờ làm việc.', status: 'draft', s: '01/02', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg35', type: 'dev', title: 'Hoàn thành khóa phân tích rủi ro tín dụng', result: 'Hoàn thành khóa học và áp dụng vào 2 bộ tiêu chí thẩm định.', status: 'approved', s: '01/03', e: '30/11', prio: null, comments: [] }
    ] },
    // y15 — onboard 15/06/2026: sau hạn của kỳ giữa năm (01/04) nhưng trước hạn của
    // kỳ cuối năm (01/10), nên chỉ tham gia kỳ cuối năm.
    { id: 'y15', name: 'Võ Nhật Minh', login: 'minh.vo', ini: 'VM', div: 'ITC', dept: 'Backend', team: 'Growth', pos: 'Software Engineer', lvl: 'lm1', goals: [
      { id: 'yg38', type: 'what', title: 'Xây dựng API thử nghiệm tính năng giới thiệu bạn bè', result: 'API phục vụ được 3 chiến dịch, độ trễ P95 dưới 150ms.', status: 'approved', s: '01/07', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg39', type: 'dev', title: 'Hoàn thành lộ trình onboarding kỹ thuật', result: 'Hoàn thành 6 module và tự nhận task mức trung bình sau 3 tháng.', status: 'approved', s: '01/07', e: '31/12', prio: null, comments: [] }
    ] },
    { id: 'y14', name: 'Đinh Gia Hân', login: 'han.dinh', ini: 'GH', div: 'OPS', dept: 'Operations', team: 'Merchant Support', pos: 'Operations Specialist', lvl: 'lm1', goals: [
      { id: 'yg36', type: 'what', title: 'Giảm thời gian phản hồi yêu cầu của đối tác', result: 'Thời gian phản hồi trung bình dưới 3 giờ làm việc.', status: 'draft', s: '01/01', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg37', type: 'dev', title: 'Nâng cao kỹ năng vận hành công cụ hỗ trợ đối tác', result: 'Thành thạo và hướng dẫn lại cho 3 thành viên trong nhóm.', status: 'approved', s: '01/04', e: '30/11', prio: null, comments: [] }
    ] }
  ];

  // Gắn quản lý mặc định cho nhân sự mới (báo cáo trực tiếp Lê Thị Thanh)
  NEW_EMPLOYEES.forEach(function (e) {
    if (!e.mgr) e.mgr = { name: LM.name, login: LM.login, ini: LM.ini };
    if (!e.mgr2) e.mgr2 = { name: LM2.name, login: LM2.login, ini: LM2.ini };
  });

  window.PMS_EMPLOYEES = (window.PMS_EMPLOYEES || []).concat(NEW_EMPLOYEES);

  /* ── 3b. Mục tiêu phát triển bổ sung ────────────────────
     Điều kiện tham gia YER là có tối thiểu 1 mục tiêu công việc VÀ
     1 mục tiêu phát triển đã duyệt. Một số nhân sự trong seed gốc chưa có
     mục tiêu phát triển được duyệt, bổ sung tại đây.
     Chỉ trang YER nạp file này nên màn Mục tiêu và MYR cũ không đổi.
     Cố ý KHÔNG bổ sung cho: y1 (tình huống thiếu mục tiêu),
     e4 (thai sản - Quản lý phải import), y7 (ngoài kỳ đánh giá).
     y13 và y14 đã có sẵn mục tiêu phát triển được duyệt, cái thiếu là mục tiêu công việc.           */
  var SUPPLEMENT_GOALS = {
    e3:  { id: 'yg20', type: 'dev', title: 'Hoàn thành lộ trình Data Engineering nội bộ', result: 'Hoàn thành 7/7 module và nộp capstone dùng dữ liệu thực của nhóm.', status: 'approved', s: '01/01', e: '30/09', prio: null, comments: [] },
    e6:  { id: 'yg21', type: 'dev', title: 'Nâng cao năng lực kiến trúc frontend quy mô lớn', result: 'Hoàn thành 3 case study tái cấu trúc và trình bày nội bộ 1 buổi.', status: 'approved', s: '01/01', e: '31/12', prio: null, comments: [] },
    e7:  { id: 'yg22', type: 'dev', title: 'Chứng chỉ Terraform Associate và áp dụng thực tế', result: 'Thi đậu trước 31/10/2026 và chuẩn hóa 2 module hạ tầng theo chuẩn mới.', status: 'approved', s: '01/01', e: '31/10', prio: null, comments: [] },
    e8:  { id: 'yg23', type: 'dev', title: 'Phát triển năng lực dẫn dắt nhóm sản phẩm', result: 'Hoàn thành chương trình quản lý cấp trung và kèm cặp 1 PM mới trong 6 tháng.', status: 'approved', s: '01/01', e: '31/12', prio: null, comments: [] },
    e9:  { id: 'yg24', type: 'dev', title: 'Nâng cao chuyên môn cloud security', result: 'Hoàn thành khóa cloud security nâng cao và áp dụng vào chuẩn bảo mật nội bộ.', status: 'approved', s: '01/01', e: '30/11', prio: null, comments: [] },
    e10: { id: 'yg25', type: 'dev', title: 'Xây dựng chương trình chia sẻ kiến thức ML nội bộ', result: 'Tổ chức 4 buổi tech talk và biên soạn tài liệu onboarding cho kỹ sư ML mới.', status: 'approved', s: '01/01', e: '31/12', prio: null, comments: [] },
    e11: { id: 'yg26', type: 'dev', title: 'Chuẩn hóa năng lực vận hành hệ thống quy mô lớn', result: 'Hoàn thành chứng chỉ CKS và xây dựng bộ runbook cho 15 sự cố hạ tầng phổ biến.', status: 'approved', s: '01/01', e: '31/12', prio: null, comments: [] },
    e14: { id: 'yg27', type: 'dev', title: 'Hoàn thiện năng lực triển khai mô hình lên production', result: 'Đưa 2 mô hình lên production với quy trình theo dõi chất lượng đầy đủ.', status: 'approved', s: '01/01', e: '31/12', prio: null, comments: [] }
  };
  Object.keys(SUPPLEMENT_GOALS).forEach(function (id) {
    var emp = window.PMS_EMPLOYEES.filter(function (e) { return e.id === id; })[0];
    if (!emp) return;
    emp.goals = (emp.goals || []).slice();
    if (!emp.goals.some(function (g) { return g.id === SUPPLEMENT_GOALS[id].id; })) {
      emp.goals.push(SUPPLEMENT_GOALS[id]);
    }
  });

  /* ── 4. Hồ sơ hành chính phục vụ điều kiện tham gia ─────── */
  // hired: ngày onboard. resignFrom: ngày nghỉ việc có hiệu lực.
  window.PMS_YER_HR = {
    e1: { hired: '2019-03-04' }, e2: { hired: '2020-06-15' },
    e3: { hired: '2018-01-08', resignFrom: '2026-11-30' },
    e4: { hired: '2019-09-02', maternityFrom: '2026-11-01', maternityTo: '2027-05-01' },
    e5: { hired: '2017-05-22' }, e6: { hired: '2021-02-01' }, e7: { hired: '2018-08-13' },
    e8: { hired: '2016-04-11' }, e9: { hired: '2019-01-07' }, e10: { hired: '2020-03-16' },
    e11: { hired: '2015-10-05' }, e12: { hired: '2018-11-19' }, e13: { hired: '2017-07-03' },
    e14: { hired: '2021-08-09' }, e15: { hired: '2019-12-02' }, e16: { hired: '2020-01-13' },
    y1: { hired: '2022-05-09' }, y2: { hired: '2021-03-15', maternityFrom: '2026-12-01', maternityTo: '2027-06-01' },
    y3: { hired: '2020-09-01' }, y4: { hired: '2022-01-10' }, y5: { hired: '2019-06-24' },
    y6: { hired: '2018-02-05', resignFrom: '2027-02-15' },
    y7: { hired: '2026-10-15' },
    y8: { hired: '2016-09-12' },
    y9: { hired: '2020-04-06' }, y10: { hired: '2021-07-12' }, y11: { hired: '2022-03-21' },
    y12: { hired: '2020-08-17' },
    y13: { hired: '2021-11-08' }, y14: { hired: '2019-05-20' },
    y15: { hired: '2026-06-15' }
  };

  /* ── 4b. Dữ liệu kỳ giữa năm cho nhân sự mới ────────────
     Chỉ thêm cho y*, không đụng dữ liệu MYR của 16 nhân sự cũ
     để màn Mục tiêu và MYR đã duyệt giữ nguyên.
     y1 (thiếu mục tiêu) và y7 (ngoài kỳ) cố ý không có dữ liệu MYR.   */
  var MYR_NEW = {
    y2: { submitted: true,  nv: 3.5, lm1: 3.5, lm2: 3.5, hod: null, final: 3.5 },
    // Luu snapshot nguoi chiu trach nhiem danh gia tai chinh ky MYR. Khong suy tu
    // emp.mgr vi quan ly hien tai co the da thay doi truoc khi mo lai ket qua.
    y3: { submitted: true,  nv: 4,   lm1: 3.5, lm2: 4,   hod: null, final: 4,
      lm1By: { name: 'Nguyễn Hải Đăng', login: 'dang.nguyen', ini: 'ND' } },
    y4: { submitted: true,  nv: 3.5, lm1: 3.5, lm2: null, hod: null, final: 3.5 },
    y5: { submitted: true,  nv: 4,   lm1: 4,   lm2: 4,   hod: null, final: 4 },
    y6: { submitted: true,  nv: 3.5, lm1: 3.5, lm2: null, hod: null, final: 3.5 },
    y8: { submitted: true,  nv: 4.5, lm1: 4.5, lm2: 4,   hod: null, final: 4.5 }
  };
  var MYR_SELF_NEW = {
    y2: { comments: { what: 'Bộ test case luồng nạp rút hoàn thành 60% trong nửa đầu năm.', dev: 'Đã bắt đầu chuyển đổi test case sang Playwright.', how: 'Phối hợp tốt với nhóm phát triển khi xử lý lỗi.' }, overall: { score: 3.5, comment: 'Nửa đầu năm tôi bám sát kế hoạch kiểm thử đã thống nhất.' } },
    y3: { comments: { what: 'Conversion chiến dịch tăng từ 3.1% lên 3.4% sau hai đợt thử nghiệm.', dev: 'Hoàn thành 2 case study về tối ưu hiệu năng.', how: 'Chủ động đề xuất cải tiến cho nhóm marketing.' }, overall: { score: 4, comment: 'Các chỉ số chiến dịch cải thiện đều trong nửa đầu năm.' } },
    y4: { comments: { what: 'Dashboard hành vi người dùng đã chạy thử với 2 nhóm sản phẩm.', dev: 'Đang học chương trình dbt theo lộ trình.', how: 'Hỗ trợ nhanh khi các nhóm cần số liệu gấp.' }, overall: { score: 3.5, comment: 'Tiến độ đúng kế hoạch, phần mở rộng sẽ làm trong nửa cuối năm.' } },
    y5: { comments: { what: 'Gói dịch vụ tiểu thương hoàn thành giai đoạn thử nghiệm với 500 merchant.', dev: 'Đã thực hiện 3 buổi phỏng vấn merchant.', how: 'Luôn lấy nhu cầu người dùng làm cơ sở quyết định.' }, overall: { score: 4, comment: 'Giai đoạn thử nghiệm cho kết quả tốt hơn kỳ vọng ban đầu.' } },
    y6: { comments: { what: 'MTTR giảm từ 35 phút xuống 24 phút trong nửa đầu năm.', dev: 'Đang ôn luyện chứng chỉ CKA.', how: 'Chia sẻ runbook cho các nhóm vận hành khác.' }, overall: { score: 3.5, comment: 'Chỉ số vận hành cải thiện rõ so với cùng kỳ.' } },
    y8: { comments: { what: 'Hoàn thành thiết kế và giai đoạn 1 của việc tách service ví.', dev: 'Hai kỹ sư mới đã qua giai đoạn onboarding.', how: 'Chia sẻ kiến thức đều đặn trong nhóm Core.' }, overall: { score: 4.5, comment: 'Giai đoạn chuẩn bị được làm kỹ, rủi ro kỹ thuật đã được kiểm soát.' } }
  };
  var MYR_LM_NEW = {
    y2: { comments: { what: 'Kế hoạch kiểm thử bám sát tiến độ dự án.', dev: 'Việc chuyển sang Playwright đi đúng hướng.', how: 'Phối hợp tốt và chủ động báo rủi ro sớm.' }, overall: { score: 3.5, comment: 'Kết quả nửa đầu năm đạt yêu cầu đề ra.' } },
    y3: { comments: { what: 'Kết quả chiến dịch cải thiện nhưng chưa đạt mục tiêu cả năm.', dev: 'Có đầu tư nghiêm túc vào chuyên môn.', how: 'Chủ động và hợp tác tốt.' }, overall: { score: 3.5, comment: 'Đi đúng hướng, cần tăng tốc ở nửa cuối năm.' } },
    y4: { comments: { what: 'Dashboard đáp ứng nhu cầu cơ bản của các nhóm.', dev: 'Cần hoàn thành chứng chỉ đúng hạn.', how: 'Hỗ trợ đồng nghiệp nhiệt tình.' }, overall: { score: 3.5, comment: 'Kết quả ổn định, đúng kế hoạch.' } },
    y5: { comments: { what: 'Giai đoạn thử nghiệm cho tín hiệu tốt về nhu cầu thị trường.', dev: 'Nghiên cứu người dùng có chất lượng.', how: 'Tư duy sản phẩm rõ ràng.' }, overall: { score: 4, comment: 'Chuẩn bị tốt cho giai đoạn ra mắt chính thức.' } },
    y6: { comments: { what: 'Chỉ số vận hành cải thiện rõ rệt.', dev: 'Cần hoàn tất chứng chỉ theo kế hoạch.', how: 'Hỗ trợ các nhóm khác kịp thời.' }, overall: { score: 3.5, comment: 'Kết quả đạt yêu cầu, cần duy trì ở nửa cuối năm.' } },
    y8: { comments: { what: 'Thiết kế tách service được chuẩn bị rất kỹ.', dev: 'Kèm cặp hiệu quả, hai kỹ sư mới tiến bộ nhanh.', how: 'Là hình mẫu về thực thi trong nhóm.' }, overall: { score: 4.5, comment: 'Đóng góp kỹ thuật nổi bật trong nửa đầu năm.' } }
  };
  window.PMS_MYR = Object.assign({}, window.PMS_MYR || {}, MYR_NEW);
  window.PMS_SELFEVAL = Object.assign({}, window.PMS_SELFEVAL || {}, MYR_SELF_NEW);
  window.PMS_LM1EVAL = Object.assign({}, window.PMS_LM1EVAL || {}, MYR_LM_NEW);

  /* ── 5. Sự kiện YER đã xảy ra (chỉ ghi hành động thật) ───
     Trạng thái hiển thị được SUY RA theo "ngày hệ thống" ở yer-model.js:
     auto-sync, quá hạn... đều tính runtime, không hardcode.  */
  var Y = {};

  function ev(at, extra) { return Object.assign({ at: at }, extra || {}); }

  // s01 — luồng chuẩn, đã đi tới bước HOD
  Y.e1 = {
    scenario: 's01',
    self: ev('2027-01-12', { overall: { score: 4, comment: 'Năm nay tôi hoàn thành các mục tiêu trọng yếu về hiệu năng hệ thống thanh toán và duy trì chất lượng dịch vụ ổn định.' },
      comments: { what: 'Hệ thống thanh toán real-time đạt P99 85ms, vượt mục tiêu 100ms và sớm hơn kế hoạch 2 tháng.', dev: 'Đã đạt chứng chỉ AWS SAA và áp dụng vào thiết kế hạ tầng cho nhóm.', how: 'Chủ động hỗ trợ đồng đội và duy trì tinh thần học hỏi trong suốt năm.' } }),
    lm: ev('2027-01-26', { overall: { score: 4, comment: 'Kết quả năm nay ổn định và có đóng góp rõ ràng vào độ tin cậy của hệ thống thanh toán.' },
      comments: { what: 'Các mục tiêu hiệu năng và giám sát đều đạt, số liệu đo lường rõ ràng.', dev: 'Chứng chỉ AWS được áp dụng thực tế chứ không dừng ở lý thuyết.', how: 'Thể hiện tốt tinh thần đồng đội và thực thi xuất sắc.' } }),
    lm2: ev('2027-02-09', { score: 4, comment: '', source: 'approve' }),
    hod: ev('2027-02-21', { score: 4, comment: '', source: 'approve' }),
    final: { score: 4, uploadedAt: '2027-03-06', approvedAt: '2027-03-20', publishedAt: '2027-03-30' }
  };

  // s02 — chưa tự đánh giá, vẫn còn hạn
  Y.e2 = { scenario: 's02' };

  // e3 đã nghỉ việc nên hồ sơ tự ẩn khỏi danh sách. Không đặt tình huống demo:
  // đã nghỉ thì không vào được màn Đánh giá cuối năm, không có gì để xem.

  // s09 — thai sản, không tự đánh giá, LM phải import goal rồi mới đánh giá được
  Y.e4 = {
    scenario: 's09',
    importedGoals: true,
    lm: ev('2027-01-28', { overall: { score: 3, comment: 'Ghi nhận nỗ lực duy trì chất lượng kiểm thử trong giai đoạn trước khi nghỉ chế độ.' },
      comments: { what: 'Bộ regression test hoàn thành đúng kế hoạch trước thời điểm nghỉ chế độ.', dev: 'Lộ trình chứng chỉ tạm hoãn, sẽ tiếp tục sau khi quay lại.', how: 'Bàn giao công việc rõ ràng, hỗ trợ đồng đội tiếp nhận thuận lợi.' } })
  };

  // s03 — quá hạn tự đánh giá, LM vẫn chấm bình thường, cột NV trống
  Y.e13 = {
    scenario: 's03',
    lm: ev('2027-01-29', { overall: { score: 3.5, comment: 'Kết quả công việc đạt yêu cầu, tuy nhiên cần chủ động hơn trong việc cập nhật tiến độ trên hệ thống.' },
      comments: { what: 'Các mục tiêu chính hoàn thành nhưng một số hạng mục trễ so với mốc cam kết.', dev: 'Cần đặt lộ trình phát triển cụ thể hơn cho năm sau.', how: 'Phối hợp tốt trong nhóm, cần chủ động chia sẻ thông tin sớm hơn.' } })
  };

  // s04 — LM không đánh giá tới hết hạn, hệ thống tự đồng bộ điểm từ NV
  Y.e14 = {
    scenario: 's04',
    self: ev('2027-01-15', { overall: { score: 3.5, comment: 'Tôi hoàn thành phần lớn mục tiêu đề ra, một số hạng mục nghiên cứu còn dở dang.' },
      comments: { what: 'Mô hình gợi ý đã lên production và đang theo dõi hiệu quả.', dev: 'Khóa học hoàn thành 70%, dự kiến xong trong quý 1 năm sau.', how: 'Giữ tinh thần học hỏi và chủ động đề xuất cải tiến.' } })
  };

  // s05 — LM2 không chấm tới hết hạn, hệ thống đồng bộ điểm từ LM
  Y.e15 = {
    scenario: 's05',
    self: ev('2027-01-11', { overall: { score: 4, comment: 'Các mục tiêu về chất lượng ứng dụng iOS đều đạt và vượt chỉ tiêu crash-free.' },
      comments: { what: 'Crash-free rate duy trì trên 99.9% suốt 3 quý.', dev: 'Hoàn thành lộ trình học SwiftUI và áp dụng vào 4 màn hình mới.', how: 'Chủ động rà soát chất lượng trước mỗi lần phát hành.' } }),
    lm: ev('2027-01-24', { overall: { score: 4, comment: 'Chất lượng bản phát hành iOS năm nay ổn định, đóng góp trực tiếp vào trải nghiệm người dùng.' },
      comments: { what: 'Chỉ số crash-free đạt mức tốt nhất từ trước tới nay.', dev: 'Việc áp dụng SwiftUI giúp rút ngắn thời gian phát triển.', how: 'Tinh thần trách nhiệm cao với chất lượng sản phẩm.' } })
  };

  // s06 — HOD không thao tác tới hết hạn, hồ sơ giữ trạng thái chờ, không đồng bộ
  Y.e16 = {
    scenario: 's06',
    self: ev('2027-01-14', { overall: { score: 4, comment: 'Nền tảng CI/CD năm nay ổn định hơn rõ rệt và giảm đáng kể thời gian chờ của các nhóm phát triển.' },
      comments: { what: 'Thời gian build trung bình giảm gần một nửa so với đầu năm.', dev: 'Hoàn thành lộ trình Platform Engineering nội bộ.', how: 'Hỗ trợ các nhóm khác nhanh chóng khi có sự cố hạ tầng.' } }),
    lm: ev('2027-01-27', { overall: { score: 4, comment: 'Đóng góp rõ ràng vào năng suất chung của khối kỹ thuật.' },
      comments: { what: 'Kết quả tối ưu pipeline có số liệu đo lường thuyết phục.', dev: 'Chủ động học và áp dụng công nghệ mới vào hạ tầng.', how: 'Luôn sẵn sàng hỗ trợ nhóm khác, tinh thần đồng đội tốt.' } }),
    lm2: ev('2027-02-10', { score: 4, comment: '', source: 'manual' })
  };

  // s07 — HRBP tải điểm hộ HOD, chờ HOD duyệt
  Y.e9 = {
    scenario: 's07',
    self: ev('2027-01-13', { overall: { score: 4, comment: 'Chương trình bảo mật năm nay đạt các mốc quan trọng về chứng nhận và tự động hóa.' },
      comments: { what: 'SAST/DAST đã bao phủ toàn bộ repo và duy trì SLA xử lý lỗ hổng.', dev: 'Hoàn thành lộ trình nâng cao về cloud security.', how: 'Phối hợp chặt với các nhóm phát triển để giảm ma sát khi áp dụng chuẩn bảo mật.' } }),
    lm: ev('2027-01-30', { overall: { score: 4, comment: 'Kết quả bảo mật năm nay đáng ghi nhận, đặc biệt là việc duy trì chứng nhận ISO.' },
      comments: { what: 'Không phát sinh NC Major trong kỳ audit.', dev: 'Kiến thức mới được áp dụng ngay vào quy trình.', how: 'Cách tiếp cận hợp tác giúp các nhóm tuân thủ dễ dàng hơn.' } }),
    lm2: ev('2027-02-11', { score: 4, comment: '', source: 'manual' }),
    hrbpUpload: ev('2027-02-19', { score: 4, comment: 'Điểm thống nhất sau phiên rà soát cấp khối.', approved: false, by: 'Nguyễn Thị Hoa (hoa.nguyen)' })
  };

  // s16 — Quản lý trực tiếp đã hoàn tất
  Y.e10 = {
    scenario: 's16',
    self: ev('2027-01-10', { overall: { score: 4.5, comment: 'Nền tảng MLOps đã phục vụ ổn định nhiều mô hình và giảm chi phí vận hành đáng kể.' },
      comments: { what: 'Platform phục vụ 18 mô hình production, vượt mục tiêu 15.', dev: 'Hoàn thành nghiên cứu fine-tuning và chia sẻ nội bộ.', how: 'Chủ động chuẩn hóa quy trình cho cả nhóm.' } }),
    lm: ev('2027-01-25', { overall: { score: 4, comment: 'Kết quả tốt, nền tảng MLOps tạo ra giá trị rõ ràng cho các nhóm sản phẩm.' },
      comments: { what: 'Số lượng mô hình phục vụ vượt mục tiêu đề ra.', dev: 'Nghiên cứu có chiều sâu, cần lan tỏa rộng hơn trong năm sau.', how: 'Thể hiện tốt tinh thần chuẩn hóa và chia sẻ.' } })
  };

  // s17 — Quản lý cấp 2 đã hoàn tất
  Y.e11 = {
    scenario: 's17',
    self: ev('2027-01-09', { overall: { score: 4.5, comment: 'Hai mục tiêu hạ tầng trọng yếu đều hoàn thành vượt kỳ vọng và không gây gián đoạn dịch vụ.' },
      comments: { what: 'Nâng cấp Kubernetes không downtime và hoàn thành DR site đúng hạn.', dev: 'Tiếp tục đầu tư vào năng lực vận hành hệ thống quy mô lớn.', how: 'Đặt độ tin cậy hệ thống lên hàng đầu trong mọi quyết định.' } }),
    lm: ev('2027-01-23', { overall: { score: 4.5, comment: 'Đóng góp rất có giá trị cho sự ổn định của hệ thống production trong năm.' },
      comments: { what: 'Chất lượng thực thi vượt kỳ vọng ở cả hai mục tiêu hạ tầng.', dev: 'Chia sẻ kiến thức hiệu quả trong nhóm Infra.', how: 'Tinh thần trách nhiệm cao và nhất quán.' } }),
    lm2: ev('2027-02-12', { score: 4.5, comment: 'Đồng thuận với đánh giá của quản lý trực tiếp.', source: 'manual' })
  };

  // s20 — đã công bố, điểm cuối khác điểm HOD
  Y.e12 = {
    scenario: 's20',
    self: ev('2027-01-08', { overall: { score: 4, comment: 'Chất lượng ứng dụng di động cải thiện rõ và hai kỹ sư junior đã tiến bộ tốt.' },
      comments: { what: 'Crash rate iOS giảm dưới 0.1% và tính năng Predictive Back đã phát hành đúng hạn.', dev: 'Hai kỹ sư junior đạt mức mid-level theo đánh giá năng lực.', how: 'Chú trọng chất lượng và hỗ trợ phát triển đồng đội.' } }),
    lm: ev('2027-01-22', { overall: { score: 4, comment: 'Các mục tiêu chất lượng ứng dụng được hoàn thành đúng kế hoạch, có đóng góp rõ trong việc phát triển đội ngũ.' },
      comments: { what: 'Chỉ số chất lượng đạt mục tiêu ở cả hai nền tảng.', dev: 'Việc kèm cặp junior mang lại kết quả đo lường được.', how: 'Thể hiện tốt tinh thần dẫn dắt.' } }),
    lm2: ev('2027-02-06', { score: 4, comment: '', source: 'approve' }),
    hod: ev('2027-02-18', { score: 4.5, comment: 'Ghi nhận thêm đóng góp trong việc phát triển đội ngũ kỹ sư di động.', source: 'manual' }),
    final: { score: 4, uploadedAt: '2027-03-04', approvedAt: '2027-03-18', publishedAt: '2027-03-30' }
  };

  // s18 — mục tiêu thay đổi sau kỳ giữa năm
  Y.e5 = {
    scenario: 's18',
    goalChangedAfterMyr: ['g19'],
    self: ev('2027-01-16', { overall: { score: 4, comment: 'Phạm vi mục tiêu có điều chỉnh sau kỳ giữa năm nhưng kết quả cuối năm vẫn đạt cam kết.' },
      comments: { what: 'Mục tiêu migration được điều chỉnh phạm vi vào tháng 8 theo ưu tiên mới của khối.', dev: 'Hoàn thành chứng chỉ CKA đúng kế hoạch.', how: 'Thích ứng nhanh khi ưu tiên thay đổi.' } }),
    lm: ev('2027-01-28', { overall: { score: 4, comment: 'Thích ứng tốt với thay đổi ưu tiên, kết quả cuối năm đạt yêu cầu đề ra.' },
      comments: { what: 'Điều chỉnh phạm vi hợp lý và vẫn giữ được chất lượng bàn giao.', dev: 'Chứng chỉ đạt được và có chia sẻ lại cho nhóm.', how: 'Tinh thần chủ động khi ưu tiên thay đổi.' } })
  };

  // s19 — không có dữ liệu kỳ giữa năm
  Y.e6 = {
    scenario: 's19',
    self: ev('2027-01-17', { overall: { score: 3.5, comment: 'Năm đầu tiên tham gia đầy đủ chu kỳ đánh giá, tôi tập trung hoàn thành các mục tiêu nền tảng.' },
      comments: { what: 'Hoàn thành phần lớn mục tiêu công việc, một số hạng mục dài hạn còn tiếp tục.', dev: 'Đang theo lộ trình phát triển đã thống nhất với quản lý.', how: 'Hòa nhập tốt và chủ động học hỏi.' } })
  };

  // s08 — thiếu mục tiêu, không đủ điều kiện đánh giá
  Y.y1 = { scenario: 's08' };

  // s10 — thai sản nhưng tự nguyện tự đánh giá
  Y.y2 = {
    scenario: 's10',
    self: ev('2027-01-15', { voluntary: true, overall: { score: 3.5, comment: 'Tôi vẫn muốn ghi nhận lại kết quả công việc trong giai đoạn làm việc trước khi nghỉ chế độ.' },
      comments: { what: 'Bộ test case nạp rút hoàn thành 90% trước khi nghỉ chế độ.', dev: 'Đã chuyển đổi 30 test case sang Playwright và bàn giao tài liệu.', how: 'Bàn giao chủ động, hỗ trợ người tiếp nhận trong 2 tuần đầu.' } })
  };

  // s11 — đổi quản lý trước hạn chốt, quản lý cũ đã chốt một số mục tiêu
  Y.y3 = {
    scenario: 's11',
    mgrChange: { at: '2026-11-20', from: { name: 'Nguyễn Hải Đăng', login: 'dang.nguyen', ini: 'ND' }, to: { name: LM.name, login: LM.login, ini: LM.ini } },
    /* Quản lý cũ KHÔNG để lại bản bàn giao. Thứ họ để lại là điểm của những mục tiêu
       họ đã đánh giá hoàn thành. yg6 cố ý để trống để thấy một hồ sơ có cả mục tiêu đã khóa
       và mục tiêu Quản lý mới phải chấm. */
    completedGoals: {
      yg5: {
        self: { score: 4, at: '2026-11-14',
          comment: 'Conversion trang landing đã tăng từ 3.1% lên 3.6%, đủ cơ sở đề nghị chốt hoàn thành.' },
        mgr: { by: { name: 'Nguyễn Hải Đăng', login: 'dang.nguyen', ini: 'ND' }, score: 4, at: '2026-11-18',
          comment: 'Đồng ý chốt hoàn thành. Kết quả đo được rõ ràng trong giai đoạn tôi phụ trách.' }
      },
      yg7: {
        self: { score: 4, at: '2026-11-14',
          comment: 'Bốn case study tối ưu hiệu năng đã hoàn thành và chia sẻ nội bộ.' },
        mgr: { by: { name: 'Nguyễn Hải Đăng', login: 'dang.nguyen', ini: 'ND' }, score: 4, at: '2026-11-18',
          comment: 'Nội dung chia sẻ có chất lượng, đủ điều kiện chốt hoàn thành.' }
      }
    },
    self: ev('2027-01-13', { overall: { score: 4, comment: 'Dù có thay đổi quản lý giữa năm, tôi vẫn duy trì tiến độ các mục tiêu đã cam kết.' },
      comments: { what: 'Conversion chiến dịch đạt 3.8%, vượt mục tiêu 20%.', dev: 'Hoàn thành 4 case study về performance và chia sẻ nội bộ.', how: 'Giữ nhịp làm việc ổn định trong giai đoạn chuyển giao.' } }),
    lm: ev('2027-01-26', { overall: { score: 4, comment: 'Tiếp nhận từ tháng 11. Mục tiêu Quản lý trước đã chốt hoàn thành thì giữ nguyên điểm, tôi chỉ chấm phần còn lại.' },
      comments: { what: 'Kết quả chiến dịch vượt mục tiêu, số liệu đo lường rõ ràng.', dev: 'Có đầu tư nghiêm túc vào năng lực chuyên môn.', how: 'Ổn định và hợp tác tốt trong giai đoạn chuyển giao.' } })
  };

  // s12 — đổi quản lý, quản lý cũ chỉ kịp chốt một mục tiêu
  Y.y4 = {
    scenario: 's12',
    mgrChange: { at: '2026-12-05', from: { name: 'Trương Mỹ Duyên', login: 'duyen.truong', ini: 'TD' }, to: { name: LM.name, login: LM.login, ini: LM.ini } },
    completedGoals: {
      yg8: {
        self: { score: 4, at: '2026-12-01',
          comment: 'Dashboard hành vi người dùng đã phục vụ ổn định 5 nhóm sản phẩm.' },
        mgr: { by: { name: 'Trương Mỹ Duyên', login: 'duyen.truong', ini: 'TD' }, score: 4, at: '2026-12-03',
          comment: 'Độ trễ luôn dưới 2 giờ, đạt yêu cầu đặt ra. Chốt hoàn thành.' }
      }
    },
    self: ev('2027-01-16', { overall: { score: 3.5, comment: 'Dashboard hành vi người dùng đã phục vụ ổn định cho các nhóm sản phẩm.' },
      comments: { what: 'Dashboard phục vụ 5 nhóm với độ trễ dưới 2 giờ.', dev: 'Chứng chỉ dbt hoàn thành đúng hạn.', how: 'Sẵn sàng hỗ trợ các nhóm khi có yêu cầu phân tích gấp.' } })
  };

  // s13 — quản lý cũ đã nghỉ việc
  Y.y5 = {
    scenario: 's13',
    mgrChange: { at: '2026-12-12', from: { name: 'Đỗ Anh Kiệt', login: 'kiet.do', ini: 'DK', resigned: true }, to: { name: LM.name, login: LM.login, ini: LM.ini } },
    /* Quản lý cũ đã nghỉ việc. Điểm họ đã chốt vẫn có giá trị và vẫn ghi tên họ:
       nghỉ việc không xóa việc họ đã làm. */
    completedGoals: {
      yg10: {
        self: { score: 4, at: '2026-12-05',
          comment: 'Gói dịch vụ tiểu thương go-live đúng hạn và vượt mục tiêu kích hoạt.' },
        mgr: { by: { name: 'Đỗ Anh Kiệt', login: 'kiet.do', ini: 'DK' }, score: 4, at: '2026-12-08',
          comment: 'Kết quả vượt mục tiêu đăng ký từ đầu năm. Chốt hoàn thành.' }
      },
      yg11: {
        self: { score: 4, at: '2026-12-05',
          comment: 'Sáu buổi phỏng vấn merchant đã hoàn thành theo kế hoạch.' },
        mgr: { by: { name: 'Đỗ Anh Kiệt', login: 'kiet.do', ini: 'DK' }, score: 4, at: '2026-12-08',
          comment: 'Báo cáo insight đầy đủ theo quý, đủ điều kiện chốt.' }
      }
    },
    self: ev('2027-01-12', { overall: { score: 4, comment: 'Gói dịch vụ cho tiểu thương đã ra mắt đúng hạn và đạt mục tiêu kích hoạt.' },
      comments: { what: 'Đạt 8.400 merchant kích hoạt trong 60 ngày đầu, vượt mục tiêu 8.000.', dev: 'Chủ trì đủ 6 buổi phỏng vấn merchant theo kế hoạch.', how: 'Luôn lấy nhu cầu người dùng làm cơ sở cho quyết định sản phẩm.' } })
  };

  // s14 — sắp nghỉ việc trong kỳ: chỉ để hiện badge LWD, vẫn tự đánh giá bình thường
  Y.y6 = {
    scenario: 's14',
    self: ev('2027-01-10', { overall: { score: 3.5, comment: 'Thời gian khôi phục sự cố đã giảm rõ rệt so với đầu năm nhờ bộ runbook mới.' },
      comments: { what: 'MTTR trung bình 18 phút trong 6 tháng cuối năm.', dev: 'Đã thi đậu CKA vào tháng 9.', how: 'Hỗ trợ nhanh và rõ ràng khi có sự cố.' } })
  };

  // y7 onboard sau hạn 01/10/2026 nên bị lọc khỏi danh sách ngay từ model.
  // Không đặt tình huống demo cho trường hợp này: nhân viên không đủ điều kiện
  // thì không vào được màn Đánh giá cuối năm, không có gì để xem.

  // s22 — luồng chuẩn thứ hai, đang ở bước quản lý cấp 2
  Y.y8 = {
    scenario: 's22',
    self: ev('2027-01-11', { overall: { score: 4.5, comment: 'Việc tách module ví thành service độc lập là mục tiêu lớn nhất năm và đã hoàn thành không gây sự cố.' },
      comments: { what: 'Service đạt 5.200 TPS, không có sự cố P1 trong 60 ngày sau khi tách.', dev: 'Hai kỹ sư mới đã tự chủ nhận task mức trung bình sau 6 tháng.', how: 'Chia sẻ kiến thức đều đặn và hỗ trợ nhóm rất chủ động.' } }),
    lm: ev('2027-01-24', { overall: { score: 4.5, comment: 'Một trong những đóng góp kỹ thuật quan trọng nhất của nhóm Core trong năm.' },
      comments: { what: 'Việc tách service được chuẩn bị kỹ, rủi ro được kiểm soát tốt.', dev: 'Kèm cặp hiệu quả, hai kỹ sư mới tiến bộ rõ rệt.', how: 'Là hình mẫu về thực thi xuất sắc trong nhóm.' } })
  };

  // s23-s25 — nhân viên quá hạn tự đánh giá, tách theo trạng thái goal
  Y.y9 = { scenario: 's23' };   // đủ tối thiểu 1 WHAT + 1 Development đã duyệt
  Y.y10 = { scenario: 's24' };  // thiếu Development goal đã duyệt
  Y.y11 = { scenario: 's25' };  // chưa có goal

  // s26 — NV đã nộp file goal + self assessment trong timeline của LM.
  // Goal import đi thẳng sang màn LM, không qua bước phê duyệt goal.
  var LATE_Y12_GOALS = [
    { id: 'late-y12-what', type: 'what', title: 'Giảm thời gian xử lý yêu cầu ưu tiên',
      result: '90% yêu cầu ưu tiên được xử lý trong 4 giờ làm việc.', status: 'imported', s: '01/01', e: '31/12', prio: 'h', comments: [] },
    { id: 'late-y12-dev', type: 'dev', title: 'Nâng cao năng lực phân tích dữ liệu vận hành',
      result: 'Hoàn thành khóa Power BI và xây dựng 2 dashboard theo dõi chất lượng dịch vụ.', status: 'imported', s: '01/03', e: '30/11', prio: null, comments: [] }
  ];
  Y.y12 = {
    scenario: 's26',
    importedGoals: { at: '2027-01-20', source: 'employee-late', fileName: 'YER_2026_pham-thu-trang.xlsx', goals: LATE_Y12_GOALS },
    lateSubmission: { at: '2027-01-20', fileName: 'YER_2026_pham-thu-trang.xlsx', goals: LATE_Y12_GOALS },
    self: ev('2027-01-20', {
      late: true, source: 'file-import', fileName: 'YER_2026_pham-thu-trang.xlsx',
      goalScores: { 'late-y12-what': 4, 'late-y12-dev': 3 },
      howScores: [4, 3, 4, 4, 3],
      comments: {
        what: 'Đã duy trì SLA cho nhóm yêu cầu ưu tiên và giảm đáng kể lượng hồ sơ tồn.',
        dev: 'Đã hoàn thành khóa học, hai dashboard đang được nhóm dùng trong họp tuần.',
        how: 'Chủ động phối hợp và theo sát các cam kết với khách hàng nội bộ.'
      },
      overall: { score: 3.5, comment: 'Hoàn thành tốt các mục tiêu chính; cần tiếp tục nâng khả năng dự báo tải vận hành.' }
    })
  };

  window.PMS_YER = Y;

  /* ── 6. Điểm từng mục tiêu — sinh tự động quanh điểm toàn diện ─
     Chỉ số nguyên 1-5, ổn định theo id để không đổi giữa các lần mở.  */
  function hashInt(str) {
    var h = 0, i;
    for (i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) % 997; }
    return h;
  }
  function spread(base, seed) {
    var v = Math.round(base) + [0, 0, 1, -1, 0][seed % 5];
    return Math.max(1, Math.min(5, v));
  }
  function fillBlock(empId, side, block) {
    var emp = (window.PMS_EMPLOYEES || []).filter(function (e) { return e.id === empId; })[0];
    if (!emp || !block || !block.overall) return;
    var goals = (emp.goals || []).filter(function (g) { return g.status === 'approved'; });
    if (!block.goalScores) {
      block.goalScores = {};
      goals.forEach(function (g) { block.goalScores[g.id] = spread(block.overall.score, hashInt(empId + side + g.id)); });
    }
    if (!block.howScores) {
      block.howScores = [0, 1, 2, 3, 4].map(function (i) { return spread(block.overall.score, hashInt(empId + side + 'how' + i)); });
    }
  }
  Object.keys(Y).forEach(function (id) {
    fillBlock(id, 'self', Y[id].self);
    fillBlock(id, 'lm', Y[id].lm);
  });
  Object.keys(MYR_SELF_NEW).forEach(function (id) { fillBlock(id, 'myrself', window.PMS_SELFEVAL[id]); });
  Object.keys(MYR_LM_NEW).forEach(function (id) { fillBlock(id, 'myrlm', window.PMS_LM1EVAL[id]); });

  /* ── 7. Danh mục kịch bản demo ──────────────────────
     Gộp theo VAI TRÒ chứ không theo giai đoạn: người review thường xem hết
     phần của một vai rồi mới sang vai khác, nên xếp theo vai dễ theo dõi hơn.
     Mỗi tình huống chỉ rõ luôn màn hình cần mở để thanh demo tự điều hướng. */
  window.PMS_YER_SCREENS = {
    'E-05': { path: 'E-05/index.html', vi: 'Màn Nhân viên',       en: 'Employee screen' },
    'M-05': { path: 'M-05/index.html', vi: 'Danh sách Quản lý',  en: 'Manager list' },
    'M-06': { path: 'M-06/index.html', vi: 'Chi tiết nhân viên', en: 'Employee detail' }
  };

  window.PMS_YER_GROUPS = [
    { id: 'r-nv',  role: 'nv',  vi: 'Nhân viên',           en: 'Employee' },
    { id: 'r-lm',  role: 'lm',  vi: 'Quản lý trực tiếp',   en: 'Line Manager' },
    { id: 'r-lm2', role: 'lm2', vi: 'Quản lý cấp 2',       en: 'Second-level Manager' },
    { id: 'r-hod', role: 'hod', vi: 'Trưởng đơn vị',      en: 'Head of Department' }
  ];

  window.PMS_YER_SCENARIOS = [
    /* ── Nhân viên ── */
    { id: 'nv01', g: 'r-nv', emp: 'y7', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Không đủ điều kiện tham gia', en: 'Not eligible for the cycle',
      wvi: 'Onboard sau 01/10/2026 nên không thuộc kỳ: tab Đánh giá cuối năm bị khóa, không bấm vào được.',
      wen: 'Onboarded after 01/10/2026 so the Year-End Review tab is locked and cannot be opened.' },
    { id: 'nv02', g: 'r-nv', emp: 'y2', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Đang nghỉ thai sản', en: 'On maternity leave',
      wvi: 'Banner thai sản: không bắt buộc tự đánh giá, nhưng vẫn làm được nếu muốn.',
      wen: 'Maternity banner: self assessment is not required, but is still available if wanted.' },
    { id: 'nv03', g: 'r-nv', emp: 'y6', role: 'nv', date: '2027-01-08', screen: 'E-05',
      vi: 'Đã có ngày nghỉ việc ở tương lai', en: 'Leaving date already set',
      wvi: 'Badge ngày làm việc cuối cùng nằm ngay dưới box thông tin nhân viên. Nhân viên vẫn tự đánh giá theo hạn chung, không phải làm sớm.',
      wen: 'The last-working-day badge sits under the employee info box. The employee self-assesses on the normal deadline.' },
    { id: 'nv04', g: 'r-nv', emp: 'y3', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Quản lý kỳ giữa năm khác kỳ cuối năm', en: 'Mid-Year manager differs from Year-End manager',
      wvi: 'Mục tiêu Quản lý cũ đã chốt hoàn thành có nhãn riêng, điểm đã khóa và ghi domain người chấm ở cột Điểm QLTT.',
      wen: 'Goals the previous manager already closed carry their own label; the score is locked and the assessor domain shows in the manager column.' },
    { id: 'nv05', g: 'r-nv', emp: 'e2', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Còn hạn, đủ mục tiêu, chưa làm', en: 'Window open, goals complete, not started',
      wvi: 'Luồng chuẩn: nhắc hạn, form tự đánh giá mở đầy đủ và có nút gửi.',
      wen: 'The standard flow: deadline reminder, the full self assessment form and a submit button.' },
    { id: 'nv06', g: 'r-nv', emp: 'y13', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Còn hạn nhưng thiếu Mục tiêu công việc', en: 'Window open but work goal missing',
      wvi: 'Khối cảnh báo thiếu mục tiêu dẫn về tab Mục tiêu; phần đã có vẫn hiển thị bên dưới.',
      wen: 'A missing-goal warning points back to the Goals tab; existing goals still render below.' },
    { id: 'nv07', g: 'r-nv', emp: 'y1', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Còn hạn nhưng thiếu Mục tiêu phát triển', en: 'Window open but development goal missing',
      wvi: 'Cùng khối cảnh báo nhưng chỉ thiếu một loại mục tiêu, để đối chiếu với tình huống trên.',
      wen: 'The same warning with only one goal type missing, to compare with the case above.' },
    { id: 'nv08', g: 'r-nv', emp: 'y9', role: 'nv', date: '2027-01-22', screen: 'E-05',
      vi: 'Quá hạn, đủ mục tiêu, chưa làm', en: 'Past deadline, goals complete, not done',
      wvi: 'Cửa sổ nộp trễ: nhân viên nộp một file gồm mục tiêu và nội dung tự đánh giá.',
      wen: 'The late window: the employee submits one file with both goals and the self assessment.' },
    { id: 'nv09', g: 'r-nv', emp: 'y14', role: 'nv', date: '2027-01-22', screen: 'E-05',
      vi: 'Quá hạn và thiếu Mục tiêu công việc', en: 'Past deadline and work goal missing',
      wvi: 'File nộp trễ bù luôn mục tiêu còn thiếu, mục tiêu trong file không qua bước duyệt.',
      wen: 'The late file also supplies the missing goal; imported goals skip the approval step.' },
    { id: 'nv10', g: 'r-nv', emp: 'y10', role: 'nv', date: '2027-01-22', screen: 'E-05',
      vi: 'Quá hạn và thiếu Mục tiêu phát triển', en: 'Past deadline and development goal missing',
      wvi: 'Giống trên nhưng thiếu loại mục tiêu còn lại.',
      wen: 'Same as above but with the other goal type missing.' },
    { id: 'nv11', g: 'r-nv', emp: 'y11', role: 'nv', date: '2027-01-22', screen: 'E-05',
      vi: 'Quá hạn và chưa có mục tiêu nào', en: 'Past deadline with no goals at all',
      wvi: 'Dù trên hệ thống chưa có mục tiêu nào, nhân viên vẫn còn đúng một đường là nộp file.',
      wen: 'With no goals in the system at all, the late file is the only remaining route.' },
    { id: 'nv12', g: 'r-nv', emp: 'e14', role: 'nv', date: '2027-01-22', screen: 'E-05',
      vi: 'Đã nộp, chờ Quản lý trực tiếp', en: 'Submitted, awaiting Line Manager',
      wvi: 'Nội dung chuyển sang chỉ xem, dải quy trình chuyển sang bước Quản lý trực tiếp.',
      wen: 'The content becomes read-only and the stepper moves to the Line Manager step.' },
    { id: 'nv13', g: 'r-nv', emp: 'y12', role: 'nv', date: '2027-01-25', screen: 'E-05',
      vi: 'Đã nộp trễ bằng file, chờ Quản lý', en: 'Late file submitted, awaiting manager',
      wvi: 'Mục tiêu và điểm đều đến từ file nhân viên tự tải lên sau hạn.',
      wen: 'Both goals and scores come from the file the employee uploaded after the deadline.' },
    { id: 'nv14', g: 'r-nv', emp: 'e15', role: 'nv', date: '2027-02-05', screen: 'E-05',
      vi: 'Xong Quản lý trực tiếp, chờ Quản lý cấp 2', en: 'LM done, awaiting second-level manager',
      wvi: 'Nhân viên thấy điểm từng mục tiêu của quản lý, nhưng chưa thấy điểm toàn diện.',
      wen: 'The employee sees the manager per-goal scores but not the overall rating.' },
    { id: 'nv15', g: 'r-nv', emp: 'e16', role: 'nv', date: '2027-02-20', screen: 'E-05',
      vi: 'Xong Quản lý cấp 2, chờ Trưởng đơn vị', en: 'LM2 done, awaiting Head of Department',
      wvi: 'Dải quy trình đã qua hai bước quản lý, màn nhân viên không đổi thêm gì.',
      wen: 'The stepper has passed both manager steps; the employee screen itself does not change.' },
    { id: 'nv16', g: 'r-nv', emp: 'e1', role: 'nv', date: '2027-02-25', screen: 'E-05',
      vi: 'Xong Trưởng đơn vị, chờ điểm cuối cùng', en: 'HOD done, awaiting the final rating',
      wvi: 'Bước cuối trước khi công bố: điểm cuối cùng chưa được tải lên hệ thống.',
      wen: 'The last step before publication: the final rating has not been uploaded yet.' },
    { id: 'nv18', g: 'r-nv', emp: 'e6', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Thuộc kỳ giữa năm nhưng không có kết quả', en: 'In the Mid-Year cycle but with no result',
      wvi: 'Không hoàn tất bước bắt buộc nên không có kết quả, nhưng tab Đánh giá giữa năm **vẫn mở xem lại được**. Nhãn tab là Không có kết quả.',
      wen: 'The required step was never completed so there is no result, but the Mid-Year tab still opens for viewing. The tab label reads No result.' },
    { id: 'nv22', g: 'r-nv', emp: 'y15', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Không thuộc kỳ giữa năm - tab bị khóa', en: 'Outside the Mid-Year cycle - tab locked',
      wvi: 'Onboard 15/06/2026, sau hạn 01/04 của kỳ giữa năm nên tab Đánh giá giữa năm **bị khóa, bấm không vào được**, nhãn tab là Không đánh giá. Đối chiếu với nv18 để thấy hai lý do khác nhau cho ra hai UI khác nhau.',
      wen: 'Onboarded 15/06/2026, after the 01/04 Mid-Year cut-off, so the Mid-Year tab is locked. Compare with nv18 to see the two different reasons.' },
    { id: 'nv21', g: 'r-nv', emp: 'e12', role: 'nv', date: '2027-04-02', screen: 'E-05',
      vi: 'Đã công bố, điểm cuối khác điểm HOD', en: 'Published, final differs from HOD',
      wvi: 'Nhân viên chỉ thấy điểm cuối cùng, không bao giờ thấy điểm toàn diện của quản lý.',
      wen: 'The employee only ever sees the final rating, never the manager overall rating.' },

    /* ── Quản lý trực tiếp ── */
    { id: 'lm01', g: 'r-lm', emp: 'y6', role: 'lm', date: '2027-01-25', screen: 'M-05',
      vi: 'Danh sách có đủ ba nhóm cần lưu ý', en: 'Roster showing all three flags at once',
      wvi: 'Cùng một danh sách có nhân viên thai sản, nhân viên có badge LWD và nhóm phải nộp trễ.',
      wen: 'One roster with a maternity case, an LWD badge and the people who must submit late.' },
    { id: 'lm02', g: 'r-lm', emp: 'e1', role: 'lm', date: '2027-03-20', screen: 'M-06',
      vi: 'Một hồ sơ đi qua đủ các bước', en: 'One profile through every step',
      wvi: 'Xem lại cả chuỗi: điểm nhân viên, điểm quản lý, cấp 2, trưởng đơn vị và điểm cuối cùng.',
      wen: 'The full chain: employee, manager, second-level, head of department and the final rating.' },
    { id: 'lm03', g: 'r-lm', emp: 'e4', role: 'lm', date: '2027-01-22', screen: 'M-06',
      vi: 'Nhân viên thai sản - quản lý import mục tiêu', en: 'Maternity case - manager imports goals',
      wvi: 'Không yêu cầu tự đánh giá, quản lý tải mục tiêu lên rồi mới chấm được.',
      wen: 'Self assessment is not required; the manager imports the goals before scoring.' },
    { id: 'lm04', g: 'r-lm', emp: 'e13', role: 'lm', date: '2027-01-29', screen: 'M-06',
      vi: 'Nhân viên không tự đánh giá', en: 'Employee skipped the self assessment',
      wvi: 'Cột điểm nhân viên để trống nhưng quy trình không dừng, quản lý vẫn chấm.',
      wen: 'The employee column stays empty but the process continues and the manager still scores.' },
    { id: 'lm05', g: 'r-lm', emp: 'y12', role: 'lm', date: '2027-01-25', screen: 'M-06',
      vi: 'Nhận hồ sơ nhân viên nộp trễ', en: 'Late employee file received',
      wvi: 'Nhãn nộp trễ, mục tiêu đọc từ file và không phải qua bước duyệt mục tiêu.',
      wen: 'A late badge, goals read from the file, and no goal approval step required.' },
    { id: 'lm06', g: 'r-lm', emp: 'y4', role: 'lm', date: '2027-01-20', screen: 'M-06',
      vi: 'Đổi Quản lý - một mục tiêu đã chốt', en: 'Manager changed - one goal already closed',
      wvi: 'Quản lý mới chỉ chấm những mục tiêu còn lại; ô điểm của mục tiêu đã chốt không sửa được.',
      wen: 'The new manager only rates the remaining goals; the closed goal score cannot be edited.' },
    { id: 'lm07', g: 'r-lm', emp: 'y5', role: 'lm', date: '2027-01-20', screen: 'M-06',
      vi: 'Quản lý cũ đã nghỉ việc', en: 'Former manager has resigned',
      wvi: 'Điểm Quản lý cũ đã chốt vẫn giữ nguyên và vẫn ghi tên họ; nghỉ việc không xóa việc họ đã làm.',
      wen: 'Scores the former manager closed stay valid and keep their name; resigning does not erase their work.' },
    { id: 'lm08', g: 'r-lm', emp: 'e14', role: 'lm', date: '2027-02-05', screen: 'M-05',
      vi: 'Quá hạn - hệ thống đồng bộ điểm', en: 'Overdue - score synced by the system',
      wvi: 'Badge HR system cạnh điểm của quản lý, không có nhận xét kèm theo.',
      wen: 'An HR system badge next to the manager score, with no comment attached.' },
    { id: 'lm09', g: 'r-lm', emp: 'e10', role: 'lm', date: '2027-01-27', screen: 'M-06',
      vi: 'Đã đánh giá - vẫn được chỉnh sửa', en: 'Submitted review remains editable',
      wvi: 'QLTT đã gửi đánh giá nhưng timeline của QLTT vẫn mở, nên điểm mục tiêu, nhận xét và điểm toàn diện vẫn chỉnh sửa được.',
      wen: 'The line manager already submitted, but their timeline is still open, so goal scores, comments and the overall rating remain editable.' },

    /* ── Quản lý cấp 2 ── */
    { id: 'lm2-01', g: 'r-lm2', emp: 'y8', role: 'lm2', date: '2027-02-10', screen: 'M-06',
      vi: 'Đang chờ chấm điểm toàn diện', en: 'Awaiting the overall rating',
      wvi: 'Quản lý cấp 2 chỉ chấm điểm toàn diện, điểm từng mục tiêu chỉ để tham khảo.',
      wen: 'The second-level manager scores only the overall rating; per-goal scores are reference only.' },
    { id: 'lm2-02', g: 'r-lm2', emp: 'e13', role: 'lm2', date: '2027-02-10', screen: 'M-06',
      vi: 'Hồ sơ không có điểm nhân viên', en: 'Profile with no employee rating',
      wvi: 'Nhân viên không tự đánh giá nhưng hồ sơ vẫn đi lên tới cấp 2 bình thường.',
      wen: 'The employee skipped the self assessment, yet the profile still reaches the second level.' },
    { id: 'lm2-03', g: 'r-lm2', emp: 'y12', role: 'lm2', date: '2027-02-10', screen: 'M-06',
      vi: 'Hồ sơ có mục tiêu nhập từ file', en: 'Profile with goals imported from a file',
      wvi: 'Mục tiêu đến từ file nộp trễ của nhân viên, không qua bước duyệt mục tiêu.',
      wen: 'Goals come from the employee late file and never went through goal approval.' },
    { id: 'lm2-04', g: 'r-lm2', emp: 'e15', role: 'lm2', date: '2027-02-20', screen: 'M-05',
      vi: 'Quá hạn - đồng bộ điểm từ quản lý', en: 'Overdue - score synced from the manager',
      wvi: 'Đồng bộ ở tầng thứ hai, vẫn dùng chung một nhãn HR system.',
      wen: 'Second-level sync, still using the same shared HR system label.' },
    { id: 'lm2-05', g: 'r-lm2', emp: 'e11', role: 'lm2', date: '2027-02-13', screen: 'M-06',
      vi: 'Đã đánh giá - vẫn được chỉnh sửa', en: 'Saved rating remains editable',
      wvi: 'Quản lý cấp 2 đã lưu điểm nhưng timeline cấp 2 vẫn mở, nên điểm toàn diện và nhận xét vẫn chỉnh sửa được.',
      wen: 'The second-level manager already saved a rating, but their timeline is still open, so the overall rating and comment remain editable.' },

    /* ── Trưởng đơn vị ── */
    { id: 'hod01', g: 'r-hod', emp: 'e16', role: 'hod', date: '2027-02-20', screen: 'M-06',
      vi: 'Đang chờ Trưởng đơn vị chấm', en: 'Awaiting the Head of Department',
      wvi: 'Bước chấm cuối cùng trong chuỗi quản lý, trước khi Total Reward tải điểm.',
      wen: 'The last scoring step in the manager chain, before Total Reward uploads the final rating.' },
    { id: 'hod02', g: 'r-hod', emp: 'e1', role: 'hod', date: '2027-02-20', screen: 'M-05',
      vi: 'Lưới điểm toàn đơn vị', en: 'Department-wide score grid',
      wvi: 'Lưới đủ bốn cột điểm để theo dõi phân bổ và độ lệch giữa các tầng.',
      wen: 'The four-column grid used to watch the distribution and the gaps between levels.' },
    { id: 'hod03', g: 'r-hod', emp: 'e9', role: 'hod', date: '2027-02-22', screen: 'M-05',
      vi: 'HRBP tải điểm hộ - chờ duyệt', en: 'HRBP uploaded scores - awaiting approval',
      wvi: 'Điểm chưa duyệt nằm ở màn phê duyệt riêng, không hiện ở lưới chính.',
      wen: 'Unapproved scores sit in their own approval screen, not in the main grid.' },
    { id: 'hod04', g: 'r-hod', emp: 'e16', role: 'hod', date: '2027-03-05', screen: 'M-05',
      vi: 'Quá hạn - không đồng bộ', en: 'Overdue - no sync',
      wvi: 'Hồ sơ giữ trạng thái Chờ Trưởng đơn vị, quy trình vẫn đi tiếp sang bước sau.',
      wen: 'The profile stays in Awaiting HOD and the process still moves on to the next step.' },
    { id: 'hod05', g: 'r-hod', emp: 'e12', role: 'hod', date: '2027-02-20', screen: 'M-06',
      vi: 'Đã đánh giá - vẫn được chỉnh sửa', en: 'Saved HOD rating remains editable',
      wvi: 'Trưởng đơn vị đã lưu điểm nhưng timeline HOD vẫn mở, nên điểm toàn diện và nhận xét vẫn chỉnh sửa được.',
      wen: 'The head of department already saved a rating, but the HOD timeline is still open, so the overall rating and comment remain editable.' }
  ];

  // Thứ tự review chính là thứ tự khai báo ở trên: theo vai trò, trong mỗi vai
  // thì đi từ điều kiện tham gia → luồng chuẩn → ngoại lệ → kết quả.
  window.PMS_YER_SCENARIO_ORDER =
    window.PMS_YER_SCENARIOS.map(function (sc) { return sc.id; });
})();
