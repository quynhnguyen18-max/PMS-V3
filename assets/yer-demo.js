/* ═══════════════════════════════════════════════════════════
   YER Demo Control — thanh điều khiển demo (KHÔNG thuộc UI thật)
   Vai trò + Ngày hệ thống (time machine) + Nhân sự + Reset.
   Phím tắt D để ẩn/hiện. Deep link: ?role=lm&date=2027-02-10&emp=e7
   Màn hình lắng nghe sự kiện 'pms:demo-change' để render lại.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var ROLES = [
    { key: 'nv',   vi: 'Nhân viên',            en: 'Employee' },
    { key: 'lm',   vi: 'Quản lý trực tiếp',    en: 'Line Manager' },
    { key: 'lm2',  vi: 'Quản lý cấp 2',        en: 'Second-level Manager' },
    { key: 'hod',  vi: 'Trưởng đơn vị',        en: 'Head of Department' },
    { key: 'hrbp', vi: 'HRBP',                 en: 'HRBP' },
    { key: 'lod',  vi: 'L&OD',                 en: 'L&OD' },
    { key: 'tr',   vi: 'Total Reward',         en: 'Total Reward' },
    { key: 'hrd',  vi: 'HR Director',          en: 'HR Director' }
  ];

  var RANGE_FROM = '2026-12-15';
  var RANGE_TO = '2027-04-15';

  function toDate(v) { return new Date(v + 'T00:00:00'); }
  function dayIndex(v) { return Math.round((toDate(v) - toDate(RANGE_FROM)) / 86400000); }
  function dayValue(i) {
    var t = toDate(RANGE_FROM); t.setDate(t.getDate() + i);
    return t.toISOString().slice(0, 10);
  }
  var MAX_DAYS = dayIndex(RANGE_TO);

  function fmtDate(v, lang) {
    var p = v.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  var CSS = [
    '#pms-demo{position:fixed;left:0;right:0;bottom:0;z-index:900;background:var(--z900);color:#fff;',
    'font-family:"Public Sans",sans-serif;font-size:12px;box-shadow:0 -4px 16px rgba(0,0,0,.18)}',
    '#pms-demo.hidden{display:none}',
    '#pms-demo .dm-row{display:flex;align-items:center;gap:14px;padding:8px 16px;flex-wrap:wrap}',
    '#pms-demo .dm-row + .dm-row{border-top:1px solid rgba(255,255,255,.08)}',
    '#pms-demo .dm-tag{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.12);',
    'padding:3px 9px;border-radius:50px;font-size:10.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase}',
    '#pms-demo label{display:inline-flex;align-items:center;gap:6px;color:rgba(255,255,255,.62);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.4px}',
    '#pms-demo select{background:rgba(255,255,255,.10);color:#fff;border:1px solid rgba(255,255,255,.18);',
    'border-radius:6px;padding:4px 8px;font-size:12px;font-family:inherit;max-width:290px}',
    '#pms-demo select option{color:#18181b}',
    '#pms-demo .dm-date{font-variant-numeric:tabular-nums;font-weight:700;font-size:13px;min-width:86px;text-align:center}',
    '#pms-demo input[type=range]{width:210px;accent-color:#ff2e93}',
    '#pms-demo button{background:rgba(255,255,255,.10);color:#fff;border:1px solid rgba(255,255,255,.18);',
    'border-radius:6px;padding:4px 10px;font-size:11.5px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .12s ease}',
    '#pms-demo button:hover{background:rgba(255,255,255,.2)}',
    '#pms-demo .dm-steps{display:flex;gap:4px;flex-wrap:wrap}',
    '#pms-demo .dm-step{padding:3px 9px;border-radius:50px;font-size:11px;font-weight:600;',
    'background:rgba(255,255,255,.07);border:1px solid transparent;color:rgba(255,255,255,.6);cursor:pointer}',
    '#pms-demo .dm-step:hover{background:rgba(255,255,255,.16);color:#fff}',
    '#pms-demo .dm-step.on{background:#ff2e93;border-color:#ff2e93;color:#fff}',
    '#pms-demo .dm-step.past{color:rgba(255,255,255,.82)}',
    '#pms-demo .dm-spacer{flex:1}',
    '#pms-demo button:disabled{opacity:.35;cursor:not-allowed}',
    '#pms-demo .dm-count{font-variant-numeric:tabular-nums;font-weight:700;color:rgba(255,255,255,.78)}',
    '#pms-demo .dm-seen{font-variant-numeric:tabular-nums;color:rgba(255,255,255,.62)}',
    '#pms-demo select{max-width:520px}',
    '#pms-demo .dm-hint{padding:6px 16px 8px;color:rgba(255,255,255,.78);font-size:12px;line-height:1.45}',
    '#pms-demo .dm-hint strong{color:#fff;font-weight:700;margin-right:4px}',
    '#pms-demo .dm-quiet{background:transparent;border-color:transparent;color:rgba(255,255,255,.6)}',
    '#pms-demo-pill{position:fixed;right:16px;bottom:16px;z-index:900;background:var(--z900);color:#fff;',
    'border:0;border-radius:50px;padding:7px 14px;font-family:"Public Sans",sans-serif;font-size:11.5px;font-weight:700;',
    'cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.22);display:none}',
    '#pms-demo-pill.show{display:inline-flex;align-items:center;gap:6px}',
    'body.pms-demo-on{padding-bottom:96px}'
  ].join('');

  function css() {
    if (document.getElementById('pms-demo-css')) return;
    var s = document.createElement('style');
    s.id = 'pms-demo-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function readDeepLink() {
    var q = new URLSearchParams(window.location.search);
    var patch = {};
    if (q.get('scenario')) {
      var sc = (window.PMS_YER_SCENARIOS || []).filter(function (s) { return s.id === q.get('scenario'); })[0];
      if (sc) { patch.role = sc.role; patch.emp = sc.emp; patch.date = sc.date; patch.screen = sc.screen; patch.scenario = sc.id; }
    }
    if (q.get('role')) patch.role = q.get('role');
    if (q.get('emp')) patch.emp = q.get('emp');
    if (q.get('date')) patch.date = q.get('date');
    if (q.get('lang')) patch.lang = q.get('lang');
    return patch;
  }

  /* Mỗi vai làm việc trên một màn khác nhau, nên đổi vai mà ở nguyên màn cũ thì
     người xem chỉ thấy màn trống. Thanh demo tự đưa sang đúng màn của vai đó. */
  var DEFAULT_SCREEN = { nv: 'E-05', lm: 'M-05', lm2: 'M-05', hod: 'M-05' };
  var MANAGER_ROLES = ['lm', 'lm2', 'hod'];
  var MANAGER_STEPS = ['self', 'lm', 'lm2', 'hod', 'publish'];

  function screenPath(key) {
    var sc = (window.PMS_YER_SCREENS || {})[key];
    return sc ? sc.path : null;
  }

  function onScreen(path) {
    return path && location.pathname.replace(/\\/g, '/').indexOf('/' + path) >= 0;
  }

  // Giữ lại demo=1 và lang khi chuyển màn, còn role/emp/date đã nằm trong phiên.
  function goScreen(key) {
    var path = screenPath(key);
    if (!path || onScreen(path)) return false;
    var q = new URLSearchParams(location.search);
    var keep = new URLSearchParams();
    keep.set('demo', '1');
    if (q.get('lang')) keep.set('lang', q.get('lang'));
    location.href = '../' + path + '?' + keep.toString();
    return true;
  }

  /* Tình huống có cờ `fresh` (nộp bổ sung ở từng lần nhắc, YER-SPEC §46): mỗi lần tải trang hoặc chọn
     tình huống thì xóa thao tác cũ của nhân viên đó (bản nháp, bản đã gửi), để lúc nào cũng làm lại được từ đầu. */
  var FRESH_KEYS = ['self', 'selfDraft', 'selfEditing', 'selfLog'];
  function freshStart(sc) {
    if (!sc || !sc.fresh) return;
    FRESH_KEYS.forEach(function (k) { window.PMSStore.clearAct(sc.emp, k); });
  }
  /* Tình huống có `acts` (08/10/2026): dữ liệu riêng của tình huống, thêm vào hồ sơ dùng chung mà không sửa dữ liệu gốc. Ghi khi
     chọn (hoặc làm lại) tình huống, gỡ khi chọn tình huống khác; phiên nhớ tình huống đang được ghi để gỡ đúng phần đã ghi, kể cả
     khi người xem đã rời tình huống bằng cách đổi vai hay đổi ngày. Giá trị null: xóa thao tác đó. */
  function scenarioActs(sc) {
    var all = window.PMS_YER_SCENARIOS || [];
    var appliedId = window.PMSStore.session().actsOf;
    var applied = all.filter(function (x) { return x.id === appliedId; })[0];
    function each(x, fn) {
      Object.keys(x.acts).forEach(function (emp) { Object.keys(x.acts[emp]).forEach(function (k) { fn(emp, k, x.acts[emp][k]); }); });
    }
    if (applied && applied.acts) each(applied, function (emp, k) { window.PMSStore.clearAct(emp, k); });
    if (sc && sc.acts) each(sc, function (emp, k, v) { if (v) window.PMSStore.setAct(emp, k, v); });
    window.PMSStore.setSession({ actsOf: sc && sc.acts ? sc.id : null });
  }
  function currentScenario() {
    var id = window.PMSStore.session().scenario;
    return (window.PMS_YER_SCENARIOS || []).filter(function (x) { return x.id === id; })[0] || null;
  }

  /* Tình huống đã xem trên thanh demo M-06 (04/10/2026): chỉ lưu trên máy người review để biết còn sót mục nào */
  var SEEN_KEY = 'pms-yer-demo-seen';
  function seenList() {
    try { return JSON.parse(window.localStorage.getItem(SEEN_KEY) || '[]'); } catch (e) { return []; }
  }
  function markSeen(id) {
    var list = seenList();
    if (list.indexOf(id) >= 0) return;
    list.push(id);
    try { window.localStorage.setItem(SEEN_KEY, JSON.stringify(list)); } catch (e) { /* trình duyệt chặn lưu thì bỏ qua */ }
  }
  function clearSeen() {
    try { window.localStorage.removeItem(SEEN_KEY); } catch (e) { /* bỏ qua */ }
  }

  function notify(reason) {
    document.dispatchEvent(new CustomEvent('pms:demo-change', {
      detail: Object.assign({ reason: reason }, window.PMSStore.session())
    }));
  }

  function build() {
    css();
    var S = window.PMSStore;
    var showDemoOnLoad = new URLSearchParams(window.location.search).get('demo') === '1';
    var patch = readDeepLink();
    var wantScreen = patch.screen; delete patch.screen;
    if (!S.session().date) patch.date = patch.date || window.PMSYer.DEFAULT_DATE;
    if (Object.keys(patch).length) S.setSession(patch);
    // ?scenario= đã ghi vào phiên thì gỡ khỏi URL, để về sau phiên là nguồn duy nhất
    // (rời use case trên thanh demo là hết use case, kể cả trên màn mở bằng deep link).
    if (patch.scenario && window.history && window.history.replaceState) {
      var q = new URLSearchParams(window.location.search);
      q.delete('scenario');
      var rest = q.toString();
      window.history.replaceState(null, '', window.location.pathname + (rest ? '?' + rest : '') + window.location.hash);
    }
    // ?scenario=... mở đúng màn của tình huống, kể cả khi được dán vào màn khác
    if (patch.scenario) scenarioActs(currentScenario());
    if (wantScreen && goScreen(wantScreen)) return;
    freshStart(currentScenario());

    var bar = document.createElement('div');
    bar.id = 'pms-demo';

    var emps = (window.PMS_EMPLOYEES || []);
    var scenarios = (window.PMS_YER_SCENARIOS || []);

    function lang() { return window.PMSI18n ? window.PMSI18n.lang() : 'vi'; }
    function label(o) { return lang() === 'en' ? o.en : o.vi; }

    function render() {
      var s = S.session();
      var lg = lang();
      var managerList = onScreen('M-05/index.html');
      var managerDetail = onScreen('M-06/index.html');
      var managerScreen = managerList || managerDetail;
      var groups = window.PMS_YER_GROUPS || [];
      var order = window.PMS_YER_SCENARIO_ORDER || [];
      var rank = {};
      order.forEach(function(id, i){ rank[id] = i; });
      var sortedScenarios = scenarios.slice().sort(function(a, b){
        return (rank[a.id] == null ? 999 : rank[a.id]) - (rank[b.id] == null ? 999 : rank[b.id]);
      });
      // Một nhân sự có thể xuất hiện ở nhiều tình huống của nhiều vai, nên dropdown
      // định danh theo MÃ TÌNH HUỐNG chứ không theo mã nhân sự.
      var scById = {}, usedEmp = {};
      sortedScenarios.forEach(function (x) { scById[x.id] = x; usedEmp[x.emp] = true; });
      /* Tình huống đang xem: ưu tiên mã trong phiên (đổi mốc thời gian không làm mất tình huống), không có thì
         khớp theo hồ sơ, vai và ngày */
      var current = (s.scenario && scById[s.scenario] && scById[s.scenario].emp === s.emp && scById[s.scenario].role === s.role)
        ? scById[s.scenario]
        : sortedScenarios.filter(function (x) { return x.emp === s.emp && x.date === s.date && x.role === s.role; })[0];
      function empName(sc) {
        var e = emps.filter(function (item) { return item.id === sc.emp; })[0];
        return e ? e.name : sc.emp;
      }
      // Mã tình huống đứng đầu để dễ dò và trao đổi, rồi tình trạng hồ sơ và tên nhân viên (không dùng gạch dài, DS §19.0)
      function optionText(sc) { return sc.id + ' - ' + label(sc) + ' (' + empName(sc) + ')'; }
      function onScenario(e) {
        var v = String(e.target.value || '');
        var sc = scById[v.slice(3)];
        if (!sc) return;
        S.setSession({ emp: sc.emp, role: sc.role, date: sc.date, scenario: sc.id, from: null });
        freshStart(sc);
        scenarioActs(sc);
        if (goScreen(sc.screen || DEFAULT_SCREEN[sc.role])) return;
        render(); notify('emp');
      }

      var scenarioOptions = '';
      // Danh sách tình huống của màn chi tiết theo đúng thứ tự nhóm, dùng cho dropdown và nút ◀ ▶
      var subOrder = (window.PMS_YER_SUBGROUPS || []).map(function (x) { return x.id; });
      var detailList = sortedScenarios.filter(function (sc) { return sc.screen === 'M-06' && sc.sub; })
        .sort(function (a, b) { return subOrder.indexOf(a.sub) - subOrder.indexOf(b.sub) || (rank[a.id] - rank[b.id]); });
      if (managerDetail) {
        // Màn chi tiết chỉ liệt kê use case của đúng vai đang xem; không cho một
        // lựa chọn âm thầm đổi cả vai trò và màn hình như thanh demo cũ.
        /* Màn chi tiết (chốt 02/10/2026): một dropdown cho cả ba vai, chia nhóm theo vai và nhóm con của QLTT.
           Chọn tình huống thì vai đổi theo, vẫn ở M-06; không còn ô Vai trò riêng. */
        /* Chốt lại 04/10/2026: nhóm theo vai đang xem và đúng tên bước trên dải quy trình (PMS_YER_SUBGROUPS),
           mỗi tình huống là một giao diện ở một ngày; số thứ tự liên tục để đi lần lượt bằng ◀ ▶. */
        if (!current || current.screen !== 'M-06') {
          scenarioOptions += '<option value="" selected disabled>' +
            (lg === 'en' ? 'Select a scenario' : 'Chọn tình huống') + '</option>';
        }
        // Đang xem tình huống nào thì đánh dấu đã xem; mục đã xem có dấu ✓ đứng đầu
        if (current && current.screen === 'M-06') markSeen(current.id);
        var seen = seenList();
        detailList.forEach(function (sc, i) {
          var sb = (window.PMS_YER_SUBGROUPS || []).filter(function (x) { return x.id === sc.sub; })[0];
          var prev = detailList[i - 1];
          if (!prev || prev.sub !== sc.sub) scenarioOptions += (prev ? '</optgroup>' : '') + '<optgroup label="' + (sb ? label(sb) : '') + '">';
          scenarioOptions += '<option value="sc:' + sc.id + '"' + (current && current.id === sc.id ? ' selected' : '') + '>' +
            (seen.indexOf(sc.id) >= 0 ? '✓ ' : '') + optionText(sc) + '</option>';
        });
        if (detailList.length) scenarioOptions += '</optgroup>';
      } else if (!managerList) {
        // Màn Nhân viên chỉ liệt kê tình huống của vai Nhân viên (§44.1)
        if (!current) {
          scenarioOptions += '<option value="" selected disabled>' +
            (lg === 'en' ? 'Select a scenario' : 'Chọn tình huống') + '</option>';
        }
        scenarioOptions += groups.filter(function(g){ return g.role === 'nv'; }).map(function(g){
          var rows = sortedScenarios.filter(function(sc){ return sc.g === g.id; });
          if(!rows.length) return '';
          return '<optgroup label="' + label(g) + '">' + rows.map(function(sc){
            return '<option value="sc:' + sc.id + '"' + (current && current.id === sc.id ? ' selected' : '') + '>' + optionText(sc) + '</option>';
          }).join('') + '</optgroup>';
        }).join('');
        // Không còn nhóm Hồ sơ khác: hồ sơ lẻ giữ nguyên ngày hệ thống của tình huống trước nên
        // màn hiển thị không khớp với câu chuyện của hồ sơ. Mọi hồ sơ demo đều là tình huống có số.
      }

      var visibleRoles = managerScreen
        ? ROLES.filter(function (r) { return MANAGER_ROLES.indexOf(r.key) >= 0; })
        : ROLES;
      var scenarioControl = managerDetail
        ? '<label>' + (lg === 'en' ? 'Scenario' : 'Tình huống') +
            '<select id="dm-emp">' + scenarioOptions + '</select></label>'
        : !managerList
          ? '<label>' + (lg === 'en' ? 'Scenario' : 'Tình huống') +
              '<select id="dm-emp">' + scenarioOptions + '</select></label>'
          : '';
      var visibleSteps = window.PMS_YER_TIMELINE.steps.filter(function (st) {
        return !managerScreen || MANAGER_STEPS.indexOf(st.key) >= 0;
      });
      function chipState(st) {
        return window.PMSYer.cmp(s.date, st.from) < 0 ? 'future' : window.PMSYer.cmp(s.date, st.to) > 0 ? 'closed' : 'open';
      }
      /* Danh sách Quản lý: một dòng đếm các trạng thái đang có ở ngày đang chọn (08/10/2026), để review bộ trạng thái theo
         từng mốc timeline. Đếm trên danh sách của vai đang xem, cùng nhãn với cột Trạng thái. */
      function statusSummary() {
        var count = {}, order = [];
        window.PMSYer.roster(s.role).forEach(function (p) {
          var st = window.PMSYer.status(p, lg);
          if (!st.label) return;
          if (!count[st.label]) { count[st.label] = 0; order.push(st.label); }
          count[st.label]++;
        });
        if (!order.length) return '';
        return '<div class="dm-hint"><strong>' + (lg === 'en' ? 'Statuses on this date:' : 'Trạng thái ở ngày này:') + '</strong>' +
          order.map(function (l) { return l + ' (' + count[l] + ')'; }).join(' - ') + '</div>';
      }

      // Tình huống Nhân viên và tình huống màn chi tiết của Quản lý dẫn qua lại (trường pair)
      var counterpart = null;
      if (managerDetail && current && current.pair) counterpart = scById[current.pair] || null;
      if (!managerScreen && current) {
        counterpart = sortedScenarios.filter(function (x) { return x.pair === current.id && x.screen === 'M-06'; })[0] || null;
      }
      // `Làm lại tình huống` chỉ có khi đang ở một tình huống (M-05 xem cả danh sách nên không có)
      var resetBtns = (current && !managerList ? '<button id="dm-reset-one" title="' + (lg === 'en' ? 'Clear what was done on this profile' : 'Xóa các thao tác đã làm trên hồ sơ này') + '">' +
          '<i class="bx bx-revision"></i> ' + (lg === 'en' ? 'Restart scenario' : 'Làm lại tình huống') + '</button>' : '') +
        '<button id="dm-reset" class="dm-quiet">' + (lg === 'en' ? 'Reset all' : 'Đặt lại tất cả') + '</button>';

      if (managerDetail) {
        /* Thanh demo của màn chi tiết (chốt lại 04/10/2026): một hàng điều khiển, một dòng `Cần xem`.
           Mỗi tình huống là một giao diện ở một ngày; ◀ ▶ đi lần lượt hết danh sách, bộ đếm cho biết đang ở đâu. */
        var pos = current ? detailList.indexOf(current) : -1;
        bar.innerHTML =
          '<div class="dm-row">' +
            '<span class="dm-tag"><i class="bx bx-slider-alt"></i> ' + (lg === 'en' ? 'Demo mode' : 'Chế độ demo') + '</span>' +
            '<button id="dm-prev" aria-label="' + (lg === 'en' ? 'Previous scenario' : 'Tình huống trước') + '"' + (pos <= 0 ? ' disabled' : '') + '>' +
              '<i class="bx bx-chevron-left"></i></button>' +
            scenarioControl +
            '<button id="dm-next" aria-label="' + (lg === 'en' ? 'Next scenario' : 'Tình huống tiếp theo') + '"' + (pos >= detailList.length - 1 ? ' disabled' : '') + '>' +
              '<i class="bx bx-chevron-right"></i></button>' +
            '<span class="dm-count">' + (pos >= 0 ? (pos + 1) + '/' + detailList.length : '') + '</span>' +
            '<span class="dm-seen">' + (lg === 'en' ? 'Viewed ' : 'Đã xem ') + detailList.filter(function (x) { return seenList().indexOf(x.id) >= 0; }).length +
              '</span>' +
            '<button id="dm-seen-clear" class="dm-quiet" title="' + (lg === 'en' ? 'Clear the viewed marks to review again' : 'Xóa dấu đã xem để review lại từ đầu') + '">' +
              (lg === 'en' ? 'Clear viewed' : 'Xóa dấu đã xem') + '</button>' +
            '<span class="dm-date">' + fmtDate(s.date, lg) + '</span>' +
            '<div class="dm-spacer"></div>' +
            '<button id="dm-pair"><i class="bx bx-transfer"></i> ' + (lg === 'en' ? 'Employee side' : 'Xem phía Nhân viên') + '</button>' +
            resetBtns +
            '<button id="dm-hide"><i class="bx bx-chevron-down"></i> ' + (lg === 'en' ? 'Hide (D)' : 'Ẩn (D)') + '</button>' +
          '</div>' +
          (current ? '<div class="dm-hint"><strong>' + (lg === 'en' ? 'What to check:' : 'Cần xem:') + '</strong>' +
            (lg === 'en' ? current.wen : current.wvi) + '</div>' : '');
        bindCommon();
        function go(sc) {
          if (!sc) return;
          S.setSession({ emp: sc.emp, role: sc.role, date: sc.date, scenario: sc.id, from: null });
          freshStart(sc);
          scenarioActs(sc);
          render(); notify('emp');
        }
        bar.querySelector('#dm-prev').addEventListener('click', function () { go(detailList[pos - 1]); });
        bar.querySelector('#dm-seen-clear').addEventListener('click', function () { clearSeen(); render(); });
        bar.querySelector('#dm-next').addEventListener('click', function () { go(detailList[pos < 0 ? 0 : pos + 1]); });
        bar.querySelector('#dm-pair').addEventListener('click', function () {
          // Cùng hồ sơ, cùng ngày, sang màn Nhân viên; nhớ tình huống để quay lại được
          S.setSession({ role: 'nv', emp: s.emp, scenario: counterpart ? counterpart.id : null, from: current ? current.id : null });
          goScreen('E-05');
        });
        syncPad();
        return;
      }

      bar.innerHTML =
        '<div class="dm-row">' +
          '<span class="dm-tag"><i class="bx bx-slider-alt"></i> ' + (lg === 'en' ? 'Demo mode' : 'Chế độ demo') + '</span>' +
          '<label>' + (lg === 'en' ? 'Role' : 'Vai trò') +
            '<select id="dm-role">' + visibleRoles.map(function (r) {
              return '<option value="' + r.key + '"' + (r.key === s.role ? ' selected' : '') + '>' + label(r) + '</option>';
            }).join('') + '</select>' +
          '</label>' +
          scenarioControl +
          '<div class="dm-spacer"></div>' +
          // Màn Nhân viên: quay về đúng tình huống Quản lý đã mở sang, hoặc tình huống Quản lý của cùng hồ sơ
          (!managerScreen && (s.from || counterpart) ? '<button id="dm-pair"><i class="bx bx-transfer"></i> ' +
            (lg === 'en' ? 'Manager side' : 'Xem phía Quản lý') + '</button>' : '') +
          resetBtns +
          '<button id="dm-hide"><i class="bx bx-chevron-down"></i> ' + (lg === 'en' ? 'Hide (D)' : 'Ẩn (D)') + '</button>' +
        '</div>' +
        '<div class="dm-row">' +
          '<label>' + (lg === 'en' ? 'System date' : 'Ngày hệ thống') + '</label>' +
          '<input type="range" id="dm-date" min="0" max="' + MAX_DAYS + '" value="' + dayIndex(s.date) + '">' +
          '<span class="dm-date">' + fmtDate(s.date, lg) + '</span>' +
          '<label>' + (lg === 'en' ? 'Phase' : 'Giai đoạn') + '</label>' +
          '<div class="dm-steps">' + visibleSteps.map(function (st) {
            var state = chipState(st);
            return '<span class="dm-step ' + (state === 'open' ? 'on' : state === 'closed' ? 'past' : '') +
              '" data-step="' + st.key + '" title="' + fmtDate(st.from, lg) + ' - ' + fmtDate(st.to, lg) + '">' +
              (lg === 'en' ? st.en : st.vi) + '</span>';
          }).join('') + '</div>' +
        '</div>' + (managerList ? statusSummary() : '');

      bar.querySelector('#dm-role').addEventListener('change', function (e) {
        // Đổi vai là rời use case đang chọn (MYR-SPEC §2a)
        S.setSession({ role: e.target.value, scenario: null });
        if (goScreen(DEFAULT_SCREEN[e.target.value])) return;
        render(); notify('role');
      });
      bar.querySelector('#dm-date').addEventListener('input', function (e) {
        S.setSession({ date: dayValue(+e.target.value) }); render(); notify('date');
      });
      bar.querySelectorAll('.dm-step').forEach(function (chip) {
        chip.addEventListener('click', function () {
          var st = visibleSteps.filter(function (x) { return x.key === chip.dataset.step; })[0];
          var mid = dayValue(Math.round((dayIndex(st.from) + dayIndex(st.to)) / 2));
          S.setSession({ date: mid }); render(); notify('date');
        });
      });
      bindCommon();
      var pairBtn = bar.querySelector('#dm-pair');
      if (pairBtn) pairBtn.addEventListener('click', function () {
        var back = scById[s.from] || counterpart;
        if (!back) return;
        S.setSession({ role: back.role, emp: back.emp, scenario: back.id, from: null,
          date: s.from && back.emp === s.emp ? s.date : back.date });
        goScreen(back.screen);
      });
      syncPad();

      /* Nút chung của mọi bố cục: chọn tình huống, làm lại tình huống, đặt lại tất cả, ẩn */
      function bindCommon() {
        var sel = bar.querySelector('#dm-emp');
        if (sel) sel.addEventListener('change', onScenario);
        var one = bar.querySelector('#dm-reset-one');
        if (one) one.addEventListener('click', function () {
          // Chỉ xóa thao tác trên hồ sơ đang xem, dữ liệu dựng sẵn giữ nguyên
          var acts = S.acts(s.emp) || {};
          Object.keys(acts).forEach(function (k) { S.clearAct(s.emp, k); });
          render(); notify('reset');
        });
        bar.querySelector('#dm-reset').addEventListener('click', function () {
          // Phiên mới không có ngày: đặt ngày mặc định như lúc dựng thanh (build), không thì thanh demo lỗi khi định dạng ngày
          var go = function () { S.reset(); S.setSession({ date: window.PMSYer.DEFAULT_DATE }); render(); notify('reset'); };
          if (window.PMSUi && window.PMSUi.dialog) {
            window.PMSUi.dialog({
              title: lg === 'en' ? 'Reset all demo data?' : 'Đặt lại toàn bộ dữ liệu demo?',
              text: lg === 'en' ? 'Every action on every profile is cleared and the session returns to its default.'
                : 'Mọi thao tác trên mọi hồ sơ sẽ bị xóa, phiên demo về mặc định.',
              buttons: [{ label: lg === 'en' ? 'Cancel' : 'Hủy', variant: 'quiet' },
                        { label: lg === 'en' ? 'Reset all' : 'Đặt lại tất cả', variant: 'default', act: go }]
            });
          } else if (window.confirm('Đặt lại toàn bộ dữ liệu demo?')) go();
        });
        bar.querySelector('#dm-hide').addEventListener('click', function () { toggle(false); });
      }
    }

    document.body.appendChild(bar);

    var pill = document.createElement('button');
    pill.id = 'pms-demo-pill';
    pill.innerHTML = '<i class="bx bx-slider-alt"></i> Demo';
    pill.addEventListener('click', function () { toggle(true); });
    document.body.appendChild(pill);

    function syncPad() {
      // Chừa đúng chiều cao thanh demo để nội dung không bị che ở màn hẹp
      document.body.style.paddingBottom = bar.classList.contains('hidden')
        ? '' : (bar.offsetHeight + 16) + 'px';
    }
    function toggle(show) {
      bar.classList.toggle('hidden', !show);
      // Viên Demo luôn hiện khi thanh đang ẩn, để mở lại được mà không cần nhớ phím tắt
      pill.classList.toggle('show', !show);
      document.body.classList.toggle('pms-demo-on', show);
      syncPad();
    }
    window.addEventListener('resize', syncPad);

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'd' && e.key !== 'D') return;
      var el = document.activeElement;
      if (el && /input|textarea|select/i.test(el.tagName)) return;
      if (el && el.isContentEditable) return;
      toggle(bar.classList.contains('hidden'));
    });

    if (window.PMSI18n) window.PMSI18n.onChange(function () { render(); notify('lang'); });
    // Thanh demo cũng phải cập nhật khi phiên bị đổi từ nơi khác (deep link, trang gọi setSession)
    S.subscribe(function (reason) { if (reason === 'session' || reason === 'reset' || reason === 'external') render(); });
    render();
    toggle(showDemoOnLoad);
    notify('init');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
