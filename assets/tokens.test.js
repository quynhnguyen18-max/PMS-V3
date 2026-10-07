/* Chốt giai đoạn 3: mọi màn trong phạm vi DS lấy tokens từ MỘT file assets/tokens.css.
   Test đọc cấu trúc (link, :root, icon, middot), không so từng dòng CSS của màn. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// Trang demo mascot (YER-demo/mascot-tour*.html) nằm ngoài phạm vi DS.
const SCREENS = [
  'E-04/index.html', 'E-05/index.html',
  'H-05/index.html', 'H-05/create-campaign.html', 'H-05/questionnaire-library.html',
  'H-06/index.html', 'H-07/index.html',
  'M-01b/index.html', 'M-04/index.html', 'M-04/feedback-detail.html', 'M-04/request-detail.html',
  'M-05/index.html', 'M-06/index.html',
  'YER-demo/index.html', 'YER-demo/components.html',
  'design-system/index.html',
];
const SHARED_JS = ['H-05/feedback-report-view.js', 'assets/yer-ui.js', 'assets/yer-employee.js', 'assets/yer-manager.js', 'assets/yer-manager-detail.js'];

const tokensCss = read('assets/tokens.css');
const TOKENS = new Set([...tokensCss.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
const stripComments = s => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');

test('tokens.css holds the DS §2 set, including feedback status colors', () => {
  for (const t of ['--z0', '--z950', '--brand', '--brand-h', '--brand-fg', '--brand-muted', '--brand-ring',
    '--ok', '--ok-bg', '--ok-bd', '--warn', '--warn-bg', '--warn-bd', '--err', '--err-bg', '--err-bd',
    '--what', '--dev', '--how', '--info', '--upd', '--sw', '--nh', '--r', '--rsm', '--rxs', '--sh-sm', '--sh', '--sh-md', '--sh-lg', '--t']) {
    assert.ok(TOKENS.has(t), `tokens.css thiếu ${t}`);
  }
  assert.match(tokensCss, /--brand:#A50064;/);
  assert.match(tokensCss, /--warn:#d97706;/);
  assert.match(tokensCss, /--err:#dc2626;/);
});

test('every screen links tokens.css before its own styles and never redeclares a token', () => {
  for (const f of SCREENS) {
    const html = read(f);
    const link = html.indexOf('href="../assets/tokens.css"');
    assert.ok(link > 0, `${f} chưa nạp tokens.css`);
    assert.ok(link < html.indexOf('<style'), `${f} phải nạp tokens.css trước <style>`);
    // :root nằm trong @media (vd M-04 ẩn sidebar bằng --sw:0px) là ghi đè theo bối cảnh, được phép.
    for (const m of html.matchAll(/(@media[^{]*\{\s*)?:root\s*\{([^}]*)\}/g)) {
      if (m[1]) continue;
      for (const d of m[2].matchAll(/(--[\w-]+)\s*:/g)) {
        assert.ok(!TOKENS.has(d[1]), `${f} khai lại token ${d[1]} trong :root`);
      }
    }
  }
});

test('screens use token names, not private aliases of them', () => {
  const aliases = /var\(--(muted|ring|brand-soft|brand-dark|warning|warning-muted|warning-border|error|error-muted|error-border|success|success-muted|success-border|shadow|template|template-muted)\)/;
  for (const f of SCREENS) assert.doesNotMatch(read(f), aliases, `${f} còn dùng tên biến riêng`);
});

test('no icon missing from Boxicons 2.1.4 (DS §19.20)', () => {
  for (const f of [...SCREENS, ...SHARED_JS]) assert.doesNotMatch(read(f), /bx-(sparkles|magic)\b/, `${f} dùng icon không có trong 2.1.4`);
});

test('no middot in UI text (DS §19.0)', () => {
  for (const f of [...SCREENS, ...SHARED_JS]) {
    // bỏ phần showcase trích dẫn ký tự cấm và regex tách ngày giờ còn nhận dữ liệu cũ
    const src = stripComments(read(f)).replace(/<code>·<\/code>/g, '').replace(/\[·[^\]]*\]/g, '');
    assert.doesNotMatch(src, /·/, `${f} còn middot`);
  }
});
