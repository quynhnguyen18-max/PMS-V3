/* Popup `Phản hồi đã nhận` của Quản lý, dựng lại đúng khuôn popup của M-04 (`#feedbackDialog`) để màn khác mở được
   mà không chép luật (DS §20.1). Dùng ở M-06 (tab Giữa năm và Đánh giá cuối năm), chốt 02/10/2026.

   Nguồn dữ liệu và luật là các file dùng chung của M-04 và H-05, trang gọi phải nạp trước:
     ManagerFeedbackData (manager-feedback-data.js)   phản hồi đã chia sẻ với quản lý, thẻ phản hồi
     ManagerThanks       (manager-thanks.js)          tim cảm ơn: mỗi domain một tim
     ManagerAiSummary    (manager-ai-summary.js)      AI Summary từ 2 phản hồi trở lên
     FeedbackReportView  (H-05/feedback-report-view.js, kèm feedback-program-data.js và feedback-program-model.js)
                         số kết quả HR đã chia sẻ với quản lý
   Giao diện: CSS chép từ M-04 và chỉ áp trong `#mgrFbDialog`, nên không đụng class trùng tên của màn đang mở.
   Sửa popup của M-04 thì sửa cả file này. */
(function (root) {
  'use strict';

  var ID = 'mgrFbDialog';
  var state = { employeeId: null, aiCollapsed: true, aiViewed: false, toast: null };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  function employees() { return root.PMS_EMPLOYEES || []; }
  function store() {
    if (!state.store) state.store = root.ManagerFeedbackData.createStore(employees());
    return state.store;
  }
  function hrCount(login) {
    return root.FeedbackReportView ? root.FeedbackReportView.countFor(login, 'managers') : 0;
  }
  function toast(message) {
    if (typeof state.toast === 'function') state.toast(message);
  }

  /* Tim cảm ơn ghi chung store với M-04 (`pms.m04.thanks`), nên tim thả ở đây cũng hiện ở M-04 và ngược lại. */
  function useThanks(viewer) {
    var T = root.ManagerThanks;
    if (!T) return;
    if (!T.active()) {
      try { T.use(T.createStore(root.localStorage)); } catch (e) { /* bị chặn localStorage thì không có tim */ }
    }
    if (viewer && viewer.login) T.setViewer({ name: viewer.name, dom: viewer.login });
  }
  if (typeof root.thankFeedback !== 'function') {
    root.thankFeedback = function (id, button) {
      var who = root.ManagerThanks && root.ManagerThanks.thank(id, button);
      if (who) toast('Đã gửi lời cảm ơn tới ' + who + '.');
    };
  }

  function aiSummaryHtml(employee, feedback) {
    var summary = root.ManagerAiSummary ? root.ManagerAiSummary.create(employee, feedback) : { available: false };
    if (!summary.available) return '';
    function list(items) {
      return '<ul class="dialog-ai-summary-list">' + items.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>';
    }
    return '<section class="dialog-ai-summary" id="mgrFbAiSummary"' + (state.aiCollapsed ? ' hidden' : '') + '>' +
      '<header class="dialog-ai-summary-head"><div><div class="dialog-ai-summary-brand"><img class="dialog-ai-summary-mascot" src="../assets/mascot/think.png" alt=""/>' +
        '<span>AI Summary</span></div><div class="dialog-ai-summary-note">Không bao gồm kết quả từ chương trình của HR</div></div>' +
        '<button type="button" class="dialog-ai-summary-toggle" data-mfd="ai-close" aria-label="Đóng AI Summary"><i class="bx bx-x"></i></button></header>' +
      '<div class="dialog-ai-summary-content"><section><div class="dialog-ai-summary-label">Điểm mạnh</div>' + list(summary.strengths) + '</section>' +
        '<section><div class="dialog-ai-summary-label">Cơ hội phát triển</div>' + list(summary.opportunities) + '</section></div></section>';
  }

  function syncAiEntry() {
    var entry = document.getElementById('mgrFbAiEntry');
    var summary = document.getElementById('mgrFbAiSummary');
    if (!entry) return;
    var available = !!summary;
    entry.hidden = !available || !state.aiCollapsed;
    entry.setAttribute('aria-expanded', String(!state.aiCollapsed));
    entry.classList.toggle('bob', available && state.aiCollapsed && !state.aiViewed);
    if (summary) summary.hidden = state.aiCollapsed;
  }

  function toggleAi() {
    state.aiCollapsed = !state.aiCollapsed;
    if (!state.aiCollapsed) state.aiViewed = true;
    syncAiEntry();
    var summary = document.getElementById('mgrFbAiSummary');
    if (summary && !state.aiCollapsed) summary.scrollIntoView({ block: 'nearest' });
  }

  function ensureDom() {
    var node = document.getElementById(ID);
    if (node) return node;
    injectCss();
    node = document.createElement('div');
    node.id = ID;
    node.className = 'mfd-ov';
    node.innerHTML =
      '<section class="mfd-dlg" role="dialog" aria-modal="true" aria-labelledby="mgrFbTitle">' +
        '<header class="dialog-head"><div class="dialog-heading"><div class="dialog-title" id="mgrFbTitle">Phản hồi đã nhận ' +
          '<span class="dialog-count" id="mgrFbCount">0</span></div><div class="dialog-sub" id="mgrFbSub"></div></div>' +
          '<button type="button" class="ai-entry" id="mgrFbAiEntry" hidden data-mfd="ai-open" aria-expanded="false" aria-controls="mgrFbAiSummary" aria-label="AI Summary">' +
            '<span class="ai-entry-cta">AI summary</span><img src="../assets/mascot/think.png" alt=""/></button>' +
          '<div class="dialog-actions">' +
            '<button type="button" class="icon-btn" id="mgrFbDownload" data-mfd="download" title="Tải phản hồi" aria-label="Tải phản hồi"><i class="bx bx-download"></i></button>' +
            '<button type="button" class="icon-btn" data-mfd="tab" title="Mở trong tab mới" aria-label="Mở trong tab mới"><i class="bx bx-link-external"></i></button>' +
            '<button type="button" class="close" data-mfd="close" aria-label="Đóng">×</button></div></header>' +
        '<div class="dialog-body" id="mgrFbBody"></div>' +
        '<footer class="dialog-foot"><button type="button" class="btn btn-outline" data-mfd="close">Đóng</button></footer>' +
      '</section>';
    document.body.appendChild(node);
    node.addEventListener('click', function (e) {
      if (e.target === node) { close(); return; }
      var act = e.target.closest('[data-mfd]');
      if (!act) return;
      var kind = act.getAttribute('data-mfd');
      if (kind === 'close') close();
      else if (kind === 'ai-open' || kind === 'ai-close') toggleAi();
      else if (kind === 'tab') openTab(false);
      else if (kind === 'report') openTab(true);
      else if (kind === 'download') download();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && node.classList.contains('open')) close();
    });
    return node;
  }

  function openTab(report) {
    if (!state.employeeId) return;
    root.open('../../../M-04/feedback-detail.html?employee=' + encodeURIComponent(state.employeeId) + '&cycle=' + encodeURIComponent(state.cycle) +
      (report ? '&report=1' : ''), '_blank', 'noopener');
  }

  // Cùng câu báo với nút tải ở M-04: phản hồi và kết quả HR của đúng người đang xem
  function download() {
    var emp = employees().filter(function (e) { return e.id === state.employeeId; })[0];
    if (!emp) return;
    var feedback = store().feedbackFor(emp.id, state.cycle).length, reports = hrCount(emp.login);
    var parts = [];
    if (feedback) parts.push(feedback + ' phản hồi');
    if (reports) parts.push(reports + ' kết quả từ HR ở sheet riêng');
    toast(parts.length ? 'Đang chuẩn bị tệp cho ' + emp.name + ' - ' + parts.join(' - ') + '.' : 'Chưa có phản hồi nào để tải.');
  }

  function close() {
    var node = document.getElementById(ID);
    if (node) node.classList.remove('open');
  }

  /* opts: { employeeId, viewer: { name, login } (quản lý đang xem, để thả tim), cycle (mặc định '2026'), toast(message) } */
  function open(opts) {
    opts = opts || {};
    var emp = employees().filter(function (e) { return e.id === opts.employeeId; })[0];
    if (!emp || !root.ManagerFeedbackData) return;
    state.employeeId = emp.id;
    state.cycle = opts.cycle || '2026';
    state.toast = opts.toast || null;
    // Mặc định thu gọn AI Summary, mỗi lần mở lại mời một lần (như M-04)
    state.aiCollapsed = true;
    state.aiViewed = false;
    useThanks(opts.viewer);
    var node = ensureDom();
    var items = store().feedbackFor(emp.id, state.cycle);
    var count = hrCount(emp.login);
    document.getElementById('mgrFbCount').textContent = items.length;
    document.getElementById('mgrFbSub').textContent = store().employeeMeta(emp);
    var label = 'Tải phản hồi của ' + emp.name;
    var dl = document.getElementById('mgrFbDownload');
    dl.title = label; dl.setAttribute('aria-label', label);
    var hrLine = count
      ? '<div class="hr-line"><i class="bx bx-bar-chart-alt-2"></i><span>Kết quả phản hồi được chia sẻ từ HR <b>(' + count + ')</b></span>' +
        '<button type="button" class="hr-line-link" data-mfd="report">Xem chi tiết <i class="bx bx-link-external"></i></button></div>'
      : '';
    var content = items.length
      ? aiSummaryHtml(emp, items) + '<div class="feedback-card-list">' + items.map(function (item) {
          return root.ManagerFeedbackData.feedbackCard(item, emp);
        }).join('') + '</div>'
      : '<div class="empty">Chưa có phản hồi nào được chia sẻ với quản lý.</div>';
    document.getElementById('mgrFbBody').innerHTML = hrLine + content;
    syncAiEntry();
    node.classList.add('open');
    node.querySelector('.dialog-body').scrollTop = 0;
  }

  function injectCss() {
    if (document.getElementById('mgr-fb-dialog-css')) return;
    var S = '#' + ID + ' ';
    var st = document.createElement('style');
    st.id = 'mgr-fb-dialog-css';
    st.textContent = [
      '#' + ID + '{position:fixed;inset:0;background:rgba(24,24,27,.48);display:none;align-items:center;justify-content:center;padding:28px;z-index:1300}',
      '#' + ID + '.open{display:flex}',
      S + '.mfd-dlg{width:min(720px,100%);max-height:88vh;background:var(--z0);border:1px solid var(--z200);border-radius:10px;box-shadow:var(--sh-lg);' +
        'display:flex;flex-direction:column;overflow:hidden;animation:mfd-pop .16s ease;font-size:14px;line-height:1.5;color:var(--z700);text-align:left}',
      '@keyframes mfd-pop{from{opacity:0;transform:translateY(7px) scale(.99)}to{opacity:1;transform:none}}',
      S + '.dialog-head{padding:18px 22px 16px;background:var(--z0);border-bottom:1px solid var(--z200);display:flex;align-items:center;gap:14px;min-height:70px}',
      S + '.dialog-heading{flex:1;min-width:0}',
      S + '.dialog-title{font-size:15px;font-weight:700;color:var(--z900);line-height:1.4}',
      S + '.dialog-count{display:inline-flex;align-items:center;justify-content:center;min-width:19px;height:19px;padding:0 6px;margin-left:5px;' +
        'border-radius:20px;background:var(--z100);color:var(--z600);font-size:10px;vertical-align:2px}',
      S + '.dialog-sub{font-size:11.5px;color:var(--z500);margin-top:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      S + '.dialog-actions{display:flex;gap:4px}',
      S + '.icon-btn{width:30px;height:30px;border:0;background:transparent;border-radius:var(--rsm);color:var(--z500);display:grid;place-items:center;font-size:16px;cursor:pointer}',
      S + '.icon-btn:hover{background:var(--z100)}',
      S + '.close{width:28px;height:28px;border:0;border-radius:5px;background:transparent;color:var(--z500);font-size:18px;cursor:pointer}',
      S + '.close:hover{background:var(--z100)}',
      S + '.dialog-body{padding:12px 16px 16px;overflow:auto;display:flex;flex-direction:column;gap:9px}',
      S + '.dialog-foot{padding:10px 16px 14px;border-top:1px solid var(--z100);display:flex;justify-content:flex-end}',
      S + '.empty{padding:36px;text-align:center;color:var(--z500)}',
      // Lối vào AI Summary: mascot cạnh tiêu đề, nhún nhẹ để mời khi chưa xem
      S + '.ai-entry{position:relative;display:flex;align-items:center;gap:8px;flex:none;padding:2px;border:0;border-radius:var(--r);background:transparent;cursor:pointer;transition:background .12s ease}',
      S + '.ai-entry[hidden]{display:none}',
      S + '.ai-entry:hover{background:var(--brand-muted)}',
      S + '.ai-entry img{width:34px;height:34px;object-fit:contain;display:block;transition:transform .12s ease}',
      S + '.ai-entry:hover img{transform:translateY(-2px)}',
      '@keyframes mfd-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}',
      S + '.ai-entry.bob img{animation:mfd-bob 2.6s ease-in-out infinite}',
      S + '.ai-entry.bob:hover img{animation:none}',
      '@media(prefers-reduced-motion:reduce){' + S + '.ai-entry.bob img{animation:none}}',
      S + '.ai-entry-cta{flex:none;padding:5px 10px;border-radius:7px;background:var(--z0);color:var(--brand);border:1px solid var(--brand-ring);' +
        'font-size:10.5px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(165,0,100,.10)}',
      S + '.dialog-ai-summary{border:1px solid var(--brand-ring);border-radius:var(--r);background:var(--z0);box-shadow:0 3px 10px rgba(24,24,27,.06);overflow:hidden;flex:none}',
      S + '.dialog-ai-summary[hidden]{display:none}',
      S + '.dialog-ai-summary-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:11px 13px;border-bottom:1px solid var(--z100)}',
      S + '.dialog-ai-summary-brand{display:flex;align-items:center;gap:6px;color:var(--brand);font-size:13px;font-weight:700}',
      S + '.dialog-ai-summary-mascot{width:20px;height:20px;object-fit:contain;display:block}',
      S + '.dialog-ai-summary-note{margin-top:4px;font-size:11px;font-weight:400;color:var(--z600)}',
      S + '.dialog-ai-summary-toggle{width:28px;height:28px;border:1px solid var(--z200);border-radius:var(--rsm);background:var(--z0);color:var(--z600);display:grid;place-items:center;cursor:pointer}',
      S + '.dialog-ai-summary-toggle:hover{background:var(--z50);border-color:var(--z300)}',
      S + '.dialog-ai-summary-content{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:12px 13px 10px}',
      S + '.dialog-ai-summary-label{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.35px;color:var(--z600);margin-bottom:6px}',
      S + '.dialog-ai-summary-list{margin:0;padding-left:17px;color:var(--z700);font-size:12px;line-height:1.55}',
      S + '.dialog-ai-summary-list li+li{margin-top:4px}',
      // Dòng kết quả HR
      S + '.hr-line{display:flex;align-items:center;gap:8px;padding:8px 11px;border:1px solid var(--brand-ring);border-radius:7px;background:var(--brand-muted);font-size:12px;color:var(--z700)}',
      S + '.hr-line>i{font-size:16px;color:var(--brand);flex:none}',
      S + '.hr-line b{color:var(--z900);font-weight:600}',
      S + '.hr-line-link{margin-left:auto;display:inline-flex;align-items:center;gap:4px;border:0;background:transparent;padding:0;color:var(--brand);font-size:11.5px;font-weight:600;white-space:nowrap;cursor:pointer;font-family:inherit}',
      S + '.hr-line-link:hover{text-decoration:underline}',
      S + '.hr-line-link i{font-size:14px}',
      // Thẻ phản hồi (ManagerFeedbackData.feedbackCard)
      S + '.feedback-card-list{display:flex;flex-direction:column;gap:9px}',
      S + '.feedback-card{position:relative;border:1px solid var(--z200);border-radius:var(--r);padding:14px;background:var(--z0)}',
      S + '.fb-head{display:flex;align-items:flex-start;gap:9px;padding-right:55px}',
      S + '.avatar{width:30px;height:30px;border-radius:50%;background:var(--brand-muted);color:var(--brand);display:grid;place-items:center;font-size:11px;font-weight:700;flex:none}',
      S + '.fb-line{font-size:12.5px;font-weight:600;color:var(--z900)}',
      S + '.fb-domain{color:var(--z500);font-weight:400}',
      S + '.fb-date{font-size:11px;color:var(--z500);margin-top:2px}',
      S + '.cv-icons{position:absolute;right:12px;top:12px;display:flex}',
      S + '.cv-icon{width:26px;height:26px;border-radius:50%;margin-left:-6px;border:2px solid var(--z0)}',
      S + '.fb-body{font-size:12.5px;line-height:1.65;color:var(--z700);margin:0}',
      S + '.qa{margin:9px 0 0}',
      S + '.qa-q{display:block;width:100%;background:var(--brand-muted);color:var(--z700);font-size:12.5px;line-height:1.5;padding:7px 12px 8px;border-radius:10px 10px 10px 4px}',
      S + '.qa-text{display:inline;margin:0}',
      S + '.q-label{font-weight:600;color:var(--z600)}',
      S + '.q-more{display:none}',
      S + '.qa-a{position:relative;margin:0 0 0 8px;padding-left:10px}',
      S + '.qa-a::before{content:"";position:absolute;left:0;top:-2px;width:10px;height:13px;border-left:2px solid var(--z200);border-bottom:2px solid var(--z200);border-bottom-left-radius:7px}',
      S + '.qa-a .fb-body{display:block;width:100%;margin:0;font-size:12.5px;background:transparent;border-radius:0;padding:4px 8px 1px}',
      S + '.pms-tooltip{position:relative;display:inline-flex;cursor:help}',
      S + '.fb-sender{gap:4px;align-items:baseline}',
      S + '.pms-tooltip-content{position:absolute;top:calc(100% + 7px);left:50%;transform:translateX(-50%);z-index:40;padding:5px 9px;background:var(--z900);color:var(--brand-fg);' +
        'border-radius:var(--rsm);font-size:12px;font-weight:500;line-height:1.4;white-space:nowrap;pointer-events:none;opacity:0;visibility:hidden;transition:opacity .12s ease}',
      S + '.pms-tooltip-content::after{content:"";position:absolute;bottom:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-bottom-color:var(--z900)}',
      S + '.pms-tooltip:hover .pms-tooltip-content,' + S + '.pms-tooltip:focus-visible .pms-tooltip-content{opacity:1;visibility:visible}',
      // Tim cảm ơn (ManagerThanks)
      S + '.thx-mark{display:inline-flex;align-items:center;margin-left:5px;vertical-align:-2px;line-height:1}',
      S + '.thx-heart{position:relative;display:inline-flex;align-items:center;cursor:default;transition:transform .12s ease}',
      S + '.thx-heart+.thx-heart{margin-left:-3px}',
      S + '.thx-heart:hover,' + S + '.thx-heart:focus-visible{z-index:2;transform:translateY(-1px);outline:none}',
      S + '.thx-heart svg{display:block;height:14px;width:auto}',
      S + '.thx-heart .h-thanker{fill:var(--brand);stroke:var(--z0);stroke-width:1.25;stroke-linejoin:round}',
      '@keyframes mfd-thx-pop{0%{transform:scale(0) rotate(-28deg);opacity:0}60%{transform:scale(1.3) rotate(4deg);opacity:1}100%{transform:scale(1);opacity:1}}',
      S + '.thx-mark.pop{animation:mfd-thx-pop .5s cubic-bezier(.3,1.6,.5,1) both}',
      S + '.thx-tip{position:absolute;bottom:calc(100% + 7px);left:50%;transform:translateX(-50%);z-index:60;width:max-content;white-space:nowrap;padding:7px 10px;' +
        'border-radius:var(--rsm);background:var(--z900);color:var(--brand-fg);font-size:12px;font-weight:500;line-height:1.45;text-align:left;pointer-events:none;opacity:0;transition:opacity .12s ease}',
      S + '.thx-tip::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:var(--z900)}',
      S + '.thx-heart:hover .thx-tip,' + S + '.thx-heart:focus-visible .thx-tip{opacity:1}',
      S + '.fb-thx-bar{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:11px;border-top:1px dashed var(--z200);overflow:hidden;' +
        'transition:opacity .2s ease,margin-top .35s ease,padding-top .35s ease,height .35s ease}',
      S + '.fb-thx-bar.gone{opacity:0;height:0;margin-top:0;padding-top:0;border-top-color:transparent}',
      S + '.fb-thx{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;border-radius:20px;font-size:12.5px;font-weight:600;color:var(--brand);' +
        'background:var(--z0);border:1px solid var(--brand-ring);transition:all .12s ease;cursor:pointer;font-family:inherit}',
      S + '.fb-thx:hover{background:var(--brand-muted);border-color:var(--brand)}',
      S + '.fb-thx i{font-size:14px}',
      S + '.fb-thx-hint{font-size:11.5px;color:var(--z500)}',
      '@keyframes mfd-thx-btn{0%{transform:scale(1)}40%{transform:scale(1.14)}100%{transform:scale(1)}}',
      S + '.fb-thx.pop{animation:mfd-thx-btn .42s cubic-bezier(.3,1.6,.5,1)}',
      // Tim bay lên khi bấm Cảm ơn: phần tử gắn vào body, nằm ngoài popup
      '.thx-fly{position:fixed;z-index:1400;pointer-events:none;color:var(--brand);animation:mfd-thx-fly 1.05s ease-out forwards}',
      '@keyframes mfd-thx-fly{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}18%{opacity:1;transform:translate(-50%,-70%) scale(1.15)}' +
        '100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),-260%) scale(.75)}}',
      '@media(max-width:620px){' + S + '.dialog-ai-summary-content{grid-template-columns:1fr;gap:12px}' + S + '.dialog-head{padding:14px 16px}}'
    ].join('\n');
    document.head.appendChild(st);
  }

  root.ManagerFeedbackDialog = { open: open, close: close };
})(typeof globalThis !== 'undefined' ? globalThis : this);
