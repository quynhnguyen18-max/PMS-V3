const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const Model = require('../assets/hod-upload-model.js');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const employeeScreenHtml = fs.readFileSync(path.join(__dirname, '../E-05/index.html'), 'utf8');
const managerScreenHtml = fs.readFileSync(path.join(__dirname, '../M-05/index.html'), 'utf8');
const proxyJs = fs.readFileSync(path.join(__dirname, '../assets/hrbp-proxy.js'), 'utf8');
const customEmployeeScreenExists = fs.existsSync(path.join(__dirname, 'employee-view.html'));

test('H-08 chỉ trả về nhân viên đủ điều kiện', () => {
  const rows = Model.records();
  assert.ok(rows.length > 0);
  assert.equal(rows.some(row => row.id === 'excluded-demo'), false);
  assert.equal(rows.every(row => row.eligible), true);
});

test('mỗi dòng có loại kỳ và chu kỳ để nhận diện đúng kỳ đánh giá', () => {
  const rows = Model.records();
  assert.ok(rows.some(row => row.period === 'mid_year' && row.cycle === 2026));
  assert.ok(rows.some(row => row.period === 'year_end' && row.cycle === 2026));
  assert.equal(Model.periodLabel('mid_year'), 'Đánh giá giữa năm');
  assert.equal(Model.periodLabel('year_end'), 'Đánh giá cuối năm');
  assert.equal(Model.periodShortLabel(2026, 'mid_year'), 'Giữa năm 2026');
  assert.equal(Model.periodShortLabel(2026, 'year_end'), 'Cuối năm 2026');
});

test('mọi lần nhắc đều có nhãn nộp trễ và hình thức xử lý', () => {
  const rows = Model.records();
  [1, 2, 3, 4].forEach(round => {
    const row = rows.find(item => item.lateRound === round);
    const meta = Model.lateMeta(row, row.previewScore);
    assert.equal(meta.late, true);
    assert.match(meta.label, new RegExp(`Lần nhắc thứ ${round}`));
    assert.ok(meta.measure.length > 0);
  });
});

test('chỉ lần nhắc thứ 3 có điểm cao hơn 3 tạo cảnh báo', () => {
  const rows = Model.records();
  const preview = Model.buildPreview(rows, 2026, 'year_end');
  const warnings = Model.warningRows(preview);
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].late.round, 3);
  assert.ok(warnings[0].score > 3);
  assert.equal(Model.lateMeta(rows.find(row => row.lateRound === 4), 5).warning, false);
});

test('cập nhật điểm chuyển dòng thay đổi sang Chờ HOD duyệt', () => {
  const rows = Model.records();
  const preview = Model.buildPreview(rows, 2026, 'year_end');
  const changed = preview.filter(row => row.result === 'valid');
  const result = Model.applyPreview(rows, preview, { by:'tester', at:'12/10/2026 10:00' });
  changed.forEach(row => {
    const updated = result.find(item => item.id === row.id);
    assert.equal(updated.hrbpUploadScore, row.score);
    assert.equal(updated.hodScore, null);
    assert.equal(updated.uploadStatus, 'pending_approval');
    assert.equal(updated.uploadedBy, 'tester');
  });
});

test('trạng thái H-08 dùng cùng ngôn ngữ với màn hình quản lý và duyệt điểm', () => {
  assert.equal(Model.statusMeta('not_uploaded').label, 'Chờ HOD đánh giá');
  assert.equal(Model.statusMeta('pending_approval').label, 'Chờ HOD duyệt');
  assert.equal(Model.statusMeta('approved').label, 'HOD đã duyệt');
});

