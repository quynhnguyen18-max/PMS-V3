/* ═══════════════════════════════
   PMS shared data — single source for M-01, M-02 (and future screens)
   Generated from M-01 EMPS/MYR_DATA. Edit here to update all screens.
═══════════════════════════════ */
window.PMS_EMPLOYEES = [
  /* ── LM1 Direct (4) ── */
  { id:'e1', name:'Nguyễn Văn Tú', login:'tu.nguyen', ini:'NT', div:'ITC', dept:'Backend', pos:'Software Engineer', lvl:'lm1', goals:[
    { id:'g1', type:'what', title:'Tối ưu API response time xuống dưới 200ms với 95th percentile', result:'95% request đạt response time dưới 200ms (P95), đo qua APM dashboard liên tục trong Q2 và Q3/2026.', status:'approved', s:'01/01', e:'31/12', prio:'m', comments:[] },
    { id:'g2', type:'what', title:'Refactor authentication module sang stateless JWT', result:'Toàn bộ luồng xác thực chuyển sang JWT stateless, loại bỏ session store, deploy không downtime, hoàn thành trước 30/09/2026.', status:'update', updNote:'Bổ sung tiêu chí đo lường định lượng và mốc thời gian cụ thể cho từng giai đoạn triển khai.', s:'01/03', e:'31/12', prio:'l', comments:[] },
    { id:'g3', type:'what', title:'Hoàn thiện hệ thống thanh toán real-time với độ trễ < 100ms', result:'Hệ thống xử lý 10,000 giao dịch/giây với độ trễ P99 dưới 100ms. Đo bằng Grafana monitoring dashboard trong 3 tháng liên tục từ Q2/2026.', status:'approved', s:'01/01', e:'31/12', prio:'h', comments:[] },
    { id:'g4', type:'what', title:'Triển khai monitoring và alerting cho toàn bộ microservices', result:'100% microservices có dashboard Grafana và alert rule đầy đủ, giảm MTTR 30% so với năm 2025.', status:'approved', s:'01/01', e:'30/06', prio:'m', comments:[] },
    { id:'g5', type:'dev', title:'Cải thiện kỹ năng system design qua self-study và practice', result:'Hoàn thành 6 bài thực hành system design và 1 buổi mock interview đạt đánh giá tốt từ mentor.', status:'approved', s:'01/01', e:'31/12', prio:null, comments:[] },
    { id:'g6', type:'dev', title:'Hoàn thành khoá AWS Solutions Architect và đạt chứng chỉ', result:'Đạt chứng chỉ AWS Solutions Architect Associate trước 31/12/2026 và áp dụng vào tối thiểu 1 dự án thực tế.', status:'approved', s:'01/01', e:'31/12', prio:null, comments:[] },
  ]},
  { id:'e2', name:'Trần Thị Mai', login:'mai.tran', ini:'TM', div:'ITC', dept:'Frontend', pos:'Software Engineer', lvl:'lm1', goals:[
    { id:'g7', type:'what', title:'Tối ưu Core Web Vitals: LCP < 2.5s và CLS < 0.1', result:'LCP < 2.5s, CLS < 0.1, FID < 100ms trên toàn bộ trang chủ và checkout. Đo qua Lighthouse CI trong 30 ngày liên tiếp.', status:'pending', s:'01/01', e:'30/06', prio:'h', comments:[] },
    { id:'g8', type:'what', title:'Implement MoMo Design System — 30 core components', result:'30 core components hoàn thành với Storybook docs, đạt WCAG 2.1 AA, tích hợp vào ít nhất 2 product team trước Q4.', status:'pending', s:'01/01', e:'31/12', prio:'m', comments:[] },
    { id:'g9', type:'what', title:'Cải thiện UX luồng thanh toán: giảm drop-off 15%', result:'Tỷ lệ hoàn thành thanh toán tăng ≥ 15% so với baseline Q4/2025, đo bằng Mixpanel funnel trong 60 ngày A/B test.', status:'approved', s:'01/01', e:'30/09', prio:'m', comments:[] },
    { id:'g10', type:'dev', title:'Hoàn thành khóa học React Native và build app thực tế', result:'Hoàn thành khóa học, build và deploy 1 ứng dụng demo lên TestFlight trước 31/08/2026.', status:'pending', s:'01/03', e:'31/08', prio:null, comments:[] },
    { id:'g11', type:'dev', title:'Tham dự UX/UI Workshop series tại MoMo', result:'Tham dự ít nhất 4/6 workshop, viết 1 case study ứng dụng sau khi hoàn thành series.', status:'approved', s:'01/01', e:'31/12', prio:null, comments:[] },
  ]},
  { id:'e3', name:'Phạm Minh Đức', login:'duc.pham', ini:'PD', div:'ITC', dept:'Data', pos:'Data Engineer', lvl:'lm1', resigned:true, goals:[
    { id:'g12', type:'what', title:'Xây dựng real-time data pipeline với Kafka và Spark', result:'Pipeline xử lý 1M events/phút, latency < 5 giây, uptime > 99.5%, có đầy đủ monitoring và alert theo SLA.', status:'pending', s:'01/01', e:'30/06', prio:'h', comments:[] },
    { id:'g13', type:'what', title:'Triển khai ML model gợi ý giao dịch cho người dùng mới', result:'Model đạt Precision@10 > 0.3, deploy trên serving infra, A/B test với 10% user base trong 30 ngày liên tiếp.', status:'approved', s:'01/04', e:'31/10', prio:'m', comments:[] },
    { id:'g14', type:'dev', title:'Hoàn thành Data Engineering Zoomcamp và apply thực tế', result:'Hoàn thành 7/7 module, submit capstone project có dùng dữ liệu thực của team trước 30/09/2026.', status:'draft', s:'01/01', e:'30/09', prio:null, comments:[] },
  ]},
  { id:'e4', name:'Vũ Thị Lan', login:'lan.vu', ini:'VL', div:'ITC', dept:'QA', pos:'QA Engineer', lvl:'lm1', maternity:true, goals:[
    { id:'g15', type:'what', title:'Triển khai automated regression test suite cho payment module', result:'200 test cases automation, coverage > 80% happy path, chạy tự động trong CI/CD pipeline với pass rate > 98%.', status:'pending', s:'01/01', e:'31/05', prio:'h', comments:[] },
    { id:'g16', type:'what', title:'Nâng cao test coverage backend API từ 62% lên 85%', result:'Coverage đo bằng JaCoCo ≥ 85% line coverage, không regression trên feature đã stable.', status:'approved', s:'01/01', e:'30/09', prio:'m', comments:[] },
    { id:'g17', type:'dev', title:'Thi đậu ISTQB Advanced Level – Test Analyst', result:'Đậu kỳ thi ISTQB CTAL-TA trước 31/10/2026, đạt tối thiểu 70% tổng điểm.', status:'pending', s:'01/01', e:'31/10', prio:null, comments:[] },
    { id:'g18', type:'dev', title:'Nâng cao kỹ năng Selenium WebDriver qua dự án nội bộ', result:'Hoàn thành 3 module Selenium WebDriver nâng cao, contribute ≥ 20 test scripts vào framework nội bộ.', status:'draft', s:'01/06', e:'31/12', prio:null, comments:[] },
  ]},
  { id:'e13', name:'Lê Hoài Nam', login:'nam.le', ini:'LN', div:'ITC', dept:'Backend', pos:'Senior Software Engineer', lvl:'lm1', goals:[
    { id:'g38', type:'what', title:'Xây dựng microservice xác thực eKYC tích hợp đối tác', result:'Service go-live Q2/2026, xử lý ≥ 500 req/s, error rate < 0.1%, đầy đủ audit log theo chuẩn PCI-DSS.', status:'approved', s:'01/01', e:'30/06', prio:'h', comments:[] },
    { id:'g39', type:'what', title:'Nâng cấp hệ thống phân quyền RBAC lên ABAC', result:'ABAC model phủ 100% resource nhạy cảm, không regression trên permission cũ sau 30 ngày production.', status:'approved', s:'01/01', e:'31/08', prio:'m', comments:[] },
    { id:'g40', type:'dev', title:'Đạt chứng chỉ Google Cloud Professional Developer', result:'Đậu kỳ thi trước 30/09/2026, chia sẻ kiến thức qua ít nhất 1 internal tech talk cho team.', status:'approved', s:'01/01', e:'30/09', prio:null, comments:[] },
  ]},
  { id:'e14', name:'Nguyễn Thị Phương', login:'phuong.nguyen', ini:'NP', div:'ITC', dept:'Data', pos:'Data Scientist', lvl:'lm1', goals:[
    { id:'g41', type:'what', title:'Xây dựng mô hình credit scoring cho MoMo Pay Later', result:'Model F1-score ≥ 0.85 trên test set, deploy serving infra Q3, A/B test 5% user base trong 30 ngày.', status:'update', updNote:'Bổ sung KPI đo lường tác động kinh doanh và timeline cụ thể từng phase.', s:'01/01', e:'30/09', prio:'h', comments:[{self:false, name:'Lê Thị Thanh', ini:'LT', text:'Cần định nghĩa rõ tiêu chí thành công và mốc kiểm tra tiến độ theo từng tháng.', time:'20/01/2026'}] },
    { id:'g42', type:'what', title:'Phân tích hành vi người dùng mới trong 30 ngày đầu', result:'Dashboard phân tích hoàn thành, 3 insight hành vi được trình bày với product team trước Q2/2026.', status:'approved', s:'01/01', e:'31/03', prio:'m', comments:[] },
    { id:'g43', type:'dev', title:'Tham gia Kaggle competition và đạt top 20%', result:'Tham gia 1 competition phù hợp, đạt top 20%, viết writeup chia sẻ với team AI/ML nội bộ.', status:'draft', s:'01/05', e:'31/10', prio:null, comments:[] },
  ]},
  { id:'e15', name:'Trần Văn Khoa', login:'khoa.tran', ini:'TK', div:'ITC', dept:'Mobile', pos:'iOS Engineer', lvl:'lm1', goals:[
    { id:'g44', type:'what', title:'Migrate màn hình thanh toán từ UIKit sang SwiftUI', result:'100% màn hình thanh toán dùng SwiftUI, không regression, App Store rating ≥ 4.7 sau 30 ngày go-live.', status:'approved', s:'01/01', e:'30/09', prio:'h', comments:[] },
    { id:'g45', type:'what', title:'Tích hợp Apple Pay và Face ID cho luồng thanh toán nhanh', result:'Tỷ lệ chuyển đổi tăng ≥ 10% so với OTP PIN, go-live Q2/2026, pass security audit không lỗi P0.', status:'approved', s:'01/01', e:'30/06', prio:'h', comments:[] },
    { id:'g46', type:'dev', title:'Hoàn thành Apple Developer Program và submit app cá nhân', result:'Submit 1 app lên App Store trước cuối năm, đạt ≥ 10 review organic.', status:'approved', s:'01/01', e:'31/12', prio:null, comments:[] },
  ]},
  { id:'e16', name:'Mai Thị Hằng', login:'hang.mai', ini:'MH', div:'ITC', dept:'DevOps', pos:'Platform Engineer', lvl:'lm1', goals:[
    { id:'g47', type:'what', title:'Triển khai Internal Developer Platform trên nền Backstage', result:'IDP go-live Q3/2026, ≥ 10 service đã onboard, developer satisfaction ≥ 4/5 qua khảo sát nội bộ.', status:'pending', s:'01/01', e:'30/09', prio:'h', comments:[] },
    { id:'g48', type:'what', title:'Giảm MTTR từ 45 phút xuống 20 phút cho incident P1/P2', result:'MTTR trung bình ≤ 20 phút qua 3 tháng liên tiếp Q3–Q4/2026, có runbook và playbook đầy đủ.', status:'approved', s:'01/01', e:'31/12', prio:'m', comments:[] },
    { id:'g49', type:'dev', title:'Đạt chứng chỉ HashiCorp Terraform Associate', result:'Đậu Terraform Associate 003 trước 31/08/2026, contribute ≥ 2 Terraform module vào internal library.', status:'approved', s:'01/01', e:'31/08', prio:null, comments:[] },
  ]},
  /* ── LM2 Indirect (3) ── */
  { id:'e5', name:'Lê Văn Hùng', login:'hung.le', ini:'LH', div:'ITC', dept:'Backend', team:'Backend Core', pos:'Senior Engineer', lvl:'lm2', mgr:{name:'Nguyễn Văn Tú', login:'tu.nguyen', ini:'NT'}, goals:[
    { id:'g19', type:'what', title:'Migrate database từ MySQL sang PostgreSQL cho service account', result:'Migration hoàn thành không downtime, performance cải thiện ≥ 20% so với baseline MySQL đo qua benchmark.', status:'approved', s:'01/01', e:'30/06', prio:'h', comments:[] },
    { id:'g20', type:'what', title:'Xây dựng unified logging và distributed tracing system', result:'Tích hợp OpenTelemetry cho 5 core services, dashboard Grafana hiển thị đầy đủ traces và logs tập trung.', status:'approved', s:'01/01', e:'30/09', prio:'m', comments:[] },
    { id:'g21', type:'dev', title:'Hoàn thành Kubernetes Administrator certification (CKA)', result:'Đậu chứng chỉ CKA trước 30/09/2026, chia sẻ learning notes với team.', status:'approved', s:'01/01', e:'30/09', prio:null, comments:[] },
  ]},
  { id:'e6', name:'Hoàng Thị Thu', login:'thu.hoang', ini:'HT', div:'ITC', dept:'Frontend', team:'Frontend Web', pos:'Frontend Engineer', lvl:'lm2', mgr:{name:'Trần Thị Mai', login:'mai.tran', ini:'TM'}, goals:[
    { id:'g22', type:'what', title:'Refactor legacy codebase MoMo Web sang TypeScript strict mode', result:'≥ 80% codebase migrate sang TypeScript strict, zero runtime type error trên production sau 30 ngày go-live.', status:'pending', s:'01/01', e:'31/10', prio:'m', comments:[] },
    { id:'g23', type:'what', title:'Implement end-to-end testing với Playwright', result:'Coverage 50 critical user flows, tích hợp vào CI pipeline với pass rate > 99%.', status:'approved', s:'01/01', e:'31/08', prio:'m', comments:[] },
  ]},
  { id:'e7', name:'Đặng Quang Vinh', login:'vinh.dang', ini:'DV', div:'ITC', dept:'DevOps', team:'Infrastructure', pos:'DevOps Engineer', lvl:'lm2', mgr:{name:'Mai Thị Hằng', login:'hang.mai', ini:'MH'}, goals:[
    { id:'g24', type:'what', title:'Triển khai Infrastructure as Code cho toàn bộ cloud resources', result:'100% cloud infra quản lý bằng Terraform, pipeline IaC qua GitOps với mandatory review trước khi apply.', status:'approved', s:'01/01', e:'30/09', prio:'h', comments:[] },
    { id:'g25', type:'what', title:'Tối ưu CI/CD pipeline: giảm build time từ 18 phút xuống 10 phút', result:'Build time trung bình ≤ 10 phút, đo qua 30 build liên tiếp. Không ảnh hưởng đến độ tin cậy.', status:'pending', s:'01/03', e:'31/10', prio:'m', comments:[] },
  ]},
  /* ── HOD (5) ── */
  { id:'e8', name:'Nguyễn Thị Hoa', login:'hoa.nguyen', ini:'NH', div:'PM', dept:'Product', pos:'Product Manager', lvl:'hod', mgr:{name:'Trần Quang Huy', login:'huy.tran', ini:'TH'}, mgr2:{name:'Phạm Thành Long', login:'long.pham', ini:'PL'}, goals:[
    { id:'g26', type:'what', title:'Launch tính năng MoMo Pay Later Q2/2026', result:'Go-live đúng timeline Q2, DAU đạt ≥ 50K trong 30 ngày đầu sau launch.', status:'approved', s:'01/01', e:'30/06', prio:'h', comments:[] },
    { id:'g27', type:'what', title:'Tăng NPS sản phẩm chính từ 42 lên 55 cuối năm 2026', result:'NPS survey tháng 12/2026 đạt ≥ 55, sample size ≥ 1000 users. Phân tích detractor để có action plan.', status:'pending', s:'01/01', e:'31/12', prio:'m', comments:[] },
  ]},
  { id:'e9', name:'Bùi Quốc Anh', login:'anh.bui', ini:'BA', div:'ITC', dept:'Security', pos:'Security Engineer', lvl:'hod', mgr:{name:'Lê Văn Dũng', login:'dung.le', ini:'LD'}, mgr2:{name:'Nguyễn Minh Quân', login:'quan.nguyen', ini:'NQ'}, goals:[
    { id:'g28', type:'what', title:'Triển khai SAST/DAST scanning tự động vào SDLC', result:'100% repo có SAST tự động, DAST chạy weekly, zero P0/P1 finding tồn tại quá 48h.', status:'approved', s:'01/01', e:'30/06', prio:'h', comments:[] },
    { id:'g29', type:'what', title:'Đạt ISO 27001 re-certification cho ITC cluster', result:'Hoàn thành audit không có NC Major, giấy chứng nhận được duy trì liên tục.', status:'pending', s:'01/01', e:'31/08', prio:'h', comments:[] },
  ]},
  { id:'e10', name:'Đinh Thị Linh', login:'linh.dinh', ini:'DL', div:'ITC', dept:'AI/ML', pos:'ML Engineer', lvl:'hod', mgr:{name:'Vũ Hoàng Nam', login:'nam.vu', ini:'VN'}, mgr2:{name:'Nguyễn Minh Quân', login:'quan.nguyen', ini:'NQ'}, goals:[
    { id:'g30', type:'what', title:'Build MLOps platform phục vụ 20+ ML models nội bộ', result:'Platform triển khai xong Q3, phục vụ ≥ 15 models trong production với SLA 99.9%.', status:'approved', s:'01/01', e:'30/09', prio:'h', comments:[] },
    { id:'g31', type:'what', title:'Giảm chi phí inference 30% qua model optimization', result:'Cost benchmark trước/sau, giảm ≥ 30% khi vẫn giữ accuracy ≥ 95% baseline đo qua holdout set.', status:'approved', s:'01/01', e:'31/10', prio:'m', comments:[] },
    { id:'g32', type:'dev', title:'Nghiên cứu LLM Fine-tuning và trình bày tech talk nội bộ', result:'Hoàn thành 1 thực nghiệm fine-tuning có tài liệu, tổ chức tech talk nội bộ cho ≥ 10 engineers.', status:'draft', s:'01/07', e:'31/12', prio:null, comments:[] },
  ]},
  { id:'e11', name:'Cao Văn Minh', login:'minh.cao', ini:'CM', div:'ITC', dept:'Infra', pos:'Infrastructure Engineer', lvl:'hod', mgr:{name:'Hoàng Văn Đức', login:'duc.hoang', ini:'HD'}, mgr2:{name:'Nguyễn Minh Quân', login:'quan.nguyen', ini:'NQ'}, goals:[
    { id:'g33', type:'what', title:'Nâng cấp Kubernetes 1.30 cho toàn bộ production cluster', result:'Upgrade hoàn thành zero downtime, rollback plan được test thành công, runbook đầy đủ.', status:'approved', s:'01/01', e:'31/03', prio:'h', comments:[] },
    { id:'g34', type:'what', title:'Triển khai Disaster Recovery site cho hệ thống core', result:'DR site hoạt động với RTO < 4h và RPO < 15 phút. DR drill thành công ≥ 2 lần trong năm.', status:'pending', s:'01/04', e:'31/12', prio:'h', comments:[] },
  ]},
  { id:'e12', name:'Phan Thị Bích', login:'bich.phan', ini:'PB', div:'ITC', dept:'Mobile', pos:'Mobile Engineer', lvl:'hod', mgr:{name:'Đinh Văn Tùng', login:'tung.dinh', ini:'DT'}, mgr2:{name:'Lê Thị Nga', login:'nga.le', ini:'LN'}, goals:[
    { id:'g35', type:'what', title:'Giảm crash rate iOS xuống dưới 0.1%', result:'Crash-free rate > 99.9% trên Firebase Crashlytics, đo liên tục 30 ngày sau fix.', status:'approved', s:'01/01', e:'30/06', prio:'h', comments:[] },
    { id:'g36', type:'what', title:'Launch Android Predictive Back Gesture', result:'100% màn hình hỗ trợ Predictive Back API, Google Play rating tăng ≥ 0.1 sao trong 60 ngày sau.', status:'approved', s:'01/01', e:'30/09', prio:'m', comments:[] },
    { id:'g37', type:'dev', title:'Đào tạo 2 junior mobile engineers lên mid-level', result:'2 junior đạt mid-level assessment sau 6 tháng, đánh giá qua code review + peer feedback.', status:'approved', s:'01/01', e:'31/12', prio:null, comments:[] },
  ]},
];

