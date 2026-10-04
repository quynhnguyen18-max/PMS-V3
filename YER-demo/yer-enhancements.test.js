const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadYer() {
  const window = {
    PMS_EMPLOYEES: [],
    PMS_MYR: {},
    PMS_SELFEVAL: {},
    PMS_LM1EVAL: {},
    PMSStore: {
      session: () => ({ emp: 'y9', date: '2027-01-20', role: 'nv' }),
      acts: () => ({})
    }
  };
  const context = vm.createContext({ window, console, Date, Object, Array, String, Number, Math, JSON });
  // Nap ca danh sach nhan su goc: yer-data.js chi them nguoi moi vao mang nay,
  // nen thieu no thi cac ho so e1..e16 khong ton tai va profile() tra ve null.
  vm.runInContext(fs.readFileSync(path.join(root, 'assets/employees-data.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'assets/yer-data.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'assets/yer-model.js'), 'utf8'), context);
  return window;
}

test('demo scenarios are grouped by role, not by process stage', () => {
  const w = loadYer();
  assert.deepEqual(Array.from(w.PMS_YER_GROUPS, g => g.role), ['nv', 'lm', 'lm2', 'hod']);

  const scenarioIds = Array.from(w.PMS_YER_SCENARIOS, s => s.id);
  assert.equal(new Set(scenarioIds).size, scenarioIds.length, 'ma tinh huong phai duy nhat');
  assert.equal(scenarioIds.filter(id => id.startsWith('nv')).length, 21);
  // Array.from de doi sang mang cua tien trinh test: mang tao trong vm co prototype khac.
  assert.deepEqual(Array.from(w.PMS_YER_SCENARIO_ORDER), scenarioIds);

  // Moi tinh huong phai nam dung nhom cua vai tro no dien ta, neu khong thi
  // bo loc theo vai o bang dieu huong se cho ra ket qua sai.
  const groupOf = new Map(Array.from(w.PMS_YER_GROUPS, g => [g.id, g]));
  for (const sc of w.PMS_YER_SCENARIOS) {
    const g = groupOf.get(sc.g);
    assert.ok(g, `${sc.id} tro toi nhom khong ton tai: ${sc.g}`);
    assert.equal(g.role, sc.role, `${sc.id} nam sai nhom vai tro`);
    assert.ok(w.PMS_YER_SCREENS[sc.screen], `${sc.id} tro toi man hinh khong ton tai`);
  }

  // Moi tinh huong phai co ho so that tai ngay he thong da chon, neu khong
  // nguoi review bam vao se roi vao man trong.
  for (const sc of w.PMS_YER_SCENARIOS) {
    assert.ok(w.PMSYer.profile(sc.emp, sc.date), `${sc.id} khong dung duoc ho so ${sc.emp}`);
  }
});

test('the 21 employee scenarios follow the requested order and states', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const nv = w.PMS_YER_SCENARIOS.filter(s => s.g === 'r-nv');
  assert.deepEqual(Array.from(nv, s => s.id), Array.from({ length: 21 }, (_, i) => 'nv' + String(i + 1).padStart(2, '0')));
  const prof = id => { const sc = nv.find(s => s.id === id); return Y.profile(sc.emp, sc.date); };

  assert.equal(Y.selfAssessmentState(prof('nv01')).mode, 'draft');
  assert.equal(Y.selfAssessmentState(prof('nv01')).canSubmit, true);
  // Thieu muc tieu: van nhap va luu nhap duoc, chi khong gui duoc
  for (const [id, what, dev] of [['nv02', true, false], ['nv03', false, true], ['nv04', true, true]]) {
    const p = prof(id);
    assert.equal(p.eligibility.missingWhat, what, id);
    assert.equal(p.eligibility.missingDev, dev, id);
    const st = Y.selfAssessmentState(p);
    assert.equal(st.mode, 'draft', id);
    assert.equal(st.canEdit, true, id);
    assert.equal(st.canSubmit, false, id);
  }
  assert.equal(Y.status(prof('nv05'), 'vi').key, 'maternity');
  assert.equal(Y.status(prof('nv06'), 'vi').key, 'late-upload');
  assert.equal(prof('nv06').lateRound.round, 2);
  assert.equal(Y.selfAssessmentState(prof('nv07')).mode, 'submitted');
  assert.equal(Y.selfAssessmentState(prof('nv08')).mode, 'locked');
  assert.equal(prof('nv07').emp.id, prof('nv08').emp.id, 'nv07 va nv08 la cung mot nguoi o hai thoi diem');
  assert.ok(prof('nv08').selfLog.length >= 3, 'lich su chinh sua co san de xem');
  assert.ok(prof('nv09').resignFrom && !prof('nv09').resigned, 'nv09 co ngay lam viec cuoi cung');
  assert.ok(Object.keys(prof('nv10').completedGoals).length > 0, 'nv10 co muc tieu da chot voi Quan ly cu');
  const upper = prof('nv11');
  assert.ok(upper.self && upper.lm && upper.lm2.comment && upper.hod.comment, 'nv11 co nhan xet cua LM2 va HOD');

  // Chua nop, dang bi nhac o lan 1 den 4: di tron luong tu canh bao toi luc da nop
  for (const [id, round] of [['nv12', 1], ['nv13', 2], ['nv14', 3], ['nv15', 4]]) {
    const p = prof(id);
    assert.equal(p.self, null, id + ' phai chua nop');
    assert.equal(p.lateSubmission, null, id);
    assert.equal(p.lateRound.round, round, id);
    assert.equal(Y.status(p, 'vi').key, 'late-upload', id);
  }
  // Da nop o lan 1 den 4: cung nhan vien voi bo tren, o ngay cuoi cua lan nhac
  for (const [id, round, pending] of [['nv16', 1, 'nv12'], ['nv17', 2, 'nv13'], ['nv18', 3, 'nv14'], ['nv19', 4, 'nv15']]) {
    const p = prof(id);
    assert.ok(p.lateSubmission, id + ' phai co ho so nop bo sung');
    assert.equal(p.lateRound.round, round, id);
    assert.equal(Y.status(p, 'vi').key, 'wait-lm', id);
    assert.equal(p.emp.id, prof(pending).emp.id, id + ' va ' + pending + ' la cung mot nguoi');
  }
  // Tinh huong nop bo sung (nv12 den nv19) va nv21 lam lai tu dau sau moi lan tai trang
  assert.deepEqual(Array.from(nv.filter(x => x.fresh), x => x.id), ['nv12', 'nv13', 'nv14', 'nv15', 'nv16', 'nv17', 'nv18', 'nv19', 'nv21']);
  const demoSrc = fs.readFileSync(path.join(root, 'assets/yer-demo.js'), 'utf8');
  assert.match(demoSrc, /if \(wantScreen && goScreen\(wantScreen\)\) return;\s*freshStart\(currentScenario\(\)\);/);
  const never = prof('nv20');
  assert.equal(never.self, null);
  assert.equal(never.lateWindowOpen, false);
  assert.equal(Y.status(never, 'vi').key, 'noeval');
  // Lan gui nao cung co gio, ke ca dong lich su model tu suy ra tu ban da gui (§8.2)
  for (const sc of nv) {
    for (const it of prof(sc.id).selfLog || []) assert.ok(it.time, sc.id + ' dong ' + it.type + ' thieu gio');
  }
  assert.ok(prof('nv11').selfLog.length === 1 && prof('nv11').selfLog[0].time, 'nv11 chi co mot lan gui nhung van co gio');
  // nv21: cung ho so nv06, thieu muc tieu va da qua han nop bo sung
  const missNever = prof('nv21');
  assert.equal(missNever.emp.id, prof('nv06').emp.id);
  assert.equal(missNever.eligibility.reason, 'missing-goal');
  assert.equal(missNever.self, null);
  assert.equal(missNever.lateWindowOpen, false);
  assert.equal(Y.status(missNever, 'vi').key, 'noeval');
  // Man Nhan vien: thieu muc tieu ma het han nop bo sung thi dung khoi vang lateClosed, khong dung khoi hong
  const empSrc = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(empSrc, /if\(p\.eligibility\.reason === 'missing-goal' && !lateOpen && !lateClosed\)\{/);
  assert.match(empSrc, /var hasWarnNote = \(p\.eligibility\.reason === 'missing-goal' && !lateClosed\)/);
  assert.match(empSrc, /L\('Vì còn thiếu <strong>' \+ esc\(missingGoalNames\(p\)\) \+ '<\/strong> được duyệt, các bước đánh giá tiếp theo của cấp quản lý sẽ không thể tiếp tục\. '/);
  assert.match(empSrc, /Quy trình Đánh giá cuối năm của bạn chính thức dừng tại đây và không có điểm trên hệ thống\. /);
  assert.match(empSrc, /Việc không tuân thủ tiến độ này sẽ được xem xét và áp dụng các hình thức kỷ luật phù hợp theo Nội quy lao động\./);

  // Khong con nhom Ho so khac tren man Nhan vien
  assert.equal(w.PMS_YER_PROFILE_NOTES, undefined);
  const demo = fs.readFileSync(path.join(root, 'assets/yer-demo.js'), 'utf8');
  assert.doesNotMatch(demo, /Other profiles|otherOptions/);
});

test('the late window ends inside the line manager timeline, so late files share the common LM deadline', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  // ENH-E02: thời gian nộp trễ nằm trong timeline của QLTT (chốt lại 02/10/2026, bỏ hạn chấm riêng)
  assert.equal(Y.step('lm').to, '2027-02-08');
  assert.equal(Y.lateSubmissionDeadline(), '2027-02-03');
  assert.equal(Y.lateWindowFitsLm(), true);
  assert.equal(Y.lmDeadline(), '2027-02-08');
  // y12 nộp ngày 28/01 (lần 3): QLTT chấm tới hạn chung, hết hạn thì hệ thống đồng bộ
  const open = Y.profile('y12', '2027-02-08');
  assert.equal(open.lmDeadline, '2027-02-08');
  assert.equal(open.lm, null);
  assert.equal(Y.managerReviewState('lm', open).canEdit, true);
  assert.deepEqual({ ...Y.managerEditWindow('lm', open) }, { from: '2027-01-19', to: '2027-02-08', state: 'open' });
  const after = Y.profile('y12', '2027-02-09');
  assert.equal(after.lm.synced, true);
  assert.equal(Y.managerReviewState('lm', after).canEdit, false);
  const model = fs.readFileSync(path.join(root, 'assets/yer-model.js'), 'utf8');
  assert.doesNotMatch(model, /reason = 'late'|addWorkingDays\(late\.at, 3\)/);
});

test('employee tab only reports results after publication and has no response flow', () => {
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  const managerDetail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const model = fs.readFileSync(path.join(root, 'assets/yer-model.js'), 'utf8');

  // Nhan tab Danh gia cuoi nam theo giai doan cua ky, khong theo trang thai tung nguoi (§18.4)
  assert.match(model, /'active':\s+\['Cần hoàn tất', 'To complete'\]/);
  assert.match(model, /'done':\s+\['Đã hoàn tất', 'Completed'\]/);
  assert.doesNotMatch(employee, /var TAB_LABEL = /);
  assert.doesNotMatch(employee, /Cần xem kết quả|responseCard|submitResponse|yer-btn-resp|Phản hồi của Nhân viên/);
  assert.doesNotMatch(manager, /onlyResponse|yer-mgr-resp|yer-resp-dot|Nhân viên đã gửi phản hồi/);
  assert.doesNotMatch(managerDetail, /responseBlock|sendReply|yer-md-reply|Phản hồi của Nhân viên/);
  assert.doesNotMatch(model, /responseOpen|replyOpen|threadLocked/);
});

test('published employee result keeps prior-cycle status muted and hides manager overall score', () => {
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');

  assert.match(employee, /myrLbl\.classList\.toggle\('yer-past-cycle-label', myrTab\.past\)/);
  assert.match(employee, /\.tabs \.tab-active-label\.yer-past-cycle-label\{color:var\(--z600\);background:var\(--z100\);border-color:var\(--z300\)\}/);
  assert.doesNotMatch(employee, /class="sb-score-tag yer-final-tag"/);
  // O cua QLTT khong co dong diem, ke ca dong Chua cong bo (bo 28/09/2026); chi giu khoang trong cho thang hang
  assert.doesNotMatch(employee, /Chưa công bố/);
  assert.match(employee, /\? '<div class="yer-manager-score-gap" aria-hidden="true"><\/div>' \+/);
  // Tieu de o co domain cua cap quan ly, lay tu Y.actors
  assert.match(employee, /actorDomain\(Y\.actors\(p\)\.lm\)/);
  assert.match(employee, /by:who\.lm2/);
  assert.match(employee, /by:who\.hod/);
  assert.match(employee, /class="yer-manager-score-gap" aria-hidden="true"/);
  assert.match(employee, /\.yer-manager-score-gap\{height:20px;margin-bottom:12px\}/);
});

