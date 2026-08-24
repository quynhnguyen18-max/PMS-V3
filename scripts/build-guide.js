/**
 * PMS Prototype User Guide — pptxgenjs build script
 * Output: PMS_HuongDanSuDung.pptx
 */
const PptxGenJS = require('pptxgenjs');
const path = require('path');

const SHOTS = path.join(__dirname, '..', 'screenshots');
const OUT   = path.join(__dirname, '..', 'PMS_HuongDanSuDung.pptx');

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  brand:      'A50064',   // MoMo magenta
  brandDark:  '730045',   // darker magenta
  bgDark:     '1C0A14',   // slide dark bg
  white:      'FFFFFF',
  offWhite:   'F7F0F4',   // tinted slide bg
  gray100:    'F3F4F6',
  gray300:    'D1D5DB',
  gray500:    '6B7280',
  gray700:    '374151',
  gray900:    '111827',
  stepCircle: 'F3E8F0',   // light pink for step number bg
};

const FONT_TITLE = 'Calibri';
const FONT_BODY  = 'Calibri';

const prs = new PptxGenJS();
prs.layout = 'LAYOUT_WIDE';  // 13.33" x 7.5"
prs.title  = 'Hướng dẫn sử dụng PMS Prototype — MoMo HRM';
prs.author = 'MoMo HR';

const W = 13.33;
const H = 7.5;

// ─── Helper: dark section header slide ────────────────────────────────────────
function sectionSlide(label, icon, num, subtitle) {
  const sl = prs.addSlide();
  // bg
  sl.addShape(prs.ShapeType.RECT, { x: 0, y: 0, w: W, h: H, fill: { color: C.bgDark } });
  // big number
  sl.addText(num, {
    x: 0.7, y: 1.5, w: 2, h: 2,
    fontSize: 96, bold: true, color: C.brand,
    fontFace: FONT_TITLE, align: 'left', valign: 'top',
  });
  // section label chip
  sl.addShape(prs.ShapeType.RECT, {
    x: 0.7, y: 1.2, w: 2.5, h: 0.32,
    fill: { color: C.brand }, line: { type: 'none' },
    rounding: true,
  });
  sl.addText(label, {
    x: 0.7, y: 1.2, w: 2.5, h: 0.32,
    fontSize: 10, bold: true, color: C.white,
    fontFace: FONT_BODY, align: 'center', valign: 'middle',
  });
  // title
  sl.addText(icon, {
    x: 0.7, y: 3.7, w: 1.2, h: 1,
    fontSize: 52, color: C.brand,
    fontFace: FONT_TITLE, align: 'left',
  });
  sl.addText(subtitle, {
    x: 2.0, y: 3.75, w: 9, h: 1.5,
    fontSize: 36, bold: true, color: C.white,
    fontFace: FONT_TITLE, align: 'left', valign: 'middle',
  });
  // decorative bar
  sl.addShape(prs.ShapeType.RECT, {
    x: 0.7, y: 5.6, w: 3, h: 0.05,
    fill: { color: C.brand }, line: { type: 'none' },
  });
  return sl;
}

