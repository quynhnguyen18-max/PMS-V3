/* ═══════════════════════════════════════════════════════════════════════════
   SÂN KHẤU MONI KỂ CHUYỆN — phương án 3 của "Dấu ấn của bạn"
   Moni là bạn đồng hành dẫn chuyện (chị chốt 11/10/2026):
     lời chào (Moni đi vào, thổi bong bóng) → 6 màn metric kể liền một mạch
     (Moni nói từng câu trong bong bóng thoại, hình minh hoạ hiện sau) →
     lời cảm ơn (Moni cười e thẹn, tim bay) → poster có Moni.
   Người dùng chỉ bấm Tiếp / Quay lại. Tải được từng màn metric và poster.

   Số liệu lấy từ window.DauAn (dau-an-model.js), file này chỉ dựng giao diện.
   Trang nạp: moni-stage.css, dau-an-model.js, moni-stage.js, rồi gọi openMoni().
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
const D=window.DauAn, U=D.USER, H=D.highlights();
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CV_DIR='../Core%20value%20with%20BG/';

/* ═══ Tư thế Moni (assets/mascot/): 9 biểu cảm ═══
   walk: đi, thổi bong bóng   run: hăng hái, nắm tay   wave: vẫy tay cười
   cheer: cười lớn, giơ nắm tay   wink: nháy mắt, lè lưỡi   think: suy nghĩ
   idle: đứng mỉm cười   heart: ôm trái tim   shy: cười e thẹn, tim bay */
const M='../assets/mascot/';
const POSE={walk:'walk-bubble.png',run:'run.png',wave:'wave.png',cheer:'cheer.png',wink:'wink.png',
            think:'think.png',idle:'idle.png',heart:'heart.png',shy:'shy-love.png'};
/* Dựng sẵn mọi tư thế của màn (không trùng), chỉ tư thế đầu hiện; đổi bằng setPose. */
function moniHTML(poses,cls=''){
  return `<div class="mni-moni ${cls}"><div class="body">${[...new Set(poses)].map((p,k)=>
    `<img data-pose="${p}" class="${k===0?'on':''}" src="${M}${POSE[p]}" alt=""/>`).join('')}</div></div>`;
}

/* ═══ Màu từng màn: nền pastel + màu nhấn (ngoại lệ DS trong .mni-stage) ═══ */
const TONE={
  welcome:{bg1:'#FFF0F7',bg2:'#F3E8FF',acc:'#A50064',acc2:'#F64F9E'},
  total:  {bg1:'#FFE4F0',bg2:'#FFF7D6',acc:'#A50064',acc2:'#F64F9E'},
  connect:{bg1:'#FFF7D6',bg2:'#FFE4F0',acc:'#B45F00',acc2:'#FFC219'},
  values: {bg1:'#F3E8FF',bg2:'#E0F2FE',acc:'#6D28D9',acc2:'#A78BFA'},
  strengths:{bg1:'#E0F2FE',bg2:'#F3E8FF',acc:'#1D4ED8',acc2:'#60A5FA'},
  given:  {bg1:'#DCFCE7',bg2:'#E0F2FE',acc:'#0F766E',acc2:'#34D399'},
  hearts: {bg1:'#FFE4F0',bg2:'#FCE7F3',acc:'#BE185D',acc2:'#F64F9E'},
  thanks: {bg1:'#FFF0F7',bg2:'#FFE4F0',acc:'#A50064',acc2:'#F64F9E'},
  poster: {bg1:'#FAFAFA',bg2:'#F4F4F5',acc:'#A50064',acc2:'#F64F9E'}
};
const AV_COLORS=['#F64F9E','#7C3AED','#2563EB'];
const NOTE_COLORS=['#FFF3B0','#FFD6E8','#D7F5E8'];

