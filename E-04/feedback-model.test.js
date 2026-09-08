const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('employee feedback screen is named Phản hồi của tôi', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /<title>E-04 – Phản hồi của tôi \| MoMo HRM<\/title>/);
  assert.match(html, /<span class="topbar-title">Phản hồi của tôi<\/span>/);
  assert.match(html, /<h1 class="page-title">Phản hồi của tôi<\/h1>/);
});

test('employee feedback cycle selector follows the manager header pattern', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /<div class="cycle-action-row">[\s\S]*?<div class="cycle-row">[\s\S]*?<select class="cycle-sel" id="cycleSel"/);
  assert.doesNotMatch(html, /class="page-hd-tools"/);
  assert.match(html, /<option value="2026">2026<\/option>/);
  assert.doesNotMatch(html, /<option value="2026">Năm 2026<\/option>/);
  assert.match(html, /\.cycle-row\{display:flex;align-items:center;gap:8px;margin-bottom:0;white-space:nowrap\}/);
  assert.doesNotMatch(html, /\.cycle-row\{[^}]*border:/);
  assert.doesNotMatch(html, /id="cycleOpen"/);
  assert.doesNotMatch(html, /getElementById\('cycleOpen'\)/);
});

test('employee feedback supports all cycles and removes the employee info box', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /<option value="all">Tất cả<\/option>/);
  assert.doesNotMatch(html, /class="emp-chip"/);
  assert.doesNotMatch(html, /<span class="ec-lbl">Nhân viên:/);
});

test('employee answered feedback uses the shared compact question and answer pattern', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /function feedbackPair\(question,body,tail=''\)/);
  assert.match(html, /class="qa-q"><span class="qa-label">Câu hỏi:<\/span> <span class="qa-text">\$\{question\}<\/span>/);
  assert.match(html, /class="qa-a">[\s\S]*?<p class="fb-body">\$\{body\}<\/p>/);
  assert.match(html, /\.qa-q\{[^}]*width:100%[^}]*background:var\(--brand-muted\)/);
  assert.match(html, /\.qa-a::before\{[^}]*top:-2px[^}]*border-bottom/);
  assert.match(html, /\.qa-a \.fb-body\{[^}]*font-size:12\.5px[^}]*background:transparent/);
  assert.match(html, /cardReceived\(f\)[\s\S]*feedbackPair\(f\.q,f\.body,expandBtn\(\)\)/);
  assert.match(html, /cardGiven\(f\)[\s\S]*feedbackPair\(f\.q,f\.body,expandBtn\(\)\)/);
});

test('employee request due field is limited to 90 days and expired requests are locked', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html,/Yêu cầu có hiệu lực tối đa 90 ngày kể từ ngày tạo\./);
  assert.match(html,/function configureReqDueRange\(\)/);
  assert.match(html,/due\.min=range\.min;due\.max=range\.max/);
  /* Luật vòng đời chỉ được viết một lần, trong model. Màn hình gọi lại chứ không chép,
     vì bản chép cũ coi yêu cầu không có người phản hồi nào là 'complete'. */
  assert.match(html,/function requestLifecycleStatus\(request,today=todayDMY\(\)\)\{return FeedbackModel\.requestStatus\(request,today\);\}/);
  assert.doesNotMatch(html,/return 'no_response'/);
  assert.match(html,/Không phản hồi/);

  const model=require('./feedback-model.js');
  const expired={date:'01/01/2026',due:'15/01/2026',reviewers:[{st:'pending'}]};
  assert.equal(model.requestStatus(expired,'01/06/2026'),'no_response');
  assert.equal(model.requestStatus({date:'01/06/2026',due:'15/06/2026',reviewers:[{st:'pending'}]},'20/06/2026'),'overdue');
  assert.equal(model.requestStatus({date:'01/06/2026',due:'30/06/2026',reviewers:[]},'10/06/2026'),'collecting');
});

test('employee request reminders show automatic timing and enforce a rolling 24-hour cooldown', () => {
  const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
  assert.match(html,/id:'req-active-collaboration'/);
  assert.match(html,/due:'28\/08\/2026', status:'open'/);
  assert.match(html,/lifecycle==='overdue'[\s\S]*?chip ch-overdue/);
  assert.match(html,/class="rv-pending-tag \$\{locked\?'is-locked':''\}"/);
  assert.match(html,/\.rv-pending-tag\{[^}]*border:0[^}]*background:transparent[^}]*color:var\(--warn\)/);
  assert.match(html,/function canRemindReviewer\(request,reviewer,now=nowDMYTime\(\)\)/);
  assert.match(html,/Hệ thống sẽ tự động nhắc ngày/);
  assert.match(html,/Lần nhắc tiếp theo/);
  assert.match(html,/Đã nhắc: \$\{history\.length\} lần/);
  assert.doesNotMatch(html,/event\.type==='automatic'\?'Tự động':'Thủ công'/);
});

test('employee request feed card omits the aggregate reminder-count line', () => {
  const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
  const cardFn=html.match(/function cardRequest\(f,idx\)\{[\s\S]*?\n\}/)?.[0]||'';
  assert.doesNotMatch(cardFn,/requestReminderSummary/);
  assert.doesNotMatch(html,/function requestReminderSummary/);
  assert.doesNotMatch(cardFn,/Đã nhắc:/);
});

test('employee feedback warns before discarding instead of offering draft saving', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const confirm = html.match(/id="dlg-confirm"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/)?.[0] || '';
  assert.match(confirm, /Nội dung bạn đang nhập chưa được gửi/);
  assert.match(confirm, /Tiếp tục chỉnh sửa/);
  assert.match(confirm, /Xóa nội dung/);
  assert.doesNotMatch(confirm, /Lưu nháp/);
  assert.doesNotMatch(html, /onclick="saveDraft\(\)"/);
});

test('response queue popup omits the urgency sorting helper text', () => {
  const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
  assert.doesNotMatch(html,/Sắp theo độ khẩn — quá hạn lên đầu/);
});
const FeedbackModel = require('./feedback-model.js');

test('question AI makes vague prompts more concrete without inventing project context', () => {
  const QuestionAI = require('./request-question-ai.js');
  const suggestion = QuestionAI.improve('Bạn thấy tôi làm việc thế nào?', 0);

  assert.match(suggestion, /ví dụ cụ thể/i);
  assert.match(suggestion, /đang làm tốt/i);
  assert.match(suggestion, /cải thiện/i);
  assert.doesNotMatch(suggestion, /Migration|Roadmap|DevOps/i);
});

