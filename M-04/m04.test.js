const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const pagePath = path.join(__dirname, 'index.html');

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
  assert.match(html, /<div class="page-head">[\s\S]*?<div class="manager-cycle">[\s\S]*?<select id="cycle"/);
  assert.match(html, /class="bx bx-calendar"/);
  assert.match(html, /<span>Chu kỳ<\/span>/);
  assert.match(html, /\.manager-cycle>i\{font-size:15px;color:var\(--z500\)\}/);
  assert.match(html, /\.manager-cycle select\{height:28px/);
  const scopeRow = html.match(/<div class="scope-row">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] || '';
  assert.doesNotMatch(scopeRow, /id="cycle"/);
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
  assert.match(html, /Phản hồi đã nhận của <span id="splitEmployeeName"/);
  assert.match(html, /id="splitBadgeSummary"/);
  assert.match(html, /function splitBadgeSummaryHTML\(/);
  assert.match(html, /\.split-pane-body\{[^}]*overflow-y:auto/);
  assert.match(html, /\.split-pane\{[^}]*max-height:/);
  assert.doesNotMatch(html, /id="splitPaneMeta"/);
});

test('manager split view matches employee badge tooltips and omits repeated recipient identity', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const data = fs.readFileSync(path.join(__dirname, 'manager-feedback-data.js'), 'utf8');
  assert.match(html, /class="split-badge-tip"/);
  assert.match(html, /\.split-badge-tip\{[^}]*background:var\(--z900\)[^}]*color:#fff[^}]*border-radius:6px/);
  assert.match(html, /feedbackCard\(item,emp,\{compactRecipient:true,[^}]*senderTooltipPlacement:/);
  assert.match(html, /function feedbackCard\(item,emp,options\)\{\s*return ManagerFeedbackData\.feedbackCard\(item,emp,options\);\s*\}/);
  assert.match(data, /options\.compactRecipient/);
  assert.match(data, /compactRecipient\?'':/);
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
  assert.match(designSystem, /Không dùng.*`·`.*metadata/);
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

test('MR-1 explains responsible use and presents a clear giver-to-receiver flow', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  const plan = fs.readFileSync(path.join(__dirname, '..', 'FEEDBACK_PLAN.md'), 'utf8');
  const guidance = 'Chỉ tạo yêu cầu khi bạn cần thêm góc nhìn cụ thể để coaching, hoặc hỗ trợ nhân viên phát triển. Việc yêu cầu phản hồi quá thường xuyên hoặc không có mục tiêu rõ ràng có thể khiến nhân viên cảm thấy áp lực và thiếu an toàn. Trước khi gửi, hãy bảo đảm nhân viên hiểu mục đích.';
  assert.match(html, new RegExp(guidance.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(html, /class="field request-role-flow"/);
  assert.ok(html.indexOf('id="requestGiverRole"') < html.indexOf('id="requestReceiverRole"'));
  assert.match(html, /Người cho phản hồi<span class="req-star">\*<\/span>/);
  assert.match(html, /class="request-flow-arrow"/);
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
    cycle:'2026', due:'18/08/2026',
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
    cycle:'2026', due:'18/08/2026', personalize:true, designees, reviewers,
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
    cycle:'2026', due:'10/08/2026',
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
  assert.equal(model.remindAssignment(request,request.assignments[1].id,'12/08/2026'),true);
  assert.equal(request.assignments[1].remindedAt,'12/08/2026');
  assert.equal(model.remindAssignment(request,request.assignments[1].id,'12/08/2026'),false,'same-day reminder must be locked');
  assert.equal(model.remindAssignment(request,request.assignments[0].id,'12/08/2026'),false,'done assignment cannot be reminded');
  assert.equal(model.remindPending(request,'13/08/2026'),3,'all pending assignments can be reminded on a new day');

  request.assignments.slice(1).forEach(item=>{item.status='done';item.repliedAt='13/08/2026';});
  assert.equal(model.requestStatus(request,'13/08/2026'),'complete');
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
  assert.equal(requests[1].goal,'Thu thập góc nhìn phục vụ coaching và kế hoạch phát triển Q3');
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
  const key='pms.managerFeedbackRequests.v1';
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
  assert.match(html, /pms\.managerFeedbackRequests\.v1/);
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
  assert.match(html,/Phản hồi nhân viên<\/button>/);
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

test('manager content tabs use explicit labels and no request count badge', () => {
  const html=fs.readFileSync(pagePath,'utf8');
  assert.match(html,/Phản hồi nhân viên<\/button>/);
  assert.match(html,/Yêu cầu phản hồi đã tạo<\/button>/);
  const tabBlock=html.match(/id="contentModeTabs"[\s\S]*?<\/div>/)?.[0]||'';
  assert.doesNotMatch(tabBlock,/requestModeBadge|content-count/);
});

test('Kanban lanes reuse the request progress semantic colors', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  assert.match(html, /kanban-lane \$\{status\}/);
  assert.match(html, /\.kanban-lane\.collecting/);
  assert.match(html, /\.kanban-lane\.overdue/);
  assert.match(html, /\.kanban-lane\.complete/);
});

test('list view renders a lean cycle overview and Kanban uses full width', () => {
  const html = fs.readFileSync(pagePath, 'utf8');
  for (const id of ['requestListLayout','requestOverview','overviewTotal','overviewCollecting','overviewOverdue','overviewComplete','overviewAiReady']) {
    assert.match(html, new RegExp(`id="${id}"`), `${id} is required`);
  }
  assert.match(html, /function renderRequestOverview\(/);
  assert.match(html, /status==='complete'/);
  assert.match(html, /request-list-layout/);
  assert.match(html, /requestView==='list'/);
  assert.doesNotMatch(html, /Cần chú ý/);
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
