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
  var state = { search: '' };
  // Màn Quản lý dùng cùng 5 mốc nghiệp vụ mà Nhân viên nhìn thấy. Hai bước xử lý
  // nội bộ của HR không thuộc quy trình chấm điểm của ba vai quản lý này.
  var MGR_STEPS = ['self', 'lm', 'lm2', 'hod', 'publish'];

  function role() {
    var r = S.session().role;
    return MGR_ROLES.indexOf(r) >= 0 ? r : 'lm';
  }

  /* ── quy trình và thời gian ───────────────────
     Dùng cùng cấu trúc 5 bước của màn Nhân viên, nhưng danh sách Quản lý không
     gắn domain cá nhân vào từng bước. */
  /* Mọi bước chỉ hiện hạn chót. Ngày bắt đầu của cả kỳ đưa lên tiêu đề dải (ENH-E14). */
  function stepDate(st) {
    return L('Hạn chót ', 'Due ') + Y.fmt(st.to, lg());
  }

  function stepItems() {
    var s = S.session();
    return window.PMS_YER_TIMELINE.steps
      .filter(function (st) { return MGR_STEPS.indexOf(st.key) >= 0; })
      .map(function (st) {
        var st8 = Y.stepState(st.key, s.date);
        return {
          key: st.key,
          name: lg() === 'en' ? st.en : st.vi,
          domain: '',
          date: stepDate(st),
          state: st8 === 'open' ? 'open' : st8 === 'closed' ? 'done' : 'todo'
        };
      });
  }

  /* Nhãn tab nói việc của vai đang xem trong đúng tình huống demo được chọn.
     Không dùng nguyên văn trạng thái hồ sơ vì cùng một hồ sơ "Chờ Quản lý" sẽ
     mang ý nghĩa hành động khác nhau đối với LM, LM2 và HOD. */
  function managerTabState(p) {
    if (!p) return '';
    var r = role();
    var st = Y.status(p, lg());
    if (st.key === 'published') return L('Đã có kết quả', 'Results available');
    if (st.key === 'out' || st.key === 'resigned' || st.key === 'noeval') return st.label;
    if (r === 'hod' && p.hrbpUpload && !p.hrbpUpload.approved) {
      return L('Cần phê duyệt', 'Approval needed');
    }
    if ((r === 'lm' && p.lm) || (r === 'lm2' && p.lm2) || (r === 'hod' && p.hod)) {
      return L('Đã hoàn thành', 'Completed');
    }
    if (r === 'lm') {
      if (p.self || p.maternity) return L('Cần đánh giá', 'Review needed');
      return st.label;
    }
    if (r === 'lm2') {
      return p.lm ? L('Cần đánh giá', 'Review needed')
                  : L('Chờ QLTT đánh giá', 'Awaiting line manager');
    }
    return p.lm2 ? L('Cần đánh giá', 'Review needed')
                 : L('Chờ Quản lý cấp 2', 'Awaiting second-level manager');
  }

  function syncCycleLabels() {
    var myr = el('cy-1-lbl');
    if (myr) myr.textContent = L('Đã hoàn thành', 'Completed');
    var yer = el('cy-2-lbl');
    if (yer) yer.textContent = managerTabState(Y.profile(S.session().emp, S.session().date));
  }

  /* ── danh sách ───────────────────────────────────────── */
  function rosterRank(p) {
    // LWD luôn là nhóm cuối cùng theo rule đã chốt.
    if (p.resignFrom) return 99;
    var key = Y.status(p, lg()).key;
    var review = Y.managerReviewState(role(), p);
    if (key === 'late-upload') return 0;
    // Chỉ ưu tiên trạng thái đang chờ đúng vai hiện tại trong timeline của vai đó.
    if (review.pending && review.stepOpen) {
      if (role() === 'lm' && p.lateSubmission) return 1;
      if (role() === 'lm' && p.maternity) return 2;
      return 3;
    }
    return key === 'published' ? 5 : 4;
  }

  function roster() {
    var s = S.session();
    var list = Y.roster(role(), { now: s.date });
    var q = state.search.trim().toLowerCase();
    if (q) {
      list = list.filter(function (p) {
        return (p.emp.name + ' ' + p.emp.login + ' ' + (p.emp.dept || '')).toLowerCase().indexOf(q) >= 0;
      });
    }
    // Giữ thứ tự ban đầu bên trong từng nhóm ưu tiên để danh sách không nhảy khó theo dõi.
    return list.map(function (p, index) { return { p: p, index: index }; })
      .sort(function (a, b) {
        return rosterRank(a.p) - rosterRank(b.p) || a.index - b.index;
      })
      .map(function (item) { return item.p; });
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
    return '<td><div class="myr-manager">' + esc(person.name) +
      '<span class="er-login">(' + esc(person.login || '') + ')</span></div></td>';
  }

  function colgroupHtml() {
    var r = role();
    function col(width) { return '<col style="width:' + width + '">'; }
    if (r === 'lm') {
      return col('27%') + col('17%') + col('9%') + col('9%') +
        col('9%') + col('9%') + col('10%') + col('10%');
    }
    if (r === 'lm2') {
      return col('20%') + col('15%') + col('15%') + col('8%') +
        col('8%') + col('8%') + col('8%') + col('9%') + col('9%');
    }
    return col('18%') + col('12%') + col('12%') + col('14%') +
      col('7%') + col('7%') + col('7%') + col('7%') + col('8%') + col('8%');
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
    cols.push('<th class="score">' + L('Chức năng', 'Action') + '</th>');
    return '<tr>' + cols.join('') + '</tr>';
  }

  function canAct(p) {
    return Y.managerReviewState(role(), p).canEdit;
  }

  function actionCell(p) {
    var active = canAct(p);
    var review = Y.managerReviewState(role(), p);
    var label = active
      ? (review.submitted ? L('Xem và chỉnh sửa', 'View and edit') : L('Xem và đánh giá', 'View and review'))
      : L('Xem', 'View');
    return '<td class="myr-action-cell"><button type="button" class="myr-action-btn' +
      (active ? ' accent' : '') + '" aria-label="' + esc(label) + '" data-tip="' + esc(label) +
      '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()" data-open-emp="' + esc(p.id) + '">' +
      '<i class="bx ' + (active ? 'bx-edit-alt' : 'bx-show') + '"></i></button></td>';
  }

  function listStatus(p) {
    var st = Y.status(p, lg());
    var key = st.key;
    var label = st.label;

    // Thai sản là thông tin hồ sơ (đã có badge ở cột Nhân viên), không phải trạng thái xử lý.
    // QLTT vẫn cần đánh giá nên cột Trạng thái phải thể hiện đúng action đang chờ.
    if (key === 'maternity' && Y.stepState('lm', p.now) !== 'future') {
      key = 'wait-lm';
      label = L('Chờ QLTT đánh giá', 'Awaiting line manager review');
    } else if (key === 'maternity') {
      label = L('Không yêu cầu Tự đánh giá', 'Self assessment not required');
    } else if (key === 'wait-lm') {
      label = L('Chờ QLTT đánh giá', 'Awaiting line manager review');
    } else if (key === 'late-upload') {
      label = L('Chưa Tự đánh giá', 'Self assessment missing');
    }

    // Giữ nguyên trạng thái quy trình, nhưng chỉ tô hồng khi hồ sơ đang chờ đúng
    // vai hiện tại và timeline của vai đó còn mở. Chờ vai khác hoặc đã hết hạn = xám.
    var review = Y.managerReviewState(role(), p);
    var tone = key === 'late-upload' ? 'danger'
      : (review.pending && review.stepOpen) ? 'incomplete'
      : 'pending';
    return { key: key, label: label, tone: tone };
  }

  function rowHtml(p) {
    var r = role();
    var st = listStatus(p);
    // Dùng resolver chung của model để không làm trống cột Quản lý khi seed nhân viên
    // chưa lặp lại dữ liệu tổ chức. Đây cũng là nguồn dựng actor của timeline/detail.
    var actors = Y.actors(p);
    var cells = ['<td><div class="myr-emp"><div class="myr-emp-info">' +
      '<div class="myr-emp-name">' + esc(p.emp.name) + ' <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' +
      '<div class="myr-emp-meta">' + esc([p.emp.div, p.emp.dept, p.emp.team, p.emp.pos].filter(Boolean).join(' – ')) + '</div>' +
      empTags(p) + '</div></div></td>'];
    if (r === 'lm2' || r === 'hod') cells.push(mgrCell(actors.lm));
    if (r === 'hod') cells.push(mgrCell(actors.lm2));
    cells.push('<td><span class="myr-status ' + st.tone + '">' + esc(st.label) + '</span></td>');
    cells.push('<td class="score">' + scoreCell(p.self && p.self.overall ? p.self.overall.score : null) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.lm && p.lm.overall ? p.lm.overall.score : null, p.lm && p.lm.synced) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.lm2 ? p.lm2.score : null, p.lm2 && p.lm2.synced) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.hod ? p.hod.score : null) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.final ? p.final.score : null) + '</td>');
    cells.push(actionCell(p));
    return '<tr data-emp="' + esc(p.id) + '">' + cells.join('') + '</tr>';
  }

  /* ── dựng panel ──────────────────────────────────────── */
  function shell() {
    var r = role();
    return '' +
      '<div class="yer-mgr-stepper"><div id="yer-mgr-steps"></div></div>' +
      '<div class="role-sw-row yer-mgr-controls" id="yer-mgr-roles">' +
        '<div class="role-main-group">' +
          '<button type="button" class="role-main-btn' + (r === 'lm' ? ' on' : '') + '" data-role="lm">' +
            '<i class="bx bx-user-check"></i><span>Direct reports</span></button>' +
          '<button type="button" class="role-main-btn' + (r !== 'lm' ? ' on' : '') + '" data-scope="indirect">' +
            '<i class="bx bx-sitemap"></i><span>Indirect reports</span></button>' +
        '</div>' +
        '<div class="role-sub-group"' + (r === 'lm' ? ' style="display:none"' : '') + '>' +
          '<span class="role-sub-lbl">' + L('Vai trò:', 'Role:') + '</span>' +
          '<button type="button" class="role-sub-btn' + (r === 'lm2' ? ' on' : '') + '" data-role="lm2">LM2</button>' +
          '<button type="button" class="role-sub-btn' + (r === 'hod' ? ' on' : '') + '" data-role="hod">HOD</button>' +
        '</div>' +
        '<div class="yer-mgr-search"><i class="bx bx-search"></i>' +
          '<input id="yer-mgr-q" placeholder="' + esc(L('Tìm theo tên, domain hoặc phòng ban', 'Search by name, domain or department')) +
          '" value="' + esc(state.search) + '"/></div>' +
      '</div>' +

      '<div class="myr-table-wrap yer-mgr-table-wrap"><table class="myr-table yer-mgr-table yer-role-' + r + '">' +
        '<colgroup id="yer-mgr-colgroup">' + colgroupHtml() + '</colgroup>' +
        '<thead id="yer-mgr-thead">' + headerRow() + '</thead>' +
        '<tbody id="yer-mgr-tbody"></tbody>' +
      '</table></div>';
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
    syncCycleLabels();
    root.innerHTML = shell();
    mountSteps();

    var list = roster();
    var tbody = el('yer-mgr-tbody');
    var colspan = role() === 'lm' ? 8 : role() === 'lm2' ? 9 : 10;
    tbody.innerHTML = list.length
      ? list.map(rowHtml).join('')
      : '<tr><td colspan="' + colspan + '"><div class="myr-empty">' +
        L('Không có nhân viên nào khớp.', 'No employees match.') + '</div></td></tr>';

    bind();
  }

  function bind() {
    var root = el('yer-mgr-root');
    root.querySelectorAll('[data-role]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.role === role()) return;
        U.dirty.guard(function () {
          state.search = '';
          S.setSession({ role: b.dataset.role });
          render();
        });
      });
    });
    var indirect = root.querySelector('[data-scope="indirect"]');
    if (indirect) indirect.addEventListener('click', function () {
      if (role() !== 'lm') return;
      U.dirty.guard(function () {
        state.search = '';
        S.setSession({ role: 'lm2' });
        render();
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
    root.querySelectorAll('#yer-mgr-tbody tr[data-emp]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        S.setSession({ emp: tr.dataset.emp });
        location.href = '../M-06/index.html';
      });
    });
    root.querySelectorAll('[data-open-emp]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        S.setSession({ emp: button.dataset.openEmp });
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
      '.yer-mgr-stepper{background:var(--z50);border:1px solid var(--z200);border-radius:var(--r);padding:14px 16px 12px;margin-bottom:14px}' +
      '.yer-mgr-stepper .stepper-hd{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--z500);display:flex;align-items:center;gap:5px}' +
      '.yer-mgr-stepper .stepper-hd>i{font-size:13px;color:var(--brand)}' +
      '.yer-mgr-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}' +
      '.yer-mgr-controls .role-sub-group{margin-left:0}' +
      '.yer-mgr-search{position:relative;flex:1 1 240px;max-width:320px;margin-left:auto}' +
      '.yer-mgr-search i{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--z400);font-size:15px}' +
      '.yer-mgr-search input{width:100%;height:32px;border:1px solid var(--z200);border-radius:var(--rsm);' +
        'padding:0 10px 0 30px;font-family:inherit;font-size:12.5px;color:var(--z700);outline:none;background:var(--z0)}' +
      '.yer-mgr-search input:focus{border-color:var(--brand);box-shadow:0 0 0 2px var(--brand-ring)}' +
      '.emp-tag-late{background:var(--warn-bg);color:var(--warn);border-color:var(--warn-bd)}' +
      '.yer-sync-tag{display:inline-block;margin-left:5px;font-size:10px;font-weight:600;color:var(--z500);' +
        'border:1px solid var(--z200);border-radius:999px;padding:0 5px;background:var(--z50);white-space:nowrap}' +
      '.yer-mgr-table-wrap{overflow-x:auto}' +
      '.yer-mgr-table{min-width:980px}' +
      '.yer-mgr-table.yer-role-hod{min-width:1080px}' +
      '.yer-mgr-table th:first-child,.yer-mgr-table td:first-child{padding-left:12px}' +
      '.yer-mgr-table .myr-emp-name,.yer-mgr-table .myr-emp-meta{white-space:normal;overflow:visible;text-overflow:clip}' +
      '.yer-mgr-table .myr-status{border-radius:50px;white-space:normal;overflow-wrap:normal;word-break:normal;padding:4px 8px}' +
      '.yer-mgr-table .myr-status.danger{color:var(--err);background:var(--err-bg);border-color:var(--err-bd)}' +
      '.yer-mgr-table .yer-sync-tag{display:block;width:max-content;margin:3px auto 0}' +
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