// ─── Helper: step slide (screenshot right, text left) ─────────────────────────
function stepSlide({ stepNum, stepTotal, title, bullets, imgFile, notes }) {
  const sl = prs.addSlide();

  // White bg
  sl.addShape(prs.ShapeType.RECT, { x: 0, y: 0, w: W, h: H, fill: { color: C.white } });

  // Left panel bg tint
  sl.addShape(prs.ShapeType.RECT, { x: 0, y: 0, w: 4.4, h: H, fill: { color: C.offWhite }, line: { type: 'none' } });

  // Step badge
  sl.addShape(prs.ShapeType.ELLIPSE, {
    x: 0.45, y: 0.38, w: 0.72, h: 0.72,
    fill: { color: C.brand }, line: { type: 'none' },
  });
  sl.addText(`${stepNum}`, {
    x: 0.45, y: 0.38, w: 0.72, h: 0.72,
    fontSize: 20, bold: true, color: C.white,
    fontFace: FONT_TITLE, align: 'center', valign: 'middle',
  });

  // Step counter
  sl.addText(`Bước ${stepNum}/${stepTotal}`, {
    x: 1.3, y: 0.5, w: 1.5, h: 0.35,
    fontSize: 10, color: C.gray500,
    fontFace: FONT_BODY, align: 'left',
  });

  // Title
  sl.addText(title, {
    x: 0.35, y: 1.2, w: 3.7, h: 1.0,
    fontSize: 18, bold: true, color: C.gray900,
    fontFace: FONT_TITLE, align: 'left', valign: 'top',
    wrap: true,
  });

  // Divider
  sl.addShape(prs.ShapeType.RECT, {
    x: 0.35, y: 2.35, w: 3.4, h: 0.03,
    fill: { color: C.gray300 }, line: { type: 'none' },
  });

  // Bullets
  if (bullets && bullets.length) {
    const bulletItems = bullets.map(b => ({
      text: b,
      options: { bullet: { code: '25CF', indent: 12 }, color: C.gray700, fontSize: 12.5, fontFace: FONT_BODY, breakLine: true },
    }));
    sl.addText(bulletItems, {
      x: 0.35, y: 2.5, w: 3.85, h: 4.5,
      valign: 'top', wrap: true,
      paraSpaceAfter: 6,
    });
  }

  // Screenshot image (right 8.6" panel)
  const imgX = 4.55;
  const imgW = 8.45;
  const imgH = 6.7;
  const imgY = 0.4;

  // Image shadow / border rect
  sl.addShape(prs.ShapeType.RECT, {
    x: imgX + 0.06, y: imgY + 0.06, w: imgW, h: imgH,
    fill: { color: C.gray300 }, line: { type: 'none' },
  });
  sl.addImage({
    path: path.join(SHOTS, imgFile),
    x: imgX, y: imgY, w: imgW, h: imgH,
    sizing: { type: 'contain', w: imgW, h: imgH },
  });

  // Border
  sl.addShape(prs.ShapeType.RECT, {
    x: imgX, y: imgY, w: imgW, h: imgH,
    fill: { type: 'none' },
    line: { color: C.gray300, width: 1 },
  });

  if (notes) sl.addNotes(notes);
  return sl;
}

// ─── Helper: title slide ───────────────────────────────────────────────────────
function titleSlide() {
  const sl = prs.addSlide();
  sl.addShape(prs.ShapeType.RECT, { x: 0, y: 0, w: W, h: H, fill: { color: C.bgDark } });

  // Diagonal accent block
  sl.addShape(prs.ShapeType.RECT, {
    x: 8.5, y: 0, w: 4.83, h: H,
    fill: { color: C.brand }, line: { type: 'none' },
    rotation: 0,
  });

  // Logo area — "M" badge
  sl.addShape(prs.ShapeType.ELLIPSE, {
    x: 0.6, y: 0.55, w: 1.0, h: 1.0,
    fill: { color: C.brand }, line: { type: 'none' },
  });
  sl.addText('M', {
    x: 0.6, y: 0.55, w: 1.0, h: 1.0,
    fontSize: 32, bold: true, color: C.white,
    fontFace: FONT_TITLE, align: 'center', valign: 'middle',
  });
  sl.addText('MoMo HRM', {
    x: 1.75, y: 0.7, w: 3, h: 0.45,
    fontSize: 15, bold: true, color: C.white,
    fontFace: FONT_TITLE, align: 'left',
  });
  sl.addText('Performance Management System', {
    x: 1.75, y: 1.1, w: 4, h: 0.35,
    fontSize: 10, color: C.gray300,
    fontFace: FONT_BODY, align: 'left',
  });

  // Main heading
  sl.addText('Hướng dẫn\nsử dụng', {
    x: 0.6, y: 2.2, w: 7.5, h: 2.5,
    fontSize: 52, bold: true, color: C.white,
    fontFace: FONT_TITLE, align: 'left', valign: 'top',
    lineSpacingMultiple: 1.1,
  });
  sl.addText('Hệ thống Quản lý Hiệu suất cá nhân', {
    x: 0.6, y: 4.65, w: 7.5, h: 0.55,
    fontSize: 16, color: C.gray300,
    fontFace: FONT_BODY, align: 'left',
  });

  // Right panel content
  sl.addText('Dành cho:', {
    x: 9.0, y: 1.5, w: 3.8, h: 0.4,
    fontSize: 11, color: C.white, bold: true,
    fontFace: FONT_BODY, align: 'left',
  });

  const roles = [
    { icon: '👤', text: 'Nhân viên' },
    { icon: '👥', text: 'Quản lý trực tiếp (QLTT)' },
  ];
  roles.forEach((r, i) => {
    sl.addShape(prs.ShapeType.RECT, {
      x: 9.0, y: 2.1 + i * 0.85, w: 3.7, h: 0.65,
      fill: { color: '00000040' }, line: { color: 'FFFFFF30', width: 1 },
      rounding: true,
    });
    sl.addText(`${r.icon}  ${r.text}`, {
      x: 9.1, y: 2.15 + i * 0.85, w: 3.5, h: 0.55,
      fontSize: 13.5, color: C.white, bold: true,
      fontFace: FONT_BODY, align: 'left', valign: 'middle',
    });
  });

  sl.addText('Phiên bản Prototype · 2026', {
    x: 9.0, y: 6.8, w: 3.8, h: 0.35,
    fontSize: 9, color: 'FFFFFF80',
    fontFace: FONT_BODY, align: 'left',
  });

  return sl;
}

