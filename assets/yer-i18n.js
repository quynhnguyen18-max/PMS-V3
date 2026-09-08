/* ═══════════════════════════════════════════════════════════
   YER i18n — song ngữ VI/EN cho label hệ thống
   Chỉ dịch label hệ thống. Nội dung người dùng nhập giữ nguyên.
   Từ điển chia theo màn hình / vai trò, mỗi nhóm là một "sheet".
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DICT = {
    /* ── sheet: common (dùng chung mọi màn) ─────────────── */
    'common.cycle': ['Đánh giá cuối năm 2026', 'Year-End Review 2026'],
    'common.employee': ['Nhân viên', 'Employee'],
    'common.team': ['Team', 'Team'],
    'common.lineManager': ['Quản lý trực tiếp', 'Line Manager'],
    'common.manager2': ['Quản lý cấp 2', 'Second-level Manager'],
    'common.hod': ['Trưởng đơn vị', 'Head of Department'],
    'common.hrbp': ['HRBP', 'HRBP'],
    'common.lod': ['L&OD', 'L&OD'],
    'common.totalReward': ['Total Reward', 'Total Reward'],
    'common.hrDirector': ['HR Director', 'HR Director'],
    'common.goals': ['Mục tiêu', 'Goals'],
    'common.midYear': ['Đánh giá giữa năm', 'Mid-Year Review'],
    'common.yearEnd': ['Đánh giá cuối năm', 'Year-End Review'],
    'common.goalWhat': ['Mục tiêu công việc', 'Work Goals'],
    'common.goalDev': ['Mục tiêu phát triển', 'Development Goals'],
    'common.goalHow': ['Mục tiêu hành vi', 'Behavioral Goals'],
    'common.selfAssessment': ['Tự đánh giá', 'Self Assessment'],
    'common.managerAssessment': ['Quản lý đánh giá', 'Manager Assessment'],
    'common.overallScore': ['Điểm toàn diện', 'Overall Rating'],
    'common.overallComment': ['Nhận xét toàn diện', 'Overall Comment'],
    'common.finalRating': ['Điểm cuối cùng', 'Final Rating'],
    'common.notPublished': ['Chưa công bố', 'Not published'],
    'common.hrSystem': ['HR system', 'HR system'],
    'common.save': ['Lưu nháp', 'Save draft'],
    'common.submit': ['Gửi', 'Submit'],
    'common.cancel': ['Hủy', 'Cancel'],
    'common.close': ['Đóng', 'Close'],
    'common.confirm': ['Xác nhận', 'Confirm'],
    'common.stay': ['Ở lại', 'Stay'],
    'common.search': ['Tìm kiếm', 'Search'],
    'common.filter': ['Bộ lọc', 'Filter'],
    'common.export': ['Tải xuống', 'Export'],
    'common.deadline': ['Hạn', 'Deadline'],
    'common.readonly': ['Chỉ xem', 'Read only'],
    'common.noData': ['Không có dữ liệu', 'No data'],

    /* ── sheet: status ──────────────────────────────────── */
    'status.needSelf': ['Cần tự đánh giá', 'Self assessment needed'],
    'status.waitLm': ['Chờ Quản lý trực tiếp', 'Awaiting line manager'],
    'status.waitLm2': ['Chờ Quản lý cấp 2', 'Awaiting second-level manager'],
    'status.waitHod': ['Chờ HOD đánh giá', 'Awaiting HOD'],
    'status.waitFinal': ['Chờ tải điểm cuối cùng', 'Awaiting final upload'],
    'status.published': ['Đã công bố kết quả', 'Results published'],
    'status.notOpen': ['Chưa mở', 'Not open yet'],
    'status.notEvaluated': ['Không đánh giá', 'Not evaluated'],
    'status.outOfCycle': ['Ngoài kỳ đánh giá', 'Out of cycle'],
    'status.resigned': ['Đã nghỉ việc', 'Resigned'],
    'status.maternity': ['Nghỉ thai sản', 'Maternity leave'],
    'status.done': ['Đã hoàn tất', 'Completed'],

    /* ── sheet: demo (thanh điều khiển) ─────────────────── */
    'demo.title': ['Chế độ demo', 'Demo mode'],
    'demo.role': ['Vai trò', 'Role'],
    'demo.person': ['Nhân sự', 'Person'],
    'demo.date': ['Ngày hệ thống', 'System date'],
    'demo.reset': ['Đặt lại dữ liệu', 'Reset data'],
    'demo.hide': ['Ẩn thanh demo (D)', 'Hide demo bar (D)'],
    'demo.show': ['Chế độ demo', 'Demo mode'],
    'demo.scenario': ['Tình huống', 'Scenario'],
    'demo.resetDone': ['Đã đặt lại toàn bộ dữ liệu demo', 'All demo data has been reset'],

    /* ── sheet: nv (màn nhân viên) ──────────────────────── */
    'nv.title': ['Mục tiêu và Đánh giá cá nhân', 'My Goals and Reviews'],
    'nv.midYearSnapshot': ['Kết quả kỳ giữa năm', 'Mid-Year Snapshot'],
    'nv.noMidYear': ['Không có dữ liệu Mid-Year', 'No Mid-Year data'],
    'nv.goalChanged': ['Đã thay đổi sau Mid-Year', 'Changed after Mid-Year'],
    'nv.response': ['Phản hồi của Nhân viên', 'Employee Response'],
    'nv.responsePlaceholder': ['Nhập phản hồi của bạn về kết quả đánh giá', 'Enter your response to the assessment result'],
    'nv.responseSend': ['Gửi phản hồi', 'Send response'],
    'nv.responseSentAt': ['Đã gửi lúc', 'Sent at'],
    'nv.responseLocked': ['Quản lý đã trả lời, luồng trao đổi đã khóa', 'Manager has replied, this thread is closed'],
    'nv.missingGoalTitle': ['Chưa đủ điều kiện tự đánh giá', 'Not eligible for self assessment'],
    'nv.missingGoalBody': ['Bạn cần có tối thiểu 1 mục tiêu công việc và 1 mục tiêu phát triển đã được duyệt.', 'You need at least one approved work goal and one approved development goal.'],
    'nv.maternityBanner': ['Bạn đang nghỉ thai sản nên không bắt buộc thực hiện bước Tự đánh giá trong kỳ này. Quản lý trực tiếp vẫn tiếp tục đánh giá theo quy trình của Công ty.', 'You are on maternity leave, so self assessment is not required this cycle. Your line manager will continue the review as usual.'],

    /* ── sheet: lm (màn quản lý) ────────────────────────── */
    'lm.title': ['Mục tiêu và Đánh giá nhân viên', 'Team Goals and Reviews'],
    'lm.tabDirect': ['Cấp 1 - trực tiếp', 'Direct reports'],
    'lm.tabLm2': ['Cấp 2', 'Second level'],
    'lm.tabHod': ['Đơn vị', 'Department'],
    'lm.showResigned': ['Hiển thị nhân viên đã nghỉ việc', 'Show resigned employees'],
    'lm.onlyWithResponse': ['Chỉ nhân viên có phản hồi', 'Only employees with a response'],
    'lm.approvePrev': ['Duyệt điểm cấp dưới', 'Approve previous level'],
    'lm.uploadScores': ['Tải điểm lên hệ thống', 'Upload scores'],
    'lm.aiSummary': ['Tóm tắt bằng AI', 'AI Summary'],
    'lm.wrapupTask': ['Hoàn tất bàn giao đánh giá', 'Complete Performance Wrap-up'],
    'lm.wrapupFromPrev': ['Bàn giao từ Quản lý trước', 'Wrap-up from previous manager'],
    'lm.importGoals': ['Import mục tiêu', 'Import goals'],

    /* ── sheet: hr (HRBP, L&OD, TR, HRD) ────────────────── */
    'hr.roster': ['Danh sách hồ sơ đánh giá', 'Review roster'],
    'hr.proxyView': ['Xem theo góc nhìn người dùng', 'View as user'],
    'hr.proxyBadge': ['Proxy View (Chỉ xem)', 'Proxy View (Read Only)'],
    'hr.uploadFinal': ['Tải điểm cuối cùng', 'Upload final ratings'],
    'hr.approveFinal': ['Duyệt điểm cuối cùng', 'Approve final ratings'],
    'hr.publish': ['Công bố kết quả', 'Publish results']
  };

  var listeners = [];

  function lang() {
    var s = window.PMSStore && window.PMSStore.session();
    return (s && s.lang) || 'vi';
  }
  function t(key, forced) {
    var row = DICT[key];
    if (!row) return key;
    return (forced || lang()) === 'en' ? row[1] : row[0];
  }
  function setLang(next) {
    if (window.PMSStore) window.PMSStore.setSession({ lang: next });
    apply(document);
    listeners.forEach(function (fn) { try { fn(next); } catch (e) {} });
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });
    root.querySelectorAll('[data-lang-toggle] button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang());
    });
    document.documentElement.setAttribute('lang', lang());
  }

  function mountToggle(container) {
    if (!container) return null;
    var wrap = document.createElement('div');
    wrap.className = 'lang-sw';
    wrap.setAttribute('data-lang-toggle', '');
    wrap.innerHTML =
      '<button type="button" data-lang="vi" aria-label="Tiếng Việt">VI</button>' +
      '<button type="button" data-lang="en" aria-label="English">EN</button>';
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-lang]');
      if (b) setLang(b.dataset.lang);
    });
    container.appendChild(wrap);
    apply(document);
    return wrap;
  }

  var CSS =
    '.lang-sw{display:inline-flex;border:1px solid var(--z200);border-radius:var(--rsm);overflow:hidden;background:var(--z0)}' +
    '.lang-sw button{padding:4px 10px;font-size:11.5px;font-weight:600;color:var(--z600);background:transparent;border:0;cursor:pointer;transition:var(--t);font-family:inherit}' +
    '.lang-sw button + button{border-left:1px solid var(--z200)}' +
    '.lang-sw button:hover{background:var(--z100);color:var(--z900)}' +
    '.lang-sw button.on{background:var(--brand-muted);color:var(--brand)}';

  function injectCss() {
    if (document.getElementById('pms-i18n-css')) return;
    var s = document.createElement('style');
    s.id = 'pms-i18n-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { injectCss(); apply(document); });
  } else { injectCss(); apply(document); }

  window.PMSI18n = {
    dict: DICT,
    t: t,
    lang: lang,
    setLang: setLang,
    apply: apply,
    mountToggle: mountToggle,
    onChange: function (fn) { listeners.push(fn); }
  };
})();
