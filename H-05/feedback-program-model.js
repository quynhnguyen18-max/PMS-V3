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
    const base={
      id:String(source.id||`q${index+1}`),
      type:source.type==='rating'?'rating':'open_text',
      text:String(source.text||'').trim()
    };
    if(base.type!=='rating')return base;
    const score=Number(source.ratingScale);
    const ratingScale=Number.isInteger(score)&&score>=2&&score<=10?score:null;
    const ratingLabels=Object.fromEntries(Object.entries(source.ratingLabels||{}).map(([score,label])=>[String(score),String(label||'').trim()]));
    return {...base,ratingScale,ratingLabels,detailedRatingLabels:Boolean(source.detailedRatingLabels)};
  }
  function normalizeReviewerMappings(mappings){
    const seen=new Set();
    return (Array.isArray(mappings)?mappings:[]).flatMap(mapping=>{
      const participantId=String(mapping&&mapping.participantId||'').trim();
      if(!participantId||seen.has(participantId))return [];
      seen.add(participantId);
      const reviewerIds=[...new Set((Array.isArray(mapping&&mapping.reviewerIds)?mapping.reviewerIds:[]).map(item=>String(item||'').trim()).filter(Boolean))];
      return [{participantId,reviewerIds}];
    });
  }
  function uniqueIds(values){
    return [...new Set((Array.isArray(values)?values:[]).map(value=>String(value||'').trim()).filter(Boolean))];
  }
  function normalizeAssignmentMode(source){
    const value=source&&source.reviewerAssignmentMode;
    if(value==='shared'||value==='per_recipient')return value;
    return Array.isArray(source&&source.reviewerMappings)&&source.reviewerMappings.length?'per_recipient':'shared';
  }
  function expandReviewerMappings(participants,mode,sharedReviewerIds,mappings){
    if(mode!=='shared')return normalizeReviewerMappings(mappings);
    const reviewerIds=uniqueIds(sharedReviewerIds);
    return uniqueById(participants).map(participant=>({
      participantId:participant.id,
      reviewerIds:reviewerIds.filter(reviewerId=>reviewerId!==participant.id)
    }));
  }
  function normalizeResultSharing(value){
    const source=value||{};
    const mode=['shared_all','shared_selected'].includes(source.mode)?source.mode:'not_shared';
    const participantIds=[...new Set((Array.isArray(source.participantIds)?source.participantIds:[]).map(item=>String(item||'').trim()).filter(Boolean))];
    const audience=['recipient_and_managers','managers_only','specific_people'].includes(source.audience)?source.audience:'';
    const additionalViewerNames=[...new Set((Array.isArray(source.additionalViewerNames)?source.additionalViewerNames:[]).map(item=>String(item||'').trim()).filter(Boolean))];
    const contentLevel=['summary','summary_detail'].includes(source.contentLevel)?source.contentLevel:'summary_detail';
    return {
      mode:mode==='shared_selected'&&participantIds.length?'shared_selected':mode==='shared_all'?'shared_all':'not_shared',
      participantIds:mode==='shared_selected'?participantIds:[],
      audience:mode==='not_shared'?'':audience||'recipient_and_managers',
      additionalViewerNames:mode==='not_shared'?[]:additionalViewerNames,
      contentLevel:mode==='not_shared'?'':contentLevel,
      note:mode==='not_shared'?'':String(source.note||'').trim(),
      sharedAt:mode==='not_shared'?'':String(source.sharedAt||'').trim(),
      sharedBy:mode==='not_shared'?'hr':String(source.sharedBy||'hr').trim()||'hr'
    };
  }
  function canShareResults(campaign){return Boolean(campaign)&&campaign.status==='closed';}
  function normalizeCampaign(campaign){
    const source=campaign||{};
    const participants=Array.isArray(source.participants)?source.participants:[];
    const reviewerAssignmentMode=normalizeAssignmentMode(source);
    const reviewerMappings=normalizeReviewerMappings(source.reviewerMappings);
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
      reviewerMappings,
      reviewerAssignmentMode,
      sharedReviewerIds:uniqueIds(source.sharedReviewerIds),
      participantCount:Number(source.participantCount ?? (Array.isArray(source.participants)?source.participants.length:(source.participants||0))),
      reviewerCount:Number(source.reviewerCount ?? (Array.isArray(source.reviewers)?source.reviewers.length:(source.reviewers||0))),
      questions:(source.questions||[]).map(normalizeQuestion),
      includeSelf:Boolean(source.includeSelf),
      identityVisibility:Object.prototype.hasOwnProperty.call(source,'identityVisibility')?(source.identityVisibility==='anonymous'?'anonymous':source.identityVisibility==='named'?'named':''):(source.anon==='anon'?'anonymous':'named'),
      anon:source.identityVisibility==='anonymous'||source.anon==='anon'?'anon':'named',
      autoRemind:source.autoRemind!==false,
      templateId:source.templateId||'',
      invitationMessage:String(source.invitationMessage||'').trim(),
      resultSharing:normalizeResultSharing(source.resultSharing),
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
  function buildAssignments(participants,reviewersOrMappings,options){
    const ps=uniqueById(participants),includeSelf=Boolean(options&&options.includeSelf),out=[];
    const mappings=normalizeReviewerMappings(reviewersOrMappings);
    if(mappings.length){
      const validParticipants=new Set(ps.map(person=>person.id));
      mappings.forEach(mapping=>{
        if(!validParticipants.has(mapping.participantId))return;
        mapping.reviewerIds.forEach(reviewerId=>{
          if(reviewerId===mapping.participantId)return;
          out.push({id:`${mapping.participantId}:${reviewerId}`,participantId:mapping.participantId,reviewerId,selfAssessment:false,status:'pending'});
        });
      });
      if(includeSelf)ps.forEach(participant=>out.push({id:`${participant.id}:${participant.id}:self`,participantId:participant.id,reviewerId:participant.id,selfAssessment:true,status:'pending'}));
      return out;
    }
    const rs=uniqueById(reviewersOrMappings);
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
    const hasMappings=item.reviewerMappings.length>0||Array.isArray(campaign&&campaign.reviewerMappings);
    if(hasMappings){
      const mapped=new Map(item.reviewerMappings.map(mapping=>[mapping.participantId,mapping.reviewerIds]));
      if(item.participants.some(participant=>!(mapped.get(participant.id)||[]).some(reviewerId=>reviewerId!==participant.id)))errors.push({field:'reviewerMappings',code:'required'});
    }else if(!item.reviewers.length)errors.push({field:'reviewers',code:'required'});
    const ratingLabelsComplete=question=>question.detailedRatingLabels?Array.from({length:question.ratingScale||0},(_,index)=>question.ratingLabels[String(index+1)]).every(Boolean):Boolean(question.ratingLabels&&question.ratingLabels['1']&&question.ratingLabels[String(question.ratingScale)]);
    const validQuestion=item.questions.some(question=>question.type==='open_text'&&question.text)||item.questions.some(question=>question.type==='rating'&&question.text&&question.ratingScale&&ratingLabelsComplete(question));
    const invalidRating=item.questions.some(question=>question.type==='rating'&&question.text&&(!question.ratingScale||!ratingLabelsComplete(question)));
    if(!validQuestion||invalidRating)errors.push({field:'questions',code:'required'});
    if(!item.identityVisibility)errors.push({field:'identityVisibility',code:'required'});
    return {valid:errors.length===0,errors,campaign:item};
  }
  function isResultShared(campaign,participantId){
    const sharing=normalizeResultSharing(campaign&&campaign.resultSharing);
    return sharing.mode==='shared_all'||(sharing.mode==='shared_selected'&&sharing.participantIds.includes(String(participantId||'')));
  }
  function shareResults(campaign,participantIds,sharedAt,options){
    const item=normalizeCampaign(campaign),ids=[...new Set((Array.isArray(participantIds)?participantIds:[]).map(value=>String(value||'').trim()).filter(Boolean))];
    const source=options||{};
    return {...item,resultSharing:normalizeResultSharing({mode:ids.length?'shared_selected':'shared_all',participantIds:ids,audience:source.audience||'recipient_and_managers',additionalViewerNames:source.additionalViewerNames||[],contentLevel:source.contentLevel||'summary_detail',note:source.note||'',sharedAt:String(sharedAt||'').trim(),sharedBy:'hr'})};
  }
  function lockPendingAssignments(assignments){
    return (Array.isArray(assignments)?assignments:[]).map(assignment=>assignment&&assignment.status==='pending'?{...assignment,status:'locked'}:assignment);
  }
  function closeCampaign(campaign,closedAt){
    const item=normalizeCampaign(campaign);
    return {...item,status:'closed',closedAt:String(closedAt||'').trim(),assignments:lockPendingAssignments(item.assignments)};
  }
  function isOverdue(campaign,today){return campaign&&campaign.status==='collecting'&&daysBetween(today,campaign.due)>0;}
  function isDueSoon(campaign,today){
    const left=campaign&&campaign.status==='collecting'?daysBetween(campaign.due,today):null;
    return left!==null&&left>=0&&left<=3;
  }
  function needsReport(campaign){return Boolean(campaign&&campaign.status==='closed'&&campaign.report==='none');}
  function campaignStatus(campaign,today){
    const item=campaign||{},complete=Number(item.total)>0&&Number(item.done)>=Number(item.total);
    if(item.status==='closed')return {state:'closed',label:'Đã đóng',icon:'bx-lock-alt'};
    if(item.status==='draft')return {state:'draft',label:'Nháp',icon:'bx-circle'};
    if(complete)return {state:'complete',label:'Hoàn thành',icon:'bx-check-circle'};
    if(isOverdue(item,today))return {state:'overdue',label:'Quá hạn',icon:'bx-error-circle'};
    if(isDueSoon(item,today))return {state:'due_soon',label:'Sắp đến hạn',icon:'bx-time-five'};
    return {state:'collecting',label:'Đang thu thập',icon:'bx-loader-circle'};
  }
  function campaignViewState(campaign,today){
    return campaignStatus(campaign,today).state;
  }
  function matchesFilter(campaign,filter,today){
    if(!filter||filter==='all')return true;
    if(filter==='need_report')return needsReport(campaign);
    return campaignViewState(campaign,today)===filter;
  }
  function sortCampaigns(campaigns,today){
    const priority={overdue:0,due_soon:1,collecting:2,complete:3,draft:4,closed:5};
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
  return {dateFromDMY,daysBetween,normalizeQuestion,normalizeReviewerMappings,normalizeAssignmentMode,expandReviewerMappings,normalizeResultSharing,normalizeCampaign,participantPool,reviewerPool,buildAssignments,validateLaunch,isResultShared,shareResults,canShareResults,lockPendingAssignments,closeCampaign,isOverdue,isDueSoon,needsReport,campaignStatus,campaignViewState,matchesFilter,sortCampaigns,dateTimeFromDMY,participantProgress,participantViewState,compareParticipantsForAction,sortParticipantsForAction,coreValueTally,isAiSummaryEligible,programDetailOverview,canRemindProgramAssignment,remindEligibleProgramAssignments};
});
