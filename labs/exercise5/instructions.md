# Exercise 5: JSON2HTML - Generate Pages from Data

**Duration**: 25 minutes

---

## Prerequisites

**Complete [SETUP.md](../SETUP.md) if not already done.**

Required:
- On your feature branch (`jsmith` - your first initial + last name)
- Local dev server running at `http://localhost:3000`
- Admin API token (instructor will provide)
- Exercises 1-4 completed

**Your Personal Workspace**: All work in `/drafts/jsmith/` (use your name: first initial + last name, lowercase)

**Verify data source exists**:

The instructor has created a **Sheet** in DA.live with future event data. Verify it exists:

1. **Open in browser**:
   ```
   https://main--nycmasterclass--cloudadoption.aem.page/future-events.json
   ```

2. **You should see**: JSON with 6 event records (Sydney, London, Bangalore, Berlin, Singapore, Dubai) including city, date, venue, highlights, images, etc.

3. **If you see 404**: Ask the instructor to publish the `/future-events` Sheet to main branch.

**Key concept**: Sheets in DA.live automatically become JSON endpoints. The Sheet at `/future-events` becomes available as `/future-events.json`.

---

## What You'll Learn

- How to generate multiple pages from a single JSON data source using **two templates** (list + detail)
- How to create Mustache templates that transform JSON into HTML
- How to configure the JSON2HTML worker service
- How to use the JSON2HTML Simulator and Admin Edit tools
- How the `event` block decorates both list cards and detail pages with responsive grid layouts

---

## Why This Matters

Forms are critical for data-driven pages: event listings, product catalogs, speaker directories, store locators.

**The challenge**: You need to create event pages for 6 cities **plus** a landing page that lists all events. Each page has the same structure but different data.

**The solution**: Use the JSON2HTML worker as a page generation engine — one JSON data source + Mustache templates = unlimited pages.

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

## Step 1: Use the Existing Event Block

In this project, the event block is already implemented:

```
blocks/
  event/
    event.js
    event.css
```

Use this block instead of creating one from scratch.

What this block does:
- Extracts the image into a `.event-image` wrapper
- Extracts all text content into a `.event-body` wrapper
- Wraps everything in a `.event-container` for flex layout
- Works identically for list cards (h3) and detail pages (h1)
- CSS detects list vs. detail view using `:has()` and `:only-child` selectors
- Responsive grid: 1 column mobile, 2 tablet, 3 desktop

---

## Step 2: Create Mustache Templates in DA.live

You need **two** templates — one for the list page and one for the detail page. Reference templates are available in `labs/exercise5/`.

### 2a. Events List Template

**In DA.live**, create page: `/labs/exercise5/events-template`

Copy the content from `labs/exercise5/events-template.html` in the repository.

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

### 2b. Event Detail Template

**In DA.live**, create page: `/labs/exercise5/event-template`

Copy the content from `labs/exercise5/event-template.html` in the repository.

This template renders a **single** event's full details:

```html
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
      <h1>{{city}} Masterclass 2026</h1>
      <p><strong>{{date}}</strong> · {{venue}}</p>
      <p><a href="{{registrationUrl}}">Register Now</a></p>
    </div>
  </div>
</div>

---

## About This Event

{{description}}

---

## Event Details

- **Location:** {{venue}}, {{city}}, {{country}}
- **Address:** {{address}}
- **Date:** {{date}}

---

## What's Included

{{highlights}}

---

[← Back to All Events](/events/list)
```

**Mustache syntax reference**:
- `{{variable}}` - Outputs value (e.g., `{{city}}` → "Sydney")
- `{{#array}}...{{/array}}` - Loops over array (used in list template with `{{#data}}`)
- `{{.}}` - Current item in loop

