/* ═══════════════════════════════════════════════════════════════════════════
   SÂN KHẤU HỘP QUÀ BÍ MẬT — phương án 5 của "Dấu ấn của bạn" (chị chốt 11/10/2026)
     Feedback là món quà. Lời chào: hộp quà lớn có thẻ "Gửi Tú", thuyền trưởng
     Moni đứng cạnh. Bấm mở: hộp rung, nắp bay, ánh vàng toả ra như rương kho
     báu cướp biển. Mỗi lần Tiếp: một báu vật bay lên từ hộp, thẻ giấy da bên
     phải mở ra metric; báu vật đã nhận xếp vào túi đồ. Hết 6 báu vật: lời cảm
     ơn (kho báu đầy), rồi poster.
   Phong cách bút chì dùng chung (pencil.js). Số liệu: window.DauAn.
   Trang nạp: gift-stage.css, dau-an-model.js, pencil.js, gift-stage.js, rồi gọi openGift().
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
const D=window.DauAn, U=D.USER, H=D.highlights();
const {pencil,DOO,doo,INK,INK2,GOLD}=window.Pencil;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CV_DIR='../Core%20value%20with%20BG/';
const M='../assets/mascot/';
const BROWN='#7A4E22';

/* ═══ Thuyền trưởng Moni dẫn đường (không đội mũ, góp ý 11/10/2026) ═══ */
const POSE={wave:'wave.png',cheer:'cheer.png',wink:'wink.png',think:'think.png',run:'run.png',idle:'idle.png',shy:'shy-love.png',walk:'walk-bubble.png'};
function moniHTML(pose,cls=''){
  return `<div class="gft-moni ${cls}"><div class="bd"><img src="${M}${POSE[pose]}" alt=""/></div></div>`;
}

/* ═══ 6 báu vật: mỗi báu vật là một metric ═══ */
const num=(n,l,d)=>`<div class="gft-num pop" style="--d:${d}s"><div class="n">${n}${pencil(DOO.ring.p,{vb:DOO.ring.vb,par:'preserveAspectRatio="none"',sw:2.4,cls:'draw',style:`--d:${d+.2}s`})}</div><div class="l">${esc(l)}</div></div>`;
const note=(t,d,icon='gem')=>`<div class="gft-note pop" style="--d:${d}s">${doo(icon,{cls:'',sw:1.6})}${t}</div>`;
const maxV=(H.values[0]||{}).n||0;
const TREASURE=[
  { item:'scroll', name:'Cuộn thư lời nhắn', pose:'cheer',
    body:()=>`<div class="gft-nums">${num(H.total,'phản hồi đã nhận',.3)}${num(H.people,'đồng nghiệp đã gửi',.45)}</div>
      ${note('Mỗi lời nhắn là một góc nhìn giúp bạn hiểu mình rõ hơn.',.7)}` },
  { item:'compass', name:'La bàn dẫn đường', pose:'think',
    body:()=>`<p class="gft-p pop" style="--d:.25s">Những người gửi bạn nhiều phản hồi nhất:</p>
      <div class="gft-list">${H.connect.map((n,k)=>`<div class="gft-name pop" style="--d:${(.4+k*.15).toFixed(2)}s"><span class="cn">${doo('coin',{cls:'',sw:3})}<b>${k+1}</b></span>${esc(n)}</div>`).join('')}</div>
      ${note('Họ là những người đã giúp bạn định hướng trên chặng đường vừa qua.',.9)}` },
  { item:'crown', name:'Vương miện giá trị', pose:'wink',
    body:()=>`<p class="gft-p pop" style="--d:.25s">Giá trị đồng nghiệp ghi nhận ở bạn:</p>
      <div class="gft-list">${H.values.map((v,k)=>`<div class="gft-val pop" style="--d:${(.4+k*.12).toFixed(2)}s"><img src="${CV_DIR}${v.art}" alt=""/>
        <span class="nm">${esc(v.name)}</span><span class="gs">${Array.from({length:v.n},()=>doo('gem',{cls:'',sw:1.4})).join('')}</span><span class="ct">${v.n} lượt</span></div>`).join('')}</div>` },
  { item:'key', name:'Chìa khóa siêu năng lực', pose:'run',
    body:()=>`<div class="gft-list">${H.strengths.map((s,k)=>`<div class="gft-key pop" style="--d:${(.3+k*.18).toFixed(2)}s">${doo('key',{cls:'',sw:3.4})}<span>${esc(s)}</span></div>`).join('')}</div>
      ${note('Đó là những điều mọi người trân trọng ở bạn.',.9)}` },
  { item:'bottle', name:'Chai thư bạn gửi đi', pose:'wave',
    body:()=>`<div class="gft-nums">${num(H.given.total,'phản hồi đã trao đi',.3)}${num(H.given.people,'đồng nghiệp đã nhận',.45)}</div>
      ${note('Mỗi phản hồi bạn viết là một món quà giúp đồng nghiệp thấy điều họ chưa thấy.',.7)}` },
  { item:'coin', name:'Đồng xu trái tim', pose:'idle',
    body:()=>`<div class="gft-nums">${num(H.hearts.received,'tim cảm ơn nhận được',.3)}${num(H.hearts.given,'tim bạn đã trao đi',.45)}</div>
      ${note('Cảm ơn qua lại là cách văn hóa phản hồi trở nên ấm áp mỗi ngày.',.7,'heart')}` }
];
const N=TREASURE.length;
const itemSVG=(k,sw=2.6)=>doo(TREASURE[k].item,{cls:'',sw,color:BROWN});
const underline=d=>`<span class="gft-under pop" style="--d:${d}s">${doo('under',{cls:'draw',sw:2.6,style:`--d:${d+.1}s;width:100%;height:100%`})}</span>`;