test('thanh Demo HRBP thể hiện đủ ba trạng thái cuối năm', () => {
  const cases = [
    ['year_end_not_uploaded', 'not_uploaded', false, false],
    ['year_end_uploaded', 'pending_approval', true, false],
    ['year_end_approved', 'approved', true, true]
  ];
  cases.forEach(([scenario, status, hasHrbpScore, hasHodScore]) => {
    const rows = Model.demoRecords(scenario).filter(row => row.cycle === 2026 && row.period === 'year_end');
    assert.ok(rows.length > 0);
    assert.equal(rows.every(row => row.uploadStatus === status), true);
    assert.equal(rows.every(row => (row.hrbpUploadScore != null) === hasHrbpScore), true);
    assert.equal(rows.every(row => (row.hodScore != null) === hasHodScore), true);
  });
  ['HRBP chưa upload điểm cuối năm', 'HRBP đã upload điểm cuối năm', 'HOD đã duyệt điểm cuối năm'].forEach(label => assert.ok(html.includes(label)));
  assert.ok(html.includes('id="pms-demo-pill"'));
  assert.ok(html.includes('function applyHrbpDemoScenario(code)'));
});

test('bộ lọc kết hợp nhiều trường cơ cấu và người phê duyệt', () => {
  const rows = Model.records();
  const filtered = Model.filter(rows, {
    cycle: '2026',
    period: 'year_end',
    division: 'Technology Center',
    department: 'Backend',
    team: 'Core Services',
    approver: 'anh.pham'
  });
  assert.ok(filtered.length > 0);
  assert.equal(filtered.every(row => row.cycle === 2026 && row.period === 'year_end'), true);
  assert.equal(filtered.every(row => row.division === 'Technology Center' && row.department === 'Backend' && row.team === 'Core Services'), true);
  assert.equal(filtered.every(row => row.hodDomain === 'anh.pham'), true);
  const employeeRows = Model.filter(rows, { cycle:'2026', employee:'hoa.ngu' });
  assert.equal(employeeRows.length, 2);
  assert.equal(employeeRows.every(row => row.domain === 'hoa.nguyen'), true);
});

test('đối soát đánh dấu dòng sẽ ghi đè khi điểm hiện tại khác điểm trong tệp', () => {
  const preview = Model.buildPreview(Model.records(), 2026, 'year_end');
  const conflict = preview.find(row => row.id === 'yer26-e13');
  assert.equal(conflict.replaced, true);
  assert.equal(conflict.oldScore, 3);
  assert.equal(conflict.score, 3.5);
});

test('popup xác nhận chỉ nhấn mạnh ghi đè và các trường hợp nộp trễ', () => {
  ['Điểm upload', 'Giai đoạn'].forEach(text => {
    assert.ok(html.includes(text), `Thiếu nội dung xác nhận: ${text}`);
  });
  assert.ok(html.includes('class="confirm-info-list"'));
  assert.ok(html.includes('.confirm-info-list{margin:0;padding-left:0;list-style:none}'));
  assert.equal(html.includes('class="confirm-info-title"'), false);
  assert.equal(html.includes('>Thông tin cập nhật</div>'), false);
  assert.ok(html.includes('class="confirm-overwrite"'));
  assert.ok(html.includes('sẽ được <strong>ghi đè</strong> bằng <strong>điểm upload mới</strong>'));
  assert.ok(html.includes('class="person-line"'));
  assert.ok(html.includes('class="preview-person-head"'));
  assert.ok(html.includes(`<span class="er-login">('+esc(row.domain)+')</span>`));
  assert.ok(html.includes('<span class="emp-tag emp-tag-late">Nộp trễ hạn</span>'));
  assert.ok(html.includes('Lưu ý trường hợp nộp trễ'));
  assert.ok(html.includes('<strong>Tự đánh giá trễ hạn</strong>'));
  assert.ok(html.includes('<strong>lần nhắc thứ 3</strong>'));
  assert.ok(html.includes('<strong>điểm đánh giá toàn diện tối đa là 3</strong>'));
  assert.equal(html.includes('<th>Đối soát</th>'), false);
  assert.equal(html.includes('<th>Điểm trong tệp</th>'), false);
  assert.equal(html.includes('<th class="preview-score">Điểm HRBP đã upload</th>'), false);
  assert.equal(html.includes('<span class="preview-late">Đúng hạn</span>'), false);
  const previewWidths = [...html.matchAll(/<col style="width:(\d+)%">/g)].map(match => Number(match[1]));
  assert.deepEqual(previewWidths, [34, 16, 50]);
  assert.equal(previewWidths.reduce((sum, width) => sum + width, 0), 100);
  assert.ok(previewWidths[2] > previewWidths[0] && previewWidths[0] > previewWidths[1]);
});

