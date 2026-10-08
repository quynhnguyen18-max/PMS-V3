/* ═══════════════════════════════════════════════════════════
   YER Model — suy ra trạng thái hồ sơ theo "ngày hệ thống"
   Nguồn: PMS_EMPLOYEES + PMS_YER (seed) + PMSStore (thao tác người dùng)
   Mọi rule trong YER-SPEC.md được tính ở đây, màn hình chỉ render.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var TL = window.PMS_YER_TIMELINE;
  var DEFAULT_DATE = '2027-01-12';

  /* ── Ngày tháng ─────────────────────────────────────────── */
  function d(v) { return v ? new Date(v + 'T00:00:00') : null; }
  function today() {
    var s = window.PMSStore && window.PMSStore.session();
    return (s && s.date) || DEFAULT_DATE;
  }
  function cmp(a, b) { return d(a) - d(b); }
  function fmt(v, lang) {
    if (!v) return '';
    var p = String(v).slice(0, 10).split('-');
    return lang === 'en' ? p[2] + '/' + p[1] + '/' + p[0] : p[2] + '/' + p[1] + '/' + p[0];
  }
  function addDays(v, n) {
    var t = d(v); t.setDate(t.getDate() + n);
    function pad(value) { return String(value).padStart(2, '0'); }
    return t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate());
  }

  function step(key) {
    return TL.steps.filter(function (s) { return s.key === key; })[0];
  }
  function stepState(key, now) {
    var s = step(key); now = now || today();
    if (cmp(now, s.from) < 0) return 'future';
    if (cmp(now, s.to) > 0) return 'closed';
    return 'open';
  }
  /* Hạn chót của từng bước trong nút Tiến trình đánh giá (chị chốt 08/10/2026): bước của một vai, từ Nhân viên tới HOD,
     đóng lúc 18:00 nên ghi `Hạn chót 18:00, dd/mm/yyyy`; bước Công bố kết quả không thuộc vai nào, chỉ ghi ngày. */
  var STEP_DUE_18 = ['self', 'lm', 'lm2', 'hod'];
  function stepDueText(key, lang) {
    var s = step(key), en = lang === 'en';
    if (STEP_DUE_18.indexOf(key) < 0) return fmt(s.to, lang);
    return (en ? 'Due 18:00, ' : 'Hạn chót 18:00, ') + fmt(s.to, lang);
  }
  /* ── Ngày làm việc (§27.3): thứ 2 đến thứ 6, trừ ngày lễ ── */
  function isWorkingDay(v) {
    var wd = d(v).getDay();
    return wd !== 0 && wd !== 6 && (window.PMS_YER_HOLIDAYS || []).indexOf(v) < 0;
  }
  function addWorkingDays(v, n) {
    var cur = v;
    while (n > 0) { cur = addDays(cur, 1); if (isWorkingDay(cur)) n--; }
    return cur;
  }
  // Số ngày làm việc sau `from`, tính tới hết ngày `to`
  function workingDaysBetween(from, to) {
    var n = 0, cur = from;
    while (cmp(cur, to) < 0) { cur = addDays(cur, 1); if (isWorkingDay(cur)) n++; }
    return n;
  }

  /* ── Nộp bổ sung sau hạn tự đánh giá: bốn lần nhắc (§27.3) ──
     Lần 1 nhắc ngay ngày làm việc đầu tiên sau hạn chót. Các lần sau cách nhau 3 ngày làm việc.
     Mỗi lần là một cơ hội nộp bổ sung, hạn là 18:00 ngày làm việc thứ ba của lần đó.
     consequence: hình thức xử lý áp cho hồ sơ nộp trong lần đó.
     next: điều xảy ra nếu hết lần đó mà vẫn chưa nộp.
     Chốt 28/09/2026: lần 4 chỉ còn cắt giảm thưởng và tạm hoãn, không cộng thêm giới hạn điểm 3. */
  var LATE_ROUND_RULE = [
    { consequence: [],         next: 'remind' },
    { consequence: [],         next: 'cap3' },
    { consequence: ['cap3'],   next: 'bonus' },
    { consequence: ['bonus'],  next: 'discipline' }
  ];
  /* Câu chữ của các hình thức xử lý: dùng chung cho màn Nhân viên và màn Quản lý (DS §20.1) */
  var LATE_TEXT = {
    remind: { vi: 'Hệ thống sẽ gửi nhắc nhở lần tiếp theo.',
              en: 'The system will send the next reminder.' },
    policy: { vi: 'Sau 2 lần nhắc nhở mà nhân viên vẫn chưa hoàn thành Tự đánh giá, các biện pháp xử lý tiếp theo sẽ được áp dụng theo quy định Công ty.',
              en: 'If the self assessment is still not completed after 2 reminders, further measures will apply under Company policy.' },
    cap3:   { vi: 'Điểm đánh giá toàn diện được giới hạn tối đa là 3.',
              en: 'The overall rating is capped at 3.' },
    bonus:  { vi: 'Cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo. Thời gian tạm hoãn tính từ thời điểm nhắc nhở thứ tư. Việc áp dụng cụ thể do Trưởng đơn vị (HOD) phối hợp với HOHR đề xuất và được Giám đốc điều hành (CEO) hoặc người được ủy quyền phê duyệt.',
              en: 'Part of the bonus is cut and promotion and salary increase are deferred for the next 6 months. The deferral counts from the fourth reminder. The Head of Department (HOD) and HOHR propose the specifics for approval by the Chief Executive Officer (CEO) or an authorised person.' },
    discipline: { vi: 'Công ty có thể sẽ đánh giá và áp dụng các hình thức kỷ luật phù hợp theo Nội quy lao động đã quy định.',
                  en: 'The Company may review and apply suitable disciplinary action under the Labour Regulations.' }
  };
  function lateRounds() {
    var out = [], r = addWorkingDays(step('self').to, 1);
    for (var k = 0; k < LATE_ROUND_RULE.length; k++) {
      out.push({ round: k + 1, remindAt: r, deadline: addWorkingDays(r, 2),
        consequence: LATE_ROUND_RULE[k].consequence, next: LATE_ROUND_RULE[k].next });
      r = addWorkingDays(r, 3);
    }
    return out;
  }
  // Lần nhắc đang áp cho một ngày sau hạn tự đánh giá; null nếu chưa quá hạn hoặc đã hết cả bốn lần
  function lateRound(v) {
    if (!v || cmp(v, step('self').to) <= 0) return null;
    return lateRounds().filter(function (r) { return cmp(v, r.deadline) <= 0; })[0] || null;
  }
  function lateText(key, lang) {
    var t = LATE_TEXT[key];
    return t ? (lang === 'en' ? t.en : t.vi) : '';
  }
  /* Từ khóa của hình thức xử lý được in đậm ở mọi màn (E-05, M-05, M-06), chuyển từ E-05 vào model ngày 04/10/2026
     để mọi nơi in đậm giống nhau. */
  var LATE_KEYWORDS = {
    vi: ['tối đa là 3', 'Cắt giảm một phần tiền thưởng', 'cắt giảm một phần tiền thưởng',
         'tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo'],
    en: ['capped at 3', 'Part of the bonus is cut', 'part of the bonus of the employee is cut',
         'promotion and salary increase are deferred for the next 6 months']
  };
  function escHtml(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function emphasizeLate(text, lang) {
    var out = escHtml(text);
    (LATE_KEYWORDS[lang === 'en' ? 'en' : 'vi'] || []).forEach(function (k) {
      out = out.split(escHtml(k)).join('<strong>' + escHtml(k) + '</strong>');
    });
    return out;
  }
  function lateTextHtml(key, lang) { return emphasizeLate(lateText(key, lang), lang); }
  function lateSubmissionDeadline() {
    var all = lateRounds();
    return all[all.length - 1].deadline;
  }
  // Số ngày trễ tính theo ngày làm việc, không tính thứ 7, chủ nhật và ngày lễ
  function lateDays(submittedAt) {
    if (!submittedAt) return 0;
    return workingDaysBetween(step('self').to, submittedAt);
  }
  /* Hạn chấm của QLTT (§27.3, chốt lại 02/10/2026): mọi hồ sơ, kể cả hồ sơ nộp bổ sung, dùng chung hạn của bước QLTT.
     Bỏ hạn chấm riêng 3 ngày làm việc của 28/09/2026: cửa sổ nộp bổ sung phải nằm trọn trong timeline QLTT (ENH-E02
     "Thời gian submit cho NV trễ là trong timeline của LM"), nên hạn lần nhắc cuối không bao giờ muộn hơn hạn QLTT.
     Kiểm tra lịch ở lateWindowFitsLm(). Giữ tham số để chỗ gọi cũ không phải đổi. */
  function lmDeadline() {
    return step('lm').to;
  }
  // Lịch hợp lệ khi hạn của lần nhắc cuối không muộn hơn hạn QLTT (test chặn lịch sai)
  function lateWindowFitsLm() {
    return cmp(lateSubmissionDeadline(), step('lm').to) <= 0;
  }
  function lateWindowOpen(now) {
    now = now || today();
    return cmp(now, step('self').to) > 0 && cmp(now, lateSubmissionDeadline()) <= 0;
  }
  function currentStep(now) {
    now = now || today();
    for (var i = 0; i < TL.steps.length; i++) {
      if (cmp(now, TL.steps[i].to) <= 0) return TL.steps[i].key;
    }
    return 'done';
  }

  /* ── Gộp seed + thao tác người dùng ─────────────────────── */
  function merge(seedBlock, actBlock) {
    if (!seedBlock && !actBlock) return null;
    return Object.assign({}, seedBlock || {}, actBlock || {});
  }

  function findEmp(id) {
    return (window.PMS_EMPLOYEES || []).filter(function (e) { return e.id === id; })[0] || null;
  }

  /* ── Điều kiện tham gia kỳ ──────────────────────────────── */
  /* lmGoals: mục tiêu QLTT thêm cho nhân viên thai sản (§33), tự `Đã duyệt` nên tính như mục tiêu đã duyệt.
     goals: danh sách mục tiêu tại thời điểm xem (goalsAt), đã tính mục tiêu gửi duyệt trong kỳ (§27.1). */
  function eligibility(emp, hr, seed, acts, lmGoals, goalsNow) {
    if (!emp) return { eligible: false, reason: 'not-found' };
    var hired = hr && hr.hired;
    if (hired && cmp(hired, TL.onboardCutoff) >= 0) {
      return { eligible: false, reason: 'late-onboard', hidden: true };
    }
    var goals = (goalsNow || emp.goals || []).filter(function (g) { return g.status === 'approved'; }).concat(lmGoals || []);
    // Dữ liệu cũ dùng boolean cho luồng thai sản (§33)
    var importCoversAll = ((acts && acts.importedGoals) || (seed && seed.importedGoals)) === true;
    var hasWhat = goals.some(function (g) { return g.type === 'what'; }) || importCoversAll;
    var hasDev = goals.some(function (g) { return g.type === 'dev'; }) || importCoversAll;
    if (!hasWhat || !hasDev) {
      return { eligible: false, reason: 'missing-goal', missingWhat: !hasWhat, missingDev: !hasDev };
    }
    return { eligible: true };
  }

  /* ── Mục tiêu gửi duyệt trong kỳ cuối năm (§27.1, chốt 07/10/2026) ──
     Seed `goalEvents` của từng hồ sơ: { id, type, title, result, prio, s, e, sentAt, approvedAt, updateAt }.
       sentAt     ngày nhân viên gửi Quản lý trực tiếp duyệt (tạo mới, hoặc sửa xong và gửi lại)
       approvedAt ngày Quản lý trực tiếp duyệt (trong timeline QLTT); chưa tới ngày này thì `pending`
       updateAt   ngày Quản lý trực tiếp bấm `Yêu cầu cập nhật` một mục tiêu đã duyệt; từ ngày đó tới sentAt là `update`
     Cùng id với mục tiêu sẵn có thì thay mục tiêu đó (sửa sau khi QLTT yêu cầu cập nhật), khác id là mục tiêu mới.
     Mọi lần gửi duyệt sau hạn Tự đánh giá là **Mục tiêu nộp trễ** (`late`), kể cả mục tiêu cũ sửa và gửi lại. */
  function goalsAt(emp, seed, now) {
    var deadline = step('self').to;
    var list = (emp.goals || []).map(function (g) { return Object.assign({}, g); });
    (seed.goalEvents || []).forEach(function (ev) {
      var started = (ev.updateAt && cmp(now, ev.updateAt) >= 0) || (ev.sentAt && cmp(now, ev.sentAt) >= 0);
      if (!started) return;
      var status = ev.sentAt && cmp(now, ev.sentAt) >= 0
        ? (ev.approvedAt && cmp(now, ev.approvedAt) >= 0 ? 'approved' : 'pending')
        : 'update';
      var sent = status !== 'update';
      var goal = Object.assign({}, ev, {
        status: status,
        late: sent && cmp(ev.sentAt, deadline) > 0,
        sentAt: sent ? ev.sentAt : null,
        approvedAt: status === 'approved' ? ev.approvedAt : null
      });
      delete goal.updateAt;
      var at = -1;
      list.forEach(function (g, i) { if (g.id === ev.id) at = i; });
      if (at >= 0) list[at] = Object.assign({}, list[at], goal); else list.push(goal);
    });
    return list;
  }

  /* ── Hồ sơ đầy đủ tại một thời điểm ─────────────────────── */
  function profile(empId, now) {
    now = now || today();
    var emp = findEmp(empId);
    if (!emp) return null;

    var hr = (window.PMS_YER_HR || {})[empId] || {};
    var seed = (window.PMS_YER || {})[empId] || {};
    var acts = (window.PMSStore && window.PMSStore.acts(empId)) || {};

    var self = merge(seed.self, acts.self);
    var lm = merge(seed.lm, acts.lm);
    var lm2 = merge(seed.lm2, acts.lm2);
    var hod = merge(seed.hod, acts.hod);
    var hrbpUpload = merge(seed.hrbpUpload, acts.hrbpUpload);
    var final = merge(seed.final, acts.final);

    // Sự kiện chỉ được coi là đã xảy ra nếu ngày hệ thống đã qua thời điểm đó
    function happened(block) { return block && block.at && cmp(now, block.at) >= 0; }

    // Mục tiêu QLTT thêm cho nhân viên thai sản (§33): { id, type, title, result, prio, s, e, at, time, via, by }
    var lmGoals = ((acts.lmGoals || {}).items || []).filter(function (g) { return g && g.at && cmp(now, g.at) >= 0; });
    var goals = goalsAt(emp, seed, now);
    var elig = eligibility(emp, hr, seed, acts, lmGoals, goals);
    var cycleOpen = step('self').from;
    var maternity = !!(hr.maternityFrom && cmp(cycleOpen, hr.maternityFrom) >= 0 &&
      (!hr.maternityTo || cmp(cycleOpen, hr.maternityTo) < 0)) || !!emp.maternity;

    var resignFrom = hr.resignFrom || emp.resignFrom || null;
    var resigned = !!(emp.resigned || (resignFrom && cmp(now, resignFrom) >= 0));

    var selfDone = happened(self);
    var lmDone = happened(lm);
    var lm2Done = happened(lm2);
    var hodDone = happened(hod);

    // Hạn QLTT chung cho mọi hồ sơ (§27.3, chốt lại 02/10/2026)
    var lmDue = lmDeadline();
    var lmClosed = cmp(now, lmDue) > 0;

    // Auto-sync quá deadline — chỉ điểm toàn diện, không kèm nhận xét
    var lmView = lmDone ? Object.assign({}, lm, { source: lm.source || 'manual' }) : null;
    if (!lmView && lmClosed && selfDone && self.overall) {
      lmView = { overall: { score: self.overall.score, comment: '' }, source: 'sync', at: lmDue, synced: true };
    }
    var lm2View = lm2Done ? Object.assign({}, lm2, { source: lm2.source || 'manual' }) : null;
    if (!lm2View && stepState('lm2', now) === 'closed' && lmView && lmView.overall) {
      lm2View = { score: lmView.overall.score, comment: '', source: 'sync', at: step('lm2').to, synced: true };
    }
    // KHÔNG đồng bộ từ LM2 sang HOD
    var hodView = hodDone ? Object.assign({}, hod, { source: hod.source || 'manual' }) : null;

    /* Lịch sử chấm điểm và nhận xét của QLTT, LM2, HOD (chốt 30/09/2026, thêm QLTT 04/10/2026): mỗi lần lưu là một dòng
       { at, time, score, comment, source }. Dữ liệu mẫu chưa có lịch sử thì suy ra một dòng từ bản đang có;
       điểm hệ thống tự chép không phải lần chấm của vai nên không vào lịch sử. */
    function managerLog(key, view) {
      var items = ((acts[key + 'Log'] || {}).items || []).filter(function (it) { return it && it.at && cmp(now, it.at) >= 0; });
      if (!items.length && view && !view.synced && view.at) {
        // QLTT lưu điểm toàn diện trong view.overall; LM2, HOD lưu thẳng view.score
        var ov = view.overall || {};
        items = [{ at: view.at, time: view.time || null, score: view.score != null ? view.score : ov.score,
                   comment: (view.overall ? ov.comment : view.comment) || '', source: view.source || 'manual' }];
      }
      return items;
    }

    /* Nộp trễ (§27.1, chốt 07/10/2026): bản Tự đánh giá gửi sau hạn là bản nộp bổ sung. Nhân viên làm ngay trên màn,
       không còn file; hồ sơ nộp bổ sung suy từ ngày gửi, không lưu riêng. */
    var lateView = selfDone && cmp(self.at, step('self').to) > 0 ? { at: self.at, time: self.time || null } : null;
    var lateOpen = lateWindowOpen(now);
    var lateClosed = cmp(now, lateSubmissionDeadline()) > 0;
    // Thiếu goal sau hạn Self chưa đồng nghĩa với dừng hồ sơ: nhân viên còn bổ sung mục tiêu và Tự đánh giá
    // tới hạn lần nhắc thứ tư, nằm trong timeline QLTT (§27.1, §27.3).
    // Thai sản không đi luồng nộp bổ sung (§12): QLTT thêm mục tiêu trong timeline của QLTT, nên không dừng ở đây
    var stopped = !elig.eligible && elig.reason === 'missing-goal' &&
      lateClosed && !lateView && !maternity;
    // Đủ mục tiêu mà không tự đánh giá: QLTT vẫn chấm tới hết hạn của QLTT (§6). Chỉ khi hết
    // hạn QLTT mà vẫn không có điểm nào thì hồ sơ mới dừng.
    var noScoreAtAll = !selfDone && !lmView;
    if (lmClosed && noScoreAtAll) stopped = true;

    var finalView = happened({ at: final && final.uploadedAt }) ? final : null;
    var published = !!(final && final.publishedAt && cmp(now, final.publishedAt) >= 0);

    /* Chỉnh sửa sau khi gửi (§8). Chỉ còn hiệu lực trong hạn tự đánh giá; hết hạn thì
       bản đã gửi gần nhất là bản chính thức, bản đang sửa dở bị bỏ. */
    var editAct = happened(acts.selfEditing) ? acts.selfEditing : null;
    var selfOpenNow = stepState('self', now) === 'open';
    var selfEditing = (selfDone && editAct && selfOpenNow) ? editAct : null;
    var log = (seed.selfLog || []).concat((acts.selfLog && acts.selfLog.items) || [])
      .filter(function (it) { return it && it.at && cmp(now, it.at) >= 0; });
    // Dòng suy ra lấy luôn giờ gửi của bản đã gửi: lịch sử lần gửi nào cũng có giờ (§8.2)
    if (!log.length && selfDone) {
      log = [{ type: 'submit', at: self.at, time: self.time || null,
        overall: self.overall ? self.overall.score : null }];
    }
    if (selfDone && editAct && !selfOpenNow) {
      log.push({ type: 'expired', at: step('self').to, time: '18:00', keptAt: self.at });
    }

    return {
      id: empId,
      emp: emp,
      hr: hr,
      now: now,
      scenario: seed.scenario || null,
      eligibility: elig,
      hidden: elig.reason === 'late-onboard' || (resigned && !emp.resignedVisible),
      resigned: resigned,
      resignFrom: resignFrom,
      /* Đủ điều kiện tham gia kỳ GIỮA NĂM hay không — khác với điều kiện kỳ cuối năm ở trên
         vì hai kỳ có hạn onboard khác nhau. Màn hình dùng cái này để khóa tab Đánh giá giữa năm. */
      myrEligible: !hr.hired || cmp(hr.hired, TL.myrOnboardCutoff || '2026-04-01') < 0,
      maternity: maternity,
      // Ngày kết thúc nghỉ chế độ, để màn hình hiện badge nhận diện. Có thể null khi
      // dữ liệu chỉ đánh dấu đang nghỉ mà không ghi hạn.
      maternityTo: maternity ? (hr.maternityTo || null) : null,
      lmGoals: lmGoals,
      // Mục tiêu tại thời điểm xem, gồm mục tiêu gửi duyệt trong kỳ (goalsAt): status, late
      goals: goals,
      deletedGoalIds: ((acts.deletedGoals || {}).ids) || [],
      importedGoals: !!((acts && acts.importedGoals) || seed.importedGoals),
      importedGoalData: (acts && acts.importedGoals) || seed.importedGoals || null,
      lateSubmission: lateView,
      // Lần nhắc gắn với hồ sơ: lần đã nộp bổ sung, hoặc lần đang mở nếu chưa nộp (§27.3)
      lateRound: lateView ? lateRound(lateView.at) : (lateOpen && !selfDone ? lateRound(now) : null),
      lateWindowOpen: lateOpen,
      lmDeadline: lmDue,
      lateSubmissionDeadline: lateSubmissionDeadline(),
      goalChangedAfterMyr: seed.goalChangedAfterMyr || [],
      mgrChange: seed.mgrChange || null,
      stopped: stopped,
      self: selfDone ? self : null,
      selfEditing: selfEditing,
      selfLog: log,
      selfRequired: !maternity,
      lm: lmView,
      lm2: lm2View,
      hod: hodView,
      lmLog: managerLog('lm', lmView),
      lm2Log: managerLog('lm2', lm2View),
      hodLog: managerLog('hod', hodView),
      hrbpUpload: happened(hrbpUpload) ? hrbpUpload : null,
      final: finalView,
      published: published,
      /* Mục tiêu đã được đánh giá hoàn thành: map goalId -> { by, score, comment, at }.
         Đây là điểm chốt của Quản lý đang phụ trách tại thời điểm đó. Khi nhân viên đổi
         Quản lý giữa kỳ, điểm này do Quản lý cũ chấm và **Quản lý mới không chấm lại**. */
      completedGoals: seed.completedGoals || {},
      myr: (window.PMS_MYR || {})[empId] || null,
      myrSelf: (window.PMS_SELFEVAL || {})[empId] || null,
      myrLm: (window.PMS_LM1EVAL || {})[empId] || null
    };
  }

  /* ── Giai đoạn của kỳ theo ngày: 'not-open', 'self', 'lm', 'lm2', 'hod', 'hr' (Total Reward, HR Director), 'publish' ── */
  function cyclePhase(now) {
    now = now || today();
    if (cmp(now, step('self').from) < 0) return 'not-open';
    if (cmp(now, step('publish').from) >= 0) return 'publish';
    var open = ['self', 'lm', 'lm2', 'hod'].filter(function (k) { return stepState(k, now) === 'open'; })[0];
    return open || 'hr';
  }

  /* ── Trạng thái của hồ sơ (§47, chị chốt lại 08/10/2026) ──────────────────
     Trạng thái đổi THEO TIMELINE, không đổi ngay khi gửi: một vai gửi xong trong timeline của mình thì là `[Vai] đã đánh giá`
     (vai đó còn sửa được, editUntil cho tooltip `Còn chỉnh sửa được tới 18:00 ngày …`); timeline của vai sau mở thì mới thành
     `Chờ [vai sau] đánh giá`. Mỗi hồ sơ một trạng thái; đặc điểm của hồ sơ (nộp trễ, thai sản, LWD, điểm hệ thống tự lấy,
     không tự đánh giá, không có điểm HOD) là tag. Mọi vai, mọi màn đọc cùng một nhãn; màu theo vai do managerStatusTone quyết.
     Ngoài kỳ đánh giá và đã nghỉ việc không nằm trong danh sách nên chỉ còn là mã nội bộ, không có nhãn hiển thị. */
  function status(p, lang) {
    lang = lang || 'vi';
    function t(vi, en) { return lang === 'en' ? en : vi; }
    function out(key, vi, en, tone, extra) { return Object.assign({ key: key, label: t(vi, en), tone: tone || 'muted' }, extra || {}); }
    if (!p) return out('none', '', '');
    if (p.eligibility.reason === 'late-onboard') return out('out', '', '');
    if (p.resigned) return out('resigned', '', '');
    // Nhãn `Không đánh giá` (chị chốt 08/10/2026, thay `Dừng đánh giá`); khối vàng trên màn vẫn là `Dừng quy trình đánh giá cuối năm`
    if (p.stopped) return out('stopped', 'Không đánh giá', 'Not evaluated');
    if (p.published) return out('published', 'Đã công bố kết quả', 'Results published', 'done');
    var phase = cyclePhase(p.now);
    if (phase === 'not-open') return out('not-open', 'Chưa mở', 'Not open yet');
    if (phase === 'self') {
      if (p.self) return out('self-done', 'NV đã tự đánh giá', 'Self assessment done', 'muted', { editUntil: step('self').to });
      // Thai sản không bắt buộc tự đánh giá (§12); bản nháp là việc riêng của nhân viên nên vẫn là Chưa tự đánh giá
      if (p.maternity) return out('self-optional', 'Không cần tự đánh giá', 'Self assessment optional');
      return out('need-self', 'Chưa tự đánh giá', 'Self assessment missing', 'action');
    }
    if (phase === 'lm') {
      if (lateWaiting(p)) return out('late-self', 'Chờ NV nộp bổ sung', 'Awaiting late self assessment', 'action', { round: p.lateRound.round });
      if (p.lm && !p.lm.synced) return out('lm-done', 'QLTT đã đánh giá', 'Line manager reviewed', 'muted', { editUntil: step('lm').to });
      // Gồm cả hồ sơ thai sản, nộp bổ sung, và hết các lần nhắc mà đủ mục tiêu (tag Không tự đánh giá)
      return out('wait-lm', 'Chờ QLTT đánh giá', 'Awaiting line manager', 'action', { noSelf: !p.self && !p.maternity });
    }
    if (phase === 'lm2') {
      if (p.lm2) return out('lm2-done', 'QL cấp 2 đã đánh giá', 'Second-level manager reviewed', 'muted', { editUntil: step('lm2').to });
      return out('wait-lm2', 'Chờ QL cấp 2 đánh giá', 'Awaiting second-level manager', 'action', { noSelf: !p.self && !p.maternity });
    }
    if (phase === 'hod') {
      if (p.hod) return out('hod-done', 'HOD đã đánh giá', 'HOD reviewed', 'muted', { editUntil: step('hod').to });
      return out('wait-hod', 'Chờ HOD đánh giá', 'Awaiting HOD', 'action', { noSelf: !p.self && !p.maternity });
    }
    // Hết timeline HOD: HOD không chấm thì vẫn đi tiếp, kèm tag Không có điểm HOD (chị chốt 08/10/2026)
    return out('wait-publish', 'Chờ công bố kết quả', 'Awaiting publication', 'muted', { noHod: !p.hod, noSelf: !p.self && !p.maternity });
  }

  /* ── Quyền của từng cấp Quản lý tại một thời điểm ─────────
     Danh sách và màn chi tiết phải cùng đọc helper này để icon hành động không
     nói khác với quyền chỉnh sửa thực tế. Một bản đã gửi vẫn sửa được nhiều lần
     trong timeline của chính vai; trước/sau timeline chỉ được xem. */
  function managerReviewState(role, p) {
    if (!p || ['lm', 'lm2', 'hod'].indexOf(role) < 0) {
      return { stepOpen: false, submitted: false, pending: false, canEdit: false };
    }

    var own = role === 'lm' ? p.lm : role === 'lm2' ? p.lm2 : p.hod;
    var submitted = role === 'lm' ? !!(own && !own.synced) : !!own;
    var stepOpen = managerEditWindow(role, p).state === 'open';
    var blocked = p.resigned || p.stopped || p.eligibility.reason === 'late-onboard';
    var prerequisite = false;

    if (role === 'lm') {
      /* Nộp trễ (chốt 02/10/2026): nhân viên quá hạn chỉ nộp bổ sung một lần; nộp xong là QLTT chấm được ngay.
         Chưa nộp mà còn trong thời gian nộp bổ sung thì QLTT chờ (lateWaiting). Hết mọi lần nhắc mà không nộp:
         đủ mục tiêu thì QLTT vẫn chấm tới hết hạn QLTT (§6, chốt 27/09/2026), thiếu mục tiêu thì `Không đánh giá`
         (p.stopped). Thai sản dùng luồng thêm mục tiêu riêng (§33). */
      prerequisite = submitted || !!p.maternity || !!p.self ||
        (!lateWaiting(p) && p.eligibility.reason !== 'missing-goal');
    } else if (role === 'lm2') {
      prerequisite = submitted || !!p.lm;
    } else {
      prerequisite = submitted || !!p.lm2;
    }

    var key = status(p, 'vi').key;
    var pendingKey = role === 'lm' ? 'wait-lm' : role === 'lm2' ? 'wait-lm2' : 'wait-hod';
    // Trạng thái chờ đúng vai chỉ có trong timeline của vai đó (thai sản, hết các lần nhắc mà đủ mục tiêu đều là wait-lm)
    var pending = key === pendingKey;

    return {
      stepOpen: stepOpen,
      submitted: submitted,
      pending: pending,
      canEdit: !!(stepOpen && !blocked && prerequisite),
      /* Màn chi tiết M-06 (chị chốt 04/10/2026): chỉ QLTT đánh giá và chỉnh sửa trực tiếp ở đây. Quản lý cấp 2 và Trưởng đơn vị
         chỉ vào xem; họ chấm và sửa điểm ở danh sách M-05, nên M-06 không có nút lưu, Chỉnh sửa hay Lịch sử chỉnh sửa cho hai vai này. */
      canEditDetail: !!(stepOpen && !blocked && prerequisite) && role === 'lm'
    };
  }

  /* ── Đang chờ nhân viên nộp bổ sung (chốt 02/10/2026) ──
     Nhân viên quá hạn Tự đánh giá, chưa nộp và còn trong thời gian nộp bổ sung: QLTT chưa chấm được. Trả về lần nhắc
     đang mở để màn Quản lý báo bằng khối vàng; null khi không phải tình huống này. Thai sản không đi luồng nộp trễ (§12). */
  function lateWaiting(p) {
    if (!p || p.self || p.maternity || p.resigned || !p.lateWindowOpen || !p.lateRound) return null;
    return p.lateRound;
  }

  /* ── Mục tiêu dùng để đánh giá cuối năm (E-05 và M-06 cùng đọc, DS §20.1) ──
     Mục tiêu đã duyệt tại thời điểm xem (p.goals, gồm mục tiêu nộp trễ đã duyệt, cờ `late`), trừ mục tiêu đã xóa,
     + mục tiêu QLTT thêm cho nhân viên thai sản (§33, gắn byLm để màn hình phân biệt).
     Đã gửi Tự đánh giá thì chỉ còn mục tiêu duyệt trước ngày gửi: mục tiêu duyệt sau đó không được chấm (§27.1). */
  function reviewGoals(p, type) {
    var deleted = p.deletedGoalIds || [];
    var sentAt = p.self && p.self.at;
    var out = (p.goals || p.emp.goals || []).filter(function (g) {
      if (g.type !== type || g.status !== 'approved' || deleted.indexOf(g.id) >= 0) return false;
      return !(sentAt && g.approvedAt && cmp(g.approvedAt, sentAt) > 0);
    });
    (p.lmGoals || []).map(function (g) { return Object.assign({ byLm: true, status: 'approved' }, g); })
      .filter(function (g) { return g.type === type; })
      .forEach(function (g) { if (!out.some(function (x) { return x.id === g.id; })) out.push(g); });
    return out;
  }

  /* ── Nhân viên trễ hạn Tự đánh giá (§27.1, chốt 07/10/2026) ──
     Quá hạn Tự đánh giá mà chưa gửi trước hạn: còn trong bốn lần nhắc, đã nộp bổ sung, hay đã hết các lần nhắc đều tính.
     Thai sản không đi luồng này (§12). Dùng cho khóa `Thu hồi` mục tiêu và nhãn Mục tiêu nộp trễ ở tab Danh sách mục tiêu. */
  function lateCase(p) {
    if (!p || p.maternity || p.resigned || p.eligibility.reason === 'late-onboard') return false;
    if (stepState('self', p.now) !== 'closed') return false;
    return !p.self || !!p.lateSubmission;
  }
  /* Khóa `Thu hồi` mục tiêu chỉ áp cho nhân viên trễ hạn (chị chốt 07/10/2026). Muốn sửa mục tiêu đã duyệt thì nhờ
     Quản lý trực tiếp bấm `Yêu cầu cập nhật` mục tiêu đó; sửa xong gửi lại là Mục tiêu nộp trễ. */
  function goalRecallLocked(p) { return lateCase(p); }
  // Mục tiêu đang chờ Quản lý trực tiếp duyệt tại thời điểm xem
  function pendingGoals(p) {
    return (p && p.goals || []).filter(function (g) { return g.status === 'pending'; });
  }

  /* QLTT thêm mục tiêu (tải file hoặc nhập tay) cho nhân viên thai sản, dù nhân viên đã có, còn thiếu hay chưa có
     mục tiêu (chốt 30/09/2026). Chỉ trong timeline của QLTT. Mục tiêu nhân viên tự tạo thì QLTT không sửa, không xóa;
     mục tiêu QLTT thêm thì QLTT xóa được trong timeline. */
  function canAddGoals(role, p) {
    return role === 'lm' && !!p && p.maternity && !p.resigned && managerEditWindow('lm', p).state === 'open';
  }

  /* ── Hình thức xử lý của hồ sơ nộp bổ sung với cấp quản lý (§27.3, chốt 30/09/2026) ──
     Hồ sơ nộp ở lần nhắc có hình thức xử lý thì mọi cấp quản lý đều thấy. cap: điểm toàn diện tối đa (lần 3).
     Giới hạn điểm chỉ là thông báo: hệ thống KHÔNG chặn điểm, nhưng cho cao hơn thì người chấm phải xác nhận.
     Câu chữ dùng chung cho M-05 và M-06 (DS §20.2). */
  function lateMeasure(p) {
    if (!p || !p.lateSubmission || !p.lateRound || !p.lateRound.consequence.length) return null;
    var keys = p.lateRound.consequence.slice();
    return { round: p.lateRound.round, keys: keys, cap: keys.indexOf('cap3') >= 0 ? 3 : null };
  }
  function overRatingCap(p, score) {
    var m = lateMeasure(p);
    return !!(m && m.cap != null && score != null && score !== '' && Number(score) > m.cap);
  }
  /* Câu thông báo cho cấp quản lý (chốt 30/09/2026): nói nhân viên trễ bao nhiêu ngày, ở lần nhắc nào, và
     theo quy định nhân viên chịu hình thức gì. Không nhắc chuyện hệ thống có chặn điểm hay không. */
  var MANAGER_MEASURE = {
    cap3: ['nhân viên sẽ bị giới hạn điểm đánh giá toàn diện tối đa là 3.',
           'the overall rating of the employee is capped at 3.'],
    bonus: ['nhân viên sẽ bị cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo, tính từ thời điểm nhắc nhở thứ tư.',
            'part of the bonus of the employee is cut and promotion and salary increase are deferred for the next 6 months, counted from the fourth reminder.']
  };
  function lateMeasureText(p, lang) {
    var m = lateMeasure(p);
    if (!m) return '';
    var days = lateDays(p.lateSubmission.at);
    var en = lang === 'en';
    var body = m.keys.map(function (k) {
      var pair = MANAGER_MEASURE[k];
      return pair ? (en ? pair[1] : pair[0]) : lateText(k, lang);
    }).join(' ');
    // Câu chữ chị chốt 04/10/2026: `Nhân viên hoàn thành Tự đánh giá trễ hạn n ngày làm việc (…), theo quy định, …` (bỏ `vậy`)
    return en
      ? 'The employee completed the self assessment ' + days + ' working day' + (days === 1 ? '' : 's') + ' late (at reminder ' + m.round + '); under policy, ' + body
      : 'Nhân viên hoàn thành Tự đánh giá trễ hạn ' + days + ' ngày làm việc (nộp bổ sung ở lần nhắc thứ ' + m.round + '), theo quy định, ' + body;
  }
  // Bản HTML: in đậm số ngày trễ hạn và từ khóa của hình thức xử lý (chị chốt 04/10/2026)
  function lateMeasureHtml(p, lang) {
    var m = lateMeasure(p);
    if (!m) return '';
    var days = lateDays(p.lateSubmission.at);
    var lateVi = 'trễ hạn ' + days + ' ngày làm việc';
    var lateEn = days + ' working day' + (days === 1 ? '' : 's') + ' late';
    var text = lateMeasureText(p, lang);
    var key = lang === 'en' ? lateEn : lateVi;
    return emphasizeLate(text, lang).split(escHtml(key)).join('<strong>' + escHtml(key) + '</strong>');
  }
  /* Khối vàng trong ô Đánh giá toàn diện (M-06) và popup chấm trên lưới (M-05) chỉ dành cho hồ sơ bị giới hạn điểm
     (nộp ở lần nhắc thứ 3), chốt 02/10/2026. Nộp ở lần 1, 2 (không có hình thức) hay lần 4 (không giới hạn điểm) thì
     không có khối này; hình thức xử lý của lần 4 vẫn nằm ở khối Lưu ý và banner của M-06. */
  function lateCapNotice(p, lang) {
    var m = lateMeasure(p);
    return m && m.cap != null ? lateMeasureText(p, lang) : '';
  }
  function lateCapNoticeHtml(p, lang) {
    var m = lateMeasure(p);
    return m && m.cap != null ? lateMeasureHtml(p, lang) : '';
  }
  function ratingCapText(p, score, lang) {
    var m = lateMeasure(p);
    if (!m || m.cap == null) return { over: '', ack: '' };
    var v = score == null || score === '' ? '' : String(score);
    return lang === 'en' ? {
      over: 'The selected rating is ' + v + ', above the maximum of ' + m.cap + '.',
      ack: 'I confirm keeping ' + v + '.'
    } : {
      over: 'Điểm đang chọn là ' + v + ', cao hơn mức tối đa ' + m.cap + '.',
      // Câu xác nhận ngắn (chị chốt 04/10/2026): bỏ `dù cao hơn mức tối đa … theo quy định`
      ack: 'Tôi xác nhận giữ điểm ' + v + '.'
    };
  }

  /* ── Lịch sử chấm điểm của QLTT, LM2, HOD ───────────────────
     Màn hình ghi thêm một dòng mỗi lần lưu: S.setAct(id, role + 'Log', { items: nextManagerLog(role, p, entry) }).
     source (grid, detail, approve-prev, upload, hrbp-upload) chỉ để truy vết dữ liệu, không hiện trên màn. */
  function nextManagerLog(role, p, entry) {
    return ((role === 'lm' ? p.lmLog : role === 'lm2' ? p.lm2Log : p.hodLog) || []).concat([entry]);
  }
  /* ── Điểm hiệu chuẩn HRBP tải lên hộ HOD (§9) ──────────────
     Điểm tải lên chưa duyệt không phải điểm HOD và không hiện ở lưới chính; HOD duyệt ở màn
     `Phê duyệt điểm hiệu chuẩn`, không sửa điểm trước khi duyệt. Duyệt được trong timeline HOD và khi
     HOD chấm được hồ sơ (managerReviewState). conflict: HOD đã chấm tay một điểm khác điểm tải lên. */
  function calibrationState(p) {
    var up = p && p.hrbpUpload;
    if (!up) return { has: false, approved: false, canApprove: false, conflict: false };
    var approved = !!up.approved;
    var manual = p.hod && p.hod.source !== 'hrbp-upload' ? p.hod.score : null;
    return {
      has: true, score: up.score, comment: up.comment || '', by: up.by || '', at: up.at,
      approved: approved, approvedAt: up.approvedAt || null,
      canApprove: !approved && managerReviewState('hod', p).canEdit,
      manual: manual,
      conflict: !approved && manual != null && Number(manual) !== Number(up.score)
    };
  }

  /* ── Cửa sổ đánh giá và chỉnh sửa của từng vai quản lý (§8.3) ──
     Một nguồn cho cả quyền sửa (managerReviewState) lẫn câu chữ "sửa được tới khi nào" ở M-05, M-06.
     state:  'future' chưa tới bước của vai, 'open' đang sửa được, 'closed' đã hết hạn. */
  function managerEditWindow(role, p) {
    var s = step(role);
    var now = (p && p.now) || today();
    var state = cmp(now, s.from) < 0 ? 'future'
      : cmp(now, s.to) > 0 ? 'closed' : 'open';
    return { from: s.from, to: s.to, state: state };
  }

  /* ── Thứ tự danh sách và màu trạng thái của Quản lý (§47, chốt lại 02/10/2026) ──
     Giai đoạn của kỳ tính theo ngày, giống nhau cho mọi người: 'self' trước ngày mở bước QLTT, rồi 'lm', 'lm2', 'hod'
     (bước quản lý mở gần nhất; qua hết bước HOD vẫn là 'hod'). */
  function managerStage(now) {
    if (stepState('lm', now) === 'future') return 'self';
    return ['hod', 'lm2', 'lm'].filter(function (k) { return stepState(k, now) !== 'future'; })[0];
  }
  function roleDone(role, p) {
    return !!(role === 'lm' ? p.lm : role === 'lm2' ? p.lm2 : p.hod);
  }
  /* Vai đang xem có việc phải làm ngay với hồ sơ này: hồ sơ đang chờ đúng vai, vai còn trong timeline, chưa gửi.
     Danh sách dùng cho cả thứ tự (nhóm đầu) lẫn màu hồng của trạng thái, để hai thứ không nói khác nhau. */
  function managerActionable(role, p) {
    var r = managerReviewState(role, p);
    return !!(r.pending && r.canEdit && !r.submitted);
  }
  /* Thứ tự trong nhóm đang chờ một vai:
       QLTT:          thai sản, nộp bổ sung, bình thường, có LWD
       LM2, HOD:      nộp bổ sung, bình thường, thai sản, có LWD */
  function pendingOrder(role, p) {
    if (role === 'lm') {
      if (p.maternity) return 0;
      if (p.lateSubmission) return 1;
      return p.resignFrom ? 3 : 2;
    }
    if (p.lateSubmission) return 0;
    if (p.maternity) return 2;
    return p.resignFrom ? 3 : 1;
  }
  /* Giai đoạn Tự đánh giá (trước ngày mở bước QLTT), mọi vai, giữ như chốt 30/09/2026:
       0 chưa tự đánh giá, 1 đã tự đánh giá, 2 thai sản, 5 có LWD, 6 `Không đánh giá`.
     Từ bước QLTT trở đi (chốt 02/10/2026), số = nhóm * 10 + thứ tự trong nhóm (pendingOrder):
       0x  việc của vai đang xem, làm được ngay (gồm hồ sơ nộp bổ sung QLTT còn hạn riêng khi kỳ đã sang bước sau)
       1x  hồ sơ đang chờ vai của giai đoạn hiện tại mà vai đang xem không làm được (vd LM2 xem lúc kỳ đang ở bước
           QLTT, hay QLTT xem lúc kỳ đã sang bước LM2): vẫn xếp theo thứ tự của giai đoạn đó
       20  chưa tới lượt ai làm: `Chưa tự đánh giá` trong cửa sổ nộp bổ sung, chờ cấp trước
       30  vai của giai đoạn hoặc vai đang xem đã đánh giá xong, hoặc đã công bố kết quả
       40  `Không đánh giá`: thiếu mục tiêu, không nộp bổ sung, hệ thống chặn mọi bước sau
     Trong từng nhóm, màn hình giữ thứ tự dữ liệu ban đầu. */
  function managerRosterRank(role, p) {
    var stage = managerStage(p.now);
    if (stage === 'self') {
      if (p.stopped) return 6;
      if (p.resignFrom) return 5;
      if (p.maternity) return 2;
      return p.self ? 1 : 0;
    }
    if (p.stopped) return 40;
    if (managerActionable(role, p)) return pendingOrder(role, p);
    if (p.published || roleDone(stage, p)) return 30;
    if (managerReviewState(stage, p).pending) return 10 + pendingOrder(stage, p);
    return roleDone(role, p) ? 30 : 20;
  }
  /* Màu trạng thái trên danh sách (chốt 02/10/2026): hồng khi hồ sơ đang chờ đúng vai đang xem và vai đó làm được ngay
     (managerActionable), và `Chưa tự đánh giá` trong giai đoạn Tự đánh giá. Người vừa là QLTT vừa là LM2 xem từng vai ở
     Direct reports / Indirect reports nên mỗi vai thấy hồng đúng việc của vai đó. Đã công bố là xanh, còn lại xám. */
  function managerStatusTone(role, p) {
    if (p.published) return 'completed';
    if (managerActionable(role, p)) return 'incomplete';
    var key = status(p, 'vi').key;
    if ((key === 'need-self' || key === 'late-self') && managerStage(p.now) === 'self' && !managerReviewState(role, p).submitted) {
      return 'incomplete';
    }
    return 'pending';
  }

  /* ── Nhãn trên hai tab đánh giá, dùng chung cho E-05, M-05, M-06 (§18.4, chốt 30/09/2026) ──
     Nhãn nói GIAI ĐOẠN của kỳ, giống nhau cho mọi người và mọi vai tại cùng một ngày; việc riêng của
     từng hồ sơ nằm trong nội dung tab. past = true thì nhãn xám (`.yer-past-cycle-label`), false thì xanh.
     cycle: 'yer' | 'myr'. empId: hồ sơ đang mở, để biết tab Giữa năm có phải dữ liệu lịch sử của use case
     demo hay không (MYR-SPEC §2a); danh sách không truyền empId. */
  var PHASE_LABEL = {
    'not-open': ['Chưa mở', 'Not open yet'],
    'active':   ['Cần hoàn tất', 'To complete'],
    'done':     ['Đã hoàn tất', 'Completed']
  };
  function cycleTabLabel(cycle, now, lang, empId) {
    now = now || today();
    function t(pair) { return lang === 'en' ? pair[1] : pair[0]; }
    if (cycle === 'yer') {
      var phase = yerPhase(now);
      return { text: t(PHASE_LABEL[phase]), past: phase !== 'active' };
    }
    /* Chốt lại 04/10/2026: nhãn tab Giữa năm chỉ theo ngày. Kỳ cuối năm đã mở thì kỳ giữa năm luôn `Đã hoàn tất` màu xám,
       mọi người, mọi vai, có hay không có use case trên thanh demo; trước đó là `Đang hoạt động`. */
    if (cmp(now, step('self').from) < 0) return { text: t(['Đang hoạt động', 'Active']), past: false };
    return { text: t(PHASE_LABEL.done), past: true };
  }

  /* ── Quyền của Nhân viên với bản tự đánh giá (§5, §8) ────
     mode: 'draft'     chưa gửi, còn hạn: nhập và lưu nháp được
           'submitted' đã gửi, còn hạn: mở lại để chỉnh sửa được
           'editing'   đã gửi rồi mở lại, còn hạn: bản đã gửi vẫn giữ tới khi gửi lại
           'locked'    đã gửi, hết hạn (gồm bản nộp bổ sung, chỉ gửi một lần): chỉ xem
           'late'      chưa gửi, quá hạn và còn trong bốn lần nhắc: nhập, lưu nháp, gửi một lần ngay trên màn (§27.1)
           'closed'    chưa gửi, hết hạn và hết các lần nhắc
           'none'      không thuộc kỳ hoặc đã nghỉ việc
     Thiếu mục tiêu vẫn nhập và lưu nháp được, chỉ không gửi được (submitBlock). */
  function selfAssessmentState(p) {
    var deadline = step('self').to;
    function out(mode, canEdit, canSubmit, canReopen, block) {
      return { mode: mode, canEdit: canEdit, canSubmit: canSubmit, canReopen: canReopen,
        submitBlock: block || null, deadline: deadline };
    }
    if (!p || p.resigned || p.eligibility.reason === 'late-onboard') return out('none', false, false, false);
    var open = stepState('self', p.now) === 'open';
    var block = p.eligibility.reason === 'missing-goal' ? 'missing-goal' : null;
    if (p.self) {
      if (p.selfEditing) return out('editing', true, !block, false, block);
      // Bản nộp bổ sung gửi sau hạn nên không bao giờ mở lại được: chỉ gửi một lần (§27.1)
      return out(open ? 'submitted' : 'locked', false, false, open);
    }
    /* Quá hạn, còn trong bốn lần nhắc (§27.1, chốt 07/10/2026): nhân viên làm Tự đánh giá ngay trên màn, không có bước xác nhận
       đã đọc. Thiếu mục tiêu đã duyệt thì vẫn lưu nháp, không gửi được. Thai sản không vào. */
    if (!open && p.lateWindowOpen && !p.maternity && p.lateRound) {
      return out('late', true, !block, false, block);
    }
    if (!open) return out('closed', false, false, false);
    return out('draft', true, !block, false, block);
  }

  /* Khác nhau giữa hai bản tự đánh giá, để ghi lịch sử chỉnh sửa. Màn hình tự dựng câu chữ. */
  /* goalTypes (tùy chọn): { goalId: 'what' | 'dev' }. Có thì đếm thêm số mục tiêu sửa điểm theo
     từng nhóm (goalScoresByType), để lịch sử ghi rõ sửa mục tiêu công việc hay phát triển (§8.2). */
  function selfChanges(before, after, goalTypes) {
    before = before || {}; after = after || {};
    var bo = before.overall || {}, ao = after.overall || {};
    var res = { overall: null, overallComment: false, goalScores: 0, goalScoresByType: { what: 0, dev: 0 }, howScores: 0, comments: [] };
    if (bo.score !== ao.score) res.overall = [bo.score == null ? null : bo.score, ao.score == null ? null : ao.score];
    res.overallComment = String(bo.comment || '').trim() !== String(ao.comment || '').trim();
    var bg = before.goalScores || {}, ag = after.goalScores || {}, seen = {};
    Object.keys(bg).concat(Object.keys(ag)).forEach(function (id) {
      if (seen[id]) return; seen[id] = true;
      if (bg[id] === ag[id]) return;
      res.goalScores++;
      var t = goalTypes && goalTypes[id];
      if (t === 'what' || t === 'dev') res.goalScoresByType[t]++;
    });
    var bh = before.howScores || [], ah = after.howScores || [];
    for (var i = 0; i < Math.max(bh.length, ah.length); i++) if (bh[i] !== ah[i]) res.howScores++;
    ['what', 'dev', 'how'].forEach(function (t) {
      if (String((before.comments || {})[t] || '').trim() !== String((after.comments || {})[t] || '').trim()) res.comments.push(t);
    });
    return res;
  }

  /* ── Giai đoạn của kỳ cuối năm, dùng cho nhãn tab của Nhân viên (§18.4) ──
     Nhãn tab nói kỳ đang ở giai đoạn nào, không đổi theo trạng thái của từng người. */
  function yerPhase(now) {
    now = now || today();
    if (cmp(now, step('self').from) < 0) return 'not-open';
    if (cmp(now, step('publish').from) >= 0) return 'done';
    return 'active';
  }

  /* Mục tiêu nhân viên còn phải thiết lập, cho nhãn tab Mục tiêu. Quá hạn Tự đánh giá thì nhân viên vẫn bổ sung mục tiêu ở
     tab Danh sách mục tiêu tới hết bốn lần nhắc (§27.1, chốt 07/10/2026); hết các lần nhắc thì không còn việc để làm. */
  function goalAction(p) {
    if (!p || p.eligibility.reason !== 'missing-goal' || p.self) return null;
    if (stepState('self', p.now) === 'closed' && !(p.lateWindowOpen && !p.maternity)) return null;
    // Loại mục tiêu đã gửi và đang chờ duyệt thì nhân viên đã làm phần của mình, không nhắc thiết lập nữa
    var sent = {};
    pendingGoals(p).forEach(function (g) { sent[g.type] = true; });
    var need = { what: !!p.eligibility.missingWhat && !sent.what, dev: !!p.eligibility.missingDev && !sent.dev };
    return need.what || need.dev ? need : null;
  }

  /* ── Quyền xem điểm theo vai trò ────────────────────────── */
  // level: 'self' | 'lmGoals' | 'lmOverall' | 'lm2' | 'hod' | 'final'
  function canSee(role, level, p) {
    if (role === 'nv') {
      if (level === 'lmOverall' || level === 'lm2' || level === 'hod') return false;
      if (level === 'final') return !!(p && p.published);
      return true;
    }
    if (role === 'tr' || role === 'hrd') {
      return level === 'lmOverall' || level === 'lm2' || level === 'hod' || level === 'final';
    }
    return true; // lm, lm2, hod, hrbp, lod
  }

  function scaleItem(v) {
    var base = Math.floor(v);
    return (window.PMS_RATING_SCALE || []).filter(function (s) { return s.v === base; })[0] || null;
  }
  function scoreLabel(v, lang) {
    if (v == null) return '';
    var isHalf = Math.abs(v % 1) > 0;
    var lo = scaleItem(Math.floor(v)), hi = scaleItem(Math.floor(v) + 1);
    if (!isHalf) return lo ? (lang === 'en' ? lo.en : lo.vi) : '';
    if (!lo || !hi) return '';
    // File đề xuất ghi rõ: 1.5 = giữa mức 1 - Không đạt yêu cầu và 2 - Hoàn thành một phần.
    // Gọi đủ tên hai mức chính chứ không rút gọn còn con số.
    return lang === 'en'
      ? 'Between ' + lo.v + ' - ' + lo.en + ' and ' + hi.v + ' - ' + hi.en
      : 'Giữa mức ' + lo.v + ' - ' + lo.vi + ' và ' + hi.v + ' - ' + hi.vi;
  }
  function scoreDefinition(v, lang) {
    if (v == null) return '';
    var isHalf = Math.abs(v % 1) > 0;
    var lo = scaleItem(Math.floor(v)), hi = scaleItem(Math.floor(v) + 1);
    if (!isHalf) return lo ? (lang === 'en' ? lo.den : lo.dvi) : '';
    if (!lo || !hi) return '';
    // Nguyên văn ví dụ trong file đề xuất cho mức 3.5, áp cho mọi mức lẻ.
    return lang === 'en'
      ? 'The employee performance exceeds the criteria of level ' + lo.v + ' - ' + lo.en +
        ' and does not yet fully meet the criteria required for level ' + hi.v + ' - ' + hi.en + '.'
      : 'Hiệu quả công việc của nhân viên đã vượt trên các tiêu chí của mức ' + lo.v + ' - ' + lo.vi +
        ' và chưa đạt trọn vẹn các tiêu chí cần thiết của mức ' + hi.v + ' - ' + hi.vi + '.';
  }

  /* Tách định nghĩa mức điểm thành hai đoạn cho dễ đọc: đoạn đầu nói về kỳ vọng
     hiệu quả công việc, đoạn sau nói về Giá trị cốt lõi. Mức 1 không nhắc tới giá trị
     cốt lõi nên chỉ có một đoạn. */
  function splitDefinition(text, lang) {
    var marker = lang === 'en' ? /core values?/i : /gi\u00e1 tr\u1ecb c\u1ed1t l\u00f5i/i;
    var parts = String(text || '').split(/(?<=\.)\s+/);
    var at = -1;
    parts.forEach(function (sentence, k) { if (at < 0 && marker.test(sentence)) at = k; });
    if (at < 0) return [String(text || '')];
    var head = parts.slice(0, at).join(' ').trim();
    var tail = parts.slice(at).join(' ').trim();
    return head ? [head, tail] : [tail];
  }

  function escHtml(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  // Bản HTML của định nghĩa: in đậm phần tham chiếu tới mức điểm
  function scoreDefinitionHtml(v, lang) {
    if (v == null) return '';
    var isHalf = Math.abs(v % 1) > 0;
    if (!isHalf) {
      return splitDefinition(scoreDefinition(v, lang), lang)
        .map(function (para) { return '<p>' + escHtml(para) + '</p>'; }).join('');
    }
    var lo = scaleItem(Math.floor(v)), hi = scaleItem(Math.floor(v) + 1);
    if (!lo || !hi) return '';
    function ref(item) {
      // chữ "mức" / "level" để thường, chỉ in đậm số điểm và tên mức
      return (lang === 'en' ? 'level ' : 'mức ') + '<strong>' + item.v + ' - ' +
        escHtml(lang === 'en' ? item.en : item.vi) + '</strong>';
    }
    return lang === 'en'
      ? 'The employee performance exceeds the criteria of ' + ref(lo) +
        ' and does not yet fully meet the criteria required for ' + ref(hi) + '.'
      : 'Hiệu quả công việc của nhân viên đã vượt trên các tiêu chí của ' + ref(lo) +
        ' và chưa đạt trọn vẹn các tiêu chí cần thiết của ' + ref(hi) + '.';
  }

  /* ── Danh sách theo vai trò ─────────────────────────────── */
  function roster(role, opts) {
    opts = opts || {};
    var now = opts.now || today();
    var out = (window.PMS_EMPLOYEES || []).map(function (e) { return profile(e.id, now); }).filter(Boolean);
    out = out.filter(function (p) { return p.eligibility.reason !== 'late-onboard'; });
    if (!opts.showResigned) out = out.filter(function (p) { return !p.resigned; });
    // Cùng phạm vi đã dùng ở danh sách Mid-Year: mỗi vai chỉ nhận roster thuộc
    // reporting scope của chính họ; màn hình không tải toàn công ty rồi mới giả lập lọc.
    var scopeLevel = role === 'lm' ? 'lm1' : role === 'lm2' ? 'lm2' : role === 'hod' ? 'hod' : null;
    if (scopeLevel) out = out.filter(function (p) { return p.emp.lvl === scopeLevel; });
    return out;
  }

  function completion(list) {
    // ENH-E01 (YER-SPEC §30): NV đã có ngày nghỉ việc KHÔNG tính vào mẫu số, kể cả
    // khi chưa tới ngày hiệu lực — vì hệ thống cũng không nhắc Quản lý về nhóm này.
    // "Không đánh giá" thì vẫn nằm ở mẫu số (§5).
    var pool = list.filter(function (p) { return !p.resigned && !p.resignFrom; });
    var done = pool.filter(function (p) { return !!p.lm; }).length;
    return { done: done, total: pool.length, pct: pool.length ? Math.round(done * 100 / pool.length) : 0 };
  }

  /* ── Người thực hiện từng bước của một hồ sơ ──
     Màn hình không tự ghép tên người, để ba màn không nói hai chuyện khác nhau.
     Bước `publish` không có người thực hiện hiển thị (trả về null). */
  function actors(p) {
    var D = window.PMS_YER_ACTORS || {};
    if (!p) return {};
    return {
      self: { name: p.emp.name, login: p.emp.login, ini: p.emp.ini },
      lm: p.emp.mgr || D.lm || null,
      lm2: p.emp.mgr2 || D.lm2 || null,
      hod: D.hod || null,
      tr: D.tr || null,
      hrd: D.hrd || null,
      publish: null
    };
  }

  /* MYR-SPEC §2a: màn MYR và màn YER dựng ở hai thời điểm khác nhau.
     Tab Giữa năm chỉ hiển thị như dữ liệu lịch sử của kỳ cuối năm khi người xem
     đang ở đúng một use case chọn từ thanh Chế độ demo, và use case đó là của
     chính nhân viên đang mở. Còn lại tab Giữa năm hiển thị bình thường, độc lập.
     Use case lấy từ ?scenario= trên URL (deep link) hoặc từ phiên (thanh demo ghi). */
  function demoScenario() {
    var id = null;
    try { id = new URLSearchParams(window.location.search).get('scenario'); } catch (e) {}
    var s = window.PMSStore && window.PMSStore.session();
    if (!id && s) id = s.scenario || null;
    if (!id) return null;
    return (window.PMS_YER_SCENARIOS || []).filter(function (x) { return x.id === id; })[0] || null;
  }
  function myrAsHistory(empId) {
    var sc = demoScenario();
    if (!sc) return false;
    return !empId || sc.emp === empId;
  }

  window.PMSYer = {
    TL: TL,
    demoScenario: demoScenario,
    myrAsHistory: myrAsHistory,
    actors: actors,
    today: today,
    fmt: fmt,
    addDays: addDays,
    cmp: cmp,
    step: step,
    stepState: stepState,
    stepDueText: stepDueText,
    lateSubmissionDeadline: lateSubmissionDeadline,
    lateDays: lateDays,
    lateRounds: lateRounds,
    lmDeadline: lmDeadline,
    lateWindowFitsLm: lateWindowFitsLm,
    lateRound: lateRound,
    lateText: lateText,
    lateTextHtml: lateTextHtml,
    isWorkingDay: isWorkingDay,
    addWorkingDays: addWorkingDays,
    workingDaysBetween: workingDaysBetween,
    lateWindowOpen: lateWindowOpen,
    currentStep: currentStep,
    profile: profile,
    status: status,
    cyclePhase: cyclePhase,
    managerReviewState: managerReviewState,
    cycleTabLabel: cycleTabLabel,
    managerEditWindow: managerEditWindow,
    calibrationState: calibrationState,
    nextManagerLog: nextManagerLog,
    lateMeasure: lateMeasure,
    reviewGoals: reviewGoals,
    goalsAt: goalsAt,
    lateCase: lateCase,
    goalRecallLocked: goalRecallLocked,
    pendingGoals: pendingGoals,
    canAddGoals: canAddGoals,
    overRatingCap: overRatingCap,
    lateMeasureText: lateMeasureText,
    lateMeasureHtml: lateMeasureHtml,
    lateCapNotice: lateCapNotice,
    lateCapNoticeHtml: lateCapNoticeHtml,
    lateWaiting: lateWaiting,
    ratingCapText: ratingCapText,
    managerRosterRank: managerRosterRank,
    managerStage: managerStage,
    managerActionable: managerActionable,
    managerStatusTone: managerStatusTone,
    selfAssessmentState: selfAssessmentState,
    selfChanges: selfChanges,
    yerPhase: yerPhase,
    goalAction: goalAction,
    canSee: canSee,
    roster: roster,
    completion: completion,
    scoreLabel: scoreLabel,
    scoreDefinition: scoreDefinition,
    scoreDefinitionHtml: scoreDefinitionHtml,
    splitDefinition: splitDefinition,
    scaleItem: scaleItem,
    DEFAULT_DATE: DEFAULT_DATE
  };
})();
