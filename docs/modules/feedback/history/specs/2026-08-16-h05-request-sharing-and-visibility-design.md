# H-05 Request Sharing and Visibility Design

**Status:** Approved for local implementation

## Goal

Extend the H-05 request builder so HR can define how reviewer identity is displayed, close a ticket at any time, and share results either for the entire ticket or for one feedback recipient at a time. The ticket lifecycle and result sharing remain separate states.

## Typography Contract

The M-04 manager request dialog is the source of truth for H-05 authoring controls:

- Field label: Public Sans 12.5px, weight 600
- Input, select and textarea value: Public Sans 13px, regular weight
- Field hint: Public Sans 11.5px, regular weight

H-05 must not introduce a different form type scale.

## Request Builder

The field order is:

1. Mục tiêu*
2. Chọn bộ câu hỏi
3. Bộ câu hỏi*
4. Người cho phản hồi* → Người nhận phản hồi*
5. Thời hạn phản hồi* and Cách hiển thị người cho phản hồi
6. Lời ngỏ

The mapping header keeps the reviewer column on the left and recipient column on the right, with a dark right-pointing triangle. This preserves the actual feedback direction: **Người cho phản hồi → Người nhận phản hồi**. The copy control means **Sao chép toàn bộ người cho phản hồi**. It copies the source recipient’s complete reviewer set to the checked target recipients; it never copies one person only.

Question cards use `Câu hỏi mở` and `Câu hỏi Likert`. A Likert question starts at score 1 and lets HR choose its maximum from 2 through 10. The compact default asks for the score-1 and maximum-score meanings. Per-score meanings stay hidden until HR expands `Mô tả từng mức`.

When HR selects a supplied questionnaire, the editable question region has a restrained dark navy-purple accent and tinted background. A custom questionnaire retains the neutral input surface.

## Identity Visibility

The field label is **Chế độ danh tính người cho phản hồi**. Use the shared bordered two-card choice pattern with no preselection:

- **Ghi danh** — hiển thị tên người cho phản hồi cùng nội dung.
- **Ẩn danh** — chỉ hiển thị nội dung phản hồi.

The setting is ticket-wide and immutable for all result views of that ticket. It does not hide identity from HR administration or from notification delivery.

## Review Before Send

After the form passes validation, H-05 opens a **Review-confirmation modal** over the unchanged request-builder form; it must not replace the form with a separate screen. The modal shows the goal, questionnaire, mappings, deadline, identity mode and optional invitation message. Participant mappings use explicit column labels **Người cho phản hồi** and **Người nhận phản hồi**, while the arrow points from reviewer to recipient. Closing the modal or selecting **Quay lại chỉnh sửa** returns to the unchanged form values. The footer uses the shared compact action token: buttons `32px / 12px`, footer padding `12px 18px 16px`.

## Lifecycle and Result Sharing

`status` is collection lifecycle only: `draft`, `collecting`, `closed`. HR can close a collecting ticket at any time. Closing stops further submissions and locks every pending assignment. Existing submitted feedback remains retained.

`resultSharing` is an independent audience state:

```js
{
  mode: 'not_shared' | 'shared_all' | 'shared_selected',
  participantIds: [],
  sharedAt: '',
  sharedBy: 'hr'
}
```

- `not_shared` is shown as **Chưa chia sẻ kết quả**.
- `shared_all` is shown as **Đã chia sẻ kết quả** for every recipient.
- `shared_selected` is shown as **Đã chia sẻ kết quả** only for listed recipients; all others remain **Chưa chia sẻ kết quả**.

At creation, reviewers, recipients and each recipient’s direct manager receive a notification with the goal, deadline and requester context. They cannot see submitted feedback until HR shares the result for their recipient. The detail view offers a ticket-level **Chia sẻ toàn bộ kết quả** action and a recipient-level **Chia sẻ kết quả** action. Both require a confirmation dialog because sharing changes who may view feedback.

## Compatibility and Acceptance

- Existing H-05/H-06 seed data normalize to named identity and `not_shared` results.
- Reviewer mappings continue to exclude self-review and derive a union reviewer list.
- A closed ticket rejects new assignment submissions and reminder actions.
- H-06 can display the sharing state in the right summary without repeating the collection status.
- Contract tests prove M-04 type tokens, visibility normalization, share scope, manual closure lockout, supplied-template visual state, whole-set copy semantics, feedback direction, review-modal behavior and static wording.
