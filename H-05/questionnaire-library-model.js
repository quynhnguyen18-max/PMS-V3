(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.QuestionnaireLibraryModel=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  const SCOPES=new Set(['personal','all_hr','selected_hr']);

  function unique(values){return [...new Set((values||[]).filter(Boolean))];}

  function normalizeQuestion(question,index){
    const type=question&&question.type==='rating'?'rating':'open_text';
    const normalized={
      id:String(question&&question.id||`q${index+1}`),
      type,
      text:String(question&&question.text||'').trim()
    };
    if(type==='rating'){
      normalized.ratingScale=Math.min(10,Math.max(2,Number(question.ratingScale)||5));
      normalized.ratingLabels={...(question.ratingLabels||{})};
      normalized.detailedRatingLabels=Boolean(question&&question.detailedRatingLabels);
    }
    return normalized;
  }

  function normalize(template,currentUser={}){
    const scope=SCOPES.has(template&&template.scope)?template.scope:'personal';
    const ownerId=String(template&&template.ownerId||currentUser.id||'');
    return {
      id:String(template&&template.id||''),
      name:String(template&&template.name||'').trim(),
      ownerId,
      ownerName:String(template&&template.ownerName||currentUser.name||'').trim(),
      createdAt:String(template&&template.createdAt||''),
      updatedAt:String(template&&template.updatedAt||''),
      scope,
      sharedWithIds:scope==='selected_hr'?unique(template&&template.sharedWithIds):[],
      sourceTemplateId:String(template&&template.sourceTemplateId||''),
      isSystem:Boolean(template&&template.isSystem),
      questions:(template&&template.questions||[]).map(normalizeQuestion)
    };
  }

  function cloneForRequest(template){
    return normalize(template).questions.map((question,index)=>({
      ...question,
      id:`rq${index+1}`,
      ratingLabels:question.type==='rating'?{...question.ratingLabels}:undefined
    }));
  }

  function visibleTo(template,userId){
    const normalized=normalize(template);
    return normalized.isSystem||normalized.ownerId===userId||normalized.scope==='all_hr'||normalized.sharedWithIds.includes(userId);
  }

  function canUse(template,userId){return visibleTo(template,userId);}
  function canEdit(template,userId){const normalized=normalize(template);return !normalized.isSystem&&normalized.ownerId===userId;}
  function canDelete(template,userId){return canEdit(template,userId);}

  function makeCopy(template,currentUser,id){
    const source=normalize(template,currentUser);
    return normalize({
      ...source,
      id,
      name:`Bản sao - ${source.name}`,
      ownerId:currentUser.id,
      ownerName:currentUser.name,
      scope:'personal',
      sharedWithIds:[],
      sourceTemplateId:source.id,
      isSystem:false,
      questions:cloneForRequest(source)
    },currentUser);
  }

  return {normalize,normalizeQuestion,cloneForRequest,visibleTo,canUse,canEdit,canDelete,makeCopy};
});