test('manager year-end list follows the mid-year shell and uses employee timeline rules', () => {
  const page = fs.readFileSync(path.join(root, 'M-05/index.html'), 'utf8');
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');

  // MYR-SPEC §2a: mặc định là màn MYR bình thường; nhãn tab theo luật chung Y.cycleTabLabel (§18.4)
  assert.match(page, /id="cy-1-lbl">Đang hoạt động<\/span>/);
  assert.doesNotMatch(manager, /managerTabState|managerTabLabel/);
  assert.match(manager, /var MGR_STEPS = \['self', 'lm', 'lm2', 'hod', 'publish'\]/);
  assert.match(manager, /\.filter\(function \(st\) \{ return MGR_STEPS\.indexOf\(st\.key\) >= 0; \}\)/);
  assert.match(manager, /domain: ''/);
  assert.match(manager, /class="yer-mgr-stepper"><div id="yer-mgr-steps"><\/div><\/div>/);
  assert.doesNotMatch(manager, /showResigned|yer-mgr-res|Hiển thị nhân viên đã nghỉ việc|Show resigned employees/);
  assert.doesNotMatch(manager, /yer-mgr-progress|function progressHtml/);
  assert.doesNotMatch(manager, /yer-role-guide|yer-mgr-guide|Xem hướng dẫn|View guide|<div class="myr-info"/);
  assert.match(manager, /role-sw-row/);
  assert.match(manager, /<span>Direct reports<\/span>/);
  assert.match(manager, /<span>Indirect reports<\/span>/);
  assert.match(manager, /class="role-sub-btn/);
  assert.match(manager, /role-sw-row yer-mgr-controls/);
  // Bộ lọc và Split View giống tab Giữa năm, không còn ô tìm kiếm riêng (chốt 30/09/2026)
  assert.doesNotMatch(manager, /yer-mgr-search|yer-mgr-q/);
  assert.match(manager, /<div class="list-toolbar">/);
  assert.match(manager, /class="filter-menu" id="yer-mgr-filter"/);
  assert.match(manager, /L\('Bộ lọc', 'Filters'\)/);
  assert.match(manager, /class="btn btn-outline btn-sm split-view-btn" id="yer-mgr-split"/);
  assert.match(manager, /class="myr-sp-frame" id="yer-mgr-sp-frame"/);
  assert.match(manager, /'&tab=yer' \+ \(embedded \? '&embed=1' : ''\)/);
  assert.match(manager, /\.yer-mgr-controls \.role-sub-group\{margin-left:0\}/);
  assert.doesNotMatch(manager, /list-toolbar yer-mgr-toolbar/);
  assert.match(manager, /myr-table-wrap yer-mgr-table-wrap/);
  assert.match(manager, /id="yer-mgr-colgroup"/);
  assert.match(manager, /var actors = Y\.actors\(p\)/);
  assert.match(manager, /cells\.push\(mgrCell\(actors\.lm\)\)/);
  assert.match(manager, /class="myr-manager"/);
  assert.match(manager, /<span class="er-login">\(/);
  assert.match(manager, /\.yer-mgr-table th:first-child,\.yer-mgr-table td:first-child\{padding-left:12px\}/);
  assert.doesNotMatch(manager, /yer-status-resizer|yer-col-resizer|function bindStatusResizer\(\)|statusWidth/);
  assert.match(manager, /return col\('27%'\) \+ col\('17%'\)/);
  assert.match(manager, /return col\('3%'\) \+ col\('19%'\) \+ col\('14%'\)/);
  assert.match(manager, /return col\('3%'\) \+ col\('15%'\) \+ col\('11%'\) \+ col\('11%'\)/);
  assert.match(manager, /L\('Chức năng', 'Action'\)/);
  assert.match(manager, /class="myr-action-cell"/);
});

test('manager columns resolve the shared reporting chain when an employee seed omits mgr', () => {
  const w = loadYer();
  for (const empId of ['e2', 'e13']) {
    const profile = w.PMSYer.profile(empId, '2027-02-10');
    assert.equal(profile.emp.mgr, undefined);
    const manager = w.PMSYer.actors(profile).lm;
    assert.equal(manager.name, 'Lê Thị Thanh');
    assert.equal(manager.login, 'thanh.le');
    assert.equal(manager.ini, 'LT');
  }
});

test('each manager role receives only the full roster inside its reporting scope', () => {
  const w = loadYer();
  const scope = { lm: 'lm1', lm2: 'lm2', hod: 'hod' };
  for (const [role, level] of Object.entries(scope)) {
    const roster = w.PMSYer.roster(role, { now: '2027-01-12' });
    assert.ok(roster.length > 0, `${role} scope must not be empty`);
    assert.ok(roster.every(profile => profile.emp.lvl === level));
  }
  assert.equal(w.PMSYer.roster('lm2', { now: '2027-01-12' }).some(profile => profile.emp.id === 'e1'), false);
  assert.equal(w.PMSYer.roster('hod', { now: '2027-01-12' }).some(profile => profile.emp.id === 'e5'), false);
});

test('LM2 and HOD only edit their own overall rating inside the filtered roster', () => {
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  assert.match(detail, /LM2\/HOD không chấm điểm từng mục tiêu, chỉ đọc điểm của NV và của QLTT/);
  assert.match(detail, /readonly: r\.done \? true : !\(canEdit && isLm\(\)\)/);
  assert.match(detail, /role\(\) === 'lm2' \? L\('Quản lý cấp 2 đánh giá'/);
  assert.match(detail, /L\('Trưởng đơn vị đánh giá', 'Head of department review'\)/);
  assert.match(detail, /key: 'my:overall'/);
});

test('the Goals tab label names the missing goal type while the self assessment is open', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const missingWork = Y.profile('y13', '2027-01-12');
  const missingDevelopment = Y.profile('y1', '2027-01-12');
  const missingAll = Y.profile('y11', '2027-01-12');
  assert.deepEqual({ ...Y.goalAction(missingWork) }, { what: true, dev: false });
  assert.deepEqual({ ...Y.goalAction(missingDevelopment) }, { what: false, dev: true });
  assert.deepEqual({ ...Y.goalAction(missingAll) }, { what: true, dev: true });
  // Du muc tieu, hoac het han tu danh gia (bo sung bang file nop tre) thi khong co nhan
  assert.equal(Y.goalAction(Y.profile('e2', '2027-01-12')), null);
  assert.equal(Y.goalAction(Y.profile('y1', '2027-01-22')), null);

  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const page = fs.readFileSync(path.join(root, 'E-05/index.html'), 'utf8');
  assert.match(employee, /L\('Cần thiết lập mục tiêu công việc','Work goal needed'\)/);
  assert.match(employee, /L\('Cần thiết lập mục tiêu phát triển','Development goal needed'\)/);
  assert.match(employee, /L\('Cần thiết lập mục tiêu','Goals needed'\)/);
  assert.match(page, /id="tablbl-goals" hidden/);
  assert.match(page, /\.tabs \.tab-active-label\.tab-action-label\{left:5px;right:auto;z-index:2\}/);
  assert.match(page, /onclick="switchMainTab\(0\)">Danh sách mục tiêu<span/);
  assert.match(employee, /<strong class="yer-missing-goal">/);
  assert.match(employee, /\.yer-note\.action \.yer-missing-goal\{color:var\(--brand\);font-weight:700\}/);
});

test('review tab labels follow the cycle phase, not the person', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  assert.equal(Y.yerPhase('2027-01-04'), 'not-open');
  assert.equal(Y.yerPhase('2027-01-05'), 'active');
  assert.equal(Y.yerPhase('2027-04-05'), 'active');
  assert.equal(Y.yerPhase('2027-04-06'), 'done');

  // Mot luat nhan tab cho E-05, M-05, M-06 (chot 30/09/2026): nhan theo giai doan, khong theo vai, khong theo nguoi
  assert.deepEqual({ ...Y.cycleTabLabel('yer', '2027-01-04', 'vi') }, { text: 'Chưa mở', past: true });
  assert.deepEqual({ ...Y.cycleTabLabel('yer', '2027-01-20', 'vi') }, { text: 'Cần hoàn tất', past: false });
  assert.deepEqual({ ...Y.cycleTabLabel('yer', '2027-04-06', 'vi') }, { text: 'Đã hoàn tất', past: true });
  // Chốt 04/10/2026: nhãn tab Giữa năm chỉ theo ngày; kỳ cuối năm đã mở thì luôn Đã hoàn tất màu xám, có hay không có use case
  assert.deepEqual({ ...Y.cycleTabLabel('myr', '2027-01-20', 'vi') }, { text: 'Đã hoàn tất', past: true });
  assert.deepEqual({ ...Y.cycleTabLabel('myr', '2026-12-20', 'vi') }, { text: 'Đang hoạt động', past: false });
  w.PMSStore.session = () => ({ emp: 'y9', date: '2027-01-20', role: 'lm', scenario: w.PMS_YER_SCENARIOS[0].id });
  // Tab Giua nam o ky cuoi nam luon la Da hoan tat, mau xam, ke ca nguoi khong co ket qua
  assert.deepEqual({ ...Y.cycleTabLabel('myr', '2027-01-20', 'vi') }, { text: 'Đã hoàn tất', past: true });
  assert.equal(Y.managerTabLabel, undefined, 'khong con nhan tab theo vai');

  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const list = fs.readFileSync(path.join(root, 'M-05/index.html'), 'utf8');
  const page = fs.readFileSync(path.join(root, 'M-06/index.html'), 'utf8');
  assert.match(employee, /Y\.cycleTabLabel\('yer', s\.date, lg\(\)\)/);
  assert.match(employee, /Y\.cycleTabLabel\('myr', s\.date, lg\(\), p\.emp\.id\)/);
  assert.doesNotMatch(employee, /L\('Không có kết quả','No result'\)/);
  assert.match(manager, /Y\.cycleTabLabel\(pair\[1\], now, lg\(\)\)/);
  assert.match(detail, /Y\.cycleTabLabel\(pair\[1\], p\.now, lg\(\), p\.emp\.id\)/);
  assert.match(list, /window\.PMSYer\.cycleTabLabel\('myr',st\.date,st\.lang\)/);
  assert.doesNotMatch(list, /'Đã hoàn thành':'Đang hoạt động'/);
  // Nhan xam dung chung mot bo mau o ca ba man
  assert.match(list, /\.cy-active-label\.yer-past-cycle-label\{color:var\(--z600\);background:var\(--z100\);border-color:var\(--z300\)\}/);
  assert.match(page, /\.tabs \.tab-active-label\.yer-past-cycle-label\{color:var\(--z600\);background:var\(--z100\);border-color:var\(--z300\)\}/);
});

test('an employee outside the cycle has no year-end review to open', () => {
  const w = loadYer();
  // Tab Danh gia cuoi nam khoa lai khi model noi ho so nam ngoai ky. Man hinh
  // suy tu status() chu khong tu kiem tra lai ngay onboard.
  const p = w.PMSYer.profile('y7', '2027-01-12');
  assert.equal(p.eligibility.reason, 'late-onboard');
  assert.equal(w.PMSYer.status(p, 'vi').key, 'out');

  const src = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(src, /inCycle = Y\.status\(p, 'vi'\)\.key !== 'out'/);
  assert.match(src, /tabYer\.classList\.toggle\('disabled', locked\)/);
});

test('a goal assessed as complete is locked for both the employee and the manager', () => {
  const w = loadYer();
  const p = w.PMSYer.profile('y3', '2027-01-12');

  // Cham o tab Muc tieu theo hai buoc: nhan vien truoc, quan ly sau.
  const done = p.completedGoals.yg5;
  assert.ok(done, 'yg5 phai nam trong completedGoals');
  assert.equal(typeof done.self.score, 'number');
  assert.equal(typeof done.mgr.score, 'number');
  assert.ok(done.mgr.by.login, 'phai biet ai la nguoi chot hoan thanh');
  // yg6 co y de trong: mot ho so co ca muc tieu da khoa va muc tieu con phai cham.
  assert.equal(p.completedGoals.yg6, undefined);

  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  // Ky danh gia chi hien thi lai diem da chot, khong cho chon lai o ca hai cot.
  assert.match(emp, /if\(done\) selfScore = done\.self\.score;/);
  assert.match(emp, /data-ro="' \+ \(\(editable && !done\)\?'0':'1'\)/);
  // Khong co o de nhap thi khong duoc doi khi kiem tra truoc luc gui.
  assert.match(emp, /if\(\(p\.completedGoals\|\|\{\}\)\[g\.id\]\) return;/);

  const mgr = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  assert.match(mgr, /selfVal = r\.done \? r\.done\.self\.score/);
  assert.match(mgr, /readonly: r\.done \? true :/);
});

test('year-end goal rows reuse the mid-year hover and detail popup', () => {
  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const e05 = fs.readFileSync(path.join(root, 'E-05/index.html'), 'utf8');

  // Dong muc tieu phai mang data-name / data-result thi tooltip va popup moi doc duoc.
  assert.match(emp, /data-name="' \+ esc\(g\.title\) \+ '" data-result="' \+ esc\(g\.result\)/);
  // Bang dung lai moi lan render nen phai gan lai su kien, khong gan mot lan luc tai trang.
  assert.match(emp, /window\.bindReviewGoalRows\(el\('yer-root'\)\)/);
  assert.match(e05, /window\.bindReviewGoalRows = bindReviewGoalRows;/);
  assert.match(e05, /if \(tr\.dataset\.tipBound\) return;/);
  // Tooltip chi bat o hai cot dau, khong treo vao ca dong.
  assert.match(e05, /Array\.prototype\.slice\.call\(tr\.cells, 0, 2\)/);

  // Muc tieu da chot mang theo ca hai luot cham de popup dung lai khoi .ev-card.
  assert.match(emp, /data-done-self-score=/);
  assert.match(emp, /data-done-mgr-score=/);
  assert.match(emp, /data-done-self-by=/);
  assert.match(emp, /data-done-mgr-by=/);

  // Phai mo DUNG hop thoai #dlg-detail cua man Muc tieu, khong dung popup rut gon rieng.
  assert.match(e05, /function openDetailFromRow\(tr\)/);
  assert.match(e05, /openDetailFromRow\(tr\);/);
  assert.match(e05, /renderEvalTab\(proxy\)/);
  /* Mo tu bang danh gia thi hop thoai chi de xem lai: co .from-review boc moi
     thay doi, de man Muc tieu — noi con thao tac — giu nguyen. */
  assert.match(e05, /classList\.add\('from-review'\)/);
  assert.match(e05, /classList\.remove\('from-review'\)/);
  /* Muc tieu hanh vi co hop thoai rieng cua no (#dlg-how) — dung lai luon,
     khong cat got #dlg-detail thanh mot kieu khac. */
  assert.match(emp, /data-kind="how"/);
  assert.match(e05, /if \(d\.kind === 'how'\) \{ showHow\(d\.name, d\.result, true\); return; \}/);
  assert.match(e05, /function showHow\(name, desc, fromReview\)/);
  assert.ok(!e05.includes('no-tabs'), 'khong duoc dung lai hack no-tabs');
  // Gia tri cot loi chi de doc: khong chan hop thoai, khong tieu de o phan dau.
  const howBlock = e05.slice(e05.indexOf('id="dlg-how"'), e05.indexOf('id="dlg-import"'));
  assert.ok(howBlock.length > 0);
  assert.ok(!howBlock.includes('dlg-foot'), 'popup gia tri cot loi khong duoc co chan hop thoai');
  assert.ok(!howBlock.includes('dlg-title'), 'ten muc tieu nam trong o, khong lam tieu de');
  assert.ok(howBlock.includes('MoMoers'), 'phai giu dong ghi chu ve Gia tri cot loi');
  assert.match(howBlock, /class="dialog md"/);
  assert.match(howBlock, />Mục tiêu hành vi<\/span>/);
  assert.match(e05, /showHow\(el\.querySelector\('\.how-name'\)\.textContent\.trim\(\), el\.dataset\.desc, false\)/);
  assert.match(e05, /dlg\.classList\.toggle\('from-review', !!fromReview\)/);
  assert.match(e05, /#dlg-how\.from-review \.info-note\{display:none\}/);
  assert.match(e05, /\.g-row-done \.ql-cell>\.ql-by\{position:absolute;top:calc\(50% \+ 10px\)/);
  assert.match(e05, /#dlg-detail\.from-review \.ev-steps\{display:none\}/);
  assert.match(e05, /#dlg-detail\.from-review \.ev-cmt-lbl\{display:none\}/);
  assert.match(e05, /#dlg-detail\.from-review \.dlg-foot\{display:none\}/);
  assert.match(e05, /#dlg-detail\.from-review \.ev-card-hd\{color:var\(--brand\)\}/);
  // Domain in dam trong dong "Danh gia boi ... - thoi gian".
  assert.match(e05, /\u0110\u00e1nh gi\u00e1 b\u1edfi <strong>/);
  for (const dead of ['openGoalDetail', 'goal-detail-overlay', 'renderDoneDetail', 'gd-done-inner']) {
    assert.ok(!e05.includes(dead), 'con sot popup cu: ' + dead);
  }

  // Muc tieu hanh vi cung la mot nhom muc tieu nen cung phai co tooltip va popup.
  assert.match(emp, /data-name="' \+ esc\(cvName\) \+ '" data-result="' \+ esc\(cv\.lines\.join/);
  assert.match(e05, /white-space:pre-line/);
});

test('the year-end tab never mentions a missing mid-year result', () => {
  const w = loadYer();
  // Nguoi ngoai ky giua nam van bi khoa tab Giua nam, nhan tab thi van la Da hoan tat
  const outOfCycle = w.PMSYer.profile('y15', '2027-01-12');
  assert.equal(outOfCycle.myrEligible, false);
  assert.equal(outOfCycle.eligibility.reason !== 'late-onboard', true);

  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(emp, /tabMyr\.classList\.toggle\('disabled', !p\.myrEligible\)/);
  // Chi con cau co ket qua; khong co ket qua vi bat cu ly do gi thi khong noi gi (§40.5c)
  assert.doesNotMatch(emp, /vì chưa hoàn thành quy trình/);
  assert.doesNotMatch(emp, /\} else if\(p\.myrEligible\)\{/);
  assert.match(emp, /if\(p\.myr && p\.myr\.submitted\)\{/);
  assert.match(emp, /if\(!items\.length\) return '';/);
  assert.match(emp, /if\(!list\) return '';/);
});

test('missing goals still allow drafting but block submit with a reminder', () => {
  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(emp, /var editable = st\.canEdit;/);
  assert.match(emp, /if\(st\.submitBlock\)\{ saveDraft\(true\); missingGoalDialog\(p, true\); \}/);
  assert.match(emp, /if\(!st\.canSubmit\)\{ missingGoalDialog\(p, false\); return; \}/);
  assert.match(emp, /L\('Lưu nháp thành công','Draft saved'\)/);
  assert.match(emp, /Bạn chưa đủ điều kiện gửi Tự đánh giá cuối năm do thiếu /);
  assert.match(emp, /Trong lúc này, bạn vẫn có thể nhập thông tin và lưu nháp bản tự đánh giá\./);
  assert.match(emp, /yer-btn-locked/);
  // Nhom chua co muc tieu thi o nhan xet van chi xem (§40.5d)
  assert.match(emp, /commentPair\(p, type, editable && list\.length > 0\)/);
});

test('a submitted self assessment can be reopened, resubmitted and logged until the deadline', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const acts = {};
  w.PMSStore = { session: () => ({ emp: 'e10', date: '2027-01-14', role: 'nv' }), acts: id => acts[id] || {} };

  const submitted = Y.profile('e10', '2027-01-14');
  assert.equal(Y.selfAssessmentState(submitted).mode, 'submitted');
  assert.equal(Y.selfAssessmentState(submitted).deadline, '2027-01-18');

  acts.e10 = { selfEditing: { at: '2027-01-14' }, selfLog: { items: [{ type: 'reopen', at: '2027-01-14' }] } };
  const editing = Y.profile('e10', '2027-01-14');
  const st = Y.selfAssessmentState(editing);
  assert.equal(st.mode, 'editing');
  assert.equal(st.canEdit, true);
  assert.equal(st.canSubmit, true);
  // Ban da gui van giu nguyen trong luc sua, nen Quan ly van thay ban do
  assert.ok(editing.self && editing.self.overall.score === 4.5);
  assert.equal(Y.status(editing, 'vi').key, 'wait-lm');

  // Het han khi dang sua: ban da gui la ban chinh thuc, lich su ghi lai
  const expired = Y.profile('e10', '2027-01-19');
  assert.equal(expired.selfEditing, null);
  assert.equal(Y.selfAssessmentState(expired).mode, 'locked');
  assert.equal(expired.selfLog[expired.selfLog.length - 1].type, 'expired');

  // File nop tre chi gui mot lan (§27.1)
  assert.equal(Y.selfAssessmentState(Y.profile('y12', '2027-01-22')).canReopen, false);

  const diff = Y.selfChanges(
    { overall: { score: 4, comment: 'a' }, goalScores: { g1: 3, g2: 4 }, howScores: [3, 3], comments: { what: 'x' } },
    { overall: { score: 4.5, comment: 'a' }, goalScores: { g1: 3, g2: 5 }, howScores: [3, 4], comments: { what: 'y' } });
  assert.deepEqual(Array.from(diff.overall), [4, 4.5]);
  assert.equal(diff.goalScores, 1);
  assert.equal(diff.goalScoresByType.what, 0, 'khong truyen loai muc tieu thi khong dem theo nhom');
  // Truyen loai muc tieu thi lich su ghi ro sua muc tieu cong viec hay phat trien
  const typed = Y.selfChanges({ goalScores: { g1: 3, g2: 4 } }, { goalScores: { g1: 4, g2: 5 } }, { g1: 'what', g2: 'dev' });
  assert.equal(typed.goalScoresByType.what, 1);
  assert.equal(typed.goalScoresByType.dev, 1);
  assert.equal(diff.howScores, 1);
  assert.deepEqual(Array.from(diff.comments), ['what']);
  assert.equal(diff.overallComment, false);

  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(emp, /id="yer-btn-edit"/);
  assert.match(emp, /id="yer-btn-history"/);
  assert.match(emp, /id="yer-btn-cancel-edit"/);
  assert.match(emp, /appendLog\(\{ type:'resubmit', changes: Y\.selfChanges\(p\.self, next, goalTypes\) \}\)/);
  assert.match(emp, /L\('Gửi lại tự đánh giá','Resubmit self assessment'\)/);
  assert.doesNotMatch(emp, /Sau khi gửi, bạn không thể thu hồi hoặc chỉnh sửa/);
});

test('save and submit float at the bottom centre and rating selects explain themselves', () => {
  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(emp, /function bindFloatingToolbar\(\)/);
  assert.match(emp, /actions\.classList\.toggle\('floating', float\)/);
  assert.match(emp, /\.yer-toolbar \.yer-actions\.floating\{position:fixed;[^}]*left:calc\(var\(--sw\) \+ \(100vw - var\(--sw\)\) \/ 2\)/);
  const ui = fs.readFileSync(path.join(root, 'assets/yer-ui.js'), 'utf8');
  assert.match(ui, /\(lang\(\) === 'en' \? 'Select 1-5' : 'Chọn điểm 1-5'\)/);
  assert.doesNotMatch(ui, /'<option value="">—<\/option>'/);
});

test('the employee demo bar lists only employee scenarios', () => {
  const demo = fs.readFileSync(path.join(root, 'assets/yer-demo.js'), 'utf8');
  assert.match(demo, /groups\.filter\(function\(g\)\{ return g\.role === 'nv'; \}\)/);
  assert.match(demo, /L?\(?lg === 'en' \? 'Scenario' : 'Tình huống'\)/);
});

test('a goal group with no goals still keeps its section', () => {
  const w = loadYer();
  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');

  // Thieu mot loai muc tieu: y13 khong co WHAT, y1 khong co DEV, y11 khong co gi ca.
  const missWhat = w.PMSYer.profile('y13', '2027-01-12');
  const missDev = w.PMSYer.profile('y1', '2027-01-12');
  const missAll = w.PMSYer.profile('y11', '2027-01-12');
  assert.equal(missWhat.eligibility.missingWhat, true);
  assert.equal(missDev.eligibility.missingDev, true);
  assert.equal(missAll.eligibility.missingWhat, true);
  assert.equal(missAll.eligibility.missingDev, true);

  /* Khong duoc bo han khoi khi trong: giau di thi nhan vien khong biet minh thieu
     loai nao, va hai ho so cung trang thai lai co so khoi khac nhau. */
  assert.ok(!/var list = approvedGoals\(p, type\);\s*\r?\n\s*if\(!list\.length\) return '';/.test(emp),
    'goalSection khong duoc return rong khi chua co muc tieu');
  assert.match(emp, /if\(!list\.length\)\{/);
  assert.match(emp, /class="g-none-row"/);
  assert.match(emp, /'\.g-none\{text-align:center/);
});

test('the previous-manager wrap-up feature is gone for good', () => {
  // Quan ly cu khong de lai ban ban giao nao. Thu ho de lai la diem da chot.
  for (const f of ['assets/yer-model.js', 'assets/yer-employee.js',
                   'assets/yer-manager-detail.js', 'assets/yer-data.js']) {
    const src = fs.readFileSync(path.join(root, f), 'utf8');
    assert.ok(!/wrapup/i.test(src), f + ' van con dau vet cua wrapup');
  }
});

test('overdue self assessment keeps the late file route open for all three goal states', () => {
  const w = loadYer();
  const enough = w.PMSYer.profile('e7', '2027-01-20');
  const missingOne = w.PMSYer.profile('y10', '2027-01-20');
  const missingAll = w.PMSYer.profile('y11', '2027-01-20');

  assert.equal(w.PMSYer.lateSubmissionDeadline(), '2027-02-03');

  assert.equal(enough.eligibility.eligible, true);
  assert.equal(enough.self, null);
  assert.equal(enough.lateWindowOpen, true);
  assert.equal(w.PMSYer.status(enough, 'vi').key, 'late-upload');

  assert.equal(missingOne.eligibility.reason, 'missing-goal');
  assert.equal(missingOne.eligibility.missingWhat, false);
  assert.equal(missingOne.eligibility.missingDev, true);
  assert.equal(missingOne.stopped, false);
  assert.equal(w.PMSYer.status(missingOne, 'vi').key, 'late-upload');

  assert.equal(missingAll.eligibility.reason, 'missing-goal');
  assert.equal(missingAll.eligibility.missingWhat, true);
  assert.equal(missingAll.eligibility.missingDev, true);
  assert.equal(missingAll.stopped, false);
  assert.equal(w.PMSYer.status(missingAll, 'vi').key, 'late-upload');

  const deadlineDay = w.PMSYer.profile('y11', '2027-02-03');
  assert.equal(deadlineDay.lateWindowOpen, true);
  assert.equal(deadlineDay.lateSubmissionDeadline, '2027-02-03');

  const afterLateWindow = w.PMSYer.profile('y11', '2027-02-04');
  assert.equal(afterLateWindow.lateWindowOpen, false);
  assert.equal(afterLateWindow.stopped, true);
  assert.equal(w.PMSYer.status(afterLateWindow, 'vi').key, 'noeval');
});

test('y3 mid-year tab shows the completed result and the historical line manager', () => {
  const w = loadYer();
  const p = w.PMSYer.profile('y3', '2027-01-12');
  assert.equal(p.myr.submitted, true);
  assert.equal(p.myr.nv, 4);
  assert.equal(p.myr.final, 4);
  assert.equal(p.myr.lm1By.name, 'Nguyễn Hải Đăng');
  assert.equal(p.myr.lm1By.login, 'dang.nguyen');

  const managerDetail = fs.readFileSync(path.join(root, 'M-06/index.html'), 'utf8');
  const dataScript = managerDetail.indexOf('<script src="../assets/yer-data.js"></script>');
  const setupCall = managerDetail.indexOf('  setupManagerDetail();');
  assert.ok(dataScript > 0 && dataScript < setupCall, 'du lieu YER phai duoc nap truoc khi khoi tao tab MYR');
  assert.equal(managerDetail.match(/<script src="\.\.\/assets\/yer-data\.js"><\/script>/g).length, 1);
  assert.match(managerDetail, /Đã hoàn thành Đánh giá giữa năm 2026/);
  assert.match(managerDetail, /Quản lý trực tiếp tại kỳ giữa năm:/);
  assert.match(managerDetail, /review\.lm1By\|\|null/);
  assert.match(managerDetail, /id="sb-self-score-label"/);
  assert.match(managerDetail, /Điểm tự đánh giá:/);
  assert.match(managerDetail, /id="sb-final-score-label"/);
  assert.match(managerDetail, /Điểm cuối cùng:/);
  assert.match(managerDetail, /finalScore\.textContent=String\(review\.final\)/);

  const employeeScreen = fs.readFileSync(path.join(root, 'E-05/index.html'), 'utf8');
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(employeeScreen, /id="myr-result-title"/);
  assert.match(employeeScreen, /id="myr-result-sub"/);
  assert.match(employeeScreen, /id="myr-final-score-group" hidden/);
  assert.match(employeeScreen, /id="myr-final-score"/);
  assert.match(employee, /function syncMyrResult\(p, completed\)/);
  assert.match(employee, /var myrDone = !!\(p\.myr && p\.myr\.final !== null && p\.myr\.final !== undefined\)/);
  assert.match(employee, /syncMyrResult\(p, myrDone\)/);
  assert.match(employee, /Đã hoàn thành Đánh giá giữa năm 2026/);
  assert.match(employee, /Quản lý trực tiếp tại kỳ giữa năm:/);
  assert.match(employee, /p\.myr\.lm1By \|\| p\.emp\.mgr/);
  assert.match(employee, /draftActions\.style\.display = 'none'/);
  assert.match(employee, /finalScore\.textContent = String\(p\.myr\.final\)/);

  const yerManager = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const notes = yerManager.slice(yerManager.indexOf('function noteItems(p, canEdit, opts)'), yerManager.indexOf('function noteBlock(p, canEdit)'));
  assert.doesNotMatch(notes, /Người đã chấm giữa năm|Rated at mid-year by|p\.emp\.myrMgr/);
  assert.doesNotMatch(notes, /Mở tab giữa năm|yer-md-myr/);
});

test('manager detail keeps one Lưu ý box like the employee screen (§40.5a)', () => {
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const items = detail.slice(detail.indexOf('function noteItems(p, canEdit, opts)'), detail.indexOf('function noteBlock(p, canEdit)'));
  const block = detail.slice(detail.indexOf('function noteBlock(p, canEdit)'), detail.indexOf('function closedBlock(p)'));
  // Một khối duy nhất, các thông tin là gạch đầu dòng: hạn, thai sản, nộp bổ sung, LWD, giữa năm
  assert.match(detail, /html \+= noteBlock\(p, canEdit\);/);
  assert.doesNotMatch(detail, /function (windowNote|myrLine|maternityBlock|lateBlock|resignBlock|stoppedBlock)\(/);
  assert.match(block, /class="info-note yer-note-block"><i class="bx bx-info-circle"><\/i>/);
  assert.match(block, /L\('Lưu ý:', 'Please note:'\)/);
  assert.match(block, /items\.join\('<\/li><li>'\)/);
  assert.match(block, /if \(p\.resigned \|\| mySubmitted\(p\)\) return '';/);
  assert.match(block, /if \(p\.stopped\) return closedBlock\(p\);/);
  assert.match(items, /var win = guide \? '' : windowText\(p, canEdit\);/);
  assert.match(items, /class="yer-hl">nghỉ thai sản<\/strong>/);
  assert.match(items, /chịu trách nhiệm chính/);
  // QLTT xem hồ sơ thai sản: khối hướng dẫn ba bước thay khối Lưu ý thường, vẫn là một khối (chốt 02/10/2026)
  assert.match(block, /if \(isLm\(\) && p\.maternity\) return maternityGuide\(p, canEdit\);/);
  const guide = detail.slice(detail.indexOf('function maternityGuide(p, canEdit)'), detail.indexOf('function closedBlock(p)'));
  assert.match(guide, /L\('Hướng dẫn đánh giá cho Nhân viên đang nghỉ thai sản:'/);
  assert.match(guide, /QLTT <strong>chịu trách nhiệm chính<\/strong> thực hiện đánh giá nhân viên theo các bước sau:/);
  assert.match(guide, /Rà soát các mục tiêu hiện có tại tab Đánh giá cuối năm\./);
  assert.match(guide, /cho nhân viên \(nếu cần\)\. Các mục tiêu do QLTT tạo sẽ được ghi nhận ở trạng thái <strong>Đã duyệt<\/strong>\./);
  assert.match(guide, /Hoàn thành Đánh giá chi tiết cho nhân viên và gửi\./);
  assert.match(guide, /QLTT có thể chỉnh sửa kết quả đánh giá trước 18:00 ngày <strong>/);
  assert.match(guide, /<ol class="yer-guide-steps">/);
  assert.match(items, /Ngày làm việc cuối cùng là <strong>/);
  // Câu chữ gọi tên vai thay cho `Bạn` (chốt 02/10/2026); hạn của vai đứng cuối khối
  assert.match(items, /L\(roleName\(\) \+ ' có thể xem lại kết quả <a href="#" class="yer-note-link" data-go-tab="1">Đánh giá giữa năm 2026<\/a> của nhân viên trước khi đánh giá cuối năm\.'/);
  assert.ok(items.indexOf('data-go-tab="1"') < items.indexOf('var win = guide'));
  assert.match(detail, /L\('Sau khi gửi đánh giá, ' \+ R \+ ' có thể chỉnh sửa tới hết 18:00 ngày ' \+ to \+ '\.'/);
  assert.match(detail, /lm: \['QLTT', 'The line manager'\]/);
  // Không có kết quả giữa năm thì không nói gì (§40.5c)
  assert.doesNotMatch(detail, /Không có kết quả Đánh giá giữa năm/);
  // Hồ sơ Không đánh giá: một khối vàng như màn Nhân viên
  assert.match(detail, /'<div class="yer-note yer-late-closed"><i class="bx bx-time-five"><\/i><div>'/);
  assert.match(detail, /#yer-mgr-detail-root \.yer-note\.yer-late-closed\{background:var\(--warn-bg\);border-color:var\(--warn-bd\);color:var\(--z800\)\}/);
  assert.match(detail, /querySelectorAll\('#yer-mgr-detail-root \.yer-note-link\[data-go-tab\]'\)/);
  assert.match(detail, /window\.switchMainTab\(Number\(link\.dataset\.goTab\)\)/);
  assert.match(detail, /\.yer-note-link\{color:var\(--brand\);font-weight:600;text-decoration:underline/);
});

test('manager YER list uses the mid-year colours and concise labels', () => {
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  const listStatus = manager.slice(manager.indexOf('function listStatus(p)'), manager.indexOf('function rowHtml(p)'));
  const roster = manager.slice(manager.indexOf('function roster()'), manager.indexOf('function scoreCell'));

  assert.match(listStatus, /L\('Chờ QLTT đánh giá'/);
  assert.doesNotMatch(manager, /L\('Chờ Quản lý trực tiếp', 'Awaiting line manager'\)/);
  assert.match(listStatus, /L\('Chưa tự đánh giá', 'Self assessment missing'\)/);
  assert.doesNotMatch(listStatus, /Nộp trễ hạn - Chờ QLTT đánh giá/);
  assert.match(listStatus, /key === 'maternity'/);
  // Màu theo luật ở model (chốt 02/10/2026): hồng cho việc vai đang xem làm được ngay, xanh khi đã công bố. Không tông đỏ.
  assert.match(listStatus, /key === 'need-self' \|\| key === 'late-upload'/);
  assert.match(listStatus, /tone: Y\.managerStatusTone\(role\(\), p\)/);
  assert.match(listStatus, /L\('Chờ QL Cấp 2 đánh giá'/);
  assert.match(listStatus, /L\('Chờ HOD đánh giá'/);
  assert.doesNotMatch(listStatus, /review\.pending && review\.stepOpen|tone = /);
  // (HR system) là chữ thường, không viền, không nền
  assert.match(manager, /'\.yer-sync-tag\{display:inline-block;margin-left:4px;font-size:11px;font-weight:500;color:var\(--z600\);white-space:nowrap\}'/);
  assert.doesNotMatch(manager, /\.yer-sync-tag\{[^}]*border/);
  assert.doesNotMatch(manager, /danger/);
  assert.match(manager, /\.yer-mgr-table \.myr-status\{border-radius:50px/);
  // Luật thứ tự nằm ở model, màn chỉ gọi (DS §20.1)
  assert.match(manager, /return Y\.managerRosterRank\(role\(\), p\)/);
  assert.match(roster, /rosterRank\(a\.p\) - rosterRank\(b\.p\) \|\| a\.index - b\.index/);
  // Sắp xếp theo cột: A → Z, Z → A, rồi về thứ tự ưu tiên; ô trống luôn ở cuối (chốt 02/10/2026)
  assert.match(roster, /return sortList\(list\);/);
  assert.match(manager, /state\.sort = cur === '' \? \{ key: key, dir: 'asc' \} : cur === 'asc' \? \{ key: key, dir: 'desc' \} : null;/);
  assert.match(manager, /if \(ea \|\| eb\) return \(ea - eb\) \|\| a\.index - b\.index;/);
  for (const key of ['emp', 'lm1', 'lm2name', 'status', 'self', 'lm', 'lm2', 'hod', 'final']) {
    assert.match(manager, new RegExp("sortTh\\('" + key + "'"), key);
  }
  assert.match(manager, /state\.sort = null; \/\/ mỗi vai có bộ cột riêng/);
});

test('HOD approves HRBP-uploaded ratings in the calibration screen, never in the main grid (§9)', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const date = '2027-03-01';
  const pending = Y.calibrationState(Y.profile('e9', date));
  assert.equal(pending.has, true);
  assert.equal(pending.approved, false);
  assert.equal(pending.canApprove, true);
  assert.equal(pending.conflict, false);
  // Điểm tải lên chưa duyệt không phải điểm HOD
  assert.equal(Y.profile('e9', date).hod, null);
  // HOD đã chấm tay khác điểm tải lên thì báo khác biệt
  const clash = Y.calibrationState(Y.profile('e12', '2027-02-27'));
  assert.equal(clash.conflict, true);
  assert.equal(clash.manual, 4.5);
  assert.equal(clash.score, 4);
  // Hết timeline HOD thì không duyệt được nữa
  assert.equal(Y.calibrationState(Y.profile('e9', '2027-03-12')).canApprove, false);
  // Đã duyệt thì không còn chờ duyệt
  w.PMSStore.acts = id => id === 'e9' ? { hrbpUpload: { approved: true, approvedAt: date }, hod: { score: 4, at: date, source: 'hrbp-upload' } } : {};
  const done = Y.calibrationState(Y.profile('e9', date));
  assert.equal(done.approved, true);
  assert.equal(done.canApprove, false);
  assert.equal(done.conflict, false);
  assert.equal(Y.calibrationState(Y.profile('e1', date)).has, false);

  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  assert.match(manager, /if \(role\(\) !== 'hod'\) return '';/);
  assert.match(manager, /L\('Duyệt điểm hiệu chuẩn', 'Approve calibrated ratings'\)/);
  assert.match(manager, /L\('Phê duyệt điểm hiệu chuẩn', 'Approve calibrated ratings'\)/);
  assert.match(manager, /L\('Điểm Upload', 'Upload'\)/);
  assert.match(manager, /source: 'hrbp-upload'/);
  assert.match(manager, /L\('Thay điểm bạn đã chấm\?', 'Replace your ratings\?'\)/);
  // Tên người tải điểm không trùng nhân viên trong danh sách
  const data = fs.readFileSync(path.join(root, 'assets/yer-data.js'), 'utf8');
  assert.doesNotMatch(data, /by: 'Nguyễn Thị Hoa \(hoa\.nguyen\)'/);
  // Nút chỉ bấm được khi còn điểm HRBP tải lên chờ duyệt
  assert.match(manager, /\(n \? '' : ' disabled title="' \+ esc\(why\) \+ '"'\)/);
  assert.match(manager, /L\('Chưa có điểm HRBP tải lên cần duyệt', 'No HRBP upload awaiting approval'\)/);
  assert.match(manager, /return baseRoster\(\)\.filter\(function \(p\) \{ return Y\.calibrationState\(p\)\.canApprove; \}\)\.length;/);
  // AI Summary nằm ở cột Chức năng của mọi vai (QLTT thêm 04/10/2026), không nằm trong ô chấm điểm; Split View có domain nhân viên
  assert.match(manager, /<div class="yer-mgr-acts">' \+ aiBtn\(p\) \+ actionBtn\(p\)/);
  // Split View có khung nhúng cao bằng vùng nhìn, popup trong khung không rơi xuống dưới (04/10/2026)
  assert.match(fs.readFileSync(path.join(root, 'M-05/index.html'), 'utf8'), /\.sp-shell:has\(\.myr-sp-frame\)\{height:calc\(100vh - 84px\)/);
  assert.match(manager, /return '<div class="yer-rt-cell">' \+ inner \+ '<\/div>';/);
  assert.match(manager, /'<div class="sp-ec"><div class="sp-en">' \+ esc\(p\.emp\.name\) \+ ' <span class="er-login">\(' \+ esc\(p\.emp\.login\) \+ '\)<\/span><\/div>'/);
});

test('LM2 and HOD rate by clicking the score cell, which opens the popup at once and keeps a history', () => {
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  const bindRows = manager.slice(manager.indexOf('function bindRows()'), manager.indexOf('function bind()'));
  const popup = manager.slice(manager.indexOf('function openComment(p, keep)'), manager.indexOf('function openAi(p)'));
  const actions = manager.slice(manager.indexOf('function actionBtn(p)'), manager.indexOf('function listStatus(p)'));
  // Ô điểm là nút, bấm là mở popup ngay; không còn ô chọn và nút nhận xét riêng
  assert.match(manager, /'<button type="button" class="yer-rt-btn'/);
  assert.doesNotMatch(manager, /yer-rt-select|commentBtn|data-comment-emp/);
  assert.match(bindRows, /btn\.addEventListener\('click', function \(e\) \{[\s\S]*if \(p\) openComment\(p\);/);
  assert.match(popup, /L\('Xác nhận', 'Confirm'\)/);
  assert.match(popup, /historyHtml\(p\)/);
  // Popup: điểm nhân viên và điểm QLTT kèm domain; ô điểm cùng component với màn chi tiết (tên mức có màu, Ý nghĩa thang điểm)
  assert.match(popup, /ref\(L\('Điểm của nhân viên', 'Employee rating'\), p\.emp,/);
  assert.match(popup, /L\('Nhân viên:', 'Employee:'\)/);
  // Thẻ điểm: vai, domain, điểm; khối hình thức xử lý đứng trên ô chấm điểm; Ý nghĩa thang điểm chỉ hiện lúc đang chọn
  assert.ok(popup.indexOf("'<div class=\"yer-cm-ref-dom\">'") < popup.indexOf("'<div class=\"yer-cm-ref-val\">'"));
  assert.ok(popup.indexOf('<div id="yer-cm-cap"') < popup.indexOf('<div class="yer-cm-score">'));
  assert.match(popup, /defInto: '#yer-cm-def'/);
  assert.match(popup, /data-shown="' \+ \(keep \|\| draftScore == null \|\| draftScore === '' \? '1' : '0'\)/);
  assert.match(manager, /'\.yer-cm-def\[data-shown="0"\]\{display:none\}'/);
  // (HR system) có giải thích khi rê chuột
  assert.match(manager, /Quá hạn mà cấp này không đánh giá nên hệ thống tự lấy điểm của cấp trước, không kèm nhận xét\./);
  assert.match(popup, /grid-template-columns:repeat\(' \+ \(role\(\) === 'hod' \? 3 : 2\) \+ ',minmax\(0,1fr\)\)/);
  assert.match(popup, /rows="2"/);
  assert.match(popup, /L\('Bạn được điều chỉnh điểm cho nhân viên tới hết 18:00, ngày '/);
  // Khối vàng trong popup chỉ cho hồ sơ bị giới hạn điểm 3 (chốt 02/10/2026)
  assert.match(popup, /var text = Y\.lateCapNotice\(p, lg\(\)\);/);
  assert.match(popup, /ref\(L\('Điểm của QLTT', 'Line manager rating'\), a\.lm,/);
  assert.match(popup, /U\.rating\(el\('yer-cm-rating'\), \{\s*step: 'half'/);
  assert.match(popup, /L\('Nhận xét', 'Comment'\)/);
  assert.doesNotMatch(popup, /Nhận xét toàn diện \(tùy chọn\)|Nhìn chung, nhân viên đã/);
  assert.match(popup, /Ghi nhận xét của bạn về kết quả và đóng góp của nhân viên trong năm\./);
  assert.doesNotMatch(popup, /không bắt buộc\./);
  // Hạn sửa bên trái có nhấn màu, bộ đếm bên phải
  assert.match(popup, /'<span class="yer-cm-until">[\s\S]*'<span id="yer-cm-count" class="yer-cm-count">'/);
  assert.match(manager, /'\.yer-cm-until\{display:inline-flex;align-items:center;gap:5px;color:var\(--brand\);font-size:12px;font-weight:500\}'/);
  // Điểm trên lưới thẳng hàng: nhãn (HR system) và icon cảnh báo đặt tuyệt đối quanh số
  assert.match(manager, /'<span class="yer-sc"><span class="myr-score">'/);
  assert.match(manager, /\.yer-mgr-table \.yer-sc \.yer-sync-tag\{position:absolute;top:100%/);
  // Popup Upload điểm cùng khuôn tab Giữa năm: thông báo timeline đứng đầu, 3 thẻ bước, 1 nút tải mẫu
  const upload = manager.slice(manager.indexOf('function openUpload()'), manager.indexOf('/* ── Phê duyệt điểm hiệu chuẩn'));
  assert.ok(upload.indexOf('html: notice +') > 0);
  assert.equal((upload.match(/step\(\d,/g) || []).length, 3);
  assert.equal((upload.match(/id="yer-up-tpl"/g) || []).length, 1);
  assert.match(upload, /upload-guide-step/);
  // AI Summary: điểm các cấp theo cột, lưu ý tách khỏi phần AI, phần AI chia nhân viên và quản lý
  const ai = fs.readFileSync(path.join(root, 'assets/yer-ai.js'), 'utf8');
  assert.match(ai, /class="yer-ai-scores">/);
  assert.match(ai, /L\('Nhân viên tự đánh giá', 'Employee self assessment'\)/);
  assert.match(ai, /L\('Các cấp quản lý đánh giá', 'Manager reviews'\)/);
  assert.ok(ai.indexOf("scores + flagHtml + '</section>'") > 0, 'luu y nam duoi diem cac cap, ngoai khoi AI');
  // Lịch sử: ngày giờ và `Điểm toàn diện: x`, không ghi nguồn
  assert.match(manager, /L\('Điểm toàn diện: ', 'Overall rating: '\)/);
  assert.match(manager, /'\.yer-cm-dlg\{width:min\(640px,calc\(100vw - 32px\)\);max-width:none\}'/);
  // Nút chức năng màu xám, chỉ AI Summary nhấn màu; LM2, HOD chỉ còn nút xem chi tiết
  assert.doesNotMatch(actions, /accent/);
  assert.match(actions, /L\('Xem chi tiết đánh giá', 'View review details'\)/);
  // ⓘ ở tiêu đề cột điểm của chính vai
  assert.match(manager, /sortTh\('lm2', L\('Điểm của QL cấp 2', 'Second level'\), r === 'lm2' \? rateInfo\(\) : '', 'score'\)/);
  assert.match(manager, /sortTh\('hod', L\('Điểm của Trưởng đơn vị', 'Head of dept'\), r === 'hod' \? rateInfo\(\) : '', 'score'\)/);
  assert.match(manager, /mỗi lần lưu đều có trong lịch sử chỉnh sửa/);

  // Lịch sử: dữ liệu mẫu suy ra một dòng, mỗi lần lưu thêm một dòng, điểm tự chép không vào lịch sử
  const w = loadYer();
  const Y = w.PMSYer;
  const seeded = Y.profile('e11', '2027-02-27');
  assert.equal(seeded.lm2Log.length, 1);
  assert.equal(seeded.lm2Log[0].score, 4.5);
  const next = Array.from(Y.nextManagerLog('lm2', seeded, { at: '2027-02-27', time: '10:00', score: 4, comment: 'x', source: 'grid' }));
  assert.equal(next.length, 2);
  w.PMSStore.acts = id => id === 'e11' ? { lm2: { score: 4, comment: 'x', at: '2027-02-27', source: 'manual' }, lm2Log: { items: next } } : {};
  const edited = Y.profile('e11', '2027-02-27');
  assert.equal(edited.lm2Log.length, 2);
  assert.equal(edited.lm2.score, 4);
  assert.equal(edited.lm2Log[1].source, 'grid');
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  assert.match(detail, /S\.setAct\(S\.session\(\)\.emp, role\(\) \+ 'Log', \{ items: Y\.nextManagerLog\(role\(\), p,/);
});

test('late measures and the rating cap of 3 are shown to every manager level and need a confirmation (§27.3)', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  // Lần 3: giới hạn điểm 3; lần 4: cắt thưởng, không giới hạn điểm; lần 1: chưa có hình thức
  const r3 = Y.profile('y12', '2027-02-10');
  assert.deepEqual({ ...Y.lateMeasure(r3), keys: Array.from(Y.lateMeasure(r3).keys) }, { round: 3, keys: ['cap3'], cap: 3 });
  assert.equal(Y.overRatingCap(r3, 3), false);
  assert.equal(Y.overRatingCap(r3, 3.5), true);
  // Câu cho cấp quản lý: trễ bao nhiêu ngày, lần nhắc nào, hình thức gì; không nhắc chuyện hệ thống chặn điểm
  assert.equal(Y.lateMeasureText(r3, 'vi'), 'Nhân viên hoàn thành trễ Tự đánh giá 8 ngày làm việc (nộp bổ sung ở lần nhắc thứ 3), vậy theo quy định, nhân viên sẽ bị giới hạn điểm đánh giá toàn diện tối đa là 3.');
  assert.equal(Y.ratingCapText(r3, 4, 'vi').rule, undefined);
  assert.equal(Y.ratingCapText(r3, 4, 'vi').ack, 'Tôi xác nhận giữ điểm 4 dù cao hơn mức tối đa 3 theo quy định.');
  const r4 = Y.profile('y16', '2027-02-10');
  assert.equal(Y.lateMeasure(r4).cap, null);
  assert.equal(Y.overRatingCap(r4, 5), false);
  assert.match(Y.lateMeasureText(r4, 'vi'), /vậy theo quy định, nhân viên sẽ bị cắt giảm một phần tiền thưởng/);
  assert.equal(Y.lateMeasure(Y.profile('y9', '2027-02-10')), null);

  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  // M-06: ô Ý nghĩa thang điểm dưới ô nhận xét như E-05; hình thức xử lý trong ô Đánh giá toàn diện; gửi phải tick xác nhận
  assert.match(detail, /def: o\.editable \? '#yer-md-op-def' : null/);
  assert.match(detail, /defInto: node\.dataset\.def \|\| null/);
  assert.match(detail, /measure: measureHtml\(p, mine\.score == null \? null : mine\.score\)/);
  assert.match(detail, /id="yer-md-cap-ack"/);
  assert.match(detail, /payload\.capConfirmed = capConfirmed \?/);
  assert.match(detail, /overCap: capOf\(p, r\.score\)/);
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  // M-05: popup chấm điểm, duyệt hàng loạt, upload, duyệt hiệu chuẩn đều hỏi xác nhận khi vượt mức
  assert.match(manager, /if \(Y\.overRatingCap\(p, cur\.score\) && !cur\.ack\)/);
  assert.match(manager, /confirmOverCap\(rows, function \(\) \{/);
  assert.match(manager, /confirmOverCap\(valid, function \(\) \{/);
  assert.match(manager, /confirmOverCap\(picked\.map\(/);
  assert.match(manager, /lockUntilAck\('yer-bulk-cap-ack'\)/);
  assert.match(manager, /capConfirmed: capConfirmed/);
  assert.match(manager, /function capMark\(p, value\)/);
});

test('line manager adds approved goals for an employee on maternity leave, by file or by hand (§33)', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const date = '2027-01-22';
  const before = Y.profile('e4', date);
  assert.equal(before.maternity, true);
  assert.equal(before.eligibility.reason, 'missing-goal', 'e4 thieu muc tieu phat trien');
  assert.equal(Y.canAddGoals('lm', before), true);
  assert.equal(Y.canAddGoals('lm2', before), false);
  assert.equal(Y.canAddGoals('lm', Y.profile('e4', '2027-01-12')), false, 'chua toi timeline QLTT');
  assert.equal(Y.canAddGoals('lm', Y.profile('e1', date)), false, 'khong phai thai san');
  // Mục tiêu QLTT thêm tính như đã duyệt, gắn byLm để màn hình phân biệt
  w.PMSStore.acts = id => id === 'e4' ? { lmGoals: { items: [{ id: 'lmg-1', type: 'dev', title: 'T', result: 'R', s: '01/01', e: '31/12', at: date, via: 'manual', by: { login: 'thanh.le' } }] } } : {};
  const after = Y.profile('e4', date);
  assert.equal(after.eligibility.eligible, true);
  const dev = Array.from(Y.reviewGoals(after, 'dev'));
  assert.equal(dev.length, 1);
  assert.equal(dev[0].byLm, true);
  assert.equal(dev[0].status, 'approved');
  // Thai sản không bị dừng vì thiếu mục tiêu sau cửa sổ nộp bổ sung (§12)
  w.PMSStore.acts = () => ({});
  assert.equal(Y.profile('e4', Y.addDays(Y.lateSubmissionDeadline(), 1)).stopped, false);

  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(detail, /return Y\.reviewGoals\(p, type\);/);
  assert.match(employee, /return Y\.reviewGoals\(p, type\);/);
  assert.match(detail, /data-add-goal="' \+ type \+ '"/);
  assert.match(detail, /L\('Nhập tay', 'Enter by hand'\)/);
  // Popup như Tạo mục tiêu mới và Import mục tiêu của E-05; hai thẻ ở góc phải tiêu đề (04/10/2026)
  assert.match(detail, /L\('Import mục tiêu', 'Import goals'\)/);
  assert.match(detail, /'\.yer-gd-tabs\{position:absolute;top:13px;right:46px;/);
  assert.match(detail, /<input type="date" class="fc" id="yer-gd-s"/);
  assert.match(detail, /rteHtml\('yer-gd-title'/);
  assert.match(detail, /<ol class="imp-steps">/);
  assert.match(detail, /L\('Đọc file', 'Read file'\)/);
  assert.match(detail, /Mục tiêu QLTT thêm được ghi nhận <strong>Đã duyệt<\/strong> ngay/);
  assert.match(detail, /S\.setAct\(p\.id, 'lmGoals', \{ items: items \}\)/);
  assert.match(detail, /L\('QLTT thêm - Đã duyệt', 'Added by manager - Approved'\)/);
  // Mục tiêu QLTT thêm tạm thời không sửa, không xóa được (chốt 02/10/2026)
  assert.doesNotMatch(detail, /data-del-goal|function removeLmGoal|g-lm-del/);
  assert.match(detail, /không thêm vào tab Danh sách mục tiêu của nhân viên/);
  assert.doesNotMatch(detail, /Mục tiêu bạn thêm/);
  assert.match(employee, /L\('Quản lý trực tiếp thêm','Added by your manager'\)/);
  assert.doesNotMatch(detail, /function importGoals|Bản dựng demo chưa gắn file thật/);
});

test('AI Summary runs on click for every manager role and the writing assistant only helps the line manager (§14)', () => {
  const ai = fs.readFileSync(path.join(root, 'assets/yer-ai.js'), 'utf8');
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  for (const page of ['M-05/index.html', 'M-06/index.html']) {
    assert.match(fs.readFileSync(path.join(root, page), 'utf8'), /<script src="\.\.\/assets\/yer-ai\.js"><\/script>/);
  }
  // Một nguồn nội dung AI Summary cho hai màn
  assert.match(manager, /window\.PMSYerAi\.openSummary\(p\)/);
  assert.doesNotMatch(manager, /function aiSummaryHtml/);
  assert.match(detail, /id="yer-md-ai"><i class="bx bxs-magic-wand"><\/i>AI Summary/);
  assert.match(detail, /window\.PMSYerAi\.openSummary\(p\)/);
  // Trợ lý viết: chỉ QLTT, ô đang sửa; AI không tự chèn
  assert.match(detail, /canEdit && isLm\(\) \? req\(\) \+ aiWriteBtn\(type\) : ''/);
  assert.match(detail, /L\('Cải thiện với AI', 'Improve with AI'\)/);
  assert.match(ai, /L\('Chèn vào ô nhận xét', 'Insert into comment'\)/);
  assert.match(ai, /if \(ctx\.onInsert\) ctx\.onInsert\(text\);/);
  assert.match(ai, /think\.png/);
  assert.doesNotMatch(ai, /bx-sparkles|bx-magic\b/);

  // Nội dung gợi ý dựa trên điểm đã chấm và bỏ nhãn cũ khi viết lại
  const window = { PMSYer: { scoreLabel: v => ({ 4: 'Hoàn thành trên mức kỳ vọng', 3: 'Hoàn thành kỳ vọng' })[v] || '' }, PMSI18n: { lang: () => 'vi' } };
  vm.runInContext(ai, vm.createContext({ window, document: {}, setTimeout, console }));
  const ctx = { p: { emp: { name: 'An' } }, kind: 'what', current: '', goals: { what: [{ title: 'A', score: 4 }, { title: 'B', score: 3 }] } };
  assert.match(window.PMSYerAi.draftFor(ctx), /Nổi bật là mục tiêu “A” ở mức hoàn thành trên mức kỳ vọng\./);
  const again = window.PMSYerAi.rewrite(Object.assign({}, ctx, { current: 'Kết quả: Tốt. Gợi ý phát triển: làm thêm.' }), 'short');
  assert.equal(again, 'Tốt. Làm thêm.');
});

test('manager roster puts work for the viewing role first, finished work and LWD last', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const rank = (role, id, date) => Y.managerRosterRank(role, Y.profile(id, date));

  // Giai đoạn Tự đánh giá: chưa làm lên trên, đã làm xuống dưới, thai sản sau nhân viên bình thường
  const selfPhase = Array.from(w.PMS_EMPLOYEES).map(e => Y.profile(e.id, '2027-01-12')).filter(p => p && !p.hidden && !p.resigned);
  const notYet = selfPhase.find(p => !p.self && !p.maternity && !p.resignFrom && !p.stopped);
  const done = selfPhase.find(p => p.self && !p.maternity && !p.resignFrom);
  const mat = selfPhase.find(p => p.maternity && !p.resignFrom);
  assert.ok(notYet && done && mat, 'du lieu mau co du ba nhom o giai doan Tu danh gia');
  assert.equal(Y.managerRosterRank('lm', notYet), 0);
  assert.equal(Y.managerRosterRank('lm', done), 1);
  assert.equal(Y.managerRosterRank('lm', mat), 2);
  // Thiếu mục tiêu lúc còn Tự đánh giá chưa phải `Không đánh giá` (§5, §27.1)
  const missing = selfPhase.find(p => p.eligibility.reason === 'missing-goal' && !p.maternity);
  assert.ok(missing);
  assert.equal(Y.status(missing, 'vi').key, 'need-self');
  // `Không đánh giá` luôn ở cuối cùng
  const stopped = Y.profile('e2', Y.addDays(Y.step('lm').to, 1));
  assert.equal(Y.status(stopped, 'vi').key, 'noeval');
  assert.equal(Y.managerRosterRank('lm', stopped), 40);

  // Giai đoạn QLTT (chốt 02/10/2026): thai sản, nộp bổ sung, bình thường, có LWD, rồi đã xong, cuối là Không đánh giá
  assert.equal(Y.managerStage('2027-01-29'), 'lm');
  assert.equal(rank('lm', 'e4', '2027-01-22'), 0, 'thai san cho QLTT');
  assert.equal(rank('lm', 'y12', '2027-01-29'), 1, 'nop bo sung cho QLTT');
  assert.equal(rank('lm', 'e1', '2027-01-25'), 2, 'ho so cho QLTT thong thuong');
  assert.equal(rank('lm', 'y6', '2027-01-29'), 3, 'cho QLTT, co LWD');
  // Hồ sơ còn trong cửa sổ nộp bổ sung: chưa tới lượt QLTT nên đứng sau nhóm cần chấm, trước nhóm đã xong
  assert.equal(Y.status(Y.profile('e2', '2027-01-25'), 'vi').key, 'late-upload');
  assert.equal(rank('lm', 'e2', '2027-01-25'), 20, 'chua tu danh gia khong dung dau');
  assert.equal(rank('lm', 'e10', '2027-01-27'), 30, 'QLTT da gui');
  // LM2 xem lúc kỳ đang ở bước QLTT: không làm được gì, vẫn xếp theo thứ tự của bước QLTT
  assert.equal(rank('lm2', 'e6', '2027-01-29'), 12);

  // Giai đoạn LM2, HOD: nộp bổ sung, bình thường, thai sản, có LWD, rồi đã xong
  assert.equal(Y.managerStage('2027-02-17'), 'lm2');
  assert.equal(rank('lm2', 'y8', '2027-02-17'), 1, 'LM2 dang can cham');
  assert.equal(rank('lm2', 'e11', '2027-02-20'), 30, 'LM2 da luu diem');
  assert.equal(rank('lm', 'y12', '2027-02-17'), 10, 'QLTT xem: cho LM2, nop bo sung');
  assert.equal(rank('lm', 'y8', '2027-02-17'), 11, 'QLTT xem: cho LM2, binh thuong');
  assert.equal(rank('lm', 'e4', '2027-02-17'), 12, 'QLTT xem: cho LM2, thai san');
  // Hồ sơ nộp ở lần nhắc thứ tư vẫn trong timeline QLTT: việc của QLTT
  assert.equal(rank('lm', 'y16', '2027-02-04'), 1);
  assert.equal(Y.managerStage('2027-03-01'), 'hod');
  assert.equal(rank('hod', 'e8', '2027-03-01'), 0, 'HOD: nop bo sung');
  assert.equal(rank('hod', 'e9', '2027-03-01'), 1, 'HOD: binh thuong');
  assert.equal(rank('lm', 'e1', '2027-03-27'), 30, 'da cong bo');

  // Màu trạng thái: hồng khi hồ sơ chờ đúng vai đang xem và vai đó làm được ngay
  const tone = (role, id, date) => Y.managerStatusTone(role, Y.profile(id, date));
  assert.equal(tone('lm', 'y12', '2027-01-29'), 'incomplete');
  assert.equal(tone('lm2', 'e6', '2027-01-29'), 'pending', 'LM2 xem luc dang buoc QLTT: xam');
  assert.equal(tone('lm2', 'y8', '2027-02-17'), 'incomplete', 'buoc LM2: Cho QL cap 2 danh gia la hong');
  assert.equal(tone('lm', 'y8', '2027-02-17'), 'pending', 'QLTT xem luc buoc LM2: xam');
  assert.equal(tone('lm', 'e2', '2027-01-25'), 'pending', 'Chua tu danh gia sau giai doan Tu danh gia: xam');
  assert.equal(tone('lm', notYet.id, '2027-01-12'), 'incomplete', 'Chua tu danh gia trong giai doan Tu danh gia: hong');
  assert.equal(tone('lm', 'e1', '2027-04-06'), 'completed', 'da cong bo');
});

test('manager edit window matches the edit permission and names the right deadline', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const win = (role, id, date) => Y.managerEditWindow(role, Y.profile(id, date));

  assert.deepEqual({ ...win('lm', 'e13', '2027-01-15') }, { from: '2027-01-19', to: '2027-02-08', state: 'future' });
  assert.equal(win('lm', 'e10', '2027-01-27').state, 'open');
  assert.equal(win('lm', 'e10', '2027-02-12').state, 'closed');
  // Hồ sơ nộp bổ sung dùng chung hạn QLTT (chốt lại 02/10/2026)
  const late = win('lm', 'y12', '2027-02-08');
  assert.equal(late.to, '2027-02-08');
  assert.equal(late.state, 'open');
  assert.equal(win('lm2', 'y8', '2027-02-17').to, '2027-02-22');
  // Quyền sửa và cửa sổ đọc cùng một luật
  for (const [role, id, date] of [['lm', 'e10', '2027-01-27'], ['lm', 'y12', '2027-02-08'], ['lm', 'e10', '2027-02-12'], ['lm2', 'y8', '2027-02-17']]) {
    const p = Y.profile(id, date);
    assert.equal(Y.managerReviewState(role, p).stepOpen, Y.managerEditWindow(role, p).state === 'open', `${role} ${id} ${date}`);
  }
});

test('manager detail shows the edit deadline and reviews from upper management with domains', () => {
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const upper = detail.slice(detail.indexOf('function upperCard(p)'), detail.indexOf('function panelHtml(o)'));
  assert.match(upper, /isLm\(\) && p\.lm2/);
  assert.match(upper, /role\(\) !== 'hod' && p\.hod/);
  assert.match(upper, /L\('Đánh giá của các cấp quản lý'/);
  assert.match(detail, /o\.by && o\.by\.login \? '<span class="op-hd-dom">- '/);
  assert.match(detail, /overallCard\(p, canEdit\) \+ upperCard\(p\)/);
  assert.match(detail, /function windowText\(p, canEdit\)/);
  assert.match(detail, /Y\.managerEditWindow\(role\(\), p\)/);
  assert.doesNotMatch(detail, /Y\.fmt\(Y\.step\(role\(\)\)\.to/);
  assert.doesNotMatch(detail, /Ngoài thời gian đánh giá của bạn/);
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  assert.match(manager, /Y\.managerEditWindow\(role\(\), p\)\.to/);
});

test('overdue guidance uses a compact three-step flow and a footer submit action', () => {
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const e05 = fs.readFileSync(path.join(root, 'E-05/index.html'), 'utf8');
  const block = employee.slice(employee.indexOf('function lateUploadBlock(p)'), employee.indexOf('var lateDlg = null;'));

  assert.ok(block.length > 0);
  const note = employee.slice(employee.indexOf('function lateNoteBlock(p)'), employee.indexOf('function lateApprovedGoals(p)'));
  assert.match(note, /Lần nhắc thứ ' \+ r\.round/);
  assert.doesNotMatch(note, /\/4/);
  assert.match(note, /, <strong>trễ ' \+ days \+ ' ngày làm việc<\/strong>\./);
  assert.doesNotMatch(note, /\(trễ /);
  assert.match(note, /class="yer-late-note-title"/);
  assert.match(employee, /\.yer-note\.yer-late-note\{background:var\(--warn-bg\);border-color:var\(--warn-bd\)/);
  assert.match(note, /Bạn cần hoàn thành nộp bổ sung trước <strong>18:00 ngày/);
  // Chi hien dong Hinh thuc xu ly khi lan nay da co hinh thuc ap dung; Luu y la cau day du theo quy dinh
  assert.match(note, /\(nowText \? '<li>' \+ L\('<strong>Hình thức xử lý:<\/strong> '/);
  assert.match(note, /<strong>Lưu ý:<\/strong> nếu quá hạn trên mà bạn vẫn chưa nộp, /);
  assert.doesNotMatch(employee, /LATE_SHORT|lg\(\), true\)/);
  assert.doesNotMatch(note, /Cảnh báo/);
  assert.match(note, /id="yer-late-ack-check"/);
  assert.match(note, /Tôi đã đọc, hiểu và xác nhận tiếp tục\./);
  assert.match(note, /id="yer-late-ack-btn" disabled/);
  assert.match(note, /id="yer-late-open"/);
  // Hai buoc danh so: tick xac nhan la buoc 1, nut Nop bo sung la buoc 2
  assert.match(note, /class="yer-late-act-steps"/);
  assert.match(note, /bạn thực hiện 2 bước/);
  assert.doesNotMatch(employee, /Xác nhận và tiếp tục/);
  assert.doesNotMatch(employee, /yer-late-rounds|yer-late-count|yer-late-terms|yer-late-notice/);
  // Man van dung nhu binh thuong, cac o khoa; popup chi mo sau khi xac nhan
  assert.match(employee, /if\(lateOpen\) html \+= lateNoteBlock\(p\);/);
  assert.match(employee, /openLateDialog\(prof\(\)\);/);
  assert.match(employee, /className: 'yer-late-dialog'/);
  assert.match(employee, /if\(lateDlg\)\{ lateDlg\.close\(\); lateDlg = null; \}/);
  assert.doesNotMatch(block, /Hạn gửi:|Hoàn tất 3 bước dưới đây để gửi Quản lý trực tiếp/);
  assert.doesNotMatch(block, /Hoàn tất hồ sơ để Quản lý trực tiếp đánh giá/);
  assert.match(block, /<ol class="yer-late-flow">/);
  assert.equal((block.match(/<li class="yer-late-step/g) || []).length, 3);
  ['Bước 1', 'Bước 2', 'Bước 3'].forEach(label => assert.match(block, new RegExp(label)));
  assert.doesNotMatch(block, /Bước 4|id="yer-late-align"|Xác nhận và gửi/);
  assert.doesNotMatch(block, /<button[^>]*class="yer-late-step-icon"/);
  assert.match(block, /<span class="yer-late-step-icon" aria-hidden="true"><i[^>]*><\/i><\/span><span class="yer-late-step-no">' \+ L\('Bước 1'/);
  assert.match(block, /class="btn btn-outline btn-sm" id="yer-late-template"/);
  assert.doesNotMatch(block, /id="yer-late-template"[^>]*data-tip=/);
  assert.equal((block.match(/id="yer-late-template"/g) || []).length, 1);
  assert.match(block, /Tải xuống Template và điền thông tin theo đúng định dạng/);
  assert.doesNotMatch(block, /Chọn mẫu trống hoặc mẫu có mục tiêu đã duyệt/);
  assert.match(block, /Điền đủ Mục tiêu đã thống nhất với Quản lý trực tiếp và hoàn thiện phần Tự đánh giá/);
  assert.match(block, /Quản lý không duyệt lại mục tiêu trên hệ thống với trường hợp nhân viên trễ hạn Tự đánh giá/);
  assert.doesNotMatch(block, /Điền mục tiêu, điểm, nhận xét và minh chứng/);
  assert.match(block, /<strong class="yer-late-step-title">' \+ L\('Tải lên tập tin đã điền thông tin'/);
  assert.doesNotMatch(block, /Excel \.xlsx hoặc \.xls|id="yer-late-file-box"|Chưa chọn file|Chọn file đã hoàn tất/);
  assert.match(block, /id="yer-late-choose"><i class="bx bx-cloud-upload"><\/i>' \+ L\('Chọn file','Choose file'\)/);
  assert.doesNotMatch(block, /Đổi file|Replace file|bx-folder-open/);
  assert.match(block, /class="yer-late-selected" id="yer-late-selected"/);
  assert.match(block, /id="yer-late-file-name"/);
  assert.match(block, /id="yer-late-remove" aria-label="' \+ L\('Xóa file','Remove file'\) \+ '" title="' \+ L\('Xóa file','Remove file'\) \+ '"><i class="bx bx-trash" aria-hidden="true"><\/i><\/button>/);
  assert.doesNotMatch(block, /bx-trash[^<]*<\/i>' \+ L\('Xóa file','Remove file'\)/);
  assert.match(block, /id="yer-late-submit"[^>]*>[^<]*<i class="bx bx-send"><\/i>' \+ L\('Gửi Quản lý trực tiếp'/);
  const step3 = block.indexOf("L('Tải lên tập tin đã điền thông tin'");
  const choose = block.indexOf('id="yer-late-choose"');
  const selectedName = block.indexOf('id="yer-late-file-name"');
  const remove = block.indexOf('id="yer-late-remove"');
  const flowEnd = block.indexOf('</ol>');
  const submit = block.indexOf('id="yer-late-submit"');
  assert.ok(step3 < choose && choose < selectedName && selectedName < remove && remove < flowEnd, 'file actions and compact selected state must stay in step 3');
  assert.ok(flowEnd < submit, 'primary submit action must sit after the three-step flow');
  assert.match(block, /class="btn btn-default" id="yer-late-submit"/);
  assert.doesNotMatch(block, /id="yer-late-submit"[^>]*disabled/);
  assert.doesNotMatch(employee, /function syncLateSubmitState\(\)/);
  assert.match(employee, /lateRemove\.addEventListener\('click', function\(\)\{\s*lateFileDraft = null;/);
  assert.match(employee, /if\(selected\) selected\.hidden = !lateFileDraft/);
  assert.match(employee, /lateInput\.value = '';\s*lateInput\.click\(\)/);
  assert.match(employee, /if\(!lateFileDraft\)\{/);
  assert.match(employee, /title:L\('Chưa chọn file','No file selected'\)/);
  assert.match(employee, /title:L\('Gửi nội dung Tự Đánh giá cuối năm','Submit Year-End Self Assessment'\)/);
  assert.match(employee, /Bạn xác nhận <strong>các mục tiêu<\/strong> trong file <strong>đã được thống nhất<\/strong> với Quản lý trực tiếp/);
  assert.match(employee, /<strong>Bạn chỉ có 1 lần gửi duy nhất\.<\/strong>/);
  assert.match(employee, /bạn <strong>không thể thu hồi hoặc chỉnh sửa<\/strong> bất cứ nội dung nào/);
  assert.doesNotMatch(employee, /class="yer-late-confirm-risk"/);
  assert.doesNotMatch(employee, /yer-late-confirm-risk>i/);
  assert.match(employee, /\.yer-late-confirm-copy\{display:flex;flex-direction:column;gap:10px\}/);
  assert.match(employee, /className:'yer-late-confirm-dialog'/);
  assert.match(employee, /\.yer-late-confirm-dialog \.pms-dlg-ti\{[^}]*background:var\(--brand-muted\)/);
  assert.doesNotMatch(employee, /\.yer-late-confirm-dialog \.pms-dlg-ti\{[^}]*border-left/);
  assert.match(employee, /\.yer-late-confirm-dialog \.pms-dlg-tx\{padding:16px 18px 18px\}/);
  const ui = fs.readFileSync(path.join(root, 'assets/yer-ui.js'), 'utf8');
  assert.match(ui, /if \(opts\.className\) ov\.querySelector\('\.pms-dlg'\)\.classList\.add\(opts\.className\)/);
  assert.match(employee, /label:L\('Xác nhận và Gửi','Confirm and submit'\), variant:'default'/);
  assert.match(employee, /\.yer-late-step-icon\{[^}]*color:var\(--z500\);font-size:15px/);
  assert.match(employee, /\.yer-late-step\{display:grid;grid-template-columns:104px minmax\(0,1fr\)/);
  assert.match(employee, /\.yer-late-step-line\{display:flex;align-items:center;gap:12px;flex-wrap:wrap/);
  assert.match(employee, /\.yer-late-footer\{display:flex;justify-content:flex-end/);
  assert.doesNotMatch(employee, /\.yer-late-flow\{[^}]*grid-template-columns:repeat\(4/);
  assert.match(e05, /\.yer-note\.action\{background:var\(--brand-muted\);border-color:var\(--brand-ring\)/);
  assert.match(e05, /\.yer-note\.action>i\{color:var\(--brand\)\}/);
  // Khoi thieu muc tieu khong co nut rieng, lien ket nam trong cau (28/09/2026)
  assert.doesNotMatch(employee, /id="yer-go-goals"/);
  assert.match(employee, /Vui lòng tạo và gửi Quản lý trực tiếp phê duyệt tại tab <a href="#" class="yer-note-link" data-go-tab="0">Danh sách mục tiêu<\/a>\./);
  assert.match(e05, /\.btn-cta-outline\{background:var\(--z0\);border-color:var\(--brand\);color:var\(--brand\);font-weight:600\}/);
});

test('late completion banner identifies the supplemental file and overdue days', () => {
  const w = loadYer();
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const banner = employee.slice(employee.indexOf('function submitBanner(p)'), employee.indexOf('function toolbar(p'));

  assert.equal(w.PMSYer.lateDays('2027-01-20'), 2);
  assert.equal(w.PMSYer.lateDays('2027-01-18'), 0);
  assert.match(banner, /Đã hoàn thành bổ sung Tự đánh giá cuối năm/);
  assert.match(banner, /class="yer-late-status"/);
  assert.match(banner, /L\('Trễ hạn ' \+ daysLate \+ ' ngày làm việc'/);
  // Chi hien khi da co hinh thuc ap dung; chi ghi lan nhac thu may, khong ghi tong so lan; chi nhan tu khoa
  assert.match(banner, /if\(isLateFile && p\.lateRound && p\.lateRound\.consequence\.length\)\{/);
  assert.match(banner, /L\(' \(nộp ở lần nhắc thứ ' \+ p\.lateRound\.round \+ '\): '/);
  assert.match(banner, /lateNowHtml\(p\.lateRound\)/);
  assert.doesNotMatch(employee, /Thời gian tạm hoãn: từ|'\/4/);
  assert.match(employee, /function emphasize\(text\)/);
  assert.match(employee, /\.yer-note\.yer-late-closed\{background:var\(--warn-bg\);border-color:var\(--warn-bd\)/);
  assert.match(banner, /!p\.lateSubmission && p\.selfLog && p\.selfLog\.length/);
  assert.match(employee, /\.yer-late-status\{[^}]*background:var\(--err-bg\);[^}]*color:var\(--err\)/);
  assert.match(banner, /p\.lateSubmission && !p\.lm && !p\.published/);
  assert.match(banner, /class="yer-next-step"/);
  assert.match(banner, /Tiếp theo:/);
  assert.match(banner, /Chờ Quản lý trực tiếp đánh giá/);
  assert.match(banner, /mgr\.login/);
});

test('maternity leave stays out of the late-file route', () => {
  const w = loadYer();
  // e4 nghi thai san, chua tu danh gia, dang trong timeline cua Quan ly truc tiep.
  // YER-SPEC 12 va 33: thai san khong bat buoc tu danh gia nen khong bi doi nop file tre.
  const maternity = w.PMSYer.profile('e4', '2027-01-25');
  assert.equal(maternity.maternity, true);
  assert.equal(maternity.self, null);
  assert.equal(maternity.lateWindowOpen, true);
  assert.equal(w.PMSYer.status(maternity, 'vi').key, 'maternity');

  const source = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(source, /p\.lateWindowOpen && !p\.resigned && !p\.maternity/);
  assert.match(source, /selfOpen === false && !p\.maternity/);
});

test('late submission moves directly to manager review with imported goals and self assessment', () => {
  const w = loadYer();
  const submitted = w.PMSYer.profile('y12', '2027-01-29');
  assert.equal(submitted.eligibility.eligible, true);
  assert.equal(submitted.lateSubmission.fileName, 'YER_2026_pham-thu-trang.xlsx');
  assert.equal(submitted.lateSubmission.goals.length, 2);
  assert.equal(submitted.self.source, 'file-import');
  assert.equal(w.PMSYer.status(submitted, 'vi').key, 'wait-lm');
  assert.match(w.PMSYer.status(submitted, 'vi').label, /Nộp trễ hạn/);
});

test('employee screen uses the mascot guide and hides the note after submit', () => {
  const source = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(source, /mountMascotGuide\(p\)/);
  // Gui roi thi khong con khoi Luu y; thieu muc tieu thi cac gach dau dong
  // da nam trong chinh khoi canh bao nen cung khong dung box thu hai.
  assert.match(source, /\(p\.self \|\| hasWarnNote \|\| lateClosed\) \? '' : noteBlock\(p\)/);
  assert.match(source, /noteList\(p, \{ skipGoalRule: true \}\)/);
  /* Vi tri chot theo YER-SPEC.md §40.5a: khoi canh bao dung TREN dai quy trinh,
     khoi Luu y dung DUOI. Vi tri noi len muc do uu tien nen khong duoc doi cho. */
  const iCanhBao = source.indexOf("html += '<div class=\"yer-note action\"");
  const iStepper = source.indexOf('submitBanner(p) + stepper()');
  assert.ok(iCanhBao > 0 && iStepper > iCanhBao, 'khoi canh bao phai dung truoc dai quy trinh');
  assert.doesNotMatch(source, /function guideBtn\(/);
  // Mascot là component dùng chung của yer-ui.js, E-05 và M-06 cùng gọi (04/10/2026)
  const ui = fs.readFileSync(path.join(root, 'assets/yer-ui.js'), 'utf8');
  assert.match(ui, /body\.pms-tour-open \.yer-mascot-guide/);
  assert.match(ui, /function mascotGuide\(opts\)/);
  assert.match(source, /U\.mascotGuide\(\{/);
  assert.match(fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8'), /U\.mascotGuide\(\{/);
  assert.match(source, /function lateUploadBlock\(p\)/);
  assert.match(source, /function downloadLateTemplate\(p\)/);
  assert.match(source, /id="yer-late-template"/);
  assert.match(source, /lateTemplate\.addEventListener\('click', function\(\)\{ downloadLateTemplate\(p\); \}\)/);
  assert.doesNotMatch(source, /Chọn nội dung file mẫu|Choose template content|Mẫu trống|Blank template/);
  assert.match(source, /S\.setAct\(s\.emp, 'lateSubmission'/);
});

test('late self-assessment template download is automatic for blank and approved-goal states', () => {
  const source = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(source, /var approved = lateApprovedGoals\(p\)/);
  assert.match(source, /var fileName = hasApproved \? filled\[id\] : 'YER-2026-Mau-tu-danh-gia\.xlsx'/);
  assert.match(source, /y14: 'YER-2026-Dinh-Gia-Han\.xlsx'/);
  const files = [
    'YER-2026-Mau-tu-danh-gia.xlsx',
    'YER-2026-Nguyen-Mai-Anh.xlsx',
    'YER-2026-Tran-Quoc-Huy.xlsx',
    'YER-2026-Dinh-Gia-Han.xlsx'
  ];
  files.forEach(file => {
    const full = path.join(root, 'assets', 'templates', file);
    assert.ok(fs.existsSync(full), `${file} should exist`);
    assert.ok(fs.statSync(full).size > 5000, `${file} should be a real workbook`);
  });
});

test('demo controls stay hidden but the Demo pill is always reachable', () => {
  const source = fs.readFileSync(path.join(root, 'assets/yer-demo.js'), 'utf8');
  assert.match(source, /get\('demo'\) === '1'/);
  assert.match(source, /toggle\(showDemoOnLoad\)/);
  assert.doesNotMatch(source, /document\.body\.classList\.add\('pms-demo-on'\)/);
  // Thanh an mac dinh, nhung vien Demo o goc phai luon hien de mo lai duoc
  // ma khong can nho phim tat D hay them ?demo=1.
  assert.match(source, /pill\.classList\.toggle\('show', !show\)/);
});

test('manager detail reads imported late goals and keeps review editable', () => {
  const source = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  assert.match(source, /if \(!p\.lateSubmission\) return ''/);
  // Mục tiêu trong file nộp bổ sung đọc qua luật chung của model (Y.reviewGoals)
  assert.match(source, /return Y\.reviewGoals\(p, type\);/);
  assert.match(fs.readFileSync(path.join(root, 'assets/yer-model.js'), 'utf8'), /var imported = \(p\.lateSubmission && p\.lateSubmission\.goals\) \|\| \[\];/);
  assert.match(source, /Nhân viên xác nhận các mục tiêu được đề xuất đã được thống nhất và đồng thuận với QLTT\./);
  assert.doesNotMatch(source, /L\('File: '/);
  // Nộp bổ sung nổi bật bằng banner như E-05 (chốt 02/10/2026), không còn là gạch đầu dòng trong khối Lưu ý
  assert.match(source, /L\('Nhân viên đã hoàn thành bổ sung Tự đánh giá cuối năm'/);
  assert.match(source, /if \(!mySubmitted\(p\)\) return lateBanner\(p\);/);
  assert.doesNotMatch(source, /Nhân viên <strong>nộp bổ sung<\/strong> Tự đánh giá ngày/);
  assert.match(source, /' <span class="yer-late-status">'/);
  assert.match(source, /Y\.lateDays\(p\.lateSubmission\.at\)/);
  assert.match(source, /'\.yer-late-status\{[^}]*' \+\s*'background:var\(--err-bg\);color:var\(--err\)/);
});

test('manager demo separates roster phases from role-filtered detail scenarios', () => {
  const demo = fs.readFileSync(path.join(root, 'assets/yer-demo.js'), 'utf8');
  assert.match(demo, /var MANAGER_ROLES = \['lm', 'lm2', 'hod'\]/);
  assert.match(demo, /var MANAGER_STEPS = \['self', 'lm', 'lm2', 'hod', 'publish'\]/);
  assert.match(demo, /var managerList = onScreen\('M-05\/index\.html'\)/);
  assert.match(demo, /var managerDetail = onScreen\('M-06\/index\.html'\)/);
  // M-06 (chốt 02/10/2026): một dropdown cho ba vai, nhóm theo vai và nhóm con; không còn ô Vai trò và thanh kéo ngày,
  // thay bằng mốc thời gian của tình huống; dòng Cần xem; nút Xem phía Nhân viên; làm lại riêng tình huống đang xem
  assert.match(demo, /return sc\.g === g\.id && sc\.screen === 'M-06';/);
  assert.match(demo, /label\(g\) \+ ': ' \+ label\(sb\)/);
  assert.match(demo, /var scenarioControl = managerDetail/);
  const detailBar = demo.slice(demo.indexOf('Thanh demo của màn chi tiết'), demo.indexOf("goScreen('E-05');"));
  assert.doesNotMatch(detailBar, /dm-role|type="range"/);
  assert.match(detailBar, /data-moment="/);
  assert.match(detailBar, /Cần xem:/);
  assert.match(detailBar, /Xem phía Nhân viên/);
  assert.match(demo, /function optionText\(sc\) \{ return sc\.id \+ ' - ' \+ label\(sc\) \+ ' \(' \+ empName\(sc\) \+ '\)'; \}/);
  assert.doesNotMatch(demo, /' — '/);
  assert.match(demo, /Object\.keys\(acts\)\.forEach\(function \(k\) \{ S\.clearAct\(s\.emp, k\); \}\);/);
  // M-05 giữ thanh ngày và giai đoạn
  assert.match(demo, /return !managerScreen \|\| MANAGER_STEPS\.indexOf\(st\.key\) >= 0/);
  assert.match(demo, /Giai đoạn/);
  // Dữ liệu: mọi tình huống M-06 có cần xem; mốc thời gian nằm trong khoảng của thanh demo; pair trỏ đúng tình huống Nhân viên cùng hồ sơ
  const w = loadYer();
  const byId = Object.fromEntries(Array.from(w.PMS_YER_SCENARIOS, x => [x.id, x]));
  for (const sc of w.PMS_YER_SCENARIOS.filter(x => x.screen === 'M-06')) {
    assert.ok(sc.wvi, sc.id);
    for (const m of sc.moments || []) assert.ok(m.date && m.vi, sc.id);
    if (sc.pair) { assert.equal(byId[sc.pair].role, 'nv', sc.id); assert.equal(byId[sc.pair].emp, sc.emp, sc.id); }
  }
  assert.equal(byId.lm07, undefined, 'lm07 gop vao lm06');
});

test('all manager levels can edit a submitted review while their own timeline remains open', () => {
  const w = loadYer();
  const cases = [
    ['lm09', 'lm', 'e10', '2027-01-27'],
    ['lm2-05', 'lm2', 'e11', '2027-02-20'],
    ['hod05', 'hod', 'e12', '2027-02-27']
  ];
  for (const [scenarioId, role, emp, date] of cases) {
    const scenario = w.PMS_YER_SCENARIOS.find(item => item.id === scenarioId);
    assert.ok(scenario, `${scenarioId} must exist in the demo`);
    assert.equal(scenario.role, role);
    assert.equal(scenario.emp, emp);
    assert.equal(scenario.date, date);
    const profile = w.PMSYer.profile(emp, date);
    assert.equal(w.PMSYer.stepState(role, date), 'open');
    assert.ok(role === 'lm' ? profile.lm : role === 'lm2' ? profile.lm2 : profile.hod);
    const review = w.PMSYer.managerReviewState(role, profile);
    assert.equal(review.submitted, true);
    assert.equal(review.canEdit, true);

    const afterDeadline = w.PMSYer.profile(emp, w.PMSYer.addDays(w.PMSYer.step(role).to, 1));
    assert.equal(w.PMSYer.managerReviewState(role, afterDeadline).canEdit, false);
  }

  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const editable = detail.slice(detail.indexOf('function editable(p)'), detail.indexOf('function toolbar(p'));
  assert.match(editable, /Y\.managerReviewState\(role\(\), p\)\.canEdit && \(!mySubmitted\(p\) \|\| isEditing\(p\)\)/);
  // Sau khi gửi là chế độ xem; bấm Chỉnh sửa ở banner mới mở lại các ô (chốt 02/10/2026)
  assert.match(detail, /\(canReopen\(p\) \? '<button class="btn btn-cta-outline btn-sm" type="button" id="yer-md-edit"/);
  // Bấm Chỉnh sửa thì hỏi xác nhận; đang sửa thì khối màu nhẹ thay banner, có nút Hủy chỉnh sửa (như E-05, 04/10/2026)
  assert.match(detail, /if \(ed\) ed\.addEventListener\('click', function \(\) \{[\s\S]*?confirmReopen\(p\);/);
  assert.match(detail, /if \(isEditing\(p\)\) return editNote\(p\);/);
  assert.match(detail, /L\('Hủy chỉnh sửa', 'Discard changes'\)/);
  assert.match(detail, /delete editingMem\[editKey\(p\)\]; \/\/ lưu xong thì về chế độ xem/);
  // Nhóm nút nổi khi cuộn như E-05 (§49, chốt 02/10/2026)
  assert.match(detail, /'<div class="yer-md-actbar"><div class="cycle-actions yer-mgr-actions">'/);
  assert.match(detail, /actions\.classList\.toggle\('floating', float\);/);
  assert.match(detail, /#yer-mgr-detail-root \.yer-mgr-actions\.floating\{position:fixed;/);
  // Cạnh trái hồng chạy liền cả toolbar (COMPONENTS §15)
  assert.match(fs.readFileSync(path.join(root, 'M-06/index.html'), 'utf8'), /\.editable-panel \.ev-toolbar\{border-bottom:0;padding-bottom:4px;box-shadow:inset 3px 0 0 var\(--brand\),inset 0 -1px 0 var\(--z200\)\}/);
  assert.match(detail, /function submittedDraft\(p\)/);
  assert.match(detail, /loadDraft\(p\)/);
  assert.match(detail, /L\('Lưu thay đổi', 'Save changes'\)/);
  assert.doesNotMatch(detail, /Trả về cho nhân viên|Return to employee/);
});

test('manager year-end detail follows the mid-year detail structure', () => {
  const page = fs.readFileSync(path.join(root, 'M-06/index.html'), 'utf8');
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');

  assert.match(detail, /function detailNav\(p, canEdit\)/);
  assert.match(detail, /class="manager-detail-nav yer-md-nav"/);
  assert.match(detail, /id="yer-md-back"/);
  assert.match(detail, /Quay lại danh sách nhân viên/);
  assert.doesNotMatch(page, /<header class="topbar">\s*<a[^>]+>[^<]*<i[^>]*><\/i>Danh sách<\/a>/);
  assert.match(detail, /L\('Thời gian', 'Timeline'\)/);
  assert.match(detail, /style="width:26%"/);
  assert.match(detail, /style="width:36%"/);
  assert.match(detail, /style="width:11%"/);
  assert.match(detail, /function editorToolbar\(\)/);
  assert.match(detail, /if \(readonly\) \{\s*return '<div class="ev-editor-wrap yer-ed-ro"><div class="ev-content"/);
  assert.doesNotMatch(detail, /\.yer-ed-ro \.ev-toolbar/);
  assert.match(detail, /\.yer-ed-ro\{border-color:var\(--z200\);box-shadow:none;background:var\(--z50\)\}/);
  assert.match(page, /class="emp-col"/);
  assert.match(page, /Đánh giá giữa năm<span class="badge tab-active-label" id="tablbl-myr">Đang hoạt động<\/span>/);
  assert.match(detail, /Ngày làm việc cuối cùng:/);
  assert.match(detail, /class="info-note yer-note-block"/);
  assert.doesNotMatch(detail, /el\('yer-md-myr'\)/);
  assert.match(page, /\.rv-section-hd\{[^}]*border-bottom:1px solid #f3cfe1;background:#fbe4f0\}/);
  assert.match(detail, /L\('Quản lý trực tiếp đánh giá', 'Line manager review'\)/);
});

test('tour detail keeps a mascot illustration in every step card', () => {
  const source = fs.readFileSync(path.join(root, 'assets/yer-ui.js'), 'utf8');
  assert.match(source, /class=\"tg-mascot\"/);
  assert.match(source, /it\.pose \|\| 'think\.png'/);
});

test('mid-year detail lives in M-06: M-05 opens its MYR tab with myrRole, M-02 is gone', () => {
  /* MYR-SPEC §10: vai MYR đi bằng myrRole vì role thuộc luồng YER (yer-demo.js ghi vào phiên). */
  const list = fs.readFileSync(path.join(root, 'M-05/index.html'), 'utf8');
  const page = fs.readFileSync(path.join(root, 'M-06/index.html'), 'utf8');
  assert.ok(!fs.existsSync(path.join(root, 'M-02/index.html')));
  assert.match(list, /return '\.\.\/M-06\/index\.html\?'\+params\.toString\(\)/);
  assert.match(list, /myrRole:S\.myrRole,\s*tab:'myr'/);
  assert.doesNotMatch(list, /M-02\/index\.html/);
  assert.match(page, /var role=params\.get\('myrRole'\)\|\|'lm1'/);
  assert.match(page, /var openMyr=params\.get\('tab'\)==='myr'\|\|\(params\.get\('embed'\)==='1'&&params\.get\('tab'\)!=='yer'\)/);
  // Split View cua tab Cuoi nam giu hang nut danh gia trong khung nhung
  assert.match(page, /body\.embedded-detail \.manager-detail-nav\.yer-md-nav\{display:flex!important\}/);
  assert.match(page, /body\.embedded-detail #pms-demo-pill\{display:none!important\}/);
});

test('MYR tab is shown as year-end history only inside a demo-bar use case of the same employee', () => {
  /* MYR-SPEC §2a: MYR và YER dựng ở hai thời điểm khác nhau. */
  const w = loadYer();
  const sc = w.PMS_YER_SCENARIOS[0];
  const session = { emp: sc.emp, role: sc.role, date: sc.date };
  w.PMSStore = { session: () => session, acts: () => ({}) };
  assert.equal(w.PMSYer.myrAsHistory(sc.emp), false);
  session.scenario = sc.id;
  assert.equal(w.PMSYer.myrAsHistory(sc.emp), true);
  assert.equal(w.PMSYer.myrAsHistory('khong-phai-nv-cua-use-case'), false);

  const demo = fs.readFileSync(path.join(root, 'assets/yer-demo.js'), 'utf8');
  assert.match(demo, /patch\.scenario = sc\.id/);
  assert.match(demo, /S\.setSession\(\{ emp: sc\.emp, role: sc\.role, date: sc\.date, scenario: sc\.id, from: null \}\)/);
  assert.match(demo, /S\.setSession\(\{ role: e\.target\.value, scenario: null \}\)/);

  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(employee, /var myrHistory = Y\.myrAsHistory\(p\.emp\.id\)/);
  assert.match(employee, /if\(myrHistory\) syncMyrResult\(p, myrDone\)/);
  const page = fs.readFileSync(path.join(root, 'M-06/index.html'), 'utf8');
  assert.match(page, /var myrCompleted=myrHistory&&review\.final!==null/);
  assert.match(page, /if\(viewOnly\|\|myrHistory\)\{/);
});

test('employee may reopen a submitted mid-year self assessment within the timeline', () => {
  const page = fs.readFileSync(path.join(root, 'E-05/index.html'), 'utf8');
  assert.match(page, /id="myr-edit-btn" onclick="myrReopen\(\)"/);
  assert.match(page, /function myrReopen\(\)/);
  assert.doesNotMatch(page, /recall-overlay|không thể chỉnh sửa<\/strong> bản tự đánh giá/);
  // Nhân viên không bao giờ thấy điểm toàn diện của Quản lý trực tiếp
  assert.doesNotMatch(page, /Điểm của QLTT:/);
});

test('mid-year list puts people waiting on my role first and HOD timeline matches across screens', () => {
  const list = fs.readFileSync(path.join(root, 'M-05/index.html'), 'utf8');
  const e05 = fs.readFileSync(path.join(root, 'E-05/index.html'), 'utf8');
  assert.match(list, /const rank=s=>s\.text===waitingOnMe\?0:s\.tone==='completed'\?2:1;/);
  // MYR-04: HOD 22/07 – 25/07/2026, không trùng bước LM2
  assert.match(list, /22\/07 – 25\/07\/2026/);
  assert.match(e05, /HOD đánh giá<\/div>\s*<div class="step-timeline">22\/07 – 25\/07\/2026<\/div>/);
});

test('late submission: one file only, the manager rates right after it, waits while the window is open (02/10/2026)', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  // e8 chưa nộp ở lần nhắc 3: QLTT chờ, có lần nhắc để màn Quản lý báo khối vàng
  const before = Y.profile('e8', '2027-01-27');
  assert.equal(Y.lateWaiting(before).round, 3);
  assert.equal(Y.managerReviewState('lm', before).canEdit, false);
  // Nộp ngày 28/01: QLTT chấm được ngay, không chờ hết thời gian nộp bổ sung
  const after = Y.profile('e8', '2027-01-28');
  assert.equal(Y.lateWaiting(after), null);
  assert.ok(after.lateSubmission);
  assert.equal(Y.managerReviewState('lm', after).canEdit, true);
  // Thiếu mục tiêu, không nộp sau mọi lần nhắc: Không đánh giá
  assert.equal(Y.profile('y10', '2027-02-04').stopped, true);
  // Thai sản không đi luồng nộp trễ
  assert.equal(Y.lateWaiting(Y.profile('e4', '2027-01-22')), null);
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  assert.match(detail, /if \(Y\.lateWaiting\(p\)\) return waitingBlock\(p, canEdit\);/);
  assert.match(detail, /L\('Đang chờ nhân viên nộp bổ sung Tự đánh giá'/);
  assert.match(detail, /'<div class="yer-note yer-late-closed yer-late-wait">/);
});

test('an employee with enough goals but no self assessment is still rated by the line manager until the LM deadline', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  // e2 đủ mục tiêu, không tự đánh giá, QLTT chưa chấm (YER-SPEC §6)
  // Còn trong thời gian nộp bổ sung: QLTT chờ, chưa chấm được (chốt 02/10/2026)
  const waiting = Y.profile('e2', '2027-01-30');
  assert.equal(waiting.stopped, false);
  assert.ok(Y.lateWaiting(waiting));
  assert.equal(Y.managerReviewState('lm', waiting).canEdit, false);
  // Hết các lần nhắc mà không nộp: QLTT chấm tới hết hạn QLTT
  const lastDay = Y.profile('e2', Y.step('lm').to);
  assert.equal(lastDay.eligibility.eligible, true);
  assert.equal(lastDay.self, null);
  assert.equal(Y.lateWaiting(lastDay), null);
  assert.equal(Y.managerReviewState('lm', lastDay).canEdit, true);
  assert.equal(Y.managerReviewState('lm', lastDay).pending, true, 'viec cua QLTT');
  // Hết bốn lần nhắc mà vẫn trong timeline QLTT: QLTT vẫn chấm được, chưa phải Không đánh giá
  const afterLate = Y.profile('e2', Y.addDays(Y.lateSubmissionDeadline(), 1));
  assert.equal(afterLate.stopped, false);
  assert.equal(Y.managerReviewState('lm', afterLate).canEdit, true);
  const afterLm = Y.profile('e2', Y.addDays(Y.step('lm').to, 1));
  assert.equal(afterLm.stopped, true);
  assert.equal(Y.status(afterLm, 'vi').key, 'noeval');

  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.doesNotMatch(employee, /Bạn không có kết quả Đánh giá giữa năm/);
  assert.match(employee, /Thời gian nộp bổ sung Tự đánh giá đã kết thúc lúc 18:00 ngày/);
  assert.match(employee, /if\(lateClosed && !hasWarnNote\)\{/);
});

test('the return-for-edit flow is gone: each role only edits its own review inside its own timeline', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const date = '2027-02-12';
  const emp = w.PMS_EMPLOYEES.map(e => Y.profile(e.id, date)).find(p => p && p.lm && !p.lm.synced && !p.lm2);
  assert.ok(emp, 'need a profile waiting for LM2');
  // Du lieu cu con ban ghi tra ve cung khong mo lai quyen sua cua QLTT (chot 30/09/2026)
  w.PMSStore.acts = id => id === emp.id ? { returned: { at: date, reason: 'x' } } : {};
  const p = Y.profile(emp.id, date);
  assert.equal(p.returned, undefined);
  assert.equal(Y.status(p, 'vi').key, 'wait-lm2');
  assert.equal(Y.managerReviewState('lm', p).canEdit, false);

  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const model = fs.readFileSync(path.join(root, 'assets/yer-model.js'), 'utf8');
  assert.doesNotMatch(detail, /returnedBlock|returnForEdit|yer-md-return|Trả về cho Quản lý trực tiếp/);
  assert.doesNotMatch(model, /returned/);
});

test('manager detail keeps the timeline, empty goal groups, goal popups and the shared tab label', () => {
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const page = fs.readFileSync(path.join(root, 'M-06/index.html'), 'utf8');
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');

  // §40.2: màn chi tiết có dải quy trình, bước Tự đánh giá có domain
  assert.match(detail, /id="yer-md-steps"/);
  assert.match(detail, /domain: person \? person\.login : ''/);
  // §40.5d: nhóm trống vẫn giữ khối
  assert.doesNotMatch(detail, /if \(type !== 'how' && !list\.length\) return '';/);
  assert.match(detail, /function emptyRow\(type, p\)/);
  // §13.1, §13.2: dòng mang data-* và popup ghi ai đánh giá hoàn thành
  assert.match(detail, /data-name="' \+ esc\(r\.name\)/);
  assert.match(detail, /data-done-by="/);
  assert.match(detail, /window\.bindReviewGoalRows\(el\('yer-mgr-detail-root'\)\)/);
  assert.match(page, /window\.bindReviewGoalRows = bindReviewGoalRows;/);
  assert.match(page, /Đã đánh giá hoàn thành bởi/);
  // §39.1: QLTT không bị đòi điểm mục tiêu đã khóa, phải có nhận xét toàn diện
  assert.match(detail, /!\(p\.completedGoals \|\| \{\}\)\[g\.id\] && draft\.goalScores\[g\.id\] == null/);
  assert.match(detail, /L\('nhận xét toàn diện', 'the overall comment'\)/);
  // §41.5: tên kỳ tiếng Việt
  assert.doesNotMatch(detail, /Không có kết quả Mid-Year/);
  // §18.4: M-05 và M-06 cùng một luật nhãn tab với E-05
  assert.match(detail, /Y\.cycleTabLabel\(/);
  assert.match(manager, /Y\.cycleTabLabel\(/);
});

test('late submission has four reminders three working days apart, counted in working days', () => {
  const w = loadYer();
  const Y = w.PMSYer;
  const rounds = Array.from(Y.lateRounds(), r => [r.round, r.remindAt, r.deadline]);
  assert.deepEqual(rounds.map(r => Array.from(r)), [
    [1, '2027-01-19', '2027-01-21'],
    [2, '2027-01-22', '2027-01-26'],
    [3, '2027-01-27', '2027-01-29'],
    [4, '2027-02-01', '2027-02-03']
  ]);
  // Khong tinh thu 7, chu nhat va ngay le
  assert.equal(Y.isWorkingDay('2027-01-23'), false);
  assert.equal(Y.isWorkingDay('2027-02-08'), false, 'ngay le trong PMS_YER_HOLIDAYS');
  assert.equal(Y.lateDays('2027-01-22'), 4);
  assert.equal(Y.lateDays('2027-01-25'), 5);
  assert.equal(Y.lateRound('2027-01-24').round, 2, 'cuoi tuan thuoc lan nhac dang mo');
  assert.equal(Y.lateRound('2027-02-04'), null);
  // Hinh thuc xu ly theo lan nop; lan 4 khong con gioi han diem 3 (28/09/2026)
  assert.deepEqual(Array.from(Y.lateRounds()[0].consequence), []);
  assert.deepEqual(Array.from(Y.lateRounds()[2].consequence), ['cap3']);
  assert.deepEqual(Array.from(Y.lateRounds()[3].consequence), ['bonus']);
  assert.equal(Y.lateRounds()[3].next, 'discipline');
  assert.match(Y.lateText('cap3', 'vi'), /tối đa là 3/);
  assert.match(Y.lateText('policy', 'vi'), /^Sau 2 lần nhắc nhở mà nhân viên vẫn chưa hoàn thành/);
  assert.match(Y.lateText('bonus', 'vi'), /^Cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo\. Thời gian tạm hoãn tính từ thời điểm nhắc nhở thứ tư\./);
  assert.match(Y.lateText('bonus', 'vi'), /Trưởng đơn vị \(HOD\) phối hợp với HOHR đề xuất và được Giám đốc điều hành \(CEO\) hoặc người được ủy quyền phê duyệt\.$/);

  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.doesNotMatch(emp, /lateInfoBlock/);
  assert.match(emp, /var isLateFile = !!p\.lateSubmission;/);
  // Xac nhan da doc chi giu trong trang, F5 la phai xac nhan lai
  assert.match(emp, /lateAckMem\[p\.id \+ ':' \+ p\.lateRound\.round\] = \{ at: s\.date \};/);
  assert.doesNotMatch(emp, /setAct\(s\.emp, 'lateAck'/);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'assets/yer-model.js'), 'utf8'), /lateAck/);
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  assert.match(detail, /L\('Trễ hạn ' \+ days \+ ' ngày làm việc'/);
});

test('employee sees upper-management comments but never their ratings', () => {
  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const block = emp.slice(emp.indexOf('function upperCommentsCard(p)'), emp.indexOf('function afterRender(p)'));
  assert.ok(block.length > 0);
  assert.match(block, /if\(!rows\.length\) return '';/);
  assert.match(block, /p\.lm2\.comment/);
  assert.match(block, /p\.hod\.comment/);
  assert.doesNotMatch(block, /\.score/);
  assert.match(emp, /overallCard\(p, editable\) \+ upperCommentsCard\(p\)/);
});

test('edit history groups entries by submission and names the version in force', () => {
  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(emp, /function logEntries\(p\)/);
  assert.match(emp, /L\('Đang được ghi nhận','Current'\)/);
  assert.match(emp, /Bản đang được ghi nhận: <strong>Lần gửi /);
  assert.match(emp, /L\('Xác nhận chỉnh sửa Tự đánh giá đã gửi\?'/);
  assert.match(emp, /Bạn đang trong thời gian <strong class="yer-hl">nghỉ thai sản<\/strong> nên <strong>không bắt buộc<\/strong>/);
  assert.match(emp, /Hệ thống vẫn mở để bạn có thể chủ động hoàn thành\./);
  // Moi lan gui mot the, khong ghi domain nhan vien, tom tat co gio va khong co diem toan dien
  assert.match(emp, /function logCard\(v, total\)/);
  // The cu khong ghi Da thay bang, lan gui dau khong co phan noi dung, thao tac viet thanh cau
  assert.doesNotMatch(emp, /Đã thay bằng lần gửi|Nội dung gửi|'Sau khi gửi'/);
  assert.match(emp, /Bạn mở bản này để chỉnh sửa ' \+ when/);
  assert.match(emp, /L\('Điểm ' \+ TYPE\[t\]\.vi \+ ': sửa '/);
  assert.match(emp, /Y\.selfChanges\(p\.self, next, goalTypes\)/);
  assert.doesNotMatch(emp, /it\.by \|\| p\.emp\.login/);
  assert.doesNotMatch(emp, /L\(' - điểm toàn diện '/);
  assert.match(emp, /gửi ' \+ esc\(logWhen\(last\.it\)\)/);
});

test('submit dialogs list items as bullets, outline missing fields and offer PDF or Excel download', () => {
  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  // Thieu thong tin: tieu de moi, moi khoi mot gach dau dong, dong popup thi to vien do
  assert.match(emp, /L\('Bạn chưa thể gửi Tự đánh giá vì thiếu thông tin'/);
  assert.match(emp, /L\('Bạn vui lòng bổ sung:'/);
  assert.match(emp, /buttons: \[\{ label:L\('Đã hiểu','Got it'\), variant:'default', act:mark \}\],\s+onDismiss: mark/);
  assert.match(emp, /#yer-root \[data-rt\]\.yer-miss select\{border-color:var\(--err\)/);
  assert.match(emp, /#yer-root \.ev-editor-wrap\.yer-miss\{border-color:var\(--err\)/);
  assert.doesNotMatch(emp, /Vui lòng bổ sung thông tin/);
  // Xac nhan gui: tieu de moi, hai gach dau dong, han in dam; gui xong cuon toi banner xanh
  assert.match(emp, /L\('Xác nhận gửi Tự đánh giá cuối năm'/);
  assert.match(emp, /L\('Bản Tự đánh giá sẽ được chuyển tới Quản lý trực tiếp\.'/);
  assert.match(emp, /Bạn vẫn chỉnh sửa được tới hết ngày <strong>' \+ deadline \+ '<\/strong>\./);
  assert.match(emp, /querySelector\('#yer-root \.submit-banner'\);\s+if\(banner\) banner\.scrollIntoView/);
  // Nut tai xuong dung kieu .download-menu cua E-05, chon PDF hoac Excel
  assert.match(emp, /class="download-menu yer-dl-menu"/);
  assert.match(emp, /data-yer-dl="pdf"/);
  assert.match(emp, /data-yer-dl="xlsx"/);
  assert.doesNotMatch(emp, /id="yer-pdf"/);
});
