(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.ManagerFeedbackData=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const CV_ICON={
    'Đổi mới':'Innovation.png','Tinh thần đồng đội':'Teamwork.png','Không ngừng học hỏi':'Constant_.png',
    'Khách hàng là trung tâm':'Customer_.png','Thực thi xuất sắc':'Excellence.png'
  };
  const SENDER_META={
    'duc.truong':{dept:'ITC',team:'Platform',pos:'SRE Lead'},
    'nam.le':{dept:'ITC',team:'Backend',pos:'Software Engineer'},
    'lan.hoang':{dept:'Product',team:'Growth',pos:'Product Manager'},
    'bao.nguyen':{dept:'ITC',team:'Frontend',pos:'Senior Engineer'},
    'long.pham':{dept:'Data',team:'Analytics',pos:'Data Analyst'},
    'tung.dinh':{dept:'ITC',team:'Backend',pos:'Engineering Manager'},
    'hang.mai':{dept:'ITC',team:'DevOps',pos:'Platform Engineer'},
    'tu.nguyen':{dept:'ITC',team:'Backend',pos:'Senior Engineer'},
    'mai.tran':{dept:'Product',team:'Design',pos:'Product Designer'}
  };
  const BASE=[
    {id:'f1',employeeId:'e1',cycle:'2026',sender:{name:'Trương Minh Đức',dom:'duc.truong',ini:'TĐ'},date:'05/06/2026',visibility:'manager',body:'Tú xử lý incident production rất chắc chắn, phối hợp rõ ràng với các team liên quan và luôn giữ được sự bình tĩnh khi có áp lực.',cv:['Thực thi xuất sắc','Tinh thần đồng đội']},
    {id:'f2',employeeId:'e1',cycle:'2026',sender:{name:'Lê Thành Nam',dom:'nam.le',ini:'LN'},date:'14/03/2026',visibility:'receiver',body:'Tú là một trong những backend developer chắc tay nhất team.',cv:['Không ngừng học hỏi']},
    {id:'f3',employeeId:'e1',cycle:'2026',sender:{name:'Hoàng Thị Lan',dom:'lan.hoang',ini:'HL'},date:'22/04/2026',visibility:'manager',question:'Bạn đánh giá thế nào về phần trình bày roadmap kỹ thuật Q1?',body:'Tú giải thích vấn đề kỹ thuật rõ ràng kể cả với người không chuyên. Các ví dụ trực quan giúp business team hiểu nhanh lý do cần refactor.',cv:['Khách hàng là trung tâm']},
    {id:'f4',employeeId:'e2',cycle:'2026',sender:{name:'Nguyễn Quốc Bảo',dom:'bao.nguyen',ini:'NB'},date:'18/05/2026',visibility:'manager',body:'Mai chủ động chuẩn hóa tài liệu Storybook và hỗ trợ các team áp dụng Design System rất hiệu quả.',cv:['Tinh thần đồng đội','Thực thi xuất sắc']},
    {id:'f5',employeeId:'e4',cycle:'2026',sender:{name:'Nguyễn Văn Tú',dom:'tu.nguyen',ini:'NT'},date:'09/07/2026',visibility:'manager',body:'Lan xây dựng bộ regression test kỹ lưỡng, giúp team phát hiện sớm hai lỗi nghiêm trọng trước khi release.',cv:['Khách hàng là trung tâm']},
    {id:'f6',employeeId:'e5',cycle:'2026',sender:{name:'Mai Thị Hằng',dom:'hang.mai',ini:'MH'},date:'18/07/2026',visibility:'manager',question:'Chất lượng kỹ thuật của phần chuyển đổi schema và data như thế nào?',body:'Phần chuyển đổi schema được xử lý cẩn thận, không mất dữ liệu và downtime gần như bằng không.',cv:['Thực thi xuất sắc']},
    {id:'f7',employeeId:'e6',cycle:'2026',sender:{name:'Trần Thị Mai',dom:'mai.tran',ini:'TM'},date:'12/07/2026',visibility:'receiver',body:'Thu có tiến bộ tốt trong việc chuyển đổi codebase sang TypeScript.',cv:['Không ngừng học hỏi']},
    {id:'f8',employeeId:'e8',cycle:'2026',sender:{name:'Phạm Thành Long',dom:'long.pham',ini:'PL'},date:'20/07/2026',visibility:'manager',body:'Hoa kết nối business và engineering tốt, giúp các quyết định sản phẩm có đủ dữ liệu và được thực thi nhanh.',cv:['Khách hàng là trung tâm','Thực thi xuất sắc']},
    {id:'f9',employeeId:'e12',cycle:'2026',sender:{name:'Đinh Văn Tùng',dom:'tung.dinh',ini:'ĐT'},date:'25/07/2026',visibility:'manager',body:'Bích không chỉ hoàn thành tốt phần kỹ thuật mà còn dành thời gian mentor hai bạn junior lên mid-level.',cv:['Tinh thần đồng đội','Không ngừng học hỏi']}
  ];
  const SENDERS=[
    {name:'Lê Thành Nam',dom:'nam.le',ini:'LN'},
    {name:'Hoàng Thị Lan',dom:'lan.hoang',ini:'HL'},
    {name:'Trương Minh Đức',dom:'duc.truong',ini:'TĐ'},
    {name:'Nguyễn Quốc Bảo',dom:'bao.nguyen',ini:'NB'}
  ];
  function generatedFeedback(employee,index){
    const a=SENDERS[index%SENDERS.length],b=SENDERS[(index+1)%SENDERS.length],c=SENDERS[(index+2)%SENDERS.length];
    return [
      {id:`sample-${employee.id}-recognition`,employeeId:employee.id,cycle:'2026',sender:a,date:`${String(3+index%20).padStart(2,'0')}/08/2026`,visibility:'manager',body:`${employee.name} chủ động phối hợp, theo sát cam kết và luôn hỗ trợ đồng đội khi công việc có thay đổi. Cách làm việc rõ ràng của bạn tạo ảnh hưởng tích cực đến kết quả chung của team.`,cv:['Tinh thần đồng đội','Thực thi xuất sắc']},
      {id:`sample-${employee.id}-requested`,employeeId:employee.id,cycle:'2026',sender:b,date:`${String(5+index%20).padStart(2,'0')}/07/2026`,visibility:'manager',question:`Bạn đánh giá thế nào về đóng góp nổi bật của ${employee.name} trong chu kỳ này?`,body:`Điểm nổi bật của ${employee.name} là khả năng nhìn vấn đề từ nhu cầu người dùng và chuyển thành hành động cụ thể. Bạn cũng tiếp nhận góp ý cởi mở và cải thiện rất nhanh.`,cv:['Khách hàng là trung tâm','Không ngừng học hỏi']},
      {id:`sample-${employee.id}-plain`,employeeId:employee.id,cycle:'2026',sender:c,date:`${String(7+index%20).padStart(2,'0')}/06/2026`,visibility:'manager',body:`Mình đánh giá cao sự đáng tin cậy của ${employee.name}. Bạn trao đổi thẳng thắn, phản hồi đúng lúc và luôn hoàn thành phần việc đã cam kết.`,cv:[]}
    ];
  }
  function employeeMeta(employee){
    return [`${employee.name} (${employee.login})`,employee.div,employee.dept,employee.team,employee.pos].filter(Boolean).join(' - ');
  }
  function dateKey(value){const [d,m,y]=String(value||'').split('/');return `${y||''}${m||''}${d||''}`;}
  function createStore(employees){
    const generated=(employees||[]).flatMap(generatedFeedback);
    const directory=new Map((employees||[]).map(person=>[person.login,person]));
    const feedback=BASE.concat(generated).map(item=>{
      const person=directory.get(item.sender.dom)||SENDER_META[item.sender.dom];
      return person?{...item,sender:{...item.sender,dept:person.dept,team:person.team,pos:person.pos}}:item;
    });
    function feedbackFor(employeeId,cycle){
      return feedback.filter(item=>item.employeeId===employeeId&&(cycle==='all'||item.cycle===cycle)&&item.visibility==='manager').sort((a,b)=>dateKey(b.date).localeCompare(dateKey(a.date)));
    }
    return {feedback,feedbackFor,employeeMeta};
  }
  function feedbackCard(item,employee,options={}){
    const badges=(item.cv||[]).map(cv=>`<span class="pms-tooltip"><img class="cv-icon" src="../Core value with BG/${CV_ICON[cv]}" alt="${cv}"/><span class="pms-tooltip-content" role="tooltip">${cv}</span></span>`).join('');
    const senderMeta=[item.sender.dept,item.sender.team,item.sender.pos].filter(Boolean).join(' - ');
    const senderLabel=`${item.sender.name} <span class="fb-domain">(${item.sender.dom})</span>`;
    const senderTipClass=options.senderTooltipPlacement==='top'?' pms-tooltip-top':'';
    const sender=senderMeta?`<span class="fb-sender pms-tooltip" tabindex="0">${senderLabel}<span class="pms-tooltip-content${senderTipClass}" role="tooltip">${senderMeta}</span></span>`:senderLabel;
    return `<article class="feedback-card">${badges?`<div class="cv-icons">${badges}</div>`:''}<div class="fb-head"><div class="avatar">${item.sender.ini}</div><div><div class="fb-line">${sender}</div><div class="fb-date">${item.date}</div></div></div>${item.question?`<div class="question"><div class="question-label">Câu hỏi</div><div class="question-text">${item.question}</div></div>`:''}<p class="fb-body">${item.body}</p></article>`;
  }
  function coreValueIcon(value){return CV_ICON[value]||'';}
  return {createStore,employeeMeta,feedbackCard,coreValueIcon};
});
