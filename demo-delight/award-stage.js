/* ═══════════════════════════════════════════════════════════════════════════
   SÂN KHẤU TRAO GIẢI — Opt 6 của "Dấu ấn của bạn" (chị chốt 11/10/2026)
     Lễ vinh danh "Đại sứ văn hóa phản hồi". MC Moni đứng sau micro.
     Mở màn: rèm nhung kéo ra, đèn quét, khán giả vỗ tay.
     Phần NHẬN, mỗi metric một giải hạ xuống bục trong ánh đèn:
       Cúp (phản hồi đã nhận) - Bó hoa (kết nối đáng nhớ)
       Huy chương (giá trị được ghi nhận) - Bằng khen (điểm mạnh)
     Phần CHO ĐI: bảng thành tích phản hồi đã trao, tim cảm ơn (máy bay giấy,
       tim bay từ bục ra khán giả).
     Kết: pháo hoa chúc mừng + lời động viên, rồi poster dạng giấy chứng nhận.
   Số liệu: window.DauAn (dau-an-model.js). File này chỉ dựng giao diện.
   Trang nạp: award-stage.css, dau-an-model.js, award-stage.js, rồi gọi openAward().
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
const D=window.DauAn, U=D.USER, H=D.highlights();
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CV_DIR='../Core%20value%20with%20BG/';
const M='../assets/mascot/';
/* Chữ cái đầu như avatar ở E-04: họ + tên (Nguyễn Văn Tú thành NT) */
const ME=(w=>(w[0][0]+(w.length>1?w[w.length-1][0]:'')).toUpperCase())(U.name.trim().split(/\s+/));

/* ═══ Giải thưởng vẽ bằng SVG (vàng kim, hồng MoMo). Mỗi lần vẽ một bộ id
   gradient riêng để nhiều bản trên cùng trang không giẫm lên nhau. ═══ */
