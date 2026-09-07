# PMS – Continuous Feedback
## Scope Cut & Rules Alignment

---

## 1. Purpose

Tài liệu này chốt **flow, business rules, visibility logic và phạm vi MVP** của capability **Continuous Feedback**, làm cơ sở để bắt đầu UI/UX design và prototype.

Tài liệu tập trung vào **ai được làm gì, tới đâu, khi nào, và ai nhìn thấy được gì** — không mô tả giao diện.

---

## 2. Doc type

| | |
|---|---|
| **Document type** | Scope & Rules Alignment (pre-PRD) |
| **Source document** | *PMS – Building a Feedback Culture at MoMo* (Product Concept Document) |
| **Vị trí trong quy trình** | Concept Document → **Scope & Rules Alignment (tài liệu này)** → PRD → Wireframe → Prototype |
| **Phạm vi tài liệu** | Use case scope, permission, visibility, flow, business rules |
| **Ngoài phạm vi** | Giao diện, thiết kế màn hình, kỹ thuật, data model |

### Product baseline

| Item | Decision |
|---|---|
| **Core action naming** | **Give Feedback** (thống nhất toàn hệ thống, thay cho "Share Feedback") |
| **Organization data source** | **Org Matrix** — nguồn duy nhất xác định Line Manager và Indirect Manager |
| **Core Values** | Innovation · Teamwork · Excellence in Execution · Constant Learning · Customer Centricity — hiển thị dạng badge, chọn được nhiều giá trị |
| **Language** | EN + VN (UI và AI) |
| **Notification channel** | Email |
| **AI data policy** | Nội dung feedback không được xử lý bởi model bên ngoài tổ chức |
| **AI in prototype** | Scripted simulation (không gọi model thật) |
| **Request for others** | Chỉ **Line Manager** và **HR Team (HRBP + L&OD)** |

---

## 3. Terminology

### Actors

| Term | Định nghĩa |
|---|---|
| **Employee** | Mọi user trong hệ thống. Dùng cho "bất kỳ ai" |
| **Line Manager** | Quản lý trực tiếp theo Org Matrix |
| **Indirect Manager** | Các cấp quản lý cao hơn Line Manager (Upper LM, HOD) theo Org Matrix |
| **HR Team (HRBP + L&OD)** | Bộ phận vận hành các chương trình feedback có cấu trúc |
| **HR Admin** | Vai trò cấu hình hệ thống |
| **Project Manager / Team Lead** | Người phụ trách một dự án hoặc nhóm làm việc |

### Feedback roles

| Term | Định nghĩa |
|---|---|
| **Feedback Giver** | Người viết feedback |
| **Feedback Receiver** | Người được feedback nói về |
| **Requester** | Người tạo Feedback Request |
| **Invited Giver** | Người được mời phản hồi trong một Feedback Request *(thay cho "Reviewer" ở tài liệu nguồn — tránh nhầm với vai trò đánh giá trong MYR/YER)* |

### Objects & visibility

| Term | Định nghĩa |
|---|---|
| **Feedback** | Một bản ghi phản hồi từ Feedback Giver tới Feedback Receiver |
| **Feedback Request** | Gói yêu cầu phản hồi do Requester tạo |
| **Request Item** | Một đơn vị phản hồi = 1 Feedback Receiver × 1 Invited Giver |
| **Private** | Chỉ Feedback Giver và Feedback Receiver xem được |
| **Shared** | Feedback Receiver + Line Manager + Indirect Managers của Feedback Receiver xem được |

---

## 4. Request scope — ai được request feedback cho ai

| Requester | Feedback Receiver scope | Nguồn dữ liệu xác định phạm vi |
|---|---|---|
| **Employee** | Chỉ cho chính mình | – |
| **Line Manager** | **Direct reports** | Org Matrix — quan hệ quản lý trực tiếp |
| **Indirect Manager** | Không được tạo request | – |
| **HRBP** | Nhân sự thuộc **bộ phận được phân công phụ trách** | Org Matrix + bảng phân công HRBP ↔ BU |
| **L&OD** | **Toàn tổ chức, trừ khối HR** | Org Matrix + cờ loại trừ HR |

