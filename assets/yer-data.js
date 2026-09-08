/* ═══════════════════════════════════════════════════════════
   YER 2026 — dữ liệu bổ sung cho Đánh giá cuối năm
   Nguyên tắc: KHÔNG sửa assets/employees-data.js.
   File này chỉ THÊM: nhân sự mới (y*), sự kiện YER, kịch bản demo.
   Spec: YER-SPEC.md
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1. Timeline kỳ đánh giá ────────────────────────────── */
  window.PMS_YER_TIMELINE = {
    cycle: 'YER 2026',
    cycleLabel: { vi: 'Đánh giá cuối năm 2026', en: 'Year-End Review 2026' },
    mgrCutoff: '2026-12-31',       // sau ngày này LM đang phụ trách là người đánh giá
    onboardCutoff: '2026-10-01',   // onboard sau ngày này không thuộc kỳ
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
     e4 (thai sản - Quản lý phải import), y7 (ngoài kỳ đánh giá).           */
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
    y8: { hired: '2016-09-12' }
  };

  /* ── 4b. Dữ liệu kỳ giữa năm cho nhân sự mới ────────────
     Chỉ thêm cho y*, không đụng dữ liệu MYR của 16 nhân sự cũ
     để màn Mục tiêu và MYR đã duyệt giữ nguyên.
     y1 (thiếu mục tiêu) và y7 (ngoài kỳ) cố ý không có dữ liệu MYR.   */
  var MYR_NEW = {
    y2: { submitted: true,  nv: 3.5, lm1: 3.5, lm2: 3.5, hod: null, final: 3.5 },
    y3: { submitted: true,  nv: 4,   lm1: 3.5, lm2: 4,   hod: null, final: 4 },
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
     auto-sync, quá hạn, khóa response... đều tính runtime, không hardcode.  */
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

  // s15 — đã nghỉ việc, mặc định ẩn khỏi danh sách
  Y.e3 = { scenario: 's15' };

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

  // s16 — NV đã phản hồi, LM chưa trả lời
  Y.e10 = {
    scenario: 's16',
    self: ev('2027-01-10', { overall: { score: 4.5, comment: 'Nền tảng MLOps đã phục vụ ổn định nhiều mô hình và giảm chi phí vận hành đáng kể.' },
      comments: { what: 'Platform phục vụ 18 mô hình production, vượt mục tiêu 15.', dev: 'Hoàn thành nghiên cứu fine-tuning và chia sẻ nội bộ.', how: 'Chủ động chuẩn hóa quy trình cho cả nhóm.' } }),
    lm: ev('2027-01-25', { overall: { score: 4, comment: 'Kết quả tốt, nền tảng MLOps tạo ra giá trị rõ ràng cho các nhóm sản phẩm.' },
      comments: { what: 'Số lượng mô hình phục vụ vượt mục tiêu đề ra.', dev: 'Nghiên cứu có chiều sâu, cần lan tỏa rộng hơn trong năm sau.', how: 'Thể hiện tốt tinh thần chuẩn hóa và chia sẻ.' } }),
    response: ev('2027-01-31', { text: 'Em cảm ơn anh đã ghi nhận. Về phần chi phí inference, em muốn bổ sung thêm là mức giảm thực tế đạt 34% so với mục tiêu 30%, số liệu em đã cập nhật trong báo cáo tháng 12. Mong anh xem xét thêm khi tổng hợp kết quả.' })
  };

  // s17 — NV phản hồi, LM đã trả lời một lần, luồng trao đổi khóa lại
  Y.e11 = {
    scenario: 's17',
    self: ev('2027-01-09', { overall: { score: 4.5, comment: 'Hai mục tiêu hạ tầng trọng yếu đều hoàn thành vượt kỳ vọng và không gây gián đoạn dịch vụ.' },
      comments: { what: 'Nâng cấp Kubernetes không downtime và hoàn thành DR site đúng hạn.', dev: 'Tiếp tục đầu tư vào năng lực vận hành hệ thống quy mô lớn.', how: 'Đặt độ tin cậy hệ thống lên hàng đầu trong mọi quyết định.' } }),
    lm: ev('2027-01-23', { overall: { score: 4.5, comment: 'Đóng góp rất có giá trị cho sự ổn định của hệ thống production trong năm.' },
      comments: { what: 'Chất lượng thực thi vượt kỳ vọng ở cả hai mục tiêu hạ tầng.', dev: 'Chia sẻ kiến thức hiệu quả trong nhóm Infra.', how: 'Tinh thần trách nhiệm cao và nhất quán.' } }),
    response: ev('2027-01-29', { text: 'Em cảm ơn anh. Em xin bổ sung là trong kỳ có 2 lần diễn tập DR đều đạt RTO dưới 3 giờ, tốt hơn mục tiêu 4 giờ đề ra ban đầu.',
      reply: ev('2027-02-03', { text: 'Cảm ơn em đã bổ sung. Anh đã ghi nhận kết quả diễn tập DR vào phần tổng hợp gửi lên cấp trên.' }) }),
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

  // s11 — đổi quản lý trước hạn chốt, quản lý cũ đã bàn giao
  Y.y3 = {
    scenario: 's11',
    mgrChange: { at: '2026-11-20', from: { name: 'Nguyễn Hải Đăng', login: 'dang.nguyen', ini: 'ND' }, to: { name: LM.name, login: LM.login, ini: LM.ini } },
    wrapup: ev('2026-11-21', { status: 'done', by: { name: 'Nguyễn Hải Đăng', login: 'dang.nguyen', ini: 'ND' }, expiresAt: '2026-11-22',
      sections: {
        achievements: 'Dẫn dắt việc tối ưu trang landing chiến dịch, conversion tăng từ 3.1% lên 3.6% trong giai đoạn tháng 1 đến tháng 10.',
        strengths: 'Chủ động đề xuất giải pháp, làm việc tốt với nhóm marketing và có tư duy đo lường rõ ràng.',
        improvements: 'Cần cải thiện việc ước lượng thời gian cho các hạng mục phụ thuộc nhiều bên.',
        notes: 'Giai đoạn tháng 6 đến tháng 8 có hỗ trợ thêm cho dự án khác ngoài phạm vi mục tiêu cá nhân.'
      } }),
    self: ev('2027-01-13', { overall: { score: 4, comment: 'Dù có thay đổi quản lý giữa năm, tôi vẫn duy trì tiến độ các mục tiêu đã cam kết.' },
      comments: { what: 'Conversion chiến dịch đạt 3.8%, vượt mục tiêu 20%.', dev: 'Hoàn thành 4 case study về performance và chia sẻ nội bộ.', how: 'Giữ nhịp làm việc ổn định trong giai đoạn chuyển giao.' } }),
    lm: ev('2027-01-26', { overall: { score: 4, comment: 'Tiếp nhận từ tháng 11 và ghi nhận kết quả xuyên suốt năm dựa trên cả phần bàn giao của quản lý trước.' },
      comments: { what: 'Kết quả chiến dịch vượt mục tiêu, số liệu đo lường rõ ràng.', dev: 'Có đầu tư nghiêm túc vào năng lực chuyên môn.', how: 'Ổn định và hợp tác tốt trong giai đoạn chuyển giao.' } })
  };

  // s12 — đổi quản lý nhưng quản lý cũ để quá 48 giờ
  Y.y4 = {
    scenario: 's12',
    mgrChange: { at: '2026-12-05', from: { name: 'Trương Mỹ Duyên', login: 'duyen.truong', ini: 'TD' }, to: { name: LM.name, login: LM.login, ini: LM.ini } },
    wrapup: { status: 'expired', by: { name: 'Trương Mỹ Duyên', login: 'duyen.truong', ini: 'TD' }, expiresAt: '2026-12-07' },
    self: ev('2027-01-16', { overall: { score: 3.5, comment: 'Dashboard hành vi người dùng đã phục vụ ổn định cho các nhóm sản phẩm.' },
      comments: { what: 'Dashboard phục vụ 5 nhóm với độ trễ dưới 2 giờ.', dev: 'Chứng chỉ dbt hoàn thành đúng hạn.', how: 'Sẵn sàng hỗ trợ các nhóm khi có yêu cầu phân tích gấp.' } })
  };

  // s13 — quản lý cũ đã nghỉ việc, bỏ qua bàn giao
  Y.y5 = {
    scenario: 's13',
    mgrChange: { at: '2026-12-12', from: { name: 'Đỗ Anh Kiệt', login: 'kiet.do', ini: 'DK', resigned: true }, to: { name: LM.name, login: LM.login, ini: LM.ini } },
    wrapup: { status: 'skipped', reason: 'former-manager-resigned' },
    self: ev('2027-01-12', { overall: { score: 4, comment: 'Gói dịch vụ cho tiểu thương đã ra mắt đúng hạn và đạt mục tiêu kích hoạt.' },
      comments: { what: 'Đạt 8.400 merchant kích hoạt trong 60 ngày đầu, vượt mục tiêu 8.000.', dev: 'Chủ trì đủ 6 buổi phỏng vấn merchant theo kế hoạch.', how: 'Luôn lấy nhu cầu người dùng làm cơ sở cho quyết định sản phẩm.' } })
  };

  // s14 — sắp nghỉ việc trong kỳ, phải hoàn tất trước ngày hiệu lực
  Y.y6 = {
    scenario: 's14',
    self: ev('2027-01-10', { overall: { score: 3.5, comment: 'Thời gian khôi phục sự cố đã giảm rõ rệt so với đầu năm nhờ bộ runbook mới.' },
      comments: { what: 'MTTR trung bình 18 phút trong 6 tháng cuối năm.', dev: 'Đã thi đậu CKA vào tháng 9.', how: 'Hỗ trợ nhanh và rõ ràng khi có sự cố.' } })
  };

  // s21 — onboard sau hạn 01/10/2026, không thuộc kỳ đánh giá
  Y.y7 = { scenario: 's21' };

  // s22 — luồng chuẩn thứ hai, đang ở bước quản lý cấp 2
  Y.y8 = {
    scenario: 's22',
    self: ev('2027-01-11', { overall: { score: 4.5, comment: 'Việc tách module ví thành service độc lập là mục tiêu lớn nhất năm và đã hoàn thành không gây sự cố.' },
      comments: { what: 'Service đạt 5.200 TPS, không có sự cố P1 trong 60 ngày sau khi tách.', dev: 'Hai kỹ sư mới đã tự chủ nhận task mức trung bình sau 6 tháng.', how: 'Chia sẻ kiến thức đều đặn và hỗ trợ nhóm rất chủ động.' } }),
    lm: ev('2027-01-24', { overall: { score: 4.5, comment: 'Một trong những đóng góp kỹ thuật quan trọng nhất của nhóm Core trong năm.' },
      comments: { what: 'Việc tách service được chuẩn bị kỹ, rủi ro được kiểm soát tốt.', dev: 'Kèm cặp hiệu quả, hai kỹ sư mới tiến bộ rõ rệt.', how: 'Là hình mẫu về thực thi xuất sắc trong nhóm.' } })
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

  /* ── 7. Danh mục kịch bản demo ──────────────────────────── */
  window.PMS_YER_GROUPS = [
    { id: 'g1', vi: 'Luồng chuẩn',                 en: 'Standard flow' },
    { id: 'g2', vi: 'Quá hạn và tự đồng bộ điểm',  en: 'Overdue and score auto-sync' },
    { id: 'g3', vi: 'Điều kiện tham gia kỳ',       en: 'Cycle eligibility' },
    { id: 'g4', vi: 'Thai sản và đổi Quản lý',     en: 'Maternity and manager change' },
    { id: 'g5', vi: 'Phản hồi của Nhân viên',      en: 'Employee response' },
    { id: 'g6', vi: 'Kỳ giữa năm và kết quả cuối', en: 'Mid-Year and final result' }
  ];

  window.PMS_YER_SCENARIOS = [
    { id: 's02', g: 'g1', emp: 'e2',  role: 'nv',  date: '2027-01-12',
      vi: 'Chưa tự đánh giá, còn hạn', en: 'Self assessment pending, still open',
      wvi: 'Màn nhân viên khi tới lượt mình - nhắc hạn và nút gửi tự đánh giá.',
      wen: 'Employee view when it is their turn - deadline reminder and submit button.' },
    { id: 's01', g: 'g1', emp: 'e1',  role: 'lm',  date: '2027-02-20',
      vi: 'Đã qua LM và LM2, chờ HOD', en: 'LM and LM2 done, awaiting HOD',
      wvi: 'Lưới quản lý đủ bốn cột điểm, hồ sơ đi đúng thứ tự các bước.',
      wen: 'Manager grid with all four score columns, profile moving through the steps in order.' },
    { id: 's22', g: 'g1', emp: 'y8',  role: 'lm2', date: '2027-02-10',
      vi: 'Đang chờ Quản lý cấp 2 chấm', en: 'Awaiting second-level manager',
      wvi: 'Quản lý cấp 2 chỉ chấm điểm toàn diện, xem chi tiết của NV và LM để tham khảo.',
      wen: 'The second-level manager scores only the overall rating, with employee and LM detail for reference.' },

    { id: 's03', g: 'g2', emp: 'e13', role: 'lm',  date: '2027-01-29',
      vi: 'NV không tự đánh giá, LM vẫn chấm', en: 'No self assessment, LM still evaluates',
      wvi: 'Cột điểm nhân viên để trống nhưng quy trình không dừng.',
      wen: 'The employee score column stays empty but the process continues.' },
    { id: 's04', g: 'g2', emp: 'e14', role: 'lm',  date: '2027-02-05',
      vi: 'LM quá hạn - đồng bộ điểm từ NV', en: 'LM overdue - score synced from employee',
      wvi: 'Badge HR system cạnh điểm của quản lý, không có nhận xét kèm theo.',
      wen: 'HR system badge next to the manager score, with no comment attached.' },
    { id: 's05', g: 'g2', emp: 'e15', role: 'lm2', date: '2027-02-20',
      vi: 'LM2 quá hạn - đồng bộ điểm từ LM', en: 'LM2 overdue - score synced from LM',
      wvi: 'Đồng bộ ở tầng thứ hai, vẫn dùng một nhãn HR system chung.',
      wen: 'Second-level sync, still using one shared HR system label.' },
    { id: 's06', g: 'g2', emp: 'e16', role: 'hod', date: '2027-03-05',
      vi: 'HOD quá hạn - không đồng bộ', en: 'HOD overdue - no sync',
      wvi: 'Hồ sơ giữ trạng thái Chờ HOD đánh giá, quy trình vẫn đi tiếp.',
      wen: 'The profile stays in Awaiting HOD, and the process still moves on.' },

    { id: 's08', g: 'g3', emp: 'y1',  role: 'nv',  date: '2027-01-10',
      vi: 'Thiếu mục tiêu - Không đánh giá', en: 'Missing goals - Not evaluated',
      wvi: 'Cảnh báo chặn ngay ở màn tự đánh giá và hướng nhân viên quay về tab Mục tiêu.',
      wen: 'Blocking warning on the self assessment screen, pointing back to the Goals tab.' },
    { id: 's21', g: 'g3', emp: 'y7',  role: 'lm',  date: '2027-01-20',
      vi: 'Onboard sau 01/10 - ngoài kỳ', en: 'Onboarded after 01/10 - out of cycle',
      wvi: 'Nhân sự này bị ẩn khỏi danh sách đánh giá.',
      wen: 'This person is hidden from the review roster.' },
    { id: 's14', g: 'g3', emp: 'y6',  role: 'lm',  date: '2027-01-25',
      vi: 'Sắp nghỉ việc 15/02 - chấm sớm', en: 'Leaving on 15/02 - evaluate early',
      wvi: 'Badge ngày nghỉ việc để quản lý biết phải hoàn tất trước ngày hiệu lực.',
      wen: 'Leaving-date badge so the manager finishes before the effective date.' },
    { id: 's15', g: 'g3', emp: 'e3',  role: 'lm',  date: '2027-01-25',
      vi: 'Đã nghỉ việc - mặc định ẩn', en: 'Resigned - hidden by default',
      wvi: 'Chỉ hiện khi bật bộ lọc nhân viên đã nghỉ việc, và chỉ để tra cứu.',
      wen: 'Only visible when the resigned filter is on, and for lookup only.' },

    { id: 's09', g: 'g4', emp: 'e4',  role: 'lm',  date: '2027-01-28',
      vi: 'Thai sản - LM import mục tiêu', en: 'Maternity - LM imports goals',
      wvi: 'Banner thai sản, không yêu cầu tự đánh giá, quản lý import mục tiêu rồi chấm.',
      wen: 'Maternity banner, self assessment not required, manager imports goals then scores.' },
    { id: 's10', g: 'g4', emp: 'y2',  role: 'nv',  date: '2027-01-16',
      vi: 'Thai sản nhưng vẫn tự đánh giá', en: 'Maternity but self-assesses anyway',
      wvi: 'Không bắt buộc nhưng nhân viên vẫn làm được nếu muốn.',
      wen: 'Not required, but the employee can still complete it if they want to.' },
    { id: 's11', g: 'g4', emp: 'y3',  role: 'nv',  date: '2027-01-27',
      vi: 'Đổi Quản lý - có bàn giao', en: 'Manager changed - wrap-up completed',
      wvi: 'Khối bàn giao của quản lý cũ, nhân viên thấy ngay khi được gửi.',
      wen: 'Wrap-up block from the previous manager, visible to the employee once submitted.' },
    { id: 's12', g: 'g4', emp: 'y4',  role: 'lm',  date: '2027-01-20',
      vi: 'Đổi Quản lý - bàn giao hết hạn', en: 'Manager changed - wrap-up expired',
      wvi: 'Quá 48 giờ thì không còn khối bàn giao, quy trình không bị chặn.',
      wen: 'After 48 hours the wrap-up is gone and the process is not blocked.' },
    { id: 's13', g: 'g4', emp: 'y5',  role: 'lm',  date: '2027-01-20',
      vi: 'Quản lý cũ đã nghỉ việc', en: 'Former manager resigned',
      wvi: 'Bỏ qua bước bàn giao hoàn toàn.',
      wen: 'The wrap-up step is skipped entirely.' },

    { id: 's16', g: 'g5', emp: 'e10', role: 'nv',  date: '2027-02-02',
      vi: 'Đã phản hồi, chờ LM trả lời', en: 'Response sent, awaiting LM reply',
      wvi: 'Nội dung phản hồi chuyển chỉ xem, quản lý còn đúng một lượt trả lời.',
      wen: 'The response becomes read-only and the manager has exactly one reply left.' },
    { id: 's17', g: 'g5', emp: 'e11', role: 'nv',  date: '2027-02-10',
      vi: 'LM đã trả lời - luồng khóa', en: 'LM replied - thread locked',
      wvi: 'Sau lượt trả lời của quản lý, nhân viên không phản hồi tiếp được.',
      wen: 'After the manager reply the employee cannot respond again.' },

    { id: 's18', g: 'g6', emp: 'e5',  role: 'nv',  date: '2027-01-30',
      vi: 'Mục tiêu đổi sau kỳ giữa năm', en: 'Goal changed after Mid-Year',
      wvi: 'Badge Đã thay đổi sau Mid-Year và đường dẫn mở đúng mục tiêu trong snapshot.',
      wen: 'Changed after Mid-Year badge with a link to that goal inside the snapshot.' },
    { id: 's19', g: 'g6', emp: 'e6',  role: 'nv',  date: '2027-01-20',
      vi: 'Không có dữ liệu kỳ giữa năm', en: 'No Mid-Year data',
      wvi: 'Khối snapshot hiện empty state thay vì biến mất.',
      wen: 'The snapshot block shows an empty state instead of disappearing.' },
    { id: 's07', g: 'g6', emp: 'e9',  role: 'hod', date: '2027-02-22',
      vi: 'HRBP tải điểm hộ, chờ HOD duyệt', en: 'HRBP uploaded scores, awaiting HOD approval',
      wvi: 'Điểm chưa duyệt nằm ở màn phê duyệt riêng, không hiện ở lưới chính của HOD.',
      wen: 'Unapproved scores sit in the approval screen, not in the main HOD grid.' },
    { id: 's20', g: 'g6', emp: 'e12', role: 'nv',  date: '2027-04-02',
      vi: 'Đã công bố - điểm cuối khác HOD', en: 'Published - final differs from HOD',
      wvi: 'Nhân viên chỉ thấy điểm cuối cùng, không bao giờ thấy điểm toàn diện của quản lý.',
      wen: 'The employee only sees the final rating and never the manager overall rating.' }
  ];
})();
