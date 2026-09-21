const test = require('node:test');
const assert = require('node:assert');

/* Model phải biết OrgChain qua biến toàn cục, đúng như trên trình duyệt khi
   org-chain.js được nạp trước feedback-program-model.js. */
const OrgChain = require('../assets/org-chain.js');
globalThis.OrgChain = OrgChain;
const model = require('./feedback-program-model.js');

const campaignWith = sharing => ({
  id: 'p1', goal: 'Khảo sát thử', status: 'collecting',
  createdAt: '01/08/2026', due: '20/08/2026', resultSharing: sharing
});

/* ═══ HR chọn người nhận theo CẤP, không phải theo một khối chung ═══ */

test('targets keep the three manager levels apart and read old data too', () => {
  const picked = model.normalizeShareTargets({
    toRecipient: true, managerLevels: ['lm', 'hod'], extraViewers: [{domain: 'chau.ly', name: 'Lý Minh Châu'}]
  });
  assert.deepEqual(picked.managerLevels, ['lm', 'hod'], 'giữ đúng cấp HR chọn, không gộp thành một khối');
  assert.equal(picked.toRecipient, true);
  assert.deepEqual(picked.extraViewers, [{domain: 'chau.ly', name: 'Lý Minh Châu'}]);

  // dữ liệu cũ chỉ có khối "các cấp quản lý" nên quy đổi thành đủ ba cấp
  const legacy = model.normalizeShareTargets({audience: 'recipient_and_managers'});
  assert.equal(legacy.toRecipient, true);
  assert.deepEqual(legacy.managerLevels, ['lm', 'upper', 'hod']);

  const legacyNames = model.normalizeShareTargets({audiences: ['others'], additionalViewerNames: ['Nguyễn Thị Hoa']});
  assert.deepEqual(legacyNames.extraViewers, [{domain: '', name: 'Nguyễn Thị Hoa'}]);
});

/* ═══ Kênh nhận suy ra từ chuỗi quản lý, HR không chọn ═══ */

test('only people outside the chain are cut off from the system view', () => {
  assert.equal(model.shareChannelFor('thanh.le', 'tu.nguyen'), 'system');
  assert.equal(model.shareChannelFor('huy.tran', 'tu.nguyen'), 'system');
  assert.equal(model.shareChannelFor('chau.ly', 'tu.nguyen'), 'emailOnly');
  // chính nhân viên luôn xem được kết quả của mình
  assert.equal(model.shareChannelFor('tu.nguyen', 'tu.nguyen'), 'system');
});

/* ═══ Danh sách người nhận thật sự của một lượt chia sẻ ═══ */

test('three distinct managers produce three recipients', () => {
  const list = model.resolveShareRecipients(['tu.nguyen'], {managerLevels: ['lm', 'upper', 'hod']});
  assert.deepEqual(list.map(item => [item.domain, item.roles.join('+')]),
    [['thanh.le', 'lm'], ['dung.le', 'upper'], ['huy.tran', 'hod']]);
  assert.ok(list.every(item => item.channel === 'system'));
});

test('one person holding several levels appears once carrying every role', () => {
  // Bùi Quốc Anh: cấp 2 và trưởng đơn vị là cùng một người
  const two = model.resolveShareRecipients(['anh.bui'], {managerLevels: ['lm', 'upper', 'hod']});
  assert.deepEqual(two.map(item => [item.domain, item.roles.join('+')]),
    [['dung.le', 'lm'], ['huy.tran', 'upper+hod']]);
  // Lê Văn Dũng: cả ba cấp là một người
  const one = model.resolveShareRecipients(['dung.le'], {managerLevels: ['lm', 'upper', 'hod']});
  assert.deepEqual(one.map(item => [item.domain, item.roles.join('+')]), [['huy.tran', 'lm+upper+hod']]);
});