Phạm vi này được hệ thống lọc sẵn ở ô chọn người — user không nhập được tên nằm ngoài phạm vi của mình.

---

## 5. Use case map

| ID | Use case | Initiator | Nguồn |
|---|---|---|---|
| **UC1** | **Request Feedback (Employee)** | Employee | Tài liệu nguồn |
| **UC2** | **Give Feedback** | Employee | Tài liệu nguồn |
| **UC3** | **Request Feedback (Manager)** | Line Manager | Tài liệu nguồn |
| **UC4** | **Team Feedback** | Project Manager / Team Lead | Tài liệu nguồn |
| **UC5** | **Feedback Programs** | HR Team (HRBP + L&OD) | Tài liệu nguồn |
| **UC6** | **Respond to Feedback Request** | Invited Giver | Bổ sung |

**UC5 gồm 2 tier:**

| Tier | Tên | Nội dung |
|---|---|---|
| **Tier 1** | **Quick Request** | HR Team (HRBP + L&OD) gửi yêu cầu phản hồi dạng văn bản tự do. Dùng chung composer với UC2 |
| **Tier 2** | **Structured Program** | Chiến dịch có bộ câu hỏi, thang điểm, tùy chọn ẩn danh, báo cáo tổng hợp |

**Lý do bổ sung UC6:** một Feedback Request cho 5 Feedback Receiver × 3 Invited Giver sinh ra 15 Request Item cần được trả lời. Đây là luồng có lưu lượng lớn nhất hệ thống nhưng chưa được mô tả ở tài liệu nguồn.

**Feedback Activity** không phải use case. Đây là surface tổng hợp mọi hoạt động feedback của một user (feedback đã nhận, đã gửi, request đã tạo, request cần trả lời). Nó được liệt kê trong Module structure và Screen inventory.

---

## 6. Use case comparison

| Tiêu chí | UC1 Request (Employee) | UC2 Give Feedback | UC6 Respond | UC3 Request (Manager) | UC5 Feedback Programs | UC4 Team Feedback |
|---|---|---|---|---|---|---|
| **Initiator** | Employee | Employee | Invited Giver | Line Manager | HR Team (HRBP + L&OD) | Project Manager / Team Lead |
| **Feedback Receiver** | Chính Requester | Bất kỳ Employee | – | Direct reports | HRBP: BU phụ trách · L&OD: toàn org trừ HR | Thành viên team |
| **Fan-out** | 1 → N | 1 → 1 | 1 Request Item | M × N | M × N | N × N |
| **Core object** | Feedback Request | Feedback | Request Item | Feedback Request | Program | Team Cycle |
| **Layout type** | Wizard + tracking list | Composer | Task inbox + composer | Wizard + tracking matrix | Admin console + builder + analytics | Team board |
| **Composer dùng chung UC2** | – | – | Có | Có | Tier 1: có · Tier 2: không | Chưa xác định |
| **Admin configuration** | Không | Không | Không | Không | Tier 2: có | Không |
| **Aggregation / report** | Không | Không | Không | AI summary | AI summary + analytics + response rate | Team summary |
| **Anonymity** | Không | Không | Không | Không | Tier 2: tùy cấu hình | Chưa xác định |
| **Visibility logic** | Invited Giver chọn Private / Shared | Feedback Giver chọn Private / Shared | Kế thừa theo loại request | Requester luôn xem được · quyền xem của Feedback Receiver theo §11 | Theo cấu hình chương trình | Chưa xác định |

### Screen inventory