test('question AI returns a distinct second variant and handles empty input', () => {
  const QuestionAI = require('./request-question-ai.js');
  const source = 'Bạn nhận xét gì về cách phối hợp của tôi?';

  assert.equal(QuestionAI.improve('   ', 0), '');
  assert.notEqual(QuestionAI.improve(source, 0), QuestionAI.improve(source, 1));
});

test('request popup exposes AI controls for the common question', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  assert.match(html, /<script src="request-question-ai\.js"><\/script>/);
  assert.match(html, /id="reqCommonAiPanel"/);
  assert.match(html, /id="reqCommonAiStatus"/);
  assert.match(html, /id="reqCommonAiBtn"[^>]*onclick="runReqQuestionAI\('common'\)"/);
  assert.match(html, /function acceptReqQuestionAI\(key\)/);
});

test('personalized request AI is focus-aware and reviewer state is removed with reviewer', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  assert.match(html, /activeQuestionKey:'common'/);
  assert.match(html, /byReviewer:\{\}/);
  assert.match(html, /onfocus="activateReqQuestion\('\$\{r\.dom\}'\)"/);
  assert.match(html, /Đang chỉnh câu hỏi cho \$\{r\.name\}/);
  assert.match(html, /delete R\.ai\.byReviewer\[dom\]/);
  assert.doesNotMatch(html, /improveAll|cải thiện tất cả/i);
});

test('reopening the request popup restores the common AI button state', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const openRequest = html.match(/function openRequest\(\)\{[\s\S]*?\n\}/)?.[0] || '';
  assert.match(openRequest, /restoreReqDraft\(\);\s*renderReqCommonAi\(\);/);
});

test('accepted request AI collapses the suggestion panel and keeps improve again available', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const panelMarkup = html.match(/function reqAiPanelMarkup\(key\)\{[\s\S]*?\n\}/)?.[0] || '';
  const commonRenderer = html.match(/function renderReqCommonAi\(\)\{[\s\S]*?\n\}/)?.[0] || '';

  assert.match(panelMarkup, /if\(state\.used\) return '';/);
  assert.match(commonRenderer, /state\.used\?'Cải thiện lại':'Cải thiện với AI'/);
  assert.match(html, /reqAiState\(r\.dom\)\.used\?'Cải thiện lại':'Cải thiện với AI'/);
});

const feed = [
  { id:'direct-1', kind:'received', cycle:'2026', date:'01/01/2026', ts:20260101,
    who:{name:'Người gửi trực tiếp', dom:'direct.user'}, body:'Phản hồi trực tiếp', cv:['A'] },
  { id:'req-1', kind:'request', cycle:'2026', date:'02/01/2026', ts:20260102,
    question:'Câu hỏi chung', reviewers:[
      { id:'reviewer-1', name:'Người hoàn tất', dom:'done.user', st:'done', repliedAt:'03/01/2026 · 10:30', fb:'Đã trả lời', cv:['B'], vis:'receiver' },
      { id:'reviewer-2', name:'Người đang chờ', dom:'pending.user', st:'pending' }
    ] }
];

test('projects completed request reviewers into received responses and excludes pending reviewers', () => {
  const normalized = FeedbackModel.normalizeFeed(feed);
  const projected = normalized.filter(item => item.requestId === 'req-1');

  assert.equal(projected.length, 1);
  assert.equal(projected[0].kind, 'received');
  assert.equal(projected[0].who.dom, 'done.user');
  assert.equal(projected[0].q, 'Câu hỏi chung');
  assert.equal(projected[0].body, 'Đã trả lời');
});

test('removes core-value badges from HR-originated request responses', () => {
  const response=FeedbackModel.createGivenResponse({
    id:'hr-response',cycle:'2026',date:'12/08/2026',recipient:{name:'Tú',dom:'tu.nguyen'},body:'Nội dung',vis:'receiver',cv:['A'],requestSource:'hr'
  });
  const projected=FeedbackModel.normalizeFeed([{id:'hr-request',kind:'request',requestSource:'hr',date:'12/08/2026',reviewers:[{name:'Người phản hồi',dom:'reviewer',st:'done',fb:'Nội dung',cv:['A']}]}]).find(item=>item.requestId==='hr-request');
  assert.deepEqual(response.cv,[]);
  assert.equal(response.requestSource,'hr');
  assert.deepEqual(projected.cv,[]);
  assert.equal(projected.requestSource,'hr');
});

test('employee feedback renders HR request items from the shared structured program', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/hrQueueFromProgram\('s12',SELF\.dom\)/);
  assert.match(html,/hrQueueFromProgram\('s13',SELF\.dom\)/);
  assert.match(html,/from:`HR - \$\{requester\.name\}`/);
  assert.match(html,/feedbackReceiver:participant\.employee/);
  assert.match(html,/questions:detail\.questions\|\|\[\]/);
  assert.match(html,/function renderHrReplyQuestions\(item\)/);
  assert.match(html,/Hiện tại chỉ HR xem được kết quả phản hồi này/);
  assert.match(html,/Danh tính người cho phản hồi: <strong>/);
  assert.match(html,/#dlg-reply #replyDialog\.hr-structured-reply \.dlg-meta\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(html,/classList\.toggle\('hr-structured-reply',isHrQueueRequest\(item\)\)/);
  assert.equal((html.match(/id="replyDialog"/g)||[]).length,1);
  assert.ok(html.indexOf('id="replyDialog"')>html.indexOf('id="dlg-reply"'));
  assert.match(html,/Lời ngỏ từ HR/);
  assert.match(html,/<div class="field" id="replyCvField">\r?\n\s*<label class="field-label">Huy hiệu.*<\/label>\r?\n\s*<div class="cvpick-row" id="replyCvPick"><\/div>/);
  assert.equal((html.match(/id="replyCvField"/g)||[]).length,1);
  assert.match(html,/isHrQueueRequest\(RV\.item\)\)\{RV\.cvs=\[\];field\.hidden=true/);
  assert.match(html,/if\(!isHr\)FEED\.unshift\(FeedbackModel\.createGivenResponse/);
});

test('received filter returns direct and request responses exactly once', () => {
  const received = FeedbackModel.itemsForFilter(feed, 'received', '2026');

  assert.deepEqual(received.map(item => item.id).sort(), ['direct-1', 'resp-req-1-done.user']);
});

