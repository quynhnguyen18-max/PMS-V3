/* ═══════════════════════════════════════════════════════════════════════════
   CHUỖI QUẢN LÝ — nguồn sự thật duy nhất về "ai quản lý ai"

   Mỗi người chỉ khai MỘT liên kết: quản lý trực tiếp của họ. Quản lý cấp 2 và
   trưởng đơn vị được SUY RA từ chính chuỗi đó, nên không thể có chuyện ba màn
   khai ba kiểu rồi lệch nhau.

   Ba vai trò và đúng câu chữ tiếng Việt dùng ở mọi màn:
     lm    → Quản lý trực tiếp   (Line Manager)
     upper → Quản lý cấp 2       (quản lý của quản lý trực tiếp)
     hod   → Trưởng đơn vị       (người đứng đầu khối của nhân viên đó)

   LUÔN trả về đủ ba vai, kể cả khi một người giữ hai hoặc cả ba vai. HR chọn
   người nhận kết quả theo CẤP, nên phải thấy đủ ba lựa chọn; việc hai lựa chọn
   cùng trỏ về một người là thông tin thật, không phải lỗi trùng cần giấu đi.

   Ba hình dạng chuỗi có thật trong tổ chức, dữ liệu dưới đây cố ý có đủ cả ba:
     A. ba cấp là ba người khác nhau      (vd: Nguyễn Văn Tú)
     B. cấp 2 và trưởng đơn vị là một người (vd: Bùi Quốc Anh)
     C. cả ba cấp là cùng một người        (vd: Lê Văn Dũng - báo cáo thẳng trưởng đơn vị)

   Dùng cho: H-06 (HR chọn người nhận kết quả), M-04 (ai được xem trên hệ thống),
   E-04 (tim cảm ơn của quản lý cũ / quản lý hiện tại).
   ═══════════════════════════════════════════════════════════════════════════ */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.OrgChain=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const ROLE_LABEL={lm:'Quản lý trực tiếp',upper:'Quản lý cấp 2',hod:'Trưởng đơn vị'};
  const ROLE_ORDER=['lm','upper','hod'];

  /* Trưởng đơn vị của từng khối. Người đứng đầu khối không có quản lý trực tiếp
     trong phạm vi prototype nên manager để rỗng. */
  const DIVISION_HEAD={ITC:'huy.tran',SALES:'binh.ngo',MKT:'chau.ly',PM:'hoa.nguyen',FIN:'hieu.pham'};

  const PEOPLE={
    /* ══ ITC — trưởng đơn vị: Trần Quang Huy ═══════════════════════════════ */
    'huy.tran':{name:'Trần Quang Huy',division:'ITC',title:'Trưởng đơn vị ITC',manager:''},

    /* Báo cáo thẳng trưởng đơn vị → cả ba cấp đều là Trần Quang Huy (hình C) */
    'dung.le':{name:'Lê Văn Dũng',division:'ITC',title:'Engineering Manager',manager:'huy.tran'},
    'nam.vu':{name:'Vũ Hoàng Nam',division:'ITC',title:'Engineering Manager',manager:'huy.tran'},
    'duc.hoang':{name:'Hoàng Văn Đức',division:'ITC',title:'Engineering Manager',manager:'huy.tran'},
    'tung.dinh':{name:'Đinh Văn Tùng',division:'ITC',title:'Engineering Manager',manager:'huy.tran'},
    'trang.vu':{name:'Vũ Thùy Trang',division:'ITC',title:'Chief of Staff',manager:'huy.tran'},
    'khanh.ly':{name:'Lý Đăng Khánh',division:'ITC',title:'Principal Engineer',manager:'huy.tran'},

    /* Dưới Engineering Manager → cấp 2 chính là trưởng đơn vị (hình B) */
    'thanh.le':{name:'Lê Thị Thanh',division:'ITC',title:'Backend Team Lead',manager:'dung.le'},
    'huy.do':{name:'Đỗ Quang Huy',division:'ITC',title:'Platform Team Lead',manager:'dung.le'},
    'anh.bui':{name:'Bùi Quốc Anh',division:'ITC',title:'Security Engineer',manager:'dung.le'},
    'son.hoang':{name:'Hoàng Thái Sơn',division:'ITC',title:'Data Team Lead',manager:'nam.vu'},
    'linh.dinh':{name:'Đinh Thị Linh',division:'ITC',title:'AI/ML Engineer',manager:'nam.vu'},
    'long.pham':{name:'Phạm Thành Long',division:'ITC',title:'Data Analyst',manager:'nam.vu'},
    'minh.cao':{name:'Cao Văn Minh',division:'ITC',title:'Infra Engineer',manager:'duc.hoang'},
    'bao.nguyen':{name:'Nguyễn Quốc Bảo',division:'ITC',title:'Tech Lead',manager:'duc.hoang'},
    'bich.phan':{name:'Phan Thị Bích',division:'ITC',title:'Mobile Engineer',manager:'tung.dinh'},

    /* Dưới Team Lead → ba cấp là ba người khác nhau (hình A) */
    'tu.nguyen':{name:'Nguyễn Văn Tú',division:'ITC',title:'Senior Engineer',manager:'thanh.le'},
    'mai.tran':{name:'Trần Thị Mai',division:'ITC',title:'Software Engineer',manager:'thanh.le'},
    'duc.pham':{name:'Phạm Minh Đức',division:'ITC',title:'Data Engineer',manager:'thanh.le'},
    'lan.vu':{name:'Vũ Thị Lan',division:'ITC',title:'QA Engineer',manager:'thanh.le'},
    'nam.le':{name:'Lê Hoài Nam',division:'ITC',title:'iOS Developer',manager:'thanh.le'},
    'phuong.nguyen':{name:'Nguyễn Thị Phương',division:'ITC',title:'Data Scientist',manager:'thanh.le'},
    'khoa.tran':{name:'Trần Văn Khoa',division:'ITC',title:'iOS Engineer',manager:'thanh.le'},
    'hang.mai':{name:'Mai Thị Hằng',division:'ITC',title:'Platform Engineer',manager:'thanh.le'},
    'duc.truong':{name:'Trương Minh Đức',division:'ITC',title:'Senior Engineer',manager:'thanh.le'},
    'hieu.vo':{name:'Võ Trung Hiếu',division:'ITC',title:'Platform Engineer',manager:'huy.do'},
    'my.pham':{name:'Phạm Trà My',division:'ITC',title:'Platform Engineer',manager:'huy.do'},
    'dat.ngo':{name:'Ngô Tiến Đạt',division:'ITC',title:'Data Engineer',manager:'son.hoang'},
    'yen.tran':{name:'Trần Hải Yến',division:'ITC',title:'Data Engineer',manager:'son.hoang'},

    /* Sâu thêm một tầng: cấp 2 là Team Lead, trưởng đơn vị vẫn là head (hình A) */
    'hung.le':{name:'Lê Văn Hùng',division:'ITC',title:'Senior Engineer',manager:'tu.nguyen'},
    'thu.hoang':{name:'Hoàng Thị Thu',division:'ITC',title:'Software Engineer',manager:'mai.tran'},
    'vinh.dang':{name:'Đặng Quang Vinh',division:'ITC',title:'DevOps Engineer',manager:'hang.mai'},

    /* ══ SALES — trưởng đơn vị: Ngô Thanh Bình ═════════════════════════════ */
    'binh.ngo':{name:'Ngô Thanh Bình',division:'SALES',title:'Trưởng đơn vị Sales',manager:''},

    /* Hình C */
    'ha.pham':{name:'Phạm Thu Hà',division:'SALES',title:'Sales Manager',manager:'binh.ngo'},
    'quan.do':{name:'Đỗ Minh Quân',division:'SALES',title:'Sales Manager',manager:'binh.ngo'},
    'chi.le':{name:'Lê Bảo Chi',division:'SALES',title:'Sales Ops Lead',manager:'binh.ngo'},

    /* Hình B */
    'hung.do':{name:'Đỗ Gia Hưng',division:'SALES',title:'Account Executive',manager:'ha.pham'},
    'an.vo':{name:'Võ Hải An',division:'SALES',title:'Account Executive',manager:'ha.pham'},
    'phuong.le':{name:'Lê Phương Thảo',division:'SALES',title:'Account Executive',manager:'ha.pham'},
    'thu.nguyen':{name:'Nguyễn Minh Thư',division:'SALES',title:'Account Executive',manager:'ha.pham'},
    'nga.bui':{name:'Bùi Thanh Nga',division:'SALES',title:'Sales Team Lead',manager:'ha.pham'},
    'tam.nguyen':{name:'Nguyễn Minh Tâm',division:'SALES',title:'Account Executive',manager:'quan.do'},
    'vy.tran':{name:'Trần Khánh Vy',division:'SALES',title:'Account Executive',manager:'quan.do'},
    'dung.hoang':{name:'Hoàng Thùy Dung',division:'SALES',title:'Sales Ops Analyst',manager:'chi.le'},

    /* Hình A */
    'son.tran':{name:'Trần Quốc Sơn',division:'SALES',title:'Account Executive',manager:'nga.bui'},
    'linh.vu':{name:'Vũ Thị Linh',division:'SALES',title:'Account Executive',manager:'nga.bui'},
    'nam.bui':{name:'Bùi Hoài Nam',division:'SALES',title:'Account Executive',manager:'nga.bui'},
    'phuc.le':{name:'Lê Hồng Phúc',division:'SALES',title:'Account Executive',manager:'nga.bui'},

    /* ══ MKT — trưởng đơn vị: Lý Minh Châu ═════════════════════════════════ */
    'chau.ly':{name:'Lý Minh Châu',division:'MKT',title:'Trưởng đơn vị Marketing',manager:''},
    'lan.hoang':{name:'Hoàng Thị Lan',division:'MKT',title:'Senior Designer',manager:'chau.ly'},
    'ngan.pham':{name:'Phạm Kim Ngân',division:'MKT',title:'Brand Manager',manager:'chau.ly'},
    'tuan.do':{name:'Đỗ Anh Tuấn',division:'MKT',title:'Content Team Lead',manager:'ngan.pham'},
    'khoa.le':{name:'Lê Anh Khoa',division:'MKT',title:'Brand Executive',manager:'ngan.pham'},
    'ha.vu':{name:'Vũ Thu Hà',division:'MKT',title:'Brand Executive',manager:'ngan.pham'},
    'linh.pham':{name:'Phạm Mỹ Linh',division:'MKT',title:'Content Writer',manager:'tuan.do'},

    /* ══ PM — trưởng đơn vị: Nguyễn Thị Hoa ════════════════════════════════ */
    'hoa.nguyen':{name:'Nguyễn Thị Hoa',division:'PM',title:'Trưởng đơn vị Product',manager:''},
    'khanh.nguyen':{name:'Nguyễn Duy Khánh',division:'PM',title:'Group Product Manager',manager:'hoa.nguyen'},
    'thao.dang':{name:'Đặng Phương Thảo',division:'PM',title:'Product Manager',manager:'khanh.nguyen'},
    'kien.vo':{name:'Võ Trung Kiên',division:'PM',title:'Product Manager',manager:'khanh.nguyen'},

    /* ══ FIN — trưởng đơn vị: Phạm Minh Hiếu ═══════════════════════════════ */
    'hieu.pham':{name:'Phạm Minh Hiếu',division:'FIN',title:'Trưởng đơn vị Finance',manager:''},
    'trang.nguyen':{name:'Nguyễn Thu Trang',division:'FIN',title:'Finance Control Lead',manager:'hieu.pham'},
    'binh.tran':{name:'Trần Thanh Bình',division:'FIN',title:'Financial Analyst',manager:'trang.nguyen'}
  };

  function initials(name){
    const parts=String(name||'').trim().split(/\s+/);
    if(!parts.length)return '';
    return ((parts[parts.length-2]||'').charAt(0)+(parts[parts.length-1]||'').charAt(0)).toUpperCase();
  }
  function person(domain){
    const key=String(domain||'').trim(),found=PEOPLE[key];
    return found?{domain:key,name:found.name,division:found.division,title:found.title,ini:initials(found.name)}:null;
  }
  function managerOf(domain){
    const found=PEOPLE[String(domain||'').trim()];
    return found&&found.manager?person(found.manager):null;
  }
  function headOf(domain){
    const found=PEOPLE[String(domain||'').trim()];
    return found?person(DIVISION_HEAD[found.division]||''):null;
  }
  function roleEntry(role,who,chainDomains){
    if(!who)return null;
    /* sharedWith: người này còn giữ vai nào khác trong cùng chuỗi. Màn hình vẫn hiện
       đủ ba lựa chọn, nhưng biết được hai lựa chọn đang trỏ về cùng một người. */
    const sharedWith=ROLE_ORDER.filter(other=>other!==role&&chainDomains[other]===who.domain);
    return {role,label:ROLE_LABEL[role],domain:who.domain,name:who.name,title:who.title,
      division:who.division,ini:who.ini,sharedWith};
  }
  /* Ba cấp quản lý của một nhân viên, luôn đủ ba dòng khi tổ chức có người ở cấp đó.
     Quản lý cấp 2 = quản lý của quản lý trực tiếp; nếu quản lý trực tiếp đã là người
     đứng đầu khối thì chính họ giữ luôn vai cấp 2. Nhân viên không bao giờ nằm trong
     chuỗi của chính mình. */
  function chainFor(domain){
    const self=person(domain);
    if(!self)return [];
    const lm=managerOf(self.domain);
    if(!lm)return [];
    const upper=managerOf(lm.domain)||lm;
    const hod=headOf(self.domain)||upper;
    const map={lm:lm.domain,upper:upper.domain,hod:hod.domain};
    return [roleEntry('lm',lm,map),roleEntry('upper',upper,map),roleEntry('hod',hod,map)]
      .filter(entry=>entry&&entry.domain!==self.domain);
  }
  /* Mọi vai người này đang giữ với nhân viên kia. Rỗng nghĩa là NGOÀI chuỗi quản lý,
     tức không xem được kết quả trên hệ thống. */
  function rolesOf(viewerDomain,employeeDomain){
    const key=String(viewerDomain||'').trim();
    return chainFor(employeeDomain).filter(entry=>entry.domain===key).map(entry=>entry.role);
  }
  function roleOf(viewerDomain,employeeDomain){
    const roles=rolesOf(viewerDomain,employeeDomain);
    return roles.length?roles[0]:null;   // vai GẦN nhân viên nhất
  }
  function isInChain(viewerDomain,employeeDomain){return rolesOf(viewerDomain,employeeDomain).length>0;}
  function roleLabel(role){return ROLE_LABEL[role]||'';}
  /* Nhãn dùng khi liệt kê người nhận: "Lê Thị Thanh (thanh.le) - Quản lý trực tiếp" */
  function describe(entry){
    if(!entry)return '';
    const role=entry.role?` - ${roleLabel(entry.role)}`:'';
    return `${entry.name} (${entry.domain})${role}`;
  }
  function all(){return Object.keys(PEOPLE).map(person);}

  return {ROLE_LABEL,ROLE_ORDER,DIVISION_HEAD,person,managerOf,headOf,chainFor,
    rolesOf,roleOf,isInChain,roleLabel,describe,all};
});
