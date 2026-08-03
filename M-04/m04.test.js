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

test('indirect scopes provide organizational filters and the unfinished D3 CTA is hidden', () => {
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
