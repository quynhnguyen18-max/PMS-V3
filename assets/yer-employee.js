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
  var lateFileDraft = null;

  /* ── dữ liệu ─────────────────────────────────────────── */
  function prof(){ var s = S.session(); return Y.profile(s.emp, s.date); }
  function actsOf(){ return S.acts(S.session().emp) || {}; }
  function deletedIds(){ return ((actsOf().deletedGoals || {}).ids) || []; }
  function approvedGoals(p, type){
    var base = (p.emp.goals||[]).filter(function(g){
      return g.type === type && g.status === 'approved' && deletedIds().indexOf(g.id) < 0;
    });
    var imported = (p.lateSubmission && p.lateSubmission.goals) || [];
    imported.filter(function(g){ return g.type === type; }).forEach(function(g){
      if(!base.some(function(x){ return x.id === g.id; })) base.push(g);
    });
    return base;
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
  /* Ô bắt buộc điền đánh dấu bằng sao đỏ ngay trên nhãn của ô đó,
     không dùng nhãn "Bắt buộc" ở góc panel nữa. */
  function req(){
    return '<span class="yer-req" aria-hidden="true">*</span>' +
      '<span class="sr-only">' + L(' bắt buộc',' required') + '</span>';
  }

  function editorHtml(id, placeholder, max, value, counterId, readonly){
    if(readonly){
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
        '" oninput="edCount(this,\'' + counterId + '\',' + max + ')">' + esc(value||'') + '</div></div>' +
      '<div class="char-ct" id="' + counterId + '">' + String(value||'').length + ' / ' + max + '</div>';
  }
  /* ── quy trình và thời gian (ENH-E14) ────────────────────
     Dải quy trình do PMSUi.steps dựng để mỗi bước bấm được và đọc thêm được.
     stepper() chỉ trả về chỗ trống, nội dung gắn vào ở mountSteps().          */
  var EMP_STEPS = ['self', 'lm', 'lm2', 'hod', 'publish'];   // nhân viên không cần thấy bước nội bộ của HR

  function stepper(){ return '<div id="yer-steps"></div>'; }

  /* Mọi bước chỉ hiện hạn chót. Ngày bắt đầu của cả kỳ đưa lên tiêu đề dải,
     không lặp lại ở từng bước. */
  function stepDate(st){
    return L('Hạn chót ', 'Due ') + Y.fmt(st.to, lg());
  }

  function stepItems(){
    var s = S.session();
    var p = prof();
    var who = p ? Y.actors(p) : {};
    return window.PMS_YER_TIMELINE.steps
      .filter(function(st){ return EMP_STEPS.indexOf(st.key) >= 0; })
      .map(function(st){
        var state = Y.stepState(st.key, s.date);
        var person = who[st.key];
        return {
          key: st.key,
          name: lg()==='en' ? st.en : st.vi,
          // Bước Công bố kết quả không gắn với một người cụ thể nên không có domain
          domain: person ? person.login : '',
          date: stepDate(st),
          state: state === 'open' ? 'open' : state === 'closed' ? 'done' : 'todo'
        };
      });
  }

  function mountSteps(){
    var node = el('yer-steps');
    if(!node) return;
    var opens = Y.fmt(Y.step('self').from, lg());
    U.steps(node, {
      // Ngày bắt đầu kỳ nằm ở tiêu đề, từng bước bên dưới chỉ còn hạn chót
      title: L('Quy trình và Thời gian đánh giá cuối năm 2026 - bắt đầu ' + opens,
               'Year-End Review 2026 process and timeline - opens ' + opens),
      collapseKey: 'yer-emp',
      items: stepItems()
    });
    node.classList.add('yer-stepper');
  }

  /* ── mascot tour guide (ENH-E14) ─────────────────────────
     Tour chỉ bắt đầu khi người dùng bấm mascot. Mỗi trạng thái chỉ giữ lại
     những bước đang có và đang thực hiện được trên màn hình.                 */
  function tourItems(p){
    var items = [
      // Chỉ tô đúng tab Đánh giá cuối năm, không tô cả ba tab
      { sel: '#tab-yer', pose: 'wave.png',
        title: L('Bạn đang ở Đánh giá cuối năm','You are in Year-End Review'),
        text:  L('Ba tab Mục tiêu, Đánh giá giữa năm và Đánh giá cuối năm thuộc cùng một chu kỳ. Nhãn trên tab cho biết việc bạn đang cần làm.',
                 'Goals, Mid-Year Review and Year-End Review belong to the same cycle. The tab label shows what currently needs your attention.') },
      { sel: '#yer-steps', pose: 'run.png',
        title: L('Hồ sơ của bạn đang ở đây','Where your profile stands'),
        text:  L('Bước được tô hồng là bước đang mở. Mỗi bước ghi rõ ai phụ trách và hạn chót phải hoàn thành.',
                 'The pink step is the one currently open. Each step names its owner and the date it must be completed by.') }
    ];

    if(!p.self && p.lateWindowOpen){
      items.push({ sel: '#yer-root .yer-late-upload', pose: 'think.png',
        title: L('Nộp trễ trong thời gian của Quản lý','Submit late during the manager window'),
        text: L('Chuẩn bị một file Excel gồm đầy đủ mục tiêu và nội dung tự đánh giá; sau đó chọn file, xác nhận mục tiêu đã thống nhất với Quản lý trực tiếp và nộp hồ sơ.',
                'Choose one file containing both goals and the self assessment, confirm the goals were aligned with your manager, then submit. Imported goals skip approval and the manager can review immediately.') });
      return items;
    }

    if(p.eligibility.reason === 'missing-goal'){
      items.push({ sel: '#yer-root .yer-note.action', pose: 'think.png',
        title: L('Chưa đủ điều kiện đánh giá','Not eligible for review'),
        text: Y.stepState('self', S.session().date) === 'closed'
          ? L('Hạn tự đánh giá đã kết thúc và hồ sơ không đủ tối thiểu một Mục tiêu công việc cùng một Mục tiêu phát triển được duyệt.',
              'The self-assessment deadline has passed and the profile does not have at least one approved work goal and one approved development goal.')
          : L('Bạn cần tối thiểu một Mục tiêu công việc và một Mục tiêu phát triển đã được duyệt trước khi bắt đầu tự đánh giá.',
              'You need at least one approved work goal and one approved development goal before starting self assessment.') });
      return items;
    }

    if(p.self){
      items.push({ sel: '#yer-root .submit-banner', pose: 'cheer.png',
        title: L('Tự đánh giá đã hoàn tất','Self assessment completed'),
        text: L('Nội dung đã gửi chỉ còn ở chế độ xem. Bạn có thể theo dõi bước hiện tại và xem lại các phần đánh giá bên dưới.',
                'Submitted content is now read-only. You can follow the current stage and review the assessment sections below.') });
    } else if(Y.stepState('self', S.session().date) === 'closed'){
      items.push({ sel: '#yer-root .yer-note.info', pose: 'think.png',
        title: L('Đã quá hạn tự đánh giá','Self assessment is overdue'),
        text: L('Bạn không còn nhập hoặc gửi tự đánh giá. Quy trình tiếp tục sang bước Quản lý trực tiếp theo dữ liệu hiện có.',
                'You can no longer enter or submit a self assessment. The process continues to the line-manager stage with the available data.') });
    } else {
      items = items.concat([
        { sel: '#yer-root .yer-sec-what', pose: 'think.png',
          title: L('1. Đánh giá Mục tiêu công việc','1. Assess work goals'),
          text: L('Đọc lại kết quả cần đạt, chọn điểm cho từng mục tiêu và viết nhận xét tổng hợp cho phần WHAT.',
                  'Review the expected results, rate each goal and add your overall WHAT comment.') },
        { sel: '#yer-root .yer-sec-dev', pose: 'think.png',
          title: L('2. Đánh giá Mục tiêu phát triển','2. Assess development goals'),
          text: L('Đánh giá tiến độ phát triển năng lực, chọn điểm và nêu kết quả hoặc minh chứng nổi bật.',
                  'Assess your capability-development progress, select ratings and note key results or evidence.') },
        { sel: '#yer-root .yer-sec-how', pose: 'think.png',
          title: L('3. Đánh giá Mục tiêu hành vi','3. Assess behavioral goals'),
          text: L('Chấm từng giá trị cốt lõi và viết nhận xét về cách bạn đã thực hiện công việc trong năm.',
                  'Rate each core value and comment on how you worked throughout the year.') },
        // Chỉ tô ô của Nhân viên, không tô luôn ô của Quản lý
        { sel: '#yer-root .yer-op-self', pose: 'wink.png',
          title: L('4. Hoàn tất đánh giá toàn diện','4. Complete the overall assessment'),
          text: L('Chọn điểm toàn diện và tóm tắt kết quả cả năm trước khi lưu hoặc gửi.',
                  'Choose an overall rating and summarize your year before saving or submitting.') },
        { sel: '#yer-btn-draft', pose: 'idle.png', place: 'top',
          title: L('Lưu nháp để kiểm tra lại','Save a draft to review later'),
          text: L('Màn hình không tự lưu. Dùng Lưu nháp nếu bạn muốn quay lại rà soát trước khi gửi.',
                  'This screen does not auto-save. Save a draft if you want to return and review before submitting.') },
        { sel: '#yer-btn-submit', pose: 'cheer.png', place: 'top',
          title: L('Gửi tự đánh giá','Submit self assessment'),
          text: L('Kiểm tra đủ WHAT, HOW, Development và điểm toàn diện. Sau khi gửi, bạn không thể sửa hoặc thu hồi.',
                  'Check WHAT, HOW, Development and the overall rating. Once submitted, it cannot be edited or withdrawn.') }
      ]);
    }
    return items;
  }

  function runTour(p){
    U.tour.start(tourItems(p || prof()), { key: 'yer-emp' });
  }

  /* Tên bước hiện tại của chính người đang xem, dùng cho câu chữ của mascot. */
  function mascotStep(p){
    if(!p.self && p.lateWindowOpen && !p.maternity) return L('Nộp trễ hạn','Late submission');
    if(p.eligibility.reason === 'missing-goal') return L('Chưa đủ điều kiện','Not eligible');
    if(p.published) return L('Đã công bố kết quả','Results published');
    if(p.responseOpen) return L('Xem kết quả của Quản lý','Read the manager result');
    if(p.self) return L('Chờ Quản lý đánh giá','Awaiting manager review');
    if(p.maternity) return L('Không yêu cầu tự đánh giá','Self assessment not required');
    if(Y.stepState('self', S.session().date) === 'closed') return L('Quá hạn tự đánh giá','Self assessment overdue');
    return L('Tự đánh giá','Self assessment');
  }

  /* Bóng thoại luôn theo một cấu trúc: đang ở bước nào, rồi mời đi tiếp.
     Tên bước được làm nổi như một chip để đọc lướt là thấy. */
  function mascotCopy(p){
    return L('Bạn đang ở bước ','You are at ') +
      '<span class="yer-mascot-step">' + esc(mascotStep(p)) + '</span>' +
      L('. Mình sẽ dẫn bạn qua các việc cần hoàn thành nhé!',
        '. I will walk you through what needs to be done.');
  }

  function mountMascotGuide(p){
    var tabs = document.querySelector('.tabs');
    if(!tabs) return;
    var old = el('yer-mascot-guide');
    if(old) old.remove();
    var wrap = document.createElement('div');
    wrap.id = 'yer-mascot-guide';
    wrap.className = 'yer-mascot-guide';
    wrap.innerHTML = '<div class="yer-mascot-bubble" id="yer-mascot-bubble" role="tooltip">' +
      '<div class="yer-mascot-title">' + L('Xin chào, mình là tour guide của bạn!','Hi, I am your tour guide!') + '</div>' +
      '<div>' + mascotCopy(p) + '</div></div>' +
      '<button type="button" class="yer-mascot-trigger" aria-label="' + esc(L('Bắt đầu hướng dẫn Đánh giá cuối năm','Start the Year-End Review guide')) + '" aria-describedby="yer-mascot-bubble">' +
      '<img src="../assets/mascot/idle.png" alt=""><span class="yer-mascot-dot" aria-hidden="true"></span></button>';
    tabs.appendChild(wrap);
    var btn = wrap.querySelector('.yer-mascot-trigger');
    var img = wrap.querySelector('img');
    function pose(name){ img.src = '../assets/mascot/' + name; }
    btn.addEventListener('mouseenter', function(){ pose('wave.png'); });
    btn.addEventListener('mouseleave', function(){ pose('idle.png'); });
    btn.addEventListener('focus', function(){ pose('wave.png'); });
    btn.addEventListener('blur', function(){ pose('idle.png'); });
    btn.addEventListener('click', function(){ btn.blur(); pose('cheer.png'); runTour(p); });

    /* Cuộn xuống thì mascot rời thanh tab và bám sát mép phải màn hình,
       để luôn gọi được hướng dẫn mà không phải cuộn ngược lên đầu trang. */
    function syncStick(){
      var r = tabs.getBoundingClientRect();
      wrap.classList.toggle('stuck', r.bottom < 8);
    }
    window.removeEventListener('scroll', mountMascotGuide._stick, true);
    mountMascotGuide._stick = syncStick;
    window.addEventListener('scroll', syncStick, true);
    window.addEventListener('resize', syncStick);
    syncStick();
  }

  /* ── mục tiêu Quản lý đã đánh giá hoàn thành (§13) ──
     Khi nhân viên đổi Quản lý giữa kỳ, Quản lý cũ không để lại bản bàn giao nào cả.
     Thứ họ để lại là điểm của những mục tiêu họ đã chốt hoàn thành, và Quản lý mới
     không chấm lại những mục tiêu đó. */
  function doneChip(){
    return '<span class="g-done-chip"><i class="bx bx-check-circle"></i>' +
      L('Đã đánh giá hoàn thành','Assessed as complete') + '</span>';
  }

  /* Chi tiết hai lượt chấm để popup đọc lại. Popup nằm ở E-05 và chỉ đọc data-* của
     dòng, nên không phải truyền gì thêm giữa hai file. */
  function doneData(p, done){
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

  /* Ai chấm điểm này. Chỉ hiện domain cho gọn cột, tên đầy đủ để ở tooltip. */
  function byLine(done){
    if(!done || !done.by) return '';
    return '<div class="ql-by" title="' +
      esc(L('Đánh giá bởi ','Assessed by ') + done.by.name + ' (' + done.by.login + ')') + '">' +
      esc(done.by.login) + '</div>';
  }

  /* ── bảng mục tiêu ───────────────────────────────────── */
  function goalSection(p, type, editable){
    /* Chưa có mục tiêu thì **vẫn giữ khối**, chỉ là bảng trống kèm một dòng xám mờ.
       Giấu luôn cả khối thì nhân viên không biết mình đang thiếu loại mục tiêu nào,
       và màn hình của hai người cùng trạng thái lại có số khối khác nhau. */
    var list = approvedGoals(p, type);
    var lmOk = p.lm && !p.lm.synced;
    var rows = list.map(function(g){
      var selfScore = p.self ? (p.self.goalScores||{})[g.id] : draft.goalScores[g.id];
      var lmScore = lmOk ? (p.lm.goalScores||{})[g.id] : null;
      var prio = g.prio ? PRIO[g.prio] : null;
      /* Mục tiêu đã đánh giá hoàn thành: điểm đã chốt xong ở tab Mục tiêu nên
         **khóa cả hai cột** ở kỳ đánh giá — nhân viên lẫn Quản lý đều không chọn lại được.
         Màn này chỉ hiển thị lại điểm đó. */
      var done = (p.completedGoals||{})[g.id];
      if(done) selfScore = done.self.score;
      var qlScore = done ? done.mgr.score : lmScore;
      // Không gắn nhãn mục tiêu đã thay đổi sau kỳ giữa năm: kỳ cuối năm chấm trên
      // mục tiêu hiện tại, lịch sử thay đổi không đổi cách chấm.
      /* data-name / data-result cho tooltip và popup chi tiết mục tiêu. Dùng chung
         đúng cơ chế của tab Đánh giá giữa năm (xem window.bindReviewGoalRows ở E-05). */
      return '<tr' + (done ? ' class="g-row-done"' : '') +
        ' data-name="' + esc(g.title) + '" data-result="' + esc(g.result) + '"' +
        (done ? doneData(p, done) : '') +
        '><td><div class="g-name">' + esc(g.title) + '</div>' +
        (done ? doneChip() : '') + '</td>' +
        '<td><div class="g-result">' + esc(g.result) + '</div></td>' +
        (type === 'what' ? '<td><div class="g-meta">' + (prio ? '<span class="prio ' + prio.cls + '">' +
            esc(lg()==='en'?prio.en:prio.vi) + '</span>' : '—') + '</div></td>' : '') +
        '<td><div class="g-meta">' + esc(g.s + ' – ' + g.e) + '</div></td>' +
        '<td class="sc-cell"><div data-rt="goal:' + g.id + '" data-val="' + (selfScore==null?'':selfScore) +
          '" data-ro="' + ((editable && !done)?'0':'1') + '"></div></td>' +
        '<td class="ql-cell">' + (qlScore != null
          ? '<div data-rt="lmgoal:' + g.id + '" data-val="' + qlScore + '" data-ro="1"></div>' +
            byLine(done && done.mgr)
          : '<div class="ql-dash">—</div>') + '</td></tr>';
    }).join('');

    if(!list.length){
      // colspan đếm đúng số cột: nhóm công việc có thêm cột Ưu tiên
      rows = '<tr class="g-none-row"><td colspan="' + (type === 'what' ? 6 : 5) + '">' +
        '<div class="g-none">' +
        L('Chưa có ' + (lg()==='en'?TYPE[type].en:TYPE[type].vi).toLowerCase() + ' nào được Quản lý trực tiếp phê duyệt.',
          'No ' + ({what:'work goal', dev:'development goal'}[type] || 'goal') + ' has been approved by your line manager yet.') +
        '</div></td></tr>';
    }

    return '<div class="rv-section yer-sec-' + type + '"><div class="rv-section-hd"><i class="bx ' + TYPE[type].icon + '"></i>' +
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
      /* Giá trị cốt lõi cũng là một nhóm mục tiêu, nên cũng phải có tooltip và popup
         chi tiết như hai nhóm kia. Mô tả nối bằng xuống dòng vì ba ý là ba câu riêng;
         tooltip dùng white-space:pre-line nên giữ đúng ngắt dòng. */
      var cvName = lg()==='en'?cv.en:cv.vi;
      return '<tr data-name="' + esc(cvName) + '" data-result="' + esc(cv.lines.join('\n')) + '">' +
        '<td><div class="g-name">' + esc(cvName) + '</div></td>' +
        '<td><div class="g-result yer-cv-desc">' + cv.lines.map(function(t){ return esc(t); }).join('<br>') + '</div></td>' +
        '<td class="sc-cell"><div data-rt="how:' + i + '" data-val="' + (selfScore==null?'':selfScore) +
          '" data-ro="' + (editable?'0':'1') + '"></div></td>' +
        '<td class="ql-cell">' + (lmScore != null
          ? '<div data-rt="lmhow:' + i + '" data-val="' + lmScore + '" data-ro="1"></div>'
          : '<div class="ql-dash">—</div>') + '</td></tr>';
    }).join('');
    return '<div class="rv-section yer-sec-how"><div class="rv-section-hd"><i class="bx bx-heart"></i>' +
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
      (editable ? req() : '') + '</div>' +
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
                     : Y.stepState('self', S.session().date) === 'closed'
                       ? L('Không có Tự đánh giá. Quản lý tiếp tục đánh giá theo quy trình','No self assessment. Your manager continues the review process')
                       : L('Quản lý sẽ nhận xét sau khi bạn gửi','Your manager will comment after you submit')) + '</div></div>';
    }
    return '<div class="section-cmt">' + left + right + '</div>';
  }

  /* ── đánh giá toàn diện ──────────────────────────────── */
  function overallCard(p, editable){
    var mineScore = p.self && p.self.overall ? p.self.overall.score : (draft.overall||{}).score;
    var mineCmt = p.self && p.self.overall ? p.self.overall.comment : (draft.overall||{}).comment;
    var left = '<div class="overall-panel yer-op-self' + (editable ? ' editable-panel' : '') + '">' +
      '<div class="op-hd"><i class="bx bx-user"></i>' + L('Nhân viên tự đánh giá','Employee self assessment') + '</div>' +
      '<div class="op-score-row"><span class="op-score-lbl">' + L('Điểm toàn diện:','Overall rating:') +
        (editable ? req() : '') + '</span>' +
        '<span data-rt="overall" data-def="#yer-op-def" data-val="' + (mineScore==null?'':mineScore) + '" data-ro="' + (editable?'0':'1') +
        '" data-half="1"></span></div>' +
      (editable
        ? '<label class="op-flbl">' + L('Đánh giá toàn diện của nhân viên','Employee overall assessment') + req() + '</label>' +
          editorHtml('yer-op-cmt', L('Nhìn chung, tôi đã hoàn thành…','Overall, I have completed…'), 1000, mineCmt, 'yer-cc-op')
        : '<label class="op-flbl">' + L('Đánh giá toàn diện của nhân viên','Employee overall assessment') + '</label>' +
          editorHtml('yer-op-cmt-ro', '', 1000, mineCmt, 'yer-cc-op-ro', true)) +
      // Ô định nghĩa mức điểm đặt dưới ô nhận xét, không chèn giữa ô chọn điểm và ô nhận xét
      '<div id="yer-op-def" class="yer-op-def"></div>' +
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
            : (!p.self && Y.stepState('self', S.session().date) === 'closed')
              ? L('Không có Tự đánh giá<br>QLTT tiếp tục đánh giá theo quy trình',
                  'No self assessment<br>Your manager continues the review process')
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
    // Tiêu đề nói rõ đã xong việc gì, dòng phụ chỉ còn ngày gửi.
    // Trạng thái đang chờ ai đã nằm ở nhãn tab và ở dải quy trình, không lặp lại ở đây.
    var sub = p.published
      ? L('Ngày công bố: ','Published on: ') + Y.fmt(p.final.publishedAt, lg())
      : L('Ngày gửi: ','Submitted on: ') + Y.fmt(p.self.at, lg());

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
                     : L('Đã hoàn thành Tự đánh giá cuối năm','Year-end self assessment completed')) +
        (p.lateSubmission ? '<span class="yer-late-inline"><i class="bx bx-time-five"></i>' + L('Nộp trễ hạn','Submitted late') + '</span>' : '') + '</div>' +
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

  /* ── Khối Lưu ý (ENH-E03) ────────────────────
     Điều kiện tham gia và đường sang kỳ giữa năm. Hai cụm chữ nhấn là liên kết thật,
     dẫn sang tab Mục tiêu và tab Đánh giá giữa năm của chính màn này.                     */
  /* Các gạch đầu dòng Lưu ý. Tách ra vì khi nhân viên thiếu mục tiêu thì chúng được
     gộp vào chính khối cảnh báo, không dựng thành box thứ hai.
     opts.skipGoalRule: khối cảnh báo đã nói về điều kiện mục tiêu rồi, không lặp lại. */
  function noteItems(p, opts){
    opts = opts || {};
    if(p.maternity){
      return [L('Bạn đang <strong class="yer-hl">nghỉ thai sản</strong> nên <strong>không bắt buộc</strong> thực hiện bước <strong>Tự đánh giá</strong> cuối năm. Quản lý trực tiếp sẽ đánh giá theo quy trình của Công ty.',
               'You are on <strong class="yer-hl">maternity leave</strong>, so the year-end <strong>Self assessment</strong> step is <strong>not required</strong>. Your line manager will complete the review following the Company process.')];
    }
    var items = [];
    if(!opts.skipGoalRule){
      items.push(L('Chỉ những mục tiêu đã được Quản lý trực tiếp phê duyệt mới đủ điều kiện đánh giá cuối năm. Vui lòng kiểm tra <a href="#" class="yer-note-link" data-go-tab="0">Danh sách mục tiêu</a> trước khi Tự đánh giá.',
                   'Only goals approved by your line manager qualify for the year-end review. Please check your <a href="#" class="yer-note-link" data-go-tab="0">goal list</a> before self-assessing.'));
    }
    /* Chỉ hai câu, và có trường hợp không câu nào:
         - Có kết quả        → dẫn sang tab để xem lại.
         - Thuộc kỳ mà chưa xong → nói gọn lý do, không liên kết.
         - Không thuộc kỳ giữa năm → **không nói gì cả**. Họ chưa bao giờ vào kỳ đó nên
           nhắc tới chỉ làm họ tưởng mình bỏ sót việc gì. */
    if(p.myr && p.myr.submitted){
      items.push(L('Bạn có thể xem lại kết quả <a href="#" class="yer-note-link" data-go-tab="1">Đánh giá giữa năm 2026</a> của mình trước khi tự đánh giá cuối năm.',
                   'You can look back at your <a href="#" class="yer-note-link" data-go-tab="1">Mid-Year Review 2026</a> result before self-assessing.'));
    } else if(p.myrEligible){
      items.push(L('Bạn không có kết quả Đánh giá giữa năm 2026 vì chưa hoàn thành quy trình.',
                   'You have no Mid-Year Review 2026 result because the process was not completed.'));
    }
    return items;
  }

  // Không còn dòng nào thì không dựng thẻ rỗng
  function noteList(p, opts){
    var items = noteItems(p, opts);
    if(!items.length) return '';
    return '<ul class="yer-note-list"><li>' + items.join('</li><li>') + '</li></ul>';
  }

  function noteBlock(p){
    var list = noteList(p);
    if(!list) return '';
    return '<div class="info-note yer-note-block"><i class="bx bx-info-circle"></i><div>' +
      '<strong>' + L('Lưu ý:','Please note:') + '</strong>' + list + '</div></div>';
  }

  /* ── ENH-E02: NV nộp trễ mục tiêu + tự đánh giá ──────────
     Đây là luồng riêng chỉ mở trong timeline của LM. Một file duy nhất,
     goal đi thẳng vào hồ sơ và không phát sinh bước phê duyệt goal. */
  function lateDaysLeft(p){
    return Math.max(0, Math.floor(Y.cmp(Y.step('lm').to, p.now) / 86400000) + 1);
  }

  function lateApprovedGoals(p){
    return (p.emp.goals || []).filter(function(g){
      return g.status === 'approved' && deletedIds().indexOf(g.id) < 0;
    });
  }

  function downloadLateTemplate(p, includeApproved){
    var id = p.emp && p.emp.id;
    var filled = {
      y9: 'YER-2026-Nguyen-Mai-Anh.xlsx',
      y10: 'YER-2026-Tran-Quoc-Huy.xlsx'
    };
    var fileName = includeApproved && filled[id]
      ? filled[id]
      : 'YER-2026-Mau-tu-danh-gia.xlsx';
    var link = document.createElement('a');
    link.href = '../assets/templates/' + fileName;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    U.toast(includeApproved && filled[id]
      ? L('Đã tải file mẫu kèm mục tiêu đã duyệt','Downloaded the template with approved goals')
      : L('Đã tải file mẫu trống','Downloaded the blank template'));
  }

  function chooseLateTemplate(p){
    var approved = lateApprovedGoals(p);
    if(!approved.length){
      U.dialog({
        title:L('Tải file mẫu trống','Download blank template'),
        text:L('Hệ thống chưa có mục tiêu đã duyệt. Bạn sẽ tự điền mục tiêu và nội dung tự đánh giá trong file mẫu.',
               'There are no approved goals. Add your goals and self assessment to the blank template.'),
        buttons:[
          { label:L('Hủy','Cancel'), variant:'quiet' },
          { label:L('Tải file mẫu','Download template'), variant:'default', icon:'bx-download', act:function(){ downloadLateTemplate(p, false); } }
        ]
      });
      return;
    }
    U.dialog({
      title:L('Chọn nội dung file mẫu','Choose template content'),
      text:L('Hệ thống có ' + approved.length + ' mục tiêu đã duyệt. Bạn muốn tải kèm các mục tiêu này hay dùng mẫu trống?',
             'The system has ' + approved.length + ' approved goal(s). Download them in the template or use a blank template?'),
      buttons:[
        { label:L('Mẫu trống','Blank template'), variant:'quiet', icon:'bx-file-blank', act:function(){ downloadLateTemplate(p, false); } },
        { label:L('Kèm mục tiêu đã duyệt','Include approved goals'), variant:'default', icon:'bx-download', act:function(){ downloadLateTemplate(p, true); } }
      ]
    });
  }

  function lateUploadBlock(p){
    var selected = lateFileDraft && lateFileDraft.name;
    return stepper() +
      '<section class="yer-late-upload" aria-labelledby="yer-late-title">' +
        '<div class="yer-late-head"><div>' +
          '<span class="yer-late-badge"><i class="bx bx-time-five"></i>' + L('Quá hạn tự đánh giá','Self-assessment deadline passed') + '</span>' +
          '<h2 id="yer-late-title">' + L('Hoàn tất hồ sơ để Quản lý trực tiếp đánh giá','Complete your file for line-manager review') + '</h2>' +
          '<p>' + L('Bạn vẫn được nộp trong thời gian đánh giá của Quản lý trực tiếp, đến hết <strong>' + Y.fmt(Y.step('lm').to, lg()) + '</strong>.',
                    'You may still submit during the line-manager review window, through <strong>' + Y.fmt(Y.step('lm').to, lg()) + '</strong>.') + '</p>' +
        '</div><div class="yer-late-count"><strong>' + lateDaysLeft(p) + '</strong><span>' + L('ngày còn lại','days left') + '</span></div></div>' +
        '<ol class="yer-late-steps">' +
          '<li><span>1</span><div><strong>' + L('Tải file mẫu','Download template') + '</strong><p>' + L('Chọn mẫu trống hoặc kèm mục tiêu đã duyệt.','Choose a blank template or include approved goals.') + '</p></div></li>' +
          '<li><span>2</span><div><strong>' + L('Điền tự đánh giá','Complete self assessment') + '</strong><p>' + L('Hoàn tất điểm, nhận xét và minh chứng trong file.','Complete ratings, comments and evidence in the file.') + '</p></div></li>' +
          '<li><span>3</span><div><strong>' + L('Tải lên và nộp','Upload and submit') + '</strong><p>' + L('Xác nhận mục tiêu đã thống nhất với Quản lý trực tiếp.','Confirm that the goals were aligned with your line manager.') + '</p></div></li>' +
        '</ol>' +
        '<div class="yer-late-note"><i class="bx bx-info-circle"></i>' + L('Mục tiêu trong file không cần duyệt lại. Sau khi bạn nộp, Quản lý trực tiếp sẽ tiếp tục đánh giá.','Goals in the file do not require another approval. Your line manager can continue the review after submission.') + '</div>' +
        '<div class="yer-late-file' + (selected ? ' has-file' : '') + '" id="yer-late-file-box">' +
          '<input type="file" id="yer-late-file" accept=".xlsx,.xls" hidden>' +
          '<div class="yer-late-file-icon"><i class="bx ' + (selected ? 'bx-check' : 'bx-cloud-upload') + '"></i></div>' +
          '<div class="yer-late-file-copy"><strong id="yer-late-file-name">' + (selected ? esc(selected) : L('Chọn file đánh giá cuối năm','Choose the year-end review file')) + '</strong>' +
          '<span id="yer-late-file-meta">' + (selected ? L('Đã chọn file - sẵn sàng để nộp','File selected - ready to submit') : L('Định dạng Excel .xlsx hoặc .xls - một file duy nhất','Excel .xlsx or .xls - one file only')) + '</span></div>' +
          '<div class="yer-late-file-actions">' +
            '<button type="button" class="btn btn-quiet btn-sm" id="yer-late-template"><i class="bx bx-download"></i>' + L('Tải file mẫu','Download template') + '</button>' +
            '<button type="button" class="btn btn-outline btn-sm" id="yer-late-choose"><i class="bx bx-folder-open"></i>' + (selected ? L('Đổi file','Replace file') : L('Chọn file','Choose file')) + '</button>' +
          '</div>' +
        '</div>' +
        '<label class="yer-late-confirm"><input type="checkbox" id="yer-late-align"> <span>' +
          L('Tôi xác nhận các mục tiêu trong file đã được thống nhất với Quản lý trực tiếp trước đó.',
            'I confirm that the goals in this file were previously aligned with my line manager and I am responsible for the submitted content.') +
        '</span></label>' +
        '<div class="yer-late-actions"><span><i class="bx bx-lock-alt"></i>' + L('Sau khi nộp, bạn không thể sửa hoặc thu hồi file.','After submitting, you cannot edit or withdraw the file.') + '</span>' +
          '<button type="button" class="btn btn-default" id="yer-late-submit"><i class="bx bx-send"></i>' + L('Nộp hồ sơ','Submit file') + '</button></div>' +
      '</section>';
  }

  function latePayload(p, fileName){
    function cloneGoal(type, fallback){
      var found = (p.emp.goals || []).filter(function(g){ return g.type === type && g.status === 'approved'; })[0];
      return found ? Object.assign({}, found, { status:'imported' }) : fallback;
    }
    var what = cloneGoal('what', { id:'late-' + p.id + '-what', type:'what', title:L('Hoàn thành mục tiêu công việc năm 2026','Deliver 2026 work objectives'), result:L('Hoàn thành các kết quả đã thống nhất với Quản lý trực tiếp.','Deliver the results previously agreed with the line manager.'), status:'imported', s:'01/01', e:'31/12', prio:'h', comments:[] });
    var dev = cloneGoal('dev', { id:'late-' + p.id + '-dev', type:'dev', title:L('Phát triển năng lực chuyên môn','Develop professional capability'), result:L('Hoàn thành kế hoạch phát triển đã thống nhất với Quản lý trực tiếp.','Complete the development plan previously agreed with the line manager.'), status:'imported', s:'01/01', e:'31/12', prio:null, comments:[] });
    var goals = [what, dev];
    var scores = {}; scores[what.id] = 4; scores[dev.id] = 3;
    return {
      goals: goals,
      self: {
        at:S.session().date, late:true, source:'file-import', fileName:fileName,
        goalScores:scores, howScores:[4,3,4,4,3],
        comments:{
          what:L('Đã hoàn thành các kết quả chính theo cam kết trong năm.','Completed the key results committed for the year.'),
          dev:L('Đã thực hiện kế hoạch phát triển và áp dụng vào công việc.','Completed the development plan and applied it at work.'),
          how:L('Chủ động phối hợp, chịu trách nhiệm và duy trì tinh thần học hỏi.','Collaborated proactively, took ownership and maintained a learning mindset.')
        },
        overall:{ score:3.5, comment:L('Hoàn thành phần lớn mục tiêu và tiếp tục có cơ hội phát triển trong năm tới.','Completed most goals with further development opportunities for next year.') }
      }
    };
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
      mountSteps();
      return;
    }

    var selfOpen = Y.stepState('self', s.date) === 'open';
    var editable = selfOpen && !p.self && p.eligibility.eligible && !p.resigned;
    var html = '';

    /* Hết hạn Self nhưng còn trong timeline LM: mọi trạng thái goal đều được
       dùng luồng nộp một file riêng, không bị chặn thành Không đánh giá. */
    // Thai sản không bắt buộc tự đánh giá (§12) nên không hiện màn nộp trễ cho họ.
    if(!p.self && p.lateWindowOpen && !p.resigned && !p.maternity){
      root.innerHTML = lateUploadBlock(p);
      afterRender(p);
      return;
    }

    /* chặn khi thiếu mục tiêu (Enh 8 / điều kiện tham gia) */
    if(p.eligibility.reason === 'missing-goal'){
      var miss = [];
      if(p.eligibility.missingWhat) miss.push(L('Mục tiêu công việc','a work goal'));
      if(p.eligibility.missingDev) miss.push(L('Mục tiêu phát triển','a development goal'));
      var overdueMissing = Y.stepState('self', s.date) === 'closed';
      html += '<div class="yer-note action"><i class="bx bx-error-circle"></i><div>' +
        '<strong>' + (overdueMissing
          ? L('Bạn không thể thực hiện Tự đánh giá cuối năm','You cannot complete the Year-End self assessment')
          : L('Bạn chưa đủ điều kiện thực hiện đánh giá cuối năm','You are not eligible for the Year-End Review yet')) + '</strong><br>' +
        L('Cần tối thiểu <strong>1 Mục tiêu công việc</strong> và <strong>1 Mục tiêu phát triển</strong> đã được duyệt. Hiện còn thiếu: ',
          'You need at least <strong>one approved work goal</strong> and <strong>one approved development goal</strong>. Still missing: ') +
        '<strong>' + esc(miss.join(', ')) + '</strong>. ' +
        (overdueMissing
          ? L('Hạn Tự đánh giá đã kết thúc ngày ' + Y.fmt(Y.step('self').to, lg()) + '; hồ sơ được ghi nhận là Không đánh giá.',
              'Self assessment closed on ' + Y.fmt(Y.step('self').to, lg()) + '; this profile is recorded as Not evaluated.')
          : L('Hãy sang tab Mục tiêu để tạo và gửi Quản lý phê duyệt.',
              'Go to the Goals tab to create them and send them for approval.')) +
        /* Gộp luôn các gạch đầu dòng Lưu ý vào đây. Tách thành hai box rồi để dải quy trình
           chen vào giữa thì rối mắt, mà hai box lại nói trùng chuyện mục tiêu đã duyệt. */
        noteList(p, { skipGoalRule: true }) +
        '</div><button class="btn btn-default btn-sm yn-cta" id="yer-go-goals"><i class="bx bx-target-lock"></i>' +
        (overdueMissing ? L('Xem danh sách mục tiêu','View goal list') : L('Tới tab Mục tiêu','Go to Goals')) + '</button></div>';
      // KHÔNG dừng ở đây: nhân viên có thể đã có Mục tiêu công việc và chỉ thiếu Mục tiêu
      // phát triển. Phần đã có vẫn phải hiện ra để họ biết mình đang ở đâu,
      // chỉ là không nhập được điểm vì editable đã là false.
    }

    // Thiếu mục tiêu thì các gạch đầu dòng đã nằm trong khối cảnh báo ở trên rồi
    var hasWarnNote = p.eligibility.reason === 'missing-goal';
    html += toolbar(p, editable) + submitBanner(p) + stepper() +
      ((p.self || hasWarnNote) ? '' : noteBlock(p));

    // Thông báo thai sản nằm trong khối Lưu ý ở trên (xem noteBlock), không dựng riêng.
    // Ngày nghỉ việc hiển thị bằng badge LWD trên thẻ thông tin nhân viên (xem syncChrome),
    // không dựng khối cảnh báo giục ở đây: sắp nghỉ mà vẫn đủ điều kiện thì nhân viên
    // tự đánh giá theo đúng hạn chung, không có lý do gì phải làm sớm hơn.
    // NV thai sản không thuộc luồng nộp trễ nên không báo cửa sổ nộp trễ đã đóng
    if(!p.self && !editable && selfOpen === false && !p.maternity){
      html += '<div class="yer-note info"><i class="bx bx-info-circle"></i><div>' +
        L('Thời gian nộp trễ đã kết thúc cùng timeline của Quản lý trực tiếp vào ngày <strong>' + Y.fmt(Y.step('lm').to, lg()) + '</strong>.',
          'The late-submission window ended with the line-manager timeline on <strong>' + Y.fmt(Y.step('lm').to, lg()) + '</strong>.') + '</div></div>';
    }


    html += goalSection(p, 'what', editable) + goalSection(p, 'dev', editable) + howSection(p, editable);
    html += overallCard(p, editable) + responseCard(p);

    root.innerHTML = html;
    afterRender(p);
  }

  function afterRender(p){
    mountSteps();
    mountMascotGuide(p);
    /* mount rating control */
    document.querySelectorAll('#yer-root [data-rt]').forEach(function(node){
      var key = node.dataset.rt;
      var val = node.dataset.val === '' ? null : Number(node.dataset.val);
      U.rating(node, {
        defInto: node.dataset.def || null,
        step: node.dataset.half === '1' ? 'half' : 'int',
        value: val,
        readonly: node.dataset.ro === '1',
        compact: node.dataset.half !== '1',
        onChange: function(v){ onRating(key, v); }
      });
    });

    // Bảng mục tiêu dựng lại mỗi lần render nên phải gắn lại hover và click chi tiết
    if(window.bindReviewGoalRows) window.bindReviewGoalRows(el('yer-root'));

    document.querySelectorAll('#yer-root [data-toggle]').forEach(function(b){
      b.addEventListener('click', function(){ el(b.dataset.toggle).classList.toggle('open'); });
    });
    document.querySelectorAll('#yer-root .ev-content[contenteditable="true"]').forEach(function(ed){
      ed.addEventListener('input', function(){ collectEditors(); U.dirty.mark(); });
    });

    var go = el('yer-go-goals');
    if(go) go.addEventListener('click', function(){ window.switchMainTab(0); });
    // Liên kết trong khối Lưu ý: đổi tab ngay trong màn, không rời trang
    document.querySelectorAll('#yer-root .yer-note-link').forEach(function(a){
      a.addEventListener('click', function(ev){
        ev.preventDefault();
        window.switchMainTab(Number(a.dataset.goTab));
      });
    });
    var d = el('yer-btn-draft');
    if(d) d.addEventListener('click', function(){ collectEditors(); saveDraft(); });
    var sb = el('yer-btn-submit');
    if(sb) sb.addEventListener('click', function(){ collectEditors(); submitSelf(p); });
    var lateChoose = el('yer-late-choose');
    var lateInput = el('yer-late-file');
    var lateTemplate = el('yer-late-template');
    if(lateTemplate) lateTemplate.addEventListener('click', function(){ chooseLateTemplate(p); });
    if(lateChoose && lateInput) lateChoose.addEventListener('click', function(){ lateInput.click(); });
    if(lateInput) lateInput.addEventListener('change', function(){
      if(!lateInput.files || !lateInput.files[0]) return;
      var file = lateInput.files[0];
      if(!/\.(xlsx|xls)$/i.test(file.name)){
        U.toast(L('Vui lòng chọn file Excel .xlsx hoặc .xls','Please choose an Excel .xlsx or .xls file'));
        lateInput.value = '';
        return;
      }
      lateFileDraft = { name:file.name, size:file.size, sample:false };
      updateLateFileUi();
    });
    var lateSubmit = el('yer-late-submit');
    if(lateSubmit) lateSubmit.addEventListener('click', function(){ submitLate(p); });
    var pdf = el('yer-pdf');
    if(pdf) pdf.addEventListener('click', function(){
      U.toast(L('Đang chuẩn bị file PDF kết quả đánh giá','Preparing the result PDF'));
    });
    var rb = el('yer-btn-resp');
    if(rb) rb.addEventListener('click', function(){ submitResponse(); });

  }

  function updateLateFileUi(){
    var box = el('yer-late-file-box');
    var name = el('yer-late-file-name');
    var meta = el('yer-late-file-meta');
    var choose = el('yer-late-choose');
    if(!box || !lateFileDraft) return;
    box.classList.add('has-file');
    var icon = box.querySelector('.yer-late-file-icon i');
    if(icon) icon.className = 'bx bx-check';
    if(name) name.textContent = lateFileDraft.name;
    if(meta) meta.textContent = L('Đã chọn file - sẵn sàng để nộp','File selected - ready to submit');
    if(choose) choose.innerHTML = '<i class="bx bx-folder-open"></i>' + L('Đổi file','Replace file');
  }

  function submitLate(p){
    if(!lateFileDraft){
      U.dialog({ title:L('Chưa chọn file','No file selected'),
        text:L('Hãy chọn một file Excel gồm đầy đủ mục tiêu và nội dung tự đánh giá.','Choose one Excel file containing both goals and the self assessment.'),
        buttons:[{ label:L('Đã hiểu','Got it'), variant:'default' }] });
      return;
    }
    var ack = el('yer-late-align');
    if(!ack || !ack.checked){
      U.dialog({ title:L('Cần xác nhận mục tiêu đã thống nhất','Goal alignment confirmation required'),
        text:L('Vui lòng xác nhận các mục tiêu trong file đã được thống nhất với Quản lý trực tiếp trước khi nộp.','Confirm that the goals in the file were aligned with your line manager before submission.'),
        buttons:[{ label:L('Đã hiểu','Got it'), variant:'default' }] });
      return;
    }
    U.dialog({
      title:L('Nộp hồ sơ trễ hạn?','Submit the late file?'),
      text:L('Mục tiêu và nội dung tự đánh giá sẽ được ghi nhận cùng lúc. Mục tiêu không qua bước duyệt; hồ sơ chuyển ngay sang Quản lý trực tiếp và bạn không thể sửa hoặc thu hồi.',
             'Goals and self assessment will be recorded together. Goals skip approval; the profile moves directly to your line manager and cannot be edited or withdrawn.'),
      buttons:[
        { label:L('Kiểm tra lại','Review again'), variant:'quiet' },
        { label:L('Nộp hồ sơ','Submit file'), variant:'default', icon:'bx-send', act:function(){
            var s = S.session();
            var payload = latePayload(p, lateFileDraft.name);
            var late = { at:s.date, fileName:lateFileDraft.name, source:'employee-late', goals:payload.goals };
            S.setAct(s.emp, 'importedGoals', late);
            S.setAct(s.emp, 'lateSubmission', late);
            S.setAct(s.emp, 'self', payload.self);
            S.clearAct(s.emp, 'selfDraft');
            lateFileDraft = null;
            U.dirty.clear();
            U.toast(L('Đã nộp hồ sơ trễ hạn cho Quản lý','Late file submitted to your manager'));
            render();
          } }
      ]
    });
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
        // Mục tiêu đã chốt hoàn thành thì không có ô để nhập, nên không được đòi
        if((p.completedGoals||{})[g.id]) return;
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
          ' <span class="ec-dom">(' + esc(mgr.login) + ')</span></div>' +
        '</div>';
    }
    /* Badge nhân thân đặt ngay dưới box thông tin nhân viên: ngày làm việc cuối cùng
       và hạn nghỉ thai sản. Đây là thông tin nhân thân chứ không thuộc kỳ đánh giá, và
       chỉ để nhận diện, không đổi hạn tự đánh giá. Không mở ngoặc viết tắt vì tiếng Việt
       đã nói đủ nghĩa. */
    var col = chip && chip.parentElement && chip.parentElement.classList.contains('emp-col')
      ? chip.parentElement : null;
    if(col){
      var badges = [];
      if(p.resignFrom && !p.resigned){
        badges.push({ cls: 'yer-lwd', icon: 'bx-log-out',
          html: L('Ngày làm việc cuối cùng: ','Last working day: ') +
                '<strong>' + esc(Y.fmt(p.resignFrom, lg())) + '</strong>' });
      }
      if(p.maternity){
        badges.push({ cls: 'yer-mtn', icon: 'bx-calendar',
          html: p.maternityTo
            ? L('Nghỉ thai sản tới ngày: ','On maternity leave until: ') +
              '<strong>' + esc(Y.fmt(p.maternityTo, lg())) + '</strong>'
            : L('Đang nghỉ thai sản','On maternity leave') });
      }
      col.querySelectorAll('.emp-badge').forEach(function(b){ b.remove(); });
      badges.forEach(function(b){
        var span = document.createElement('span');
        span.className = 'emp-badge ' + b.cls;
        span.innerHTML = '<i class="bx ' + b.icon + '"></i>' + b.html;
        col.appendChild(span);
      });
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
    /* Tab Đánh giá giữa năm có hai lý do khác hẳn nhau dẫn đến "không có kết quả",
       và hai lý do đó cho ra hai hành vi UI khác nhau:
         - Onboard sau hạn của kỳ giữa năm → không thuộc kỳ, **khóa tab**, bấm không vào được.
         - Thuộc kỳ nhưng không hoàn tất (NV không làm hoặc Quản lý không chấm)
           → **vẫn mở xem lại được**, chỉ là không có kết quả.
       Luật "có thuộc kỳ giữa năm hay không" lấy từ model, không chép lại ở đây. */
    var myrDone = !!(p.myr && p.myr.submitted);
    var myrLbl = el('tablbl-myr');
    if(myrLbl) myrLbl.textContent = myrDone
      ? L('Đã hoàn tất','Completed')
      : !p.myrEligible ? L('Không đánh giá','Not evaluated')
                       : L('Không có kết quả','No result');

    var MYR_CUTOFF = function(){ return (window.PMS_YER_TIMELINE||{}).myrOnboardCutoff || '2026-04-01'; };
    var tabMyr = el('tab-myr');
    if(tabMyr){
      tabMyr.classList.toggle('disabled', !p.myrEligible);
      tabMyr.title = p.myrEligible ? ''
        : L('Onboard sau ' + Y.fmt(MYR_CUTOFF(), lg()) + ' nên không thuộc kỳ Đánh giá giữa năm 2026',
            'Onboarded after ' + Y.fmt(MYR_CUTOFF(), lg()) + ', so not part of the 2026 Mid-Year Review');
      if(!p.myrEligible && tabMyr.classList.contains('on') && typeof window.switchMainTab === 'function'){
        window.switchMainTab(0);
      }
    }
    var cnt = el('tabcnt-goals');
    if(cnt) cnt.textContent = (p.emp.goals||[]).filter(function(g){ return deletedIds().indexOf(g.id) < 0; }).length;

    var tabYer = el('tab-yer');
    if(tabYer){
      // Tab khóa trong hai trường hợp: kỳ chưa mở, hoặc nhân viên không thuộc kỳ
      // (onboard sau hạn). Luật "có thuộc kỳ hay không" lấy từ model chứ không chép lại.
      var cycleOpen = Y.cmp(s.date, Y.step('self').from) >= 0;
      var inCycle = Y.status(p, 'vi').key !== 'out';
      var locked = !cycleOpen || !inCycle;
      tabYer.classList.toggle('disabled', locked);
      tabYer.title = !inCycle
        ? L('Không thuộc kỳ Đánh giá cuối năm 2026','Not part of the 2026 Year-End Review')
        : (cycleOpen ? '' : L('Bắt đầu từ ','Opens on ') + Y.fmt(Y.step('self').from, lg()));
      // Đang đứng ở tab vừa bị khóa thì đưa về tab Mục tiêu, không để nội dung hở ra
      if(locked && tabYer.classList.contains('on') && typeof window.switchMainTab === 'function'){
        window.switchMainTab(0);
      }
    }
  }

  /* Nhãn trên tab của Nhân viên. Câu chữ riêng của vai này, nhưng **luật sinh ra
     trạng thái lấy từ model**, không chép lại ở đây (DESIGN-SYSTEM.md §20.1, §20.3).
     Chép lại là lệch: đã từng có lúc NV đã nghỉ việc vẫn hiện nhãn "Có thể nộp trễ". */
  var TAB_LABEL = {
    'out':        ['Ngoài kỳ đánh giá',        'Out of cycle'],
    'not-open':   ['Chưa mở',                   'Not open yet'],
    'resigned':   ['Đã nghỉ việc',               'Resigned'],
    'late-upload':['Có thể nộp trễ',             'Late submission available'],
    'noeval':     ['Không đánh giá',             'Not evaluated'],
    'published':  ['Đã hoàn tất',                'Completed'],
    'wait-tr':    ['Đã có kết quả của Quản lý', 'Manager result available'],
    'wait-hod':   ['Đã có kết quả của Quản lý', 'Manager result available'],
    'wait-lm2':   ['Đã có kết quả của Quản lý', 'Manager result available'],
    'wait-lm':    ['Đang chờ Quản lý',          'Awaiting manager'],
    'maternity':  ['Không yêu cầu tự đánh giá',  'Self assessment not required'],
    'need-self':  ['Cần tự đánh giá',           'Self assessment needed'],
    'no-self':    ['Không tự đánh giá',         'No self assessment']
  };

  function yerTabState(p){
    var key = Y.status(p, 'vi').key;
    // Hai trường hợp tab nói khác danh sách, vì tab nói việc của chính người đang xem
    if(key === 'wait-lm' && p.lateSubmission) return L('Nộp trễ hạn - Chờ Quản lý','Submitted late - Awaiting manager');
    if(p.responseOpen) return L('Cần xem kết quả','Result ready for you');
    var pair = TAB_LABEL[key];
    return pair ? L(pair[0], pair[1]) : '';
  }

  /* ── CSS cho trạng thái bước trong stepper ── */
  function injectCss(){
    if(document.getElementById('yer-emp-css')) return;
    var st = document.createElement('style');
    st.id = 'yer-emp-css';
    st.textContent =
      // dải quy trình do PMSUi.steps dựng; ở đây chỉ nới lại padding của thẻ
      '.yer-stepper{padding:12px 16px 12px}' +
      '.tabs{position:relative;padding-right:48px}' +
      '.yer-mascot-guide{position:absolute;right:5px;top:50%;z-index:12;transform:translateY(-50%);display:none}' +
      '.tabs:has(#tab-yer.on) .yer-mascot-guide{display:block}' +
      '.yer-mascot-trigger{position:relative;width:34px;height:34px;padding:2px;border:1px solid #efc5dc;border-radius:11px;' +
        'background:linear-gradient(145deg,#fff 15%,#fff1f7);box-shadow:0 3px 11px rgba(65,18,47,.13);cursor:pointer;display:grid;place-items:center;' +
        'transition:transform .16s ease,box-shadow .16s ease,background .16s ease}' +
      '.yer-mascot-trigger:hover,.yer-mascot-trigger:focus-visible{transform:translateY(-1px);background:#fff;' +
        'box-shadow:0 5px 16px rgba(165,0,100,.19);outline:none}' +
      '.yer-mascot-trigger:focus-visible{box-shadow:0 0 0 3px rgba(249,83,150,.22),0 6px 18px rgba(165,0,100,.20)}' +
      '.yer-mascot-trigger img{width:28px;height:28px;object-fit:contain;display:block}' +
      '.yer-mascot-trigger:hover img,.yer-mascot-trigger:focus-visible img{animation:yer-hello .72s ease-in-out 1}' +
      '.yer-mascot-dot{position:absolute;left:-2px;top:-3px;width:8px;height:8px;border:2px solid #fff;border-radius:50%;background:#f95396}' +
      '.yer-mascot-bubble{position:absolute;right:42px;top:50%;width:300px;padding:12px 14px;border:1px solid #efc5dc;border-radius:12px;' +
        'background:#fff;color:var(--z600);font-size:12px;line-height:1.5;box-shadow:0 12px 32px rgba(24,24,27,.16);opacity:0;visibility:hidden;' +
        'pointer-events:none;transform:translate(7px,-50%) scale(.985);transform-origin:right center;transition:opacity .16s ease,transform .16s ease,visibility 0s linear .16s}' +
      '.yer-mascot-guide:hover .yer-mascot-bubble,.yer-mascot-guide:focus-within .yer-mascot-bubble{opacity:1;visibility:visible;' +
        'transform:translate(0,-50%);transition-delay:0s}' +
      '.yer-mascot-bubble:after{content:"";position:absolute;left:100%;top:50%;transform:translateY(-50%);border:7px solid transparent;border-left-color:#fff}' +
      '.yer-mascot-step{display:inline-block;padding:1px 8px;border-radius:99px;background:#fff1f7;color:var(--brand);font-weight:700;white-space:nowrap}' +
      '.yer-mascot-guide.stuck{position:fixed;right:10px;top:50%;transform:translateY(-50%)}' +
      '.yer-mascot-title{font-size:13px;font-weight:700;color:var(--z900);margin-bottom:3px}' +
      '.yer-mascot-state{display:inline-flex;margin-top:8px;padding:3px 8px;border-radius:99px;background:#fff1f7;color:var(--brand);font-size:10.5px;font-weight:700}' +
      'body.pms-tour-open .yer-mascot-guide{display:none!important}' +
      '@keyframes yer-hello{0%,100%{transform:rotate(0) translateY(0)}30%{transform:rotate(-4deg) translateY(-1px)}65%{transform:rotate(3deg)}}' +
      '@media(prefers-reduced-motion:reduce){.yer-mascot-trigger,.yer-mascot-bubble{transition:none}.yer-mascot-trigger img{animation:none!important}}' +
      '@media(max-width:700px){.yer-mascot-bubble{width:min(284px,calc(100vw - 64px))}}' +
      // .info-note chỉ được định nghĩa cho #mpanel-myr nên trong #yer-root phải khai lại,
      // nếu không khối Lưu ý sẽ dính vào bảng ngay bên dưới.
      '#yer-root .info-note{display:flex;gap:8px;align-items:flex-start;margin-bottom:18px;' +
        'padding:11px 14px;background:var(--z0);border:1px solid var(--z200);border-radius:var(--r);' +
        'font-size:12px;color:var(--z600);line-height:1.5}' +
      '#yer-root .info-note>i{flex-shrink:0;margin-top:1px;font-size:15px;color:var(--brand)}' +
      '#yer-root .info-note strong{color:var(--z700);font-weight:600}' +
      '.yer-req{color:#dc2626;font-weight:700;margin-left:3px}' +
      '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;' +
        'clip:rect(0,0,0,0);white-space:nowrap;border:0}' +
      '.emp-badge{display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:var(--rxs);' +
        'border:1px solid;font-size:12px;font-weight:500;white-space:nowrap}' +
      '.emp-badge i{font-size:15px}' +
      '.emp-badge strong{font-weight:700}' +
      // Sắp nghỉ việc dùng đỏ, nghỉ chế độ dùng hồng: hai việc khác hẳn nhau
      '.yer-lwd{border-color:var(--err-bd);background:var(--err-bg);color:var(--err)}' +
      '.yer-mtn{border-color:var(--brand-ring);background:var(--brand-muted);color:var(--brand)}' +
      '.yer-op-def:empty{display:none}' +
      '.yer-op-def .rt-def{margin-top:12px}' +
      '.rt-def p{margin:0}' +
      '.rt-def p + p{margin-top:7px}' +
      // .g-done-chip và .ql-by khai báo trong stylesheet của E-05 vì tab Mục tiêu
      // và tab Đánh giá giữa năm cũng dùng, không chỉ riêng tab này
      // Dòng báo chưa có mục tiêu trong bảng: xám mờ, không viền, không nền
      '.rv-grid .g-none-row td{padding:16px 12px}' +
      '.g-none{text-align:center;font-size:12.5px;color:var(--z400);font-style:italic}' +
      '.yer-note-block{align-items:flex-start}' +
      // #yer-root .info-note strong o tren la (1,1,1) nen phai dung (1,2,0) moi thang duoc
      '#yer-root .yer-note-list .yer-hl{color:var(--brand);font-weight:700}' +
      '.yer-note-list{margin:5px 0 0;padding-left:16px;display:flex;flex-direction:column;gap:3px}' +
      '.yer-note-list li{line-height:1.55}' +
      '.yer-note-link{color:var(--brand);font-weight:600;text-decoration:underline;text-underline-offset:2px;cursor:pointer}' +
      '.yer-note-link:hover{color:var(--brand-h)}' +
      '.yer-late-upload{margin-top:18px;border:1px solid var(--z200);border-radius:12px;background:#fff;overflow:hidden;box-shadow:0 3px 14px rgba(24,24,27,.05)}' +
      '.yer-late-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:20px 22px 16px;background:linear-gradient(135deg,#fff8fb,#fff)}' +
      '.yer-late-head h2{margin:8px 0 5px;font-size:18px;line-height:1.35;color:var(--z900)}' +
      '.yer-late-head p{margin:0;color:var(--z600);font-size:12.5px;line-height:1.55}' +
      '.yer-late-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:99px;background:#fff1f2;color:#be123c;font-size:10.5px;font-weight:800}' +
      '.yer-late-count{min-width:82px;text-align:center;padding:10px 12px;border:1px solid #f4c8da;border-radius:10px;background:#fff}' +
      '.yer-late-count strong{display:block;font-size:22px;line-height:1;color:var(--brand)}.yer-late-count span{display:block;margin-top:4px;font-size:10.5px;color:var(--z500)}' +
      '.yer-late-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin:0 22px 10px;padding:0;list-style:none;border-top:1px solid var(--z200);border-bottom:1px solid var(--z200)}' +
      '.yer-late-steps li{display:flex;gap:9px;padding:13px 14px 13px 0;min-width:0}.yer-late-steps li+li{padding-left:14px;border-left:1px solid var(--z200)}' +
      '.yer-late-steps li>span{flex:none;width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:var(--brand);color:#fff;font-size:10.5px;font-weight:800}' +
      '.yer-late-steps strong{display:block;margin-bottom:2px;font-size:11.5px;color:var(--z800)}.yer-late-steps p{margin:0;font-size:10.8px;line-height:1.45;color:var(--z500)}' +
      '.yer-late-note{display:flex;align-items:flex-start;gap:7px;margin:0 22px 14px;color:var(--z600);font-size:11.5px;line-height:1.45}.yer-late-note i{flex:none;margin-top:1px;color:var(--brand);font-size:15px}' +
      '.yer-late-file{display:flex;align-items:center;gap:12px;margin:0 22px 14px;padding:15px;border:1px dashed #d4d4d8;border-radius:10px;background:#fafafa}' +
      '.yer-late-file.has-file{border-style:solid;border-color:#86d6a1;background:#f3fcf6}' +
      '.yer-late-file-icon{flex:none;width:40px;height:40px;display:grid;place-items:center;border-radius:10px;background:#fff1f7;color:var(--brand);font-size:22px}' +
      '.yer-late-file.has-file .yer-late-file-icon{background:#dcfce7;color:#15803d}' +
      '.yer-late-file-copy{min-width:0;flex:1}.yer-late-file-copy strong,.yer-late-file-copy span{display:block}.yer-late-file-copy strong{font-size:12.5px;color:var(--z800);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.yer-late-file-copy span{margin-top:3px;font-size:10.8px;color:var(--z500)}' +
      '.yer-late-file-actions{display:flex;align-items:center;gap:8px;flex:none}' +
      '.yer-late-confirm{display:flex;align-items:flex-start;gap:8px;margin:0 22px 15px;font-size:11.5px;line-height:1.5;color:var(--z600);cursor:pointer}.yer-late-confirm input{margin-top:3px;accent-color:var(--brand)}' +
      '.yer-late-actions{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 22px;border-top:1px solid var(--z200);background:var(--z50)}' +
      '.yer-late-actions>span{display:flex;align-items:center;gap:5px;font-size:10.8px;color:var(--z500)}' +
      '.yer-cv-desc{line-height:1.55}' +
      '.yer-ed-ro .ev-content{min-height:0;padding:9px 11px;color:var(--z900)}' +
      '.yer-ed-ro{border-color:var(--z200);background:var(--z50)}' +
      '.yer-ed-empty{color:var(--z500)}' +
      '.scmt-panel.yer-ro .ev-editor-wrap{box-shadow:none}' +
      '.yer-final-wrap{padding-left:14px;border-left:1px solid var(--ok-bd)}' +
      '.yer-final-val{color:var(--ok)}' +
      '.yer-final-tag{color:var(--ok);background:var(--z0);border-color:var(--ok-bd)}' +
      '.yer-late-inline{display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:3px 7px;border-radius:99px;background:#fff1f2;color:#be123c;font-size:10.5px;font-weight:700;vertical-align:middle}' +
      '#yer-root .sc-cell .rt-ro,#yer-root .ql-cell .rt-ro{justify-content:center}' +
      '#yer-root .ql-cell .rt-ro-score{font-size:13px}' +
      '@media(max-width:900px){.yer-late-steps{grid-template-columns:1fr}.yer-late-steps li+li{padding-left:0;border-left:0;border-top:1px solid var(--z200)}.yer-late-file{flex-wrap:wrap}.yer-late-file-copy{min-width:220px}.yer-late-file-actions{width:100%;justify-content:flex-end}}' +
      '@media(max-width:620px){.yer-late-head{padding:16px}.yer-late-steps,.yer-late-note,.yer-late-file,.yer-late-confirm{margin-left:16px;margin-right:16px}.yer-late-file{align-items:flex-start}.yer-late-file-actions{flex-direction:column;align-items:stretch}.yer-late-file-actions .btn{width:100%}.yer-late-actions{align-items:stretch;flex-direction:column}.yer-late-actions .btn{width:100%}}';
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
      if(e.detail && (e.detail.reason === 'emp' || e.detail.reason === 'reset')){
        U.dirty.clear();
        lateFileDraft = null;
      }
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
