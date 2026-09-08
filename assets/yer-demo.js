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
      if (sc) { patch.role = sc.role; patch.emp = sc.emp; patch.date = sc.date; }
    }
    if (q.get('role')) patch.role = q.get('role');
    if (q.get('emp')) patch.emp = q.get('emp');
    if (q.get('date')) patch.date = q.get('date');
    if (q.get('lang')) patch.lang = q.get('lang');
    return patch;
  }

  function notify(reason) {
    document.dispatchEvent(new CustomEvent('pms:demo-change', {
      detail: Object.assign({ reason: reason }, window.PMSStore.session())
    }));
  }

  function build() {
    css();
    var S = window.PMSStore;
    var patch = readDeepLink();
    if (!S.session().date) patch.date = patch.date || window.PMSYer.DEFAULT_DATE;
    if (Object.keys(patch).length) S.setSession(patch);

    var bar = document.createElement('div');
    bar.id = 'pms-demo';

    var emps = (window.PMS_EMPLOYEES || []);
    var scenarios = (window.PMS_YER_SCENARIOS || []);

    function lang() { return window.PMSI18n ? window.PMSI18n.lang() : 'vi'; }
    function label(o) { return lang() === 'en' ? o.en : o.vi; }

    function render() {
      var s = S.session();
      var lg = lang();
      var scOf = {};
      scenarios.forEach(function (x) { scOf[x.emp] = x; });

      bar.innerHTML =
        '<div class="dm-row">' +
          '<span class="dm-tag"><i class="bx bx-slider-alt"></i> ' + (lg === 'en' ? 'Demo mode' : 'Chế độ demo') + '</span>' +
          '<label>' + (lg === 'en' ? 'Role' : 'Vai trò') +
            '<select id="dm-role">' + ROLES.map(function (r) {
              return '<option value="' + r.key + '"' + (r.key === s.role ? ' selected' : '') + '>' + label(r) + '</option>';
            }).join('') + '</select>' +
          '</label>' +
          '<label>' + (lg === 'en' ? 'Person' : 'Nhân sự') +
            '<select id="dm-emp">' + emps.map(function (e) {
              var sc = scOf[e.id];
              return '<option value="' + e.id + '"' + (e.id === s.emp ? ' selected' : '') + '>' +
                e.name + (sc ? ' — ' + (lg === 'en' ? sc.en : sc.vi) : '') + '</option>';
            }).join('') + '</select>' +
          '</label>' +
          '<div class="dm-spacer"></div>' +
          '<button id="dm-reset"><i class="bx bx-reset"></i> ' + (lg === 'en' ? 'Reset data' : 'Đặt lại dữ liệu') + '</button>' +
          '<button id="dm-hide"><i class="bx bx-chevron-down"></i> ' + (lg === 'en' ? 'Hide (D)' : 'Ẩn (D)') + '</button>' +
        '</div>' +
        '<div class="dm-row">' +
          '<label>' + (lg === 'en' ? 'System date' : 'Ngày hệ thống') + '</label>' +
          '<input type="range" id="dm-date" min="0" max="' + MAX_DAYS + '" value="' + dayIndex(s.date) + '">' +
          '<span class="dm-date">' + fmtDate(s.date, lg) + '</span>' +
          '<div class="dm-steps">' + window.PMS_YER_TIMELINE.steps.map(function (st) {
            var state = window.PMSYer.stepState(st.key, s.date);
            return '<span class="dm-step ' + (state === 'open' ? 'on' : state === 'closed' ? 'past' : '') +
              '" data-step="' + st.key + '" title="' + fmtDate(st.from, lg) + ' - ' + fmtDate(st.to, lg) + '">' +
              (lg === 'en' ? st.en : st.vi) + '</span>';
          }).join('') + '</div>' +
        '</div>';

      bar.querySelector('#dm-role').addEventListener('change', function (e) {
        S.setSession({ role: e.target.value }); render(); notify('role');
      });
      bar.querySelector('#dm-emp').addEventListener('change', function (e) {
        S.setSession({ emp: e.target.value }); render(); notify('emp');
      });
      bar.querySelector('#dm-date').addEventListener('input', function (e) {
        S.setSession({ date: dayValue(+e.target.value) }); render(); notify('date');
      });
      bar.querySelectorAll('.dm-step').forEach(function (chip) {
        chip.addEventListener('click', function () {
          var st = window.PMSYer.step(chip.dataset.step);
          var mid = dayValue(Math.round((dayIndex(st.from) + dayIndex(st.to)) / 2));
          S.setSession({ date: mid }); render(); notify('date');
        });
      });
      bar.querySelector('#dm-reset').addEventListener('click', function () {
        S.reset(); render(); notify('reset');
      });
      bar.querySelector('#dm-hide').addEventListener('click', function () { toggle(false); });
      syncPad();
    }

    document.body.appendChild(bar);
    document.body.classList.add('pms-demo-on');

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
    syncPad();
    notify('init');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
