const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('employee feedback screen is named Phản hồi cá nhân', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /<title>E-04 – Phản hồi cá nhân \| MoMo HRM<\/title>/);
  assert.match(html, /<span class="topbar-title">Phản hồi cá nhân<\/span>/);
  assert.match(html, /<h1 class="page-title">Phản hồi cá nhân<\/h1>/);
});

test('employee feedback cycle selector follows the manager header pattern', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /<div class="cycle-action-row">[\s\S]*?<div class="cycle-row">[\s\S]*?<select class="cycle-sel" id="cycleSel"/);
  assert.doesNotMatch(html, /class="page-hd-tools"/);
  assert.match(html, /<option value="2026">2026<\/option>/);
  assert.doesNotMatch(html, /<option value="2026">Năm 2026<\/option>/);
  assert.match(html, /\.cycle-row\{display:flex;align-items:center;gap:8px;margin-bottom:0;white-space:nowrap\}/);
  assert.doesNotMatch(html, /\.cycle-row\{[^}]*border:/);
  assert.doesNotMatch(html, /id="cycleOpen"/);
  assert.doesNotMatch(html, /getElementById\('cycleOpen'\)/);
});
const FeedbackModel = require('./feedback-model.js');

const feed = [
  { id:'direct-1', kind:'received', cycle:'2026', date:'01/01/2026', ts:20260101,
    who:{name:'Người gửi trực tiếp', dom:'direct.user'}, body:'Phản hồi trực tiếp', cv:['A'] },
  { id:'req-1', kind:'request', cycle:'2026', date:'02/01/2026', ts:20260102,
    question:'Câu hỏi chung', reviewers:[
      { id:'reviewer-1', name:'Người hoàn tất', dom:'done.user', st:'done', repliedAt:'03/01/2026 · 10:30', fb:'Đã trả lời', cv:['B'], vis:'receiver' },
      { id:'reviewer-2', name:'Người đang chờ', dom:'pending.user', st:'pending' }
    ] }
];

test('projects completed request reviewers into received responses and excludes pending reviewers', () => {
  const normalized = FeedbackModel.normalizeFeed(feed);
  const projected = normalized.filter(item => item.requestId === 'req-1');

  assert.equal(projected.length, 1);
  assert.equal(projected[0].kind, 'received');
  assert.equal(projected[0].who.dom, 'done.user');
  assert.equal(projected[0].q, 'Câu hỏi chung');
  assert.equal(projected[0].body, 'Đã trả lời');
});

test('received filter returns direct and request responses exactly once', () => {
  const received = FeedbackModel.itemsForFilter(feed, 'received', '2026');

  assert.deepEqual(received.map(item => item.id).sort(), ['direct-1', 'resp-req-1-done.user']);
});

test('creates canonical given response records for authored feedback', () => {
  const response = FeedbackModel.createGivenResponse({
    id:'given-1', cycle:'2026', date:'03/08/2026', recipient:{name:'Mai', dom:'mai.tran', ini:'MT', org:'ITC'},
    body:'Cảm ơn bạn', vis:'receiver', cv:['A'], requestId:'queue-1'
  });

  assert.deepEqual(response, {
    id:'given-1', kind:'given', cycle:'2026', date:'03/08/2026', ts:20260803,
    who:{name:'Mai', dom:'mai.tran', ini:'MT', org:'ITC'}, body:'Cảm ơn bạn', vis:'receiver', cv:['A'], requestId:'queue-1', status:'submitted'
  });
});

test('prototype 2026 data exposes all eight request responses in Received', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');
  const match = html.match(/const FEED = (\[[\s\S]*?\n\]);/);
  assert.ok(match, 'FEED fixture must be extractable from the prototype');
  const prototypeFeed = vm.runInNewContext(`(${match[1]})`);
  const received = FeedbackModel.itemsForFilter(prototypeFeed, 'received', '2026');
  const fromRequests = received.filter(item => item.requestId);

  assert.equal(fromRequests.length, 8);
  assert.equal(received.length, 11);
  assert.equal(new Set(received.map(item => item.id)).size, received.length);
});

test('reply popup reuses the concise visibility labels and omits the one-time-send footer note', () => {
  const html = fs.readFileSync(require.resolve('./index.html'), 'utf8');

  assert.match(html, /id="rvisR"[\s\S]*?Chỉ người nhận/);
  assert.match(html, /id="rvisM"[\s\S]*?Người nhận \+ Quản lý của họ/);
  assert.doesNotMatch(html, /Gửi một lần — sau khi gửi không thể chỉnh sửa/);
});
