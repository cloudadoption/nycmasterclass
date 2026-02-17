# Exercise 5: JSON2HTML - Generate Pages from Data

**Duration**: 25 minutes

---

## Prerequisites

**Complete [SETUP.md](../SETUP.md) if not already done.**

Required:
- On your feature branch (`jsmith` - your first initial + last name)
- Local dev server running at `http://localhost:3000`
- Exercises 1-4 completed

**Your Personal Workspace**: All work in `/drafts/jsmith/` (use your name: first initial + last name, lowercase)

**What's already set up for you**:

The instructor has pre-configured the entire JSON2HTML pipeline so you can focus on understanding how it works:

| Component | Location | Status |
|-----------|----------|--------|
| **Data source** (Sheet) | `/future-events` in DA.live | ✅ Published — available as JSON |
| **List template** | `/labs/exercise5/events-template` in DA.live + repo | ✅ Ready |
| **Detail template** | `/labs/exercise5/event-template` in DA.live + repo | ✅ Ready |
| **Event block** | `blocks/event/event.js` + `event.css` in repo | ✅ Committed |
| **Worker config** | JSON2HTML Cloudflare worker | ✅ Configured for `main` branch |

**Verify data source exists**:

1. **Open in browser**:
   ```
   https://main--nycmasterclass--cloudadoption.aem.page/future-events.json
   ```

2. **You should see**: JSON with event records (Sydney, London, Bangalore, Berlin, Singapore, Dubai) including city, date, venue, highlights, images, etc.

3. **If you see 404**: Ask the instructor to publish the `/future-events` Sheet.

**Key concept**: Sheets in DA.live automatically become JSON endpoints. The Sheet at `/future-events` becomes available as `/future-events.json`.

---

## What You'll Learn

- How a pre-configured JSON2HTML pipeline generates multiple pages from a single JSON data source
- How Mustache templates transform JSON into HTML (list + detail templates)
- How the JSON2HTML worker service is configured and how it matches URL patterns
- How to add new data and see pages generated automatically
- How the `event` block decorates both list cards and detail pages with responsive grid layouts

---

## Why This Matters

**The challenge**: You need event pages for 6 cities **plus** a landing page — each page has the same structure but different data.

**The solution**: Use the JSON2HTML worker as a page generation engine — one JSON data source + Mustache templates = unlimited pages. In this exercise, the entire pipeline is pre-configured. You'll explore how it works and then prove it's dynamic by adding new events.

**Why use JSON2HTML**:
- **Zero manual authoring** - Worker generates pages from data automatically
- **Two templates, unlimited pages** - List view + detail view from one data source
- **Branch-aware** - Test on your branch before production
- **Easy maintenance** - Update template once → all pages update
- **Scalable** - 6 events or 600, same templates

**Real-world use cases**:
- Event series across multiple cities (list + individual event pages)
- Product catalog with browse page + product detail pages
- Speaker/author directory with grid listing + individual profiles
- Store locator with map/list view + individual store pages

---

## The Complete Data Flow

Understanding the entire flow from user request to rendered page:

```
┌─────────────┐
│   Browser   │  User visits /events/sydney
└──────┬──────┘
       │
       │ GET /events/sydney
       │
       ▼
┌─────────────┐
│  JSON2HTML  │  1. Matches /events/ pattern in config
│   Worker    │  2. Fetches /future-events.json
│ (Cloudflare)│  3. Filters to record where URL = "/events/sydney"
│             │  4. Fetches template: /labs/exercise5/event-template
│             │  5. Renders: Mustache template + JSON record = HTML
└──────┬──────┘
       │
       │ HTML response
       │
       ▼
┌─────────────┐
│   Browser   │  6. EDS decorates HTML (sections, blocks, wrappers)
│             │  7. Event block JS runs (reorganizes DOM)
│  [Rendered  │  8. Event block CSS applies (card or hero layout)
│    Page]    │  9. User sees fully styled event detail page
└─────────────┘
```

**For the list page** (`/events/list`):
- Worker does NOT filter — passes ALL records to template
- Template loops with `{{#data}}...{{/data}}` to render 6 event cards
- EDS wraps each card in an `.event-wrapper` inside one `.section`
- CSS grid lays out cards responsively (1/2/3 columns)

**Key insight**: The browser never calls the JSON endpoint directly. The worker fetches data, applies the template, and returns fully-formed HTML that EDS then decorates.

---

## Understanding the Data

The instructor has created a **Sheet in DA.live** at `/future-events` with upcoming masterclass events in 6 cities.

