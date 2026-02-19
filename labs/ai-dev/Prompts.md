# AI-Assisted Development — Prompts

---

## Part 2 — Orient

Three prompts. Goal: show what the agent knows and what it can do before
you ask it to build anything.

---

### 2.1 — What do you know about this project?

> **What this demonstrates**: The agent shows genuine project awareness — tech
> stack, file structure, conventions — and surfaces available skills. Students
> see that the agent adapts to where it's working, not just generic AI output.

```
What do you know about this project and what tools do you have to help me
work on it?
```

---

### 2.2 — Research before you build

> **What this demonstrates**: The agent using a research skill proactively.
> Before writing anything, it checks whether reference implementations exist.
> Shows that good agents don't start from scratch by default.

```
I need to build a speakers block and a schedule block for this site.
What's already out there that we can borrow or steal as a starting point?
```

---

### 2.3 — Code comprehension + documentation

> **What this demonstrates**: The agent combining local code reading with
> external documentation. It tours the project's blocks, then checks AEM docs
> to identify gaps — pulling from multiple sources without being told which to use.

```
Give me a quick tour of the blocks in this project. Then check the AEM
docs — what best practices should we be following that we're not? Link me
to the relevant documentation.
```

---

## Part 3 — Build

Two blocks. Same CDD workflow. Different levels of control.

---

### 3.1 — Speakers block (one-shot)

> **What this demonstrates**: Full CDD workflow handed off completely.
> No approval gate — the agent decides the content model, creates test content,
> builds the block, and validates. You evaluate the output at the end.

```
Add a speakers block to this site. Authors will use it to showcase event
speakers — photo, name, title, and a short bio. Build it.
```

---

### 3.2 — Schedule block (plan mode)

> **What this demonstrates**: Same CDD workflow with a review gate.
> The agent shows you the content model and approach before writing a single file.
> You evaluate, steer if needed, then approve.

```
I want to add a schedule block to this site. Authors should be able to display
the day's agenda — time slots, session titles, speakers, and a track or room.

Make a plan first. Show me the content model, the test content you'll create,
and your approach to the JS and CSS. Wait for my approval before writing any code.
```

---

### Steering follow-ups (use if needed)

**If something looks wrong:**
```
That's not quite right — [describe the issue]. Fix it.
```

**If you want to show course correction mid-plan:**
```
I want to change the content model — [describe the change]. Update your plan
and show me the revised approach before proceeding.
```

**If the agent skips the plan gate:**
```
Stop — I asked for a plan first. Show me the plan before writing any files.
```

---

## Part 4 — Wrap-up

One prompt. The agent reviews both blocks it built against project conventions.

---

### 4.1 — Code review

> **What this demonstrates**: The agent as code reviewer. It looks at its own
> output critically — catches things it missed, flags inconsistencies between
> the two blocks, and checks against AGENTS.md conventions.

```
Review the code you wrote for both the speakers and schedule blocks.
Check against the project conventions in AGENTS.md. Flag any issues,
inconsistencies between the two blocks, or anything you'd do differently.
Fix what you find.
```
