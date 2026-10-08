/* ═══════════════════════════════════════════════════════════
   YER Manager — panel Đánh giá cuối năm của màn Quản lý (M-05)
   Bám đúng ngôn ngữ thiết kế của panel Đánh giá giữa năm trong M-01:
   myr-process, myr-info, role-sw-row, list-toolbar (Bộ lọc, Split View), myr-table,
   và LM2, HOD chấm điểm ngay trên lưới kèm duyệt điểm cấp trước, upload điểm.
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
  /* filters: các ô của Bộ lọc; selected: hồ sơ đã tick để duyệt điểm cấp trước (LM2, HOD);
     split, spEmp, spSearch: Split View như tab Giữa năm */
  /* sort: { key, dir: 'asc'|'desc' } khi người dùng bấm tiêu đề cột, null là thứ tự ưu tiên của §47 */
  var state = { filters: null, filterOpen: false, selected: {}, split: false, spEmp: null, spSearch: '', sort: null };
  // Màn Quản lý dùng cùng 5 mốc nghiệp vụ mà Nhân viên nhìn thấy. Hai bước xử lý
  // nội bộ của HR không thuộc quy trình chấm điểm của ba vai quản lý này.
  var MGR_STEPS = ['self', 'lm', 'lm2', 'hod', 'publish'];

  function role() {
    var r = S.session().role;
    return MGR_ROLES.indexOf(r) >= 0 ? r : 'lm';
  }
  /* Câu hướng dẫn gọi tên vai, không dùng `Bạn` (DS §19, cùng ROLE_NAME với M-06); mốc giờ ghi đủ
     `18:00 ngày dd/mm/yyyy` và in đậm khi nằm trong HTML (chốt 04/10/2026) */
  var ROLE_NAME = {
    lm: ['QLTT', 'The line manager'],
    lm2: ['Quản lý cấp 2', 'The second-level manager'],
    hod: ['Trưởng đơn vị', 'The head of department']
  };
  function roleName(r) { return L(ROLE_NAME[r || role()][0], ROLE_NAME[r || role()][1]); }
  // Tên vai đứng giữa câu tiếng Anh viết thường (`the line manager`); đầu câu dùng roleName()
  function roleLow(r) { var n = roleName(r); return lg() === 'en' ? n.charAt(0).toLowerCase() + n.slice(1) : n; }
  // Tên vai viết đủ trong popup xác nhận (Quản lý trực tiếp, Quản lý cấp 2, Trưởng đơn vị)
  function roleFull(r) {
    var k = r || role();
    return k === 'lm' ? L('Quản lý trực tiếp', 'line manager') : k === 'lm2' ? L('Quản lý cấp 2', 'second-level manager') : L('Trưởng đơn vị', 'head of department');
  }
  /* Bố cục chung của mọi popup xác nhận ghi điểm hàng loạt (chị chốt wording 08/10/2026), dùng cho Duyệt điểm cấp trước, Cập nhật
     điểm từ file, Duyệt điểm HRBP upload:
     - Câu dẫn nói hệ thống sẽ làm gì; có người bị ghi đè thì thêm dòng `(m nhân viên sẽ bị ghi đè điểm cũ).` ngay dưới. Ghi đè là hệ
       quả bình thường của thao tác nên nằm trong câu dẫn, không phải lưu ý.
     - Khối `Lưu ý` (khung vàng) chỉ dành cho điểm vượt điểm trần (§27.3), ô tick nằm trong chính khối đó và là việc duy nhất phải
       xác nhận. Không có điểm vượt thì không có khối.
     source: nguồn điểm trong câu (`của Quản lý trực tiếp`, `HRBP upload`, `trong file`); en: nguồn điểm tiếng Anh. */
  function applyLead(source, en, replaced) {
    return '<p class="yer-approve-lead">' +
      L('Hệ thống sẽ áp dụng điểm ' + source + ' làm điểm của ' + roleFull() + '.',
        'The system will apply the ' + en + ' rating as the ' + roleFull() + ' rating.') +
      (replaced ? '<span class="yer-approve-sub">' + L('(' + replaced + ' nhân viên sẽ bị ghi đè điểm cũ).',
        '(' + replaced + ' employee' + (replaced === 1 ? '' : 's') + ' will have the previous rating overwritten).') + '</span>' : '') +
      '</p>';
  }
  // over: [{ p, score }] là các điểm sắp ghi cao hơn điểm trần của hồ sơ nộp bổ sung
  function capBlock(over, ackId) {
    if (!over.length) return '';
    var m = Y.lateMeasure(over[0].p);
    var cap = Number(m.cap).toFixed(1);
    // Một người thì câu tick nói rõ số điểm giữ lại; nhiều người thì nói số người (chị chốt 08/10/2026, tình huống demo hod08)
    var ackText = over.length === 1
      ? L('Xác nhận giữ ' + numText(over[0].score) + ' điểm', 'Confirm keeping ' + numText(over[0].score))
      : L('Xác nhận giữ điểm của ' + over.length + ' nhân viên trên', 'Confirm keeping the ratings of these ' + over.length + ' employees');
    return '<div class="yer-cm-cap yer-note-box"><i class="bx bx-error"></i><div>' +
      '<strong class="yer-note-hd">' + L('Lưu ý', 'Note') + '</strong>' +
      '<p class="yer-note-tx">' + L('Theo quy định, nhân viên hoàn thành Tự đánh giá trễ hạn và nộp bổ sung ở lần nhắc thứ ' + m.round +
          ' sẽ giới hạn điểm toàn diện tối đa ' + cap + '. Nhân viên sau đây đang vượt điểm trần:',
        'Under policy, employees who completed the self assessment late at reminder ' + m.round +
          ' have the overall rating capped at ' + cap + '. These employees are above the cap:') + '</p>' +
      '<ul class="yer-cap-list">' + over.map(function (r) {
        return '<li><strong>' + esc(r.p.emp.name) + '</strong> <span class="er-login">(' + esc(r.p.emp.login) + ')</span>: ' +
          '<strong>' + esc(numText(r.score)) + '</strong>' + L(' điểm', '') + '</li>';
      }).join('') + '</ul>' +
      '<label class="yer-cap-ack"><input type="checkbox" id="' + ackId + '"><span>' + esc(ackText) + '</span></label>' +
      '</div></div>';
  }
  function at18(d) {
    var t = esc(Y.fmt(d, lg()));
    return L('<strong>18:00 ngày ' + t + '</strong>', '<strong>18:00 on ' + t + '</strong>');
  }

  /* ── quy trình và thời gian ───────────────────
     Dùng cùng cấu trúc 5 bước của màn Nhân viên, nhưng danh sách Quản lý không
     gắn domain cá nhân vào từng bước. */
  /* Mọi bước chỉ hiện hạn chót. Tiêu đề dải không ghi ngày bắt đầu kỳ (bỏ 02/10/2026). */
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


  /* Nhãn hai tab đánh giá nói giai đoạn của kỳ, cùng câu chữ và màu với E-05 và M-06 (§18.4) */
  function syncCycleLabels() {
    var now = S.session().date;
    [['cy-1-lbl', 'myr'], ['cy-2-lbl', 'yer']].forEach(function (pair) {
      var node = el(pair[0]);
      if (!node) return;
      var tab = Y.cycleTabLabel(pair[1], now, lg());
      node.textContent = tab.text;
      node.classList.toggle('yer-past-cycle-label', tab.past);
    });
  }

  /* ── danh sách ───────────────────────────────────────── */
  /* Thứ tự ưu tiên nằm ở model (§47) để luật chỉ viết một lần (DS §20.1). */
  function rosterRank(p) {
    return Y.managerRosterRank(role(), p);
  }

  function blankFilters() {
    return { emp: '', div: '', dept: '', team: '', lm1: '', lm2: '' };
  }

  function has(text, q) { return String(text || '').toLowerCase().indexOf(q.trim().toLowerCase()) >= 0; }
  function personText(person) { return person ? person.name + ' (' + person.login + ')' : ''; }

  function baseRoster() {
    return Y.roster(role(), { now: S.session().date });
  }

  /* Bộ lọc dùng cùng các ô với tab Giữa năm (MYR-SPEC), lọc trên roster đã lọc sẵn theo vai (§47). */
  function roster() {
    var f = state.filters;
    var list = baseRoster().filter(function (p) {
      var a = Y.actors(p);
      if (f.emp.trim() && !has(p.emp.name + ' (' + p.emp.login + ') ' + (p.emp.dept || '') + ' ' + (p.emp.team || ''), f.emp)) return false;
      if (f.div.trim() && !has(p.emp.div, f.div)) return false;
      if (f.dept.trim() && !has(p.emp.dept, f.dept)) return false;
      if (f.team.trim() && !has(p.emp.team, f.team)) return false;
      if (f.lm1.trim() && !has(personText(a.lm), f.lm1)) return false;
      if (f.lm2.trim() && !has(personText(a.lm2), f.lm2)) return false;
      return true;
    });
    // Giữ thứ tự ban đầu bên trong từng nhóm ưu tiên để danh sách không nhảy khó theo dõi.
    list = list.map(function (p, index) { return { p: p, index: index }; })
      .sort(function (a, b) {
        return rosterRank(a.p) - rosterRank(b.p) || a.index - b.index;
      })
      .map(function (item) { return item.p; });
    return sortList(list);
  }

  /* ── Sắp xếp theo cột (chốt 02/10/2026) ──────────────────
     Bấm tiêu đề cột: lần 1 A → Z (điểm tăng dần), lần 2 Z → A (điểm giảm dần), lần 3 về thứ tự ưu tiên của §47.
     Ô trống (chưa có điểm, chưa có quản lý) luôn nằm cuối dù sắp xếp chiều nào. Cùng giá trị thì giữ thứ tự ưu tiên. */
  function scoreOf(entry) { return entry == null || entry === '' ? null : Number(entry); }
  var SORT_COLS = {
    emp: { text: true, get: function (p) { return p.emp.name; } },
    lm1: { text: true, get: function (p) { var a = Y.actors(p).lm; return a ? a.name : null; } },
    lm2name: { text: true, get: function (p) { var a = Y.actors(p).lm2; return a ? a.name : null; } },
    status: { text: true, get: function (p) { return listStatus(p).label; } },
    self: { get: function (p) { return scoreOf(p.self && p.self.overall ? p.self.overall.score : null); } },
    lm: { get: function (p) { return scoreOf(p.lm && p.lm.overall ? p.lm.overall.score : null); } },
    lm2: { get: function (p) { return scoreOf(p.lm2 ? p.lm2.score : null); } },
    hod: { get: function (p) { return scoreOf(p.hod ? p.hod.score : null); } },
    final: { get: function (p) { return scoreOf(p.final ? p.final.score : null); } }
  };
  function sortList(list) {
    var sort = state.sort, col = sort && SORT_COLS[sort.key];
    if (!col) return list;
    var dir = sort.dir === 'desc' ? -1 : 1;
    return list.map(function (p, index) { return { p: p, index: index, v: col.get(p) }; })
      .sort(function (a, b) {
        var ea = a.v == null || a.v === '', eb = b.v == null || b.v === '';
        if (ea || eb) return (ea - eb) || a.index - b.index;
        var c = col.text ? String(a.v).localeCompare(String(b.v), 'vi', { sensitivity: 'base' }) : a.v - b.v;
        return c * dir || a.index - b.index;
      })
      .map(function (item) { return item.p; });
  }
  function sortTh(key, label, extra, cls) {
    var on = state.sort && state.sort.key === key ? state.sort.dir : '';
    var text = SORT_COLS[key].text;
    var tipText = on === 'asc'
      ? (text ? L('Đang xếp A → Z. Bấm để xếp Z → A', 'Sorted A to Z. Click for Z to A')
              : L('Đang xếp tăng dần. Bấm để xếp giảm dần', 'Sorted ascending. Click for descending'))
      : on === 'desc'
        ? L('Bấm để về thứ tự ưu tiên', 'Click to return to the priority order')
        : (text ? L('Sắp xếp A → Z', 'Sort A to Z') : L('Sắp xếp tăng dần', 'Sort ascending'));
    var icon = on === 'asc' ? 'bx-sort-up' : on === 'desc' ? 'bx-sort-down' : 'bx-sort-alt-2';
    var aria = on === 'asc' ? 'ascending' : on === 'desc' ? 'descending' : 'none';
    return '<th' + (cls ? ' class="' + cls + '"' : '') + ' aria-sort="' + aria + '">' +
      '<button type="button" class="yer-th-sort' + (on ? ' on' : '') + '" data-sort="' + key + '" aria-label="' + esc(label + ': ' + tipText) +
      '" data-tip="' + esc(tipText) + '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()">' +
      '<span>' + label + '</span><i class="bx ' + icon + '"></i></button>' + (extra || '') + '</th>';
  }
  function toggleSort(key) {
    var cur = state.sort && state.sort.key === key ? state.sort.dir : '';
    state.sort = cur === '' ? { key: key, dir: 'asc' } : cur === 'asc' ? { key: key, dir: 'desc' } : null;
    var thead = el('yer-mgr-thead');
    if (thead) { thead.innerHTML = headerRow(); bindHead(); }
    refreshRows();
  }
  // Tiêu đề bảng: nút sắp xếp và ô chọn tất cả. Dựng lại tiêu đề khi đổi chiều sắp xếp thì gắn lại.
  function bindHead() {
    document.querySelectorAll('#yer-mgr-thead [data-sort]').forEach(function (b) {
      b.addEventListener('click', function () { hideTip(); toggleSort(b.dataset.sort); });
    });
    var all = el('yer-mgr-all');
    if (all) all.addEventListener('change', function () {
      document.querySelectorAll('#yer-mgr-tbody [data-check-emp]:not(:disabled)').forEach(function (box) {
        box.checked = all.checked;
        if (all.checked) state.selected[box.dataset.checkEmp] = true;
        else delete state.selected[box.dataset.checkEmp];
      });
      syncBulk();
    });
  }

  function numText(value) {
    return Math.abs(value % 1) > 0 ? Number(value).toFixed(1) : String(value);
  }

  // `(HR system)` là chữ thường trong ngoặc, không viền, không nền (chốt 30/09/2026)
  /* (HR system): quá hạn của một cấp mà cấp đó không đánh giá thì hệ thống tự lấy điểm của cấp trước (§6).
     Rê chuột vào nhãn để đọc giải thích. */
  function syncTag() {
    var text = L('Quá hạn mà cấp này không đánh giá nên hệ thống tự lấy điểm của cấp trước, không kèm nhận xét.',
      'This level did not rate before its deadline, so the system copied the previous level rating, without a comment.');
    return '<span class="yer-sync-tag" tabindex="0" aria-label="' + esc(text) + '" data-tip="' + esc(text) +
      '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()">(HR system)</span>';
  }

  /* p: hồ sơ, truyền vào ở các cột điểm của cấp quản lý để đánh dấu điểm cao hơn mức tối đa theo hình thức
     xử lý (§27.3). Chỉ là cảnh báo, hệ thống không chặn điểm. */
  function capMark(p, value) {
    if (!p || !Y.overRatingCap(p, value)) return '';
    var text = Y.lateMeasureText(p, lg());
    return '<i class="bx bx-error yer-cap-mark" role="img" aria-label="' + esc(text) + '" data-tip="' + esc(text) +
      '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()"></i>';
  }

  /* Số điểm luôn nằm đúng giữa hàng ở mọi cột: nhãn (HR system) treo dưới số, icon cảnh báo treo bên phải số,
     cả hai đặt tuyệt đối nên không đẩy số lệch lên hay lệch sang (chốt 30/09/2026). */
  function scoreCell(value, synced, p) {
    if (value == null || value === '') return '<span class="myr-score empty">—</span>';
    return '<span class="yer-sc"><span class="myr-score">' + esc(numText(value)) + '</span>' + capMark(p, value) +
      (synced ? syncTag() : '') + '</span>';
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
    // Hết mọi lần nhắc mà không nộp bổ sung, đủ mục tiêu: QLTT vẫn chấm, cột điểm NV trống (chốt 02/10/2026)
    var st = Y.status(p, 'vi');
    if (st.noSelf && p.lateWindowOpen === false && Y.cmp(p.now, Y.step('self').to) > 0)
      tags.push('<span class="emp-tag emp-tag-noself">' + L('Không tự đánh giá', 'No self assessment') + '</span>');
    // Hết timeline HOD mà HOD không chấm: hồ sơ vẫn đi tiếp (chị chốt 08/10/2026)
    if (st.noHod) tags.push('<span class="emp-tag emp-tag-noself">' + L('Không có điểm HOD', 'No HOD rating') + '</span>');
    if (!tags.length) return '';
    return '<div class="myr-emp-tags">' + tags.join('') + '</div>';
  }

  /* Bộ phận và vị trí chỉ một dòng, dài quá cột thì `...`, rê chuột xem đủ (chị chốt 05/10/2026, như tab Giữa năm) */
  function empMeta(p) {
    var text = [p.emp.div, p.emp.dept, p.emp.team, p.emp.pos].filter(Boolean).join(' – ');
    return '<div class="myr-emp-meta" data-tip="' + esc(text) + '" onmouseenter="if(this.scrollWidth>this.clientWidth)tip(this,this.dataset.tip)"' +
      ' onmouseleave="hideTip()">' + esc(text) + '</div>';
  }

  function mgrCell(person) {
    if (!person) return '<td><span class="myr-score empty">—</span></td>';
    return '<td><div class="myr-manager">' + esc(person.name) +
      '<span class="er-login">(' + esc(person.login || '') + ')</span></div></td>';
  }

  /* LM2 và HOD chấm ngay trên lưới như tab Giữa năm: có cột chọn để duyệt hàng loạt. */
  function gridRole() { return role() === 'lm2' || role() === 'hod'; }

  /* Tên cột nằm trong tối đa hai dòng ở màn 1440 (chị chốt 05/10/2026): cột Nhân viên hẹp lại, cột Điểm của Trưởng đơn vị
     đủ rộng cho `Trưởng đơn vị` một dòng, ⓘ đứng ngay sau tên cột. Cột Trạng thái đủ rộng cho trạng thái dài nhất
     (`Không yêu cầu Tự đánh giá`) nằm một dòng. */
  function colgroupHtml() {
    var r = role();
    function col(width) { return '<col style="width:' + width + '">'; }
    if (r === 'lm') {
      return col('21%') + col('15%') + col('10%') + col('10%') +
        col('11%') + col('12%') + col('11%') + col('10%');
    }
    if (r === 'lm2') {
      return col('3%') + col('14%') + col('11%') + col('15%') + col('9%') +
        col('9%') + col('10%') + col('12%') + col('9%') + col('8%');
    }
    return col('3%') + col('12%') + col('9%') + col('10%') + col('15%') + col('7%') +
      col('8%') + col('8%') + col('13%') + col('8%') + col('7%');
  }

  /* ⓘ ở tiêu đề cột điểm của chính vai (LM2, HOD): chấm và sửa được tới khi nào (§8.3, chốt 30/09/2026) */
  function rateInfo() {
    var win = Y.managerEditWindow(role(), { now: S.session().date });
    var from = Y.fmt(win.from, lg()), to = Y.fmt(win.to, lg());
    var R = roleName();
    var text = win.state === 'open'
      ? L('Bấm vào ô điểm để chấm điểm và ghi nhận xét toàn diện. Muốn sửa thì bấm lại ô đó: ' + R + ' chỉnh sửa được nhiều lần tới hết 18:00 ngày ' + to + ', mỗi lần lưu đều có trong lịch sử chỉnh sửa. Sau đó điểm chỉ còn để xem.',
          'Click the rating cell to rate and add an overall comment. Click it again to edit: ' + roleLow() + ' can edit as often as needed until 18:00 on ' + to + ', and every save is kept in the edit history. After that ratings are read-only.')
      : win.state === 'future'
        ? L('Bước đánh giá của ' + R + ' mở từ ' + from + ' tới hết 18:00 ngày ' + to + '.',
            R + ' can rate from ' + from + ' until 18:00 on ' + to + '.')
        : L('Bước đánh giá của ' + R + ' đã kết thúc lúc 18:00 ngày ' + to + ', điểm chỉ còn để xem.',
            'The review step of ' + roleLow() + ' ended at 18:00 on ' + to + '; ratings are read-only.');
    return ' <i class="bx bx-info-circle yer-th-info" tabindex="0" role="img" aria-label="' + esc(text) + '" data-tip="' + esc(text) +
      '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()" onfocus="tip(this,this.dataset.tip)" onblur="hideTip()"></i>';
  }

  function headerRow() {
    var r = role();
    var cols = [];
    if (gridRole()) {
      cols.push('<th class="myr-check-cell"><input id="yer-mgr-all" class="myr-row-check" type="checkbox" aria-label="' +
        esc(L('Chọn tất cả nhân viên đủ điều kiện', 'Select all eligible employees')) + '" title="' +
        esc(L('Chọn tất cả nhân viên đủ điều kiện', 'Select all eligible employees')) + '"></th>');
    }
    cols.push(sortTh('emp', L('Nhân viên', 'Employee')));
    if (r === 'lm2' || r === 'hod') cols.push(sortTh('lm1', L('Quản lý trực tiếp', 'Line manager')));
    if (r === 'hod') cols.push(sortTh('lm2name', L('Quản lý cấp 2', 'Second-level manager')));
    cols.push(sortTh('status', L('Trạng thái', 'Status')));
    cols.push(sortTh('self', L('Điểm của NV', 'Employee'), '', 'score'));
    cols.push(sortTh('lm', L('Điểm của QLTT', 'Line manager'), '', 'score'));
    cols.push(sortTh('lm2', L('Điểm của QL cấp 2', 'Second level'), r === 'lm2' ? rateInfo() : '', 'score'));
    cols.push(sortTh('hod', L('Điểm của Trưởng đơn vị', 'Head of dept'), r === 'hod' ? rateInfo() : '', 'score'));
    cols.push(sortTh('final', L('Điểm cuối cùng', 'Final'), '', 'score'));
    cols.push('<th class="score">' + L('Chức năng', 'Action') + '</th>');
    return '<tr>' + cols.join('') + '</tr>';
  }

  function canAct(p) {
    return Y.managerReviewState(role(), p).canEdit;
  }

  /* Nút ở cột Chức năng màu xám, chỉ AI Summary mang màu nhấn (chốt 30/09/2026).
     QLTT chấm ở màn chi tiết nên nút là bút (đánh giá, sửa) hoặc mắt (xem). LM2, HOD chấm ngay ở ô điểm
     trên lưới, nên nút chỉ còn một nghĩa: xem chi tiết đánh giá. */
  function actionBtn(p) {
    var active = canAct(p);
    var label, icon;
    if (gridRole()) {
      label = L('Xem chi tiết đánh giá', 'View review details');
      icon = 'bx-show';
    } else {
      var review = Y.managerReviewState(role(), p);
      // Nút bút nói luôn hạn cuối được sửa, lấy từ cùng helper với màn chi tiết (§8.3)
      var until = active ? L(' (tới ', ' (until ') + Y.fmt(Y.managerEditWindow(role(), p).to, lg()) + ')' : '';
      label = active
        ? (review.submitted ? L('Xem và chỉnh sửa', 'View and edit') : L('Xem và đánh giá', 'View and review')) + until
        : L('Xem', 'View');
      icon = active ? 'bx-edit-alt' : 'bx-show';
    }
    return '<button type="button" class="myr-action-btn" aria-label="' + esc(label) + '" data-tip="' + esc(label) +
      '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()" data-open-emp="' + esc(p.id) + '">' +
      '<i class="bx ' + icon + '"></i></button>';
  }

  function actionCell(p) {
    // Mọi vai có AI Summary ở cột Chức năng khi hồ sơ đã có điểm (QLTT thêm 04/10/2026), rồi nút xem / đánh giá.
    // LM2, HOD không có nút nhận xét riêng: bấm ô điểm là chấm và nhận xét (chốt 30/09/2026)
    return '<td class="myr-action-cell"><div class="yer-mgr-acts">' + aiBtn(p) + actionBtn(p) + '</div></td>';
  }

  /* Trạng thái trên danh sách: cùng câu chữ với tab Đánh giá giữa năm (chốt 30/09/2026).
     Màu theo luật PMSYer.managerStatusTone (chốt 02/10/2026): hồng khi hồ sơ đang chờ đúng vai đang xem và vai đó làm
     được ngay, cùng `Chưa tự đánh giá` trong giai đoạn Tự đánh giá; xanh khi đã công bố; còn lại xám. */
  function listStatus(p) {
    // Nhãn lấy thẳng từ model (bộ trạng thái chốt 08/10/2026, §47); trạng thái `[Vai] đã đánh giá` có tooltip hạn chỉnh sửa
    var st = Y.status(p, lg());
    return { key: st.key, label: st.label, tone: Y.managerStatusTone(role(), p),
      tip: st.editUntil ? L('Còn chỉnh sửa được tới 18:00 ngày ' + Y.fmt(st.editUntil, lg()), 'Still editable until 18:00 on ' + Y.fmt(st.editUntil, lg())) : '' };
  }

  /* ── chấm điểm trên lưới (LM2, HOD) ──────────────────── */
  function myEntry(p) {
    return role() === 'lm2' ? p.lm2 : role() === 'hod' ? p.hod : null;
  }
  function prevScore(p) {
    if (role() === 'lm2') return p.lm && p.lm.overall ? p.lm.overall.score : null;
    if (role() === 'hod') return p.lm2 ? p.lm2.score : null;
    return null;
  }
  // Tên cấp trước trên nút và popup duyệt điểm: viết như tên cột điểm (chị chốt 05/10/2026, thay LM1/LM2)
  function prevLabel() { return role() === 'lm2' ? L('QLTT', 'line manager') : L('QL cấp 2', 'second-level manager'); }

  function lockReason(p) {
    var win = Y.managerEditWindow(role(), p);
    if (win.state === 'future') return L('Mở từ ', 'Opens on ') + Y.fmt(win.from, lg());
    if (win.state === 'closed') return L('Đã hết hạn lúc 18:00 ngày ', 'Closed at 18:00 on ') + Y.fmt(win.to, lg());
    return role() === 'lm2'
      ? L('Chỉ mở sau khi QLTT gửi đánh giá', 'Opens once the line manager submits')
      : L('Chỉ mở sau khi Quản lý cấp 2 lưu điểm', 'Opens once the second-level manager saves a rating');
  }

  var SCORE_OPTIONS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];
  function scoreOptions(selected) {
    var sel = selected == null ? '' : String(selected);
    return (sel ? '' : '<option value="" selected>' + esc(L('Chọn điểm', 'Select')) + '</option>') +
      SCORE_OPTIONS.map(function (v) {
        return '<option value="' + v + '"' + (sel === v ? ' selected' : '') + '>' + v + '</option>';
      }).join('');
  }

  // AI Summary nằm ở cột Chức năng của từng dòng, bấm mới chạy (§14, chốt 30/09/2026)
  function aiBtn(p) {
    if (!p.self && !p.lm) return '';
    var label = L('AI Summary: tóm tắt nhanh đánh giá', 'AI Summary: quick review summary');
    return '<button type="button" class="yer-ai-btn" aria-label="' + esc(label) + '" data-tip="' + esc(label) +
      '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()" data-ai-emp="' + esc(p.id) + '">' +
      '<i class="bx bxs-magic-wand"></i></button>';
  }

  function ratingCell(p) {
    var mine = myEntry(p);
    var blocked = p.stopped || p.resigned;
    var inner;
    if (blocked || (mine && mine.synced)) {
      inner = scoreCell(mine ? mine.score : null, mine && mine.synced);
    } else {
      /* Bấm vào ô là mở popup chấm điểm và nhận xét ngay (chốt 30/09/2026). Muốn sửa thì bấm lại ô này.
         Hết quyền sửa: đã có điểm thì vẫn bấm được để xem ở chế độ chỉ xem, chưa có thì ô khóa. */
      var active = canAct(p);
      var has = mine && mine.score != null;
      var tipText = active
        ? (has ? L('Bấm để sửa điểm và nhận xét toàn diện', 'Click to edit the rating and overall comment')
               : L('Bấm để chấm điểm và nhận xét toàn diện', 'Click to rate and add an overall comment'))
        : lockReason(p) + (has ? L('. Bấm để xem.', '. Click to view.') : '');
      inner = '<button type="button" class="yer-rt-btn' + (has ? '' : ' empty') + (active ? '' : ' ro') + '" data-rate-emp="' + esc(p.id) +
        '" aria-label="' + esc(L('Điểm toàn diện của bạn: ', 'Your overall rating: ') + (has ? numText(mine.score) : L('chưa chấm', 'not rated'))) +
        '" data-tip="' + esc(tipText) + '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()"' +
        (active || has ? '' : ' disabled') + '>' +
        '<span>' + (has ? esc(numText(mine.score)) : esc(L('Chọn điểm', 'Rate'))) + '</span>' +
        (active ? '<i class="bx bx-chevron-down"></i>' : '') + '</button>' +
        (has ? '<span class="yer-sc-mark">' + capMark(p, mine.score) + '</span>' : '');
    }
    return '<div class="yer-rt-cell">' + inner + '</div>';
  }

  function canApprove(p) {
    return gridRole() && canAct(p) && prevScore(p) != null;
  }

  function rowHtml(p) {
    var r = role();
    var st = listStatus(p);
    // Dùng resolver chung của model để không làm trống cột Quản lý khi seed nhân viên
    // chưa lặp lại dữ liệu tổ chức. Đây cũng là nguồn dựng actor của timeline/detail.
    var actors = Y.actors(p);
    var cells = [];
    if (gridRole()) {
      var ok = canApprove(p);
      cells.push('<td class="myr-check-cell"><input class="myr-row-check" type="checkbox" data-check-emp="' + esc(p.id) +
        '" aria-label="' + esc(L('Chọn ', 'Select ') + p.emp.name) + '" title="' +
        esc(ok ? L('Chọn để duyệt điểm', 'Select to approve') : L('Chưa đủ điều kiện duyệt điểm', 'Not eligible for approval')) + '"' +
        (state.selected[p.id] ? ' checked' : '') + (ok ? '' : ' disabled') + '></td>');
    }
    cells.push('<td><div class="myr-emp"><div class="myr-emp-info">' +
      '<div class="myr-emp-name">' + esc(p.emp.name) + ' <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' +
      empMeta(p) +
      empTags(p) + '</div></div></td>');
    if (r === 'lm2' || r === 'hod') cells.push(mgrCell(actors.lm));
    if (r === 'hod') cells.push(mgrCell(actors.lm2));
    cells.push('<td><span class="myr-status ' + st.tone + '"' + (st.tip ? btnTip(st.tip) : '') + '>' + esc(st.label) + '</span></td>');
    cells.push('<td class="score">' + scoreCell(p.self && p.self.overall ? p.self.overall.score : null) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.lm && p.lm.overall ? p.lm.overall.score : null, p.lm && p.lm.synced, p) + '</td>');
    cells.push('<td class="score">' + (r === 'lm2' ? ratingCell(p) : scoreCell(p.lm2 ? p.lm2.score : null, p.lm2 && p.lm2.synced, p)) + '</td>');
    cells.push('<td class="score">' + (r === 'hod' ? ratingCell(p) : scoreCell(p.hod ? p.hod.score : null, false, p)) + '</td>');
    cells.push('<td class="score">' + scoreCell(p.final ? p.final.score : null) + '</td>');
    cells.push(actionCell(p));
    return '<tr data-emp="' + esc(p.id) + '">' + cells.join('') + '</tr>';
  }

  function clock() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  /* Ghi điểm của vai đang xem kèm một dòng lịch sử (§47). source: grid, approve-prev, upload (chỉ để truy vết) */
  function saveMine(p, score, comment, source) {
    var mine = myEntry(p);
    var text = comment != null ? comment : (mine && !mine.synced ? mine.comment || '' : '');
    var at = S.session().date, time = clock();
    // Điểm cao hơn mức tối đa chỉ lưu được sau khi người chấm xác nhận (§27.3); ghi lại để truy vết
    var capConfirmed = Y.overRatingCap(p, score) ? { max: Y.lateMeasure(p).cap, score: score, at: at } : null;
    S.setAct(p.id, role(), { score: score, comment: text, at: at, time: time, source: 'manual', capConfirmed: capConfirmed });
    S.setAct(p.id, role() + 'Log', { items: Y.nextManagerLog(role(), p,
      { at: at, time: time, score: score, comment: text, source: source || 'grid' }) });
  }

  /* Lịch sử chỉnh sửa trong popup, mới nhất ở trên, thu gọn mặc định */
  function historyHtml(p) {
    var items = (role() === 'lm2' ? p.lm2Log : p.hodLog) || [];
    if (!items.length) return '';
    return '<details class="yer-cm-log"><summary><i class="bx bx-history"></i>' +
      L('Lịch sử chỉnh sửa', 'Edit history') + ' (' + items.length + ')</summary><ol>' +
      items.slice().reverse().map(function (it) {
        return '<li><div class="yer-cm-log-hd"><strong>' + esc(Y.fmt(it.at, lg())) + (it.time ? ' ' + esc(it.time) : '') + '</strong> - ' +
          L('Điểm toàn diện: ', 'Overall rating: ') + '<strong>' + esc(numText(it.score)) + '</strong></div>' +
          (it.comment ? '<div class="yer-cm-log-tx">' + esc(it.comment) + '</div>' : '') + '</li>';
      }).join('') + '</ol></details>';
  }

  /* Mọi popup của danh sách YER (M-05) có cùng khung đầu popup (chị chốt 08/10/2026, DS COMPONENTS §16): tiêu đề một dòng nằm
     trong dải đầu popup nền hồng nhạt, viền dưới tách hẳn khỏi nội dung, nội dung có lề đều. Popup AI Summary có khung riêng. */
  function dialog(o) {
    var res = U.dialog(o);
    // U.dialog chỉ nhận một class; thêm class khung chung vào popup vừa mở
    var all = document.querySelectorAll('.pms-dlg');
    if (all.length) all[all.length - 1].classList.add('yer-mgr-dlg');
    return res;
  }

  // Nút chính của popup vừa mở chỉ bấm được khi đã tick ô xác nhận
  function lockUntilAck(ackId) {
    var ovs = document.querySelectorAll('.pms-ov');
    var btn = ovs.length ? ovs[ovs.length - 1].querySelector('.pms-btn-default') : null;
    var ack = el(ackId);
    if (!btn || !ack) return;
    btn.disabled = !ack.checked;
    btn.title = L('Tick xác nhận ở trên để tiếp tục', 'Tick the confirmation above to continue');
    ack.addEventListener('change', function () { btn.disabled = !ack.checked; });
  }

  function findProfile(id) {
    return Y.profile(id, S.session().date);
  }

  /* Popup điểm và nhận xét toàn diện của LM2, HOD. Điểm bắt buộc, nhận xét tùy chọn (§3, §48).
     Mở ngay khi bấm ô điểm trên lưới. Chỉ khi bấm `Xác nhận` điểm mới được ghi (kèm một dòng lịch sử);
     `Hủy`, dấu x hay Esc thì không ghi gì. keep: nội dung đang nhập, giữ lại khi phải mở lại vì chưa chọn điểm. */
  function openComment(p, keep) {
    var mine = myEntry(p) || {};
    var active = canAct(p);
    var draftScore = keep ? keep.score : (mine.synced ? null : mine.score);
    var draftText = keep ? keep.comment : (mine.synced ? '' : mine.comment || '');
    var a = Y.actors(p);
    var who = role() === 'lm2' ? L('Quản lý cấp 2', 'Second-level manager') : L('Trưởng đơn vị', 'Head of department');
    /* Điểm các cấp trước để tham khảo: mỗi người một cột (thẻ), cùng khung: vai, điểm, domain (chốt 30/09/2026) */
    function ref(label, person, value, synced, cap) {
      // Thẻ tham khảo gọn (chị chốt 05/10/2026): dòng trên là vai và domain, dòng dưới là điểm; điểm của cấp quản lý
      // cao hơn mức tối đa có cùng dấu cảnh báo như ở danh sách
      return '<div class="yer-cm-ref"><div class="yer-cm-ref-lbl">' + esc(label) +
        (person && person.login ? ' <span class="yer-cm-ref-dom">- ' + esc(person.login) + '</span>' : '') + '</div>' +
        '<div class="yer-cm-ref-val">' + esc(value != null ? numText(value) : '—') + (cap && value != null ? capMark(p, value) : '') +
        (synced ? syncTag() : '') + '</div></div>';
    }
    var refs = ref(L('Điểm của nhân viên', 'Employee rating'), p.emp, p.self && p.self.overall ? p.self.overall.score : null) +
      ref(L('Điểm của QLTT', 'Line manager rating'), a.lm, p.lm && p.lm.overall ? p.lm.overall.score : null, p.lm && p.lm.synced, true) +
      (role() === 'hod' ? ref(L('Điểm của QL cấp 2', 'Second-level rating'), a.lm2, p.lm2 ? p.lm2.score : null, p.lm2 && p.lm2.synced, true) : '');
    var until = Y.fmt(Y.managerEditWindow(role(), p).to, lg());
    var html =
      '<div class="yer-cm-emp"><span class="yer-cm-emp-lbl">' + L('Nhân viên:', 'Employee:') + '</span> <strong>' + esc(p.emp.name) +
        '</strong> <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' +
      '<div class="yer-cm-refs" style="grid-template-columns:repeat(' + (role() === 'hod' ? 3 : 2) + ',minmax(0,1fr))">' + refs + '</div>' +
      // Hình thức xử lý đứng trên ô chấm điểm để người chấm đọc trước khi chọn (chốt 30/09/2026)
      '<div id="yer-cm-cap" class="yer-cm-cap"></div>' +
      '<div class="yer-cm-score">' +
        '<span class="yer-cm-flbl">' + L('Điểm toàn diện của bạn', 'Your overall rating') +
          (active ? '<span class="yer-req" aria-hidden="true">*</span>' : '') + '</span>' +
        // Cùng component chọn điểm với màn chi tiết: tên mức có màu (§41.2b). Ô Ý nghĩa thang điểm chỉ hiện
        // khi đang chọn điểm; mở lại popup của điểm đã xác nhận thì ẩn cho tới khi đổi điểm.
        '<div id="yer-cm-rating"></div>' +
        '<div id="yer-cm-def" class="yer-cm-def" data-shown="' + (keep || draftScore == null || draftScore === '' ? '1' : '0') + '"></div></div>' +
      '<label class="yer-cm-flbl" for="yer-cm-text">' + L('Nhận xét', 'Comment') + '</label>' +
      '<textarea id="yer-cm-text" class="yer-cm-text" rows="2" maxlength="1000"' + (active ? '' : ' readonly') +
        ' placeholder="' + esc(L('Ghi nhận xét của bạn về kết quả và đóng góp của nhân viên trong năm.',
          'Your comment on the results and contribution of the employee this year.')) + '">' + esc(draftText) + '</textarea>' +
      '<div class="yer-cm-foot">' +
        (active ? '<span class="yer-cm-until"><i class="bx bx-time-five"></i>' +
          L(roleName() + ' được điều chỉnh điểm cho nhân viên tới hết <strong>18:00 ngày ' + esc(until) + '</strong>',
            roleName() + ' can adjust the rating until <strong>18:00 on ' + esc(until) + '</strong>') + '</span>' : '<span></span>') +
        '<span id="yer-cm-count" class="yer-cm-count">' + String(draftText).length + ' / 1000</span></div>' +
      historyHtml(p);
    var cur = { score: draftScore, comment: draftText, ack: !!(keep && keep.ack) };
    // Hồ sơ bị giới hạn điểm 3 (nộp ở lần nhắc thứ 3): nhắc ngay trên ô điểm; vượt mức tối đa thì phải tick xác nhận (§27.3)
    function drawCap() {
      var node = el('yer-cm-cap');
      if (!node) return;
      // Câu có in đậm số ngày trễ hạn và từ khóa hình thức xử lý, dùng chung với M-06 (Y.lateCapNoticeHtml, 04/10/2026)
      var text = Y.lateCapNoticeHtml(p, lg());
      if (!text) { node.innerHTML = ''; return; }
      var cap = Y.ratingCapText(p, cur.score, lg());
      var over = active && Y.overRatingCap(p, cur.score);
      node.innerHTML = '<i class="bx bx-error"></i><div>' + text +
        (over ? '<div class="yer-cap-over">' + esc(cap.over) + '</div>' +
          '<label class="yer-cap-ack"><input type="checkbox" id="yer-cm-cap-ack"' + (cur.ack ? ' checked' : '') + '><span>' + esc(cap.ack) + '</span></label>' : '') +
        '</div>';
      var ack = el('yer-cm-cap-ack');
      if (ack) ack.addEventListener('change', function () { cur.ack = ack.checked; });
    }
    dialog({
      title: active ? L('Đánh giá toàn diện của ', 'Overall review by ') + who : L('Đánh giá toàn diện của bạn', 'Your overall review'),
      className: 'yer-cm-dlg',
      html: html,
      buttons: active ? [
        { label: L('Hủy', 'Cancel'), variant: 'quiet' },
        { label: L('Xác nhận', 'Confirm'), variant: 'default', icon: 'bx-check', act: function () {
            if (cur.score == null || cur.score === '') {
              U.toast(L('Cần chọn điểm toàn diện trước khi lưu', 'Select an overall rating before saving'));
              openComment(p, cur);
              return;
            }
            if (Y.overRatingCap(p, cur.score) && !cur.ack) {
              U.toast(L('Cần tick xác nhận giữ điểm cao hơn mức tối đa', 'Tick the confirmation to keep a rating above the maximum'));
              openComment(p, cur);
              return;
            }
            saveMine(p, Number(cur.score), cur.comment.trim(), 'grid');
            U.toast(L('Đã lưu đánh giá', 'Review saved'));
            refreshRows(true);
          } }
      ] : [{ label: L('Đóng', 'Close'), variant: 'default' }]
    });
    U.rating(el('yer-cm-rating'), {
      step: 'half',
      value: draftScore == null || draftScore === '' ? null : Number(draftScore),
      readonly: !active,
      defInto: '#yer-cm-def',
      onChange: function (v) {
        cur.score = v; cur.ack = false; drawCap();
        var def = el('yer-cm-def');
        if (def) def.dataset.shown = '1';
      }
    });
    drawCap();
    var box = el('yer-cm-text');
    if (box) box.addEventListener('input', function () {
      cur.comment = box.value;
      el('yer-cm-count').textContent = box.value.length + ' / 1000';
    });
  }

  /* AI Summary: nội dung và popup dùng chung với M-06, ở assets/yer-ai.js (§14) */
  function openAi(p) { window.PMSYerAi.openSummary(p); }

  /* ── duyệt điểm cấp trước và upload điểm ─────────────── */
  /* Bảng chọn trong popup (Duyệt điểm cấp trước, Xem trước điểm từ file): khung bảng .myr-table của danh sách,
     cuộn trong khung, tiêu đề bảng đứng yên. cols: [{ label, cls }], rows: chuỗi <tr> đã dựng. */
  function pickTable(cols, rows, check) {
    return '<div class="yer-pick-wrap"><table class="myr-table yer-pick-table"><thead><tr>' +
      (check ? '<th class="myr-check-cell"><input type="checkbox" class="myr-row-check" id="yer-pick-all" aria-label="' +
        esc(L('Chọn tất cả', 'Select all')) + '"></th>' : '') +
      cols.map(function (c) { return '<th' + (c.cls ? ' class="' + c.cls + '"' : '') + '>' + c.label + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function empLine(p) {
    return '<div class="myr-emp-name">' + esc(p.emp.name) + ' <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' + empTags(p);
  }
  function prevSynced(p) { return role() === 'lm2' ? !!(p.lm && p.lm.synced) : !!(p.lm2 && p.lm2.synced); }
  function hasMine(p) { var m = myEntry(p); return !!(m && !m.synced && m.score != null); }
  function myScoreCell(p) { var m = myEntry(p); return scoreCell(m ? m.score : null, m && m.synced, p); }

  /* Duyệt điểm cấp trước (chị chốt lại 07/10/2026, thay popup có sẵn danh sách của 05/10/2026): tick chọn nhân viên trên bảng,
     nút chỉ bấm được khi đã tick, số trên nút là số người đã tick. Bấm nút mở MỘT popup xác nhận: số nhân viên được duyệt,
     và các trường hợp điểm cao hơn mức tối đa của hồ sơ nộp trễ (nếu có) kèm ô tick xác nhận (§27.3). */
  function approveCandidates() { return baseRoster().filter(canApprove); }
  function approveSelected() {
    return approveCandidates().filter(function (p) { return state.selected[p.id]; });
  }

  function openApprove() {
    var picked = approveSelected();
    if (!picked.length) return;
    var prevName = roleFull(role() === 'lm2' ? 'lm' : 'lm2');
    var rows = picked.map(function (p) { return { p: p, score: Number(prevScore(p)) }; });
    var over = rows.filter(function (r) { return Y.overRatingCap(r.p, r.score); });
    // Người đã có điểm của vai đang xem: duyệt là ghi đè điểm đó, nói ở dòng dưới câu dẫn (chị chốt 08/10/2026)
    var replaced = picked.filter(hasMine).length;
    dialog({
      // `Xác nhận duyệt điểm của Quản lý trực tiếp` / `... của Quản lý cấp 2` (chị chốt 08/10/2026)
      title: L('Xác nhận duyệt điểm của ' + prevName, 'Confirm approving the ' + prevName + ' ratings'),
      className: 'yer-pick-dlg',
      html: applyLead('của ' + prevName, prevName, replaced) + capBlock(over, 'yer-approve-cap-ack'),
      buttons: [
        { label: L('Hủy', 'Cancel'), variant: 'quiet' },
        { label: L('Duyệt điểm', 'Approve'), variant: 'default', icon: 'bx-check-double', act: function () { saveApproved(rows); } }
      ]
    });
    if (over.length) lockUntilAck('yer-approve-cap-ack');
  }

  function saveApproved(rows) {
    rows.forEach(function (r) { saveMine(r.p, r.score, null, 'approve-prev'); });
    state.selected = {};
    refreshRows();
    U.toast(L('Đã duyệt điểm ' + prevLabel() + ' cho ' + rows.length + ' nhân viên.',
      'Approved ' + prevLabel() + ' ratings for ' + rows.length + ' employees.'));
  }

  var ROLE_COL = { lm2: 'Điểm LM2', hod: 'Điểm HOD' };
  function csvCell(v) {
    var t = String(v == null ? '' : v);
    return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  }
  function downloadTemplate() {
    var rows = [['Mã nhân viên', 'Họ tên', 'Domain', 'Điểm QLTT', role() === 'hod' ? 'Điểm LM2' : null, ROLE_COL[role()], 'Nhận xét']
      .filter(function (v) { return v !== null; })];
    baseRoster().filter(canAct).forEach(function (p) {
      var mine = myEntry(p);
      var row = [p.id, p.emp.name, p.emp.login, p.lm && p.lm.overall ? p.lm.overall.score : ''];
      if (role() === 'hod') row.push(p.lm2 ? p.lm2.score : '');
      row.push(mine && !mine.synced ? mine.score : '', mine && !mine.synced ? mine.comment || '' : '');
      rows.push(row);
    });
    var blob = new Blob(['﻿' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'YER-2026-' + ROLE_COL[role()].replace(/\s+/g, '-') + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function parseCsv(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (v) { return String(v).trim(); }); });
  }
  /* Đề xuất 3 của góp ý số 5 (chị chốt 05/10/2026, học từ Lattice): chọn file xong chưa ghi điểm ngay mà mở popup xem trước:
     dòng hợp lệ (điểm hiện tại, điểm mới, dấu cảnh báo vượt mức) và dòng lỗi kèm lý do; bấm `Cập nhật` mới ghi.
     Dòng để trống điểm thì bỏ qua, không tính là lỗi. */
  function importFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var rows = parseCsv(String(reader.result || '').replace(/^﻿/, ''));
      var head = (rows.shift() || []).map(function (h) { return h.trim(); });
      var iId = head.indexOf('Mã nhân viên'), iScore = head.indexOf(ROLE_COL[role()]), iCmt = head.indexOf('Nhận xét');
      if (iId < 0 || iScore < 0) {
        U.toast(L('File không đúng mẫu: thiếu cột Mã nhân viên hoặc ' + ROLE_COL[role()], 'Wrong template: missing employee ID or rating column'));
        return;
      }
      var mine = {};
      baseRoster().forEach(function (p) { mine[p.id] = p; });
      var valid = [], errors = [], seen = {};
      rows.forEach(function (r, i) {
        var line = i + 2;
        var raw = String(r[iScore] || '').trim().replace(',', '.');
        if (!raw) return;
        var id = String(r[iId] || '').trim();
        var p = mine[id];
        if (!p) { errors.push(L('Dòng ' + line + ': mã nhân viên ' + id + ' không có trong danh sách của bạn', 'Row ' + line + ': employee ID ' + id + ' is not in your list')); return; }
        if (seen[id]) { errors.push(L('Dòng ' + line + ': trùng mã nhân viên với dòng ' + seen[id], 'Row ' + line + ': same employee ID as row ' + seen[id])); return; }
        seen[id] = line;
        var v = Number(raw);
        if (SCORE_OPTIONS.indexOf(String(v)) < 0) {
          errors.push(L('Dòng ' + line + ': điểm ' + raw + ' của ' + p.emp.name + ' không hợp lệ, cần từ 1 đến 5 theo bước 0.5',
            'Row ' + line + ': rating ' + raw + ' for ' + p.emp.name + ' is invalid, use 1 to 5 in steps of 0.5'));
          return;
        }
        if (!canAct(p)) { errors.push(L('Dòng ' + line + ': ' + p.emp.name + ' - ', 'Row ' + line + ': ' + p.emp.name + ' - ') + lockReason(p)); return; }
        valid.push({ p: p, score: v, comment: iCmt >= 0 ? String(r[iCmt] || '').trim() : null });
      });
      previewUpload(file.name, valid, errors);
    };
    reader.readAsText(file, 'utf-8');
  }

  /* Dòng có điểm và nhận xét giống hệt điểm đang có thì ghi `Không đổi` và không tính vào số cập nhật */
  function unchanged(r) {
    var m = myEntry(r.p);
    return !!(m && !m.synced && Number(m.score) === r.score && (r.comment == null || r.comment === (m.comment || '')));
  }
  function previewUpload(name, valid, errors) {
    var changed = valid.filter(function (r) { return !unchanged(r); });
    var same = valid.length - changed.length;
    var rows = valid.map(function (r) {
      var same = unchanged(r);
      return '<tr><td>' + empLine(r.p) + '</td>' +
        '<td class="score">' + myScoreCell(r.p) + '</td>' +
        '<td class="score">' + scoreCell(r.score, false, r.p) +
          (same ? '<span class="yer-pick-same">' + L('Không đổi', 'Unchanged') + '</span>' : '') + '</td></tr>';
    }).join('');
    var over = changed.filter(function (r) { return Y.overRatingCap(r.p, r.score); });
    var replaced = changed.filter(function (r) { return hasMine(r.p); }).length;
    var n = changed.length;
    // Một popup xác nhận cho cả thao tác, cùng câu chữ với popup Duyệt điểm (chị chốt 08/10/2026)
    dialog({
      title: L('Xác nhận cập nhật điểm từ file', 'Confirm updating ratings from file'),
      className: 'yer-pick-dlg',
      // Câu dẫn, dòng tóm tắt file ngay trên bảng xem trước, dòng lỗi, rồi khối Lưu ý chung
      html: (n ? applyLead('trong file', 'file', replaced) : '') +
        '<p class="yer-pick-lead">' + L('File <strong>' + esc(name) + '</strong>: ' + valid.length + ' dòng hợp lệ' + (same ? ' (' + same + ' dòng không đổi)' : '') +
            (errors.length ? ', ' + errors.length + ' dòng lỗi' : '') + '.',
          'File <strong>' + esc(name) + '</strong>: ' + valid.length + ' valid row' + (valid.length === 1 ? '' : 's') +
            (same ? ' (' + same + ' unchanged)' : '') + (errors.length ? ', ' + errors.length + ' with errors' : '') + '.') + '</p>' +
        (valid.length ? pickTable([
          { label: L('Nhân viên', 'Employee') },
          { label: L('Điểm hiện tại', 'Current'), cls: 'score' },
          { label: L('Điểm mới', 'New'), cls: 'score' }
        ], rows, false) : '') +
        (errors.length ? '<ul class="yer-pick-err">' + errors.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        capBlock(over, 'yer-upload-cap-ack'),
      buttons: n ? [
        { label: L('Hủy', 'Cancel'), variant: 'quiet' },
        { label: L('Cập nhật điểm', 'Update ratings'), variant: 'default', icon: 'bx-upload', act: function () {
            changed.forEach(function (r) { saveMine(r.p, r.score, r.comment, 'upload'); });
            refreshRows();
            U.toast(L('Đã cập nhật điểm cho ' + n + ' nhân viên', 'Updated ' + n + ' employees'));
          } }
      ] : [{ label: L('Đóng', 'Close'), variant: 'quiet' }]
    });
    if (n && over.length) lockUntilAck('yer-upload-cap-ack');
  }

  function openUpload() {
    var sample = baseRoster()[0];
    var win = Y.managerEditWindow(role(), sample || { now: S.session().date });
    var open = win.state === 'open';
    var col = ROLE_COL[role()];
    /* Bố cục theo popup nộp bổ sung của E-05 (chị chốt 05/10/2026): một câu dẫn nói hạn, ba bước trong một khung
       (.yer-flow dùng chung ở yer-ui.js), nút nằm ngay hàng của bước. Không tô hồng thẻ bước hay tên cột để khỏi nhầm
       với nút. Bị khóa thì khối vàng nói lý do đứng đầu popup thay cho câu dẫn. */
    var lead = open
      ? '<p class="yer-up-lead">' + L('Hoàn thành 3 bước dưới đây trước <strong>' + at18(win.to) + '</strong>.',
          'Complete the 3 steps below before <strong>' + at18(win.to) + '</strong>.') + '</p>'
      : '<div class="yer-up-alert locked"><i class="bx bx-lock-alt"></i><span>' + (win.state === 'future'
          ? L('Chưa tới bước đánh giá của ' + roleName() + ' (mở từ ', 'The review step of ' + roleLow() + ' has not opened yet (opens ') + '<strong>' + esc(Y.fmt(win.from, lg())) + '</strong>' +
            L(') nên chưa tải file lên được.', '), so uploading is locked.')
          : L('Bước đánh giá của ' + roleName() + ' đã kết thúc lúc ' + at18(win.to), 'The review step of ' + roleLow() + ' closed at ' + at18(win.to)) +
            L(' nên không tải file lên được nữa.', ', so uploading is locked.')) + '</span></div>';
    function step(no, icon, title, action, note) {
      return '<li class="yer-flow-step">' +
        '<div class="yer-flow-head"><span class="yer-flow-icon" aria-hidden="true"><i class="bx ' + icon + '"></i></span>' +
          '<span class="yer-flow-no">' + L('Bước ', 'Step ') + no + '</span></div>' +
        '<div class="yer-flow-copy"><div class="yer-flow-line"><strong class="yer-flow-title">' + title + '</strong>' + (action || '') + '</div>' +
          (note ? '<span class="yer-flow-note"><i class="bx bx-info-circle"></i>' + note + '</span>' : '') + '</div></li>';
    }
    dialog({
      title: L('Upload điểm đánh giá cuối năm', 'Upload year-end ratings'),
      className: 'yer-up-dlg',
      html: lead +
        '<ol class="yer-flow">' +
          // Một nút tải mẫu là đủ (không tách Excel, CSV như tab Giữa năm)
          step(1, 'bx-download', L('Tải file mẫu có sẵn danh sách nhân viên', 'Download the template with your employee list'),
            '<button type="button" class="btn btn-outline btn-sm" id="yer-up-tpl"><i class="bx bx-download"></i>' + L('Tải file mẫu', 'Download template') + '</button>') +
          step(2, 'bx-edit-alt', L('Điền điểm toàn diện từ 1 đến 5 vào cột ', 'Enter the overall rating from 1 to 5 in the column ') + esc(col),
            '', L('Cột Nhận xét không bắt buộc. Giữ nguyên mã nhân viên và các cột khác.',
              'The Comment column is optional. Keep employee IDs and the other columns unchanged.')) +
          step(3, 'bx-cloud-upload', L('Tải lên file đã điền điểm', 'Upload the completed file'),
            '<button type="button" class="btn btn-outline btn-sm" id="yer-up-file"' + (open ? '' : ' disabled') + '><i class="bx bx-cloud-upload"></i>' +
              L('Chọn file', 'Choose file') + '</button><input type="file" id="yer-up-input" accept=".csv" hidden>') +
        '</ol>',
      buttons: [{ label: L('Đóng', 'Close'), variant: 'quiet' }]
    });
    var tpl = el('yer-up-tpl'), pick = el('yer-up-file'), input = el('yer-up-input');
    if (tpl) tpl.addEventListener('click', downloadTemplate);
    if (pick) pick.addEventListener('click', function () { input.click(); });
    if (input) input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      var ov = input.closest('.pms-ov');
      if (ov) ov.remove();
      importFile(f);
    });
  }

  /* ── Duyệt điểm HRBP upload (HOD, §9; tên cũ: Phê duyệt điểm hiệu chuẩn) ───────────────
     Cùng bố cục với màn của tab Giữa năm (MYR-56): màn phủ toàn vùng nội dung, nút `Duyệt điểm` ở đầu,
     Bộ lọc và Tải xuống, cột `Điểm Upload`. Luật duyệt nằm ở PMSYer.calibrationState. */
  var calib = { selected: {}, filters: { emp: '', lm1: '', lm2: '' }, filterOpen: false, dlOpen: false };

  // Số hồ sơ HOD còn duyệt được: có điểm HRBP tải lên chưa duyệt và còn trong timeline HOD (§9)
  function calibPendingCount() {
    return baseRoster().filter(function (p) { return Y.calibrationState(p).canApprove; }).length;
  }

  function calibRoster() {
    var f = calib.filters;
    return baseRoster().filter(function (p) {
      var a = Y.actors(p);
      if (f.emp.trim() && !has(p.emp.name + ' (' + p.emp.login + ')', f.emp)) return false;
      if (f.lm1.trim() && !has(personText(a.lm), f.lm1)) return false;
      if (f.lm2.trim() && !has(personText(a.lm2), f.lm2)) return false;
      return true;
    }).map(function (p, i) { return { p: p, i: i }; }).sort(function (a, b) {
      // Dòng còn chờ duyệt lên đầu, rồi dòng đã duyệt, rồi dòng không có điểm tải lên
      function rank(p) { var c = Y.calibrationState(p); return c.has ? (c.approved ? 1 : 0) : 2; }
      return rank(a.p) - rank(b.p) || a.i - b.i;
    }).map(function (x) { return x.p; });
  }

  function calibReason(p, c) {
    if (!c.has) return L('Chưa có điểm HRBP tải lên', 'No HRBP upload');
    if (c.approved) return L('Đã duyệt', 'Approved');
    return lockReason(p);
  }

  function calibRowHtml(p) {
    var c = Y.calibrationState(p);
    var a = Y.actors(p);
    var tipText = c.has ? L('Tải lên bởi ', 'Uploaded by ') + c.by + ' - ' + Y.fmt(c.at, lg()) +
      (c.comment ? '. ' + L('Nhận xét: ', 'Comment: ') + c.comment : '') : '';
    var upload = c.has
      ? '<span class="yer-sc"><span class="calib-upload-score" data-tip="' + esc(tipText) + '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()">' +
          esc(numText(c.score)) + '</span>' + capMark(p, c.score) +
        '<span class="yer-calib-meta' + (c.approved ? ' ok' : '') + '">' + (c.approved
          ? L('Đã duyệt', 'Approved')
          // Dưới điểm chỉ ghi người tải lên; thời gian tải xem ở tooltip của điểm (chị chốt 08/10/2026)
          : esc(String(c.by).replace(/^.*\((.*)\)$/, '$1'))) + '</span></span>'
      : '<span class="myr-score empty">—</span>';
    var hodCell = scoreCell(p.hod ? p.hod.score : null, false, p);
    // Nhãn `Khác điểm tải lên` nằm trong khung số như nhãn (HR system) để điểm không bị đẩy lên
    if (c.conflict) hodCell = '<span class="yer-sc">' + hodCell + '<span class="yer-calib-conflict">' + L('Khác điểm tải lên', 'Differs from upload') + '</span></span>';
    return '<tr data-calib-row="' + esc(p.id) + '">' +
      '<td class="myr-check-cell"><input class="myr-row-check" type="checkbox" data-calib-emp="' + esc(p.id) + '" aria-label="' +
        esc(L('Chọn ', 'Select ') + p.emp.name) + '" title="' + esc(c.canApprove ? L('Chọn để duyệt', 'Select to approve') : calibReason(p, c)) + '"' +
        (calib.selected[p.id] ? ' checked' : '') + (c.canApprove ? '' : ' disabled') + '></td>' +
      '<td><div class="myr-emp-info"><div class="myr-emp-name">' + esc(p.emp.name) + ' <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' +
        // Cùng tag với danh sách chính (LWD, thai sản, nộp trễ) và cùng dấu cảnh báo vượt mức ở cột điểm (chị chốt 05/10/2026)
        empMeta(p) + empTags(p) + '</div></td>' +
      mgrCell(a.lm) + mgrCell(a.lm2) +
      '<td class="score">' + scoreCell(p.self && p.self.overall ? p.self.overall.score : null) + '</td>' +
      '<td class="score">' + scoreCell(p.lm && p.lm.overall ? p.lm.overall.score : null, p.lm && p.lm.synced, p) + '</td>' +
      '<td class="score">' + scoreCell(p.lm2 ? p.lm2.score : null, p.lm2 && p.lm2.synced, p) + '</td>' +
      '<td class="score calib-upload-col">' + upload + '</td>' +
      '<td class="score">' + hodCell + '</td>' +
      '<td class="myr-action-cell"><button type="button" class="myr-action-btn" aria-label="' + esc(L('Xem', 'View')) + '" data-tip="' +
        esc(L('Xem', 'View')) + '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()" data-calib-open="' + esc(p.id) + '">' +
        '<i class="bx bx-show"></i></button></td></tr>';
  }

  function calibToolbarHtml() {
    var list = baseRoster();
    var f = calib.filters;
    var n = Object.keys(f).filter(function (k) { return String(f[k]).trim(); }).length;
    function field(key, placeholder, options) {
      return '<input class="f-combo" list="yer-cdl-' + key + '" data-calib-filter="' + key + '" placeholder="' + esc(placeholder) +
        '" value="' + esc(f[key]) + '"><datalist id="yer-cdl-' + key + '">' +
        options.map(function (o) { return '<option value="' + esc(o) + '">'; }).join('') + '</datalist>';
    }
    return '<div class="filter-shell"><div class="filter-toolbar">' +
      '<div class="filter-menu" id="yer-calib-filter">' +
        '<button type="button" class="btn btn-outline btn-sm filter-toggle" id="yer-calib-filter-btn" aria-expanded="' + calib.filterOpen + '">' +
          '<i class="bx bx-filter-alt"></i> ' + L('Bộ lọc', 'Filters') +
          '<span class="filter-count" id="yer-calib-filter-count"' + (n ? '' : ' hidden') + '>' + n + '</span><i class="bx bx-chevron-down"></i></button>' +
        (calib.filterOpen ? '<div class="filter-popover"><div class="filter-popover-grid">' +
          field('emp', L('Nhân viên', 'Employee'), list.map(function (p) { return p.emp.name + ' (' + p.emp.login + ')'; })) +
          field('lm1', L('Quản lý trực tiếp', 'Line manager'), uniq(list.map(function (p) { return personText(Y.actors(p).lm); }))) +
          field('lm2', L('Quản lý cấp 2', 'Second-level manager'), uniq(list.map(function (p) { return personText(Y.actors(p).lm2); }))) +
          '</div><div class="filter-popover-foot"><span class="filter-hint">' + L('Có thể chọn nhiều điều kiện', 'You can combine conditions') + '</span>' +
          '<button type="button" class="filter-clear" id="yer-calib-filter-clear"' + (n ? '' : ' disabled') + '>' + L('Xóa bộ lọc', 'Clear filters') + '</button></div></div>' : '') +
      '</div>' +
      '<div class="filter-menu" id="yer-calib-dl">' +
        // Chỉ icon, rê chuột mới thấy tên nút (chị chốt 08/10/2026)
        '<button type="button" class="btn btn-outline btn-sm filter-toggle yer-icon-btn" id="yer-calib-dl-btn" aria-expanded="' + calib.dlOpen + '"' +
          ' aria-label="' + esc(L('Tải xuống', 'Download')) + '"' + btnTip(L('Tải xuống', 'Download')) + '>' +
          '<i class="bx bx-download"></i></button>' +
        (calib.dlOpen ? '<div class="filter-popover is-single yer-calib-dl-pop">' +
          '<button type="button" class="download-option yer-calib-dl-opt" data-calib-dl="xls"><i class="bx bx-spreadsheet"></i> Excel (.xls)</button>' +
          '<button type="button" class="download-option yer-calib-dl-opt" data-calib-dl="csv"><i class="bx bx-file"></i> CSV (.csv)</button>' +
        '</div>' : '') +
      '</div></div></div>';
  }

  function calibNoteHtml() {
    var win = Y.managerEditWindow('hod', { now: S.session().date });
    var when = win.state === 'open'
      ? L('Trưởng đơn vị duyệt được tới hết ' + at18(win.to) + '. Trong thời gian này HRBP có thể tải lại điểm và Trưởng đơn vị duyệt lại.',
          'The head of department can approve until ' + at18(win.to) + '. HRBP may re-upload in this window and the head of department approves again.')
      : win.state === 'future'
        ? L('Bước Trưởng đơn vị đánh giá mở từ ', 'The head of department step opens on ') + '<strong>' + esc(Y.fmt(win.from, lg())) + '</strong>' + L(' nên chưa duyệt được.', ', so approval is locked.')
        : L('Bước Trưởng đơn vị đánh giá đã kết thúc lúc ' + at18(win.to) + ' nên không duyệt được nữa.', 'The head of department step closed at ' + at18(win.to) + ', so approval is closed.');
    // Nhiều ý thì gạch đầu dòng (DS §19, chốt 04/10/2026); hạn duyệt đứng cuối
    var items = [
      // Hai ý MECE (chị chốt 08/10/2026): cột này là gì, rồi làm gì với nó; hạn duyệt đứng cuối
      L('Cột <strong class="yer-upd">Điểm HRBP upload</strong> là điểm HRBP tải lên thay cho Trưởng đơn vị. Điểm này chỉ trở thành điểm của Trưởng đơn vị sau khi được duyệt.',
        'The <strong class="yer-upd">HRBP upload</strong> column holds the rating HRBP uploaded for the head of department. It becomes the head of department rating only once approved.'),
      L('Tick chọn nhân viên và bấm <strong>Duyệt điểm</strong> để ghi nhận điểm HRBP upload làm điểm của Trưởng đơn vị.',
        'Tick employees and choose <strong>Approve</strong> to record the HRBP upload as the head of department rating.'),
      when
    ];
    return '<div class="calib-info-note yer-calib-info"><i class="bx bx-info-circle"></i>' +
      '<ul class="yer-calib-note-list"><li>' + items.join('</li><li>') + '</li></ul></div>';
  }

  function calibShellHtml() {
    return '<div class="calib-hd">' +
        '<button type="button" class="calib-back" id="yer-calib-back"><i class="bx bx-left-arrow-alt"></i> ' + L('Quay lại', 'Back') + '</button>' +
        '<div class="calib-hd-info"><div class="calib-hd-title">' + L('Duyệt điểm HRBP upload', 'Approve HRBP uploads') + '</div>' +
          '<div class="calib-hd-sub">' + L('Đánh giá cuối năm 2026 - HOD - Indirect reports', 'Year-End Review 2026 - HOD - Indirect reports') + '</div></div>' +
      '</div>' +
      '<div class="calib-body">' + calibNoteHtml() +
        /* Nút Duyệt điểm cùng hàng với Bộ lọc (chị chốt 08/10/2026), cùng kiểu nút Duyệt điểm của danh sách chính: chưa tick thì xám,
           không có số, rê chuột thấy hướng dẫn. Nút nằm ngoài phần dựng lại của hàng công cụ nên giữ được sự kiện bấm. */
        '<div class="calib-toolbar yer-calib-row">' +
          '<button type="button" id="yer-calib-approve" class="btn btn-cta-outline btn-sm yer-btn-off" aria-disabled="true"' + btnTip('') + '>' +
            '<i class="bx bx-check-shield"></i> ' + L('Duyệt điểm', 'Approve') + ' <span id="yer-calib-count" class="myr-bulk-count" hidden></span></button>' +
          '<div id="yer-calib-toolbar" class="yer-calib-tools">' + calibToolbarHtml() + '</div>' +
        '</div>' +
        '<div class="myr-table-wrap"><table class="myr-table yer-calib-table" style="table-layout:fixed"><colgroup>' +
          '<col style="width:3%"><col style="width:18%"><col style="width:12%"><col style="width:12%"><col style="width:7%">' +
          '<col style="width:7%"><col style="width:8%"><col style="width:12%"><col style="width:12%"><col style="width:9%">' +
        '</colgroup><thead><tr>' +
          '<th class="myr-check-cell"><input id="yer-calib-all" class="myr-row-check" type="checkbox" aria-label="' + esc(L('Chọn tất cả', 'Select all')) + '"></th>' +
          '<th>' + L('Nhân viên', 'Employee') + '</th><th>' + L('Quản lý trực tiếp', 'Line manager') + '</th><th>' + L('Quản lý cấp 2', 'Second-level manager') + '</th>' +
          '<th class="score">' + L('Điểm của NV', 'Employee') + '</th><th class="score">' + L('Điểm của QLTT', 'Line manager') + '</th>' +
          '<th class="score">' + L('Điểm của QL cấp 2', 'Second level') + '</th><th class="score calib-upload-col">' + L('Điểm HRBP upload', 'HRBP upload') + '</th>' +
          '<th class="score yer-calib-hod-col">' + L('Điểm của Trưởng đơn vị', 'Head of dept') + '</th><th class="score">' + L('Chức năng', 'Action') + '</th>' +
        '</tr></thead><tbody id="yer-calib-tbody"></tbody></table></div>' +
      '</div>';
  }

  function calibScreen() {
    var node = el('yer-calib-screen');
    if (!node) {
      node = document.createElement('div');
      node.id = 'yer-calib-screen';
      node.className = 'calib-screen';
      node.style.display = 'none';
      document.body.appendChild(node);
    }
    return node;
  }

  function openCalib() {
    calib.selected = {};
    calib.filterOpen = false;
    calib.dlOpen = false;
    var node = calibScreen();
    node.innerHTML = calibShellHtml();
    node.style.display = 'flex';
    bindCalib();
    renderCalibRows();
  }

  function closeCalib() {
    var node = el('yer-calib-screen');
    if (node) node.style.display = 'none';
    calib.filters = { emp: '', lm1: '', lm2: '' };
    renderFilterRow(); // dựng lại nút Duyệt điểm HRBP upload theo số hồ sơ còn chờ duyệt
    refreshRows();
  }

  function renderCalibRows() {
    var tbody = el('yer-calib-tbody');
    if (!tbody) return;
    var list = calibRoster();
    var ids = {};
    list.forEach(function (p) { ids[p.id] = true; });
    Object.keys(calib.selected).forEach(function (id) { if (!ids[id]) delete calib.selected[id]; });
    tbody.innerHTML = list.length ? list.map(calibRowHtml).join('')
      : '<tr><td colspan="10"><div class="myr-empty">' + L('Không có nhân viên nào khớp.', 'No employees match.') + '</div></td></tr>';
    tbody.querySelectorAll('[data-calib-emp]').forEach(function (box) {
      box.addEventListener('change', function () {
        if (box.checked) calib.selected[box.dataset.calibEmp] = true;
        else delete calib.selected[box.dataset.calibEmp];
        syncCalibBulk();
      });
    });
    tbody.querySelectorAll('[data-calib-open]').forEach(function (b) {
      b.addEventListener('click', function () { location.href = detailUrl(b.dataset.calibOpen, false); });
    });
    syncCalibBulk();
  }

  function syncCalibBulk() {
    var boxes = [].slice.call(document.querySelectorAll('#yer-calib-tbody [data-calib-emp]:not(:disabled)'));
    var n = Object.keys(calib.selected).length;
    var btn = el('yer-calib-approve'), cnt = el('yer-calib-count'), all = el('yer-calib-all');
    if (btn) {
      btn.classList.toggle('yer-btn-off', n === 0);
      btn.setAttribute('aria-disabled', n === 0 ? 'true' : 'false');
      btn.dataset.tip = n ? L('Duyệt điểm HRBP upload cho các nhân viên đã chọn', 'Approve the HRBP uploads for the selected employees')
        : L('Tick chọn nhân viên trong danh sách để duyệt điểm HRBP upload', 'Tick employees in the list to approve the HRBP uploads');
    }
    if (cnt) { cnt.hidden = n === 0; cnt.textContent = n || ''; }
    if (all) {
      var on = boxes.filter(function (b) { return b.checked; }).length;
      all.disabled = boxes.length === 0;
      all.checked = boxes.length > 0 && on === boxes.length;
      all.indeterminate = on > 0 && on < boxes.length;
    }
  }

  function renderCalibToolbar() {
    var bar = el('yer-calib-toolbar');
    if (!bar) return;
    bar.innerHTML = calibToolbarHtml();
    bindCalibToolbar();
  }

  /* Một popup xác nhận, cùng câu chữ với popup Duyệt điểm của danh sách chính (chị chốt 08/10/2026). Điểm Trưởng đơn vị đã chấm
     khác điểm tải lên là dòng ghi đè dưới câu dẫn, điểm vượt điểm trần nằm ở khối Lưu ý có ô tick. */
  function approveCalib() {
    var picked = Object.keys(calib.selected).map(findProfile).filter(function (p) {
      return p && Y.calibrationState(p).canApprove;
    });
    if (!picked.length) return;
    // Điểm chấm tay khác điểm tải lên: duyệt là ghi đè, nói ở dòng dưới câu dẫn
    var replaced = picked.filter(function (p) { return Y.calibrationState(p).conflict; }).length;
    var over = picked.map(function (p) { return { p: p, score: Y.calibrationState(p).score }; })
      .filter(function (r) { return Y.overRatingCap(r.p, r.score); });
    dialog({
      title: L('Xác nhận duyệt điểm HRBP upload', 'Confirm approving the HRBP uploads'),
      className: 'yer-pick-dlg',
      html: applyLead('HRBP upload', 'HRBP upload', replaced) + capBlock(over, 'yer-calib-cap-ack'),
      buttons: [
        { label: L('Hủy', 'Cancel'), variant: 'quiet' },
        { label: L('Duyệt điểm', 'Approve'), variant: 'default', icon: 'bx-check-shield', act: function () { applyCalib(picked); } }
      ]
    });
    if (over.length) lockUntilAck('yer-calib-cap-ack');
  }

  function applyCalib(picked) {
    var now = S.session().date;
    picked.forEach(function (p) {
      var c = Y.calibrationState(p);
      var hodComment = c.comment || (p.hod && p.hod.comment) || '', time = clock();
      S.setAct(p.id, 'hod', { score: c.score, comment: hodComment, at: now, time: time, source: 'hrbp-upload',
        capConfirmed: Y.overRatingCap(p, c.score) ? { max: Y.lateMeasure(p).cap, score: c.score, at: now } : null });
      S.setAct(p.id, 'hodLog', { items: Y.nextManagerLog('hod', p, { at: now, time: time, score: c.score, comment: hodComment, source: 'hrbp-upload' }) });
      S.setAct(p.id, 'hrbpUpload', { approved: true, approvedAt: now });
    });
    calib.selected = {};
    renderCalibRows();
    if (picked.length) U.toast(L('Đã duyệt điểm HRBP upload cho ' + picked.length + ' nhân viên.', 'Approved HRBP uploads for ' + picked.length + ' employees.'));
  }

  function downloadCalib(fmt) {
    var head = ['Nhân viên', 'Domain', 'Quản lý trực tiếp', 'Quản lý cấp 2', 'Điểm NV', 'Điểm QLTT', 'Điểm QL cấp 2', 'Điểm HRBP upload', 'Người tải lên', 'Trạng thái duyệt', 'Điểm HOD'];
    var rows = calibRoster().map(function (p) {
      var a = Y.actors(p), c = Y.calibrationState(p);
      return [p.emp.name, p.emp.login, a.lm ? a.lm.name : '', a.lm2 ? a.lm2.name : '',
        p.self && p.self.overall ? p.self.overall.score : '', p.lm && p.lm.overall ? p.lm.overall.score : '',
        p.lm2 ? p.lm2.score : '', c.has ? c.score : '', c.has ? c.by : '',
        c.has ? (c.approved ? 'Đã duyệt' : 'Chờ duyệt') : '', p.hod ? p.hod.score : ''];
    });
    var content, type;
    if (fmt === 'csv') {
      content = '﻿' + [head].concat(rows).map(function (r) { return r.map(csvCell).join(','); }).join('\n');
      type = 'text/csv;charset=utf-8';
    } else {
      // SpreadsheetML 2003: Excel mở trực tiếp, không cần thư viện ngoài
      function xml(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
      content = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>' +
        '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
        '<Worksheet ss:Name="Diem hieu chuan"><Table>' + [head].concat(rows).map(function (r) {
          return '<Row>' + r.map(function (v) {
            return '<Cell><Data ss:Type="' + (typeof v === 'number' ? 'Number' : 'String') + '">' + xml(v) + '</Data></Cell>';
          }).join('') + '</Row>';
        }).join('') + '</Table></Worksheet></Workbook>';
      type = 'application/vnd.ms-excel';
    }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: type }));
    a.download = 'diem-hieu-chuan-yer2026.' + fmt;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function bindCalibToolbar() {
    var fb = el('yer-calib-filter-btn');
    if (fb) fb.addEventListener('click', function (e) { e.stopPropagation(); calib.filterOpen = !calib.filterOpen; calib.dlOpen = false; renderCalibToolbar(); });
    var db = el('yer-calib-dl-btn');
    if (db) db.addEventListener('click', function (e) { e.stopPropagation(); calib.dlOpen = !calib.dlOpen; calib.filterOpen = false; renderCalibToolbar(); });
    document.querySelectorAll('#yer-calib-toolbar [data-calib-filter]').forEach(function (input) {
      input.addEventListener('input', function () {
        calib.filters[input.dataset.calibFilter] = input.value;
        renderCalibRows();
        var n = Object.keys(calib.filters).filter(function (k) { return String(calib.filters[k]).trim(); }).length;
        var badge = el('yer-calib-filter-count'), clear = el('yer-calib-filter-clear');
        if (badge) { badge.textContent = n; badge.hidden = n === 0; }
        if (clear) clear.disabled = n === 0;
      });
    });
    var clear = el('yer-calib-filter-clear');
    if (clear) clear.addEventListener('click', function () {
      calib.filters = { emp: '', lm1: '', lm2: '' };
      renderCalibToolbar();
      renderCalibRows();
    });
    document.querySelectorAll('#yer-calib-toolbar [data-calib-dl]').forEach(function (b) {
      b.addEventListener('click', function () { calib.dlOpen = false; renderCalibToolbar(); downloadCalib(b.dataset.calibDl); });
    });
  }

  function bindCalib() {
    el('yer-calib-back').addEventListener('click', closeCalib);
    el('yer-calib-approve').addEventListener('click', function () { if (!this.classList.contains('yer-btn-off')) approveCalib(); });
    el('yer-calib-all').addEventListener('change', function () {
      var on = el('yer-calib-all').checked;
      document.querySelectorAll('#yer-calib-tbody [data-calib-emp]:not(:disabled)').forEach(function (box) {
        box.checked = on;
        if (on) calib.selected[box.dataset.calibEmp] = true;
        else delete calib.selected[box.dataset.calibEmp];
      });
      syncCalibBulk();
    });
    bindCalibToolbar();
  }

  // Bộ lọc, Tải xuống của màn phê duyệt đóng khi bấm ra ngoài
  document.addEventListener('click', function (e) {
    if (!calib.filterOpen && !calib.dlOpen) return;
    var f = el('yer-calib-filter'), d = el('yer-calib-dl');
    if ((calib.filterOpen && f && !f.contains(e.target)) || (calib.dlOpen && d && !d.contains(e.target))) {
      calib.filterOpen = false; calib.dlOpen = false; renderCalibToolbar();
    }
  });

  /* ── thanh công cụ: duyệt điểm, upload, Bộ lọc, Split View (như tab Giữa năm) ─ */
  function filterCount() {
    var f = state.filters;
    return Object.keys(f).filter(function (k) { return String(f[k]).trim(); }).length;
  }

  function uniq(list) {
    return list.filter(function (v, i) { return v && list.indexOf(v) === i; }).sort(function (a, b) { return a.localeCompare(b, 'vi'); });
  }

  function combo(key, id, placeholder, options) {
    return '<input class="f-combo" list="yer-dl-' + id + '" data-filter="' + key + '" placeholder="' + esc(placeholder) +
      '" value="' + esc(state.filters[key]) + '">' +
      '<datalist id="yer-dl-' + id + '">' + options.map(function (o) { return '<option value="' + esc(o) + '">'; }).join('') + '</datalist>';
  }

  function filterFields() {
    var list = baseRoster();
    var r = role();
    var fields = combo('emp', 'emp', L('Nhân viên', 'Employee'),
      list.map(function (p) { return p.emp.name + ' (' + p.emp.login + ')'; }));
    if (r !== 'lm') {
      fields += combo('div', 'div', 'Division', uniq(list.map(function (p) { return p.emp.div; })));
      fields += combo('dept', 'dept', 'Department', uniq(list.map(function (p) { return p.emp.dept; })));
      if (r === 'lm2') fields += combo('team', 'team', 'Team', uniq(list.map(function (p) { return p.emp.team; })));
      fields += combo('lm1', 'lm1', L('Quản lý trực tiếp', 'Line manager'), uniq(list.map(function (p) { return personText(Y.actors(p).lm); })));
      if (r === 'hod') fields += combo('lm2', 'lm2', L('Quản lý cấp 2', 'Second-level manager'), uniq(list.map(function (p) { return personText(Y.actors(p).lm2); })));
    }
    return fields;
  }

  /* Chỉ HOD có màn phê duyệt điểm HRBP tải lên (§9, MYR-55). Nút chỉ bấm được khi có điểm HRBP tải lên
     còn chờ duyệt, số trên nút là số dòng đó (chốt 30/09/2026). */
  function calibBtnHtml() {
    if (role() !== 'hod') return '';
    var n = calibPendingCount();
    var win = Y.managerEditWindow('hod', { now: S.session().date });
    var why = win.state === 'closed' ? L('Đã hết hạn duyệt ngày ', 'Approval closed on ') + Y.fmt(win.to, lg())
      : win.state === 'future' ? L('Mở từ ', 'Opens on ') + Y.fmt(win.from, lg())
      : L('Chưa có điểm HRBP upload cần duyệt', 'No HRBP upload awaiting approval');
    // Nút khóa cùng một kiểu xám với nút Duyệt điểm cấp trước (.yer-btn-off), rê chuột vẫn thấy lý do (chốt 07/10/2026)
    return '<button type="button" class="btn btn-cta-outline btn-sm' + (n ? '' : ' yer-btn-off') + '" id="yer-mgr-calib"' +
      (n ? '' : ' aria-disabled="true"') + btnTip(n ? L('Duyệt điểm do HRBP upload', 'Approve ratings uploaded by HRBP') : why) + '>' +
      '<i class="bx bx-check-shield"></i> ' + L('Duyệt điểm HRBP upload', 'Approve HRBP uploads') +
      (n ? ' <span class="myr-bulk-count">' + n + '</span>' : '') + '</button>';
  }

  /* Ba nút thao tác hàng loạt cùng một kiểu viền hồng (chị chốt 05/10/2026), rê chuột thấy một câu ngắn nói nút làm gì */
  function btnTip(text) {
    return ' data-tip="' + esc(text) + '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()"';
  }
  function bulkHtml() {
    if (!gridRole()) return '';
    return '<div class="myr-bulk-actions">' +
      // Chưa tick nhân viên thì nút xám, không có số; rê chuột thấy hướng dẫn tick chọn (chốt 07/10/2026). Trạng thái do syncBulk đặt
      '<button type="button" id="yer-mgr-approve" class="btn btn-cta-outline btn-sm myr-bulk-approve yer-btn-off" aria-disabled="true"' +
        btnTip('') + '>' +
        '<i class="bx bx-check-double"></i> ' + L('Duyệt điểm ', 'Approve ') + prevLabel() +
        ' <span id="yer-mgr-approve-count" class="myr-bulk-count" hidden></span></button>' +
      '<button type="button" class="btn btn-cta-outline btn-sm" id="yer-mgr-upload"' +
        btnTip(L('Cập nhật điểm nhiều nhân viên bằng file', 'Update ratings for many employees from a file')) + '><i class="bx bx-upload"></i> ' +
        L('Upload điểm', 'Upload ratings') + '</button>' + calibBtnHtml() + '</div>';
  }

  function filterRowHtml() {
    var n = filterCount();
    var single = role() === 'lm';
    return '<div class="filter-shell"><div class="filter-toolbar">' + bulkHtml() +
      '<div class="filter-menu" id="yer-mgr-filter">' +
        '<button type="button" class="btn btn-outline btn-sm filter-toggle" id="yer-mgr-filter-btn" aria-expanded="' + state.filterOpen + '">' +
          '<i class="bx bx-filter-alt"></i> ' + L('Bộ lọc', 'Filters') +
          '<span class="filter-count" id="yer-mgr-filter-count"' + (n ? '' : ' hidden') + '>' + n + '</span>' +
          '<i class="bx bx-chevron-down"></i></button>' +
        (state.filterOpen ? '<div class="filter-popover' + (single ? ' is-single' : '') + '">' +
          '<div class="filter-popover-grid">' + filterFields() + '</div>' +
          '<div class="filter-popover-foot"><span class="filter-hint">' + L('Có thể chọn nhiều điều kiện', 'You can combine conditions') + '</span>' +
          '<button type="button" class="filter-clear" id="yer-mgr-filter-clear"' + (n ? '' : ' disabled') + '>' + L('Xóa bộ lọc', 'Clear filters') + '</button></div>' +
        '</div>' : '') +
      '</div></div></div>';
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
      '</div>' +
      '<div class="list-toolbar">' +
        '<div id="yer-mgr-filter-row"' + (state.split ? ' style="display:none"' : '') + '>' + filterRowHtml() + '</div>' +
        '<button type="button" class="btn btn-outline btn-sm split-view-btn" id="yer-mgr-split" aria-pressed="' + state.split + '">' +
          '<i class="bx bx-columns"></i>Split View</button>' +
      '</div>' +
      '<div class="myr-table-wrap yer-mgr-table-wrap" id="yer-mgr-list"' + (state.split ? ' style="display:none"' : '') + '>' +
        '<table class="myr-table yer-mgr-table yer-role-' + r + '">' +
        '<colgroup id="yer-mgr-colgroup">' + colgroupHtml() + '</colgroup>' +
        '<thead id="yer-mgr-thead">' + headerRow() + '</thead>' +
        '<tbody id="yer-mgr-tbody"></tbody>' +
      '</table></div>' +
      '<div id="yer-mgr-split-shell"' + (state.split ? '' : ' style="display:none"') + '>' +
        '<div class="sp-shell"><aside class="sp-left">' +
          '<div class="sp-search-bar"><div class="sp-sw"><i class="bx bx-search"></i>' +
            '<input class="sp-si" id="yer-mgr-sp-search" placeholder="' + esc(L('Tìm nhân viên...', 'Search employees...')) + '" value="' + esc(state.spSearch) + '"/></div></div>' +
          '<div class="sp-emp-list" id="yer-mgr-sp-list"></div>' +
          '<div class="sp-foot" id="yer-mgr-sp-foot"></div>' +
        '</aside><section class="sp-right myr-sp-right">' +
          '<div class="sp-toolbar myr-sp-toolbar"><button type="button" class="btn btn-outline btn-sm" id="yer-mgr-sp-full">' +
            '<i class="bx bx-link-external"></i>' + L('Mở toàn trang', 'Open full page') + '</button></div>' +
          '<iframe class="myr-sp-frame" id="yer-mgr-sp-frame" title="' + esc(L('Chi tiết đánh giá của nhân viên', 'Employee review detail')) + '"></iframe>' +
        '</section></div></div>';
  }

  function mountSteps() {
    var node = el('yer-mgr-steps');
    if (!node) return;
    U.steps(node, {
      // Tiêu đề không ghi ngày bắt đầu kỳ (bỏ 02/10/2026), từng bước chỉ ghi hạn chót
      title: L('Quy trình và Thời gian đánh giá cuối năm 2026',
               'Year-End Review 2026 process and timeline'),
      collapseKey: 'yer-mgr',
      items: stepItems()
    });
  }

  function colspan() { return role() === 'lm' ? 8 : role() === 'lm2' ? 10 : 11; }

  /* keepOrder: chấm điểm ngay trên lưới thì dòng đứng yên tại chỗ, không nhảy xuống nhóm đã xong
     trong lúc quản lý đang chấm lần lượt; lần dựng lại kế tiếp mới xếp lại theo §47. */
  function refreshRows(keepOrder) {
    var tbody = el('yer-mgr-tbody');
    if (!tbody) return;
    var list = roster();
    if (keepOrder) {
      var pos = {};
      [].slice.call(tbody.querySelectorAll('tr[data-emp]')).forEach(function (tr, i) { pos[tr.dataset.emp] = i; });
      list.sort(function (a, b) {
        return (a.id in pos ? pos[a.id] : 1e6) - (b.id in pos ? pos[b.id] : 1e6);
      });
    }
    var visible = {};
    list.forEach(function (p) { visible[p.id] = true; });
    Object.keys(state.selected).forEach(function (id) { if (!visible[id]) delete state.selected[id]; });
    tbody.innerHTML = list.length
      ? list.map(rowHtml).join('')
      : '<tr><td colspan="' + colspan() + '"><div class="myr-empty">' +
        L('Không có nhân viên nào khớp.', 'No employees match.') + '</div></td></tr>';
    bindRows();
    syncBulk();
    if (state.split) renderSpList();
  }

  function syncBulk() {
    var boxes = [].slice.call(document.querySelectorAll('#yer-mgr-tbody [data-check-emp]:not(:disabled)'));
    var btn = el('yer-mgr-approve'), cnt = el('yer-mgr-approve-count'), all = el('yer-mgr-all');
    if (btn && gridRole()) {
      // Chỉ bấm được khi đã tick nhân viên trên bảng; số trên nút là số người đã tick, chưa tick thì không có số (07/10/2026)
      var n = approveSelected().length;
      btn.classList.toggle('yer-btn-off', n === 0);
      btn.setAttribute('aria-disabled', n === 0 ? 'true' : 'false');
      btn.dataset.tip = n
        ? L('Duyệt điểm ' + prevLabel() + ' cho các nhân viên đã chọn', 'Approve the ' + prevLabel() + ' ratings for the selected employees')
        : approveCandidates().length
          ? L('Tick chọn nhân viên trong danh sách để duyệt điểm ' + prevLabel(), 'Tick employees in the list to approve the ' + prevLabel() + ' ratings')
          : L('Chưa có nhân viên đủ điều kiện duyệt điểm', 'No employee is eligible for approval yet');
      if (cnt) { cnt.hidden = n === 0; cnt.textContent = n || ''; }
    }
    if (all) {
      var on = boxes.filter(function (b) { return b.checked; }).length;
      all.disabled = boxes.length === 0;
      all.checked = boxes.length > 0 && on === boxes.length;
      all.indeterminate = on > 0 && on < boxes.length;
    }
  }

  function syncFilterBadge() {
    var n = filterCount();
    var badge = el('yer-mgr-filter-count'), clear = el('yer-mgr-filter-clear');
    if (badge) { badge.textContent = n; badge.hidden = n === 0; }
    if (clear) clear.disabled = n === 0;
  }

  function renderFilterRow() {
    var row = el('yer-mgr-filter-row');
    if (!row) return;
    row.innerHTML = filterRowHtml();
    bindFilterRow();
    syncBulk();
  }

  /* ── Split View: danh sách bên trái, M-06 nhúng bên phải (như tab Giữa năm) ─ */
  function detailUrl(id, embedded) {
    return '../M-06/index.html?emp=' + encodeURIComponent(id) + '&tab=yer' + (embedded ? '&embed=1' : '');
  }

  function openEmp(id) {
    S.setSession({ emp: id });
    if (state.split) { selectSp(id); return; }
    location.href = detailUrl(id, false);
  }

  function selectSp(id) {
    state.spEmp = id;
    S.setSession({ emp: id });
    renderSpList();
    var frame = el('yer-mgr-sp-frame');
    if (frame) frame.src = detailUrl(id, true);
  }

  function renderSpList() {
    var node = el('yer-mgr-sp-list');
    if (!node) return;
    var base = roster();
    var q = state.spSearch.trim().toLowerCase();
    var list = q ? base.filter(function (p) {
      return (p.emp.name + ' ' + p.emp.login + ' ' + (p.emp.dept || '') + ' ' + (p.emp.team || '')).toLowerCase().indexOf(q) >= 0;
    }) : base;
    node.innerHTML = list.map(function (p) {
      var st = listStatus(p);
      var mine = role() === 'lm' ? (p.lm && p.lm.overall ? p.lm.overall.score : null) : (myEntry(p) ? myEntry(p).score : null);
      return '<div class="sp-ei' + (p.id === state.spEmp ? ' on' : '') + '" data-sp-emp="' + esc(p.id) + '">' +
        '<div class="sp-ec"><div class="sp-en">' + esc(p.emp.name) + ' <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' +
        '<div class="sp-em">' + esc([p.emp.dept, p.emp.team].filter(Boolean).join(' - ')) + '</div>' +
        '<div class="sp-ect"><span class="' + (st.tone === 'completed' ? 'ok' : st.tone === 'incomplete' ? 'upd' : '') + '">' + esc(st.label) + '</span>' +
          (mine != null ? L(' - Điểm của bạn: ', ' - Your rating: ') + esc(numText(mine)) : '') + '</div></div></div>';
    }).join('');
    var foot = el('yer-mgr-sp-foot');
    if (foot) foot.textContent = L('Hiển thị ' + list.length + ' / ' + base.length + ' nhân viên', 'Showing ' + list.length + ' / ' + base.length + ' employees');
    node.querySelectorAll('[data-sp-emp]').forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.dataset.spEmp !== state.spEmp) selectSp(item.dataset.spEmp);
      });
    });
  }

  function setSplit(on) {
    if (on) {
      var first = roster()[0];
      if (!first) { U.toast(L('Không có nhân viên phù hợp để hiển thị Split View.', 'No employees to show in Split View.')); return; }
      state.split = true;
      state.filterOpen = false;
      render();
      selectSp(state.spEmp && roster().some(function (p) { return p.id === state.spEmp; }) ? state.spEmp : first.id);
      // Khung Split View cao gần bằng màn hình: cuộn lên ngay dưới thanh trên cùng để thấy trọn khung nhúng,
      // popup mở trong khung (căn giữa khung) nhờ vậy nằm trong màn hình (sửa 04/10/2026)
      var shell = document.querySelector('#yer-mgr-split-shell .sp-shell');
      if (shell) window.scrollTo({ top: Math.max(0, shell.getBoundingClientRect().top + window.scrollY - 64), behavior: 'smooth' });
    } else {
      state.split = false;
      state.spEmp = null;
      render();
    }
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
    bind();
    refreshRows();
    if (state.split && state.spEmp) {
      var frame = el('yer-mgr-sp-frame');
      if (frame) frame.src = detailUrl(state.spEmp, true);
    }
  }

  function switchRole(next) {
    state.filters = blankFilters();
    state.sort = null; // mỗi vai có bộ cột riêng
    state.filterOpen = false;
    state.selected = {};
    S.setSession({ role: next });
    if (state.split) {
      var first = roster()[0];
      if (first) { state.spEmp = first.id; } else { state.split = false; state.spEmp = null; }
    }
    render();
  }

  function bindFilterRow() {
    var btn = el('yer-mgr-filter-btn');
    if (btn) btn.addEventListener('click', function (e) {
      e.stopPropagation();
      state.filterOpen = !state.filterOpen;
      renderFilterRow();
    });
    document.querySelectorAll('#yer-mgr-filter-row [data-filter]').forEach(function (input) {
      input.addEventListener('input', function () {
        state.filters[input.dataset.filter] = input.value;
        refreshRows();
        syncFilterBadge();
      });
    });
    var clear = el('yer-mgr-filter-clear');
    if (clear) clear.addEventListener('click', function () {
      state.filters = blankFilters();
      renderFilterRow();
      refreshRows();
    });
    var approve = el('yer-mgr-approve');
    if (approve) approve.addEventListener('click', function () { if (!approve.classList.contains('yer-btn-off')) openApprove(); });
    var upload = el('yer-mgr-upload');
    if (upload) upload.addEventListener('click', openUpload);
    var calibBtn = el('yer-mgr-calib');
    if (calibBtn) calibBtn.addEventListener('click', function () { if (!calibBtn.classList.contains('yer-btn-off')) openCalib(); });
  }

  function bindRows() {
    var tbody = el('yer-mgr-tbody');
    if (!tbody) return;
    tbody.querySelectorAll('tr[data-emp]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest('select,input,button')) return;
        openEmp(tr.dataset.emp);
      });
    });
    tbody.querySelectorAll('[data-open-emp]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); openEmp(b.dataset.openEmp); });
    });
    tbody.querySelectorAll('[data-ai-emp]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var p = findProfile(b.dataset.aiEmp);
        if (p) openAi(p);
      });
    });
    // Bấm ô điểm là mở popup chấm điểm và nhận xét ngay (chốt 30/09/2026)
    tbody.querySelectorAll('[data-rate-emp]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        hideTip();
        var p = findProfile(btn.dataset.rateEmp);
        if (p) openComment(p);
      });
    });
    tbody.querySelectorAll('[data-check-emp]').forEach(function (box) {
      box.addEventListener('click', function (e) { e.stopPropagation(); });
      box.addEventListener('change', function () {
        if (box.checked) state.selected[box.dataset.checkEmp] = true;
        else delete state.selected[box.dataset.checkEmp];
        syncBulk();
      });
    });
  }

  function bind() {
    var root = el('yer-mgr-root');
    root.querySelectorAll('[data-role]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.role !== role()) switchRole(b.dataset.role);
      });
    });
    var indirect = root.querySelector('[data-scope="indirect"]');
    if (indirect) indirect.addEventListener('click', function () {
      if (role() === 'lm') switchRole('lm2');
    });
    bindFilterRow();
    bindHead();
    var split = el('yer-mgr-split');
    if (split) split.addEventListener('click', function () { setSplit(!state.split); });
    var spSearch = el('yer-mgr-sp-search');
    if (spSearch) spSearch.addEventListener('input', function () { state.spSearch = spSearch.value; renderSpList(); });
    var full = el('yer-mgr-sp-full');
    if (full) full.addEventListener('click', function () { if (state.spEmp) location.href = detailUrl(state.spEmp, false); });
  }

  // Bộ lọc đóng khi bấm ra ngoài, như tab Giữa năm
  document.addEventListener('click', function (e) {
    if (!state.filterOpen) return;
    var menu = el('yer-mgr-filter');
    if (menu && !menu.contains(e.target)) { state.filterOpen = false; renderFilterRow(); }
  });

  /* ── CSS riêng của panel ─────────────────────────────── */
  function injectCss() {
    if (el('yer-mgr-css')) return;
    var st = document.createElement('style');
    st.id = 'yer-mgr-css';
    st.textContent =
      '.yer-mgr-stepper{background:var(--z50);border:1px solid var(--z200);border-radius:var(--r);padding:14px 16px 12px;margin-bottom:14px}' +
      '.yer-mgr-stepper .stepper-hd{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--z500);display:flex;align-items:center;gap:5px}' +
      '.yer-mgr-stepper .stepper-hd>i{font-size:13px;color:var(--brand)}' +
      '.yer-mgr-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
      '.yer-mgr-controls .role-sub-group{margin-left:0}' +
      '#yer-mgr-filter-row{display:flex;align-items:center}' +
      '#yer-mgr-filter-row .filter-shell{margin-bottom:0}' +
      '.emp-tag-late{background:var(--warn-bg);color:var(--warn);border-color:var(--warn-bd)}' +
      '.emp-tag-noself{background:var(--z100);color:var(--z700);border-color:var(--z200)}' +
      // (HR system): chữ thường trong ngoặc, không viền, không nền
      '.yer-sync-tag{display:inline-block;margin-left:4px;font-size:11px;font-weight:500;color:var(--z600);white-space:nowrap}' +
      '.yer-mgr-table-wrap{overflow-x:auto}' +
      '.yer-mgr-table{min-width:980px}' +
      '.yer-mgr-table.yer-role-lm2{min-width:1080px}' +
      '.yer-mgr-table.yer-role-hod{min-width:1150px}' +
      '.yer-mgr-table th:first-child,.yer-mgr-table td:first-child{padding-left:12px}' +
      '.yer-mgr-table .myr-check-cell{padding-left:8px!important}' +
      '.yer-mgr-table .myr-emp-name{white-space:normal;overflow:visible;text-overflow:clip}' +
      // Trạng thái luôn một dòng, chữ 11px (chị chốt 05/10/2026)
      '.yer-mgr-table .myr-status{border-radius:50px;white-space:nowrap;overflow-wrap:normal;word-break:normal;padding:3px 8px;font-size:11px}' +
      // Bảng chính và bảng duyệt điểm HRBP: số điểm đứng giữa, nhãn và dấu cảnh báo đặt tuyệt đối quanh số
      '.yer-mgr-table .yer-sc,.yer-calib-table .yer-sc{position:relative;display:inline-block}' +
      '.yer-mgr-table .yer-sc .yer-sync-tag,.yer-calib-table .yer-sc .yer-sync-tag{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin:1px 0 0;display:block;width:max-content}' +
      // Canh theo phần chữ số chứ không theo hộp dòng: chữ số nằm cao hơn tâm hộp dòng nên icon nhích lên (chị chốt 07/10/2026)
      '.yer-mgr-table .yer-sc .yer-cap-mark,.yer-calib-table .yer-sc .yer-cap-mark,.yer-sc-mark .yer-cap-mark{position:absolute;left:100%;top:50%;transform:translateY(calc(-50% - .5px));margin-left:3px}' +
      '.yer-rt-cell{position:relative}' +
      '.yer-sc-mark{position:absolute;right:0;top:50%}' +
      '.yer-rt-cell{display:inline-flex;align-items:center;justify-content:center;gap:4px}' +
      // Ô điểm dạng nút: cùng dáng ô chọn điểm của tab Giữa năm, bấm là mở popup
      '.yer-rt-btn{display:inline-flex;align-items:center;justify-content:center;gap:2px;min-width:64px;height:26px;padding:0 6px 0 9px;' +
        'border:1px solid var(--brand-ring);border-radius:var(--rsm);background:var(--z0);font-family:inherit;font-size:12px;font-weight:600;' +
        'color:var(--z900);cursor:pointer;transition:var(--t)}' +
      '.yer-rt-btn i{font-size:14px;color:var(--z500)}' +
      '.yer-rt-btn:hover{border-color:var(--brand);background:var(--brand-muted)}' +
      '.yer-rt-btn:focus-visible{outline:2px solid var(--brand-ring);outline-offset:1px}' +
      '.yer-rt-btn.empty{font-size:11px;font-weight:500;color:var(--z600)}' +
      '.yer-rt-btn.ro{border-color:var(--z200);background:var(--z50);padding:0 9px}' +
      '.yer-rt-btn.ro:hover{border-color:var(--z300);background:var(--z100)}' +
      '.yer-rt-btn:disabled{color:var(--z500);cursor:not-allowed}' +
      '.yer-rt-btn:disabled:hover{border-color:var(--z200);background:var(--z50)}' +
      // Lịch sử chỉnh sửa trong popup
      '.yer-cm-log{margin-top:14px;border-top:1px solid var(--z200);padding-top:10px}' +
      '.yer-cm-log summary{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--z700);cursor:pointer}' +
      '.yer-cm-log summary i{font-size:14px;color:var(--z500)}' +
      '.yer-cm-log ol{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:8px;max-height:180px;overflow-y:auto}' +
      '.yer-cm-log li{padding:7px 10px;border:1px solid var(--z200);border-radius:var(--rsm);background:var(--z50)}' +
      '.yer-cm-log-hd{font-size:12px;color:var(--z600)}' +
      '.yer-cm-log-hd strong{color:var(--z900);font-weight:600}' +
      '.yer-cm-log-tx{margin-top:3px;font-size:12.5px;color:var(--z700);line-height:1.5;white-space:pre-wrap}' +
      // Nút thao tác hàng loạt đang khóa: cùng một kiểu xám với .btn:disabled của M-05, vẫn rê chuột được để đọc hướng dẫn
      // Khung đầu popup chung của M-05 YER: dải tiêu đề nền hồng nhạt, viền dưới, nội dung lề đều (08/10/2026)
      '.yer-mgr-dlg .pms-dlg-bd{padding:0}' +
      '.yer-mgr-dlg .pms-dlg-ti{margin:0;padding:15px 52px 13px 18px;background:var(--brand-muted);border-bottom:1px solid var(--brand-ring);' +
        'font-size:16px;font-weight:700;color:var(--z900);border-radius:var(--r) var(--r) 0 0}' +
      '.yer-mgr-dlg .pms-dlg-x{top:11px;right:14px}' +
      '.yer-mgr-dlg .pms-dlg-tx{padding:16px 18px 18px}' +
      // Câu dẫn của popup xác nhận; text-wrap:pretty để dòng cuối không rớt lẻ một chữ (chị chốt 08/10/2026)
      '.yer-mgr-dlg .pms-dlg-tx{text-wrap:pretty}' +
      // Câu dẫn viết gọn để nằm một dòng ở khổ popup 640px (chị chốt 08/10/2026)
      '.yer-approve-lead{margin:0;font-size:13px;line-height:1.55;color:var(--z900)}' +
      '.yer-approve-lead strong{font-weight:600}' +
      '.yer-approve-sub{display:block;color:var(--z700)}' +
      // Khối Lưu ý điểm trần: tiêu đề `Lưu ý` một dòng riêng, rồi câu quy định, danh sách, ô tick
      '.yer-note-hd{display:block;margin-bottom:2px}' +
      '.yer-note-tx{margin:0}' +
      // Màn Duyệt điểm HRBP upload: nút Duyệt điểm cùng hàng Bộ lọc; nút Tải xuống chỉ icon
      '.yer-calib-row{justify-content:flex-end}' +
      '.yer-calib-tools{display:flex;align-items:center}' +
      '.yer-icon-btn{width:30px;padding:0;justify-content:center}' +
      '.yer-icon-btn i{font-size:15px;margin:0}' +
      // Danh sách điểm vượt mức trong khối vàng (.yer-cm-cap), dùng ở mọi popup xác nhận vượt mức
      '.yer-cap-list{margin:6px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:3px}' +
      '.yer-pick-dlg .yer-cm-cap{margin:12px 0 0}' +
      // Số trên nút ẩn khi chưa tick ai (.myr-bulk-count của M-05 đặt display nên phải ẩn rõ ràng)
      '.myr-bulk-count[hidden]{display:none}' +
      // Bộ lọc chưa chọn điều kiện thì không hiện số 0 (chị chốt 08/10/2026); .filter-count của M-05 đặt display nên phải ẩn rõ
      '#yer-mgr-filter-count[hidden],#yer-calib-filter-count[hidden]{display:none}' +
      '.btn.yer-btn-off,.btn.yer-btn-off:hover{background:var(--z100);border-color:var(--z200);color:var(--z400);cursor:not-allowed;box-shadow:none}' +
      '.yer-th-info{font-size:13px;color:var(--z500);vertical-align:-2px;cursor:help;margin-left:2px}' +
      'th:has(.yer-th-info) .yer-th-sort{max-width:calc(100% - 24px)}' +
      // Tiêu đề cột bấm được để sắp xếp (chốt 02/10/2026): chữ giữ kiểu tiêu đề bảng, icon nhạt, cột đang xếp màu nhấn
      '.yer-th-sort{display:inline-flex;align-items:center;gap:3px;padding:0;border:0;background:transparent;font:inherit;color:inherit;' +
        'text-transform:inherit;letter-spacing:inherit;text-align:inherit;line-height:inherit;cursor:pointer;border-radius:var(--rxs)}' +
      '.yer-th-sort i{flex:none;font-size:13px;color:var(--z400);transition:var(--t)}' +
      '.yer-th-sort:hover,.yer-th-sort:hover i{color:var(--z800)}' +
      '.yer-th-sort.on,.yer-th-sort.on i{color:var(--brand)}' +
      '.yer-th-sort:focus-visible{outline:2px solid var(--brand-ring);outline-offset:2px}' +
      '.yer-th-info:hover,.yer-th-info:focus-visible{color:var(--brand);outline:none}' +
      '.sp-en .er-login{font-weight:400;color:var(--z600)}' +
      '.yer-ai-btn{width:24px;height:24px;flex:none;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--brand-ring);' +
        'border-radius:var(--rxs);background:var(--brand-muted);color:var(--brand);font-size:13px;cursor:pointer;transition:var(--t)}' +
      '.yer-ai-btn:hover{background:var(--brand);color:var(--brand-fg)}' +
      '.yer-ai-btn:focus-visible{outline:2px solid var(--brand-ring);outline-offset:1px}' +
      '.yer-mgr-acts{display:inline-flex;align-items:center;gap:2px}' +
      '.yer-mgr-empty{padding:48px 20px;text-align:center;color:var(--z500);font-size:13px}' +
      '.yer-mgr-empty i{display:block;font-size:30px;color:var(--z300);margin-bottom:8px}' +
      '#yer-mgr-tbody tr[data-emp]{cursor:pointer}' +
      // Popup đánh giá toàn diện của LM2, HOD
      '.yer-cm-dlg{width:min(640px,calc(100vw - 32px));max-width:none}' +
      '.yer-cm-emp{font-size:14px;color:var(--z900);margin-bottom:12px}' +
      '.yer-cm-emp-lbl{color:var(--z600)}' +
      '.yer-cm-refs{display:grid;gap:6px;margin-bottom:14px}' +
      '.yer-cm-ref{padding:6px 10px;border:1px solid var(--z200);border-radius:var(--rsm);background:var(--z50);min-width:0}' +
      '.yer-cm-ref-lbl{font-size:11px;font-weight:600;color:var(--z500);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.yer-cm-ref-val{margin-top:1px;font-size:13px;font-weight:600;color:var(--z800);line-height:1.4;display:flex;align-items:baseline;gap:4px}' +
      '.yer-cm-ref-val .yer-sync-tag,.yer-cm-ref-val .yer-cap-mark{margin:0;align-self:center}' +
      '.yer-cm-ref-dom{font-weight:400}' +
      '.yer-cm-flbl{display:block;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--z500);margin:0 0 6px}' +
      '.yer-cm-score{margin-bottom:16px}' +
      '.yer-cm-def[data-shown="0"]{display:none}' +
      '.yer-cm-def .rt-def{margin-top:10px}' +
      '.yer-sync-tag[data-tip]{cursor:help}' +
      // Ô chọn điểm toàn diện và tên mức: cùng kiểu với M-06 (M-05 không có sẵn các class này)
      // Ô chọn điểm viền xám, đang bấm chọn thì viền hồng đậm (chị chốt 07/10/2026)
      '.yer-cm-dlg .op-select{padding:5px 26px 5px 10px;border:1px solid var(--z300);border-radius:var(--rsm);font-family:inherit;font-size:13px;' +
        'font-weight:700;color:var(--z900);background:var(--z0);cursor:pointer;outline:none;appearance:none;-webkit-appearance:none;' +
        'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23a1a1aa\' d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E");' +
        'background-repeat:no-repeat;background-position:right 7px center}' +
      '.yer-cm-dlg .op-select:focus{border-color:var(--brand);outline:2px solid var(--brand-ring);outline-offset:1px}' +
      '.yer-cm-dlg .sc-lbl{height:20px;margin:0;padding:1px 7px;border-radius:var(--rxs);font-size:11px;font-weight:500;display:none;' +
        'align-items:center;white-space:nowrap;letter-spacing:.1px}' +
      '.yer-cm-dlg .sc-lbl.show{display:inline-flex;border:1px solid}' +
      '.yer-cm-dlg .lbl-xs,.yer-cm-dlg .lbl-ok{background:var(--ok-bg);color:var(--ok);border-color:var(--ok-bd)}' +
      '.yer-cm-dlg .lbl-good{background:var(--info-bg);color:var(--info);border-color:var(--info-bd)}' +
      '.yer-cm-dlg .lbl-need{background:var(--warn-bg);color:var(--warn);border-color:var(--warn-bd)}' +
      '.yer-cm-dlg .lbl-fail{background:var(--err-bg);color:var(--err);border-color:var(--err-bd)}' +
      '.yer-cm-dlg .ql-val{font-size:15px;font-weight:700;color:var(--z900)}' +
      '.yer-cm-text{width:100%;border:1px solid var(--z200);border-radius:var(--rsm);padding:9px 11px;font-family:inherit;font-size:13px;' +
        'color:var(--z800);line-height:1.55;resize:vertical}' +
      '.yer-cm-text::placeholder{color:var(--z400)}' +
      '.yer-cm-text:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 2px var(--brand-ring)}' +
      '.yer-cm-text[readonly]{background:var(--z50)}' +
      // Hạn sửa bên trái, nhấn màu thương hiệu; bộ đếm ký tự bên phải
      '.yer-cm-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:6px}' +
      // Dòng hạn chỉnh sửa trong popup: chữ xám đậm (chị chốt 07/10/2026)
      '.yer-cm-until{display:inline-flex;align-items:center;gap:5px;color:var(--z700);font-size:12px;font-weight:500}' +
      '.yer-cm-until i{font-size:13px}' +
      '.yer-cm-until strong{font-weight:700;color:var(--z900)}' +
      '.yer-cm-count{font-size:11.5px;color:var(--z600)}' +
      // Hình thức xử lý và giới hạn điểm: tông vàng cảnh báo (DS §19 rule 24)
      '.yer-cm-cap{display:flex;gap:7px;align-items:flex-start;margin:0 0 16px;padding:8px 11px;border:1px solid var(--warn-bd);' +
        'border-radius:var(--rsm);background:var(--warn-bg);font-size:12px;line-height:1.5;color:var(--z800)}' +
      '.yer-cm-cap:empty{display:none}' +
      '.yer-cm-cap>i{flex:none;margin-top:1px;font-size:15px;color:var(--warn)}' +
      '.yer-cap-over{margin-top:3px;font-weight:700;color:var(--z900)}' +
      '.yer-cap-ack{display:flex;align-items:flex-start;gap:7px;margin-top:8px;font-size:12.5px;font-weight:600;color:var(--z900);cursor:pointer}' +
      '.yer-cap-ack input{margin:2px 0 0;width:15px;height:15px;flex:none;accent-color:var(--brand)}' +
      '.pms-btn:disabled{opacity:.5;cursor:not-allowed}' +
      // Icon cảnh báo vượt mức: to hơn chút, canh giữa theo dòng số điểm (chị chốt 07/10/2026)
      '.yer-cap-mark{margin-left:3px;font-size:16px;line-height:1;color:var(--warn);vertical-align:middle;cursor:help}' +
      '.yer-req{color:var(--err);font-weight:700;margin-left:3px}' +
      // Popup Duyệt điểm cấp trước và Xem trước điểm từ file: bảng .myr-table trong khung cuộn (05/10/2026)
      '.yer-pick-dlg{width:min(640px,calc(100vw - 32px));max-width:none}' +
      '.yer-pick-lead{margin:0 0 10px;font-size:12.5px;line-height:1.5;color:var(--z700)}' +
      '.yer-pick-lead strong{color:var(--z900);font-weight:600}' +
      '.yer-pick-wrap{max-height:46vh;overflow:auto;border:1px solid var(--z200);border-radius:var(--rsm)}' +
      '.yer-pick-table th{position:sticky;top:0;z-index:1}' +
      '.yer-pick-table th:first-child,.yer-pick-table td:first-child{padding-left:12px}' +
      '.yer-pick-table .myr-check-cell{width:36px}' +
      '.yer-pick-table th.score,.yer-pick-table td.score{width:120px;text-align:center}' +
      '.yer-pick-table tbody tr:last-child td{border-bottom:0}' +
      '.yer-pick-table .yer-sc{position:relative;display:inline-block}' +
      '.yer-pick-table .yer-sc .yer-sync-tag{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin:1px 0 0;display:block;width:max-content}' +
      '.yer-pick-table .yer-sc .yer-cap-mark{position:absolute;left:100%;top:50%;transform:translateY(-50%);margin-left:3px}' +
      '.yer-pick-same{display:block;margin-top:2px;font-size:10.5px;color:var(--z500)}' +
      '.yer-pick-err{margin:10px 0 0;padding:8px 12px 8px 28px;border:1px solid var(--err-bd);border-radius:var(--rsm);background:var(--err-bg);' +
        'color:var(--err);font-size:12px;line-height:1.55}' +
      // Popup Upload điểm: khung bước .yer-flow ở yer-ui.js, như popup nộp bổ sung của E-05 (05/10/2026)
      '.yer-up-dlg{width:min(620px,calc(100vw - 32px));max-width:none}' +
      '.yer-up-lead{margin:0 0 10px;font-size:12.5px;color:var(--z700)}' +
      '.yer-up-lead strong{color:var(--z900);font-weight:700}' +
      '.yer-up-alert{display:flex;gap:7px;align-items:flex-start;margin-bottom:12px;padding:9px 12px;border:1px solid var(--warn-bd);' +
        'border-radius:var(--rsm);background:var(--warn-bg);font-size:12.5px;line-height:1.5;color:var(--z800)}' +
      '.yer-up-alert i{flex:none;font-size:15px;margin-top:1px;color:var(--warn)}' +
      '.yer-up-alert strong{color:var(--z900);font-weight:700}' +
      '.yer-up-dlg .btn[disabled]{opacity:.5;cursor:not-allowed}' +
      // Màn Duyệt điểm HRBP upload: khung .calib-* dùng chung với tab Giữa năm (M-05)
      '.yer-upd{color:var(--upd)}' +
      '.yer-calib-table .myr-emp-name{white-space:normal}' +
      '.yer-calib-meta{display:block;margin-top:3px;font-size:10.5px;color:var(--z600);white-space:nowrap}' +
      // Nhãn dưới điểm đặt tuyệt đối dưới số (như .yer-sync-tag) để mọi điểm trong hàng cùng một đường ngang (chị chốt 08/10/2026)
      '.yer-calib-table .yer-calib-meta,.yer-calib-table .yer-calib-conflict{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:1px;width:max-content}' +
      // Điểm HRBP upload không đóng khung, chỉ giữ màu riêng (chị chốt 08/10/2026)
      // Nhãn dưới điểm không chiếm chỗ nên cột phải đủ rộng cho nhãn dài nhất (`Khác điểm tải lên`)
      '.yer-calib-table th.calib-upload-col,.yer-calib-table th.yer-calib-hod-col{width:118px;min-width:118px}' +
      '.yer-calib-table .calib-upload-score{display:inline;background:none;border:0;padding:0;border-radius:0;color:var(--upd)}' +
      '.yer-calib-info{color:var(--z900)}' +
      // Lưu ý trong popup xác nhận: dấu cảnh báo thay chấm đầu dòng
      '.yer-pick-dlg .yer-approve-lead + *{margin-top:12px}' +
      '.yer-calib-meta.ok{color:var(--ok);font-weight:600}' +
      '.yer-calib-conflict{display:block;margin-top:3px;font-size:10.5px;font-weight:600;color:var(--warn);white-space:nowrap}' +
      '.yer-calib-note-list{margin:0;padding-left:16px;display:flex;flex-direction:column;gap:3px}' +
      '.yer-calib-dl-pop{width:auto;min-width:170px;padding:4px;right:0;left:auto}' +
      '.yer-calib-dl-opt{display:flex;align-items:center;gap:7px;width:100%;padding:7px 10px;border:0;border-radius:var(--rxs);' +
        'background:transparent;font-family:inherit;font-size:12.5px;color:var(--z800);cursor:pointer;text-align:left}' +
      '.yer-calib-dl-opt:hover{background:var(--z100)}' +
      '.yer-calib-dl-opt i{font-size:15px;color:var(--z500)}';
    document.head.appendChild(st);
  }

  function boot() {
    Y = window.PMSYer; S = window.PMSStore; I = window.PMSI18n; U = window.PMSUi;
    if (!Y || !S || !I || !U) return;
    injectCss();
    state.filters = blankFilters();
    var slot = el('lang-slot');
    if (slot && !slot.childElementCount) I.mountToggle(slot);
    I.onChange(render);
    document.addEventListener('pms:demo-change', function () {
      state.selected = {};
      var cs = el('yer-calib-screen');
      if (cs) cs.style.display = 'none';
      render();
    });
    // Khung Split View lưu đánh giá thì danh sách bên trái cập nhật theo, không nạp lại khung
    S.subscribe(function (reason) { if (reason === 'external') refreshRows(); });
    // Danh sách không có dữ liệu chờ lưu: chọn điểm, duyệt, upload, popup nhận xét đều lưu ngay khi thao tác,
    // nên không gắn cảnh báo dữ liệu chưa lưu (§36) ở màn này. Bộ lọc cũng không phải dữ liệu.
    render();
  }

  window.PMSYerManager = { render: render };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
