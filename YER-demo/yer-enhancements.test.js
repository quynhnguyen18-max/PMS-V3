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
  assert.equal(scenarioIds.filter(id => id.startsWith('nv')).length, 19);
  assert.equal(scenarioIds.includes('nv17'), false);
  assert.equal(scenarioIds.includes('nv19'), false);
  assert.equal(scenarioIds.includes('nv20'), false);
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

test('the 16 employee scenarios cover every self assessment state', () => {
  const w = loadYer();
  const nv = w.PMS_YER_SCENARIOS.filter(s => s.g === 'r-nv');
  const keyOf = id => {
    const sc = nv.find(s => s.id === id);
    return w.PMSYer.status(w.PMSYer.profile(sc.emp, sc.date), 'vi').key;
  };
  // Khong du dieu kien, thai san, con han, qua han, va cac buoc cho phia sau.
  assert.equal(keyOf('nv01'), 'out');
  assert.equal(keyOf('nv02'), 'maternity');
  assert.equal(keyOf('nv05'), 'need-self');
  assert.equal(keyOf('nv06'), 'noeval');
  assert.equal(keyOf('nv07'), 'noeval');
  assert.equal(keyOf('nv08'), 'late-upload');
  assert.equal(keyOf('nv09'), 'late-upload');
  assert.equal(keyOf('nv10'), 'late-upload');
  assert.equal(keyOf('nv11'), 'late-upload');
  assert.equal(keyOf('nv12'), 'wait-lm');
  assert.equal(keyOf('nv14'), 'wait-lm2');
  assert.equal(keyOf('nv15'), 'wait-hod');
  assert.equal(keyOf('nv16'), 'wait-tr');
  assert.equal(keyOf('nv21'), 'published');

  // Hai truong hop thieu WHAT va thieu DEV phai that su khac nhau o du lieu,
  // khong phai chi khac cau chu trong danh muc.
  const missWhat = w.PMSYer.profile('y13', '2027-01-12').eligibility;
  const missDev = w.PMSYer.profile('y1', '2027-01-12').eligibility;
  assert.equal(missWhat.missingWhat, true);
  assert.equal(missWhat.missingDev, false);
  assert.equal(missDev.missingWhat, false);
  assert.equal(missDev.missingDev, true);
});

