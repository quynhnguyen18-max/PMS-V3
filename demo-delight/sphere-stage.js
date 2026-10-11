/* ═══════════════════════════════════════════════════════════════════════════
   SÂN KHẤU "CẦU" — Dấu ấn của bạn trải trên một quả cầu bài.
   Dùng cho feedback-sphere-demo.html. Nạp SAU tarot-stage.css + tarot-stage.js.

   HAI LOẠI LÁ TRÊN CẦU
     · 5 lá SÍT-RỊT — lấy nguyên bộ bài của tarot-stage (window.TAROT), mỗi lá
       mang ảnh core value thật trong "Core value with BG/". Không chép lại nội
       dung sang đây (§20.1): sửa luật ở tarot-stage.js là cả hai màn đổi theo.
     · Các lá còn lại — thông điệp ngẫu nhiên gửi tặng, minh hoạ bằng hoa lá vẽ
       SVG tại chỗ. KHÔNG dùng ảnh core value, để core value chỉ thuộc về lá
       sít-rịt — nhìn là biết lá nào là lá dành riêng cho mình.

   LUẬT MÀU CHỮ: mọi lớp nền trong SKINS đều TỐI, chữ dùng ink sáng gần trắng.
   Không có mặt bài nào chữ đen.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){

/* ═══════════════════════════════════════════════════════════════
   1. LỚP MÀU — tất cả nền tối, chữ sáng
   ═══════════════════════════════════════════════════════════════ */
const SKINS=[
  {bg:'linear-gradient(158deg,#3a0c2c 0%,#2a0821 55%,#190512 100%)',ink:'#fff5fb',accent:'#e9c884',line:'rgba(233,200,132,.42)'},
  {bg:'linear-gradient(158deg,#14375f 0%,#0b1f3a 55%,#06101f 100%)',ink:'#eaf2ff',accent:'#9ec9ff',line:'rgba(158,201,255,.40)'},
  {bg:'linear-gradient(158deg,#0d4f45 0%,#062b27 55%,#031815 100%)',ink:'#e6fff8',accent:'#7fe0c6',line:'rgba(127,224,198,.38)'},
  {bg:'linear-gradient(158deg,#5a1a1f 0%,#2b0d0d 55%,#180707 100%)',ink:'#fff0ef',accent:'#f0a48c',line:'rgba(240,164,140,.40)'},
  {bg:'linear-gradient(158deg,#45300f 0%,#1d1206 55%,#0f0903 100%)',ink:'#fff8ea',accent:'#e9c884',line:'rgba(233,200,132,.42)'},
  {bg:'linear-gradient(158deg,#3b2060 0%,#22103a 55%,#120820 100%)',ink:'#f4ecff',accent:'#c9a9ff',line:'rgba(201,169,255,.40)'},
];
const SECRET_SKIN=SKINS[0];      /* lá sít-rịt luôn giữ nền mận của bộ bài gốc */

/* ═══════════════════════════════════════════════════════════════
   2. THÔNG ĐIỆP — lá gửi tặng
   Trích dẫn để nguyên tên tác giả; câu không ghi tên là lời viết cho MoMo.
   ═══════════════════════════════════════════════════════════════ */
const MESSAGES=[
  {q:'Đi một mình thì nhanh, đi cùng nhau thì xa.',            by:'Ngạn ngữ châu Phi'},
  {q:'Cách tốt nhất để dự đoán tương lai là tạo ra nó.',       by:'Peter Drucker'},
  {q:'Chất lượng không phải một hành động, đó là thói quen.',  by:'Aristotle'},
  {q:'Thành công là những nỗ lực nhỏ lặp lại mỗi ngày.',       by:'Robert Collier'},
  {q:'Hãy là sự thay đổi mà bạn muốn thấy.',                   by:'Mahatma Gandhi'},
  {q:'Điều duy nhất ta phải sợ là chính nỗi sợ.',              by:'Franklin D. Roosevelt'},
  {q:'Không có gì thay thế được sự chăm chỉ.',                 by:'Thomas Edison'},
  {q:'Cảm ơn vì bạn nhận phần khó mà không đợi ai nhờ.',       by:'Gửi bạn'},
  {q:'Có bạn trong team, việc khó bớt khó đi một nửa.',        by:'Gửi bạn'},
  {q:'Điều bạn làm hôm qua đang giúp ai đó hôm nay.',          by:'Gửi bạn'},
  {q:'Bạn không ồn ào, nhưng ai cũng thấy bạn ở đó.',          by:'Gửi bạn'},
  {q:'Cảm ơn vì đã hỏi lại, kể cả khi không ai nhắc.',         by:'Gửi bạn'},
  {q:'Sự tỉ mỉ của bạn cứu cả team nhiều hơn bạn nghĩ.',       by:'Gửi bạn'},
  {q:'Bạn làm người mới thấy mình được chào đón.',             by:'Gửi bạn'},
  {q:'Chậm một nhịp để làm đúng — bạn luôn chọn vậy.',         by:'Gửi bạn'},
  {q:'Việc bạn làm lặng lẽ vẫn đang đỡ cho người khác.',       by:'Gửi bạn'},
];

