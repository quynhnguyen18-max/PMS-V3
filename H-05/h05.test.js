const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const modelPath='./feedback-program-model.js';

test('normalizes legacy questions to the open_text contract',()=>{
  const model=require(modelPath);
  assert.deepEqual(model.normalizeQuestion({id:'q1',type:'open',text:'  Một câu hỏi  '}),{id:'q1',type:'open_text',text:'Một câu hỏi'});
});

test('applies participant scope by HR role while reviewers remain company-wide',()=>{
  const model=require(modelPath);
  const people=[
    {id:'sales',division:'Kinh doanh'},
    {id:'tech',division:'Công nghệ'},
    {id:'hr',division:'Nhân sự'}
  ];
  assert.deepEqual(model.participantPool(people,{role:'hrbp',division:'Kinh doanh'}).map(x=>x.id),['sales']);
  assert.deepEqual(model.participantPool(people,{role:'lod',hrDivision:'Nhân sự'}).map(x=>x.id),['sales','tech']);
  assert.equal(model.reviewerPool(people).length,3);
});

test('builds unique participant-reviewer assignments and separate self assessments',()=>{
  const model=require(modelPath);
  const participants=[{id:'a'},{id:'b'}];
  const reviewers=[{id:'a'},{id:'c'},{id:'c'}];
  const assignments=model.buildAssignments(participants,reviewers,{includeSelf:true});
  assert.deepEqual(assignments.map(x=>`${x.participantId}:${x.reviewerId}:${x.selfAssessment}`),[
    'a:c:false','a:a:true','b:a:false','b:c:false','b:b:true'
  ]);
});

test('validates every field required to launch a feedback program',()=>{
  const model=require(modelPath);
  const empty=model.validateLaunch({},'11/08/2026');
  assert.deepEqual(empty.errors.map(x=>x.field),['goal','due','participants','reviewers','questions']);
  const valid=model.validateLaunch({
    goal:'Phát triển năng lực',due:'20/08/2026',participants:[{id:'a'}],reviewers:[{id:'b'}],questions:[{type:'open_text',text:'Điểm mạnh là gì?'}]
  },'11/08/2026');
  assert.equal(valid.valid,true);
});

test('rejects a due date that is not later than the creation date',()=>{
  const model=require(modelPath);
  const result=model.validateLaunch({
    goal:'Mục tiêu',due:'11/08/2026',participants:[{id:'a'}],reviewers:[{id:'b'}],questions:[{type:'open_text',text:'Câu hỏi'}]
  },'11/08/2026');
  assert.equal(result.errors.find(x=>x.field==='due').code,'due_not_future');
});

test('derives collecting, overdue, closed and report attention states',()=>{
  const model=require(modelPath);
  assert.equal(model.campaignViewState({status:'collecting',due:'13/08/2026'},'11/08/2026'),'collecting');
  assert.equal(model.isDueSoon({status:'collecting',due:'14/08/2026'},'11/08/2026'),true);
  assert.equal(model.campaignViewState({status:'collecting',due:'10/08/2026'},'11/08/2026'),'overdue');
  assert.equal(model.campaignViewState({status:'closed',report:'none'},'11/08/2026'),'closed');
  assert.equal(model.needsReport({status:'closed',report:'none'}),true);
});

test('normalizes a draft without losing editable configuration',()=>{
  const model=require(modelPath);
  const draft=model.normalizeCampaign({
    id:'draft-1',goal:'  Coaching Q3 ',status:'draft',createdAt:'11/08/2026',due:'20/08/2026',
    participants:[{id:'a'}],reviewers:[{id:'b'}],questions:[{id:'q1',type:'open',text:' Câu hỏi '}],
    includeSelf:true,anon:'anon',autoRemind:false,templateId:'perf'
  });
  assert.equal(draft.id,'draft-1');
  assert.equal(draft.goal,'Coaching Q3');
  assert.equal(draft.questions[0].type,'open_text');
  assert.equal(draft.includeSelf,true);
  assert.equal(draft.autoRemind,false);
  assert.equal(draft.templateId,'perf');
});

