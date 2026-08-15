(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.FeedbackProgramModel=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function dateFromDMY(value){
    const [d,m,y]=String(value||'').split('/').map(Number);
    return d&&m&&y?new Date(Date.UTC(y,m-1,d)):null;
  }
  function daysBetween(later,earlier){
    const a=dateFromDMY(later),b=dateFromDMY(earlier);
    return a&&b?Math.round((a-b)/86400000):null;
  }
  function normalizeQuestion(question,index=0){
    const source=question||{};
    return {
      id:String(source.id||`q${index+1}`),
      type:source.type==='rating'?'rating':'open_text',
      text:String(source.text||'').trim()
    };
  }
  function normalizeCampaign(campaign){
    const source=campaign||{};
    const participants=Array.isArray(source.participants)?source.participants:[];
    const reviewers=Array.isArray(source.reviewers)?source.reviewers:[];
    return {
      ...source,
      id:String(source.id||''),
      goal:String(source.goal||'').trim(),
      status:source.status||'draft',
      createdAt:source.createdAt||'',
      due:source.due||'',
      participants:[...participants],
      reviewers:[...reviewers],
      participantCount:Number(source.participantCount ?? (Array.isArray(source.participants)?source.participants.length:(source.participants||0))),
      reviewerCount:Number(source.reviewerCount ?? (Array.isArray(source.reviewers)?source.reviewers.length:(source.reviewers||0))),
      questions:(source.questions||[]).map(normalizeQuestion),
      includeSelf:Boolean(source.includeSelf),
      anon:source.anon==='anon'?'anon':'named',
      autoRemind:source.autoRemind!==false,
      templateId:source.templateId||'',
      report:source.report||'none'
    };
  }
  function participantPool(people,context){
    const source=[...(people||[])],ctx=context||{};
    if(ctx.role==='hrbp')return source.filter(person=>person.division===ctx.division||person.div===ctx.division);
    if(ctx.role==='lod')return source.filter(person=>(person.division||person.div)!==(ctx.hrDivision||'Nhân sự'));
    return [];
  }
  function reviewerPool(people){return [...(people||[])];}
  function uniqueById(people){
    const seen=new Set();
    return (people||[]).filter(person=>person&&person.id&&!seen.has(person.id)&&seen.add(person.id));
  }
  function buildAssignments(participants,reviewers,options){
    const ps=uniqueById(participants),rs=uniqueById(reviewers),includeSelf=Boolean(options&&options.includeSelf),out=[];
    ps.forEach(participant=>{
      rs.forEach(reviewer=>{
        if(reviewer.id===participant.id)return;
        out.push({id:`${participant.id}:${reviewer.id}`,participantId:participant.id,reviewerId:reviewer.id,selfAssessment:false,status:'pending'});
      });
      if(includeSelf)out.push({id:`${participant.id}:${participant.id}:self`,participantId:participant.id,reviewerId:participant.id,selfAssessment:true,status:'pending'});
    });
    return out;
  }
  function validateLaunch(campaign,createdAt){
    const item=normalizeCampaign(campaign),errors=[];
    if(!item.goal)errors.push({field:'goal',code:'required'});
    if(!item.due)errors.push({field:'due',code:'required'});
    else if(daysBetween(item.due,createdAt)<=0)errors.push({field:'due',code:'due_not_future'});
    if(!item.participants.length)errors.push({field:'participants',code:'required'});
    if(!item.reviewers.length)errors.push({field:'reviewers',code:'required'});
    if(!item.questions.some(question=>question.type==='open_text'&&question.text))errors.push({field:'questions',code:'required'});
    return {valid:errors.length===0,errors,campaign:item};
  }
  function isOverdue(campaign,today){return campaign&&campaign.status==='collecting'&&daysBetween(today,campaign.due)>0;}
  function isDueSoon(campaign,today){
    const left=campaign&&campaign.status==='collecting'?daysBetween(campaign.due,today):null;
    return left!==null&&left>=0&&left<=3;
  }
  function needsReport(campaign){return Boolean(campaign&&campaign.status==='closed'&&campaign.report==='none');}
  function campaignViewState(campaign,today){
    if(!campaign)return 'draft';
    if(campaign.status==='closed')return 'closed';
    if(campaign.status==='draft')return 'draft';
    return isOverdue(campaign,today)?'overdue':'collecting';
  }
  function matchesFilter(campaign,filter,today){
    if(!filter||filter==='all')return true;
    if(filter==='due_soon')return isDueSoon(campaign,today);
    if(filter==='overdue')return isOverdue(campaign,today);
    if(filter==='need_report')return needsReport(campaign);
    return campaign&&campaign.status===filter;
  }
  function sortCampaigns(campaigns,today){
    const priority={overdue:0,collecting:1,draft:2,closed:3};
    return [...(campaigns||[])].sort((a,b)=>{
      const pa=priority[campaignViewState(a,today)],pb=priority[campaignViewState(b,today)];
      if(pa!==pb)return pa-pb;
      return (dateFromDMY(b.createdAt)||0)-(dateFromDMY(a.createdAt)||0);
    });
  }
  function dateTimeFromDMY(value){
    const match=String(value||'').match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
    return match?new Date(Date.UTC(+match[3],+match[2]-1,+match[1],+(match[4]||0),+(match[5]||0))):null;
  }
  function participantProgress(participant){
    const assignments=Array.isArray(participant&&participant.assignments)?participant.assignments:[];
    const done=assignments.filter(item=>item.status==='submitted').length;
    return {done,total:assignments.length,pending:assignments.length-done};
  }
  function participantViewState(campaign,participant,today){
    const progress=participantProgress(participant);
    if(progress.total>0&&progress.done===progress.total)return 'complete';
    if(isOverdue(campaign,today))return 'overdue';
    if(isDueSoon(campaign,today))return 'due_soon';
    return 'collecting';
  }
  function compareParticipantsForAction(campaign,a,b,today){
    const priority={overdue:0,due_soon:1,collecting:2,complete:3};
    const stateDiff=priority[participantViewState(campaign,a,today)]-priority[participantViewState(campaign,b,today)];
    if(stateDiff)return stateDiff;
    const ap=participantProgress(a),bp=participantProgress(b);
    const ratioDiff=(ap.done/Math.max(ap.total,1))-(bp.done/Math.max(bp.total,1));
    if(ratioDiff)return ratioDiff;
    return String(a&&a.employee&&a.employee.name||'').localeCompare(String(b&&b.employee&&b.employee.name||''),'vi');
  }
  function sortParticipantsForAction(campaign,participants,today){return [...(participants||[])].sort((a,b)=>compareParticipantsForAction(campaign,a,b,today));}
  function coreValueTally(participant){
    return (participant&&participant.assignments||[])
      .filter(item=>item.status==='submitted')
      .flatMap(item=>item.badges||[])
      .reduce((result,badge)=>({...result,[badge]:(result[badge]||0)+1}),{});
  }
  function isAiSummaryEligible(participant){return participantProgress(participant).done>=2;}
  function programDetailOverview(detail,today){
    const participants=detail&&detail.participants||[];
    const assignments=participants.flatMap(item=>item.assignments||[]);
    return {
      participants:participants.length,
      reviewers:new Set(assignments.map(item=>item.reviewer&&item.reviewer.id).filter(Boolean)).size,
      pending:assignments.filter(item=>item.status!=='submitted').length,
      overdue:participants.filter(item=>participantViewState(detail.campaign,item,today)==='overdue').length
    };
  }
  function canRemindProgramAssignment(campaign,assignment,now){
    if(!campaign||campaign.status!=='collecting'||!assignment||assignment.status==='submitted')return false;
    if(daysBetween(String(now||'').slice(0,10),campaign.due)>0)return false;
    const history=assignment.manualReminderHistory||[];
    const last=dateTimeFromDMY(history.at(-1)),current=dateTimeFromDMY(now);
    return Boolean(current)&&(!last||current-last>=24*60*60*1000);
  }
  function remindEligibleProgramAssignments(campaign,participants,now){
    let sent=0;
    (participants||[]).flatMap(item=>item.assignments||[]).forEach(assignment=>{
      if(!canRemindProgramAssignment(campaign,assignment,now))return;
      assignment.manualReminderHistory=[...(assignment.manualReminderHistory||[]),now];
      sent++;
    });
    return sent;
  }
  return {dateFromDMY,daysBetween,normalizeQuestion,normalizeCampaign,participantPool,reviewerPool,buildAssignments,validateLaunch,isOverdue,isDueSoon,needsReport,campaignViewState,matchesFilter,sortCampaigns,dateTimeFromDMY,participantProgress,participantViewState,compareParticipantsForAction,sortParticipantsForAction,coreValueTally,isAiSummaryEligible,programDetailOverview,canRemindProgramAssignment,remindEligibleProgramAssignments};
});
