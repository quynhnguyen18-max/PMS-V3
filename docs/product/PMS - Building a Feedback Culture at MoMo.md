# **MoMo Performance Management System (PMS) \- Building a Feedback Culture at MoMo** 

# **1\. Purpose**

This document outlines the proposed concept, business rules and functional scope for the **Continuous Feedback** capability within MoMo Performance Management System (PMS).

The objective of this document is **to align on product direction and business logic before moving into UI/UX design and prototype development**.

This document intentionally focuses on **what the product should do** and **why**, rather than how the interface should look.

# **2\. Background**

Today, feedback at MoMo is primarily exchanged during Mid-Year Review (MYR) and Year-End Review (YER). While these formal review cycles remain important, they do not fully support continuous learning throughout the year.

As a result:

* Feedback is often delayed until formal review cycles.

* Positive contributions are not consistently recognized.

* Valuable coaching conversations are not documented.

* Managers rely on memory instead of evidence during performance discussions.

* Employees have limited opportunities to proactively request feedback.

To strengthen MoMo's performance and feedback culture, feedback should become an ongoing habit rather than a twice-a-year activity.

---

# **3\. Product Vision**

**Enable every MoMoer to continuously ask for, share and receive meaningful feedback as part of everyday work.**

Continuous Feedback aims to:

* Encourage timely coaching

* Reinforce positive behaviors

* Support continuous improvement

* Strengthen collaboration

* Create evidence for development conversations

* Build a stronger feedback culture

**Continuous Feedback is not another evaluation tool.--\> Will Adapt to Guidelines \+ Comms**

Its primary purpose is development, learning and recognition.

---

# **4\. MoMo Feedback Philosophy**

At MoMo,

**Feedback is a gift.**

Feedback is not only about identifying improvement opportunities.

Feedback also means:

* Reinforcing great behaviors

* Recognizing meaningful contributions

* Expressing appreciation

* Helping colleagues improve

Therefore, "feedback" is positioned as one unified experience that supports different intentions.

---

# **5\. Design Principles**

The product should follow five design principles.

## **Principle 1 – Keep It Simple**

Employees should not need to understand HR terminology.

The experience should be intuitive and require minimal training.

Target completion time:

**Less than one minute.**

---

## **Principle 2 – One Experience**

Employees should have one simple action:

**Share Feedback**

Instead of navigating multiple modules such as Recognition, Appreciation or Constructive Feedback.

---

## **Principle 3 – Trust by Design**

Employees should always know who can view their feedback.

Privacy must be transparent and easy to understand.

---

## **Principle 4 – Guide Rather Than Enforce**

The system should guide employees to provide quality feedback using MoMo's feedback framework instead of requiring lengthy forms.

---

## **Principle 5 – AI as a Coach**

AI should improve feedback quality while reducing writing effort.

AI supports employees but never replaces employee judgment.

---

# **6\. User Personas**

## **Employee**

Objectives

* Ask for feedback for Improve continuously

* Share feedback

* Recognize great work

* Appreciate support

---

## **Direct Manager**

Objectives

* Coach team members

* Collect additional perspectives

* Recognize achievements

* Support performance conversations

---

## **HRBP / L\&OD**

Objectives

* Run structured feedback campaigns

* Support Talent programs

* Support probation reviews

* Support leadership development

* Monitor feedback culture adoption

---

# **7\. Use Cases**

# **Use Case 1\. Request Feedback (Employee)**

### **Purpose**

Enable employees to proactively request feedback from colleagues to support continuous learning and self-development.

### **Initiator**

Employee

### **Typical Scenarios**

* Request feedback after a customer presentation.

* Request feedback after completing a project.

* Request feedback following a workshop or meeting.

### **Business Rules**

* One request can be sent to one or multiple reviewers.

* Each reviewer receives an individual request.

* Reviewers submit feedback independently.

* Reviewers cannot view each other's responses.

