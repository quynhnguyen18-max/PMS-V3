/* ═══════════════════════════════════════════════════════════
   YER AI — AI Performance Copilot của cấp quản lý (YER-SPEC §14, §37)
   - AI Summary: bấm mới chạy, cho QLTT, LM2, HOD. M-05 mở từ cột Chức năng của lưới,
     M-06 mở từ hàng nút của màn chi tiết. Một nguồn nội dung cho cả hai màn.
   - Trợ lý viết nhận xét: chỉ QLTT, ở bốn ô nhận xét của M-06. AI không tự chèn,
     QLTT bấm `Chèn vào ô nhận xét` mới áp dụng. Nhân viên không biết có AI tham gia.
   Nội dung là mock, dựng từ chính dữ liệu của hồ sơ để hợp cảnh từng nhân viên.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function Y() { return window.PMSYer; }
  function U() { return window.PMSUi; }
  function lg() { return window.PMSI18n ? window.PMSI18n.lang() : 'vi'; }
  function L(vi, en) { return lg() === 'en' ? en : vi; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  function numText(v) { return Math.abs(v % 1) > 0 ? Number(v).toFixed(1) : String(v); }
  function plain(text) { return String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
  // Tách câu, bỏ nhãn do trợ lý thêm ở lần trước (Kết quả:, Điểm mạnh:…) để viết lại không bị lặp nhãn
  var LABEL_RE = /^(Kết quả|Điểm mạnh|Cần cải thiện|Gợi ý phát triển|Results|Strengths|To improve|Development tip):\s*/i;
  function sentences(text) {
    return plain(text).split(/(?<=[.!?])\s+/).filter(Boolean).map(function (x) {
      var t = x.replace(LABEL_RE, '').replace(LABEL_RE, '');
      return t.charAt(0).toUpperCase() + t.slice(1);
    });
  }
  function firstSentence(text) {
    var t = sentences(text)[0] || '';
    return t.length > 170 ? t.slice(0, 167) + '…' : t;
  }
  function mascot() { return '<img class="dialog-ai-summary-mascot" src="../assets/mascot/think.png" alt=""/>'; }

  /* ── AI Summary ──────────────────────────────────────── *
     Bố cục (chốt lại 02/10/2026):
       1. Dòng `Nhân viên: Tên (domain)` tách hẳn khỏi phần nội dung.
       2. `Điểm toàn diện các cấp`: dữ liệu, không phải AI. Bốn thẻ nhỏ theo thứ tự vai, mỗi thẻ là tên vai, domain người chấm
          và điểm (cỡ chữ vừa, không nổi hơn nội dung). Ngay dưới là lưu ý về hồ sơ (nộp bổ sung, thai sản, LWD, điểm hệ thống chép).
       3. Khối AI (mascot): `Nhân viên tự đánh giá` và `Các cấp quản lý đánh giá`, mỗi ý là một gạch đầu dòng, không chia mục con.
          Chỉ tổng hợp nhận xét về mục tiêu công việc, mục tiêu phát triển, hành vi (giá trị cốt lõi) và toàn diện;
          không nhắc tới điểm trong phần này.
       Popup cao tối đa bằng màn hình, phần nội dung cuộn, tiêu đề và nút Đóng đứng yên. */
  function scoreCard(label, login, value, synced) {
    return '<div class="yer-ai-sc"><div class="yer-ai-sc-who"><div class="yer-ai-sc-lbl">' + esc(label) + '</div>' +
        (login ? '<div class="yer-ai-sc-dom">' + esc(login) + '</div>' : '') + '</div>' +
      '<div class="yer-ai-sc-num"><div class="yer-ai-sc-val">' + (value != null ? esc(numText(value)) : '—') + '</div>' +
        (synced ? '<div class="yer-ai-sc-sub">(HR system)</div>' : '') + '</div></div>';
  }

  function bullets(items) {
    return '<ul class="yer-ai-list">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  // Một ý cho mỗi ô nhận xét: câu đầu của nhận xét nhóm công việc, phát triển, hành vi, rồi nhận xét toàn diện
  function commentPoints(comments, overall) {
    var c = comments || {};
    return [c.what, c.dev, c.how, overall].filter(function (t) { return plain(t); }).map(firstSentence);
  }

  function summaryHtml(p) {
    var who = Y().actors(p);
    function dom(person) { return person && person.login ? person.login : ''; }
    var selfS = p.self && p.self.overall ? p.self.overall.score : null;
    var lmS = p.lm && p.lm.overall ? p.lm.overall.score : null;
    var scores = '<div class="yer-ai-scores">' +
      scoreCard(L('Nhân viên', 'Employee'), p.emp.login, selfS) +
      scoreCard(L('QLTT', 'Line manager'), dom(who.lm), lmS, p.lm && p.lm.synced) +
      scoreCard(L('Quản lý cấp 2', 'Second level'), dom(who.lm2), p.lm2 ? p.lm2.score : null, p.lm2 && p.lm2.synced) +
      scoreCard(L('Trưởng đơn vị', 'Head of dept'), dom(who.hod), p.hod ? p.hod.score : null) + '</div>';

    // Lưu ý về hồ sơ: thông tin độc lập, không phải nội dung AI
    var flags = [];
    var measure = Y().lateMeasureText(p, lg());
    if (p.lateSubmission) flags.push({ warn: true, t: measure || (L('Hồ sơ nộp bổ sung', 'Late submission') + (p.lateRound ? L(' ở lần nhắc thứ ', ' at reminder ') + p.lateRound.round : '') + '.') });
    if (p.maternity) flags.push({ t: L('Nhân viên nghỉ thai sản, QLTT chịu trách nhiệm đánh giá chính.', 'On maternity leave; the line manager leads the review.') });
    if (p.resignFrom && !p.resigned) flags.push({ t: L('Nhân viên có ngày làm việc cuối cùng là ', 'Last working day: ') + Y().fmt(p.resignFrom, lg()) + '.' });
    if ((p.lm && p.lm.synced) || (p.lm2 && p.lm2.synced)) flags.push({ t: L('Điểm có nhãn (HR system): quá hạn mà cấp đó không đánh giá nên hệ thống tự lấy điểm của cấp trước, không kèm nhận xét.', 'Ratings marked (HR system): that level did not rate before its deadline, so the system copied the previous level rating, without a comment.') });
    var flagHtml = flags.length ? '<div class="yer-ai-flags">' + flags.map(function (f) {
      return '<div class="yer-ai-flag' + (f.warn ? ' warn' : '') + '"><i class="bx ' + (f.warn ? 'bx-error' : 'bx-info-circle') + '"></i><span>' + esc(f.t) + '</span></div>';
    }).join('') + '</div>' : '';

    // Nhân viên tự đánh giá: nhận xét công việc, phát triển, hành vi, toàn diện
    var selfItems = p.self ? commentPoints(p.self.comments, p.self.overall && p.self.overall.comment) : [];
    // Các cấp quản lý: nhận xét của QLTT (bốn ô), rồi nhận xét toàn diện của Quản lý cấp 2, Trưởng đơn vị.
    // Điểm hệ thống tự chép không kèm nhận xét nên không có ý nào.
    var mgrItems = p.lm && !p.lm.synced ? commentPoints(p.lm.comments, p.lm.overall && p.lm.overall.comment) : [];
    if (p.lm2 && !p.lm2.synced && plain(p.lm2.comment)) mgrItems.push(firstSentence(p.lm2.comment));
    if (p.hod && plain(p.hod.comment)) mgrItems.push(firstSentence(p.hod.comment));

    var empty = function (text) { return '<div class="yer-ai-empty">' + esc(text) + '</div>'; };
    return '<section class="yer-ai-sec"><div class="yer-ai-sec-hd">' + L('Điểm toàn diện các cấp', 'Overall ratings by level') + '</div>' +
        scores + flagHtml + '</section>' +
      '<section class="yer-ai-box"><div class="yer-ai-box-hd">' + mascot() + L('AI tổng hợp', 'AI summary') + '</div>' +
        '<div class="yer-ai-part"><div class="yer-ai-part-hd"><i class="bx bx-user"></i>' + L('Nhân viên tự đánh giá', 'Employee self assessment') + '</div>' +
          (selfItems.length ? bullets(selfItems) : empty(L('Nhân viên chưa tự đánh giá.', 'No self assessment yet.'))) + '</div>' +
        '<div class="yer-ai-part"><div class="yer-ai-part-hd"><i class="bx bx-user-check"></i>' + L('Các cấp quản lý đánh giá', 'Manager reviews') + '</div>' +
          (mgrItems.length ? bullets(mgrItems) : empty(L('Chưa có nhận xét của cấp quản lý.', 'No manager comments yet.'))) + '</div>' +
        '<div class="yer-ai-note">' + L('Nội dung do AI tổng hợp từ đánh giá của Nhân viên và các cấp quản lý, chỉ để tham khảo.',
          'Generated by AI from the employee and manager reviews, for reference only.') + '</div>' +
      '</section>';
  }

  // Bấm mới chạy (§14): mở popup, chạy xong mới hiện nội dung
  function openSummary(p) {
    injectCss();
    U().dialog({
      title: 'AI Summary',
      className: 'yer-ai-dlg',
      html: '<div class="yer-ai-hd"><span class="yer-ai-hd-lbl">' + L('Nhân viên:', 'Employee:') + '</span> <strong>' + esc(p.emp.name) +
          '</strong> <span class="er-login">(' + esc(p.emp.login) + ')</span></div>' +
        '<div id="yer-ai-body" class="yer-ai-body"><div class="yer-ai-loading"><i class="bx bx-loader-alt bx-spin"></i>' +
        L('Đang tổng hợp đánh giá…', 'Summarising the review…') + '</div></div>',
      buttons: [{ label: L('Đóng', 'Close'), variant: 'default' }]
    });
    setTimeout(function () {
      var body = document.getElementById('yer-ai-body');
      if (body) body.innerHTML = summaryHtml(p);
    }, 700);
  }

  /* ── Trợ lý viết nhận xét (chỉ QLTT) ─────────────────────
     ctx: { p, kind: 'what'|'dev'|'how'|'overall', current, max, goals: { what: [{ title, score }], dev: [...] },
            how: [{ name, score }], overall: số điểm toàn diện, onInsert(text) } */
  var KIND = {
    what: ['Nhận xét nhóm Mục tiêu công việc', 'Work goals comment'],
    dev: ['Nhận xét nhóm Mục tiêu phát triển', 'Development goals comment'],
    how: ['Nhận xét nhóm Mục tiêu hành vi', 'Behavioral goals comment'],
    overall: ['Nhận xét toàn diện', 'Overall comment']
  };
  function label(v) { return v == null ? '' : Y().scoreLabel(Number(v), lg()).toLowerCase(); }
  function scored(list) {
    return (list || []).filter(function (g) { return g.score != null; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  function goalDraft(ctx, kind) {
    var name = ctx.p.emp.name;
    var list = (ctx.goals || {})[kind] || [];
    var s = scored(list);
    var group = kind === 'what' ? L('mục tiêu công việc', 'work goals') : L('mục tiêu phát triển', 'development goals');
    if (!list.length) return L('Nhân viên chưa có ' + group + ' nào để nhận xét.', 'There are no ' + group + ' to comment on.');
    if (!s.length) {
      return L(name + ' thực hiện ' + list.length + ' ' + group + ' trong năm. Bạn hãy chấm điểm từng mục tiêu để trợ lý viết nhận xét sát hơn.',
        name + ' worked on ' + list.length + ' ' + group + ' this year. Rate each goal so the assistant can be more specific.');
    }
    var top = s[0], low = s[s.length - 1];
    var out = [L('Trong năm, ' + name + ' thực hiện ' + list.length + ' ' + group + '.', 'This year ' + name + ' worked on ' + list.length + ' ' + group + '.')];
    out.push(L('Nổi bật là mục tiêu “' + top.title + '” ở mức ' + label(top.score) + '.',
      'The strongest is “' + top.title + '”, rated ' + label(top.score) + '.'));
    if (low !== top && low.score <= 3) {
      out.push(kind === 'what'
        ? L('Mục tiêu “' + low.title + '” mới ở mức ' + label(low.score) + ', cần tập trung cải thiện tiến độ và chất lượng đầu ra trong năm tới.',
            '“' + low.title + '” is at ' + label(low.score) + '; progress and output quality need attention next year.')
        : L('Mục tiêu “' + low.title + '” mới ở mức ' + label(low.score) + ', nên tiếp tục đầu tư thời gian học tập và áp dụng vào công việc.',
            '“' + low.title + '” is at ' + label(low.score) + '; keep investing time to learn and apply it at work.'));
    }
    return out.join(' ');
  }

  function howDraft(ctx) {
    var s = scored(ctx.how);
    var name = ctx.p.emp.name;
    if (!s.length) return L('Bạn hãy chấm điểm năm giá trị cốt lõi để trợ lý viết nhận xét sát hơn.', 'Rate the five core values so the assistant can be more specific.');
    var good = s.filter(function (v) { return v.score >= 4; }).slice(0, 2).map(function (v) { return v.name; });
    var weak = s.filter(function (v) { return v.score <= 3; }).slice(-1).map(function (v) { return v.name; });
    var out = [];
    out.push(good.length
      ? L(name + ' thể hiện tốt giá trị ' + good.join(' và ') + ' trong công việc hằng ngày.', name + ' shows ' + good.join(' and ') + ' well in daily work.')
      : L(name + ' thể hiện các giá trị cốt lõi ở mức ' + label(s[0].score) + '.', name + ' shows the core values at ' + label(s[0].score) + '.'));
    if (weak.length) out.push(L('Cần chú ý hơn tới ' + weak[0] + ', chủ động hơn trong phối hợp và chia sẻ với các nhóm liên quan.',
      'More attention is needed on ' + weak[0] + ', with more proactive collaboration with related teams.'));
    return out.join(' ');
  }

  function overallDraft(ctx) {
    var name = ctx.p.emp.name;
    var out = [];
    out.push(ctx.overall != null
      ? L('Nhìn chung, ' + name + ' đạt mức ' + label(ctx.overall) + ' trong kỳ đánh giá cuối năm 2026.', 'Overall, ' + name + ' is rated ' + label(ctx.overall) + ' for the 2026 year-end review.')
      : L('Nhìn chung, ' + name + ' đã hoàn thành các mục tiêu chính của năm 2026.', 'Overall, ' + name + ' delivered the main goals for 2026.'));
    var w = scored((ctx.goals || {}).what);
    if (w.length) out.push(L('Kết quả nổi bật là “' + w[0].title + '”.', 'The standout result is “' + w[0].title + '”.'));
    var d = scored((ctx.goals || {}).dev);
    if (d.length) out.push(L('Về phát triển, nhân viên đã tiến bộ ở “' + d[0].title + '”.', 'On development, progress shows in “' + d[0].title + '”.'));
    out.push(L('Định hướng năm tới: duy trì điểm mạnh hiện có và đặt mục tiêu phát triển cụ thể, đo lường được.',
      'Next year: keep the current strengths and set specific, measurable development goals.'));
    return out.join(' ');
  }

  function draftFor(ctx) {
    if (ctx.kind === 'how') return howDraft(ctx);
    if (ctx.kind === 'overall') return overallDraft(ctx);
    return goalDraft(ctx, ctx.kind);
  }

  var DEV_TIP = {
    what: ['Gợi ý phát triển: chia mục tiêu lớn thành các mốc theo quý và cập nhật tiến độ đều đặn với Quản lý.',
           'Development tip: split big goals into quarterly milestones and share progress regularly.'],
    dev: ['Gợi ý phát triển: chọn một kỹ năng trọng tâm, áp dụng vào một dự án thật và chia sẻ lại cho nhóm.',
          'Development tip: pick one focus skill, apply it to a real project and share it with the team.'],
    how: ['Gợi ý phát triển: chủ động nhận thêm vai trò phối hợp giữa các nhóm để lan tỏa giá trị cốt lõi.',
          'Development tip: take on more cross-team coordination to spread the core values.'],
    overall: ['Gợi ý phát triển: thống nhất với nhân viên 2 đến 3 mục tiêu phát triển cho năm tới ngay từ đầu kỳ.',
              'Development tip: agree 2 to 3 development goals for next year with the employee at the start of the cycle.']
  };

  // Các chế độ viết lại. Có nội dung hiện tại thì dựa trên nội dung đó, chưa có thì dựa trên bản nháp từ điểm đã chấm.
  function rewrite(ctx, mode) {
    var base = sentences(ctx.current).join(' ') || draftFor(ctx);
    var parts = sentences(base);
    if (mode === 'draft') return draftFor(ctx);
    if (mode === 'short') return parts.slice(0, 2).join(' ');
    if (mode === 'develop') {
      var tip = DEV_TIP[ctx.kind] || DEV_TIP.overall;
      return base + ' ' + L(tip[0], tip[1]);
    }
    // polish: viết lại rõ ràng, đủ ba ý kết quả, điểm mạnh, cần cải thiện
    var fresh = sentences(draftFor(ctx));
    var result = parts[0] || fresh[0] || '';
    var strength = fresh[1] || parts[1] || '';
    var improve = parts.slice(2).join(' ') || fresh.slice(2).join(' ') ||
      L('Cần tiếp tục duy trì và nâng cao chất lượng công việc trong năm tới.', 'Keep sustaining and raising work quality next year.');
    return [L('Kết quả: ', 'Results: ') + result, strength ? L('Điểm mạnh: ', 'Strengths: ') + strength : '',
      L('Cần cải thiện: ', 'To improve: ') + improve].filter(Boolean).join(' ');
  }

  var MODES = [
    { id: 'draft', vi: 'Viết bản nháp từ điểm đã chấm', en: 'Draft from my ratings' },
    { id: 'polish', vi: 'Viết rõ ràng, đầy đủ hơn', en: 'Clearer and more complete' },
    { id: 'short', vi: 'Ngắn gọn hơn', en: 'Shorter' },
    { id: 'develop', vi: 'Thêm gợi ý phát triển', en: 'Add a development tip' }
  ];

  function closeWriter() {
    var d = document.getElementById('yer-ai-writer');
    if (d) d.remove();
  }

  function openWriter(ctx) {
    injectCss();
    closeWriter();
    var max = ctx.max || 1000;
    var kind = KIND[ctx.kind] || KIND.overall;
    var node = document.createElement('div');
    node.id = 'yer-ai-writer';
    node.className = 'yer-aw-ov';
    node.innerHTML =
      '<aside class="yer-aw" role="dialog" aria-modal="true" aria-label="' + esc(L('Trợ lý viết nhận xét', 'Comment assistant')) + '">' +
        '<div class="yer-aw-hd">' + mascot() + '<div class="yer-aw-ti">' + L('Trợ lý viết nhận xét', 'Comment assistant') +
          '<span>' + esc(L(kind[0], kind[1])) + ' - ' + esc(ctx.p.emp.name) + '</span></div>' +
          '<button type="button" class="yer-aw-x" aria-label="' + esc(L('Đóng', 'Close')) + '"><i class="bx bx-x"></i></button></div>' +
        '<div class="yer-aw-bd">' +
          (plain(ctx.current)
            ? '<div class="yer-aw-lbl">' + L('Nội dung hiện tại', 'Current text') + '</div><div class="yer-aw-cur">' + esc(plain(ctx.current)) + '</div>'
            : '<div class="yer-aw-empty">' + L('Ô nhận xét đang trống. Chọn một cách viết bên dưới, trợ lý dựa vào điểm bạn đã chấm và mục tiêu của nhân viên.',
                'The comment is empty. Pick an option below; the assistant uses your ratings and the employee\'s goals.') + '</div>') +
          '<div class="yer-aw-lbl">' + L('Bạn muốn trợ lý làm gì?', 'What should the assistant do?') + '</div>' +
          '<div class="yer-aw-modes">' + MODES.map(function (m) {
            return '<button type="button" class="yer-aw-mode" data-mode="' + m.id + '"><i class="bx bxs-magic-wand"></i>' + esc(L(m.vi, m.en)) + '</button>';
          }).join('') + '</div>' +
          '<div class="yer-aw-lbl">' + L('Gợi ý của AI', 'AI suggestion') + '</div>' +
          '<div class="yer-aw-out" id="yer-aw-out"><div class="yer-aw-hint">' + L('Chọn một cách viết ở trên để tạo gợi ý.', 'Pick an option above to get a suggestion.') + '</div></div>' +
          '<div class="yer-aw-note"><i class="bx bx-info-circle"></i>' +
            L('AI chỉ gợi ý. Nội dung chỉ vào ô nhận xét khi bạn bấm Chèn; bạn sửa được gợi ý trước khi chèn và nên kiểm tra lại trước khi gửi.',
              'AI only suggests. Nothing goes into the comment until you press Insert; you can edit the suggestion first and should review it before submitting.') +
          '</div>' +
        '</div>' +
        '<div class="yer-aw-ft">' +
          '<button type="button" class="pms-btn pms-btn-quiet" data-aw="cancel">' + L('Hủy', 'Cancel') + '</button>' +
          '<button type="button" class="pms-btn pms-btn-default" data-aw="insert" disabled><i class="bx bx-down-arrow-alt"></i>' +
            L('Chèn vào ô nhận xét', 'Insert into comment') + '</button>' +
        '</div>' +
      '</aside>';
    document.body.appendChild(node);

    var out = node.querySelector('#yer-aw-out');
    var insert = node.querySelector('[data-aw="insert"]');
    var box = null;
    function onKey(e) { if (e.key === 'Escape') done(); }
    function done() { document.removeEventListener('keydown', onKey); closeWriter(); }
    document.addEventListener('keydown', onKey);
    node.addEventListener('click', function (e) { if (e.target === node) done(); });
    node.querySelector('.yer-aw-x').addEventListener('click', done);
    node.querySelector('[data-aw="cancel"]').addEventListener('click', done);
    node.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        node.querySelectorAll('[data-mode]').forEach(function (x) { x.classList.toggle('on', x === b); });
        insert.disabled = true;
        out.innerHTML = '<div class="yer-ai-loading"><i class="bx bx-loader-alt bx-spin"></i>' + L('Đang viết gợi ý…', 'Writing a suggestion…') + '</div>';
        setTimeout(function () {
          var text = rewrite(ctx, b.dataset.mode).slice(0, max);
          out.innerHTML = '<textarea class="yer-aw-text" maxlength="' + max + '" aria-label="' + esc(L('Gợi ý của AI', 'AI suggestion')) + '">' +
            esc(text) + '</textarea><div class="yer-aw-count">' + text.length + ' / ' + max + '</div>';
          box = out.querySelector('textarea');
          box.addEventListener('input', function () {
            out.querySelector('.yer-aw-count').textContent = box.value.length + ' / ' + max;
            insert.disabled = !box.value.trim();
          });
          insert.disabled = !text.trim();
        }, 600);
      });
    });
    insert.addEventListener('click', function () {
      if (!box) return;
      var text = box.value.trim();
      done();
      if (ctx.onInsert) ctx.onInsert(text);
    });
    var first = node.querySelector('[data-mode]');
    if (first) first.focus();
  }

  /* ── CSS ─────────────────────────────────────────────── */
  function injectCss() {
    if (document.getElementById('yer-ai-css')) return;
    var st = document.createElement('style');
    st.id = 'yer-ai-css';
    st.textContent =
      // Popup AI Summary
      // Cao tối đa bằng màn hình: tiêu đề và nút Đóng đứng yên, phần nội dung cuộn (chốt 02/10/2026)
      '.yer-ai-dlg{width:min(640px,calc(100vw - 32px));max-width:none;max-height:calc(100vh - 32px);display:flex;flex-direction:column}' +
      '.yer-ai-dlg .pms-dlg-bd{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;padding-bottom:0}' +
      '.yer-ai-dlg .pms-dlg-tx{flex:1 1 auto;min-height:0;display:flex;flex-direction:column}' +
      '.yer-ai-dlg .pms-dlg-ft{flex:none}' +
      '.yer-ai-hd{padding-bottom:12px;margin-bottom:14px;border-bottom:1px solid var(--z200);font-size:13.5px;color:var(--z900)}' +
      '.yer-ai-hd-lbl{color:var(--z600)}' +
      '.dialog-ai-summary-mascot{width:20px;height:20px;object-fit:contain;flex:none}' +
      '.yer-ai-body{min-height:80px;flex:1 1 auto;overflow-y:auto;margin-right:-10px;padding:0 10px 18px 0}' +
      '.yer-ai-loading{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--z600)}' +
      '.yer-ai-loading i{font-size:16px;color:var(--brand)}' +
      '.yer-ai-sec-hd{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--z500);margin-bottom:8px}' +
      '.yer-ai-scores{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}' +
      // Thẻ điểm gọn: tên vai và domain bên trái, điểm cỡ vừa bên phải (chốt 02/10/2026)
      '.yer-ai-sc{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 9px;border:1px solid var(--z200);' +
        'border-radius:var(--rsm);background:var(--z50);min-width:0}' +
      '.yer-ai-sc-who{min-width:0}' +
      '.yer-ai-sc-lbl{font-size:11.5px;font-weight:600;color:var(--z700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.yer-ai-sc-dom{font-size:11px;color:var(--z600);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.yer-ai-sc-num{flex:none;text-align:right}' +
      '.yer-ai-sc-val{font-size:15px;font-weight:600;color:var(--z900);line-height:1.2}' +
      '.yer-ai-sc-sub{font-size:10.5px;color:var(--z600);white-space:nowrap}' +
      '.yer-ai-flags{display:flex;flex-direction:column;gap:6px;margin-top:10px}' +
      '.yer-ai-flag{display:flex;gap:7px;align-items:flex-start;padding:8px 11px;border:1px solid var(--z200);border-radius:var(--rsm);' +
        'background:var(--z0);font-size:12.5px;line-height:1.5;color:var(--z700)}' +
      '.yer-ai-flag i{flex:none;font-size:15px;margin-top:1px;color:var(--z500)}' +
      '.yer-ai-flag.warn{background:var(--warn-bg);border-color:var(--warn-bd);color:var(--z800)}' +
      '.yer-ai-flag.warn i{color:var(--warn)}' +
      '.yer-ai-box{margin-top:16px;padding:12px 14px;border:1px solid var(--brand-ring);border-radius:var(--r);background:var(--z0)}' +
      '.yer-ai-box-hd{display:flex;align-items:center;gap:7px;padding-bottom:10px;margin-bottom:10px;border-bottom:1px solid var(--z200);' +
        'font-size:13px;font-weight:700;color:var(--z900)}' +
      '.yer-ai-part + .yer-ai-part{margin-top:14px}' +
      '.yer-ai-part-hd{display:flex;align-items:center;gap:5px;margin-bottom:6px;font-size:12.5px;font-weight:600;color:var(--brand)}' +
      '.yer-ai-part-hd i{font-size:14px}' +
      '.yer-ai-list{list-style:disc;margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px}' +
      '.yer-ai-list li{font-size:13px;line-height:1.55;color:var(--z700)}' +
      '.yer-ai-list li::marker{color:var(--z400)}' +
      '.yer-ai-empty{font-size:12.5px;color:var(--z500);font-style:italic}' +
      '.yer-ai-note{margin-top:14px;padding-top:10px;border-top:1px solid var(--z200);font-size:11.5px;color:var(--z600)}' +
      '@media(max-width:560px){.yer-ai-scores{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
      // Trợ lý viết nhận xét: panel trượt từ phải (§14)
      '.yer-aw-ov{position:fixed;inset:0;z-index:600;background:rgba(9,9,11,.25);display:flex;justify-content:flex-end}' +
      '.yer-aw{width:min(440px,100vw);height:100%;background:var(--z0);border-left:1px solid var(--z200);box-shadow:var(--sh-lg);' +
        'display:flex;flex-direction:column;animation:yerAwIn .18s ease}' +
      '@keyframes yerAwIn{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}' +
      '.yer-aw-hd{display:flex;align-items:center;gap:9px;padding:14px 16px;border-bottom:1px solid var(--z200)}' +
      '.yer-aw-ti{flex:1;min-width:0;font-size:14px;font-weight:600;color:var(--z900)}' +
      '.yer-aw-ti span{display:block;font-size:11.5px;font-weight:400;color:var(--z600);margin-top:1px}' +
      '.yer-aw-x{border:0;background:transparent;font-size:20px;color:var(--z500);cursor:pointer;border-radius:var(--rxs);width:28px;height:28px}' +
      '.yer-aw-x:hover{background:var(--z100);color:var(--z900)}' +
      '.yer-aw-bd{flex:1;overflow-y:auto;padding:14px 16px}' +
      '.yer-aw-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--z500);margin:14px 0 6px}' +
      '.yer-aw-lbl:first-child{margin-top:0}' +
      '.yer-aw-cur{padding:9px 11px;border:1px solid var(--z200);border-radius:var(--rsm);background:var(--z50);font-size:12.5px;color:var(--z700);' +
        'line-height:1.55;max-height:120px;overflow-y:auto}' +
      '.yer-aw-empty{font-size:12.5px;color:var(--z600);line-height:1.55}' +
      '.yer-aw-modes{display:flex;flex-wrap:wrap;gap:6px}' +
      '.yer-aw-mode{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border:1px solid var(--z200);border-radius:50px;' +
        'background:var(--z0);font-family:inherit;font-size:12px;color:var(--z800);cursor:pointer;transition:var(--t)}' +
      '.yer-aw-mode i{font-size:13px;color:var(--brand)}' +
      '.yer-aw-mode:hover{border-color:var(--brand-ring);background:var(--brand-muted)}' +
      '.yer-aw-mode.on{border-color:var(--brand);background:var(--brand-muted);color:var(--brand);font-weight:600}' +
      '.yer-aw-out{min-height:90px}' +
      '.yer-aw-hint{font-size:12.5px;color:var(--z500)}' +
      '.yer-aw-text{width:100%;min-height:150px;border:1px solid var(--brand-ring);border-radius:var(--rsm);padding:9px 11px;font-family:inherit;' +
        'font-size:13px;line-height:1.6;color:var(--z900);resize:vertical;background:var(--z0)}' +
      '.yer-aw-text:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 2px var(--brand-ring)}' +
      '.yer-aw-count{text-align:right;font-size:11.5px;color:var(--z600);margin-top:3px}' +
      '.yer-aw-note{display:flex;gap:6px;align-items:flex-start;margin-top:14px;font-size:11.5px;color:var(--z600);line-height:1.5}' +
      '.yer-aw-note i{font-size:14px;color:var(--z500);margin-top:1px}' +
      '.yer-aw-ft{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--z200)}' +
      '.yer-aw-ft .pms-btn:disabled{opacity:.5;cursor:not-allowed}';
    document.head.appendChild(st);
  }

  window.PMSYerAi = { summaryHtml: summaryHtml, openSummary: openSummary, openWriter: openWriter, rewrite: rewrite, draftFor: draftFor };
})();