/* ═══ 6 màn metric: lời Moni + hình minh hoạ ═══
   poses: một tư thế cho mỗi câu Moni nói, tư thế cuối là lúc hình minh hoạ
   hiện ra. Mỗi màn 3 biểu cảm, cả hành trình dùng đủ 9 tư thế (góp ý 11/10/2026). */
const heroes=H.values.filter(v=>v.n===(H.values[0]||{}).n).map(v=>v.name);
const stat=(n,l,bg)=>`<div class="mni-stat pop" style="background:${bg}"><div class="n" data-count="${n}">${n}</div><div class="l">${esc(l)}</div></div>`;
const METRICS=[
  { id:'total', kick:'Phản hồi đã nhận', poses:['wave','idle','cheer'],
    lines:[`Năm vừa qua, ${esc(U.short)} đã nhận được <b>${H.total} phản hồi</b> từ <b>${H.people} đồng nghiệp</b>.`,
           'Mỗi phản hồi là một góc nhìn giúp bạn hiểu mình rõ hơn đó!'],
    vis:()=>`<div class="mni-stats">${stat(H.total,'phản hồi đã nhận','#F64F9E')}${stat(H.people,'đồng nghiệp đã gửi','#A50064')}</div>
      <div class="mni-envs">${Array.from({length:H.total},(_,k)=>`<i class="bx bxs-envelope pop" style="animation-delay:${(.4+k*.07).toFixed(2)}s"></i>`).join('')}</div>` },
  { id:'connect', kick:'Kết nối đáng nhớ', poses:['think','wink','run'],
    lines:['Bạn có biết những người cho bạn nhiều phản hồi nhất là ai không?',
           'Moni bật mí nhé, chính là ba người này!'],
    vis:()=>`<div class="mni-people">${H.connect.map((n,k)=>`<div class="mni-person pop" style="animation-delay:${(k*.18).toFixed(2)}s">
      <span class="rk">${k+1}</span><div class="av" style="background:${AV_COLORS[k%3]}">${esc(initials(n))}</div><div class="nm">${esc(n)}</div></div>`).join('')}</div>` },
  { id:'values', kick:'Dấu ấn bạn để lại', poses:['idle','cheer','wink'],
    lines:[`Khi nhắc về ${esc(U.short)}, đồng nghiệp thấy rõ nhất những giá trị này.`,
           `<b>${heroes.map(esc).join('</b> và <b>')}</b> cùng dẫn đầu với ${(H.values[0]||{}).n||0} lượt ghi nhận!`],
    vis:()=>{const max=(H.values[0]||{}).n||1;
      return `<div class="mni-bars">${H.values.map((v,k)=>`<div class="mni-bar pop" style="animation-delay:${(k*.12).toFixed(2)}s">
        <img src="${CV_DIR}${v.art}" alt=""/><div class="tr"><div class="nm"><span>${esc(v.name)}</span><b>${v.n} lượt</b></div>
        <div class="bg"><div class="fill" style="--fw:${Math.round(v.n/max*100)}%"></div></div></div></div>`).join('')}</div>`;} },
  { id:'strengths', kick:'Điều mọi người trân trọng', poses:['think','idle','cheer'],
    lines:['Còn đây là những điều mọi người trân trọng ở bạn.',
           'Moni nghĩ đó là siêu năng lực của bạn đấy!'],
    vis:()=>`<div class="mni-notes">${H.strengths.map((s,k)=>`<div class="mni-note pop" style="background:${NOTE_COLORS[k%3]};--r:${[-3,2,-2][k%3]}deg;animation-delay:${(k*.2).toFixed(2)}s">${esc(s)}</div>`).join('')}</div>` },
  { id:'given', kick:'Phản hồi bạn trao đi', poses:['walk','run','wave'], fly:'plane',
    lines:[`Không chỉ nhận đâu, ${esc(U.short)} còn trao đi nữa!`,
           'Mỗi phản hồi bạn viết là một món quà giúp đồng nghiệp thấy điều họ chưa thấy.'],
    vis:()=>`<div class="mni-stats">${stat(H.given.total,'phản hồi đã trao đi','#0F766E')}${stat(H.given.people,'đồng nghiệp đã nhận','#2563EB')}</div>` },
  { id:'hearts', kick:'Những trái tim cảm ơn', poses:['wink','cheer','heart'], fly:'heart',
    lines:['Và đây là những trái tim cảm ơn đã đi qua đi lại giữa bạn và đồng nghiệp.',
           'Cảm ơn qua lại là cách văn hóa phản hồi trở nên ấm áp mỗi ngày.'],
    vis:()=>`<div class="mni-stats">${stat(H.hearts.received,'tim cảm ơn nhận được','#F64F9E')}${stat(H.hearts.given,'tim bạn đã trao đi','#BE185D')}</div>` }
];
const N=METRICS.length;
function initials(name){return String(name||'').trim().split(/\s+/).slice(-2).map(p=>p.charAt(0)).join('').toUpperCase();}