let gid=0;
const GOLD=(id)=>`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF0B8"/><stop offset=".45" stop-color="#F2B41F"/><stop offset="1" stop-color="#B8760A"/></linearGradient>`;
const PRIZE={
  trophy:()=>{const g='g'+(++gid);return `<svg viewBox="0 0 120 140" aria-hidden="true"><defs>${GOLD(g)}</defs>
    <path d="M30 18 C10 18 8 50 34 56" fill="none" stroke="url(#${g})" stroke-width="7" stroke-linecap="round"/>
    <path d="M90 18 C110 18 112 50 86 56" fill="none" stroke="url(#${g})" stroke-width="7" stroke-linecap="round"/>
    <path d="M28 10 H92 V40 C92 64 78 78 60 80 C42 78 28 64 28 40 Z" fill="url(#${g})" stroke="#9A5E00" stroke-width="2"/>
    <path d="M38 16 V38 C38 52 44 62 52 68" fill="none" stroke="#FFF8DC" stroke-width="4" stroke-linecap="round" opacity=".7"/>
    <path d="M60 30 L64 39 L74 40 L66 46 L69 56 L60 50 L51 56 L54 46 L46 40 L56 39 Z" fill="#A50064"/>
    <path d="M52 80 H68 V98 H52 Z" fill="url(#${g})" stroke="#9A5E00" stroke-width="2"/>
    <path d="M36 98 H84 V112 H36 Z" fill="url(#${g})" stroke="#9A5E00" stroke-width="2"/>
    <path d="M28 112 H92 V130 H28 Z" fill="#A50064" stroke="#6E0043" stroke-width="2"/>
    <path d="M44 121 H76" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/></svg>`;},
  bouquet:()=>`<svg viewBox="0 0 120 140" aria-hidden="true">
    <path d="M58 70 L44 40 M60 70 L60 30 M62 70 L78 38 M58 70 L30 56 M62 70 L92 54" stroke="#2F8F5B" stroke-width="3" fill="none"/>
    <ellipse cx="34" cy="50" rx="10" ry="6" fill="#4CB07A" transform="rotate(-30 34 50)"/><ellipse cx="88" cy="48" rx="10" ry="6" fill="#4CB07A" transform="rotate(30 88 48)"/>
    ${[[44,34,'#F64F9E'],[60,22,'#FFC219'],[78,32,'#F64F9E'],[30,52,'#C4B5FD'],[92,50,'#C4B5FD']].map(([x,y,c])=>
      [0,72,144,216,288].map(a=>`<circle cx="${x}" cy="${y-7}" r="6" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`).join('')+`<circle cx="${x}" cy="${y}" r="4.5" fill="#FFF0B8"/>`).join('')}
    <path d="M36 66 H84 L66 132 H54 Z" fill="#FFE4F0" stroke="#A50064" stroke-width="2.5"/>
    <path d="M42 66 L60 132 M78 66 L60 132" stroke="#F9A8D4" stroke-width="2"/>
    <path d="M48 92 C40 100 34 104 30 112 M72 92 C80 100 86 104 90 112" stroke="#A50064" stroke-width="5" stroke-linecap="round" fill="none"/>
    <ellipse cx="60" cy="92" rx="9" ry="7" fill="#A50064"/></svg>`,
  medal:()=>{const g='g'+(++gid);return `<svg viewBox="0 0 120 140" aria-hidden="true"><defs>${GOLD(g)}</defs>
    <path d="M36 4 H56 L72 58 H52 Z" fill="#A50064"/><path d="M84 4 H64 L48 58 H68 Z" fill="#F64F9E"/>
    <path d="M44 4 H50 L62 50" stroke="#FFE4F0" stroke-width="3" fill="none" opacity=".6"/>
    <circle cx="60" cy="90" r="38" fill="url(#${g})" stroke="#9A5E00" stroke-width="2.5"/>
    <circle cx="60" cy="90" r="28" fill="none" stroke="#FFF8DC" stroke-width="2.5" opacity=".8"/>
    <path d="M60 70 L66 83 L80 84 L69 93 L73 107 L60 99 L47 107 L51 93 L40 84 L54 83 Z" fill="#A50064"/></svg>`;},
  cert:()=>`<svg viewBox="0 0 120 140" aria-hidden="true">
    <rect x="10" y="22" width="100" height="76" rx="4" fill="#FFFBF2" stroke="#E8A317" stroke-width="3"/>
    <rect x="17" y="29" width="86" height="62" rx="2" fill="none" stroke="#F2D27A" stroke-width="1.5"/>
    <path d="M36 42 H84" stroke="#A50064" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 56 H90 M34 66 H86 M40 76 H70" stroke="#C9A46A" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M78 96 L72 128 L82 120 L90 130 L94 98 Z" fill="#A50064"/>
    <circle cx="86" cy="92" r="16" fill="#F2B41F" stroke="#9A5E00" stroke-width="2"/>
    <path d="M86 82 L89 89 L96 89 L90 94 L92 101 L86 97 L80 101 L82 94 L76 89 L83 89 Z" fill="#A50064"/></svg>`,
  plane:()=>`<svg viewBox="0 0 120 140" aria-hidden="true">
    <path d="M10 70 L110 30 L80 116 L60 82 Z" fill="#FFFFFF" stroke="#0F766E" stroke-width="3" stroke-linejoin="round"/>
    <path d="M60 82 L110 30 M60 82 L56 108 L70 96" fill="#D7F5E8" stroke="#0F766E" stroke-width="3" stroke-linejoin="round"/>
    <path d="M10 104 C24 98 30 110 44 104" stroke="#34D399" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="4 6"/></svg>`,
  heart:()=>`<svg viewBox="0 0 120 140" aria-hidden="true">
    <path d="M60 118 C26 92 8 72 12 48 C16 26 42 18 60 40 C78 18 104 26 108 48 C112 72 94 92 60 118 Z" fill="#F64F9E" stroke="#A50064" stroke-width="3"/>
    <path d="M30 46 C32 38 38 34 46 34" stroke="#FFE4F0" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M86 18 L89 26 L97 27 L91 32 L93 40 L86 36 L79 40 L81 32 L75 27 L83 26 Z" fill="#FFC219"/></svg>`
};
const MIC=`<svg class="awd-mic" viewBox="0 0 44 130" aria-hidden="true">
  <path d="M22 40 V122" stroke="#2B2B33" stroke-width="4"/><path d="M8 126 H36" stroke="#2B2B33" stroke-width="5" stroke-linecap="round"/>
  <path d="M22 44 L8 26" stroke="#2B2B33" stroke-width="4" stroke-linecap="round"/>
  <rect x="-1" y="6" width="14" height="24" rx="7" fill="#3F3F46" transform="rotate(-38 6 18)"/>
  <rect x="1" y="9" width="10" height="9" rx="4" fill="#A1A1AA" transform="rotate(-38 6 18)"/></svg>`;

