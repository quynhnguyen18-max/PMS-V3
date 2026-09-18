/* ═══════════════════════════════════════════════════════════
   YER Manager Detail — tab Đánh giá cuối năm của màn M-06
   Bám đúng ngôn ngữ thiết kế của tab Đánh giá giữa năm trong M-02:
   cycle-actions, submit-banner, info-note, rv-section + rv-grid,
   cặp scmt-panel, overall-card. Chỉ khác ở phần riêng của kỳ cuối năm.

   Ba vai dùng chung màn này nhưng làm ba việc khác nhau (YER-SPEC §3):
     - Quản lý trực tiếp: điểm từng mục tiêu + 3 nhận xét nhóm + điểm toàn diện
     - Quản lý cấp 2 / Trưởng đơn vị: CHỈ điểm toàn diện, nhận xét tùy chọn
   Spec: YER-SPEC.md §3 §7 §8, §27 ENH-E02, §28 ENH-E03, §33 ENH-E10
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

  var MGR_ROLES = ['lm', 'lm2', 'hod'];
  var draft = null;

  function role() {
    var r = S.session().role;
    return MGR_ROLES.indexOf(r) >= 0 ? r : 'lm';
  }
  function isLm() { return role() === 'lm'; }
  function prof() { var s = S.session(); return Y.profile(s.emp, s.date); }
  function actsOf() { return S.acts(S.session().emp) || {}; }

  function draftKey() { return role() + 'Draft'; }
  function loadDraft() {
    var d = actsOf()[draftKey()];
    draft = d ? JSON.parse(JSON.stringify(d)) : { goalScores: {}, howScores: {}, comments: {}, overall: {} };
  }
  function saveDraft(silent) {
    S.setAct(S.session().emp, draftKey(), draft);
    U.dirty.clear();
    if (!silent) U.toast(L('Đã lưu nháp', 'Draft saved'));
  }

  /* ── mảnh dùng lại ───────────────────────────────────── */
  var TYPE = {
    what: { vi: 'Mục tiêu công việc', en: 'Work goals', icon: 'bx-target-lock' },
    dev: { vi: 'Mục tiêu phát triển', en: 'Development goals', icon: 'bx-line-chart' },
    how: { vi: 'Mục tiêu hành vi', en: 'Behavioral goals', icon: 'bx-heart' }
  };
  var PRIO = { h: { vi: 'Cao', en: 'High' }, m: { vi: 'Trung bình', en: 'Medium' }, l: { vi: 'Thấp', en: 'Low' } };
  // Cùng bộ chữ với màn Nhân viên, xem assets/yer-employee.js
  var CORE_VALUES = [
    { vi: 'Tập trung vào khách hàng', en: 'Customer focus',
      desc: 'Thấu hiểu khách hàng, nghĩ về khách hàng trước tiên, cung cấp trải nghiệm vượt trội.' },
    { vi: 'Đổi mới sáng tạo', en: 'Innovation',
      desc: 'Xây dựng tư duy khác biệt, hướng tới thay đổi tích cực, trân trọng mọi ý tưởng.' },
    { vi: 'Tinh thần đồng đội', en: 'Teamwork',
      desc: 'Làm việc hướng về một mục tiêu chung, tôn trọng và hỗ trợ đồng nghiệp.' },
    { vi: 'Thực thi xuất sắc', en: 'Excellence',
      desc: 'Được trao quyền và nỗ lực vươn xa, làm việc hiệu quả và có trách nhiệm.' },
    { vi: 'Tinh thần học hỏi không ngừng', en: 'Constant learning',
      desc: 'Chủ động nắm bắt cơ hội phát triển, học từ sai lầm, mở rộng tầm nhìn.' }
  ];
  var DEFAULT_MGR = { name: 'Lê Thị Thanh', login: 'thanh.le', ini: 'LT' };

  function editorHtml(id, placeholder, max, value, counterId, readonly) {
    if (readonly) {
      return '<div class="ev-editor-wrap yer-ed-ro"><div class="ev-content" id="' + id + '">' +
        (value ? esc(value) : '<span class="yer-ed-empty">—</span>') + '</div></div>';
    }
    return '<div class="ev-editor-wrap"><div class="ev-toolbar" onmousedown="event.preventDefault()">' +
      '<button class="ev-tb-btn" onclick="edCmd(\'bold\')" title="Bold"><span style="font-weight:700;font-size:12px">B</span></button>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'italic\')" title="Italic"><span style="font-style:italic;font-size:12px">I</span></button>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'underline\')" title="Underline"><span style="text-decoration:underline;font-size:12px">U</span></button>' +
      '<span class="ev-tb-sep"></span>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'insertUnorderedList\')" title="List"><i class="bx bx-list-ul" style="font-size:14px"></i></button>' +
      '</div><div class="ev-content" contenteditable="true" data-placeholder="' + esc(placeholder) + '" id="' + id +
        '" oninput="edCount(this,\'' + counterId + '\',' + max + ')">' + esc(value || '') + '</div></div>' +
      '<div class="char-ct" id="' + counterId + '">' + String(value || '').length + ' / ' + max + '</div>';
  }

  /* Ô bắt buộc điền đánh dấu bằng sao đỏ ngay trên nhãn của ô đó,
     không dùng nhãn "Bắt buộc" ở góc panel nữa. */
  function req() {
    return '<span class="yer-req" aria-hidden="true">*</span>' +
      '<span class="sr-only">' + L(' bắt buộc', ' required') + '</span>';
  }

  function ratingCell(key, value, opts) {
    opts = opts || {};
    return '<div data-rt="' + esc(key) + '"' +
      (opts.half ? ' data-half="1"' : '') +
      ' data-ro="' + (opts.readonly ? '1' : '0') + '"' +
      ' data-val="' + (value == null ? '' : value) + '"></div>';
  }

  /* ── toolbar và banner trạng thái ────────────────────── */
  function myStep() { return role(); }
  function mySubmitted(p) {
    if (role() === 'lm') return !!(p.lm && !p.lm.synced);
    if (role() === 'lm2') return !!(p.lm2 && !p.lm2.synced);
    return !!p.hod;
  }
  function stepOpen(p) { return Y.stepState(myStep(), p.now) === 'open'; }
  function editable(p) {
    if (!stepOpen(p)) return false;
    if (p.stopped) return false;
    // Khi thiếu goal, LM chỉ bắt đầu chấm sau khi NV đã nộp file trễ.
    // Hồ sơ đủ goal từ trước vẫn theo rule hiện hành: LM có thể chấm dù NV bỏ self.
    if (isLm() && p.eligibility.reason === 'missing-goal' && !p.lateSubmission && !p.maternity) return false;
    // LM và NV không thu hồi được sau khi gửi; LM2/HOD sửa thoải mái tới hết deadline (§8)
    if (role() === 'lm') return !mySubmitted(p);
    return true;
  }

  function toolbar(p, canEdit) {
    if (!canEdit) return '';
    return '<div class="cycle-actions yer-mgr-actions">' +
      (isLm() ? '<button class="btn btn-outline btn-sm" id="yer-md-return"><i class="bx bx-undo"></i>' +
        L('Trả về cho nhân viên', 'Return to employee') + '</button>' : '') +
      (role() === 'lm2' ? '<button class="btn btn-outline btn-sm" id="yer-md-return"><i class="bx bx-undo"></i>' +
        L('Trả về cho Quản lý trực tiếp', 'Return to line manager') + '</button>' : '') +
      '<button class="btn btn-outline btn-sm" id="yer-md-draft"><i class="bx bx-save"></i>' +
        L('Lưu nháp', 'Save draft') + '</button>' +
      '<button class="btn btn-default btn-sm" id="yer-md-submit"><i class="bx bx-send"></i>' +
        (isLm() ? L('Gửi đánh giá', 'Submit review') : L('Lưu điểm', 'Save rating')) + '</button>' +
    '</div>';
  }

  function banner(p) {
    if (!mySubmitted(p)) return '';
    var score = role() === 'lm' ? (p.lm.overall && p.lm.overall.score)
      : role() === 'lm2' ? p.lm2.score : p.hod.score;
    var at = role() === 'lm' ? p.lm.at : role() === 'lm2' ? p.lm2.at : p.hod.at;
    return '<div class="submit-banner"><i class="bx bx-check-circle"></i><div class="sb-text">' +
      '<div class="sb-title">' + L('Bạn đã gửi đánh giá cho nhân viên này', 'You have submitted this review') + '</div>' +
      '<div class="sb-sub">' + L('Gửi lúc ', 'Submitted on ') + esc(Y.fmt(at, lg())) +
        (isLm() ? '&nbsp;- ' + L('không sửa và không thu hồi được', 'it cannot be edited or withdrawn') : '') + '</div>' +
      '</div><div class="sb-score"><span class="sb-score-lbl">' + L('Điểm toàn diện của bạn', 'Your overall rating') +
      '</span><span class="sb-score-val">' + (score == null ? '—' : esc(String(score))) + '</span></div></div>';
  }

  /* ── ENH-E03: điều hướng sang kết quả giữa năm ───────── */
  function myrLine(p) {
    var hasMyr = !!(p.myr && p.myr.submitted);
    if (!hasMyr) {
      return '<div class="info-note yer-myr-note"><i class="bx bx-calendar-x"></i><div>' +
        L('<strong>Không có kết quả Mid-Year.</strong> Nhân viên này không tham gia kỳ đánh giá giữa năm 2026.',
          '<strong>No Mid-Year result.</strong> This employee did not take part in the 2026 mid-year cycle.') +
      '</div></div>';
    }
    var m = p.emp.myrMgr || p.emp.mgr || DEFAULT_MGR;
    var who = m.name + ' (' + (m.login || '') + ')';
    return '<div class="info-note yer-myr-note"><i class="bx bx-calendar-star"></i><div>' +
      L('Cần tham khảo kết quả giữa năm thì sang tab <strong>Đánh giá giữa năm</strong> của chính màn này.',
        'To review the mid-year result, switch to the <strong>Mid-Year Review</strong> tab on this same screen.') +
      '<br>' + L('Người đã chấm giữa năm: <strong>', 'Rated at mid-year by: <strong>') + esc(who) + '</strong>. ' +
      L('Quản lý tại thời điểm cuối năm có thể là người khác.',
        'The manager at year-end may be a different person.') +
      '</div><button class="btn btn-outline btn-sm yer-myr-go" id="yer-md-myr"><i class="bx bx-link-external"></i>' +
        L('Mở tab giữa năm', 'Open mid-year tab') + '</button></div>';
  }

  /* ── ENH-E10: hướng dẫn cho Quản lý khi nhân viên thai sản ── */
  function maternityBlock(p) {
    if (!p.maternity) return '';
    var noGoal = p.eligibility.reason === 'missing-goal';
    return '<div class="info-note yer-note-mat"><i class="bx bx-heart-circle"></i><div>' +
      '<strong>' + L('Nhân viên đang nghỉ thai sản', 'This employee is on maternity leave') + '</strong><br>' +
      L('Bước tự đánh giá của nhân viên chuyển sang <strong>Không yêu cầu</strong>, không tính là chưa hoàn thành và hệ thống không gửi nhắc. Bạn vẫn đánh giá theo quy định.',
        'Their self assessment step is set to <strong>Not required</strong>, is not counted as outstanding, and no reminders are sent. You still complete the review as usual.') +
      (noGoal ? '<br>' + L('Nhân viên chưa có mục tiêu nào được duyệt. Bạn import mục tiêu thay nhân viên rồi duyệt, sau đó mới đánh giá được. Mục tiêu nhân viên đã tạo và đã được duyệt thì bạn không sửa.',
        'They have no approved goals yet. Import goals on their behalf and approve them before you can rate. Goals the employee created and had approved cannot be edited by you.') : '') +
      '</div>' +
      (noGoal && stepOpen(p) ? '<button class="btn btn-default btn-sm yer-myr-go" id="yer-md-import">' +
        '<i class="bx bx-upload"></i>' + L('Import mục tiêu hộ', 'Import goals on their behalf') + '</button>' : '') +
    '</div>';
  }

  /* ── ENH-E02: hồ sơ nộp trễ ──────────────────────────── */
  function lateBlock(p) {
    if (!p.lateSubmission) return '';
    return '<div class="info-note yer-note-late"><i class="bx bx-time-five"></i><div>' +
      '<strong>' + L('Hồ sơ nộp trễ hạn', 'Submitted after the deadline') + '</strong>' +
      '<span class="yer-late-file-tag"><i class="bx bx-file"></i>' + esc(p.lateSubmission.fileName || '') + ' - ' + esc(Y.fmt(p.lateSubmission.at, lg())) + '</span><br>' +
      L('Nhân viên đã tải lên mục tiêu và nội dung tự đánh giá sau thời hạn. Mục tiêu <strong>không qua bước duyệt</strong>; nhân viên xác nhận đã thống nhất với bạn từ trước. Bạn tiếp tục đánh giá như bình thường.',
        'The employee imported their goals and self assessment after their window closed. The goals were taken as-is, <strong>with no approval step</strong>; the employee is responsible for having agreed them with you earlier. You review as usual.') +
    '</div></div>';
  }

  function stoppedBlock(p) {
    if (!p.stopped) return '';
    return '<div class="info-note yer-note-stop"><i class="bx bx-error-circle"></i><div>' +
      '<strong>' + L('Hồ sơ không đánh giá', 'This profile is not evaluated') + '</strong><br>' +
      L('Nhân viên không đủ điều kiện tham gia kỳ này: thiếu mục tiêu công việc hoặc mục tiêu phát triển đã được duyệt, và cũng không nộp trễ. Quy trình dừng ở đây, vẫn tính vào mẫu số tỷ lệ hoàn thành.',
        'The employee is not eligible this cycle: a required approved work or development goal is missing and nothing was submitted late. The process stops here and still counts in the completion denominator.') +
    '</div></div>';
  }

  function resignBlock(p) {
    if (!p.resignFrom || p.resigned) return '';
    return '<div class="info-note yer-note-resign"><i class="bx bx-log-out"></i><div>' +
      L('Nhân viên nghỉ việc từ <strong>', 'This employee leaves on <strong>') + esc(Y.fmt(p.resignFrom, lg())) + '</strong>. ' +
      L('Hãy chấm điểm trước ngày hiệu lực. Hồ sơ này không tính vào tỷ lệ hoàn thành và hệ thống không nhắc bạn.',
        'Please rate before that date. This profile is excluded from the completion rate and no reminders are sent to you.') +
    '</div></div>';
  }

  /* ── mục tiêu Quản lý trước đã đánh giá hoàn thành ──
     Quản lý cũ không để lại bản bàn giao. Thứ họ để lại là điểm đã chốt, và Quản lý
     hiện tại **không chấm lại** những mục tiêu đó. */
  function doneChip() {
    return '<span class="g-done-chip"><i class="bx bx-check-circle"></i>' +
      L('Đã đánh giá hoàn thành', 'Assessed as complete') + '</span>';
  }

  function byLine(done) {
    if (!done || !done.by) return '';
    return '<div class="ql-by" title="' +
      esc(L('Đánh giá bởi ', 'Assessed by ') + done.by.name + ' (' + done.by.login + ')') + '">' +
      esc(done.by.login) + '</div>';
  }

  /* ── bảng mục tiêu ───────────────────────────────────── */
  function approvedGoals(p, type) {
    var deleted = ((actsOf().deletedGoals || {}).ids) || [];
    var base = (p.emp.goals || []).filter(function (g) {
      return g.type === type && g.status === 'approved' && deleted.indexOf(g.id) < 0;
    });
    var imported = (p.lateSubmission && p.lateSubmission.goals) || [];
    imported.filter(function(g){ return g.type === type; }).forEach(function(g){
      if(!base.some(function(x){ return x.id === g.id; })) base.push(g);
    });
    return base;
  }

  function goalSection(p, type, canEdit) {
    var list = approvedGoals(p, type);
    if (type !== 'how' && !list.length) return '';
    var t = TYPE[type];
    var selfScores = (p.self && p.self.goalScores) || {};
    var myScores = draft.goalScores || {};
    var lmScores = (p.lm && p.lm.goalScores) || {};

    var rows;
    if (type === 'how') {
      rows = CORE_VALUES.map(function (cv, i) {
        return { id: 'how:' + i, name: lg() === 'en' ? cv.en : cv.vi, result: cv.desc, prio: '' };
      });
    } else {
      rows = list.map(function (g) {
        // done: mục tiêu Quản lý trước đã đánh giá hoàn thành, Quản lý hiện tại không chấm lại
        return { id: 'goal:' + g.id, name: g.title, result: g.result || '', prio: g.prio || '',
                 done: (p.completedGoals || {})[g.id] || null };
      });
    }

    var selfMap = type === 'how' ? ((p.self && p.self.howScores) || {}) : selfScores;
    var lmMap = type === 'how' ? ((p.lm && p.lm.howScores) || {}) : lmScores;
    // Đã gửi thì bản nháp đã xóa, điểm phải đọc lại từ bản đã gửi
    var myMap = isLm()
      ? (mySubmitted(p) ? lmMap : (type === 'how' ? (draft.howScores || {}) : (draft.goalScores || {})))
      : lmMap;

    // LM2/HOD không chấm điểm từng mục tiêu, chỉ đọc điểm của NV và của QLTT (§3)
    var myColHead = isLm() ? L('Điểm của bạn', 'Your score') : L('Điểm của QLTT', 'Line manager');

    return '<div class="rv-section"><div class="rv-section-hd"><i class="bx ' + t.icon + '"></i>' +
        esc(lg() === 'en' ? t.en : t.vi) + '</div>' +
      '<div class="rv-grid-wrap"><table class="rv-grid"><thead><tr>' +
        '<th>' + (type === 'how' ? L('Giá trị cốt lõi', 'Core value') : L('Tên mục tiêu', 'Goal')) + '</th>' +
        '<th>' + (type === 'how' ? L('Mô tả', 'Description') : L('Kết quả cần đạt', 'Expected result')) + '</th>' +
        (type === 'how' ? '' : '<th>' + L('Ưu tiên', 'Priority') + '</th>') +
        '<th class="th-c">' + L('Điểm NV', 'Employee') + '</th>' +
        '<th class="th-c th-ql">' + esc(myColHead) + '</th>' +
      '</tr></thead><tbody>' +
      rows.map(function (r) {
        var key = r.id.split(':');
        var bucket = key[0] === 'how' ? 'how' : 'goal';
        var idx = key[1];
        // Đã chốt hoàn thành thì cả hai cột đều lấy điểm đã chốt và đều chỉ xem
        var selfVal = r.done ? r.done.self.score : selfMap[idx];
        var myVal = r.done ? r.done.mgr.score : myMap[idx];
        return '<tr' + (r.done ? ' class="g-row-done"' : '') +
          '><td><div class="g-name">' + esc(r.name) + '</div>' +
          (r.done ? doneChip() : '') + '</td>' +
          '<td><div class="g-result">' + esc(r.result) + '</div></td>' +
          (type === 'how' ? '' : '<td><div class="g-meta">' +
            (r.prio ? '<span class="prio prio-' + esc(r.prio) + '">' +
              esc(lg() === 'en' ? (PRIO[r.prio] || {}).en : (PRIO[r.prio] || {}).vi) + '</span>' : '') + '</div></td>') +
          '<td class="sc-cell">' + ratingCell('self:' + bucket + ':' + idx, selfVal == null ? null : selfVal, { readonly: true }) + '</td>' +
          '<td class="ql-cell">' + ratingCell('my:' + bucket + ':' + idx, myVal == null ? null : myVal,
            { readonly: r.done ? true : !(canEdit && isLm()) }) + byLine(r.done && r.done.mgr) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      commentPair(p, type, canEdit) + '</div>';
  }

  function commentPair(p, type, canEdit) {
    var selfCmt = (p.self && p.self.comments && p.self.comments[type]) || '';
    var lmCmt = (p.lm && p.lm.comments && p.lm.comments[type]) || '';
    var myCmt = isLm() ? ((draft.comments || {})[type] || '') : lmCmt;
    var placeholder = L('Nhận xét chung về nhóm mục tiêu này…', 'Overall comment on this goal group…');

    return '<div class="section-cmt">' +
      '<div class="scmt-panel scmt-locked"><div class="scmt-hd"><i class="bx bx-user"></i>' +
        L('Đánh giá của Nhân viên', 'Employee review') + '</div>' +
        editorHtml('yer-md-self-' + type, '', 500, selfCmt, 'cc-self-' + type, true) + '</div>' +
      '<div class="scmt-panel' + (canEdit && isLm() ? ' editable-panel' : ' scmt-locked') + '">' +
        '<div class="scmt-hd"><i class="bx bx-user-check"></i>' +
          (isLm() ? L('Đánh giá của bạn', 'Your review') : L('Đánh giá của Quản lý trực tiếp', 'Line manager review')) +
          (canEdit && isLm() ? req() : '') +
        '</div>' +
        editorHtml('yer-md-cmt-' + type, placeholder, 500, myCmt, 'cc-cmt-' + type, !(canEdit && isLm())) + '</div>' +
    '</div>';
  }

  /* ── đánh giá toàn diện ──────────────────────────────── */
  function overallCard(p, canEdit) {
    var cols = [];

    cols.push(panelHtml({
      icon: 'bx-user', title: L('Nhân viên tự đánh giá', 'Employee self assessment'),
      key: 'self:overall', value: p.self && p.self.overall ? p.self.overall.score : null,
      comment: p.self && p.self.overall ? p.self.overall.comment : '', readonly: true
    }));

    if (!isLm()) {
      cols.push(panelHtml({
        icon: 'bx-user-check', title: L('Quản lý trực tiếp', 'Line manager'),
        key: 'lm:overall', value: p.lm && p.lm.overall ? p.lm.overall.score : null,
        comment: p.lm && p.lm.overall ? p.lm.overall.comment : '', readonly: true,
        synced: p.lm && p.lm.synced
      }));
    }
    if (role() === 'hod') {
      cols.push(panelHtml({
        icon: 'bx-sitemap', title: L('Quản lý cấp 2', 'Second-level manager'),
        key: 'lm2:overall', value: p.lm2 ? p.lm2.score : null,
        comment: p.lm2 ? p.lm2.comment : '', readonly: true, synced: p.lm2 && p.lm2.synced
      }));
    }

    var myTitle = role() === 'lm' ? L('Đánh giá của bạn', 'Your review')
      : role() === 'lm2' ? L('Đánh giá của bạn - Quản lý cấp 2', 'Your review - second level')
      : L('Đánh giá của bạn - Trưởng đơn vị', 'Your review - head of department');
    var mine = mySubmitted(p)
      ? (role() === 'lm' ? (p.lm.overall || {})
         : role() === 'lm2' ? { score: p.lm2.score, comment: p.lm2.comment }
         : { score: p.hod.score, comment: p.hod.comment })
      : (draft.overall || {});
    cols.push(panelHtml({
      icon: 'bx-edit-alt', title: myTitle, key: 'my:overall',
      value: mine.score == null ? null : mine.score,
      comment: mine.comment || '',
      readonly: !canEdit, editable: canEdit,
      required: isLm(),
      hint: isLm()
        ? L('Điểm này không hiển thị cho nhân viên, kể cả sau khi công bố.', 'This rating is never shown to the employee.')
        : L('Nhận xét là tùy chọn. Bạn sửa được tới hết deadline của mình.', 'A comment is optional. You can edit until your own deadline.')
    }));

    return '<div class="overall-card"><div class="overall-hd"><i class="bx bx-award"></i>' +
      '<span class="overall-title">' + L('Đánh giá toàn diện', 'Overall rating') + '</span></div>' +
      '<div class="overall-grid yer-overall-grid" style="grid-template-columns:repeat(' + cols.length + ',minmax(0,1fr))">' +
      cols.join('') + '</div></div>';
  }

  function panelHtml(o) {
    return '<div class="overall-panel' + (o.editable ? ' editable-panel' : '') + '">' +
      '<div class="op-hd"><i class="bx ' + o.icon + '"></i>' + esc(o.title) +
        (o.synced ? '<span class="yer-sync-tag">(HR system)</span>' : '') + '</div>' +
      '<div class="op-score-row">' +
        '<span class="op-score-lbl">' + L('Điểm toàn diện:', 'Overall rating:') +
          (o.editable ? req() : '') + '</span>' +
        ratingCell(o.key, o.value, { half: true, readonly: o.readonly }) +
      '</div>' +
      (o.hint ? '<div class="yer-op-hint">' + esc(o.hint) + '</div>' : '') +
      '<label class="op-flbl">' + (o.editable
        ? L('Nhận xét toàn diện của bạn', 'Your overall comment') + (o.required ? req() : '')
        : L('Nhận xét toàn diện', 'Overall comment')) + '</label>' +
      editorHtml('yer-md-ov-' + o.key.replace(/:/g, '-'),
        L('Nhìn chung, nhân viên đã…', 'Overall, this employee has…'),
        1000, o.comment, 'cc-ov-' + o.key.replace(/:/g, '-'), !o.editable) +
    '</div>';
  }

  /* ── phản hồi của nhân viên ──────────────────────────── */
  function responseBlock(p) {
    if (!p.response) return '';
    var r = p.response;
    return '<div class="rv-section"><div class="rv-section-hd"><i class="bx bx-message-rounded-dots"></i>' +
      L('Phản hồi của Nhân viên', 'Employee response') +
      '<span class="yer-hd-sub">' + esc(r.by ? r.by.name + ' (' + r.by.login + ')' : '') +
        ' - ' + esc(Y.fmt(r.at, lg())) + '</span></div>' +
      '<div class="yer-resp-body"><div class="yer-resp-tx">' + esc(r.text || '') + '</div>' +
      (p.reply
        ? '<div class="yer-resp-reply"><div class="yer-resp-reply-hd"><i class="bx bx-corner-down-right"></i>' +
            L('Bạn đã trả lời', 'You replied') + ' - ' + esc(Y.fmt(p.reply.at, lg())) + '</div>' +
            '<div class="yer-resp-tx">' + esc(p.reply.text || '') + '</div></div>'
        : p.replyOpen
          ? '<div class="yer-resp-form">' +
              '<label class="op-flbl">' + L('Trả lời một lần duy nhất', 'You may reply once only') + '</label>' +
              editorHtml('yer-md-reply', L('Cảm ơn bạn đã phản hồi…', 'Thank you for your response…'), 1000, '', 'cc-reply', false) +
              '<button class="btn btn-default btn-sm" id="yer-md-reply-send"><i class="bx bx-send"></i>' +
                L('Gửi trả lời', 'Send reply') + '</button></div>'
          : '') +
      '</div></div>';
  }

  /* ── render ──────────────────────────────────────────── */
  function render() {
    var root = el('yer-mgr-detail-root');
    if (!root) return;
    if (MGR_ROLES.indexOf(S.session().role) < 0) {
      root.innerHTML = '<div class="yer-mgr-empty"><i class="bx bx-user-x"></i>' +
        L('Vai trò đang chọn không phải Quản lý. Đổi vai ở thanh Chế độ demo để xem màn này.',
          'The selected role is not a manager. Switch role on the demo bar to see this screen.') + '</div>';
      return;
    }
    var p = prof();
    if (!p) { root.innerHTML = ''; return; }
    loadDraft();
    syncChrome(p);

    var canEdit = editable(p);
    var html = toolbar(p, canEdit) + banner(p);

    html += stoppedBlock(p) + lateBlock(p) + maternityBlock(p) + resignBlock(p);
    html += myrLine(p);

    if (!p.stopped) {
      html += goalSection(p, 'what', canEdit);
      html += goalSection(p, 'dev', canEdit);
      html += goalSection(p, 'how', canEdit);
      html += overallCard(p, canEdit);
      html += responseBlock(p);
    }

    if (!canEdit && !mySubmitted(p) && !p.stopped) {
      html += '<div class="info-note"><i class="bx bx-lock-alt"></i><div>' +
        L('Ngoài thời gian đánh giá của bạn nên màn này chỉ để xem.',
          'Outside your review window, so this screen is read-only.') + '</div></div>';
    }

    root.innerHTML = html;
    afterRender(p, canEdit);
  }

  function syncChrome(p) {
    var lbl = el('tablbl-yer');
    if (lbl) {
      var st = Y.status(p, lg());
      lbl.textContent = st.label;
    }
    var tabs = document.querySelectorAll('.tabs .tab-btn');
    if (tabs[0]) {
      var cnt = tabs[0].querySelector('.tab-cnt');
      if (cnt) cnt.textContent = approvedGoals(p, 'what').concat(approvedGoals(p, 'dev')).length;
    }
    if (tabs[1]) {
      var myrBadge = tabs[1].querySelector('.tab-active-label');
      if (myrBadge) myrBadge.textContent = p.myr && p.myr.submitted
        ? L('Đã công bố', 'Published') : L('Không có dữ liệu', 'No data');
    }
    var chip = document.querySelector('.emp-chip');
    if (chip) {
      var mgr = p.emp.mgr || DEFAULT_MGR;
      chip.innerHTML = '<div class="av av-brand av-xs">' + esc(p.emp.ini || '') + '</div>' +
        '<div class="ec-info">' +
        '<div class="ec-line"><span class="ec-lbl">' + L('Nhân viên', 'Employee') + ':</span> ' + esc(p.emp.name) +
          ' <span class="ec-dom">(' + esc(p.emp.login) + ')</span></div>' +
        '<div class="ec-line"><span class="ec-lbl">Team:</span> ' +
          esc([p.emp.div, p.emp.team || p.emp.dept].filter(Boolean).join(' - ')) + '</div>' +
        '<div class="ec-line"><span class="ec-lbl">' + L('Quản lý trực tiếp', 'Line manager') + ':</span> ' +
          esc(mgr.name || '') + ' <span class="ec-dom">(' + esc(mgr.login || '') + ')</span></div></div>';
    }
  }

  function afterRender(p, canEdit) {
    document.querySelectorAll('#yer-mgr-detail-root [data-rt]').forEach(function (node) {
      var key = node.dataset.rt;
      var val = node.dataset.val === '' ? null : Number(node.dataset.val);
      U.rating(node, {
        step: node.dataset.half === '1' ? 'half' : 'int',
        value: val,
        readonly: node.dataset.ro === '1',
        compact: node.dataset.half !== '1',
        onChange: function (v) { onRating(key, v); }
      });
    });

    document.querySelectorAll('#yer-mgr-detail-root .ev-content[contenteditable="true"]').forEach(function (ed) {
      ed.addEventListener('input', function () { collectEditors(); U.dirty.mark(); });
    });

    var d = el('yer-md-draft');
    if (d) d.addEventListener('click', function () { collectEditors(); saveDraft(); });
    var sb = el('yer-md-submit');
    if (sb) sb.addEventListener('click', function () { collectEditors(); submit(p); });
    var rt = el('yer-md-return');
    if (rt) rt.addEventListener('click', function () { returnForEdit(p); });
    var myr = el('yer-md-myr');
    if (myr) myr.addEventListener('click', function () { window.switchMainTab(1); });
    var imp = el('yer-md-import');
    if (imp) imp.addEventListener('click', function () { importGoals(p); });
    var rp = el('yer-md-reply-send');
    if (rp) rp.addEventListener('click', function () { sendReply(p); });
  }

  function onRating(key, v) {
    var bits = key.split(':');
    if (bits[0] !== 'my') return;
    if (bits[1] === 'goal') draft.goalScores[bits[2]] = v;
    else if (bits[1] === 'how') draft.howScores[bits[2]] = v;
    else if (bits[1] === 'overall') { draft.overall = draft.overall || {}; draft.overall.score = v; }
    U.dirty.mark();
  }

  function collectEditors() {
    ['what', 'dev', 'how'].forEach(function (type) {
      var ed = el('yer-md-cmt-' + type);
      if (ed && ed.isContentEditable) {
        draft.comments = draft.comments || {};
        draft.comments[type] = ed.innerText.trim();
      }
    });
    var ov = el('yer-md-ov-my-overall');
    if (ov && ov.isContentEditable) {
      draft.overall = draft.overall || {};
      draft.overall.comment = ov.innerText.trim();
    }
  }

  /* ── hành động ───────────────────────────────────────── */
  function submit(p) {
    var missing = [];
    if (draft.overall == null || draft.overall.score == null) {
      missing.push(L('điểm toàn diện', 'the overall rating'));
    }
    if (isLm()) {
      var goals = approvedGoals(p, 'what').concat(approvedGoals(p, 'dev'));
      var lacking = goals.filter(function (g) { return draft.goalScores[g.id] == null; });
      if (lacking.length) missing.push(L('điểm của ' + lacking.length + ' mục tiêu', lacking.length + ' goal scores'));
      ['what', 'dev', 'how'].forEach(function (t) {
        if (!((draft.comments || {})[t] || '').trim()) {
          missing.push(L('nhận xét nhóm ' + (lg() === 'en' ? TYPE[t].en : TYPE[t].vi),
            'the ' + TYPE[t].en + ' comment'));
        }
      });
    }
    if (missing.length) {
      U.dialog({
        title: L('Chưa đủ thông tin để gửi', 'Not enough information to submit'),
        text: L('Còn thiếu: ', 'Still missing: ') + missing.join(', ') + '.',
        buttons: [{ label: L('Đã hiểu', 'Got it'), variant: 'default' }]
      });
      return;
    }

    U.dialog({
      title: isLm() ? L('Gửi đánh giá cho nhân viên này?', 'Submit this review?')
                    : L('Lưu điểm cho nhân viên này?', 'Save this rating?'),
      text: isLm()
        ? L('Gửi xong bạn không sửa và không thu hồi được. Nhân viên sẽ đọc được điểm từng mục tiêu và các ô nhận xét của bạn, nhưng không thấy điểm toàn diện.',
            'Once submitted you cannot edit or withdraw it. The employee will see your goal scores and comments, but never your overall rating.')
        : L('Bạn vẫn sửa được cho tới hết deadline của mình. Nhân viên không thấy điểm này.',
            'You can still edit until your own deadline. The employee never sees this rating.'),
      buttons: [
        { label: L('Quay lại', 'Go back'), variant: 'quiet' },
        { label: isLm() ? L('Gửi đánh giá', 'Submit review') : L('Lưu điểm', 'Save rating'),
          variant: 'default', icon: 'bx-send', act: function () { doSubmit(p); } }
      ]
    });
  }

  function doSubmit(p) {
    var now = S.session().date;
    var payload;
    if (role() === 'lm') {
      payload = { goalScores: draft.goalScores, howScores: draft.howScores,
                  comments: draft.comments, overall: draft.overall, at: now, source: 'manual' };
    } else {
      payload = { score: draft.overall.score, comment: (draft.overall || {}).comment || '',
                  at: now, source: 'manual' };
    }
    S.setAct(S.session().emp, role(), payload);
    S.clearAct(S.session().emp, draftKey());
    U.dirty.clear();
    U.toast(isLm() ? L('Đã gửi đánh giá', 'Review submitted') : L('Đã lưu điểm', 'Rating saved'));
    render();
  }

  /* ENH-E02 §27.2: trả về cho cấp dưới sửa, ràng buộc 24 giờ */
  function returnForEdit(p) {
    var who = isLm() ? L('nhân viên', 'the employee') : L('Quản lý trực tiếp', 'the line manager');
    U.dialog({
      title: L('Trả về để chỉnh sửa?', 'Return for editing?'),
      text: L('Hồ sơ chuyển sang trạng thái Bị trả về để chỉnh sửa và ' + who +
              ' phải nộp lại trong 24 giờ. Deadline của các bước sau giữ nguyên, không giãn ra. ' +
              'Quá 24 giờ mà chưa nộp lại thì hồ sơ quay về trạng thái trước khi trả về và quy trình đi tiếp.',
              'The profile moves to Returned for editing and ' + who +
              ' must resubmit within 24 hours. Later deadlines are unchanged. ' +
              'If nothing comes back in time the profile reverts and the process moves on.'),
      buttons: [
        { label: L('Quay lại', 'Go back'), variant: 'quiet' },
        { label: L('Trả về', 'Return it'), variant: 'default', icon: 'bx-undo', act: function () {
            S.setAct(S.session().emp, 'returned', {
              by: role(), at: S.session().date,
              dueHours: 24
            });
            U.toast(L('Đã trả về, hạn nộp lại trong 24 giờ', 'Returned, due back within 24 hours'));
            render();
          } }
      ]
    });
  }

  /* ENH-E10: Quản lý import mục tiêu thay nhân viên nghỉ thai sản */
  function importGoals(p) {
    U.dialog({
      title: L('Import mục tiêu thay nhân viên', 'Import goals on their behalf'),
      text: L('File Excel 2 sheet WHAT Goals và DEVELOPMENT Goals, giống mẫu ở màn Mục tiêu. ' +
              'Chỉ import được trong thời gian bạn đánh giá. Mục tiêu nhân viên đã tạo và đã được duyệt thì bạn không sửa được.',
              'An Excel file with two sheets, WHAT Goals and DEVELOPMENT Goals, same template as the Goals screen. ' +
              'Only available during your review window. Goals the employee created and had approved cannot be edited.'),
      buttons: [
        { label: L('Quay lại', 'Go back'), variant: 'quiet' },
        { label: L('Chọn file', 'Choose a file'), variant: 'default', icon: 'bx-upload', act: function () {
            U.toast(L('Bản dựng demo chưa gắn file thật', 'File upload is not wired in this prototype'));
          } }
      ]
    });
  }

  function sendReply(p) {
    var ed = el('yer-md-reply');
    var text = ed ? ed.innerText.trim() : '';
    if (!text) {
      U.dialog({ title: L('Chưa nhập nội dung', 'Nothing entered'),
        text: L('Hãy nhập nội dung trả lời trước khi gửi.', 'Please enter your reply before sending.'),
        buttons: [{ label: L('Đã hiểu', 'Got it'), variant: 'default' }] });
      return;
    }
    U.dialog({
      title: L('Gửi trả lời?', 'Send reply?'),
      text: L('Bạn chỉ trả lời được một lần. Gửi xong luồng khóa lại, nhân viên không phản hồi tiếp được.',
              'You may reply only once. After sending, the thread is locked and the employee cannot respond again.'),
      buttons: [
        { label: L('Quay lại', 'Go back'), variant: 'quiet' },
        { label: L('Gửi trả lời', 'Send reply'), variant: 'default', icon: 'bx-send', act: function () {
            var cur = (S.acts(S.session().emp) || {}).response || {};
            S.setAct(S.session().emp, 'response', Object.assign({}, cur, {
              reply: { text: text, at: S.session().date, by: { name: L('Quản lý trực tiếp', 'Line manager'), login: '' } }
            }));
            U.dirty.clear();
            U.toast(L('Đã gửi trả lời', 'Reply sent'));
            render();
          } }
      ]
    });
  }

  /* ── CSS riêng ───────────────────────────────────────── */
  function injectCss() {
    if (el('yer-md-css')) return;
    var st = document.createElement('style');
    st.id = 'yer-md-css';
    st.textContent =
      '#yer-mgr-detail-root .yer-mgr-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-bottom:14px}' +
      '.yer-hd-sub{margin-left:auto;font-size:11.5px;font-weight:400;color:var(--z500);text-transform:none;letter-spacing:0}' +
      '.yer-myr-note{align-items:center}' +
      '.yer-myr-go{margin-left:auto;flex:none;white-space:nowrap}' +
      '.yer-note-mat>i{color:var(--info)}' +
      '.yer-note-late>i{color:var(--warn)}' +
      '.yer-late-file-tag{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:3px 7px;border-radius:99px;background:#fff7ed;color:#9a3412;font-size:10.5px;font-weight:600;vertical-align:middle}' +
      '.yer-note-stop>i{color:var(--err)}' +
      '.yer-note-resign>i{color:var(--err)}' +
      '.yer-req{color:#dc2626;font-weight:700;margin-left:3px}' +
      '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;' +
        'clip:rect(0,0,0,0);white-space:nowrap;border:0}' +
      '.yer-op-hint{font-size:11.5px;color:var(--z500);line-height:1.45;margin:-6px 0 10px}' +
      '.yer-overall-grid{display:grid;gap:0}' +
      '.yer-overall-grid .overall-panel+.overall-panel{border-left:1px solid var(--z200)}' +
      // Nhãn mục tiêu đã chốt hoàn thành và domain người chấm
      '.g-done-chip{display:inline-flex;align-items:center;gap:4px;margin-top:5px;padding:1px 8px;' +
        'border-radius:50px;border:1px solid var(--ok-bd);background:var(--ok-bg);color:var(--ok);' +
        'font-size:11px;font-weight:500;white-space:nowrap}' +
      '.g-done-chip i{font-size:13px}' +
      '.ql-by{margin-top:3px;font-size:10.5px;line-height:1.3;color:var(--z500);' +
        'overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.rv-grid tbody tr.g-row-done{border-left:3px solid var(--ok)}' +
      '.yer-resp-body{padding:14px 16px}' +
      '.yer-resp-tx{font-size:13px;color:var(--z800);line-height:1.6;white-space:pre-wrap}' +
      '.yer-resp-reply{margin-top:12px;padding-top:12px;border-top:1px solid var(--z200)}' +
      '.yer-resp-reply-hd{display:flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;color:var(--z500);margin-bottom:5px}' +
      '.yer-resp-form{margin-top:12px;padding-top:12px;border-top:1px solid var(--z200)}' +
      '.yer-resp-form .btn{margin-top:8px}' +
      '.yer-ed-ro .ev-content{min-height:0;padding:9px 11px;color:var(--z900)}' +
      '.yer-ed-ro{border-color:var(--z200);background:var(--z50)}' +
      '.yer-ed-empty{color:var(--z500)}' +
      '.yer-mgr-empty{padding:48px 20px;text-align:center;color:var(--z500);font-size:13px}' +
      '.yer-mgr-empty i{display:block;font-size:30px;color:var(--z300);margin-bottom:8px}' +
      '#yer-mgr-detail-root .sc-cell,#yer-mgr-detail-root .ql-cell{text-align:center}' +
      '#yer-mgr-detail-root .sc-cell .rt-line,#yer-mgr-detail-root .ql-cell .rt-line{justify-content:center}' +
      '@media(max-width:1100px){.yer-overall-grid{grid-template-columns:1fr!important}' +
        '.yer-overall-grid .overall-panel+.overall-panel{border-left:0;border-top:1px solid var(--z200)}}';
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
    U.dirty.onSaveDraft(function () { collectEditors(); saveDraft(true); });
    render();
  }

  window.PMSYerManagerDetail = { render: render };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