test('màn hình có menu, cột và popup cốt lõi của luồng HRBP', () => {
  ['Quản lý hiệu quả công việc', 'Tải lên điểm HOD', 'Phạm vi', 'Khối', 'Phòng ban', 'Bộ lọc', 'Đội nhóm', 'Quản lý phê duyệt', 'Xác nhận cập nhật điểm HOD', 'Xác nhận giữ'].forEach(text => {
    assert.ok(html.includes(text), `Thiếu nội dung: ${text}`);
  });
  assert.equal(html.includes('>Tải danh sách<'), false);
  assert.equal(html.includes('·'), false);
});

test('bảng dùng đúng quy cách hiển thị của màn hình HOD', () => {
  assert.ok(html.includes('<td class="col-no">'));
  assert.ok(html.includes('class="person-identity"'));
  assert.ok(html.includes(`<span class="person-name">'+esc(item.name)+'</span><span class="er-login">('+esc(item.domain)+')</span>`));
  assert.ok(html.includes('function managerCell(person)'));
  assert.ok(html.includes(`<span class="myr-status '+cls+'">`));
  assert.equal(html.includes('<span class="badge '), false);
  assert.ok(html.includes('Điểm HRBP upload'));
  assert.ok(html.includes('Điểm HOD'));
  assert.ok(html.includes('<th class="col-action">Chức năng</th>'));
  assert.ok(html.includes('<th class="col-manager">Quản lý cấp 2</th>'));
  assert.ok(html.includes('function secondManager(item)'));
  assert.ok(html.includes('../assets/org-chain.js'));
  assert.ok(html.includes('PMSHodUpload.periodShortLabel(item.cycle,item.period)'));
  assert.ok(html.includes('.person-name{display:block}'));
  assert.ok(html.includes('.er-login{display:block'));
  assert.ok(html.lastIndexOf('.data-table td{vertical-align:top}') > html.lastIndexOf('vertical-align:middle'));
  assert.equal(html.includes('.data-table:not(.goals) .col-person{width:14%}'), false);
  assert.equal(html.includes('.data-table:not(.goals) .col-cycle{width:8%}'), false);
  assert.ok(html.includes('<colgroup id="tableColumns"></colgroup>'));
  assert.ok(html.includes('.data-table:not(.goals){min-width:0}'));
  assert.equal(html.includes('.data-table:not(.goals){min-width:1440px}'), false);
  assert.ok(html.includes('col.cg-person{width:11.5%}'));
  assert.ok(html.includes('col.cg-cycle{width:10%}'));
  assert.ok(html.includes('col.cg-hrbp-score{width:6.5%}'));
  assert.ok(html.includes('col.cg-hod-score{width:6%}'));
  assert.ok(html.includes('col.cg-status{width:10.5%}'));
  assert.ok(html.includes('col.cg-action{width:8%}'));
  const assessmentColumnWidths = [...html.matchAll(/col\.cg-[a-z0-9-]+\{width:(\d+(?:\.\d+)?)%\}/g)].map((match) => Number(match[1]));
  assert.equal(assessmentColumnWidths.length, 12);
  assert.equal(assessmentColumnWidths.reduce((sum, width) => sum + width, 0), 100);
  assert.ok(html.includes('.data-table:not(.goals) th.col-manager,.data-table:not(.goals) th.col-hod{white-space:normal;line-height:1.2}'));
  assert.ok(html.includes('.data-table th.col-score,.data-table td.col-score{text-align:center}'));
  assert.ok(html.includes('<col class="cg-no"><col class="cg-person"><col class="cg-cycle">'));
  assert.ok(html.includes('<td class="col-cycle"><span class="cycle-name">'));
  assert.ok(html.includes(`<td class="col-status">'+statusHtml(item)+'</td>`));
  assert.ok(html.includes('.col-action{position:static'));
  assert.ok(html.includes('.data-table th.col-action,.data-table td.col-action{text-align:center}'));
  assert.ok(html.includes('.data-table td.col-action .actions{align-items:flex-start;justify-content:center}'));
  assert.equal(html.includes('.col-action{position:sticky'), true);
  assert.ok(html.lastIndexOf('.col-action{position:static') > html.lastIndexOf('.col-action{position:sticky'));
  assert.ok(html.includes('class="emp-tag emp-tag-late"'));
  assert.ok(html.includes('>Nộp trễ hạn</span>'));
  assert.equal(html.includes('Nộp trễ - Lần "+late.round'), false);
});