function treasureCard(k){
  const t=TREASURE[k];
  return `<div class="gft-card">
    <span class="gft-kick pop" style="--d:0s">Báu vật ${k+1} / ${N}</span>
    <div class="gft-h pop" style="--d:.08s">${esc(t.name)}</div>${underline(.18)}
    ${t.body()}</div>`;
}
function welcomeCard(){
  return `<div class="gft-card">
    <div class="gft-h sig pop" style="--d:.1s">Chào ${esc(U.short)}!</div>${underline(.25)}
    <p class="gft-p pop" style="--d:.35s">Năm ${U.year}, đồng nghiệp đã gói tặng bạn cả một hộp quà bí mật.</p>
    <p class="gft-p pop" style="--d:.5s">Bên trong là ${N} báu vật làm từ những phản hồi bạn đã nhận và đã trao đi. Thuyền trưởng Moni đã sẵn sàng, mở hộp thôi!</p>
    <button class="gft-cta pop" style="--d:.65s" onclick="giftOpen()"><i class="bx bx-gift"></i> Mở hộp quà</button></div>`;
}
function thanksCard(){
  return `<div class="gft-card">
    <span class="gft-kick pop" style="--d:0s">Kho báu đã đầy</span>
    <div class="gft-h sig pop" style="--d:.1s">Cảm ơn ${esc(U.short)}!</div>${underline(.25)}
    <p class="gft-p pop" style="--d:.35s">Bạn đã nhận đủ <b>${N} báu vật</b>!</p>
    <p class="gft-p pop" style="--d:.5s">Hộp quà này được gói từ những lời chân thành của đồng nghiệp. Cảm ơn bạn đã đón nhận cởi mở và trao đi thật nhiều món quà như thế.</p>
    <p class="gft-p pop" style="--d:.65s">Hãy tiếp tục lan tỏa văn hóa phản hồi ở MoMo, để mỗi ngày đều là một chuyến phiêu lưu đáng nhớ!</p></div>`;
}

