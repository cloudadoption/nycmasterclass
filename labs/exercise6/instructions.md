# Exercise 6: Form Submissions with Workers

**Duration**: 20 minutes

---

## Prerequisites

**Complete [SETUP.md](../SETUP.md) if not already done.**

Required:
- On your feature branch (`jsmith` - your first initial + last name)
- Local dev server running at `http://localhost:3000`
- Exercises 1-5 completed

**Your Personal Workspace**: All work in `/drafts/jsmith/` (use your name: first initial + last name, lowercase)

**Worker Endpoint**:

The instructor has deployed a Cloudflare Worker that accepts form submissions and sends them to Slack.

**Worker URL** (instructor will provide): `https://feedback-worker.yourorg.workers.dev`

**Verify worker is running**:
```bash
curl -X POST https://feedback-worker.yourorg.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","feedback":"Test message"}'
```

**Expected response**: `{"success": true, "message": "Feedback submitted successfully"}`

---

## What You'll Learn

- How to build forms in Edge Delivery Services blocks
- How to handle form submissions with JavaScript (prevent default, capture data)
- **POST request structure** for worker endpoints
- How Workers integrate with external services (Slack)
- How to provide user feedback during async operations (loading, success, error states)
- The complete data flow: Form → Worker → Slack

---

## Why This Matters

Forms are critical for user engagement: registrations, feedback, contact forms, surveys, lead capture.

**The challenge**: Forms need to send data to external services (Slack, email, CRMs) without exposing API keys or secrets to the browser.

**The solution**: Use a Worker as secure middleware between your form and external services.

**Why use Workers for forms**:
- **Security** - Keep API keys server-side, never exposed to browser
- **Validation** - Validate data before sending to external services
- **Transformation** - Format data for target system (Slack Block Kit, email templates)
- **Error handling** - Handle failures gracefully without exposing internals
- **Rate limiting** - Prevent spam and abuse
- **Multi-destination** - Send to multiple services (Slack + Email + CRM)

**Real-world use cases**:
- Event registration → Google Sheets or Salesforce
- Feedback forms → Slack channel or email
- Contact forms → SendGrid or Mailgun
- Newsletter signup → Mailchimp or Campaign Monitor
- Lead capture → CRM (HubSpot, Salesforce)

---

## The Complete Data Flow

Understanding the entire flow from user submission to Slack notification:

```
┌─────────────┐
│   Browser   │  User fills form and clicks Submit
│             │
│  [Form]     │  1. JavaScript captures submit event (preventDefault)
│             │  2. Extracts form data (FormData API)
│             │  3. Validates data client-side
│             │  4. Shows loading state
└──────┬──────┘
       │
       │ POST https://worker-url.workers.dev
       │ Content-Type: application/json
       │ Body: { fullName, email, feedback }
       │
       ▼
┌─────────────┐
│   Worker    │  5. Receives POST request
│ (Cloudflare)│  6. Validates data server-side
│             │  7. Formats message for Slack (Block Kit)
│             │  8. POSTs to Slack webhook URL (secret stored in env var)
└──────┬──────┘
       │
       │ POST https://hooks.slack.com/services/XXX/YYY/ZZZ
       │ Body: Slack Block Kit formatted message
       │
       ▼
┌─────────────┐
│    Slack    │  9. Receives webhook POST
│   Channel   │  10. Displays formatted message in channel
│             │  11. Returns 200 OK to Worker
└──────┬──────┘
       │
       │ 200 OK
       │
       ▼
┌─────────────┐
│   Worker    │  12. Returns success response to browser
│             │  Response: { success: true, message: "..." }
└──────┬──────┘
       │
       │ 200 OK { "success": true }
       │
       ▼
┌─────────────┐
│   Browser   │  13. Form receives response
│             │  14. Hides loading state
│  [Success]  │  15. Shows success message to user
└─────────────┘
```

**Key insight**: The browser never knows the Slack webhook URL. The worker acts as a secure proxy.

---

## Understanding the POST Request Structure

Before building the form, understand what data format the worker expects.

