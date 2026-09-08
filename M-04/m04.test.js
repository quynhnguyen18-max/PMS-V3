const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const pagePath = path.join(__dirname, 'index.html');
const detailPath = path.join(__dirname, 'feedback-detail.html');

test('M-04 provides D1 direct and indirect report navigation', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /id="tab-direct"/);
  assert.match(html, /id="tab-indirect"/);
  assert.match(html, /id="tab-lm2"/);
  assert.match(html, /id="tab-hod"/);
  assert.match(html, /function setScope\(/);
  assert.match(html, /window\.PMS_EMPLOYEES/);
});

test('manager cycle selector sits in the top-right page header', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /<div class="page-head">[\s\S]*?<div class="cycle-row">[\s\S]*?<select class="cycle-sel" id="cycle"/);
  assert.match(html, /class="bx bx-calendar"/);
  assert.match(html, /<span class="cycle-lbl">Chu kỳ<\/span>/);
  // Cùng một pattern chu kỳ với E-01/E-04/E-05/M-01/M-02 — không dùng biến thể pill riêng cho M-04.
  assert.match(html, /\.cycle-row\{display:flex;align-items:center;gap:8px/);
  assert.match(html, /\.cycle-lbl\{font-size:13px;font-weight:500;color:var\(--z700\)\}/);
  assert.doesNotMatch(html, /manager-cycle/);
  const scopeRow = html.match(/<div class="scope-row">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] || '';
  assert.doesNotMatch(scopeRow, /id="cycle"/);
});

test('manager cycle selector shows the cycle date range as secondary text', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /<span class="cycle-range" id="cycleRange"/);
  assert.match(html, /'2026':\['01\/01\/2026','30\/04\/2027'\]/);
  assert.match(html, /function renderAllManagerViews\(\)\{renderCycleRange\(\);/);
  assert.match(html, /\.cycle-range\{font-size:12px;font-weight:400;color:var\(--z500\)/);
});

const requestModelPath = path.join(__dirname, 'manager-request-model.js');
const RESIGNED = new Set(['duc.pham', 'e3']);
const isResigned = person => RESIGNED.has(String((person && person.login) || '').toLowerCase()) || RESIGNED.has(String((person && person.id) || ''));
const ticket = (id, reviewerLogin, recipient, status) => ({
  id, reviewer: { name: reviewerLogin, login: reviewerLogin },
  employeeId: recipient, employeeLogin: recipient, employeeName: recipient,
  status: status || 'pending', manualReminderHistory: []
});
const makeRequest = (assignments, extra) => Object.assign({
  id: 'req', goal: 'G', createdAt: '01/08/2026', due: '15/08/2026',
  createdBy: { name: 'Lê Thị Thanh', login: 'thanh.le' }, assignments
}, extra || {});
const TODAY = '10/08/2026';

test('request detail rail matches H-06: custom tooltip, lock icon and a draggable width', () => {
  const detail = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  const hr = fs.readFileSync(path.join(__dirname, '..', 'H-06', 'index.html'), 'utf8');

  // tooltip: component dùng chung, hiện phía trên, chỉ cơ cấu tổ chức (DS §8.1 - không lặp tên/domain)
  assert.ok(detail.includes('<span class="identity pms-tooltip" tabindex="0"><span class="identity-text">'));
  assert.ok(hr.includes('<span class="identity pms-tooltip" tabindex="0"><span class="identity-text">'));
  assert.ok(detail.includes('class="pms-tooltip-content pms-tooltip-top"'));
  assert.ok(detail.includes("function railOrg(person){return [person&&person.dept,person&&person.team,person&&person.pos]"));
  assert.ok(!detail.includes('<span class="identity" title='), 'không được dùng title mặc định cho dữ liệu nhân sự');
  // rail cắt overflow nên tooltip phải neo theo hàng để luôn vừa bề ngang
  assert.ok(detail.includes('.rail .pms-tooltip-content{left:13px;right:13px;width:auto'));
  // tooltip phải neo lên TRÊN trong rail, nếu để rule gốc đè xuống dưới thì bị rail cắt mất chữ
  assert.ok(detail.includes('top:auto;bottom:calc(100% + 7px)}'));
  assert.ok(detail.includes('.rail .pms-tooltip-content::after{left:18px;transform:none;top:100%;bottom:auto'));
  // ổ khoá + Mở lại ở header người nhận: chỉ khi có từ 2 người nhận, nút cùng cỡ với H-06
  assert.ok(detail.includes('const multi=ManagerRequestModel.byEmployee(request,todayDMY()).length>=2;'));
  assert.ok(detail.includes('class="btn btn-outline btn-share" onclick="reopenClosedRecipient('));
  assert.ok(detail.includes('.btn-share{height:30px;padding:0 10px;font-size:11.5px;font-weight:600}'));
  assert.ok(hr.includes('.btn-share{height:30px;padding:0 10px;font-size:11.5px;font-weight:600}'));
  assert.ok(detail.includes('.ticket-lock{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px'));
  assert.ok(hr.includes('.ticket-lock{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px'));
  // người nhận đã đóng thì không còn gì để nhắc — ẩn hẳn nút, và mọi thao tác gom về một nhóm bên phải
  assert.ok(detail.includes('const openPending=pending.filter(item=>!ManagerRequestModel.isTicketClosed(item));'));
  assert.ok(detail.includes("remindAll.style.display=openPending.length&&!locked?'':'none'"));
  assert.ok(detail.includes('<div class="pane-actions"><span id="recipientActions"'));
  assert.ok(detail.includes('.pane-actions{display:flex;align-items:center;gap:7px}'));
  assert.ok(hr.includes('.pane-actions{display:flex;align-items:center;gap:7px}'));

  // ổ khoá cho người nhận đã đóng — cùng markup với H-06
  assert.ok(detail.includes('<i class="bx bx-lock-alt person-lock" title="Đã đóng"></i>'));
  assert.ok(hr.includes('<i class="bx bx-lock-alt person-lock" title="Đã đóng"></i>'));
  assert.ok(detail.includes('.person-lock{align-self:center;flex:none;font-size:15px;color:var(--z500)}'));
  assert.ok(hr.includes('.person-lock{align-self:center;flex:none;font-size:15px;color:var(--z500)}'));

  // kéo giãn cột trái — cùng cơ chế và cùng khoảng 240-360px với H-06
  assert.ok(detail.includes('id="railResizer" role="separator" aria-orientation="vertical"'));
  assert.ok(hr.includes('id="railResizer" role="separator" aria-orientation="vertical"'));
  assert.ok(detail.includes('grid-template-columns:var(--rail-w) minmax(440px,1fr) 280px'));
  assert.match(detail, /const MIN=240,MAX=360,KEY='uc5_m04_rail_w';/);
  assert.match(hr, /const MIN=240,MAX=360,KEY='uc5_h06_rail_w';/);
  // breakpoint hẹp cũng phải kéo được, không hard-code lại số
  assert.ok(detail.includes('.request-detail-layout{--rail-w:220px;grid-template-columns:var(--rail-w)'));
});

test('D4 seed demonstrates both resignation cases, with recipients always direct reports', () => {
  const model = require(requestModelPath);
  const seed = require('./manager-request-seed.js');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets', 'employees-data.js'), 'utf8'), context);
  const employees = context.window.PMS_EMPLOYEES;
  const isResigned = person => employees.some(item => item.resigned
    && ((person && person.id && item.id === person.id)
      || (person && person.login && String(item.login).toLowerCase() === String(person.login).toLowerCase())));
  const requests = seed.create(employees);
  model.applyResignationAll(requests, isResigned);
  const TODAY_SEED = '10/08/2026';

  // quản lý chỉ được yêu cầu phản hồi CHO direct report của mình
  const directIds = new Set(model.directReports(employees).map(item => item.id));
  requests.forEach(request => {
    request.designees.forEach(person => {
      assert.ok(directIds.has(person.id), `${person.name} không phải direct report của quản lý`);
    });
  });

  // (1) người NHẬN phản hồi nghỉ việc → mọi ticket đóng, cả yêu cầu đóng
  const recipientLeft = requests.find(item => item.id === 'manager-request-recipient-left');
  assert.ok(recipientLeft, 'thiếu kịch bản người nhận nghỉ việc');
  assert.equal(recipientLeft.designees.length, 1);
  assert.ok(isResigned(recipientLeft.designees[0]));
  assert.ok(recipientLeft.assignments.every(item => item.closedByResignation === 'recipient'));
  assert.equal(model.activeAssignments(recipientLeft).length, 0);
  assert.equal(model.requestStatus(recipientLeft, TODAY_SEED), 'closed');

  // (2) người CHO phản hồi nghỉ việc → chỉ ticket của họ đóng, yêu cầu vẫn chạy
  const reviewerLeft = requests.find(item => item.id === 'manager-request-reviewer-left');
  assert.ok(reviewerLeft, 'thiếu kịch bản người cho phản hồi nghỉ việc');
  const stopped = reviewerLeft.assignments.filter(item => item.closedByResignation === 'reviewer');
  assert.ok(stopped.length >= 2, 'phải có ticket của người cho phản hồi đã nghỉ');
  assert.ok(model.activeAssignments(reviewerLeft).length > 0, 'các ticket còn lại phải tiếp tục thu thập');
  assert.notEqual(model.requestStatus(reviewerLeft, TODAY_SEED), 'closed');
  // người cho phản hồi không trùng người nhận, cho dễ đọc trên màn hình
  const designeeLogins = new Set(reviewerLeft.designees.map(item => item.login));
  assert.ok(reviewerLeft.reviewers.every(item => !designeeLogins.has(item.login)));
});

test('a single-ticket request closes when its reviewer resigns', () => {
  const model = require(requestModelPath);
  const request = model.applyResignation(makeRequest([ticket('t1', 'duc.pham', 'e1')]), isResigned);
  assert.equal(model.isTicketClosed(request.assignments[0]), true);
  assert.equal(model.closeReason(request, TODAY), 'no-active-ticket');
  assert.equal(model.requestStatus(request, TODAY), 'closed');
});

test('a multi-ticket request keeps running when one reviewer resigns', () => {
  const model = require(requestModelPath);
  const request = model.applyResignation(makeRequest([
    ticket('t1', 'duc.pham', 'e1'), ticket('t2', 'mai.tran', 'e1')
  ]), isResigned);
  assert.equal(model.isTicketClosed(request.assignments[0]), true);
  assert.equal(model.isTicketClosed(request.assignments[1]), false);
  assert.equal(model.activeAssignments(request).length, 1);
  assert.equal(model.requestStatus(request, TODAY), 'collecting');
});

test('when the recipient resigns the ticket closes, only unanswered reviewers are notified and reminders lock', () => {
  const model = require(requestModelPath);
  const request = model.applyResignation(makeRequest([
    ticket('t1', 'mai.tran', 'duc.pham'), ticket('t2', 'lan.vu', 'duc.pham', 'done')
  ]), isResigned);
  assert.equal(request.assignments[0].closedByResignation, 'recipient');
  assert.equal(request.assignments[0].notifyReviewerClosed, true);
  // đã trả lời rồi thì không báo, và phản hồi thu được vẫn tính
  assert.equal(request.assignments[1].closedByResignation, null);
  assert.equal(request.assignments[1].notifyReviewerClosed, false);
  assert.equal(model.summarize(request, TODAY).done, 1);
  assert.equal(model.canRemindAssignment(request, request.assignments[0], TODAY + ' 09:00'), false);
});

test('every request closes when the manager who created it resigns', () => {
  const model = require(requestModelPath);
  const request = model.applyResignation(
    makeRequest([ticket('t1', 'mai.tran', 'e1')], { createdBy: { login: 'duc.pham' } }), isResigned);
  assert.equal(model.closeReason(request, TODAY), 'creator-resigned');
  assert.equal(model.closeReasonText(request, TODAY), 'Quản lý tạo yêu cầu đã nghỉ việc');
});

test('a request can be closed on purpose and reports that reason', () => {
  const model = require(requestModelPath);
  const request = model.closeManually(model.applyResignation(makeRequest([ticket('t1', 'mai.tran', 'e1')]), isResigned));
  assert.equal(model.closeReason(request, TODAY), 'manual');
  assert.equal(model.closeReasonText(request, TODAY), 'Quản lý đã chủ động đóng');
});

test('the 90-day expiry still closes a request with unanswered tickets', () => {
  const model = require(requestModelPath);
  const request = model.applyResignation(makeRequest([ticket('t1', 'mai.tran', 'e1')]), isResigned);
  assert.equal(model.closeReason(request, '10/08/2026'), null);
  assert.equal(model.closeReason(request, '01/12/2026'), 'expired');
});

test('a reviewer who answered before resigning still counts toward the total', () => {
  const model = require(requestModelPath);
  const request = model.applyResignation(makeRequest([ticket('t1', 'duc.pham', 'e1', 'done')]), isResigned);
  assert.equal(request.assignments[0].closedByResignation, null);
  assert.equal(model.summarize(request, TODAY).total, 1);
  assert.equal(model.requestStatus(request, TODAY), 'complete');
});