/* Poster: khung 3 phần đã chốt, trình bày như tấm bản đồ kho báu. */
function posterHTML(){
  const st=(ic,n,l)=>`<div class="gp-stat">${doo(ic,{cls:'',sw:3,color:BROWN})}<div class="n">${n}</div><div class="l">${esc(l)}</div></div>`;
  return `<div class="gft-poster">
    <div class="gp-hd"><span class="ic" style="left:0">${doo('compass',{cls:'',sw:2.6,color:BROWN})}</span><span class="ic" style="right:0">${doo('crown',{cls:'',sw:2.6,color:BROWN})}</span>
      <div class="gp-brand"><span class="gft-logo"><span>M</span></span>MoMo HRM</div>
      <div class="gp-ttl">Dấu ấn của ${esc(U.short)}</div>
      <div class="gp-who">Năm ${U.year} - ${H.total} phản hồi từ ${H.people} đồng nghiệp</div></div>
    <div class="gp-sec"><span class="gp-kick">Bạn trong mắt đồng nghiệp</span>
      <div class="gp-sub">Giá trị được ghi nhận</div>
      <div class="gp-vals">${H.values.map(v=>`<div class="gp-val${v.n===maxV?' top':''}"><img src="${CV_DIR}${v.art}" alt=""/><span class="nm">${esc(v.name)}</span><span class="ct">${v.n} lượt</span></div>`).join('')}</div>
      <div class="gp-sub">Điều mọi người trân trọng</div>
      <ul class="gp-str">${H.strengths.map(x=>`<li>${doo('key',{cls:'',sw:3.4,color:BROWN})}<span>${esc(x)}</span></li>`).join('')}</ul>
      ${H.quotes.slice(0,2).map(q=>`<div class="gp-q">${esc(q)}</div>`).join('')}</div>
    <div class="gp-sec"><span class="gp-kick">Bạn đã lan tỏa</span>
      <div class="gp-stats">${st('bottle',H.given.total,'phản hồi đã trao đi')}${st('scroll',H.given.people,'đồng nghiệp đã nhận')}${st('coin',H.hearts.received,'tim cảm ơn nhận được')}${st('coin',H.hearts.given,'tim bạn đã trao đi')}</div></div>
    <div class="gp-sec"><span class="gp-kick">Cảm ơn những người đồng hành</span>
      <div class="gp-end"><div class="gp-end-txt"><div class="gp-names">${H.connect.map(n=>`<span>${esc(D.posterName(n))}</span>`).join('')}</div>
        <div class="gp-sig">Cùng nhau tỏa sáng!</div></div>${moniHTML('shy')}</div></div>
  </div>`;
}

/* ═══ Khung popup ═══ */
const SPARKS=Array.from({length:14},(_,k)=>`<i style="left:${(k%7-3)*16}px;--s:${10+k%4*4}px;--d:${2.4+(k%5)*.5}s;--dl:${(k*.27).toFixed(2)}s;--x:${(k%2?1:-1)*(20+k*6)}px">${doo('star',{cls:'',sw:1.6,color:k%3?GOLD:INK2})}</i>`).join('');
const BG=`<div class="gft-bg">
  ${[0,1].map(k=>`<span class="wv" style="bottom:${78+k*14}px;transform:translateX(${k*30}px)">${doo('wave',{cls:'',sw:1.4,color:BROWN,par:'preserveAspectRatio="none"',style:'width:100%;height:100%'})}</span>`).join('')}
  ${[[6,8,18],[30,4,12],[52,10,16],[88,6,20],[94,40,12]].map(([x,y,s],k)=>`<span class="st" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;animation-delay:${k*.4}s">${doo('star',{cls:'',sw:1.6,color:GOLD})}</span>`).join('')}
