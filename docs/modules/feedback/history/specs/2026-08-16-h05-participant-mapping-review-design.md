# H-05 Participant Mapping and Review Design

**Status:** Approved design, pending implementation plan

## Goal

Make the HR request builder unambiguous about who receives feedback and who gives it. HR can assign one shared reviewer group to every recipient or configure reviewers per recipient, then review the complete ticket before sending it.

## Source of Truth

- M-04 manager request dialog is the visual and interaction source of truth for person pickers, selected-person chips, triangle direction, tooltip and field typography.
- The Feedback Design System remains the source of truth for tokens. This change adds no new visual token or component family.
- H-05 must stop using its isolated hard-coded employee list. It consumes the shared PMS employee fixture and its canonical explicit `domain` value.
- Canonical employee display is `Họ tên (tên.họ)`. The existing fixture must explicitly store the correct domain; the UI does not concatenate name fragments at render time.

## Typography and Interaction Contract

- Field label: Public Sans 12.5px, 600, `--z900`.
- Input, textarea, select and selected-chip text: Public Sans 13px, 400, `--z600`.
- Supporting text and tooltip body: 11.5px, 400, `--z500`.
- The standard PMS tooltip is black with white text and is positioned above or below its trigger so it is never clipped.
- Search results show avatar, `Họ tên (domain)`, then organization metadata. A selected chip/card shows only avatar and `Họ tên (domain)`.

## Participant Mapping

The required form field is headed **Chọn người tham gia**. It reuses the M-04 role-flow pattern:

```text
Người nhận phản hồi  ▶  Người cho phản hồi
```

The recipient is always on the left and the reviewer on the right. The triangle describes feedback direction and remains inside the same mapping row.

### Shared reviewers

The first segmented option is **Dùng chung người cho phản hồi**. HR selects one or more recipients and one or more reviewers. The reviewer set applies to every selected recipient; a reviewer cannot review themself. This option is the initial mode because it is the shortest path for a common questionnaire.

### Per-recipient reviewers

The second segmented option is **Thiết lập riêng theo người nhận**. Each selected recipient gets one separate mapping row. The recipient card is left aligned, the reviewer picker and reviewer chips are right aligned, and a standard divider separates rows. Each row owns its reviewer set. A reviewer cannot review themself.

### Copy reviewers

The icon-only copy trigger appears only in a per-recipient row that already has at least one reviewer. It is placed in the row action area, without changing either role column's baseline. Tooltip text is **Sao chép người cho phản hồi**. It copies the whole reviewer set to selected recipient rows; it never means copying a single reviewer.

## Deadline and Identity

Under **Thời hạn phản hồi***, show the existing small field hint:

> Hệ thống tự nhắc người chưa trả lời 3 ngày trước hạn phản hồi.

**Chế độ danh tính người cho phản hồi*** is required and has no preselected option:

- **Ghi danh** — Hiển thị tên người cho phản hồi cùng nội dung.
- **Ẩn danh** — Chỉ hiển thị nội dung phản hồi.

The helper copy is:

> Khi yêu cầu được tạo, người nhận phản hồi, người cho phản hồi và quản lý trực tiếp của người nhận sẽ được thông báo. Kết quả chỉ hiển thị sau khi HR chia sẻ.

The setting is ticket-wide. It does not hide identity from HR administration or notification delivery.

## Review Before Sending

The authoring CTA **Tạo yêu cầu phản hồi** validates the required fields and opens a dedicated review state. It does not persist a ticket.

The review state uses the existing H-05 full-page shell and M-04 card/field primitives. It presents only the final goal, questionnaire, recipient-to-reviewer mappings, deadline, identity mode and optional invitation message. It has:

- **Quay lại chỉnh sửa** — returns to authoring without discarding state.
- **Gửi yêu cầu** — persists the normalized ticket and navigates to H-06.

Only `Gửi yêu cầu` writes to `uc5_campaigns`.

## Data Model

The campaign model gains explicit assignment mode information while retaining normalized per-recipient mappings for downstream consumers:

```js
{
  reviewerAssignmentMode: 'shared' | 'per_recipient',
  sharedReviewerIds: ['employee-id'],
  reviewerMappings: [
    { participantId: 'employee-id', reviewerIds: ['employee-id'] }
  ],
  identityVisibility: 'named' | 'anonymous'
}
```

- In shared mode, submission expands `sharedReviewerIds` into one `reviewerMappings` record per recipient.
- In per-recipient mode, `reviewerMappings` is directly edited.
- Legacy stored tickets without `reviewerAssignmentMode` normalize as `per_recipient` when mappings exist, otherwise `shared`.
- New tickets must choose `identityVisibility`; legacy tickets without it normalize to `named` for backwards compatibility.

## Validation and Error Handling

- At least one recipient and one eligible reviewer per recipient are required.
- A reviewer cannot be assigned to their own feedback.
- Deadline, goal, at least one valid question, and identity mode are required before review.
- Invalid submission stays in authoring, shows the existing toast, and does not create local storage data.
- The review state cannot be reached with invalid data; final send revalidates in case state changes.

## Test Contracts

`H-05/h05.test.js` must prove:

1. shared reviewer selection expands to every recipient and removes self-review;
2. per-recipient mappings retain different reviewer sets;
3. new request validation requires explicit identity selection while legacy normalization remains named;
4. canonical fixture domains render as `tên.họ`;
5. M-04 picker order is recipient, triangle, reviewer and copy control is conditional;
6. the deadline reminder hint and identity wording are present;
7. review is a state before persistence and only final send stores the ticket;
8. Design System documents the same source-of-truth and display rules.

## Out of Scope

- Notification delivery is mock-only; this work records the correct state and wording but does not introduce a delivery service.
- No mobile-specific layout or new UI component/token is introduced.
