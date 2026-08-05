(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.ManagerRequestStorage=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function migrateRequest(request){
    if(!request||typeof request!=='object')return request;
    if(String(request.goal||'').trim())return request;
    return {...request,goal:String(request.question||'').trim()||`Yêu cầu phản hồi ngày ${request.createdAt||''}`.trim()};
  }
  function migrateRequests(requests){return (requests||[]).map(migrateRequest);}
  function save(storage,key,requests){
    try{
      storage.setItem(key,JSON.stringify(requests||[]));
      return true;
    }catch(error){
      return false;
    }
  }
  function load(storage,key,seedFactory){
    try{
      const raw=storage.getItem(key);
      if(raw){
        const parsed=JSON.parse(raw);
        if(Array.isArray(parsed)){
          const migrated=migrateRequests(parsed);save(storage,key,migrated);return migrated;
        }
      }
    }catch(error){
      // Invalid or blocked localStorage falls through to deterministic seed data.
    }
    const seeded=migrateRequests(seedFactory());
    save(storage,key,seeded);
    return seeded;
  }
  return {load,save,migrateRequest,migrateRequests};
});
