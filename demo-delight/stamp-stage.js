/* ═══════════════════════════════════════════════════════════════════════════
   SÂN KHẤU QUẢ CẦU TEM — phương án 2 của "Dấu ấn của bạn"
   Dựng theo chế độ "Cầu" của bản mẫu wowUI: tem răng cưa, 10 màu tem giữ
   nguyên, kéo để xoay, mở tem thành cuốn sổ hai trang.

   Hành trình (chị chốt 11/10/2026):
     lời chào → quả cầu tự xoay một vòng → mở lần lượt 6 tem metric (Tiếp,
     Quay lại) → lời cảm ơn → poster tổng hợp. Xem xong vẫn tự xoay quả cầu và
     mở lại tem bất kỳ. Lời chào và lời cảm ơn KHÔNG nằm trên quả cầu.
   Tải ảnh: từng tem và poster. Poster có trích lời phản hồi, KHÔNG ghi tên.

   Số liệu lấy từ window.DauAn (dau-an-model.js), file này chỉ dựng giao diện.
   Trang nạp: stamp-stage.css, dau-an-model.js, stamp-stage.js, rồi gọi openStamp().
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
const D=window.DauAn, U=D.USER, H=D.highlights();

/* ═══ Hình con tem và bảng màu: chép NGUYÊN từ bản mẫu wowUI ═══ */
const STAMP_PATH="M8.458 0C9.732 4.057 13.522 7 18 7C22.478 7 26.268 4.057 27.542 0H32.458C33.732 4.057 37.522 7 42 7C46.478 7 50.268 4.057 51.542 0H56.458C57.732 4.057 61.522 7 66 7C70.478 7 74.268 4.057 75.542 0H80.458C81.732 4.057 85.522 7 90 7C94.478 7 98.268 4.057 99.542 0H104.458C105.732 4.057 109.522 7 114 7C118.478 7 122.268 4.057 123.542 0H128.458C129.732 4.057 133.522 7 138 7C142.478 7 146.268 4.057 147.542 0H152.458C153.732 4.057 157.522 7 162 7C166.478 7 170.268 4.057 171.542 0H176.458C177.732 4.057 181.522 7 186 7C190.478 7 194.268 4.057 195.542 0H200.458C201.732 4.057 205.522 7 210 7C214.478 7 218.268 4.057 219.542 0H227V12.458C222.943 13.732 220 17.522 220 22C220 26.478 222.943 30.267 227 31.541V36.458C222.943 37.732 220 41.522 220 46C220 50.478 222.943 54.267 227 55.541V60.458C222.943 61.732 220 65.522 220 70C220 74.478 222.943 78.267 227 79.541V84.458C222.943 85.732 220 89.522 220 94C220 98.478 222.943 102.267 227 103.541V108.458C222.943 109.732 220 113.522 220 118C220 122.478 222.943 126.267 227 127.541V132.458C222.943 133.732 220 137.522 220 142C220 146.478 222.943 150.267 227 151.541V156.458C222.943 157.732 220 161.522 220 166C220 170.478 222.943 174.267 227 175.541V180.458C222.943 181.732 220 185.522 220 190C220 194.478 222.943 198.267 227 199.541V204.458C222.943 205.732 220 209.522 220 214C220 218.478 222.943 222.267 227 223.541V228.458C222.943 229.732 220 233.522 220 238C220 242.478 222.943 246.267 227 247.541V252.458C222.943 253.732 220 257.522 220 262C220 266.478 222.943 270.267 227 271.541V276.458C222.943 277.732 220 281.522 220 286C220 290.478 222.943 294.267 227 295.541V300.458C222.943 301.732 220 305.522 220 310C220 314.478 222.943 318.267 227 319.541V332H219.542C218.268 327.943 214.478 325 210 325C205.522 325 201.732 327.943 200.458 332H195.542C194.268 327.943 190.478 325 186 325C181.522 325 177.732 327.943 176.458 332H171.542C170.268 327.943 166.478 325 162 325C157.522 325 153.732 327.943 152.458 332H147.542C146.268 327.943 142.478 325 138 325C133.522 325 129.732 327.943 128.458 332H123.542C122.268 327.943 118.478 325 114 325C109.522 325 105.732 327.943 104.458 332H99.542C98.268 327.943 94.478 325 90 325C85.522 325 81.732 327.943 80.458 332H75.542C74.268 327.943 70.478 325 66 325C61.522 325 57.732 327.943 56.458 332H51.542C50.268 327.943 46.478 325 42 325C37.522 325 33.732 327.943 32.458 332H27.542C26.268 327.943 22.478 325 18 325C13.522 325 9.732 327.943 8.458 332H0V319.541C4.057 318.267 7 314.478 7 310C7 305.522 4.057 301.732 0 300.458V295.541C4.057 294.267 7 290.478 7 286C7 281.522 4.057 277.732 0 276.458V271.541C4.057 270.267 7 266.478 7 262C7 257.522 4.057 253.732 0 252.458V247.541C4.057 246.267 7 242.478 7 238C7 233.522 4.057 229.732 0 228.458V223.541C4.057 222.267 7 218.478 7 214C7 209.522 4.057 205.732 0 204.458V199.541C4.057 198.267 7 194.478 7 190C7 185.522 4.057 181.732 0 180.458V175.541C4.057 174.267 7 170.478 7 166C7 161.522 4.057 157.732 0 156.458V151.541C4.057 150.267 7 146.478 7 142C7 137.522 4.057 133.732 0 132.458V127.541C4.057 126.267 7 122.478 7 118C7 113.522 4.057 109.732 0 108.458V103.541C4.057 102.267 7 98.478 7 94C7 89.522 4.057 85.732 0 84.458V79.541C4.057 78.267 7 74.478 7 70C7 65.522 4.057 61.732 0 60.458V55.541C4.057 54.267 7 50.478 7 46C7 41.522 4.057 37.732 0 36.458V31.541C4.057 30.267 7 26.478 7 22C7 17.522 4.057 13.732 0 12.458V0H8.458Z";
/* fill = màu tem, ink = màu chữ/nét trên tem (luôn đọc được trên fill) */
const THEMES=[
  {fill:'#A50064',ink:'#FFD7EC'},
  {fill:'#F64F9E',ink:'#FFE4F0'},
  {fill:'#F9A8D4',ink:'#7A1140'},
  {fill:'#7C3AED',ink:'#E9DDFF'},
  {fill:'#C4B5FD',ink:'#3F1D8A'},
  {fill:'#2563EB',ink:'#D7E6FF'},
  {fill:'#93C5FD',ink:'#12325F'},
  {fill:'#0F766E',ink:'#B9F5E3'},
  {fill:'#6EE7B7',ink:'#064E45'},
  {fill:'#FFC219',ink:'#6B3A00'}
];
/* Màu của 6 tem metric (chỉ số trong THEMES): xen sáng tối để quả cầu rực rỡ. */
const CARD_THEME=[0,9,3,6,8,1];
/* Chữ to trên polaroid trắng: tem màu đậm dùng fill, tem màu nhạt dùng ink
   (fill nhạt như vàng, xanh mint đặt trên nền trắng thì không đọc được). */