test('migrates count-only legacy drafts without crashing',()=>{
  const model=require(modelPath);
  const draft=model.normalizeCampaign({id:'legacy',status:'draft',participants:3,reviewers:2});
  assert.deepEqual(draft.participants,[]);
  assert.deepEqual(draft.reviewers,[]);
  assert.equal(draft.participantCount,3);
  assert.equal(draft.reviewerCount,2);
});

test('H-05 UI follows the shared model, draft route and typography contracts',()=>{
  const index=fs.readFileSync(require.resolve('./index.html'),'utf8');
  const create=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(index,/feedback-program-model\.js/);
  assert.match(create,/feedback-program-model\.js/);
  assert.match(index,/create-campaign\.html\?id=\$\{encodeURIComponent\(c\.id\)\}/);
  assert.match(create,/FeedbackProgramModel\.validateLaunch/);
  assert.match(create,/type:'open_text'/);
  assert.doesNotMatch(create,/chọn tình huống sử dụng/i);
  assert.doesNotMatch(create,/\.scn-grid|\.scn-opt/);
  for(const html of [index,create]){
    assert.match(html,/\.page-h\{font-size:18px/);
    assert.match(html,/\.page-sub\{font-size:12\.5px/);
    assert.match(html,/body\{font-family:'Public Sans',sans-serif;font-size:14px;line-height:1\.5;color:var\(--z700\);background:var\(--z50\)/);
  }
  assert.match(create,/\.rev-cell \.rc-val\{font-size:13px/);
  assert.match(create,/\.count-banner \.cb-num\{font-size:18px/);
  assert.match(index,/--program-columns:/);
  assert.match(index,/\.board-head,\.row\{[^}]*grid-template-columns:var\(--program-columns\)[^}]*align-items:start/);
  assert.match(index,/\.summary-row\{[^}]*grid-template-columns:12px minmax\(0,1fr\) 28px/);
  assert.match(index,/\.summary-row \.s-num\{[^}]*text-align:right[^}]*font-variant-numeric:tabular-nums/);
});

test('program list uses one semantic progress and deadline column',()=>{
  const index=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(index,/--program-columns:minmax\(0,/);
  assert.match(index,/<span>Tiến độ &amp; thời hạn<\/span>/);
  assert.doesNotMatch(index,/<span>Tiến độ<\/span><span>Trạng thái<\/span>/);
  assert.match(index,/function progressStatusBlock\(c\)/);
  assert.match(index,/const ratio=`\$\{c\.done\}\/\$\{c\.total\} đã trả lời`/);
  assert.match(index,/label='Đang thu thập'/);
  assert.match(index,/label='Quá hạn'/);
  assert.match(index,/label=complete\?'Hoàn thành':'Đã đóng'/);
  assert.match(index,/\$\{label\}: \$\{ratio\}/);
  assert.doesNotMatch(index,/lượt đã phản hồi/);
});

test('program scope copy and page shell follow the manager-screen contract',()=>{
  const index=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(index,/pms-tooltip-content">Người nhận phản hồi</);
  assert.doesNotMatch(index,/Người nhận feedback/);
  assert.match(index,/\.wrap\{width:100%;padding:24px 24px 60px\}/);
  assert.doesNotMatch(index,/\.wrap\{max-width:1080px/);
  assert.match(index,/\.board-head>\*,\.row>\*\{min-width:0\}/);
  assert.match(index,/\.progress-chip\{[^}]*max-width:100%/);
});

test('closed programs omit redundant end metadata and list type matches M-04',()=>{
  const index=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.doesNotMatch(index,/timeMeta='Đã kết thúc'/);
  assert.match(index,/const timeLine=timeMeta\?/);
  assert.match(index,/\.board-head span\{font-size:10px/);
  assert.match(index,/\.g-title\{font-size:12\.5px/);
  assert.match(index,/\.g-meta\{[^}]*font-size:10\.5px/);
  assert.match(index,/\.scope \.sm\{[^}]*font-size:12px/);
  assert.match(index,/\.progress-chip\{[^}]*font-size:11px/);
  assert.match(index,/\.progress-meta\{[^}]*font-size:10\.5px/);
});

test('overview rows share one marker-label-value alignment contract',()=>{
  const index=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(index,/\.summary-row\{[^}]*grid-template-columns:12px minmax\(0,1fr\) 28px/);
  assert.match(index,/\.summary-marker\.summary-placeholder\{visibility:hidden\}/);
  assert.doesNotMatch(index,/\.attn\{[^}]*margin:0 -10px/);
  assert.equal((index.match(/class="summary-marker summary-placeholder"/g)||[]).length,2);
  assert.doesNotMatch(index,/class="summary-marker empty"/);
  assert.equal((index.match(/class="summary-marker a-dot"/g)||[]).length,3);
});

test('overview groups keep compact vertical rhythm instead of stretching with the list',()=>{
  const index=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(index,/\.side\{[^}]*align-self:start[^}]*height:max-content/);
  assert.match(index,/\.side-card\{height:auto/);
  assert.match(index,/\.summary-section\{display:flex;flex-direction:column/);
  assert.match(index,/\.summary-row\{[^}]*flex:0 0 34px/);
  assert.equal((index.match(/class="summary-section"/g)||[]).length,2);
});

test('design system documents shared type scale and geometry contracts',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(design,/Shared type scale/i);
  assert.match(design,/Shared geometry/i);
  assert.match(design,/UI contract test/i);
  assert.match(design,/Semantic status chip/i);
  assert.match(design,/Data-list density/i);
  assert.match(design,/Summary panel alignment/i);
});

test('design system designates M-04 as the Feedback detail source of truth',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(design,/M-04 request detail/i);
  assert.match(design,/left rail.*content pane.*right summary/i);
  assert.match(design,/request-detail-layout/);
});

test('design system locks the M-04 detail status directly below the right-summary title',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(design,/right summary.*directly below.*summary title/i);
  assert.match(design,/not.*page header/i);
});

test('design system keeps program creation and due metadata inside the M-04 right summary',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(design,/created and due metadata[^<]*right summary[^<]*not in page header/i);
});

test('design system prevents joined identities and repeated program status in participant details',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(design,/Identity spacing/i);
  assert.match(design,/program status.*page header/i);
});

test('both H-05 mockups contain valid inline JavaScript',()=>{
  for(const file of ['./index.html','./create-campaign.html']){
    const html=fs.readFileSync(require.resolve(file),'utf8');
    const scripts=[...html.matchAll(/<script(?:\s+src=[^>]*)?>([\s\S]*?)<\/script>/g)].map(match=>match[1]).filter(Boolean);
    scripts.forEach(source=>assert.doesNotThrow(()=>new Function(source),`${file} has invalid inline JavaScript`));
  }
});

test('sorts incomplete program participants by answer ratio and puts complete participants last',()=>{
  const model=require(modelPath);
  const campaign={status:'collecting',due:'14/08/2026'};
  const person=(id,name,done)=>({employee:{id,name},assignments:Array.from({length:4},(_,index)=>({status:index<done?'submitted':'pending'}))});
  const people=[person('complete','Zeta',4),person('collecting','Gamma',1),person('due-soon','Beta',2),person('overdue','Alpha',1)];
  assert.deepEqual(model.sortParticipantsForAction({...campaign,due:'10/08/2026'},people,'11/08/2026').map(item=>item.employee.id),['overdue','collecting','due-soon','complete']);
});

test('derives badge tally and AI eligibility only from submitted feedback',()=>{
  const model=require(modelPath);
  const participant={assignments:[
    {status:'submitted',badges:['teamwork','customer']},
    {status:'submitted',badges:['teamwork']},
    {status:'pending',badges:['excellence']}
  ]};
  assert.deepEqual(model.coreValueTally(participant),{teamwork:2,customer:1});
  assert.equal(model.isAiSummaryEligible(participant),true);
});

test('derives a neutral program overview without repeating program status',()=>{
  const model=require(modelPath);
  const detail={
    campaign:{status:'collecting',due:'10/08/2026'},
    participants:[
      {employee:{id:'a'},assignments:[{status:'submitted',reviewer:{id:'r1'}},{status:'pending',reviewer:{id:'r2'}}]},
      {employee:{id:'b'},assignments:[{status:'pending',reviewer:{id:'r1'}},{status:'pending',reviewer:{id:'r3'}}]}
    ]
  };
  assert.deepEqual(model.programDetailOverview(detail,'11/08/2026'),{participants:2,reviewers:3,pending:3,overdue:2});
});

test('reminds only eligible pending program assignments once per rolling 24 hours',()=>{
  const model=require(modelPath),campaign={status:'collecting',due:'15/08/2026'};
  const assignment={id:'a1',status:'pending',manualReminderHistory:['12/08/2026 10:00']};
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'13/08/2026 09:59'),false);
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'13/08/2026 10:00'),true);
  assert.equal(model.canRemindProgramAssignment(campaign,{status:'submitted'},'13/08/2026 10:00'),false);
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'16/08/2026 10:00'),false);
});