/* ═══ Các bước của lễ trao giải ═══ */
const COLORS=['#F64F9E','#7C3AED','#2563EB'];
const maxV=(H.values[0]||{}).n||1;
const STEPS=[
  { kind:'get', prize:'trophy', mc:'cheer', name:'Cúp Lắng nghe cởi mở',
    body:()=>`<p class="awd-p pop" style="--d:.3s">Trao cho người đã đón nhận thật nhiều góc nhìn từ đồng nghiệp trong năm ${U.year}.</p>
      <div class="awd-nums pop" style="--d:.45s"><div class="awd-num"><div class="n">${H.total}</div><div class="l">phản hồi đã nhận</div></div>
        <div class="awd-num"><div class="n">${H.people}</div><div class="l">đồng nghiệp đã gửi</div></div></div>` },
  { kind:'get', prize:'bouquet', mc:'wink', name:'Hoa từ người đồng hành',
    body:()=>`<p class="awd-p pop" style="--d:.3s">Bó hoa này đến từ những người gửi bạn nhiều phản hồi nhất:</p>
      <div class="awd-names">${H.connect.map((n,k)=>`<div class="awd-name pop" style="--d:${(.45+k*.15).toFixed(2)}s"><i style="background:${COLORS[k%3]}">${k+1}</i>${esc(n)}</div>`).join('')}</div>` },
  { kind:'get', prize:'medal', mc:'wave', name:'Huy chương Dấu ấn giá trị',
    body:()=>`<p class="awd-p pop" style="--d:.3s">Những giá trị đồng nghiệp ghi nhận ở bạn:</p>
      <div class="awd-vals">${H.values.map((v,k)=>`<div class="awd-val pop" style="--d:${(.45+k*.12).toFixed(2)}s"><img src="${CV_DIR}${v.art}" alt=""/>
        <span class="nm">${esc(v.name)}</span><span class="bar"><b style="--w:${Math.round(v.n/maxV*100)}%;--d:${(.7+k*.12).toFixed(2)}s"></b></span><span class="ct">${v.n} lượt</span></div>`).join('')}</div>` },
  { kind:'get', prize:'cert', mc:'idle', name:'Bằng khen Điều được trân trọng',
    body:()=>`<p class="awd-p pop" style="--d:.3s">Ghi nhận những điểm mạnh mọi người trân trọng ở bạn:</p>
      <ul class="awd-strs">${H.strengths.map((s,k)=>`<li class="pop" style="--d:${(.45+k*.15).toFixed(2)}s"><i class="bx bxs-star"></i><span>${esc(s)}</span></li>`).join('')}</ul>` },
  { kind:'give', prize:'plane', mc:'run', fly:'plane', name:'Thành tích lan tỏa',
    body:()=>`<p class="awd-p pop" style="--d:.3s">Một đại sứ không chỉ nhận mà còn trao đi:</p>
      <div class="awd-nums pop" style="--d:.45s"><div class="awd-num"><div class="n">${H.given.total}</div><div class="l">phản hồi đã trao đi</div></div>
        <div class="awd-num"><div class="n">${H.given.people}</div><div class="l">đồng nghiệp đã nhận</div></div></div>
      <p class="awd-p pop" style="--d:.65s">Mỗi phản hồi bạn viết là một món quà giúp đồng nghiệp lớn lên.</p>` },
  { kind:'give', prize:'heart', mc:'shy', fly:'heart', name:'Những trái tim cảm ơn',
    body:()=>`<div class="awd-nums pop" style="--d:.3s"><div class="awd-num"><div class="n">${H.hearts.given}</div><div class="l">tim bạn đã trao đi</div></div>
        <div class="awd-num"><div class="n">${H.hearts.received}</div><div class="l">tim cảm ơn nhận được</div></div></div>
      <p class="awd-p pop" style="--d:.5s">Cảm ơn qua lại là cách văn hóa phản hồi trở nên ấm áp mỗi ngày.</p>` }
];
const N=STEPS.length;
const MC_POSE={cheer:'cheer.png',wink:'wink.png',wave:'wave.png',idle:'idle.png',run:'run.png',shy:'shy-love.png',think:'think.png'};
const mcHTML=(pose,hop)=>`<div class="awd-mc${hop?' hop':''}"><div class="bd"><img src="${M}${MC_POSE[pose]}" alt=""/></div></div>${MIC}`;