| Use case | Screens |
|---|---|
| **UC1** Request Feedback (Employee) | Select Invited Givers · Request Context & Deadline · My Requests – Tracking List · Request Detail |
| **UC2** Give Feedback | Select Feedback Receiver · Intention & Composer (AI Assist) · Visibility & Confirm |
| **UC6** Respond to Feedback Request | Pending Requests Inbox · Respond Composer (AI Assist) · Decline Request |
| **Feedback Activity** *(surface)* | Received · Given · My Requests · To Respond · Team View (Line Manager / Indirect Manager) |
| **UC3** Request Feedback (Manager) | Select Employees · Select Invited Givers · Purpose, Context & Deadline · Request Tracking Matrix · Result & AI Summary · Release Result to Employee |
| **UC5 Tier 1** Quick Request | Select Participants · Select Invited Givers · Purpose, Context & Deadline · Request Tracking Matrix |
| **UC5 Tier 2** Structured Program | Program Setup · Question & Rating Template Builder · Participant & Invited Giver Import · Anonymity & Visibility Config · Reminder Schedule · Structured Response Form · Completion Dashboard · Program Report & Analytics |
| **UC4** Team Feedback | Create Team Cycle · Team Roster & Pairing · Team Response Form · Completion Tracking · Team Summary |

---

## 7. Scope cut

| Phase | Deliverable | Use cases | Ưu tiên vì | Data logic & visibility highlight |
|---|---|---|---|---|
| **Phase 1** | **Feedback Exchange** | UC2, UC1, UC6<br>+ Feedback Activity | • Một object duy nhất: Feedback<br>• Một composer dùng chung cho cả 3 use case<br>• Không cần admin config, không cần báo cáo tổng hợp<br>• Employee tự vận hành, không phụ thuộc quản lý hay HR<br>• Sinh dữ liệu nền cho các phase sau | • Visibility chỉ có 2 lựa chọn: Private / Shared<br>• Feedback Giver toàn quyền quyết định phạm vi<br>• Org Matrix chỉ dùng để hiển thị danh sách người xem được<br>• Feedback Receiver luôn xem được feedback về mình |
| **Phase 2** | **Manager Feedback Request** | UC3 | • Thêm một layout mới: tracking matrix (Feedback Receiver × Invited Giver)<br>• Cần deadline management, reminder, AI summary<br>• Khai thác dữ liệu và thói quen đã hình thành ở Phase 1 | • Phụ thuộc Org Matrix chính xác cho quan hệ direct report<br>• Requester luôn xem được kết quả<br>• Cần chốt cơ chế release kết quả cho Feedback Receiver |
| **Phase 3** | **HR Feedback Programs** | UC5 Tier 1<br>→ UC5 Tier 2 | • Tier 1 dùng lại toàn bộ machinery của Phase 2, chỉ khác scope filter<br>• Tier 2 là năng lực mới: question builder, rating scale, ẩn danh, analytics<br>• Phục vụ quy trình HR: probation, promotion, talent, 360 | • Cần bảng phân công HRBP ↔ BU<br>• Cần rule loại trừ khối HR cho L&OD<br>• Tier 2: visibility theo cấu hình từng chương trình, không theo rule mặc định |
| **Phase 4** | **Team Feedback** | UC4 | • Phụ thuộc dữ liệu Project / Team mà PMS hiện chưa có<br>• Mô hình N × N khác hoàn toàn 3 phase trước<br>• Tài liệu nguồn cũng xếp là *Future* | • Cần định nghĩa Team làm đơn vị dữ liệu<br>• Feedback vẫn thuộc về cá nhân, chỉ phần tổng hợp thuộc về team |

---

## 8. Module structure

Ranh giới module xác định theo **initiator + permission scope + output type**.

