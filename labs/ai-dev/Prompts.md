# Exercise 0 — Demo Prompts

---

## Section 1 — Orient

Three prompts. Goal: show what the agent knows and what it can do before
you ask it to build anything.

---

### O1 — What skills do you have?

> **What this demonstrates**: The agent surfaces its own capabilities from the
> project config. Students see that skills are project-level tools, not global.

```
What skills do you have available to help with development on this project?
```

---

### O2 — How does an existing block work?

> **What this demonstrates**: The agent as a pair programmer on an unfamiliar
> codebase. It reads and explains code it didn't write. Highly relatable use case.

```
Explain how the hero block works. What structure does an author create,
and what does the JavaScript do to it?
```

---

### O3 — Research before you build

> **What this demonstrates**: The agent using a research skill proactively.
> Before writing anything, it checks whether reference implementations exist.
> Shows that good agents don't start from scratch by default.

```
Before we build anything, check the block collection for existing schedule
or speakers block implementations we could use as a reference or starting point.
```

---

## Section 2 — Build

Two blocks. Same CDD workflow. Different levels of control.

---

### B1 — Speakers block (one-shot)

> **What this demonstrates**: Full CDD workflow handed off completely.
> No approval gate — the agent decides the content model, creates test content,
> builds the block, and validates. You evaluate the output at the end.

```
Add a speakers block to this site. Authors will use it to showcase event
speakers — photo, name, title, and a short bio. Build it.
```

---

### B2 — Schedule block (plan mode)

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

## Section 3 — Wrap-up

One prompt. The agent reviews both blocks it built against project conventions.

---

### W1 — Code review

> **What this demonstrates**: The agent as code reviewer. It looks at its own
> output critically — catches things it missed, flags inconsistencies between
> the two blocks, and checks against AGENTS.md conventions.

```
Review the code you wrote for both the speakers and schedule blocks.
Check against the project conventions in AGENTS.md. Flag any issues,
inconsistencies between the two blocks, or anything you'd do differently.
Fix what you find.
```
