(function(root, factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  root.RequestQuestionAI=api;
})(typeof globalThis!=='undefined' ? globalThis : this, function(){
  function clean(question){
    return String(question||'').trim().replace(/\s+/g,' ').replace(/[?!.]+$/,'');
  }

  function improve(question, runCount){
    const source=clean(question);
    if(!source) return '';
    const lower=source.charAt(0).toLocaleLowerCase('vi-VN')+source.slice(1);
    if(Number(runCount||0)%2===1){
      return `Từ những gì bạn đã quan sát, ${lower}? Điều gì đang làm tốt, điều gì có thể cải thiện và bạn có thể chia sẻ một ví dụ cụ thể không?`;
    }
    return `${source}? Bạn có thể chia sẻ một ví dụ cụ thể, điều đang làm tốt và một điểm có thể cải thiện không?`;
  }

  return {improve};
});
