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
  function submittedDraft(p) {
    if (!mySubmitted(p)) return null;
    if (role() === 'lm') {
      return {
        goalScores: Object.assign({}, p.lm.goalScores || {}),
        howScores: Object.assign({}, p.lm.howScores || {}),
        comments: Object.assign({}, p.lm.comments || {}),
        overall: Object.assign({}, p.lm.overall || {})
      };
    }
    var own = role() === 'lm2' ? p.lm2 : p.hod;
    return { goalScores: {}, howScores: {}, comments: {}, overall: {
      score: own && own.score,
      comment: own && own.comment || ''
    } };
  }
  function loadDraft(p) {
    var d = actsOf()[draftKey()];
    draft = d ? JSON.parse(JSON.stringify(d))
      : submittedDraft(p) || { goalScores: {}, howScores: {}, comments: {}, overall: {} };
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

  function editorToolbar() {
    return '<div class="ev-toolbar" onmousedown="event.preventDefault()">' +
      '<button class="ev-tb-btn" onclick="edCmd(\'bold\')" title="Bold"><span style="font-weight:700;font-size:12px">B</span></button>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'italic\')" title="Italic"><span style="font-style:italic;font-size:12px">I</span></button>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'underline\')" title="Underline"><span style="text-decoration:underline;font-size:12px">U</span></button>' +
      '<span class="ev-tb-sep"></span>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'insertUnorderedList\')" title="List"><i class="bx bx-list-ul" style="font-size:14px"></i></button>' +
      '</div>';
  }

  function editorHtml(id, placeholder, max, value, counterId, readonly) {
    if (readonly) {
      return '<div class="ev-editor-wrap yer-ed-ro"><div class="ev-content" id="' + id + '">' +
        (value ? esc(value) : '<span class="yer-ed-empty">—</span>') + '</div></div>';
    }
    return '<div class="ev-editor-wrap">' + editorToolbar() +
      '<div class="ev-content" contenteditable="true" data-placeholder="' + esc(placeholder) + '" id="' + id +
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
    return Y.managerReviewState(role(), p).canEdit;
  }

  function toolbar(p, canEdit) {
    if (!canEdit) return '';
    var submitted = mySubmitted(p);
    return '<div class="cycle-actions yer-mgr-actions">' +
      (role() === 'lm2' ? '<button class="btn btn-outline btn-sm" id="yer-md-return"><i class="bx bx-undo"></i>' +
        L('Trả về cho Quản lý trực tiếp', 'Return to line manager') + '</button>' : '') +
      (!submitted ? '<button class="btn btn-outline btn-sm" id="yer-md-draft"><i class="bx bx-save"></i>' +
        L('Lưu nháp', 'Save draft') + '</button>' : '') +
      '<button class="btn btn-default btn-sm" id="yer-md-submit"><i class="bx bx-send"></i>' +
        (submitted ? L('Lưu thay đổi', 'Save changes')
          : isLm() ? L('Gửi đánh giá', 'Submit review') : L('Lưu điểm', 'Save rating')) + '</button>' +
    '</div>';
  }

  function detailNav(p, canEdit) {
    return '<div class="manager-detail-nav yer-md-nav">' +
      '<button type="button" class="manager-back" id="yer-md-back"><i class="bx bx-left-arrow-alt"></i>' +
        L('Quay lại danh sách nhân viên', 'Back to employee list') + '</button>' +
      '<div class="manager-nav-right">' + toolbar(p, canEdit) +
        '<button type="button" class="btn btn-cta-outline btn-sm" id="yer-md-feedback"><i class="bx bx-message-square-dots"></i>' +
          L('Phản hồi đã nhận', 'Feedback received') + '</button>' +
      '</div></div>';
  }

  function banner(p) {
    if (!mySubmitted(p)) return '';
    var score = role() === 'lm' ? (p.lm.overall && p.lm.overall.score)
      : role() === 'lm2' ? p.lm2.score : p.hod.score;
    var at = role() === 'lm' ? p.lm.at : role() === 'lm2' ? p.lm2.at : p.hod.at;
    return '<div class="submit-banner yer-md-submit-banner"><div class="sb-icon"><i class="bx bx-check-circle"></i></div>' +
      '<div class="sb-info"><div class="sb-title">' +
        L('Bạn đã hoàn thành đánh giá cho nhân viên này', 'You have completed this review') + '</div>' +
      '<div class="sb-sub">' + L('Cập nhật lần cuối: ', 'Last updated: ') + esc(Y.fmt(at, lg())) +
        ' - ' + L('Bạn có thể chỉnh sửa tới hết hạn ', 'You can edit until ') + esc(Y.fmt(Y.step(role()).to, lg())) +
      '</div></div><div class="sb-score-wrap"><div class="sb-score-group">' +
      '<span class="sb-score-lbl">' + L('Điểm toàn diện của bạn:', 'Your overall rating:') + '</span>' +
      '<span class="sb-score-val">' + (score == null ? '—' : esc(String(score))) + '</span>' +
      '</div></div></div>';
  }

  /* ── ENH-E03: điều hướng sang kết quả giữa năm ───────── */
  function myrLine(p) {
    // Hồ sơ có LWD gộp thông tin Mid-Year vào chính box Lưu ý để không dựng hai box rời.
    if (p.resignFrom && !p.resigned) return '';
    var hasMyr = !!(p.myr && p.myr.submitted);
    if (!hasMyr) {
      return '<div class="info-note yer-myr-note"><i class="bx bx-calendar-x"></i><div>' +
        L('<strong>Không có kết quả Mid-Year.</strong> Nhân viên này không tham gia kỳ đánh giá giữa năm 2026.',
          '<strong>No Mid-Year result.</strong> This employee did not take part in the 2026 mid-year cycle.') +
      '</div></div>';
    }
    return '<div class="info-note yer-myr-note"><i class="bx bx-calendar-star"></i><div>' +
      L('Cần tham khảo kết quả giữa năm thì sang tab <strong>Đánh giá giữa năm</strong> của chính màn này.',
        'To review the mid-year result, switch to the <strong>Mid-Year Review</strong> tab on this same screen.') +
      '</div></div>';
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
    var daysLate = Y.lateDays(p.lateSubmission.at);
    return '<div class="info-note yer-note-late"><i class="bx bx-time-five"></i><div>' +
      '<strong>' + L('Hồ sơ nộp bổ sung Tự đánh giá cuối năm', 'Supplemental year-end self assessment') + '</strong>' +
      '<span class="yer-md-late-status"><strong>' + L('Trễ hạn','Late') + '</strong> ' +
        esc(daysLate + L(' ngày',' day' + (daysLate === 1 ? '' : 's'))) + '</span>' +
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
    var items = [
      L('Nhân viên có Ngày làm việc cuối cùng: <strong>', 'The employee\'s last working day is <strong>') +
        esc(Y.fmt(p.resignFrom, lg())) + '</strong>. ' +
        L('Hãy hoàn thành đánh giá trước ngày này. Hồ sơ không tính vào tỷ lệ hoàn thành và hệ thống không gửi nhắc.',
          'Complete the review before this date. The profile is excluded from the completion rate and no reminders are sent.')
    ];
    if (p.myr && p.myr.submitted) {
      items.push(L('Bạn có thể xem lại kết quả <a href="#" class="yer-note-link" data-go-tab="1">Đánh giá giữa năm</a> 2026 của nhân viên trước khi tự đánh giá cuối năm.',
        'You can review the employee\'s <a href="#" class="yer-note-link" data-go-tab="1">Mid-Year Review</a> 2026 result before the year-end self assessment.'));
    }
    return '<div class="info-note yer-note-block yer-note-resign"><i class="bx bx-info-circle"></i><div>' +
      '<strong>' + L('Lưu ý:', 'Note:') + '</strong><ul class="yer-note-list"><li>' +
      items.join('</li><li>') + '</li></ul></div></div>';
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
        return { id: 'how:' + i, name: lg() === 'en' ? cv.en : cv.vi, result: cv.desc, prio: '', time: '' };
      });
    } else {
      rows = list.map(function (g) {
        // done: mục tiêu Quản lý trước đã đánh giá hoàn thành, Quản lý hiện tại không chấm lại
        return { id: 'goal:' + g.id, name: g.title, result: g.result || '', prio: g.prio || '',
                 time: [g.s, g.e].filter(Boolean).join(' – '),
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
    var myColHead = L('Điểm QLTT', 'Line manager');

    var header = type === 'how'
      ? '<th style="width:30%">' + L('Giá trị cốt lõi', 'Core value') + '</th>' +
        '<th style="width:52%">' + L('Mô tả', 'Description') + '</th>' +
        '<th class="th-c" style="width:9%">' + L('Điểm NV', 'Employee') + '</th>' +
        '<th class="th-c th-ql" style="width:9%">' + esc(myColHead) + '</th>'
      : type === 'what'
      ? '<th style="width:26%">' + L('Tên mục tiêu', 'Goal') + '</th>' +
        '<th style="width:36%">' + L('Kết quả cần đạt', 'Expected result') + '</th>' +
        '<th style="width:9%">' + L('Ưu tiên', 'Priority') + '</th>' +
        '<th style="width:11%">' + L('Thời gian', 'Timeline') + '</th>' +
        '<th class="th-c" style="width:9%">' + L('Điểm NV', 'Employee') + '</th>' +
        '<th class="th-c th-ql" style="width:9%">' + esc(myColHead) + '</th>'
      : '<th style="width:30%">' + L('Tên mục tiêu', 'Goal') + '</th>' +
        '<th style="width:44%">' + L('Kết quả cần đạt', 'Expected result') + '</th>' +
        '<th style="width:10%">' + L('Thời gian', 'Timeline') + '</th>' +
        '<th class="th-c" style="width:8%">' + L('Điểm NV', 'Employee') + '</th>' +
        '<th class="th-c th-ql" style="width:8%">' + esc(myColHead) + '</th>';

    return '<div class="rv-section"><div class="rv-section-hd"><i class="bx ' + t.icon + '"></i>' +
        esc(lg() === 'en' ? t.en : t.vi) + '</div>' +
      '<div class="rv-grid-wrap"><table class="rv-grid"><thead><tr>' + header + '</tr></thead><tbody>' +
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
          (type === 'what' ? '<td><div class="g-meta">' +
            (r.prio ? '<span class="prio prio-' + esc(r.prio) + '">' +
              esc(lg() === 'en' ? (PRIO[r.prio] || {}).en : (PRIO[r.prio] || {}).vi) + '</span>' : '') + '</div></td>' : '') +
          (type === 'how' ? '' : '<td><div class="g-meta">' + esc(r.time || '—') + '</div></td>') +
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
          L('Đánh giá của Quản lý trực tiếp', 'Line manager review') +
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

    var myTitle = role() === 'lm' ? L('Quản lý trực tiếp đánh giá', 'Line manager review')
      : role() === 'lm2' ? L('Quản lý cấp 2 đánh giá', 'Second-level manager review')
      : L('Trưởng đơn vị đánh giá', 'Head of department review');
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
    loadDraft(p);
    syncChrome(p);

    var canEdit = editable(p);
    var html = detailNav(p, canEdit) + banner(p);

    html += stoppedBlock(p) + lateBlock(p) + maternityBlock(p) + resignBlock(p);
    html += myrLine(p);

    if (!p.stopped) {
      html += goalSection(p, 'what', canEdit);
      html += goalSection(p, 'dev', canEdit);
      html += goalSection(p, 'how', canEdit);
      html += overallCard(p, canEdit);
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
        ? L('Đã hoàn thành', 'Completed') : L('Không có dữ liệu', 'No data');
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
    var col = chip && chip.parentElement && chip.parentElement.classList.contains('emp-col')
      ? chip.parentElement : null;
    if (col) {
      var badges = [];
      if (p.resignFrom && !p.resigned) {
        badges.push({ cls: 'yer-lwd', icon: 'bx-log-out',
          html: L('Ngày làm việc cuối cùng: ', 'Last working day: ') +
            '<strong>' + esc(Y.fmt(p.resignFrom, lg())) + '</strong>' });
      }
      if (p.maternity) {
        badges.push({ cls: 'yer-mtn', icon: 'bx-calendar',
          html: p.maternityTo
            ? L('Nghỉ thai sản tới ngày: ', 'On maternity leave until: ') +
              '<strong>' + esc(Y.fmt(p.maternityTo, lg())) + '</strong>'
            : L('Đang nghỉ thai sản', 'On maternity leave') });
      }
      col.querySelectorAll('.emp-badge').forEach(function (badge) { badge.remove(); });
      badges.forEach(function (badge) {
        var node = document.createElement('span');
        node.className = 'emp-badge ' + badge.cls;
        node.innerHTML = '<i class="bx ' + badge.icon + '"></i>' + badge.html;
        col.appendChild(node);
      });
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
    var back = el('yer-md-back');
    if (back) back.addEventListener('click', function () { location.href = '../M-05/index.html'; });
    var feedback = el('yer-md-feedback');
    if (feedback) feedback.addEventListener('click', function () {
      if (typeof window.openFbPopup === 'function') window.openFbPopup();
    });
    document.querySelectorAll('#yer-mgr-detail-root .yer-note-link').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        window.switchMainTab(Number(link.dataset.goTab));
      });
    });
    var imp = el('yer-md-import');
    if (imp) imp.addEventListener('click', function () { importGoals(p); });
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
    var updating = mySubmitted(p);
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
      title: updating
        ? L('Lưu thay đổi đánh giá?', 'Save review changes?')
        : isLm() ? L('Gửi đánh giá cho nhân viên này?', 'Submit this review?')
                 : L('Lưu điểm cho nhân viên này?', 'Save this rating?'),
      text: L('Bạn có thể tiếp tục chỉnh sửa đánh giá của mình tới hết hạn ',
              'You can continue editing your review until ') + Y.fmt(Y.step(role()).to, lg()) + '. ' +
        (isLm()
          ? L('Nhân viên đọc được điểm từng mục tiêu và các ô nhận xét của bạn, nhưng không thấy điểm toàn diện.',
              'The employee can see your goal scores and comments, but never your overall rating.')
          : L('Nhân viên không thấy điểm toàn diện của cấp quản lý.',
              'The employee cannot see manager-level overall ratings.')),
      buttons: [
        { label: L('Quay lại', 'Go back'), variant: 'quiet' },
        { label: updating ? L('Lưu thay đổi', 'Save changes')
            : isLm() ? L('Gửi đánh giá', 'Submit review') : L('Lưu điểm', 'Save rating'),
          variant: 'default', icon: 'bx-send', act: function () { doSubmit(p); } }
      ]
    });
  }

  function doSubmit(p) {
    var updating = mySubmitted(p);
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
    U.toast(updating ? L('Đã lưu thay đổi đánh giá', 'Review changes saved')
      : isLm() ? L('Đã gửi đánh giá', 'Review submitted') : L('Đã lưu điểm', 'Rating saved'));
    render();
  }

  /* Chỉ LM2 còn luồng trả về cho QLTT; đã bỏ trả Self Assessment về cho Nhân viên. */
  function returnForEdit(p) {
    U.dialog({
      title: L('Trả về để chỉnh sửa?', 'Return for editing?'),
      text: L('Hồ sơ chuyển sang trạng thái Bị trả về để chỉnh sửa và Quản lý trực tiếp' +
              ' phải nộp lại trong 24 giờ. Deadline của các bước sau giữ nguyên, không giãn ra. ' +
              'Quá 24 giờ mà chưa nộp lại thì hồ sơ quay về trạng thái trước khi trả về và quy trình đi tiếp.',
              'The profile moves to Returned for editing and the line manager' +
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

  /* ── CSS riêng ───────────────────────────────────────── */
  function injectCss() {
    if (el('yer-md-css')) return;
    var st = document.createElement('style');
    st.id = 'yer-md-css';
    st.textContent =
      '#yer-mgr-detail-root .yer-mgr-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-bottom:0}' +
      '#yer-mgr-detail-root .yer-md-nav{margin-bottom:14px}' +
      '#yer-mgr-detail-root .yer-md-submit-banner{margin-bottom:14px}' +
      '.yer-hd-sub{margin-left:auto;font-size:11.5px;font-weight:400;color:var(--z500);text-transform:none;letter-spacing:0}' +
      '#yer-mgr-detail-root>.info-note{display:flex;gap:8px;align-items:flex-start;margin-bottom:18px;' +
        'padding:11px 14px;background:var(--z0);border:1px solid var(--z200);border-radius:var(--r);' +
        'font-size:12px;color:var(--z600);line-height:1.5}' +
      '#yer-mgr-detail-root>.info-note>i{flex-shrink:0;margin-top:1px;font-size:15px;color:var(--brand)}' +
      '#yer-mgr-detail-root>.info-note strong{color:var(--z700);font-weight:600}' +
      '.yer-myr-note{align-items:center}' +
      '.yer-myr-go{margin-left:auto;flex:none;white-space:nowrap}' +
      '.yer-note-mat>i{color:var(--info)}' +
      '.yer-note-late>i{color:var(--warn)}' +
      '.yer-md-late-status{display:inline-flex;align-items:center;gap:3px;margin-left:8px;padding:3px 8px;border:1px solid #F0D7E5;border-radius:99px;background:#FCEBF5;color:var(--brand);font-size:10.5px;font-weight:600;vertical-align:middle}' +
      '.yer-md-late-status strong{font-weight:800}' +
      '.yer-late-file-tag{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:3px 7px;border-radius:99px;background:#fff7ed;color:#9a3412;font-size:10.5px;font-weight:600;vertical-align:middle}' +
      '.yer-note-stop>i{color:var(--err)}' +
      '.yer-note-resign>i{color:var(--err)}' +
      '.yer-note-list{margin:5px 0 0;padding-left:16px;display:flex;flex-direction:column;gap:3px}' +
      '.yer-note-list li{line-height:1.55}' +
      '.yer-note-link{color:var(--brand);font-weight:600;text-decoration:underline;text-underline-offset:2px;cursor:pointer}' +
      '.yer-note-link:hover{color:var(--brand-h)}' +
      '.emp-badge{display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:var(--rxs);' +
        'border:1px solid;font-size:12px;font-weight:500;white-space:nowrap}' +
      '.emp-badge i{font-size:15px}' +
      '.emp-badge strong{font-weight:700}' +
      '.yer-lwd{border-color:var(--err-bd);background:var(--err-bg);color:var(--err)}' +
      '.yer-mtn{border-color:var(--brand-ring);background:var(--brand-muted);color:var(--brand)}' +
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
      '#yer-mgr-detail-root .ev-toolbar{display:flex}' +
      '.yer-ed-ro .ev-content{min-height:0;padding:9px 11px;color:var(--z900)}' +
      '.yer-ed-ro{border-color:var(--z200);box-shadow:none;background:var(--z50)}' +
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
