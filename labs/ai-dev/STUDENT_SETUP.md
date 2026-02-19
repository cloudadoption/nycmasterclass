# AI-Assisted Development — Student Setup

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

**OpenAI Codex CLI**
- Requires ChatGPT Plus, Pro, Business, Edu, or Enterprise subscription
- Install: `npm install -g @openai/codex`
- First run prompts you to sign in with your ChatGPT account or API key
- macOS and Linux supported; Windows works under WSL
- Docs: https://developers.openai.com/codex/cli

**GitHub Copilot (VS Code Chat)**
- Free tier available (limited monthly usage)
- Install the GitHub Copilot extension in VS Code
- Open Chat view (⌃⌘I on Mac, Ctrl+Alt+I on Windows) and select **Agent** mode
- Docs: https://code.visualstudio.com/docs/copilot/chat/copilot-chat

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

**Add to Claude Code:**
```bash
claude mcp add --transport stdio playwright -- npx @playwright/mcp@latest
```

**Verify it's available:**
Open Claude Code and ask: `What MCP servers do you have access to?`
You should see `playwright` in the list.

> With Playwright MCP configured, the agent can open the browser and verify blocks
> render correctly as part of the CDD validation step.

Docs: https://github.com/microsoft/playwright-mcp
