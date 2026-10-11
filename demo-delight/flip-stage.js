/* ═══════════════════════════════════════════════════════════════════════════
   SÂN KHẤU SỔ LẬT — phương án 4 của "Dấu ấn của bạn" (chị chốt 11/10/2026)
     Sổ lò xo kiểu flipchart, lật từ dưới lên bằng nút Tiếp / Quay lại.
     Bìa: lời chào. Mỗi trang: một metric. Trang cuối: lời cảm ơn.
     Đóng sổ (các trang rơi về, sổ thu lại) thì mở poster.
   Hồng MoMo trên giấy kem kẻ ô; Moni là nhân vật chính; hoạ tiết vẽ kiểu bút
   chì (nét run, vân hạt, nét đi hai lần) và tự vẽ ra khi trang mở.
   Tải được từng trang và poster.

   Số liệu lấy từ window.DauAn (dau-an-model.js), file này chỉ dựng giao diện.
   Trang nạp: flip-stage.css, dau-an-model.js, flip-stage.js, rồi gọi openFlip().
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
const D=window.DauAn, U=D.USER, H=D.highlights();
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CV_DIR='../Core%20value%20with%20BG/';
const M='../assets/mascot/';
const INK='#A50064', INK2='#F64F9E', GOLD='#E8A317', CREAM='#FFF3E6';

/* Bộ vẽ bút chì dùng chung nằm ở pencil.js (nạp trước file này). */
const {pencil,DOO,doo}=window.Pencil;
/* đặt hoạ tiết lên trang: [tên, left%, top%, cỡ px, độ trễ vẽ, lớp thêm, màu] */
const deco=list=>list.map(([k,x,y,s,d=.4,extra='',color=INK])=>
  `<span class="flp-doodle pop ${extra}" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;--d:${d}s">${doo(k,{color,style:`--d:${d+.1}s;width:100%;height:100%`})}</span>`).join('');

/* ═══ Các trang ═══ */
const num=(n,l,d)=>`<div class="flp-num pop" style="--d:${d}s"><div class="n">${n}${pencil(DOO.ring.p,{vb:DOO.ring.vb,par:'preserveAspectRatio="none"',sw:2.4,style:`--d:${d+.25}s`})}</div><div class="l">${esc(l)}</div></div>`;
const title=(t,d=.05)=>`<div class="flp-h pop" style="--d:${d}s">${esc(t)}</div>
  <span class="pop" style="--d:${d+.2}s;display:block;width:150px;height:14px;margin-top:-6px">${doo('under',{style:`--d:${d+.3}s;width:100%;height:100%`,sw:2.6})}</span>`;
const note=(t,d,icon='star')=>`<div class="flp-note pop" style="--d:${d}s">${doo(icon,{style:`--d:${d+.1}s`,color:icon==='heart'?INK:GOLD})}${t}</div>`;
const NO_COLORS=[INK,INK2,GOLD];
const maxV=(H.values[0]||{}).n||0;