const LIGHT=new Set(['#F9A8D4','#C4B5FD','#93C5FD','#6EE7B7','#FFC219']);
const strong=t=>LIGHT.has(t.fill)?t.ink:t.fill;

const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const svgEdge=(fill,cls)=>`<svg class="${cls}" viewBox="0 0 227 332" preserveAspectRatio="none" aria-hidden="true"><path d="${STAMP_PATH}" fill="${fill}"/></svg>`;
const heart=fill=>`<svg viewBox="0 0 12 10" fill="none" aria-hidden="true"><path d="M6 9.2C2.4 6.6 1.2 4.6 2.6 3.1 3.8 1.8 5.4 2.6 6 3.9 6.6 2.6 8.2 1.8 9.4 3.1c1.4 1.5.2 3.5-3.4 6.1Z" fill="${fill}"/></svg>`;

/* Hoạ tiết "bông" của bản mẫu — 5 kiểu, mỗi tem một kiểu. */
function bloom(i,ink,o,vb){
  const f=`fill="${ink}" opacity="${o}"`;
  const st=`stroke="${ink}" stroke-width="5" fill="none" opacity="${o}" stroke-linecap="round"`;
  const c=vb/2;
  switch(i%5){
    case 0: return `${[0,60,120,180,240,300].map(a=>`<ellipse cx="${c}" cy="${c-30}" rx="15" ry="28" ${f} transform="rotate(${a} ${c} ${c})"/>`).join('')}
      <circle cx="${c}" cy="${c}" r="13" fill="${ink}" opacity="${Math.min(1,o+.3)}"/>`;
    case 1: return `<circle cx="${c}" cy="${c}" r="38" ${st}/><circle cx="${c}" cy="${c}" r="20" ${f}/>
      ${[0,90,180,270].map(a=>`<circle cx="${c}" cy="${c-52}" r="7" ${f} transform="rotate(${a} ${c} ${c})"/>`).join('')}`;
    case 2: return `${[0,72,144,216,288].map(a=>`<path d="M${c} ${c} q 20 -34 0 -54 q -20 20 0 54Z" ${f} transform="rotate(${a} ${c} ${c})"/>`).join('')}
      <circle cx="${c}" cy="${c}" r="9" fill="${ink}" opacity="${Math.min(1,o+.3)}"/>`;
    case 3: return `<path d="M${c} ${c+46} V ${c-44}" ${st}/>
      ${[-1,1].map(s=>[0,1,2].map(j=>`<ellipse cx="${c+s*21}" cy="${c-24+j*24}" rx="18" ry="10" ${f} transform="rotate(${s*24} ${c+s*21} ${c-24+j*24})"/>`).join('')).join('')}`;
    default: return `${[0,45,90,135].map(a=>`<rect x="${c-6}" y="${c-46}" width="12" height="92" rx="6" ${f} transform="rotate(${a} ${c} ${c})"/>`).join('')}
      <circle cx="${c}" cy="${c}" r="11" fill="${ink}" opacity="${Math.min(1,o+.3)}"/>`;
  }
}
const svgBloom=(i,ink,o,vb,cls)=>`<svg class="${cls}" viewBox="0 0 ${vb} ${vb}" fill="none" aria-hidden="true">${bloom(i,ink,o,vb)}</svg>`;

