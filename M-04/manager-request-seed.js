(function(root,factory){
  const model=typeof module==='object'&&module.exports?require('./manager-request-model.js'):root.ManagerRequestModel;
  const api=factory(model);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.ManagerRequestSeed=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(model){
  const MANAGER={name:'Lê Thị Thanh',login:'thanh.le',ini:'LT'};
  function reviewer(person){return {name:person.name,login:person.login,ini:person.ini};}
  function markDone(request,indexes,date){
    indexes.forEach(index=>{
      const assignment=request.assignments[index];
      if(!assignment)return;
      assignment.status='done';assignment.repliedAt=date;assignment.responseId=`response-${request.id}-${index+1}`;
    });
    return request;
  }
  function create(employees){
    const direct=model.directReports(employees);
    const reviewerPool=employees.filter(person=>person.login!==MANAGER.login);
    const collecting=model.createRequest({
      goal:'Thu thập góc nhìn về khả năng phối hợp trong dự án Migration',
      id:'manager-request-migration',cycle:'2026',createdAt:'28/07/2026',due:'15/08/2026',createdBy:MANAGER,
      designees:direct.slice(0,3),reviewers:reviewerPool.slice(4,7),
      sharedQuestion:'Bạn đánh giá thế nào về sự phối hợp và đóng góp của đồng nghiệp trong dự án Migration?'
    });
    markDone(collecting,[0,2,4,6],'02/08/2026');

    const overdue=model.createRequest({
      goal:'Thu thập góc nhìn phục vụ coaching và kế hoạch phát triển Q3',
      id:'manager-request-coaching',cycle:'2026',createdAt:'18/07/2026',due:'01/08/2026',createdBy:MANAGER,
      designees:direct.slice(1,3),reviewers:reviewerPool.slice(1,4),personalize:true,
      questions:{
        [reviewerPool[1].login]:'Bạn ghi nhận điểm mạnh nào của đồng nghiệp trong cách dẫn dắt công việc?',
        [reviewerPool[2].login]:'Đồng nghiệp có thể cải thiện điều gì để phối hợp hiệu quả hơn?',
        [reviewerPool[3].login]:'Bạn có ví dụ cụ thể nào về tác động của đồng nghiệp trong quý vừa rồi?'
      }
    });
    markDone(overdue,[0,3],'29/07/2026');
    overdue.assignments.filter(item=>item.status==='pending').slice(0,2).forEach(item=>{item.remindedAt='03/08/2026';});

    const complete=model.createRequest({
      goal:'Ghi nhận hiệu quả buổi trình bày Roadmap',
      id:'manager-request-roadmap',cycle:'2026',createdAt:'05/07/2026',due:'25/07/2026',createdBy:MANAGER,
      designees:direct.slice(0,2),reviewers:reviewerPool.slice(7,9),
      sharedQuestion:'Sau buổi trình bày roadmap, bạn ghi nhận điều gì và có góp ý gì cho đồng nghiệp?'
    });
    markDone(complete,complete.assignments.map((_,index)=>index),'22/07/2026');
    const leadership=model.createRequest({goal:'Đánh giá mức độ sẵn sàng nhận vai trò Tech Lead',id:'manager-request-tech-lead',cycle:'2026',createdAt:'24/06/2026',due:'12/07/2026',createdBy:MANAGER,designees:direct.slice(0,1),reviewers:reviewerPool.slice(2,6),sharedQuestion:'Bạn đánh giá thế nào về khả năng dẫn dắt kỹ thuật, ra quyết định và hỗ trợ đồng đội của nhân viên này?'});
    markDone(leadership,leadership.assignments.map((_,index)=>index),'10/07/2026');
    const probation=model.createRequest({goal:'Thu thập phản hồi sau giai đoạn thử việc',id:'manager-request-probation',cycle:'2026',createdAt:'12/06/2026',due:'30/06/2026',createdBy:MANAGER,designees:direct.slice(2,3),reviewers:reviewerPool.slice(0,4),sharedQuestion:'Trong giai đoạn vừa qua, nhân viên đã thích nghi và đáp ứng kỳ vọng công việc như thế nào?'});
    markDone(probation,[0,1,2],'27/06/2026');
    const incident=model.createRequest({goal:'Ghi nhận khả năng xử lý sự cố production',id:'manager-request-incident',cycle:'2026',createdAt:'02/06/2026',due:'18/06/2026',createdBy:MANAGER,designees:direct.slice(0,2),reviewers:reviewerPool.slice(5,8),sharedQuestion:'Bạn ghi nhận điều gì về khả năng phối hợp, xử lý vấn đề và giao tiếp của nhân viên trong sự cố production gần nhất?'});
    markDone(incident,incident.assignments.map((_,index)=>index),'16/06/2026');
    const crossTeam=model.createRequest({goal:'Làm rõ cơ hội cải thiện trong phối hợp liên phòng ban',id:'manager-request-cross-team',cycle:'2026',createdAt:'20/05/2026',due:'10/06/2026',createdBy:MANAGER,designees:direct.slice(1,3),reviewers:reviewerPool.slice(3,7),sharedQuestion:'Điều gì đang giúp hoặc cản trở nhân viên phối hợp hiệu quả với các phòng ban liên quan?'});
    markDone(crossTeam,[0,2,4,5],'08/06/2026');
    const career=model.createRequest({goal:'Tổng hợp góc nhìn cho buổi career conversation 6 tháng',id:'manager-request-career',cycle:'2026',createdAt:'08/05/2026',due:'25/05/2026',createdBy:MANAGER,designees:direct.slice(0,1),reviewers:reviewerPool.slice(1,6),sharedQuestion:'Bạn ghi nhận điểm mạnh nổi bật và một ưu tiên phát triển của nhân viên trong 6 tháng vừa qua là gì?'});
    markDone(career,career.assignments.map((_,index)=>index),'23/05/2026');
    return [collecting,overdue,complete,leadership,probation,incident,crossTeam,career];
  }
  return {create};
});
