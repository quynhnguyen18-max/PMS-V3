# Feedback Tooltip System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize business-information tooltips across Feedback and fix the manager Split View employee tooltip.

**Architecture:** Use one visual contract—dark background, white 12px text, 6px radius—implemented with page-local `.pms-tooltip` markup because the prototype screens are standalone HTML files. Native titles remain only for utility icons; employee identity, organization, badge, and visibility information use the custom component.

**Tech Stack:** Static HTML/CSS/JavaScript and Node.js tests.

## Global Constraints

- Employee header tooltip content is `Phòng ban - Vị trí`.
- Business-information tooltips use custom markup, not browser-native `title`.
- Utility icon accessibility keeps `aria-label`; visual tooltip migration is outside this focused change.

---

### Task 1: Regression tests and Split View header

**Files:** `M-04/m04.test.js`, `M-04/index.html`

- [x] Add failing assertions for custom employee tooltip markup and department-position content.
- [x] Run `node M-04/m04.test.js` and verify the expected failure.
- [x] Implement `.pms-tooltip` and render the employee metadata into its child element.
- [x] Run the M-04 suite and verify green.

### Task 2: Design-system rule and Feedback audit

**Files:** `DESIGN-SYSTEM.md`, `design-system/index.html`, `M-04/manager-feedback-data.js`, `M-04/feedback-detail.html`, `M-04/request-detail.html`, `E-04/index.html`

- [x] Document tooltip content, appearance, placement, interaction, and accessibility rules.
- [x] Add a tooltip specimen to the design-system page.
- [x] Replace native business-data titles found in Feedback with custom tooltip markup where the page displays that information.
- [x] Keep E-04’s existing custom tooltip behavior and align its font size/radius tokens with the standard.

### Task 3: Verification

- [x] Run E-04 and M-04 tests.
- [x] Parse inline scripts in all changed Feedback HTML files.
- [x] Run `git diff --check`.