* Employees can monitor response status and send reminders.

---

# **Use Case 2\. Give Feedback**

# **Use Case 2 – Share Feedback**

### **Business Purpose**

Enable employees to proactively share meaningful feedback with colleagues, reinforcing great work, expressing appreciation and supporting continuous improvement as part of everyday work.

### **Initiator**

Employee

### **Typical Scenarios**

* Recognize a colleague for demonstrating great ownership during a project.

* Thank a teammate for providing timely support.

* Share suggestions after a meeting or customer presentation.

* Celebrate achievements while providing ideas for future improvement.

  ---

  ### **Feedback Experience**

Employees simply write their feedback naturally without selecting a feedback category.

The feedback may contain one or more elements, including:

* **Recognition** – acknowledge outstanding behaviors or achievements.

* **Suggestion** – provide constructive ideas for improvement.

* **Appreciation** – express gratitude or thanks.

A single feedback can include any combination of these elements.

---

### **AI Writing Assistant**

After the employee drafts their feedback, AI analyzes the content and provides intelligent assistance.

Depending on the content, AI can:

* Detect recognition, suggestions and appreciation.

* Recommend the appropriate feedback structure:

  * **STAR** for recognition.

  * **STARAR** for constructive suggestions.

* Improve clarity, tone and professionalism.

* Suggest a relevant **MoMo Core Value** when recognition is identified.

* Rewrite or enhance the message while preserving the employee's original intent.

The employee reviews, edits and approves the final feedback before sending.

---

### **Business Rules**

* Employees are not required to select a feedback type before writing.

* One feedback can contain recognition, appreciation and constructive suggestions together.

* AI provides guidance but does not change the content automatically.

* The sender chooses the visibility setting:

  * **Receiver Only** *(default)*

  * **Receiver \+ Receiver's Manager**

* Only shared feedback can be referenced as evidence in future performance conversations.

  ---

  ### **Example**

**Employee draft**

> Thank you for staying late to support the production release. Your ownership helped the team meet the deadline. One suggestion for future releases is to involve QA earlier so everyone can prepare in advance.

**AI suggestions**

* Structure the recognition using the **STAR** model.

* Structure the improvement suggestion using the **STARAR** model.

* Recommend the **Ownership** Core Value for recognition.

* 

---

# **Use Case 3\. Request Feedback (Manager)**

### **Purpose**

Enable managers to collect feedback for one or multiple direct reports to support coaching, development and performance discussions.

### **Initiator**

Direct Manager

### **Typical Scenarios**

* Quarterly Coaching

* Performance Discussion

* Development Planning

* Promotion Readiness

* Project Review

### **Supported Request Types**

#### **Scenario A – One Employee**

Manager requests feedback for one employee from multiple reviewers.

Example

```
Employee A

← Reviewer 1
← Reviewer 2
← Reviewer 3
```

---

#### **Scenario B – Multiple Employees**

Manager requests feedback for multiple employees from one or multiple reviewers.

Example

```
Employees

• Alice
• Ben
• Cindy

Reviewers

• Product Owner
• Tech Lead

System automatically creates individual feedback requests.
```

### **Business Rules**

* Managers can only request feedback for direct reports.

* One request can include multiple employees.

* One request can include multiple reviewers.

* The system automatically creates individual feedback requests for every employee-reviewer combination.

* Managers can monitor completion status by employee and by request.

* AI generates a summary after all feedback has been submitted.

---

# **Use Case 4\. Team Feedback** 

### **Purpose**

Enable project teams to exchange feedback after completing a project to encourage collaboration and continuous improvement.

### **Initiator**

Project Manager / Team Lead

### **Typical Scenarios**

* Project retrospective

* Cross-functional initiatives

* Sprint retrospective

* Taskforce review

### **Business Rules**

* Team members can both give and receive feedback.

* Feedback remains individual.

* AI summarizes team strengths and improvement opportunities.

* Team summary is available to the Project Manager.