test('sharing several employees at once splits each recipient by channel', () => {
  /* Một lượt chia sẻ kết quả của Tú (ITC) và Lan (MKT) cho quản lý hai bên:
     mỗi quản lý xem được người mình quản lý, và chỉ nhận email người kia. */
  const list = model.resolveShareRecipients(['tu.nguyen', 'lan.hoang'], {
    toRecipient: true,
    managerLevels: ['lm'],
    extraViewers: [{domain: 'chau.ly'}, {domain: 'dung.le'}]
  });
  const chau = list.find(item => item.domain === 'chau.ly');
  assert.deepEqual(chau.system, ['lan.hoang']);
  assert.deepEqual(chau.emailOnly, ['tu.nguyen']);
  assert.equal(chau.channel, 'mixed');
  // ghi chú bám theo từng nhân viên, không dán cho cả con người
  assert.equal(model.isEmailOnly(chau), true);

  const dung = list.find(item => item.domain === 'dung.le');
  assert.deepEqual(dung.system, ['tu.nguyen'], 'quản lý cấp 2 của Tú vẫn xem được kết quả của Tú');
  assert.deepEqual(dung.emailOnly, ['lan.hoang']);

  // chính hai nhân viên cũng có tên trong danh sách, và luôn ở kênh hệ thống
  const tu = list.find(item => item.domain === 'tu.nguyen');
  assert.deepEqual(tu.roles, ['recipient']);
  assert.equal(tu.channel, 'system');
  assert.equal(model.isEmailOnly(tu), false, 'trong phạm vi quản lý thì không ghi chú gì');
});

test('an outside viewer without a domain can only read the emailed file', () => {
  const list = model.resolveShareRecipients(['tu.nguyen'], {extraViewers: [{name: 'Nguyễn Thị Hoa'}]});
  assert.equal(list.length, 1);
  assert.equal(list[0].channel, 'emailOnly');
  assert.deepEqual(list[0].emailOnly, ['tu.nguyen']);
});

/* ═══ Quyền xem trên hệ thống ═══ */

test('being on the share list is not enough - the chain decides system access', () => {
  const campaign = campaignWith({
    mode: 'shared_selected', participantIds: ['tu.nguyen'],
    targets: {toRecipient: true, managerLevels: ['lm'], extraViewers: [{domain: 'chau.ly'}]},
    contentLevel: 'summary_detail', sharedAt: '10/08/2026'
  });
  assert.equal(model.canViewProgramResult(campaign, 'tu.nguyen', 'thanh.le'), true);
  assert.equal(model.canViewProgramResult(campaign, 'tu.nguyen', 'tu.nguyen'), true);
  // Lý Minh Châu có trong danh sách chia sẻ nhưng ngoài chuỗi quản lý của Tú
  assert.equal(model.canViewProgramResult(campaign, 'tu.nguyen', 'chau.ly'), false);
  // cấp 2 không được HR chọn thì cũng không mở màn
  assert.equal(model.canViewProgramResult(campaign, 'tu.nguyen', 'dung.le'), false);
  assert.equal(model.canViewProgramResult(campaign, 'tu.nguyen', 'hr'), true);
  // nhóm cũ vẫn chạy để các màn chưa chuyển sang domain không gãy
  assert.equal(model.canViewProgramResult(campaign, 'tu.nguyen', 'recipients'), true);
});

/* ═══ Lịch sử chia sẻ ═══ */

