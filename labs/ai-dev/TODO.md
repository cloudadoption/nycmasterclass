# Exercise 0 — Instructor TODO

---

## Create Slide Deck

6 slides. Keep each one sparse — one idea, few words, maybe one visual.
These are backdrop slides, not reading material.

---

### Slide 1 — What Changed

**Title**: From autocomplete to agent

**Content**:
- Before: suggests the next line (Copilot v1, Tabnine)
- After: takes actions

**Visual idea**: Two-column comparison. Left: greyed-out autocomplete ghost text.
Right: a list of tools — Read file, Write file, Run command, Search web, Browse.

**Talking point** (in instructions.md): "It doesn't suggest. It does."

---

### Slide 2 — Context Window

**Title**: The agent can only help with what it can see

**Content**:
- Your codebase
- Your conventions (AGENTS.md)
- Your constraints

**Visual idea**: A spotlight on a dark background. Only what's in the spotlight is visible.
Or simply: a quote in large text — "Garbage context in, garbage code out."

**Talking point**: AGENTS.md isn't just documentation. It's the agent's briefing.

---

### Slide 3 — Agent Tools and Skills

**Title**: What the agent can do

**Content** (two columns):
- Built-in: Read files / Write files / Run bash / Search web / Browse
- Custom skills: project-specific workflows configured in settings

**Visual idea**: Simple icon grid. No deep explanation needed.

**Talking point**: Tools are how the agent acts. Skills are specialized instructions
for specific workflows. This project has several — you'll see them used today.

---

### Slide 4 — MCP

**Title**: Extending the agent

**Content**:
- Model Context Protocol
- Open standard for connecting agents to external services
- Examples: databases, GitHub, Slack, browsers, design tools

**Visual idea**: Simple hub-and-spoke diagram. Agent in the center.
Services on the outside: GitHub, Slack, Browser, DB, API.

**Talking point**: Think of it as a plugin system for AI agents.
Claude Code supports it. Cursor supports it. Most serious tools do now.

---

### Slide 5 — The Mental Model

**Title**: You're the architect. AI is the crew.

**Content**:
- You: decide what to build, evaluate the output, course correct
- AI: determine how, execute the steps

**Visual idea**: Blueprint on one side (you), construction on the other (AI).
Or just two large words: DECIDE / EXECUTE

**Talking point**: "The developers who get the most from this aren't the ones with
the best prompts. They're the ones who evaluate output quickly."

---

### Slide 6 — What We're Building

**Title**: Content Driven Development — live

**Content** (simple flow):
```
Orient → Content model → Test content → Build → Validate → Ship
```

**Visual idea**: The six steps as a horizontal pipeline with arrows.
Highlight that this is the same flow they'll use in every exercise tomorrow.

**Talking point**: "We do this once, together, today. Tomorrow you do it yourselves."

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
- [ ] Cursor installed (for brief comparison moment — optional but planned)

### On the day

- [ ] Start dev server before the session: `aem up --html-folder drafts`
- [ ] Open `localhost:3000` and verify it loads
- [ ] Open `labs/exercise0/Prompts.md` in a second editor pane or window
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