---

# **Use Case 5\. Feedback Programs**

### **Purpose**

Enable HRBP and L\&OD to launch structured feedback processes for talent and performance management.

### **Initiator**

HRBP / L\&OD

### **Typical Programs**

* Promotion Assessment

* Mid-Year Review Support

* Year-End Review Support

* Leadership Development

* Succession Planning

* 360 Feedback

### **Configuration**

HR can configure:

* Participants (Feedback Receivers)

* Reviewers (Feedback Givers)

* Question templates

* Rating scales

* Due dates

* Reminder schedules

* Visibility settings

* Anonymous or identified responses (where applicable)

### **Supported Question Types**

* Free-text responses

* Rating scales

* Competency ratings

* Core Value ratings

* STAR / STARAR guided responses

### **Outputs**

The system provides:

* Individual feedback responses

* Completion tracking

* Rating summaries

* Comment summaries

* AI-generated themes and insights

---

# **Summary**

| Use Case | Initiator | Primary Objective |
| ----- | ----- | ----- |
| **1\. Request Feedback (Employee)** | Employee | Request feedback for personal learning and development |
| **2\. Give Feedback** | Employee | Share recognition, suggestions or appreciation with colleagues |
| **3\. Request Feedback (Manager)** | Direct Manager | Collect feedback for one or multiple direct reports from one or multiple reviewers |
| **4\. Team Feedback** *(Future)* | Project Manager / Team Lead | Facilitate team feedback after projects or major initiatives |
| **5\. Feedback Programs** | HRBP / L\&OD | Launch structured feedback initiatives for talent and performance processes |

---

# **8\. Functional Scope**

The capability consists of two core experiences.

---

## **Capability 1**

### **Request Feedback**

Supported initiators

* Employee (Self)

* Direct Manager (Team Member)

* HRBP / L\&OD (Program Participant)

Main functions

* Select employee

* Select reviewers

* Provide context

* Send request

* Track response status

* Send reminders

* Close request

---

## **Capability 2**

### **Give Feedback**

Employees share feedback using one consistent experience.

The employee selects one of **three intentions**.

### **👏 Great Job**

Purpose

Reinforce behaviors that should continue.

Examples

* Excellent collaboration

* Great ownership

* Outstanding customer focus

Feedback Framework

**STAR**

Situation

Task

Action

Result

Optional

Recognize the behavior using a MoMo Core Value Badge.

---

### **💡 Suggestion**

Purpose

Help someone improve.

Examples

* Suggest improvement

* Share observations

* Recommend different approaches

Feedback Framework

**STARAR**

Situation

Task

Action

Result

Alternative

Expected Result

---

### **❤️ Thank You**

Purpose

Express gratitude.

Examples

* Appreciate support

* Thank someone

* Acknowledge contributions

Framework

Free writing

AI may improve wording only.

---

# **9\. AI Writing Coach**

One of the key product differentiators is AI-assisted feedback writing.

Employees should not be expected to write perfect STAR or STARAR feedback.

Instead, they can write naturally.

Example

Raw note

> Great ownership today.

AI transforms it into a structured STAR draft.

---

Raw note

> Maybe involve QA earlier.

AI transforms it into a STARAR draft.

---

Employees may

* Accept

* Edit

* Regenerate

* Keep original

AI never sends feedback automatically.

Employees remain the final author.

---

# **10\. Recognition Through MoMo Core Values**

When users choose **👏 Great Job**, they may optionally recognize the demonstrated behavior using an official MoMo Core Value.

Purpose

* Reinforce desired behaviors

* Strengthen organizational culture

* Connect everyday feedback with company values

Example

Recognize this behavior with a Core Value

* Ownership

* Customer First

* One Team

* Innovation

* Growth Mindset

(To be updated with official MoMo Core Values.)

---

# **11\. Privacy & Sharing Rules**

Privacy is fundamental to encourage honest and meaningful feedback.