function flyHTML(kind){
  if(!kind)return '';
  if(kind==='plane')return `<div class="mni-fly plane">${[0,1,2].map(k=>`<i class="bx bxs-paper-plane" style="--y:${30+k*22}%;--d:${5+k}s;--dl:${k*1.6}s;--c:#0F766E;--s:${20+k*4}px"></i>`).join('')}</div>`;
  return `<div class="mni-fly">${Array.from({length:12},(_,k)=>`<i class="bx bxs-heart" style="left:${5+k*8}%;--d:${4+(k%4)}s;--dl:${(k*.45).toFixed(2)}s;--x:${(k%2?1:-1)*(20+k*3)}px;--s:${16+(k%3)*6}px;--c:${['#F64F9E','#A50064','#FDA4CF'][k%3]}"></i>`).join('')}</div>`;
}

/* ═══ Dựng từng màn ═══ */
function metricHTML(m){
  return `${flyHTML(m.fly)}<div class="mni-row">
    ${moniHTML(m.poses)}
    <div class="mni-col">
      <div class="mni-kick">${esc(m.kick)}</div>
      <div class="mni-bubble tail-l">${m.lines.map(l=>`<p>${l}</p>`).join('')}</div>
      <div class="mni-vis">${m.vis()}</div>
    </div></div>`;
}
function welcomeHTML(){
  return `<div class="mni-center">
    <div class="mni-bubble tail-b" data-late><p class="hello">Chào ${esc(U.short)}!</p>
      <p>Hãy cùng khám phá những món quà bạn đã nhận và đã trao trong năm ${U.year} cùng Moni nhé.</p></div>
    <button class="mni-cta" data-late onclick="moniGo(0)">Bắt đầu cùng Moni <i class="bx bx-right-arrow-alt"></i></button>
    ${moniHTML(['walk','wave'],'walk')}
  </div>`;
}
function thanksHTML(){
  return `${flyHTML('heart')}<div class="mni-center">
    <div class="mni-bubble tail-b"><p class="hello">Cảm ơn ${esc(U.short)}!</p>
      <p>Thật tuyệt khi được đồng hành cùng ${esc(U.short)} tới đây.</p>
      <p>Cảm ơn bạn đã lắng nghe cởi mở và trao đi những lời chân thành, góp phần làm văn hóa phản hồi ở MoMo thêm ấm áp.</p>
      <p>Chúc bạn tiếp tục học hỏi, lan tỏa và tỏa sáng theo cách của riêng mình!</p></div>
    ${moniHTML(['shy'])}
  </div>`;
}
/* Poster: cùng khung nội dung 3 phần đã chốt ở phương án 2, trình bày theo kiểu Moni. */
function posterHTML(){
  const max=(H.values[0]||{}).n||0;
  const st=(n,l,bg)=>`<div class="mp-stat" style="background:${bg}"><div class="n">${n}</div><div class="l">${esc(l)}</div></div>`;
  return `<div class="mni-poster">
    <div class="mp-hd">
      <img src="${M}wave.png" alt=""/>
      <div><div class="mp-brand"><span class="mni-logo"><span>M</span></span>MoMo HRM</div>
        <div class="mp-ttl">Dấu ấn của ${esc(U.short)}</div>
        <div class="mp-who">Năm ${U.year} - ${H.total} phản hồi từ ${H.people} đồng nghiệp</div></div>
    </div>
    <section class="mp-sec">
      <span class="mp-kick" style="background:#7C3AED">Bạn trong mắt đồng nghiệp</span>
      <div class="mp-sub">Giá trị được ghi nhận</div>
      <div class="mp-vals">${H.values.map(v=>`<div class="mp-val${v.n===max?' top':''}"><img src="${CV_DIR}${v.art}" alt=""/><span class="nm">${esc(v.name)}</span><span class="ct">${v.n} lượt</span></div>`).join('')}</div>
      <div class="mp-sub">Điều mọi người trân trọng</div>
      <ul class="mp-str">${H.strengths.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
      ${H.quotes.slice(0,2).map(q=>`<div class="mp-q">${esc(q)}</div>`).join('')}
    </section>
    <section class="mp-sec">
      <span class="mp-kick" style="background:#0F766E">Bạn đã lan tỏa</span>
      <div class="mp-stats">${st(H.given.total,'phản hồi đã trao đi','#0F766E')}${st(H.given.people,'đồng nghiệp đã nhận','#2563EB')}
        ${st(H.hearts.received,'tim cảm ơn nhận được','#F64F9E')}${st(H.hearts.given,'tim bạn đã trao đi','#A50064')}</div>
    </section>
    <section class="mp-sec">
      <span class="mp-kick" style="background:#F64F9E">Cảm ơn những người đồng hành</span>
      <div class="mp-end"><div class="mp-end-txt">
        <div class="mp-names">${H.connect.map(n=>`<span>${esc(D.posterName(n))}</span>`).join('')}</div>
        <div class="mp-sig">Cùng nhau tỏa sáng!</div></div>
        <img src="${M}shy-love.png" alt=""/></div>
    </section>
  </div>`;
}