**Worker Endpoint**: `POST https://feedback-worker.yourorg.workers.dev`

**Request Headers**:
```
Content-Type: application/json
```

**Request Body** (JSON):
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "feedback": "Great masterclass! Learned a lot about Edge Delivery Services."
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Missing required fields"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "error": "Failed to send to Slack"
}
```

**Key points**:
- All fields are **required** (fullName, email, feedback)
- Email must be **valid format** (validated server-side)
- Request must be **JSON** (not form-urlencoded)
- Worker validates and returns appropriate error codes
- Browser code must handle both success and error cases

**Your form block will**:
1. Capture form data with `FormData` API
2. Extract values and create JSON object
3. `fetch()` POST request with JSON body
4. Handle response (success or error)

---

## Step 1: Create Block Files

In your code editor, create:

```
blocks/
  feedback-form/
    feedback-form.js
    feedback-form.css
```

---

## Step 2: Implement Form Block

**File**: `blocks/feedback-form/feedback-form.js`

Copy this code:

```javascript
/**
 * Feedback Form Block
 * Submits user feedback to Slack via Worker endpoint
 */

// Worker endpoint provided by instructor
// Replace with actual URL provided during the lab
const WORKER_URL = 'https://feedback-worker.yourorg.workers.dev';

/**
 * Shows success message in form
 */
function showSuccess(form) {
  form.innerHTML = `
    <div class="feedback-form-success">
      <h3>Thank You!</h3>
      <p>Your feedback has been submitted successfully.</p>
      <p>We appreciate you taking the time to share your thoughts.</p>
    </div>
  `;
}

/**
 * Shows error message in form
 */
function showError(form, message) {
  const existingError = form.querySelector('.feedback-form-error');
  if (existingError) {
    existingError.remove();
  }

  const error = document.createElement('div');
  error.className = 'feedback-form-error';
  error.textContent = message;
  form.prepend(error);

  // Re-enable submit button
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Feedback';
  }
}

/**
 * Handles form submission
 */
async function handleSubmit(event, form) {
  event.preventDefault();

  // Get form data
  const formData = new FormData(form);
  const data = {
    fullName: formData.get('fullName')?.trim(),
    email: formData.get('email')?.trim(),
    feedback: formData.get('feedback')?.trim(),
  };

  // Client-side validation
  if (!data.fullName || !data.email || !data.feedback) {
    showError(form, 'Please fill in all fields.');
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showError(form, 'Please enter a valid email address.');
    return;
  }

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  try {
    // Send to Worker
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Submission failed');
    }

    // Show success message
    showSuccess(form);
  } catch (error) {
    console.error('Form submission error:', error);
    showError(form, `Error: ${error.message}. Please try again.`);
  }
}

/**
 * Decorates the feedback form block
 */
export default function decorate(block) {
  // Create form HTML
  block.innerHTML = `
    <form class="feedback-form">
      <h2>Share Your Feedback</h2>
      <p>Help us improve NYC Masterclass. We value your input!</p>

      <div class="feedback-form-field">
        <label for="fullName">Full Name *</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          placeholder="John Doe"
        >
      </div>

      <div class="feedback-form-field">
        <label for="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="john@example.com"
        >
      </div>

      <div class="feedback-form-field">
        <label for="feedback">Your Feedback *</label>
        <textarea
          id="feedback"
          name="feedback"
          required
          rows="6"
          placeholder="Share your thoughts about the masterclass..."
        ></textarea>
      </div>

      <button type="submit">Submit Feedback</button>
    </form>
  `;

  // Add submit handler
  const form = block.querySelector('form');
  form.addEventListener('submit', (e) => handleSubmit(e, form));
}
```

**What this does**:
- Renders form with name, email, feedback fields
- Validates input client-side
- Shows loading state during submission
- POSTs JSON to Worker endpoint
- Handles success (shows thank you message)
- Handles errors (shows error message, re-enables button)

---

## Step 3: Add Form Styles

**File**: `blocks/feedback-form/feedback-form.css`

Copy this code:

```css
.feedback-form {
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  background: var(--background-color);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.feedback-form h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
}