function prizeCard(k){
  const s=STEPS[k], nGet=STEPS.filter(x=>x.kind==='get').length, i=STEPS.filter((x,j)=>x.kind===s.kind&&j<=k).length;
  const kick=s.kind==='get'?`Giải thưởng ${i} / ${nGet}`:`Phần cho đi ${i} / ${N-nGet}`;
  return `<div class="awd-card"><span class="awd-kick${s.kind==='give'?' give':''} pop" style="--d:0s">${kick}</span>
    <div class="awd-h pop" style="--d:.1s">${esc(s.name)}</div><span class="awd-line pop" style="--d:.2s"></span>${s.body()}</div>`;
}
function openingCard(){
  return `<div class="awd-card"><span class="awd-kick pop" style="--d:0s">Lễ vinh danh năm ${U.year}</span>
    <div class="awd-h big pop" style="--d:.1s">Đại sứ văn hóa phản hồi</div><span class="awd-line pop" style="--d:.2s"></span>
    <p class="awd-p pop" style="--d:.3s">Kính mời <b>${esc(U.name)}</b> bước lên sân khấu!</p>
    <p class="awd-p pop" style="--d:.45s">Năm qua bạn đã đón nhận và trao đi thật nhiều phản hồi. Hôm nay là lúc những điều đó được vinh danh.</p>
    <button class="awd-cta pop" style="--d:.6s" onclick="awardGo(0)"><i class="bx bxs-star"></i> Lên sân khấu</button></div>`;
}
function celebrateCard(){
  return `<div class="awd-card"><span class="awd-kick pop" style="--d:0s">Chúc mừng</span>
    <div class="awd-h big gold pop" style="--d:.1s">Đại sứ văn hóa phản hồi ${U.year}</div><span class="awd-line pop" style="--d:.2s"></span>
    <p class="awd-p pop" style="--d:.3s"><b>${esc(U.name)}</b> đã nhận đủ 4 giải thưởng và lan tỏa ${H.given.total} phản hồi tới ${H.given.people} đồng nghiệp.</p>
    <p class="awd-p pop" style="--d:.45s">Văn hóa phản hồi lớn lên từ những người như bạn: lắng nghe cởi mở, ghi nhận chân thành và dám góp ý để cùng tiến bộ.</p>
    <p class="awd-p pop" style="--d:.6s">Hãy tiếp tục trao đi những lời tử tế, để mỗi đồng nghiệp quanh bạn đều tỏa sáng!</p></div>`;
}
const flyHTML=kind=>kind?`<div class="awd-fly">${Array.from({length:10},(_,k)=>{
  const x=(k%2?1:-1)*(80+k*28), y=kind==='heart'?-(160+k*14):(-60+(k%3)*40);
  return `<i class="bx ${kind==='heart'?'bxs-heart':'bxs-paper-plane'}" style="--c:${kind==='heart'?['#F64F9E','#FFC219','#FDA4CF'][k%3]:'#34D399'};--s:${18+(k%3)*6}px;--x:${kind==='heart'?x*.6:x*1.4}px;--y:${y}px;--r:${k*20-60}deg;--du:${2.2+(k%4)*.4}s;--dl:${(k*.3).toFixed(1)}s"></i>`;}).join('')}</div>`:'';