test('H-05 and H-06 read one shared program seed with deterministic detail fixtures',()=>{
  const data=require('./feedback-program-data.js');
  const program=data.programById('s2'),detail=data.detailForProgram(program);
  assert.equal(program.goal,'Khảo sát phát triển đội ngũ Sales');
  assert.equal(detail.campaign.id,'s2');
  assert.equal(detail.participants.length,10);
  assert.equal(detail.participants[0].assignments.length,4);
  assert.notEqual(data.seedPrograms(),data.seedPrograms(),'factories return isolated values');
});

test('H-05 seeds three- and five-question program details with one answer per submitted question',()=>{
  const data=require('./feedback-program-data.js');
  const three=data.detailForProgram(data.programById('s3'));
  const five=data.detailForProgram(data.programById('s4'));
  assert.equal(three.questions.length,3);
  assert.equal(five.questions.length,5);
  const completed=five.participants.find(participant=>participant.employee.id==='duc.pham').assignments[0];
  assert.equal(completed.answers.length,5);
  assert.equal(completed.answers[0].questionId,five.questions[0].id);
});

test('H-06 multi-question demo starts with partial, question-specific reviewer evidence',()=>{
  const data=require('./feedback-program-data.js');
  const model=require('./feedback-program-model.js');
  const detail=data.detailForProgram(data.programById('s3'));
  const first=model.sortParticipantsForAction(detail.campaign,detail.participants,'11/08/2026')[0];
  const submitted=first.assignments.filter(item=>item.status==='submitted');
  assert.ok(submitted.length>0);
  assert.equal(submitted[0].answers.length,detail.questions.length);
  assert.notEqual(submitted[0].answers[0].body,submitted[0].answers[1].body);
});