test('manager screens apply the resignation rules and name the closed ticket', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const detail = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  assert.match(html, /ManagerRequestModel\.applyResignationAll\(list,isResignedPerson\)/);
  assert.match(detail, /ManagerRequestModel\.applyResignation\(request,isResignedPerson\)/);
  // cùng bảng trạng thái ticket với H-06: user-x + "Ngừng thu thập", lock + "Đóng", time + "Chưa trả lời"
  const hrDetail = fs.readFileSync(path.join(__dirname, '..', 'H-06', 'index.html'), 'utf8');
  ['Ngừng thu thập', 'Chưa trả lời', 'bx-user-x', 'bx-lock-alt', 'bx-time-five'].forEach(token => {
    assert.ok(detail.includes(token), `màn quản lý thiếu: ${token}`);
    assert.ok(hrDetail.includes(token), `H-06 không còn: ${token}`);
  });
  assert.ok(detail.includes('Đóng · người nhận nghỉ việc'));
  assert.ok(detail.includes("if(item&&item.closedByResignation==='reviewer')return 'bx-user-x';"));
  // màn quản lý không ghi lại việc "đã báo" — luật thông báo thuộc về màn nhân viên
  assert.ok(!detail.includes('Đã báo'));
  assert.ok(!detail.includes('pending-note'));
  assert.match(detail, /Người nhận phản hồi đã nghỉ việc, không cần thu thập nữa/);
  // DS §8.2: ticket đã khoá dùng xám trung tính, không dùng vàng "đang chờ"
  assert.match(detail, /\.pending\.pending\.pending-closed\{background:var\(--z50\)/);
});

test('a manager closes from the request detail screen, at request or recipient scope, like HR does in H-06', () => {
  const detail = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  const list = fs.readFileSync(pagePath, 'utf8');
  const hr = fs.readFileSync(path.join(__dirname, '..', 'H-06', 'index.html'), 'utf8');

  // nút nằm ở màn chi tiết, KHÔNG nằm ở danh sách yêu cầu
  assert.ok(detail.includes('<i class="bx bx-lock-alt"></i> Đóng yêu cầu</button>'));
  assert.ok(hr.includes('<i class="bx bx-lock-alt"></i> Đóng yêu cầu</button>'));
  assert.ok(!list.includes('closeRequest('));
  assert.ok(!list.includes('request-row-actions'));

  // hai phạm vi đóng, cùng cách diễn đạt với H-06
  assert.ok(detail.includes('<strong>Đóng toàn bộ yêu cầu</strong>'));
  assert.ok(detail.includes('<strong>Đóng yêu cầu theo người nhận</strong>'));
  assert.ok(hr.includes('<strong>Đóng toàn bộ yêu cầu</strong>'));
  assert.ok(hr.includes('<strong>Đóng yêu cầu theo người nhận</strong>'));
  assert.match(detail, /ManagerRequestModel\.closeRequestManually\(request,todayDMY\(\)\)/);
  assert.match(detail, /ManagerRequestModel\.closeRecipients\(request,CLOSE_STATE\.ids,todayDMY\(\)\)/);

  // đóng ở chi tiết phải hiện ra danh sách: seed không được ghi đè thao tác đã lưu
  assert.ok(list.includes('function mergeStoredRequestState(seed,stored)'));
  assert.ok(list.includes('if(stored.closedManually){seed.closedManually=true'));
  // popup phải dùng đúng bộ visual của H-06, không tự chế lại
  ['.dialog-overlay{position:fixed;inset:0;z-index:70', '.confirm-title{margin:-18px -18px 14px;padding:15px 18px;background:#fbe4f0', '.share-audience-option.on strong{color:var(--brand)}', '.share-audience-option small{display:none}'].forEach(rule => {
    assert.ok(detail.includes(rule), `popup thiếu rule của H-06: ${rule}`);
    assert.ok(hr.includes(rule), `H-06 không còn rule: ${rule}`);
  });
  assert.ok(detail.includes('class="dialog-overlay" id="closeDialog"'));
  // bề rộng và hàng người nhận lấy đúng của H-06 (avatar 30px + domain), không thì chữ xuống dòng vô duyên
  assert.ok(detail.includes('.confirm-dialog.share-dialog{width:min(560px,100%)}'));
  assert.ok(hr.includes('.confirm-dialog.share-dialog{width:min(560px,100%)}'));
  assert.ok(detail.includes('<section class="confirm-dialog share-dialog">'));
  assert.ok(detail.includes('.close-recipient{display:grid;grid-template-columns:16px 30px minmax(0,1fr);'));
  assert.ok(hr.includes('.close-recipient{display:grid;grid-template-columns:16px 30px minmax(0,1fr);'));
  assert.ok(detail.includes('<span class="avatar">${ini}</span>'));
  assert.ok(detail.includes('<button class="btn btn-primary btn-share" type="button" id="closeDialogConfirm"'));
  // một nút chính duy nhất, đóng popup bằng cách bấm ra ngoài — giống H-06
  assert.ok(!detail.includes('>Huỷ</button>'));
  // đóng rồi vẫn mở lại được, ở cả hai cấp — H-06 cũng vậy
  assert.match(detail, /Mở lại yêu cầu<\/button>/);
  assert.match(detail, /reopenClosedRecipient\(/);
  assert.match(detail, /ManagerRequestModel\.reopenRequest\(request\)/);
});

test('closing scopes lock the right tickets and stay reversible', () => {
  const model = require(requestModelPath);
  const request = makeRequest([
    ticket('t1', 'a', 'e1'), ticket('t2', 'b', 'e1'), ticket('t3', 'c', 'e2')
  ]);
  assert.deepEqual(model.openRecipientsForClose(request).map(r => r.employeeId), ['e1', 'e2']);

  // đóng theo người nhận: e2 vẫn thu bình thường
  model.closeRecipients(request, ['e1'], TODAY);
  assert.equal(model.isRecipientClosed(request, 'e1'), true);
  assert.equal(model.requestStatus(request, TODAY), 'collecting');
  assert.equal(model.canRemindAssignment(request, request.assignments[0], TODAY + ' 09:00'), false);
  assert.deepEqual(model.openRecipientsForClose(request).map(r => r.employeeId), ['e2']);

  // đóng nốt người cuối thì cả yêu cầu đóng
  model.closeRecipients(request, ['e2'], TODAY);
  assert.equal(model.requestStatus(request, TODAY), 'closed');
  assert.equal(model.closeReasonText(request, TODAY), 'Quản lý đã chủ động đóng');

  // mở lại một người là yêu cầu chạy tiếp
  model.reopenRecipient(request, 'e2');
  assert.equal(model.requestStatus(request, TODAY), 'collecting');
});

test('a request closed on purpose reads as Đóng even when the answers already in are complete', () => {
  const model = require(requestModelPath);
  const request = makeRequest([ticket('t1', 'a', 'e1', 'done'), ticket('t2', 'b', 'e2')]);
  model.closeRequestManually(request, TODAY);
  assert.equal(model.requestStatus(request, TODAY), 'closed');
  // phản hồi đã thu được không mất
  assert.equal(model.summarize(request, TODAY).done, 1);
  model.reopenRequest(request);
  assert.equal(model.requestStatus(request, TODAY), 'collecting');
});

test('the request tab teaches the feature when empty, and the CTA names the job', () => {
  const html = fs.readFileSync(pagePath, 'utf8');

  // CTA và tiêu đề popup dùng chung một tên, tách bạch với nút "Yêu cầu phản hồi" bên màn nhân viên
  assert.ok(html.includes('<i class="bx bx-user-voice"></i> Thu thập phản hồi cho nhân viên</button>'));
  assert.ok(html.includes('id="requestDialogTitle">Thu thập phản hồi cho nhân viên<'));
  assert.ok(!html.includes('Tạo yêu cầu phản hồi'));

  // empty state phân biệt hai tình huống: chưa từng tạo vs lọc không ra kết quả
  assert.match(html, /function requestEmptyState\(\)/);
  assert.match(html, /if\(filtering\|\|requestsForSelectedCycle\(\)\.length\)/);
  assert.ok(html.includes('Không có yêu cầu nào khớp bộ lọc hiện tại.'));
  assert.ok(html.includes('Chưa có yêu cầu phản hồi nào'));
  assert.ok(html.includes('nhờ đồng nghiệp góp góc nhìn về một nhân viên trong nhóm, phục vụ cho việc coaching'));
  assert.match(html, /class="request-empty"[\s\S]{0,600}onclick="openRequestDialog\(\)"/);
  // phải sửa ở bản renderRequestList định nghĩa SAU, vì bản đó mới thực sự chạy
  assert.ok(html.lastIndexOf('requestEmptyState()') > html.lastIndexOf('function requestEmptyState()'));

  // tooltip trạng thái Đóng theo đúng câu đã chốt
  assert.ok(html.includes('role="tooltip">Yêu cầu này không còn nhận phản hồi do đã quá 90 ngày hoặc được Người yêu cầu đóng hoặc người liên quan đã nghỉ việc.'));
});

test('managers can download received feedback per employee or in bulk, within their own scope', () => {
  const html = fs.readFileSync(pagePath, 'utf8');

  // icon tải ở từng dòng, cạnh icon xem — có tooltip tên nút
  assert.ok(html.includes('aria-label="Tải phản hồi của ${emp.name}"'));
  assert.ok(html.includes('<i class="bx bx-download"></i></button>'));
  // icon căn trái thẳng với nhãn cột, không dồn về mép phải
  assert.ok(html.includes('.row-actions{display:flex;align-items:center;justify-content:flex-start;gap:2px;margin-left:-6px}'));
  assert.ok(!html.includes('.row-actions{display:flex;align-items:center;justify-content:flex-end'));

  // nút header mở hộp thoại chọn phạm vi, dùng lại visual của H-06
  // nút tải nằm trong thanh công cụ của tab, ngay cạnh ô tìm kiếm — không còn ở header trang
  assert.ok(html.includes('<div class="list-actions"><button type="button" class="btn btn-outline" id="headerDownload"'));
  assert.ok(html.includes('onclick="openDownloadDialog()"'));
  assert.ok(html.includes('.list-actions #headerDownload{height:32px'));
  assert.ok(!html.includes('class="icon-btn" id="headerDownload"'), 'không còn nút tải kiểu icon ở header trang');
  // nút đã thuộc hẳn tab phản hồi nên bỏ luôn phần đổi nhãn theo tab
  assert.ok(!html.includes('function syncHeaderDownload'));
  assert.ok(html.includes('onclick="openDownloadDialog()"'));
  assert.ok(html.includes('<strong>Tải toàn bộ (${list.length} nhân viên)</strong>'));
  assert.ok(html.includes('<strong>Chọn từng nhân viên</strong>'));
  const hr = fs.readFileSync(path.join(__dirname, '..', 'H-06', 'index.html'), 'utf8');
  ['.confirm-title{margin:-18px -18px 14px;padding:15px 18px;background:#fbe4f0', '.share-audience-option.on strong{color:var(--brand)}'].forEach(rule => {
    assert.ok(html.includes(rule), `hộp thoại tải thiếu rule của H-06: ${rule}`);
    assert.ok(hr.includes(rule));
  });

  // phạm vi tải phải lấy từ đúng hàm lọc của màn hình, không truy vấn riêng
  assert.match(html, /function currentEmployees\(\)/);
  assert.match(html, /function renderEmployees\(\)\{\s*const items=currentEmployees\(\);/);
  assert.match(html, /return currentEmployees\(\)\.filter\(emp=>visibleFeedbackForManager\(emp\.id\)\.length\|\|hrReportCount\(emp\.login\)\)/);
  assert.match(html, /function downloadFeedback\(ids\)\{[\s\S]{0,200}currentEmployees\(\)\.filter/);

  // báo cáo HR đi kèm nhưng tách sheet riêng, và nói rõ điều đó trong hộp thoại
  assert.match(html, /báo cáo HR ở sheet riêng/);
  assert.match(html, /Báo cáo do HR chia sẻ được tách thành sheet riêng/);

  // nút header nằm trên thanh tab nên phải tự đổi phạm vi theo tab đang mở
  // ba nơi xem phản hồi của một người đều tải được ngay tại chỗ, không cần quay về bảng
  assert.ok(html.includes('id="dialogDownload"'));   // popup xem nhanh
  assert.ok(html.includes('id="splitDownload"'));    // split view
  assert.match(html, /function downloadSelectedEmployee\(\)\{if\(STATE\.selectedId\)downloadFeedback\(\[STATE\.selectedId\]\);\}/);
  assert.match(html, /function syncViewerDownloadLabels\(\)/);
  const detail = fs.readFileSync(path.join(__dirname, 'feedback-detail.html'), 'utf8');
  assert.ok(detail.includes('id="detailDownload"'));
  // nút tải nằm cùng hàng với hai tab cho dễ thấy, không nấp trên thanh thương hiệu
  assert.ok(detail.includes('<div class="detail-tab-row"><div class="detail-tabs" id="detailTabs" role="tablist"></div><button type="button" class="detail-download" id="detailDownload"'));
  assert.ok(!detail.includes('class="top-download"'));
  assert.match(detail, /function downloadThisEmployee\(\)/);
  // màn chi tiết dùng lại dữ liệu sẵn có của trang, không tự lọc lại kẻo lệch phạm vi
  assert.match(detail, /`\$\{items\.length\} phản hồi`/);
  assert.match(detail, /HR_REPORTS\.length\)parts\.push/);
});

test('cycle overview hangs each explanation on its own info icon, not the whole row', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const overview = html.match(/<div class="request-overview-list">([\s\S]*?)<\/div>/)?.[1] || '';
  ['collecting', 'overdue', 'complete', 'closed'].forEach(status => {
    assert.ok(overview.includes(`<button class="overview-status" onclick="setRequestStatusFilter('${status}')"`),
      `thiếu nút trạng thái ${status}`);
  });
  // chữ (i) là trigger, và tooltip nằm bên trong nó
  assert.equal(overview.split('<span class="status-info"').length - 1, 4);
  assert.ok(overview.includes('<i class="bx bx-info-circle"></i><span class="pms-tooltip-content overview-tip" role="tooltip">'));
  assert.ok(html.includes('.request-overview-list .status-info:hover .pms-tooltip-content'));
  // hàng không còn là trigger nữa
  assert.ok(!overview.includes('class="pms-tooltip"'));
  // .status-info cố tình không position để tooltip vẫn neo theo button, khỏi tràn card
  assert.ok(html.includes('.request-overview-list button.overview-status{position:relative;cursor:pointer}'));
  assert.ok(!/\.request-overview-list \.status-info\{[^}]*position:/.test(html));
});

test('manager feedback supports the all-cycle option', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /<option value="all">Tất cả<\/option>/);
  assert.match(html, /cycle==='all'/);
});

