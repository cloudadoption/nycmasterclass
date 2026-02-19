# Exercise 0 — Instructor TODO

---

## Create Slide Deck

6 slides. Keep each one sparse — one idea, few words, maybe one visual.
These are backdrop slides, not reading material. Use Adobe template.

---

### Slide 1 — Why This Stack Works with AI

**Title**: AI Agents and Edge Delivery

**Content** (two columns — AEM... / AI Agents...):
- AEM delivers semantic HTML directly, all important content intact
- AEM uses vanilla JS and framework-less CSS — no frameworks or build steps
- AI agents can understand and surface it easily (GEO)
- AI agents can read it, write it, and run it directly

**Key takeaway** (bottom): Edge Delivery is optimized for AI agents, both in terms
of development and content delivery

**Layout**: Two-column (AEM / AI Agents) with paired rows. Key takeaway box at the
bottom. Red boxes for the pairs, green box for the takeaway.

**Talking point**: "Most web stacks require the agent to understand your framework,
your build system, your abstractions. EDS doesn't have those layers. The code the
agent writes is the code that runs. And the same simplicity that makes it easy for
agents to build also makes it easy for AI search engines to consume."

---

### Slide 2 — How Coding Agents Work

**Title**: How coding agents work

**Content**:
- Loop diagram: LLM Inference → Tool Call → Result → back to LLM
- Prompt enters the loop from outside
- Tools box (right side):
  - Built-in: Read, Write, Search, Bash
  - Extended (MCP): Browser, GitHub, Slack, etc.
- Memory callout (bottom, red box): "Agents have no memory. Every conversation
  starts from scratch."

**Layout**: Loop diagram (left/center), tools box (right), memory callout
(full-width bottom). Memory callout in red box for emphasis — it's the punchline
that leads into slide 3.

**Talking point**: "It's not magic. The model decides what to do, a tool does it,
the result comes back, and it decides again. That's the loop. Built-in tools cover
the basics — MCP lets you plug in anything else. And critically — no memory.
Every conversation starts empty. Which raises the question..."

---

### Slide 3 — Context Is Everything

**Title**: Context is everything

**Content**:
- Horizontal spectrum bar across the top:
  - Left segment (gray #8C8C8C): "Not enough context"
  - Center segment (green #4A9E6B): "Right context, right time"
  - Right segment (red #CC3333): "Too much context"
- Descriptions under each zone:
  - Left: "Generic output, misses conventions"
  - Center: "Agent follows your conventions and delivers what you asked for"
  - Right: "Agent forgets key instructions, contradicts itself"
- Sweet spot marker (triangle, dark green #2D7A4A) on the center segment
- Below: "Tools to hit the sweet spot:"
  - AGENTS.md — project context, always loaded
  - Skills — scoped instructions, loaded when needed
  - Prompts — right context for the task

**Layout**: Spectrum bar top third, zone descriptions middle, three tool items
in boxes at the bottom (ordered by persistence: always → when needed → right now).

**Talking point**: "No memory — so how do you make sure it knows what it needs to?
You're managing an attention budget. AGENTS.md is what the agent always knows.
Skills activate when relevant. Prompts are what you say right now. Get the balance
right and the output is good. Dump everything in and it drifts."

---

### Slide 4 — The Edge Delivery Agent Starter Kit

**Title**: The Edge Delivery Agent Starter Kit

**Content** (simple list with short descriptions):
- AGENTS.md — project context, ships with the boilerplate
- Agent Skills — reusable workflows for EDS development
- MCP Servers — Context7, Helix MCP, Playwright
- Experience Modernization Agent — hosted AI for site creation and migration

**Layout**: Simple list. Minimal.

**Talking point**: "You don't start from scratch. The boilerplate ships with
AGENTS.md. Adobe maintains a skills repo you install. There are MCP servers
already built for EDS. And if you want a fully hosted experience, there's the
Experience Modernization Agent — which is where we'll start the demo."

---

### Slide 5 — Demo Agenda

**Title**: What we'll build

**Content** (bullet list):
- Experience Modernization Agent
- Orient
- Build
- Review

**Layout**: Simple bullet list. Placeholder — refine as demo script is finalized.

**Talking point**: "We'll start with the hosted agent to see the accessible entry
point, then switch to Claude Code for the full developer workflow."

---

### Slide 6 — Wrap-up (IBM Quote)

**Title**: (none — let the quote stand alone)

**Content**:
> "A computer can never be held accountable, therefore a computer must never
> make a management decision."
> — IBM, 1979

Below the quote: **AI builds. You decide.**

**Layout**: Large quote centered on the slide. Attribution below. One-liner at
the bottom. Show this during the wrap-up after the agent reviews its own code.

**Talking point**: "Everything you watched — the agent orienting, building blocks,
reviewing its own code — it did all of that. But at every step, a human decided
whether to proceed. That's the model. That doesn't change."

---

## Test the Demo

Do a full dry run on the demo machine before the session. Run both blocks end to end.

**Schedule block (plan mode)**
- [ ] Prompt 2 produces a plan before writing any files — verify this behavior
- [ ] Plan includes content model, test content approach, and JS/CSS outline
- [ ] `localhost:3000/drafts/schedule` renders an unstyled table after test content is created
- [ ] Block renders correctly in browser after implementation
- [ ] Agent self-reviews and lints without being asked
- [ ] Note what, if anything, the validation catches — if nothing, consider planting a minor
      issue (e.g., a generic CSS class name) so the teaching moment lands

**Speakers block (one-shot)**
- [ ] Prompt 3 runs end to end without pausing for approval
- [ ] `localhost:3000/drafts/speakers` renders the block correctly
- [ ] Lint passes

**After dry run**
- [ ] Delete `drafts/schedule.html`, `drafts/speakers.html`
- [ ] Delete `blocks/schedule/`, `blocks/speakers/`
- [ ] Confirm clean working state before the session

---

## Setup Requirements

### For the demo machine

- [ ] Claude Code installed and authenticated (`claude` in terminal works)
- [ ] Node.js v18+ installed
- [ ] AEM CLI installed globally (`npm install -g @adobe/aem-cli`)
- [ ] Project cloned and `npm install` run
- [ ] Experience Modernization Agent accessible in browser

### On the day

- [ ] Start dev server before the session: `aem up --html-folder drafts`
- [ ] Open `localhost:3000` and verify it loads
- [ ] Open `labs/ai-dev/Prompts.md` in a second editor pane or window
- [ ] Set font size large enough to be readable on projector (editor + terminal)
- [ ] Turn off notifications (Do Not Disturb)
- [ ] Close Slack, email, anything that might pop up

### Network

Claude Code requires internet access. Verify the venue WiFi works for API calls,
or use a hotspot as backup. Test before the session, not during.

---

## Slides Tool

Use whatever you prefer. If you want a starting point:
- Keynote / PowerPoint: build from scratch using the outline above
- `document-skills:pptx` skill in Claude Code can scaffold a deck from the outline
- Keep it dark-themed — projectors in conference rooms tend to wash out light slides

---

## Optional: Student Handout

Consider printing or sharing `Prompts.md` with students so they have it for Day 2.
It's useful as a reference even without agent access — the prompting patterns transfer.

---

## After the Session

- [ ] Delete `drafts/schedule.html` and `blocks/schedule/` from the repo
      (demo artifacts, not meant to be merged)
- [ ] Or: stash them in `labs/exercise0/demo-output/` for reference
