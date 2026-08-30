const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const modelPath='./feedback-program-model.js';
const questionnaireModelPath='./questionnaire-library-model.js';

test('keeps request questionnaires independent from visible library templates',()=>{
  const model=require(questionnaireModelPath);
  const source=model.normalize({
    id:'shared-1',name:'HRBP_Khảo sát năng lực lãnh đạo',ownerId:'hrbp-1',ownerName:'Mai Thị Hằng',
    scope:'selected_hr',sharedWithIds:['lod-1'],
    questions:[{id:'q1',type:'open_text',text:'Điều gì đang làm tốt?'}]
  },{id:'lod-1',name:'L&OD'});
  const requestQuestions=model.cloneForRequest(source);
  requestQuestions[0].text='Chỉ thay đổi trong request';

  assert.equal(model.visibleTo(source,'lod-1'),true);
  assert.equal(model.canUse(source,'lod-1'),true);
  assert.equal(model.canEdit(source,'lod-1'),false);
  assert.equal(model.canDelete(source,'lod-1'),false);
  assert.notEqual(requestQuestions,source.questions);
  assert.equal(source.questions[0].text,'Điều gì đang làm tốt?');
});

test('copies a shared questionnaire into the recipient personal library',()=>{
  const model=require(questionnaireModelPath);
  const copy=model.makeCopy({
    id:'shared-1',name:'HRBP_Khảo sát năng lực lãnh đạo',ownerId:'hrbp-1',ownerName:'Mai Thị Hằng',
    scope:'all_hr',questions:[{id:'q1',type:'open_text',text:'Điều gì đang làm tốt?'}]
  },{id:'lod-1',name:'L&OD'},'copy-1');

  assert.equal(copy.id,'copy-1');
  assert.equal(copy.ownerId,'lod-1');
  assert.equal(copy.scope,'personal');
  assert.equal(copy.sourceTemplateId,'shared-1');
  assert.equal(model.canEdit(copy,'lod-1'),true);
});

test('renders a dedicated questionnaire library with source groups and owner-safe actions',()=>{
  const library=fs.readFileSync(require.resolve('./questionnaire-library.html'),'utf8');
  assert.match(library,/>Bộ câu hỏi</);
  assert.match(library,/Của tôi/);
  assert.match(library,/Được chia sẻ với tôi/);
  assert.match(library,/Mẫu hệ thống/);
  assert.match(library,/Tạo bộ câu hỏi/);
  assert.match(library,/function useTemplate\(id\)/);
  assert.match(library,/function copyTemplate\(id\)/);
  assert.match(library,/QuestionnaireLibraryModel\.canEdit/);
});

test('saves a questionnaire with explicit sharing scope and name guidance',()=>{
  const library=fs.readFileSync(require.resolve('./questionnaire-library.html'),'utf8');
  assert.match(library,/\[Bộ phận\]_\[Mục đích sử dụng\]/);
  assert.match(library,/Chỉ mình tôi/);
  assert.match(library,/Toàn bộ nhóm HR/);
  assert.match(library,/Chọn người cụ thể/);
  assert.match(library,/class="feedback-choice-card"/);
  assert.match(library,/function saveQuestionnaire\(\)/);
});

test('questionnaire editor renders endpoint meanings and expands intermediate Likert meanings on demand',()=>{
  const library=fs.readFileSync(require.resolve('./questionnaire-library.html'),'utf8');
  assert.match(library,/Ý nghĩa điểm thấp nhất/);
  assert.match(library,/Ý nghĩa điểm cao nhất/);
  assert.match(library,/Mô tả từng mức/);
  assert.match(library,/function toggleEditorRatingDetails\(index\)/);
  assert.match(library,/function setEditorRatingLabel\(index,score,value\)/);
  assert.match(library,/class="editor-rating-detail-labels"/);
});

test('request builder groups library templates and protects unsaved questions from replacement',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(builder,/questionnaire-library-model\.js/);
  assert.match(builder,/TEMPLATE_ROLE_ORDER=\['HRBP','L&OD'\]/);
  assert.match(builder,/function templatePickerGroups\(\)/);
  assert.match(builder,/id="templatePickerModal"/);
  assert.match(builder,/localeCompare\(b\.name,'vi'\)/);
  assert.doesNotMatch(builder,/Mẫu hệ thống/);
  assert.doesNotMatch(builder,/Phạm vi chia sẻ/);
  assert.match(builder,/Tên chương trình phản hồi/);
  assert.match(builder,/Nhập mục tiêu của yêu cầu phản hồi và lời nhắn gửi đến các bên liên quan/);
  assert.match(builder,/id="invitationInlineError"/);
  assert.match(builder,/questionnaire-library-seed\.js/);
  assert.match(builder,/function confirmQuestionReplacement\(nextAction\)/);
  assert.match(builder,/QuestionnaireLibraryModel\.cloneForRequest/);
  assert.match(builder,/Lưu vào bộ câu hỏi/);
});

test('uses inline validation, icon-only question controls and reviewer-to-recipient mapping',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(builder,/function setFieldError\(id,message\)/);
  assert.match(builder,/function focusFirstInvalidField\(errors\)/);
  assert.match(builder,/setAttribute\('aria-invalid','true'\)/);
  assert.match(builder,/data-tooltip="Câu hỏi mở"/);
  assert.match(builder,/data-tooltip="Câu hỏi Likert"/);
  assert.match(builder,/toggle\.disabled=!canPersonalize/);
  assert.match(builder,/Người nhận phản hồi[\s\S]*Người cho phản hồi/);
  assert.match(builder,/border-right:8px solid var\(--z600\)/);
});

test('H-05 landing exposes the HR request hub and questionnaire library entry',()=>{
  const landing=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(landing,/Quản lý yêu cầu phản hồi của HR/);
  assert.match(landing,/Thư viện bộ câu hỏi/);
  assert.match(landing,/href="questionnaire-library\.html"/);
});

