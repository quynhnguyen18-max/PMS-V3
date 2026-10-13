(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.PMSHodUpload = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var RECORDS = [
    { id:'yer26-e8', employeeId:'NV001284', name:'Nguyễn Thị Hoa', domain:'hoa.nguyen', division:'Product & Growth', department:'Product', team:'Growth Platform', manager:'Trần Quang Huy', managerDomain:'huy.tran', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'year_end', eligible:true, lateRound:3, lateDays:8, hrbpUploadScore:null, hodScore:null, uploadStatus:'not_uploaded', previewScore:3.5 },
    { id:'yer26-e9', employeeId:'NV001447', name:'Bùi Quốc Anh', domain:'anh.bui', division:'Technology Center', department:'Security', team:'Application Security', manager:'Lê Văn Dũng', managerDomain:'dung.le', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'year_end', eligible:true, lateRound:1, lateDays:3, hrbpUploadScore:null, hodScore:null, uploadStatus:'not_uploaded', previewScore:4 },
    { id:'yer26-e10', employeeId:'NV001632', name:'Đinh Thị Linh', domain:'linh.dinh', division:'Technology Center', department:'AI & Big Data', team:'Data Platform', manager:'Vũ Hoàng Nam', managerDomain:'nam.vu', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'year_end', eligible:true, lateRound:2, lateDays:6, hrbpUploadScore:null, hodScore:null, uploadStatus:'not_uploaded', previewScore:3.5 },
    { id:'yer26-e11', employeeId:'NV001715', name:'Cao Văn Minh', domain:'minh.cao', division:'Technology Center', department:'Infrastructure', team:'Cloud Platform', manager:'Hoàng Văn Đức', managerDomain:'duc.hoang', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'year_end', eligible:true, lateRound:4, lateDays:11, hrbpUploadScore:null, hodScore:null, uploadStatus:'not_uploaded', previewScore:4.5 },
    { id:'yer26-e12', employeeId:'NV001826', name:'Phan Thị Bích', domain:'bich.phan', division:'Technology Center', department:'Mobile', team:'Mobile Platform', manager:'Đinh Văn Tùng', managerDomain:'tung.dinh', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'year_end', eligible:true, lateRound:null, lateDays:0, hrbpUploadScore:4.5, hodScore:null, uploadedBy:'chau.ly', uploadedAt:'06/03/2027 09:18', uploadStatus:'pending_approval', previewScore:4.5 },
    { id:'yer26-e13', employeeId:'NV001904', name:'Lê Hoài Nam', domain:'nam.le', division:'Technology Center', department:'Backend', team:'Core Services', manager:'Lê Thị Thanh', managerDomain:'thanh.le', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'year_end', eligible:true, lateRound:null, lateDays:0, hrbpUploadScore:3, hodScore:null, uploadedBy:'chau.ly', uploadedAt:'06/03/2027 08:52', uploadStatus:'pending_approval', previewScore:3.5 },
    { id:'myr26-e1', employeeId:'NV000821', name:'Nguyễn Văn Tú', domain:'tu.nguyen', division:'Technology Center', department:'Backend', team:'Core Services', manager:'Lê Thị Thanh', managerDomain:'thanh.le', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'mid_year', eligible:true, lateRound:null, lateDays:0, hrbpUploadScore:4, hodScore:4, uploadedBy:'chau.ly', uploadedAt:'12/07/2026 10:42', uploadStatus:'approved', previewScore:4 },
    { id:'myr26-e5', employeeId:'NV001053', name:'Lê Văn Hùng', domain:'hung.le', division:'Technology Center', department:'Backend', team:'Core Services', manager:'Nguyễn Văn Tú', managerDomain:'tu.nguyen', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'mid_year', eligible:true, lateRound:null, lateDays:0, hrbpUploadScore:4.5, hodScore:null, uploadedBy:'chau.ly', uploadedAt:'12/07/2026 10:42', uploadStatus:'pending_approval', previewScore:4.5 },
    { id:'myr26-e8', employeeId:'NV001284', name:'Nguyễn Thị Hoa', domain:'hoa.nguyen', division:'Product & Growth', department:'Product', team:'Growth Platform', manager:'Trần Quang Huy', managerDomain:'huy.tran', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'mid_year', eligible:true, lateRound:null, lateDays:0, hrbpUploadScore:3.5, hodScore:3.5, uploadedBy:'chau.ly', uploadedAt:'12/07/2026 10:42', uploadStatus:'approved', previewScore:3.5 },
    { id:'yer25-e2', employeeId:'NV000947', name:'Trần Thị Mai', domain:'mai.tran', division:'Technology Center', department:'Frontend', team:'Web Platform', manager:'Lê Thị Thanh', managerDomain:'thanh.le', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2025, period:'year_end', eligible:true, lateRound:null, lateDays:0, hrbpUploadScore:4, hodScore:4, uploadedBy:'chau.ly', uploadedAt:'08/03/2026 14:05', uploadStatus:'approved', previewScore:4 },
    { id:'excluded-demo', employeeId:'NV009999', name:'Nhân sự ngoài kỳ', domain:'outside.user', division:'Technology Center', department:'QA', team:'Quality Engineering', manager:'Lê Thị Thanh', managerDomain:'thanh.le', hod:'Phạm Quốc Anh', hodDomain:'anh.pham', cycle:2026, period:'year_end', eligible:false, lateRound:null, lateDays:0, hrbpUploadScore:null, hodScore:null, uploadStatus:'not_uploaded', previewScore:3 }
  ];

  var PERIOD_LABELS = { mid_year:'Đánh giá giữa năm', year_end:'Đánh giá cuối năm' };
  var STATUS = {
    not_uploaded: { label:'Chờ HOD đánh giá', tone:'action' },
    pending_approval: { label:'Chờ HOD duyệt', tone:'action' },
    approved: { label:'HOD đã duyệt', tone:'done' }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function records() {
    return clone(RECORDS.filter(function (item) { return item.eligible; }));
  }

  function periodLabel(period) {
    return PERIOD_LABELS[period] || period || '';
  }

  function periodShortLabel(cycle, period) {
    if (period === 'mid_year') return 'Giữa năm ' + cycle;
    if (period === 'year_end') return 'Cuối năm ' + cycle;
    return periodLabel(period) + (cycle ? ' ' + cycle : '');
  }

  function statusMeta(code) {
    return clone(STATUS[code] || STATUS.not_uploaded);
  }

  function lateMeta(item, score) {
    var round = Number(item && item.lateRound) || 0;
    if (!round) return { late:false, round:null, label:'Đúng hạn', measure:'Không áp dụng', warning:false, cap:null };
    var base = { late:true, round:round, label:'Nộp trễ - Lần nhắc thứ ' + round, warning:false, cap:null };
    if (round === 3) {
      base.measure = 'Điểm đánh giá toàn diện tối đa là 3';
      base.cap = 3;
      base.warning = score != null && score !== '' && Number(score) > 3;
      return base;
    }
    if (round === 4) {
      base.measure = 'Cắt giảm một phần tiền thưởng và tạm hoãn thăng chức, tăng lương trong 6 tháng';
      return base;
    }
    base.measure = 'Chưa áp dụng hình thức xử lý';
    return base;
  }

  function filter(list, criteria) {
    criteria = criteria || {};
    var query = String(criteria.query || '').trim().toLocaleLowerCase('vi');
    return (list || []).filter(function (item) {
      if (criteria.cycle && String(item.cycle) !== String(criteria.cycle)) return false;
      if (criteria.period && item.period !== criteria.period) return false;
      if (criteria.status && item.uploadStatus !== criteria.status) return false;
      if (criteria.division && item.division !== criteria.division) return false;
      if (criteria.department && item.department !== criteria.department) return false;
      if (criteria.team && item.team !== criteria.team) return false;
      if (criteria.approver && item.hodDomain.toLocaleLowerCase('vi').indexOf(String(criteria.approver).trim().toLocaleLowerCase('vi')) < 0) return false;
      if (criteria.employee && item.domain.toLocaleLowerCase('vi').indexOf(String(criteria.employee).trim().toLocaleLowerCase('vi')) < 0) return false;
      if (!query) return true;
      return [item.employeeId, item.name, item.domain, item.division, item.department, item.team, item.manager, item.managerDomain, item.hod, item.hodDomain]
        .join(' ').toLocaleLowerCase('vi').indexOf(query) >= 0;
    });
  }

  function buildPreview(list, cycle, period) {
    return (list || []).filter(function (item) {
      return String(item.cycle) === String(cycle) && item.period === period;
    }).map(function (item) {
      var score = item.previewScore;
      var unchanged = item.hrbpUploadScore != null && Number(item.hrbpUploadScore) === Number(score);
      return {
        id:item.id,
        employeeId:item.employeeId,
        name:item.name,
        domain:item.domain,
        cycle:item.cycle,
        period:item.period,
        score:score,
        oldScore:item.hrbpUploadScore,
        result:unchanged ? 'unchanged' : 'valid',
        replaced:!unchanged && item.hrbpUploadScore != null,
        late:lateMeta(item, score)
      };
    });
  }

  function warningRows(preview) {
    return (preview || []).filter(function (row) { return row.late && row.late.warning; });
  }

  function applyPreview(list, preview, meta) {
    var byId = {};
    (preview || []).forEach(function (row) { if (row.result === 'valid') byId[row.id] = row; });
    meta = meta || {};
    return (list || []).map(function (item) {
      var row = byId[item.id];
      if (!row) return clone(item);
      var updated = clone(item);
      updated.hrbpUploadScore = Number(row.score);
      updated.uploadStatus = 'pending_approval';
      updated.uploadedBy = meta.by || 'chau.ly';
      updated.uploadedAt = meta.at || '06/03/2027 10:30';
      if (row.late && row.late.warning) {
        updated.capConfirmed = { max:3, score:Number(row.score), at:updated.uploadedAt };
      }
      return updated;
    });
  }

  function demoScore(item) {
    var score = Number(item.previewScore);
    var late = lateMeta(item, score);
    return late.cap != null ? Math.min(score, late.cap) : score;
  }

  function demoRecords(scenario) {
    return records().map(function (item) {
      if (String(item.cycle) !== '2026' || item.period !== 'year_end') return item;
      var score = demoScore(item);
      if (scenario === 'year_end_not_uploaded') {
        item.hrbpUploadScore = null;
        item.hodScore = null;
        item.uploadStatus = 'not_uploaded';
        delete item.uploadedBy;
        delete item.uploadedAt;
        delete item.capConfirmed;
      } else if (scenario === 'year_end_uploaded') {
        item.hrbpUploadScore = score;
        item.hodScore = null;
        item.uploadStatus = 'pending_approval';
        item.uploadedBy = 'chau.ly';
        item.uploadedAt = '06/03/2027 10:30';
      } else if (scenario === 'year_end_approved') {
        item.hrbpUploadScore = score;
        item.hodScore = score;
        item.uploadStatus = 'approved';
        item.uploadedBy = 'chau.ly';
        item.uploadedAt = '06/03/2027 10:30';
      }
      return item;
    });
  }

  function summary(list) {
    return (list || []).reduce(function (acc, item) {
      acc.total += 1;
      if (item.uploadStatus === 'not_uploaded') acc.notUploaded += 1;
      if (item.uploadStatus === 'pending_approval') acc.pending += 1;
      if (item.uploadStatus === 'approved') acc.approved += 1;
      return acc;
    }, { total:0, notUploaded:0, pending:0, approved:0 });
  }

  return {
    records:records,
    filter:filter,
    summary:summary,
    periodLabel:periodLabel,
    periodShortLabel:periodShortLabel,
    statusMeta:statusMeta,
    lateMeta:lateMeta,
    buildPreview:buildPreview,
    warningRows:warningRows,
    applyPreview:applyPreview,
    demoRecords:demoRecords
  };
});