test('each share writes who shared, for whom, to whom and through which channel', () => {
  const campaign = campaignWith({mode: 'not_shared'});
  const shared = model.shareResults(campaign, ['tu.nguyen', 'lan.hoang'], '11/08/2026', {
    by: {domain: 'minhthu.le', name: 'Lê Minh Thu'},
    targets: {toRecipient: true, managerLevels: ['lm'], extraViewers: [{domain: 'chau.ly'}]},
    contentLevel: 'summary_detail',
    note: 'Kết quả giữa kỳ'
  });
  const [entry] = shared.resultSharing.log;
  assert.equal(entry.at, '11/08/2026');
  assert.deepEqual(entry.by, {domain: 'minhthu.le', name: 'Lê Minh Thu'});
  assert.deepEqual(entry.participantIds, ['tu.nguyen', 'lan.hoang']);
  const chau = entry.recipients.find(item => item.domain === 'chau.ly');
  assert.equal(chau.channel, 'mixed', 'lịch sử phải giữ được ai xem hệ thống, ai chỉ đọc file email');
  assert.deepEqual(chau.emailOnly, ['tu.nguyen']);
  assert.ok(entry.recipients.some(item => item.domain === 'thanh.le' && item.channel === 'system'));
});

test('sharing again adds viewers instead of replacing the previous round', () => {
  const first = model.shareResults(campaignWith({mode: 'not_shared'}), ['tu.nguyen'], '11/08/2026',
    {targets: {managerLevels: ['lm']}, by: {domain: 'minhthu.le', name: 'Lê Minh Thu'}});
  const second = model.shareResults(first, ['tu.nguyen'], '18/08/2026',
    {targets: {managerLevels: ['hod'], extraViewers: [{domain: 'chau.ly'}]}, by: {domain: 'minhthu.le', name: 'Lê Minh Thu'}});
  assert.deepEqual(second.resultSharing.targets.managerLevels, ['lm', 'hod']);
  assert.deepEqual(second.resultSharing.targets.extraViewers, [{domain: 'chau.ly', name: ''}]);
  assert.equal(second.resultSharing.log.length, 2);
  // lần chia sẻ trước vẫn giữ nguyên ảnh chụp của chính nó
  assert.deepEqual(second.resultSharing.log[0].recipients.map(item => item.domain), ['thanh.le']);
});

/* Ghi xong rồi đọc lại mới là chuyện thật: chương trình được lưu vào localStorage
   và nạp lại qua normalizeCampaign. Nếu bước chuẩn hóa dòng log đọc thiếu
   `targets` thì lịch sử vẫn có ngày tháng nhưng mất sạch người được chia sẻ. */
test('a saved share still knows its audience after the program is loaded again', () => {
  const shared = model.shareResults(campaignWith({mode: 'not_shared'}), [], '11/08/2026', {
    by: {domain: 'anh.le', name: 'Lê Thuỳ Anh'},
    targets: {toRecipient: true, managerLevels: ['lm', 'upper'], extraViewers: [{domain: 'chau.ly'}]},
    contentLevel: 'summary_detail'
  });
  // đi qua đúng đường mà màn hình đi: lưu thành chuỗi rồi nạp lại
  const reloaded = model.normalizeCampaign(JSON.parse(JSON.stringify(shared)));
  const [entry] = reloaded.resultSharing.log;
  assert.equal(entry.targets.toRecipient, true, 'chia sẻ cho chính người nhận không được rơi mất');
  assert.deepEqual(entry.targets.managerLevels, ['lm', 'upper']);
  assert.deepEqual(entry.targets.extraViewers, [{domain: 'chau.ly', name: ''}]);
  // màn nào còn đọc theo nhóm kiểu cũ cũng phải thấy đúng
  assert.deepEqual(entry.audiences, ['recipients', 'managers', 'others']);
});

/* ═══ Đóng, mở lại và mốc tự đóng 90 ngày ═══ */

