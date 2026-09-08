/* Quản lý thả tim cảm ơn phản hồi mà nhân viên của mình nhận được.
   Chỉ áp cho phản hồi đã chia sẻ tới cấp quản lý — M-04 vốn chỉ hiển thị đúng nhóm đó
   (ManagerFeedbackData.feedbackFor lọc visibility==='manager'), nên mọi card ở đây đều thả tim được.

   Quy ước hiển thị thống nhất với màn nhân viên E-04:
     • dấu tim nằm ngay sau tên người gửi trên dòng đầu card, không chiếm dòng riêng
     • một tim = một người cảm ơn, hai tim chồng lệch = cả hai
     • tim của người nhận phản hồi dùng hồng MoMo #A50064, tim của quản lý dùng hồng +1 #F95396
     • rê chuột ra MỘT ô liệt kê ai đã cảm ơn, không hiện thời gian */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.ManagerThanks=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const STORAGE_KEY='pms.m04.thanks';
  /* một path trái tim duy nhất, hai biến thể chỉ khác cách xếp */
  const HEART='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
  const FRONT='translate(0,3) scale(0.78)',BACK='translate(9.5,0) scale(0.78)';

  function escapeAttr(value){
    return String(value==null?'':value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── Trạng thái: quản lý đã thả tim cho những phản hồi nào ────────────────
     Lưu ở localStorage nên tim còn nguyên khi mở lại trang, và dùng chung
     giữa M-04/index.html với M-04/feedback-detail.html. */
  function createStore(storage,key){
    const storageKey=key||STORAGE_KEY;
    let ids=new Set();
    try{
      const parsed=JSON.parse(storage.getItem(storageKey));
      if(Array.isArray(parsed))ids=new Set(parsed.filter(id=>typeof id==='string'));
    }catch(error){
      // localStorage hỏng hoặc bị chặn — bắt đầu lại từ trạng thái rỗng.
    }
    function persist(){
      try{storage.setItem(storageKey,JSON.stringify([...ids]));return true;}
      catch(error){return false;}
    }
    return {
      has(id){return ids.has(id);},
      add(id){if(!id||ids.has(id))return false;ids.add(id);persist();return true;},
      remove(id){if(!ids.delete(id))return false;persist();return true;},
      ids(){return [...ids];},
      clear(){ids=new Set();persist();}
    };
  }

  /* ── Hình dấu tim ────────────────────────────────────────────────────── */
  function heartHTML(who){
    return `<svg viewBox="1 2 22 20.5" aria-hidden="true"><path class="h-${who}" d="${HEART}"/></svg>`;
  }
  /* Hai tim chồng lệch: tim quản lý (hồng nhạt) nhô ra sau, tim người nhận (hồng đậm) nằm trước,
     tách nhau bằng một viền trắng mảnh. */
  function pairHTML(){
    return `<svg viewBox="0 1 27.5 20.5" aria-hidden="true">`
      +`<path class="h-mgr" d="${HEART}" transform="${BACK}"/>`
      +`<path class="h-cut" d="${HEART}" transform="${FRONT}"/>`
      +`<path class="h-rcv" d="${HEART}" transform="${FRONT}"/></svg>`;
  }
  function tipRow(kind,label,role){
    return `<span class="thx-tip-row ${kind}"><span class="thx-tip-dot"></span><span>${label}${role?` <em>- ${role}</em>`:''}</span></span>`;
  }
  /* state = {receiver:boolean, manager:boolean} — "manager" là chính người đang xem màn M-04.
     senderName = người đã cho phản hồi; luôn nêu tên họ trong ô chú thích, cùng cấu trúc
     "… đã cảm ơn <người cho phản hồi>" mà màn nhân viên E-04 đang dùng. */
  function markHTML(state,senderName,pop){
    const receiver=!!(state&&state.receiver),manager=!!(state&&state.manager);
    if(!receiver&&!manager)return '';
    const who=escapeAttr(senderName||'người đã phản hồi');
    const both=receiver&&manager;
    const art=both?pairHTML():heartHTML(receiver?'rcv':'mgr');
    const tip=both
      ? `<span class="thx-tip"><span class="thx-tip-title">Đã cảm ơn ${who}</span>`
        +tipRow('rcv','Nhân viên','người nhận phản hồi')
        +tipRow('mgr','Bạn','quản lý trực tiếp')+`</span>`
      : `<span class="thx-tip">`
        +tipRow(receiver?'rcv':'mgr',`${receiver?'Nhân viên':'Bạn'} đã cảm ơn ${who}`,'')
        +`</span>`;
    return `<span class="thx-mark${pop?' pop':''}" tabindex="0">${art}${tip}</span>`;
  }
  /* Thanh cảm ơn ở chân card — GIỮ ĐÚNG cách màn nhân viên E-04 làm:
     đường kẻ đứt ngăn với nội dung, nút pill "Cảm ơn" và một dòng gợi ý bên cạnh.
     Bấm xong thanh thu lại rồi biến mất hẳn, chỉ để lại dấu tim trên dòng tên. */
  function barHTML(id,senderName){
    if(!id)return '';
    return `<div class="fb-thx-bar">`
      +`<button type="button" class="fb-thx" data-thx-id="${escapeAttr(id)}" data-thx-sender="${escapeAttr(senderName||'')}"`
      +` onclick="thankFeedback('${escapeAttr(id)}',this)"><i class="bx bx-heart"></i> Cảm ơn</button>`
      +`<span class="fb-thx-hint">Gửi tim tim để cảm ơn người cho phản hồi nhé</span></div>`;
  }

  /* ── Hành vi trên trình duyệt ─────────────────────────────────────────── */
  let ACTIVE=null;
  function use(store){ACTIVE=store||null;return ACTIVE;}
  function active(){return ACTIVE;}
  function stateFor(item){
    return {receiver:!!(item&&item.thankedByReceiver),manager:!!(ACTIVE&&item&&ACTIVE.has(item.id))};
  }
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
  /* Thả tim: ghi trạng thái, thanh cảm ơn thu lại và biến mất, dấu tim hiện trên dòng tên.
     Nhịp và hiệu ứng lấy đúng theo thankFb() của màn nhân viên E-04.
     Cập nhật tại chỗ thay vì render lại cả danh sách để giữ vị trí cuộn và hiệu ứng.
     Trả về tên người gửi để trang gọi tự hiện toast bằng cơ chế toast của riêng nó. */
  function thank(id,button){
    if(!ACTIVE||!id||ACTIVE.has(id))return null;
    ACTIVE.add(id);
    const senderName=(button&&button.dataset&&button.dataset.thxSender)||'';
    if(!button||!button.closest)return senderName||'người đã phản hồi';
    const card=button.closest('.feedback-card'),bar=button.closest('.fb-thx-bar');
    const slow=typeof matchMedia!=='function'||!matchMedia('(prefers-reduced-motion: reduce)').matches;
    button.disabled=true;
    button.classList.add('pop');
    if(slow)flyHearts(button);
    setTimeout(()=>{
      if(bar){bar.style.height=`${bar.offsetHeight}px`;requestAnimationFrame(()=>bar.classList.add('gone'));}
      const line=card&&card.querySelector('.fb-line');
      if(line){
        /* Nhân viên đã cảm ơn từ trước thì trên dòng đã có sẵn một tim —
           thay hẳn dấu cũ bằng dấu hai tim, chứ không bỏ qua. */
        const html=markHTML({receiver:card.dataset.thxReceiver==='1',manager:true},senderName,true);
        const existing=line.querySelector('.thx-mark');
        if(existing)existing.outerHTML=html; else line.insertAdjacentHTML('beforeend',html);
      }
      setTimeout(()=>{if(bar)bar.remove();},slow?400:0);
    },slow?420:0);
    return senderName||'người đã phản hồi';
  }

  return {STORAGE_KEY,createStore,markHTML,barHTML,heartHTML,pairHTML,use,active,stateFor,thank,flyHearts};
});
