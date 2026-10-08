/* ═══════════════════════════════════════════════════════════
   YER Manager Detail — tab Đánh giá cuối năm của màn M-06
   Bám đúng ngôn ngữ thiết kế của tab Đánh giá giữa năm trong cùng màn M-06:
   cycle-actions, submit-banner, info-note, rv-section + rv-grid,
   cặp scmt-panel, overall-card. Chỉ khác ở phần riêng của kỳ cuối năm.

   Ba vai dùng chung màn này nhưng làm ba việc khác nhau (YER-SPEC §3):
     - Quản lý trực tiếp: điểm từng mục tiêu + 3 nhận xét nhóm + điểm toàn diện
     - Quản lý cấp 2 / Trưởng đơn vị: chỉ xem ở màn này, chấm điểm toàn diện ở danh sách M-05 (04/10/2026)
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
  // Năm giá trị cốt lõi: một nguồn ở yer-data.js, cùng câu chữ với tab Giữa năm (chốt 02/10/2026)
  var CORE_VALUES = window.PMS_CORE_VALUES;
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
      (opts.def ? ' data-def="' + esc(opts.def) + '"' : '') +
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
  /* Sau khi gửi, màn về chế độ xem: ô điểm, ô nhận xét chỉ đọc, không có trợ lý AI. Vai còn trong timeline bấm
     `Chỉnh sửa` ở banner mới mở lại các ô, rồi `Lưu thay đổi` hoặc `Hủy chỉnh sửa` (chốt 02/10/2026).
     Trạng thái chỉ giữ trong trang đang mở: tải lại trang là về chế độ xem. */
  var editingMem = {};
  function editKey(p) { return p.id + '|' + role(); }
  function isEditing(p) { return !!editingMem[editKey(p)]; }
  // Chỉ QLTT sửa trên màn chi tiết; Quản lý cấp 2, Trưởng đơn vị chỉ xem (canEditDetail, chốt 04/10/2026)
  function canReopen(p) { return mySubmitted(p) && Y.managerReviewState(role(), p).canEditDetail && !isEditing(p); }
  function editable(p) {
    return Y.managerReviewState(role(), p).canEditDetail && (!mySubmitted(p) || isEditing(p));
  }

  function toolbar(p, canEdit) {
    if (!canEdit) return '';
    var submitted = mySubmitted(p);
    // .yer-md-actbar giữ chỗ cũ khi nhóm nút nổi lên lúc cuộn (bindFloatingToolbar)
    return '<div class="yer-md-actbar"><div class="cycle-actions yer-mgr-actions">' +
      // Đang sửa bản đã gửi: nút Hủy chỉnh sửa nằm trong khối đang chỉnh sửa (editNote), như E-05
      (!submitted ? '<button class="btn btn-outline btn-sm" id="yer-md-draft"><i class="bx bx-save"></i>' +
        L('Lưu nháp', 'Save draft') + '</button>' : '') +
      '<button class="btn btn-default btn-sm" id="yer-md-submit"><i class="bx bx-send"></i>' +
        (submitted ? L('Lưu thay đổi', 'Save changes')
          : isLm() ? L('Gửi đánh giá', 'Submit review') : L('Lưu điểm', 'Save rating')) + '</button>' +
    '</div></div>';
  }

  function detailNav(p, canEdit) {
    return '<div class="manager-detail-nav yer-md-nav">' +
      '<button type="button" class="manager-back" id="yer-md-back"><i class="bx bx-left-arrow-alt"></i>' +
        L('Quay lại danh sách nhân viên', 'Back to employee list') + '</button>' +
      '<div class="manager-nav-right">' + toolbar(p, canEdit) +
        // Nút Quy trình (chị chọn phương án 1, 07/10/2026; dải quy trình vẫn giữ tới khi sếp duyệt bỏ một trong hai)
        U.procMenu(stepItemsOf(p), { title: L('Quy trình đánh giá cuối năm 2026', 'Year-End Review 2026 process') }) +
        // AI Summary bấm mới chạy, cho cả QLTT, LM2, HOD (§14)
        '<button type="button" class="btn btn-outline btn-sm yer-md-ai" id="yer-md-ai"><i class="bx bxs-magic-wand"></i>AI Summary</button>' +
        '<button type="button" class="btn btn-cta-outline btn-sm" id="yer-md-feedback"><i class="bx bx-message-square-dots"></i>' +
          L('Phản hồi đã nhận', 'Feedback received') + '</button>' +
      '</div></div>';
  }

  /* Tên vai trong câu chữ của màn Quản lý (chốt 02/10/2026): ghi rõ vai thay cho `Bạn`, vì một người có thể giữ nhiều vai. */
  var ROLE_NAME = {
    lm: ['QLTT', 'The line manager'],
    lm2: ['Quản lý cấp 2', 'The second-level manager'],
    hod: ['Trưởng đơn vị', 'The head of department']
  };
  function roleName(r) { return L(ROLE_NAME[r || role()][0], ROLE_NAME[r || role()][1]); }
  // Tên vai đứng giữa câu tiếng Anh viết thường (`the line manager`); đầu câu dùng roleName()
  function roleLow(r) { var n = roleName(r); return lg() === 'en' ? n.charAt(0).toLowerCase() + n.slice(1) : n; }
  // Mốc giờ in đậm đủ `18:00 ngày dd/mm/yyyy` (DS §19, chốt 04/10/2026), dùng cho mọi câu hạn trên màn
  function at18(d) {
    var t = esc(Y.fmt(d, lg()));
    return L('<strong>18:00 ngày ' + t + '</strong>', '<strong>18:00 on ' + t + '</strong>');
  }

  // Hồ sơ nộp bổ sung luôn mang nhãn trễ hạn trong banner, như banner của Nhân viên (§27.3)
  /* Nộp bổ sung: dòng ngắn ở tầng trên (ngày nộp, nhãn trễ hạn) và dòng lần nhắc kèm hình thức xử lý (nếu có) ở tầng dưới */
  function lateParts(p, prefix) {
    if (!p.lateSubmission) return null;
    var days = Y.lateDays(p.lateSubmission.at);
    var csq = lateConsequence(p.lateRound);
    var round = p.lateRound ? p.lateRound.round : null;
    return {
      line: prefix + esc(Y.fmt(p.lateSubmission.at, lg())) +
        ' <span class="yer-late-status">' +
        esc(L('Trễ hạn ' + days + ' ngày làm việc', 'Late by ' + days + ' working day' + (days === 1 ? '' : 's'))) + '</span>',
      // Lần nhắc in đậm (04/10/2026); có hình thức xử lý thì nối ngay sau
      csq: round || csq
        ? (round ? L('<strong>Nộp bổ sung ở lần nhắc thứ ' + round + '</strong>', '<strong>Submitted at reminder ' + round + '</strong>') : '') +
          (csq ? (round ? ' - ' : '') + L('Hình thức xử lý theo quy định: ', 'Measure under policy: ') + csq : '.')
        : ''
    };
  }

  /* Khung banner xanh của màn chi tiết (sắp lại 04/10/2026, chị góp ý chữ tràn sang phần điểm):
     - tầng trên: icon, tiêu đề, MỘT dòng ngày (kèm liên kết `Lịch sử chỉnh sửa` khi có), bên phải điểm và nút;
     - tầng dưới (`.yer-sb-more`, trải hết chiều ngang): các dòng dài như hình thức xử lý, xác nhận mục tiêu.
     Phần chữ không bao giờ bị ép hẹp bởi phần điểm. */
  function bannerBox(o) {
    // Khung dùng chung với E-05 (PMSUi.banner, chốt 05/10/2026): sửa khung ở yer-ui.js để hai màn luôn giống nhau
    return window.PMSUi.banner({ cls: 'yer-md-submit-banner' + (o.cls ? ' ' + o.cls : ''), icon: o.icon, title: o.title,
      sub: o.sub, right: o.right, more: o.more });
  }
  function historyLink(p) {
    return isLm() && myLog(p).length ? ' - <button type="button" class="yer-sb-link" id="yer-md-history"><i class="bx bx-history"></i>' +
      L('Lịch sử chỉnh sửa', 'Edit history') + '</button>' : '';
  }

  /* Phần bên phải dùng chung cho mọi banner của màn chi tiết (chốt 04/10/2026): `Điểm NV tự đánh giá`, `Điểm cuối cùng`
     (luôn hiện, `—` cho tới khi hệ thống công bố) và nút tải kết quả (luôn hiện); `Chỉnh sửa` khi vai đang xem còn sửa được. */
  function bannerRight(p) {
    var name = ROLE_NAME[role()];
    var win = Y.managerEditWindow(role(), p);
    var editTip = L(name[0] + ' chỉnh sửa được tới hết 18:00 ngày ' + Y.fmt(win.to, lg()),
      name[1] + ' can edit until 18:00 on ' + Y.fmt(win.to, lg()));
    var selfScore = p.self && p.self.overall ? p.self.overall.score : null;
    var finalScore = p.published && p.final ? p.final.score : null;
    var finalTip = L('Có điểm khi quy trình đánh giá hoàn tất và hệ thống công bố kết quả.',
      'Shown once the review process is complete and the system publishes the result.');
    var dlLabel = L('Tải kết quả đánh giá', 'Download review result');
    return '<div class="sb-score-wrap">' +
        '<div class="sb-score-group"><span class="sb-score-lbl">' + L('Điểm NV tự đánh giá:', 'Employee self rating:') + '</span>' +
          '<span class="sb-score-val">' + (selfScore == null ? '—' : esc(String(selfScore))) + '</span></div>' +
        '<div class="sb-score-group"><span class="sb-score-lbl">' + L('Điểm cuối cùng:', 'Final rating:') + '</span>' +
          '<span class="sb-score-val"' + (finalScore == null ? ' tabindex="0" aria-label="' + esc(finalTip) + '" data-tip="' + esc(finalTip) +
            '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()"' : '') + '>' +
            (finalScore == null ? '—' : esc(String(finalScore))) + '</span></div>' +
      '</div>' +
      '<div class="sb-actions">' +
        (canReopen(p) ? '<button class="btn btn-cta-outline btn-sm" type="button" id="yer-md-edit" data-tip="' + esc(editTip) +
          '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()"><i class="bx bx-edit-alt"></i>' + L('Chỉnh sửa', 'Edit') + '</button>' : '') +
        '<div class="yer-dl-menu" id="yer-md-dl-menu">' +
        '<button class="btn btn-outline sb-icon-action yer-dl-toggle" type="button" id="yer-md-dl" aria-haspopup="menu" aria-expanded="false" ' +
          'aria-label="' + esc(dlLabel) + '" data-tip="' + esc(dlLabel) + '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()">' +
          '<i class="bx bx-download"></i></button>' +
        '<div class="yer-dl-pop" role="menu">' +
          '<button class="yer-dl-opt" type="button" role="menuitem" data-md-dl="pdf"><i class="bx bxs-file-pdf"></i> PDF (.pdf)</button>' +
          '<button class="yer-dl-opt" type="button" role="menuitem" data-md-dl="xlsx"><i class="bx bx-spreadsheet"></i> Excel (.xlsx)</button>' +
        '</div></div></div>';
  }

  /* Hồ sơ nộp bổ sung khi vai đang xem chưa gửi (chốt 02/10/2026, sửa 07/10/2026): banner như banner `Đã hoàn thành bổ sung
     Tự đánh giá cuối năm` của E-05. Nhân viên làm Tự đánh giá trên màn và mục tiêu đã qua QLTT duyệt, nên không còn câu
     xác nhận mục tiêu trong file (§27.1). */
  function lateBanner(p) {
    if (!p.lateSubmission || mySubmitted(p)) return '';
    var lp = lateParts(p, L('Ngày gửi: ', 'Submitted on: '));
    return bannerBox({ cls: 'yer-md-late-banner',
      title: L('Nhân viên đã hoàn thành bổ sung Tự đánh giá cuối năm', 'The employee completed a late year-end self assessment'),
      sub: lp.line, right: bannerRight(p),
      more: [lp.csq].filter(Boolean) });
  }

  /* Vai đang xem chưa gửi: banner đầu tab nói tình trạng Tự đánh giá của nhân viên, như tab Giữa năm của M-06
     (`Nhân viên đã hoàn thành Tự đánh giá MYR 2026` xanh, `… chưa hoàn thành …` xám) (chốt 04/10/2026).
     Nộp bổ sung dùng lateBanner; chờ nộp bổ sung, Không đánh giá, thai sản đã có khối riêng nên không thêm banner. */
  function selfBanner(p) {
    if (!p.self || p.lateSubmission) return '';
    return bannerBox({ cls: 'yer-md-self-banner',
      title: L('Nhân viên đã hoàn thành Tự đánh giá cuối năm', 'The employee completed the year-end self assessment'),
      sub: L('Ngày gửi: ', 'Submitted on: ') + esc(Y.fmt(p.self.at, lg())), right: bannerRight(p) });
  }
  function pendingBanner(p) {
    if (p.self || p.lateSubmission || p.maternity || p.stopped || p.resigned || Y.lateWaiting(p)) return '';
    var ended = Y.stepState('self', p.now) === 'closed' && !p.lateWindowOpen;
    var title = ended
      ? L('Nhân viên không Tự đánh giá cuối năm', 'The employee did not complete the year-end self assessment')
      : L('Nhân viên chưa hoàn thành Tự đánh giá cuối năm', 'The employee has not completed the year-end self assessment');
    // Chị chốt 04/10/2026: chưa gửi thì không có dòng phụ; không gửi thì chỉ QLTT có dòng `QLTT tiến hành đánh giá theo quy trình.`
    var sub = ended && isLm()
      ? L('QLTT tiến hành đánh giá theo quy trình.', 'The line manager proceeds with the review as usual.')
      : '';
    return bannerBox({ cls: 'submit-banner--pending yer-md-pending-banner', icon: 'bx-time-five', title: title, sub: sub });
  }

  /* Banner sau khi vai đang xem gửi (chốt 02/10/2026, sắp lại 04/10/2026):
     - tiêu đề `[Vai trò] đã hoàn thành đánh giá cuối năm`; đã công bố thì `Đã công bố kết quả đánh giá cuối năm 2026` như E-05;
     - dòng ngày: ngày gửi của vai (LM2, HOD: ngày lưu điểm) hoặc ngày công bố, kèm liên kết `Lịch sử chỉnh sửa`;
     - hồ sơ nộp bổ sung: tầng dưới ghi ngày nhân viên nộp bổ sung, nhãn trễ hạn, lần nhắc và hình thức xử lý;
     - đang chỉnh sửa thì khối `đang chỉnh sửa` thay cho banner (editNote), như E-05. */
  function priorBanner(p) {
    var prev = role() === 'hod' && p.lm2 && !p.lm2.synced ? 'lm2'
      : role() !== 'lm' && p.lm && !p.lm.synced ? 'lm' : null;
    if (!prev) return '';
    var own = prev === 'lm' ? p.lm : p.lm2;
    var name = ROLE_NAME[prev];
    var lp = lateParts(p, L('Nhân viên nộp bổ sung Tự đánh giá ngày ', 'Late self assessment submitted on '));
    return bannerBox({ title: L(name[0] + ' đã hoàn thành đánh giá cuối năm', name[1] + ' has completed the year-end review'),
      sub: (prev === 'lm' ? L('Ngày gửi: ', 'Submitted on: ') : L('Ngày lưu điểm: ', 'Rating saved on: ')) + esc(Y.fmt(own.at, lg())),
      right: bannerRight(p), more: lp ? [lp.line, lp.csq].filter(Boolean) : [] });
  }

  function banner(p) {
    // Vai chưa gửi: banner nói bước gần nhất đã xong (QLTT hoặc Quản lý cấp 2), không có thì nói tình trạng Tự đánh giá
    if (!mySubmitted(p)) return priorBanner(p) || lateBanner(p) || selfBanner(p) || pendingBanner(p);
    if (isEditing(p)) return editNote(p);
    var name = ROLE_NAME[role()];
    var title = p.published
      ? L('Đã công bố kết quả đánh giá cuối năm 2026', 'Year-End Review 2026 result published')
      : L(name[0] + ' đã hoàn thành đánh giá cuối năm', name[1] + ' has completed the year-end review');
    var date = p.published && p.final && p.final.publishedAt
      ? L('Ngày công bố: ', 'Published on: ') + esc(Y.fmt(p.final.publishedAt, lg()))
      : (isLm() ? L('Ngày gửi: ', 'Submitted on: ') : L('Ngày lưu điểm: ', 'Rating saved on: ')) + esc(Y.fmt(ownAt(p), lg()));
    var lp = lateParts(p, L('Nhân viên nộp bổ sung Tự đánh giá ngày ', 'Late self assessment submitted on '));
    return bannerBox({ title: title, sub: date + historyLink(p), right: bannerRight(p),
      more: lp ? [lp.line, lp.csq].filter(Boolean) : [] });
  }

  function ownAt(p) {
    var own = role() === 'lm' ? p.lm : role() === 'lm2' ? p.lm2 : p.hod;
    return own && own.at;
  }
  /* Đang chỉnh sửa bản đã gửi (chốt 04/10/2026, cùng luồng với E-05 §8): khối màu nhẹ thay cho banner, nói phạm vi sửa và hạn,
     nút `Hủy chỉnh sửa` nằm trong khối. */
  function editNote(p) {
    var R = roleName();
    var to = esc(Y.fmt(Y.managerEditWindow(role(), p).to, lg()));
    return '<div class="yer-note action yer-edit-note"><i class="bx bx-edit-alt"></i><div>' +
      '<strong>' + L(R + ' đang chỉnh sửa đánh giá đã gửi ngày ' + esc(Y.fmt(ownAt(p), lg())),
        R + ' is editing the review submitted on ' + esc(Y.fmt(ownAt(p), lg()))) + '</strong>' +
      '<ul class="yer-note-list"><li>' +
      (isLm()
        ? L('<strong>Phạm vi chỉnh sửa:</strong> QLTT có thể sửa điểm, nhận xét của mọi nhóm mục tiêu và phần đánh giá toàn diện.',
            '<strong>What you can edit:</strong> ratings and comments of every goal group and the overall assessment.')
        : L('<strong>Phạm vi chỉnh sửa:</strong> ' + R + ' có thể sửa điểm toàn diện và nhận xét toàn diện.',
            '<strong>What you can edit:</strong> the overall rating and the overall comment.')) + '</li><li>' +
      L('<strong>Thời hạn và lưu ý:</strong> Vui lòng lưu thay đổi trước <strong>18:00 ngày ' + to + '</strong>. Sau thời hạn này, nếu chưa lưu, hệ thống giữ bản đánh giá đã gửi gần nhất.',
        '<strong>Deadline:</strong> please save your changes before <strong>18:00 on ' + to + '</strong>. After that, the latest submitted review stands.') +
      '</li></ul></div>' +
      '<button class="btn btn-outline btn-sm yn-cta" type="button" id="yer-md-cancel-edit"><i class="bx bx-undo"></i>' +
        L('Hủy chỉnh sửa', 'Discard changes') + '</button></div>';
  }

  /* ── Lịch sử chỉnh sửa của vai đang xem (chốt 04/10/2026, cùng thẻ `.yer-ver` với E-05 §8.2) ──
     Mỗi lần gửi (QLTT) hoặc lưu điểm (LM2, HOD) là một thẻ, mới nhất ở trên, thẻ đang ghi nhận viền xanh.
     Lần sau ghi thay đổi so với lần trước. Lưu trên danh sách M-05 hay HRBP tải lên thì ghi rõ cách lưu. */
  function myLog(p) {
    return (role() === 'lm' ? p.lmLog : role() === 'lm2' ? p.lm2Log : p.hodLog) || [];
  }
  var LOG_SOURCE = {
    grid: [' (lưu trên danh sách)', ' (saved on the list)'],
    'approve-prev': [' (duyệt điểm cấp trước)', ' (approved the previous level)'],
    upload: [' (tải lên từ file)', ' (uploaded from file)'],
    'hrbp-upload': [' (duyệt điểm HRBP upload)', ' (approved HRBP upload)']
  };
  function logWhen(it) {
    return it.time ? L('lúc ' + it.time + ' ngày ' + Y.fmt(it.at, lg()), 'at ' + it.time + ' on ' + Y.fmt(it.at, lg()))
                   : L('ngày ' + Y.fmt(it.at, lg()), 'on ' + Y.fmt(it.at, lg()));
  }
  function logChanges(it, prev) {
    var out = [];
    var none = L('trống', 'empty');
    if (it.score !== prev.score) {
      out.push(L('Điểm toàn diện: ', 'Overall rating: ') + (prev.score == null ? none : prev.score) + ' → ' + (it.score == null ? none : it.score));
    }
    var c = it.changes || {};
    ['what', 'dev'].forEach(function (t) {
      if ((c.goalScoresByType || {})[t]) out.push(L('Điểm ' + TYPE[t].vi + ': sửa ' + c.goalScoresByType[t] + ' mục tiêu',
        TYPE[t].en + ' ratings: ' + c.goalScoresByType[t] + ' changed'));
    });
    if (c.howScores) out.push(L('Điểm giá trị cốt lõi: sửa ' + c.howScores + ' giá trị', 'Core value ratings: ' + c.howScores + ' changed'));
    var cm = (c.comments || []).map(function (t) { return lg() === 'en' ? TYPE[t].en : TYPE[t].vi; });
    if ((it.comment || '') !== (prev.comment || '')) cm.push(L('Nhận xét toàn diện', 'Overall comment'));
    if (cm.length) out.push(L('Nhận xét đã sửa: ', 'Comments edited: ') + cm.join(', '));
    if (!out.length) out.push(L('Không thay đổi nội dung', 'No content changes'));
    return out;
  }
  function historyDialog(p) {
    var items = myLog(p);
    var verb = isLm() ? L('Lần gửi ', 'Submission ') : L('Lần lưu ', 'Save ');
    var sent = isLm() ? L('Gửi ', 'Sent ') : L('Lưu ', 'Saved ');
    var last = items[items.length - 1];
    var cards = items.map(function (it, i) {
      var cur = i === items.length - 1;
      var src = LOG_SOURCE[it.source];
      var lines = i ? logChanges(it, items[i - 1]) : [];
      return '<li class="yer-ver' + (cur ? ' current' : '') + '">' +
        '<div class="yer-ver-hd"><strong>' + esc(verb + (i + 1) + (src ? L(src[0], src[1]) : '')) + '</strong>' +
          (cur ? '<span class="yer-log-cur"><i class="bx bx-check"></i>' + L('Đang được ghi nhận', 'Current') + '</span>' : '') + '</div>' +
        '<div class="yer-ver-when"><i class="bx bx-time-five"></i>' + esc(sent + logWhen(it)) + '</div>' +
        (i === 0 ? '<div class="yer-ver-sec"><ul class="yer-log-tx"><li>' +
            esc(L('Điểm toàn diện: ', 'Overall rating: ') + (it.score == null ? '—' : it.score)) + '</li></ul></div>' : '') +
        (lines.length ? '<div class="yer-ver-sec"><div class="yer-ver-lbl">' + esc(L('Thay đổi so với ', 'Changes from ') + verb.toLowerCase() + i) + '</div>' +
          '<ul class="yer-log-tx">' + lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>' : '') +
        '</li>';
    }).reverse().join('');
    U.dialog({
      className: 'yer-log-dialog',
      title: isLm() ? L('Lịch sử chỉnh sửa đánh giá của Quản lý trực tiếp', 'Line manager review edit history')
                    : L('Lịch sử chỉnh sửa điểm của ' + roleName(), roleName() + ' rating edit history'),
      html: (last ? '<div class="yer-log-sum"><i class="bx bx-check-shield"></i><div>' +
            L('Bản đang được ghi nhận: <strong>' + esc(verb + items.length) + '</strong>, ' + esc(sent.toLowerCase() + logWhen(last)),
              'Current version: <strong>' + esc(verb.toLowerCase() + items.length) + '</strong>, ' + esc(sent.toLowerCase() + logWhen(last))) +
            (isEditing(p) ? '<br>' + L(roleName() + ' đang chỉnh sửa. Bản này vẫn được giữ cho tới khi lưu thay đổi.',
              roleName() + ' is editing. This version is kept until the changes are saved.') : '') +
          '</div></div>' : '') +
        '<ol class="yer-vers">' + cards + '</ol>',
      buttons: [{ label: L('Đóng', 'Close'), variant: 'quiet' }]
    });
  }

  // Mở lại bản đã gửi: hỏi xác nhận trước như E-05 (chốt 04/10/2026)
  function confirmReopen(p) {
    var to = esc(Y.fmt(Y.managerEditWindow(role(), p).to, lg()));
    U.dialog({
      title: L('Xác nhận chỉnh sửa đánh giá cuối năm đã gửi?', 'Edit your submitted year-end review?'),
      html: '<p>' + L(roleName() + ' có thể sửa điểm và nhận xét tới hết <strong>18:00 ngày ' + to + '</strong>.',
          roleName() + ' can change ratings and comments until <strong>18:00 on ' + to + '</strong>.') + '</p>' +
        '<p class="yer-dlg-p">' + L('Nếu không lưu thay đổi trước thời hạn trên, hệ thống giữ bản đánh giá đã gửi ngày <strong>' + esc(Y.fmt(ownAt(p), lg())) + '</strong>.',
          'If you do not save before then, the review submitted on <strong>' + esc(Y.fmt(ownAt(p), lg())) + '</strong> stands.') + '</p>',
      buttons: [
        { label: L('Để sau', 'Later'), variant: 'quiet' },
        { label: L('Chỉnh sửa', 'Edit'), variant: 'default', icon: 'bx-edit-alt', act: function () {
            editingMem[editKey(p)] = true;
            render();
          } }
      ]
    });
  }
  function confirmCancelEdit(p) {
    U.dialog({
      title: L('Hủy chỉnh sửa?', 'Discard your changes?'),
      html: L('Mọi thay đổi chưa lưu sẽ bị bỏ. Bản đánh giá gửi ngày <strong>' + esc(Y.fmt(ownAt(p), lg())) + '</strong> được giữ nguyên.',
        'All unsaved changes are discarded. The review submitted on <strong>' + esc(Y.fmt(ownAt(p), lg())) + '</strong> stays as it is.'),
      buttons: [
        { label: L('Tiếp tục chỉnh sửa', 'Keep editing'), variant: 'quiet' },
        { label: L('Hủy chỉnh sửa', 'Discard changes'), variant: 'default', act: function () {
            delete editingMem[editKey(p)];
            S.clearAct(p.id, draftKey());
            U.dirty.clear();
            render();
          } }
      ]
    });
  }

  /* ── Hạn đánh giá và chỉnh sửa của vai đang xem (§8.3) ──
     Hạn lấy từ PMSYer.managerEditWindow, hạn chung của bước cho mọi hồ sơ (§27.3). Danh sách M-05 đọc cùng helper.
     Câu chữ gọi tên vai (QLTT, Quản lý cấp 2, Trưởng đơn vị) thay cho `Bạn` (chốt 02/10/2026). */
  var WAIT_FOR = {
    lm2: ['Quản lý trực tiếp gửi đánh giá', 'the line manager submits their review'],
    hod: ['Quản lý cấp 2 lưu điểm', 'the second-level manager saves a rating']
  };
  function windowText(p, canEdit) {
    if (mySubmitted(p) || p.stopped || p.resigned) return '';
    var win = Y.managerEditWindow(role(), p);
    var R = roleName();
    var from = '<strong>' + esc(Y.fmt(win.from, lg())) + '</strong>';
    var to = at18(win.to);
    if (win.state === 'future') {
      // Chỉ nói khi nào mở, bỏ câu `Trước ngày mở, … chỉ xem được hồ sơ…` (04/10/2026)
      return L('Bước đánh giá của ' + R + ' mở từ ' + from + ' tới hết ' + to + '.',
        R + ' can review from ' + from + ' until ' + to + '.');
    }
    if (win.state === 'closed') {
      return L('Bước đánh giá của ' + R + ' đã kết thúc lúc ' + to + ', màn này chỉ để xem.',
        'The review step of ' + roleLow() + ' ended at ' + to + '; this screen is view-only.');
    }
    if (canEdit) {
      return isLm()
        ? L('Sau khi gửi đánh giá, ' + R + ' có thể chỉnh sửa tới hết ' + to + '.',
            'After submitting, ' + roleLow() + ' can edit until ' + to + '.')
        : L('Sau khi lưu điểm, ' + R + ' có thể chỉnh sửa tới hết ' + to + '.',
            'After saving the rating, ' + roleLow() + ' can edit until ' + to + '.');
    }
    // Quản lý cấp 2, Trưởng đơn vị chỉ xem ở màn này, chấm và sửa ở danh sách M-05 (chốt 04/10/2026)
    if (!isLm() && Y.managerReviewState(role(), p).canEdit) {
      return L('Màn này chỉ để xem. ' + R + ' chấm và chỉnh sửa điểm toàn diện tại danh sách nhân viên của tab Đánh giá cuối năm, tới hết ' + to + '.',
        'This screen is view-only. ' + R + ' rates and edits the overall rating in the employee list of the Year-End Review tab, until ' + to + '.');
    }
    if (WAIT_FOR[role()]) {
      var w = WAIT_FOR[role()];
      return L(R + ' đánh giá được sau khi ' + w[0] + ', tới hết ' + to + '.',
        R + ' can review once ' + w[1] + ', until ' + to + '.');
    }
    return '';
  }

  /* ── Mascot hướng dẫn (chốt 04/10/2026, cùng component U.mascotGuide với E-05, YER-SPEC §43) ──
     Bóng thoại nói vai đang xem đang ở bước nào; tour đi qua đúng các khối đang có trên màn, theo vai và tình trạng hồ sơ. */
  function mascotStep(p, canEdit) {
    if (p.stopped) return L('Dừng quy trình đánh giá cuối năm', 'Year-end review stopped');
    if (Y.lateWaiting(p)) return L('Chờ nhân viên nộp bổ sung', 'Waiting for the late self assessment');
    if (mySubmitted(p)) return isEditing(p) ? L('Chỉnh sửa đánh giá', 'Editing the review') : L('Đã hoàn thành đánh giá', 'Review completed');
    if (canEdit) return isLm() && p.maternity ? L('Đánh giá nhân viên thai sản', 'Maternity review') : L('Đánh giá cuối năm', 'Year-end review');
    var win = Y.managerEditWindow(role(), p);
    // Màn Quản lý gọi tên vai, không dùng `bạn` (DS §19)
    if (win.state === 'future') return L('Chờ mở bước đánh giá của ' + roleName(), 'Waiting for the step of ' + roleLow() + ' to open');
    if (win.state === 'closed') return L('Đã hết hạn đánh giá', 'Review closed');
    if (!isLm() && Y.managerReviewState(role(), p).canEdit) return L('Chờ ' + roleName() + ' đánh giá', 'Awaiting ' + roleLow());
    return L('Chờ cấp trước đánh giá', 'Waiting for the previous level');
  }
  function tourItems(p, canEdit) {
    var R = roleName();
    var to = Y.fmt(Y.managerEditWindow(role(), p).to, lg());
    var items = [
      { sel: '#tab-yer', pose: 'wave.png',
        title: L('Đánh giá cuối năm của nhân viên', 'The employee year-end review'),
        text: L('Tab Đánh giá giữa năm để xem lại kết quả giữa năm; tab Đánh giá cuối năm là nơi ' + R + ' đánh giá. Nhãn trên tab cho biết kỳ đó đang diễn ra hay đã hoàn tất.',
          'The Mid-Year tab shows the mid-year result; the Year-End tab is where ' + roleLow() + ' reviews. The tab label shows whether the cycle is active or completed.') },
      { sel: '#yer-md-steps', pose: 'run.png',
        title: L('Hồ sơ đang ở bước nào', 'Where the profile stands'),
        text: L('Bước tô hồng là bước đang mở. Mỗi bước ghi người phụ trách và hạn chót.',
          'The pink step is open now. Each step names its owner and deadline.') }
    ];
    var root = '#yer-mgr-detail-root ';
    if (p.stopped) {
      items.push({ sel: root + '.yer-late-closed', pose: 'think.png', title: L('Dừng quy trình đánh giá cuối năm', 'Year-end review stopped'),
        text: L('Quy trình của hồ sơ này đã dừng và không có điểm. Khối vàng nói rõ lý do.', 'This profile stopped with no rating. The yellow block explains why.') });
      return items;
    }
    if (Y.lateWaiting(p)) {
      items.push({ sel: root + '.yer-late-wait', pose: 'think.png', title: L('Đang chờ nhân viên nộp bổ sung', 'Waiting for the late self assessment'),
        text: L('Khối vàng nói lần nhắc đang mở, hạn nộp và điều gì xảy ra nếu nhân viên không nộp.',
          'The yellow block shows the open reminder, its deadline and what happens if nothing is submitted.') });
      return items;
    }
    if (p.lateSubmission && !mySubmitted(p)) {
      items.push({ sel: root + '.yer-md-late-banner', pose: 'think.png', title: L('Hồ sơ nộp bổ sung', 'Late submission'),
        text: L('Banner nói số ngày trễ, lần nhắc và hình thức xử lý theo quy định nếu có.', 'The banner shows the days late, the reminder and the measure under policy, if any.') });
    }
    if (mySubmitted(p) && !isEditing(p)) {
      items.push({ sel: root + '.yer-md-submit-banner', pose: 'cheer.png', title: L(R + ' đã hoàn thành đánh giá', R + ' completed the review'),
        text: canReopen(p)
          ? L('Bấm Chỉnh sửa để sửa điểm và nhận xét tới hết 18:00 ngày ' + to + '. Điểm cuối cùng có khi hệ thống công bố kết quả.',
              'Choose Edit to change ratings and comments until 18:00 on ' + to + '. The final rating appears once results are published.')
          : L('Đã hết hạn chỉnh sửa nên nội dung chỉ còn để xem. Điểm cuối cùng có khi hệ thống công bố kết quả.',
              'Editing has closed, so the content is view-only. The final rating appears once results are published.') });
    }
    if (isEditing(p)) {
      items.push({ sel: root + '.yer-edit-note', pose: 'think.png', title: L('Đang chỉnh sửa bản đã gửi', 'Editing the submitted review'),
        text: L('Bản đã gửi vẫn được giữ cho tới khi lưu thay đổi. Hủy chỉnh sửa thì bỏ mọi thay đổi chưa lưu.',
          'The submitted review stands until you save. Discarding drops every unsaved change.') });
    }
    if (isLm() && p.maternity) {
      items.push({ sel: root + '.yer-mat-guide', pose: 'think.png', title: L('Nhân viên nghỉ thai sản', 'Maternity leave'),
        text: L('QLTT chịu trách nhiệm chính: rà soát mục tiêu, thêm mục tiêu nếu cần (tự Đã duyệt), rồi đánh giá và gửi.',
          'The line manager leads: review the goals, add goals if needed (approved at once), then review and submit.') });
    } else if (!mySubmitted(p)) {
      items.push({ sel: root + '.yer-note-block', pose: 'think.png', title: L('Lưu ý của hồ sơ', 'Profile notes'),
        text: L('Những điều cần biết về hồ sơ trước khi đánh giá, và hạn đánh giá của ' + R + '.', 'What to know about the profile before reviewing, and the deadline of ' + roleLow() + '.') });
    }
    items.push({ sel: '#yer-md-ai', pose: 'wink.png', title: L('Tham khảo trước khi chấm', 'Look things up before rating'),
      text: L('AI Summary tóm tắt đánh giá của nhân viên và các cấp; Phản hồi đã nhận là phản hồi đồng nghiệp gửi cho nhân viên trong năm.',
        'AI Summary sums up the employee and manager reviews; Feedback received lists peer feedback the employee got this year.') });
    if (canEdit) {
      if (isLm()) {
        items = items.concat([
          { sel: root + '.yer-sec-what', pose: 'think.png', title: L('1. Mục tiêu công việc', '1. Work goals'),
            text: L('Chấm điểm từng mục tiêu và viết nhận xét chung cho nhóm.', 'Rate each goal and write a comment for the group.') },
          { sel: root + '.yer-sec-dev', pose: 'think.png', title: L('2. Mục tiêu phát triển', '2. Development goals'),
            text: L('Chấm điểm từng mục tiêu phát triển và nhận xét.', 'Rate each development goal and comment.') },
          { sel: root + '.yer-sec-how', pose: 'think.png', title: L('3. Mục tiêu hành vi', '3. Behavioural goals'),
            text: L('Chấm từng giá trị cốt lõi và nhận xét. Bấm một dòng để xem mô tả đầy đủ.', 'Rate each core value and comment. Click a row for the full description.') }
        ]);
      }
      items.push({ sel: root + '.overall-panel.editable-panel', pose: 'wink.png', title: L('Đánh giá toàn diện', 'Overall review'),
        text: isLm()
          ? L('Chọn điểm toàn diện và viết nhận xét toàn diện. Nút Cải thiện với AI gợi ý câu chữ, QLTT quyết định có chèn hay không.',
              'Choose the overall rating and write the overall comment. Improve with AI suggests wording; the line manager decides whether to insert it.')
          : L('Chọn điểm toàn diện; nhận xét là tùy chọn.', 'Choose the overall rating; a comment is optional.') });
      if (!mySubmitted(p) && isLm()) items.push({ sel: '#yer-md-draft', pose: 'idle.png', place: 'top', title: L('Lưu nháp', 'Save a draft'),
        text: L('Màn hình không tự lưu. Lưu nháp để quay lại rà soát trước khi gửi.', 'The screen does not auto-save. Save a draft to review before submitting.') });
      items.push({ sel: '#yer-md-submit', pose: 'cheer.png', place: 'top',
        title: mySubmitted(p) ? L('Lưu thay đổi', 'Save changes') : isLm() ? L('Gửi đánh giá', 'Submit the review') : L('Lưu điểm', 'Save the rating'),
        text: L('Sau khi gửi, ' + R + ' vẫn chỉnh sửa được tới hết 18:00 ngày ' + to + '.', 'After submitting, ' + roleLow() + ' can still edit until 18:00 on ' + to + '.') });
    }
    // Chỉ giữ bước có khối đang hiện trên màn
    return items.filter(function (it) { return document.querySelector(it.sel); });
  }
  function mountMascot(p, canEdit) {
    if (!U.mascotGuide) return;
    U.mascotGuide({
      tabs: document.querySelector('.tabs'),
      title: L('Xin chào, mình là tour guide của bạn!', 'Hi, I am your tour guide!'),
      intro: L('Hồ sơ đang ở bước ', 'This profile is at '),
      stepLabel: mascotStep(p, canEdit),
      outro: L('. Mình sẽ dẫn bạn qua các việc cần làm nhé!', '. I will walk you through what to do.'),
      ariaLabel: L('Bắt đầu hướng dẫn Đánh giá cuối năm', 'Start the Year-End Review guide'),
      onStart: function () { U.tour.start(tourItems(p, canEdit), { key: 'yer-mgr' }); }
    });
  }

  /* ── Dải quy trình (§40) ─────────────────────────────────
     Cùng component với màn Nhân viên và danh sách Quản lý. Màn chi tiết là của một
     nhân viên nên mọi bước đều có domain, kể cả Tự đánh giá; bước Công bố thì không. */
  var MD_STEPS = ['self', 'lm', 'lm2', 'hod', 'publish'];
  // Danh sách bước dùng chung cho dải quy trình và nút Quy trình (07/10/2026)
  function stepItemsOf(p) {
    var who = Y.actors(p);
    return window.PMS_YER_TIMELINE.steps
      .filter(function (st) { return MD_STEPS.indexOf(st.key) >= 0; })
      .map(function (st) {
        var state = Y.stepState(st.key, p.now);
        var person = who[st.key];
        return {
          key: st.key,
          name: lg() === 'en' ? st.en : st.vi,
          domain: person ? person.login : '',
          date: L('Hạn chót ', 'Due ') + Y.fmt(st.to, lg()),
          state: state === 'open' ? 'open' : state === 'closed' ? 'done' : 'todo'
        };
      });
  }
  function mountSteps(p) {
    var node = el('yer-md-steps');
    if (!node) return;
    U.steps(node, {
      title: L('Quy trình và Thời gian đánh giá cuối năm 2026',
               'Year-End Review 2026 process and timeline'),
      collapseKey: 'yer-md',
      items: stepItemsOf(p)
    });
  }

  /* ── Khối Lưu ý (§40.5a, chốt 30/09/2026) ─────────────────
     Cùng luật với màn Nhân viên: không bao giờ hai box thông tin cùng lúc. Mọi thông tin tham khảo của hồ sơ
     gom thành gạch đầu dòng trong MỘT khối `Lưu ý` (.info-note, icon ⓘ) ngay dưới dải quy trình, câu chữ viết cho
     người quản lý. Vai đang xem đã gửi thì banner thay khối này, như banner `Đã hoàn thành` của Nhân viên.
     Hồ sơ `Không đánh giá` chỉ có một khối vàng (.yer-note.yer-late-closed), không dựng khối Lưu ý. */
  function missingGoalNames(p) {
    var e = p.eligibility || {};
    var names = [];
    if (e.missingWhat) names.push(L('Mục tiêu công việc', 'work goal'));
    if (e.missingDev) names.push(L('Mục tiêu phát triển', 'development goal'));
    return names.join(L(' và ', ' and '));
  }

  function lateConsequence(r) {
    return r && r.consequence.length
      ? r.consequence.map(function (k) { return Y.lateTextHtml(k, lg()); }).join(' ') : '';
  }

  /* opts.guide: đang dựng khối hướng dẫn thai sản của QLTT, hạn và thai sản đã nằm trong khối đó nên bỏ qua */
  function noteItems(p, canEdit, opts) {
    var guide = !!(opts && opts.guide);
    var items = [];

    // QLTT đọc khối hướng dẫn thai sản riêng (maternityGuide) tới hết timeline QLTT; ở đây là câu ngắn cho LM2, HOD và QLTT sau hạn
    if (p.maternity && !guide) {
      items.push(L('Nhân viên đang trong thời gian <strong class="yer-hl">nghỉ thai sản</strong> nên <strong>không bắt buộc</strong> Tự đánh giá. Quản lý trực tiếp chịu trách nhiệm chính đánh giá cuối năm cho nhân viên này.',
        'The employee is on <strong class="yer-hl">maternity leave</strong>, so the self assessment is <strong>not required</strong>. The line manager leads this year-end review.'));
    }

    /* Tình trạng Tự đánh giá của nhân viên (đã gửi, nộp bổ sung, chưa gửi, không gửi) nằm ở banner đầu tab
       (selfBanner, lateBanner, pendingBanner), khối Lưu ý không nhắc lại (chốt 04/10/2026). */
    // LWD (chị chốt 04/10/2026): nói rõ Nhân viên và QLTT vẫn phải hoàn thành đánh giá khi nhân viên còn đang làm việc
    if (p.resignFrom && !p.resigned) {
      items.push(L('Nhân viên có Ngày làm việc cuối cùng là <strong>', 'The employee\'s last working day is <strong>') +
        esc(Y.fmt(p.resignFrom, lg())) + '</strong>. ' +
        L('Nhân viên và QLTT vẫn cần hoàn thành đánh giá trong thời gian nhân viên còn đang làm việc.',
          'The employee and the line manager still need to complete the review while the employee is still working.'));
    }

    // Chỉ nhắc kỳ giữa năm khi có kết quả để xem lại, không có thì không nói gì (§40.5c)
    if (p.myr && p.myr.submitted) {
      items.push(L(roleName() + ' có thể xem lại kết quả <a href="#" class="yer-note-link" data-go-tab="1">Đánh giá giữa năm 2026</a> của nhân viên trước khi đánh giá cuối năm.',
        roleName() + ' can look back at the employee\'s <a href="#" class="yer-note-link" data-go-tab="1">Mid-Year Review 2026</a> result before the year-end review.'));
    }
    // Hạn đánh giá và chỉnh sửa của vai đang xem đứng cuối khối (chốt 02/10/2026)
    var win = guide ? '' : windowText(p, canEdit);
    if (win) items.push(win);
    return items;
  }

  function noteBlock(p, canEdit) {
    if (p.resigned || mySubmitted(p)) return '';
    if (p.stopped) return closedBlock(p);
    if (Y.lateWaiting(p)) return waitingBlock(p, canEdit);
    // Hết timeline QLTT thì không còn việc để hướng dẫn (chị chốt 08/10/2026): về khối Lưu ý thường có câu thai sản và câu bước đã kết thúc
    if (isLm() && p.maternity && Y.managerEditWindow('lm', p).state !== 'closed') return maternityGuide(p, canEdit);
    var items = noteItems(p, canEdit);
    // Không còn dòng nào thì không dựng thẻ rỗng
    if (!items.length) return '';
    return '<div class="info-note yer-note-block"><i class="bx bx-info-circle"></i><div>' +
      '<strong>' + L('Lưu ý:', 'Please note:') + '</strong>' +
      '<ul class="yer-note-list"><li>' + items.join('</li><li>') + '</li></ul></div></div>';
  }

  /* Nhân viên thai sản, vai QLTT (chốt 02/10/2026): khối Lưu ý thành khối hướng dẫn ba bước. Vẫn là MỘT khối (§40.5a):
     hạn của QLTT thành dòng `Lưu ý` cuối khối; LWD, kết quả giữa năm (nếu có) thêm vào cùng dòng đó.
     LM2, HOD vẫn đọc câu thai sản ngắn trong khối Lưu ý thường. */
  function maternityGuide(p, canEdit) {
    var add = canAdd(p);
    var noGoal = p.eligibility.reason === 'missing-goal';
    /* Bước 2 nói rõ hai cách thêm (chị chốt 08/10/2026); hai cụm là liên kết mở đúng thẻ của popup thêm mục tiêu. Đây là lối vào
       duy nhất: nhóm Mục tiêu công việc, Mục tiêu phát triển không còn nút Thêm mục tiêu. */
    /* Hai cụm luôn là liên kết (chị chốt 08/10/2026). Trước timeline QLTT thì liên kết khóa (xám, không mở popup), rê chuột thấy
       ngày mở. Hết timeline QLTT thì khối hướng dẫn không còn hiện (noteBlock). */
    var win = Y.managerEditWindow('lm', p);
    var offTip = L('Mở từ ' + Y.fmt(win.from, lg()) + ', khi bắt đầu bước đánh giá của QLTT', 'Opens on ' + Y.fmt(win.from, lg()) + ', when the line manager step starts');
    function addLink(mode, vi, en) {
      return add
        ? '<a href="#" class="yer-note-link" data-add-goal="" data-goal-mode="' + mode + '">' + L(vi, en) + '</a>'
        : '<span class="yer-note-link is-off" aria-disabled="true" tabindex="0" data-tip="' + esc(offTip) +
            '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()">' + L(vi, en) + '</span>';
    }
    var step2 = L('<strong>Thêm mới mục tiêu</strong> cho nhân viên nếu cần bằng cách ', '<strong>Add goals</strong> for the employee if needed by ') +
      addLink('manual', 'Nhập từng mục tiêu', 'entering them one by one') + L(' hoặc ', ' or ') +
      addLink('upload', 'Import toàn bộ theo template mẫu', 'importing them all with the template') + '.';
    var step2Note = L('Mục tiêu do QLTT tạo được ghi nhận ở trạng thái <strong>Đã duyệt</strong>.',
        'Goals created by the line manager are recorded as <strong>Approved</strong>.') +
      (noGoal ? ' ' + L('Nhân viên còn thiếu <strong>' + esc(missingGoalNames(p)) + '</strong> được duyệt.',
        'An approved <strong>' + esc(missingGoalNames(p)) + '</strong> is still missing.') : '');
    /* Ba bước nằm ngang, không viền trong (chị chốt lại 08/10/2026): số bước trong vòng tròn, mũi tên giữa các bước. Độ rộng mỗi
       bước tỉ lệ với độ dài chữ của bước (flex-grow = số ký tự, ghi chú nằm dòng riêng nên tính 0.5) nên các bước có số dòng gần bằng nhau,
       không bước nào bị dồn xuống nhiều dòng trong khi bước khác thừa chỗ. Màn hẹp thì xếp dọc. */
    function plainLen(html) { return String(html || '').replace(/<[^>]+>/g, '').length; }
    function step(no, title, note) {
      var grow = Math.round(plainLen(title) + plainLen(note) * 0.5);
      return '<li class="yer-mat-step" style="flex-grow:' + grow + '"><span class="yer-mat-no">' + no + '</span><div class="yer-mat-tx">' + title +
        (note ? '<span class="yer-mat-sub">' + note + '</span>' : '') + '</div></li>';
    }
    // Cùng câu hạn với khối Lưu ý thường (windowText), không viết một câu riêng cho thai sản (04/10/2026)
    var deadline = windowText(p, canEdit);
    var notes = noteItems(p, canEdit, { guide: true }).concat([deadline]).filter(Boolean);
    /* Ba phần tách bạch (chị chốt 08/10/2026), không thành một khối chữ: phần mở đầu; ba bước nằm trên nền hồng nhạt riêng (không
       nhãn, câu dẫn đã nói `theo các bước sau`); phần Lưu ý ngăn bằng một đường kẻ mảnh. */
    return '<div class="info-note yer-note-block yer-mat-guide"><i class="bx bx-info-circle"></i><div class="yer-mat-body">' +
      '<strong>' + L('Hướng dẫn đánh giá cho Nhân viên đang nghỉ thai sản:', 'Review guide for an employee on maternity leave:') + '</strong>' +
      '<p>' + L('Nhân viên đang <strong class="yer-hl">nghỉ thai sản</strong> <strong>không bắt buộc</strong> Tự đánh giá. ' +
          'QLTT <strong>chịu trách nhiệm chính</strong> thực hiện đánh giá nhân viên theo các bước sau:',
        'The employee is on <strong class="yer-hl">maternity leave</strong>, so the self assessment is <strong>not required</strong>. ' +
          'The line manager is <strong>responsible</strong> for the review, in these steps:') + '</p>' +
      '<div class="yer-mat-panel">' +
      '<ol class="yer-mat-steps">' +
        step(1, L('<strong>Rà soát</strong> các mục tiêu hiện có tại tab Đánh giá cuối năm.', '<strong>Review</strong> the existing goals in the Year-End Review tab.')) +
        step(2, step2, step2Note) +
        step(3, L('<strong>Hoàn thành Đánh giá chi tiết</strong> cho nhân viên và <strong>gửi</strong>.', '<strong>Complete the detailed review</strong> for the employee and <strong>submit</strong> it.')) +
      '</ol></div>' +
      '<div class="yer-mat-notes">' + (notes.length === 1
        ? '<p><strong>' + L('Lưu ý:', 'Note:') + '</strong> ' + notes[0] + '</p>'
        : '<p><strong>' + L('Lưu ý:', 'Note:') + '</strong></p><ul class="yer-note-list"><li>' + notes.join('</li><li>') + '</li></ul>') + '</div>' +
      '</div></div>';
  }

  /* Đang chờ nhân viên nộp bổ sung (chốt 02/10/2026): một khối vàng như khối quá hạn của E-05 (DS §19 rule 24), nói rõ
     tình huống, lần nhắc đang mở, hạn nộp, QLTT chấm được khi nào và điều gì xảy ra nếu nhân viên không nộp. Vẫn là
     một khối duy nhất (§40.5a): LWD, kết quả giữa năm nếu có thì thành gạch đầu dòng cuối khối. */
  function waitingBlock(p, canEdit) {
    var r = Y.lateWaiting(p);
    var missing = p.eligibility.reason === 'missing-goal';
    var csq = lateConsequence(r);
    var lateEnd = at18(Y.lateSubmissionDeadline());
    var lmEnd = at18(Y.step('lm').to);
    var extras = noteItems(p, canEdit, { guide: true });
    /* Nhiều ý thì gạch đầu dòng (DS §19, chốt 04/10/2026): tình huống, lần nhắc và hạn, hình thức xử lý (nếu có),
       điều xảy ra nếu không nộp, rồi LWD và kết quả giữa năm (nếu có). */
    // Bỏ ý `Nhân viên chỉ được nộp bổ sung một lần...` (chị chốt 08/10/2026)
    var lines = [
      L('Đang ở <strong>lần nhắc thứ ' + r.round + '</strong>, hạn nộp ' + at18(r.deadline) + '.',
        'Reminder <strong>' + r.round + '</strong> is open, due ' + at18(r.deadline) + '.')
    ];
    if (csq) lines.push('<strong>' + L('Hình thức xử lý khi nộp ở lần nhắc này:', 'Measure when submitting at this reminder:') + '</strong> ' + csq);
    lines.push(missing
      ? L('Nhân viên còn thiếu <strong>' + esc(missingGoalNames(p)) + '</strong> được duyệt. Nếu hết các lần nhắc (' + lateEnd +
            ') mà nhân viên không bổ sung, quy trình đánh giá cuối năm không thể tiếp tục và nhân viên sẽ không có điểm trên hệ thống.',
          'An approved <strong>' + esc(missingGoalNames(p)) + '</strong> is missing. If nothing is added by the last reminder (' + lateEnd +
            '), the year-end review cannot continue and the employee will have no rating in the system.')
      : L('Nếu hết các lần nhắc (' + lateEnd + ') mà nhân viên không nộp, ' + roleName('lm') + ' sẽ tiếp tục đánh giá tới hết ' + lmEnd + '.',
          'If nothing is submitted by the last reminder (' + lateEnd + '), ' + roleLow('lm') + ' continues the review until ' + lmEnd + '.'));
    return '<div class="yer-note yer-late-closed yer-late-wait"><i class="bx bx-time-five"></i><div>' +
      '<strong>' + L('Đang chờ nhân viên nộp bổ sung Tự đánh giá', 'Waiting for the late self assessment') + '</strong>' +
      '<p>' + L('Nhân viên đã quá hạn Tự đánh giá và chưa nộp bổ sung.', 'The employee missed the self-assessment deadline and has not submitted yet.') + '</p>' +
      '<ul class="yer-note-list">' + lines.concat(extras).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '</div></div>';
  }

  /* Hồ sơ `Không đánh giá`: một khối vàng như `.yer-late-closed` của màn Nhân viên (§27.1, §6) */
  function closedBlock(p) {
    var missing = p.eligibility.reason === 'missing-goal';
    var lateEnd = at18(Y.lateSubmissionDeadline());
    return '<div class="yer-note yer-late-closed"><i class="bx bx-time-five"></i><div>' +
      '<strong>' + L('Dừng quy trình đánh giá cuối năm', 'Year-end review stopped') + '</strong><br>' +
      (missing
        ? L('Thời gian nộp bổ sung Tự đánh giá đã kết thúc lúc ' + lateEnd + ' và nhân viên đã không hoàn thành sau 4 lần nhắc nhở. ' +
              'Vì còn thiếu <strong>' + esc(missingGoalNames(p)) + '</strong> được duyệt, các bước đánh giá của cấp quản lý không thể tiếp tục. ' +
              'Quy trình Đánh giá cuối năm của nhân viên dừng tại đây và không có điểm trên hệ thống.',
            'The late self-assessment window closed at ' + lateEnd + ' and the employee did not complete it after 4 reminders. ' +
              'Because an approved <strong>' + esc(missingGoalNames(p)) + '</strong> is missing, the manager review steps cannot continue. ' +
              'The year-end review stops here with no rating in the system.')
        : L('Nhân viên không Tự đánh giá và Quản lý trực tiếp không đánh giá tới hết ' + at18(p.lmDeadline) +
              ', nên hồ sơ không có điểm để hệ thống đồng bộ. Quy trình Đánh giá cuối năm của nhân viên dừng tại đây.',
            'The employee did not self-assess and the line manager did not review by ' + at18(p.lmDeadline) +
              ', so there is no rating to sync. The year-end review stops here.')) +
      '</div></div>';
  }

  /* ── mục tiêu Quản lý trước đã đánh giá hoàn thành ──
     Quản lý cũ không để lại bản bàn giao. Thứ họ để lại là điểm đã chốt, và Quản lý
     hiện tại **không chấm lại** những mục tiêu đó. */
  function doneChip() {
    return '<span class="g-done-chip"><i class="bx bx-check-circle"></i>' +
      L('Đã đánh giá hoàn thành', 'Assessed as complete') + '</span>';
  }

  // Hai lượt chấm của mục tiêu đã đánh giá hoàn thành, cùng thuộc tính với doneData của E-05
  function doneData(p, done) {
    var by = done.mgr && done.mgr.by;
    return ' data-done-self-score="' + esc(done.self.score) + '"' +
      ' data-done-self-by="' + esc(p.emp.login || '') + '"' +
      ' data-done-self-at="' + esc(Y.fmt(done.self.at, lg())) + '"' +
      ' data-done-self-cmt="' + esc(done.self.comment || '') + '"' +
      ' data-done-mgr-score="' + esc(done.mgr.score) + '"' +
      ' data-done-mgr-by="' + esc(by ? by.login : '') + '"' +
      ' data-done-mgr-at="' + esc(Y.fmt(done.mgr.at, lg())) + '"' +
      ' data-done-mgr-cmt="' + esc(done.mgr.comment || '') + '"';
  }

  function byLine(done) {
    if (!done || !done.by) return '';
    return '<div class="ql-by" title="' +
      esc(L('Đánh giá bởi ', 'Assessed by ') + done.by.name + ' (' + done.by.login + ')') + '">' +
      esc(done.by.login) + '</div>';
  }

  /* ── bảng mục tiêu ───────────────────────────────────── */
  // Luật danh sách mục tiêu ở model (Y.reviewGoals), E-05 đọc cùng hàm (DS §20.1)
  function approvedGoals(p, type) {
    return Y.reviewGoals(p, type);
  }

  function canAdd(p) { return Y.canAddGoals(role(), p); }

  function goalSection(p, type, canEdit) {
    /* Nhóm chưa có mục tiêu vẫn giữ khối, thân bảng là một dòng xám mờ, giống màn
       Nhân viên (§40.5d). Giấu khối thì không nhìn ra nhân viên đang thiếu loại nào. */
    var list = approvedGoals(p, type);
    var t = TYPE[type];
    var selfScores = (p.self && p.self.goalScores) || {};
    var myScores = draft.goalScores || {};
    var lmScores = (p.lm && p.lm.goalScores) || {};

    var rows;
    if (type === 'how') {
      rows = CORE_VALUES.map(function (cv, i) {
        return { id: 'how:' + i, name: lg() === 'en' ? cv.en : cv.vi, result: cv.lines.join('\n'), lines: cv.lines, prio: '', time: '' };
      });
    } else {
      rows = list.map(function (g) {
        // done: mục tiêu Quản lý trước đã đánh giá hoàn thành, Quản lý hiện tại không chấm lại
        return { id: 'goal:' + g.id, name: g.title, result: g.result || '', prio: g.prio || '',
                 time: [g.s, g.e].filter(Boolean).join(' – '),
                 done: (p.completedGoals || {})[g.id] || null, byLm: g.byLm ? g : null, late: g.late ? g : null };
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

    // Cùng phân bổ cột với nhóm Mục tiêu hành vi của tab Giữa năm
    var header = type === 'how'
      ? '<th style="width:20%">' + L('Giá trị cốt lõi', 'Core value') + '</th>' +
        '<th style="width:56%">' + L('Mô tả', 'Description') + '</th>' +
        '<th class="th-c" style="width:12%">' + L('Điểm NV', 'Employee') + '</th>' +
        '<th class="th-c th-ql" style="width:12%">' + esc(myColHead) + '</th>'
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

    // Header nhóm như tab Giữa năm: icon và tên trong .rv-type, bảng trong .rv-table-wrap
    return '<div class="rv-section yer-sec-' + type + '"><div class="rv-section-hd"><i class="bx ' + t.icon + '"></i>' +
        '<span class="rv-type">' + esc(lg() === 'en' ? t.en : t.vi) + '</span>' +
        // Không có nút Thêm mục tiêu ở nhóm (chị bỏ 08/10/2026): thêm ở bước 2 của khối hướng dẫn thai sản
        '</div>' +
      '<div class="rv-table-wrap"><table class="rv-grid"' + (type === 'how' ? ' style="min-width:600px"' : '') + '><thead><tr>' + header + '</tr></thead><tbody>' +
      rows.map(function (r) {
        var key = r.id.split(':');
        var bucket = key[0] === 'how' ? 'how' : 'goal';
        var idx = key[1];
        // Đã chốt hoàn thành thì cả hai cột đều lấy điểm đã chốt và đều chỉ xem
        var selfVal = r.done ? r.done.self.score : selfMap[idx];
        var myVal = r.done ? r.done.mgr.score : myMap[idx];
        /* data-name / data-result cho tooltip và popup chi tiết (window.bindReviewGoalRows
           ở M-06). data-done-* là hai lượt chấm để popup #dlg-detail đọc lại, như doneData của E-05 (§13.2). */
        return '<tr' + (r.done ? ' class="g-row-done"' : '') +
          (type === 'how' ? ' data-kind="how"' : '') +
          ' data-name="' + esc(r.name) + '" data-result="' + esc(r.result) + '"' +
          (r.done ? doneData(p, r.done) : '') +
          '><td><div class="g-name">' + esc(r.name) + '</div>' +
          (r.done ? doneChip() : '') + (r.byLm ? lmGoalChip(r.byLm) : '') +
          // Mục tiêu nhân viên gửi duyệt sau hạn Tự đánh giá (§27.1, chốt 07/10/2026), nhãn dùng chung PMSUi
          (r.late ? '<div class="yer-late-goal-row">' + window.PMSUi.lateGoalChip(r.late, lg()) + '</div>' : '') + '</td>' +
          '<td><div class="g-result">' + (r.lines ? r.lines.map(esc).join('<br>') : esc(r.result)) + '</div></td>' +
          (type === 'what' ? '<td><div class="g-meta">' +
            (r.prio ? '<span class="prio prio-' + esc(r.prio) + '">' +
              esc(lg() === 'en' ? (PRIO[r.prio] || {}).en : (PRIO[r.prio] || {}).vi) + '</span>' : '') + '</div></td>' : '') +
          (type === 'how' ? '' : '<td><div class="g-meta">' + esc(r.time || '—') + '</div></td>') +
          '<td class="sc-cell">' + ratingCell('self:' + bucket + ':' + idx, selfVal == null ? null : selfVal, { readonly: true }) + '</td>' +
          '<td class="ql-cell">' + ratingCell('my:' + bucket + ':' + idx, myVal == null ? null : myVal,
            { readonly: r.done ? true : !(canEdit && isLm()) }) + byLine(r.done && r.done.mgr) + '</td></tr>';
      }).join('') + (rows.length ? '' : emptyRow(type, p)) + '</tbody></table></div>' +
      commentPair(p, type, canEdit) + '</div>';
  }

  function emptyRow(type, p) {
    var name = (lg() === 'en' ? TYPE[type].en : TYPE[type].vi).toLowerCase();
    return '<tr class="g-none-row"><td colspan="' + (type === 'what' ? 6 : 5) + '"><div class="g-none">' +
      L('Chưa có ' + name + ' nào được Quản lý trực tiếp phê duyệt.',
        'No ' + ({ what: 'work goal', dev: 'development goal' }[type] || 'goal') + ' has been approved by the line manager yet.') +
      (p && canAdd(p) ? ' ' + L('Thêm mục tiêu cho nhân viên ở bước 2 của khối hướng dẫn phía trên.', 'Add one at step 2 of the guide above.') : '') +
      '</div></td></tr>';
  }

  /* Mục tiêu QLTT thêm: nhãn riêng để phân biệt với mục tiêu nhân viên tự tạo, tooltip ghi ai thêm, khi nào,
     bằng cách nào. Tạm thời không sửa, không xóa được, kể cả trong timeline QLTT (§33, chốt 02/10/2026). */
  function lmGoalChip(g) {
    var by = g.by || {};
    var tipText = L('Quản lý trực tiếp ' + (by.login ? '(' + by.login + ') ' : '') + 'thêm ngày ' + Y.fmt(g.at, lg()) +
        (g.via === 'upload' ? ' bằng file' : ' bằng nhập tay') + ', tự động Đã duyệt.',
      'Added by the line manager ' + (by.login ? '(' + by.login + ') ' : '') + 'on ' + Y.fmt(g.at, lg()) +
        (g.via === 'upload' ? ' from a file' : ' by hand') + ', approved automatically.');
    return '<div class="g-lm-row"><span class="g-lm-chip" data-tip="' + esc(tipText) +
        '" onmouseenter="tip(this,this.dataset.tip)" onmouseleave="hideTip()"><i class="bx bx-user-check"></i>' +
        L('QLTT thêm - Đã duyệt', 'Added by manager - Approved') + '</span></div>';
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
          (canEdit && isLm() ? req() + aiWriteBtn(type) : '') +
        '</div>' +
        editorHtml('yer-md-cmt-' + type, placeholder, 500, myCmt, 'cc-cmt-' + type, !(canEdit && isLm())) + '</div>' +
    '</div>';
  }

  /* ── đánh giá toàn diện ──────────────────────────────── */
  /* Thẻ Đánh giá toàn diện: chuẩn bốn ô (chị chốt 04/10/2026) cho mọi vai, thứ tự cố định Nhân viên, Quản lý trực tiếp /
     Quản lý cấp 2, Trưởng đơn vị, hai ô một hàng. Cấp nào chưa đánh giá thì ô vẫn có, điểm và nhận xét là `—`. Ô của vai đang
     xem dùng icon bút và là ô nhập khi còn sửa được. Thay khối riêng `Đánh giá của các cấp quản lý` trước đây. */
  var LEVEL_ICON = { lm: 'bx-user-check', lm2: 'bx-sitemap', hod: 'bx-buildings' };
  var LEVEL_TITLE = {
    lm: ['Quản lý trực tiếp đánh giá', 'Line manager review'],
    lm2: ['Quản lý cấp 2 đánh giá', 'Second-level manager review'],
    hod: ['Trưởng đơn vị đánh giá', 'Head of department review']
  };
  function levelView(p, lvl) {
    if (lvl === 'lm') return p.lm ? { score: p.lm.overall ? p.lm.overall.score : null, comment: p.lm.overall ? p.lm.overall.comment : '', synced: p.lm.synced } : null;
    var v = lvl === 'lm2' ? p.lm2 : p.hod;
    return v ? { score: v.score, comment: v.comment, synced: v.synced } : null;
  }
  function overallCard(p, canEdit) {
    var who = Y.actors(p);
    var cols = [panelHtml({
      icon: 'bx-user', title: L('Nhân viên tự đánh giá', 'Employee self assessment'), owner: L('nhân viên', 'the employee'),
      key: 'self:overall', value: p.self && p.self.overall ? p.self.overall.score : null,
      comment: p.self && p.self.overall ? p.self.overall.comment : '', readonly: true
    })];

    var SYNC_HINT = L('Quá hạn mà cấp này không đánh giá nên hệ thống tự lấy điểm của cấp trước, không kèm nhận xét.',
      'This level did not rate before its deadline, so the system copied the previous level rating, without a comment.');
    ['lm', 'lm2', 'hod'].forEach(function (lvl) {
      var own = lvl === role() ? levelView(p, lvl) : null;
      // Vai đang xem quá hạn mà hệ thống đã tự lấy điểm: ô của mình hiện điểm đó kèm (HR system), không phải `—` (04/10/2026)
      if (lvl === role() && !mySubmitted(p) && own && own.synced) {
        cols.push(panelHtml({
          icon: 'bx-edit-alt', title: L(LEVEL_TITLE[lvl][0], LEVEL_TITLE[lvl][1]), key: lvl + ':overall', owner: roleFull(lvl),
          value: own.score, overCap: capOf(p, own.score), comment: '', readonly: true, synced: true, hint: SYNC_HINT
        }));
        return;
      }
      if (lvl === role()) {
        // Đang chỉnh sửa bản đã gửi thì đọc bản nháp (khởi tạo từ bản đã gửi), để đổi điểm rồi dựng lại không mất
        var mine = mySubmitted(p) && !isEditing(p)
          ? (lvl === 'lm' ? (p.lm.overall || {})
             : lvl === 'lm2' ? { score: p.lm2.score, comment: p.lm2.comment }
             : { score: p.hod.score, comment: p.hod.comment })
          : (draft.overall || {});
        cols.push(panelHtml({
          icon: 'bx-edit-alt', title: L(LEVEL_TITLE[lvl][0], LEVEL_TITLE[lvl][1]), key: 'my:overall', owner: roleFull(lvl),
          value: mine.score == null ? null : mine.score,
          comment: mine.comment || '',
          readonly: !canEdit, editable: canEdit,
          measure: canEdit ? measureHtml(p, mine.score == null ? null : mine.score) : null,
          overCap: canEdit ? null : capOf(p, mine.score),
          required: isLm(),
          // Đang sửa bản đã gửi thì ô Ý nghĩa thang điểm chỉ hiện khi đổi điểm, như popup chấm trên lưới M-05
          defHidden: mySubmitted(p),
          hint: ''
        }));
        return;
      }
      var v = levelView(p, lvl);
      cols.push(panelHtml({
        icon: LEVEL_ICON[lvl], title: L(LEVEL_TITLE[lvl][0], LEVEL_TITLE[lvl][1]), by: who[lvl],
        key: lvl + ':overall', value: v ? v.score : null, overCap: v ? capOf(p, v.score) : null,
        comment: v ? v.comment || '' : '', readonly: true, synced: v && v.synced,
        hint: v && v.synced ? SYNC_HINT : ''
      }));
    });

    return '<div class="overall-card"><div class="overall-hd"><i class="bx bx-award"></i>' +
      '<span class="overall-title">' + L('Đánh giá toàn diện', 'Overall rating') + '</span></div>' +
      '<div class="overall-grid yer-overall-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">' +
      cols.join('') + '</div></div>';
  }

  /* Lưu ý cuối phần Đánh giá toàn diện (chốt 02/10/2026): nhân viên thấy gì từ các cấp quản lý (§7) */
  function visibilityNote() {
    return '<div class="info-note yer-visibility-note"><i class="bx bx-info-circle"></i><span><strong>' + L('Lưu ý:', 'Note:') + '</strong> ' +
      L('Nhân viên chỉ xem được nhận xét toàn diện của các cấp quản lý, không xem được Điểm đánh giá. Kết quả cuối cùng của nhân viên sẽ hiển thị sau khi hoàn tất quy trình.',
        'The employee sees only the overall comments of the managers, not their ratings. The final result is shown to the employee once the process is complete.') +
      '</span></div>';
  }

  // Nhãn ô nhận xét gọi tên đầy đủ của vai, không viết tắt QLTT (chị chốt 04/10/2026)
  var ROLE_FULL = { lm: ['Quản lý trực tiếp', 'Line manager'], lm2: ['Quản lý cấp 2', 'Second-level manager'], hod: ['Trưởng đơn vị', 'Head of department'] };
  function roleFull(r) { return L(ROLE_FULL[r][0], ROLE_FULL[r][1]); }
  function panelOwner(key) {
    var r = key.split(':')[0].replace('up-', '');
    return ROLE_FULL[r] ? roleFull(r) : L('nhân viên', 'the employee');
  }

  /* Mỗi ô có đúng năm tầng (tiêu đề, điểm, nhãn nhận xét, ô nhận xét, ô Ý nghĩa thang điểm). Lưới dùng subgrid nên các ô
     cùng hàng có chung chiều cao từng tầng: nhãn `Đánh giá toàn diện của…` và ô nhận xét của các bên luôn bắt đầu cùng hàng
     (chị góp ý 04/10/2026). */
  function panelHtml(o) {
    return '<div class="overall-panel' + (o.editable ? ' editable-panel' : '') + '">' +
      '<div class="op-slot">' +
      '<div class="op-hd"><i class="bx ' + o.icon + '"></i>' + esc(o.title) +
        (o.by && o.by.login ? '<span class="op-hd-dom">- ' + esc(o.by.login) + '</span>' : '') +
        (o.synced ? '<span class="yer-sync-tag">(HR system)</span>' : '') + '</div>' +
      '</div><div class="op-slot">' +
      '<div class="op-score-row">' +
        '<span class="op-score-lbl">' + L('Điểm toàn diện:', 'Overall rating:') +
          (o.editable ? req() : '') + '</span>' +
        ratingCell(o.key, o.value, { half: true, readonly: o.readonly, def: o.editable ? '#yer-md-op-def' : null }) +
      '</div>' +
      /* Điểm cao hơn mức tối đa: một dòng ghi chú thường dưới điểm (chị chốt lại 07/10/2026), không viền, không nền, giữ màu vàng
         và icon tam giác. Gọi tên vai của ô (QLTT, Quản lý cấp 2, Trưởng đơn vị). */
      (o.overCap ? '<div class="yer-cap-row"><span class="yer-cap-chip"><i class="bx bx-error"></i><span>' +
        esc(L('Điểm của ' + roleName(capRole(o.key)) + ' cao hơn mức điểm tối đa dành cho trường hợp nộp trễ ở lần nhắc thứ ' + Y.lateMeasure(prof()).round,
              'The ' + roleLow(capRole(o.key)) + ' rating is above the maximum for a late submission at reminder ' + Y.lateMeasure(prof()).round)) +
        '</span></span></div>' : '') +
      (o.measure != null ? '<div class="yer-cap-note" id="yer-md-cap-note">' + o.measure + '</div>' : '') +
      (o.hint ? '<div class="yer-op-hint">' + esc(o.hint) + '</div>' : '') +
      '</div><div class="op-slot">' +
      // Nhãn như tab Giữa năm và E-05: `Đánh giá toàn diện của [người chấm]`, không dùng `của bạn` (chốt 04/10/2026)
      '<label class="op-flbl' + (o.editable && isLm() ? ' yer-flbl-ai' : '') + '">' +
        L('Đánh giá toàn diện của ' + (o.owner || panelOwner(o.key)), (o.owner || panelOwner(o.key)) + ' overall assessment') +
        (o.editable ? (o.required ? req() : '') + (isLm() ? aiWriteBtn('overall') : '') : '') + '</label>' +
      '</div><div class="op-slot">' +
      editorHtml('yer-md-ov-' + o.key.replace(/:/g, '-'),
        L('Nhìn chung, nhân viên đã…', 'Overall, this employee has…'),
        1000, o.comment, 'cc-ov-' + o.key.replace(/:/g, '-'), !o.editable) +
      '</div><div class="op-slot">' +
      // Ô Ý nghĩa thang điểm nằm dưới ô nhận xét, như màn Nhân viên (§41.2b)
      (o.editable ? '<div id="yer-md-op-def" class="yer-op-def" data-shown="' + (o.defHidden ? '0' : '1') + '"></div>' : '') +
    '</div></div>';
  }

  /* Trợ lý viết nhận xét của QLTT (§14): nút nhỏ `Cải thiện với AI` ở góc ô nhận xét (DS §19 rule 20) */
  function aiWriteBtn(kind) {
    return '<button type="button" class="yer-ai-write" data-ai-write="' + kind + '"><i class="bx bxs-magic-wand"></i>' +
      L('Cải thiện với AI', 'Improve with AI') + '</button>';
  }

  function openWriter(p, kind) {
    collectEditors();
    var edId = kind === 'overall' ? 'yer-md-ov-my-overall' : 'yer-md-cmt-' + kind;
    var ed = el(edId);
    if (!ed) return;
    var goalsOf = function (type) {
      return approvedGoals(p, type).map(function (g) { return { title: g.title, score: (draft.goalScores || {})[g.id] }; });
    };
    window.PMSYerAi.openWriter({
      p: p, kind: kind, current: ed.innerText, max: kind === 'overall' ? 1000 : 500,
      goals: { what: goalsOf('what'), dev: goalsOf('dev') },
      how: CORE_VALUES.map(function (cv, i) { return { name: lg() === 'en' ? cv.en : cv.vi, score: (draft.howScores || {})[i] }; }),
      overall: draft.overall ? draft.overall.score : null,
      // Chỉ áp dụng khi QLTT bấm Chèn; nội dung vẫn sửa tiếp được trong ô như bình thường
      onInsert: function (text) {
        var target = el(edId);
        if (!target) return;
        target.innerText = text;
        if (typeof window.edCount === 'function') window.edCount(target, kind === 'overall' ? 'cc-ov-my-overall' : 'cc-cmt-' + kind, kind === 'overall' ? 1000 : 500);
        collectEditors();
        U.dirty.mark();
        U.toast(L('Đã chèn gợi ý vào ô nhận xét', 'Suggestion inserted'));
      }
    });
  }

  /* ── Hình thức xử lý và giới hạn điểm (§27.3, chốt 30/09/2026) ──
     Nhắc lại ngay trong ô Đánh giá toàn diện của vai đang xem, ở mọi cấp. Điểm vượt mức tối đa thì
     thêm dòng cảnh báo; khi gửi phải tick xác nhận (submit). Câu chữ lấy từ model. */
  // Chỉ hồ sơ bị giới hạn điểm 3 (nộp ở lần nhắc thứ 3) mới có khối vàng trong ô điểm (Y.lateCapNotice, chốt 02/10/2026)
  function measureHtml(p, score) {
    var text = Y.lateCapNoticeHtml(p, lg());
    if (!text) return null;
    var cap = Y.ratingCapText(p, score, lg());
    var over = Y.overRatingCap(p, score);
    return '<i class="bx bx-error"></i><div>' + text +
      (over ? '<div class="yer-cap-over">' + esc(cap.over) + '</div>' : '') + '</div>';
  }
  // Vai của ô Đánh giá toàn diện theo khóa ô (`my:overall` là vai đang xem)
  function capRole(key) { var r = String(key || '').split(':')[0]; return r === 'my' ? role() : r; }
  function capOf(p, score) {
    var m = Y.lateMeasure(p);
    return m && m.cap != null && Y.overRatingCap(p, score) ? m.cap : null;
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
    /* Tab Danh sách mục tiêu của hồ sơ trễ hạn Tự đánh giá dựng từ dữ liệu: mục tiêu chờ duyệt, nhãn Mục tiêu nộp trễ,
       QLTT có Duyệt và Yêu cầu cập nhật (§27.1, chốt 07/10/2026); hồ sơ khác giữ bản tĩnh. */
    window.PMSUi.goalTab(p, { role: isLm() ? 'lm' : 'view', active: Y.lateCase(p) });

    var canEdit = editable(p);
    var html = detailNav(p, canEdit) + banner(p) + '<div id="yer-md-steps" class="yer-md-steps"></div>';

    html += noteBlock(p, canEdit);

    html += goalSection(p, 'what', canEdit);
    html += goalSection(p, 'dev', canEdit);
    html += goalSection(p, 'how', canEdit);
    html += overallCard(p, canEdit) + visibilityNote();

    root.innerHTML = html;
    afterRender(p, canEdit);
  }

  function syncChrome(p) {
    // Nhãn hai tab đánh giá nói giai đoạn của kỳ, cùng câu chữ và màu với E-05 và M-05 (§18.4)
    [['tablbl-yer', 'yer'], ['tablbl-myr', 'myr']].forEach(function (pair) {
      var node = el(pair[0]);
      if (!node) return;
      var tab = Y.cycleTabLabel(pair[1], p.now, lg(), p.emp.id);
      node.textContent = tab.text;
      node.classList.toggle('yer-past-cycle-label', tab.past);
    });
    var tabs = document.querySelectorAll('.tabs .tab-btn');
    if (tabs[0]) {
      var cnt = tabs[0].querySelector('.tab-cnt');
      if (cnt) cnt.textContent = approvedGoals(p, 'what').concat(approvedGoals(p, 'dev')).length;
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

  /* Nhóm nút Lưu nháp / Gửi đánh giá (hoặc Hủy chỉnh sửa / Lưu thay đổi) nổi ở giữa mép dưới vùng nội dung khi chỗ cũ
     đã cuộn khuất, như màn Nhân viên (§49, chốt 02/10/2026). Chỗ cũ giữ kích thước để hàng nút không giật. */
  function bindFloatingToolbar() {
    var bar = document.querySelector('#yer-mgr-detail-root .yer-md-actbar');
    window.removeEventListener('scroll', bindFloatingToolbar._sync, true);
    window.removeEventListener('resize', bindFloatingToolbar._sync);
    if (!bar) return;
    var actions = bar.querySelector('.yer-mgr-actions');
    var embedded = document.body.classList.contains('embedded-detail');
    function sync() {
      if (!document.body.contains(bar)) return;
      // Chỉ nổi khi đang mở tab Đánh giá cuối năm và chỗ cũ đã khuất dưới thanh trên cùng
      var r = bar.getBoundingClientRect();
      var float = !!bar.offsetParent && r.bottom < (embedded ? 4 : 60);
      if (float && !actions.classList.contains('floating')) {
        bar.style.width = bar.offsetWidth + 'px';
        bar.style.height = bar.offsetHeight + 'px';
      }
      if (!float) { bar.style.width = ''; bar.style.height = ''; }
      actions.classList.toggle('floating', float);
      var demo = document.getElementById('pms-demo');
      var lift = (demo && !demo.classList.contains('hidden') && demo.offsetParent) ? demo.offsetHeight : 0;
      actions.style.bottom = float ? (lift + 20) + 'px' : '';
    }
    bindFloatingToolbar._sync = sync;
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    sync();
  }

  function afterRender(p, canEdit) {
    mountSteps(p);
    mountMascot(p, canEdit);
    bindFloatingToolbar();
    // Bảng dựng lại mỗi lần render nên gắn lại tooltip và popup chi tiết mục tiêu
    if (window.bindReviewGoalRows) window.bindReviewGoalRows(el('yer-mgr-detail-root'));
    document.querySelectorAll('#yer-mgr-detail-root [data-rt]').forEach(function (node) {
      var key = node.dataset.rt;
      var val = node.dataset.val === '' ? null : Number(node.dataset.val);
      U.rating(node, {
        defInto: node.dataset.def || null,
        step: node.dataset.half === '1' ? 'half' : 'int',
        value: val,
        readonly: node.dataset.ro === '1',
        compact: node.dataset.half !== '1',
        onChange: function (v) { onRating(key, v); }
      });
    });

    document.querySelectorAll('#yer-mgr-detail-root .ev-content[contenteditable="true"]').forEach(function (ed) {
      ed.addEventListener('input', function () {
        collectEditors(); U.dirty.mark();
        unmarkMissing(ed.id === 'yer-md-ov-my-overall' ? 'op-cmt' : 'cmt:' + ed.id.replace('yer-md-cmt-', ''));
      });
    });
    paintMissing(); // render lại (đổi ngôn ngữ, lưu nháp) vẫn giữ viền đỏ

    var d = el('yer-md-draft');
    if (d) d.addEventListener('click', function () { collectEditors(); saveDraft(); });
    // Mở lại bản đã gửi để sửa; hủy thì bỏ mọi thay đổi chưa lưu và về chế độ xem
    var ed = el('yer-md-edit');
    if (ed) ed.addEventListener('click', function () {
      if (typeof window.hideTip === 'function') window.hideTip();
      confirmReopen(p);
    });
    var hist = el('yer-md-history');
    if (hist) hist.addEventListener('click', function () { historyDialog(p); });
    var cancel = el('yer-md-cancel-edit');
    if (cancel) cancel.addEventListener('click', function () { confirmCancelEdit(p); });
    var sb = el('yer-md-submit');
    if (sb) sb.addEventListener('click', function () { collectEditors(); submit(p); });
    var back = el('yer-md-back');
    if (back) back.addEventListener('click', function () { location.href = '../M-05/index.html'; });
    var feedback = el('yer-md-feedback');
    if (feedback) feedback.addEventListener('click', function () {
      // Truyền đúng hồ sơ đang xem: tab Cuối năm đọc nhân viên từ phiên, không từ trạng thái của tab Giữa năm
      if (typeof window.openFbPopup === 'function') window.openFbPopup(p.id);
    });
    document.querySelectorAll('#yer-mgr-detail-root .yer-note-link[data-go-tab]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        window.switchMainTab(Number(link.dataset.goTab));
      });
    });
    document.querySelectorAll('#yer-mgr-detail-root [data-add-goal]').forEach(function (b) {
      b.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        openGoalDialog(p, { type: b.dataset.addGoal || '', mode: b.dataset.goalMode || 'manual' });
      });
    });
    var ai = el('yer-md-ai');
    if (ai) ai.addEventListener('click', function () { window.PMSYerAi.openSummary(p); });
    // Menu tải kết quả trong banner: bấm nút mở chọn PDF hoặc Excel, bấm ra ngoài thì đóng
    var dlMenu = el('yer-md-dl-menu'), dlBtn = el('yer-md-dl');
    if (dlMenu && dlBtn) {
      dlBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !dlMenu.classList.contains('open');
        dlMenu.classList.toggle('open', open);
        dlBtn.setAttribute('aria-expanded', String(open));
        if (typeof window.hideTip === 'function') window.hideTip();
      });
      dlMenu.querySelectorAll('[data-md-dl]').forEach(function (b) {
        b.addEventListener('click', function () {
          dlMenu.classList.remove('open');
          dlBtn.setAttribute('aria-expanded', 'false');
          U.toast(b.dataset.mdDl === 'pdf'
            ? L('Đang chuẩn bị file PDF kết quả đánh giá', 'Preparing the result PDF')
            : L('Đang chuẩn bị file Excel kết quả đánh giá', 'Preparing the result Excel file'));
        });
      });
    }
    document.querySelectorAll('#yer-mgr-detail-root [data-ai-write]').forEach(function (b) {
      b.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        openWriter(p, b.dataset.aiWrite);
      });
    });
  }

  function onRating(key, v) {
    unmarkMissing(key);
    var bits = key.split(':');
    if (bits[0] !== 'my') return;
    if (bits[1] === 'goal') draft.goalScores[bits[2]] = v;
    else if (bits[1] === 'how') draft.howScores[bits[2]] = v;
    else if (bits[1] === 'overall') {
      draft.overall = draft.overall || {}; draft.overall.score = v;
      var def = el('yer-md-op-def');
      if (def) def.setAttribute('data-shown', '1');
      var note = el('yer-md-cap-note');
      if (note) note.innerHTML = measureHtml(prof(), v) || '';
    }
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
  /* Ô còn thiếu khi bấm Gửi / Lưu điểm, gom theo từng khối trên màn như E-05 missingGroups (§8.1, chốt 04/10/2026).
     key là mã ô để tô viền đỏ sau khi đóng popup (markMissing). LM2, HOD chỉ có điểm toàn diện bắt buộc. */
  function missingGroups(p) {
    var groups = [];
    var mgr = L('ô Đánh giá của Quản lý trực tiếp', 'the Line manager review box');
    function typeName(t) { return lg() === 'en' ? TYPE[t].en : TYPE[t].vi; }
    if (isLm()) {
      ['what', 'dev'].forEach(function (type) {
        var list = approvedGoals(p, type);
        var names = [], keys = [];
        list.forEach(function (g) {
          // Mục tiêu đã đánh giá hoàn thành bị khóa ô điểm nên không được đòi (§13.1)
          if ((p.completedGoals || {})[g.id]) return;
          if (draft.goalScores[g.id] == null) { names.push('“' + g.title + '”'); keys.push('my:goal:' + g.id); }
        });
        var parts = [];
        if (names.length) parts.push(L('điểm mục tiêu ', 'rating for goal ') + names.join(', '));
        if (list.length && !((draft.comments || {})[type] || '').trim()) { parts.push(mgr); keys.push('cmt:' + type); }
        if (parts.length) groups.push({ title: typeName(type), parts: parts, keys: keys });
      });
      var cvNames = [], howKeys = [], howParts = [];
      CORE_VALUES.forEach(function (cv, i) {
        if ((draft.howScores || {})[i] == null) { cvNames.push(lg() === 'en' ? cv.en : cv.vi); howKeys.push('my:how:' + i); }
      });
      if (cvNames.length) howParts.push(L('điểm ', 'rating for ') + cvNames.join(', '));
      if (!((draft.comments || {}).how || '').trim()) { howParts.push(mgr); howKeys.push('cmt:how'); }
      if (howParts.length) groups.push({ title: typeName('how'), parts: howParts, keys: howKeys });
    }
    var opParts = [], opKeys = [];
    if (draft.overall == null || draft.overall.score == null) { opParts.push(L('điểm toàn diện', 'overall rating')); opKeys.push('my:overall'); }
    // Nhận xét toàn diện bắt buộc với QLTT, tùy chọn với LM2 và HOD (§39.1)
    if (isLm() && !((draft.overall || {}).comment || '').trim()) {
      opParts.push(L('ô Đánh giá toàn diện của Quản lý trực tiếp', 'the Line manager overall assessment box')); opKeys.push('op-cmt');
    }
    if (opParts.length) groups.push({ title: L('Đánh giá toàn diện', 'Overall assessment'), parts: opParts, keys: opKeys });
    return groups;
  }

  /* Viền đỏ cho ô còn thiếu (DS §14, lỗi form dùng --err), như E-05. Giữ trong biến để render lại vẫn còn;
     điền ô nào thì ô đó hết đỏ (unmarkMissing). */
  var missKeys = [];
  function missNode(key) {
    if (key === 'op-cmt' || key.indexOf('cmt:') === 0) {
      var ed = el(key === 'op-cmt' ? 'yer-md-ov-my-overall' : 'yer-md-cmt-' + key.slice(4));
      return ed ? ed.closest('.ev-editor-wrap') : null;
    }
    return document.querySelector('#yer-mgr-detail-root [data-rt="' + key + '"]');
  }
  function paintMissing() {
    document.querySelectorAll('#yer-mgr-detail-root .yer-miss').forEach(function (n) { n.classList.remove('yer-miss'); });
    missKeys.forEach(function (k) { var n = missNode(k); if (n) n.classList.add('yer-miss'); });
  }
  function unmarkMissing(key) {
    var i = missKeys.indexOf(key);
    if (i < 0) return;
    missKeys.splice(i, 1);
    var n = missNode(key);
    if (n) n.classList.remove('yer-miss');
  }
  function markMissing(groups) {
    missKeys = [];
    groups.forEach(function (g) { missKeys = missKeys.concat(g.keys); });
    paintMissing();
    var first = missKeys.length ? missNode(missKeys[0]) : null;
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function submit(p) {
    var updating = mySubmitted(p);
    var groups = missingGroups(p);
    if (groups.length) {
      /* Mỗi khối còn thiếu một gạch đầu dòng. Đóng popup thì các ô thiếu có viền đỏ và màn cuộn tới ô đầu tiên (như E-05) */
      var mark = function () { markMissing(groups); };
      U.dialog({
        className: 'yer-miss-dialog',
        title: isLm() ? L('Chưa thể gửi đánh giá vì thiếu thông tin', 'You cannot submit the review yet: information is missing')
                      : L('Chưa thể lưu điểm vì thiếu thông tin', 'You cannot save the rating yet: information is missing'),
        html: '<p>' + L('Vui lòng bổ sung:', 'Please complete:') + '</p>' +
          '<ul class="yer-dlg-list">' + groups.map(function (g) {
            return '<li><strong>' + esc(g.title) + ':</strong> ' + esc(g.parts.join('; ')) + '</li>';
          }).join('') + '</ul>' +
          '<p class="yer-dlg-p">' + L('Các ô còn thiếu sẽ được đánh dấu viền đỏ trên màn hình.', 'Missing fields will be outlined in red on the page.') + '</p>',
        buttons: [{ label: L('Đã hiểu', 'Got it'), variant: 'default', act: mark }],
        onDismiss: mark
      });
      return;
    }
    missKeys = [];

    var score = draft.overall.score;
    var over = Y.overRatingCap(p, score);
    var cap = Y.ratingCapText(p, score, lg());
    /* Popup xác nhận gửi (chốt 04/10/2026): hai gạch đầu dòng, ngày giờ in đậm, như popup gửi của E-05 (§8.1).
       Gọi tên vai thay `Bạn` (chị chốt 04/10/2026). */
    var lead = '<ul class="yer-dlg-list"><li>' +
        L(roleName() + ' có thể tiếp tục chỉnh sửa đánh giá tới hết ' + at18(Y.managerEditWindow(role(), p).to) + '.',
          roleName() + ' can keep editing the review until ' + at18(Y.managerEditWindow(role(), p).to) + '.') + '</li><li>' +
        (isLm()
          ? L('Nhân viên có thể xem được điểm từng mục tiêu và ô nhận xét của QLTT, nhưng không thấy điểm toàn diện.',
              'The employee can see the goal scores and comments of the line manager, but not the overall rating.')
          : L('Nhân viên không thấy điểm toàn diện của cấp quản lý.',
              'The employee cannot see manager-level overall ratings.')) + '</li></ul>';
    U.dialog({
      title: updating
        ? L('Lưu thay đổi đánh giá?', 'Save review changes?')
        : isLm() ? L('Xác nhận gửi đánh giá cho nhân viên', 'Confirm submitting the review')
                 : L('Xác nhận lưu điểm cho nhân viên', 'Confirm saving the rating'),
      html: lead + (over
        // Hệ thống không chặn điểm, nhưng người chấm phải tự xác nhận (§27.3)
        ? '<div class="yer-cap-confirm"><i class="bx bx-error"></i><div>' +
            '<div>' + Y.lateMeasureHtml(p, lg()) + '</div>' +
            '<label class="yer-cap-ack"><input type="checkbox" id="yer-md-cap-ack"><span>' + esc(cap.ack) + '</span></label>' +
          '</div></div>'
        : ''),
      buttons: [
        { label: L('Quay lại', 'Go back'), variant: 'quiet' },
        { label: updating ? L('Lưu thay đổi', 'Save changes')
            : isLm() ? L('Gửi đánh giá', 'Submit review') : L('Lưu điểm', 'Save rating'),
          variant: 'default', icon: 'bx-send', act: function () { doSubmit(p, over); } }
      ]
    });
    if (over) {
      var ack = el('yer-md-cap-ack');
      var ovs = document.querySelectorAll('.pms-ov');
      var go = ovs.length ? ovs[ovs.length - 1].querySelector('.pms-btn-default') : null;
      if (go) { go.disabled = true; go.title = L('Tick xác nhận ở trên để tiếp tục', 'Tick the confirmation above to continue'); }
      if (ack) ack.addEventListener('change', function () { if (go) go.disabled = !ack.checked; });
    }
  }

  function doSubmit(p, capConfirmed) {
    var updating = mySubmitted(p);
    var now = S.session().date;
    var payload;
    // Giờ demo lấy từ đồng hồ máy; cùng ngày thì không được sớm hơn lần lưu trước để thứ tự trong lịch sử đúng
    var time = nowTime();
    var prevLog = myLog(p)[myLog(p).length - 1];
    if (prevLog && prevLog.at === now && prevLog.time && prevLog.time >= time) {
      var mins = Number(prevLog.time.slice(0, 2)) * 60 + Number(prevLog.time.slice(3)) + 1;
      time = String(Math.floor(mins / 60) % 24).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
    }
    if (role() === 'lm') {
      payload = { goalScores: draft.goalScores, howScores: draft.howScores,
                  comments: draft.comments, overall: draft.overall, at: now, time: time, source: 'manual' };
      // Mỗi lần QLTT gửi là một thẻ trong Lịch sử chỉnh sửa (chốt 04/10/2026); lần gửi lại ghi thay đổi so với bản trước
      S.setAct(S.session().emp, 'lmLog', { items: Y.nextManagerLog('lm', p, {
        at: now, time: time, score: draft.overall.score, comment: (draft.overall || {}).comment || '', source: 'detail',
        changes: updating ? lmChanges(p, p.lm, draft) : null }) });
    } else {
      payload = { score: draft.overall.score, comment: (draft.overall || {}).comment || '',
                  at: now, time: time, source: 'manual' };
      // Mỗi lần LM2, HOD lưu là một dòng lịch sử, chung với lần chấm trên danh sách M-05 (§47)
      S.setAct(S.session().emp, role() + 'Log', { items: Y.nextManagerLog(role(), p,
        { at: now, time: time, score: payload.score, comment: payload.comment, source: 'detail' }) });
    }
    // Ghi lại việc người chấm đã xác nhận giữ điểm cao hơn mức tối đa (§27.3), để truy vết
    payload.capConfirmed = capConfirmed ? { max: Y.lateMeasure(p).cap, score: draft.overall.score, at: now } : null;
    S.setAct(S.session().emp, role(), payload);
    S.clearAct(S.session().emp, draftKey());
    delete editingMem[editKey(p)]; // lưu xong thì về chế độ xem
    U.dirty.clear();
    U.toast(updating ? L('Đã lưu thay đổi đánh giá', 'Review changes saved')
      : isLm() ? L('Đã gửi đánh giá', 'Review submitted') : L('Đã lưu điểm', 'Rating saved'));
    render();
    // Gửi xong thì đưa người chấm lên banner xanh đầu tab, như E-05 (§8.1)
    var bn = document.querySelector('#yer-mgr-detail-root .submit-banner');
    if (bn) bn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Số ô QLTT đã sửa so với bản gửi trước, theo nhóm (cho Lịch sử chỉnh sửa)
  function lmChanges(p, prev, next) {
    prev = prev || {};
    var byType = { what: 0, dev: 0 };
    ['what', 'dev'].forEach(function (t) {
      approvedGoals(p, t).forEach(function (g) {
        if ((prev.goalScores || {})[g.id] !== (next.goalScores || {})[g.id]) byType[t]++;
      });
    });
    var how = CORE_VALUES.filter(function (_, i) { return (prev.howScores || {})[i] !== (next.howScores || {})[i]; }).length;
    var comments = ['what', 'dev', 'how'].filter(function (t) {
      return ((prev.comments || {})[t] || '') !== ((next.comments || {})[t] || '');
    });
    return { goalScoresByType: byType, howScores: how, comments: comments };
  }

  /* ── QLTT thêm mục tiêu cho nhân viên thai sản (§33, chốt 30/09/2026) ──
     Một popup, hai cách: `Nhập tay` từng mục tiêu hoặc `Tải file` nhiều mục tiêu. Mục tiêu thêm vào tự `Đã duyệt`,
     ghi ở acts[emp].lmGoals. Chỉ mở cho nhân viên thai sản, trong timeline QLTT (Y.canAddGoals). */
  function nowTime() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  var DATE_RE = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
  var PRIO_TEXT = { 'cao': 'h', 'high': 'h', 'trung bình': 'm', 'medium': 'm', 'thấp': 'l', 'low': 'l' };

  function saveLmGoals(p, goals, via) {
    var now = S.session().date, time = nowTime();
    var me = Y.actors(p).lm || {};
    var items = ((actsOf().lmGoals || {}).items || []).slice();
    goals.forEach(function (g, i) {
      items.push(Object.assign({ id: 'lmg-' + p.id + '-' + Date.now() + '-' + i, at: now, time: time, via: via,
        by: { name: me.name, login: me.login } }, g));
    });
    S.setAct(p.id, 'lmGoals', { items: items });
  }

  function typeOptions(selected) {
    return ['what', 'dev'].map(function (t) {
      return '<option value="' + t + '"' + (selected === t ? ' selected' : '') + '>' + esc(lg() === 'en' ? TYPE[t].en : TYPE[t].vi) + '</option>';
    }).join('');
  }

  // Ghi chú chung của popup, mỗi ý một gạch đầu dòng, gọi tên vai `QLTT` (chốt 04/10/2026)
  function goalNote() {
    return '<div class="info-note yer-gd-note"><div><strong class="yer-gd-note-hd">' + L('Lưu ý:', 'Note:') + '</strong><ul>' +
      '<li>' + L('Mục tiêu do QLTT thêm được hệ thống ghi nhận ở trạng thái <strong>Đã duyệt</strong>.',
        'Goals the line manager adds are recorded as <strong>Approved</strong>.') + '</li>' +
      '<li>' + L('Mục tiêu này <strong>chỉ nằm ở tab Đánh giá cuối năm</strong>, không thêm vào tab Danh sách mục tiêu của nhân viên.',
        'These goals <strong>live only in the Year-End Review tab</strong> and are not added to the employee goal list.') + '</li>' +
      '<li>' + L('Sau khi thêm mục tiêu, QLTT <strong>không thể sửa hoặc xóa</strong> được mục tiêu này.',
        'Once added, the line manager <strong>cannot edit or remove</strong> these goals.') + '</li>' +
      '</ul></div></div>';
  }

  // Ô soạn thảo dạng (A) neutral của DS COMPONENTS §15, như popup Tạo mục tiêu mới của E-05
  function rteHtml(id, placeholder, max, value, large) {
    return '<div class="rte-wrap" id="' + id + '-wrap">' +
      '<div class="rte-toolbar" onmousedown="event.preventDefault()">' +
        '<button type="button" class="rte-btn" data-gd-cmd="bold" title="' + esc(L('In đậm', 'Bold')) + '"><b>B</b></button>' +
        '<button type="button" class="rte-btn" data-gd-cmd="italic" title="' + esc(L('In nghiêng', 'Italic')) + '"><span style="font-style:italic">I</span></button>' +
        '<button type="button" class="rte-btn" data-gd-cmd="underline" title="' + esc(L('Gạch chân', 'Underline')) + '"><u>U</u></button>' +
        '<div class="rte-sep"></div>' +
        '<button type="button" class="rte-btn" data-gd-cmd="insertUnorderedList" title="' + esc(L('Danh sách', 'List')) + '"><i class="bx bx-list-ul" style="font-size:16px"></i></button>' +
      '</div>' +
      '<div class="rte-body' + (large ? ' rte-lg' : '') + '" contenteditable="true" id="' + id + '" data-max="' + max + '" data-placeholder="' + esc(placeholder) + '">' +
        esc(value || '') + '</div></div>' +
      '<div class="fcnt" id="' + id + '-cnt">' + String(value || '').length + ' / ' + max + '</div>';
  }
  function dmyToIso(v, year) {
    var m = /^(\d{2})\/(\d{2})$/.exec(String(v || ''));
    return m ? year + '-' + m[2] + '-' + m[1] : '';
  }
  function isoToDm(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || ''));
    return m ? m[3] + '/' + m[2] : '';
  }

  /* Popup thêm mục tiêu cho nhân viên thai sản (chốt lại 04/10/2026):
     - Hai thẻ `Nhập tay` / `Import mục tiêu` ở góc phải tiêu đề popup.
     - `Nhập tay` cùng trường và cùng kiểu với popup Tạo mục tiêu mới của E-05: Loại mục tiêu; hàng Mức độ ưu tiên (chỉ mục
       tiêu công việc), Từ ngày, Đến ngày; Tên mục tiêu và Kết quả cần đạt dạng ô soạn thảo có bộ đếm.
     - `Import mục tiêu` cùng các bước của popup Import mục tiêu của E-05: tải Template, chọn file, Đọc file, Import.
     keep: { mode: 'manual'|'upload', type, title, result, prio, s, e, fileName, fileText, parsed } */
  function openGoalDialog(p, keep) {
    keep = Object.assign({ mode: 'manual', type: '', title: '', result: '', prio: 'm', s: '01/01', e: '31/12',
      fileName: '', fileText: '', parsed: null }, keep || {});
    if (!keep.type) keep.type = p.eligibility.missingWhat ? 'what' : 'dev';
    var manual = keep.mode === 'manual';
    var year = String(Y.step('self').from).slice(0, 4) - 1; // chu kỳ 2026
    var tabs = '<div class="yer-gd-tabs" role="tablist">' +
      '<button type="button" class="yer-gd-tab' + (manual ? ' on' : '') + '" data-gd-mode="manual"><i class="bx bx-edit"></i>' + L('Nhập tay', 'Enter by hand') + '</button>' +
      '<button type="button" class="yer-gd-tab' + (!manual ? ' on' : '') + '" data-gd-mode="upload"><i class="bx bx-upload"></i>' + L('Import mục tiêu', 'Import goals') + '</button></div>';
    var isWhat = keep.type === 'what';
    var body = manual
      ? '<div class="fg"><label class="flbl" for="yer-gd-type">' + L('Loại mục tiêu', 'Goal type') + ' <span class="req">*</span></label>' +
          '<select class="fc" id="yer-gd-type">' + typeOptions(keep.type) + '</select></div>' +
        '<div class="fg"><div class="frow3" id="yer-gd-row" style="grid-template-columns:' + (isWhat ? '1fr 1fr 1fr' : '1fr 1fr') + '">' +
          '<div class="yer-gd-prio"' + (isWhat ? '' : ' hidden') + '><label class="flbl" for="yer-gd-prio">' + L('Mức độ ưu tiên', 'Priority') + ' <span class="req">*</span></label>' +
            '<select class="fc" id="yer-gd-prio">' + ['h', 'm', 'l'].map(function (k) {
              return '<option value="' + k + '"' + (keep.prio === k ? ' selected' : '') + '>' + esc(lg() === 'en' ? PRIO[k].en : PRIO[k].vi) + '</option>';
            }).join('') + '</select></div>' +
          '<div><label class="flbl" for="yer-gd-s">' + L('Từ ngày', 'From') + ' <span class="req">*</span></label>' +
            '<input type="date" class="fc" id="yer-gd-s" value="' + esc(dmyToIso(keep.s, year)) + '"></div>' +
          '<div><label class="flbl" for="yer-gd-e">' + L('Đến ngày', 'To') + ' <span class="req">*</span></label>' +
            '<input type="date" class="fc" id="yer-gd-e" value="' + esc(dmyToIso(keep.e, year)) + '"></div>' +
        '</div></div>' +
        '<div class="fg"><label class="flbl" for="yer-gd-title">' + L('Tên Mục tiêu', 'Goal title') + ' <span class="req">*</span></label>' +
          rteHtml('yer-gd-title', L('Mô tả ngắn gọn mục tiêu cần đạt...', 'A short description of the goal...'), 1000, keep.title) + '</div>' +
        '<div class="fg"><label class="flbl" for="yer-gd-result">' + L('Kết quả cần đạt', 'Expected result') + ' <span class="req">*</span></label>' +
          rteHtml('yer-gd-result', L('KPI, Key Results và cách đo lường định lượng...', 'KPIs, key results and how they are measured...'), 4000, keep.result, true) + '</div>'
      : '<ol class="imp-steps">' +
          '<li class="imp-step"><span class="proc-num">1</span><div class="imp-txt">' +
            L('Tải xuống Template và điền thông tin theo đúng định dạng: mỗi dòng một mục tiêu, loại <strong>WHAT</strong> (Mục tiêu công việc) hoặc <strong>DEVELOPMENT</strong> (Mục tiêu phát triển).',
              'Download the template and fill it in: one goal per row, type <strong>WHAT</strong> (work goal) or <strong>DEVELOPMENT</strong> (development goal).') +
            '<div><button type="button" class="btn btn-outline btn-sm" id="yer-gd-tpl" style="margin-top:8px"><i class="bx bx-download"></i> ' + L('Tải Template', 'Download template') + '</button></div></div></li>' +
          '<li class="imp-step"><span class="proc-num">2</span><div class="imp-txt">' +
            L('Tải lên tập tin đã điền thông tin.', 'Upload the completed file.') +
            '<div class="imp-drop" id="yer-gd-pick" role="button" tabindex="0"><i class="bx bx-cloud-upload"></i>' +
              (keep.fileName ? esc(keep.fileName) : L('Kéo thả hoặc bấm để chọn tập tin (.csv)', 'Drag and drop or click to choose a file (.csv)')) + '</div>' +
            '<input type="file" id="yer-gd-input" accept=".csv" hidden></div></li>' +
          '<li class="imp-step"><span class="proc-num">3</span><div class="imp-txt">' +
            L('Bấm <strong>Đọc file</strong> để hệ thống kiểm tra dữ liệu.', 'Choose <strong>Read file</strong> to check the data.') + '</div></li>' +
          '<li class="imp-step"><span class="proc-num">4</span><div class="imp-txt">' +
            L('Bấm <strong>Import</strong> để thêm toàn bộ mục tiêu hợp lệ cho nhân viên.', 'Choose <strong>Import</strong> to add every valid goal for the employee.') + '</div></li>' +
        '</ol>' +
        (keep.parsed ? '<div class="yer-gd-prev"><div class="yer-gd-prev-hd">' +
            L('Kết quả đọc file: ' + keep.parsed.ok.length + ' mục tiêu hợp lệ', 'File check: ' + keep.parsed.ok.length + ' valid goals') +
            (keep.parsed.bad ? L(', bỏ qua ' + keep.parsed.bad + ' dòng thiếu thông tin', ', ' + keep.parsed.bad + ' incomplete rows skipped') : '') + '</div>' +
            '<ul>' + keep.parsed.ok.map(function (g) {
              return '<li><span class="yer-gd-tag">' + esc(lg() === 'en' ? TYPE[g.type].en : TYPE[g.type].vi) + '</span>' + esc(g.title) + '</li>';
            }).join('') + '</ul></div>' : '');

    var importCount = keep.parsed ? keep.parsed.ok.length : 0;
    U.dialog({
      title: L('Thêm mục tiêu cho nhân viên thai sản', 'Add goals for the employee on maternity leave'),
      className: 'yer-gd-dlg',
      html: tabs + '<div class="yer-gd-emp"><strong>' + esc(p.emp.name) + '</strong> <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' +
        body + goalNote(),
      buttons: manual ? [
        { label: L('Hủy', 'Cancel'), variant: 'quiet' },
        { label: L('Thêm mục tiêu', 'Add goal'), variant: 'default', icon: 'bx-plus', act: function () {
            var v = readManual();
            var miss = [];
            if (v.type === 'what' && !v.prio) miss.push(L('mức độ ưu tiên', 'priority'));
            if (!v.s || !v.e) miss.push(L('thời gian', 'dates'));
            if (!v.title) miss.push(L('tên mục tiêu', 'title'));
            if (!v.result) miss.push(L('kết quả cần đạt', 'expected result'));
            if (miss.length) {
              U.toast(L('Cần nhập: ', 'Please fill in: ') + miss.join(', '));
              openGoalDialog(p, Object.assign(keep, v, { mode: 'manual' }));
              return;
            }
            saveLmGoals(p, [{ type: v.type, title: v.title, result: v.result, prio: v.type === 'what' ? v.prio : null, s: v.s, e: v.e }], 'manual');
            U.toast(L('Đã thêm mục tiêu, trạng thái Đã duyệt', 'Goal added and approved'));
            render();
          } }
      ] : [
        { label: L('Hủy', 'Cancel'), variant: 'quiet' },
        { label: L('Đọc file', 'Read file'), variant: 'outline', act: function () {
            if (!keep.fileText) {
              U.toast(L('Chọn tập tin trước khi đọc', 'Choose a file first'));
              openGoalDialog(p, keep);
              return;
            }
            openGoalDialog(p, Object.assign(keep, { parsed: parseGoalCsv(keep.fileText) }));
          } },
        { label: importCount ? L('Import ' + importCount + ' mục tiêu', 'Import ' + importCount + ' goals') : 'Import',
          variant: 'default', icon: 'bx-upload', act: function () {
            if (!importCount) {
              U.toast(L('Đọc file và cần ít nhất một mục tiêu hợp lệ trước khi Import', 'Read a file with at least one valid goal before importing'));
              openGoalDialog(p, keep);
              return;
            }
            saveLmGoals(p, keep.parsed.ok, 'upload');
            U.toast(L('Đã thêm ' + importCount + ' mục tiêu, trạng thái Đã duyệt', importCount + ' goals added and approved'));
            render();
          } }
      ]
    });
    // Popup đóng trước khi chạy nút, nên giá trị các ô được ghi vào keep ngay khi nhập
    function bindVal(id, key, map) {
      var node = el(id);
      if (!node) return;
      ['input', 'change'].forEach(function (ev) {
        node.addEventListener(ev, function () { keep[key] = map ? map(node.value) : node.value; });
      });
    }
    bindVal('yer-gd-type', 'type');
    bindVal('yer-gd-prio', 'prio');
    bindVal('yer-gd-s', 's', isoToDm);
    bindVal('yer-gd-e', 'e', isoToDm);
    ['title', 'result'].forEach(function (k) {
      var node = el('yer-gd-' + k);
      if (!node) return;
      node.addEventListener('input', function () {
        keep[k] = node.innerText.trim();
        var cnt = el('yer-gd-' + k + '-cnt');
        if (cnt) cnt.textContent = keep[k].length + ' / ' + node.dataset.max;
      });
    });
    document.querySelectorAll('.yer-gd-dlg [data-gd-cmd]').forEach(function (b) {
      b.addEventListener('click', function () { document.execCommand(b.dataset.gdCmd, false, null); });
    });
    function readManual() {
      return {
        type: keep.type, prio: keep.prio,
        title: String(keep.title || '').trim(), result: String(keep.result || '').trim(),
        s: String(keep.s || '').trim(), e: String(keep.e || '').trim()
      };
    }
    function closeTop() { var ovs = document.querySelectorAll('.pms-ov'); if (ovs.length) ovs[ovs.length - 1].remove(); }
    document.querySelectorAll('.yer-gd-dlg [data-gd-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.gdMode === keep.mode) return;
        closeTop();
        openGoalDialog(p, Object.assign(keep, { mode: b.dataset.gdMode }));
      });
    });
    var typeSel = el('yer-gd-type');
    if (typeSel) typeSel.addEventListener('change', function () {
      // Mục tiêu phát triển không có mức độ ưu tiên, hàng còn hai cột như E-05
      var pr = document.querySelector('.yer-gd-prio'), row = el('yer-gd-row');
      var what = typeSel.value === 'what';
      if (pr) pr.hidden = !what;
      if (row) row.style.gridTemplateColumns = what ? '1fr 1fr 1fr' : '1fr 1fr';
    });
    var tpl = el('yer-gd-tpl'), pick = el('yer-gd-pick'), input = el('yer-gd-input');
    if (tpl) tpl.addEventListener('click', downloadGoalTemplate);
    if (pick) {
      pick.addEventListener('click', function () { input.click(); });
      pick.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    }
    if (input) input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        closeTop();
        openGoalDialog(p, Object.assign(keep, { mode: 'upload', fileName: file.name, fileText: String(reader.result || ''), parsed: null }));
      };
      reader.readAsText(file, 'utf-8');
    });
  }

  function csvCell(v) {
    var t = String(v == null ? '' : v);
    return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  }
  function downloadGoalTemplate() {
    var rows = [['Loại mục tiêu', 'Tên mục tiêu', 'Kết quả cần đạt', 'Ưu tiên', 'Bắt đầu', 'Kết thúc'],
      ['WHAT', 'Ví dụ: Duy trì chất lượng kiểm thử hồi quy', 'Ví dụ: 95% ca kiểm thử trọng yếu chạy tự động trước mỗi đợt phát hành', 'Trung bình', '01/01', '31/12'],
      ['DEVELOPMENT', 'Ví dụ: Hoàn thành khóa kiểm thử hiệu năng', 'Ví dụ: Áp dụng vào 1 dự án của nhóm', '', '01/01', '31/12']];
    var blob = new Blob(['\ufeff' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'YER-2026-muc-tieu-QLTT-them.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function parseGoalCsv(text) {
    var rows = [], row = [], cell = '', q = false;
    text = text.replace(/^\ufeff/, '');
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
    rows.shift(); // dòng tiêu đề
    var ok = [], bad = 0;
    rows.forEach(function (r) {
      if (!r.some(function (v) { return String(v).trim(); })) return;
      var kind = String(r[0] || '').trim().toUpperCase();
      var type = kind === 'WHAT' ? 'what' : kind === 'DEVELOPMENT' ? 'dev' : null;
      var title = String(r[1] || '').trim(), result = String(r[2] || '').trim();
      var s = String(r[4] || '').trim() || '01/01', e = String(r[5] || '').trim() || '31/12';
      if (!type || !title || !result || !DATE_RE.test(s) || !DATE_RE.test(e) || /^Ví dụ:/.test(title)) { bad++; return; }
      ok.push({ type: type, title: title, result: result, prio: type === 'what' ? (PRIO_TEXT[String(r[3] || '').trim().toLowerCase()] || 'm') : null, s: s, e: e });
    });
    return { ok: ok, bad: bad };
  }

  /* ── CSS riêng ───────────────────────────────────────── */
  function injectCss() {
    if (el('yer-md-css')) return;
    var st = document.createElement('style');
    st.id = 'yer-md-css';
    st.textContent =
      '#yer-mgr-detail-root .yer-mgr-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-bottom:0}' +
      '#yer-mgr-detail-root .yer-md-nav{margin-bottom:14px}' +
      '#yer-mgr-detail-root .yer-md-steps{margin-bottom:14px}' +
      '#yer-mgr-detail-root .rv-grid .g-none-row td{padding:16px 12px}' +
      '#yer-mgr-detail-root .g-none{text-align:center;font-size:12.5px;color:var(--z400);font-style:italic}' +
      '#yer-mgr-detail-root .rv-grid tbody tr[data-name]{cursor:pointer}' +
      '#yer-mgr-detail-root .yer-md-submit-banner{margin-bottom:14px}' +
      // Nhóm nút nổi khi cuộn, cùng kiểu .yer-actions.floating của E-05 (§49)
      '.yer-md-actbar{display:flex}' +
      '#yer-mgr-detail-root .yer-mgr-actions.floating{position:fixed;z-index:880;left:calc(var(--sw) + (100vw - var(--sw)) / 2);transform:translateX(-50%);' +
        'padding:8px;background:var(--z0);border:1px solid var(--z200);border-radius:var(--r);box-shadow:var(--sh-lg)}' +
      'body.embedded-detail #yer-mgr-detail-root .yer-mgr-actions.floating{left:50%}' +
      '@media(max-width:900px){#yer-mgr-detail-root .yer-mgr-actions.floating{left:50%}}' +
      '#yer-mgr-detail-root .yer-md-late-banner .sb-sub strong{color:var(--z900);font-weight:700}' +
      '#yer-mgr-detail-root .yer-op-def[data-shown="0"]{display:none}' +
      '#yer-mgr-detail-root .yer-visibility-note{margin-top:14px}' +
      // Menu tải kết quả trong banner, cùng kiểu .download-menu của E-05
      '.yer-dl-menu{position:relative;display:inline-flex}' +
      '.yer-dl-menu.open .yer-dl-toggle{border-color:var(--brand);color:var(--brand);background:var(--brand-muted)}' +
      '.yer-dl-pop{display:none;position:absolute;top:calc(100% + 6px);right:0;z-index:300;min-width:168px;padding:4px;background:var(--z0);' +
        'border:1px solid var(--z200);border-radius:var(--rsm);box-shadow:var(--sh-md)}' +
      '.yer-dl-menu.open .yer-dl-pop{display:block}' +
      '.yer-dl-opt{width:100%;display:flex;align-items:center;gap:8px;padding:7px 9px;border:0;border-radius:var(--rxs);background:transparent;' +
        'color:var(--z700);font-family:inherit;font-size:12.5px;font-weight:500;line-height:1.4;text-align:left;white-space:nowrap;cursor:pointer;transition:var(--t)}' +
      '.yer-dl-opt:hover{background:var(--z100);color:var(--z900)}' +
      '.yer-dl-opt i{width:16px;font-size:15px;color:var(--z500);text-align:center}' +
      '.yer-hd-sub{margin-left:auto;font-size:11.5px;font-weight:400;color:var(--z500);text-transform:none;letter-spacing:0}' +
      '#yer-mgr-detail-root>.info-note{display:flex;gap:8px;align-items:flex-start;margin-bottom:18px;' +
        'padding:11px 14px;background:var(--z0);border:1px solid var(--z200);border-radius:var(--r);' +
        'font-size:12px;color:var(--z600);line-height:1.5}' +
      '#yer-mgr-detail-root>.info-note>i{flex-shrink:0;margin-top:1px;font-size:15px;color:var(--brand)}' +
      '#yer-mgr-detail-root>.info-note strong{color:var(--z700);font-weight:600}' +
      // (HR system): chữ thường trong ngoặc, không viền, không nền (giống M-05)
      '#yer-mgr-detail-root .yer-sync-tag{display:inline-block;margin-left:4px;font-size:11px;font-weight:500;color:var(--z600);' +
        'text-transform:none;letter-spacing:0;white-space:nowrap}' +
      '#yer-mgr-detail-root .op-hd-dom{text-transform:none;letter-spacing:0;font-size:12px;font-weight:500;color:var(--z600)}' +
      '.yer-note-list{margin:5px 0 0;padding-left:16px;display:flex;flex-direction:column;gap:3px}' +
      // Khối Lưu ý và khối vàng dùng cùng kiểu với màn Nhân viên (§40.5a)
      '#yer-mgr-detail-root .yer-note-list .yer-hl{color:var(--brand);font-weight:700}' +
      '#yer-mgr-detail-root .yer-note{display:flex;gap:8px;padding:11px 13px;margin-bottom:18px;border:1px solid;border-radius:var(--rsm);' +
        'font-size:12.5px;line-height:1.55}' +
      '#yer-mgr-detail-root .yer-note>i{font-size:18px;flex:none;margin-top:1px}' +
      '#yer-mgr-detail-root .yer-note.yer-late-closed{background:var(--warn-bg);border-color:var(--warn-bd);color:var(--z800)}' +
      '#yer-mgr-detail-root .yer-late-closed>i{color:var(--warn)}' +
      '#yer-mgr-detail-root .yer-late-closed strong{color:var(--z900);font-weight:700}' +
      '#yer-mgr-detail-root .yer-late-wait p{margin:4px 0 0}' +
      // Khối đang chỉnh sửa, cùng kiểu .yer-note.action của E-05
      '#yer-mgr-detail-root .yer-note.action{background:var(--brand-muted);border-color:var(--brand-ring);color:var(--z800)}' +
      '#yer-mgr-detail-root .yer-note.action>i{color:var(--brand)}' +
      '#yer-mgr-detail-root .yer-note .yn-cta{margin-left:auto;flex:none;align-self:center}' +
      '#yer-mgr-detail-root .yer-edit-note strong{color:var(--z900);font-weight:700}' +
      '.yer-dlg-p{margin-top:8px}' +
      '.yer-dlg-list{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px}' +
      '.yer-dlg-list strong,.yer-dlg-p strong{color:var(--z900);font-weight:600}' +
      // Popup thiếu thông tin và viền đỏ ô còn thiếu, như E-05 (DS §14)
      '.yer-miss-dialog{max-width:500px}' +
      '#yer-mgr-detail-root [data-rt].yer-miss select{border-color:var(--err);box-shadow:0 0 0 3px var(--err-bg)}' +
      '#yer-mgr-detail-root .ev-editor-wrap.yer-miss{border-color:var(--err);box-shadow:inset 3px 0 0 var(--err),0 0 0 3px var(--err-bg)}' +
      // Nhãn Trễ hạn trong banner: màu đỏ như E-05 (DS §19 rule 24)
      '.yer-late-status{display:inline-flex;align-items:center;padding:1px 6px;border:1px solid var(--err-bd);border-radius:99px;' +
        'background:var(--err-bg);color:var(--err);font-size:10.5px;font-weight:700;line-height:1.5}' +
      '.yer-late-csq{line-height:1.55}' +
      '.yer-late-csq strong{color:var(--z900);font-weight:700}' +
      '.yer-note-list li{line-height:1.55}' +
      // Khối hướng dẫn thai sản của QLTT (chốt 02/10/2026): đoạn dẫn, ba bước đánh số, dòng Lưu ý cuối khối
      '#yer-mgr-detail-root .yer-mat-guide p{margin:4px 0 0;line-height:1.55}' +
      '#yer-mgr-detail-root .yer-mat-guide .yer-hl{color:var(--brand);font-weight:700}' +
      // Ba bước của khối hướng dẫn thai sản: nằm ngang, độ rộng tỉ lệ độ dài chữ, mũi tên ở khe giữa hai bước (08/10/2026)
      '.yer-mat-body{flex:1;min-width:0}' +
      '.yer-mat-panel{margin:10px 0 0;padding:12px 16px;border-radius:var(--r);background:var(--brand-muted)}' +
      '.yer-mat-notes{margin-top:12px;padding-top:10px;border-top:1px solid var(--z200)}' +
      '#yer-mgr-detail-root .yer-mat-notes p:first-child{margin-top:0}' +
      '.yer-mat-steps{list-style:none;margin:0;padding:0;display:flex;gap:10px 40px;align-items:flex-start}' +
      '.yer-mat-step{position:relative;flex:1 1 0;display:flex;gap:9px;align-items:flex-start;min-width:150px}' +
      '.yer-mat-step+.yer-mat-step::before{content:"";position:absolute;left:-26px;top:7px;width:8px;height:8px;' +
        'border-top:1.5px solid var(--z400);border-right:1.5px solid var(--z400);transform:rotate(45deg)}' +
      '.yer-mat-no{flex:none;display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--brand);' +
        'color:var(--z0);font-size:11.5px;font-weight:700}' +
      '.yer-mat-tx{min-width:0;font-size:12.5px;line-height:1.55;color:var(--z800);padding-top:1px;text-wrap:pretty}' +
      '.yer-mat-tx strong{color:var(--z900);font-weight:700}' +
      '.yer-mat-sub{display:block;margin-top:3px;font-size:11.5px;color:var(--z500)}' +
      '.yer-mat-sub strong{color:var(--z700);font-weight:600}' +
      // Liên kết khóa vẫn màu hồng (chữ mở popup luôn hồng, 08/10/2026), nhạt hơn và gạch chân chấm để biết chưa bấm được
      '.yer-note-link.is-off,.yer-note-link.is-off:hover{color:var(--brand);opacity:.55;text-decoration-style:dotted;cursor:not-allowed}' +
      '@media(max-width:820px){.yer-mat-steps{flex-direction:column}.yer-mat-step{flex-grow:0!important;width:100%}.yer-mat-step+.yer-mat-step::before{display:none}}' +
      '#yer-mgr-detail-root .yer-mat-guide p + .yer-note-list{margin-top:2px}' +
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
      // Nút AI: AI Summary ở hàng nút, `Cải thiện với AI` ở góc ô nhận xét của QLTT (§14)
      '.yer-md-ai{color:var(--brand);border-color:var(--brand-ring)}' +
      '.yer-md-ai:hover{background:var(--brand-muted);border-color:var(--brand)}' +
      '.yer-ai-write{margin-left:auto;display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border:1px solid var(--brand-ring);' +
        'border-radius:50px;background:var(--brand-muted);color:var(--brand);font-family:inherit;font-size:11px;font-weight:600;' +
        'text-transform:none;letter-spacing:0;cursor:pointer;transition:var(--t)}' +
      '.yer-ai-write:hover{background:var(--brand);color:var(--brand-fg)}' +
      '.yer-ai-write i{font-size:12px}' +
      '.yer-flbl-ai{display:flex!important;align-items:center;gap:4px}' +
      '.g-lm-row{display:flex;align-items:center;gap:4px;margin-top:5px}' +
      '.g-lm-chip{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border:1px solid var(--info-bd);border-radius:50px;' +
        'background:var(--info-bg);color:var(--info);font-size:11px;font-weight:500;white-space:nowrap;cursor:help}' +
      '.g-lm-chip i{font-size:12px}' +
      // Popup thêm mục tiêu: rộng như popup Import của E-05, hai thẻ ở góc phải tiêu đề (chốt 04/10/2026)
      '.yer-gd-dlg{width:min(640px,calc(100vw - 32px));max-width:none;max-height:calc(100vh - 32px);display:flex;flex-direction:column}' +
      '.yer-gd-dlg .pms-dlg-bd{flex:1 1 auto;min-height:0;overflow-y:auto}' +
      '.yer-gd-dlg .pms-dlg-ti{padding-right:250px}' +
      '.yer-gd-dlg .pms-dlg-tx{color:var(--z700)}' +
      '.yer-gd-tabs{position:absolute;top:13px;right:46px;display:inline-flex;gap:2px;padding:3px;border:1px solid var(--z200);border-radius:var(--rsm);background:var(--z50)}' +
      '.yer-gd-tab{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border:0;border-radius:var(--rxs);background:transparent;' +
        'font-family:inherit;font-size:12px;color:var(--z600);cursor:pointer}' +
      '.yer-gd-tab.on{background:var(--z0);color:var(--brand);font-weight:600;box-shadow:var(--sh-sm)}' +
      '.yer-gd-emp{font-size:13px;color:var(--z900);margin:2px 0 12px}' +
      '.yer-gd-prio[hidden]{display:none}' +
      '.yer-gd-dlg .fcnt{margin-top:2px}' +
      '.yer-gd-note{display:flex;gap:8px;align-items:flex-start;margin-top:12px;padding:10px 12px;border:1px solid var(--z200);border-radius:var(--rsm);' +
        'background:var(--z50);font-size:12.5px;line-height:1.55;color:var(--z700)}' +
      '.yer-gd-note-hd{display:block;margin-bottom:3px}' +
      '.yer-gd-note ul{margin:0;padding-left:16px;display:flex;flex-direction:column;gap:2px}' +
      // Ô chọn tập tin gọn một hàng (chị chốt 04/10/2026)
      '.yer-gd-dlg .imp-drop{display:flex;align-items:center;justify-content:center;gap:6px;min-height:0;margin-top:8px;padding:8px 12px;' +
        'font-size:12.5px;line-height:1.4}' +
      '.yer-gd-dlg .imp-drop i{font-size:16px;margin:0}' +
      '.yer-gd-note strong{color:var(--z900);font-weight:600}' +
      '.yer-gd-prev{margin-top:12px;padding:9px 12px;border:1px solid var(--ok-bd);border-radius:var(--rsm);background:var(--ok-bg)}' +
      '.yer-gd-prev-hd{font-size:12px;font-weight:600;color:var(--z800);margin-bottom:6px}' +
      '.yer-gd-prev ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;max-height:140px;overflow-y:auto}' +
      '.yer-gd-prev li{font-size:12.5px;color:var(--z800);display:flex;align-items:center;gap:6px}' +
      '.yer-gd-tag{flex:none;padding:0 6px;border:1px solid var(--z200);border-radius:var(--rxs);background:var(--z0);font-size:10.5px;color:var(--z600)}' +
      // Ô Ý nghĩa thang điểm dưới ô nhận xét, như E-05 (§41.2b)
      '#yer-mgr-detail-root .yer-op-def:empty{display:none}' +
      '#yer-mgr-detail-root .yer-op-def .rt-def{margin-top:12px}' +
      // Hình thức xử lý và giới hạn điểm: tông vàng cảnh báo (DS §19 rule 24)
      '.yer-cap-note,.yer-cap-confirm{display:flex;gap:7px;align-items:flex-start;padding:8px 11px;margin:-4px 0 12px;border:1px solid var(--warn-bd);' +
        'border-radius:var(--rsm);background:var(--warn-bg);font-size:12px;line-height:1.5;color:var(--z800)}' +
      '.yer-cap-note:empty{display:none}' +
      '.yer-cap-note>i,.yer-cap-confirm>i{flex:none;margin-top:1px;font-size:15px;color:var(--warn)}' +
      '.yer-cap-over{margin-top:3px;font-weight:700;color:var(--z900)}' +
      '.yer-cap-confirm{margin:12px 0 0}' +
      '.yer-cap-ack{display:flex;align-items:flex-start;gap:7px;margin-top:8px;font-weight:600;color:var(--z900);cursor:pointer}' +
      '.yer-cap-ack input{margin:2px 0 0;width:15px;height:15px;flex:none;accent-color:var(--brand)}' +
      '.pms-btn:disabled{opacity:.5;cursor:not-allowed}' +
      '.yer-cap-chip{display:inline-flex;align-items:flex-start;gap:4px;color:var(--warn);font-size:12px;font-weight:500;line-height:1.45}' +
      '.yer-cap-chip i{font-size:14px;flex:none;margin-top:1px}' +
      // Banner hai tầng: CSS nằm ở yer-ui.js (.yer-sb2), dùng chung với E-05 (05/10/2026)
      '.yer-overall-grid{display:grid;gap:0}' +
      // Tối đa hai ô một hàng (HOD có bốn ô: hai hàng), mỗi ô đủ rộng để điểm, tên mức và ⓘ nằm một dòng như E-05 (04/10/2026)
      '#yer-mgr-detail-root .yer-overall-grid{gap:12px;padding:14px 16px}' +
      '#yer-mgr-detail-root .yer-overall-grid .overall-panel{border:1px solid var(--z200);border-radius:var(--r);' +
        'display:grid;grid-template-rows:subgrid;grid-row:span 5;row-gap:0}' +
      '#yer-mgr-detail-root .op-slot{min-width:0}' +
      '#yer-mgr-detail-root .yer-cap-row{margin:-4px 0 12px}' +
      // Nhãn mục tiêu đã chốt hoàn thành và domain người chấm
      '.g-done-chip{display:inline-flex;align-items:center;gap:4px;margin-top:5px;padding:1px 8px;' +
        'border-radius:50px;border:1px solid var(--ok-bd);background:var(--ok-bg);color:var(--ok);' +
        'font-size:11px;font-weight:500;white-space:nowrap}' +
      '.g-done-chip i{font-size:13px}' +
      '.ql-by{margin-top:3px;font-size:10.5px;line-height:1.3;color:var(--z500);' +
        'overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.rv-grid tbody tr.g-row-done{border-left:3px solid var(--ok)}' +
      '#yer-mgr-detail-root .g-row-done .ql-cell{position:relative}' +
      '#yer-mgr-detail-root .g-row-done .ql-cell>.ql-by{position:absolute;top:calc(50% + 10px);left:6px;right:6px;margin-top:0}' +
      '#yer-mgr-detail-root .ev-toolbar{display:flex}' +
      '.yer-ed-ro .ev-content{min-height:0;padding:9px 11px;color:var(--z900)}' +
      '.yer-ed-ro{border-color:var(--z200);box-shadow:none;background:var(--z50)}' +
      '.yer-ed-empty{color:var(--z500)}' +
      '.yer-mgr-empty{padding:48px 20px;text-align:center;color:var(--z500);font-size:13px}' +
      '.yer-mgr-empty i{display:block;font-size:30px;color:var(--z300);margin-bottom:8px}' +
      '#yer-mgr-detail-root .sc-cell,#yer-mgr-detail-root .ql-cell{text-align:center}' +
      '#yer-mgr-detail-root .sc-cell .rt-line,#yer-mgr-detail-root .ql-cell .rt-line{justify-content:center}' +
      '@media(max-width:1100px){.yer-overall-grid{grid-template-columns:1fr!important}' +
        '}';
    document.head.appendChild(st);
  }

  function boot() {
    Y = window.PMSYer; S = window.PMSStore; I = window.PMSI18n; U = window.PMSUi;
    if (!Y || !S || !I || !U) return;
    /* M-06 chỉ có showTip(el) đọc data-tip; các nút của tab Cuối năm gọi tip(el, text) như M-05. Thiếu hàm này thì
       tooltip của nút tải, Chỉnh sửa, chip QLTT thêm không hiện (sửa 04/10/2026). */
    if (typeof window.tip !== 'function' && typeof window.showTip === 'function') {
      window.tip = function (node, text) { if (text) node.dataset.tip = text; window.showTip(node); };
    }
    injectCss();
    var slot = el('lang-slot');
    if (slot && !slot.childElementCount) I.mountToggle(slot);
    I.onChange(render);
    document.addEventListener('pms:demo-change', function () { U.dirty.clear(); render(); });
    U.dirty.watch(document);
    U.dirty.onSaveDraft(function () { collectEditors(); saveDraft(true); });
    // Bấm ra ngoài thì đóng menu tải kết quả của banner
    document.addEventListener('click', function (e) {
      var menu = el('yer-md-dl-menu');
      if (menu && menu.classList.contains('open') && !menu.contains(e.target)) {
        menu.classList.remove('open');
        var b = el('yer-md-dl');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
    render();
  }

  window.PMSYerManagerDetail = { render: render };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