/* ═══ Khung popup ═══ */
const STAGE_HTML=`
<div class="mni-stage" id="mniStage" onclick="if(event.target===this)closeMoni()">
  <div class="mni-dialog" id="mniDialog" role="dialog" aria-label="Dấu ấn của bạn cùng Moni">
    <div class="mni-blobs"><i></i><i></i><i></i><i></i></div>
    <div class="mni-top">
      <span class="mni-logo"><span>M</span></span><span class="mni-ttl">Dấu ấn của bạn</span><span class="mni-sub">Cùng Moni - năm ${U.year}</span>
      <button class="mni-x" onclick="closeMoni()" aria-label="Đóng"><i class="bx bx-x"></i></button>
    </div>
    <div class="mni-body"><div class="mni-scene" id="mniScene"></div><div class="mni-ftr" id="mniFtr"></div></div>
    <div class="mni-export" id="mniExport"></div>
  </div>
</div>`;
const $=id=>document.getElementById(id);
function ensureStage(){
  if(!$('mniStage'))document.body.insertAdjacentHTML('beforeend',STAGE_HTML);
  return $('mniStage');
}

/* ═══ Kể chuyện: hẹn giờ cho từng nhịp, đổi màn là huỷ hết ═══ */
let STEP=-1, timers=[];
const reduce=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const later=(fn,ms)=>timers.push(setTimeout(fn,reduce()?0:ms));
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function setTone(id){
  const t=TONE[id], el=$('mniStage');
  ['bg1','bg2','acc','acc2'].forEach(k=>el.style.setProperty('--'+k,t[k]));
}
function setPose(scene,p){
  scene.querySelectorAll('.mni-moni img').forEach(img=>img.classList.toggle('on',img.dataset.pose===p));
}
/* Tách từng chữ trong câu thành span để hiện dần như đang nói (giữ nguyên <b>). */
function wordify(p){
  const walk=node=>{[...node.childNodes].forEach(ch=>{
    if(ch.nodeType===3){
      const frag=document.createDocumentFragment();
      ch.textContent.split(/(\s+)/).forEach(part=>{
        if(!part)return;
        if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}
        const s=document.createElement('span');s.className='w';s.textContent=part;frag.appendChild(s);
      });
      ch.replaceWith(frag);
    } else walk(ch);
  });};
  walk(p);
  return [...p.querySelectorAll('.w')];
}
/* Moni nói lần lượt từng câu; xong thì hình minh hoạ hiện ra, Moni đổi tư thế và nhảy mừng. */
function tell(scene,m){
  const moni=scene.querySelector('.mni-moni'), vis=scene.querySelector('.mni-vis');
  const words=[...scene.querySelectorAll('.mni-bubble p')].map(wordify);
  let t=350;
  moni.classList.add('talk');
  words.forEach((ws,li)=>{
    /* mỗi câu một biểu cảm */
    const p=m.poses[Math.min(li,m.poses.length-2)];
    if(li===0)setPose(scene,p); else later(()=>setPose(scene,p),t);
    ws.forEach(w=>{w.style.animationDelay=(t/1000).toFixed(2)+'s';t+=reduce()?0:70;});
    t+=li<words.length-1?450:0;
  });
  later(()=>{
    moni.classList.remove('talk');
    setPose(scene,m.poses[m.poses.length-1]);
    moni.classList.add('hop');
    vis.classList.add('go');
    countUp(vis);
  },t+150);
}
function countUp(root){
  root.querySelectorAll('[data-count]').forEach(el=>{
    const end=Number(el.dataset.count); if(reduce()||!end){el.textContent=end;return;}
    const t0=performance.now(), dur=900;
    el.textContent='0';
    const tick=()=>{const p=Math.min(1,(performance.now()-t0)/dur);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)timers.push(setTimeout(tick,30));};
    tick();
  });
}