function fxHTML(){
  const fw=[[22,24,'#FFC219'],[78,18,'#F64F9E'],[50,12,'#FFE08A'],[88,46,'#C4B5FD'],[12,50,'#34D399']].map(([x,y,c],j)=>
    `<span class="awd-fw" style="left:${x}%;top:${y}%">${Array.from({length:14},(_,k)=>`<i style="--a:${k*360/14}deg;--c:${c};--dl:${(j*.35).toFixed(2)}s"></i>`).join('')}</span>`).join('');
  const conf=Array.from({length:36},(_,k)=>`<i style="left:${(k*2.8)%100}%;background:${['#FFC219','#F64F9E','#A50064','#C4B5FD','#34D399','#FFFFFF'][k%6]};--du:${4+(k%5)}s;--dl:${-(k*.37%5).toFixed(2)}s;--x:${(k%2?1:-1)*(20+k%5*12)}px"></i>`).join('');
  return `<div class="awd-fx">${fw}<div class="awd-conf">${conf}</div></div>`;
}

/* Poster: giấy chứng nhận, nội dung theo khung 3 phần đã chốt. */
function posterHTML(){
  const st=(n,l)=>`<div class="ac-stat"><div class="n">${n}</div><div class="l">${esc(l)}</div></div>`;
  return `<div class="awd-cert"><span class="ac-corner tl"></span><span class="ac-corner tr"></span>
    <div class="ac-hd"><div class="ac-brand"><span class="awd-logo"><span>M</span></span>MoMo HRM</div>
      <div class="ac-eyebrow">Giấy chứng nhận</div>
      <div class="ac-ttl">Đại sứ văn hóa phản hồi ${U.year}</div>
      <div class="ac-to">Trân trọng trao tặng</div><div class="ac-name">${esc(U.name)}</div>
      <div class="ac-who">${H.total} phản hồi từ ${H.people} đồng nghiệp</div></div>
    <div class="ac-sec"><span class="ac-kick">Bạn trong mắt đồng nghiệp</span>
      <div class="ac-sub">Giá trị được ghi nhận</div>
      <div class="ac-vals">${H.values.map(v=>`<div class="ac-val${v.n===maxV?' top':''}"><img src="${CV_DIR}${v.art}" alt=""/><span class="nm">${esc(v.name)}</span><span class="ct">${v.n} lượt</span></div>`).join('')}</div>
      <div class="ac-sub">Điều mọi người trân trọng</div>
      <ul class="ac-str">${H.strengths.map(x=>`<li><i class="bx bxs-star"></i><span>${esc(x)}</span></li>`).join('')}</ul>
      ${H.quotes.slice(0,2).map(q=>`<div class="ac-q">${esc(q)}</div>`).join('')}</div>
    <div class="ac-sec"><span class="ac-kick give">Bạn đã lan tỏa</span>
      <div class="ac-stats">${st(H.given.total,'phản hồi đã trao đi')}${st(H.given.people,'đồng nghiệp đã nhận')}${st(H.hearts.received,'tim cảm ơn nhận được')}${st(H.hearts.given,'tim bạn đã trao đi')}</div></div>
    <div class="ac-sec"><span class="ac-kick">Cảm ơn những người đồng hành</span>
      <div class="ac-end"><div class="ac-end-txt"><div class="ac-names">${H.connect.map(n=>`<span>${esc(D.posterName(n))}</span>`).join('')}</div>
        <div class="ac-sig">Cùng nhau tỏa sáng!</div></div>
        <span class="ac-seal">${PRIZE.medal()}</span><img class="ac-moni" src="${M}shy-love.png" alt=""/></div></div>
  </div>`;
}