test('M-04 provides D2 feedback preview and visibility filtering', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const data = fs.readFileSync(path.join(__dirname, 'manager-feedback-data.js'), 'utf8');
  assert.match(html, /id="feedbackDialog"/);
  assert.match(html, /function visibleFeedbackForManager\(/);
  assert.match(data, /visibility:'manager'/);
  assert.match(data, /visibility:'receiver'/);
  assert.doesNotMatch(html, /privacy-banner"><i/);
});

test('M-04 supports popup expansion, dedicated detail page, and split view', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const detail = fs.readFileSync(path.join(__dirname, 'feedback-detail.html'), 'utf8');
  assert.match(html, /id="dialogCount"/);
  assert.match(html, /id="openTabButton"/);
  assert.match(html, /function openFeedbackTab\(/);
  assert.match(html, /feedback-detail\.html\?employee=/);
  assert.match(html, /id="splitViewButton"/);
  assert.match(html, /id="splitShell"/);
  assert.match(html, /id="splitEmployeeList"/);
  assert.match(html, /id="splitFeedbackPane"/);
  assert.match(html, /function toggleSplitView\(/);
  assert.match(html, /function selectSplitEmployee\(/);
  assert.match(detail, /manager-feedback-data\.js/);
  assert.match(detail, /URLSearchParams/);
});

test('manager split view uses a compact employee header, badge tally and internal scroll', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /Phản hồi của <span id="splitEmployeeName"/);
  assert.match(html, /id="splitOverview"/);
  assert.match(html, /id="splitBadgeSummary"/);
  assert.match(html, /function splitBadgeSummaryHTML\(/);
  assert.match(html, /\.split-pane-body\{[^}]*overflow-y:auto/);
  assert.match(html, /\.split-pane\{[^}]*max-height:/);
  assert.doesNotMatch(html, /id="splitPaneMeta"/);
});

test('manager feedback cards show only the sender and omit redundant sharing metadata', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const data = fs.readFileSync(path.join(__dirname, 'manager-feedback-data.js'), 'utf8');
  assert.match(html, /class="split-badge-tip"/);
  assert.match(html, /\.split-badge-tip\{[^}]*background:var\(--z900\)[^}]*color:#fff[^}]*border-radius:6px/);
  assert.match(html, /feedbackCard\(item,emp,\{senderTooltipPlacement:/);
  assert.match(html, /function feedbackCard\(item,emp,options\)\{\s*return ManagerFeedbackData\.feedbackCard\(item,emp,options\);\s*\}/);
  assert.doesNotMatch(data, /compactRecipient|fb-arrow|share-icon|bx-group/);
});

test('manager split header uses the shared custom tooltip for department and position', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /id="splitEmployeeName" class="split-employee-name pms-tooltip"/);
  assert.match(html, /id="splitEmployeeTooltip" class="pms-tooltip-content"/);
  assert.match(html, /employeeTooltip\.textContent=\[emp\.dept,emp\.pos\]/);
  assert.doesNotMatch(html, /employeeName\.title=/);
  assert.match(html, /\.pms-tooltip-content\{[^}]*background:var\(--z900\)[^}]*color:#fff[^}]*border-radius:6px[^}]*font-size:12px/);
});

test('feedback business metadata uses custom tooltips and design system documents the rule', () => {
  const data = fs.readFileSync(path.join(__dirname, 'manager-feedback-data.js'), 'utf8');
  const detail = fs.readFileSync(path.join(__dirname, 'feedback-detail.html'), 'utf8');
  const requestDetail = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  const designSystem = fs.readFileSync(path.join(__dirname, '..', 'DESIGN-SYSTEM.md'), 'utf8');
  assert.doesNotMatch(data, /title="\$\{cv\}"/);
  assert.match(data, /pms-tooltip-content/);
  assert.match(detail, /\.pms-tooltip-content\{/);
  assert.doesNotMatch(requestDetail, /title="\$\{senderTip\}"/);
  assert.match(requestDetail, /function identityTooltip\([^)]*\).*pms-tooltip/);
  assert.match(designSystem, /## .*TOOLTIP/);
  assert.match(designSystem, /không dùng tooltip mặc định của trình duyệt/i);
});

test('split feedback sender name exposes organization in the shared custom tooltip', () => {
  const data = require('./manager-feedback-data.js');
  const employees = [
    {id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',ini:'NT',dept:'Backend',team:'Core',pos:'Senior Engineer'},
    {id:'sender',name:'Trương Minh Đức',login:'duc.truong',ini:'TĐ',dept:'Platform',team:'SRE',pos:'Tech Lead'}
  ];
  const store = data.createStore(employees);
  const item = store.feedback.find(feedback => feedback.id === 'f1');
  const card = data.feedbackCard(item, employees[0], {compactRecipient:true});
  assert.match(card, /class="fb-sender pms-tooltip"/);
  assert.match(card, /Trương Minh Đức <span class="fb-domain">\(duc\.truong\)<\/span>/);
  assert.match(card, /Platform - SRE - Tech Lead/);
  assert.doesNotMatch(card, /Nguyễn Văn Tú|fb-arrow|share-icon|bx-group/);
});

test('manager feedback sender keeps a consistent gap before the domain', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const detail = fs.readFileSync(path.join(__dirname, 'feedback-detail.html'), 'utf8');
  assert.match(html, /\.fb-sender\{[^}]*gap:4px/);
  assert.match(detail, /\.fb-sender\{[^}]*gap:4px/);
});

test('employee feedback popup prepends the shared AI summary when enough feedback exists', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const renderer = html.match(/function employeeAiSummaryHTML\(employee,feedback\)\{[\s\S]*?\n\}/)?.[0] || '';
  const opener = html.match(/function openFeedback\(employeeId\)\{[\s\S]*?\n\}/)?.[0] || '';
  assert.match(html, /<script src="manager-ai-summary\.js"><\/script>/);
  assert.match(renderer, /ManagerAiSummary\.create\(employee,feedback\)/);
  assert.match(renderer, /if\(!summary\.available\)return ''/);
  assert.match(renderer, /Điểm mạnh/);
  assert.match(renderer, /Cơ hội phát triển/);
  assert.match(renderer, /Cập nhật: \$\{summary\.updatedAt\}/);
  assert.match(opener, /employeeAiSummaryHTML\(emp,items\)/);
  assert.ok(opener.indexOf('employeeAiSummaryHTML(emp,items)') < opener.indexOf('feedbackCard(item,emp)'));
});

test('employee popup AI summary is collapsible and the table keeps only the eye action', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const renderer = html.match(/function employeeAiSummaryHTML\(employee,feedback\)\{[\s\S]*?\n\}/)?.[0] || '';
  const employeeRenderer = html.match(/function renderEmployees\(\)\{[\s\S]*?\n\}/)?.[0] || '';
  assert.match(renderer, /aria-expanded="\$\{!STATE\.dialogAiCollapsed\}"/);
  assert.match(renderer, /toggleDialogAiSummary\(\)/);
  assert.match(html, /function toggleDialogAiSummary\(\)/);
  assert.doesNotMatch(employeeRenderer, /bx-sparkles|AI Summary/);
  assert.match(employeeRenderer, /bx-show/);
});

test('split view prepends the same AI summary as the popup, with its own collapse state', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const renderer = html.match(/function splitAiSummaryHTML\(employee,feedback\)\{[\s\S]*?\n\}/)?.[0] || '';
  const splitRenderer = html.match(/function renderSplitView\(items\)\{[\s\S]*?\n\}/)?.[0] || '';
  assert.match(renderer, /ManagerAiSummary\.create\(employee,feedback\)/);
  assert.match(renderer, /if\(!summary\.available\)return ''/);
  assert.match(renderer, /id="splitAiSummary"/);
  assert.match(renderer, /Điểm mạnh/);
  assert.match(renderer, /Cơ hội phát triển/);
  assert.match(renderer, /aria-expanded="\$\{!STATE\.splitAiCollapsed\}"/);
  assert.match(renderer, /toggleSplitAiSummary\(\)/);
  assert.match(html, /function toggleSplitAiSummary\(\)/);
  assert.match(html, /splitAiCollapsed:false/);
  // summary phải đứng trước feedback card trong pane và có nhãn ngữ cảnh rõ ràng.
  assert.match(splitRenderer, /Tổng hợp phản hồi đã nhận/);
  assert.match(splitRenderer, /Phản hồi đã nhận/);
  assert.ok(splitRenderer.indexOf('splitAiSummaryHTML(emp,feedback)') < splitRenderer.indexOf('feedback.map'));
});

test('manager feedback separates HR reports from received-feedback evidence', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const detail = fs.readFileSync(detailPath, 'utf8');
  const opener = html.match(/function openFeedback\(employeeId\)\{[\s\S]*?\n\}/)?.[0] || '';
  const splitRenderer = html.match(/function renderSplitView\(items\)\{[\s\S]*?\n\}/)?.[0] || '';
  assert.doesNotMatch(html, /report-badge/);
  assert.match(opener, /Báo cáo phản hồi từ HR/);
  assert.match(opener, /Tổng hợp phản hồi đã nhận/);
  assert.match(opener, /Phản hồi đã nhận/);
  assert.match(splitRenderer, /báo cáo HR đã chia sẻ/);
  assert.match(splitRenderer, /openFeedbackTab\('\$\{emp\.id\}',true\)/);
  assert.match(detail, /\.detail-tabs\{[^}]*padding:3px[^}]*border:1px solid var\(--z200\)[^}]*background:var\(--z100\)/);
  assert.match(detail, /\.detail-tab\.on\{[^}]*background:var\(--z0\)[^}]*color:var\(--brand\)/);
  assert.match(detail, /role="tablist"/);
});

