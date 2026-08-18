(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.FeedbackProgramData=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const PROGRAMS=[
    {id:'s1',goal:'Đánh giá năng lực giữa kỳ Q3/2026',status:'draft',createdAt:'09/08/2026',due:'',anon:'named',participants:8,reviewers:0,total:0,done:0,report:'none'},
    {id:'s2',goal:'Khảo sát phát triển đội ngũ Sales',status:'collecting',createdAt:'01/08/2026',due:'13/08/2026',anon:'named',participants:10,reviewers:4,total:40,done:20,report:'none'},
    {id:'s3',goal:'Phản hồi dự án Chuyển đổi số',status:'collecting',createdAt:'20/07/2026',due:'09/08/2026',anon:'anon',participants:6,reviewers:4,total:24,done:18,report:'none'},
    {id:'s4',goal:'Đánh giá tiềm năng kế thừa khối Vận hành',status:'collecting',createdAt:'03/08/2026',due:'14/08/2026',anon:'anon',participants:5,reviewers:6,total:30,done:27,report:'none'},
    {id:'s5',goal:'Phản hồi 6 tháng đầu năm - Marketing',status:'closed',createdAt:'10/06/2026',due:'30/06/2026',anon:'named',participants:9,reviewers:4,total:36,done:34,report:'none'},
    {id:'s6',goal:'Đánh giá cuối kỳ 2025 - khối Kinh doanh',status:'closed',createdAt:'02/12/2025',due:'22/12/2025',anon:'anon',participants:17,reviewers:5,total:55,done:52,report:'published',resultSharing:{mode:'shared_selected',participantIds:['tu.nguyen','duc.truong','nam.le'],audience:'recipient_and_managers',contentLevel:'summary_detail',note:'Cảm ơn cả nhóm đã dành thời gian phản hồi thẳng thắn. Mong mỗi bạn dùng kết quả này để phát triển trong năm 2026.',sharedAt:'23/12/2025',sharedBy:'hr'}},
    {id:'s7',goal:'Phản hồi giữa kỳ Q3 - nhóm Sản phẩm',status:'closed',createdAt:'05/07/2026',due:'20/07/2026',anon:'named',participants:17,reviewers:4,total:32,done:30,report:'published',resultSharing:{mode:'shared_selected',participantIds:['tu.nguyen','bao.nguyen','hang.mai'],audience:'recipient_and_managers',contentLevel:'summary_detail',note:'Kết quả có kèm chi tiết từng phản hồi, hiển thị tên người cho phản hồi.',sharedAt:'22/07/2026',sharedBy:'hr'}},
    {id:'s8',goal:'Khảo sát cộng tác Q2 - Vận hành',status:'closed',createdAt:'01/04/2026',due:'18/04/2026',anon:'named',participants:17,reviewers:4,total:32,done:29,report:'published',resultSharing:{mode:'shared_selected',participantIds:['duc.truong','tung.dinh'],audience:'recipient_and_managers',contentLevel:'summary',note:'HR chỉ chia sẻ bản tổng hợp AI để mọi người nắm định hướng phát triển.',sharedAt:'20/04/2026',sharedBy:'hr'}},
    {id:'s9',goal:'Phản hồi ẩn danh nửa đầu năm - Kinh doanh',status:'closed',createdAt:'02/01/2026',due:'20/01/2026',anon:'anon',participants:17,reviewers:4,total:32,done:28,report:'published',resultSharing:{mode:'shared_selected',participantIds:['nam.le','tung.dinh'],audience:'recipient_and_managers',contentLevel:'summary',note:'Kết quả tổng hợp ẩn danh, mong giúp mỗi bạn phát triển.',sharedAt:'22/01/2026',sharedBy:'hr'}},
    {id:'s10',goal:'Đánh giá năng lực lãnh đạo giữa kỳ Q3',status:'closed',createdAt:'12/07/2026',due:'02/08/2026',anon:'named',participants:1,reviewers:5,total:5,done:5,report:'made',includeSelf:true},
    {id:'s11',goal:'Phản hồi khởi động đội ngũ Data',status:'collecting',createdAt:'08/08/2026',due:'22/08/2026',anon:'named',participants:3,reviewers:4,total:12,done:0,report:'none'}
  ];
  const REVIEWERS=[
    {id:'anh.nguyen',name:'Nguyễn Minh Anh',domain:'anh.nguyen',department:'Kinh doanh',team:'Sales',position:'Sales Manager',initials:'MA'},
    {id:'quynh.tran',name:'Trần Ngọc Quỳnh',domain:'quynh.tran',department:'Kinh doanh',team:'Sales Operations',position:'Senior Specialist',initials:'QT'},
    {id:'viet.le',name:'Lê Quốc Việt',domain:'viet.le',department:'Sản phẩm',team:'Growth',position:'Product Manager',initials:'VL'},
    {id:'my.pham',name:'Phạm Thanh Mỹ',domain:'my.pham',department:'Kinh doanh',team:'Key Account',position:'Key Account Manager',initials:'PM'}
  ];
  const PEOPLE=[
    {id:'lan.hoang',name:'Hoàng Thị Lan',domain:'lan.hoang',department:'Kinh doanh',team:'Sales',position:'Senior Sales Executive',initials:'HL',done:1},
    {id:'mai.tran',name:'Trần Thị Mai',domain:'mai.tran',department:'Kinh doanh',team:'Sales',position:'Sales Executive',initials:'TM',done:2},
    {id:'duc.pham',name:'Phạm Minh Đức',domain:'duc.pham',department:'Kinh doanh',team:'Sales',position:'Sales Executive',initials:'PD',done:4},
    {id:'linh.vu',name:'Vũ Thị Linh',domain:'linh.vu',department:'Kinh doanh',team:'Sales',position:'Sales Executive',initials:'VL',done:3},
    {id:'hung.do',name:'Đỗ Gia Hưng',domain:'hung.do',department:'Kinh doanh',team:'Sales Operations',position:'Sales Operations Specialist',initials:'DH',done:0},
    {id:'thu.nguyen',name:'Nguyễn Minh Thư',domain:'thu.nguyen',department:'Kinh doanh',team:'Key Account',position:'Key Account Executive',initials:'NT',done:2},
    {id:'nam.bui',name:'Bùi Hoài Nam',domain:'nam.bui',department:'Kinh doanh',team:'Sales',position:'Sales Executive',initials:'BN',done:4},
    {id:'phuong.le',name:'Lê Phương Thảo',domain:'phuong.le',department:'Kinh doanh',team:'Sales',position:'Sales Executive',initials:'LP',done:1},
    {id:'son.tran',name:'Trần Quốc Sơn',domain:'son.tran',department:'Kinh doanh',team:'Key Account',position:'Key Account Executive',initials:'TS',done:3},
    {id:'an.vo',name:'Võ Hải An',domain:'an.vo',department:'Kinh doanh',team:'Sales Operations',position:'Sales Operations Specialist',initials:'VA',done:0},
    {id:'tu.nguyen',name:'Nguyễn Văn Tú',domain:'tu.nguyen',department:'ITC',team:'Backend',position:'Senior Engineer',initials:'NT',done:4},
    {id:'duc.truong',name:'Trương Minh Đức',domain:'duc.truong',department:'ITC',team:'Platform',position:'SRE Lead',initials:'TĐ',done:4},
    {id:'nam.le',name:'Lê Thành Nam',domain:'nam.le',department:'ITC',team:'Backend',position:'Software Engineer',initials:'LN',done:3},
    {id:'bao.nguyen',name:'Nguyễn Quốc Bảo',domain:'bao.nguyen',department:'ITC',team:'Frontend',position:'Senior Engineer',initials:'NB',done:4},
    {id:'hang.mai',name:'Mai Thị Hằng',domain:'hang.mai',department:'ITC',team:'DevOps',position:'Platform Engineer',initials:'MH',done:2},
    {id:'long.pham',name:'Phạm Thành Long',domain:'long.pham',department:'Data',team:'Analytics',position:'Data Analyst',initials:'PL',done:0},
    {id:'tung.dinh',name:'Đinh Văn Tùng',domain:'tung.dinh',department:'ITC',team:'Backend',position:'Engineering Manager',initials:'ĐT',done:3}
  ];
  const BODIES=[
    'Chủ động lắng nghe và tổng hợp ý kiến rõ ràng, giúp team thống nhất hướng xử lý nhanh hơn.',
    'Có tinh thần đồng đội tốt và luôn theo sát các cam kết khi phối hợp với đối tác.',
    'Cách trao đổi mạch lạc giúp những người liên quan nắm được ưu tiên và bước tiếp theo.',
    'Nên làm rõ thứ tự ưu tiên sớm hơn khi phạm vi công việc có thay đổi.'
  ];
  const QUESTION_SETS={
    s2:[{id:'q1',text:'Đâu là điểm mạnh và một cơ hội phát triển khi phối hợp cùng team?'}],
    s3:[
      {id:'q1',text:'Đâu là điểm mạnh nổi bật của đồng nghiệp khi phối hợp trong dự án Chuyển đổi số?'},
      {id:'q2',text:'Đồng nghiệp đã tạo ảnh hưởng tích cực nào đến tiến độ hoặc chất lượng công việc?'},
      {id:'q3',text:'Một cơ hội phát triển cụ thể nào sẽ giúp đồng nghiệp làm việc hiệu quả hơn?'}
    ],
    s4:[
      {id:'q1',text:'Đồng nghiệp đang thể hiện tiềm năng kế thừa qua những điểm mạnh nào?'},
      {id:'q2',text:'Họ đã chủ động nhận thêm trách nhiệm hoặc dẫn dắt công việc ra sao?'},
      {id:'q3',text:'Khi gặp thay đổi, họ đưa ra quyết định và kết nối các bên như thế nào?'},
      {id:'q4',text:'Năng lực hoặc trải nghiệm nào nên được phát triển để sẵn sàng cho vai trò lớn hơn?'},
      {id:'q5',text:'Một tình huống cụ thể nào cho thấy họ đã xử lý vượt kỳ vọng ở cấp độ hiện tại?'}
    ],
    s10:[
      {id:'q1',type:'rating',ratingScale:5,ratingLabels:{1:'Cần phát triển thêm',5:'Dẫn dắt nổi bật'},text:'Mức độ tạo ảnh hưởng tích cực tới đội ngũ'},
      {id:'q2',type:'open_text',text:'Một hành vi lãnh đạo người nhận nên tiếp tục phát huy là gì?'}
    ],
    s11:[{id:'q1',type:'open_text',text:'Bạn mong người nhận sẽ hỗ trợ đội ngũ Data hiệu quả hơn ở điểm nào?'}]
  };
  const PROGRAM_DONE={
    s3:{'lan.hoang':3,'mai.tran':3,'duc.pham':4,'linh.vu':3,'hung.do':2,'thu.nguyen':3},
    s4:{'lan.hoang':5,'mai.tran':5,'duc.pham':6,'linh.vu':5,'hung.do':6},
    s10:{'lan.hoang':5},
    s11:{'lan.hoang':0,'mai.tran':0,'duc.pham':0}
  };
  const QUESTION_ANSWER_COPY={
    s3:{
      q1:['Chủ động kết nối các bên khi có thay đổi và làm rõ trách nhiệm rất sớm.','Giữ được nhịp phối hợp ổn định giữa business và team kỹ thuật.','Có góc nhìn tổng thể nên nhận ra dependency trước khi ảnh hưởng tiến độ.','Tạo được không khí hợp tác cởi mở trong những buổi xử lý vấn đề.'],
      q2:['Việc tổng hợp rủi ro theo từng mốc giúp cả nhóm chủ động hơn.','Các cập nhật ngắn, rõ giúp quyết định được đưa ra nhanh hơn.','Đã giúp nhóm thống nhất ưu tiên khi phạm vi triển khai thay đổi.','Cách theo sát cam kết giúp hạn chế việc bỏ sót đầu việc liên phòng ban.'],
      q3:['Có thể chia sẻ sớm hơn các phương án đánh đổi khi phát hiện rủi ro.','Nên dành thêm thời gian coaching cách chuẩn bị dữ liệu cho các bạn mới.','Có thể chủ động mời stakeholder phản biện trước các mốc quyết định lớn.','Nên hệ thống hoá những bài học từ dự án để team áp dụng ở các lần sau.']
    },
    s4:{
      q1:['Thể hiện khả năng nhìn toàn cục và kết nối mục tiêu của các nhóm liên quan.','Có tinh thần chịu trách nhiệm, theo sát cam kết đến khi công việc hoàn tất.','Tạo được sự tin cậy nhờ trao đổi rõ ràng và nhất quán.','Biết cân bằng giữa chất lượng đầu ra và tốc độ xử lý công việc.'],
      q2:['Đã chủ động nhận phần việc điều phối khi nhóm cần người kết nối.','Có thể phân rã việc lớn thành các bước rõ để mọi người cùng thực hiện.','Sẵn sàng hỗ trợ đồng nghiệp tháo gỡ vướng mắc thay vì chỉ xử lý phần việc của mình.','Đã dẫn dắt tốt buổi rà soát tiến độ khi có nhiều ưu tiên cạnh tranh.'],
      q3:['Khi có thay đổi, thường nêu rõ dữ kiện và phương án trước khi đề xuất quyết định.','Kết nối các bên kịp thời để giảm hiểu nhầm trong quá trình triển khai.','Biết lắng nghe ý kiến khác chiều và điều chỉnh hướng làm việc phù hợp.','Giữ bình tĩnh, phân định việc cần xử lý ngay và việc cần thêm dữ liệu.'],
      q4:['Nên được trải nghiệm thêm việc dẫn dắt một sáng kiến có phạm vi rộng hơn.','Có thể phát triển thêm năng lực giao quyền và coaching thành viên mới.','Nên được tiếp cận các bài toán hoạch định nguồn lực theo quý.','Có thể rèn thêm kỹ năng trình bày phương án cho cấp quản lý cao hơn.'],
      q5:['Trong đợt cao điểm, đã sắp xếp lại nguồn lực giúp nhóm vẫn kịp mốc quan trọng.','Đã chủ động phát hiện một điểm nghẽn và kết nối đúng người để xử lý nhanh.','Có lúc thay đổi yêu cầu, đã giúp team thống nhất cách làm mà không ảnh hưởng chất lượng.','Đã đứng ra điều phối khi một đầu việc có nguy cơ chậm, giúp nhóm hoàn thành đúng hạn.']
    }
  };
  ['s6','s7','s8','s9'].forEach(id=>{QUESTION_SETS[id]=QUESTION_SETS.s3;QUESTION_ANSWER_COPY[id]=QUESTION_ANSWER_COPY.s3;});
  const BADGES=[['teamwork','customer'],['teamwork'],['excellence'],['innovation','learning']];
  function clone(value){return JSON.parse(JSON.stringify(value));}
  function answerBody(campaignId,question,reviewerIndex){
    const source=QUESTION_ANSWER_COPY[campaignId]&&QUESTION_ANSWER_COPY[campaignId][question.id];
    const questionIndex=Math.max(0,Number(String(question.id).replace(/^q/,''))-1);
    return source?source[reviewerIndex%source.length]:BODIES[(reviewerIndex+questionIndex)%BODIES.length];
  }
  function questionAnswer(campaignId,question,reviewerIndex){
    if(question.type==='rating')return {questionId:question.id,score:Math.min(Number(question.ratingScale)||5,3+reviewerIndex%3)};
    return {questionId:question.id,body:answerBody(campaignId,question,reviewerIndex)};
  }
  function submittedAssignment(person,index,questions,campaignId,reviewer){
    const answers=questions.map(question=>questionAnswer(campaignId,question,index));
    return {id:`${campaignId}:${person.id}:${reviewer.id}`,reviewer:clone(reviewer),status:'submitted',submittedAt:`${String(12-index).padStart(2,'0')}/08/2026`,body:answers.find(answer=>answer.body)?.body||'',answers,badges:BADGES[index%BADGES.length],manualReminderHistory:[],selfAssessment:reviewer.id===person.id};
  }
  function pendingAssignment(person,index,campaignId,reviewer){
    const history=campaignId==='s11'&&person.id==='lan.hoang'&&index===1?['08/08/2026 09:00','10/08/2026 09:00']:person.id==='lan.hoang'&&index===1?['10/08/2026 09:00']:[];
    return {id:`${campaignId}:${person.id}:${reviewer.id}`,reviewer:clone(reviewer),status:'pending',manualReminderHistory:history,selfAssessment:reviewer.id===person.id};
  }
  function participant(person,questions,campaign,done){
    const reviewers=[...REVIEWERS,...(campaign.includeSelf?[person]:[])];
    const assignments=reviewers.map((reviewer,index)=>index<done?submittedAssignment(person,index,questions,campaign.id,reviewer):pendingAssignment(person,index,campaign.id,reviewer));
    return {
      employee:clone(Object.fromEntries(Object.entries(person).filter(([key])=>key!=='done'))),
      assignments,
      aiSummary:done>=2?{
        strengths:['Giao tiếp rõ ràng với stakeholder','Chủ động tổng hợp ý kiến để team ra quyết định'],
        opportunities:['Làm rõ ưu tiên khi phạm vi công việc thay đổi']
      }:null
    };
  }
  function seedPrograms(){return clone(PROGRAMS);}
  function programById(id){return clone(PROGRAMS.find(item=>item.id===id)||null);}
  function detailForProgram(program){
    const campaign=clone(program||PROGRAMS[1]);
    const questions=clone(QUESTION_SETS[campaign.id]||QUESTION_SETS.s2);
    const participants=PEOPLE.map(person=>participant(person,questions,campaign,(PROGRAM_DONE[campaign.id]&&PROGRAM_DONE[campaign.id][person.id])??person.done));
    return {
      campaign,
      question:questions[0].text,
      questions,
      participants:campaign.id==='s2'?participants:participants.slice(0,Math.max(1,Number(campaign.participants)||1))
    };
  }
  return {seedPrograms,programById,detailForProgram};
});