const PAGES=[
  { id:'cover', cover:true, pose:'walk-bubble.png',
    left:()=>`<span class="flp-kick pop" style="--d:.05s">Dấu ấn của bạn - năm ${U.year}</span>
      <div class="flp-h sig pop" style="--d:.15s">Chào ${esc(U.short)}!</div>
      <p class="flp-p pop" style="--d:.3s">Cuốn sổ nhỏ này ghi lại những món quà bạn đã nhận và đã trao trong năm qua.</p>
      <p class="flp-p pop" style="--d:.45s">Lật từng trang cùng Moni nhé!</p>`,
    deco:[['sprig',4,40,90,.5,'wig',CREAM],['star',80,8,30,.7,'twk',CREAM],['star',8,8,20,.9,'twk',CREAM],['flower',78,62,54,.6,'wig',CREAM],['loop',40,4,60,.8,'',CREAM]] },
  { id:'total', pose:'wave.png',
    left:()=>`${title('Những phản hồi bạn nhận')}
      <div class="flp-nums">${num(H.total,'phản hồi đã nhận',.35)}${num(H.people,'đồng nghiệp đã gửi',.5)}</div>
      ${note('Mỗi phản hồi là một góc nhìn giúp bạn hiểu mình rõ hơn.',.8)}`,
    deco:[['mail',2,6,58,.5,'wig'],['mail',70,2,44,.7,'wig'],['star',84,30,22,.9,'twk',GOLD],['sprig',0,52,70,.6,'wig']] },
  { id:'connect', pose:'cheer.png',
    left:()=>`${title('Kết nối đáng nhớ')}
      <p class="flp-p pop" style="--d:.3s">Những người gửi bạn nhiều phản hồi nhất:</p>
      <div class="flp-list">${H.connect.map((n,k)=>`<div class="flp-name pop" style="--d:${(.45+k*.15).toFixed(2)}s"><span class="no" style="background:${NO_COLORS[k%3]}">${k+1}</span>${esc(n)}</div>`).join('')}</div>
      ${note('Cảm ơn những người đã dành thời gian quan sát và nói cho bạn biết điều họ thấy.',1,'heart')}`,
    deco:[['heart',6,8,34,.5,'twk'],['heart',78,4,26,.7,'twk'],['arrow',0,48,70,.6],['star',84,40,22,.9,'twk',GOLD]] },
  { id:'values', pose:'wink.png',
    left:()=>`${title('Dấu ấn bạn để lại')}
      <p class="flp-p pop" style="--d:.3s">Giá trị đồng nghiệp ghi nhận ở bạn:</p>
      <div class="flp-list">${H.values.map((v,k)=>`<div class="flp-val pop" style="--d:${(.45+k*.12).toFixed(2)}s">
        <img src="${CV_DIR}${v.art}" alt=""/><span class="nm">${esc(v.name)}</span>
        <span class="hs">${Array.from({length:v.n},()=>doo('heart',{cls:'',sw:1.6})).join('')}</span><span class="ct">${v.n} lượt</span></div>`).join('')}</div>`,
    deco:[['flower',6,4,56,.5,'wig'],['star',80,10,26,.8,'twk',GOLD],['sprig',76,46,70,.6,'wig']] },
  { id:'strengths', pose:'think.png',
    left:()=>`${title('Điều mọi người trân trọng ở bạn')}
      <div class="flp-list">${H.strengths.map((s,k)=>`<div class="flp-check pop" style="--d:${(.4+k*.18).toFixed(2)}s">${doo('check',{style:`--d:${(.5+k*.18).toFixed(2)}s`,sw:2.6})}<span>${esc(s)}</span></div>`).join('')}</div>
      ${note('Moni nghĩ đó là siêu năng lực của bạn!',1)}`,
    deco:[['star',4,6,30,.5,'twk',GOLD],['star',18,16,18,.7,'twk',GOLD],['loop',66,4,64,.6],['sprig',2,50,70,.6,'wig']] },
  { id:'given', pose:'run.png',
    left:()=>`${title('Phản hồi bạn đã trao đi')}
      <div class="flp-nums">${num(H.given.total,'phản hồi đã trao đi',.35)}${num(H.given.people,'đồng nghiệp đã nhận',.5)}</div>
      ${note('Mỗi phản hồi bạn viết là một món quà giúp đồng nghiệp thấy điều họ chưa thấy.',.8)}`,
    deco:[['plane',4,4,62,.5,'wig'],['arrow',56,10,70,.6],['plane',76,40,40,.8,'wig'],['star',8,56,22,.9,'twk',GOLD]] },
  { id:'hearts', pose:'heart.png',
    left:()=>`${title('Những trái tim cảm ơn')}
      <div class="flp-nums">${num(H.hearts.received,'tim cảm ơn nhận được',.35)}${num(H.hearts.given,'tim bạn đã trao đi',.5)}</div>
      ${note('Cảm ơn qua lại là cách văn hóa phản hồi trở nên ấm áp mỗi ngày.',.8,'heart')}`,
    deco:[['heart',4,6,40,.5,'twk'],['heart',76,2,30,.6,'twk'],['heart',84,34,22,.7,'twk'],['heart',2,50,26,.8,'twk'],['loop',30,0,56,.6]] },
  { id:'thanks', pose:'shy-love.png', label:'Lời cuối sổ',
    left:()=>`<div class="flp-h sig pop" style="--d:.05s">Cảm ơn ${esc(U.short)}!</div>
      <span class="pop" style="--d:.25s;display:block;width:150px;height:14px;margin-top:-6px">${doo('under',{style:'--d:.35s;width:100%;height:100%',sw:2.6})}</span>
      <p class="flp-p pop" style="--d:.4s">Thật vui vì bạn đã đọc đến trang cuối.</p>
      <p class="flp-p pop" style="--d:.55s">Cảm ơn bạn đã lắng nghe cởi mở và trao đi những lời chân thành, cùng MoMo vun đắp văn hóa phản hồi liên tục.</p>
      <p class="flp-p pop" style="--d:.7s">Hẹn gặp lại bạn ở cuốn sổ năm sau, với thật nhiều dấu ấn mới!</p>`,
    deco:[['heart',6,6,34,.5,'twk'],['heart',80,10,26,.7,'twk'],['flower',2,52,58,.6,'wig'],['star',84,46,24,.9,'twk',GOLD]] }
];
const LAST=PAGES.length-1;

