/* Shared renderer for the HR feedback report (used by H-07 employee view and M-04 manager panel). */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.FeedbackReportView=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const BADGE_ICON={teamwork:'Teamwork.png',customer:'Customer_.png',excellence:'Excellence.png',innovation:'Innovation.png',learning:'Constant_.png'};
  const BADGE_LABEL={teamwork:'Tinh thần đồng đội',customer:'Khách hàng là trung tâm',excellence:'Thực thi xuất sắc',innovation:'Đổi mới',learning:'Không ngừng học hỏi'};
  function model(){return typeof FeedbackProgramModel!=='undefined'?FeedbackProgramModel:require('./feedback-program-model.js');}
  function data(){return typeof FeedbackProgramData!=='undefined'?FeedbackProgramData:require('./feedback-program-data.js');}
  function escapeHTML(value){return String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function initials(person){return person.initials||String(person.name||'').split(' ').map(item=>item[0]).join('').slice(0,2);}
  function personTooltip(person){return [person.department,person.team,person.position].filter(Boolean).join(' - ');}
  function dateKey(value){const [d,m,y]=String(value||'').split('/');return `${y||''}${(m||'').padStart(2,'0')}${(d||'').padStart(2,'0')}`;}
  // Report entries for one recipient (by domain/id), newest -> oldest.
  function entriesFor(domain){
    const M=model(),D=data();
    return D.seedPrograms().flatMap(raw=>{
      const program=M.normalizeCampaign(raw),sharing=program.resultSharing;
      if(!sharing||sharing.mode==='not_shared')return [];
      const detail=D.detailForProgram(raw);
      const participant=(detail.participants||[]).find(item=>item.employee.id===domain);
      if(!participant||M.participantProgress(participant).done<1)return [];
      const inScope=sharing.mode==='shared_all'||(sharing.participantIds||[]).includes(domain);
      if(!inScope)return [];
      return [{program,sharing,detail,participant}];
    }).sort((a,b)=>dateKey(b.sharing.sharedAt).localeCompare(dateKey(a.sharing.sharedAt)));
  }
  function countFor(domain){return entriesFor(domain).length;}
  function typeLabel(sharing){return (sharing&&sharing.contentLevel==='summary')?'Báo cáo tổng hợp':'Báo cáo tổng hợp kèm chi tiết';}
  function isAnon(entry){return entry.program.identityVisibility==='anonymous';}
  function showsDetail(entry){return entry.sharing.contentLevel!=='summary';}
  function badgePath(base,id){return `${base}Core value with BG/${BADGE_ICON[id]||'Constant_.png'}`;}
  function badgeSummary(participant,base){const tally=model().coreValueTally(participant);return Object.entries(tally).map(([id,count])=>`<span class="employee-badge-item pms-tooltip" tabindex="0"><img src="${badgePath(base,id)}" alt=""/><span>${count}</span><span class="pms-tooltip-content">${BADGE_LABEL[id]||id}</span></span>`).join('');}
  function responseBadges(assignment,base){return (assignment.badges||[]).map(id=>`<span class="pms-tooltip"><img class="cv-icon" src="${badgePath(base,id)}" alt=""/><span class="pms-tooltip-content">${BADGE_LABEL[id]||id}</span></span>`).join('');}
  function reviewerAvatar(reviewer,anon){return anon?`<div class="avatar avatar-anon" aria-hidden="true"><i class="bx bx-user"></i></div>`:`<div class="avatar">${initials(reviewer)}</div>`;}
  function reviewerIdentity(reviewer,anon){return anon?`<span class="identity-text identity-anon">Ẩn danh</span>`:`<span class="pms-tooltip" tabindex="0"><span class="identity-text">${reviewer.name}<span class="domain">(${reviewer.domain})</span></span><span class="pms-tooltip-content">${personTooltip(reviewer)}</span></span>`;}
  function groupAnswers(entry){const questions=entry.detail.questions||[];return questions.map(question=>({question,answers:(entry.participant.assignments||[]).filter(item=>item.status==='submitted').map(assignment=>({assignment,answer:(assignment.answers||[]).find(item=>item.questionId===question.id)})).filter(item=>item.answer&&item.answer.body)}));}
  function answerRecord(item,anon,base){const reviewer=item.assignment.reviewer;return `<article class="question-response">${reviewerAvatar(reviewer,anon)}<div class="question-response-main"><div class="question-response-head"><div><div class="fb-line">${reviewerIdentity(reviewer,anon)}</div><div class="fb-date">${item.assignment.submittedAt}</div></div>${item.assignment.badges&&item.assignment.badges.length?`<div class="cv-icons">${responseBadges(item.assignment,base)}</div>`:''}</div><p class="fb-body">${item.answer.body}</p></div></article>`;}
  function questionPrompt(text){return `<span class="question-inline"><span class="question-inline-label">Câu hỏi:</span> ${escapeHTML(text)}</span>`;}
  function evidenceGroup(group,index,single,anon,base){const count=group.answers.length,question=questionPrompt(group.question.text),head=single?`<div class="shared-question single-question"><p class="question-text">${question}</p></div>`:`<details class="question-disclosure" open><summary>${question}<span class="question-response-count">${count} phản hồi</span></summary></details>`;const body=count?group.answers.map(item=>answerRecord(item,anon,base)).join(''):`<div class="content-note"><i class="bx bx-message-square-dots"></i>Chưa có phản hồi cho câu hỏi này.</div>`;return `<section class="question-evidence-group">${head}<div class="question-answers">${body}</div></section>`;}
  function aiSummaryBlock(participant){const M=model();if(!(M.isAiSummaryEligible(participant)&&participant.aiSummary))return '';const list=items=>`<ul class="dialog-ai-summary-list">${items.map(item=>`<li>${item}</li>`).join('')}</ul>`;return `<section class="dialog-ai-summary"><div class="dialog-ai-summary-head"><div class="dialog-ai-summary-brand"><i class="bx bx-sparkles"></i><span>AI Summary</span></div><span class="dialog-ai-summary-updated">Tổng hợp từ ${M.participantProgress(participant).done} phản hồi</span></div><div class="dialog-ai-summary-content"><section><div class="dialog-ai-summary-label">Điểm mạnh</div>${list(participant.aiSummary.strengths)}</section><section><div class="dialog-ai-summary-label">Cơ hội phát triển</div>${list(participant.aiSummary.opportunities)}</section></div></section>`;}
  // Full report body for one entry. opts.base = asset prefix ('../'), opts.showRecipient = prepend recipient line (manager panel).
  function detailHTML(entry,opts){
    const options=opts||{},base=options.base||'../',anon=isAnon(entry);
    const recipient=options.showRecipient?`<div class="report-recipient"><div class="avatar">${initials(entry.participant.employee)}</div><div><div class="report-recipient-name">${entry.participant.employee.name}<span class="domain">(${entry.participant.employee.domain})</span></div><div class="report-recipient-meta">${personTooltip(entry.participant.employee)}</div></div></div>`:'';
    const goal=`<div class="report-goal">${escapeHTML(entry.program.goal)}</div>`;
    const meta=`<div class="report-meta"><span><i class="bx bx-calendar-check"></i>Chia sẻ ${entry.sharing.sharedAt||''}</span><span class="report-type">${typeLabel(entry.sharing)}</span><span class="report-anon">${anon?'Ẩn danh người cho':'Ghi danh người cho'}</span></div>`;
    const badges=badgeSummary(entry.participant,base);
    const badgeRow=badges?`<div class="employee-badge-summary">${badges}</div>`:'';
    const note=entry.sharing.note?`<div class="hr-note"><div class="hr-note-label"><i class="bx bx-message-rounded-detail"></i>Lời nhắn từ HR</div><div class="hr-note-body">${escapeHTML(entry.sharing.note)}</div></div>`:'';
    const ai=aiSummaryBlock(entry.participant);
    let body='';
    if(showsDetail(entry)){const groups=groupAnswers(entry),single=(entry.detail.questions||[]).length===1;body=`<div class="label">Phản hồi chi tiết</div>${groups.map((group,index)=>evidenceGroup(group,index,single,anon,base)).join('')}`;}
    else body=`<div class="content-note"><i class="bx bx-lock-alt"></i>HR chỉ chia sẻ phần tổng hợp (AI Summary). Nội dung phản hồi chi tiết không được hiển thị.</div>`;
    return `${recipient}${goal}${meta}${badgeRow}${note}${ai}${body}`;
  }
  return {entriesFor,countFor,typeLabel,badgeSummary,detailHTML,BADGE_ICON,BADGE_LABEL};
});