test('H-05 opens a non-draft program in the H-06 detail workspace',()=>{
  const page=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
  assert.match(page,/location\.href=`\.\.\/H-06\/index\.html\?id=\$\{encodeURIComponent\(c\.id\)\}`/);
});

test('H-06 uses the M-04 three-panel layout with internal content scroll and one program status location',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(detail,/\.request-detail-layout\{grid-template-columns:240px minmax\(440px,1fr\) 280px/);
  assert.match(detail,/\.pane-body\{[^}]*overflow-y:auto/);
  assert.equal((detail.match(/class="program-progress"/g)||[]).length,0);
  assert.doesNotMatch(detail,/id="programProgress"/);
  assert.doesNotMatch(detail,/id="programMeta"/);
  assert.match(detail,/function renderProgramOverview\(\)\{[\s\S]*?summary-title[^`]*summary-status summary-status-\$\{state\}/);
  assert.match(detail,/document\.getElementById\('overview'\)\.innerHTML=`[^`]*\$\{PROGRAM\.createdAt\}[^`]*\$\{PROGRAM\.due\}/);
  assert.match(detail,/function selectParticipant\(participantId\)/);
  assert.match(detail,/sortParticipantsForAction/);
  assert.match(detail,/coreValueTally/);
  assert.match(detail,/isAiSummaryEligible/);
  assert.match(detail,/bx-bell[^>]*><\/i> Nhắc/);
  assert.doesNotMatch(detail,/Nhắc người chưa trả lời|·/);
});

test('H-06 keeps selection in place, gates AI by evidence and exposes compact reminder semantics',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(detail,/function selectParticipant\(participantId\)\{SELECTED_ID=participantId;renderDetail\(\);\}/);
  assert.doesNotMatch(detail,/function selectParticipant[\s\S]*location\.href/);
  assert.match(detail,/FeedbackProgramModel\.isAiSummaryEligible\(participant\)/);
  assert.match(detail,/remindEligibleProgramAssignments\(PROGRAM,DETAIL\.participants,NOW\)/);
  assert.match(detail,/class="btn btn-outline btn-remind pms-tooltip reminder-tooltip"/);
  assert.match(detail,/aria-pressed="\$\{person\.id===SELECTED_ID\}"/);
  assert.doesNotMatch(detail,/summary-ai\{[^}]*var\(--warning-muted\)/);
});

test('H-06 groups multi-question evidence by question while keeping wording collapsible',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(detail,/function groupAnswersByQuestion\(participant,questions\)/);
  assert.match(detail,/function questionEvidenceGroup\(group,index,isSingleQuestion\)/);
  assert.match(detail,/assignment\.answers/);
  assert.match(detail,/<details class="question-disclosure">/);
});

