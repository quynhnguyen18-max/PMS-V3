(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.QuestionnaireLibraryModel=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  const SCOPES=new Set(['personal','all_hr','selected_hr']);
  const ROLES=new Set(['HRBP','L&OD']);

  /* Bộ câu hỏi được nhóm theo nhóm người tạo, nên owner phải mang vai trò HR. */
  function ownerRoleOf(template,currentUser){
    const declared=template&&template.ownerRole;
    if(ROLES.has(declared))return declared;
    const ownerId=String(template&&template.ownerId||'');
    if(ownerId&&ownerId===String(currentUser&&currentUser.id||'')&&ROLES.has(currentUser&&currentUser.role))return currentUser.role;
    return /^lod/i.test(ownerId)?'L&OD':'HRBP';
  }

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

  const QUESTION_TYPE_LABELS={open_text:'Câu hỏi mở',rating:'Câu hỏi Likert'};

  /* Một thay đổi có thể kèm nội dung trước/sau để đọc được ngay trong history log.
     Bản ghi cũ chỉ có chuỗi mô tả nên vẫn phải nhận dạng chuỗi. */
  function normalizeChange(change){
    if(typeof change==='string')return {label:change.trim(),before:'',after:''};
    return {
      label:String(change&&change.label||'').trim(),
      before:String(change&&change.before||'').trim(),
      after:String(change&&change.after||'').trim()
    };
  }

  function normalizeHistoryEntry(entry,index){
    return {
      version:Number(entry&&entry.version)||index+1,
      at:String(entry&&entry.at||''),
      byId:String(entry&&entry.byId||''),
      byName:String(entry&&entry.byName||'').trim(),
      byDomain:String(entry&&entry.byDomain||'').trim(),
      changes:(entry&&entry.changes||[]).map(normalizeChange).filter(change=>change.label)
    };
  }

  function normalizeHistory(history){
    return (history||[]).map(normalizeHistoryEntry).sort((a,b)=>a.version-b.version);
  }

  function normalize(template,currentUser={}){
    const scope=SCOPES.has(template&&template.scope)?template.scope:'personal';
    const ownerId=String(template&&template.ownerId||currentUser.id||'');
    return {
      id:String(template&&template.id||''),
      name:String(template&&template.name||'').trim(),
      ownerId,
      ownerName:String(template&&template.ownerName||currentUser.name||'').trim(),
      ownerDomain:String(template&&template.ownerDomain||(ownerId===currentUser.id?currentUser.domain:'')||'').trim(),
      ownerRole:ownerRoleOf(template,currentUser),
      createdAt:String(template&&template.createdAt||''),
      updatedAt:String(template&&template.updatedAt||''),
      scope,
      sharedWithIds:scope==='selected_hr'?unique(template&&template.sharedWithIds):[],
      sourceTemplateId:String(template&&template.sourceTemplateId||''),
      isSystem:Boolean(template&&template.isSystem),
      questions:(template&&template.questions||[]).map(normalizeQuestion),
      history:normalizeHistory(template&&template.history)
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

  const SCOPE_LABELS={personal:'Chỉ người tạo',all_hr:'Nhóm HRBP và L&OD',selected_hr:'HR được chọn'};
  function scopeText(template){
    const normalized=normalize(template);
    if(normalized.scope==='selected_hr')return `${SCOPE_LABELS.selected_hr} (${normalized.sharedWithIds.length})`;
    return SCOPE_LABELS[normalized.scope];
  }

  /* So sánh hai phiên bản để sinh dòng mô tả thay đổi cho history log. */
  function diffTemplates(previous,next){
    const before=normalize(previous),after=normalize(next),changes=[];
    if(before.name!==after.name)changes.push({label:'Đổi tên bộ câu hỏi',before:before.name,after:after.name});
    const beforeQuestions=before.questions,afterQuestions=after.questions;
    const shared=Math.min(beforeQuestions.length,afterQuestions.length);
    for(let index=0;index<shared;index++){
      if(beforeQuestions[index].text!==afterQuestions[index].text)changes.push({label:`Sửa nội dung Câu hỏi ${index+1}`,before:beforeQuestions[index].text,after:afterQuestions[index].text});
      else if(beforeQuestions[index].type!==afterQuestions[index].type)changes.push({label:`Đổi loại Câu hỏi ${index+1}`,before:QUESTION_TYPE_LABELS[beforeQuestions[index].type],after:QUESTION_TYPE_LABELS[afterQuestions[index].type]});
    }
    for(let index=shared;index<afterQuestions.length;index++)changes.push({label:`Thêm Câu hỏi ${index+1}`,after:afterQuestions[index].text});
    for(let index=shared;index<beforeQuestions.length;index++)changes.push({label:`Xóa Câu hỏi ${index+1}`,before:beforeQuestions[index].text});
    return changes.map(normalizeChange);
  }

  function appendVersion(template,entry){
    const normalized=normalize(template);
    const changes=(entry&&entry.changes||[]).map(normalizeChange).filter(change=>change.label);
    if(!changes.length)return normalized;
    const version=normalized.history.length?normalized.history[normalized.history.length-1].version+1:1;
    normalized.history=[...normalized.history,normalizeHistoryEntry({...entry,version,changes})];
    return normalized;
  }

  function makeCopy(template,currentUser,id,at=''){
    const source=normalize(template,currentUser);
    return normalize({
      ...source,
      id,
      name:`Bản sao - ${source.name}`,
      ownerId:currentUser.id,
      ownerName:currentUser.name,
      ownerDomain:currentUser.domain||'',
      ownerRole:currentUser.role||'HRBP',
      createdAt:at||source.createdAt,
      updatedAt:at||source.createdAt,
      scope:'personal',
      sharedWithIds:[],
      sourceTemplateId:source.id,
      isSystem:false,
      questions:cloneForRequest(source),
      history:[{version:1,at:at||source.createdAt,byId:currentUser.id,byName:currentUser.name,byDomain:currentUser.domain||'',changes:[{label:`Tạo bản sao từ “${source.name}” của ${source.ownerName}`}]}]
    },currentUser);
  }

  return {normalize,normalizeQuestion,normalizeChange,ownerRoleOf,normalizeHistoryEntry,cloneForRequest,visibleTo,canUse,canEdit,canDelete,makeCopy,scopeText,diffTemplates,appendVersion};
});