</div>`;
const STAGE_HTML=`
<div class="gft-stage" id="gftStage" onclick="if(event.target===this)closeGift()">
  <div class="gft-dialog" id="gftDialog" role="dialog" aria-label="Hộp quà dấu ấn của bạn">
    <div class="gft-top"><span class="gft-logo"><span>M</span></span><span class="gft-ttl">Dấu ấn của bạn</span><span class="gft-sub">Hộp quà bí mật - năm ${U.year}</span>
      <button class="gft-x" onclick="closeGift()" aria-label="Đóng"><i class="bx bx-x"></i></button></div>
    <div class="gft-body">${BG}
      <div class="gft-world" id="gftWorld">
        <div class="gft-left"><div class="gft-anchor">
          <div class="gft-rays"></div><div class="gft-glow"></div>
          <div class="gft-spark">${SPARKS}</div>
          <div class="gft-box hint" id="gftBox" onclick="giftOpen()" role="button" aria-label="Mở hộp quà">
            ${doo('boxBody',{cls:'body',sw:3,color:INK})}${doo('boxLid',{cls:'lid',sw:3,color:INK})}
            <div class="gft-tag">${doo('tag',{cls:'',sw:2.4,color:BROWN,style:'width:100%;height:100%'})}<span>Gửi ${esc(U.short)}</span></div>
          </div>
          <div class="gft-item" id="gftItem"></div>
          <div class="gft-hoard" id="gftHoard"></div>
          <div id="gftMoni"></div>
        </div></div>
        <div class="gft-right" id="gftRight"></div>
      </div>
      <div class="gft-poster-wrap" id="gftPoster" hidden></div>
      <div class="gft-ftr" id="gftFtr"></div>
    </div>
    <div class="gft-export" id="gftExport"></div>
  </div>