function pageFront(p,i){
  const pnum=p.cover||i===LAST?'':`<span class="flp-pnum">${i} / ${LAST-1}</span>`;
  return `<div class="flp-front ${p.cover?'flp-cover':'flp-paper'}"><div class="flp-in">
      <div class="flp-left">${p.label?`<span class="flp-kick pop" style="--d:0s">${esc(p.label)}</span>`:''}${p.left()}</div>
      <div class="flp-right">${deco(p.deco)}<div class="flp-moni pop" style="--d:.2s"><img src="${M}${p.pose}" alt=""/></div></div>
    </div>${pnum}</div>`;
}
const ringsHTML=n=>`<div class="flp-rings">${'<i></i>'.repeat(n)}</div>`;
function bookHTML(){
  return `<div class="flp-fit" id="flpFit"><div class="flp-book" id="flpBook" style="width:880px;height:560px;transform-origin:0 0">
    <div class="flp-board"></div>${ringsHTML(14)}
    <div class="flp-pages">${PAGES.map((p,i)=>`<div class="flp-sheet" data-i="${i}" style="z-index:${100-i}">${pageFront(p,i)}<div class="flp-back flp-paper"></div></div>`).join('')}</div>
  </div></div>`;
}

/* Poster: khung 3 phần đã chốt ở phương án 2, trình bày như một trang sổ. */
function posterHTML(){
  const st=(n,l)=>`<div class="fp-stat"><div class="n">${n}</div><div class="l">${esc(l)}</div></div>`;
  return `<div class="flp-poster">${ringsHTML(10)}<div class="fp-paper flp-paper">
    <div class="fp-hd"><div class="fp-brand"><span class="flp-logo"><span>M</span></span>MoMo HRM</div>
      <div class="fp-ttl">Dấu ấn của ${esc(U.short)}</div>
      <div class="fp-who">Năm ${U.year} - ${H.total} phản hồi từ ${H.people} đồng nghiệp</div></div>
    <div class="fp-sec"><span class="fp-kick">Bạn trong mắt đồng nghiệp</span>
      <div class="fp-sub">Giá trị được ghi nhận</div>
      <div class="fp-vals">${H.values.map(v=>`<div class="fp-val${v.n===maxV?' top':''}"><img src="${CV_DIR}${v.art}" alt=""/><span class="nm">${esc(v.name)}</span><span class="ct">${v.n} lượt</span></div>`).join('')}</div>
      <div class="fp-sub">Điều mọi người trân trọng</div>
      <ul class="fp-str">${H.strengths.map(x=>`<li>${doo('check',{cls:'',sw:2.4})}<span>${esc(x)}</span></li>`).join('')}</ul>
      ${H.quotes.slice(0,2).map(q=>`<div class="fp-q">${esc(q)}</div>`).join('')}</div>
    <div class="fp-sec"><span class="fp-kick">Bạn đã lan tỏa</span>
      <div class="fp-stats">${st(H.given.total,'phản hồi đã trao đi')}${st(H.given.people,'đồng nghiệp đã nhận')}${st(H.hearts.received,'tim cảm ơn nhận được')}${st(H.hearts.given,'tim bạn đã trao đi')}</div></div>
    <div class="fp-sec"><span class="fp-kick">Cảm ơn những người đồng hành</span>
      <div class="fp-end"><div class="fp-end-txt"><div class="fp-names">${H.connect.map(n=>`<span>${esc(D.posterName(n))}</span>`).join('')}</div>
        <div class="fp-sig">Cùng nhau tỏa sáng!</div></div><img src="${M}shy-love.png" alt=""/></div></div>
  </div></div>`;
}