/* ═══ 6 tem metric — thứ tự theo yêu cầu của chị ═══ */
const topVal=H.values[0];
const CV_DIR='../Core%20value%20with%20BG/';
const CARDS=[
  /* pair: hai con số ngang hàng trên polaroid (cùng cỡ, cùng màu). Trang phải
     không nhắc lại số đã có trên polaroid, chỉ mang thông điệp (góp ý 11/10/2026). */
  { face:'Lời ghi nhận', title:'Phản hồi đã nhận',
    pair:[[H.total,'phản hồi đã nhận'],[H.people,'đồng nghiệp đã gửi']], cap:'Góc nhìn đa chiều',
    body:`<div>Mỗi phản hồi là một góc nhìn từ đồng nghiệp, giúp bạn hiểu mình rõ hơn.</div>
          <div>Đón nhận cởi mở, bạn sẽ thấy phản hồi không chỉ để nhìn lại mà còn chỉ đường cho bước tiếp theo.</div>` },
  { face:'Người đồng hành', title:'Kết nối đáng nhớ',
    big:'Top '+H.connect.length, sm:true, sub:'người gửi bạn nhiều phản hồi nhất', cap:'Những người đồng hành',
    body:`${H.connect.map((n,i)=>`<div class="p-row"><span class="no">${i+1}.</span><span class="nm"><b>${esc(n)}</b></span></div>`).join('')}
          <div>Cảm ơn những người đã dành thời gian quan sát và nói cho bạn biết điều họ thấy.</div>` },
  { face:'Giá trị tỏa sáng', title:'Dấu ấn bạn để lại',
    img:topVal&&topVal.art, cap:topVal?topVal.name:'',
    body:`<div>Số lượt đồng nghiệp ghi nhận:</div>
          ${H.values.map(v=>`<div class="p-row"><img class="cv" src="${CV_DIR}${v.art}" alt=""/><span class="nm">${esc(v.name)}</span><span class="ct">${v.n}</span></div>`).join('')}` },
  { face:'Điều được trân trọng', title:'Điều mọi người trân trọng về bạn',
    big:H.strengths.length, sub:'điểm mạnh được ghi nhận', cap:'Điểm mạnh của bạn',
    body:H.strengths.map(s=>`<div class="p-bul"><span>${esc(s)}</span></div>`).join('') },
  { face:'Bạn đã trao đi', title:'Phản hồi bạn trao đi',
    pair:[[H.given.total,'phản hồi đã trao đi'],[H.given.people,'đồng nghiệp đã nhận']], cap:'Người lan tỏa',
    body:`<div>Mỗi phản hồi bạn viết là một món quà: bạn đã dành thời gian quan sát, chọn lời chân thành và giúp đồng nghiệp thấy điều họ chưa thấy.</div>
          <div>Cảm ơn bạn đã góp phần lan tỏa văn hóa phản hồi.</div>` },
  { face:'Những trái tim', title:'Những trái tim cảm ơn',
    pair:[[H.hearts.received,'tim cảm ơn nhận được'],[H.hearts.given,'tim bạn đã trao đi']], cap:'Cảm ơn qua lại',
    body:`<div>Một trái tim gửi người đã góp ý cho mình là cách nói: mình đã lắng nghe.</div>
          <div>Cho đi và đón nhận lời cảm ơn giúp phản hồi trở thành thói quen tử tế mỗi ngày.</div>` }
].map((c,i)=>({...c,i,theme:THEMES[CARD_THEME[i]]}));
const N=CARDS.length;