test('all-cycle filter returns feedback across years', () => {
  const acrossYears = feed.concat({ id:'old', kind:'received', cycle:'2025', date:'01/01/2025', ts:20250101, who:{name:'Old',dom:'old'}, body:'Old' });
  const received = FeedbackModel.itemsForFilter(acrossYears, 'received', 'all');
  assert.deepEqual(received.map(item=>item.id).sort(), ['direct-1','old','resp-req-1-done.user']);
});

test('employee requests sort by action priority with the approved tie breakers', () => {
  const reviewer=(st,repliedAt=null)=>({st,repliedAt});
  const requests=[
    {id:'closed-old',kind:'request',date:'01/04/2026',due:'20/04/2026',reviewers:[reviewer('pending')]},
    {id:'complete-old',kind:'request',date:'01/07/2026',due:'20/07/2026',reviewers:[reviewer('done','08/08/2026 · 09:00')]},
    {id:'collect-later',kind:'request',date:'01/08/2026',due:'20/08/2026',reviewers:[reviewer('pending')]},
    {id:'overdue-newer',kind:'request',date:'01/07/2026',due:'01/08/2026',reviewers:[reviewer('pending')]},
    {id:'collect-low-rate',kind:'request',date:'02/08/2026',due:'15/08/2026',reviewers:[reviewer('pending'),reviewer('pending')]},
    {id:'complete-new',kind:'request',date:'02/07/2026',due:'22/07/2026',reviewers:[reviewer('done','09/08/2026 · 09:00')]},
    {id:'closed-recent',kind:'request',date:'01/05/2026',due:'20/05/2026',reviewers:[reviewer('pending')]},
    {id:'collect-high-rate',kind:'request',date:'01/08/2026',due:'15/08/2026',reviewers:[reviewer('done','08/08/2026 · 09:00'),reviewer('pending')]},
    {id:'collect-soon',kind:'request',date:'03/08/2026',due:'12/08/2026',reviewers:[reviewer('pending')]},
    {id:'overdue-older',kind:'request',date:'01/07/2026',due:'25/07/2026',reviewers:[reviewer('pending')]}
  ];
  assert.deepEqual(FeedbackModel.sortRequestsForAction(requests,'10/08/2026').map(item=>item.id),[
    'overdue-older','overdue-newer',
    'collect-soon','collect-low-rate','collect-high-rate','collect-later',
    'complete-new','complete-old',
    'closed-recent','closed-old'
  ]);
});

test('creates canonical given response records for authored feedback', () => {
  const response = FeedbackModel.createGivenResponse({
    id:'given-1', cycle:'2026', date:'03/08/2026', recipient:{name:'Mai', dom:'mai.tran', ini:'MT', org:'ITC'},
    body:'Cảm ơn bạn', vis:'receiver', cv:['A'], requestId:'queue-1'
  });

  assert.deepEqual(response, {
    id:'given-1', kind:'given', cycle:'2026', date:'03/08/2026', ts:20260803,
    who:{name:'Mai', dom:'mai.tran', ini:'MT', org:'ITC'}, body:'Cảm ơn bạn', vis:'receiver', cv:['A'], backgroundId:null, requestId:'queue-1', status:'submitted'
  });
});

test('preserves the selected background on authored feedback', () => {
  const response = FeedbackModel.createGivenResponse({
    id:'given-bg', cycle:'2026', date:'03/08/2026', recipient:{name:'Mai', dom:'mai.tran'},
    body:'Cảm ơn bạn', vis:'receiver', backgroundId:'hearts'
  });

  assert.equal(response.backgroundId, 'hearts');
});

test('prototype 2026 data exposes all eight request responses in Received', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const match = html.match(/const FEED = (\[[\s\S]*?\n\]);/);
  assert.ok(match, 'FEED fixture must be extractable from the prototype');
  const prototypeFeed = vm.runInNewContext(`(${match[1]})`);
  const received = FeedbackModel.itemsForFilter(prototypeFeed, 'received', '2026');
  const fromRequests = received.filter(item => item.requestId);

  assert.equal(fromRequests.length, 8);
  // 8 câu trả lời theo yêu cầu + 4 phản hồi gieo sẵn (rcv-1, rcv-2, rcv-3, rcv-5) trong chu kỳ 2026
  assert.equal(received.length, 12);
  assert.equal(new Set(received.map(item => item.id)).size, received.length);
});

test('unread seed feedback demonstrates postcard and handwritten-letter backgrounds', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const match = html.match(/const FEED = (\[[\s\S]*?\n\]);/);
  const prototypeFeed = vm.runInNewContext(`(${match[1]})`);
  assert.equal(prototypeFeed.find(item=>item.id==='rcv-2').backgroundId, 'postcard');
  assert.equal(prototypeFeed.find(item=>item.id==='rcv-3').backgroundId, 'letter');
});

test('reply popup reuses the concise visibility labels and omits the one-time-send footer note', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');

  assert.match(html, /id="rvisR"[\s\S]*?Chỉ người nhận/);
  assert.match(html, /id="rvisM"[\s\S]*?Người nhận \+ Quản lý của họ/);
  assert.doesNotMatch(html, /Gửi một lần — sau khi gửi không thể chỉnh sửa/);
});

test('manager-requested reply explains transparent sharing without evaluation language', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  assert.match(html, /Phản hồi này được chia sẻ minh bạch với các bên liên quan/);
  assert.match(html, /Nội dung bạn chia sẻ sẽ được cả \$\{item\.from\} và \$\{item\.aboutName\} xem/);
  assert.match(html, /Phản hồi không dùng để chấm điểm hoặc xếp hạng/);
});

test('unread received feedback opens in a dedicated background reader', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  assert.match(html, /id="dlg-received-reader"[^>]*onclick="if\(event\.target===this\)closeReceivedReader\(\)"/);
  assert.match(html, /id="receivedReaderClose"[^>]*onclick="closeReceivedReader\(\)"/);
  assert.match(html, /function openReceivedReader\(id\)/);
  assert.match(html, /function closeReceivedReader\(\)/);
  assert.match(html, /onclick="openReceivedReader\('\$\{f\.id\}'\)"/);
  assert.match(html, /class="reader-content-canvas"/);
  assert.match(html, /GIVE_BGS\.find\(item=>item\.id===f\.backgroundId\)/);
});

