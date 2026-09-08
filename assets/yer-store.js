/* ═══════════════════════════════════════════════════════════
   YER Store — lớp lưu trữ duy nhất của prototype
   Mọi thao tác người dùng (chấm điểm, submit, phản hồi, tải điểm...)
   đi qua file này. Đổi sang backend thật chỉ cần thay phần DRIVER.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var NS = 'pms.yer.v1';

  /* ── DRIVER: điểm duy nhất cần thay khi chuyển sang backend ── */
  var DRIVER = {
    read: function () {
      try { return JSON.parse(window.localStorage.getItem(NS) || 'null'); }
      catch (e) { return null; }
    },
    write: function (doc) {
      try { window.localStorage.setItem(NS, JSON.stringify(doc)); return true; }
      catch (e) { return false; }
    },
    clear: function () {
      try { window.localStorage.removeItem(NS); } catch (e) {}
    }
  };

  function blankDoc() {
    return {
      version: 1,
      session: { role: 'nv', emp: 'e1', date: null, lang: 'vi' },
      acts: {},      // acts[empId] = { self:{...}, lm:{...}, lm2:{...}, response:{...} ... }
      admin: {}      // tải điểm hàng loạt, duyệt hàng loạt, publish...
    };
  }

  var doc = DRIVER.read() || blankDoc();
  if (!doc.session) doc.session = blankDoc().session;
  if (!doc.acts) doc.acts = {};
  if (!doc.admin) doc.admin = {};

  var listeners = [];
  function emit(reason) {
    listeners.forEach(function (fn) { try { fn(reason, doc); } catch (e) {} });
  }
  function persist(reason) {
    DRIVER.write(doc);
    emit(reason || 'change');
  }

  var Store = {
    /* ── Phiên demo ─────────────────────────────────────── */
    session: function () { return doc.session; },
    setSession: function (patch) {
      Object.assign(doc.session, patch || {});
      persist('session');
      return doc.session;
    },

    /* ── Thao tác trên hồ sơ nhân viên ──────────────────── */
    acts: function (empId) {
      if (!empId) return doc.acts;
      return doc.acts[empId] || null;
    },
    setAct: function (empId, step, payload) {
      if (!doc.acts[empId]) doc.acts[empId] = {};
      doc.acts[empId][step] = Object.assign({}, doc.acts[empId][step], payload);
      persist('act');
      return doc.acts[empId][step];
    },
    clearAct: function (empId, step) {
      if (doc.acts[empId]) { delete doc.acts[empId][step]; persist('act'); }
    },

    /* ── Thao tác cấp hệ thống (tải điểm, duyệt, publish) ── */
    admin: function (key) { return key ? doc.admin[key] : doc.admin; },
    setAdmin: function (key, payload) {
      doc.admin[key] = Object.assign({}, doc.admin[key], payload);
      persist('admin');
      return doc.admin[key];
    },

    /* ── Tiện ích ───────────────────────────────────────── */
    reset: function () {
      var lang = doc.session && doc.session.lang;
      DRIVER.clear();
      doc = blankDoc();
      if (lang) doc.session.lang = lang;
      persist('reset');
    },
    snapshot: function () { return JSON.parse(JSON.stringify(doc)); },
    subscribe: function (fn) {
      listeners.push(fn);
      return function () { listeners = listeners.filter(function (f) { return f !== fn; }); };
    }
  };

  // Đồng bộ giữa nhiều tab của cùng trình duyệt
  window.addEventListener('storage', function (e) {
    if (e.key !== NS) return;
    var next = DRIVER.read();
    if (next) { doc = next; emit('external'); }
  });

  window.PMSStore = Store;
})();