// ─── Helper: agenda / TOC slide ───────────────────────────────────────────────
function agendaSlide() {
  const sl = prs.addSlide();
  sl.addShape(prs.ShapeType.RECT, { x: 0, y: 0, w: W, h: H, fill: { color: C.white } });

  sl.addText('Nội dung hướng dẫn', {
    x: 0.6, y: 0.45, w: 12, h: 0.7,
    fontSize: 28, bold: true, color: C.gray900,
    fontFace: FONT_TITLE, align: 'left',
  });
  sl.addShape(prs.ShapeType.RECT, {
    x: 0.6, y: 1.25, w: 12, h: 0.03,
    fill: { color: C.gray300 }, line: { type: 'none' },
  });

  const sections = [
    {
      num: '01',
      title: 'Hướng dẫn Nhân viên',
      items: ['Tổng quan trang Mục tiêu', 'Tạo mục tiêu mới', 'Trạng thái mục tiêu', 'Gửi mục tiêu để duyệt', 'Tự đánh giá MYR'],
      x: 0.6,
    },
    {
      num: '02',
      title: 'Hướng dẫn Quản lý trực tiếp',
      items: ['Tổng quan danh sách nhân viên', 'Phê duyệt mục tiêu nhân viên', 'Thực hiện đánh giá MYR'],
      x: 7.0,
    },
  ];

  sections.forEach(s => {
    // Number
    sl.addText(s.num, {
      x: s.x, y: 1.5, w: 1.2, h: 1.2,
      fontSize: 56, bold: true, color: C.stepCircle,
      fontFace: FONT_TITLE, align: 'left',
    });
    sl.addText(s.num, {
      x: s.x, y: 1.5, w: 1.2, h: 1.2,
      fontSize: 56, bold: true, color: C.brand,
      fontFace: FONT_TITLE, align: 'left',
    });
    // Title
    sl.addText(s.title, {
      x: s.x, y: 2.7, w: 5.8, h: 0.55,
      fontSize: 18, bold: true, color: C.brand,
      fontFace: FONT_TITLE, align: 'left',
    });
    // Items
    s.items.forEach((item, i) => {
      sl.addShape(prs.ShapeType.ELLIPSE, {
        x: s.x, y: 3.5 + i * 0.62, w: 0.28, h: 0.28,
        fill: { color: C.brand }, line: { type: 'none' },
      });
      sl.addText(item, {
        x: s.x + 0.42, y: 3.47 + i * 0.62, w: 5.2, h: 0.32,
        fontSize: 13.5, color: C.gray700,
        fontFace: FONT_BODY, align: 'left',
      });
    });
  });

  // Vertical divider
  sl.addShape(prs.ShapeType.RECT, {
    x: 6.7, y: 1.4, w: 0.03, h: 5.6,
    fill: { color: C.gray300 }, line: { type: 'none' },
  });

  return sl;
}

// ─── SLIDES ───────────────────────────────────────────────────────────────────

// 1. Title
titleSlide();

// 2. Agenda
agendaSlide();

// 3. Section 1 header
sectionSlide('PHẦN 1', '👤', '01', 'Hướng dẫn Nhân viên');

// 4. Bước 1 – Tổng quan trang Mục tiêu
stepSlide({
  stepNum: 1, stepTotal: 5,
  title: 'Tổng quan trang Mục tiêu & Đánh giá',
  bullets: [
    'Truy cập trang "Mục tiêu và Đánh giá cá nhân" từ sidebar.',
    'Có 3 tab chính: Mục tiêu, Mid-Year Review, End-Year Review.',
    'Tab Mục tiêu hiển thị 3 nhóm: Mục tiêu Công việc, Phát triển, Hành vi.',
    'Chọn Cột (board) hoặc Bảng (table) để xem theo cách khác nhau.',
    'Thông tin nhân viên và Quản lý trực tiếp hiển thị ở góc phải.',
  ],
  imgFile: 'e01-goals-board.png',
  notes: 'Màn hình E-01 – tab Mục tiêu, chế độ xem Cột (board view)',
});