test('saves request questions through an explicit named questionnaire popup',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(builder,/id="templateSaveModal"/);
  assert.match(builder,/Tên bộ câu hỏi/);
  assert.doesNotMatch(builder,/Chỉ mình tôi/);
  assert.doesNotMatch(builder,/Chọn người cụ thể/);
  assert.match(builder,/function confirmSaveRequestTemplate\(\)/);
  assert.match(builder,/scope:'all_hr'/);
  assert.match(builder,/history:\[\{version:1/);
  assert.match(builder,/QuestionnaireLibraryModel\.cloneForRequest\(\{questions\}\)/);
});

test('normalizes legacy questions to the open_text contract',()=>{
  const model=require(modelPath);
  assert.deepEqual(model.normalizeQuestion({id:'q1',type:'open',text:'  Một câu hỏi  '}),{id:'q1',type:'open_text',text:'Một câu hỏi',required:false});
});

test('normalizes rating questions with scale labels, mappings, and invitation message',()=>{
  const model=require(modelPath);
  const campaign=model.normalizeCampaign({
    questions:[{id:'q1',type:'rating',text:'rating prompt',ratingScale:5,ratingLabels:{1:'needs work',5:'exceeds expectations'}}],
    invitationMessage:'Thank you for sharing feedback.',
    reviewerMappings:[{participantId:'p1',reviewerIds:['r1','r2','r1']}]
  });
  assert.equal(campaign.questions[0].type,'rating');
  assert.equal(campaign.questions[0].ratingScale,5);
  assert.equal(campaign.questions[0].ratingLabels['5'],'exceeds expectations');
  assert.equal(campaign.invitationMessage,'Thank you for sharing feedback.');
  assert.deepEqual(campaign.reviewerMappings,[{participantId:'p1',reviewerIds:['r1','r2']}]);
});

test('questionnaire library keeps endpoint meanings and the optional detailed Likert setting',()=>{
  const model=require(questionnaireModelPath);
  const template=model.normalize({
    questions:[{id:'q1',type:'rating',text:'Collaboration',ratingScale:5,detailedRatingLabels:true,ratingLabels:{1:'Cần cải thiện',3:'Đạt kỳ vọng',5:'Vượt kỳ vọng'}}]
  },{id:'hrbp-1',name:'Lê Thuỳ Anh'});
  assert.equal(template.questions[0].ratingLabels[1],'Cần cải thiện');
  assert.equal(template.questions[0].ratingLabels[5],'Vượt kỳ vọng');
  assert.equal(template.questions[0].detailedRatingLabels,true);
});

test('builds assignments from recipient-specific reviewer mappings and excludes self review',()=>{
  const model=require(modelPath);
  const people=[{id:'p1'},{id:'p2'},{id:'r1'}];
  const assignments=model.buildAssignments(people.slice(0,2),[
    {participantId:'p1',reviewerIds:['r1','p1']},
    {participantId:'p2',reviewerIds:['r1']}
  ]);
  assert.deepEqual(assignments.map(item=>`${item.participantId}:${item.reviewerId}`),['p1:r1','p2:r1']);
});

test('expands shared reviewers to every recipient and excludes self review',()=>{
  const model=require(modelPath);
  const mappings=model.expandReviewerMappings([{id:'a'},{id:'b'}],'shared',['a','r1'],[]);
  assert.deepEqual(mappings,[
    {participantId:'a',reviewerIds:['r1']},
    {participantId:'b',reviewerIds:['a','r1']}
  ]);
});

test('requires explicit identity visibility for a newly authored request',()=>{
  const model=require(modelPath);
  const result=model.validateLaunch({
    goal:'Coaching evidence',due:'20/08/2026',participants:[{id:'p1'}],reviewers:[{id:'r1'}],
    reviewerMappings:[{participantId:'p1',reviewerIds:['r1']}],questions:[{type:'open_text',text:'What should grow?'}],
    identityVisibility:''
  },'16/08/2026');
  assert.ok(result.errors.some(error=>error.field==='identityVisibility'));
});

test('uses the shared PMS employee fixture and canonical display domains',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const employees=fs.readFileSync(require.resolve('../assets/employees-data.js'),'utf8');
  assert.match(page,/<script src="\.\.\/assets\/employees-data\.js"><\/script>/);
  assert.match(page,/window\.PMS_EMPLOYEES/);
  assert.match(employees,/login:'tu\.nguyen'/);
  assert.doesNotMatch(page,/tuankiet/);
});

test('requires a reviewer for each selected recipient and complete rating labels',()=>{
  const model=require(modelPath);
  const result=model.validateLaunch({
    goal:'Coaching evidence',due:'20/08/2026',participants:[{id:'p1'}],
    reviewerMappings:[{participantId:'p1',reviewerIds:[]}],
    questions:[{type:'rating',text:'Collaboration',ratingScale:5,ratingLabels:{1:'Very low'}}]
  },'16/08/2026');
  assert.deepEqual(result.errors.map(error=>error.field),['reviewerMappings','questions']);
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

test('derives the shared campaign status vocabulary and report attention states',()=>{
  const model=require(modelPath);
  assert.equal(model.campaignViewState({status:'collecting',due:'13/08/2026'},'11/08/2026'),'due_soon');
  assert.equal(model.isDueSoon({status:'collecting',due:'14/08/2026'},'11/08/2026'),true);
  assert.equal(model.campaignViewState({status:'collecting',due:'10/08/2026'},'11/08/2026'),'overdue');
  assert.equal(model.campaignViewState({status:'closed',report:'none'},'11/08/2026'),'closed');
  assert.deepEqual(model.campaignStatus({status:'draft'},'11/08/2026'),{state:'draft',label:'Nháp',icon:'bx-circle'});
  assert.deepEqual(model.campaignStatus({status:'collecting',due:'20/08/2026',done:4,total:4},'11/08/2026'),{state:'complete',label:'Hoàn thành',icon:'bx-check-circle'});
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

test.skip('legacy H-05 UI follows the shared model, draft route and typography contracts',()=>{
  const index=fs.readFileSync(require.resolve('./index.html'),'utf8');
  const create=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(index,/feedback-program-model\.js/);
  assert.match(create,/feedback-program-model\.js/);
  assert.match(index,/create-campaign\.html\?id=\$\{encodeURIComponent\(c\.id\)\}/);
  assert.match(create,/FeedbackProgramModel\.validateLaunch/);
  assert.match(create,/type:'open_text'/);
  assert.doesNotMatch(create,/chọn tình huống sử dụng/i);
  assert.doesNotMatch(create,/\.scn-grid|\.scn-opt/);
  for(const html of [index]){
    assert.match(html,/\.page-h\{font-size:18px/);
    assert.match(html,/\.page-sub\{font-size:12\.5px/);
    assert.match(html,/body\{font-family:'Public Sans',sans-serif;font-size:14px;line-height:1\.5;color:var\(--z700\);background:var\(--z50\)/);
  }
  assert.match(create,/\.page-h\{font-size:18px/);
  assert.match(create,/body\{font-family:'Public Sans',sans-serif;font-size:14px;line-height:1\.5;color:var\(--z700\);background:var\(--z50\)/);
  assert.doesNotMatch(create,/class="page-sub"/);
  assert.match(create,/\.request-builder-form\{/);
  assert.match(create,/\.field-label\{[^}]*font-size:12px/);
  assert.match(index,/--program-columns:/);
  assert.match(index,/\.board-head,\.row\{[^}]*grid-template-columns:var\(--program-columns\)[^}]*align-items:start/);
  assert.match(index,/\.summary-row\{[^}]*grid-template-columns:12px minmax\(0,1fr\) 28px/);
  assert.match(index,/\.summary-row \.s-num\{[^}]*text-align:right[^}]*font-variant-numeric:tabular-nums/);
});

test('H-05 entry CTA opens the request builder with approved wording',()=>{
  const page=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(page,/<a class="btn btn-primary" href="create-campaign\.html"><i class="bx bx-plus"><\/i> T\u1ea1o y\u00eau c\u1ea7u ph\u1ea3n h\u1ed3i<\/a>/);
});

test('HR request builder centers the input surface while keeping page navigation full width',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/\.builder-form-surface\{width:100%;max-width:860px;margin:0 auto\}/);
  assert.match(page,/<div class="builder-form-surface">\s*<form class="request-builder-form"/);
  assert.match(page,/\.wrap\{width:100%;max-width:1100px/);
});

test('HR builder keeps the deadline compact and identity options aligned at laptop widths',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/\.request-builder-form \.schedule-visibility\{display:grid;grid-template-columns:220px minmax\(0,1fr\);gap:24px;align-items:start\}/);
  assert.match(page,/\.request-builder-form \.feedback-choice-options\{grid-template-columns:minmax\(0,1\.16fr\) minmax\(0,\.84fr\)\}/);
  assert.match(page,/\.request-builder-form \.feedback-choice-card small\{[^}]*-webkit-line-clamp:2[^}]*overflow:hidden/);
  assert.match(page,/@media\(max-width:860px\)\{\.request-builder-form \.schedule-visibility\{grid-template-columns:1fr;gap:18px\}\}/);
});

test('design system documents centered HR authoring and responsive context-width controls',()=>{
  const design=fs.readFileSync(require.resolve('../DESIGN-SYSTEM.md'),'utf8');
  assert.match(design,/Form authoring[^\n]*max-width 860px/i);
  assert.match(design,/Thời hạn phản hồi[^\n]*220px/);
  assert.match(design,/Người nhận phản hồi ở trái, người cho phản hồi ở phải/i);
});

test.skip('legacy H-05 request builder uses one ordered form without wizard chrome',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.doesNotMatch(page,/class="stepper"|footStep|btnDraft|data-step=/);
  const fields=['id="progName"','id="tplSel"','id="qList"','id="recipientMappings"','id="dueDate"','id="invitationMessage"'];
  assert.deepEqual(fields.map(field=>page.indexOf(field)).sort((a,b)=>a-b),fields.map(field=>page.indexOf(field)));
  assert.match(page,/Quay l\u1ea1i/);
  assert.doesNotMatch(page,/badge-soon|Kh\u1ea3o s\u00e1t 360/);
});

test.skip('legacy request builder starts unselected and exposes editable rating configuration',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/<option value="" selected disabled>Ch\u1ecdn b\u1ed9 c\u00e2u h\u1ecfi<\/option>/);
  assert.match(page,/>T\u1ef1 t\u1ea1o b\u1ed9 c\u00e2u h\u1ecfi</);
  assert.match(page,/Ph\u1ed1i h\u1ee3p li\u00ean ph\u00f2ng ban/);
  assert.match(page,/function setQuestionType\(index,type\)/);
  assert.match(page,/function setRatingScale\(index,scale\)/);
  assert.match(page,/ratingLabels/);
});

test.skip('legacy request builder maps every recipient to an independent reviewer set and supports copy',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/reviewerMappings/);
  assert.match(page,/function addMappingReviewer\(participantId,reviewerId\)/);
  assert.match(page,/function copyMappingReviewers\(sourceParticipantId,targetParticipantIds\)/);
  assert.match(page,/aria-label="Sao chép người cho phản hồi"/);
  assert.doesNotMatch(page,/id="rInput"|id="rChips"/);
});