.feedback-form > p {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 14px;
}

.feedback-form-field {
  margin-bottom: 20px;
}

.feedback-form-field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-color);
}

.feedback-form-field input,
.feedback-form-field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.feedback-form-field input:focus,
.feedback-form-field textarea:focus {
  outline: none;
  border-color: #1473e6;
}

.feedback-form-field textarea {
  resize: vertical;
  min-height: 120px;
}

.feedback-form button[type="submit"] {
  width: 100%;
  padding: 12px 24px;
  background: #1473e6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.feedback-form button[type="submit"]:hover {
  background: #0d66d0;
}

.feedback-form button[type="submit"]:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.feedback-form-error {
  padding: 12px 16px;
  margin-bottom: 20px;
  background: #fce8e6;
  border: 1px solid #d93025;
  border-radius: 4px;
  color: #d93025;
  font-size: 14px;
}

.feedback-form-success {
  text-align: center;
  padding: 40px 20px;
}

.feedback-form-success h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #137333;
}

.feedback-form-success p {
  margin: 8px 0;
  color: #666;
  font-size: 16px;
}

@media (max-width: 600px) {
  .feedback-form {
    padding: 24px 16px;
  }
}
```

---

## Step 4: Create Test Page

**In DA.live**, create page: `/drafts/jsmith/feedback` (use your name)

```
# We Value Your Feedback

Help us improve NYC Masterclass by sharing your thoughts.

| Feedback Form |
|---------------|

| Metadata |                        |
|----------|------------------------|
| Title    | Feedback - NYC Masterclass |
```

**Save** the page.

---

## Step 5: Test Form Locally

**Open**: `http://localhost:3000/drafts/jsmith/feedback` (use your name)

**You should see**:
- Form with three fields (name, email, feedback)
- Submit button

**Test submission**:
1. Fill in all fields
2. Click "Submit Feedback"
3. Button should show "Sending..."
4. Success message should appear

**Check Slack**: Instructor's Slack channel should receive your message!

**Test validation**:
- Submit with empty fields → error message
- Submit with invalid email → error message
- Fill all fields correctly → success

---

## Step 6: Understanding What the Worker Does

The worker acts as secure middleware between your form and Slack. Here's what it does step-by-step:

### 1. CORS Handling

Browsers enforce CORS (Cross-Origin Resource Sharing) security. The worker must explicitly allow requests from your site.

**Preflight Request** (OPTIONS):
```javascript
// Browser sends OPTIONS request first to check if POST is allowed
if (request.method === 'OPTIONS') {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',  // Allow any origin
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

**Why this matters**: Without CORS headers, your browser will block the request for security reasons.

### 2. Input Validation (Server-Side)

Never trust client-side validation alone. The worker validates again:

```javascript
const { fullName, email, feedback } = await request.json();