</div>`;
const $=id=>document.getElementById(id);
function ensureStage(){
  if(!$('gftStage'))document.body.insertAdjacentHTML('beforeend',STAGE_HTML);
  return $('gftStage');
}

/* ═══ Trạng thái: -1 lời chào (hộp đóng), 0..5 báu vật, 6 cảm ơn, 7 poster ═══ */
let STEP=-1, opened=false, timers=[];
const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function setMoni(pose,hop){
  $('gftMoni').innerHTML=moniHTML(pose,hop?'hop':'');
}
function setLit(on){$('gftDialog').classList.toggle('lit',on);}
function closeBox(){
  opened=false; const b=$('gftBox');
  b.classList.remove('open','shake'); b.classList.add('hint'); setLit(false);
}
function showItem(k){
  const el=$('gftItem');
  el.classList.remove('rise'); el.innerHTML=k==null?'':`<div class="halo"></div>${itemSVG(k)}`;
  if(k!=null){void el.offsetWidth; el.classList.add('rise');}
}
function show(step){
  clearTimers(); STEP=step;
  $('gftPoster').hidden=step!==N+1; $('gftWorld').hidden=step===N+1;
  $('gftHoard').innerHTML='';
  if(step<0){
    closeBox(); showItem(null); setMoni('wave');
    $('gftRight').innerHTML=welcomeCard();
  } else if(step<N){
    const t=TREASURE[step];
    if(!opened){openBox(()=>show(step));return;}
    showItem(step); setMoni(t.pose,true);
    $('gftRight').innerHTML=''; later(()=>{$('gftRight').innerHTML=treasureCard(step);},550);
  } else if(step===N){
    showItem(null); setMoni('shy',true);
    /* kho báu đầy: 6 báu vật xếp vòng cung trên miệng hộp */
    $('gftHoard').innerHTML=TREASURE.map((t,k)=>{const a=(-62+k*24.8)*Math.PI/180, R=125;
      return `<span style="left:${(Math.sin(a)*R).toFixed(0)}px;top:${(-Math.cos(a)*R*.75).toFixed(0)}px;--dl:${(k*.12).toFixed(2)}s">${itemSVG(k,3)}</span>`;}).join('');
    $('gftRight').innerHTML=thanksCard();
  } else {
    $('gftPoster').innerHTML=posterHTML();
  }
  renderFtr();
}
/* Mở hộp: rung → nắp bay → ánh sáng và bụi vàng → báu vật đầu tiên */
function openBox(then){
  if(opened){then&&then();return;}
  const b=$('gftBox'); b.classList.remove('hint'); b.classList.add('shake');
  $('gftRight').innerHTML='';
  $('gftFtr').innerHTML='';
  later(()=>{b.classList.remove('shake');b.classList.add('open');},550);
  later(()=>setLit(true),800);
  later(()=>{opened=true;then&&then();},1500);
}

const B=(label,fn,{primary=false,icon='',after=''}={})=>
  `<button class="gft-btn${primary?' gft-btn-primary':''}" onclick="${fn}">${icon?`<i class="bx ${icon}"></i>`:''}${label}${after?`<i class="bx ${after}"></i>`:''}</button>`;
function renderFtr(){
  let h='';
  if(STEP<0){ $('gftFtr').innerHTML=''; return; }
  if(STEP<N){
    const bag=TREASURE.map((t,k)=>`<span class="${k<=STEP?'got':''}${k===STEP?' on':''}" title="${esc(t.name)}">${itemSVG(k,3)}</span>`).join('');
    h=`${B('Quay lại',`giftGo(${STEP-1})`,{icon:'bx-left-arrow-alt'})}<span class="gft-bag" aria-label="Túi đồ: đã nhận ${STEP+1} trên ${N} báu vật">${bag}</span>
      ${B('Tải báu vật này',`giftDownload(${STEP},this)`,{icon:'bx-download'})}${B(STEP<N-1?'Báu vật tiếp':'Tiếp',`giftGo(${STEP+1})`,{primary:true,after:'bx-right-arrow-alt'})}`;
  } else if(STEP===N){
    h=`${B('Quay lại',`giftGo(${N-1})`,{icon:'bx-left-arrow-alt'})}${B('Xem poster',`giftGo(${N+1})`,{primary:true,after:'bx-right-arrow-alt'})}`;
  } else {
    h=`${B('Quay lại',`giftGo(${N})`,{icon:'bx-left-arrow-alt'})}${B('Xem lại từ đầu','giftGo(-1)',{icon:'bx-revision'})}${B('Tải poster','giftDownloadPoster(this)',{primary:true,icon:'bx-download'})}`;
  }
  $('gftFtr').innerHTML=`<div class="gft-bar">${h}</div>`;
}

/* ═══ Tải ảnh: dựng bản phẳng ngoài màn hình rồi chụp ═══ */
const H2C_SRC='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
let h2c=null;
function loadH2C(){
  if(window.html2canvas)return Promise.resolve(window.html2canvas);
  if(!h2c)h2c=new Promise((res,rej)=>{const s=document.createElement('script');s.src=H2C_SRC;s.onload=()=>res(window.html2canvas);s.onerror=rej;document.head.appendChild(s);});
  return h2c;
}
async function shoot(html,name,btn){
  if(btn)btn.classList.add('busy');
  try{
    const html2canvas=await loadH2C(), host=$('gftExport');
    host.innerHTML=html;
    await document.fonts.ready;
    await Promise.all([...host.querySelectorAll('img')].map(img=>img.complete?0:new Promise(r=>{img.onload=img.onerror=r;})));
    const canvas=await html2canvas(host.firstElementChild,{backgroundColor:null,scale:2,logging:false,useCORS:true});
    host.innerHTML='';
    const a=document.createElement('a');a.download=name;a.href=canvas.toDataURL('image/png');a.click();
  } finally { if(btn)btn.classList.remove('busy'); }
}
function downloadTreasure(k,btn){
  return shoot(`<div class="gft-shot"><div class="ic">${itemSVG(k)}</div>${treasureCard(k)}</div>`,`hop-qua-bau-vat-${k+1}.png`,btn);
}
function downloadPoster(btn){return shoot(posterHTML(),'hop-qua-poster.png',btn);}

function openGift(){ensureStage().classList.add('open');show(-1);}
function closeGift(){const el=$('gftStage');if(el)el.classList.remove('open');clearTimers();}
document.addEventListener('keydown',ev=>{
  const el=$('gftStage'); if(!el||!el.classList.contains('open'))return;
  if(ev.key==='Escape')closeGift();
  else if(ev.key==='ArrowRight'&&STEP<N+1)show(STEP+1);
  else if(ev.key==='ArrowLeft'&&STEP>-1)show(STEP-1);
});
Object.assign(window,{openGift,closeGift,giftGo:show,giftOpen:()=>{if(STEP<0)show(0);},giftDownload:downloadTreasure,giftDownloadPoster:downloadPoster});
})();