When sharing feedback, employees choose who can view it.

### **Option 1 (Default)**

Receiver Only

Visible to

* Sender

* Receiver

---

### **Option 2**

Receiver \+ Receiver's Manager

Visible to

* Sender

* Receiver

* Receiver's Direct Manager

Managers cannot access private feedback unless the sender intentionally chooses to share it or the feedback is collected through a manager- or HR-initiated request.

---

# **12\. Business Rules**

| Scenario | Visibility |
| ----- | ----- |
| Employee shares feedback | Receiver Only (Default) |
| Employee shares with Manager | Receiver \+ Manager |
| Manager requests feedback | Employee \+ Manager |
| HR Program Feedback | Configurable based on program settings |

---

Positive Feedback

Supports optional Core Value Badge.

---

Suggestion

Uses STARAR guidance.

---

Thank You

Simple appreciation.

No structured model required.

---

# **13\. Activity**

Employees can access one unified activity timeline.

The timeline includes

* Feedback shared

* Feedback received

* Feedback requests

* Request responses

There is no separate Recognition module.

Everything is organized under Continuous Feedback.

---

# **14\. Performance Management Integration**

Continuous Feedback complements—not replaces—the existing Performance Management process.

Relationship

Continuous Feedback

↓

Evidence Library

↓

Check-ins

↓

Mid-Year Review

↓

Year-End Review

Employees may choose which shared feedback they want to reference during performance discussions.

Private feedback remains private.

---

# **15\. Manager Experience**

Managers can

* Request feedback for direct reports

* View feedback intentionally shared with them

* Track feedback request completion

* Support evidence-based coaching conversations

Managers cannot view employees' private feedback.

---

# **16\. HRBP / L\&OD Experience**

HR can

* Launch structured feedback campaigns

* Define reviewers

* Configure visibility

* Monitor completion

* Track response rates

Example campaigns

* Talent X

* Probation

* Promotion

* Leadership Programs

---

# **17\. Success Measures**

## **Product Adoption**

* % Employees requesting feedback

* % Employees sharing feedback

* Response rate

* Average response time

---

## **User Experience**

* Average completion time

* AI adoption rate

* User satisfaction

---

## **Culture Impact**

* Increase continuous coaching conversations

* Increase recognition aligned to MoMo Core Values

* Improve evidence-based performance discussions

* Strengthen feedback culture

---

# **18\. Open Discussion Points**

The following items require business alignment before UI design and development begins.

| Topic | Proposed Recommendation |
| :---- | :---- |
| Product name | Continuous Feedback |
| Core user actions | Request Feedback & Share Feedback |
| Feedback intentions | Great Job, Suggestion, Thank You |
| Positive feedback framework | STAR |
| Development feedback framework | STAR-AR |
| AI writing assistant | Included in Phase 1 |
| Recognition badge | Available only for "Great Job" and mapped to MoMo Core Values |
| Privacy options | Receiver Only (Default) / Receiver \+ Receiver's Manager |
| Manager feedback request | Supported for direct reports |
| HR feedback campaigns | Supported through configurable templates |
| Performance integration | Feedback serves as supporting evidence, not an evaluation score |

# **19\. Proposed Next Steps**

1. Align business concept and product principles.

2. Confirm business rules and permissions.

3. Define detailed functional requirements (PRD).

4. Design user flows and wireframes.

5. Build clickable prototype for business validation.

6. Prioritize Phase 1 MVP and implementation roadmap.

---

## **Appendix – Product Positioning**

**Continuous Feedback is not a replacement for Performance Review.**

It is a continuous capability that enables employees, managers and HR to exchange timely, structured and meaningful feedback throughout the year.

By embedding MoMo's STAR and STARAR models, AI writing assistance, privacy-by-design principles and Core Value recognition into one simple experience, the product aims to build a sustainable feedback culture while providing richer evidence for coaching, talent development and performance conversations.

