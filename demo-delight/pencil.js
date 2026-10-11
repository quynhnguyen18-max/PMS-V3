/* ═══════════════════════════════════════════════════════════════════════════
   BÚT CHÌ — bộ vẽ hoạ tiết nét bút chì dùng chung cho các phương án demo
   "Dấu ấn của bạn" (phương án 4 Sổ lật, phương án 5 Hộp quà bí mật).
   window.Pencil = { pencil, DOO, doo, INK, INK2, GOLD }
     pencil(parts, opt): SVG có bộ lọc riêng (nét run + vân hạt), nét chính đi
       một lần, nét phụ lệch nhẹ đi lần nữa như phác tay. Màu ghi thẳng trên
       thuộc tính để ảnh tải về (html2canvas) giữ đúng nét.
     DOO: thư viện hoạ tiết { tên: {vb, p:[path | {d, fill, fo}]} }.
     doo(tên, opt): vẽ một hoạ tiết trong DOO.
   Nạp file này TRƯỚC flip-stage.js và gift-stage.js.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
const INK='#A50064', INK2='#F64F9E', GOLD='#E8A317';
/* ═══ Bút chì: mỗi hoạ tiết là SVG có bộ lọc riêng (nét run + vân hạt), nét
   chính đi một lần, nét phụ lệch nhẹ đi lần nữa như phác tay. Màu ghi thẳng
   trên thuộc tính để ảnh tải về giữ đúng nét. ═══ */
