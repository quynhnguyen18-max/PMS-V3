const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('employee feedback screen is named Phản hồi cá nhân', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /<title>E-04 – Phản hồi cá nhân \| MoMo HRM<\/title>/);
  assert.match(html, /<span class="topbar-title">Phản hồi cá nhân<\/span>/);
  assert.match(html, /<h1 class="page-title">Phản hồi cá nhân<\/h1>/);
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
  assert.match(html, /class="qa-q"><span class="qa-label">Câu hỏi<\/span><span class="qa-text">\$\{question\}<\/span>/);
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
  assert.match(html,/function requestLifecycleStatus\(request,today=todayDMY\(\)\)/);
  assert.match(html,/return 'no_response'/);
  assert.match(html,/Không phản hồi/);
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
  assert.equal(received.length, 11);
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
  assert.doesNotMatch(html,/insights:\s*\[[\s\S]*?who:/);
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
