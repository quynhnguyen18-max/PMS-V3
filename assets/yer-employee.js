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
  /* Bản đang hiển thị ở chế độ chỉ xem: bản đã gửi. Đang chỉnh sửa lại bản đã gửi (§8)
     thì màn đọc bản nháp như lúc chưa gửi, nên trả về null. */
  function shown(p){ return (p.self && !p.selfEditing) ? p.self : null; }
  function loadDraft(){
    var d = actsOf().selfDraft;
    draft = d ? JSON.parse(JSON.stringify(d)) : { goalScores:{}, howScores:{}, comments:{}, overall:{} };
    draft.goalScores = draft.goalScores || {}; draft.howScores = draft.howScores || {};
    draft.comments = draft.comments || {}; draft.overall = draft.overall || {};
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
        text:  L('Ba tab Danh sách mục tiêu, Đánh giá giữa năm và Đánh giá cuối năm thuộc cùng một chu kỳ. Nhãn trên hai tab đánh giá cho biết kỳ đó đang diễn ra hay đã hoàn tất.',
                 'Goals, Mid-Year Review and Year-End Review belong to the same cycle. The label on each review tab shows whether that cycle is active or completed.') },
      { sel: '#yer-steps', pose: 'run.png',
        title: L('Hồ sơ của bạn đang ở đây','Where your profile stands'),
        text:  L('Bước được tô hồng là bước đang mở. Mỗi bước ghi rõ ai phụ trách và hạn chót phải hoàn thành.',
                 'The pink step is the one currently open. Each step names its owner and the date it must be completed by.') }
    ];

    if(!p.self && p.lateWindowOpen){
      items.push({ sel: '#yer-root .yer-late-note', pose: 'think.png',
        title: L('Nộp bổ sung sau hạn','Submit after the deadline'),
        text: L('Có 4 lần nhắc nhở, mỗi lần gắn với một hình thức xử lý. Đọc và xác nhận thông báo của lần hiện tại, rồi tải lên một file gồm đầy đủ mục tiêu và nội dung tự đánh giá.',
                'There are 4 reminders, each with its own measure. Read and confirm the current one, then upload one file with both goals and the self assessment.') });
      return items;
    }

    var st = Y.selfAssessmentState(p);
    if(p.eligibility.reason === 'missing-goal' && !st.canEdit){
      items.push({ sel: '#yer-root .yer-note.action', pose: 'think.png',
        title: L('Chưa đủ điều kiện đánh giá','Not eligible for review'),
        text: L('Hạn tự đánh giá đã kết thúc và hồ sơ không đủ tối thiểu một Mục tiêu công việc cùng một Mục tiêu phát triển được duyệt.',
                'The self-assessment deadline has passed and the profile does not have at least one approved work goal and one approved development goal.') });
      return items;
    }

    if(st.mode === 'submitted' || st.mode === 'locked'){
      items.push({ sel: '#yer-root .submit-banner', pose: 'cheer.png',
        title: L('Tự đánh giá đã hoàn tất','Self assessment completed'),
        text: st.canReopen
          ? L('Bạn vẫn chỉnh sửa được tới hết ngày ' + Y.fmt(st.deadline, lg()) + ': bấm Chỉnh sửa để sửa điểm, nhận xét hoặc bổ sung mục tiêu, rồi gửi lại. Lịch sử chỉnh sửa ghi lại mỗi lần gửi.',
              'You can still edit until ' + Y.fmt(st.deadline, lg()) + ': choose Edit to change ratings, comments or add goals, then submit again. The edit history records every submission.')
          : L('Đã hết hạn chỉnh sửa nên nội dung chỉ còn ở chế độ xem. Bạn có thể xem lại các phần đánh giá và lịch sử chỉnh sửa.',
              'Editing has closed, so the content is read-only. You can review the assessment sections and the edit history.') });
    } else if(st.mode === 'closed'){
      items.push({ sel: '#yer-root .yer-note.info', pose: 'think.png',
        title: L('Đã quá hạn tự đánh giá','Self assessment is overdue'),
        text: L('Bạn không còn nhập hoặc gửi tự đánh giá. Quy trình tiếp tục sang bước Quản lý trực tiếp theo dữ liệu hiện có.',
                'You can no longer enter or submit a self assessment. The process continues to the line-manager stage with the available data.') });
    } else {
      if(st.mode === 'editing'){
        items.push({ sel: '#yer-root .yer-note.action', pose: 'think.png',
          title: L('Bạn đang chỉnh sửa bản đã gửi','You are editing a submitted assessment'),
          text: L('Bản đã gửi vẫn được giữ cho tới khi bạn gửi lại. Không gửi lại trước hạn thì hệ thống dùng bản đã gửi.',
                  'The submitted version is kept until you submit again. If you do not resubmit before the deadline, the submitted version stands.') });
      } else if(st.submitBlock){
        items.push({ sel: '#yer-root .yer-note.action', pose: 'think.png',
          title: L('Còn thiếu mục tiêu','Goals missing'),
          text: L('Bạn vẫn tự đánh giá và lưu nháp được. Nút Gửi tự đánh giá chỉ mở khi đã có tối thiểu một Mục tiêu công việc và một Mục tiêu phát triển được duyệt.',
                  'You can still self-assess and save a draft. Submit only unlocks once at least one work goal and one development goal are approved.') });
      }
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
          title: st.mode === 'editing' ? L('Gửi lại tự đánh giá','Resubmit self assessment') : L('Gửi tự đánh giá','Submit self assessment'),
          text: L('Kiểm tra đủ WHAT, HOW, Development và điểm toàn diện. Sau khi gửi, bạn vẫn chỉnh sửa được tới hết ngày ' + Y.fmt(st.deadline, lg()) + '.',
                  'Check WHAT, HOW, Development and the overall rating. After submitting you can still edit until ' + Y.fmt(st.deadline, lg()) + '.') }
      ]);
    }
    return items;
  }

  function runTour(p){
    U.tour.start(tourItems(p || prof()), { key: 'yer-emp' });
  }

  /* Tên bước hiện tại của chính người đang xem, dùng cho câu chữ của mascot. */
  function mascotStep(p){
    var st = Y.selfAssessmentState(p);
    if(!p.self && p.lateWindowOpen && !p.maternity) return L('Nộp trễ hạn','Late submission');
    if(p.eligibility.reason === 'missing-goal' && !st.canEdit) return L('Chưa đủ điều kiện','Not eligible');
    if(p.published) return L('Đã công bố kết quả','Results published');
    if(st.mode === 'editing') return L('Chỉnh sửa tự đánh giá','Editing self assessment');
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
      var sub = shown(p);
      var selfScore = sub ? (sub.goalScores||{})[g.id] : draft.goalScores[g.id];
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
      // Nhóm chưa có mục tiêu thì không có gì để nhận xét: ô nhận xét luôn chỉ xem (§40.5d)
      commentPair(p, type, editable && list.length > 0) + '</div>';
  }

  function howSection(p, editable){
    var lmOk = p.lm && !p.lm.synced;
    var rows = CORE_VALUES.map(function(cv, i){
      var sub = shown(p);
      var selfScore = sub ? (sub.howScores||[])[i] : draft.howScores[i];
      var lmScore = lmOk ? (p.lm.howScores||[])[i] : null;
      /* Giá trị cốt lõi cũng là một nhóm mục tiêu, nên cũng phải có tooltip và popup
         chi tiết như hai nhóm kia. Mô tả nối bằng xuống dòng vì ba ý là ba câu riêng;
         tooltip dùng white-space:pre-line nên giữ đúng ngắt dòng. */
      var cvName = lg()==='en'?cv.en:cv.vi;
      // data-kind="how": popup dựa vào đây để bỏ tab, vì nhóm này không có bình luận
      return '<tr data-kind="how" data-name="' + esc(cvName) + '" data-result="' + esc(cv.lines.join('\n')) + '">' +
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
    var sub = shown(p);
    var mine = sub ? (sub.comments||{})[type] : draft.comments[type];
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
    var sub = shown(p);
    var mineScore = sub && sub.overall ? sub.overall.score : (draft.overall||{}).score;
    var mineCmt = sub && sub.overall ? sub.overall.comment : (draft.overall||{}).comment;
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
    var right = '<div class="overall-panel yer-op-manager' + (lmCmt ? '' : ' locked') + '">' +
      '<div class="op-hd"><i class="bx bx-user-check"></i>' + L('Quản lý trực tiếp đánh giá','Line manager assessment') + '</div>' +
      (lmCmt
        /* Nhân viên không thấy điểm toàn diện của QLTT (§7). Trước khi công bố vẫn giữ dòng
           Điểm toàn diện để hai ô cân nhau và nói rõ điểm chưa công bố; sau khi công bố thì
           kết quả cuối cùng đã nằm ở banner nên chỉ giữ khoảng trống. */
        ? (p.published
            ? '<div class="yer-manager-score-gap" aria-hidden="true"></div>'
            : '<div class="op-score-row"><span class="op-score-lbl">' + L('Điểm toàn diện:','Overall rating:') + '</span>' +
              '<span class="yer-hidden-score">' + L('- Chưa công bố','- Not published') + '</span></div>') +
          '<label class="op-flbl">' + L('Đánh giá toàn diện của Quản lý','Manager overall assessment') + '</label>' +
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

  /* ── banner trạng thái đã gửi ────────────────────────── */
  function submitBanner(p){
    // Đang chỉnh sửa lại thì khối "Đang chỉnh sửa" thay cho banner (§8)
    if(!p.self || p.selfEditing) return '';
    var st = Y.selfAssessmentState(p);
    var sc = p.self.overall ? p.self.overall.score : null;
    // Hồ sơ nộp bổ sung luôn mang nhãn trễ hạn, kể cả sau khi công bố (§27.3)
    var isLateFile = !!p.lateSubmission;
    var daysLate = isLateFile ? Y.lateDays(p.lateSubmission.at || p.self.at) : 0;
    // Tiêu đề nói rõ đã xong việc gì, dòng phụ chỉ còn ngày gửi.
    // Trạng thái đang chờ ai đã nằm ở nhãn tab và ở dải quy trình, không lặp lại ở đây.
    var sub = p.published
      ? esc(L('Ngày công bố: ','Published on: ') + Y.fmt(p.final.publishedAt, lg()))
      : esc(L('Ngày gửi: ','Submitted on: ') + Y.fmt(p.self.at, lg())) +
        (isLateFile ? ' <span class="yer-late-status">' +
          esc(L('Trễ hạn ' + daysLate + ' ngày làm việc','Late by ' + daysLate + ' working day' + (daysLate === 1 ? '' : 's'))) + '</span>' : '');
    // Hình thức xử lý nằm ngay trong banner, dưới dòng ngày gửi (§27.3)
    if(isLateFile && p.lateRound){
      sub += '</div><div class="sb-sub yer-late-csq">' +
        L('Hình thức xử lý theo quy định (nộp ở lần nhắc nhở ' + p.lateRound.round + '/4): ',
          'Measure under policy (submitted at reminder ' + p.lateRound.round + '/4): ') +
        '<strong>' + esc(lateNowText(p.lateRound)) + '</strong>';
    }
    // Còn hạn thì nói rõ mốc cuối cùng còn chỉnh sửa được, ngay dưới ngày gửi (§8)
    if(st.canReopen){
      sub += '</div><div class="sb-sub">' + L('Bạn có thể chỉnh sửa tới hết ngày <strong>' + Y.fmt(st.deadline, lg()) + '</strong>',
        'You can edit until the end of <strong>' + Y.fmt(st.deadline, lg()) + '</strong>');
    }
    var mgr = (p.emp && p.emp.mgr) || {};
    var next = (p.lateSubmission && !p.lm && !p.published)
      ? '<div class="yer-next-step"><span>' + L('Tiếp theo:','Next:') + '</span><strong>' +
          L('Chờ Quản lý trực tiếp đánh giá','Awaiting line manager review') + '</strong>' +
          (mgr.login ? '<span> - ' + esc(mgr.login) + '</span>' : '') + '</div>'
      : '';

    var scores = '<div class="sb-score-wrap"><span class="sb-score-lbl">' + L('Điểm tự đánh giá:','Self rating:') +
      '</span><span class="sb-score-val">' + (sc == null ? '—' : sc) + '</span></div>';
    if(p.published){
      scores += '<div class="sb-score-wrap yer-final-wrap"><span class="sb-score-lbl">' +
        L('Kết quả cuối cùng:','Final result:') + '</span><span class="sb-score-val yer-final-val">' + p.final.score + '</span></div>';
    }
    return '<div class="submit-banner"><div class="sb-icon"><i class="bx bx-check-circle"></i></div>' +
      '<div class="sb-info"><div class="sb-title">' +
        (p.published ? L('Đã công bố kết quả đánh giá cuối năm 2026','Year-End Review 2026 result published')
                     : isLateFile
                       ? L('Đã hoàn thành bổ sung Tự đánh giá cuối năm','Supplemental year-end self assessment completed')
                       : L('Đã hoàn thành Tự đánh giá cuối năm','Year-end self assessment completed')) + '</div>' +
      '<div class="sb-sub">' + sub + '</div>' + next + '</div>' + scores +
      '<div class="sb-actions">' +
        (st.canReopen ? '<button class="btn btn-cta-outline btn-sm" type="button" id="yer-btn-edit"><i class="bx bx-edit-alt"></i>' +
          L('Chỉnh sửa','Edit') + '</button>' : '') +
        // Hồ sơ nộp bằng file chỉ gửi một lần nên không có lịch sử chỉnh sửa
        (!p.lateSubmission && p.selfLog && p.selfLog.length ? '<button class="btn btn-outline btn-sm" type="button" id="yer-btn-history"><i class="bx bx-history"></i>' +
          L('Lịch sử chỉnh sửa','Edit history') + '</button>' : '') +
        '<button class="btn btn-outline sb-icon-action" type="button" id="yer-pdf" ' +
        'aria-label="' + esc(L('Tải kết quả PDF','Download PDF')) + '" title="' + esc(L('Tải kết quả PDF','Download PDF')) + '">' +
        '<i class="bx bxs-file-pdf"></i></button></div></div>';
  }

  /* ── toolbar ─────────────────────────────────────────── */
  /* Hai nút Lưu nháp và Gửi. Cuộn qua khỏi chỗ cũ thì nhóm nút nổi ở giữa mép dưới
     màn hình (bindFloatingToolbar), để lúc nào cũng thấy mà không phải cuộn ngược lên.
     Thiếu mục tiêu thì nút Gửi ở trạng thái khóa nhưng vẫn bấm được để đọc lý do. */
  function toolbar(p, editable){
    if(!editable) return '';
    var st = Y.selfAssessmentState(p);
    var locked = !st.canSubmit;
    var label = st.mode === 'editing' ? L('Gửi lại tự đánh giá','Resubmit self assessment') : L('Gửi tự đánh giá','Submit self assessment');
    return '<div class="yer-toolbar"><div class="yer-actions">' +
      '<button class="btn btn-outline btn-sm" id="yer-btn-draft"><i class="bx bx-save"></i>' + L('Lưu nháp','Save draft') + '</button>' +
      '<button class="btn btn-default btn-sm' + (locked ? ' yer-btn-locked' : '') + '" id="yer-btn-submit"' +
        (locked ? ' aria-disabled="true" title="' + esc(L('Cần đủ mục tiêu đã duyệt mới gửi được','Approved goals are required before submitting')) + '"' : '') + '>' +
        '<i class="bx ' + (locked ? 'bx-lock-alt' : 'bx-send') + '"></i>' + label + '</button>' +
      '</div></div>';
  }

  function bindFloatingToolbar(){
    var bar = document.querySelector('#yer-root .yer-toolbar');
    window.removeEventListener('scroll', bindFloatingToolbar._sync, true);
    window.removeEventListener('resize', bindFloatingToolbar._sync);
    if(!bar) return;
    var actions = bar.querySelector('.yer-actions');
    function sync(){
      if(!document.body.contains(bar)) return;
      // Chỉ nổi khi đang mở tab Đánh giá cuối năm và chỗ cũ của nhóm nút đã cuộn khuất
      var r = bar.getBoundingClientRect();
      var float = !!bar.offsetParent && r.bottom < 60;
      actions.classList.toggle('floating', float);
      bar.style.minHeight = float ? actions.offsetHeight + 'px' : '';
      var demo = document.getElementById('pms-demo');
      var lift = (demo && !demo.classList.contains('hidden')) ? demo.offsetHeight : 0;
      actions.style.bottom = float ? (lift + 20) + 'px' : '';
    }
    bindFloatingToolbar._sync = sync;
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    sync();
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
      return [L('Do đang trong thời gian <strong class="yer-hl">nghỉ thai sản</strong>, bạn <strong>không bắt buộc</strong> phải thực hiện <strong>Tự đánh giá</strong> cuối năm. Tuy nhiên, bạn vẫn có thể chủ động tự đánh giá nếu muốn. Sau thời hạn Tự đánh giá, Quản lý trực tiếp sẽ tiến hành đánh giá theo đúng quy trình của Công ty.',
               'As you are on <strong class="yer-hl">maternity leave</strong>, the year-end <strong>Self assessment</strong> is <strong>not required</strong>. You can still complete it if you wish. After the self-assessment deadline, your line manager will complete the review following the Company process.')];
    }
    var items = [];
    if(!opts.skipGoalRule){
      items.push(L('Chỉ những mục tiêu đã được Quản lý trực tiếp phê duyệt mới đủ điều kiện đánh giá cuối năm. Vui lòng kiểm tra <a href="#" class="yer-note-link" data-go-tab="0">Danh sách mục tiêu</a> trước khi Tự đánh giá.',
                   'Only goals approved by your line manager qualify for the year-end review. Please check your <a href="#" class="yer-note-link" data-go-tab="0">goal list</a> before self-assessing.'));
    }
    /* Chỉ nhắc kỳ giữa năm khi có kết quả để xem lại. Không có kết quả, vì bất cứ lý do gì,
       thì không nói gì cả (§40.5c, chốt 27/09/2026). */
    if(p.myr && p.myr.submitted){
      items.push(L('Bạn có thể xem lại kết quả <a href="#" class="yer-note-link" data-go-tab="1">Đánh giá giữa năm 2026</a> của mình trước khi tự đánh giá cuối năm.',
                   'You can look back at your <a href="#" class="yer-note-link" data-go-tab="1">Mid-Year Review 2026</a> result before self-assessing.'));
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
  /* ── Bốn lần nhắc nộp bổ sung (§27.3). Luật và câu chữ hình thức xử lý ở model. ── */
  // Ngày kết thúc tạm hoãn: 6 tháng kể từ ngày nhắc lần thứ tư
  function freezeUntil(){
    var r4 = Y.lateRounds()[3].remindAt.split('-');
    var t = new Date(+r4[0], +r4[1] - 1 + 6, +r4[2]);
    return String(t.getDate()).padStart(2,'0') + '/' + String(t.getMonth() + 1).padStart(2,'0') + '/' + t.getFullYear();
  }
  function consequenceText(key){
    var t = Y.lateText(key, lg());
    if(key === 'bonus') t += L(' Thời gian tạm hoãn: từ ' + Y.fmt(Y.lateRounds()[3].remindAt, lg()) + ' đến ' + freezeUntil() + '.',
                               ' Deferral period: ' + Y.fmt(Y.lateRounds()[3].remindAt, lg()) + ' to ' + freezeUntil() + '.');
    return t;
  }
  // Hình thức xử lý áp cho hồ sơ nộp trong lần nhắc này
  function lateNowText(r){
    if(!r.consequence.length) return L('Chưa áp dụng hình thức xử lý vì nộp trong 2 lần nhắc nhở đầu tiên.',
                                       'No measure applies because it is within the first 2 reminders.');
    return r.consequence.map(consequenceText).join(' ');
  }
  // Điều xảy ra nếu hết lần nhắc này mà vẫn chưa nộp
  /* Câu cảnh báo nếu hết lần nhắc này mà vẫn chưa nộp. Bám đúng nội dung quy định (§27.3),
     chỉ nối thành câu hoàn chỉnh cho từng lần, không rút gọn thành cụm từ. */
  function lateNextText(r){
    var all = Y.lateRounds();
    if(r.next === 'remind')
      return L('hệ thống sẽ gửi nhắc nhở lần thứ ' + (r.round + 1) + ' vào ngày ' + Y.fmt(all[r.round].remindAt, lg()) + '. ',
               'the system will send reminder ' + (r.round + 1) + ' on ' + Y.fmt(all[r.round].remindAt, lg()) + '. ') +
             Y.lateText('policy', lg());
    if(r.next === 'cap3')
      return L('các biện pháp xử lý tiếp theo sẽ được áp dụng theo quy định Công ty, bắt đầu từ việc giới hạn điểm đánh giá toàn diện tối đa là 3.',
               'further measures will apply under Company policy, starting with the overall rating being capped at 3.');
    if(r.next === 'bonus')
      return L('bạn có thể bị cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng tiếp theo, tính từ ngày nhắc nhở lần thứ tư (' + Y.fmt(all[3].remindAt, lg()) + ').',
               'part of your bonus may be cut and promotion and salary increase deferred for the next 6 months, from the fourth reminder (' + Y.fmt(all[3].remindAt, lg()) + ').');
    return Y.lateText('discipline', lg());
  }
  function lateAcked(p){
    return !!(p.lateAck && p.lateRound && p.lateAck.round === p.lateRound.round);
  }

  /* Khối thông báo quá hạn, đứng trên cùng tab (§27.3). Chỉ nói về lần nhắc đang mở:
     lần thứ mấy, hạn phải hoàn thành, hình thức xử lý của lần này và cảnh báo cho lần sau.
     Chưa xác nhận thì phải đánh dấu đã đọc mới đi tiếp; xác nhận rồi thì chỉ còn nút mở popup. */
  function lateNoteBlock(p){
    var r = p.lateRound;
    var deadline = Y.fmt(r.deadline, lg());
    var days = Y.lateDays(p.now);
    var acked = lateAcked(p);
    /* Màu vàng cảnh báo (--warn), tiêu đề cỡ lớn hơn chữ thường. Chỉ nói lần nhắc thứ mấy,
       không nhắc tổng số lần. Dòng hình thức xử lý chỉ hiện khi lần này đã có hình thức áp dụng.
       Dòng Lưu ý là câu đầy đủ theo quy định, không lặp lại hạn nộp đã nói ở câu trên. */
    var nowText = r.consequence.length ? r.consequence.map(consequenceText).join(' ') : '';
    return '<div class="yer-note yer-late-note"><i class="bx bx-time-five"></i><div class="yer-late-note-body">' +
      '<div class="yer-late-note-title">' + L('Bạn đã quá hạn Tự đánh giá cuối năm - Lần nhắc thứ ' + r.round,
                     'Your Year-End self assessment is overdue - Reminder ' + r.round) + '</div>' +
      L('Hạn Tự đánh giá đã kết thúc ngày ' + Y.fmt(Y.step('self').to, lg()) + ' <strong>(trễ ' + days + ' ngày làm việc)</strong>. Bạn cần hoàn thành nộp bổ sung trước <strong>18:00 ngày ' + deadline + '</strong>.',
        'The self-assessment deadline was ' + Y.fmt(Y.step('self').to, lg()) + ' <strong>(' + days + ' working days late)</strong>. Submit your late file before <strong>18:00 on ' + deadline + '</strong>.') +
      '<ul class="yer-note-list">' +
        (nowText ? '<li>' + L('<strong>Hình thức xử lý:</strong> ','<strong>Measure:</strong> ') + esc(nowText) + '</li>' : '') +
        '<li>' + L('<strong>Lưu ý:</strong> nếu quá hạn trên mà vẫn chưa nộp, ','<strong>Note:</strong> if still not submitted by then, ') + esc(lateNextText(r)) + '</li>' +
      '</ul>' +
      (acked
        ? '<div class="yer-late-note-act"><span class="yer-late-acked"><i class="bx bx-check"></i>' +
            L('Bạn đã xác nhận ngày ' + Y.fmt(p.lateAck.at, lg()),'Confirmed on ' + Y.fmt(p.lateAck.at, lg())) + '</span>' +
            '<button type="button" class="btn btn-default btn-sm" id="yer-late-open"><i class="bx bx-cloud-upload"></i>' +
            L('Nộp bổ sung','Submit late file') + '</button></div>'
        : '<div class="yer-late-note-act"><label class="yer-late-ack-check"><input type="checkbox" id="yer-late-ack-check">' +
            '<span>' + L('Tôi đã đọc, hiểu và xác nhận tiếp tục.','I have read and understood, and wish to continue.') + '</span></label>' +
            '<button type="button" class="btn btn-default btn-sm" id="yer-late-ack-btn" disabled><i class="bx bx-check"></i>' +
            L('Xác nhận và tiếp tục','Confirm and continue') + '</button></div>') +
      '</div></div>';
  }

  function lateApprovedGoals(p){
    return (p.emp.goals || []).filter(function(g){
      return g.status === 'approved' && deletedIds().indexOf(g.id) < 0;
    });
  }

  function downloadLateTemplate(p){
    var id = p.emp && p.emp.id;
    var approved = lateApprovedGoals(p);
    var filled = {
      y9: 'YER-2026-Nguyen-Mai-Anh.xlsx',
      y10: 'YER-2026-Tran-Quoc-Huy.xlsx',
      y14: 'YER-2026-Dinh-Gia-Han.xlsx'
    };
    var hasApproved = approved.length > 0;
    var fileName = hasApproved ? filled[id] : 'YER-2026-Mau-tu-danh-gia.xlsx';
    if(!fileName){
      U.toast(L('Chưa có file mẫu cho hồ sơ này. Vui lòng liên hệ HR.','No template is available for this profile. Please contact HR.'));
      return;
    }
    var link = document.createElement('a');
    link.href = '../assets/templates/' + fileName;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    U.toast(hasApproved
      ? L('Đã tải Template kèm toàn bộ mục tiêu đã duyệt','Downloaded the template with all approved goals')
      : L('Đã tải file mẫu trống','Downloaded the blank template'));
  }

  /* Nội dung popup nộp bổ sung: ba bước tải lên như bản cũ, mở sau khi đã xác nhận thông báo */
  function lateUploadBlock(p){
    var selected = lateFileDraft && lateFileDraft.name;
    return '<section class="yer-late-upload" aria-label="' + esc(L('Các bước nộp bổ sung','Late submission steps')) + '">' +
        '<p class="yer-late-lead">' + L('Hoàn thành 3 bước dưới đây trước <strong>18:00 ngày ' + Y.fmt(p.lateRound.deadline, lg()) + '</strong>.',
                                         'Complete the 3 steps below before <strong>18:00 on ' + Y.fmt(p.lateRound.deadline, lg()) + '</strong>.') + '</p>' +
        '<ol class="yer-late-flow">' +
          '<li class="yer-late-step">' +
            '<div class="yer-late-step-head"><span class="yer-late-step-icon" aria-hidden="true"><i class="bx bx-download"></i></span><span class="yer-late-step-no">' + L('Bước 1','Step 1') + '</span></div>' +
            '<div class="yer-late-step-copy"><div class="yer-late-step-line"><strong class="yer-late-step-title">' + L('Tải xuống Template và điền thông tin theo đúng định dạng','Download the template and complete it in the required format') + '</strong>' +
            '<button type="button" class="btn btn-outline btn-sm" id="yer-late-template"><i class="bx bx-download"></i>' + L('Tải Template','Download template') + '</button></div></div>' +
          '</li>' +
          '<li class="yer-late-step yer-late-step-info">' +
            '<div class="yer-late-step-head"><span class="yer-late-step-icon" aria-hidden="true"><i class="bx bx-edit-alt"></i></span><span class="yer-late-step-no">' + L('Bước 2','Step 2') + '</span></div>' +
            '<div class="yer-late-step-copy"><strong class="yer-late-step-title">' + L('Điền đủ Mục tiêu đã thống nhất với Quản lý trực tiếp và hoàn thiện phần Tự đánh giá','Complete the goals agreed with your line manager and finish the self assessment') + '</strong>' +
            '<span class="yer-late-step-note"><i class="bx bx-info-circle"></i>' + L('Quản lý không duyệt lại mục tiêu trên hệ thống với trường hợp nhân viên trễ hạn Tự đánh giá.','Goals are not reapproved in the system when an employee submits a late self assessment.') + '</span></div>' +
          '</li>' +
          '<li class="yer-late-step">' +
            '<div class="yer-late-step-head"><span class="yer-late-step-icon" aria-hidden="true"><i class="bx bx-cloud-upload"></i></span><span class="yer-late-step-no">' + L('Bước 3','Step 3') + '</span></div>' +
            '<div class="yer-late-step-copy"><div class="yer-late-step-line"><strong class="yer-late-step-title">' + L('Tải lên tập tin đã điền thông tin','Upload the completed file') + '</strong>' +
            '<input type="file" id="yer-late-file" accept=".xlsx,.xls" hidden>' +
            '<button type="button" class="btn btn-outline btn-sm" id="yer-late-choose"><i class="bx bx-cloud-upload"></i>' + L('Chọn file','Choose file') + '</button></div>' +
            '<div class="yer-late-selected" id="yer-late-selected"' + (selected ? '' : ' hidden') + '>' +
              '<span class="yer-late-selected-name"><i class="bx bx-check-circle"></i><span id="yer-late-file-name">' + (selected ? esc(selected) : '') + '</span></span>' +
              '<button type="button" class="yer-late-remove" id="yer-late-remove" aria-label="' + L('Xóa file','Remove file') + '" title="' + L('Xóa file','Remove file') + '"><i class="bx bx-trash" aria-hidden="true"></i></button>' +
            '</div></div>' +
          '</li>' +
        '</ol>' +
        '<div class="yer-late-footer"><button type="button" class="btn btn-default" id="yer-late-submit"><i class="bx bx-send"></i>' + L('Gửi Quản lý trực tiếp','Send to line manager') + '</button></div>' +
      '</section>';
  }

  var lateDlg = null;
  function openLateDialog(p){
    if(lateDlg) lateDlg.close();
    lateDlg = U.dialog({
      className: 'yer-late-dialog',
      title: L('Nộp bổ sung hồ sơ Đánh giá cuối năm','Submit your late Year-End Review file'),
      html: lateUploadBlock(p),
      buttons: [],
      onDismiss: function(){ lateDlg = null; }
    });
    bindLateFlow(p);
  }

  function bindLateFlow(p){
    var lateChoose = el('yer-late-choose');
    var lateInput = el('yer-late-file');
    var lateRemove = el('yer-late-remove');
    var lateTemplate = el('yer-late-template');
    if(lateTemplate) lateTemplate.addEventListener('click', function(){ downloadLateTemplate(p); });
    if(lateChoose && lateInput) lateChoose.addEventListener('click', function(){
      lateInput.value = '';
      lateInput.click();
    });
    if(lateRemove) lateRemove.addEventListener('click', function(){
      lateFileDraft = null;
      if(lateInput) lateInput.value = '';
      updateLateFileUi();
    });
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
    // Quyền nhập, gửi, mở lại lấy từ model (§5, §8). Thiếu mục tiêu vẫn nhập và lưu nháp được.
    var st = Y.selfAssessmentState(p);
    var editable = st.canEdit;
    var html = '';

    /* Quá hạn và còn trong bốn lần nhắc (§27.3): màn vẫn như bình thường nhưng mọi ô đều khóa
       (editable = false vì hết hạn), khối thông báo quá hạn đứng trên cùng. Mục tiêu còn thiếu
       đi theo file nộp bổ sung nên không dựng thêm khối cảnh báo thiếu mục tiêu. */
    // Thai sản không bắt buộc tự đánh giá (§12) nên không vào luồng nộp bổ sung.
    var lateOpen = !p.self && p.lateWindowOpen && !p.resigned && !p.maternity && !!p.lateRound;
    if(lateOpen) html += lateNoteBlock(p);

    /* Thiếu mục tiêu (§5): còn hạn thì vẫn tự đánh giá và lưu nháp, chỉ khóa nút Gửi.
       Hết hạn thì hồ sơ là Không đánh giá. */
    if(p.eligibility.reason === 'missing-goal' && !lateOpen){
      var overdueMissing = !editable;
      var missName = '<strong class="yer-missing-goal">' + esc(missingGoalNames(p)) + '</strong>';
      html += '<div class="yer-note action"><i class="bx bx-error-circle"></i><div>' +
        (overdueMissing
          ? '<strong>' + L('Bạn không thể thực hiện Tự đánh giá cuối năm','You cannot complete the Year-End self assessment') + '</strong><br>' +
            L('Hồ sơ còn thiếu ' + missName + ' được duyệt. Hạn Tự đánh giá đã kết thúc ngày ' + Y.fmt(Y.step('self').to, lg()) + '; hồ sơ được ghi nhận là Không đánh giá.',
              'The profile is missing an approved ' + missName + '. Self assessment closed on ' + Y.fmt(Y.step('self').to, lg()) + '; this profile is recorded as Not evaluated.')
          : '<strong>' + L('Bạn chưa đủ điều kiện gửi Tự đánh giá cuối năm do thiếu ','You cannot submit your Year-End self assessment yet: missing an approved ') +
              missName + L(' được duyệt.','.') + '</strong><br>' +
            L('Vui lòng sang tab <a href="#" class="yer-note-link" data-go-tab="0">Danh sách mục tiêu</a> để tạo và gửi Quản lý trực tiếp phê duyệt.',
              'Please go to the <a href="#" class="yer-note-link" data-go-tab="0">Goal list</a> tab to create it and send it to your line manager for approval.') + '<br>' +
            L('Trong lúc này, bạn vẫn có thể nhập thông tin và lưu nháp bản tự đánh giá.',
              'Meanwhile, you can still enter your assessment and save it as a draft.')) +
        /* Gộp luôn các gạch đầu dòng Lưu ý vào đây. Tách thành hai box rồi để dải quy trình
           chen vào giữa thì rối mắt, mà hai box lại nói trùng chuyện mục tiêu đã duyệt. */
        noteList(p, { skipGoalRule: true }) +
        '</div><button class="btn btn-cta-outline btn-sm yn-cta" id="yer-go-goals"><i class="bx bx-target-lock"></i>' +
        (overdueMissing ? L('Xem danh sách mục tiêu','View goal list') : L('Tới Danh sách mục tiêu','Go to Goals')) + '</button></div>';
      // KHÔNG dừng ở đây: phần mục tiêu đã có vẫn hiện ra để nhân viên biết mình đang ở đâu.
    }

    /* Đang chỉnh sửa lại bản đã gửi (§8): khối này thay cho banner Đã hoàn thành,
       đứng trên dải quy trình vì đây là việc đang dở, phải gửi lại trước hạn. */
    if(st.mode === 'editing'){
      var dl = Y.fmt(st.deadline, lg());
      html += '<div class="yer-note action yer-edit-note"><i class="bx bx-edit-alt"></i><div>' +
        '<strong>' + L('Bạn đang chỉnh sửa bản Tự đánh giá đã gửi ngày ' + Y.fmt(p.self.at, lg()),
                       'You are editing the self assessment submitted on ' + Y.fmt(p.self.at, lg())) + '</strong>' +
        '<ul class="yer-note-list"><li>' +
        L('<strong>Phạm vi chỉnh sửa:</strong> Bạn có thể sửa điểm, nhận xét của mọi nhóm mục tiêu và phần đánh giá toàn diện.',
          '<strong>What you can edit:</strong> ratings and comments of every goal group and the overall assessment.') + '</li><li>' +
        L('<strong>Thêm mục tiêu mới:</strong> nếu bạn muốn bổ sung mục tiêu, vui lòng đến tab <a href="#" class="yer-note-link" data-go-tab="0">Danh sách mục tiêu</a>, thiết lập và gửi Quản lý trực tiếp phê duyệt. Mục tiêu sau khi duyệt sẽ tự động hiển thị trong tab Đánh giá cuối năm.',
          '<strong>Adding goals:</strong> to add a goal, go to the <a href="#" class="yer-note-link" data-go-tab="0">Goal list</a> tab, set it up and send it to your line manager. Once approved it appears automatically in the Year-End Review tab.') + '</li><li>' +
        L('<strong>Thời hạn và lưu ý:</strong> Vui lòng gửi lại trước <strong>18:00 ngày ' + dl + '</strong>. Sau thời hạn này, nếu chưa gửi bản mới, hệ thống sẽ tự động ghi nhận bản đã gửi gần nhất.',
          '<strong>Deadline:</strong> please resubmit before <strong>18:00 on ' + dl + '</strong>. After that, if no new version is sent, the system keeps the latest submitted version.') +
        '</li></ul></div>' +
        '<button class="btn btn-outline btn-sm yn-cta" id="yer-btn-cancel-edit"><i class="bx bx-undo"></i>' +
        L('Hủy chỉnh sửa','Discard changes') + '</button></div>';
    }

    /* Hết cả bốn lần nộp bổ sung mà chưa nộp (§27.3): chỉ còn một khối báo đã hết hạn, làm nổi
       để nhân viên thấy ngay. Không dựng khối Lưu ý nữa vì không còn việc gì để chuẩn bị. */
    var lateClosed = !p.self && !editable && selfOpen === false && !p.maternity && !p.lateWindowOpen;

    // Thiếu mục tiêu hoặc đang chỉnh sửa thì khối phía trên đã là box thông tin duy nhất (§40.5a)
    var hasWarnNote = p.eligibility.reason === 'missing-goal' || st.mode === 'editing' || lateOpen;
    html += toolbar(p, editable) + submitBanner(p) + stepper() +
      ((p.self || hasWarnNote || lateClosed) ? '' : noteBlock(p));

    // Thông báo thai sản nằm trong khối Lưu ý ở trên (xem noteBlock), không dựng riêng.
    // Ngày nghỉ việc hiển thị bằng badge LWD trên thẻ thông tin nhân viên (xem syncChrome).
    // Thiếu mục tiêu thì khối cảnh báo ở trên đã nói hồ sơ không đánh giá; không dựng box thứ hai (§40.5a)
    if(lateClosed && !hasWarnNote){
      var lateEnd = Y.fmt(Y.lateSubmissionDeadline(), lg());
      html += '<div class="yer-note action yer-late-closed"><i class="bx bx-time-five"></i><div>' +
        '<strong>' + L('Thời gian nộp bổ sung Tự đánh giá đã kết thúc lúc 18:00 ngày ' + lateEnd + '.',
                       'The late self-assessment window closed at 18:00 on ' + lateEnd + '.') + '</strong><br>' +
        L('Bạn đã không nộp sau 4 lần nhắc nhở. ','You did not submit after 4 reminders. ') + esc(Y.lateText('discipline', lg())) +
        '</div></div>';
    }

    html += goalSection(p, 'what', editable) + goalSection(p, 'dev', editable) + howSection(p, editable);
    html += overallCard(p, editable) + upperCommentsCard(p);

    root.innerHTML = html;
    afterRender(p);
  }

  /* Nhận xét của Quản lý cấp 2 và Trưởng đơn vị (§7): nhân viên chỉ đọc nhận xét, không thấy
     điểm của hai cấp này. Không có nhận xét nào thì không dựng khối, màn giữ như bình thường. */
  function upperCommentsCard(p){
    var rows = [];
    if(p.lm2 && !p.lm2.synced && String(p.lm2.comment || '').trim())
      rows.push({ id:'lm2', title:L('Nhận xét của Quản lý cấp 2','Second-level manager comment'), text:p.lm2.comment });
    if(p.hod && String(p.hod.comment || '').trim())
      rows.push({ id:'hod', title:L('Nhận xét của Trưởng đơn vị','Head of department comment'), text:p.hod.comment });
    if(!rows.length) return '';
    return '<div class="overall-card yer-upper-card"><div class="overall-hd"><i class="bx bx-message-square-detail"></i>' +
      '<span class="overall-title">' + L('Nhận xét của các cấp quản lý','Comments from upper management') + '</span></div>' +
      '<div class="overall-grid' + (rows.length === 1 ? ' yer-upper-one' : '') + '">' + rows.map(function(r){
        return '<div class="overall-panel"><div class="op-hd"><i class="bx bx-user-check"></i>' + esc(r.title) + '</div>' +
          editorHtml('yer-' + r.id + '-cmt', '', 1000, r.text, 'yer-cc-' + r.id, true) + '</div>';
      }).join('') + '</div></div>';
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
    var st = Y.selfAssessmentState(p);
    var d = el('yer-btn-draft');
    if(d) d.addEventListener('click', function(){
      collectEditors();
      // Thiếu mục tiêu: vẫn lưu, và nhắc ngay việc phải bổ sung (§5)
      if(st.submitBlock){ saveDraft(true); missingGoalDialog(p, true); }
      else saveDraft();
    });
    var sb = el('yer-btn-submit');
    if(sb) sb.addEventListener('click', function(){
      collectEditors();
      if(!st.canSubmit){ missingGoalDialog(p, false); return; }
      submitSelf(p);
    });
    var edit = el('yer-btn-edit');
    if(edit) edit.addEventListener('click', function(){ reopenSelf(p); });
    var cancelEdit = el('yer-btn-cancel-edit');
    if(cancelEdit) cancelEdit.addEventListener('click', function(){ cancelEditing(p); });
    var hist = el('yer-btn-history');
    if(hist) hist.addEventListener('click', function(){ historyDialog(p); });
    bindFloatingToolbar();
    // Khối thông báo quá hạn: đánh dấu đã đọc rồi mới xác nhận được (§27.3)
    var ackCheck = el('yer-late-ack-check');
    var ackBtn = el('yer-late-ack-btn');
    if(ackCheck && ackBtn){
      ackCheck.addEventListener('change', function(){ ackBtn.disabled = !ackCheck.checked; });
      ackBtn.addEventListener('click', function(){
        if(!ackCheck.checked) return;
        var s = S.session();
        S.setAct(s.emp, 'lateAck', { round: p.lateRound.round, at: s.date });
        render();
        // Xác nhận xong thì mở ngay popup hướng dẫn các bước nộp bổ sung
        openLateDialog(prof());
      });
    }
    var lateOpenBtn = el('yer-late-open');
    if(lateOpenBtn) lateOpenBtn.addEventListener('click', function(){ openLateDialog(p); });
    var pdf = el('yer-pdf');
    if(pdf) pdf.addEventListener('click', function(){
      U.toast(L('Đang chuẩn bị file PDF kết quả đánh giá','Preparing the result PDF'));
    });
  }

  function updateLateFileUi(){
    var selected = el('yer-late-selected');
    var name = el('yer-late-file-name');
    var choose = el('yer-late-choose');
    if(selected) selected.hidden = !lateFileDraft;
    if(name) name.textContent = lateFileDraft ? lateFileDraft.name : '';
    if(choose) choose.innerHTML = '<i class="bx bx-cloud-upload"></i>' + L('Chọn file','Choose file');
  }

  function submitLate(p){
    if(!lateFileDraft){
      U.dialog({ title:L('Chưa chọn file','No file selected'),
        text:L('Hãy chọn một file Excel gồm đầy đủ mục tiêu và nội dung tự đánh giá.','Choose one Excel file containing both goals and the self assessment.'),
        buttons:[{ label:L('Đã hiểu','Got it'), variant:'default' }] });
      return;
    }
    U.dialog({
      className:'yer-late-confirm-dialog',
      title:L('Gửi nội dung Tự Đánh giá cuối năm','Submit Year-End Self Assessment'),
      html:L('<div class="yer-late-confirm-copy"><p>Bạn xác nhận <strong>các mục tiêu</strong> trong file <strong>đã được thống nhất</strong> với Quản lý trực tiếp.</p><p><strong>Bạn chỉ có 1 lần gửi duy nhất.</strong></p><p>Sau khi gửi Tự đánh giá, bạn <strong>không thể thu hồi hoặc chỉnh sửa</strong> bất cứ nội dung nào.</p>' +
             '<p>Hồ sơ được ghi nhận <strong>trễ ' + Y.lateDays(p.now) + ' ngày làm việc</strong>, nộp ở lần nhắc nhở <strong>' + p.lateRound.round + '/4</strong>. ' + esc(lateNowText(p.lateRound)) + '</p></div>',
             '<div class="yer-late-confirm-copy"><p>You confirm that <strong>the goals</strong> in the file <strong>were agreed</strong> with your line manager.</p><p><strong>You can submit only once.</strong></p><p>After submitting your self assessment, you <strong>cannot withdraw or edit</strong> any content.</p>' +
             '<p>This is recorded as <strong>' + Y.lateDays(p.now) + ' working days late</strong>, at reminder <strong>' + p.lateRound.round + '/4</strong>. ' + esc(lateNowText(p.lateRound)) + '</p></div>'),
      buttons:[
        { label:L('Kiểm tra lại','Review again'), variant:'quiet' },
        { label:L('Xác nhận và Gửi','Confirm and submit'), variant:'default', icon:'bx-send', act:function(){
            var s = S.session();
            var payload = latePayload(p, lateFileDraft.name);
            var late = { at:s.date, fileName:lateFileDraft.name, source:'employee-late', goals:payload.goals };
            S.setAct(s.emp, 'importedGoals', late);
            S.setAct(s.emp, 'lateSubmission', late);
            S.setAct(s.emp, 'self', payload.self);
            S.clearAct(s.emp, 'selfDraft');
            lateFileDraft = null;
            if(lateDlg){ lateDlg.close(); lateDlg = null; }
            U.dirty.clear();
            U.toast(L('Gửi hồ sơ cho Quản lý trực tiếp thành công','File sent to your line manager successfully'));
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

  function missingGoalNames(p){
    var miss = [];
    if(p.eligibility.missingWhat) miss.push(L('Mục tiêu công việc','a work goal'));
    if(p.eligibility.missingDev) miss.push(L('Mục tiêu phát triển','a development goal'));
    return miss.join(L(' và ',' and '));
  }

  /* Thiếu mục tiêu: dùng chung cho lúc lưu nháp (saved) và lúc bấm nút Gửi đang khóa.
     Lưu nháp thì tiêu đề là thông báo thành công, dòng dưới là hướng dẫn việc còn thiếu.
     Không nhắc hạn ở đây: hạn đã có ở dải quy trình. */
  function missingGoalDialog(p, saved){
    U.dialog({
      title: saved ? L('Lưu nháp thành công','Draft saved') : L('Chưa gửi được Tự đánh giá','You cannot submit yet'),
      html: '<p>' + L('Bạn còn thiếu <strong>' + esc(missingGoalNames(p)) + '</strong>, hãy thiết lập và gửi cho Quản lý trực tiếp phê duyệt để tiếp tục hoàn thành Tự đánh giá.',
                      'You are still missing <strong>' + esc(missingGoalNames(p)) + '</strong>. Set it up and send it to your line manager for approval to complete your self assessment.') + '</p>',
      buttons: [
        { label:L('Để sau','Later'), variant:'quiet' },
        { label:L('Tới Danh sách mục tiêu','Go to Goals'), variant:'default', icon:'bx-target-lock', act:function(){ window.switchMainTab(0); } }
      ]
    });
  }

  /* Lịch sử chỉnh sửa (§8): mỗi lần gửi, mở lại, hủy và gửi lại đều ghi một dòng */
  function appendLog(entry){
    var s = S.session();
    var p = prof();
    var items = ((actsOf().selfLog || {}).items || []).slice();
    var now = new Date();
    var time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    items.push(Object.assign({ at: s.date, time: time, by: p ? p.emp.login : '' }, entry));
    S.setAct(s.emp, 'selfLog', { items: items });
  }

  function snapshotDraft(){
    return {
      goalScores: draft.goalScores,
      howScores: CORE_VALUES.map(function(_, i){ return draft.howScores[i]; }),
      comments: draft.comments,
      overall: draft.overall
    };
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
    var st = Y.selfAssessmentState(p);
    var again = st.mode === 'editing';
    var deadline = Y.fmt(st.deadline, lg());
    U.dialog({
      title: again ? L('Gửi lại tự đánh giá cuối năm?','Resubmit your year-end self assessment?')
                   : L('Gửi tự đánh giá cuối năm?','Submit your year-end self assessment?'),
      text: again
        ? L('Bản này sẽ thay bản đã gửi ngày ' + Y.fmt(p.self.at, lg()) + '. Bạn vẫn chỉnh sửa được tới hết ngày ' + deadline + '.',
            'This version replaces the one submitted on ' + Y.fmt(p.self.at, lg()) + '. You can still edit until ' + deadline + '.')
        : L('Nội dung sẽ được chuyển tới Quản lý trực tiếp. Bạn vẫn chỉnh sửa được tới hết ngày ' + deadline + '.',
            'Your line manager will receive the content. You can still edit until ' + deadline + '.'),
      buttons: [
        { label:L('Kiểm tra lại','Review again'), variant:'quiet' },
        { label: again ? L('Gửi lại','Resubmit') : L('Gửi tự đánh giá','Submit'), variant:'default', icon:'bx-send', act:function(){
            var s = S.session();
            var next = Object.assign({ at: s.date }, snapshotDraft());
            if(again){
              appendLog({ type:'resubmit', changes: Y.selfChanges(p.self, next) });
              S.clearAct(s.emp, 'selfEditing');
            } else {
              appendLog({ type:'submit', overall: next.overall ? next.overall.score : null });
            }
            S.setAct(s.emp, 'self', next);
            S.clearAct(s.emp, 'selfDraft');
            U.dirty.clear();
            U.toast(again ? L('Đã gửi lại tự đánh giá','Self assessment resubmitted') : L('Đã gửi tự đánh giá','Self assessment submitted'));
            render();
          } }
      ]
    });
  }

  /* Mở lại bản đã gửi để chỉnh sửa (§8). Bản đã gửi không bị xóa: nó vẫn là bản chính thức
     cho tới khi nhân viên gửi lại. Bản nháp bắt đầu từ đúng nội dung đã gửi. */
  function reopenSelf(p){
    var st = Y.selfAssessmentState(p);
    if(!st.canReopen) return;
    var deadline = Y.fmt(st.deadline, lg());
    U.dialog({
      title: L('Xác nhận chỉnh sửa Tự đánh giá đã gửi?','Edit your submitted self assessment?'),
      html: '<p>' + L('Bạn có thể sửa điểm, nhận xét, và bổ sung mục tiêu mới đến <strong>18:00 ngày ' + deadline + '</strong>.',
                      'You can change ratings and comments and add new goals until <strong>18:00 on ' + deadline + '</strong>.') + '</p>' +
            '<p class="yer-dlg-p">' + L('Nếu không gửi lại bản mới trước thời hạn trên, hệ thống sẽ tự động ghi nhận bản Tự đánh giá đã gửi gần nhất vào ngày ' + Y.fmt(p.self.at, lg()) + '.',
                      'If you do not resubmit before then, the system automatically keeps the self assessment last submitted on ' + Y.fmt(p.self.at, lg()) + '.') + '</p>',
      buttons: [
        { label:L('Để sau','Later'), variant:'quiet' },
        { label:L('Chỉnh sửa','Edit'), variant:'default', icon:'bx-edit-alt', act:function(){
            var s = S.session();
            S.clearAct(s.emp, 'selfDraft');
            S.setAct(s.emp, 'selfDraft', JSON.parse(JSON.stringify({
              goalScores: p.self.goalScores || {}, howScores: p.self.howScores || [],
              comments: p.self.comments || {}, overall: p.self.overall || {} })));
            S.setAct(s.emp, 'selfEditing', { at: s.date });
            appendLog({ type:'reopen' });
            render();
          } }
      ]
    });
  }

  function cancelEditing(p){
    U.dialog({
      title: L('Hủy chỉnh sửa?','Discard your changes?'),
      text: L('Mọi thay đổi chưa gửi sẽ bị bỏ. Bản gửi ngày ' + Y.fmt(p.self.at, lg()) + ' được giữ nguyên.',
              'All unsent changes will be discarded. The version submitted on ' + Y.fmt(p.self.at, lg()) + ' stays as it is.'),
      buttons: [
        { label:L('Tiếp tục chỉnh sửa','Keep editing'), variant:'quiet' },
        { label:L('Hủy chỉnh sửa','Discard changes'), variant:'default', act:function(){
            var s = S.session();
            S.clearAct(s.emp, 'selfEditing');
            S.clearAct(s.emp, 'selfDraft');
            appendLog({ type:'cancel' });
            U.dirty.clear();
            render();
          } }
      ]
    });
  }

  /* Lịch sử chỉnh sửa (§8.2), dựng lại cho dễ đọc:
     - Mỗi lần gửi đánh số `Lần gửi 1, 2…`. Dòng trên cùng là bản đang được ghi nhận.
     - Lần gửi lại liệt kê từng thay đổi so với lần trước, mỗi thay đổi một dòng.
     - Mở chỉnh sửa và hủy chỉnh sửa là mốc phụ, chữ nhỏ, không đánh số.
     Model chỉ trả mã và số liệu, câu chữ dựng ở đây. */
  function logEntries(p){
    var n = 0, current = 0;
    var list = (p.selfLog || []).map(function(it){
      var e = { it: it, version: null };
      if(it.type === 'submit' || it.type === 'resubmit' || it.type === 'late-file'){ n++; e.version = n; current = n; }
      e.kept = current;
      return e;
    });
    return { list: list, current: current };
  }

  function changeLines(c){
    var out = [];
    if(!c) return out;
    var none = L('trống','empty');
    if(c.overall) out.push(L('Điểm toàn diện: ','Overall rating: ') + (c.overall[0] == null ? none : c.overall[0]) + ' → ' + (c.overall[1] == null ? none : c.overall[1]));
    if(c.goalScores) out.push(L('Điểm mục tiêu: sửa ' + c.goalScores + ' mục tiêu','Goal ratings: ' + c.goalScores + ' changed'));
    if(c.howScores) out.push(L('Điểm giá trị cốt lõi: sửa ' + c.howScores + ' giá trị','Core value ratings: ' + c.howScores + ' changed'));
    var cm = (c.comments || []).map(function(t){ return lg()==='en' ? TYPE[t].en : TYPE[t].vi; });
    if(c.overallComment) cm.push(L('Đánh giá toàn diện','Overall assessment'));
    if(cm.length) out.push(L('Nhận xét đã sửa: ','Comments edited: ') + cm.join(', '));
    if(!out.length) out.push(L('Không thay đổi nội dung','No content changes'));
    return out;
  }

  function logRow(e, p, isCurrent){
    var it = e.it;
    var when = Y.fmt(it.at, lg()) + (it.time ? ' ' + it.time : '');
    var who = it.type === 'expired' ? L('Hệ thống','System') : (it.by || p.emp.login);
    var title, lines = [], minor = false;
    if(it.type === 'submit' || it.type === 'late-file'){
      title = L('Lần gửi ' + e.version,'Submission ' + e.version) + (it.type === 'late-file' ? L(' (nộp bổ sung bằng file)',' (late file)') : '');
      if(it.overall != null) lines.push(L('Điểm toàn diện: ','Overall rating: ') + it.overall);
    } else if(it.type === 'resubmit'){
      title = L('Lần gửi ' + e.version + ' - thay lần gửi ' + (e.version - 1),'Submission ' + e.version + ' - replaces submission ' + (e.version - 1));
      lines = changeLines(it.changes);
    } else if(it.type === 'reopen'){
      title = L('Mở chỉnh sửa lần gửi ' + e.kept,'Opened submission ' + e.kept + ' for editing'); minor = true;
    } else if(it.type === 'cancel'){
      title = L('Hủy chỉnh sửa, giữ nguyên lần gửi ' + e.kept,'Discarded changes, kept submission ' + e.kept); minor = true;
    } else if(it.type === 'expired'){
      title = L('Hết hạn chỉnh sửa khi chưa gửi lại','Editing closed without resubmitting');
      lines.push(L('Hệ thống ghi nhận lần gửi ' + e.kept + ' (ngày ' + Y.fmt(it.keptAt, lg()) + ')','The system keeps submission ' + e.kept + ' (' + Y.fmt(it.keptAt, lg()) + ')'));
    } else { title = it.type; }
    return '<li class="yer-log-item' + (minor ? ' minor' : '') + (e.version ? ' version' : '') + (isCurrent ? ' latest' : '') + '">' +
      '<span class="yer-log-dot" aria-hidden="true"></span><div class="yer-log-body">' +
      '<div class="yer-log-hd"><strong>' + esc(title) + '</strong>' +
        (isCurrent ? '<span class="yer-log-cur">' + L('Đang được ghi nhận','Current') + '</span>' : '') +
        '<span class="yer-log-when">' + esc(when + ' - ' + who) + '</span></div>' +
      (lines.length ? '<ul class="yer-log-tx">' + lines.map(function(l){ return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '') +
      '</div></li>';
  }

  function historyDialog(p){
    var data = logEntries(p);
    var rows = data.list.slice().reverse();
    var cur = p.self;
    var summary = cur
      ? '<div class="yer-log-sum"><i class="bx bx-check-shield"></i><div>' +
          L('Bản đang được ghi nhận: <strong>Lần gửi ' + data.current + '</strong> ngày ' + Y.fmt(cur.at, lg()),
            'Current version: <strong>submission ' + data.current + '</strong> on ' + Y.fmt(cur.at, lg())) +
          (cur.overall && cur.overall.score != null ? L(' - điểm toàn diện ',' - overall rating ') + '<strong>' + cur.overall.score + '</strong>' : '') +
          (p.selfEditing ? '<br>' + L('Bạn đang chỉnh sửa. Bản này vẫn được giữ cho tới khi bạn gửi lại.','You are editing. This version is kept until you resubmit.') : '') +
        '</div></div>'
      : '';
    var seenCurrent = false;
    U.dialog({
      className: 'yer-log-dialog',
      title: L('Lịch sử chỉnh sửa Tự đánh giá','Self assessment edit history'),
      html: summary + '<ol class="yer-log">' + rows.map(function(e){
        var isCur = !seenCurrent && e.version === data.current;
        if(isCur) seenCurrent = true;
        return logRow(e, p, isCur);
      }).join('') + '</ol>',
      buttons: [{ label:L('Đóng','Close'), variant:'quiet' }]
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

    /* Nhãn trên hai tab đánh giá nói GIAI ĐOẠN của kỳ, dùng chung cho mọi nhân viên,
       không đổi theo trạng thái của từng người (§18.4, chốt 27/09/2026). Việc cụ thể
       của từng người nằm trong nội dung tab, không nằm trên nhãn. */
    var yerLbl = el('tablbl-yer');
    if(yerLbl){
      var phase = Y.yerPhase(s.date);
      yerLbl.textContent = yerTabState(p);
      yerLbl.classList.toggle('yer-past-cycle-label', phase !== 'active');
    }
    /* MYR-SPEC §2a: chỉ khi đang ở use case của thanh demo thì tab Giữa năm mới là
       dữ liệu lịch sử của kỳ cuối năm. Không có use case thì tab là màn MYR bình thường. */
    var myrHistory = Y.myrAsHistory(p.emp.id);
    if(lastMyrHistory !== null && lastMyrHistory !== myrHistory){ location.reload(); return; }
    lastMyrHistory = myrHistory;
    var myrDone = !!(p.myr && p.myr.final !== null && p.myr.final !== undefined);
    var myrLbl = el('tablbl-myr');
    if(myrLbl && !myrHistory){
      myrLbl.textContent = L('Đang hoạt động','Active');
      myrLbl.classList.remove('yer-past-cycle-label');
    } else if(myrLbl){
      // Kỳ cuối năm đã mở thì kỳ giữa năm luôn Đã hoàn tất, kể cả người không có kết quả
      myrLbl.textContent = L('Đã hoàn tất','Completed');
      myrLbl.classList.toggle('yer-past-cycle-label', Y.cmp(s.date, Y.step('self').from) >= 0);
    }
    /* Tab Mục tiêu có nhãn theo việc cần làm: thiếu loại mục tiêu nào thì nói đúng loại đó */
    var goalLbl = el('tablbl-goals');
    if(goalLbl){
      var need = Y.goalAction(p);
      goalLbl.textContent = !need ? ''
        : (need.what && need.dev) ? L('Cần thiết lập mục tiêu','Goals needed')
        : need.what ? L('Cần thiết lập mục tiêu công việc','Work goal needed')
                    : L('Cần thiết lập mục tiêu phát triển','Development goal needed');
      goalLbl.hidden = !need;
      goalLbl.parentElement.classList.toggle('has-active-label', !!need);
    }

    var MYR_CUTOFF = function(){ return (window.PMS_YER_TIMELINE||{}).myrOnboardCutoff || '2026-04-01'; };
    var tabMyr = el('tab-myr');
    if(tabMyr && myrHistory){
      tabMyr.classList.toggle('disabled', !p.myrEligible);
      tabMyr.title = p.myrEligible ? ''
        : L('Onboard sau ' + Y.fmt(MYR_CUTOFF(), lg()) + ' nên không thuộc kỳ Đánh giá giữa năm 2026',
            'Onboarded after ' + Y.fmt(MYR_CUTOFF(), lg()) + ', so not part of the 2026 Mid-Year Review');
      if(!p.myrEligible && tabMyr.classList.contains('on') && typeof window.switchMainTab === 'function'){
        window.switchMainTab(0);
      }
    }
    if(myrHistory) syncMyrResult(p, myrDone);
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

  /* Tab MYR trong E-05 là ảnh chụp lịch sử để xem lại tại thời điểm cuối năm.
     Không dùng trạng thái "đã nộp self" của bản E-01; khi đã có điểm cuối cùng thì
     hiển thị kết quả đã hoàn thành cùng đúng người phụ trách tại kỳ MYR. */
  var lastMyrHistory = null;
  function syncMyrResult(p, completed){
    var panel = el('mpanel-myr');
    if(!panel) return;
    var draftActions = panel.querySelector('.myr-draft-actions');
    if(draftActions) draftActions.style.display = 'none';
    // Dữ liệu lịch sử: đã hết timeline nên không còn mở lại để chỉnh sửa
    var editBtn = el('myr-edit-btn');
    if(editBtn) editBtn.hidden = true;
    panel.classList.toggle('page-submitted', !!completed);

    var resultBanner = panel.querySelector('#submit-banner');
    if(resultBanner) resultBanner.hidden = !completed;
    if(!completed) return;

    var title = el('myr-result-title');
    if(title) title.textContent = L('Đã hoàn thành Đánh giá giữa năm 2026','Mid-Year Review 2026 completed');
    var manager = p.myr.lm1By || p.emp.mgr || { name:'—', login:'' };
    var managerName = manager.name + (manager.login ? ' (' + manager.login + ')' : '');
    var sub = el('myr-result-sub');
    if(sub) sub.innerHTML = L('Quản lý trực tiếp tại kỳ giữa năm: ','Line manager at Mid-Year: ') +
      '<strong>' + esc(managerName) + '</strong>';

    var selfScore = el('sb-score-val');
    if(selfScore) selfScore.textContent = p.myr.nv == null ? '—' : String(p.myr.nv);
    var scoreTag = el('sb-score-tag');
    if(scoreTag) scoreTag.hidden = true;
    var finalGroup = el('myr-final-score-group');
    if(finalGroup) finalGroup.hidden = false;
    var finalScore = el('myr-final-score');
    if(finalScore) finalScore.textContent = String(p.myr.final);
  }

  /* Nhãn tab Đánh giá cuối năm của Nhân viên: theo giai đoạn của kỳ (Y.yerPhase),
     giống nhau cho mọi người. Trạng thái riêng của từng hồ sơ không lên nhãn tab (§18.4). */
  var PHASE_LABEL = {
    'not-open': ['Chưa mở',        'Not open yet'],
    'active':   ['Đang hoạt động', 'Active'],
    'done':     ['Đã hoàn tất',    'Completed']
  };

  function yerTabState(p){
    var pair = PHASE_LABEL[Y.yerPhase(p.now)];
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
      '.tabs .tab-active-label.yer-past-cycle-label{color:var(--z600);background:var(--z100);border-color:var(--z300)}' +
      '.yer-mascot-guide{position:absolute;right:5px;top:50%;z-index:12;transform:translateY(-50%);display:none}' +
      '.tabs:has(#tab-yer.on) .yer-mascot-guide{display:block}' +
      '.yer-mascot-trigger{position:relative;width:34px;height:34px;padding:2px;border:1px solid var(--brand-ring);border-radius:11px;' +
        'background:linear-gradient(145deg,#fff 15%,var(--brand-muted));box-shadow:0 3px 11px rgba(65,18,47,.13);cursor:pointer;display:grid;place-items:center;' +
        'transition:transform .16s ease,box-shadow .16s ease,background .16s ease}' +
      '.yer-mascot-trigger:hover,.yer-mascot-trigger:focus-visible{transform:translateY(-1px);background:#fff;' +
        'box-shadow:0 5px 16px rgba(165,0,100,.19);outline:none}' +
      '.yer-mascot-trigger:focus-visible{box-shadow:0 0 0 3px rgba(249,83,150,.22),0 6px 18px rgba(165,0,100,.20)}' +
      '.yer-mascot-trigger img{width:28px;height:28px;object-fit:contain;display:block}' +
      '.yer-mascot-trigger:hover img,.yer-mascot-trigger:focus-visible img{animation:yer-hello .72s ease-in-out 1}' +
      '.yer-mascot-dot{position:absolute;left:-2px;top:-3px;width:8px;height:8px;border:2px solid #fff;border-radius:50%;background:var(--brand)}' +
      '.yer-mascot-bubble{position:absolute;right:42px;top:50%;width:300px;padding:12px 14px;border:1px solid var(--brand-ring);border-radius:12px;' +
        'background:#fff;color:var(--z600);font-size:12px;line-height:1.5;box-shadow:0 12px 32px rgba(24,24,27,.16);opacity:0;visibility:hidden;' +
        'pointer-events:none;transform:translate(7px,-50%) scale(.985);transform-origin:right center;transition:opacity .16s ease,transform .16s ease,visibility 0s linear .16s}' +
      '.yer-mascot-guide:hover .yer-mascot-bubble,.yer-mascot-guide:focus-within .yer-mascot-bubble{opacity:1;visibility:visible;' +
        'transform:translate(0,-50%);transition-delay:0s}' +
      '.yer-mascot-bubble:after{content:"";position:absolute;left:100%;top:50%;transform:translateY(-50%);border:7px solid transparent;border-left-color:#fff}' +
      '.yer-mascot-step{display:inline-block;padding:1px 8px;border-radius:99px;background:var(--brand-muted);color:var(--brand);font-weight:700;white-space:nowrap}' +
      '.yer-mascot-guide.stuck{position:fixed;right:10px;top:50%;transform:translateY(-50%)}' +
      '.yer-mascot-title{font-size:13px;font-weight:700;color:var(--z900);margin-bottom:3px}' +
      '.yer-mascot-state{display:inline-flex;margin-top:8px;padding:3px 8px;border-radius:99px;background:var(--brand-muted);color:var(--brand);font-size:10.5px;font-weight:700}' +
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
      '#yer-root .yer-note.action .yer-missing-goal{color:var(--brand);font-weight:700}' +
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
      '.yer-late-status{display:inline-flex;align-items:center;padding:1px 6px;border:1px solid var(--brand-ring);border-radius:99px;' +
        'background:var(--brand-muted);color:var(--brand);font-size:10.5px;font-weight:700;line-height:1.5}' +
      '.yer-late-confirm-copy{display:flex;flex-direction:column;gap:10px}' +
      '.yer-late-confirm-copy p{margin:0}' +
      '.yer-late-confirm-copy strong{font-weight:700;color:var(--z900)}' +
      '.yer-late-confirm-dialog .pms-dlg-bd{padding:0}' +
      '.yer-late-confirm-dialog .pms-dlg-ti{margin:0;padding:16px 52px 14px 18px;' +
        'border-bottom:1px solid var(--brand-ring);background:var(--brand-muted);color:var(--z900);font-size:16px;font-weight:700;letter-spacing:-.1px}' +
      '.yer-late-confirm-dialog .pms-dlg-tx{padding:16px 18px 18px}' +
      '.yer-late-confirm-dialog .pms-dlg-x{top:11px;right:14px}' +
      '.yer-late-upload{margin-top:18px;border:1px solid var(--z200);border-radius:12px;background:#fff;overflow:hidden;box-shadow:0 3px 14px rgba(24,24,27,.05)}' +
      '.yer-late-flow{margin:18px 22px 22px;padding:0;list-style:none;border:1px solid var(--z200);border-radius:10px;overflow:hidden;background:#fff}' +
      '.yer-late-step{display:grid;grid-template-columns:104px minmax(0,1fr);align-items:center;gap:18px;min-width:0;min-height:68px;padding:12px 16px;background:#fff}' +
      '.yer-late-step+.yer-late-step{border-top:1px solid var(--z200)}' +
      '.yer-late-step-head{display:flex;align-items:center;gap:7px}' +
      '.yer-late-step-no{font-size:10.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--brand)}' +
      '.yer-late-step-icon{flex:none;display:inline-grid;place-items:center;color:var(--z500);font-size:15px}' +
      '.yer-late-step-copy{min-width:0}' +
      '.yer-late-step-line{display:flex;align-items:center;gap:12px;flex-wrap:wrap}' +
      '.yer-late-step-title{font-size:12px;line-height:1.45;color:var(--z900)}' +
      '.yer-late-step-line .btn{flex:none}' +
      '.yer-late-step-note,.yer-late-lock{display:flex;align-items:flex-start;gap:5px;margin-top:6px;font-size:10.5px;line-height:1.45;color:var(--z500)}' +
      '.yer-late-step-note i,.yer-late-lock i{flex:none;margin-top:1px;color:var(--brand);font-size:13px}' +
      '.yer-late-selected{display:flex;align-items:center;gap:10px;min-width:0;margin-top:6px;font-size:10.5px}.yer-late-selected[hidden]{display:none}' +
      '.yer-late-selected-name{display:flex;align-items:center;gap:4px;min-width:0;color:var(--ok);overflow:hidden;white-space:nowrap}.yer-late-selected-name>span{overflow:hidden;text-overflow:ellipsis}.yer-late-selected-name i{flex:none;font-size:13px}' +
      '.yer-late-remove{display:inline-grid;place-items:center;flex:none;width:24px;height:24px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--z500);cursor:pointer}.yer-late-remove:hover{background:var(--err-bg);color:var(--err)}.yer-late-remove:focus-visible{outline:2px solid var(--brand);outline-offset:2px}.yer-late-remove i{font-size:14px}' +
      '.yer-late-footer{display:flex;justify-content:flex-end;padding:0 22px 20px}' +
      // Nhóm nút Lưu nháp và Gửi nổi ở giữa mép dưới vùng nội dung khi chỗ cũ đã cuộn khuất
      '.yer-toolbar .yer-actions.floating{position:fixed;z-index:880;left:calc(var(--sw) + (100vw - var(--sw)) / 2);transform:translateX(-50%);' +
        'padding:8px;background:var(--z0);border:1px solid var(--z200);border-radius:var(--r);box-shadow:var(--sh-lg)}' +
      '@media(max-width:900px){.yer-toolbar .yer-actions.floating{left:50%}}' +
      // Nút Gửi khi thiếu mục tiêu: nhìn là biết đang khóa, nhưng vẫn bấm được để đọc lý do
      '.btn.yer-btn-locked,.btn.yer-btn-locked:hover{background:var(--z200);border-color:var(--z200);color:var(--z600);cursor:not-allowed}' +
      '.yer-edit-note .yer-note-list{margin-top:6px}' +
      '.yer-dlg-p{margin-top:8px}' +
      '.sb-actions .btn-sm{height:30px}' +
      // Lịch sử chỉnh sửa: dạng timeline dọc, dòng mới nhất ở trên và chấm hồng
      '.yer-log-dialog{max-width:520px}' +
      '.yer-log{list-style:none;margin:6px 0 0;padding:0;position:relative}' +
      '.yer-log-item{position:relative;display:grid;grid-template-columns:14px minmax(0,1fr);gap:10px;padding-bottom:14px}' +
      '.yer-log-item:last-child{padding-bottom:0}' +
      '.yer-log-item:not(:last-child)::before{content:"";position:absolute;left:6px;top:14px;bottom:0;width:2px;background:var(--z200)}' +
      '.yer-log-dot{width:10px;height:10px;margin:4px 0 0 1px;border-radius:50%;background:var(--z300)}' +
      '.yer-log-item.latest .yer-log-dot{background:var(--brand);box-shadow:0 0 0 3px var(--brand-muted)}' +
      '.yer-log-hd{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap}' +
      '.yer-log-hd strong{font-size:13px;font-weight:600;color:var(--z900)}' +
      '.yer-log-hd span{font-size:12px;color:var(--z600);font-variant-numeric:tabular-nums}' +
      '.yer-log-tx{margin:3px 0 0;padding-left:16px;font-size:12.5px;color:var(--z700);line-height:1.5}' +
      '.yer-log-hd .yer-log-when{margin-left:auto}' +
      '.yer-log-hd .yer-log-cur{display:inline-flex;align-items:center;height:18px;padding:0 7px;border:1px solid var(--ok-bd);border-radius:50px;' +
        'background:var(--ok-bg);color:var(--ok);font-size:10.5px;font-weight:600}' +
      '.yer-log-item.latest .yer-log-dot{background:var(--ok);box-shadow:0 0 0 3px var(--ok-bg)}' +
      '.yer-log-item.minor .yer-log-hd strong{font-size:12px;font-weight:500;color:var(--z600)}' +
      '.yer-log-item.minor .yer-log-dot{width:8px;height:8px;margin:5px 0 0 2px}' +
      '.yer-log-sum{display:flex;gap:8px;align-items:flex-start;margin:4px 0 14px;padding:10px 12px;border:1px solid var(--ok-bd);' +
        'border-radius:var(--rsm);background:var(--ok-bg);font-size:12.5px;color:var(--z700);line-height:1.5}' +
      '.yer-log-sum>i{font-size:16px;color:var(--ok);margin-top:1px}' +
      '.yer-log-sum strong{color:var(--z900);font-weight:600}' +
      // Nhận xét của Quản lý cấp 2 và Trưởng đơn vị: một ô thì chiếm cả hàng
      '.yer-upper-card{margin-top:16px}' +
      // Bớt viền trong hai khối cuối trang: bỏ khung của từng ô, chỉ giữ một vạch chia giữa hai cột,
      // ô chỉ xem dùng nền xám nhạt thay cho viền
      '#yer-root .overall-card .overall-grid{gap:0;padding:0}' +
      '#yer-root .overall-card .overall-panel{border:0;border-radius:0;padding:16px 18px;background:transparent}' +
      '#yer-root .overall-card .overall-panel + .overall-panel{border-left:1px solid var(--z200)}' +
      '#yer-root .overall-card .yer-ed-ro{border:0}' +
      '.yer-hidden-score{font-size:13px;font-weight:500;color:var(--z600)}' +
      '.overall-grid.yer-upper-one{grid-template-columns:1fr}' +
      // Khối thông báo quá hạn: dòng xác nhận và nút đi tiếp
      // Khối quá hạn dùng tông vàng cảnh báo (--warn), tách khỏi khối hồng của việc cần làm thường
      '#yer-root .yer-note.yer-late-note{background:var(--warn-bg);border-color:var(--warn-bd);color:var(--z800)}' +
      '#yer-root .yer-late-note>i{color:var(--warn);font-size:18px}' +
      '#yer-root .yer-late-note strong{color:var(--z900);font-weight:700}' +
      '.yer-late-note-title{font-size:14.5px;font-weight:700;color:var(--z900);line-height:1.4;margin-bottom:3px}' +
      '.yer-late-note-act{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:10px;padding-top:10px;border-top:1px solid var(--warn-bd)}' +
      '.yer-late-acked{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--z600)}' +
      '.yer-late-acked i{color:var(--ok);font-size:15px}' +
      '.yer-late-note .yer-late-note-body{flex:1;min-width:0}' +
      '.yer-late-csq strong{color:var(--z900);font-weight:600}' +
      // Popup nộp bổ sung: rộng hơn popup thường, không có chân popup vì nút Gửi nằm trong nội dung
      '.yer-late-dialog{max-width:720px}' +
      '.yer-late-dialog .pms-dlg-ft{display:none}' +
      '.yer-late-dialog .yer-late-upload{margin:0;border:0;box-shadow:none;border-radius:0}' +
      '.yer-late-dialog .yer-late-flow{margin:10px 0 16px}' +
      '.yer-late-dialog .yer-late-footer{padding:0}' +
      '.yer-late-lead{font-size:12.5px;color:var(--z700);margin-top:2px}' +
      '.yer-late-ack-check{display:flex;align-items:flex-start;gap:8px;margin:0;font-size:12.5px;font-weight:600;color:var(--z900);cursor:pointer}' +
      '.yer-late-ack-check input{margin-top:2px;accent-color:var(--brand)}' +
      '.btn[disabled]{opacity:.5;cursor:not-allowed}' +
      '.yer-late-closed strong{font-weight:700}' +
      '.yer-cv-desc{line-height:1.55}' +
      '.yer-ed-ro .ev-content{min-height:0;padding:9px 11px;color:var(--z900)}' +
      '.yer-ed-ro{border-color:var(--z200);background:var(--z50)}' +
      '.yer-ed-empty{color:var(--z500)}' +
      '.scmt-panel.yer-ro .ev-editor-wrap{box-shadow:none}' +
      '.yer-manager-score-gap{height:20px;margin-bottom:12px}' +
      '.yer-final-wrap{padding-left:14px;border-left:1px solid var(--ok-bd)}' +
      '.yer-final-val{color:var(--ok)}' +
      '#yer-root .sc-cell .rt-ro,#yer-root .ql-cell .rt-ro{justify-content:center}' +
      '#yer-root .ql-cell .rt-ro-score{font-size:13px}' +
      '@media(max-width:620px){.yer-late-flow{margin:16px}.yer-late-step{grid-template-columns:1fr;gap:8px;padding:14px}.yer-late-step-head,.yer-late-step-copy{grid-column:1}.yer-late-step-line{align-items:flex-start;flex-direction:column}.yer-late-footer{padding:0 16px 16px}.yer-late-footer .btn{width:100%;justify-content:center}}';
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
