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
- How to build an `event` block that decorates both list cards and detail pages
- How to implement responsive grid layouts (1/2/3 columns) for card views
- How to configure the JSON2HTML worker service
- How to use the JSON2HTML Simulator and Admin Edit tools
- How to test locally using static HTML files before deploying templates

---

## Why This Matters

**The problem**: You need to create event pages for 6 cities **plus** a landing page that lists all events. Each page has the same structure but different data (city, date, venue, etc.).

**Manual approach**: Create 7 pages by hand in DA.live. Time-consuming, error-prone, hard to maintain. If the layout changes, update all 7 pages.

**JSON2HTML approach**:
- Create **two** Mustache templates (one for the list, one for detail)
- Store event data in **one** JSON file (6 records)
- Create **one** `event` block that handles both views
- Configure the JSON2HTML worker
- Worker generates all 7 pages automatically (1 list + 6 detail)
- Update template once → all pages update automatically
- Add a 7th city? Just add JSON, no new page needed

**The pattern**:
```
1. Data in JSON: /future-events.json (6 city records)
2. List template: events-template.html (loops over all records, shows cards)
3. Detail template: event-template.html (shows one record's full details)
4. Worker configuration: Maps /events/list → list template, /events/sydney → detail template
5. Event block: blocks/event/ (decorates both list cards and detail pages)
6. Result: 7 pages (1 list + 6 detail), zero manual authoring
```

**Real-world use cases**:
- Event series across multiple cities (list + individual event pages)
- Product catalog with browse page + product detail pages
- Speaker/author directory with grid listing + individual profiles
- Store locator with map/list view + individual store pages

---

## How JSON2HTML Works

The JSON2HTML worker is a generic Edge Delivery Services worker that transforms JSON data into HTML pages using Mustache templates.

**Architecture — Detail Page**:
```
1. User visits: /events/sydney
2. Worker checks config for /events/ pattern
3. Worker fetches: /future-events.json
4. Worker filters to: { "city": "Sydney", "URL": "/events/sydney", ... }
5. Worker fetches template: /drafts/jsmith/templates/event-template
6. Worker renders: Mustache template + single JSON record = HTML
7. User sees: Fully rendered event detail page for Sydney
```

**Architecture — List Page**:
```
1. User visits: /events/list
2. Worker checks config for /events/list pattern
3. Worker fetches: /future-events.json
4. Worker passes ALL records (no filtering — list shows everything)
5. Worker fetches template: /drafts/jsmith/templates/events-template
6. Worker renders: Mustache template loops over all records = HTML
7. User sees: Grid of 6 event cards with responsive layout
```

**Key benefits**:
- **No custom code for page generation** - Hosted worker service, zero deployment
- **Branch-aware** - Test on your branch before production
- **Mustache templates** - Simple, logic-less syntax
- **Flexible** - Works with any JSON structure
- **Two templates, unlimited pages** - List view + detail view from one data source

