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
      { key: 'lm',      from: '2027-01-19', to: '2027-02-08', vi: 'Quản lý trực tiếp',      en: 'Line Manager' },
      { key: 'lm2',     from: '2027-02-09', to: '2027-02-22', vi: 'Quản lý cấp 2',          en: 'Second-level Manager' },
      { key: 'hod',     from: '2027-02-23', to: '2027-03-08', vi: 'Trưởng đơn vị',          en: 'Head of Department' },
      { key: 'tr',      from: '2027-03-09', to: '2027-03-22', vi: 'Total Reward tải điểm',  en: 'Total Reward Upload' },
      { key: 'hrd',     from: '2027-03-23', to: '2027-04-05', vi: 'HR Director duyệt',      en: 'HR Director Approval' },
      { key: 'publish', from: '2027-04-06', to: '2027-04-06', vi: 'Công bố kết quả',        en: 'Publish Results' }
    ]
  };

  /* Ngày lễ không tính là ngày làm việc khi đếm ngày trễ và lịch nhắc nộp bổ sung (YER-SPEC §27.3).
     Dữ liệu mẫu cho prototype, bản thật lấy từ lịch nghỉ lễ HR công bố. */
  window.PMS_YER_HOLIDAYS = [
    '2027-01-01',
    '2027-02-05', '2027-02-08', '2027-02-09', '2027-02-10', '2027-02-11'
  ];

  /* Năm giá trị cốt lõi của MoMo, đúng câu chữ của tab Đánh giá giữa năm (M-06 #how-tbody). Một nguồn cho E-05 và M-06
     ở tab Đánh giá cuối năm (DS §20.1), chốt 02/10/2026. lines: ba ý mô tả, hiện cách nhau bằng xuống dòng. */
  window.PMS_CORE_VALUES = [
    { vi:'Tập trung vào khách hàng', en:'Customer focus', lines:[
      'Thấu hiểu khách hàng: Chúng tôi chủ động lắng nghe khách hàng và thấu hiểu các nhu cầu của họ.',
      'Nghĩ về khách hàng trước tiên: Chúng tôi cân nhắc góc nhìn của khách hàng trước tất cả góc nhìn khác trong quá trình ra quyết định.',
      'Cung cấp trải nghiệm khách hàng vượt trội: Chúng tôi nỗ lực hết mình để tạo ra trải nghiệm vượt xa kỳ vọng hợp lý của khách hàng.'] },
    { vi:'Đổi mới sáng tạo', en:'Innovation', lines:[
      'Chúng tôi được khuyến khích xây dựng tư duy khác biệt.',
      'Chúng tôi luôn hướng đến những sự thay đổi tích cực.',
      'Chúng tôi luôn trân trọng tất cả những ý tưởng, vì những thành công lớn đều khởi nguồn từ những ý tưởng nhỏ.'] },
    { vi:'Tinh thần đồng đội', en:'Teamwork', lines:[
      'Chúng tôi làm việc hướng về một mục tiêu chung.',
      'Chúng tôi tôn trọng đồng nghiệp và đánh giá cao tất cả những đóng góp từ họ.',
      'Chúng tôi nỗ lực thấu hiểu để hỗ trợ nhau tốt nhất.'] },
    { vi:'Thực thi xuất sắc', en:'Excellence', lines:[
      'Chúng tôi được trao quyền và luôn nỗ lực hết mình để vươn xa hơn, khám phá ra những tiềm năng của bản thân.',
      'Chúng tôi làm việc hiệu quả.',
      'Chúng tôi làm việc hết mình với thái độ trách nhiệm và tinh thần lãnh đạo tích cực.'] },
    { vi:'Tinh thần học hỏi không ngừng', en:'Constant learning', lines:[
      'Chúng tôi luôn chủ động nắm bắt cơ hội phát triển.',
      'Chúng tôi dám đối diện với thất bại và lựa chọn thái độ học hỏi từ những sai lầm.',
      'Chúng tôi mở rộng tầm nhìn để đón nhận những ý tưởng khác biệt.'] }
  ];

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
    // y16 — nộp bổ sung ở lần nhắc thứ 4 (YER-SPEC §27.3)
    { id: 'y16', name: 'Mạc Thùy Dung', login: 'dung.mac', ini: 'MD', div: 'PM', dept: 'Product', team: 'Wallet', pos: 'Product Analyst', lvl: 'lm1', goals: [
      { id: 'yg40', type: 'what', title: 'Chuẩn hóa bộ chỉ số theo dõi ví điện tử', result: 'Bộ 12 chỉ số được 4 nhóm sản phẩm dùng trong họp tuần.', status: 'approved', s: '01/01', e: '31/12', prio: 'h', comments: [] },
      { id: 'yg41', type: 'dev', title: 'Nâng cao kỹ năng phân tích thử nghiệm A/B', result: 'Hoàn thành khóa học và thiết kế 3 thử nghiệm cho nhóm Wallet.', status: 'approved', s: '01/03', e: '30/11', prio: null, comments: [] }
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
    // Danh sách Quản lý cấp 2 (e5, e6, e7) và Trưởng đơn vị (e8 đến e12) có đủ hồ sơ LWD, thai sản, nộp trễ (05/10/2026).
    // Chỉ dùng người không có tình huống Nhân viên để không đổi các tình huống E-05.
    e5: { hired: '2017-05-22', resignFrom: '2027-03-31' },
    e6: { hired: '2021-02-01', maternityFrom: '2026-12-01', maternityTo: '2027-06-01' }, e7: { hired: '2018-08-13' },
    e8: { hired: '2016-04-11' }, e9: { hired: '2019-01-07', resignFrom: '2027-03-31' }, e10: { hired: '2020-03-16' },
    e11: { hired: '2015-10-05', maternityFrom: '2026-12-01', maternityTo: '2027-06-01' }, e12: { hired: '2018-11-19' }, e13: { hired: '2017-07-03' },
    e14: { hired: '2021-08-09' }, e15: { hired: '2019-12-02' }, e16: { hired: '2020-01-13' },
    y1: { hired: '2022-05-09' }, y2: { hired: '2021-03-15', maternityFrom: '2026-12-01', maternityTo: '2027-06-01' },
    y3: { hired: '2020-09-01' }, y4: { hired: '2022-01-10' }, y5: { hired: '2019-06-24' },
    y6: { hired: '2018-02-05', resignFrom: '2027-02-15' },
    y7: { hired: '2026-10-15' },
    y8: { hired: '2016-09-12' },
    y9: { hired: '2020-04-06' }, y10: { hired: '2021-07-12' }, y11: { hired: '2022-03-21' },
    y12: { hired: '2020-08-17' },
    y13: { hired: '2021-11-08' }, y14: { hired: '2019-05-20' },
    y15: { hired: '2026-06-15' },
    y16: { hired: '2021-04-12' }
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

  /* Mọi mốc dựng sẵn có giờ, để lịch sử chỉnh sửa của Nhân viên lần gửi nào cũng ghi giờ (§8.2).
     Dữ liệu mẫu dùng chung một giờ; mốc nào cần giờ riêng thì ghi time trong extra. */
  function ev(at, extra) { return Object.assign({ at: at, time: '16:30' }, extra || {}); }

  // s01 — luồng chuẩn, đã đi tới bước HOD
  Y.e1 = {
    scenario: 's01',
    self: ev('2027-01-12', { overall: { score: 4, comment: 'Năm nay tôi hoàn thành các mục tiêu trọng yếu về hiệu năng hệ thống thanh toán và duy trì chất lượng dịch vụ ổn định.' },
      comments: { what: 'Hệ thống thanh toán real-time đạt P99 85ms, vượt mục tiêu 100ms và sớm hơn kế hoạch 2 tháng.', dev: 'Đã đạt chứng chỉ AWS SAA và áp dụng vào thiết kế hạ tầng cho nhóm.', how: 'Chủ động hỗ trợ đồng đội và duy trì tinh thần học hỏi trong suốt năm.' } }),
    lm: ev('2027-01-26', { overall: { score: 4, comment: 'Kết quả năm nay ổn định và có đóng góp rõ ràng vào độ tin cậy của hệ thống thanh toán.' },
      comments: { what: 'Các mục tiêu hiệu năng và giám sát đều đạt, số liệu đo lường rõ ràng.', dev: 'Chứng chỉ AWS được áp dụng thực tế chứ không dừng ở lý thuyết.', how: 'Thể hiện tốt tinh thần đồng đội và thực thi xuất sắc.' } }),
    lm2: ev('2027-02-16', { score: 4, comment: '', source: 'approve' }),
    hod: ev('2027-02-28', { score: 4, comment: '', source: 'approve' }),
    final: { score: 4, uploadedAt: '2027-03-13', approvedAt: '2027-03-27', publishedAt: '2027-04-06' }
  };

  // s02 — chưa tự đánh giá, vẫn còn hạn
  Y.e2 = { scenario: 's02' };

  // e3 đã nghỉ việc nên hồ sơ tự ẩn khỏi danh sách. Không đặt tình huống demo:
  // đã nghỉ thì không vào được màn Đánh giá cuối năm, không có gì để xem.

  // s09 — thai sản, không tự đánh giá, còn thiếu mục tiêu phát triển: QLTT thêm mục tiêu cho nhân viên (§33)
  Y.e4 = {
    scenario: 's09',
    lm: ev('2027-01-28', { overall: { score: 3, comment: 'Ghi nhận nỗ lực duy trì chất lượng kiểm thử trong giai đoạn trước khi nghỉ chế độ.' },
      comments: { what: 'Bộ regression test hoàn thành đúng kế hoạch trước thời điểm nghỉ chế độ.', dev: 'Lộ trình chứng chỉ tạm hoãn, sẽ tiếp tục sau khi quay lại.', how: 'Bàn giao công việc rõ ràng, hỗ trợ đồng đội tiếp nhận thuận lợi.' } })
  };

  // s03 — quá hạn tự đánh giá và không nộp bổ sung, đủ mục tiêu: QLTT chỉ chấm được sau khi hết thời gian
  // nộp bổ sung (03/02/2027), tới hết hạn QLTT; cột NV trống (chốt 02/10/2026)
  Y.e13 = {
    scenario: 's03',
    lm: ev('2027-02-08', { overall: { score: 3.5, comment: 'Kết quả công việc đạt yêu cầu, tuy nhiên cần chủ động hơn trong việc cập nhật tiến độ trên hệ thống.' },
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
    lm2: ev('2027-02-17', { score: 4, comment: '', source: 'manual' })
  };

  // s07 — HRBP tải điểm hộ HOD, chờ HOD duyệt
  Y.e9 = {
    scenario: 's07',
    self: ev('2027-01-13', { overall: { score: 4, comment: 'Chương trình bảo mật năm nay đạt các mốc quan trọng về chứng nhận và tự động hóa.' },
      comments: { what: 'SAST/DAST đã bao phủ toàn bộ repo và duy trì SLA xử lý lỗ hổng.', dev: 'Hoàn thành lộ trình nâng cao về cloud security.', how: 'Phối hợp chặt với các nhóm phát triển để giảm ma sát khi áp dụng chuẩn bảo mật.' } }),
    lm: ev('2027-01-30', { overall: { score: 4, comment: 'Kết quả bảo mật năm nay đáng ghi nhận, đặc biệt là việc duy trì chứng nhận ISO.' },
      comments: { what: 'Không phát sinh NC Major trong kỳ audit.', dev: 'Kiến thức mới được áp dụng ngay vào quy trình.', how: 'Cách tiếp cận hợp tác giúp các nhóm tuân thủ dễ dàng hơn.' } }),
    lm2: ev('2027-02-18', { score: 4, comment: '', source: 'manual' }),
    hrbpUpload: ev('2027-02-26', { score: 4, comment: 'Điểm thống nhất sau phiên rà soát cấp khối.', approved: false, by: 'Lý Minh Châu (chau.ly)' })
  };

  // s16 — Quản lý trực tiếp đã hoàn tất.
  // Nhân viên đã gửi, mở lại chỉnh sửa rồi gửi lại trong hạn: lịch sử chỉnh sửa có sẵn ba dòng (§8).
  Y.e10 = {
    scenario: 's16',
    selfLog: [
      { type: 'submit', at: '2027-01-07', time: '16:20', overall: 4 },
      { type: 'reopen', at: '2027-01-09', time: '09:05' },
      { type: 'resubmit', at: '2027-01-10', time: '14:40', overall: 4.5, changes: { overall: [4, 4.5], overallComment: true, goalScores: 1, goalScoresByType: { what: 1, dev: 0 }, howScores: 0, comments: ['what'] } }
    ],
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
    lm2: ev('2027-02-19', { score: 4.5, comment: 'Đồng thuận với đánh giá của quản lý trực tiếp.', source: 'manual' }),
    // §9: HRBP tải điểm hộ HOD, HOD chưa chấm tay nên duyệt là thành điểm HOD
    hrbpUpload: ev('2027-02-26', { score: 4.5, comment: 'Giữ nguyên mức đề xuất sau phiên rà soát cấp khối.', approved: false, by: 'Lý Minh Châu (chau.ly)' })
  };

  // s20 — đã công bố, điểm cuối khác điểm HOD
  Y.e12 = {
    scenario: 's20',
    self: ev('2027-01-08', { overall: { score: 4, comment: 'Chất lượng ứng dụng di động cải thiện rõ và hai kỹ sư junior đã tiến bộ tốt.' },
      comments: { what: 'Crash rate iOS giảm dưới 0.1% và tính năng Predictive Back đã phát hành đúng hạn.', dev: 'Hai kỹ sư junior đạt mức mid-level theo đánh giá năng lực.', how: 'Chú trọng chất lượng và hỗ trợ phát triển đồng đội.' } }),
    lm: ev('2027-01-22', { overall: { score: 4, comment: 'Các mục tiêu chất lượng ứng dụng được hoàn thành đúng kế hoạch, có đóng góp rõ trong việc phát triển đội ngũ.' },
      comments: { what: 'Chỉ số chất lượng đạt mục tiêu ở cả hai nền tảng.', dev: 'Việc kèm cặp junior mang lại kết quả đo lường được.', how: 'Thể hiện tốt tinh thần dẫn dắt.' } }),
    lm2: ev('2027-02-13', { score: 4, comment: 'Đồng thuận với đánh giá của Quản lý trực tiếp. Năm tới nên chủ động chia sẻ kinh nghiệm chất lượng ứng dụng cho các nhóm khác.', source: 'manual' }),
    hod: ev('2027-02-25', { score: 4.5, comment: 'Ghi nhận thêm đóng góp trong việc phát triển đội ngũ kỹ sư di động.', source: 'manual' }),
    // §9: điểm HRBP tải lên khác điểm HOD đã chấm tay, màn phê duyệt báo khác biệt trước khi thay
    hrbpUpload: ev('2027-02-26', { score: 4, comment: 'Điều chỉnh theo phân bổ chung của khối sau phiên hiệu chuẩn.', approved: false, by: 'Lý Minh Châu (chau.ly)' }),
    final: { score: 4, uploadedAt: '2027-03-11', approvedAt: '2027-03-25', publishedAt: '2027-04-06' }
  };

  // s18 — mục tiêu thay đổi sau kỳ giữa năm
  Y.e5 = {
    scenario: 's18',
    goalChangedAfterMyr: ['g19'],
    self: ev('2027-01-16', { overall: { score: 4, comment: 'Phạm vi mục tiêu có điều chỉnh sau kỳ giữa năm nhưng kết quả cuối năm vẫn đạt cam kết.' },
      comments: { what: 'Mục tiêu migration được điều chỉnh phạm vi vào tháng 8 theo ưu tiên mới của khối.', dev: 'Hoàn thành chứng chỉ CKA đúng kế hoạch.', how: 'Thích ứng nhanh khi ưu tiên thay đổi.' } }),
    lm: ev('2027-01-28', { overall: { score: 4, comment: 'Thích ứng tốt với thay đổi ưu tiên, kết quả cuối năm đạt yêu cầu đề ra.' },
      comments: { what: 'Điều chỉnh phạm vi hợp lý và vẫn giữ được chất lượng bàn giao.', dev: 'Chứng chỉ đạt được và có chia sẻ lại cho nhóm.', how: 'Tinh thần chủ động khi ưu tiên thay đổi.' } }),
    lm2: ev('2027-02-19', { score: 4, comment: 'Đồng thuận với đánh giá của Quản lý trực tiếp.', source: 'manual' })
  };

  // s19 — không có dữ liệu kỳ giữa năm
  Y.e6 = {
    scenario: 's19',
    self: ev('2027-01-17', { voluntary: true, overall: { score: 3.5, comment: 'Năm đầu tiên tham gia đầy đủ chu kỳ đánh giá, tôi tập trung hoàn thành các mục tiêu nền tảng.' },
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
  /* Nộp bổ sung ở từng lần nhắc (§27.3). Mỗi lần dùng một nhân viên ở hai thời điểm:
     ngày nhắc đầu tiên của lần đó thì CHƯA nộp (nv12 đến nv15, đi trọn luồng được),
     ngày cuối của lần đó thì ĐÃ nộp theo bản dựng sẵn dưới đây (nv16 đến nv19).
     Mục tiêu trong file vào thẳng hồ sơ, không qua duyệt. */
  function lateSeed(scenario, at, fileName, goals, overall, scores) {
    var goalScores = {};
    goals.forEach(function (g, i) { goalScores[g.id] = scores[i] != null ? scores[i] : 3; });
    return {
      scenario: scenario,
      importedGoals: { at: at, source: 'employee-late', fileName: fileName, goals: goals },
      lateSubmission: { at: at, fileName: fileName, goals: goals },
      self: ev(at, { late: true, source: 'file-import', fileName: fileName, goalScores: goalScores, howScores: [4, 3, 4, 3, 4],
        comments: { what: 'Các kết quả chính đã hoàn thành theo cam kết đầu năm.', dev: 'Đã hoàn thành kế hoạch phát triển và áp dụng vào công việc.', how: 'Chủ động phối hợp và giữ cam kết với các nhóm liên quan.' },
        overall: { score: overall, comment: 'Hoàn thành phần lớn mục tiêu, cần cải thiện việc cập nhật tiến độ đúng hạn.' } })
    };
  }
  function goalsOf(id) {
    return ((window.PMS_EMPLOYEES || []).filter(function (e) { return e.id === id; })[0] || { goals: [] }).goals
      .filter(function (g) { return g.status === 'approved'; })
      .map(function (g) { return Object.assign({}, g, { status: 'imported' }); });
  }
  Y.y9 = lateSeed('s23', '2027-01-20', 'YER-2026-Nguyen-Mai-Anh.xlsx', goalsOf('y9'), 3.5, [4, 3]);    // lần 1
  Y.y14 = lateSeed('s27', '2027-01-25', 'YER-2026-Dinh-Gia-Han.xlsx',                                   // lần 2, file bù mục tiêu công việc
    [{ id: 'late-y14-what', type: 'what', title: 'Giảm thời gian phản hồi yêu cầu của đối tác', result: 'Thời gian phản hồi trung bình dưới 3 giờ làm việc.', status: 'imported', s: '01/01', e: '31/12', prio: 'h', comments: [] }]
      .concat(goalsOf('y14')), 3.5, [4, 3]);
  Y.e8 = lateSeed('s29', '2027-01-28', 'YER-2026-Nguyen-Thi-Hoa.xlsx',
    goalsOf('e8'), 3, [3, 3]);                                                             // lần 3
  Y.y16 = lateSeed('s28', '2027-02-02', 'YER-2026-Mac-Thuy-Dung.xlsx', goalsOf('y16'), 3, [3, 3]);     // lần 4
  // Danh sách Quản lý cấp 2, Trưởng đơn vị có hồ sơ nộp bổ sung lần 3 mà QLTT chấm vượt mức tối đa 3 (05/10/2026)
  Y.e7 = lateSeed('s31', '2027-01-28', 'YER-2026-Dang-Quang-Vinh.xlsx', goalsOf('e7'), 3, [3, 3]);
  Y.e7.lm = ev('2027-02-05', { overall: { score: 3.5, comment: 'Kết quả tốt nhưng cần nộp hồ sơ đúng hạn.' },
    comments: { what: 'Các mục tiêu chính đạt yêu cầu.', dev: 'Có tiến bộ trong kế hoạch phát triển.', how: 'Phối hợp tốt với nhóm.' }, capConfirmed: { max: 3, score: 3.5, at: '2027-02-05' } });
  Y.e8.lm = ev('2027-02-05', { overall: { score: 3.5, comment: 'Kết quả đạt yêu cầu; cần cải thiện việc nộp hồ sơ đúng hạn.' },
    comments: { what: 'Các mục tiêu chính hoàn thành.', dev: 'Có đầu tư cho kế hoạch phát triển.', how: 'Tinh thần hợp tác tốt.' }, capConfirmed: { max: 3, score: 3.5, at: '2027-02-05' } });
  // HRBP tải điểm hộ HOD cho hồ sơ bị giới hạn điểm 3: duyệt điểm này phải qua popup xác nhận vượt mức (05/10/2026)
  Y.e8.hrbpUpload = ev('2027-02-26', { score: 3.5, comment: 'Giữ mức đề xuất của Quản lý trực tiếp sau phiên rà soát cấp khối.', approved: false, by: 'Lý Minh Châu (chau.ly)' });
  // QLTT gửi đánh giá cho hồ sơ nộp bổ sung ngày 05/02/2027 (tình huống `QLTT đã gửi trên hồ sơ nộp bổ sung`, 04/10/2026)
  Y.y16.lm = ev('2027-02-05', { overall: { score: 3, comment: 'Kết quả đạt yêu cầu; cần cải thiện việc cập nhật tiến độ và nộp hồ sơ đúng hạn.' },
    comments: { what: 'Các mục tiêu chính hoàn thành theo cam kết, số liệu đo lường rõ ràng.', dev: 'Có tiến bộ trong kế hoạch phát triển cá nhân.', how: 'Phối hợp tốt với các nhóm liên quan.' } });
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
    importedGoals: { at: '2027-01-28', source: 'employee-late', fileName: 'YER_2026_pham-thu-trang.xlsx', goals: LATE_Y12_GOALS },
    lateSubmission: { at: '2027-01-28', fileName: 'YER_2026_pham-thu-trang.xlsx', goals: LATE_Y12_GOALS },
    self: ev('2027-01-28', {
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

  /* Nhóm tình huống trên thanh demo M-06 (sắp lại 04/10/2026): theo vai đang xem, rồi Trước / Trong / Sau bước của chính vai đó,
     gọi đúng tên bước trên dải quy trình, nên tên nhóm luôn khớp với bước đang mở trên màn. Nhóm Trong bước của QLTT có ba nhóm con.
     Mỗi tình huống là một giao diện khác nhau ở đúng một ngày. */
  window.PMS_YER_SUBGROUPS = [
    { id: 'lm-pre',     vi: 'QLTT - Trước bước Quản lý trực tiếp', en: 'Line manager - Before the line manager step' },
    { id: 'lm-in-std',  vi: 'QLTT - Trong bước Quản lý trực tiếp: Hồ sơ cần đánh giá', en: 'Line manager - In the step: profiles to review' },
    { id: 'lm-in-late', vi: 'QLTT - Trong bước Quản lý trực tiếp: Nộp bổ sung Tự đánh giá', en: 'Line manager - In the step: late self assessment' },
    { id: 'lm-in-done', vi: 'QLTT - Trong bước Quản lý trực tiếp: QLTT đã gửi', en: 'Line manager - In the step: review submitted' },
    { id: 'lm-post',    vi: 'QLTT - Sau bước Quản lý trực tiếp', en: 'Line manager - After the line manager step' },
    { id: 'lm2-pre',    vi: 'Quản lý cấp 2 - Trước bước Quản lý cấp 2', en: 'Second-level manager - Before the step' },
    { id: 'lm2-in',     vi: 'Quản lý cấp 2 - Trong bước Quản lý cấp 2', en: 'Second-level manager - In the step' },
    { id: 'lm2-post',   vi: 'Quản lý cấp 2 - Sau bước Quản lý cấp 2', en: 'Second-level manager - After the step' },
    { id: 'hod-pre',    vi: 'Trưởng đơn vị - Trước bước Trưởng đơn vị', en: 'Head of department - Before the step' },
    { id: 'hod-in',     vi: 'Trưởng đơn vị - Trong bước Trưởng đơn vị', en: 'Head of department - In the step' },
    { id: 'hod-post',   vi: 'Trưởng đơn vị - Sau bước Trưởng đơn vị', en: 'Head of department - After the step' }
  ];

  window.PMS_YER_SCENARIOS = [
    /* ── Nhân viên ──
       Chốt 28/09/2026: mọi hồ sơ demo của Nhân viên đều là một tình huống có số, không còn nhóm
       Hồ sơ khác (chọn hồ sơ lẻ thì ngày hệ thống không khớp với câu chuyện của hồ sơ). */
    { id: 'nv01', g: 'r-nv', emp: 'e7', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Đủ mục tiêu, chưa tự đánh giá', en: 'Goals complete, not self-assessed yet',
      wvi: 'Luồng chuẩn: form tự đánh giá mở đầy đủ, có Lưu nháp và Gửi tự đánh giá.',
      wen: 'The standard flow: the full self-assessment form with Save draft and Submit.' },
    { id: 'nv02', g: 'r-nv', emp: 'y13', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Thiếu mục tiêu công việc', en: 'Work goal missing',
      wvi: 'Vẫn tự đánh giá và lưu nháp được. Lưu nháp thì nhắc bổ sung mục tiêu; nút Gửi tự đánh giá bị khóa tới khi đủ mục tiêu.',
      wen: 'The employee can still self-assess and save a draft. Saving reminds them to add the goal; submit stays locked until goals are complete.' },
    { id: 'nv03', g: 'r-nv', emp: 'y1', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Thiếu mục tiêu phát triển', en: 'Development goal missing',
      wvi: 'Giống nv02 nhưng thiếu loại mục tiêu còn lại. Nhãn tab Danh sách mục tiêu nói đúng loại còn thiếu.',
      wen: 'Same as nv02 with the other goal type missing. The Goal list tab label names the missing type.' },
    { id: 'nv04', g: 'r-nv', emp: 'y11', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Thiếu cả hai loại mục tiêu', en: 'Both goal types missing',
      wvi: 'Chưa có mục tiêu nào được duyệt: hai bảng mục tiêu trống, vẫn chấm được Mục tiêu hành vi và điểm toàn diện để lưu nháp.',
      wen: 'No approved goals: both goal tables are empty, but behavioral goals and the overall rating can still be drafted.' },
    { id: 'nv05', g: 'r-nv', emp: 'y2', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Đang nghỉ thai sản', en: 'On maternity leave',
      wvi: 'Không bắt buộc tự đánh giá, nhưng vẫn làm được nếu muốn.',
      wen: 'Self assessment is not required, but is still available if wanted.' },
    { id: 'nv06', g: 'r-nv', emp: 'y10', role: 'nv', date: '2027-01-22', screen: 'E-05',
      vi: 'Thiếu mục tiêu và đã quá hạn tự đánh giá', en: 'Goal missing and self assessment overdue',
      wvi: 'Quá hạn, đang ở lần nhắc thứ 2. Màn vẫn hiện đầy đủ nhưng các ô bị khóa; khối trên cùng báo quá hạn, xác nhận đã đọc rồi mở popup nộp bổ sung.',
      wen: 'Overdue at the second reminder. The page shows as usual with locked fields; the top box explains, the employee confirms, then the late-file popup opens.' },
    { id: 'nv07', g: 'r-nv', emp: 'e10', role: 'nv', date: '2027-01-14', screen: 'E-05',
      vi: 'Đã gửi tự đánh giá - còn chỉnh sửa được', en: 'Submitted - still editable',
      wvi: 'Banner đã hoàn thành có nút Chỉnh sửa tới hết hạn tự đánh giá và nút Lịch sử chỉnh sửa.',
      wen: 'The completed banner offers Edit until the self-assessment deadline, plus the edit history.' },
    { id: 'nv08', g: 'r-nv', emp: 'e10', role: 'nv', date: '2027-01-22', screen: 'E-05',
      vi: 'Đã gửi tự đánh giá - đã quá hạn chỉnh sửa', en: 'Submitted - editing closed',
      wvi: 'Quá hạn tự đánh giá nên nút Chỉnh sửa biến mất, chỉ còn xem lại nội dung và lịch sử chỉnh sửa.',
      wen: 'The deadline has passed, so Edit disappears; only the content and the edit history remain.' },
    { id: 'nv09', g: 'r-nv', emp: 'y6', role: 'nv', date: '2027-01-08', screen: 'E-05',
      vi: 'Đã có ngày làm việc cuối cùng', en: 'Last working day already set',
      wvi: 'Badge Ngày làm việc cuối cùng nằm dưới box thông tin nhân viên. Nhân viên vẫn tự đánh giá theo hạn chung.',
      wen: 'The last-working-day badge sits under the employee info box. The employee self-assesses on the normal deadline.' },
    { id: 'nv10', g: 'r-nv', emp: 'y3', role: 'nv', date: '2027-01-12', screen: 'E-05',
      vi: 'Có mục tiêu đã đánh giá hoàn thành với Quản lý cũ', en: 'Goals already closed with the previous manager',
      wvi: 'Mục tiêu đã chốt hoàn thành có nhãn riêng, điểm đã khóa; cột Điểm QLTT ghi domain Quản lý cũ ngay dưới điểm.',
      wen: 'Closed goals carry their own label and a locked score; the manager column shows the previous manager domain under the score.' },
    { id: 'nv11', g: 'r-nv', emp: 'e12', role: 'nv', date: '2027-03-04', screen: 'E-05',
      vi: 'Có nhận xét của Quản lý cấp 2 và Trưởng đơn vị', en: 'Comments from the second-level manager and HOD',
      wvi: 'Đã tự đánh giá, có điểm QLTT. Cuối trang có thêm ô nhận xét của Quản lý cấp 2 và Trưởng đơn vị, không hiện điểm của hai cấp này.',
      wen: 'Self assessment done with line-manager scores. A comment box from the second-level manager and HOD is added at the bottom, without their ratings.' },
    { id: 'nv12', g: 'r-nv', fresh: true, emp: 'y9', role: 'nv', date: '2027-01-19', screen: 'E-05',
      vi: 'Chưa nộp - đang bị nhắc nhở lần 1', en: 'Not submitted - reminder 1',
      wvi: 'Đi trọn luồng: khối cảnh báo, xác nhận đã đọc, popup nộp file, rồi banner đã nộp. Lần 1 chưa áp dụng hình thức xử lý. Khối cảnh báo nói nếu quá hạn lần này thì hệ thống gửi nhắc nhở lần 2.',
      wen: 'The full flow: warning box, confirmation, upload popup, then the submitted banner. Round 1 carries no measure; the warning says reminder 2 follows if this round is missed.' },
    { id: 'nv13', g: 'r-nv', fresh: true, emp: 'y14', role: 'nv', date: '2027-01-22', screen: 'E-05',
      vi: 'Chưa nộp - đang bị nhắc nhở lần 2', en: 'Not submitted - reminder 2',
      wvi: 'Đi trọn luồng: khối cảnh báo, xác nhận đã đọc, popup nộp file, rồi banner đã nộp. Vẫn chưa áp dụng hình thức xử lý; nếu quá hạn lần này thì bắt đầu giới hạn điểm toàn diện tối đa là 3. File nộp bù luôn mục tiêu công việc còn thiếu.',
      wen: 'The full flow: warning box, confirmation, upload popup, then the submitted banner. No measure yet; missing this round starts the rating cap. The file also supplies the missing work goal.' },
    { id: 'nv14', g: 'r-nv', fresh: true, emp: 'e8', role: 'nv', date: '2027-01-27', screen: 'E-05',
      vi: 'Chưa nộp - đang bị nhắc nhở lần 3', en: 'Not submitted - reminder 3',
      wvi: 'Đi trọn luồng: khối cảnh báo, xác nhận đã đọc, popup nộp file, rồi banner đã nộp. Hình thức xử lý: điểm đánh giá toàn diện tối đa là 3; nếu quá hạn lần này thì có thể cắt giảm thưởng và tạm hoãn thăng chức, tăng lương.',
      wen: 'The full flow: warning box, confirmation, upload popup, then the submitted banner. Measure: rating capped at 3; missing this round may lead to a bonus cut and deferral.' },
    { id: 'nv15', g: 'r-nv', fresh: true, emp: 'y16', role: 'nv', date: '2027-02-01', screen: 'E-05',
      vi: 'Chưa nộp - đang bị nhắc nhở lần 4', en: 'Not submitted - reminder 4',
      wvi: 'Đi trọn luồng: khối cảnh báo, xác nhận đã đọc, popup nộp file, rồi banner đã nộp. Hình thức xử lý: cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương 6 tháng; quá hạn lần này thì có thể bị kỷ luật.',
      wen: 'The full flow: warning box, confirmation, upload popup, then the submitted banner. Measure: bonus cut and a 6-month deferral; missing this round may lead to disciplinary action.' },
    { id: 'nv16', g: 'r-nv', fresh: true, emp: 'y9', role: 'nv', date: '2027-01-21', screen: 'E-05',
      vi: 'Đã nộp bổ sung ở lần nhắc thứ 1', en: 'Late file submitted at reminder 1',
      wvi: 'Mở ra là màn đã nộp: banner ghi ngày nộp, nhãn Trễ hạn; lần này chưa có hình thức xử lý.',
      wen: 'Opens on the submitted state: the banner shows the date, the Late label; no measure in this round.' },
    { id: 'nv17', g: 'r-nv', fresh: true, emp: 'y14', role: 'nv', date: '2027-01-26', screen: 'E-05',
      vi: 'Đã nộp bổ sung ở lần nhắc thứ 2', en: 'Late file submitted at reminder 2',
      wvi: 'Mở ra là màn đã nộp: banner ghi ngày nộp, nhãn Trễ hạn; lần này chưa có hình thức xử lý.',
      wen: 'Opens on the submitted state: the banner shows the date, the Late label; no measure in this round.' },
    { id: 'nv18', g: 'r-nv', fresh: true, emp: 'e8', role: 'nv', date: '2027-01-29', screen: 'E-05',
      vi: 'Đã nộp bổ sung ở lần nhắc thứ 3', en: 'Late file submitted at reminder 3',
      wvi: 'Mở ra là màn đã nộp: banner ghi ngày nộp, nhãn Trễ hạn và hình thức xử lý theo quy định.',
      wen: 'Opens on the submitted state: the banner shows the date, the Late label and the measure.' },
    { id: 'nv19', g: 'r-nv', fresh: true, emp: 'y16', role: 'nv', date: '2027-02-03', screen: 'E-05',
      vi: 'Đã nộp bổ sung ở lần nhắc thứ 4', en: 'Late file submitted at reminder 4',
      wvi: 'Mở ra là màn đã nộp: banner ghi ngày nộp, nhãn Trễ hạn và hình thức xử lý theo quy định.',
      wen: 'Opens on the submitted state: the banner shows the date, the Late label and the measure.' },
    { id: 'nv20', g: 'r-nv', emp: 'e2', role: 'nv', date: '2027-02-12', screen: 'E-05',
      vi: 'Không nộp sau 4 lần nhắc nhở', en: 'Not submitted after 4 reminders',
      wvi: 'Hết thời gian nộp bổ sung: chỉ còn một khối vàng báo đã hết hạn và hình thức kỷ luật, các ô đều khóa.',
      wen: 'The late window has closed: one yellow notice about the deadline and disciplinary action; all fields are locked.' },
    // Cùng hồ sơ với nv06 nhưng đã qua hạn nộp bổ sung. fresh: file đã nộp thử ở nv06 không lọt sang đây.
    { id: 'nv21', g: 'r-nv', fresh: true, emp: 'y10', role: 'nv', date: '2027-02-05', screen: 'E-05',
      vi: 'Thiếu mục tiêu và không nộp sau 4 lần nhắc nhở', en: 'Goal missing and not submitted after 4 reminders',
      wvi: 'Giống nv20 nhưng hồ sơ còn thiếu mục tiêu phát triển: cùng một khối vàng báo đã hết hạn, thêm dòng nói loại mục tiêu còn thiếu nên hồ sơ là Không đánh giá.',
      wen: 'Like nv20 but the development goal is missing: the same yellow notice, plus a line naming the missing goal type, so the profile is Not evaluated.' },

    /* ── Quản lý trực tiếp ── */
    /* Tình huống của màn Quản lý (sắp lại 04/10/2026, YER-SPEC §44, §46). Mỗi tình huống là MỘT giao diện ở MỘT ngày.
       sub: nhóm trên thanh demo M-06 (PMS_YER_SUBGROUPS, Trước / Trong / Sau bước của vai). Tên tình huống theo khuôn
       `[Ai] + [tình trạng]` (NV, QLTT, Quản lý cấp 2, Trưởng đơn vị). pair: tình huống Nhân viên cùng hồ sơ để dẫn qua lại.
       Tình huống M-05 không có sub. */
    { id: 'lm01', g: 'r-lm', sub: 'lm-pre', emp: 'e10', role: 'lm', date: '2027-01-14', screen: 'M-06', pair: 'nv07',
      vi: 'NV đã hoàn thành Tự đánh giá', en: 'Employee completed the self assessment',
      wvi: 'Banner xanh Nhân viên đã hoàn thành Tự đánh giá; QLTT chỉ xem, khối Lưu ý nói ngày mở bước QLTT.',
      wen: 'Green banner for the completed self assessment; view only, the note gives the opening date of the manager step.' },
    { id: 'lm02', g: 'r-lm', sub: 'lm-pre', emp: 'y6', role: 'lm', date: '2027-01-08', screen: 'M-06', pair: 'nv09',
      vi: 'NV chưa hoàn thành Tự đánh giá, có LWD', en: 'Employee not self-assessed yet, last working day set',
      wvi: 'Banner xám Nhân viên chưa hoàn thành Tự đánh giá; khối Lưu ý nhắc Nhân viên và QLTT hoàn thành đánh giá khi nhân viên còn làm việc.',
      wen: 'Grey banner for the pending self assessment; the note says the employee and manager must finish while the employee is still working.' },
    { id: 'lm03', g: 'r-lm', sub: 'lm-pre', emp: 'e4', role: 'lm', date: '2027-01-12', screen: 'M-06',
      vi: 'NV nghỉ thai sản', en: 'Employee on maternity leave',
      wvi: 'Khối hướng dẫn ba bước cho nhân viên thai sản; chưa thêm mục tiêu hay chấm được cho tới ngày mở bước QLTT.',
      wen: 'The three-step maternity guide; goals and ratings wait until the manager step opens.' },
    { id: 'lm04', g: 'r-lm', sub: 'lm-in-std', emp: 'e1', role: 'lm', date: '2027-01-22', screen: 'M-06',
      vi: 'NV đã hoàn thành Tự đánh giá, QLTT chưa đánh giá', en: 'Self assessment done, manager not reviewed yet',
      wvi: 'Luồng chuẩn: chấm từng mục tiêu, giá trị cốt lõi, nhận xét và điểm toàn diện. Bấm Gửi khi còn thiếu để xem popup thiếu thông tin và viền đỏ.',
      wen: 'Standard flow: rate each goal and core value, comment, then the overall rating. Submit with gaps to see the missing-info popup and red outlines.' },
    { id: 'lm05', g: 'r-lm', sub: 'lm-in-std', emp: 'y4', role: 'lm', date: '2027-01-20', screen: 'M-06',
      vi: 'NV có mục tiêu QLTT cũ đã đánh giá hoàn thành', en: 'Goals already closed by the former manager',
      wvi: 'Mục tiêu đã chốt có nhãn Đã đánh giá hoàn thành, điểm khóa, domain QLTT cũ dưới điểm; bấm vào dòng để xem popup hai lượt chấm.',
      wen: 'Closed goals carry the label, locked scores and the former manager domain; click the row to see both assessments.' },
    { id: 'lm06', g: 'r-lm', sub: 'lm-in-std', emp: 'y6', role: 'lm', date: '2027-01-25', screen: 'M-06', pair: 'nv09',
      vi: 'NV có LWD', en: 'Employee with a last working day',
      wvi: 'Badge Ngày làm việc cuối cùng dưới thông tin nhân viên; khối Lưu ý nhắc Nhân viên và QLTT hoàn thành đánh giá khi nhân viên còn làm việc.',
      wen: 'Last working day badge; the note says the employee and manager must finish while the employee is still working.' },
    { id: 'lm07', g: 'r-lm', sub: 'lm-in-std', emp: 'e4', role: 'lm', date: '2027-01-22', screen: 'M-06',
      vi: 'NV nghỉ thai sản, QLTT thêm mục tiêu và đánh giá', en: 'Maternity leave, the manager adds goals and reviews',
      wvi: 'Khối hướng dẫn ba bước; QLTT thêm mục tiêu bằng file hoặc nhập tay, mục tiêu tự Đã duyệt, không sửa hay xóa được.',
      wen: 'The three-step guide; the manager adds goals by file or by hand, approved at once and not editable.' },
    { id: 'lm08', g: 'r-lm', sub: 'lm-in-std', emp: 'e13', role: 'lm', date: '2027-02-04', screen: 'M-06',
      vi: 'NV quá hạn sau 4 lần nhắc, đủ mục tiêu: QLTT vẫn đánh giá', en: 'No late file after 4 reminders, goals complete: the manager still reviews',
      wvi: 'Banner xám Nhân viên không Tự đánh giá; QLTT chấm dựa trên mục tiêu, cột điểm nhân viên để trống.',
      wen: 'Grey banner for the missing self assessment; the manager rates against the goals with an empty employee column.' },
    { id: 'lm09', g: 'r-lm', sub: 'lm-in-late', emp: 'y15', role: 'lm', date: '2027-01-20', screen: 'M-06',
      vi: 'NV chưa nộp, đang ở lần nhắc 1', en: 'Not submitted, reminder 1 open',
      wvi: 'Khối vàng Đang chờ nhân viên nộp bổ sung: lần nhắc 1, hạn nộp, chưa có hình thức xử lý. QLTT chưa chấm được.',
      wen: 'Yellow waiting block: reminder 1, its deadline, no measure yet. The manager cannot rate yet.' },
    { id: 'lm10', g: 'r-lm', sub: 'lm-in-late', emp: 'y15', role: 'lm', date: '2027-01-23', screen: 'M-06',
      vi: 'NV chưa nộp, đang ở lần nhắc 2', en: 'Not submitted, reminder 2 open',
      wvi: 'Khối vàng Đang chờ nhân viên nộp bổ sung: lần nhắc 2, hạn nộp, chưa có hình thức xử lý. QLTT chưa chấm được.',
      wen: 'Yellow waiting block: reminder 2, its deadline, no measure yet. The manager cannot rate yet.' },
    { id: 'lm11', g: 'r-lm', sub: 'lm-in-late', emp: 'y15', role: 'lm', date: '2027-01-27', screen: 'M-06',
      vi: 'NV chưa nộp, đang ở lần nhắc 3', en: 'Not submitted, reminder 3 open',
      wvi: 'Khối vàng Đang chờ nhân viên nộp bổ sung: lần nhắc 3, hạn nộp, nộp ở lần này thì giới hạn điểm 3. QLTT chưa chấm được.',
      wen: 'Yellow waiting block: reminder 3, its deadline, submitting now caps the rating at 3. The manager cannot rate yet.' },
    { id: 'lm12', g: 'r-lm', sub: 'lm-in-late', emp: 'y15', role: 'lm', date: '2027-02-01', screen: 'M-06',
      vi: 'NV chưa nộp, đang ở lần nhắc 4', en: 'Not submitted, reminder 4 open',
      wvi: 'Khối vàng Đang chờ nhân viên nộp bổ sung: lần nhắc 4, hạn nộp, nộp ở lần này thì cắt giảm thưởng. QLTT chưa chấm được.',
      wen: 'Yellow waiting block: reminder 4, its deadline, submitting now cuts the bonus. The manager cannot rate yet.' },
    { id: 'lm13', g: 'r-lm', sub: 'lm-in-late', emp: 'y10', role: 'lm', date: '2027-01-22', screen: 'M-06', pair: 'nv06',
      vi: 'NV chưa nộp, đang ở lần nhắc 2, còn thiếu mục tiêu', en: 'Not submitted at reminder 2, a goal missing',
      wvi: 'Khối vàng nói lần nhắc đang mở và loại mục tiêu còn thiếu; nếu hết các lần nhắc mà không nộp thì hồ sơ thành Không đánh giá.',
      wen: 'The yellow block names the open reminder and the missing goal type; if nothing arrives the profile becomes Not evaluated.' },
    { id: 'lm14', g: 'r-lm', sub: 'lm-in-late', emp: 'y9', role: 'lm', date: '2027-01-22', screen: 'M-06', pair: 'nv16',
      vi: 'NV đã nộp bổ sung ở lần nhắc 1', en: 'Late file submitted at reminder 1',
      wvi: 'Banner nộp bổ sung: ngày gửi và nhãn Trễ hạn; tầng dưới ghi lần nhắc, chưa có hình thức xử lý. QLTT chấm như luồng chuẩn.',
      wen: 'Late banner with the date and the Late label; the lower tier shows the reminder, no measure yet. The manager rates as usual.' },
    { id: 'lm15', g: 'r-lm', sub: 'lm-in-late', emp: 'y12', role: 'lm', date: '2027-01-29', screen: 'M-06',
      vi: 'NV đã nộp bổ sung ở lần nhắc 3, giới hạn điểm 3', en: 'Late file at reminder 3, rating capped at 3',
      wvi: 'Tầng dưới banner ghi lần nhắc và hình thức xử lý; khối vàng giới hạn điểm 3 trong ô Đánh giá toàn diện, chấm cao hơn 3 phải tick xác nhận khi gửi.',
      wen: 'The lower tier shows the reminder and the measure; a yellow cap notice sits in the overall rating, and rating above 3 needs a confirmation tick.' },
    { id: 'lm16', g: 'r-lm', sub: 'lm-in-late', emp: 'y16', role: 'lm', date: '2027-02-04', screen: 'M-06', pair: 'nv19',
      vi: 'NV đã nộp bổ sung ở lần nhắc 4, cắt giảm thưởng', en: 'Late file at reminder 4, bonus cut',
      wvi: 'Tầng dưới banner ghi hình thức cắt giảm thưởng và tạm hoãn; ô điểm không có khối giới hạn điểm.',
      wen: 'The lower tier shows the bonus cut and deferral; no cap notice on the rating.' },
    { id: 'lm17', g: 'r-lm', sub: 'lm-in-late', emp: 'y10', role: 'lm', date: '2027-02-04', screen: 'M-06', pair: 'nv21',
      vi: 'NV quá hạn sau 4 lần nhắc, thiếu mục tiêu: Không đánh giá', en: 'No late file, goal missing: not evaluated',
      wvi: 'Khối vàng Hồ sơ không đánh giá ở đầu; các khối mục tiêu và Đánh giá toàn diện vẫn hiện như hồ sơ thường nhưng chỉ để xem, nhóm mục tiêu phát triển trống.',
      wen: 'A yellow Not evaluated block on top; the goal and overall blocks still show as usual but view only, with an empty development group.' },
    { id: 'lm18', g: 'r-lm', sub: 'lm-in-done', emp: 'e10', role: 'lm', date: '2027-01-27', screen: 'M-06', pair: 'nv08',
      vi: 'QLTT đã gửi, còn thời gian chỉnh sửa', en: 'Review submitted, still editable',
      wvi: 'Banner QLTT đã hoàn thành có Ngày gửi, liên kết Lịch sử chỉnh sửa và nút Chỉnh sửa; bấm Chỉnh sửa để xem popup xác nhận và khối đang chỉnh sửa.',
      wen: 'The completed banner shows the date, the edit history link and Edit; Edit opens the confirmation and the editing block.' },
    { id: 'lm19', g: 'r-lm', sub: 'lm-in-done', emp: 'y16', role: 'lm', date: '2027-02-06', screen: 'M-06',
      vi: 'QLTT đã gửi trên hồ sơ nộp bổ sung', en: 'Review submitted on a late profile',
      wvi: 'Banner QLTT đã hoàn thành hai tầng: tầng trên Ngày gửi và Lịch sử chỉnh sửa, tầng dưới ngày nhân viên nộp bổ sung, nhãn Trễ hạn, lần nhắc và hình thức xử lý.',
      wen: 'Two-tier completed banner: the date and edit history on top, the late submission date, Late label, reminder and measure below.' },
    { id: 'lm20', g: 'r-lm', sub: 'lm-post', emp: 'e10', role: 'lm', date: '2027-02-09', screen: 'M-06',
      vi: 'QLTT đã gửi, hết thời gian chỉnh sửa', en: 'Review submitted, editing closed',
      wvi: 'Banner không còn nút Chỉnh sửa, vẫn có Lịch sử chỉnh sửa và nút tải; dải quy trình đã sang bước Quản lý cấp 2.',
      wen: 'No Edit button, the edit history and download stay; the strip has moved on to the second-level step.' },
    { id: 'lm21', g: 'r-lm', sub: 'lm-post', emp: 'y12', role: 'lm', date: '2027-02-09', screen: 'M-06',
      vi: 'QLTT không đánh giá trước hạn', en: 'Manager missed the deadline',
      wvi: 'QLTT chưa gửi mà đã hết hạn: màn chỉ để xem, khối Lưu ý nói bước QLTT đã kết thúc.',
      wen: 'The manager did not submit before the deadline: view only, the note says the step has ended.' },
    { id: 'lm22', g: 'r-lm', sub: 'lm-post', emp: 'e1', role: 'lm', date: '2027-02-20', screen: 'M-06',
      vi: 'Quản lý cấp 2 đã đánh giá', en: 'Second-level manager has rated',
      wvi: 'Banner của QLTT giữ nguyên; dải quy trình ở bước Quản lý cấp 2; thẻ Đánh giá toàn diện bốn ô có điểm và nhận xét của Quản lý cấp 2, ô Trưởng đơn vị còn trống.',
      wen: 'The manager banner stays the same; the strip is at the second-level step and the upper-level block shows that review.' },
    { id: 'lm23', g: 'r-lm', sub: 'lm-post', emp: 'e1', role: 'lm', date: '2027-03-03', screen: 'M-06',
      vi: 'Trưởng đơn vị đã đánh giá', en: 'Head of department has rated',
      wvi: 'Thẻ Đánh giá toàn diện đủ bốn ô có điểm. Điểm cuối cùng vẫn là dấu gạch.',
      wen: 'The upper-level block adds the HOD review. The final rating is still a dash.' },
    { id: 'lm24', g: 'r-lm', sub: 'lm-post', emp: 'e1', role: 'lm', date: '2027-04-06', screen: 'M-06',
      vi: 'Đã công bố kết quả', en: 'Results published',
      wvi: 'Banner Đã công bố kết quả đánh giá cuối năm 2026, Ngày công bố và Điểm cuối cùng có số.',
      wen: 'The published banner with its date and the final rating.' },
    { id: 'lm25', g: 'r-lm', emp: 'y6', role: 'lm', date: '2027-01-25', screen: 'M-05',
      vi: 'Danh sách có đủ ba nhóm cần lưu ý', en: 'Roster showing all three flags at once',
      wvi: 'Cùng một danh sách có nhân viên thai sản, nhân viên có badge LWD và nhóm phải nộp trễ.',
      wen: 'One roster with a maternity case, an LWD badge and the people who must submit late.' },
    { id: 'lm26', g: 'r-lm', emp: 'e14', role: 'lm', date: '2027-02-12', screen: 'M-05',
      vi: 'Quá hạn - hệ thống đồng bộ điểm', en: 'Overdue - score synced by the system',
      wvi: 'Badge HR system cạnh điểm của quản lý, không có nhận xét kèm theo.',
      wen: 'An HR system badge next to the manager score, with no comment attached.' },

    /* ── Quản lý cấp 2 ── */
    /* Tình huống M-06 của Quản lý cấp 2, Trưởng đơn vị dùng đúng người trong danh sách của vai đó (05/10/2026):
       Quản lý cấp 2 e5 (LWD), e6 (thai sản), e7 (nộp bổ sung lần 3); Trưởng đơn vị e8 đến e12. */
    { id: 'lm2-01', g: 'r-lm2', sub: 'lm2-pre', emp: 'e5', role: 'lm2', date: '2027-02-05', screen: 'M-06',
      vi: 'Quản lý cấp 2 chưa tới bước, QLTT đã gửi', en: 'Before the second-level step, manager submitted',
      wvi: 'Banner QLTT đã hoàn thành; dải quy trình chưa tới bước Quản lý cấp 2; khối Lưu ý nhắc LWD 31/03/2027.',
      wen: 'The manager completed banner; the process strip is before the second-level step; the note shows the LWD.' },
    { id: 'lm2-02', g: 'r-lm2', sub: 'lm2-in', emp: 'e5', role: 'lm2', date: '2027-02-17', screen: 'M-06',
      vi: 'Quản lý cấp 2 chưa đánh giá, có điểm NV và QLTT', en: 'Not rated yet, employee and manager rated',
      wvi: 'Banner QLTT đã hoàn thành; dải quy trình ở bước Quản lý cấp 2; thẻ bốn ô, ô Quản lý cấp 2 còn trống; khối Lưu ý nhắc LWD.',
      wen: 'The manager completed banner; four panels with an empty second-level panel; the note shows the LWD.' },
    { id: 'lm2-03', g: 'r-lm2', sub: 'lm2-in', emp: 'e7', role: 'lm2', date: '2027-02-17', screen: 'M-06',
      vi: 'NV nộp bổ sung ở lần nhắc 3, điểm QLTT cao hơn mức tối đa 3', en: 'Late at reminder 3, manager rating above the maximum of 3',
      wvi: 'Banner QLTT đã hoàn thành, tầng dưới ghi ngày nộp bổ sung và hình thức giới hạn điểm 3; ô Quản lý trực tiếp có tag Cao hơn mức tối đa 3. Màn chỉ để xem; Quản lý cấp 2 chấm ở danh sách nhân viên.',
      wen: 'The late banner with the cap measure; the line manager panel carries the Above the maximum of 3 tag.' },
    { id: 'lm2-04', g: 'r-lm2', sub: 'lm2-in', emp: 'e6', role: 'lm2', date: '2027-02-17', screen: 'M-06',
      vi: 'NV nghỉ thai sản, điểm QLTT do hệ thống lấy', en: 'Maternity leave, manager score synced by the system',
      wvi: 'Nhân viên thai sản vẫn tự nguyện Tự đánh giá; ô Quản lý trực tiếp ghi (HR system) vì QLTT quá hạn không chấm. Màn chỉ để xem; Quản lý cấp 2 chấm ở danh sách nhân viên.',
      wen: 'The employee on maternity leave self-assessed anyway; the line manager panel shows (HR system).' },
    { id: 'lm2-05', g: 'r-lm2', sub: 'lm2-in', emp: 'e5', role: 'lm2', date: '2027-02-20', screen: 'M-06',
      vi: 'Quản lý cấp 2 đã đánh giá', en: 'Second-level rating saved',
      wvi: 'Banner Quản lý cấp 2 đã hoàn thành đánh giá cuối năm, Ngày lưu điểm; không có Chỉnh sửa hay Lịch sử chỉnh sửa vì Quản lý cấp 2 chỉ xem ở màn này.',
      wen: 'The completed banner with the save date; no Edit or edit history, since the second-level manager only views this screen.' },
    { id: 'lm2-06', g: 'r-lm2', sub: 'lm2-post', emp: 'e6', role: 'lm2', date: '2027-02-23', screen: 'M-06',
      vi: 'Quản lý cấp 2 không đánh giá trước hạn', en: 'Second-level manager missed the deadline',
      wvi: 'Hết hạn mà chưa chấm: ô Quản lý cấp 2 hiện điểm hệ thống tự lấy kèm (HR system) như ô Quản lý trực tiếp.',
      wen: 'Deadline passed without a rating: the second-level panel shows the system-synced score with (HR system).' },
    { id: 'lm2-07', g: 'r-lm2', emp: 'e15', role: 'lm2', date: '2027-02-27', screen: 'M-05',
      vi: 'Quá hạn - đồng bộ điểm từ quản lý', en: 'Overdue - score synced from the manager',
      wvi: 'Đồng bộ ở tầng thứ hai, vẫn dùng chung một nhãn HR system.',
      wen: 'Second-level sync, still using the same shared HR system label.' },

    /* ── Trưởng đơn vị ── */
    { id: 'hod01', g: 'r-hod', sub: 'hod-pre', emp: 'e12', role: 'hod', date: '2027-02-20', screen: 'M-06',
      vi: 'Trưởng đơn vị chưa tới bước, Quản lý cấp 2 đã đánh giá', en: 'Before the HOD step, second level rated',
      wvi: 'Banner Quản lý cấp 2 đã hoàn thành; dải quy trình chưa tới bước Trưởng đơn vị; ô Trưởng đơn vị còn trống.',
      wen: 'The second-level completed banner; the process strip is before the HOD step; the HOD panel is empty.' },
    { id: 'hod02', g: 'r-hod', sub: 'hod-in', emp: 'e12', role: 'hod', date: '2027-02-24', screen: 'M-06',
      vi: 'Trưởng đơn vị chưa đánh giá, có điểm NV, QLTT và Quản lý cấp 2', en: 'Not rated yet, all lower levels rated',
      wvi: 'Banner Quản lý cấp 2 đã hoàn thành; dải quy trình ở bước Trưởng đơn vị; thẻ bốn ô, ô Trưởng đơn vị còn trống; màn chỉ để xem.',
      wen: 'The second-level completed banner; four panels with an empty HOD panel; view only.' },
    { id: 'hod03', g: 'r-hod', sub: 'hod-in', emp: 'e12', role: 'hod', date: '2027-02-27', screen: 'M-06',
      vi: 'Trưởng đơn vị đã đánh giá', en: 'HOD rating saved',
      wvi: 'Banner Trưởng đơn vị đã hoàn thành đánh giá cuối năm, Ngày lưu điểm; không có Chỉnh sửa hay Lịch sử chỉnh sửa vì Trưởng đơn vị chỉ xem ở màn này.',
      wen: 'The completed banner with the save date; no Edit or edit history, since the HOD only views this screen.' },
    { id: 'hod04', g: 'r-hod', sub: 'hod-post', emp: 'e10', role: 'hod', date: '2027-03-09', screen: 'M-06',
      vi: 'Trưởng đơn vị không đánh giá trước hạn', en: 'HOD missed the deadline',
      wvi: 'Hết hạn mà chưa chấm: ô Trưởng đơn vị để trống vì không đồng bộ từ Quản lý cấp 2 sang Trưởng đơn vị; màn chỉ để xem.',
      wen: 'Deadline passed without a rating: the HOD panel stays empty since nothing syncs from the second level; view only.' },
    { id: 'hod05', g: 'r-hod', emp: 'e1', role: 'hod', date: '2027-02-27', screen: 'M-05',
      vi: 'Lưới điểm toàn đơn vị', en: 'Department-wide score grid',
      wvi: 'Lưới đủ bốn cột điểm; danh sách có hồ sơ nộp bổ sung vượt mức tối đa (dấu cảnh báo), thai sản và LWD.',
      wen: 'The four-column grid, with a late profile above the cap, a maternity case and an LWD.' },
    { id: 'hod06', g: 'r-hod', emp: 'e9', role: 'hod', date: '2027-03-01', screen: 'M-05',
      vi: 'HRBP tải điểm hộ - chờ duyệt', en: 'HRBP uploaded scores - awaiting approval',
      wvi: 'Điểm chưa duyệt nằm ở màn phê duyệt riêng, không hiện ở lưới chính. Duyệt điểm của Nguyễn Thị Hoa (3.5, tối đa 3) thì có popup xác nhận vượt mức.',
      wen: 'Unapproved scores sit in their own approval screen, not in the main grid. Approving the 3.5 above the cap of 3 asks for confirmation.' },
    { id: 'hod07', g: 'r-hod', emp: 'e16', role: 'hod', date: '2027-03-12', screen: 'M-05',
      vi: 'Quá hạn - không đồng bộ', en: 'Overdue - no sync',
      wvi: 'Hồ sơ giữ trạng thái Chờ HOD đánh giá, quy trình vẫn đi tiếp sang bước sau.',
      wen: 'The profile stays in Awaiting HOD and the process still moves on to the next step.' }
  ];

  /* Bản lưu trữ rule nộp trễ cũ chỉ có E-05 và M-06: bỏ màn M-05 và các tình huống mở M-05. */
  delete window.PMS_YER_SCREENS['M-05'];
  window.PMS_YER_SCENARIOS = window.PMS_YER_SCENARIOS.filter(function (sc) { return sc.screen !== 'M-05'; });

  // Thứ tự review chính là thứ tự khai báo ở trên: theo vai trò, trong mỗi vai
  // thì đi từ điều kiện tham gia → luồng chuẩn → ngoại lệ → kết quả.
  window.PMS_YER_SCENARIO_ORDER =
    window.PMS_YER_SCENARIOS.map(function (sc) { return sc.id; });
})();
