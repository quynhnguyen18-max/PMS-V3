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

`archive/` là bản lưu trữ đóng băng (vd `archive/yer-nop-tre-v1/`: E-05, M-06 theo rule nộp trễ cũ). Không sửa, không đọc, không rà, không áp quy tắc DS.

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
- Sửa file dùng chung (`assets/`, `H-05/feedback-program-*.js`, `M-04/manager-*.js`) thì phải rà mọi màn đang dùng file đó.

## Trước mỗi commit (bắt buộc, không đợi chị nhắc)

Tài liệu phải luôn là bản mới nhất. Mỗi commit có sửa code thì trong **cùng commit** phải:

1. **Cập nhật tài liệu theo code vừa sửa.** Rule nghiệp vụ và rule riêng của module ghi vào spec của module (`FEEDBACK_PLAN.md`, `GOAL-SPEC.md`, `MYR-SPEC.md`, `YER-SPEC.md`). Rule giao diện riêng Feedback ghi vào `UI-RULES.md`. Rule giao diện dùng cho mọi màn ghi vào `DESIGN-SYSTEM.md` §19, component vào `design-system/COMPONENTS.md`, token vào `assets/tokens.css` và DS §2. Thêm, bớt hay đổi màn, file dùng chung, test thì sửa README của module và bảng module ở file này.
2. **Rule cũ bị thay thì sửa hoặc xóa đoạn cũ**, không để hai phiên bản cùng tồn tại. Chỗ nào tài liệu và code lệch nhau thì hỏi chị bản nào đúng.
3. Test nào đọc câu chữ trong tài liệu thì cập nhật và chạy lại test.
4. **Rà rác:** liệt kê file tạm, ảnh chụp, output, file không còn được chỗ nào tham chiếu, rồi **hỏi chị trước khi xóa**. Không tự xóa.
5. Tin nhắn báo xong phải ghi rõ đã cập nhật tài liệu nào. Nếu không có rule mới thì ghi "Không có rule mới".

Hook `.claude/hooks/require-docs.js` (chỉ có trên máy chị) tự chặn commit có sửa code màn hình hoặc `assets/` mà không kèm tài liệu nào. Chỉ khi thật sự không có rule mới mới ghi `[no-docs]` trong nội dung commit.

## Đọc tiết kiệm

- File HTML màn hình dài 1.000 đến 3.800 dòng. Dùng Grep tìm `id`, tên hàm hoặc chuỗi cần sửa, rồi Read với `offset` và `limit`. Không đọc cả file.
- Tài liệu dài (`YER-SPEC.md` 80KB, `UI-RULES.md` 36KB, `PMS_PRD_v1.md`): Grep `^## ` để lấy mục lục, rồi đọc đúng mục.
- Không đọc: `node_modules/`, `MoMo Font/`, `assets/myr-results/`, `assets/vendor/` (đã chặn trong `.claude/settings.json` và `.ignore`).

## Lệnh

- `npm run dev`: chạy prototype ở cổng 5173 (hoặc dùng preview "PMS Prototype" trong `.claude/launch.json`).
- `npm test`: test Feedback, org-chain và tokens.
- `npm run test:yer`: test YER.
