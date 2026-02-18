# Exercise 0 — Student Setup

Complete these steps before Day 1 if you want to follow along with the demo
on your own machine. None of this is required — you can watch and learn without it.

---

## Required: AI Coding Agent

You need at least one of these. If you already have one, skip this section.

**Claude Code**
- Requires an active Claude Pro or Team subscription ($20+/mo)
- Install: `npm install -g @anthropic-ai/claude-code`
- Verify: `claude --version`
- Docs: https://docs.anthropic.com/en/docs/claude-code

**Cursor**
- Free tier available (limited monthly usage)
- Download: https://cursor.com
- Enable Agent mode in settings

**OpenAI Codex**
- Requires ChatGPT Plus or API access
- Available at https://chatgpt.com (use the coding agent mode)
- The prompts in Prompts.md work here too

**GitHub Copilot**
- Free tier available (limited monthly usage)
- Install the VS Code extension
- The prompts in Prompts.md work here too

> If you don't have access to any of these, you can still follow along with
> the demo and use the prompts as reference material for later.

---

## Recommended: GitHub CLI

Used for branch management and PR creation, so your coding agent can do this on your behalf.

```bash
# macOS
brew install gh

# Windows
winget install GitHub.cli

# Verify
gh --version

# Authenticate
gh auth login
```

---

## Recommended: Playwright MCP

Playwright MCP lets your coding agent control a browser — it can open `localhost:3000`,
take screenshots, and verify that blocks render correctly without you switching windows.

**Install the MCP server:**
```bash
npm install -g @playwright/mcp
```

**Add to Claude Code config** (`~/.claude/claude.json` or via `claude mcp add`):
```bash
claude mcp add playwright npx @playwright/mcp
```

**Verify it's available:**
Open Claude Code and ask: `What MCP servers do you have access to?`
You should see `playwright` in the list.

> With Playwright MCP configured, during the demo you can ask the agent to open
> the browser and verify the block rendered correctly — it will do this automatically
> as part of the CDD validation step.
