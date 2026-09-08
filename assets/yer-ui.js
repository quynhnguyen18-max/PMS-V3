/* ═══════════════════════════════════════════════════════════
   YER UI — component dùng chung cho mọi màn Đánh giá cuối năm
   1. PMSUi.rating   — Enh 10: chọn điểm dạng hàng nút + định nghĩa thang điểm
   2. PMSUi.tabs     — Enh 11: tab chu kỳ có trạng thái, hover, disabled
   3. PMSUi.dirty    — Enh 12: cảnh báo dữ liệu chưa lưu khi rời màn
   4. PMSUi.dialog / PMSUi.toast — primitive dùng chung
   Spec: YER-SPEC.md muc 4, 18
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
    /* ── rating selector ── */
    '.rt{display:block}',
    '.rt-hd{display:flex;align-items:baseline;gap:8px;margin-bottom:6px}',
    '.rt-lbl{font-size:12.5px;font-weight:500;color:var(--z700)}',
    '.rt-req{color:#dc2626;margin-left:2px}',
    '.rt-hint{font-size:11.5px;color:var(--z600);margin-left:auto}',
    '.rt-pick{display:inline-flex;align-items:center;gap:9px;flex-wrap:wrap}',
    '.rt-trg{display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 7px 0 10px;background:var(--z0);',
    'border:1px solid var(--z300);border-radius:var(--rsm);cursor:pointer;font-family:inherit;transition:all .12s ease}',
    '.rt-trg:hover{border-color:var(--z400);background:var(--z50)}',
    '.rt-trg[aria-expanded="true"]{border-color:var(--brand);outline:2px solid var(--brand-ring);outline-offset:1px}',
    '.rt-trg:focus-visible{border-color:var(--brand);outline:2px solid var(--brand-ring);outline-offset:1px}',
    '.rt-trg:disabled{background:var(--z100);border-color:var(--z200);cursor:not-allowed}',
    '.rt-trg-v{font-size:13px;font-weight:700;color:var(--z900);font-variant-numeric:tabular-nums;min-width:22px}',
    '.rt-trg.empty .rt-trg-v{color:var(--z400);font-weight:500}',
    '.rt-trg i{font-size:15px;color:var(--z400)}',
    '.rt-trg-name{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--z900)}',
    '.rt-empty{font-size:12.5px;color:var(--z600)}',
    '.rt-def{margin-top:9px;border:1px solid var(--z200);background:var(--z50);border-radius:var(--rsm);padding:9px 11px}',
    '.rt-def-txt{font-size:12px;color:var(--z600);line-height:1.5}',
    '.rt-def-txt strong,.rt-panel-def strong,.pms-tip-body strong{font-weight:600;color:var(--z900)}',
    '.pms-tip-body strong{color:#fff}',
    '.rt-panel{position:fixed;z-index:1200;width:288px;background:var(--z0);border:1px solid var(--z200);',
    'border-radius:var(--r);box-shadow:0 8px 30px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.04);overflow:hidden}',
    '.rt-panel-hd{padding:7px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;',
    'color:var(--z500);background:var(--z50);border-bottom:1px solid var(--z200)}',
    '.rt-panel-list{padding:4px}',
    '.rt-row{display:grid;grid-template-columns:30px 1fr 16px;align-items:center;gap:8px;width:100%;text-align:left;',
    'padding:6px 8px;border:0;border-radius:var(--rsm);background:transparent;cursor:pointer;font-family:inherit;transition:all .1s ease}',
    '.rt-row:hover,.rt-row:focus-visible{background:var(--z100);outline:none}',
    '.rt-row.on{background:var(--brand-muted)}',
    '.rt-row-v{font-size:13px;font-weight:700;color:var(--z900);font-variant-numeric:tabular-nums;text-align:center}',
    '.rt-row-n{font-size:12.5px;color:var(--z700);line-height:1.35}',
    '.rt-row.half .rt-row-v{font-weight:600;color:var(--z600)}',
    '.rt-row.half .rt-row-n{color:var(--z600);font-size:12px}',
    '.rt-row.on .rt-row-v,.rt-row.on .rt-row-n{color:var(--brand)}',
    '.rt-row i{font-size:15px;color:var(--brand);opacity:0}',
    '.rt-row.on i{opacity:1}',
    '.rt-panel-def{padding:9px 12px;font-size:12px;color:var(--z600);line-height:1.5;background:var(--z50);',
    'border-top:1px solid var(--z200);max-height:118px;overflow:auto}',
    '.rt-ro{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:var(--z900)}',
    '.rt-ro-score{font-weight:700;font-variant-numeric:tabular-nums}',
    '.rt-ro-name{font-weight:500}',
    '.rt-i{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;',
    'border:1px solid var(--z300);color:var(--z500);font-size:11px;cursor:help;background:var(--z0)}',
    '.rt-i:hover,.rt-i:focus-visible{border-color:var(--brand);color:var(--brand);outline:none}',
    /* tooltip dùng chung */
    '.pms-tip{position:relative;display:inline-flex}',
    '.pms-tip-body{position:absolute;bottom:calc(100% + 7px);left:50%;transform:translateX(-50%);z-index:60;',
    'background:var(--z900);color:#fff;font-size:12px;font-weight:500;line-height:1.45;padding:7px 10px;border-radius:6px;',
    'width:max-content;max-width:280px;text-align:left;opacity:0;visibility:hidden;transition:opacity .12s ease;pointer-events:none}',
    '.pms-tip:hover .pms-tip-body,.pms-tip:focus-within .pms-tip-body{opacity:1;visibility:visible}',
    '.pms-tip-body::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);',
    'border:5px solid transparent;border-top-color:var(--z900)}',

    /* ── tabs chu kỳ ── */
    '.yt{display:flex;gap:6px;border-bottom:2px solid var(--z200);margin-bottom:16px;overflow-x:auto}',
    '.yt-btn{display:flex;flex-direction:column;gap:2px;align-items:flex-start;padding:8px 15px;margin-bottom:-2px;',
    'background:var(--z0);border:1px solid var(--z300);border-radius:var(--rsm) var(--rsm) 0 0;cursor:pointer;',
    'transition:all .12s ease;font-family:inherit;white-space:nowrap;position:relative}',
    '.yt-name{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--z600)}',
    '.yt-name i{font-size:15px}',
    '.yt-state{font-size:11px;font-weight:600;letter-spacing:.2px;color:var(--z500)}',
    '.yt-btn:not(.on):not(.off):hover{background:var(--z100);border-color:var(--z400)}',
    '.yt-btn:not(.on):not(.off):hover .yt-name{color:var(--z900)}',
    '.yt-btn:focus-visible{outline:2px solid var(--brand-ring);outline-offset:2px}',
    '.yt-btn.on{background:var(--brand-muted);border-color:var(--brand-ring);border-bottom-color:var(--brand-muted);',
    'box-shadow:inset 0 3px 0 var(--brand)}',
    '.yt-btn.on .yt-name{color:var(--brand);font-weight:700}',
    '.yt-btn.on .yt-state{color:var(--brand)}',
    '.yt-btn.off{background:var(--z50);border-style:dashed;cursor:not-allowed}',
    '.yt-btn.off .yt-name,.yt-btn.off .yt-state{color:var(--z400)}',
    '.yt-dot{width:6px;height:6px;border-radius:50%;background:var(--brand);flex:none}',

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

    /* ── toast ── */
    '.pms-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:110px;z-index:1500;background:var(--z900);',
    'color:#fff;font-size:13px;font-weight:500;padding:9px 15px;border-radius:var(--rsm);display:flex;align-items:center;',
    'gap:7px;box-shadow:0 8px 30px rgba(0,0,0,.2);opacity:0;transition:opacity .18s ease;pointer-events:none;max-width:88vw}',
    '.pms-toast.show{opacity:1}',
    '.pms-toast i{font-size:16px;color:#4ade80}'
  ].join('');

  function injectCss() {
    if (document.getElementById('pms-ui-css')) return;
    var s = document.createElement('style');
    s.id = 'pms-ui-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ═══ 1. Rating selector ════════════════════════════════
     Ô điểm trong lưới đánh giá chỉ rộng khoảng 64px (xem M-02), nên không thể
     dàn cả thang điểm ra một hàng. Cách giải quyết: nút chọn gọn như cũ, nhưng
     bảng chọn mở ra hiển thị TOÀN BỘ thang điểm kèm tên mức, không phải cuộn.
     Điểm từng mục tiêu (step 'int'): chỉ số và tên mức, không định nghĩa, không ⓘ.
     Điểm toàn diện (step 'half'): sau khi chọn mới hiện ô định nghĩa để đọc;
     sau khi submit ô định nghĩa biến mất, chỉ còn số, tên mức và ⓘ.
     opts: { value, step:'int'|'half', readonly, disabled, compact,
             label, required, hint, onChange }
     - step 'int'  → điểm từng mục tiêu, 1..5
     - step 'half' → điểm toàn diện, 1..5 bước 0.5
     - compact     → chỉ hiện nút số, dùng trong ô bảng                        */
  function rating(el, opts) {
    injectCss();
    opts = opts || {};
    var state = { value: opts.value == null ? null : Number(opts.value) };
    var stepv = opts.step === 'half' ? 0.5 : 1;

    function values() {
      var out = [], v;
      for (v = 1; v <= 5.0001; v += stepv) out.push(Math.round(v * 10) / 10);
      return out;
    }
    function isHalf(v) { return Math.abs(v % 1) > 0; }
    function nameOf(v) {
      return isHalf(v) ? (window.PMSYer ? window.PMSYer.scoreLabel(v, lang()) : '') : levelName(v);
    }
    function fmtNum(v) { return isHalf(v) ? v.toFixed(1) : String(v); }

    function scaleHint() {
      return stepv === 0.5
        ? (lang() === 'en' ? 'Scale 1-5, steps of 0.5' : 'Thang điểm 1-5, bước 0.5')
        : (lang() === 'en' ? 'Scale 1-5, whole numbers' : 'Thang điểm 1-5, số nguyên');
    }

    function tipHtml(v) {
      return '<span class="pms-tip"><span class="rt-i" tabindex="0" role="button" aria-label="' +
        esc(lang() === 'en' ? 'Rating definition' : 'Định nghĩa thang điểm') + '">i</span>' +
        '<span class="pms-tip-body" role="tooltip">' + definitionHtml(v) + '</span></span>';
    }

    function withDef() { return stepv === 0.5; }

    function renderReadonly() {
      if (state.value == null) { el.innerHTML = '<span class="rt-empty">—</span>'; return; }
      // Sau khi gửi: điểm từng mục tiêu chỉ còn số; điểm toàn diện còn số, tên mức và ⓘ
      if (!withDef()) {
        el.innerHTML = '<span class="rt-ro"><span class="rt-ro-score">' + fmtNum(state.value) + '</span></span>';
        return;
      }
      el.innerHTML = '<span class="rt-ro"><span class="rt-ro-score">' + fmtNum(state.value) + '</span>' +
        (opts.compact ? '' : '<span class="rt-ro-name">' + esc(nameOf(state.value)) + '</span>') +
        tipHtml(state.value) + '</span>';
    }

    function renderEditable() {
      var hint = opts.hint || (withDef() ? scaleHint() : '');
      var head = opts.label
        ? '<div class="rt-hd"><span class="rt-lbl">' + esc(opts.label) +
          (opts.required ? '<span class="rt-req">*</span>' : '') + '</span>' +
          (hint ? '<span class="rt-hint">' + esc(hint) + '</span>' : '') + '</div>'
        : '';
      var val = state.value;
      // Ô định nghĩa chỉ xuất hiện với điểm toàn diện và chỉ sau khi đã chọn điểm
      // Ô định nghĩa chỉ chứa nội dung định nghĩa, không lặp lại điểm và tên mức
      var defBox = (withDef() && val != null)
        ? '<div class="rt-def"><div class="rt-def-txt">' + definitionHtml(val) + '</div></div>'
        : '';
      el.innerHTML = head +
        '<div class="rt-pick">' +
          '<button type="button" class="rt-trg' + (val == null ? ' empty' : '') + '"' +
            (opts.disabled ? ' disabled' : '') + ' aria-haspopup="listbox" aria-expanded="false">' +
            '<span class="rt-trg-v">' + (val == null ? '—' : fmtNum(val)) + '</span>' +
            '<i class="bx bx-chevron-down"></i>' +
          '</button>' +
          (opts.compact ? '' :
            '<span class="rt-trg-name">' + (val == null
              ? '<span class="rt-empty">' + esc(lang() === 'en' ? 'No score yet' : 'Chưa chọn điểm') + '</span>'
              : esc(nameOf(val))) + '</span>') +
        '</div>' + defBox;
      var trg = el.querySelector('.rt-trg');
      if (trg && !opts.disabled) trg.addEventListener('click', function () { openPanel(trg); });
    }

    var panel = null, onDocClick = null, onKey = null, onScroll = null;

    function closePanel() {
      if (!panel) return;
      panel.remove(); panel = null;
      document.removeEventListener('mousedown', onDocClick, true);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll, true);
      var trg = el.querySelector('.rt-trg');
      if (trg) { trg.setAttribute('aria-expanded', 'false'); trg.focus(); }
    }

    function place(trg) {
      var r = trg.getBoundingClientRect();
      var h = panel.offsetHeight, w = panel.offsetWidth;
      var below = window.innerHeight - r.bottom;
      var top = below > h + 12 || r.top < h + 12 ? r.bottom + 5 : r.top - h - 5;
      var left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
      panel.style.top = Math.round(top) + 'px';
      panel.style.left = Math.round(left) + 'px';
    }

    function openPanel(trg) {
      if (panel) { closePanel(); return; }
      var vals = values();
      panel = document.createElement('div');
      panel.className = 'rt-panel';
      panel.setAttribute('role', 'listbox');
      panel.innerHTML =
        (withDef() ? '<div class="rt-panel-hd">' + esc(scaleHint()) + '</div>' : '') +
        '<div class="rt-panel-list">' + vals.map(function (v) {
          return '<button type="button" class="rt-row' + (isHalf(v) ? ' half' : '') +
            (state.value === v ? ' on' : '') + '" role="option" aria-selected="' + (state.value === v) +
            '" data-v="' + v + '">' +
            '<span class="rt-row-v">' + fmtNum(v) + '</span>' +
            '<span class="rt-row-n">' + esc(nameOf(v)) + '</span>' +
            '<i class="bx bx-check"></i></button>';
        }).join('') + '</div>' +
        (withDef()
          ? '<div class="rt-panel-def" id="rt-def-live">' +
              (state.value != null ? definitionHtml(state.value)
                : esc(lang() === 'en' ? 'Hover a level to read its definition.' : 'Rê chuột vào một mức để đọc định nghĩa.')) +
            '</div>'
          : '');
      document.body.appendChild(panel);
      place(trg);
      trg.setAttribute('aria-expanded', 'true');

      var live = panel.querySelector('#rt-def-live');
      panel.querySelectorAll('.rt-row').forEach(function (row) {
        row.addEventListener('mouseenter', function () { if (live) live.innerHTML = definitionHtml(Number(row.dataset.v)); });
        row.addEventListener('focus', function () { if (live) live.innerHTML = definitionHtml(Number(row.dataset.v)); });
        row.addEventListener('click', function () {
          state.value = Number(row.dataset.v);
          closePanel();
          renderEditable();
          if (opts.onChange) opts.onChange(state.value);
          if (window.PMSUi && window.PMSUi.dirty) window.PMSUi.dirty.mark();
        });
      });

      onDocClick = function (e) { if (!panel.contains(e.target) && !trg.contains(e.target)) closePanel(); };
      onKey = function (e) {
        if (e.key === 'Escape') { e.preventDefault(); closePanel(); return; }
        var rows = [].slice.call(panel.querySelectorAll('.rt-row'));
        var i = rows.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); (rows[i + 1] || rows[0]).focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); (rows[i - 1] || rows[rows.length - 1]).focus(); }
      };
      onScroll = function () { if (panel) place(trg); };
      document.addEventListener('mousedown', onDocClick, true);
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', onScroll, true);

      var sel = panel.querySelector('.rt-row.on') || panel.querySelector('.rt-row');
      if (sel) sel.focus();
    }

    function draw() { closePanel(); (opts.readonly ? renderReadonly : renderEditable)(); }
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

  /* ═══ 3. Cảnh báo dữ liệu chưa lưu ══════════════════════ */
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

  /* ═══ 4. Dialog + toast ═════════════════════════════════ */
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
          '<div class="pms-dlg-tx">' + esc(opts.text || '') + '</div>' +
        '</div>' +
        '<div class="pms-dlg-ft"></div>' +
      '</div>';
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
    tabs: tabs,
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
