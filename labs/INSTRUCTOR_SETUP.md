# Instructor Setup Guide - NYC Masterclass 2026

Complete setup checklist for running the NYC Masterclass lab with 50 participants.

**Time Required**: 4-6 hours (spread over 1 week)
**Lab Duration**: 3 hours 15 minutes (9:15 AM – 12:30 PM, including 15-minute break)

---

## Overview

**Key Stats**:
- 50 participants
- 8 exercises (9:15 AM – 12:30 PM, 15-min break 11:20–11:35)
- Multi-site architecture (hands-on repoless setup)
- Real-world collaborative site building

**Collision Prevention Strategy**:
- Each participant: personal git branch (`jsmith` format)
- All participant content: `/drafts/jsmith/` in DA.live
- Pre-populated shared reference data
- No simultaneous editing of shared resources

---

## Timeline

### 1 Week Before Lab
- [ ] Deploy Cloudflare Worker for Exercise 6
- [ ] Test worker and Slack integration

### 2-3 Days Before Lab
- [ ] Verify all content exists (sessions, labs, speakers, future-events)
- [ ] Verify helix-query.yaml is committed
- [ ] Publish all content to `.aem.live`
- [ ] Verify query-index populates with custom metadata

### 1 Day Before Lab
- [ ] Verify all JSON endpoints work (speakers.json, future-events.json, query-index.json)
- [ ] Verify participants have DA.live access
- [ ] Assign participants to branches
- [ ] Send participant setup instructions

### Morning of Lab
- [ ] Final endpoint verification (speakers, future-events, query-index)
- [ ] Dev server test
- [ ] Monitor query-index freshness
- [ ] Test worker one final time
- [ ] Verify Site Admin tool is accessible

---

## Phase 1: Verify Query Index Configuration

### 1.1 Verify helix-query.yaml Exists

File `helix-query.yaml` should exist at project root with:
- **Includes**: `/sessions/**` and `/labs/**`
- **Excludes**: `/drafts/**`
- **Custom properties**: speaker-name, instructor, category, tags, published-date, session-level, session-time, difficulty-level, duration

### 1.2 Commit if Needed

```bash
git add helix-query.yaml
git commit -m "feat: add query index configuration"
git push origin main
```

### 1.3 TODO: Verify Query Index Working

After publishing all content, verify:

```bash
curl https://main--nycmasterclass--cloudadoption.aem.live/query-index.json | jq '.data | length'
# Should return 15+ (7 sessions + 8 labs)

curl https://main--nycmasterclass--cloudadoption.aem.live/query-index.json | jq '.data[0] | keys'
# Should include custom metadata fields
```

**Action**: Verify query index populates after all session/lab pages are published.

---

## Phase 2: Verify Content Exists

### 2.1 Verify Session Pages (7 total)

All in `/sessions/` folder, published to `.aem.live`:
- [ ] `/sessions/what-is-edge-delivery` (Amol Anand)
- [ ] `/sessions/architecture-deep-dive` (Matt Ward)
- [ ] `/sessions/authoring-approaches` (David Nuescheler)
- [ ] `/sessions/development-best-practices` (Stefan Seifert)
- [ ] `/sessions/integration-strategies` (Kiran Murugulla)
- [ ] `/sessions/edge-commerce` (Matt Ward)
- [ ] `/sessions/ai-development` (Stefan Seifert)

Each should have: Hero block, content, metadata block with custom fields (speaker-name, category, tags, session-level, session-time, published-date)

### 2.2 Verify Lab Pages (8 total)

All in `/labs/` folder, published to `.aem.live`:
- [ ] `/labs/authoring-first-page`
- [ ] `/labs/block-development`
- [ ] `/labs/dynamic-cards`
- [ ] `/labs/page-list-block`
- [ ] `/labs/json2html`
- [ ] `/labs/form-submissions`
- [ ] `/labs/da-plugin-development`
- [ ] `/labs/repoless-setup`

Each should have: Hero block, content, metadata block with custom fields (instructor, difficulty-level, duration, category)

### 2.3 Verify Data Sheets

**Speakers Sheet** (`/speakers` in DA.live):
- 6 Adobe expert speakers
- Columns: Name, Title, Company, Bio, Image, Session, LinkedIn
- Published to `.aem.live`
- JSON endpoint: https://main--nycmasterclass--cloudadoption.aem.live/speakers.json

```bash
curl https://main--nycmasterclass--cloudadoption.aem.live/speakers.json | jq '.total'
# Should output: 6
```

**Future Events Sheet** (`/future-events` in DA.live):
- 6 future masterclass events (Sydney, London, Bangalore, Berlin, Singapore, Dubai)
- Columns: city, country, date, venue, address, description, highlights, image, registrationUrl, URL
- Published to `.aem.live`
- JSON endpoint: https://main--nycmasterclass--cloudadoption.aem.live/future-events.json
- **Note**: `highlights` field is comma-separated string (not array)