**Reference**: [JSON2HTML Documentation](https://www.aem.live/developer/json2html)

---

## Understanding the Data: Future Events Sheet

The instructor has created a **Sheet in DA.live** at `/future-events` with upcoming masterclass events in 6 cities.

**Sheet in DA.live**: `/future-events` (editable spreadsheet)

**JSON endpoint**: `https://main--nycmasterclass--cloudadoption.aem.page/future-events.json`

**Key concept**: Sheets automatically become JSON endpoints. Authors edit the Sheet, developers consume the JSON.

**Sheet structure** (what the author sees in DA.live):

| city | country | date | venue | address | description | highlights | image | registrationUrl | URL |
|------|---------|------|-------|---------|-------------|------------|-------|-----------------|-----|
| Sydney | Australia | March 15-16, 2026 | Sydney Convention Centre | ... | Join us for... | 12 expert-led sessions, 8 hands-on labs, ... | https://images.unsplash.com/... | https://events.adobe.com/sydney-2026 | /events/sydney |
| London | United Kingdom | April 20-21, 2026 | ExCeL London | ... | Experience two days... | ... | ... | ... | /events/london |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**JSON structure** (what the developer gets):
```json
{
  "total": 6,
  "data": [
    {
      "city": "Sydney",
      "country": "Australia",
      "date": "March 15-16, 2026",
      "venue": "Sydney Convention Centre",
      "address": "14 Darling Drive, Sydney NSW 2000",
      "description": "Join us for two days of hands-on Edge Delivery Services training in Sydney. Master the fundamentals of building blazing-fast websites with AEM.",
      "highlights": "12 expert-led sessions, 8 hands-on labs, Networking dinner at Sydney Opera House, Certificate of completion",
      "image": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200",
      "registrationUrl": "https://events.adobe.com/sydney-2026",
      "URL": "/events/sydney"
    },
    ...
  ]
}
```

**URL patterns**: Each event has a unique URL path in the `URL` field:
- `/events/sydney`
- `/events/london`
- `/events/bangalore`
- `/events/berlin`
- `/events/singapore`
- `/events/dubai`

**Key concept**: The JSON2HTML worker will match incoming requests (e.g., `/events/sydney`) to the correct record using the `URL` field, then render it using your Mustache template.

**Note on `highlights` field**: In the Sheet, this is stored as a comma-separated string (e.g., "12 expert-led sessions, 8 hands-on labs, Networking dinner, Certificate"). In the Mustache template, we simply output it as a paragraph: `{{highlights}}`. Mustache is logic-less, so it can't split strings into arrays.

---

## Step 1: Create the Event Block

Before creating templates, we need an `event` block that will decorate the HTML generated by JSON2HTML. This single block handles **both** the list-view cards and the detail-view page.

### 1a. Create the Block JavaScript

**File**: `blocks/event/event.js`

```javascript
/**
 * Decorate the event block.
 * Handles both list-view cards and detail-view pages generated by JSON2HTML.
 * @param {Element} block the block element
 */
export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'event-container';

  // Extract heading — could be h1 (detail), h2, or h3 (list card)
  const heading = block.querySelector('h1, h2, h3');
  if (heading) {
    heading.classList.add('event-heading');
  }

  // Extract image
  const picture = block.querySelector('picture');
  if (picture) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'event-image';
    imageWrapper.append(picture);
    container.append(imageWrapper);
  }

  // Extract body content (everything after the image row)
  const bodyWrapper = document.createElement('div');
  bodyWrapper.className = 'event-body';

  // Get the content cells — the block has rows with div > div structure
  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      // Skip cells that only contained the picture (already moved)
      if (cell.children.length === 0 && cell.textContent.trim() === '') return;
      if (cell.querySelector('picture') && cell.children.length === 1) return;

      // Move remaining content to body
      while (cell.firstChild) {
        bodyWrapper.append(cell.firstChild);
      }
    });
  });

  container.append(bodyWrapper);

  // Replace block content with reorganized structure
  block.textContent = '';
  block.append(container);
}
```

**What this does**:
- Extracts the image into a `.event-image` wrapper
- Extracts all text content into a `.event-body` wrapper
- Wraps everything in a `.event-container` for flex layout
- Works identically for list cards (h3) and detail pages (h1)

### 1b. Create the Block CSS

**File**: `blocks/event/event.css`

This CSS handles **both** list-view and detail-view using smart CSS selectors that detect whether the section contains one or multiple event blocks.

```css
/* Event block — masterclass theme
   Handles list-view cards and detail-view pages generated by JSON2HTML */

/* ------------------------------------------------
   Shared styles
   ------------------------------------------------ */
main .event {
  background-color: var(--card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid rgb(255 255 255 / 5%);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

main .event .event-container {
  display: flex;
  flex-direction: column;
}

/* Image */
main .event .event-image {
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--brand-3) 0%, var(--brand-1) 100%);
}

main .event .event-image picture {
  display: block;
  width: 100%;
  height: 100%;
}

main .event .event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

/* Body */
main .event .event-body {
  padding: 1.5rem;
}

main .event .event-heading {
  color: white;
  font-weight: 700;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

main .event .event-body p {
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0.4rem 0;
}

main .event .event-body p strong {
  color: var(--brand-1);
  font-weight: 600;
}

/* Links inside event (non-button) */
main .event .event-body a:not(.button) {
  color: var(--brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

main .event .event-body a:not(.button):hover {
  color: var(--brand-2);
  text-decoration: underline;
}
```

**Key CSS pattern — Detecting list vs. detail view**:

EDS wraps each block in a `<div class="event-wrapper">` and adds `event-container` to the parent `.section`. The CSS uses `:has()` and `:only-child` to differentiate:

```css
/* Detail: section has exactly ONE event-wrapper */
main .section.event-container > .event-wrapper:only-child .event { ... }

/* List: section has MULTIPLE event-wrappers → apply grid */
main .section.event-container:has(> .event-wrapper ~ .event-wrapper) { ... }
```

**Important EDS DOM insight**: After decoration, `.event-wrapper` elements are **direct children** of `.section` — there is no intermediate `<div>` between them. This is critical for getting the CSS selectors right.

**Responsive grid for list view** (add to the CSS):

```css
/* List-view: responsive grid */
main .section.event-container:has(> .event-wrapper ~ .event-wrapper) {
  display: grid;
  grid-template-columns: 1fr;       /* Mobile: 1 column */
  gap: 2rem;
  max-width: 1200px;
  margin: auto;
  padding: 0 24px;
}

@media (width >= 600px) {
  main .section.event-container:has(> .event-wrapper ~ .event-wrapper) {
    grid-template-columns: repeat(2, 1fr);  /* Tablet: 2 columns */
  }
}

@media (width >= 900px) {
  main .section.event-container:has(> .event-wrapper ~ .event-wrapper) {
    grid-template-columns: repeat(3, 1fr);  /* Desktop: 3 columns */
  }
}
```

The full CSS file is available in `blocks/event/event.css` in the repository.

---

## Step 2: Create Mustache Templates

You need **two** templates — one for the list page and one for the detail page. Reference templates are available in `labs/exercise5/`.

### 2a. Events List Template

**In DA.live**, create page: `/drafts/jsmith/templates/events-template` (use your name)

This template loops over **all** records using `{{#data}}...{{/data}}` and renders each as an `event` block card.

```html
<h1>Upcoming Masterclass Events</h1>
<p>Join us in 2026 for Edge Delivery Services training in cities worldwide. Select an event below to learn more and register.</p>

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

**Critical structure detail**: The `{{#data}}...{{/data}}` loop generates multiple `<div class="event">` blocks. In the DA.live page, these blocks must all be in the **same section** (i.e. no horizontal rules `---` between them). This ensures EDS places all `.event-wrapper` elements inside one `.section`, allowing the CSS grid to lay them out in columns.

**Reference**: See `labs/exercise5/events-template.html` for the full template with `<html>` wrapper.

### 2b. Event Detail Template

**In DA.live**, create page: `/drafts/jsmith/templates/event-template` (use your name)

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

**Note**: The `---` in DA.live content creates section dividers, separating each content area into its own section.

**Reference**: See `labs/exercise5/event-template.html` for the full template with `<html>` wrapper.

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
   - Fetch the real data: Open `https://main--nycmasterclass--cloudadoption.aem.page/future-events.json` in browser
   - Copy the entire JSON response
   - Paste into the "JSON Data" panel

2. **Simulator Options** (click ⚙ Options):
   - **arrayKey**: `data`
   - **pathKey**: `URL`
   - **testPath**: `/events/sydney`
   - This filters to only the Sydney event record

3. **Mustache Template** (middle panel):
   - Copy your **event-template** content from DA.live
   - Paste into the "Mustache Template" panel

4. **Click "Render"** or press `Cmd+Enter`

**You should see**: Fully rendered HTML for the Sydney event in the preview panel.

**Test other cities**: Change **testPath** to `/events/london`, `/events/bangalore`, etc. and re-render.

### Test the List Template:

1. **Simulator Options** (click ⚙ Options):
   - **arrayKey**: `data`
   - **pathKey**: (leave empty — list shows all records)
   - **testPath**: `/events/list`

2. **Mustache Template**: Paste your **events-template** content

3. **Click "Render"**

**You should see**: HTML with all 6 event cards rendered.

**Fix any issues**: If variables don't render, check spelling in JSON vs template.

**Reference**: [JSON2HTML Simulator Documentation](https://tools.aem.live/tools/json2html-simulator/)

---

## Step 4: Test Locally with Static HTML

Before configuring the worker, test the block styling locally using static HTML files that simulate JSON2HTML output.

### 4a. Start the dev server with HTML folder

```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts
```

### 4b. Create local test files

Create `drafts/events/list.plain.html` — a static HTML file that simulates what the **events-template** produces. This lets you develop and test the `event` block CSS locally.

**Example structure** (showing 2 of 6 events for brevity):
```html
<html>
<body>
  <header></header>
  <main>
    <div>
      <h1>Upcoming Masterclass Events</h1>
      <p>Join us in 2026 for Edge Delivery Services training in cities worldwide.</p>
    </div>

    <div>
      <div class="event">
        <div>
          <div>
            <picture>
              <img src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=750" alt="Sydney skyline">
            </picture>
          </div>
        </div>
        <div>
          <div>
            <h3><a href="/drafts/events/sydney">Sydney Masterclass</a></h3>
            <p><strong>March 15-16, 2026</strong></p>
            <p>Sydney Convention Centre, Australia</p>
            <p>Join us for two days of hands-on Edge Delivery Services training.</p>
            <p><a href="/drafts/events/sydney">View Details</a></p>
          </div>
        </div>
      </div>

      <div class="event">
        <!-- ... repeat for each city ... -->
      </div>
    </div>
  </main>
  <footer></footer>
</body>
</html>
```

**Critical**: All `<div class="event">` blocks must be inside **one parent `<div>`**. EDS will make this parent a `.section` and each event gets an `.event-wrapper` — all as direct children of that section. This is what allows the CSS grid to work.

Similarly, create `drafts/events/sydney.plain.html` for the detail view (a single event).

### 4c. Verify locally

- **List page**: `http://localhost:3000/drafts/events/list`
  - You should see 6 event cards in a responsive grid (1/2/3 columns)
- **Detail page**: `http://localhost:3000/drafts/events/sydney`
  - You should see a full-width hero with event details below

---

## Step 5: Configure JSON2HTML Worker

Now that your templates work and your block renders correctly, configure the worker to generate pages automatically.

**Open**: [https://tools.aem.live/tools/admin-edit/](https://tools.aem.live/tools/admin-edit/)

### Configure the Admin Edit Tool:

1. **Admin URL**: Enter this exact URL (replace `jsmith` with your branch name):
   ```
   https://json2html.adobeaem.workers.dev/config/cloudadoption/nycmasterclass/jsmith
   ```

2. **Method**: Select **POST**

3. **Body**: Enter this JSON configuration (replace `jsmith` with your name in the template paths):
   ```json
   [
     {
       "path": "/events/list",
       "endpoint": "https://main--nycmasterclass--cloudadoption.aem.page/future-events.json",
       "arrayKey": "data",
       "template": "/drafts/jsmith/templates/events-template"
     },
     {
       "path": "/events/",
       "endpoint": "https://main--nycmasterclass--cloudadoption.aem.page/future-events.json",
       "arrayKey": "data",
       "pathKey": "URL",
       "template": "/drafts/jsmith/templates/event-template"
     }
   ]
   ```

4. **Authorization**: The tool will prompt for your admin token. Enter the token provided by the instructor.

5. **Click "POST"**

**You should see**: Success response (200 OK) confirming the configuration was saved.

**What this configuration does**:

| Config | List Page | Detail Pages |
|--------|-----------|--------------|
| **path** | `/events/list` — exact match for the list page | `/events/` — matches all other `/events/*` paths |
| **endpoint** | Same JSON data source | Same JSON data source |
| **arrayKey** | `data` — all records available to template | `data` — all records available to filter |
| **pathKey** | *(omitted)* — no filtering, template gets all records | `URL` — filters to matching record |
| **template** | `events-template` — loops and renders cards | `event-template` — renders single event |

**Important**: The `/events/list` config must come **before** `/events/` in the array. The worker matches top-to-bottom, and `/events/` would match `/events/list` if it came first.

**Key insight**: The worker is **branch-aware**. Your branch (`jsmith`) will use **your templates** while main branch uses different templates. Zero conflicts!

---

## Step 6: Preview Generated Pages

Now test that the worker is generating pages from your templates!

### Test the List Page

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
- Each card has: image, city name, date, venue, description, "View Details" link
- Clicking "View Details" navigates to the detail page

### Test the Detail Pages

**Open in browser** (replace `jsmith` with your branch name):
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/events/sydney
```

**You should see**:
- Hero section with full-width image, city name, date, registration button
- "About This Event" section with description
- "Event Details" section with location, address, date
- "What's Included" section with highlights
- "Back to All Events" link

**Test all 6 cities**:
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/sydney`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/london`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/bangalore`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/berlin`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/singapore`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/dubai`

**All 7 pages work!** (1 list + 6 detail) — No manual page creation needed.

**Debug if needed**:
- If you see "Not Found", check your config path patterns and ordering
- If template doesn't render, verify template path in config matches DA.live path
- If data is missing, check `arrayKey` and `pathKey` settings
- If grid doesn't work, verify all event blocks are in one section (no `---` between them in list template)
- View browser DevTools console for errors

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

**What lives in DA.live** (not committed):
- `/drafts/jsmith/templates/events-template` — List page Mustache template
- `/drafts/jsmith/templates/event-template` — Detail page Mustache template

**What lives in the worker service** (not committed):
- JSON2HTML worker configuration (path patterns, endpoints, templates)

---

## Understanding the EDS DOM Structure

This section explains how EDS decorates the HTML generated by your templates. Understanding this is crucial for writing correct CSS selectors.

### Input (from JSON2HTML worker):
```html
<div>
  <div class="event">...</div>
  <div class="event">...</div>
  <div class="event">...</div>
</div>
```

### After EDS decoration:
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
4. The `block` class and `data-block-name` are added by EDS to each event

**This is why the CSS selectors target**:
- `main .section.event-container:has(> .event-wrapper ~ .event-wrapper)` → multiple wrappers = grid
- `main .section.event-container > .event-wrapper:only-child` → single wrapper = detail view

---

## Real-World Applications

**Use Case 1: Multi-City Event Series** (this exercise!)
- **Scenario**: Masterclass events in 6+ cities with list + detail views
- **Data**: Single JSON with all event details
- **Templates**: Two Mustache templates (list + detail)
- **Block**: One `event` block handles both views
- **Result**: Add new city → just update JSON, both list and detail auto-generate
- **Scale**: Hundreds of events without manual authoring

**Use Case 2: Product Catalogs**
- **Scenario**: E-commerce site with 1000+ products
- **Data**: Products JSON or API (SKU, price, specs, images)
- **Templates**: Product grid template + product detail template
- **URL Pattern**: `/products/` (list) + `/products/laptop-model-123` (detail)
- **Result**: 2 templates → 1000+ product pages + browse pages

**Use Case 3: Speaker/Author Profiles**
- **Scenario**: Conference with 100+ speakers
- **Data**: Speakers JSON (name, bio, photo, sessions)
- **Templates**: Speaker directory template + speaker profile template
- **URL Pattern**: `/speakers/` (grid) + `/speakers/john-doe` (profile)
- **Result**: Dynamic speaker pages from central data

**Use Case 4: Store Locator**
- **Scenario**: Retail chain with 500+ locations
- **Data**: Locations JSON (address, hours, services)
- **Templates**: Store list template + store detail template
- **URL Pattern**: `/stores/` (list) + `/stores/new-york-manhattan` (detail)
- **Result**: Individual pages for each store + browsable directory

**Common benefits**:
- **Two templates, unlimited pages** — list + detail from one data source
- **Update template once → all pages update**
- **Add data → pages auto-generate** (both list and detail)
- **No custom deployment - hosted worker**
- **Branch-aware for safe testing**
- **One block handles both views** — less code to maintain

---

## Advanced Patterns

### Multiple Path Configurations

You can configure different templates for different URL patterns:

```json
[
  {
    "path": "/events/list",
    "endpoint": "...",
    "arrayKey": "data",
    "template": "/templates/events-template"
  },
  {
    "path": "/events/",
    "endpoint": "...",
    "arrayKey": "data",
    "pathKey": "URL",
    "template": "/templates/event-template"
  },
  {
    "path": "/speakers/",
    "endpoint": "...",
    "template": "/templates/speaker-template"
  }
]
```

**Remember**: More specific paths must come before general ones in the array.

### Dynamic Data Sources

The `endpoint` can be:
- Static JSON file (like this exercise)
- Edge Delivery Sheet JSON (`.json` from any Sheet)
- External API (with authentication headers)
- Worker-transformed data (pre-process JSON)

### CSS Grid Alternatives

If you want the grid to auto-size based on available space instead of fixed breakpoints:

```css
main .section.event-container:has(> .event-wrapper ~ .event-wrapper) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}
```

This creates as many columns as fit, with each card being at least 350px wide.

---

## Key Takeaways

- **JSON2HTML worker** transforms JSON data into HTML pages using Mustache templates
- **Two templates** — use a list template (loops with `{{#data}}`) and a detail template (single record)
- **One block, two views** — the `event` block decorates both list cards and detail pages
- **CSS `:has()` selector** — detect list vs. detail by counting `.event-wrapper` children in the section
- **EDS DOM structure** — `.event-wrapper` elements are direct children of `.section` (no intermediate div)
- **Responsive grid** — 1 column mobile, 2 tablet, 3 desktop using CSS Grid with media queries
- **Mustache syntax** is logic-less and simple: `{{variable}}`, `{{#array}}...{{/array}}`
- **Branch-aware** — Test on your branch without affecting production
- **Worker config ordering matters** — specific paths before general ones
- **Scale effortlessly** — 6 events or 600, same templates

**The pattern**:
1. Data in JSON (Sheet, API, or file)
2. Two templates in DA.live (list + detail, with Mustache syntax)
3. One block in code (handles both views with smart CSS)
4. Worker config (path patterns, endpoints, templates)
5. Pages generate automatically — list and detail

---

## Verification Checklist

- [ ] **Created `event` block** — `blocks/event/event.js` and `blocks/event/event.css`
- [ ] **Created list Mustache template** in DA.live at `/drafts/jsmith/templates/events-template`
- [ ] **Created detail Mustache template** in DA.live at `/drafts/jsmith/templates/event-template`
- [ ] **Tested in simulator** with real `future-events.json` data (both templates)
- [ ] **Tested locally** with static HTML files in `drafts/events/`
- [ ] **Configured worker** using Admin Edit tool with both path configs
- [ ] **List page renders** at `/events/list` with responsive grid (1/2/3 columns)
- [ ] **All 6 detail pages render** (`/events/sydney`, `/events/london`, etc.)
- [ ] **Data populates correctly** (city, date, venue, highlights, images)
- [ ] **Navigation works** — list → detail via "View Details" link, detail → list via "Back" link
- [ ] **Committed and pushed** the `event` block code
- [ ] **Understand EDS DOM** — `.event-wrapper` as direct children of `.section`
- [ ] **Understand worker config** — path ordering, arrayKey, pathKey, template

---

## References

- **[JSON2HTML Documentation](https://www.aem.live/developer/json2html)** - Complete worker documentation
- **[JSON2HTML Simulator](https://tools.aem.live/tools/json2html-simulator/)** - Test templates with live data
- **[Admin Edit Tool](https://tools.aem.live/tools/admin-edit/)** - Configure worker settings
- **[Mustache Documentation](https://mustache.github.io/mustache.5.html)** - Template syntax reference
- **[EDS Markup Reference](https://www.aem.live/developer/markup-sections-blocks)** - How EDS decorates HTML into sections and blocks
- **[CSS :has() Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)** - MDN reference for the :has() pseudo-class

---

## Troubleshooting

**List page shows cards in one column (no grid)**:
- Verify all `<div class="event">` blocks are inside **one section** (one parent `<div>`)
- Check that there are no `---` section dividers between event blocks in the list template
- Confirm `.event-wrapper` elements are direct children of `.section` (inspect in DevTools)
- The CSS selector `main .section.event-container:has(> .event-wrapper ~ .event-wrapper)` requires 2+ wrappers at the same level

**Pages show "Not Found"**:
- Verify your worker config path patterns match the URL
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

---

## Next Exercise

**Exercise 6**: Workers and API Integration - You'll learn how to use Cloudflare Workers to transform data, secure APIs, and add custom logic to your Edge Delivery Services site.
