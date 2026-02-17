# Feedback Worker

Cloudflare Worker that accepts feedback form POSTs and forwards them to a Slack incoming webhook.

## Endpoint behavior

- `OPTIONS` -> CORS preflight (`204`)
- `POST` -> validates `fullName`, `email`, and `feedback`, then posts to Slack webhook
- other methods -> `405`

Expected POST body:

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "feedback": "I have a question about classes..."
}
```

Success response (`200`):

```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

Error response examples:

```json
{
  "error": "Missing required fields"
}
```

```json
{
  "error": "Invalid email address"
}
```

```json
{
  "error": "Failed to send to Slack"
}
```

## Required secret

This worker expects the secret:

- `SLACK_WEBHOOK_URL`

Set/update it with:

```bash
wrangler secret put SLACK_WEBHOOK_URL --config ./feedback/wrangler.toml
```

## Local dev

From `workers/nycmasterclass`:

```bash
npm install
npm run dev:feedback
```

## Deploy

From `workers/nycmasterclass`:

```bash
npm run deploy:feedback
```