// 5. Bước 2 – Tạo mục tiêu
stepSlide({
  stepNum: 2, stepTotal: 5,
  title: 'Tạo mục tiêu mới',
  bullets: [
    'Nhấn "+ Tạo mục tiêu" hoặc "+ Thêm mục tiêu công việc/phát triển".',
    'Điền: Loại mục tiêu, Tên mục tiêu, Kết quả cần đạt (KPIs/Key Results).',
    'Chọn Mức độ ưu tiên và khoảng thời gian thực hiện.',
    'Nhấn "Lưu nháp" để lưu tạm, hoặc "Gửi quản lý" để gửi duyệt ngay.',
  ],
  imgFile: 'e01-create-goal-dialog.png',
  notes: 'Dialog tạo mục tiêu mới – E-01',
});

// 6. Bước 3 – Trạng thái mục tiêu
stepSlide({
  stepNum: 3, stepTotal: 5,
  title: 'Các trạng thái mục tiêu',
  bullets: [
    '🔵 Nháp — Đã lưu, chưa gửi duyệt.',
    '🟡 Chờ duyệt — Đã gửi, đang chờ QLTT phê duyệt.',
    '🟢 Đã duyệt — QLTT đã phê duyệt, mục tiêu chính thức.',
    '🟠 Cần cập nhật — QLTT yêu cầu chỉnh sửa.',
    '✅ Hoàn thành — Mục tiêu đã hoàn thành (đánh dấu bởi NV hoặc QL).',
    'Mục tiêu cần ít nhất 1 mục tiêu Công việc được duyệt để tham gia MYR/YER.',
  ],
  imgFile: 'e01-goals-table.png',
  notes: 'Bảng mục tiêu hiển thị các trạng thái badge – E-01 table view',
});

// 7. Bước 4 – Gửi để duyệt
stepSlide({
  stepNum: 4, stepTotal: 5,
  title: 'Gửi mục tiêu để Quản lý phê duyệt',
  bullets: [
    'Trên thẻ mục tiêu ở chế độ xem Cột: nhấn menu "..." → "Gửi quản lý".',
    'Hoặc khi tạo mục tiêu, nhấn thẳng "Gửi quản lý" thay vì "Lưu nháp".',
    'Sau khi gửi, trạng thái chuyển sang "Chờ duyệt" (màu vàng).',
    'QLTT sẽ nhận thông báo và phê duyệt hoặc yêu cầu chỉnh sửa.',
    'Có thể chỉnh sửa mục tiêu và gửi lại nếu QLTT yêu cầu "Cần cập nhật".',
  ],
  imgFile: 'e01-goal-statuses.png',
  notes: 'Các trạng thái mục tiêu – chú ý badge màu sắc',
});

// 8. Bước 5 – Tự đánh giá MYR
stepSlide({
  stepNum: 5, stepTotal: 5,
  title: 'Tự đánh giá Mid-Year Review (MYR)',
  bullets: [
    'Nhấn tab "Mid-Year Review" (có badge "Đang hoạt động").',
    'Xem quy trình 5 bước: NV tự đánh giá → QLTT → Cấp 2 → HOD → Kết quả.',
    'Điền điểm tự đánh giá (1–5) vào cột "Điểm NV" cho từng mục tiêu.',
    'Có thể "Lưu nháp" để lưu tạm nhiều lần trước khi gửi chính thức.',
    'Nhấn "Gửi tự đánh giá" để hoàn tất — không thể sửa sau khi gửi.',
  ],
  imgFile: 'e01-myr-selfeval.png',
  notes: 'MYR self-assessment form – E-01, tab Mid-Year Review',
});

// 9. Section 2 header
sectionSlide('PHẦN 2', '👥', '02', 'Hướng dẫn Quản lý trực tiếp');