/* ═══ Markup từng phần ═══ */
function stampHTML(c){
  const t=c.theme, col=t.ink;
  return `<div class="stp-stamp">${svgEdge(t.fill,'edge')}${svgBloom(c.i,col,.5,175,'art')}
    <div class="frame" style="border-color:${col};opacity:.9"></div>
    <div class="day" style="color:${col}">${pad(c.i+1)}</div>
    <div class="mon" style="color:${col}">${esc(c.face)}</div></div>`;
}
function pageHTML(c,inner){
  return `<div class="stp-pg" style="--ink:${c.theme.ink};--fill:${c.theme.fill}">${svgEdge(c.theme.fill,'stp-pg-bg')}${inner}</div>`;
}
function leftPage(c){
  const t=c.theme;
  return `<div class="p-date">DẤU ẤN CỦA BẠN - ${U.year}</div>
    <div class="p-lab">Tem</div><div class="p-val">${pad(c.i+1)} / ${pad(N)}</div><div class="p-rule"></div>
    <div class="pola-wrap"><div class="pola">
      ${c.pair?`<div class="pola-pair" style="color:${strong(t)}">${c.pair.map(([n,l])=>`<div class="pp"><div class="n">${esc(n)}</div><div class="l">${esc(l)}</div></div>`).join('')}</div>`
      :c.img?`<div class="pola-win"><img src="${CV_DIR}${c.img}" alt="${esc(c.cap)}"/></div>`
             :`<div class="pola-big" style="color:${strong(t)}"><div class="b1${c.sm?' sm':''}">${esc(c.big)}</div><div class="b2">${esc(c.sub)}</div></div>`}
      <div class="pola-cap"><span>${esc(c.cap)}</span>${heart(t.fill)}</div>
    </div><div class="tape"></div></div>`;
}
function rightPage(c){
  return `<div class="p-title">${esc(c.title)}</div>${svgBloom(c.i,c.theme.ink,.85,100,'p-motif')}
    <div class="p-lines">${'<i></i>'.repeat(9)}</div>
    <div class="p-body">${c.body}</div>
    <div class="p-stamp">Dấu ấn ${U.year}</div>`;
}
function bookHTML(c){
  return `<div class="stp-spine"></div>
    <div class="stp-leaf stp-leaf-l">
      <div class="stp-face">${pageHTML(c,leftPage(c))}</div>
      <div class="stp-face stp-face-back"><div class="stp-cover">${stampHTML(c)}</div></div>
    </div>
    <div class="stp-leaf stp-leaf-r">
      <div class="stp-face">${pageHTML(c,rightPage(c))}</div>
      <div class="stp-face stp-face-back">${pageHTML(c,'')}</div>
    </div>`;
}
/* Bộ tem ở màn lời chào: đủ 6 tem, xếp 3 x 2 hơi lệch như tem dán sổ,
   tem nào cũng thấy số và tên (góp ý 11/10/2026: chỉ 3 tem thì thấy ít). */
const COLLAGE=[[-6,0],[4,-8],[-3,6],[5,4],[-5,-4],[3,8]];
function collageHTML(list){
  return `<div class="stp-collage">${list.map((c,k)=>`<div class="stp-cl" style="transform:rotate(${COLLAGE[k][0]}deg) translateY(${COLLAGE[k][1]}px)">
    <div class="stp-float ${k%2?'fb':'fa'}" style="--fd:${(5+k*.7).toFixed(1)}s;--fdelay:${(k*.3).toFixed(1)}s">${stampHTML(c)}</div></div>`).join('')}</div>`;
}
function confettiHTML(count){
  let out='';
  for(let k=0;k<count;k++){
    const t=THEMES[k%THEMES.length], h=Math.abs(Math.sin(k*12.9898))*1;
    out+=`<i style="left:${(h*100).toFixed(1)}%;background:${t.fill};--fd:${(6+(k%5)*1.3).toFixed(1)}s;--fdelay:${(-(k*0.73)%7).toFixed(2)}s;--fx:${((k%2?1:-1)*(20+k%4*14))}px;transform:rotate(${k*37}deg)"></i>`;
  }
  return `<div class="stp-confetti">${out}</div>`;
}
function welcomeHTML(){
  return `${confettiHTML(26)}<div class="stp-hero"><div class="stp-hero-in">
    <div class="stp-hero-txt">
      <div class="stp-kicker">Dấu ấn của bạn - năm ${U.year}</div>
      <div class="stp-hello">Chào ${esc(U.short)}!</div>
      <p class="stp-lead">Chào mừng bạn đến với hành trình nhìn lại những phản hồi bạn đã nhận và đã trao đi trong năm qua.</p>
      <p class="stp-lead">Mỗi phản hồi nhận được là một góc nhìn giúp bạn hiểu mình hơn. Mỗi lời bạn trao đi giúp đồng nghiệp cùng lớn lên.</p>
      <p class="stp-lead">Mở từng con tem để thấy bạn đã phát triển và lan tỏa thế nào nhé.</p>
      <button class="stp-btn stp-btn-primary" style="margin-top:18px;padding:9px 20px;font-size:13px" onclick="stampGo(0)">Bắt đầu <i class="bx bx-right-arrow-alt"></i></button>
    </div>
    ${collageHTML(CARDS)}
  </div></div>`;
}
/* Lời cảm ơn: mascot MoMo cầm tim (assets/mascot/heart.png), không xoè tem. */
function thanksHTML(){
  return `${confettiHTML(30)}<div class="stp-hero"><div class="stp-hero-in">
    <div class="stp-hero-txt stp-thanks-txt">
      <div class="stp-hello stp-one">Cảm ơn ${esc(U.short)}!</div>
      <p class="stp-lead">Cảm ơn bạn đã cùng MoMo xây dựng văn hóa phản hồi liên tục: lắng nghe cởi mở, ghi nhận chân thành và góp ý để cùng tiến bộ.</p>
      <p class="stp-lead">Mỗi phản hồi hôm nay là một bước để ngày mai mỗi người, và cả MoMo, làm tốt hơn.</p>
      <p class="stp-lead">Hãy tiếp tục trao đi và đón nhận phản hồi, để chúng ta cùng tỏa sáng.</p>
    </div>
    <div class="stp-mascot"><img src="../assets/mascot/heart.png" alt=""/></div>
  </div></div>`;
}

