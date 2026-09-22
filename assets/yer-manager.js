/* ═══════════════════════════════════════════════════════════
   YER Manager — panel Đánh giá cuối năm của màn Quản lý (M-05)
   Bám đúng ngôn ngữ thiết kế của panel Đánh giá giữa năm trong M-01:
   myr-process, myr-info, role-sw-row, list-toolbar, myr-table.
   Chỉ khác ở phần riêng của kỳ cuối năm và các enhancement 2H2026.
   Spec: YER-SPEC.md (§7 quyền xem, §30 ENH-E01, §33 ENH-E10, §27 ENH-E02)
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var Y, S, I, U;
  function lg() { return I.lang(); }
  function L(vi, en) { return lg() === 'en' ? en : vi; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  function el(id) { return document.getElementById(id); }

  // Vai trò quản lý mà panel này phục vụ. Vai khác thì panel không dựng.
  var MGR_ROLES = ['lm', 'lm2', 'hod'];
  var state = { search: '', showResigned: false };

  function role() {
    var r = S.session().role;
    return MGR_ROLES.indexOf(r) >= 0 ? r : 'lm';
  }

  /* ── quy trình và thời gian ───────────────────
     Quản lý thấy đủ 7 bước, khác màn Nhân viên vốn giấu 2 bước nội bộ của HR. */
  /* Mọi bước chỉ hiện hạn chót. Ngày bắt đầu của cả kỳ đưa lên tiêu đề dải (ENH-E14). */
  function stepDate(st) {
    return L('Hạn chót ', 'Due ') + Y.fmt(st.to, lg());
  }

  function stepItems() {
    var s = S.session();
    var p = Y.profile(s.emp, s.date);
    var who = p ? Y.actors(p) : {};
    return window.PMS_YER_TIMELINE.steps.map(function (st) {
      var st8 = Y.stepState(st.key, s.date);
      var person = who[st.key];
      return {
        key: st.key,
        name: lg() === 'en' ? st.en : st.vi,
        // Bước Công bố kết quả không gắn với một người cụ thể nên không có domain.
        // Bước Tự đánh giá cũng vậy ở màn danh sách: nó là việc của cả danh sách,
        // đặt domain của một người vào đó sẽ sai. Màn chi tiết thì có.
        domain: (st.key === 'self' || !person) ? '' : person.login,
        date: stepDate(st),
        state: st8 === 'open' ? 'open' : st8 === 'closed' ? 'done' : 'todo'
      };
    });
  }

  /* ── tourguide (ENH-E14) ─────────────────────────────── */
  function tourItems() {
    return [
      { sel: '.cy-tabs',
        title: L('Ba tab của một chu kỳ', 'Three tabs, one cycle'),
        text: L('Mục tiêu nhân viên, Đánh giá giữa năm và Đánh giá cuối năm nằm cùng một màn. Nhãn cạnh tên tab cho biết kỳ đó đang ở đâu.',
                'Employee goals, Mid-Year Review and Year-End Review share one screen. The label beside each tab name says where that cycle stands.') },
      { sel: '#yer-mgr-steps',
        title: L('Quy trình và thời gian', 'Process and timeline'),
        text: L('Bấm vào một bước để xem ai thực hiện, việc gì diễn ra và bạn cần làm gì ở bước đó.',
                'Click a step to see who does it, what happens, and what is expected from you.') },
      { sel: '#yer-mgr-roles',
        title: L('Đổi phạm vi xem', 'Switch scope'),
        text: L('Bạn kiêm nhiều vai thì đổi ở đây: nhân viên báo cáo trực tiếp, nhân viên của các Quản lý dưới quyền, hoặc toàn đơn vị.',
                'If you hold several roles, switch here: direct reports, reports of the managers under you, or the whole unit.') },
      { sel: '#yer-mgr-progress',
        title: L('Tỷ lệ hoàn thành', 'Completion rate'),
        text: L('Không tính nhân viên đã có ngày nghỉ việc. Hồ sơ Không đánh giá thì vẫn nằm ở mẫu số.',
                'Employees with a resignation date are excluded. Profiles marked Not evaluated stay in the denominator.') },
      { sel: '#yer-mgr-tbody tr',
        title: L('Bấm một dòng để chấm điểm', 'Click a row to rate'),
        text: L('Mở hồ sơ để xem tự đánh giá của nhân viên và chấm điểm từng mục tiêu, nhận xét, điểm toàn diện.',
                'Open a profile to read the self assessment and enter goal scores, comments and the overall rating.') }
    ];
  }
  function runTour(force) {
    var items = tourItems();
    if (force) U.tour.start(items, { key: 'yer-mgr-' + role() });
    else U.tour.auto(items, { key: 'yer-mgr-' + role() });
  }

  /* ── danh sách ───────────────────────────────────────── */
  function roster() {
    var s = S.session();
    var list = Y.roster(role(), { now: s.date, showResigned: state.showResigned });
    var q = state.search.trim().toLowerCase();
    if (q) {
      list = list.filter(function (p) {
        return (p.emp.name + ' ' + p.emp.login + ' ' + (p.emp.dept || '')).toLowerCase().indexOf(q) >= 0;
      });
    }
    return list;
  }

  function scoreCell(value, synced) {
    if (value == null || value === '') return '<span class="myr-score empty">—</span>';
    var num = Math.abs(value % 1) > 0 ? Number(value).toFixed(1) : String(value);
    return '<span class="myr-score">' + esc(num) + '</span>' +
      (synced ? '<span class="yer-sync-tag" title="' +
        esc(L('Hệ thống tự chép điểm vì quá deadline', 'Copied by the system after the deadline')) +
        '">(HR system)</span>' : '');
  }

  function empTags(p) {
    var tags = [];
    // ENH-E01: hồ sơ đã nộp đơn nghỉ việc phải nhận ra ngay ở danh sách
    if (p.resignFrom && !p.resigned) {
      // LWD = Last Working Day, dùng chung một cách gọi với màn của Nhân viên
      tags.push('<span class="emp-tag emp-tag-resigned" title="' +
        esc(L('Ngày làm việc cuối cùng', 'Last working day')) + '">LWD: ' +
        esc(Y.fmt(p.resignFrom, lg())) + '</span>');
    }
    if (p.resigned) tags.push('<span class="emp-tag emp-tag-resigned">' + L('Đã nghỉ việc', 'Resigned') + '</span>');
    // ENH-E10: thai sản không bắt buộc tự đánh giá
    if (p.maternity) tags.push('<span class="emp-tag emp-tag-maternity">' + L('Đang nghỉ thai sản', 'On maternity leave') + '</span>');
    // ENH-E02: hồ sơ nộp trễ đi theo luồng riêng
    if (p.lateSubmission) tags.push('<span class="emp-tag emp-tag-late">' + L('Nộp trễ hạn', 'Submitted late') + '</span>');
    if (!tags.length) return '';
    return '<div class="myr-emp-tags">' + tags.join('') + '</div>';
  }

  function mgrCell(person) {
    if (!person) return '<td><span class="myr-score empty">—</span></td>';
    return '<td><div class="yer-mgr-cell"><div class="yer-mgr-name">' + esc(person.name) + '</div>' +
      '<div class="yer-mgr-dom">' + esc(person.login || '') + '</div></div></td>';
  }

  function headerRow() {
    var r = role();
    var cols = ['<th>' + L('Nhân viên', 'Employee') + '</th>'];
    if (r === 'lm2' || r === 'hod') cols.push('<th>' + L('Quản lý trực tiếp', 'Line manager') + '</th>');
    if (r === 'hod') cols.push('<th>' + L('Quản lý cấp 2', 'Second-level manager') + '</th>');
    cols.push('<th>' + L('Trạng thái', 'Status') + '</th>');
    cols.push('<th class="score">' + L('Điểm của NV', 'Employee') + '</th>');
    cols.push('<th class="score">' + L('Điểm của QLTT', 'Line manager') + '</th>');
    cols.push('<th class="score">' + L('Điểm của QL cấp 2', 'Second level') + '</th>');
    cols.push('<th class="score">' + L('Điểm của Trưởng đơn vị', 'Head of dept') + '</th>');
    cols.push('<th class="score">' + L('Điểm cuối cùng', 'Final') + '</th>');
    return '<tr>' + cols.join('') + '</tr>';
  }

  function rowHtml(p) {
    var r = role();
    var st = Y.status(p, lg());
    var tone = st.tone === 'done' ? 'completed' : st.tone === 'action' ? 'incomplete' : 'pending';
    var cells = ['<td><div class="myr-emp"><div class="myr-emp-info">' +
      '<div class="myr-emp-name">' + esc(p.emp.name) + ' <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' +
      '<div class="myr-emp-meta">' + esc([p.emp.div, p.emp.dept, p.emp.team, p.emp.pos].filter(Boolean).join(' – ')) + '</div>' +
      empTags(p) + '</div></div></td>'];
    if (r === 'lm2' || r === 'hod') cells.push(mgrCell(p.emp.mgr));
    if (r === 'hod') cells.push(mgrCell(p.emp.mgr2));
    cells.push('<td><span class="myr-status ' + tone + '">' + esc(st.label) + '</span></td>');
    cells.push('<td class="score">' + scoreCell(p.self && p.self.overall ? p.self.overall.score : null) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.lm && p.lm.overall ? p.lm.overall.score : null, p.lm && p.lm.synced) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.lm2 ? p.lm2.score : null, p.lm2 && p.lm2.synced) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.hod ? p.hod.score : null) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.final ? p.final.score : null) + '</td>');
    return '<tr data-emp="' + esc(p.id) + '">' + cells.join('') + '</tr>';
  }

  /* ── dựng panel ──────────────────────────────────────── */
  function shell() {
    var r = role();
    var ROLE_LABEL = {
      lm: [L('Nhân viên báo cáo trực tiếp', 'Direct reports'),
           L('Bạn chấm điểm từng mục tiêu, viết nhận xét và chấm điểm toàn diện cho nhóm này.',
             'You rate each goal, write comments and give an overall rating for this group.')],
      lm2: [L('Nhân viên của Quản lý dưới quyền', 'Reports of your managers'),
            L('Bạn chỉ chấm điểm toàn diện, nhận xét là tùy chọn. Xem được đánh giá của nhân viên và Quản lý trực tiếp để tham khảo.',
              'You give only an overall rating; a comment is optional. You can read the employee and line-manager reviews for reference.')],
      hod: [L('Toàn bộ đơn vị', 'The whole unit'),
            L('Bạn chốt điểm toàn diện ở cấp cuối cùng của đơn vị và duyệt điểm hiệu chuẩn do HRBP tải lên.',
              'You confirm the overall rating at unit level and approve calibration scores uploaded by HRBP.')]
    };
    return '' +
      '<div id="yer-mgr-steps"></div>' +

      '<div class="myr-info"><i class="bx bx-info-circle"></i><span>' +
        L('Điểm toàn diện của bạn không hiển thị cho nhân viên, kể cả sau khi công bố kết quả. Nhân viên chỉ đọc được điểm từng mục tiêu, các ô nhận xét và điểm cuối cùng.',
          'Your overall rating is never shown to the employee, even after publishing. Employees only see goal scores, the comment boxes and the final rating.') +
      '</span></div>' +

      '<div class="role-sw-row" id="yer-mgr-roles">' +
        '<div class="role-main-group">' +
          ['lm', 'lm2', 'hod'].map(function (k) {
            return '<button type="button" class="role-main-btn' + (k === r ? ' on' : '') + '" data-role="' + k + '">' +
              '<i class="bx ' + (k === 'lm' ? 'bx-user-check' : k === 'lm2' ? 'bx-sitemap' : 'bx-buildings') + '"></i>' +
              '<span>' + esc(ROLE_LABEL[k][0]) + '</span></button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="yer-role-guide"><i class="bx bx-bulb"></i><span>' + esc(ROLE_LABEL[r][1]) + '</span></div>' +

      '<div id="yer-mgr-progress"></div>' +

      '<div class="list-toolbar yer-mgr-toolbar">' +
        '<div class="yer-mgr-search"><i class="bx bx-search"></i>' +
          '<input id="yer-mgr-q" placeholder="' + esc(L('Tìm theo tên, domain hoặc phòng ban', 'Search by name, domain or department')) +
          '" value="' + esc(state.search) + '"/></div>' +
        '<label class="yer-mgr-chk"><input type="checkbox" id="yer-mgr-res"' + (state.showResigned ? ' checked' : '') + '/>' +
          esc(L('Hiển thị nhân viên đã nghỉ việc', 'Show resigned employees')) + '</label>' +
        '<button class="btn btn-outline btn-sm yer-mgr-guide" id="yer-mgr-guide"><i class="bx bx-help-circle"></i>' +
          esc(L('Xem hướng dẫn', 'View guide')) + '</button>' +
      '</div>' +

      '<div class="myr-table-wrap"><table class="myr-table">' +
        '<thead id="yer-mgr-thead">' + headerRow() + '</thead>' +
        '<tbody id="yer-mgr-tbody"></tbody>' +
      '</table></div>';
  }

  function progressHtml(list) {
    var c = Y.completion(list);
    return '<div class="yer-prog"><div class="yer-prog-top">' +
        '<span class="yer-prog-lbl">' + L('Tiến độ đánh giá cuối năm 2026', 'Year-End Review 2026 progress') + '</span>' +
        '<span class="yer-prog-num">' + c.done + '/' + c.total + ' ' +
          L('nhân viên đã có điểm của Quản lý trực tiếp', 'employees have a line-manager rating') + '</span>' +
      '</div><div class="yer-prog-bar"><span style="width:' + c.pct + '%"></span></div>' +
      '<div class="yer-prog-note"><i class="bx bx-info-circle"></i>' +
        L('Không tính nhân viên đã có ngày nghỉ việc. Hồ sơ Không đánh giá vẫn nằm ở mẫu số.',
          'Employees with a resignation date are excluded. Profiles marked Not evaluated stay in the denominator.') +
      '</div></div>';
  }

  function mountSteps() {
    var node = el('yer-mgr-steps');
    if (!node) return;
    var opens = Y.fmt(Y.step('self').from, lg());
    U.steps(node, {
      // Ngày bắt đầu kỳ nằm ở tiêu đề, từng bước bên dưới chỉ còn hạn chót
      title: L('Quy trình và Thời gian đánh giá cuối năm 2026 - bắt đầu ' + opens,
               'Year-End Review 2026 process and timeline - opens ' + opens),
      collapseKey: 'yer-mgr',
      items: stepItems()
    });
    node.classList.add('yer-mgr-stepper');
  }

  function render() {
    var root = el('yer-mgr-root');
    if (!root) return;
    if (MGR_ROLES.indexOf(S.session().role) < 0) {
      root.innerHTML = '<div class="yer-mgr-empty"><i class="bx bx-user-x"></i>' +
        L('Vai trò đang chọn không phải Quản lý. Đổi vai ở thanh Chế độ demo để xem màn này.',
          'The selected role is not a manager. Switch role on the demo bar to see this screen.') + '</div>';
      return;
    }
    root.innerHTML = shell();
    mountSteps();

    var list = roster();
    el('yer-mgr-progress').innerHTML = progressHtml(list);

    var tbody = el('yer-mgr-tbody');
    var colspan = role() === 'lm' ? 7 : role() === 'lm2' ? 8 : 9;
    tbody.innerHTML = list.length
      ? list.map(rowHtml).join('')
      : '<tr><td colspan="' + colspan + '"><div class="myr-empty">' +
        L('Không có nhân viên nào khớp.', 'No employees match.') + '</div></td></tr>';

    bind();
    runTour(false);
  }

  function bind() {
    var root = el('yer-mgr-root');
    root.querySelectorAll('.role-main-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.role === role()) return;
        U.dirty.guard(function () { S.setSession({ role: b.dataset.role }); render(); });
      });
    });
    var q = el('yer-mgr-q');
    if (q) q.addEventListener('input', function () {
      state.search = q.value;
      var at = q.selectionStart;
      render();
      var again = el('yer-mgr-q');
      if (again) { again.focus(); again.setSelectionRange(at, at); }
    });
    var res = el('yer-mgr-res');
    if (res) res.addEventListener('change', function () { state.showResigned = res.checked; render(); });
    var gd = el('yer-mgr-guide');
    if (gd) gd.addEventListener('click', function () { runTour(true); });

    root.querySelectorAll('#yer-mgr-tbody tr[data-emp]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        S.setSession({ emp: tr.dataset.emp });
        location.href = '../M-06/index.html';
      });
    });
  }

  /* ── CSS riêng của panel ─────────────────────────────── */
  function injectCss() {
    if (el('yer-mgr-css')) return;
    var st = document.createElement('style');
    st.id = 'yer-mgr-css';
    st.textContent =
      '.yer-mgr-stepper{background:var(--z50);border:1px solid var(--z200);border-radius:var(--r);padding:14px 16px 12px;margin-bottom:12px}' +
      '.yer-mgr-stepper .stepper-hd{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--z500);display:flex;align-items:center;gap:5px}' +
      '.yer-mgr-stepper .stepper-hd>i{font-size:13px;color:var(--brand)}' +
      '.yer-role-guide{display:flex;align-items:flex-start;gap:7px;margin:-2px 0 12px;padding:8px 12px;border:1px solid var(--z200);' +
        'border-radius:var(--rsm);background:var(--z50);font-size:12px;color:var(--z600);line-height:1.5}' +
      '.yer-role-guide i{font-size:15px;color:var(--z400);flex:none;margin-top:1px}' +
      '.yer-prog{border:1px solid var(--z200);border-radius:var(--r);background:var(--z0);padding:12px 14px;margin-bottom:12px}' +
      '.yer-prog-top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:8px}' +
      '.yer-prog-lbl{font-size:12.5px;font-weight:600;color:var(--z900)}' +
      '.yer-prog-num{font-size:12px;color:var(--z600);margin-left:auto}' +
      '.yer-prog-bar{height:6px;border-radius:999px;background:var(--z100);overflow:hidden}' +
      '.yer-prog-bar span{display:block;height:100%;background:var(--brand);border-radius:999px;transition:width .2s ease}' +
      '.yer-prog-note{display:flex;align-items:flex-start;gap:5px;margin-top:8px;font-size:11.5px;color:var(--z500);line-height:1.45}' +
      '.yer-prog-note i{font-size:13px;flex:none;margin-top:1px}' +
      '.yer-mgr-toolbar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:10px}' +
      '.yer-mgr-search{position:relative;flex:1 1 260px;max-width:340px}' +
      '.yer-mgr-search i{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--z400);font-size:15px}' +
      '.yer-mgr-search input{width:100%;height:32px;border:1px solid var(--z200);border-radius:var(--rsm);' +
        'padding:0 10px 0 30px;font-family:inherit;font-size:12.5px;color:var(--z700);outline:none;background:var(--z0)}' +
      '.yer-mgr-search input:focus{border-color:var(--brand);box-shadow:0 0 0 2px var(--brand-ring)}' +
      '.yer-mgr-chk{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--z600);cursor:pointer;white-space:nowrap}' +
      '.yer-mgr-chk input{accent-color:var(--brand);cursor:pointer}' +
      '.yer-mgr-guide{margin-left:auto;white-space:nowrap}' +
      '.emp-tag-late{background:var(--warn-bg);color:var(--warn);border-color:var(--warn-bd)}' +
      '.yer-sync-tag{display:inline-block;margin-left:5px;font-size:10px;font-weight:600;color:var(--z500);' +
        'border:1px solid var(--z200);border-radius:999px;padding:0 5px;background:var(--z50);white-space:nowrap}' +
      '.yer-mgr-cell{min-width:0}' +
      '.yer-mgr-name{font-size:12.5px;font-weight:500;color:var(--z800)}' +
      '.yer-mgr-dom{font-size:11px;color:var(--z500);margin-top:1px}' +
      '.yer-mgr-empty{padding:48px 20px;text-align:center;color:var(--z500);font-size:13px}' +
      '.yer-mgr-empty i{display:block;font-size:30px;color:var(--z300);margin-bottom:8px}' +
      '#yer-mgr-tbody tr[data-emp]{cursor:pointer}';
    document.head.appendChild(st);
  }

  function boot() {
    Y = window.PMSYer; S = window.PMSStore; I = window.PMSI18n; U = window.PMSUi;
    if (!Y || !S || !I || !U) return;
    injectCss();
    var slot = el('lang-slot');
    if (slot && !slot.childElementCount) I.mountToggle(slot);
    I.onChange(render);
    document.addEventListener('pms:demo-change', function () { U.dirty.clear(); render(); });
    U.dirty.watch(document);
    render();
  }

  window.PMSYerManager = { render: render };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
