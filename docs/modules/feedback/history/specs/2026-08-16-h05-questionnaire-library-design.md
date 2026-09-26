# H-05 Questionnaire Library Design

**Status:** Proposed — approved direction, pending implementation-spec review

## Goal

Give HR one clear place to review and manage reusable questionnaires, while keeping a request's questionnaire independent from the template it started from. HR can create a request, use a template, edit its request-only copy, or deliberately save a new reusable questionnaire for later use.

## Information Architecture

The H-05 landing page title becomes **Quản lý yêu cầu phản hồi của HR**. Its primary action remains **Tạo yêu cầu phản hồi**. A secondary outlined action, **Thư viện bộ câu hỏi**, opens the questionnaire library.

The library is a dedicated page titled **Bộ câu hỏi**. It contains the questionnaire list and the contextually clear primary action **Tạo bộ câu hỏi**. The page supports review before creation rather than placing list management inside a create popup.

## Questionnaire Library

Each questionnaire has:

- `id`, `name`, `ownerId`, `ownerName`, `createdAt`, `updatedAt`
- `questions`: ordered open-text or Likert questions
- `scope`: `personal | all_hr | selected_hr`
- `sharedWithIds`: empty except for `selected_hr`
- `sourceTemplateId`: optional provenance when copied from another questionnaire
- `isSystem`: true for system templates

The library groups and filters the list as **Của tôi**, **Được chia sẻ với tôi**, and **Mẫu hệ thống**. List rows show the name, question count, question-type summary, creator, sharing scope and updated date. No dot separators are used in UI metadata.

Only the owner can edit or delete a non-system questionnaire. A shared recipient can **Dùng bộ này** or **Tạo bản sao**; they cannot edit the original. System templates are read-only and can be used or copied. The library is mock-backed with browser local storage for the prototype.

## Builder and Template Rules

The request-builder dropdown lists personal, shared and system templates in labelled groups. Selecting a template clones its questions into the request state. Editing these cloned questions changes only that request and never mutates the template in the library.

If an HR action would replace non-empty questions — selecting another template or switching to **Tự tạo bộ câu hỏi** — a discard confirmation is shown before replacement. A template is never silently overwritten.

The question editor uses icon-only type controls with the shared dark tooltip pattern:

- message icon: **Câu hỏi mở**
- ordered-scale icon: **Câu hỏi Likert**

The selected type keeps the shared selected state. Tooltip wording makes the icon action discoverable without adding persistent explanatory text.

When the questionnaire is custom, or a copied template has been edited, the builder offers **Lưu thành bộ câu hỏi**. It opens a compact modal to enter the questionnaire name, with the suggestion `[Bộ phận]_[Mục đích sử dụng]`, for example `HRBP_Khảo sát năng lực lãnh đạo`. The same modal chooses one scope: **Chỉ mình tôi**, **Toàn bộ nhóm HR**, or **Chọn người cụ thể**. The last scope opens the standard M-04 person picker for eligible HR users.

## Participant Mapping

The feedback direction is **Người cho phản hồi → Người nhận phản hồi**. The request builder displays the feedback-recipient column on the left, a dark left-pointing triangle, then the reviewer column on the right. Shared reviewer mode keeps a balanced 50–50 grid. When personalised reviewer assignment is enabled, recipients use 30% and reviewers use 70%.

The toggle **Cá nhân hóa người cho theo từng người nhận** is disabled until two recipients are selected. Its explanatory state is native to the control; no extra persistent helper copy is added. The review-confirmation modal uses the same direction and explicit column labels.

## Validation and Confirmation

Required builder fields use field-level validation: an error message appears immediately under each invalid field and focus moves to the first invalid field on submit. The existing toast can remain only as a concise summary, not the sole error treatment.

The final review remains a Review-confirmation modal. It shows a read-only request summary while the underlying form and its entered values remain intact. Closing the modal or selecting **Quay lại chỉnh sửa** preserves all draft form data.

## Visual and Component Contracts

- M-04 remains source of truth for controls, person picker, tooltip and modal tokens.
- Field label: 12.5px / 600; form input: 13px / 400; hint and inline error: 11.5px.
- Review modal footer actions: 32px high, 12px text, `12px 18px 16px` padding.
- Questionnaire sharing scope uses the existing `feedback-choice-card` two-choice/choice-card language, not bare radios or faux tabs.
- Template-derived questions retain the established navy-purple distinction; request-only custom inputs retain the neutral surface.

## Acceptance Criteria

- Editing a selected template cannot mutate the stored template.
- Replacing non-empty questions requires confirmation.
- Custom or edited copied questions can be saved as a new questionnaire with a name and sharing scope.
- Shared users can use or copy, but cannot edit/delete, the original questionnaire.
- The library’s dropdown source groups and list permissions are derived from the same model.
- Mapping and review modal both express reviewer → recipient.
- Personalisation cannot be enabled with fewer than two recipients.
- Invalid required fields get inline errors and first-error focus.
- Contract tests protect the data, permission, direction, form, modal and token rules.
