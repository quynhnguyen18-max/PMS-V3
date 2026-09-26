# Manager Request Role Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clarify when managers should request feedback and make giver/receiver roles unmistakable in the request dialog.

**Architecture:** Add a neutral guidance infobox below the dialog header. Group the two people pickers into a responsive direction-flow component ordered `Người cho phản hồi → Nhân viên nhận phản hồi`, while preserving existing IDs and JavaScript behavior.

**Tech Stack:** Static HTML/CSS/JavaScript and Node.js tests.

## Global Constraints

- Feedback supports coaching and employee development; it is not an evaluation tool.
- Use the user-approved infobox wording verbatim.
- Desktop uses two columns; mobile stacks giver before receiver and rotates the direction cue downward.

---

### Task 1: Tests and implementation

**Files:** `M-04/m04.test.js`, `M-04/index.html`, `FEEDBACK_PLAN.md`

- [x] Add failing tests for wording, role labels, ordering, direction cue, and responsive behavior.
- [x] Run the M-04 suite and verify RED.
- [x] Add the infobox and role-flow layout without changing picker IDs or form logic.
- [x] Record the product principle in `FEEDBACK_PLAN.md`.
- [x] Run tests, parse scripts, and run `git diff --check`.