/* Poster: kể chuyện 3 phần, đọc từ trên xuống (chị chốt 11/10/2026)
     1. Bạn trong mắt đồng nghiệp: giá trị (kèm mascot core value), điểm mạnh, 2 lời trích
     2. Bạn đã lan tỏa: 4 con số ngang hàng (phản hồi trao, người nhận, tim nhận, tim trao)
     3. Cảm ơn người đồng hành: tên dạng "Tên Họ", lời kết và mascot cầm tim
   Lời trích KHÔNG ghi tên người viết. */
function posterHTML(){
  const dots=Array.from({length:22},(_,k)=>{const t=THEMES[k%THEMES.length],sz=6+(k*7)%10;
    return `<i style="left:${(Math.abs(Math.sin(k*3.7))*96).toFixed(1)}%;top:${(Math.abs(Math.cos(k*5.3))*96).toFixed(1)}%;width:${sz}px;height:${sz}px;background:${t.fill};opacity:.35"></i>`;}).join('');
  const T=i=>CARDS[i].theme;
  const stat=(i,n,l)=>`<div class="ps-stat" style="background:${T(i).fill};color:${T(i).ink}"><div class="n">${n}</div><div class="l">${esc(l)}</div></div>`;
  const max=H.values.length?H.values[0].n:0;
  return `<div class="stp-poster">
    <div class="ps-dots">${dots}</div>
    <div class="ps-hd">
      <div class="ps-brand"><span class="stp-logo"><span>M</span></span>MoMo HRM</div>
      <div class="ps-ttl">Dấu ấn của ${esc(U.short)}</div>
      <div class="ps-who">Năm ${U.year} - ${H.total} phản hồi từ ${H.people} đồng nghiệp</div>
    </div>

    <section class="ps-sec">
      <div class="ps-kick"><i style="background:${T(2).fill}"></i>Bạn trong mắt đồng nghiệp</div>
      <div class="ps-sub">Giá trị được ghi nhận</div>
      <div class="ps-vals">${H.values.map(v=>`<div class="ps-val${v.n===max?' top':''}">
        <img src="${CV_DIR}${v.art}" alt=""/><span class="nm">${esc(v.name)}</span><span class="ct">${v.n} lượt</span></div>`).join('')}</div>
      <div class="ps-sub">Điều mọi người trân trọng</div>
      <ul class="ps-str">${H.strengths.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
      <div class="ps-quotes">${H.quotes.slice(0,2).map((q,k)=>`<div class="ps-q" style="--qc:${strong(T(k?5:0))}">${esc(q)}</div>`).join('')}</div>
    </section>

    <section class="ps-sec">
      <div class="ps-kick"><i style="background:${T(4).fill}"></i>Bạn đã lan tỏa</div>
      <div class="ps-stats">
        ${stat(4,H.given.total,'phản hồi đã trao đi')}${stat(3,H.given.people,'đồng nghiệp đã nhận')}
        ${stat(5,H.hearts.received,'tim cảm ơn nhận được')}${stat(0,H.hearts.given,'tim bạn đã trao đi')}
      </div>
    </section>

    <section class="ps-sec ps-end">
      <div class="ps-end-txt">
        <div class="ps-kick"><i style="background:${T(1).fill}"></i>Cảm ơn những người đồng hành</div>
        <div class="ps-names">${H.connect.map(n=>`<span>${esc(D.posterName(n))}</span>`).join('')}</div>
        <div class="ps-sig">Cùng nhau tỏa sáng!</div>
      </div>
      <img class="ps-mascot" src="../assets/mascot/heart.png" alt=""/>
    </section>
  </div>`;
}