test('a request that collected every answer counts as closed', () => {
  const full = {id:'p4', goal:'Khảo sát', status:'collecting', createdAt:'01/08/2026', due:'20/08/2026', total:4, done:4};
  assert.equal(model.campaignCloseReason(full, '11/08/2026'), 'no-active-ticket');
  assert.equal(model.isCampaignClosed(full, '11/08/2026'), true, 'đủ phản hồi là tự đóng, không còn gì để thu');
  // nhãn vẫn là Hoàn thành vì nói được nhiều hơn "Đã đóng": đóng vì thu đủ
  assert.equal(model.campaignStatus(full, '11/08/2026').label, 'Hoàn thành');
  assert.equal(model.canReopenCampaign(full, '11/08/2026'), false, 'tự đóng thì không mở lại');
  // cùng bộ mã lý do với yêu cầu của quản lý
  const manager = require('../M-04/manager-request-model.js');
  assert.deepEqual(Object.keys(model.CAMPAIGN_CLOSE_REASON_TEXT || {}).sort(),
    ['expired', 'manual', 'no-active-ticket']);
  assert.equal(typeof manager.canReopenRequest, 'function');
});

test('a request closes itself 90 days after it was created', () => {
  const fresh = {id:'p2', goal:'Khảo sát', status:'collecting', createdAt:'01/08/2026', due:'20/08/2026'};
  assert.equal(model.isCampaignClosed(fresh, '11/08/2026'), false);
  // đúng 90 ngày vẫn còn mở, qua 90 ngày mới tự đóng
  assert.equal(model.isCampaignClosed(fresh, '30/10/2026'), false);
  assert.equal(model.isCampaignClosed(fresh, '31/10/2026'), true);
  assert.equal(model.campaignStatus(fresh, '31/10/2026').label, 'Đã đóng');
  // nháp thì không bị mốc này chạm tới
  assert.equal(model.isCampaignClosed({...fresh, status:'draft'}, '31/10/2026'), false);
  assert.equal(model.isCampaignClosed({...fresh, status:'closed'}, '11/08/2026'), true);
});

test('reopening stops at a shared result and at the auto-close date', () => {
  const closed = {id:'p3', goal:'Khảo sát', status:'closed', createdAt:'01/08/2026', due:'20/08/2026',
    resultSharing:{mode:'not_shared'}};
  assert.equal(model.canReopenCampaign(closed, '11/08/2026'), true);
  // quá hạn tự đóng thì nút mở lại chỉ hứa suông, nên không cho
  assert.equal(model.canReopenCampaign(closed, '31/10/2026'), false);
  // chia sẻ kết quả là chốt vĩnh viễn
  const shared = model.shareResults(closed, ['tu.nguyen'], '11/08/2026', {targets:{toRecipient:true}});
  assert.equal(model.canReopenCampaign(shared, '11/08/2026'), false);
  assert.deepEqual(model.reopenCampaign(shared).status, 'closed');
});

/* ═══ Câu chữ ═══ */

test('the wording for roles and channels lives in one place', () => {
  assert.equal(model.recipientRoleLabel('lm'), 'Quản lý trực tiếp');
  assert.equal(model.recipientRoleLabel('upper'), 'Quản lý cấp 2');
  assert.equal(model.recipientRoleLabel('hod'), 'Trưởng đơn vị');
  assert.equal(model.recipientRoleLabel('recipient'), 'Người nhận phản hồi');
  /* Ai cũng nhận email thông báo nên "xem trên hệ thống" là mặc định, không ghi chú.
     Chỉ ca ngoài phạm vi quản lý mới có một câu nói rõ họ đọc kết quả ở đâu. */
  assert.equal(model.channelNote('system'), '');
  assert.equal(model.channelNote('emailOnly'),
    'Ngoài phạm vi quản lý - nhận file kết quả qua email, không xem trên hệ thống');
  // cùng bộ chữ với chuỗi quản lý, không để hai nơi đặt hai tên
  model.MANAGER_LEVELS.forEach(level =>
    assert.equal(model.recipientRoleLabel(level), OrgChain.roleLabel(level)));
  // DESIGN-SYSTEM 19.0: không dùng middot trong text UI
  Object.values(model.RECIPIENT_ROLE_LABEL).concat(Object.values(model.CHANNEL_NOTE))
    .forEach(label => assert.doesNotMatch(label, /·/));
});
