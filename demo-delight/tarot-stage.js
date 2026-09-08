/* ═══════════════════════════════════════════════════════════════════════════
   SÂN KHẤU TRẢI BÀI — dữ liệu, luật hiển thị và điều khiển.
   Dùng chung cho feedback-tarot-demo.html và feedback-delight-demo.html.
   Màn nào cần thì nạp tarot-stage.css + file này rồi gọi openStage().
   ═══════════════════════════════════════════════════════════════════════════ */

/* Bọc trong IIFE: file này nạp chung trang với script riêng của từng màn, để
   trần ra global thì sớm muộn cũng đụng tên — GIVEN đã đụng ngay lần đầu ghép
   vào feedback-delight-demo. Chỉ những hàm mà markup gọi qua onclick mới được
   đưa ra window. */
(function(){
/* ═══════════════════════════════════════════════════════════════
   DỮ LIỆU — trích đúng feed của Nguyễn Văn Tú trong E-04
   ═══════════════════════════════════════════════════════════════ */
const RECEIVED=[
  {d:'14/03/2026',n:'Lê Thành Nam',   ini:'LN',org:'ITC – Mobile – iOS Developer',   cv:['Thực thi xuất sắc','Tinh thần đồng đội','Không ngừng học hỏi']},
  {d:'22/04/2026',n:'Hoàng Thị Lan',  ini:'HL',org:'MKT – Brand – Senior Designer',  cv:['Khách hàng là trung tâm']},
  {d:'05/06/2026',n:'Trương Minh Đức',ini:'TĐ',org:'ITC – Backend – Senior Engineer',cv:['Thực thi xuất sắc','Tinh thần đồng đội']},
  {d:'18/09/2025',n:'Nguyễn Quốc Bảo',ini:'NB',org:'ITC – Platform – Tech Lead',     cv:['Không ngừng học hỏi']},
  {d:'10/03/2026',n:'Lê Thành Nam',   ini:'LN',org:'ITC – Mobile',                   cv:['Thực thi xuất sắc']},
  {d:'11/03/2026',n:'Hoàng Thị Lan',  ini:'HL',org:'MKT – Brand',                    cv:['Khách hàng là trung tâm']},
  {d:'13/03/2026',n:'Trương Minh Đức',ini:'TĐ',org:'ITC – Backend',                  cv:['Không ngừng học hỏi','Thực thi xuất sắc']},
  {d:'15/07/2026',n:'Mai Thị Hằng',   ini:'MH',org:'ITC – DevOps',                   cv:['Tinh thần đồng đội']},
  {d:'18/07/2026',n:'Lê Văn Hùng',    ini:'LH',org:'ITC – Backend',                  cv:['Thực thi xuất sắc']},
  {d:'06/02/2026',n:'Nguyễn Quốc Bảo',ini:'NB',org:'ITC – Platform',                 cv:['Tinh thần đồng đội']},
  {d:'08/02/2026',n:'Lê Văn Hùng',    ini:'LH',org:'ITC – Backend',                  cv:['Không ngừng học hỏi']},
  {d:'10/02/2026',n:'Trần Thị Mai',   ini:'TM',org:'ITC – Frontend',                 cv:['Tinh thần đồng đội']}
];
const GIVEN=[
  {d:'20/06/2026',n:'Trần Văn Khoa',     thanked:false},
  {d:'02/08/2026',n:'Vũ Thị Lan',        thanked:false},
  {d:'18/07/2026',n:'Nguyễn Thị Phương', thanked:false},
  {d:'12/03/2026',n:'Trần Thị Mai',      thanked:true },
  {d:'18/05/2026',n:'Vũ Thị Lan',        thanked:true },
  {d:'02/06/2026',n:'Mai Thị Hằng',      thanked:false},
  {d:'20/06/2026',n:'Phạm Minh Đức',     thanked:false}
];
/* Điểm mạnh và góp ý là AI diễn giải lại từ nội dung phản hồi — KHÔNG trích
   nguyên văn và KHÔNG nêu tên người viết. */
const AI_STRENGTHS=[
  'Bạn biến việc phức tạp thành thứ ai cũng hiểu được',
  'Người khác thấy an tâm khi bạn nhận phần khó',
  'Bạn nhớ hỏi lại — kể cả khi không ai nhắc'
];
const AI_GROWTH=[
  'Rủ đồng đội vào sớm hơn, ngay từ lúc còn đang nghĩ',
  'Nói ra tiêu chuẩn của bạn thay vì tự tay làm cho đạt'
];
const CV_ART={
  'Đổi mới':'Innovation.png',
  'Tinh thần đồng đội':'Teamwork.png',
  'Không ngừng học hỏi':'Constant_.png',
  'Khách hàng là trung tâm':'Customer_.png',
  'Thực thi xuất sắc':'Excellence.png'
};

/* ═══════════════════════════════════════════════════════════════
   LUẬT TÍNH — mỗi luật một hàm, để review từng cái một
   ═══════════════════════════════════════════════════════════════ */
/* Chỉ lấy Phòng – Team, bỏ chức danh: để mỗi dòng người gọn đúng một dòng,
   ba dòng cao bằng nhau. Chức danh không phải thứ lá bài này nói tới. */
function shortOrg(org){return String(org||'').split('–').slice(0,2).map(part=>part.trim()).filter(Boolean).join(' – ');}
function ts(dmy){const [d,m,y]=String(dmy||'').split('/');return Number(`${y}${m}${d}`)||0;}

/* Lá I — đếm NGƯỜI (unique), không đếm số phản hồi.
   Gọi tên top 3; không đủ 3 người thì lấy top 2.
   Hoà số phản hồi thì ưu tiên người phản hồi GẦN ĐÂY NHẤT — không xếp theo
   bảng chữ cái, vì chọn theo tên là chọn đại rồi tuyên bố "nhiều nhất". */
function circle(){
  const by=new Map();
  RECEIVED.forEach(item=>{
    const cur=by.get(item.n)||{name:item.n,ini:item.ini,org:item.org,count:0,last:0};
    cur.count++; cur.last=Math.max(cur.last,ts(item.d));
    if(ts(item.d)>=cur.last)cur.org=item.org;
    by.set(item.n,cur);
  });
  const people=[...by.values()].sort((a,b)=>b.count-a.count||b.last-a.last);
  const teams=new Set(RECEIVED.map(item=>(item.org.split('–')[1]||'').trim()).filter(Boolean));
  return {people, total:people.length, teams:teams.size,
          top:people.slice(0,people.length>=3?3:2)};
}

/* Lá II — chỉ giá trị có dữ liệu > 0. Giá trị bằng 0 bị ẩn hẳn: một lá bài
   khen ngợi không nên có hạng bét. Bằng điểm thì nổi bật như nhau. */
function values(){
  const count={};
  RECEIVED.forEach(item=>(item.cv||[]).forEach(v=>count[v]=(count[v]||0)+1));
  const rows=Object.entries(count).filter(([,n])=>n>0)
    .map(([name,n])=>({name,n,art:CV_ART[name]}))
    .sort((a,b)=>b.n-a.n||a.name.localeCompare(b.name,'vi'));
  const max=rows.length?rows[0].n:0;
  return rows.map(row=>({...row,hero:row.n===max}));
}

/* Lá V — cho đi bao nhiêu, tới bao nhiêu người, nhận lại bao nhiêu lời cảm ơn. */
function given(){
  return {total:GIVEN.length,
          people:new Set(GIVEN.map(item=>item.n)).size,
          thanks:GIVEN.filter(item=>item.thanked).length};
}

/* ═══════════════════════════════════════════════════════════════
   NỘI DUNG 5 LÁ
   ═══════════════════════════════════════════════════════════════ */
const ROMAN=['I','II','III','IV','V'];
/* Mỗi lá một linh vật riêng — năm lá, năm giá trị, không lá nào trùng lá nào.
   Chọn theo nghĩa của lá chứ không bốc ngẫu nhiên:
     I  vòng tròn đồng nghiệp     → Tinh thần đồng đội
     II ánh sáng bạn toả ra       → Thực thi xuất sắc
     III điều người khác nhìn thấy → Khách hàng là trung tâm (góc nhìn từ ngoài)
     IV mở đường đi tiếp          → Không ngừng học hỏi
     V  gieo mầm cho người khác   → Đổi mới */
const CARD_ART=['Teamwork.png','Excellence.png','Customer_.png','Constant_.png','Innovation.png'];
function CARDS(){
  const c=circle(), v=values(), g=given();
  return [
    { short:'Vòng tròn',
      title:'Vòng tròn quanh bạn',
      sub:'Năm nay, đây là những đồng nghiệp trao cho bạn nhiều món quà nhất.',
      /* Số phản hồi đứng cạnh tên: đó mới là thông tin cần nhìn ra ngay, nên
         chỉ nó được tô vàng. Bỏ dãy "7 người · 6 nhóm · 12 phản hồi" vì ba con
         số rời nhau không nói lên điều gì cho người đọc. */
      body:`<div class="people">${c.top.map(p=>`
        <div class="person-line">
          <span class="person-av">${p.ini}</span>
          <span><span class="person-nm">${p.name}</span><span class="person-og">${shortOrg(p.org)}</span></span>
          <span class="person-ct">${p.count}<i class="bx bx-gift"></i></span>
        </div>`).join('')}</div>`
    },
    { short:'Ánh sáng',
      title:'Ánh sáng bạn toả ra',
      sub:'Những giá trị đồng nghiệp thấy rõ nhất ở bạn.',
      body:`<div class="cv-list">${v.map(row=>`
        <div class="cv-row ${row.hero?'hero':''}" style="--cv-w:${row.hero?52:36}px">
          <span class="cv-art"><img src="../Core value with BG/${row.art}" alt="${row.name}"/></span>
          <span class="cv-nm">${row.name}</span>
          <span class="cv-ct">${row.n}</span>
        </div>`).join('')}</div>`
    },
    { short:'Điều họ thấy',
      title:'Điều mọi người nhìn thấy ở bạn',
      sub:'Ấn tượng đồng nghiệp giữ lại sau những lần làm việc cùng bạn.',
      body:`<ul class="quill">${AI_STRENGTHS.map(text=>`<li><i class="bx bxs-star"></i><span>${text}</span></li>`).join('')}</ul>`
    },
    { short:'Mở đường',
      title:'Lá bài mở đường',
      sub:'Những điều đồng nghiệp tin sẽ đưa bạn đi xa hơn.',
      body:`<ul class="quill">${AI_GROWTH.map(text=>`<li><i class="bx bx-key"></i><span>${text}</span></li>`).join('')}</ul>`
    },
    { short:'Đã gieo',
      title:'Điều bạn đã gieo',
      sub:'Mỗi phản hồi bạn viết là một lần ai đó được nhìn thấy.',
      /* Một câu duy nhất mang cả ba con số, thay cho khối số rời rạc kèm nhãn
         khó hiểu ("người được bạn nhắc tên"). Chỉ con số được tô vàng. */
      body:`<div class="seed-list">
        <div class="seed-row"><span class="seed-num">${g.total}</span><span class="seed-lbl">phản hồi bạn đã trao đi</span></div>
        <div class="seed-row"><span class="seed-num">${g.people}</span><span class="seed-lbl">đồng nghiệp đã nhận được</span></div>
        <div class="seed-row"><span class="seed-num">${g.thanks}</span><span class="seed-lbl">lời cảm ơn gửi lại bạn</span></div>
      </div>`
    }
  ];
}

/* ═══════════════════════════════════════════════════════════════
   SÂN KHẤU
   ═══════════════════════════════════════════════════════════════ */
let STEP=-1;               /* -1 nghi thức mở · 0..4 lá bài · 5 màn trải */
const deck=CARDS();


/* ── Sân khấu tự dựng lấy khung của mình ────────────────────────────────────
   Trang chỉ cần nạp tarot-stage.css + file này rồi gọi openStage(); không phải
   dán lại đoạn markup ở mỗi màn — dán tay là kiểu gì cũng có màn quên sửa. */
const STAGE_HTML=`
<div class="tarot-stage" id="stage" onclick="if(event.target===this)closeStage()">
  <div class="tarot-dialog" role="dialog" aria-label="Dấu ấn của bạn">
    <div class="tarot-top">
      <span class="tarot-brandline"><i class="bx bx-moon"></i> Dấu ấn của bạn · 2026</span>
      <button class="tarot-x" onclick="closeStage()" aria-label="Đóng"><i class="bx bx-x"></i></button>
    </div>
    <div class="tarot-body" id="stageBody"></div>
    <div class="tarot-foot" id="stageFoot"></div>
  </div>
</div>`;
function ensureStage(){
  let el=document.getElementById('stage');
  if(!el){document.body.insertAdjacentHTML('beforeend',STAGE_HTML);el=document.getElementById('stage');}
  return el;
}
function openStage(){STEP=-1;ensureStage().classList.add('open');render();}
function closeStage(){const el=document.getElementById('stage');if(el)el.classList.remove('open');}

/* Mặt lưng: bộ bài úp lúc đầu mang linh vật của giá trị nổi bật nhất người xem;
   còn khi lật từng lá thì mang linh vật của chính lá đó, để cú lật hé trước
   tinh thần của lá sắp mở. */
function backFaceHTML(index){
  const art=Number.isInteger(index)?CARD_ART[index]:(values()[0]||{art:'Teamwork.png'}).art;
  return `<div class="deck-back"><div class="deck-mark"><img src="../Core value with BG/${art}" alt=""/></div></div>`;
}
/* Lá bài dựng sẵn ở trạng thái ÚP (.face-down); render xong mới gỡ class ra để
   trình duyệt chạy transition lật. Không đợi một frame thì trạng thái đầu và
   cuối vào cùng một lần tính layout, transition bị bỏ qua và bài hiện thẳng mặt. */

/* ═══════════════════════════════════════════════════════════════
   TẢI ẢNH — từng lá hoặc cả bộ
   Dựng một bản sao PHẲNG của lá bài ở ngoài màn hình rồi chụp. Không chụp
   thẳng lá đang hiển thị vì nó nằm trong khung lật 3D (rotateY, preserve-3d,
   backface-hidden) — html2canvas không hiểu transform 3D nên sẽ ra ảnh lệch.
   ═══════════════════════════════════════════════════════════════ */
const H2C_SRC='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
let h2cReady=null;
function loadH2C(){
  if(window.html2canvas)return Promise.resolve(window.html2canvas);
  if(h2cReady)return h2cReady;
  h2cReady=new Promise((resolve,reject)=>{
    const tag=document.createElement('script');
    tag.src=H2C_SRC;tag.onload=()=>resolve(window.html2canvas);tag.onerror=reject;
    document.head.appendChild(tag);
  });
  return h2cReady;
}
/* Khung dựng ảnh: đặt ngoài tầm nhìn nhưng KHÔNG display:none — ẩn hẳn thì
   không có kích thước để chụp. Phải nằm trong .tarot-dialog mới thừa hưởng
   đúng token và font của sân khấu. */
function exportHost(){
  let host=document.getElementById('tarotExport');
  if(!host){
    host=document.createElement('div');
    host.id='tarotExport';
    host.style.cssText='position:absolute;left:-10000px;top:0;pointer-events:none';
    document.querySelector('.tarot-dialog').appendChild(host);
  }
  return host;
}
async function shotCard(index){
  const html2canvas=await loadH2C();
  const host=exportHost();
  host.innerHTML=`<div class="card-slot" style="animation:none"><div class="card-flip">${cardFrontHTML(index)}</div></div>`;
  const node=host.querySelector('.card-slot');
  await document.fonts.ready;
  const canvas=await html2canvas(node,{backgroundColor:null,scale:2,logging:false,useCORS:true});
  host.innerHTML='';
  return canvas;
}
function saveCanvas(canvas,name){
  const link=document.createElement('a');
  link.download=name;link.href=canvas.toDataURL('image/png');link.click();
}
async function downloadCard(index){
  setDownloadBusy(true);
  try{saveCanvas(await shotCard(index),`dau-an-cua-ban-la-${index+1}.png`);}
  finally{setDownloadBusy(false);}
}
/* Cả bộ ghép thành MỘT ảnh thay vì bắn 5 lượt tải: trình duyệt chặn tải hàng
   loạt, và một tấm có đủ năm lá cũng dễ chia sẻ hơn năm file rời. */
async function downloadDeck(){
  setDownloadBusy(true);
  try{
    const shots=[];
    for(let i=0;i<deck.length;i++)shots.push(await shotCard(i));
    const gap=28,pad=40,w=shots[0].width,h=shots[0].height;
    const sheet=document.createElement('canvas');
    sheet.width=pad*2+w*shots.length+gap*(shots.length-1);
    sheet.height=pad*2+h;
    const ctx=sheet.getContext('2d');
    ctx.fillStyle='#170617';ctx.fillRect(0,0,sheet.width,sheet.height);
    shots.forEach((shot,i)=>ctx.drawImage(shot,pad+i*(w+gap),pad));
    saveCanvas(sheet,'dau-an-cua-ban-tron-bo.png');
  }finally{setDownloadBusy(false);}
}
function setDownloadBusy(busy){
  document.querySelectorAll('#stageFoot .foot-cta,#stageFoot .foot-ghost').forEach(btn=>{
    btn.disabled=busy;btn.style.opacity=busy?'.55':'';
  });
}

function cardHTML(index,entering){
  const card=deck[index];
  return `<div class="card-slot ${entering?'enter':''}">
    <div class="card-flip face-down">
      <div class="card-face face-back">${backFaceHTML(index)}</div>
      ${cardFrontHTML(index)}
    </div>
  </div>`;
}
/* Mặt trước tách riêng vì bản chụp để tải dùng lại đúng markup này — hai nơi
   vẽ hai kiểu thì ảnh tải về sẽ khác lá đang xem. */
function cardFrontHTML(index){
  const card=deck[index];
  return `<article class="card-face face-front">
    <span class="card-frame"></span>
    <div class="card-inner">
      <div class="card-tile" aria-hidden="true"></div>
      <div class="card-roman">${ROMAN[index]}</div>
      <div class="card-core">
        <h2 class="card-title">${card.title}</h2>
        <p class="card-sub">${card.sub}</p>
        ${card.body}
      </div>
    </div>
  </article>`;
}
/* Giữ mặt úp một nhịp ngắn cho người xem kịp thấy mặt lưng rồi mới lật. */
const FLIP_HOLD=300;
function revealCard(){
  const flip=document.querySelector('#stageBody .card-flip');
  if(!flip)return;
  requestAnimationFrame(()=>setTimeout(()=>flip.classList.remove('face-down'),FLIP_HOLD));
}

function deckHTML(){
  const back=backFaceHTML();
  return `<div class="ritual-wrap">
    <div class="ritual">
      <h2>Chào Tú.</h2>
      <p>Chào mừng bạn đến với buổi trải bài dấu ấn của riêng mình.</p>
    </div>
    <div class="deck" id="deck" onclick="cutDeck()" role="button" tabindex="0" aria-label="Cắt bài để mở lá đầu tiên"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();cutDeck();}">
      <div class="deck-card">${back}</div>
      <div class="deck-card">${back}</div>
      <div class="deck-card">${back}</div>
    </div>
    <button class="ritual-cta" onclick="cutDeck()"><i class="bx bx-pointer"></i> Chạm để cắt bài</button>
  </div>`;
}


function spreadHTML(){
  return `<div class="spread-wrap on">
    <div class="spread-head">
      <h2>Trọn bộ dấu ấn của bạn</h2>
      <p>Năm lá, một năm. Tải về hoặc chia sẻ lá bạn thích.</p>
    </div>
    <div class="fan">${deck.map((card,index)=>`
      <div class="mini-card" style="transform:rotate(${(index-2)*7}deg) translateY(${Math.abs(index-2)*11}px);animation-delay:${index*80}ms"
           onclick="goTo(${index})" role="button" tabindex="0"
           onkeydown="if(event.key==='Enter'){goTo(${index});}">
        <div class="mini-frame">
          <div class="mini-roman">${ROMAN[index]}</div>
          <img class="mini-mark" src="../Core value with BG/${CARD_ART[index]}" alt=""/>
          <div class="mini-title">${card.short}</div>
        </div>
      </div>`).join('')}</div>
  </div>`;
}

function footHTML(){
  if(STEP===-1)return '';
  if(STEP===deck.length)return `
    <button class="foot-ghost" onclick="goTo(0)"><i class="bx bx-revision"></i> Xem lại từ đầu</button>
    <button class="foot-cta" onclick="downloadDeck()"><i class="bx bx-download"></i> Tải cả bộ</button>`;
  return `
    <button class="nav-btn" onclick="move(-1)" ${STEP===0?'disabled':''} aria-label="Lá trước"><i class="bx bx-chevron-left"></i></button>
    <div class="pips">${deck.map((_,index)=>`<span class="pip ${index===STEP?'on':''}"></span>`).join('')}</div>
    <button class="nav-btn" onclick="move(1)" aria-label="Lá tiếp"><i class="bx bx-chevron-right"></i></button>
    <button class="foot-ghost" onclick="downloadCard(STEP)"><i class="bx bx-download"></i> Tải lá này</button>
    <button class="foot-ghost" onclick="downloadDeck()"><i class="bx bx-images"></i> Tải cả bộ</button>`;
}

function render(entering){
  const body=document.getElementById('stageBody');
  if(STEP===-1)body.innerHTML=deckHTML();
  else if(STEP===deck.length)body.innerHTML=spreadHTML();
  else{body.innerHTML=cardHTML(STEP,entering!==false);revealCard();}
  document.getElementById('stageFoot').innerHTML=footHTML();
}

/* Cắt bài: lá trên cùng nhấc lên, lật nghiêng rồi biến mất, lá I rút lên thay chỗ.
   Giữ nguyên nghi thức của tarot mà không tốn một slide chỉ để chào. */
function cutDeck(){
  const el=document.getElementById('deck');
  if(!el||el.classList.contains('cutting'))return;
  el.classList.add('cutting');
  el.closest('.ritual-wrap').classList.add('cutting');
  setTimeout(()=>{STEP=0;render(true);},560);
}
function move(delta){
  const next=STEP+delta;
  if(next<0||next>deck.length)return;
  const current=document.querySelector('#stageBody .card-slot');
  if(current&&delta>0){current.classList.add('leaving');setTimeout(()=>{STEP=next;render(true);},180);}
  else{STEP=next;render(true);}
}
function goTo(index){STEP=index;render(true);}

document.addEventListener('keydown',event=>{
  const el=document.getElementById('stage');
  if(!el||!el.classList.contains('open'))return;
  if(event.key==='Escape')closeStage();
  if(event.key==='ArrowRight'&&STEP>=0)move(1);
  if(event.key==='ArrowLeft'&&STEP>0)move(-1);
});

/* Đúng những hàm markup của sân khấu gọi tới, không hơn. */
Object.assign(window,{openStage,closeStage,cutDeck,move,goTo,downloadCard,downloadDeck});
})();