/* ═══ Khung popup ═══ */
const STAGE_HTML=`
<div class="stp-stage" id="stpStage" onclick="if(event.target===this)closeStamp()">
  <div class="stp-dialog" role="dialog" aria-label="Dấu ấn của bạn">
    <div class="stp-top">
      <span class="stp-logo"><span>M</span></span>
      <span class="stp-ttl">Dấu ấn của bạn</span><span class="stp-sub">Năm ${U.year}</span>
      <button class="stp-x" onclick="closeStamp()" aria-label="Đóng"><i class="bx bx-x"></i></button>
    </div>
    <div class="stp-body" id="stpBody">
      <div class="stp-scene" data-scene="welcome"></div>
      <div class="stp-scene" data-scene="sphere"><div class="stp-sphere" id="stpSphere"><div class="stp-field" id="stpField"></div></div></div>
      <div class="stp-scene" data-scene="thanks"></div>
      <div class="stp-scene" data-scene="poster"><div class="stp-poster-wrap"></div></div>
      <div class="stp-book-ov" id="stpBookOv"><div class="stp-book-scale" id="stpBookScale"><div class="stp-book" id="stpBook"></div></div></div>
      <div class="stp-ftr" id="stpFtr"></div>
    </div>
    <div class="stp-export" id="stpExport"></div>
  </div>
</div>`;
const $=id=>document.getElementById(id);
function ensureStage(){
  let el=$('stpStage');
  if(!el){
    document.body.insertAdjacentHTML('beforeend',STAGE_HTML); el=$('stpStage');
    el.querySelector('[data-scene="welcome"]').innerHTML=welcomeHTML();
    el.querySelector('[data-scene="thanks"]').innerHTML=thanksHTML();
    el.querySelector('.stp-poster-wrap').innerHTML=posterHTML();
    buildSphere(); wireSphere();
  }
  return el;
}

/* ═══ Quả cầu: công thức của bản mẫu, bán kính thu lại cho 6 tem ═══ */
const SPH={R:300,YSQ:.62,MIN_S:.5,MAX_S:1.05,MIN_O:.5,DRAG:.12,PAD:40,ROTY:.6};
const GOLDEN=2*Math.PI*(1-1/((1+Math.sqrt(5))/2));
const focusRot=i=>-(GOLDEN*i*180)/Math.PI;
function place(i,rotDeg){
  const c=1-((i+.5)/N)*2, d=Math.sqrt(Math.max(0,1-c*c)), h=GOLDEN*i+rotDeg*Math.PI/180;
  const x=SPH.R*d*-Math.sin(h), z=SPH.R*d*Math.cos(h), t=(z+SPH.R)/(2*SPH.R);
  return {x,y:SPH.R*c*SPH.YSQ,z,rotY:-Math.atan2(x,z+SPH.R)*(180/Math.PI)*SPH.ROTY,
          scale:SPH.MIN_S+(SPH.MAX_S-SPH.MIN_S)*t,opacity:SPH.MIN_O+(1-SPH.MIN_O)*t,zi:Math.round(t*100)};
}
let cards=[];
function buildSphere(){
  const field=$('stpField');
  field.innerHTML=CARDS.map(c=>`<div class="stp-card" data-i="${c.i}"><div class="stp-float ${c.i%2?'fb':'fa'}"
      style="--fd:${(5+(c.i%4)*.9).toFixed(1)}s;--fdelay:${((c.i%5)*.22).toFixed(2)}s;--jr:${(Math.sin(c.i*13.5)*2.5).toFixed(2)}deg">
      <div class="stp-hit" tabindex="0" role="button" aria-label="Tem ${c.i+1}: ${esc(c.title)}">${stampHTML(c)}</div></div></div>`).join('');
  cards=[...field.querySelectorAll('.stp-card')];
}
function sizeField(){
  const body=$('stpBody'), field=$('stpField');
  const w=SPH.R*2+229*SPH.MAX_S+SPH.PAD, h=SPH.R*SPH.YSQ*2+332*SPH.MAX_S+SPH.PAD;
  field.style.width=w+'px'; field.style.height=h+'px';
  const fit=Math.max(.1,Math.min((body.clientWidth-24)/w,(body.clientHeight-84)/h,1));
  field.style.transform=`translateY(-26px) scale(${fit})`;
  field.style.perspective='1200px';
  const bw=body.clientWidth-48, bh=body.clientHeight-130;
  $('stpBookScale').style.transform=`scale(${Math.max(.5,Math.min(1.75,bw/440,bh/332))})`;
}

