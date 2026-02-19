# Exercise 0: AI-Assisted Development

**Format**: Instructor demo — students watch and follow along
**Duration**: 65 minutes
**Day**: Day 1 (standalone, before lab exercises)
**Assumed AI experience**: None

---

## Goal

Show how AI agents accelerate real EDS development. Four sections: start with
the Experience Modernization Agent as an accessible entry point, orient the
agent in a CLI workflow, build two blocks with two different trust levels,
then have the agent review its own work.

Students leave with a mental model for how to use AI tools effectively —
which primes them for Day 2 labs.

**What we show**:
- Experience Modernization Agent — hosted AI, quick demo
- `speakers` block — one-shot (agent runs CDD end to end autonomously)
- `schedule` block — plan mode (you review before anything is written)

Blocks are demo only, not merged.

---

## Setup (Before Session Starts)

- [ ] Claude Code open in the `nycmasterclass` project root
- [ ] Dev server running: `aem up --html-folder drafts`
- [ ] `localhost:3000` open in browser
- [ ] `labs/ai-dev/Prompts.md` open in a second editor window for copy-paste
- [ ] Experience Modernization Agent open in a browser tab
- [ ] Slides loaded and ready
- [ ] Terminal visible alongside editor (students should see commands run)

> **Tip**: Do a full dry run on the demo machine before the session. Agent output
> varies — know roughly what to expect so you can narrate without surprises.

---

## Timing Overview

```
0:00–0:10   Slides          Foundational concepts (5 slides)
0:10–0:17   Exp Mod Agent   Hosted AI demo
0:17–0:27   Orient          O1: skills / O2: explain a block / O3: research
0:27–0:55   Build           B1: speakers one-shot / B2: schedule plan mode
0:55–1:02   Wrap-up         W1: agent reviews its own code + IBM slide
1:02–1:05   Discussion      Key takeaways, preview Day 2
```

---

## Part 1 — Slides (0:00–0:10)

*10 minutes. Deck is instructor-created — see TODO.md for slide content and layout.*

**Slide 1 — AI Agents and Edge Delivery**
> "Most web stacks require the agent to understand your framework, your build
> system, your abstractions. EDS doesn't have those layers. The code the agent
> writes is the code that runs. And the same simplicity that makes it easy for
> agents to build also makes it easy for AI search engines to consume."

**Slide 2 — How coding agents work**
> "It's not magic. The model decides what to do, a tool does it, the result
> comes back, and it decides again. That's the loop. Built-in tools cover the
> basics — MCP lets you plug in anything else, like a browser or GitHub.
> And critically — no memory. Every conversation starts empty. Which raises
> the question..."

**Slide 3 — Context is everything**
> "No memory — so how do you make sure it knows what it needs to? You're
> managing an attention budget. AGENTS.md is what the agent always knows.
> Skills activate when relevant. Prompts are what you say right now. Get the
> balance right and the output is good. Dump everything in and it drifts."

**Slide 4 — The Edge Delivery Agent Starter Kit**
> "You don't start from scratch. The boilerplate ships with AGENTS.md. Adobe
> maintains a skills repo you install. There are MCP servers already built
> for EDS. And if you want a fully hosted experience, there's the Experience
> Modernization Agent — which is where we'll start the demo."

**Slide 5 — What we'll build**
> Walk through the demo agenda. Brief — they'll see it all live in a moment.

---

## Part 2 — Experience Modernization Agent (0:10–0:17)

*Switch to the Experience Modernization Agent in the browser.*

Quick show-and-tell of the hosted agent. This is the accessible entry point —
no CLI, no local setup. Show site creation, migration, or block development
(whichever is most impressive in the time available).

> "This is the fully hosted option. Adobe built an agent that handles site
> creation, migration, and block development in one environment. You don't
> need a terminal. You don't need to configure anything."

After a brief walkthrough (~5 min):
> "That's the easy on-ramp. Now let's see the developer workflow — more
> control, more flexibility, same underlying concepts."

**Key teaching moment**: There's a spectrum of AI tooling — from hosted and
guided to CLI and full control. The concepts (context, skills, tools) are the
same across both.

