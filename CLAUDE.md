# PMS Prototype — MoMo HRM

Prototype HTML tĩnh cho hệ thống quản lý hiệu quả công việc (PMS). Chạy bằng Vite, deploy Vercel (pms-v3).
`index.html` gốc chuyển thẳng tới `E-05/index.html`. Từ đó đổi vai trò ở sidebar: Quản lý sang M-05, HR sang H-05.

## Bắt đầu phiên

Chị sẽ nói đang làm module nào. Chỉ đọc file này, `DESIGN-SYSTEM.md` và README của module đó. **Không quét toàn repo.**

| Module | README | Màn hình |
|---|---|---|
| Feedback | `docs/modules/feedback/README.md` | E-04, M-04, H-05, H-06, H-07 |
| Goal setting | `docs/modules/goal-setting/README.md` | Tab Mục tiêu trong E-05, M-06; M-05, M-01b |
| Đánh giá giữa năm (MYR) | `docs/modules/myr/README.md` | Tab Giữa năm trong E-05, M-06; M-05 |
| Đánh giá cuối năm (YER) | `docs/modules/yer/README.md` | E-05, M-05, M-06, YER-demo |

## Tài liệu dùng chung

- **Design system, 3 tầng:**
  - `DESIGN-SYSTEM.md`: lõi (triết lý, tokens, layout, typography, §19 quy tắc chung, §20 đồng bộ giữa các màn). Đọc trước khi sửa bất kỳ UI hay text UI nào.
  - `design-system/COMPONENTS.md`: §5 đến §18b. Chỉ đọc mục cần dùng.
  - `docs/modules/feedback/UI-RULES.md`: rule giao diện riêng của Feedback (các mục cũ của §19).
  - `design-system/index.html`: bản showcase render thật.
  - `assets/tokens.css`: tokens `:root` dùng chung, mọi màn nạp file này (DS §2). Không khai lại token trong màn.
- **Business rules gốc:** `docs/shared/` (bản v1, 06/2026, chỉ đọc). Xem `docs/shared/README.md`. Rule mới nhất nằm ở `docs/modules/`.

## Quy tắc làm việc

- Không commit, không push khi chị chưa đồng ý. Mặc định chỉ sửa trên máy.
- Text UI tuyệt đối không dùng middot `·`, luôn dùng ` - ` (DS §19.0).
- Luật nghiệp vụ chỉ viết một lần, trong file model. Màn hình chỉ render (DS §20.1).
- Không sửa `assets/employees-data.js` (dữ liệu nhân sự dùng chung cho mọi màn).
- **Rule mới chốt với chị phải được ghi vào tài liệu trong cùng lượt sửa code:** rule nghiệp vụ và rule riêng của module ghi vào `docs/modules/<module>/`; rule giao diện áp dụng cho mọi màn ghi vào `DESIGN-SYSTEM.md` §19. Nếu có test đọc tài liệu thì cập nhật cả test.
- Sửa file dùng chung (`assets/`, `H-05/feedback-program-*.js`, `M-04/manager-*.js`) thì phải rà mọi màn đang dùng file đó.

## Đọc tiết kiệm

- File HTML màn hình dài 1.000 đến 3.800 dòng. Dùng Grep tìm `id`, tên hàm hoặc chuỗi cần sửa, rồi Read với `offset` và `limit`. Không đọc cả file.
- Tài liệu dài (`YER-SPEC.md` 80KB, `UI-RULES.md` 36KB, `PMS_PRD_v1.md`): Grep `^## ` để lấy mục lục, rồi đọc đúng mục.
- Không đọc: `node_modules/`, `MoMo color/`, `MoMo Font/`, `feedback-pilot-email/`, `assets/myr-results/`, `assets/vendor/` (đã chặn trong `.claude/settings.json` và `.ignore`).

## Lệnh

- `npm run dev`: chạy prototype ở cổng 5173 (hoặc dùng preview "PMS Prototype" trong `.claude/launch.json`).
- `npm test`: test Feedback và org-chain.
- `npm run test:yer`: test YER.