/* ═══ Trạng thái ═══ */
let STEP=-1, FREE=false, spun=false, openIdx=null, running=false;
let rot=0, rotVel=0, dragging=false, moved=false, tween=null;
const reduce=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
const nearest=target=>target+Math.round((rot-target)/360)*360;
function tweenTo(to,ms,done){
  if(reduce()||ms<=0){rot=to;tween=null;done&&done();return;}
  const tw={from:rot,to,t0:performance.now(),ms,done};
  tween=tw;
  /* Dự phòng: tab bị ẩn thì requestAnimationFrame ngừng chạy, tem sẽ không
     bao giờ mở. Hết giờ mà chưa xong thì chốt luôn vị trí và mở tem. */
  setTimeout(()=>{if(tween===tw){rot=to;tween=null;done&&done();}},ms+150);
}
function frame(now){
  if(!running)return;
  if(tween){
    const p=Math.min(1,(now-tween.t0)/tween.ms);
    rot=tween.from+(tween.to-tween.from)*ease(p);
    if(p>=1){const d=tween.done;tween=null;d&&d();}
  } else if(!dragging&&Math.abs(rotVel)>.01){rot+=rotVel;rotVel*=.94;}
  for(let i=0;i<cards.length;i++){
    const p=place(i,rot), el=cards[i];
    el.style.transform=`translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,${p.z.toFixed(2)}px) rotateY(${p.rotY.toFixed(2)}deg) scale(${p.scale.toFixed(3)})`;
    el.style.opacity=p.opacity.toFixed(3); el.style.zIndex=String(p.zi);
  }
  requestAnimationFrame(frame);
}

/* Kéo để xoay: chỉ khi đã xem xong (chế độ tự do) và không mở tem nào. */
function wireSphere(){
  const sp=$('stpSphere');
  sp.addEventListener('pointerdown',ev=>{
    if(!FREE||openIdx!==null||ev.button!==0||!ev.isPrimary)return;
    dragging=true;moved=false;rotVel=0;tween=null;
    const startX=ev.clientX,startRot=rot;let lastX=startX,lastT=performance.now();
    const move=e=>{const dx=e.clientX-startX;if(Math.abs(dx)>4)moved=true;
      const now=performance.now(),dt=now-lastT;if(dt>0)rotVel=((e.clientX-lastX)*SPH.DRAG/dt)*16;
      lastX=e.clientX;lastT=now;rot=startRot+dx*SPH.DRAG;};
    const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
      dragging=false;if(!moved||Math.abs(rotVel)<.4)rotVel=0;};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  });
  sp.addEventListener('click',ev=>{
    if(moved){moved=false;return;}
    const hit=ev.target.closest('.stp-card');
    if(hit&&FREE&&openIdx===null)openBook(Number(hit.dataset.i));
  });
  sp.addEventListener('keydown',ev=>{
    if(ev.key!=='Enter'&&ev.key!==' ')return;
    const hit=ev.target.closest('.stp-card');
    if(hit&&FREE&&openIdx===null){ev.preventDefault();openBook(Number(hit.dataset.i));}
  });
}

function showScene(name){
  document.querySelectorAll('#stpStage .stp-scene').forEach(s=>s.classList.toggle('on',s.dataset.scene===name));
  $('stpSphere').classList.toggle('grab',name==='sphere'&&FREE);
  $('stpSphere').classList.toggle('stp-free',FREE);
}
function openBook(i){
  openIdx=i; rotVel=0;
  const ov=$('stpBookOv');
  $('stpBook').innerHTML=bookHTML(CARDS[i]);
  ov.classList.remove('on'); void ov.offsetWidth;   /* để lật lại từ đầu */
  setTimeout(()=>{if(openIdx===i)ov.classList.add('on');},30);
  renderFtr();
}
function closeBook(){openIdx=null;$('stpBookOv').classList.remove('on');}

/* step: -1 lời chào, 0..5 tem, 6 lời cảm ơn, 7 poster */
function go(step){
  STEP=step; tween=null; FREE=false;
  if(step<0){FREE=false;spun=false;closeBook();showScene('welcome');}
  else if(step<N){
    FREE=false;closeBook();showScene('sphere');
    if(!spun){spun=true;tweenTo(nearest(focusRot(step))+360,2600,()=>openBook(step));}
    else tweenTo(nearest(focusRot(step)),650,()=>openBook(step));
  }
  else if(step===N){closeBook();showScene('thanks');}
  else {closeBook();showScene('poster');}
  renderFtr();
}
function freeSphere(){FREE=true;STEP=N+1;closeBook();showScene('sphere');renderFtr();}

const B=(label,fn,{primary=false,icon='',iconAfter='',id=''}={})=>
  `<button class="stp-btn${primary?' stp-btn-primary':''}"${id?` id="${id}"`:''} onclick="${fn}">${icon?`<i class="bx ${icon}"></i>`:''}${label}${iconAfter?`<i class="bx ${iconAfter}"></i>`:''}</button>`;