```bash
curl https://main--nycmasterclass--cloudadoption.aem.live/future-events.json | jq '.data.total'
# Should output: 6
```

**Required for**: Exercise 3 (speakers.json), Exercise 5 (future-events.json)

### 2.4 Verify Supporting Pages

- [ ] `/` (Homepage with hero, featured cards sections)
- [ ] `/schedule` (Schedule page with hero, table blocks with section metadata)  
- [ ] `/register` (Registration page with hero, mc-register block)
- [ ] `/speakers` (Speakers page with hero, placeholder content for Exercise 3)

### 2.5 Verify Navigation

- [ ] `/nav.html` includes: Home, Schedule, Speakers, Register links

---

## Phase 3: Participant Branch Setup

### 3.1 Create Participant List

Create `participants.txt` with branch names (one per line):
```
jsmith
agarcia
kwang
...
(50 total)
```

Format: first initial + last name, lowercase (e.g., John Smith = jsmith)

### 3.2 Create All Branches

```bash
git checkout main
git pull origin main

while read branch; do
  git checkout -b "$branch" main
  git push origin "$branch"
  git checkout main
done < participants.txt
```

Verify: `git branch -r | grep -v main | wc -l` should output 50

### 3.3 Create Participant Roster

Document for reference:
```
| Participant Name | Branch | Preview URL |
|------------------|--------|-------------|
| John Smith | jsmith | https://jsmith--nycmasterclass--cloudadoption.aem.page/ |
```

---

## Phase 4: Deploy Cloudflare Worker

**Required for**: [Exercise 6 - Form Submissions](exercise6/instructions.md)

### 4.1 Create Worker

1. Create Cloudflare Worker: `nycmasterclass-feedback`
2. Deploy worker code (see Exercise 6 for POST structure)
3. Add environment variable: `SLACK_WEBHOOK_URL`
4. Deploy and note Worker URL

**Worker must handle**:
- CORS preflight (OPTIONS)
- POST requests with JSON body (name, email, company, participant_id, submission_time)
- Slack Block Kit formatting
- Error responses with proper CORS headers

### 4.2 Test Worker

```bash
curl -X POST https://nycmasterclass-feedback.{account}.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","company":"Test"}'
```

Verify: Returns `{"success":true}` and posts to Slack

### 4.3 Document Worker URL

Create `labs/WORKER_URL.txt` with the worker URL for participants to use in Exercise 6.

---

## Phase 5: Verify Site Admin Access

**Required for**: [Exercise 8 - Repoless Setup](exercise8/instructions.md)

### 5.1 Verify Site Admin Tool

1. Visit: https://tools.aem.live/tools/site-admin/index.html
2. Verify you're logged in (requires AEM Sidekick extension)
3. Search for `cloudadoption/nycmasterclass`
4. Confirm site configuration is visible

### 5.2 Verify Participant Permissions

Confirm all participants have:
- [ ] DA.live access to `cloudadoption` organization
- [ ] Ability to create new DA.live projects
- [ ] Access to Site Admin tool (requires AEM Sidekick login)

**Note**: In Exercise 8, each participant creates their own DA.live project (`cloudadoption/jsmith-mc`) and configures code source via Site Admin tool. No pre-setup needed.

---

## Phase 6: Pre-Lab Communication

### 6.1 Send Participant Emails

**Subject**: NYC Masterclass 2026 - Setup Instructions

Include:
- Branch assignment
- Preview URL: `https://{branch}--nycmasterclass--cloudadoption.aem.page/`
- Setup guide: Link to `labs/SETUP.md`
- DA.live access: https://da.live/#/cloudadoption/nycmasterclass

### 6.2 Create Slack Channel

Create: `#nycmasterclass-registrations` for Exercise 6 form submissions

### 6.3 Final Pre-Lab Checklist

- [ ] All 50 participant branches exist
- [ ] All participants assigned to branches (roster created)
- [ ] All participants emailed with setup instructions
- [ ] Speakers sheet published (speakers.json works)
- [ ] Future events sheet published (future-events.json works)
- [ ] Query index has 15+ entries with custom metadata
- [ ] Worker deployed and tested
- [ ] Site Admin tool accessible to participants
- [ ] Slack channel created
- [ ] Homepage and schedule published
- [ ] All JSON endpoints verified

---

## Day-of Lab Checklist

### Morning Setup (30 min before start)

- [ ] Dev server runs: `aem up` - http://localhost:3000 loads
- [ ] Speakers JSON works: https://main--nycmasterclass--cloudadoption.aem.live/speakers.json
- [ ] Future Events JSON works: https://main--nycmasterclass--cloudadoption.aem.live/future-events.json
- [ ] Query Index works: https://main--nycmasterclass--cloudadoption.aem.live/query-index.json
- [ ] Worker responds: `curl -X POST {worker-url} -d '{"name":"Test"}'`
- [ ] DA.live accessible: https://da.live/
- [ ] Site Admin tool works: https://tools.aem.live/tools/site-admin/index.html
- [ ] GitHub repo accessible
- [ ] Participant roster available
- [ ] Slack channel open