/* ═══ Khung popup ═══ */
const STAGE_HTML=`
<div class="flp-stage" id="flpStage" onclick="if(event.target===this)closeFlip()">
  <div class="flp-dialog" role="dialog" aria-label="Sổ dấu ấn của bạn">
    <div class="flp-top"><span class="flp-logo"><span>M</span></span><span class="flp-ttl">Dấu ấn của bạn</span><span class="flp-sub">Sổ lật - năm ${U.year}</span>
      <button class="flp-x" onclick="closeFlip()" aria-label="Đóng"><i class="bx bx-x"></i></button></div>
    <div class="flp-body" id="flpBody">
      <div class="flp-scene on" data-scene="book"></div>
      <div class="flp-scene" data-scene="poster"></div>
      <div class="flp-ftr" id="flpFtr"></div>
    </div>
    <div class="flp-export" id="flpExport"></div>
  </div>
</div>`;
const $=id=>document.getElementById(id);
const sheets=()=>[...document.querySelectorAll('#flpStage .flp-sheet')];
function ensureStage(){
  if(!$('flpStage')){
    document.body.insertAdjacentHTML('beforeend',STAGE_HTML);
    $('flpStage').querySelector('[data-scene="book"]').innerHTML=bookHTML();
    window.addEventListener('resize',fit);
  }
  return $('flpStage');
}
/* Sổ dựng ở cỡ 880 x 560 rồi thu theo khung, giữ đúng tỉ lệ và cỡ chữ. */
function fit(){
  const body=$('flpBody'), f=$('flpFit'); if(!body||!f)return;
  const s=Math.min((body.clientWidth-56)/880,(body.clientHeight-26-92)/560,1);
  f.style.width=880*s+'px'; f.style.height=560*s+'px';
  $('flpBook').style.transform=`scale(${s})`;
}

/* ═══ Lật trang ═══ */
let IDX=0, MODE='book', timers=[];
const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function activate(i){
  sheets().forEach(s=>s.classList.remove('act'));
  const s=sheets()[i]; void s.offsetWidth; s.classList.add('act');
}
function setFlipped(n,instant){
  sheets().forEach((s,i)=>{
    if(instant)s.classList.add('instant');
    s.classList.toggle('flipped',i<n);
    if(instant){void s.offsetWidth;s.classList.remove('instant');}
  });
}
function go(n){
  if(n<0||n>LAST)return;
  clearTimers();
  const fwd=n>IDX; IDX=n;
  setFlipped(n,false);
  later(()=>activate(n),fwd?380:120);
  renderFtr();
}
function showScene(name){
  MODE=name;
  document.querySelectorAll('#flpStage .flp-scene').forEach(s=>s.classList.toggle('on',s.dataset.scene===name));
}
/* Đóng sổ: các trang rơi về lần lượt (trang cuối về trước), sổ thu lại, poster hiện ra. */
function closeBook(){
  clearTimers();
  const ss=sheets();
  for(let i=LAST-1;i>=0;i--) later(()=>ss[i].classList.remove('flipped'),(LAST-1-i)*110);
  const tEnd=(LAST-1)*110+950;
  later(()=>$('flpFit').classList.add('closing'),tEnd);
  later(()=>{
    $('flpStage').querySelector('[data-scene="poster"]').innerHTML=posterHTML();
    showScene('poster'); renderFtr();
  },tEnd+450);
  $('flpFtr').innerHTML='';
}
function backToBook(page){
  clearTimers(); showScene('book');
  $('flpFit').classList.remove('closing'); fit();
  IDX=page; setFlipped(page,true); activate(page); renderFtr();
}