test('reader marks feedback read only on close and keeps the feed card neutral', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const openFn = html.match(/function openReceivedReader\(id\)\{[\s\S]*?\n\}/)?.[0] || '';
  const closeFn = html.match(/function closeReceivedReader\(\)\{[\s\S]*?\n\}/)?.[0] || '';
  const cardFn = html.match(/function cardReceived\(f\)\{[\s\S]*?\n\}/)?.[0] || '';
  assert.doesNotMatch(openFn, /opened\s*=\s*true/);
  assert.match(closeFn, /fbState\(f\)\.opened=true/);
  assert.match(closeFn, /renderFeed\(\)/);
  assert.doesNotMatch(cardFn, /backgroundId|GIVE_BGS|reader-content-canvas/);
  assert.doesNotMatch(html, /localStorage[^\n]*(opened|FB_STATE)|(opened|FB_STATE)[^\n]*localStorage/);
});

test('media campaign is active only inside its configured window', () => {
  const campaign={id:'imprint-aug',startAt:'2026-08-01T00:00:00+07:00',endAt:'2026-08-31T23:59:59+07:00'};
  assert.equal(FeedbackModel.campaignStatus(campaign,'2026-08-10T10:00:00+07:00'),'active');
  assert.equal(FeedbackModel.campaignStatus(campaign,'2026-07-31T23:59:59+07:00'),'scheduled');
  assert.equal(FeedbackModel.campaignStatus(campaign,'2026-09-01T00:00:00+07:00'),'ended');
});

test('media snapshot includes received feedback in the campaign cycle up to snapshot time', () => {
  const feed=[
    {id:'a',kind:'received',cycle:'2026',date:'01/08/2026',ts:20260801},
    {id:'b',kind:'received',cycle:'2026',date:'20/08/2026',ts:20260820},
    {id:'c',kind:'received',cycle:'2025',date:'01/08/2025',ts:20250801}
  ];
  assert.deepEqual(FeedbackModel.snapshotReceivedFeedback(feed,{cycleYear:'2026',snapshotAt:'10/08/2026'}).map(item=>item.id),['a']);
});

test('the latest active media campaign is selected independently within one year', () => {
  const campaigns=[
    {id:'first',startAt:'2026-03-01T00:00:00+07:00',endAt:'2026-03-31T23:59:59+07:00'},
    {id:'second',startAt:'2026-08-01T00:00:00+07:00',endAt:'2026-08-31T23:59:59+07:00'}
  ];
  assert.equal(FeedbackModel.activeMediaCampaign(campaigns,'2026-08-10T10:00:00+07:00').id,'second');
});

test('employee media summary renders only for an active campaign and keeps viewed state in session memory', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/const MEDIA_CAMPAIGNS = \[/);
  assert.match(html,/id="mediaSummaryEntry"/);
  assert.match(html,/function renderMediaSummaryEntry\(\)/);
  assert.match(html,/FeedbackModel\.activeMediaCampaign/);
  assert.match(html,/Dấu ấn của bạn/);
  assert.match(html,/viewedCampaignIds:new Set\(\)/);
  assert.doesNotMatch(html,/localStorage[^\n]*viewedCampaignIds|viewedCampaignIds[^\n]*localStorage/);
});

test('media summary collapses after close by button or backdrop', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/id="mediaSummaryOverlay"[^>]*onclick="if\(event\.target===this\)closeMediaSummary\(\)"/);
  assert.match(html,/onclick="closeMediaSummary\(\)"/);
  assert.match(html,/MEDIA_STATE\.viewedCampaignIds\.add\(MEDIA_STATE\.campaign\.id\)/);
  assert.match(html,/Xem lại Dấu ấn của bạn/);
});

test('media summary viewer renders an admin template story with anonymous AI insights', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/id="mediaSummaryOverlay"/);
  assert.match(html,/id="mediaPosterStage"/);
  assert.match(html,/function renderMediaPoster\(\)/);
  assert.match(html,/function moveMediaPoster\(direction\)/);
  assert.match(html,/Insight được AI diễn giải từ feedback và không hiển thị danh tính người gửi/);
  assert.doesNotMatch(html,/Thiết kế poster được quản trị bởi System Admin/);
  /* Chỉ soi khối dữ liệu campaign: insight của AI không được kèm danh tính người gửi.
     Quét cả file sẽ bắt nhầm các object `who:` hợp lệ ở phần feed phía dưới. */
  const campaignBlock=html.slice(html.indexOf('const MEDIA_CAMPAIGNS'),html.indexOf('const MEDIA_STATE'));
  assert.doesNotMatch(campaignBlock,/insights:\s*\[[\s\S]*?who:/);
});

test('active media campaigns expose current and all-poster downloads only inside the viewer', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/function downloadCurrentMediaPoster\(\)/);
  assert.match(html,/function downloadAllMediaPosters\(\)/);
  assert.match(html,/Tải poster này/);
  assert.match(html,/Tải tất cả/);
  assert.match(html,/FeedbackModel\.campaignStatus\(MEDIA_STATE\.campaign,MEDIA_NOW\)!=='active'/);
});

test('media summary identifies the colleague who gave the most feedback', () => {
  const feedback=[
    {kind:'received',who:{name:'Mai Thị Hằng',dom:'hang.mai'}},
    {kind:'received',who:{name:'Lê Thành Nam',dom:'nam.le'}},
    {kind:'received',who:{name:'Mai Thị Hằng',dom:'hang.mai'}},
    {kind:'given',who:{name:'Mai Thị Hằng',dom:'hang.mai'}}
  ];
  assert.deepEqual(FeedbackModel.mostFrequentFeedbackGiver(feedback),{name:'Mai Thị Hằng',dom:'hang.mai',count:2});
});

