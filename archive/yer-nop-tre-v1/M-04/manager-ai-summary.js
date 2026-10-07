(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.ManagerAiSummary=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function dateKey(value){
    const [day,month,year]=String(value||'').split('/');
    return `${year||''}${month||''}${day||''}`;
  }
  function latestDate(feedback){
    return feedback.map(item=>item.date||'').sort((a,b)=>dateKey(b).localeCompare(dateKey(a)))[0]||'';
  }
  function create(employee,feedback){
    const responses=Array.isArray(feedback)?feedback.filter(Boolean):[],responseCount=responses.length,updatedAt=latestDate(responses);
    if(responseCount<2)return {available:false,responseCount,updatedAt,strengths:[],opportunities:[]};
    const name=employee?.name||'Nhân viên';
    return {
      available:true,
      responseCount,
      updatedAt,
      strengths:[`${name} được ghi nhận về khả năng phối hợp chủ động và theo sát cam kết.`,`Cách trao đổi rõ ràng giúp đồng nghiệp nắm bắt vấn đề và phối hợp hiệu quả hơn.`],
      opportunities:responseCount>=3?[`Chủ động chia sẻ bối cảnh và rủi ro sớm hơn để các bên liên quan có thêm thời gian chuẩn bị.`]:[`Tiếp tục thu thập thêm góc nhìn để xác định cơ hội phát triển có tính lặp lại.`]
    };
  }
  return {create};
});
