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
  function lateSubmissionDeadline() {
    var all = lateRounds();
    return all[all.length - 1].deadline;
  }
  // Số ngày trễ tính theo ngày làm việc, không tính thứ 7, chủ nhật và ngày lễ
  function lateDays(submittedAt) {
    if (!submittedAt) return 0;
    return workingDaysBetween(step('self').to, submittedAt);
  }
  /* Hạn chấm của QLTT (§27.3, chốt 28/09/2026). Hồ sơ nộp bổ sung có thêm 3 ngày làm việc kể từ
     ngày nhân viên nộp, nếu mốc đó muộn hơn hạn chung của bước QLTT. Hồ sơ khác dùng hạn chung. */
  function lmDeadline(late) {
    var due = step('lm').to;
    if (late && late.at) {
      var extra = addWorkingDays(late.at, 3);
      if (cmp(extra, due) > 0) due = extra;
    }
    return due;
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
  /* lmGoals: mục tiêu QLTT thêm cho nhân viên thai sản (§33), tự `Đã duyệt` nên tính như mục tiêu đã duyệt */
  function eligibility(emp, hr, seed, acts, lmGoals) {
    if (!emp) return { eligible: false, reason: 'not-found' };
    var hired = hr && hr.hired;
    if (hired && cmp(hired, TL.onboardCutoff) >= 0) {
      return { eligible: false, reason: 'late-onboard', hidden: true };
    }
    var goals = (emp.goals || []).filter(function (g) { return g.status === 'approved'; }).concat(lmGoals || []);
    var imported = (acts && acts.importedGoals) || (seed && seed.importedGoals);
    var importedList = imported && imported.goals;
    // Dữ liệu cũ dùng boolean cho luồng thai sản. File nộp trễ mới lưu rõ
    // từng goal để cả màn NV và LM có thể đọc lại đúng nội dung đã import.
    var importCoversAll = imported === true;
    var hasWhat = goals.some(function (g) { return g.type === 'what'; }) || importCoversAll ||
      !!(importedList && importedList.some(function (g) { return g.type === 'what'; }));
    var hasDev = goals.some(function (g) { return g.type === 'dev'; }) || importCoversAll ||
      !!(importedList && importedList.some(function (g) { return g.type === 'dev'; }));
    if (!hasWhat || !hasDev) {
      return { eligible: false, reason: 'missing-goal', missingWhat: !hasWhat, missingDev: !hasDev };
    }
    return { eligible: true };
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
    var lateSubmission = merge(seed.lateSubmission, acts.lateSubmission);

    // Sự kiện chỉ được coi là đã xảy ra nếu ngày hệ thống đã qua thời điểm đó
    function happened(block) { return block && block.at && cmp(now, block.at) >= 0; }

    // Mục tiêu QLTT thêm cho nhân viên thai sản (§33): { id, type, title, result, prio, s, e, at, time, via, by }
    var lmGoals = ((acts.lmGoals || {}).items || []).filter(function (g) { return g && g.at && cmp(now, g.at) >= 0; });
    var elig = eligibility(emp, hr, seed, acts, lmGoals);
    var cycleOpen = step('self').from;
    var maternity = !!(hr.maternityFrom && cmp(cycleOpen, hr.maternityFrom) >= 0 &&
      (!hr.maternityTo || cmp(cycleOpen, hr.maternityTo) < 0)) || !!emp.maternity;

    var resignFrom = hr.resignFrom || emp.resignFrom || null;
    var resigned = !!(emp.resigned || (resignFrom && cmp(now, resignFrom) >= 0));

    var selfDone = happened(self);
    var lmDone = happened(lm);
    var lm2Done = happened(lm2);
    var hodDone = happened(hod);

    // Hồ sơ nộp bổ sung có hạn chấm riêng của QLTT (§27.3), nên đồng bộ theo hạn đó
    var lmDue = lmDeadline(happened(lateSubmission) ? lateSubmission : null);
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

    /* Lịch sử chấm điểm và nhận xét của LM2, HOD (chốt 30/09/2026): mỗi lần lưu là một dòng
       { at, time, score, comment, source }. Dữ liệu mẫu chưa có lịch sử thì suy ra một dòng từ bản đang có;
       điểm hệ thống tự chép không phải lần chấm của vai nên không vào lịch sử. */
    function managerLog(key, view) {
      var items = ((acts[key + 'Log'] || {}).items || []).filter(function (it) { return it && it.at && cmp(now, it.at) >= 0; });
      if (!items.length && view && !view.synced && view.at) {
        items = [{ at: view.at, time: view.time || null, score: view.score, comment: view.comment || '', source: view.source || 'manual' }];
      }
      return items;
    }

    var lateView = happened(lateSubmission) ? lateSubmission : null;
    var lateOpen = lateWindowOpen(now);
    var lateClosed = cmp(now, lateSubmissionDeadline()) > 0;
    // Thiếu goal sau hạn Self chưa đồng nghĩa với dừng hồ sơ: NV còn một luồng riêng
    // để import goal + self assessment tới hạn nộp bổ sung (hạn QLTT trừ 3 ngày).
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
      log = [{ type: self.source === 'file-import' ? 'late-file' : 'submit', at: self.at, time: self.time || null,
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

  /* ── Trạng thái hiển thị trong danh sách ────────────────── */
  function status(p, lang) {
    lang = lang || 'vi';
    function t(vi, en) { return lang === 'en' ? en : vi; }
    if (!p) return { key: 'none', label: '', tone: 'muted' };
    if (p.eligibility.reason === 'late-onboard') return { key: 'out', label: t('Ngoài kỳ đánh giá', 'Out of cycle'), tone: 'muted' };
    if (p.resigned) return { key: 'resigned', label: t('Đã nghỉ việc', 'Resigned'), tone: 'muted' };
    // Thai sản không bắt buộc tự đánh giá (§12) nên không rơi vào luồng nộp trễ.
    if (!p.self && p.lateWindowOpen && !p.maternity) return { key: 'late-upload', label: t('Cần nộp file trễ hạn', 'Late file submission needed'), tone: 'action' };
    if (p.stopped) return { key: 'noeval', label: t('Không đánh giá', 'Not evaluated'), tone: 'muted' };
    if (p.published) return { key: 'published', label: t('Đã công bố kết quả', 'Results published'), tone: 'done' };
    if (p.hod) return { key: 'wait-tr', label: t('Chờ tải điểm cuối cùng', 'Awaiting final upload'), tone: 'muted' };
    if (p.lm2) return { key: 'wait-hod', label: t('Chờ HOD đánh giá', 'Awaiting HOD'), tone: 'action' };
    if (p.lm) return { key: 'wait-lm2', label: t('Chờ Quản lý cấp 2', 'Awaiting second-level manager'), tone: 'action' };
    if (p.self) return { key: 'wait-lm', label: p.lateSubmission
      ? t('Nộp trễ hạn - Chờ Quản lý', 'Submitted late - Awaiting manager')
      : t('Chờ Quản lý trực tiếp', 'Awaiting line manager'), tone: 'action' };
    if (p.maternity) return { key: 'maternity', label: t('Nghỉ thai sản - không yêu cầu tự đánh giá', 'Maternity leave - self assessment not required'), tone: 'muted' };
    if (stepState('self', p.now) === 'open') return { key: 'need-self', label: t('Cần tự đánh giá', 'Self assessment needed'), tone: 'action' };
    if (stepState('self', p.now) === 'future') return { key: 'not-open', label: t('Chưa mở', 'Not open yet'), tone: 'muted' };
    return { key: 'no-self', label: t('Không tự đánh giá', 'No self assessment'), tone: 'muted' };
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
      // Hồ sơ đủ goal vẫn được QLTT đánh giá khi NV bỏ Self Assessment. Nếu thiếu
      // goal thì chỉ mở sau khi có file nộp trễ; thai sản dùng luồng import riêng.
      prerequisite = submitted || p.eligibility.reason !== 'missing-goal' ||
        !!p.lateSubmission || !!p.maternity;
    } else if (role === 'lm2') {
      prerequisite = submitted || !!p.lm;
    } else {
      prerequisite = submitted || !!p.lm2;
    }

    var key = status(p, 'vi').key;
    var pendingKey = role === 'lm' ? 'wait-lm' : role === 'lm2' ? 'wait-lm2' : 'wait-hod';
    // Thai sản không cần Self Assessment nhưng chuyển thành việc của QLTT khi
    // timeline QLTT bắt đầu.
    var pending = key === pendingKey ||
      (role === 'lm' && key === 'maternity' && stepState('lm', p.now) !== 'future');

    return {
      stepOpen: stepOpen,
      submitted: submitted,
      pending: pending,
      canEdit: !!(stepOpen && !blocked && prerequisite)
    };
  }

  /* ── Mục tiêu dùng để đánh giá cuối năm (E-05 và M-06 cùng đọc, DS §20.1) ──
     Mục tiêu đã duyệt của nhân viên (trừ mục tiêu đã xóa) + mục tiêu trong file nộp bổ sung (§27.1)
     + mục tiêu QLTT thêm cho nhân viên thai sản (§33, gắn byLm để màn hình phân biệt). */
  function reviewGoals(p, type) {
    var deleted = p.deletedGoalIds || [];
    var out = (p.emp.goals || []).filter(function (g) {
      return g.type === type && g.status === 'approved' && deleted.indexOf(g.id) < 0;
    });
    var imported = (p.lateSubmission && p.lateSubmission.goals) || [];
    imported.concat((p.lmGoals || []).map(function (g) { return Object.assign({ byLm: true, status: 'approved' }, g); }))
      .filter(function (g) { return g.type === type; })
      .forEach(function (g) { if (!out.some(function (x) { return x.id === g.id; })) out.push(g); });
    return out;
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
    return en
      ? 'The employee completed the self assessment ' + days + ' working day' + (days === 1 ? '' : 's') + ' late (at reminder ' + m.round + '), so under policy ' + body
      : 'Nhân viên hoàn thành trễ Tự đánh giá ' + days + ' ngày làm việc (nộp bổ sung ở lần nhắc thứ ' + m.round + '), vậy theo quy định, ' + body;
  }
  function ratingCapText(p, score, lang) {
    var m = lateMeasure(p);
    if (!m || m.cap == null) return { over: '', ack: '' };
    var v = score == null || score === '' ? '' : String(score);
    return lang === 'en' ? {
      over: 'You are rating ' + v + ', above the maximum of ' + m.cap + '.',
      ack: 'I confirm keeping ' + v + ' although it is above the maximum of ' + m.cap + ' under policy.'
    } : {
      over: 'Bạn đang cho ' + v + ', cao hơn mức tối đa ' + m.cap + '.',
      ack: 'Tôi xác nhận giữ điểm ' + v + ' dù cao hơn mức tối đa ' + m.cap + ' theo quy định.'
    };
  }

  /* ── Lịch sử chấm điểm của LM2, HOD ─────────────────────────
     Màn hình ghi thêm một dòng mỗi lần lưu: S.setAct(id, role + 'Log', { items: nextManagerLog(role, p, entry) }).
     source (grid, detail, approve-prev, upload, hrbp-upload) chỉ để truy vết dữ liệu, không hiện trên màn. */
  function nextManagerLog(role, p, entry) {
    return ((role === 'lm2' ? p.lm2Log : p.hodLog) || []).concat([entry]);
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
     reason: 'late'     hồ sơ nộp bổ sung, QLTT có hạn riêng 3 ngày làm việc từ ngày nộp (§27.3)
     state:  'future' chưa tới bước của vai, 'open' đang sửa được, 'closed' đã hết hạn. */
  function managerEditWindow(role, p) {
    var s = step(role);
    var to = s.to, reason = null;
    if (role === 'lm' && p && p.lateSubmission && cmp(p.lmDeadline, s.to) > 0) { to = p.lmDeadline; reason = 'late'; }
    var now = (p && p.now) || today();
    var state = cmp(now, s.from) < 0 ? 'future'
      : cmp(now, to) > 0 ? 'closed' : 'open';
    return { from: s.from, to: to, reason: reason, state: state };
  }

  /* ── Thứ tự danh sách của Quản lý (§47, chốt lại 30/09/2026) ──
     Việc cần làm lên đầu, việc đã xong xuống dưới, hồ sơ có LWD rồi hồ sơ `Không đánh giá` ở cuối cùng.
     Giai đoạn Tự đánh giá (trước ngày mở bước QLTT), mọi vai:
       0  nhân viên chưa tự đánh giá
       1  nhân viên đã tự đánh giá
       2  nhân viên thai sản (không bắt buộc tự đánh giá)
     Từ bước QLTT trở đi, theo vai đang xem:
       0  thai sản đang chờ QLTT (QLTT phải kiểm tra, tải mục tiêu cho nhân viên)
       1  nộp bổ sung đang chờ QLTT
       2  các hồ sơ khác đang chờ đúng vai đang xem, trong timeline của vai đó
       3  hồ sơ vai đang xem chưa làm được: chờ cấp khác, chưa tự đánh giá, chưa tới timeline
       4  vai đang xem đã đánh giá xong, hoặc đã công bố kết quả
     Mọi giai đoạn: 5 hồ sơ có ngày làm việc cuối cùng (LWD), 6 hồ sơ `Không đánh giá`.
     Trong từng nhóm, màn hình giữ thứ tự dữ liệu ban đầu. */
  function managerRosterRank(role, p) {
    if (p.stopped) return 6;
    if (p.resignFrom) return 5;
    if (stepState('lm', p.now) === 'future') {
      if (p.maternity) return 2;
      return p.self ? 1 : 0;
    }
    var review = managerReviewState(role, p);
    if (review.pending && review.stepOpen && !review.submitted) {
      if (role === 'lm' && p.maternity) return 0;
      if (role === 'lm' && p.lateSubmission) return 1;
      return 2;
    }
    if (review.submitted || p.published) return 4;
    return 3;
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
    if (!myrAsHistory(empId)) return { text: t(['Đang hoạt động', 'Active']), past: false };
    // Kỳ cuối năm đã mở thì kỳ giữa năm luôn Đã hoàn tất, kể cả người không có kết quả
    return { text: t(PHASE_LABEL.done), past: cmp(now, step('self').from) >= 0 };
  }

  /* ── Quyền của Nhân viên với bản tự đánh giá (§5, §8) ────
     mode: 'draft'     chưa gửi, còn hạn: nhập và lưu nháp được
           'submitted' đã gửi, còn hạn: mở lại để chỉnh sửa được
           'editing'   đã gửi rồi mở lại, còn hạn: bản đã gửi vẫn giữ tới khi gửi lại
           'locked'    đã gửi, hết hạn hoặc gửi bằng file nộp trễ: chỉ xem
           'closed'    chưa gửi, hết hạn
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
      // File nộp trễ chỉ gửi một lần (§27.1), không mở lại được
      var canReopen = open && p.self.source !== 'file-import';
      return out(canReopen ? 'submitted' : 'locked', false, false, canReopen);
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

  /* Mục tiêu nhân viên còn phải thiết lập, cho nhãn tab Mục tiêu. Hết hạn tự đánh giá thì
     mục tiêu còn thiếu đi theo file nộp trễ (§27.1), không bổ sung ở tab Mục tiêu nữa. */
  function goalAction(p) {
    if (!p || p.eligibility.reason !== 'missing-goal') return null;
    if (stepState('self', p.now) === 'closed') return null;
    return { what: !!p.eligibility.missingWhat, dev: !!p.eligibility.missingDev };
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
    lateSubmissionDeadline: lateSubmissionDeadline,
    lateDays: lateDays,
    lateRounds: lateRounds,
    lmDeadline: lmDeadline,
    lateRound: lateRound,
    lateText: lateText,
    isWorkingDay: isWorkingDay,
    addWorkingDays: addWorkingDays,
    workingDaysBetween: workingDaysBetween,
    lateWindowOpen: lateWindowOpen,
    currentStep: currentStep,
    profile: profile,
    status: status,
    managerReviewState: managerReviewState,
    cycleTabLabel: cycleTabLabel,
    managerEditWindow: managerEditWindow,
    calibrationState: calibrationState,
    nextManagerLog: nextManagerLog,
    lateMeasure: lateMeasure,
    reviewGoals: reviewGoals,
    canAddGoals: canAddGoals,
    overRatingCap: overRatingCap,
    lateMeasureText: lateMeasureText,
    ratingCapText: ratingCapText,
    managerRosterRank: managerRosterRank,
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