let uid=0;
function pencil(parts,{vb='0 0 24 24',color=INK,sw=2,cls='draw',style='',par=''}={}){
  const id='pcl'+(++uid);
  const one=(p,extra)=>{
    const d=typeof p==='string'?p:p.d, fill=p.fill?`fill="${p.fill}" fill-opacity="${p.fo||.28}"`:'fill="none"';
    return `<path d="${d}" pathLength="1" ${fill} stroke="${color}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  };
  return `<svg class="${cls}" viewBox="${vb}" ${par} style="${style}" aria-hidden="true">
    <defs><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="${uid%7}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.7" numOctaves="1" seed="${(uid+3)%9}" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -.45" result="m"/>
      <feComposite in="d" in2="m" operator="in"/></filter></defs>
    <g filter="url(#${id})">${parts.map(p=>one(p,`stroke-width="${sw}" stroke-opacity=".9"`)).join('')}
      ${parts.map(p=>one(typeof p==='string'?p:{d:p.d},`stroke-width="${(sw*.55).toFixed(2)}" stroke-opacity=".45" transform="translate(.8 .6)"`)).join('')}</g></svg>`;
}
const DOO={
  star:  {vb:'0 0 24 24',p:['M12 2 C13 9 15 11 22 12 C15 13 13 15 12 22 C11 15 9 13 2 12 C9 11 11 9 12 2Z']},
  heart: {vb:'0 0 24 24',p:[{d:'M12 20 C6 15.5 2.5 12 3.5 7.5 C4.5 4 9 3.2 12 7 C15 3.2 19.5 4 20.5 7.5 C21.5 12 18 15.5 12 20Z',fill:INK2}]},
  check: {vb:'0 0 24 24',p:['M4 13 C6 15 8 17 10 19 C13 13 17 8 21 4']},
  under: {vb:'0 0 110 12',p:['M2 7 C12 2 22 11 34 6 S56 3 70 7 S92 10 108 5']},
  ring:  {vb:'0 0 116 58',p:['M58 6 C28 2 6 14 8 30 C10 48 44 56 74 50 C104 44 114 26 100 14 C88 4 60 2 40 8']},
  sprig: {vb:'0 0 60 100',p:['M30 96 C30 70 32 40 40 8',{d:'M31 70 C20 66 14 58 14 50 C24 52 30 60 31 70Z',fill:INK2},{d:'M32 52 C44 48 50 40 50 32 C40 34 34 42 32 52Z',fill:INK2},{d:'M34 34 C24 30 20 22 21 14 C30 17 34 25 34 34Z',fill:INK2},{d:'M37 20 C46 16 50 9 49 2 C41 5 37 12 37 20Z',fill:INK2}]},
  arrow: {vb:'0 0 80 50',p:['M6 40 C18 14 44 10 52 26 C58 38 40 44 36 30 C33 18 50 8 70 12','M62 6 L71 12 L63 19']},
  mail:  {vb:'0 0 56 50',p:[{d:'M6 14 H50 V44 H6 Z',fill:'#FFFFFF',fo:.9},'M6 14 L28 32 L50 14']},
  plane: {vb:'0 0 60 56',p:[{d:'M4 26 L56 6 L40 50 L30 32 Z',fill:'#FFFFFF',fo:.9},'M30 32 L56 6','M30 32 L28 46 L36 38']},
  loop:  {vb:'0 0 52 30',p:['M4 20 C10 4 22 4 20 16 C18 28 32 28 34 14 C36 2 48 6 46 18']},
  flower:{vb:'0 0 60 60',p:[0,60,120,180,240,300].map(a=>{const r=a*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
            const P=(x,y)=>`${(30+x*c-y*s).toFixed(1)} ${(30+x*s+y*c).toFixed(1)}`;
            return {d:`M${P(0,-5)} C${P(-9,-16)} ${P(9,-16)} ${P(0,-5)}Z`,fill:INK2};}).concat([{d:'M26 30 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',fill:GOLD,fo:.8}])}
};
const doo=(k,opt={})=>pencil(DOO[k].p,{vb:DOO[k].vb,...opt});

/* ═══ Báu vật, hộp quà (phương án 5) ═══ */
const PARCH='#FFF6E0', ROLL='#F3DDB0', GLASS='#BFE6F2', CORK='#C98B4F';
const circ=(cx,cy,r)=>`M${cx-r} ${cy} a${r} ${r} 0 1 0 ${r*2} 0 a${r} ${r} 0 1 0 ${-r*2} 0`;
Object.assign(DOO,{
  scroll:{vb:'0 0 100 100',p:[{d:'M28 34 H74 V72 H28 Z',fill:PARCH,fo:1},{d:'M22 24 H78 C85 24 85 36 78 36 H22 C15 36 15 24 22 24 Z',fill:ROLL,fo:1},
    {d:'M22 70 H78 C85 70 85 82 78 82 H22 C15 82 15 70 22 70 Z',fill:ROLL,fo:1},'M36 46 H66','M36 54 H62','M36 62 H56',{d:circ(66,62,6),fill:INK2,fo:.85}]},
  compass:{vb:'0 0 100 100',p:[{d:circ(50,52,36),fill:GOLD,fo:.45},{d:circ(50,52,27),fill:PARCH,fo:1},{d:'M50 30 L57 52 L50 74 L43 52 Z',fill:INK2,fo:.85},
    'M50 18 V24','M50 80 V86','M16 52 H22','M78 52 H84',{d:circ(50,12,4),fill:GOLD,fo:.6}]},
  crown:{vb:'0 0 100 100',p:[{d:'M16 72 L20 32 L37 52 L50 22 L63 52 L80 32 L84 72 Z',fill:GOLD,fo:.55},{d:'M16 72 H84 V84 H16 Z',fill:GOLD,fo:.8},
    {d:circ(50,62,5),fill:INK2,fo:.9},{d:circ(30,62,4),fill:'#7C3AED',fo:.7},{d:circ(70,62,4),fill:'#2563EB',fo:.7},{d:circ(50,20,4),fill:INK2,fo:.9},{d:circ(20,30,3),fill:INK2,fo:.9},{d:circ(80,30,3),fill:INK2,fo:.9}]},
  key:{vb:'0 0 100 100',p:[{d:circ(30,50,15),fill:GOLD,fo:.55},{d:circ(30,50,5),fill:PARCH,fo:1},{d:'M45 46 H88 V54 H45 Z',fill:GOLD,fo:.6},'M72 54 V64 H79 V54','M84 54 V61']},
  bottle:{vb:'0 0 100 100',p:[{d:'M38 40 C30 44 28 52 28 60 V82 C28 88 32 90 38 90 H62 C68 90 72 88 72 82 V60 C72 52 70 44 62 40 Z',fill:GLASS,fo:.55},
    {d:'M42 22 H58 V40 H42 Z',fill:GLASS,fo:.7},{d:'M40 12 H60 V22 H40 Z',fill:CORK,fo:.7},{d:'M40 58 H60 V78 H40 Z',fill:PARCH,fo:1},'M44 64 H56','M44 71 H53']},
  coin:{vb:'0 0 100 100',p:[{d:circ(50,50,36),fill:GOLD,fo:.6},{d:circ(50,50,28),fill:GOLD,fo:.25},
    {d:'M50 66 C40 58 34 52 36 44 C38 37 46 36 50 43 C54 36 62 37 64 44 C66 52 60 58 50 66Z',fill:INK2,fo:.9}]},
  boxBody:{vb:'0 0 240 170',p:[{d:'M14 8 H226 V162 H14 Z',fill:INK2,fo:.42},{d:'M106 8 H134 V162 H106 Z',fill:GOLD,fo:.75},
    'M30 30 L44 16','M30 52 L66 16','M30 74 L88 16','M150 150 L206 94','M172 150 L210 112','M194 150 L212 132']},
  boxLid:{vb:'0 0 270 110',p:[{d:'M135 62 C110 28 90 32 94 50 C97 64 120 64 135 62 Z',fill:GOLD,fo:.7},{d:'M135 62 C160 28 180 32 176 50 C173 64 150 64 135 62 Z',fill:GOLD,fo:.7},
    {d:'M6 60 H264 V104 H6 Z',fill:INK2,fo:.55},{d:'M120 60 H150 V104 H120 Z',fill:GOLD,fo:.85},{d:'M127 54 H143 V66 H127 Z',fill:GOLD,fo:.95}]},
  tag:{vb:'0 0 110 60',p:[{d:'M30 8 H100 V52 H30 L14 30 Z',fill:PARCH,fo:1},{d:circ(26,30,4),fill:'#FFFFFF',fo:1}]},
  wave:{vb:'0 0 120 20',p:['M2 12 C12 2 22 2 32 12 S52 22 62 12 S82 2 92 12 S112 22 118 12']},
  gem:{vb:'0 0 24 24',p:[{d:'M6 4 H18 L22 10 L12 21 L2 10 Z',fill:INK2,fo:.55},'M2 10 H22','M9 4 L7 10 L12 21 L17 10 L15 4']}
});

window.Pencil={pencil,DOO,doo,INK,INK2,GOLD};
})();