**Reference**: [Mustache Documentation](https://mustache.github.io/mustache.5.html)

---

## Step 3: Test Templates in Simulator

Before configuring the worker, test your templates with real data using the **JSON2HTML Simulator**.

**Open**: [https://tools.aem.live/tools/json2html-simulator/](https://tools.aem.live/tools/json2html-simulator/)

### Test the Detail Template:

1. **JSON Data** (left panel):
   - Open `https://main--nycmasterclass--cloudadoption.aem.page/future-events.json` in browser
   - Copy the entire JSON response
   - Paste into the "JSON Data" panel

2. **Simulator Options** (click ⚙ Options):
   - **arrayKey**: `data`
   - **pathKey**: `URL`
   - **testPath**: `/events/sydney`

3. **Mustache Template** (middle panel):
   - Paste your **event-template** content

4. **Click "Render"** or press `Cmd+Enter`

**You should see**: Fully rendered HTML for the Sydney event.

**Test other cities**: Change **testPath** to `/events/london`, `/events/bangalore`, etc.

### Test the List Template:

1. **Simulator Options**: Set **pathKey** to empty, **testPath** to `/events/list`
2. **Mustache Template**: Paste your **events-template** content
3. **Click "Render"**

**You should see**: HTML with all 6 event cards rendered.

**Reference**: [JSON2HTML Simulator](https://tools.aem.live/tools/json2html-simulator/)

---

## Step 4: Configure JSON2HTML Worker

Now configure the worker to generate pages automatically.

**Open**: [https://tools.aem.live/tools/admin-edit/](https://tools.aem.live/tools/admin-edit/)

### Configure the Admin Edit Tool:

1. **Admin URL** (replace `jsmith` with your branch name):
   ```
   https://json2html.adobeaem.workers.dev/config/cloudadoption/nycmasterclass/jsmith
   ```

2. **Method**: Select **POST**

3. **Body**:
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

4. **Authorization**: Enter the admin token provided by the instructor.

5. **Click "POST"**

**You should see**: Success response (200 OK).

**What this configuration does**:

| Config | List Page | Detail Pages |
|--------|-----------|--------------|
| **path** | `/events/list` — exact match | `/events/` — matches all `/events/*` |
| **pathKey** | *(omitted)* — no filtering | `URL` — filters to matching record |
| **template** | `events-template` — loops all records | `event-template` — renders single event |

**Important**: `/events/list` must come **before** `/events/` in the array. The worker matches top-to-bottom, and `/events/` would match `/events/list` if it came first.

**Key insight**: The worker is **branch-aware**. Your branch (`jsmith`) uses your config while main uses a different one. Zero conflicts!

---

## Step 5: Preview Generated Pages

Now test that the worker is generating pages!

**Open in browser** (replace `jsmith` with your branch name):
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/events/list
```

**You should see**:
- "Upcoming Masterclass Events" heading
- 6 event cards in a responsive grid
  - **Mobile** (< 600px): 1 card per row
  - **Tablet** (≥ 600px): 2 cards per row
  - **Desktop** (≥ 900px): 3 cards per row
- Clicking "View Details" navigates to the detail page

**Test a detail page**:
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/events/sydney
```

**You should see**:
- Hero section with image, city name, date, registration button
- About, Event Details, What's Included sections
- "Back to All Events" link

**Test all 6 cities**:
- `/events/sydney`, `/events/london`, `/events/bangalore`
- `/events/berlin`, `/events/singapore`, `/events/dubai`

**All 7 pages work!** (1 list + 6 detail) — No manual page creation needed.

---

## Step 6: Understanding How the Event Block Works

The `event` block uses **smart CSS selectors** to detect whether it's rendering a list or a detail view. Understanding this helps when building similar patterns.

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

The `event` block code must be committed to your branch for EDS to load it.

```bash
# Run linting
npm run lint

# Add changes
git add blocks/event/event.js blocks/event/event.css

# Commit
git commit -m "feat: add event block for JSON2HTML list and detail pages"

# Push
git push origin jsmith
```

Replace `jsmith` with your branch name.

**What gets committed**:
- `blocks/event/event.js` — Block decoration logic
- `blocks/event/event.css` — Styles for list cards and detail views

**What lives in DA.live** (templates copied from repo):
- `/labs/exercise5/events-template` — List page Mustache template
- `/labs/exercise5/event-template` — Detail page Mustache template

**What lives in the worker service** (not committed):
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
- **CSS `:has()` selector** — detects list vs. detail by counting `.event-wrapper` children
- **EDS DOM structure** — `.event-wrapper` elements are direct children of `.section` (no intermediate div)
- **Responsive grid** — 1 column mobile, 2 tablet, 3 desktop
- **Branch-aware** — Test on your branch without affecting production
- **Worker config ordering matters** — specific paths before general ones
- **Scale effortlessly** — 6 events or 600, same templates

**The pattern**: Data in JSON → Templates in DA.live → Worker config → Pages generate automatically

---

## Verification Checklist

- [ ] **Using existing event block** (`blocks/event/event.js`, `blocks/event/event.css`)
- [ ] **Created list template** in DA.live at `/labs/exercise5/events-template`
- [ ] **Created detail template** in DA.live at `/labs/exercise5/event-template`
- [ ] **Tested in simulator** with real `future-events.json` data (both templates)
- [ ] **Configured worker** using Admin Edit tool with both path configs
- [ ] **List page renders** at `/events/list` with responsive grid (1/2/3 columns)
- [ ] **All 6 detail pages render** (`/events/sydney`, `/events/london`, etc.)
- [ ] **Data populates correctly** (city, date, venue, highlights, images)
- [ ] **Navigation works** — list → detail via "View Details", detail → list via "Back"
- [ ] **Committed and pushed** the `event` block code
- [ ] **Understand worker config** — path ordering, arrayKey, pathKey, template
- [ ] **Understand EDS DOM** — `.event-wrapper` as direct children of `.section`
- [ ] **Understand complete flow**: Request → Worker → JSON + Template → HTML → EDS → Styled Page

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

**Changes don't appear**:
- Worker config is cached briefly — wait 1-2 minutes
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
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
