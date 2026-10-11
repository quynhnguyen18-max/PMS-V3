/* ═══════════════════════════════════════════════════════════════════════════
   DẤU ẤN CỦA BẠN — dữ liệu và luật tính dùng chung cho mọi phương án demo
   (feedback-dau-an-demo.html: phương án 1 Trải bài, phương án 2 Quả cầu tem;
   feedback-sphere-demo.html). Luật chỉ viết ở ĐÂY (DESIGN-SYSTEM.md §20.1),
   các sân khấu chỉ đọc window.DauAn để dựng giao diện.
   Nạp file này TRƯỚC tarot-stage.js và stamp-stage.js.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
/* ═══════════════════════════════════════════════════════════════
   DỮ LIỆU — trích đúng feed của Nguyễn Văn Tú trong E-04
   ═══════════════════════════════════════════════════════════════ */
/* thanked: Tú đã thả tim cảm ơn phản hồi này (nút Cảm ơn ở E-04). */
const RECEIVED=[
  {d:'14/03/2026',n:'Lê Thành Nam',   ini:'LN',org:'ITC – Mobile – iOS Developer',   cv:['Thực thi xuất sắc','Tinh thần đồng đội','Không ngừng học hỏi'],thanked:true},
  {d:'22/04/2026',n:'Hoàng Thị Lan',  ini:'HL',org:'MKT – Brand – Senior Designer',  cv:['Khách hàng là trung tâm'],thanked:false},
  {d:'05/06/2026',n:'Trương Minh Đức',ini:'TĐ',org:'ITC – Backend – Senior Engineer',cv:['Thực thi xuất sắc','Tinh thần đồng đội'],thanked:true},
  {d:'18/09/2025',n:'Nguyễn Quốc Bảo',ini:'NB',org:'ITC – Platform – Tech Lead',     cv:['Không ngừng học hỏi'],thanked:true},
  {d:'10/03/2026',n:'Lê Thành Nam',   ini:'LN',org:'ITC – Mobile',                   cv:['Thực thi xuất sắc'],thanked:false},
  {d:'11/03/2026',n:'Hoàng Thị Lan',  ini:'HL',org:'MKT – Brand',                    cv:['Khách hàng là trung tâm'],thanked:false},
  {d:'13/03/2026',n:'Trương Minh Đức',ini:'TĐ',org:'ITC – Backend',                  cv:['Không ngừng học hỏi','Thực thi xuất sắc'],thanked:false},
  {d:'15/07/2026',n:'Mai Thị Hằng',   ini:'MH',org:'ITC – DevOps',                   cv:['Tinh thần đồng đội'],thanked:true},
  {d:'18/07/2026',n:'Lê Văn Hùng',    ini:'LH',org:'ITC – Backend',                  cv:['Thực thi xuất sắc'],thanked:true},
  {d:'06/02/2026',n:'Nguyễn Quốc Bảo',ini:'NB',org:'ITC – Platform',                 cv:['Tinh thần đồng đội'],thanked:false},
  {d:'08/02/2026',n:'Lê Văn Hùng',    ini:'LH',org:'ITC – Backend',                  cv:['Không ngừng học hỏi'],thanked:false},
  {d:'10/02/2026',n:'Trần Thị Mai',   ini:'TM',org:'ITC – Frontend',                 cv:['Tinh thần đồng đội'],thanked:false}
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
  'Bạn nhớ hỏi lại, kể cả khi không ai nhắc'
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

/* Tim cảm ơn: "nhận" là người nhận phản hồi của bạn bấm Cảm ơn (cùng cách
   đếm với dòng "Lời cảm ơn nhận được" ở E-04); "trao đi" là số phản hồi bạn
   nhận và đã bấm Cảm ơn. */
function hearts(){
  return {received:GIVEN.filter(item=>item.thanked).length,
          given:RECEIVED.filter(item=>item.thanked).length};
}

/* Lời trích cho poster: đoạn ngắn lấy từ phản hồi đã nhận trong E-04.
   KHÔNG kèm tên người viết, để poster chia sẻ ra ngoài được (chị chốt 11/10/2026). */
const QUOTES=[
  'Tú giải thích vấn đề kỹ thuật rất rõ ràng, kể cả với người không chuyên.',
  'Từ lúc phát hiện đến khi khắc phục xong, bạn luôn giữ bình tĩnh và phối hợp nhịp nhàng với cả nhóm.',
  'Mỗi lần mình hỏi, Tú đều vẽ lại sơ đồ và giải thích từ đầu chứ không trả lời cho xong.'
];

const USER={name:'Nguyễn Văn Tú',short:'Tú',year:'2026'};

/* Tên trên poster chia sẻ: "Tên Họ", bỏ tên đệm (Lê Văn Hùng thành Hùng Lê),
   theo cách chị chốt 11/10/2026 (vd Quỳnh Nguyễn, Minh Trần). */
function posterName(full){
  const p=String(full||'').trim().split(/\s+/);
  return p.length>1?p[p.length-1]+' '+p[0]:p[0]||'';
}

/* Phương án 2 (Quả cầu tem): 6 lá metric, theo đúng thứ tự chị đưa.
   Lời chào và lời cảm ơn KHÔNG là lá metric, nằm ngoài quả cầu.
     total     tổng số phản hồi đã nhận
     connect   kết nối đáng nhớ: top 3 người, chỉ tên (luật hoà như circle())
     values    dấu ấn bạn để lại: mọi giá trị được ghi nhận, tối đa 5, kèm lượt
     strengths điều mọi người trân trọng: liệt kê điểm mạnh
     given     số phản hồi đã trao đi, số người nhận
     hearts    tim cảm ơn nhận được và tim đã trao đi */
function highlights(){
  const c=circle(), g=given();
  return {
    total:RECEIVED.length, people:c.total,
    connect:c.top.map(p=>p.name),
    values:values().slice(0,5).map(v=>({name:v.name,n:v.n,art:v.art})),
    strengths:AI_STRENGTHS.slice(),
    given:{total:g.total,people:g.people},
    hearts:hearts(),
    quotes:QUOTES.slice()
  };
}

window.DauAn={USER,RECEIVED,GIVEN,AI_STRENGTHS,AI_GROWTH,CV_ART,QUOTES,shortOrg,posterName,ts,circle,values,given,hearts,highlights};
})();