| Module | Use cases | Initiator | Output |
|---|---|---|---|
| **M1 – Feedback Exchange** | UC1, UC2, UC6 + Feedback Activity | Employee | Feedback dạng văn bản |
| **M2 – Manager Feedback Request** | UC3 | Line Manager | Feedback dạng văn bản + AI summary |
| **M3 – HR Feedback Programs** | UC5 (Tier 1, Tier 2) | HR Team (HRBP + L&OD) | Tier 1: văn bản · Tier 2: rating + câu trả lời có cấu trúc + báo cáo |
| **M4 – Team Feedback** | UC4 | Project Manager / Team Lead | Feedback cá nhân + team summary |

```
CONTINUOUS FEEDBACK
│
├── M1  Feedback Exchange          Employee tự vận hành
│       UC2 Give Feedback
│       UC1 Request Feedback (Employee)
│       UC6 Respond to Feedback Request
│       Feedback Activity  (surface)
│
├── M2  Manager Feedback Request   Line Manager, phạm vi direct reports
│       UC3 Request Feedback (Manager)
│
├── M3  HR Feedback Programs       HR Team (HRBP + L&OD), phạm vi theo phân công
│       UC5 Tier 1  Quick Request
│       UC5 Tier 2  Structured Program
│
└── M4  Team Feedback              Project Manager / Team Lead
        UC4 Team Feedback
```

**M1, M2 và M3 Tier 1 dùng chung composer và cơ chế Request Item.** M3 Tier 2 và M4 có object riêng và vòng đời riêng nên được xây tách biệt.

---

## 9. Visibility Principles

| # | Principle | Diễn giải |
|---|---|---|
| **VP1** | **Private by default** | Mọi feedback mặc định là Private. Feedback Giver phải chủ động chọn Shared |
| **VP2** | **Giver owns visibility** | Chỉ Feedback Giver được chọn phạm vi. Không ai thay đổi được sau khi gửi, kể cả Feedback Receiver và quản lý |
| **VP3** | **Named audience before sending** | Trước khi gửi, hệ thống hiển thị đúng tên những người sẽ xem được. Không dùng mô tả chung như "quản lý của bạn" |
| **VP4** | **Audience fixed at send time** | Danh sách người xem được xác định từ Org Matrix tại thời điểm gửi và giữ nguyên sau đó. Thay đổi cơ cấu tổ chức về sau không mở thêm quyền xem |
| **VP5** | **Receiver always has access** | Feedback Receiver luôn xem được feedback về mình, trừ trường hợp cấu hình khác trong UC5 Tier 2 |

## 10. Access Principles

| # | Principle | Diễn giải |
|---|---|---|
| **AP1** | **Named authorship** | Mọi feedback đều gắn tên Feedback Giver. Ẩn danh chỉ tồn tại trong UC5 Tier 2 |
| **AP2** | **Scope enforced by system** | Phạm vi chọn người do hệ thống lọc, không phải quy ước vận hành. User không chọn được người ngoài phạm vi |
| **AP3** | **Data stays internal** | Nội dung feedback không được xử lý bởi model bên ngoài tổ chức |
| **AP4** | **AI assists, user authors** | AI gợi ý và không tự gửi. User luôn là tác giả cuối và phải xác nhận trước khi gửi |
| **AP5** | **Permission derived from Org Matrix** | Quyền tạo request và quyền xem được suy ra từ Org Matrix, không khai báo thủ công theo từng user |

---

## 11. Permission matrix

| Action | Employee | Line Manager | Indirect Manager | HRBP | L&OD | HR Admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Give feedback to any employee | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Give feedback to self | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Request feedback for self | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Request feedback for direct reports | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Request feedback for indirect reports | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Request feedback within assigned BU | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Request feedback org-wide, excluding HR | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Respond to feedback request | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Decline feedback request | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View feedback received about self | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View feedback given by self | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View **Shared** feedback of direct reports | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View **Shared** feedback of indirect reports | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View **Private** feedback of others | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Track own request progress | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Send reminder / extend / close own request | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Feedback Program (UC5) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Configure Core Values & templates | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View adoption report | ❌ | ✅ *team* | ✅ *phạm vi quản lý* | ✅ *BU* | ✅ *toàn org* | ✅ |