/* ═══════════════════════════════════════════════════════════════
   3. HOA LÁ — vẽ SVG tại chỗ, 6 kiểu, không cần file ảnh
   ═══════════════════════════════════════════════════════════════ */
function botanical(kind,accent,ink){
  const A=`fill="${accent}"`, S=`stroke="${accent}" fill="none" stroke-linecap="round"`;
  const soft=`fill="${ink}" opacity=".30"`;
  switch(kind%6){
    case 0: /* hoa 6 cánh */ return `
      ${[0,60,120,180,240,300].map(a=>`<ellipse cx="50" cy="27" rx="10" ry="19" ${A} opacity=".55" transform="rotate(${a} 50 50)"/>`).join('')}
      <circle cx="50" cy="50" r="9" ${A}/>`;
    case 1: /* nhành lá */ return `
      <path d="M50 88 V 20" ${S} stroke-width="3"/>
      ${[0,1,2,3].map(j=>[-1,1].map(s=>
        `<ellipse cx="${50+s*15}" cy="${30+j*15}" rx="13" ry="7" ${A} opacity=".5"
           transform="rotate(${s*28} ${50+s*15} ${30+j*15})"/>`).join('')).join('')}`;
    case 2: /* cỏ ba lá */ return `
      ${[[50,32],[68,52],[32,52]].map(([cx,cy])=>`<circle cx="${cx}" cy="${cy}" r="16" ${A} opacity=".5"/>`).join('')}
      <path d="M50 62 q 4 18 16 24" ${S} stroke-width="3"/>`;
    case 3: /* hoa cúc nhiều cánh */ return `
      ${Array.from({length:12},(_,j)=>`<rect x="47.5" y="16" width="5" height="26" rx="2.5" ${A} opacity=".5" transform="rotate(${j*30} 50 50)"/>`).join('')}
      <circle cx="50" cy="50" r="11" ${A}/>`;
    case 4: /* cành có nụ */ return `
      <path d="M50 90 C 50 62 42 50 34 40" ${S} stroke-width="3"/>
      <path d="M50 74 C 56 60 66 54 74 48" ${S} stroke-width="3"/>
      <circle cx="34" cy="36" r="10" ${A} opacity=".55"/>
      <circle cx="76" cy="45" r="8" ${A} opacity=".55"/>
      <circle cx="50" cy="24" r="6" ${soft}/>`;
    default: /* lá dương xỉ */ return `
      <path d="M50 90 C 48 60 50 36 52 16" ${S} stroke-width="3"/>
      ${Array.from({length:7},(_,j)=>{const y=24+j*9,w=8+j*2.4;
        return `<path d="M51 ${y} q ${w} -5 ${w+3} 3" ${S} stroke-width="2.4" opacity=".7"/>
                <path d="M51 ${y} q ${-w} -5 ${-(w+3)} 3" ${S} stroke-width="2.4" opacity=".7"/>`;}).join('')}`;
  }
}
const botSVG=(kind,skin)=>`<svg viewBox="0 0 100 100" aria-hidden="true">${botanical(kind,skin.accent,skin.ink)}</svg>`;

/* ═══════════════════════════════════════════════════════════════
   4. BỘ BÀI TRÊN CẦU
   5 lá sít-rịt trước, rồi tới các lá thông điệp — rồi trộn xen kẽ để lá
   sít-rịt không dồn một cụm trên cầu.
   ═══════════════════════════════════════════════════════════════ */