### Exercise Monitoring

**Exercise 1** (20 mins): [Authoring Your First Page](exercise1/instructions.md)
- Verify participants can create pages in `/drafts/jsmith/`
- Check they understand `.md`, `.plain.html`, "View document source" inspection
- Confirm proper naming convention (jsmith format)

**Exercise 2** (20 mins): [Block Development - Simple Variations](exercise2/instructions.md)
- No special monitoring needed
- Watch for CSS scoping issues

**Exercise 3** (25 mins): [Dynamic Cards with Data Sources](exercise3/instructions.md)
- Verify participants copy `/speakers.json` to `/drafts/jsmith/speakers.json`
- Confirm they add personal speaker data
- Check dynamic-cards block fetches from `/drafts/jsmith/speakers.json`
- Monitor for fetch/CORS errors

**Exercise 4** (25 mins): [Extend Search Block from Block Collection](exercise4/instructions.md)
- Verify query-index.json is accessible and populated (15+ entries with custom metadata)
- Confirm participants create `blocks/search/search.js` and `blocks/search/search.css`
- Check that search results render as Cards block cards
- Verify participants can find their own `/labs/jsmith/` page via search
- Monitor for `cards.css` not loading (check browser console for import errors)

**Exercise 5** (25 mins): [JSON2HTML - Dynamic Pages](exercise5/instructions.md)
- Verify future-events.json is accessible
- Help participants with JSON2HTML Simulator: https://tools.aem.live/tools/json2html-simulator/
- Guide Admin Edit tool usage: https://tools.aem.live/tools/admin-edit/index.html
- Watch for Mustache template issues (highlights is string, not array)

**Exercise 6** (20 mins): [Form Submissions to Slack](exercise6/instructions.md)
- Monitor Slack channel for form submissions
- Watch for CORS or worker endpoint errors
- Verify participants use correct Worker URL
- Check JSON POST structure

**Exercise 7** (30 mins): [DA Plugin Development](exercise7/instructions.md)
- Help with local plugin testing (`?ref=local`)
- Verify branch testing (`?ref=jsmith`)
- Check DA App SDK PostMessage API issues
- Monitor for context/token/actions problems

**Exercise 8** (30 mins): [Repoless Multi-Site Setup](exercise8/instructions.md)
- Guide participants creating DA.live projects (`cloudadoption/jsmith-mc`)
- Help with Site Admin tool configuration (code source points to `nycmasterclass`)
- Verify DevTools Network tab shows code from `nycmasterclass`
- Watch for DA.live project creation permissions
- Check Site Admin tool access

---

## Troubleshooting Quick Reference

**Query index empty**: Verify published to `.aem.live`, check helix-query.yaml committed, wait 5-10 mins, force re-index via Index Admin

**Speakers/Future Events 404**: Verify sheet published (not just previewed), test JSON endpoint

**Participant can't push**: Verify branch exists, check they're on correct branch, verify GitHub permissions

**Worker not working**: Test with curl, check Cloudflare logs, verify Slack webhook URL, check CORS headers

**JSON2HTML not working** (Exercise 5): Verify future-events.json published to `.aem.live`, test template in Simulator first, check worker config in Admin Edit, remember highlights is string not array

**Site Admin not accessible** (Exercise 8): Verify logged in via AEM Sidekick extension, check org access, try logout/login

**Can't create DA.live project** (Exercise 8): Verify DA.live access to cloudadoption org, check permissions, confirm creating project not folder

---

## Post-Lab Tasks

### Collect Participant Work

```bash
gh pr list
gh pr view {pr-number}
gh pr checks {pr-number}
gh pr merge {pr-number}
```

### Archive

- Archive/delete participant branches after 30 days
- Export lightning talk content
- Collect feedback
- Document lessons learned

---

## Summary

**Setup creates**:
- Complete starter site (9 pages: sessions, labs, supporting pages)
- 6 speaker profiles via speakers.json
- 6 future events via future-events.json
- Query index with custom metadata
- 50 participant branches (isolated workspaces)
- Cloudflare Worker for form submissions
- Slack integration
- Site Admin tool access for repoless
- Zero collision risk

**Participant experience**:
- Personal workspace (`/drafts/jsmith/`)
- Personal data first (Exercise 3), shared data later (Exercise 4-5)
- Hands-on with real tools (Simulator, Admin Edit, Site Admin)
- Create own repoless site (Exercise 8)

**Exercise changes from original**:
- Exercise 3: Personal workspace approach
- Exercise 4: Manual configuration, no auto-blocking
- Exercise 5: JSON2HTML worker (not speaker profiles)
- Exercise 7: Extended to 30 minutes
- Exercise 8: Hands-on site creation (not pre-configured observation)