test('answering a line-manager request shows one question and is always shared', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  const model=require(path.join(__dirname,'..','M-04','manager-request-model.js'));

  // luật gốc bên M-04: mỗi người cho phản hồi nhận đúng 1 câu hỏi, visibility cố định 'shared'
  const request=model.createRequest({
    goal:'G', cycle:'2026', createdAt:'01/08/2026', due:'20/08/2026',
    designees:[{id:'e1',name:'A',login:'a'}],
    reviewers:[{name:'B',login:'b'},{name:'C',login:'c'}],
    sharedQuestion:'Một câu hỏi duy nhất?'
  });
  assert.equal(request.visibility,'shared');
  assert.equal(request.reviewerCanChangeVisibility,false);
  request.assignments.forEach(item=>{
    assert.equal(typeof item.question,'string');
    assert.equal(item.question,'Một câu hỏi duy nhất?');
  });

  // card trên màn nhân viên phải bám đúng luật đó
  // tên kèm domain cho cả quản lý lẫn người nhận, đúng quy ước .fb-sender-dom của feed
  assert.ok(html.includes('cho ${f.who.name} <span class="fb-sender-dom">(${f.who.dom})</span>'));
  assert.ok(html.includes('${requester.name} <span class="fb-sender-dom">(${requester.dom})</span>'));
  // ngày + chế độ chia sẻ nằm ở dòng 2 trong .fb-head-main, giống card đã cho thường
  assert.ok(html.includes(":cardMeta(f.vis,f.date,'sender')}"));
  assert.match(html,/const more=\(!isHr\)\?'':rest\.length/);           // không có "Xem thêm"
  assert.match(html,/\$\{isHr\?`<div class="hr-given-count"/);          // không có dòng đếm câu hỏi
  assert.match(html,/\$\{isHr\?`<div class="fb-sub-line"/);             // không có dòng mục tiêu
  assert.match(html,/v==='mgr-request'[\s\S]{0,80}Quản lý và nhân viên đều xem được các phản hồi theo yêu cầu này/);

  // dữ liệu mẫu: đúng 1 câu hỏi mỗi demo, và chia sẻ đúng chế độ
  const demos=html.match(/id:'gvn-mgr-\d'[\s\S]{0,900}?body:''/g)||[];
  assert.equal(demos.length,2);
  demos.forEach(demo=>{
    assert.equal((demo.match(/\{question:/g)||[]).length,1,'yêu cầu của quản lý chỉ được có 1 câu hỏi');
    assert.match(demo,/vis:'mgr-request'/);
  });
});

test('cycle activity rail counts thanked given feedback right under "Phản hồi đã cho"', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/const thx=inCy\.filter\(f=>f\.kind==='given'&&f\.thankedAt\)\.length;/);
  // đọc thành cặp nhân–quả: đã cho → được cảm ơn, trước "Yêu cầu đang mở"
  assert.match(html,/Phản hồi đã cho[\s\S]{0,220}Lời cảm ơn nhận được[\s\S]{0,400}Yêu cầu đang mở/);
  // trạng thái 0: làm mờ cả dòng + tooltip thay vì để số 0 trơ trọi
  assert.match(html,/\.stat-row\.zero \.stat-lbl\{color:var\(--z400\)\}/);
  assert.match(html,/\.stat-row\.zero \.stat-val\{color:var\(--z400\)\}/);
  assert.match(html,/role="tooltip">Lời cảm ơn từ người nhận sẽ xuất hiện ở đây</);
  assert.match(html,/\.stat-tip-wrap:hover \.stat-tip,\.stat-tip-wrap:focus \.stat-tip\{opacity:1\}/);
  // tooltip neo trái trong rail — cần specificity cao hơn .fb-badge-tip khai báo sau
  assert.match(html,/\.stat-lbl \.stat-tip\{left:0;transform:none/);
});

test('cycle selector shows the cycle date range as secondary text', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/<span class="cycle-range" id="cycleRange"/);
  assert.match(html,/'2026':\['01\/01\/2026','30\/04\/2027'\]/);
  assert.match(html,/function renderCycleRange\(\)/);
  assert.match(html,/function renderAll\(\)\{\s*renderCycleRange\(\);/);
  assert.match(html,/\.cycle-range\{font-size:12px;font-weight:400;color:var\(--z500\)/);
});

test('media story starts with the top giver and uses the current campaign date range', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/function buildMediaInsights\(campaign\)/);
  assert.match(html,/Bạn nhận được phản hồi nhiều nhất từ/);
  assert.match(html,/Tổng hợp phản hồi đã nhận từ 1\/1\/\$\{campaign\.cycleYear\} đến \$\{formatMediaCurrentDate\(\)\}/);
  assert.doesNotMatch(html,/AI chỉ tạo nội dung · Template do System Admin cung cấp/);
  assert.doesNotMatch(html,/Tổng hợp từ feedback đã nhận trong chu kỳ/);
});

