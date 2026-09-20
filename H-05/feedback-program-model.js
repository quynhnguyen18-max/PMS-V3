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
      text:String(source.text||'').trim(),
      required:Boolean(source.required)
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
  const AUDIENCE_KEYS=['recipients','managers','others'];
  function uniqueStrings(list){return [...new Set((Array.isArray(list)?list:[]).map(item=>String(item||'').trim()).filter(Boolean))];}
  /* audience gio la multi-select; van nhan du lieu cu dang chuoi audience don de khong vo ban ghi da luu. */
  /* ── Chia sẻ kết quả: ai nhận, và nhận bằng cách nào ──────────────────────
     HR chọn người nhận THEO CẤP - quản lý trực tiếp / cấp 2 / trưởng đơn vị -
     chứ không phải một khối "các cấp quản lý" chung chung, vì mỗi cấp là một
     con người cụ thể có domain. Ba cấp có thể trỏ về cùng một người; đó là
     thông tin thật của tổ chức nên vẫn giữ đủ ba lựa chọn.

     AI CŨNG nhận email thông báo - đó là mặc định nên không cần nói ra. Thứ phải
     nói rõ là ai KHÔNG mở được kết quả trên hệ thống:
       trong chuỗi quản lý của nhân viên → mở kết quả trên hệ thống như bình thường
       ngoài chuỗi                       → chỉ đọc được file kết quả đính kèm email
     Một người có thể vừa mở được trên hệ thống kết quả của nhân viên họ quản lý, vừa
     chỉ đọc qua file email kết quả của người họ không quản lý, trong cùng một lượt
     chia sẻ - nên ghi chú bám theo TỪNG NHÂN VIÊN, không dán cho cả con người đó. */
  const MANAGER_LEVELS=['lm','upper','hod'];
  const RECIPIENT_ROLES=['recipient','lm','upper','hod','other'];
  const RECIPIENT_ROLE_LABEL={recipient:'Người nhận phản hồi',lm:'Quản lý trực tiếp',
    upper:'Quản lý cấp 2',hod:'Trưởng đơn vị',other:'Người khác'};
  /* Chỉ ca ngoại lệ mới có ghi chú; xem được trên hệ thống là mặc định nên để rỗng. */
  const CHANNEL_NOTE={system:'',emailOnly:'Ngoài phạm vi quản lý - nhận file kết quả qua email, không xem trên hệ thống'};
  function orgChain(chain){
    if(chain)return chain;
    return (typeof globalThis!=='undefined'&&globalThis.OrgChain)?globalThis.OrgChain:null;
  }
  /* Ghi lại HR đã chọn gì. Dữ liệu cũ chỉ có audiences dạng khối nên quy đổi:
     "managers" = cả ba cấp, "others" = danh sách tên rời chưa có domain. */
  function normalizeShareTargets(source){
    const src=source||{};
    const legacy=normalizeAudiences(src);
    const levels=Array.isArray(src.managerLevels)?src.managerLevels
      :(legacy.includes('managers')?MANAGER_LEVELS:[]);
    const toRecipient=src.toRecipient===undefined?legacy.includes('recipients'):!!src.toRecipient;
    const rawExtra=Array.isArray(src.extraViewers)?src.extraViewers
      :uniqueStrings(src.additionalViewerNames).map(name=>({name,domain:''}));
    const extraViewers=rawExtra
      .map(item=>({domain:String((item&&item.domain)||'').trim(),name:String((item&&item.name)||'').trim()}))
      .filter(item=>item.domain||item.name);
    return {toRecipient,managerLevels:MANAGER_LEVELS.filter(level=>levels.includes(level)),extraViewers};
  }
  /* Người này xem được kết quả của nhân viên kia trên hệ thống, hay chỉ nhận email. */
  function shareChannelFor(viewerDomain,participantId,chain){
    const org=orgChain(chain);
    if(String(viewerDomain||'').trim()===String(participantId||'').trim())return 'system';
    return org&&org.isInChain(viewerDomain,participantId)?'system':'emailOnly';
  }
  /* Danh sách người nhận thật sự của một lượt chia sẻ, gộp theo từng con người:
     mỗi người biết mình giữ vai nào, xem được kết quả của ai, và nhận email của ai. */
  function resolveShareRecipients(participantIds,targets,chain){
    const org=orgChain(chain),ids=uniqueStrings(participantIds),picked=normalizeShareTargets(targets);
    const byPerson=new Map();
    const add=(domain,name,role,participantId,channel)=>{
      const key=String(domain||'').trim()||`ten:${name}`;
      if(!key||key==='ten:')return;
      const entry=byPerson.get(key)||{domain:String(domain||'').trim(),name:'',roles:[],system:[],emailOnly:[]};
      if(!entry.name&&name)entry.name=name;
      if(!entry.domain&&domain)entry.domain=String(domain).trim();
      if(role&&!entry.roles.includes(role))entry.roles.push(role);
      const bucket=channel==='system'?entry.system:entry.emailOnly;
      if(participantId&&!bucket.includes(participantId))bucket.push(participantId);
      byPerson.set(key,entry);
    };
    const nameOf=domain=>{const found=org&&org.person(domain);return found?found.name:domain;};
    ids.forEach(participantId=>{
      if(picked.toRecipient)add(participantId,nameOf(participantId),'recipient',participantId,'system');
      picked.managerLevels.forEach(level=>{
        const found=org?org.chainFor(participantId).find(entry=>entry.role===level):null;
        if(found)add(found.domain,found.name,level,participantId,'system');
      });
      picked.extraViewers.forEach(viewer=>{
        const channel=viewer.domain?shareChannelFor(viewer.domain,participantId,org):'email';
        add(viewer.domain,viewer.name||nameOf(viewer.domain),'other',participantId,channel);
      });
    });
    return [...byPerson.values()].map(entry=>({
      ...entry,
      roles:RECIPIENT_ROLES.filter(role=>entry.roles.includes(role)),
      channel:entry.emailOnly.length?(entry.system.length?'mixed':'emailOnly'):'system'
    })).sort((a,b)=>RECIPIENT_ROLES.indexOf(a.roles[0])-RECIPIENT_ROLES.indexOf(b.roles[0])
      ||String(a.name).localeCompare(String(b.name),'vi'));
  }
  function recipientRoleLabel(role){return RECIPIENT_ROLE_LABEL[role]||'';}
  /* 'mixed' cũng có ghi chú, vì trong lượt đó vẫn có nhân viên người này không mở được. */
  function channelNote(channel){return channel==='system'?'':CHANNEL_NOTE.emailOnly;}
  function isEmailOnly(entry){return !!(entry&&entry.emailOnly&&entry.emailOnly.length);}

  function normalizeAudiences(source){
    const set=new Set(uniqueStrings(source&&source.audiences).filter(item=>AUDIENCE_KEYS.includes(item)));
    const legacy=source&&source.audience;
    if(!set.size&&legacy){
      if(legacy==='recipient_and_managers'){set.add('recipients');set.add('managers');}
      else if(legacy==='managers_only'){set.add('managers');}
      else if(legacy==='specific_people'){set.add('others');}
    }
    return AUDIENCE_KEYS.filter(key=>set.has(key));
  }
  /* Một dòng lịch sử phải tự trả lời được: ai chia sẻ, chia sẻ kết quả của ai,
     cho ai, và người đó xem trên hệ thống hay chỉ nhận qua email. */
  function normalizeSharePerson(value){
    const source=value||{};
    return {domain:String(source.domain||'').trim(),name:String(source.name||'').trim()};
  }
  function normalizeLogRecipient(value){
    const source=value||{};
    const system=uniqueStrings(source.system),emailOnly=uniqueStrings(source.emailOnly||source.email);
    return {...normalizeSharePerson(source),
      roles:RECIPIENT_ROLES.filter(role=>(Array.isArray(source.roles)?source.roles:[]).includes(role)),
      system,emailOnly,
      channel:emailOnly.length?(system.length?'mixed':'emailOnly'):'system'};
  }
  function normalizeShareLogEntry(entry){
    const source=entry||{};
    return {
      at:String(source.at||'').trim(),
      by:normalizeSharePerson(source.by),
      audiences:normalizeAudiences(source),
      targets:normalizeShareTargets(source),
      additionalViewerNames:uniqueStrings(source.additionalViewerNames),
      contentLevel:['summary','summary_detail'].includes(source.contentLevel)?source.contentLevel:'summary_detail',
      participantIds:uniqueStrings(source.participantIds),
      recipients:(Array.isArray(source.recipients)?source.recipients:[]).map(normalizeLogRecipient),
      note:String(source.note||'').trim()
    };
  }
  function normalizeResultSharing(value){
    const source=value||{};
    const mode=['shared_all','shared_selected'].includes(source.mode)?source.mode:'not_shared';
    const participantIds=uniqueStrings(source.participantIds);
    const audiences=normalizeAudiences(source);
    const additionalViewerNames=uniqueStrings(source.additionalViewerNames);
    const contentLevel=['summary','summary_detail'].includes(source.contentLevel)?source.contentLevel:'summary_detail';
    const log=(Array.isArray(source.log)?source.log:[]).map(normalizeShareLogEntry).filter(entry=>entry.at||entry.audiences.length||entry.additionalViewerNames.length);
    const resolvedMode=mode==='shared_selected'&&participantIds.length?'shared_selected':mode==='shared_all'?'shared_all':'not_shared';
    /* Dữ liệu mới để trong source.targets, dữ liệu cũ nằm phẳng ngay trên resultSharing. */
    const targets=normalizeShareTargets(source.targets||source);
    /* Hai cách mô tả cùng một việc phải luôn khớp nhau: khối audiences kiểu cũ được
       suy lại từ targets, để những màn chưa chuyển sang chọn theo cấp vẫn đọc đúng. */
    const derived=[targets.toRecipient&&'recipients',targets.managerLevels.length&&'managers',
      targets.extraViewers.length&&'others'].filter(Boolean);
    const audiencesNow=AUDIENCE_KEYS.filter(key=>audiences.includes(key)||derived.includes(key));
    return {
      mode:resolvedMode,
      participantIds:resolvedMode==='shared_selected'?participantIds:[],
      audiences:resolvedMode==='not_shared'?[]:audiencesNow,
      targets:resolvedMode==='not_shared'
        ?{toRecipient:false,managerLevels:[],extraViewers:[]}:targets,
      additionalViewerNames:resolvedMode==='not_shared'?[]:additionalViewerNames,
      contentLevel:resolvedMode==='not_shared'?'':contentLevel,
      note:resolvedMode==='not_shared'?'':String(source.note||'').trim(),
      sharedAt:resolvedMode==='not_shared'?'':String(source.sharedAt||'').trim(),
      sharedBy:resolvedMode==='not_shared'?'hr':String(source.sharedBy||'hr').trim()||'hr',
      shareCount:resolvedMode==='not_shared'?0:(log.length||1),
      log:resolvedMode==='not_shared'?[]:log
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
      requestSource:source.requestSource==='manager'?'manager':'hr',
      requestedBy:source.requestedBy&&typeof source.requestedBy==='object'?{...source.requestedBy}:null,
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
  function resultAudience(campaign,participantId){
    const item=normalizeCampaign(campaign),released=isResultShared(item,participantId);
    return {released,audiences:released?item.resultSharing.audiences:[],identityVisibility:item.identityVisibility};
  }
  /* viewer có thể là nhóm cũ ('hr' | 'recipients' | 'managers' | 'others') hoặc
     DOMAIN của một người. Với domain, quyền xem bám theo chuỗi quản lý: ngoài
     chuỗi thì dù có trong danh sách chia sẻ cũng chỉ nhận email, không mở màn. */
  function canViewProgramResult(campaign,participantId,viewer,chain){
    if(viewer==='hr')return true;
    const audience=resultAudience(campaign,participantId);
    if(!audience.released)return false;
    if(AUDIENCE_KEYS.includes(viewer))return audience.audiences.includes(viewer);
    const item=normalizeCampaign(campaign);
    const found=resolveShareRecipients([participantId],item.resultSharing.targets,chain)
      .find(entry=>entry.domain===String(viewer||'').trim());
    return !!found&&found.system.includes(String(participantId||'').trim());
  }
  /* Cho phep chia se nhieu lan: cong don nguoi xem + pham vi, va ghi mot dong log cho moi lan chia se. */
  /* Chia sẻ nhiều lần thì người xem CỘNG DỒN, không thay thế lần trước. */
  function mergeShareTargets(existing,incoming){
    const before=normalizeShareTargets(existing),after=normalizeShareTargets(incoming);
    const extra=new Map();
    [...before.extraViewers,...after.extraViewers].forEach(viewer=>
      extra.set(viewer.domain||`ten:${viewer.name}`,viewer));
    return {
      toRecipient:before.toRecipient||after.toRecipient,
      managerLevels:MANAGER_LEVELS.filter(level=>before.managerLevels.includes(level)||after.managerLevels.includes(level)),
      extraViewers:[...extra.values()]
    };
  }
  function shareResults(campaign,participantIds,sharedAt,options){
    const item=normalizeCampaign(campaign);
    const existing=normalizeResultSharing(item.resultSharing);
    const source=options||{};
    const incomingIds=[...new Set((Array.isArray(participantIds)?participantIds:[]).map(value=>String(value||'').trim()).filter(Boolean))];
    const shareAll=!incomingIds.length;
    const mode=shareAll||existing.mode==='shared_all'?'shared_all':'shared_selected';
    const incomingAudiences=normalizeAudiences({audiences:source.audiences,audience:source.audience});
    const mergedAudiences=AUDIENCE_KEYS.filter(key=>existing.audiences.includes(key)||incomingAudiences.includes(key));
    const incomingNames=uniqueStrings(source.additionalViewerNames);
    const mergedNames=[...new Set([...existing.additionalViewerNames,...incomingNames])];
    const mergedIds=[...new Set([...existing.participantIds,...incomingIds])];
    const contentLevel=['summary','summary_detail'].includes(source.contentLevel)?source.contentLevel:'summary_detail';
    const stamp=String(sharedAt||'').trim();
    /* Chụp lại người nhận ngay lúc chia sẻ: tổ chức đổi về sau thì lịch sử vẫn
       phải kể đúng ai đã nhận cái gì, bằng kênh nào. */
    const targetsNow=normalizeShareTargets(source.targets||source);
    const idsForRecipients=shareAll?(mergedIds.length?mergedIds:incomingIds):incomingIds;
    const entry={at:stamp,by:normalizeSharePerson(source.by),audiences:incomingAudiences,
      targets:targetsNow,additionalViewerNames:incomingNames,contentLevel,
      participantIds:shareAll?[]:incomingIds,
      recipients:resolveShareRecipients(idsForRecipients,targetsNow,source.chain),
      note:String(source.note||'').trim()};
    const log=[...existing.log,entry];
    return {...item,resultSharing:normalizeResultSharing({mode,participantIds:mergedIds,audiences:mergedAudiences,targets:mergeShareTargets(existing.targets,targetsNow),additionalViewerNames:mergedNames,contentLevel,note:String(source.note||'').trim(),sharedAt:stamp,sharedBy:'hr',log})};
  }
  function lockPendingAssignments(assignments){
    return (Array.isArray(assignments)?assignments:[]).map(assignment=>assignment&&assignment.status==='pending'?{...assignment,status:'locked'}:assignment);
  }
  function closeCampaign(campaign,closedAt){
    const item=normalizeCampaign(campaign);
    return {...item,status:'closed',closedAt:String(closedAt||'').trim(),assignments:lockPendingAssignments(item.assignments)};
  }
  /* Yeu cau da dong van mo lai duoc, MIEN LA chua chia se ket qua. Sau khi chia se thi chot vinh vien. */
  function canReopenCampaign(campaign){
    const item=campaign||{};
    return item.status==='closed'&&normalizeResultSharing(item.resultSharing).mode==='not_shared';
  }
  function reopenCampaign(campaign){
    const item=normalizeCampaign(campaign);
    if(!canReopenCampaign(item))return item;
    return {...item,status:'collecting',closedAt:'',assignments:(item.assignments||[]).map(assignment=>assignment&&assignment.status==='locked'?{...assignment,status:'pending'}:assignment)};
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
  /* Nhận cả "07/09/2026 14:30" và "07/09/2026 · 14:30". Dấu · nay BỊ CẤM trong text UI
     (DS §19.0) nhưng vẫn còn trong dữ liệu cũ, và M-04/E-04 đều nhận cả hai — chỉ H-05 thì không.
     Không nhận thì mốc nhắc kiểu cũ parse ra null và cooldown 24 giờ im lặng mất tác dụng. */
  function dateTimeFromDMY(value){
    const match=String(value||'').match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s*[· ]\s*(\d{2}):(\d{2}))?$/);
    return match?new Date(Date.UTC(+match[3],+match[2]-1,+match[1],+(match[4]||0),+(match[5]||0))):null;
  }
  /* Người cho phản hồi nghỉ việc giữa kỳ sẽ không bao giờ trả lời. Trong lúc còn thu thập, lượt của họ
     bị loại khỏi mẫu số (màn hình đặt cờ excludedByResignation) để tiến độ và trạng thái hoàn thành
     phản ánh đúng phần còn thu được; chương trình đã đóng thì giữ nguyên số liệu lịch sử. */
  function isCountedAssignment(assignment){return !(assignment&&assignment.excludedByResignation);}
  function countedAssignments(participant){
    const assignments=Array.isArray(participant&&participant.assignments)?participant.assignments:[];
    return assignments.filter(isCountedAssignment);
  }
  function participantProgress(participant){
    const assignments=countedAssignments(participant);
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
    const assignments=participants.flatMap(item=>(item.assignments||[]).filter(isCountedAssignment));
    return {
      participants:participants.length,
      reviewers:new Set(assignments.map(item=>item.reviewer&&item.reviewer.id).filter(Boolean)).size,
      pending:assignments.filter(item=>item.status!=='submitted').length,
      responded:assignments.filter(item=>item.status==='submitted').length,
      totalResponses:assignments.length,
      overdue:participants.filter(item=>participantViewState(detail.campaign,item,today)==='overdue').length
    };
  }
  /* Cùng luật với yêu cầu của quản lý: quá hạn vẫn nhắc được trong 90 ngày kể từ ngày tạo chương trình. */
  const REMIND_WINDOW_DAYS=90;
  function isWithinRemindWindow(campaign,now){
    const created=dateFromDMY(campaign&&campaign.createdAt),current=dateTimeFromDMY(now);
    if(!current)return false;
    if(!created)return true;
    const end=new Date(created.getTime()+REMIND_WINDOW_DAYS*86400000);
    end.setUTCHours(23,59,59,999);
    return current<=end;
  }
  function canRemindProgramAssignment(campaign,assignment,now){
    if(!campaign||campaign.status!=='collecting'||!assignment||assignment.status==='submitted'||assignment.status==='locked')return false;
    if(campaign.identityVisibility==='anonymous'||campaign.anon==='anon')return false;
    if(!isWithinRemindWindow(campaign,now))return false;
    const history=assignment.manualReminderHistory||[];
    const last=dateTimeFromDMY(history.at(-1)),current=dateTimeFromDMY(now);
    return Boolean(current)&&(!last||current-last>=24*60*60*1000);
  }
  /* ── Khối lượng của một bộ câu hỏi ───────────────────────────────────────
     Người được hỏi cần biết trước "mất bao lâu" để còn chủ động xếp thời gian,
     thay vì mở ra mới biết có 15 câu. Ước tính TỐI THIỂU: câu tự luận 40 giây,
     câu chấm điểm 15 giây, làm tròn LÊN phút để con số không hứa ít hơn thực tế.
     Luật nằm ở model vì cả hàng đợi lẫn popup trả lời của E-04 đều đọc nó. */
  const SECONDS_PER_QUESTION={rating:15,open_text:40};
  function answerEffort(questions){
    const list=Array.isArray(questions)?questions.filter(Boolean):[];
    if(!list.length)return null;
    const seconds=list.reduce((total,question)=>
      total+(SECONDS_PER_QUESTION[question.type]||SECONDS_PER_QUESTION.open_text),0);
    const minutes=Math.max(1,Math.ceil(seconds/60));
    /* "N câu hỏi - ~M phút" có dấu gạch ngang đứng sát dấu ngã, đọc rối mắt.
       Viết thẳng bằng chữ, và chữ "khoảng" cũng nói rõ đây là ước tính. */
    return {count:list.length,minutes,label:`${list.length} câu hỏi, khoảng ${minutes} phút`};
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
  return {isCountedAssignment,countedAssignments,isWithinRemindWindow,dateFromDMY,daysBetween,normalizeQuestion,normalizeReviewerMappings,normalizeAssignmentMode,expandReviewerMappings,normalizeResultSharing,normalizeCampaign,participantPool,reviewerPool,buildAssignments,validateLaunch,isResultShared,resultAudience,canViewProgramResult,shareResults,canShareResults,lockPendingAssignments,closeCampaign,canReopenCampaign,reopenCampaign,normalizeAudiences,isOverdue,isDueSoon,needsReport,campaignStatus,campaignViewState,matchesFilter,sortCampaigns,dateTimeFromDMY,participantProgress,participantViewState,compareParticipantsForAction,sortParticipantsForAction,coreValueTally,isAiSummaryEligible,programDetailOverview,canRemindProgramAssignment,remindEligibleProgramAssignments,answerEffort,MANAGER_LEVELS,RECIPIENT_ROLES,RECIPIENT_ROLE_LABEL,CHANNEL_NOTE,normalizeShareTargets,mergeShareTargets,resolveShareRecipients,shareChannelFor,recipientRoleLabel,channelNote,isEmailOnly};
});
