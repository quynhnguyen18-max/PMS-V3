# Feedback Reminder Cooldown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent manual reminder spam while showing managers and employees when manual and automatic reminders were sent or scheduled.

**Architecture:** Extend each pending assignment/reviewer with a manual reminder history and derive the automatic reminder date as three days before the due date. A shared 24-hour eligibility rule controls individual and bulk reminder actions; UI surfaces the latest manual reminder and automatic reminder timing without adding a new panel.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, Node.js built-in test runner.

## Global Constraints

- One manual reminder per recipient in any rolling 24-hour window.
- Manual reminders are unlimited until the request deadline, subject to the 24-hour cooldown.
- Automatic reminders do not block manual reminders.
- Completed, past-deadline, or `no_response` requests cannot be reminded.
- Do not commit until explicitly requested.

---

### Task 1: Reminder model

**Files:**
- Modify: `M-04/manager-request-model.js`
- Test: `M-04/m04.test.js`

- [ ] Add failing tests for rolling 24-hour cooldown, deadline lock, automatic reminder date, and manual reminder history.
- [ ] Run `node M-04/m04.test.js` and confirm the new tests fail for missing behavior.
- [ ] Implement `automaticReminderDate`, `canRemindAssignment`, and timestamped reminder history.
- [ ] Run the manager tests and confirm they pass.

### Task 2: Manager reminder UI

**Files:**
- Modify: `M-04/request-detail.html`
- Test: `M-04/m04.test.js`

- [ ] Add failing UI assertions for automatic reminder timing, latest manual reminder, and cooldown messaging.
- [ ] Render reminder metadata per pending reviewer and in ticket summary.
- [ ] Disable only recipients inside the rolling cooldown; bulk remind skips ineligible recipients.
- [ ] Run the manager tests.

### Task 3: Employee request UI

**Files:**
- Modify: `E-04/index.html`
- Test: `E-04/feedback-model.test.js`

- [ ] Add failing UI assertions for 24-hour cooldown and both reminder timestamps.
- [ ] Add timestamped reviewer reminder history and automatic reminder metadata.
- [ ] Keep reminders available until the deadline, then lock them.
- [ ] Run employee and manager tests, then `git diff --check`.
