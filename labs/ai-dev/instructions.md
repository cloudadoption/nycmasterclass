# AI-Assisted Development

**Duration**: 65 minutes
**Format**: Instructor demo — follow along with your own AI coding agent

---

**Quick navigation**
- **Context**
  - [What You'll Learn](#what-youll-learn)
- **Demo**
  - [Experience Modernization Agent](#part-1-experience-modernization-agent)
  - [Orient the Agent](#step-1-explore-available-skills)
  - [Build: Speakers (One-Shot)](#step-4-build-a-speakers-block-one-shot)
  - [Build: Schedule (Plan Mode)](#step-5-build-a-schedule-block-plan-mode)
  - [Code Review](#step-6-agent-code-review)
- [Key Takeaways](#key-takeaways)

---

## Prerequisites

**Complete [STUDENT_SETUP.md](STUDENT_SETUP.md) before starting this exercise.**

- AI coding agent installed and authenticated (Claude Code, Cursor, Codex CLI, or GitHub Copilot)
- Dev server running: `aem up --html-folder drafts`
- `localhost:3000` open in browser
- Terminal visible alongside editor

> **No agent set up?** You can follow along by watching the instructor's demo. The concepts and prompting patterns transfer to any AI coding tool.

---

## What You'll Learn

- How AI coding agents work with Edge Delivery Services
- How to orient an agent in an unfamiliar codebase
- Two approaches to building blocks: one-shot vs plan mode
- How to use an agent for code review
- How context (AGENTS.md, skills, prompts) shapes agent output

---

## Part 1: Experience Modernization Agent

*Watch the instructor demo this section.*

The [Experience Modernization Agent](https://aemcoder.adobe.io/) is Adobe's AI-powered console for modernizing web experiences with Edge Delivery Services. It migrates content and styles from existing sites, connects to your GitHub repo, and provides a built-in code editor with preview — all in the browser.

This is the accessible entry point on the spectrum of AI tooling. The developer workflow we'll use next offers more control and flexibility, but the underlying concepts (context, skills, tools) are the same.

> **Key idea**: There's a spectrum from hosted and guided to CLI and full control. Choose based on the task and your comfort level.

---

## Part 2: Orient

Before building anything, orient the agent in the project. These three steps show what the agent knows and what it can do — without asking it to write a single line of code.

> **These prompts work across agents.** This project uses AGENTS.md and [Agent Skills](https://agentskills.io/) — an open standard supported by Claude Code, Cursor, Codex CLI, GitHub Copilot, and others. The same project instructions and skills are available regardless of which agent you use.
>
> Skills documentation per tool:
> - [Claude Code](https://docs.anthropic.com/en/docs/claude-code/skills)
> - [OpenAI Codex CLI](https://developers.openai.com/codex/skills/)
> - [GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
> - [Cursor](https://cursor.com/docs/context/skills)

---

### Step 1: What Does the Agent Know?

Ask the agent what it knows about this project and what tools it has.

**Prompt:** Use [**2.1** from Prompts.md](Prompts.md#21--what-do-you-know-about-this-project)

**What to look for:**
- The agent describes the tech stack, project structure, and coding conventions — it read AGENTS.md
- It surfaces available skills and explains when you'd use them
- Key skills to note:
  - `content-driven-development` — the workflow for building blocks
  - `block-collection-and-party` — research tool for finding reference implementations
  - `docs-search` — searches AEM documentation

> **Key idea**: The agent adapts to where it's working. Skills, conventions, and project context are all project-level — a different project would produce a completely different response.

---

### Step 2: Research Before You Build

Before building new blocks, check if reference implementations already exist.

**Prompt:** Use [**2.2** from Prompts.md](Prompts.md#22--research-before-you-build)

**What to look for:**
- The agent reaches for the block-collection-and-party skill on its own — you didn't tell it to
- It searches for speakers and schedule references and reports what it finds
- It maps existing blocks to your needs (e.g., "cards" as a starting point for speakers)
- Even if there's no exact match, the agent researched before proposing to build from scratch

> **Key idea**: Research is part of the workflow, not a luxury. The agent just did it in two minutes — the step most developers skip.

---

### Step 3: Code Comprehension + Documentation

Ask the agent to tour the project's blocks and check them against AEM best practices.

**Prompt:** Use [**2.3** from Prompts.md](Prompts.md#23--code-comprehension--documentation)

**What to look for:**
- The agent reads local block files to explain what each one does
- It fetches AEM documentation from aem.live to identify gaps and best practices
- It links to relevant docs — students can follow the links later
- The agent pulled from multiple sources (local code + external docs) without being told which tools to use

> **Key idea**: The agent combines code comprehension with external knowledge. New developer, unfamiliar codebase — instead of reading files and docs separately, you get both in one response.

---

## Part 3: Build

Two blocks, same Content Driven Development (CDD) workflow, different levels of control. The CDD skill orchestrates the full process: content model, test content, implementation, and validation.

---

### Step 4: Build a Speakers Block (One-Shot)

Hand the agent the goal and let it run the workflow. It decides the content model, creates test content, writes JS and CSS, and validates. The agent may pause to confirm decisions along the way — that's normal. Use your best judgement: approve and let it continue, or steer if something looks off.

**Prompt:** Use [**3.1** from Prompts.md](Prompts.md#31--speakers-block-one-shot)

**What happens:**
1. The agent invokes the CDD skill
2. It designs a content model (how authors will structure the block)
3. It creates test content at `drafts/speakers.html`
4. It implements `blocks/speakers/speakers.js` and `blocks/speakers/speakers.css`
5. It validates — linting, self-review

**When it finishes**, open `http://localhost:3000/drafts/speakers` to see the result.

**What to evaluate:**
- Does the content model make sense for authors?
- Does the block render correctly?
- What looks right? What would you question?

> **Key idea**: One-shot works when you trust the workflow and want speed. You didn't ask for a plan — the agent decided when (and whether) to pause on its own.

---

### Step 5: Build a Schedule Block (Plan Mode)

Same CDD workflow, but this time you review the plan before any code is written. This is the approach for complex tasks or unfamiliar territory.

**Prompt:** Use [**3.2** from Prompts.md](Prompts.md#32--schedule-block-plan-mode)

**Phase 1 — Plan output:**
The agent produces a plan covering content model, test content approach, and JS/CSS strategy. No files written yet.

Read the plan and consider:
- Does the content model make sense for how authors would work?
- Is the test content representative?
- Would you change anything about the approach?

Approve the plan (or request changes) before the agent proceeds.

**Phase 2 — Test content:**
The agent creates `drafts/schedule.html`. Open `http://localhost:3000/drafts/schedule` — you should see an unstyled table. This is the authored content before JavaScript touches it.

**Phase 3 — Implementation:**
The agent writes `blocks/schedule/schedule.js` and `blocks/schedule/schedule.css`. Refresh the browser to see the styled block.

**Phase 4 — Validation:**
The CDD skill includes self-review and linting. The agent validates without being asked — the skill enforces the full workflow.

> **Key idea**: Plan mode gives you a review gate before any code exists. Use it when the task is complex, unfamiliar, or when you want to steer before reacting to existing output.

**Steering follow-ups** (use if needed): See [steering prompts in Prompts.md](Prompts.md#steering-follow-ups-use-if-needed)

---

## Part 4: Review

### Step 6: Agent Code Review

The agent built both blocks — now ask it to review its own work against project conventions.

**Prompt:** Use [**4.1** from Prompts.md](Prompts.md#41--code-review)

**What to look for:**
- The agent reads both blocks and compares them
- It flags inconsistencies (naming, structure, CSS patterns) between the two blocks
- It checks against AGENTS.md conventions (CSS scoping, responsive design, accessibility)
- It fixes what it finds — refresh the browser to see updates

> **Key idea**: AI code review works on any code, not just code the agent wrote. You can use this on pull requests, teammate code, or unfamiliar codebases.

---

## Troubleshooting

**Agent skips the plan and starts coding:**
Interrupt and re-prompt: *"Stop — I asked for a plan first. Show me the plan before writing any files."* Prompt wording matters.

**Agent produces broken output:**
Don't fix it manually. Tell the agent what's wrong and let it recover. This is a normal part of the workflow.

**Dev server not serving draft files:**
Verify the `--html-folder drafts` flag. Restart: `aem up --html-folder drafts`

**Agent is slow or unresponsive:**
After 3+ minutes with no output, cancel (Escape in Claude Code) and retry with a more specific prompt.

---

## Key Takeaways

| Theme | Takeaway |
|-------|----------|
| Stack | The code the agent writes is the code that runs — no framework, no build step |
| Context | You're managing an attention budget — AGENTS.md, skills, and prompts |
| No memory | Every conversation starts from scratch |
| Starter kit | You don't start from scratch — the EDS tooling exists |
| Spectrum | From hosted agent to full CLI control — same concepts |
| Research | Good agents don't start from scratch — they check for prior art |
| CDD | Content model before code — always |
| Plan mode | A review gate before any code exists |
| One-shot | Hand it off when you trust the workflow and want speed |
| Review | Ask the agent to evaluate its own output — it will |
| Accountability | AI builds. You decide. |

---

## Verification Checklist

**If you followed along with an agent:**
- [ ] Agent listed available skills for this project
- [ ] Agent explained the hero block's author structure and decoration logic
- [ ] Agent researched block collection for prior art
- [ ] Speakers block built and renders at `localhost:3000/drafts/speakers`
- [ ] Schedule block planned, reviewed, and built at `localhost:3000/drafts/schedule`
- [ ] Agent reviewed both blocks and fixed issues it found
- [ ] Lint passes: `npm run lint`

**If you watched the demo:**
- [ ] Understand the agentic loop: prompt → inference → tool call → result
- [ ] Understand why context management matters (AGENTS.md, skills, prompts)
- [ ] Understand when to use one-shot vs plan mode
- [ ] Understand how the CDD workflow structures block development

---

## References

- [AEM Edge Delivery Documentation](https://www.aem.live/docs/)
- [Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- [AI Coding Agents for EDS](https://www.aem.live/developer/ai-coding-agents)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

---

## What's Next

In the exercises that follow, you'll do this workflow manually — content model, test content, JavaScript, CSS, validate. That's intentional. You need to understand the steps before you delegate them. This exercise was a preview of where it goes.