test('answered feedback uses a compact conversational pair with only a question label', () => {
  const data = require('./manager-feedback-data.js');
  const emp = {name:'Tú', ini:'NT', login:'tu.nguyen'};
  const base = {sender:{name:'An', dom:'an.le', ini:'AL'}, date:'01/08/2026', cv:[]};
  const withQ = data.feedbackCard({...base, question:'Câu hỏi?', body:'Đây là trả lời.'}, emp);
  const noQ = data.feedbackCard({...base, body:'Nội dung trực tiếp.'}, emp);
  // Có câu hỏi → bubble hỏi (nhãn "Câu hỏi:" liền mạch, có thể thu gọn) + bubble trả lời nối bằng đường dẫn.
  assert.match(withQ, /<div class="qa"><div class="qa-q q-collapse"><p class="qa-text q-text"><span class="q-label">Câu hỏi:<\/span> Câu hỏi\?<\/p><button class="q-more" type="button" onclick="toggleQuestion\(this\)" hidden>Xem thêm<\/button><\/div><div class="qa-a"><p class="fb-body">Đây là trả lời\.<\/p>/);
  assert.doesNotMatch(withQ, /answer-label|>Trả lời</);
  // Không có câu hỏi → body trơn, không tạo cấu trúc hội thoại giả.
  assert.doesNotMatch(noQ, /class="qa"/);
  // Bubble và connector phải đồng bộ ở popup/split lẫn trang chi tiết.
  for (const html of [fs.readFileSync(pagePath,'utf8'), fs.readFileSync(detailPath,'utf8')]) {
    assert.match(html, /\.qa-q\{[^}]*display:block[^}]*width:100%[^}]*border-radius/);
    assert.match(html, /\.qa-label\{[^}]*display:inline[^}]*text-transform:none[^}]*color:var\(--z600\)/);
    assert.match(html, /\.qa-a\{[^}]*margin:0 0 0 8px[^}]*padding-left:10px/);
    assert.match(html, /\.qa-a::before\{[^}]*top:-2px[^}]*width:10px[^}]*height:13px[^}]*border-bottom/);
    assert.match(html, /\.qa-a \.fb-body\{[^}]*margin:0[^}]*font-size:12\.5px[^}]*background:transparent[^}]*padding:4px 8px 1px/);
  }
});

test('does not render core-value badges for HR-originated feedback',()=>{
  const data=require('./manager-feedback-data.js'),employee={name:'Tú',ini:'NT',login:'tu.nguyen'};
  const card=data.feedbackCard({sender:{name:'HR',dom:'hr',ini:'HR'},date:'01/08/2026',body:'Nội dung',cv:['Tinh thần đồng đội'],requestSource:'hr'},employee);
  assert.doesNotMatch(card,/cv-icons/);
});

test('manager HR report surfaces use only results released to managers',()=>{
  const html=fs.readFileSync(pagePath,'utf8');
  const detail=fs.readFileSync(detailPath,'utf8');
  assert.match(html,/FeedbackReportView\.countFor\(login,'managers'\)/);
  assert.match(detail,/FeedbackReportView\.entriesFor\(employee\.login,'managers'\)/);
});

test('feedback detail tab mirrors the personal feedback screen: feedback, core-value stats, AI summary', () => {
  const html = fs.readFileSync(detailPath, 'utf8');
  // load đủ 3 nguồn dữ liệu
  assert.match(html, /manager-feedback-data\.js/);
  assert.match(html, /manager-ai-summary\.js/);
  // dùng renderer module-level, KHÔNG gọi store.feedbackCard (store không có hàm này)
  assert.match(html, /ManagerFeedbackData\.feedbackCard\(/);
  assert.doesNotMatch(html, /store\.feedbackCard\(/);
  // AI Summary tái dùng đúng visual popup, đứng trước danh sách phản hồi
  assert.match(html, /function aiSummaryHTML\(employee,feedback\)/);
  assert.match(html, /ManagerAiSummary\.create\(employee,feedback\)/);
  assert.match(html, /if\(!summary\.available\)return ''/);
  assert.match(html, /id="aiSummary"/);
  assert.match(html, /class="dialog-ai-summary/);
  assert.match(html, /id="aiMount"[\s\S]*id="cards"/);
  assert.match(html, /function toggleAiSummary\(\)/);
  // thống kê Giá trị được ghi nhận: đủ 5 giá trị, xếp hạng theo số lần
  assert.match(html, /Giá trị được ghi nhận/);
  assert.match(html, /function railCVHTML\(feedback\)/);
  assert.match(html, /CV_ORDER=\['Đổi mới','Tinh thần đồng đội','Không ngừng học hỏi','Khách hàng là trung tâm','Thực thi xuất sắc'\]/);
  assert.match(html, /ManagerFeedbackData\.coreValueIcon\(value\)/);
  // bố cục 3 panel: nhân viên · phản hồi · giá trị
  assert.match(html, /grid-template-columns:260px minmax\(0,1fr\) 300px/);
  assert.match(html, /class="side-left"[\s\S]*id="personCard"[\s\S]*class="main-col"[\s\S]*class="rail"/);
  assert.match(html, /function personCardHTML\(employee\)/);
  // panel trái chứa domain, phòng ban, team, vị trí
  assert.match(html, /\['Phòng ban',employee\.dept\],\['Team',employee\.team\],\['Vị trí',employee\.pos\]/);
  // domain chỉ xuất hiện dưới tên, không lặp thành một dòng riêng
  assert.doesNotMatch(html, /\['Domain',employee\.login\]/);
  assert.match(html, /class="person-domain">\$\{employee\.login\}/);
  // header không còn dòng metadata
  assert.doesNotMatch(html, /id="meta"/);
  // header + 2 panel bên freeze khi cuộn; cột giữa cuộn nội dung
  assert.match(html, /\.top\{[^}]*position:sticky;top:0/);
  assert.match(html, /\.head\{position:sticky;top:52px/);
  assert.match(html, /\.side-left\{position:sticky;top:108px\}/);
  assert.match(html, /\.rail\{[^}]*position:sticky;top:108px\}/);
});

test('every manager feedback sender has a tooltip and split view chooses placement by context', () => {
  const data = require('./manager-feedback-data.js');
  const store = data.createStore([]);
  for (const item of store.feedback) {
    const card = data.feedbackCard(item, {name:'Người nhận'}, {compactRecipient:true});
    assert.match(card, /class="fb-sender pms-tooltip/);
    assert.match(card, /class="pms-tooltip-content/);
  }
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /senderTooltipPlacement:index===0\?'bottom':'top'/);
  assert.match(html, /\.pms-tooltip-top\{[^}]*top:auto[^}]*bottom:calc\(100% \+ 7px\)/);
});

test('M-04 links manager navigation and reuses shared employee data', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /\.\.\/assets\/employees-data\.js/);
  assert.match(html, /\.\.\/M-01\/index\.html/);
  assert.match(html, /\.\.\/E-04\/index\.html/);
});

test('manager screens link their Feedback navigation item to M-04', () => {
  const screens = ['M-01', 'M-01b', 'M-01d', 'M-02'];
  for (const screen of screens) {
    const html = fs.readFileSync(path.join(__dirname, '..', screen, 'index.html'), 'utf8');
    assert.match(html, /M-04\/index\.html/, `${screen} must link to M-04`);
  }
});

test('employee list follows the manager table-list pattern with role-dependent headers', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /class="employee-list-header /);
  assert.match(html, /function employeeHeader\(/);
  assert.match(html, /Phản hồi đã nhận/);
  assert.match(html, /Quản lý cấp 2/);
  assert.doesNotMatch(html, /Phản hồi có thể xem/);
  assert.doesNotMatch(html, /Phản hồi gần nhất/);
  assert.match(html, /class="metric metric-cell">\$\{visible\}<\/div>/);
  assert.match(html, /\.cols-direct\{grid-template-columns:minmax\(280px,1fr\) 130px 92px\}/);
  assert.match(html, /\.employee-list-header>div\{white-space:nowrap\}/);
  assert.doesNotMatch(html, /phản hồi riêng tư không hiển thị/);
});

test('indirect scopes provide organizational filters without inline scope guides', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /id="filterDivision"/);
  assert.match(html, /id="filterDepartment"/);
  assert.match(html, /id="filterManager"/);
  assert.match(html, /function renderFilters\(/);
  assert.match(html, /id="filterToggle"/);
  assert.match(html, /> Bộ lọc/);
  assert.match(html, /class="filter-popover/);
  assert.doesNotMatch(html, /id="scopeGuide"/);
  assert.doesNotMatch(html, /Đang xem nhân viên báo cáo trực tiếp/);
  assert.doesNotMatch(html, /Sẽ hoàn thiện trong D3/);
});

test('design system defines the short-hyphen metadata separator rule', () => {
  const designSystem = fs.readFileSync(path.join(__dirname, '..', 'DESIGN-SYSTEM.md'), 'utf8');
  assert.match(designSystem, /Metadata separator[\s\S]{0,200}không dùng ký tự middot `·`[\s\S]{0,160}metadata/i);
  assert.match(designSystem, /dấu gạch ngang ngắn.*` - `/);
});

/* ── D3 / MR-1 — quản lý tạo yêu cầu phản hồi cho direct reports ── */

test('D3 exposes the manager request CTA and the MR-1 dialog', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /id="requestCta"/);
  assert.match(html, /id="requestDialog"/);
  assert.match(html, /id="designeeInput"/);
  assert.match(html, /id="designeeChips"/);
  assert.match(html, /id="reviewerInput"/);
  assert.match(html, /id="reviewerChips"/);
  assert.match(html, /id="requestQuestion"/);
  assert.match(html, /id="requestDue"/);
  assert.match(html, /id="requestPreview"/);
  assert.match(html, /id="requestSubmit"/);
  assert.match(html, /manager-request-model\.js/);
});

test('MR-1 dialog follows the shared feedback popup rules', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const dialog = html.match(/<div class="overlay" id="requestDialog"[\s\S]*?<\/div>\s*<!-- \/requestDialog -->/)?.[0] || '';
  assert.ok(dialog, 'request dialog markup must be present');
  assert.doesNotMatch(dialog, />\s*Hủy\s*</, 'feedback popups must not offer a Hủy button');
  assert.match(dialog, /class="req-star">\*<\/span>/, 'required fields use a red asterisk');
  assert.doesNotMatch(dialog, /bắt buộc chọn/);
  assert.doesNotMatch(dialog, /·/, 'metadata must use " - " instead of the middle dot');
  assert.match(html, /function requestCloseAttempt\(/);
  assert.match(html, /id="requestConfirm"/);
  assert.match(html, /Tiếp tục chỉnh sửa/);
  assert.match(html, /Xóa nội dung/);
  assert.doesNotMatch(html, /onclick="requestConfirmSave\(\)"/);
  assert.match(html, /Nội dung bạn đang nhập chưa được gửi/);
});

test('manager feedback textareas inherit the design-system typography', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /button,input,select,textarea\{font:inherit\}/);
});