// 10. QLTT Bước 1 – Danh sách nhân viên
stepSlide({
  stepNum: 1, stepTotal: 3,
  title: 'Tổng quan danh sách nhân viên',
  bullets: [
    'Chuyển sang chế độ "Quản lý" (nút góc trên bên trái sidebar).',
    'Trang "Mục tiêu và Đánh giá nhân viên" hiển thị toàn bộ báo cáo trực tiếp.',
    'Cột "Quản lý cần làm" cho biết số mục tiêu đang chờ phê duyệt.',
    'Nhấn vào tên nhân viên để xem chi tiết và thực hiện hành động.',
    'Dùng tab "Direct / Indirect reports" để chuyển giữa báo cáo trực tiếp và gián tiếp.',
  ],
  imgFile: 'm01-employee-list.png',
  notes: 'M-01 – Manager view, danh sách nhân viên tab Mục tiêu',
});

// 11. QLTT Bước 2 – Phê duyệt mục tiêu
stepSlide({
  stepNum: 2, stepTotal: 3,
  title: 'Phê duyệt mục tiêu nhân viên',
  bullets: [
    'Nhấn tên nhân viên (hoặc link "Duyệt X mục tiêu") để vào Chi tiết Mục tiêu.',
    'Xem danh sách mục tiêu với trạng thái từng mục (Chờ duyệt, Đã duyệt…).',
    '✓ (Duyệt) — Chấp thuận mục tiêu, trạng thái chuyển sang "Đã duyệt".',
    '↩ (Yêu cầu chỉnh sửa) — Gửi lại cho nhân viên với ghi chú.',
    '✗ (Từ chối) — Từ chối mục tiêu, nhân viên cần tạo lại.',
  ],
  imgFile: 'm01-goal-approval-view.png',
  notes: 'M-01 – Chi tiết mục tiêu nhân viên với action buttons (duyệt/từ chối)',
});

// 12. QLTT Bước 3 – MYR evaluation
stepSlide({
  stepNum: 3, stepTotal: 3,
  title: 'Đánh giá MYR cho nhân viên',
  bullets: [
    'Nhấn tab "Mid-Year Review" trong trang Mục tiêu và Đánh giá nhân viên.',
    'Xem danh sách nhân viên cùng trạng thái và điểm tự đánh giá (Điểm NV).',
    'Nhấn biểu tượng bút ✏️ trên hàng nhân viên để điền điểm QLTT.',
    'Điền điểm (1–5) và nhận xét cho từng mục tiêu của nhân viên.',
    'Sau khi hoàn tất, nhấn "Gửi đánh giá" — điểm sẽ được chuyển lên cấp cao hơn.',
  ],
  imgFile: 'm01-myr-tab.png',
  notes: 'M-01 – MYR tab: danh sách nhân viên với cột điểm và trạng thái',
});

// 13. Closing slide
{
  const sl = prs.addSlide();
  sl.addShape(prs.ShapeType.RECT, { x: 0, y: 0, w: W, h: H, fill: { color: C.bgDark } });
  sl.addShape(prs.ShapeType.RECT, {
    x: 0, y: 0, w: W / 2, h: H,
    fill: { color: C.brand }, line: { type: 'none' },
  });

  sl.addText('Cảm ơn!', {
    x: 0.6, y: 2.0, w: 5.6, h: 1.5,
    fontSize: 52, bold: true, color: C.white,
    fontFace: FONT_TITLE, align: 'left',
  });
  sl.addText('Bắt đầu sử dụng PMS ngay hôm nay.', {
    x: 0.6, y: 3.6, w: 5.6, h: 0.6,
    fontSize: 15, color: C.white,
    fontFace: FONT_BODY, align: 'left',
  });

  sl.addText('Câu hỏi & Hỗ trợ', {
    x: 7.5, y: 2.2, w: 5.3, h: 0.5,
    fontSize: 18, bold: true, color: C.white,
    fontFace: FONT_TITLE, align: 'left',
  });
  const contacts = [
    '📧  hr@momo.vn',
    '💬  Slack: #pms-support',
    '📋  Hướng dẫn chi tiết: trang nội bộ HR Portal',
  ];
  contacts.forEach((c, i) => {
    sl.addText(c, {
      x: 7.5, y: 2.95 + i * 0.7, w: 5.3, h: 0.5,
      fontSize: 13, color: C.gray300,
      fontFace: FONT_BODY, align: 'left',
    });
  });
}

// ─── Write file ───────────────────────────────────────────────────────────────
prs.writeFile({ fileName: OUT }).then(() => {
  console.log('PPTX saved:', OUT);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