---

## Part 3 — Orient (0:17–0:27)

*Switch to Claude Code. Keep Prompts.md visible.*

The orient section has nothing to do with building yet. It's about showing the
audience what the agent knows about this project and what it can do.
Three prompts, each landing a different point.

---

### O1 — What skills are available? (0:17–0:21)

**Copy from Prompts.md — O1**

While it runs (~1 min):
> "I'm not asking it to do anything yet. I'm asking what it can do."

After output:
> Point out the skills list. Specifically call out:
> - `content-driven-development` — "this is the workflow we'll use to build"
> - `block-collection-and-party` — "we'll use this in a moment to research first"
> - `docs-search` — "it can go read the AEM documentation"
>
> "These aren't global tools. They live in this project. A different project
> would have different skills. The agent adapts to where it's working."

**Key teaching moment**: Skills are project-level context, not a fixed toolbox.

---

### O2 — How does an existing block work? (0:21–0:24)

**Copy from Prompts.md — O2**

While it runs (~1 min):
> "Now let's see if it can explain code it didn't write."

After output:
> Walk through the explanation briefly. Point out that it found the JS file,
> read it, and described both the author-facing structure and the decoration logic.
>
> "This is one of the most underrated uses of AI on a project. New developer,
> unfamiliar codebase — instead of reading through files for 20 minutes,
> you just ask."

**Key teaching moment**: AI as a pair programmer for onboarding and code exploration.

---

### O3 — Research before you build (0:24–0:27)

**Copy from Prompts.md — O3**

While it runs (~2 min, uses the block-collection-and-party skill):
> "Before we build anything, let's see if there's prior art. Good agents
> don't start from scratch by default."

After output:
> Whatever it finds — reference implementations, patterns, nothing — the point
> is that it looked. Discuss briefly what it surfaced and whether you'd use it.
>
> "This is the research step most developers skip. The agent just did it in
> two minutes."

**Key teaching moment**: Research is part of the workflow, not a luxury.

---

## Part 4 — Build (0:27–0:55)

Two blocks. The CDD skill runs both times — the difference is how much control
you keep.

---

### B1 — Speakers block, one-shot (0:27–0:39)

**Copy from Prompts.md — B1**

Before sending:
> "First block. I'm going to give it the goal and step back. It will decide
> the content model, create test content, write the JS and CSS, and validate —
> without stopping to ask me."

While it runs (~8–10 min):
> "No approval gate. Watch what it decides on its own."

Take light Q&A or let it run. Don't narrate every step — save the phase-by-phase
commentary for the schedule block where students can see the plan first.

After output — open `localhost:3000/drafts/speakers`:
> "There it is. Full CDD workflow — I handed it off and it delivered.
> My job now is to decide if this is right."

Evaluate out loud. Point out one thing you like and one thing you'd question.
Don't fix anything yet — save corrections for the review section.

---

### B2 — Schedule block, plan mode (0:39–0:55)

**Copy from Prompts.md — B2**

Before sending:
> "Same CDD workflow. Different approach. This time I want to see the plan
> before anything gets written."

**Phase: plan output** (~3–5 min to produce)

> "It's planning, not coding. No files written yet."

When the plan lands, read it with the room:
> "Content model, test content, JS approach, CSS approach. This is the full
> picture before a single file exists."

Ask the audience:
> "Does this content model make sense for how authors would work?
> What would you change?"

Make at least one decision out loud — push back on something or accept with a
note. This is the most important moment in the demo. Students need to see you
evaluating, not rubber-stamping.

Then approve and let it proceed.

**Key teaching moment**: Plan mode gives you a review gate before any code
exists. Use it when the task is complex, unfamiliar, or when you want to steer
before you're reacting to existing output.

**Phase: test content** (agent creates `drafts/schedule.html`)

> "Content before code. Same principle as B1 — the block decorates what's
> already there. The difference is this time I knew what was coming."

Open `localhost:3000/drafts/schedule`:
> "Unstyled table. Correct. This is what tomorrow's Exercise 1 looks like before
> your JavaScript touches it."