const ROMAN_FALLBACK=['I','II','III','IV','V'];
function buildDeck(){
  const T=window.TAROT;
  const roman=(T&&T.ROMAN)||ROMAN_FALLBACK;
  const secrets=((T&&T.deck)||[]).map((card,i)=>({
    secret:true, idx:i, roman:roman[i]||'', short:card.short, title:card.title,
    art:(T.CARD_ART||[])[i], skin:SECRET_SKIN
  }));
  const notes=MESSAGES.map((m,i)=>({
    secret:false, idx:i, q:m.q, by:m.by, kind:i, skin:SKINS[i%SKINS.length]
  }));
  /* Rải đều 5 lá sít-rịt vào dãy thông điệp thay vì đứng liền nhau. */
  const out=[...notes];
  const step=Math.max(1,Math.floor(out.length/(secrets.length+1)));
  secrets.forEach((s,i)=>out.splice(Math.min(out.length,(i+1)*step+i),0,s));
  return out;
}
const DECK=buildDeck();

/* ═══════════════════════════════════════════════════════════════
   5. TOÁN CẦU — phân bố Fibonacci, ép dẹt chiều dọc
   Card 150×231. Chiều dọc chỉ nở tới R*YSQ nên khung cầu tính theo YSQ,
   không lấy R đầy — lấy đầy thì khung thừa chiều cao và cầu bị thu nhỏ oan.
   ═══════════════════════════════════════════════════════════════ */
const CARD_W=150, CARD_H=231;
const SPH={R:360,YSQ:.62,MIN_S:.46,MAX_S:1.18,MIN_O:.42,DRAG:.14,PAD:40,ROTY:.6};
const GOLDEN=2*Math.PI*(1-1/((1+Math.sqrt(5))/2));

function place(i,n,rotDeg){
  if(n<=1)return{x:0,y:0,z:SPH.R,rotY:0,scale:SPH.MAX_S,opacity:1,zi:100};
  const c=1-(i/(n-1))*2;
  const d=Math.sqrt(Math.max(0,1-c*c));
  const h=GOLDEN*i+rotDeg*Math.PI/180;
  const x=SPH.R*d*-Math.sin(h);
  const z=SPH.R*d* Math.cos(h);
  const t=(z+SPH.R)/(2*SPH.R);
  return{x,y:SPH.R*c*SPH.YSQ,z,
    rotY:-Math.atan2(x,z+SPH.R)*(180/Math.PI)*SPH.ROTY,
    scale:SPH.MIN_S+(SPH.MAX_S-SPH.MIN_S)*t,
    opacity:SPH.MIN_O+(1-SPH.MIN_O)*t,
    zi:Math.round(t*100)};
}
function canvasBox(){
  const ow=(SPH.MAX_S-1)/2*CARD_W, oh=(SPH.MAX_S-1)/2*CARD_H;
  return{w:SPH.R*2+CARD_W+ow*2+SPH.PAD, h:SPH.R*SPH.YSQ*2+CARD_H+oh*2+SPH.PAD};
}

/* ═══════════════════════════════════════════════════════════════
   6. MARKUP
   ═══════════════════════════════════════════════════════════════ */
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const skinVars=sk=>`--sk-ink:${sk.ink};--sk-accent:${sk.accent};--sk-line:${sk.line}`;

function miniHTML(card){
  const sk=card.skin;
  const inner=card.secret
    ? `<div class="mini-num">${esc(card.roman)}</div>
       <div class="mini-art"><img src="../Core value with BG/${esc(card.art)}" alt=""/></div>
       <div class="mini-ttl">${esc(card.short)}</div>
       <div class="mini-tag">sít-rịt</div>`
    : `<div class="mini-art">${botSVG(card.kind,sk)}</div>
       <div class="mini-q">${esc(card.q)}</div>
       <div class="mini-by">${esc(card.by)}</div>`;
  return `<div class="mini" style="background:${sk.bg};${skinVars(sk)}">${inner}</div>`;
}

/* Lá sít-rịt mở ra: dùng ĐÚNG mặt bài của tarot-stage (cùng markup, cùng CSS)
   nên nội dung hai màn không bao giờ lệch nhau. */