test.skip('legacy request builder persists recipient mappings and the invitation message',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/id="invitationMessage"/);
  assert.match(page,/invitationMessage:STATE\.invitationMessage/);
  assert.match(page,/reviewerMappings:STATE\.reviewerMappings/);
  assert.match(page,/localStorage\.setItem\('uc5_campaigns'/);
  assert.match(page,/location\.href=`\.\.\/H-06\/index\.html\?id=\$\{encodeURIComponent\(result\.campaign\.id\)\}`/);
});

test('design system documents the shared or per-recipient structured-feedback builder rules',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(design,/Structured feedback builder/i);
  assert.match(design,/dùng chung một nhóm người cho/i);
  assert.match(design,/thiết lập riêng theo từng người nhận/i);
  assert.match(design,/Nút tạo chỉ mở màn rà soát/i);
  assert.match(design,/rating scale/i);
  assert.match(design,/12\.5px\/600/);
  assert.match(design,/13px\/400/);
  assert.match(design,/2.*10|10.*2/);
  assert.match(design,/Ẩn danh/);
  assert.match(design,/Hiển thị danh tính/);
  assert.doesNotMatch(design,/Ghi danh/);
  assert.match(design,/Chưa chia sẻ kết quả/);
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

test('reminds pending program assignments through overdue collection until closure, once per rolling 24 hours',()=>{
  const model=require(modelPath),campaign={status:'collecting',due:'15/08/2026'};
  const assignment={id:'a1',status:'pending',manualReminderHistory:['12/08/2026 10:00']};
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'13/08/2026 09:59'),false);
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'13/08/2026 10:00'),true);
  assert.equal(model.canRemindProgramAssignment(campaign,{status:'submitted'},'13/08/2026 10:00'),false);
  assert.equal(model.canRemindProgramAssignment(campaign,assignment,'16/08/2026 10:00'),true);
  assert.equal(model.canRemindProgramAssignment({status:'closed',due:'15/08/2026'},assignment,'16/08/2026 10:00'),false);
  /* Quá hạn vẫn nhắc được trong 90 ngày kể từ ngày tạo, sau đó ngừng. */
  const windowCampaign={status:'collecting',createdAt:'01/08/2026',due:'15/08/2026'};
  assert.equal(model.canRemindProgramAssignment(windowCampaign,{status:'pending',manualReminderHistory:[]},'20/09/2026 10:00'),true);
  assert.equal(model.canRemindProgramAssignment(windowCampaign,{status:'pending',manualReminderHistory:[]},'01/11/2026 10:00'),false);
});

