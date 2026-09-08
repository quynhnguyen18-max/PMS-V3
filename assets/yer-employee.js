/* ═══════════════════════════════════════════════════════════
   YER Employee — nội dung tab End-Year Review của màn Nhân viên
   Bám đúng ngôn ngữ thiết kế của tab Mid-Year Review trong E-01:
   stepper-card, info-note, rv-section + rv-grid, section-cmt,
   overall-card, submit-banner. Chỉ khác ở các khối riêng của YER.
   Spec: YER-SPEC.md
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var Y, S, I, U;
  function lg(){ return I.lang(); }
  function L(vi, en){ return lg() === 'en' ? en : vi; }
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c];
    });
  }
  function el(id){ return document.getElementById(id); }

  var TYPE = {
    what:{ vi:'Mục tiêu công việc', en:'Work goals', icon:'bx-target-lock' },
    dev:{ vi:'Mục tiêu phát triển', en:'Development goals', icon:'bx-line-chart' },
    how:{ vi:'Mục tiêu hành vi', en:'Behavioral goals', icon:'bx-heart' }
  };
  var CORE_VALUES = [
    { vi:'Tập trung vào khách hàng', en:'Customer focus', lines:[
      'Thấu hiểu khách hàng: Chúng tôi chủ động lắng nghe khách hàng và thấu hiểu các nhu cầu của họ.',
      'Nghĩ về khách hàng trước tiên: Chúng tôi cân nhắc góc nhìn của khách hàng trước tất cả góc nhìn khác trong quá trình ra quyết định.',
      'Cung cấp trải nghiệm khách hàng vượt trội: Chúng tôi nỗ lực hết mình để tạo ra trải nghiệm vượt xa kỳ vọng hợp lý của khách hàng.'] },
    { vi:'Đổi mới sáng tạo', en:'Innovation', lines:[
      'Chúng tôi được khuyến khích xây dựng tư duy khác biệt.',
      'Chúng tôi luôn hướng đến những sự thay đổi tích cực.',
      'Chúng tôi luôn trân trọng tất cả những ý tưởng, vì những thành công lớn đều khởi nguồn từ những ý tưởng nhỏ.'] },
    { vi:'Tinh thần đồng đội', en:'Teamwork', lines:[
      'Chúng tôi làm việc hướng về một mục tiêu chung.',
      'Chúng tôi tôn trọng đồng nghiệp và đánh giá cao tất cả những đóng góp từ họ.',
      'Chúng tôi nỗ lực thấu hiểu để hỗ trợ nhau tốt nhất.'] },
    { vi:'Thực thi xuất sắc', en:'Excellence', lines:[
      'Chúng tôi được trao quyền và luôn nỗ lực hết mình để vươn xa hơn, khám phá ra những tiềm năng của bản thân.',
      'Chúng tôi làm việc hiệu quả.',
      'Chúng tôi làm việc hết mình với thái độ trách nhiệm và tinh thần lãnh đạo tích cực.'] },
    { vi:'Tinh thần học hỏi không ngừng', en:'Constant learning', lines:[
      'Chúng tôi luôn chủ động nắm bắt cơ hội phát triển.',
      'Chúng tôi dám đối diện với thất bại và lựa chọn thái độ học hỏi từ những sai lầm.',
      'Chúng tôi mở rộng tầm nhìn để đón nhận những ý tưởng khác biệt.'] }
  ];

  var PRIO = { h:{vi:'Cao',en:'High',cls:'prio-h'}, m:{vi:'Trung bình',en:'Medium',cls:'prio-m'}, l:{vi:'Thấp',en:'Low',cls:'prio-l'} };

  var draft = null;

  /* ── dữ liệu ─────────────────────────────────────────── */
  function prof(){ var s = S.session(); return Y.profile(s.emp, s.date); }
  function actsOf(){ return S.acts(S.session().emp) || {}; }
  function deletedIds(){ return ((actsOf().deletedGoals || {}).ids) || []; }
  function approvedGoals(p, type){
    return (p.emp.goals||[]).filter(function(g){
      return g.type === type && g.status === 'approved' && deletedIds().indexOf(g.id) < 0;
    });
  }
  function loadDraft(){
    var d = actsOf().selfDraft;
    draft = d ? JSON.parse(JSON.stringify(d)) : { goalScores:{}, howScores:{}, comments:{}, overall:{} };
  }
  function saveDraft(silent){
    S.setAct(S.session().emp, 'selfDraft', draft);
    U.dirty.clear();
    if(!silent) U.toast(L('Đã lưu nháp','Draft saved'));
  }

  /* ── mảnh dùng lại ───────────────────────────────────── */
  function editorHtml(id, placeholder, max, value, counterId, readonly){
    if(readonly){
      return '<div class="ev-editor-wrap yer-ed-ro"><div class="ev-content" id="' + id + '">' +
        (value ? esc(value) : '<span class="yer-ed-empty">—</span>') + '</div></div>';
    }
    return '<div class="ev-editor-wrap"><div class="ev-toolbar" onmousedown="event.preventDefault()">' +
      '<select class="ev-tb-sel" onchange="edFmt(this)"><option value="p">Normal</option><option value="h3">' +
        L('Tiêu đề','Heading') + '</option></select><span class="ev-tb-sep"></span>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'bold\')" title="Bold"><span style="font-weight:700;font-size:12px">B</span></button>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'italic\')" title="Italic"><span style="font-style:italic;font-size:12px">I</span></button>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'underline\')" title="Underline"><span style="text-decoration:underline;font-size:12px">U</span></button>' +
      '<span class="ev-tb-sep"></span>' +
      '<button class="ev-tb-btn" onclick="edCmd(\'insertUnorderedList\')" title="List"><i class="bx bx-list-ul" style="font-size:14px"></i></button>' +
      '</div><div class="ev-content" contenteditable="true" data-placeholder="' + esc(placeholder) + '" id="' + id +
        '" oninput="edCount(this,\'' + counterId + '\',' + max + ')">' + esc(value||'') + '</div></div>' +
      '<div class="char-ct" id="' + counterId + '">' + String(value||'').length + ' / ' + max + '</div>';
  }
  /* ── quy trình và thời gian ──────────────────────────── */
  var EMP_STEPS = ['self', 'lm', 'lm2', 'hod', 'publish'];   // nhân viên không cần thấy bước nội bộ của HR

  function stepper(){
    var s = S.session();
    var required = { self:1, lm:1, lm2:1, hod:1 };
    var steps = window.PMS_YER_TIMELINE.steps.filter(function(st){ return EMP_STEPS.indexOf(st.key) >= 0; });
    return '<div class="stepper-card yer-stepper"><div class="stepper-hd"><i class="bx bx-directions"></i>' +
      L('Quy trình và Thời gian đánh giá cuối năm 2026','Year-End Review 2026 process and timeline') + '</div>' +
      '<div class="yer-track">' + steps.map(function(st){
        var state = Y.stepState(st.key, s.date);
        var cls = state === 'open' ? ' current' : state === 'closed' ? ' done' : '';
        var range = st.from === st.to ? Y.fmt(st.from, lg()) : Y.fmt(st.from, lg()) + ' – ' + Y.fmt(st.to, lg());
        return '<div class="yer-step' + cls + '">' +
          '<div class="yer-step-name">' + esc(lg()==='en'?st.en:st.vi) + '</div>' +
          '<div class="yer-step-date">' + esc(range) + '</div>' +
          (required[st.key] ? '<span class="step-badge required">' + L('Bắt buộc','Required') + '</span>' : '') +
        '</div>';
      }).join('') + '</div></div>';
  }

  /* ── bàn giao từ Quản lý cũ (Enh 9) ──────────────────── */
  function wrapupBlock(p){
    var w = p.wrapup, sc = w.sections || {};
    var rows = [['achievements', L('Kết quả nổi bật','Key achievements')],
                ['strengths', L('Điểm mạnh','Strengths')],
                ['improvements', L('Cần cải thiện','Areas for improvement')],
                ['notes', L('Ghi chú thêm','Additional notes')]];
    return '<div class="yer-coll open" id="yer-wrap"><button type="button" class="yer-coll-hd" data-toggle="yer-wrap">' +
      '<i class="bx bx-transfer-alt"></i><span><span class="yer-coll-ti">' +
        L('Bàn giao từ Quản lý trước','Wrap-up from previous manager') + '</span> <span class="yer-coll-sub">- ' +
        esc(w.by ? w.by.name + ' (' + w.by.login + ')' : '') + ' - ' + esc(Y.fmt(w.at, lg())) + '</span></span>' +
      '<i class="bx bx-chevron-down chev"></i></button><div class="yer-coll-bd">' +
      rows.map(function(r){
        if(!sc[r[0]]) return '';
        return '<div class="yer-wrap-sec"><div class="yer-wrap-lbl">' + esc(r[1]) + '</div>' +
          '<div class="yer-wrap-tx">' + esc(sc[r[0]]) + '</div></div>';
      }).join('') + '</div></div>';
  }

  /* ── bảng mục tiêu ───────────────────────────────────── */
  function goalSection(p, type, editable){
    var list = approvedGoals(p, type);
    if(!list.length) return '';
    var changed = p.goalChangedAfterMyr || [];
    var lmOk = p.lm && !p.lm.synced;
    var rows = list.map(function(g){
      var selfScore = p.self ? (p.self.goalScores||{})[g.id] : draft.goalScores[g.id];
      var lmScore = lmOk ? (p.lm.goalScores||{})[g.id] : null;
      var prio = g.prio ? PRIO[g.prio] : null;
      return '<tr><td><div class="g-name">' + esc(g.title) + '</div>' +
          (changed.indexOf(g.id) >= 0
            ? '<div class="g-meta" style="margin-top:5px"><span class="badge b-muted"><i class="bx bx-history"></i>' +
              L('Đã thay đổi sau Mid-Year','Changed after Mid-Year') + '</span></div>' : '') + '</td>' +
        '<td><div class="g-result">' + esc(g.result) + '</div></td>' +
        (type === 'what' ? '<td><div class="g-meta">' + (prio ? '<span class="prio ' + prio.cls + '">' +
            esc(lg()==='en'?prio.en:prio.vi) + '</span>' : '—') + '</div></td>' : '') +
        '<td><div class="g-meta">' + esc(g.s + ' – ' + g.e) + '</div></td>' +
        '<td class="sc-cell"><div data-rt="goal:' + g.id + '" data-val="' + (selfScore==null?'':selfScore) +
          '" data-ro="' + (editable?'0':'1') + '"></div></td>' +
        '<td class="ql-cell">' + (lmScore != null
          ? '<div data-rt="lmgoal:' + g.id + '" data-val="' + lmScore + '" data-ro="1"></div>'
          : '<div class="ql-dash">—</div>') + '</td></tr>';
    }).join('');

    return '<div class="rv-section"><div class="rv-section-hd"><i class="bx ' + TYPE[type].icon + '"></i>' +
      '<span class="rv-type">' + esc(lg()==='en'?TYPE[type].en:TYPE[type].vi) + '</span></div>' +
      '<div class="rv-table-wrap"><table class="rv-grid"><thead><tr>' +
        '<th style="width:26%">' + L('Tên mục tiêu','Goal') + '</th>' +
        '<th style="width:' + (type==='what'?'34%':'43%') + '">' + L('Kết quả cần đạt','Expected result') + '</th>' +
        (type === 'what' ? '<th style="width:9%">' + L('Ưu tiên','Priority') + '</th>' : '') +
        '<th style="width:11%">' + L('Thời gian','Timeline') + '</th>' +
        '<th class="th-c" style="width:10%">' + L('Điểm NV','Employee') + '</th>' +
        '<th class="th-c th-ql" style="width:10%">' + L('Điểm QLTT','Manager') + '</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      commentPair(p, type, editable) + '</div>';
  }

  function howSection(p, editable){
    var lmOk = p.lm && !p.lm.synced;
    var rows = CORE_VALUES.map(function(cv, i){
      var selfScore = p.self ? (p.self.howScores||[])[i] : draft.howScores[i];
      var lmScore = lmOk ? (p.lm.howScores||[])[i] : null;
      return '<tr><td><div class="g-name">' + esc(lg()==='en'?cv.en:cv.vi) + '</div></td>' +
        '<td><div class="g-result yer-cv-desc">' + cv.lines.map(function(t){ return esc(t); }).join('<br>') + '</div></td>' +
        '<td class="sc-cell"><div data-rt="how:' + i + '" data-val="' + (selfScore==null?'':selfScore) +
          '" data-ro="' + (editable?'0':'1') + '"></div></td>' +
        '<td class="ql-cell">' + (lmScore != null
          ? '<div data-rt="lmhow:' + i + '" data-val="' + lmScore + '" data-ro="1"></div>'
          : '<div class="ql-dash">—</div>') + '</td></tr>';
    }).join('');
    return '<div class="rv-section"><div class="rv-section-hd"><i class="bx bx-heart"></i>' +
      '<span class="rv-type">' + esc(lg()==='en'?TYPE.how.en:TYPE.how.vi) + '</span></div>' +
      '<div class="rv-table-wrap"><table class="rv-grid" style="min-width:600px"><thead><tr>' +
        '<th style="width:26%">' + L('Giá trị cốt lõi','Core value') + '</th>' +
        '<th>' + L('Mô tả','Description') + '</th>' +
        '<th class="th-c" style="width:12%">' + L('Điểm NV','Employee') + '</th>' +
        '<th class="th-c th-ql" style="width:12%">' + L('Điểm QLTT','Manager') + '</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      commentPair(p, 'how', editable) + '</div>';
  }

  function commentPair(p, type, editable){
    var mine = p.self ? (p.self.comments||{})[type] : draft.comments[type];
    var lmTxt = (p.lm && !p.lm.synced) ? (p.lm.comments||{})[type] : null;
    var typeName = (lg()==='en'?TYPE[type].en:TYPE[type].vi).toLowerCase();

    var left = '<div class="scmt-panel' + (editable ? ' editable-panel' : ' yer-ro') + '">' +
      '<div class="scmt-hd"><i class="bx bx-user"></i>' + L('Đánh giá của Nhân viên','Employee assessment') +
      (editable ? '<span class="badge b-action field-state">' + L('Bắt buộc','Required') + '</span>' : '') + '</div>' +
      editorHtml('yer-cmt-' + type,
        L('Nhận xét chung về ' + typeName + '…', 'Overall comment on ' + typeName + '…'),
        500, mine, 'yer-cc-' + type, !editable) + '</div>';

    var right;
    if(lmTxt){
      right = '<div class="scmt-panel yer-ro"><div class="scmt-hd"><i class="bx bx-user-check"></i>' +
        L('Đánh giá của Quản lý trực tiếp','Line manager assessment') + '</div>' +
        editorHtml('yer-lmcmt-' + type, '', 500, lmTxt, 'yer-lmcc-' + type, true) + '</div>';
    } else {
      right = '<div class="scmt-panel scmt-locked"><div class="scmt-hd"><i class="bx bx-user-check"></i>' +
        L('Đánh giá của Quản lý trực tiếp','Line manager assessment') + '</div>' +
        '<div class="scmt-locked-ph"><i class="bx bx-lock-alt"></i>' +
        (p.lm && p.lm.synced
          ? L('Quản lý không gửi nhận xét trong kỳ này','Your manager did not leave a comment this cycle')
          : p.self ? L('Quản lý sẽ nhận xét trong bước đánh giá của Quản lý','Your manager comments during the manager review step')
                   : L('Quản lý sẽ nhận xét sau khi bạn gửi','Your manager will comment after you submit')) + '</div></div>';
    }
    return '<div class="section-cmt">' + left + right + '</div>';
  }

  /* ── đánh giá toàn diện ──────────────────────────────── */
  function overallCard(p, editable){
    var mineScore = p.self && p.self.overall ? p.self.overall.score : (draft.overall||{}).score;
    var mineCmt = p.self && p.self.overall ? p.self.overall.comment : (draft.overall||{}).comment;
    var left = '<div class="overall-panel' + (editable ? ' editable-panel' : '') + '">' +
      '<div class="op-hd"><i class="bx bx-user"></i>' + L('Nhân viên tự đánh giá','Employee self assessment') +
        (editable ? '<span class="badge b-action field-state">' + L('Bắt buộc','Required') + '</span>' : '') + '</div>' +
      '<div class="op-score-row"><span class="op-score-lbl">' + L('Điểm toàn diện:','Overall rating:') + '</span>' +
        '<span data-rt="overall" data-val="' + (mineScore==null?'':mineScore) + '" data-ro="' + (editable?'0':'1') +
        '" data-half="1"></span></div>' +
      (editable
        ? '<label class="op-flbl">' + L('Đánh giá toàn diện của nhân viên','Employee overall assessment') + '</label>' +
          editorHtml('yer-op-cmt', L('Nhìn chung, tôi đã hoàn thành…','Overall, I have completed…'), 1000, mineCmt, 'yer-cc-op')
        : '<label class="op-flbl">' + L('Đánh giá toàn diện của nhân viên','Employee overall assessment') + '</label>' +
          editorHtml('yer-op-cmt-ro', '', 1000, mineCmt, 'yer-cc-op-ro', true)) +
      '</div>';

    var lmCmt = (p.lm && !p.lm.synced && p.lm.overall) ? p.lm.overall.comment : null;
    var right = '<div class="overall-panel' + (lmCmt ? '' : ' locked') + '">' +
      '<div class="op-hd"><i class="bx bx-user-check"></i>' + L('Quản lý trực tiếp đánh giá','Line manager assessment') + '</div>' +
      '<div class="op-score-row"><span class="op-score-lbl">' + L('Điểm toàn diện:','Overall rating:') + '</span>' +
        '<span class="yer-hidden-score"><span class="yer-hs-box">—</span>' +
        '<span class="badge b-muted">' + L('Chưa công bố','Not published') + '</span></span></div>' +
      (lmCmt
        ? '<label class="op-flbl">' + L('Đánh giá toàn diện của Quản lý','Manager overall assessment') + '</label>' +
          editorHtml('yer-lm-op-cmt', '', 1000, lmCmt, 'yer-cc-lmop', true)
        : '<div class="locked-placeholder"><i class="bx bx-lock-alt"></i><p>' +
          (p.lm && p.lm.synced
            ? L('Quản lý không gửi đánh giá chi tiết<br>Hệ thống ghi nhận điểm theo quy định khi quá hạn',
                'Your manager did not submit a detailed assessment<br>The system recorded a score after the deadline')
            : L('Nhân viên hoàn thành tự đánh giá trước<br>QLTT sẽ đánh giá sau khi bạn gửi',
                'Complete your self assessment first<br>Your manager reviews after you submit')) + '</p>' +
          '<small>' + L('Mở từ ','Opens on ') + Y.fmt(Y.step('lm').from, lg()) + '</small></div>') +
      '</div>';

    return '<div class="overall-card"><div class="overall-hd"><i class="bx bx-award"></i>' +
      '<span class="overall-title">' + L('Đánh giá toàn diện','Overall assessment') + '</span></div>' +
      '<div class="overall-grid">' + left + right + '</div></div>';
  }

  /* ── phản hồi của nhân viên (Enh 5) ──────────────────── */
  function responseCard(p){
    if(!p.lm) return '';
    if(p.lm.synced && !p.response) return '';
    var body;
    if(p.response){
      body = '<div class="yer-resp"><div class="yer-resp-hd">' +
          '<span class="av av-brand av-xs">' + esc(p.emp.ini||'') + '</span>' +
          '<span class="yer-resp-who">' + esc(p.emp.name) + '</span>' +
          '<span class="yer-resp-meta">(' + esc(p.emp.login) + ')</span>' +
          '<span class="yer-resp-meta">- ' + esc(Y.fmt(p.response.at, lg())) + '</span></div>' +
          '<div class="yer-resp-tx">' + esc(p.response.text) + '</div></div>';
      if(p.reply){
        var mgr = p.emp.mgr || {};
        body += '<div class="yer-resp reply"><div class="yer-resp-hd">' +
          '<span class="av av-brand av-xs">' + esc(mgr.ini||'QL') + '</span>' +
          '<span class="yer-resp-who">' + esc(mgr.name || L('Quản lý trực tiếp','Line manager')) + '</span>' +
          '<span class="yer-resp-meta">- ' + esc(Y.fmt(p.reply.at, lg())) + '</span></div>' +
          '<div class="yer-resp-tx">' + esc(p.reply.text) + '</div></div>' +
          '<div class="yer-note info" style="margin:0"><i class="bx bx-lock-alt"></i><div>' +
          L('Quản lý đã trả lời. Trao đổi về kết quả đánh giá kết thúc tại đây.',
            'Your manager has replied. The exchange about this result ends here.') + '</div></div>';
      } else {
        body += '<div class="yer-note info" style="margin:0"><i class="bx bx-time-five"></i><div>' +
          L('Phản hồi đã được lưu vào hồ sơ đánh giá. Quản lý trực tiếp có thể trả lời một lần.',
            'Your response is saved in the review record. Your manager may reply once.') + '</div></div>';
      }
    } else if(p.responseOpen){
      body = '<div class="yer-note info"><i class="bx bx-info-circle"></i><div>' +
        L('Phản hồi là <strong>tùy chọn</strong>, được lưu như một phần của hồ sơ đánh giá và <strong>không sửa hoặc xóa được sau khi gửi</strong>. Quản lý trực tiếp được trả lời một lần.',
          'A response is <strong>optional</strong>, stored as part of the review record and <strong>cannot be edited or deleted once sent</strong>. Your manager may reply once.') +
        '</div></div>' + editorHtml('yer-resp-tx', L('Nhập phản hồi của bạn về kết quả đánh giá…','Write your response to the assessment result…'), 2000, '', 'yer-cc-resp') +
        '<div style="display:flex;justify-content:flex-end;margin-top:10px">' +
        '<button class="btn btn-default btn-sm" id="yer-btn-resp"><i class="bx bx-send"></i>' + L('Gửi phản hồi','Send response') + '</button></div>';
    } else {
      body = '<div class="yer-empty"><i class="bx bx-message-square-x"></i>' +
        L('Ô phản hồi đã đóng.','The response box is closed.') + '</div>';
    }
    var tag = p.response ? '<span class="badge b-ok">' + L('Đã gửi','Sent') + '</span>'
      : p.responseOpen ? '<span class="badge b-action">' + L('Đang mở','Open') + '</span>'
      : '<span class="badge b-muted">' + L('Đã đóng','Closed') + '</span>';
    return '<div class="rv-section"><div class="rv-section-hd"><i class="bx bx-message-square-dots"></i>' +
      '<span class="rv-type">' + L('Phản hồi của Nhân viên','Employee Response') + '</span>' +
      '<span style="margin-left:auto">' + tag + '</span></div>' +
      '<div style="padding:14px">' + body + '</div></div>';
  }

  /* ── banner trạng thái đã gửi ────────────────────────── */
  function submitBanner(p){
    if(!p.self) return '';
    var sc = p.self.overall ? p.self.overall.score : null;
    var sub = p.published
      ? L('Nộp ngày ','Submitted on ') + Y.fmt(p.self.at, lg()) + ' - ' +
        L('Kết quả cuối cùng đã được công bố ngày ','Final result published on ') + Y.fmt(p.final.publishedAt, lg())
      : L('Nộp ngày ','Submitted on ') + Y.fmt(p.self.at, lg()) + ' - ' +
        (p.lm ? L('Quản lý trực tiếp đã đánh giá','Your line manager has reviewed')
              : L('Đang chờ Quản lý trực tiếp đánh giá từ ','Awaiting line manager review from ') + Y.fmt(Y.step('lm').from, lg()));

    var scores = '<div class="sb-score-wrap"><span class="sb-score-lbl">' + L('Điểm tự đánh giá:','Self rating:') +
      '</span><span class="sb-score-val">' + (sc == null ? '—' : sc) + '</span></div>';
    if(p.published){
      scores += '<div class="sb-score-wrap yer-final-wrap"><span class="sb-score-lbl">' +
        L('Kết quả cuối cùng:','Final result:') + '</span><span class="sb-score-val yer-final-val">' + p.final.score + '</span>' +
        '<span class="sb-score-tag yer-final-tag">' + esc(U.fullLabel(p.final.score).split(' - ').slice(1).join(' - ')) + '</span></div>';
    }
    return '<div class="submit-banner"><div class="sb-icon"><i class="bx bx-check-circle"></i></div>' +
      '<div class="sb-info"><div class="sb-title">' +
        (p.published ? L('Đã công bố kết quả đánh giá cuối năm 2026','Year-End Review 2026 result published')
                     : L('Đã nộp tự đánh giá YER 2026','YER 2026 self assessment submitted')) + '</div>' +
      '<div class="sb-sub">' + esc(sub) + '</div></div>' + scores +
      '<div class="sb-actions"><button class="btn btn-outline sb-icon-action" type="button" id="yer-pdf" ' +
        'aria-label="' + esc(L('Tải kết quả PDF','Download PDF')) + '" title="' + esc(L('Tải kết quả PDF','Download PDF')) + '">' +
        '<i class="bx bxs-file-pdf"></i></button></div></div>';
  }

  /* ── toolbar ─────────────────────────────────────────── */
  function toolbar(p, editable){
    if(!editable) return '';
    return '<div class="yer-toolbar"><div class="yer-actions">' +
      '<button class="btn btn-outline btn-sm" id="yer-btn-draft"><i class="bx bx-save"></i>' + L('Lưu nháp','Save draft') + '</button>' +
      '<button class="btn btn-default btn-sm" id="yer-btn-submit"><i class="bx bx-send"></i>' + L('Gửi tự đánh giá','Submit self assessment') + '</button>' +
      '</div></div>';
  }

  /* ═══ RENDER ═════════════════════════════════════════ */
  function render(){
    var root = el('yer-root');
    if(!root) return;
    var p = prof();
    if(!p){ root.innerHTML = ''; return; }
    loadDraft();
    syncChrome(p);

    var s = S.session();
    var yerOpen = Y.cmp(s.date, Y.step('self').from) >= 0;
    if(!yerOpen){
      root.innerHTML = stepper() +
        '<div class="yer-empty"><i class="bx bx-calendar"></i>' +
        L('Kỳ đánh giá cuối năm bắt đầu từ <strong>' + Y.fmt(Y.step('self').from, lg()) + '</strong>.',
          'The year-end review opens on <strong>' + Y.fmt(Y.step('self').from, lg()) + '</strong>.') + '</div>';
      return;
    }

    var selfOpen = Y.stepState('self', s.date) === 'open';
    var editable = selfOpen && !p.self && p.eligibility.eligible && !p.resigned;
    var html = '';

    /* chặn khi thiếu mục tiêu (Enh 8 / điều kiện tham gia) */
    if(p.eligibility.reason === 'missing-goal'){
      var miss = [];
      if(p.eligibility.missingWhat) miss.push(L('Mục tiêu công việc','a work goal'));
      if(p.eligibility.missingDev) miss.push(L('Mục tiêu phát triển','a development goal'));
      html += '<div class="yer-note action"><i class="bx bx-error-circle"></i><div>' +
        '<strong>' + L('Bạn chưa đủ điều kiện thực hiện đánh giá cuối năm','You are not eligible for the Year-End Review yet') + '</strong><br>' +
        L('Cần tối thiểu 1 Mục tiêu công việc và 1 Mục tiêu phát triển đã được duyệt. Hiện còn thiếu: ',
          'You need at least one approved work goal and one approved development goal. Still missing: ') +
        '<strong>' + esc(miss.join(', ')) + '</strong>. ' +
        L('Hãy sang tab Mục tiêu để tạo và gửi Quản lý phê duyệt trước ' + Y.fmt(Y.step('self').to, lg()) + '.',
          'Go to the Goals tab to create them and send them for approval before ' + Y.fmt(Y.step('self').to, lg()) + '.') +
        '</div><button class="btn btn-default btn-sm yn-cta" id="yer-go-goals"><i class="bx bx-target-lock"></i>' +
        L('Tới tab Mục tiêu','Go to Goals') + '</button></div>' + stepper();
      root.innerHTML = html;
      afterRender(p);
      return;
    }

    html += toolbar(p, editable) + submitBanner(p) + stepper();

    if(p.maternity){
      html += '<div class="yer-note info"><i class="bx bx-heart-circle"></i><div>' +
        L('Bạn đang nghỉ thai sản nên <strong>không bắt buộc</strong> thực hiện bước Tự đánh giá trong kỳ này. Quản lý trực tiếp vẫn tiếp tục đánh giá theo quy trình của Công ty. Nếu muốn, bạn vẫn có thể tự đánh giá bình thường.',
          'You are on maternity leave, so self assessment is <strong>not required</strong> this cycle. Your line manager still completes the review. You may still self-assess if you want to.') + '</div></div>';
    }
    if(p.resignFrom && !p.resigned){
      html += '<div class="yer-note action"><i class="bx bx-log-out"></i><div>' +
        L('Bạn có ngày nghỉ việc hiệu lực từ <strong>' + Y.fmt(p.resignFrom, lg()) + '</strong>. Vui lòng hoàn tất tự đánh giá trước ngày này.',
          'Your resignation takes effect on <strong>' + Y.fmt(p.resignFrom, lg()) + '</strong>. Please complete your self assessment before then.') + '</div></div>';
    }
    if(!p.self && !editable && selfOpen === false){
      html += '<div class="yer-note info"><i class="bx bx-info-circle"></i><div>' +
        L('Bước tự đánh giá đã đóng ngày <strong>' + Y.fmt(Y.step('self').to, lg()) + '</strong>. Bạn không còn nhập được nội dung cho kỳ này.',
          'Self assessment closed on <strong>' + Y.fmt(Y.step('self').to, lg()) + '</strong>. You can no longer enter content for this cycle.') + '</div></div>';
    }

    if(p.wrapup && p.wrapup.status === 'done') html += wrapupBlock(p);

    html += goalSection(p, 'what', editable) + goalSection(p, 'dev', editable) + howSection(p, editable);
    html += overallCard(p, editable) + responseCard(p);

    root.innerHTML = html;
    afterRender(p);
  }

  function afterRender(p){
    /* mount rating control */
    document.querySelectorAll('#yer-root [data-rt]').forEach(function(node){
      var key = node.dataset.rt;
      var val = node.dataset.val === '' ? null : Number(node.dataset.val);
      U.rating(node, {
        step: node.dataset.half === '1' ? 'half' : 'int',
        value: val,
        readonly: node.dataset.ro === '1',
        compact: node.dataset.half !== '1',
        onChange: function(v){ onRating(key, v); }
      });
    });

    document.querySelectorAll('#yer-root [data-toggle]').forEach(function(b){
      b.addEventListener('click', function(){ el(b.dataset.toggle).classList.toggle('open'); });
    });
    document.querySelectorAll('#yer-root .ev-content[contenteditable="true"]').forEach(function(ed){
      ed.addEventListener('input', function(){ collectEditors(); U.dirty.mark(); });
    });

    var go = el('yer-go-goals');
    if(go) go.addEventListener('click', function(){ window.switchMainTab(0); });
    var d = el('yer-btn-draft');
    if(d) d.addEventListener('click', function(){ collectEditors(); saveDraft(); });
    var sb = el('yer-btn-submit');
    if(sb) sb.addEventListener('click', function(){ collectEditors(); submitSelf(p); });
    var pdf = el('yer-pdf');
    if(pdf) pdf.addEventListener('click', function(){
      U.toast(L('Đang chuẩn bị file PDF kết quả đánh giá','Preparing the result PDF'));
    });
    var rb = el('yer-btn-resp');
    if(rb) rb.addEventListener('click', function(){ submitResponse(); });
  }

  function onRating(key, v){
    var bits = key.split(':');
    if(bits[0] === 'goal') draft.goalScores[bits[1]] = v;
    else if(bits[0] === 'how') draft.howScores[bits[1]] = v;
    else if(key === 'overall'){ draft.overall = draft.overall || {}; draft.overall.score = v; }
    U.dirty.mark();
  }

  function collectEditors(){
    ['what','dev','how'].forEach(function(type){
      var ed = el('yer-cmt-' + type);
      if(ed) draft.comments[type] = ed.textContent.trim();
    });
    var op = el('yer-op-cmt');
    if(op){ draft.overall = draft.overall || {}; draft.overall.comment = op.textContent.trim(); }
  }

  function missingFields(p){
    var miss = [];
    ['what','dev'].forEach(function(type){
      var list = approvedGoals(p, type);
      list.forEach(function(g){
        if(draft.goalScores[g.id] == null) miss.push(L('Điểm mục tiêu: ','Goal score: ') + g.title);
      });
      if(list.length && !(draft.comments[type]||'').trim())
        miss.push(L('Đánh giá ','Assessment for ') + (lg()==='en'?TYPE[type].en:TYPE[type].vi));
    });
    CORE_VALUES.forEach(function(cv, i){
      if(draft.howScores[i] == null) miss.push(L('Điểm giá trị cốt lõi: ','Core value score: ') + (lg()==='en'?cv.en:cv.vi));
    });
    if(!(draft.comments.how||'').trim()) miss.push(L('Đánh giá Mục tiêu hành vi','Behavioral goals assessment'));
    if(!draft.overall || draft.overall.score == null) miss.push(L('Điểm toàn diện','Overall rating'));
    if(!draft.overall || !(draft.overall.comment||'').trim()) miss.push(L('Đánh giá toàn diện của nhân viên','Employee overall assessment'));
    return miss;
  }

  function submitSelf(p){
    var miss = missingFields(p);
    if(miss.length){
      U.dialog({
        title: L('Vui lòng bổ sung thông tin','Please complete the required fields'),
        text: L('Còn thiếu: ','Still missing: ') + miss.slice(0,6).join('; ') +
          (miss.length > 6 ? L(' và ' + (miss.length-6) + ' mục khác.',' and ' + (miss.length-6) + ' more.') : '.'),
        buttons: [{ label:L('Đã hiểu','Got it'), variant:'default' }]
      });
      return;
    }
    U.dialog({
      title: L('Gửi tự đánh giá cuối năm?','Submit your year-end self assessment?'),
      text: L('Sau khi gửi, bạn không thể thu hồi hoặc chỉnh sửa. Nội dung sẽ được chuyển tới Quản lý trực tiếp.',
              'Once submitted you cannot recall or edit it. Your line manager will receive the content.'),
      buttons: [
        { label:L('Kiểm tra lại','Review again'), variant:'quiet' },
        { label:L('Gửi tự đánh giá','Submit'), variant:'default', icon:'bx-send', act:function(){
            var s = S.session();
            S.setAct(s.emp, 'self', {
              at: s.date,
              goalScores: draft.goalScores,
              howScores: CORE_VALUES.map(function(_, i){ return draft.howScores[i]; }),
              comments: draft.comments,
              overall: draft.overall
            });
            S.setAct(s.emp, 'selfDraft', null);
            U.dirty.clear();
            U.toast(L('Đã gửi tự đánh giá','Self assessment submitted'));
            render();
          } }
      ]
    });
  }

  function submitResponse(){
    var ed = el('yer-resp-tx');
    var tx = ed ? ed.textContent.trim() : '';
    if(!tx){
      U.dialog({ title:L('Chưa có nội dung','Nothing to send'),
        text:L('Vui lòng nhập nội dung phản hồi trước khi gửi.','Please write your response before sending.'),
        buttons:[{ label:L('Đã hiểu','Got it'), variant:'default' }] });
      return;
    }
    U.dialog({
      title: L('Gửi phản hồi về kết quả đánh giá?','Send your response?'),
      text: L('Phản hồi được lưu vào hồ sơ đánh giá, không sửa hoặc xóa được sau khi gửi. Quản lý trực tiếp được trả lời một lần.',
              'Your response is stored in the review record and cannot be edited or deleted. Your manager may reply once.'),
      buttons: [
        { label:L('Kiểm tra lại','Review again'), variant:'quiet' },
        { label:L('Gửi phản hồi','Send response'), variant:'default', icon:'bx-send', act:function(){
            var s = S.session();
            S.setAct(s.emp, 'response', { at: s.date, text: tx });
            U.dirty.clear();
            U.toast(L('Đã gửi phản hồi','Response sent'));
            render();
          } }
      ]
    });
  }

  /* ── đồng bộ phần khung của E-01 với nhân sự đang chọn ── */
  function syncChrome(p){
    var s = S.session();
    var chip = document.querySelector('.emp-chip');
    var mgr = p.emp.mgr || { name:'Lê Thị Thanh', login:'thanh.le' };
    if(chip){
      chip.innerHTML = '<div class="av av-brand av-xs">' + esc(p.emp.ini||'') + '</div>' +
        '<div class="ec-info">' +
        '<div class="ec-line"><span class="ec-lbl">' + L('Nhân viên','Employee') + ':</span> ' + esc(p.emp.name) +
          ' <span class="ec-dom">(' + esc(p.emp.login) + ')</span></div>' +
        '<div class="ec-line"><span class="ec-lbl">Team:</span> ' + esc(p.emp.div + ' - ' + (p.emp.team || p.emp.dept)) + '</div>' +
        '<div class="ec-line"><span class="ec-lbl">' + L('Quản lý trực tiếp','Line manager') + ':</span> ' + esc(mgr.name) +
          ' <span class="ec-dom">(' + esc(mgr.login) + ')</span></div></div>';
    }
    var uname = document.querySelector('.sb-uname');
    if(uname) uname.textContent = p.emp.name;
    var urole = document.querySelector('.sb-urole');
    if(urole) urole.textContent = L('Nhân viên','Employee') + ', ' + p.emp.dept;
    var uav = document.querySelector('.sb-user .av');
    if(uav) uav.textContent = p.emp.ini || '';

    /* nhãn trạng thái trên tab (Enh 11) */
    var yerLbl = el('tablbl-yer');
    if(yerLbl) yerLbl.textContent = yerTabState(p);
    var myrLbl = el('tablbl-myr');
    if(myrLbl) myrLbl.textContent = (p.myr && p.myr.submitted)
      ? L('Đã hoàn tất','Completed') : L('Không có dữ liệu','No data');
    var cnt = el('tabcnt-goals');
    if(cnt) cnt.textContent = (p.emp.goals||[]).filter(function(g){ return deletedIds().indexOf(g.id) < 0; }).length;

    var tabYer = el('tab-yer');
    if(tabYer){
      var open = Y.cmp(s.date, Y.step('self').from) >= 0;
      tabYer.classList.toggle('disabled', !open);
      tabYer.title = open ? '' : L('Bắt đầu từ ','Opens on ') + Y.fmt(Y.step('self').from, lg());
    }
  }

  function yerTabState(p){
    var s = S.session();
    if(Y.cmp(s.date, Y.step('self').from) < 0) return L('Chưa mở','Not open yet');
    if(p.eligibility.reason === 'missing-goal') return L('Không đánh giá','Not evaluated');
    if(p.published) return L('Đã hoàn tất','Completed');
    if(p.responseOpen) return L('Cần xem kết quả','Result ready for you');
    if(p.lm) return L('Đã có kết quả của Quản lý','Manager result available');
    if(p.self) return L('Đang chờ Quản lý','Awaiting manager');
    if(p.maternity) return L('Không yêu cầu tự đánh giá','Self assessment not required');
    if(Y.stepState('self', s.date) === 'open') return L('Cần tự đánh giá','Self assessment needed');
    return L('Đang chờ Quản lý','Awaiting manager');
  }

  /* ── CSS cho trạng thái bước trong stepper ── */
  function injectCss(){
    if(document.getElementById('yer-emp-css')) return;
    var st = document.createElement('style');
    st.id = 'yer-emp-css';
    st.textContent =
      '.yer-stepper{padding:12px 16px 12px}' +
      '.yer-track{display:flex;overflow-x:auto;gap:0}' +
      '.yer-step{flex:1 1 0;min-width:132px;padding:2px 12px;border-left:1px solid var(--z200)}' +
      '.yer-step:first-child{border-left:0;padding-left:0}' +
      '.yer-step-name{font-size:12.5px;font-weight:600;color:var(--z600);line-height:1.3}' +
      '.yer-step-date{font-size:11.5px;color:var(--z600);margin-top:2px;font-variant-numeric:tabular-nums}' +
      '.yer-step .step-badge{margin-top:4px}' +
      '.yer-step.done .yer-step-name{color:var(--z700)}' +
      '.yer-step.current .yer-step-name{color:var(--brand);font-weight:700}' +
      '.yer-step.current{background:var(--brand-muted);border-radius:var(--rsm)}' +
      '.yer-cv-desc{line-height:1.55}' +
      '.yer-ed-ro .ev-content{min-height:0;padding:9px 11px;color:var(--z900)}' +
      '.yer-ed-ro{border-color:var(--z200);background:var(--z50)}' +
      '.yer-ed-empty{color:var(--z500)}' +
      '.scmt-panel.yer-ro .ev-editor-wrap{box-shadow:none}' +
      '.yer-final-wrap{padding-left:14px;border-left:1px solid var(--ok-bd)}' +
      '.yer-final-val{color:var(--ok)}' +
      '.yer-final-tag{color:var(--ok);background:var(--z0);border-color:var(--ok-bd)}' +
      '#yer-root .sc-cell .rt-ro,#yer-root .ql-cell .rt-ro{justify-content:center}' +
      '#yer-root .ql-cell .rt-ro-score{font-size:13px}';
    document.head.appendChild(st);
  }

  function boot(){
    Y = window.PMSYer; S = window.PMSStore; I = window.PMSI18n; U = window.PMSUi;
    if(!Y || !S || !I || !U) return;
    injectCss();
    var slot = document.getElementById('lang-slot');
    if(slot && !slot.childElementCount) I.mountToggle(slot);
    I.onChange(render);
    document.addEventListener('pms:demo-change', function(e){
      if(e.detail && (e.detail.reason === 'emp' || e.detail.reason === 'reset')) U.dirty.clear();
      render();
    });
    U.dirty.watch(document);
    U.dirty.onSaveDraft(function(){ collectEditors(); saveDraft(true); });
    render();
  }

  window.PMSYerEmployee = { render: function(){ render(); } };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