test('H-06 renders a one-question request as the shared pink question box without a duplicate empty message',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(detail,/questions\.length===1/);
  assert.match(detail,/class="shared-question single-question"/);
  assert.match(detail,/!isSingleQuestion&&`<div class="question-empty">Chưa nhận phản hồi cho câu này<\/div>`/);
  assert.match(detail,/\.question-disclosure\{[^}]*background:var\(--brand-muted\)/);
  assert.match(design,/Feedback question surface/);
});

test('H-06 distinguishes reviewer completion from question answer counts without standalone question blocks',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(detail,/Đã nhận: \$\{progress\.done\}\/\$\{progress\.total\} người phản hồi/);
  assert.match(detail,/class="question-evidence-group/);
  assert.match(detail,/Chưa nhận phản hồi cho câu này/);
  assert.match(design,/Question-led evidence view/);
});

test('H-06 always renders the M-04 AI Summary card and uses its neutral evidence-empty state',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.doesNotMatch(detail,/if\(!FeedbackProgramModel\.isAiSummaryEligible\(participant\)\|\|!participant\.aiSummary\)return ''/);
  assert.match(detail,/class="dialog-ai-summary-empty"/);
  assert.match(detail,/Cần ít nhất 2 phản hồi để tạo AI Summary\./);
  assert.match(detail,/bx bx-layer/);
  assert.match(detail,/\.dialog-ai-summary\.collapsed \.dialog-ai-summary-empty\{display:none\}/);
});

test('H-06 identifies each pending reviewer instead of rendering anonymous waiting rows',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.match(detail,/class="pending-head"/);
  assert.match(detail,/class="identity pms-tooltip"/);
  assert.doesNotMatch(detail,/Người chưa trả lời\$\{overdue/);
});

test('H-06 uses the shared tooltip component for the compact reminder action',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.match(detail,/class="btn btn-outline btn-remind pms-tooltip reminder-tooltip"/);
  assert.match(detail,/class="pms-tooltip-content reminder-tooltip-content"/);
  assert.doesNotMatch(detail,/reminder-btn"[^>]*title=/);
});