test('MR-1 explains responsible use and presents a clear receiver-to-giver flow', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const plan = fs.readFileSync(path.join(__dirname, '..', 'FEEDBACK_PLAN.md'), 'utf8');
  assert.match(html, /Hãy sử dụng tính năng này khi cần thêm góc nhìn từ những người đã trực tiếp làm việc với nhân viên/);
  assert.match(html, /Phản hồi nên phục vụ cho việc hiểu rõ hơn và hỗ trợ nhân viên phát triển, không thay thế cho trao đổi và đánh giá của Quản lý/);
  assert.match(html, /<em>Nội dung yêu cầu và phản hồi có thể được các bên liên quan nhìn thấy\.<\/em>/);
  assert.doesNotMatch(html, /Chỉ tạo yêu cầu khi bạn cần thêm góc nhìn cụ thể để coaching/);
  assert.match(html, /class="field request-role-flow"/);
  /* Chọn người NHẬN trước rồi mới tới người CHO — cùng thứ tự với lưới người tham gia
     ở màn tạo yêu cầu của HR (H-05 create-campaign), để hai màn đọc như một. */
  assert.ok(html.indexOf('id="requestReceiverRole"') < html.indexOf('id="requestGiverRole"'));
  assert.match(html, /Nhân viên nhận phản hồi<span class="req-star">\*<\/span>/);
  assert.match(html, /Người cho phản hồi<span class="req-star">\*<\/span>/);
  /* Phản hồi đi TỪ người cho SANG người nhận. Người nhận đứng bên trái nên mũi tên
     phải chỉ TRÁI, không giữ nguyên chiều cũ sau khi hoán vị hai ô. */
  assert.match(html, /class="request-flow-arrow" aria-hidden="true"><i class="bx bxs-left-arrow"><\/i>/);
  assert.doesNotMatch(html, /request-flow-arrow[^>]*><i class="bx bxs-right-arrow"/);
  // canh tâm mũi tên theo Ô NHẬP, không theo cả cột (cột còn dòng chú thích bên dưới)
  assert.match(html, /\.request-flow-arrow\{display:flex;align-items:center;justify-content:center;padding-top:29px/);
  assert.match(html, /@media\(max-width:700px\)\{\.request-role-flow\{grid-template-columns:minmax\(0,1fr\)/);
  assert.match(plan, /Feedback không phải là công cụ đánh giá/);
});

test('MR-1 personalisation only appears with two or more reviewers', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /id="personalizeRow"/);
  assert.match(html, /function syncPersonalizeVisibility\(/);
  assert.match(html, /REQUEST_FORM\.reviewers\.length>=2/);
});

test('MR-1 designee picker offers direct reports only', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /ManagerRequestModel\.directReports\(/);
  assert.match(html, /function designeeSearch\(/);
});

test('MR-1 model builds one assignment per designee and reviewer pair', () => {
  const model = require('./manager-request-model.js');
  const designees = [
    {id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',lvl:'lm1'},
    {id:'e2',name:'Trần Thị Mai',login:'mai.tran',lvl:'lm1'},
    {id:'e4',name:'Vũ Thị Lan',login:'lan.vu',lvl:'lm1'}
  ];
  const reviewers = [
    {name:'Lê Thành Nam',login:'nam.le',ini:'LN'},
    {name:'Hoàng Thị Lan',login:'lan.hoang',ini:'HL'},
    {name:'Trương Minh Đức',login:'duc.truong',ini:'TĐ'},
    {name:'Nguyễn Quốc Bảo',login:'bao.nguyen',ini:'NB'},
    {name:'Mai Thị Hằng',login:'hang.mai',ini:'MH'}
  ];
  const preview = model.previewCount({designees,reviewers});
  assert.equal(preview.designees, 3);
  assert.equal(preview.reviewers, 5);
  assert.equal(preview.product, 15);
  assert.equal(preview.total, 15);

  const request = model.createRequest({
    goal:'Test request',
    cycle:'2026', createdAt:'04/08/2026', due:'18/08/2026',
    createdBy:{name:'Lê Thị Thanh',login:'thanh.le'},
    designees, reviewers, sharedQuestion:'Bạn đánh giá thế nào về đóng góp của bạn ấy trong chu kỳ này?'
  });
  assert.equal(request.assignments.length, 15);
  assert.equal(request.questionMode, 'shared');
  assert.equal(new Set(request.assignments.map(item=>item.id)).size, 15, 'assignment ids must be unique');
  assert.ok(request.assignments.every(item=>item.status==='pending'));
  assert.ok(request.assignments.every(item=>item.question.startsWith('Bạn đánh giá thế nào')));
});

test('MR-1 keeps UC3 visibility shared and locked for reviewers', () => {
  const model = require('./manager-request-model.js');
  const request = model.createRequest({
    goal:'Test request',
    cycle:'2026', createdAt:'01/08/2026', due:'18/08/2026',
    designees:[{id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',lvl:'lm1'}],
    reviewers:[{name:'Lê Thành Nam',login:'nam.le',ini:'LN'}],
    sharedQuestion:'Câu hỏi chung'
  });
  assert.equal(request.visibility, 'shared');
  assert.equal(request.reviewerCanChangeVisibility, false);
});

test('MR-1 personalised questions attach per reviewer and skip self-review pairs', () => {
  const model = require('./manager-request-model.js');
  const designees = [
    {id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',lvl:'lm1'},
    {id:'e2',name:'Trần Thị Mai',login:'mai.tran',lvl:'lm1'}
  ];
  const reviewers = [
    {name:'Nguyễn Văn Tú',login:'tu.nguyen',ini:'NT'},
    {name:'Lê Thành Nam',login:'nam.le',ini:'LN'}
  ];
  const preview = model.previewCount({designees,reviewers});
  assert.equal(preview.product, 4);
  assert.equal(preview.total, 3, 'a person never reviews themselves');
  assert.equal(preview.skipped, 1);

  const request = model.createRequest({
    goal:'Test request',
    cycle:'2026', createdAt:'01/08/2026', due:'18/08/2026', personalize:true, designees, reviewers,
    questions:{'tu.nguyen':'Câu hỏi cho Tú','nam.le':'Câu hỏi cho Nam'}
  });
  assert.equal(request.questionMode, 'individual');
  assert.equal(request.assignments.length, 3);
  assert.ok(!request.assignments.some(item=>item.employeeLogin===item.reviewer.login));
  const forNam = request.assignments.filter(item=>item.reviewer.login==='nam.le');
  assert.equal(forNam.length, 2);
  assert.ok(forNam.every(item=>item.question==='Câu hỏi cho Nam'));
});

test('MR-1 only accepts direct reports as designees', () => {
  const model = require('./manager-request-model.js');
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'assets', 'employees-data.js'), 'utf8'), context);
  const direct = model.directReports(context.window.PMS_EMPLOYEES);
  assert.ok(direct.length > 0);
  assert.ok(direct.every(emp=>emp.lvl==='lm1'));
  assert.ok(context.window.PMS_EMPLOYEES.some(emp=>emp.lvl!=='lm1'), 'fixture must contain skip-level employees');
  assert.equal(model.isEligibleDesignee(context.window.PMS_EMPLOYEES.find(emp=>emp.lvl!=='lm1')), false);
});

test('MR-1 output feeds D4 monitoring with pending and overdue counters', () => {
  const model = require('./manager-request-model.js');
  const request = model.createRequest({
    goal:'Test request',
    cycle:'2026', createdAt:'01/08/2026', due:'10/08/2026',
    designees:[
      {id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',lvl:'lm1'},
      {id:'e2',name:'Trần Thị Mai',login:'mai.tran',lvl:'lm1'}
    ],
    reviewers:[
      {name:'Lê Thành Nam',login:'nam.le',ini:'LN'},
      {name:'Hoàng Thị Lan',login:'lan.hoang',ini:'HL'}
    ],
    sharedQuestion:'Câu hỏi chung'
  });
  request.assignments[0].status='done';
  request.assignments[0].repliedAt='06/08/2026';

  const before = model.summarize(request, '06/08/2026');
  assert.deepEqual(
    {total:before.total,done:before.done,pending:before.pending,overdue:before.overdue,rate:before.rate},
    {total:4,done:1,pending:3,overdue:0,rate:25}
  );

  const after = model.summarize(request, '12/08/2026');
  assert.equal(after.overdue, 3, 'pending assignments become overdue past the due date');

  const rows = model.byEmployee(request, '12/08/2026');
  assert.equal(rows.length, 2);
  const tu = rows.find(row=>row.employeeId==='e1');
  assert.deepEqual({total:tu.total,done:tu.done,pending:tu.pending,overdue:tu.overdue}, {total:2,done:1,pending:1,overdue:1});

  const store = model.createStore();
  store.add(request);
  assert.equal(store.forCycle('2026').length, 1);
  assert.deepEqual(store.summarizeAll('2026','12/08/2026'), {total:4,done:1,pending:3,overdue:3});
});

test('D4 model derives request status and locks reminders within the same day', () => {
  const model = require('./manager-request-model.js');
  const request = model.createRequest({
    goal:'Test request',
    id:'monitor-1', cycle:'2026', createdAt:'01/08/2026', due:'10/08/2026',
    designees:[
      {id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',lvl:'lm1'},
      {id:'e2',name:'Trần Thị Mai',login:'mai.tran',lvl:'lm1'}
    ],
    reviewers:[
      {name:'Lê Thành Nam',login:'nam.le',ini:'LN'},
      {name:'Hoàng Thị Lan',login:'lan.hoang',ini:'HL'}
    ], sharedQuestion:'Bạn đánh giá thế nào về đóng góp của đồng nghiệp?'
  });
  request.assignments[0].status='done';
  request.assignments[0].repliedAt='06/08/2026';

  assert.equal(model.requestStatus(request,'06/08/2026'),'collecting');
  assert.equal(model.requestStatus(request,'12/08/2026'),'overdue');
  assert.equal(model.daysOverdue(request,'12/08/2026'),2);
  assert.equal(model.remindAssignment(request,request.assignments[1].id,'06/08/2026'),true);
  assert.equal(request.assignments[1].remindedAt,'06/08/2026');
  assert.equal(model.remindAssignment(request,request.assignments[1].id,'06/08/2026'),false,'same-day reminder must be locked');
  assert.equal(model.remindAssignment(request,request.assignments[0].id,'06/08/2026'),false,'done assignment cannot be reminded');
  assert.equal(model.remindPending(request,'07/08/2026'),3,'all pending assignments can be reminded after 24 hours');
  /* Quá hạn vẫn nhắc được: chỉ ràng buộc cooldown 24 giờ và cửa sổ 90 ngày kể từ ngày tạo. */
  assert.equal(model.remindPending(request,'12/08/2026'),3,'reminders continue past the deadline');
  assert.equal(model.remindPending(request,'20/11/2026'),0,'reminders stop after the 90-day window');

  request.assignments.slice(1).forEach(item=>{item.status='done';item.repliedAt='13/08/2026';});
  assert.equal(model.requestStatus(request,'13/08/2026'),'complete');
});

test('manager requests sort by action priority with status-specific tie breakers', () => {
  const model=require('./manager-request-model.js');
  const assignment=(status,repliedAt=null)=>({status,repliedAt});
  const requests=[
    {id:'closed-old',createdAt:'01/04/2026',due:'20/04/2026',assignments:[assignment('pending')]},
    {id:'complete-old',createdAt:'01/07/2026',due:'20/07/2026',assignments:[assignment('done','08/08/2026 · 09:00')]},
    {id:'collect-later',createdAt:'01/08/2026',due:'20/08/2026',assignments:[assignment('pending')]},
    {id:'overdue-newer',createdAt:'01/07/2026',due:'01/08/2026',assignments:[assignment('pending')]},
    {id:'collect-low-rate',createdAt:'02/08/2026',due:'15/08/2026',assignments:[assignment('pending'),assignment('pending')]},
    {id:'complete-new',createdAt:'02/07/2026',due:'22/07/2026',assignments:[assignment('done','09/08/2026 · 09:00')]},
    {id:'closed-recent',createdAt:'01/05/2026',due:'20/05/2026',assignments:[assignment('pending')]},
    {id:'collect-high-rate',createdAt:'01/08/2026',due:'15/08/2026',assignments:[assignment('done','08/08/2026 · 09:00'),assignment('pending')]},
    {id:'collect-soon',createdAt:'03/08/2026',due:'12/08/2026',assignments:[assignment('pending')]},
    {id:'overdue-older',createdAt:'01/07/2026',due:'25/07/2026',assignments:[assignment('pending')]}
  ];
  const sorted=model.sortRequestsForAction(requests,'10/08/2026');
  assert.deepEqual(sorted.map(item=>item.id),[
    'overdue-older','overdue-newer',
    'collect-soon','collect-low-rate','collect-high-rate','collect-later',
    'complete-new','complete-old',
    'closed-recent','closed-old'
  ]);
  assert.equal(requests[0].id,'closed-old');
});

test('manual reminders use a rolling 24-hour cooldown per recipient inside the 90-day window', () => {
  const model=require('./manager-request-model.js');
  const request=model.createRequest({goal:'Reminder cooldown',cycle:'2026',createdAt:'01/08/2026',due:'15/08/2026',designees:[{id:'e1',name:'Tú',login:'tu.nguyen',lvl:'lm1'}],reviewers:[{name:'Nam',login:'nam.le'}],sharedQuestion:'Góc nhìn của bạn?'});
  const assignment=request.assignments[0];
  assert.equal(model.remindAssignment(request,assignment.id,'12/08/2026 10:00'),true);
  assert.equal(assignment.remindedAt,'12/08/2026 10:00');
  assert.deepEqual(assignment.manualReminderHistory,['12/08/2026 10:00']);
  assert.equal(model.canRemindAssignment(request,assignment,'13/08/2026 09:59'),false);
  assert.equal(model.canRemindAssignment(request,assignment,'13/08/2026 10:00'),true);
  assert.equal(model.remindAssignment(request,assignment.id,'13/08/2026 10:00'),true);
  assert.equal(assignment.manualReminderHistory.length,2,'manual reminders are unlimited after each cooldown');
  /* Quá hạn vẫn nhắc được, chỉ cần cách lần trước 24 giờ. */
  assert.equal(model.canRemindAssignment(request,assignment,'16/08/2026 10:00'),true,'reminders continue past the deadline');
  /* Sau 90 ngày kể từ ngày tạo thì ngừng nhắc. */
  assert.equal(model.canRemindAssignment(request,assignment,'29/10/2026 10:00'),true,'still inside the 90-day window');
  assert.equal(model.canRemindAssignment(request,assignment,'01/11/2026 10:00'),false,'reminders stop after 90 days');
});

test('automatic reminder timing is visible but does not block a manual reminder', () => {
  const model=require('./manager-request-model.js');
  const request=model.createRequest({goal:'Automatic reminder',cycle:'2026',createdAt:'01/08/2026',due:'15/08/2026',designees:[{id:'e1',name:'Tú',login:'tu.nguyen',lvl:'lm1'}],reviewers:[{name:'Nam',login:'nam.le'}],sharedQuestion:'Góc nhìn của bạn?'});
  const assignment=request.assignments[0];
  assignment.automaticRemindedAt='12/08/2026 09:00';
  assert.equal(model.automaticReminderDate(request),'12/08/2026');
  assert.equal(model.canRemindAssignment(request,assignment,'12/08/2026 10:00'),true);
});

test('reminder history merges manual and automatic events in chronological order', () => {
  const model=require('./manager-request-model.js');
  const request=model.createRequest({goal:'Reminder history',cycle:'2026',createdAt:'01/08/2026',due:'15/08/2026',designees:[{id:'e1',name:'Tú',login:'tu.nguyen',lvl:'lm1'}],reviewers:[{name:'Nam',login:'nam.le'}],sharedQuestion:'Góc nhìn của bạn?'});
  const assignment=request.assignments[0];
  model.remindAssignment(request,assignment.id,'10/08/2026 10:00');
  assert.deepEqual(model.reminderHistory(request,assignment,'11/08/2026'),[{at:'10/08/2026 10:00',type:'manual'}]);
  assert.deepEqual(model.reminderHistory(request,assignment,'12/08/2026'),[
    {at:'10/08/2026 10:00',type:'manual'},
    {at:'12/08/2026',type:'automatic'}
  ]);
});

test('request detail explains automatic and latest manual reminder timing', () => {
  const html=fs.readFileSync(path.join(__dirname,'request-detail.html'),'utf8');
  assert.match(html,/Hệ thống sẽ tự động nhắc ngày/);
  assert.match(html,/Lần nhắc tiếp theo/);
  assert.match(html,/Đã nhắc: \$\{history\.length\} lần/);
  assert.match(html,/Lần \$\{index\+1\}/);
  assert.match(html,/pending-tag/);
  assert.match(html,/question pending-question/);
  assert.match(html,/\.pending-actions\{[^}]*display:flex[^}]*align-items:center/);
  assert.match(html,/\.pending-tag\{[^}]*border:0[^}]*background:transparent/);
  assert.match(html,/\.question\.pending-question\{[^}]*background:#fff[^}]*border:1px solid var\(--warning-border\)[^}]*border-radius:7px/);
  assert.match(html,/\.question\.pending-question \.label\{[^}]*color:var\(--z500\)/);
  assert.match(html,/\.reminder-history-tip\{[^}]*font-size:10px/);
  assert.match(html,/bx-info-circle/);
  assert.doesNotMatch(html,/event\.type==='automatic'\?'Tự động':'Thủ công'/);
});

test('feedback requests close after 90 days only when responses remain missing', () => {
  const model = require('./manager-request-model.js');
  assert.equal(model.maxDueDate('01/08/2026'),'30/10/2026');
  assert.deepEqual(model.dueRange('01/08/2026'),{min:'2026-08-01',max:'2026-10-30'});
  const input={goal:'Test 90-day rule',cycle:'2026',createdAt:'01/08/2026',due:'30/10/2026',designees:[{id:'e1',name:'Tú',login:'tu.nguyen',lvl:'lm1'}],reviewers:[{name:'Nam',login:'nam.le'}],sharedQuestion:'Góc nhìn của bạn?'};
  const request=model.createRequest(input);
  assert.equal(model.requestStatus(request,'30/10/2026'),'collecting');
  assert.equal(model.requestStatus(request,'31/10/2026'),'closed');
  assert.equal(model.remindPending(request,'31/10/2026'),0,'closed requests cannot be reminded');
  assert.throws(()=>model.createRequest({...input,due:'31/10/2026'}),/90 ngày/);
  assert.throws(()=>model.createRequest({...input,due:'31/07/2026'}),/ngày tạo/);
  request.assignments[0].status='done';request.assignments[0].repliedAt='30/10/2026';
  assert.equal(model.requestStatus(request,'31/10/2026'),'complete','completed requests stay complete after 90 days');
});

test('overdue requests keep collecting until they complete inside the 90-day window', () => {
  const model=require('./manager-request-model.js');
  const request=model.createRequest({
    goal:'Continue collection after due date',cycle:'2026',createdAt:'01/08/2026',due:'05/08/2026',
    designees:[{id:'e1',name:'Tu',login:'tu.nguyen',lvl:'lm1'}],
    reviewers:[{name:'Nam',login:'nam.le'},{name:'Mai',login:'mai.tran'}],sharedQuestion:'Goc nhin cua ban?'
  });
  assert.equal(model.requestStatus(request,'06/08/2026'),'overdue');
  request.assignments.forEach(item=>{item.status='done';item.repliedAt='10/08/2026';});
  assert.equal(model.requestStatus(request,'10/08/2026'),'complete');
});

test('manager request due field exposes the 90-day limit and closed status', () => {
  const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
  assert.match(html,/Yêu cầu có hiệu lực tối đa 90 ngày kể từ ngày tạo\./);
  assert.match(html,/function configureRequestDueRange\(\)/);
  assert.match(html,/due\.min=range\.min;due\.max=range\.max/);
  assert.match(html,/status==='closed'\?'Đóng'/);
  assert.doesNotMatch(html,/Không phản hồi/);
});

test('design system defines the closed request state after the 90-day collection window', () => {
  const design=fs.readFileSync(path.join(__dirname,'..','design-system','index.html'),'utf8');
  assert.match(design,/fb-st-closed/);
  assert.match(design,/Đóng/);
  assert.match(design,/90 ngày/);
});

test('D4 request store initializes, upserts and serializes without duplicate ids', () => {
  const model = require('./manager-request-model.js');
  const request = model.createRequest({
    goal:'Test request',
    id:'monitor-store',cycle:'2026',createdAt:'01/08/2026',due:'15/08/2026',
    designees:[{id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',lvl:'lm1'}],
    reviewers:[{name:'Lê Thành Nam',login:'nam.le',ini:'LN'}],sharedQuestion:'Câu hỏi chung'
  });
  const store=model.createStore([request]);
  assert.equal(store.get('monitor-store').id,'monitor-store');
  store.upsert({...request,due:'20/08/2026'});
  assert.equal(store.requests.length,1);
  assert.equal(store.get('monitor-store').due,'20/08/2026');
  assert.deepEqual(JSON.parse(store.serialize()).map(item=>item.id),['monitor-store']);
  store.replace([]);
  assert.equal(store.requests.length,0);
});

test('manager requests created with identical business data still receive unique ids', () => {
  const model = require('./manager-request-model.js');
  const input = {
    goal:'Test request',
    cycle:'2026', createdAt:'04/08/2026', due:'15/08/2026',
    designees:[{id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',lvl:'lm1'}],
    reviewers:[{name:'Lê Thành Nam',login:'nam.le',ini:'LN'}],
    sharedQuestion:'Bạn ghi nhận điều gì?'
  };
  const first=model.createRequest(input);
  const second=model.createRequest(input);
  assert.notEqual(first.id,second.id);
});

test('request goals are required, trimmed and legacy requests are migrated safely', () => {
  const model=require('./manager-request-model.js');
  const storageAdapter=require('./manager-request-storage.js');
  const created=model.createRequest({
    goal:'  Thu thập góc nhìn dự án Migration  ',cycle:'2026',createdAt:'04/08/2026',due:'15/08/2026',
    designees:[{id:'e1',name:'Nguyễn Văn Tú',login:'tu.nguyen',lvl:'lm1'}],
    reviewers:[{name:'Mai Thị Hằng',login:'hang.mai',ini:'MH'}],sharedQuestion:'Tú phối hợp như thế nào?'
  });
  assert.equal(created.goal,'Thu thập góc nhìn dự án Migration');
  assert.throws(()=>model.createRequest({cycle:'2026',createdAt:'04/08/2026',due:'15/08/2026',designees:[],reviewers:[]}),/Mục tiêu/);
  const legacy={id:'legacy',cycle:'2026',createdAt:'01/08/2026',question:'Câu hỏi cũ',assignments:[]};
  const memory={'requests':JSON.stringify([legacy])};
  const storage={getItem:key=>memory[key]||null,setItem:(key,value)=>{memory[key]=value;}};
  const loaded=storageAdapter.load(storage,'requests',()=>[]);
  assert.equal(loaded[0].goal,'Câu hỏi cũ');
});

test('D4 seed requests all have a management goal', () => {
  const seed=require('./manager-request-seed.js');
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','assets','employees-data.js'),'utf8'),context);
  const requests=seed.create(context.window.PMS_EMPLOYEES);
  assert.ok(requests.every(request=>request.goal));
  assert.ok(requests.length>=8);
  assert.equal(requests[0].goal,'Thu thập phản hồi sau workshop Leadership tháng 8');
  assert.equal(requests[2].goal,'Thu thập góc nhìn phục vụ coaching và kế hoạch phát triển Q3');
});

test('D4 seed provides collecting, overdue and complete request scenarios', () => {
  const model=require('./manager-request-model.js');
  const seed=require('./manager-request-seed.js');
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','assets','employees-data.js'),'utf8'),context);
  const requests=seed.create(context.window.PMS_EMPLOYEES);
  assert.ok(requests.length>=3);
  const statuses=new Set(requests.map(item=>model.requestStatus(item,'04/08/2026')));
  assert.deepEqual([...statuses].sort(),['collecting','complete','overdue']);
  assert.ok(requests.every(item=>item.cycle==='2026'&&item.assignments.length>0));
  assert.ok(requests.some(item=>item.assignments.some(assignment=>assignment.remindedAt)));
});

test('D4 storage loads valid requests, falls back on corrupt JSON and saves updates', () => {
  const storageAdapter=require('./manager-request-storage.js');
  const key='pms.managerFeedbackRequests.v2';
  const memory={};
  const storage={
    getItem(name){return Object.prototype.hasOwnProperty.call(memory,name)?memory[name]:null;},
    setItem(name,value){memory[name]=value;}
  };
  const seed=[{id:'seed-1',goal:'Seed request',cycle:'2026',assignments:[]}];
  assert.deepEqual(storageAdapter.load(storage,key,()=>seed),seed);
  assert.equal(JSON.parse(memory[key])[0].id,'seed-1','fallback seed is persisted');
  memory[key]='{broken';
  assert.deepEqual(storageAdapter.load(storage,key,()=>seed),seed,'corrupt JSON falls back safely');
  assert.equal(storageAdapter.save(storage,key,[{id:'saved'}]),true);
  assert.equal(JSON.parse(memory[key])[0].id,'saved');
  assert.equal(storageAdapter.save({setItem(){throw new Error('blocked');}},key,[]),false);
});

test('D4 manager page wires request seed and local persistence', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /manager-request-seed\.js/);
  assert.match(html, /manager-request-storage\.js/);
  assert.match(html, /pms\.managerFeedbackRequests\.v2/);
  assert.match(html, /function loadRequestStore\(/);
  assert.match(html, /function persistRequestStore\(/);
  assert.match(html, /ManagerRequestStorage\.load/);
});

test('manager request form requires a management goal and persists it', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html,/id="requestGoal"/);
  assert.match(html,/for="requestGoal">Mục tiêu/);
  assert.match(html,/goal:document\.getElementById\('requestGoal'\)\.value\.trim\(\)/);
  assert.match(html,/goal:document\.getElementById\('requestGoal'\)\.value/);
});

test('D4 request monitoring follows approved v5 list and Kanban structure', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  for (const id of ['contentModeTabs','feedbackModeTab','requestsModeTab','feedbackModePanel','requestModePanel','requestList','requestFilterToggle','requestListView','requestKanbanView','requestLoadMore']) {
    assert.match(html, new RegExp(`id="${id}"`), `${id} is required`);
  }
  assert.match(html,/Phản hồi nhân viên đã nhận<\/button>/);
  assert.match(html,/Yêu cầu phản hồi đã tạo<\/button>/);
  assert.match(html, /function setContentMode\(/);
  assert.match(html, /function renderRequestMonitoring\(/);
  assert.match(html, /function loadMoreRequests\(/);
  assert.match(html, /function setRequestView\(/);
  assert.match(html, /function renderRequestKanban\(/);
  assert.doesNotMatch(html,/id="requestDetailShell"/);
  assert.doesNotMatch(html,/numeric-pagination/);
});

test('manager request UI follows shared typography, table-link and progress-chip rules', () => {
  const html=fs.readFileSync(pagePath,'utf8');
  assert.match(html,/#requestDialog\{font-size:14px\}/);
  assert.match(html,/\.text-input\{[^}]*font-size:13px/);
  assert.match(html,/\.request-table-row[^}]*text-decoration:none/);
  assert.match(html,/progress-chip/);
  assert.match(html,/Đang thu thập: \$\{stat\.done\}\/\$\{stat\.total\} đã trả lời/);
  assert.match(html,/Hoàn thành: \$\{stat\.done\}\/\$\{stat\.total\} đã trả lời/);
  assert.doesNotMatch(html,/\$\{stat\.pending\} chưa trả lời/);
  assert.match(html,/<span>Yêu cầu<\/span><span>Nhân viên nhận feedback<\/span>/);
  assert.match(html,/\.request-table-row\{[^}]*align-items:flex-start/);
});

test('manager content tabs are folder tabs, with a thin pink outline on the closed one', () => {
  const html=fs.readFileSync(pagePath,'utf8');
  const m01=fs.readFileSync(path.join(__dirname,'..','M-01','index.html'),'utf8');
  assert.match(html,/Phản hồi nhân viên đã nhận<\/button>/);
  assert.match(html,/Yêu cầu phản hồi đã tạo<\/button>/);

  // hình dạng thẻ lấy theo M-01
  assert.ok(html.includes('border-bottom:2px solid var(--z200)'));
  assert.ok(html.includes('border-radius:var(--rsm) var(--rsm) 0 0;margin-bottom:-2px'));
  assert.ok(m01.includes('border-radius:var(--rsm) var(--rsm) 0 0'));

  // tab đang mở: nền hồng nhạt + vạch hồng trên đỉnh
  assert.ok(html.includes('.content-tab.on{color:var(--brand);background:var(--brand-muted);border-color:var(--brand-ring);border-bottom-color:var(--brand-muted);font-weight:700;box-shadow:inset 0 3px 0 var(--brand)}'));

  // tab chưa mở: VIỀN HỒNG mảnh nhưng NỀN TRẮNG, chữ không làm mờ
  assert.ok(html.includes('border:1px solid var(--brand-ring)'));
  assert.ok(html.includes('background:var(--z0);color:var(--z800);font-size:13px;font-weight:600'));
  assert.ok(!html.includes('border:1px solid var(--z300)'), 'tab chưa mở không được dùng viền xám');

  // không quay lại các kiểu đã bị loại
  assert.ok(!html.includes('.content-tab:after'), 'đã loại kiểu gạch chân');
  assert.ok(!html.includes('.content-tab.on{background:var(--brand);color:var(--z0)'), 'đã loại kiểu thanh phân đoạn');

  // bộ lọc phạm vi giữ nguyên, không bị đụng tới
  assert.match(html,/\.scope-tabs\{[^}]*background:var\(--z100\)[^}]*border-radius:8px/);
  assert.match(html,/\.scope-btn\.on\{[^}]*background:#fff/);
  assert.ok(html.includes('id="tab-direct" onclick="setScope(\'lm1\')"'));

  const tabBlock=html.match(/id="contentModeTabs"[\s\S]*?<\/div>/)?.[0]||'';
  assert.doesNotMatch(tabBlock,/requestModeBadge|content-count/);
});

test('Kanban uses neutral lanes and cards with semantic color only in headers', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /kanban-lane \$\{status\}/);
  assert.match(html, /class="kanban-dot"/);
  assert.match(html, /\.kanban-lane\{[^}]*border:1px solid var\(--z200\)[^}]*background:var\(--z50\)/);
  assert.match(html, /\.kanban-title\{[^}]*background:var\(--lane-tint\)[^}]*color:var\(--lane-color\)/);
  assert.match(html, /\.kanban-dot\{[^}]*background:var\(--lane-color\)/);
  assert.match(html, /\.kanban-card\{[^}]*border:1px solid var\(--z200\)[^}]*background:#fff/);
  assert.match(html, /class="kanban-empty"/);
  assert.match(html, /\.kanban-empty\{[^}]*font-size:10\.5px/);
  assert.doesNotMatch(html, /\.kanban-lane\.(collecting|overdue|complete)\{[^}]*background:/);
  assert.doesNotMatch(html, /border-left-(width|color)/);
});

test('list view renders a lean cycle overview and Kanban uses full width', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  for (const id of ['requestListLayout','requestOverview','overviewTotal','overviewCollecting','overviewOverdue','overviewComplete','overviewClosed']) {
    assert.match(html, new RegExp(`id="${id}"`), `${id} is required`);
  }
  assert.match(html, /function renderRequestOverview\(/);
  assert.match(html, /status==='complete'/);
  assert.match(html, /request-list-layout/);
  assert.match(html, /requestView==='list'/);
  assert.doesNotMatch(html, /Cần chú ý/);
  assert.doesNotMatch(html, /Sẵn sàng tóm tắt AI/);
});

test('request list reserves enough width for progress chips beside the overview', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /\.request-list-layout \.request-table-head,\.request-list-layout \.request-table-row\{grid-template-columns:minmax\(280px,1\.2fr\) minmax\(170px,\.72fr\) minmax\(250px,\.92fr\) 20px\}/);
  assert.match(html, /\.request-list-layout \.progress-chip\{max-width:100%/);
});

test('request monitoring opens a dedicated detail route with shared identity rules', () => {
  const html=fs.readFileSync(pagePath,'utf8');
  const detail=fs.readFileSync(path.join(__dirname,'request-detail.html'),'utf8');
  assert.match(html,/request-detail\.html\?request=/);
  assert.match(detail,/manager-request-storage\.js/);
  assert.match(detail,/manager-request-seed\.js/);
  assert.match(detail,/id="requestEmployeeRail"/);
  assert.match(detail,/id="requestResponseFeed"/);
  assert.match(detail,/fb-arrow/);
  assert.match(detail,/Phòng ban - Team - Vị trí/);
});

test('request detail separates employee identity from received progress', () => {
  const html = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  assert.match(html, /person-copy/);
  assert.match(html, /Đã nhận: \$\{match\[1\]\}\/\$\{match\[2\]\} phản hồi/);
});

test('request detail uses a scannable three-region layout and shared feedback components', () => {
  const html = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  assert.match(html, /class="shell request-detail-layout"/);
  assert.match(html, /class="ticket-summary"/);
  assert.match(html, /id="ticketSummary"/);
  assert.match(html, /\.content-pane\{[^}]*min-height:0[^}]*display:flex[^}]*flex-direction:column/);
  assert.match(html, /\.pane-body\{[^}]*overflow-y:auto/);
  assert.match(html, /\.shared-question,\.question\{[^}]*background:var\(--brand-muted\)[^}]*border-left:3px solid var\(--brand-ring\)/);
  assert.match(html, /\.pending\.pending\{[^}]*background:var\(--warning-muted\)[^}]*border:1px solid var\(--warning-border\)/);
  assert.match(html, /ManagerFeedbackData\.coreValueIcon\(cv\)/);
  assert.match(html, /<img src="\.\.\/Core value with BG\/\$\{icon\}"/);
  assert.match(html, /renderTicketSummary\(stat,rows\)/);
  assert.doesNotMatch(html, /requestProgress[^;]*stat\.pending/);
});

