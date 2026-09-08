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
    return t.toISOString().slice(0, 10);
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
  function eligibility(emp, hr, seed, acts) {
    if (!emp) return { eligible: false, reason: 'not-found' };
    var hired = hr && hr.hired;
    if (hired && cmp(hired, TL.onboardCutoff) >= 0) {
      return { eligible: false, reason: 'late-onboard', hidden: true };
    }
    var goals = (emp.goals || []).filter(function (g) { return g.status === 'approved'; });
    var imported = (acts && acts.importedGoals) || (seed && seed.importedGoals);
    var hasWhat = goals.some(function (g) { return g.type === 'what'; }) || imported;
    var hasDev = goals.some(function (g) { return g.type === 'dev'; }) || imported;
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
    var response = merge(seed.response, acts.response);
    var wrapup = merge(seed.wrapup, acts.wrapup);
    var final = merge(seed.final, acts.final);

    // Sự kiện chỉ được coi là đã xảy ra nếu ngày hệ thống đã qua thời điểm đó
    function happened(block) { return block && block.at && cmp(now, block.at) >= 0; }

    var elig = eligibility(emp, hr, seed, acts);
    var cycleOpen = step('self').from;
    var maternity = !!(hr.maternityFrom && cmp(cycleOpen, hr.maternityFrom) >= 0 &&
      (!hr.maternityTo || cmp(cycleOpen, hr.maternityTo) < 0)) || !!emp.maternity;

    var resignFrom = hr.resignFrom || emp.resignFrom || null;
    var resigned = !!(emp.resigned || (resignFrom && cmp(now, resignFrom) >= 0));

    var selfDone = happened(self);
    var lmDone = happened(lm);
    var lm2Done = happened(lm2);
    var hodDone = happened(hod);

    // Auto-sync quá deadline — chỉ điểm toàn diện, không kèm nhận xét
    var lmView = lmDone ? Object.assign({}, lm, { source: lm.source || 'manual' }) : null;
    if (!lmView && stepState('lm', now) === 'closed' && selfDone && self.overall) {
      lmView = { overall: { score: self.overall.score, comment: '' }, source: 'sync', at: step('lm').to, synced: true };
    }
    var lm2View = lm2Done ? Object.assign({}, lm2, { source: lm2.source || 'manual' }) : null;
    if (!lm2View && stepState('lm2', now) === 'closed' && lmView && lmView.overall) {
      lm2View = { score: lmView.overall.score, comment: '', source: 'sync', at: step('lm2').to, synced: true };
    }
    // KHÔNG đồng bộ từ LM2 sang HOD
    var hodView = hodDone ? Object.assign({}, hod, { source: hod.source || 'manual' }) : null;

    var stopped = !elig.eligible && elig.reason === 'missing-goal';
    var noScoreAtAll = !selfDone && !lmView;
    if (stopped || (stepState('lm', now) === 'closed' && noScoreAtAll)) stopped = true;

    var finalView = happened({ at: final && final.uploadedAt }) ? final : null;
    var published = !!(final && final.publishedAt && cmp(now, final.publishedAt) >= 0);

    var responseView = happened(response) ? response : null;
    var replyView = responseView && responseView.reply && happened(responseView.reply) ? responseView.reply : null;
    // Ô phản hồi chỉ mở khi: LM đã submit thật (không phải điểm đồng bộ),
    // chưa công bố kết quả, và nhân viên chưa gửi phản hồi lần nào.
    var responseOpen = !!lmDone && !published && !(lmView && lmView.synced) && !responseView;
    // Quản lý chỉ được trả lời một lần, trả lời xong luồng khóa.
    var replyOpen = !!responseView && !replyView && !published;

    var wrapupView = null;
    if (wrapup) {
      if (wrapup.status === 'done' && happened(wrapup)) wrapupView = wrapup;
      else if (wrapup.status !== 'done') wrapupView = wrapup;
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
      maternity: maternity,
      importedGoals: !!((acts && acts.importedGoals) || seed.importedGoals),
      goalChangedAfterMyr: seed.goalChangedAfterMyr || [],
      mgrChange: seed.mgrChange || null,
      stopped: stopped,
      self: selfDone ? self : null,
      selfRequired: !maternity,
      lm: lmView,
      lm2: lm2View,
      hod: hodView,
      hrbpUpload: happened(hrbpUpload) ? hrbpUpload : null,
      final: finalView,
      published: published,
      response: responseView,
      reply: replyView,
      responseOpen: responseOpen,
      replyOpen: replyOpen,
      threadLocked: !!replyView,
      wrapup: wrapupView,
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
    if (p.eligibility.reason === 'missing-goal') return { key: 'noeval', label: t('Không đánh giá', 'Not evaluated'), tone: 'muted' };
    if (p.resigned) return { key: 'resigned', label: t('Đã nghỉ việc', 'Resigned'), tone: 'muted' };
    if (p.published) return { key: 'published', label: t('Đã công bố kết quả', 'Results published'), tone: 'done' };
    if (p.hod) return { key: 'wait-tr', label: t('Chờ tải điểm cuối cùng', 'Awaiting final upload'), tone: 'muted' };
    if (p.lm2) return { key: 'wait-hod', label: t('Chờ HOD đánh giá', 'Awaiting HOD'), tone: 'action' };
    if (p.lm) return { key: 'wait-lm2', label: t('Chờ Quản lý cấp 2', 'Awaiting second-level manager'), tone: 'action' };
    if (p.self) return { key: 'wait-lm', label: t('Chờ Quản lý trực tiếp', 'Awaiting line manager'), tone: 'action' };
    if (p.maternity) return { key: 'maternity', label: t('Nghỉ thai sản - không yêu cầu tự đánh giá', 'Maternity leave - self assessment not required'), tone: 'muted' };
    if (stepState('self', p.now) === 'open') return { key: 'need-self', label: t('Cần tự đánh giá', 'Self assessment needed'), tone: 'action' };
    if (stepState('self', p.now) === 'future') return { key: 'not-open', label: t('Chưa mở', 'Not open yet'), tone: 'muted' };
    return { key: 'no-self', label: t('Không tự đánh giá', 'No self assessment'), tone: 'muted' };
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
    return lang === 'en'
      ? 'Between ' + lo.en + ' and ' + hi.en
      : 'Giữa mức ' + Math.floor(v) + ' và ' + (Math.floor(v) + 1);
  }
  function scoreDefinition(v, lang) {
    if (v == null) return '';
    var isHalf = Math.abs(v % 1) > 0;
    var lo = scaleItem(Math.floor(v)), hi = scaleItem(Math.floor(v) + 1);
    if (!isHalf) return lo ? (lang === 'en' ? lo.den : lo.dvi) : '';
    if (!lo || !hi) return '';
    return lang === 'en'
      ? 'Performance exceeds the criteria of level ' + lo.v + ' - ' + lo.en + ' but does not fully meet level ' + hi.v + ' - ' + hi.en + '.'
      : 'Hiệu quả công việc đã vượt trên các tiêu chí của mức ' + lo.v + ' - ' + lo.vi + ' nhưng chưa đạt trọn vẹn các tiêu chí của mức ' + hi.v + ' - ' + hi.vi + '.';
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
    if (!isHalf) return escHtml(scoreDefinition(v, lang));
    var lo = scaleItem(Math.floor(v)), hi = scaleItem(Math.floor(v) + 1);
    if (!lo || !hi) return '';
    function ref(item) {
      // chữ "mức" / "level" để thường, chỉ in đậm số điểm và tên mức
      return (lang === 'en' ? 'level ' : 'mức ') + '<strong>' + item.v + ' - ' +
        escHtml(lang === 'en' ? item.en : item.vi) + '</strong>';
    }
    return lang === 'en'
      ? 'Performance exceeds the criteria of ' + ref(lo) + ' but does not fully meet the criteria of ' + ref(hi) + '.'
      : 'Hiệu quả công việc đã vượt trên các tiêu chí của ' + ref(lo) +
        ' nhưng chưa đạt trọn vẹn các tiêu chí của ' + ref(hi) + '.';
  }

  /* ── Danh sách theo vai trò ─────────────────────────────── */
  function roster(role, opts) {
    opts = opts || {};
    var now = opts.now || today();
    var out = (window.PMS_EMPLOYEES || []).map(function (e) { return profile(e.id, now); }).filter(Boolean);
    out = out.filter(function (p) { return p.eligibility.reason !== 'late-onboard'; });
    if (!opts.showResigned) out = out.filter(function (p) { return !p.resigned; });
    if (role === 'lm') out = out.filter(function (p) { return p.emp.lvl === 'lm1'; });
    return out;
  }

  function completion(list) {
    // NV đã nghỉ việc không tính; "Không đánh giá" vẫn nằm ở mẫu số
    var pool = list.filter(function (p) { return !p.resigned; });
    var done = pool.filter(function (p) { return !!p.lm; }).length;
    return { done: done, total: pool.length, pct: pool.length ? Math.round(done * 100 / pool.length) : 0 };
  }

  window.PMSYer = {
    TL: TL,
    today: today,
    fmt: fmt,
    addDays: addDays,
    cmp: cmp,
    step: step,
    stepState: stepState,
    currentStep: currentStep,
    profile: profile,
    status: status,
    canSee: canSee,
    roster: roster,
    completion: completion,
    scoreLabel: scoreLabel,
    scoreDefinition: scoreDefinition,
    scoreDefinitionHtml: scoreDefinitionHtml,
    scaleItem: scaleItem,
    DEFAULT_DATE: DEFAULT_DATE
  };
})();
