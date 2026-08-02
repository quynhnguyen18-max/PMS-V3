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
    return normalizeFeed(feed).filter(item=>(!cycle || item.cycle===cycle) && (filter==='all' || item.kind===filter));
  }

  function createGivenResponse(input){
    return {
      id:input.id, kind:'given', cycle:input.cycle, date:input.date, ts:tsFromDate(input.date),
      who:{...input.recipient}, body:input.body, vis:input.vis,
      cv:[...(input.cv || [])], ...(input.requestId ? {requestId:input.requestId} : {}), status:'submitted'
    };
  }

  return {tsFromDate,normalizeFeed,itemsForFilter,createGivenResponse};
});