test('media summary entry sits left of the feedback CTAs and always blinks', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(html,/class="hd-actions"[\s\S]*?id="mediaSummaryEntry"[\s\S]*?<span class="media-entry-star">✦<\/span>[\s\S]*?onclick="openGive\(\)"[\s\S]*?onclick="openRequest\(\)"/);
  assert.doesNotMatch(html,/class="request-action-stack"/);
  assert.match(html,/\.media-summary-entry\{position:relative/);
  assert.doesNotMatch(html,/\.media-summary-entry\{position:fixed/);
  assert.match(html,/@keyframes media-entry-blink/);
  assert.match(html,/\.media-entry-star\{[^}]*animation:media-entry-blink/);
  assert.doesNotMatch(html,/\.media-summary-entry\.compact \.media-entry-star\{animation:none/);
  assert.match(html,/Xem lại Dấu ấn của bạn/);
  assert.match(html,/\.media-summary-entry\.compact:hover \.fb-badge-tip\{opacity:1\}/);
  assert.doesNotMatch(html,/\.media-summary-entry:hover \.fb-badge-tip\{opacity:1\}/);
});

test('personal feedback keeps a balanced two-column layout on laptop and large monitors', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');

  assert.match(html,/@media \(min-width:961px\) and \(max-width:1279px\)\{[\s\S]*?\.page\{[^}]*max-width:none[^}]*padding:20px 20px/);
  assert.match(html,/@media \(min-width:961px\) and \(max-width:1279px\)\{[\s\S]*?\.fb-rail\{width:260px/);
  assert.match(html,/@media \(min-width:1280px\)\{[\s\S]*?\.page\{[^}]*max-width:1360px[^}]*width:100%/);
  assert.match(html,/@media \(min-width:1280px\)\{[\s\S]*?\.fb-main\{max-width:820px/);
  assert.match(html,/@media \(min-width:1280px\)\{[\s\S]*?\.fb-rail\{width:300px/);
  assert.doesNotMatch(html,/@media \(max-width:768px\)|@media \(max-width:767px\)/);
});

test('HR requests lead the action queue, stay anonymous in the list and land in given feedback', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');

  /* HR đứng trên mọi yêu cầu khác, trong mỗi nhóm xếp theo hạn gần nhất. */
  assert.match(html,/\(isHrQueueRequest\(b\)-isHrQueueRequest\(a\)\)\|\|\(queueDueTs\(a\)-queueDueTs\(b\)\)/);
  assert.match(html,/function queueDueTs\(item\)/);

  /* Danh sách chỉ nói "HR", tên người HR gửi chỉ lộ ở màn trả lời. */
  assert.match(html,/Yêu cầu phản hồi của<\/span> <b>HR<\/b> <span class="q-pre">cho<\/span>/);
  assert.match(html,/\.qrow-hr\{/);
  /* Chỉ dòng HR có viền trái nhấn; dòng quá hạn thường chỉ dùng chip cảnh báo. */
  assert.doesNotMatch(html,/\.qrow\.over\{/);
  /* Avatar mang chữ HR nên không lặp nhãn HR trước tiêu đề; dòng chương trình chỉ dành cho yêu cầu HR. */
  assert.doesNotMatch(html,/q-hr-tag/);
  assert.match(html,/\$\{hr\?`<div class="qrow-sub">\$\{q\.context\}<\/div>`:''\}/);

  /* Bộ câu hỏi đã trả lời gộp thành một card trong "Phản hồi đã cho". */
  assert.match(html,/function cardGivenHrProgram\(f\)/);
  assert.match(html,/Đã trả lời \$\{answers\.filter\(pair=>pair\.answer\)\.length\}\/\$\{answers\.length\} câu hỏi/);
  assert.match(html,/function toggleHrGiven\(button\)/);
  /* Dùng lại đúng cặp câu hỏi - câu trả lời chuẩn của màn, không tự chế khối riêng. */
  assert.match(html,/feedbackPair\(pair\.question,answerHTML\(pair\)\)/);
  assert.doesNotMatch(html,/hr-given-q\{/);
  assert.match(html,/if\(isHr\)FEED\.unshift\(\{/);
});

test('closed requests leave the action queue and live in their own history dialog', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');

  // một khái niệm chung cho cả hai loại yêu cầu đã đóng
  assert.match(html,/function isClosedNotice\(item\)\{return !!\(item&&\(item\.programClosed\|\|item\.ticketClosed\)\);\}/);
  /* Ô "Cần bạn phản hồi" chỉ đếm và chỉ hiện việc còn phải làm — tính cả yêu cầu đã đóng
     vào đây là báo sai số việc tồn. */
  assert.match(html,/function actionQueue\(\)\{ return visibleQueue\(\)\.filter\(q=>!isClosedNotice\(q\)\); \}/);
  assert.match(html,/function sortedQueue\(\)\{\s*return actionQueue\(\)/);
  // lịch sử: đóng gần nhất lên trước
  assert.match(html,/function closedQueue\(\)\{[\s\S]{0,200}filter\(isClosedNotice\)[\s\S]{0,160}tsFromDMYSafe\(b\.closedAt\)-tsFromDMYSafe\(a\.closedAt\)/);
  // KHÔNG còn cơ chế đọc-một-lần-rồi-mất: lịch sử phải tra lại được bất cứ lúc nào
  assert.doesNotMatch(html,/CLOSED_NOTICE_KEY|markClosedNoticesSeen|closedNoticeSeen|ALWAYS_SHOW_CLOSED_NOTICES/);
  // popup RIÊNG, không lồng tab chung với việc cần làm
  assert.match(html,/<div class="overlay" id="dlg-closed"/);
  assert.match(html,/function openClosedQueue\(\)\{[\s\S]{0,300}openOverlay\('dlg-closed'\)/);
  assert.doesNotMatch(html,/id="dlg-queue"[\s\S]{0,600}pop-tab|queueAllList[\s\S]{0,200}closedList/);
  // lối vào là một dòng mảnh ở chân thẻ, không phải thẻ riêng ở cột phải
  assert.match(html,/class="hist-link" onclick="openClosedQueue\(\)"><i class="bx bx-archive"><\/i>Yêu cầu đã đóng/);
  assert.match(html,/\.hist-link\{[^}]*border:0;border-top:1px solid var\(--z100\)/);
  // hết việc nhưng còn lịch sử thì thẻ vẫn phải hiện, không thì mất lối vào tra cứu
  assert.match(html,/if\(!items\.length && !closed\.length\)\{ sec\.style\.display='none'; return; \}/);
});

test('closed request history carries who, when sent, when closed and the question', () => {
  const html=fs.readFileSync(require.resolve('./index.html'),'utf8');

  // đủ bốn thông tin để tra cứu lại
  assert.match(html,/<i class="bx bx-send"><\/i>Gửi \$\{q\.sent\|\|'—'\}/);
  assert.match(html,/<i class="bx bx-lock-alt"><\/i>Đóng \$\{q\.closedAt\|\|'—'\}/);
  /* Ở màn lịch sử chỉ nêu LÝ DO đóng — tiêu đề popup đã nói "Yêu cầu đã đóng" rồi,
     nhắc lại "bạn không cần phản hồi" ở từng dòng là thừa. */
  /* Ngày gửi, ngày đóng và lý do đóng nằm CÙNG một hàng metadata. */
  assert.match(html,/<div class="crow-meta">\s*<span><i class="bx bx-send"><\/i>Gửi \$\{q\.sent\|\|'—'\}<\/span>\s*<span><i class="bx bx-lock-alt"><\/i>Đóng \$\{q\.closedAt\|\|'—'\}<\/span>\s*<span class="crow-why"><i class="bx bx-info-circle"><\/i>\$\{closedReasonShort\(q\)\}<\/span>\s*<\/div>/);
  assert.match(html,/\.crow-meta\{display:flex;align-items:center;flex-wrap:wrap/);
  assert.doesNotMatch(html,/\.crow-why\{[^}]*margin-top/);
  assert.match(html,/function closedReasonShort\(item\)\{return ManagerRequestModel\.closeReasonShort\(item&&item\.closedReason\);\}/);
  const shortText=require('../M-04/manager-request-model.js').closeReasonShort;
  assert.equal(shortText('hr-closed'),'HR đã đóng yêu cầu');
  assert.equal(shortText('manual'),'Quản lý đã đóng yêu cầu');
  assert.equal(shortText('recipient-resigned'),'Người nhận phản hồi đã nghỉ việc');
  assert.equal(shortText('expired'),'Yêu cầu hết hiệu lực vì quá 90 ngày');
  assert.equal(shortText('khong-co-ma-nay'),'Yêu cầu đã đóng');
  // không lặp lại phần "bạn không cần phản hồi" ở dòng lý do
  Object.values({a:shortText('hr-closed'),b:shortText('manual'),c:shortText('recipient-resigned')})
    .forEach(text=>assert.doesNotMatch(text,/không cần phản hồi|ticket đã đóng/));

  // domain đi kèm cả người gửi (kể cả HR) lẫn người nhận
  assert.match(html,/const dom = value => value \? ` <span class="fb-sender-dom">\(\$\{value\}\)<\/span>` : '';/);
  assert.match(html,/<b>\$\{q\.from\}<\/b>\$\{dom\(q\.dom\)\} <span class="q-pre">cho<\/span> <b>\$\{q\.feedbackReceiver\.name\}<\/b>\$\{dom\(q\.feedbackReceiver\.domain\)\}/);
  assert.match(html,/<b>\$\{q\.aboutName\}<\/b>\$\{dom\(q\.aboutDom\)\}/);

  // DS 16: header chỉ có title 1 dòng → nền hồng nhạt
  assert.match(html,/<div class="dlg-hd dlg-hd--brand">\s*<div style="display:flex;align-items:center;gap:8px">\s*<div class="dlg-title">Yêu cầu đã đóng<\/div>/);
  // dòng dẫn nhập để chữ đậm cho dễ đọc
  assert.match(html,/\.closed-note\{margin:0 0 4px;color:var\(--z800\)/);
  // nút xem thêm câu hỏi dùng xám đậm, không dùng màu thương hiệu
  assert.match(html,/\.crow-toggle\{[^}]*color:var\(--z600\)/);
  assert.doesNotMatch(html,/\.crow-toggle\{[^}]*color:var\(--brand\)/);
  assert.match(html,/function closedQuestions\(q\)\{[\s\S]{0,220}q\.questions\|\|\[\]\)\.map\(question=>question\.text\)/);
  // dữ liệu mẫu phải có ngày đóng, nếu không cột "Đóng" luôn trống
  assert.match(html,/id:'ticket-closed-migration'[\s\S]{0,160}closedAt:'02\/08\/2026'/);
  assert.match(html,/id:'ticket-closed-roadmap'[\s\S]{0,160}closedAt:'20\/07\/2026'/);
  assert.match(html,/programClosed:program\.status==='closed',closedAt:program\.closedAt\|\|''/);

  // bộ câu hỏi của HR có thể dài → gập lại, bấm mới mở đủ
  assert.match(html,/class="crow-toggle" type="button" onclick="toggleClosedRow\(this\)" aria-expanded="false">Xem thêm \$\{rest\.length\} câu hỏi/);
  assert.match(html,/\.crow-rest\{display:none\}/);
  assert.match(html,/\.crow\.crow-open \.crow-rest\{display:block\}/);

  /* Dòng dẫn nhập để TRẦN, không đóng khung: thêm một khung viền nữa là lẫn với các ô
     yêu cầu ngay bên dưới. */
  assert.match(html,/<p class="closed-note">Những yêu cầu này đã được đóng, bạn không cần trả lời nữa\. Danh sách giữ lại để bạn tra cứu khi cần\.<\/p>/);
  assert.match(html,/\.closed-note\{margin:0 0 4px;color:var\(--z800\);font-size:12\.5px;line-height:1\.55\}/);
  assert.doesNotMatch(html,/\.closed-note\{[^}]*border/);

  /* Câu chữ lý do đóng vẫn lấy từ bảng dùng chung của ManagerRequestModel. */
  assert.match(html,/function closedNoticeText\(item\)\{return ManagerRequestModel\.reviewerNoticeText\(item&&item\.closedReason\);\}/);
  assert.match(html,/<script src="\.\.\/M-04\/manager-request-model\.js"><\/script>/);
  const managerModel=require('../M-04/manager-request-model.js');
  assert.equal(managerModel.reviewerNoticeText('recipient-resigned'),'Người nhận phản hồi đã nghỉ việc, ticket đã đóng — bạn không cần phản hồi');
  assert.equal(managerModel.reviewerNoticeText('manual'),'Quản lý đã đóng yêu cầu, bạn không cần phản hồi');
  [...html.matchAll(/closedReason:'([a-z-]+)'/g)].forEach(match=>
    assert.ok(managerModel.closeReasonCodes().includes(match[1]),`E-04 dùng mã lạ: ${match[1]}`));
});

test('thanks tooltip follows the design-system metadata separator rule (no middot)', () => {
  // DESIGN-SYSTEM 19.0: TUYỆT ĐỐI không dùng middot "·" trong text UI — luôn là " - ".
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const from = html.indexOf('function thxMark(');
  assert.ok(from > 0, 'phải tìm được hàm dựng dấu tim');
  const mark = html.slice(from, html.indexOf('function receivedThxRows(', from));
  assert.doesNotMatch(mark, /\u00B7/);
  assert.match(mark, /<em>- \$\{r\.role\}<\/em>/);
});

test('both guide styles show together so reviewers can compare and drop one', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  assert.match(html, /<div class="ta-guide" id="giveGuide">/);
  assert.match(html, /<div class="tip-pop" id="writeTip"/);
  // không còn cơ chế tách chế độ — cả hai cùng chạy trên một màn
  assert.doesNotMatch(html, /guide-inbox|guide-tip|applyGuideMode|GUIDE_MODE_KEY/);
});

test('style A keeps the STAR guide inside the compose box without clipping on any background', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const from = html.indexOf('<div class="ta-guide" id="giveGuide">');
  const guide = html.slice(from, html.indexOf('</div>', html.indexOf('tg-tip"><span class="tg-tip-l">2.', from)));
  assert.match(guide, /<p class="tg-prompt" aria-hidden="true">Bạn muốn phản hồi điều gì\?/);
  // cùng cách xuống dòng và in đậm với bảng chi tiết
  assert.match(guide, /<span class="tg-tip-l">1\. Để <b>ghi nhận<\/b> - dùng Mô hình <b>STAR<\/b>:<\/span>\s*\n\s*\[Bối cảnh &amp; Nhiệm vụ\]/);
  assert.match(guide, /<span class="tg-tip-l">2\. Để <b>góp ý xây dựng<\/b> - dùng Mô hình <b>STAR-AR<\/b>:<\/span>\s*\n\s*\[Bối cảnh &amp; Nhiệm vụ\]/);
  assert.match(html, /\.tg-tip-l\{display:block;color:var\(--z500\)\}/);
  assert.doesNotMatch(guide, /\u00B7/);
  // dòng mời viết đậm nhất, mẹo lùi xuống làm phụ chú — tránh bị đọc thành infobox
  assert.match(html, /\.tg-prompt\{margin:0;font-size:13px;line-height:1\.6;color:var\(--z500\)\}/);
  assert.match(html, /\.tg-tip\{margin:0 0 5px;font-size:11px;line-height:1\.5;color:var\(--z400\)\}/);
  // bấm vào ô là ẩn, rời ô mà còn trống thì hiện lại
  assert.match(html, /const hide=document\.activeElement===ta \|\| ta\.value\.trim\(\)!==''/);
  assert.match(html, /onfocus="syncGiveGuide\(\)" onblur="syncGiveGuide\(\)"/);
  assert.match(html, /function syncGive\(\)\{\s*syncGiveGuide\(\);/);
  // LUÔN căn trái dù nền quy định căn giữa
  assert.match(html, /\.ta-guide\{[^}]*text-align:left/);
  assert.match(html, /padding:var\(--ta-pad,30px 22px\);text-align:left\}/);
  // nới cao CHỈ khi chưa chọn nền — chọn nền rồi thì .compose-ta.has-bg đã cho 170px
  assert.match(html, /\.ta-wrap \.compose-ta:not\(\.has-bg\)\{min-height:146px\}/);
  // biến của nền đặt trên khung bọc để lớp phủ (anh em của textarea) kế thừa được
  assert.match(html, /const wrap=ta\.closest\('\.ta-wrap'\)\|\|ta;/);
  assert.match(html, /wrap\.style\.setProperty\('--ta-fg', b\.fg\|\|'#fff'\)/);
  assert.doesNotMatch(html, /ta\.style\.setProperty\('--ta-fg'/);
  assert.match(html, /aria-describedby="giveGuideTip"/);
});

test('style B is an icon-only bulb that blinks on open and names itself on hover', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  // Nút chữ cũ quá to nên nằm sát mép ô, trông như dính vào viền → chỉ còn icon 24px.
  assert.match(html, /aria-controls="writeTip" aria-label="Mẹo hay để viết phản hồi"><i class="bx bx-bulb"><\/i><\/button>/);
  assert.match(html, /\.tip-btn\{position:relative;display:flex;align-items:center;justify-content:center;width:24px;height:24px/);
  assert.doesNotMatch(html, /<\/i>Mẹo viết phản hồi<\/button>/);
  // hàng nhãn phải giữ lại margin-bottom 7px của .field-label, nếu không ô soạn dính sát nhãn
  assert.match(html, /\.field-label-row\{[^}]*margin-bottom:7px\}/);
  // tooltip xổ XUỐNG vì icon nằm gần đỉnh vùng cuộn, xổ lên bị header che
  assert.match(html, /<span class="fb-badge-tip">Mẹo hay để viết phản hồi<\/span>/);
  assert.match(html, /\.tip-btn-wrap \.fb-badge-tip\{bottom:auto;top:calc\(100% \+ 7px\);left:auto;right:0;transform:none\}/);
  // nhịp đập LIÊN TỤC, không phải vài nhịp rồi tắt — tắt sớm thì nhìn sang đã đứng im
  assert.match(html, /@keyframes tip-blink\{/);
  assert.match(html, /\.tip-btn\.blink\{animation:tip-blink 1\.9s ease-out infinite\}/);
  assert.doesNotMatch(html, /\.tip-btn\.blink\{animation:tip-blink [\d.]+s ease-out \d+\}/);
  // chấm báo đứng yên, cũng là phương án cho máy đã tắt hiệu ứng chuyển động
  assert.match(html, /\.tip-btn\.blink::after\{content:'';position:absolute;top:-1px;right:-1px;width:8px;height:8px/);
  assert.match(html, /@media\(prefers-reduced-motion:reduce\)\{\s*\.tip-btn\.blink\{animation:none;background:var\(--brand-muted\);border-color:var\(--brand-ring\)\}\}/);
  // dừng khi người dùng đã tương tác: bấm icon, hoặc bắt đầu gõ nội dung
  assert.match(html, /if\(force===undefined\) stopBlinkWriteTip\(\);/);
  assert.match(html, /function onGiveInput\(\)\{\s*stopBlinkWriteTip\(\);/);
  // phải gắn class SAU khi overlay bỏ display:none, và gắn đồng bộ (rAF không chạy khi tab ẩn)
  assert.match(html, /openOverlay\('dlg-give'\);\s*blinkWriteTip\(\);/);
  assert.doesNotMatch(html, /function blinkWriteTip\(\)\{[\s\S]{0,400}?requestAnimationFrame/);
  assert.match(html, /btn\.classList\.remove\('blink'\);\s*void btn\.offsetWidth;\s*btn\.classList\.add\('blink'\);/);
  // Bảng chi tiết nằm NGAY SAU ô soạn, không nổi đè lên ô, không tự đóng khi gõ
  const ta = html.indexOf('id="giveTA"'), pop = html.indexOf('<div class="tip-pop" id="writeTip"');
  assert.ok(pop > ta && pop - ta < 1900, 'bảng mẹo phải nằm liền sau ô soạn');
  assert.doesNotMatch(html, /\.tip-pop\{[^}]*position:absolute/);
  assert.doesNotMatch(html, /function onGiveInput\(\)\{[\s\S]{0,400}?toggleWriteTip/);
  assert.match(html, /document\.addEventListener\('pointerdown',writeTipOutside,true\)/);
  assert.match(html, /if\(event\.key!=='Escape'\) return;/);
});

test('tip detail breaks the line after the colon and bolds the action words and model names', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const from = html.indexOf('<div class="tip-pop" id="writeTip"');
  const tip = html.slice(from, html.indexOf('</div>', html.indexOf('2. Để <b>góp ý', from)));
  assert.match(tip, /<div class="tip-pop-h">Mẹo viết phản hồi hiệu quả<\/div>/);
  assert.match(tip, /<span class="tip-pop-l">1\. Để <b>ghi nhận<\/b> - dùng Mô hình <b>STAR<\/b>:<\/span>\s*\n\s*\[Bối cảnh &amp; Nhiệm vụ\]/);
  assert.match(tip, /<span class="tip-pop-l">2\. Để <b>góp ý xây dựng<\/b> - dùng Mô hình <b>STAR-AR<\/b>:<\/span>\s*\n\s*\[Bối cảnh &amp; Nhiệm vụ\]/);
  assert.match(html, /\.tip-pop-l\{display:block;color:var\(--z800\)\}/);
  assert.match(html, /\.tip-pop-l b:last-child\{color:var\(--brand\)/);
  // ra khỏi ô nhập thì không cần làm mờ: --z600 đạt chuẩn WCAG
  assert.match(html, /\.tip-pop-p\{margin:0 0 9px;font-size:12px;line-height:1\.6;color:var\(--z600\)\}/);
  assert.doesNotMatch(tip, /\u00B7/);
});