function openFaceHTML(card){
  /* .card-face của tarot-stage là position:absolute;inset:0 — phải nằm trong
     .card-slot (328x504) mới có kích thước, y như khuôn shotCard() dùng khi
     xuất ảnh. Thả thẳng vào là mặt bài bẹp còn một dòng. */
  if(card.secret&&window.TAROT&&window.TAROT.cardFrontHTML)
    return `<div class="card-slot" style="animation:none"><div class="card-flip">`+
           window.TAROT.cardFrontHTML(card.idx)+`</div></div>`;
  const sk=card.skin;
  return `<div class="qcard" style="background:${sk.bg};${skinVars(sk)}">
    <div class="qcard-num">THÔNG ĐIỆP</div>
    <div class="qcard-art">${botSVG(card.kind,sk)}</div>
    <blockquote class="qcard-q">${esc(card.q)}</blockquote>
    <div class="qcard-by">— ${esc(card.by)}</div>
    <div class="qcard-foot">Dấu ấn của bạn · 2026</div>
  </div>`;
}

const STAGE_HTML=`
<div class="sph-stage" id="sphStage" onclick="if(event.target===this)closeSphere()">
  <div class="sph-dialog" role="dialog" aria-label="Dấu ấn của bạn — quả cầu bài">
    <div class="sph-top">
      <span class="sph-brandline"><i class="bx bx-planet"></i> Dấu ấn của bạn · 2026</span>
      <button class="sph-x" onclick="closeSphere()" aria-label="Đóng"><i class="bx bx-x"></i></button>
    </div>
    <div class="sph-hint" id="sphHint">Kéo để xoay quả cầu · chạm một lá để mở</div>
    <div class="sph-body" id="sphBody"><div class="sph-field" id="sphField"></div></div>
    <div class="sph-foot">
      <span class="sph-legend"><span class="sph-dot" style="background:#e9c884"></span> 5 lá sít-rịt — dành riêng cho bạn</span>
      <span class="sph-legend"><span class="sph-dot" style="background:#9ec9ff"></span> còn lại là thông điệp gửi tặng</span>
    </div>
    <div class="sph-open" id="sphOpen" onclick="if(event.target===this)closeCard()">
      <div class="sph-open-in" id="sphOpenIn"></div>
    </div>
  </div>
</div>`;

/* ═══════════════════════════════════════════════════════════════
   7. DỰNG & VÒNG LẶP
   ═══════════════════════════════════════════════════════════════ */
let field=null, body=null, nodes=[], rot=0, rotVel=0, dragging=false, raf=0;
let openIdx=-1;

function ensureStage(){
  let el=document.getElementById('sphStage');
  if(!el){
    document.body.insertAdjacentHTML('beforeend',STAGE_HTML);
    el=document.getElementById('sphStage');
    field=document.getElementById('sphField');
    body=document.getElementById('sphBody');
    buildNodes();
    wireDrag();
  }
  return el;
}
function buildNodes(){
  field.innerHTML='';
  nodes=DECK.map((card,i)=>{
    const el=document.createElement('div');
    el.className='sph-card';
    const hit=document.createElement('div');
    hit.className='sph-hit';
    hit.tabIndex=0;
    hit.setAttribute('role','button');
    hit.setAttribute('aria-label',card.secret?`Lá sít-rịt: ${card.short}`:`Thông điệp: ${card.q}`);
    hit.innerHTML=miniHTML(card);
    hit.addEventListener('click',()=>{if(!moved)openCard(i);});
    hit.addEventListener('keydown',ev=>{
      if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();openCard(i);}
    });
    el.appendChild(hit);
    field.appendChild(el);
    return el;
  });
  sizeField();
}
function sizeField(){
  const box=canvasBox();
  field.style.width=box.w+'px';
  field.style.height=box.h+'px';
  const availW=body.clientWidth-16, availH=body.clientHeight-16;
  const fit=Math.max(.05,Math.min(availW/box.w,availH/box.h,1));
  field.style.transform=`scale(${fit})`;
  field.style.perspective='1200px';
}
/* Vẽ tách khỏi vòng rAF: lúc KÉO gọi thẳng paint() nên quả cầu bám tay kể cả
   khi trình duyệt đang tiết lưu rAF (tab nền, cửa sổ bị che). rAF chỉ còn lo
   phần trôi theo quán tính sau khi thả. */