const B=(label,fn,{primary=false,icon='',after=''}={})=>
  `<button class="flp-btn${primary?' flp-btn-primary':''}" onclick="${fn}">${icon?`<i class="bx ${icon}"></i>`:''}${label}${after?`<i class="bx ${after}"></i>`:''}</button>`;
function renderFtr(){
  let h='';
  if(MODE==='poster'){
    h=`${B('Quay lại',`flipBack(${LAST})`,{icon:'bx-left-arrow-alt'})}${B('Xem lại từ đầu','flipBack(0)',{icon:'bx-revision'})}${B('Tải poster','flipDownloadPoster(this)',{primary:true,icon:'bx-download'})}`;
  } else if(IDX===0){
    h=B('Mở sổ','flipGo(1)',{primary:true,icon:'bx-book-open'});
  } else {
    const dots=PAGES.map((p,k)=>`<i class="${k===IDX?'on':k<IDX?'done':''}"></i>`).join('');
    h=`${B('Quay lại',`flipGo(${IDX-1})`,{icon:'bx-left-arrow-alt'})}<span class="flp-dots">${dots}</span>${B('Tải trang này',`flipDownload(${IDX},this)`,{icon:'bx-download'})}`+
      (IDX<LAST?B('Tiếp',`flipGo(${IDX+1})`,{primary:true,after:'bx-right-arrow-alt'}):B('Đóng sổ','flipClose()',{primary:true,icon:'bx-book'}));
  }
  $('flpFtr').innerHTML=`<div class="flp-bar">${h}</div>`;
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
    const html2canvas=await loadH2C(), host=$('flpExport');
    host.innerHTML=html;
    await document.fonts.ready;
    await Promise.all([...host.querySelectorAll('img')].map(img=>img.complete?0:new Promise(r=>{img.onload=img.onerror=r;})));
    const canvas=await html2canvas(host.firstElementChild,{backgroundColor:null,scale:2,logging:false,useCORS:true});
    host.innerHTML='';
    const a=document.createElement('a');a.download=name;a.href=canvas.toDataURL('image/png');a.click();
  } finally { if(btn)btn.classList.remove('busy'); }
}
function downloadPage(i,btn){
  const html=`<div class="flp-shot"><div class="flp-board"></div>${ringsHTML(14)}<div class="flp-pages"><div class="flp-sheet act">${pageFront(PAGES[i],i)}</div></div></div>`;
  return shoot(html,`so-dau-an-trang-${String(i).padStart(2,'0')}.png`,btn);
}
function downloadPoster(btn){return shoot(posterHTML(),'so-dau-an-poster.png',btn);}

function openFlip(){
  ensureStage().classList.add('open');
  showScene('book'); $('flpFit').classList.remove('closing'); fit();
  IDX=0; setFlipped(0,true); activate(0); renderFtr();
}
function closeFlip(){const el=$('flpStage');if(el)el.classList.remove('open');clearTimers();}
document.addEventListener('keydown',ev=>{
  const el=$('flpStage'); if(!el||!el.classList.contains('open'))return;
  if(ev.key==='Escape')closeFlip();
  else if(MODE==='book'&&ev.key==='ArrowRight'){IDX<LAST?go(IDX+1):closeBook();}
  else if(MODE==='book'&&ev.key==='ArrowLeft')go(IDX-1);
});
Object.assign(window,{openFlip,closeFlip,flipGo:go,flipClose:closeBook,flipBack:backToBook,flipDownload:downloadPage,flipDownloadPoster:downloadPoster});
})();