test('request detail keeps ticket metadata in the summary and core values in the employee header', () => {
  const html = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  assert.match(html,/summary-status summary-status-\$\{lifecycle\}/);
  assert.match(html,/\.summary-status-overdue\{[^}]*color:var\(--error\)[^}]*background:var\(--error-muted\)[^}]*border-color:var\(--error-border\)/);
  assert.doesNotMatch(html, /id="requestMeta"/);
  assert.doesNotMatch(html, /id="requestProgress"/);
  assert.match(html, /id="employeeBadgeSummary"/);
  assert.match(html, /function employeeBadgeSummary\(assignments\)/);
  assert.match(html, /Phản hồi đã nhận của \$\{employee\?\.name\|\|''\}/);
  assert.doesNotMatch(html, /id="employeeProgress"/);
  assert.match(html, /Nhân viên nhận phản hồi/);
  assert.match(html, /Nhân viên cho phản hồi/);
  assert.match(html, /new Set\(request\.assignments\.map\(item=>item\.reviewer\.login\)\)\.size/);
  assert.match(html, /\.btn-remind\{[^}]*font-size:11\.5px[^}]*font-weight:600[^}]*box-shadow:/);
  assert.match(html, /\.btn-remind\{[^}]*height:30px[^}]*padding:0 10px[^}]*white-space:nowrap/);
  assert.match(html, /\.btn-pending-remind\{[^}]*height:28px[^}]*padding:0 9px[^}]*font-size:11px/);
  assert.match(html, /class="btn btn-pending-remind" onclick="remindOne/);
});