### Hard rules

| # | Rule |
|---|---|
| **R1** | Không ai được give feedback cho chính mình |
| **R2** | Chỉ **Line Manager** được tạo Feedback Request cho nhân viên under mình. **Indirect Manager không được tạo request cho indirect reports** |
| **R3** | **Indirect Manager** xem được feedback **Shared** của toàn bộ nhân sự under mình theo Org Matrix |
| **R4** | L&OD không nhìn thấy nhân sự khối HR ở mọi ô chọn người |
| **R5** | HRBP chỉ nhìn thấy nhân sự thuộc BU được phân công |
| **R6** | Không ai thay đổi được visibility của feedback do người khác viết |

---

## 12. Visibility matrix

| # | Tình huống | Feedback Giver | Feedback Receiver | Line Manager của Receiver | Indirect Managers của Receiver | Requester | HR Team (HRBP + L&OD) |
|:--:|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **V1** | UC2 Give Feedback — **Private** | ✅ | ✅ | ❌ | ❌ | – | ❌ |
| **V2** | UC2 Give Feedback — **Shared** | ✅ | ✅ | ✅ | ✅ | – | ❌ |
| **V3** | UC1 → UC6, Invited Giver chọn **Private** | ✅ | ✅ | ❌ | ❌ | = Receiver | ❌ |
| **V4** | UC1 → UC6, Invited Giver chọn **Shared** | ✅ | ✅ | ✅ | ✅ | = Receiver | ❌ |
| **V5** | UC3 → UC6 (Line Manager request) | ✅ | Sau khi Requester release | ✅ = Requester | ❌ | ✅ | ❌ |
| **V6** | UC5 → UC6 (HR Team request) | ✅ | Sau khi Requester release | Theo cấu hình chương trình | ❌ | ✅ | ✅ |

**Rules bổ sung cho V5 và V6:**

| # | Rule |
|---|---|
| **V-R1** | Feedback Receiver luôn được thông báo rằng có một Feedback Request về mình đang diễn ra, kể cả khi chưa được xem nội dung |
| **V-R2** | Requester xem kết quả trước, sau đó chủ động release cho Feedback Receiver — nguyên văn hoặc bản AI summary |
| **V-R3** | Invited Giver được biết trước ai sẽ xem được câu trả lời của mình, trước khi bắt đầu viết |
| **V-R4** | Invited Giver không biết ai khác cùng được mời và không xem được câu trả lời của người khác |
| **V-R5** | AI summary chỉ hiển thị khi có tối thiểu 3 Request Item đã được trả lời |

---

## 13. Response deadline rules

| Rule | Nội dung |
|---|---|
| **Default deadline** | 7 ngày kể từ khi gửi request |
| **Deadline range** | Tối thiểu 2 ngày, tối đa 30 ngày |
| **Auto reminder** | Email tại D-2 và D-0 |
| **Manual reminder** | Tối đa 2 lần / Request Item |
| **Extension** | Requester gia hạn được 1 lần, tối đa +7 ngày, chỉ khi request còn mở |
| **Expiry** | Request Item bị khóa. Các Request Item đã trả lời vẫn giữ nguyên giá trị sử dụng |
| **Decline** | Invited Giver được từ chối, chọn lý do từ danh sách: *Not enough working exposure · Not enough information · Conflict of interest · Other*. Requester nhận thông báo và mời được người thay thế |
| **Decline privacy** | Lý do từ chối không hiển thị cho Feedback Receiver |
| **Close request** | Requester đóng request bất kỳ lúc nào, hoặc hệ thống tự đóng khi toàn bộ Request Item hoàn tất |

---

## 14. Use case flows & rules

### UC1 — Request Feedback (Employee)