// Check required fields
if (!fullName || !email || !feedback) {
  return new Response(
    JSON.stringify({ error: 'Missing required fields' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return new Response(
    JSON.stringify({ error: 'Invalid email address' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
```

**Why this matters**: Malicious users can bypass client-side validation. Server-side validation is required.

### 3. Slack Message Formatting

The worker transforms your form data into Slack's Block Kit format for rich, formatted messages:

```javascript
const slackMessage = {
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'New Feedback Received'
      }
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Name:*\n${fullName}` },
        { type: 'mrkdwn', text: `*Email:*\n${email}` }
      ]
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Feedback:*\n${feedback}`
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Submitted from NYC Masterclass | ${new Date().toISOString()}`
        }
      ]
    }
  ]
};
```

**Why this matters**: Slack Block Kit provides rich formatting, making messages easier to read and act on.

### 4. Secure API Call to Slack

The worker stores the Slack webhook URL as an **environment variable** (secret), not in your client code:

```javascript
// SLACK_WEBHOOK_URL is stored securely in Cloudflare Worker environment
// It's NEVER exposed to the browser
const slackWebhookUrl = env.SLACK_WEBHOOK_URL;

const slackResponse = await fetch(slackWebhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(slackMessage)
});

if (!slackResponse.ok) {
  throw new Error('Failed to send to Slack');
}
```

**Why this matters**: If the webhook URL was in your client code, anyone could spam your Slack channel. Workers keep secrets secure.

### 5. Error Handling and Response

The worker returns appropriate HTTP status codes and error messages:

```javascript
try {
  // ... validation and Slack call ...
  
  return new Response(
    JSON.stringify({ success: true, message: 'Feedback submitted successfully' }),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
} catch (error) {
  return new Response(
    JSON.stringify({ error: error.message }),
    { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}
```

**Why this matters**: Clear error messages help your form block handle failures gracefully.

### Key Concepts Summary

- **CORS** - Worker explicitly allows browser requests
- **Validation** - Server-side validation prevents bad data
- **Formatting** - Worker transforms data for target system (Slack Block Kit)
- **Security** - Environment variables keep secrets safe
- **Error handling** - Appropriate status codes and messages
- **Middleware pattern** - Worker sits between form and external service

**The worker is a secure proxy**: Your browser never knows the Slack webhook URL, can't bypass validation, and gets clear error messages when things fail.

---

## Step 7: Commit Your Changes

```bash
# Run linting
npm run lint

# Add changes
git add blocks/feedback-form/

# Commit
git commit -m "feat: add feedback form with Slack integration"

# Push
git push origin jsmith
```

Replace `jsmith` with your branch name.

---

## Real-World Applications

**Use Case 1: Event Registration Form**
- **Form fields**: name, email, company, role, dietary restrictions
- **Worker actions**:
  - Validates all fields
  - POSTs to Google Sheets API (adds row with registration data)
  - POSTs to SendGrid API (sends confirmation email to registrant)
  - POSTs to Slack webhook (notifies team of new registration)
  - POSTs to Salesforce API (creates lead record)
- **Response**: Success message with event details and calendar invite link
- **Why Worker?**: Google Sheets API key, SendGrid API key, Salesforce credentials all kept secure

**Use Case 2: Contact Form**
- **Form fields**: name, email, subject, message, phone (optional)
- **Worker actions**:
  - Validates email format and message length
  - POSTs to Mailgun API (sends email to support team)
  - POSTs to Zendesk API (creates support ticket)
  - Sends auto-reply email to user
- **Response**: Success message with ticket number
- **Why Worker?**: Mailgun API key secret, prevents spam with rate limiting

**Use Case 3: Newsletter Signup**
- **Form fields**: email only (+ optional name)
- **Worker actions**:
  - Validates email format
  - Checks if email already subscribed (query Mailchimp API)
  - Adds to Mailchimp list via API
  - Sends welcome email
- **Response**: Success message or "already subscribed" message
- **Why Worker?**: Mailchimp API key secure, prevents duplicate signups

**Use Case 4: Lead Capture Form**
- **Form fields**: name, email, company, employees count, interested in
- **Worker actions**:
  - Validates and enriches data (add timestamp, source URL)
  - POSTs to HubSpot CRM API (creates contact and deal)
  - POSTs to Slack (notifies sales team)
  - Sends personalized follow-up email via SendGrid
- **Response**: Success message and redirect to thank-you page
- **Why Worker?**: HubSpot API key secure, data enrichment logic hidden

**Use Case 5: Multi-Step Form Wizard**
- **Form fields**: Multiple pages (personal info → preferences → payment)
- **Worker actions**:
  - Stores partial data in KV storage (Cloudflare Workers KV)
  - Final step: Combines all data, processes payment (Stripe API)
  - Creates account in database
  - Sends welcome email
- **Response**: Account created, redirect to dashboard
- **Why Worker?**: Stripe secret key secure, complex logic centralized, state management

**Common Pattern**: 
```
Form → Worker → [Validate + Transform] → [Service 1, Service 2, Service N] → Response
```

**Key Benefits**:
- One secure place for all API keys
- One place for validation logic
- One place for data transformation
- Easy to add more destinations (just update worker)
- Rate limiting and spam prevention
- Logging and analytics centralized

---

## Key Takeaways

- **Forms in EDS** are standard HTML forms rendered by blocks
- **JavaScript captures submission** with `event.preventDefault()` and `FormData` API
- **POST request structure** matters - JSON body with specific fields expected by worker
- **Workers are secure middleware** - Sit between form and external services (Slack, email, CRM)
- **Always validate twice** - Client-side for UX, server-side for security
- **CORS is required** - Worker must explicitly allow browser requests
- **Environment variables** keep API keys/webhooks secure (never in client code)
- **Clear user feedback** - Show loading, success, and error states
- **Error handling** - Handle network failures, validation errors, and service errors
- **Block Kit formatting** - Workers can transform data for target system's format

**The pattern**: Form captures data → Worker validates and formats → External service receives → Form shows result

**Why Workers?**
- Security (secrets server-side)
- Validation (server-side)
- Formatting (Block Kit, email templates)
- Rate limiting (prevent spam)
- Multi-destination (send to multiple services)

---

## Verification Checklist

- [ ] **Created feedback-form block** (`feedback-form.js`, `feedback-form.css`)
- [ ] **Form renders** correctly with all three fields (name, email, feedback)
- [ ] **Updated WORKER_URL** constant with actual URL from instructor
- [ ] **Submit shows loading state** - Button text changes to "Sending..." and is disabled
- [ ] **Successful submission** shows thank you message (replaces form)
- [ ] **Slack channel receives** formatted Block Kit message with all data
- [ ] **Client-side validation works**:
  - Empty fields → error message shown
  - Invalid email → error message shown
  - Valid data → submission proceeds
- [ ] **Error handling works** - Network errors show error message and re-enable button
- [ ] **Understand POST request structure**:
  - JSON body with `fullName`, `email`, `feedback` fields
  - Content-Type: application/json header
  - Worker expects all three fields
- [ ] **Understand Worker role**:
  - CORS handling (OPTIONS preflight)
  - Server-side validation
  - Slack Block Kit formatting
  - Secure webhook URL storage
  - Error responses with appropriate status codes
- [ ] **Understand complete flow**: Form → JavaScript → Worker → Slack → Response → UI update
- [ ] **Committed and pushed** changes to feature branch

---

## Troubleshooting Common Issues

**Form submits but page refreshes**:
- Problem: Forgot `event.preventDefault()`
- Fix: Add `event.preventDefault()` at the start of `handleSubmit()`

**CORS error in browser console**:
- Problem: Worker not returning CORS headers
- Fix: Verify worker URL is correct, ask instructor to check worker CORS config

**"Failed to fetch" error**:
- Problem: Worker URL incorrect or worker is down
- Fix: Verify WORKER_URL constant, test with curl command, ask instructor

**Success response but no Slack message**:
- Problem: Worker can't reach Slack webhook
- Fix: Ask instructor to verify SLACK_WEBHOOK_URL environment variable

**"Missing required fields" error**:
- Problem: Form data not being extracted correctly
- Fix: Check field names in form HTML match JavaScript (`fullName`, `email`, `feedback`)

**Submit button stays disabled**:
- Problem: Error handler not re-enabling button
- Fix: Ensure `showError()` function re-enables button

**Validation error even with valid data**:
- Problem: Client-side and server-side validation don't match
- Fix: Review both email regex patterns, check for whitespace issues (use `.trim()`)

**Use Browser DevTools to debug**:
1. Open DevTools → Network tab
2. Submit form
3. Look for POST request to worker URL
4. Check request payload (should be JSON with all fields)
5. Check response status and body
6. Check Console tab for JavaScript errors

---

## References

- [Integrations](https://www.aem.live/developer/integrations)
- [Slack Block Kit](https://api.slack.com/block-kit)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## Next Exercise

**Exercise 7**: Performance Optimization - You'll learn to analyze and optimize your Edge Delivery Services site for Core Web Vitals, aiming for perfect Lighthouse scores.
