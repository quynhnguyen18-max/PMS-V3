/* ═══════════════════════════════
   MR-1 — Quản lý yêu cầu phản hồi cho direct reports (Phase D3)
   Model dùng chung cho M-04 và bước monitoring D4.
   Nguyên tắc: 1 assignment = 1 cặp (nhân viên × người phản hồi),
   không nhân bản nội dung response; visibility luôn 'shared'.
═══════════════════════════════ */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.ManagerRequestModel=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function tsFromDMY(value){
    const [d,m,y]=String(value||'').split('/');
    if(!d||!m||!y) return 0;
    return Number(`${y}${m.padStart(2,'0')}${d.padStart(2,'0')}`)||0;
  }
  function fmtDMY(iso){
    const [y,m,d]=String(iso||'').split('-');
    return (y&&m&&d)?`${d}/${m}/${y}`:'';
  }
  function personKey(person){ return String(person&&(person.login||person.dom||person.id)||''); }

  /* Chỉ direct report mới được chọn làm người được nhận phản hồi (no skip-level) */
  function directReports(employees){
    return (employees||[]).filter(emp=>emp.lvl==='lm1');
  }
  function isEligibleDesignee(employee){
    return !!employee && employee.lvl==='lm1';
  }

  /* Sinh assignment cho từng cặp (nhân viên × reviewer), bỏ cặp tự đánh giá chính mình */
  function buildAssignments(input){
    const designees=(input&&input.designees)||[];
    const reviewers=(input&&input.reviewers)||[];
    const questions=(input&&input.questions)||{};
    const shared=(input&&input.sharedQuestion)||'';
    const list=[];
    designees.forEach(employee=>{
      reviewers.forEach(reviewer=>{
        if(personKey(reviewer)===personKey(employee)) return;
        list.push({
          id:`mrq-${employee.id}-${personKey(reviewer)}`,
          employeeId:employee.id,
          employeeName:employee.name,
          employeeLogin:employee.login,
          reviewer:{name:reviewer.name,login:personKey(reviewer),ini:reviewer.ini},
          question:questions[personKey(reviewer)]||shared,
          status:'pending',
          repliedAt:null
        });
      });
    });
    return list;
  }

  /* Preview số yêu cầu sẽ tạo: n nhân viên × m người phản hồi */
  function previewCount(input){
    const designees=(input&&input.designees)||[];
    const reviewers=(input&&input.reviewers)||[];
    const total=buildAssignments({designees,reviewers}).length;
    const product=designees.length*reviewers.length;
    return {designees:designees.length,reviewers:reviewers.length,product,total,skipped:product-total};
  }

  function createRequest(input){
    const assignments=buildAssignments(input);
    const due=input.due||'';
    return {
      id:input.id||`mrq-${input.cycle||''}-${tsFromDMY(input.createdAt)}-${assignments.length}`,
      kind:'manager-request',
      cycle:input.cycle,
      createdBy:input.createdBy||null,
      createdAt:input.createdAt||'',
      due,
      dueTs:tsFromDMY(due),
      visibility:'shared',          // UC3: cố định, reviewer không đổi được
      reviewerCanChangeVisibility:false,
      questionMode:input.personalize?'individual':'shared',
      question:input.personalize?'':(input.sharedQuestion||''),
      designees:(input.designees||[]).map(emp=>({id:emp.id,name:emp.name,login:emp.login})),
      reviewers:(input.reviewers||[]).map(rv=>({name:rv.name,login:personKey(rv),ini:rv.ini})),
      assignments
    };
  }

  /* ── Dữ liệu cho D4 monitoring ── */
  function isOverdue(request,todayDMY){
    const today=tsFromDMY(todayDMY);
    return !!(today&&request.dueTs&&today>request.dueTs);
  }
  function summarize(request,todayDMY){
    const assignments=(request&&request.assignments)||[];
    const total=assignments.length;
    const done=assignments.filter(item=>item.status==='done').length;
    const pending=total-done;
    return {
      total,done,pending,
      overdue:isOverdue(request,todayDMY)?pending:0,
      rate:total?Math.round(done/total*100):0
    };
  }
  function byEmployee(request,todayDMY){
    const late=isOverdue(request,todayDMY);
    const rows=new Map();
    ((request&&request.assignments)||[]).forEach(item=>{
      if(!rows.has(item.employeeId)){
        rows.set(item.employeeId,{employeeId:item.employeeId,employeeName:item.employeeName,total:0,done:0,pending:0,overdue:0,rate:0});
      }
      const row=rows.get(item.employeeId);
      row.total++;
      if(item.status==='done') row.done++; else row.pending++;
    });
    return [...rows.values()].map(row=>({...row,overdue:late?row.pending:0,rate:row.total?Math.round(row.done/row.total*100):0}));
  }

  function createStore(){
    const requests=[];
    return {
      requests,
      add(request){ requests.push(request); return request; },
      forCycle(cycle){ return requests.filter(item=>item.cycle===cycle); },
      summarizeAll(cycle,todayDMY){
        return this.forCycle(cycle).reduce((acc,request)=>{
          const stat=summarize(request,todayDMY);
          acc.total+=stat.total; acc.done+=stat.done; acc.pending+=stat.pending; acc.overdue+=stat.overdue;
          return acc;
        },{total:0,done:0,pending:0,overdue:0});
      }
    };
  }

  return {tsFromDMY,fmtDMY,directReports,isEligibleDesignee,buildAssignments,previewCount,createRequest,summarize,byEmployee,isOverdue,createStore};
});