| Step | Action |
|:--:|---|
| 1 | Select Invited Givers — up to 10 per request, self excluded |
| 2 | Provide context — mandatory, min 20 characters |
| 3 | Set deadline — default 7 days |
| 4 | Send — system creates one Request Item per Invited Giver |
| 5 | Track status per Request Item |
| 6 | Send reminder — max 2 per Request Item |
| 7 | Close request |

**Rules**
- Invited Givers cannot see each other, cannot read each other's responses.
- Each Invited Giver independently chooses Private or Shared.
- Requester cannot edit or delete responses received.
- Max 3 open requests per Employee.

---

### UC2 — Give Feedback

| Step | Action |
|:--:|---|
| 1 | Select Feedback Receiver — any Employee, self excluded |
| 2 | Select intention(s) — Great Job, Suggestion, Thank You (multi-select) |
| 3 | Write draft |
| 4 | AI suggests structure, wording and Core Value |
| 5 | Attach Core Value badge — optional, multi-select |
| 6 | Select visibility — Private (default) or Shared |
| 7 | Review named audience, then send |

**Rules**
- Feedback length: 20 – 2,000 characters.
- Content accepted in EN, VN or mixed.
- Cannot give feedback to a departed employee.
- Rate limit: max 10 feedback per day per Employee; max 3 feedback per week to the same Feedback Receiver.
- When Shared is selected, the named audience is Line Manager + all Indirect Managers of the Feedback Receiver, resolved at send time.

---

### UC6 — Respond to Feedback Request

| Step | Action |
|:--:|---|
| 1 | Open Pending Requests Inbox — sorted by nearest deadline |
| 2 | Review request context — Requester, Feedback Receiver, purpose, deadline, audience |
| 3 | Write response using the UC2 composer |
| 4 | Select visibility — where applicable |
| 5 | Submit, or Decline with reason |

**Rules**
- Audience must be shown before writing (VP3).
- One Request Item is answered once.
- Response cannot be delegated to another Employee.
- For UC3 and UC5 requests, visibility follows §12 instead of Giver's choice.

---

### UC3 — Request Feedback (Manager)

| Step | Action |
|:--:|---|
| 1 | Select Feedback Receivers — direct reports only, system-filtered |
| 2 | Select Invited Givers — shared across the group, or per Feedback Receiver |
| 3 | System generates M × N Request Items and shows the count before sending |
| 4 | Provide purpose and context |
| 5 | Set deadline |
| 6 | Send — each Invited Giver receives one consolidated email listing their Request Items |
| 7 | Track progress in the matrix view |
| 8 | Review results and AI summary |
| 9 | Release results to each Feedback Receiver |

**Rules**
- Max 50 Request Items per request.
- Feedback Receiver is notified that a request about them exists (V-R1).
- Invited Giver sees only their own Request Items.
- AI summary requires at least 3 submitted responses.
- Indirect Manager cannot create this request (R2).

---

### UC5 — Feedback Programs

**Tier 1 — Quick Request**

| Step | Action |
|:--:|---|
| 1 | Select Participants — scope-filtered by role: HRBP by assigned BU, L&OD org-wide excluding HR |
| 2 | Select Invited Givers |
| 3 | Provide program purpose — mandatory, linked to an HR process |
| 4 | Set deadline |
| 5 | Send, track, release results |

**Tier 2 — Structured Program**

| Step | Action |
|:--:|---|
| 1 | Create program — name, HR process type, cycle dates |
| 2 | Build question set — free text, rating scale, competency rating, Core Value rating, STAR / STARAR guided |
| 3 | Import Participants and Invited Givers |
| 4 | Configure anonymity and visibility |
| 5 | Configure reminder schedule |
| 6 | Launch |
| 7 | Monitor completion dashboard |
| 8 | Close program and publish report |

**Rules**
- Every program requires a stated HR purpose and is recorded in an audit log.
- Anonymity is configured at program level and shown to Invited Givers before responding.
- Aggregated results require a minimum number of responses before display.
- Tier 2 responses are structured records and do not appear in Feedback Activity.