test('AI coaching summary requires two responses and refreshes from the latest response set', () => {
  const modelPath = path.join(__dirname, 'manager-ai-summary.js');
  assert.ok(fs.existsSync(modelPath), 'manager AI summary model must exist');
  const ManagerAiSummary = require(modelPath);
  const employee = {id:'e1',name:'Nguyễn Văn Tú'};
  const one = ManagerAiSummary.create(employee,[{date:'01/08/2026',body:'Phối hợp tốt.',cv:['Tinh thần đồng đội']}]);
  const two = ManagerAiSummary.create(employee,[
    {date:'01/08/2026',body:'Phối hợp tốt.',cv:['Tinh thần đồng đội']},
    {date:'03/08/2026',body:'Chủ động và rõ ràng.',cv:['Thực thi xuất sắc']}
  ]);
  const three = ManagerAiSummary.create(employee,[
    {date:'01/08/2026',body:'Phối hợp tốt.',cv:['Tinh thần đồng đội']},
    {date:'03/08/2026',body:'Chủ động và rõ ràng.',cv:['Thực thi xuất sắc']},
    {date:'05/08/2026',body:'Có thể chia sẻ context sớm hơn.',cv:[]}
  ]);
  assert.equal(one.available,false);
  assert.equal(two.available,true);
  assert.equal(two.responseCount,2);
  assert.equal(three.responseCount,3);
  assert.equal(three.updatedAt,'05/08/2026');
  assert.notDeepEqual(three.opportunities,two.opportunities);
});

test('request detail renders a non-editable AI summary before original feedback evidence', () => {
  const html = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  assert.match(html, /manager-ai-summary\.js/);
  assert.match(html, /id="employeeAiSummary"/);
  assert.match(html, /employeeAiSummary[\s\S]*sharedQuestion/);
  assert.match(html, /Điểm mạnh/);
  assert.match(html, /Cơ hội phát triển/);
  assert.doesNotMatch(html, /Chỉ đọc|ai-readonly/);
  assert.match(html, /Cập nhật: \$\{summary\.updatedAt\}/);
  assert.match(html, /Cần ít nhất 2 phản hồi để tạo AI Summary/);
  assert.doesNotMatch(html, /Tự động cập nhật khi có phản hồi mới|Chủ đề lặp lại|Tổng hợp từ \$\{summary\.responseCount\}/);
  assert.doesNotMatch(html, /Sửa AI Summary|Chỉnh sửa summary|Regenerate|Tạo lại/);
  assert.match(html, /function renderEmployeeAiSummary\(employee,done\)/);
  assert.match(html, /\.ai-summary\{[^}]*border-color:var\(--z200\)[^}]*box-shadow:/);
  assert.match(html, /\.ai-summary-head\{[^}]*background:#fff/);
  assert.match(html, /\.shared-question,\.question\{[^}]*background:var\(--brand-muted\)[^}]*border-left:3px solid var\(--brand-ring\)/);
  assert.match(html, /\.ai-summary-head-meta\{[^}]*flex-direction:row/);
  assert.match(html, /const collapsedAiEmployees=new Set\(\)/);
  assert.match(html, /function toggleEmployeeAiSummary\(employeeId\)/);
  assert.match(html, /aria-expanded="\$\{!collapsed\}"/);
  assert.match(html, /aria-label="\$\{collapsed\?'Mở AI Summary':'Thu gọn AI Summary'\}"/);
  assert.match(html, /class="ai-summary-toggle"/);
  assert.match(html, /\.ai-summary\.collapsed \.ai-summary-content\{display:none\}/);
});

test('request detail uses the shared compact question and answer pattern for individual questions', () => {
  const html = fs.readFileSync(path.join(__dirname, 'request-detail.html'), 'utf8');
  assert.match(html, /function responsePair\(question,body\)/);
  assert.match(html, /class="qa-q"><span class="qa-label">Câu hỏi:<\/span> <span class="qa-text">\$\{question\}<\/span>/);
  assert.match(html, /request\.questionMode==='individual'\?responsePair\(assignment\.question/);
  assert.match(html, /\.qa-q\{[^}]*width:100%[^}]*background:var\(--brand-muted\)/);
  assert.match(html, /\.qa-a::before\{[^}]*top:-2px[^}]*border-bottom/);
  assert.match(html, /\.shared-question \.label\{[^}]*color:var\(--z500\)/);
});

test('shared feedback data gives every employee three manager-visible scenarios', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'employees-data.js'), 'utf8');
  const context = {window:{}};
  vm.runInNewContext(source, context);
  const ManagerFeedbackData = require('./manager-feedback-data.js');
  const store = ManagerFeedbackData.createStore(context.window.PMS_EMPLOYEES);

  for (const employee of context.window.PMS_EMPLOYEES) {
    const feedback = store.feedbackFor(employee.id, '2026');
    assert.ok(feedback.length >= 3, `${employee.id} must have at least three visible responses`);
    assert.ok(feedback.some(item => item.question), `${employee.id} must include requested feedback`);
    assert.ok(feedback.some(item => !item.cv.length), `${employee.id} must include feedback without badges`);
    assert.doesNotMatch(store.employeeMeta(employee), /·/);
  }
});

/* ── §20 — nguyên tắc đồng bộ giữa các màn hình ─────────────────────────────
   Ba test dưới đây không kiểm tra một màn cụ thể, mà kiểm tra ĐIỀU KIỆN để các
   màn không lệch nhau. Chúng là chốt chặn cho loại lỗi "mỗi màn một luật" mà
   nhìn riêng từng màn thì không thấy được. */