test('popup upload theo đúng ba bước và chỉ nhận file Excel', () => {
  const step1 = html.indexOf('Bước 1');
  const step2 = html.indexOf('Bước 2');
  const step3 = html.indexOf('Bước 3');
  const fileControl = html.indexOf('id="scoreFile"');
  assert.ok(step1 >= 0 && step1 < step2 && step2 < step3 && step3 < fileControl);
  assert.ok(html.includes('Tải file mẫu có sẵn danh sách nhân viên'));
  assert.ok(html.includes('Điền điểm HOD vào cột điểm trong file mẫu'));
  assert.ok(html.includes('Tải lên file đã điền điểm'));
  assert.ok(html.includes('Giữ nguyên mã nhân viên và các cột khác để hệ thống đối soát chính xác.'));
  assert.ok(html.includes('class="dialog upload-dialog"'));
  assert.ok(html.includes('class="upload-flow"'));
  assert.ok(html.includes('class="btn btn-outline upload-step-action"'));
  assert.ok(html.includes('.upload-step-head{display:flex;align-items:center;gap:8px;min-height:34px'));
  assert.ok(html.includes('.upload-step-line{display:flex;align-items:center;justify-content:flex-start;gap:12px;min-height:34px'));
  assert.ok(html.includes('.upload-step-title{display:flex;align-items:center;min-height:34px'));
  assert.ok(html.includes('justify-content:flex-start;gap:12px'));
  assert.ok(html.includes('accept=".xlsx,.xls"'));
  assert.equal(html.includes('accept=".xlsx,.xls,.csv"'), false);
  assert.equal(html.includes('Chỉ nhận file Excel định dạng'), false);
  assert.equal(html.includes('upload-file-note'), false);
  assert.ok(html.includes('class="file-selected" id="fileSelected"'));
  assert.ok(html.includes('class="bx bx-check-circle"'));
  assert.ok(html.includes('onclick="clearSelectedFile()"'));
  assert.ok(html.includes('class="bx bx-trash"'));
  assert.ok(html.includes("document.getElementById('fileSelected').classList.add('show')"));
  assert.ok(html.includes('onclick="downloadTemplate()"'));
});

test('phạm vi chu kỳ và nội dung nằm ở panel riêng ngoài bảng', () => {
  const scopeBar = html.indexOf('class="scope-bar"');
  const panel = html.indexOf('<section class="panel">');
  const filterSheet = html.indexOf('id="filterSheet"');
  assert.ok(scopeBar >= 0 && scopeBar < panel && panel < filterSheet);
  assert.ok(html.includes('Phạm vi danh sách'));
  assert.ok(html.includes('id="scopeCycle"'));
  assert.ok(html.includes('id="scopePeriod"'));
  assert.ok(html.includes('<option value="goals">Thiết lập mục tiêu</option>'));
  assert.equal(html.includes('Tất cả kỳ đánh giá'), false);
  assert.equal(html.includes('id="filterCycle"'), false);
  assert.equal(html.includes('id="filterPeriod"'), false);
  assert.equal(html.includes('id="resultCount"'), false);
  assert.equal(html.includes('Hiển thị <strong'), false);
});

