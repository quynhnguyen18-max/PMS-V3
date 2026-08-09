(function(root, factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  root.FeedbackModel=api;
})(typeof globalThis!=='undefined' ? globalThis : this, function(){
  function tsFromDate(date){
    const parts=String(date||'').split('/').map(Number);
    if(parts.length!==3 || parts.some(Number.isNaN)) return 0;
    return parts[2]*10000+parts[1]*100+parts[0];
  }

  function requestId(request, index){
    return request.id || `request-${request.ts || tsFromDate(request.date) || index}`;
  }

  function responseId(requestIdValue, reviewer){
    return reviewer.responseId || `resp-${requestIdValue}-${reviewer.dom || reviewer.id || reviewer.name}`;
  }

  function responseFromReviewer(request, reviewer, index){
    if(reviewer.st!=='done' || !reviewer.fb) return null;
    const reqId=requestId(request,index);
    const date=String(reviewer.repliedAt || request.date || '').split(' · ')[0];
    return {
      id:responseId(reqId,reviewer), kind:'received', cycle:request.cycle,
      date, ts:tsFromDate(date), requestId:reqId, status:'submitted',
      who:{name:reviewer.name, dom:reviewer.dom, ini:reviewer.ini, org:reviewer.org},
      q:reviewer.q || request.question || '', body:reviewer.fb,
      vis:reviewer.vis || 'receiver', cv:[...(reviewer.cv || [])]
    };
  }

  function normalizeFeed(feed){
    const output=[];
    const seen=new Set();
    (feed || []).forEach((item,index)=>{
      if(item.kind!=='request'){
        const id=item.id || `${item.kind}-${item.ts || index}-${item.who?.dom || index}`;
        if(!seen.has(id)){ output.push({...item,id}); seen.add(id); }
        return;
      }
      const reqId=requestId(item,index);
      output.push(item.id ? item : {...item,id:reqId});
      (item.reviewers || []).forEach(reviewer=>{
        const response=responseFromReviewer({...item,id:reqId},reviewer,index);
        if(response && !seen.has(response.id)){ output.push(response); seen.add(response.id); }
      });
    });
    return output;
  }

  function itemsForFilter(feed,filter,cycle){
    return normalizeFeed(feed).filter(item=>(!cycle || cycle==='all' || item.cycle===cycle) && (filter==='all' || item.kind===filter));
  }

  function createGivenResponse(input){
    return {
      id:input.id, kind:'given', cycle:input.cycle, date:input.date, ts:tsFromDate(input.date),
      who:{...input.recipient}, body:input.body, vis:input.vis,
      cv:[...(input.cv || [])], backgroundId:input.backgroundId || null,
      ...(input.requestId ? {requestId:input.requestId} : {}), status:'submitted'
    };
  }

  function dateFromDMY(value){
    const [d,m,y]=String(value||'').split('/').map(Number);
    return d&&m&&y?new Date(Date.UTC(y,m-1,d)):null;
  }

  function requestStatus(request,todayDMY){
    const reviewers=(request&&request.reviewers)||[];
    if(request&&request.status==='completed'||(reviewers.length&&reviewers.every(item=>item.st==='done')))return 'complete';
    const created=dateFromDMY(request&&request.date),today=dateFromDMY(todayDMY);
    if(created&&today){const expires=new Date(created);expires.setUTCDate(expires.getUTCDate()+90);if(today>expires)return 'no_response';}
    return today&&dateFromDMY(request&&request.due)&&today>dateFromDMY(request.due)?'overdue':'collecting';
  }

  function latestResponseTime(request){
    return ((request&&request.reviewers)||[]).reduce((latest,item)=>Math.max(latest,tsFromDate(String(item.repliedAt||'').split('·')[0].trim())),0);
  }

  function compareRequestsForAction(a,b,todayDMY){
    const rank={overdue:0,collecting:1,complete:2,no_response:3};
    const statusA=requestStatus(a,todayDMY),statusB=requestStatus(b,todayDMY);
    const group=(rank[statusA]??4)-(rank[statusB]??4);
    if(group)return group;
    if(statusA==='overdue')return tsFromDate(a.due)-tsFromDate(b.due)||tsFromDate(a.date)-tsFromDate(b.date);
    if(statusA==='collecting'){
      const reviewersA=a.reviewers||[],reviewersB=b.reviewers||[];
      const rateA=reviewersA.length?reviewersA.filter(item=>item.st==='done').length/reviewersA.length:0;
      const rateB=reviewersB.length?reviewersB.filter(item=>item.st==='done').length/reviewersB.length:0;
      return tsFromDate(a.due)-tsFromDate(b.due)||rateA-rateB||tsFromDate(a.date)-tsFromDate(b.date);
    }
    if(statusA==='complete')return latestResponseTime(b)-latestResponseTime(a)||tsFromDate(b.date)-tsFromDate(a.date);
    return tsFromDate(b.date)-tsFromDate(a.date);
  }

  function sortRequestsForAction(requests,todayDMY){
    return [...(requests||[])].sort((a,b)=>compareRequestsForAction(a,b,todayDMY));
  }

  function campaignStatus(campaign,nowISO){
    const now=Date.parse(nowISO),start=Date.parse(campaign&&campaign.startAt),end=Date.parse(campaign&&campaign.endAt);
    if(!Number.isFinite(now)||!Number.isFinite(start)||!Number.isFinite(end))return 'invalid';
    if(now<start)return 'scheduled';
    return now>end?'ended':'active';
  }

  function activeMediaCampaign(campaigns,nowISO){
    return [...(campaigns||[])].filter(item=>campaignStatus(item,nowISO)==='active').sort((a,b)=>Date.parse(b.startAt)-Date.parse(a.startAt))[0]||null;
  }

  function snapshotReceivedFeedback(feed,campaign){
    const cutoff=tsFromDate(campaign&&campaign.snapshotAt);
    return normalizeFeed(feed).filter(item=>item.kind==='received'&&item.cycle===String(campaign&&campaign.cycleYear)&&item.ts<=cutoff);
  }

  function mostFrequentFeedbackGiver(feedback){
    const counts=new Map();
    (feedback||[]).filter(item=>item.kind==='received'&&item.who).forEach(item=>{
      const key=item.who.dom||item.who.name;
      const current=counts.get(key)||{name:item.who.name,dom:item.who.dom,count:0};
      current.count+=1;counts.set(key,current);
    });
    return [...counts.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'vi'))[0]||null;
  }

  return {tsFromDate,normalizeFeed,itemsForFilter,createGivenResponse,requestStatus,compareRequestsForAction,sortRequestsForAction,campaignStatus,activeMediaCampaign,snapshotReceivedFeedback,mostFrequentFeedbackGiver};
});