**JSON endpoint**: `https://main--nycmasterclass--cloudadoption.aem.page/future-events.json`

**Key fields in each record**:

| Field | Example | Used For |
|-------|---------|----------|
| `city` | Sydney | Page title, headings |
| `country` | Australia | Location display |
| `date` | March 15-16, 2026 | Event dates |
| `venue` | Sydney Convention Centre | Venue name |
| `address` | 14 Darling Drive, Sydney NSW 2000 | Full address |
| `description` | Join us for two days of... | Event description |
| `highlights` | 12 expert-led sessions, 8 hands-on labs, ... | What's included |
| `image` | https://images.unsplash.com/... | Hero/card image |
| `registrationUrl` | https://events.adobe.com/sydney-2026 | Register button |
| `URL` | /events/sydney | Page path (used by `pathKey`) |

**URL patterns**: `/events/sydney`, `/events/london`, `/events/bangalore`, `/events/berlin`, `/events/singapore`, `/events/dubai`

**Key concept**: The worker matches incoming requests (e.g., `/events/sydney`) to the correct record using the `URL` field, then renders it using your Mustache template.

---

## Step 1: Preview the Generated Pages

Everything is pre-configured. Start by seeing the result!

**Open the list page** (replace `jsmith` with your branch name):
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/events/list
```

**You should see**:
- "Upcoming Masterclass Events" heading
- Event cards in a responsive grid
  - **Mobile** (< 600px): 1 card per row
  - **Tablet** (≥ 600px): 2 cards per row
  - **Desktop** (≥ 900px): 3 cards per row
- Clicking "View Details" navigates to the detail page

**Open a detail page**:
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/events/sydney
```

**You should see**:
- Hero section with image, city name, date, registration button
- About, Event Details, What's Included sections
- "Back to All Events" link

**Test all cities**: `/events/sydney`, `/events/london`, `/events/bangalore`, `/events/berlin`, `/events/singapore`, `/events/dubai`

**All pages work!** (1 list + 6 detail) — No manual page creation was needed. These pages are generated entirely by the JSON2HTML worker from a single data source.

---

## Step 2: Understand the Templates

The instructor has created **two** Mustache templates in DA.live. Reference copies are also in `labs/exercise5/` in the repository.

### 2a. List Template (`events-template`)

**Location in DA.live**: `/labs/exercise5/events-template`

This template loops over **all** records using `{{#data}}...{{/data}}` and renders each as an `event` block card:

```html
<h1>Upcoming Masterclass Events</h1>
<p>Join us in 2026 for Edge Delivery Services training in cities worldwide.</p>

{{#data}}
<div class="event">
  <div>
    <div>
      <picture>
        <img src="{{image}}" alt="{{city}} skyline">
      </picture>
    </div>
  </div>
  <div>
    <div>
      <h3><a href="{{URL}}">{{city}} Masterclass</a></h3>
      <p><strong>{{date}}</strong></p>
      <p>{{venue}}, {{country}}</p>
      <p>{{description}}</p>
      <p><a href="{{URL}}">View Details</a></p>
    </div>
  </div>
</div>
{{/data}}
```

**Critical**: All `{{#data}}` event blocks must be in the **same section** (no `---` between them). This ensures EDS places all `.event-wrapper` elements inside one `.section`, allowing the CSS grid to work.

### 2b. Detail Template (`event-template`)

**Location in DA.live**: `/labs/exercise5/event-template`

This template renders a **single** event's full details. Key snippet:

```html
<div class="event">
  <div><div><picture><img src="{{image}}" alt="{{city}} skyline"></picture></div></div>
  <div><div>
    <h1>{{city}} Masterclass 2026</h1>
    <p><strong>{{date}}</strong> · {{venue}}</p>
    <p><a href="{{registrationUrl}}">Register Now</a></p>
  </div></div>
</div>
---
## About This Event
{{description}}
---
## Event Details
- **Location:** {{venue}}, {{city}}, {{country}}
- **Address:** {{address}}
- **Date:** {{date}}
```

**Mustache syntax reference**:
- `{{variable}}` — Outputs value (e.g., `{{city}}` → "Sydney")
- `{{#array}}...{{/array}}` — Loops over array (list template uses `{{#data}}`)

