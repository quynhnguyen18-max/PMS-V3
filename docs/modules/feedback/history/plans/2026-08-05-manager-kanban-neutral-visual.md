# Manager Kanban Neutral Visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce visual noise in manager Feedback Kanban while preserving fast status recognition.

**Architecture:** Keep all lanes and cards on shared neutral surfaces and borders. Restrict semantic colors to a small dot, title text, and a very light tint in each lane header.

**Tech Stack:** Static HTML/CSS and Node.js tests.

## Global Constraints

- No status-colored lane body.
- No status-colored card border.
- Header remains the only semantic-color region.

---

### Task 1: Neutral Kanban styling

**Files:** `M-04/m04.test.js`, `M-04/index.html`

- [x] Update the test to require neutral lanes/cards and colored header dots.
- [x] Run the M-04 test and verify RED.
- [x] Implement the approved header-only semantic styling.
- [x] Run tests, parse scripts, and run `git diff --check`.