/* step: -1 lời chào, 0..5 metric, 6 lời cảm ơn, 7 poster */
function go(step){
  clearTimers(); STEP=step;
  const scene=$('mniScene');
  if(step<0){
    setTone('welcome'); scene.innerHTML=welcomeHTML();
    /* Moni đi vào xong mới hiện lời chào và nút */
    scene.querySelectorAll('[data-late]').forEach(el=>el.style.visibility='hidden');
    later(()=>{const mo=scene.querySelector('.mni-moni');mo.classList.remove('walk');setPose(scene,'wave');mo.classList.add('hop');
      scene.querySelectorAll('[data-late]').forEach(el=>el.style.visibility='');},1900);
  } else if(step<N){
    const m=METRICS[step]; setTone(m.id); scene.innerHTML=metricHTML(m); tell(scene,m);
  } else if(step===N){
    setTone('thanks'); scene.innerHTML=thanksHTML();
    later(()=>scene.querySelector('.mni-moni').classList.add('hop'),600);
  } else {
    setTone('poster'); scene.innerHTML=`<div class="mni-poster-wrap">${posterHTML()}</div>`;
  }
  renderFtr();
}
const B=(label,fn,{primary=false,icon='',after=''}={})=>
  `<button class="mni-btn${primary?' mni-btn-primary':''}" onclick="${fn}">${icon?`<i class="bx ${icon}"></i>`:''}${label}${after?`<i class="bx ${after}"></i>`:''}</button>`;