/* ═══ Khung popup ═══ */
const LIGHTS=Array.from({length:22},(_,k)=>`<i style="left:${2+k*4.55}%;--y:${8+Math.abs(Math.sin(k*.8))*16}px;--dl:${(k%5*.3).toFixed(1)}s"></i>`).join('');
const CROWD=Array.from({length:16},(_,k)=>`<i style="--dl:${(k%4*.12).toFixed(2)}s;transform:translateY(${18+(k%3)*6}px) scale(${.9+(k%3)*.08})"></i>`).join('');
const STAGE_HTML=`
<div class="awd-stage" id="awdStage" onclick="if(event.target===this)closeAward()">
  <div class="awd-dialog" id="awdDialog" role="dialog" aria-label="Lễ vinh danh đại sứ văn hóa phản hồi">
    <div class="awd-top"><span class="awd-logo"><span>M</span></span><span class="awd-ttl">Dấu ấn của bạn</span><span class="awd-sub">Lễ vinh danh - năm ${U.year}</span>
      <button class="awd-x" onclick="closeAward()" aria-label="Đóng"><i class="bx bx-x"></i></button></div>
    <div class="awd-body" id="awdBody">
      <div class="awd-lights">${LIGHTS}</div>
      <div class="awd-floor"></div>
      <div class="awd-spot sw" style="left:28%"></div><div class="awd-spot sw b" style="left:72%"></div>
      <div class="awd-world" id="awdWorld">
        <div class="awd-left"><div class="awd-anchor">
          <div class="awd-spot main" style="left:62%;top:-190px;height:620px"></div>
          <div class="awd-podium"><b>1</b><small>Đại sứ ${U.year}</small></div>
          <div class="awd-me">${esc(ME)}<span>${esc(U.short)}</span></div>
          <div class="awd-prize" id="awdPrize"></div>
          <div class="awd-shelf" id="awdShelf"></div>
          <div id="awdFly"></div>
          <div id="awdMc"></div>
        </div></div>
        <div class="awd-right" id="awdRight"></div>
      </div>
      <div class="awd-fx-host" id="awdFx"></div>
      <div class="awd-poster-wrap" id="awdPoster" hidden></div>
      <div class="awd-crowd">${CROWD}</div>
      <div class="awd-curtain l"></div><div class="awd-curtain r"></div><div class="awd-valance"></div>
      <div class="awd-ftr" id="awdFtr"></div>
    </div>
    <div class="awd-export" id="awdExport"></div>
  </div>
</div>`;
const $=id=>document.getElementById(id);
function ensureStage(){
  if(!$('awdStage')){
    document.body.insertAdjacentHTML('beforeend',STAGE_HTML);
    /* tải sẵn mọi tư thế MC để đổi tư thế giữa các giải không bị nháy trắng */
    Object.values(MC_POSE).forEach(f=>{const im=new Image();im.src=M+f;});
  }
  return $('awdStage');
}

/* ═══ Trạng thái: -1 mở màn, 0..5 trao giải và cho đi, 6 chúc mừng, 7 poster ═══ */
let STEP=-1, timers=[];
const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
const body=()=>$('awdBody');
function setClass(c,on){body().classList.toggle(c,on);}
function show(step){
  clearTimers(); STEP=step;
  const poster=step===N+1;
  $('awdPoster').hidden=!poster; $('awdWorld').hidden=poster;
  $('awdShelf').innerHTML=''; $('awdFly').innerHTML=''; $('awdFx').innerHTML='';
  setClass('opened',step>=0||body().classList.contains('opened'));
  if(step<0){
    setClass('opened',false); setClass('spot-on',false); setClass('clap',false);
    $('awdPrize').innerHTML=''; $('awdMc').innerHTML=mcHTML('wave');
    $('awdRight').innerHTML=openingCard();
  } else if(step<N){
    const s=STEPS[step];
    setClass('spot-on',true); setClass('clap',true);
    $('awdMc').innerHTML=mcHTML(s.mc,true);
    const p=$('awdPrize'); p.classList.remove('drop');
    p.innerHTML=`<div class="rays"></div><div class="halo"></div>${PRIZE[s.prize]()}`;
    void p.offsetWidth; p.classList.add('drop');
    $('awdFly').innerHTML=flyHTML(s.fly);
    $('awdRight').innerHTML=''; later(()=>{$('awdRight').innerHTML=prizeCard(step);},450);
    later(()=>setClass('clap',false),2600);
  } else if(step===N){
    setClass('spot-on',true); setClass('clap',true);
    $('awdPrize').innerHTML=''; $('awdMc').innerHTML=mcHTML('cheer',true);
    const get=STEPS.filter(s=>s.kind==='get');
    $('awdShelf').innerHTML=get.map((s,k)=>{const a=(-54+k*36)*Math.PI/180,R=110;
      return `<span style="left:${(Math.sin(a)*R).toFixed(0)}px;top:${(-Math.cos(a)*R*.7).toFixed(0)}px;--dl:${(k*.15).toFixed(2)}s">${PRIZE[s.prize]()}</span>`;}).join('');
    $('awdFx').innerHTML=fxHTML();
    $('awdRight').innerHTML=celebrateCard();
  } else {
    setClass('spot-on',false); setClass('clap',false);
    $('awdPoster').innerHTML=posterHTML();
  }
  renderFtr();
}
/* Mở màn: rèm kéo ra, đèn quét, khán giả vỗ tay rồi trao giải đầu tiên */
function raiseCurtain(){
  if(body().classList.contains('opened')){show(0);return;}
  $('awdRight').innerHTML=''; $('awdFtr').innerHTML='';
  setClass('opened',true); setClass('clap',true);
  later(()=>show(0),1500);
}

