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
  let requestSequence=0;
  function tsFromDMY(value){
    const [d,m,y]=String(value||'').split('/');
    if(!d||!m||!y) return 0;
    return Number(`${y}${m.padStart(2,'0')}${d.padStart(2,'0')}`)||0;
  }
  function fmtDMY(iso){
    const [y,m,d]=String(iso||'').split('-');
    return (y&&m&&d)?`${d}/${m}/${y}`:'';
  }
  function dateFromDMY(value){
    const [d,m,y]=String(value||'').split('/').map(Number);
    return d&&m&&y?new Date(Date.UTC(y,m-1,d)):null;
  }
  function fmtISOFromDate(date){
    if(!date)return '';
    const pad=value=>String(value).padStart(2,'0');
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth()+1)}-${pad(date.getUTCDate())}`;
  }
  function fmtDMYFromDate(date){
    if(!date)return '';
    const pad=value=>String(value).padStart(2,'0');
    return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth()+1)}/${date.getUTCFullYear()}`;
  }
  function maxDueDate(createdAt){
    const date=dateFromDMY(createdAt);if(!date)return '';
    date.setUTCDate(date.getUTCDate()+90);
    return fmtDMYFromDate(date);
  }
  function addDaysDMY(value,days){const date=dateFromDMY(value);if(!date)return '';date.setUTCDate(date.getUTCDate()+days);return fmtDMYFromDate(date);}
  function automaticReminderDate(request){return addDaysDMY(request&&request.due,-3);}
  function dateTimeFromDMY(value){
    const match=String(value||'').match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s*[· ]\s*(\d{2}):(\d{2}))?$/);
    return match?new Date(Date.UTC(+match[3],+match[2]-1,+match[1],+(match[4]||0),+(match[5]||0))):null;
  }
  function reminderHistory(request,assignment,todayDMY){
    const recorded=(assignment&&assignment.manualReminderHistory)||[];
    const manual=(recorded.length?recorded:(assignment&&assignment.remindedAt?[assignment.remindedAt]:[])).map(at=>({at,type:'manual'}));
    const automaticAt=(assignment&&assignment.automaticRemindedAt)||automaticReminderDate(request);
    const automaticDate=dateTimeFromDMY(automaticAt),today=dateTimeFromDMY(todayDMY);
    const automatic=automaticDate&&today&&automaticDate<=today?[{at:automaticAt,type:'automatic'}]:[];
    return [...manual,...automatic].sort((a,b)=>dateTimeFromDMY(a.at)-dateTimeFromDMY(b.at));
  }
  function dueRange(createdAt){
    const created=dateFromDMY(createdAt),max=dateFromDMY(maxDueDate(createdAt));
    return {min:fmtISOFromDate(created),max:fmtISOFromDate(max)};
  }
  function validateDueDate(createdAt,due){
    const created=dateFromDMY(createdAt),selected=dateFromDMY(due),max=dateFromDMY(maxDueDate(createdAt));
    if(!created||!selected)throw new Error('Hạn phản hồi là bắt buộc');
    if(selected<created)throw new Error('Hạn phản hồi không được trước ngày tạo');
    if(selected>max)throw new Error('Yêu cầu chỉ có hiệu lực tối đa 90 ngày kể từ ngày tạo');
    return due;
  }
  function personKey(person){ return String(person&&(person.login||person.dom||person.id)||''); }
  function normalizeGoal(input){
    const goal=String(input&&input.goal||'').trim();
    if(!goal)throw new Error('Mục tiêu là bắt buộc');
    return goal;
  }
  function createRequestId(input){
    const uuid=globalThis.crypto&&typeof globalThis.crypto.randomUUID==='function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${(++requestSequence).toString(36)}`;
    return `mrq-${input.cycle||'cycle'}-${uuid}`;
  }

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
          repliedAt:null,
          remindedAt:null,
          manualReminderHistory:[],
          responseId:null
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
    const goal=normalizeGoal(input);
    const assignments=buildAssignments(input);
    const due=validateDueDate(input.createdAt||'',input.due||'');
    return {
      id:input.id||createRequestId(input),
      goal,
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
    const dueTs=request&&(request.dueTs||tsFromDMY(request.due));
    return !!(today&&dueTs&&today>dueTs);
  }
  function isNoResponse(request,todayDMY){
    const today=dateFromDMY(todayDMY),expires=dateFromDMY(maxDueDate(request&&request.createdAt));
    const pending=((request&&request.assignments)||[]).some(item=>item.status!=='done');
    return !!(pending&&today&&expires&&today>expires);
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

  function daysOverdue(request,todayDMY){
    if(!isOverdue(request,todayDMY))return 0;
    const due=dateFromDMY(request.due),today=dateFromDMY(todayDMY);
    return due&&today?Math.floor((today-due)/86400000):0;
  }
  function requestStatus(request,todayDMY){
    const stat=summarize(request,todayDMY);
    if(stat.total>0&&stat.pending===0)return 'complete';
    if(isNoResponse(request,todayDMY))return 'no_response';
    if(stat.overdue>0)return 'overdue';
    return 'collecting';
  }
  function latestResponseTime(request){
    return ((request&&request.assignments)||[]).reduce((latest,item)=>{
      const value=dateTimeFromDMY(item.repliedAt);
      return value?Math.max(latest,+value):latest;
    },0);
  }
  function compareRequestsForAction(a,b,todayDMY){
    const rank={overdue:0,collecting:1,complete:2,no_response:3};
    const statusA=requestStatus(a,todayDMY),statusB=requestStatus(b,todayDMY);
    const group=(rank[statusA]??4)-(rank[statusB]??4);
    if(group)return group;
    if(statusA==='overdue')return tsFromDMY(a.due)-tsFromDMY(b.due)||tsFromDMY(a.createdAt)-tsFromDMY(b.createdAt);
    if(statusA==='collecting'){
      const statA=summarize(a,todayDMY),statB=summarize(b,todayDMY);
      return tsFromDMY(a.due)-tsFromDMY(b.due)||statA.rate-statB.rate||tsFromDMY(a.createdAt)-tsFromDMY(b.createdAt);
    }
    if(statusA==='complete')return latestResponseTime(b)-latestResponseTime(a)||tsFromDMY(b.createdAt)-tsFromDMY(a.createdAt);
    return tsFromDMY(b.createdAt)-tsFromDMY(a.createdAt);
  }
  function sortRequestsForAction(requests,todayDMY){
    return [...(requests||[])].sort((a,b)=>compareRequestsForAction(a,b,todayDMY));
  }
  function canRemindAssignment(request,assignment,nowDMY){
    if(!assignment||assignment.status==='done'||requestStatus(request,String(nowDMY||'').slice(0,10))==='no_response')return false;
    const now=dateTimeFromDMY(nowDMY),due=dateFromDMY(request&&request.due);
    if(!now||!due)return false;
    due.setUTCHours(23,59,59,999);
    if(now>due)return false;
    const last=dateTimeFromDMY(assignment.remindedAt);
    return !last||now-last>=86400000;
  }
  function remindAssignment(request,assignmentId,todayDMY){
    const assignment=((request&&request.assignments)||[]).find(item=>item.id===assignmentId);
    if(!canRemindAssignment(request,assignment,todayDMY))return false;
    assignment.remindedAt=todayDMY;
    assignment.manualReminderHistory=[...((assignment.manualReminderHistory)||[]),todayDMY];
    return true;
  }
  function remindPending(request,todayDMY){
    return ((request&&request.assignments)||[]).reduce((count,item)=>count+(remindAssignment(request,item.id,todayDMY)?1:0),0);
  }

  function createStore(initialRequests){
    const requests=[...((initialRequests||[]))];
    return {
      requests,
      add(request){ requests.push(request); return request; },
      get(id){ return requests.find(item=>item.id===id)||null; },
      upsert(request){
        const index=requests.findIndex(item=>item.id===request.id);
        if(index>=0)requests[index]=request;else requests.push(request);
        return request;
      },
      replace(next){ requests.splice(0,requests.length,...(next||[])); return requests; },
      serialize(){ return JSON.stringify(requests); },
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

  return {tsFromDMY,fmtDMY,maxDueDate,dueRange,validateDueDate,automaticReminderDate,dateTimeFromDMY,reminderHistory,normalizeGoal,directReports,isEligibleDesignee,buildAssignments,previewCount,createRequest,summarize,byEmployee,isOverdue,isNoResponse,daysOverdue,requestStatus,compareRequestsForAction,sortRequestsForAction,canRemindAssignment,remindAssignment,remindPending,createStore};
});