function renderFtr(){
  const f=$('stpFtr'); let html='';
  if(FREE){
    html=openIdx!==null
      ?`<div class="stp-glass stp-bar">${B('Tải tem này',`stampDownloadCard(${openIdx})`,{icon:'bx-download',id:'stpDl'})}${B('Đóng','stampCloseCard()',{primary:true})}</div>`
      :`<div class="stp-glass stp-bar"><span class="stp-hint">Kéo để xoay - bấm một tem để mở lại</span>${B('Xem poster','stampGo('+(N+1)+')',{primary:true,iconAfter:'bx-right-arrow-alt'})}</div>`;
  } else if(STEP>=0&&STEP<N){
    const dots=CARDS.map(c=>`<i class="${c.i===STEP?'on':c.i<STEP?'done':''}" style="--dot:${strong(c.theme)}"></i>`).join('');
    html=`<div class="stp-glass stp-bar">${B('Quay lại',`stampGo(${STEP-1})`,{icon:'bx-left-arrow-alt'})}
      <span class="stp-dots" aria-label="Tem ${STEP+1} trên ${N}">${dots}</span>
      ${B('Tải tem này',`stampDownloadCard(${STEP})`,{icon:'bx-download',id:'stpDl'})}
      ${B('Tiếp',`stampGo(${STEP+1})`,{primary:true,iconAfter:'bx-right-arrow-alt'})}</div>`;
  } else if(STEP===N){
    html=`<div class="stp-glass stp-bar">${B('Quay lại',`stampGo(${N-1})`,{icon:'bx-left-arrow-alt'})}${B('Xem poster',`stampGo(${N+1})`,{primary:true,iconAfter:'bx-right-arrow-alt'})}</div>`;
  } else if(STEP===N+1){
    html=`<div class="stp-glass stp-bar">${B('Quay lại',`stampGo(${N})`,{icon:'bx-left-arrow-alt'})}${B('Xem lại quả cầu','stampFree()',{icon:'bx-revision'})}${B('Tải poster','stampDownloadPoster()',{primary:true,icon:'bx-download',id:'stpDl'})}</div>`;
  }
  f.innerHTML=html;
}

/* ═══ Tải ảnh: dựng bản PHẲNG ngoài màn hình rồi chụp (html2canvas không hiểu 3D) ═══ */
const H2C_SRC='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
let h2c=null;
function loadH2C(){
  if(window.html2canvas)return Promise.resolve(window.html2canvas);
  if(!h2c)h2c=new Promise((res,rej)=>{const s=document.createElement('script');s.src=H2C_SRC;s.onload=()=>res(window.html2canvas);s.onerror=rej;document.head.appendChild(s);});
  return h2c;
}
async function shoot(html,name,scale){
  const btn=$('stpDl'); if(btn)btn.classList.add('stp-busy');
  try{
    const html2canvas=await loadH2C(), host=$('stpExport');
    host.innerHTML=html; await document.fonts.ready;
    const canvas=await html2canvas(host.firstElementChild,{backgroundColor:null,scale,logging:false,useCORS:true});
    host.innerHTML='';
    const a=document.createElement('a');a.download=name;a.href=canvas.toDataURL('image/png');a.click();
  } finally { if(btn)btn.classList.remove('stp-busy'); }
}
function downloadCard(i){const c=CARDS[i];
  return shoot(`<div class="stp-flat">${pageHTML(c,leftPage(c))}${pageHTML(c,rightPage(c))}</div>`,`dau-an-cua-ban-tem-${pad(i+1)}.png`,3);}
function downloadPoster(){return shoot(posterHTML(),'dau-an-cua-ban-poster.png',2);}

/* ═══ Mở, đóng ═══ */
function openStamp(){
  ensureStage().classList.add('open'); sizeField();
  rot=0; rotVel=0; FREE=false;
  if(!running){running=true;requestAnimationFrame(frame);}
  go(-1);
}
function closeStamp(){const el=$('stpStage');if(el)el.classList.remove('open');running=false;tween=null;closeBook();}
window.addEventListener('resize',()=>{if($('stpStage'))sizeField();});
document.addEventListener('keydown',ev=>{
  const el=$('stpStage'); if(!el||!el.classList.contains('open'))return;
  if(ev.key==='Escape'){ if(FREE&&openIdx!==null){closeBook();renderFtr();} else closeStamp(); }
  else if(!FREE&&ev.key==='ArrowRight'&&STEP<N+1)go(STEP+1);
  else if(!FREE&&ev.key==='ArrowLeft'&&STEP>-1)go(STEP-1);
});

Object.assign(window,{openStamp,closeStamp,stampGo:go,stampFree:freeSphere,
  stampCloseCard:()=>{closeBook();renderFtr();},stampDownloadCard:downloadCard,stampDownloadPoster:downloadPoster});
})();