window.PMS_MYR = {
  e1:{submitted:true,nv:4,lm1:null,lm2:null,hod:null,final:null},
  e2:{submitted:true,nv:3.5,lm1:4,lm2:null,hod:null,final:4},
  e3:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e4:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e5:{submitted:true,nv:4,lm1:4,lm2:4.5,hod:null,final:4.5},
  e6:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e7:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e8:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e9:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e10:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e11:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e12:{submitted:true,nv:4,lm1:4,lm2:4,hod:4.5,final:4.5},
  e13:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e14:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null},
  e15:{submitted:true,nv:4.5,lm1:4.5,lm2:4,hod:null,final:4},
  e16:{submitted:false,nv:null,lm1:null,lm2:null,hod:null,final:null}
};

window.PMS_SELFEVAL = {
  e1: {
    goalScores: { g1:4, g3:4, g4:3, g5:4, g6:3 },
    howScores: [4,4,5,4,5],
    comments: {
      what: 'Hoàn thành mục tiêu trọng tâm hệ thống thanh toán real-time với P99 ổn định 85ms, vượt target 100ms và sớm 2 tháng so với kế hoạch.',
      dev: 'Đã đậu chứng chỉ AWS SAA-C03 đúng hạn và chia sẻ kiến thức với team qua một buổi tech talk nội bộ.',
      how: 'Chủ động thể hiện các giá trị cốt lõi trong công việc hằng ngày, đặc biệt là tinh thần đồng đội và học hỏi không ngừng.'
    },
    overall: { score:4, comment:'Nhìn chung tôi hoàn thành trên mức kỳ vọng trong kỳ MYR 2026 và cam kết tiếp tục nâng cao năng lực trong nửa cuối năm.' }
  },
  e2: {
    goalScores: { g9:4, g11:3 },
    howScores: [4,3,4,4,4],
    comments: {
      what: 'Cải thiện UX luồng thanh toán giúp tăng tỷ lệ hoàn thành trên 15% so với baseline Q4/2025 qua A/B test 60 ngày.',
      dev: 'Tham dự đủ chuỗi UX/UI Workshop và đang hoàn thiện case study ứng dụng cho team.',
      how: 'Luôn đặt trải nghiệm người dùng làm trung tâm và phối hợp tốt với product team.'
    },
    overall: { score:3.5, comment:'Tôi cơ bản hoàn thành các mục tiêu chính, một số hạng mục dài hạn vẫn đang tiếp tục triển khai theo đúng lộ trình.' }
  },
  e5: {
    goalScores: { g19:4, g20:4, g21:4 },
    howScores: [4,4,5,4,4],
    comments: {
      what: 'Hoàn thành migrate database sang PostgreSQL không downtime, hiệu năng cải thiện trên 20%; hệ thống logging/tracing tập trung đã go-live.',
      dev: 'Đã đậu chứng chỉ CKA và chia sẻ learning notes cho team.',
      how: 'Đề cao thực thi xuất sắc và hỗ trợ đồng đội trong các sự cố vận hành.'
    },
    overall: { score:4, comment:'Tôi hoàn thành tốt các mục tiêu kỹ thuật trọng tâm và đóng góp ổn định cho team Backend Core.' }
  },
  e12: {
    goalScores: { g35:4, g36:4, g37:4 },
    howScores: [4,4,4,5,4],
    comments: {
      what: 'Giảm crash rate iOS xuống dưới 0.1% và launch thành công Predictive Back trên Android đúng tiến độ.',
      dev: 'Đã kèm cặp 2 junior engineer đạt mức mid-level qua đánh giá code review và peer feedback.',
      how: 'Chú trọng thực thi xuất sắc và tinh thần đồng đội khi dẫn dắt các bạn junior.'
    },
    overall: { score:4, comment:'Tôi hoàn thành trên mức kỳ vọng cả về kết quả kỹ thuật lẫn phát triển đội ngũ.' }
  },
  e15: {
    goalScores: { g44:5, g45:4, g46:5 },
    howScores: [5,4,5,4,5],
    comments: {
      what: 'Hoàn thành migrate màn hình thanh toán sang SwiftUI và tích hợp Apple Pay/Face ID, App Store rating duy trì trên 4.7.',
      dev: 'Đã submit app cá nhân lên App Store và nhận hơn 10 review organic.',
      how: 'Luôn đổi mới sáng tạo và học hỏi không ngừng để áp dụng công nghệ mới vào sản phẩm.'
    },
    overall: { score:4.5, comment:'Tôi tự đánh giá hoàn thành vượt mong đợi ở các mục tiêu trọng tâm trong kỳ này.' }
  }
};