---

### UC4 — Team Feedback

| Step | Action |
|:--:|---|
| 1 | Create team feedback cycle for a project or sprint |
| 2 | Define team roster and feedback pairing |
| 3 | Team members give and receive feedback |
| 4 | Track completion |
| 5 | AI generates team summary |

**Rules**
- Feedback remains individual; only the summary is team-level.
- Project Manager / Team Lead sees the team summary, not individual feedback.
- Requires Project / Team as a data entity in PMS.

---

## 15. Feedback intention & AI flow

Áp dụng cho UC2 và UC6.

| Step | Action |
|:--:|---|
| 1 | **AI asks intention first** — Great Job 👏, Suggestion 💡, Thank You ❤️. Multi-select, any number of intentions |
| 2 | **User writes draft** — free writing, no structured form |
| 3 | **AI suggests refinement** based on selected intentions:<br>• Great Job → STAR structure + Core Value suggestion<br>• Suggestion → STARAR structure<br>• Thank You → wording and tone only |
| 4 | **User decides** — Accept · Edit · Regenerate · Keep original |
| 5 | **Select visibility**, review named audience, send |

**Rules**
- AI never sends feedback and never changes content without user confirmation.
- AI is not required to send: if AI is unavailable, the composer still works without suggestions.
- AI must handle EN, VN and mixed content. Where quality is not sufficient, suggestions are hidden rather than shown incorrectly.

### Core Value badge

| Rule | Nội dung |
|---|---|
| Danh sách | Innovation · Teamwork · Excellence in Execution · Constant Learning · Customer Centricity |
| Số lượng | Chọn được nhiều giá trị, tối đa 3 |
| Bắt buộc | Không — luôn là tùy chọn |
| Gợi ý | AI chủ động gợi ý khi phát hiện nội dung ghi nhận |
| Hiển thị | Hiện trên feedback, lọc được theo giá trị ở Feedback Activity |
| Song ngữ | Mỗi giá trị có tên EN và VN |
| Không áp dụng | Không quy đổi thành điểm, không xếp hạng, không dùng cho thi đua |

---

## 16. Open items

| # | Topic | Đề xuất |
|:--:|---|---|
| 1 | Feedback Receiver có được xem kết quả UC3 / UC5 không, và ở thời điểm nào | Requester xem trước và chủ động release. Feedback Receiver luôn được thông báo là có request đang diễn ra |
| 2 | Phạm vi Indirect Manager xem feedback **Shared** — toàn bộ chuỗi quản lý hay giới hạn số cấp | Toàn bộ chuỗi theo Org Matrix, và hiển thị đủ tên cho Feedback Giver trước khi gửi |
| 3 | Nhân viên đổi quản lý — quản lý mới có xem được feedback Shared trước đó không | Không. Danh sách người xem được chốt tại thời điểm gửi (VP4) |
| 4 | Với UC5, Line Manager của Participant có được xem kết quả không | Không mặc định. HR Team (HRBP + L&OD) cấu hình khi tạo chương trình, và Invited Giver được biết trước |
| 5 | Bảng phân công HRBP ↔ BU | Cần xác nhận đã có và đủ chính xác trước Phase 3 |
| 6 | Rule loại trừ khối HR cho L&OD | Cần xác nhận nguồn dữ liệu đánh dấu khối HR trong Org Matrix |
| 7 | Chất lượng AI in-tenant với tiếng Việt | Nếu chưa đạt, Phase 1 tắt gợi ý AI cho nội dung tiếng Việt |
| 8 | Quyền export dữ liệu feedback | Không mở ở Phase 1 và Phase 2. Chỉ có trong UC5 Tier 2, kèm audit log |
| 9 | Tích hợp Evidence Library, Check-in, MYR, YER | Phase 1 chỉ lưu dữ liệu. Tích hợp xử lý từ Phase 2 |