test('employee tab only reports results after publication and has no response flow', () => {
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  const managerDetail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const model = fs.readFileSync(path.join(root, 'assets/yer-model.js'), 'utf8');

  assert.match(employee, /'published':\s+\['Đã có kết quả',\s+'Results available'\]/);
  assert.match(employee, /'wait-lm2':\s+\['Chờ Quản lý cấp 2'/);
  assert.match(employee, /'wait-hod':\s+\['Chờ Trưởng đơn vị'/);
  assert.match(employee, /'wait-tr':\s+\['Chờ tải điểm cuối cùng'/);
  assert.doesNotMatch(employee, /Cần xem kết quả|responseCard|submitResponse|yer-btn-resp|Phản hồi của Nhân viên/);
  assert.doesNotMatch(manager, /onlyResponse|yer-mgr-resp|yer-resp-dot|Nhân viên đã gửi phản hồi/);
  assert.doesNotMatch(managerDetail, /responseBlock|sendReply|yer-md-reply|Phản hồi của Nhân viên/);
  assert.doesNotMatch(model, /responseOpen|replyOpen|threadLocked/);
});

test('published employee result keeps prior-cycle status muted and hides manager overall score', () => {
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');

  assert.match(employee, /myrLbl\.classList\.toggle\('yer-past-cycle-label', Y\.cmp\(s\.date, Y\.step\('self'\)\.from\) >= 0\)/);
  assert.match(employee, /\.tabs \.tab-active-label\.yer-past-cycle-label\{color:var\(--z600\);background:var\(--z100\);border-color:var\(--z300\)\}/);
  assert.doesNotMatch(employee, /class="sb-score-tag yer-final-tag"/);
  assert.doesNotMatch(employee, /yer-hidden-score|L\('Chưa công bố','Not published'\)/);
  assert.match(employee, /class="yer-manager-score-gap" aria-hidden="true"/);
  assert.match(employee, /\.yer-manager-score-gap\{height:20px;margin-bottom:12px\}/);
});

test('manager year-end list follows the mid-year shell and uses employee timeline rules', () => {
  const page = fs.readFileSync(path.join(root, 'M-05/index.html'), 'utf8');
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');

  assert.match(page, /id="cy-1-lbl">Đã hoàn thành<\/span>/);
  assert.match(manager, /function managerTabState\(p\)/);
  assert.match(manager, /yer\.textContent = managerTabState\(Y\.profile\(S\.session\(\)\.emp, S\.session\(\)\.date\)\)/);
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
  assert.match(manager, /role-sub-group[\s\S]*yer-mgr-search/);
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
  assert.match(manager, /return col\('20%'\) \+ col\('15%'\) \+ col\('15%'\)/);
  assert.match(manager, /return col\('18%'\) \+ col\('12%'\) \+ col\('12%'\) \+ col\('14%'\)/);
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

test('nv06 and nv07 name the missing goal type and highlight it in the warning', () => {
  const w = loadYer();
  const missingWork = w.PMSYer.profile('y13', '2027-01-12').eligibility;
  const missingDevelopment = w.PMSYer.profile('y1', '2027-01-12').eligibility;
  assert.equal(missingWork.missingWhat, true);
  assert.equal(missingWork.missingDev, false);
  assert.equal(missingDevelopment.missingWhat, false);
  assert.equal(missingDevelopment.missingDev, true);

  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  assert.match(employee, /return L\('Thiếu mục tiêu công việc','Work goal missing'\)/);
  assert.match(employee, /return L\('Thiếu mục tiêu phát triển','Development goal missing'\)/);
  assert.match(employee, /<strong class="yer-missing-goal">/);
  assert.match(employee, /\.yer-note\.action \.yer-missing-goal\{color:var\(--brand\);font-weight:700\}/);
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

test('the mid-year tab tells apart out-of-cycle from no-result', () => {
  const w = loadYer();

  // Onboard sau han cua ky giua nam -> khong thuoc ky.
  const outOfCycle = w.PMSYer.profile('y15', '2027-01-12');
  assert.equal(outOfCycle.myrEligible, false);
  // Van thuoc ky CUOI nam: hai ky co hai han onboard khac nhau.
  assert.equal(outOfCycle.eligibility.reason !== 'late-onboard', true);

  // Thuoc ky nhung khong hoan tat buoc bat buoc -> van eligible, chi la khong co ket qua.
  const noResult = w.PMSYer.profile('e6', '2027-01-12');
  assert.equal(noResult.myrEligible, true);
  assert.ok(!(noResult.myr && noResult.myr.submitted));

  const emp = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  // Chi khoa tab khi khong thuoc ky; khong co ket qua thi van mo xem lai duoc.
  assert.match(emp, /tabMyr\.classList\.toggle\('disabled', !p\.myrEligible\)/);
  // Khong thuoc ky -> Khong danh gia; thuoc ky ma khong xong -> Khong co ket qua.
  assert.match(emp, /!p\.myrEligible \? L\('Kh\u00f4ng \u0111\u00e1nh gi\u00e1'/);
  assert.match(emp, /L\('Kh\u00f4ng c\u00f3 k\u1ebft qu\u1ea3','No result'\)/);
  // Chi con hai cau ve ket qua ky giua nam, va nguoi ngoai ky thi khong co cau nao.
  assert.match(emp, /v\u00ec ch\u01b0a ho\u00e0n th\u00e0nh quy tr\u00ecnh\./);
  assert.match(emp, /\} else if\(p\.myrEligible\)\{/);
  // Khong con dong nao thi khong duoc dung the rong.
  assert.match(emp, /if\(!items\.length\) return '';/);
  assert.match(emp, /if\(!list\) return '';/);
  assert.ok(!emp.includes('kh\u00f4ng thu\u1ed9c k\u1ef3 gi\u1eefa n\u0103m. \u0110i\u1ec1u n\u00e0y'), 'con sot bien the thu ba');

  // Hai tinh huong demo de doi chieu hai UI khac nhau.
  const ids = new Set(Array.from(w.PMS_YER_SCENARIOS, x => x.id));
  assert.ok(ids.has('nv18') && ids.has('nv22'));
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
  const enough = w.PMSYer.profile('y9', '2027-01-20');
  const missingOne = w.PMSYer.profile('y10', '2027-01-20');
  const missingAll = w.PMSYer.profile('y11', '2027-01-20');

  assert.equal(w.PMSYer.lateSubmissionDeadline(), '2027-01-29');

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

  const deadlineDay = w.PMSYer.profile('y11', '2027-01-29');
  assert.equal(deadlineDay.lateWindowOpen, true);
  assert.equal(deadlineDay.lateSubmissionDeadline, '2027-01-29');

  const afterLateWindow = w.PMSYer.profile('y11', '2027-01-30');
  assert.equal(afterLateWindow.lateWindowOpen, false);
  assert.equal(afterLateWindow.stopped, true);
  assert.equal(w.PMSYer.status(afterLateWindow, 'vi').key, 'noeval');
});

test('nv04 mid-year tab shows the completed result and the historical line manager', () => {
  const w = loadYer();
  const p = w.PMSYer.profile('y3', '2027-01-12');
  assert.equal(p.myr.submitted, true);
  assert.equal(p.myr.nv, 4);
  assert.equal(p.myr.final, 4);
  assert.equal(p.myr.lm1By.name, 'Nguyễn Hải Đăng');
  assert.equal(p.myr.lm1By.login, 'dang.nguyen');

  const managerDetail = fs.readFileSync(path.join(root, 'M-06/index.html'), 'utf8');
  const dataScript = managerDetail.indexOf('<script src="../assets/yer-data.js"></script>');
  const setupCall = managerDetail.indexOf('setupManagerDetail();');
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
  const myrLine = yerManager.slice(yerManager.indexOf('function myrLine(p)'), yerManager.indexOf('function maternityBlock(p)'));
  assert.doesNotMatch(myrLine, /Người đã chấm giữa năm|Rated at mid-year by|p\.emp\.myrMgr/);
  assert.doesNotMatch(myrLine, /Mở tab giữa năm|yer-md-myr/);
  assert.match(myrLine, /if \(p\.resignFrom && !p\.resigned\) return ''/);
});

test('manager LWD note merges the mid-year link into its second bullet', () => {
  const detail = fs.readFileSync(path.join(root, 'assets/yer-manager-detail.js'), 'utf8');
  const block = detail.slice(detail.indexOf('function resignBlock(p)'), detail.indexOf('function doneChip()'));
  assert.match(block, /items\.join\('<\/li><li>'\)/);
  assert.match(block, /Bạn có thể xem lại kết quả <a href="#" class="yer-note-link" data-go-tab="1">Đánh giá giữa năm<\/a> 2026 của nhân viên trước khi tự đánh giá cuối năm\./);
  assert.match(detail, /querySelectorAll\('#yer-mgr-detail-root \.yer-note-link'\)/);
  assert.match(detail, /window\.switchMainTab\(Number\(link\.dataset\.goTab\)\)/);
  assert.match(detail, /\.yer-note-link\{color:var\(--brand\);font-weight:600;text-decoration:underline/);
});

test('manager YER list uses action colors, concise labels and the requested priority ordering', () => {
  const manager = fs.readFileSync(path.join(root, 'assets/yer-manager.js'), 'utf8');
  const listStatus = manager.slice(manager.indexOf('function listStatus(p)'), manager.indexOf('function rowHtml(p)'));
  const rosterRank = manager.slice(manager.indexOf('function rosterRank(p)'), manager.indexOf('function roster()'));
  const roster = manager.slice(manager.indexOf('function roster()'), manager.indexOf('function scoreCell'));

  assert.match(listStatus, /L\('Chờ QLTT đánh giá'/);
  assert.doesNotMatch(manager, /L\('Chờ Quản lý trực tiếp', 'Awaiting line manager'\)/);
  assert.match(listStatus, /L\('Chưa Tự đánh giá', 'Self assessment missing'\)/);
  assert.doesNotMatch(listStatus, /Nộp trễ hạn - Chờ QLTT đánh giá/);
  assert.match(listStatus, /key === 'maternity'/);
  assert.match(listStatus, /key === 'late-upload' \? 'danger'/);
  assert.match(listStatus, /review\.pending && review\.stepOpen/);
  assert.match(manager, /\.myr-status\.danger\{color:var\(--err\);background:var\(--err-bg\);border-color:var\(--err-bd\)\}/);
  assert.match(manager, /\.yer-mgr-table \.myr-status\{border-radius:50px/);
  assert.match(rosterRank, /if \(p\.resignFrom\) return 99/);
  assert.match(rosterRank, /if \(key === 'late-upload'\) return 0/);
  assert.match(rosterRank, /review\.pending && review\.stepOpen/);
  assert.match(rosterRank, /role\(\) === 'lm' && p\.lateSubmission/);
  assert.match(rosterRank, /role\(\) === 'lm' && p\.maternity/);
  assert.match(roster, /rosterRank\(a\.p\) - rosterRank\(b\.p\) \|\| a\.index - b\.index/);
});

test('overdue guidance uses a compact three-step flow and a footer submit action', () => {
  const employee = fs.readFileSync(path.join(root, 'assets/yer-employee.js'), 'utf8');
  const e05 = fs.readFileSync(path.join(root, 'E-05/index.html'), 'utf8');
  const block = employee.slice(employee.indexOf('function lateUploadBlock(p)'), employee.indexOf('function latePayload(p'));

  assert.ok(block.length > 0);
  assert.match(block, /Nộp bổ sung hồ sơ Đánh giá cuối năm/);
  assert.match(employee, /Y\.fmt\(Y\.lateSubmissionDeadline\(\), lg\(\)\)/);
  assert.match(block, /Bạn cần hoàn thành trước <strong>18:00 ngày/);
  assert.match(block, /tức 3 ngày trước hạn đánh giá của Quản lý trực tiếp/);
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
  assert.match(employee, /\.yer-late-confirm-dialog \.pms-dlg-ti\{[^}]*background:#FFF7FB/);
  assert.doesNotMatch(employee, /\.yer-late-confirm-dialog \.pms-dlg-ti\{[^}]*border-left/);
  assert.match(employee, /\.yer-late-confirm-dialog \.pms-dlg-tx\{padding:16px 18px 18px\}/);
  const ui = fs.readFileSync(path.join(root, 'assets/yer-ui.js'), 'utf8');
  assert.match(ui, /if \(opts\.className\) ov\.querySelector\('\.pms-dlg'\)\.classList\.add\(opts\.className\)/);
  assert.match(employee, /label:L\('Xác nhận và Gửi','Confirm and submit'\), variant:'default'/);
  assert.match(employee, /\.yer-late-head\{[^}]*background:#FFF7FB;border-bottom:1px solid #F0D7E5/);
  assert.match(employee, /\.yer-late-badge\{[^}]*background:#FCEBF5;color:var\(--brand\)/);
  assert.match(employee, /\.yer-late-step-icon\{[^}]*color:var\(--z500\);font-size:15px/);
  assert.match(employee, /\.yer-late-step\{display:grid;grid-template-columns:104px minmax\(0,1fr\)/);
  assert.match(employee, /\.yer-late-step-line\{display:flex;align-items:center;gap:12px;flex-wrap:wrap/);
  assert.match(employee, /\.yer-late-footer\{display:flex;justify-content:flex-end/);
  assert.doesNotMatch(employee, /\.yer-late-flow\{[^}]*grid-template-columns:repeat\(4/);
  assert.match(e05, /\.yer-note\.action\{background:#FFF7FB;border-color:#F0D7E5/);
  assert.match(e05, /\.yer-note\.action>i\{color:var\(--brand\)\}/);
  assert.match(employee, /class="btn btn-cta-outline btn-sm yn-cta" id="yer-go-goals"/);
  assert.doesNotMatch(employee, /class="btn btn-default btn-sm yn-cta" id="yer-go-goals"/);
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
  assert.match(banner, /L\('Trễ hạn','Late'\)/);
  assert.match(employee, /\.yer-late-status\{[^}]*background:#FCEBF5;[^}]*color:var\(--brand\)/);
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
  const submitted = w.PMSYer.profile('y12', '2027-01-22');
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
  assert.match(source, /\(p\.self \|\| hasWarnNote\) \? '' : noteBlock\(p\)/);
  assert.match(source, /noteList\(p, \{ skipGoalRule: true \}\)/);
  /* Vi tri chot theo YER-SPEC.md §40.5a: khoi canh bao dung TREN dai quy trinh,
     khoi Luu y dung DUOI. Vi tri noi len muc do uu tien nen khong duoc doi cho. */
  const iCanhBao = source.indexOf("html += '<div class=\"yer-note action\"");
  const iStepper = source.indexOf('submitBanner(p) + stepper()');
  assert.ok(iCanhBao > 0 && iStepper > iCanhBao, 'khoi canh bao phai dung truoc dai quy trinh');
  assert.doesNotMatch(source, /function guideBtn\(/);
  assert.match(source, /body\.pms-tour-open \.yer-mascot-guide/);
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
  assert.match(source, /p\.lateSubmission && p\.lateSubmission\.goals/);
  assert.match(source, /không qua bước duyệt/);
  assert.match(source, /Hồ sơ nộp bổ sung Tự đánh giá cuối năm/);
  assert.match(source, /class="yer-md-late-status"/);
  assert.match(source, /Y\.lateDays\(p\.lateSubmission\.at\)/);
  assert.match(source, /\.yer-md-late-status\{[^}]*background:#FCEBF5;[^}]*color:var\(--brand\)/);
});

test('all manager levels can edit a submitted review while their own timeline remains open', () => {
  const w = loadYer();
  const cases = [
    ['lm09', 'lm', 'e10', '2027-01-27'],
    ['lm2-05', 'lm2', 'e11', '2027-02-13'],
    ['hod05', 'hod', 'e12', '2027-02-20']
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
  assert.match(editable, /Y\.managerReviewState\(role\(\), p\)\.canEdit/);
  assert.doesNotMatch(editable, /return !mySubmitted\(p\)/);
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
  assert.match(page, /Đánh giá giữa năm<span class="badge tab-active-label">Đã hoàn thành<\/span>/);
  assert.match(detail, /Ngày làm việc cuối cùng:/);
  assert.match(detail, /class="info-note yer-note-block yer-note-resign"/);
  assert.doesNotMatch(detail, /el\('yer-md-myr'\)/);
  assert.match(page, /\.rv-section-hd\{[^}]*border-bottom:1px solid #f3cfe1;background:#fbe4f0\}/);
  assert.match(detail, /L\('Quản lý trực tiếp đánh giá', 'Line manager review'\)/);
});

test('tour detail keeps a mascot illustration in every step card', () => {
  const source = fs.readFileSync(path.join(root, 'assets/yer-ui.js'), 'utf8');
  assert.match(source, /class=\"tg-mascot\"/);
  assert.match(source, /it\.pose \|\| 'think\.png'/);
});