const B=(label,fn,{primary=false,icon='',after=''}={})=>
  `<button class="awd-btn${primary?' awd-btn-primary':''}" onclick="${fn}">${icon?`<i class="bx ${icon}"></i>`:''}${label}${after?`<i class="bx ${after}"></i>`:''}</button>`;
function renderFtr(){
  let h='';
  if(STEP<0){$('awdFtr').innerHTML='';return;}
  if(STEP<N){
    const shelf=STEPS.map((s,k)=>(k===STEPS.findIndex(x=>x.kind==='give')?'<em></em>':'')+`<span class="${k<=STEP?'got':''}${k===STEP?' on':''}" title="${esc(s.name)}">${PRIZE[s.prize]()}</span>`).join('');
    h=`${B('Quay lại',`awardGo(${STEP-1})`,{icon:'bx-left-arrow-alt'})}<span class="awd-shelfbar" aria-label="Đã trao ${STEP+1} trên ${N}">${shelf}</span>
      ${B('Tải giải này',`awardDownload(${STEP},this)`,{icon:'bx-download'})}${B('Tiếp',`awardGo(${STEP+1})`,{primary:true,after:'bx-right-arrow-alt'})}`;
  } else if(STEP===N){
    h=`${B('Quay lại',`awardGo(${N-1})`,{icon:'bx-left-arrow-alt'})}${B('Nhận giấy chứng nhận',`awardGo(${N+1})`,{primary:true,after:'bx-right-arrow-alt'})}`;
  } else {
    h=`${B('Quay lại',`awardGo(${N})`,{icon:'bx-left-arrow-alt'})}${B('Xem lại từ đầu','awardGo(-1)',{icon:'bx-revision'})}${B('Tải giấy chứng nhận','awardDownloadPoster(this)',{primary:true,icon:'bx-download'})}`;
  }
  $('awdFtr').innerHTML=`<div class="awd-bar">${h}</div>`;
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
    const html2canvas=await loadH2C(), host=$('awdExport');
    host.innerHTML=html;
    await document.fonts.ready;
    await Promise.all([...host.querySelectorAll('img')].map(img=>img.complete?0:new Promise(r=>{img.onload=img.onerror=r;})));
    const canvas=await html2canvas(host.firstElementChild,{backgroundColor:null,scale:2,logging:false,useCORS:true});
    host.innerHTML='';
    const a=document.createElement('a');a.download=name;a.href=canvas.toDataURL('image/png');a.click();
  } finally { if(btn)btn.classList.remove('busy'); }
}
function downloadPrize(k,btn){
  return shoot(`<div class="awd-shot"><div class="ic">${PRIZE[STEPS[k].prize]()}</div>${prizeCard(k)}</div>`,`dai-su-phan-hoi-giai-${k+1}.png`,btn);
}
function downloadPoster(btn){return shoot(posterHTML(),'dai-su-phan-hoi-chung-nhan.png',btn);}

function openAward(){ensureStage().classList.add('open');show(-1);}
function closeAward(){const el=$('awdStage');if(el)el.classList.remove('open');clearTimers();}
document.addEventListener('keydown',ev=>{
  const el=$('awdStage'); if(!el||!el.classList.contains('open'))return;
  if(ev.key==='Escape')closeAward();
  else if(ev.key==='ArrowRight'&&STEP<N+1)(STEP<0?raiseCurtain():show(STEP+1));
  else if(ev.key==='ArrowLeft'&&STEP>-1)show(STEP-1);
});
Object.assign(window,{openAward,closeAward,awardGo:n=>(n===0&&STEP<0)?raiseCurtain():show(n),awardDownload:downloadPrize,awardDownloadPoster:downloadPoster});
})();