**Reference**: [Mustache Documentation](https://mustache.github.io/mustache.5.html)

---

## Step 3: Understand the Worker Configuration

The JSON2HTML worker has been configured with two path rules. Here's the configuration that was POSTed:

```json
[
  {
    "path": "/events/list",
    "endpoint": "https://main--nycmasterclass--cloudadoption.aem.page/future-events.json",
    "arrayKey": "data",
    "template": "/labs/exercise5/events-template"
  },
  {
    "path": "/events/",
    "endpoint": "https://main--nycmasterclass--cloudadoption.aem.page/future-events.json",
    "arrayKey": "data",
    "pathKey": "URL",
    "template": "/labs/exercise5/event-template"
  }
]
```

**What this configuration does**:

| Config | List Page | Detail Pages |
|--------|-----------|--------------|
| **path** | `/events/list` — exact match | `/events/` — matches all `/events/*` |
| **pathKey** | *(omitted)* — no filtering | `URL` — filters to matching record |
| **template** | `events-template` — loops all records | `event-template` — renders single event |

**Important**: `/events/list` must come **before** `/events/` in the array. The worker matches top-to-bottom, and `/events/` would match `/events/list` if it came first.

**Key insight**: The worker is **branch-aware**. Your branch (`jsmith`) uses your config while main uses a different one. Zero conflicts!

**How to view or update the config**: Use the [Admin Edit Tool](https://tools.aem.live/tools/admin-edit/) with a **GET** request to:
```
https://json2html.adobeaem.workers.dev/config/cloudadoption/nycmasterclass/jsmith
```

---

## Step 4: Test Templates in Simulator

Try the **JSON2HTML Simulator** to see exactly how templates are rendered.

**Open**: [https://tools.aem.live/tools/json2html-simulator/](https://tools.aem.live/tools/json2html-simulator/)

### Test the Detail Template:

1. **JSON Data** (left panel):
   - Open `https://main--nycmasterclass--cloudadoption.aem.page/future-events.json` in browser
   - Copy the entire JSON response and paste into the panel

2. **Simulator Options** (click ⚙ Options):
   - **arrayKey**: `data`
   - **pathKey**: `URL`
   - **testPath**: `/events/sydney`

3. **Mustache Template** (middle panel):
   - Paste the **event-template** content from `labs/exercise5/event-template.html`

4. **Click "Render"** or press `Cmd+Enter`

**You should see**: Fully rendered HTML for the Sydney event.

**Try other cities**: Change **testPath** to `/events/london`, `/events/bangalore`, etc.

### Test the List Template:

1. **Simulator Options**: Set **pathKey** to empty, **testPath** to `/events/list`
2. **Mustache Template**: Paste the **events-template** content
3. **Click "Render"**

**You should see**: HTML with all event cards rendered.

---

## Step 5: Add New Events to the Data Sheet

Now prove the system is truly dynamic — add new events and watch the pages generate automatically.

### 5a. Open the Future Events Sheet

1. **In DA.live**, navigate to: `/future-events`
   ```
   https://da.live/#/cloudadoption/nycmasterclass/future-events
   ```

2. You should see a spreadsheet with the existing events (Sydney, London, Bangalore, Berlin, Singapore, Dubai).

### 5b. Add 2-3 New Events

Add new rows to the sheet with new cities. For each row, fill in all columns to match the existing data format:

| Field | Example for New York | Example for Tokyo |
|-------|---------------------|-------------------|
| `city` | New York | Tokyo |
| `country` | United States | Japan |
| `date` | September 20-21, 2026 | October 10-11, 2026 |
| `venue` | Javits Center | Tokyo Big Sight |
| `address` | 429 11th Ave, New York, NY 10001 | 3-11-1 Ariake, Koto City, Tokyo |
| `description` | Two days of hands-on Edge Delivery Services training in the heart of Manhattan. | Experience EDS training in Tokyo with expert-led sessions and hands-on labs. |
| `highlights` | 10 expert-led sessions, 6 hands-on labs, networking lunch, certification prep | 10 sessions, 6 labs, bento networking lunch, Japanese localization workshop |
| `image` | *(use any Unsplash city image URL)* | *(use any Unsplash city image URL)* |
| `registrationUrl` | https://events.adobe.com/newyork-2026 | https://events.adobe.com/tokyo-2026 |
| `URL` | /events/newyork | /events/tokyo |

> **Tip**: Copy an existing row and modify the values to ensure you have all required columns.

### 5c. Preview and Publish

1. **Preview** the sheet in DA.live (click the Preview button)
2. Wait a few seconds for the JSON endpoint to update

### 5d. Verify the List Updates

1. **Refresh the list page**:
   ```
   https://jsmith--nycmasterclass--cloudadoption.aem.page/events/list
   ```

2. **You should see**: Your new events appear as additional cards in the grid alongside the original events.

3. **Test a new detail page**:
   ```
   https://jsmith--nycmasterclass--cloudadoption.aem.page/events/newyork
   ```

4. **You should see**: A fully rendered detail page for your new city — generated automatically from the data you just added.

**Key takeaway**: You didn't create any new templates or update any code. You only added data to the sheet, and the worker + templates generated new pages automatically. This is the power of JSON2HTML.

---

## Step 6: Understanding How the Event Block Works

The `event` block (`blocks/event/event.js` and `event.css`) uses **smart CSS selectors** to detect whether it's rendering a list or a detail view.

### EDS DOM Structure

When the worker returns HTML with multiple `<div class="event">` blocks in one section, EDS decorates it like this:

**Input** (from worker):
```html
<div>
  <div class="event">...</div>
  <div class="event">...</div>
  <div class="event">...</div>
</div>
```

**After EDS decoration**:
```html
<div class="section event-container">
  <div class="event-wrapper">
    <div class="event block" data-block-name="event">...</div>
  </div>
  <div class="event-wrapper">
    <div class="event block" data-block-name="event">...</div>
  </div>
  <div class="event-wrapper">
    <div class="event block" data-block-name="event">...</div>
  </div>
</div>
```

**Key observations**:
1. Each `<div class="event">` gets wrapped in a `<div class="event-wrapper">`
2. The parent `<div>` becomes `<div class="section event-container">`
3. `.event-wrapper` elements are **direct children** of `.section` (no intermediate div!)

### CSS Detection Pattern

The CSS uses this to differentiate list vs. detail:

```css
/* Detail: section has exactly ONE event-wrapper */
main .section.event-container > .event-wrapper:only-child .event { ... }

/* List: section has MULTIPLE event-wrappers → apply grid */
main .section.event-container:has(> .event-wrapper ~ .event-wrapper) { ... }
```

**Why this matters**: If you target `main .section > div:has(> .event-wrapper)` (with an extra `> div`), nothing will match because `.event-wrapper` elements are direct children of `.section`, not nested inside an intermediate `div`.

---

## Step 7: Commit Your Changes

The `event` block is already committed to `main`. If you haven't merged it into your branch yet, do so now:

```bash
# Ensure your branch has the latest event block
git pull origin main

# Verify block files exist
ls blocks/event/

# Push to your branch
git push origin jsmith
```

Replace `jsmith` with your branch name.

**What's already committed** (in `main`):
- `blocks/event/event.js` — Block decoration logic
- `blocks/event/event.css` — Styles for list cards and detail views

**What lives in DA.live** (set up by instructor):
- `/labs/exercise5/events-template` — List page Mustache template
- `/labs/exercise5/event-template` — Detail page Mustache template
- `/future-events` — Data sheet (JSON endpoint)

**What lives in the worker service** (configured by instructor):
- JSON2HTML worker configuration (path patterns, endpoints, templates)

---

## Real-World Applications

**Use Case 1: Multi-City Event Series** (this exercise!)
- **Data**: Single JSON with all event details
- **Templates**: List template + detail template
- **Result**: Add new city → just update JSON, both list and detail auto-generate
- **Scale**: Hundreds of events without manual authoring

**Use Case 2: Product Catalogs**
- **Data**: Products JSON or API (SKU, price, specs, images)
- **URL Pattern**: `/products/` (grid) + `/products/laptop-model-123` (detail)
- **Result**: 2 templates → 1000+ product pages + browse pages

**Use Case 3: Speaker/Author Profiles**
- **Data**: Speakers JSON (name, bio, photo, sessions)
- **URL Pattern**: `/speakers/` (directory) + `/speakers/john-doe` (profile)
- **Result**: Dynamic speaker pages from central data

**Use Case 4: Store Locator**
- **Data**: Locations JSON (address, hours, services)
- **URL Pattern**: `/stores/` (list) + `/stores/new-york-manhattan` (detail)
- **Result**: Individual pages for each store + browsable directory

**Common Pattern**:
```
JSON Data → Worker → [Match Path + Apply Template] → HTML → EDS Decoration → Styled Page
```

---

## Key Takeaways

- **JSON2HTML worker** transforms JSON data into HTML pages using Mustache templates
- **Two templates** — list template (loops with `{{#data}}`) and detail template (single record)
- **One block, two views** — the `event` block decorates both list cards and detail pages
- **Add data, get pages** — new rows in the sheet automatically generate new list cards and detail pages
- **CSS `:has()` selector** — detects list vs. detail by counting `.event-wrapper` children
- **EDS DOM structure** — `.event-wrapper` elements are direct children of `.section` (no intermediate div)
- **Responsive grid** — 1 column mobile, 2 tablet, 3 desktop
- **Branch-aware** — Test on your branch without affecting production
- **Worker config ordering matters** — specific paths before general ones
- **Scale effortlessly** — 6 events or 600, same templates

**The pattern**: Data in JSON → Templates in DA.live → Worker config → Pages generate automatically

---

## Verification Checklist

- [ ] **List page renders** at `/events/list` with responsive grid (1/2/3 columns)
- [ ] **All detail pages render** (`/events/sydney`, `/events/london`, etc.)
- [ ] **Navigation works** — list → detail via "View Details", detail → list via "Back"
- [ ] **Understand list template** — loops with `{{#data}}`, all blocks in one section
- [ ] **Understand detail template** — single record rendering with `{{variable}}` syntax
- [ ] **Understand worker config** — path ordering, arrayKey, pathKey, template
- [ ] **Tested in simulator** with real `future-events.json` data (both templates)
- [ ] **Added new events** to the future-events sheet in DA.live
- [ ] **New events appear** on list page and generate working detail pages automatically
- [ ] **Understand EDS DOM** — `.event-wrapper` as direct children of `.section`
- [ ] **Understand complete flow**: Request → Worker → JSON + Template → HTML → EDS → Styled Page
- [ ] **Branch has event block** — `blocks/event/event.js` and `event.css` available on your branch

---

## Troubleshooting Common Issues

**List page shows cards in one column (no grid)**:
- Verify all `<div class="event">` blocks are inside **one section** (one parent `<div>`)
- Check that there are no `---` section dividers between event blocks in the list template
- Confirm `.event-wrapper` elements are direct children of `.section` (inspect in DevTools)
- The CSS selector requires 2+ wrappers at the same level

**Pages show "Not Found"**:
- Verify worker config path patterns match the URL
- Check that `/events/list` config comes **before** `/events/` in the array
- Check that you're using the correct branch URL
- Ensure config was POSTed successfully (check response)

**Template doesn't render**:
- Verify template path in config matches DA.live path exactly
- Check for typos in Mustache variable names (case-sensitive!)
- Test in simulator first to isolate issues

**Data missing or wrong**:
- Verify `arrayKey` points to correct array in JSON (`data`)
- Verify `pathKey` matches the field name exactly (`URL`)
- Check that `URL` values in JSON match request paths

**"401 Unauthorized"**:
- Verify admin token is correct
- Token must have permissions for config endpoint

**Block not loading**:
- Verify `blocks/event/event.js` and `blocks/event/event.css` are committed and pushed
- Check browser DevTools console for JS errors
- Ensure the block class name in HTML (`event`) matches the folder name (`blocks/event/`)

**New events don't appear on the list page**:
- Verify you **previewed** the sheet in DA.live after adding rows (click the Preview button)
- Check the JSON endpoint directly — open `https://main--nycmasterclass--cloudadoption.aem.page/future-events.json` and confirm your new records are in the `data` array
- Verify the `URL` field in your new row follows the pattern `/events/cityname` (lowercase, no spaces)
- Worker may cache briefly — wait 1-2 minutes and hard refresh and/or use *update* from sidekick

**Changes don't appear**:
- Worker config is cached briefly — wait 1-2 minutes
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R) and/or use *update* from sidekick
- Check you're on the correct branch URL

**Use Browser DevTools to debug**:
1. Open DevTools → Elements tab
2. Inspect the `.section.event-container` to verify `.event-wrapper` structure
3. Check Console tab for block loading errors
4. Check Network tab to verify CSS/JS files are loading

---

## References

- [JSON2HTML Documentation](https://www.aem.live/developer/json2html)
- [JSON2HTML Simulator](https://tools.aem.live/tools/json2html-simulator/)
- [Admin Edit Tool](https://tools.aem.live/tools/admin-edit/)
- [Mustache Documentation](https://mustache.github.io/mustache.5.html)
- [EDS Markup Reference](https://www.aem.live/developer/markup-sections-blocks)
- [CSS :has() Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)

---

## Next Exercise

**Exercise 6**: Form Submissions with Workers - You'll learn how to build forms that securely submit data through Cloudflare Workers to external services like Slack.