**Phase: implementation** (~5–8 min — use for Q&A)

Good questions to field:
- *"When would you use plan mode vs one-shot in real work?"*
  → Complex tasks, unfamiliar codebases, anything where the content model decision is non-obvious.
- *"What if you don't like the plan?"*
  → Tell it. It'll revise. That's the point of the gate.
- *"Does this work in Cursor?"*
  → Yes. Same AGENTS.md, same skills, same prompts.

After implementation — refresh `localhost:3000/drafts/schedule`:
> "Same outcome as the speakers block. Different experience getting here —
> I knew the plan before the code existed."

**Phase: validation and lint**

The CDD skill includes self-review. Call it out when it happens:
> "It's validating without being asked. That's the skill enforcing the
> full workflow — including the parts people usually skip."

---

## Part 5 — Wrap-up (0:55–1:02)

### W1 — Agent reviews its own code

**Copy from Prompts.md — W1**

Before sending:
> "Last prompt. We're going to ask it to look at both blocks together and
> review its own work."

While it runs (~2–3 min):
> "This is the step that closes the loop. It built both blocks in different
> sessions — now it's reviewing them as a pair."

After output:
> Whatever it flags — inconsistencies, convention issues, things it'd do
> differently — highlight them.
>
> "It found things. That's normal. The question is whether you asked it to look."
>
> If it fixes something, refresh the browser.
>
> "This is also how you use AI for code review on a team. You don't have to
> ask it to review code you wrote yourself — you can ask it to review code
> anyone wrote."

### IBM Quote — Slide 6

*Advance to the wrap-up slide (IBM quote).*

> "A computer can never be held accountable, therefore a computer must never
> make a management decision." — IBM, 1979
>
> "Everything you watched — the agent orienting, building blocks, reviewing
> its own code — it did all of that. But at every step, a human decided
> whether to proceed. That's the model. That doesn't change."

---

## Discussion (1:02–1:05)

> "Four sections. Here's what each one showed:"
>
> - **Experience Modernization Agent**: the accessible entry point. Hosted,
>   guided, no setup required.
>
> - **Orient**: the agent knows your project, can explain existing code, and
>   can research before building. You didn't have to teach it any of that.
>
> - **Build**: same CDD workflow both times. One-shot when you trust the
>   process and want speed. Plan mode when you want a review gate before
>   any code exists. Right choice depends on the task, not the tool.
>
> - **Review**: the agent can evaluate its own output critically. Ask it to.
>
> "Tomorrow you'll do this workflow manually — content model, test content,
> JS, CSS, validate. That's intentional. You need to understand the steps
> before you delegate them. Today was a preview of where it goes."

---

## If Things Go Wrong

**Plan mode skips the plan and starts coding**
> Interrupt: "Stop — I asked for a plan first. Show me the plan before writing any files."
> Good teaching moment: the prompt wording matters.

**Agent produces broken or wrong output**
> Don't fix it manually. Say: "This happens. Watch how I recover."
> Use a follow-up from Prompts.md.

**Dev server not serving draft files**
> Verify `--html-folder drafts` flag. Restart: `aem up --html-folder drafts`

**Agent is slow or hanging**
> Use Q&A time. After 3+ minutes with no output, cancel with Escape and retry
> with a more specific prompt.

**Block collection research returns nothing useful**
> That's fine — say "no prior art, we build from scratch" and move on.
> The point was that it looked.

---

## Key Takeaways

| Theme | Line to use |
|-------|-------------|
| Stack | "The code the agent writes is the code that runs" |
| Context | "You're managing an attention budget" |
| No memory | "Every conversation starts from scratch" |
| Starter kit | "You don't start from scratch — the tooling exists" |
| Spectrum | "From hosted agent to full CLI control — same concepts" |
| Research | "Good agents don't start from scratch by default" |
| CDD | "Content model before code — always" |
| Plan mode | "A review gate before any code exists" |
| One-shot | "Hand it off when you trust the workflow and want speed" |
| Review | "Ask it to evaluate its own output — it will" |
| Accountability | "AI builds. You decide." |
