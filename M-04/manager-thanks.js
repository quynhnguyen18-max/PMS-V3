/* Quản lý thả tim cảm ơn phản hồi mà nhân viên nhận được và đã chia sẻ với quản lý.
   Mỗi người quản lý (LM, Upper LM, HOD) có một lượt cảm ơn độc lập, vì vậy một phản hồi
   có thể nhận nhiều tim. Tim thuộc về CON NGƯỜI đã thả, không thuộc về vai trò.

   Quy ước hiển thị dùng chung với màn nhân viên E-04:
     • mỗi người thả = một tim riêng trong cụm tim nhỏ ngay sau tên người gửi
     • mọi tim dùng cùng một màu; không mã hoá vai trò bằng màu hay vị trí
     • hover/focus từng tim chỉ hiện domain của chính người đã thả
     • mỗi domain chỉ được thả một tim cho cùng một phản hồi */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.ManagerThanks=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const STORAGE_KEY='pms.m04.thanks';
  const HEART='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  function escapeAttr(value){
    return String(value==null?'':value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function personOf(value){
    const person=value||{};
    const dom=String(person.dom||person.login||'').trim();
    return dom?{name:String(person.name||'').trim(),dom}:null;
  }
  function uniquePeople(values){
    const seen=new Set();
    return (Array.isArray(values)?values:[]).map(personOf).filter(person=>{
      if(!person||seen.has(person.dom))return false;
      seen.add(person.dom);return true;
    });
  }

  /* ── Trạng thái cảm ơn ────────────────────────────────────────────────
     Schema mới: {feedbackId:[{name,dom}, ...]}. Bản cũ lưu ['feedbackId']; các id cũ
     vẫn được nhận diện là tim của người đang xem, rồi tự nâng cấp khi có lần ghi kế tiếp. */
  function createStore(storage,key){
    const storageKey=key||STORAGE_KEY;
    let reactions=new Map(),legacyIds=new Set();
    try{
      const parsed=JSON.parse(storage.getItem(storageKey));
      if(Array.isArray(parsed))legacyIds=new Set(parsed.filter(id=>typeof id==='string'));
      else if(parsed&&typeof parsed==='object')Object.entries(parsed).forEach(([id,people])=>{
        const clean=uniquePeople(people);
        if(id&&clean.length)reactions.set(id,clean);
      });
    }catch(error){
      // localStorage hỏng hoặc bị chặn — bắt đầu lại từ trạng thái rỗng.
    }
    function people(id,viewer){
      const legacy=legacyIds.has(id)?personOf(viewer||VIEWER):null;
      if(legacy){
        reactions.set(id,uniquePeople([...(reactions.get(id)||[]),legacy]));
        legacyIds.delete(id);persist();
      }
      return uniquePeople(reactions.get(id)||[]);
    }
    function persist(){
      try{
        const value={};
        reactions.forEach((list,id)=>{if(list.length)value[id]=list;});
        storage.setItem(storageKey,JSON.stringify(value));return true;
      }catch(error){return false;}
    }
    return {
      has(id,person){const target=personOf(person||VIEWER);return !!target&&people(id,target).some(item=>item.dom===target.dom);},
      add(id,person){
        const target=personOf(person||VIEWER);
        if(!id||!target||this.has(id,target))return false;
        reactions.set(id,uniquePeople([...people(id,target),target]));legacyIds.delete(id);persist();return true;
      },
      remove(id,person){
        const target=personOf(person||VIEWER);
        if(!id||!target)return false;
        const current=people(id,target),next=current.filter(item=>item.dom!==target.dom);
        if(next.length===current.length)return false;
        if(next.length)reactions.set(id,next);else reactions.delete(id);
        legacyIds.delete(id);persist();return true;
      },
      people,
      ids(person){const target=personOf(person||VIEWER);return [...new Set([...reactions.keys(),...legacyIds])].filter(id=>target&&people(id,target).some(item=>item.dom===target.dom));},
      clear(){reactions=new Map();legacyIds=new Set();persist();}
    };
  }

  /* ── Hình dấu tim ────────────────────────────────────────────────────── */
  function heartHTML(){
    return `<svg viewBox="1 2 22 20.5" aria-hidden="true"><path class="h-thanker" d="${HEART}"/></svg>`;
  }
  /* Tooltip chỉ trả domain; không đổi thành "Bạn", không thêm tên hay chức danh. */
  function thankerLabel(person){
    const clean=personOf(person);
    return {who:clean?clean.dom:'',role:''};
  }
  function peopleMarkHTML(people,pop){
    const clean=uniquePeople(people);
    if(!clean.length)return '';
    const hearts=clean.map(person=>{
      const domain=escapeAttr(person.dom);
      return `<span class="thx-heart" tabindex="0" data-thx-domain="${domain}" aria-label="${domain}">${heartHTML()}`
        +`<span class="thx-tip" role="tooltip">${domain}</span></span>`;
    }).join('');
    return `<span class="thx-mark${pop?' pop':''}">${hearts}</span>`;
  }
  /* state = {receiver, managers, manager}; options.receiverDomain là domain nhân viên nhận. */
  function markHTML(state,senderName,pop,options){
    const opts=options||{},people=[];
    if(state&&state.receiver&&opts.receiverDomain)people.push({dom:opts.receiverDomain});
    if(state&&Array.isArray(state.managers))people.push(...state.managers);
    return peopleMarkHTML(people,pop);
  }
  function barHTML(id,senderName){
    if(!id)return '';
    return `<div class="fb-thx-bar">`
      +`<button type="button" class="fb-thx" data-thx-id="${escapeAttr(id)}" data-thx-sender="${escapeAttr(senderName||'')}"`
      +` onclick="thankFeedback('${escapeAttr(id)}',this)"><i class="bx bx-heart"></i> Cảm ơn</button>`
      +`<span class="fb-thx-hint">Gửi tim tim để cảm ơn người cho phản hồi nhé</span></div>`;
  }

  /* ── Hành vi trên trình duyệt ─────────────────────────────────────────── */
  let ACTIVE=null,VIEWER=null;
  function use(store){ACTIVE=store||null;return ACTIVE;}
  function active(){return ACTIVE;}
  function setViewer(person){VIEWER=personOf(person);return VIEWER;}
  function viewer(){return VIEWER;}
  function seededManagers(item){
    if(!item)return [];
    if(Array.isArray(item.thankedByManagers))return uniquePeople(item.thankedByManagers);
    return uniquePeople(item.thankedByManager?[item.thankedByManager]:[]);
  }
  function stateFor(item){
    const local=ACTIVE&&item?ACTIVE.people(item.id,VIEWER):[];
    const managers=uniquePeople([...seededManagers(item),...local]);
    const mine=!!(VIEWER&&managers.some(person=>person.dom===VIEWER.dom));
    return {receiver:!!(item&&item.thankedByReceiver),managers,manager:mine};
  }
  /* Mỗi quản lý chỉ bị chặn bởi tim của chính domain đó; tim của người khác không chặn. */
  function canThank(state){return !!state&&!!VIEWER&&!state.manager;}
  function flyHearts(anchor){
    if(typeof document==='undefined'||!anchor)return;
    if(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const box=anchor.getBoundingClientRect();
    for(let index=0;index<5;index+=1){
      const heart=document.createElement('div');
      heart.className='thx-fly';
      heart.innerHTML='<i class="bx bxs-heart"></i>';
      heart.style.left=`${box.left+box.width/2}px`;
      heart.style.top=`${box.top}px`;
      heart.style.setProperty('--dx',`${((Math.random()-0.5)*70).toFixed(0)}px`);
      heart.style.animationDelay=`${index*70}ms`;
      heart.style.fontSize=`${(12+Math.random()*9).toFixed(0)}px`;
      document.body.appendChild(heart);
      setTimeout(()=>heart.remove(),1400+index*70);
    }
  }
  function thank(id,button){
    if(!ACTIVE||!VIEWER||!id||ACTIVE.has(id,VIEWER))return null;
    ACTIVE.add(id,VIEWER);
    const senderName=(button&&button.dataset&&button.dataset.thxSender)||'';
    if(!button||!button.closest)return senderName||'người đã phản hồi';
    const card=button.closest('.feedback-card'),bar=button.closest('.fb-thx-bar');
    const slow=typeof matchMedia!=='function'||!matchMedia('(prefers-reduced-motion: reduce)').matches;
    button.disabled=true;button.classList.add('pop');
    if(slow)flyHearts(button);
    setTimeout(()=>{
      if(bar){bar.style.height=`${bar.offsetHeight}px`;requestAnimationFrame(()=>bar.classList.add('gone'));}
      const line=card&&card.querySelector('.fb-line');
      if(line){
        const existing=line.querySelector('.thx-mark');
        const people=existing?[...existing.querySelectorAll('[data-thx-domain]')].map(node=>({dom:node.dataset.thxDomain})):[];
        const html=peopleMarkHTML([...people,VIEWER],true);
        if(existing)existing.outerHTML=html;else line.insertAdjacentHTML('beforeend',html);
      }
      setTimeout(()=>{if(bar)bar.remove();},slow?400:0);
    },slow?420:0);
    return senderName||'người đã phản hồi';
  }

  return {STORAGE_KEY,createStore,markHTML,peopleMarkHTML,barHTML,heartHTML,thankerLabel,
    use,active,setViewer,viewer,stateFor,canThank,thank,flyHearts};
});