test('bộ lọc người cho phép gõ domain', () => {
  assert.ok(html.includes('id="filterApprover" type="search"'));
  assert.ok(html.includes('placeholder="Nhập domain quản lý"'));
  assert.ok(html.includes('id="filterEmployee" type="search"'));
  assert.ok(html.includes('placeholder="Nhập domain nhân viên"'));
  const rows = Model.records();
  assert.equal(Model.filter(rows, { approver:'ANH.PH' }).length, rows.length);
  assert.equal(Model.filter(rows, { employee:'hoa.ngu' }).length, 2);
});

test('điểm HRBP upload và điểm HOD là hai dữ liệu độc lập', () => {
  const rows = Model.records();
  const pending = rows.find(row => row.id === 'yer26-e12');
  const approved = rows.find(row => row.id === 'myr26-e1');
  assert.equal(pending.hrbpUploadScore, 4.5);
  assert.equal(pending.hodScore, null);
  assert.equal(approved.hrbpUploadScore, 4);
  assert.equal(approved.hodScore, 4);
});

test('popup chi tiết rút gọn còn nhân viên, điểm và lưu ý', () => {
  ['Điểm của nhân viên', 'Điểm của QLTT', 'Điểm của QL cấp 2', 'Điểm của HOD'].forEach(text => {
    assert.ok(html.includes(text), `Thiếu nội dung popup: ${text}`);
  });
  assert.equal(html.includes('<div class="detail-section-hd">Thông tin nhân viên</div>'), false);
  assert.equal(html.includes('<div class="detail-section-hd">Đánh giá toàn diện</div>'), false);
  assert.equal(html.includes('<div class="detail-section-hd">Thông tin kỳ đánh giá</div>'), false);
  assert.ok(html.includes('class="dialog detail-dialog"'));
  assert.ok(html.includes('.detail-domain{font-weight:400'));
  assert.ok(html.includes('class="detail-summary"'));
  assert.ok(html.includes('class="detail-employee-line"'));
  assert.ok(html.includes('<span>Nhân viên:</span><strong>'));
  assert.ok(html.includes("document.getElementById('detailTitle').textContent='Chi tiết đánh giá';"));
  assert.equal(html.includes("textContent='Chi tiết đánh giá - '+item.name"), false);
  assert.equal(html.includes("detailItem('Mã nhân viên',item.employeeId)"), false);
  assert.ok(html.includes('class="detail-score-grid"'));
  assert.ok(html.includes('.detail-score-grid{display:flex'));
  assert.ok(html.includes("if(score==null)return ''"));
  assert.ok(html.includes('class="detail-warning"'));
  assert.ok(html.includes('<strong>Tự đánh giá trễ hạn'));
  assert.ok(html.includes('<strong>nộp bổ sung ở lần nhắc thứ'));
  assert.ok(html.includes('tối đa là <strong>'));
  assert.ok(html.includes("review.lm2=yer.lm2&&yer.lm2.score!=null?reviewData(yer.lm2):(review.lm&&review.lm.score!=null?{score:review.lm.score,comment:'',comments:{},synced:true}:{})"));
  assert.ok(html.includes('class="detail-score-source">(HR system)</span>'));
  assert.equal(html.includes('<div class="detail-section-hd">Chi tiết nhận xét</div>'), false);
  assert.equal(html.includes('function reviewDetailHtml(item)'), false);
  assert.ok(html.includes("comments:source.comments||{}"));
  assert.ok(html.includes('../assets/employees-data.js'));
  assert.ok(html.includes('../assets/yer-data.js'));
});

