const test = require('node:test');
const assert = require('node:assert');
const OrgChain = require('./org-chain.js');

/* Chuỗi quản lý là nguồn sự thật duy nhất cho câu hỏi "ai quản lý ai". Mọi màn đọc
   nó thay vì tự suy, nên test ở đây chốt cả dữ liệu lẫn cách suy ra vai trò. */

const shape = domain => OrgChain.chainFor(domain).map(entry => [entry.role, entry.domain]);

test('each person declares only a direct manager and the rest is derived', () => {
  assert.deepEqual(shape('tu.nguyen'),
    [['lm', 'thanh.le'], ['upper', 'dung.le'], ['hod', 'huy.tran']]);
  // đúng câu chữ tiếng Việt, dùng chung cho mọi màn
  assert.deepEqual(OrgChain.chainFor('tu.nguyen').map(entry => entry.label),
    ['Quản lý trực tiếp', 'Quản lý cấp 2', 'Trưởng đơn vị']);
});

/* ── Ba hình dạng chuỗi phải có thật trong dữ liệu ───────────────────────────
   HR chọn người nhận kết quả THEO CẤP, nên luôn phải thấy đủ ba lựa chọn. Hai
   lựa chọn cùng trỏ về một người là thông tin thật, không phải lỗi trùng. */

test('A - three different people at the three levels', () => {
  assert.deepEqual(shape('hung.le'),
    [['lm', 'tu.nguyen'], ['upper', 'thanh.le'], ['hod', 'huy.tran']]);
  assert.deepEqual(shape('son.tran'),
    [['lm', 'nga.bui'], ['upper', 'ha.pham'], ['hod', 'binh.ngo']]);
  assert.deepEqual(shape('linh.pham'),
    [['lm', 'tuan.do'], ['upper', 'ngan.pham'], ['hod', 'chau.ly']]);
  OrgChain.chainFor('hung.le').forEach(entry => assert.deepEqual(entry.sharedWith, []));
});

test('B - upper manager and division head are the same person, still three rows', () => {
  assert.deepEqual(shape('anh.bui'),
    [['lm', 'dung.le'], ['upper', 'huy.tran'], ['hod', 'huy.tran']]);
  assert.deepEqual(shape('hung.do'),
    [['lm', 'ha.pham'], ['upper', 'binh.ngo'], ['hod', 'binh.ngo']]);
  // hai dòng cuối trỏ về cùng một người, và mỗi dòng biết điều đó
  const chain = OrgChain.chainFor('anh.bui');
  assert.deepEqual(chain[1].sharedWith, ['hod']);
  assert.deepEqual(chain[2].sharedWith, ['upper']);
  assert.deepEqual(chain[0].sharedWith, []);
});

test('C - one person holds all three levels, still three rows', () => {
  assert.deepEqual(shape('dung.le'),
    [['lm', 'huy.tran'], ['upper', 'huy.tran'], ['hod', 'huy.tran']]);
  assert.deepEqual(shape('lan.hoang'),
    [['lm', 'chau.ly'], ['upper', 'chau.ly'], ['hod', 'chau.ly']]);
  const chain = OrgChain.chainFor('dung.le');
  assert.equal(chain.length, 3, 'vẫn đủ ba lựa chọn cho HR');
  assert.deepEqual(chain[0].sharedWith, ['upper', 'hod']);
});

test('the seed covers all three shapes with more than one example each', () => {
  const buckets = {A: [], B: [], C: []};
  OrgChain.all().forEach(item => {
    const chain = OrgChain.chainFor(item.domain);
    if (chain.length !== 3) return;
    const unique = new Set(chain.map(entry => entry.domain)).size;
    buckets[unique === 3 ? 'A' : unique === 2 ? 'B' : 'C'].push(item.domain);
  });
  Object.entries(buckets).forEach(([name, list]) =>
    assert.ok(list.length >= 2, `hình ${name} chỉ có ${list.length} ví dụ, cần ít nhất 2`));
});

test('the division head never appears in their own chain', () => {
  assert.deepEqual(OrgChain.chainFor('huy.tran'), [], 'trưởng đơn vị không có ai ở trên');
  OrgChain.all().forEach(item =>
    assert.ok(OrgChain.chainFor(item.domain).every(entry => entry.domain !== item.domain),
      `${item.domain} nằm trong chuỗi của chính mình`));
});

test('roles answer who may read a result on the system', () => {
  assert.equal(OrgChain.roleOf('thanh.le', 'tu.nguyen'), 'lm');
  assert.equal(OrgChain.roleOf('dung.le', 'tu.nguyen'), 'upper');
  assert.equal(OrgChain.roleOf('huy.tran', 'tu.nguyen'), 'hod');
  // giữ cả ba vai thì trả về đủ, và vai gần nhất đứng đầu
  assert.deepEqual(OrgChain.rolesOf('huy.tran', 'dung.le'), ['lm', 'upper', 'hod']);
  assert.equal(OrgChain.roleOf('huy.tran', 'dung.le'), 'lm');
  // người khác khối hoặc quản lý của nhân viên khác: ngoài chuỗi
  assert.equal(OrgChain.roleOf('chau.ly', 'tu.nguyen'), null);
  assert.equal(OrgChain.isInChain('ha.pham', 'tu.nguyen'), false);
  assert.equal(OrgChain.isInChain('huy.tran', 'tu.nguyen'), true);
});

test('describe gives the wording used when listing recipients', () => {
  const [lm] = OrgChain.chainFor('tu.nguyen');
  assert.equal(OrgChain.describe(lm), 'Lê Thị Thanh (thanh.le) - Quản lý trực tiếp');
  // DESIGN-SYSTEM 19.0: tách metadata bằng " - ", không dùng middot
  assert.doesNotMatch(OrgChain.describe(lm), /·/);
});

test('unknown domains are answered with an empty chain, not a crash', () => {
  assert.deepEqual(OrgChain.chainFor('khong.co'), []);
  assert.equal(OrgChain.person('khong.co'), null);
  assert.equal(OrgChain.roleOf('khong.co', 'tu.nguyen'), null);
  assert.equal(OrgChain.roleOf('thanh.le', 'khong.co'), null);
});

test('every declared manager exists and every division has a head', () => {
  /* Dữ liệu cũ ở employees-data.js trỏ tới 5 quản lý không có trong danh sách nên
     không dựng nổi chuỗi. Ở đây mọi liên kết phải khép kín. */
  OrgChain.all().forEach(item => {
    const manager = OrgChain.managerOf(item.domain);
    if (manager) assert.ok(OrgChain.person(manager.domain), `thiếu hồ sơ quản lý của ${item.domain}`);
    OrgChain.chainFor(item.domain).forEach(entry =>
      assert.ok(OrgChain.person(entry.domain), `thiếu hồ sơ ${entry.domain}`));
  });
  Object.entries(OrgChain.DIVISION_HEAD).forEach(([division, domain]) => {
    const head = OrgChain.person(domain);
    assert.ok(head, `khối ${division} chưa có trưởng đơn vị`);
    assert.equal(head.division, division, `trưởng đơn vị ${domain} phải thuộc chính khối đó`);
  });
});

test('no chain loops back on itself', () => {
  OrgChain.all().forEach(item => {
    const seen = new Set([item.domain]);
    let current = OrgChain.managerOf(item.domain);
    while (current) {
      assert.ok(!seen.has(current.domain), `chuỗi của ${item.domain} bị lặp ở ${current.domain}`);
      seen.add(current.domain);
      current = OrgChain.managerOf(current.domain);
    }
  });
});