window.PMS_LM1EVAL = {
  e2: {
    goalScores: { g9:4, g11:4 },
    howScores: [4,4,4,4,4],
    comments: {
      what: 'Kết quả cải thiện trải nghiệm thanh toán đạt mục tiêu và có số liệu theo dõi rõ ràng.',
      dev: 'Chủ động áp dụng kiến thức từ workshop vào công việc thực tế.',
      how: 'Phối hợp tốt với Product và giữ tư duy tập trung vào khách hàng.'
    },
    overall: { score:4, comment:'Hoàn thành tốt các mục tiêu trọng tâm và thể hiện tinh thần hợp tác tích cực.' }
  },
  e5: {
    goalScores: { g19:4, g20:4, g21:4 },
    howScores: [4,4,5,4,4],
    comments: {
      what: 'Hoàn thành tốt các hạng mục migration và observability, không ảnh hưởng vận hành.',
      dev: 'Đạt chứng chỉ CKA và chia sẻ kiến thức có giá trị cho đội ngũ.',
      how: 'Thể hiện rõ tinh thần đồng đội và trách nhiệm trong thực thi.'
    },
    overall: { score:4, comment:'Kết quả ổn định, đáp ứng tốt kỳ vọng của vai trò Senior Engineer.' }
  },
  e12: {
    goalScores: { g35:4, g36:4, g37:4 },
    howScores: [4,4,4,5,4],
    comments: {
      what: 'Các mục tiêu chất lượng ứng dụng được hoàn thành đúng kế hoạch.',
      dev: 'Có đóng góp rõ ràng trong việc phát triển năng lực hai thành viên junior.',
      how: 'Thực thi xuất sắc và hỗ trợ đồng đội hiệu quả.'
    },
    overall: { score:4, comment:'Hoàn thành trên mức kỳ vọng về kỹ thuật và phát triển đội ngũ.' }
  },
  e15: {
    goalScores: { g44:5, g45:4, g46:5 },
    howScores: [5,4,5,4,5],
    comments: {
      what: 'Hoàn thành nổi bật các hạng mục SwiftUI và phương thức thanh toán mới.',
      dev: 'Chủ động học hỏi và chuyển hóa kiến thức thành sản phẩm thực tế.',
      how: 'Thể hiện tốt tinh thần đổi mới, đồng đội và học hỏi không ngừng.'
    },
    overall: { score:4.5, comment:'Kết quả nổi bật, vượt kỳ vọng ở nhiều mục tiêu quan trọng.' }
  }
};