test('H-05 list reminder uses the shared eligibility and cooldown rule',()=>{
  const page=fs.readFileSync(require.resolve('./index.html'),'utf8');
  assert.match(page,/function canRemindCampaign\(campaign\)\{[\s\S]*canRemindProgramAssignment\(campaign,assignment,NOW\)/);
  assert.match(page,/function remind\(id\)\{[\s\S]*remindEligibleProgramAssignments\(campaign,participants,NOW\)/);
  assert.match(page,/Nhắc những người chưa trả lời đủ điều kiện/);
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

test('seeds report-ready, rating, self-assessment and reminder-history demo data',()=>{
  const data=require('./feedback-program-data.js');
  const made=data.programById('s10'),madeDetail=data.detailForProgram(made);
  assert.equal(made.report,'made');
  assert.equal(made.includeSelf,true);
  const rating=madeDetail.questions.find(question=>question.type==='rating');
  assert.equal(rating.ratingScale,5);
  const self=madeDetail.participants[0].assignments.find(assignment=>assignment.selfAssessment);
  assert.ok(self);
  assert.equal(self.answers.find(answer=>answer.questionId===rating.id).score,4);
  const empty=data.detailForProgram(data.programById('s11'));
  assert.equal(empty.campaign.done,0);
  assert.ok(empty.participants.flatMap(participant=>participant.assignments).every(assignment=>assignment.status==='pending'));
  assert.equal(empty.participants[0].assignments[1].manualReminderHistory.length,2);
  const detailPage=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(detailPage,/class="rating-answer"/);
  assert.match(detailPage,/Tự đánh giá/);
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
  assert.match(detail,/function renderProgramOverview\(\)\{[\s\S]*?FeedbackProgramModel\.campaignStatus\(PROGRAM,TODAY\)[^`]*summary-status summary-status-\$\{status\.state\}/);
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

test('normalizes safe result visibility defaults for legacy programs',()=>{
  const model=require(modelPath);
  const campaign=model.normalizeCampaign({});
  assert.equal(campaign.identityVisibility,'named');
  assert.deepEqual(campaign.resultSharing,{mode:'not_shared',participantIds:[],audiences:[],additionalViewerNames:[],contentLevel:'',note:'',sharedAt:'',sharedBy:'hr',shareCount:0,log:[]});
});

test('shares results for selected recipients without exposing other recipients',()=>{
  const model=require(modelPath);
  const campaign=model.shareResults({id:'s1'},['p1','p3'],'16/08/2026',{audiences:['recipients','managers']});
  assert.equal(campaign.resultSharing.mode,'shared_selected');
  assert.deepEqual(campaign.resultSharing.participantIds,['p1','p3']);
  assert.deepEqual(campaign.resultSharing.audiences,['recipients','managers']);
  assert.equal(campaign.resultSharing.shareCount,1);
  assert.equal(campaign.resultSharing.log.length,1);
  const _ignore=({sharedAt:'16/08/2026',sharedBy:'hr'});
  assert.equal(model.isResultShared(campaign,'p1'),true);
  assert.equal(model.isResultShared(campaign,'p2'),false);
});

test('records a specific result-sharing audience and typed additional viewers',()=>{
  const model=require(modelPath);
  const campaign=model.shareResults({id:'s1'},['p1'],'16/08/2026',{
    audiences:['others'],additionalViewerNames:['Mai Thị Hằng','Nguyễn Thành Nam']
  });
  assert.deepEqual(campaign.resultSharing.audiences,['others']);
  assert.deepEqual(campaign.resultSharing.additionalViewerNames,['Mai Thị Hằng','Nguyễn Thành Nam']);
});

test('seeds two structured HR request items for Nguyễn Văn Tú without core-value badges',()=>{
  const data=require('./feedback-program-data.js'),model=require(modelPath),program=model.normalizeCampaign(data.programById('s12'));
  const detail=data.detailForProgram(program);
  assert.equal(program.requestSource,'hr');
  assert.equal(program.requestedBy.name,'Lê Minh Thu');
  assert.match(program.invitationMessage,/HR mời bạn chia sẻ góc nhìn cụ thể/);
  assert.equal(program.identityVisibility,'anonymous');
  assert.deepEqual(detail.questions.map(question=>question.id),['q1','q2','q3']);
  assert.deepEqual(detail.participants.map(item=>item.employee.id),['bao.nguyen','hang.mai']);
  assert.ok(detail.participants.every(item=>item.assignments.some(assignment=>assignment.reviewer.id==='tu.nguyen')));
  assert.ok(detail.participants.every(item=>item.assignments.every(assignment=>assignment.badges.length===0)));
  assert.deepEqual(model.resultAudience(program,'bao.nguyen'),{released:false,audiences:[],identityVisibility:'anonymous'});
  assert.equal(model.canViewProgramResult(program,'bao.nguyen','recipients'),false);
  assert.equal(model.canViewProgramResult(program,'bao.nguyen','managers'),false);
  assert.equal(model.canViewProgramResult(program,'bao.nguyen','hr'),true);
});

test('requires an explicit HR audience release before employee or manager can view a program result',()=>{
  const model=require(modelPath);
  const campaign=model.shareResults({id:'s1',status:'closed'},['p1'],'16/08/2026',{audiences:['recipients']});
  assert.equal(model.canViewProgramResult(campaign,'p1','recipients'),true);
  assert.equal(model.canViewProgramResult(campaign,'p1','managers'),false);
  assert.equal(model.canViewProgramResult(campaign,'p2','recipients'),false);
});

test('seeds a named-identity HR request item for Nguyễn Văn Tú',()=>{
  const data=require('./feedback-program-data.js'),model=require(modelPath),program=model.normalizeCampaign(data.programById('s13'));
  const detail=data.detailForProgram(program);
  assert.equal(program.identityVisibility,'named');
  assert.deepEqual(detail.participants.map(item=>item.employee.id),['tung.dinh']);
  assert.ok(detail.participants[0].assignments.some(assignment=>assignment.reviewer.id==='tu.nguyen'));
  assert.deepEqual(detail.questions.map(question=>question.id),['q1','q2','q3']);
});

test('HR builder owns requester, identity and release messaging for structured programs',()=>{
  const builder=fs.readFileSync(path.join(__dirname,'create-campaign.html'),'utf8');
  assert.match(builder,/requestedBy:CURRENT_HR/);
  assert.match(builder,/HR chọn cách hiển thị danh tính trong kết quả phản hồi được chia sẻ/);
  assert.match(builder,/người cho phản hồi nhận Request Item của mình/);
  assert.doesNotMatch(builder,/quản lý trực tiếp của người nhận đã được gửi thông báo/);
});

test('seeds a two-entry sharing history with the recipients for each share',()=>{
  const data=require('./feedback-program-data.js');
  const sharing=require(modelPath).normalizeCampaign(data.programById('s7')).resultSharing;
  assert.equal(sharing.shareCount,2);
  assert.deepEqual(sharing.log.map(entry=>entry.participantIds),[['tu.nguyen','bao.nguyen'],['hang.mai']]);
  assert.deepEqual(sharing.log.map(entry=>entry.audiences),[['recipients','managers'],['others']]);
});

test('H-06 result sharing popup keeps audience options compact and uses the M-04 people picker',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.match(detail,/id="shareResultSettings"/);
  assert.match(detail,/'recipients','Người nhận phản hồi'/);
  assert.match(detail,/'managers','Các cấp quản lý'/);
  assert.match(detail,/'others','Người khác'/);
  assert.match(detail,/function setResultShareAudience\(audience\)/);
  assert.match(detail,/share-audience-multi/);
  assert.match(detail,/type="checkbox" name="resultShareAudience"/);
  assert.doesNotMatch(detail,/Người nhận phản hồi và cấp quản lý trực tiếp hoặc cấp cao hơn đều có thể xem/);
  assert.match(detail,/function filterResultSharePeople\(\)/);
  assert.match(detail,/window\.PMS_EMPLOYEES/);
  assert.match(detail,/if\(!query\)return '';/);
  assert.match(detail,/share-viewer-chips[\s\S]*share-people-picker/);
  assert.match(detail,/share-viewer-chip[^}]*font-size:12px/);
  assert.match(detail,/Danh tính người cho phản hồi/);
  assert.match(detail,/Hiển thị tên người cho phản hồi cùng nội dung/);
  assert.match(detail,/Chỉ hiển thị nội dung phản hồi/);
  assert.match(detail,/btn-primary btn-share/);
  assert.doesNotMatch(detail,/>Hủy<\/button>/);
});

test('H-06 overview keeps result sharing to one compact status row and puts identity information last',()=>{
  const detail=fs.readFileSync(path.join(__dirname,'..','H-06','index.html'),'utf8');
  assert.match(detail,/summary-share-status/);
  assert.match(detail,/Lịch sử chia sẻ kết quả/);
  assert.match(detail,/function openShareHistory\(\)/);
  assert.match(detail,/function shareLogEntries\(sharing\)/);
  assert.match(detail,/function shareEntryRecipientText\(entry\)/);
  assert.match(detail,/Lần \$\{index\+1\}:/);
  assert.match(detail,/Kết quả của ai được chia sẻ/);
  assert.match(detail,/Người được chia sẻ/);
  const pending=detail.lastIndexOf('<span>Phản hồi đang chờ</span>');
  const identity=detail.lastIndexOf('<span>Danh tính người cho phản hồi</span>');
  assert.ok(pending>-1&&identity>pending);
});

test('design system documents the required result-sharing audience and identity context',()=>{
  const designSystem=fs.readFileSync(path.join(__dirname,'..','design-system','index.html'),'utf8');
  assert.match(designSystem,/cho chọn NHIỀU nhóm được xem/);
  assert.match(designSystem,/Người khác/);
  assert.match(designSystem,/Danh tính người cho phản hồi/);
  assert.match(designSystem,/không lặp metadata mô tả dưới các option/);
  assert.match(designSystem,/Status chia sẻ kết quả trong panel tổng quan hiển thị một hàng/);
  assert.match(designSystem,/Chip người đã chọn đứng trên ô tìm kiếm/);
});

test('closes a ticket by locking every pending assignment while preserving submitted feedback',()=>{
  const model=require(modelPath);
  const campaign=model.closeCampaign({
    status:'collecting',
    assignments:[{id:'a1',status:'pending'},{id:'a2',status:'submitted'}]
  },'16/08/2026');
  assert.equal(campaign.status,'closed');
  assert.equal(campaign.closedAt,'16/08/2026');
  assert.deepEqual(campaign.assignments.map(item=>item.status),['locked','submitted']);
});

test('uses the M-04 form scale and an unambiguous feedback direction in the HR builder',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/\.field-label\{[^}]*font-size:12\.5px[^}]*font-weight:600/);
  assert.match(page,/\.fc\{[^}]*font-size:13px[^}]*font-weight:400/);
  assert.match(page,/\.field-hint\{[^}]*font-size:11\.5px/);
  assert.match(page,/Người nhận phản hồi<span class="req-star">\*<\/span>/);
  assert.match(page,/Ng\u01b0\u1eddi cho ph\u1ea3n h\u1ed3i/);
  assert.match(page,/class="mapping-arrow" aria-hidden="true"><\/span>/);
  assert.match(page,/aria-label="Sao chép người cho phản hồi"/);
  assert.doesNotMatch(page,/<div class="form-actions"><a[^>]*>Quay lại<\/a>/);
});

test.skip('legacy places deadline after recipient mapping beside reviewer identity visibility',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const mapping=page.indexOf('Người nhận phản hồi');
  const deadline=page.indexOf('Thời hạn phản hồi');
  const visibility=page.indexOf('Danh tính người cho phản hồi');
  assert.ok(mapping>-1&&deadline>mapping&&visibility>deadline);
  assert.match(page,/Hiện danh tính của người cho phản hồi/);
  assert.match(page,/Ẩn danh người cho phản hồi/);
  assert.match(page,/người nhận phản hồi, người cho phản hồi và quản lý trực tiếp/);
});

test('accepts Likert scales from two through ten with endpoint meanings by default',()=>{
  const model=require(modelPath);
  const result=model.validateLaunch({
    goal:'Gather evidence',due:'20/08/2026',participants:[{id:'p1'}],reviewers:[{id:'r1'}],
    questions:[{type:'rating',text:'Collaboration quality',ratingScale:7,ratingLabels:{1:'Needs work',7:'Role model'}}]
  },'16/08/2026');
  assert.equal(result.valid,true);
  assert.equal(result.campaign.questions[0].ratingScale,7);
});

test('requires every rating meaning only when detailed rating descriptions are enabled',()=>{
  const model=require(modelPath);
  const result=model.validateLaunch({
    goal:'Gather evidence',due:'20/08/2026',participants:[{id:'p1'}],reviewers:[{id:'r1'}],
    questions:[{type:'rating',text:'Collaboration quality',ratingScale:4,detailedRatingLabels:true,ratingLabels:{1:'Needs work',4:'Role model'}}]
  },'16/08/2026');
  assert.deepEqual(result.errors,[{field:'questions',code:'required'}]);
});

test('renders concise open and Likert question controls with supplied-template distinction',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/Câu hỏi mở/);
  assert.match(page,/Câu hỏi Likert/);
  assert.match(page,/function setRatingScale\(index,scale\)/);
  assert.match(page,/Mô tả từng mức/);
  assert.match(page,/question-editor\.template-selected/);
  assert.doesNotMatch(page,/>Tự luận</);
  assert.doesNotMatch(page,/>Thang điểm</);
});

test.skip('legacy HR builder resets a supplied questionnaire when HR switches back to custom',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/if\(templateId==='custom'\)\{STATE\.questions=\[\{id:'q1',type:'open_text',text:''\}\];renderQuestions\(\);return;\}/);
});

test.skip('legacy HR builder keeps free input neutral and makes question editors compact',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/\.fc\{[^}]*color:var\(--z600\)/);
  assert.match(page,/textarea\.fc\{min-height:38px/);
  assert.match(page,/rows="1"/);
  assert.match(page,/function resizeQuestionInput\(element\)/);
  assert.match(page,/rating-toolbar/);
  assert.match(page,/rating-detail-toggle/);
});

test.skip('legacy HR builder maps M-04 style people with a compact reviewer picker and icon-only copy',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/mapping-person-picker/);
  assert.match(page,/mapping-picker-results/);
  assert.match(page,/mapping-person-meta/);
  assert.match(page,/Sao chép người cho phản hồi/);
  assert.match(page,/aria-label="Sao chép người cho phản hồi"/);
  assert.doesNotMatch(page,/<i class="bx bx-copy"><\/i> Sao chép toàn bộ người cho phản hồi/);
  assert.match(page,/Người cho phản hồi<span class="req-star">\*<\/span><\/span><span aria-hidden="true"><\/span><span>Người nhận phản hồi/);
  assert.match(page,/Danh tính người cho phản hồi/);
  assert.match(page,/function openReviewerPicker\(participantId\)\{if\(STATE\.activeReviewerPicker===participantId\)return;/);
});

test.skip('legacy HR builder keeps recipient selection inside the same M-04 mapping row',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.doesNotMatch(page,/id="recipientSelect"/);
  assert.match(page,/function openRecipientPicker\(\)/);
  assert.match(page,/mapping-row-add/);
  assert.match(page,/mapping-flow-placeholder/);
  assert.doesNotMatch(page,/mapping-person-meta">\$\{personMeta\(participant\)\}/);
});

test.skip('legacy persists reviewer identity visibility and starts every new request as not shared',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/name="identityVisibility" value="named" checked/);
  assert.match(page,/name="identityVisibility" value="anonymous"/);
  assert.match(page,/identityVisibility:document\.querySelector\('input\[name="identityVisibility"\]:checked'\)\.value/);
  assert.match(page,/resultSharing:\{mode:'not_shared'/);
});

test('maps shared and per-recipient reviewers with a conditional copy action',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/reviewerAssignmentMode:'shared'/);
  assert.match(page,/sharedReviewerIds:\[\]/);
  assert.match(page,/function setReviewerAssignmentMode\(mode\)/);
  assert.match(page,/function addSharedRecipient\(id\)/);
  assert.match(page,/function addIndividualRecipient\(id\)/);
  assert.match(page,/reviewers\.length\?`<span class="pms-tooltip"><button type="button" class="mapping-copy"/);
  assert.match(page,/FeedbackProgramModel\.expandReviewerMappings/);
});

test('preserves selected people when HR changes assignment mode',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/if\(mode==='per_recipient'\)STATE\.reviewerMappings=FeedbackProgramModel\.expandReviewerMappings/);
  assert.match(page,/if\(mode==='shared'\)STATE\.sharedReviewerIds=/);
});

test('uses the M-04 people picker pattern without widening the personalised mapping flow',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const selectedChipRenderer=page.slice(page.indexOf('function renderChips('),page.indexOf('function recipientRole('));
  const recipientRenderer=page.slice(page.indexOf('function recipientRole('),page.indexOf('function renderSharedMapping('));

  assert.match(page,/id="personalizeReviewers"/);
  assert.match(page,/Cá nhân hóa người cho theo từng người nhận/);
  assert.doesNotMatch(page,/class="mapping-mode"/);
  assert.match(page,/\.mapping-list\.per-recipient \.mapping-row[^}]*grid-template-columns:minmax\(0,\.3fr\) 24px minmax\(0,\.7fr\)/);
  assert.match(page,/\.mapping-chip\{[^}]*border-color:var\(--brand-ring\)[^}]*background:var\(--brand-muted\)/);
  assert.match(page,/\.mapping-chip \.mapping-avatar,\.mapping-person-card \.mapping-avatar\{[^}]*background:var\(--brand\)[^}]*color:#fff/);
  assert.match(page,/\.mapping-person-picker \.fc\{min-height:34px/);
  assert.doesNotMatch(selectedChipRenderer,/mapping-domain/);
  assert.doesNotMatch(recipientRenderer,/mapping-domain/);
  assert.match(page,/\.mapping-reviewer-head\{display:flex/);
  assert.match(page,/\.mapping-copy\{[^}]*display:grid[^}]*flex:none/);
});

test('stages a review before final send persists a request',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.match(page,/function buildReviewPayload\(\)/);
  assert.match(page,/function showReview\(result\)/);
  assert.match(page,/id="reviewModal"/);
  assert.match(page,/class="review-modal" role="dialog" aria-modal="true"/);
  assert.doesNotMatch(page,/class="review-screen" id="reviewScreen"/);
  assert.match(page,/function closeReview\(\)/);
  assert.match(page,/function confirmAndSend\(\)\{[\s\S]*persistRequest\(result\.campaign\)/);
  const submit=page.slice(page.indexOf('function submitRequest(event)'),page.indexOf('function confirmAndSend()'));
  assert.doesNotMatch(submit,/persistRequest\(/);
  assert.doesNotMatch(submit,/requestForm'\)\.style\.display/);
  assert.match(page,/Người nhận phản hồi<\/span>[\s\S]*?Người cho phản hồi<\/span>/);
  assert.match(page,/\.mapping-arrow\{border-left:0;border-right:8px solid var\(--z600\)/);
  assert.match(page,/bxs-left-arrow review-arrow/);
  assert.match(page,/\.review-modal \.review-actions\{[^}]*padding:12px 18px 16px/);
  assert.match(page,/\.review-modal \.review-actions \.btn\{[^}]*height:32px[^}]*font-size:12px/);
});

test('keeps identity unselected and gives deadline reminder metadata',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  assert.doesNotMatch(page,/name="identityVisibility" value="named" checked/);
  assert.match(page,/name="identityVisibility" value="anonymous"/);
  assert.match(page,/selectedIdentity\(\)\{return document\.querySelector\('input\[name="identityVisibility"\]:checked'\)\?\.value\|\|''\}/);
  assert.match(page,/Hệ thống tự nhắc người chưa trả lời 3 ngày trước hạn phản hồi/);
});

test('renders reviewer identity as two equal feedback choice cards',()=>{
  const page=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');

  assert.match(page,/class="feedback-choice-options"/);
  assert.match(page,/class="feedback-choice-card" id="identityNamed"/);
  assert.match(page,/class="feedback-choice-card" id="identityAnonymous"/);
  assert.match(page,/onchange="setIdentityVisibility\('named'\)"/);
  assert.match(page,/\.feedback-choice-options\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)[^}]*gap:8px/);
  assert.match(page,/\.feedback-choice-card\{[^}]*border:1px solid var\(--z200\)[^}]*background:#fff/);
  assert.match(page,/\.feedback-choice-card\.on\{[^}]*border-color:var\(--brand\)[^}]*background:var\(--brand-muted\)/);
  assert.match(design,/Feedback binary-choice card/i);
});

