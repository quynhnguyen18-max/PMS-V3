/* ═══════════════════════════════════════════════════════════
   YER UI — component dùng chung cho mọi màn Đánh giá cuối năm
   1. PMSUi.rating   — Enh 10 / ENH-E13: ô chọn điểm kiểu MYR + tên mức + định nghĩa mức
   2. PMSUi.tabs     — Enh 11 / ENH-E14: tab chu kỳ có trạng thái, hover, disabled
   3. PMSUi.dirty    — Enh 12 / ENH-E15: cảnh báo dữ liệu chưa lưu khi rời màn
   4. PMSUi.steps    — ENH-E14: dải quy trình, mỗi bước bấm được để đọc thêm
   5. PMSUi.tour     — ENH-E14: tourguide có spotlight, nhớ đã xem theo vai
   6. PMSUi.dialog / PMSUi.toast — primitive dùng chung
   Spec: YER-SPEC.md muc 4, 18, 34, 35, 36
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function t(key) { return window.PMSI18n ? window.PMSI18n.t(key) : key; }
  function lang() { return window.PMSI18n ? window.PMSI18n.lang() : 'vi'; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  function scale() { return window.PMS_RATING_SCALE || []; }
  function levelName(v) {
    var s = scale().filter(function (x) { return x.v === Math.floor(v); })[0];
    if (!s) return '';
    return lang() === 'en' ? s.en : s.vi;
  }
  function fullLabel(v) {
    if (v == null) return '';
    var isHalf = Math.abs(v % 1) > 0;
    if (!isHalf) return v + ' - ' + levelName(v);
    return v + ' - ' + (window.PMSYer ? window.PMSYer.scoreLabel(v, lang()) : '');
  }
  function definition(v) {
    return window.PMSYer ? window.PMSYer.scoreDefinition(v, lang()) : '';
  }
  // Định nghĩa dạng HTML: phần tham chiếu tới mức điểm được in đậm
  function definitionHtml(v) {
    return window.PMSYer && window.PMSYer.scoreDefinitionHtml
      ? window.PMSYer.scoreDefinitionHtml(v, lang())
      : esc(definition(v));
  }

  /* ═══ CSS ═══════════════════════════════════════════════ */
  var CSS = [
    /* ── rating selector (ENH-E13) ──
       Giữ nguyên ô <select> của Mid-Year Review trong E-01 (.sc-select cho điểm
       từng mục tiêu, .op-select cho điểm toàn diện) để hai kỳ nhìn như nhau.
       Phần thêm của kỳ cuối năm chỉ gồm TÊN MỨC và ĐỊNH NGHĨA MỨC. */
    '.rt-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    /* Ô định nghĩa mức điểm: MỘT màu pastel duy nhất cho mọi mức điểm, viền đơn,
       không vạch màu dày bên trái. Đây là thông tin giải thích chứ không phải trạng thái,
       nên không đổi màu theo điểm cao thấp. Xanh nhạt để tách hẳn khỏi nền hồng của các
       khối thao tác và khỏi vàng/đỏ/xanh lá của các chip trạng thái. */
    '.rt-def{margin-top:10px;padding:11px 14px 12px;border:1px solid var(--info-bd);border-radius:var(--rsm);',
    'background:var(--info-bg);font-size:12.5px;color:var(--z700);line-height:1.6}',
    '.rt-def-hd{display:flex;align-items:center;gap:5px;margin-bottom:6px;',
    'font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--info)}',
    '.rt-def-hd i{font-size:14px}',
    '.rt-def p + p{margin-top:7px}',
    '.rt-def strong,.pms-tip-body strong{font-weight:600}',
    '.rt-def strong{color:var(--z900)}',
    '.pms-tip-body strong{color:var(--z0)}',
    '.rt-empty{font-size:12.5px;color:var(--z500)}',
    /* Ô chưa chọn điểm: nới rộng cho vừa chữ gợi ý, chữ thường và nhạt hơn điểm đã chọn */
    '.sc-select.rt-unset,.op-select.rt-unset{width:auto;min-width:112px;font-weight:500;font-size:12px;color:var(--z600);text-align:left}',
    '.rt-unset option{color:var(--z900);font-weight:600}',
    /* Chị chốt 04/10/2026: chữ trong ô chọn điểm căn trái ở mọi trạng thái (chưa chọn, đã chọn, mở lại danh sách) */
    '[data-rt] .sc-select,[data-rt] .op-select{text-align:left;text-align-last:left}',
    /* Tên mức luôn một dòng; không đủ chỗ thì cả nhãn xuống dòng (rt-line flex-wrap). Tên mức in đậm, phần nối giữ chữ thường */
    /* Tên mức CHỈ một dòng (chị chốt 04/10/2026): chip không co, không vỡ chữ; không đủ chỗ thì cả chip xuống dòng */
    '[data-rt] .sc-lbl.show{flex-shrink:0;white-space:nowrap}',
    /* Dòng `Điểm toàn diện:` (E-05, M-06): điểm, ô chọn, tên mức là các phần tử ngang hàng của dòng, nên khi xuống dòng
       tên mức bắt đầu từ mép trái ô và có đủ bề rộng của ô, không bị ép sau chữ `Điểm toàn diện:` */
    '.op-score-row [data-rt],.op-score-row [data-rt]>.rt-line{display:contents}',
    '[data-rt] .sc-lbl strong{font-weight:700}',
    '.rt-tagline{display:inline-flex;align-items:center;gap:6px;max-width:100%;min-width:0;flex-shrink:0}',
    '.rt-i{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;',
    'border:1px solid var(--z300);color:var(--z500);font-size:11px;cursor:help;background:var(--z0);flex:none}',
    '.rt-i:hover,.rt-i:focus-visible{border-color:var(--brand);color:var(--brand);outline:none}',
    /* ô chỉ xem: dùng lại .ql-val / .ql-dash của E-01 nên không khai báo thêm */
    /* tooltip dùng chung */
    '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;',
    'clip:rect(0,0,0,0);white-space:nowrap;border:0}',
    /* Tooltip nằm position:fixed, vị trí do placeTip() tính theo nút: khung chứa có overflow:hidden (thẻ Đánh giá
       toàn diện, bảng) cũng không cắt mất tooltip; thiếu chỗ phía trên thì lật xuống dưới (sửa 02/10/2026). */
    '.pms-tip{position:relative;display:inline-flex}',
    '.pms-tip-body{position:fixed;left:0;top:0;z-index:1600;',
    'background:var(--z900);color:var(--z0);font-size:12px;font-weight:500;line-height:1.5;padding:8px 11px;border-radius:var(--rsm);',
    'width:max-content;max-width:320px;text-align:left;white-space:normal;text-transform:none;letter-spacing:0;',
    'box-shadow:var(--sh-md);opacity:0;visibility:hidden;transition:opacity .12s ease;pointer-events:none}',
    '.pms-tip-body p{margin:0}',
    '.pms-tip-body p + p{margin-top:6px}',
    '.pms-tip:hover .pms-tip-body,.pms-tip:focus-within .pms-tip-body{opacity:1;visibility:visible}',
    '.pms-tip-body::after{content:"";position:absolute;top:100%;left:var(--tip-x,50%);transform:translateX(-50%);',
    'border:5px solid transparent;border-top-color:var(--z900)}',
    '.pms-tip-body.below::after{top:auto;bottom:100%;border-top-color:transparent;border-bottom-color:var(--z900)}',

    /* ── tabs chu kỳ ── */
    '.yt{display:flex;gap:6px;border-bottom:2px solid var(--z200);margin-bottom:16px;overflow-x:auto}',
    '.yt-btn{display:flex;flex-direction:column;gap:2px;align-items:flex-start;padding:8px 15px;margin-bottom:-2px;',
    'background:var(--z0);border:1px solid var(--z300);border-radius:var(--rsm) var(--rsm) 0 0;cursor:pointer;',
    'transition:all .12s ease;font-family:inherit;white-space:nowrap;position:relative}',
    '.yt-name{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--z600)}',
    '.yt-name i{font-size:15px}',
    '.yt-state{font-size:11px;font-weight:600;letter-spacing:.2px;color:var(--z500)}',
    '.yt-btn:not(.on):not(.off):hover{background:var(--z100);border-color:var(--z400)}',
    /* ENH-E14: tab bấm được phải nhận ra bằng nhiều tín hiệu, không chỉ bằng màu */
    '.yt-btn:not(.on):not(.off):hover .yt-name{color:var(--z900);text-decoration:underline;text-underline-offset:3px}',
    '.yt-btn:focus-visible{outline:2px solid var(--brand-ring);outline-offset:2px}',
    '.yt-btn.on{background:var(--brand-muted);border-color:var(--brand-ring);border-bottom-color:var(--brand-muted);',
    'box-shadow:inset 0 3px 0 var(--brand)}',
    '.yt-btn.on .yt-name{color:var(--brand);font-weight:700}',
    '.yt-btn.on .yt-state{color:var(--brand)}',
    '.yt-btn.off{background:var(--z50);border-style:dashed;cursor:not-allowed}',
    '.yt-btn.off .yt-name,.yt-btn.off .yt-state{color:var(--z400)}',
    '.yt-dot{width:6px;height:6px;border-radius:50%;background:var(--brand);flex:none}',

    /* ── dải quy trình (ENH-E14) ───────────────────
       Dạng stepper có số và đường nối, giống Mid-Year Review trong E-01 (.stepper-track,
       .step-item, .step-circle) nhưng gọn hơn: vòng tròn 24px, chữ nhỏ hơn, bịt khoảng
       trống thừa. Mỗi bước là một nút thật để đọc thêm. */
    '.pst-hd{display:flex;align-items:center;gap:6px;width:100%;padding:0;border:0;background:transparent;',
    'font-family:inherit;font-size:11px;font-weight:600;text-align:left;cursor:pointer;',
    'text-transform:uppercase;letter-spacing:.5px;color:var(--z500);margin-bottom:26px}',
    '.pst-hd>i{font-size:13px;color:var(--brand)}',
    '.pst-hd:hover{color:var(--z700)}',
    '.pst-chev{margin-left:auto;font-size:16px;color:var(--z500);transition:transform .15s ease}',
    '.pst-card.collapsed .pst-chev{transform:rotate(-90deg)}',
    '.pst-card.collapsed .pst-hd{margin-bottom:0}',
    '.pst-card.collapsed .pst-track{display:none}',
    /* Thu gọn rồi vẫn phải nói được kỳ đang ở bước nào */
    '.pst-now{display:none;margin-top:8px;font-size:12px;color:var(--z600);line-height:1.45}',
    '.pst-card.collapsed .pst-now{display:block}',
    '.pst-now strong{color:var(--z900);font-weight:600}',
    '.pst-card{overflow-x:auto}',
    '.pst-track{display:flex;align-items:flex-start;position:relative;min-width:max-content}',
    '.pst-track::before{content:"";position:absolute;top:11px;left:14px;right:14px;height:2px;background:var(--z200);z-index:0}',
    '.pst-step{flex:1 1 0;min-width:118px;display:flex;flex-direction:column;align-items:center;text-align:center;',
    'position:relative;z-index:1;padding:0 4px 4px}',
    '.pst-circle{width:24px;height:24px;border-radius:50%;background:var(--z200);color:var(--z500);font-size:11px;',
    'font-weight:700;display:flex;align-items:center;justify-content:center;flex:none;transition:all .12s ease;',
    'box-shadow:0 0 0 3px var(--z50)}',
    '.pst-step.done .pst-circle{background:var(--z400);color:#fff}',
    '.pst-step.open .pst-circle{background:var(--brand);color:#fff;box-shadow:0 0 0 3px var(--brand-muted)}',
    '.pst-body{margin-top:7px;width:100%}',
    '.pst-name{display:block;font-size:12px;font-weight:600;color:var(--z700);line-height:1.3}',
    '.pst-step.open .pst-name{color:var(--brand)}',
    '.pst-dom{font-size:11px;font-weight:400;color:var(--z500);white-space:nowrap}',
    '.pst-date{display:block;font-size:11px;color:var(--z600);line-height:1.3;margin-top:2px;font-variant-numeric:tabular-nums}',

    /* ── tourguide (ENH-E14) ─────────────────────────────
       Spotlight làm bằng box-shadow tràn màn hình trên một ô rỗng đặt đúng
       vị trí phần tử, nên không cần cắt DOM và không ảnh hưởng layout. */
    '.tg-hole{position:fixed;z-index:1600;border-radius:var(--r);pointer-events:none;',
    // KHÔNG cho toạ độ chạy transition: vùng sáng phải trùng đúng phần tử ngay lập tức.
    // Để transition thì lúc đang chạy nó nằm giữa hai vị trí, và nếu trình duyệt tạm dừng
    // hoạt ảnh thì nó kẹt hẳn ở bước trước.
    'box-shadow:0 0 0 9999px rgba(9,9,11,.55),0 0 0 2px var(--brand)}',
    '.tg-catch{position:fixed;inset:0;z-index:1595}',
    '.tg-card{position:fixed;z-index:1610;width:330px;max-width:calc(100vw - 24px);background:var(--z0);',
    'border:1px solid var(--z200);border-radius:var(--r);box-shadow:0 8px 30px rgba(0,0,0,.18);padding:14px 15px 12px}',
    '.tg-head{display:grid;grid-template-columns:48px minmax(0,1fr);gap:10px;align-items:start;padding-right:20px}',
    '.tg-mascot{width:46px;height:46px;object-fit:contain;display:block;align-self:center}',
    '.tg-step{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--brand)}',
    '.tg-ti{font-size:14.5px;font-weight:600;color:var(--z900);margin:3px 0 5px}',
    '.tg-tx{font-size:13px;color:var(--z600);line-height:1.55}',
    '.tg-ft{display:flex;align-items:center;gap:7px;margin-top:13px}',
    '.tg-dots{display:flex;gap:4px;margin-right:auto}',
    '.tg-dot{width:6px;height:6px;border-radius:50%;background:var(--z300)}',
    '.tg-dot.on{background:var(--brand);width:16px;border-radius:999px}',
    '.tg-skip{position:absolute;top:10px;right:10px;width:24px;height:24px;display:inline-flex;align-items:center;',
    'justify-content:center;border:0;background:transparent;color:var(--z500);border-radius:var(--rsm);cursor:pointer}',
    '.tg-skip:hover{background:var(--z100);color:var(--z900)}',
    '.tg-skip i{font-size:17px}',

    /* ── dialog ── */
    '.pms-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(2px);display:none;',
    'align-items:center;justify-content:center;padding:16px;z-index:1400}',
    '.pms-ov.open{display:flex}',
    '.pms-dlg{background:var(--z0);border:1px solid var(--z200);border-radius:var(--r);max-width:440px;width:100%;',
    'box-shadow:0 8px 30px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.04);overflow:hidden}',
    '.pms-dlg-bd{padding:18px}',
    '.pms-dlg-bd{position:relative}',
    '.pms-dlg-x{position:absolute;top:12px;right:12px;width:26px;height:26px;display:inline-flex;align-items:center;',
    'justify-content:center;border:0;background:transparent;color:var(--z500);border-radius:var(--rsm);cursor:pointer}',
    '.pms-dlg-x:hover{background:var(--z100);color:var(--z900)}',
    '.pms-dlg-x i{font-size:19px}',
    '.pms-dlg-ti{font-size:15px;font-weight:600;color:var(--z900);margin-bottom:5px;padding-right:30px}',
    '.pms-dlg-tx{font-size:13px;color:var(--z600);line-height:1.55}',
    '.pms-dlg-ft{display:flex;gap:8px;justify-content:flex-end;align-items:center;padding:12px 18px 16px;border-top:1px solid var(--z200);flex-wrap:wrap}',
    '.pms-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:var(--rsm);font-size:13px;',
    'font-weight:500;border:1px solid transparent;cursor:pointer;font-family:inherit;transition:all .12s ease}',
    '.pms-btn-default{background:var(--brand);border-color:var(--brand);color:#fff}',
    '.pms-btn-default:hover{background:var(--brand-h);border-color:var(--brand-h)}',
    '.pms-btn-outline{background:var(--z0);border-color:var(--z200);color:var(--z700)}',
    '.pms-btn-outline:hover{background:var(--z100);border-color:var(--z300)}',
    '.pms-btn-quiet{background:var(--z0);border-color:var(--z200);color:var(--z600)}',
    '.pms-btn-quiet:hover{background:var(--z100);border-color:var(--z300);color:var(--z900)}',

    /* ── mascot hướng dẫn (YER-SPEC §43): E-05 và M-06 dùng chung U.mascotGuide ── */
    '.tabs:has(.yer-mascot-guide){position:relative;padding-right:48px}',
    '.yer-mascot-guide{position:absolute;right:5px;top:50%;z-index:12;transform:translateY(-50%);display:none}.tabs:has(#tab-yer.on) .yer-mascot-guide{display:block}.yer-mascot-trigger{position:relative;width:34px;height:34px;padding:2px;border:1px solid var(--brand-ring);border-radius:11px;background:linear-gradient(145deg,#fff 15%,var(--brand-muted));box-shadow:0 3px 11px rgba(65,18,47,.13);cursor:pointer;display:grid;place-items:center;transition:transform .16s ease,box-shadow .16s ease,background .16s ease}.yer-mascot-trigger:hover,.yer-mascot-trigger:focus-visible{transform:translateY(-1px);background:#fff;box-shadow:0 5px 16px rgba(165,0,100,.19);outline:none}.yer-mascot-trigger:focus-visible{box-shadow:0 0 0 3px rgba(249,83,150,.22),0 6px 18px rgba(165,0,100,.20)}.yer-mascot-trigger img{width:28px;height:28px;object-fit:contain;display:block}.yer-mascot-trigger:hover img,.yer-mascot-trigger:focus-visible img{animation:yer-hello .72s ease-in-out 1}.yer-mascot-dot{position:absolute;left:-2px;top:-3px;width:8px;height:8px;border:2px solid #fff;border-radius:50%;background:var(--brand)}.yer-mascot-bubble{position:absolute;right:42px;top:50%;width:300px;padding:12px 14px;border:1px solid var(--brand-ring);border-radius:12px;background:#fff;color:var(--z600);font-size:12px;line-height:1.5;box-shadow:0 12px 32px rgba(24,24,27,.16);opacity:0;visibility:hidden;pointer-events:none;transform:translate(7px,-50%) scale(.985);transform-origin:right center;transition:opacity .16s ease,transform .16s ease,visibility 0s linear .16s}.yer-mascot-guide:hover .yer-mascot-bubble,.yer-mascot-guide:focus-within .yer-mascot-bubble{opacity:1;visibility:visible;transform:translate(0,-50%);transition-delay:0s}.yer-mascot-bubble:after{content:"";position:absolute;left:100%;top:50%;transform:translateY(-50%);border:7px solid transparent;border-left-color:#fff}.yer-mascot-step{display:inline-block;padding:1px 8px;border-radius:99px;background:var(--brand-muted);color:var(--brand);font-weight:700;white-space:nowrap}.yer-mascot-guide.stuck{position:fixed;right:10px;top:50%;transform:translateY(-50%)}.yer-mascot-title{font-size:13px;font-weight:700;color:var(--z900);margin-bottom:3px}.yer-mascot-state{display:inline-flex;margin-top:8px;padding:3px 8px;border-radius:99px;background:var(--brand-muted);color:var(--brand);font-size:10.5px;font-weight:700}body.pms-tour-open .yer-mascot-guide{display:none!important}@keyframes yer-hello{0%,100%{transform:rotate(0) translateY(0)}30%{transform:rotate(-4deg) translateY(-1px)}65%{transform:rotate(3deg)}}@media(prefers-reduced-motion:reduce){.yer-mascot-trigger,.yer-mascot-bubble{transition:none}.yer-mascot-trigger img{animation:none!important}}@media(max-width:700px){.yer-mascot-bubble{width:min(284px,calc(100vw - 64px))}}',

    /* ── Banner xanh hai tầng dùng chung E-05 và M-06 (YER-SPEC §42, §48, chị chốt 05/10/2026):
       tầng trên là icon, tiêu đề, MỘT dòng ngày (kèm liên kết Lịch sử chỉnh sửa), bên phải là điểm và nút;
       tầng dưới trải hết chiều ngang, thẳng lề với tiêu đề, chứa các dòng dài. ── */
    '.submit-banner.yer-sb2{flex-wrap:wrap;row-gap:0}',
    '.yer-sb2 .sb-info{flex:1 1 240px;min-width:0}',
    '.yer-sb2 .yer-sb-more{flex:0 0 calc(100% - 50px);min-width:0;margin:10px 0 0 50px;padding-top:9px;border-top:1px dashed var(--ok-bd);',
    'display:flex;flex-direction:column;gap:4px}',
    '.yer-sb2 .yer-sb-more .sb-sub,.yer-sb2 .yer-sb-more .yer-next-step{margin:0}',
    '.yer-sb-link{display:inline-flex;align-items:center;gap:3px;padding:0;border:0;background:none;font:inherit;font-weight:600;color:var(--z600);cursor:pointer}',
    '.yer-sb-link:hover{text-decoration:underline}',
    '.yer-sb-link i{font-size:13px}',

    /* ── Các bước tải file (popup nộp bổ sung E-05, popup Upload điểm M-05; chị chốt 05/10/2026):
       một khung viền, mỗi bước một hàng: nhãn BƯỚC n kèm icon, câu việc cần làm và nút ngay trên cùng hàng,
       ghi chú phụ chữ nhỏ xám. Không tô màu thẻ bước hay tên cột để khỏi nhầm với nút. ── */
    '.yer-flow{margin:0;padding:0;list-style:none;border:1px solid var(--z200);border-radius:10px;overflow:hidden;background:#fff}',
    '.yer-flow-step{display:grid;grid-template-columns:104px minmax(0,1fr);align-items:center;gap:18px;min-width:0;min-height:68px;padding:12px 16px;background:#fff}',
    '.yer-flow-step+.yer-flow-step{border-top:1px solid var(--z200)}',
    '.yer-flow-head{display:flex;align-items:center;gap:7px}',
    '.yer-flow-no{font-size:10.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--brand)}',
    '.yer-flow-icon{flex:none;display:inline-grid;place-items:center;color:var(--z500);font-size:15px}',
    '.yer-flow-copy{min-width:0}',
    '.yer-flow-line{display:flex;align-items:center;gap:12px;flex-wrap:wrap}',
    '.yer-flow-title{font-size:12px;line-height:1.45;color:var(--z900)}',
    '.yer-flow-line .btn{flex:none}',
    '.yer-flow-note{display:flex;align-items:flex-start;gap:5px;margin-top:6px;font-size:10.5px;line-height:1.45;color:var(--z500)}',
    '.yer-flow-note i{flex:none;margin-top:1px;color:var(--brand);font-size:13px}',
    '@media(max-width:620px){.yer-flow-step{grid-template-columns:1fr;gap:8px;padding:14px}.yer-flow-line{align-items:flex-start;flex-direction:column}}',

    /* ── Lịch sử chỉnh sửa: mỗi lần gửi một thẻ, mới nhất ở trên, thẻ đang ghi nhận viền xanh (E-05, M-06) ── */
    '.yer-log-dialog{max-width:540px}',
    '.yer-vers{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;max-height:56vh;overflow:auto}',
    '.yer-ver{padding:12px 14px;border:1px solid var(--z200);border-radius:var(--r);background:var(--z0)}',
    '.yer-ver.current{border-color:var(--ok-bd)}',
    '.yer-ver-hd{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}',
    '.yer-ver-hd strong{font-size:13.5px;font-weight:700;color:var(--z900)}',
    '.yer-ver:not(.current) .yer-ver-hd strong{color:var(--z700)}',
    '.yer-log-cur{display:inline-flex;align-items:center;gap:3px;height:20px;padding:0 8px;border:1px solid var(--ok-bd);border-radius:50px;',
    'background:var(--ok-bg);color:var(--ok);font-size:11px;font-weight:600}',
    '.yer-log-cur i{font-size:13px}',
    '.yer-ver-when{display:inline-flex;align-items:center;gap:4px;margin-top:2px;font-size:12px;color:var(--z600);font-variant-numeric:tabular-nums}',
    '.yer-ver-when i{font-size:13px;color:var(--z500)}',
    '.yer-ver-sec{margin-top:9px;padding-top:9px;border-top:1px dashed var(--z200)}',
    '.yer-ver-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--z500);margin-bottom:3px}',
    '.yer-log-tx{margin:0;padding-left:16px;font-size:12.5px;color:var(--z800);line-height:1.55}',
    '.yer-ver-ev{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;font-size:12.5px;color:var(--z700);line-height:1.5}',
    '.yer-ver-ev li{display:flex;align-items:flex-start;gap:6px}',
    '.yer-ver-ev i{flex:none;margin-top:2px;font-size:14px;color:var(--z500)}',
    '.yer-log-sum{display:flex;gap:8px;align-items:flex-start;margin:4px 0 14px;padding:10px 12px;border:1px solid var(--ok-bd);',
    'border-radius:var(--rsm);background:var(--ok-bg);font-size:12.5px;color:var(--z700);line-height:1.5}',
    '.yer-log-sum>i{font-size:16px;color:var(--ok);margin-top:1px}',
    '.yer-log-sum strong{color:var(--z900);font-weight:600}',

    /* ── toast ── */
    '.pms-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:110px;z-index:1500;background:var(--z900);',
    'color:#fff;font-size:13px;font-weight:500;padding:9px 15px;border-radius:var(--rsm);display:flex;align-items:center;',
    'gap:7px;box-shadow:0 8px 30px rgba(0,0,0,.2);opacity:0;transition:opacity .18s ease;pointer-events:none;max-width:88vw}',
    '.pms-toast.show{opacity:1}',
    '.pms-toast i{font-size:16px;color:var(--ok)}'
  ].join('');

  function injectCss() {
    if (document.getElementById('pms-ui-css')) return;
    var s = document.createElement('style');
    s.id = 'pms-ui-css';
    s.textContent = CSS;
    document.head.appendChild(s);
    document.addEventListener('mouseover', placeTip, true);
    document.addEventListener('focusin', placeTip, true);
  }
  /* Banner xanh hai tầng (E-05, M-06). o: { cls, icon, title, sub, right, more: [] }. title, sub, right, more là HTML đã escape. */
  function banner(o) {
    return '<div class="submit-banner yer-sb2' + (o.cls ? ' ' + o.cls : '') + '">' +
      '<div class="sb-icon"><i class="bx ' + (o.icon || 'bx-check-circle') + '"></i></div>' +
      '<div class="sb-info"><div class="sb-title">' + o.title + '</div>' +
        (o.sub ? '<div class="sb-sub">' + o.sub + '</div>' : '') + '</div>' +
      (o.right || '') +
      ((o.more || []).length ? '<div class="yer-sb-more">' + o.more.map(function (x) {
        return x.indexOf('<div') === 0 ? x : '<div class="sb-sub">' + x + '</div>'; }).join('') + '</div>' : '') +
    '</div>';
  }
  /* Đặt tooltip .pms-tip-body ngay trên nút (thiếu chỗ thì dưới), giữ trong màn hình, mũi tên chỉ đúng nút. */
  function placeTip(e) {
    var host = e.target && e.target.closest ? e.target.closest('.pms-tip') : null;
    var body = host && host.querySelector('.pms-tip-body');
    if (!body) return;
    var trigger = host.firstElementChild === body ? host : host.firstElementChild;
    var r = trigger.getBoundingClientRect();
    var w = body.offsetWidth, h = body.offsetHeight, gap = 8, pad = 8;
    var cx = r.left + r.width / 2;
    var left = Math.min(Math.max(cx - w / 2, pad), window.innerWidth - w - pad);
    var below = r.top - h - gap < pad;
    body.classList.toggle('below', below);
    body.style.left = left + 'px';
    body.style.top = (below ? r.bottom + gap : r.top - h - gap) + 'px';
    body.style.setProperty('--tip-x', Math.min(Math.max(cx - left, 10), w - 10) + 'px');
  }

  /* ═══ 1. Rating selector ════════════════════════
     Dùng đúng ô <select> của Mid-Year Review trong E-01, không dựng control riêng:
     điểm từng mục tiêu là .sc-select (1-5), điểm toàn diện là .op-select (1-5 bước 0.5).
     ENH-E13 chỉ thêm hai thứ mà MYR còn thiếu:
       - TÊN MỨC hiện cạnh ô chọn, kể cả mức lẻ (MYR đang để trống mức .5).
       - ĐỊNH NGHĨA MỨC hiện ngay sau khi chọn, và tra lại được ở ⓘ sau khi gửi.
     opts: { value, step:'int'|'half', readonly, disabled, compact,
             label, required, onChange }                                     */
  var TONE = { 5: 'lbl-xs', 4: 'lbl-good', 3: 'lbl-ok', 2: 'lbl-need', 1: 'lbl-fail' };

  function rating(el, opts) {
    injectCss();
    opts = opts || {};
    var state = { value: opts.value == null ? null : Number(opts.value) };
    var half = opts.step === 'half';
    var stepv = half ? 0.5 : 1;

    function values() {
      var out = [], v;
      for (v = 1; v <= 5.0001; v += stepv) out.push(Math.round(v * 10) / 10);
      return out;
    }
    function isHalf(v) { return Math.abs(v % 1) > 0; }
    function fmtNum(v) { return isHalf(v) ? v.toFixed(1) : String(v); }
    function nameOf(v) {
      return isHalf(v) ? (window.PMSYer ? window.PMSYer.scoreLabel(v, lang()) : '') : levelName(v);
    }
    function toneOf(v) { return TONE[Math.floor(v)] || ''; }

    // Tên mức in đậm, nhất quán ở mọi mức: mức nguyên đậm cả tên, mức nửa bậc đậm hai tên mức, chữ nối thường (04/10/2026)
    function nameHtml(v) {
      var n = nameOf(v);
      if (!isHalf(v)) return '<strong>' + esc(n) + '</strong>';
      var m = String(n).match(/^(Giữa mức |Between )(.+?)( và | and )(.+)$/);
      return m ? esc(m[1]) + '<strong>' + esc(m[2]) + '</strong>' + esc(m[3]) + '<strong>' + esc(m[4]) + '</strong>' : esc(n);
    }
    function nameTag(v) {
      var n = nameOf(v);
      if (!n) return '';
      // Bọc chữ trong một span: chip là inline-flex, để chữ và thẻ đậm làm con trực tiếp thì mất khoảng trắng giữa chúng
      return '<span class="sc-lbl show ' + toneOf(v) + '"><span class="sc-lbl-tx">' + nameHtml(v) + '</span></span>';
    }
    /* Ô định nghĩa có tiêu đề riêng: không có nó thì đoạn chữ nằm trơ dưới ô nhận xét,
       người đọc không biết đây là giải thích mức điểm hay là gợi ý viết nhận xét.
       Tiêu đề chỉ dùng cho ô trên màn; tooltip đã có aria-label nên không lặp lại. */
    function defPanel(v) {
      return '<div class="rt-def">' +
        '<div class="rt-def-hd"><i class="bx bx-info-circle"></i>' +
        esc(lang() === 'en' ? 'What this rating means' : 'Ý nghĩa thang điểm') + '</div>' +
        definitionHtml(v) + '</div>';
    }

    function tipHtml(v) {
      return '<span class="pms-tip"><span class="rt-i" tabindex="0" role="button" aria-label="' +
        esc(lang() === 'en' ? 'Rating definition' : 'Định nghĩa mức điểm') + '">i</span>' +
        '<span class="pms-tip-body" role="tooltip">' + definitionHtml(v) + '</span></span>';
    }

    function renderReadonly() {
      if (state.value == null) {
        el.innerHTML = opts.compact ? '<div class="ql-dash">—</div>' : '<span class="rt-empty">—</span>';
        return;
      }
      if (opts.compact) { el.innerHTML = '<div class="ql-val">' + fmtNum(state.value) + '</div>'; return; }
      // Tên mức và ⓘ đi cùng nhau: xuống dòng thì xuống cả cụm, ⓘ không đứng lẻ một dòng (04/10/2026)
      el.innerHTML = '<div class="rt-line"><span class="ql-val">' + fmtNum(state.value) + '</span>' +
        '<span class="rt-tagline">' + nameTag(state.value) + (half ? tipHtml(state.value) : '') + '</span></div>';
    }

    function renderEditable() {
      var val = state.value;
      var head = opts.label
        ? '<span class="op-score-lbl">' + esc(opts.label) +
          (opts.required ? '<span style="color:#dc2626;margin-left:2px">*</span>' : '') + '</span>'
        : '';
      // Chưa chọn thì ô tự nói cách dùng, thay cho dấu gạch ngang (§41.1)
      var sel = '<select class="' + (half ? 'op-select' : 'sc-select') + (val == null ? ' rt-unset' : '') + '"' +
        (opts.disabled ? ' disabled' : '') +
        ' aria-label="' + esc(opts.label || (lang() === 'en' ? 'Rating' : 'Điểm đánh giá')) + '">' +
        '<option value="">' + (lang() === 'en' ? 'Select 1-5' : 'Chọn điểm 1-5') + '</option>' +
        values().map(function (v) {
          return '<option value="' + v + '"' + (val === v ? ' selected' : '') + '>' + fmtNum(v) + '</option>';
        }).join('') + '</select>';

      // Ô điểm trong lưới chỉ rộng 64px nên chỉ có chỗ cho ô chọn
      if (opts.compact) { el.innerHTML = sel; bind(); return; }

      // ⓘ chỉ xuất hiện sau khi đã gửi (nhánh renderReadonly). Đang nhập thì định nghĩa
      // đã nằm sẵn ở ô ngay bên dưới nên thêm ⓘ là thừa.
      // Định nghĩa chỉ hiện với điểm toàn diện và chỉ sau khi đã chọn điểm.
      // opts.defInto cho phép màn hình đặt ô định nghĩa ở chỗ khác, ví dụ dưới ô nhận xét.
      var defHtml = (half && val != null) ? defPanel(val) : '';
      var defBox = opts.defInto ? document.querySelector(opts.defInto) : null;
      el.innerHTML = '<div class="rt-line">' + head + sel +
          (val == null ? '' : nameTag(val)) + '</div>' + (defBox ? '' : defHtml);
      if (defBox) defBox.innerHTML = defHtml;
      bind();
    }

    function bind() {
      var sel = el.querySelector('select');
      if (!sel || opts.disabled) return;
      sel.addEventListener('change', function () {
        state.value = sel.value === '' ? null : Number(sel.value);
        renderEditable();
        if (opts.onChange) opts.onChange(state.value);
        if (window.PMSUi && window.PMSUi.dirty) window.PMSUi.dirty.mark();
      });
    }

    function draw() { (opts.readonly ? renderReadonly : renderEditable)(); }
    draw();

    return {
      el: el,
      get value() { return state.value; },
      set: function (v) { state.value = v == null ? null : Number(v); draw(); },
      setReadonly: function (ro) { opts.readonly = !!ro; draw(); },
      redraw: draw
    };
  }

  /* ═══ 2. Tab chu kỳ ═════════════════════════════════════
     opts: { active:'goals'|'myr'|'yer', items:[{key,label,state,openFrom,disabled,dot}], onSelect }
     state = nhãn theo việc người dùng cần làm, không dùng "đang diễn ra".  */
  var TAB_ICON = { goals: 'bx-target-lock', myr: 'bx-calendar-star', yer: 'bx-calendar-check' };

  function tabs(el, opts) {
    injectCss();
    opts = opts || {};
    var items = opts.items || [];

    function draw() {
      el.className = 'yt';
      el.setAttribute('role', 'tablist');
      el.innerHTML = items.map(function (it) {
        var on = it.key === opts.active;
        var off = !!it.disabled;
        var tipText = off && it.openFrom
          ? (lang() === 'en' ? 'Opens on ' : 'Bắt đầu từ ') + it.openFrom
          : '';
        var inner =
          '<span class="yt-name">' + (it.dot && !on ? '<span class="yt-dot"></span>' : '') +
            '<i class="bx ' + (TAB_ICON[it.key] || 'bx-file') + '"></i>' + esc(it.label) + '</span>' +
          (it.state ? '<span class="yt-state">' + esc(it.state) + '</span>' : '');
        var btn = '<button type="button" class="yt-btn' + (on ? ' on' : '') + (off ? ' off' : '') +
          '" role="tab" aria-selected="' + on + '"' + (off ? ' aria-disabled="true"' : '') +
          ' data-key="' + it.key + '">' + inner + '</button>';
        return tipText
          ? '<span class="pms-tip">' + btn + '<span class="pms-tip-body" role="tooltip">' + esc(tipText) + '</span></span>'
          : btn;
      }).join('');

      el.querySelectorAll('.yt-btn').forEach(function (b) {
        b.addEventListener('click', function () {
          var it = items.filter(function (x) { return x.key === b.dataset.key; })[0];
          if (!it || it.disabled || it.key === opts.active) return;
          // Enh 12: chặn khi còn dữ liệu chưa lưu
          window.PMSUi.dirty.guard(function () {
            opts.active = it.key;
            draw();
            if (opts.onSelect) opts.onSelect(it.key);
          });
        });
      });
    }
    draw();
    return {
      el: el,
      setActive: function (k) { opts.active = k; draw(); },
      setItems: function (list) { items = list; draw(); },
      redraw: draw
    };
  }

  /* ═══ 3. Dải quy trình (ENH-E14) ══════════════════
     Stepper có số và đường nối giống Mid-Year Review, nhưng gọn hơn và có thêm
     domain người thực hiện. Bấm một bước thì mở hộp giải thích.
     opts: {
       title,
       items: [{ key, name, domain, date, state:'done'|'open'|'todo', tag,
                 who, what, you }]
     }
     Chủ màn tự quyết định chuỗi `date`: theo ENH-E14 chỉ bước tự đánh giá hiện
     khoảng ngày, các bước còn lại chỉ hiện hạn chót.                              */
  function steps(el, opts) {
    injectCss();
    opts = opts || {};
    var items = opts.items || [];

    // Nhớ trạng thái thu gọn theo từng màn, để đổi ngôn ngữ hay đổi ngày không mở lại.
    var ckey = opts.collapseKey || 'default';
    function readCollapsed() {
      if (!window.PMSStore) return false;
      var ui = window.PMSStore.admin('stepsCollapsed');
      return !!(ui && ui[ckey]);
    }
    function saveCollapsed() {
      if (!window.PMSStore) return;
      var ui = Object.assign({}, window.PMSStore.admin('stepsCollapsed') || {});
      ui[ckey] = collapsed;
      window.PMSStore.setAdmin('stepsCollapsed', ui);
    }
    var collapsed = readCollapsed();

    function nowLine() {
      var en = lang() === 'en';
      var cur = items.filter(function (it) { return it.state === 'open'; })[0];
      if (!cur) return '';
      return '<div class="pst-now">' + esc(en ? 'Currently at: ' : 'Đang ở bước: ') +
        '<strong>' + esc(cur.name) + '</strong>' +
        (cur.domain ? ' (' + esc(cur.domain) + ')' : '') +
        (cur.date ? ' - ' + esc(cur.date) : '') + '</div>';
    }

    function draw() {
      var en = lang() === 'en';
      el.className = 'stepper-card pst-card' + (collapsed ? ' collapsed' : '');
      el.innerHTML =
        '<button type="button" class="stepper-hd pst-hd" aria-expanded="' + (!collapsed) + '">' +
          '<i class="bx bx-directions"></i>' + esc(opts.title || '') +
          '<i class="bx bx-chevron-down pst-chev" aria-hidden="true"></i>' +
          '<span class="sr-only">' +
            esc(collapsed ? (en ? 'Expand the process strip' : 'Mở rộng dải quy trình')
                          : (en ? 'Collapse the process strip' : 'Thu gọn dải quy trình')) +
          '</span>' +
        '</button>' + nowLine() +
        // Bước chỉ để đọc, không bấm được: mọi thông tin cần biết đã nằm sẵn trên dải.
        '<div class="pst-track">' + items.map(function (it, i) {
          return '<div class="pst-step ' + esc(it.state || 'todo') + '">' +
            '<span class="pst-circle">' + (i + 1) + '</span>' +
            '<span class="pst-body">' +
              // Domain nằm cùng dòng với tên vai cho đỡ tốn chiều cao.
              // Bước Công bố kết quả không gắn với người cụ thể nên không có domain.
              '<span class="pst-name">' + esc(it.name) +
                (it.domain ? ' <span class="pst-dom">(' + esc(it.domain) + ')</span>' : '') + '</span>' +
              '<span class="pst-date">' + esc(it.date || '') + '</span>' +
            '</span>' +
          '</div>';
        }).join('') + '</div>';

      el.querySelector('.pst-hd').addEventListener('click', function () {
        collapsed = !collapsed;
        saveCollapsed();
        draw();
      });
    }
    draw();
    return { el: el, setItems: function (list) { items = list; draw(); }, redraw: draw };
  }

  /* ═══ 4. Tourguide (ENH-E14) ════════════════════════════
     items: [{ sel, title, text, place:'auto'|'top'|'bottom' }]
     Bước nào không tìm thấy phần tử thì bỏ qua, để tour không chết khi màn
     hình đổi theo vai hoặc theo ngày hệ thống.                              */
  // Màn hình render lại nhiều lần (đổi ngôn ngữ, đổi nhân sự), nên phải chặn
  // trường hợp hai tour cùng mở chồng lên nhau.
  var tourSeenMem = {}, tourBusy = false;

  function tourSeen(key) {
    if (!key) return false;
    if (window.PMSStore) {
      var a = window.PMSStore.admin('tourSeen');
      return !!(a && a[key]);
    }
    return !!tourSeenMem[key];
  }
  function markTourSeen(key) {
    if (!key) return;
    tourSeenMem[key] = true;
    if (window.PMSStore) window.PMSStore.setAdmin('tourSeen', (function () { var o = {}; o[key] = true; return o; })());
  }

  function startTour(items, opts) {
    injectCss();
    opts = opts || {};
    if (tourBusy) return;
    var list = (items || []).filter(function (it) { return document.querySelector(it.sel); });
    if (!list.length) return;
    tourBusy = true;

    var i = 0, hole, card, catcher;

    function cleanup() {
      tourBusy = false;
      document.body.classList.remove('pms-tour-open');
      [hole, card, catcher].forEach(function (n) { if (n) n.remove(); });
      hole = card = catcher = null;
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('keydown', onKey, true);
    }
    function finish() { markTourSeen(opts.key); cleanup(); if (opts.onEnd) opts.onEnd(); }

    function place() {
      var it = list[i];
      var node = document.querySelector(it.sel);
      if (!node) { return; }
      var r = node.getBoundingClientRect(), pad = 6;
      hole.style.top = Math.max(4, r.top - pad) + 'px';
      hole.style.left = Math.max(4, r.left - pad) + 'px';
      hole.style.width = (r.width + pad * 2) + 'px';
      hole.style.height = (r.height + pad * 2) + 'px';

      var ch = card.offsetHeight, cw = card.offsetWidth;
      var below = window.innerHeight - r.bottom;
      var top = (it.place === 'top' || (it.place !== 'bottom' && below < ch + 24))
        ? Math.max(8, r.top - ch - 12)
        : Math.min(window.innerHeight - ch - 8, r.bottom + 12);
      var left = Math.min(Math.max(12, r.left), window.innerWidth - cw - 12);
      card.style.top = Math.round(top) + 'px';
      card.style.left = Math.round(left) + 'px';
    }

    function draw() {
      var en = lang() === 'en';
      var it = list[i];
      var node = document.querySelector(it.sel);
      // Cuộn tức thì, không dùng behavior:'smooth'. Cuộn mượt chạy bất đồng bộ nên
      // place() đo toạ độ giữa chừng và vùng sáng nằm sai chỗ.
      if (node && node.scrollIntoView) node.scrollIntoView({ block: 'center' });
      card.innerHTML =
        '<button type="button" class="tg-skip" data-go="end" aria-label="' +
          esc(en ? 'Skip guide' : 'Bỏ qua hướng dẫn') + '"><i class="bx bx-x"></i></button>' +
        '<div class="tg-head"><img class="tg-mascot" src="../assets/mascot/' + esc(it.pose || 'think.png') + '" alt="">' +
        '<div><div class="tg-step">' + esc((en ? 'Step ' : 'Bước ') + (i + 1) + '/' + list.length) + '</div>' +
        '<div class="tg-ti">' + esc(it.title) + '</div>' +
        '<div class="tg-tx">' + esc(it.text) + '</div></div></div>' +
        '<div class="tg-ft"><span class="tg-dots">' + list.map(function (_, k) {
          return '<span class="tg-dot' + (k === i ? ' on' : '') + '"></span>';
        }).join('') + '</span>' +
        (i > 0 ? '<button type="button" class="pms-btn pms-btn-quiet" data-go="prev">' +
          esc(en ? 'Back' : 'Quay lại') + '</button>' : '') +
        '<button type="button" class="pms-btn pms-btn-default" data-go="next">' +
          esc(i === list.length - 1 ? (en ? 'Done' : 'Xong') : (en ? 'Next' : 'Tiếp theo')) + '</button></div>';

      card.querySelectorAll('[data-go]').forEach(function (b) {
        b.addEventListener('click', function () {
          var go = b.dataset.go;
          if (go === 'end') { finish(); return; }
          if (go === 'prev') { i--; draw(); place(); return; }
          if (i === list.length - 1) { finish(); return; }
          i++; draw(); place();
        });
      });
      // Đo ngay sau khi cuộn, rồi đo lại ở khung hình kế tiếp cho chắc
      place();
      requestAnimationFrame(place);
    }

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); finish(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); if (i < list.length - 1) { i++; draw(); } else finish(); }
      if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); i--; draw(); }
    }

    catcher = document.createElement('div');
    catcher.className = 'tg-catch';
    catcher.addEventListener('click', function () { finish(); });
    hole = document.createElement('div');
    hole.className = 'tg-hole';
    card = document.createElement('div');
    card.className = 'tg-card';
    card.setAttribute('role', 'dialog');
    card.addEventListener('click', function (e) { e.stopPropagation(); });
    document.body.classList.add('pms-tour-open');
    document.body.appendChild(catcher);
    document.body.appendChild(hole);
    document.body.appendChild(card);

    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('keydown', onKey, true);
    draw();
  }

  /* ═══ 5. Cảnh báo dữ liệu chưa lưu ══════════════════════ */
  var dirtyState = { on: false, onSaveDraft: null };

  function watchDirty(scope) {
    scope = scope || document;
    ['input', 'change'].forEach(function (evt) {
      scope.addEventListener(evt, function (e) {
        var el = e.target;
        if (!el || !el.matches) return;
        if (el.matches('input,textarea,select,[contenteditable="true"]')) dirtyState.on = true;
      }, true);
    });
    window.addEventListener('beforeunload', function (e) {
      if (!dirtyState.on) return;
      e.preventDefault();
      e.returnValue = '';
    });
  }

  function guard(proceed) {
    if (!dirtyState.on) { proceed(); return; }
    var en = lang() === 'en';
    dialog({
      title: en ? 'Your changes have not been saved' : 'Nội dung chưa được lưu',
      text: en
        ? 'You have entered or edited content that is not saved yet. If you leave now, those changes will be lost.'
        : 'Bạn đã nhập hoặc chỉnh sửa một số nội dung nhưng chưa lưu. Nếu rời khỏi lúc này, các thay đổi sẽ bị mất.',
      buttons: [
        { label: en ? 'Leave without saving' : 'Rời đi, không lưu', variant: 'quiet', act: function () {
            dirtyState.on = false;
            proceed();
          } },
        { label: en ? 'Keep editing' : 'Tiếp tục chỉnh sửa', variant: 'quiet', act: function () {} },
        { label: en ? 'Save draft' : 'Lưu nháp', variant: 'default', icon: 'bx-save', act: function () {
            if (dirtyState.onSaveDraft) dirtyState.onSaveDraft();
            dirtyState.on = false;
            toast(en ? 'Draft saved' : 'Đã lưu nháp');
            proceed();
          } }
      ]
    });
  }

  /* ═══ 6. Dialog + toast ═════════════════════════════════ */
  function dialog(opts) {
    injectCss();
    var ov = document.createElement('div');
    ov.className = 'pms-ov open';
    ov.innerHTML =
      '<div class="pms-dlg" role="dialog" aria-modal="true">' +
        '<div class="pms-dlg-bd">' +
          '<button type="button" class="pms-dlg-x" aria-label="' +
            esc(lang() === 'en' ? 'Close' : 'Đóng') + '"><i class="bx bx-x"></i></button>' +
          '<div class="pms-dlg-ti">' + esc(opts.title || '') + '</div>' +
          // opts.html chỉ dùng cho nội dung do chính prototype dựng, không nhận dữ liệu người nhập
          '<div class="pms-dlg-tx">' + (opts.html != null ? opts.html : esc(opts.text || '')) + '</div>' +
        '</div>' +
        '<div class="pms-dlg-ft"></div>' +
      '</div>';
    if (opts.className) ov.querySelector('.pms-dlg').classList.add(opts.className);
    var foot = ov.querySelector('.pms-dlg-ft');
    (opts.buttons || []).forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pms-btn pms-btn-' + (b.variant || 'outline');
      btn.innerHTML = (b.icon ? '<i class="bx ' + b.icon + '"></i>' : '') + esc(b.label);
      btn.addEventListener('click', function () { close(); if (b.act) b.act(); });
      foot.appendChild(btn);
    });
    function close() { ov.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') { close(); if (opts.onDismiss) opts.onDismiss(); } }
    document.addEventListener('keydown', onKey);
    ov.querySelector('.pms-dlg-x').addEventListener('click', function () {
      close(); if (opts.onDismiss) opts.onDismiss();
    });
    ov.addEventListener('click', function (e) {
      if (e.target === ov) { close(); if (opts.onDismiss) opts.onDismiss(); }
    });
    document.body.appendChild(ov);
    var primary = foot.querySelector('.pms-btn-default') || foot.querySelector('button');
    if (primary) primary.focus();
    return { close: close };
  }

  /* ═══ Mascot hướng dẫn (YER-SPEC §43) ═══════════
     Đứng ở góc phải thanh tab, rê chuột thì vẫy tay và hiện bóng thoại, bấm thì chạy tourguide; cuộn xuống thì bám mép
     phải màn hình. E-05 và M-06 cùng dùng, mỗi màn tự đưa câu chữ và các bước.
     opts: { tabs: phần tử .tabs, title, stepLabel, intro, outro, ariaLabel, onStart } */
  function mascotGuide(opts) {
    injectCss();
    var tabs = opts && opts.tabs;
    if (!tabs) return null;
    var old = document.getElementById('yer-mascot-guide');
    if (old) old.remove();
    var wrap = document.createElement('div');
    wrap.id = 'yer-mascot-guide';
    wrap.className = 'yer-mascot-guide';
    wrap.innerHTML = '<div class="yer-mascot-bubble" id="yer-mascot-bubble" role="tooltip">' +
      '<div class="yer-mascot-title">' + esc(opts.title || '') + '</div>' +
      '<div>' + esc(opts.intro || '') + '<span class="yer-mascot-step">' + esc(opts.stepLabel || '') + '</span>' + esc(opts.outro || '') + '</div></div>' +
      '<button type="button" class="yer-mascot-trigger" aria-label="' + esc(opts.ariaLabel || '') + '" aria-describedby="yer-mascot-bubble">' +
      '<img src="../assets/mascot/idle.png" alt=""><span class="yer-mascot-dot" aria-hidden="true"></span></button>';
    tabs.appendChild(wrap);
    var btn = wrap.querySelector('.yer-mascot-trigger');
    var img = wrap.querySelector('img');
    function pose(name) { img.src = '../assets/mascot/' + name; }
    btn.addEventListener('mouseenter', function () { pose('wave.png'); });
    btn.addEventListener('mouseleave', function () { pose('idle.png'); });
    btn.addEventListener('focus', function () { pose('wave.png'); });
    btn.addEventListener('blur', function () { pose('idle.png'); });
    btn.addEventListener('click', function () { btn.blur(); pose('cheer.png'); if (opts.onStart) opts.onStart(); });
    // Cuộn xuống thì mascot rời thanh tab và bám sát mép phải màn hình
    function syncStick() { wrap.classList.toggle('stuck', tabs.getBoundingClientRect().bottom < 8); }
    window.removeEventListener('scroll', mascotGuide._stick, true);
    window.removeEventListener('resize', mascotGuide._stick);
    mascotGuide._stick = syncStick;
    window.addEventListener('scroll', syncStick, true);
    window.addEventListener('resize', syncStick);
    syncStick();
    return wrap;
  }

  var toastEl = null, toastTimer = null;
  function toast(msg) {
    injectCss();
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'pms-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<i class="bx bx-check-circle"></i><span>' + esc(msg) + '</span>';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  window.PMSUi = {
    rating: rating,
    banner: banner,
    mascotGuide: mascotGuide,
    tabs: tabs,
    steps: steps,
    tour: {
      start: function (items, opts) { startTour(items, opts); },
      // chỉ chạy lần đầu của mỗi vai; sau đó người dùng tự bấm "Xem hướng dẫn"
      auto: function (items, opts) {
        opts = opts || {};
        if (tourSeen(opts.key) || tourBusy) return;
        // đánh dấu ngay để lần render kế tiếp trong lúc chờ không mở tour thứ hai
        tourBusy = true;
        setTimeout(function () { tourBusy = false; startTour(items, opts); }, opts.delay == null ? 400 : opts.delay);
      },
      seen: tourSeen,
      markSeen: markTourSeen
    },
    dialog: dialog,
    toast: toast,
    fullLabel: fullLabel,
    definition: definition,
    dirty: {
      mark: function () { dirtyState.on = true; },
      clear: function () { dirtyState.on = false; },
      get isDirty() { return dirtyState.on; },
      watch: watchDirty,
      guard: guard,
      onSaveDraft: function (fn) { dirtyState.onSaveDraft = fn; }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCss);
  } else { injectCss(); }
})();
