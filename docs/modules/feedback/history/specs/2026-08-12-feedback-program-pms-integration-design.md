# Feedback Programs - PMS V3 integration and H-06 visual alignment

## Decision

H-06 is the HR detail view of a structured feedback program. It must reuse the visual hierarchy, layout, components and tokens of `M-04/request-detail.html`, rather than introduce a separate detail-screen language.

The PMS V3 sidebar keeps one menu item: `Phản hồi`. It does not gain a nested feedback submenu. The selected role decides the entry screen:

| Role | Feedback entry | Purpose |
|---|---|---|
| Nhân viên | `E-04/index.html` | Personal feedback and personal requests |
| Quản lý | `M-04/index.html` | Employee feedback and manager-created requests |
| HR | `H-05/index.html` | Structured feedback programs |

`H-06/index.html` remains a detail route from H-05, not a sidebar item.

## H-06 visual source of truth

The source is `M-04/request-detail.html`.

- Use the same PMS page shell and left sidebar; remove H-06's standalone top bar.
- Use the same `page`, breadcrumb, header and compact return button hierarchy.
- Use the same three-column detail grid: employee rail `240px`, flexible content pane, ticket summary `280px`.
- Use the same desktop height, panel borders, overflow model and responsive breakpoints.
- Use the same rail item, avatar, selected brand indicator, employee identity, tooltip, type scale and spacing.
- Use `pane-head`, badge summary, AI Summary, shared question and conversational question-answer pattern from M-04.
- Use `ticket-summary`, progress bar, summary rows and compact outline reminder CTA from M-04. The panel stays neutral; semantic color is used only for decision-relevant indicators.

H-06 keeps only these HR-program differences:

- Left rail lists all program participants, sorted with incomplete participants before complete participants; within incomplete participants, lower answer ratio comes first.
- Center pane shows the selected employee's feedback, pending reviewers and evidence-gated AI Summary.
- Right summary describes program scope, response progress and eligible reminder action.
- The program-level status and total response ratio appear once in the page header. The same fact is not repeated to fill a panel.

## PMS navigation contract

The role switch contains `Nhân viên`, `Quản lý` and `HR` in the review prototype.

- Selecting a role takes the reviewer to that role's Feedback entry route.
- `Phản hồi` remains the active sidebar item inside all three entry routes.
- H-05 routes non-draft programs to H-06 with the program id.
- H-06 return navigation goes back to H-05 without creating another navigation level.
- Existing employee and manager links remain unchanged outside their Feedback entry route.

## Shared system rules

- `M-04/request-detail.html` is the shared visual source for feedback detail screens using a left rail, content pane and right summary.
- Use Public Sans and the established Feedback token/type scale.
- Use ` - ` for composed metadata; do not use `.` or `·` as separators.
- One fact has one primary location per screen.
- Use the shared black-background, white-text tooltip component with keyboard focus support.
- Feedback is a development and coaching tool, not an evaluation or ranking tool.

## Verification

- Static regression tests assert that H-06 shares M-04 layout/component class contracts and does not restore its standalone top bar.
- Navigation tests cover each role's Feedback entry route and H-05 to H-06 detail routing.
- H-05, H-06, E-04 and M-04 regression suites must pass.
- Desktop and responsive visual review checks rail, content pane and summary alignment with M-04.