function paint(){
  const n=nodes.length;
  for(let i=0;i<n;i++){
    const p=place(i,n,rot);
    const el=nodes[i];
    el.style.transform=`translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,${p.z.toFixed(2)}px) `+
      `rotateY(${p.rotY.toFixed(2)}deg) scale(${p.scale.toFixed(3)})`;
    el.style.opacity=p.opacity.toFixed(3);
    el.style.zIndex=String(p.zi);
  }
}
function tick(){
  if(!dragging&&Math.abs(rotVel)>0.01){rot+=rotVel;rotVel*=0.94;paint();}
  raf=requestAnimationFrame(tick);
}

/* ── kéo để xoay, có quán tính ── */
let moved=false;
function wireDrag(){
  body.addEventListener('pointerdown',ev=>{
    if(ev.button!==0||!ev.isPrimary||openIdx>=0)return;
    dragging=true;moved=false;rotVel=0;
    const startX=ev.clientX, startRot=rot;
    let lastX=startX, lastT=performance.now();
    const hint=document.getElementById('sphHint');
    const move=e=>{
      if(!e.isPrimary)return;
      const dx=e.clientX-startX;
      if(Math.abs(dx)>4){moved=true;if(hint)hint.classList.add('gone');}
      const now=performance.now(), dt=now-lastT;
      if(dt>0)rotVel=((e.clientX-lastX)*SPH.DRAG/dt)*16;
      lastX=e.clientX;lastT=now;
      rot=startRot+dx*SPH.DRAG;
      paint();
    };
    const up=keep=>{
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',onUp);
      window.removeEventListener('pointercancel',onCancel);
      window.removeEventListener('blur',onBlur);
      dragging=false;
      if(!keep||!moved||Math.abs(rotVel)<0.4)rotVel=0;
      /* nhả chuột xong mới cho click mở lá trở lại */
      setTimeout(()=>{moved=false;},0);
    };
    const onUp=e=>{if(e.isPrimary)up(true);};
    const onCancel=e=>{if(e.isPrimary)up(false);};
    const onBlur=()=>up(false);
    window.addEventListener('pointermove',move);
    window.addEventListener('pointerup',onUp);
    window.addEventListener('pointercancel',onCancel);
    window.addEventListener('blur',onBlur);
  });
  window.addEventListener('resize',()=>{if(field){sizeField();paint();}});
}

/* ═══════════════════════════════════════════════════════════════
   8. MỞ / ĐÓNG
   ═══════════════════════════════════════════════════════════════ */
function openCard(i){
  openIdx=i;
  const card=DECK[i];
  const hasPrev=i>0, hasNext=i<DECK.length-1;
  document.getElementById('sphOpenIn').innerHTML=`
    ${openFaceHTML(card)}
    <div class="sph-open-bar">
      <button class="sph-btn" onclick="stepCard(-1)" ${hasPrev?'':'disabled'} aria-label="Lá trước"><i class="bx bx-chevron-left"></i></button>
      <button class="sph-btn sph-btn-gold" onclick="closeCard()"><i class="bx bx-x"></i> Về quả cầu</button>
      <button class="sph-btn" onclick="stepCard(1)" ${hasNext?'':'disabled'} aria-label="Lá tiếp"><i class="bx bx-chevron-right"></i></button>
    </div>`;
  document.getElementById('sphOpen').classList.add('on');
}
function stepCard(delta){
  const next=openIdx+delta;
  if(next<0||next>=DECK.length)return;
  openCard(next);
}
function closeCard(){
  openIdx=-1;
  const el=document.getElementById('sphOpen');
  if(el)el.classList.remove('on');
}
function openSphere(){
  const el=ensureStage();
  el.classList.add('open');
  closeCard();
  sizeField();paint();
  requestAnimationFrame(()=>{sizeField();paint();if(!raf)raf=requestAnimationFrame(tick);});
}
function closeSphere(){
  const el=document.getElementById('sphStage');
  if(el)el.classList.remove('open');
  closeCard();
  if(raf){cancelAnimationFrame(raf);raf=0;}
}

document.addEventListener('keydown',ev=>{
  const el=document.getElementById('sphStage');
  if(!el||!el.classList.contains('open'))return;
  if(ev.key==='Escape'){openIdx>=0?closeCard():closeSphere();}
  if(openIdx>=0&&ev.key==='ArrowRight')stepCard(1);
  if(openIdx>=0&&ev.key==='ArrowLeft')stepCard(-1);
});

Object.assign(window,{openSphere,closeSphere,openCard,closeCard,stepCard});
})();
