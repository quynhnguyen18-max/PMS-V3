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
  assert.match(html, /Lưu nháp/);
  assert.match(html, /Xóa nội dung/);
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