test('design rules preserve request-review confirmation dialogs and compact footer actions',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  const markdown=fs.readFileSync(require.resolve('../DESIGN-SYSTEM.md'),'utf8');
  assert.match(design,/Review-confirmation modal/i);
  assert.match(design,/người nhận ở bên trái và người cho ở bên phải/i);
  assert.match(markdown,/Review-confirmation modal/i);
  assert.match(markdown,/32px/);
});

test('design system protects neutral entry color, compact questions and M-04 people formatting',()=>{
  const design=fs.readFileSync(require.resolve('../design-system/index.html'),'utf8');
  assert.match(design,/zinc gray/i);
  assert.match(design,/M-04 person picker/i);
  assert.match(design,/one-line question editor/i);
  assert.match(design,/icon-only copy/i);
});

test('H-06 keeps closure and sharing as separate HR actions with scoped confirmation',()=>{
  const detail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  assert.match(detail,/id="programActions"/);
  assert.match(detail,/Đóng ticket/);
  assert.match(detail,/Chưa chia sẻ kết quả/);
  assert.match(detail,/Đã chia sẻ kết quả/);
  assert.match(detail,/Chia sẻ toàn bộ kết quả/);
  assert.match(detail,/Chia sẻ kết quả cá nhân/);
  assert.match(detail,/function requestResultShare\(scope\)/);
  assert.match(detail,/function confirmResultShare\(participantIds,options\)/);
  for(const name of ['renderProgramOverview','sharingSummary','openResultDialog','requestResultShare','confirmResultShare'])assert.equal((detail.match(new RegExp(`function ${name}\\(`,'g'))||[]).length,1,`${name} is defined once`);
  assert.match(detail,/FeedbackProgramModel\.closeCampaign/);
  assert.match(detail,/\.summary-status-closed\{/);
});

test('per-question required flag survives normalize, clone and version history',()=>{
  const programModel=require(modelPath);
  const libraryModel=require(questionnaireModelPath);
  const before=libraryModel.normalize({
    id:'tpl-1',name:'HRBP_Khảo sát',ownerId:'hrbp-1',ownerName:'Lê Thuỳ Anh',
    questions:[{id:'q1',type:'open_text',text:'Điểm mạnh?',required:true},{id:'q2',type:'open_text',text:'Góp ý thêm?'}]
  },{id:'hrbp-1',name:'Lê Thuỳ Anh'});

  assert.deepEqual(before.questions.map(question=>question.required),[true,false]);
  assert.deepEqual(libraryModel.cloneForRequest(before).map(question=>question.required),[true,false]);

  const after=libraryModel.normalize({...before,questions:[{...before.questions[0],required:false},before.questions[1]]},{id:'hrbp-1'});
  const changes=libraryModel.diffTemplates(before,after);
  assert.equal(changes.length,1);
  assert.match(changes[0].label,/Đổi thiết lập trả lời Câu hỏi 1/);
  assert.equal(changes[0].before,'Bắt buộc trả lời');
  assert.equal(changes[0].after,'Không bắt buộc');

  const campaign=programModel.normalizeCampaign({questions:[{id:'q1',type:'open_text',text:'Điểm mạnh?',required:true},{id:'q2',type:'open_text',text:'Góp ý thêm?'}]});
  assert.deepEqual(campaign.questions.map(question=>question.required),[true,false]);
});

test('HR authoring screens expose a per-question required toggle defaulting to optional',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const library=fs.readFileSync(require.resolve('./questionnaire-library.html'),'utf8');

  assert.match(builder,/function setQuestionRequired\(index,checked\)/);
  assert.match(builder,/class="opt-toggle q-required/);
  assert.match(builder,/onchange="setQuestionRequired\(\$\{index\},this\.checked\)"/);
  assert.match(builder,/type:'open_text',text:'',required:false/);
  assert.match(builder,/question\.required\?'<span class="req-star">\*<\/span>':''/);

  assert.match(library,/function setEditorQuestionRequired\(index,checked\)/);
  assert.match(library,/onchange="setEditorQuestionRequired\(\$\{index\},this\.checked\)"/);
  assert.match(library,/type:'open_text',text:'',required:false/);
  assert.doesNotMatch(builder,/\(bắt buộc\)/);
});

test('reviewers can submit while optional questions stay empty',()=>{
  const reply=fs.readFileSync(require.resolve('../E-04/index.html'),'utf8');
  assert.match(reply,/function hrQuestionAnswered\(question\)/);
  assert.match(reply,/questions\.filter\(question=>question\.required\)\.every\(hrQuestionAnswered\)&&questions\.some\(hrQuestionAnswered\)/);
  assert.match(reply,/question\.required\?'<span class="hr-reply-required">\*<\/span>':''/);
});

test('template picker offers a custom option, silent swap and a text-fitted current tag',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');

  assert.match(builder,/class="btn btn-outline" type="button" onclick="startCustomQuestionnaire\(\)"/);
  assert.match(builder,/Tự tạo bộ câu hỏi mới/);
  assert.match(builder,/function applyCustomQuestionnaire\(\)/);
  assert.match(builder,/function startCustomQuestionnaire\(\)/);
  assert.match(builder,/STATE\.templateId='custom'/);
  /* Tự tạo là hành động ở footer, không phải một lựa chọn trong danh sách bộ có sẵn. */
  assert.doesNotMatch(builder,/tpl-option-custom/);
  assert.doesNotMatch(builder,/pickTemplate\('custom'\)/);

  assert.match(builder,/function questionsMatchTemplate\(\)/);
  assert.match(builder,/if\(!hasQuestionContent\(\)\|\|questionsMatchTemplate\(\)\|\|confirm\(/);

  assert.match(builder,/\.tpl-option>\.tpl-option-current\{display:inline-flex;align-items:center;flex:0 0 auto;width:auto;/);
  assert.doesNotMatch(builder,/\.tpl-option-current\{[^}]*height:20px/);
});

test('question order is reordered by drag and drop in both authoring screens',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const library=fs.readFileSync(require.resolve('./questionnaire-library.html'),'utf8');

  for(const html of [builder,library]){
    /* Kéo thả thay cho nút mũi tên, nhưng tay cầm vẫn nhận phím mũi tên cho người dùng bàn phím. */
    assert.match(html,/class="q-drag"/);
    assert.match(html,/bx-grid-vertical/);
    assert.match(html,/draggable="false"/);
    assert.doesNotMatch(html,/q-move-btn/);
    assert.doesNotMatch(html,/data-tooltip="Chuyển (lên trên|xuống dưới)"/);
  }

  assert.match(builder,/function startQuestionDrag\(event,index\)/);
  assert.match(builder,/function dropQuestion\(event,index\)/);
  assert.match(builder,/function setQuestionDraggable\(element,on\)/);
  assert.match(builder,/function questionHandleKey\(event,index\)/);
  assert.match(builder,/onmousedown="setQuestionDraggable\(this,true\)"/);
  assert.match(builder,/function moveQuestion\(index,step\)/);

  assert.match(library,/function startEditorDrag\(event,index\)/);
  assert.match(library,/function dropEditorQuestion\(event,index\)/);
  assert.match(library,/function setEditorDraggable\(element,on\)/);
  assert.match(library,/function editorHandleKey\(event,index\)/);
  assert.match(library,/function moveEditorQuestion\(index,step\)/);
});

test('review modal can save the request as a draft and reopen it without duplicating',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const list=fs.readFileSync(require.resolve('./index.html'),'utf8');

  assert.match(builder,/onclick="saveRequestDraft\(\)"><i class="bx bx-save"><\/i> Lưu nháp/);
  assert.match(builder,/function saveRequestDraft\(\)/);
  assert.match(builder,/\.\.\.result\.campaign,status:'draft',done:0/);
  /* Lưu lại một nháp đang mở phải ghi đè theo id, không đẩy thêm bản mới vào danh sách. */
  assert.match(builder,/function persistRequest\(payload\)\{const saved=loadSavedCampaigns\(\)\.filter\(item=>item\.id!==payload\.id\)/);
  assert.match(builder,/id:draftId\|\|`u\$\{Date\.now\(\)\}`/);
  assert.match(builder,/function loadDraft\(id\)/);
  assert.match(builder,/Tiếp tục thiết lập yêu cầu phản hồi/);
  assert.match(list,/created'\)==='draft'\)toast/);
});

test('draft requests can be deleted after an explicit confirmation',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const list=fs.readFileSync(require.resolve('./index.html'),'utf8');

  assert.match(builder,/id="deleteDraftBtn" onclick="askDeleteDraft\(\)"/);
  assert.match(builder,/class="btn btn-outline btn-danger hidden"/);
  assert.match(builder,/getElementById\('deleteDraftBtn'\)\.classList\.remove\('hidden'\)/);
  assert.match(builder,/id="deleteDraftModal"/);
  assert.match(builder,/function confirmDeleteDraft\(\)/);
  assert.match(builder,/Xóa rồi sẽ không khôi phục lại được/);
  assert.match(list,/created'\)==='deleted'\)toast/);

  /* Nút xóa chỉ nằm ở màn chi tiết yêu cầu nháp, danh sách không có cột chức năng. */
  assert.doesNotMatch(list,/row-delete/);
  assert.doesNotMatch(list,/Chức năng/);
  /* Nháp mẫu không nằm trong localStorage nên xóa phải ghi dấu, tải lại không được hiện lại. */
  assert.match(list,/const DELETED_KEY='uc5_deleted_campaigns'/);
  assert.match(list,/\.filter\(c=>!removed\.has\(c\.id\)\)/);
  assert.match(builder,/function seedDraft\(id\)/);
  assert.match(builder,/function markDraftDeleted\(id\)/);
  /* Chương trình mẫu lưu participants dạng số nên loader phải chịu được dữ liệu không phải mảng. */
  assert.match(builder,/const listOf=value=>Array\.isArray\(value\)\?value:\[\];/);
});

test('participant pickers keep the search box above the selected chips',()=>{
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');

  assert.match(builder,/\$\{renderPicker\('recipient'\)\}<div class="mapping-selected">/);
  assert.match(builder,/\$\{renderPicker\('reviewer'\)\}<div class="mapping-selected">/);
  assert.match(builder,/\$\{renderPicker\('reviewer',participant\.id\)\}<div class="mapping-reviewer-head">/);
  assert.match(builder,/\.mapping-selected:not\(:empty\)\{margin-top:7px\}/);
});

test('detail screens flag reviewers and recipients who left the company',()=>{
  const hrDetail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  const managerDetail=fs.readFileSync(require.resolve('../M-04/request-detail.html'),'utf8');

  for(const html of [hrDetail,managerDetail]){
    assert.match(html,/function isResignedPerson\(person\)/);
    assert.match(html,/Đã nghỉ việc<\/span>/);
    assert.match(html,/\.emp-tag-resigned\{/);
    /* Nhắc người đã nghỉ việc là vô nghĩa nên nút phải bị chặn kèm lý do. */
    assert.match(html,/Người cho phản hồi đã nghỉ việc, không gửi nhắc được/);
  }

  /* Nghỉ việc thì dừng cả nhắc tự động, không hiển thị ngày nhắc sẽ không bao giờ chạy. */
  for(const html of [hrDetail,managerDetail]){
    assert.match(html,/Hệ thống dừng nhắc tự động/);
    assert.match(html,/function canRemindAssignment\(/);
    assert.match(html,/align-self:flex-start;margin:5px 0 0\}/);
  }
  /* Không tạo yêu cầu mới cho người đã nghỉ việc. */
  const builder=fs.readFileSync(require.resolve('./create-campaign.html'),'utf8');
  const managerList=fs.readFileSync(require.resolve('../M-04/index.html'),'utf8');
  assert.match(builder,/window\.PMS_EMPLOYEES\|\|\[\]\)\.filter\(person=>!person\.resigned\)/);
  assert.match(managerList,/directReports\(EMPLOYEES\)\.filter\(emp=>!emp\.resigned\)/);
  assert.match(managerList,/emp\.login!==MANAGER\.login&&!emp\.resigned/);
  /* Tag nhân sự phải dùng chung một component ở mọi màn, không chip xám riêng. */
  assert.match(managerList,/<span class="emp-tag emp-tag-resigned">Đã nghỉ việc<\/span>/);
  assert.match(managerList,/<span class="emp-tag emp-tag-maternity">Nghỉ thai sản<\/span>/);
  assert.doesNotMatch(managerList,/emp-status/);

  /* Ẩn danh vẫn phải ẩn: tag chỉ nằm trong nhánh hiển thị danh tính. */
  assert.match(hrDetail,/personTooltip\(reviewer\)\}<\/span><\/span>\$\{resignedTag\(reviewer\)\}/);
  assert.doesNotMatch(hrDetail,/identity-anon">Ẩn danh<\/span>`\}\$\{resignedTag/);
});

test('resigned reviewers drop out of the denominator while collecting',()=>{
  const model=require(modelPath);
  const managerModel=require('../M-04/manager-request-model.js');

  const participant={assignments:[
    {status:'submitted'},
    {status:'pending'},
    {status:'pending',excludedByResignation:true}
  ]};
  assert.deepEqual(model.participantProgress(participant),{done:1,total:2,pending:1});
  /* AI Summary giữ ngưỡng 2 phản hồi, chỉ mẫu số đổi. */
  assert.equal(model.isAiSummaryEligible({assignments:[{status:'submitted'},{status:'pending',excludedByResignation:true}]}),false);
  assert.equal(model.isAiSummaryEligible({assignments:[{status:'submitted'},{status:'submitted'},{status:'pending',excludedByResignation:true}]}),true);

  const overview=model.programDetailOverview({campaign:{status:'collecting',due:'30/08/2026'},participants:[participant]},'20/08/2026');
  assert.equal(overview.totalResponses,2);
  assert.equal(overview.pending,1);

  const request={assignments:[
    {employeeId:'e1',employeeName:'A',status:'done'},
    {employeeId:'e1',employeeName:'A',status:'pending'},
    {employeeId:'e1',employeeName:'A',status:'pending',excludedByResignation:true}
  ],due:'30/08/2026'};
  assert.equal(managerModel.summarize(request,'20/08/2026').total,2);
  assert.equal(managerModel.byEmployee(request,'20/08/2026')[0].total,2);
});

test('detail screens stop counting and reminding resigned reviewers, and warn before sharing',()=>{
  const hrDetail=fs.readFileSync(require.resolve('../H-06/index.html'),'utf8');
  const managerDetail=fs.readFileSync(require.resolve('../M-04/request-detail.html'),'utf8');

  for(const html of [hrDetail,managerDetail]){
    assert.match(html,/function applyResignationRules\(\)/);
    assert.match(html,/excludedByResignation=collecting&&resigned/);
    assert.match(html,/Ngừng thu thập/);
    /* Tooltip phải nói đúng lý do chặn của chính dòng đó, không mặc định đổ cho cooldown 24 giờ. */
    assert.match(html,/function remindBlockReason\(/);
    assert.match(html,/quá 90 ngày kể từ ngày tạo/);
    assert.match(html,/đã đóng, không gửi nhắc được/);
    /* Nút nhắc bị chặn phải nhìn ra được là chặn, không chỉ mất khả năng bấm. */
    assert.match(html,/\.btn-pending-remind:disabled\{opacity:\.45;cursor:not-allowed;background:var\(--z100\)/);
    assert.match(html,/\.btn-pending-remind:hover:not\(:disabled\)/);
  }
  /* Chương trình đã đóng giữ nguyên số liệu lịch sử, chỉ lúc còn thu thập mới loại khỏi mẫu số. */
  assert.match(hrDetail,/const collecting=PROGRAM\.status==='collecting'/);

  /* Người nhận đã nghỉ việc không còn tài khoản xem kết quả nên dialog chia sẻ phải cảnh báo. */
  assert.match(hrDetail,/function resignedShareWarningHTML\(\)/);
  assert.match(hrDetail,/đã nghỉ việc nên không thể xem kết quả/);
  assert.match(hrDetail,/\.share-warning\{/);
});