test('H-06 follows M-04 tooltip boundaries and native scrollbar behavior',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(detail,/\.pms-tooltip-top\{top:auto;bottom:calc\(100% \+ 7px\)/);
  assert.match(detail,/\.pms-tooltip-floating\{[^}]*bottom:auto/);
  assert.ok(detail.lastIndexOf('.pms-tooltip-floating{bottom:auto}')>detail.indexOf('.pms-tooltip-top{top:auto'));
  assert.match(detail,/function bindClippedTooltips\(\)/);
  assert.doesNotMatch(detail,/::\-webkit-scrollbar/);
  assert.match(detail,/\.rail\{[^}]*overflow-y:auto[^}]*overflow-x:hidden/);
  assert.match(detail,/\.pane-body\{[^}]*overflow-y:auto[^}]*overflow-x:hidden/);
  assert.match(detail,/\.ticket-summary\{[^}]*overflow-y:auto[^}]*overflow-x:hidden/);
  assert.match(detail,/\.question-response \.pms-tooltip/);
  assert.match(design,/Tooltip boundary rule.*native scrollbar/i);
});

test('H-06 uses the M-04 detail shell and components instead of a standalone screen',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.doesNotMatch(detail,/class="app"/);
  assert.doesNotMatch(detail,/class="sidebar"/);
  assert.doesNotMatch(detail,/class="workspace"/);
  assert.match(detail,/class="shell request-detail-layout"/);
  assert.match(detail,/class="rail"/);
  assert.match(detail,/class="content-pane"/);
  assert.match(detail,/class="ticket-summary"/);
  assert.match(detail,/class="pane-head"/);
  assert.match(detail,/class="pane-body"/);
  assert.match(detail,/class="employee-badge-summary"/);
  assert.match(detail,/class="question-evidence-group/);
  assert.match(detail,/class="question-disclosure"/);
  assert.match(detail,/section class="dialog-ai-summary\$\{collapsed\}"/);
  assert.match(detail,/<header class="topbar">[^<]+<\/header>/);
});

test('Feedback navigation routes each role to one entry screen and keeps H-06 as a detail-only route',()=>{
  const employee=fs.readFileSync(path.join(__dirname,'..','E-04','index.html'),'utf8');
  const manager=fs.readFileSync(path.join(__dirname,'..','M-04','index.html'),'utf8');
  const employeeHome=fs.readFileSync(path.join(__dirname,'..','E-01','index.html'),'utf8');
  const managerHome=fs.readFileSync(path.join(__dirname,'..','M-01','index.html'),'utf8');
  const program=fs.readFileSync(require.resolve('./index.html'),'utf8');
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  for(const source of [employee,manager,employeeHome,managerHome]){
    assert.match(source,/location\.href=['"]\.\.\/H-05\/index\.html/);
  }
  assert.match(program,/class="role-btn on"[^>]*>HR</);
  assert.doesNotMatch(detail,/class="role-btn on"[^>]*>HR</);
  assert.doesNotMatch(detail,/href="[^"\n]*H-06\/index\.html"[^>]*>Phản hồi/);
});

test('H-06 uses the full-width M-04 detail route and makes reminder context actionable',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.doesNotMatch(detail,/--sw:/);
  assert.match(detail,/\.page\{padding:22px 24px 28px\}/);
  assert.match(detail,/@media\(max-width:1100px\)\{\.request-detail-layout\{grid-template-columns:210px minmax\(0,1fr\) 250px/);
  assert.match(detail,/\.domain\{[^}]*margin-left:4px/);
  assert.match(detail,/Đã nhận: \$\{progress\.done\}\/\$\{progress\.total\} người phản hồi/);
  assert.doesNotMatch(detail,/phản hồi - Quá hạn|phản hồi - Sắp hạn/);
  assert.match(detail,/summary-ai-title">Cần nhắc</);
  assert.match(detail,/summary-ai-copy">\$\{data\.pending\} phản hồi chưa trả lời</);
  assert.match(detail,/class="summary-ai-action"/);
});

test('H-06 participant rail keeps received feedback metadata on its own line',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.match(detail,/\.person-info\{[^}]*min-width:0[^}]*flex:1/);
  assert.match(detail,/\.small\{[^}]*display:block/);
  assert.match(detail,/class="person-info"><span class="identity pms-tooltip"/);
});

test('H-06 removes the global PMS navigation shell from its full-screen detail route',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.doesNotMatch(detail,/\.sidebar\{/);
  assert.doesNotMatch(detail,/\.workspace\{/);
  assert.doesNotMatch(detail,/class="role-switch"/);
});
