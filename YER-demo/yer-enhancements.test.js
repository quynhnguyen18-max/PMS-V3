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

  const afterLateWindow = w.PMSYer.profile('y11', '2027-02-02');
  assert.equal(afterLateWindow.lateWindowOpen, false);
  assert.equal(afterLateWindow.stopped, true);
  assert.equal(w.PMSYer.status(afterLateWindow, 'vi').key, 'noeval');
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
  assert.match(source, /function chooseLateTemplate\(p\)/);
  assert.match(source, /id="yer-late-template"/);
  assert.match(source, /S\.setAct\(s\.emp, 'lateSubmission'/);
});

test('late self-assessment templates are available for blank and approved-goal downloads', () => {
  const files = [
    'YER-2026-Mau-tu-danh-gia.xlsx',
    'YER-2026-Nguyen-Mai-Anh.xlsx',
    'YER-2026-Tran-Quoc-Huy.xlsx'
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
});

test('tour detail keeps a mascot illustration in every step card', () => {
  const source = fs.readFileSync(path.join(root, 'assets/yer-ui.js'), 'utf8');
  assert.match(source, /class=\"tg-mascot\"/);
  assert.match(source, /it\.pose \|\| 'think\.png'/);
});