function renderFtr(){
  let h='';
  if(STEP>=0&&STEP<N){
    const dots=METRICS.map((m,k)=>`<i class="${k===STEP?'on':k<STEP?'done':''}"></i>`).join('');
    h=`<div class="mni-bar-ctl">${B('Quay lại',`moniGo(${STEP-1})`,{icon:'bx-left-arrow-alt'})}<span class="mni-dots">${dots}</span>
      ${B('Tải màn này',`moniDownload(${STEP},this)`,{icon:'bx-download'})}${B('Tiếp',`moniGo(${STEP+1})`,{primary:true,after:'bx-right-arrow-alt'})}</div>`;
  } else if(STEP===N){
    h=`<div class="mni-bar-ctl">${B('Quay lại',`moniGo(${N-1})`,{icon:'bx-left-arrow-alt'})}${B('Xem poster',`moniGo(${N+1})`,{primary:true,after:'bx-right-arrow-alt'})}</div>`;
  } else if(STEP===N+1){
    h=`<div class="mni-bar-ctl">${B('Quay lại',`moniGo(${N})`,{icon:'bx-left-arrow-alt'})}${B('Xem lại từ đầu','moniGo(-1)',{icon:'bx-revision'})}
      ${B('Tải poster','moniDownloadPoster(this)',{primary:true,icon:'bx-download'})}</div>`;
  }
  $('mniFtr').innerHTML=h;
}

/* ═══ Tải ảnh: dựng bản phẳng (đã hiện đủ chữ và hình) ngoài màn hình rồi chụp ═══ */
const H2C_SRC='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
let h2c=null;
function loadH2C(){
  if(window.html2canvas)return Promise.resolve(window.html2canvas);
  if(!h2c)h2c=new Promise((res,rej)=>{const s=document.createElement('script');s.src=H2C_SRC;s.onload=()=>res(window.html2canvas);s.onerror=rej;document.head.appendChild(s);});
  return h2c;
}
async function shoot(html,name,scale,btn){
  if(btn)btn.classList.add('busy');
  try{
    const html2canvas=await loadH2C(), host=$('mniExport');
    host.innerHTML=html;
    await document.fonts.ready;
    await Promise.all([...host.querySelectorAll('img')].map(img=>img.complete?0:new Promise(r=>{img.onload=img.onerror=r;})));
    const canvas=await html2canvas(host.firstElementChild,{backgroundColor:null,scale,logging:false,useCORS:true});
    host.innerHTML='';
    const a=document.createElement('a');a.download=name;a.href=canvas.toDataURL('image/png');a.click();
  } finally { if(btn)btn.classList.remove('busy'); }
}
function downloadMetric(i,btn){
  const m=METRICS[i], t=TONE[m.id];
  const html=`<div class="mni-shot" style="background:linear-gradient(160deg,${t.bg1},${t.bg2});--acc:${t.acc};--acc2:${t.acc2}">
    <div class="mni-row">${moniHTML([m.poses[m.poses.length-1]])}<div class="mni-col">
      <div class="mni-kick">${esc(m.kick)} - Dấu ấn của ${esc(U.short)} ${U.year}</div>
      <div class="mni-bubble tail-l">${m.lines.map(l=>`<p>${l}</p>`).join('')}</div>
      <div class="mni-vis go">${m.vis()}</div></div></div></div>`;
  return shoot(html,`dau-an-cung-moni-${String(i+1).padStart(2,'0')}.png`,2,btn).then(()=>{});
}
function downloadPoster(btn){return shoot(posterHTML(),'dau-an-cung-moni-poster.png',2,btn);}

function openMoni(){ensureStage().classList.add('open');go(-1);}
function closeMoni(){const el=$('mniStage');if(el)el.classList.remove('open');clearTimers();}
document.addEventListener('keydown',ev=>{
  const el=$('mniStage'); if(!el||!el.classList.contains('open'))return;
  if(ev.key==='Escape')closeMoni();
  else if(ev.key==='ArrowRight'&&STEP<N+1)go(STEP+1);
  else if(ev.key==='ArrowLeft'&&STEP>-1)go(STEP-1);
});
Object.assign(window,{openMoni,closeMoni,moniGo:go,moniDownload:downloadMetric,moniDownloadPoster:downloadPoster});
})();
