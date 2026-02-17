# NYC Masterclass Workers

Wrangler-based Cloudflare Workers for this project.

## Current workers

- `feedback` -> receives feedback form data and forwards it to a Slack webhook

## Setup

```bash
cd workers/nycmasterclass
npm install
wrangler login
```

## Commands

```bash
npm run dev:feedback
npm run deploy:feedback
npm run tail:feedback
```