test('HRBP có thể tải đánh giá chi tiết ở PDF hoặc Excel', () => {
  assert.ok(html.includes('Tải đánh giá chi tiết'));
  assert.ok(html.includes('class="detail-inline-action"'));
  assert.ok(html.includes('class="btn btn-default" type="button" aria-haspopup="menu"'));
  assert.equal(html.includes('<footer class="dlg-foot detail-foot">'), false);
  assert.ok(html.includes(`onclick="downloadDetail(\\'pdf\\')"`));
  assert.ok(html.includes(`onclick="downloadDetail(\\'excel\\')"`));
  assert.ok(html.includes('function printDetailPdf(item)'));
  assert.ok(html.includes('function downloadDetailExcel(item)'));
  assert.ok(html.includes('<th>Nguồn điểm</th>'));
});

test('áp dụng tên menu và cấu trúc quản lý hiệu quả công việc đã được xác nhận', () => {
  assert.ok(html.includes('<i class="bx bx-list-check"></i>Quản lý hiệu quả công việc</a>'));
  assert.ok(html.includes('<h1 class="page-title">Quản lý hiệu quả công việc</h1>'));
  assert.ok(html.includes('Không gian quản trị - Hiệu quả công việc'));
  assert.equal(html.includes('Đánh giá hiệu suất'), false);
});

test('thiết lập mục tiêu không có cột giai đoạn và chỉ hiển thị mục tiêu đã duyệt', () => {
  const goalHeader = '<tr><th class="col-no">STT</th><th class="col-person">Nhân viên</th><th class="col-org">Khối</th>';
  assert.ok(html.includes(goalHeader));
  assert.equal(goalHeader.includes('Giai đoạn'), false);
  assert.ok(html.includes('<th class="col-approved-goals">Mục tiêu đã duyệt</th>'));
  assert.ok(html.includes("goal.status==='approved'"));
  assert.ok(html.includes("goal.type==='dev'"));
  assert.ok(html.includes('công việc'));
  assert.ok(html.includes('phát triển'));
  assert.ok(html.includes('window.PMS_HRBP_GOAL_EMPLOYEES=JSON.parse(JSON.stringify(window.PMS_EMPLOYEES||[]))'));
  assert.ok(html.includes('(window.PMS_HRBP_GOAL_EMPLOYEES||[])'));
  assert.ok(html.includes("document.getElementById('uploadButton').hidden=goal"));
  assert.ok(html.includes("document.getElementById('filterStatusField').hidden=goal"));
  assert.ok(html.includes('.filter-count[hidden]{display:none}'));
});

test('giữa năm và cuối năm có tải điểm, mở đúng màn hình nhân viên và quản lý ở tab mới', () => {
  assert.ok(html.includes('<option value="mid_year">Đánh giá giữa năm</option>'));
  assert.ok(html.includes('<option value="year_end" selected>Đánh giá cuối năm</option>'));
  assert.ok(html.includes('target="_blank" rel="noopener"'));
  assert.ok(html.includes('../E-05/index.html?hrbpView=1'));
  assert.ok(html.includes('../M-05/index.html?hrbpView=1'));
  assert.ok(html.includes('Xem màn hình của nhân viên'));
  assert.ok(html.includes('Xem màn hình của quản lý'));
  assert.equal(html.includes('Xem giao diện nhân viên - mở tab mới'), false);
  assert.ok(html.includes('class="row-download"'));
  assert.ok(html.includes("downloadRowDetail(event,"));
  assert.ok(employeeScreenHtml.includes('../assets/hrbp-proxy.js'));
  assert.ok(managerScreenHtml.includes('../assets/hrbp-proxy.js'));
  assert.ok(proxyJs.includes("badge.textContent='HRBP - Chỉ xem'"));
  assert.ok(proxyJs.includes("window.switchMainTab"));
  assert.ok(proxyJs.includes("window.switchCycleTab"));
  assert.ok(proxyJs.includes('stopImmediatePropagation'));
  assert.ok(proxyJs.includes('new MutationObserver'));
  assert.ok(proxyJs.includes("button.closest('.role-switch')"));
  assert.equal(customEmployeeScreenExists, false);
  assert.ok(managerScreenHtml.includes('function proxyManagedEmps()'));
  assert.ok(managerScreenHtml.includes('if(HRBP_PROXY_MANAGER_ID) return proxyManagedEmps();'));
});
