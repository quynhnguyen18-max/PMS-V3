const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'http://127.0.0.1:5173';
const OUT = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const VP = { width: 1440, height: 900 };

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: VP.width, height: VP.height } });
  console.log('saved:', file);
  return file;
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function clickByText(page, tag, text) {
  const els = await page.$$(tag);
  for (const el of els) {
    const t = await page.evaluate(e => e.textContent.trim(), el);
    if (t.includes(text)) { await el.click(); return true; }
  }
  return false;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport(VP);

  // ─── E-01: Goal board view (Cột) ─────────────────────────────────────────
  await page.goto(`${BASE}/E-01/index.html`, { waitUntil: 'networkidle0' });
  await wait(800);
  await shot(page, 'e01-goals-board');

  // ─── E-01: Table view (Bảng) ─────────────────────────────────────────────
  await clickByText(page, 'button', 'Bảng');
  await wait(600);
  await shot(page, 'e01-goals-table');

  // ─── E-01: Create goal dialog ─────────────────────────────────────────────
  await clickByText(page, 'button', 'Tạo mục tiêu');
  await wait(700);
  await shot(page, 'e01-create-goal-dialog');
  await page.keyboard.press('Escape');
  await wait(400);

  // ─── E-01: Goal status badges (board view zoom) ───────────────────────────
  await clickByText(page, 'button', 'Cột');
  await wait(500);
  // Zoom into first goal card column to show status badges clearly
  await shot(page, 'e01-goal-statuses');

  // ─── E-01: Submit for approval (send to manager) ──────────────────────────
  // Find a goal card with "Gửi quản lý" button or "Cần cập nhật" status
  // Click context menu / action on goal card
  // For now capture the board with visible action button
  await shot(page, 'e01-goal-submit');

  // ─── E-01: MYR tab ───────────────────────────────────────────────────────
  await clickByText(page, 'button', 'Mid-Year Review');
  await wait(1000);
  await shot(page, 'e01-myr-overview');

  // Scroll down to see self-assessment form
  await page.evaluate(() => window.scrollBy(0, 400));
  await wait(400);
  await shot(page, 'e01-myr-selfeval');

  // ─── M-01: Manager — employee goal list ──────────────────────────────────
  await page.goto(`${BASE}/M-01/index.html`, { waitUntil: 'networkidle0' });
  await wait(800);
  await shot(page, 'm01-employee-list');

  // ─── M-01: Click first "Duyệt X mục tiêu" action ─────────────────────────
  const rows = await page.$$('tr, .emp-row, [class*="row"]');
  // Try clicking "Duyệt" action link in first row
  const links = await page.$$('a, button, span');
  let clicked = false;
  for (const link of links) {
    const t = await page.evaluate(e => e.textContent.trim(), link);
    if (t.startsWith('Duyệt') && t.includes('mục tiêu')) {
      await link.click();
      clicked = true;
      break;
    }
  }
  await wait(800);
  await shot(page, 'm01-goal-approval-view');

  // ─── M-01: MYR evaluation tab ─────────────────────────────────────────────
  await page.goto(`${BASE}/M-01/index.html`, { waitUntil: 'networkidle0' });
  await wait(600);
  await clickByText(page, 'button', 'Mid-Year Review');
  await wait(800);
  await shot(page, 'm01-myr-tab');

  // Click first employee in MYR tab
  const myrLinks = await page.$$('a, button, [class*="emp"], td');
  for (const el of myrLinks) {
    const t = await page.evaluate(e => e.textContent.trim(), el);
    if (t.length > 4 && !t.includes('Mid-Year') && !t.includes('Nhân viên') && !t.includes('Đánh giá')) {
      const tag = await page.evaluate(e => e.tagName, el);
      if (tag === 'A' || tag === 'BUTTON') { await el.click(); break; }
    }
  }
  await wait(600);
  await shot(page, 'm01-myr-eval-form');

  await browser.close();
  console.log('\nAll screenshots saved to:', OUT);
})();