test('§20.1 màn hình không chép lại hàm luật của model vào script của chính nó', () => {
  /* Chép là sẽ lệch, và lệch kiểu này im lặng: test đọc model nên vẫn xanh
     trong khi màn hình chạy bản chép đã sai. Cần luật gì thì <script src> model đó vào. */
  const owned = ['dateFromDMY','dateTimeFromDMY','tsFromDMY','maxDueDate','dueRange','automaticReminderDate','requestStatus'];
  const screens = [
    'E-04/index.html','E-05/index.html',
    'M-04/index.html','M-04/request-detail.html','M-04/feedback-detail.html',
    'H-05/index.html','H-05/create-campaign.html','H-05/questionnaire-library.html',
    'H-06/index.html','H-07/index.html'
  ].filter(screen => fs.existsSync(path.join(__dirname, '..', screen)));
  for (const screen of screens) {
    const html = fs.readFileSync(path.join(__dirname, '..', screen), 'utf8');
    for (const fn of owned) {
      assert.ok(!html.includes(`function ${fn}(`) && !html.includes(`function ${fn} (`),
        `${screen} định nghĩa lại ${fn}() — luật này thuộc về model, xem DESIGN-SYSTEM.md §20.1`);
    }
  }
});

test('§20.2 mã lý do đóng là một bộ dùng chung, không màn nào tự đặt mã riêng', () => {
  const model = require(requestModelPath);
  const codes = model.closeReasonCodes();
  /* Bốn mã cấp yêu cầu phải khớp đúng closeReason(), cộng một mã cấp ticket. */
  ['creator-resigned','manual','no-active-ticket','expired','recipient-resigned']
    .forEach(code => assert.ok(codes.includes(code), `thiếu mã ${code}`));

  for (const screen of ['E-04/index.html','M-04/index.html','M-04/request-detail.html']) {
    const html = fs.readFileSync(path.join(__dirname, '..', screen), 'utf8');
    [...html.matchAll(/closedReason:\s*'([a-z-]+)'/g)].forEach(match =>
      assert.ok(codes.includes(match[1]), `${screen} dùng mã lạ "${match[1]}" — xem §20.2`));
  }
});

test('§20.4 đóng yêu cầu thì đóng băng số liệu, ticket bị khoá vẫn nằm trong mẫu số', () => {
  const model = require(requestModelPath);
  const make = () => ({
    id:'r1', createdAt:'01/08/2026', due:'20/08/2026', createdBy:{login:'sep'},
    assignments:[
      {id:'a1',employeeId:'e1',employeeName:'A',status:'done',reviewer:{login:'r1'}},
      {id:'a2',employeeId:'e1',employeeName:'A',status:'pending',reviewer:{login:'r2'}},
      {id:'a3',employeeId:'e1',employeeName:'A',status:'pending',reviewer:{login:'r3'}}
    ]});
  const today = '10/08/2026';

  /* Đóng lúc mới thu được 1/3 mà hiện 100% là che mất đúng thứ thao tác đóng cần ghi lại. */
  const closed = model.closeRequestManually(make(), today);
  assert.deepEqual(model.summarize(closed, today), {total:3,done:1,pending:2,overdue:0,rate:33});
  assert.equal(model.requestStatus(closed, today), 'closed');

  /* Cùng cách H-06 xử lý: cờ loại trừ do nghỉ việc chỉ đặt khi CÒN thu thập. */
  const gone = person => String(person && (person.login || person.id || '')) === 'r2';
  assert.equal(model.applyResignation(make(), gone).assignments[1].excludedByResignation, true);
  assert.equal(model.applyResignation(closed, gone).assignments[1].excludedByResignation, false);
});

test('§20 design system ghi rõ nguyên tắc đồng bộ giữa các màn hình', () => {
  const designSystem = fs.readFileSync(path.join(__dirname, '..', 'DESIGN-SYSTEM.md'), 'utf8');
  assert.match(designSystem, /## 20\. NGUYÊN TẮC ĐỒNG BỘ GIỮA CÁC MÀN HÌNH/);
  assert.match(designSystem, /Luật nghiệp vụ chỉ được viết MỘT lần, trong file model/);
  assert.match(designSystem, /Một sự việc — một bộ mã — nhiều câu chữ/);
  assert.match(designSystem, /Ticket bị khoá khi đóng vẫn nằm trong mẫu số/);
  /* Mở lại: HR chốt sau khi chia sẻ, quản lý thì không — khác nhau có chủ đích, phải ghi rõ. */
  assert.match(designSystem, /mở lại được \*\*chừng nào chưa chia sẻ kết quả\*\*/);
});

/* ═══ Quản lý thả tim cảm ơn phản hồi nhân viên nhận được ═══
   Chốt thiết kế: giữ nguyên hình trái tim và vị trí ngay sau tên người gửi;
   hai tim chồng lệch khi cả nhân viên lẫn quản lý đều cảm ơn;
   tim nhân viên #a50064 (hồng MoMo), tim quản lý #f95396 (hồng +1);
   nút "Cảm ơn" nằm cuối dòng ngày để card không phát sinh dòng mới. */
function fakeStorage(initial){
  const map=new Map(Object.entries(initial||{}));
  return {getItem:key=>map.has(key)?map.get(key):null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key),dump:()=>Object.fromEntries(map)};
}

test('manager thanks store persists picked feedback ids and survives broken storage', () => {
  const thanks = require('./manager-thanks.js');
  const storage = fakeStorage();
  const store = thanks.createStore(storage, 'test.thanks');
  assert.equal(store.has('f1'), false);
  assert.equal(store.add('f1'), true);
  assert.equal(store.add('f1'), false, 'mỗi người chỉ thả một tim cho một phản hồi');
  assert.equal(store.has('f1'), true);
  assert.deepEqual(JSON.parse(storage.dump()['test.thanks']), ['f1']);
  // mở lại trang: đọc lại đúng trạng thái cũ
  assert.equal(thanks.createStore(storage, 'test.thanks').has('f1'), true);
  // localStorage hỏng thì bắt đầu từ rỗng chứ không nổ
  assert.equal(thanks.createStore(fakeStorage({'test.thanks':'{['}), 'test.thanks').has('f1'), false);
});

test('thanks mark keeps the heart shape, pairs two MoMo pinks and always names the feedback giver', () => {
  const thanks = require('./manager-thanks.js');
  assert.equal(thanks.markHTML({receiver:false, manager:false}, 'Lê Thành Nam'), '');
  const onlyReceiver = thanks.markHTML({receiver:true, manager:false}, 'Lê Thành Nam');
  const onlyManager = thanks.markHTML({receiver:false, manager:true}, 'Lê Thành Nam');
  const both = thanks.markHTML({receiver:true, manager:true}, 'Lê Thành Nam');
  // một người → một tim, màu cho biết là ai
  assert.match(onlyReceiver, /class="h-rcv"/);
  assert.doesNotMatch(onlyReceiver, /h-mgr/);
  assert.match(onlyManager, /class="h-mgr"/);
  assert.doesNotMatch(onlyManager, /h-rcv/);
  // tim lẻ dùng đúng cấu trúc câu của màn nhân viên E-04: "<ai> đã cảm ơn <người cho phản hồi>"
  assert.match(onlyReceiver, /Nhân viên đã cảm ơn Lê Thành Nam/);
  assert.match(onlyManager, /Bạn đã cảm ơn Lê Thành Nam/);
  // hai người → hai tim chồng lệch, tách nhau bằng viền trắng
  assert.match(both, /h-mgr[\s\S]*h-cut[\s\S]*h-rcv/);
  // ô chú thích gộp làm một, nêu tên người cho phản hồi, không có thời gian
  assert.match(both, /Đã cảm ơn Lê Thành Nam/);
  assert.match(both, /Nhân viên[\s\S]*người nhận phản hồi/);
  assert.match(both, /Bạn[\s\S]*quản lý trực tiếp/);
  assert.doesNotMatch(both, /\d{2}\/\d{2}\/\d{4}/);
});

test('manager feedback card offers the thank action until the manager has used it', () => {
  const thanks = require('./manager-thanks.js');
  const data = require('./manager-feedback-data.js');
  const employee = {name:'Tú', ini:'NT', login:'tu.nguyen'};
  const item = {id:'f1', thankedByReceiver:true, sender:{name:'Trương Minh Đức', dom:'duc.truong', ini:'TĐ'}, date:'05/06/2026', body:'Nội dung', cv:[]};
  const store = thanks.createStore(fakeStorage(), 'test.card');
  thanks.use(store);
  try {
    const before = data.feedbackCard(item, employee);
    // tim của nhân viên đã có sẵn, nút vẫn còn cho quản lý
    assert.match(before, /data-thx-receiver="1"/);
    assert.match(before, /class="h-rcv"/);
    assert.match(before, /class="fb-thx" data-thx-id="f1"/);
    assert.match(before, /onclick="thankFeedback\('f1',this\)"/);
    // thanh cảm ơn nằm ở CHÂN card, đúng vị trí và cách thể hiện của màn nhân viên E-04
    assert.match(before, /<div class="fb-thx-bar"><button type="button" class="fb-thx"/);
    assert.match(before, /<span class="fb-thx-hint">Gửi tim tim để cảm ơn người cho phản hồi nhé<\/span><\/div><\/article>$/);
    // tim lẻ của nhân viên nêu tên đúng người đã cho phản hồi
    assert.match(before, /Nhân viên đã cảm ơn Trương Minh Đức/);
    assert.doesNotMatch(before, /fb-date">05\/06\/2026[^<]*<[^/]/, 'dòng ngày giữ nguyên, không nhét nút vào');
    store.add('f1');
    const after = data.feedbackCard(item, employee);
    assert.doesNotMatch(after, /class="fb-thx"/, 'đã thả tim thì nút biến mất');
    assert.match(after, /h-mgr[\s\S]*h-cut[\s\S]*h-rcv/, 'còn lại dấu hai tim');
    assert.match(after, /Đã cảm ơn Trương Minh Đức/);
  } finally {
    thanks.use(null);
  }
});

test('manager feedback card stays unchanged when the thanks module is not wired in', () => {
  const thanks = require('./manager-thanks.js');
  const data = require('./manager-feedback-data.js');
  thanks.use(null);
  const card = data.feedbackCard({id:'f1', thankedByReceiver:true, sender:{name:'An', dom:'an.le', ini:'AL'}, date:'01/08/2026', body:'Nội dung', cv:[]}, {name:'Tú'});
  assert.doesNotMatch(card, /thx-mark|fb-thx/);
});

test('both manager surfaces load the thanks module and share one localStorage state', () => {
  const pages = [fs.readFileSync(pagePath, 'utf8'), fs.readFileSync(detailPath, 'utf8')];
  for (const html of pages) {
    assert.match(html, /<script src="manager-thanks\.js"><\/script>/);
    assert.match(html, /ManagerThanks\.use\(ManagerThanks\.createStore\(window\.localStorage\)\)/);
    assert.match(html, /function thankFeedback\(id,button\)\{const who=ManagerThanks\.thank\(id,button\);/);
    // cùng một bộ màu chốt cho hai tim, dùng chung ở popup, split view và trang chi tiết
    assert.match(html, /\.thx-mark \.h-rcv\{fill:#a50064\}/);
    assert.match(html, /\.thx-mark \.h-mgr\{fill:#f95396\}/);
    assert.match(html, /\.thx-mark svg\{display:block;height:14px/);
    // ô chú thích luôn nằm gọn trên MỘT dòng, không bị ngắt giữa chừng vì tên dài
    assert.match(html, /\.thx-tip\{[^}]*width:max-content;white-space:nowrap/);
    // DESIGN-SYSTEM 19.0: cấm middot, mọi chỗ ngăn cách metadata phải dùng " - "
    assert.doesNotMatch(html, /·/);
    assert.doesNotMatch(html, /\.thx-tip\{[^}]*max-width/);
    // thanh cảm ơn dùng đúng bộ style của E-04: kẻ đứt, nút pill, dòng gợi ý, thu lại khi bấm
    assert.match(html, /\.fb-thx-bar\{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:11px;border-top:1px dashed var\(--z200\)/);
    assert.match(html, /\.fb-thx-bar\.gone\{opacity:0;height:0/);
    assert.match(html, /\.fb-thx\{[^}]*padding:5px 13px;border-radius:20px;font-size:12\.5px/);
    assert.match(html, /\.fb-thx-hint\{font-size:11\.5px;color:var\(--z500\)\}/);
  }
});

test('thanks module follows the design-system metadata separator rule (no middot)', () => {
  // DESIGN-SYSTEM 19.0: TUYỆT ĐỐI không dùng middot "·" trong text UI — luôn là " - ".
  const source = fs.readFileSync(path.join(__dirname, 'manager-thanks.js'), 'utf8');
  assert.doesNotMatch(source, /·/);
  assert.match(source, /<em>- \$\{role\}<\/em>/);
});
